// Concept 08 QA harness: screenshots, console/network audits, CTA checks,
// regression sweep over every route. Run with the prod server on :3000.
// Usage: node scripts/qa-onetap.mjs <out-dir>
import { chromium } from "playwright";
import { mkdirSync } from "fs";

const OUT = process.argv[2] || "qa-shots";
mkdirSync(OUT, { recursive: true });
const BASE = "http://localhost:3000";

const issues = [];
const note = (s) => { issues.push(s); console.log("ISSUE:", s); };

const browser = await chromium.launch();

async function auditPage(page, label) {
  const errors = [];
  const failed = [];
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  page.on("requestfailed", (r) => {
    // net::ERR_ABORTED on video is expected when we block; otherwise report.
    failed.push(`${r.url()} :: ${r.failure()?.errorText}`);
  });
  page.on("response", (r) => { if (r.status() >= 400) failed.push(`${r.url()} :: HTTP ${r.status()}`); });
  return {
    done: () => {
      errors.forEach((e) => note(`[${label}] console error: ${e}`));
      failed.forEach((f) => note(`[${label}] request failed: ${f}`));
    },
  };
}

/* ---------- 1. Regression sweep: every route renders, no errors ---------- */
const ROUTES = ["/", "/concepts/latest", "/concepts/video-hero", "/concepts/machine",
  "/concepts/pulse", "/concepts/cinema", "/concepts/coming-soon", "/concepts/flow", "/concepts/one-tap"];
for (const route of ROUTES) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const audit = await auditPage(page, `regression ${route}`);
  const res = await page.goto(BASE + route, { waitUntil: "networkidle", timeout: 45000 }).catch((e) => { note(`[${route}] goto failed: ${e.message}`); return null; });
  if (res && res.status() >= 400) note(`[${route}] HTTP ${res.status()}`);
  await page.waitForTimeout(1200);
  const slug = route === "/" ? "hub" : route.split("/").pop();
  await page.screenshot({ path: `${OUT}/reg-${slug}.png` });
  audit.done();
  await page.close();
}

/* ---------- 2. One-tap: viewport matrix, AR + EN ---------- */
const VIEWPORTS = [
  ["1920x1080", 1920, 1080], ["1440x900", 1440, 900], ["1280x800", 1280, 800],
  ["1024x768", 1024, 768], ["768x1024", 768, 1024],
  ["430x932", 430, 932], ["390x844", 390, 844], ["360x800", 360, 800],
];
for (const [name, w, h] of VIEWPORTS) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  const audit = await auditPage(page, `one-tap ${name}`);
  await page.goto(`${BASE}/concepts/one-tap`, { waitUntil: "networkidle", timeout: 45000 });
  await page.waitForTimeout(2000);
  // Horizontal overflow probe (html overflow-x would mask it — measure widths).
  const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  if (over > 1) note(`[one-tap ${name}] horizontal overflow: ${over}px`);
  await page.screenshot({ path: `${OUT}/ot-${name}-ar-hero.png` });
  // Mid-scroll act shots (AR), from the top of each act.
  for (const [act, sel] of [["action", "#action"], ["fleet", "#fleet"], ["control", "#control"], ["machines", "#machines"], ["close", "#demo"], ["footer", ".onetap .foot"]]) {
    await page.evaluate((s) => document.querySelector(s)?.scrollIntoView({ block: s === "#control" ? "start" : "center" }), sel);
    await page.waitForTimeout(1400);
    await page.screenshot({ path: `${OUT}/ot-${name}-ar-${act}.png` });
  }
  // Scrollbar regression: html must be the ONLY vertical scroll container,
  // in this loaded state and mid-page.
  const rogue = await page.evaluate(() =>
    [...document.querySelectorAll("*"), document.body]
      .filter((el) => {
        const cs = getComputedStyle(el);
        if (!["auto", "scroll"].includes(cs.overflowY)) return false;
        if (el.scrollHeight <= el.clientHeight + 1) return false;
        return el !== document.documentElement;
      })
      .map((el) => `${el.tagName}.${String(el.className).slice(0, 60)}`)
  );
  rogue.forEach((r) => note(`[one-tap ${name}] rogue vertical scroll container: ${r}`));
  // EN pass on key viewports only.
  if (["1440x900", "390x844"].includes(name)) {
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.click(".onetap .lang");
    await page.waitForTimeout(800);
    await page.screenshot({ path: `${OUT}/ot-${name}-en-hero.png` });
    await page.evaluate((s) => document.querySelector(s)?.scrollIntoView({ block: "start" }), "#demo");
    await page.waitForTimeout(1200);
    await page.screenshot({ path: `${OUT}/ot-${name}-en-close.png` });
  }
  audit.done();
  await page.close();
}

