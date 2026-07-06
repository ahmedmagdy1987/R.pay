# R.Pay — Concept Hub Report (Phase 1)

The production homepage is now a premium, client-facing **concept hub** that lets the
client open and compare multiple R.Pay homepage concepts. Three prior directions were
preserved/restored, the latest one was fixed, and a placeholder for the next concept
was added.

---

## 1. Routes created

| Route | Concept | Status |
|-------|---------|--------|
| `/` | **Concept Hub** (new production homepage) | New |
| `/concepts/latest` | **Concept 01 — Latest Experience** (current polished landing + fixes) | Live |
| `/concepts/video-hero` | **Concept 02 — Video Hero** (restored) | Restored |
| `/concepts/machine` | **Concept 03 — Smart Machine / Fridge Experience** (restored) | Restored |
| `/concepts/coming-soon` | **Concept 04 — Coming Next** (placeholder) | Placeholder |

All navigation from the hub to a concept uses full-page `<a href>` links, and every
concept has a floating **"All concepts"** pill back to `/`.

---

## 2. How the old versions were restored

The prior directions were recovered from git history and rebuilt as **self-contained
routes** (own stylesheet + localized components + chrome layout), importing the shared,
already-extracted public assets from `@/lib/assets/*`.

| Concept | Source commit | What it is |
|---------|---------------|------------|
| Video Hero | `e8a1aae` — *feat(v2.2): cinematic hero video now playing* | Full-bleed `<video>` hero (`/assets/hero-video.mp4` + poster), light/dark theme, theme toggle. |
| Smart Machine | `75f8eb0` — *polish: sharper 1080p vending video + …* | Scroll-scrubbed vending/arcade machine reveal (`VendingScroll`), the iPhone/device visual + animation, machine-render integration section. Dark-only (this snapshot predates the theme system — intentional). |

Restoration steps per concept: extracted `page.tsx`, `globals.css`, and the era-specific
`Integration`/`HowItWorks`/`Menu` verbatim via `git show`; localized those three
components into `./_c/`; kept unchanged shared components (`BrandsMarquee`,
`LiquidBackground`, `VendingScroll`, `WhatsAppWidget`); added a server `layout.tsx`
that renders the page chrome (`LiquidBackground`, scrim, `#prog`, `WhatsAppWidget`),
imports the concept stylesheet, and sets per-concept metadata; added the back-to-hub pill.

---

## 3. Fixes made to the latest version (`/concepts/latest` only)

**D1 — Payment methods restored.** The generic "trust chips" that had replaced the payment
brands (removed in commit `5514927`) are back as a **premium, labelled brand-chip row**:
`mada`, `VISA`, `Mastercard` (inline interlocking-circles mark), `Apple Pay` (apple glyph),
and `STC Pay` — rendered as clean white pills that read correctly in both themes.

**D2 — "Multi-channel payments" chip fixed.** The capability chips were re-laid-out as a
dedicated `.trust-chips` flex row: each chip is icon-led, `white-space:nowrap`, and the row
wraps chip-by-chip, so the long "Multi-channel payments / دفع متعدد القنوات" chip now stays
on one line and the cluster looks intentional and aligned (centered on mobile).

**D3 — Light-theme lower machine/image cards fixed.** Added `html.light` overrides for the
`.mcard` machine cards (previously hardcoded near-black): white card + body surfaces, a soft
light media frame (`#dce8f6`), lightened image bottom-fade, dark ink for titles/paragraphs,
and a `--blue` sub-label — so the cards read as premium light surfaces instead of muddy black
blocks, while the dark machine renders stay as intentional product imagery.

All three fixes live in `app/concepts/latest/page.tsx` (D1/D2 markup) and the appended
"CONCEPT-HUB ADDITIONS" block of `app/concepts/latest/latest.css` (D2/D3 styles). The shared
`components/Integration.tsx` was **not** modified.

| Fix | Done |
|-----|------|
| Payment methods restored | ✅ Yes |
| "Multi-channel payments" layout fixed | ✅ Yes |
| Light-theme dark-card issue fixed | ✅ Yes |

---

## 4. The concept hub (`/`)

Premium dark, client-presentation page (light theme also supported):

- R.Pay logo top-left; **"Interactive Concepts / مفاهيم تفاعلية"** tag + theme + EN/ع toggles top-right.
- Headline **"Explore R.Pay / استكشف آر باي"** with gradient accent, plus a short bilingual intro.
- Responsive **2×2 grid of concept cards** (1-col on mobile). Each card: number badge, status pill
  (Live / Restored / Soon), image/motif thumbnail, eyebrow, title, description, and an
  **"Open experience →"** CTA (chevron flips correctly in RTL).
