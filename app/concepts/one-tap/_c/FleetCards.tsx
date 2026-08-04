"use client";
import { useCallback, useEffect, useRef, useState } from "react";

/** ACT III — ONE NETWORK, rebuilt as an editorial fleet composition.
 *  One payment → many machines → one operational view, told by three
 *  cards: a dominant fleet visual and two operational data cards.
 *  Desktop: flex-interpolated expansion — hover/focus makes a card
 *  dominant; labels stay readable in every state. Mobile: snap carousel.
 *  Every figure is repo canon (97 machines, geofence, alerts) and the
 *  animated payment is explicitly labeled a simulation. */

const CARDS = ["fleet", "payment", "health"] as const;
type CardKey = (typeof CARDS)[number];

export default function FleetCards() {
  const [active, setActive] = useState<CardKey>("fleet");
  const [step, setStep] = useState(0); // payment-card simulation step
  const secRef = useRef<HTMLElement>(null);

  // The simulated payment advances only while the section is visible.
  useEffect(() => {
    const sec = secRef.current;
    if (!sec) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStep(2);
      return;
    }
    let timer: ReturnType<typeof setInterval> | undefined;
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting && !timer) {
            timer = setInterval(() => setStep((s) => (s + 1) % 4), 1600);
          } else if (!e.isIntersecting && timer) {
            clearInterval(timer);
            timer = undefined;
          }
        }),
      { threshold: 0.3 }
    );
    io.observe(sec);
    return () => { io.disconnect(); if (timer) clearInterval(timer); };
  }, []);

  const activate = useCallback((k: CardKey) => () => setActive(k), []);

  return (
    <section className="act fleet" id="fleet" ref={secRef} aria-label="One network">
      <header className="act-head">
        <p className="t-meta eyebrow">
          <span className="ar-t">شبكة واحدة</span>
          <span className="en-t">One network</span>
        </p>
        <h2 className="t-beat">
          <span className="ar-t">لمسة على ماكينة… يراها المشغّل في كل مكان.</span>
          <span className="en-t">A tap on one machine… the operator sees it everywhere.</span>
        </h2>
      </header>

      {/* Static reveal wrapper: its className never changes, so the reveal
          system's imperative `in` class survives React re-renders. */}
      <div className="cards-reveal">
      <div className={`fleet-row cards-row active-${active}`} role="list">
        {/* Card 1 — the fleet (dominant visual) */}
        <article
          role="listitem"
          tabIndex={0}
          className={`fcard image${active === "fleet" ? " is-active" : ""}`}
          onMouseEnter={activate("fleet")}
          onFocus={activate("fleet")}
          aria-label="Fleet overview"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/concept-08/network-hall.webp" alt="" loading="lazy" width={2400} height={1018} />
          <div className="fcard-scrim" aria-hidden="true" />
          <div className="fcard-body">
            <span className="led xl">97</span>
            <p className="t-body fcard-line">
              <span className="ar-t">ماكينة مُدارة تعمل بنظام واحد</span>
              <span className="en-t">managed machines running on one system</span>
            </p>
            <div className="chips" aria-hidden="true">
              <span className="chip t-meta"><span className="ar-t">أركيد</span><span className="en-t">Arcade</span></span>
              <span className="chip t-meta"><span className="ar-t">بيع ذاتي</span><span className="en-t">Vending</span></span>
              <span className="chip t-meta"><span className="ar-t">قهوة</span><span className="en-t">Coffee</span></span>
            </div>
          </div>
        </article>

        {/* Card 2 — one payment, live (simulation-labeled) */}
        <article
          role="listitem"
          tabIndex={0}
          className={`fcard data${active === "payment" ? " is-active" : ""}`}
          onMouseEnter={activate("payment")}
          onFocus={activate("payment")}
          aria-label="A payment, live — simulation"
        >
          <div className="fcard-top">
            <h3 className="t-body fcard-title">
              <span className="ar-t">عملية واحدة، لحظيًا</span>
              <span className="en-t">One payment, live</span>
            </h3>
            <span className="sim t-meta"><i /><span className="ar-t">محاكاة مباشرة</span><span className="en-t">Live simulation</span></span>
          </div>
          <ol className="pay-steps" data-step={step}>
            <li className="t-meta">
              <i className="dot" />
              <span className="ar-t">لمسة على الماكينة</span><span className="en-t">Tap on the machine</span>
              <span className="led sm">M-062</span>
            </li>
            <li className="t-meta">
              <i className="dot" />
              <span className="ar-t">تفويض الدفع</span><span className="en-t">Payment authorized</span>
              <span className="led sm">SAR 8.50</span>
            </li>
            <li className="t-meta">
              <i className="dot" />
              <span className="ar-t">تظهر عند المشغّل</span><span className="en-t">Lands with the operator</span>
              <span className="ok" aria-hidden="true" />
            </li>
          </ol>
        </article>

        {/* Card 3 — fleet health (canon figures + geofence) */}
        <article
          role="listitem"
          tabIndex={0}
          className={`fcard data${active === "health" ? " is-active" : ""}`}
          onMouseEnter={activate("health")}
          onFocus={activate("health")}
          aria-label="Fleet health"
        >
          <div className="fcard-top">
            <h3 className="t-body fcard-title">
              <span className="ar-t">حالة الأسطول</span>
              <span className="en-t">Fleet health</span>
            </h3>
            <span className="sim t-meta"><i /><span className="ar-t">محاكاة مباشرة</span><span className="en-t">Live simulation</span></span>
          </div>
          <ul className="health-rows">
            <li>
              <span className="t-meta"><span className="ar-t">ماكينات نشطة</span><span className="en-t">Machines online</span></span>
              <span className="led sm">97/97</span>
            </li>
            <li>
              <span className="t-meta"><span className="ar-t">تنبيهات مفتوحة</span><span className="en-t">Open alerts</span></span>
              <span className="led sm">0</span>
            </li>
            <li>
              <span className="t-meta"><span className="ar-t">النطاق الجغرافي الآمن</span><span className="en-t">Geofence</span></span>
              <span className="ok" aria-hidden="true" />
            </li>
          </ul>
        </article>
      </div>
      </div>
    </section>
  );
}
