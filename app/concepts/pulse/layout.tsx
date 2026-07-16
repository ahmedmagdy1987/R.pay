import type { Metadata } from "next";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import "./pulse.css";

export const metadata: Metadata = {
  title: "R.Pay — Concept 04 · Pulse",
  description:
    "Pulse — a visual-first interactive R.Pay landing: tap-to-pay simulator, live network radar and a scroll-choreographed story. مفهوم النبض: تجربة بصرية تفاعلية لآر باي.",
};

export default function PulseLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div id="pprog" aria-hidden="true" />
      {children}
      <WhatsAppWidget phone="966550796555" />
    </>
  );
}
