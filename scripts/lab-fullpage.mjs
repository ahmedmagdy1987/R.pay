/**
 * Walk the WHOLE page and assert every segment actually paints.
 *
 * WHY THIS EXISTS: lab-measure drives one segment at a time and passes on a
 * page where the other two are black, because it never asks them anything.
 * That is the same blind spot as the idle-canvas reading earlier in this
 * project — a harness that only measures what it already believes.
 *
 * This one scrolls continuously from 0 to the bottom in small increments and,
 * at each segment's midpoint, reads pixels back off the canvas. A segment
 * passes only if it is (a) not black and (b) showing a DIFFERENT picture a
 * little further down. A frozen non-black frame is still a bug.
 *
 *   node scripts/lab-fullpage.mjs <baseUrl> [--mode down|up|mid|flick] [--engine chromium|webkit]
 */
import { chromium, webkit } from "playwright";

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
const arg = (n, d) => {
  const i = process.argv.indexOf(`--${n}`);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : d;
};
const MODE = arg("mode", "down");
const ENGINE = arg("engine", "chromium") === "webkit" ? webkit : chromium;
const VIEW = arg("view", "desktop");
const VIEWPORTS = {
  desktop: { viewport: { width: 1440, height: 900 } },
  mobile: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true },
};

/** Mean luminance + a coarse fingerprint, read straight off the canvas. */
const PROBE = `(el) => {
  const c = el.querySelector("canvas");
  if (!c || !c.width) return { ok: false, why: "no canvas" };
  const ctx = c.getContext("2d");
  let d;
  try { d = ctx.getImageData(0, 0, c.width, c.height).data; }
  catch (e) { return { ok: false, why: "getImageData: " + e.message }; }
  let sum = 0, n = 0;
  const buckets = new Array(16).fill(0);
  // stride so a 3200x1800 backing store stays cheap to walk
  const step = Math.max(4, Math.floor((c.width * c.height) / 40000)) * 4;
  for (let i = 0; i < d.length; i += step) {
    const l = (d[i] * 0.2126 + d[i + 1] * 0.7152 + d[i + 2] * 0.0722);
    sum += l; n++;
    buckets[Math.min(15, l >> 4)]++;
  }
  return { ok: true, luma: sum / n, sig: buckets.join(","), w: c.width, h: c.height };
}`;

