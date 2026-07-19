import type { Metadata } from "next";
import { Readex_Pro, IBM_Plex_Mono } from "next/font/google";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import "./flow.css";

const readex = Readex_Pro({
  subsets: ["arabic", "latin"],
  weight: ["400", "600", "700"],
  variable: "--font-readex",
  display: "swap",
});
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plexmono",
  display: "swap",
});

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
 */
export default function FlowLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`flow ${readex.variable} ${plexMono.variable}`}>
      <div className="scrim" aria-hidden="true" />
      <div id="prog" aria-hidden="true" />
      {children}
      <WhatsAppWidget phone="966550796555" />
    </div>
  );
}
