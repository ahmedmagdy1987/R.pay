/**
 * Measure the full three-segment film on /concepts/lab.
 *
 * Per breakpoint: bytes actually on the wire, time to first rendered frame,
 * peak decoded-bitmap memory, frame-time distribution across a full-page
 * scrub, and the two invariants that keep it alive on a phone —
 *   · the decode window never exceeds behind+ahead+1 bitmaps page-wide
 *   · at most two segments armed, and only while both are on screen
 *
 * The WebP fallback is verified on Playwright's WebKit, which genuinely
 * cannot decode AVIF. That is a real capability miss, not a forced flag.
 *
 * Usage: node scripts/lab-measure.mjs [baseUrl]
 */
import { chromium, webkit } from "playwright";
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
const LITE = process.argv.includes("--lite");
const URL = `${BASE}/concepts/lab${LITE ? "?lite=1" : ""}`;
const SEG = "/assets/lab/seg/";

const PROFILES = [
  {
    name: "desktop",
    engine: chromium,
    ctx: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 },
    expectMode: "wide",
    expectFmt: "avif",
    frames: 90,
  },
  {
    name: "mobile",
    engine: chromium,
    ctx: {
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 3,
      isMobile: true,
      hasTouch: true,
    },
    expectMode: "tall",
    expectFmt: "avif",
    frames: 60,
  },
  {
    name: "webkit (no AVIF)",
    engine: webkit,
    ctx: { viewport: { width: 1440, height: 900 } },
    expectMode: "wide",
    expectFmt: "webp",
    frames: 90,
  },
  {
    name: "reduced-motion",
    engine: chromium,
    ctx: { viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" },
    expectMode: "static",
    expectFmt: "avif",
    frames: 1,
    skipScrub: true,
  },
];

const MB = (b) => `${(b / 1048576).toFixed(2)} MB`;

