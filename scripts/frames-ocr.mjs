/**
 * Sweep every shipped scrub frame for readable text.
 *
 * WHY THIS EXISTS: a clip came back with an illuminated sign reading "NADUV"
 * over a mall entrance and it survived a frame-by-frame review, a flicker
 * check, a cut check and a morph check — because all of those look at motion,
 * and none of them read. The art direction forbids text absolutely, so the
 * check has to be mechanical rather than something a person remembers to do.
 *
 * WHY CONFIDENCE IS NOT THE FILTER. The obvious design — run OCR, keep hits
 * above ~55% — was measured against the known-bad frames and does exactly the
 * wrong thing. On those frames Tesseract reads the real sign as "NADWY" at 2%
 * and "WADUY" at 3%, while film grain elsewhere in the same frame scores
 * "com" at 76%. Confidence scores how word-like a string is, and stylised,
 * widely-tracked signage smeared by motion blur is not word-like at all. A
 * 55% floor would have dropped the one true positive and kept the noise.
 *
 * WHAT ACTUALLY SEPARATES THEM is a pair of signals, neither of which is
 * confidence. A sign is bolted to a building, so it holds the same region for
 * consecutive frames while grain does not; and it READS THE SAME each time,
 * give or take a letter, while texture misread as glyphs produces a fresh
 * unrelated string every frame. Hence: cluster by region across consecutive
 * frames, then rank by character-level agreement between the reads.
 *
 * THIS IS A TRIAGE TOOL, NOT AN ORACLE. Tuned against the known-bad plate it
 * surfaces the real sign ("NADWY" / "WARY", frames 69-70) alongside roughly
 * six false positives per ninety frames. Every attempt to tighten it enough
 * to remove those also removed the true positive — the sign only survives two
 * frames at four-plus characters. So the defaults deliberately err toward
 * recall: a handful of regions to glance at beats a clean report that missed
 * the thing. Treat a flagged cluster as "go and look at this frame".
 *
 *   npm run ocr                      # every shipped segment
 *   npm run ocr -- public/some/dir   # one directory
 *   npm run ocr -- --min-conf 40 --min-run 2
 */
import { createScheduler, createWorker } from "tesseract.js";
import sharp from "sharp";
import { existsSync, readdirSync, statSync } from "node:fs";
import { basename, join, relative, resolve } from "node:path";

const argv = process.argv.slice(2);
const flag = (name, dflt) => {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : dflt;
};
const MIN_CONF = Number(flag("min-conf", 55));
const MIN_RUN = Number(flag("min-run", 2)); // frames a cluster must persist
const WORKERS = Number(flag("workers", 4));
const CELL = 220; // px grid used to decide "same part of frame"
const AGREE = Number(flag("agree", 0.4)); // string agreement that marks a real read
const positional = argv.filter((a, i) => !a.startsWith("--") && !argv[i - 1]?.startsWith("--"));

