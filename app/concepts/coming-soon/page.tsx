"use client";
import { useEffect, useState } from "react";

export default function ComingSoon() {
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
    <main className="cs">
      <div className="cs-glow" aria-hidden="true" />
      <div className="cs-tools">
        <button className="cs-btn" onClick={toggleTheme} aria-label="Toggle theme">
          {light ? (
            <svg viewBox="0 0 24 24"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" /></svg>
          ) : (
            <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4.5" /><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8" /></svg>
          )}
        </button>
        <button className="cs-btn" onClick={() => setEn((v) => !v)} aria-label="Toggle language">{en ? "ع" : "EN"}</button>
      </div>

      <span className="cs-badge">
        <i /><span className="ar-t">المفهوم السادس · قريبًا</span><span className="en-t">Concept 06 · Coming soon</span>
      </span>

      <div className="cs-mark" aria-hidden="true">
        <svg viewBox="0 0 24 24"><path d="M12 4v16M4 12h16" /></svg>
      </div>

      <h1 className="cs-title">
        <span className="ar-t">القادم <em>قريبًا</em></span>
        <span className="en-t">Coming <em>Next</em></span>
      </h1>
      <p className="cs-sub">
        <span className="ar-t">اتجاه جديد كليًا للصفحة الرئيسية لآر باي قيد التصميم الآن. سيُضاف هنا كمفهوم مستقل في المرحلة القادمة.</span>
        <span className="en-t">A brand-new R.Pay homepage direction is in design right now. It will land here as its own standalone concept in the next phase.</span>
      </p>

      <a className="cs-home" href="/">
        <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1.6" /><rect x="14" y="3" width="7" height="7" rx="1.6" /><rect x="3" y="14" width="7" height="7" rx="1.6" /><rect x="14" y="14" width="7" height="7" rx="1.6" /></svg>
        <span className="ar-t">العودة إلى المفاهيم</span><span className="en-t">Back to concepts</span>
      </a>
    </main>
  );
}
