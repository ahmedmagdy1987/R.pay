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
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
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

      <StickyCTA />
    </main>
  );
}
