"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { R_MARK } from "@/lib/assets/brand";

const WIDE = "/assets/concept-08/hero-wide.mp4";
const TALL = "/assets/concept-08/hero-tall.mp4";
const POSTER = "/assets/concept-08/hero-poster.webp";
const POSTER_TALL = "/assets/concept-08/hero-poster-tall.webp";

/** The film's tap-pulse blooms around this timestamp; the DOM echo fires
 *  once when playback crosses it. Measured on the delivered cut, not guessed. */
const PULSE_AT = 3.2;

/** ACT I — THE TAP.
 *  LCP is the headline TEXT + poster; the film fades in when it can play.
 *  The film plays ONCE and settles on a calm terminal (its own last frame) —
 *  no loop seam, no perpetual motion. «شاهد عملية الدفع» replays it.
 *  The film's pulse hands off to the page: at PULSE_AT a DOM ring expands
 *  past the copy and the payment-brands row ignites — the one branded
 *  moment where the film's energy visibly becomes the interface's energy. */
export default function HeroFilm() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const echoFired = useRef(false);
  const [src, setSrc] = useState<string | null>(null);
  const [poster, setPoster] = useState(POSTER);
  const [on, setOn] = useState(false);      // film visible over poster
  const [echo, setEcho] = useState(false);  // DOM pulse-echo running
  const [ended, setEnded] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // Designed static hero: poster + echo already resolved. No video fetch.
      setEcho(true);
      setEnded(true);
      return;
    }
    const mq = window.matchMedia("(max-width: 820px)");
    setSrc(mq.matches ? TALL : WIDE);
    setPoster(mq.matches ? POSTER_TALL : POSTER);
    // Source chosen once per visit; live swap mid-play is not worth the jank.
  }, []);

  const onTime = useCallback(() => {
    const v = videoRef.current;
    if (!v || echoFired.current) return;
    if (v.currentTime >= PULSE_AT) {
      echoFired.current = true;
      setEcho(true);
    }
  }, []);

  const replay = useCallback(() => {
    echoFired.current = false;
    setEcho(false);
    setEnded(false);
    // Double-rAF so the echo classes actually clear before re-adding.
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        const v = videoRef.current;
        if (!v) {
          // Reduced motion / failed video: replay is just the DOM echo.
          echoFired.current = true;
          setEcho(true);
          setEnded(true);
          return;
        }
        v.currentTime = 0;
        v.play().catch(() => {
          // Autoplay refused on replay — restore the resolved state.
          echoFired.current = true;
          setEcho(true);
          setEnded(true);
        });
      })
    );
  }, []);

  const toggleLang = () => {
    const el = document.documentElement;
    const en = el.classList.toggle("en");
    el.setAttribute("dir", en ? "ltr" : "rtl");
    el.setAttribute("lang", en ? "en" : "ar");
  };

  return (
    <section className={`act hero${ended ? " settled" : ""}`} id="tap" aria-label="One tap">
      {/* Poster paints first; the film fades in over it. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="hero-poster" src={poster} alt="" aria-hidden="true" />
      {src && (
        <video
          ref={videoRef}
          className={on ? "on" : undefined}
          src={src}
          poster={poster}
          autoPlay
          muted
          playsInline
          preload="auto"
          onCanPlay={() => setOn(true)}
          onTimeUpdate={onTime}
          onEnded={() => setEnded(true)}
          onError={() => { setOn(false); setEcho(true); setEnded(true); }}
        />
      )}
      <div className="veil" aria-hidden="true" />

      {/* The pulse-echo ring: born at the terminal's screen position,
          expands past the copy. Purely decorative. */}
      <div className={`echo${echo ? " run" : ""}`} aria-hidden="true"><i /><i /></div>

      <nav className="hero-nav">
        <a className="brand" href="/" aria-label="R.Pay — Concept hub">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={R_MARK} alt="" />
          <span>Pay</span>
        </a>
        <div className="side">
          <button className="lang" onClick={toggleLang} aria-label="Toggle language">
            <span className="ar-t">EN</span>
            <span className="en-t">ع</span>
          </button>
          {/* CTA 1 of 5 — same verb, same destination, page-wide */}
          <a className="cta-warm cta-nav" href="#demo">
            <span className="ar-t">احجز عرضًا مباشرًا</span>
            <span className="en-t">Book a live demo</span>
          </a>
        </div>
      </nav>

      <div className="hero-copy">
        <p className="t-meta kicker">
          <span className="ar-t">آر باي · الدفع والتحكّم للماكينات الذكية</span>
          <span className="en-t">R.Pay · Payments &amp; control for smart machines</span>
        </p>
        <h1 className="t-display">
          <span className="ar-t">لمسة واحدة.<br />تحكّم كامل.</span>
          <span className="en-t">One tap.<br />Total control.</span>
        </h1>
        <p className="t-body sub">
          <span className="ar-t">حوّل كل ماكينة إلى نقطة بيع ذكية، وأدر المدفوعات والأجهزة والعمليات من منصة واحدة.</span>
          <span className="en-t">Turn every machine into a smart point of sale — then run payments, devices and operations from one platform.</span>
        </p>

        <div className="ctas">
          {/* CTA 2 of 5 */}
          <a className="cta-warm" href="#demo">
            <span className="ar-t">احجز عرضًا مباشرًا</span>
            <span className="en-t">Book a live demo</span>
          </a>
          <button className="cta-ghost" onClick={replay}>
            <span className="ar-t">شاهد عملية الدفع</span>
            <span className="en-t">Watch the payment flow</span>
          </button>
        </div>
        <p className="t-meta cta-note">
          <span className="ar-t">شاهد كيف تعمل R.Pay على ماكيناتك.</span>
          <span className="en-t">See how R.Pay works with your machines.</span>
        </p>

        <div className={`pays${echo ? " lit" : ""}`} aria-label="Payment methods">
          <span>mada</span><span>VISA</span><span>Mastercard</span><span>Apple Pay</span><span>STC Pay</span>
        </div>
      </div>

      <div className="down t-meta" aria-hidden="true">
        <span className="ar-t">↓ اللمسة تكمل القصة</span>
        <span className="en-t">↓ The tap continues below</span>
      </div>
    </section>
  );
}
