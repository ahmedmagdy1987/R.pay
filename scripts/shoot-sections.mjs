/**
 * Section-by-section captures for the production review.
 *
 *   M1_OUT=docs/redesign-2026/prod-01 node scripts/shoot-sections.mjs
 */
import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const PORT = 3455;
const BASE = `http://127.0.0.1:${PORT}`;
const OUT = path.join(path.resolve(process.env.M1_OUT || "docs/redesign-2026/prod-01"), "sections");

const SECTIONS = [
  [".ml-sec", "03-money-line"],
  [".rf-sec", "04-refund"],
  [".fl-sec", "06-fleet"],
  [".au-sec", "08-audiences"],
  [".wr-sec", "09-where-it-runs"],
  [".wl-sec", "10-white-label"],
  [".hv-sec", "11-handover"],
  [".si-sec", "12-station-ident"],
];

function killTree(pid) {
  if (!pid) return;
  try {
    if (process.platform === "win32") spawn("taskkill", ["/pid", String(pid), "/f", "/t"], { stdio: "ignore" });
    else process.kill(-pid, "SIGKILL");
  } catch {}
}
async function waitFor(url, t = 90000) {
  const s = Date.now();
  while (Date.now() - s < t) {
    try { const r = await fetch(url); if (r.ok) return; } catch {}
    await new Promise((r) => setTimeout(r, 300));
  }
  throw new Error("no server");
}

const server = spawn(
  process.execPath,
  [path.resolve("node_modules/next/dist/bin/next"), "start", "-p", String(PORT)],
  { stdio: "ignore" },
);

try {
  await waitFor(BASE + "/redesign");
  await mkdir(OUT, { recursive: true });
  const browser = await chromium.launch();

  for (const [locale, route, dpr, vp] of [
    ["ar", "/redesign", 2, { width: 1440, height: 900 }],
    ["en", "/redesign/en", 2, { width: 1440, height: 900 }],
    ["ar-m", "/redesign", 3, { width: 390, height: 844 }],
  ]) {
    const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: dpr });
    const page = await ctx.newPage();
    await page.goto(BASE + route, { waitUntil: "networkidle" });
    await page.waitForTimeout(7800);

    for (const [sel, name] of SECTIONS) {
      const el = page.locator(sel).first();
      if ((await el.count()) === 0) { console.log("MISSING", sel); continue; }
      await el.scrollIntoViewIfNeeded();
      await page.waitForTimeout(220);
      await el.screenshot({ path: path.join(OUT, `${name}-${locale}.png`) });
    }
    console.log("shot", locale);
    await ctx.close();
  }

  await browser.close();
  console.log("wrote", OUT);
} finally {
  killTree(server.pid);
}
