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
/* Raised from 2 on 2026-08-20. This is decode CONCURRENCY, not window size:
   the sliding window still caps decoded bitmaps at behind+ahead+1, so peak
   memory is unchanged. At 2 the refill could not keep up with the draw rate
   and the scrub fell back on a neighbouring frame — measured 85 such misses
   across a four-direction sweep of segment B. */
const DECODE_POOL = 4;

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

/**
 * LOW-MEMORY TIER. Sampling every other frame from the sets already on disk —
 * no re-encode, no new bytes in git — and halving the decode window. Triggered
 * by navigator.deviceMemory <= 4, or ?lite=1 to test it by hand. deviceMemory
 * is Chromium-only and absent on Safari, which is exactly the browser we
 * cannot measure, so the query param is the honest lever for iOS.
 */
let liteMemo: boolean | null = null;
export function isLite(): boolean {
  if (liteMemo !== null) return liteMemo;
  if (typeof window === "undefined") return false;
  const q = new URLSearchParams(window.location.search).get("lite");
  if (q === "1" || q === "0") liteMemo = q === "1";
  else {
    const dm = (navigator as unknown as { deviceMemory?: number }).deviceMemory;
    liteMemo = typeof dm === "number" && dm <= 4;
  }
  return liteMemo;
}

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
  /** Tab going away: drop every decoded bitmap, keep the encoded bytes. */
  onHide: () => void;
  /** Tab back: repaint from whatever is at hand before decoding resumes. */
  onShow: () => void;
  trace: (...m: unknown[]) => void;
};
const registry = new Set<Registered>();

/**
 * Fetch-warm the first `count` segments regardless of where the reader is.
 * The intro overlay uses this so segment A is fully decoded before the film is
 * ever shown, and B is already arriving behind it — otherwise the first scrub
 * is a fetch, and it stutters.
 */
export function warmSegments(count = 2) {
  let i = 0;
  registry.forEach((e) => {
    if (i < count) e.arm();
    i += 1;
  });
}

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

/**
 * A VIEWPORT HEIGHT THAT DOES NOT MOVE WHEN THE TOOLBAR DOES.
 *
 * The frame index comes from `sectionHeight - viewportHeight`. Read live,
 * that denominator changes every time iOS Safari collapses or restores its
 * URL bar — the reader has not moved, but the film jumps. Measured against
 * HEAD before this existed: a 110px height change with zero scrolling moved
 * segment B by 18 frames out of 60, and reversed direction on the way back.
 *
 * So the height is measured once and held. A resize that keeps the width and
 * moves the height by less than a toolbar's worth is discarded outright — that
 * signature is chrome, not a new viewport. Anything larger is a real resize,
 * and even then it is committed only once scrolling has stopped, so a gesture
 * is never retargeted underneath the reader.
 */
const TOOLBAR_PX = 120;
let vpW = 0;
let vpH = 0;
let vpPending = 0;
let vpCommitT: ReturnType<typeof setTimeout> | undefined;
let lastScrollAt = 0;

function stableVH() {
  if (vpH) return vpH;
  return typeof window === "undefined" ? 0 : window.innerHeight;
}

function commitViewport() {
  // Never change the denominator in the middle of a gesture.
  if (performance.now() - lastScrollAt < 160) {
    vpCommitT = setTimeout(commitViewport, 120);
    return;
  }
  if (vpPending) {
    vpH = vpPending;
    vpPending = 0;
    arbitrate();
  }
}

function onViewportChange() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  if (w === vpW && Math.abs(h - vpH) < TOOLBAR_PX) return; // toolbar, not a resize
  vpW = w;
  vpPending = h;
  clearTimeout(vpCommitT);
  vpCommitT = setTimeout(commitViewport, 200);
}

/* ── tier probe ────────────────────────────────────────────────────────────
   navigator.deviceMemory does not exist in Safari, so the low-memory tier
   could never auto-arm on the one device that most needs it. Instead of
   sniffing the UA, time the decoder: whatever the cause — a slow device, a
   slow AVIF path, thermal throttling — a decoder that cannot keep a window
   fed shows up the same way.

   THRESHOLD 120ms, median of the first two decodes. Derived from both ends:
     · measured healthy engines — Chromium desktop 20.6ms, Chromium mobile
       22.1ms, WebKit 41.5ms — so 120ms is 2.9x the slowest one and will not
       trip on a healthy-but-busy device;
     · at DECODE_POOL 2, refill runs at 2000/median frames per second, and a
       brisk scrub of a 60-frame segment demands about 9/s. Starvation begins
       around 200ms. 120ms sits inside that gap with room on both sides. */
