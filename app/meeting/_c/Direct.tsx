"use client";

import { useEffect } from "react";

/**
 * The director.
 *
 * One client island for the whole page. It owns four things and nothing else:
 *
 *   1. the arrival — a `.rdy` class that releases the hero's masked type
 *   2. the reveals — an IntersectionObserver that adds `.in`, once, never removed
 *   3. the scrub  — SCENE 04's 72-frame film, driven by scroll position
 *   4. the meter  — the progress hairline at the top of the window
 *
 * It writes attributes and classes. It never sets React state during scroll, so
 * nothing on this page re-renders while you are moving through it. That is the
 * only reason a full-bleed film, a pinned canvas scrub and a drag interaction
 * can share one page and still hold frame rate on a meeting-room laptop.
 */

const FRAMES = 72;

export default function Direct() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".mt");
    if (!root) return;

    /* ── 1 · Arrival ───────────────────────────────────────────────────────
       Two frames, not zero: the browser must paint the masked state once so
       the transition has something to run from. */
    const raf1 = requestAnimationFrame(() => {
      requestAnimationFrame(() => root.classList.add("rdy"));
    });

    /* ── 2 · Reveals ───────────────────────────────────────────────────── */
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add("in");
          io.unobserve(e.target);
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 },
    );
    root.querySelectorAll(".rv").forEach((el) => io.observe(el));

    /* ── 3 · The film ──────────────────────────────────────────────────────
       Decode every frame up front. 72 WebPs at 1100px is small enough to hold
       in memory and this is the one scene that must never stutter — a scrub
       that drops frames reads as a broken page, not as a slow one. */
    const canvas = root.querySelector<HTMLCanvasElement>(".s4-canvas");
    const scene4 = root.querySelector<HTMLElement>(".s4");
    const ctx = canvas?.getContext("2d", { alpha: false }) ?? null;
    const imgs: HTMLImageElement[] = [];
    let lastFrame = -1;

    if (canvas && ctx) {
      const size = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.round(canvas.clientWidth * dpr);
        canvas.height = Math.round(canvas.clientHeight * dpr);
        lastFrame = -1;
      };
      size();
      window.addEventListener("resize", size);

      /* Cover-fit by hand — canvas has no object-fit. */
      const paint = (i: number) => {
        const img = imgs[i];
        if (!img || !img.complete || i === lastFrame) return;
        lastFrame = i;
        const cw = canvas.width;
        const ch = canvas.height;
        const s = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
        const w = img.naturalWidth * s;
        const h = img.naturalHeight * s;
        ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
      };

      for (let i = 0; i < FRAMES; i += 1) {
        const img = new Image();
        img.decoding = "async";
        img.src = `/assets/flow/seq/f_${String(i + 1).padStart(3, "0")}.webp`;
        img.onload = () => { if (i === 0) paint(0); };
        imgs[i] = img;
      }

      /* Drive from scroll, read once per frame, write once per frame. */
      let ticking = false;
      const onScroll = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          ticking = false;
          if (!scene4) return;
          const r = scene4.getBoundingClientRect();
          const span = r.height - window.innerHeight;
          if (span <= 0) return;
          const p = Math.min(Math.max(-r.top / span, 0), 1);
          if (r.bottom > 0 && r.top < window.innerHeight) {
            paint(Math.min(FRAMES - 1, Math.round(p * (FRAMES - 1))));
            /* The typography lands in the middle third of the pin, once the
               film has established the space it sits in. */
            scene4.setAttribute("data-lit", p > 0.14 && p < 0.93 ? "1" : "0");
          }
        });
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();

      /* ── 4 · The meter ─────────────────────────────────────────────────── */
      const bar = root.querySelector<HTMLElement>(".mt-prog i");
      let pTick = false;
      const onProg = () => {
        if (pTick) return;
        pTick = true;
        requestAnimationFrame(() => {
          pTick = false;
          const max = document.documentElement.scrollHeight - window.innerHeight;
          if (bar) bar.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
        });
      };
      window.addEventListener("scroll", onProg, { passive: true });
      onProg();

      return () => {
        cancelAnimationFrame(raf1);
        io.disconnect();
        window.removeEventListener("resize", size);
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("scroll", onProg);
      };
    }

    return () => {
      cancelAnimationFrame(raf1);
      io.disconnect();
    };
  }, []);

  /* Reduced motion is handled entirely in CSS — the scrub above still runs,
     because a still frame that never changes is worse than a scrubbed one. */
  return null;
}
