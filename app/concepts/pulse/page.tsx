"use client";
import { useCallback, useEffect, useRef, useState, CSSProperties } from "react";
import BrandsMarquee from "@/components/BrandsMarquee";
import { R_MARK } from "@/lib/assets/brand";
import { ARCADE, VENDING, COFFEE } from "@/lib/assets/machines";
import { DEVICE } from "@/lib/assets/device";

/* ─────────────────────────────────────────────────────────────
   Concept 04 · PULSE — «النبض»
   A visual-first, interaction-led landing. Same brand palette
   and the same real R.Pay data, told through motion instead of
   paragraphs. Signature: the tap-to-pay simulator in the hero.
   ───────────────────────────────────────────────────────────── */

const VERBS = [
  { ar: "ادفع.", en: "Pay." },
  { ar: "راقب.", en: "Monitor." },
  { ar: "تحكّم.", en: "Control." },
];

/* Demo feed for the live-network scene (illustrative simulation). */
const FEED = [
  { cityAr: "الرياض", cityEn: "Riyadh", amt: "15.00", m: "mada" },
  { cityAr: "جدة", cityEn: "Jeddah", amt: "8.00", m: "Apple Pay" },
  { cityAr: "الدمام", cityEn: "Dammam", amt: "22.00", m: "VISA" },
  { cityAr: "الرياض", cityEn: "Riyadh", amt: "12.00", m: "stc pay" },
  { cityAr: "الخبر", cityEn: "Khobar", amt: "6.00", m: "mada" },
  { cityAr: "جدة", cityEn: "Jeddah", amt: "18.00", m: "Mastercard" },
];

const OS = [
  {
    ar: "تحصيل مباشر لحسابك", en: "Direct settlement",
    arP: "المبالغ تصل حساب المالك مباشرة، دون وسيط.",
    enP: "Revenue lands straight in the owner's account.",
    ic: <><path d="M3 10h18M5 6h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z" /><path d="M7 15h4" /></>,
  },
  {
    ar: "استرجاع تلقائي", en: "Auto refunds",
    arP: "عند فشل الدفع يُعاد المبلغ تلقائيًا دون تدخل بشري.",
    enP: "Failed payments are refunded automatically.",
    ic: <><path d="M3 12a9 9 0 1 0 3-6.7" /><path d="M3 4v5h5" /></>,
  },
  {
    ar: "تقارير لحظية", en: "Real-time reports",
    arP: "تقارير تشغيلية ومالية في الوقت الفعلي.",
    enP: "Operational and financial reports as they happen.",
    ic: <><rect x="3" y="4" width="18" height="14" rx="2" /><path d="M7 14l3-3 2 2 4-4" /></>,
  },
  {
    ar: "لوحة تحكم موحّدة", en: "Unified dashboard",
    arP: "المبيعات والأرباح والأجهزة والهدايا في مكان واحد.",
    enP: "Sales, profit, devices and rewards in one place.",
    ic: <><rect x="2" y="5" width="20" height="12" rx="2" /><path d="M8 21h8M12 17v4" /></>,
  },
  {
    ar: "إدارة الأجهزة عن بُعد", en: "Remote device control",
    arP: "تشغيل وإيقاف وتتبّع كل جهاز عن بُعد.",
    enP: "Start, stop and track every device remotely.",
    ic: <><path d="M12 2v4M12 18v4M2 12h4M18 12h4" /><circle cx="12" cy="12" r="4" /></>,
  },
  {
    ar: "الرادار الجغرافي", en: "Geofence radar",
    arP: "تنبيه فوري وإغلاق تلقائي عند الخروج عن النطاق.",
    enP: "Instant alert and auto-shutdown outside the zone.",
    ic: <><path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11Z" /><circle cx="12" cy="10" r="2.5" /></>,
  },
  {
    ar: "إدارة المخزون والهدايا", en: "Inventory and rewards",
    arP: "تصنيف الهدايا وتتبّع الكميات وربطها بالأجهزة.",
    enP: "Classify prizes, track quantities, link them to devices.",
    ic: <><path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6M12 20V9M2 7l10-4 10 4-10 4L2 7Z" /></>,
  },
  {
    ar: "الفروع والمستخدمون والصلاحيات", en: "Branches, users and access",
    arP: "إدارة مرنة مع تنبيهات فورية للأعطال والمخزون.",
    enP: "Flexible management with instant fault and stock alerts.",
    ic: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
  },
];

