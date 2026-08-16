# R.PAY — FINAL CREATIVE DIRECTION
## Executive Creative Director's decision document. This is the build brief.

Repo facts verified before writing (they overrule several claims in the pitches and one in the judging):

| Claim | Verified |
|---|---|
| Fonts on disk | **Readex Pro 400/600/700 + IBM Plex Mono 400/500 only.** No IBM Plex Sans Arabic. Concept 3's "zero new font cost" is false. |
| Dead video weight | `public/assets/flow/master.mp4.part00/01/02` = **45.1 MB**, plus root `master.mp4.part00` = **20 MB**. **65.1 MB currently in the Vercel deploy.** |
| Frame sequence | `flow/seq` = 72 WebP, **1100×618**, 1.4 MB total. Real, cheap, reusable — but only up to ~550 px CSS at 2×. |
| Machine renders | `machine-arcade/vending/coffee.webp` = **720×964 each, 19–25 KB.** `device-terminal.webp` = **749×1000.** These are small. Full-bleed is physically impossible. This single fact kills Concept 5 on its own. |
| Logos | 12 raster `.webp` at **123–193 px wide** + 1 `.svg` (Roshn only). Any single-ink treatment = a real re-trace, not a CSS filter. |
| Brand mark | `r-mark.webp` **142×128 raster.** There is no vector of the company's own logo in the repo. |
| Usable video | `concept-08/arcade-live.mp4` = **301 KB** — exactly the right size for a sensor-feed inset. |
| Stack | `three@0.149.0` present and unused. `playwright` already a devDependency with a `shoot` script. |

---

# A. THE VERDICT

**The winner is CONCEPT 1 — THE BRIDGE / برج القيادة**, and it wins because it is the only submission where the metaphor is not a metaphor: R.Pay does not "feel like" a control room, R.Pay *sells* a control room, so building the site as one collapses the distance between the pitch and the product to zero — no analogy for the buyer to accept first, category clarity delivered before a word is read, and a "wow" that is competence made visible rather than glow added. All three judge panels independently greenlit it, and they greenlit it for three different reasons, which is the strongest possible signal: the brand panel because it ships laws instead of references, the conversion panel because it is the only concept built as a funnel rather than a film, and the engineering panel because **every one of its dependencies is code** — no photo shoot, no 3D pipeline, no render budget, no font procurement to block week one. But it ships **corrected in one structural way**: the brand strategist is right that COMMAND as written is too close to the existing site to read as a leap, and "more brass" is not a sufficient answer to that charge. So the winning concept absorbs the single best idea in the losing set — Concept 4's paper ground — not as a fallback and not scattered, but as a committed **second act in daylight**, bounded to four sections. The site is therefore: **a night bridge, one act of daylight, and a return to the bridge to close.** That structure is the leap, it is unmistakable at WhatsApp thumbnail size, it fixes both of COMMAND's own named risks, and it costs nothing at runtime.

---

# A.1 ADJUDICATIONS — where the judges disagree

The panels agree on the winner. They disagree on nine things. Each is settled here, with a name attached.

### 1. Is DAYLIGHT a co-winner? (Tech says 9/9 tie and "flip the day the client funds a font." Brand says 8 and "the client loses his nerve.")
**The brand strategist is right about the outcome; the tech judge is right about the merit. Both are wrong to frame it as a flip.** A client who has already rejected eight builds for lacking wow will not hold a near-effectless white page for five weeks against his own instincts, and the tech judge's own condition — a licensed Arabic display face plus three weeks of a typographer — is a procurement gate we cannot let the schedule depend on. But conditioning the whole design on a funding decision is a coin-flip dressed as a plan, and no ECD ships a coin flip. **Ruling: we take DAYLIGHT's ground, not DAYLIGHT's totality.** Paper becomes Act II — permanent, committed, four sections. This gets us the one thing DAYLIGHT genuinely owned (identifiability with the logo cropped off) at a fraction of its risk, and it means the licensed font is an *upgrade* to a working site rather than a precondition for one.

### 2. The canvas share card. (Brand: "highest-ROI transplant in the entire set." Conversion: "a screenshot is passive, an export button is distribution." Tech: "Do not port the canvas share-card" — Arabic in `fillText` has no reliable bidi line layout.)
**The tech judge is right about the mechanism and wrong about the conclusion.** He is correct that multi-run bidi and line-breaking in `canvas.fillText` will ship visibly broken Arabic and that there is no cheap way to QA it. He is wrong that this kills the feature, because the feature does not require Arabic in canvas. **Ruling: bake the Arabic, composite the numerals.** Ship a designed 1080×1350 background plate as a static WebP with every Arabic string, the brand mark, and the frame already rendered by a typographer in Illustrator. At runtime the canvas composites only six dynamic strings, all of which are Western digits, Latin device IDs and punctuation — `RP-043`, `02:14:07`, `31 m`, `1,240`, the date. Zero shaping risk, zero bidi risk, one `drawImage` plus six `fillText` calls, ~2 KB of JS. We keep the highest-ROI transplant in the set and the engineering objection evaporates. **Build it. Do not let it use `fillText` for a single Arabic character.**

### 3. Is there a CTA in the hero? (Brand: "COMMAND puts a CTA in the hero. Delete it." Conversion: COMMAND's CTA placement is its strength; LEDGER's "never sticky, never floating" is a self-inflicted wound.)
**The conversion judge is right and I am overruling the brand strategist.** Removing the reachable action to buy premium restraint, in a mobile-first Arabic B2B market that closes on WhatsApp, is an aesthetic preference charged to the P&L. But there is a synthesis both can live with, and it is better than either. **Ruling: no filled button competes with the headline inside the first 100vh** — the hero band carries one ghost text link and nothing else, which preserves the stillness the brand strategist is protecting. **The filled mint CTA appears the instant المرصد docks**, i.e. the moment the hero scrolls past. This is not a compromise, it is the correct behaviour: an operations rail with no action on it is not an operations rail.

### 4. Payment rails in the first viewport. (Conversion: "the most-repeated conversion error across the whole set." Brand and Tech: silent.)
**The conversion judge is right, and this is the cheapest win in the document.** An operator whose entry question is "do you take mada and when do I get paid" must not scroll six sections to find out. **Ruling: a single monochrome row — mada · VISA · Mastercard · Apple Pay · stc pay · GCCNET — sits on its own hairline in the first viewport, below the horizon, at `--ink-muted`, static, no colour, no badges, no motion.** It is a footnote on an instrument, not a trust-badge strip, so it costs the art direction nothing.

### 5. Does the paper ground get scattered or bounded? (Tech: "render section 03 and section 09 on paper." Brand: "COMMAND should earn one daylight section on a dark page." Tech also, separately: LEDGER's dual ground is "a double theme system... done twice, forever.")
**I am taking the tech judge's diagnosis and rejecting his placement, using his own argument against him.** Scattering paper across sections 03 and 09 creates four ground swaps and doubles exactly the theme surface he warned about in Concept 6. **Ruling: one contiguous act, four sections, one crossing in and one crossing out.** Paper is not a theme — it is a bounded act with a restricted component set (type, rules, dots and rings, logos, one button; **no instruments, no telemetry, no cyan**). That is six components to style twice, not a design system. And it converts a structural cost into the site's third signature moment.

### 6. What comes from SILENT GRID? (Tech: "From SILENT GRID, take nothing." Brand: take the export card and the sensor-feed frame. Conversion: steal the Fleet Estimator "regardless of who wins.")
**The tech judge overreached; the other two are right on two of three items.** The sensor-feed frame is a 320×180 CSS box with a timecode and a LIVE dot that reclaims five existing video assets at zero production cost — and `arcade-live.mp4` is verifiably 301 KB, i.e. already the right size. Take it. The Fleet Estimator is the best lead-capture idea in the set. Take it — **but without the map**, which is the part the tech judge was actually right to reject, since the map is what made NETWORK expensive and what made 97 machines look thin. **Ruling: take the sensor-feed frame, take the estimator stripped of its map, take the export card per §2. Take nothing else.**

### 7. Naming the hardware. (Brand: yes, conditionally. Conversion: yes, "genuine strategic value." Tech: publishing `IP54`, `EMV L1/L2`, `112 mm` is "a legal exposure, not a design detail.")
**All three are compatible and all three are right.** **Ruling: name the device, publish no specification the owner cannot evidence with a supplier document.** And the name is not AXIS — AXIS is an owned surveillance-hardware trademark and it is a Latin-first name for an Arabic-first brand. The terminal is **وَتَد ٠١ / WATAD 01** — *watad* is the stake that pins a thing to the ground, which is the geofence promise stated in one word of Arabic. Subject to trademark clearance (§H).

### 8. COMMAND's one performance break. (Tech: the global breach desaturation is a full-document style recalc and paint on a device with no headroom, at the exact moment the visitor is judging competence. Nobody else flags it.)
**The tech judge is right and this is the highest-priority engineering item in the project.** **Ruling:** the breach transitions **one** root custom property, and the number of DOM nodes that consume it is capped at twelve and enforced by a lint rule — the rail, three counters, the section numeral, the horizon rule, the CTA border, the chip, and the log gutter. Nothing else inherits `--signal`. Plus a hard instant-swap path when `navigator.deviceMemory <= 4`. Plus a **week-one spike on a real Galaxy A-series and a Redmi Note over Riyadh 4G**, not week five. If it janks on real hardware, the breach becomes an instant swap everywhere and we lose nothing, because the abruptness is arguably better anyway (Concept 4 argued exactly that: `transition: none` — "the abruptness *is* the effect").

