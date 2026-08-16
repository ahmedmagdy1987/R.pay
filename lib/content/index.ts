import registry from "@/content/claims.json";

/**
 * THE HONESTY LAYER.
 *
 * DESIGN LAW 4 — "Every number carries its date."
 *
 * Nothing on the site may state a fact about the real world except through here.
 * A claim knows whether it has been verified, when it was measured, and what to
 * do if it never arrives. That last field is what lets the page be built now and
 * published later: every unresolved fact has a designed absence, not a blank.
 *
 * Three things make it hard to publish an unverified claim by accident:
 *
 *   1. `claim()` throws on an unknown id, so a typo is a build failure rather
 *      than a silently missing number.
 *   2. `isPublishable()` is false while `verified` is false, and every surface
 *      that renders a figure asks first. An unverified claim renders its
 *      FALLBACK, not its value.
 *   3. `scripts/check-content.mjs --production` fails the build while any
 *      launch-blocking claim is unverified, so the guard is not a convention
 *      somebody has to remember.
 *
 * In development the value IS shown, wrapped in a visible marker, because
 * building against invisible data is how placeholder numbers end up shipped.
 */

export type ClaimId = string;

export interface Claim<T = unknown> {
  id: ClaimId;
  label: string;
  value: T;
  unit?: string;
  /** True only when a human has confirmed it and recorded the evidence. */
  verified: boolean;
  /** ISO date the value was measured. Required before `verified` may be true. */
  asOf: string | null;
  source: string | null;
  location: string;
  why: string;
  blocksImplementation: boolean;
  blocksLaunch: boolean;
  /** What the interface does instead, when this never arrives. */
  fallback: string;
}

const CLAIMS = (registry as { claims: Claim[] }).claims;
const BY_ID = new Map(CLAIMS.map((c) => [c.id, c]));

/** Every claim, for the checklist generator and the content guard. */
export function allClaims(): Claim[] {
  return CLAIMS;
}

export function claim<T = unknown>(id: ClaimId): Claim<T> {
  const found = BY_ID.get(id);
  if (!found) {
    throw new Error(
      `Unknown claim "${id}". Every public fact must be declared in content/claims.json.`,
    );
  }
  return found as Claim<T>;
}

/**
 * May this claim be shown to the public as fact?
 *
 * A claim is publishable only when it is verified AND carries a measurement
 * date. Verified-without-a-date is treated as unverified deliberately: the date
 * is half of what makes a number honest, and the law says so.
 */
export function isPublishable(id: ClaimId): boolean {
  const c = BY_ID.get(id);
  return Boolean(c && c.verified && c.asOf);
}

/**
 * The value, or `null` when it may not be published.
 *
 * Call sites branch on null and render their designed absence. That is the
 * whole mechanism: an unresolved fact produces a different composition, never a
 * blank space where a number was supposed to be.
 */
export function publishedValue<T>(id: ClaimId): T | null {
  return isPublishable(id) ? (claim<T>(id).value as T) : null;
}

/**
 * The value regardless of verification, for building against.
 *
 * Anything rendered from this MUST be wrapped in a development marker, so an
 * unverified figure can never be mistaken for a real one on screen.
 */
export function devValue<T>(id: ClaimId): T {
  return claim<T>(id).value as T;
}

/** True when the site is being built for public consumption. */
export const IS_PRODUCTION_CONTENT =
  process.env.NEXT_PUBLIC_RPAY_CONTENT === "production";

/**
 * What a surface should do with a claim right now.
 *
 *   'publish'  — verified and dated. Render it as fact.
 *   'omit'     — unverified, and this is a production content build. Render the
 *                designed absence.
 *   'dev'      — unverified, development build. Render the value inside a
 *                visible marker.
 */
export function claimMode(id: ClaimId): "publish" | "omit" | "dev" {
  if (isPublishable(id)) return "publish";
  return IS_PRODUCTION_CONTENT ? "omit" : "dev";
}

/** Claims that must be resolved before the site may go live. */
export function unresolvedLaunchBlockers(): Claim[] {
  return CLAIMS.filter((c) => c.blocksLaunch && !(c.verified && c.asOf));
}

/** Arabic-Indic date for a provenance chip. */
export function formatAsOfAr(iso: string): string {
  const months = [
    "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
    "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
  ];
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${months[m - 1]} ${y}`;
}

export function formatAsOfEn(iso: string): string {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${months[m - 1]} ${y}`;
}
