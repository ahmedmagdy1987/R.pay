"use client";
import { useEffect, useRef, useState } from "react";

const BACKDROP = "/assets/concept-08/network-hall.webp";
const N = 97; // the verified fleet count — never a different number

/** Deterministic layout: same constellation every visit, every resize. */
function lcg(seed: number) {
  let s = seed;
  return () => ((s = (s * 48271) % 2147483647), s / 2147483647);
}

type Node = { x: number; y: number; r: number };

function buildNodes(): Node[] {
  const rnd = lcg(20260803);
  const nodes: Node[] = [];
  // Loose grid + jitter: reads as a fleet across a floor plan, not noise.
  const cols = 13, rows = 8; // 104 cells, first 97 used
  for (let i = 0; i < N; i++) {
    const c = i % cols, r = Math.floor(i / cols);
    nodes.push({
      x: (c + 0.5 + (rnd() - 0.5) * 0.68) / cols,
      y: 0.12 + ((r + 0.5 + (rnd() - 0.5) * 0.6) / rows) * 0.62,
      r: 1.6 + rnd() * 1.8,
    });
  }
  return nodes;
}

/** ACT III — ONE NETWORK.
 *  One machine wakes → 97 light up → every line converges on one point.
 *  A live canvas (not baked video) so the flow direction genuinely mirrors
 *  in RTL and the counter stays crisp HTML. Runs once, then holds its
 *  final frame and releases the rAF loop. */
