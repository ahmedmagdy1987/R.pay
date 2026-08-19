/**
 * Which way is the camera actually moving, frame by frame?
 *
 * Everything else in this toolbox measures how MUCH changed. None of it can
 * tell forward from backward, which is why a clip that dollies in, backs up
 * for a second and then carries on passed every existing check.
 *
 * Brightness-based signatures are useless here — tried first, and on clip 3
 * they track the corridor going dark rather than the camera moving, which
 * produced a confident reading of a reversal in the wrong place.
 *
 * THE TEST. A forward dolly makes the next frame a slightly ZOOMED-IN version
 * of the current one. So for each pair, find the centre-crop zoom that best
 * aligns i to i+1, and separately the zoom that best aligns i+1 to i. Whichever
 * direction fits better is the direction the camera went, and the gap between
 * the two errors is the confidence. Lateral pans and static holds land near
 * zero on both and are reported as neither.
 *
 *   node scripts/clip-direction.mjs <clip.mp4> [more.mp4 ...]
 */
import { execFileSync } from "node:child_process";
import { mkdtempSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, basename } from "node:path";
import ffmpegPath from "ffmpeg-static";
import sharp from "sharp";

const W = 192;
const H = 108;
const ZOOMS = [1.006, 1.012, 1.02, 1.03, 1.045];

const clips = process.argv.slice(2);
if (!clips.length) {
  console.error("usage: node scripts/clip-direction.mjs <clip.mp4> [...]");
  process.exit(1);
}

/** Centre-crop by `z` then resize back — i.e. zoom in by z. */
async function zoomed(buf, z) {
  const cw = Math.round(W / z);
  const ch = Math.round(H / z);
  const left = Math.round((W - cw) / 2);
  const top = Math.round((H - ch) / 2);
  return sharp(buf, { raw: { width: W, height: H, channels: 1 } })
    .extract({ left, top, width: cw, height: ch })
    .resize(W, H, { kernel: "cubic" })
    /* resize() on a raw 1-channel buffer comes back as 3 channels, which
       silently made every comparison NaN on the first attempt. */
    .greyscale()
    .raw()
    .toBuffer();
}

const mae = (a, b) => {
  let s = 0;
  for (let i = 0; i < a.length; i += 1) s += Math.abs(a[i] - b[i]);
  return s / a.length;
};

for (const clip of clips) {
  const dir = mkdtempSync(join(tmpdir(), "dir-"));
  try {
    execFileSync(ffmpegPath, [
      "-v", "error", "-i", clip,
      "-vf", `scale=${W}:${H},format=gray`,
      join(dir, "f_%04d.png"),
    ]);
    const files = readdirSync(dir).filter((f) => f.endsWith(".png")).sort();
    const frames = [];
    for (const f of files) frames.push(await sharp(join(dir, f)).greyscale().raw().toBuffer());
    const n = frames.length;

    const dirs = [];
    for (let i = 0; i < n - 1; i += 1) {
      const a = frames[i];
      const b = frames[i + 1];
      let fwd = Infinity;
      let bwd = Infinity;
      for (const z of ZOOMS) {
        fwd = Math.min(fwd, mae(await zoomed(a, z), b));
        bwd = Math.min(bwd, mae(await zoomed(b, z), a));
      }
      const flat = mae(a, b);
      dirs.push({ i: i + 1, fwd, bwd, flat, score: bwd - fwd });
    }

    const scores = dirs.map((d) => d.score);
    const absSorted = scores.map(Math.abs).sort((x, y) => x - y);
    const noise = absSorted[Math.floor(absSorted.length * 0.5)]; // median |score|
    const TH = Math.max(noise * 1.2, 0.05);

    /* A reversal worth reporting is a RUN of backward frames, not one noisy
       pair. Three frames is an eighth of a second — below that nobody sees it. */
    const runs = [];
    let start = -1;
    for (let i = 0; i < dirs.length; i += 1) {
      const back = dirs[i].score < -TH;
      if (back && start < 0) start = i;
      if (!back && start >= 0) {
        if (i - start >= 3) runs.push([start, i - 1]);
        start = -1;
      }
    }
    if (start >= 0 && dirs.length - start >= 3) runs.push([start, dirs.length - 1]);

    const fwdCount = scores.filter((s) => s > TH).length;
    const bwdCount = scores.filter((s) => s < -TH).length;

    console.log(`\n══ ${basename(clip)} · ${n} frames ══`);
    console.log(`  forward pairs ${fwdCount}   backward pairs ${bwdCount}   ambiguous ${dirs.length - fwdCount - bwdCount}   (threshold ${TH.toFixed(3)})`);

    if (!runs.length) {
      console.log(`  NO SUSTAINED REVERSAL — no run of 3+ consecutive backward frames`);
    } else {
      for (const [a, b] of runs) {
        const len = b - a + 1;
        const strength = scores.slice(a, b + 1).reduce((x, y) => x + y, 0) / len;
        console.log(
          `  REVERSAL frames ${dirs[a].i}-${dirs[b].i + 1}  (${len} pairs, ${(len / 24).toFixed(2)}s)  ` +
            `mean score ${strength.toFixed(3)}`,
        );
      }
    }

    const strip = dirs
      .filter((_, i) => i % 4 === 0)
      .map((d) => `${d.i}:${d.score > TH ? "+" : d.score < -TH ? "-" : "·"}`)
      .join(" ");
    console.log(`  direction/4: ${strip}`);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}