const REPO = resolve(new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
const ROOT = positional[0] ? resolve(positional[0]) : join(REPO, "public/assets/lab/seg");

function collect(dir) {
  const out = [];
  const walk = (d) => {
    for (const e of readdirSync(d)) {
      const p = join(d, e);
      if (statSync(p).isDirectory()) walk(p);
    }
    const files = readdirSync(d).filter((f) => /\.(avif|webp|png|jpg)$/i.test(f));
    if (!files.length) return;
    const avif = files.filter((f) => f.endsWith(".avif")).sort();
    const rest = files.filter((f) => !f.endsWith(".avif")).sort();
    out.push({ dir: d, files: avif.length ? avif : rest });
  };
  walk(dir);
  return out;
}

if (!existsSync(ROOT)) {
  console.error(`no such directory: ${ROOT}`);
  process.exit(1);
}
const groups = collect(ROOT);
const totalFrames = groups.reduce((a, g) => a + g.files.length, 0);
if (!totalFrames) {
  console.error(`no frames under ${ROOT}`);
  process.exit(1);
}

console.log(`OCR sweep — ${totalFrames} frames in ${groups.length} directories`);
console.log(`root       ${relative(REPO, ROOT) || ROOT}`);
console.log(`floor      ${MIN_CONF}%   persistence >=${MIN_RUN} frames   workers ${WORKERS}\n`);

const scheduler = createScheduler();
for (let i = 0; i < WORKERS; i += 1) scheduler.addWorker(await createWorker("eng"));

function wordsOf(data) {
  if (Array.isArray(data?.words) && data.words.length) return data.words;
  const acc = [];
  for (const b of data?.blocks ?? []) {
    for (const par of b.paragraphs ?? []) {
      for (const line of par.lines ?? []) for (const w of line.words ?? []) acc.push(w);
    }
  }
  return acc;
}

/* FOUR or more alphanumerics. Three was tried and is useless: any two
   three-letter strings agree 67% of the time by accident, so every patch of
   city texture cleared the agreement bar. Real signage — a brand, a store
   name — is four characters or more essentially always. */
const MIN_LEN = Number(flag("min-len", 4));
const isCandidate = (t) => {
  const s = t.trim();
  return s.length >= MIN_LEN && (s.match(/[A-Za-z0-9؀-ۿ]/g) ?? []).length >= MIN_LEN;
};

/* ONE pass, hard-thresholded to the luminous range. A general contrast
   stretch was tried and abandoned: on a detailed aerial plate it turns every
   window grid into persistent pseudo-text and buries the real hit under a
   hundred clusters. Signage on a night plate is bright by definition, so
   throwing away everything below 190 costs nothing and removes most of the
   city. 2x because Tesseract wants an x-height near 20px. */
const prep = {
  bright: (im, w) => im.resize({ width: Math.round(w * 2) }).grayscale().threshold(190),
};

/* Character-level similarity, 0..1. The final discriminator: a real sign
   reads ALMOST the same on consecutive frames ("NADWY", "WADUY", "Nad" —
   the same letters wobbling), whereas texture misread as glyphs produces a
   fresh unrelated string every frame. Region persistence alone cannot tell
   those apart; string agreement can. */
const norm = (s) => s.toUpperCase().replace(/[^A-Z0-9]/g, "");
function similarity(a, b) {
  a = norm(a);
  b = norm(b);
  if (!a || !b) return 0;
  const m = a.length;
  const n = b.length;
  const d = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
  for (let j = 0; j <= n; j += 1) d[0][j] = j;
  for (let i = 1; i <= m; i += 1) {
    for (let j = 1; j <= n; j += 1) {
      d[i][j] = Math.min(
        d[i - 1][j] + 1,
        d[i][j - 1] + 1,
        d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
    }
  }
  return 1 - d[m][n] / Math.max(m, n);
}

/** Best agreement between any two distinct reads in a cluster. */
function agreement(texts) {
  const u = [...new Set(texts.map(norm))].filter((t) => t.length >= MIN_LEN);
  let best = 0;
  let pair = null;
  for (let i = 0; i < u.length; i += 1) {
    for (let j = i + 1; j < u.length; j += 1) {
      const sc = similarity(u[i], u[j]);
      if (sc > best) {
        best = sc;
        pair = [u[i], u[j]];
      }
    }
  }
  return { best, pair };
}

const all = [];
let filteredNoise = 0;
let done = 0;

const jobs = [];
for (const g of groups) {
  const set = relative(ROOT, g.dir).replace(/\\/g, "/") || basename(g.dir);
  for (const f of g.files) {
    jobs.push(
      (async () => {
        const path = join(g.dir, f);
        const meta = await sharp(path).metadata();
        const frame = Number(basename(f).replace(/\D/g, "")) || 0;
        for (const [pass, fn] of Object.entries(prep)) {
          const buf = await fn(sharp(path), meta.width ?? 1600)
            .withMetadata({ density: 300 })
            .png()
            .toBuffer();
          const { data } = await scheduler.addJob("recognize", buf, {}, { blocks: true });
          for (const w of wordsOf(data)) {
            const text = (w.text ?? "").trim();
            if (!isCandidate(text)) {
              if (text) filteredNoise += 1;
              continue;
            }
            const b = w.bbox ?? { x0: 0, y0: 0, x1: 0, y1: 0 };
            all.push({
              set,
              frame,
              pass,
              text,
              conf: Math.round(w.confidence ?? 0),
              cx: (b.x0 + b.x1) / 2,
              cy: (b.y0 + b.y1) / 2,
            });
          }
        }
        done += 1;
        if (done % 60 === 0) process.stdout.write(`  …${done}/${totalFrames}\n`);
      })(),
    );
  }
}

await Promise.all(jobs);
await scheduler.terminate();

/* ── persistence clustering ───────────────────────────────────────────────
   Bucket by set + region, then look for runs of consecutive frames. A sign
   holds its region while the camera tracks past it; grain does not. */
const buckets = new Map();
for (const d of all) {
  const key = `${d.set}|${Math.round(d.cx / CELL)},${Math.round(d.cy / CELL)}`;
  if (!buckets.has(key)) buckets.set(key, []);
  buckets.get(key).push(d);
}

const clusters = [];
for (const [key, items] of buckets) {
  const byFrame = new Map();
  for (const it of items) {
    if (!byFrame.has(it.frame)) byFrame.set(it.frame, []);
    byFrame.get(it.frame).push(it);
  }
  const frames = [...byFrame.keys()].sort((a, b) => a - b);
  let run = [];
  const flush = () => {
    if (run.length >= MIN_RUN) {
      const members = run.flatMap((f) => byFrame.get(f));
      const best = members.slice().sort((a, b) => b.conf - a.conf)[0];
      const agree = agreement(members.map((m) => m.text));
      clusters.push({
        set: key.split("|")[0],
        from: run[0],
        to: run[run.length - 1],
        frames: run.length,
        samples: [...new Set(members.map((m) => m.text))].slice(0, 6),
        agree: agree.best,
        pair: agree.pair,
        peakConf: best.conf,
        cx: Math.round(best.cx),
        cy: Math.round(best.cy),
      });
    }
    run = [];
  };
  for (const f of frames) {
    if (!run.length || f - run[run.length - 1] <= 2) run.push(f);
    else {
      flush();
      run = [f];
    }
  }
  flush();
}
clusters.sort((a, b) => b.agree - a.agree || b.frames - a.frames);

const highConf = all.filter((d) => d.conf >= MIN_CONF);
const belowFloor = all.length - highConf.length;

console.log(`\n──────────────────────────────────────────────────────────────`);
console.log(`scanned         ${totalFrames} frames x ${Object.keys(prep).length} pass(es)`);
console.log(`candidates      ${all.length}  (>=${MIN_LEN} alphanumerics)`);
console.log(`filtered        ${filteredNoise} short/glyph noise · ${belowFloor} below the ${MIN_CONF}% floor`);
const readable = clusters.filter((c) => c.agree >= AGREE);
console.log(`PERSISTENT      ${clusters.length} cluster(s) holding >=${MIN_RUN} consecutive frames`);
console.log(`READABLE        ${readable.length} with >=${Math.round(AGREE * 100)}% string agreement  <-- THE VERDICT`);
console.log(`──────────────────────────────────────────────────────────────`);

if (!clusters.length) {
  console.log(`\n  NO PERSISTENT TEXT — nothing holds a region across frames.\n`);
} else {
  console.log(`\n  PERSISTENT CLUSTERS — these are the ones that matter\n`);
  console.log(`  ${"SET".padEnd(6)} ${"FRAMES".padStart(9)} ${"N".padStart(3)} ${"AGREE".padStart(6)} ${"PEAK".padStart(5)}  ${"AT".padEnd(11)} READS`);
  for (const c of clusters) {
    const mark = c.agree >= AGREE ? " <<< READABLE TEXT" : "";
    console.log(
      `  ${c.set.padEnd(6)} ${`${c.from}-${c.to}`.padStart(9)} ${String(c.frames).padStart(3)} ` +
        `${(c.agree * 100).toFixed(0).padStart(5)}% ${String(c.peakConf).padStart(4)}%  ` +
        `${`${c.cx},${c.cy}`.padEnd(11)} ${(c.pair ?? c.samples).join(" / ")}${mark}`,
    );
  }
  console.log();
}

console.log(`  ABOVE THE ${MIN_CONF}% FLOOR (${highConf.length}) — reported as specified, but see`);
console.log(`  the header: on this material confidence tracks noise, not signage.\n`);
if (highConf.length) {
  const shown = highConf.slice().sort((a, b) => b.conf - a.conf).slice(0, 25);
  for (const h of shown) {
    console.log(`  ${h.set.padEnd(6)} f${String(h.frame).padStart(3)} ${String(h.conf).padStart(3)}%  ${JSON.stringify(h.text)}`);
  }
  if (highConf.length > shown.length) console.log(`  … and ${highConf.length - shown.length} more`);
  console.log();
}

process.exit(readable.length ? 1 : 0);
