# R.Pay — Recovery Audit & Recommended Creative Direction

**Date:** 16 August 2026
**Status:** Awaiting owner approval. No implementation started.
**Repo state at time of writing:** `main` @ `611aa45`, clean tree, builds green.

> This is the readable master document. The visual version is `brief.html` (open it in a
> browser). The full unabridged research from both analysis panels is in `research/`.

---

## 1. Recovery report

The project was **not present** on this machine — the workspace contained only `todonado`
and `twin_cat`. It was cloned fresh from `https://github.com/ahmedmagdy1987/R.pay.git`,
so no local work existed and no destructive git command was needed or run.

| Item | Finding | Status |
|---|---|---|
| Path | `C:\Users\CCBoot\Documents\projects\r.pay` | cloned |
| Framework | Next.js 14.2.35 App Router · React 18.3.1 · TypeScript 5.4.5 strict | ok |
| Package manager | npm (`package-lock.json`) · `npm ci` → 33 packages, exit 0 | installed |
| Branch / HEAD | `main` @ `611aa45` · clean tree · up to date with origin | clean |
| Other branches | `v1-original` (`75f8eb0`, the real business site) · `concept-08-one-tap` (merged) | intact |
| Typecheck | `npx tsc --noEmit` → 0 errors | pass |
| Production build | `next build` → 12/12 routes prerendered static, First Load JS 87–101 kB | pass |
| Lint | `next lint` is declared but **eslint is not installed**; running it prompts interactively, so it was not run | absent |
| Environment | **No `.env*` files exist and none are required.** Only `NEXT_PUBLIC_SITE_URL` is read (`app/layout.tsx:33`) and it has a fallback | none required |
| Security | 3 high advisories, all from the Next 14.2.x tree (`next`, `postcss`, `nanoid`). Fix requires Next 16 — breaking | deferred |

### The one thing worth fixing immediately

**65 MB of dead video is being deployed.**

- `public/assets/flow/master.mp4.part00`, `.part01`, `.part02` — 44 MB
- `master.mp4.part00` at the repo root — 20 MB, **byte-identical** to the flow copy (md5 verified)

Nothing in the codebase references any of them. They are a split archive of a 4K HEVC source,
committed to work around GitHub's 100 MB file limit. `.gitignore` excludes the reassembled
`master.mp4` but not the `.part*` chunks, so they ship to Vercel. Deleting them takes
`public/` from 55 MB to roughly 11 MB.

### Design tooling

```
UI/UX Pro Max: READY   — verified operational, search engine returns real data
Figma MCP:     BLOCKED — connected and authenticated, but cannot author
Higgsfield:    READY   — Ultra plan, 1,774 credits
```

**UI/UX Pro Max** works. Its GSAP, Three.js and palette data are real and useful. Two honest
caveats: an RTL/Arabic query returns only generic layout rules, so it has **no Arabic-specific
guidance**; and its stock recommendation for "payment technology premium" was gold-and-purple
Swiss minimalism, which is wrong for this brand. Treat it as a validator, not an art director.

**Figma** authenticated as `filmingfuture1@gmail.com`, but the account is a **View seat on a
Starter-tier team**. A View seat cannot edit files; Starter has no library publishing and no
multi-mode variables. Every write tool (`use_figma`, `create_new_file`) will be rejected.

---

## 2. What R.Pay actually is

This was the most valuable finding of the audit, and it is **not** what the current homepage
says. The company could not be verified externally — a web search surfaces only an unrelated
"R Pay Wallet" product — so everything below is drawn from the code, chiefly the
`v1-original` branch, which is the real business site rather than a concept.

R.Pay sells **two things as one system**: payment acceptance hardware fitted to unattended
machines, and the operations platform the owner uses to run them. It is not a payment gateway.
The buyer is an operator who owns physical machines full of his money that he cannot see.

### Differentiators, per the comparison table on `v1-original`

Claimed against named competitors SurePay and Geidea, who are shown as having only the last row:

- Direct settlement to the owner/operator account, no middleman
- Automatic refund on failed payment, no human intervention
- **GPS geofence** — a device leaving its zone triggers an alert and automatic shutdown
- Inventory and prize management, each prize linked to a device
- Remote add/remove of devices
- Remote training and support
- White-label option
- Real-time dashboard

### Verified figures

