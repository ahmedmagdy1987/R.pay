import type { Metadata } from "next";
import Landing from "../_c/Landing";

export const metadata: Metadata = {
  title: "R.Pay — every machine under your command",
  description:
    "The payment and control system for self-service machines in Saudi Arabia. Every machine, on one screen, with no guessing.",
  alternates: { canonical: "/redesign/en", languages: { ar: "/redesign" } },
};

export default function EnglishPage() {
  return <Landing en />;
}
