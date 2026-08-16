import type { Metadata, Viewport } from "next";
import "./horizon.css";

export const metadata: Metadata = {
  title: "R.Pay — كل مكينة تحت أمرك",
  description:
    "نظام الدفع والتحكّم لماكينات الخدمة الذاتية في السعودية. كل مكينة، على شاشة واحدة، بلا تخمين.",
  // Repetition test 3: the peg grammar as the mark.
  icons: {
    icon: [
      // 16px gets its own optical cut: at that size the three-peg mark closes its
      // joints, and the joint is the feature doing the identifying.
      { url: "/brand/mark-16.png", sizes: "16x16", type: "image/png" },
      { url: "/brand/mark-32.png", sizes: "32x32", type: "image/png" },
      { url: "/brand/mark.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/brand/mark-180.png", sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#040F1E",
  width: "device-width",
  initialScale: 1,
};

export default function RedesignLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Preload only the two faces in the first paint. Without this the swap
          lands late on a throttled connection and reflows the hero, which showed
          up as CLS variance between 0.001 and 0.12 across identical runs. */}
      <link
        rel="preload"
        href="/fonts/readex-pro-700.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
      <link
        rel="preload"
        href="/fonts/readex-pro-400.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
      {children}
    </>
  );
}
