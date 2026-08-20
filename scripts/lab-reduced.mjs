/**
 * Under prefers-reduced-motion, is the RIGHT frame on the canvas?
 *
 * WHY THIS EXISTS. The paint harness passed 7/7 while a real Mac showed every
 * segment frozen on its LAST frame, and the perf harness's reduced-motion
 * profile scored it a pass. Both were blind in the same way:
 *
 *   · lab-fullpage never launches a reduced-motion context at all, so its
 *     seven combinations are seven variations of the NON-static path.
 *   · lab-measure does have a reduced-motion profile, but it is declared
 *     `frames: 1, skipScrub: true` and only asserts that ONE frame painted.
 *     Which frame was never checked, so N-1 satisfied it exactly as well as 0.
 *
 * A test that asks "did something paint" cannot fail on painting the wrong
 * thing. This one compares the canvas against the actual frame files on disk
 * and names which frame it is looking at.
 *
 *   node scripts/lab-reduced.mjs [baseUrl]
 */
import { webkit, chromium } from "playwright";
import { assertServedBuild } from "./lab-build.mjs";

const LAB_PORT = 3210;
const argUrl = process.argv[2] && !process.argv[2].startsWith("--") ? process.argv[2] : null;
const BASE = argUrl ?? `http://127.0.0.1:${LAB_PORT}`;
if (!argUrl) {
  console.log(`\n  no baseUrl given — expecting ${BASE}`);
  console.log("  if nothing is serving it:  npm run build && npm run lab:serve\n");
}
await assertServedBuild(BASE);

const SEGS = [
  { key: "a", label: "A", frames: 90 },
  { key: "b", label: "B", frames: 90 },
  { key: "c", label: "C", frames: 90 },
];

let fails = 0;

for (const [name, engine] of [["webkit", webkit], ["chromium", chromium]]) {
  const browser = await engine.launch();
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/concepts/lab`, { waitUntil: "networkidle" });
  await page.waitForTimeout(3000);

  console.log(`\n  ── ${name}, prefers-reduced-motion: reduce ──`);

  const rows = await page.evaluate(async (SEGS) => {
    const luma = (d) => {
      let s = 0;
      let n = 0;
      for (let i = 0; i < d.length; i += 4 * 37) {
        s += d[i] * 0.2126 + d[i + 1] * 0.7152 + d[i + 2] * 0.0722;
        n += 1;
      }
      return +(s / n).toFixed(2);
    };
    const sample = (src) => {
      const c = document.createElement("canvas");
      c.width = 160;
      c.height = 90;
      c.getContext("2d").drawImage(src, 0, 0, 160, 90);
      return luma(c.getContext("2d").getImageData(0, 0, 160, 90).data);
    };
    const fileLuma = async (url) => {
      const img = new Image();
      img.src = url;
      await img.decode();
      return sample(img);
    };
    const out = [];
    const nodes = [...document.querySelectorAll(".scrubseq")];
    for (let i = 0; i < nodes.length; i += 1) {
      const s = nodes[i];
      /* Bring the segment on screen and let it arm. Sampling without this
         reads an empty canvas as luma 0, which is nearer the opening frame
         than the closing one and would PASS while showing nothing at all. */
      s.scrollIntoView({ block: "center" });
      await new Promise((r) => setTimeout(r, 1400));
      const spec = SEGS[i];
      const cv = s.querySelector("canvas");
      const ext = s.dataset.fmt === "avif" ? "avif" : "webp";
      const pad = (n) => String(n).padStart(3, "0");
      out.push({
        label: spec.label,
        mode: s.dataset.mode,
        drawn: cv && cv.width ? sample(cv) : null,
        first: await fileLuma(`/assets/lab/seg/${spec.key}/w/f_${pad(1)}.${ext}`),
        last: await fileLuma(`/assets/lab/seg/${spec.key}/w/f_${pad(spec.frames)}.${ext}`),
        height: Math.round(s.getBoundingClientRect().height),
        vh: window.innerHeight,
      });
    }
    return out;
  }, SEGS);

  for (const r of rows) {
    if (r.drawn == null) {
      console.log(`      ✗ ${r.label}: nothing on the canvas`);
      fails += 1;
      continue;
    }
    const dF = Math.abs(r.drawn - r.first);
    const dL = Math.abs(r.drawn - r.last);
    const isFirst = dF < dL;
    console.log(
      `      ${isFirst ? "✓" : "✗"} ${r.label} mode=${r.mode} span=${r.height - r.vh}  canvas ${r.drawn}  first ${r.first} (Δ${dF.toFixed(2)})  last ${r.last} (Δ${dL.toFixed(2)})  → ${isFirst ? "opening frame" : "LAST FRAME"}`,
    );
    if (!isFirst) fails += 1;
  }

  await browser.close();
}

console.log(fails ? `\n  ${fails} segment(s) painting the wrong frame\n` : "\n  every segment shows its opening frame\n");
process.exit(fails ? 1 : 0);
