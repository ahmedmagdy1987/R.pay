# R.pay — Deployment Verification Report

Date: 2026-07-06
Production URL checked: **https://r-pay-orcin.vercel.app/**

## Push

- **Pushed commits:** `11d4182` (feat: redesign R.pay landing page) + `5514927`
  (fix: use neutral trust chips) — pushed together as `e0a0f80..5514927 main -> main`.
- **Final deployed commit: `5514927`.**

## Payment chip change

**Yes — required.** The hero chips claimed specific acceptance brands
(mada / Visa / Mastercard / Apple Pay) that appear nowhere else in the product
content (the site's own copy says only "accepts cards and digital wallets").
Per the safety rule they were replaced before pushing with neutral trust chips,
bilingual: **دفع آمن / Secure checkout · موافقة فورية / Instant approval ·
مراقبة مباشرة / Live monitoring · دفع متعدد القنوات / Multi-channel payments**,
under the label **منصة موثوقة / Trusted platform**. Committed as `5514927`
(`fix: use neutral trust chips`), build re-run and passing.

## Deployment status

- Vercel (via GitHub deployments API): deployment for `5514927` created
  2026-07-06 06:46:53 +0300, status **success** ("Deployment has completed").
- The production alias briefly served a stale edge-cached page (~35 min,
  `X-Vercel-Cache: HIT`) before flipping; it now serves the new build.
- **The redesign is LIVE.**

## Production verification checklist (headless Chromium against production)

| Check | Result |
|---|---|
| New custom animated hero visible | ✅ `.hv` composition present and rendering |
| Old hero video not visible | ✅ |
| No `<video>` element in the DOM | ✅ 0 video elements (AR, EN, and reduced-motion contexts) |
| Arabic version | ✅ `dir="rtl"`, headline/labels render with correct cursive joining |
| English version | ✅ toggle works, `dir="ltr"`, layout mirrors via logical properties |
| Desktop layout (1440×900) | ✅ screenshots verified |
| Mobile layout (390×844) | ✅ screenshots verified |
| Dark/light theme | ✅ both captured; light theme hides the WebGL canvas as designed |
| Missing assets | ✅ none — 0 responses ≥ 400 across all runs |
| Console errors | ✅ 0 |
| Failed network requests | ✅ 0 |
| Production build clean | ✅ `npm run build` passes locally at the pushed commit |

Reduced-motion context additionally verified: page renders complete and static.

## Build result

`npm run build` at `5514927`: ✅ compiled, type-checked, 4/4 static pages.
Route `/` = 12.5 kB, **First Load JS 99.7 kB**.

## Final git status

Working tree clean; `main` in sync with `origin/main` (this report is the only
addition after the deploy, committed and pushed as its own docs commit).

## Remaining issues

- None blocking. Two advisory notes:
  1. Vercel's edge can serve the previous page for a few minutes after a deploy
     completes (observed ~35 min on the fra1 PoP today) — worth knowing before
     judging a deploy "missing".
  2. Real-device iOS/Safari smoke (frame-rate feel, SMIL fallback) is still
     worth a manual pass; headless verification covered Chromium only.
