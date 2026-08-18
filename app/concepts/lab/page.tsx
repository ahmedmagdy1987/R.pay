"use client";

import { useEffect, useRef, useState } from "react";
import ScrubSequence, {
  type PacingRange,
  type SeqFormat,
  type SeqSet,
  type TitleCard,
} from "@/components/ScrubSequence";
import Pending from "@/components/Pending";
import { claimMode, devValue } from "@/lib/content";
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

const PACING_A: PacingRange[] = [
  { from: 0.12, to: 0.24, weight: 0.45 },
  { from: 0.38, to: 0.47, weight: 0.6 },
  { from: 0.58, to: 0.78, weight: 1.55 },
];
const PACING_B: PacingRange[] = [
  { from: 0.03, to: 0.2, weight: 1.2 },
  { from: 0.24, to: 0.68, weight: 0.6 },
  { from: 0.72, to: 0.9, weight: 1.6 },
  { from: 0.9, to: 1.0, weight: 0.7 },
];
const PACING_C: PacingRange[] = [
  { from: 0.0, to: 0.04, weight: 0.6 },
  { from: 0.76, to: 0.95, weight: 1.2 },
];

/* NOTE: the "97" in this card is content/claims.json `fleet.machines`, which
   is unverified and blocks launch. It is baked into the film's frames, so it
   cannot be gated the way the DOM figures below are — it has to be resolved
   or the title card has to be re-cut before this goes public. */
const TITLE_A: TitleCard = {
  from: 0.13,
  to: 0.235,
  ar: "٩٧ ماكينة. مملكة واحدة.",
  en: "97 machines. One kingdom.",
};

const WA =
  "https://wa.me/966550796555?text=%D8%A3%D8%B1%D8%BA%D8%A8%20%D8%A8%D8%AD%D8%AC%D8%B2%20%D8%B9%D8%B1%D8%B6%20%D8%AA%D8%AC%D8%B1%D9%8A%D8%A8%D9%8A%20%D9%84%D9%80%20R.Pay";

/* Only the seven named accounts, in the order given. Every one resolves to an
   asset already in the repo from concepts 01-07 — nothing recreated. */
const NAMED = ["Roshn", "Dar Al Arkan", "LuLu", "Boulevard City", "Kinan", "Sela", "Hamat"];
const NAMED_AR: Record<string, string> = {
  Roshn: "روشن",
  "Dar Al Arkan": "دار الأركان",
  LuLu: "لولو",
  "Boulevard City": "بوليفارد سيتي",
  Kinan: "كنان",
  Sela: "سلا",
  Hamat: "حمات",
};
const CLIENT_LOGOS = NAMED.map((n) => LOGOS.find((l) => l.alt === n)).filter(
  (l): l is { alt: string; uri: string } => Boolean(l),
);

const SECTORS = [
  { ar: "مولات", en: "Malls" },
  { ar: "مجمعات سكنية", en: "Residential compounds" },
  { ar: "مقرات شركات", en: "Corporate headquarters" },
  { ar: "صالات رياضية", en: "Gyms" },
];

