/**
 * Find camera reversals: places where the shot goes backwards.
 *
 * The flicker/cut/morph checks already in clip-analyse all look at ADJACENT
 * frames, and a reversal is invisible to every one of them — each individual
 * step is small and smooth, the sequence just walks back the way it came.
 *
 * Two signals, both from a 16x16 greyscale signature per frame:
 *
 *   progress[i]  distance from the FIRST frame. A continuous camera move —
 *                forward or back, it does not matter which — makes this rise
 *                more or less monotonically, because the picture keeps getting
 *                further from where it started. A sustained DIP means the
 *                camera returned toward a position it already held.
 *
 *   recall[i]    distance to the closest EARLIER frame more than a few frames
 *                back. Small means "we have been here before". This is what
 *                separates the two causes the fix depends on: a stutter lands
 *                almost exactly on an earlier frame (recall ~ 0, droppable),
 *                whereas a genuine backward camera move produces new footage
 *                of old geography (recall clearly above the noise floor, and
 *                nothing you can fix by deleting frames).
 *
 *   node scripts/clip-reversal.mjs <clip.mp4> [more.mp4 ...]
 */
import { execFileSync } from "node:child_process";
import { mkdtempSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, basename } from "node:path";
import ffmpegPath from "ffmpeg-static";
import sharp from "sharp";

const S = 16; // signature grid
const GAP = 4; // frames to ignore either side when looking for a recall
const clips = process.argv.slice(2);
if (!clips.length) {
  console.error("usage: node scripts/clip-reversal.mjs <clip.mp4> [...]");
  process.exit(1);
}

const dist = (a, b) => {
  let s = 0;
  for (let i = 0; i < a.length; i += 1) s += Math.abs(a[i] - b[i]);
  return s / a.length;
};

for (const clip of clips) {
  const dir = mkdtempSync(join(tmpdir(), "rev-"));
  try {
    execFileSync(ffmpegPath, ["-v", "error", "-i", clip, "-vf", `scale=${S}:${S}`, join(dir, "f_%04d.png")]);
    const files = readdirSync(dir).filter((f) => f.endsWith(".png")).sort();
    const sig = [];
    for (const f of files) {
      const { data } = await sharp(join(dir, f)).greyscale().raw().toBuffer({ resolveWithObject: true });
      sig.push(Array.from(data));
    }
    const n = sig.length;

    const progress = sig.map((s) => dist(s, sig[0]));
    const adj = [];
    for (let i = 1; i < n; i += 1) adj.push(dist(sig[i], sig[i - 1]));
    const adjMed = [...adj].sort((a, b) => a - b)[Math.floor(adj.length / 2)];

    /* Closest earlier frame, ignoring the immediate neighbourhood. */
    const recall = new Array(n).fill(Infinity);
    const recallAt = new Array(n).fill(-1);
    for (let i = GAP + 1; i < n; i += 1) {
      for (let j = 0; j < i - GAP; j += 1) {
        const d = dist(sig[i], sig[j]);
        if (d < recall[i]) {
          recall[i] = d;
          recallAt[i] = j;
        }
      }
    }

    /* A reversal is a sustained fall in progress, not a single wobble. */
    const runs = [];
    let start = -1;
    for (let i = 1; i < n; i += 1) {
      const falling = progress[i] < progress[i - 1] - adjMed * 0.35;
      if (falling && start < 0) start = i - 1;
      if (!falling && start >= 0) {
        if (i - 1 - start >= 3) runs.push([start, i - 1]);
        start = -1;
      }
    }
    if (start >= 0 && n - 1 - start >= 3) runs.push([start, n - 1]);

    console.log(`\n══ ${basename(clip)} · ${n} frames ══`);
    console.log(`  adjacent-step median ${adjMed.toFixed(2)}   progress range 0 → ${Math.max(...progress).toFixed(1)}`);

    if (!runs.length) {
      console.log(`  NO REVERSAL — progress never falls for more than 2 frames`);
    } else {
      for (const [a, b] of runs) {
        const drop = progress[a] - progress[b];
        const backTo = progress.findIndex((p) => p >= progress[b]);
        const rc = recall.slice(a, b + 1);
        const minRecall = Math.min(...rc);
        const where = recallAt[a + rc.indexOf(minRecall)];
        const ratio = minRecall / adjMed;
        console.log(
          `  REVERSAL frames ${a + 1}-${b + 1} (${b - a} frames, ~${((b - a) / 24).toFixed(2)}s)  ` +
            `progress ${progress[a].toFixed(1)} → ${progress[b].toFixed(1)} (-${drop.toFixed(1)}), ` +
            `back to roughly frame ${backTo + 1}`,
        );
        console.log(
          `           closest earlier frame ${where + 1} at distance ${minRecall.toFixed(2)} ` +
            `= ${ratio.toFixed(2)}x the adjacent step  → ${
              ratio < 0.5 ? "STUTTER (lands on footage we already have — droppable)" : "NEW FOOTAGE of a backward move (needs a re-roll)"
            }`,
        );
      }
    }

    const marks = progress
      .map((p, i) => `${i + 1}:${p.toFixed(0)}`)
      .filter((_, i) => i % 5 === 0)
      .join(" ");
    console.log(`  progress/5: ${marks}`);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}
