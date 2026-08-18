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
 * anywhere here. Frames are independent stills blitted with drawImage, so
 * seeking is an array index, which cannot stall.
 *
 * MEMORY — THE SLIDING WINDOW. A decoded ImageBitmap is uncompressed RGBA:
 * 1600x900 costs 5.49 MB whatever the file weighs on disk. Holding a whole
 * set decoded is hundreds of MB and iOS Safari discards the tab. The two
 * caches are therefore split by what they actually cost:
 *
 *   blobs[]  ENCODED bytes. Held while the segment is armed. A few MB.
 *   bmps[]   DECODED bitmaps. At most `behind + ahead + 1` alive, centred on
 *            the current frame, biased in the direction of travel. Eviction
 *            runs BEFORE new decodes start, so the ceiling is a ceiling and
 *            not an average.
 *
 * MEMORY — ACROSS SEGMENTS. A multi-segment page would otherwise hold every
 * segment's caches at once. Instances register in a module-level registry and
 * two rules apply, one per cache: encoded bytes are reclaimed from any segment
 * that is fully off screen (never from one still on screen — see the note on
 * releaseOffScreen), and decoded bitmaps are capped page-wide to a SINGLE
 * window belonging to whichever segment has the most pixels on screen. Peak
 * decoded memory is therefore one window no matter how many segments a page
 * mounts. Re-arming refetches from the HTTP cache, which is free.
 *
 * FORMAT. AVIF where the browser has it, WebP everywhere else. The probe is a
 * 1x1 data URI resolved ONCE per page at module scope — not per segment and
 * certainly not per frame — and every loader awaits the same promise.
 */

export type SeqSet = {
  /** Public directory holding f_001.{avif,webp} … f_NNN.{avif,webp} */
  dir: string;
  count: number;
  width: number;
  height: number;
};

/**
 * Scroll-density curve. `from`/`to` are NORMALISED positions through the
 * sequence (0..1), never frame indices, so one curve describes both breakpoint
 * sets even though they have different frame counts.
 *
 * `weight` scales the scroll distance spent per frame. 0.5 means that stretch
 * consumes half the scroll a default-weight frame does; 1.6 means dense action
 * gets room to read.
 */
export type PacingRange = { from: number; to: number; weight: number };

/** Text that fades in and back out inside a normalised range. */
export type TitleCard = { from: number; to: number; ar: string; en: string };

export type SeqFormat = "auto" | "avif" | "webp";

type Mode = "wide" | "tall" | "static";

type Props = {
  wide: SeqSet;
  tall: SeqSet;
  breakpoint?: number;
  damping?: number;
  scrollVh?: number;
  pacing?: PacingRange[];
  titleCard?: TitleCard;
  behind?: number;
  ahead?: number;
  /** Force a codec. "auto" probes once per page. */
  format?: SeqFormat;
  /** Viewports of runway before the segment arms and starts fetching. */
  preloadVh?: number;
  label?: string;
  children?: React.ReactNode;
};

const FETCH_POOL = 6;
/** Concurrent DECODES. Low, so the window can never overshoot far. */
const DECODE_POOL = 2;

/* ------------------------------------------------------- format detection */

/**
 * 1x1 AVIF probe. If the browser paints it, it can decode our frames.
 *
 * DO NOT swap this for one of the AVIF test strings floating around online
 * without loading it in a browser first. The one this file originally shipped
 * was rejected by Chromium, Chrome, Firefox AND WebKit — a probe that always
 * answers "no" fails silently, and the page would have quietly served WebP to
 * everybody forever while looking like it worked. This string is emitted by
 * libheif (sharp, quality 1, effort 0) and verified to decode in Chromium,
 * Chrome and Firefox, and to be correctly REFUSED by WebKit, which is the
 * fallback path the harness exercises.
 */
const AVIF_1PX =
  "data:image/avif;base64,AAAAHGZ0eXBhdmlmAAAAAG1pZjFhdmlmbWlhZgAAANRtZXRhAAAAAAAAACFoZGxyAAAAAAAAAABwaWN0AAAAAAAAAAAAAAAAAAAAACJpbG9jAAAAAERAAAEAAQAAAAAA+AABAAAAAAAAAB4AAAAjaWluZgAAAAAAAQAAABVpbmZlAgAAAAABAABhdjAxAAAAAA5waXRtAAAAAAABAAAAVGlwcnAAAAA2aXBjbwAAAAxhdjFDgSACAAAAABRpc3BlAAAAAAAAAAEAAAABAAAADnBpeGkAAAAAAQgAAAAWaXBtYQAAAAAAAAABAAEDgQIDAAAAJm1kYXQSAAoHOAAGkBDQaTIRH/JihO////Fn4ACQNY48ftw=";