```
465,255 transactions · 97 machines managed · 9 branches
9,434 prizes delivered · 90 of 97 machines online
Rails: mada, VISA, Mastercard, Apple Pay, stc pay, GCCNET
```

### Customers — the strongest asset the company has

From `lib/assets/logos.ts`: Roshn (PIF giga-developer), Dar Al Arkan, LuLu, Boulevard City,
Boulevard World, Sela, Al Khozama, Kinan, Hamat, Malahi, Al Nadej, Al Deera, Shawarma House.
Named deployments in copy: Saffori Land, Sparky's, VR Games Zone.

> **The insight that changes the brief:** most of those logos are **venues, not operators** —
> developers and malls that *host* machines rather than own them. R.Pay has **two audiences**,
> and every one of the eight existing concepts addresses only one. Serving the venue owner is
> a hole in the current site, not a refinement of it.

---

## 3. Why the previous work never produced a "wow"

The diagnosis is not that the work was bad. **The engineering is genuinely top-tier** — the
double-scrollbar root-cause analysis, reduced-motion handling that never mounts a video
element at all, correct bidi discipline, LCP around 140 ms. The problem is elsewhere, and the
repo's own documents already identify it. From `CONCEPT_08_RESEARCH.md`:

> "Purple fintech gradients; neon everywhere; 7-layer glow stacks (the repo's `latest` hero
> documents the hierarchy collapse)."

That hero stacked an SVG payment network, two rotating orbit rings, a breathing halo, a CSS
payment card with NFC ripple and sheen sweep, a glass live-sales panel, two floating status
chips and seven-level pointer parallax — and deleted the hero video to make room.

**Three real causes:**

1. **Nine familiar moves, each executed at 8/10, average out to "competent."** Gradient-clipped
   headline, glass stat panel, radar sweep, hover-pause marquee, sticky dashboard walkthrough,
   expanding ripple, count-ups, cursor glow, magnetic buttons. All well made. Not one is
   unfamiliar. **Wow is not effects — it is proprietary form.** Crop any screen, remove the logo
   and the Arabic, and nobody can name the company or even the category.
2. **Concept 08 corrected by subtraction, which was necessary but insufficient.** It went from
   noisy to clean. Clean is not wow. Restraint without an owned form is just quiet.
3. **Nobody was empowered to decide.** Eight concepts exist because optionality replaced
   commitment. They even contradict each other on whether R.Pay *is* or *serves* the region's
   largest arcade operator.

---

## 4. Six directions considered

Two independent processes were run: a four-lens audit of the existing work (tokens, concept-08,
motion, assets, content, project history → creative director, motion designer, product designer,
frontend architect), and a six-way concept panel briefed only on verified product facts and
judged by brand, conversion and engineering panels. 21 specialist reviews in total.

| Concept | Arabic | Idea | Outcome |
|---|---|---|---|
| **The Bridge** | برج القيادة | The site *is* the control room. Hand the operator the instruments for 90 seconds. | **Selected** |
| One Riyal | ريال واحد | Follow a single riyal from a child's thumb to the operator's bank account. | Runner-up, grafted |
| Daylight | النهار | The only white site in a category of dark navy and cyan glow. Swiss, typographic, effect-free. | Grafted as Act II |
| Al-Wasl | الوَصْل | Own one drawn stroke — the kashida — as join, rule, ledger line and receipt. | Grafted, font-dependent |
| Silent Grid | الشبكة الصامتة | Invisible national infrastructure made visible. Machines as nodes on a live map. | Two ideas taken |
| Axis | المِحوَر | The terminal as a desirable industrial object, named and specified. | Naming idea taken |

**Axis died on a measurement.** The machine renders on disk are 720×964 and the terminal is
749×1000 — full-bleed hardware worship is physically impossible without a 3D pipeline nobody
should fund.

**Al-Wasl was the most beautiful idea**, and it is what I would pick in a world with a
commissioned Arabic typeface. Its own author named the risk correctly: a bare 1px rule is the
most generic element in web design, and without drawn Arabic you arrive at *clean* again —
which is exactly where concept 08 already sits.

---

## 5. The recommendation — The Bridge / برج القيادة

R.Pay's buyer is awake at 11pm asking four questions: is my money reaching me, is machine 43
working right now, has someone moved it, and what did I actually make today. Every competitor
answers those with a brochure. A brochure is the wrong instrument, because the product is not
information — it is **command**. So we do not describe the control room. **We hand him the
controls for ninety seconds.**

