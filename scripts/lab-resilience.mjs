/**
 * Prove the defences that exist for a device we cannot test on.
 *
 * Everything here is aimed at iOS Safari behaviour — discarded tabs, canvases
 * that lose their backing store silently — none of which Playwright will ever
 * do on its own. So each check drives the same code path the real event would,
 * and says plainly which part is simulated.
 *
 *   node scripts/lab-resilience.mjs <baseUrl> [--view desktop|mobile] [--lite]
 */
import { chromium } from "playwright";
import { assertServedBuild } from "./lab-build.mjs";

/* ONE PORT FOR THE WHOLE LAB HARNESS. These four scripts defaulted to four
   different ports until 2026-08-20 — 3210, 3224, 3236, 3250 — and nothing
   served any of them, so a no-argument run failed to connect rather than
   measuring anything. It also treated a bare "--flag" as a baseUrl. Both fixed:
   one port, and argv[2] is only a URL if it does not start with "--". */
const LAB_PORT = 3210;
const argUrl = process.argv[2] && !process.argv[2].startsWith("--") ? process.argv[2] : null;
const BASE = argUrl ?? `http://127.0.0.1:${LAB_PORT}`;
if (!argUrl) {
  console.log(`\n  no baseUrl given — expecting ${BASE}`);
  console.log("  if nothing is serving it:  npm run build && npm run lab:serve\n");
}

/* Refuse to measure a build that is not the build on disk. An orphaned
   `next start` answers 200 from whatever it booted with, which makes a stale
   run look exactly like a clean one. See scripts/lab-build.mjs. */
await assertServedBuild(BASE);
const arg = (n, d) => {
  const i = process.argv.indexOf(`--${n}`);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : d;
};
const VIEW = arg("view", "desktop");
const LITE = process.argv.includes("--lite");
const VIEWPORTS = {
  desktop: { viewport: { width: 1440, height: 900 } },
  mobile: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true },
};

/** Mean luminance of one segment's canvas. */
const LUMA = `(el) => {
  const c = el.querySelector("canvas");
  if (!c || !c.width) return -1;
  const d = c.getContext("2d").getImageData(0, 0, c.width, c.height).data;
  let s = 0, n = 0;
  const step = Math.max(4, Math.floor((c.width * c.height) / 20000)) * 4;
  for (let i = 0; i < d.length; i += step) { s += d[i]*0.2126 + d[i+1]*0.7152 + d[i+2]*0.0722; n++; }
  return s / n;
}`;

const ctxOpts = VIEWPORTS[VIEW];
const browser = await chromium.launch();
const context = await browser.newContext(ctxOpts);
const page = await context.newPage();
const url = `${BASE}/concepts/lab${LITE ? "?lite=1" : ""}`;

let reloads = 0;
page.on("load", () => (reloads += 1));

await page.goto(url, { waitUntil: "load", timeout: 90000 });
await page.waitForFunction(() => document.querySelectorAll(".scrubseq").length === 3, null, { timeout: 30000 });
await page.evaluate(() => { document.documentElement.style.scrollBehavior = "auto"; });

const cfg = await page.evaluate(() => {
  const el = document.querySelector(".scrubseq");
  return { lite: el.dataset.lite, frames: el.dataset.frames, window: el.dataset.window };
});

console.log(`\n══ RESILIENCE · ${VIEW}${LITE ? " · LITE" : ""} ══`);
console.log(`  tier            lite=${cfg.lite}  frames/segment=${cfg.frames}  decode window=${cfg.window}`);

/* Park mid-way through segment B, which is the darkest material on the page
   and therefore the hardest place for a naive "is it black" check. */
await page.evaluate(() => {
  const el = document.querySelectorAll(".scrubseq")[1];
  const span = Math.max(1, el.offsetHeight - window.innerHeight);
  window.scrollTo(0, window.scrollY + el.getBoundingClientRect().top + span * 0.4);
});
await page.waitForTimeout(2600);

const before = await page.$$eval(".scrubseq", (els, f) => {
  const fn = eval(f);
  return els.map((e) => ({ luma: fn(e), live: Number(e.dataset.live ?? 0) }));
}, LUMA);
const seg = 1;

/* WHAT COUNTS AS THE SAME PICTURE. lab-reduced measures the same segments
   against the real frame files on disk: two samples of the SAME frame land
   within 2.2 luma of each other, and the nearest DIFFERENT frame is 10.6 away.
   4.0 sits in that gap with room on both sides. */
