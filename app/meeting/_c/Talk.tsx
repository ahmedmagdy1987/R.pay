"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * The primary action, and the sheet behind it.
 *
 * One verb — «شاهده يعمل» — appearing three times on the page and nowhere else.
 * It opens a contact sheet rather than scrolling to a form, because the ask at
 * the end of a presentation should feel like a handshake, not a page jump.
 *
 * Both destinations are live WhatsApp intents on the number this project already
 * ships. Nothing here is inert, nothing is labelled "coming soon", and there is
 * no disabled state to explain in a meeting.
 */

const WA = "966550796555";
const TOUR = `https://wa.me/${WA}?text=${encodeURIComponent("أرغب بمشاهدة R.Pay يعمل على أسطول حقيقي.")}`;
const ASK = `https://wa.me/${WA}?text=${encodeURIComponent("لديّ سؤال عن R.Pay.")}`;

export function TalkButton({ label, kind = "primary" }: { label: string; kind?: "primary" | "ghost" }) {
  return (
    <button
      type="button"
      className={kind === "primary" ? "cta" : "cta-2"}
      onClick={() => window.dispatchEvent(new CustomEvent("mt:talk"))}
    >
      {label}
      <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" fill="none"
           style={{ transform: "scaleX(-1)" }}>
        <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6"
              strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

export function TalkSheet() {
  const [open, setOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const opener = useRef<Element | null>(null);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const onOpen = () => { opener.current = document.activeElement; setOpen(true); };
    window.addEventListener("mt:talk", onOpen);
    return () => window.removeEventListener("mt:talk", onOpen);
  }, []);

  /* Focus goes in on open and comes back out on close; Escape and the backdrop
     both close. Trapped inside the card so tabbing cannot wander the page. */
  useEffect(() => {
    if (!open) {
      (opener.current as HTMLElement | null)?.focus?.();
      return;
    }
    const card = cardRef.current;
    card?.querySelector<HTMLElement>("a, button")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { close(); return; }
      if (e.key !== "Tab" || !card) return;
      const f = Array.from(card.querySelectorAll<HTMLElement>("a[href], button"));
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [open, close]);

  return (
    <div
      className="mt-modal"
      data-open={open ? "1" : "0"}
      onClick={(e) => { if (e.target === e.currentTarget) close(); }}
      role="dialog"
      aria-modal={open}
      aria-hidden={!open}
      aria-label="تواصل مع آر باي"
    >
      <div className="mt-card" ref={cardRef}>
        <h3>خمس عشرة دقيقة، على شاشتك.</h3>
        <p>
          أخبرنا بعدد مكائنك ونوعها، ونعرض لك النظام وهو يعمل — بالعربية أو الإنجليزية،
          كما تفضّل.
        </p>

        <div className="mt-rows">
          <a className="mt-row" href={TOUR} target="_blank" rel="noopener noreferrer">
            <b>واتساب</b>
            <span>احجز عرضًا مباشرًا</span>
          </a>
          <a className="mt-row" href={ASK} target="_blank" rel="noopener noreferrer">
            <b>سؤال سريع</b>
            <span>اسأل قبل أن تحجز</span>
          </a>
        </div>

        <button type="button" className="mt-x" onClick={close}>إغلاق</button>
      </div>
    </div>
  );
}
