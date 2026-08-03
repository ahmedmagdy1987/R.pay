"use client";
import { useEffect, useRef, useState } from "react";

/** ACT IV — THE CONTROL ROOM, rebuilt as a sticky product walkthrough.
 *  The dashboard fills the screen (≈80vw, max 1320px) and transitions
 *  through three states as the visitor scrolls the 240vh section:
 *    1 — a payment arrives   2 — fleet status updates   3 — one view.
 *  Everything simulated carries the «محاكاة مباشرة» disclosure; the only
 *  real figure is the canonical 97. LED windows are digits/Latin only.
 *  No dashboard screenshot exists in this repo and none is faked — this
 *  surface is honestly DOM-built. Reduced motion pins state 3. */

const STEPS = [
  { ar: "دفعة تصل", en: "A payment arrives" },
  { ar: "الحالة تتحدّث", en: "Status updates" },
  { ar: "رؤية واحدة", en: "One view" },
];

const FEED = [
  { id: "M-062", amt: "8.50" },
  { id: "M-014", amt: "15.00" },
  { id: "M-029", amt: "22.00" },
  { id: "M-081", amt: "4.00" },
  { id: "M-047", amt: "12.00" },
];

/* Illustrative per-branch bars (9 branches is canon; heights are not). */
const BARS = [62, 84, 45, 91, 70, 56, 78, 38, 66];

export default function ControlRoom() {
  const secRef = useRef<HTMLElement>(null);
  const [state, setState] = useState(1);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const sec = secRef.current;
    if (!sec) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setState(3);
      setOn(true);
      return;
    }
    let ticking = false;
    const compute = () => {
      ticking = false;
      const r = sec.getBoundingClientRect();
      const vh = window.innerHeight;
      if (r.top < vh && r.bottom > 0) setOn(true);
      const total = r.height - vh;
      if (total <= 0) { setState(3); return; }
      const p = Math.max(0, Math.min(1, -r.top / total));
      setState(p < 0.34 ? 1 : p < 0.67 ? 2 : 3);
    };
    const onScroll = () => {
      if (!ticking) { ticking = true; requestAnimationFrame(compute); }
    };
    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section
      className={`act control s${state}${on ? " on" : ""}`}
      id="control"
      ref={secRef}
      aria-label="The control room"
    >
      <div className="ctrl-stick">
        <div className="ctrl-frame">
          {/* Title integrated with the surface, not floating far above. */}
          <header className="ctrl-head">
            <div>
              <p className="t-meta eyebrow">
                <span className="ar-t">غرفة التحكّم</span>
                <span className="en-t">The control room</span>
              </p>
              <h2 className="t-beat">
                <span className="ar-t">وفي الطرف الآخر… أنت.</span>
                <span className="en-t">And on the other side… you.</span>
              </h2>
            </div>
            <ol className="ctrl-steps" aria-label="Walkthrough">
              {STEPS.map((s, i) => (
                <li key={i} className={`t-meta${state >= i + 1 ? " done" : ""}${state === i + 1 ? " now" : ""}`}>
                  <i />
                  <span className="ar-t">{s.ar}</span>
                  <span className="en-t">{s.en}</span>
                </li>
              ))}
            </ol>
          </header>

          <div className="ctrl-shell" role="img" aria-label="R.Pay operations surface — live simulation">
            <div className="ctrl-runner" aria-hidden="true" />
            <div className="ctrl-bar">
              <span className="dots" aria-hidden="true"><i /><i /><i /></span>
              <span className="t-meta ctrl-title">
                <span className="ar-t">منصّة التحكّم</span>
                <span className="en-t">Control platform</span>
              </span>
              <span className="sim t-meta">
                <i />
                <span className="ar-t">محاكاة مباشرة</span>
                <span className="en-t">Live simulation</span>
              </span>
            </div>

            <div className="ctrl-grid">
              <div className="kpis">
                <div className="kpi k-sales">
                  <span className="led"><b>12,408</b></span>
                  <span className="t-meta"><span className="ar-t">مبيعات اليوم</span><span className="en-t">Sales today</span></span>
                </div>
                <div className="kpi k-fleet">
                  <span className="led"><b>97</b><em>/97</em></span>
                  <span className="t-meta"><span className="ar-t">ماكينات نشطة</span><span className="en-t">Machines online</span></span>
                </div>
                <div className="kpi k-alerts">
                  <span className="led"><b>0</b></span>
                  <span className="t-meta"><span className="ar-t">تنبيهات مفتوحة</span><span className="en-t">Open alerts</span></span>
                </div>
              </div>

              <div className="feed" aria-hidden="true">
                <span className="t-meta feed-title">
                  <span className="ar-t">آخر العمليات</span>
                  <span className="en-t">Latest payments</span>
                </span>
                {FEED.map((f, i) => (
                  <div className={`feed-row${i === 0 ? " hot" : ""}`} key={f.id}>
                    <span className="led sm">{f.id}</span>
                    <span className="led sm">SAR {f.amt}</span>
                    <i className="ok" />
                  </div>
                ))}
              </div>

              <div className="branches" aria-hidden="true">
                <span className="t-meta feed-title">
                  <span className="ar-t">النشاط عبر 9 فروع</span>
                  <span className="en-t">Activity across 9 branches</span>
                </span>
                <div className="bars">
                  {BARS.map((h, i) => (
                    <i key={i} style={{ "--h": `${h}%`, transitionDelay: `${i * 45}ms` } as React.CSSProperties} />
                  ))}
                </div>
                <div className="geo t-meta">
                  <span className="ok" aria-hidden="true" />
                  <span className="ar-t">كل الأجهزة ضمن النطاق الآمن</span>
                  <span className="en-t">All devices inside the geofence</span>
                </div>
              </div>
            </div>

            {/* State 1 toast: the tap from the hero, arriving here. */}
            <div className="toast" aria-hidden="true">
              <i className="dot" />
              <span className="t-meta"><span className="ar-t">دفعة جديدة</span><span className="en-t">New payment</span></span>
              <span className="led sm">M-062 · SAR 8.50</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
