/**
 * WHICH CONTENT MODE DOES A DEPLOYED BUILD GET?
 *
 * WHY THIS EXISTS. Until 2026-08-21 nothing set NEXT_PUBLIC_RPAY_CONTENT on
 * Vercel, so every deployment — every preview, and the production domain —
 * built in DEVELOPMENT content mode. That mode is correct while building and
 * wrong in front of a client: it prints a provenance chip under every
 * unverified figure, naming the claim in Latin monospace caps in the middle of
 * an Arabic page. FLEET.MACHINES. RAILS.ACCEPTED. COMMERCIAL.VENUEPROPOSITION.
 *
 * `npm run demo:build` existed to fix exactly that, and it only ever ran on a
 * laptop. A correct build that nobody deploys is not a fix, so the default
 * moves here, where the deployment actually happens.
 *
 * THE RULES, IN ORDER.
 *
 *   1. AN EXPLICIT VALUE ALWAYS WINS. If NEXT_PUBLIC_RPAY_CONTENT is already
 *      set — in the Vercel dashboard, in the CLI, in CI — this script does not
 *      touch it. The dashboard stays authoritative; this only supplies a
 *      default where there was none.
 *
 *   2. A PREVIEW WITH NO EXPLICIT VALUE IS A DEMO BUILD. Previews are for
 *      showing the page as intended. Chips are the wrong default there, and
 *      they were the default for the entire life of this branch.
 *
 *   3. PRODUCTION IS NEVER SILENTLY CHANGED. This script does not invent a
 *      content mode for a production deploy — that decision belongs to the
 *      project configuration and to whoever accepts the consequences of
 *      omitting sixteen unverified claims from a live page. It reports what
 *      production resolved to and moves on.
 *
 *   4. PRODUCTION IS NEVER A DEMO BUILD, AND THIS ONE DOES NOT BEND. A demo
 *      build renders unverified figures plainly, with nothing marking them as
 *      unverified. That is publishable-looking output carrying unpublishable
 *      facts. If a production deploy ever resolves to demo — by inheritance,
 *      by a dashboard variable set at the wrong scope, by a future edit to
 *      this file — the build STOPS. It does not warn. A warning in a Vercel
 *      build log is how this class of thing gets missed a second time.
 *
 * A LOCAL `next build` IS UNAFFECTED. VERCEL_ENV only exists on Vercel, so
 * running this off-platform changes nothing: development content, chips and
 * all, which is what a developer wants to see.
 *
 * See lib/content/index.ts for what the modes mean, scripts/demo-build.mjs for
 * the local equivalent, and scripts/check-content.mjs --production for the
 * launch gate, which is a SEPARATE guard and is not weakened by any of this.
 */
import { spawn } from "node:child_process";

/** "production" | "preview" | "development" on Vercel; undefined off-platform. */
const vercelEnv = process.env.VERCEL_ENV;
const explicit = process.env.NEXT_PUBLIC_RPAY_CONTENT;

let mode = explicit;
let why;

if (explicit) {
  why = `explicitly configured (NEXT_PUBLIC_RPAY_CONTENT=${explicit})`;
} else if (vercelEnv === "preview") {
  mode = "demo";
  why = "VERCEL_ENV=preview and nothing explicit — defaulting to demo";
} else if (vercelEnv === "production") {
  mode = undefined;
  why = "VERCEL_ENV=production — left to project configuration, not defaulted here";
} else {
  why = vercelEnv
    ? `VERCEL_ENV=${vercelEnv} — left as development content`
    : "not a Vercel build — development content, chips and all";
}

/* RULE 4. Checked against the RESOLVED mode, so an explicit value cannot slip
   past it either. */
if (vercelEnv === "production" && mode === "demo") {
  console.error("");
  console.error("  ══ REFUSING THIS BUILD ══");
  console.error("  A production deployment resolved to NEXT_PUBLIC_RPAY_CONTENT=demo.");
  console.error("");
  console.error("  A demo build renders unverified figures plainly, with nothing");
  console.error("  marking them unverified. Production must never do that.");
  console.error("");
  console.error("  Fix the variable's scope in the Vercel project settings: demo");
  console.error("  belongs to Preview, never to Production.");
  console.error("");
  process.exit(1);
}

console.log("");
console.log("  ══ R.PAY CONTENT MODE ══");
console.log(`  VERCEL_ENV      ${vercelEnv ?? "(unset — local build)"}`);
console.log(`  content mode    ${mode ?? "development (default)"}`);
console.log(`  reason          ${why}`);
if (mode === "demo") {
  console.log("");
  console.log("  Unverified figures render WITHOUT provenance chips.");
  console.log("  NOTHING HERE IS VERIFIED and the launch gate is unchanged:");
  console.log("  scripts/check-content.mjs --production still refuses these claims.");
}
console.log("");

const env = { ...process.env };
if (mode) env.NEXT_PUBLIC_RPAY_CONTENT = mode;
else delete env.NEXT_PUBLIC_RPAY_CONTENT;

const child = spawn("npx", ["next", "build"], { stdio: "inherit", shell: true, env });
child.on("exit", (code) => process.exit(code ?? 0));
