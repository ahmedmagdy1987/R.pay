# R.Pay — Final Creative Direction

**Adjudicated by the Creative Director. This is the call, not a menu.**

Where the four lenses disagreed, I say who wins and why. Verified against the tree: `--warm: #FFB454` and `--cyan: #35E0D4` at `one-tap.css:34-35`, `border-radius: 8px` at `:230` inside the focus rule, `--r: 18px` / `--w-content: 1240px` / `--w-text: 760px` at `:44-46`, `public/fonts/` holds only Readex Pro ×3 + Plex Mono ×2, `three@0.149.0` still in `dependencies`, eight concept routes still on disk.

---

## 0. The adjudications, up front

| Conflict | Lenses | Call | Why |
|---|---|---|---|
| Kill cyan vs. keep the cyan/warm accent contract | CD vs. Motion | **Keep the contract, retire the hue.** System energy re-maps from cyan to *luminance* (bone-white); warm amber becomes the only chromatic accent. | The contract is the audited asset (held across 1,199 lines). The hue is the liability. Motion's requirement was that colour *travel*, not that it be cyan. |
| Signature = the receipt vs. the wavefront | CD vs. Motion | **Both — they are the same object.** The wavefront is the join travelling (Act I); the receipt is proof the join happened (Act IV). | Resolves CD's "everyone's signature move is a ripple" and Motion's "a scaling circle is two CSS properties" in one form. |
| ControlRoom: rebuild as tabs vs. replace with a receipt | Product vs. CD | **Receipt wins.** Delete the 240vh sticky. | Tabs fix accessibility but still spend the page's most valuable real estate arguing with fabricated data behind a disclaimer. The receipt needs no disclaimer, works at full fidelity on a phone, and is server-rendered text. |
| Ship hero stills at 250–400 KB vs. LCP image ≤60 KB | CD vs. Frontend | **Split the asset.** Desktop AVIF 90–140 KB, mobile AVIF 45–70 KB, `<picture media>` server-decided. Pay for it by killing 200 KB of fonts. | CD is right that 45 KB banded mush isn't premium; Frontend is right that p75 mobile 4G is the real constraint. Art direction dissolves the conflict, and AVIF specifically fixes dark-gradient banding — the exact complaint. |
| Scroll reveals: scrubbed/reversible vs. play-once | Motion flagged it needs sign-off | **Signed off: content reveals stay one-way; ornament, parallax and the join are scrubbed and reversible.** | A claim that fades back out when a buyer scrolls up to re-read it reads as broken. Reversibility is right for the wake, wrong for the copy. |
| Keep `DropSequence` | Motion + Frontend praise it | **Retire it with `/flow`.** | 1.23 MB desktop-only for a 6s can-drop that argues nothing commercially, on a phone-first market where the sequence is structurally skipped. Deleting the best code in the repo is the correct call; its mobile path (3 stills) already proves the content works static. |
| GSAP | Motion argued both sides | **No GSAP.** WAAPI with manually driven `currentTime`. | The compositor argument is decisive for a Snapdragon buyer walking a mall. The repo has hand-rolled correct pinning twice already. |
| Three.js / `LiquidBackground` | Unanimous | **Delete.** | 600 KB for a Shadertoy quad that renders at 60fps into a `display:none` canvas on two of three routes. |

---

## 1. Overall creative direction

### **الوَصْل — Al-Wasl** *(the join · the connection · and in Saudi commerce, the receipt)*

**Manifesto.**

Arabic does not set letters beside one another. It *joins* them — and the stroke that does the joining, the kashida, is the only mark in typography that is simultaneously a letter, a line, and a length of time. R.Pay is that stroke.

A machine in a hall in Riyadh stands alone all day until a hand touches it. The tap joins the machine to a card, the card to an account, the account to an operator watching ninety-seven of them on one surface. And **وصل is also the Arabic word for a receipt** — the plain paper proof that the join occurred, and the thing every Saudi merchant hands over without being asked.

So the brand owns exactly one form: **a single horizontal stroke, one weight, that extends, carries, arrives, and stops.** It is the progress hairline. It is the rule under the active line. It is the ledger line beneath every number. It is the path a payment travels. It is the boundary between one act and the next. It is the elongation inside the wordmark itself. It never becomes a gradient, never glows, never becomes a ring, never overshoots.

Everything else is near-silent — one warm ink ground, one paper-warm off-white, one accent that is not blue — so that the only thing coloured, and the only thing that moves, is the join.

**The page should read the way a receipt reads: right to left, unarguable, and finished.**

**The three hard consequences of adopting this:**
1. There is no gradient anywhere on the site. `--grad` and every `background-clip: text` headline are deleted the same day.
2. Nothing is invented. If a figure needs the pill «محاكاة مباشرة», it does not ship — the claims ceiling stops being a mitigation and becomes the art direction.
3. Every motion on the page is either the join, or the join's wake. If a motion cannot be traced to the stroke, it is cut.

**Why this and not something louder:** the crop test. Crop any screen of the current site, remove the logo and the Arabic, and nobody can name the company or even the category. One drawn stroke repeating in six roles is the cheapest mechanism that survives that test. Effects don't survive it; proprietary form does.

---

## 2. Visual style

**Two-ink, one-accent, photography-carried.** Near-monochrome warm-black ground with paper-warm type; sodium amber as the single chromatic voice, deployed as **large flat fields and full type** (the Jeton mechanism), not as a 999px pill in the corner; all remaining colour supplied by real photography.

Concretely, what changes on screen:

- **No gradients.** Not on headlines, not on buttons, not on backgrounds, not on card rims. The `--edge` masked-hairline device — currently defined three times with three values — is replaced by a single flat 1px `--line`.
- **No glassmorphism.** `backdrop-filter` count goes to zero site-wide. `one-tap.css` already has zero; that divergence becomes the rule.
- **No glow.** `filter: blur()` is permitted only on a static, non-animated contact shadow. The 7-layer glow stack that the repo's own research names as `latest`'s failure mode is structurally impossible under the token gate (§14).
- **One radius family, and one deliberate exception.** `--r-card: 18px` everywhere; `--r-receipt: 4px` on the receipt only, because paper does not have 18px corners. That single exception is a material signal, not a drift.
- **Grain, not gloss.** A baked achromatic grain tile (`feTurbulence` rendered once to a 128×128 AVIF, ~2 KB, `background-repeat`, never animated) at 2.5% over the ground. This is what Linear actually owns and what R.Pay currently lacks; it also kills banding on dark falloff, which is the other half of the compression complaint.

**Register:** instrument, not showroom. Closer to a well-made piece of hardware documentation than to a fintech landing page. Composed authority, not racing energy — which is the research doc's own phrase for what "Total Control" should feel like, finally honoured.

---

## 3. The new hero experience

One object, one event, one sentence, one CTA — and **the interface is never inert**.

**Composition.** Full-bleed film of a real hand tapping a real R.Pay terminal on a real machine in a real Saudi hall (§7). Copy stack pinned to the inline-start (right in Arabic). Headline «لمسة واحدة. تحكّم كامل.» — the best copy in the repo, kept verbatim. One dominant amber CTA, one ghost secondary. **Plus the missing line the whole dossier flagged:** an audience noun in the subhead — «نظام الدفع والتحكّم لماكينات الخدمة الذاتية في السعودية». No chip rows, no stat widgets, no second headline in the opening frame.

**The three-second score** (WAAPI + one `useEffect`, no dependencies):

