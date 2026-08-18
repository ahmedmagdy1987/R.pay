/**
 * Encode the shipped frame sets from the lossless PNG intermediates.
 *
 * WHY sharp AND NOT ffmpeg: ffmpeg 6.1's AVIF output writes a file with a
 * valid `ftypavif` header that NO browser will decode — verified against
 * Chrome, Edge, Firefox and WebKit, all of which decode the sibling WebP
 * from the same run. sharp goes through libheif and produces AVIF that
 * actually paints. Never trust an image encoder you have not loaded in a
 * browser.
 *
 * WHY q45 AND NOT q65: measured over a 12-frame sample of segment A against
 * the lossless reference. Valid AVIF at quality 65 is 30% LARGER than WebP
 * q64 for this material. Quality 45 lands at SSIM 0.9842 — a shade above
 * WebP q64's 0.9826 and level with WebP q72's 0.9844 — for 29% fewer bytes
 * than q64 and 36% fewer than q72.
 *
 * Usage: node scripts/encode-segments.mjs <pngRootDir>
 */
import sharp from "sharp";
import { mkdirSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const SP = process.argv[2];
if (!SP) {
  console.error("usage: node scripts/encode-segments.mjs <scratchpad-with-png-*-dirs>");
  process.exit(1);
}

const OUT = new URL("../public/assets/lab/seg/", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const AVIF = { quality: 45, effort: 7 };
const WEBP = { quality: 64 };

const totals = {};

for (const segName of ["a", "b", "c"]) {
  for (const v of ["w", "t"]) {
    const src = join(SP, `png-${segName}-${v}`);
    const dst = join(OUT, segName, v);
    rmSync(dst, { recursive: true, force: true });
    mkdirSync(dst, { recursive: true });

    const files = readdirSync(src).filter((f) => f.endsWith(".png")).sort();
    let a = 0;
    let w = 0;
    const t0 = Date.now();

    for (const f of files) {
      const base = f.replace(/\.png$/, "");
      const inPath = join(src, f);
      // Encode both from the SAME lossless pixels — siblings, not a chain.
      await sharp(inPath).avif(AVIF).toFile(join(dst, `${base}.avif`));
      await sharp(inPath).webp(WEBP).toFile(join(dst, `${base}.webp`));
      a += statSync(join(dst, `${base}.avif`)).size;
      w += statSync(join(dst, `${base}.webp`)).size;
    }

    totals[`${segName}/${v}`] = { avif: a, webp: w, frames: files.length };
    console.log(
      `${segName}/${v}  ${files.length} frames  avif ${(a / 1048576).toFixed(2)} MB  ` +
        `webp ${(w / 1048576).toFixed(2)} MB  (${((Date.now() - t0) / 1000).toFixed(0)}s)`,
    );
  }
}

let ta = 0;
let tw = 0;
let tat = 0;
let twt = 0;
for (const [k, v] of Object.entries(totals)) {
  if (k.endsWith("/w")) { ta += v.avif; tw += v.webp; }
  else { tat += v.avif; twt += v.webp; }
}
console.log();
console.log(`DESKTOP total  avif ${(ta / 1048576).toFixed(2)} MB   webp ${(tw / 1048576).toFixed(2)} MB`);
console.log(`MOBILE  total  avif ${(tat / 1048576).toFixed(2)} MB   webp ${(twt / 1048576).toFixed(2)} MB`);
writeFileSync(join(SP, "encode-totals.json"), JSON.stringify(totals, null, 2));
console.log("ENCODE COMPLETE");