const DECODE_SLOW_MS = 120;
let tierProbed = false;

function considerTier(medianMs: number) {
  if (tierProbed || liteMemo === true) return;
  tierProbed = true;
  if (medianMs <= DECODE_SLOW_MS) return;
  liteMemo = true;
  dispatchEvent(
    new CustomEvent("scrubseq:tier", { detail: { lite: true, medianMs } }),
  );
}

/** Pixels between a rect and the viewport; 0 while any part is on screen. */
function gapPx(r: DOMRect) {
  const vh = stableVH();
  if (r.bottom < 0) return -r.bottom;
  if (r.top > vh) return r.top - vh;
  return 0;
}

function visiblePx(r: DOMRect) {
  return Math.max(0, Math.min(r.bottom, stableVH()) - Math.max(r.top, 0));
}

let driverAttached = false;
let driverRaf = 0;
let driverQueued = false;

function arbitrate() {
  driverQueued = false;
  const vh = stableVH() || 1;
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
  lastScrollAt = performance.now();
  if (driverQueued) return;
  driverQueued = true;
  driverRaf = requestAnimationFrame(arbitrate);
}

/**
 * SURVIVING A DISCARDED TAB.
 *
 * iOS Safari throws backgrounded tabs away under memory pressure and rebuilds
 * them on return, and a rebuilt page can come back with a blank canvas and no
 * event to tell you. Two halves to the defence, and only the first is testable
 * here: shed the expensive half of the cache the moment we are hidden so the
 * tab is a smaller target, and repaint from something — anything — the instant
 * we are visible again rather than waiting on a decode.
 *
 * Decoded bitmaps go. Encoded blobs stay: they are ~1% of the memory and
 * refetching them on every tab switch would be its own bug.
 */
const SCROLL_KEY = "rpay-scrub-y";

function saveScroll() {
  try {
    sessionStorage.setItem(SCROLL_KEY + location.pathname, String(Math.round(window.scrollY)));
  } catch {
    /* private mode, quota — losing the position is not worth throwing over */
  }
}

/** Put a restored tab back where the reader left it. */
function restoreScroll() {
  try {
    const v = Number(sessionStorage.getItem(SCROLL_KEY + location.pathname));
    // Only if the browser has not already restored a position itself.
    if (v > 0 && window.scrollY === 0) {
      window.scrollTo(0, v);
      return v;
    }
  } catch {
    /* ignore */
  }
  return 0;
}

function goHidden() {
  saveScroll();
  registry.forEach((e) => e.onHide());
}

function goVisible() {
  registry.forEach((e) => e.onShow());
  arbitrate();
}

function onVisibility() {
  if (document.visibilityState === "hidden") goHidden();
  else goVisible();
}

function attachDriver() {
  if (driverAttached) return;
  driverAttached = true;
  vpW = window.innerWidth;
  vpH = window.innerHeight;
  addEventListener("scroll", scheduleArbitrate, { passive: true });
  addEventListener("resize", onViewportChange);
  addEventListener("orientationchange", onViewportChange);
  document.addEventListener("visibilitychange", onVisibility);
  addEventListener("pagehide", goHidden);
  addEventListener("pageshow", goVisible);
  /* A seam for the harness: there is no way to make a real browser discard a
     tab on command, so the test drives the same code path directly. */
  (window as unknown as { __scrubForceDiscard?: () => void }).__scrubForceDiscard = goHidden;
  (window as unknown as { __scrubForceRestore?: () => void }).__scrubForceRestore = goVisible;
  restoreScroll();
  arbitrate();
}