| t | What happens |
|---|---|
| SSR | `<picture media>` emits the correct crop server-side (kills the mobile double-download), `fetchPriority="high"`, `<link rel=preload>` for the display woff2, `font-display: optional`. Headline **line 1** is painted server-side and never animates — it is the LCP text. |
| 0 → 120 ms | **Deliberate stillness.** A held beat. This is what separates "designed" from "loading." |
| 120 → 560 ms | Headline line 2 wipes up from an `overflow: clip` mask (there is currently not one clip-path text mask in 5,144 lines). Simultaneously the poster begins a `scale(1) → 1.035` push over **2400 ms** — the camera never stops, so no frame in the opening is dead. |
| 300 ms | Kicker + subhead rise `0.5em`, `--d-3`. |
| 520 ms | CTA pair. The primary is the **only** element on the site permitted `--e-spring` — ~4% overshoot, settling. That is the page's entire spring budget, spent on the thing you want clicked. |
| 700 → 1300 ms | Video crossfades over the poster, inheriting the poster's *computed* scale at t=700 (≈1.008) so there is no jump. Poster stays underneath — no black flash on failure. |
| **3200 ms** | **الوصل fires.** See §16. |

**Three defects fixed in the same commit, all of them fatal today:**

1. `v.play().catch(fire)` — there is currently no `.catch()` on initial autoplay. `onCanPlay` fires even when the UA refuses playback (iOS Low Power Mode, data-saver), so `on` becomes true, `currentTime` never reaches 3.2, and **the signature moment never runs, permanently, for an entire class of users.** Plus a `setTimeout(fire, PULSE_AT*1000 + 400)` failsafe. `fire()` is already idempotent via `echoFired`.
2. `requestVideoFrameCallback` instead of `onTimeUpdate` — the latter fires ~4×/s, so the handoff currently lands up to 250 ms late. That lateness is precisely why it reads as *close* rather than *exact*.
3. `PULSE_AT` stops being a hand-measured constant coupled to one cut. Ship the film with a sidecar `{ pulseAt, originX, originY }` JSON so a re-shoot doesn't silently desync the brand's signature moment.

**Failure is art-directed, not degraded:** no video → the join still fires from the same origin over the still poster. Reduced motion → no `<video>` element is created at all (preserve `HeroFilm.tsx:31-36` exactly, it is rare and correct) and the join runs as a colour/opacity sequence in the same order.

---

## 4. Typography direction

**Arabic is drawn first. Latin is cut from it.** This is the whole lesson from 29LT's Tamara wordmark and from NEOM, and it is the single decision that separates "a Saudi brand" from "a brand available in Saudi Arabia."

