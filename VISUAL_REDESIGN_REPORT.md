# R.pay — Visual Redesign Report

Date: 2026-07-06
Baseline: commit `e0a0f80` (post asset-extraction rollback point)

## What changed visually

The page was transformed from a video-background hero + flat glass sections into a
cinematic, product-launch-grade fintech page:

- **Hero (complete rebuild):** split layout — copy on the start side, a custom
  animated composition on the end side. The composition layers, back to front:
  an SVG **payment network** (4 glowing lines with traveling transaction pulses
  + colored nodes), two rotating **orbit rings** with satellites, the real R.Pay
  **terminal photo** floating over a breathing halo, a CSS-built **payment card**
  (metallic gold chip, NFC ripple, animated sheen sweep, `•••• 4291`), a
  **glass live-sales panel** (SAR 24,180 + drawing sparkline + LIVE dot + three
  mini-stats echoing the real numbers), an **"approved payment" chip** that loops
  in/out, and a **geofence "inside safe zone" chip**. The whole scene responds
  to pointer **parallax** (7 depth levels, rAF-smoothed) and floats on layered
  timings. A faint masked grid + dual aura gradients sit behind it.
- **Headline:** upgraded from the generic slogan to a launch-page triad —
  AR: **"ادفع. راقب. تحكّم. / منصة واحدة لكل أجهزتك"**,
  EN: **"Pay. Monitor. Control. / One platform for every machine"** — with the
  triad in the brand gradient. Lead copy and CTAs preserved.
- **Trust row:** supported payment methods (مدى mada · Visa · Mastercard ·
  Apple Pay) as chips under the CTAs — previously dead CSS, now real markup.
- **Stats:** four separate boxes became one **unified glass band** with a
  gradient edge ring and glowing top ticks per stat (separate cards again on
  mobile). Counters unchanged.
- **Features bento:** gradient **edge-ring on hover** (masked border technique),
  deeper lift + glow, icon chips light up, inner top highlight.
- **About / Radar lists / Integration cards:** hover lift + glow, glowing side
  bars on mission/vision, stronger media-card shadows.
- **Compare:** the R.Pay column is now a glowing highlighted rail; the table
  wears a static gradient edge ring.
- **CTA finale:** bigger panel with breathing glow + two rotating dashed orbit
  rings (one carrying a satellite dot).
- **Marquee / Footer:** partners label became a pill; footer gained a gradient
  hairline; brands strip a soft edge fade.
- Both **dark and light themes** were styled deliberately (light hides the
  three.js canvas as before; aura/grid/shadows have light-mode variants).

## What happened to the old hero video

Removed from the interface entirely: the `<video>` element, its poster and the
`HERO_POSTER`/`HERO_VIDEO` imports are gone from `app/page.tsx` (verified in the
DOM: zero `video` elements on the page). The asset files
(`public/assets/hero-video.mp4`, `hero-poster.webp`) and their manifest exports
in `lib/assets/hero.ts` are **kept untouched** per instructions — nothing was
deleted, the video is simply no longer rendered.

## Motion system

- Scroll reveal (`.rv` + IntersectionObserver) retained across all sections.
- Pointer **parallax** on the hero scene (CSS vars `--px/--py`, one rAF loop,
  gated to `pointer:fine` and no-reduced-motion, cleaned up on unmount).
- Traveling network pulses (SMIL `animateMotion`, with `xlink:href` fallback for
  older WebKit), animated line dashes, orbit rotations, float loops (3 phases),
  card sheen sweep, NFC ripple, sparkline draw-in, breathing halos, counter
  count-ups, magnetic buttons + cursor glow + card spotlight (pre-existing, kept).
- **Everything pauses off-screen:** an IntersectionObserver toggles
  `animation-play-state:paused` on the whole composition and calls
  `svg.pauseAnimations()` for the SMIL pulses when the hero leaves the viewport.

## Performance notes

- **First Load JS: 99.7 kB** (baseline after extraction: 98.3 kB → +1.4 kB for
  the entire redesign). No new dependencies; no assets re-inlined; three.js
  stays lazily imported.
- Animations are transform/opacity only; the moving SVG pulses carry **no
  filter** (a per-frame drop-shadow would re-rasterize every frame).
- backdrop-filter usage was deliberately trimmed after review: in the hero
  viewport only the live-sales panel keeps real glass blur; chips/kicker/pays
  use tinted solids (visually indistinguishable over the dark backdrop, far
  cheaper to composite). Below the fold, blur removed from list/mission cards.
- Playwright was installed with `--no-save` for validation only (node_modules
  is gitignored; package.json/lock untouched).

## Mobile responsiveness

- Hero stacks (copy centered, visual below), composition scales to ≤92 vw with
  smaller card/panel variants; the geofence chip moves to the upper third so the
  fixed WhatsApp button can never sit on top of it at the fold.
- Stats 2×2 cards, bento single column, all pre-existing breakpoints preserved.
- Verified via headless-browser screenshots at 390×844 (AR + EN).

## Accessibility / reduced motion

- The reduced-motion kill switch now also covers **pseudo-elements**
  (`*,*::before,*::after{animation:none}`) — previously ::before/::after loops
  survived it. SMIL pulses and the card sheen are additionally hidden by
  explicit rules; the JS parallax and the count-up/magnetic effects were already
  gated on `prefers-reduced-motion`.
- The entire hero composition is `aria-hidden` (decorative); no new interactive
  elements were added; single `h1` preserved; `dir`/`lang` switching intact.
- Verified in a `reducedMotion: reduce` browser context: page renders complete
  and static-stable.

## Validation performed

- `npm run build` — passes (static, 4/4 pages).
- Headless Chromium sweep: AR/EN × dark/light × desktop (1440×900) / mobile
  (390×844) + reduced-motion context. **0 console errors, 0 failed requests,
  no `<video>` in the DOM, RTL/LTR switching verified.**
- A 10-agent adversarial review (RTL/i18n, performance, accessibility,
  correctness) produced 6 confirmed findings — all fixed before commit:
  two Arabic letter-spacing regressions (cursive joining broken in the partners
  and payments labels), hero backdrop-filter over-use, per-frame SVG
  drop-shadow, a reduced-motion gap on pseudo-elements, and the WebKit
  `xlink:href` SMIL fallback.

## Files changed

- `app/page.tsx` — hero rebuilt (video removed), pays row added, CTA orbit
  decoration; all section copy/structure otherwise preserved.
- `app/globals.css` — hero v3 + `hv-*` composition system, section upgrades,
  responsive + reduced-motion rework; dead video-hero CSS removed.
- `app/layout.tsx` — `suppressHydrationWarning` on `<html>` (theme bootstrap
  script reorders the class attribute; dev-only warning, now silenced).
- `components/HeroVisual.tsx` — **new** animated hero composition component.

## Build result

`npm run build`: ✅ compiled, type-checked, 4/4 static pages.
Route `/` = 12.4 kB, **First Load JS 99.7 kB**.

## Git status (before commit)

```
 M app/globals.css
 M app/layout.tsx
 M app/page.tsx
?? components/HeroVisual.tsx
```
