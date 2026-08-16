import type { Metadata } from "next";
import Landing from "./_c/Landing";

/**
 * Arabic is the canonical route, not a translation of the English one.
 * `/redesign/en` is the alternate.
 */
export const metadata: Metadata = {
  alternates: { canonical: "/redesign", languages: { en: "/redesign/en" } },
};

export default function ArabicPage() {
  return <Landing en={false} />;
}
