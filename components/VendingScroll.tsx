"use client";
import { useEffect, useRef } from "react";
import { VENDING_VIDEO } from "@/lib/assets/vending";

export default function VendingScroll() {
  const sectionRef = useRef<HTMLElement>(null);
  const holdRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const hold = holdRef.current;
    const video = videoRef.current;
    const overlay = overlayRef.current;
    if (!section || !hold || !video) return;

    let dur = 0;
    let ready = false;
    const onMeta = () => { dur = video.duration || 0; ready = true; compute(); };
    video.addEventListener("loadedmetadata", onMeta);
    video.addEventListener("loadeddata", onMeta);
    try { video.pause(); } catch (e) {}

    let pinned: string | null = null;
    const setPin = (mode: "top" | "fixed" | "bottom") => {
      if (pinned === mode) return;
      pinned = mode;
      if (mode === "fixed") {
        hold.style.position = "fixed";
        hold.style.top = "0";
        hold.style.bottom = "auto";
      } else {
        hold.style.position = "absolute";
        hold.style.top = mode === "top" ? "0" : "auto";
        hold.style.bottom = mode === "bottom" ? "0" : "auto";
      }
    };

    let ticking = false;
    let lastT = -1;
    const compute = () => {
      ticking = false;
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      if (rect.top <= 0 && rect.bottom >= vh) setPin("fixed");
      else if (rect.bottom < vh) setPin("bottom");
      else setPin("top");

      const total = rect.height - vh;
      const p = Math.max(0, Math.min(1, -rect.top / (total || 1)));

      if (ready && dur) {
        const t = p * (dur - 0.05);
        if (Math.abs(t - lastT) > 0.02) {
          lastT = t;
          try { video.currentTime = t; } catch (e) {}
        }
      }
      if (overlay) {
        const o = p < 0.14 ? 1 : Math.max(0, 1 - (p - 0.14) / 0.12);
        overlay.style.opacity = o.toFixed(2);
      }
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(compute); } };

    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      video.removeEventListener("loadedmetadata", onMeta);
      video.removeEventListener("loadeddata", onMeta);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section className="vending" ref={sectionRef} id="showcase">
      <div className="vhold" ref={holdRef}>
        <video
          className="vvideo"
          ref={videoRef}
          src={VENDING_VIDEO}
          muted
          playsInline
          preload="auto"
        />
        <div className="voverlay" ref={overlayRef}>
          <div className="vkicker">
            <span className="ar-t">تجربة الدفع</span>
            <span className="en-t">The payment experience</span>
          </div>
          <h2 className="vtitle">
            <span className="ar-t">لمسة واحدة، <em>وكل شيء يعمل</em></span>
            <span className="en-t">One tap, <em>everything works</em></span>
          </h2>
        </div>
        <div className="vhint">
          <span className="ar-t">مرّر للأسفل</span>
          <span className="en-t">Scroll</span>
          <span className="m"><i /></span>
        </div>
      </div>
    </section>
  );
}