### And then we turn the lights on

Halfway down, **the night ends**. The instruments stop, the page becomes paper in daylight, and
the same company that just showed you a fleet under command shows you a printed document: who
already installed it, how it compares, and what it does for the venue that *hosts* machines
rather than owning them. Then the sun goes down and we return to the bridge to shake hands.

That two-act shape does four jobs at once, which is why it beat a prettier idea:

- It is the **leap** — old and new are incomparable at thumbnail size.
- It gives the **second audience** (Roshn, Boulevard, a mall's procurement lead) a room they can
  breathe in.
- It solves **dark-palette legibility** on a cheap phone at 40% brightness in a Riyadh mall.
- It is the **surprise**. Nobody who has scrolled eight sections of black instrumentation
  expects the page to open a window.

### Why this and not Al-Wasl

**Every dependency of The Bridge is code.** No photo shoot, no 3D pipeline, no typeface
procurement blocking week one. Al-Wasl cannot start until a licensed or commissioned Arabic
face lands — and type is the longest-lead item in the project. The Bridge ships without it and
gets *better* with it. That is the difference between a plan and a coin flip.

Both processes converged independently on the same conclusions: kill the hub, delete the dead
video, no gradients, no fake dashboards, real artifacts with timestamps. Where they converged,
confidence is high. Where they diverged, I took The Bridge's architecture and grafted Al-Wasl's
best object into it: **the receipt** — وصل, which in Arabic means both *the join* and
*the receipt*. It lives on paper in Act II and needs no disclaimer, because it is true.

### The one law that carries everything

**Cyan means live.** Never a border, never a button, never a heading, never decoration. If
something is cyan, it is reporting real state — twelve consuming nodes site-wide,
lint-enforced. Rationing is what makes it read as competence instead of ornament. In Act II
there is **no cyan at all**, because in daylight nothing needs a status light.

### The falsifiable acceptance test

A stranger shown a 400×800 screenshot with the logo cropped off can tell what this company
sells. If they can't, we haven't shipped it.

---

## 6. The direction, specified

### The hero — seven seconds, no video, no loader

Under 30 kB beyond fonts. **LCP is the headline text, present at first paint.** A brass hairline
runs the viewport width at 58vh — a horizon, static, already there. The headline is already set:
**كل مكينة تحت أمرك.**

| t | What happens |
|---|---|
| 0.00 | Nothing is animating. In a category of moving gradients, a page **finished on arrival** is the loudest thing in the room. |
| 0.15–1.05 | A cyan light travels **right to left** along the horizon, depositing a tick as it passes each position. It exits; **97 ticks stand on the horizon.** No label yet — the visitor is curious, which is correct. |
| 1.05–1.57 | A second hairline draws beneath with nine brass drops marking the nine branches. The line becomes a **scale**. Three tabular readouts settle. |
| 1.60 | One static monochrome row: mada · VISA · Mastercard · Apple Pay · stc pay · GCCNET. The entry objection dies before it forms. |
| 2.2–5.0 | Ninety ticks go cyan. Seven dim to graphite. **Honest, not flattering.** |
| 5.0–6.4 | **The theft.** Tick 43 turns red and pulses at 1 Hz. A leader draws to one stamped log line: `٠٢:١٤:٠٧ · جهاز ٤٣ · خارج النطاق الجغرافي · إيقاف تلقائي` |
| 6.40 | Restored. The horizon goes still and **the page never animates unprompted again.** |

No filled button in the first 100vh — one ghost link only. The mint CTA appears the instant the
rail docks.

### Structure — fifteen sections, three acts

**ACT I — الجسر / The Bridge** (ground `#040F1E`)

| # | Section | Job |
|---|---|---|
| 01 | الجسر · The bridge | Hero. This is a command environment. |
| 02 | الأسئلة الأربعة · Four questions | His own 11pm anxieties, each answered by one behaviour. **Zero effects. This is where the deal closes.** |
| 03 | خط المال · The money line | Kill the middleman. Two scrubbed SVG lines; the competitor's **pauses** at a grey box. The pause is the argument. |
| 04 | الريال الذي عاد · The riyal that came back | A payment fails. The money **reverses direction on its own** and goes home. Twelve seconds, no click. |
| 05 | الرادار · The radar | **Signature.** Drag the machine out of its zone yourself. |
| 06 | الأسطول · The fleet | The hardware is real. Named **وَتَد ٠١**, one dimensioned orthographic plate. |
| 07 | اللمسة · The approval | The 72-frame WebP sequence, scrubbed, locking on **تمّت**. The one human moment. |
| 08 | السجل · The ledger | The real numbers, each with a provenance chip. |

**— مطلع النهار / DAYBREAK — the ground turns to paper —**

**ACT II — النهار / Daylight** (ground `#F2EFE9`)

| # | Section | Job |
|---|---|---|
| 09 | الموانئ · Where it's installed | Not a logo wall — an Arabic **manifest** reading like a shipping register. |
| 10 | المقارنة · The timetable | Swiss comparison. Solid ink dot = yes, hollow ring = no. **No colour.** |
| 11 | لِمن نعمل · Who this is for | **The venue owner, finally addressed.** Separate CTA, separate inbox. |
| 12 | الأسئلة الشائعة · FAQ | Settlement window, onboarding, SLA. No theatre. |

**ACT III — العودة / The Return** (ground `#040F1E`)

| # | Section | Job |
|---|---|---|
| 13 | باسمك · White label | Type your company name; the rail rebrands for the session. |
| 14 | التسليم · The handover | Not "contact us". A Fleet Estimator where **your machines appear on the rail as you type.** |
| 15 | القاعدة · Station ident | CR, VAT, address, phone. Counters still ticking. |

### Colour

**Night (Acts I & III)**

```
--hull      #040F1E   page ground (kept from the existing brand)
--deck      #0A1826   raised instrument surfaces — exactly two elevation steps
--hairline  #16283A   every divider, 1px, never a shadow
--brass     #C8A96B   structural instrument detail: rules, scales, numerals, the horizon
--signal    #00AEEF   LIVE ONLY, ≤12 consuming nodes, lint-enforced
--settled   #1FD3B8   money arrived — the only filled button on night pages
--breach    #FF4D4D   used exactly twice on the whole site
--ink       #E8EFF6   body text, 13.8:1 on hull
--ink-muted #9FB0C2   secondary, 8.4:1 — never lower
```

**Paper (Act II)**

```
--paper     #F2EFE9   Riyadh limestone, warm not white so the ink sits
--rule      #CFC9BC   every hairline on paper
--ink-dark  #12110F   all type, and the filled CTA
--brass-ink #7A5F2B   the warm structural line, carried across the act break
```

The brass is the anti-generic move. Every payments site in this region is cool-toned; a warm
1px hairline system gives the page a temperature nobody else has, at zero runtime cost, and it
is **the one element that survives the act break unchanged** — which is what tells the eye that
the paper section is the same company and not another site.

**Retired outright:** every gradient, every blur, every glow, all glassmorphism, all drop
shadows. `box-shadow` may appear exactly once in the codebase: the bezel highlight on deck
surfaces.

### Typography

- **Body and UI: Readex Pro 400/600** — already on disk (47.5 kB subsetted)
- **Telemetry, numerals, log lines: IBM Plex Mono 400/500** — already on disk, tabular figures.
  Mono reads as machine-generated, therefore true.
- **Display, two tracks:** ship on **Noto Kufi Arabic 700** day one; upgrade to licensed
  **TPTQ Greta Sans Arabic** or **29LT Zarid Sans** when funded. Free via Adobe Fonts
  (Myriad Arabic) if Creative Cloud is already held.
- **Not adding IBM Plex Sans Arabic.** Three Arabic families is one too many.

Total font budget ~112 kB, two preloaded, `size-adjust` metric-matched fallback.

**Two non-negotiable rules:**

```css
:lang(ar), [dir="rtl"] { letter-spacing: 0 !important; }
```

Latin tracking severs cursive joining and instantly marks a site as foreign-made. And **no
Arabic text is ever revealed character by character** — that breaks cursive joining mid-word.
Every "typing" effect is a `clip-path` or mask sweep over an already-shaped line. Latin mono log
lines may type per character; Arabic never does.

### Motion, scroll and performance

**No animation library.** Native CSS scroll-driven animations (`animation-timeline: scroll()/view()`)
where supported — the majority Android path in this market, running on the compositor with zero
JS. One shared rAF broker as the fallback, never one loop per component. Web Animations API for
the hero stagger only. CSS custom properties with `@property` for all interpolable state.

Five client islands — Broker, Rail, Radar, Scrub, Estimator — each `dynamic(..., { ssr: false })`
behind an IntersectionObserver. ~14 kB gzipped total.

The frame scrub uses `createImageBitmap` into a canvas ring buffer capped at 24fps, never
`<video>` `currentTime` seeking, which stalls 200–600 ms on mid-tier Android.

**Rejected on evidence:** GSAP, Framer Motion, Lenis, Tailwind, all WebGL/3D, `three@0.149.0`
(unused, ~600 kB), scroll hijacking, `backdrop-filter`, animated blur, `DeviceOrientationEvent`
tilt, `canvas.fillText` for Arabic (bidi is unreliable).

**CI-enforced budget — fails the PR, not production:**

```
First Load JS ≤ 110 kB        (current pages 87–101 kB)
LCP ≤ 1.8s on Moto G Power / Fast 3G
CLS ≤ 0.02 · INP < 200ms · TBT < 150ms
Lighthouse accessibility = 100
Homepage transfer ≤ 900 kB desktop, ≤ 550 kB mobile first view
```

**The best single test in the plan**, borrowed from the Daylight concept:
**"remove all motion and it is still 95% as good."** Playwright is already a devDependency —
it renders every page with `prefers-reduced-motion` forced and diffs against the animated build.
That one sentence is simultaneously a motion spec, an accessibility spec and a perf budget.

### Mobile

Designed on its own terms, not scaled down. The rail docks to the bottom edge; the tick index
collapses to a 3px hairline; the radar is **better on touch** — dragging a machine out of its
zone with a thumb is more visceral than with a cursor, with a haptic tick at the boundary
crossing. Act II exists partly *because* of mobile: a dark page at 40% brightness in a mall
concourse is hard to read.

### The three signature moments

1. **اسرق المكينة — Steal the machine.** Drag the machine outside its geofence. The ring snaps
   red, the render desaturates, and the day's revenue counter **freezes mid-digit**. Release it
   and the counter resumes *from where it stopped, not from zero* — which converts "my machine
   died" into "my money was preserved." That is the actual sale, for the cost of one variable.
   The fifth attempt earns the only joke on the site: «لن تملّ من هذا. ولا نحن.»
2. **الريال الذي عاد — The riyal that came back.** Its own section, its own silence. A payment
   fails and the money travels backwards on its own. No competitor can show this.
3. **مطلع النهار — Daybreak.** The act break itself. The cheapest and least copyable moment in
   the plan, because it is structural rather than technical.

Note what is deliberately *absent*: no hero video, no 3D, no WebGL, no particles, no gradient.
Every one was available and every one was rejected on evidence.

---

## 7. Tools

### Figma — yes, but sequenced, and it needs an upgrade

Figma should **not** lead. There is no Figma library in this project; every decision to date was
made in CSS and verified by screenshot. Making Figma the source of truth for a compositor-timed
animation wastes weeks and produces a document that is wrong the day it is signed.

1. **Code is the source of truth.** Tokens live in the repo, pushed **one-way** into Figma
   Variables. (1–2 days)
2. **Generate the library from the tokens** — about nine components: Button, Card, Eyebrow,
   Rule, StatBlock, Receipt, Marquee, StickyCTA, Footer. Every one needs an **AR and an EN
   variant** bound to `dir: rtl | ltr` variable modes, because Arabic runs 20–25% shorter and
   takes different leading. A library built only in Latin produces designs that break in the
   primary language. (3–5 days)
3. **Code Connect last**, so Dev Mode shows real JSX and real token names. ~20 min per component
   thereafter — the cheapest governance available. (1–2 days)

Figma holds the storyboard and the composed stills. It does **not** hold the radar, the scrub or
the act break.

> **Blocker:** the Figma account is a **View seat on a Starter team**. It cannot edit files,
> publish libraries, or use multi-mode variables — all three of which the plan needs.
> **Figma Professional with a Full/Edit seat** is required. Until then, reading works; authoring
> does not.

### Higgsfield — yes, but narrowly

Ultra plan, 1,774 credits, and the repo shows the pipeline already worked (~430 credits, all
image-to-image against canonical renders). But `HIGGSFIELD_ASSET_MANIFEST.md` is also a
confession — rejected generations included a reader label corrupted to **"B.PAY"**, invented
storefront lettering reading **"CUCCI"**, garbled Arabic screen text that shipped in v1 and had
to be regenerated, and a Cinema Studio hero take rejected for producing the exact "terminal in a
neon ring" cliché the brief banned.

So: **no AI hero film.** The one honest use is **320×180 sensor-feed loops** — inside a
surveillance frame with a timecode, generated footage reads as a camera feed and its artefacts
are invisible at that size. Zero to three clips, ≤250 kB each. Never full-bleed, never above the
fold. Reusable Higgsfield media IDs for the canonical renders are recorded in the existing
manifest.

### Adobe — yes, and specifically

| App | Deliverable | Why |
|---|---|---|
| **Illustrator** | 12 client logos re-traced to single-ink SVG | They are 123–193px rasters. No CSS filter or auto-trace survives that. **2–3 days, the one unavoidable production cost.** |
| **Illustrator** | The R.Pay mark as vector | The repo has a 142×128 raster only. There is no vector of the company's own logo. *Supply the original first if it exists.* |
| **Illustrator** | Instrument line system, وَتَد orthographic plate, the new ﷼ glyph | The site's visible grid, drawn by hand. The riyal mark must be inline SVG — font coverage still risks a tofu box. |
| **Photoshop** | Grade machine renders into the hull palette; 128×128 grain tile | Half a day. Turns "AI product render" into "schematic." **Do not re-render in 3D** — existing resolution is sufficient for every size used. |
| **After Effects** | Redaction, timecode and sensor chrome on a real dashboard recording | AE only masks customer data. The recording itself must be real. |
| **InDesign** | 8-page كرّاس المواصفات spec booklet | The site presents itself as an instrument, so of course there is a manual. Best tertiary lead magnet available. |
| **Audition** | One dry relay knock, ~8 kB, muted by default | A synthesised beep sounds like a web toy. A real relay sounds like a machine. |

**Adobe Fonts is also the cheapest path to the display face** — if Creative Cloud is active,
web licensing stops being a blocker.

### Additional skills, plugins, MCPs or libraries — none needed

GSAP, WebGL, Three.js, Rive, Lottie and every animation library were rejected on evidence, so
the tooling that would support them is unnecessary. The one thing that would genuinely help is
not software: **three days of a real Arabic typographer**. With no effects to hide behind, every
hairline and optical margin in Act II is naked. If cut, cap Act II display type at 48px where
the flaws are invisible — survivable, but a real degradation.

---

## 8. The risk that would kill this

All three judging panels named the same one independently.

**R1 — If the data feels fake, the concept inverts.**

This direction stakes everything on the visitor believing the telemetry is real. The instant
someone senses that "90 of 97 online" is decorative, the site stops reading as competence and
starts reading as **theatre** — and a payments company caught performing competence it doesn't
have is worse off than one that shipped a nice gradient.

**Mitigation, non-negotiable:** every figure carries a visible provenance chip with an `asOf`
date. The radar is explicitly labelled «محاكاة تفاعلية · لا يتم إيقاف أي جهاز حقيقي». Every
counter component takes `{ value, asOf, isLive }` from day one, so going live later is a data
swap rather than a rewrite. **If R.Pay will not commit to either a live aggregate endpoint or
explicitly dated static figures, do not build this concept** — build Daylight instead, which
needs no live data at all.

**R2 — Losing nerve on Act II.** A white section screenshots as "unfinished" out of context and
someone will ask «أين التصميم؟». Mitigation: build Act II **second, in week two**, and put the
Daybreak scroll on the owner's phone before section 03 exists. It must be *felt* as a reveal,
not evaluated as a static frame. If it truly cannot be lived with, Act II reverts to night for
the cost of one attribute — which is exactly why it was designed as four token-swapped sections
rather than a parallel theme.

**R3 — Naming SurePay and Geidea.** Comparative advertising against two larger, licensed
competitors. Every row needs a source, a date and legal sign-off, with a no-names fallback kept
one commit away.

**R4 — Fabricated hardware specs.** Publishing an IP rating or EMV level that cannot be
evidenced is a legal exposure, not a design detail. No specification ships without a
supplier document.

**R5 — Logo permissions.** Thirteen logos, several PIF-tier. Using Roshn's mark without written
permission is a letter, not a design note.

---

## 9. What is needed from the owner

**Blockers — these stop week one:**

1. **Which company are you?** Concepts 01–05 present "the region's largest arcade operator" as
   R.Pay's own credential; 07–08 reframe the identical sentence as a customer. These are opposite
   companies. If R.Pay *is* the operator, every competing operator is being asked to fund a
   competitor. Everything downstream of the homepage depends on this answer.
2. **The five headline figures, with the date they were measured** — and a decision: live
   endpoint in phase two, or explicitly dated static? Plus which are commercially safe to
   publish; the hero reads three counters.
3. **Thirty minutes each with three real customers, recorded.** What did you worry about before
   R.Pay, what do you check first every morning, what nearly stopped you buying. Section 02 is
   where the deal closes and it must be their words. **The single highest-value input in the
   project.**
4. **Written logo-usage permission for the thirteen clients** — Roshn, Dar Al Arkan and LuLu
   especially. Or drop to text-only venue names, which reads almost as well in the chosen format.
5. **A 40-second silent screen recording of the real dashboard**, or a demo tenant plus
   permission to record, plus the list of fields to redact.
6. **The vector of the R.Pay mark.** The repo has a 142×128 raster and nothing else.
7. **Figma Professional with a Full/Edit seat**, if Figma is to be in the workflow at all.
8. **What is actually behind «احجز جولة في غرفة التحكم»?** Who runs the walkthrough, on what
   days, with what response SLA? A concrete offer is being named and it has to be real.
9. **One named decision-maker with authority to approve, and a weekly review.** Eight concepts
   exist not because the work was wrong, but because nobody was empowered to say yes.

**Needed, not blocking week one:**

10. **The venue proposition, in the owner's own words.** What does R.Pay offer a mall or
    developer who *hosts* machines? Revenue share, footfall data, install terms? This content
    does not exist anywhere in the current site and Act II is built for it.
11. **The terminal's manufacturer spec sheet** — or an explicit decision to publish no
    specifications. And the commercial truth: does R.Pay *design*, *specify*, or *resell* the
    device? Copy changes materially, and we will not imply engineering that didn't happen.
12. **CR number, VAT number, registered address, official Arabic company name**, and a privacy
    policy — the estimator captures personal data and cannot ship without a PDPL position.
13. **Three budget decisions, each with a date:** licensed Arabic display face (~$400–1,500/yr,
    or free via Creative Cloud) by end of week 1 · Arabic typographer, 3 days · logo re-trace,
    2–3 days.
14. **Approval of وَتَد ٠١ / WATAD 01** as the product name, plus trademark clearance
    (KSA + GCC, classes 9 and 36).
15. **Brand voice decision.** Recommended: warm MSA throughout, one Arabic spelling («آر باي»,
    never «ار باي»), Latin "R.Pay" only in Latin contexts. Concepts 07/08 slip into Saudi
    dialect, which is warm read alone but an unowned voice read across a site.

**Optional:**

16. **One half-day photo shoot** in a live venue with permission, for the single photograph in
    Act II. If unfunded, Act II ships with pure type and no photography — a perfectly good
    outcome. **AI imagery in that slot is not**; Arabic signage, hands and faces are exactly
    where generated images get caught.
17. **Does the concept gallery survive?** Recommendation: `/design`, `noindex`, gated — or
    deleted. Keep the exploration, kill the deployment.

---

## 10. If approved — six weeks

| Week | Work |
|---|---|
| 0 | Delete 65 MB and `three`. Token layer + cascade layers. Font decision locked. Logo re-trace starts. **Owner data commitment.** |
| 1 | Hero and rail — and the breach repaint tested on a real Galaxy A and Redmi Note. If it janks, swap the approach now, not in week five. |
| 2 | The radar, the share card, and **Daybreak on the owner's phone.** |
| 3 | Money line, the returning riyal, the fleet, the approval scrub. |
| 4 | Act II in full — manifest, timetable, mission, FAQ, the venue path. |
| 5 | Estimator, white label, footer, `/التقنية`, `/الأسعار`, the PDF. |
| 6 | Performance, accessibility, Arabic typography QA, CI gates, English locale. |

Staffing: one senior frontend engineer + one designer throughout, plus 3 days of an Arabic
typographer, 2–3 days of logo re-tracing, and half a day of photography if funded.

---

## Current state of the working tree

No code has been written and nothing has been modified. The only additions are the documents in
this folder. All eight concepts remain intact on `main`; `v1-original` is untouched. Nothing is
committed.

> **Build the bridge. Turn the lights on in the middle. Ship the truth with a timestamp on it.**
