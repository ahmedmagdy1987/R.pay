/**
 * Build the page as it is meant to LOOK, for showing to a client.
 *
 * A development build wears a provenance chip under every unverified figure,
 * naming the claim behind it. That is correct while building and wrong in a
 * first showing: the chip prints an internal identifier in Latin monospace in
 * the middle of an Arabic page, and dims the client's own numbers beside a
 * verified one that is not dimmed. A demo build renders them plainly.
 *
 * IT PUBLISHES NOTHING AND VERIFIES NOTHING. The figures are still unverified,
 * and `node scripts/check-content.mjs --production` still refuses to pass them.
 * This only decides whether a value the build already renders wears a chip.
 *
 * A wrapper exists because npm scripts run through cmd.exe on Windows, where
 * `NEXT_PUBLIC_RPAY_CONTENT=demo next build` is not valid syntax.
 *
 *   npm run demo:build       then       npm run lab:serve
 */
import { spawn } from "node:child_process";

if (process.env.NEXT_PUBLIC_RPAY_CONTENT === "production") {
  console.error("\n  Refusing: NEXT_PUBLIC_RPAY_CONTENT is already \"production\".");
  console.error("  A production content build is never a demo build.\n");
  process.exit(1);
}

console.log("");
console.log("  ══ DEMO CONTENT BUILD ══");
console.log("  Unverified figures render WITHOUT provenance chips.");
console.log("  For showing the page as intended. NOT for publishing:");
console.log("  nothing here is verified, and the launch gate is unchanged.");
console.log("");

const child = spawn("npx", ["next", "build"], {
  stdio: "inherit",
  shell: true,
  env: { ...process.env, NEXT_PUBLIC_RPAY_CONTENT: "demo" },
});
child.on("exit", (code) => process.exit(code ?? 0));
