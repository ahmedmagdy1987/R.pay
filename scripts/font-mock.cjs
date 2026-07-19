/**
 * Offline build aid — ONLY consulted when the env var
 * NEXT_FONT_GOOGLE_MOCKED_RESPONSES points at this file (e.g. sandboxed CI
 * with no route to fonts.googleapis.com). Normal builds (Vercel, local dev
 * with network) never read it and fetch real Google Fonts.
 * Mechanism: next/font's documented mock hook. A Proxy answers ANY css2 URL
 * with minimal parseable CSS; font bytes are faked by next/font itself.
 */
function familyFrom(url) {
  const m = /family=([^:&]+)/.exec(url);
  return m ? decodeURIComponent(m[1]).replace(/\+/g, " ") : "Mock Font";
}
function cssFor(url) {
  const fam = familyFrom(url);
  const slug = fam.toLowerCase().replace(/\s+/g, "-");
  let out = "";
  for (const subset of ["arabic", "latin"]) {
    for (const w of [400, 600, 700]) {
      out += `/* ${subset} */\n@font-face { font-family: '${fam}'; font-style: normal; font-weight: ${w}; font-display: swap; src: url(https://mock.invalid/${slug}-${subset}-${w}.woff2) format('woff2'); }\n`;
    }
  }
  return out;
}
module.exports = new Proxy({}, { get: (_t, url) => (typeof url === "string" ? cssFor(url) : undefined) });
