/**
 * REPETITION TEST 3 — the peg grammar as the mark.
 *
 * Three pegs on a broken brass spine. Same atom as the hero: spine · socket ·
 * stem · JOINT · head. One head is graphite, because seven of ninety-seven are
 * offline and the mark tells the truth too.
 *
 * Emits SVG + 32/180/512 PNG. Run: node scripts/make-favicon.mjs
 */
import sharp from "sharp";
import { writeFile, mkdir } from "node:fs/promises";

const HULL = "#040F1E", BRASS = "#C8A96B", BRASS_DIM = "#7A6742";
const SIGNAL = "#00AEEF", DEAD = "#6B7785";

// 32-unit grid. Everything lands on whole or half units so it stays crisp at 32px.
const peg = (x, headColor) => `
  <rect x="${x - 0.5}" y="9" width="1" height="4.5" fill="${BRASS_DIM}"/>
  <rect x="${x - 1.5}" y="17" width="3" height="10" fill="${headColor}"/>`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" fill="${HULL}"/>
  <!-- the spine, broken between branches — never through a peg, because every
       peg must be pegged to something -->
  <rect x="4"  y="6" width="7.5"  height="3" fill="${BRASS}"/>
  <rect x="14" y="6" width="14"   height="3" fill="${BRASS}"/>
  <!-- three pegs: socket, stem, JOINT, head -->
  ${peg(7.5, SIGNAL)}
  ${peg(17.5, DEAD)}
  ${peg(24.5, SIGNAL)}
</svg>`;

/* ── 16px optical variant ─────────────────────────────────────────────────
   At 16px the three-peg mark closes its joints and reads as a brass bar over
   three blobs — losing the one feature doing the identifying. This is not a
   redesign: it is an optical size of the same grammar, cut to a single peg so
   spine + JOINT + head all survive the pixel budget. Every edge lands on a whole
   pixel on a 16-unit grid, so nothing is anti-aliased into mush. */
const svg16 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" shape-rendering="crispEdges">
  <rect width="16" height="16" fill="${HULL}"/>
  <rect x="2" y="3"  width="12" height="2" fill="${BRASS}"/>
  <rect x="7" y="5"  width="2"  height="3" fill="${BRASS}"/>
  <rect x="6" y="10" width="4"  height="4" fill="${SIGNAL}"/>
</svg>`;

await mkdir("public/brand", { recursive: true });
await writeFile("public/brand/mark.svg", svg, "utf8");
await writeFile("public/brand/mark-16.svg", svg16, "utf8");
await sharp(Buffer.from(svg16)).resize(16, 16, { kernel: "nearest" }).png().toFile("public/brand/mark-16.png");

for (const size of [32, 180, 512]) {
  await sharp(Buffer.from(svg))
    .resize(size, size, { kernel: "nearest" })
    .png()
    .toFile(`public/brand/mark-${size}.png`);
}

/* Proof sheet: each size rendered from the variant that actually serves it —
   16px from the single-peg cut, everything else from the three-peg mark. */
const b64 = (x) => Buffer.from(x).toString("base64");
const sizes = [
  { s: 16, src: svg16, note: "single-peg cut" },
  { s: 24, src: svg },
  { s: 32, src: svg },
  { s: 48, src: svg },
  { s: 64, src: svg },
  { s: 128, src: svg },
];
let x = 26;
const tiles = sizes.map(({ s, src, note }) => {
  const t = `<image x="${x}" y="${104 - s / 2}" width="${s}" height="${s}" href="data:image/svg+xml;base64,${b64(src)}"/>
             <text x="${x + s / 2}" y="158" text-anchor="middle" font-family="monospace" font-size="11" fill="#6F8296">${s}px</text>
             ${note ? `<text x="${x + s / 2}" y="172" text-anchor="middle" font-family="monospace" font-size="9" fill="#C8A96B">${note}</text>` : ""}`;
  x += s + 36;
  return t;
});
const sheet = `<svg xmlns="http://www.w3.org/2000/svg" width="${x + 10}" height="186" viewBox="0 0 ${x + 10} 186">
  <rect width="100%" height="100%" fill="#02080F"/>${tiles.join("")}</svg>`;
await sharp(Buffer.from(sheet)).png().toFile("public/brand/mark-sizes.png");

/* 16px inspection: actual size beside an 8x nearest-neighbour blow-up. */
const insp = `<svg xmlns="http://www.w3.org/2000/svg" width="360" height="200" viewBox="0 0 360 200">
  <rect width="100%" height="100%" fill="#02080F"/>
  <image x="30" y="92" width="16" height="16" href="data:image/svg+xml;base64,${b64(svg16)}"/>
  <text x="38" y="128" text-anchor="middle" font-family="monospace" font-size="11" fill="#6F8296">16px actual</text>
  <image x="128" y="28" width="128" height="128" href="data:image/svg+xml;base64,${b64(svg16)}" style="image-rendering:pixelated"/>
  <text x="192" y="174" text-anchor="middle" font-family="monospace" font-size="11" fill="#6F8296">same file, 8x</text>
  <text x="278" y="70"  font-family="monospace" font-size="10" fill="#C8A96B">spine</text>
  <text x="278" y="104" font-family="monospace" font-size="10" fill="#C8A96B">JOINT</text>
  <text x="278" y="140" font-family="monospace" font-size="10" fill="#00AEEF">head</text>
</svg>`;
await sharp(Buffer.from(insp)).png().toFile("public/brand/mark-16-inspection.png");

console.log("wrote mark.svg, mark-16.svg, 16/32/180/512 PNG, mark-sizes.png, mark-16-inspection.png");
