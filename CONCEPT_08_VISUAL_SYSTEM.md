# CONCEPT 08 — VISUAL SYSTEM (v2, refinement pass 2026-08-03)

**Route:** `/concepts/one-tap` · **Root class:** `.onetap` · **Mode:** dark-only (deliberate)
**Title:** «لمسة واحدة. تحكّم كامل.» / **One Tap. Total Control.**

---

## 1. Core idea

Concept 07 told the story from the *product's* POV (the can falls). Concept 08 is **operator-POV**: one customer tap ripples outward — the machine wakes, the fleet lights up, the operator sees everything on one surface. The tap is the trigger; **control is the payoff.**

## 2. Hero (preserved composition, clean-screen media)

Poster-first film: text + poster render instantly, the film fades in `onCanPlay`, plays ONCE and settles (no loop seam); «شاهد عملية الدفع» replays it. At the film's pulse moment a DOM echo-ring crosses into the page and ignites the payment-brands row — the branded moment where film energy becomes interface energy.

**Media rule (hard):** the terminal screen carries ONLY the R.Pay logo + contactless symbol — a graphic-only interface with **zero language-dependent text baked into any generated frame**. All words on the page are HTML. Every regenerated frame was inspected frame-by-frame (`scripts/vframes.mjs`).

## 3. The six acts

| # | Act | Visual | Height discipline |
|---|---|---|---|
| 1 | **اللمسة / The Tap** | Clean-screen hero film + HTML copy stack | 100svh (the only full-viewport act) |
| 2 | **من لمسة إلى تشغيل / Tap → Action** | Text-free arcade ambient clip, entry-triggered, beat chips | media-sized, 16:9 stage |
| 3 | **شبكة واحدة / One Network** | **Fleet cards**: dominant image card (97 + machine types over the fleet plate) + two operational data cards (live payment simulation · fleet health), flex-interpolated expansion, cyan hairline marks the active card only | row `clamp(380px,48vh,460px)`; whole act ≈ 760–900px |
| 4 | **غرفة التحكّم / The Control Room** | Sticky walkthrough (240vh): the `min(84vw,1320px)` DOM dashboard transitions through **دفعة تصل → الحالة تتحدّث → رؤية واحدة**; integrated title; premium «محاكاة مباشرة» disclosure chip | sticky viewport; mobile/reduced-motion = single composed panel |
| 5 | **لماكينات حقيقية / Real Machines** | **Machine cards**: three aspect-specific 3:4 masters (machine complete inside the crop-safe center), same flex-interpolation language as Act III; active card reveals benefit + a **text-link** CTA | row `clamp(480px,60vh,600px)` |
| 6 | **الإثبات والختام / Proof + Close + Footer** | Verified stats → light logo strip → close act (`64vh` class: hairline horizon light, headline, uncontested CTA) → compact functional footer | close is NOT 100vh; footer ≈ 300px |

## 4. Shared system (unified in this pass)

- **One radius** `--r: 18px`, one hairline `--line`, one content width `--w-content: 1240px`, one text measure `--w-text: 760px`.
- **One eyebrow**: cyan tick + meta label, every act.
- **One card language**: Acts III and V share the `.cards-row` flex-interpolation (active card `flex-grow: 2.3`, 400ms house curve); mobile turns the same rows into snap carousels (84% cards, no hover dependency, full content visible).
- **Accent contract**: cyan = system energy (pulse, status, active-card hairline, #prog). Warm = human action (buttons + `.tlink` text links). Nothing else colored.
- **CTA hierarchy (three tiers, one verb):** nav compact → hero dominant + ghost secondary → card text-links → close dominant. Five same-verb touchpoints, two dominant.
- **Type**: 4 sizes (display/beat/body/meta) + LED mono (digits/Latin only, `direction:ltr` isolated — machine IDs and SAR amounts never reverse in RTL).

## 5. Scroll contract (the double-scrollbar fix, root-caused)

`html` is the **only** vertical scroll container. Two root causes were fixed:
1. `body { overflow-x: hidden }` in `globals.css` silently computed `overflow-y: auto`, making `<body>` a second scroll container → changed to `overflow-x: clip` (clips without creating a scroll container; benefits all concepts).
2. The page's last element (`.foot`) pre-translated 12px for its reveal, extending body's scrollable area while media loaded → the footer is rise-exempt (fades in place).

`scripts/qa-onetap.mjs` now asserts **no rogue vertical scroll container** in loaded state AND mid-download (throttled network), on every viewport.

## 6. Density rules (audited)

- No automatic `min-height: 100vh` below the hero.
- Act padding: `calc(clamp(4rem, 8vw, 6.75rem) / 2)` — desktop inter-act gaps ≈ 128–216px, mobile ≈ 64–108px.
- Every viewport of scroll reveals information or advances a state; no dead black regions.

## 7. Motion

One law: 400ms `cubic-bezier(.22,1,.36,1)`; rises ≤ 12px; films play-once/entry-triggered and pause offscreen; the control walkthrough is the only scroll-driven state machine. Reduced motion: designed still states everywhere (no hero video element, pinned walkthrough state 3, static bars at final heights, carousels fully readable).

## 8. Footer (functional layer)

Brand + verified one-line description · section nav + hub link · WhatsApp + `hello@rpay.sa` + language switch · divider · copyright + wordmark. **Nothing invented** (no legal links, addresses, registration numbers). The floating WhatsApp widget hides (`.at-end`) whenever the close act or footer is visible — the closing CTA is never contested.

## 9. Intentionally rejected

Starburst network visualization (dead space, noise, disconnected 97) · full-bleed stacked machine strips (crops, seams, banner feel) · five equal orange buttons · Apple pastiche · light theme · WebGL · invented analytics to fill the dashboard · any baked text in generated media.
