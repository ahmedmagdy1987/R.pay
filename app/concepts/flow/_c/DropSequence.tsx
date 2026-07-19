"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

/** ACT II — THE FALL. 500vh pinned canvas frame-sequence (THE SIGNATURE).
 *
 *  FRAME TIMING — DO NOT "FIX": the 72 frames are non-uniformly sampled on
 *  purpose (f_001–063 = 0–4.2s of motion at 15fps, f_064–072 = the 4.2–6.0s
 *  hold at 5fps). The LINEAR map below is therefore correct as written; it is
 *  exactly what makes the hold occupy ~12% of the scroll instead of 33%.
 *      frameIndex = Math.round(p * 71)
 *  No easing, no remapping, no interpolation.
 */
const N = 72;
const frameSrc = (i: number) => `/assets/flow/seq/f_${String(i + 1).padStart(3, "0")}.webp`;
const POSTER = "/assets/flow/film-poster.webp";

/* Thresholds derived from the real frame/time mapping:
   amber ignites t=3.7 (f56, p=.78); can at rest t=4.2 (f64, p=.89). */
const BEATS = [
  { a: 0.0, b: 0.2 },
  { a: 0.24, b: 0.44 },
  { a: 0.5, b: 0.72 },
  { a: 0.78, b: 1.01 },
];
const TRAY_A = 0.76; // glow starts (tracks the film's own amber, not fighting it)
const TRAY_B = 0.89; // glow full — the can is at rest
const CTA_AT = 0.89; // the money moment

type Mode = "scrub" | "mobile" | "static";

export default function DropSequence() {
  const [mode, setMode] = useState<Mode>("scrub");

  // Decide mode before paint. Mobile NEVER enters scrub, so the 72-frame
  // preload below is structurally unreachable under 820px.
  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setMode("static");
    else if (window.matchMedia("(max-width: 820px)").matches) setMode("mobile");
  }, []);

  if (mode === "mobile") return <MobileRail />;
  if (mode === "static") return <StaticFall />;
  return <ScrubFall />;
}

/* ---------------- desktop: the scrub ---------------- */

function ScrubFall() {
  const sectionRef = useRef<HTMLElement>(null);
  const holdRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const posterRef = useRef<HTMLImageElement>(null);
  const beatRefs = useRef<(HTMLDivElement | null)[]>([]);
  const trayRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const hold = holdRef.current;
    const canvas = canvasRef.current;
    if (!section || !hold || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let alive = true;
    const bitmaps: (ImageBitmap | HTMLImageElement | null)[] = new Array(N).fill(null);
    let drawnFrame = -1;
    let currentFrame = 0;

    /* ---- preload all 72 during ACT I; hold the poster until f_001 decodes ---- */
    const loadOne = async (i: number) => {
      try {
        const res = await fetch(frameSrc(i));
        const blob = await res.blob();
        if ("createImageBitmap" in window) {
          bitmaps[i] = await createImageBitmap(blob);
        } else {
          const img = new Image();
          img.src = URL.createObjectURL(blob);
          await (img.decode ? img.decode() : Promise.resolve());
          bitmaps[i] = img;
        }
      } catch {
        bitmaps[i] = null;
      }
      if (!alive) return;
      if (i === 0 && posterRef.current) {
        draw(currentFrame, true);
        posterRef.current.style.opacity = "0";
      } else if (i === currentFrame && drawnFrame !== currentFrame) {
        draw(currentFrame, true);
      }
    };
    // f_001 first (releases the poster), then the rest in order.
    loadOne(0).then(() => {
      for (let i = 1; i < N; i++) loadOne(i);
    });

    /* ---- dpr-aware sizing ---- */
    let cw = 0, ch = 0;
    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cw = hold.clientWidth;
      ch = hold.clientHeight;
      canvas.width = Math.round(cw * dpr);
      canvas.height = Math.round(ch * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawnFrame = -1;
      draw(currentFrame, true);
    };

    const draw = (i: number, force = false) => {
      if (!force && i === drawnFrame) return;
      const bmp = bitmaps[i];
      if (!bmp) return;
      const iw = "width" in bmp ? bmp.width : 0;
      const ih = "height" in bmp ? bmp.height : 0;
      if (!iw || !ih) return;
      const s = Math.max(cw / iw, ch / ih); // object-fit: cover
      const dw = iw * s, dh = ih * s;
      ctx.fillStyle = "#05070A";
      ctx.fillRect(0, 0, cw, ch);
      ctx.drawImage(bmp, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
      drawnFrame = i;
    };

    /* ---- pin + scrub (VendingScroll pattern) ---- */
    let pinned: string | null = null;
    const setPin = (m: "top" | "fixed" | "bottom") => {
      if (pinned === m) return;
      pinned = m;
      if (m === "fixed") {
        hold.style.position = "fixed";
        hold.style.top = "0";
        hold.style.bottom = "auto";
      } else {
        hold.style.position = "absolute";
        hold.style.top = m === "top" ? "0" : "auto";
        hold.style.bottom = m === "bottom" ? "0" : "auto";
      }
    };

    let lastBeat = -2;
    let lastCta = false;
    let ticking = false;
    const compute = () => {
      ticking = false;
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      if (rect.top <= 0 && rect.bottom >= vh) setPin("fixed");
      else if (rect.bottom < vh) setPin("bottom");
      else setPin("top");

      const total = rect.height - vh;
      const p = Math.max(0, Math.min(1, -rect.top / (total || 1)));

      // THE map. Linear on purpose — see header comment.
      currentFrame = Math.round(p * (N - 1));
      draw(currentFrame);

      // beats (only touch the DOM when the active beat changes)
      let active = -1;
      for (let i = 0; i < BEATS.length; i++) {
        if (p >= BEATS[i].a && p < BEATS[i].b) { active = i; break; }
      }
      if (active !== lastBeat) {
        beatRefs.current.forEach((el, i) => el && el.classList.toggle("on", i === active));
        lastBeat = active;
      }

      // tray light — linear ramp .76 → .89
      if (trayRef.current) {
        const o = Math.max(0, Math.min(1, (p - TRAY_A) / (TRAY_B - TRAY_A)));
        trayRef.current.style.opacity = o.toFixed(3);
      }

      // CTA 2 — dispensed with the can
      const cta = p >= CTA_AT;
      if (cta !== lastCta && ctaRef.current) {
        ctaRef.current.classList.toggle("on", cta);
        lastCta = cta;
      }
    };
    const onScroll = () => {
      if (!ticking) { ticking = true; requestAnimationFrame(compute); }
    };

    let resizeT: ReturnType<typeof setTimeout> | undefined;
    const onResize = () => {
      clearTimeout(resizeT);
      resizeT = setTimeout(() => { size(); compute(); }, 150);
    };

    size();
    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      alive = false;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      clearTimeout(resizeT);
      bitmaps.forEach((b) => { if (b && "close" in b) (b as ImageBitmap).close(); });
    };
  }, []);

  return (
    <section className="act drop" id="fall" ref={sectionRef} aria-label="The drop">
      <div className="hold" ref={holdRef}>
        <canvas ref={canvasRef} aria-hidden="true" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="dp-poster" ref={posterRef} src={POSTER} alt="" aria-hidden="true" />
        <Beat i={0} r={beatRefs}><span className="ar-t">لمسة واحدة</span><span className="en-t">One tap</span></Beat>
        <Beat i={1} r={beatRefs}><span className="ar-t">اللولب يدور</span><span className="en-t">The coil turns</span></Beat>
        <Beat i={2} r={beatRefs}><span className="ar-t">أقل من ثانيتين</span><span className="en-t">Under two seconds</span></Beat>
        <Beat i={3} r={beatRefs}><span className="ar-t">وصلت.</span><span className="en-t">Delivered.</span></Beat>
        <div className="traylight" ref={trayRef} aria-hidden="true" />
        <div className="tray-cta" ref={ctaRef}>
          {/* CTA 2 of 4 — rendered inside the dispense tray, lit by --warm */}
          <a className="cta-warm" href="#demo">
            <span className="ar-t">احجز عرض تجريبي</span>
            <span className="en-t">Book a demo</span>
          </a>
        </div>
      </div>
    </section>
  );
}

