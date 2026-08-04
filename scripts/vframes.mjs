// Extract frames from an mp4 via Chromium <video> seeking.
// Usage: node scripts/vframes.mjs <video-abs-path> <out-prefix> <t1,t2,...>
import { chromium } from "playwright";
import { writeFileSync, rmSync } from "fs";
import { dirname, join, basename } from "path";
import { pathToFileURL } from "url";

const [, , vidPath, prefix, timesArg] = process.argv;
const times = (timesArg || "0,1,2,3,4,5,6,7").split(",").map(Number);

// Viewer HTML must live next to the video so file:// subresource loading works.
const viewer = join(dirname(vidPath), `.vframes-${Date.now()}.html`);
writeFileSync(
  viewer,
  `<body style="margin:0;background:#000"><video id="v" src="${basename(vidPath)}" muted playsinline preload="auto" style="width:100vw;height:100vh;object-fit:contain"></video></body>`
);

const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1376, height: 768 } });
  page.on("console", (m) => console.log("[page]", m.text()));
  await page.goto(pathToFileURL(viewer).href);
  await page.waitForFunction(() => {
    const v = document.getElementById("v");
    if (v && v.error) console.log("video error:", v.error.code, v.error.message);
    return v && v.readyState >= 2;
  }, { timeout: 30000 });
  const dur = await page.evaluate(() => document.getElementById("v").duration);
  console.log("duration:", dur);
  for (const t of times) {
    if (t > dur) continue;
    await page.evaluate(async (tt) => {
      const v = document.getElementById("v");
      v.currentTime = tt;
      await new Promise((r) => { v.onseeked = r; });
    }, t);
    await page.waitForTimeout(120);
    await page.screenshot({ path: `${prefix}-t${String(t).replace(".", "_")}.png` });
    console.log("frame", t);
  }
} finally {
  await browser.close();
  rmSync(viewer, { force: true });
}
