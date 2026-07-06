# R.pay — Local Setup Report

Date: 2026-07-06
Machine: Windows 10 Pro (win32), Node v24.18.0, npm 11.16.0, git 2.55.0

## Project location

- **Local path:** `C:\Users\bdstd\Documents\projects\R.pay`
- **Repository:** https://github.com/ahmedmagdy1987/R.pay
- **Branch:** `main` (latest commit `e8a1aae` — "feat(v2.2): cinematic hero video…")

## Tech stack detected

| Area | Detected |
|---|---|
| Framework | Next.js 14.2.35 (App Router, `app/` directory) |
| Language | TypeScript 5.4.5 (strict mode), React 18.3.1 |
| Package manager | npm (no lock file in repo; `vercel.json` specifies `"installCommand": "npm install"`) |
| Build tool | Next.js built-in (webpack) — `next build` |
| Styling | Plain CSS — single `app/globals.css` (~44 KB), CSS variables, `dark`/`light` classes on `<html>`. No Tailwind, no CSS-in-JS. |
| Fonts | Google Fonts via `next/font` — Bricolage Grotesque (Latin) + IBM Plex Sans Arabic |
| Animation / 3D | three.js 0.149.0 (`components/LiquidBackground.tsx`); hand-rolled animations in `app/page.tsx` (IntersectionObserver reveals, rAF counters, magnetic buttons, custom cursor) |
| i18n | Bilingual Arabic (RTL, default) / English (LTR) via client-side toggle — no i18n library |
| Assets | Embedded as base64 data-URI strings in `lib/assets/*.ts` (hero.ts ≈ 2.7 MB, vending.ts ≈ 5.7 MB) |
| Deployment | Vercel (`vercel.json`: framework nextjs, `next build`, `npm install`) |

## Commands

- **Install:** `npm install` — succeeded (31 packages, ~28 s)
- **Dev:** `npm run dev` → **http://localhost:3000** — ready in ~1.9 s, page compiled (513 modules), served HTTP 200 with correct title/RTL markup, zero errors in terminal
- **Build:** `npm run build` — **succeeded**: compiled successfully, type check passed, 4/4 static pages generated
- **Prod serve:** `npm run start` (not run; build output verified)

## Environment variables

**None required.** No `process.env` usage anywhere in the source, no `.env.example`, no README, no API/auth/payment/storage clients. The site is fully static and self-contained (WhatsApp widget is a plain `wa.me` link with a hard-coded phone number).

## Errors found / fixes made

- **No errors.** Dev server and production build both ran clean on the first try. No source files were modified.
- npm audit reports 2 vulnerabilities (1 moderate, 1 high) in the Next 14.2.x dependency tree. Not build-blocking; left untouched because `npm audit fix --force` could introduce breaking version bumps. Revisit during a later maintenance pass (e.g., Next 14.2.x patch or Next 15 upgrade).

## Git status

```
?? package-lock.json
?? SETUP_REPORT.md
```

Working tree is otherwise clean on `main`. Both new files were created by this setup step (`package-lock.json` from `npm install` — the repo had no lock file; this report). **Nothing has been committed or pushed.**

## Build output snapshot

```
Route (app)        Size      First Load JS
┌ ○ /              2.28 MB   2.37 MB
└ ○ /_not-found    873 B     88.1 kB
```

## Next-step recommendation (visual redesign phase)

1. **Fix the asset-weight problem first — it will dominate any redesign.** First Load JS is **2.37 MB** because images/video are base64-embedded inside JS modules (`lib/assets/hero.ts`, `vending.ts`). Move these to `public/` as real files (or a CDN) and load via `<Image>`/`<video src>`. This alone will make every visual iteration faster to build and preview.
2. **Decide the styling system before restyling.** Everything lives in one 44 KB `globals.css` with global IDs/classes. If the redesign is substantial, consider migrating to Tailwind (or at least splitting CSS per component) as step one of the redesign, not mid-way.
3. **Component inventory to redesign against:** `Menu`, `BrandsMarquee`, `HowItWorks`, `Integration`, `VendingScroll` (currently unused by `page.tsx`), `LiquidBackground` (three.js), `WhatsAppWidget`.
4. Keep the working baseline: commit `package-lock.json` (locally) before starting the redesign so installs are reproducible and there's a clean rollback point.

Suggested next prompt: *"Start the visual redesign phase: first extract the base64 assets in `lib/assets/` into `public/` and update references (no visual changes), verify dev + build still pass, then propose the redesign direction."*