**Retire immediately:** Readex Pro (all three self-hosted statics), Bricolage Grotesque (a Latin-only face currently forced onto Arabic headlines in `hub`, `coming-soon`, `cinema`, `pulse` and `latest`, producing synthetic weight above 700 — in Arabic that does not read as bold, it reads as smeared), and IBM Plex Sans Arabic in any display role (it is IBM's corporate UI face).

**Ship:**

| Role | Face | Why |
|---|---|---|
| **Display** | **29LT Kaff** (Pascal Zoghbi / 29LT) | Kufic-derived geometric construction, Arabic-first, with a Latin cut by the same hand. Carries the kashida geometry the whole direction depends on. |
| **Text / UI** | **29LT Bukra** (variable) | Arabic and Latin share a skeleton. Variable `wght` axis unlocks weight-axis motion on Arabic display type — something almost nobody has done well, and currently impossible because the repo ships a variable face as three statics. |
| **Machine voice** | **IBM Plex Mono** (retained) | Already self-hosted, already correct: digits/Latin only, `direction: ltr; unicode-bidi: isolate` so machine IDs and SAR amounts never reverse in RTL. Reads as thermal-printer output, which is exactly on-thesis. |

**Tier-up path, if the owner buys it:** commission a bespoke Arabic display from 29LT or TPTQ Arabic (Greta Arabic + Greta Sans is the reference for one design across two scripts) and cut the Latin from the commission. That is the NEOM tier. **Do not block the build on it** — license Kaff + Bukra now (≈1 week, low four figures), commission in parallel (8–14 weeks). This is the longest lead item in the project.

**Hard rules, enforced in tokens:**

- **Weight cap = what the Arabic face actually ships.** No 800, no 900, ever, in either script. Synthetic bold on Arabic dies today.
- **`letter-spacing: normal` on Arabic, always.** Latin tracking severs cursive joining. The existing `.ar-t` rule plus its five documented per-site opt-back-ins for tracked Latin labels is correct and survives verbatim.
- **Leading is set for Arabic first, then tightened for Latin.** `flow.css:104-141` — the best typographic work in the repo, currently buried in a comment — is promoted to token pairs: `--lh-ar-display: 1.34` / `--lh-en-display: 1.14`, with `--pb-ar-display: .14em` / `--pb-en-display: .04em` so the damma clears its box. These numbers are screenshot-verified, not arithmetic. Do not re-derive them.
- **Measure is a token pair, not one value.** Arabic runs 20–25% shorter for the same meaning, so a 760px box holds too much of it: `--w-text-ar: 640px` / `--w-text-en: 760px`. The research doc identified this and nobody operationalised it.
- **One numeral policy: Western digits, `tabular-nums`, everywhere.** Kill the lone Arabic-Indic stray in `cinema`. Operators read SAR and machine IDs in Western digits; mixing is a bug, not a flourish.
- **Five type steps, no half-pixels.** `--t-display: clamp(2.6rem, 6.4vw, 5.6rem)` · `--t-beat: clamp(1.5rem, 3.8vw, 2.6rem)` · `--t-body: clamp(1.05rem, 1.5vw, 1.18rem)` · `--t-meta: .8125rem` · `--t-led: clamp(.9rem, 1.4vw, 1.05rem)`. The current 23 literal sizes including `10.5/12.5/13.5/16.5px`, 19 line-heights and 15 tracking values are all deleted.

**Loading:** everything through `next/font/local`, vendored, subset with `unicode-range` splitting Arabic from Latin, exactly two faces preloaded. `/concepts/one-tap` currently requests ~315 KB of fonts for a page with one display face — and because `IBM_Plex_Sans_Arabic` is requested with `subsets: ["arabic"]` while serving as the body face for all `.en-t` text, **every English word on the flagship concept silently falls back to system sans-serif.** Target: ~110 KB, deterministic, no build-time network call.

---

## 5. Color and lighting system

**One accent. One instrument ink. One alert, used once. Everything else is photography.**

The adjudication in full: cyan goes, but the *role separation* survives. Today the contract is chromatic (cyan = system, warm = human). Tomorrow it is **thermal** — cool bone-white = instrument, warm amber = human touch. That is how real hardware is lit, it is materially truer, it is better for colour-blind users than cyan/amber (luminance separation beats hue separation), and it leaves the page with exactly one chroma so a screenshot is instantly attributable.

### Primitives

```css
/* ground — warm black, not the current blue-black #040f1e */
--ink-950: #0B0907;   /* page ground                          */
--ink-900: #14110D;   /* raised surface                       */
--ink-800: #1E1A15;   /* card / receipt shadow catcher        */

/* paper */
--bone-050: #FFFBF4;  /* instrument ink — LEDs, status, live  */
--bone-100: #F4EFE6;  /* primary text on dark · light ground  */
--bone-300: #CFC7BA;  /* secondary text            11.3:1     */
--bone-500: #9A9184;  /* meta / tertiary            6.1:1     */

/* the one accent — already validated in-repo at one-tap.css:35 */
--amber-500: #FFB454; /* on --ink-950 → 7.3:1  (AA body, AAA large) */
--amber-600: #E89A3C; /* pressed                              */
--amber-800: #7A4404; /* amber for LIGHT surfaces  5.0:1      */
--amber-ink: #241503; /* text on amber fields      6.9:1      */

/* the only other hue on the site */
--alert-500: #E5533D; /* offline / geofence breach. Used once. */

--line: rgba(244,239,230,.14);  /* one hairline. One value. */
```

### Semantic layer (this is what components consume)

```css
--surface-page · --surface-raised · --surface-paper
--text-primary · --text-secondary · --text-meta · --text-on-accent
--accent-action     /* --amber-500 · buttons + text links ONLY, never on data */
--accent-instrument /* --bone-050  · pulse, LED, status, #prog, the join      */
--accent-alert      /* --alert-500 · one state, one meaning                   */
--rule              /* the join                                              */
```

Nobody reads a token named after a hue again. `--cyan` currently means two different colours depending on route (`#00AEEF` in nine files, `#35E0D4` in `one-tap`); `--muted`/`--mut`/`--mute` are four names for one role with five values. Both classes of drift become impossible.

### Lighting

**Theme is assigned by job, not by preference** — an adjudication nobody made and the cheapest way to resolve the dark-only-vs-light-theme argument:

- **Story surfaces are dark-only** (home, sector pages, anything carrying the film). Every scene asset is a night scene; a light theme there is a different art direction, not a token swap. The repo already decided this correctly at `one-tap/layout.tsx:23-25`.
- **Reference surfaces are light** (`/trust`, `/pricing`, `/hardware`, `/customers`, legal). These get read, scanned, printed and forwarded to procurement. Dark is hostile to that job.
- **The receipt is the bridge** — a paper-warm object on warm-black. It is literally the light theme, held in the hand, inside the dark story. That is why the two themes read as one system rather than two moods.

Lighting on photography: **one direction, warm, low, hard.** Gulf afternoon through mall glazing, or evening sodium. Never the moody teal top-light that every current plate uses and that makes the machines look like they live in the same generic hall — because they do.

---

## 6. Layout and composition

**Origin is inline-start.** The grid begins at the right edge in Arabic and mirrors wholesale in English. 419 logical-property uses already exist; that discipline is preserved and extended to the two places it broke — the WhatsApp widget (currently physical `right: 22px` on three routes and `inset-inline-start` on four, landing on **opposite screen edges** depending on route and language) and the `.concept-back` pill.

**Grid.** 12 columns, `--gutter: clamp(20px, 5vw, 64px)` — **one definition**, replacing three `--padx` values. `--w-content: 1240px` (keep, it is already tokenized). Measure per §4. Content is centred; the *composition* is asymmetric — copy locked to inline-start, object to inline-end, which is what gives the page a reading direction instead of a centre of gravity.

**Spacing.** 4px base, 8px vertical rhythm. `--s-1: 4px` through `--s-14: 160px`. `--gap-act: clamp(4rem, 8vw, 6.75rem)` retained from the repo. Every one of the 162 hand-written `clamp()` calls that is not one of these tokens is deleted.

**Density rules — two, both hard:**

1. **Every viewport of scroll reveals a fact or advances a state.** (The repo's own rule, currently violated by 240vh of rising bars.)
2. **No act may exceed `100svh` unless it is scrubbed, and only one act per site may be scrubbed.** With the sticky ControlRoom deleted and `DropSequence` retired, the scrubbed budget is spent on nothing — the hero is play-once. That is deliberate: the motion budget goes into the join, not into pinning.

`100vh` is banned. The site currently sets `min-height: 100vh` on `.onetap` while `.hero` and `.ctrl-stick` use `100svh` — mixing the units on one page undercuts the exact scroll contract the same file spends paragraphs defending.

---

## 7. Product presentation

**The machine is never the hero. The join is.** Machines appear as the context for a tap, at real scale, in real places.

**One shoot day, and it solves three problems at once** — this is the highest-ratio spend in the plan and no single lens spotted the convergence:

Shooting one real R.Pay terminal on real machines in one named client venue simultaneously produces (a) the photography that kills the AI-artifact problem permanently, (b) the case study the site has never had behind thirteen logos, and (c) the written logo permission you need anyway. Book the venue, the customer quote and the photographer on the same purchase order.

**What gets shot:**
- The terminal at **1:1 physical scale** on a desktop viewport, at least once. A real-size object on screen is a premium trick almost nobody uses and it is free.
- The hand at the moment of contact — from behind and slightly above, operator's-eye, not consumer's-eye.
- Three machine types in three real venues, in the same light, at the same focal length, cropped identically. Consistency of *plate* is what makes a set of three read as a system rather than three stock images.
- The operator, on a phone, in the hall, looking at their own fleet. This is the buyer seeing themselves — currently absent from every one of eight concepts.

**AI keeps exactly one job:** motion beats that are impractical to shoot (a macro of the NFC field, an abstract network beat). Everything else anchors to a real plate. The Higgsfield pipeline stays — it is documented, credit-budgeted and identity-anchored, and the discipline of "zero language-dependent text baked into any generated frame" is correct and stays.

**Never again, and these are in the repo today:** the doubled phone edge at the hand in `hero-poster.webp`; garbled snack packaging in `network-hall.webp`; the hallucinated coffee-kiosk label. The reject list — "Nexxpa Herrutyge," "CUCCI," "CERAGTOYDO," a reader corrupted to "B.PAY" — is the confession that the mitigation was necessary because the source was wrong.

**Ship weight:** AVIF primary, WebP fallback. Desktop hero 90–140 KB, mobile 45–70 KB, `<picture media>`, `fetchPriority="high"`. AVIF's better entropy coding on dark gradient falloff is specifically what fixes the banding — you get the CD's premium image *and* the architect's budget, which is why this conflict was never real.

---

## 8. Motion and animation language

**The governing principle:** *One cause, one consequence, one clock per act. The page has one moving object at a time; everything else is its wake.*

Concept 08 already achieves **resolution** — every act lands on a composed still. It has never achieved **causality** — no act's motion is caused by the previous act's. That gap is the entire distance to the reference set.

### Easing — five curves, each with a job

```css
--e-move:  cubic-bezier(.30, 0, .10, 1);   /* workhorse, 80% of motion */
--e-enter: cubic-bezier(.16, 1, .30, 1);   /* displacement ≥48px ONLY   */
--e-exit:  cubic-bezier(.50, 0,   1, 1);   /* accelerate away, no settle */
--e-morph: cubic-bezier(.65, 0, .35, 1);   /* both endpoints on screen  */
--e-join:  cubic-bezier(.20,.55,.25, 1);   /* THE STROKE — near-constant
                                              velocity, soft arrival     */
--e-spring: linear(0,.006,.025 2.8%,.101 6.1%,.539 18.9%,.721 25.3%,
             .849 31.5%,.937 38.1%,.968 41.8%,.991 45.7%,1.006 50.1%,
             1.015 60.2%,1.006 76%,1);     /* ONE element, page-wide     */
```

**Why the current house curve is demoted, with the arithmetic.** `cubic-bezier(.22,1,.36,1)` at 400 ms covers 66% of distance in 77 ms and 88% in 137 ms. For a 12px rise that is **10.6px in the first 137 ms** and the remaining 1.4px spread over 263 ms — under a pixel per frame, invisible. The declared "400 ms motion law" is perceptually a **140 ms fade with a 260 ms dead tail**. That single fact is why the site reads as "things pop" rather than "considered," and it is why the law survives as `--e-enter` for large displacement only.

**The join does not overshoot.** `--e-spring` is banned on it. A drawn stroke that springs reads as elastic; the thesis says the stroke *stops*. Restraint here is thematic, not timid. The one spring on the site lives on the primary CTA, which is the correct place to spend it.

### Duration — a ladder derived from distance, not taste

```css
--d-1:  120ms;  /* hover tint, focus ring, icon swap   */
--d-2:  200ms;  /* button press, LED, toggle           */
--d-3:  320ms;  /* element reveal ≤24px                */
--d-4:  520ms;  /* layout change: 0fr→1fr, accordion   */
--d-5:  840ms;  /* act entrance, hero copy line        */
--d-6: 1400ms;  /* SIGNATURE ONLY. Budget: 2 per page. */
```

| displacement | duration | curve |
|---|---|---|
| ≤8px | `--d-1` | `--e-move` |
| 8–24px | `--d-3` | `--e-move` |
| 24–64px | `--d-4` | `--e-move` |
| 64–200px | `--d-5` | `--e-enter` |
| viewport-scale | `--d-6` | `--e-enter` |

### Three structural changes

1. **`--mo-rise: 0.5em`, not `12px`.** A fixed 12px is 12% of a `6.2rem` headline and 100% of a `.8rem` label — one distance for all type sizes is the signature of motion that was never art-directed. One token, and the reveal acquires the hierarchy it has never had.
2. **Stagger by geometry, not by DOM index.** `delay(el) = 220ms · ‖center(el) − origin‖ / maxDistance`, batch-measured once per act and cached, re-measured on resize and language change. Index stagger (`i * 70ms`) reads as a list animating; distance stagger reads as a force propagating — and critically, index stagger produces the *identical* order in RTL, whereas distance stagger genuinely inverts. That is "RTL mirrors motion, not just layout," finally delivered. For plain lists, sub-linear `70ms · i^0.7` so an 8-item cascade finishes in 260 ms instead of 490 ms.
3. **Kill `transition-property: all` without losing the one-law ergonomic.** An explicit allowlist — `opacity, transform, color, background-color, border-color, box-shadow, filter, clip-path, grid-template-rows, font-variation-settings` — deletes the **ten** clawback rules that exist purely to fight the default, stops `#prog` thrashing (its `width` is rewritten every rAF frame *inside* a 400 ms width transition and can never converge), fixes `.traylight` lagging the scrub by up to 400 ms, and removes `border-radius` from the list so the focus-ring pill deformation is invisible even before the underlying bug is fixed. **One edit, five bugs.**

### Ambient loops

**At most one infinite loop visible per viewport**, and where two are unavoidable their periods must be integer multiples of a common base (use 1.4 s) so they phase-lock. The current site runs seven mutually incommensurate loops — radar 4.5 s, fencepulse 8 s, devmove 8 s, orbSpin 14 s, breathe 7 s, marquee 42 s, pulse-radar 9 s — in the same viewport. Any two loops with unrelated periods produce visual beating that reads as busy, not alive. A score has one meter.

### Reduced motion — one token block replaces five policies

```css
:root { --mo-rise: .5em; --mo-push: 1.035; --mo-loop: infinite; }
@media (prefers-reduced-motion: reduce) {
  :root { --mo-rise: 0px; --mo-push: 1; --mo-loop: 1; --d-6: 300ms; }
}
```

Nineteen scattered media queries and five incompatible policies (nuclear `*{animation:none!important}`, surgical per-element lists, duration-zeroing, and nothing at all on the hub) collapse into one block. Nothing needs `!important`. Most importantly: **the reduced-motion path can no longer drift, because there is no second copy of the rules to drift from** — and it has already drifted, with `video-hero.css:417-421` having silently lost the SMIL clauses `latest.css` still carries.

Three fixes on top: subscribe to `matchMedia(...).addEventListener("change")` (every check today is read-once at mount, so toggling the OS setting does nothing until reload — and `cinema/page.tsx:83` proves the pattern was known); put the marquee's `--mo-loop` in `globals.css` so a sixth consumer can't ship an unstoppable 42 s scroll; and make the replay button honest — under reduced motion «شاهد عملية الدفع» is currently fully enabled, fully focusable, and does literally nothing.

---

## 9. Scroll interactions

**Four tiers, chosen per effect. Not one mechanism.**

**Tier A — native scroll-driven animation for reveals, parallax and the join.**

```css
@supports (animation-timeline: view()) {
  .reveals [data-rise] {
    animation: rise linear both;
    animation-timeline: view();
    animation-range: entry 15% entry 55%;
  }
}
```

IntersectionObserver callbacks run on the main thread; on a mid-tier Android an IO callback queued behind a 300 ms long task fires *after* the user has scrolled past — the card appears already in place, or animates off-screen. `animation-timeline` runs on the compositor and cannot be starved. **This is the largest available mobile improvement and it costs zero bytes.** Keep the existing IO path in the `@supports` negative branch — including its two correctly-solved traps (`ioTail` for bottom-anchored elements, and the `.cards-reveal` static-className wrapper).

Per the §0 adjudication: **`view()` for the join, the ambient push and every ornamental element (scrubbed, reversible); IO play-once for copy and claims.**

`#prog` becomes `animation-timeline: scroll(root)` with `scaleX(0)→scaleX(1)`, replacing four unthrottled handlers writing `style.width` — and `scaleX` composites where `width` triggers layout.

**Tier B — canvas image-sequence scrubbing: budget zero.** The technique is correct and `DropSequence` is the best-engineered thing in the repo, but with `/flow` deleted there is no content that earns 1.23 MB desktop-only. Retire the module with the route; keep the file in an archive branch as the playback engine if a scrubbed act is ever commissioned. (If it is ever revived: window the decode to ±12 frames — 72 × 1100 × 618 × 4 B ≈ **187 MB of resident bitmap**, uncapped, is an OOM on a 3 GB Android — cap DPR at 1.5, and throttle the 72 parallel fetches to a window of 6.)

**Tier C — WAAPI timelines with manually driven `currentTime`, not GSAP.**

```js
const tl = el.animate(keyframes, { duration: 1000, fill: "both", easing: "linear" });
tl.pause();
// in the shared manager's write phase:
tl.currentTime = p * 1000;
```

You get labels, scrubbing, and compositor-driven interpolation for transform/opacity — because the animation is registered with the compositor even though its clock comes from JS. ~15 lines. This is what drives the receipt printing (§16) and it is what `ControlRoom` should have been instead of thresholding a continuous `p` into three discrete classes and throwing the clock away.

**Tier D — one shared scroll manager. Non-negotiable.** One passive listener → one rAF → **read phase** (every `getBoundingClientRect` batched) → **write phase** (every style mutation). Today: 15 scroll listeners repo-wide, 4 on `one-tap` alone, 3 forcing synchronous layout every frame, plus unthrottled `pointermove` handlers querying the DOM and measuring ~15 rects at up to 1000 Hz on a gaming mouse — a fix that already exists at `latest/page.tsx:144-165` *with a comment explaining it* and was never backported. Gate: exactly one `window.addEventListener("scroll")` in the codebase.

**Low-end Android specifics:** never animate `filter: blur()` or `backdrop-filter` on scroll (`pulse.css:485-488` animates a 560×560 conic gradient under `blur(60px)` on an infinite loop — a guaranteed frame-drop generator on Mali/mid-tier Adreno). Add `content-visibility: auto` + `contain-intrinsic-size` to every act below the fold: free, large, completely absent today.

---

## 10. Section transitions

**The transition object is the join itself.** This is where the "no continuity between acts" problem gets solved with one element instead of a system.

Every act closes by resolving its motion into a **full-measure rule** at the act's inline-start edge. That rule does not disappear. It becomes the next act's eyebrow rule — persisting across the boundary, changing only its length and its inline offset, driven by `view-timeline`. One sticky hairline element, two animated properties, no FLIP library.

The consequence is that **an act's entrance origin is literally the point where the previous act's motion ended** — the motion designer's requirement, delivered by geometry rather than by convention. The eye never has to re-acquire a new focal point; it follows one line down the page.

**Rules:**
- No two elements begin moving at the same instant unless they are the same object.
- Nothing exits by fading. If something leaves, it leaves along the rule, at `--e-exit`, at 60% of its entrance duration.
- No act begins from nothing. Every act inherits the rule.

Cheap, unfamiliar, legible, and it makes eight sections read as one continuous document — which is what a receipt is.

---

## 11. Background treatment

**One warm-black ground. One baked grain. Nothing else.**

Deleted: `LiquidBackground` and `three@0.149.0` (a 5-octave FBM noise field with three drifting blobs — precisely the "neon everywhere / 7-layer glow stacks" the project's own research bans, ~150 KB gzipped of scene-graph machinery to draw two triangles, and on two of three routes it renders at 60fps into a `display: none` canvas because `html.light #liquid { display: none }` while the rAF loop runs unconditionally). Deleted: `--bg-grad` radial. Deleted: `body::before` fixed gradient layer. Deleted: `background-attachment: fixed` on `video-hero` (which the same repo documents as forbidden and which paints the gradient twice). Deleted: every `--scrim` (currently painted at `z-index: 1` beneath every content container at `z-index: 2` — an ornament with no visible effect).

**What replaces it:** `--surface-page: #0B0907`, flat. Over it, one 128×128 tiled achromatic grain at 2.5% opacity, baked once, never animated, ~2 KB. That grain is the material — it reads as paper stock under ink, it kills dark-gradient banding, and it is the specific proprietary texture the CD correctly identified as the thing Linear owns and R.Pay does not.

Depth comes from **type scale, photography and the rule** — not from layers.

---

## 12. Micro-interactions

Every one of these is the join in miniature or a defect being paid off.

- **Focus.** `outline: 2px solid var(--accent-instrument); outline-offset: 3px` and **nothing else**. Remove `border-radius: 8px` from the focus rule (`one-tap.css:230`) — it has specificity (0,3,0), beats `.cta-warm` at (0,2,0), and there is no later override, so **tabbing to any primary CTA morphs the 999px pill into an 8px rectangle over 400 ms.** Fix this before anyone tabs through a live demo. Also fix the mobile carousel's `overflow-y: hidden` clipping the ring.
- **Button press.** `scale(.985)` at `--d-1`; release on `--e-spring`. Primary CTA only.
- **Click-to-copy on any machine ID, receipt number or reference.** Confirmation is the join drawing underneath the copied value — not a toast. On-thesis, zero chrome, and it teaches the stroke's meaning in one gesture.
- **Language toggle.** It is a `<link>` to the mirrored path (`/ar` ↔ `/en`), not a class flip. On arrival the join redraws in the opposite direction over `--d-5`. A 400 ms confirmation that the entire reading direction has flipped — delightful, near-free, and impossible in the current twin-DOM system.
- **Cards.** Tap-to-expand, one open at a time, `grid-template-rows: 0fr → 1fr` at `--d-4`/`--e-morph`. Hover is the *desktop enhancement*, not the mechanic. Stop animating `flex-grow` — it is a full layout+paint on every frame of a 400 ms transition in a row containing a 2400×1018 image, and it is the page's worst frame budget on a mid-tier phone.
- **LED / mono windows.** `tabular-nums`, `direction: ltr; unicode-bidi: isolate`, no reflow on tick. Preserve exactly.
- **Count-ups.** One implementation replacing six, `--d-6` budget, tabular-nums, and only in the proof band.
- **Marquee.** One implementation replacing six keyframe definitions, hover-pause retained, duplicated half gets `aria-hidden="true"` (screen readers currently hear all 13 partner names twice).
- **WhatsApp widget.** One implementation: `inset-inline-end`, 52px, safe-area aware, yields at the close so the final ask is uncontested. That yield behaviour is genuinely good product thinking — keep it, just stop shipping it twice on opposite edges.
- **Nineteen English `aria-label`s on `lang="ar"`** become locale-resolved server-side and stop being a category of bug (§14/§15 sequencing). Landmark spam (eight `aria-label`led sections promoted to `role="region"`) is cut to three.

---

## 13. Mobile experience

**The phone is the device. Everything else is the enhancement.** The buyer is an operator walking a mall between machines.

1. **Budget: ≤600 KB first view, ≤900 KB route total.** Current reality: `/machine` 4.45 MB, `/video-hero` 2.27 MB, `/one-tap` ~1.62 MB. Only `/flow` mobile (214 KB, sequence structurally skipped) is defensible — and it proves the team can do this. The `useLayoutEffect` three-mode branch that achieves it should be the default pattern, not the one place it happened.
2. **Art direction is server-decided.** `<picture media>` replaces the `useState(POSTER)` client swap, which currently makes mobile download *both* posters and display the wrong crop until hydration — on the element the code comments name as LCP.
3. **The core interaction must exist on the primary device.** Both card acts today use hover/focus expansion with no `onClick`; mobile disables the mechanic entirely (`flex-grow: 0 !important`) and falls back to a snap carousel. **The two acts carrying sector qualification and network scale are static image rows on phones.** Touch-first, one open at a time, hover as enhancement.
4. **The receipt is a phone-shaped object.** This is the single biggest mobile advantage in the plan: the act carrying the core product argument goes from "a still image on the device that matters" to *the best-rendered thing on the small screen*. Full fidelity, real text, selectable, zero pinch-zoom.
5. **`100svh` everywhere. `100vh` banned.** And a real iOS device pass — iPhone SE / 13 / 15 Pro, Safari **and the in-app WhatsApp browser**, which is how most of this traffic actually arrives. Two concepts exist only because earlier ones broke on iPhone; "مُستعاد / Restored" is a scar shown to the public as a status. All verification to date has been Chromium-only.
6. **Two conversion lanes, device-appropriate.** WhatsApp primary on mobile (one tap), form primary on desktop (WhatsApp is a QR dance there). Same verb, different mechanism.
7. `content-visibility: auto` below the fold; `preload="none"` + IO play/pause on every non-hero video (preserve `TapToAction`'s implementation, it is the best media hygiene in the repo).

---

## 14. How the design-system toolkit shapes the token architecture

Use the `ui-ux-pro-max:design-system` toolkit's **three-layer contract — primitive → semantic → component** — as the literal file structure, and use its two scripts rather than hand-rolling or buying Style Dictionary:

- `scripts/generate-tokens.cjs --config tokens.json -o tokens.css` — the build step.
- `scripts/validate-tokens.cjs --dir app/` — **this is the CI gate the frontend lens asked for and it already exists.** Wire it into GitHub Actions on day one. It is what makes "no raw hex in components" enforceable rather than aspirational, and it is precisely what would have prevented `--cyan` being redefined to a second hue in a tenth file.

**Emit three artifacts from one source:**
1. `app/styles/tokens.css` — custom properties (ships).
2. `tokens.d.ts` — a union type of token names, so `tsc` catches typos in inline styles.
3. `tokens.figma.json` — the Figma Variables import payload (§15).

**Cascade layers are the other half, and they matter more than the tokens.** `@layer reset, base, primitives, route, overrides;` declared once in `globals.css`. Today the double-scrollbar fix loses to `latest.css` purely because that file loads later at equal specificity — the class of regression that produced the top four CSS audit findings. With layers, order becomes explicit and **bundler-independent**, which also converts the main risk of the Next 16 Turbopack migration into a non-issue. Do the upgrade and the layer refactor in the same week.

**Four R.Pay-specific token families a generic system will not give you.** These are the ones that encode the knowledge currently trapped in CSS comments:

```css
/* 1. SCRIPT-CONDITIONAL PAIRS — the most valuable family in the repo */
--lh-ar-display: 1.34;  --lh-en-display: 1.14;
--pb-ar-display: .14em; --pb-en-display: .04em;   /* damma clearance */
--w-text-ar: 640px;     --w-text-en: 760px;
--track-ar: normal;                                /* NEVER overridable */

/* 2. THE JOIN */
--join-w: 1px;  --join-len: 0;  --join-ease: var(--e-join);
--join-dur: var(--d-5);

/* 3. MOTION + its reduced-motion substitution block (§8) */

/* 4. Z-INDEX, named. `.scrim` currently guesses and paints below
      every content container, doing literally nothing. */
```

**Governance rule that tooling alone will not enforce:** *new tokens require a PR to `tokens/`, never a local `:root` override.* Every drift documented in the audit — three `--padx`, three `--edge`, four names for "muted" with five values, `--warm` at `#FFB65C` vs `#FFB454` — happened because each new concept was permitted to declare its own root. Layers make that visible; the review rule makes it expensive.

---

## 15. Figma integration

**Sequencing matters more than tooling. Do not buy Code Connect before you have components.**

**Stage 1 — code is the source of truth (now).** There is no Figma library in this repo; the design intelligence lives in `.md` reports and CSS comments, and every decision was made in CSS and screenshot-verified. So `tokens/*.json` in the repo is authoritative and the sync is **one-way, code → design**, pushed via the Figma Variables API or `use_figma`. Anything else is a lie about where the decisions happen. *(1–2 days on top of the token work.)*

**Stage 2 — generate the library from the code (after tokens land).** Use `figma-generate-library`. Roughly nine components — `Button` (amber / ghost / text-link — three tiers, one verb), `Card`, `Eyebrow`, `Rule` (the join), `StatBlock`, `Receipt`, `Marquee`, `StickyCTA`, `Footer`. That is a tractable library and roughly the true surface area of the trunk.

**The thing that is easy to get wrong and expensive to fix: every component needs an AR and an EN variant.** Arabic runs 20–25% shorter, has no capitals, and takes different leading. A library built only in Latin produces designs that break in the primary language. Bind `--lh-ar-*` / `--lh-en-*` and `--w-text-*` as Figma **variable modes** keyed `dir: rtl | ltr`, so switching the mode reflows the frame the way the browser will. *(3–5 days.)*

**Stage 3 — Code Connect, last.** `.figma.tsx` per component so Dev Mode shows real JSX and real token names. This is where drift actually gets caught: a designer who detaches an instance or hardcodes a hex sees it immediately. ~20 minutes per new component thereafter — the cheapest governance available. *(1–2 days for nine.)*

**What must NOT be synced.** Do not model the join wavefront, the receipt print, or any scroll-driven behaviour in Figma. Those are code artifacts. Figma holds the **storyboard and the composed stills** — which is exactly what the existing visual-system doc already demands ("every animation resolves into a composed still that is the next section's layout"). Making Figma the source of truth for a compositor-timed wavefront wastes weeks and produces a document that is wrong the day it is signed.

---

## 16. What creates the WOW — the three signature moments

Be precise about why the current site has none: **nine stock moves executed at 8/10 average out to competent.** Gradient-clipped headline, glassmorphic stat panel, radar sweep, hover-pause marquee, sticky dashboard walkthrough, flex-interpolated cards, expanding ripple, count-ups, cursor glow, magnetic buttons. Every one is well made. Not one is unfamiliar. **Wow is not effects — it is proprietary form, legible at a crop.**

Three moments. Not four. The `--d-6` budget is two per page and the third is a rendered object, not an animation.

### Signature 1 — **الوصل: the tap leaves the screen**

At the exact presented frame where the film's tap blooms, the film's own pixels stop being video and become interface.

**Mechanics, buildable in ~90 lines with zero new dependencies:**

1. On the `requestVideoFrameCallback` crossing `PULSE_AT`, one `ctx.drawImage(video, …)` into an offscreen canvas at 480px wide (~2 ms). The contactless glyph's position is a known normalized coordinate shipped in the film's sidecar JSON — no image analysis.
2. A duplicate of that frozen frame sits over the video, revealed by a **linear** `mask-image` on a `transform: scale()` layer — not `clip-path: circle()`, whose radius interpolation does not composite reliably on Safari. The mask's leading edge is **the stroke**: `--join-w` thick, `--accent-instrument`, travelling along the baseline **in the reading direction**, seeded from the tap coordinate. The duplicate carries a `saturate(1.3) contrast(1.08)` shift so the film's grade visibly becomes the interface's grade as the edge passes.
3. **Geometric ignition.** Hero element boxes are batch-measured once. As the stroke's leading edge crosses each box's inline-start, that element receives `.charged`: instrument-ink rim, and a `font-variation-settings: 'wght' 700 → 600` relax over `--d-3` so the type physically *settles* as the energy passes through it. **Order is derived from live geometry, not DOM index** — so in Arabic the cascade genuinely runs the other way. The headline charges before the CTA in one language and after it in the other.
4. **The energy leaves the frame.** The stroke continues past the viewport edge and hands its remainder to `#prog` — the page's own progress hairline, which is the same stroke. Total `--d-6` = 1400 ms, one origin, one cause, zero simultaneous independent animations.

**Why it reads as "how did they do that":** the stroke is continuous across four rendering technologies — decoded video pixels, a CSS-masked composited layer, DOM class changes, and the page's fixed chrome — with no visible seam, and its ordering is computed from live geometry so it differs at every viewport width and **inverts between Arabic and English**. No library does reading-direction-ordered staggering seeded from a video frame's coordinate space. People who know motion design will try to identify the tool and fail.

**Frame budget:** 2 ms `drawImage`, ~1 ms layout batch, then **zero main-thread work for the remaining 1380 ms.**

**Degradation is art-directed, not disabled:** no `requestVideoFrameCallback` → `onTimeUpdate` fallback, ~250 ms late, still fires. Autoplay refused or video errored → the 400 ms failsafe fires the DOM half from the same origin over the still poster. **Reduced motion** → no stroke, no scale; the `.charged` cascade runs as a pure colour sequence in the same geometric order at `--d-2` per element. The user still perceives the tap propagating outward. Causality survives; motion doesn't.

### Signature 2 — **The receipt** (replaces the simulated dashboard)

Not a mock. Not a simulation with a disclaimer. **One true transaction, rendered as a paper object, in HTML.**

Bone ground `#F4EFE6`, ink `#14110D`, `--r-receipt: 4px`, a perforated top and bottom edge (`mask-image: repeating-radial-gradient(...)`, one declaration), the site grain over it, a soft contact shadow. 29LT Bukra for the Arabic lines, right-aligned; IBM Plex Mono LTR-isolated with `tabular-nums` for every amount, ID and timestamp.

```
                                      «آر باي»  ————————————
المبلغ                                              SAR 5.00
الموقع                             Sparky's · Riyadh Park
الماكينة                                                A-14
الوقت                                              14:22:07
التسوية              إلى حساب المشغّل مباشرة
```

**On entry, it prints.** The join draws the rule under each line, top to bottom, sub-linear stagger, `--e-join`. That is the `DropSequence` instinct — a physical object arriving over time — achieved with ~15 lines of CSS instead of 1.23 MB and 187 MB of resident bitmap.

**Why it is the strongest single idea here:**
- It is the *only* dashboard on the site and it needs **no disclaimer**, which the current 240vh act cannot say.
- It argues the entire product in one object: where the money lands, which machine, which branch, how fast.
- It is **real text** — server-rendered, selectable, copyable, screen-reader-legible. The act carrying the core product argument goes from the *least* accessible thing on the page (`role="img"` collapsing twelve figures into one English string) to the **most**.
- It is perfect on a phone, which is the device that matters.
- It costs zero fabrication, which means it can ship the week the shoot happens.
- And **وصل is literally the word** — the manifesto and the artifact are the same noun.

### Signature 3 — **The wordmark elongates**

The Arabic wordmark «آر باي» contains a kashida. On first paint, and once at the close, that kashida **extends** out of the wordmark and becomes the page's rule. The brand mark and the structural line of the interface are the same object.

Near-free to build. It is the mechanism that makes the site attributable from a crop, which is precisely the thing R.Pay does not currently have — and it forces the honest version of the type decision: this only works if the Arabic is *drawn*, which is why §4's licensing/commission is a dependency and not a nicety.

**Be honest about the failure mode:** a bare 1px hairline is the most generic element in web design. What makes this proprietary is that the stroke carries the commissioned face's actual kashida geometry — a specific weight, a specific flat entry, a specific terminal — and that it always animates by **length only**, never opacity, never glow, never blur. Ship a generic hairline and you get a quiet, tasteful, anonymous site. That risk is named again in THE ONE BIG BET.

---

## 17. What to change from the previous redesign approach

The previous approach is documented in its own words and is worth quoting because the correction is precise, not vague. Its hero layered: an SVG payment network, two rotating orbit rings with satellites, the terminal photo over a breathing halo, a CSS payment card with metallic chip and NFC ripple and sheen sweep and `•••• 4291`, a glass live-sales panel with `SAR 24,180` and a drawing sparkline, an approved-payment chip, a geofence chip, seven-level pointer parallax, a masked grid, dual aura gradients — and it **deleted the hero video** to make room.

| From | To | Evidence |
|---|---|---|
| Layer effects until it looks expensive | **Own one form and repeat it in six roles** | The repo's own anti-pattern list names `latest` for "7-layer glow stacks / hierarchy collapse" |
| Triad headline + chip row + stats band + two floating status chips, all at once | **One kinetic sentence, one focal object, one CTA in the opening frame** | The research doc's hero conclusion #2 names `latest` as "the opposite failure" |
| Gradient on every headline, gradient edge-rings, gradient hairlines | **No gradient anywhere. Type is one ink.** | `--grad` is process-cyan→mint, the most-used gradient in software |
| Simulated data as decoration (`•••• 4291`, `SAR 24,180`) | **One true artifact, no disclaimer needed** | The 08 claims ceiling already bans fake card numbers; the receipt makes the ban an asset |
| Concept 08's answer: subtraction | **Subtraction was necessary and insufficient.** Restraint without proprietary form is not premium — it is quiet. | Linear is quiet *and* owns a texture, a ramp, an icon geometry. 08 got you from noisy to clean; only invention gets you from clean to wow |
| AI-generate everything (430 credits, "CUCCI", "B.PAY") | **One shoot day; AI only for impractical motion beats** | The reject list is the confession; residual artifacts shipped anyway |
| Eight concepts behind a hub as a feature | **One URL.** Optionality produced a factual contradiction about the company's own identity | Concepts 01–05 vs 07–08 disagree on whether R.Pay *is* or *serves* the region's largest arcade operator |
| Optimise for Lighthouse (LCP 132 ms, 45 KB hero) | **Budget from p75 mobile field data; raise the image budget where it buys material quality** | 132/144 ms were localhost, self-described as "architecture signal, not field data." There is no field CWV data at all |
| One law declared in one file | **Tokens + cascade layers, so the law cannot drift** | The law is already violated twice by its own stylesheet (900 ms at `:430`, 700 ms at `:827`) and required ten clawback rules |
| Arabic translated, English authored | **Arabic authored and drawn first; Latin cut from it** | `<html lang="ar">` with 19 English `aria-label`s; two spellings of the company name; Bricolage forced onto Arabic headlines |
| Motion as triggers | **Motion as a timeline with causality** | 81 keyframes, zero relationships; nothing exits; every reveal is `unobserve`d into a one-way ratchet |

---

## PRESERVE / IMPROVE / REDESIGN / REMOVE

### PRESERVE — verbatim, do not touch
- **The accent contract as a rule** (`one-tap.css:12-17`) — roles kept exactly, hues swapped. Most teams declare this and break it in week two; this one held across 1,199 lines.
- **The verified-stats canon** — 465,255+ / 97 / 9,434 / 9, byte-identical across eight pages.
- **The claims ceiling** — the written ban on inventing SAMA, PCI, uptime, city counts, payment brands, pricing. This document is worth more than the website.
- **The honest-simulation discipline** and `ControlRoom.tsx:9-11` refusing to fake a dashboard.
- **`flow.css:104-141`** — Arabic-first leading, tightened for Latin, screenshot-verified. Promoted to tokens, values unchanged.
- **Bidi discipline** — `direction:ltr; unicode-bidi:isolate` on LED/mono, mirrored keyframes (`tapR`, `plmarq-r`, `runner-rtl`), `.brand { direction: ltr }` after "Pay R." was caught.
- **`overflow-x: clip` not `hidden`**, plus the footer rise-exemption, plus the documented root cause.
- **The `.cards-reveal` static-className diagnosis** — becomes a lint rule.
- **Reduced motion as restructure, not freeze** — especially `HeroFilm.tsx:31-36` setting `src = null` so no video element is created and no bytes are fetched.
- **CTA architecture** — one verb, five placements, two dominant, card CTAs deliberately text links, widget yielding at the close, «عبر واتساب — بالعربية أو الإنجليزية» as friction removal.
- **`StickyCTA.rivalAdjacent()`** — the adjacency-not-presence distinction.
- **The double-rAF replay reset** (`HeroFilm.tsx:56-58`).
- **`TapToAction`'s media hygiene** — `preload="none"`, IO play/pause, mobile still.
- **Media pipeline rules** — H.264 + faststart + `-an`, poster doubles as reduced-motion and failure fallback, art-directed wide/tall pairs, nothing hot-linked.
- **The refusal list** (`CONCEPT_08_VISUAL_SYSTEM.md` §9). Knowing what you won't do is 80% of art direction.
- **The 07/08 copy** — «ادفع. خُذ.» · «لمسة واحدة. تحكّم كامل.» · «وفي الطرف الآخر… أنت.» The best thing on the site in either language.

### IMPROVE — right idea, rebuild the execution
- **Video→DOM handoff** → becomes الوصل. `requestVideoFrameCallback` + `play().catch(fire)` + 400 ms failsafe + sidecar timing JSON.
- **`#prog`** → becomes the join. `animation-timeline: scroll(root)`, `scaleX` not `width`.
- **Hero poster** → `<picture media>` server-decided, AVIF+WebP, `fetchPriority="high"`, font preload, `font-display: optional`.
- **The motion law** → explicit `transition-property` allowlist, five curves, distance→duration table, `--mo-rise: 0.5em`, geometric stagger.
- **Reduced motion** → one `--mo-*` block replacing five policies; add the `change` listener; fix the dead replay button; move the marquee rule to `globals.css`.
- **Reveal system** → `animation-timeline: view()` with the existing IO as `@supports` fallback.
- **Fleet / Machine cards** → touch-first tap-to-expand, one open at a time, `grid-template-rows` not `flex-grow`.
- **TrustBand** → honest tiering (*Deployed at* / *Trusted by* / *Partners*), written permission per mark, duplicated half `aria-hidden`.
- **Proof band** → gets a heading, a date, and a source. "465,255+ since 2023" is a proof point; "465,255+" is a number.
- **Footer** → CR number, VAT number, address, phone, hours, real legal links.
- **Fonts** → `next/font/local`, vendored, subset, `unicode-range`, two preloaded. ~315 KB → ~110 KB, and the silent Latin-fallback bug dies with it.
- **Focus ring** → outline only. Delete `border-radius: 8px` from `one-tap.css:230`.
- **WhatsApp widget** → one implementation, `inset-inline-end`, safe-area.

### REDESIGN — same job, new form
- **Act I hero:** expanding cyan ring → the linear join wavefront.
- **Act IV:** 240vh sticky simulated dashboard → **the receipt**.
- **Colour:** cyan→mint gradient → one accent (amber) + instrument luminance (bone).
- **Type:** Readex / Bricolage / Plex-as-display → 29LT Kaff + Bukra, Arabic drawn first, weights capped.
- **Imagery:** AI-generated generic teal hall → one Saudi shoot day at a named client venue.
- **i18n:** twin-DOM CSS toggle → `/ar` + `/en` server-rendered locale routes, correct `lang`/`dir`, `hreflang`, locale-resolved `aria-label`s. This alone deletes most of the accessibility findings **as a class**.
- **IA:** eight-concept hub → home + `/solutions/{arcade,vending,coffee}` + `/platform` + `/hardware` + `/trust` + `/pricing` + `/customers` + `/contact` + legal. `/hardware` and `/trust` are the two pages that don't exist and decide the deal.
- **Wordmark:** two unrelated objects («آر باي» and "R.Pay") → one drawn object, Arabic first, kashida = the join. One spelling.
- **Background:** `LiquidBackground` + `--bg-grad` + `backdrop-filter` → one warm-black + baked grain.
- **Rendering:** 36/45 client components → RSC content passed as `children` into named client islands. Not primarily a perf win (~8–20 kB/route); it is what makes the missing 60% of the site — pricing, trust, legal, case studies — free to add.

### REMOVE — delete, do not migrate
- **Routes:** `/concepts/video-hero`, `/machine`, `/cinema`, `/pulse`, `/coming-soon`, `/flow`, the hub at `/`, and `/latest` as a route (harvest About/Mission/Vision, the 8 pillars, HowItWorks and the geofence explanation into the real IA first).
- **`three@0.149.0` + `LiquidBackground.tsx`.**
- **`VendingScroll.tsx`** + `vending-video.mp4` (4.05 MB, `preload="auto"`, no poster) + `hero-video.mp4` (1.94 MB).
- **`DropSequence` + the 72-frame sequence** (1.23 MB) — retired with `/flow`.
- **`master.mp4.part00`** at repo root (20 MB, orphaned 1-of-3, unusable, unreferenced) and the three `public/assets/flow/master.mp4.part*` (43.9 MB, **deployed and publicly served** because `.gitignore` names the reassembled filename). Fix the pattern to `master.mp4.part*`.
- **~1,400 lines of triplicated CSS** and the `_c/` component forks of `HowItWorks`, `Integration`, `Menu` — the fork tree is why "Auto cashback" is still live after being fixed once.
- **The competitor scoreboard** (8/8 vs 1/8, naming SurePay and Geidea). Comparative advertising against two larger, licensed competitors with a hedge instead of a methodology. Move it to the sales deck with sourcing.
- **The "النظام يعمل / System Operational" light** — decorative, wired to nothing, on a vendor whose product is uptime visibility.
- **All eleven `href="#"` links** — four of them labelled "الامتثال / Compliance" on a payments site.
- **Every `background-clip: text` gradient headline.**
- **`transition-property: all`** and its ten clawback rules.
- **`•••• 4291`** and every simulated surface that needs a disclaimer to be honest.
- Four count-up implementations, six marquee keyframes, two radar implementations, five 30 s clock tickers.
- Dead: `.settled`, `.scrim`, `.brands`/`.brands .lbl` orphans, `mainRef`, `const CARDS`, `Math.min(i % 4, 3)`, `__HERO_VIDEO_TALL__`, the `cinema` CloudFront hot-links.
- **"مُستعاد / Restored" as a public status.** A scar is not a feature.

---

## THE ONE BIG BET

**Own one drawn stroke, and make it literal as the receipt.**

Everything else in this document is competent housekeeping that any good team would do — delete six routes, fix the tokens, upgrade the framework, self-host the fonts, shoot real photography. Those get you from *competent* to *good*. They do not get you to wow, because the current site is already the product of exactly that kind of diligence and it still fails the crop test.

The bet is that **a single proprietary form, repeated in six roles and made into one true object, is worth more than any amount of additional polish** — and that the form should be the kashida, because it is the one mark in typography that is a letter, a line, and a duration at once; because وصل is simultaneously "the join" and "the receipt"; and because it forces the Arabic to be drawn rather than translated, which is the actual difference between a Saudi brand and a brand available in Saudi Arabia.

**The risk, stated plainly.** A horizontal rule is the most generic element in web design. If the commissioned or licensed Arabic doesn't land — if the stroke ends up as a 1px `border-bottom` with no drawn terminal, no specific weight, no optical relationship to the type — then you will have spent the budget arriving at *clean* instead of *wow*, which is precisely where concept 08 already sits. You will have subtracted a second time and invented nothing. That is the same failure as before, wearing better clothes.

**Two mitigations, both cheap:**

1. **The crop test, at week 6, as a gate.** Screenshot three finished screens. Remove the logo and the Arabic. Show them to five people who have never seen the site. If none can attribute them, the stroke did not earn its place — fall back immediately to the second-strongest owned form: **single-hue commitment at Jeton scale**, amber as full-bleed flat fields and full-size type, which is a proven mechanism and needs no type commission.
2. **Do not block the build on a commission.** License 29LT Kaff + Bukra now (≈1 week) and commission in parallel if the owner buys the NEOM tier. The type is the longest lead item in the project and the only thing that can slip the whole schedule.

---

## OPEN QUESTIONS FOR THE OWNER

Genuine forks. Each one changes what gets built, and none can be decided by a designer.

1. **Is R.Pay *the* region's largest arcade-machine operator, or does it *serve* it?** Concepts 01–05 present the superlative as R.Pay's own credential; 07–08 reframe the identical sentence as a customer. These are opposite companies. If R.Pay *is* the operator, every competing operator is being asked to fund a competitor and you need a structural answer (separate entity, arms-length, data walls) — and vending/coffee become the real market. If R.Pay *serves* it, that sentence is the best case study in the repo and should be a named story. **Everything downstream of the homepage depends on this answer.**

2. **What is the business model, and who is the licensed acquirer?** Hardware capex, SaaS subscription, MDR on volume, or revenue share? The loudest claim on the site — «أموالك تصلك مباشرة دون وسيط» — implies R.Pay is *not* in the flow of funds, which implies an ISV layer on a licensed acquirer. If so, that acquirer must be named, and "no middleman" is partly their feature.

3. **PCI DSS level, SAMA position, PDPL and data residency, CR and VAT numbers — do the answers exist?** These aren't copy to write, they're facts to obtain. If they're uncomfortable, that is itself information and it changes the positioning. A Saudi payments vendor that cannot name its regulator will not clear enterprise procurement — and naming SurePay and Geidea as inferiors while showing no licensing position of your own is the worst of both worlds.

4. **Does a real operator dashboard exist that we may photograph at real fidelity?** If yes, one true screenshot joins the receipt and the product argument is complete. If no, **the receipt carries the entire product argument alone** — which I believe it can, but you should choose that knowingly rather than discover it in week five.

5. **Do we have written permission for each of the thirteen logos, and are they clients or landlords?** Roshn, Boulevard World, Dar Al Arkan, Kinan, Hamat, Sela, Al Khozama and LuLu are developers, destinations and a hypermarket group — that is a venue and channel list, not a customer list. Displaying it under «شركاؤنا وعملاؤنا» carries both legal and credibility exposure.

6. **Type budget: which tier are you claiming?** License 29LT Kaff + Bukra (low four figures, ~1 week) or commission a bespoke Arabic display and cut the Latin from it (NEOM tier, 8–14 weeks, materially higher cost). Both are defensible. Only one is the tier the site currently *claims*.

7. **The shoot: which venue, which date, and can we get one customer to a named case study with a number on the same day?** This is one purchase order that buys photography, a case study and logo permissions simultaneously. It is also the item most likely to slip, because it depends on someone else's business.

8. **Brand voice and spelling.** My recommendation is warm MSA throughout, one Arabic spelling («آر باي», never «ار باي»), and Latin "R.Pay" only in Latin contexts. Concepts 07/08 slip into Saudi dialect («شوف الماكينات», «خلّها أذكى») — warm and effective read alone, an unowned voice read across a site. A vendor asking a landlord for a purchase order should not change register between the hero and the pricing page. **Confirm or overrule.**

9. **Does the concept gallery survive at all?** My call is `/design`, `noindex`, gated — or deleted outright. Keep the exploration, kill the deployment. But if it exists for a specific audience (investors, a pitch), say so, because that changes whether it needs to look finished.

10. **Who owns the WhatsApp inbox — with what hours, what SLA, and what CRM?** A two-lane funnel needs a routed inbox and an instant bilingual acknowledgement. Today a Thursday-evening enquiry to one personal-format number that goes unanswered for fourteen hours is a dead lead with no record it ever existed.