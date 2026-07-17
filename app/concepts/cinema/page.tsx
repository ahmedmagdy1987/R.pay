"use client";
import { useEffect, useRef, useState } from "react";
import { R_MARK } from "@/lib/assets/brand";
import { ARCADE, VENDING, COFFEE } from "@/lib/assets/machines";

/* ─────────────────────────────────────────────────────────────
   Concept 05 · CINEMA — «سينما»
   Fully visual: AI-generated cinematic hero film (Higgsfield)
   + ONE horizontal reel of frames carrying the whole story.
   Short page by design: hero → reel → credits. ~2 screens.
   ───────────────────────────────────────────────────────────── */

/* ⚠️ HERO FILM ASSETS — Higgsfield CDN URLs.
   TALL versions are optional: when empty the WIDE film is reused
   with a mobile-biased crop. To self-host later: download the 4
   files into /public/assets and swap these constants. */
const HERO_VIDEO_WIDE = "https://d8j0ntlcm91z4.cloudfront.net/user_3GaFDCPxXxLkf7tMkHBtsAhcdcL/hf_20260716_154949_7fbcd389-b2b5-4aff-93f0-259d4aa601f5.mp4"; /* 16:9 · 1080p · mp4 */
const HERO_VIDEO_TALL = "__HERO_VIDEO_TALL__"; /* 9:16 · 720p · mp4 */
const HERO_POSTER_WIDE = "https://d8j0ntlcm91z4.cloudfront.net/user_3GaFDCPxXxLkf7tMkHBtsAhcdcL/hf_20260716_154648_5226cf27-fe65-4d43-8831-86ebc283c3cd.png"; /* 16:9 still */
const HERO_POSTER_TALL = "https://d8j0ntlcm91z4.cloudfront.net/user_3GaFDCPxXxLkf7tMkHBtsAhcdcL/hf_20260716_155043_226656bd-6dbc-4186-9e33-be54628d59ac.png"; /* 9:16 still */

const ok = (u: string) => u.startsWith("http");

const STATS = [
  { t: 465255, plus: true, ar: "عملية دفع", en: "Transactions" },
  { t: 97, plus: false, ar: "ماكينة مُدارة", en: "Machines" },
  { t: 9434, plus: false, ar: "هدية مُسلَّمة", en: "Gifts delivered" },
  { t: 9, plus: false, ar: "فروع", en: "Branches" },
];

const SECTORS = [
  { img: ARCADE, sub: "ARCADE", ar: "ألعاب الأركيد", en: "Arcade Games", arP: "خبرة أكبر مشغّل في المنطقة.", enP: "The region's largest operator." },
  { img: VENDING, sub: "VENDING", ar: "آلات البيع الذاتي", en: "Vending Machines", arP: "دفع إلكتروني متكامل للخدمة الذاتية.", enP: "Fully integrated self-service payment." },
  { img: COFFEE, sub: "COFFEE", ar: "آلات القهوة", en: "Coffee Machines", arP: "تحكّم ومتابعة لحظية من نظام واحد.", enP: "Live control from one system." },
];

