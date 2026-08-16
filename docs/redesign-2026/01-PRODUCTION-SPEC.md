# R.Pay — Final Production Recommendation

**Date:** 16 August 2026
**Status:** Decision document. Awaiting go/no-go, then implementation begins.
**Supersedes:** the direction section of `00-BRIEF.md`. Research in `research/` stands.

---

## 0. The Bridge, pressure-tested

I put the concept against the ten questions before committing. It passes nine outright. The
tenth exposed a real weakness, and fixing it produced the idea that makes this whole thing work.

| Question | Verdict |
|---|---|
| Distinctive R.Pay identity? | **Yes — but only after the fix below.** As originally specified it was a very good dark instrument site, and "dark instrument site" is a category, not an identity. |
| Screenshot unmistakably R.Pay? | **This is where it initially failed.** See §1. |
| Communicates the product fast? | Yes. Seven seconds, plus the payment rails row at 1.6s. |
| Serves both audiences? | Yes — Act II exists for the venue owner and nothing else does. |
| Geofence memorable? | Yes. The visitor commits the theft themselves. Strongest interaction in any of the six concepts. |
| Guides toward the CTA? | Yes, with the tiering in §6. |
| Strong without excessive effects? | Yes. It is hairlines, type and two state changes. Strip the motion and the argument survives intact. |
| Impressive on mobile? | Yes, and the radar is genuinely *better* on touch than on a cursor. |
| Performant? | Yes. No hero video, no WebGL, no library. LCP is a text node. |
| Still good in six months? | Yes. Instrument and editorial aesthetics age well; glow and gradient age badly, and we are removing all of it. |

**The failure and the fix.** A cropped screenshot of the original Bridge spec showed dark navy,
cyan status dots and mono type — which is Linear, Vercel, Grafana, Datadog and forty fintech
startups. Restraint alone does not produce identity; it produces tastefulness. So I went back
for the owned form, and it was already in the hero, unrecognised.

---

## 1. FINAL CREATIVE DIRECTION

### برج القيادة — THE BRIDGE
### and its owned form: **الأفق — THE HORIZON**

R.Pay's buyer owns ninety-seven physical machines he cannot see. The product is not
information, it is **command**. So the site does not describe the control room — it hands him
the controls for ninety seconds, turns the lights on in the middle to speak to the venue owner,
then returns to the bridge to shake hands.

**The form that makes it R.Pay and nothing else:**

> A single brass horizon line carrying **ninety-seven vertical ticks** and **nine branch drops**.
> Ninety ticks cyan, seven graphite, one red.

This is not a graphic. **It is a portrait of the company, drawn from its own data.** Roshn's
site cannot use it. Geidea's cannot use it. SurePay's cannot use it — their numbers are
different, so the picture is different. It is the only mark in this project that is
simultaneously decorative, informational, and impossible to copy.

And it is fractal — the same object at every scale, which is what turns a motif into a language:

| Where | What it becomes |
|---|---|
| Hero | The full instrument. 97 ticks, 9 drops, one breach. |
| Page progress rail | The same line, compressed to viewport width, tracking scroll. |
| Section dividers | One brass hairline. Always the same line, continuing. |
| Act II (paper) | The horizon in ink, no cyan — the only element to survive Daybreak unchanged. |
| Fleet Estimator | *Your* machines appear as white ticks beside R.Pay's cyan ones as you type. |
| Footer | The horizon at rest, counters still running. |
| Favicon | Nine ticks at 32px. Legible, and unmistakably the same object. |
| OG / share image | The horizon with the day's figure. |
| Loading / empty states | The horizon, unpopulated, waiting. |

**And it grows.** At 200 machines the picture changes. The identity is literally tied to the
company's success, which no logo can claim.

That is the answer to "can a screenshot feel unmistakably like R.Pay." Crop the logo off the
hero and you are still looking at something no other company on earth can put on their website.

---

## 2. THE WOW MOMENT

Three moments, ranked by how much they will move the owner. Note that none of them is an
effect.

### 2.1 — The hero resolves into a portrait of his own business

He arrives. A brass line sits across the screen, static, finished. A cyan light runs
right-to-left and leaves ninety-seven ticks standing on it. Nine brass drops label his nine
branches. Ninety go cyan. **Seven stay grey — because seven really are offline.**

He is looking at his company, accurate, on his own homepage. The moment he understands what
he is looking at is the moment this stops being a website.

The seven grey ticks are the whole thesis. A marketing site would show 97/97. Showing 90/97 is
the single most credible thing on the page, and it costs nothing.

### 2.2 — «اسرق المكينة» — Steal the machine

Section 05. A machine sits inside a dashed geofence ring, its day's revenue ticking up. One
instruction: **«اسحب المكينة خارج نطاقها»** — *drag the machine outside its zone.*