### 9. The signature moment is not a differentiator. (All three judges, independently, unprompted.)
**All three are right and the consequence has to be stated out loud.** Six independent concepts converged on drag-the-machine-out-of-the-geofence. That means the radar is table stakes, not a concept. **Ruling: the radar gets exactly one engineering week and no more, and it is not permitted to expand.** Our defensibility is not the drag — a competitor could arrive at the drag the same way six writers did. Our defensibility is **the act structure, the honesty framework, and the export card**, which are the three things nobody else in the market will have the discipline to build.

---

# B. THE GRAFT

Ten transplants. Source named, attachment point named, and the reason it survived.

| # | Transplant | From | Attaches at | Why |
|---|---|---|---|---|
| **G1** | **The paper ground, as ACT II.** Warm limestone `#F2EFE9`, ink `#12110F`, hairline rules, zero effects, one real photograph. | **4 · DAYLIGHT** | Sections 09–12, between السجل and باسمك | The leap the brand strategist demanded. Fixes COMMAND's two named risks in one move: the venue-owner audience gets a calm, warm, instrument-free path; and the mid-tier-phone-at-40%-brightness legibility problem gets a section it can actually be read in. |
| **G2** | **The Swiss ink-dot comparison timetable.** Solid 6px ink dot = yes, hollow ring = no. No colour, no green ticks, no "vs" graphics. | **4 · DAYLIGHT** | Section 10, on paper | Replaces COMMAND's "physical toggles" switchboard. One full column beside two nearly-empty ones is a sentence, read in two seconds, and it screenshots better than anything else on the page. Conversion judge: "the best-converting single artefact in the entire set." |
| **G3** | **The persistent appended breach log, and the fifth-drag payoff:** «لن تملّ من هذا. ولا نحن.» | **4 · DAYLIGHT** | Section 05, beneath the radar plate | Rewards replay and is the only humour anywhere in the six pitches. Humour from an instrument is disproportionately memorable. |
| **G4** | **The failed riyal, wholesale — its own section.** A payment fails, the rail turns amber, the money *reverses direction on its own* and goes home. `استرجاع تلقائي — بدون تدخل بشري`. Twelve seconds, no click, no support ticket. | **6 · ONE RIYAL** | New section 04, its own beat, its own silence | Two panels called this the finest single section in all six documents. COMMAND rendered auto-refund as "a reverse pulse on the same diagram," which was the weakest beat in the winning concept. |
| **G5** | **The frozen counter that resumes from where it stopped, not from zero.** | **6 · ONE RIYAL** | Inside the radar breach, section 05 | Converts "my machine died" into "my money was preserved." That is the actual sale. World-class product empathy for the cost of one variable. |
| **G6** | **The new Saudi Riyal glyph (﷼) as inline SVG, not a font character.** | **6 · ONE RIYAL** | Every settled figure, site-wide | Font coverage is still patchy; every other concept would have shipped a tofu box. Pure correctness, and unmistakably of-this-moment in this market. |
| **G7** | **The share-card export.** `احفظ اللقطة` → 1080×1350 → `navigator.share()`. Built per adjudication §2: baked Arabic plate, composited Western digits. | **2 · SILENT GRID** | Section 05, under the breach log | This market closes on WhatsApp forwards between operators. Every other concept *hoped* for a screenshot; this one built the forward. |
| **G8** | **The sensor-feed frame.** 320×180, 1px hairline, timecode, LIVE dot. | **2 · SILENT GRID** | Sections 06 and 11, and `/التقنية` | Reclaims five existing AI films at zero cost. Cheap footage inside a surveillance frame reads as surveillance, not as stock. `arcade-live.mp4` is 301 KB and already the right dimensions. |
| **G9** | **The Fleet Estimator as the lead form — map removed.** «كم مكينة تملك؟ / في كم موقع؟» and your machines appear as white ticks beside R.Pay's cyan ones, before you submit. | **2 · SILENT GRID** | Section 14, replacing the three-question handover | The only concept that made data capture feel like a reward instead of a toll. The lead form *is* the demo. Machine count silently qualifies the lead. |
| **G10** | **The tick index as navigation + the two flat pages.** Fifteen 8 px ticks on the inline-end edge, tappable, doubling as progress. Plus `/التقنية` and `/الأسعار` outside the narrative. | **3 · UNBROKEN** | Persistent layer; two static routes | All three panels flagged the same hole: a procurement manager at Roshn arrives with one question and is trapped in someone's control room. The film converts believers; flat pages serve auditors. |
| **G11** | **LCP as a plain `<img fetchpriority="high">`, canvas takes over silently at hydration.** | **5 · AXIS** | Section 07, the approval scrub | Best-specified LCP pattern in the set. Apply it to every frame sequence anywhere on the site. |
| **G12** | **Name the terminal: وَتَد ٠١ / WATAD 01, with one dimensioned orthographic plate.** | **5 · AXIS** (renamed; see §A.1.7) | Section 06 | Converts R.Pay from a service company with a website into a company that makes a thing. Free, permanent, survives whichever site ships. Every number on the plate must be evidenced. |
| **G13** | **The acceptance test as a CI gate:** *"remove all motion and it is still 95% as good."* Playwright renders every page with `prefers-reduced-motion: reduce` forced and diffs against the animated build. | **4 · DAYLIGHT** | CI, day one | The tech judge called this the single highest-value item on the page, and Playwright is already a devDependency with a `shoot` script. It is simultaneously a reduced-motion spec, an accessibility spec and a perf budget, in one sentence. |

**Taken from AXIS beyond G11–G12: nothing.** No plinth, no exploded section-cut, no `DeviceOrientationEvent` tilt, no WebAudio chirps, no fabricated hardware specs, no 3D pipeline. **Taken from UNBROKEN beyond G10: nothing** — its unbroken SVG path is the most maintenance-hostile artefact anyone proposed, and the moment you segment it to make it survivable, its premise evaporates.

---

# C. THE FINAL DIRECTION

## C.1 Creative direction and manifesto

**برج القيادة — THE BRIDGE**

R.Pay's buyer is not a CFO evaluating payment rails. He is a man who owns ninety-seven physical machines scattered across malls, Riyadh Season destinations and hypermarket concourses — objects full of his money that he cannot see. At 11pm on a Thursday he is awake asking four questions: is my money reaching me, is machine 43 working right now, has someone moved it, and what did I actually make today. Every competitor answers those questions with a brochure. A brochure is the wrong instrument, because the product is not information — it is **command**. So we do not describe the control room. We hand him the controls for ninety seconds.

And then — this is the part nobody pitched — **we turn the lights on.** Halfway down, the night ends. The instruments stop. The page becomes paper, in daylight, and the same company that just showed you a fleet under command shows you a printed document: who already installed it, how it compares, who we are, and what we do for the venue that hosts the machines rather than owns them. Then the sun goes down and we return to the bridge to shake hands.

That two-act shape is the whole art direction and it is doing four jobs at once. It is the leap that makes old-and-new incomparable at thumbnail size. It is the second audience — the mall operator, the developer, the procurement lead at Roshn — finally getting a room they can breathe in. It is the answer to the legibility of a dark palette on a cheap phone at 40% brightness in a Riyadh mall. And it is the surprise: nobody who has scrolled eight sections of black instrumentation expects the page to open a window.

**The one law that carries everything: cyan means live.** Cyan is never a border, never a button, never a heading, never decoration. If something is cyan, it is reporting real state. The glow is rationed, and rationing is what makes it read as competence instead of ornament. In Act II there is **no cyan at all** — because in daylight, nothing needs a status light.

**The wow acceptance test, and it is falsifiable:** a stranger shown a 400×800 screenshot with the logo cropped off can tell what this company sells. If they can't, we haven't shipped it.

---

## C.2 Visual language

### Colour — night (Acts I & III)

| Token | Hex | Rule |
|---|---|---|
| `--hull` | `#040F1E` | page ground. Unchanged from brand — the only thing we keep. |
| `--deck` | `#0A1826` | raised instrument surfaces. Exactly two elevation steps exist. |
| `--hairline` | `#16283A` | every divider. 1px. Never a shadow. |
| `--brass` | `#C8A96B` | **structural instrument detail — pushed to the front.** Rules, scales, section numerals, caliper ticks, the horizon. |
| `--brass-dim` | `#6E5C39` | brass at rest, on deck surfaces |
| `--signal` | `#00AEEF` | **LIVE ONLY.** ≤12 consuming nodes, lint-enforced. |
| `--settled` | `#1FD3B8` | money arrived / approved / the only filled button on the night pages |
| `--depth` | `#0E6DD0` | focus rings, chart fills. Never a gradient. |
| `--warn` | `#F2A33C` | approaching threshold |
| `--breach` | `#FF4D4D` | used **twice** on the entire site: hero device 43, radar breach |
| `--dead` | `#6B7785` | offline, and the global breach state |
| `--ink` | `#E8EFF6` | body text — 13.8:1 on hull |
| `--ink-muted` | `#9FB0C2` | secondary — 8.4:1. Never lower. |

### Colour — paper (Act II)

