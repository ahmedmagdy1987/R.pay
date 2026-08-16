===== CREATIVE-DIRECTOR =====
# Verdict on R.Pay — Creative Direction Review

## 1. The tier this reads as

**Engineering: premium, top 5%. Art direction: competent, bottom half. The site as a whole reads *good* and lands as *competent*.**

Be precise about the split, because it explains the owner's reaction better than any single critique:

The **code** is the work of someone genuinely excellent. `overflow-x: clip` root-caused from spec behaviour. The React-reconciliation-wipes-imperative-classes diagnosis. A reduced-motion contract that *restructures layout* instead of freezing it. 72 ImageBitmaps with a three-mode branch keeping mobile at 214 KB. A written claims ceiling banning invented SAMA/PCI numbers. That is senior craft and most agencies never get there.

The **brand** is the work of nobody. There is no art director in this repo. There is a very good developer making tasteful choices one page at a time.

Here is the test that settles the tier: **crop any screen of this site, remove the logo and the Arabic, and nobody can name the company — or even the category.** It could be a telco dashboard, a logistics SaaS, a Series-A infra tool, a Gulf bank's innovation lab. That is the definition of "no wow." Wow is not effects. Wow is *proprietary form*, and this brand owns none.

What does R.Pay actually own visually? A cyan→mint gradient, an 18px radius, and a hairline. The gradient is `#00AEEF → #1FD3B8` — process cyan into mint — which is the single most-used gradient in software. Jeton owns `#F73B20`. Lando Norris owns `#D2FF00`. Madar owns navy + coral. R.Pay owns a color you can find in two thousand pitch decks.

---

## 2. Why it doesn't produce a "wow" — the specific failures

**(a) Every element on the page is a familiar form.** Go down the inventory and check them off: gradient-clipped headline. Glassmorphic stat panel. Radar sweep with a geofence ping. Logo marquee with hover-pause. Sticky-scroll dashboard walkthrough. Flex-interpolated expanding cards. Expanding ripple ring on tap. Count-up numbers on scroll. Custom cursor glow. Magnetic buttons. Every one of these is executed at 8/10 and every one of them is a stock move. Nine stock moves at 8/10 average out to *competent*. One unfamiliar-but-legible form at 10/10 is what produces the reaction. There is no unfamiliar form anywhere in 5,144 lines of CSS.

**(b) The signature move is a ripple.** The video-timeline→DOM echo handoff (`HeroFilm.tsx:43-50` → `echo-ring` → staggered brand ignition) is genuinely rare *engineering*. But the form it produces is an expanding cyan circle — which is the exact cliché the team's own research banned when it appeared in the film ("terminal in a neon ring") and then permitted in the DOM. The mechanism is brilliant. The thing it draws is a contactless icon animating. Everyone's signature move is a ripple.

**(c) Arabic is a translation layer, not the design.** This is the biggest miss and the most defensible route to wow, and the dossier proves the failure at every level: `<html lang="ar">` with nineteen English `aria-label`s. Both languages in the DOM switched by CSS `display`. `--fa` is IBM Plex Sans Arabic — an *interface* face, IBM's corporate UI font, not a display face. `--fd` is Readex Pro — a friendly, low-contrast Google font. Bricolage (a Latin-only face) is forced onto Arabic headlines in `hub`, `coming-soon`, `cinema`, `pulse`, and `latest`, producing **synthetic bold above weight 700** — in Arabic that doesn't read as bold, it reads as smeared. There is no Arabic display commission, no Kufic geometry, no calligraphic proportion, no Arabic-derived grid, no numeral policy (Western digits everywhere except one stray Arabic-Indic in `cinema`). An Arabic-first Saudi payments brand that looks designed in English and translated is, in Riyadh, invisible. The one piece of real Arabic type craft in the entire repo — `flow.css:104-141`, leading set for Arabic first with `padding-block:.14em` so the damma clears, then *tightened* for Latin, screenshot-verified — is buried in a CSS comment where nobody will ever see it. That comment should have been the brief for the whole brand.

**(d) The imagery reads as AI, because it is.** The team's own reject list is the confession: "Nexxpa Herrutyge," "CUCCI," "CERAGTOYDO," a reader corrupted to "B.PAY." The mitigation was sound but residual artifacts shipped — the doubled phone edge at the hand in `hero-poster.webp`, garbled snack packaging in `network-hall.webp`, a hallucinated coffee-kiosk label. Worse than the artifacts: **nothing in the imagery is Saudi.** Every machine sits in the same moody teal-lit generic hall. There is no Riyadh light, no Boulevard World, no real retail context, no real operator. You have thirteen genuine Saudi client logos and zero photographs of the product in any of their venues.

**(e) You compressed the images until they stopped being premium.** 102 WebP averaging **19.5 KB**. The 1920px hero poster is **45 KB**. That is thumbnail weight. On a retina laptop, dark gradient falloff at that ratio turns to mush and banding — precisely where a premium image proves itself. LCP of 132 ms is a beautiful number and the wrong priority. Apple ships 300–500 KB hero stills. You optimised for Lighthouse and lost the photograph.

**(f) The correction to `latest` was subtraction with nothing put back.** The team correctly diagnosed the 7-layer glow stack, the `•••• 4291` fake card, the competing chip rows. Concept 08 removed all of it. But restraint without a proprietary form is not premium — it's just quiet. Linear is quiet *and* owns a specific noise-gradient texture, a specific type ramp, a specific icon geometry. One-tap is quiet and generic. Subtraction got you from "noisy" to "clean." Only invention gets you from "clean" to "wow."

**(g) The core product argument is a labelled placeholder.** ControlRoom refuses to fake a dashboard — right call, real integrity. But the result costs the user **240vh of scroll with zero focusable content** to watch three DOM bars rise under a «محاكاة مباشرة» disclaimer. You spend the most expensive real estate on the page showing a simulation of nothing, and then correctly tell the visitor it isn't real.

**(h) Pixel-level craft debt that nobody names but everybody feels.** Half-pixel type sizes (10.5, 12.5, 13.5, 16.5 px) appearing dozens of times. Nineteen distinct line-heights. Fifteen tracking values. Four content max-widths. Three `--padx` definitions. Five values for "muted" across four token names. And the one that will humiliate you in a demo: `one-tap.css:230` puts `border-radius: 8px` inside the `:focus-visible` rule, so **tabbing to any primary CTA morphs the 999px pill into an 8px rectangle over 400 ms.** Premium is not the presence of great decisions. It is the absence of any single wrong pixel.

**(i) The first thing anyone sees is a menu.** More on this below.

---

## 3. Eight concepts behind a hub — consolidate. Immediately and without sentiment.

**For consolidation. Strongly.** The gallery isn't a portfolio; it's an unmade decision billed as a feature, and it is directly responsible for the substantive failures.

The optionality has a measurable price, and the dossier itemises it:

- **1,400 lines of triplicated CSS** across `latest`/`machine`/`video-hero`, already silently diverged (the `latest` hero has a tombstone comment for a block still live in `video-hero`).
- **Two contradictory placements of the same WhatsApp widget** — physical-right on three routes, logical-start on four. Same component, opposite screen edges depending on route and language.
- **Two spellings of the company name in Arabic**: «آر باي» on six routes, «ار باي» on two.
- **"Auto cashback" and "Auto refunds" shipping simultaneously** — different financial products, on the same site, describing the same feature.
- And the one that should end the argument: **the site cannot say who the company is.** Concepts 01–05 present "أكبر مشغّل لمكائن ألعاب الأركيد في المنطقة" as R.Pay's own credential. Concepts 07–08 reframe the identical sentence as a *customer*. Nobody had to resolve whether R.Pay **is** the region's largest arcade operator or **serves** it, because there was always another page to build instead. Optionality produced a factual contradiction about the company's own identity.

Meanwhile the actual revenue blockers sit untouched: no pricing, no PCI DSS statement, no SAMA position, **four `href="#"` links labelled "الامتثال / Compliance,"** a decorative "النظام يعمل / System Operational" light wired to nothing, zero case studies behind thirteen logos, and no contact form. A Saudi payments vendor that cannot name its regulator will not clear enterprise procurement — that is a revenue problem, and eight concepts is why it's unsolved.

There is also the brand argument, which matters more: **wow requires conviction, and a gallery of eight is the visual grammar of having none.** "Here are eight ways we could look" is the opposite statement from "this is what we are." Worse, the hub labels two of them "مُستعاد / Restored" — a scar shown to the public as a status. No one has ever been wowed by a menu.

Keep the exploration. Kill the deployment. One deck, internal, archived. Ship one URL.

**The merge is obvious and the content team already named it:** concept 08's narrative + concept 01's information depth. But note that merge only gets you to a good page. Neither concept has a brand layer, and that is the actual gap — see §5.

---

## 4. What is genuinely good and must survive

Not diplomacy. These are the assets:

1. **The accent contract** (`one-tap.css:12-17`): cyan = system energy only (pulse, status, LED, `#prog`), never on a button; warm = human action only, never on data; **nothing else is coloured.** Audited and actually held across 1,199 lines. Most teams declare this rule and break it in week two. Keep the rule verbatim; replace only the hues.
2. **The honest-simulation discipline.** Every fabricated figure pilled «محاكاة مباشرة». `ControlRoom.tsx:9-11` explicitly refusing to fake a dashboard screenshot. In a payments pitch this isn't a limitation — it's a differentiator you should say out loud on the page.
3. **The verified-stats canon and the claims ceiling.** 465,255+ / 97 / 9,434 / 9, byte-identical across eight pages, with a written ban on inventing SAMA, PCI, uptime, or city counts. That document is worth more than the website.
4. **The video→DOM handoff mechanism** (`onTimeUpdate` at a measured `PULSE_AT`, `echoFired` ref, double-rAF replay reset). Keep the mechanism. Redraw what it produces.
5. **`flow.css:104-141` — Arabic-first leading, tightened for Latin, screenshot-verified.** This is the seed of the entire future brand. Promote it from a comment to a principle.
6. **The bidi discipline.** `direction: ltr; unicode-bidi: isolate` on LED/mono windows. Machine IDs and SAR amounts never reversing in RTL. Mirrored `@keyframes` for the RTL marquee and runner. `.brand { direction: ltr }` after "Pay R." was caught. Nobody ships this.
7. **`DropSequence.tsx`** — 72 frames, blob→ImageBitmap with an `<img>.decode()` fallback, deliberate non-uniform sampling documented as DO-NOT-FIX, three-mode branch keeping mobile at 214 KB. Best asset engineering in the repo by a distance.
8. **The reduced-motion contract that restructures instead of freezing** — sticky collapses to static, states pin to resolved, no video bytes fetched at all.
9. **One-tap's CTA architecture**: one verb, five placements, card CTAs deliberately *text* links so they never compete, the floating widget yielding at the close so the final ask is uncontested, and «عبر واتساب — بالعربية أو الإنجليزية» as friction removal.
10. **The refusal list** (`CONCEPT_08_VISUAL_SYSTEM.md` §9). Knowing what you won't do is 80% of art direction. Whoever wrote it should be given the brand.
11. **The copy in 07/08.** «ادفع. خُذ.» / «لمسة واحدة. تحكّم كامل.» / «وفي الطرف الآخر… أنت.» The writing is the best thing on the site in either language. The failure is not copy.

---

## 5. The direction: **الوَصْل — Al-Wasl**

*(the joining · the connection · and, in Saudi commerce, the receipt)*

**Manifesto.** Arabic does not place letters beside one another; it *joins* them, and the stroke that does the joining — the kashida — is the only mark in typography that is simultaneously a letter, a line, and a length of time. R.Pay is that stroke. A machine in a mall in Riyadh stands alone all day until a hand touches it; the tap joins the machine to a card, the card to an account, the account to an operator watching ninety-seven of them on one surface — and **وصل is also the Arabic word for a receipt**, the plain paper proof that the join occurred. So the brand owns exactly one form: a single horizontal stroke, one weight, that extends, carries, arrives, and stops. It is the progress hairline, the rule under the active card, the ledger line beneath every number, the path a payment travels across the network map, the line that grows under the headline as the film plays, and the elongation inside the wordmark itself. It never becomes a gradient. It never glows. It never becomes a ring. Everything else is near-silent — one warm ink ground, one paper-warm off-white, one accent that is **not cyan** — so that the only element that is coloured, and the only element that ever moves, is the join. The page should read the way a receipt reads: right to left, unarguable, and finished.

**The five hard decisions this direction forces — all cheap, all high-impact:**

