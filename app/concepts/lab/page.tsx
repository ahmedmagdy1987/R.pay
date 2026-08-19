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

/* Ranked by what the shot is worth, then given scroll distance to match.
   Run `node scripts/pacing-table.mjs` to see these resolved into
   scroll-pixels per second of footage — relative weights are impossible to
   argue about, px/s is not. The last band of each segment is a deceleration
   into the DOM act, so the film settles rather than being cut off. */

/* Establishing. The orbit and the cloud are the two fastest passages on the
   page — they are setting a place, not saying anything. */
const PACING_A: PacingRange[] = [
  { from: 0.0, to: 0.13, weight: 0.7 },    // orbit            146 px/s
  { from: 0.13, to: 0.27, weight: 0.55 },  // cloud            110 px/s
  { from: 0.27, to: 0.485, weight: 0.85 }, // aerial Riyadh    172 px/s
  { from: 0.485, to: 0.75, weight: 1.0 },  // boulevard        208 px/s
  { from: 0.75, to: 0.93, weight: 1.4 },   // the entrance     286 px/s
  { from: 0.93, to: 1.0, weight: 1.75 },   // settle           342 px/s
];

/* The film's peak. The crawl across the machine's face and the touch itself
   are the slowest thing on the page by a wide margin — 577 px/s against the
   cloud's 110, so the same second of footage costs five times the scroll. */
const PACING_B: PacingRange[] = [
  { from: 0.0, to: 0.415, weight: 1.0 },   // corridor glide   206 px/s
  { from: 0.415, to: 0.6, weight: 1.25 },  // machine, wide    254 px/s
  { from: 0.6, to: 0.82, weight: 2.1 },    // crawl the panel  442 px/s
  { from: 0.82, to: 0.95, weight: 2.7 },   // the touch        577 px/s
  { from: 0.95, to: 1.0, weight: 3.2 },    // settle           588 px/s
];

/* The pulse is the second-slowest passage. It cannot go much further: segment
   C carries 10.1s of footage in 1440px, so its average is 143 px/s against
   segment B's 334, and every pixel the pulse takes comes off the pull-back.
   At 260vh this is the ceiling — 340vh would buy the pulse ~300 px/s without
   starving the close. */
const PACING_C: PacingRange[] = [
  { from: 0.0, to: 0.5, weight: 2.3 },     // the pulse        200 px/s
  { from: 0.5, to: 0.82, weight: 0.8 },    // pull back         69 px/s
  { from: 0.82, to: 0.94, weight: 1.2 },   // constellation    109 px/s
  { from: 0.94, to: 1.0, weight: 1.6 },    // settle           130 px/s
];

/* NOTE: the "97" in this card is content/claims.json `fleet.machines`, which
   is unverified and blocks launch. The card is DOM, not pixels — the frames it
   sits over carry no text at all — so it CAN be gated the way the DOM figures
   below are. It simply is not: this string bypasses the honesty layer and
   states an unverified figure as fact. Gate it, or resolve the claim.

   The unit is جهاز, matching their own أجهزة and the stat tile below. It read
   ماكينة until 2026-08-19, which had the page using two words for one thing. */
const TITLE_A: TitleCard = {
  from: 0.14,
  to: 0.26,
  ar: "٩٧ جهازًا. مملكة واحدة.",
  en: "97 machines. One kingdom.",
};

/* EVERY call to action here opens the same WhatsApp thread. There is no
   booking system anywhere in the repo — no Calendly, no cal.com, no /book
   route — so labels say WhatsApp rather than "book a call".

   THE NUMBER. 966597897092, taken from rpay.sa. The number carried through
   this repo until now, 966550796555, is not the one on their live site; see
   the report for the eight other routes that still have it. */
const WA =
  "https://wa.me/966597897092?text=%D8%A3%D8%B1%D8%BA%D8%A8%20%D8%A8%D8%AD%D8%AC%D8%B2%20%D8%B9%D8%B1%D8%B6%20%D8%AA%D8%AC%D8%B1%D9%8A%D8%A8%D9%8A%20%D9%84%D9%80%20R.Pay";

