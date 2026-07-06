"use client";
import { useEffect, useRef } from "react";
import { DEVICE } from "@/lib/assets/device";

/**
 * Animated hero composition (replaces the old hero background video).
 * Pure CSS/SVG layers: payment-network lines with traveling pulses, orbit
 * rings with transaction particles, the real R.Pay terminal photo, a CSS
 * payment card, a glass live-sales panel and status chips. Pointer parallax
 * is applied through two CSS vars (--px/--py) on the root — every layer picks
 * its own depth via --dp, so the whole scene moves as one 3D-ish system.
 * Decorative only (aria-hidden); numbers echo the real stats section.
 */
export default function HeroVisual() {
  const ref = useRef<HTMLDivElement>(null);

  // Pause the whole composition while the hero is off screen: CSS animations
  // via the .hv-off class (animation-play-state), SMIL pulses via the SVG
  // pause API (SMIL is main-thread-driven and ignores CSS animation rules).
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const svg = el.querySelector<SVGSVGElement>(".hv-net");
    const io = new IntersectionObserver(
      ([entry]) => {
        const off = !entry.isIntersecting;
        el.classList.toggle("hv-off", off);
        try {
          if (svg) { if (off) svg.pauseAnimations(); else svg.unpauseAnimations(); }
        } catch { /* older engines without the SMIL pause API */ }
      },
      { threshold: 0.02 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fine = window.matchMedia("(pointer:fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;
    let raf = 0;
    let tx = 0, ty = 0, cx = 0, cy = 0;
    const onMove = (e: PointerEvent) => {
      tx = (e.clientX / window.innerWidth) * 2 - 1;
      ty = (e.clientY / window.innerHeight) * 2 - 1;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const tick = () => {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      el.style.setProperty("--px", cx.toFixed(4));
      el.style.setProperty("--py", cy.toFixed(4));
      raf = Math.abs(tx - cx) + Math.abs(ty - cy) > 0.002 ? requestAnimationFrame(tick) : 0;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="hv" ref={ref} aria-hidden="true">
      {/* payment network: glowing lines + nodes + traveling pulses (SMIL) */}
      <svg className="hv-net" viewBox="0 0 560 560" fill="none">
        <defs>
          <linearGradient id="hvln" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#00AEEF" stopOpacity="0" />
            <stop offset=".5" stopColor="#00AEEF" stopOpacity=".7" />
            <stop offset="1" stopColor="#1FD3B8" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path id="hvp1" className="hv-ln" d="M34 452 C 150 408, 214 340, 274 292" />
        <path id="hvp2" className="hv-ln" d="M526 428 C 436 380, 356 324, 288 292" />
        <path id="hvp3" className="hv-ln" d="M70 96 C 160 152, 224 216, 272 266" />
        <path id="hvp4" className="hv-ln" d="M500 70 C 424 140, 352 206, 290 264" />
        <g className="hv-nodes">
          <circle cx="34" cy="452" r="4" />
          <circle cx="526" cy="428" r="4" />
          <circle cx="70" cy="96" r="4" />
          <circle cx="500" cy="70" r="4" />
        </g>
        <g className="hv-pulses">
          {/* xlinkHref kept alongside href: older WebKit/Safari only honors
              the xlink form on SMIL animation elements */}
          <circle r="3">
            <animateMotion dur="3.4s" repeatCount="indefinite" rotate="0">
              <mpath href="#hvp1" xlinkHref="#hvp1" />
            </animateMotion>
          </circle>
          <circle r="3">
            <animateMotion dur="4.1s" begin="1.2s" repeatCount="indefinite">
              <mpath href="#hvp2" xlinkHref="#hvp2" />
            </animateMotion>
          </circle>
          <circle r="3">
            <animateMotion dur="3.8s" begin=".6s" repeatCount="indefinite">
              <mpath href="#hvp3" xlinkHref="#hvp3" />
            </animateMotion>
          </circle>
          <circle r="3">
            <animateMotion dur="4.5s" begin="2s" repeatCount="indefinite">
              <mpath href="#hvp4" xlinkHref="#hvp4" />
            </animateMotion>
          </circle>
        </g>
      </svg>

      {/* orbit rings */}
      <div className="hv-orbit o1" data-dp="1"><i /></div>
      <div className="hv-orbit o2" data-dp="1"><i /></div>

      {/* terminal device (real product photo) */}
      <div className="hv-layer hv-device" data-dp="3">
        <span className="hv-halo" />
        <div className="hv-float">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={DEVICE} alt="" draggable={false} />
        </div>
      </div>

      {/* CSS payment card */}
      <div className="hv-layer hv-cardw" data-dp="6">
        <div className="hv-float f2">
          <div className="hv-card" dir="ltr">
            <span className="hv-sheen" />
            <span className="hv-chip" />
            <span className="hv-nfc"><i /><i /><i /></span>
            <b>R.Pay</b>
            <span className="hv-cnum">•••• 4291</span>
          </div>
        </div>
      </div>

      {/* glass live-sales panel */}
      <div className="hv-layer hv-panelw" data-dp="5">
        <div className="hv-float f3">
          <div className="hv-panel">
            <div className="hv-ph">
              <span className="hv-pt"><span className="ar-t">مبيعات مباشرة</span><span className="en-t">Live sales</span></span>
              <span className="hv-live"><i />LIVE</span>
            </div>
            <b className="hv-val" dir="ltr">SAR 24,180</b>
            <svg className="hv-spark" viewBox="0 0 120 34" preserveAspectRatio="none">
              <defs>
                <linearGradient id="hvsg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#00AEEF" stopOpacity=".38" />
                  <stop offset="1" stopColor="#00AEEF" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path className="f" d="M0 26 L14 22 L28 24 L42 15 L56 18 L70 10 L84 13 L98 6 L112 9 L120 4 V34 H0 Z" fill="url(#hvsg)" />
              <path className="l" d="M0 26 L14 22 L28 24 L42 15 L56 18 L70 10 L84 13 L98 6 L112 9 L120 4" />
            </svg>
            <div className="hv-mini">
              <span><i dir="ltr">465K+</i><span className="ar-t">عملية</span><span className="en-t">payments</span></span>
              <span><i>97</i><span className="ar-t">جهاز</span><span className="en-t">devices</span></span>
              <span><i>9</i><span className="ar-t">فروع</span><span className="en-t">branches</span></span>
            </div>
          </div>
        </div>
      </div>

      {/* approved-payment chip (loops) */}
      <div className="hv-layer hv-okw" data-dp="7">
        <div className="hv-ok">
          <i>✓</i>
          <span dir="ltr">SAR 15.00</span>
          <span className="ar-t">دفعة ناجحة</span><span className="en-t">Approved</span>
        </div>
      </div>

      {/* geofence chip */}
      <div className="hv-layer hv-geow" data-dp="4">
        <div className="hv-geo">
          <span className="hv-ping"><i /></span>
          <span className="ar-t">ضمن النطاق الآمن</span><span className="en-t">Inside safe zone</span>
        </div>
      </div>
    </div>
  );
}
