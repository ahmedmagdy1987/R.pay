# R.pay — Final Deployment Report

Date: 2026-07-06
Production URL checked: **https://r-pay-orcin.vercel.app/**

## Push & deployment

- **Pushed commits:** `b604264` (fix: polish production landing page) and
  `26fc672` (fix: defer menu focus until open transition starts — a defect this
  verification round itself caught on production; see Accessibility below).
  First push attempt hit a transient `github.com:443` connection failure;
  succeeded on retry.
- **Final deployed commit: `26fc672`.**
- Deployment status: Vercel reported **success** for both commits via the
  GitHub commits/status API; the edge flipped within ~1 minute each time
  (verified by page-chunk hash change, not just a URL load).
- **Final polish is LIVE.**

## Metadata / OG verification (on production)

- `og:title` / `og:description` (Arabic), `og:type=website`,
  `og:locale=ar_SA` + `og:locale:alternate=en_US`, `og:site_name=R Pay`,
  `og:url=https://r-pay-orcin.vercel.app` — all present, all resolving to the
  **Vercel production URL** (the env-driven `metadataBase` default; rpay.sa
  untouched per instructions).
- `og:image` → `https://r-pay-orcin.vercel.app/assets/hero-poster.webp` with
  width/height/alt; the asset itself fetches **200, image/webp, 29,590 B**.
- `twitter:card=summary_large_image` + title/description present.

## Accessibility verification (on production)

- **Keyboard focus:** Tab reaches nav links/buttons with the brand ring —
  computed `2px rgb(0,174,239)` (`:focus-visible` matched).
- **Mobile menu:** opens with `aria-modal="true"` and bilingual accessible
  name; **focus lands on the close button** (`menu-close`); **Escape closes**.
  Note: the first production probe caught focus staying on the burger — the
  close button was still unfocusable at the first frame of the visibility
  transition. Fixed by deferring focus 60 ms (`26fc672`), redeployed, and
  re-verified on production.
- Reduced-motion context renders complete and static; decorative hero layers
  remain `aria-hidden`; heading hierarchy unchanged (no headings in buttons).

## Language / layout / theme verification (on production)

| Check | Result |
|---|---|
| Arabic RTL (`dir="rtl"`, cursive joining incl. section labels) | ✅ |
| English LTR (toggle, mirrored layout) | ✅ |
| Desktop 1440×900 | ✅ screenshots clean |
| Tablet 820×1180 | ✅ screenshot clean |
| Mobile 390×844 | ✅ screenshots clean (stats fit, no chip/card overlap) |
| Dark theme | ✅ |
| Light theme | ✅ toggles and renders correctly |
| Reduced motion | ✅ |
| Old hero video rendered | ❌ none — 0 `<video>` elements in every context |
| Payment-brand claims | ✅ none — 0 matches for mada/Visa/Mastercard/Apple Pay |

## Console / network (production, all contexts)

**0 console errors, 0 page errors, 0 failed requests (≥400), 0 missing assets**
across AR/EN × dark/light × desktop/mobile × reduced-motion runs.

## Build result

`npm run build` at `26fc672`: ✅ compiled, type-checked, 4/4 static pages.
**First Load JS 99.9 kB** (route `/` 12.7 kB).

## Final git status

Working tree clean; `main` in sync with `origin/main`
(history: `…5514927 → 1ee7bac → b604264 → 26fc672` + this report).

## Remaining issues

None blocking. Standing notes:
1. When rpay.sa is pointed at this app, set `NEXT_PUBLIC_SITE_URL=https://www.rpay.sa`
   in Vercel so canonical/OG URLs move to the brand domain.
2. WhatsApp's link crawler is the least WebP-tolerant of the major platforms;
   if its preview ever looks blank, export the same hero frame as a 1200×630
   JPG and point `og:image` at it (one line + one static file).
3. A manual real-device iOS/Safari pass remains advisable (all automated
   verification is Chromium-based).
