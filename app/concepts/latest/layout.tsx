import type { Metadata } from "next";
import LiquidBackground from "@/components/LiquidBackground";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import "./latest.css";

export const metadata: Metadata = {
  title: "R.Pay — Concept 01 · Latest Experience",
  description:
    "The latest polished R.Pay landing experience — animated hero, restored payment methods, unified control platform.",
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
