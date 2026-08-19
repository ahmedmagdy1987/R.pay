/**
 * Turn the pacing curves into scroll-pixels per second of footage.
 *
 * The weights in the page are relative, which makes them impossible to argue
 * about. This resolves them against the real segment heights and the real
 * footage durations, so the shape of the pacing can be read at a glance and
 * compared shot to shot — which is the only way to tell whether the touch is
 * actually the slowest thing on the page or just nominally weighted highest.
 *
 *   node scripts/pacing-table.mjs [viewportPx]
 */
const VH = Number(process.argv[2] ?? 900);
const N = 90; // desktop frames per segment

/* Segment durations come from the deduplicated masters that were sampled. */
const SEGMENTS = [
  {
    id: "A",
    scrollVh: 320,
    seconds: 235 / 24,
    bands: [
      ["orbit — establishing", 0.0, 0.13, 0.7],
      ["descent through cloud", 0.13, 0.27, 0.55],
      ["aerial Riyadh", 0.27, 0.485, 0.85],
      ["boulevard flyover", 0.485, 0.75, 1.0],
      ["mall entrance, through the doors", 0.75, 0.93, 1.4],
      ["settle into DOM A", 0.93, 1.0, 1.75],
    ],
  },
  {
    id: "B",
    scrollVh: 420,
    seconds: 207 / 24,
    bands: [
      ["corridor glide", 0.0, 0.415, 1.0],
      ["machine, wide and approach", 0.415, 0.6, 1.25],
      ["crawl across the front panel", 0.6, 0.82, 2.1],
      ["the terminal and the touch", 0.82, 0.95, 2.7],
      ["settle into DOM B", 0.95, 1.0, 3.2],
    ],
  },
  {
    id: "C",
    scrollVh: 260,
    seconds: 242 / 24,
    bands: [
      ["the pulse expanding", 0.0, 0.5, 2.3],
      ["pull back toward orbit", 0.5, 0.82, 0.8],
      ["constellation ignites", 0.82, 0.94, 1.2],
      ["settle into DOM C", 0.94, 1.0, 1.6],
    ],
  },
];

const rows = [];
for (const seg of SEGMENTS) {
  const span = (seg.scrollVh / 100 - 1) * VH;

  // same construction the component uses: later bands overwrite earlier ones
  const w = new Float64Array(N).fill(1);
  for (const [, a, b, weight] of seg.bands) {
    const lo = Math.round(a * (N - 1));
    const hi = Math.round(b * (N - 1));
    for (let i = lo; i <= hi; i += 1) w[i] = weight;
  }
  const cum = new Float64Array(N);
  let acc = 0;
  for (let i = 1; i < N; i += 1) {
    acc += (w[i - 1] + w[i]) / 2;
    cum[i] = acc;
  }
  const total = cum[N - 1] || 1;

  for (const [name, a, b] of seg.bands) {
    const lo = Math.round(a * (N - 1));
    const hi = Math.round(b * (N - 1));
    const px = (span * (cum[hi] - cum[lo])) / total;
    const secs = (b - a) * seg.seconds;
    rows.push({
      seg: seg.id,
      name,
      px: Math.round(px),
      secs,
      rate: px / secs,
      screens: px / VH,
    });
  }
  rows.push(null);
}

console.log(`\nPACING — scroll distance per second of footage (viewport ${VH}px)\n`);
console.log(
  `  ${"".padEnd(2)}${"shot".padEnd(36)}${"footage".padStart(8)}${"scroll".padStart(9)}${"screens".padStart(9)}${"px / sec".padStart(11)}`,
);
console.log(`  ${"-".repeat(73)}`);
const rated = rows.filter(Boolean);
const fastest = Math.min(...rated.map((r) => r.rate));
for (const r of rows) {
  if (!r) {
    console.log("");
    continue;
  }
  const bar = "█".repeat(Math.max(1, Math.round((r.rate / fastest) * 2)));
  console.log(
    `  ${r.seg} ${r.name.padEnd(34)}${r.secs.toFixed(2).padStart(7)}s${String(r.px).padStart(8)}px${r.screens.toFixed(2).padStart(8)}${Math.round(r.rate).toString().padStart(10)}  ${bar}`,
  );
}

const sorted = [...rated].sort((a, b) => b.rate - a.rate);
console.log(`  slowest: ${sorted[0].seg} · ${sorted[0].name} at ${Math.round(sorted[0].rate)} px/s`);
console.log(`  fastest: ${sorted[sorted.length - 1].seg} · ${sorted[sorted.length - 1].name} at ${Math.round(sorted[sorted.length - 1].rate)} px/s`);
console.log(`  ratio slowest:fastest = ${(sorted[0].rate / sorted[sorted.length - 1].rate).toFixed(1)}x`);
const totalPx = SEGMENTS.reduce((a, s) => a + (s.scrollVh / 100 - 1) * VH, 0);
console.log(`\n  total film scroll ${Math.round(totalPx)}px (${(totalPx / VH).toFixed(1)} screens), was ${Math.round((2.5 - 1 + 2.5 - 1 + 2.0 - 1) * VH)}px\n`);