const run = async () => {
  const browser = await ENGINE.launch();
  const ctx = await browser.newContext(VIEWPORTS[VIEW]);
  const page = await ctx.newPage();

  const events = [];
  page.on("console", (m) => {
    const t = m.text();
    if (t.startsWith("[seq]")) events.push(t);
  });

  const LITE = process.argv.includes("--lite");
  await page.goto(`${BASE}/concepts/lab${LITE ? "?lite=1" : ""}`, { waitUntil: "load", timeout: 90000 });
  await page.waitForFunction(() => document.querySelectorAll(".scrubseq").length === 3, null, {
    timeout: 30000,
  });
  await page.evaluate(() => {
    document.documentElement.style.scrollBehavior = "auto";
  });

  /* A pinned segment stops advancing once its bottom reaches the fold, so its
     SCROLL span is height - viewport, not height. Sampling at top + h/2 puts
     the last segment past the end of its own pin, where the frame index is
     already clamped to 1 and two samples are identical — which reads as
     FROZEN when the page is fine. Measure the span, not the box. */
  const geo = await page.evaluate(() =>
    Array.from(document.querySelectorAll(".scrubseq")).map((el, i) => {
      const r = el.getBoundingClientRect();
      const top = window.scrollY + r.top;
      const span = Math.max(1, el.offsetHeight - window.innerHeight);
      return { i, top, h: el.offsetHeight, span, mid: Math.round(top + span * 0.4) };
    }),
  );
  const maxY = await page.evaluate(
    () => document.documentElement.scrollHeight - window.innerHeight,
  );

  /* Entry position per mode. "mid" is handled by the caller running it three
     times with --at; here we take the first segment's middle. */
  const startAt = {
    down: 0,
    up: maxY,
    mid: geo[1].mid,
    flick: 0,
  }[MODE];

  await page.evaluate((y) => window.scrollTo(0, y), startAt);
  await page.waitForTimeout(2500); // let the entry segment arm and decode

  /* Continuous pass. Small increments so nothing is skipped, except `flick`
     which deliberately crosses two boundaries inside one frame. */
  const order = MODE === "up" ? [...geo].reverse() : geo;
  const results = [];

  const sampleAt = async (y) => {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(700); // damping settle + a decode window
    return page.$$eval(".scrubseq", (els, probe) => {
      const fn = eval(probe);
      return els.map((el, i) => ({
        i,
        armed: el.dataset.armed ?? "?",
        loaded: Number(el.dataset.loaded ?? 0),
        live: Number(el.dataset.live ?? 0),
        ...fn(el),
      }));
    }, PROBE);
  };

  const scrollTo = async (from, to) => {
    if (MODE === "flick") {
      await page.evaluate((yy) => window.scrollTo(0, yy), to);
      return;
    }
    const stepPx = 60;
    const dir = to > from ? 1 : -1;
    await page.evaluate(
      async ([a, b, s, d]) => {
        for (let y = a; d > 0 ? y < b : y > b; y += s * d) {
          window.scrollTo(0, y);
          await new Promise((r) => requestAnimationFrame(r));
        }
        window.scrollTo(0, b);
      },
      [from, to, stepPx, dir],
    );
  };

  let cursor = startAt;
  for (const s of order) {
    const mid = Math.round(Math.min(maxY, Math.max(0, s.mid)));
    await scrollTo(cursor, mid);
    cursor = mid;
    const a = await sampleAt(mid);
    /* Nudge a fifth of the segment's own span, staying inside the pin. */
    const delta = Math.max(80, Math.round(s.span * 0.2)) * (MODE === "up" ? -1 : 1);
    const nudge = Math.round(
      Math.min(maxY, Math.max(0, Math.min(s.top + s.span, Math.max(s.top, mid + delta)))),
    );
    await scrollTo(mid, nudge);
    cursor = nudge;
    const b = await sampleAt(nudge);

    const A = a[s.i];
    const B = b[s.i];
    const black = !A.ok || A.luma < 1.0;
    const frozen = A.ok && B.ok && A.sig === B.sig;
    results.push({
      seg: "ABC"[s.i],
      atY: mid,
      luma: A.ok ? +A.luma.toFixed(2) : null,
      lumaAfter: B.ok ? +B.luma.toFixed(2) : null,
      armed: A.armed,
      loaded: A.loaded,
      live: A.live,
      why: A.ok ? null : A.why,
      black,
      frozen,
      pass: !black && !frozen,
    });
  }

  await browser.close();
  return { results, events, maxY, geo };
};

const { results, events, maxY } = await run();

console.log(`\n══ ${MODE.toUpperCase()} · ${VIEW} · ${ENGINE === webkit ? "webkit" : "chromium"} · page ${maxY}px ══`);
console.log(`  SEG   atY   luma   after  armed loaded live   verdict`);
for (const r of results) {
  const verdict = r.pass ? "ok" : r.black ? "BLACK" : "FROZEN";
  console.log(
    `  ${r.seg}   ${String(r.atY).padStart(5)}  ${String(r.luma ?? "-").padStart(6)} ${String(r.lumaAfter ?? "-").padStart(6)}` +
      `   ${String(r.armed).padStart(3)} ${String(r.loaded).padStart(6)} ${String(r.live).padStart(4)}   ${verdict}${r.why ? " (" + r.why + ")" : ""}`,
  );
}

if (events.length) {
  console.log(`\n  ── arbiter trace (${events.length}) ──`);
  for (const e of events.slice(0, 80)) console.log("   " + e.replace("[seq] ", ""));
  if (events.length > 80) console.log(`   … ${events.length - 80} more`);
}

const failed = results.filter((r) => !r.pass);
console.log(`\n  ${failed.length ? `FAIL — ${failed.map((f) => f.seg + ":" + (f.black ? "black" : "frozen")).join(" ")}` : "PASS — all three segments painted and moved"}\n`);
process.exit(failed.length ? 1 : 0);
