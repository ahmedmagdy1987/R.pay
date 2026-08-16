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

await mkdir("public/brand", { recursive: true });
await writeFile("public/brand/mark.svg", svg, "utf8");

for (const size of [32, 180, 512]) {
  await sharp(Buffer.from(svg))
    .resize(size, size, { kernel: "nearest" })
    .png()
    .toFile(`public/brand/mark-${size}.png`);
}

// Legibility proof sheet: the mark at the sizes it actually gets used at.
const sizes = [16, 24, 32, 48, 64, 128];
let x = 24;
const tiles = sizes.map((s) => {
  const t = `<image x="${x}" y="${100 - s / 2}" width="${s}" height="${s}" href="data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}"/>
             <text x="${x + s / 2}" y="152" text-anchor="middle" font-family="monospace" font-size="11" fill="#6F8296">${s}px</text>`;
  x += s + 34;
  return t;
});
const sheet = `<svg xmlns="http://www.w3.org/2000/svg" width="${x + 10}" height="176" viewBox="0 0 ${x + 10} 176">
  <rect width="100%" height="100%" fill="#02080F"/>${tiles.join("")}</svg>`;
await sharp(Buffer.from(sheet)).png().toFile("public/brand/mark-sizes.png");

console.log("wrote public/brand/mark.svg + 32/180/512 + mark-sizes.png");
