import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";
import LiquidBackground from "@/components/LiquidBackground";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import { FAVICON } from "@/lib/assets/brand";

const bric = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bric",
  display: "swap",
});
const plex = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-plex",
  display: "swap",
});

export const metadata: Metadata = {
  title: "R Pay | حلول ذكية لمستقبل أفضل · Smart Self-Service Payments",
  description:
    "R Pay شركة سعودية تقدم نظام دفع ذكي ومنصة تحكم موحدة لأجهزة الخدمة الذاتية. Smart payments and unified control for vending, arcade and coffee machines.",
  keywords: [
    "R Pay",
    "ار باي",
    "آر باي",
    "self-service payments",
    "vending machines",
    "Saudi Arabia",
    "smart payments",
  ],
  // Resolves every relative metadata URL (og:image, og:url). Defaults to the
  // live deployment; set NEXT_PUBLIC_SITE_URL=https://www.rpay.sa in Vercel
  // once that domain actually hosts THIS app (today it serves a different site).
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://r-pay-orcin.vercel.app"),
  icons: { icon: FAVICON, shortcut: FAVICON, apple: FAVICON },
  openGraph: {
    title: "R Pay | حلول ذكية لمستقبل أفضل",
    description:
      "نظام دفع ذكي ومنصة تحكم موحدة لأجهزة الخدمة الذاتية في السعودية.",
    type: "website",
    locale: "ar_SA",
    alternateLocale: "en_US",
    siteName: "R Pay",
    url: "/",
    images: [
      {
        url: "/assets/hero-poster.webp",
        width: 1600,
        height: 759,
        alt: "R Pay smart self-service payment terminal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "R Pay | حلول ذكية لمستقبل أفضل",
    description:
      "نظام دفع ذكي ومنصة تحكم موحدة لأجهزة الخدمة الذاتية في السعودية.",
  },
};

export const viewport: Viewport = {
  themeColor: "#040f1e",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={`dark ${bric.variable} ${plex.variable}`} suppressHydrationWarning>
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var t=localStorage.getItem('rpay-theme');var d=document.documentElement;d.classList.remove('dark','light');d.classList.add(t==='light'?'light':'dark');}catch(e){}})();",
          }}
        />
        <LiquidBackground />
        <div className="scrim" />
        <div id="prog" />
        {children}
        <WhatsAppWidget phone="966550796555" />
      </body>
    </html>
  );
}
