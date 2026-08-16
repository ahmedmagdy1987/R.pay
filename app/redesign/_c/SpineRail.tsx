"use client";

import { useEffect, useRef } from "react";
import { BRANCHES } from "@/lib/fleet/data";

/**
 * REPETITION TEST 1 — the spine as the page progress rail.
 *
 * Not a generic progress bar tinted brass. It is the SAME object as the hero
 * instrument, compressed: nine brass segments with a node dot opening each, and
 * scroll progress travelling along it as cyan — because cyan means live, and
 * "where you are in the document" is live state.
 *
 * The proportions between segments are the real branch machine counts, so the
 * rail is the same data portrait as the hero. Two machines get added in Riyadh
 * and this rail changes shape too.
 *
 * Native scroll-driven animation where supported (compositor, zero JS per frame);
 * one shared rAF as the fallback. No library.
 */
export default function SpineRail() {
  const fillRef = useRef<SVGRectElement>(null);

  useEffect(() => {
    const fill = fillRef.current;
    if (!fill) return;

    // Compositor path: no main-thread work at all.
    if (CSS.supports("animation-timeline: scroll(root block)")) {
      fill.style.animation = "rp-rail auto linear";
      (fill.style as CSSStyleDeclaration & { animationTimeline?: string }).animationTimeline =
        "scroll(root block)";
      return;
    }

    let raf = 0;
    let queued = false;
    const paint = () => {
      queued = false;
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, doc.scrollTop / max)) : 0;
      fill.style.transform = `scaleX(${p})`;
    };
    const onScroll = () => {
      if (queued) return;
      queued = true;
      raf = requestAnimationFrame(paint);
    };
    paint();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Segment widths carry the real machine counts, exactly as the hero does.
  const total = BRANCHES.reduce((n, b) => n + b.machineCount, 0);
  const GAP = 1.4;
  const usable = 100 - GAP * (BRANCHES.length - 1);

  let x = 0;
  const segs = BRANCHES.map((b) => {
    const w = (b.machineCount / total) * usable;
    const seg = { id: b.id, x, w };
    x += w + GAP;
    return seg;
  });

  return (
    <div className="spine-rail" aria-hidden="true">
      <svg viewBox="0 0 100 4" preserveAspectRatio="none">
        <defs>
          <clipPath id="rp-rail-clip">
            {segs.map((s) => (
              <rect key={s.id} x={s.x} y={1.2} width={s.w} height={1.6} />
            ))}
          </clipPath>
        </defs>

        {/* The spine at rest — nine segments, brass */}
        {segs.map((s) => (
          <g key={s.id}>
            <rect className="sr-seg" x={s.x} y={1.2} width={s.w} height={1.6} />
            <line className="sr-node" x1={s.x} y1={0} x2={s.x} y2={4} />
          </g>
        ))}

        {/* Progress, clipped to the segments so it inherits the breaks */}
        <g clipPath="url(#rp-rail-clip)">
          <rect ref={fillRef} className="sr-fill" x={0} y={1.2} width={100} height={1.6} />
        </g>
      </svg>
    </div>
  );
}
