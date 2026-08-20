"use client";

import { useEffect, useRef, useState } from "react";
import ScrubSequence, {
  warmSegments,
  type PacingRange,
  type SeqFormat,
  type SeqSet,
  type TitleCard,
} from "@/components/ScrubSequence";
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
   Run `node scripts/pacing-table.mjs` to see these resolved. It reads the
   arrays below straight out of this file, so it cannot drift from them.

   TWO NUMBERS, AND THEY ARE DIFFERENT QUESTIONS. px/s says how much scroll a
   second of footage costs. FRAMES PER NOTCH says how much film one flick of
   the wheel spends — roughly 100px — and that is the one the hand feels. A
   passage can have a long page and still escape the reader if a single notch
   jumps five frames. At the touch the target is ~1.0: one notch, one frame.

   The last band of each segment is a deceleration into the DOM act, so the
   film settles rather than being cut off. */

/* Establishing. The orbit and the cloud are the fastest passages in this
   segment — they set a place rather than say anything. They are NOT the
   fastest on the page: segment C's scripted pull-back is, and always was. */
const PACING_A: PacingRange[] = [
  { from: 0.0, to: 0.13, weight: 0.7 },    // orbit         213 px/s · 4.39 f/notch
  { from: 0.13, to: 0.27, weight: 0.55 },  // cloud         160 px/s · 5.59 f/notch
  { from: 0.27, to: 0.485, weight: 0.85 }, // aerial Riyadh 251 px/s · 3.62 f/notch
  { from: 0.485, to: 0.75, weight: 1.0 },  // boulevard     303 px/s · 3.08 f/notch
  { from: 0.75, to: 0.93, weight: 1.4 },   // the entrance  416 px/s · 2.20 f/notch
  { from: 0.93, to: 1.0, weight: 1.75 },   // settle        498 px/s · 1.76 f/notch
];

/* The film's peak, and the only passage tuned to a target rather than to a
   ranking. THE TOUCH IS SET TO ~1.0 FRAMES PER NOTCH: one flick of the wheel
   advances one frame, so the passage resists the hand instead of escaping it.

   Distance alone did not get there. At 640vh with the old weights the touch
   sat at 1.10 f/notch; the approach and the touch were given a larger share
   of the segment to close the last of it. 1061 px/s against the cloud's 160 —
   the same second of footage costs six and a half times the scroll. */
const PACING_B: PacingRange[] = [
  { from: 0.0, to: 0.415, weight: 1.0 },   // corridor       302 px/s · 3.44 f/notch
  { from: 0.415, to: 0.6, weight: 1.35 },  // machine, wide  405 px/s · 2.55 f/notch
  { from: 0.6, to: 0.82, weight: 2.6 },    // crawl the panel 803 px/s · 1.32 f/notch
  { from: 0.82, to: 0.95, weight: 3.4 },   // THE TOUCH     1061 px/s · 1.01 f/notch
  { from: 0.95, to: 1.0, weight: 3.6 },    // settle         971 px/s · 0.96 f/notch
];

/* At 260vh this file predicted that 340vh would buy the pulse ~300 px/s.
   At 330vh it buys 287, so the prediction held.

   THE PULL-BACK IS STILL THE FASTEST PASSAGE ON THE PAGE, at 8.86 frames per
   notch — one notch spends nearly a tenth of the segment. That is intended in
   kind: it is the scripted pull-back to orbit, and it should move. It is not
   necessarily intended in degree, and nothing here has tested that. Closing it
   means taking scroll from the pulse or lengthening C again; it is left alone
   because it was not asked for, not because it was measured and cleared. */
const PACING_C: PacingRange[] = [
  { from: 0.0, to: 0.5, weight: 2.3 },     // the pulse      287 px/s · 3.08 f/notch
  { from: 0.5, to: 0.82, weight: 0.8 },    // pull back       99 px/s · 8.86 f/notch
  { from: 0.82, to: 0.94, weight: 1.2 },   // constellation  156 px/s · 5.91 f/notch
  { from: 0.94, to: 1.0, weight: 1.6 },    // settle         187 px/s · 4.43 f/notch
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
  Sela: "صلة",
  Hamat: "هامات",
  "Al Nadej": "النادج",
  "Boulevard World": "بوليفارد وورلد",
  "Al Deera": "الديرة",
  "Al Khozama": "الخزامى",
  Malahi: "ملاهي",
  "Shawarma House": "بيت الشاورما",
};
const CLIENT_LOGOS = NAMED.map((n) => LOGOS.find((l) => l.alt === n)).filter(
  (l): l is { alt: string; uri: string } => Boolean(l),
);

