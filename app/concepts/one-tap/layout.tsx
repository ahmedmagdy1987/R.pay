import type { Metadata } from "next";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import "./one-tap.css";

export const metadata: Metadata = {
  title: "R.Pay — Concept 08 · One Tap. Total Control. | لمسة واحدة. تحكّم كامل.",
  description:
    "لمسة واحدة توقظ الماكينة، وتضيء الشبكة، وتظهر أمام المشغّل لحظيًا. One tap wakes the machine, lights the network, and lands on the operator's screen in real time.",
  openGraph: {
    images: ["/assets/concept-08/hub-card.webp"],
  },
};

/*
 * Chrome is deliberately minimal (flow precedent): scrim + #prog + widget.
 * NO <LiquidBackground /> — a running three.js canvas would fight the
 * network-scene canvas for the main thread. Ambient is static CSS.
 *
 * Fonts: Readex Pro (display) + IBM Plex Mono (machine voice) are
 * SELF-HOSTED in /public/fonts (@font-face in one-tap.css) — next/font's
 * Google fetch is documented flaky at build time in this repo.
 *
 * Dark-only by design: every scene asset is a night scene; a light theme
 * would be a different art direction, not a token swap.
 */
export default function OneTapLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="onetap">
      <div className="scrim" aria-hidden="true" />
      <div id="prog" aria-hidden="true" />
      {children}
      <WhatsAppWidget phone="966550796555" />
    </div>
  );
}
