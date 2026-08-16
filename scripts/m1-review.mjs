/**
 * Milestone 1 review harness.
 *
 * Boots the production server, then produces every artefact the milestone review
 * asks for: viewport screenshots in AR + EN, the full geofence interaction
 * sequence, reduced-motion and no-JS renders, throttled mid-tier performance
 * numbers, an axe accessibility pass, and the crop test.
 *
 *   node scripts/m1-review.mjs
 *
 * Output: docs/redesign-2026/milestone-1/
 */

import { chromium, devices } from "playwright";
import { AxeBuilder } from "@axe-core/playwright";
import { spawn } from "node:child_process";
import { mkdir, writeFile, access } from "node:fs/promises";
import path from "node:path";

const PORT = 3411;
const BASE = `http://127.0.0.1:${PORT}`;
const ROUTE = "/redesign";
/* Output directory. REQUIRED and must not already exist.
   Prior review folders are immutable: a run may never delete or overwrite one.
   Usage: M1_OUT=docs/redesign-2026/milestone-1.2 node scripts/m1-review.mjs */
const OUT = path.resolve(
  process.env.M1_OUT ||
    (() => { throw new Error("M1_OUT is required — name a NEW output directory"); })(),
);
const SHOTS = path.join(OUT, "shots");

/** Choreography runs 6.4s; settle past it before capturing the resolved state. */
const RESOLVED = 7600;

const VIEWPORTS = [
  { name: "01-desktop-1920", w: 1920, h: 1080, dpr: 1 },
  { name: "02-desktop-1440", w: 1440, h: 900,  dpr: 2 },
  { name: "03-laptop-1280",  w: 1280, h: 800,  dpr: 2 },
  { name: "04-tablet-1024",  w: 1024, h: 768,  dpr: 2 },
  { name: "05-ipad-834",     w: 834,  h: 1112, dpr: 2 },
  { name: "06-phone-430",    w: 430,  h: 932,  dpr: 3 },
  { name: "07-phone-390",    w: 390,  h: 844,  dpr: 3 },
  { name: "08-android-360",  w: 360,  h: 800,  dpr: 2 },
];

const log = (...a) => console.log("·", ...a);

const failures = [];
/** A check that finds zero target elements is a broken check, not a pass. */
function expectAtLeast(label, actual, min) {
  if (typeof actual !== "number" || actual < min) {
    failures.push(`${label}: expected >= ${min}, got ${actual}`);
    log(`FAIL  ${label}: expected >= ${min}, got ${actual}`);
    return false;
  }
  log(`ok    ${label}: ${actual}`);
  return true;
}

/** Kill the whole process tree — on Windows `next start` is a grandchild and a
 *  plain kill() leaves it listening, which lets a later run attach to a stale
 *  build and report results that are quietly wrong. */
function killTree(pid) {
  if (!pid) return;
  try {
    if (process.platform === "win32") {
      spawn("taskkill", ["/pid", String(pid), "/f", "/t"], { stdio: "ignore" });
    } else {
      process.kill(-pid, "SIGKILL");
    }
  } catch {}
}

async function waitForServer(url, timeoutMs = 90000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const r = await fetch(url);
      if (r.ok) return true;
    } catch {}
    await new Promise((r) => setTimeout(r, 400));
  }
  throw new Error(`server never came up at ${url}`);
}

