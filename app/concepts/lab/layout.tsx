import type { Metadata } from "next";
import "./lab.css";

export const metadata: Metadata = {
  title: "R.Pay — Scrub Lab (internal)",
  description: "Internal proving ground for the canvas image-sequence scrubber. Not a concept.",
  // Throwaway harness: keep it out of every index.
  robots: { index: false, follow: false },
};

/* Deliberately bare. No LiquidBackground, no WhatsAppWidget, no #prog —
   anything else running on the main thread would contaminate the frame-rate
   measurement this route exists to produce. */
export default function LabLayout({ children }: { children: React.ReactNode }) {
  return <div className="lab">{children}</div>;
}
