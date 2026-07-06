import type { Metadata } from "next";
import LiquidBackground from "@/components/LiquidBackground";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import "./video-hero.css";

export const metadata: Metadata = {
  title: "R.Pay — Concept 02 · Video Hero",
  description: "Cinematic full-bleed hero video homepage concept for R.Pay.",
};

export default function ConceptLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <LiquidBackground />
      <div className="scrim" />
      <div id="prog" />
      {children}
      <WhatsAppWidget phone="966550796555" />
    </>
  );
}
