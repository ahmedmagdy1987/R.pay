"use client";
import { useEffect, useRef, useState } from "react";

const FILM = "/assets/concept-08/arcade-live.mp4";
const POSTER = "/assets/concept-08/arcade-live-poster.webp";

const BEATS = [
  { ar: "لمسة", en: "Tap" },
  { ar: "تفويض", en: "Authorized" },
  { ar: "تشغيل", en: "In action" },
];

/** ACT II — TAP TO ACTION.
 *  The consequence of the hero's tap: the machine, alive. The clip enters
 *  dark and wakes on intersection — activation told by the reveal itself,
 *  not by asking a video model to fake a power-on. Plays while visible,
 *  pauses when hidden. Mobile and reduced-motion get the poster still. */
export default function TapToAction() {
  const secRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mode, setMode] = useState<"film" | "still">("film");
  const [lit, setLit] = useState(false);
  const [beat, setBeat] = useState(-1);

  useEffect(() => {
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.matchMedia("(max-width: 820px)").matches
    ) {
      setMode("still");
      setLit(true);
      setBeat(BEATS.length - 1);
      return;
    }
  }, []);

  useEffect(() => {
    const sec = secRef.current;
    if (!sec) return;

    let beatTimers: ReturnType<typeof setTimeout>[] = [];
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          const v = videoRef.current;
          if (e.isIntersecting) {
            setLit(true);
            if (v) v.play().catch(() => {});
            if (beatTimers.length === 0) {
              // Beats step in once, in rhythm with the wake.
              BEATS.forEach((_, i) => {
                beatTimers.push(setTimeout(() => setBeat(i), 500 + i * 900));
              });
            }
          } else if (v) {
            v.pause(); // never burn battery offscreen
          }
        }),
      { threshold: 0.35 }
    );
    io.observe(sec);
    return () => {
      io.disconnect();
      beatTimers.forEach(clearTimeout);
    };
  }, []);

  return (
    <section className={`act action${lit ? " lit" : ""}`} id="action" ref={secRef} aria-label="Tap to action">
      <header className="act-head">
        <h2 className="t-beat">
          <span className="ar-t">من لمسة… إلى تشغيل.</span>
          <span className="en-t">From a tap… to action.</span>
        </h2>
        <p className="t-body act-lead">
          <span className="ar-t">اللمسة لا تدفع فقط — بل تُشغّل الماكينة في اللحظة نفسها.</span>
          <span className="en-t">The tap doesn&apos;t just pay — it puts the machine to work in the same moment.</span>
        </p>
      </header>

      <figure className="action-stage">
        {mode === "film" ? (
          <video
            ref={videoRef}
            src={FILM}
            poster={POSTER}
            muted
            loop
            playsInline
            preload="none"
            aria-label=""
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={POSTER} alt="" loading="lazy" width={1600} height={893} />
        )}
        <figcaption className="beats" aria-hidden="true">
          {BEATS.map((b, i) => (
            <span key={i} className={`beat-chip t-meta${beat >= i ? " on" : ""}`}>
              <i className="tick" />
              <span className="ar-t">{b.ar}</span>
              <span className="en-t">{b.en}</span>
            </span>
          ))}
        </figcaption>
      </figure>
    </section>
  );
}