| Token | Hex | Rule |
|---|---|---|
| `--paper` | `#F2EFE9` | Riyadh limestone. Warm, not white, so the ink sits. |
| `--paper-2` | `#E8E4DB` | table zebra, gutters |
| `--rule` | `#CFC9BC` | every hairline on paper |
| `--ink-dark` | `#12110F` | all type, and the filled CTA |
| `--ink-dark-60` | `#5C5850` | captions, mono |
| `--brass-ink` | `#7A5F2B` | the warm structural line, carried across the act break — 6.1:1 |
| `--trace` | `#0A6E96` | cyan, demoted to a 1px data trace. 4.7:1. Graphics and ≥18px only. |

**The brass is the anti-generic move and it must be pushed until a stranger notices it first.** Every payments site in this region is cool-toned; a warm 1px hairline system — marine instrument bezels, Bloomberg's amber heritage — gives the page a temperature nobody else has, at zero runtime cost, and it is **the one element that survives the act break unchanged**, which is what tells the eye that the paper section is the same company and not another site.

Retired outright: `--depth` as a large-area fill, every gradient, every blur, every glow, every glassmorphism, every drop shadow. `box-shadow` may appear exactly once in the codebase: `inset 0 1px 0 rgba(255,255,255,.04)` — the bezel highlight on deck surfaces.

### Light
Night: single cold source, top-inline-start. Depth comes exclusively from hairlines and two surface elevations. Paper: none — no shadows, no lift, white space and rules only.

### Texture — three, total
1. **Night grain:** 128×128 monochrome PNG, ≤3 KB, tiled, `position: fixed`, 0.8% opacity, `pointer-events: none`. This is what stops `#040F1E` from reading as cheap CSS black.
2. **Paper grain:** inline SVG `feTurbulence`, ~200 bytes, tiled at 3%, disabled below 400px width.
3. **The instrument grid:** 1px hairline grid at 3% opacity, visible **only inside plate regions** (radar, money line, fleet), never behind body text.

### Imagery
- Machine renders and the terminal: cut out, desaturated ~70%, graded into the hull palette so they read as **schematics, not product photos**. Verified constraint: at 720×964 they may never exceed **340px CSS width**. Design to that.
- `close-terminal.webp` (960×866) is the site's **only warm, full-fidelity image**, and it appears once, at the end of the approval sequence. It lands precisely because everything around it is instrumentation.
- Client logos: single-ink, matched optical weight, never in brand colours, never a carousel, never a greyscale-to-colour hover.
- Existing AI films: never full-bleed, never in the hero. They live inside a **320×180 sensor-feed frame** with a timecode and a LIVE dot (G8).
- Act II gets **one real photograph** or none. See §E.

---

## C.3 Typography

Three families. Two are already on disk.

**Arabic + Latin display — one licensed face, two named tracks:**

- **Track A (target, and the single cheapest premium upgrade available):** **TPTQ Arabic — Greta Sans Arabic** (Kristyan Sarkis / Peter Biľak), or **29LT Zarid Sans** (Pascal Zoghbi). Both have a properly matched Latin from the same design intent, so a bilingual line does not fracture, and both have genuine editorial authority at 96px — which is the only thing that matters, because Act II sets Arabic large on paper with nothing to hide behind. Third pragmatic option: **Myriad Arabic** via Adobe Fonts, if the owner already has Creative Cloud, which makes web licensing a non-event.
- **Track B (ships day one, no procurement):** **Noto Kufi Arabic 700.** Geometric, monumental, signage-adjacent — and specifically *not* the Readex look, which is the most-used free Arabic face in Saudi web work and therefore forfeits the premium argument at display size.

**Arabic + Latin UI and body: Readex Pro 400/600** — already on disk (23 KB / 24.5 KB, subsetted), well-drawn, harmonised Latin. It is correct at body size and it costs zero. **We are not adding IBM Plex Sans Arabic.** Three Arabic families is one too many; the pitches that specced it were reusing a false assumption about the repo.

**Telemetry, numerals, log lines, timestamps, device IDs: IBM Plex Mono 400/500** — already on disk. `font-variant-numeric: tabular-nums`, `font-feature-settings: "tnum" 1, "zero" 1`. Western digits by default (Saudi operators read their own POS reports in Western figures), with an Arabic-Indic toggle in the rail. Mono = machine-generated = true.

**Font budget:** Readex 400+600 (47.5 KB, on disk) + Plex Mono 400+500 (29 KB, on disk) + one display face subsetted (~35 KB) ≈ **112 KB total**. Preload the display face and Readex 400 only. `font-display: swap` with `size-adjust` / `ascent-override` metric-matched fallback so the Arabic does not reflow.

**Arabic typography rules — non-negotiable, enforced in the reset and by a lint rule:**
```css
:lang(ar), [dir="rtl"] { letter-spacing: 0 !important; }
```
Latin tracking severs cursive joining and instantly marks the site as foreign-made. No `text-transform`, no all-caps Arabic mimicry. Arabic body `line-height: 1.75` (Latin 1.5). `text-align: start`. Logical properties everywhere. `dir="rtl"` on `<html lang="ar">`; `/en` is a locale segment, not a duplicate stylesheet. Never justify.

**One correctness rule that three of the six pitches got wrong:** no Arabic text is ever revealed character-by-character by appending to the DOM. That breaks cursive joining mid-word and looks broken on every frame. **All "typing" effects are a `clip-path` or mask sweep over an already-shaped line** — the glyphs are laid out once, then uncovered. Latin mono log lines may type per-character; Arabic never does.

**Scale:** display `clamp(2rem, 9vw, 6rem)` · h2 `clamp(1.75rem, 4.5vw, 3rem)` · body 17→19px · mono 12/13px. Measure capped at 62ch Arabic. Hierarchy from size and position, not from weight games. Arabic display leading 1.15 max, never tighter.

---

## C.4 The hero — shot by shot

Full-bleed. No card, no container, no hero image, no video, no loader. Under 30 KB beyond fonts. **LCP is the headline text and it is present at first paint** — Concept 4's insight, and it also happens to be the best-performing decision available.

**t = 0.00 — first paint, before a byte of JS executes.**
Hull black. A single hairline in `--brass` runs the full viewport width at 58vh — a horizon, static, already there. Above it, right-aligned, the headline is **already set**:

> **كل مكينة تحت أمرك.**
> *ninety-seven machines. one screen. zero guessing.*

Top-inline-end: the R mark, small. Bottom: the المرصد band, present, showing `—` placeholders. Nothing is animating. Nothing has faded in. In a category of moving gradients, a page that is finished on arrival is the loudest thing in the room.

**t = 0.15 → 1.05 — the fleet reports in.**
A cyan light travels **right to left** along the brass horizon — 120px wide, soft linear gradient, constant velocity, `linear`, no easing. As it passes each position it *deposits* a vertical tick: 1px wide, 14px tall, staggered 9ms. When it exits the left edge, **97 ticks stand on the horizon.** No label yet. For one second the visitor is curious, and that is correct.

**t = 1.05 → 1.57 — the instrument resolves.**
A second brass hairline draws beneath the ticks with **nine short brass drops** marking the nine branches, each with a 9px mono label. The horizon stops being a line and becomes a *scale*: branches × machines. This is where brass takes the front of the page.

Simultaneously, three tabular readouts settle (they were in the DOM at 0.6 opacity, 8px translated): today's transactions · machines online · today's settlement. Digits roll once, 180ms, **linear** — machines do not ease.

**t = 1.6 — the rails, and the objection dies before it forms.**
On its own hairline beneath the readouts, one monochrome row at `--ink-muted`, static, no motion, no colour:
`mada · VISA · Mastercard · Apple Pay · stc pay · GCCNET`
Adjudication §4. It costs one strip and it answers the entry question of every operator who arrives cold.

**t = 2.2 → 5.0 — the ticks resolve into truth.**
Ninety go `--signal` cyan. Seven dim to `--dead` graphite. Staggered, linear, 120ms per state change.

**t = 5.0 → 6.4 — the theft.**
One tick — the 43rd from the right — turns `--breach` red and pulses at exactly 1 Hz. A hairline leader draws to a single stamped mono log line:

> `٠٢:١٤:٠٧ · جهاز ٤٣ · خارج النطاق الجغرافي · إيقاف تلقائي`

**t = 6.4 — restored.** The tick returns to cyan. The log stamps `أُعيد التشغيل`. The horizon goes still, and **the page never animates unprompted again.**

The entire value proposition has been delivered in under seven seconds with one marketing sentence, and the visitor has watched a theft get stopped. Below the horizon: one ghost text link — `شاهد جولة في غرفة التحكم · ١٥ دقيقة` — and the WhatsApp hairline. **No filled button in the first 100vh** (adjudication §3).

---

## C.5 Full section structure

Persistent layers, present on every section: **المرصد** (the rail), **the tick index** (15 ticks, inline-end edge, tappable, doubles as progress — on mobile it collapses to a 3px hairline on the docked rail), and **WhatsApp**.

### ACT I — الجسر / THE BRIDGE · ground `#040F1E`