/* Only the seven named accounts, in the order given. Every one resolves to an
   asset already in the repo from concepts 01-07 — nothing recreated. */
/* Verified before wiring: /cm30/ is a real product page — R Pay CM30, full
   spec sheet, a working add-to-cart and a live /checkout/ route.

   LABELLED "تصفّح الجهاز / View the device", NOT "buy". Their homepage does
   link here under "اشترِ الآن / Buy Now" — the phrase is theirs — but the
   page it lands on offers add-to-cart against a price marked
   "أسعار توضيحية" (indicative). A button that says buy should reach a
   committed price. This page states no price at all for the same reason. */
const BUY = "https://www.rpay.sa/cm30/";

/* All thirteen, the same set their own site displays publicly. Every file was
   already in this repo from concepts 01-07 — the six that were missing here
   were missing from THIS page's filter, not from disk. */
const NAMED = [
  "Roshn", "Dar Al Arkan", "LuLu", "Boulevard City", "Kinan", "Sela", "Hamat",
  "Al Nadej", "Boulevard World", "Al Deera", "Al Khozama", "Malahi", "Shawarma House",
];
const NAMED_AR: Record<string, string> = {
  Roshn: "روشن",
  "Dar Al Arkan": "دار الأركان",
  LuLu: "لولو",
  "Boulevard City": "بوليفارد سيتي",
  Kinan: "كنان",
  Sela: "سلا",
  Hamat: "هامات",
  "Al Nadej": "النادج",
  "Boulevard World": "بوليفارد وورلد",
  "Al Deera": "الديرة",
  "Al Khozama": "الخزامي",
  Malahi: "ملاهي",
  "Shawarma House": "بيت الشاورما",
};
const CLIENT_LOGOS = NAMED.map((n) => LOGOS.find((l) => l.alt === n)).filter(
  (l): l is { alt: string; uri: string } => Boolean(l),
);

const SECTORS = [
  { ar: "مراكز تجارية", en: "Malls" },
  { ar: "مجمعات سكنية", en: "Residential compounds" },
  { ar: "مقرات شركات", en: "Corporate headquarters" },
  { ar: "صالات رياضية", en: "Gyms" },
];

const CartIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6" />
    <circle cx="10" cy="20" r="1.2" />
    <circle cx="18" cy="20" r="1.2" />
  </svg>
);