He drags. At the exact boundary crossing, in 180ms: the ring snaps red, the machine desaturates
and dims, and **the revenue counter freezes mid-digit.** A log line stamps itself:
`٠٢:١٤:٠٧ · جهاز ٤٣ · خارج النطاق · إيقاف تلقائي`. Hold it outside and a red measuring line
extends with a live distance readout — *this is the frame he screenshots.*

Release. The machine returns over 760ms, the ring recovers over 900ms, and **the counter
resumes from where it froze — not from zero.**

That last detail is the sale. It converts "my machine died" into "my money was preserved," and
it costs one variable. Danger arrives in 180ms and leaves over 900ms; the asymmetry is the
entire emotional trick.

On the fifth drag the log prints: **«لن تملّ من هذا. ولا نحن.»** — the only joke on the site.
Humour from an instrument is disproportionately memorable.

### 2.3 — مطلع النهار — Daybreak

Halfway down, the night ends. The ground becomes warm limestone paper, the instruments stop,
the cyan disappears entirely, and the brass line — the only element that crosses unchanged —
carries the eye into daylight.

It is the cheapest moment in the plan and the least copyable, because it is structural rather
than technical. Nobody who has scrolled eight sections of black instrumentation expects the
page to open a window.

---

## 3. HERO

**No video. No loader. No intro. No spectacle before value.** Under 30 kB beyond fonts.
LCP is the headline text and it is present at first paint.

### The choreography