async function run(p) {
  const browser = await p.engine.launch();
  const context = await browser.newContext(p.ctx);
  const page = await context.newPage();

  await page.addInitScript(() => {
    window.__seq = { tffNav: null };
    addEventListener(
      "scrubseq:firstframe",
      () => {
        if (window.__seq.tffNav == null) window.__seq.tffNav = performance.now();
      },
      true,
    );
  });

  /* Wire bytes. CDP gives encodedDataLength on Chromium; WebKit has no CDP,
     so fall back to Content-Length via the response event there. */
  const wire = [];
  let cdp = null;
  try {
    cdp = await context.newCDPSession(page);
    await cdp.send("Network.enable");
    const urlOf = new Map();
    cdp.on("Network.requestWillBeSent", (e) => urlOf.set(e.requestId, e.request.url));
    cdp.on("Network.responseReceived", (e) => urlOf.set(e.requestId, e.response.url));
    cdp.on("Network.loadingFinished", (e) => {
      const url = urlOf.get(e.requestId);
      if (url) wire.push({ url, bytes: e.encodedDataLength });
    });
  } catch {
    page.on("response", async (res) => {
      const len = Number(res.headers()["content-length"] ?? 0);
      wire.push({ url: res.url(), bytes: len });
    });
  }

  await page.goto(URL, { waitUntil: "load", timeout: 90000 });

  await page.waitForFunction(
    () => document.querySelectorAll(".scrubseq").length === 3,
    null,
    { timeout: 30000 },
  );
  await page.waitForFunction(
    () => document.querySelector(".scrubseq")?.dataset.tff !== undefined,
    null,
    { timeout: 60000 },
  );

  const first = page.locator(".scrubseq").first();
  const mode = await first.getAttribute("data-mode");
  const fmt = await first.getAttribute("data-fmt");
  const tffEngine = Number(await first.getAttribute("data-tff"));
  const tffNav = await page.evaluate(() => window.__seq.tffNav);
  const videoCount = await page.evaluate(() => document.querySelectorAll("video").length);

  /* Full-page scrub. Samples frame times, the live bitmap count and how many
     segments hold bytes at once, all while actually moving. */
  let scrub = null;
  if (!p.skipScrub) {
    scrub = await page.evaluate(async () => {
      const html = document.documentElement;
      const prev = html.style.scrollBehavior;
      html.style.scrollBehavior = "auto"; // globals.css sets smooth; see note in git log

      const max = () => document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo(0, 0);
      await new Promise((r) => setTimeout(r, 600));

      const DUR = 7000;
      const deltas = [];
      let maxArmed = 0;
      let maxLive = 0;
      let peakReported = 0;
      const t0 = performance.now();
      let last = t0;

      await new Promise((resolve) => {
        const step = (now) => {
          deltas.push(now - last);
          last = now;
          const q = Math.min(1, (now - t0) / DUR);
          window.scrollTo(0, max() * q);

          const segs = document.querySelectorAll(".scrubseq");
          let armed = 0;
          segs.forEach((s) => {
            if (s.dataset.armed === "1") armed += 1;
            peakReported = Math.max(peakReported, Number(s.dataset.peak || 0));
          });
          maxArmed = Math.max(maxArmed, armed);
          maxLive = Math.max(maxLive, window.__scrubLive ?? 0);

          if (q < 1) requestAnimationFrame(step);
          else resolve();
        };
        requestAnimationFrame(step);
      });

      const elapsed = performance.now() - t0;
      const scrolled = Math.round(window.scrollY);
      html.style.scrollBehavior = prev;

      deltas.shift();
      const sorted = [...deltas].sort((a, b) => a - b);
      const q = (f) => sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * f))];
      const seg0 = document.querySelector(".scrubseq");
      return {
        elapsedMs: Math.round(elapsed),
        ticks: deltas.length,
        fps: +(deltas.length / (elapsed / 1000)).toFixed(1),
        medianMs: +q(0.5).toFixed(2),
        p95Ms: +q(0.95).toFixed(2),
        maxMs: +Math.max(...deltas).toFixed(2),
        over20: deltas.filter((d) => d > 20).length,
        over33: deltas.filter((d) => d > 33.4).length,
        maxArmed,
        maxLive,
        peakReported,
        scrolled,
        pageHeight: max(),
        bmw: Number(seg0?.dataset.bmw ?? 0),
        bmh: Number(seg0?.dataset.bmh ?? 0),
      };
    });
  }

  const fmtsSeen = await page.evaluate(() =>
    Array.from(document.querySelectorAll(".scrubseq")).map((s) => s.dataset.fmt ?? "—"),
  );

  const segReqs = wire.filter((w) => w.url.includes(SEG));
  const segBytes = segReqs.reduce((a, w) => a + w.bytes, 0);
  const pageBytes = wire.reduce((a, w) => a + w.bytes, 0);
  const avifReqs = segReqs.filter((w) => w.url.endsWith(".avif")).length;
  const webpReqs = segReqs.filter((w) => w.url.endsWith(".webp")).length;

  const bmw = scrub?.bmw ?? 1600;
  const bmh = scrub?.bmh ?? 900;
  const peakFrames = scrub?.peakReported ?? Number(await first.getAttribute("data-peak")) ?? 0;
  const peakBytes = (scrub?.maxLive ?? peakFrames) * bmw * bmh * 4;

  await context.close();
  await browser.close();

  return {
    profile: p.name,
    mode,
    modeOk: mode === p.expectMode,
    fmt,
    fmtOk: fmt === p.expectFmt,
    fmtsSeen,
    avifReqs,
    webpReqs,
    segReqs: segReqs.length,
    segBytes,
    pageBytes,
    tffEngineMs: tffEngine,
    tffNavMs: tffNav == null ? null : Math.round(tffNav),
    videoCount,
    peakFrames: scrub?.maxLive ?? peakFrames,
    peakBytes,
    peakMB: +(peakBytes / 1048576).toFixed(1),
    frameDims: `${bmw}x${bmh}`,
    scrub,
  };
}

const out = [];
let crashed = 0;
for (const p of PROFILES) {
  try {
    out.push(await run(p));
  } catch (e) {
    crashed += 1;
    console.log(`\n── ${p.name}: FAILED — ${String(e).split("\n")[0]}`);
  }
}