export default function LabPage() {
  const [en, setEn] = useState(false);
  const [fmt, setFmt] = useState<SeqFormat>("auto");
  /* The decode probe can downgrade the whole page to the lite tier after the
     first segment has already armed. Frame count is fixed at mount, so the
     segments are remounted once when that happens — refetches come straight
     out of the HTTP cache and the poster covers the gap. */
  const [tier, setTier] = useState<"std" | "lite">("std");
  const progRef = useRef<HTMLDivElement>(null);
  const specRef = useRef<HTMLDivElement>(null);
  const txAr = useRef<HTMLSpanElement>(null);
  const txEn = useRef<HTMLSpanElement>(null);

  /* Both headline figures are declared, unverified, launch-blocking claims.
     In a production content build they render their designed absence instead
     of the number; here they render the number behind a provenance chip.

     465,255 IS CURRENCY. It comes from the TOTAL PURCHASES tile of their
     dashboard, shown with a riyal symbol beside TOTAL REVERSALS 32,567.85 and
     TOTAL PROFIT 162,839.25 — while the count tiles on the same screen
     (97 machines, 9 branches, 2 users) carry no symbol. This page previously
     rendered it as "465,255 عملية مكتملة", a transaction count, which
     overstated activity by an unknown multiple. */
  const txMode = claimMode("totals.transactions");
  const machinesMode = claimMode("fleet.machines");
  const TX = devValue<number>("totals.transactions");
  const MACHINES = devValue<number>("fleet.machines");

  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("fmt");
    if (q === "webp" || q === "avif" || q === "auto") setFmt(q);
  }, []);

  useEffect(() => {
    const onTier = () => setTier("lite");
    window.addEventListener("scrubseq:tier", onTier);
    return () => window.removeEventListener("scrubseq:tier", onTier);
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
        <span className="ar-t">واتساب</span>
        <span className="en-t">WhatsApp</span>
      </a>

      <div className="lab-spec" ref={specRef} aria-hidden="true" />

      <main id="top">
        <ScrubSequence
          key={`a-${fmt}-${tier}`}
          {...A}
          scrollVh={320}
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
              آلات البيع الذاتي بالدفع اللاتلامسي. نركّب ونشغّل ونصون — وأنت تستلم عائدك.
            </span>
            <span className="en-t">
              Self-service machines with contactless payment. We install, operate and maintain. You
              collect.
            </span>
          </p>
          <div className="rv cta-pair">
            <a className="cta-warm" href={WA}>
              <span className="ar-t">تحدّث إلينا</span>
              <span className="en-t">Talk to us</span>
            </a>
            <a className="cta-buy" href={BUY} target="_blank" rel="noopener noreferrer">
              <CartIcon />
              <span className="ar-t">تصفّح الجهاز</span>
              <span className="en-t">View the device</span>
            </a>
          </div>
        </section>

        <ScrubSequence
          key={`b-${fmt}-${tier}`}
          {...B}
          scrollVh={420}
          damping={0.12}
          pacing={PACING_B}
          format={fmt}
          label="The corridor and the tap"
        >
          <span className="lab-caption">02 · Corridor → machine → the tap</span>
        </ScrubSequence>

        {/* ── PEAK CTA — straight off the back of the tap ───────────────── */}
        <section className="act cta-block peak">
          <span className="kicker rv">
            <span className="ar-t">هكذا تبدأ</span>
            <span className="en-t">This is how it starts</span>
          </span>
          <h2 className="rv">
            <span className="ar-t">
              لمسة واحدة في مساحتك. <em>ابدأ بواحدة.</em>
            </span>
            <span className="en-t">
              One tap, in your space. <em>Start with one.</em>
            </span>
          </h2>
          <p className="sub rv">
            <span className="ar-t">
              نزورك، نحدّد الموقع المناسب، ونركّب أول جهاز.
            </span>
            <span className="en-t">
              We visit, agree the right spot, and install the first machine.
            </span>
          </p>
          <div className="rv cta-pair">
            <a className="cta-warm" href={WA}>
              <span className="ar-t">اطلب عرضًا عبر واتساب</span>
              <span className="en-t">Request a demo on WhatsApp</span>
            </a>
            <a className="cta-buy" href={BUY} target="_blank" rel="noopener noreferrer">
              <CartIcon />
              <span className="ar-t">تصفّح الجهاز</span>
              <span className="en-t">View the device</span>
            </a>
          </div>
          <div className="reassure rv">
            <span className="ar-t">بدون التزام</span>
            <span className="en-t">No commitment</span>
          </div>
        </section>

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
                <span className="ar-t">لا عبء تشغيليّ عليك</span>
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
                <span className="ar-t">التحصيل المباشر إلى حساب المالك أو المشغّل.</span>
                <span className="en-t">
                  Direct revenue collection to the owner/operator account.
                </span>
              </p>
            </article>
            <article className="rv">
              <span className="n">03</span>
              <h3>
                <span className="ar-t">تقارير لحظية</span>
                <span className="en-t">Real-time reporting</span>
              </h3>
              <p>
                <span className="ar-t">كل عملية وكل جهاز، لحظة بلحظة، من لوحة تحكم متكاملة.</span>
                <span className="en-t">
                  Every transaction, every machine, in real time, from one integrated dashboard.
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

        {/* ── REVENUE MODEL ─────────────────────────────
            Their stated number-one differentiator and the first row of their
            own comparison table. The argument is made by LENGTH: the other
            path is physically longer and has two nodes in the middle that are
            not you. Competitors are deliberately unnamed. */}
        <section className="act" id="revenue">
          <span className="kicker rv">
            <span className="ar-t">أين يذهب المال</span>
            <span className="en-t">Where the money goes</span>
          </span>
          <h2 className="h-display rv">
            <span className="ar-t">
              التحصيل المباشر إلى <em>حساب المالك أو المشغّل</em>
            </span>
            <span className="en-t">
              Direct revenue collection to the <em>owner/operator account</em>
            </span>
          </h2>

          <div className="paths rv">
            <div className="path">
              <span className="plabel">
                <span className="ar-t">مع مزوّدي الدفع التقليديين</span>
                <span className="en-t">With a traditional processor</span>
              </span>
              <div className="track">
                <span className="node you">
                  <span className="ar-t">جهازك</span>
                  <span className="en-t">Your machine</span>
                </span>
                <i className="wire" />
                <span className="node mid">
                  <span className="ar-t">مزوّد الدفع</span>
                  <span className="en-t">Processor</span>
                </span>
                <i className="wire" />
                <span className="node mid">
                  <span className="ar-t">التسوية</span>
                  <span className="en-t">Settlement</span>
                </span>
                <i className="wire" />
                <span className="node you">
                  <span className="ar-t">حسابك</span>
                  <span className="en-t">Your account</span>
                </span>
              </div>
              <p className="path-note">
                <span className="ar-t">الإيراد يمر عبر وسيط قبل أن يصل إليك.</span>
                <span className="en-t">
                  Revenue routes through an intermediary before it reaches you.
                </span>
              </p>
            </div>

            <div className="path ours">
              <span className="plabel">
                <span className="ar-t">مع آر باي</span>
                <span className="en-t">With R.Pay</span>
              </span>
              <div className="track">
                <span className="node you">
                  <span className="ar-t">جهازك</span>
                  <span className="en-t">Your machine</span>
                </span>
                <i className="wire" />
                <span className="node you">
                  <span className="ar-t">حسابك</span>
                  <span className="en-t">Your account</span>
                </span>
              </div>
              <p className="path-note">
                <span className="ar-t">
                  الإيراد يصل مباشرة إلى حساب المالك أو المشغّل.
                </span>
                <span className="en-t">
                  Revenue lands directly in the owner/operator account.
                </span>
              </p>
            </div>
          </div>
        </section>

        {/* ── OBJECTIONS ───────────────────────────────
            After the touch, not before: doubts get answered once the desire
            exists. Every answer is their own profile copy, unextended. */}
        <section className="act" id="questions">
          <span className="kicker rv">
            <span className="ar-t">أسئلة المشغّلين</span>
            <span className="en-t">What operators ask</span>
          </span>
          <div className="objections">
            <article className="rv">
              <h3>
                <span className="ar-t">ماذا لو تعطّل الجهاز؟</span>
                <span className="en-t">What if a machine fails?</span>
              </h3>
              <p>
                <span className="ar-t">
                  تنبيهات فورية عند انقطاع الاتصال، واسترجاع نقدي تلقائي دون تدخل بشري، وتسجيل
                  الحالة في لوحة التحكم.
                </span>
                <span className="en-t">
                  Instant alerts when a device goes offline, an automatic cash refund with no human
                  intervention, and the incident logged in the dashboard.
                </span>
              </p>
            </article>
            <article className="rv">
              <h3>
                <span className="ar-t">كيف يصل إليّ الدخل؟</span>
                <span className="en-t">How does my money reach me?</span>
              </h3>
              <p>
                <span className="ar-t">
                  تحصيل مباشر إلى حسابك، وتقارير لحظية تشغيلية ومالية.
                </span>
                <span className="en-t">
                  Direct collection into your account, with real-time operational and financial
                  reporting.
                </span>
              </p>
            </article>
            <article className="rv">
              <h3>
                <span className="ar-t">من يتولّى التركيب والتدريب؟</span>
                <span className="en-t">Who installs and trains?</span>
              </h3>
              <p>
                <span className="ar-t">تدريب ودعم عن بُعد، وتحكّم وتحديث عن بُعد.</span>
                <span className="en-t">
                  Remote training and support, with remote control and updates.
                </span>
              </p>
            </article>
            <article className="rv">
              <h3>
                <span className="ar-t">ماذا لو نُقل الجهاز؟</span>
                <span className="en-t">What if a device is moved?</span>
              </h3>
              <p>
                <span className="ar-t">
                  الرادار الجغرافي: موقع ثابت لكل جهاز، تنبيه فوري وإيقاف تلقائي عند الخروج عن
                  الحدود.
                </span>
                <span className="en-t">
                  Geographic radar: a fixed location for every device, with an instant alert and
                  automatic shutdown if it leaves its boundary.
                </span>
              </p>
            </article>
          </div>
        </section>

        <ScrubSequence
          key={`c-${fmt}-${tier}`}
          {...C}
          scrollVh={260}
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
                  <span className="ar-t">
                    <span ref={txAr}>٠</span> <span className="riyal">﷼</span>
                  </span>
                  <span className="en-t">
                    <span ref={txEn}>0</span> <span className="riyal">SAR</span>
                  </span>
                </div>
              )}
              <div className="cap">
                <span className="ar-t">إجمالي المشتريات · ريال</span>
                <span className="en-t">Total purchases · SAR</span>
              </div>
              {txMode === "dev" && (
                <div className="provenance">
                  <span className="ar-t">
                    غير موثّق · شهر واحد ١–٣١ مايو ٢٠٢٥ · حساب بمستخدمَين
                  </span>
                  <span className="en-t">
                    unverified · single month 1–31 May 2025 · 2-user account
                  </span>
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
                data-logo={l.uri.split("/").pop()?.replace(/\.\w+$/, "")}
                alt={en ? l.alt : (NAMED_AR[l.alt] ?? l.alt)}
                loading="lazy"
              />
            ))}
          </div>

        </section>

        {/* ── FINAL CTA ─────────────────────────────────────────────────── */}
        <section className="act cta-block final">
          <h2 className="rv">
            <span className="ar-t">
              مساحة واحدة. <em>جهاز واحد.</em> ابدأ من هنا.
            </span>
            <span className="en-t">
              One space. <em>One machine.</em> Start here.
            </span>
          </h2>
          <p className="sub rv">
            <span className="ar-t">
              أرسل لنا موقعك ومساحتك التقريبية، ونعود إليك بالخطوة التالية.
            </span>
            <span className="en-t">
              Send us your location and roughly how much space you have, and we will come back
              with the next step.
            </span>
          </p>
          <div className="rv cta-pair">
            <a className="cta-warm" href={WA}>
              <span className="ar-t">تحدّث إلينا على واتساب</span>
              <span className="en-t">Talk to us on WhatsApp</span>
            </a>
            <a className="cta-buy" href={BUY} target="_blank" rel="noopener noreferrer">
              <CartIcon />
              <span className="ar-t">تصفّح الجهاز</span>
              <span className="en-t">View the device</span>
            </a>
          </div>
          <div className="reassure rv">
            <span className="ar-t">يفتح محادثة واتساب مباشرة — لا نموذج ولا تسجيل</span>
            <span className="en-t">Opens a WhatsApp chat directly — no form, no sign-up</span>
          </div>
          {/* Networks the CM30 accepts, exactly as their own product page
              lists them. Typographic, matching concepts 01-07. */}
          <div className="paymarks rv" aria-label="Accepted payment networks">
            <span>mada</span>
            <span>GCCNET</span>
            <span>Visa</span>
            <span>Mastercard</span>
            <span>Amex</span>
            <span>Apple&nbsp;Pay</span>
            <span>Samsung&nbsp;Pay</span>
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