| # | Section | Job to be done | Emotional beat | Primary CTA | Secondary |
|---|---|---|---|---|---|
| **01** | **الجسر** — hero (§C.4) | Establish that this is a command environment, and that mada/Apple Pay are table stakes already handled | Alertness. *Something is live here.* | — (ghost link only) | WhatsApp |
| **02** | **الأسئلة الأربعة** — the four questions | Recognition. Four operator anxieties, stated as *his own* 11pm questions in Arabic, each answered by exactly one R.Pay behaviour. **Zero effects, zero icons, zero cards.** Set on `--deck` with brass rules — the warmest thing in the night act. | *He has run this business.* This is where the deal actually closes and it contains no visual effects whatsoever. | — | — |
| **03** | **خط المال** — the money line | Kill the middleman objection. Two SVG lines, scroll-scrubbed: R.Pay's runs machine → operator's account, straight, 400ms. The comparison line detours through a grey box labelled `وسيط`, **pauses**, then continues. The pause is the whole argument. | Relief, then mild anger at the status quo. | — | `كيف تصل الأموال مباشرة؟` (text, 3 min read) |
| **04** | **الريال الذي عاد** — the riyal that came back **(G4)** | Automatic refund, its own beat, its own silence. A payment fails. The rail turns `--warn` amber. The money **reverses direction on its own** and travels back to the card. `استرجاع تلقائي — بدون تدخل بشري`. Twelve seconds. No click required. Nobody touched anything. | Trust. Competitors cannot show this. | — | — |
| **05** | **الرادار** — the geofence radar **(signature 1)** | Demo the moat by making the visitor commit the crime | Delight → genuine unease → safety → a laugh on the fifth try | **`احجز جولة في غرفة التحكم`** — filled mint, full-width band. **Peak intent on the entire page.** | `احفظ اللقطة` (share card, G7) |
| **06** | **الأسطول** — the fleet | Prove the hardware is real. **وَتَد ٠١** named, with one orthographic dimensioned plate (G12, evidenced specs only). Three machine classes as ≤340px chips with spec-sheet typography. Remote add/remove shown as a tick appearing on the horizon. One sensor-feed inset (G8). | Solidity. *This is not a startup demo.* | — | `كرّاس المواصفات (PDF)` |
| **07** | **اللمسة** — the approval | Tactility. The 72-frame WebP sequence, scroll-scrubbed at ~1 frame per 14px, ending locked on the approved frame: one `--settled` mint state change and the word **تمّت**. The site's only warm, full-fidelity image. | Satisfaction. The one moment the page is human. | — | — |
| **08** | **السجل** — the ledger | Scale, honestly stated. 465,255 · 97 · 9 · 9,434 · 90/97 in mono tabular figures, each with a **provenance chip** (`بيانات حتى ١٦ أغسطس ٢٠٢٦`). They count **once**, on first view, then never again. The 9,434 prizes get their own line — the most human number the company owns and every concept buried it. | Weight. | — | Tap any figure to copy value + timestamp |

### — مطلع النهار / DAYBREAK — **(signature 3)**

### ACT II — النهار / DAYLIGHT · ground `#F2EFE9`

