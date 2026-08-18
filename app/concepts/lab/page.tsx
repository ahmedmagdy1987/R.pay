"use client";

import { useEffect, useRef, useState } from "react";
import ScrubSequence, {
  type PacingRange,
  type SeqFormat,
  type SeqSet,
  type TitleCard,
} from "@/components/ScrubSequence";
import { LOGOS } from "@/lib/assets/logos";
import { R_MARK } from "@/lib/assets/brand";

/* ── the three segments ───────────────────────────────────────────────────
   Each is two 5s clips concatenated, deduplicated, and sampled to 90 wide /
   60 tall frames. Both codecs sit side by side in the same directory; the
   loader picks one extension once per page. */

const seg = (name: string) => ({
  wide: { dir: `/assets/lab/seg/${name}/w`, count: 90, width: 1600, height: 900 } as SeqSet,
  tall: { dir: `/assets/lab/seg/${name}/t`, count: 60, width: 900, height: 1600 } as SeqSet,
});

const A = seg("a");
const B = seg("b");
const C = seg("c");

/* ── pacing ───────────────────────────────────────────────────────────────
   Measured, not guessed: inter-frame delta over the lossless intermediates.
   Byte weight alone is the wrong instrument here — it measures DETAIL, and
   segment B's climax is a dark machine on black that encodes cheap while
   changing fast. Delta measures change, which is what scroll should buy.  */

/* A: two quiet runs. 0.12-0.24 is the cloud interior (delta 2.7-8, and the
   cheapest frames on the page at ~850 B). 0.38-0.47 is a detailed aerial
   plate that barely moves — expensive to encode, nearly static to watch.
   0.58-0.78 is the plunge into the mall and earns the room. */
const PACING_A: PacingRange[] = [
  { from: 0.12, to: 0.24, weight: 0.45 },
  { from: 0.38, to: 0.47, weight: 0.6 },
  { from: 0.58, to: 0.78, weight: 1.55 },
];

/* B: the corridor glide is dense, the long approach across the empty hall is
   not, and the crawl across the machine's face into the touch is the peak of
   the whole film — it gets the most scroll distance on the page. */
const PACING_B: PacingRange[] = [
  { from: 0.03, to: 0.2, weight: 1.2 },
  { from: 0.24, to: 0.68, weight: 0.6 },
  { from: 0.72, to: 0.9, weight: 1.6 },
  { from: 0.9, to: 1.0, weight: 0.7 },
];

/* C: measured almost perfectly even — no run breaches 150% or drops below
   50% of the mean except the first two frames. Left near-linear on purpose;
   inventing a curve here would be decoration, not pacing. */
const PACING_C: PacingRange[] = [
  { from: 0.0, to: 0.04, weight: 0.6 },
  { from: 0.76, to: 0.95, weight: 1.2 },
];

const TITLE_A: TitleCard = {
  from: 0.13,
  to: 0.235,
  ar: "٩٧ ماكينة. مملكة واحدة.",
  en: "97 machines. One kingdom.",
};

const WA =
  "https://wa.me/966550796555?text=%D8%A3%D8%B1%D8%BA%D8%A8%20%D8%A8%D8%AD%D8%AC%D8%B2%20%D8%B9%D8%B1%D8%B6%20%D8%AA%D8%AC%D8%B1%D9%8A%D8%A8%D9%8A%20%D9%84%D9%80%20R.Pay";

const PROPS = [
  {
    n: "01",
    ar: "دفع بلا تلامس",
    en: "Contactless payment",
    arP: "وحدة دفع مدمجة في كل ماكينة تقبل البطاقات والمحافظ الرقمية في أقل من ثانيتين.",
    enP: "An embedded payment unit in every machine, taking cards and wallets in under two seconds.",
  },
  {
    n: "02",
    ar: "تشغيل لحظي",
    en: "Live operations",
    arP: "كل عملية تصل إلى لوحة التحكم فور حدوثها — المخزون، الأعطال، التحصيل.",
    enP: "Every transaction lands on the dashboard as it happens — stock, faults, settlement.",
  },
  {
    n: "03",
    ar: "تغطية المملكة",
    en: "Kingdom-wide",
    arP: "شبكة تعمل عبر المولات والمرافق والمواقع الترفيهية في مدن المملكة.",
    enP: "A network running across malls, facilities and leisure venues nationwide.",
  },
];

const SECTORS = [
  { ar: "ألعاب الأركيد", en: "Arcade" },
  { ar: "المشروبات والوجبات", en: "Vending" },
  { ar: "القهوة", en: "Coffee" },
  { ar: "المولات", en: "Malls" },
  { ar: "المرافق", en: "Facilities" },
  { ar: "الترفيه", en: "Leisure" },
];

