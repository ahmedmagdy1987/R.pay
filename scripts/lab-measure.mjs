/**
 * Measure the ScrubSequence engine on /concepts/lab.
 *
 * Reports, per breakpoint: bytes actually transferred for the frame set,
 * time to first rendered frame, and the frame-time distribution during an
 * uninterrupted programmatic scrub of the whole pin.
 *
 * Frame-time percentiles matter more than the headline fps: a harness can
 * report 60fps while dropping every fourth frame, and p95 catches that.
 *
 * Usage: node scripts/lab-measure.mjs [baseUrl]
 */
import { chromium } from "playwright";

const BASE = process.argv[2] ?? "http://127.0.0.1:3210";
const URL = `${BASE}/concepts/lab`;

const SEQ = "/assets/lab/seq/";
const WIDE_DIR = "/assets/lab/seq/w/";
const TALL_DIR = "/assets/lab/seq/t/";

const PROFILES = [
  {
    name: "desktop",
    ctx: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 },
    expectMode: "wide",
    expectFrames: 60,
    expectDir: WIDE_DIR,
    forbidDir: TALL_DIR,
  },
  {
    name: "mobile",
    ctx: {
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 3,
      isMobile: true,
      hasTouch: true,
    },
    expectMode: "tall",
    expectFrames: 40,
    expectDir: TALL_DIR,
    forbidDir: WIDE_DIR,
  },
  {
    name: "reduced-motion",
    ctx: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, reducedMotion: "reduce" },
    expectMode: "static",
    expectFrames: 1,
    expectDir: WIDE_DIR,
    forbidDir: TALL_DIR,
    skipScrub: true,
  },
];

const fmtKB = (b) => `${(b / 1024).toFixed(1)} KB`;

async function run(browser, p) {
  const context = await browser.newContext(p.ctx);
  const page = await context.newPage();

  // Nav-relative first-frame timestamp, captured in the page before any script runs.
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

  // CDP gives encodedDataLength — real bytes on the wire, not decoded size.
  const cdp = await context.newCDPSession(page);
  await cdp.send("Network.enable");
  const urlOf = new Map();
  const wire = [];
  cdp.on("Network.requestWillBeSent", (e) => urlOf.set(e.requestId, e.request.url));
  cdp.on("Network.responseReceived", (e) => urlOf.set(e.requestId, e.response.url));
  cdp.on("Network.loadingFinished", (e) => {
    const url = urlOf.get(e.requestId);
    if (url) wire.push({ url, bytes: e.encodedDataLength });
  });

  await page.goto(URL, { waitUntil: "load", timeout: 60000 });

  const seq = page.locator(".scrubseq");
  await seq.waitFor({ state: "attached", timeout: 30000 });
  await page.waitForFunction(() => document.querySelector(".scrubseq")?.dataset.tff !== undefined, {
    timeout: 30000,
  });

  const mode = await seq.getAttribute("data-mode");
  const tffEngine = Number(await seq.getAttribute("data-tff"));
  const tffNav = await page.evaluate(() => window.__seq.tffNav);

  // Wait for the whole set to decode before measuring steady-state scrub.
  await page.waitForFunction(
    (n) => Number(document.querySelector(".scrubseq")?.dataset.loaded ?? 0) >= n,
    p.expectFrames,
    { timeout: 60000 },
  );
  const decodeDone = await page.evaluate(() => performance.now());

  // No <video> may exist on this page — that is the whole point.
  const videoCount = await page.evaluate(() => document.querySelectorAll("video").length);

  let scrub = null;
  if (!p.skipScrub) {
    scrub = await page.evaluate(async () => {
      // globals.css sets html{scroll-behavior:smooth}, which animates every
      // programmatic scrollTo. Left on, the per-frame ramp below restarts an
      // animation each tick and the page barely moves — the engine then has
      // nothing to redraw and the harness reports a flattering 60fps for an
      // idle canvas. Wheel and touch scrubbing are unaffected by this
      // property, so switching it off is what makes the measurement match
      // what a finger actually produces.
      const html = document.documentElement;
      const prevBehavior = html.style.scrollBehavior;
      html.style.scrollBehavior = "auto";

      const el = document.querySelector(".scrubseq");
      const top = window.scrollY + el.getBoundingClientRect().top;
      const span = el.offsetHeight - window.innerHeight;
      window.scrollTo(0, top);
      await new Promise((r) => setTimeout(r, 400));

      const before = Number(el.dataset.draws || 0);
      const DUR = 2500;
      const deltas = [];
      const t0 = performance.now();
      let last = t0;

      await new Promise((resolve) => {
        const step = (now) => {
          deltas.push(now - last);
          last = now;
          const q = Math.min(1, (now - t0) / DUR);
          window.scrollTo(0, top + span * q);
          if (q < 1) requestAnimationFrame(step);
          else resolve();
        };
        requestAnimationFrame(step);
      });

      const elapsed = performance.now() - t0;
      const draws = Number(el.dataset.draws || 0) - before;
      const moved = Math.round(window.scrollY - top);
      html.style.scrollBehavior = prevBehavior;

      deltas.shift(); // first delta is measured against t0, not a real frame
      const sorted = [...deltas].sort((a, b) => a - b);
      const q = (f) => sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * f))];
      return {
        elapsedMs: +elapsed.toFixed(0),
        ticks: deltas.length,
        fps: +(deltas.length / (elapsed / 1000)).toFixed(1),
        medianMs: +q(0.5).toFixed(2),
        p95Ms: +q(0.95).toFixed(2),
        maxMs: +Math.max(...deltas).toFixed(2),
        // 16.7ms is the vsync boundary itself, so counting ">16.7" just counts
        // float jitter. 20ms is the first threshold that means anything.
        over20: deltas.filter((d) => d > 20).length,
        over33: deltas.filter((d) => d > 33.4).length,
        draws,
        scrolledPx: moved,
        spanPx: span,
      };
    });
  }

  const seqReqs = wire.filter((w) => w.url.includes(SEQ));
  const bytes = seqReqs.reduce((a, w) => a + w.bytes, 0);
  const wrongSet = wire.filter((w) => w.url.includes(p.forbidDir)).length;

  await context.close();

  return {
    profile: p.name,
    mode,
    modeOk: mode === p.expectMode,
    requests: seqReqs.length,
    bytes,
    bytesLabel: fmtKB(bytes),
    tffEngineMs: tffEngine,
    tffNavMs: tffNav == null ? null : Math.round(tffNav),
    fullDecodeMs: Math.round(decodeDone),
    videoElements: videoCount,
    wrongSetRequests: wrongSet,
    scrub,
  };
}