| # | Section | Job to be done | Emotional beat | Primary CTA | Secondary |
|---|---|---|---|---|---|
| **09** | **الموانئ** — where it's installed | Credibility by association. Not a logo wall: a right-aligned Arabic **manifest** — venue name, city, class of deployment — with the mark set small and single-ink at the end of each line. Roshn, Dar Al Arkan, LuLu, Boulevard City, Boulevard World, Sela, Al Khozama, Kinan, Hamat, Malahi, Al Nadej, Al Deera, Shawarma House. Named deployments: Saffori Land, Sparky's, VR Games Zone. Reads like a shipping register. | Legitimacy. *These people already made this decision.* | — | — |
| **10** | **المقارنة** — the timetable **(G2)** | Close the rational sale. Swiss timetable, three columns, eight rows. Solid 6px ink dot = yes, hollow ring = no. **No colour anywhere.** One full column beside two nearly empty ones. Dated source line: `حسب المقارنة المعلنة · [date]`. | Superiority, unspoken. | — | Source footnote |
| **11** | **لِمن نعمل** — who this is for | **The second audience, finally addressed.** Mission and vision in full, set as one 62ch paragraph with enormous air. Then the venue-owner path: what R.Pay does for a mall, a destination, a developer who *hosts* machines rather than owning them. One real photograph, if funded. One sensor-feed inset if not. | Recognition. *There is a version of this for me.* | **`استضِف مكائن في موقعك`** — filled ink on paper | Phone (venues call, they don't WhatsApp) |
| **12** | **الأسئلة الشائعة** — FAQ | Clear objections without theatre. Hairline accordion, mono numbering `٠١ / ٠٢`. Settlement window, onboarding time, contract length, support SLA, what happens if a machine goes offline. | Calm. | — | `/التقنية` · `/الأسعار` |

### ACT III — العودة / THE RETURN · ground `#040F1E`

| # | Section | Job to be done | Emotional beat | Primary CTA | Secondary |
|---|---|---|---|---|---|
| **13** | **باسمك** — white label | Sell the white-label option by giving it away for thirty seconds. One input, no signup: type your company name and **the rail at the top of the page rebrands to it for the rest of the session.** | Ownership. | — | — |
| **14** | **التسليم** — the handover **(G9)** | Convert. Not "contact us" — a commissioning request. The **Fleet Estimator**: `كم مكينة تملك؟` · `في كم موقع؟` · `في أي مدينة؟` — and as you type, **your machines appear as white ticks on the rail beside R.Pay's cyan ones.** Then submit. On success the page stamps a log line the way the hero did: `تم استلام الطلب · سيتم التواصل خلال ٢٤ ساعة`. | The handshake. | **`احجز جولة في غرفة التحكم`** | WhatsApp · phone |
| **15** | **القاعدة** — footer / station ident | Institutional weight. `شركة سعودية`, CR number, VAT, registered address, mission and vision lines, direct phone, WhatsApp, AR/EN, privacy. Brass hairlines. The rail's counters still ticking. | *The grid keeps running after you leave.* | — | All tertiary |

---

## C.6 Product presentation strategy

Four rules, all of them forced by verified asset facts.

1. **The terminal is named and drawn, not photographed large.** **وَتَد ٠١ / WATAD 01** appears twice: as an Illustrator **orthographic line plate** with calipers and dimensions (vector, ~6 KB, themeable by `currentColor`, and the cheapest possible "we make a thing" signal), and once at full fidelity in section 07 at ≤375px. `device-terminal.webp` is 749×1000 — it physically cannot go bigger without looking like AI plastic, which is precisely how Concept 5 dies.
2. **The three machines are classes, not heroes.** 720×964 renders, used as ≤340px chips with spec-sheet typography beside them: dimensions, rails accepted, prize module, connectivity, power. Graded to the hull palette so they read as schematics. This turns a hard constraint into an art direction.
3. **The platform is shown as a real capture, never as a mockup.** A 40-second silent screen recording of the actual dashboard, framed as a sensor feed, is the Tier-2 CTA. A floating dashboard mockup at 15° with a drop shadow would destroy the entire honesty thesis in one image.
4. **The payment rails are dispatched in four seconds, in the first viewport, in one monochrome row, and never mentioned again visually.** They are table stakes. Treating them as a feature is what makes a fleet-command company look like a payment gateway.

---

## C.7 Motion language

**Governing principle: instruments settle, they never bounce. Data ticks, it never eases.** Two families. Mixing them is a bug, not a style choice.

**INSTRUMENT motion** — chrome: panels, headlines, reveals, buttons.
```css
--ease-settle: cubic-bezier(0.16, 1, 0.3, 1);    /* 520ms — every element entrance */
--ease-arm:    cubic-bezier(0.65, 0, 0.35, 1);   /* 640ms — scroll-triggered composition */
--ease-ui:     cubic-bezier(0.4, 0, 0.2, 1);     /* 140ms — hover / focus / toggle */
--ease-token:  cubic-bezier(0.4, 0, 0.2, 1);     /* 400ms — colour-token transitions */
--ease-exit:   cubic-bezier(0.4, 0, 1, 1);       /* 240ms — leaving, shutting down */
--ease-spring: cubic-bezier(0.34, 1.3, 0.64, 1); /* 380ms — EXACTLY ONE USE ON THE SITE */
```

**MACHINE motion** — data: digit rolls, log stamps, tick states, radar sweep, hero scan. **All `linear`. Always.**
Digit roll 180 · log stamp 180 · tick state 120 · radar sweep 4000 · hero scan 900 · scrub 1:1 with the finger.

**Duration scale — these ten values exist and no others:** `120 · 140 · 180 · 240 · 380 · 400 · 520 · 640 · 900 · 4000`.

**Laws:**
1. No `transform: scale()` beyond 1.02, anywhere.
2. **Nothing animates from `opacity: 0`.** Primary content is in the DOM and visible at paint; entrances are `translateY(8–24px)` with opacity `0.6 → 1` at most. This protects LCP and means a slow phone shows a finished page, not an empty one.
3. **Exactly one spring on the entire site** — the radar chip returning home. Scarcity is what makes it land like a mechanism instead of a bounce.
4. Nothing decorative moves. If it moves, it is reporting something.
5. Nothing exceeds 700ms except the radar sweep and the breach wash.
6. Danger arrives fast (180ms) and leaves slowly (900ms). That asymmetry is the entire emotional trick and it is stolen consciously from Concept 6.
7. `prefers-reduced-motion: reduce` → all durations to 0.01ms **except colour transitions, held at 200ms because they carry meaning**; radar sweep static; scroll-scrub becomes a stepped 6-frame sequence; the drag interaction still works, because it is a pointer interaction, not an animation. **Enforced by the G13 Playwright gate.**

---

## C.8 Scroll mechanism

**Named: native CSS scroll-driven animations, with a single shared rAF broker as the fallback. No scroll hijacking, ever.**

- **Primary path:** `animation-timeline: scroll()` and `view()`, which run on the compositor with zero JS. Supported in Chrome ≥115 — which is the overwhelming majority of this market's Android.
- **Fallback path:** one client island, **"the Broker"** (~1.2 KB): one passive `scroll` listener, **one `requestAnimationFrame` loop for the entire page** — never one per component — writing `--p` (document progress) and `--sp` (per-section progress) to `documentElement`. Every scroll-linked animation on the site is a pure function of those two numbers.
- **Feature detect:** `CSS.supports('animation-timeline: view()')`. One branch, chosen once at hydration.
- **Pinning:** exactly one section is pinned (section 07, the approval scrub) and it is pinned with `position: sticky` inside a tall parent — **not** with JS. Nothing else pins.
- **Banned outright:** Lenis, smooth-scroll libraries, `scroll-behavior: smooth` on the document, any form of scroll jacking. On mid-tier Android, hijacked scroll is how you lose the device.
- **`content-visibility: auto`** on every section from 06 down.
- **Mobile fallback:** identical, plus the frame-scrub degrades to 24 of 72 frames, and to 6 stills when `navigator.connection.saveData` or `deviceMemory <= 2`. The narrative survives completely, because the timestamps and the log lines carry the story — not the footage.

---

## C.9 Section transitions

There are three kinds and only three.

1. **Within an act:** a full-width brass hairline carrying the mono section numeral and channel label — `قناة ٠٥ · الرادار` — set at the inline-end. The label stamps into the rail at 180ms linear as the section crosses 50vh. No fades, no wipes, no parallax between sections.
2. **The act break (مطلع النهار / DAYBREAK):** **no transition animation at all.** The paper act simply begins, and because sections scroll, the ground changes as you scroll into it. That hard edge is the entire effect. The only crossfade on the whole site: **المرصد inverts to its paper styling over 180ms** when the viewport is ≥50% paper — which makes the rail feel like it physically travelled with you into daylight. One property, one transition, and it is the moment that sells the act structure.
3. **The return (غروب / DUSK):** identical mechanism, in reverse, into section 13.

---

## C.10 Background treatment

**Night:** flat `--hull`. Fixed 128px grain tile at 0.8%. Hairline grid at 3% **inside plate regions only**. `inset 0 1px 0 rgba(255,255,255,.04)` bezel on deck surfaces. That is the complete list.

**Paper:** flat `--paper`. Inline `feTurbulence` grain at 3%, disabled below 400px width. Hairline column rules. Nothing else. No shadow appears in Act II under any circumstances.

**Both:** zero gradients, zero `filter: blur()`, zero `backdrop-filter`, zero glassmorphism, zero radial blobs. Depth is hairlines, value, and two elevation steps. This is not asceticism — it is the reason the site is fast on a Redmi Note, and the reason the premium look and the performance budget are, for once, the same decision.

---

## C.11 Micro-interactions

1. **Rail counters** roll once, linear 180ms, on first view. Then never again unless the underlying value actually changes. Tap a counter → its **provenance chip** expands: `آخر تحديث ١٦:٠٤ · المصدر: لوحة R.Pay`.
2. **Copy-a-number.** Tap any figure anywhere → copies `value + asOf` to the clipboard, with a 180ms mono confirmation stamp. Instruments let you take readings.
3. **Tick hover / long-press (hero).** Hovering a tick surfaces its branch name and last heartbeat as a mono line *under the horizon* — no tooltip chrome, no floating card.
4. **Link hover:** a brass hairline underline grows from the **inline-start** edge, 140ms, direction-correct in both locales.
5. **Focus ring:** 2px `--depth` at 2px offset, on every interactive element, never removed, never `outline: none`.
6. **Log-line stamp:** 180ms linear, revealed by clip-path mask on an already-shaped line (never per-character for Arabic — §C.3).
7. **Section numeral** stamps into the rail as each section arms.
8. **WhatsApp** is a brass hairline pill inside the rail. Never a floating green bubble — that is the one element that would instantly make this look like a template.
9. **Estimator live tick-draw:** typing "24" draws 24 white ticks beside R.Pay's cyan ones, in real time, before submit.
10. **Contrast toggle** in the rail: raises `--ink-muted` to `--ink` and thickens hairlines to 1.5px. It is **not a second theme** — it is four token overrides — and it doubles as control-room fiction.
11. **Sound:** one relay knock, ~8 KB. Default **off**. Unlocked only by the radar drag (a real user gesture). Three uses total: grab, breach, restore. Toggle in the rail.
12. **Numerals toggle:** Western ⇄ Arabic-Indic, in the rail, persisted to `localStorage`.

---

## C.12 Mobile, designed on its own terms

Mobile is not a reduction of this concept. **It is the truer version**, because a control room in your hand is literally the product's promise. Design mobile first; desktop is the widescreen variant.

- **المرصد docks to the bottom**, 56px, thumb zone, `env(safe-area-inset-bottom)`. It carries the live counters, the compact primary CTA, WhatsApp, and the 3px progress hairline. It is the single most on-brand element on the phone: fleet status permanently at the base of the screen, exactly like a real operations app.
- **The hero fleet strip becomes a grid.** 97 ticks reflow to 7 rows × 14 columns of 6px squares. The scan runs row by row, right to left, same 9ms stagger. **It is more legible than the desktop line, not less** — you see the seven dark ones instantly.
- **The radar is better with a finger.** 64px chip, `touch-action: none` **scoped to the chip alone** so the page still scrolls everywhere else. `navigator.vibrate(12)` at the amber threshold, `[30,40,30]` at breach. Dragging your own machine out of its zone with your thumb and feeling the phone buzz as it dies is the moment this concept exists for.
- **Act II is where mobile wins hardest.** A phone is a page, and Act II is a page. The comparison table stays a **table** — horizontally scrollable with a sticky first column and a 1px scroll shadow. It is never converted into stacked cards; the entire point is three columns side by side.
- **Zero `<video>` mounted below 900px** except the 320×180 sensor feed at `preload="none"`, play-on-intersect.
- **Frame scrub:** 24 of 72 frames (~470 KB), loaded only when the section is within 1.5 viewports; 6 stills on `saveData` or `deviceMemory <= 2`.
- **The four questions get the most vertical space on mobile, not the least.** It is the section a busy operator actually reads standing in a corridor.
- **Type:** hero display `clamp(2rem, 9vw, 3.5rem)`, Arabic body never below 15px, `line-height` never below 1.6.
- **No hamburger.** The tick index is the navigation.

---

## C.13 The customer journey, first paint to conversion

**Journey A — the operator (primary).** *Standing, phone, 22:00, mall corridor.*

`0.0s` Headline readable at first paint. He knows what this sells before anything moves. → `1.0s` 97 machines report in; he understands the scale is real. → `1.6s` mada and Apple Pay are already answered; the objection never forms. → `6.4s` he watches a theft get stopped. → **Section 02** he reads his own 11pm questions in his own language and something in his posture changes. → **03–04** his money goes straight to him, and a failed payment fixes itself while he watches. → **05** he steals his own machine with his thumb, feels the phone buzz, watches it die, sees the revenue counter freeze — *and then resume from where it stopped, not from zero.* This is the conversion moment and **the filled CTA is right there.** → If he doesn't convert, → **06–08** hardware is real, approval is tactile, the numbers are dated and sourced. → **DAYBREAK** the page exhales; he sees Roshn and Boulevard World; he sees one full ink column beside two empty ones. → **13–14** he types his company name and watches the site become his for thirty seconds, then types "40 machines, 3 sites, Riyadh" and watches his fleet join the rail. → Submit, or WhatsApp — both are one thumb away at every single moment.

**Journey B — the venue side (Roshn, Kinan, Hamat, a mall procurement lead).** *Desktop, daytime, has one question.*

`0.0s` Headline. → Tick index on the edge, or the rail's nav. → Jumps straight to **Act II**, which is a warm, quiet, properly-set daylight document — no instrumentation, no cyan, no drag toy. → Reads the manifest, the timetable, the mission, and **the venue-specific proposition with its own CTA: `استضِف مكائن في موقعك`.** → Or leaves for `/التقنية` and `/الأسعار`, which are boring and fast and exist precisely for him. **This journey does not exist on the current site and it does not exist in any of the six pitches. It is a second revenue path with a conversion route.**

---

## C.14 CTA strategy — three tiers, one extra lane

**Tier 1 — Primary, operator: `احجز جولة في غرفة التحكم`.** Book a live control-room walkthrough. Fifteen minutes on a screen-share with a real dashboard showing real machines. Not "contact us", not "get started", not "request a demo" — **naming the offer precisely is worth more than any button design.** Solid `--settled` mint on hull: the only filled button in the night acts, mint because mint means *settled*, and the promise is that money arrives. Appears four times: the rail (compact from the moment the hero scrolls past, expanding on scroll-stop), immediately after the radar (peak intent), section 14, and the footer.

**Tier 1b — Primary, venue: `استضِف مكائن في موقعك`.** Filled ink on paper. Appears twice: section 11 and the footer. Routes to a different inbox and a different sales script.

**Tier 2 — `تواصل عبر واتساب` and `ادخل اللوحة`.** WhatsApp is persistent, thumb-reachable, ghost style with a brass hairline — this market closes on WhatsApp and pretending otherwise costs real deals. `ادخل اللوحة` is the 40-second real dashboard capture, for the sceptic who will demand to see the actual thing.

**Tier 3 — `كرّاس المواصفات (PDF)`, direct phone, `/التقنية`, `/الأسعار`.** For the procurement person, not the decision-maker. Footer and section 06 only.

**The form asks three questions, not eight** — machine count, site count, city. The machine count silently qualifies the lead and flatters the buyer. Anything more and an operator standing up on a phone closes the tab.

**Instrumentation:** fire `geofence_breach` on every completed drag. **Anyone who breaches is a qualified lead** (the one genuinely good idea in Concept 5's CTA section), and the primary CTA reveals itself immediately after the first breach.

---

# D. THE SIGNATURE MOMENTS

Three. One interactive, one narrative, one structural. Together they are the wow, and not one of them is a gradient, a glow, or a 3D scene.

---

### D.1 — **الرادار · "اسرق المكينة"** / STEAL THE MACHINE

**What the user sees.** A wide plate: an abstract mall concourse drawn in 1px brass at 12% opacity — not a real map, a floorplate. A cyan geofence ring, 2px stroke, with a slow radar sweep inside it (conic gradient, masked to the circle, 4s linear). At the centre, a 56px chip carrying the arcade render, ID `جهاز ٤٣` in mono beneath. To the side, a six-line timestamped log column. Above: **`اسحب المكينة خارج النطاق.`** and, quietly, `محاكاة تفاعلية · لا يتم إيقاف أي جهاز حقيقي`.

Drag it. Under 75% of the radius: nominal, heartbeat every 900ms. Between 75% and 100%: the ring interpolates cyan → amber and thickens, a dashed radial line draws, distance readings stamp every 240ms, the phone buzzes once. **At 100% — the breach.** The whole page loses its cyan: every live token goes graphite over 400ms, a 1px red line runs the viewport width in 220ms, the chip dies, and three log lines stamp in 180ms succession:

```
٠٢:١٤:٠٧ · تجاوز النطاق الجغرافي
٠٢:١٤:٠٧ · إيقاف تلقائي للجهاز
٠٢:١٤:٠٨ · الرصيد محمي · تم تنبيه المالك
```

The day's revenue counter above the chip **freezes mid-digit and greys**. The instruction line is replaced by: **«الجهاز الآن قطعة معدن.»** Release, and the chip springs home — the only spring on the site — cyan returns as a radial wash from the chip outward, and **the counter resumes from exactly where it froze, not from zero (G5)**. Every attempt appends a permanent log line for the session. On the fifth: **«لن تملّ من هذا. ولا نحن.» (G3)**. Underneath: `احفظ اللقطة` **(G7)**.

**What it makes them feel.** For 400 milliseconds the visitor *breaks the website*. Then the website heals itself in front of them. The global desaturation is the trick — the breach is not confined to a widget, it costs the whole page its signal colour, which is what makes the stakes feel real. And the counter resuming from where it stopped converts "my machine died" into "**my money was preserved**," which is the actual sale.

**How it's achieved.** Pure SVG + pointer events + CSS custom properties. `setPointerCapture` on `pointerdown`; every `pointermove` computes `d = distance / radius`, clamped 0–1.4, and writes it to **one** custom property `--breach` on the section root. Everything downstream — ring colour via `color-mix()`, stroke width, dash length, chip state — is CSS driven off that single number. No per-frame JS style writes beyond the variable. The breach toggles one class on `<html>` which changes **one** token, `--signal`, consumed by a **lint-capped set of twelve nodes** (adjudication §8), with an instant-swap path on `deviceMemory <= 4`. **~4 KB of JS. No canvas, no WebGL, no physics, no library.** `touch-action: none` scoped to the chip alone. Full keyboard path: the chip is focusable, arrow keys move it in 8% increments, Escape recentres, and the breach fires identically, announced via `aria-live="polite"`. Under `prefers-reduced-motion` the sweep is static, the wash is an instant swap, and the spring becomes a 200ms ease.

**The share card:** `احفظ اللقطة` composites the current log state onto a pre-rendered 1080×1350 WebP plate that already contains every Arabic glyph, then `fillText`s six Western-digit strings and calls `navigator.share()`. **No Arabic ever touches the canvas text API** (adjudication §2).

---

### D.2 — **الريال الذي عاد** / THE RIYAL THAT CAME BACK

**What the user sees.** The quietest section on the site, and there is nothing to click. A payment enters the money line from the right. At the authorisation station it **fails**. The line goes amber. Then — with no prompt, no button, no human — the dot **turns around and travels back the way it came**, all the way home to the card. A single mono line stamps beneath it:

> `استرجاع تلقائي — بدون تدخل بشري`

Twelve seconds. Then stillness. The page moves on.

**What it makes them feel.** Fairness, which is a rarer and more durable feeling than delight. Every operator in this market has spent an afternoon on the phone chasing a failed transaction for a customer who is standing in front of them. Watching the money go home by itself, unprompted, addresses that memory more directly than any headline could. It also takes the most boring row on the comparison table and makes it the most emotionally persuasive thing on the page — which is exactly why two of three judge panels named it the finest single section in all six submissions.

**How it's achieved.** One SVG path with `stroke-dashoffset` bound to `--sp` (section progress) via `animation-timeline: view()`, or the Broker's rAF fallback. The reversal is not a second animation — it is the *same* path's offset running back past its origin, which is why it reads as retreat rather than as a new object. The colour shift is one `color-mix()` on `--warn`. The log line is a clip-path mask sweep over pre-shaped Arabic. **Roughly 900 bytes of JS and no images.** Under reduced motion it becomes two static states cross-faded in 200ms, and the meaning survives intact.

---

### D.3 — **مطلع النهار** / DAYBREAK

**What the user sees.** Eight sections of black instrumentation. Cyan status lights, brass hairlines, mono log lines, a fleet reporting in, a theft, a shutdown, a recovery. The visitor has completely acclimatised — their eyes have adjusted to the dark.

Then they scroll one more time and **the page is paper.** Warm limestone, in daylight. Black ink. The same brass hairlines. The same numbers. But no instruments, no telemetry, no cyan anywhere — because in daylight nothing needs a status light. And on that paper: Roshn, LuLu, Boulevard World set as a printed manifest; a Swiss timetable with one full ink column beside two nearly empty ones; the company's mission in one large, beautifully set Arabic paragraph with enormous air.

Then, four sections later, the sun goes down and we are back on the bridge to close.

**What it makes them feel.** Relief and respect, in that order — and, importantly, *surprise*, which is the one thing on the owner's list of what wow is allowed to mean. It is the moment the site stops performing and starts talking. For the operator it is a breath after the fear. For the venue-side visitor it is the first room in the entire experience that was built for him. And for the stranger comparing old site to new, it is the single frame that makes them incomparable — which is the exact charge the brand strategist levelled at COMMAND, answered.

**How it's achieved.** **It costs nothing at runtime.** Twenty CSS custom properties redefined under one `[data-act="day"]` attribute on four `<section>` elements. No transition, no animation, no crossfade, no JS — the ground changes because you scrolled into a section with a different background, which is the oldest mechanism on the web and here it is the whole point. The **one** moving part: المرصد transitions its own tokens over 180ms when `IntersectionObserver` reports the viewport ≥50% paper, so the rail visibly travels with you into daylight. The theme surface is bounded to six components (type, rules, dots/rings, logos, accordion, one button) — a bounded act, not a parallel theme, which is precisely the objection the tech judge raised against Concept 6 and which this structure answers by construction (adjudication §5).

---

# E. ASSET PLAN

### E.1 — REUSE AS-IS (verified on disk, no work required)

| Asset | Verified | Used for |
|---|---|---|
| `flow/seq/*` — 72 WebP, 1100×618, 1.4 MB | ✔ | Section 07 approval scrub, in a **≤560px CSS panel** (1100px ÷ 2 DPR). Never full-bleed. |
| `machine-arcade / vending / coffee.webp` — 720×964 | ✔ | Section 06 class chips, **≤340px CSS**, after grading. Also the radar chip at 56px. |
| `device-terminal.webp` — 749×1000 | ✔ | Section 06, **≤375px CSS**, after grading |
| `concept-08/close-terminal.webp` — 960×866 | ✔ | Section 07 LCP `<img fetchpriority="high">`, then canvas takeover (G11) |
| `concept-08/arcade-live.mp4` — 301 KB | ✔ | The 320×180 sensor feed (G8). Already the right size and weight. |
| `logos/roshn.svg` | ✔ | The one logo that is already vector |
| `favicon.png`, `hero-poster.webp` | ✔ | As-is |

### E.2 — DELETE ON DAY ONE

| Asset | Size | Why |
|---|---|---|
| `public/assets/flow/master.mp4.part00 / .part01 / .part02` | **45.1 MB** | Three chunks of a video nothing serves, currently in the Vercel deploy |
| `master.mp4.part00` (repo root) | **20 MB** | Same |
| `vending-video.mp4` | 4.2 MB | Re-encode to one 320×180 sensor-feed loop (~250 KB) or delete |
| `hero-video.mp4` | 2.0 MB | Never appears on the homepage. Demote to a sensor feed on `/التقنية` or delete |
| `three` + `@types/three` | ~600 KB in the graph | Unused. Unanimous across all six concepts and all three judges. |

**65.1 MB of dead video is currently being deployed.** This is the first commit.

### E.3 — REGENERATE

| Asset | Tool | Why this tool |
|---|---|---|
| **12 client logos → single-ink SVG** | **Adobe Illustrator, manual re-trace** | Verified at 123–193px raster. No CSS filter and no auto-trace produces a usable single-ink mark at that source resolution. This is a real **2–3 day** design task and it is the one unavoidable production cost in the whole plan. Budget it or drop to text-only names — do not ship blurry logos next to Roshn's clean SVG. |
| **The R.Pay brand mark → SVG** | **Illustrator** | `r-mark.webp` is 142×128 raster. The mark must render crisply at 16px in the rail *and* at 240px on the 1080×1350 share card. There is currently no vector of the company's own logo in the repo. Request the original from the owner first; re-trace only if it doesn't exist. |
| **Machine + terminal renders → hull grade** | **Photoshop** (batch action) | Desaturate ~70%, crush the AI bloom, grade into `#040F1E`, re-light the cyan reader ring on a mask. Half a day, and it is what turns "AI product render" into "schematic". **Do not re-render in 3D** — verified 720×964 is sufficient for every size we use it at, which is exactly why Concept 5's 3–4 week render pipeline was unnecessary. |

### E.4 — CREATE NEW

| Asset | Tool | Why this tool |
|---|---|---|
| **Night grain tile** 128×128 mono PNG ≤3 KB | **Photoshop** | Static, tiled, fixed. Stops `#040F1E` reading as cheap CSS black. Costs one HTTP request and zero repaints. |
| **Instrument line system** — horizon scale, branch drops, geofence plate, floorplate, money-line diagram, caliper ticks | **Illustrator → optimised inline SVG** | Vector, ~2–8 KB each, themeable by `currentColor`, mirrors free in LTR. This is the site's visible grid and it must be drawn by hand, not generated. |
| **وَتَد ٠١ orthographic dimensioned plate** | **Illustrator line art** | It is a technical drawing, not a render. Vector is correct, it is the cheapest possible "we make a thing" signal, and it costs one illustration instead of a 3D pipeline. **Every dimension on it must come from an owner-supplied supplier document (§H).** |
| **Share-card background plate** 1080×1350 → WebP ~60 KB | **Illustrator + Photoshop export** | Bakes every Arabic glyph, the frame and the mark at design quality, so runtime canvas composites only Western digits. This is the entire adjudication in §2, made into an asset. |
| **New Saudi Riyal glyph ﷼** as inline SVG | **Illustrator** (trace from the official mark) | Font coverage is still patchy; a font character risks a tofu box on the most important figure on the page. |
| **Relay-knock audio**, ~8 KB mono opus/m4a | **Recorded, trimmed in Audition** | One dry mechanical knock, not a ding. Three uses, muted by default. A synthesised beep would sound like a web toy; a real relay sounds like a machine. |
| **Dashboard capture**, 40s silent | **Real screen recording** + **After Effects** for redaction, timecode, LIVE badge | The Tier-2 CTA exists because sceptics demand the real thing. A mockup here would destroy the honesty thesis that the entire concept is staked on. AE is used only to mask customer data and add the sensor-feed chrome. |
| **كرّاس المواصفات** — 8-page PDF | **InDesign** (or Illustrator) | The site presents itself as an instrument, so of course there is a manual. Best tertiary lead magnet available and it reuses the Act II type system wholesale. |
| **Act II photograph — exactly one** | **Real photography.** Half-day shoot, live venue, daylight, with permission | It appears large, on paper, next to Roshn's logo, in the one section that is warm and human. **AI cannot do this shot**: Arabic signage in the background, hands, faces and mall interiors are precisely where generated imagery is caught, and being caught here poisons the credibility of the entire honesty framework. **If the shoot is not funded, Act II ships with zero photography and pure type instead.** That is a perfectly good outcome. Faking it is not. |
| **Additional sensor-feed loops** (optional, 0–3) | **AI video** (Higgsfield or equivalent), 4s, 320×180, ≤250 KB each | This is the **one** honest use of AI video in the project: inside a 320×180 surveillance frame with a timecode, generated footage reads as a camera feed and its artefacts are invisible at that size. Not for the hero. Not full-bleed. Not ever above the fold. |

**No AI hero film. No 3D. No stock photography. No people smiling at laptops. No floating dashboard at 15°.**

---

# F. TECH PLAN

### ADOPT

| Technology | Justification | Performance note |
|---|---|---|
| **Next.js 14 App Router, React 18, fully static** | Already the stack. `generateStaticParams` for `/ar` and `/en`. Everything is a Server Component by default. | Prerendered HTML; LCP is text |
| **Exactly five client islands** — Broker, MarsadRail, Radar, Scrub, Estimator | Each `dynamic(..., { ssr: false })` behind an IntersectionObserver mount at `rootMargin: '150% 0px'` | ~14 KB gzipped, hand-written, total |
| **Native CSS scroll-driven animations** (`animation-timeline: scroll()/view()`) | The majority Android path in this market; runs on the compositor with zero JS | Zero main-thread cost where supported |
| **One shared rAF broker** as the fallback | One loop for the whole page, never one per component; passive listener; IO-gated; paused on `visibilitychange` | ~1.2 KB |
| **CSS custom properties + `@property`** for all interpolable state | The radar, the breach, the money line and the scrub are all pure functions of one or two numbers | No per-frame JS style writes |
| **Web Animations API** for the hero stagger only | Sequenced, cancellable, no library | ~0 KB, it's a browser API |
| **`createImageBitmap` + canvas ring buffer (8)** for the scrub, capped 24fps | Never `<img src>` swapping — that stutters badly on mid-tier Android | Decode off main thread, one `drawImage` per frame |
| **`<img fetchpriority="high">` → silent canvas takeover** (G11) | The frame sequence is visually complete before a byte of JS runs | Frame sequences excluded from LCP by construction |
| **`content-visibility: auto`** from section 06 down | Skips layout and paint for offscreen sections | Large TBT win on 4-core devices |
| **Playwright** (already installed) as the **G13 reduced-motion CI gate** + visual regression | *"Remove all motion and it is still 95% as good"* becomes a diff, not an opinion | Free — it's a devDependency today |
| **`@next/bundle-analyzer` + Lighthouse CI on every Vercel preview** | Budgets that aren't enforced aren't budgets | Fails the PR, not production |
| **Self-hosted subsetted woff2**, Arabic + Latin-basic + digits, `size-adjust` metric-matched fallback | No third-party font request, no FOIT, no CLS | ~112 KB total, 2 preloaded |
| **CSS logical properties throughout** + PostCSS logical | `dir="rtl"` on `<html>`; the EN mirror is free | Zero |
| **Vanilla CSS with a token layer** | The codebase already does this well and does it correctly | Zero |
| **Lightweight analytics + `geofence_breach` event** | Anyone who breaches is a qualified lead | Vercel Analytics or Plausible; <2 KB |

### REJECT

| Technology | Justification | Performance note |
|---|---|---|
| **`three@0.149.0`** | Unused. Delete the dependency and the types. | ~600 KB of dead weight and a standing temptation |
| **Tailwind** | Would cost more than it returns on a site that is type and hairlines | Adds a build step and a class-soup diff for zero gain |
| **GSAP / Framer Motion / Lenis / any animation library** | Every motion in this document is a CSS transition, a WAAPI sequence, or a custom property | Saves 30–120 KB and removes a whole class of scroll bugs |
| **Any WebGL / 3D** | The product is a fleet, not a slab. Verified render resolution makes it impossible anyway. | No shader-compile jank on a Galaxy A-series |
| **Scrubbed `<video>` via `currentTime`** | Keyframe seeking stalls 200–600ms on mid-tier Android | This is why the scrub is a frame sequence |
| **`canvas.fillText` for Arabic** | Multi-run bidi and line-breaking are unreliable and un-QA-able | Replaced by the baked-plate approach (§A.1.2) |
| **`filter: blur()` / `backdrop-filter` / `box-shadow` on anything animated** | Destroys mid-tier Android frame budgets | Only `transform` and `opacity` animate |
| **`DeviceOrientationEvent` tilt** | iOS permission gate, inconsistent Android sensors, vestibular-trigger risk | Cut entirely |
| **Scroll hijacking / smooth-scroll libraries** | The fastest way to lose a mid-tier device | Native scroll only |
| **A second full theme for "high contrast"** | It is four token overrides, not a theme | Zero maintenance |
| **Any CMS, for now** | Fifteen sections of hand-set Arabic typography is not CMS work | Phase two, and only for the numbers |

### BUDGET — enforced in CI, failing the PR

- **First Load JS ≤ 110 KB** (current pages: 87–101 KB — the entire interactive concept costs ~12–14 KB, which is the point)
- **LCP ≤ 1.8s** on Moto G Power / Fast 3G (achievable because LCP is a text node and a 1px rule)
- **CLS ≤ 0.02** · **INP < 200ms** · **TBT < 150ms**
- **Lighthouse Accessibility = 100**
- **Total homepage transfer ≤ 900 KB** on desktop, **≤ 550 KB** on mobile first view

### EFFORT

**6 weeks.** One senior front-end engineer + one designer throughout; **+3 days of an Arabic typographer** (Act II and the display sizes); **+2–3 days of logo re-tracing**; **+half a day of photography** if funded.

- **Week 0** — Delete 65 MB. Delete `three`. Token layer. Font decision locked. Logo re-trace kickoff. **Data commitment from the owner.**
- **Week 1** — Hero + المرصد + the **breach spike on a real Galaxy A and Redmi Note** (adjudication §8). If the global desaturation janks, it becomes an instant swap now, not in week five.
- **Week 2** — The radar, the share card, and a **DAYBREAK prototype on the owner's phone.** He must feel the act break before anything else is built.
- **Week 3** — Money line, the returning riyal, the fleet, the approval scrub.
- **Week 4** — Act II in full: manifest, timetable, mission, FAQ, the venue CTA path.
- **Week 5** — Estimator, white label, footer, `/التقنية`, `/الأسعار`, the PDF.
- **Week 6** — Perf, a11y, Arabic typography QA, Lighthouse + Playwright gates, EN locale.

---

# G. RISKS AND MITIGATIONS

**R1 — If the data feels fake, the entire concept inverts. (The one that kills it.)**
All three panels named this independently. This concept stakes everything on the visitor believing that what they are seeing is real telemetry. The instant someone senses that "90 of 97 online" is decorative, the site stops reading as competence and starts reading as *theatre* — and a payments company caught performing competence it doesn't have is worse off than one that shipped a nice gradient.
**Mitigation, non-negotiable:** every figure carries a visible **provenance chip** with an `asOf` timestamp and a source label. The radar is explicitly labelled `محاكاة تفاعلية · لا يتم إيقاف أي جهاز حقيقي`. Every counter component takes `{ value, asOf, isLive }` from day one so phase two is a data swap, not a rewrite. **If R.Pay will not commit to either a live aggregate endpoint or explicitly dated static figures, do not build this concept.**

**R2 — The global breach repaint on mid-tier Android.**
Adjudication §8. Twelve consuming nodes, lint-enforced. Instant-swap path at `deviceMemory <= 4`. **Week-one spike on real hardware, not week five.** Accept the instant swap gladly if it wins — Concept 4 argued that abruptness is better anyway.

**R3 — The owner loses his nerve on Act II.**
This is DAYLIGHT's failure mode, inherited in bounded form. A white section screenshots as "unfinished" out of context and someone will ask «أين التصميم؟».
**Mitigation:** build Act II **second, in week two**, not last. Put the DAYBREAK scroll on the owner's phone before section 03 exists. He must feel the act break as a *reveal*, not evaluate it as a static frame. And the bounded structure is itself the mitigation: if he truly cannot live with it, Act II reverts to night for the cost of one attribute — which is the exact reason it was built as four token-swapped sections rather than a parallel theme.

**R4 — Naming SurePay and Geidea.**
**Mitigation:** every row sourced and dated (`حسب المقارنة المعلنة · [date]`), legal review before launch, and no claim about a competitor ships without a citation. Prepare a fallback version that names no competitor (`مقارنة بالبدائل الشائعة في السوق`) and keep it one commit away.

**R5 — Fabricated hardware specs.**
The tech judge is right that publishing `IP54` / `EMV L1/L2` on a payments device is a legal exposure, not a design detail.
**Mitigation:** **no specification ships without an owner-supplied supplier document.** If none arrives, the وَتَد plate shows dimensions and connectivity only — or the plate is cut. Naming the device costs nothing and survives either way.

**R6 — Client logo permissions.** Nobody raised this and it is real. Thirteen logos, several PIF-tier. Using Roshn's mark without written permission is a letter, not a design note.
**Mitigation:** written usage permission per logo before launch, or the manifest drops to **text-only venue names**, which honestly reads almost as well in the Act II format we chose.

**R7 — Trademark on وَتَد.** Clearance in KSA and GCC, classes 9 and 36, before it appears on a public page.

**R8 — Arabic typesetting quality.** With no effects to hide behind, every hairline, optical margin and ligature is naked in Act II.
**Mitigation:** three days of a real Arabic typographer, budgeted, non-optional. If it is cut, cap Act II display type at 48px where the flaws are invisible — a degradation, but a survivable one.

**R9 — The second audience under-served.** Act II exists precisely for this, but it must be measured, not assumed.
**Mitigation:** separate CTA, separate inbox, separate analytics funnel. Review at 30 days; if venue-side conversion is zero, section 11 gets rewritten, not the whole act.

**R10 — Non-linear arrival.** A procurement manager with one question about settlement windows trapped in a control room.
**Mitigation:** the tick index (G10), plus `/التقنية` and `/الأسعار` — flat, fast, boring, outside the narrative. The film converts believers; flat pages serve auditors.

**R11 — Dark-palette legibility at 40% brightness in a Riyadh mall.** Act II solves it for a third of the page. For the rest: minimum 8:1 on all secondary text and the contrast toggle in the rail (four token overrides).

**R12 — The signature moment is not a differentiator.** Six concepts converged on it. Assume a competitor can too.
**Mitigation:** the radar gets **one week and is not permitted to expand.** The defensibility budget goes to Act II, the honesty framework, and the export card.

---

# H. WHAT WE NEED FROM THE OWNER

Nothing below is optional. Items marked **[BLOCKER]** stop week one.

### Data and truth
1. **[BLOCKER]** The five headline figures, current, with the date they were measured: transactions, machines managed, branches, prizes delivered, machines online. And a decision: **live endpoint in phase two, or explicitly dated static?** There is no third option in this concept.
2. **[BLOCKER]** Which figures are commercially safe to publish. If today's settlement total cannot be shown, we need to know now, because the hero reads three counters.
3. A read-only aggregate endpoint spec for phase two — even a stub contract is enough to design against.

### The platform
4. **[BLOCKER]** A 40-second silent screen recording of the **real** dashboard, or access to a demo tenant plus permission to record it. Plus a list of every field that must be redacted.

### The hardware
5. **[BLOCKER]** The manufacturer's specification sheet for the terminal: dimensions, certifications, EMV / NFC levels, IP rating, connectivity, power. **Or** an explicit decision to publish no specifications.
6. Clarity on the commercial truth: does R.Pay **design**, **specify**, or **resell** the device? The copy changes materially and we will not imply engineering that didn't happen.
7. Approval of **وَتَد ٠١ / WATAD 01** as the product name, and budget for trademark clearance (KSA + GCC, classes 9 and 36).

### Rights and legal
8. **[BLOCKER]** Written logo-usage permission from all thirteen clients — or the subset we are cleared to display. Roshn, Dar Al Arkan and LuLu in particular.
9. The source and date of the SurePay / Geidea comparison, and legal sign-off on naming them.
10. CR number, VAT number, registered address, and the exact official Arabic company name.
11. A privacy policy and a decision on lead-data handling under the **Saudi PDPL** — the estimator captures personal data and this cannot ship without it.

### Brand assets
12. **[BLOCKER]** The original **vector** of the R.Pay mark. The repo has a 142×128 raster only.
13. Original vector logos from clients wherever obtainable — every one supplied saves half a day of re-tracing.

### Budget decisions, each with a date attached
14. **Licensed Arabic display face — yes or no, by end of week 1.** ~$400–1,500/yr, banded by pageviews. Recommended: TPTQ Greta Sans Arabic or 29LT Zarid Sans; free via Adobe Fonts if Creative Cloud is already held. **Fallback if no: Noto Kufi Arabic 700.** The site ships either way; it is simply better with the licence.
15. **Arabic typographer, 3 days.** Non-optional in my recommendation.
16. **Logo re-trace, 2–3 days** of design time.
17. **One half-day photography shoot** in a live venue (Boulevard, LuLu or a Roshn community) with venue permission — **or** a decision that Act II ships with zero photography. Both are acceptable. AI imagery in Act II is not.

### Sales and operations
18. **[BLOCKER]** What is actually behind `احجز جولة في غرفة التحكم`? Who runs the fifteen-minute walkthrough, on what days, with what response SLA? We are naming a concrete offer and it has to be real.
19. The venue-side proposition in the owner's own words: what does R.Pay offer a mall or a developer who hosts machines rather than owning them? Revenue share, footfall data, installation terms? **This content does not exist anywhere in the current site and Act II needs it.**
20. WhatsApp Business number, direct sales phone, sales email, and the CRM or webhook endpoint the form posts to. Two routes: operator leads and venue leads.
21. A pricing decision for `/الأسعار` — real numbers, ranges, or a "how we price" page. Any of the three works; silence does not.

### Content
22. **[BLOCKER — and the single highest-value input in the project]** **Thirty minutes each with three real customers**, recorded, answering: what did you worry about before R.Pay, what do you check first every morning, and what nearly stopped you buying. Section 02 — الأسئلة الأربعة — is where this deal closes, and it must be their words, not ours.
23. Final approved Arabic wording for the mission and the vision.
24. Who writes and approves the English locale.

### Governance
25. **One named decision-maker with authority to approve**, and a standing weekly review. Eight concepts were built before this one. That did not happen because the work was wrong; it happened because nobody was empowered to say yes.

---

**Build the bridge. Turn the lights on in the middle. Ship the truth with a timestamp on it.**