const SAME = 4.0;
let fails = 0;
const check = (ok, label) => { if (!ok) fails += 1; return ok ? "✓" : "✗"; };
console.log(`\n  ── TASK 1 · backgrounded tab ──`);
console.log(`  painted before   luma ${before[seg].luma.toFixed(2)}  bitmaps ${before[seg].live}`);

/* 1a. Drive the real listener with a real `visibilitychange` event.
       page.bringToFront() was tried first and is useless here: another tab in
       front leaves the backgrounded page reporting visibilityState "visible",
       so the handler never runs and the check silently measures nothing.
       Overriding the getter and dispatching the event is honest about being
       synthetic — the EVENT is manufactured, the LISTENER and everything
       downstream of it is the shipping code. */
const hidden = await page.evaluate(() => {
  Object.defineProperty(document, "visibilityState", { configurable: true, get: () => "hidden" });
  Object.defineProperty(document, "hidden", { configurable: true, get: () => true });
  document.dispatchEvent(new Event("visibilitychange", { bubbles: true }));
  return Array.from(document.querySelectorAll(".scrubseq")).map((e) => Number(e.dataset.live ?? 0));
});
await page.waitForTimeout(150);
const afterShow = await page.evaluate((f) => {
  Object.defineProperty(document, "visibilityState", { configurable: true, get: () => "visible" });
  Object.defineProperty(document, "hidden", { configurable: true, get: () => false });
  document.dispatchEvent(new Event("visibilitychange", { bubbles: true }));
  const fn = eval(f);
  return Array.from(document.querySelectorAll(".scrubseq")).map((e) => ({
    luma: fn(e),
    live: Number(e.dataset.live ?? 0),
  }));
}, LUMA);

const shed = hidden.reduce((a, b) => a + b, 0);
console.log(`  visibilitychange bitmaps while hidden ${shed} ${check(shed === 0, "shed")} shed   (synthetic event, real listener)`);
console.log(
  `                   luma immediately on return ${afterShow[seg].luma.toFixed(2)} ${check(afterShow[seg].luma > 1, "return-not-blank")} never blank`,
);

/* NOT BLANK IS NOT THE SAME AS RIGHT, AND THAT DISTINCTION IS THE WHOLE POINT.
   Until 2026-08-21 this file stopped at "luma > 1" — and a segment that came
   back showing its POSTER, frozen, with zero decoded bitmaps and no route back
   short of scrolling, satisfied that perfectly. A poster is not black. The
   check has to name the frame the reader was actually on and demand it back. */
await page.waitForTimeout(700);
const settled = await page.$$eval(".scrubseq", (els, f) => {
  const fn = eval(f);
  return els.map((e) => ({ luma: fn(e), live: Number(e.dataset.live ?? 0), poster: e.dataset.poster ?? "0" }));
}, LUMA);
const dReturn = Math.abs(settled[seg].luma - before[seg].luma);
console.log(
  `  settled +700ms   luma ${settled[seg].luma.toFixed(2)} vs ${before[seg].luma.toFixed(2)} before (Δ${dReturn.toFixed(2)}) ${check(dReturn <= SAME, "return-same-frame")} same frame`,
);
console.log(
  `                   decoded ${settled[seg].live} ${check(settled[seg].live > 0, "return-window")} window rebuilt · poster ${settled[seg].poster === "1" ? "STILL UP ✗" : "cleared ✓"}`,
);
if (settled[seg].poster === "1") fails += 1;

/* 1b. Simulated discard: same code path the visibility handler runs, then an
       immediate repaint check with no time for a decode to rescue it. */
await page.evaluate(() => window.__scrubForceDiscard());
await page.waitForTimeout(120);
const discarded = await page.$$eval(".scrubseq", (els, f) => {
  const fn = eval(f);
  return els.map((e) => ({ luma: fn(e), live: Number(e.dataset.live ?? 0), loaded: Number(e.dataset.loaded ?? 0) }));
}, LUMA);
await page.evaluate(() => window.__scrubForceRestore());
await page.waitForTimeout(90); // deliberately short — poster must carry this
const restored = await page.$$eval(".scrubseq", (els, f) => {
  const fn = eval(f);
  return els.map((e) => ({ luma: fn(e), live: Number(e.dataset.live ?? 0), poster: e.dataset.poster ?? "0" }));
}, LUMA);

