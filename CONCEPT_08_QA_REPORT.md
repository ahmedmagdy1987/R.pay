# CONCEPT 08 — QA REPORT

## REFINEMENT PASS (v2, 2026-08-03)

**Scope:** hero text-artifact elimination, double-scrollbar root fix, fleet/control/machines rebuilds, density audit, CTA hierarchy, functional footer, unified system.

### The left-scrollbar root cause (exact)

Two defects compounded. (1) `app/globals.css` set `body { overflow-x: hidden }`; per CSS spec, one hidden axis computes the other from `visible` to `auto`, so **`<body>` itself became a second vertical scroll container** alongside `html`. (2) The reveal system pre-translated the page's last element (`.foot`) by 12px; a transformed box at the document end **extends body's scrollable overflow by exactly those 12px**, activating body's scrollbar. In RTL the two scrollbars render on opposite sides — the reported "second left scrollbar". It vanished after full scroll because the footer's reveal returned the transform to 0. **Fix:** `body { overflow-x: clip }` (clips without creating a scroll container — benefits all concepts) + the footer is rise-exempt (fades in place). **Regression test:** `qa-onetap.mjs` asserts zero rogue vertical scroll containers on all 8 viewports in loaded state AND during throttled media download (the bug's original reproduction).

### Commands re-run

`npx tsc --noEmit` → 0 errors · `npm run build` → ✓ 12/12 pages, one-tap 7.15 kB route JS · `qa-onetap.mjs` (twice: before + after polish) → only cinema's pre-existing hot-link failure repo-wide · `perf-onetap.mjs` → LCP 144 ms (poster-first), CLS 0.02, 1 long task, 1.31 MB full transfer.

### Verified in this pass

- **No generated text artifact anywhere**: hero posters/films, Act II clip/poster, and all three card masters regenerated against a clean-screen terminal canon (logo + contactless symbol only); every video inspected frame-by-frame.
- **One scrollbar** in all states: before media, during throttled loading, after playback, at page bottom, after AR↔EN switches.
- Fleet act ≈ 860px desktop total (was ~1400px with the starburst); every card readable in contracted state; keyboard focus expands cards; mobile snap carousel.
- Control room: dashboard `min(84vw, 1320px)`, three scroll states (payment arrives → status updates → one view), toast repositioned clear of KPIs; mobile and reduced-motion pin the final composed state; machine IDs and SAR amounts render LTR-isolated inside RTL.
- Machine cards: three complete machines in aspect-specific 3:4 masters — zero clipped machines, zero seams; active card reveals benefit + text-link CTA; inactive titles no longer truncate (size-stepped, no mid-word ellipsis).
- CTA hierarchy: two dominant (hero, close) + compact nav + card text-links — the five-equal-buttons problem is gone; StickyCTA rival-suppression updated; the floating WhatsApp widget hides when close/footer is visible.
- Footer: functional two-layer ending (brand/description, section nav, WhatsApp + email + language switch, copyright) — verified content only.
- All 9 routes regression-clean; hub card updated to the clean-screen crop.

### Evidence

`refine-before/` (baseline), `refine-after/` (post-rebuild), `refine-final/` (post-polish) screenshot sets — 8 viewports × AR/EN × all acts + during-load + reduced-motion + no-video. Curated comparisons in `docs/concept-08-refinement/`.

---

## ORIGINAL PASS (v1)

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
