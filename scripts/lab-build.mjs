/**
 * IS THE SERVER ACTUALLY SERVING THE BUILD ON DISK?
 *
 * WHY THIS EXISTS. On 2026-08-20 three orphaned `next start` processes stayed
 * bound to 3210/3211/3212 after their launcher was killed. A new server failed
 * with EADDRINUSE, but curl still answered 200 — from a build made forty
 * minutes earlier. Weight and frame-time numbers were nearly reported for a
 * page that did not contain the change being measured.
 *
 * That failure mode looks EXACTLY like success: green harness, plausible
 * numbers, wrong build. Nothing in the harness could have caught it, because
 * every check it runs is a check on whatever the server chose to hand over.
 *
 * So: before any measurement, compare `.next/BUILD_ID` on disk against the
 * buildId Next embeds in the served flight payload. They are generated per
 * build, so a stale server cannot match a fresh build.
 *
 * IT ABORTS. It does not warn. A warning in a scroll-back of harness output is
 * how this gets missed a second time.
 *
 * Remote targets are exempt and say so out loud: .next/BUILD_ID describes what
 * is on THIS disk and means nothing about a Vercel preview.
 */
import { readFileSync } from "node:fs";
import { get as httpGet } from "node:http";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const REPO = join(dirname(fileURLToPath(import.meta.url)), "..");

/** The build sitting in .next right now, or null if there isn't one. */
export function diskBuildId() {
  try {
    return readFileSync(join(REPO, ".next/BUILD_ID"), "utf8").trim() || null;
  } catch {
    return null;
  }
}

/** The buildId Next embedded in the page it actually served. */
export function servedBuildId(html) {
  // App Router ships it inside an escaped flight payload:
  //   self.__next_f.push([1,"0:[\"$\",\"$L4\",null,{\"buildId\":\"<id>\",...
  const m = html.match(/buildId\\?"\s*:\s*\\?"([A-Za-z0-9_-]+)/);
  return m ? m[1] : null;
}

const isLocal = (base) => /^https?:\/\/(127\.0\.0\.1|localhost|\[::1\])(:|\/|$)/i.test(base);

/* node:http rather than fetch. undici keeps a socket alive past the response,
   and calling process.exit() while that handle is closing aborts the process
   with a libuv assertion and exit code 127 — which turns a clean, deliberate
   refusal into what looks like a crash. This path only ever talks to a local
   server, so plain http is enough. */
const get = (url) =>
  new Promise((resolve, reject) => {
    const req = httpGet(url, { agent: false }, (res) => {
      let body = "";
      res.setEncoding("utf8");
      res.on("data", (c) => (body += c));
      res.on("end", () => resolve({ status: res.statusCode, body }));
    });
    req.on("error", reject);
    req.setTimeout(15000, () => req.destroy(new Error("timed out")));
  });

function die(lines) {
  console.error("");
  console.error("  ══ BUILD IDENTITY CHECK FAILED ══");
  for (const l of lines) console.error("  " + l);
  console.error("");
  process.exit(1);
}

/**
 * Assert the server at `base` is serving the build in .next.
 * Returns the verified build id. Exits 1 on any doubt.
 */
export async function assertServedBuild(base, path = "/concepts/lab") {
  if (!isLocal(base)) {
    console.log(`  build identity not checked — ${base} is not a local server\n`);
    return null;
  }

  const expected = diskBuildId();
  if (!expected) {
    die([
      "No .next/BUILD_ID on disk, so there is nothing to compare against.",
      "Build first:  npm run build",
    ]);
  }

  let res;
  try {
    res = await get(`${base}${path}`);
  } catch (e) {
    die([
      `Nothing answered at ${base}${path} (${e.code ?? e.message}).`,
      "Start it:  npm run build && npm run lab:serve",
    ]);
  }
  if (res.status !== 200) {
    die([`${base}${path} answered HTTP ${res.status}.`, "Start it:  npm run lab:serve"]);
  }
  const html = res.body;

  const served = servedBuildId(html);
  if (!served) {
    die([
      `Could not find a buildId in the page served by ${base}.`,
      "Refusing to measure a build that cannot be identified.",
    ]);
  }

  if (served !== expected) {
    die([
      `The server at ${base} is serving a DIFFERENT build than the one on disk.`,
      "",
      `    served    ${served}`,
      `    expected  ${expected}`,
      "",
      "Every number this harness produces would describe the served build,",
      "not the code you just changed. Almost certainly an orphaned server:",
      "stopping the launcher does not stop `next start`.",
      "",
      "  npm run lab:serve      names the PID holding the port",
    ]);
  }

  console.log(`  build ${served} ✓ served build matches .next\n`);
  return served;
}