/* Opt-in arbiter trace: /concepts/lab?trace=1 . Deliberately available on a
   deployed build — the segment bug only reproduced on one. */
const TRACE =
  typeof window !== "undefined" && new URLSearchParams(window.location.search).has("trace");

let avifProbe: Promise<boolean> | null = null;

/** Resolved once per page. Every segment awaits this same promise. */
export function supportsAvif(): Promise<boolean> {
  if (!avifProbe) {
    avifProbe = new Promise<boolean>((resolve) => {
      if (typeof Image === "undefined") {
        resolve(false);
        return;
      }
      const img = new Image();
      img.onload = () => resolve(img.width === 1 && img.height === 1);
      img.onerror = () => resolve(false);
      img.src = AVIF_1PX;
    });
  }
  return avifProbe;
}

/* ------------------------------------------------------- the arbiter ----- */

type Registered = {
  id: string;
  arm: () => void;
  release: () => void;
  rect: () => DOMRect;
  setRunning: (on: boolean) => void;
  trace: (...m: unknown[]) => void;
};
const registry = new Set<Registered>();

/**
 * ONE page-level arbiter, driven by scroll position.
 *
 * THE BUG THIS REPLACES. Arming used to be an IntersectionObserver with a
 * `rootMargin: 100%`, so a segment armed a full viewport BEFORE it was
 * visible — which is the point, the bytes should be there before you arrive.
 * Reclaiming used to take encoded bytes from any segment with zero visible
 * area. Those two rules contradict each other exactly: the segment that just
 * armed early is, by definition, the one not yet on screen, so whichever
 * segment was currently ticking released it within the same frame. Worse,
 * IntersectionObserver is EDGE triggered — the segment was already inside the
 * margin, so no second arm event ever came and it stayed empty forever. Only
 * the segment you happened to load on ever painted.
 *
 * The replacement is level-triggered and continuous: every scroll frame, each
 * segment is measured in pixels from the fold and told what it should be. Two
 * distances with HYSTERESIS between them, which is what stops the oscillation:
 * arm inside one viewport, release only beyond two and a half. A segment
 * cannot be inside the arm band and outside the release band at once, so
 * nothing can arm and be reclaimed in the same breath. Being level-triggered
 * also means a segment scrolled back into view re-arms and refetches by
 * itself — there is no event to miss.
 */
const ARM_VH = 1.0;
const RELEASE_VH = 2.5;

/** Pixels between a rect and the viewport; 0 while any part is on screen. */
function gapPx(r: DOMRect) {
  const vh = window.innerHeight;
  if (r.bottom < 0) return -r.bottom;
  if (r.top > vh) return r.top - vh;
  return 0;
}

function visiblePx(r: DOMRect) {
  return Math.max(0, Math.min(r.bottom, window.innerHeight) - Math.max(r.top, 0));
}

let driverAttached = false;
let driverRaf = 0;
let driverQueued = false;

function arbitrate() {
  driverQueued = false;
  const vh = window.innerHeight || 1;
  let best: Registered | null = null;
  let bestArea = 0;

  registry.forEach((e) => {
    const r = e.rect();
    const gap = gapPx(r);
    const area = visiblePx(r);

    if (gap <= ARM_VH * vh) e.arm();
    else if (gap > RELEASE_VH * vh) e.release();

    // The draw loop follows visibility, not an observer threshold.
    e.setRunning(area > 0);

    if (area > bestArea) {
      bestArea = area;
      best = e;
    }
  });

  primaryOwner = bestArea > 0 ? best : null;
}

/** Whoever currently has the most pixels on screen. Recomputed every frame. */
let primaryOwner: Registered | null = null;
const isPrimary = (me: Registered) => primaryOwner === me;

function scheduleArbitrate() {
  if (driverQueued) return;
  driverQueued = true;
  driverRaf = requestAnimationFrame(arbitrate);
}

function attachDriver() {
  if (driverAttached) return;
  driverAttached = true;
  addEventListener("scroll", scheduleArbitrate, { passive: true });
  addEventListener("resize", scheduleArbitrate);
  arbitrate();
}

function detachDriver() {
  if (!driverAttached || registry.size) return;
  driverAttached = false;
  removeEventListener("scroll", scheduleArbitrate);
  removeEventListener("resize", scheduleArbitrate);
  cancelAnimationFrame(driverRaf);
  driverQueued = false;
  primaryOwner = null;
}