function Beat({ i, r, children }: { i: number; r: React.MutableRefObject<(HTMLDivElement | null)[]>; children: React.ReactNode }) {
  return (
    <div className="beat t-beat" ref={(el) => { r.current[i] = el; }}>
      {children}
    </div>
  );
}

/* ------------- <=820px: three stills, zero sequence fetches ------------- */

const M_CARDS = [
  { img: frameSrc(0), cap: [0] },
  { img: frameSrc(34), cap: [1, 2] },
  { img: frameSrc(71), cap: [3] },
];
const CAPS = [
  { ar: "لمسة واحدة", en: "One tap" },
  { ar: "اللولب يدور", en: "The coil turns" },
  { ar: "أقل من ثانيتين", en: "Under two seconds" },
  { ar: "وصلت.", en: "Delivered." },
];

/* A horizontal rail cannot be made to look premium at 390px — at 84% width the
   neighbouring stills bleed off both edges and their captions get sliced
   mid-word, which reads broken rather than designed. So the fall is STACKED on
   mobile: one full-bleed still per screen, its caption beneath it, generous
   rhythm between beats. Same four beats, same order, no scrub, no snap rail. */
function MobileRail() {
  return (
    <section className="act drop-m" id="fall" aria-label="The drop">
      {M_CARDS.map((c, ci) => (
        <figure className={`drop-m-card${ci === 2 ? " last" : ""}`} key={ci}>
          <span className="t-meta drop-m-idx">{String(ci + 1).padStart(2, "0")}</span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={c.img} alt="" loading={ci === 0 ? "eager" : "lazy"} />
          <figcaption>
            {c.cap.map((k) => (
              <span key={k} className="t-beat drop-m-cap">
                <span className="ar-t">{CAPS[k].ar}</span>
                <span className="en-t">{CAPS[k].en}</span>
              </span>
            ))}
          </figcaption>
          {ci === 2 && (
            <>
              <div className="drop-m-glow" aria-hidden="true" />
              <a className="cta-warm drop-m-cta" href="#demo">
                <span className="ar-t">احجز عرض تجريبي</span>
                <span className="en-t">Book a demo</span>
              </a>
            </>
          )}
        </figure>
      ))}
    </section>
  );
}

/* --------------- prefers-reduced-motion: the final frame --------------- */

function StaticFall() {
  return (
    <section className="act drop-static" id="fall" aria-label="The drop">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={frameSrc(71)} alt="" />
      <div className="beat t-beat on">
        <span className="ar-t">وصلت.</span>
        <span className="en-t">Delivered.</span>
      </div>
      <div className="traylight" style={{ opacity: 1 }} aria-hidden="true" />
      <div className="tray-cta on">
        <a className="cta-warm" href="#demo">
          <span className="ar-t">احجز عرض تجريبي</span>
          <span className="en-t">Book a demo</span>
        </a>
      </div>
    </section>
  );
}
