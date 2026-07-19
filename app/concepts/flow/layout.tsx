import type { Metadata } from "next";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import "./flow.css";

export const metadata: Metadata = {
  title: "R.Pay — Concept 07 · The Drop | الدرج",
  description:
    "One continuous fall, from tap to tray. The scroll is the drop. سقطة واحدة متواصلة: من اللمسة إلى الدرج.",
};

/*
 * Chrome is deliberately minimal: scrim + #prog + WhatsAppWidget.
 * NO <LiquidBackground /> here (unlike concepts 01–06) — it is a running
 * three.js canvas and would fight the 500vh Act II frame-sequence canvas
 * for the main thread. The ambient background is static CSS in flow.css.
 *
 * Fonts: Readex Pro (display) and IBM Plex Mono (machine voice) are
 * SELF-HOSTED in /public/fonts (@font-face in flow.css) after next/font's
 * Google fetch proved flaky at build time. Subset from the OFL sources
 * (google/fonts GitHub): Arabic + Latin, joining features verified.
 * Body face (IBM Plex Sans Arabic) still arrives via the root layout.
 */
export default function FlowLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flow">
      <div className="scrim" aria-hidden="true" />
      <div id="prog" aria-hidden="true" />
      {children}
      <WhatsAppWidget phone="966550796555" />
    </div>
  );
}