const TARGET = 465255;

export default function LabPage() {
  const [en, setEn] = useState(false);
  const [fmt, setFmt] = useState<SeqFormat>("auto");
  const progRef = useRef<HTMLDivElement>(null);
  const specRef = useRef<HTMLDivElement>(null);
  const countRefAr = useRef<HTMLSpanElement>(null);
  const countRefEn = useRef<HTMLSpanElement>(null);

  /* Optional format override, so the WebP fallback path can be exercised on a
     browser that does support AVIF: /concepts/lab?fmt=webp */
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("fmt");
    if (q === "webp" || q === "avif" || q === "auto") setFmt(q);
  }, []);

  useEffect(() => {
    const h = document.documentElement;
    h.classList.toggle("en", en);
    h.setAttribute("dir", en ? "ltr" : "rtl");
    h.setAttribute("lang", en ? "en" : "ar");
  }, [en]);

  /* One client island owns the page chrome: progress hairline, reveals, the
     counter, and the dev readout. Nothing here sets React state on scroll. */
  useEffect(() => {
    const bar = progRef.current;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        if (bar) bar.style.width = `${max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0}%`;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const io = new IntersectionObserver(
      (es, obs) =>
        es.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add("in");
          obs.unobserve(e.target);
        }),
      { rootMargin: "0px 0px -10% 0px", threshold: 0.06 },
    );
    document.querySelectorAll(".lab .rv").forEach((el) => io.observe(el));

    /* Counter runs once, on approach. */
    const cEl = document.querySelector(".counter");
    let cDone = false;
    const cIo = new IntersectionObserver(
      (es) => {
        if (cDone || !es.some((e) => e.isIntersecting)) return;
        cDone = true;
        const t0 = performance.now();
        const DUR = 1600;
        const step = (now: number) => {
          const p = Math.min(1, (now - t0) / DUR);
          // ease-out so it decelerates into the real figure
          const v = Math.round(TARGET * (1 - Math.pow(1 - p, 3)));
          if (countRefAr.current) countRefAr.current.textContent = v.toLocaleString("ar-EG");
          if (countRefEn.current) countRefEn.current.textContent = v.toLocaleString("en-US");
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      },
      { threshold: 0.3 },
    );
    if (cEl) cIo.observe(cEl);

    /* Dev readout: which codec, which segment is armed, live bitmap count. */
    const spec = specRef.current;
    const syncSpec = () => {
      if (!spec) return;
      const segs = Array.from(document.querySelectorAll<HTMLElement>(".scrubseq"));
      const armed = segs.findIndex((s) => s.dataset.armed === "1");
      const fmtNow = segs.find((s) => s.dataset.fmt)?.dataset.fmt ?? "…";
      const live = (window as unknown as { __scrubLive?: number }).__scrubLive ?? 0;
      const bw = Number(segs.find((s) => s.dataset.bmw)?.dataset.bmw ?? 0);
      const bh = Number(segs.find((s) => s.dataset.bmh)?.dataset.bmh ?? 0);
      const mb = bw ? ((live * bw * bh * 4) / 1048576).toFixed(1) : "0";
      spec.innerHTML =
        `<span>fmt <b>${fmtNow}</b></span>` +
        `<span>seg <b>${armed < 0 ? "—" : "ABC"[armed]}</b></span>` +
        `<span>decoded <b>${live}</b></span>` +
        `<span>mem <b>${mb} MB</b></span>`;
    };
    const specTimer = setInterval(syncSpec, 250);
    syncSpec();

    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
      cIo.disconnect();
      clearInterval(specTimer);
    };
  }, []);

  return (
    <>
      <div className="lab-prog" ref={progRef} aria-hidden="true" />

      <header className="lab-top">
        <a className="lab-mark" href="#top" aria-label="R.Pay">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={R_MARK} alt="" />
          <span>Pay</span>
        </a>
        <button className="lab-lang" onClick={() => setEn((v) => !v)} aria-label="Toggle language">
          {en ? "ع" : "EN"}
        </button>
      </header>

      {/* Pinned from the first viewport — 700vh of film should never be the
          price of finding a way to talk to someone. */}
      <a className="lab-dock" href={WA}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.4 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-1.7-.1a13 13 0 0 1-5-4.4c-.4-.6-1-1.5-1-2.9 0-1.3.7-2 1-2.3.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .6l-.4.5c-.1.2-.3.3-.1.6.5.8 1 1.4 1.8 2 .3.2.5.2.7 0l.8-.9c.2-.2.3-.2.6-.1l1.9.9c.3.1.4.2.5.3 0 .2 0 .8-.2 1.4Z" />
        </svg>
        <span className="ar-t">تحدّث إلى المبيعات</span>
        <span className="en-t">Talk to sales</span>
      </a>

      <div className="lab-spec" ref={specRef} aria-hidden="true" />

      <main id="top">
        {/* ── SEGMENT A — orbit to the mall entrance ─────────────────── */}
        <ScrubSequence
          key={`a-${fmt}`}
          {...A}
          scrollVh={250}
          damping={0.12}
          pacing={PACING_A}
          titleCard={TITLE_A}
          format={fmt}
          label="From orbit to the floor"
        >
          <span className="lab-caption">01 · Orbit → Riyadh → the floor</span>
        </ScrubSequence>

        <section className="act">
          <span className="kicker rv">
            <span className="ar-t">آر باي · المملكة العربية السعودية</span>
            <span className="en-t">R.Pay · Saudi Arabia</span>
          </span>
          <h1 className="h-display rv">
            <span className="ar-t">
              لمسة واحدة. <em>تحكّم كامل.</em>
            </span>
            <span className="en-t">
              One tap. <em>Total control.</em>
            </span>
          </h1>
          <p className="p-body rv">
            <span className="ar-t">
              شبكة دفع ذاتية الخدمة تعمل عبر المملكة. كل ماكينة متصلة، وكل عملية مرئية، من أول لمسة.
            </span>
            <span className="en-t">
              A self-service payment network running across the Kingdom. Every machine connected,
              every transaction visible, from the first tap.
            </span>
          </p>
          <div className="rv">
            <a className="cta-warm" href={WA}>
              <span className="ar-t">احجز عرض تجريبي</span>
              <span className="en-t">Book a demo</span>
            </a>
            <a className="cta-ghost" href="#network">
              <span className="ar-t">كيف يعمل</span>
              <span className="en-t">How it works</span>
            </a>
          </div>
        </section>

        {/* ── SEGMENT B — the corridor to the touch ──────────────────── */}
        <ScrubSequence
          key={`b-${fmt}`}
          {...B}
          scrollVh={250}
          damping={0.12}
          pacing={PACING_B}
          format={fmt}
          label="The corridor and the tap"
        >
          <span className="lab-caption">02 · Corridor → machine → the tap</span>
        </ScrubSequence>

        <section className="act" id="network">
          <span className="kicker rv">
            <span className="ar-t">المنصّة</span>
            <span className="en-t">The platform</span>
          </span>
          <h2 className="h-display rv">
            <span className="ar-t">
              ماكينة تعمل. <em>ومشغّل يعرف.</em>
            </span>
            <span className="en-t">
              A machine that works. <em>An operator who knows.</em>
            </span>
          </h2>
          <div className="props">
            {PROPS.map((p) => (
              <article className="rv" key={p.n}>
                <span className="n">{p.n}</span>
                <h3>
                  <span className="ar-t">{p.ar}</span>
                  <span className="en-t">{p.en}</span>
                </h3>
                <p>
                  <span className="ar-t">{p.arP}</span>
                  <span className="en-t">{p.enP}</span>
                </p>
              </article>
            ))}
          </div>
          <div className="sectors rv">
            {SECTORS.map((s) => (
              <span key={s.en}>
                <span className="ar-t">{s.ar}</span>
                <span className="en-t">{s.en}</span>
              </span>
            ))}
          </div>
        </section>

        {/* ── SEGMENT C — the pulse out to orbit ─────────────────────── */}
        <ScrubSequence
          key={`c-${fmt}`}
          {...C}
          scrollVh={200}
          damping={0.12}
          pacing={PACING_C}
          format={fmt}
          label="The network lights up"
        >
          <span className="lab-caption">03 · Pulse → the constellation</span>
        </ScrubSequence>

        <section className="act">
          <span className="kicker rv">
            <span className="ar-t">حتى اليوم</span>
            <span className="en-t">To date</span>
          </span>
          <div className="counter rv">
            <span className="ar-t" ref={countRefAr}>
              ٠
            </span>
            <span className="en-t" ref={countRefEn}>
              0
            </span>
          </div>
          <div className="counter-cap rv">
            <span className="ar-t">عملية دفع عبر الشبكة</span>
            <span className="en-t">Transactions across the network</span>
          </div>

          <div className="logos rv">
            {LOGOS.slice(0, 12).map((l) => (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img key={l.alt} src={l.uri} alt={l.alt} loading="lazy" />
            ))}
          </div>

          <div className="rv">
            <a className="cta-warm" href={WA}>
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
      </main>
    </>
  );
}
