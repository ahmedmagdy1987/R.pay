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

const fmt = (n: number) => n.toLocaleString("en-US");

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
      leds.forEach((el, i) => { el.textContent = fmt(Math.round(finals[i] * k)); });

    /* The FINAL values are what the server renders (see the JSX below), so a
       browser that never runs this effect — or an IntersectionObserver that
       never fires — degrades to correct numbers instead of a row of zeros.
       We only zero them out here, on the client, once we know the animation
       is actually going to run. */
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => {
        if (!e.isIntersecting || done.current) return;
        done.current = true;
        io.disconnect();
        if (reduce) { paint(1); return; }
        const t0 = performance.now();
        const tick = (t: number) => {
          const k = Math.min(1, (t - t0) / 400);
          paint(1 - Math.pow(1 - k, 3)); // the motion-law curve, on the count itself
          if (k < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }),
      { threshold: 0.35 }
    );

    // Only arm the count-up if the grid starts off-screen; if it is already in
    // view at mount there is nothing to reveal and the finals simply stand.
    const r = grid.getBoundingClientRect();
    if (r.top > window.innerHeight * 0.9) {
      paint(0);
      io.observe(grid);
    } else {
      done.current = true;
    }
    return () => io.disconnect();
  }, []);

  return (
    <section className="act network" id="network" aria-label="Network">
      <div className="net-grid" ref={gridRef}>
        {STATS.map((s, i) => (
          <div className="net-stat" key={i} style={{ transitionDelay: `${i * 70}ms` }}>
            <span className="led">{fmt(s.v)}</span>
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
