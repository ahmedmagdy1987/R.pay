/**
 * shoot.mjs — the eyes.
 *
 * Builds the app (unless SKIP_BUILD=1), serves it on :3100, then drives a real
 * Chromium over the target routes at four widths, capturing:
 *   - full-page screenshot
 *   - viewport shots at scrollY = 0/15/35/55/75/95%
 *   - scrollWidth vs clientWidth (the overflow proof)
 *   - every element wider than the viewport (the overflow culprits)
 *   - console errors + failed network requests
 *   - hero <video> src/currentTime at t=0 and t=2s (film-double-play check)
 *
 * Usage:
 *   node scripts/shoot.mjs                       # /concepts/flow
 *   node scripts/shoot.mjs --routes=/,/concepts/latest
 *   SKIP_BUILD=1 node scripts/shoot.mjs
 */
import { chromium } from "playwright";
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import net from "node:net";

const PORT = Number(process.env.PORT || 3100);
const BASE = `http://127.0.0.1:${PORT}`;
const OUT = path.resolve("shots");

const argRoutes = process.argv.find((a) => a.startsWith("--routes="));
const ROUTES = (argRoutes ? argRoutes.split("=")[1] : "/concepts/flow")
  .split(",")
  .filter(Boolean);

const VIEWPORTS = [
  { w: 1920, h: 1080, name: "1920" },
  { w: 1440, h: 900, name: "1440" },
  { w: 820, h: 1180, name: "820" },
  { w: 390, h: 844, name: "390" },
];
const STOPS = [0, 0.15, 0.35, 0.55, 0.75, 0.95];

const sh = (cmd, args, opts = {}) =>
  new Promise((res, rej) => {
    const p = spawn(cmd, args, { stdio: "inherit", shell: true, ...opts });
    p.on("exit", (c) => (c === 0 ? res() : rej(new Error(`${cmd} exited ${c}`))));
  });

const portOpen = () =>
  new Promise((res) => {
    const s = net.connect(PORT, "127.0.0.1");
    s.on("connect", () => (s.destroy(), res(true)));
    s.on("error", () => res(false));
    setTimeout(() => (s.destroy(), res(false)), 800);
  });

