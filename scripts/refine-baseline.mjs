// Refinement-pass baseline captures + scrollbar diagnosis.
// Usage: node scripts/refine-baseline.mjs <out-dir>
import { chromium } from "playwright";
import { mkdirSync } from "fs";

const OUT = process.argv[2] || "refine-before";
mkdirSync(OUT, { recursive: true });
const URL = "http://localhost:3000/concepts/one-tap";

const browser = await chromium.launch();

const VIEWPORTS = [["1920x1080", 1920, 1080], ["1440x900", 1440, 900], ["430x932", 430, 932], ["390x844", 390, 844]];

for (const [name, w, h] of VIEWPORTS) {
  for (const lang of ["ar", "en"]) {
    const page = await browser.newPage({ viewport: { width: w, height: h } });
    await page.goto(URL, { waitUntil: "networkidle", timeout: 45000 });
    if (lang === "en") { await page.click(".onetap .lang"); await page.waitForTimeout(600); }
    await page.waitForTimeout(1200);
    await page.screenshot({ path: `${OUT}/base-${name}-${lang}-hero.png` });
    // full page capture for rhythm audit
    if (name === "1440x900" || name === "390x844") {
      await page.screenshot({ path: `${OUT}/base-${name}-${lang}-full.png`, fullPage: true });
    }
    await page.close();
  }
}

/* ---- scrollbar diagnosis: probe scrollable elements DURING media load ---- */
for (const phase of ["during-load", "after-load"]) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  if (phase === "during-load") {
    // throttle so videos are still streaming when we probe
    const cdp = await page.context().newCDPSession(page);
    await cdp.send("Network.emulateNetworkConditions", {
      offline: false, latency: 40, downloadThroughput: (1.5 * 1024 * 1024) / 8, uploadThroughput: 256 * 1024,
    });
  }
  await page.goto(URL, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(phase === "during-load" ? 1500 : 6000);
  const scrollables = await page.evaluate(() =>
    [...document.querySelectorAll("*"), document.documentElement, document.body]
      .filter((el) => {
        const cs = getComputedStyle(el);
        return el.scrollHeight > el.clientHeight + 1 && ["auto", "scroll"].includes(cs.overflowY);
      })
      .map((el) => ({
        tag: el.tagName, cls: String(el.className).slice(0, 80), id: el.id,
        overflowY: getComputedStyle(el).overflowY,
        clientH: el.clientHeight, scrollH: el.scrollHeight,
      }))
  );
  const docInfo = await page.evaluate(() => ({
    scrollingElement: document.scrollingElement?.tagName,
    htmlOverflowY: getComputedStyle(document.documentElement).overflowY,
    htmlOverflowX: getComputedStyle(document.documentElement).overflowX,
    bodyOverflowY: getComputedStyle(document.body).overflowY,
    bodyScrollH: document.body.scrollHeight, bodyClientH: document.body.clientHeight,
    htmlScrollH: document.documentElement.scrollHeight, htmlClientH: document.documentElement.clientHeight,
    dir: document.documentElement.getAttribute("dir"),
    innerW: window.innerWidth, docClientW: document.documentElement.clientWidth,
  }));
  console.log(`=== ${phase} ===`);
  console.log("doc:", JSON.stringify(docInfo));
  console.log("scrollables:", JSON.stringify(scrollables, null, 1));
}

await browser.close();
console.log("baseline done");