const browser = await chromium.launch();
const out = [];
try {
  for (const p of PROFILES) out.push(await run(browser, p));
} finally {
  await browser.close();
}

for (const r of out) {
  console.log(`\n── ${r.profile} ${"─".repeat(Math.max(0, 46 - r.profile.length))}`);
  console.log(`  set chosen        ${r.mode} ${r.modeOk ? "✓" : "✗ EXPECTED OTHER"}`);
  console.log(`  wrong-set fetches ${r.wrongSetRequests} ${r.wrongSetRequests === 0 ? "✓" : "✗"}`);
  console.log(`  <video> elements  ${r.videoElements} ${r.videoElements === 0 ? "✓" : "✗"}`);
  console.log(`  frame requests    ${r.requests}`);
  console.log(`  bytes on wire     ${r.bytesLabel}  (${r.bytes})`);
  console.log(`  first frame       ${r.tffEngineMs} ms from engine start / ${r.tffNavMs} ms from navigation`);
  console.log(`  full set decoded  ${r.fullDecodeMs} ms from navigation`);
  if (r.scrub) {
    const s = r.scrub;
    console.log(`  scrub travel      ${s.scrolledPx} / ${s.spanPx} px ${s.scrolledPx >= s.spanPx - 4 ? "✓" : "✗ SCROLL DID NOT COMPLETE"}`);
    console.log(`  scrub ${s.elapsedMs}ms      ${s.fps} fps  (${s.ticks} frames, ${s.draws} canvas draws)`);
    console.log(`  frame time        median ${s.medianMs}ms · p95 ${s.p95Ms}ms · max ${s.maxMs}ms`);
    console.log(`  long frames       ${s.over20} over 20ms · ${s.over33} over 33.4ms`);
  } else {
    console.log(`  scrub             skipped (reduced motion renders one static frame)`);
  }
}
console.log("\n" + JSON.stringify(out, null, 2));