export default function LabPage() {
  const [en, setEn] = useState(false);
  const [fmt, setFmt] = useState<SeqFormat>("auto");
  const progRef = useRef<HTMLDivElement>(null);
  const specRef = useRef<HTMLDivElement>(null);
  const txAr = useRef<HTMLSpanElement>(null);
  const txEn = useRef<HTMLSpanElement>(null);

  /* Both headline figures are declared, unverified, launch-blocking claims.
     In a production content build they render their designed absence instead
     of the number; here they render the number behind a provenance chip. */
  const txMode = claimMode("totals.transactions");
  const machinesMode = claimMode("fleet.machines");
  const TX = devValue<number>("totals.transactions");
  const MACHINES = devValue<number>("fleet.machines");

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

    const counter = document.querySelector(".js-tx");
    let counted = false;
    const cIo = new IntersectionObserver(
      (es) => {
        if (counted || !es.some((e) => e.isIntersecting)) return;
        counted = true;
        const t0 = performance.now();
        const DUR = 1700;
        const step = (now: number) => {
          const p = Math.min(1, (now - t0) / DUR);
          const v = Math.round(TX * (1 - Math.pow(1 - p, 3)));
          if (txAr.current) txAr.current.textContent = v.toLocaleString("ar-EG");
          if (txEn.current) txEn.current.textContent = v.toLocaleString("en-US");
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      },
      { threshold: 0.3 },
    );
    if (counter) cIo.observe(counter);

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
        `<span>fmt <b>${fmtNow}</b></span><span>seg <b>${armed < 0 ? "—" : "ABC"[armed]}</b></span>` +
        `<span>decoded <b>${live}</b></span><span>mem <b>${mb} MB</b></span>`;
    };
    const specTimer = setInterval(syncSpec, 250);
    syncSpec();

    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
      cIo.disconnect();
      clearInterval(specTimer);
    };
  }, [TX]);

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

      <a className="lab-dock" href={WA}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.4 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-1.7-.1a13 13 0 0 1-5-4.4c-.4-.6-1-1.5-1-2.9 0-1.3.7-2 1-2.3.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .6l-.4.5c-.1.2-.3.3-.1.6.5.8 1 1.4 1.8 2 .3.2.5.2.7 0l.8-.9c.2-.2.3-.2.6-.1l1.9.9c.3.1.4.2.5.3 0 .2 0 .8-.2 1.4Z" />
        </svg>
        <span className="ar-t">تحدّث إلينا</span>
        <span className="en-t">Talk to us</span>
      </a>

      <div className="lab-spec" ref={specRef} aria-hidden="true" />

      <main id="top">
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

        {/* ── DOM A ─────────────────────────────────────────────────────── */}
        <section className="act">
          <span className="kicker rv">
            <span className="ar-t">آر باي · المملكة العربية السعودية</span>
            <span className="en-t">R.Pay · Saudi Arabia</span>
          </span>
          <h1 className="h-display rv">
            <span className="ar-t">
              مساحتك الفارغة… <em>تبيع الآن.</em>
            </span>
            <span className="en-t">
              Your empty space <em>is now selling.</em>
            </span>
          </h1>
          <p className="p-body rv">
            <span className="ar-t">
              أجهزة بيع ذاتية بالدفع التلامسي. نركّب ونشغّل ونصون — وأنت تستلم عائدك.
            </span>
            <span className="en-t">
              Self-service machines with contactless payment. We install, operate and maintain. You
              collect.
            </span>
          </p>
          <div className="rv">
            <a className="cta-warm" href={WA}>
              <span className="ar-t">تحدّث إلينا</span>
              <span className="en-t">Talk to us</span>
            </a>
          </div>
        </section>

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

        {/* ── DOM B ─────────────────────────────────────────────────────── */}
        <section className="act" id="platform">
          <span className="kicker rv">
            <span className="ar-t">ما الذي تحصل عليه</span>
            <span className="en-t">What you get</span>
          </span>
          <div className="props">
            <article className="rv">
              <span className="n">01</span>
              <h3>
                <span className="ar-t">صفر تشغيل عليك</span>
                <span className="en-t">Zero operational load</span>
              </h3>
              <p>
                <span className="ar-t">التركيب والتعبئة والصيانة والدعم — كلها علينا.</span>
                <span className="en-t">
                  Installation, restocking, maintenance and support — all on us.
                </span>
              </p>
            </article>
            <article className="rv">
              <span className="n">02</span>
              <h3>
                <span className="ar-t">دخل من مساحة كانت معطّلة</span>
                <span className="en-t">Revenue from dead space</span>
              </h3>
              <p>
                <Pending id="REVENUE_MODEL" note="Ahmed to supply" />
              </p>
            </article>
            <article className="rv">
              <span className="n">03</span>
              <h3>
                <span className="ar-t">رؤية مباشرة</span>
                <span className="en-t">Live visibility</span>
              </h3>
              <p>
                <span className="ar-t">كل عملية وكل جهاز، لحظة بلحظة، من لوحة واحدة.</span>
                <span className="en-t">
                  Every transaction, every machine, in real time, from one dashboard.
                </span>
              </p>
            </article>
          </div>

          <div className="sectors rv">
            {SECTORS.map((s) => (
              <span key={s.en}>
                <span className="ar-t">{s.ar}</span>
                <span className="en-t">{s.en}</span>
              </span>
            ))}
            <Pending id="SECTORS" note="Ahmed to confirm which are real" />
          </div>
        </section>

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

        {/* ── DOM C ─────────────────────────────────────────────────────── */}
        <section className="act">
          <span className="kicker rv">
            <span className="ar-t">الشبكة اليوم</span>
            <span className="en-t">The network today</span>
          </span>

          <div className="stats rv">
            <div className={txMode === "publish" ? undefined : "unverified"}>
              {txMode === "omit" ? (
                /* content/claims.json: "Remove the figure." */
                <div className="fig">—</div>
              ) : (
                <div className="fig js-tx">
                  <span className="ar-t" ref={txAr}>
                    ٠
                  </span>
                  <span className="en-t" ref={txEn}>
                    0
                  </span>
                </div>
              )}
              <div className="cap">
                <span className="ar-t">عملية مكتملة</span>
                <span className="en-t">Transactions</span>
              </div>
              {txMode === "dev" && (
                <div className="provenance">
                  <span className="ar-t">غير موثّق — totals.transactions</span>
                  <span className="en-t">unverified — totals.transactions</span>
                </div>
              )}
            </div>

            <div className={machinesMode === "publish" ? undefined : "unverified"}>
              {/* claims.json: "Drop the exact count." */}
              <div className="fig">{machinesMode === "omit" ? "—" : MACHINES}</div>
              <div className="cap">
                <span className="ar-t">جهاز يعمل الآن</span>
                <span className="en-t">Machines live</span>
              </div>
              {machinesMode === "dev" && (
                <div className="provenance">
                  <span className="ar-t">غير موثّق — fleet.machines</span>
                  <span className="en-t">unverified — fleet.machines</span>
                </div>
              )}
            </div>

            <div>
              <div className="fig">
                <Pending id="LOCATIONS_COUNT" note="Ahmed to supply" />
              </div>
              <div className="cap">
                <span className="ar-t">موقع</span>
                <span className="en-t">Locations</span>
              </div>
            </div>
          </div>

          <div className="logos rv">
            {CLIENT_LOGOS.map((l) => (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                key={l.alt}
                src={l.uri}
                alt={en ? l.alt : (NAMED_AR[l.alt] ?? l.alt)}
                loading="lazy"
              />
            ))}
          </div>

          <div className="rv">
            <a className="cta-warm" href={WA}>
              <span className="ar-t">احجز مكالمة</span>
              <span className="en-t">Book a call</span>
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
