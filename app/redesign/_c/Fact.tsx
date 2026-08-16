import type { ReactNode } from "react";
import { claim, claimMode, formatAsOfAr, formatAsOfEn } from "@/lib/content";

/**
 * A public factual statement, and the only way one may reach the screen.
 *
 * Three outcomes, decided by the registry rather than by the call site:
 *
 *   publish  verified and dated. Renders as fact, with its provenance chip.
 *   dev      unverified, development build. Renders inside a visible marker, so
 *            an unconfirmed figure can never be mistaken for a real one while
 *            we are building against it.
 *   omit     unverified, production content build. Renders the designed absence
 *            passed as `fallback` — never a blank where a number should be.
 *
 * The marker is deliberately ugly. A tasteful one gets ignored, and the whole
 * point is that a placeholder must be impossible to miss on screen.
 */
export function Fact({
  id,
  en,
  children,
  fallback = null,
}: {
  id: string;
  en: boolean;
  children: ReactNode;
  /** What to show instead when this may not be published. */
  fallback?: ReactNode;
}) {
  const mode = claimMode(id);
  if (mode === "omit") return <>{fallback}</>;
  if (mode === "publish") return <>{children}</>;

  return (
    <span className="dev-fact" data-claim={id}>
      {children}
      <span className="dev-fact-tag" aria-hidden="true">
        {en ? "UNVERIFIED" : "غير موثّق"}
      </span>
      <span className="vh">
        {en
          ? "Development placeholder. This figure has not been verified."
          : "قيمة تطويرية. هذا الرقم غير موثّق بعد."}
      </span>
    </span>
  );
}

/**
 * The provenance chip. LAW 4 — every number carries its date.
 *
 * It states what the figure IS, not merely when it was taken: company-reported
 * and dated, or a development placeholder. It never says "live", because
 * nothing on this page is.
 */
export function Provenance({ id, en }: { id: string; en: boolean }) {
  const c = claim(id);
  const mode = claimMode(id);

  if (mode === "publish" && c.asOf) {
    const date = en ? formatAsOfEn(c.asOf) : formatAsOfAr(c.asOf);
    return (
      <span className="prov">
        {en ? `Company-reported · as of ${date}` : `بيانات الشركة · حتى ${date}`}
      </span>
    );
  }

  if (mode === "omit") return null;

  return (
    <span className="prov prov-dev">
      {en ? "Development placeholder · not verified" : "قيمة تطويرية · غير موثّقة"}
    </span>
  );
}
