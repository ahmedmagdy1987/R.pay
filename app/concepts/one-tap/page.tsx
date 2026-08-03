"use client";
import { useEffect, useRef } from "react";
import BrandsMarquee from "@/components/BrandsMarquee";
import HeroFilm from "./_c/HeroFilm";
import TapToAction from "./_c/TapToAction";
import NetworkScene from "./_c/NetworkScene";
import ControlRoom from "./_c/ControlRoom";
import MachineScenes from "./_c/MachineScenes";
import StickyCTA from "./_c/StickyCTA";

/** The verified stats canon — byte-identical to flow/_c/Network.tsx. */
const STATS = [
  { v: "465,255+", ar: "عملية دفع", en: "payments" },
  { v: "97", ar: "ماكينة مُدارة", en: "machines managed" },
  { v: "9,434", ar: "هدية مُسلَّمة", en: "prizes delivered" },
  { v: "9", ar: "فروع", en: "branches" },
];

/** Concept 08 — "One Tap. Total Control." Six acts, one verb, one #demo. */
export default function OneTapPage() {
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // #prog — the cyan hairline tracking page progress (house pattern).
    const bar = document.getElementById("prog");
    let ticking = false;
    const draw = () => {
      ticking = false;
      if (!bar) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = `${max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0}%`;
    };
    const onScroll = () => {
      if (!ticking) { ticking = true; requestAnimationFrame(draw); }
    };
    draw();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    // Scroll-reveal — one law: 400ms, 12px rise. `.reveals` is added by JS so
    // [data-rise] only ever hides when the observer will actually run.
    document.querySelector(".onetap")?.classList.add("reveals");
    const targets = Array.from(
      document.querySelectorAll<HTMLElement>(
        ".onetap .act:not(.hero) .act-head, .onetap .action-stage, .onetap .ctrl-shell," +
          " .onetap .scene, .onetap .stat, .onetap .close-inner, .onetap .foot"
      )
    );
    targets.forEach((el, i) => {
      el.setAttribute("data-rise", "");
      if (!el.style.transitionDelay) el.style.transitionDelay = `${Math.min(i % 4, 3) * 60}ms`;
    });
    const reveal = (es: IntersectionObserverEntry[], obs: IntersectionObserver) =>
      es.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add("in");
        obs.unobserve(e.target);
      });
    // Dual observers: the -12% margin gives content a beat before it rises,
    // but makes bottom-anchored elements unreachable — the tail gets its own
    // zero-margin observer (flow-documented trap).
    const ioMain = new IntersectionObserver(reveal, { rootMargin: "0px 0px -12% 0px", threshold: 0.05 });
    const ioTail = new IntersectionObserver(reveal, { threshold: 0.01 });
    targets.forEach((el) =>
      (el.classList.contains("foot") || el.closest(".close") ? ioTail : ioMain).observe(el)
    );
    // Belt and braces: at the very bottom nothing may still be hidden.
    const sweep = () => {
      if (document.documentElement.scrollHeight - window.scrollY - window.innerHeight > 4) return;
      targets.forEach((el) => el.classList.add("in"));
      window.removeEventListener("scroll", sweep);
    };
    window.addEventListener("scroll", sweep, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("scroll", sweep);
      ioMain.disconnect();
      ioTail.disconnect();
    };
  }, []);

  return (
    <main ref={mainRef}>
      <HeroFilm />
      <TapToAction />
      <NetworkScene />
      <ControlRoom />
      <MachineScenes />

      {/* ACT VI — PROOF + CLOSE. Belief peaks, then the ask lands. */}
      <section className="act proof" aria-label="Proof">
        <div className="stats" role="list">
          {STATS.map((s, i) => (
            <div className="stat" role="listitem" key={i} style={{ transitionDelay: `${i * 70}ms` }}>
              <span className="led">{s.v}</span>
              <span className="t-meta">
                <span className="ar-t">{s.ar}</span>
                <span className="en-t">{s.en}</span>
              </span>
            </div>
          ))}
        </div>
        <BrandsMarquee />
      </section>

      <section className="act close" id="demo" aria-label="Book a live demo">
        <div className="close-bg" aria-hidden="true" />
        <div className="close-inner">
          <h2 className="t-display">
            <span className="ar-t">ماكيناتك جاهزة.<br />خلّيها أذكى.</span>
            <span className="en-t">Your machines are ready.<br />Make them smarter.</span>
          </h2>
          {/* CTA 5 of 5 — oversized, centred, uncontested. Verified channel. */}
          <a
            className="cta-warm cta-xl"
            href="https://wa.me/966550796555?text=%D9%85%D8%B1%D8%AD%D8%A8%D9%8B%D8%A7%D8%8C%20%D8%A3%D8%B1%D8%BA%D8%A8%20%D8%A8%D8%AD%D8%AC%D8%B2%20%D8%B9%D8%B1%D8%B6%20%D9%85%D8%A8%D8%A7%D8%B4%D8%B1%20%D9%84%D9%80%20R.Pay"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="ar-t">احجز عرضًا مباشرًا</span>
            <span className="en-t">Book a live demo</span>
          </a>
          <p className="t-meta close-note">
            <span className="ar-t">عبر واتساب — بالعربية أو الإنجليزية.</span>
            <span className="en-t">On WhatsApp — Arabic or English.</span>
          </p>
        </div>
      </section>

      <footer className="foot">
        <span>
          <span className="ar-t">© 2026 شركة آر باي السعودية · جميع الحقوق محفوظة</span>
          <span className="en-t">© 2026 R.Pay Saudi Arabia · All rights reserved</span>
        </span>
        <span className="fmark">R.PAY</span>
      </footer>

      <StickyCTA />
    </main>
  );
}