const OS_A = [
  { ar: "تحصيل مباشر لحسابك", en: "Direct settlement", ic: <><path d="M3 10h18M5 6h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z" /><path d="M7 15h4" /></> },
  { ar: "استرجاع تلقائي", en: "Auto refunds", ic: <><path d="M3 12a9 9 0 1 0 3-6.7" /><path d="M3 4v5h5" /></> },
  { ar: "تقارير لحظية", en: "Real-time reports", ic: <><rect x="3" y="4" width="18" height="14" rx="2" /><path d="M7 14l3-3 2 2 4-4" /></> },
  { ar: "لوحة تحكم موحّدة", en: "Unified dashboard", ic: <><rect x="2" y="5" width="20" height="12" rx="2" /><path d="M8 21h8M12 17v4" /></> },
];
const OS_B = [
  { ar: "إدارة الأجهزة عن بُعد", en: "Remote control", ic: <><path d="M12 2v4M12 18v4M2 12h4M18 12h4" /><circle cx="12" cy="12" r="4" /></> },
  { ar: "الرادار الجغرافي", en: "Geofence radar", ic: <><path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11Z" /><circle cx="12" cy="10" r="2.5" /></> },
  { ar: "المخزون والهدايا", en: "Inventory & rewards", ic: <><path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6M12 20V9M2 7l10-4 10 4-10 4L2 7Z" /></> },
  { ar: "الفروع والمستخدمون", en: "Branches & users", ic: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></> },
];

const WHY = [
  { ar: "تحصيل مباشر للمالك", en: "Direct collection", them: false },
  { ar: "استرداد تلقائي", en: "Auto refunds", them: false },
  { ar: "رادار GPS", en: "GPS geofencing", them: false },
  { ar: "إدارة المخزون", en: "Inventory", them: false },
  { ar: "أجهزة عن بُعد", en: "Remote devices", them: false },
  { ar: "دعم عن بُعد", en: "Remote support", them: false },
  { ar: "علامة بيضاء", en: "White-label", them: false },
  { ar: "لوحة لحظية", en: "Live dashboard", them: true },
];

export default function Cinema() {
  const [en, setEn] = useState(false);
  const [tall, setTall] = useState(false);
  const [frame, setFrame] = useState(1);
  const total = 9;
  const reelRef = useRef<HTMLDivElement>(null);
  const reduced = useRef(false);

  /* language (repo pattern) */
  useEffect(() => {
    const h = document.documentElement;
    if (en) { h.classList.add("en"); h.setAttribute("dir", "ltr"); h.setAttribute("lang", "en"); }
    else { h.classList.remove("en"); h.setAttribute("dir", "rtl"); h.setAttribute("lang", "ar"); }
  }, [en]);

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* portrait devices get the tall film (when available) */
    const mq = window.matchMedia("(max-width: 760px)");
    const pick = () => setTall(mq.matches);
    pick();
    mq.addEventListener?.("change", pick);

    /* reveal + counters */
    const runNum = (el: HTMLElement) => {
      if (el.dataset.done) return; el.dataset.done = "1";
      const t = +(el.dataset.t || "0");
      const dur = reduced.current ? 0 : 1300; const s = performance.now();
      const step = (now: number) => {
        const k = Math.min((now - s) / Math.max(dur, 1), 1);
        el.textContent = Math.round(t * (1 - Math.pow(1 - k, 4))).toLocaleString("en-US");
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          e.target.querySelectorAll<HTMLElement>(".num").forEach(runNum);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.2, root: null });
    document.querySelectorAll<HTMLElement>(".cv").forEach((el) => io.observe(el));

    /* reel progress (RTL-safe via absolute scroll offset) */
    const reel = reelRef.current;
    const onReel = () => {
      if (!reel) return;
      const max = reel.scrollWidth - reel.clientWidth;
      const p = max > 0 ? Math.abs(reel.scrollLeft) / max : 0;
      setFrame(Math.min(total, Math.max(1, Math.round(p * (total - 1)) + 1)));
    };
    reel?.addEventListener("scroll", onReel, { passive: true });
    onReel();

    /* desktop: vertical wheel drives the reel horizontally */
    const onWheel = (e: WheelEvent) => {
      if (!reel || Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      if (reel.scrollWidth <= reel.clientWidth) return;
      const dir = document.documentElement.getAttribute("dir") === "rtl" ? -1 : 1;
      reel.scrollLeft += e.deltaY * dir;
      e.preventDefault();
    };
    reel?.addEventListener("wheel", onWheel, { passive: false });

    /* desktop: drag to scroll */
    let down = false, sx = 0, sl = 0;
    const pd = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || !reel) return;
      down = true; sx = e.clientX; sl = reel.scrollLeft;
      reel.classList.add("drag");
    };
    const pm = (e: PointerEvent) => {
      if (!down || !reel) return;
      reel.scrollLeft = sl - (e.clientX - sx);
    };
    const pu = () => { down = false; reelRef.current?.classList.remove("drag"); };
    reel?.addEventListener("pointerdown", pd);
    window.addEventListener("pointermove", pm);
    window.addEventListener("pointerup", pu);

    return () => {
      mq.removeEventListener?.("change", pick);
      io.disconnect();
      reel?.removeEventListener("scroll", onReel);
      reel?.removeEventListener("wheel", onWheel);
      reel?.removeEventListener("pointerdown", pd);
      window.removeEventListener("pointermove", pm);
      window.removeEventListener("pointerup", pu);
    };
  }, []);

  const step = (d: 1 | -1) => {
    const reel = reelRef.current;
    if (!reel) return;
    const fr = reel.querySelector<HTMLElement>(".fr");
    const w = (fr?.offsetWidth || 320) + 16;
    const dir = document.documentElement.getAttribute("dir") === "rtl" ? -1 : 1;
    reel.scrollBy({ left: d * w * dir, behavior: "smooth" });
  };

  const videoSrc = tall && ok(HERO_VIDEO_TALL) ? HERO_VIDEO_TALL : HERO_VIDEO_WIDE;
  const posterSrc = tall && ok(HERO_POSTER_TALL) ? HERO_POSTER_TALL : HERO_POSTER_WIDE;

  return (
    <main className="cn" id="top">
      <a className="c-back" href="/" aria-label="All concepts">
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.6" /><rect x="14" y="3" width="7" height="7" rx="1.6" /><rect x="3" y="14" width="7" height="7" rx="1.6" /><rect x="14" y="14" width="7" height="7" rx="1.6" /></svg>
        <span className="ar-t">كل المفاهيم</span><span className="en-t">All concepts</span>
      </a>

      {/* NAV — minimal, floats over the film */}
      <header className="cnav">
        <a className="cbrand" href="#top">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={R_MARK} alt="R.Pay" /><span>Pay</span>
        </a>
        <div className="cnr">
          <button className="clang" onClick={() => setEn((v) => !v)} aria-label="Toggle language">{en ? "ع" : "EN"}</button>
          <a className="cbtn sm" href="https://wa.me/966550796555" target="_blank" rel="noopener noreferrer">
            <span className="ar-t">ابدأ الآن</span><span className="en-t">Get Started</span>
          </a>
        </div>
      </header>

      {/* ══ ACT I · THE FILM ══ */}
      <section className="chero">
        {ok(videoSrc) && (
          <video
            key={videoSrc}
            className="cfilm"
            src={videoSrc}
            poster={ok(posterSrc) ? posterSrc : undefined}
            autoPlay muted loop playsInline
            preload="auto"
            disablePictureInPicture
            aria-hidden="true"
            style={!ok(HERO_VIDEO_TALL) && tall ? { objectPosition: "68% 50%" } : undefined}
          />
        )}
        {!ok(videoSrc) && <div className="cfilm cfilm-fallback" aria-hidden="true" />}
        <span className="cbar top" aria-hidden="true" />
        <span className="cbar bot" aria-hidden="true" />
        <div className="cscrim" aria-hidden="true" />

        <div className="chero-in">
          <span className="ckick"><i /><span className="ar-t">نظام الدفع الذكي · السعودية</span><span className="en-t">Smart payments · Saudi Arabia</span></span>
          <h1>
            <span className="ar-t">ادفع. راقب. <em>تحكّم.</em></span>
            <span className="en-t">Pay. Monitor. <em>Control.</em></span>
          </h1>
          <p>
            <span className="ar-t">منصة واحدة لكل أجهزتك — من اللمسة إلى حسابك مباشرة.</span>
            <span className="en-t">One platform for every machine — from the tap straight to your account.</span>
          </p>
          <div className="ccta">
            <a className="cbtn lg" href="https://wa.me/966550796555" target="_blank" rel="noopener noreferrer">
              <span className="ar-t">ابدأ الآن</span><span className="en-t">Get Started</span>
            </a>
            <a className="cbtn ghost lg" href="#reel">
              <span className="ar-t">شاهد المنظومة</span><span className="en-t">See the system</span>
              <svg viewBox="0 0 24 24"><path d="M12 5v14M5 12l7 7 7-7" /></svg>
            </a>
          </div>
          <div className="cpay" aria-label="Supported payments" dir="ltr">
            <b>mada</b><b>VISA</b><b className="mc"><i className="m1" /><i className="m2" /></b><b> Pay</b><b>stc<i>pay</i></b>
          </div>
        </div>
      </section>

      {/* ══ ACT II · THE REEL ══ */}
      <section className="creel" id="reel">
        <div className="creel-head cv">
          <div>
            <span className="ceye"><span className="ar-t">المنظومة كاملة</span><span className="en-t">The whole system</span></span>
            <h2><span className="ar-t">قصّة آر باي، <em>في شريط واحد</em></span><span className="en-t">The R.Pay story, <em>on one reel</em></span></h2>
          </div>
          <div className="creel-ctl" dir="ltr">
            <button onClick={() => step(-1)} aria-label="Previous"><svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7" /></svg></button>
            <span className="ctime">{String(frame).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
            <button onClick={() => step(1)} aria-label="Next"><svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" /></svg></button>
          </div>
        </div>

        <div className="reelwrap cv d1">
          <div className="reel" ref={reelRef} tabIndex={0} aria-label="Story reel">

            {/* 01 · stats */}
            <article className="fr fr-stats">
              <span className="fnum" dir="ltr">01</span>
              <h3><span className="ar-t">بالأرقام</span><span className="en-t">In numbers</span></h3>
              <div className="fstats">
                {STATS.map((s, i) => (
                  <div key={i}>
                    <b dir="ltr"><span className="num" data-t={s.t}>0</span>{s.plus ? "+" : ""}</b>
                    <span><span className="ar-t">{s.ar}</span><span className="en-t">{s.en}</span></span>
                  </div>
                ))}
              </div>
            </article>

            {/* 02-04 · sectors */}
            {SECTORS.map((s, i) => (
              <article className="fr fr-sec" key={s.sub}>
                <span className="fnum" dir="ltr">0{i + 2}</span>
                <span className="fmedia">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.img} alt={s.en} loading="lazy" />
                </span>
                <span className="fsub">{s.sub}</span>
                <h3><span className="ar-t">{s.ar}</span><span className="en-t">{s.en}</span></h3>
                <p><span className="ar-t">{s.arP}</span><span className="en-t">{s.enP}</span></p>
              </article>
            ))}

            {/* 05-06 · platform */}
            {[OS_A, OS_B].map((grp, gi) => (
              <article className="fr fr-os" key={gi}>
                <span className="fnum" dir="ltr">0{gi + 5}</span>
                <h3>
                  <span className="ar-t">{gi === 0 ? "المنصة ١/٢" : "المنصة ٢/٢"}</span>
                  <span className="en-t">Platform {gi + 1}/2</span>
                </h3>
                <ul className="fos">
                  {grp.map((f, i) => (
                    <li key={i}>
                      <i aria-hidden="true"><svg viewBox="0 0 24 24">{f.ic}</svg></i>
                      <span><span className="ar-t">{f.ar}</span><span className="en-t">{f.en}</span></span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}

            {/* 07 · about */}
            <article className="fr fr-about">
              <span className="fnum" dir="ltr">07</span>
              <h3><span className="ar-t">من نحن</span><span className="en-t">Who we are</span></h3>
              <p className="fabout-l">
                <span className="ar-t">شركة سعودية تقود التحوّل الذكي لقطاع الأجهزة والخدمات الذاتية.</span>
                <span className="en-t">A Saudi company leading the smart transformation of self-service.</span>
              </p>
              <span className="fbadge">
                <svg viewBox="0 0 24 24"><path d="M8 21h8M12 17v4M17 4H7v6a5 5 0 0 0 10 0V4Z" /><path d="M7 6H4a2 2 0 0 0 2 5M17 6h3a2 2 0 0 1-2 5" /></svg>
                <span className="ar-t">أكبر مشغّل أركيد في المنطقة</span>
                <span className="en-t">Region&apos;s largest arcade operator</span>
              </span>
              <div className="fclients"><span>Saffori Land</span><span>Sparky&apos;s</span><span>VR Games Zone</span></div>
            </article>

            {/* 08 · why */}
            <article className="fr fr-why">
              <span className="fnum" dir="ltr">08</span>
              <h3><span className="ar-t">لماذا آر باي؟</span><span className="en-t">Why R.Pay?</span></h3>
              <ul className="fwhy">
                {WHY.map((w, i) => (
                  <li key={i}>
                    <span><span className="ar-t">{w.ar}</span><span className="en-t">{w.en}</span></span>
                    <span className="fmk" dir="ltr">
                      <i className="y">✓</i>{w.them ? <i className="y dim">✓</i> : <i className="n">✕</i>}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="fscore" dir="ltr"><span className="bar"><i /></span><b>8/8</b><small>vs 1/8</small></div>
            </article>

            {/* 09 · CTA */}
            <article className="fr fr-cta">
              <span className="fnum" dir="ltr">09</span>
              <h3>
                <span className="ar-t">انضم إلينا وابدأ البيع الذاتي الآن</span>
                <span className="en-t">Join us and start self-service sales now</span>
              </h3>
              <a className="cbtn lg" href="https://wa.me/966550796555" target="_blank" rel="noopener noreferrer">
                <span className="ar-t">ابدأ الآن</span><span className="en-t">Get Started</span>
              </a>
              <span className="fmail" dir="ltr">hello@rpay.sa</span>
            </article>

          </div>
        </div>
        <p className="creel-hint">
          <span className="ar-t">اسحب لاستكشاف بقية القصة</span>
          <span className="en-t">Drag to explore the rest of the story</span>
        </p>
      </section>

      {/* ══ CREDITS ══ */}
      <footer className="cfoot">
        <div className="cf-top">
          <a className="cbrand" href="#top">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={R_MARK} alt="R.Pay" /><span>Pay</span>
          </a>
          <nav className="cf-links">
            <a href="#reel"><span className="ar-t">المنظومة</span><span className="en-t">System</span></a>
            <a href="https://wa.me/966550796555" target="_blank" rel="noopener noreferrer"><span className="ar-t">اتصل بنا</span><span className="en-t">Contact</span></a>
            <a href="#"><span className="ar-t">الخصوصية</span><span className="en-t">Privacy</span></a>
          </nav>
          <span className="cf-status"><i /><span className="ar-t">النظام يعمل</span><span className="en-t">System Operational</span></span>
        </div>
        <div className="cf-bot">
          <span><span className="ar-t">جميع الحقوق محفوظة © 2026 شركة آر باي السعودية.</span><span className="en-t">© 2026 R.Pay Saudi Arabia. All rights reserved.</span></span>
          <span className="cf-mark">R.PAY · CONCEPT 05</span>
        </div>
      </footer>
    </main>
  );
}
