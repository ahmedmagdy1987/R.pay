/**
 * The objection row, checked at every breakpoint it changes shape.
 *
 * Below 820px the five cards become a horizontal snapping row. The failure
 * mode that makes those feel broken is not visual and cannot be seen in a
 * screenshot: a scroller that claims the VERTICAL gesture as well as the
 * horizontal, so a reader whose thumb happens to land on the row cannot
 * scroll the page at all. It is one CSS declaration away at all times
 * (touch-action: pan-x), so it is tested here rather than trusted.
 *
 *   node scripts/lab-objections.mjs [baseUrl]
 */
import { chromium } from "playwright";
import { assertServedBuild } from "./lab-build.mjs";

const LAB_PORT = 3210;
const argUrl = process.argv[2] && !process.argv[2].startsWith("--") ? process.argv[2] : null;
const BASE = argUrl ?? `http://127.0.0.1:${LAB_PORT}`;
if (!argUrl) {
  console.log(`\n  no baseUrl given — expecting ${BASE}`);
  console.log("  if nothing is serving it:  npm run build && npm run lab:serve\n");
}
await assertServedBuild(BASE);

const PROFILES = [
  { name: "desktop 1440", w: 1440, h: 900, mobile: false, expect: "grid" },
  { name: "tablet 900", w: 900, h: 1100, mobile: false, expect: "grid" },
  { name: "tablet 819", w: 819, h: 1100, mobile: true, expect: "row" },
  { name: "phone 390", w: 390, h: 844, mobile: true, expect: "row" },
  { name: "phone 320", w: 320, h: 640, mobile: true, expect: "row" },
];

const browser = await chromium.launch();
let fails = 0;
const fail = (m) => { console.log(`      ✗ ${m}`); fails += 1; };
const ok = (m) => console.log(`      ✓ ${m}`);

for (const p of PROFILES) {
  const ctx = await browser.newContext({
    viewport: { width: p.w, height: p.h },
    isMobile: p.mobile,
    hasTouch: p.mobile,
  });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/concepts/lab`, { waitUntil: "networkidle" });
  await page.evaluate(async () => {
    const st = Math.round(window.innerHeight * 0.4);
    for (let y = 0; y <= document.documentElement.scrollHeight; y += st) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 30));
    }
    window.scrollTo(0, document.documentElement.scrollHeight);
    await new Promise((r) => setTimeout(r, 400));
  });
  await page.waitForTimeout(500);

  console.log(`\n  ── ${p.name} ──`);

  const s = await page.evaluate(() => {
    const g = document.querySelector(".objections");
    const cs = getComputedStyle(g);
    const cards = [...g.children];
    const box = g.getBoundingClientRect();
    const rows = new Set(cards.map((c) => Math.round(c.getBoundingClientRect().y))).size;
    const dots = document.querySelector(".objections-dots");
    return {
      display: cs.display,
      overflowX: cs.overflowX,
      touchAction: cs.touchAction,
      snapType: cs.scrollSnapType,
      cards: cards.length,
      rows,
      scrollW: Math.round(g.scrollWidth),
      clientW: Math.round(g.clientWidth),
      cardW: Math.round(cards[0].getBoundingClientRect().width),
      boxW: Math.round(box.width),
      dotsDisplay: dots ? getComputedStyle(dots).display : "absent",
      dotCount: dots ? dots.children.length : 0,
      // does any card's text spill its own box?
      overflowing: cards.filter((c) => c.scrollWidth > c.clientWidth + 1).length,
      // does the page itself scroll sideways?
      docOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    };
  });

  if (p.expect === "grid") {
    s.display === "grid" ? ok(`grid (${s.cards} cards in ${s.rows} rows)`) : fail(`expected grid, got ${s.display}`);
    s.dotsDisplay === "none" ? ok("dots hidden") : fail(`dots should be hidden, are ${s.dotsDisplay}`);
  } else {
    s.display === "flex" ? ok("horizontal row") : fail(`expected flex row, got ${s.display}`);
    s.snapType.includes("x") ? ok(`scroll-snap ${s.snapType}`) : fail(`no x snapping (${s.snapType})`);

    /* The next card must be VISIBLE, clipped — not hidden and not full-width. */
    const peek = s.boxW - s.cardW;
    peek > 40 && s.cardW < s.boxW
      ? ok(`next card peeks ${peek}px (card ${s.cardW} of ${s.boxW})`)
      : fail(`no peek: card ${s.cardW}, container ${s.boxW}`);

    s.scrollW > s.clientW ? ok(`scrollable ${s.scrollW} > ${s.clientW}`) : fail("row does not scroll");
    s.dotsDisplay === "flex" ? ok(`dots shown, ${s.dotCount} of ${s.cards}`) : fail(`dots ${s.dotsDisplay}`);
    s.dotCount === s.cards ? ok("dot count matches card count") : fail(`${s.dotCount} dots vs ${s.cards} cards`);

    /* THE ONE THAT MATTERS: vertical gesture must reach the page. */
    const ta = s.touchAction;
    ta === "pan-x" || ta === "pan-x pinch-zoom"
      ? fail(`touch-action ${ta} — this TRAPS vertical scrolling`)
      : ok(`touch-action ${ta} (vertical not claimed)`);

    const before = await page.evaluate(() => window.scrollY);
    const centre = await page.evaluate(() => {
      const r = document.querySelector(".objections").getBoundingClientRect();
      return { x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2) };
    });
    const cdp = await ctx.newCDPSession(page);
    await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: centre.x, y: centre.y }] });
    for (let i = 1; i <= 6; i += 1) {
      await cdp.send("Input.dispatchTouchEvent", {
        type: "touchMove",
        touchPoints: [{ x: centre.x, y: centre.y - i * 22 }],
      });
      await page.waitForTimeout(16);
    }
    await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    await page.waitForTimeout(500);
    const after = await page.evaluate(() => window.scrollY);
    after > before
      ? ok(`vertical swipe over the row scrolled the page ${Math.round(after - before)}px`)
      : fail(`vertical swipe over the row moved the page ${Math.round(after - before)}px — TRAPPED`);
  }

  s.overflowing === 0 ? ok("no card overflows its box") : fail(`${s.overflowing} card(s) overflow`);
  !s.docOverflow ? ok("page has no horizontal overflow") : fail("PAGE scrolls sideways");

  await ctx.close();
}

await browser.close();
console.log(fails ? `\n  ${fails} check(s) FAILED\n` : "\n  all checks passed\n");
process.exit(fails ? 1 : 0);
