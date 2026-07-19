"use client";
import { useEffect } from "react";
import Preload from "./_c/Preload";
import FilmHero from "./_c/FilmHero";
import DropSequence from "./_c/DropSequence";
import MachineRail from "./_c/MachineRail";
import Network from "./_c/Network";
import StickyCTA from "./_c/StickyCTA";

/** Concept 07 — "The Drop". Seven acts, one fall, one destination (#demo). */
export default function FlowPage() {
  // #prog — the cyan hairline tracking overall page progress.
  useEffect(() => {
    const bar = document.getElementById("prog");
    if (!bar) return;
    let ticking = false;
    const draw = () => {
      ticking = false;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = `${max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0}%`;
    };
    const onScroll = () => {
      if (!ticking) { ticking = true; requestAnimationFrame(draw); }
    };
    draw();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    // Scroll-reveal: one law — 400ms, 12px rise, same easing everywhere.
    // `.reveals` is added by JS, so [data-rise] only ever hides on a browser
    // that is actually going to run the observer. No JS => nothing disappears.
    document.querySelector(".flow")?.classList.add("reveals");

    const targets = Array.from(
      document.querySelectorAll<HTMLElement>(
        ".flow .act:not(.hero) h2, .flow .act:not(.hero) > p, .flow .rail-card," +
          ".flow .drop-m-card, .flow .net-stat, .flow .ctrl-shot, .flow .foot"
      )
    );
    targets.forEach((el, i) => {
      el.setAttribute("data-rise", "");
      // Network sets its own per-stat delay; don't stomp it.
      if (!el.style.transitionDelay) el.style.transitionDelay = `${Math.min(i % 4, 3) * 60}ms`;
    });

    const reveal = (es: IntersectionObserverEntry[], obs: IntersectionObserver) =>
      es.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add("in");
        obs.unobserve(e.target); // the page settles; nothing replays on scroll-back
      });
    // The -12% bottom margin gives content a beat before it rises, but it makes
    // intersection IMPOSSIBLE for anything anchored to the very bottom of the
    // page: the footer's top never clears the shrunken root, so it stayed at
    // opacity 0 forever. The tail therefore gets its own zero-margin observer.
    const ioMain = new IntersectionObserver(reveal, {
      rootMargin: "0px 0px -12% 0px",
      threshold: 0.05,
    });
    const ioTail = new IntersectionObserver(reveal, { threshold: 0.01 });
    targets.forEach((el) => (el.classList.contains("foot") ? ioTail : ioMain).observe(el));

    // Belt and braces: at the very bottom of the page nothing may still be hidden.
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
    <main>
      <Preload />
      <FilmHero />
      <DropSequence />
      <MachineRail />
      <Network />

      {/* ACT V — CONTROL. Rational-justification act: three lines, no
          feature table. NOTE: no dashboard product-shot asset exists in the
          repo, so the "shot" is a DOM-built ops panel in the machine's own
          LED vernacular — swap .ctrl-shot for an <img> when a real capture
          lands. */}
      <section className="act control" id="control" aria-label="Control platform">
        <h2 className="t-beat">
          <span className="ar-t">تحكّم كامل.</span>
          <span className="en-t">Full control.</span>
        </h2>
        <p className="t-body ctrl-line">
          <span className="ar-t">كل ماكينة، وكل عملية، في لوحة واحدة — لحظيًا.</span>
          <span className="en-t">Every machine, every transaction, one dashboard — live.</span>
        </p>
        <div className="ctrl-shot" role="img" aria-label="Control platform dashboard">
          <div className="ctrl-bar"><i /><i /><i /></div>
          <div className="ctrl-rows">
            <div className="ctrl-row">
              <span className="t-meta"><span className="ar-t">مبيعات اليوم</span><span className="en-t">Sales today</span></span>
              <span className="led">12,408</span>
            </div>
            <div className="ctrl-row">
              <span className="t-meta"><span className="ar-t">ماكينات نشطة</span><span className="en-t">Machines online</span></span>
              <span className="led">97/97</span>
            </div>
            <div className="ctrl-row">
              <span className="t-meta"><span className="ar-t">تنبيهات مفتوحة</span><span className="en-t">Open alerts</span></span>
              <span className="led">0</span>
            </div>
          </div>
        </div>
      </section>

      {/* ACT VI — THE CLOSE. One line. One oversized ask. Nothing else. */}
      <section className="act close" id="demo" aria-label="Book a demo">
        <div className="bg" aria-hidden="true" />
        <div className="close-inner">
          <h2 className="t-display">
            <span className="ar-t">دورك الآن.</span>
            <span className="en-t">Your turn.</span>
          </h2>
          {/* CTA 4 of 4 — oversized, centred, uncontested */}
          <a className="cta-warm cta-xl" href="https://wa.me/966550796555?text=%D8%A3%D8%B1%D8%BA%D8%A8%20%D8%A8%D8%AD%D8%AC%D8%B2%20%D8%B9%D8%B1%D8%B6%20%D8%AA%D8%AC%D8%B1%D9%8A%D8%A8%D9%8A%20%D9%84%D9%80%20R.Pay">
            <span className="ar-t">احجز عرض تجريبي</span>
            <span className="en-t">Book a demo</span>
          </a>
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
