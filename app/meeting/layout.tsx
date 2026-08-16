import type { Metadata } from "next";
import "./meeting.css";

export const metadata: Metadata = {
  title: "R.Pay — لمسة واحدة تُشغّل أسطولًا",
  description:
    "نظام الدفع والتحكّم لماكينات الخدمة الذاتية. تلمس البطاقة، فتعمل المكينة، ويظهر ما حدث على شاشة المشغّل في اللحظة نفسها.",
  openGraph: { images: ["/assets/concept-08/hero-poster.webp"] },
  robots: { index: false, follow: false },
};

export default function MeetingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