const FLOW = [
  {
    ar: "الدفع الذكي المدمج", en: "Integrated Smart Payment",
    arP: "وحدة دفع إلكترونية داخل كل جهاز تقبل البطاقات والمحافظ الرقمية، وتعرض العمليات مباشرة في لوحة التحكم.",
    enP: "An embedded payment unit in every machine accepts cards and digital wallets, with transactions shown live in the dashboard.",
    ic: <><rect x="4" y="3" width="16" height="18" rx="3" /><path d="M8 8h8M8 12h5" /><circle cx="12" cy="17" r="1.4" /></>,
  },
  {
    ar: "الرادار الجغرافي", en: "Geofence Radar",
    arP: "يحدَّد موقع جغرافي لكل جهاز، وعند تغييره يُرسل تنبيه فوري ويُغلق الجهاز تلقائيًا إذا خرج عن الحدود.",
    enP: "Each device gets a fixed location; any movement triggers an instant alert and automatic shutdown outside the zone.",
    ic: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="4.5" /><path d="M12 3v3M12 18v3M3 12h3M18 12h3" /></>,
  },
  {
    ar: "الاسترجاع النقدي التلقائي", en: "Automatic Refunds",
    arP: "عند فشل الدفع أو حدوث خلل يُعاد المبلغ تلقائيًا دون تدخل بشري، وتُسجَّل الحالة في لوحة التحكم.",
    enP: "On a failed payment the amount is refunded automatically with no human intervention, and the incident is logged.",
    ic: <><path d="M3 12a9 9 0 1 0 3-6.7" /><path d="M3 4v5h5" /><path d="M12 8v4l2.5 2.5" /></>,
  },
  {
    ar: "لوحة التحكم الموحّدة", en: "Unified Dashboard",
    arP: "مبيعات وأرباح وأجهزة وهدايا مع تقارير لحظية تشغيلية ومالية، كل شيء في مكان واحد.",
    enP: "Sales, profit, devices and rewards with real-time operational and financial reports, all in one place.",
    ic: <><rect x="2" y="4" width="20" height="13" rx="2.5" /><path d="M6 13l3-3 2 2 4-4 3 3" /><path d="M8 21h8" /></>,
  },
];

const WHY = [
  { ar: "تحصيل مباشر لحساب المالك", en: "Direct revenue collection", them: false },
  { ar: "استرداد تلقائي", en: "Automatic refunds", them: false },
  { ar: "الرادار الجغرافي GPS", en: "GPS geofencing", them: false },
  { ar: "إدارة المخزون والهدايا", en: "Inventory management", them: false },
  { ar: "إضافة وإزالة الأجهزة عن بُعد", en: "Remote add/remove devices", them: false },
  { ar: "تدريب ودعم عن بُعد", en: "Remote training and support", them: false },
  { ar: "العلامة البيضاء", en: "White-label option", them: false },
  { ar: "لوحة مبيعات وتحكم لحظية", en: "Real-time dashboard", them: true },
];

const SECTORS = [
  {
    img: ARCADE, ar: "ألعاب الأركيد", en: "Arcade Games", sub: "ARCADE GAMES",
    arP: "خبرة تشغيلية عميقة لأكبر مشغّل لمكائن ألعاب الأركيد في المنطقة.",
    enP: "Deep operational expertise from the region's largest arcade operator.",
  },
  {
    img: VENDING, ar: "آلات البيع الذاتي", en: "Vending Machines", sub: "VENDING MACHINES",
    arP: "حلول تقنية ذكية لقطاع الخدمة الذاتية مع دفع إلكتروني متكامل.",
    enP: "Smart self-service solutions with fully integrated e-payment.",
  },
  {
    img: COFFEE, ar: "آلات القهوة", en: "Coffee Machines", sub: "COFFEE MACHINES",
    arP: "تحكّم كامل ومتابعة تشغيلية فورية من خلال نظام موحّد.",
    enP: "Full control and instant operational monitoring in one system.",
  },
];

type Phase = "idle" | "tap" | "ok" | "fly" | "land";