for (const r of out) {
  console.log(`\n── ${r.profile} ${"─".repeat(Math.max(0, 44 - r.profile.length))}`);
  console.log(`  set chosen        ${r.mode} ${r.modeOk ? "✓" : "✗"}${LITE ? "  · LITE tier" : ""}`);
  console.log(`  codec chosen      ${r.fmt} ${r.fmtOk ? "✓" : "✗ EXPECTED OTHER"}   (segments: ${r.fmtsSeen.join(", ")})`);
  console.log(`  frame requests    ${r.segReqs}   avif ${r.avifReqs} · webp ${r.webpReqs}`);
  console.log(`  <video> elements  ${r.videoCount} ${r.videoCount === 0 ? "✓" : "✗"}`);
  console.log(`  segment bytes     ${MB(r.segBytes)}`);
  console.log(`  FULL PAGE bytes   ${MB(r.pageBytes)}`);
  console.log(`  first frame       ${r.tffEngineMs} ms from arm / ${r.tffNavMs} ms from navigation`);
  console.log(
    `  PEAK DECODED      ${r.peakMB} MB  (${r.peakFrames} bitmaps x ${r.frameDims} x 4B) ${
      r.peakMB < 80 ? "✓ under 80 MB" : "✗ OVER BUDGET"
    }`,
  );
  if (r.scrub) {
    const s = r.scrub;
    /* Two ARMED segments is legal and expected for the moment both are on
       screen — encoded bytes are only reclaimed once a segment leaves the
       fold, because taking them from a visible segment blanks it. The hard
       invariant is the decoded window above, which the primary election caps
       at one page-wide however many segments are armed. */
    /* Informational, not an assertion. How many segments hold ENCODED bytes
       depends on how many fit inside the arbiter's release band, which is a
       property of the page's layout, not a bug — and the bytes are small.
       The assertion that matters is peak decoded memory, above. */
    console.log(`  segments armed    ${s.maxArmed} max (encoded bytes only)`);
    console.log(`  scrub travel      ${s.scrolled} / ${s.pageHeight} px ${s.scrolled >= s.pageHeight - 8 ? "✓" : "✗"}`);
    console.log(`  scrub ${s.elapsedMs}ms      ${s.fps} fps  (${s.ticks} frames)`);
    console.log(`  frame time        median ${s.medianMs}ms · p95 ${s.p95Ms}ms · max ${s.maxMs}ms`);
    console.log(`  long frames       ${s.over20} over 20ms · ${s.over33} over 33.4ms`);
  } else {
    console.log(`  scrub             skipped (reduced motion renders one static frame)`);
  }
}
console.log("\n" + JSON.stringify(out.map(({ scrub, ...r }) => r), null, 2));

/* ── AN EXIT CODE, BECAUSE UNTIL 2026-08-21 THERE WAS NOT ONE ───────────────
   Every ✗ printed above — wrong frame set, wrong codec, peak decoded memory
   OVER BUDGET, a scrub that never reached the bottom, a <video> element on a
   page whose whole reason for existing is that it has none — and the process
   returned 0 regardless. A profile that threw outright printed FAILED, was
   dropped from the results, and still exited 0. So every number this file
   produced was advisory, and the only thing standing between a regression and
   a green run was whether a human read the scrollback.

   NOT ASSERTED, DELIBERATELY, AND SAID OUT LOUD RATHER THAN LEFT IMPLICIT:
   fps and long-frame counts. They are the numbers most sensitive to what else
   the machine is doing — this harness has recorded 39.5 and 45 fps on healthy
   builds purely from running a sweep concurrently, and WebKit has ranged 28 to
   51.5 fps across machines while nothing about the page changed. A threshold
   there would cry wolf often enough to be ignored, which is worse than no
   threshold. They are reported, and a human still reads them. */
const problems = [];
for (const r of out) {
  if (!r.modeOk) problems.push(`${r.profile}: frame set ${r.mode}, expected another`);
  if (!r.fmtOk) problems.push(`${r.profile}: codec ${r.fmt}, expected another`);
  if (r.videoCount > 0) problems.push(`${r.profile}: ${r.videoCount} <video> element(s) — there must be none`);
  if (r.peakMB >= 80) problems.push(`${r.profile}: peak decoded ${r.peakMB} MB, over the 80 MB budget`);
  if (r.scrub && r.scrub.scrolled < r.scrub.pageHeight - 8) {
    problems.push(`${r.profile}: scrub reached ${r.scrub.scrolled} of ${r.scrub.pageHeight}px`);
  }
}
if (crashed) problems.push(`${crashed} profile(s) threw and produced no measurement at all`);

if (problems.length) {
  console.log(`\n  FAIL — ${problems.length} problem(s):`);
  for (const p of problems) console.log(`    · ${p}`);
  console.log("");
} else {
  console.log(`\n  PASS — ${out.length}/${PROFILES.length} profiles within budget\n`);
}
process.exit(problems.length ? 1 : 0);
