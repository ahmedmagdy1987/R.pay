/** moments.mjs — capture the specific beats that matter, by SEEKING to the
 *  state rather than guessing a scroll percentage:
 *    - the tray moment (traylight lit AND CTA 2 visible)
 *    - Act V "تحكّم كامل." and Act VI "دورك الآن." (Arabic descender check)
 *    - the mobile fall's final card (warm glow + CTA)
 *  Also re-runs the text-collision probe with opacity-0 elements excluded,
 *  so stacked-but-hidden beats stop reporting as false positives.
 */
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const BASE = "http://127.0.0.1:3100";
const OUT = path.resolve("shots-moments");
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

const COLLIDE = `(() => {
  const vis = (el) => {
    let n = el;
    while (n && n !== document.body) {
      const cs = getComputedStyle(n);
      if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity < 0.05) return false;
      n = n.parentElement;
    }
    return true;
  };
  const sel = (el) => el.tagName.toLowerCase() +
    (typeof el.className === 'string' && el.className ? '.' + el.className.trim().split(/\\s+/).slice(0,3).join('.') : '');
  const nodes = [...document.querySelectorAll('.flow h1, .flow h2, .flow .t-beat, .flow .sub, .flow .drop-m-cap, .flow .ctrl-line, .flow .foot span')]
    .filter(vis);
  const hits = [];
  for (let i = 0; i < nodes.length; i++) for (let j = i+1; j < nodes.length; j++) {
    const a = nodes[i], b = nodes[j];
    if (a.contains(b) || b.contains(a)) continue;
    const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
    if (!ra.width || !rb.width) continue;
    const ox = Math.min(ra.right, rb.right) - Math.max(ra.left, rb.left);
    const oy = Math.min(ra.bottom, rb.bottom) - Math.max(ra.top, rb.top);
    if (ox > 2 && oy > 2) hits.push({ a: sel(a), b: sel(b), overlapY: Math.round(oy) });
  }
  return hits;
})()`;

const browser = await chromium.launch();

for (const vp of [{ w: 1920, h: 1080 }, { w: 1440, h: 900 }, { w: 820, h: 1180 }, { w: 390, h: 844 }]) {
  const ctx = await browser.newContext({
    viewport: { width: vp.w, height: vp.h },
    isMobile: vp.w <= 820, hasTouch: vp.w <= 820,
  });
  const page = await ctx.newPage();
  await page.goto(BASE + "/concepts/flow", { waitUntil: "networkidle" });
  await page.waitForTimeout(2500);

  // --- seek the tray moment: scan for .tray-cta.on (desktop scrub only)
  if (vp.w > 820) {
    let found = null;
    for (let i = 30; i <= 75; i++) {
      await page.evaluate((pc) => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        window.scrollTo({ top: Math.round((max * pc) / 100), behavior: "instant" });
      }, i);
      await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
      const on = await page.evaluate(() => {
        const c = document.querySelector(".flow .tray-cta");
        const t = document.querySelector(".flow .traylight");
        return { cta: !!c?.classList.contains("on"), glow: t ? +getComputedStyle(t).opacity : 0 };
      });
      if (on.cta && on.glow > 0.9) { found = { pc: i, ...on }; break; }
    }
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(OUT, `tray-${vp.w}.png`) });
    console.log(`  ${vp.w} tray moment: ${JSON.stringify(found)}`);
  }

  // --- Act V and Act VI
  for (const [id, name] of [["control", "control"], ["demo", "close"]]) {
    await page.evaluate((i) => document.getElementById(i)?.scrollIntoView({ block: "center", behavior: "instant" }), id);
    await page.waitForTimeout(900);
    await page.screenshot({ path: path.join(OUT, `${name}-${vp.w}.png`) });
  }

  // --- mobile fall final card
  if (vp.w <= 820) {
    await page.evaluate(() => {
      const cards = document.querySelectorAll(".flow .drop-m-card");
      cards[cards.length - 1]?.scrollIntoView({ block: "center", behavior: "instant" });
    });
    await page.waitForTimeout(900);
    await page.screenshot({ path: path.join(OUT, `fall-last-${vp.w}.png`) });
  }

  // --- collision sweep over the whole page, visible elements only
  const all = [];
  for (let i = 0; i <= 100; i += 5) {
    await page.evaluate((pc) => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo({ top: Math.round((max * pc) / 100), behavior: "instant" });
    }, i);
    await page.waitForTimeout(260);
    const hits = await page.evaluate(COLLIDE);
    hits.forEach((h) => all.push(`${i}%: ${h.a} × ${h.b} (${h.overlapY}px)`));
  }
  const uniq = [...new Set(all)];
  console.log(`  ${vp.w} collisions: ` + (uniq.length ? "❌\n     " + uniq.join("\n     ") : "✅ none"));

  await ctx.close();
}

await browser.close();
console.log(`\n✔ ${OUT}`);