export default function Pulse() {
  const [en, setEn] = useState(false);
  const [verb, setVerb] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");
  const [tx, setTx] = useState(465255);
  const [feedIx, setFeedIx] = useState(0);

  const busy = useRef(false);
  const heroSeen = useRef(true);
  const reduced = useRef(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  /* language */
  useEffect(() => {
    const h = document.documentElement;
    if (en) {
      h.classList.add("en");
      h.setAttribute("dir", "ltr");
      h.setAttribute("lang", "en");
    } else {
      h.classList.remove("en");
      h.setAttribute("dir", "rtl");
      h.setAttribute("lang", "ar");
    }
  }, [en]);

  /* ── the tap-to-pay simulator ── */
  const runTap = useCallback(() => {
    if (busy.current) return;
    busy.current = true;
    if (reduced.current) {
      setTx((t) => t + 1);
      setPhase("land");
      timers.current.push(setTimeout(() => { setPhase("idle"); busy.current = false; }, 900));
      return;
    }
    setPhase("tap");
    timers.current.push(setTimeout(() => setPhase("ok"), 950));
    timers.current.push(setTimeout(() => setPhase("fly"), 1750));
    timers.current.push(setTimeout(() => { setPhase("land"); setTx((t) => t + 1); }, 2600));
    timers.current.push(setTimeout(() => { setPhase("idle"); busy.current = false; }, 3250));
  }, []);

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* auto-play the tap while the hero is on screen */
    const hero = document.getElementById("top");
    let heroIO: IntersectionObserver | null = null;
    if (hero) {
      heroIO = new IntersectionObserver((es) => { heroSeen.current = es[0].isIntersecting; }, { threshold: 0.3 });
      heroIO.observe(hero);
    }
    const auto = setInterval(() => {
      if (heroSeen.current && !document.hidden && !reduced.current) runTap();
    }, 5200);
    const first = setTimeout(() => { if (!reduced.current) runTap(); }, 1200);

    /* monument verb rotation */
    const verbInt = setInterval(() => {
      if (!document.hidden && !reduced.current) setVerb((v) => (v + 1) % VERBS.length);
    }, 2800);

    /* live feed rotation */
    const feedInt = setInterval(() => {
      if (!document.hidden) setFeedIx((i) => (i + 1) % FEED.length);
    }, 3400);

    /* reveal + counters */
    const runNum = (el: HTMLElement) => {
      if (el.dataset.done) return;
      el.dataset.done = "1";
      const t = +(el.dataset.t || "0");
      const dur = reduced.current ? 0 : 1400;
      const s = performance.now();
      const step = (now: number) => {
        const k = Math.min((now - s) / Math.max(dur, 1), 1);
        const e = 1 - Math.pow(1 - k, 4);
        el.textContent = Math.round(t * e).toLocaleString("en-US");
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    const io = new IntersectionObserver(
      (es) => {
        es.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            entry.target.querySelectorAll<HTMLElement>(".num").forEach(runNum);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -6% 0px" }
    );
    document.querySelectorAll<HTMLElement>(".rv").forEach((el) => io.observe(el));

    /* nav shadow + top progress */
    const nav = document.getElementById("pnav");
    const prog = document.getElementById("pprog");
    const onScroll = () => {
      if (nav) nav.classList.toggle("sc", window.scrollY > 30);
      if (prog) {
        const hgt = document.documentElement.scrollHeight - window.innerHeight;
        prog.style.width = (hgt > 0 ? (window.scrollY / hgt) * 100 : 0) + "%";
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    /* platform rail progress */
    const rail = document.getElementById("prail");
    const bar = document.getElementById("prailbar");
    const onRail = () => {
      if (!rail || !bar) return;
      const max = rail.scrollWidth - rail.clientWidth;
      bar.style.width = (max > 0 ? (Math.abs(rail.scrollLeft) / max) * 100 : 100) + "%";
    };
    rail?.addEventListener("scroll", onRail, { passive: true });
    onRail();

    /* footer clocks */
    const clkR = document.getElementById("pclkR");
    const clkL = document.getElementById("pclkL");
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const fmt = (z: string) => {
      try {
        return new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: z }).format(new Date());
      } catch { return "--:--"; }
    };
    const tick = () => {
      if (clkR) clkR.textContent = fmt("Asia/Riyadh");
      if (clkL) clkL.textContent = fmt(tz);
    };
    tick();
    const clockInt = setInterval(tick, 30000);

    const t = timers.current;
    return () => {
      clearInterval(auto); clearInterval(verbInt); clearInterval(feedInt); clearInterval(clockInt);
      clearTimeout(first);
      t.forEach(clearTimeout);
      heroIO?.disconnect(); io.disconnect();
      window.removeEventListener("scroll", onScroll);
      rail?.removeEventListener("scroll", onRail);
    };
  }, [runTap]);

  const feed = FEED[feedIx];

  return (
    <main className="pl" id="top">
      {/* fixed deep-space backdrop (concept is intentionally dark-only) */}
      <div className="pl-bg" aria-hidden="true" />
      <div className="pl-stars" aria-hidden="true" />

      <a className="p-back" href="/" aria-label="All concepts">
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.6" /><rect x="14" y="3" width="7" height="7" rx="1.6" /><rect x="3" y="14" width="7" height="7" rx="1.6" /><rect x="14" y="14" width="7" height="7" rx="1.6" /></svg>
        <span className="ar-t">كل المفاهيم</span><span className="en-t">All concepts</span>
      </a>

      {/* NAV */}
      <header className="pnav" id="pnav">
        <a className="pbrand" href="#top">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={R_MARK} alt="R.Pay" />
          <span>Pay</span>
        </a>
        <nav className="plinks" aria-label="sections">
          <a href="#sectors"><span className="ar-t">القطاعات</span><span className="en-t">Sectors</span></a>
          <a href="#platform"><span className="ar-t">المنصة</span><span className="en-t">Platform</span></a>
          <a href="#network"><span className="ar-t">الشبكة</span><span className="en-t">Network</span></a>
          <a href="#why"><span className="ar-t">لماذا آر باي</span><span className="en-t">Why R.Pay</span></a>
        </nav>
        <div className="pnr">
          <button className="plang" onClick={() => setEn((v) => !v)} aria-label="Toggle language">{en ? "ع" : "EN"}</button>
          <a className="pbtn" href="#contact"><span className="ar-t">ابدأ الآن</span><span className="en-t">Get Started</span></a>
        </div>
      </header>

      {/* ── SCENE 01 · HERO / TAP LAB ── */}
      <section className="phero" aria-label="R.Pay">
        <div className="ph-aura" aria-hidden="true" />
        <div className="ph-grid">
          <div className="ph-copy">
            <div className="pkick rv"><span className="pdot" />
              <span className="ar-t">نظام دفع ذكي · تحكّم لحظي</span>
              <span className="en-t">Smart payments · Live control</span>
            </div>
            <h1 className="monu rv d1" aria-label={en ? "Pay. Monitor. Control." : "ادفع. راقب. تحكّم."}>
              {VERBS.map((v, i) => (
                <span key={i} className={`mo${verb === i ? " on" : ""}`} aria-hidden="true">
                  <span className="ar-t">{v.ar}</span><span className="en-t">{v.en}</span>
                </span>
              ))}
            </h1>
            <p className="plead rv d2">
              <span className="ar-t">منصة واحدة لكل أجهزتك، من اللمسة إلى حسابك مباشرة.</span>
              <span className="en-t">One platform for every machine — from the tap straight to your account.</span>
            </p>
            <div className="pcta rv d3">
              <a className="pbtn lg" href="#contact"><span className="ar-t">ابدأ الآن</span><span className="en-t">Get Started</span></a>
              <button className="pbtn ghost lg" onClick={runTap}>
                <span className="ar-t">جرّب اللمسة</span><span className="en-t">Try the tap</span>
                <svg viewBox="0 0 24 24"><path d="M8 13V5.5a1.5 1.5 0 0 1 3 0V12l4.6.9a3 3 0 0 1 2.4 3.2l-.4 3a3 3 0 0 1-3 2.9h-3.4a4 4 0 0 1-3-1.3L5 17" /><path d="M6 7a5 5 0 0 1 8.5-3.5" /></svg>
              </button>
            </div>
            <div className="ppay rv d4">
              <span className="ppay-lb"><span className="ar-t">وسائل الدفع المدعومة</span><span className="en-t">Supported payments</span></span>
              <div className="ppay-row">
                <span className="pchip" aria-label="mada"><b className="w-mada">mada</b></span>
                <span className="pchip" aria-label="Visa"><b className="w-visa">VISA</b></span>
                <span className="pchip" aria-label="Mastercard">
                  <svg className="w-mc" viewBox="0 0 40 24" aria-hidden="true"><circle cx="16" cy="12" r="9" fill="#EB001B" /><circle cx="24" cy="12" r="9" fill="#F79E1B" /><path d="M20 5.2a8.98 8.98 0 0 0 0 13.6 8.98 8.98 0 0 0 0-13.6Z" fill="#FF5F00" /></svg>
                </span>
                <span className="pchip" aria-label="Apple Pay">
                  <svg className="w-ap" viewBox="0 0 20 24" aria-hidden="true"><path d="M13.6 4.2c.7-.9 1.2-2 1-3.2-1 .05-2.2.7-2.9 1.5-.6.7-1.2 1.9-1 3 1.1.1 2.2-.5 2.9-1.3Z" /><path d="M14.9 6.3c-1.6-.1-3 .9-3.7.9-.8 0-2-.9-3.3-.85-1.7.02-3.3 1-4.1 2.5-1.8 3-.5 7.6 1.3 10.1.9 1.2 1.9 2.6 3.2 2.5 1.3-.05 1.8-.83 3.3-.83 1.5 0 2 .83 3.3.8 1.4-.02 2.2-1.25 3.1-2.47.7-.9 1-1.4 1.5-2.44-3.9-1.5-4.5-7-.65-9.1-1-1.35-2.6-1.8-3.5-1.84Z" /></svg>
                  <b className="w-apt">Pay</b>
                </span>
                <span className="pchip" aria-label="STC Pay"><b className="w-stc">stc<i>pay</i></b></span>
              </div>
            </div>
          </div>

          {/* TAP LAB — press the terminal */}
          <div className="ph-lab rv d2">
            <button
              type="button"
              className={`taplab ph-${phase}`}
              onClick={runTap}
              aria-label={en ? "Run a demo payment" : "شغّل دفعة تجريبية"}
            >
              <span className="tl-halo" aria-hidden="true" />
              <span className="tl-ring r1" aria-hidden="true" />
              <span className="tl-ring r2" aria-hidden="true" />
              <span className="tl-ring r3" aria-hidden="true" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="tl-dev" src={DEVICE} alt="" draggable={false} />
              <span className="tl-card" aria-hidden="true">
                <i className="tc-chip" /><i className="tc-wave" />
              </span>
              <span className="tl-ok" aria-hidden="true">
                <i>✓</i>
                <span className="ar-t">دفعة ناجحة · SAR 15.00</span>
                <span className="en-t">Approved · SAR 15.00</span>
              </span>
              <span className="tl-fly" aria-hidden="true" dir="ltr">+ SAR 15.00</span>
              <span className="tl-hint" aria-hidden="true">
                <span className="ar-t">اضغط الجهاز</span><span className="en-t">Tap the device</span>
              </span>
            </button>

            {/* live mini-dashboard the payment lands into */}
            <div className={`tl-dash ph-${phase}`} aria-live="off">
              <span className="td-top"><i className="td-live" />
                <span className="ar-t">لوحة التحكم · مباشر</span><span className="en-t">Dashboard · Live</span>
              </span>
              <b className="td-num" dir="ltr">{tx.toLocaleString("en-US")}</b>
              <span className="td-lb"><span className="ar-t">إجمالي عمليات الدفع</span><span className="en-t">Total transactions</span></span>
              <span className="td-bars" aria-hidden="true"><i /><i /><i /><i /><i /><i /></span>
            </div>
          </div>
        </div>

        <a className="pcue" href="#pulse" aria-label="scroll">
          <span className="ar-t">مرّر للأسفل</span><span className="en-t">Scroll</span>
          <span className="pm"><i /></span>
        </a>
      </section>

      <BrandsMarquee />

      {/* ── SCENE 02 · PULSE LINE / STATS ── */}
      <section className="ppulse rv" id="pulse" aria-label="R.Pay in numbers">
        <svg className="ecg" viewBox="0 0 1200 120" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 60h180l20-28 22 56 24-70 26 84 22-42h130l18-24 20 48 22-60 24 72 20-36h150l20-30 22 60 24-74 26 88 22-44h140l18-22 20 44 22-56 24 68 20-34h160" />
        </svg>
        <div className="pstats">
          <div className="pst"><b dir="ltr"><span className="num" data-t="465255">0</span>+</b><span><span className="ar-t">عملية دفع</span><span className="en-t">Transactions</span></span></div>
          <div className="pst"><b dir="ltr"><span className="num" data-t="97">0</span></b><span><span className="ar-t">ماكينة مُدارة</span><span className="en-t">Machines managed</span></span></div>
          <div className="pst"><b dir="ltr"><span className="num" data-t="9">0</span></b><span><span className="ar-t">فروع</span><span className="en-t">Branches</span></span></div>
          <div className="pst"><b dir="ltr"><span className="num" data-t="9434">0</span></b><span><span className="ar-t">هدية مُسلَّمة</span><span className="en-t">Gifts delivered</span></span></div>
        </div>
      </section>

      {/* ── SCENE 03 · SECTORS TRIPTYCH ── */}
      <section className="psect" id="sectors">
        <div className="phead rv">
          <span className="peye"><span className="ar-t">نظام موحّد</span><span className="en-t">Unified system</span></span>
          <h2><span className="ar-t">ثلاثة قطاعات، <em>نبض واحد</em></span><span className="en-t">Three sectors, <em>one pulse</em></span></h2>
        </div>
        <div className="trip rv d1">
          {SECTORS.map((s) => (
            <a className="tpanel" href="#contact" key={s.sub}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.img} alt={s.en} loading="lazy" />
              <span className="tp-scrim" aria-hidden="true" />
              <span className="tp-sub">{s.sub}</span>
              <span className="tp-body">
                <b><span className="ar-t">{s.ar}</span><span className="en-t">{s.en}</span></b>
                <small><span className="ar-t">{s.arP}</span><span className="en-t">{s.enP}</span></small>
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* ── SCENE 04 · PLATFORM RAIL ── */}
      <section className="pos" id="platform">
        <div className="phead rv">
          <span className="peye"><span className="ar-t">المنصة</span><span className="en-t">The platform</span></span>
          <h2><span className="ar-t">ثمانية أنظمة، <em>لوحة واحدة</em></span><span className="en-t">Eight systems, <em>one dashboard</em></span></h2>
          <p className="psub">
            <span className="ar-t">اسحب لاستكشاف كل ما يعمل خلف كل لمسة.</span>
            <span className="en-t">Drag to explore everything working behind every tap.</span>
          </p>
        </div>
        <div className="rail rv d1" id="prail" tabIndex={0} aria-label={en ? "Platform capabilities" : "قدرات المنصة"}>
          {OS.map((f, i) => (
            <article className="tile" key={i}>
              <span className="tnum" dir="ltr">{i < 9 ? "0" + (i + 1) : i + 1}</span>
              <span className="tic" aria-hidden="true"><svg viewBox="0 0 24 24">{f.ic}</svg></span>
              <h3><span className="ar-t">{f.ar}</span><span className="en-t">{f.en}</span></h3>
              <p><span className="ar-t">{f.arP}</span><span className="en-t">{f.enP}</span></p>
            </article>
          ))}
        </div>
        <div className="railtrack" aria-hidden="true"><i id="prailbar" /></div>
      </section>

      {/* ── SCENE 05 · LIVE NETWORK ── */}
      <section className="pnet" id="network">
        <div className="phead rv">
          <span className="peye"><span className="ar-t">الشبكة الحية</span><span className="en-t">Live network</span></span>
          <h2><span className="ar-t">شبكة تعمل، <em>وأنت تراها</em></span><span className="en-t">A network at work, <em>in plain sight</em></span></h2>
        </div>
        <div className="ngrid">
          <div className="ndemo rv d1" aria-hidden="true">
            <div className="nr r1" /><div className="nr r2" /><div className="nr r3" /><div className="nr r4" />
            <div className="ncross" /><div className="nsweep" />
            <div className="nfence" /><div className="ndev" />
            <div className="nalert">
              <span className="na-dot" />
              <span>
                <b><span className="ar-t">تنبيه: خرج الجهاز عن النطاق</span><span className="en-t">Alert: device left the zone</span></b>
                <span className="ar-t">تم الإغلاق تلقائيًا</span><span className="en-t">Auto-shutdown engaged</span>
              </span>
            </div>
            <div className="nfeed" key={feedIx} dir="ltr">
              <i className="nf-ok">✓</i>
              <span className="nf-city"><span className="ar-t">{feed.cityAr}</span><span className="en-t">{feed.cityEn}</span></span>
              <b>SAR {feed.amt}</b>
              <small>{feed.m}</small>
            </div>
          </div>
          <div className="ncopy rv d2">
            <p className="nlead">
              <span className="ar-t">شركة سعودية تقود التحوّل الذكي لقطاع الأجهزة والخدمات الذاتية، بنظام موحّد يجمع الدفع الإلكتروني والمراقبة التشغيلية.</span>
              <span className="en-t">A Saudi company leading the smart transformation of self-service — one system for e-payment and operational control.</span>
            </p>
            <div className="nbadge">
              <svg viewBox="0 0 24 24"><path d="M8 21h8M12 17v4M17 4H7v6a5 5 0 0 0 10 0V4Z" /><path d="M7 6H4a2 2 0 0 0 2 5M17 6h3a2 2 0 0 1-2 5" /></svg>
              <span className="ar-t">أكبر مشغّل لمكائن ألعاب الأركيد في المنطقة</span>
              <span className="en-t">The region&apos;s largest arcade-machine operator</span>
            </div>
            <div className="nclients">
              <span>Saffori Land</span><span>Sparky&apos;s</span><span>VR Games Zone</span>
            </div>
            <div className="nmv">
              <div className="nmvc">
                <b><span className="ar-t">مهمتنا</span><span className="en-t">Mission</span></b>
                <span className="ar-t">تمكين المشغلين من تعزيز الكفاءة وتقديم تجربة سلسة وآمنة، ودعم نمو الأعمال بمرونة.</span>
                <span className="en-t">Empower operators to boost efficiency, deliver a smooth secure experience and grow flexibly.</span>
              </div>
              <div className="nmvc">
                <b><span className="ar-t">رؤيتنا</span><span className="en-t">Vision</span></b>
                <span className="ar-t">أن نكون المنصة التقنية الرائدة لإدارة الأجهزة الذاتية في المملكة والمنطقة.</span>
                <span className="en-t">To be the leading platform for self-service devices in the Kingdom and the region.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SCENE 06 · FLOW DECK ── */}
      <section className="pflow" id="flow">
        <div className="phead rv">
          <span className="peye"><span className="ar-t">كيف يعمل</span><span className="en-t">How it works</span></span>
          <h2><span className="ar-t">أربع ركائز، <em>تحكّم كامل</em></span><span className="en-t">Four pillars, <em>full control</em></span></h2>
        </div>
        <div className="deck">
          {FLOW.map((s, i) => (
            <article className="dcard" key={i} style={{ "--i": i } as CSSProperties}>
              <span className="dnum" dir="ltr">0{i + 1}</span>
              <span className="dic" aria-hidden="true"><svg viewBox="0 0 24 24">{s.ic}</svg></span>
              <div className="dtx">
                <h3><span className="ar-t">{s.ar}</span><span className="en-t">{s.en}</span></h3>
                <p><span className="ar-t">{s.arP}</span><span className="en-t">{s.enP}</span></p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── SCENE 07 · WHY / SCOREBOARD ── */}
      <section className="pwhy" id="why">
        <div className="phead rv">
          <span className="peye"><span className="ar-t">المقارنة</span><span className="en-t">Comparison</span></span>
          <h2><span className="ar-t">لماذا <em>آر باي</em>؟</span><span className="en-t">Why <em>R.Pay</em>?</span></h2>
        </div>
        <div className="score rv d1">
          <div className="sc-head" dir="ltr">
            <b className="sc-r">R.Pay</b>
            <span className="sc-vs">VS</span>
            <b className="sc-o"><span className="ar-t">الآخرون</span><span className="en-t">Others</span><small>SurePay · Geidea</small></b>
          </div>
          <ul className="sc-list">
            {WHY.map((w, i) => (
              <li className="rv" key={i} style={{ transitionDelay: `${i * 0.05}s` }}>
                <span className="sc-lb"><span className="ar-t">{w.ar}</span><span className="en-t">{w.en}</span></span>
                <span className="sc-marks" dir="ltr">
                  <i className="yes"><svg viewBox="0 0 24 24"><path d="M4 12.5l5 5L20 6.5" /></svg></i>
                  {w.them ? (
                    <i className="yes dim"><svg viewBox="0 0 24 24"><path d="M4 12.5l5 5L20 6.5" /></svg></i>
                  ) : (
                    <i className="no"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18" /></svg></i>
                  )}
                </span>
              </li>
            ))}
          </ul>
          <div className="sc-tot rv" dir="ltr">
            <span className="sc-bar"><i /></span>
            <b>8 / 8</b>
            <small>1 / 8</small>
          </div>
          <p className="sc-disc">
            <span className="ar-t">تنويه: المعلومات مبنية على بيانات السوق الحالية وقد تتغير مع التحديثات المستقبلية.</span>
            <span className="en-t">Disclaimer: based on current market insights and may change with future updates.</span>
          </p>
        </div>
      </section>

      {/* ── SCENE 08 · CTA ── */}
      <section className="pcta-s" id="contact">
        <div className="ctaorb rv">
          <span className="orb" aria-hidden="true" />
          <h2><span className="ar-t">انضم إلينا وابدأ البيع الذاتي الآن</span><span className="en-t">Join us and start self-service sales now</span></h2>
          <p>
            <span className="ar-t">المنصة الرائدة للمدفوعات الرقمية والقياس عن بُعد في منطقة الشرق الأوسط وشمال إفريقيا.</span>
            <span className="en-t">The leading platform for digital payments and scalable telemetry in the MENA region.</span>
          </p>
          <a className="pbtn lg" href="https://wa.me/966550796555" target="_blank" rel="noopener noreferrer">
            <span className="ar-t">ابدأ الآن</span><span className="en-t">Get Started</span>
          </a>
          <span className="ctamail"><span className="ar-t">استفسارات:</span><span className="en-t">Inquiries:</span> <b>hello@rpay.sa</b></span>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="pfoot">
        <div className="pf-grid">
          <div className="pf-brand">
            <a className="pbrand" href="#top">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={R_MARK} alt="R.Pay" />
              <span>Pay</span>
            </a>
            <p><span className="ar-t">نظام الدفع الذكي وإدارة العمليات الرائد في المملكة العربية السعودية لمشغّلي الخدمة الذاتية.</span><span className="en-t">Saudi Arabia&apos;s premier smart payment and operations system for self-service operators.</span></p>
            <div className="pf-soc">
              <a href="#" aria-label="X"><svg viewBox="0 0 24 24"><path d="M18.9 2H22l-6.9 7.9L23.3 22h-6.4l-5-6.6L6 22H2.9l7.4-8.5L1.5 2H8l4.5 6L18.9 2Zm-1.1 18h1.7L7.1 3.9H5.3L17.8 20Z" /></svg></a>
              <a href="#" aria-label="LinkedIn"><svg viewBox="0 0 24 24"><path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5ZM.24 8.31h4.52V23H.24V8.31Zm7.44 0h4.33v2h.06c.6-1.14 2.07-2.34 4.27-2.34 4.57 0 5.41 3 5.41 6.91V23h-4.5v-7.2c0-1.72-.03-3.93-2.4-3.93-2.4 0-2.77 1.87-2.77 3.8V23H7.68V8.31Z" /></svg></a>
              <a href="#" aria-label="Instagram"><svg viewBox="0 0 24 24"><path d="M12 2.2c3.2 0 3.6 0 4.9.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.86s0 3.6-.07 4.86c-.15 3.23-1.66 4.77-4.92 4.92-1.3.06-1.7.07-4.9.07s-3.6 0-4.9-.07c-3.26-.15-4.77-1.7-4.92-4.92C2.1 15.6 2.1 15.2 2.1 12s0-3.6.08-4.86C2.33 3.9 3.84 2.42 7.1 2.27 8.4 2.2 8.8 2.2 12 2.2Zm0 3.63a6.17 6.17 0 1 0 0 12.34 6.17 6.17 0 0 0 0-12.34Zm0 10.18a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.4-11.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88Z" /></svg></a>
            </div>
          </div>
          <div className="pf-col">
            <h4><span className="ar-t">الشركة</span><span className="en-t">Company</span></h4>
            <a href="#network"><span className="ar-t">معلومات عنا</span><span className="en-t">About us</span></a>
            <a href="#"><span className="ar-t">الوظائف</span><span className="en-t">Careers</span></a>
            <a href="#"><span className="ar-t">الشراكات</span><span className="en-t">Partnerships</span></a>
            <a href="#contact"><span className="ar-t">اتصل بنا</span><span className="en-t">Contact</span></a>
          </div>
          <div className="pf-col">
            <h4><span className="ar-t">قانوني</span><span className="en-t">Legal</span></h4>
            <a href="#"><span className="ar-t">سياسة الخصوصية</span><span className="en-t">Privacy Policy</span></a>
            <a href="#"><span className="ar-t">شروط الخدمة</span><span className="en-t">Terms of Service</span></a>
            <a href="#"><span className="ar-t">الأمان</span><span className="en-t">Security</span></a>
            <a href="#"><span className="ar-t">الامتثال</span><span className="en-t">Compliance</span></a>
          </div>
          <div className="pf-col">
            <h4><span className="ar-t">الحالة</span><span className="en-t">Status</span></h4>
            <div className="pf-clocks">
              <div><span><span className="ar-t">الرياض</span><span className="en-t">Riyadh</span></span><b id="pclkR" dir="ltr">--:--</b></div>
              <div><span><span className="ar-t">محلي</span><span className="en-t">Local</span></span><b id="pclkL" dir="ltr">--:--</b></div>
            </div>
            <span className="pf-status"><i /><span className="ar-t">النظام يعمل</span><span className="en-t">System Operational</span></span>
            <span className="pf-addr"><span className="ar-t">طريق الملك فهد، الرياض</span><span className="en-t">King Fahd Rd, Riyadh</span></span>
          </div>
        </div>
        <div className="pf-bot">
          <span><span className="ar-t">جميع الحقوق محفوظة © 2026 شركة آر باي السعودية.</span><span className="en-t">© 2026 R.Pay Saudi Arabia. All rights reserved.</span></span>
          <span className="pf-mark">R.PAY</span>
        </div>
      </footer>
    </main>
  );
}