1. **Delete cyan. Promote warm.** Kill `--grad`, kill every `background-clip: text` headline, kill `#00AEEF` as the brand colour. Elevate `--warm` (`#FFB454`) from CTA-only to *the* brand colour. Every fintech in the world is blue or purple; sodium-amber on near-black is instantly unmistakable, it holds AA on dark, it reads as gulf light rather than Silicon Valley, and — critically — it is already validated in your repo. This is the single highest-leverage change in this document, and it explains why one-tap already felt better than the others: it was the only page with a warm anchor.
2. **Commission the Arabic. Derive the Latin.** Retire Readex Pro, Bricolage, and Plex Arabic-as-display. License one bilingual superfamily where Arabic and Latin share a skeleton (29LT Bukra, or TPTQ's Greta Arabic + Greta Sans) — or commission a display Arabic and cut a matching Latin from it. Cap weights at what the Arabic face actually has; the synthetic 800/900 on Arabic dies today. This is the difference between a Saudi brand and a brand available in Saudi Arabia.
3. **Make the kashida a literal, spec'd asset.** One weight. Animated by *length only* — never opacity, never glow, never blur. It appears six times per page in six roles. A single proprietary form repeating six times is what makes a brand recognisable from a crop, and it is the thing you currently do not have.
4. **Shoot one day of real photography.** A real R.Pay terminal, in a real hall, with real Saudi light and real client branding. One day of production beats 430 Higgsfield credits, kills the artifact problem permanently, and gives you the only thing AI cannot fake — proof that the product exists in the world. Keep AI for motion beats where photography is impractical; anchor everything else to real plates. And ship the stills at 250–400 KB, not 45.
5. **Replace the fake dashboard with one real receipt.** Not a mock, not a simulation with a disclaimer: one true transaction, rendered with total typographic care — *SAR 5.00 · Sparky's, Riyadh Park · A-14 · 14:22 · settled to the operator account*. That single object argues the entire product (where the money lands, which machine, which branch, how fast) with more force than 240vh of rising bars, requires zero fabrication, and is exactly on the الوصل thesis. It's also the page's wow: an object nobody has seen rendered beautifully before.

---

## 6. Three benchmarks — and precisely what to take

**1. Jeton — jeton.com (Bürocratik, Awwwards SOTD).**
**Steal: single-hue commitment at scale.** One saturated colour (`#F73B20`) on a near-monochrome base, deployed as *large flat fields and full type*, never as a gradient and never as a glow. That's the mechanism that makes a screenshot instantly attributable. Steal also their type-as-image scale — the headline *is* the artwork, not a caption above one. **Do not steal** the playfulness or the illustration language; wrong register for unattended-commerce infrastructure in KSA.

**2. Tamara — and specifically 29LT's bilingual wordmark work (Pascal Zoghbi with Linda Hintz).**
**Steal the process, not the look:** the Arabic and Latin are drawn as *one design* — shared skeleton, shared curvature, shared terminals — so the brand is the same object in both scripts. Right now "R.Pay" and «آر باي» are two unrelated objects, and one page spells the Arabic two different ways. The order matters and it is the whole lesson: **draw the Arabic first, cut the Latin from it.** Every brand that reads as authentically Gulf-premium did it in that order; every brand that reads as imported did it backwards. (NEOM is the other precedent worth studying — a custom Kufic-derived display family, commissioned rather than picked. That is the tier you are claiming and the tier you have not paid for.)

**3. Stripe — the Terminal / hardware pages.**
**Steal the receipt.** Stripe's `$173.88 Rocket Rental` is one mundane, specific, true transaction rendered with enormous care, and it does more persuasive work than any dashboard illustration on the internet. It is exactly the move that solves your ControlRoom problem: real, specific, unfakeable, and it needs no disclaimer. Steal also Stripe's rule that product surfaces are shown at *real fidelity or not at all* — never as an "illustrative simulation." **Do not steal** Stripe's density, its cool blue-violet palette, or its developer-audience information architecture; your buyer is an arcade operator with 97 machines, not a backend engineer.

---

**The five moves, in order, if you only do five:** kill the cyan gradient and promote warm · license/commission a real bilingual Arabic display family · shoot one day of real photography and ship the stills heavy · collapse eight routes to one and archive the rest · replace the simulated dashboard with one true receipt. Then fix `one-tap.css:230` before anyone tabs through it in a live demo.

===== MOTION-DESIGNER =====
# R.Pay — Motion Language Judgment

## 0. Verdict in one paragraph

Two moments in this repo are cinematic. Everything else is `opacity: 0 → 1` plus `translateY(12px)`, wearing a film's clothes. The tell is simple: delete every `<video>` and `<canvas>` from the codebase and what remains — across 5,144 lines of CSS and 81 keyframes — is a fade-in, a 12-pixel drift, a marquee, and a hover lift. The **media** is cinematic. The **interface** is a competent 2019 marketing site. Concepts 07 and 08 know the difference and get closest, but they still confuse *declaring a law* (one duration, one curve) with *having a language* (causality, hierarchy, and a clock).

---

## 1. Is it cinematic, or fade-in-on-scroll dressed up as cinema?

It is fade-in-on-scroll, with two genuine exceptions and one measurable lie.

**The two exceptions are real.** `flow`'s 500vh canvas frame-sequence (`DropSequence.tsx`) is legitimately good work — the non-uniform frame sampling with a deliberately linear map (`frameIndex = Math.round(p * 71)`, header comment lines 4–12) is the kind of decision that only comes from watching it and fixing it, and the three-mode `useLayoutEffect` branch that keeps mobile at 214 KB is better engineering than most agency sites ship. And `one-tap`'s video→DOM handoff (`HeroFilm.tsx:43-50` → `one-tap.css:272-291`, `:358-364`) is the single best *idea* on the site: the film's own timeline reaches out and ignites the DOM. That is a premium instinct.

**But both are media being cinematic, not motion design.** In `flow`, the canvas is a movie; the DOM elements around it (`.beat`, `.traylight`, `.tray-cta`) receive binary class toggles and one linear opacity ramp. In `one-tap`, the "handoff" is a circle scaling to `scale(90)` and five `<span>`s changing opacity on a 70ms index stagger. Strip the video and the canvas and neither act has choreography — they have triggers.

**The measurable lie is the motion law itself.** `one-tap.css:91-97` and `flow.css:783-789` declare 400ms / `cubic-bezier(.22, 1, .36, 1)` as a hard rule. Run the curve:

| time | distance covered |
|---|---|
| 77 ms (19%) | 66% |
| 137 ms (34%) | 88% |
| 400 ms (100%) | 100% |

For a 12px rise that means **10.6px of the 12px is travelled in the first 137ms**, and the remaining 1.4px is spread over 263ms — under a pixel per frame, invisible. Opacity does the same. So the declared "400ms motion law" is, perceptually, a **140ms fade with a 260ms dead tail**. The page does not feel slow and considered; it feels like things pop. That is the entire reason it reads as "fade-in dressed up."

**Four more structural tells:**

1. **81 keyframes, zero relationships.** There is no timeline anywhere in this repo — only triggers. Every animation knows its own start time and nothing else. Cinema is a timeline; a trigger is a light switch.
2. **12px is a fade with an alibi.** And it is a *fixed* 12px, applied identically to a `clamp(2.7rem, 7.2vw, 6.2rem)` display headline and a `.8rem` meta label. On the headline that is 12% of a line; on the label it is 100%. One distance for all type sizes is the signature of a system that was never art-directed in time.
3. **Nothing ever exits.** IntersectionObserver adds `.in` and calls `unobserve` (all seven reveal implementations). The page is a one-way ratchet. There are no cuts, no exits, no reversibility — the three things that make scroll feel like film rather than like a list.
4. **The ambient loops are noise, not score.** Radar sweep 4.5s, `fencepulse` 8s, `devmove` 8s, `orbSpin` 14s, `rp-breathe` 7s, marquee 42s, pulse's radar 9s — mutually incommensurate periods running simultaneously in the same viewport. Any two loops with unrelated periods produce visual beating that reads as *busy*, not *alive*. A score has one meter. This has seven.

The repo's own research document diagnoses this correctly and then does not implement the fix. `CONCEPT_08_RESEARCH.md` writes *"The motion budget is spent on the hero"* and *"every animation resolves into a composed still that is the next section's layout."* Concept 08 achieves **resolution** — every act does land on a composed still. It never achieves **causality** — no act's motion is caused by the previous act's motion. That is the gap between this and Terminal Industries / Lusion / OFF+BRAND.

---

## 2. The precise difference — techniques that are missing

Premium motion work differs from this on fourteen specific counts. Every one is absent here, and I can point at where.

**1 — One master clock per act.** Premium: each act computes a single normalized `p` and *derives* every sub-element from it (position, opacity, blur, color, stagger phase). Here, `ControlRoom.tsx:51-52` computes exactly that `p` and then throws it away — it thresholds it into `1|2|3` and hands three discrete classes to CSS. A continuous variable was reduced to three states. `DropSequence` does keep `p` continuous for the canvas and then thresholds it for everything else (`BEATS`, `CTA_AT`). The clock exists in both files and is deliberately discarded.

**2 — Geometric stagger.** Everything here staggers by DOM index: `${i * 70}ms` (`one-tap/page.tsx:131`), `${i * 45}ms` (`ControlRoom.tsx:150`), `.d1`–`.d5` classes. Premium work staggers by *distance from an origin point* — the point where the previous motion ended. Index-stagger reads as a list animating; distance-stagger reads as a force propagating. This matters doubly here: in RTL, index-stagger produces the identical order as LTR, whereas distance-stagger genuinely inverts. The research doc explicitly asks for *"RTL mirrors motion, not just layout"* and the codebase never delivers it beyond mirroring two keyframes (`runner-rtl`, `plmarq-r`).

**3 — Masked, line-by-line type reveals.** Not one `clip-path` or `overflow: clip` text mask exists in 5,144 lines. All headline copy arrives by opacity. A per-line wipe from a 100%-offset inside a clipped parent is the most basic premium text technique and it is nowhere.

**4 — Variable-axis type motion.** `Bricolage_Grotesque` is loaded as a *variable* font (`app/layout.tsx:6-10`, no weight array) and zero axes are ever animated. Meanwhile `flow`/`one-tap` self-host **three static instances** of Readex Pro (400/600/700, 72 KB) — a typeface that ships as a variable font with a `wght` axis spanning roughly 160–700 **and covers Arabic**. Self-hosting the variable woff2 instead would be one file, likely lighter than the three statics, and would unlock `font-variation-settings` interpolation during reveal — weight-axis motion on Arabic display type, which almost nobody has done well. Currently: one variable font unused, one variable font shipped as statics.

**5 — Scroll-velocity secondary motion.** No handler in the repo computes `dv/dt`. Premium scroll work damps a velocity term into a subtle skew, scale, or directional blur so the page has inertia. Every scroll consumer here reads position only.

**6 — Spring physics, used exactly once.** There is no spring anywhere — one cubic-bezier for every distance, every mass, every hierarchy tier. Premium systems reserve overshoot for the single most important affordance. Nothing here overshoots.

**7 — Anticipation and follow-through.** No element counter-moves before moving, and nothing settles after arriving. Everything is a pure ease-out from A to B.

**8 — Motion hierarchy in time.** During a reveal here, every element in the viewport moves with identical amplitude (12px) and identical curve. Premium: one primary object moves; secondaries move at ≤40% amplitude with a phase offset. Without amplitude hierarchy, the eye has nowhere to land.

**9 — Shared-element / FLIP continuity between acts.** Every section here begins from nothing. Nothing is carried across an act boundary. The `.cards-row` flex-grow interpolation (`one-tap.css:483-488`) is the only genuinely continuous layout transition in the repo, and it is used twice, for the same trick, back-to-back (Acts III and V).

**10 — Compositor-driven scroll animation.** Verified in the dossier and confirmed: **zero uses of `animation-timeline` / `scroll()` / `view()` anywhere.** Every scroll effect is main-thread JS. On desktop this is invisible; on a Snapdragon 6-series it is the difference between motion that tracks the finger and motion that arrives 80ms after it.

**11 — Cross-media continuity as a system.** The video→DOM echo is the best thing here and it is a **one-off**. It happens once, on one page, at one timestamp. Premium work makes that the *grammar*: the film's grade, its camera motion, and its event timeline all continue into the DOM at every boundary.

**12 — Color as travelling energy.** The accent contract (`one-tap.css:12-17`, cyan = system energy, warm = human action) is genuinely excellent — most systems declare that rule and break it in a week; this one holds. But cyan only ever **switches on**. It never **travels**. A colour that propagates along a path is one of the cheapest premium effects available and this design has already earned the right to it.

**13 — Reversibility.** Covered above. One-way ratchets feel like documents.

**14 — A dead-frame audit.** In `one-tap`'s hero, from t=0 to t=3200ms the DOM does nothing at all — the video does everything and the interface waits. Premium hero work has *something* continuously in motion (usually a slow camera push) so no frame is inert.

---

## 3. Concrete motion language proposal

Put this in `globals.css`, which currently contains **one transition and zero keyframes**. That is the root cause of the drift the dossier catalogues.

### 3.1 Easing set — five curves, each with a job

```css
:root {
  /* WORKHORSE — 80% of all motion. Visibly in motion for 2/3 of its duration.
     Checkpoints: 27% time → 50% distance · 44% → 78% · 66% → 94%. */
  --e-move:  cubic-bezier(0.30, 0.00, 0.10, 1.00);

  /* ENTRANCE — only for displacement ≥ 48px, where the expo tail is still
     perceptible. This is the current house curve, correctly demoted. */
  --e-enter: cubic-bezier(0.16, 1.00, 0.30, 1.00);

  /* EXIT — accelerate away, no settle. Exits should be 60% the duration of
     their matching entrance and must not ease out. */
  --e-exit:  cubic-bezier(0.50, 0.00, 1.00, 1.00);

  /* MORPH — both endpoints on screen (bar heights, card flex-grow,
     sticky-CTA slide, accordion rows). Symmetric in/out. */
  --e-morph: cubic-bezier(0.65, 0.00, 0.35, 1.00);

  /* SPRING — sampled critically-underdamped spring, ~4% overshoot.
     Used on EXACTLY ONE element class page-wide: the primary CTA.
     No library; native linear() (Chrome 113+, Safari 17.2+, FF 112+). */
  --e-spring: linear(
    0, 0.006, 0.025 2.8%, 0.101 6.1%, 0.539 18.9%, 0.721 25.3%,
    0.849 31.5%, 0.937 38.1%, 0.968 41.8%, 0.991 45.7%,
    1.006 50.1%, 1.015 60.2%, 1.006 76%, 1
  );
}
```

Feature-detect the spring: `@supports (transition-timing-function: linear(0,1))`, falling back to `--e-enter`.

### 3.2 Duration scale — a ratio ladder, tied to distance

The governing arithmetic: **perceived speed at the curve's plateau must stay near 150–200 px/s.** A duration is not a style choice; it is `distance ÷ target velocity`.

```css
:root {
  --d-1:  120ms;  /* micro-state: hover tint, focus ring, icon swap, chip on/off */
  --d-2:  200ms;  /* control: button press, LED, toggle, tooltip */
  --d-3:  320ms;  /* element reveal (≤ 24px), small layout shift */
  --d-4:  520ms;  /* layout change: flex-grow, grid-template-rows 0fr→1fr, accordion */
  --d-5:  840ms;  /* act-level entrance, hero copy line, sticky-CTA arrival */
  --d-6: 1400ms;  /* SIGNATURE ONLY. Budget: two per page. */
}
```

Distance→duration table (use it, don't guess):

| displacement | duration | curve |
|---|---|---|
| ≤ 8 px | `--d-1` | `--e-move` |
| 8–24 px | `--d-3` | `--e-move` |
| 24–64 px | `--d-4` | `--e-move` |
| 64–200 px | `--d-5` | `--e-enter` |
| viewport-scale | `--d-6` | `--e-enter` |

And make the reveal distance **type-relative**, not absolute:

```css
:root { --mo-rise: 0.5em; }   /* scales with the element's own font-size */
.reveals [data-rise] { transform: translateY(var(--mo-rise)); }
```

A `6.2rem` headline now rises ~50px; a `.8rem` label rises ~6px. One token, and the reveal instantly acquires hierarchy it has never had.

### 3.3 Stagger rhythm

Index-linear stagger (`i * 70ms`) is wrong twice: it has no ceiling, and it encodes DOM order rather than physical order.

**Sub-linear index stagger** for lists and rows:

```
delay(i) = 70ms · i^0.7
```

`i=0,1,2,…,7` → `0, 70, 114, 150, 182, 210, 236, 260ms`. An 8-item row completes its cascade in 260ms instead of 490ms, and the perceived rhythm accelerates rather than plodding.

**Geometric stagger** for anything with a physical origin (the hero handoff, act entrances, the fleet grid):

```
delay(el) = 220ms · ‖center(el) − origin‖ / maxDistance
```

Batch-measure once per act on first reveal and on `resize`/language change; cache. This is the single technique that would most change how this site feels, and it costs one `getBoundingClientRect` pass.

### 3.4 Kill the `transition-property: all` footgun without losing the law

The "one law" ergonomic is worth keeping. The `all` default is not — it is what forces the ten clawback rules (`one-tap.css:358, 483, 541, 665, 672, 791, 826, 849, 1027, 1038`), what animates `#prog`'s width on every rAF frame, and what turns the `border-radius: 8px` focus bug into a visible 400ms morph.

```css
.onetap *, .onetap *::before, .onetap *::after {
  transition-property:
    opacity, transform, color, background-color, border-color,
    box-shadow, filter, clip-path, flex-grow, grid-template-rows,
    font-variation-settings;
  transition-duration: var(--d-3);
  transition-timing-function: var(--e-move);
}
```

Ten clawback rules can then be deleted, `#prog` stops thrashing, `.traylight` converges instead of lagging the scrub by up to 400ms, and `border-radius` is no longer in the list — so the focus-ring pill deformation becomes invisible even before the underlying bug is fixed. One edit, five bugs.

### 3.5 The governing principle

> **One cause, one consequence, one clock per act. The page has one moving object at a time; everything else is its wake.**

Every motion must be traceable to the motion that preceded it, and must resolve into the composition the next act begins from. Concept 08 already delivers the second half. The first half is what's missing, and it is what separates this from the reference set.

Practical enforcement rules:
- Per viewport, **at most one infinite loop** may be visible. Where two are unavoidable, their periods must be integer multiples of a common base (I'd use 1.4s) so they phase-lock instead of beating.
- No two elements may begin moving at the same instant unless they are the same object.
- An act's entrance origin is the point where the previous act's motion ended.

---

## 4. The hero: the first 3 seconds

Current `HeroFilm.tsx` reality: poster paints at ~132ms (excellent), video crossfades on `onCanPlay`, plays 8s, `onTimeUpdate` catches `currentTime >= 3.2`, echo ring + brands ignite. Between t=0 and t=3200 **the interface does nothing**. And the whole thing hangs off `autoPlay` with no `.catch()` — if the UA refuses playback (iOS Low Power Mode, data-saver), `onCanPlay` still fires, `on` still becomes true, and the echo *never runs, permanently*. The signature moment of the page is one unhandled promise away from never happening.

Here is a 3-second score. All of it is `useEffect` + WAAPI + one canvas call. No dependencies.

**t = −∞ (build/SSR).** Fix three things that make the score possible at all:
- `<picture>` with `media` attributes for the poster, replacing the `useState(POSTER)` client swap (`HeroFilm.tsx:25, 39`) — mobile currently downloads *both* posters and shows the wrong crop until hydration.
- `fetchPriority="high"` on the poster (`:89`) — the comment at `:15` names it as LCP and nothing tells the browser.
- `<link rel="preload" as="font" type="font/woff2" crossorigin>` for the display face, plus `font-display: optional`. A FOUT landing in the middle of a text wipe is fatal, and there is currently no preload for `readex-pro-700.woff2` at all.

**t = 0.** Poster + kicker + headline **line 1** are painted server-side. Line 1 is the LCP text and must never animate. Line 2 sits at `translateY(100%)` inside an `overflow: clip` wrapper — applied only under the JS-added `.reveals` class, so a no-JS render shows both lines normally.

**t = 0 → 120 ms. Deliberate stillness.** No motion. A held beat before the first move is what separates "designed" from "loading."

**t = 120 → 560 ms.** Headline line 2 wipes up from the clip mask. 440ms, `--e-move`. Simultaneously — and this is the fix for the dead-frame problem — the poster begins a `scale(1) → scale(1.035)` push over **2400ms** with `--e-morph`, running underneath everything else. The camera never stops during the opening. One transform, GPU-composited, zero cost.

**t = 300 ms.** Kicker and sub-headline: opacity + `translateY(0.5em)`, `--d-3`, `--e-move`, geometric stagger from the headline's baseline.

**t = 520 ms.** CTA pair. The primary is the **only** element on the page permitted `--e-spring`: `scale(0.96) → 1` over `--d-4`, with the warm glow overshooting ~4% and settling. That overshoot is the page's entire spring budget, spent on the thing you want clicked.

**t = 700 → 1300 ms.** Video crossfades in over the poster (it has been decoding since t≈0 under `preload="auto"`). Poster stays underneath — no black flash on failure. Note the video must inherit the *same* scale transform value the poster has reached at t=700 (≈1.008), or the handoff produces a visible jump. Compute it, don't eyeball it.

**t = 3200 ms. The handoff — with three defects fixed.**

1. **Drive the film's clock frame-accurately.** `onTimeUpdate` fires ~4×/s, so the echo currently lands up to 250ms late — which is exactly why the handoff feels *close* rather than *exact*. Use `requestVideoFrameCallback`:

```js
const step = (_now, meta) => {
  if (meta.mediaTime >= PULSE_AT) return fire();
  v.requestVideoFrameCallback(step);
};
if ("requestVideoFrameCallback" in v) v.requestVideoFrameCallback(step);
// else keep onTimeUpdate as the fallback path
```
Chrome 83+ / Safari 15.4+. This synchronises the DOM event to the *presented compositor frame*, not to a 250ms polling window.

2. **Make the score deterministic regardless of media.** Play imperatively and arm a failsafe:

```js
v.play().catch(fire);                                  // refusal → fire anyway
const t = setTimeout(fire, PULSE_AT * 1000 + 400);     // stall/block → fire anyway
```
`fire()` is idempotent via the existing `echoFired` ref. The hero's signature moment now runs on every device, in every network condition, with or without video. That is the single highest-value fix in this document.

3. **Replace the ring.** See §8.

**Total main-thread cost of the whole 3-second score:** one `getBoundingClientRect` batch (~1ms), a handful of `element.animate()` calls, and one `drawImage` at the handoff. Everything else is compositor.

---

## 5. Scroll choreography — the exact mechanism

**Four tiers. Not one mechanism — a hierarchy, chosen per-effect.**

### Tier A — Native CSS scroll-driven animation for every reveal and every parallax

```css
@supports (animation-timeline: view()) {
  .reveals [data-rise] {
    animation: rise linear both;
    animation-timeline: view();
    animation-range: entry 15% entry 55%;
  }
}
@keyframes rise {
  from { opacity: 0; transform: translateY(var(--mo-rise)); }
  to   { opacity: 1; transform: none; }
}
```

**Why this and not IntersectionObserver:** IO callbacks run on the main thread. On a mid-tier Android, an IO callback queued behind a 300ms long task fires *after* the user has already scrolled past the element — the card appears already-in-place, or worse, animates while off-screen. `animation-timeline` runs on the compositor. It cannot be starved by JS. This is the largest single mobile improvement available and it costs zero bytes.

Support: Chrome/Edge 115+, Safari 26, Firefox behind a flag. Keep the existing IO path inside the `@supports` negative branch — you already have it working, including the two traps it correctly solves (`ioTail` for bottom-anchored elements, and the `.cards-reveal` static-className wrapper).

**Honest tradeoff:** `view()` makes reveals *scrubbed and reversible*, not fire-once. Elements will fade back out on reverse-scroll. I consider that an upgrade — it ties the page physically to the finger, and it fixes the one-way-ratchet problem from §1 — but it is a design contract change and someone has to sign off. If play-once is mandatory, keep IO for reveals and use `animation-timeline` only for parallax and the progress bar.

Also: this immediately fixes `#prog`. `animation-timeline: scroll(root)` with `scaleX(0) → scaleX(1)` replaces four unthrottled scroll handlers writing `style.width` — and `scaleX` composites where `width` triggers layout.

### Tier B — Canvas image-sequence scrubbing, for exactly one act per site

`DropSequence` is the right technique for the right reason, and it should stay. `video.currentTime` scrubbing (what `VendingScroll` does) cannot deliver reliable random access — iOS Safari serialises seeks and drops most of them, Android WebView is worse, and every seek forces a keyframe-relative decode. Decoding to `ImageBitmap` up front converts an unpredictable decode cost into a predictable memory cost.

But fix the memory: **72 × 1100 × 618 × 4 bytes ≈ 187 MB of resident bitmap.** That is an OOM on a 3 GB Android and nothing caps it. Window the decode — keep the 1.23 MB of blobs (cheap), decode a ±12-frame ring buffer around `currentFrame`, `close()` outside the window. Also cap canvas DPR at 1.5 rather than 2 (`DropSequence.tsx:102`): for a photographic source the difference is imperceptible and it removes 44% of the fill.

And throttle the 72 parallel `fetch()` calls (`:96`) to a window of 6. On HTTP/1.1 the current loop saturates the connection pool and competes with the hero video and the fonts.

### Tier C — WAAPI timelines with manually-driven `currentTime`, not GSAP

For scroll-linked sequences that are too complex for CSS (the ControlRoom walkthrough), build a real timeline without shipping a timeline library:

```js
const tl = el.animate(keyframes, { duration: 1000, fill: "both", easing: "linear" });
tl.pause();
// in the shared scroll manager's write phase:
tl.currentTime = p * 1000;
```

You get labels (pick your own ms offsets), scrubbing, and — critically — **compositor-driven interpolation** for transform/opacity, because the animation is registered with the compositor even though its time is driven from JS. Roughly 15 lines. This is what `ControlRoom` should be instead of thresholding a continuous `p` into three classes.

**Why not GSAP ScrollTrigger:** (a) ~34 KB gzipped for core + ScrollTrigger, on a route whose entire First Load JS is currently 94.4 KB — a 36% increase to animate things the platform now animates natively; (b) it drives everything from the main thread via rAF, which is precisely the wrong architecture for the low-end Android case, and its `scrub` smoothing makes main-thread starvation *more* visible, not less; (c) the repo has already hand-rolled correct pinning twice and the code is fine. GSAP's real value is the **authoring API**, and Tier C gets you 80% of it for 0 KB. If the team's constraint is authoring speed rather than runtime, that's a legitimate reason to buy it — but say that out loud rather than dressing it as a performance decision.

### Tier D — One shared scroll manager, non-negotiable

Currently: 15 scroll listeners repo-wide, 4 on `one-tap` alone, 3 of them forcing synchronous layout every frame (`document.documentElement.scrollHeight` at `page.tsx:31, 77` and `StickyCTA.tsx:25`; a `querySelectorAll` + rect loop at `StickyCTA.tsx:15-20`). Plus unthrottled `pointermove` handlers in `machine`/`video-hero` that query the DOM and measure ~15 rects on every raw event — at up to 1000 Hz on a gaming mouse. `latest/page.tsx:144-165` already fixed exactly this and documented why; the fix was never backported.

Replace with one module: one passive `scroll` listener → one rAF → **read phase** (every `getBoundingClientRect` in a single batch) → **write phase** (every style mutation). Fastdom's read/write split. On a Snapdragon 6-series that is the difference between 6ms and 16ms frames.

### Low-end Android specifics

- Android Chrome scrolls on the compositor at up to 120 Hz while `scroll` events fire at ~60 Hz. **Any JS-driven scroll effect will always lag the finger on those devices.** Compositor-driven will not. That is the whole argument for Tier A.
- **Never** animate `filter: blur()` or `backdrop-filter` on scroll. `pulse.css:485-488` animates a 560×560 conic gradient under `blur(60px)` on an infinite loop — on a Mali or mid-tier Adreno that is a guaranteed frame-drop generator. There are 16 `backdrop-filter` uses each in `cinema.css` and `pulse.css`; `one-tap.css` has **zero**, which is a deliberate and correct divergence — make it the rule.
- Add `content-visibility: auto` + `contain-intrinsic-size` to every act below the fold. Free, large, and completely absent.
- Retire `VendingScroll` or convert it to 24 stills. 4.05 MB at `preload="auto"`, no poster, no reduced-motion path, no mobile path, `currentTime` scrubbing across 620vh — it is the single worst thing in the repo and `DropSequence` already solves the same problem correctly.

---

## 6. Three.js — drop it

`three@0.149.0` is January 2023. Pre-WebGPU renderer, still on `outputEncoding` rather than `outputColorSpace`, and three-plus years of upstream fixes behind. But the version is not the argument.

**It is used in exactly one place, for a fullscreen quad.** `LiquidBackground.tsx` builds a bare `THREE.Camera`, a `PlaneGeometry(2,2)`, and a `ShaderMaterial`. No scene graph, no lights, no models, no raycasting, no loaders. That is ~150 KB gzipped of scene-graph machinery to call `gl.drawArrays` on two triangles. Raw WebGL2 does it in about 60 lines and ~1.5 KB.

**And the thing itself should not exist.** It is a 5-octave FBM noise field with three drifting blobs — precisely the *"7-layer glow stacks"* and *"neon everywhere"* the project's own `CONCEPT_08_RESEARCH.md` §2.5 lists as banned anti-patterns, and precisely the *"hierarchy collapse"* it names `latest` for. It contributes nothing to the narrative. Worse, on two of the three routes that mount it, `html.light #liquid { display: none }` (`latest.css:690`, `video-hero.css:532`) while the rAF loop at `LiquidBackground.tsx:109` runs unconditionally — **light-theme users pay full GPU and main-thread cost to render an invisible canvas at 60fps.**

The guarding is otherwise genuinely careful (reduced-motion bail before import, dynamic import so `three` never reaches concepts 04–08, resolution scaling, idle drift, `document.hidden` skip, full teardown). It is well-engineered scaffolding around something that should not ship.

**Recommendation: remove `three` from `package.json`.** If an ambient shader field survives art direction, reimplement in raw WebGL2 — `powerPreference: "low-power"`, an IntersectionObserver that actually cancels the rAF when the canvas leaves the viewport or the theme hides it, and a hard 30fps cap (nobody can see 60fps FBM noise).

**When would leaning in be correct?** Only if you commit to a real 3D moment: an actual GLB of the terminal, meshopt/DRACO-compressed, HDRI-lit, scrubbed on scroll. That is a legitimately premium technique, and it is the *only* approach that would beat video for this hero — because 3D lets RTL mirror the **camera**, not just the layout, which is exactly what the research doc asks for and video structurally cannot provide. But it requires `three@r17x+`, R3F v8 (React 18), ~600 KB of runtime, a 3–5 MB asset, and — decisively — **a 3D source model, which this repo does not have.** The product exists only as 2D renders and AI-generated film. Betting on 3D with no geometry is how projects lose a quarter.

So: drop `three` now. Revisit only when a real terminal CAD/GLB exists, and treat it as a new decision then.

---

## 7. Reduced-motion strategy that doesn't gut the experience

The current implementation has **five incompatible policies** across ten files: nuclear `*{animation:none!important}` (machine, video-hero, latest), surgical per-element lists (cinema, pulse), duration-zeroing (flow, one-tap), and nothing at all (hub). They have already silently drifted — `video-hero.css:417-421` lost the SMIL clauses that `latest.css` still has. That drift is guaranteed to keep happening with five policies.

### The principle

`prefers-reduced-motion: reduce` means **no vestibular triggers**: large-area movement, parallax, scale, rotation, scroll-hijack. It does **not** mean "no change over time." WCAG 2.3.3 is about *non-essential* motion. Opacity cross-fades, colour transitions, and small displacements are fine and are how you preserve *sequence* — which is the actual content.

### Three tiers, one token block

```css
:root {
  --mo-rise:  0.5em;    /* reveal displacement */
  --mo-push:  1.035;    /* hero camera scale */
  --mo-loop:  infinite; /* ambient loop iteration count */
  --d-3: 320ms;  --d-5: 840ms;  --d-6: 1400ms;
}
@media (prefers-reduced-motion: reduce) {
  :root {
    --mo-rise: 0px;      /* rise becomes a pure cross-fade, in place */
    --mo-push: 1;        /* camera holds */
    --mo-loop: 1;        /* loops run once and settle */
    --d-6: 300ms;        /* signature collapses to a fade */
  }
}
```

Every rule then reads `translateY(var(--mo-rise))`, `scale(var(--mo-push))`, `animation-iteration-count: var(--mo-loop)`. **Nineteen scattered media queries and five policies collapse into one block, and nothing needs `!important`.** More importantly, the reduced-motion path can no longer drift, because there is no second copy of the rules to drift from.

Tier assignment:
- **Tier 0 — always permitted, even under reduce:** opacity, colour, `border-color`, `box-shadow`, displacement ≤ 4px, any state change under 200ms. Do not suppress these; they carry the sequence.
- **Tier 1 — substitute:** displacement > 4px, scale, rotation, parallax → become a `--d-2` opacity cross-fade *in place*, keeping the original stagger. The user still perceives "A, then B, then C." Causality survives; motion doesn't.
- **Tier 2 — resolve to the end state:** scroll-linked scrubs, ambient loops, the 240vh sticky walkthrough. Collapse to the composed final still. Concept 08 already does this correctly (`one-tap.css:1194-1197`) and it is a model.

### Four specific fixes

1. **Keep the best thing already here.** `HeroFilm.tsx:31-36` sets `src` to `null` under reduce — no `<video>` element, no bytes fetched, echo pre-resolved. That is rare and correct. Preserve it exactly.
2. **Subscribe to changes.** Nothing in the repo calls `matchMedia(...).addEventListener("change", …)` for motion — every check is read once at mount, so toggling the OS setting does nothing until reload. `cinema/page.tsx:83` already subscribes to a *viewport* media query, so the pattern was known and simply not applied.
3. **Fix the dead control.** Under reduce, "شاهد عملية الدفع" is fully enabled, fully focusable, and does literally nothing (`videoRef` is null, and `one-tap.css:1185` hides `.echo i`). It should re-run the *permitted* part: re-ignite the payment-brands row as an opacity cascade with the original stagger. Then the button is honest.
4. **Put one rule in `globals.css` for the shared marquee.** `BrandsMarquee` is imported by five routes and each one had to remember to write its own `.mtrack{animation:none}`. A sixth consumer ships an unstoppable 42s marquee. One global rule, or better, `animation-iteration-count: var(--mo-loop)`.

---

## 8. The one moment: "how did they do that"

Not the current echo ring. A circle scaling to `scale(90)` while five spans change opacity is a nice idea rendered as two CSS properties — nobody has ever asked how a scaling circle was made.

Here is the replacement. Call it **"The tap leaves the screen."**

**The concept:** at the exact frame the film's tap blooms, the film's own pixels stop being a video and become the interface — a wavefront that crosses from the video plane, through the DOM, out to the browser chrome, ordered by physical distance from the point of contact.

**The mechanics, precisely:**

**(1) Freeze the source frame.** On the `requestVideoFrameCallback` that crosses `PULSE_AT`, do one `ctx.drawImage(video, ...)` into an offscreen canvas downscaled to 480px wide. ~2ms. From the same frame, read the terminal's contactless-glyph position — it is a fixed normalized coordinate for a given cut (`object-position: 68% 50%` wide, `50% 72%` tall; those constants already exist at `one-tap.css:275-276, 1104, 1122`), so no image analysis is needed. Convert to viewport pixels once.

**(2) The wavefront.** A duplicate layer of the frozen frame sits over the video, revealed by a radial-gradient `mask-image` on a `transform: scale()` layer expanding from that exact point. Use mask + `scale()`, **not** animated `clip-path: circle()` — `scale` composites everywhere, `clip-path` radius interpolation does not composite reliably on Safari. The duplicate carries a `filter: saturate(1.4) hue-rotate(-8deg) contrast(1.1)` chain that shifts it toward the interface's cyan. For ~500ms the film's grade visibly becomes the UI's grade, radiating from the point of contact.

**(3) Geometric ignition.** Batch-measure the bounding boxes of every hero element once — headline lines, sub, both CTAs, the five payment-brand spans, the scroll cue. Compute each one's distance from the origin. As the wavefront's radius crosses each box, that element receives `.charged`: a cyan rim, and — this is where the variable font earns its place — a `font-variation-settings: 'wght' 700 → 600` relax over `--d-3`, so the type physically *settles* as the energy passes through it. **The order is derived from geometry, not from DOM index.** In Arabic the origin is mirrored, so the cascade genuinely runs the other way: the headline charges before the CTA in one language and after it in the other. That is the "RTL mirrors motion, not just layout" line from the research doc, actually delivered.

**(4) The energy leaves the frame.** The wavefront continues past the viewport edge and hands its remainder to `#prog` — the progress hairline fills to its current scroll position with `--e-spring`, arriving 80ms after the wave exits. The page's own chrome is the last thing the tap touches. Then everything stops. Total duration `--d-6` = 1400ms, one origin, one cause, zero simultaneous independent animations.

**Why it reads as "how did they do that":**

The wavefront is **continuous across four different rendering technologies** — decoded video pixels, a CSS-masked composited layer, DOM class changes, and fixed browser-chrome UI — with no visible seam between them. And the ordering is derived from live geometry, so it is subtly different at every viewport width, at every aspect ratio, and *inverts between Arabic and English*. It cannot be recognised as a library preset, because no library does distance-ordered staggering seeded from a video frame's coordinate space. Viewers who know motion design will try to identify the tool and fail, which is exactly the reaction you are after.

**Feasibility in Next 14 / React 18:** one `useEffect`, one `drawImage`, one batched `getBoundingClientRect` pass over ~10 elements, and `element.animate()` calls with a native `linear()` spring. **No new dependencies.** About 90 lines.

**Frame budget:** 2ms for the `drawImage`, ~1ms for the layout batch, then **zero main-thread work for the remaining 1380ms** — the mask layer and every `.charged` transition run on the compositor.

**Degradation, art-directed rather than disabled:**
- No `requestVideoFrameCallback` → `onTimeUpdate` fallback, up to 250ms late, still fires.
- Autoplay refused or video errored → the 400ms `setTimeout` failsafe fires the *DOM half* of the wavefront from the same origin, over the still poster. The moment happens anyway. **This is the fix that matters most** — the current build's signature moment is one unhandled promise rejection away from never occurring for an entire class of users.
- `prefers-reduced-motion` → no wavefront, no scale. The `.charged` cascade runs as a pure opacity/colour sequence in the same geometric order, at `--d-2` per element. The user still perceives the tap propagating outward. Causality survives; motion doesn't.
- Cache invalidation: re-measure on `resize` and on language toggle, or the cascade order silently desyncs from the layout.

---

## Priority order, if only five things get done

1. `v.play().catch(fire)` + the `PULSE_AT + 400ms` failsafe in `HeroFilm` — the page's signature moment currently has a single point of failure with no handler.
2. Replace `transition-property: all` with an explicit list in the two motion-law blocks — deletes ten clawback rules, stops `#prog` thrashing, fixes `.traylight` convergence, and neutralises the focus-ring pill deformation.
3. Move the easing/duration/`--mo-*` tokens into `globals.css` and swap every reduced-motion policy for the single token block.
4. Change `--mo-rise` from `12px` to `0.5em` and the workhorse curve to `cubic-bezier(0.30, 0, 0.10, 1)` — this alone is the difference between "fade-in" and "motion."
5. Delete `three`, delete `VendingScroll`, and window the `DropSequence` bitmap cache to ±12 frames.

===== PRODUCT-DESIGNER =====
# R.Pay — Strategic Design & Conversion Review

*Senior product-design read of the dossier. Verdict framing: the craft is above market. The strategy is not yet a strategy.*

---

## 0. The one-line diagnosis

**This is a portfolio of eight answers to a question nobody has written down.** Eight concepts, five of them "live," one production candidate, zero decisions made — while the things that actually close a Saudi payments deal (who moves the money, under whose licence, at what price, on which machines) appear nowhere in ~6,000 lines of copy. Concept 08's motion law, accent contract and claims ceiling are better disciplined than most shipped fintech sites. They are disciplines applied to a page that doesn't yet know who it's talking to.

The fastest path to value is not another concept. It is: **pick 08, harvest 01, delete six routes, and spend the next sprint on content that doesn't exist yet.**

---

## 1. Who is the actual audience — and is the site built for them?

### Inferred, in priority order

**P0 — The SME machine operator / owner.** 5–500 unattended machines: arcade halls, vending routes, coffee units. Named in the repo as Saffori Land, Sparky's, VR Games Zone. Owner-operator or a small ops team. Buys on cash flow, shrinkage and labour hours saved, not on "digital transformation." Reads Arabic, works on a phone, buys over WhatsApp. **The site's language default, RTL engineering and WhatsApp-only CTA are correctly aimed here.** That part is genuinely right and rare.

**P1 — The venue / landlord side.** Look at the actual logo wall: Roshn, Boulevard World, Boulevard City, Dar Al Arkan, Kinan, Hamat, Sela, Al Khozama, LuLu. Those are **real-estate developers, leisure destinations and a hypermarket group — not machine operators.** That is not a customer list; it's a venue and channel list. It implies the real GTM is landlord-led: R.Pay gets specified into a destination, and the operators follow. **This audience is completely unserved by the current site.** A Boulevard World procurement team needs a PDF, a named contact, a compliance annex and an email trail. They get a WhatsApp deep link to a personal-format mobile number.

**P2 — The enterprise self-service buyer** (LuLu-class retail, hotels, hospitals, F&B chains adding kiosks). Same needs as P1 plus integration questions.

**Explicitly not the audience, despite what the site does:** consumers (they never visit), developers (there is no API, no docs, no sandbox — correctly so, but then stop implying a platform), regulators (they don't read marketing sites), and investors — although the eight-concept gallery, the "Interactive Concepts" `<title>`, and the absence of any commercial content make the site read as a *pitch artifact*, which is exactly the wrong signal to a paying operator who lands on it.

### Is the current site designed for them? No — and there's a fork to resolve first

**The site is designed for an audience of one: the internal stakeholder choosing a direction.** Every concept is a complete standalone story optimized for a review meeting. None of them qualifies a visitor, prices anything, or answers a purchasing question.

And before any of this can be fixed, someone has to settle the **arcade-operator contradiction**: concepts 01–05 present "أكبر مشغّل لمكائن ألعاب الأركيد في المنطقة" as R.Pay's own credential; concepts 07–08 reframe the identical sentence as a customer. These are opposite companies:

- If R.Pay **is** the largest regional arcade operator selling its own stack → every competing arcade operator is being asked to fund a competitor. That's a hard sell that requires an explicit structural answer (separate entity, arms-length, data walls), and the vending/coffee verticals become the real market.
- If R.Pay **serves** that operator → it's a pure vendor, the superlative becomes the best case study in the repo, and it should be a named customer story rather than a floating adjective.

This is not a copy bug. It is the positioning decision the entire site is downstream of, and it is currently unmade on a live URL.

**Second unstated fundamental: the business model.** Hardware capex? SaaS subscription? MDR on volume? Revenue share? The headline differentiator — "أموالك تصلك مباشرة دون وسيط" — implies R.Pay is *not* in the flow of funds, which implies it is an ISV/tech layer on top of a licensed acquirer. If so, "no middleman" is partly their acquirer's feature, and the acquirer must be named. A buyer cannot evaluate an offer whose commercial shape is never stated.

---

## 2. The IA problem, and the sitemap that should replace it

A hub of eight concepts at `/` is a design-studio artifact at a payments company's front door. It also means **the company has no homepage** — `app/layout.tsx:19` literally titles the site "R.Pay — Interactive Concepts | مفاهيم آر باي," and `metadataBase` still points at `r-pay-orcin.vercel.app` while rpay.sa serves a different company's site. Today, the most likely outcome of a prospect googling R.Pay is landing on someone else's agency build.

The IA also fails structurally on search. The lead source for P0 is Arabic query intent — «جهاز دفع لمكائن البيع», «نظام دفع مكائن القهوة», «بديل الكاش لصالات الألعاب» — and a single bilingual URL with both languages in the DOM (§6) plus zero sector landing pages means **not one of those queries has a page to rank.**

### Proposed sitemap

```
/                          → redirect to /ar (Accept-Language aware, /ar canonical)
/ar  ·  /en                   mirrored trees, identical structure

  /                        Home — one story, one ask, sector self-select
  /solutions/arcade        ┐ three real pages, not accordion panels:
  /solutions/vending       ├ vertical proof, vertical objections,
  /solutions/coffee        ┘ vertical machine list, vertical CTA
  /platform                The unified system — overview
    /platform/payments       acceptance, settlement, who the acquirer is
    /platform/control        remote control, telemetry, alerts
    /platform/security       geofence + device lock (the anti-theft story)
    /platform/reports        dashboards, exports, multi-branch permissions
  /hardware                Terminal spec, protocols (MDB · ccTalk · Executive),
                           connectivity, power, retrofit process, compatibility list
  /pricing                 Even a band + "what drives the price" beats silence
  /customers               Case studies index
    /customers/<name>        one deep story minimum, with a number
  /trust                   PCI DSS status, SAMA/licensed-partner position,
                           PDPL & data residency, encryption/tokenisation,
                           incident policy, CR + VAT number
  /status                  Real uptime, or delete the light entirely
  /support                 FAQ, onboarding timeline, SLA, hours, phone
  /about                   Founding, team, address, the arcade-operator answer
  /contact                 Form (routed, logged) + WhatsApp + phone + email
  /legal/privacy · /legal/terms · /legal/refunds · /legal/cookies
                           Arabic authoritative, English translation
  /404 · /sitemap.xml · /robots.txt · hreflang ar-SA / en-SA / x-default

/design (noindex, or behind auth)  ← the concept gallery, if it survives at all
```

Two IA principles worth stating explicitly:

1. **Sector is the primary axis, feature is secondary.** An arcade operator and a coffee-route operator have different economics, different theft risk, different machine estates. The current site treats them as three cards inside one undifferentiated pitch. Three pages is also three ranking surfaces and three ad destinations.
2. **`/hardware` and `/trust` are the two pages that don't exist and decide the deal.** Everything else on this list is a rearrangement of content the repo already has.

---

## 3. Trust & credibility — the section that will actually kill deals

The dossier's own claims ceiling says it plainly: *"SAMA/PCI appear nowhere in the repo → they do not appear in 08."* That was the **right call for a demo** and is a **fatal position for a live site.** These aren't copy to write; they're facts to obtain from the company, and if the answers are uncomfortable, that's information.

**Missing, ranked by deal impact:**

1. **Who is licensed to move the money.** The single loudest product claim is about settlement. In KSA that touches SAMA authorisation. The site must state the structure: R.Pay as tech provider on top of named acquirer X, or R.Pay as a licensed payment institution. Naming SurePay and Geidea as inferiors *while showing no licensing position of your own* is the worst of both worlds.
2. **PCI DSS status and level.** Absent. Non-negotiable for P1/P2 procurement.
3. **PDPL / data residency.** A telemetry platform holding operational and transaction data for Saudi businesses now needs a Personal Data Protection Law statement, a stated hosting region, and a contactable data officer. Nothing.
4. **The four "Compliance" and "Security" footer links are all `href="#"`** (`latest:515`, `machine:469`, `pulse:645`, `video-hero:460`). A dead compliance link on a payments site is worse than no link — it reads as a stub someone forgot, which is exactly what it is.
5. **The "النظام يعمل / System Operational" indicator links nowhere and reflects nothing.** On a vendor whose product is uptime visibility, a decorative status light is not a design flourish, it's a false statement of fact. Remove it today or point it at a real status page.
6. **Thirteen partner logos with no evidenced permission**, most of which are landlords rather than clients, displayed under «شركاؤنا وعملاؤنا / Our partners & clients». Two exposures: legal (unauthorised use of marks) and credibility (a landlord discovering they've been listed as a client). Fix by tiering honestly — *Deployed at* vs *Trusted by* vs *Partners* — with written consent per logo.
7. **The 8/8 vs 1/8 comparison table naming SurePay and Geidea.** Comparative advertising against two larger, licensed, named competitors, with a hedge note instead of a methodology. This invites a legal letter and, worse, invites the comparison you lose — Geidea has scale you cannot match. Pull it from the public site; keep it as a sales-deck slide with sourcing.
8. **97 machines is being presented as a strength.** Against category incumbents it is a small number, and "9 branches" means nothing to a stranger. Lead with throughput and outcomes (465,255+ payments, 9,434 prizes delivered) and deploy "97" *inside a named customer's story* where it reads as a fleet, not as a company total.
9. **Every stat is undated and unattributed.** "465,255+" since when? Over what period? A number without a period is not a proof point; add "since 2023" and a footnote.
10. **No refund/dispute policy** — on a site whose #2 feature is automatic refunds.
11. **No CR number, no VAT number, no phone, no business hours, no team, no founding year, no full address.** In KSA B2B, the CR number is the first thing a serious buyer checks.
12. **Zero case studies** behind thirteen logos and three name-chips. 6,000 lines of copy contain not one customer sentence.

**Credit where due, and preserve it:** the «محاكاة مباشرة / Live simulation» disclosure chips, the in-code refusal to fake a dashboard screenshot, and the written claims ceiling ("no invented certifications, no fake card numbers, no invented booking channels") are a genuinely unusual integrity posture. That discipline is the asset that makes the compliance page credible once it exists — the same team that refused to fake a dashboard will not fake a PCI badge.

---

## 4. The conversion path: what should happen, and how it currently breaks

### What a visiting operator should do

**Land → recognise themselves in 5 seconds → pick their machine type → watch it work → believe it (a named customer + a dated number) → check fit (does it work on *my* machines, what does it cost) → act (WhatsApp if SME, form if procurement) → get a confirmation with next steps and a spec PDF.**

### Where it breaks now

- **No "who this is for" line above the fold on any of eight concepts.** The dossier's own finding. Every hero is a verb ("لمسة واحدة", "ادفع. خُذ.") with no audience noun. The subhead has to name the machines and the country.
- **The primary CTA on 01–03 is a lie of implication.** "ابدأ الآن / Get Started" → `#contact`, an in-page anchor. It promises self-serve onboarding that does not exist and delivers a scroll. 07/08's "احجز عرضًا مباشرًا / Book a live demo" is the correct verb and should be the only verb.
- **One conversion lane serving three audiences.** WhatsApp to a single personal-format number is *ideal* for P0 and *unusable* for P1/P2. Procurement needs a form that creates a record, an email address that isn't a shared alias, and a downloadable spec. There must be a second lane: **demo (WhatsApp-first) and quote/RFP (form-first)** — two intents, two paths, one page.
- **Zero qualification anywhere.** The site never asks the three fields that route every lead and set every expectation: sector, machine count, city. A 3-field qualifier converts better than a bare deep link *and* hands sales the data. Right now the sales team receives "مرحبا" from an unknown number.
- **Zero lead capture for the 97% who won't tap.** No email, no newsletter, no gated spec sheet, no pixel, no remarketing. Every non-converting visit is lost permanently.
- **No intermediate commitments.** Between "watched the film" and "message a stranger on WhatsApp" there is nothing to consume: no pricing band, no spec PDF, no installation timeline, no ROI/cash-uplift calculator, no case study, no FAQ. That gap is where the entire consideration stage should live, and it is empty.
- **Proof is inert.** Thirteen logos, none clickable, none narrated. A logo you can't click is decoration.
- **The WhatsApp channel itself is unowned.** One number, no stated hours, no autoresponder, no CRM, no fallback. A Thursday-evening enquiry that goes unanswered for 14 hours is a dead lead with no record it ever existed. Move to WhatsApp Business API with a routed inbox and an instant bilingual acknowledgement.

**Keep, wholesale:** concept 08's CTA architecture — one verb in five placements, two dominant; card CTAs deliberately demoted to text links so they never compete; the pre-filled Arabic WhatsApp message; the "عبر واتساب — بالعربية أو الإنجليزية" friction note; the floating widget yielding at the close so the final ask is uncontested; the sticky bar suppressing itself when a rival primary is adjacent. That is better CTA discipline than most funded fintechs ship. It's the right mechanic pointed at an incomplete funnel.

---

## 5. Content strategy: the sections that must exist, in order, with their job

Homepage, Arabic-first. Concept 08's persuasion arc is the right spine — *impact → trust → story → visibility → control → use cases → numbers → ask* — with the commercial substance it currently lacks welded in.

| # | Section | Job to be done | Status |
|---|---|---|---|
| 1 | Nav | Persistent demo CTA, sector entry, language link, phone | Exists; add sector + phone |
| 2 | Hero — one sentence, one object, one CTA | "I'm in the right place" in 5s. **Must add the audience noun**: machines + Saudi Arabia | Exists (08 is excellent); missing the who-line |
| 3 | Trust band, early | Borrowed credibility before any argument | Exists; **needs honest tiering + permissions** |
| 4 | The tap → action film | Make the abstract concrete; earn the scroll | Exists; the best asset in the repo |
| 5 | Proof numbers | Convert interest into belief. **Dated, sourced, headed** | Exists but unheaded, undated, unattributed |
| 6 | Sector self-select → 3 real pages | Let the visitor route themselves; feed 3 ad destinations | Exists as cards; needs pages behind them |
| 7 | How it works + day one | Kill "sounds complicated": install, timeline, who does it | 4 steps exist; **installation reality missing** |
| 8 | The control room | Show the product surface, honestly labelled | Exists; rebuild the interaction (§7, §8) |
| 9 | **The money** | Settlement path, timing, fees, who the acquirer is | **Does not exist. Highest-value addition.** |
| 10 | **Compatibility** | "Does it work on my machines?" — makes, protocols, retrofit | **Does not exist. Second-highest.** |
| 11 | **One case study** | Turn a logo into an outcome with a number and a quote | **Does not exist** |
| 12 | Trust strip → /trust | PCI · licensing · PDPL · encryption, in one honest line each | **Does not exist** |
| 13 | Pricing signal | Qualify out the wrong leads; stop losing the right ones to silence | **Does not exist** |
| 14 | Close — single dominant CTA + 3-field qualifier | Capture intent *and* route it | Exists; add qualification |
| 15 | Footer | CR/VAT, address, phone, hours, real legal links | Exists as placeholders |

**Remove from the homepage:** the competitor scoreboard (→ sales deck), the decorative status light (→ /status or delete), the eight-pillar feature bento in its current undifferentiated form (→ /platform sub-pages, surfaced on the home page as four benefit statements, not eight equal tiles).

**Content ownership note:** concepts 07/08 dropped the About section entirely. For an unknown vendor asking for money in a relationship market, that is a mistake — About isn't vanity here, it's the CR-number-and-address page that makes you real.

---

## 6. Arabic-first vs English — the toggle is wrong; go to `/ar` and `/en`

**Keep Arabic-first. Kill the CSS toggle.**

The current mechanism ships both languages in the DOM simultaneously and switches visibility with `.ar-t`/`.en-t` + `html.en` (`globals.css:50-55`), flipping `dir` in JS. As a one-page demo device this is clever and cheap. As a site architecture it fails on six counts, all evidenced in the dossier:

1. **SEO is structurally impossible.** One URL, mixed-language body copy, no per-span `lang`, no hreflang, no alternates. Google cannot cleanly rank either language. For a company whose discovery is Arabic long-tail search, this is the difference between inbound existing and not existing.
2. **Language does not persist across navigation** (documented unresolved issue #12). Fine on a single page. The instant the IA has 20 pages, every click resets an English-reading procurement officer to Arabic. **This alone disqualifies the toggle for the real site.**
3. **You cannot share an English link.** A landlord forwarding the site to a UK-based ops director sends them to an Arabic page with a toggle to find. That is the exact P1 handoff moment.
4. **Accessibility is already broken by the same disease.** `<html lang="ar">` over English content; only `cinema/page.tsx:71-73` even updates `lang`; and all nineteen `aria-label`s in concept 08 are English strings on an Arabic document, read with Arabic phonetics. Server-rendered per-locale routes make this a non-problem instead of nineteen individual fixes.
5. **Paid media has nowhere to land.** Separate Arabic and English campaigns need separate landing pages with matched message. There is one page.
6. **Every page pays double payload forever**, and both languages must be maintained inside the same JSX — which is precisely why English drifted second-class.

And it *has* drifted, provably: "Auto cashback" for automatic refunds (a different product, still live in two concepts), "start self-selling now," the headline pair «حلول ذكية لمستقبل أفضل» / "Results That Speak" that share no meaning, and the systematic dropping of the third Arabic clause. **Shared-DOM bilingualism guarantees this**, because the English site never exists as a reviewable artifact — nobody can look at "the English page" and judge it. Separate routes make English a thing that can be edited, reviewed and signed off.

**Recommendation:**
- `/` negotiates to `/ar`; `/ar/*` and `/en/*` mirrored; `lang` and `dir` set server-side per route.
- Arabic canonical, `hreflang` ar-SA / en-SA, `x-default` = ar-SA.
- The toggle stays a single equal-status header element with no flags (their research got that right) — it becomes a link to the mirrored path, preserving the current page.
- Arabic authored, not translated (they already do this, and it shows — «ماكينة مُدارة», «هدية مُسلَّمة», the diacritics, the Arabic-first leading work in `flow.css:104-141` is the best typography in the repo). English professionally edited as its own artifact.

**Two Arabic decisions still unadjudicated:** the brand spelling («آر باي» vs «ار باي» vs untransliterated "R.Pay" mid-sentence), and the register drift — concepts 07/08 slip into Saudi dialect («شوف الماكينات», «خلّها أذكى») against formal MSA everywhere else. Read alone the dialect is warm and effective; read across a site it's an unowned voice. My call: **warm MSA throughout, one spelling («آر باي»), Latin "R.Pay" only in Latin contexts.** A vendor asking a landlord for a purchase order should not change register between the hero and the pricing page.

---

## 7. Mobile strategy — the primary device, currently the fallback

Saudi is effectively phone-only for this buyer, who is literally walking a mall between machines. The dossier shows the site was authored at 1920 and back-ported.

**What mobile-first demands here:**

1. **A hard per-route budget, ~600 KB on first view.** Current reality: `/machine` 4.45 MB, `/video-hero` 2.27 MB, `/one-tap` 1.62 MB. Only `/flow` mobile (214 KB, sequence structurally skipped) is defensible — and it proves the team can do this. That three-mode branch should be the default pattern, not the one place it happened.
2. **Art direction must be server-decided.** `HeroFilm` SSRs the *wide* poster and swaps to tall after hydration, so mobile double-downloads the claimed-LCP image and shows the wrong crop until JS runs. `<picture media>`, `fetchPriority="high"`, and a `<link rel=preload>` for the display woff2. Zero-cost fixes to the page's most important pixel.
3. **The core interaction does not exist on the primary device.** Both card acts in concept 08 use hover/focus expansion with no `onClick`; mobile disables the mechanic entirely (`flex-grow: 0 !important`) and falls back to a snap carousel. So on phones, the two acts carrying sector qualification and network scale are static image rows. That is the mobile strategy failure in one sentence — **design the touch interaction first (tap-to-expand, one open at a time), let hover be the desktop enhancement.**
4. **The 240vh sticky ControlRoom is a desktop conceit.** 1.4 extra viewports of scroll, zero focusable content, `role="img"` collapsing the entire product argument into one English string, and it collapses to a static panel on mobile anyway — meaning **the act carrying the core product argument is a still image on the device that matters.** Rebuild as a three-step tabbed component that works identically on touch, keyboard and desktop.
5. **Fix the viewport units.** `min-height:100vh` on `.onetap` against `100svh` on `.hero` and `.ctrl-stick` — the exact class of iOS bug the same file spends paragraphs defending against.
6. **Real iOS testing, once.** Concepts 02/03 carry the status "مُستعاد / Restored" *because they broke on iPhone*. All verification since has been Chromium-only, and no real-device Safari smoke test has ever been performed. In the affluent Saudi segment, iOS share makes Chromium-only QA not QA.
7. **Resolve the WhatsApp widget to one rule.** It currently lands on opposite screen edges depending on route and language (physical `right:22px` in three files vs `inset-inline-start` in four). Pick bottom-inline-end, 52px, safe-area aware, one implementation, everywhere.
8. **Lean into the one mobile advantage you have:** WhatsApp is a one-tap handoff on a phone and a QR dance on desktop. Make WhatsApp the mobile primary and the form the desktop primary — same verb, device-appropriate mechanism.
9. **Reachability of commercial answers.** Price and compatibility get asked on the phone, standing next to a machine. They cannot be eight acts of cinematic scroll away.

---

## 8. What to remove — specifically, unsentimentally

**Routes (delete six of eight):**

- **`/concepts/video-hero` and `/concepts/machine`.** Between them: "Auto cashback" (a factually wrong product claim), «ار باي» misspelled 11 times, "start self-selling," a headline pair that shares no meaning, no theme toggle, an unthrottled per-pointermove layout-thrashing spotlight, and 6.3 MB of video. **Every one of these defects is already fixed elsewhere in the same repo.** They exist only because someone restored them after an iPhone fix.
- **`/concepts/cinema`.** Hot-links three third-party CloudFront files (the only failure in every QA run, across all three passes, never fixed), ships an unreplaced `__HERO_VIDEO_TALL__` placeholder in production code, and contains a genuine functional bug: a `passive:false` wheel handler that `preventDefault()`s with no scroll-extent check, permanently trapping the user's scroll over the reel. Its reduced-motion path hides the video with `display:none` while it continues to download and play.
- **`/concepts/coming-soon`.** An empty route occupying a slot on a live URL.
- **`/concepts/pulse`.** Nothing here survives the merge, and it regressed techniques the repo had already got right (infinite `left`/`top` and `width` keyframes triggering layout every frame forever, where `latest` had already done the same effect with `transform`).
- **`/concepts/flow` or `/concepts/one-tap` — ship one.** 08 already inherits 07's `StickyCTA`, dual-observer reveal, `#prog` hairline and pinning idiom by name. Keep 08.
- **`/concepts/latest` as a *site*.** Harvest its content depth (About/Mission/Vision, the 8 pillars, HowItWorks, the geofence explanation) into the real IA, then delete the route. Its hero is the repo's own documented cautionary example of hierarchy collapse — seven stacked effect layers, a triad headline plus chip row plus stats band plus two floating status chips — and it should not be resurrected.
- **The hub at `/`.** A concept gallery at a payments company's front door. If it must survive for internal review, move to `/design`, `noindex`, and gate it.

**Assets (~50 MB of pure deletion):**

- `master.mp4.part00` at repo root — 20 MB, an orphaned 1-of-3 fragment whose siblings live elsewhere. Unusable on its own. Zero references anywhere in code or docs.
- The three `public/assets/flow/master.mp4.part*` — 43.9 MB of 4K HEVC source, committed *and deployed* because the `.gitignore` rule names the reassembled filename instead of `master.mp4.part*`. Next.js copies all of it into the deploy output.
- `vending-video.mp4` (4.05 MB, `preload="auto"`, no poster) and `hero-video.mp4` (1.94 MB) — both die with concepts 03 and 02.

**Code (~2,000 lines):**

- ~1,400 triplicated lines across `latest.css` / `machine.css` / `video-hero.css` — they're near-clones whose reduced-motion blocks have already silently diverged. They die with the routes.
- **`three@0.149.0` and `LiquidBackground`.** 600 KB of dependency for a fullscreen fragment shader, which concepts 07 and 08 both explicitly refuse to mount on main-thread-contention grounds, and which keeps rendering at 60fps into a `display:none` canvas in light theme on two of the three routes that use it.
- Four duplicate count-up implementations, six marquee keyframe definitions of one idea, two unrelated geofence radar implementations, `VendingScroll` (scrubbing `video.currentTime` from a scroll handler — the most jank-prone technique in the repo, with no reduced-motion and no mobile path).
- The `.onetap * { transition-duration: 400ms }` universal law — ten separate rules already exist purely to claw back the unconstrained `transition-property: all`. Either constrain the property list or drop the law.
- Dead: `.settled` (toggled in JS, zero CSS rules), `.brands`/`.brands .lbl` orphans, `mainRef`, `const CARDS`, `Math.min(i % 4, 3)`, and the `.pays`/`.vtitle` inherited rules on routes that don't render them.

**Content:**

- The competitor comparison table and the 8/8 vs 1/8 scoreboard.
- The "النظام يعمل" status light.
- Every `href="#"` — build the page or delete the link. Eleven dead links across Privacy, Terms, Security, Compliance, Careers, Partnerships and three social profiles.
- The logo marquee, until written permissions exist per mark.

**Interaction patterns:**

- Hover-only card expansion, used identically in two consecutive acts (Act V is structurally Act III with different photography). Cut one act, rebuild the other for touch.
- The 500vh / 620vh / 240vh scroll-pinned sequences as a *category*, on a mobile-first market. Keep exactly one — the hero film — and spend the motion budget there, which is what concept 08's own research concluded.

---

## Sequencing — what I'd do in what order

**Week 1 (before anyone external sees this):** delete the six routes and 50 MB of dead media; point `metadataBase` at the real domain and resolve rpay.sa; remove the fake status light and all `href="#"` links; fix the three concept-08 defects the dossier names — the `border-radius:8px` in `:focus-visible` that deforms every pill CTA on keyboard focus, the missing initial-autoplay `.catch()` that can leave the page's signature moment permanently unfired, and the nineteen English `aria-label`s on `lang="ar"`.

**Weeks 2–3 (decisions, not design):** settle the arcade-operator fork; state the business model; get the licensing/PCI/PDPL answers from the company; obtain logo permissions; secure one customer to a named case study.

**Weeks 4–6 (build):** `/ar` + `/en` routing on the real IA; concept 08's craft as the homepage with the who-line, the money section, the compatibility section and the qualifier added; `/hardware`, `/trust`, `/pricing`, real legal pages; two-lane conversion with a routed inbox.

Concept 08's messaging plus concept 01's information depth, on a real sitemap, in two properly routed languages, with the commercial and compliance content that has never been written. Everything else in this repo is either already right or already deletable.

===== FRONTEND-ARCHITECT =====
# R.Pay — Frontend Architecture & Redesign Readiness Assessment

Verified against the working tree at `C:\Users\CCBoot\Documents\projects\r.pay` (not just the dossier): `next@14.2.35` installed, React 18.3.1, TS 5.4.5 strict, `three@0.149.0`, `playwright` devDep only, **no eslint installed despite a `"lint": "next lint"` script**, `next.config.mjs` is 4 lines, Node v24.19.0 / npm 11.17 locally, git pack 82.88 MiB, **36 of 45 `.tsx` files are `"use client"`**, 6,404 lines TS/TSX + 5,144 lines CSS.

One thing the dossier understates: the triplication is **not confined to CSS**. `components/HowItWorks.tsx`, `Integration.tsx` and `Menu.tsx` are each forked a second and third time into `app/concepts/machine/_c/` and `app/concepts/video-hero/_c/`. That is why "Automatic Cashback" is still live — it was fixed in `components/HowItWorks.tsx` and left rotting in two forks. **The debt is a fork tree, not a stylesheet problem.**

---

## 1. Honest verdict on the architecture

### Genuinely well-engineered — protect this

| Thing | Why it is real work |
|---|---|
| **The 2.37 MB → 98.3 kB asset extraction** | Base64-in-TS is a common, fatal mistake. It was found, fixed, and verified byte-identical with zero component changes. |
| **`DropSequence.tsx` three-mode branch** | Mode decided in `useLayoutEffect` *before paint*; mobile never enters scrub so 1.23 MB is structurally unreachable under 820px (214 KB mobile route). `createImageBitmap` with `<img>.decode()` fallback, DPR capped at 2, short-circuit on unchanged frame, debounced resize, `.close()` on unmount. This is better than most agency work. |
| **Reduced motion as a designed state, not a kill switch** | `HeroFilm` sets `src = null` — *no video element is created, no bytes fetched*. `ControlRoom` collapses 240vh → auto. Four independent JS branches + restructuring CSS. Almost nobody does this. |
| **`overflow-x: clip` vs `hidden`** | Root-caused correctly (`hidden` computes the other axis to `auto`, creating a second scroll container), documented, and paired with the footer rise-exemption. The RTL "second left scrollbar" diagnosis is genuinely expert. |
| **The disappearing-cards diagnosis** | Imperative `classList.add("in")` vs React reconciling `className` — reproduced deterministically in Playwright, fixed with a static-className wrapper, regression-tested through hover/leave/focus/lang/resize. |
| **Bidi/RTL discipline** | 419 logical-property uses, mirrored keyframes (`tapR`, `plmarq-r`, `runner-rtl`), `direction: ltr; unicode-bidi: isolate` on LED windows, the "Arabic never takes Latin tracking" rule with per-site opt-back-in. This is the hardest part of the job and it is done properly. |
| **`flow.css:104-141` leading** | Arabic-first leading with `padding-block: .14em` for the damma, tightened for Latin — screenshot-verified, not arithmetic. Best typographic work in the repo. |
| **Media hygiene** | Every mp4 H.264 + faststart + `-an`, every video has a poster that doubles as the reduced-motion and failure fallback, art-directed wide/tall pairs. |
| **Honest simulation labeling** | «محاكاة مباشرة» on every fabricated figure; explicit refusal to fake a dashboard screenshot. For a payments company this is a *legal* asset, not just taste. |

### Technical debt, ranked by what it will cost you during a redesign

1. **The fork tree (highest).** Three near-identical stylesheets (~1,400 duplicated lines) *plus* three forked shared components. Every fix must be applied 3×, and demonstrably isn't. Concepts 02/03 still ship "Auto cashback", "ار باي", "self-selling", `body{overflow-x:hidden}` (which *undoes* the documented globals fix by cascade order), and `background-attachment: fixed` (which the same repo documents as forbidden). **This is not code that can be redesigned — it can only be deleted.**
2. **No token layer.** One spacing token, zero radius tokens, zero motion tokens, zero z-index scale. Nineteen line-heights, ~23 literal px sizes including half-pixels, 162 hand-written `clamp()`s, five cubic-beziers, `--cyan` meaning two different hues, four names for "muted". A premium design system cannot be built on top of this — you'd be writing the system *and* fighting five prior systems.
3. **Dual-DOM bilingualism.** Both languages in every DOM node, switched by `display: none !important`. It doubles HTML, prevents per-span `lang`, makes one URL serve two languages, and eight of nine routes never even update `<html lang>` when toggling. Fine for a demo; **disqualifying for a production Saudi payments site** (SEO, screen readers, procurement).
4. **`.onetap * { transition-duration: 400ms }` with `transition-property: all`.** Elegant idea, footgun implementation — ten separate rules exist in the same file purely to claw the property list back, and it converts the `border-radius: 8px` focus bug into a *visible 400 ms morph* of every pill CTA on keyboard focus.
5. **36/45 client components.** Every page is a client component including its 200 lines of static bilingual copy. Not a fatal perf number today (First Load JS is ~94–100 kB) but it forecloses streaming, and it means all future content — pricing, legal, case studies — inherits hydration cost by default.
6. **No lint, no CI, no test harness.** `npm run lint` is a broken script. The only quality gates are `tsc --noEmit` and hand-run Playwright `.mjs` scripts. Nothing prevents regression #37 from reappearing.
7. **Repo weight.** 66 MB of 4K HEVC source committed (`.gitignore` names the reassembled filename, so all four `.part` files are tracked), 43.9 MB of it inside `public/` and therefore *deployed and publicly served*, plus a 20 MB orphaned `part00` at repo root that cannot even be reassembled.
8. **`cinema` ships a live placeholder.** `const HERO_VIDEO_TALL = "__HERO_VIDEO_TALL__"` plus three hot-linked CloudFront URLs that abort in every QA run, and a reduced-motion path that only does `display: none` so the video still downloads and plays behind a hidden box.

### Readiness verdict

**The repo can carry an ambitious premium redesign — but only if concepts 07/08 are declared the trunk and 01–06 are deleted rather than migrated.** Concepts 07/08 already contain a working motion law, an accent contract, a reveal system with two solved traps, and a reduced-motion contract. That is 70% of a design system's *thinking*, and none of its *plumbing*. Budget **~15–20 dev-days of foundation work before the first redesign pixel**, and treat 01–06 as a reference gallery you read, screenshot, and then `git rm`.

Attempting the redesign on the current tree — ten stylesheets, three generations, a fork tree — will reproduce exactly the failure the repo's own docs already diagnose: the `latest` hero's "7-layer glow stack / hierarchy collapse."

---

## 2. CSS foundation: firm recommendation

**Recommendation: stay on vanilla CSS. Add three things — a DTCG token layer compiled to custom properties, native `@layer` cascade control, and CSS Modules for the component tier. Do not adopt Tailwind. Do not adopt vanilla-extract.**

### Why not Tailwind v4

Tailwind v4 is genuinely tempting here: `@theme` is a real token engine, it emits native cascade layers, it has no config file, and it has first-class logical properties (`ms-*`/`me-*`/`ps-*`/`pe-*`) which matter enormously for RTL.

It is still the wrong call for this codebase, for four reasons:

1. **The value in this repo is precisely what Tailwind cannot express.** 81 `@keyframes`, conic-gradient radar sweeps, `background-clip: text` gradients, masked 1px `--edge` rims, `stroke-dashoffset` line-draws, `clip-path`, a 240vh sticky walkthrough, a canvas scrub. All of that lands in `@layer components` as hand-written CSS anyway — so you pay the migration cost and keep the CSS.
2. **The Arabic/Latin typographic exceptions are conditional, not compositional.** Rules like `html.en .flow .t-display { line-height: 1.14; padding-block: .04em }` and `html.en .hub-tag .ar-t { letter-spacing: .22em }` are cascade logic. In Tailwind they become custom variants plus arbitrary values — strictly less readable than the CSS that exists.
3. **Migration cost is real and buys nothing measurable.** 5,144 lines, 45 components, RTL-sensitive throughout. Realistically **12–18 dev-days** with a high regression risk in exactly the area (RTL + Arabic tracking) where this team's existing work is strongest.
4. **The actual problem is not "no utility classes," it is "no tokens and no cascade discipline."** Those are solvable in 3 days without a framework.

**vanilla-extract**: rejected. Adds a build-time dependency and a TS→CSS indirection to a team that writes excellent hand CSS, and its zero-runtime story is irrelevant when you already have zero runtime.

**CSS Modules**: recommended, but *only* for the component tier — `WhatsAppWidget`, `Menu`, `BrandsMarquee`, `StickyCTA`, `#prog`. Those are the seven-times-restyled shared components. Modules give you the scope guarantee that "prefix your class names" has already failed to deliver twice (`.radar`, `.brands`, `.wa`, `.stat` are defined with different values in `pulse.css` *and* `latest/machine/video-hero.css`).

### Target architecture

```
app/styles/
  tokens.css      /* @layer tokens   — generated from tokens/*.json */
  reset.css       /* @layer reset    — one *,box-sizing rule, ONE body{overflow-x:clip} */
  base.css        /* @layer base     — html/body/a/img, .ar-t/.en-t, focus-visible */
  motion.css      /* @layer base     — --dur-*, --ease-*, ONE reveal rule, ONE marquee */
  primitives.css  /* @layer primitives — .t-display/.t-beat/.t-body/.t-meta, .cta, .card */
app/globals.css   /* @layer reset, base, primitives, route, overrides;  @import the above */
app/routes/<route>.css  /* @layer route */
components/X.module.css
```

The `@layer` declaration line is the single highest-leverage change in the entire assessment. Today the double-scrollbar fix loses to `latest.css` purely because that file loads later at equal specificity. With layers, `@layer base` beats nothing and `@layer route` beats base *by declaration order, not by file order* — and the class of regression that produced findings #1–#4 in the CSS audit becomes structurally impossible.

### Token layer specifics

Author in **W3C DTCG JSON** under `tokens/`, compile with Style Dictionary (or a 60-line Node script — you have no build pipeline to protect). Emit:

- **Color:** three tiers — primitive (`--rp-blue-500`), semantic (`--color-accent-system`, `--color-accent-action`, `--color-text-secondary`), component. This kills the `--cyan` = two-hues problem: `one-tap`'s teal becomes `--color-accent-system` with a route-level override, and nobody reads a token named after a hue.
- **Space:** a 4px-based scale + `--gutter` (one definition, not three) + `--pad-block`.
- **Radius:** `--r-pill: 999px`, `--r-card: 18px`, `--r-chip: 9px`. Currently there are ten literals and one token in one file.
- **Type:** four steps (`--t-display/beat/body/meta`) as flow/one-tap already declare, plus `--lh-ar-*` / `--lh-en-*` pairs. This is the highest-value token family in the repo — it encodes the Arabic-leading knowledge that currently exists as a comment.
- **Motion:** `--dur-fast: 180ms`, `--dur-base: 400ms`, `--dur-slow: 700ms`, `--ease-out: cubic-bezier(.22,1,.36,1)`. And **the motion law is rewritten with an explicit `transition-property` allowlist** (`opacity, transform, color, background-color, border-color, filter`) — never `all`.
- **Z-index:** a named scale. `.scrim` currently paints below every content container and does literally nothing; that is a z-index-guessing bug.

### Migration cost

| Step | Days | Risk |
|---|---:|---|
| Introduce `@layer` + tokens.css + reset consolidation | 2–3 | Low — additive |
| Port `one-tap` + `flow` onto tokens (they already have local token roots) | 3–4 | Low |
| Extract shared components to CSS Modules, delete the 3 forks | 3–4 | Medium — touches 3 routes |
| Delete concepts 02/03 (and 06) | 0.5 | None if the decision is made |
| Rebuild 01 (`latest`) on the system, or retire it | 5–8 | Medium |
| **Total to a clean token-driven foundation** | **13–19** | |

Versus **12–18 days for a Tailwind migration that leaves you with the same amount of hand-written CSS.**

---

## 3. Performance budget for a cinematic site

First, discard the existing numbers. **LCP 132 ms / 144 ms was measured on localhost against a prod server** — the reports say so themselves ("architecture signal, not field data"). There is *no* field CWV data because concept 08 was never deployed. Treat the site as unmeasured.

### Targets (p75, field, mobile 4G — the only numbers that count)

| Metric | Budget | Stretch | Why |
|---|---:|---:|---|
| **LCP** | ≤ 2.0 s | 1.5 s | Achievable — the LCP element is a 45 KB poster, *if* fonts stop blocking |
| **CLS** | ≤ 0.05 | 0.02 | Already met; will break the moment anyone adds an `<img>` without dimensions (only 3 of ~15 have them today) |
| **INP** | ≤ 200 ms | 150 ms | **The real risk. See below.** |
| TTFB | ≤ 0.6 s | 0.3 s | Static pages on Vercel edge; trivially met |
| Frame rate in scroll-driven acts | ≥ 50 fps mid-tier Android | 60 | Currently unverified — all QA is Chromium desktop |
| Long tasks on load | ≤ 2 over 50 ms | 1 | Currently 1 |

### Asset budgets, derived from what is actually shipping

| Budget line | Limit | Current reality |
|---|---:|---|
| Critical path (HTML + CSS + fonts + LCP image), compressed | **≤ 250 KB** | one-tap ships ~**315 KB of fonts alone** (216 KB preloaded next/font + 98.8 KB local woff2) |
| Fonts total | **≤ 100 KB**, ≤ 2 preloaded | 5 local woff2 with no `unicode-range` + 23 next/font files |
| LCP image | **≤ 60 KB**, `fetchpriority="high"`, `<picture>` art direction | 45 KB ✅ but **no `fetchPriority`**, and the tall crop is client-swapped after hydration → mobile double-downloads and shows the wrong crop |
| Hero video | **≤ 1.2 MB**, poster-first, never the LCP element | one-tap 981/921 KB ✅ · video-hero **1.94 MB `preload="auto"`** ❌ · machine **4.05 MB `preload="auto"` with no poster at all** ❌ |
| Frame sequence | **≤ 1.5 MB**, desktop-only, resident bitmaps capped | 1.23 MB ✅ desktop-only ✅ · **~187 MB of resident ImageBitmap, uncapped** ❌ |
| Route total, mobile | **≤ 900 KB** | flow 214 KB ✅ · one-tap ~1.6 MB ❌ |
| Route total, desktop | **≤ 2.0 MB** | machine 4.45 MB ❌ · video-hero 2.27 MB ❌ |
| First Load JS | **≤ 120 KB** | 94–100 KB ✅ — the one budget comfortably met |

### What the heavy assets actually imply

**Fonts are the LCP liability, not the video.** The hero poster is 45 KB and the film fades in `onCanPlay` — it cannot gate LCP. But `/concepts/one-tap` requests ~315 KB of fonts for a page with one display face, and `IBM_Plex_Sans_Arabic` is requested with `subsets: ["arabic"]` while serving as the body face for all English `.en-t` text — **so every English word silently falls back to system sans-serif while you pay for fonts you don't render.** Fix: move everything to `next/font/local` with vendored, subset woff2 (`unicode-range` split Arabic/Latin), preload exactly two faces. Expect **315 KB → ~110 KB** and a genuine LCP improvement.

**INP is the underrated risk and nothing in the QA history measures it.** Four concrete sources:
- Acts III and V animate **`flex-grow`** on hover/focus (`one-tap.css:483-488`) — that is a full layout+paint on every frame of a 400 ms transition, in a row containing a 2400×1018 image. On a mid-tier phone this is the page's worst frame budget. Prefer `grid-template-columns` with `fr` units (same effect, still layout, but a smaller dirty region) or, better, transform-based scaling of a fixed-width card.
- Four independent scroll listeners, three of which force synchronous layout every frame (`scrollHeight`, `getBoundingClientRect`, a `querySelectorAll` + rect loop in `StickyCTA`). **`StickyCTA` runs all of this on desktop where it is `display: none`.**
- `machine` and `video-hero` still run the **unfixed** pointer spotlight — `querySelectorAll` + `getBoundingClientRect()` on every raw `pointermove`, up to 1000 Hz on a gaming mouse. The fix exists in `latest/page.tsx:144-165` with a comment explaining it, and was never backported.
- The universal `transition-property: all` at 400 ms means any style write anywhere starts an animation. `#prog` has its `width` rewritten every rAF frame *inside* a 400 ms width transition — it can never converge during scroll.

**The 187 MB resident bitmap set is the sharpest un-flagged risk.** 72 × 1100×618×4 B. Desktop-only mitigates it, but low-memory Chromebooks and Safari will evict or crash. Fix: window the set to ±12 frames around the current index and decode on demand, or budget-cap at ~64 MB. If you want a bigger win, the same 6.04 s could be a keyframe-dense H.264 decoded via **WebCodecs `VideoDecoder`** (~150–250 KB, exact frame addressing, no `currentTime` seeking) with the WebP sequence as fallback — but that is 4–6 days of work and a real browser-support matrix; only do it if the frame sequence becomes a repeated pattern rather than a one-off.

**Immediate media wins, in order:** re-encode `vending-video.mp4` to 720p ≈1 Mbps and `preload="metadata"` (**−3 MB**, and give it the poster it never had); same for `hero-video.mp4` (**−1.5 MB**); add AV1/WebM alternates for the two hero films (~30–40% smaller where supported); self-host the cinema CloudFront assets or delete the route.

Enforce all of this in CI with a size check on `public/` per route plus a Lighthouse-CI budget file. Without a gate, the budget is a document.

---

## 4. Rendering strategy: RSC vs client

**Current state: 36 of 45 components are `"use client"`. Every page is a client component, including its several hundred lines of static bilingual copy.** The only server components are layouts and metadata.

### What should be RSC

Essentially all *content*. On `/concepts/one-tap` that is: the `.act.proof` stats band, the close act, the entire footer, `TrustBand`'s markup (logo list is static — only the marquee CSS is dynamic, and that is CSS, not JS), all section copy, all eyebrows and headings, every `<img>`. These are string constants rendered once. They currently ship as JSX in the client bundle *and* as HTML, and then get hydrated for no reason.

### What must stay client — and should be an explicit, named island list

`HeroFilm` · `TapToAction` · `FleetCards` · `ControlRoom` · `MachineCards` · `StickyCTA` · `DropSequence` · `Preload` · `Menu` · `LiquidBackground` · `VendingScroll` · the theme/language toggles · the page-level reveal/`#prog` orchestrator.

The correct shape is: **server page composes server content and passes it as `children` into thin client shells.** `<TapToAction>{serverRenderedCopy}</TapToAction>` — the client component owns the IntersectionObserver and the `<video>`; the copy never enters the client bundle.

### Be honest about the payoff

**This is not primarily a performance win.** First Load JS is already 94–100 kB, close to the React+Next floor; realistic route-JS savings are 8–20 kB compressed per route. What it actually unlocks:

1. **Content can grow without cost.** The dossier's biggest product finding is that ~60% of a real payments site is missing — pricing, PCI/SAMA status, legal pages, case studies, docs, a contact form. Under the current architecture every one of those is a client component. Under RSC they are free.
2. **Streaming and Suspense** for the heavy acts — the control room and frame sequence can be `next/dynamic` islands below a streamed shell, so first paint no longer waits on their JS.
3. **It forces the i18n fix.** RSC + route-based locales (`/ar/...`, `/en/...`) means the server renders **one** language. That halves HTML, gives each page a correct `<html lang dir>` with no client-side `classList` fighting, enables `hreflang`, and deletes the `display: none !important` twin-DOM system entirely — including the 19 English `aria-label`s on an `lang="ar"` document, which become locale-resolved server-side. **Do this and the accessibility findings in §5 of the concept-08 audit mostly evaporate as a class.**
4. **Partial Prerendering** (Next 15+) becomes available later if any of this ever needs real dynamic data.

**Cost:** 3–5 days for one concept, 6–9 days including the i18n route split. **Sequence it with the i18n work — doing them separately means touching every component twice.**

---

## 5. Next.js 14 → 15/16, React 18 → 19

**Recommendation: go straight to Next 16 + React 19, before the redesign, in the same week as the CSS layers work. Cost 1–3 days. Risk is unusually low for this specific app — and the risk that exists is a reason to do it *early*, not late.**

### Why the risk is low here

The breaking changes in 15 and 16 concentrate in surfaces this app does not have:

| Breaking change | Exposure here |
|---|---|
| `params`/`searchParams` become async (15) | **Zero** — no dynamic route segments exist |
| `fetch` no longer cached by default (15) | **Zero** — no `fetch` in any server component |
| `GET` route handlers uncached (15) | **Zero** — no route handlers |
| Caching semantics / `use cache` (16) | **Zero** — fully static, 12/12 prerendered pages |
| Middleware/proxy changes (16) | **Zero** — no middleware |
| AMP removal, `next lint` removal (16) | `next lint` is *already broken* (eslint not installed); migrate to eslint flat config directly |
| Node ≥ 20.9 required | Local is Node 24; pin `engines` + Vercel Node version |
| React 19: `ReactDOM.render`, string refs, function `defaultProps` removed | **Zero** — none used |
| React 19: ref-as-prop, `forwardRef` deprecation | Cosmetic; no `forwardRef` in the tree |

`three@0.149.0` is a bare `WebGLRenderer` + `PlaneGeometry` + shader quad — no React-Three-Fiber, so React version is irrelevant to it. (Separately: 0.149 is from early 2023 and is 600 KB of dependency for a Shadertoy quad; a raw `WebGLRenderingContext` implementation is ~150 lines and removes the dependency entirely. Worth doing if `LiquidBackground` survives the redesign — and note it currently keeps rendering at 60 fps into a `display: none` canvas in light theme on two routes.)

### The one real risk, and why it argues for going early

**Turbopack is the default builder in Next 16, and this codebase's CSS correctness currently depends on file import order.** `latest.css:43` beats `globals.css:39` purely because it comes later at equal specificity. That is exactly the kind of thing a bundler change can reorder. If you upgrade *after* the redesign, a CSS-ordering regression lands in polished work and is hard to attribute.

Do the upgrade and the `@layer` refactor together: layers make cascade order explicit and bundler-independent, which converts the upgrade's main risk into a non-issue permanently.

**Practical plan (1–3 days):** branch → `npm i next@16 react@19 react-dom@19 @types/react@19 @types/react-dom@19` → run the codemod (`npx @next/codemod@canary upgrade latest`) → `tsc --noEmit` → build with and without Turbopack → run the existing Playwright harnesses (`qa-onetap.mjs`, `perf-onetap.mjs`, `vframes.mjs`) across all 9 routes in AR/EN/reduced-motion → visual diff against `docs/` baselines. You already have the regression tooling; use it.

**Bonus:** the upgrade closes all three high-severity advisories (see §6) without a separate remediation project.

---

## 6. Build/deploy risks

### `next/font/google` requires network at build — **Medium risk, real, already bitten you**

This is not theoretical: `flow/layout.tsx:18` and `one-tap/layout.tsx:21-23` document self-hosting Readex Pro and Plex Mono *because* "next/font's Google fetch proved flaky at build time in this repo." A Vercel build with a Google Fonts hiccup fails or silently degrades. Worse, the mitigation is self-contradictory — `--fb` (the body face on both self-hosted routes) is still `var(--font-plex)`, i.e. next/font from Google. If the stated flakiness is real, **all Arabic body copy on the two flagship concepts falls back to bare `sans-serif`.**

**Fix (1 day, do it before redesign):** vendor Bricolage Grotesque and IBM Plex Sans Arabic into `public/fonts`, load everything through `next/font/local`, subset with `pyftsubset`/glyphhanger, add `unicode-range` so the Arabic face is not fetched for a Latin-only render. Deterministic builds, no network dependency, ~200 KB saved, and the "Arabic subset serving Latin text" bug dies at the same time. This is the single best ratio of effort to compounding benefit in the whole assessment.

### `master.mp4.part00` and friends — **Low functional risk, High hygiene/cost risk**

Verified: 20,971,520 B at repo root, orphaned (its siblings live only in `public/assets/flow/`), byte-identical to `public/assets/flow/master.mp4.part00`, unreferenced anywhere in code or docs, with no reassembly script. `.gitignore` says `public/assets/flow/master.mp4` — which ignores the *reassembled* filename only, so all four `.part` files are tracked. Net: 66 MB committed, 43.9 MB of it under `public/` and therefore **copied into the deploy output and publicly served by Vercel at `/assets/flow/master.mp4.part00`.**

Nothing breaks. What it costs: 82.88 MiB clones, slower CI checkout on every build, deploy payload bloat, and a 4K master exposed on a public URL.

**Fix:**
1. `git rm master.mp4.part00` (root) and `git rm --cached public/assets/flow/master.mp4.part*`; move the source outside the repo or into object storage. **~15 min.**
2. Correct the pattern to `public/assets/flow/master.mp4*`.
3. Removing from HEAD does **not** shrink clones — history still holds 66 MB. If clone time matters, `git filter-repo` + force-push, which requires coordinating with anyone holding a clone. **Half a day, and only worth it if the repo will be handed to a client or a growing team.** Otherwise accept the 83 MB pack and move on.

### npm advisories — **Low actual exploitability, High procurement risk**

I verified the current state: **3 high severity**, all in the `next` tree plus transitive `postcss`. `npm audit fix --force` wants `next@16.3.1`.

The Next advisories are Server Actions DoS, Image Optimization DoS, middleware cache poisoning, RSC cache poisoning, SSRF in rewrites/WebSocket upgrades, CSP-nonce XSS. **This app uses none of those surfaces** — no Server Actions, no `next/image` (zero usage repo-wide), no middleware, no rewrites, no custom server, fully static output. The postcss advisories are build-time `sourceMappingURL` path traversal against attacker-controlled CSS — you author all CSS. **Real-world exploitability is close to zero.**

But: R.Pay is a payments company selling to Saudi enterprise and property groups. A security questionnaire returning "3 high severity vulnerabilities" is a procurement problem regardless of exploitability, and there is no `SECURITY.md`, no Dependabot/Renovate, and no CI to catch the next one. **Fix by taking the §5 upgrade — same work, closes the finding.** Then add Renovate and an `npm audit --audit-level=high` CI gate.

### Two more the question didn't ask about, both cheap and both real

- **`metadataBase` is `https://r-pay-orcin.vercel.app`** and `NEXT_PUBLIC_SITE_URL` still defaults to it, while `rpay.sa` serves a *different* site. Every OG/Twitter URL resolves to a preview domain. Also missing: `robots.ts`, `sitemap.ts`, `not-found.tsx`. And `one-tap/layout.tsx`'s `openGraph` block **replaces** rather than merges the root's — Next does not deep-merge `openGraph` across segments — silently dropping `type`, `locale`, `alternateLocale`, `siteName`, `url`.
- **Real-device iOS/Safari smoke testing has never been performed** — stated twice in the reports. This is a site whose signature interactions are `100svh`/`100vh` mixing, `position: sticky`, `overflow: clip`, `backdrop-filter`, autoplay video, and a canvas scrub. Two of the concepts exist only because earlier ones *broke on iPhone* ("Restored" is a scar, not a status). **Chromium-only QA on a cinematic mobile-first Arabic site is the biggest untested surface in the project.** Budget a real device lab pass (iPhone SE / 13 / 15 Pro, iOS Safari + in-app WhatsApp browser, which is how most of this traffic will actually arrive).

---

## 7. Engineering foundations to lay BEFORE redesign, in order

Each phase is gated: do not start the next until the gate passes.

**Phase 0 — Decide (0.5 day, non-negotiable, blocks everything).**
Pick the trunk. Recommendation: **one-tap (08) is the design trunk; latest (01) is the information-architecture trunk; everything else is deleted.** Also settle the two content contradictions that will otherwise get baked into the redesign: (a) is R.Pay *the* largest regional arcade operator, or does it *serve* it — 01–05 and 07–08 say opposite things; (b) Arabic brand rendering — «آر باي» vs Latin "R.Pay" mid-sentence, and formal MSA vs the Saudi dialect that 07/08 slip into.
*Gate: a one-page written decision.*

**Phase 1 — Hygiene and deletion (1–2 days).**
`git rm` concepts 02, 03, 05, 06 and their forked `_c/` components. Delete `master.mp4.part00`, fix the `.gitignore` pattern, move the 4K master out of `public/`. Install eslint (flat config) + Prettier. Add a GitHub Actions CI: `tsc --noEmit`, lint, `next build`, `npm audit --audit-level=high`, and a `public/` size budget check.
*Gate: CI green on a tree with four concepts.*
*Note: deleting four concepts removes ~2,000 lines of CSS and three component forks in a day. Nothing else on this list has that ratio.*

**Phase 2 — Framework upgrade + cascade layers, together (2–4 days).**
Next 16 + React 19 + codemod. Simultaneously introduce `@layer reset, base, primitives, route, overrides`, consolidate the reset (one `*` rule, one `body { overflow-x: clip }`), and delete the redundant/dead language plumbing (`cinema.css:18-20`, `pulse.css:22-24` etc. are unreachable behind globals' `!important`).
*Gate: Playwright regression sweep across remaining routes × AR/EN × reduced-motion, visual diff vs `docs/` baselines, zero rogue scroll containers.*

**Phase 3 — Fonts (1 day).**
All faces to `next/font/local`, vendored, subset, `unicode-range`-split, exactly two preloaded. Removes the build-time network dependency, fixes the Latin-fallback bug, saves ~200 KB.
*Gate: build succeeds with network egress blocked; English body copy renders in the intended face.*

**Phase 4 — Token layer (3–4 days).**
`tokens/*.json` → `tokens.css`. Semantic naming (`--color-accent-system` / `--color-accent-action`, never `--cyan`). Port flow + one-tap. Rewrite the motion law with an explicit `transition-property` allowlist. Add the z-index scale.
*Gate: zero hardcoded hex outside `tokens.css`; zero `transition-property: all`; a `<400 line` token file replaces five token roots.*

**Phase 5 — i18n + RSC together (6–9 days).**
Route-based locales `/ar` `/en`, server-rendered single language, correct `lang`/`dir`, `hreflang`, locale-resolved `aria-label`s. Convert content to RSC; define the explicit client-island list. Delete the twin-DOM `.ar-t`/`.en-t` system and per-page `toggleLang` duplication (persist the choice — theme persists, language doesn't).
*Gate: HTML weight halved; every `aria-label` in the page's language; a11y audit clean on landmarks.*

**Phase 6 — Motion + interaction primitives (2–3 days).**
One shared hooks module: `useReducedMotion` (**with a `change` listener** — every current check is read-once at mount, so toggling the OS setting mid-session does nothing until reload), `useReveal` (the dual-observer + tail-sweep pattern, extracted once), `useScrollProgress` (**one** rAF-gated scroll manager replacing four independent listeners that each force layout), `useCountUp` (one easing, replacing six implementations). Fix `border-radius: 8px` in `:focus-visible`, backport the rAF-throttled pointer spotlight, kill `StickyCTA`'s desktop work.
*Gate: exactly one `window.addEventListener("scroll")` in the codebase.*

**Phase 7 — Performance gates (2 days).**
Lighthouse-CI with the §3 budgets. Per-route asset weight check. Real-device iOS pass. Deploy to a preview domain and collect **actual field CWV** — you currently have none.
*Gate: p75 LCP/CLS/INP from real devices, budgets enforced in CI.*

**Total: 17–26 dev-days.** Phases 0–2 (≈4–7 days) are the ones that make everything after cheaper; if only one week is available, do those.

---

## 8. Keeping design and code in sync

**Sequencing matters more than tooling here. Do not buy Code Connect before you have components.**

### Stage 1 — Code is the source of truth (now)

There is no evidence of a Figma library in this repo, and the design intelligence currently lives in `.md` reports and CSS comments. So: **`tokens/*.json` in W3C DTCG format, in this repo, is the single source of truth.** One build script emits three artifacts:

1. `app/styles/tokens.css` — CSS custom properties (what ships)
2. `tokens.d.ts` — a union type of token names, so TS catches typos in inline styles
3. `tokens.figma.json` — the Figma Variables import payload

Push to Figma via the Figma MCP (`use_figma` / `search_design_system`) or the REST Variables API. **Direction is one-way: code → design.** This matches reality — the design decisions here were made in CSS, screenshot-verified, and documented after the fact.

Cost: **1–2 days** on top of Phase 4.

### Stage 2 — Build the Figma library from the code (after Phase 4)

Once tokens exist and components are consolidated (Phase 1 + the CSS Modules work), generate the Figma library *from* the code — the `figma-generate-library` workflow exists for exactly this. Component set: `Button` (warm/ghost/text-link — three tiers, one verb), `Card` (fleet/machine), `Eyebrow`, `StatBlock`, `SimulationChip`, `Marquee`, `StickyCTA`, `Nav`, `Footer`. That is ~9 components, which is a tractable library and roughly the real surface area of concepts 07/08.

**Critical, and easy to get wrong: every component needs an AR and an EN variant.** Arabic runs ~20–25% shorter with no capitals and different leading. A Figma library built only in Latin will produce designs that break in the primary language. Bind the `--lh-ar-*` / `--lh-en-*` token pairs as Figma variable modes (`dir: rtl | ltr`).

Cost: **3–5 days.**

### Stage 3 — Code Connect (only after Stage 2 is stable)

Map the ~9 components with `.figma.tsx` files so Figma Dev Mode shows the real JSX and real token names instead of generated CSS. This is where design/code drift actually gets caught: a designer who detaches an instance or hardcodes `#00AEEF` sees it immediately.

Cost: **1–2 days for 9 components.** Ongoing cost: one `.figma.tsx` per new component — roughly 20 minutes each, which is the cheapest governance available.

### The governance rule that actually prevents drift

Tooling alone will not hold. Add one CI check and one review rule:

- **CI:** fail the build on any hex color, any `px` radius, or any raw `transition-duration` outside `tokens.css`. A ~40-line regex script. This is what stops `--cyan` from being redefined to a different hue in a sixth file.
- **Review:** *new tokens require a PR to `tokens/`, never a local `:root` override.* The three-generation drift documented in the audit — four names for "muted" with five values, three `--padx` definitions, three `--edge` definitions, `--warm` at `#FFB65C` vs `#FFB454` — happened entirely because each new concept was allowed to declare its own root. Layers make that structurally visible; the review rule makes it socially expensive.

### What *not* to sync

Do not try to represent the cinematic layer in Figma — the frame sequence, the video→DOM echo handoff, the 240vh sticky walkthrough, the canvas scrub. Those are code artifacts; Figma can hold a storyboard and a set of composed stills (which is exactly what the visual system doc already specifies: "every animation resolves into a composed still that is the next section's layout"). Sync tokens and components. Storyboard the motion. Trying to make Figma the source of truth for a WebCodecs-adjacent scrub interaction wastes weeks and produces a lie.

---

## The one-paragraph answer

The codebase is a genuinely skilled exploratory gallery carrying three generations of architecture and a fork tree, with the best engineering (concepts 07/08) sitting alongside code that actively undoes its own documented fixes (concepts 01/02/03). It is ready to carry a premium redesign **only after you delete four concepts, add cascade layers and a token layer, upgrade to Next 16/React 19, self-host the fonts, and replace the twin-DOM i18n with server-rendered locale routes** — roughly 17–26 dev-days, of which the first 4–7 (delete + upgrade + layers) do most of the work. Stay on vanilla CSS; the problem was never the absence of a framework, it was the absence of tokens and cascade discipline, and Tailwind would cost the same to adopt while leaving all 81 keyframes hand-written. The performance risk everyone will look at is video weight; the performance risk that will actually bite is INP from `flex-grow` transitions, four layout-forcing scroll listeners, and `transition-property: all` — none of which any existing measurement covers, because there is no field data at all.