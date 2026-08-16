import type { Metadata } from "next";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import "../concepts/one-tap/one-tap.css";

export const metadata: Metadata = {
  title: "R.Pay — لمسة واحدة. تحكّم كامل. | One Tap. Total Control.",
  description:
    "لمسة واحدة توقظ الماكينة، وتضيء الشبكة، وتظهر أمام المشغّل لحظيًا. One tap wakes the machine, lights the network, and lands on the operator's screen in real time.",
  openGraph: { images: ["/assets/concept-08/hub-card.webp"] },
  robots: { index: false, follow: false },
};

/** Presentation route. Same chrome as the concept it is built from. */
export default function MeetingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="onetap">
      <div className="scrim" aria-hidden="true" />
      <div id="prog" aria-hidden="true" />
      {children}
      <WhatsAppWidget phone="966550796555" />
    </div>
  );
}
