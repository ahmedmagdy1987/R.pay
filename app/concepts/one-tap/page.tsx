"use client";
import { useEffect, useRef } from "react";
import BrandsMarquee from "@/components/BrandsMarquee";
import { R_MARK } from "@/lib/assets/brand";
import HeroFilm from "./_c/HeroFilm";
import TapToAction from "./_c/TapToAction";
import FleetCards from "./_c/FleetCards";
import ControlRoom from "./_c/ControlRoom";
import MachineCards from "./_c/MachineCards";
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
    // NOTE: the page's LAST element (.foot) is rise-exempt in CSS — its
    // pre-reveal translateY extended the scrollable area by 12px and
    // resurrected the double-scrollbar bug.
    document.querySelector(".onetap")?.classList.add("reveals");
    const targets = Array.from(
      document.querySelectorAll<HTMLElement>(
        ".onetap .act:not(.hero):not(.control) .act-head, .onetap .action-stage," +
          " .onetap .fcard, .onetap .mcard, .onetap .stat, .onetap .close-inner, .onetap .foot"
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
    // but makes bottom-anchored elements unreachable (flow-documented trap).
    const ioMain = new IntersectionObserver(reveal, { rootMargin: "0px 0px -12% 0px", threshold: 0.05 });
    const ioTail = new IntersectionObserver(reveal, { threshold: 0.01 });
    targets.forEach((el) =>
      (el.classList.contains("foot") || el.closest(".close") ? ioTail : ioMain).observe(el)
    );
    const sweep = () => {
      if (document.documentElement.scrollHeight - window.scrollY - window.innerHeight > 4) return;
      targets.forEach((el) => el.classList.add("in"));
      window.removeEventListener("scroll", sweep);
    };
    window.addEventListener("scroll", sweep, { passive: true });

    // The floating WhatsApp widget yields to the final act: when the close
    // act or footer is visible, the page adds .at-end and the widget hides
    // so it never competes with or covers the uncontested closing CTA.
    const root = document.querySelector(".onetap");
    const endMarks = document.querySelectorAll(".onetap .close, .onetap .foot");
    const endVisible = new Set<Element>();
    const ioEnd = new IntersectionObserver(
      (es) => {
        es.forEach((e) => (e.isIntersecting ? endVisible.add(e.target) : endVisible.delete(e.target)));
        root?.classList.toggle("at-end", endVisible.size > 0);
      },
      { threshold: 0.05 }
    );
    endMarks.forEach((el) => ioEnd.observe(el));

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("scroll", sweep);
      ioMain.disconnect();
      ioTail.disconnect();
      ioEnd.disconnect();
    };
  }, []);

  const toggleLang = () => {
    const el = document.documentElement;
    const en = el.classList.toggle("en");
    el.setAttribute("dir", en ? "ltr" : "rtl");
    el.setAttribute("lang", en ? "en" : "ar");
  };

  return (
    <main ref={mainRef}>
      <HeroFilm />
      <TapToAction />
      <FleetCards />
      <ControlRoom />
      <MachineCards />

      {/* PROOF — a compact band: the verified numbers, then the names. */}
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

      {/* THE CLOSE — a branded final act; the ask, uncontested. */}
      <section className="act close" id="demo" aria-label="Book a live demo">
        <div className="close-light" aria-hidden="true" />
        <div className="close-inner">
          <h2 className="t-display">
            <span className="ar-t">ماكيناتك جاهزة.<br />خلّها أذكى مع R.Pay.</span>
            <span className="en-t">Your machines are ready.<br />Make them smarter with R.Pay.</span>
          </h2>
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

      {/* FUNCTIONAL FOOTER — compact, verified content only. */}
      <footer className="foot" aria-label="Footer">
        <div className="foot-main">
          <div className="foot-brand">
            <span className="brand" aria-label="R.Pay">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={R_MARK} alt="" />
              <span>Pay</span>
            </span>
            <p className="t-meta foot-desc">
              <span className="ar-t">نظام دفع شامل ومنصّة تحكّم لحظية لأجهزة الخدمة الذاتية — من ماكينة واحدة إلى شبكة كاملة.</span>
              <span className="en-t">A complete payment suite and real-time control platform for self-service machines — from one machine to a whole network.</span>
            </p>
          </div>
          <nav className="foot-nav" aria-label="Sections">
            <a href="#tap" className="t-meta"><span className="ar-t">اللمسة</span><span className="en-t">The tap</span></a>
            <a href="#fleet" className="t-meta"><span className="ar-t">الشبكة</span><span className="en-t">The network</span></a>
            <a href="#control" className="t-meta"><span className="ar-t">التحكّم</span><span className="en-t">Control</span></a>
            <a href="#machines" className="t-meta"><span className="ar-t">الماكينات</span><span className="en-t">Machines</span></a>
            <a href="/" className="t-meta"><span className="ar-t">كل المفاهيم</span><span className="en-t">All concepts</span></a>
          </nav>
          <div className="foot-contact">
            <a
              className="t-meta"
              href="https://wa.me/966550796555?text=%D9%85%D8%B1%D8%AD%D8%A8%D9%8B%D8%A7%D8%8C%20%D8%A3%D8%B1%D8%BA%D8%A8%20%D8%A8%D8%AD%D8%AC%D8%B2%20%D8%B9%D8%B1%D8%B6%20%D9%85%D8%A8%D8%A7%D8%B4%D8%B1%20%D9%84%D9%80%20R.Pay"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="ar-t">واتساب</span><span className="en-t">WhatsApp</span>
            </a>
            <a className="t-meta" href="mailto:hello@rpay.sa"><span dir="ltr">hello@rpay.sa</span></a>
            <button className="lang t-meta" onClick={toggleLang} aria-label="Toggle language">
              <span className="ar-t">English</span>
              <span className="en-t">العربية</span>
            </button>
          </div>
        </div>
        <div className="foot-base">
          <span className="t-meta">
            <span className="ar-t">© 2026 شركة آر باي السعودية · جميع الحقوق محفوظة</span>
            <span className="en-t">© 2026 R.Pay Saudi Arabia · All rights reserved</span>
          </span>
          <span className="fmark">R.PAY</span>
        </div>
      </footer>

      <StickyCTA />
    </main>
  );
}