/* The old list — malls, compounds, corporate HQs, gyms — was a list of places
   a LANDLORD has floor space in. These are the sectors R.Pay's system runs in,
   ordered by their own evidence: the entertainment names in the company
   profile and the thirteen client marks on rpay.sa. Lives in the registry
   now, so it carries its source. */

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
  /* The payment row used to be seven hardcoded spans. It stated
     rails.accepted — unverified and launch-blocking — as fact, outside the
     honesty layer entirely. */
  const railsMode = claimMode("rails.accepted");
  const RAILS = devValue<string[]>("rails.accepted") ?? [];
  const arcadeMode = claimMode("sectors.arcadeDepth");
  const sectorsMode = claimMode("sectors.served");
  const SECTORS = devValue<{ ar: string; en: string }[]>("sectors.served") ?? [];
  /* "No operational load on you" allocates COST, which is the substance of
     commercial.venueProposition. The card's heading and body describe the
     work instead, and stand on their own; this line is additive and appears
     only once the claim clears. */
  const venueMode = claimMode("commercial.venueProposition");
  /* Below 820px the objection cards become a snapping row. The dots report
     which card is in frame — five cards behind a clipped edge with no marker
     reads as a layout that failed to finish. The COUNT is read off the DOM
     rather than hardcoded, so adding or removing a card cannot leave the
     indicator lying about how many there are. */
  /* INTRO OVERLAY. The film used to open on an empty canvas and fetch while
     the reader was already scrolling, so the first seconds stuttered. The
     overlay holds the door shut until segment A can play through, and its bar
     is driven by real fetched-frame counts, never a timer. */
  const [intro, setIntro] = useState(true);
  const [introP, setIntroP] = useState(0);
  const objRef = useRef<HTMLDivElement>(null);
  const [objCount, setObjCount] = useState(0);
  const [objIdx, setObjIdx] = useState(0);

  const machinesMode = claimMode("fleet.machines");
  /* NOT a locations count. See customers.brandCount: 13 counts the brand MARKS
     on rpay.sa's logo wall — the same thirteen rendered directly beneath this
     tile — and several of them are developers and chains holding many
     properties, so the number of SITES is larger than 13, not equal to it. */
  const brandsMode = claimMode("customers.brandCount");
  const TX = devValue<number>("totals.transactions");
  const MACHINES = devValue<number>("fleet.machines");
  const BRANDS = devValue<number>("customers.brandCount");

  useEffect(() => {
    if (objRef.current) setObjCount(objRef.current.children.length);
  }, []);

  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    /* Warm A fully and pull B in behind it, rather than waiting for the
       reader to scroll into range. */
    warmSegments(2);

    const first = document.querySelector(".scrubseq");
    const done = () => setIntro(false);

    const onProgress = (ev: Event) => {
      const e = ev as CustomEvent<{ fetched: number; total: number }>;
      if (!first || ev.target !== first) return;
      const { fetched, total } = e.detail;
      if (!total) return;
      setIntroP(Math.min(100, Math.round((fetched / total) * 100)));
      /* CAN PLAY THROUGH, not merely started: every frame of A is in hand. */
      if (fetched >= total) done();
    };
    /* Reduced motion: no bar to watch, leave on the first painted frame. */
    const onFirst = () => { if (reduce) done(); };

    window.addEventListener("scrubseq:progress", onProgress, true);
    window.addEventListener("scrubseq:firstframe", onFirst, true);
    /* Nobody gets trapped behind a stalled network. */
    const bail = setTimeout(done, 8000);
    return () => {
      window.removeEventListener("scrubseq:progress", onProgress, true);
      window.removeEventListener("scrubseq:firstframe", onFirst, true);
      clearTimeout(bail);
    };
  }, []);

  const onObjScroll = () => {
    const el = objRef.current;
    if (!el || !el.children.length) return;
    /* scroll-snap-align is 'start', and in RTL 'start' is the RIGHT edge.
       Measure against whichever edge that is rather than assuming left, so
       this keeps working when the reader flips the page to English. */
    const rtl = getComputedStyle(el).direction === "rtl";
    const box = el.getBoundingClientRect();
    let best = 0;
    let bestD = Infinity;
    for (let i = 0; i < el.children.length; i += 1) {
      const r = el.children[i].getBoundingClientRect();
      const d = Math.abs(rtl ? r.right - box.right : r.left - box.left);
      if (d < bestD) { bestD = d; best = i; }
    }
    setObjIdx(best);
  };

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


    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
      cIo.disconnect();
    };
  }, [TX]);

  return (
    <>
      {intro && (
        <div className="lab-intro" role="status" aria-live="polite">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={R_MARK} alt="R.Pay" />
          <span className="lab-intro-bar"><i style={{ width: introP + "%" }} /></span>
        </div>
      )}

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


      <main id="top">
        <ScrubSequence
          key={`a-${fmt}-${tier}`}
          {...A}
          scrollVh={420}
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
              مساحتك الفارغة… <em>تدرّ دخلاً الآن.</em>
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
          scrollVh={640}
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
              لمسة واحدة في مساحتك. <em>ابدأ بجهاز واحد.</em>
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
                <span className="ar-t">التركيب والتشغيل والصيانة</span>
                <span className="en-t">Installation, operation, maintenance</span>
              </h3>
              <p>
                <span className="ar-t">خطوة واحدة، ونتولّى الباقي معك.</span>
                <span className="en-t">One step, and we take it from there.</span>
              </p>
              {venueMode !== "omit" && (
                <p className={`allocation${venueMode === "publish" ? "" : " unverified"}`}>
                  <span className="ar-t">لا عبء تشغيليّ عليك</span>
                  <span className="en-t">Zero operational load</span>
                  {venueMode === "dev" && (
                    <em className="provenance">
                      <span className="ar-t">غير مُتحقَّق منه — commercial.venueProposition</span>
                      <span className="en-t">unverified — commercial.venueProposition</span>
                    </em>
                  )}
                </p>
              )}
            </article>
            <article className="rv">
              <span className="n">02</span>
              <h3>
                <span className="ar-t">دخل من مساحة غير مستغلّة</span>
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

          {/* ── ARCADE LEADS, AS PROOF ─────────────────────
              The row under this used to carry arcade as one of five equals,
              which buried the strongest thing R.Pay has. Arcade is the hardest
              case the system meets, so vending follows FROM it.

              The plate is card-arcade.webp, already committed and until now
              unused on this route. It earns its place because the film's only
              machine is a VENDING machine, at the peak moment — without this,
              the deepest vertical is asserted in copy and never once shown.

              Three capabilities, all R.Pay's own words. "Game activation" is
              not among them because it appears nowhere in their material, and
              the refund is stated WITHOUT a cause because they publish
              «استرداد تلقائي» with no trigger. See sectors.arcadeDepth. */}
          {arcadeMode !== "omit" && (
            <div className={`deepest rv${arcadeMode === "publish" ? "" : " unverified"}`}>
              <figure className="deepest-plate">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/concept-08/card-arcade.webp"
                  alt={
                    en
                      ? "An arcade games machine with a contactless payment reader on its front panel."
                      : "ماكينة ألعاب أركيد وعلى واجهتها قارئ دفع لاتلامسي."
                  }
                  width={1200}
                  height={1607}
                  loading="lazy"
                  decoding="async"
                />
              </figure>
              <div className="deepest-body">
                <h3>
                  <span className="ar-t">أعمق ما يعمل فيه النظام: ألعاب الأركيد</span>
                  <span className="en-t">Where the system goes deepest: arcade games</span>
                </h3>
                <p>
                  <span className="ar-t">
                    الأركيد أصعب حالة تواجه نظام دفع وتشغيل. جهازٌ يصرف جوائز، فيحتاج مخزونًا يربط
                    كل جائزة بجهازها. وجهازٌ يُنقل، فيحتاج رادارًا جغرافيًا يرصد خروجه عن نطاقه
                    ويغلقه في حينه. واستردادٌ تلقائي دون تدخّل بشري. والنظام الذي يحمل هذا كله،
                    تصبح آلة البيع الذاتي عنده حالة أهون.
                  </span>
                  <span className="en-t">
                    Arcade is the hardest case a payment and operations system meets. A machine that
                    dispenses prizes, so its inventory has to tie every prize to its device. A machine
                    that gets moved, so a geographic radar has to catch it leaving its zone and shut it
                    down there and then. And automatic refunds, with no human intervention. For a
                    system carrying all of that, a vending machine is the easier case.
                  </span>
                </p>
              </div>
            </div>
          )}
          {/* ONE SENTENCE, ONE FLOW. The label used to be a block <p> and the
              items a flex row beneath it, so in RTL the opener sat at one edge
              and the words that complete it at the other — a sentence severed
              from its object. This is now plain inline text: label, colon,
              items, wrapping as a unit the way a line of prose does.

              The items are NOT pills any more either. A pill is a control, and
              these are categories with nothing behind them; styling that
              promises a click that does not exist is a small lie. Text with a
              separator, no border, no hit area. */}
          {sectorsMode !== "omit" && (
            <p className={`sectors rv${sectorsMode === "publish" ? "" : " unverified"}`}>
              <span className="sectors-lead">
                <span className="ar-t">ويعمل النظام نفسه في:</span>
                <span className="en-t">The same system also runs:</span>
              </span>
              {SECTORS.map((sec) => (
                <span className="sector" key={sec.en}>
                  <span className="ar-t">{sec.ar}</span>
                  <span className="en-t">{sec.en}</span>
                </span>
              ))}
            </p>
          )}
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
          <div className="objections rv" ref={objRef} onScroll={onObjScroll}>
            <article className="rv">
              <h3>
                <span className="ar-t">ماذا لو تعطّل الجهاز؟</span>
                <span className="en-t">What if a machine fails?</span>
              </h3>
              <p>
                <span className="ar-t">
                  الأركيد أوضح مثال: آلة تصرف جوائز يتعطّل عملها. تنبيه فوري للعطل، وتنبيه عند
                  انقطاع الاتصال، وتسجيل الحالة في لوحة التحكم.
                </span>
                <span className="en-t">
                  Arcade is the clearest case: a machine that dispenses prizes stops working. An
                  instant fault alert, an alert when it goes offline, and the incident logged in the
                  dashboard.
                </span>
              </p>
            </article>
            {/* SEPARATE CARD ON PURPOSE. This used to be a clause inside the
                fault answer, which made the refund read as the consequence of a
                fault. R.Pay publishes «استرداد تلقائي» with NO trigger stated
                anywhere, so pairing the two asserted by adjacency what the lead
                copy refuses to assert in words. Stated here as its own
                capability, without a cause, until they answer question 18 in
                blockers.md — at which point this and the lead take the trigger
                together. */}
            <article className="rv">
              <h3>
                <span className="ar-t">وإن لزم ردّ المبلغ؟</span>
                <span className="en-t">And if an amount has to be returned?</span>
              </h3>
              <p>
                <span className="ar-t">استرداد تلقائي دون تدخّل بشري.</span>
                <span className="en-t">An automatic refund, with no human intervention.</span>
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
                  الأركيد أوضح مثال: آلة في صالة ألعاب تُنقل من مكانها. الرادار الجغرافي يثبّت
                  موقعًا لكل جهاز، وأي حركة خارج النطاق تُغلق الجهاز فورًا مع تنبيه في حينه — حماية
                  من العبث أو النقل.
                </span>
                <span className="en-t">
                  Arcade is the clearest case: a machine in a games hall moved out of position. The
                  geographic radar fixes a location for every device, and any movement outside its
                  zone shuts it down immediately, with an alert at the same moment — protection
                  against tampering and relocation.
                </span>
              </p>
            </article>
          </div>
          {objCount > 1 && (
            <div className="objections-dots" aria-hidden="true">
              {Array.from({ length: objCount }, (_, i) => (
                <i key={i} className={i === objIdx ? "on" : undefined} />
              ))}
            </div>
          )}
        </section>

        <ScrubSequence
          key={`c-${fmt}-${tier}`}
          {...C}
          scrollVh={330}
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
                    غير مُتحقَّق منه · شهر واحد ١–٣١ مايو ٢٠٢٥ · حساب بمستخدمَين
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
                  <span className="ar-t">غير مُتحقَّق منه — fleet.machines</span>
                  <span className="en-t">unverified — fleet.machines</span>
                </div>
              )}
            </div>

            <div className={brandsMode === "publish" ? undefined : "unverified"}>
              {/* The caption is «علامة تجارية / Brands», not «موقع / Locations»,
                  because 13 is what it counts: the marks in the wall below. */}
              <div className="fig">{brandsMode === "omit" ? "—" : BRANDS}</div>
              <div className="cap">
                <span className="ar-t">علامة تجارية</span>
                <span className="en-t">Brands</span>
              </div>
              {brandsMode === "dev" && (
                <div className="provenance">
                  <span className="ar-t">غير مُتحقَّق منه — customers.brandCount</span>
                  <span className="en-t">unverified — customers.brandCount</span>
                </div>
              )}
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
          {/* The list their own CM30 spec sheet publishes under
              "شبكات الدفع المدعومة". That is what the HARDWARE supports, which
              is not the same thing as what any given deployment is enabled to
              take — Amex in particular normally needs its own acquirer
              agreement. Sourced, therefore, but still unverified.

              claims.json: "Show only the methods that can be evidenced. The
              row degrades cleanly to any subset." With none evidenced the
              subset is empty and the row is omitted. It is additive trust,
              never structure — the block reads without it. */}
          {railsMode !== "omit" && (
            <div
              className={`paymarks rv${railsMode === "publish" ? "" : " unverified"}`}
              aria-label={en ? "Accepted payment networks" : "شبكات الدفع المدعومة"}
            >
              {RAILS.map((r) => (
                <span key={r}>{r.replace(/ /g, " ")}</span>
              ))}
              {railsMode === "dev" && (
                <em className="provenance">
                  <span className="ar-t">غير مُتحقَّق منه — rails.accepted</span>
                  <span className="en-t">unverified — rails.accepted</span>
                </em>
              )}
            </div>
          )}
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
