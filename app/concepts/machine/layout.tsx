import type { Metadata } from "next";
import LiquidBackground from "@/components/LiquidBackground";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import "./machine.css";

export const metadata: Metadata = {
  title: "R.Pay — Concept 03 · Smart Machine",
  description: "Scroll-driven vending/arcade machine reveal homepage concept for R.Pay.",
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
