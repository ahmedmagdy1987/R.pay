/**
 * Resolve the pacing curves into the two numbers that can be argued about.
 *
 *   px / sec        how much scroll a second of footage costs.
 *   FRAMES / NOTCH  how much film one flick of the wheel spends.
 *
 * THE SECOND ONE IS THE ONE THE HAND FEELS, and it is the reason this script
 * grew. A passage can be given a long page and still escape the reader: if one
 * ~100px wheel notch advances five frames, the film is gone before the gesture
 * finishes, however many pixels the section occupies. "Too fast" hides two
 * different faults — too little distance, and too little damping — and only
 * frames-per-notch separates them. Damping cannot change this number at all;
 * it only decides how quickly the picture arrives at it.
 *
 * IT READS THE CURVES OUT OF THE PAGE. They used to be copied into this file
 * by hand, which meant every pacing change silently invalidated the table —
 * the same failure that let build-segments.sh rebuild the wrong film. The only
 * numbers still hardcoded are the footage durations, which come from the
 * deduplicated masters rather than from any source file.
 *
 * Model, taken from components/ScrubSequence.tsx rather than assumed:
 *   span = (scrollVh/100 - 1) * vh ; p = -top/span ; x = p * total
 *   frameAt walks `cum`, which advances by `weight` per frame step, so inside
 *   a band of weight w:   frames per notch = NOTCH * total / (span * w)
 *
 *   node scripts/pacing-table.mjs [viewportPx]
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const REPO = join(dirname(fileURLToPath(import.meta.url)), "..");
const PAGE = join(REPO, "app/concepts/lab/page.tsx");
const SRC = readFileSync(PAGE, "utf8");

const NOTCH = 100; // a standard wheel notch, in px

/* From the deduplicated masters: segment B is 207 unique frames at 24fps. */
const SECONDS = { A: 235 / 24, B: 207 / 24, C: 242 / 24 };

const LABELS = {
  A: ["orbit", "cloud", "aerial Riyadh", "boulevard", "mall entrance", "settle into DOM A"],
  B: ["corridor glide", "machine, wide", "crawl the panel", "the touch", "settle into DOM B"],
  C: ["the pulse", "pull back", "constellation", "settle into DOM C"],
};

function bandsOf(id) {
  const m = SRC.match(new RegExp(`const PACING_${id}[^=]*=\\s*\\[([\\s\\S]*?)\\];`));
  if (!m) {
    console.error(`ABORT: PACING_${id} not found in ${PAGE}`);
    process.exit(1);
  }
  const rows = [...m[1].matchAll(/from:\s*([\d.]+),\s*to:\s*([\d.]+),\s*weight:\s*([\d.]+)/g)];
  if (!rows.length) {
    console.error(`ABORT: PACING_${id} parsed to zero bands`);
    process.exit(1);
  }
  return rows.map((r) => ({ from: +r[1], to: +r[2], weight: +r[3] }));
}

const vhHits = [...SRC.matchAll(/scrollVh=\{(\d+)\}/g)].map((m) => +m[1]);
if (vhHits.length !== 3) {
  console.error(`ABORT: expected 3 scrollVh props, found ${vhHits.length}`);
  process.exit(1);
}
const SCROLL_VH = { A: vhHits[0], B: vhHits[1], C: vhHits[2] };

const VH = Number(process.argv[2] ?? 900);
const N = 90; // desktop frames per segment

const rows = [];
let filmPx = 0;

for (const id of ["A", "B", "C"]) {
  const bands = bandsOf(id);
  const span = (SCROLL_VH[id] / 100 - 1) * VH;
  filmPx += span;

  const w = new Float64Array(N).fill(1);
  for (const b of bands) {
    const lo = Math.round(b.from * (N - 1));
    const hi = Math.round(b.to * (N - 1));
    for (let i = lo; i <= hi; i += 1) w[i] = Math.max(0.01, b.weight);
  }
  const cum = new Float64Array(N);
  let acc = 0;
  for (let i = 1; i < N; i += 1) {
    acc += (w[i - 1] + w[i]) / 2;
    cum[i] = acc;
  }
  const total = cum[N - 1] || 1;

  bands.forEach((b, i) => {
    const lo = Math.round(b.from * (N - 1));
    const hi = Math.round(b.to * (N - 1));
    rows.push({
      seg: id,
      name: LABELS[id][i] ?? `band ${i}`,
      px: (span * (cum[hi] - cum[lo])) / total,
      secs: (b.to - b.from) * SECONDS[id],
      frames: hi - lo,
      perNotch: (NOTCH * total) / (span * b.weight),
      screens: (span * (cum[hi] - cum[lo])) / total / VH,
    });
  });
  rows.push(null);
}

console.log(`\nPACING — viewport ${VH}px, notch ${NOTCH}px`);
console.log(`  A ${SCROLL_VH.A}vh · B ${SCROLL_VH.B}vh · C ${SCROLL_VH.C}vh, read from page.tsx\n`);
console.log(
  `  ${"".padEnd(2)}${"shot".padEnd(20)}${"footage".padStart(8)}${"scroll".padStart(9)}${"px / sec".padStart(10)}${"frames".padStart(8)}${"f / NOTCH".padStart(11)}`,
);
console.log(`  ${"-".repeat(68)}`);

const rated = rows.filter(Boolean);
for (const r of rows) {
  if (!r) {
    console.log("");
    continue;
  }
  const bar = r.perNotch > 3 ? "  ← fast" : r.perNotch <= 1.35 ? "  ← resists" : "";
  console.log(
    `  ${r.seg} ${r.name.padEnd(18)}${r.secs.toFixed(2).padStart(7)}s${Math.round(r.px).toString().padStart(8)}px${Math.round(r.px / r.secs).toString().padStart(10)}${String(r.frames).padStart(8)}${r.perNotch.toFixed(2).padStart(11)}${bar}`,
  );
}

const byRate = [...rated].sort((a, b) => b.px / b.secs - a.px / a.secs);
const byNotch = [...rated].sort((a, b) => b.perNotch - a.perNotch);
const touch = rated.find((r) => r.name === "the touch");

console.log(`  slowest  ${byRate[0].seg} · ${byRate[0].name} — ${Math.round(byRate[0].px / byRate[0].secs)} px/s`);
console.log(
  `  fastest  ${byRate.at(-1).seg} · ${byRate.at(-1).name} — ${Math.round(byRate.at(-1).px / byRate.at(-1).secs)} px/s`,
);
console.log(`  ratio    ${(byRate[0].px / byRate[0].secs / (byRate.at(-1).px / byRate.at(-1).secs)).toFixed(1)}x`);
console.log("");
console.log(`  THE TOUCH   ${touch.perNotch.toFixed(2)} frames per notch  (target ~1.00)`);
console.log(
  `  loosest     ${byNotch[0].seg} · ${byNotch[0].name} — ${byNotch[0].perNotch.toFixed(2)} f/notch, the fastest thing under the hand`,
);
console.log(`\n  film scroll ${Math.round(filmPx)}px = ${(filmPx / VH).toFixed(1)} viewports\n`);
