# R.pay — Final Production Polish Report

Date: 2026-07-06
Base: deployed commit `5514927` (+ `1ee7bac` docs)
Method: 22-agent adversarial audit (SEO, accessibility, bilingual copy,
responsive/performance — every finding independently verified against the code;
1 refuted, 17 confirmed) + headless-browser probes (overflow scan at 13 widths
× AR/EN, keyboard-focus probe, tablet screenshots, Escape/focus dialog test).

## SEO / metadata changes (`app/layout.tsx`)

- **metadataBase** was `https://www.rpay.sa` — that domain currently serves a
  *different* site (an agency concept build), so any relative og URL would have
  resolved to the wrong host. Now: `process.env.NEXT_PUBLIC_SITE_URL ??
  "https://r-pay-orcin.vercel.app"` — correct today; set the env var in Vercel
  when rpay.sa is pointed at this app.
- **og:image added** (`/assets/hero-poster.webp`, 1600×759, alt text) — links
  shared on WhatsApp/X/iMessage previously rendered with no preview image.
- **twitter card added** (`summary_large_image` + title/description).
- **og:siteName / og:url / og:locale:alternate (en_US) added.**
- Keywords: added the correct Arabic spelling "آر باي" alongside the existing
  transliteration. Verified: no payment-brand claims anywhere in metadata.

## Accessibility changes

- **`:focus-visible` ring** (none existed anywhere): brand-cyan 2px ring,
  offset 3px, with a darker blue on the light theme (cyan fails 3:1 there).
  Verified via keyboard Tab: `solid 2px rgb(0,174,239) offset 3px`.
- **Menu dialog** (`components/Menu.tsx`): added `aria-modal`, a bilingual
  accessible name, focus moves to the close button on open, **Escape closes**
  (machine-verified), close button label now bilingual.
- **Theme toggle**: `aria-label="theme"` → dynamic, language-aware label
  ("Switch to light/dark theme" / "التبديل إلى الوضع الفاتح/الداكن").
- **Headings inside buttons** (`HowItWorks`): `<h3>/<p>/<div>` inside the step
  `<button>`s (invalid HTML; polluted screen-reader heading navigation) →
  styled `<span>`s, visuals unchanged.
- **Contrast**: compare-table "SurePay · Geidea" note was 10px at 55% opacity
  (failed AA in light theme) → `var(--muted)` 11px (passes both themes).

## Arabic / English copy changes

- **Systematic Arabic-tracking guard**: `.ar-t{letter-spacing:normal}` — Latin
  microcopy tracking (khead .16em, hero-cue .2em, footer h4 .15em, clocks…)
  was inherited by the Arabic spans, visibly severing cursive joining in 5+
  places. The `.integ-en` script-swap block got mirrored exceptions (its Latin
  echo keeps tracking; its Arabic echo in EN mode doesn't).
- **"Auto cashback" → "Auto refunds"** (page.tsx) and "Automatic Cashback" →
  "Automatic Refunds" (HowItWorks) — "cashback" means a purchase reward; the
  feature is automatic refunds, as the site's own compare table already says.
- **Brand transliteration unified to "آر باي"** (was a mix of "ار باي" ×5 and
  "آر باي" ×1) across nav, section headings, Integration heading.
- **CTA English** "start self-selling now" (not idiomatic) → "start
  self-service sales now", matching the page's own terminology.

## Responsive / performance fixes

- **Stats numerals**: `465,255+` overflowed its card below ~430px and crowded
  dividers at 961–1100px → clamp midpoint 5vw→4.2vw plus a ≤640px size step.
  Verified at 320px: all four cells fit.
- **Geofence chip vs payment card** on small mobile: chip moved to `top:47%`
  (≤640px); verified no intersection at 320px (15px clearance).
- **Pointer spotlight handler**: was re-querying the DOM and measuring ~15
  element rects on every raw `pointermove` (and included a dead `.sector`
  selector) → targets queried once, rect work rAF-throttled, cleanup added.
- **`background-attachment:fixed` removed** (scroll-jank on mobile; ignored by
  iOS Safari) → gradient now paints on a composited `body::before` fixed layer;
  identical appearance, verified in both themes.
- Overflow scan across 13 viewport widths × AR/EN: no user-visible horizontal
  scrolling (remaining `scrollWidth` excess is virtual — every wide element is
  inside an `overflow:hidden` ancestor and `html` clips horizontally).

## Performance result

- **First Load JS: 99.9 kB** (was 99.7 kB; +0.2 kB = metadata + aria markup).
- No new dependencies (package.json/lock untouched), no inline assets,
  0 console errors, 0 failed requests, 0 missing assets across the full
  AR/EN × dark/light × desktop/mobile × reduced-motion suite.

## Build result

`npm run build`: ✅ compiled, type-checked, 4/4 static pages.
Route `/` = 12.7 kB, First Load JS **99.9 kB**.

## Files changed

`app/layout.tsx`, `app/globals.css`, `app/page.tsx`,
`components/HowItWorks.tsx`, `components/Integration.tsx`,
`components/Menu.tsx` — 6 files, +111/−40.

## Screenshots

Regenerated full matrix (AR/EN × dark/light × desktop 1440×900 / mobile
390×844 / tablet 820×1180 + reduced-motion) — all captured clean in the
session scratchpad (`shots/`, `shots-polish/`).

## Git status

Clean after commit; only the six files above changed (this report added
alongside). **Not pushed**, per instructions.

## Safe to push?

**Yes.** All changes are small, surgical, verified fixes inside the approved
visual direction; build and the full browser suite pass. One deploy-time note:
after pushing, set `NEXT_PUBLIC_SITE_URL=https://www.rpay.sa` in Vercel **only
when** that domain actually hosts this app.
