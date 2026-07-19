"use client";
import { useEffect, useState } from "react";

/** Mobile sticky bar (<820px): appears after 40% page scroll.
 *  One warm primary + WhatsApp icon link. The floating WhatsAppWidget is
 *  the persistent secondary; it is never adjacent to a primary CTA. */
export default function StickyCTA() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    let ticking = false;
    const check = () => {
      ticking = false;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setOn(max > 0 && window.scrollY / max >= 0.4);
    };
    const onScroll = () => {
      if (!ticking) { ticking = true; requestAnimationFrame(check); }
    };
    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={`sticky-cta${on ? " on" : ""}`}>
      <a className="cta-warm" href="#demo">
        <span className="ar-t">احجز عرض تجريبي</span>
        <span className="en-t">Book a demo</span>
      </a>
      <a
        className="cta-ghost"
        href="https://wa.me/966550796555"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
      >
        ↗
      </a>
    </div>
  );
}
