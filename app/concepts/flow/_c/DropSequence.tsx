"use client";

/** ACT II — THE FALL. 500vh pinned canvas frame-sequence (THE SIGNATURE).
 *  PHASE 1: structural shell only. The scroll-scrub engine (adapted from
 *  components/VendingScroll.tsx — manual pin, rAF throttle, threshold-gated
 *  canvas drawImage over seq/f_001..072, createImageBitmap preload, mobile
 *  stills fallback, reduced-motion final-frame fallback) lands in PHASE 2.
 *  Frame timing note for Phase 2: sampling is NON-UNIFORM — f_001–f_063
 *  cover 0–4.2s of motion at 15fps, f_064–f_072 cover the 4.2–6.0s hold at
 *  5fps — so a linear p→frame map keeps the whole 500vh scroll alive. */
export default function DropSequence() {
  return (
    <section className="act drop" id="fall" aria-label="The drop">
      <div className="hold">
        <canvas aria-hidden="true" />
        {/* Four beats cross-fade here in Phase 2 */}
        <div className="beat t-beat" data-beat="1">
          <span className="ar-t">لمسة واحدة</span>
          <span className="en-t">One tap</span>
        </div>
        <div className="traylight" aria-hidden="true" />
        <div className="tray-cta">
          {/* CTA 2 of 4 — rendered inside the dispense tray at p >= 0.82 */}
          <a className="cta-warm" href="#demo">
            <span className="ar-t">احجز عرض تجريبي</span>
            <span className="en-t">Book a demo</span>
          </a>
        </div>
      </div>
    </section>
  );
}
