# CONCEPT 08 — QA REPORT

**Route:** `/concepts/one-tap` · **Branch:** `concept-08-one-tap` (from `main` @ `fddd85e`) · **Date:** 2026-08-03

## Commands run

| Command | Result |
|---|---|
| `npm install` | clean (no vulnerabilities blocking; lockfile respected) |
| `npx tsc --noEmit` | **0 errors** |
| `npm run lint` | **cannot run** — eslint is not installed in this repo (pre-existing; `next lint` prompts for setup). Not introduced by 08 |
| `npm run build` | **✓ Compiled successfully** — 12/12 static pages; `/concepts/one-tap` 6.96 kB route JS / 94.4 kB first load (flow: 5.87/93.3 — same class) |
| `npm run start` + `node scripts/qa-onetap.mjs` | full harness below, run twice (before/after fix batch) |
| `node scripts/perf-onetap.mjs` | metrics below |

New QA utilities added: `scripts/qa-onetap.mjs` (screenshot matrix + console/network/CTA/keyboard audits), `scripts/perf-onetap.mjs` (LCP/CLS/long-task probe), `scripts/vframes.mjs` (video frame extraction used for media judgment).

## Routes tested (regression sweep, 1440×900, console + network audited)

`/` (hub, card 08 verified rendering) · `latest` · `video-hero` · `machine` · `pulse` · `cinema` · `coming-soon` · `flow` · `one-tap` — **all render, zero new console errors, zero broken assets.** The only failures logged are `cinema`'s pre-existing hot-linked Higgsfield CloudFront video aborts (documented anti-pattern that predates this branch).

## Viewports tested on `/concepts/one-tap`

1920×1080 · 1440×900 · 1280×800 · 1024×768 · 768×1024 · 430×932 · 390×844 · 360×800 — each with hero + all five act anchors screenshotted in Arabic; 1440×900 and 390×844 additionally in English. **Horizontal overflow probe (scrollWidth − clientWidth): 0px on every viewport.**

## Scenario tests

| Scenario | Result |
|---|---|
| First screen before video playback | Poster + headline + CTA render immediately (poster is `<img>`, film fades in `onCanPlay`) ✓ |
| `prefers-reduced-motion` | No `<video>` element mounted at all; designed poster hero with payment brands lit; network canvas draws final constellation; counters SSR final values; marquee static ✓ |
| Video failure (all `*.mp4` blocked) | Poster hero + working CTAs; page fully understandable ✓ |
| CTA destinations | Every `.cta-warm` href is `#demo` or `https://wa.me/966550796555?text=…` (Arabic prefill «مرحبًا، أرغب بحجز عرض مباشر لـ R.Pay»); floating widget verified ✓ |
| Keyboard | Tab order: brand → language toggle → nav CTA (visible cyan focus ring, screenshot `ot-focus.png`) ✓ |
| Media discipline | Act II clip plays only while intersecting, pauses offscreen; network canvas rAF runs once (3.2 s) then releases; hero film plays once and ends ✓ |
| AR/EN parity | True translation pairs throughout; wordmark forced LTR; canvas flow direction mirrors `dir`; LED windows digits-only ✓ |

## Performance (localhost prod server, 1440×900 — architecture signal, not field data)

| Metric | Value | Target |
|---|---|---|
| LCP | 132 ms (poster+text; film never gates it) | ≤ 2.5 s |
| CLS | 0.02 | ≤ 0.1 |
| Long tasks (>50 ms) | 1 | minimal |
| Full-page transfer incl. hero film | 1.48 MB | lean |

Total shipped media 2.9 MB, of which below-the-fold videos are `preload="none"` and lazy. Localhost numbers cannot substitute for field LCP on 4G — architectural guarantees (poster-first LCP, explicit media dimensions, play-once motion budget) are the transferable part.

## Accessibility observations

Semantic sections with `aria-label`s; single `h1`; buttons vs links used correctly (replay is a `<button>`); visible `:focus-visible` ring; no hover-only interactions; no autoplay audio; simulation figures labeled «محاكاة مباشرة / Live simulation»; decorative media `aria-hidden` / empty `alt`; mono/LED windows never contain Arabic (Plex Mono has no Arabic glyphs).

## Fixed during QA (screenshot-verified before/after)

1. Brand lockup read "Pay R." in RTL → `.brand { direction: ltr }`.
2. WhatsApp widget rendered unstyled (missing `.wa` route CSS) → flow port.
3. Mobile hero: payment brands sat over the bright film zone → veil extended to ~72%.
4. Act V arcade plate duplicated Act II's composition → new side-angle generation, copy pinned physical-left.
5. Partner logos illegible on dark → light-card marquee strip (flow precedent).

## Known limitations

- `npm run lint` unavailable repo-wide (eslint never installed) — `tsc --noEmit` + `next build` linting used instead.
- The hero film continues to its 8 s end if the user scrolls away mid-play (it self-terminates; no loop). Accepted trade-off for LCP simplicity.
- Hero pulse-echo timestamp (`PULSE_AT = 3.2s`) is tuned to the delivered cut; regenerating the film requires re-measuring.
- Field Core Web Vitals not measurable in this environment (no deployment in scope for this branch).
- `master.mp4.part**` (46 MB, concept 07's) remain untouched on the branch per the do-not-damage rule.

## Remaining blockers

None. The branch builds, all 9 routes pass regression, and the concept is presentation-ready.