async function main() {
  // Immutability guard: refuse to run into an existing directory. Nothing in this
  // script deletes anything, ever — a previous run's evidence is not ours to touch.
  let exists = true;
  try { await access(OUT); } catch { exists = false; }
  if (exists) {
    throw new Error(
      `refusing to run: ${OUT} already exists.
` +
      `Previous review folders are immutable. Pass a fresh M1_OUT.`,
    );
  }
  await mkdir(SHOTS, { recursive: true });

  log("starting production server…");
  // Spawn Next's own JS entry with this node binary: no shell, so the child is a
  // direct descendant we can actually kill. (`npx.cmd` + shell:true orphans the
  // server, and a later run then silently attaches to a stale build.)
  const server = spawn(
    process.execPath,
    [path.resolve("node_modules/next/dist/bin/next"), "start", "-p", String(PORT)],
    { stdio: "ignore" },
  );
  await waitForServer(BASE + ROUTE);
  log("server up on", BASE);

  const browser = await chromium.launch();
  const report = { generatedAt: new Date().toISOString(), viewports: [], perf: {}, a11y: {}, notes: [] };

  try {
    /* ── 1. Viewport sweep, AR + EN ─────────────────────────────────────── */
    for (const vp of VIEWPORTS) {
      for (const lang of ["ar", "en"]) {
        const ctx = await browser.newContext({
          viewport: { width: vp.w, height: vp.h },
          deviceScaleFactor: vp.dpr,
          reducedMotion: "no-preference",
        });
        const page = await ctx.newPage();
        await page.goto(BASE + ROUTE, { waitUntil: "networkidle" });

        if (lang === "en") {
          await page.getByRole("button", { name: /toggle language/i }).click();
        }
        await page.waitForTimeout(RESOLVED);

        const file = path.join(SHOTS, `${vp.name}-${lang}.png`);
        await page.screenshot({ path: file });
        log("shot", `${vp.name}-${lang}`);

        if (lang === "ar") {
          // Horizontal-overflow probe: the classic RTL regression.
          const overflow = await page.evaluate(() =>
            Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth),
          );
          report.viewports.push({ ...vp, overflowPx: overflow });
          if (overflow > 0) report.notes.push(`OVERFLOW ${overflow}px at ${vp.name}`);
        }
        await ctx.close();
      }
    }

    /* ── 2. Choreography beats ──────────────────────────────────────────── */
    {
      const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
      const page = await ctx.newPage();
      await page.goto(BASE + ROUTE, { waitUntil: "networkidle" });
      const beats = [
        [80, "beat-1-first-paint"],
        [700, "beat-2-sweep"],
        [1300, "beat-3-scale"],
        [1900, "beat-4-rails"],
        [3600, "beat-5-resolving"],
        [5600, "beat-6-breach"],
        [6900, "beat-7-restored"],
      ];
      // Absolute deadlines from navigation. Cumulative waits drift badly here —
      // each screenshot costs 200-400ms, so by the seventh beat the page has run
      // ~1.5s past where the label claims, which silently captured the wrong state.
      const t0 = Date.now();
      for (const [at, name] of beats) {
        const remaining = at - (Date.now() - t0);
        if (remaining > 0) await page.waitForTimeout(remaining);
        await page.screenshot({ path: path.join(SHOTS, `choreo-${name}.png`) });
        log("beat", name, `@${Date.now() - t0}ms`);
      }
      await ctx.close();
    }

    /* ── 2b. The breach acting on the Horizon itself ────────────────────── */
    {
      const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
      const page = await ctx.newPage();
      await page.goto(BASE + ROUTE, { waitUntil: "networkidle" });
      const seq = [
        [4700, "seq-1-normal"],
        [5150, "seq-2-detected"],
        [5600, "seq-3-isolated"],
        [6300, "seq-4-stopped"],
        [7400, "seq-5-recovered"],
      ];
      const t0 = Date.now();
      for (const [at, name] of seq) {
        const remaining = at - (Date.now() - t0);
        if (remaining > 0) await page.waitForTimeout(remaining);
        await page.screenshot({
          path: path.join(SHOTS, `horizon-${name}.png`),
          clip: { x: 80, y: 330, width: 1280, height: 300 },
        });
        log("horizon", name, `@${Date.now() - t0}ms`);
      }
      await ctx.close();
    }

    /* ── 2c. Repetition tests: the grammar outside the hero ─────────────── */
    {
      const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
      const page = await ctx.newPage();
      await page.goto(BASE + ROUTE, { waitUntil: "networkidle" });
      await page.waitForTimeout(RESOLVED);

      expectAtLeast("rail: brass segments", await page.locator(".sr-seg").count(), 9);
      expectAtLeast("rail: branch nodes", await page.locator(".sr-node").count(), 9);
      expectAtLeast("divider: spine segments", await page.locator(".jr-seg").count(), 4);
      expectAtLeast("divider: peg head", await page.locator(".jr-head").count(), 1);
      expectAtLeast("divider: peg stem", await page.locator(".jr-stem").count(), 1);
      expectAtLeast("favicon: svg icon link",
        await page.locator('link[rel="icon"][href*="mark.svg"]').count(), 1);

      await page.locator(".spine-rail").screenshot({ path: path.join(SHOTS, "rep-1-rail-top.png") });

      // Rail at 60% scroll, to prove progress travels along the segments.
      await page.evaluate(() => {
        const d = document.documentElement;
        window.scrollTo(0, (d.scrollHeight - d.clientHeight) * 0.6);
      });
      await page.waitForTimeout(400);
      await page.locator(".spine-rail").screenshot({ path: path.join(SHOTS, "rep-1-rail-60pct.png") });

      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(300);
      await page.locator(".divider-slot").screenshot({ path: path.join(SHOTS, "rep-2-divider.png") });
      await ctx.close();

      // The rail and divider are small by design; capture them at 4x so the
      // repetition sheet can show the grammar rather than a grey smear.
      const hi = await browser.newContext({ viewport: { width: 900, height: 900 }, deviceScaleFactor: 4 });
      const hp = await hi.newPage();
      await hp.goto(BASE + ROUTE, { waitUntil: "networkidle" });
      await hp.waitForTimeout(RESOLVED);
      await hp.evaluate(() => {
        const d = document.documentElement;
        window.scrollTo(0, (d.scrollHeight - d.clientHeight) * 0.55);
      });
      await hp.waitForTimeout(400);
      await hp.locator(".spine-rail").screenshot({ path: path.join(SHOTS, "rep-1-rail-4x.png") });
      await hp.evaluate(() => window.scrollTo(0, 0));
      await hp.waitForTimeout(300);
      await hp.locator(".divider-slot").screenshot({ path: path.join(SHOTS, "rep-2-divider-4x.png") });
      await hi.close();
      log("repetition captures written");
    }

    /* ── 3. The geofence interaction, step by step ──────────────────────── */
    for (const [label, vpName, vp] of [
      ["desktop", "1440", { width: 1440, height: 900 }],
      ["mobile", "390", { width: 390, height: 844 }],
    ]) {
      const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: 2, hasTouch: label === "mobile" });
      const page = await ctx.newPage();
      await page.goto(BASE + ROUTE, { waitUntil: "networkidle" });
      await page.waitForTimeout(RESOLVED);

      const stage = page.locator(".radar-stage");
      await stage.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      await page.screenshot({ path: path.join(SHOTS, `geo-${label}-1-rest.png`) });

      const machine = page.locator(".r-machine");
      const box = await machine.boundingBox();
      const stageBox = await stage.boundingBox();
      const cx = box.x + box.width / 2;
      const cy = box.y + box.height / 2;

      await page.mouse.move(cx, cy);
      await page.mouse.down();
      // Drag to just inside the ring first
      await page.mouse.move(cx + stageBox.width * 0.18, cy, { steps: 12 });
      await page.screenshot({ path: path.join(SHOTS, `geo-${label}-2-inside.png`) });
      // Then across the boundary
      await page.mouse.move(cx + stageBox.width * 0.46, cy, { steps: 18 });
      await page.waitForTimeout(320);
      await page.screenshot({ path: path.join(SHOTS, `geo-${label}-3-breach.png`) });

      const frozen = await page.locator(".r-meter .m-v span").innerText();
      await page.waitForTimeout(1200);
      const stillFrozen = await page.locator(".r-meter .m-v span").innerText();

      await page.mouse.up();
      await page.waitForTimeout(1100);
      await page.screenshot({ path: path.join(SHOTS, `geo-${label}-4-recovered.png`) });
      const resumed = await page.locator(".r-meter .m-v span").innerText();

      const n = (s) => Number(String(s).replace(/[^\d]/g, ""));
      report[`geofence_${label}`] = {
        frozenAt: frozen,
        afterHolding1_2s: stillFrozen,
        counterHeldSteady: frozen === stillFrozen,
        afterRecovery: resumed,
        resumedFromFrozenNotZero: n(resumed) >= n(frozen),
      };
      log(`geofence ${label}: frozen=${frozen} held=${frozen === stillFrozen} resumed=${resumed}`);
      await ctx.close();
    }

    /* ── 4. Reduced motion + no-JS ──────────────────────────────────────── */
    {
      const ctx = await browser.newContext({
        viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, reducedMotion: "reduce",
      });
      const page = await ctx.newPage();
      await page.goto(BASE + ROUTE, { waitUntil: "networkidle" });
      await page.waitForTimeout(900);
      await page.screenshot({ path: path.join(SHOTS, "state-reduced-motion.png") });
      const lit = await page.locator('.pg[data-resolved="1"]').count();
      const breached = await page.locator('.pg[data-state="breach"]').count();
      report.reducedMotion = { pegsResolvedImmediately: lit, breachPresentAtFirstPaint: breached };
      expectAtLeast("reduced-motion pegs resolved", lit, 97);
      expectAtLeast("reduced-motion breach present", breached, 1);
      await ctx.close();
    }
    {
      const ctx = await browser.newContext({
        viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, javaScriptEnabled: false,
      });
      const page = await ctx.newPage();
      await page.goto(BASE + ROUTE, { waitUntil: "load" });
      await page.waitForTimeout(600);
      await page.screenshot({ path: path.join(SHOTS, "state-no-js.png") });
      const heads = await page.locator(".h-frame .pg-head").count();
      const spines = await page.locator(".h-frame .h-seg").count();
      report.noJs = { pegsRendered: heads, branchSegments: spines };
      expectAtLeast("no-JS pegs rendered", heads, 97);
      expectAtLeast("no-JS branch segments", spines, 9);
      await ctx.close();
    }

    /* ── 5. Crop test — hero crops with the logo removed ────────────────── */
    {
      const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
      const page = await ctx.newPage();
      await page.goto(BASE + ROUTE, { waitUntil: "networkidle" });
      await page.waitForTimeout(RESOLVED);
      await page.evaluate(() => {
        document.querySelector(".mast-brand")?.remove();
        document.querySelectorAll(".display, .lede").forEach((el) => el.remove());
      });
      await page.waitForTimeout(200);
      await page.screenshot({ path: path.join(SHOTS, "crop-1-no-logo-no-words.png"), clip: { x: 0, y: 0, width: 1440, height: 620 } });
      await page.screenshot({ path: path.join(SHOTS, "crop-2-instrument-only.png"), clip: { x: 120, y: 180, width: 1000, height: 400 } });
      await ctx.close();
    }
    {
      const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3 });
      const page = await ctx.newPage();
      await page.goto(BASE + ROUTE, { waitUntil: "networkidle" });
      await page.waitForTimeout(RESOLVED);
      await page.evaluate(() => {
        document.querySelector(".mast-brand")?.remove();
        document.querySelectorAll(".display, .lede").forEach((el) => el.remove());
      });
      await page.screenshot({ path: path.join(SHOTS, "crop-3-mobile-no-logo.png") });
      await ctx.close();
    }

    /* ── 6. Performance on a throttled mid-tier profile ─────────────────── */
    {
      const ctx = await browser.newContext({ viewport: { width: 360, height: 800 }, deviceScaleFactor: 2 });
      const page = await ctx.newPage();
      const client = await ctx.newCDPSession(page);
      // Moto G Power class: 4x CPU slowdown, Fast 3G.
      await client.send("Emulation.setCPUThrottlingRate", { rate: 4 });
      await client.send("Network.enable");
      await client.send("Network.emulateNetworkConditions", {
        offline: false,
        latency: 150,
        downloadThroughput: (1.6 * 1024 * 1024) / 8,
        uploadThroughput: (750 * 1024) / 8,
        connectionType: "cellular3g",
      });

      let transferred = 0;
      page.on("response", async (res) => {
        try {
          const len = Number(res.headers()["content-length"] ?? 0);
          transferred += len || 0;
        } catch {}
      });

      await page.goto(BASE + ROUTE, { waitUntil: "load" });
      await page.waitForTimeout(RESOLVED);

      const vitals = await page.evaluate(
        () =>
          new Promise((resolve) => {
            const out = { lcp: 0, cls: 0 };
            new PerformanceObserver((l) => {
              const e = l.getEntries();
              out.lcp = e[e.length - 1].startTime;
            }).observe({ type: "largest-contentful-paint", buffered: true });
            let cls = 0;
            new PerformanceObserver((l) => {
              for (const entry of l.getEntries()) if (!entry.hadRecentInput) cls += entry.value;
              out.cls = cls;
            }).observe({ type: "layout-shift", buffered: true });
            const nav = performance.getEntriesByType("navigation")[0];
            setTimeout(
              () =>
                resolve({
                  ...out,
                  ttfb: nav?.responseStart ?? 0,
                  domContentLoaded: nav?.domContentLoadedEventEnd ?? 0,
                  lcpElement: undefined,
                }),
              800,
            );
          }),
      );

      const lcpEl = await page.evaluate(() => {
        const list = performance.getEntriesByType("largest-contentful-paint");
        const last = list[list.length - 1];
        return last?.element?.className || last?.element?.tagName || "unknown";
      });

      // Interaction latency on the drag, measured on the throttled profile.
      const stage = page.locator(".radar-stage");
      await stage.scrollIntoViewIfNeeded();
      await page.waitForTimeout(400);
      const inp = await page.evaluate(async () => {
        const machine = document.querySelector(".r-machine");
        const r = machine.getBoundingClientRect();
        const t0 = performance.now();
        machine.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, clientX: r.x + r.width / 2, clientY: r.y + r.height / 2, pointerId: 1 }));
        window.dispatchEvent(new PointerEvent("pointermove", { bubbles: true, clientX: r.x + 400, clientY: r.y, pointerId: 1 }));
        await new Promise((res) => requestAnimationFrame(() => requestAnimationFrame(res)));
        const t1 = performance.now();
        window.dispatchEvent(new PointerEvent("pointerup", { bubbles: true, pointerId: 1 }));
        return t1 - t0;
      });

      report.perf = {
        profile: "4x CPU throttle · Fast 3G (1.6Mbps/150ms) · 360x800 @2x",
        lcpMs: Math.round(vitals.lcp),
        lcpElement: lcpEl,
        cls: Number(vitals.cls.toFixed(4)),
        ttfbMs: Math.round(vitals.ttfb),
        breachInteractionMs: Math.round(inp),
        transferBytesApprox: transferred,
      };
      log("perf", JSON.stringify(report.perf));
      await ctx.close();
    }

    /* ── 7. Accessibility ───────────────────────────────────────────────── */
    for (const lang of ["ar", "en"]) {
      const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
      const page = await ctx.newPage();
      await page.goto(BASE + ROUTE, { waitUntil: "networkidle" });
      if (lang === "en") await page.getByRole("button", { name: /toggle language/i }).click();
      await page.waitForTimeout(RESOLVED);
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();
      report.a11y[lang] = {
        violations: results.violations.map((v) => ({
          id: v.id, impact: v.impact, help: v.help, nodes: v.nodes.length,
        })),
        passes: results.passes.length,
      };
      log(`axe ${lang}: ${results.violations.length} violations`);
      await ctx.close();
    }

    report.failures = failures;
    report.passed = failures.length === 0;
    await writeFile(path.join(OUT, "report.json"), JSON.stringify(report, null, 2), "utf8");
    log("wrote report.json");
    if (failures.length) {
      console.error(`
${failures.length} CHECK(S) FAILED:`);
      failures.forEach((f) => console.error("  -", f));
    }
  } finally {
    await browser.close();
    killTree(server.pid);
  }

  console.log("\nDone →", OUT);
}

main().catch((e) => { console.error(e); process.exit(1); });
