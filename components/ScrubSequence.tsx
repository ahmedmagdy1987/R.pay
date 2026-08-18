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
 * anywhere in this component. Frames are independent stills blitted with
 * drawImage, so seeking is an array index, which cannot stall.
 *
 * MEMORY — THE SLIDING WINDOW. A decoded ImageBitmap is uncompressed RGBA:
 * 1600x900 is 5.76 MB whatever the WebP on disk weighs. Holding a whole
 * 40-frame set decoded is ~230 MB resident, and six segments of that is
 * gigabytes — iOS Safari discards the tab long before you get there. So the
 * two caches are split by cost:
 *
 *   blobs[]  — the ENCODED bytes. Fetched once, held for the whole visit.
 *              A 60-frame set is a few MB. Never evicted; refetching on a
 *              scroll reversal would be far worse than the memory.
 *   bmps[]   — the DECODED bitmaps. At most `behind + ahead + 1` alive at
 *              any moment, centred on the current frame and biased in the
 *              direction of travel. Anything leaving the window is closed
 *              immediately, and eviction runs BEFORE new decodes start so
 *              the ceiling is a ceiling and not an average.
 *
 * A decode that finishes after the window has moved past its frame is closed
 * on arrival rather than stored. On a window miss the canvas draws the
 * nearest bitmap it still holds — a slightly stale frame reads as motion
 * blur, whereas blanking reads as a bug.
 *
 * THE DAMPING. A discrete sequence quantises motion: 60 frames over a 500vh
 * pin advances one frame per ~65px of scroll, so a fast flick reads as a
 * slideshow. The rAF loop eases toward the scroll-derived index instead of
 * snapping to it, and keeps moving for a few frames after the finger lifts.
 *
 * ONE SET, EVER. The breakpoint resolves in useLayoutEffect — before paint,
 * before any fetch — so a phone never touches the desktop frames.
 */

export type SeqSet = {
  /** Public directory holding f_001.webp … f_NNN.webp */
  dir: string;
  count: number;
  width: number;
  height: number;
};

/**
 * Scroll-density curve. `from`/`to` are NORMALISED positions through the
 * sequence (0..1), never frame indices, so a single curve describes both
 * breakpoint sets even though they have different frame counts.
 *
 * `weight` scales the scroll distance spent per frame. 0.5 means that stretch
 * consumes half the scroll a default-weight frame does — which is how a dead
 * passage (cloud interior, a hold, a dissolve) stops eating screen-heights of
 * the reader's attention for nothing.
 */
export type PacingRange = { from: number; to: number; weight: number };

/** Text that fades in and back out inside a normalised range. */
export type TitleCard = { from: number; to: number; ar: string; en: string };

type Mode = "wide" | "tall" | "static";

type Props = {
  wide: SeqSet;
  tall: SeqSet;
  breakpoint?: number;
  damping?: number;
  scrollVh?: number;
  /** Per-segment scroll-density curve. Omit for linear. */
  pacing?: PacingRange[];
  titleCard?: TitleCard;
  /** Decoded frames kept behind / ahead of the current index. */
  behind?: number;
  ahead?: number;
  label?: string;
  children?: React.ReactNode;
};

/** Concurrent frame FETCHES (encoded bytes). */
const FETCH_POOL = 6;
/** Concurrent DECODES. Kept low so the window can never overshoot far. */
const DECODE_POOL = 2;

const frameSrc = (s: SeqSet, i: number) =>
  `${s.dir}/f_${String(i + 1).padStart(3, "0")}.webp`;

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

/** Uniform handle over ImageBitmap and the <img> fallback, so the window
 *  logic never branches on which decode path produced a frame. */
type Decoded = {
  src: CanvasImageSource;
  width: number;
  height: number;
  close: () => void;
};

async function decodeBlob(blob: Blob): Promise<Decoded> {
  if (typeof createImageBitmap === "function") {
    const b = await createImageBitmap(blob);
    return { src: b, width: b.width, height: b.height, close: () => b.close() };
  }
  const url = URL.createObjectURL(blob);
  const img = new Image();
  img.src = url;
  if (img.decode) await img.decode();
  return {
    src: img,
    width: img.naturalWidth,
    height: img.naturalHeight,
    close: () => URL.revokeObjectURL(url),
  };
}