/* ---------- 3. Reduced motion ---------- */
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  const audit = await auditPage(page, "one-tap reduced-motion");
  await page.goto(`${BASE}/concepts/one-tap`, { waitUntil: "networkidle", timeout: 45000 });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${OUT}/ot-reduced-hero.png` });
  const videoCount = await page.locator(".onetap .hero video").count();
  if (videoCount > 0) note(`[reduced-motion] hero video element present (${videoCount}) — expected poster-only hero`);
  await page.evaluate((s) => document.querySelector(s)?.scrollIntoView({ block: "center" }), "#fleet");
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${OUT}/ot-reduced-fleet.png` });
  await page.evaluate((s) => document.querySelector(s)?.scrollIntoView({ block: "start" }), "#control");
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${OUT}/ot-reduced-control.png` });
  audit.done();
  await page.close();
}

/* ---------- 3b. Scrollbar regression DURING media load (the original bug's
   exact reproduction: throttled network, probe while the films stream) ---------- */
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const cdp = await page.context().newCDPSession(page);
  await cdp.send("Network.emulateNetworkConditions", {
    offline: false, latency: 40, downloadThroughput: (1.2 * 1024 * 1024) / 8, uploadThroughput: 256 * 1024,
  });
  await page.goto(`${BASE}/concepts/one-tap`, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(1200); // hero film still streaming at ~1.2Mbps
  const probe = await page.evaluate(() => ({
    rogue: [...document.querySelectorAll("*"), document.body]
      .filter((el) => {
        const cs = getComputedStyle(el);
        return ["auto", "scroll"].includes(cs.overflowY) &&
          el.scrollHeight > el.clientHeight + 1 && el !== document.documentElement;
      })
      .map((el) => `${el.tagName}.${String(el.className).slice(0, 60)}`),
    bodyOverflowY: getComputedStyle(document.body).overflowY,
  }));
  probe.rogue.forEach((r) => note(`[during-load] rogue vertical scroll container: ${r}`));
  if (["auto", "scroll"].includes(probe.bodyOverflowY)) note(`[during-load] body overflow-y is ${probe.bodyOverflowY} — must never be a scroll container`);
  await page.screenshot({ path: `${OUT}/ot-during-load.png` });
  await page.close();
}

/* ---------- 4. Video failure fallback ---------- */
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.route("**/*.mp4", (r) => r.abort());
  await page.goto(`${BASE}/concepts/one-tap`, { waitUntil: "load", timeout: 45000 });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: `${OUT}/ot-novideo-hero.png` });
  const posterVisible = await page.locator(".onetap .hero-poster").isVisible();
  if (!posterVisible) note("[no-video] hero poster not visible with mp4 blocked");
  const ctaVisible = await page.locator(".onetap .hero .cta-warm").first().isVisible();
  if (!ctaVisible) note("[no-video] hero CTA not visible with mp4 blocked");
  await page.close();
}

/* ---------- 5. CTA + keyboard audit ---------- */
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(`${BASE}/concepts/one-tap`, { waitUntil: "networkidle", timeout: 45000 });
  const hrefs = await page.$$eval(".onetap a.cta-warm", (as) => as.map((a) => a.getAttribute("href")));
  for (const h of hrefs) {
    if (!(h === "#demo" || (h && h.startsWith("https://wa.me/966550796555")))) note(`CTA href unexpected: ${h}`);
  }
  const waCount = hrefs.filter((h) => h && h.startsWith("https://wa.me/966550796555")).length;
  if (waCount < 1) note("no wa.me CTA found");
  // Widget present?
  const widget = await page.locator(".wa .wa-btn").getAttribute("href");
  if (!widget || !widget.startsWith("https://wa.me/966550796555")) note(`WhatsApp widget href: ${widget}`);
  // Keyboard: tab to the first CTA and confirm focus is visible.
  await page.keyboard.press("Tab"); // brand
  await page.keyboard.press("Tab"); // lang
  await page.keyboard.press("Tab"); // nav CTA
  const focused = await page.evaluate(() => {
    const el = document.activeElement;
    return el ? `${el.tagName}.${el.className}` : "none";
  });
  console.log("3rd tab stop:", focused);
  await page.screenshot({ path: `${OUT}/ot-focus.png` });
  await page.close();
}

await browser.close();
console.log(`\n${issues.length} issue(s).`);
issues.forEach((i) => console.log(" -", i));
