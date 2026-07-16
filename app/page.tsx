"use client";
import { useEffect, useState } from "react";
import "./hub.css";
import { R_MARK } from "@/lib/assets/brand";

type Concept = {
  num: string;
  href: string;
  img: string | null;
  status: "live" | "restored" | "soon";
  statusAr: string;
  statusEn: string;
  eyebrowAr: string;
  eyebrowEn: string;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
};

const CONCEPTS: Concept[] = [
  {
    num: "01",
    href: "/concepts/latest",
    img: "/assets/device-terminal.webp",
    status: "live",
    statusAr: "متاح", statusEn: "Live",
    eyebrowAr: "الإنتاج · مصقول", eyebrowEn: "Production · Refined",
    titleAr: "أحدث تجربة", titleEn: "Latest Experience",
    descAr: "أحدث صفحة رئيسية مصقولة: هيرو متحرك، وسائل دفع مُستعادة، ومنصّة تحكّم موحّدة بوضعين فاتح وداكن.",
    descEn: "The newest polished landing: animated hero, restored payment methods, and a unified control platform in light and dark.",
  },
  {
    num: "02",
    href: "/concepts/video-hero",
    img: "/assets/hero-poster.webp",
    status: "restored",
    statusAr: "مُستعاد", statusEn: "Restored",
    eyebrowAr: "سينمائي", eyebrowEn: "Cinematic",
    titleAr: "هيرو الفيديو", titleEn: "Video Hero",
    descAr: "انطباع أول غامر عبر فيديو هيرو ملء الشاشة يمنح الصفحة حضورًا سينمائيًا فاخرًا.",
    descEn: "An immersive first impression: a full-bleed hero video that gives the page a cinematic, premium presence.",
  },
  {
    num: "03",
    href: "/concepts/machine",
    img: "/assets/machine-vending.webp",
    status: "restored",
    statusAr: "مُستعاد", statusEn: "Restored",
    eyebrowAr: "تفاعلي · تمرير", eyebrowEn: "Interactive · Scroll",
    titleAr: "تجربة الأجهزة الذكية", titleEn: "Smart Machine Experience",
    descAr: "كشف تفاعلي للماكينة يتحرك مع التمرير، مع تجربة الجهاز والأنيميشن بعد تحسين الآيفون.",
    descEn: "A scroll-driven machine reveal with the device experience and animation, restored after the iPhone fix.",
  },
  {
    num: "04",
    href: "/concepts/pulse",
    img: "/assets/machine-arcade.webp",
    status: "live",
    statusAr: "جديد", statusEn: "New",
    eyebrowAr: "بصري · تفاعلي", eyebrowEn: "Visual · Interactive",
    titleAr: "تجربة النبض", titleEn: "Pulse Experience",
    descAr: "صفحة بصرية تفاعلية بأقل نص ممكن: محاكي دفع حي، رادار الشبكة، وإحصائيات تنبض أمامك.",
    descEn: "A visual-first, interactive page with minimal text: a live tap-to-pay simulator, network radar, and stats that pulse before you.",
  },
  {
    num: "05",
    href: "/concepts/coming-soon",
    img: null,
    status: "soon",
    statusAr: "قريبًا", statusEn: "Soon",
    eyebrowAr: "قيد التطوير", eyebrowEn: "In the studio",
    titleAr: "القادم قريبًا", titleEn: "Coming Next",
    descAr: "اتجاه جديد كليًا لآر باي قيد التصميم حاليًا، سيُضاف كمفهوم مستقل في المرحلة القادمة.",
    descEn: "A brand-new R.Pay direction currently in design, arriving as its own concept in the next phase.",
  },
];

