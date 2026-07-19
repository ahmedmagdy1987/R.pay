"use client";
import { useEffect } from "react";
import Preload from "./_c/Preload";
import FilmHero from "./_c/FilmHero";
import DropSequence from "./_c/DropSequence";
import MachineRail from "./_c/MachineRail";
import Network from "./_c/Network";
import StickyCTA from "./_c/StickyCTA";

/** Concept 07 — "The Drop". Seven acts, one fall, one destination (#demo). */
export default function FlowPage() {
  // #prog — the cyan hairline tracking overall page progress.
  useEffect(() => {
    const bar = document.getElementById("prog");
    if (!bar) return;
    let ticking = false;
    const draw = () => {
      ticking = false;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = `${max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0}%`;
    };
    const onScroll = () => {
      if (!ticking) { ticking = true; requestAnimationFrame(draw); }
    };
    draw();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <main>
      <Preload />
      <FilmHero />
      <DropSequence />
      <MachineRail />
      <Network />

      {/* ACT V — CONTROL (Phase 2: one dashboard shot, three lines max) */}
      <section className="act control" id="control" aria-label="Control platform" />

      {/* ACT VI — THE CLOSE (Phase 2: one line + oversized CTA 4) */}
      <section className="act close" id="demo" aria-label="Book a demo">
        <div className="bg" aria-hidden="true" />
      </section>

      <StickyCTA />
    </main>
  );
}
