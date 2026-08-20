/**
 * A full-page capture of /concepts/lab you can actually trust.
 *
 * WHY THIS EXISTS. Three separate times a picture of this page has been wrong
 * in a way that looked right, and each time it cost a round of chasing:
 *
 *   1. An orphaned `next start` answered 200 from a forty-minute-old build,
 *      so the capture showed a page without the change in it.
 *   2. A capture taken mid-scroll showed .rv content that had not revealed
 *      yet — opacity 0 — which reads as a near-full-screen empty gap and was
 *      reported as a layout defect. It was not one.
 *   3. A capture taken against a server whose .next had been overwritten
 *      underneath it failed to hydrate at all, so NOTHING revealed and every
 *      act came out blank.
 *
 * So this refuses to produce an image until it has checked all three:
 *   · the served build is the build on disk        (scripts/lab-build.mjs)
 *   · every .rv element has actually revealed      (asserted, not assumed)
 *   · fonts are loaded and the network is quiet
 *
 * If any check fails it says which and exits non-zero WITHOUT writing a file.
 * A missing image is a much cheaper failure than a misleading one.
 *
 *   npm run lab:capture                  desktop 1440 + phone 390
 *   npm run lab:capture -- 320 768       those widths instead
 *
 * Output goes to shots-capture/, which .gitignore already excludes by its
 * shots- prefix rule. Captured at deviceScaleFactor 1 on purpose: this page is
 * ~18000px tall and 2x would exceed the renderer's maximum surface height.
 */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { assertServedBuild } from "./lab-build.mjs";

const REPO = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(REPO, "shots-capture");

const LAB_PORT = 3210;
const argUrl = process.argv[2] && !process.argv[2].startsWith("--") && !/^\d+$/.test(process.argv[2])
  ? process.argv[2]
  : null;
const BASE = argUrl ?? `http://127.0.0.1:${LAB_PORT}`;
const widths = process.argv.slice(2).filter((a) => /^\d+$/.test(a)).map(Number);

const PROFILES = widths.length
  ? widths.map((w) => ({ name: `w${w}`, width: w, height: w < 700 ? 844 : 900, mobile: w < 700 }))
  : [
      { name: "desktop-1440", width: 1440, height: 900, mobile: false },
      { name: "phone-390", width: 390, height: 844, mobile: true },
    ];

if (!argUrl) {
  console.log(`\n  no baseUrl given — expecting ${BASE}`);
  console.log("  if nothing is serving it:  npm run build && npm run lab:serve\n");
}

await assertServedBuild(BASE);

mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
let failed = 0;

for (const p of PROFILES) {
  const ctx = await browser.newContext({
    viewport: { width: p.width, height: p.height },
    deviceScaleFactor: 1,
    isMobile: p.mobile,
    hasTouch: p.mobile,
  });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/concepts/lab`, { waitUntil: "networkidle" });

  /* Walk the whole page so every IntersectionObserver fires. Small steps: a
     single jump to the bottom skips elements whose observer never sees them. */
  await page.evaluate(async () => {
    const step = Math.round(window.innerHeight * 0.4);
    for (let y = 0; y <= document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 40));
    }
    /* PARK AT THE BOTTOM EXPLICITLY. The stepped walk finished ~930px short of
       the maximum on a phone — the document keeps growing as the film's
       segments resolve, so a loop bounded by the height read at the start
       stops before the end. Everything in the final CTA stayed unrevealed,
       and the assertion below is what caught it. */
    window.scrollTo(0, document.documentElement.scrollHeight);
    await new Promise((r) => setTimeout(r, 500));
  });
  await page.waitForTimeout(900);

  /* ASSERT the reveal actually happened. This is the check whose absence
     produced a blank capture that was then reported as a layout bug. */
  const rv = await page.evaluate(() => {
    const all = [...document.querySelectorAll(".lab .rv")];
    const out = all.filter((e) => !e.classList.contains("in"));
    return {
      total: all.length,
      pending: out.length,
      worst: out.slice(0, 5).map((e) => (e.className || e.tagName).toString().slice(0, 34)),
      transparent: all.filter((e) => getComputedStyle(e).opacity === "0").length,
    };
  });

  if (rv.pending > 0 || rv.transparent > 0) {
    console.error(`\n  ✗ ${p.name}: ${rv.pending}/${rv.total} .rv never revealed, ${rv.transparent} still at opacity 0.`);
    for (const w of rv.worst) console.error(`      ${w}`);
    console.error("    NOT writing an image — it would show blank sections that are not blank.");
    failed += 1;
    await ctx.close();
    continue;
  }

  await page.evaluate(() => document.fonts && document.fonts.ready);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(700);

  const file = join(OUT, `lab-${p.name}.png`);
  await page.screenshot({ path: file, fullPage: true, timeout: 180000 });
  const size = await page.evaluate(() => document.documentElement.scrollHeight);
  console.log(`  ✓ ${p.name.padEnd(13)} ${p.width}x${size}px   ${rv.total}/${rv.total} revealed   ${file}`);
  await ctx.close();
}

await browser.close();

if (failed) {
  console.error(`\n  ${failed} profile(s) failed their checks. No usable capture.\n`);
  process.exit(1);
}
console.log(`\n  The film's canvas appears once, at the position it holds at scroll 0 —`);
console.log(`  a still page cannot show a scrub. Everything else is settled and real.\n`);
