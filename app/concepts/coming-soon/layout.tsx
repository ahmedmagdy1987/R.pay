import type { Metadata } from "next";
import "./coming-soon.css";

export const metadata: Metadata = {
  title: "R.Pay — Concept 05 · Coming Next",
  description: "A brand-new R.Pay homepage concept, currently in design.",
};

export default function ComingSoonLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
