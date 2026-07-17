import type { Metadata } from "next";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import "./cinema.css";

export const metadata: Metadata = {
  title: "R.Pay — Concept 05 · Cinema",
  description:
    "Cinema — a fully visual R.Pay experience: an AI-crafted cinematic hero film and one horizontal reel carrying the whole story. مفهوم سينما: تجربة بصرية بالكامل لآر باي.",
};

export default function CinemaLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <WhatsAppWidget phone="966550796555" />
    </>
  );
}
