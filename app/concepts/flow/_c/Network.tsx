"use client";
import { useEffect, useRef } from "react";
import BrandsMarquee from "@/components/BrandsMarquee";

/** ACT IV — THE NETWORK. Four LED readouts counting up on intersect
 *  (400ms, reduced-motion jumps straight to final). Then the marquee —
 *  logos at 55%, no header, the names do the work. Then CTA 3. */
const STATS = [
  { v: 465255, ar: "عملية دفع", en: "payments" },
  { v: 97, ar: "ماكينة مُدارة", en: "machines managed" },
  { v: 9434, ar: "هدية مُسلَّمة", en: "prizes delivered" },
  { v: 9, ar: "فروع", en: "branches" },
];

export default function Network() {
  const gridRef = useRef<HTMLDivElement>(null);
  const done = useRef(false);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const leds = Array.from(grid.querySelectorAll<HTMLElement>(".led"));
    const finals = STATS.map((s) => s.v);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const paint = (k: number) =>
      leds.forEach((el, i) => { el.textContent = Math.round(finals[i] * k).toLocaleString("en-US"); });

    const run = () => {
      if (done.current) return;
      done.current = true;
      if (reduce) { paint(1); return; }
      const t0 = performance.now();
      const tick = (t: number) => {
        const k = Math.min(1, (t - t0) / 400);
        // the motion-law curve, applied to the count itself
        const e = 1 - Math.pow(1 - k, 3);
        paint(e);
        if (k < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && run()),
      { threshold: 0.35 }
    );
    io.observe(grid);
    return () => io.disconnect();
  }, []);

  return (
    <section className="act network" id="network" aria-label="Network">
      <div className="net-grid" ref={gridRef}>
        {STATS.map((s, i) => (
          <div className="net-stat" key={i}>
            <span className="led">0</span>
            <span className="t-meta">
              <span className="ar-t">{s.ar}</span>
              <span className="en-t">{s.en}</span>
            </span>
          </div>
        ))}
      </div>
      <BrandsMarquee />
      {/* CTA 3 of 4 — the only reframed label; it sits on the proof */}
      <a className="cta-warm net-cta" href="#demo">
        <span className="ar-t">انضم إلى 97 ماكينة</span>
        <span className="en-t">Join 97 machines</span>
      </a>
    </section>
  );
}
