"use client";
import { useEffect, useRef, useState, CSSProperties } from "react";
import { DEVICE } from "@/lib/assets/device";

const STEPS = [
  {
    n: "01",
    ar: "الدفع الذكي المدمج",
    en: "Integrated Smart Payment",
    arP: "وحدة دفع إلكترونية داخل كل جهاز تقبل البطاقات والمحافظ الرقمية، وتعرض العمليات مباشرة في لوحة التحكم.",
    enP: "An embedded payment unit in every machine accepts cards and digital wallets, with transactions shown live in the dashboard.",
  },
  {
    n: "02",
    ar: "الرادار الجغرافي",
    en: "Geofence Radar",
    arP: "يحدَّد موقع جغرافي لكل جهاز، وعند تغييره يُرسل تنبيه فوري ويُغلق الجهاز تلقائيًا إذا خرج عن الحدود.",
    enP: "Each device gets a fixed location; any movement triggers an instant alert and automatic shutdown outside the zone.",
  },
  {
    n: "03",
    ar: "الاسترجاع النقدي التلقائي",
    en: "Automatic Cashback",
    arP: "عند فشل الدفع أو حدوث خلل يُعاد المبلغ تلقائيًا دون تدخل بشري، وتُسجَّل الحالة في لوحة التحكم.",
    enP: "On a failed payment the amount is refunded automatically with no human intervention, and the incident is logged.",
  },
  {
    n: "04",
    ar: "لوحة التحكم الموحّدة",
    en: "Unified Dashboard",
    arP: "مبيعات وأرباح وأجهزة وهدايا مع تقارير لحظية تشغيلية ومالية، كل شيء في مكان واحد.",
    enP: "Sales, profit, devices and rewards with real-time operational and financial reports, all in one place.",
  },
];

export default function HowItWorks() {
  const [cur, setCur] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const inView = useRef(false);

  const stop = () => {
    if (timer.current) { clearInterval(timer.current); timer.current = null; }
  };
  const start = () => {
    if (timer.current || !inView.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    timer.current = setInterval(() => setCur((c) => (c + 1) % STEPS.length), 4500);
  };

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (es) => {
        inView.current = es[0].isIntersecting;
        if (es[0].isIntersecting) start();
        else stop();
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => { io.disconnect(); stop(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pick = (i: number) => { stop(); setCur(i); start(); };

  return (
    <section id="how" ref={wrapRef}>
      <div className="wrap">
        <div className="khead rv">
          <i />
          <span>
            <span className="ar-t">كيف يعمل النظام</span>
            <span className="en-t">How it works</span>
          </span>
          <i />
        </div>
        <h2 className="stitle rv d1">
          <span className="ar-t">
            أربع خطوات، <em>تحكّم كامل</em>
          </span>
          <span className="en-t">
            Four steps to <em>full control</em>
          </span>
        </h2>
        <p className="ssub rv d2">
          <span className="ar-t">نظام موحّد يجمع الدفع الإلكتروني والمراقبة التشغيلية.</span>
          <span className="en-t">One system for e-payment and operational control.</span>
        </p>

        <div className="hgrid2">
          <div className="hsteps rv">
            {STEPS.map((s, i) => (
              <button
                key={s.n}
                type="button"
                className={`hstep${i === cur ? " on" : ""}`}
                onClick={() => pick(i)}
              >
                <span className="hnum">
                  {s.n}
                  <svg className="hprog" viewBox="0 0 56 56">
                    <circle cx="28" cy="28" r="26" />
                  </svg>
                </span>
                <div>
                  <h3>
                    <span className="ar-t">{s.ar}</span>
                    <span className="en-t">{s.en}</span>
                  </h3>
                  <p>
                    <span className="ar-t">{s.arP}</span>
                    <span className="en-t">{s.enP}</span>
                  </p>
                </div>
              </button>
            ))}
          </div>

          <div className="hvis rv d1">
            <div className="gridbg" />

            <div className={`hpane${cur === 0 ? " on" : ""}`}>
              <div className="sc1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={DEVICE} alt="R.Pay terminal" />
                <span className="tapcard" />
                <span className="okchip">
                  <i>✓</i>
                  <span className="ar-t">دفعة ناجحة · SAR 15.00</span>
                  <span className="en-t">Approved · SAR 15.00</span>
                </span>
              </div>
            </div>

            <div className={`hpane${cur === 1 ? " on" : ""}`}>
              <div className="mradar">
                <div className="rring r1" /><div className="rring r2" />
                <div className="rring r3" /><div className="rring r4" />
                <div className="rcross" /><div className="sweep" />
                <div className="fence" /><div className="dev" />
              </div>
            </div>

            <div className={`hpane${cur === 2 ? " on" : ""}`}>
              <div className="sc3">
                <div className="refring" />
                <div className="orb"><span className="coin">SAR</span></div>
                <div className="core">
                  <svg viewBox="0 0 24 24">
                    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4M3 5v14a2 2 0 0 0 2 2h16v-5" />
                    <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
                  </svg>
                  <b>
                    <span className="ar-t">استرداد تلقائي ✓</span>
                    <span className="en-t">Auto refund ✓</span>
                  </b>
                </div>
              </div>
            </div>

            <div className={`hpane${cur === 3 ? " on" : ""}`}>
              <div className="sc4">
                <div className="winbar"><i /><i /><i /></div>
                <div className="bignum" dir="ltr">465,255</div>
                <div className="smlbl">
                  <span className="ar-t">إجمالي المشتريات · مباشر</span>
                  <span className="en-t">Total purchases · live</span>
                </div>
                <div className="bars">
                  {[46, 72, 58, 88, 64, 95].map((h, i) => (
                    <i key={i} style={{ "--h": `${h}%`, "--bd": `${i * 0.15}s` } as CSSProperties} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
