"use client";

import { useEffect, useRef } from "react";
import ScrubSequence, { type SeqSet } from "@/components/ScrubSequence";

/* Placeholder frames, extracted from concept 07's master.mp4 with ffmpeg.
   Real files at real weights — the point is to measure transfer and decode,
   not to look at them. Task 3 swaps the directory contents, not this shape. */
const WIDE: SeqSet = { dir: "/assets/lab/seq/w", count: 60, width: 1600, height: 900 };
const TALL: SeqSet = { dir: "/assets/lab/seq/t", count: 40, width: 900, height: 1600 };

export default function LabPage() {
  const modeRef = useRef<HTMLElement>(null);
  const tffRef = useRef<HTMLElement>(null);
  const framesRef = useRef<HTMLElement>(null);

  /* Mirror the component's data-* readout into the spec block. One observer,
     no polling, no state — the scrub must own the main thread. */
  useEffect(() => {
    const seq = document.querySelector<HTMLElement>(".scrubseq");
    if (!seq) return;

    const sync = () => {
      const mode = seq.dataset.mode ?? "—";
      if (modeRef.current) {
        modeRef.current.textContent =
          mode === "wide" ? "1600×900 · 60" : mode === "tall" ? "900×1600 · 40" : "static · 1";
      }
      if (tffRef.current) {
        tffRef.current.textContent = seq.dataset.tff ? `${seq.dataset.tff} ms` : "…";
      }
      if (framesRef.current) {
        const total = mode === "tall" ? TALL.count : mode === "static" ? 1 : WIDE.count;
        framesRef.current.textContent = `${seq.dataset.loaded ?? 0} / ${total}`;
      }
    };

    sync();
    const mo = new MutationObserver(sync);
    mo.observe(seq, { attributes: true, attributeFilter: ["data-mode", "data-tff", "data-loaded"] });
    return () => mo.disconnect();
  }, []);

  return (
    <main>
      <section className="lab-slate">
        <span className="lab-kicker">Internal · not a concept</span>
        <h1 className="lab-h">
          Canvas <em>image sequence</em>, not a seeking video.
        </h1>
        <p className="lab-p">
          Concept 07 scrubbed <code>video.currentTime</code> and fell apart on iOS Safari, where
          every seek costs a keyframe decode. This route proves the replacement: independent WebP
          stills decoded once to <code>ImageBitmap</code>, blitted with <code>drawImage</code>, and
          eased toward the scroll-derived index so the motion between frames stays continuous.
          Scroll on.
        </p>
        <dl className="lab-spec">
          <div>
            <dt>Set in use</dt>
            <dd ref={modeRef}>…</dd>
          </div>
          <div>
            <dt>First frame</dt>
            <dd ref={tffRef}>…</dd>
          </div>
          <div>
            <dt>Decoded</dt>
            <dd ref={framesRef}>…</dd>
          </div>
          <div>
            <dt>Damping</dt>
            <dd>0.12</dd>
          </div>
        </dl>
      </section>

      <ScrubSequence wide={WIDE} tall={TALL} breakpoint={820} damping={0.12} scrollVh={500} label="Scrub engine test sequence">
        <span className="lab-caption">Scrub · placeholder frames</span>
      </ScrubSequence>

      <section className="lab-slate tail">
        <span className="lab-kicker">End of pin</span>
        <h2 className="lab-h">The sequence held.</h2>
        <p className="lab-p">
          No <code>&lt;video&gt;</code> element was created on this page. Scroll back up — the
          reverse scrub costs exactly what the forward one did, because both are an array index.
        </p>
      </section>
    </main>
  );
}