export default function Hub() {
  const [en, setEn] = useState(false);
  const [light, setLight] = useState(false);

  useEffect(() => {
    setLight(document.documentElement.classList.contains("light"));
  }, []);

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

  const toggleTheme = () => {
    const d = document.documentElement;
    const isLight = d.classList.toggle("light");
    d.classList.toggle("dark", !isLight);
    setLight(isLight);
    try { localStorage.setItem("rpay-theme", isLight ? "light" : "dark"); } catch (e) {}
  };

  return (
    <main className="hub">
      <div className="hub-glow" aria-hidden="true" />
      <div className="hub-grid-lines" aria-hidden="true" />

      <header className="hub-nav">
        <a className="hub-brand" href="#top" aria-label="R.Pay">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={R_MARK} alt="R.Pay" />
          <span>Pay</span>
        </a>
        <div className="hub-nav-right">
          <span className="hub-tag">
            <i />
            <span className="ar-t">مفاهيم تفاعلية</span>
            <span className="en-t">Interactive Concepts</span>
          </span>
          <button
            className="hub-btn"
            onClick={toggleTheme}
            aria-label={en
              ? (light ? "Switch to dark theme" : "Switch to light theme")
              : (light ? "التبديل إلى الوضع الداكن" : "التبديل إلى الوضع الفاتح")}
          >
            {light ? (
              <svg viewBox="0 0 24 24"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" /></svg>
            ) : (
              <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4.5" /><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8" /></svg>
            )}
          </button>
          <button className="hub-btn" onClick={() => setEn((v) => !v)} aria-label="Toggle language">{en ? "ع" : "EN"}</button>
        </div>
      </header>

      <section className="hub-hero" id="top">
        <div className="hub-kicker">
          <span className="dot" />
          <span className="ar-t">آر باي · اتجاهات الصفحة الرئيسية</span>
          <span className="en-t">R.Pay · Homepage directions</span>
        </div>
        <h1 className="hub-title">
          <span className="ar-t">استكشف <em>آر باي</em></span>
          <span className="en-t">Explore <em>R.Pay</em></span>
        </h1>
        <p className="hub-intro">
          <span className="ar-t">مجموعة من الاتجاهات المختلفة للصفحة الرئيسية لآر باي، كل مفهوم تجربة كاملة قائمة بذاتها. <b>افتح أي مفهوم</b> لاستعراضه بشكل مستقل.</span>
          <span className="en-t">A curated set of homepage directions for R.Pay, each concept a complete standalone experience. <b>Open any concept</b> to explore it on its own.</span>
        </p>
      </section>

      <section className="hub-cards" aria-label="R.Pay concepts">
        {CONCEPTS.map((c) => (
          <a className="concept-card" href={c.href} key={c.num}>
            {c.img ? (
              <div className="cc-thumb">
                <span className="cc-num">{c.num}</span>
                <span className={`cc-status ${c.status}`}>
                  <i /><span className="ar-t">{c.statusAr}</span><span className="en-t">{c.statusEn}</span>
                </span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.img} alt="" loading="lazy" />
              </div>
            ) : (
              <div className="cc-thumb soon-motif">
                <span className="cc-num">{c.num}</span>
                <span className={`cc-status ${c.status}`}>
                  <i /><span className="ar-t">{c.statusAr}</span><span className="en-t">{c.statusEn}</span>
                </span>
                <span className="plus" aria-hidden="true">
                  <svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg>
                </span>
              </div>
            )}
            <div className="cc-body">
              <span className="cc-eyebrow"><span className="ar-t">{c.eyebrowAr}</span><span className="en-t">{c.eyebrowEn}</span></span>
              <h3 className="cc-title"><span className="ar-t">{c.titleAr}</span><span className="en-t">{c.titleEn}</span></h3>
              <p className="cc-desc"><span className="ar-t">{c.descAr}</span><span className="en-t">{c.descEn}</span></p>
              <span className="cc-cta">
                <span className="ar-t">افتح التجربة</span><span className="en-t">Open experience</span>
                <svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </span>
            </div>
          </a>
        ))}
      </section>

      <footer className="hub-foot">
        <span><span className="ar-t">© 2026 شركة آر باي السعودية · جميع الحقوق محفوظة</span><span className="en-t">© 2026 R.Pay Saudi Arabia · All rights reserved</span></span>
        <span className="fmark">R.PAY</span>
      </footer>
    </main>
  );
}
