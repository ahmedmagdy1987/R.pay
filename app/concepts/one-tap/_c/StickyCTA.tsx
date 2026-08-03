"use client";
import { useEffect, useState } from "react";

/** Mobile sticky bar (<820px): appears after 40% page scroll (flow
 *  precedent, including the rival-adjacency suppression — two identical
 *  primaries on one screen is a duplicate, not a choice). */
export default function StickyCTA() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    let ticking = false;
    const RIVALS = ".onetap .net-cta, .onetap .close .cta-warm";
    const rivalAdjacent = () => {
      const vh = window.innerHeight;
      for (const el of document.querySelectorAll<HTMLElement>(RIVALS)) {
        const r = el.getBoundingClientRect();
        if (!r.height) continue;
        const shown = Math.min(r.bottom, vh) - Math.max(r.top, 0);
        if (shown / r.height >= 0.5 && r.top + r.height / 2 > vh * 0.45) return true;
      }
      return false;
    };
    const check = () => {
      ticking = false;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setOn(max > 0 && window.scrollY / max >= 0.4 && !rivalAdjacent());
    };
    const onScroll = () => {
      if (!ticking) { ticking = true; requestAnimationFrame(check); }
    };
    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className={`sticky-cta${on ? " on" : ""}`}>
      <a className="cta-warm" href="#demo">
        <span className="ar-t">احجز عرضًا مباشرًا</span>
        <span className="en-t">Book a live demo</span>
      </a>
    </div>
  );
}
