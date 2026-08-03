"use client";
import { useEffect, useRef, useState } from "react";

/** Illustrative ops figures — the panel carries a visible «محاكاة مباشرة /
 *  Live simulation» label (pulse-concept precedent). The only real number
 *  on this screen is the fleet size, 97. No real dashboard screenshot
 *  exists in this repo, and none is faked here: this surface is honestly
 *  DOM-built in the machine's own LED vernacular. */
const KPIS = [
  { v: 12408, label: { ar: "مبيعات اليوم", en: "Sales today" } },
  { v: 97, of: 97, label: { ar: "ماكينات نشطة", en: "Machines online" } },
  { v: 0, label: { ar: "تنبيهات مفتوحة", en: "Open alerts" } },
];

/* Feed rows: mono windows are DIGITS/LATIN ONLY (Plex Mono has no Arabic). */
const FEED = [
  { id: "M-014", amt: "15.00" },
  { id: "M-062", amt: "8.50" },
  { id: "M-029", amt: "22.00" },
  { id: "M-081", amt: "4.00" },
];

const fmt = (n: number) => n.toLocaleString("en-US");

/** ACT IV — THE CONTROL ROOM. The payoff of the whole story: the tap the
 *  visitor just watched, landing on the operator's surface. Counters run
 *  once on intersect (SSR renders finals — no-JS shows truth, not zeros). */
export default function ControlRoom() {
  const secRef = useRef<HTMLElement>(null);
  const [on, setOn] = useState(false);
  const [row, setRow] = useState(0);
  const armed = useRef(false);

  useEffect(() => {
    const sec = secRef.current;
    if (!sec) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const leds = Array.from(sec.querySelectorAll<HTMLElement>(".kpi .led b"));
    const finals = KPIS.map((k) => k.v);
    const paint = (k: number) =>
      leds.forEach((el, i) => { el.textContent = fmt(Math.round(finals[i] * k)); });

    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (!e.isIntersecting || armed.current) return;
          armed.current = true;
          io.disconnect();
          setOn(true);
          if (reduce) { paint(1); return; }
          const t0 = performance.now();
          const tick = (t: number) => {
            const k = Math.min(1, (t - t0) / 400);
            paint(1 - Math.pow(1 - k, 3));
            if (k < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }),
      { threshold: 0.35 }
    );

    const r = sec.getBoundingClientRect();
    if (r.top > window.innerHeight * 0.9) { paint(0); io.observe(sec); }
    else { armed.current = true; setOn(true); }
    return () => io.disconnect();
  }, []);

  // The feed breathes: one new highlighted row every 2.4s while visible.
  useEffect(() => {
    if (!on) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setRow((v) => (v + 1) % FEED.length), 2400);
    return () => clearInterval(t);
  }, [on]);

  return (
    <section className={`act control${on ? " on" : ""}`} id="control" ref={secRef} aria-label="The control room">
      <header className="act-head">
        <h2 className="t-beat">
          <span className="ar-t">وفي الطرف الآخر… أنت.</span>
          <span className="en-t">And on the other side… you.</span>
        </h2>
        <p className="t-body act-lead">
          <span className="ar-t">اللمسة التي شاهدتها قبل قليل — تصل هنا في اللحظة نفسها: كل ماكينة، وكل عملية، في لوحة واحدة.</span>
          <span className="en-t">The tap you just watched lands here in the same moment: every machine, every transaction, one surface.</span>
        </p>
      </header>

      <div className="ctrl-shell" role="img" aria-label="R.Pay operations panel — live simulation">
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
          {KPIS.map((k, i) => (
            <div className="kpi" key={i}>
              <span className="led"><b>{fmt(k.v)}</b>{k.of ? <em>/{k.of}</em> : null}</span>
              <span className="t-meta">
                <span className="ar-t">{k.label.ar}</span>
                <span className="en-t">{k.label.en}</span>
              </span>
            </div>
          ))}

          <div className="feed" aria-hidden="true">
            <span className="t-meta feed-title">
              <span className="ar-t">آخر العمليات</span>
              <span className="en-t">Latest payments</span>
            </span>
            {FEED.map((f, i) => (
              <div className={`feed-row${row === i ? " hot" : ""}`} key={f.id}>
                <span className="led sm">{f.id}</span>
                <span className="led sm">SAR {f.amt}</span>
                <i className="ok" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
