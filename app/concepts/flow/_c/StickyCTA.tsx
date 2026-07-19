"use client";
import { useEffect, useState } from "react";

/** Mobile sticky bar (<820px): appears after 40% page scroll.
 *  One warm primary + WhatsApp icon link. The floating WhatsAppWidget is
 *  the persistent secondary; it is never adjacent to a primary CTA. */
export default function StickyCTA() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    let ticking = false;
    // Whenever a primary CTA is already in the frame — the mobile fall's
    // dispense button, the network's, or the close act's oversized ask — the
    // bar retracts. Two identical primaries on one screen is not a choice,
    // it is a duplicate.
    // Queried at check time, not at mount: DropSequence swaps its mobile rail
    // in from a layout effect, so a one-shot querySelectorAll here can run
    // before .drop-m-cta exists and would silently observe nothing.
    const RIVALS = ".flow .drop-m-cta, .flow .net-cta, .flow .close .cta-warm";
    // The conflict is ADJACENCY, not mere presence. The bar is pinned to the
    // bottom edge, so only a rival that is itself substantially visible AND
    // sitting in the lower half of the screen actually reads as a duplicate;
    // a CTA up near the top does not. Suppressing on any overlap at all left
    // the bar effectively never shown, which is worse than the duplicate.
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