/* -------------------------------------------------------------- decoding */

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

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

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
  format = "auto",
  preloadVh = 1,
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
    const SID = set.dir.split("/").slice(-2, -1)[0] ?? label;
    const tr = (...m: unknown[]) => {
      if (TRACE) console.log(`[seq] ${SID} y=${Math.round(window.scrollY)}`, ...m);
    };

    let alive = true;
    let armed = false;
    let t0 = 0;
    let ext: SeqFormat = format === "auto" ? "webp" : format;
    let cur = 0;
    let lastC = -1;
    let wasPrimary = false;
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
    let ac = new AbortController();
    let poster: HTMLImageElement | null = null;
    /* Assigned at registration in both the static and scrub paths, so async
       work started earlier can ask whether this segment still owns the window. */
    let selfReg: Registered | null = null;
    const ownsWindow = () => mode === "static" || (selfReg !== null && isPrimary(selfReg));

    let blobs: (Blob | null)[] = new Array(N).fill(null);
    const bmps: (Decoded | null)[] = new Array(N).fill(null);
    const inflight = new Set<number>();

    const w = window as unknown as { __scrubLive?: number; __scrubPeak?: number };
    w.__scrubLive = w.__scrubLive ?? 0;
    w.__scrubPeak = w.__scrubPeak ?? 0;

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

    const frameSrc = (i: number) => `${set.dir}/f_${String(i + 1).padStart(3, "0")}.${ext}`;

    /* ------------------------------------------------------- pacing curve */

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

    /* --------------------------------------------------------------- paint */

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

      const s = Math.max(cw / f.width, ch / f.height);
      const dw = f.width * s;
      const dh = f.height * s;
      ctx.drawImage(f.src, (cw - dw) / 2, (ch - dh) / 2, dw, dh);

      drawn = j;
      draws += 1;
      root.dataset.draws = String(draws);
      if (root.dataset.poster) delete root.dataset.poster;

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
          new CustomEvent("scrubseq:firstframe", { bubbles: true, detail: { tff, mode, ext } }),
        );
      }
    };

    /** Blit an image straight to the canvas, cover-fit. Used by the poster,
     *  which must be able to paint before a single ImageBitmap exists. */
    const blit = (src: CanvasImageSource, w: number, h: number) => {
      if (!w || !h || !cw || !ch) return false;
      const s = Math.max(cw / w, ch / h);
      ctx.drawImage(src, (cw - w * s) / 2, (ch - h * s) / 2, w * s, h * s);
      return true;
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
        const outEnd = from + span * 0.86;
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
        /* Ownership can move while a decode is in flight. Keeping the result
           anyway was a real leak: the segment then stops its loop on going off
           screen, so no later maintain() ever evicts it and the page carried
           two partial windows — 93 MB on mobile against a 66 MB ceiling. */
        if (!alive || !armed || !inWindow(i) || bmps[i] || !ownsWindow()) {
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

    const evictAll = () => {
      for (let i = 0; i < N; i += 1) {
        if (bmps[i]) {
          bmps[i]!.close();
          bmps[i] = null;
          bumpLive(-1);
        }
      }
      drawn = -1;
    };

    const maintain = (c: number) => {
      // Only the segment with the most pixels on screen may hold decoded
      // frames. This is what keeps peak memory at one window rather than one
      // window per segment during a hand-over.
      if (!isPrimary(me)) {
        if (live > 0) tr("LOSE OWNERSHIP -> evict", live, "bitmaps");
        evictAll();
        return;
      }

      winLo = Math.max(0, lastDir >= 0 ? c - behind : c - ahead);
      winHi = Math.min(N - 1, lastDir >= 0 ? c + ahead : c + behind);

      for (let i = 0; i < N; i += 1) {
        if (bmps[i] && !inWindow(i)) {
          bmps[i]!.close();
          bmps[i] = null;
          bumpLive(-1);
        }
      }

      if (!armed || inflight.size >= DECODE_POOL) return;
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

    /* ------------------------------------------------------------- fetch */

    const progress = () => {
      const totalFrames = mode === "static" ? 1 : N;
      const p = Math.round((fetched / totalFrames) * 100);
      if (fillRef.current) fillRef.current.style.width = `${p}%`;
      if (pctRef.current) pctRef.current.textContent = `${p}%`;
      root.dataset.loaded = String(fetched);
      if (loadRef.current) loadRef.current.dataset.done = fetched >= totalFrames ? "1" : "0";
    };

    const fetchOne = async (i: number) => {
      try {
        const res = await fetch(frameSrc(i), { signal: ac.signal });
        if (!res.ok) throw new Error(String(res.status));
        const blob = await res.blob();
        if (!alive || !armed) return;
        blobs[i] = blob;
      } catch {
        blobs[i] = null;
      }
      if (!alive || !armed) return;
      fetched += 1;
      progress();
      if (inWindow(i) && !bmps[i] && inflight.size < DECODE_POOL) void decode(i);
    };

    /* --------------------------------------------- arm / release residency */

    const release = () => {
      if (!armed) return;
      tr("RELEASE  (had", fetched, "blobs,", live, "bitmaps)");
      armed = false;
      ac.abort();
      ac = new AbortController();
      inflight.clear();
      for (let i = 0; i < N; i += 1) {
        if (bmps[i]) {
          bmps[i]!.close();
          bmps[i] = null;
          bumpLive(-1);
        }
      }
      /* The canvas is deliberately NOT cleared. Whatever was last painted
         stays until a real frame replaces it, so a reclaimed segment scrolled
         back into view shows a stale picture rather than a hole. */
      blobs = new Array(N).fill(null);
      poster = null;
      fetched = 0;
      drawn = -1;
      lastC = -1;
      progress();
      root.dataset.armed = "0";
    };

    const arm = () => {
      if (armed || !alive) return;
      tr("ARM");
      armed = true;
      t0 = performance.now();
      root.dataset.armed = "1";

      void (async () => {
        const useAvif = format === "auto" ? await supportsAvif() : format === "avif";
        if (!alive || !armed) return;
        ext = useAvif ? "avif" : "webp";
        root.dataset.fmt = ext;

        /* Poster. The gap between arming and the first decoded frame is a
           black canvas, and a segment the reader has just scrolled into must
           never be black. This is the set's own frame 1 through a plain <img>,
           so it shares the cache entry the blob fetch is about to make and
           costs nothing extra. It only ever paints if no real frame has. */
        if (!firstDrawn && !poster) {
          poster = new Image();
          poster.decoding = "async";
          poster.onload = () => {
            if (!alive || firstDrawn || !poster) return;
            if (blit(poster, poster.naturalWidth, poster.naturalHeight)) {
              tr("poster painted");
              root.dataset.poster = "1";
            }
          };
          poster.src = frameSrc(0);
        }

        if (mode === "static") {
          winLo = N - 1;
          winHi = N - 1;
          await fetchOne(N - 1);
          if (!alive || !armed) return;
          cur = N - 1;
          void decode(N - 1);
          return;
        }

        maintain(Math.round(cur));
        let next = 1;
        const pump = async (): Promise<void> => {
          while (alive && armed && next < N) {
            const i = next;
            next += 1;
            await fetchOne(i);
          }
        };
        await fetchOne(0);
        if (!alive || !armed) return;
        for (let k = 0; k < FETCH_POOL; k += 1) void pump();
      })();
    };

    /* No arm observer. The page-level arbiter arms and releases on continuous
       scroll position with hysteresis — see the note above `arbitrate`. */

    /* -------------------------------------------------------- static path */

    if (mode === "static") {
      const me: Registered = {
        id: SID,
        arm: () => arm(),
        release,
        rect: () => root.getBoundingClientRect(),
        setRunning: () => {}, // nothing animates under reduced motion
        trace: tr,
      };
      selfReg = me;
      registry.add(me);
      attachDriver();

      size();
      progress();
      const onResizeStatic = () => size();
      window.addEventListener("resize", onResizeStatic);
      return () => {
        alive = false;
        registry.delete(me);
        detachDriver();
        window.removeEventListener("resize", onResizeStatic);
        ac.abort();
        for (let i = 0; i < N; i += 1) {
          if (bmps[i]) {
            bmps[i]!.close();
            bmps[i] = null;
            bumpLive(-1);
          }
        }
        blobs = [];
      };
    }

    /* ---------------------------------------------------------- the scrub */

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
      const primary = isPrimary(me);
      if (primary !== wasPrimary) tr(primary ? "GAIN OWNERSHIP" : "lost ownership");
      if (c !== lastC || primary !== wasPrimary) {
        lastC = c;
        wasPrimary = primary;
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
      /* Off screen means no window. The canvas is not cleared, so the last
         picture stays up if the reader scrolls back before frames return. */
      if (live > 0) {
        tr("stop -> evict", live, "bitmaps");
        evictAll();
      }
    };

    /* Registered only now that `start`/`stop` exist — the arbiter calls
       setRunning synchronously on attach, and hoisting would hit the TDZ. */
    const me: Registered = {
      id: SID,
      arm: () => arm(),
      release,
      rect: () => root.getBoundingClientRect(),
      setRunning: (on) => (on ? start() : stop()),
      trace: tr,
    };
    selfReg = me;
    registry.add(me);
    attachDriver();


    let resizeT: ReturnType<typeof setTimeout> | undefined;
    const onResize = () => {
      clearTimeout(resizeT);
      resizeT = setTimeout(size, 150);
    };
    window.addEventListener("resize", onResize);

    size();
    progress();

    return () => {
      alive = false;
      armed = false;
      ac.abort();
      stop();
      registry.delete(me);
      detachDriver();
      window.removeEventListener("resize", onResize);
      clearTimeout(resizeT);
      inflight.clear();
      for (let i = 0; i < N; i += 1) {
        if (bmps[i]) {
          bmps[i]!.close();
          bmps[i] = null;
          bumpLive(-1);
        }
      }
      blobs = [];
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
