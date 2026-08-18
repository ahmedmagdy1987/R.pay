"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import "./ScrubSequence.css";

/**
 * ScrubSequence — a scroll-driven canvas image sequence.
 *
 * WHY THIS EXISTS: concept 07's mobile fall scrubbed `video.currentTime`.
 * iOS Safari does not seek a compressed stream cheaply — every assignment
 * costs a decode of the nearest keyframe plus everything between, so the
 * picture lands late, out of order, or not at all. There is no <video>
 * anywhere in this component. Frames are independent stills, decoded once
 * to ImageBitmap up front, and blitted with drawImage. Seeking is then an
 * array index, which cannot stall.
 *
 * THE DAMPING. A discrete sequence quantises motion: a 60-frame set over a
 * 500vh pin advances one frame roughly every 65px of scroll, so a fast flick
 * reads as a slideshow. The rAF loop therefore does not snap to the
 * scroll-derived index — it eases toward it, closing `damping` of the
 * remaining distance per tick. Motion stays continuous between frames and
 * the sequence keeps moving for a few frames after the finger lifts, which
 * is what makes it read as film rather than as a filmstrip.
 *
 * ONE SET, EVER. The breakpoint is resolved in useLayoutEffect — before
 * paint, before any fetch — so a phone never touches the desktop frames and
 * a desktop never touches the portrait ones. There is deliberately no live
 * swap on resize: re-downloading a whole set mid-session to serve a window
 * drag is a worse trade than a slightly wrong aspect for the rest of the visit.
 */

export type SeqSet = {
  /** Public directory holding f_001.webp … f_NNN.webp */
  dir: string;
  count: number;
  /** Intrinsic frame size — documentation for the caller, not used for layout. */
  width: number;
  height: number;
};

type Mode = "wide" | "tall" | "static";

type Props = {
  wide: SeqSet;
  tall: SeqSet;
  /** Viewport width at or below which `tall` is used. */
  breakpoint?: number;
  /** Fraction of the remaining index distance closed per animation frame. */
  damping?: number;
  /** Total scroll length of the pinned section, in vh. */
  scrollVh?: number;
  label?: string;
  children?: React.ReactNode;
};

/** Concurrent frame fetches. Enough to saturate a connection, few enough
 *  that frame 1 is never stuck behind 59 others on a slow link. */
const POOL = 6;

const frameSrc = (s: SeqSet, i: number) =>
  `${s.dir}/f_${String(i + 1).padStart(3, "0")}.webp`;

