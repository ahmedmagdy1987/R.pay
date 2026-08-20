/**
 * Does a toolbar collapse move the film?
 *
 * iOS Safari's URL bar collapses as you scroll, changing window.innerHeight
 * by roughly 60-120px without the page having moved. The pinned scrub derives
 * its frame index from `sectionHeight - innerHeight`, so if that denominator
 * is read live, the toolbar retargets the frame index mid-gesture and the film
 * jumps — or briefly runs backwards — while the reader is holding still.
 *
 * SIMULATING IT FAITHFULLY MATTERS. The obvious approach — page.setViewportSize
 * with a shorter height — is wrong, because it resizes the LAYOUT viewport, so
 * `vh` units shrink along with innerHeight. That is a window resize, not a
 * toolbar. On iOS, `vh` is the large-viewport height and does not move when
 * the chrome does; only `window.innerHeight` changes. So the test overrides
 * innerHeight and fires a resize, leaving layout alone. Nothing about the
 * reader's position has changed, so the frame index must not change either.
 *
 *   node scripts/lab-viewport.mjs <baseUrl> [--view desktop|mobile]
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
const VIEW = arg("view", "mobile");
const BASE_VP =
  VIEW === "mobile"
    ? { width: 390, height: 844, deviceScaleFactor: 3, isMobile: true, hasTouch: true }
    : { width: 1440, height: 900, deviceScaleFactor: 1 };

/* Toolbar-sized deltas: same width, under ~120px of height. */
const STEPS = [-60, -96, -60, 0, -110];

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: BASE_VP.width, height: BASE_VP.height },
  deviceScaleFactor: BASE_VP.deviceScaleFactor,
  isMobile: BASE_VP.isMobile,
  hasTouch: BASE_VP.hasTouch,
});
const page = await context.newPage();
await page.goto(`${BASE}/concepts/lab`, { waitUntil: "load", timeout: 90000 });
await page.waitForFunction(() => document.querySelectorAll(".scrubseq").length === 3, null, {
  timeout: 30000,
});
await page.evaluate(() => {
  document.documentElement.style.scrollBehavior = "auto";
});

/* Park in the middle of segment B's pin and let the damping settle fully, so
   any later movement is the toolbar's doing and not leftover easing. */
await page.evaluate(() => {
  const el = document.querySelectorAll(".scrubseq")[1];
  const span = Math.max(1, el.offsetHeight - window.innerHeight);
  window.scrollTo(0, window.scrollY + el.getBoundingClientRect().top + span * 0.45);
});
await page.waitForTimeout(2600);

const read = () =>
  page.evaluate(() => {
    const el = document.querySelectorAll(".scrubseq")[1];
    return {
      frame: Number(el.dataset.frame ?? -1),
      y: Math.round(window.scrollY),
      vh: window.innerHeight,
    };
  });

const start = await read();
console.log(`
══ VIEWPORT STABILITY · ${VIEW} ══`);
console.log(`  baseline         frame ${start.frame}  scrollY ${start.y}  innerHeight ${start.vh}
`);
console.log(`  ${"Δheight".padStart(8)} ${"innerH".padStart(7)} ${"scrollY".padStart(8)} ${"frame".padStart(6)}  drift`);

let worst = 0;
let reversed = false;
let prevFrame = start.frame;
const REAL_H = BASE_VP.height;

for (const d of STEPS) {
  await page.evaluate(
    ([h]) => {
      Object.defineProperty(window, "innerHeight", { configurable: true, get: () => h });
      window.dispatchEvent(new Event("resize"));
    },
    [REAL_H + d],
  );
  await page.waitForTimeout(650); // past any debounce, still no scrolling
  const r = await read();
  const drift = r.frame - start.frame;
  if (Math.abs(drift) > Math.abs(worst)) worst = drift;
  if ((r.frame - prevFrame) * (drift || 1) < 0) reversed = true;
  prevFrame = r.frame;
  console.log(
    `  ${String(d).padStart(8)} ${String(r.vh).padStart(7)} ${String(r.y).padStart(8)} ${String(r.frame).padStart(6)}  ${
      drift === 0 ? "—" : (drift > 0 ? "+" : "") + drift
    }`,
  );
}

await browser.close();

/* One frame of slack: the damping is asymptotic, so a single index of
   settling is not the toolbar dragging the film around. */
const TOL = 1;
const pass = Math.abs(worst) <= TOL;
console.log(
  `\n  worst drift ${worst} frame(s)${reversed ? ", direction reversed" : ""} — ${
    pass ? "PASS: the toolbar does not move the film" : "FAIL: frame index is being retargeted by viewport height"
  }\n`,
);
process.exit(pass ? 0 : 1);