- Ambient radial glows + subtle masked grid, glassy cards with hover lift/glow.

---

## 5. Architecture (why concepts don't collide)

- `app/globals.css` was trimmed to a **shared brand base** only (tokens, reset, the
  `.ar-t/.en-t` bilingual switch, body gradient) — no page-level class names, no `html.light`.
- Each route imports **only** the shared base + **its own** stylesheet (verified: per-route
  CSS is code-split; the video-hero bundle contains none of the latest-only styles).
- Root `app/layout.tsx` is a minimal shell (html/body/fonts/theme-init/children); page chrome
  moved into each concept's own layout.
- Hard-nav `<a>` links guarantee a clean stylesheet slate when opening a concept.

---

## 6. Files changed

**Modified**
- `app/globals.css` — trimmed to shared brand base
- `app/layout.tsx` — minimal shell + hub metadata
- `app/page.tsx` — replaced landing with the Concept Hub

**Added**
- `app/hub.css` — concept-hub styles
- `app/concepts/latest/{page.tsx,layout.tsx,latest.css}` — Concept 01 + D1/D2/D3 fixes
- `app/concepts/video-hero/{page.tsx,layout.tsx,video-hero.css,_c/*}` — Concept 02 (restored `e8a1aae`)
- `app/concepts/machine/{page.tsx,layout.tsx,machine.css,_c/*}` — Concept 03 (restored `75f8eb0`)
- `app/concepts/coming-soon/{page.tsx,layout.tsx,coming-soon.css}` — Concept 04 placeholder
- `CONCEPT_HUB_REPORT.md` — this report

No new dependencies; stack unchanged (Next 14 / React 18 / three 0.149).

---

## 7. Validation

- **Build:** `next build` ✅ passes — 6 static routes, no type/lint errors.
- **Routes:** all 5 pages return HTTP 200 under `next start`.
- **Fixes:** payment brand chips, `.trust-chips`, and `html.light .mcard*` overrides confirmed
  present in the built CSS.
- **Bilingual:** `.ar-t`/`.en-t` counts are balanced on every route; `dir="rtl" lang="ar"` by default.
- **Assets:** every referenced asset exists in `public/assets/`.
- **CSS isolation:** each route links only its own concept stylesheet + the shared base.

Build output (App Router):

```
Route (app)                     Size      First Load JS
┌ ○ /                           2.77 kB   90.2 kB
├ ○ /concepts/coming-soon       1.28 kB   88.7 kB
├ ○ /concepts/latest            13.6 kB   101 kB
├ ○ /concepts/machine           12.6 kB   100 kB
└ ○ /concepts/video-hero        11.5 kB   98.8 kB
```

### Adversarial review + fixes applied

A multi-dimension review (hydration/runtime, CSS/theming, bilingual/RTL, restoration
fidelity) with independent verification flagged and I fixed:

- **Video hero 404** — the restored dual-`<source>` pointed first at a non-existent
  `/hero.mp4`; removed the dead source so it loads `/assets/hero-video.mp4` directly.
- **RTL brand lockups** — added `direction:ltr` to `.brand-chip` so the multi-part
  Apple Pay and STC marks no longer mirror in the default Arabic (RTL) view.

One "D3 targets unrendered markup" finding was checked against the served HTML and found to
be a **false positive**: `/concepts/latest` does render the `.integ` machine section with 3
`.mcard` cards (via `<Integration />`), so the D3 light-theme fix is effective.

---

## 8. Known limitations

- Language selection (EN/ع) is **per-page** (not persisted across navigation); theme (light/dark)
  **is** persisted via `localStorage`. Opening a concept starts in Arabic by default, matching the
  original pages' behavior.
- **Concept 03 (machine)** is dark-only by design (its source snapshot predates the theme system);
  the theme toggle is intentionally absent there.
- Concept card thumbnails reuse existing product assets (device terminal, hero poster, machine
  render); they are representative rather than live screenshots of each concept.
- Concept 04 is a placeholder for the Phase-2 brand-new version.
- Runtime motion (three.js liquid background, hero video autoplay, scroll-scrub) was validated by
  successful static prerender + 200 responses; a full visual pass in a browser is recommended before
  the client presentation.
- `latest.css` carries some harmless inherited dead rules from the original stylesheet
  (`.pays/.pay`, v2.1 `.vtitle/.vsub/.vhint`); they style nothing and were left untouched to keep
  the latest concept's styling faithful to the shipped version.