| t (s) | Beat | What the visitor takes away |
|---|---|---|
| **0.00** | Brass horizon at 58vh, static. Headline already set: **«كل مكينة تحت أمرك.»** R mark top-inline-end. Readout row shows `—` placeholders. **Nothing is animating.** | A finished page. In a category of moving gradients, stillness is the loudest thing in the room. |
| **0.15–1.05** | A 120px cyan light travels **right to left** at constant velocity (`linear`, no easing — machines don't ease), depositing a 1px × 14px tick every 9ms. Exits left edge. **97 ticks stand.** | Something is being counted. No label yet — curiosity is correct here. |
| **1.05–1.57** | A second hairline draws beneath with **nine brass drops**, each with a 9px mono branch label. The line becomes a *scale*: branches × machines. Three tabular readouts settle (they were in the DOM at 0.6 opacity): transactions today · machines online · settled today. Digits roll once, 180ms, linear. | This is a real instrument reading real things. |
| **1.60** | One static monochrome row on its own hairline: `mada · VISA · Mastercard · Apple Pay · stc pay · GCCNET`. No colour, no badges, no motion. | The entry objection dies before it forms. |
| **2.20–5.00** | Ninety ticks go cyan. **Seven dim to graphite.** Staggered, 120ms per state change. | Honest, not flattering. This is the credibility beat. |
| **5.00–6.40** | **The theft.** Tick 43 turns red, pulses at exactly 1 Hz. A hairline leader draws to one stamped log line. | R.Pay does not just report — it *acts*. |
| **6.40** | Tick returns cyan. Log stamps `أُعيد التشغيل`. **The horizon goes still and the page never animates unprompted again.** | Resolution. The instrument is at rest, under command. |

### Below the horizon

One ghost text link — `شاهد جولة في غرفة التحكم · ١٥ دقيقة` — and the WhatsApp hairline.
**No filled button in the first 100vh.** The mint CTA appears the instant the rail docks, which
is the correct behaviour: an operations rail with no action on it is not an operations rail.

### Interaction, not just animation

The hero is **hoverable and tappable from t=0**. Point at any tick and it reports: branch,
machine ID, status, today's take. This is the difference between watching control and having it.
The visitor who touches a tick in the first ten seconds has already used the product.

### Degradation, art-directed rather than disabled

- **`prefers-reduced-motion`** — every tick is present at first paint in its final state,
  including the red one. The log line is already stamped. The *information* is identical; only
  the choreography is absent. This is why the concept survives §8's acceptance test.
- **JS fails / slow device** — the SVG horizon is server-rendered complete. The hero is
  meaningful with zero JavaScript.
- **`deviceMemory <= 4`** — state changes become instant swaps rather than transitions.

### Transition into section 02

No fade, no gap. The horizon **descends** — as the visitor scrolls, the hero's brass line
travels up and docks as the page progress rail, and the four questions rise beneath the line it
just vacated. One continuous object. The page never "starts a new section"; the instrument
simply moves.

---

## 4. EXPERIENCE FLOW

Fifteen sections, three acts, one continuous brass line.

**Change from the earlier draft:** UI/UX Pro Max's `trust-authority-conversion` pattern puts
proof at position two (`Hero > Proof > Solution > CTA`), and my structure had the client
manifest at section 09. That is a real conversion error, so proof is now split: a compressed
signal early, the full manifest in daylight where it belongs tonally.

### ACT I — الجسر / THE BRIDGE · night `#040F1E`

| # | Section | Job | Beat |
|---|---|---|---|
| 01 | **الجسر** — hero | Establish a command environment; rails handled | Alertness |
| 02 | **الأسئلة الأربعة** — the four questions | His own 11pm anxieties, each answered by one behaviour. **Zero effects, zero icons, zero cards.** Warmest surface in the night act. **This is where the deal closes.** | *He has run this business* |
| — | *proof strip* | **NEW.** One hairline: `مثبّتة في` + three strongest venue names, single-ink, static. Two seconds of credibility at the point of maximum doubt. Full manifest deferred to §09. | Reassurance |
| 03 | **خط المال** — the money line | Kill the middleman. Two scrubbed lines; R.Pay's runs straight in 400ms, the comparison detours through a grey box marked `وسيط` and **pauses**. The pause is the argument. | Relief, then irritation at the status quo |
| 04 | **الريال الذي عاد** — the riyal that came back | A payment fails. The rail turns amber. The money **reverses direction on its own** and goes home. Twelve seconds. Nobody clicked anything. | Trust. No competitor can show this |
| 05 | **الرادار** — the geofence | **Signature.** He commits the theft himself | Delight → unease → safety → a laugh |
| 06 | **الأسطول** — the fleet | The hardware is real. **وَتَد ٠١** named, one dimensioned orthographic plate, three machine classes as ≤340px chips, one sensor-feed inset | Solidity |
| 07 | **اللمسة** — the approval | The 72-frame sequence, scrubbed, locking on **تمّت**. The site's only warm, full-fidelity image | Satisfaction — the one human moment |
| 08 | **السجل** — the ledger | The real numbers, each with a provenance chip. They count **once** and never again. The 9,434 prizes get their own line — the most human number the company owns | Weight |

### — مطلع النهار / DAYBREAK —

### ACT II — النهار / DAYLIGHT · paper `#F2EFE9`

| # | Section | Job | Beat |
|---|---|---|---|
| 09 | **الموانئ** — where it's installed | Not a logo wall. A right-aligned Arabic **manifest** — venue, city, deployment class — reading like a shipping register | *These people already decided* |
| 10 | **المقارنة** — the timetable | Swiss comparison. Solid 6px ink dot = yes, hollow ring = no. **No colour anywhere.** One full column beside two nearly empty ones | Superiority, unspoken |
| 11 | **لِمن نعمل** — who this is for | **The venue owner, finally addressed.** Mission and vision at 62ch with enormous air, then the host proposition | *There is a version of this for me* |
| 12 | **الأسئلة الشائعة** — FAQ | Settlement window, onboarding, contract, SLA, offline behaviour. Hairline accordion | Calm |

### ACT III — العودة / THE RETURN · night `#040F1E`

| # | Section | Job | Beat |
|---|---|---|---|
| 13 | **باسمك** — white label | Type your company name; the rail rebrands for the session. No signup | Ownership |
| 14 | **التسليم** — the handover | The **Fleet Estimator**: how many machines, how many sites, which city — and **your machines appear as white ticks on the horizon as you type**. Then submit. The page stamps a log line the way the hero did | The handshake |
| 15 | **القاعدة** — station ident | CR, VAT, address, phone, hours. Brass hairlines. Counters still ticking | *The grid keeps running after you leave* |

Plus two flat routes outside the narrative — **`/التقنية`** and **`/الأسعار`** — fast, boring,
and reachable from the tick index. The film converts believers; flat pages serve auditors.

---

## 5. TWO-AUDIENCE STRATEGY

The audiences are separated by **act**, not by a toggle or a tab. Nobody is asked to self-select
before they know what the company does.

### Audience 1 — the OPERATOR (owns the machines) · Act I

- **Must understand:** money reaches him directly, he can see every machine live, and nobody can
  move or steal a machine without it shutting itself down.
- **Trust comes from:** the seven offline machines shown honestly, provenance dates on every
  figure, a real dashboard recording rather than a mockup, and the refund happening without a
  support ticket.
- **Explores further because:** the hero is interactive from t=0 and the radar invites him to
  break something.
- **Converts on:** `احجز جولة في غرفة التحكم` — a 15-minute walkthrough. Peak intent is
  immediately after the radar.

### Audience 2 — the VENUE / BUSINESS OWNER (hosts machines) · Act II

Roshn, Boulevard, LuLu, a mall's procurement lead. **This audience has never been addressed by
any version of the site.** They do not care about fleet telemetry; they care about revenue,
footfall, liability and how much of their problem this becomes.

- **Must understand:** what installing R.Pay machines does for their venue — revenue share,
  footfall data, who handles installation, maintenance and cash, and what happens when something
  breaks at 9pm on a Thursday.
- **Trust comes from:** the manifest of peers who already did it, the daylight register (calm,
  documentary, zero instrumentation), and a named contract position.
- **Converts on:** `استضِف مكائن في موقعك` — a different CTA, a different inbox, a phone number
  rather than WhatsApp, because venues call.

### Convergence

They converge at **section 14**, but by different routes and with different form defaults.
The Estimator asks how many machines you own; a venue answering *zero* is routed to the venue
lane automatically. **One form, two funnels, separate analytics.** Reviewed at 30 days — if
venue-side conversion is zero, section 11 gets rewritten, not the whole act.

---

## 6. CTA STRATEGY

**One verb, three tiers, and nothing competes with the headline.**

### Tier 1 — Primary: `احجز جولة في غرفة التحكم` (Book a control-room tour)

Not "contact us." A concrete, scarce, fifteen-minute offer. Filled mint (`--settled`), the only
filled button in the night acts.

**Appears exactly three times**, always immediately after peak conviction:

1. **After the radar (§05)** — peak emotional intent on the entire page.
2. **After the ledger (§08)** — peak rational intent, right before the act break.
3. **The Estimator (§14)** — the handover.

### Tier 2 — Venue lane: `استضِف مكائن في موقعك`

Filled ink on paper, Act II only. Separate inbox, separate SLA, phone-first.

### Tier 3 — Persistent, never animated

WhatsApp on the docked rail, hairline only, 44×44 minimum, `inset-inline-end`, safe-area aware.
Saudi B2B closes on WhatsApp; pretending otherwise is design vanity. It **yields** — hides when
the closing CTA is on screen so nothing contests it.

### Conversion logic

- **No filled button in the first 100vh.** The hero carries one ghost link. The mint CTA arms
  the instant the rail docks.
- **Context immediately before every CTA is a demonstration, never a claim.** The radar precedes
  the primary CTA; you ask after you have proven, not before.
- **The form is the demo.** Five fields max — الاسم · الشركة · عدد المكائن · المدينة · واتساب.
  Machine count is a segmented control (1–5 / 6–20 / 21–50 / +50) which silently qualifies the
  lead, and it drives the horizon preview, so filling it in is a reward rather than a toll.
- **After submit:** the page stamps a log line in the hero's own visual language —
  `تم استلام الطلب · سيتم التواصل خلال ٢٤ ساعة` — plus an instant bilingual WhatsApp
  acknowledgement. The journey ends inside the world it started in.

---

## 7. DESIGN LAWS

Seven. Each is falsifiable, lint-enforceable, and applies everywhere.

**L1 — Cyan means live.**
Never a border, button, heading or decoration. If it is cyan it is reporting real state.
≤12 consuming nodes site-wide. In Act II there is no cyan at all, because in daylight nothing
needs a status light.

**L2 — The horizon is the brand.**
Every section sits on, hangs from, or continues one brass line. It is never interrupted, never
gradient, never glowing. It is the progress rail, the divider, the scale, the ledger rule and
the logo. It animates by **length only** — never opacity, never blur.

**L3 — Nothing moves unless it is reporting.**
Motion means system activity. There is no decorative animation anywhere. If a movement cannot
be traced to a state change or a user action, it is cut. Corollary: **the page never animates
unprompted after the hero resolves.**

**L4 — Every number carries its date.**
No figure appears without a provenance chip. Any simulation is labelled as one. This is what
separates competence from theatre, and it is the law that makes the whole concept survivable.

**L5 — Night commands, daylight explains.**
Act I is instrumentation. Act II is documentation — no instruments, no telemetry, no cyan, no
motion beyond a rule drawing. Brass is the only element that crosses unchanged, and that is what
tells the eye it is the same company.

**L6 — One verb, earned.**
One primary CTA verb site-wide. It never appears before a demonstration. Nothing else is ever a
filled button.

**L7 — Arabic is drawn first; Latin is cut from it.**
Arabic is authored, not translated. `letter-spacing: 0` is absolute. No Arabic ever animates
character-by-character — every "typing" effect is a mask sweep over an already-shaped line,
because appending glyphs breaks cursive joining mid-word. Arabic leading 1.75 body / 1.15
display; measure capped at 62ch.

**The falsifiable test for the whole system:** a stranger shown a 400×800 crop with the logo
removed can tell what this company sells. Run it at week 4 with five people. If it fails, the
horizon has not earned its place and we escalate it, not the effects.

---

## 8. MOTION LANGUAGE

Directed, not decorated. Every value below is a decision, not a default.

### What moves, and what never does

| Never moves | Moves on scroll | Moves on user action | Moves to report state |
|---|---|---|---|
| Headlines, body copy, the brass line's position, logos, the payment rails row, anything in Act II except a rule drawing | The money line, the approval scrub, the progress rail, the act-break ground | The radar machine, tick hover readouts, CTA feedback, the Estimator horizon, the white-label rail | Tick colour changes, the breach, counters, log lines stamping |

### Timing

```
--e-linear   linear                              machine motion: light travel, digit rolls, tick deposits
--e-report   cubic-bezier(.22, 1, .36, 1)        state resolving, machine returning     640–760ms
--e-print    cubic-bezier(.16, 1, .30, 1)        rules drawing, log lines, ledger       420ms
--e-alarm    cubic-bezier(.40, 0, .20, 1)        danger arriving                        180ms
--e-recover  cubic-bezier(.22, 1, .36, 1)        danger leaving                         900ms
```

**The governing asymmetry: danger arrives in 180ms and leaves over 900ms.** That single ratio
carries the entire emotional argument of the product.

**Duration scale:** 120 / 180 / 240 / 420 / 640 / 900 / 1400ms. Nothing else exists.
Distance determines duration; nothing is 300ms because 300ms is a default.

**Stagger:** 9ms for the 97 ticks (dense, mechanical), 60ms for ledger rows, 120ms for tick
state changes. Never more than 8 staggered children in a content group.

### The vocabulary

- **System activity** — cyan, 1 Hz pulse, linear travel. Never easing. Machines do not ease.
- **Danger** — `--e-alarm`, 180ms, red, plus desaturation of the affected object only.
- **Success** — mint, one state change, no bounce, no confetti, no scale-up. `تمّت` and nothing else.
- **Entrance choreography** — *content* reveals are one-way and never reverse (a claim that
  fades out when you scroll up to re-read it reads as broken). *Ornament, rules and parallax*
  are scrubbed and reversible.
- **Exit choreography** — sections do not exit. The horizon carries you; nothing fades out.
- **Micro-interactions** — hover raises a hairline, never a shadow, never a lift. 120ms.
- **CTA feedback** — press produces an immediate 1px inset and a mono confirmation stamp.
  No spinner under 400ms.
- **Navigation** — the tick index on the inline-end edge is tappable and doubles as progress.
  No page transitions; this is one document.

### Explicitly banned

Fade-up-on-scroll as a general mechanism, `transition: all`, parallax on any text, floating
cards, breathing glows, rotating rings, cursor followers, magnetic buttons, count-ups that
re-trigger, scroll hijacking, and anything that animates `width`, `height`, `blur` or
`box-shadow`.

### Reduced motion

Not a freeze — a **restructure**. Everything reaches its final state at first paint, including
the red tick and the stamped log. The radar remains fully draggable with 0ms transitions. The
scrub becomes five stills with the timestamps printed.

**The acceptance test, enforced in CI from day one:**
> *Remove all motion and the page is still 95% as good.*

Playwright renders every page with `prefers-reduced-motion: reduce` forced and diffs it against
the animated build. That one sentence is simultaneously a motion spec, an accessibility spec and
a performance budget.

### Sound

One dry mechanical relay knock, ~8 kB, **muted by default**, opt-in via a rail toggle that
persists. Three uses only: geofence breach, approval, form submit. A synthesised beep sounds
like a web toy; a real relay sounds like a machine. If the recording is not obtained, ship
silent — this is the most droppable item in the plan.

---

## 9. MOBILE STRATEGY

Designed first, on its own terms. Experience parity, not pixel parity.

**The hero recomposes rather than shrinks.** 97 ticks across 360px is 3.7px per tick — unreadable
and ugly. On mobile the horizon becomes **nine branch columns**, each a stack of its machines,
and the cyan light travels **down** rather than across. Same object, same information, same
seven-second beat, same red tick 43 — a portrait in portrait orientation. This is a genuinely
different composition and it is the right one.

**The radar is better on touch.** Ring diameter 78vw. Dragging a machine out of its zone with a
thumb is more visceral than with a cursor, and `navigator.vibrate(12)` fires at the exact
boundary crossing. This is the one moment where mobile beats desktop outright, and it is our
most important interaction.

**The rail docks to the bottom edge**, thumb-adjacent, and is draggable to scrub the story.
The tick index collapses to a 3px hairline on it.

**The approval scrub** drops from 72 frames to 24, decoded at `min(devicePixelRatio, 2)`, gated
behind `hardwareConcurrency >= 4 && !saveData`. Below that it degrades to five stills with the
timestamps printed, which loses very little because the timestamps are the content.

**Act II earns its place on mobile specifically.** A dark page at 40% brightness in a Riyadh
mall concourse is hard to read; the paper act is where a phone user finally relaxes.

**Type:** hero `clamp(28px, 8.5vw, 76px)`. Arabic never below 15px. All spacing in logical
properties so the LTR mirror is free. Touch targets 44×44 minimum with 8px separation.

---

## 10. TECH STACK

I re-evaluated the rejections against the final creative spec rather than defending the earlier
call. Two changed.

### Adopt

| Technology | Why |
|---|---|
| **Next.js 14 App Router, React 18, fully static** | Already the stack. `/ar` and `/en` as real locale segments, not a CSS toggle. Everything a Server Component by default. |
| **Vanilla CSS + token layer + `@layer`** | The codebase already does this well. Cascade layers fix the ordering bugs that caused the repo's top four CSS defects, and make the eventual Turbopack migration a non-issue. |
| **Native CSS scroll-driven animation** (`animation-timeline: scroll()/view()`) | Runs on the **compositor with zero main-thread cost** — decisive on a Snapdragon in a mall. Covers the majority Android path in this market. |
| **WAAPI + one shared rAF broker** as fallback | One loop for the whole page, IO-gated, paused on `visibilitychange`. ~1.2 kB. |
| **CSS custom properties + `@property`** | The radar, breach, money line and scrub are each pure functions of one or two numbers. No per-frame JS style writes. |
| **`createImageBitmap` + canvas ring buffer** for the scrub | Never `<video>` `currentTime` seeking, which stalls 200–600ms on mid-tier Android. |
| **`content-visibility: auto`** from §06 down | Large TBT win on 4-core devices. |
| **Playwright** — *already installed, Chromium present* | Reduced-motion CI gate, visual regression, and **my own visual QA loop**: I screenshot and inspect every build myself rather than guessing. |
| **`sharp` + `ffmpeg-static`** as devDependencies | The repo's own asset pipeline already used these outside the project. Bringing them in makes asset optimisation reproducible. **I will add these myself.** |

### Reject — with the reason, and the condition that would reverse it

| Technology | Verdict |
|---|---|
| **GSAP** | **Rejected — conditionally.** GSAP 3.13+ is now fully free, so licensing is not the objection; **~34 kB gz for core + ScrollTrigger on a 110 kB budget** is, and ScrollTrigger runs on the main thread where native scroll-timeline runs on the compositor. What GSAP would buy is timeline authoring convenience for the hero — but the hero is one linear sequence of 97 identical animations with computed delays, which is a `for` loop and `element.animate()`, roughly 30 lines. **Tripwire: if week 1 shows the hero choreography or the money-line scrub fighting us, we adopt GSAP core immediately and I will say so rather than hand-roll a worse timeline engine.** That is a decision with a review date, not a dogma. |
| **Three.js / WebGL / R3F** | **Rejected, firmly.** There is no 3D asset and building one is 3–4 weeks. The existing renders are 720×964, so even a pre-rendered turntable would be soft. More importantly the product is **a fleet, not a slab** — the emotional payload is ninety-seven things under command, and a rotating hero object argues the opposite. `three@0.149.0` is deleted from `package.json` on day one. |
| **Framer Motion / Motion** | Rejected. React-driven animation re-renders on a page whose animations are all CSS-variable interpolations. Wrong tool. |
| **Tailwind** | Rejected. On a site made of type and hairlines it adds a build step and class soup for zero gain. |
| **Lottie / Rive** | Rejected. Every "animation" here is generated from live data, not authored on a timeline. Rive would be right for a mascot; there is no mascot. |
| **Scroll-hijacking / smooth-scroll libraries** | Rejected. Fastest way to lose a mid-tier device. |
| **`canvas.fillText` for Arabic** | Rejected. Multi-run bidi and line-breaking are unreliable. The share card bakes Arabic into a plate and composites only Western digits. |
| **Any CMS** | Deferred. Fifteen sections of hand-set Arabic typography is not CMS work. Phase two, numbers only. |

### Budget — CI-enforced, fails the PR

```
First Load JS ≤ 110 kB      (current 87–101 kB; the whole interactive concept ~12–14 kB)
LCP ≤ 1.8s                  Moto G Power / Fast 3G — achievable because LCP is a text node
CLS ≤ 0.02 · INP < 200ms · TBT < 150ms
Lighthouse accessibility = 100
Transfer ≤ 900 kB desktop / ≤ 550 kB mobile first view
```

---

## 11. ADDITIONAL TOOLS

I checked every category you listed against what I actually cannot do today.

- **Visual QA / screenshot comparison / browser testing** — Playwright 1.61.1 with Chromium is
  already installed, and I can read the PNGs it produces. I can build, screenshot at eight
  viewports in AR and EN, and inspect the result myself. Covered.
- **Performance testing** — Lighthouse via `npx`, plus the repo's existing `perf-onetap.mjs`.
  Covered.
- **Accessibility** — `@axe-core/playwright` is a two-line devDependency I will add. Covered.
- **UI/UX reasoning** — UI/UX Pro Max, already validating decisions (it caught the proof-placement
  error in §4). Covered.
- **Image / video generation** — not used. Withdrawn on owner instruction; every mark shipped so far is code-drawn SVG.
- **Arabic typography** — no software solves this. The gap is a **human Arabic typographer**,
  which is a budget line, not a plugin.

### **NO ADDITIONAL CLAUDE CAPABILITIES REQUIRED.**

No skill, plugin or MCP would materially raise the ceiling here. The three npm devDependencies
I want (`sharp`, `ffmpeg-static`, `@axe-core/playwright`) I will install myself on approval —
they need no action from you.

---

## 12. ASSET REQUESTS

### REQUIRED — the concept cannot reach its quality without these

| # | Asset | Source | Spec |
|---|---|---|---|
| R1 | **The R.Pay mark as vector** | **You** (original file), else Illustrator re-trace | `r-mark.webp` is a 142×128 raster. The mark must be crisp at 16px in the rail and 240px on the share card. There is no vector of the company's own logo anywhere in the repo. |
| R2 | **12 client logos → single-ink SVG** | **Illustrator, manual re-trace** | Sources are 123–193px rasters. No CSS filter or auto-trace survives that. 2–3 days. Only Roshn is already vector. *Fallback if unfunded: text-only venue names, which reads almost as well in the manifest format.* |
| R3 | **Instrument line system** | **Illustrator → optimised inline SVG** | The horizon scale, nine branch drops, geofence plate with dashed ring and measuring line, money-line diagram, caliper ticks. Vector, 2–8 kB each, themeable via `currentColor` so the act break is free. This is the site's visible grid and must be drawn by hand. |
| R4 | **Machine + terminal renders graded** | **Photoshop batch action** | Desaturate ~70%, crush the AI bloom, grade into `#040F1E`, re-light the cyan reader ring on a mask. Half a day. Turns "AI product render" into "schematic". **Do not re-render in 3D** — 720×964 is sufficient at every size we use. |
| R5 | **Night grain tile** | **Photoshop** | 128×128 monochrome PNG ≤3 kB, tiled, `position: fixed`, 0.8% opacity. This is what stops `#040F1E` reading as cheap CSS black. |

### HIGH-VALUE — noticeably better, not blocking

| # | Asset | Source | Spec |
|---|---|---|---|
| H1 | **Real dashboard capture, 40s silent** | **Screen recording + After Effects** | The Tier-1 CTA promises a control-room tour; sceptics will want the real thing. AE only masks customer data and adds sensor chrome. **A mockup here would destroy the honesty framework the whole concept rests on** — if we cannot get the real recording, we show nothing. |
| ~~H2~~ | ~~Three sensor-feed loops~~ | ~~AI video~~ | **STRUCK 16 Aug 2026 — owner instruction: Higgsfield is not to be used. If ambient footage is ever wanted it comes from a real camera or it does not ship.** |
| H3 | **وَتَد ٠١ orthographic plate** | **Illustrator line art** | A technical drawing, not a render. Cheapest possible "we make a thing" signal. **Every dimension must come from a supplier document** — no invented specs. |
| H4 | **Share-card background plate** | **Illustrator + Photoshop export** | 1080×1350 WebP ~60 kB with all Arabic, the frame and the mark baked in, so runtime canvas composites only Western digits. Removes all bidi risk. |
| H5 | **New Saudi Riyal glyph ﷼** | **Illustrator**, traced from the official mark | Font coverage is still patchy; a font character risks a tofu box on the most important figure on the page. |

### OPTIONAL — must not delay implementation

| # | Asset | Source |
|---|---|---|
| O1 | **One real photograph for Act II** | Half-day shoot, live venue, daylight, with permission. **This must be a real photograph** — Arabic signage, hands and mall interiors are exactly where generated imagery is caught, and being caught here poisons the credibility of everything else. *If unfunded, Act II ships with pure type and zero photography, which is a perfectly good outcome.* |
| O2 | **Relay knock audio** | Recorded, trimmed in Audition. Ship silent if not obtained. |
| O3 | **8-page كرّاس المواصفات PDF** | InDesign. Best tertiary lead magnet; reuses the Act II type system wholesale. |

### Higgsfield production request — WITHDRAWN

**Struck 16 August 2026 on owner instruction. Higgsfield is not part of this project.**
No generated asset has been used in any milestone: the horizon, progress rail, section
divider and brand mark are all SVG drawn in code.

---|---|---|---|
| **Shot** | Wide overhead of an arcade floor, machines lit, occasional figures passing | Eye-level corridor with a vending machine mid-frame, mall concourse behind | Slow push toward the terminal's reader face on a machine |
| **Composition** | Machine grid reads as a *fleet*; no single hero object | Machine on the inline-third; corridor recedes | Reader face centred, R.Pay mark legible, screen shows **logo + contactless glyph only** |
| **Camera** | Locked off, no movement — it is a security camera | Locked off | Slow dolly in, ~8% over the duration. No handheld, no shake |
| **Duration / loop** | 4s, seamless loop | 4s, seamless loop | 5s, seamless loop |
| **Lighting** | Cool ambient, practical machine glow, no lens flare, no volumetric haze | Daylight-balanced mall light, flat | Single cold key from screen-left, falloff to black |
| **Treatment** | Slightly desaturated, mild sensor noise, no colour grade toward teal | Same | Same |
| **Reference anchor** | `machine-arcade.webp` | `machine-vending.webp` | `device-terminal.webp` |
| **Page location** | §06 fleet inset | §11 venue section (Act II fallback if no photo) | `/التقنية` |
| **Why necessary** | Proves the machines exist in real venues without a shoot | Gives the venue audience a picture of hosting | Shows the hardware at a scale the 749×1000 render cannot reach |

**Hard constraints on every generation, learned from the previous manifest's rejects
("B.PAY", "CUCCI", "CERAGTOYDO"):** no legible text anywhere in frame except the R.Pay mark;
no invented brand signage; no faces in focus; no on-screen UI text; no baked headlines or CTAs;
**every frame inspected before use** with the existing `scripts/vframes.mjs`. Any clip with a
corrupted logo or invented lettering is discarded, not patched.

**No AI hero film. No AI in Act II's photograph slot. Nothing full-bleed. Nothing above the fold.**

---

## 13. BLOCKERS

Separating what stops *implementation* from what stops *launch*, as you asked.

### Blocks implementation starting: **NOTHING.**

Every section can be built now against structurally correct placeholders. The architecture that
matters — `{ value, asOf, isLive }` on every figure, `{ name, city, class, logo }` on every
venue, locale-resolved copy — is designed so that landing real content later is a **data swap,
not a rewrite.** I will mark every placeholder with a `data-pending` attribute and generate a
manifest of exactly what needs to land where.

### Blocks public launch — real, and each has a fallback

| # | Blocker | Fallback if unresolved |
|---|---|---|
| B1 | **Data provenance decision** — dated static figures, or a live endpoint later? Plus which figures are commercially safe to publish. | *No fallback. This one is genuine.* If R.Pay will not commit to either, the honesty framework collapses and we should build **Daylight** instead, which needs no live data at all. Decide this in week 1. |
| B2 | **Written logo permission** for the thirteen clients | Manifest drops to text-only venue names |
| B3 | **What is actually behind the control-room tour** — who runs it, which days, what SLA | CTA changes to a WhatsApp consultation |
| B4 | **CR number, VAT, registered address, official Arabic name, privacy policy** | None — legally required, and the Estimator captures personal data under PDPL |
| B5 | **Is R.Pay the operator, or does it serve operators?** | Copy is written neutrally until answered. **This blocks final copy, not the build.** |
| B6 | **Hardware specs from the supplier** | The وَتَد plate ships with dimensions and connectivity only, or is cut. Naming the device costs nothing either way. |
| B7 | **SurePay / Geidea comparison sourcing + legal sign-off** | Ships as "compared with common market alternatives", no names. Keep one commit away. |

### Not blockers, despite feeling like them

Act II photography, the relay audio, the spec PDF, the licensed Arabic display face, trademark
clearance on وَتَد, and the dashboard recording. Every one has a defined degradation and none
delays a single line of code.

---

## 14. FIRST IMPLEMENTATION MILESTONE

**Milestone 1 — The Horizon. Five working days.**

The whole direction lives or dies on whether the hero produces the reaction described in §2.1,
so it gets built first, in isolation, and judged before anything else exists.

**Day 0 — clear the ground.** Delete 65 MB of dead video and `three` + `@types/three`. Fix the
`.gitignore` pattern. Add the three devDependencies. Stand up the token layer and `@layer`
ordering. Vendor and subset the fonts.

**Days 1–3 — build the horizon.** The SVG instrument, server-rendered complete, at a standalone
local route. Full seven-beat choreography. Interactive tick readouts from t=0. The reduced-motion
path built *at the same time*, not retrofitted. The mobile nine-column recomposition built as its
own composition, not a media query on the desktop one.

**Day 4 — prove it on real hardware.** The breach repaint tested on an actual Galaxy A and Redmi
Note, not a throttled desktop. If the global desaturation janks, it becomes an instant swap now
rather than in week five. Lighthouse and the reduced-motion Playwright diff wired into CI.

**Day 5 — you judge it.** I will hand you:
- A local URL to run on your own machine, and the exact command.
- Playwright screenshots at eight viewports, in Arabic and English, light and dark, plus the
  reduced-motion render — saved to `docs/redesign-2026/milestone-1/`.
- Measured LCP, CLS, INP and transfer size on a throttled mid-tier profile.
- The crop test: three screenshots with the logo removed, so you can judge identity yourself.

**The go/no-go question at day 5 is exactly one thing:** *does the horizon read as R.Pay, or as
a nice dark dashboard?* If it is the latter, we escalate the form — not the effects — and I will
tell you plainly rather than proceeding on sunk cost.

Only after you approve Milestone 1 do sections 02–08 get built.

---

## What I need from you to start

1. **Go / no-go on this direction.**
2. **B1 — the data provenance decision.** The only true week-1 blocker.
3. **The R.Pay logo vector**, if it exists anywhere.

Everything else can arrive while I build.
