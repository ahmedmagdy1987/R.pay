"use client";

import { IS_PRODUCTION_CONTENT } from "@/lib/content";

/**
 * A commercial fact that has not arrived yet.
 *
 * Copy handed over with `[[SOMETHING — Ahmed to supply]]` in it renders here
 * as a visible chip while the site is being built, and HARD FAILS the build
 * the moment somebody tries to produce a public one. The failure is the point:
 * a placeholder that only looks wrong is a placeholder that eventually ships.
 *
 * This deliberately rides the gate the repo already has rather than inventing
 * a second one. `lib/content` decides what a production content build is
 * (`NEXT_PUBLIC_RPAY_CONTENT=production`), and `scripts/check-content.mjs
 * --production` is the guard that runs in CI. A Vercel preview does not set
 * that variable, so previews keep building with the chips visible — which is
 * what makes the placeholders reviewable at all.
 *
 * For a fact that IS declared in content/claims.json, use the claim layer
 * instead: it knows the value, whether a human verified it, and what the
 * interface should do in its absence. This component is only for copy that
 * has no claim yet.
 */
export default function Pending({ id, note }: { id: string; note?: string }) {
  if (IS_PRODUCTION_CONTENT) {
    throw new Error(
      `Unresolved copy placeholder [[${id}]] reached a production content build.\n` +
        (note ? `  note: ${note}\n` : "") +
        `  Supply the real copy, or declare it in content/claims.json and render it\n` +
        `  through claimMode() so it carries a designed absence.`,
    );
  }
  return (
    <span className="pending" data-pending={id}>
      <i aria-hidden="true" />
      {id}
      {note ? <em>{note}</em> : null}
    </span>
  );
}
