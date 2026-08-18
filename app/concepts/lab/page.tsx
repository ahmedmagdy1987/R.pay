"use client";

import { useEffect, useRef, useState } from "react";
import ScrubSequence, {
  type PacingRange,
  type SeqSet,
  type TitleCard,
} from "@/components/ScrubSequence";

/* Frames are the orbit→Riyadh test clip (Seedance 2.0, 5s, s1a → s3c),
   sampled off a mpdecimate'd stream. The raw clip is 20fps of unique content
   padded to 24, so sampling it directly would have put duplicate stills next
   to each other and made the scrub hitch — see scripts/clip-analyse.mjs. */
const WIDE: SeqSet = { dir: "/assets/lab/seq/w", count: 60, width: 1600, height: 900 };
const TALL: SeqSet = { dir: "/assets/lab/seq/t", count: 40, width: 900, height: 1600 };

/* THE DEAD RUN. Inside the cloud the camera has nothing to show: desktop
   frames 17-30 encode to 3.8-16 KB against 80-147 KB at the end of the clip,
   and the inter-frame delta collapses with them. Measured, not guessed —
   per-frame byte weight is the honest proxy for how much a frame is carrying.
   Normalised to 0.27-0.50 so the same curve fits the 40-frame portrait set.
   At weight 0.5 the passage still plays, it just stops charging the reader a
   screen-height per frame for it. */
const PACING: PacingRange[] = [{ from: 0.27, to: 0.5, weight: 0.5 }];

/* The card lands in the dark, which is the one stretch of this sequence with
   room for type over it. It is fully gone before the cloud breaks. */
const TITLE: TitleCard = {
  from: 0.28,
  to: 0.49,
  ar: "٩٧ ماكينة. مملكة واحدة.",
  en: "97 machines. One kingdom.",
};

export default function LabPage() {
  const [mounted, setMounted] = useState(true);
  const [en, setEn] = useState(false);

  const modeRef = useRef<HTMLElement>(null);
  const tffRef = useRef<HTMLElement>(null);
  const framesRef = useRef<HTMLElement>(null);
  const memRef = useRef<HTMLElement>(null);

  /* Language switch drives the same html.en class every other route uses, so
     .ar-t / .en-t inside the title card behave identically here. */
  useEffect(() => {
    const h = document.documentElement;
    h.classList.toggle("en", en);
    h.setAttribute("dir", en ? "ltr" : "rtl");
    h.setAttribute("lang", en ? "en" : "ar");
  }, [en]);

  /* Unmount hook for the release assertion in scripts/lab-measure.mjs. The
     harness has to read window.__scrubLive AFTER the element is gone, so the
     component mirrors its live-bitmap count there. */
  useEffect(() => {
    (window as unknown as { __labUnmount?: () => void }).__labUnmount = () => setMounted(false);
  }, []);

  /* Mirror the component's data-* readout. One observer, no polling, no state
     — the scrub must own the main thread. */
  useEffect(() => {
    if (!mounted) return;
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
      if (memRef.current) {
        const peak = Number(seq.dataset.peak ?? 0);
        const bw = Number(seq.dataset.bmw ?? 0);
        const bh = Number(seq.dataset.bmh ?? 0);
        memRef.current.textContent = peak && bw
          ? `${((peak * bw * bh * 4) / 1048576).toFixed(1)} MB · ${peak} frames`
          : "…";
      }
    };

    sync();
    const mo = new MutationObserver(sync);
    mo.observe(seq, {
      attributes: true,
      attributeFilter: ["data-mode", "data-tff", "data-loaded", "data-peak", "data-live", "data-bmw"],
    });
    return () => mo.disconnect();
  }, [mounted]);

  return (
    <main>
      <button className="lab-lang" onClick={() => setEn((v) => !v)} aria-label="Toggle language">
        {en ? "ع" : "EN"}
      </button>

      <section className="lab-slate">
        <span className="lab-kicker">Internal · not a concept</span>
        <h1 className="lab-h">
          Canvas <em>image sequence</em>, not a seeking video.
        </h1>
        <p className="lab-p">
          Concept 07 scrubbed <code>video.currentTime</code> and fell apart on iOS Safari, where
          every seek costs a keyframe decode. This route proves the replacement: independent WebP
          stills, decoded on a sliding window of at most twelve bitmaps, blitted with{" "}
          <code>drawImage</code>, and eased toward the scroll-derived index. The dark passage
          through cloud is paced at half scroll-distance per frame. Scroll on.
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
            <dt>Fetched</dt>
            <dd ref={framesRef}>…</dd>
          </div>
          <div>
            <dt>Peak decoded</dt>
            <dd ref={memRef}>…</dd>
          </div>
        </dl>
      </section>

      {mounted ? (
        <ScrubSequence
          wide={WIDE}
          tall={TALL}
          breakpoint={820}
          damping={0.12}
          scrollVh={500}
          pacing={PACING}
          titleCard={TITLE}
          behind={4}
          ahead={7}
          label="Scrub engine test sequence"
        >
          <span className="lab-caption">Scrub · orbit → Riyadh</span>
        </ScrubSequence>
      ) : (
        <section className="lab-slate">
          <span className="lab-kicker">Unmounted</span>
          <h2 className="lab-h">Sequence released.</h2>
        </section>
      )}

      <section className="lab-slate tail">
        <span className="lab-kicker">End of pin</span>
        <h2 className="lab-h">The sequence held.</h2>
        <p className="lab-p">
          No <code>&lt;video&gt;</code> element was created on this page. Scroll back up — the
          reverse scrub costs exactly what the forward one did, because both are an array index,
          and the decode window simply flips which side of the current frame it leads on.
        </p>
      </section>
    </main>
  );
}
