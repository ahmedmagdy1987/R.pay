// LCP / CLS / long-task probe for /concepts/one-tap on the prod server.
import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.addInitScript(() => {
  window.__m = { lcp: 0, cls: 0, longtasks: 0 };
  new PerformanceObserver((l) => {
    for (const e of l.getEntries()) window.__m.lcp = e.startTime;
  }).observe({ type: "largest-contentful-paint", buffered: true });
  new PerformanceObserver((l) => {
    for (const e of l.getEntries()) if (!e.hadRecentInput) window.__m.cls += e.value;
  }).observe({ type: "layout-shift", buffered: true });
  new PerformanceObserver((l) => {
    for (const e of l.getEntries()) if (e.duration > 50) window.__m.longtasks++;
  }).observe({ type: "longtask", buffered: true });
});
await page.goto("http://localhost:3000/concepts/one-tap", { waitUntil: "load" });
await page.waitForTimeout(9000); // let the film play through
const m = await page.evaluate(() => window.__m);
const nav = await page.evaluate(() => {
  const n = performance.getEntriesByType("navigation")[0];
  return { ttfb: n.responseStart, domContentLoaded: n.domContentLoadedEventEnd, load: n.loadEventEnd };
});
const transfer = await page.evaluate(() =>
  performance.getEntriesByType("resource").reduce((a, r) => a + (r.transferSize || 0), 0)
);
console.log(JSON.stringify({ ...m, ...nav, transferKB: Math.round(transfer / 1024) }, null, 1));
await browser.close();