export default function ScrubSequence({
  wide,
  tall,
  breakpoint = 820,
  damping = 0.12,
  scrollVh = 500,
  label = "Scroll sequence",
  children,
}: Props) {
  const rootRef = useRef<HTMLElement>(null);
  const holdRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fillRef = useRef<HTMLElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);
  const loadRef = useRef<HTMLDivElement>(null);
  const modeRef = useRef<Mode | null>(null);

  /* Resolve the set before first paint. This is the whole "never download
     both" guarantee — the fetch loop below cannot start until this has run. */
  useLayoutEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const narrow = window.matchMedia(`(max-width: ${breakpoint}px)`).matches;
    const mode: Mode = reduce ? "static" : narrow ? "tall" : "wide";
    modeRef.current = mode;
    rootRef.current?.setAttribute("data-mode", mode);
  }, [breakpoint]);

  useEffect(() => {
    const root = rootRef.current;
    const hold = holdRef.current;
    const canvas = canvasRef.current;
    const mode = modeRef.current;
    if (!root || !hold || !canvas || !mode) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const set = mode === "tall" ? tall : wide;
    const N = Math.max(1, set.count);
    const t0 = performance.now();

    let alive = true;
    let cur = 0;
    let drawn = -1;
    let draws = 0;
    let loaded = 0;
    let firstDrawn = false;
    let cw = 0;
    let ch = 0;
    let raf = 0;
    let running = false;

    const ac = new AbortController();
    const frames: (ImageBitmap | HTMLImageElement | null)[] = new Array(N).fill(null);
    const objectUrls: string[] = [];

    /* ---------------------------------------------------------------- paint */

    /** Nearest decoded neighbour, so a partially loaded set still tracks
     *  the scroll instead of holding on frame 1. */
    const nearest = (i: number) => {
      if (frames[i]) return i;
      for (let d = 1; d < N; d += 1) {
        if (i - d >= 0 && frames[i - d]) return i - d;
        if (i + d < N && frames[i + d]) return i + d;
      }
      return -1;
    };

    const draw = (want: number, force = false) => {
      const j = nearest(want);
      if (j < 0) return;
      if (!force && j === drawn) return;
      const f = frames[j];
      if (!f) return;
      const iw = f.width;
      const ih = f.height;
      if (!iw || !ih || !cw || !ch) return;

      // cover-fit by hand; canvas has no object-fit
      const s = Math.max(cw / iw, ch / ih);
      const dw = iw * s;
      const dh = ih * s;
      ctx.drawImage(f, (cw - dw) / 2, (ch - dh) / 2, dw, dh);

      drawn = j;
      draws += 1;
      root.dataset.draws = String(draws);

      if (!firstDrawn) {
        firstDrawn = true;
        const tff = Math.round(performance.now() - t0);
        root.dataset.tff = String(tff);
        root.dispatchEvent(
          new CustomEvent("scrubseq:firstframe", { bubbles: true, detail: { tff, mode } }),
        );
      }
    };

    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cw = hold.clientWidth;
      ch = hold.clientHeight;
      canvas.width = Math.round(cw * dpr);
      canvas.height = Math.round(ch * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawn = -1;
      draw(Math.round(cur), true);
    };

    /* -------------------------------------------------------------- preload */

    const progress = () => {
      const total = mode === "static" ? 1 : N;
      const p = Math.round((loaded / total) * 100);
      if (fillRef.current) fillRef.current.style.width = `${p}%`;
      if (pctRef.current) pctRef.current.textContent = `${p}%`;
      root.dataset.loaded = String(loaded);
      if (loaded >= total && loadRef.current) loadRef.current.dataset.done = "1";
    };

    const loadOne = async (i: number) => {
      try {
        const res = await fetch(frameSrc(set, i), { signal: ac.signal });
        if (!res.ok) throw new Error(String(res.status));
        const blob = await res.blob();
        if (!alive) return;
        if (typeof createImageBitmap === "function") {
          frames[i] = await createImageBitmap(blob);
        } else {
          const img = new Image();
          const url = URL.createObjectURL(blob);
          objectUrls.push(url);
          img.src = url;
          if (img.decode) await img.decode();
          frames[i] = img;
        }
      } catch {
        frames[i] = null; // a hole in the set degrades to its neighbour
      }
      if (!alive) return;
      loaded += 1;
      progress();
      const want = Math.round(cur);
      if (!firstDrawn || i === want) draw(want, true);
    };

    /* ------------------------------------------------------- reduced motion */

    if (mode === "static") {
      size();
      void loadOne(N - 1).then(() => {
        if (alive) {
          cur = N - 1;
          draw(N - 1, true);
        }
      });
      const onResizeStatic = () => size();
      window.addEventListener("resize", onResizeStatic);
      return () => {
        alive = false;
        ac.abort();
        window.removeEventListener("resize", onResizeStatic);
        frames.forEach((f) => {
          if (f && "close" in f) f.close();
        });
        objectUrls.forEach((u) => URL.revokeObjectURL(u));
      };
    }

    /* ------------------------------------------------------------ the scrub */

    const targetIndex = () => {
      const r = root.getBoundingClientRect();
      const span = r.height - window.innerHeight;
      const p = span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 0;
      return p * (N - 1);
    };

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const t = targetIndex();
      const d = t - cur;
      cur = Math.abs(d) < 0.0008 ? t : cur + d * damping;
      draw(Math.round(cur));
    };

    const start = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      if (!running) return;
      running = false;
      cancelAnimationFrame(raf);
    };

    // The loop only runs while the pin is on screen. Off screen there is
    // nothing to lerp toward and no reason to hold a rect read every frame.
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) start();
        else stop();
      },
      { threshold: 0 },
    );
    io.observe(root);

    let resizeT: ReturnType<typeof setTimeout> | undefined;
    const onResize = () => {
      clearTimeout(resizeT);
      resizeT = setTimeout(size, 150);
    };
    window.addEventListener("resize", onResize);

    size();
    progress();

    // Frame 1 alone first, so something is on screen at the earliest possible
    // moment; the pool then walks the rest in order behind it.
    let next = 1;
    const pump = async (): Promise<void> => {
      while (alive && next < N) {
        const i = next;
        next += 1;
        await loadOne(i);
      }
    };
    void loadOne(0).then(() => {
      if (!alive) return;
      for (let k = 0; k < POOL; k += 1) void pump();
    });

    return () => {
      alive = false;
      ac.abort();
      stop();
      io.disconnect();
      window.removeEventListener("resize", onResize);
      clearTimeout(resizeT);
      frames.forEach((f) => {
        if (f && "close" in f) f.close();
      });
      objectUrls.forEach((u) => URL.revokeObjectURL(u));
    };
    // Mount-only: the set is chosen once (see the header note on resize).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section
      className="scrubseq"
      ref={rootRef}
      aria-label={label}
      style={{ "--seq-vh": scrollVh } as React.CSSProperties}
    >
      <div className="scrubseq-hold" ref={holdRef}>
        <canvas ref={canvasRef} aria-hidden="true" />
        <div className="scrubseq-load" ref={loadRef} aria-hidden="true">
          <span className="scrubseq-bar">
            <i ref={fillRef} />
          </span>
          <span className="scrubseq-pct" ref={pctRef}>
            0%
          </span>
        </div>
        {children}
      </div>
    </section>
  );
}
