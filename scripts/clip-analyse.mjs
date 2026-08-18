/**
 * Step a clip frame by frame and quantify whether it flickers or morphs.
 *
 * Two signals, both per-frame, both from ffmpeg signalstats:
 *
 *   luma[]  — mean Y of each frame. A generative clip that FLICKERS pumps
 *             brightness between adjacent frames; the tell is a luma series
 *             that oscillates rather than moving monotonically.
 *
 *   delta[] — mean Y of tblend(difference) between each frame and the one
 *             before. Honest camera movement produces a smooth, slowly
 *             varying delta. A hard CUT produces a single tall spike. A MORPH
 *             — geometry dissolving into different geometry rather than
 *             translating — produces a sustained plateau of elevated delta
 *             without any corresponding structure change in the luma series.
 *
 * Usage: node scripts/clip-analyse.mjs <clip.mp4>
 */
import { execFileSync } from "node:child_process";
import ffmpegPath from "ffmpeg-static";
import ffprobe from "ffprobe-static";

const clip = process.argv[2];
if (!clip) {
  console.error("usage: node scripts/clip-analyse.mjs <clip.mp4>");
  process.exit(1);
}

/* ---------------------------------------------------------------- probe */

const probeRaw = execFileSync(
  ffprobe.path,
  [
    "-v", "error",
    "-show_entries", "format=duration,size",
    "-show_entries", "stream=codec_name,width,height,r_frame_rate,nb_frames,pix_fmt",
    "-of", "json",
    clip,
  ],
  { encoding: "utf8" },
);
const probe = JSON.parse(probeRaw);
const v = probe.streams.find((s) => s.width) ?? {};

/* ------------------------------------------------------------ per-frame */

/** Run a filter chain that ends in signalstats+metadata and harvest YAVG. */
const yavg = (filter) => {
  const out = execFileSync(
    ffmpegPath,
    ["-v", "error", "-i", clip, "-vf", `${filter},signalstats,metadata=print:file=-`, "-f", "null", "-"],
    { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 },
  );
  return out
    .split("\n")
    .filter((l) => l.includes("lavfi.signalstats.YAVG"))
    .map((l) => Number(l.split("=").pop()));
};

const luma = yavg("null");
// tblend(difference) emits one frame per input pair; frame 0 has no predecessor.
const delta = yavg("tblend=all_mode=difference").slice(1);

/* ------------------------------------------------------------- verdicts */

const mean = (a) => a.reduce((x, y) => x + y, 0) / a.length;
const sd = (a) => {
  const m = mean(a);
  return Math.sqrt(mean(a.map((x) => (x - m) ** 2)));
};

const dMean = mean(delta);
const dSd = sd(delta);
const dMax = Math.max(...delta);
const spikeAt = delta.indexOf(dMax);

// A cut is a delta far outside the clip's own distribution.
const cuts = delta
  .map((d, i) => ({ i: i + 1, d }))
  .filter((x) => x.d > dMean + 6 * dSd && x.d > dMean * 3);

// Flicker: luma reversing direction frame to frame, repeatedly, by a
// perceptible amount. Direction changes alone are noise; magnitude gates it.
let reversals = 0;
for (let i = 2; i < luma.length; i += 1) {
  const a = luma[i - 1] - luma[i - 2];
  const b = luma[i] - luma[i - 1];
  if (a * b < 0 && Math.abs(a) > 0.5 && Math.abs(b) > 0.5) reversals += 1;
}
const flickerPct = (reversals / Math.max(1, luma.length - 2)) * 100;

const round = (n, p = 2) => Number(n.toFixed(p));

console.log(`\nclip            ${clip}`);
console.log(`codec           ${v.codec_name} ${v.width}x${v.height} ${v.pix_fmt} ${v.r_frame_rate}`);
console.log(`duration        ${probe.format.duration}s · ${v.nb_frames} frames · ${(Number(probe.format.size) / 1048576).toFixed(2)} MB`);
console.log(`\nluma  mean ${round(mean(luma))}  sd ${round(sd(luma))}  min ${round(Math.min(...luma))}  max ${round(Math.max(...luma))}`);
console.log(`delta mean ${round(dMean)}  sd ${round(dSd)}  max ${round(dMax)} @ frame ${spikeAt + 1}`);

console.log(`\nFLICKER   ${reversals} luma reversals over ${luma.length} frames (${round(flickerPct, 1)}%)`);
console.log(`          ${flickerPct < 15 ? "clean — no brightness pumping" : flickerPct < 35 ? "mild pumping, watch it" : "FLICKERS"}`);

console.log(`\nCUTS      ${cuts.length === 0 ? "none — delta never leaves its own distribution" : cuts.map((c) => `frame ${c.i} (Δ${round(c.d)})`).join(", ")}`);

/* High-motion runs. NOT a morph detector — read the caveat.
   Frame delta measures how MUCH changed, never WHAT changed, so a fast dolly
   and a dissolve produce the same elevated numbers. On the first clip through
   here this flagged a 13-frame "morph" that turned out to be an honest radial
   plunge: the same towers persisted and scaled across every frame. The run is
   therefore reported as a place to LOOK, not as a verdict. Pull a contact
   sheet over the range and check whether objects keep their identity:

     ffmpeg -i clip.mp4 -vf "select='between(n,START,END)',scale=640:360,tile=3x2" \
            -frames:v 1 sheet.png
*/
const sorted = [...delta].sort((a, b) => a - b);
const med = sorted[Math.floor(sorted.length / 2)];
let run = 0;
let worstRun = 0;
let worstAt = 0;
delta.forEach((d, i) => {
  if (d > med * 2) {
    run += 1;
    if (run > worstRun) {
      worstRun = run;
      worstAt = i + 2 - run;
    }
  } else run = 0;
});
console.log(`\nHIGH-MOTION  longest run above 2x median delta: ${worstRun} frames${worstRun ? ` starting at frame ${worstAt}` : ""}`);
console.log(
  worstRun <= 2
    ? "             nothing to inspect"
    : `             INSPECT frames ${worstAt}-${worstAt + worstRun - 1} by eye — fast motion and a dissolve score identically here`,
);

/* Near-duplicate frames. A generative clip is often N fps of unique content
   padded up to its container rate; sampling a scrub sequence off those pads
   puts two identical stills side by side and the scrub visibly hitches.
   Extract from a mpdecimate'd stream when this count is non-zero. */
const dead = delta.map((d, i) => ({ i: i + 2, d })).filter((x) => x.d < med * 0.15);
console.log(`\nNEAR-DUPES   ${dead.length} frames carry almost no new information`);
if (dead.length) {
  console.log(`             at ${dead.map((x) => x.i).join(", ")}`);
  console.log(`             extract via: -vf "mpdecimate,setpts=N/24/TB" before sampling`);
}

console.log(`\nper-frame delta:`);
console.log(delta.map((d, i) => `${String(i + 2).padStart(3)}:${round(d, 1)}`).join("  "));
