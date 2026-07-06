"use client";
import { useEffect, useRef, useState } from "react";
import { R_MARK } from "@/lib/assets/brand";

const ITEMS = [
  { n: "01", ar: "المنصة", en: "Platform", href: "#features" },
  { n: "02", ar: "التكامل", en: "Integration", href: "#sectors" },
  { n: "03", ar: "كيف يعمل", en: "How it works", href: "#how" },
  { n: "04", ar: "الشركة", en: "Company", href: "#about" },
  { n: "05", ar: "تواصل معنا", en: "Contact", href: "#contact" },
];

export default function Menu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [r, setR] = useState("--:--");
  const [l, setL] = useState("--:--");
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const fmt = (z: string) => {
      try {
        return new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: z }).format(new Date());
      } catch { return "--:--"; }
    };
    const tick = () => { setR(fmt("Asia/Riyadh")); setL(fmt(tz)); };
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // While open: move focus to the close button (keyboard users land inside the
  // dialog instead of behind it) and close on Escape. The focus is deferred:
  // .menu transitions visibility hidden→visible, and at the first frame the
  // node is still unfocusable, so an immediate focus() silently no-ops.
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => closeRef.current?.focus(), 60);
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => { clearTimeout(t); window.removeEventListener("keydown", onKey); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <div
      className={`menu${open ? " open" : ""}`}
      role="dialog"
      aria-modal={open}
      aria-hidden={!open}
      aria-label="القائمة الرئيسية / Main menu"
    >
      <div className="menu-top">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="menu-logo" src={R_MARK} alt="R.Pay" />
        <button className="menu-close" ref={closeRef} onClick={onClose} aria-label="إغلاق / Close">
          <svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
      </div>
      <nav className="menu-items">
        {ITEMS.map((it, i) => (
          <a key={it.n} href={it.href} onClick={onClose} style={{ transitionDelay: `${0.06 + i * 0.05}s` }}>
            <span className="mn">{it.n}</span>
            <span className="mt">
              <span className="ar-t">{it.ar}</span>
              <span className="en-t">{it.en}</span>
            </span>
          </a>
        ))}
      </nav>
      <div className="menu-foot">
        <div className="menu-clocks">
          <div><span><span className="ar-t">الرياض</span><span className="en-t">Riyadh</span></span><b>{r}</b></div>
          <div><span><span className="ar-t">محلي</span><span className="en-t">Local</span></span><b>{l}</b></div>
        </div>
        <a className="menu-mail" href="mailto:hello@rpay.sa">hello@rpay.sa</a>
      </div>
    </div>
  );
}