function detachDriver() {
  if (!driverAttached || registry.size) return;
  driverAttached = false;
  removeEventListener("scroll", scheduleArbitrate);
  removeEventListener("resize", onViewportChange);
  removeEventListener("orientationchange", onViewportChange);
  document.removeEventListener("visibilitychange", onVisibility);
  removeEventListener("pagehide", goHidden);
  removeEventListener("pageshow", goVisible);
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
    /* Lite: take every STRIDE-th file from the set already on disk. The pacing
       curve is normalised so it needs no adjustment, and the poster, window
       and arbiter all work in the reduced index space unchanged. */
    const LITE = isLite();
    const STRIDE = LITE ? 2 : 1;
    const N = Math.max(1, Math.ceil(set.count / STRIDE));
    const BEHIND = LITE ? Math.max(1, Math.round(behind / 2)) : behind;
    const AHEAD = LITE ? Math.max(1, Math.round(ahead / 2)) : ahead;
    const SID = set.dir.split("/").slice(-2, -1)[0] ?? label;
    root.dataset.lite = LITE ? "1" : "0";
    root.dataset.frames = String(N);
    root.dataset.window = String(BEHIND + AHEAD + 1);
    const tr = (...m: unknown[]) => {
      if (TRACE) console.log(`[seq] ${SID} y=${Math.round(window.scrollY)}`, ...m);
    };

    let alive = true;
    let armed = false;
    let t0 = 0;
    let ext: SeqFormat = format === "auto" ? "webp" : format;
    let cur = 0;
    let warnedSpan = false;
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

    /* Decode timings for the tier probe. Fetch is excluded deliberately: a
       slow network is not a reason to drop frames, a slow DECODER is. */
    const decodeMs: number[] = [];
    const recordDecode = (ms: number) => {
      if (decodeMs.length >= 2) return;
      decodeMs.push(ms);
      if (decodeMs.length === 2) {
        const median = (decodeMs[0] + decodeMs[1]) / 2;
        root.dataset.decodems = median.toFixed(2);
        tr("decode probe", decodeMs.map((m) => m.toFixed(1)).join(" / "), "ms");
        considerTier(median);
      }
    };

    const frameSrc = (i: number) =>
      `${set.dir}/f_${String(Math.min(set.count, i * STRIDE + 1)).padStart(3, "0")}.${ext}`;

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

    const draw = (want: number, force = false): boolean => {
      const j = nearest(want);
      if (j < 0) return false;
      if (j !== want) {
        const w = window as unknown as { __scrubMiss?: number };
        w.__scrubMiss = (w.__scrubMiss ?? 0) + 1;
      }
      if (!force && j === drawn) return true;
      const f = bmps[j];
      if (!f || !f.width || !f.height || !cw || !ch) return false;

      const s = Math.max(cw / f.width, ch / f.height);
      const dw = f.width * s;
      const dh = f.height * s;
      ctx.drawImage(f.src, (cw - dw) / 2, (ch - dh) / 2, dw, dh);

      drawn = j;
      draws += 1;
      root.dataset.draws = String(draws);
      root.dataset.frame = String(j);
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
      stamp();
      return true;
    };

    /* ── canvas-loss watchdog ─────────────────────────────────────────────
       Safari can drop a canvas backing store under memory pressure and fires
       no event. The first version of this compared a central patch against
       what it measured after the last draw, and it was quietly useless: it
       had to stand down whenever the previous reading was ~0, which on this
       film is most of segment B and all of the opening in space. A watchdog
       that switches itself off over dark material is no watchdog at all.

       So the canvas carries a sentinel instead. Every successful paint stamps
       one pixel in the bottom-right corner with a fixed, visually undetectable
       colour. The check reads that single pixel: if it is not exactly the
       value we wrote, the store is not the one we drew into. No dependence on
       what the frame contains, no false positives on black. */
    const SENTINEL = [1, 2, 3];
    const WATCH_MS = 400;
    let lastWatch = 0;
    let recoveries = 0;

    const stamp = () => {
      ctx.fillStyle = `rgb(${SENTINEL[0]},${SENTINEL[1]},${SENTINEL[2]})`;
      ctx.fillRect(cw - 1, ch - 1, 1, 1);
    };

    const sentinelIntact = (): boolean => {
      if (!canvas.width || !canvas.height) return true;
      try {
        const d = ctx.getImageData(canvas.width - 1, canvas.height - 1, 1, 1).data;
        return d[0] === SENTINEL[0] && d[1] === SENTINEL[1] && d[2] === SENTINEL[2];
      } catch {
        return true; // unreadable for some other reason; do not thrash
      }
    };

    const watchdog = (now: number) => {
      if (live <= 0 && !firstDrawn) return;
      if (now - lastWatch < WATCH_MS) return;
      lastWatch = now;
      if (sentinelIntact()) return;
      recoveries += 1;
      root.dataset.recovered = String(recoveries);
      tr("WATCHDOG sentinel gone — canvas lost, repainting");
      drawn = -1;
      if (!draw(Math.round(cur), true)) repaintPoster();
    };

    /** Repaint right now from the best thing available: a held bitmap, else
     *  the poster. Used on return from a backgrounded tab, where waiting for
     *  a decode would show a blank canvas for hundreds of milliseconds. */
    const repaintPoster = () => {
      if (!poster || !poster.complete || !poster.naturalWidth) return false;
      const ok = blit(poster, poster.naturalWidth, poster.naturalHeight);
      if (ok) {
        root.dataset.poster = "1";
        stamp();
      }
      return ok;
    };

    const repaintNow = () => {
      drawn = -1;
      if (draw(Math.round(cur), true)) return true;
      return repaintPoster();
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
        const dt0 = performance.now();
        const d = await decodeBlob(blob);
        recordDecode(performance.now() - dt0);
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

      winLo = Math.max(0, lastDir >= 0 ? c - BEHIND : c - AHEAD);
      winHi = Math.min(N - 1, lastDir >= 0 ? c + AHEAD : c + BEHIND);

      for (let i = 0; i < N; i += 1) {
        if (bmps[i] && !inWindow(i)) {
          bmps[i]!.close();
          bmps[i] = null;
          bumpLive(-1);
        }
      }

      if (!armed || inflight.size >= DECODE_POOL) return;
      const order: number[] = [c];
      const reach = Math.max(BEHIND, AHEAD);
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
      root.dispatchEvent(
        new CustomEvent("scrubseq:progress", {
          bubbles: true,
          detail: { label, fetched, total: totalFrames },
        }),
      );
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
              stamp();
            }
          };
          poster.src = frameSrc(0);
        }

        if (mode === "static") {
          /* THE OPENING FRAME, NOT THE CLOSING ONE. This branch used to pin the
             index at N - 1, which is the last frame of the segment: under
             prefers-reduced-motion every segment rendered its ENDING, frozen,
             from the moment it armed. It contradicted the poster three lines
             above, which loads frameSrc(0) — the code painted the first frame
             and then immediately replaced it with the last.

             A still standing in for a film should be the frame the film opens
             on. Reported from a real Mac on 2026-08-21 as "the canvas shows
             the last frame, frozen"; reproduced on Chromium too, so it was
             never an engine difference. */
          winLo = 0;
          winHi = 0;
          await fetchOne(0);
          if (!alive || !armed) return;
          cur = 0;
          void decode(0);
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
        onHide: () => {},     // a single frame is not worth shedding
        onShow: () => {},
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
      /* THE RECT, NOT SCROLL ARITHMETIC. A rect is what the engine actually
         laid out; window.scrollY / documentElement.scrollTop / body.scrollTop
         disagree across engines and across the moment you read them. */
      const r = root.getBoundingClientRect();
      const vh = stableVH();
      const span = r.height - vh;
      if (span <= 0) {
        /* Legitimate for mode "static", where the pin is collapsed to 100vh
           on purpose. Anywhere else it means the section is not taller than
           the viewport and the film has no scroll to run on — silently
           clamping is how that hides for a year. */
        /* This path is unreachable for mode "static" — that branch returns
           earlier — so reaching it at all means a real section is too short. */
        if (!warnedSpan) {
          warnedSpan = true;
          console.warn(
            `[scrubseq] ${label}: scrub denominator <= 0 (height ${Math.round(r.height)} - viewport ${Math.round(vh)} = ${Math.round(span)}). ` +
              `Every frame will resolve to index 0. The section must be taller than the viewport.`,
          );
        }
        return frameAt(0);
      }
      return frameAt(clamp01(-r.top / span));
    };

    const tick = (now: number = performance.now()) => {
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
      watchdog(now);
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
      onHide: () => {
        tr("HIDDEN — shedding", live, "bitmaps, keeping", fetched, "blobs");
        stop();
        evictAll();
      },
      onShow: () => {
        tr("VISIBLE — repaint", repaintNow() ? "ok" : "nothing to paint yet");
      },
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