async function waitForServer(timeoutMs = 90000) {
  const t0 = Date.now();
  while (Date.now() - t0 < timeoutMs) {
    if (await portOpen()) {
      // port is listening; make sure Next is actually answering
      try {
        const r = await fetch(BASE + "/concepts/flow", { redirect: "manual" });
        if (r.status < 500) return true;
      } catch {}
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error("server never became ready");
}

/* ---------- in-page probes ---------- */

const OVERFLOW_PROBE = `(() => {
  const de = document.documentElement;
  const vw = de.clientWidth;
  const out = [];
  const sel = (el) => {
    const id = el.id ? '#' + el.id : '';
    const cls = typeof el.className === 'string' && el.className
      ? '.' + el.className.trim().split(/\\s+/).slice(0, 4).join('.')
      : '';
    return el.tagName.toLowerCase() + id + cls;
  };
  for (const el of document.querySelectorAll('*')) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) continue;
    const cs = getComputedStyle(el);
    if (cs.position === 'fixed') continue;          // fixed can't scroll the doc
    const left = r.left + window.scrollX;
    const right = r.right + window.scrollX;
    if (right > vw + 1 || left < -1) {
      out.push({
        sel: sel(el),
        left: Math.round(left),
        right: Math.round(right),
        w: Math.round(r.width),
        over: Math.round(Math.max(right - vw, -left)),
        pos: cs.position,
        ovx: cs.overflowX,
      });
    }
  }
  out.sort((a, b) => b.over - a.over);
  return {
    scrollWidth: de.scrollWidth,
    clientWidth: de.clientWidth,
    bodyScrollWidth: document.body.scrollWidth,
    scrollHeight: de.scrollHeight,
    dir: de.getAttribute('dir'),
    culprits: out.slice(0, 25),
  };
})()`;

const VIDEO_PROBE = `(() => {
  const vids = [...document.querySelectorAll('video')];
  return vids.map(v => ({
    src: (v.currentSrc || v.src || '').split('/').pop(),
    t: +(v.currentTime || 0).toFixed(2),
    dur: +(v.duration || 0).toFixed(2),
    paused: v.paused,
    loop: v.loop,
    autoplay: v.autoplay,
    readyState: v.readyState,
    cls: v.className,
  }));
})()`;

/** Collision detector: any two text-bearing siblings whose boxes overlap. */
const COLLIDE_PROBE = `(() => {
  const hits = [];
  const nodes = [...document.querySelectorAll('.flow h1, .flow h2, .flow p, .flow .t-beat, .flow .drop-m-cap, .flow .led, .flow .foot')];
  const sel = (el) => el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\\s+/).slice(0,3).join('.') : '');
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i], b = nodes[j];
      if (a.contains(b) || b.contains(a)) continue;
      const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
      if (!ra.width || !rb.width) continue;
      const ox = Math.min(ra.right, rb.right) - Math.max(ra.left, rb.left);
      const oy = Math.min(ra.bottom, rb.bottom) - Math.max(ra.top, rb.top);
      if (ox > 2 && oy > 2) hits.push({ a: sel(a), b: sel(b), ox: Math.round(ox), oy: Math.round(oy) });
    }
  }
  return hits.slice(0, 20);
})()`;

/* ---------- main ---------- */

async function main() {
  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });

  let server;
  if (!(await portOpen())) {
    if (process.env.SKIP_BUILD !== "1") {
      console.log("▶ next build");
      await sh("npx", ["next", "build"]);
    }
    console.log("▶ next start -p " + PORT);
    server = spawn("npx", ["next", "start", "-p", String(PORT)], {
      stdio: ["ignore", "pipe", "pipe"],
      shell: true,
    });
    server.stdout.on("data", (d) => process.stdout.write("  [next] " + d));
    server.stderr.on("data", (d) => process.stderr.write("  [next] " + d));
    await waitForServer();
  } else {
    console.log("▶ reusing server already on :" + PORT);
  }

  const browser = await chromium.launch();
  const report = {};

  for (const route of ROUTES) {
    const slug = route.replace(/[^a-z0-9]+/gi, "_").replace(/^_|_$/g, "") || "root";
    report[route] = {};

    for (const vp of VIEWPORTS) {
      const tag = `${slug}__${vp.name}`;
      const ctx = await browser.newContext({
        viewport: { width: vp.w, height: vp.h },
        deviceScaleFactor: 1,
        isMobile: vp.w <= 820,
        hasTouch: vp.w <= 820,
        reducedMotion: "no-preference",
      });
      const page = await ctx.newPage();

      const consoleErrors = [];
      const failed = [];
      page.on("console", (m) => {
        if (m.type() === "error" || m.type() === "warning")
          consoleErrors.push(`[${m.type()}] ${m.text()}`.slice(0, 300));
      });
      page.on("pageerror", (e) => consoleErrors.push(`[pageerror] ${e.message}`.slice(0, 300)));
      page.on("requestfailed", (r) =>
        failed.push(`${r.failure()?.errorText} ${r.url().replace(BASE, "")}`.slice(0, 240))
      );
      page.on("response", (r) => {
        if (r.status() >= 400) failed.push(`HTTP ${r.status()} ${r.url().replace(BASE, "")}`);
      });

      console.log(`\n── ${route} @ ${vp.w}×${vp.h}`);
      await page.goto(BASE + route, { waitUntil: "networkidle", timeout: 60000 });

      // hero video state at t≈0 and t≈2
      const vid0 = await page.evaluate(VIDEO_PROBE).catch(() => []);
      await page.screenshot({ path: path.join(OUT, `${tag}__hero-t0.png`) });
      await page.waitForTimeout(2000);
      const vid2 = await page.evaluate(VIDEO_PROBE).catch(() => []);
      await page.screenshot({ path: path.join(OUT, `${tag}__hero-t2.png`) });

      const over = await page.evaluate(OVERFLOW_PROBE);
      const collide = await page.evaluate(COLLIDE_PROBE).catch(() => []);

      // scroll stops
      for (const s of STOPS) {
        await page.evaluate((frac) => {
          const max = document.documentElement.scrollHeight - window.innerHeight;
          window.scrollTo({ top: Math.round(max * frac), behavior: "instant" });
        }, s);
        await page.waitForTimeout(700);
        await page.screenshot({
          path: path.join(OUT, `${tag}__s${String(Math.round(s * 100)).padStart(2, "0")}.png`),
        });
      }

      // footer visibility, measured at the true bottom of the page
      await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
      await page.waitForTimeout(600);
      await page.screenshot({ path: path.join(OUT, `${tag}__bottom.png`) });
      const footer = await page.evaluate(() => {
        const f = document.querySelector(".foot") || document.querySelector("footer");
        if (!f) return { present: false };
        const r = f.getBoundingClientRect();
        const cs = getComputedStyle(f);
        const mid = document.elementFromPoint(
          Math.min(window.innerWidth - 5, Math.max(5, r.left + r.width / 2)),
          Math.min(window.innerHeight - 5, Math.max(5, r.top + r.height / 2))
        );
        return {
          present: true,
          top: Math.round(r.top),
          h: Math.round(r.height),
          inView: r.top < window.innerHeight && r.bottom > 0,
          display: cs.display,
          opacity: cs.opacity,
          hitTest: mid ? mid.tagName.toLowerCase() + "." + String(mid.className).slice(0, 40) : null,
        };
      });

      // LED values as served + as rendered
      const leds = await page.evaluate(() =>
        [...document.querySelectorAll(".network .led")].map((e) => e.textContent)
      );

      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(400);
      await page.screenshot({ path: path.join(OUT, `${tag}__full.png`), fullPage: true }).catch((e) =>
        console.log("  (fullPage failed: " + e.message.slice(0, 80) + ")")
      );

      report[route][vp.name] = {
        overflow: {
          scrollWidth: over.scrollWidth,
          clientWidth: over.clientWidth,
          clean: over.scrollWidth === over.clientWidth,
          culprits: over.culprits,
        },
        scrollHeight: over.scrollHeight,
        dir: over.dir,
        video_t0: vid0,
        video_t2: vid2,
        leds,
        footer,
        collisions: collide,
        consoleErrors: [...new Set(consoleErrors)].slice(0, 15),
        failedRequests: [...new Set(failed)].slice(0, 15),
      };

      const r = report[route][vp.name];
      console.log(
        `   overflow: scrollWidth=${over.scrollWidth} clientWidth=${over.clientWidth} ` +
          (r.overflow.clean ? "✅ CLEAN" : `❌ +${over.scrollWidth - over.clientWidth}px`)
      );
      if (!r.overflow.clean)
        over.culprits.slice(0, 6).forEach((c) => console.log(`     ↳ ${c.sel}  w=${c.w} over=${c.over} pos=${c.pos}`));
      console.log(`   video t0: ${JSON.stringify(vid0)}`);
      console.log(`   video t2: ${JSON.stringify(vid2)}`);
      console.log(`   leds: ${JSON.stringify(leds)}`);
      console.log(`   footer: ${JSON.stringify(footer)}`);
      if (collide.length) console.log(`   ⚠ collisions: ${JSON.stringify(collide.slice(0, 5))}`);
      if (r.consoleErrors.length) console.log(`   ⚠ console: ${r.consoleErrors.join(" | ").slice(0, 400)}`);
      if (r.failedRequests.length) console.log(`   ⚠ net: ${r.failedRequests.join(" | ").slice(0, 400)}`);

      await ctx.close();
    }
  }

  fs.writeFileSync(path.join(OUT, "report.json"), JSON.stringify(report, null, 2));
  console.log(`\n✔ wrote ${OUT}`);
  await browser.close();
  if (server) server.kill("SIGTERM");
  process.exit(0);
}

main().catch((e) => {
  console.error("SHOOT FAILED:", e);
  process.exit(1);
});