console.log(`  forced discard   bitmaps ${discarded[seg].live} ${discarded[seg].live === 0 ? "✓" : "✗"}  blobs kept ${discarded[seg].loaded} ${discarded[seg].loaded > 0 ? "✓" : "✗ refetch needed"}`);
console.log(
  `  repaint +90ms    luma ${restored[seg].luma.toFixed(2)} ${check(restored[seg].luma > 1, "restore-not-blank")} never blank (poster may legitimately carry this)`,
);
await page.waitForTimeout(700);
const reSettled = await page.$$eval(".scrubseq", (els, f) => {
  const fn = eval(f);
  return els.map((e) => ({ luma: fn(e), live: Number(e.dataset.live ?? 0), poster: e.dataset.poster ?? "0" }));
}, LUMA);
const dRestore = Math.abs(reSettled[seg].luma - before[seg].luma);
console.log(
  `  settled +700ms   luma ${reSettled[seg].luma.toFixed(2)} vs ${before[seg].luma.toFixed(2)} before (Δ${dRestore.toFixed(2)}) ${check(dRestore <= SAME, "restore-same-frame")} same frame · decoded ${reSettled[seg].live} ${check(reSettled[seg].live > 0, "restore-window")}`,
);
console.log(`  page reloads     ${reloads - 1} ${check(reloads === 1, "no-reload")} recovered without reload`);

/* Scroll persistence: save happens on hide, so read it back. */
const persisted = await page.evaluate(
  () => Number(sessionStorage.getItem("rpay-scrub-y" + location.pathname) ?? 0),
);
const nowY = await page.evaluate(() => Math.round(window.scrollY));
console.log(`  scroll persisted ${persisted}px (at ${nowY}px) ${check(Math.abs(persisted - nowY) < 400, "scroll-persist")}`);

/* ── TASK 2 · watchdog ───────────────────────────────────────────────────── */
console.log(`\n  ── TASK 2 · canvas-loss watchdog ──`);

/* Blank the backing store behind the engine's back, the way Safari would, and
   see whether the next tick notices. */
await page.evaluate(() => {
  const el = document.querySelectorAll(".scrubseq")[1];
  const c = el.querySelector("canvas");
  const g = c.getContext("2d");
  g.save();
  g.setTransform(1, 0, 0, 1, 0, 0);
  g.clearRect(0, 0, c.width, c.height);
  g.restore();
});
const preWipe = before[seg].luma;
const wiped = await page.$$eval(".scrubseq", (els, f) => eval(f)(els[1]), LUMA);
/* Deliberately DO NOT scroll. Nudging the page was the first attempt and it
   proved nothing: moving changes the frame index, so the ordinary draw path
   repaints and the watchdog never fires. Held still, the index does not
   change and `draw` short-circuits on `j === drawn`, so the only thing that
   can bring the picture back is the watchdog. */
await page.waitForTimeout(1200);
const healed = await page.$$eval(".scrubseq", (els, f) => ({
  luma: eval(f)(els[1]),
  recovered: Number(els[1].dataset.recovered ?? 0),
}), LUMA);
console.log(`  wiped canvas     luma ${wiped.toFixed(2)}`);
const dHeal = Math.abs(healed.luma - preWipe);
console.log(
  `  after 900ms      luma ${healed.luma.toFixed(2)}  recoveries ${healed.recovered} ${check(healed.luma > 1, "heal-not-blank")} redrawn`,
);
console.log(
  `                   vs ${preWipe.toFixed(2)} before the wipe (Δ${dHeal.toFixed(2)}) ${check(dHeal <= SAME, "heal-same-frame")} same frame · ${check(healed.recovered > 0, "heal-fired")} watchdog fired`,
);

const overhead = await page.evaluate(() => {
  const c = document.querySelectorAll(".scrubseq")[1].querySelector("canvas");
  const g = c.getContext("2d");
  const x = Math.max(0, (c.width >> 1) - 4);
  const y = Math.max(0, (c.height >> 1) - 4);
  for (let i = 0; i < 50; i++) g.getImageData(c.width - 1, c.height - 1, 1, 1); // warm
  const t0 = performance.now();
  const N = 2000;
  for (let i = 0; i < N; i++) {
    const d = g.getImageData(c.width - 1, c.height - 1, 1, 1).data;
    if (d.length === 0) break;
  }
  return (performance.now() - t0) / N;
});
const perSec = overhead * (1000 / 400);
console.log(`  probe cost       ${overhead.toFixed(4)} ms per sample · every 400ms · ${perSec.toFixed(4)} ms/s`);
console.log(`                   ${(perSec / 1000 * 100).toFixed(4)}% of one core while scrolling`);

await browser.close();

/* THIS FILE USED TO ALWAYS EXIT 0. Every ✗ above printed and the process
   returned success, so any script or person chaining on it read a failure as a
   pass. A check that cannot fail the run is a comment. */
console.log(
  `
  ${fails ? `FAIL — ${fails} check(s) failed` : "PASS — every check held, and each one names the frame it expected"}
`,
);
process.exit(fails ? 1 : 0);