export default function NetworkScene() {
  const secRef = useRef<HTMLElement>(null);
  const holdRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ledRef = useRef<HTMLSpanElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const sec = secRef.current;
    const hold = holdRef.current;
    const canvas = canvasRef.current;
    if (!sec || !hold || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 820px)").matches;
    const rtl = document.documentElement.getAttribute("dir") !== "ltr";
    const nodes = buildNodes();
    // Mobile shows a lighter constellation at full clarity — fewer, larger.
    const shown = mobile ? nodes.filter((_, i) => i % 2 === 0 || i < 9) : nodes;

    let cw = 0, ch = 0, raf = 0, t0 = 0, finished = false;

    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cw = hold.clientWidth;
      ch = hold.clientHeight;
      canvas.width = Math.round(cw * dpr);
      canvas.height = Math.round(ch * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const X = (nx: number) => (rtl ? (1 - nx) * cw : nx * cw);
    // The sink — where every line lands: the control point, lower center,
    // biased toward the reading start so the eye ends where Act IV begins.
    const sink = () => ({ x: cw * (rtl ? 0.42 : 0.58), y: ch * 0.9 });

    /* Timeline (ms): ignite hero node 0-400 · wave 400-2200 · converge 1400-3200. */
    const DUR = 3200;

    const draw = (t: number) => {
      ctx.clearRect(0, 0, cw, ch);
      const s = sink();
      const wave = Math.max(0, Math.min(1, (t - 400) / 1800));
      const conv = Math.max(0, Math.min(1, (t - 1400) / 1800));
      const eased = 1 - Math.pow(1 - conv, 3);
      let lit = 0;

      shown.forEach((n, i) => {
        const gate = i / shown.length;
        const on = i === 0 ? t > 0 : wave >= gate;
        if (!on) return;
        lit++;
        const x = X(n.x), y = n.y * ch;

        // Line first (under the node): converges once the wave passes it.
        if (eased > gate * 0.5) {
          const k = Math.min(1, (eased - gate * 0.5) / 0.5);
          const mx = x + (s.x - x) * 0.5, my = y + (s.y - y) * 0.72;
          const grd = ctx.createLinearGradient(x, y, s.x, s.y);
          grd.addColorStop(0, "rgba(53,224,212,.34)");
          grd.addColorStop(1, "rgba(53,224,212,.06)");
          ctx.strokeStyle = grd;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(x, y);
          // Progressive quadratic draw.
          const steps = 14;
          for (let q = 1; q <= steps * k; q++) {
            const u = q / steps;
            const px = (1 - u) * (1 - u) * x + 2 * (1 - u) * u * mx + u * u * s.x;
            const py = (1 - u) * (1 - u) * y + 2 * (1 - u) * u * my + u * u * s.y;
            ctx.lineTo(px, py);
          }
          ctx.stroke();
        }

        // Node glow.
        const rr = i === 0 ? n.r + 2.4 : n.r;
        const halo = ctx.createRadialGradient(x, y, 0, x, y, rr * 6);
        halo.addColorStop(0, "rgba(53,224,212,.85)");
        halo.addColorStop(0.35, "rgba(53,224,212,.28)");
        halo.addColorStop(1, "rgba(53,224,212,0)");
        ctx.fillStyle = halo;
        ctx.beginPath(); ctx.arc(x, y, rr * 6, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "rgba(220,255,251,.95)";
        ctx.beginPath(); ctx.arc(x, y, rr * 0.9, 0, Math.PI * 2); ctx.fill();
      });

      // The sink: one calm point that receives everything.
      if (eased > 0.15) {
        const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, 34 * eased);
        g.addColorStop(0, "rgba(53,224,212,.9)");
        g.addColorStop(1, "rgba(53,224,212,0)");
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(s.x, s.y, 34 * eased, 0, Math.PI * 2); ctx.fill();
      }

      // Counter: crisp HTML, digits only in the LED window.
      if (ledRef.current) {
        const target = Math.max(1, Math.round((lit / shown.length) * N));
        ledRef.current.textContent = String(t >= DUR ? N : target);
      }
    };

    const finish = () => {
      finished = true;
      draw(DUR);
      setDone(true);
    };

    const tick = (now: number) => {
      if (finished) return;
      if (!t0) t0 = now;
      const t = now - t0;
      draw(Math.min(t, DUR));
      if (t >= DUR) { finish(); return; }
      raf = requestAnimationFrame(tick);
    };

    size();
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (!e.isIntersecting || finished || raf) return;
          if (reduce) { finish(); return; }
          raf = requestAnimationFrame(tick);
        }),
      { threshold: 0.4 }
    );
    io.observe(sec);

    let rt: ReturnType<typeof setTimeout> | undefined;
    const onResize = () => {
      clearTimeout(rt);
      rt = setTimeout(() => { size(); draw(finished ? DUR : 0); }, 150);
    };
    window.addEventListener("resize", onResize);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      clearTimeout(rt);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <section className={`act network${done ? " done" : ""}`} id="network" ref={secRef} aria-label="One network">
      <header className="act-head">
        <h2 className="t-beat">
          <span className="ar-t">ماكينة تضيء… فتضيء الشبكة.</span>
          <span className="en-t">One machine lights up… then the network.</span>
        </h2>
        <p className="t-body act-lead">
          <span className="ar-t">كل عملية دفع تنساب من ماكينتها إلى نقطة واحدة يراها المشغّل.</span>
          <span className="en-t">Every payment flows from its machine to a single point the operator sees.</span>
        </p>
      </header>

      <div className="net-stage" ref={holdRef}>
        <canvas ref={canvasRef} aria-hidden="true" />
        <div className="net-hud" role="status">
          {/* SSR renders the final value; the effect zeroes and counts only
              when the animation is really going to run. */}
          <span className="led" ref={ledRef}>{N}</span>
          <span className="t-meta">
            <span className="ar-t">ماكينة مُدارة على شبكة واحدة</span>
            <span className="en-t">managed machines on one network</span>
          </span>
        </div>
      </div>

      {/* CTA 3 of 5 — sits on the proof of scale */}
      <a className="cta-warm net-cta" href="#demo">
        <span className="ar-t">احجز عرضًا مباشرًا</span>
        <span className="en-t">Book a live demo</span>
      </a>
    </section>
  );
}
