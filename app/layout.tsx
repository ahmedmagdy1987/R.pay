import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";
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
  title: "R.Pay — Interactive Concepts | مفاهيم آر باي",
  description:
    "استعرض اتجاهات تصميم متعددة للصفحة الرئيسية لآر باي. Explore multiple R.Pay homepage concept directions from one premium selection hub.",
  keywords: [
    "R Pay",
    "ار باي",
    "آر باي",
    "self-service payments",
    "vending machines",
    "Saudi Arabia",
    "smart payments",
    "concept hub",
  ],
  // Resolves every relative metadata URL (og:image, og:url).
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://r-pay-orcin.vercel.app"),
  icons: { icon: FAVICON, shortcut: FAVICON, apple: FAVICON },
  openGraph: {
    title: "R.Pay — Interactive Concepts",
    description:
      "Explore multiple R.Pay homepage concept directions from one premium selection hub.",
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
    title: "R.Pay — Interactive Concepts",
    description:
      "Explore multiple R.Pay homepage concept directions from one premium selection hub.",
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
        {/* Restore stored theme before first paint (themed routes read html.light/.dark) */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var t=localStorage.getItem('rpay-theme');var d=document.documentElement;d.classList.remove('dark','light');d.classList.add(t==='light'?'light':'dark');}catch(e){}})();",
          }}
        />
        {children}
      </body>
    </html>
  );
}