export default function ScrubSequence({
  wide,
  tall,
  breakpoint = 820,
  damping = 0.12,
  scrollVh = 500,
  pacing,
  titleCard,
  behind = 4,
  ahead = 7,
  label = "Scroll sequence",
  children,
}: Props) {
  const rootRef = useRef<HTMLElement>(null);
  const holdRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fillRef = useRef<HTMLElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);
  const loadRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const modeRef = useRef<Mode | null>(null);

  /* Resolve the set before first paint. This is the whole "never download
     both" guarantee — the fetch loop cannot start until this has run. */
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
    let lastC = -1;
    let lastDir = 1;
    let drawn = -1;
    let draws = 0;
    let fetched = 0;
    let firstDrawn = false;
    let dimsReported = false;
    let cw = 0;
    let ch = 0;
    let raf = 0;
    let running = false;
    let live = 0;
    let peak = 0;
    let lastTitleOpacity = -1;

    const ac = new AbortController();
    const blobs: (Blob | null)[] = new Array(N).fill(null);
    const bmps: (Decoded | null)[] = new Array(N).fill(null);
    const inflight = new Set<number>();

    /* ------------------------------------------------- live-bitmap counter */

    /* Mirrored onto window so a harness can assert full release AFTER the
       component has unmounted, when the element and its data-* are gone. */
    const w = window as unknown as { __scrubLive?: number; __scrubPeak?: number };
    const bumpLive = (delta: number) => {
      live += delta;
      if (live > peak) {
        peak = live;
        root.dataset.peak = String(peak);
      }
      root.dataset.live = String(live);
      w.__scrubLive = (w.__scrubLive ?? 0) + delta;
      if ((w.__scrubPeak ?? 0) < (w.__scrubLive ?? 0)) w.__scrubPeak = w.__scrubLive;
    };
    w.__scrubLive = w.__scrubLive ?? 0;
    w.__scrubPeak = w.__scrubPeak ?? 0;

    /* ------------------------------------------------------- pacing curve */

    /* Cumulative scroll position of every frame. A frame's weight scales the
       scroll distance of the steps either side of it; the table is inverted
       at read time so p -> frame stays continuous and the damping still has
       something smooth to chase. */
    const cum = new Float64Array(N);
    {
      const weight = new Float64Array(N).fill(1);
      if (pacing) {
        for (const r of pacing) {
          const lo = Math.round(clamp01(Math.min(r.from, r.to)) * (N - 1));
          const hi = Math.round(clamp01(Math.max(r.from, r.to)) * (N - 1));
          for (let i = lo; i <= hi; i += 1) weight[i] = Math.max(0.01, r.weight);
        }
      }
      let acc = 0;
      for (let i = 1; i < N; i += 1) {
        acc += (weight[i - 1] + weight[i]) / 2;
        cum[i] = acc;
      }
    }
    const total = cum[N - 1] || 1;

    const frameAt = (p: number) => {
      const x = clamp01(p) * total;
      let lo = 0;
      let hi = N - 1;
      while (lo < hi - 1) {
        const mid = (lo + hi) >> 1;
        if (cum[mid] <= x) lo = mid;
        else hi = mid;
      }
      const span = cum[hi] - cum[lo];
      return span > 0 ? lo + (x - cum[lo]) / span : lo;
    };

    /* ---------------------------------------------------------------- paint */

    /** Nearest bitmap still held, so a window miss shows a stale frame
     *  instead of blanking the canvas. */
    const nearest = (i: number) => {
      if (bmps[i]) return i;
      for (let d = 1; d < N; d += 1) {
        if (i - d >= 0 && bmps[i - d]) return i - d;
        if (i + d < N && bmps[i + d]) return i + d;
      }
      return -1;
    };

    const draw = (want: number, force = false) => {
      const j = nearest(want);
      if (j < 0) return;
      if (!force && j === drawn) return;
      const f = bmps[j];
      if (!f || !f.width || !f.height || !cw || !ch) return;

      const s = Math.max(cw / f.width, ch / f.height); // cover-fit by hand
      const dw = f.width * s;
      const dh = f.height * s;
      ctx.drawImage(f.src, (cw - dw) / 2, (ch - dh) / 2, dw, dh);

      drawn = j;
      draws += 1;
      root.dataset.draws = String(draws);

      if (!dimsReported) {
        dimsReported = true;
        root.dataset.bmw = String(f.width);
        root.dataset.bmh = String(f.height);
      }
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

    /* --------------------------------------------------------- title card */

    const paintTitle = (f: number) => {
      const el = titleRef.current;
      if (!el || !titleCard) return;
      const pos = N > 1 ? f / (N - 1) : 0;
      const { from, to } = titleCard;
      const span = to - from;
      let o = 0;
      if (span > 0 && pos > from) {
        const inEnd = from + span * 0.22;
        const outStart = from + span * 0.6;
        const outEnd = from + span * 0.86; // fully gone before the range ends
        if (pos < inEnd) o = (pos - from) / (inEnd - from);
        else if (pos < outStart) o = 1;
        else if (pos < outEnd) o = 1 - (pos - outStart) / (outEnd - outStart);
      }
      o = clamp01(o);
      if (Math.abs(o - lastTitleOpacity) < 0.004) return;
      lastTitleOpacity = o;
      el.style.opacity = o.toFixed(3);
      el.style.transform = `translateY(${((1 - o) * 10).toFixed(2)}px)`;
    };

    /* ------------------------------------------------------ decode window */

    let winLo = 0;
    let winHi = 0;
    const inWindow = (i: number) => i >= winLo && i <= winHi;

    const decode = async (i: number) => {
      if (bmps[i] || inflight.has(i)) return;
      const blob = blobs[i];
      if (!blob) return;
      inflight.add(i);
      try {
        const d = await decodeBlob(blob);
        // The window may have moved past this frame while it was decoding.
        if (!alive || !inWindow(i) || bmps[i]) {
          d.close();
          return;
        }
        bmps[i] = d;
        bumpLive(1);
        if (!firstDrawn || Math.round(cur) === i) draw(Math.round(cur), true);
        else draw(Math.round(cur));
      } catch {
        /* leave the hole — nearest() covers it */
      } finally {
        inflight.delete(i);
      }
    };

    const maintain = (c: number) => {
      winLo = Math.max(0, lastDir >= 0 ? c - behind : c - ahead);
      winHi = Math.min(N - 1, lastDir >= 0 ? c + ahead : c + behind);

      // Evict FIRST, so the live count is a ceiling rather than an average.
      for (let i = 0; i < N; i += 1) {
        if (bmps[i] && !inWindow(i)) {
          bmps[i]!.close();
          bmps[i] = null;
          bumpLive(-1);
        }
      }

      if (inflight.size >= DECODE_POOL) return;
      // Current frame first, then outward, leading edge before trailing.
      const order: number[] = [c];
      const reach = Math.max(behind, ahead);
      for (let d = 1; d <= reach; d += 1) {
        const lead = lastDir >= 0 ? c + d : c - d;
        const trail = lastDir >= 0 ? c - d : c + d;
        if (inWindow(lead)) order.push(lead);
        if (inWindow(trail)) order.push(trail);
      }
      for (const i of order) {
        if (inflight.size >= DECODE_POOL) break;
        if (!bmps[i] && blobs[i] && !inflight.has(i)) void decode(i);
      }
    };

    /* ------------------------------------------------- fetch encoded bytes */

    const progress = () => {
      const totalFrames = mode === "static" ? 1 : N;
      const p = Math.round((fetched / totalFrames) * 100);
      if (fillRef.current) fillRef.current.style.width = `${p}%`;
      if (pctRef.current) pctRef.current.textContent = `${p}%`;
      root.dataset.loaded = String(fetched);
      if (fetched >= totalFrames && loadRef.current) loadRef.current.dataset.done = "1";
    };

    const fetchOne = async (i: number) => {
      try {
        const res = await fetch(frameSrc(set, i), { signal: ac.signal });
        if (!res.ok) throw new Error(String(res.status));
        const blob = await res.blob();
        if (!alive) return;
        blobs[i] = blob;
      } catch {
        blobs[i] = null;
      }
      if (!alive) return;
      fetched += 1;
      progress();
      // Decode it now only if it is inside the live window.
      if (inWindow(i) && !bmps[i] && inflight.size < DECODE_POOL) void decode(i);
    };

    /* ------------------------------------------------------- reduced motion */

    if (mode === "static") {
      size();
      winLo = N - 1;
      winHi = N - 1;
      void fetchOne(N - 1).then(() => {
        if (!alive) return;
        cur = N - 1;
        void decode(N - 1);
      });
      const onResizeStatic = () => size();
      window.addEventListener("resize", onResizeStatic);
      return () => {
        alive = false;
        ac.abort();
        window.removeEventListener("resize", onResizeStatic);
        for (let i = 0; i < N; i += 1) {
          if (bmps[i]) {
            bmps[i]!.close();
            bmps[i] = null;
            bumpLive(-1);
          }
        }
      };
    }

    /* ------------------------------------------------------------ the scrub */

    const targetIndex = () => {
      const r = root.getBoundingClientRect();
      const span = r.height - window.innerHeight;
      const p = span > 0 ? clamp01(-r.top / span) : 0;
      return frameAt(p);
    };

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const t = targetIndex();
      const d = t - cur;
      if (Math.abs(d) > 0.0008) lastDir = d > 0 ? 1 : -1;
      cur = Math.abs(d) < 0.0008 ? t : cur + d * damping;
      const c = Math.round(cur);
      if (c !== lastC) {
        lastC = c;
        maintain(c);
      }
      draw(c);
      paintTitle(cur);
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

    // The loop only runs while the pin is on screen.
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
    maintain(0);

    // Frame 1 alone first so something paints at the earliest moment; the
    // pool then walks the rest in order behind it.
    let next = 1;
    const pump = async (): Promise<void> => {
      while (alive && next < N) {
        const i = next;
        next += 1;
        await fetchOne(i);
      }
    };
    void fetchOne(0).then(() => {
      if (!alive) return;
      for (let k = 0; k < FETCH_POOL; k += 1) void pump();
    });

    return () => {
      alive = false;
      ac.abort();
      stop();
      io.disconnect();
      window.removeEventListener("resize", onResize);
      clearTimeout(resizeT);
      inflight.clear();
      for (let i = 0; i < N; i += 1) {
        if (bmps[i]) {
          bmps[i]!.close();
          bmps[i] = null;
          bumpLive(-1);
        }
        blobs[i] = null;
      }
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

        {titleCard && (
          <div className="scrubseq-title" ref={titleRef} style={{ opacity: 0 }}>
            <span className="ar-t">{titleCard.ar}</span>
            <span className="en-t">{titleCard.en}</span>
          </div>
        )}

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
