"use client";
import { useEffect, useRef, useState } from "react";
import { R_MARK } from "@/lib/assets/brand";

const WIDE = "/assets/flow/film-hero-wide.mp4";
const TALL = "/assets/flow/film-hero-tall.mp4";
const POSTER = "/assets/flow/film-poster.webp";
const POSTER_TALL = "/assets/flow/film-poster-tall.webp";

/** ACT I — THE TAP.
 *  LCP is the headline TEXT: text renders immediately, the film fades in
 *  behind it once it can play.
 *  SPEC CHANGE (deliberate): NO loop attribute. The film plays its six
 *  seconds once and rests on its final frame — the can in warm amber light
 *  under the headline. Looping would snap from a 2s freeze back to the
 *  terminal, which reads as broken.
 *  film-tall.mp4 is genuinely wired: <820px viewports load the 9:16 cut. */
export default function FilmHero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [poster, setPoster] = useState(POSTER);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 820px)");
    const pick = () => { setSrc(mq.matches ? TALL : WIDE); setPoster(mq.matches ? POSTER_TALL : POSTER); };
    pick();
    // Source is chosen once per visit; live swap mid-play is not worth the jank.
  }, []);

  const toggleLang = () => {
    const el = document.documentElement;
    const en = el.classList.toggle("en");
    el.setAttribute("dir", en ? "ltr" : "rtl");
    el.setAttribute("lang", en ? "en" : "ar");
  };

  return (
    <section className="act hero" id="tap">
      {src && (
        <video
          ref={videoRef}
          className={on ? "on" : undefined}
          src={src}
          poster={poster}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          onCanPlay={() => setOn(true)}
        />
      )}
      <div className="veil" aria-hidden="true" />

      <nav className="hero-nav">
        <a className="brand" href="/" aria-label="R.Pay">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={R_MARK} alt="" />
            <span>Pay</span>
          </a>
        <div className="side">
          <button className="lang" onClick={toggleLang} aria-label="Toggle language">
            <span className="ar-t">EN</span>
            <span className="en-t">ع</span>
          </button>
          <a className="cta-ghost" href="#demo">
            <span className="ar-t">عرض تجريبي</span>
            <span className="en-t">Demo</span>
          </a>
        </div>
      </nav>

      <h1 className="t-display">
        <span className="ar-t">ادفع. خُذ.</span>
        <span className="en-t">Pay. Take.</span>
      </h1>
      <p className="t-body sub">
        <span className="ar-t">نظام الدفع لماكينات البيع في السعودية</span>
        <span className="en-t">Payments for vending machines in Saudi Arabia</span>
      </p>

      <div className="ctas">
        {/* CTA 1 of 4 — same verb, same colour, same destination */}
        <a className="cta-warm" href="#demo">
          <span className="ar-t">احجز عرض تجريبي</span>
          <span className="en-t">Book a demo</span>
        </a>
        <a className="cta-ghost" href="#machines">
          <span className="ar-t">شوف الماكينات ←</span>
          <span className="en-t">See the machines →</span>
        </a>
      </div>

      <div className="pays" aria-label="Payment methods">
        <span>mada</span><span>VISA</span><span>Mastercard</span><span>Apple Pay</span><span>STC Pay</span>
      </div>

      <div className="down t-meta">
        <span className="ar-t">↓ مرّر</span>
        <span className="en-t">↓ Scroll</span>
      </div>
    </section>
  );
}
