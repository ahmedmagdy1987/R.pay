

########## CONCEPT 1: COMMAND ##########
# THE BRIDGE
### برج القيادة

---

## 1. CONCEPT NAME

**THE BRIDGE** — *برج القيادة*

Not a dashboard, not a landing page. The bridge of a ship at night: every instrument lit, every system reporting, one person in command of something enormous and physical that is moving in the dark. The Arabic *برج القيادة* is immediately legible to a Saudi operator — it is the room where decisions happen, not the room where reports are read.

The live telemetry layer inside the site has its own sub-name: **المرصد / MARSAD** (the watchpost). It is the persistent rail that follows the visitor down the page.

---

## 2. THE ONE-LINE IDEA

**We don't tell the operator we can control his fleet. We hand him the controls for ninety seconds and let him feel it.**

Arabic line for the site: **كل مكينة تحت أمرك.** — *Every machine under your command.*

---

## 3. MANIFESTO

R.Pay's buyer is not a CFO evaluating payment rails. He is a man who owns ninety-seven physical machines scattered across malls, Riyadh Season destinations, and hypermarket concourses — objects full of his money that he cannot see. At 11pm on a Thursday he is lying awake asking four questions: is my money reaching me, is machine number 43 working right now, has someone moved it, and what did I actually make today. Every competitor answers these questions with a brochure. A brochure is exactly the wrong instrument, because the product being sold is not information — it is *command*. So the site should not describe the control room; it should be a room he can stand in for ninety seconds and then not want to leave. This is also the only defensible art direction R.Pay has: a competitor can clone a gradient in an afternoon, but they cannot clone a working geofence radar on their homepage, because they do not have a geofence. R.Pay's differentiators are not features to be listed — direct settlement, automatic refund, GPS geofence with automatic shutdown, prize inventory bound to a device — they are *behaviours*, and behaviours can be demonstrated. The wow is not glow. The wow is the moment the visitor realises the website is doing the thing the product does. Competence made visible.

---

## 4. THE HERO

Full-bleed. No card, no container, no hero image, no video. Weight on the wire: under 30 kB beyond fonts.

**0.0s** — Deep hull black-navy `#040F1E`. Nothing on screen but a single hairline rule in instrument brass `#C8A96B` at 58% viewport height, running the full width. It reads as a horizon. It is completely still.

**0.2s → 1.1s** — A cyan light travels **right to left** along that hairline (RTL — the sweep obeys the language). It is 120px wide, a soft linear gradient, moving at constant velocity, no easing. As it passes each position it *deposits* a vertical tick, 1px wide, 14px tall, staggered 9ms apart. By the time it exits the left edge there are **97 ticks** standing on the horizon. That is the fleet, reporting in. No label yet. The visitor does not know what they are looking at, and that is correct — for one second they are curious.

**1.1s** — The headline masks up from *behind* the horizon line — clip-path reveal plus `translateY(24px → 0)`, 520ms, expo-out. Arabic display type, enormous, calm, no letter-spacing:

> **كل مكينة تحت أمرك.**
> *ninety-seven machines. one screen. zero guessing.*

**1.6s** — Beneath the horizon, three tabular-numeral readouts fade in at 8px translate (no scale, no bounce): today's transactions, machines online, today's settlement. The digits roll once — 180ms, **linear**, no easing, because machines do not ease.

**2.2s → 5.0s (the next five seconds)** — The ticks resolve into truth. Ninety go cyan `#00AEEF`. Seven dim to graphite. Then one tick — the 43rd from the right — turns red `#FF4D4D` and begins pulsing at exactly 1Hz. A hairline leader line draws out from it to a single stamped log entry in mono type:

> `٠٢:١٤:٠٧ · جهاز ٤٣ · خارج النطاق الجغرافي · إيقاف تلقائي`
> *02:14:07 · device 43 · outside geofence · automatic shutdown*

**6.4s** — The tick returns to cyan. The log line stamps: `أُعيد التشغيل` — *restored*. The horizon goes still again.

The entire value proposition has been delivered in under seven seconds without a single sentence of marketing copy. The visitor has watched a theft get stopped.

Below the fold line, one primary CTA and nothing else.

---

## 5. SECTION-BY-SECTION STRUCTURE

**01 · THE BRIDGE** (hero, above)
*Job:* establish that this is a command environment, not a brochure. *Beat:* alertness. Something is live here.

**02 · المرصد — THE RAIL** (docks to top of viewport the instant the hero scrolls past, 44px tall, hairline-bordered)
*Job:* make the control room persistent. It carries: live counters, the current section rendered as a "channel" number (`قناة ٠٣`), a sound toggle, an AR/EN switch, and a compact primary CTA that expands at 40% scroll depth.
*Beat:* you never left the bridge. It follows you.

**03 · الأسئلة الأربعة — THE FOUR QUESTIONS**
Four instrument panels, one per operator anxiety, each stated as the operator's own late-night question in Arabic and answered by exactly one R.Pay behaviour. Hairline-divided, no cards, no icons.
*Job:* recognition. *Beat:* "he has run this business." This is the single most important section for conversion and it contains no visual effects whatsoever — pure typographic authority.

**04 · خط المال — THE MONEY LINE**
Direct settlement, scroll-scrubbed. Two lines drawn in SVG: R.Pay's runs machine → operator's bank account, straight, cyan, 400ms. The comparison line detours through a grey box labelled *وسيط* (intermediary), pauses, then continues. The pause is the whole argument. Automatic refund is shown on the same diagram as a reverse pulse.
*Job:* kill the middleman objection. *Beat:* relief, then mild anger at the status quo.

**05 · الرادار — THE GEOFENCE RADAR** (the signature moment — see §6)
*Job:* the demo. *Beat:* delight, then a flash of genuine unease, then safety.

**06 · الأساطيل — THE HULLS**
The three machine renders (vending / arcade / coffee) presented as vessel classes with spec-sheet typography: dimensions, payment rails accepted, prize module, connectivity. The six rails — mada, VISA, Mastercard, Apple Pay, stc pay, GCCNET — appear here as a single monochrome row of marks, not a colourful badge collection.
*Job:* prove the hardware is real and the acceptance is complete. *Beat:* solidity.

**07 · اللمسة — THE APPROVAL** (the 72-frame WebP sequence, scroll-scrubbed)
A hand approaching the terminal, card tap, approval. Scrubbed at 1 frame per ~14px of scroll, ending locked on the approved frame with a single mint `#1FD3B8` state change and the word **تمّت**.
*Job:* tactility — this is the one moment the site is warm and human. *Beat:* satisfaction.

**08 · السجل — THE LEDGER**
465,255 transactions · 97 machines · 9 branches · 9,434 prizes delivered · 90 of 97 online. Set as a settled instrument readout in mono tabular figures, each with a timestamp beneath it. They count **once**, on first view, then never again.
*Job:* scale proof. *Beat:* weight.

**09 · الموانئ — PORTS SERVED**
The 13 client logos, but never as a logo soup. A manifest: a right-aligned Arabic list of venue names with the mark set small and monochrome at the line's end — Roshn, Dar Al Arkan, LuLu, Boulevard City, Boulevard World, Sela, Al Khozama, Kinan, Hamat, Malahi, Al Nadej, Al Deera, Shawarma House — plus named deployments Saffori Land, Sparky's, VR Games Zone. Reads like a shipping register, not a trust badge strip.
*Job:* credibility by association with PIF-tier names. *Beat:* legitimacy.

**10 · لوحة المفاتيح — THE SWITCHBOARD** (comparison vs SurePay, Geidea)
Rows of capabilities as physical toggles. R.Pay's column: every switch thrown, cyan. The other columns: dark, one switch lit. Framed honestly as *حسب المقارنة المعلنة* — per published comparison — with a date.
*Job:* close the shortlist. *Beat:* finality.

**11 · باسمك — WHITE LABEL**
A small live toy: type your company name into a field and the entire rail at the top of the page rebrands to it for the rest of the session. One input, no signup.
*Job:* sell the white-label option by giving it away for thirty seconds. *Beat:* ownership.

**12 · التسليم — THE HANDOVER** (primary CTA section)
Not "contact us". A commissioning request: three inline questions — how many machines, which venues, which city — then send. The form is styled as an instrument panel entry, and on submit the page stamps a log line the way the hero did: `تم استلام الطلب · سيتم التواصل خلال ٢٤ ساعة`.
*Job:* convert. *Beat:* the handshake.

**13 · المِرساة — FOOTER**
Saudi company statement, CR number, address, the mission and vision lines in full, direct phone, WhatsApp, EN/AR. Quiet, brass hairlines, no more motion.

---

## 6. THE SIGNATURE MOMENT — "STEAL THE MACHINE"

**The one people screenshot.** A visitor can attempt to steal a machine, and the website stops them.

**What is on screen.** A wide plate, centred: an abstract vector floorplate — not a real map, a hand-drawn mall concourse in 1px brass lines at 12% opacity. A **geofence ring** sits over it: an SVG circle, 2px stroke, cyan, with a slow 4s linear radar sweep inside it (a conic gradient rotating, masked to the circle). At the ring's centre, a **device chip**: a 56px rounded square carrying the arcade machine render, with its ID `جهاز ٤٣` set beneath in mono. To the side, a fixed-height **log column**, six lines, monospaced, timestamped.

Above the plate, one line of instruction: **اسحب المكينة خارج النطاق.** — *Drag the machine outside the zone.*

**The interaction, precisely.**

1. Pointer down on the chip → `setPointerCapture`. Chip lifts: `transform: translateZ(0)` with a 1px brass outline appearing, 140ms `cubic-bezier(0.4, 0, 0.2, 1)`. Radar sweep speeds from 4s to 1.6s per revolution over 300ms.
2. On every pointermove, compute `d = distance(pointer, ringCentre) / ringRadius`, clamped 0–1.4. Write it to a CSS custom property `--breach` on the section root. Everything downstream is driven by that one number — no per-frame JS style writes beyond the variable.
3. **`d < 0.75`** — nominal. Ring stays cyan. Log column ticks a heartbeat line every 900ms: `اتصال سليم`.
4. **`0.75 ≤ d < 1.0`** — approach. Ring stroke interpolates cyan → amber `#F2A33C` and thickens 2px → 3px, purely via `color-mix()` on `--breach`. A dashed radial line draws from centre to chip. Log begins stamping distance readings in metres, one line per 240ms. The heartbeat interval halves.
5. **`d ≥ 1.0` — THE BREACH.** A root class `.breach` is toggled on `<html>`. This is the payload: **the entire page loses its cyan.** Every token that resolves to `--c-signal` transitions to graphite `#6B7785` over 400ms — the rail at the top, the counters, the section markers, all of it, simultaneously. A single 1px red line runs the full viewport width in 220ms linear. The chip snaps to grey and its power indicator dies. Three log lines stamp in 180ms succession:

   ```
   ٠٢:١٤:٠٧ · تجاوز النطاق الجغرافي
   ٠٢:١٤:٠٧ · إيقاف تلقائي للجهاز
   ٠٢:١٤:٠٨ · الرصيد محمي · تم تنبيه المالك
   ```

   And one large line replaces the instruction above the plate: **الجهاز الآن قطعة معدن.** — *The device is now a piece of metal.*

6. **Release.** The chip springs back to centre — 380ms, `cubic-bezier(0.34, 1.3, 0.64, 1)`, the only spring in the entire site, used exactly once, which is why it lands. On arrival, cyan returns as a **radial wash originating from the chip**, expanding to fill the viewport over 600ms (a full-screen fixed radial-gradient mask animating its radius, `pointer-events: none`, removed on completion). The rail relights. Log stamps `أُعيد التشغيل · ٠٢:١٤:١٩`.

**Why it works.** For 400 milliseconds the visitor breaks the website. Then the website heals itself in front of them. The global desaturation is the trick — the breach is not confined to a widget, it costs the whole page its signal colour, which makes the stakes feel real. It is also nearly free: one class on the root, CSS variable transitions, no library.

**Engineering notes.** Pure SVG + pointer events + CSS custom properties. Roughly 4 kB of JS. No canvas, no WebGL, no physics. `touch-action: none` on the chip only. Full keyboard path: the chip is focusable, arrow keys move it in 8% increments, Escape recentres, and the breach fires identically. Under `prefers-reduced-motion` the sweep is static, the wash is an instant swap, and the spring becomes a 200ms ease.

---

## 7. MOTION LANGUAGE

**Governing principle: instruments settle, they never bounce. Data ticks, it never eases.**

Two motion families, and mixing them is a bug:

**Instrument motion** — anything that is *chrome*: panels, headlines, reveals, the CTA.
- Settle: `cubic-bezier(0.16, 1, 0.3, 1)` · 520ms · used for every element entrance
- Section arm: `cubic-bezier(0.65, 0, 0.35, 1)` · 640ms · used for scroll-triggered composition changes
- Focus / hover / toggle: `cubic-bezier(0.4, 0, 0.2, 1)` · 140ms
- Colour-token transitions (including the breach): `cubic-bezier(0.4, 0, 0.2, 1)` · 400ms

**Machine motion** — anything that is *data*: digit rolls, log stamps, tick states, the radar sweep, the hero scan.
- All **`linear`**. Always. Digit roll 180ms. Log line stamp 180ms. Tick state change 120ms. Radar sweep 4000ms linear infinite. Hero scan 900ms linear.

**Laws.**
1. No transform-scale beyond 1.02, anywhere.
2. No element animates opacity from 0 — primary content is in the DOM and visible at paint; entrances are `translateY(8–24px)` with opacity 0.6 → 1 at most. This protects LCP and means a slow phone shows a finished page, not an empty one.
3. Exactly one spring in the entire site (the chip return). Scarcity is what makes it feel like a mechanism.
4. Nothing decorative moves. If it moves, it is reporting something.
5. Nothing exceeds 700ms except the radar sweep and the breach wash.
6. `prefers-reduced-motion: reduce` → all durations to 0.01ms except colour transitions (kept at 200ms, because they carry meaning); radar static; scroll-scrub becomes a stepped 6-frame sequence.

---

## 8. ART DIRECTION

**Colour — a night bridge, committed. No light mode.**

| Token | Hex | Rule |
|---|---|---|
| Hull | `#040F1E` | page ground, unchanged from brand |
| Deck | `#0A1826` | raised instrument surfaces |
| Hairline | `#16283A` | every divider, 1px, never a shadow |
| Brass | `#C8A96B` | structural instrument detail, rules, section numerals |
| Signal cyan | `#00AEEF` | **live only** |
| Settled mint | `#1FD3B8` | money arrived, approved, OK |
| Depth blue | `#0E6DD0` | gradients where unavoidable, chart fills |
| Attention amber | `#F2A33C` | approaching threshold |
| Breach red | `#FF4D4D` | used **twice** on the whole page: hero device 43, radar breach |
| Dead graphite | `#6B7785` | offline, and the global breach state |
| Ink | `#E8EFF6` | body text — 13.8:1 on hull |
| Ink muted | `#9FB0C2` | secondary — 7.2:1, never lower |

**The one law that carries the whole art direction: cyan means live.** It is never used for a border, a button gradient, a heading, or decoration. If something is cyan, it is reporting real state. This single restriction is what separates this from every glowing fintech site — the glow is *rationed*, and rationing is what makes it read as competence instead of decoration.

**The brass is the anti-generic move.** Every payments site in the region is cool-toned. A warm 1px brass hairline system — borrowed from marine instrument bezels and Bloomberg's amber heritage — gives the page a temperature nobody else has, at zero performance cost.

**Type.**
- **Arabic display:** *Readex Pro* (variable 200–700). Set at 300–400 weight for headlines at 48–96px. It has the geometric calm this needs and its Latin is genuinely harmonised, so bilingual lines don't fracture.
- **Arabic + Latin UI/body:** *IBM Plex Sans Arabic* (400 / 500 / 600). Engineered, terminal-adjacent, and its Arabic is properly drawn rather than adapted.
- **Telemetry, numerals, log lines, timestamps:** *IBM Plex Mono*, `font-variant-numeric: tabular-nums`, `font-feature-settings: "tnum" 1, "zero" 1`. Western digits (`0-9`), which is what Saudi operators read on their own POS reports, with Arabic-Indic as an option in the rail for the traditionalists.

**Arabic typography rules, non-negotiable:**
`letter-spacing: 0` on every Arabic element, no exceptions, enforced with a lint rule — Latin tracking severs cursive joining and instantly marks the site as foreign-made. No `text-transform`. No all-caps Arabic mimicry. `line-height: 1.75` for Arabic body (vs 1.5 Latin) to clear the descenders and the tashkeel. `text-align: start`, logical properties everywhere (`margin-inline-start`, `padding-inline-end`, `inset-inline`), `dir="rtl"` on `<html>`. Never justify. The hero scan, the radar sweep, and every progress indicator run right-to-left in AR and flip in EN.

**Texture and light.** Three textures total: (1) a 1px hairline grid at 3% opacity, visible only in the plate regions; (2) a 0.8% monochrome film grain as a single tiling 128px PNG (under 3 kB) fixed over the whole page — this is what stops the black from looking like cheap CSS black; (3) a very slight top-edge vignette on instrument panels, 1px `inset 0 1px 0 rgba(255,255,255,0.04)`, the bezel highlight. No blurs. No glows. No glassmorphism. No drop shadows anywhere on the site — depth comes exclusively from hairlines and a two-step surface elevation.

**Imagery.** The machine renders are cut out, desaturated to about 70%, and colour-graded into the hull palette so they read as schematics rather than product photos. The device/terminal render appears exactly once, at full quality, in the approval sequence — the site's only warm, high-fidelity image, and it lands because everything around it is instrumentation. Client logos are rendered at a single ink-muted value, never in brand colours. The existing AI hero films are **not used on the homepage** — they are ambient and this concept has no room for ambience; keep them for the pitch deck and social.

---

## 9. CTA STRATEGY

**Primary action: `احجز جولة في غرفة التحكم` — book a live control-room walkthrough.** Not "contact us", not "get started", not "request a demo". The offer is fifteen minutes on a screen-share with a real dashboard showing real machines. That is the only thing this buyer wants, and naming it precisely is worth more than any button design.

**Three tiers, no more.**

1. **Primary — book the walkthrough.** Appears four times: hero (once, small, beneath the readouts), the rail (compact from 40% scroll, expanding on scroll-stop), after the radar section (this is the highest-intent point on the page — the visitor has just felt the product work), and the handover section. Visually: solid mint `#1FD3B8` on hull, the only filled button on the site. Mint because mint means *settled*, and the promise is that money arrives.
2. **Secondary — WhatsApp the operations team, direct.** This market closes on WhatsApp; pretending otherwise costs real deals. Persistent, bottom-inline-start on mobile, in the rail on desktop. Ghost style, brass hairline.
3. **Tertiary — the fleet spec sheet (PDF) and a direct phone number.** In the hulls section and the footer only. For the procurement person, not the decision-maker.

The handover form asks three questions, not eight: machine count, venue type, city. Anything more and the operator, who is on a phone, standing up, closes the tab.

---

## 10. MOBILE

Mobile is not a reduction of this concept — it is arguably the truer version, because a control room in your hand is exactly the product's promise. Design mobile first and let desktop be the widescreen variant.

- **The rail moves to the bottom**, thumb-zone, 52px, safe-area inset. It carries the live counters and the compact primary CTA. It is the single most on-brand element on the phone: your fleet status, always at the base of the screen, exactly like a real operations app.
- **The hero fleet strip becomes a grid.** 97 ticks reflow into 7 rows × 14 columns of 6px squares. The scan sweep runs row by row, right to left, same 9ms stagger. It is *more* legible than the desktop line, not less — you can see the 7 dark ones instantly.
- **The radar is better with a finger.** One-finger drag on a 64px chip, `touch-action: none` scoped to the chip alone so the page still scrolls everywhere else. Haptic: a single `navigator.vibrate(12)` at the amber threshold and `[30, 40, 30]` at breach where supported. Physically dragging your own machine out of a geofence with your thumb, and feeling the phone buzz as it dies, is the moment this concept was built for.
- **Type scales properly for Arabic:** hero display drops to `clamp(2rem, 9vw, 3.5rem)`, never below `line-height: 1.6`.
- **Zero video on mobile.** No `<video>` element is ever mounted below 900px. The scroll-scrub sequence loads 24 of the 72 frames (every third), roughly 470 kB, and only after the section is within 1.5 viewports.
- **The four questions become a single-column stack** with generous hairline separation — this is the section a busy operator actually reads on a phone, so it gets the most vertical space, not the least.

---

## 11. TECH

Realistic for Next.js 14 App Router / React 18 / Vercel, on a Redmi Note-class device over 4G.

- **Everything is a Server Component by default.** Four client islands total: the rail, the radar, the scroll-scrub sequence, the white-label input. Each `dynamic(() => import(...), { ssr: false })` behind an IntersectionObserver mount with `rootMargin: '150% 0px'`. The hero is not a client island — it is server-rendered HTML plus one 1.2 kB inline script for the scan, so the headline is in the LCP paint.
- **No animation library. Ever.** CSS custom properties + `@property` for interpolable numbers + Web Animations API for the sequenced hero stagger. Scroll-driven work uses native `animation-timeline: scroll()` where supported (Chrome on modern Android, which is most of this market) with an IntersectionObserver + single shared rAF loop fallback. One rAF loop for the entire page, not one per component.
- **Delete `three@0.149.0`.** It is 600 kB of dead weight and this concept has no use for it.
- **Fonts self-hosted, subsetted.** Arabic subset (U+0600–06FF, U+0750–077F, U+FB50–FDFF, U+FE70–FEFF) + Latin basic + digits, woff2, variable where available. Readex Pro variable ≈ 42 kB subsetted; Plex Sans Arabic two weights ≈ 34 kB; Plex Mono one weight ≈ 18 kB. Preload Readex and Plex Sans only. `font-display: swap` with a metric-matched fallback so the Arabic doesn't reflow.
- **Frame sequence:** WebP decoded ahead with `createImageBitmap` into a ring buffer of 8, drawn to a canvas, capped at 24fps. Never `<img src>` swapping — that stutters badly on mid-tier Android.
- **Numbers:** a build-time JSON snapshot with a real timestamp, shipped statically. Phase two: a `revalidate: 300` route handler hitting R.Pay's own aggregate endpoint so the counters are genuinely live. Design for phase two from day one — the components take a `{ value, asOf, isLive }` shape from the start.
- **Budget, enforced in CI:** First Load JS ≤ 110 kB (up from 87–101 kB — the whole interactive concept costs about 12 kB of JS, which is the point), LCP ≤ 2.0s on Moto G Power / Fast 3G, INP ≤ 200ms, CLS ≤ 0.02. `@next/bundle-analyzer` plus a Lighthouse CI gate on the PR.
- **Effort:** roughly 4–5 weeks of one strong front-end engineer plus a designer, front-loaded on the radar and the rail. The remaining sections are typography and hairlines, which is fast to build and fast to ship.

---

## 12. RISK

**The honest failure mode: if the data feels fake, the entire concept inverts.** This concept stakes everything on the visitor believing that what they are seeing is real telemetry. The instant someone senses that "90 of 97 online" is a decorative animation rather than a fact, the site stops reading as competence and starts reading as *theatre* — and a payments company caught performing competence it doesn't have is worse off than one that just showed a nice gradient. Mitigation is non-negotiable: every number on the page carries a visible timestamp and a source label, the radar is explicitly labelled a simulation (`محاكاة تفاعلية`), and phase two wires the counters to a real aggregate endpoint. If R.Pay will not commit to real data eventually, do not build this concept.

Three secondary risks. **Daylight:** a dark instrument palette on a mid-range phone at 40% brightness in a Riyadh mall is a genuine legibility problem — mandatory 7:1 minimum on all secondary text and a "high contrast" toggle in the rail, which also happens to reinforce the control-room fiction. **The other audience:** venue owners and developers (Roshn, Kinan, Hamat) are not machine operators and may find the density cold; the four-questions section and the ports manifest must be readable as plain, warm, well-set text with zero instrumentation, giving them a calm path through the page. **The comparison table** names SurePay and Geidea — it needs a dated source line, legal review, and a rule that no claim about a competitor appears without one.

---

## 13. WHY THIS BEATS A GENERIC FINTECH SITE

A generic fintech site sells trust through *softness*: rounded cards, a lilac-to-blue gradient, a floating iPhone at a 12-degree angle, a stock photograph of a woman smiling at a card reader, and the word "seamless" four times. It works for consumer wallets because consumers buy reassurance.

R.Pay's buyer does not buy reassurance. He buys **control over physical objects that contain his cash**, and softness is the opposite signal. Show him a lilac gradient and he assumes you are a reseller.

Three concrete advantages:

**It matches the product exactly.** R.Pay is not a payment gateway — it is a fleet command system that happens to accept mada and Apple Pay. Every competitor's website looks like a payment gateway, which means every competitor's website is actively mis-selling R.Pay's actual advantage. A site that looks like the control room makes the category distinction in the first three seconds, before a single word is read.

**It is defensible.** SurePay or Geidea can copy a gradient, a headline, and a card layout inside a week. They cannot put a working geofence radar on their homepage, because they do not have a geofence. This concept's centrepiece is a moat rendered as an interaction. Copying it would require them to build the product.

**It converts on the buyer's real anxiety, not a marketing abstraction.** "Seamless payments for your business" addresses nobody. Dragging your own machine out of its zone at 2am, watching it die, and reading `الرصيد محمي` addresses the exact fear that keeps a ninety-seven-machine operator awake. That is not a design decision — that is a sales argument that happens to be built in CSS.

The wow here is not that the site is beautiful. It is that the site is **evidently, unmistakably built by people who could also build the dashboard.** For a company selling operational command, there is no stronger claim available.

########## CONCEPT 2: NETWORK ##########
# SILENT GRID
## الشبكة الصامتة

---

### 1. CONCEPT NAME
**SILENT GRID / الشبكة الصامتة**
Section-level codenames: الخريطة الحية (the live map), المسار (the flow), القَطْع (the cut), السجل (the ledger).

---

### 2. THE ONE-LINE IDEA
**The loudest machines in Saudi Arabia are run by the quietest network in the country — and this website is the first time anyone has been allowed to see it.**

Arabic line: **شبكةٌ صامتة تُشغّل أصخب المكائن في المملكة.**

---

### 3. MANIFESTO
Arcade halls are chaos: sirens, claw motors, kids screaming, tokens, prize lights. Vending machines are the same chaos with better manners. Underneath all of it there is a second layer that nobody has ever drawn — a layer where 97 machines report their status every few seconds, where 465,255 payments have already resolved, where a device that leaves its geo-zone dies in under a second, where money doesn't wander through a middleman's account but lands in the owner's. That layer is R.Pay. It is not a payment gateway and it is not a dashboard; it is **infrastructure with a map**. Every competitor site in this category sells a terminal photo and a percentage. The category-defining move is to stop selling the object and start showing the **system** — Saudi Arabia rendered as a live board, machines as nodes, revenue as directional flow, each node carrying an owner's name. R.Pay is the only company in this brief that can honestly draw that picture, because it actually operates the largest arcade fleet in the region. The site should feel less like a fintech landing page and more like being handed the keys to an air-traffic control room and told: *this is yours now.*

---

### 4. THE HERO — FIRST 3 SECONDS, THEN 5

**0.0s** — Black. Not navy-black: instrument black, `#04070C`. Total silence, no logo animation, no gradient sweep. Dead centre, one 3px cyan dot pulses once. Below it, in mono, a single digit: `1`.

**0.4s** — A second dot, 200px away. Then a third. A hairline draws between them — 1px, `rgba(0,174,239,.35)`.

**0.8–1.6s** — From those three dots outward, the coastline and borders of Saudi Arabia draw themselves as a single 1px hairline (`stroke-dashoffset` 0→full, 900ms, linear — a plotter, not an animation). No fill. The country appears as a wireframe on black.

**1.6–2.4s** — 97 nodes ignite in staggered waves across Riyadh, Jeddah, Dammam, Khobar — clustered honestly where the real branches are. 90 breathe mint `#1FD3B8`. 7 sit grey. Nobody explains this yet.

**2.4–3.0s** — The Arabic headline sets, right to left, no fade-in cliché — it types on in one 380ms mask-reveal:
**شبكةٌ صامتة تُشغّل أصخب المكائن في المملكة**
The counter under it starts running from `1` toward `465,255` — linear, tabular numerals, 4.2 seconds, and it *doesn't stop when you scroll away*.

**3.0–8.0s** — The 97 nodes begin firing thin arcs. Not decorative particles: each arc leaves a node and converges to a single labelled point at the bottom of the map — **حسابك** (your account). Arcs land, the counter jumps in step with them. At 6.5s one node in the far north detaches from its dashed circle, flashes amber, then goes black; a single red console line prints at the edge of the screen: `RP-0417 · خرج عن نطاقه · أُطفئ خلال 0.8 ث`. It is a 2-second cameo of the signature moment — a trailer for the thing 8 sections down.

No hero video. The existing AI films get demoted to sensor-feed insets later. The hero is a **live board**, and it is server-rendered SVG that animates with pure CSS before a single byte of JS executes.

---

### 5. SECTION-BY-SECTION

**0 · Instrument bar (fixed, top).** R mark, live status pill `الشبكة تعمل · 90/97 متصل`, AR/EN, one CTA. *Job:* the page is never not-live. *Beat:* being watched over.

**1 · الخريطة الحية — the hero.** *Job:* reframe R.Pay from vendor to infrastructure in 3 seconds. *Beat:* awe, then ownership.

**2 · منظومة واحدة — the two objects.** One screen, two things, no more: the terminal render on the left, a bare telemetry panel on the right, one hairline between them. Copy: *جهاز يقبض. ومنصّة تُمسك بالخيط.* *Job:* category clarity — hardware **and** control platform. *Beat:* orientation.

**3 · المسار — the flow.** Scroll-driven playback of the existing 72-frame WebP sequence: tap → terminal → rail (mada / VISA / Mastercard / Apple Pay / stc pay / GCCNET stamped as they pass) → **حسابك مباشرة. بلا وسيط.** A failed payment forks off and auto-refunds itself with no human touching it. *Job:* settlement + auto-refund. *Beat:* relief — *my money isn't sitting in someone else's account tonight.*

**4 · القَطْع — the signature.** See §6. *Job:* the geofence radar. *Beat:* control, and a small thrill of destruction.

**5 · الأسطول — the fleet.** The three machine renders (vending, arcade, coffee) cut out on black, annotated like a spec sheet with calipers and coordinates, plus remote add/remove: a node literally appears on a mini-map when you press *أضف جهازاً*. *Job:* prove breadth + remote fleet ops. *Beat:* competence.

**6 · السجل — the ledger.** 465,255 · 97 · 9 · 9,434 · 90/97, laid out as a monospace instrument panel with dated provenance, not four glowing cards. *Job:* scale, honestly stated. *Beat:* trust.

**7 · من يثق بالشبكة — the venues.** The 13 logos are **not** a grey logo strip. Each one is pinned to its city on a repeat of the map, with a hairline leader to the mark: Roshn, Dar Al Arkan, Boulevard City, Boulevard World, LuLu, Sela, Al Khozama, Kinan, Hamat, Malahi, Al Nadej, Al Deera, Shawarma House + Saffori Land, Sparky's, VR Games Zone. *Job:* social proof at national scale. *Beat:* *these people already made this decision.*

**8 · الفرق — the matrix.** The comparison table as a signal/no-signal grid: filled node vs hollow node, eight rows, three columns. Clinical, unemotional, devastating. *Job:* differentiation. *Beat:* certainty.

**9 · يومٌ في حياة الشبكة — the 24h scrub.** Drag an hour dial; the map breathes with mall hours — dead at 07:00, incandescent at 21:40 Thursday. *Job:* humanise the data. *Beat:* recognition. This is the operator's actual life.

**10 · باسمك أنت — white label & support.** The whole UI restyles to a fictional operator's colour in one 220ms transition. Plus remote training/support. *Job:* it can be yours. *Beat:* ambition.

**11 · انضم إلى الشبكة — the join.** The fleet estimator (see §9). *Job:* convert. *Beat:* belonging.

**12 · Footer as station ident.** Coordinates, "شركة سعودية", CR, phone, WhatsApp, the network status pill still ticking. *Beat:* the grid keeps running after you leave.

---

### 6. THE SIGNATURE MOMENT — القَطْع / THE CUT

A pinned 200vh section. Centre: one node, `RP-0417`, sitting inside a dashed circle labelled `النطاق الجغرافي · 150 م`. Behind it at 12% opacity, the arcade render. To the side, a live console. A mint arc runs from the node to a point labelled `حسابك`, and a revenue ticker adds SAR every ~1.6s.

**The user drags the node with their finger or mouse.** That is the whole interaction.

- Distance `d` in px maps to metres at 1px = 1.25m.
- `d < 0.8r` — node mint `#1FD3B8`, console prints routine telemetry, revenue keeps climbing.
- `0.8r ≤ d < r` — node and circle stroke go amber `#FFB020`, stroke blinks at 2Hz, console: `تحذير: اقتراب من حدود النطاق`.
- `d ≥ r` — **breach**, an exactly-scripted 800ms sequence, timestamped on screen:
  - `t+0` red console line: `خروج عن النطاق — RP-0417`
  - `t+120` haptic `navigator.vibrate([12,40,12])`
  - `t+240` the revenue arc **severs**: `stroke-dashoffset` to zero in 180ms, from the account end backward — the money visibly stops arriving
  - `t+420` node flashes `#FF4D4D`, desaturates to dead grey `#33404D`, ticker freezes mid-number
  - `t+800` a monospace receipt prints: `الحالة: مُطفأ · زمن الاستجابة 0.8 ث · إيراد محمي 1,240 ر.س`
- **Release** — the node springs home, 520ms `cubic-bezier(.16,1,.3,1)`, a mint ripple expands once, arc redraws, ticker resumes. That release also silently demonstrates remote re-activation.

**The send-to-a-colleague mechanic is built in.** Under the console: `احفظ اللقطة`. It renders the current console state — device ID, breach log, timestamp, protected revenue — into a 1080×1350 canvas card with the R.Pay mark and downloads/shares it via `navigator.share`. People will not screenshot this. They will *export* it.

Nobody else in this category lets you steal a machine on their website and watch it die.

---

### 7. MOTION LANGUAGE

**Governing principle: instruments do not perform.** Nothing overshoots, nothing bounces, nothing announces itself — except one moment (the release spring), which earns it by contrast.

Three classes only:
- **TELEMETRY** — `linear`, infinite, sub-pixel. Node pulse 1.2s. Radar sweep 4s. Counters linear, always. Data never eases; easing is a human affectation.
- **STATE** — 220ms `cubic-bezier(.65,0,.35,1)`. Every colour/status change: mint→amber→red, table cell fills, white-label restyle.
- **REVEAL** — 640ms `cubic-bezier(.16,1,.3,1)`, 60ms stagger, max 8 items in a chain, translate ≤ 16px, opacity 0→1. Never scale.

Banned: parallax on text, scale-in above 1.06, blur transitions, glow pulsing, anything above 900ms except ambient loops. Scroll rule: no layer ever moves faster than the scroll; the map plate tops out at 0.94×.
`prefers-reduced-motion`: pings become static dots, sweep removed, counters snap to final value, the Cut becomes a 4-state click-through. The page loses nothing but its heartbeat.

---

### 8. ART DIRECTION

**Colour — cyan gets demoted to data.** Today cyan is decoration; here it carries meaning only.
- Ground `#04070C` · panel `#0A1018` · grid line `#101E2A` · hairline `rgba(232,240,246,.08)`
- Text `#E8F0F6` · secondary `#8A9AA8` · mono/labels `#5E7080`
- **Signal cyan `#00AEEF`** = movement (flow, transaction) · **mint `#1FD3B8`** = online/settled · **blue `#0E6DD0`** = rails/depth · **amber `#FFB020`** = warning · **red `#FF4D4D`** = breach · **grey `#33404D`** = offline
No colour appears unless it means something. Zero decorative gradients on the whole page.

**Light.** Single-source, top-left, cold. Glows are pre-baked radial-gradient PNG sprites, never CSS `filter: blur()` or SVG `feGaussianBlur` (both destroy mid-tier Android).

**Type.** Display: **Noto Kufi Arabic 700** — geometric, monumental, reads as infrastructure signage, not marketing. Body: **IBM Plex Sans Arabic** 400/600, paired with **IBM Plex Sans** for Latin (same design DNA, licence-clean, self-hosted, subset). Numerals and all telemetry: **IBM Plex Mono** with `font-variant-numeric: tabular-nums`, Western digits (the market reads them; Arabic-Indic digits break tabular alignment against the Latin mono).
Hard rule shipped as CSS: `:lang(ar){letter-spacing:0 !important}` — Latin tracking severs cursive joining. Arabic hierarchy comes from weight, size and line-height (1.75 for Arabic body vs 1.5 Latin), never from tracking or all-caps.

**Texture.** A 1px `#101E2A` grid at 48px, faded to 6% opacity. A static 2% grain tile. Coordinate ticks, dashed geofence rings, dotted lat/long, corner brackets on panels. That is the entire texture vocabulary.

**Imagery.** Machine renders are cut out on black, cold, annotated like equipment. The AI films are never full-bleed — they run inside a 320×180 "sensor feed" frame with a timecode and a `LIVE` dot, which makes cheap footage read as surveillance rather than as stock. That single reframe upgrades every asset in the repo.

---

### 9. CTA STRATEGY — three tiers

**Tier 1 — primary, one action, everywhere:** `اربط أجهزتك بالشبكة` (Connect your machines). Fixed in the instrument bar from scroll 0; repeated at the end of the Cut, at the end of the ledger, and in the join section. Never worded differently — one verb, four appearances.

**Tier 2 — the Fleet Estimator, and it is a piece of the concept, not a form.** Two inputs: *كم جهازاً تملك؟* and *في كم موقع؟*. As you type, **your machines are added to the national map in real time** — your nodes come up in white among R.Pay's mint ones, with a line that reads `شبكتك: 24 جهازاً · 3 مواقع · مضافة إلى الشبكة`. Submit converts it into a contact request with the fleet size attached. The lead form *is* the demo.

**Tier 3 — low friction, always present:** WhatsApp float (this market closes on WhatsApp), and `شاهد اللوحة` — a 40-second silent screen-capture of the real dashboard, because sceptics will demand it.

---

### 10. MOBILE — the canonical version, not the reduction

The operator does not sit at a desk. He is standing in a mall corridor at 22:00 checking whether machine 41 is still earning. **The phone is the control device; desktop is the wall display.** So mobile gets the *better* build:

- The hero map crops to the portrait Riyadh–Jeddah–Dammam corridor, which is where the real density is — a tighter, denser, more impressive board than the empty desktop full-country view.
- The Cut is superior on touch: dragging a machine out of its geofence with your thumb, plus real haptics on breach. Desktop mouse-drag is the compromise.
- The instrument bar docks to the bottom as a thumb-reachable status + CTA rail with the live `90/97` pill.
- The 24h scrub becomes a horizontal thumb dial — a native gesture, not a scrollytelling hack.
- The 72-frame flow sequence plays on scroll at 24 frames on mobile (every third frame), visually identical at phone size.
- Share card is 1080×1350 — built for the phone, sent from the phone.

---

### 11. TECH

- **Map:** simplified Saudi outline as an inline SVG path (Natural Earth, simplified to ~8–10kB), server-rendered in the RSC output. 97 nodes are static SVG `<circle>` elements with CSS keyframe pulses and staggered `animation-delay`. **The hero is fully alive with zero JavaScript** — LCP is an SVG paint, and the "wow" survives a cold 3G first load.
- **JS is enhancement only:** one client component hydrates for the Cut, the estimator, the scrub. Dynamic-import everything below the fold; the flow-particle layer is a single Canvas 2D layer, one `requestAnimationFrame` loop shared by the whole page, paused via `IntersectionObserver` and on `visibilitychange`.
- **No libraries.** Web Animations API + CSS custom properties. **Delete `three@0.149.0`** — it is dead weight and a temptation. No Tailwind; keep vanilla CSS with a token layer (`--sig-cyan`, `--state-online`…). Stay on Next 14 App Router, all pages static, Vercel edge.
- **Mid-tier Android budget:** cap canvas DPR at 1.5; scale particle count off `navigator.hardwareConcurrency` / `deviceMemory` (60 → 20 → 0); no `filter`, no `backdrop-filter`, no `box-shadow` on animated elements; only `transform`/`opacity` animate; `content-visibility: auto` on sections 5+.
- **Fonts:** self-hosted subset woff2, Arabic subset preloaded, one display weight + two text weights. ~70kB total, `font-display: swap` with a matched fallback metric to kill CLS.
- **Target:** ≤ 120kB First Load JS (up from 87–101kB, and worth it), LCP < 1.8s on a mid-tier Android over 4G, CLS < 0.02.
- **Effort:** ~4–5 weeks with one senior front-end engineer. The Cut alone is a week; the map and node system a week; the rest is disciplined CSS.

---

### 12. RISK — the honest one

**97 dots do not look like a national grid.** Draw the whole Kingdom and scatter 97 nodes across three cities and the map may read *sparse* — accidentally proving the company is small, at the exact moment it claims to be the region's largest operator. That is the concept's failure mode, and it is real.

The mitigation is discipline, not inflation: never fake density. Default the map to the populated corridor rather than the empty country; carry the scale in the **transaction flow** (465,255 arcs is a swarm) rather than in dot count; label the map `الشبكة الحيّة · 97 جهازاً · 9 فروع` so the sparseness reads as precision and auditability rather than emptiness — the difference between a radar screen and a sales chart. And build the map data-driven so the picture gets *more* impressive every quarter without a redesign.

Two lesser risks: **dashboard cosplay** — a marketing site cosplaying as a product invites "just show me the real thing," which is why Tier-3 CTA is a real dashboard capture; and **coldness** — this art direction is clinical, and Saudi B2B closes on relationships, which is why sections 9 and 12 deliberately bring warmth, a human hour-by-hour story, a phone number, and WhatsApp.

---

### 13. WHY THIS BEATS A GENERIC FINTECH SITE

A generic fintech site sells an **abstraction**: an API, a rate, a settlement window, a stock photo of a card reader, a gradient. It has to, because it has nothing physical to point at. R.Pay's product is the opposite — hundreds of real objects, made of steel and glass, standing in real malls, full of real cash and real prizes, owned by a man who lies awake wondering if one of them has been moved. Selling that with fintech's abstraction vocabulary throws away the only unfair advantage in the brief.

Silent Grid inverts every default in the category: no hero video, no glow, no gradient, no product beauty shot. Instead it hands the buyer the exact instrument he wishes he had — a live board of his own machines, money visibly landing in *his* account with no middleman in the picture, and one interaction where he can try to steal his own machine and watch the network kill it in 0.8 seconds. Competitors will answer with a bigger 3D terminal render. That is an arms race about surface. This is a claim about **the system** — and once R.Pay owns "the network under the machines", a nicer terminal render is not an argument.

The wow here is not more light. It is the first time an operator has ever seen his own invisible infrastructure drawn.

########## CONCEPT 3: TAP ##########
# UNBROKEN
### بلا انقطاع
*(the film inside it is called "One Take" — «لقطة واحدة»)*

---

## 1. CONCEPT NAME

**UNBROKEN / بلا انقطاع**

The name works three ways at once, which is why it's the right one: an unbroken *shot* (the site never cuts), an unbroken *chain* (tap → authorization → machine → prize → dashboard → the owner's bank account, with nothing severed in the middle), and unbroken *service* (90 of 97 machines online, right now). Arabic «بلا انقطاع» carries the same triple meaning natively — it's what a Saudi operator says about uptime and about money that arrives without interruption.

---

## 2. THE ONE-LINE IDEA

**A hand taps a machine — and the website never cuts away until that tap has become money in the owner's account.**

The entire page is one continuous causal sequence. No sections that "begin." No fades to black. No cards flying in. One shot, one line, one clock.

---

## 3. MANIFESTO

R.Pay does not sell a payment terminal and R.Pay does not sell a dashboard. R.Pay sells the *invisible distance* between a child's hand on an arcade machine in Boulevard World and a number changing in an owner's bank account in Riyadh — and the promise that nothing in that distance is broken, delayed, skimmed by a middleman, or unknown. Every anxiety this buyer has is a **causality anxiety**: *did the tap reach me? is the machine running right now? did someone move it?* A conventional B2B site answers that with a features grid — twelve disconnected boxes, which is precisely the shape of the problem, not the solution. So we do the opposite of a features grid. We build the site as a single unbroken causal chain and let the operator *watch* his money travel. Every feature R.Pay has — direct settlement, automatic refund, geofence shutdown, prize linking, remote add/remove — is not a "feature," it is **a link in one chain**, and each one earns its place on screen only at the exact moment in the sequence where it fires. The restraint is the flex: a company that owns the largest arcade fleet in the region does not need to shout. It needs to show you one second of reality, slowed down until you can see every consequence.

---

## 4. THE HERO — FIRST 3 SECONDS, THEN 5

**Frame at t=0.** Black. Not gradient-black — photographic black, #04060B, with a single practical light source high-left. In the center-right of frame (right, because RTL: the eye enters from the right), the R.Pay terminal, extremely close. Macro-close. We can see the brushed micro-texture on the reader face and one dormant status LED. Nothing moves. No logo animation, no loader, no glow. There is one line of Arabic type, top-right, at small size — not a headline, a *label*, set in Readex Pro Light:

> **٠٠:٠٠٫٠٠٠ — لم يحدث شيء بعد**
> *(00:00.000 — nothing has happened yet)*

That's it. Three seconds of a hero that refuses to perform. On a fintech site full of moving gradients, stillness is the loudest thing in the room.

**t=3.0 → t=8.0.** A hand enters from the right edge of frame — an adult hand, a real one, a woman's hand with a plain ring, not a stock-photo hand — and moves toward the reader. It is unhurried. At **t=3.9** the phone/card meets the reader. Contact.

At the instant of contact, four things happen inside **400 milliseconds**, and they are the only four things that happen:

1. The status LED goes from dead to cyan #00AEEF. One frame. No fade.
2. A **hairline stroke, 1px, cyan** is born *at the point of contact* and travels 40px to the left. It does not stop. It will not stop for the rest of the page.
3. The timecode label re-types itself: **٠٠:٠٠٫١٨٠ — تم القبول** *(00:00.180 — accepted)*.
4. A single sound: not a "ding." A low, dry mechanical *knock* — a relay closing. Muted by default, with a small speaker toggle that is the only chrome on the screen.

The hand withdraws. The camera does **not** cut. It begins a slow dolly back — and as it pulls, the hairline is still travelling left, and we realize we are now looking at the whole machine, then the row of machines, then the hall. The scroll indicator appears at t=8.0 as one word: **تابع الخيط** *("follow the thread")*.

The headline never appears in the hero. The headline appears at scroll position 2, *after* the viewer has already understood. That is deliberate and it is the single bravest decision in this pitch.

---

## 5. SECTION-BY-SECTION STRUCTURE

There are no "sections." There are **stations on one line**. But for build purposes, in order (RTL, scroll-down):

| # | Station | Job-to-be-done | Emotional beat |
|---|---|---|---|
| 00 | **THE TAP** (hero) | Establish stillness, then a single human gesture and its first consequence | Curiosity. "Wait — is that all it's going to show me?" |
| 01 | **THE 400 MILLISECONDS** | The chain's first three links, as timecodes on the line: accepted / authorized / rail (mada · VISA · Mastercard · Apple Pay · stc pay · GCCNET appear here as small marks *on the line*, never as a logo salad) | Precision. Competence. |
| 02 | **THE MACHINE OBEYS** | Headline lands at last: «لمسة واحدة. وتتحرّك المنظومة كلها.» The arcade claw drops, the vend spiral turns — using the existing 72-frame WebP sequence, scrubbed to scroll | Delight — the *only* warm beat in the film |
| 03 | **THE PRIZE IS A RECORD** | Prize/inventory management: the physical toy falls into the chute and simultaneously becomes a row — «هدية #٩٤٣٤ · مرتبطة بالجهاز A-17» | "Oh. The physical world became data and I watched it happen." |
| 04 | **THE MONEY GOES STRAIGHT HOME** | Direct settlement. The line **forks once** — and one fork is deliberately drawn and then **erased**: the middleman. Label on the erased fork: «الوسيط» → struck through → «لا يوجد» | Relief. This is the buyer's #1 anxiety, answered in a single visual. |
| 05 | **WHEN IT FAILS** | Automatic refund. The line hits a break — an actual gap — and *heals itself* while you watch, no click required. «فشل الدفع. أُعيد المبلغ تلقائيًا. لم يتدخّل أحد.» | Trust. Competitors cannot show this. |
| 06 | **THE RADAR** *(signature — see §6)* | GPS geofence: device leaves its zone → alert → automatic shutdown | Fear, then command. The only fear beat in the film, and it is short. |
| 07 | **THE FLEET** | Zoom out to all of it: 97 machines, 90 online, 9 branches, 465,255 transactions — as **live-styled state, not as stat cards** | Scale. "This is not a startup demo." |
| 08 | **THE ROOM WHERE YOU SIT** *(the light chapter)* | The dashboard. Page inverts to bone #F2F1ED for the first and only time — daylight, an office, the operator's actual screen. Remote add/remove, remote training, white-label. | Ownership. Calm after the dark. |
| 09 | **THE PROOF** | Roshn, Dar Al Arkan, LuLu, Boulevard City, Boulevard World, Sela, Kinan, Hamat, Al Khozama, Malahi, Al Nadej, Al Deera, Shawarma House + named: Saffori Land, Sparky's, VR Games Zone. Logos at 40% opacity in one continuous marquee **on the same line**, so the line literally threads through the client list | Legitimacy, understated. |
| 10 | **THE LEDGER** | The comparison vs SurePay / Geidea. Not a marketing table — a *ledger*, in IBM Plex Mono, black on bone, with R.Pay's column being the only one where the causal line is unbroken and the competitors' columns showing the line **cut**, with the cut visible | Decision. This is where the sale closes. |
| 11 | **THE END OF THE LINE** | The line, unbroken since the fingertip in the hero, curves in and **terminates inside the primary CTA button**. It is the button's left border. | Completion. Physical satisfaction. |
| 12 | **FOOTER** | Company, Riyadh, «شركة سعودية», legal, EN/AR switch | Grounded. |

---

## 6. THE SIGNATURE MOMENT — "الرادار" / THE GEOFENCE BREACH

This is the screenshot. This is the thing an operator sends to his partner on WhatsApp with the caption *"شوف هذا."*

**What the viewer sees.** At station 06 the camera is high — a top-down plan view of a mall floor, drawn in 1px hairlines only, no fill, no 3D, like an architect's plan. Nine devices are marked as small squares. Around one of them, device **A-17**, sits a thin cyan circle: its geofence, radius shown as **٥٠ م**. Everything is still. The causal line runs across the plan and into A-17.

Then A-17 *moves*. Not fast — it drifts, 4 pixels, then 9, then 20, the way a machine on a trolley moves. It crosses the circle's edge.

**The page changes colour for the only time in its life.** Every cyan element on screen — the line, the LEDs, the timecodes — shifts to amber **#FFB020** over 120ms. Not a flash. A *temperature change*. The mono timecode, which has been counting in milliseconds all page, suddenly reads in wall-clock:

> **٠٣:١٤ ص — خرج الجهاز A-17 من نطاقه**

A 180ms beat of nothing. Then the line running into A-17 **retracts** — it withdraws from the device like a hand pulling back — and the device square goes from outline to a flat, dead, unfilled grey.

> **إيقاف تلقائي. الجهاز لا يقبل أي عملية.**
> *(Automatic shutdown. The device accepts nothing.)*

Then, over 600ms, everything returns to cyan except A-17, which stays dead. The chain continues past it. **The business did not stop; only the stolen machine did.** That's the whole argument for R.Pay in one visual and it takes 2.4 seconds.

**How an engineer builds it.** Pure inline SVG, ~6KB, no library.
- One `<svg viewBox>` with the floor plan as `<path>` elements, `stroke-width: 1`, `vector-effect: non-scaling-stroke`, `fill: none`, all strokes `stroke="var(--line)"`.
- The geofence circle: `<circle>` with `stroke-dasharray: 2 6`, rotating via CSS `transform: rotate()` at 24s linear infinite — **the only looping animation on the entire site**, which is why it reads as "live" rather than decorative.
- A-17 is a `<g>` translated by a CSS custom property `--drift`, driven by a single scroll-progress value `p ∈ [0,1]` written to the DOM once per rAF frame by a shared scroll broker: `transform: translate(calc(var(--drift) * 1px), 0)`.
- Colour change is one line: the whole SVG inherits `--signal`, and at `p > 0.42` a class toggles `--signal: #FFB020`, transitioned `120ms cubic-bezier(0.65,0,0.35,1)`.
- Line retraction: the causal path's `stroke-dashoffset` is already scroll-bound; at `p > 0.55` we add its length *back*, animating `stroke-dashoffset` from 0 → `pathLength` over 420ms with `cubic-bezier(0.22,1,0.36,1)`. Retraction, not deletion — the difference is everything.
- On mobile, the breach also fires `navigator.vibrate(18)` once. One short, dry tick. Nothing else on the site vibrates.
- `prefers-reduced-motion`: the drift and retraction become two static states cross-faded in 200ms, and the dashed circle stops rotating. The meaning survives completely.

Total cost: one SVG, one CSS class toggle, zero new dependencies, ~1.5KB gzipped of JS.

---

## 7. MOTION LANGUAGE

**Governing principle: ONE CLOCK, ONE CAUSE.** Nothing on this page animates because it entered the viewport. Everything animates because *something upstream of it happened*. If you can't name the cause, delete the motion. And only **one thing moves at a time** — the moment two things move independently, the illusion of a single take dies.

Concretely:
- A single scroll broker writes `--p` (global progress) and per-station `--sp` to `document.documentElement` once per `requestAnimationFrame`. Every animation on the page is a pure function of those numbers. There are no independent timers except the geofence circle.

| Purpose | Easing | Duration |
|---|---|---|
| Scroll-scrubbed everything (line, frames, camera) | `linear` — scrub must be 1:1 with the finger or it feels like lag | n/a |
| Arrival of type / state settling | `cubic-bezier(0.22, 1, 0.36, 1)` | **420ms** |
| Micro-state (LED, timecode re-type, hover) | `cubic-bezier(0.4, 0, 0.2, 1)` | **160ms** |
| Causal transmission (line growth between stations) | `cubic-bezier(0.65, 0, 0.35, 1)` | **240ms** |
| Colour temperature shift (breach) | `cubic-bezier(0.65, 0, 0.35, 1)` | **120ms** |
| Recovery / release (return to cyan, chute settle) | `cubic-bezier(0.16, 1, 0.3, 1)` | **600ms** |
| The one loop (geofence sweep) | `linear infinite` | **24s** |

Banned outright: parallax on decorative elements, staggered card reveals, counting numbers that count on scroll-in (our numbers change only when the chain reaches them), bounce, spring overshoot, anything that scales up from 0.9, blur-in text. Type **never** fades in; it either exists or it is typed by the machine.

---

## 8. ART DIRECTION

**Colour — with a scarcity law.** The palette is small because each colour has a *job*, and using a colour for anything but its job is a bug.

```
--ink        #04060B   ground. photographic black, blue undertone
--ink-2      #0A1220   raised surface, plan-view background
--bone       #F2F1ED   the light chapter only (dashboard + ledger)
--paper      #E8ECF1   type on dark
--muted      #7E8B9C   labels, secondary
--signal     #00AEEF   CAUSALITY ONLY. the line, live state, the LED.
--money      #1FD3B8   MONEY ONLY. settlement, revenue, payout. never decorative.
--structure  #0E6DD0   links, focus rings, structural rules
--breach     #FFB020   exists for 2.4 seconds, once. (new to the palette; the brand had no honest alarm colour)
--dead       #2A3340   a shut-down device
```
If cyan appears where nothing is being caused, remove it. That single rule is what makes this site feel expensive without a single gradient.

**Light.** One source, high and behind-left of every physical object. Hard-ish falloff, real specular on the terminal's reader face, deep unlifted shadows. Nothing is rim-lit in cyan. The machines are photographed like objects, not like products in a crypto ad. The existing renders (`device-terminal.webp`, `machine-arcade/vending/coffee.webp`) get regraded to this one light: crushed blacks (lift 0), −18 saturation, single cyan practical.

**Type.** Both families are already in the repo, which means zero new font cost.
- **Readex Pro** (400 / 600 / 700) — Arabic *and* Latin from one designer, so the Arabic isn't an afterthought Naskh bolted onto a Latin grotesque. It is the display and body face for both languages. Arabic display: 700 at 48–96px, `letter-spacing: 0` **always**, `line-height: 1.45` (Arabic needs more leading than Latin, never less). Latin display may take `letter-spacing: -0.02em`; Arabic takes **none, ever** — enforce with a lint rule and a `:lang(ar) { letter-spacing: 0 !important }` guard so no future dev severs the cursive joins.
- **IBM Plex Mono** (400 / 500) — the timecodes, the ledger, device IDs, coordinates. Latin-digit contexts only. Where Arabic-Indic numerals are wanted (٠٠:٠٠٫١٨٠), Readex Pro with `font-variant-numeric: tabular-nums` handles it; the two never mix inside one string.
- Hierarchy is achieved by **size and position, not weight**. There are exactly three type sizes on this site.

**Texture.** One texture, applied globally at 3% opacity: a 128×128 tiled monochrome film grain, animated **never** (static grain, so it doesn't cost a repaint). It keeps the black from looking like #000 CSS and makes the whole page read as *photographed* rather than *rendered*. Plus one structural texture: a 1px hairline rule system at `rgba(232,236,241,0.08)` that all layout aligns to — the same hairline weight as the causal line, so the line looks like it belongs to the architecture.

**Imagery.** Three registers only, and they are always the same three: (1) **macro** — the terminal, the hand, the chute, shot so close you see material; (2) **plan** — 1px architectural line drawings, no fills, for the fleet and the geofence; (3) **daylight** — one real photograph of an operator's desk in the bone chapter. The existing `flow/seq` 72-frame WebP sequence carries register 1's motion; `hero-tall.mp4` / `hero-wide.mp4` carry the hero dolly. No stock imagery, no people smiling at laptops, no 3D isometric blobs, no dashboard screenshots floating at 15° with a drop shadow.

---

## 9. CTA STRATEGY

**The primary action is not "contact us." It is: «شغّل الخيط على مكائنك» — "Run the thread on your machines."** A 20-minute session where R.Pay puts *the prospect's own* fleet — his machine count, his branches, his current settlement delay — into the same chain visualization he just watched. It's a demo whose format the site has already taught him. That's a much easier yes than "book a meeting," and it's honest: R.Pay can genuinely do this in a call.

**Three tiers, no more:**
1. **PRIMARY — one per page, at the end of the line (station 11).** The button *is* the terminus of the causal stroke; its right border (RTL) is the line itself. Bone fill on ink, no glow. On mobile it is additionally pinned to the thumb zone from station 04 onward as a 48px-tall bar that says only «شغّل الخيط» — and tapping it plays the same relay *knock* as the hero tap. The buyer's last action on the page rhymes with the first action he watched. That's the close.
2. **SECONDARY — twice, contextual, text-only with a hairline underline.** After station 05 (refund): «كيف تصل الأموال مباشرة؟ — اقرأ ٣ دقائق». After station 08 (dashboard): «جولة في لوحة التحكم». These serve the researcher who is not ready.
3. **TERTIARY — footer only.** WhatsApp, phone, email, `sales@`. For the operator who skipped everything, because some will, and pretending otherwise is arrogance.

Hard rule: **no CTA appears before station 04.** The first four stations are not allowed to sell. Earning three scroll-stations of trust before asking is exactly why this reads as premium and not as a landing page.

---

## 10. MOBILE — WHY THE PHONE IS THE *BETTER* VERSION

This concept was conceived vertically. The desktop is the compromise, not the phone. Three reasons this is literally true, not a reassurance:

1. **The gesture matches.** The film is about a finger touching a surface. On a phone, the viewer's finger *is* touching a surface. In the hero, mobile does not autoplay the tap — **the user must tap the terminal to start the film.** He performs the gesture the entire site is about. `navigator.vibrate(12)` fires on contact. Desktop can only show you someone else's hand; the phone makes it yours.
2. **The line has somewhere to go.** A 9:19.5 viewport is a *column* — an unbroken vertical stroke down a phone is a stronger image than a horizontal one on a 16:9 monitor, where it fights the width. The line runs down the screen at 24% from the right edge (RTL reading gutter) and never leaves.
3. **Assets already exist in portrait.** `flow/film-hero-tall.mp4` and `concept-08/hero-tall.mp4` are vertical masters. This is not a cropped desktop film.

Adaptations, not reductions: the geofence plan-view rotates to a portrait crop centred on A-17 (tighter framing = *more* tension, not less); the ledger table becomes a two-column swipe (R.Pay vs. one competitor at a time, which is a stronger comparison than three columns of squint); the client logos run as a single-row marquee threaded by the line. Nothing is cut. The manifesto text is identical. Station count is identical.

---

## 11. TECH

**Realistic on Next.js 14 App Router + Vercel + a 2021 Android mid-tier.**

- **Rendering.** Everything is a Server Component and statically prerendered. Client islands, and only these: `<ScrollBroker>` (~1.2KB — one rAF loop, one `--p` write, one passive listener), `<FrameScrubber>` (~2KB canvas), `<CausalLine>` (~1.5KB SVG stroke), `<Breach>` (~1.5KB). Total added client JS budget: **≤ 8KB gzipped.** Target First Load JS **≤ 105kB**, i.e. within noise of the current 87–101kB.
- **The film: canvas frame sequence, not scrubbed video.** Scrubbing `<video>` with `currentTime` is the classic mid-tier Android disaster — keyframe seeking stalls for 200–600ms. Instead: extend the existing `flow/seq` approach to ~90 WebP frames at 1440px wide, ≈ 2.2MB total, decoded once with `createImageBitmap()` into a pool and blitted to a `<canvas>` at `min(devicePixelRatio, 2)`. Decode is off-main-thread, blit is a single `drawImage` per frame. Frames preload in three priority waves (0–12 eager, 13–48 on idle, rest on approach) so the hero is interactive at ~180KB.
- **`hero-wide.mp4` / `hero-tall.mp4` stay as video** — they are *played*, never scrubbed. `preload="metadata"`, `playsInline`, `muted`, poster from the existing `.webp`, `<source>` with an AV1/WebM alternate for the ~40% bandwidth win.
- **Motion plumbing.** No GSAP, no Framer, no Lenis. CSS `animation-timeline: view()` / `scroll()` where supported (Chrome ≥ 115, i.e. most of this market's Android), with a rAF fallback path behind `CSS.supports('animation-timeline: view()')`. **Never smooth-scroll-hijack** — scroll jacking on Android is how you lose a mid-tier device.
- **`three@0.149.0` gets deleted.** It's dead weight in the bundle graph and this concept needs zero WebGL. That's a real win, not a sacrifice.
- **Perf guards in CI.** Lighthouse budget on Vercel preview: LCP ≤ 2.0s on Moto G Power / Slow 4G, CLS < 0.02, INP < 200ms, TBT < 150ms. If the frame sequence blows the budget, the fallback is automatic: `navigator.connection.saveData` or `deviceMemory ≤ 2` → serve 6 key stills instead of 90 frames, and the narrative is unharmed because the *line* carries the story, not the footage.
- **RTL.** `dir="rtl"` on `<html lang="ar">`, all layout in logical properties (`margin-inline-start`, `inset-inline-end`) so the EN mirror is free. The causal line's `stroke-dashoffset` direction flips with `dir` — one sign variable.
- **Production cost, honestly stated:** this concept needs a real 2-day plate shoot (hand + terminal macro, chute, one desk) or a very disciplined AI-generated equivalent. That is the single biggest line item and it should not be hidden in the pitch.

---

## 12. RISK — THE HONEST FAILURE MODE

**It's a linear film, and B2B buyers arrive non-linearly.** A procurement manager at Roshn who lands on this page with one question — *"do they support mada and what's the settlement window"* — is trapped inside somebody's art film. If he has to scroll through eleven stations of cinematic restraint to find a number, we have built a beautiful thing that loses a deal. This is the real risk, and it is not solved by "adding a skip button" — a skip button is an admission that the main content is an obstacle.

The mitigation must be structural, and I'd build it on day one: a **persistent hairline index on the leading edge** — eleven 8px tick marks, one per station, the causal line drawn through them. It's the progress indicator *and* the nav. Tap any tick and the page jumps to that station with the line already drawn to that point, so the sequence stays intact — you don't skip the story, you *enter it later*. Plus a plain, fast `/الأسعار` and `/التقنية` outside the film for people who want facts without theatre. The film converts believers; the flat pages serve auditors.

Second risk, smaller but real: **the geofence beat must never look like a bug.** If a user hits it mid-scroll and the whole page turns amber, some will think something broke. The `٠٣:١٤ ص` timestamp and the Arabic alert copy have to land *before* the colour shift completes, or we've built a scare instead of a demo. That's a 120ms sequencing detail that decides whether the signature moment is the best or worst thing on the site.

---

## 13. WHY THIS BEATS A GENERIC FINTECH SITE

A generic fintech site is a **list**. Hero claim, three value props, a features grid, logos, a stat row, a testimonial, a CTA. Every competitor in Saudi has one, including SurePay and Geidea, and the buyer has learned to scroll past all of it because the format itself signals "we are describing ourselves." Its failure isn't ugliness — most are handsome. Its failure is that a list **cannot express causality**, and causality is R.Pay's entire product. You cannot put "direct settlement with no middleman" in a box next to "geofence radar" and next to "prize inventory" without implicitly telling the buyer these are three unrelated things he has to evaluate separately. They aren't. They are one chain, and R.Pay's whole claim is that the chain is unbroken.

So: this site's information architecture *is* the product's architecture. The competitor's site says "we have eight features." Ours shows one tap turning into money in his account and never cuts away, which is a claim no list can make and no competitor can copy without rebuilding their site around a product that doesn't work that way.

And the "wow" the owner asked for is here without a single extra gradient, glow, or 3D scene. It's in **causality**: the viewer sees a hand touch a machine, and watches — unbroken, for ninety seconds of scroll — that touch become a claw drop, a prize record, a device ID, a settlement, a shutdown of a stolen machine at 3:14 in the morning, and a number on the owner's dashboard. Nobody screenshots a features grid. People screenshot the moment A-17 crosses the line and the system kills it without being asked.

**لمسة واحدة. وتتحرّك المنظومة كلها.**

########## CONCEPT 4: RESTRAINT ##########
# DAYLIGHT — النهار

---

## 1. CONCEPT NAME
**DAYLIGHT** / **النهار**

Subtitle used internally: *the operator's manual, typeset.*

---

## 2. THE ONE-LINE IDEA

**Every fintech company in Saudi sells you the night — dark navy, cyan glow, floating dashboards. R.Pay sells the opposite thing: an operator who no longer sits in the dark wondering. So we build the only white website in the category — a Swiss specimen sheet for a fleet of physical machines, where the wow is that nothing glows and you still cannot look away.**

---

## 3. MANIFESTO

R.Pay's actual product is *the removal of uncertainty*. The operator with 97 machines scattered across Boulevard City, LuLu branches and Roshn developments has four questions and they are all about darkness: is my money reaching me, is machine #A-118 working right now, has someone moved it, how much did I make today. Every competitor answers that question with a website that looks like a dark room. That is a category-wide failure of nerve — an entire industry hiding thin products behind gradient mesh, because glow is cheap and typography is expensive. R.Pay does not need to hide. It has 465,255 real transactions, 13 real logos including a PIF giga-developer, a geofence feature its competitors literally cannot claim, and the sentence "أكبر مشغّل لمكائن ألعاب الأركيد في المنطقة". A company with that hand does not shout. It sets the facts in beautiful Arabic on white paper, rules a hairline under them, and lets the reader do the arithmetic. Restraint here is not an aesthetic preference — it is the product argument made visible. **You turn the lights on for operators. Turn them on for the website.**

---

## 4. THE HERO

**Seconds 0–3.** The page is paper: `#F2EFE9`. There is no loader, no fade-up, no video. The headline is *already there* on first paint — it does not arrive, because things that need an entrance are not confident. Ranged right (RTL), Arabic at 11vw, weight 600, leading 0.94, three lines:

> **تعرف كل شيء**
> **عن كل مكينة**
> **في كل لحظة**

Above it, a single 1px rule across the full measure. On the rule, in IBM Plex Mono 11px, letterspaced only in the Latin: `R.PAY — SELF-SERVICE INFRASTRUCTURE / الرياض` on one end, a live clock `16:04:22 AST` on the other. Nothing else. 82% of the viewport is empty paper. That emptiness is the entire first impression and it is deafening in a category of noise.

**Seconds 3–8.** One thing happens, and it is data, not decoration. Along the baseline of the last headline line, **97 hairline tick marks draw themselves right-to-left**, 14px tall, 6px apart, over 900ms — one tick per machine in the fleet. 90 draw solid ink. 7 draw at 20% opacity. The drawing uses a clip-path sweep, not opacity. The instant the last tick lands, a mono caption sets itself beneath in a 120ms cross-dissolve:

`٩٠ من ٩٧ مكينة متصلة الآن · ٤٦٥٬٢٥٥ عملية منذ الإطلاق`

Then the page stops moving. Completely. It sits there, white and still, and waits for you. **A Saudi fintech homepage whose hero is a row of 97 tally marks is a thing no one in this market has seen.**

---

## 5. SECTION-BY-SECTION

| # | Section | Job to be done | Emotional beat |
|---|---|---|---|
| 0 | **Masthead** — hairline rule, `ر.pay` mark, live fleet status dot, EN/AR toggle, one text-link CTA. No filled button. | Orient, establish that this is a document | *This is serious* |
| 1 | **Specimen / Hero** (above) | Assert scale + liveness in one breath | Stillness, then respect |
| 2 | **السجل — The Ledger Line** The five real numbers set as an editorial statistics table with hairline rules and tabular figures. Not cards. Not icons. A timetable. | Proof, instantly | *These are real* |
| 3 | **الأسطول — The Fleet** The three machine renders, silhouetted on paper, treated as catalogue plates: `لوحة ١ — مكينة بيع ذاتي`, `لوحة ٢ — مكينة أركيد`, `لوحة ٣ — مكينة قهوة`, each with a mono spec block. | Make it physical, not software | *I own these things* |
| 4 | **اللوحة الفيلمية — The Plate** One AI film, 3:2, muted, inside a 1px frame, with a proper caption underneath. Poster-first, plays on intersection. | One breath of motion, earned | Cinema, briefly |
| 5 | **الحد — THE BOUNDARY** ⟵ signature moment (§6) | Weaponise the geofence | **Fear → relief** |
| 6 | **أين مالك؟ — Where is your money?** Direct settlement drawn as two nodes and one line. Below it, the industry's version: three nodes, two lines, a middleman labelled `وسيط`. Pure SVG, ink only. | Make the settlement claim visceral | Quiet outrage |
| 7 | **المقارنة — The Comparison** The real weapon. R.Pay vs SurePay vs Geidea as a Swiss timetable. Solid 6px ink dot = yes, empty ring = no. **No green checkmarks. No colour at all.** One full column beside two nearly empty ones — the *visual* is the argument. | Close the rational sale | Superiority, unspoken |
| 8 | **القنوات — The Rails** mada, VISA, Mastercard, Apple Pay, stc pay, GCCNET set as one justified line of single-ink marks at 65% density. | Legitimacy | Reassurance |
| 9 | **من يشغّل معنا** 13 logos, every one re-rendered to single ink `#12110F` at matched optical weight, in a rigid 4-col grid with hairline rules. **No carousel. No hover. No greyscale-to-colour trick.** Roshn beside LuLu beside Boulevard World. | Overwhelm with proof | Awe |
| 10 | **غرفة التحكم — The Control Room** The one dark section. Full-bleed `#0B0C0C`, real dashboard, ink inverted, cyan permitted here and only here — because a control room *is* dark. | Show the software | *Ah — that's why the rest was white* |
| 11 | **الميدان — Field Notes** Saffori Land, Sparky's, VR Games Zone as three editorial entries: one Arabic sentence, three figures, one plate. | Proof at my scale | *That's me* |
| 12 | **المشغّل** Mission + vision folded into one 52ch paragraph at 24px with enormous air. | Say who this is for | Recognition |
| 13 | **الأسئلة** Hairline accordion, mono numbering `٠١ / ٠٢`. | Clear objections | Calm |
| 14 | **CTA page** A near-empty white page. One Arabic line. One action. | Decide | Decision |
| 15 | **Colophon** A real colophon: company, CR, address, *the typefaces used*, `صُنع في الرياض`. | Taste as a closing argument | *These people care* |

---

## 6. THE SIGNATURE MOMENT — **الحد (The Boundary)**

The screenshot people send to a colleague.

**The stage.** Full-viewport white. Dead centre, one perfect circle: inline SVG, `stroke-width:1`, `vector-effect:non-scaling-stroke`, diameter `62vmin`. Inside it, off-centre, an **8×8px solid ink square** — that's a machine. Under the square, four lines of Plex Mono 10px: device ID `#A-118`, live lat/long, `داخل النطاق`, and a session timestamp. Top-right of the section, one instruction in 13px Arabic: **`اسحب المكينة خارج الدائرة.`** ("Drag the machine outside the circle.")

**The interaction.**
1. Pointer/touch drag moves the square via `transform: translate(var(--x), var(--y))`. No easing, 1:1 with the finger. The coordinates under it update on every `pointermove`.
2. Distance is `Math.hypot(x, y)` against radius in px. Nothing else animates. The user is doing something forbidden and the page is silently letting them.
3. **At the exact frame the square's centre crosses the radius:**
   - Circle stroke → `2px` `#D93A16`. **`transition: none`.** Instant. No fade. The abruptness *is* the effect.
   - `document.documentElement.dataset.breach = "1"` flips six CSS custom properties. The entire page inverts to `#0B0C0C` in **180ms**. Paper becomes night. *You moved the machine, so the site went dark.*
   - A mono line types out at 24ms/char: **`خروج من النطاق — إيقاف تلقائي`**
   - The 8px square's fill drops to 30% — the machine is dead.
4. **900ms hold.** Total stillness. Let it sit.
5. The square **snaps back inside the circle** — `cubic-bezier(0.34, 1.3, 0.64, 1)`, 240ms. This is the only overshoot in the entire website, and it is the sound of a lock re-engaging. Page returns to paper over 400ms. Circle returns to 1px ink.
6. A log line is **appended permanently below the circle** and stays for the session:
   `16:04:41 · #A-118 · تجاوز الحد · أُوقف · أُعيد التشغيل`
   Drag it again and a second line appends. Third, fourth. After the fifth, a line appears in ink, not mono: **`لن تملّ من هذا. ولا نحن.`** ("You won't get tired of this. Neither will we.")

**Why it wins:** it is the only colour and the only darkness on the entire site, so it detonates. It converts the most abstract feature in the brief (GPS geofence radar) into a thing the buyer performs with his own hand. It is ~120 lines of vanilla JS, zero libraries, zero images, and it costs nothing on a mid-tier Android. And a white page with a red circle and an Arabic shutdown log is instantly recognisable at WhatsApp thumbnail size.

---

## 7. MOTION LANGUAGE

**Governing principle: nothing moves unless it is data, type setting itself, or a state changing. Nothing floats. Nothing parallaxes. Nothing scales in on scroll.** If you remove all motion from this site, it is still 95% as good — that is the test it must pass.

| Use | Curve | Duration |
|---|---|---|
| Type/element settle | `cubic-bezier(0.16, 1, 0.3, 1)` | 620ms |
| UI state (hover, toggle, accordion) | `cubic-bezier(0.2, 0, 0, 1)` | 180ms |
| Numeric counters (tabular) | `cubic-bezier(0.33, 0, 0.15, 1)` | 1400ms |
| Tick-mark hero sweep (clip-path) | `linear` | 900ms |
| Theme inversion (breach) | `cubic-bezier(0.4, 0, 0.2, 1)` | 180ms out / 400ms back |
| **Breach snap-back — the only overshoot on the site** | `cubic-bezier(0.34, 1.3, 0.64, 1)` | 240ms |
| Route change | opacity `linear` + 8px inline-start translate | 240ms |

Stagger: 40ms, capped at 6 items. Scroll reveals: opacity `0.001 → 1` plus 12px translate only — **never** scale, never blur. `prefers-reduced-motion`: all reveals become instant, counters snap to final value, the Boundary still works (it's a pointer interaction, not an animation).

---

## 8. ART DIRECTION

**Colour — 9 values, and that is the whole system.**

| Token | Hex | Use |
|---|---|---|
| `--paper` | `#F2EFE9` | Riyadh limestone. Not white — warm, so the ink sits |
| `--paper-2` | `#E8E4DB` | Gutters, table zebra |
| `--ink` | `#12110F` | Everything textual |
| `--ink-60` | `#5C5850` | Captions, mono |
| `--rule` | `#CFC9BC` | Every hairline |
| `--signal` | `#D93A16` | Breach + primary CTA underline. Appears **twice** on the entire page |
| `--night` | `#0B0C0C` | Control-room section + breach state |
| `--trace` | `#0083B3` | Cyan, demoted to a 1px data trace. Darkened for AA on paper |
| `--link` | `#0E6DD0` | Interactive text only |

Mint `#1FD3B8` is **retired**. Cyan `#00AEEF` survives at full strength in exactly two places: the r-mark, and the live pulse dot inside the dark control-room section. Cyan stops being atmosphere and becomes ink. Defend this in the room — it is the single highest-leverage decision in the pitch.

**Light.** There is none. No shadows, no glows, no blurs, no gradients anywhere in the stylesheet. Depth comes from hairlines and white space. `box-shadow` should not appear once in the codebase.

**Type.**
- **Arabic + Latin display/text: 29LT Zarid Sans** (29Letters, Pascal Zoghbi) — editorially confident, has a *matched* Latin so we never pair mismatched families. Licence ≈ $400–900. **Free fallback if the budget dies: IBM Plex Sans Arabic** (pairs perfectly with the Plex Mono already sitting in `/public/fonts`).
- **Data, labels, captions, logs: IBM Plex Mono 400/500** — already in the repo. Tabular figures, `font-variant-numeric: tabular-nums`. This is the Teenage Engineering register: instrument, not interface.
- **Readex Pro is dropped.** It is a fine face and it is *everywhere* in Saudi web work — using it forfeits the whole argument.
- **Numerals: Western (0–9), not Indic (٠–٩)** in the data tables — Saudi B2B reads P&L in Western figures. Indic numerals are used deliberately in the editorial captions and plate numbers for texture.
- **Scale:** 11vw / 4.8rem / 2.4rem / 1.5rem / 1.0625rem / 0.8125rem mono. Measure capped at 62ch Arabic, 68ch Latin.
- **The non-negotiable rule:** `[lang="ar"], :root[dir="rtl"] { letter-spacing: 0 !important; }` — hard-locked in the reset. Latin tracking is applied only via a `.tracked` class that can never reach Arabic. Arabic gets air through `word-spacing` and leading, never tracking.

**Texture.** One only: a 3% opacity paper grain as a 180-byte inline SVG `feTurbulence`, tiled, `pointer-events:none`, disabled below 400px width. Nothing else. No noise overlays, no mesh, no glass.

**Imagery.** Machine renders are silhouetted onto paper with a soft contact shadow removed and replaced with a 1px ground rule. Logos re-traced to single-ink SVG. The films are treated as **plates**: framed, captioned, 3:2, never full-bleed, never behind text.

---

## 9. CTA STRATEGY

Three tiers, and the primary appears **three times, not nine.**

1. **Primary — `اطلب عرضاً لأسطولك`** ("Request a proposal for your fleet"). Opens a 3-field form: name, WhatsApp, number of machines. Nothing else — the machine count is the qualifier and it flatters the buyer. Rendered as **ink text with a 1px `--signal` underline that thickens to 2px on hover**, never a filled pill. Positions: masthead (right, small), immediately after **The Boundary** (peak emotion), and the closing page (full-width, 4vw type, alone on white).
2. **Secondary — `تواصل عبر واتساب`.** The real channel in this market. On mobile it lives in a persistent bottom hairline bar — 44px tall, paper background, one rule, no floating bubble, no badge.
3. **Tertiary — `حمّل كرّاس المواصفات (PDF)`.** A genuinely beautiful 8-page spec booklet set in the same system. This is the lead magnet the concept was born to have: the site is a manual, so of course there is a printed manual. Sits in the colophon and under the comparison table.

---

## 10. MOBILE

This concept is not degraded on a phone — **it is more native there than on desktop**, because a phone is a page and this is a page.

- Single column, 88vw measure, headline at 9vw with the same 0.94 leading. The 97 tick marks become 3 rows of 32 — arguably better.
- **The Boundary is superior on touch.** You drag a machine out of its zone *with your finger* and the phone in your hand goes dark. That's a physical metaphor a mouse cannot deliver. The circle is `78vmin`.
- The comparison table stays a table — horizontally scrollable with a sticky first column and a 1px scroll shadow. **It is never converted into stacked cards**; the whole point is seeing three columns side by side.
- No hamburger. Six nav items become three in a bottom hairline bar.
- The control-room section serves a 1x mobile crop, not a scaled desktop screenshot.
- Text-led design means mobile loses *nothing*, which is precisely the argument against the effects-led competitor site that must throw half its ideas away below 768px.

---

## 11. TECH

Realistic on Next.js 14 App Router / React 18 / Vercel, no Tailwind, no animation library.

- **RSC by default.** Exactly three client components on the whole page: `<Boundary />`, `<Counter />`, `<Accordion />`. Everything else is server-rendered static HTML.
- **Zero animation dependencies.** Web Animations API + CSS transitions + IntersectionObserver. `three@0.149.0` gets **deleted** — that's ~600 kB of dead weight.
- **Fonts:** self-host 4 woff2 files, subsetted to Arabic + Arabic-Supplement + Latin-basic + digits (~34 kB each). Preload the display weight only. `size-adjust`/`ascent-override` metric-matched fallback so there is no layout shift and no FOIT on a Moto G.
- **Assets:** delete `/public/assets/flow` (46 MB — it is currently shipping a 72-frame sequence *and* three `master.mp4.partNN` chunks). Ship one 1.6 MB h.264 film + a 28 kB poster, `preload="none"`, `playsinline muted`, play on intersection, pause on exit. Re-trace 13 logos to single-ink SVG — real production work, budget 2 days.
- **RTL:** `dir="rtl"` on `<html>`, CSS logical properties throughout (`margin-inline-start`, `padding-block`, `inset-inline`). The `/en` route is a locale segment, not a duplicate stylesheet. The geofence circle mirrors as a no-op.
- **Budget, enforced in CI:** ≤ 115 kB First Load JS, LCP ≤ 1.4s on a throttled Moto G4, CLS = 0, TBT < 120ms, 100 Lighthouse Accessibility. All of this is *comfortably* achievable because the site is text — the restraint is what buys the performance.
- **Timeline:** 3 weeks design + 2 weeks build with one senior front-ender. The long pole is not code, it is Arabic typesetting and logo re-tracing.

---

## 12. RISK — the honest answer

**The client loses his nerve in week two.** This concept has no hedge and no halfway point. A white, near-effectless page screenshots *badly* out of context — a single frame in a WhatsApp forward looks unfinished, and someone on the client's side will say "أين التصميم؟". In a market where every competitor equates dark-plus-glow with technological sophistication, restraint reads as underspend until you scroll it. If the owner asks for "just a little gradient in the hero" and it gets granted, the result is a white site with cyan bolted on — worse than either pure option, and the whole argument collapses.

**Second risk, smaller but real:** restraint has zero margin for error. With no effects to hide behind, every hairline, every optical margin and every Arabic ligature is naked. This cannot be shipped by an engineer working alone from a Figma file, and it cannot be shipped on a free Google font. It needs a licensed Arabic face and someone who can actually set Arabic. If either is cut, the concept fails — not softly, but completely.

**Mitigation:** build The Boundary section first, standalone, as the pitch prototype. It is 120 lines of JS. Put it on the owner's phone before a single other pixel is designed. If he drags that square out of the circle and his phone goes black, he will stop asking for glow.

---

## 13. WHY THIS BEATS A GENERIC FINTECH SITE

1. **It is the only one you can identify with the logo cropped off.** Dark navy + cyan + gradient mesh is a uniform; six Saudi paytech sites are interchangeable at thumbnail size. A white page with a red circle is not.
2. **Restraint is the product argument, not a style choice.** The competitor's site is dark because they are hiding a thin product. R.Pay's is light because it has 465,255 transactions, Roshn's logo, and a feature list its named competitors cannot match. Form and claim finally agree.
3. **The comparison table becomes the hero of the sale.** On a glowing site it would be one more card in a sea of cards. On a Swiss timetable, one full ink column beside two empty ones is a sentence, and every operator in the room reads it in two seconds without a word of copy.
4. **It converts the single most abstract feature into a physical act.** No competitor's site lets you *steal a machine* and watch the system punish you. That's not a feature list — that's a demo, and it costs 120 lines of code.
5. **It is faster, and speed is the market.** Text-first on mid-tier Android beats gradient-mesh-plus-WebGL on every metric that matters in Saudi mobile. The premium look and the performance budget are, for once, the same decision.
6. **It respects Arabic.** Almost every site in this category treats Arabic as translated English — tracked, cramped, set in whatever the theme shipped with. Setting Arabic properly, at size, on white, with real editorial rigour, is a form of respect the buyer feels before he can name it.

**The wow the owner is asking for is not another effect. It is the moment he realises R.Pay is the only company in the category confident enough not to shout — and that everyone else suddenly looks like they were shouting to cover something up.**

########## CONCEPT 5: OBJECT ##########
# AXIS
## المِحوَر

---

## 1. CONCEPT NAME

**AXIS** — Arabic: **المِحوَر** (al-miḥwar: the axis, the pivot, the thing everything turns on).

And the strategic gift inside the name: **we name the hardware.** The terminal currently has no name. It becomes **محور ٠١ / AXIS 01**. R.Pay stops being a service company with a website and becomes a company that makes a *thing* — and the site is that thing's launch page.

---

## 2. THE ONE-LINE IDEA

**A product launch page for the object your entire business turns on.** One device, one light, one axis of rotation — and a site that lets you try to steal it.

Arabic line: **«كل ما تملكه يدور حول هذا الجهاز.»**

---

## 3. MANIFESTO

Every payments company in the Gulf sells an abstraction: gradients, floating glass cards, the word "seamless". R.Pay does not sell an abstraction. R.Pay sells a black machined slab, bolted to a claw machine in Boulevard World, that decides whether an operator gets paid tonight. The buyer is not a CFO reading a whitepaper — he is a man who owns 97 physical objects scattered across nine branches and lies awake wondering whether one of them is dark, broken, or in the back of somebody's truck. An abstract site is *literally untrue* to that anxiety. The truest, most premium, most differentiated thing R.Pay can do is put the object on a plinth, light it like a Leica, and let the buyer turn it in his hands. Materiality is not decoration here — it is the argument. If the device looks inevitable, the platform behind it is assumed. Nobody screenshots a gradient. Everybody screenshots an object.

---

## 4. THE HERO

**Second 0.0 — 0.6.** Total black (#05070A). No logo, no nav, no headline. Dead centre, small — occupying maybe 22% of viewport height — a single unlit black slab, three-quarter view, portrait, floating in nothing. It reads as a stone. One 0.5px hairline in #1E262F runs the full width of the screen behind it, with caliper tick marks at each end: a technical drawing that hasn't been dimensioned yet.

**0.6 — 1.4.** The seam ignites. Not a glow — a *filament*. The cyan light-pipe that wraps the device's body lights from the bottom-left corner and travels around the perimeter in 700ms, like current finding its path. The screen wakes 200ms behind it: `R.Pay` mark, then `اضغط للدفع`. The device's specular highlight sharpens as the key light comes up. This is the entire animation. Nothing else has moved.

**1.4 — 2.6.** Type arrives, right-aligned, from the right edge, 24px travel, 640ms:

> **هذا هو الجهاز.**
> **٤٦٥٬٢٥٥ عملية مرّت من هذا السطح.**

Below it in mono, small, bone-coloured: `AXIS 01 · TERMINAL · RIYADH`

**2.6 — 4.5.** The device begins a slow 22° rotation — not spinning, *settling*, as if placed. The light rakes across the anodized face and the seam catches. The nav fades in at 15% opacity and only reaches full opacity on first scroll.

**4.5 — 6.0.** A single line of mono text appears under the device, pulsing once:

`اسحب الجهاز ←`  *(drag the device)*

That instruction is the whole site's thesis: this page is not read, it is handled.

**No video plays in the hero. No music. No particles.** The wow is that a payments site opened in silence with one lit object and dared you to touch it.

---

## 5. SECTION-BY-SECTION

**01 · الجهاز — THE OBJECT** *(hero, above)*
Job: establish that this is hardware, not software marketing. Beat: **stillness / reverence.**

**02 · المقاس — DIMENSIONED**
The device rotates to a flat orthographic side elevation as you scroll. Caliper lines extend, dimension arrows draw themselves left-to-right, mono labels: `112 mm`, `NFC · EMV L1/L2`, `IP54`, `4G / Wi-Fi`, `LED RING 360°`. It looks like a page from a spec sheet, because it is.
Job: credibility through engineering language. Beat: **this was designed, not sourced.**

**03 · الضوء يقول الحقيقة — THE SEAM SPEAKS**
Full-bleed, device close-cropped so only the seam is in frame. Three states cross-fade as you scroll: cyan `#00AEEF` = يعمل، mint `#1FD3B8` = تم التحويل (money landed), amber = تنبيه. One sentence: **«لن تحتاج أن تسأل إن كان يعمل.»**
Job: turn a hardware detail into the brand's semantic system. Beat: **calm.**

**04 · من الداخل — SECTION CUT**
The device splits along its long axis and separates into six labelled layers — screen, NFC antenna, secure element, LED ring, SIM/4G module, chassis — held apart in the dark, each with a hairline leader line. Scroll-scrubbed, 30 frames.
Job: prove depth. Beat: **respect for the engineering.**

**05 · حاول أن تسرقه — TRY TO STEAL IT** ← **the signature moment (§6)**
Job: demo the geofence differentiator by making the visitor commit the crime. Beat: **shock, then relief, then a laugh.**

**06 · المال يصل — DIRECT SETTLEMENT**
Hard cut to the only warm frame on the site: a single mint line travels from the device, past a greyed-out node labelled «وسيط» that is crossed out with one stroke, into a node labelled «حسابك». 1.2 seconds. **«حسابك. مباشرة. بلا وسيط.»** Under it, the auto-refund: a failed transaction reverses along the same line, unprompted.
Job: kill the #1 money anxiety. Beat: **trust.**

**07 · الأسطول — THE FLEET**
The single object multiplies. 97 tiny terminal silhouettes fill the screen in a grid; 90 seams lit cyan, 7 dark. The dark ones are individually hoverable and name a branch. **«٩٠ من ٩٧ تعمل الآن.»** Then the grid collapses into the real dashboard UI — the platform, revealed as the second half of the product, *earned* only after the object has been loved.
Job: sell the platform. Beat: **command.**

**08 · المكائن — WHERE IT LIVES**
Three machine renders (vending / arcade / coffee) in the same black studio, same key light, each with the AXIS 01 fitted and its seam lit. Consistent lighting is the point: they are now a family.
Job: category breadth. Beat: **fit.**

**09 · القنوات — RAILS**
A single quiet row, monochrome bone marks: mada · VISA · Mastercard · Apple Pay · stc pay · GCCNET. No colour logos. They tint cyan only on hover.
Job: table stakes, dispatched in 4 seconds. Beat: **assurance.**

**10 · مركّب في أماكن تعرفها — INSTALLED**
The 13 client logos, all rendered in single-colour bone `#E8E2D6` at identical optical weight, on a slow marquee that *pauses* on hover and reveals the venue in mono. Roshn, Boulevard World, LuLu, Dar Al Arkan, Sela…
Job: borrowed authority, without a logo-soup wall. Beat: **you are late, not early.**

**11 · اللوحة المقارنة — THE PLACARD**
The competitor comparison, but staged as a museum placard beside the object: R.Pay column in bone with filled marks, SurePay/Geidea columns at 40% opacity with hollow marks. Eight rows. No colour, no "vs" graphics, no smug copy. The asymmetry does the talking.
Job: close the rational sale. Beat: **quiet superiority.**

**12 · الأرقام — THE RECORD**
465,255 · 97 · 9 · 9,434 — mono, tabular figures, huge, counting up once on entry, Arabic-Indic numerals with a toggle.
Job: proof. Beat: **weight.**

**13 · جهازك القادم — ORDER**
The device returns, one last time, full height, seam lit, rotating to face the viewer dead-on for the first time on the page. Three fields: عدد المكائن / المدينة / رقم الجوال. **«ابدأ التشغيل.»**
Job: convert. Beat: **inevitability.**

**14 · Colophon**
A technical line-drawing of AXIS 01 with full dimensions, made in Riyadh, «شركة سعودية». Downloadable as a wallpaper. Collectors' behaviour for a payment terminal — that's the flex.

---

## 6. THE SIGNATURE MOMENT — «حاول أن تسرقه»

**The website lets you steal the machine, and the machine kills itself in your hand.**

Full-viewport section. The AXIS 01 sits at centre on a dark aerial plate. Behind it, an SVG geofence: an inner disc r=140 and a boundary ring r=200, the boundary drawn `stroke-dasharray: 2 10`, with a conic-gradient radar sweep masked to the ring, 4s linear infinite. Mono readout under the device: `24°42'31"N 46°40'12"E · ±2m`.

State machine: `IDLE → GRABBED → WARN → BREACH → SHUTDOWN → RESTORE`.

- **GRABBED** — `pointerdown` on the device, `setPointerCapture`. Scale 1.02 (180ms, ease-light), contact shadow lifts and softens, seam brightens to `#6FE8FF`. Coordinates begin updating live with drag delta.
- **u = distance / 200.** `u < 0.7`: seam holds `#00AEEF`, label «داخل النطاق».
- **WARN** (`0.7 ≤ u < 1`): seam hue lerps toward `#FFB020`, boundary stroke 1→2px, an 800 Hz tick every 400 ms via WebAudio (legal — the drag *is* the user gesture), `navigator.vibrate(8)` per tick, label «تحذير: يقترب من الحدّ».
- **BREACH** (`u ≥ 1`): 60ms white flash at 0.12 opacity. Then a single class on `<main>` swaps every accent CSS variable to `#FF3B30` for 900ms — nav, hairlines, CTA, cursor, *the whole page goes red*, which is the part people screenshot. `navigator.vibrate([30,40,30])`. Two 1200 Hz chirps. A toast drops from the top edge: **«تنبيه: الجهاز خارج نطاقه الجغرافي — تم الإيقاف تلقائيًا»** with a live counter `00:00:01`.
- **SHUTDOWN** (+350ms): seam fades to `#0B0F14` over 500ms `cubic-bezier(0.4,0,1,1)`, sprite crossfades to a dead-screen frame, drops 8px, saturation → 0. The object is now a brick in your hand.
- **RESTORE** (on `pointerup`, or auto after 1.6s): springs home, 720ms `cubic-bezier(0.16,1,0.30,1)`, seam relights over 180ms. Line resolves: **«هذا ما يحدث حين يتحرّك جهازك. تلقائيًا. خلال ثانية واحدة.»**

Fallbacks: `prefers-reduced-motion` and pointerless input get a labelled slider «حرّك الجهاز» driving the same `u`; arrow keys step 0.05; each state announced in an `aria-live="polite"` region. Instrumentation: fire `geofence_breach` — **anyone who breaches is a qualified lead**, and the primary CTA reveals itself immediately after first breach.

Cost: ~120 lines of JS, one SVG, one extra sprite frame. No 3D engine.

---

## 7. MOTION LANGUAGE

**Governing principle: LIGHT IS FAST. MASS IS SLOW.** Anything emissive responds in 120–180ms. Anything with weight moves in 640–900ms. **Nothing is allowed to animate between 180 and 320ms** — that mushy middle is where "generic web animation" lives.

```
--ease-light:  cubic-bezier(0.40, 0, 0.20, 1)   /* 120–180ms — seam, hover, focus */
--ease-mass:   cubic-bezier(0.16, 1, 0.30, 1)   /* 640ms — objects arriving, springing home */
--ease-camera: cubic-bezier(0.65, 0, 0.35, 1)   /* 900ms — rotation, pans, section cuts */
--ease-exit:   cubic-bezier(0.40, 0, 1, 1)      /* 240ms — things leaving, shutting down */
```

Stagger 40ms, max 6 items, never more. All scroll choreography is rAF-throttled frame scrubbing — never a scrubbed `<video>` (unreliable on Android). RTL mirroring is a token, not a hack: `--enter-x: 24px` in RTL, `-24px` in LTR; the camera always orbits toward the reading direction. One light source per viewport, always. There is never a second glow on screen.

---

## 8. ART DIRECTION

**Colour.** De-blue the ground — the current navy `#040f1e` fights the cyan. New ground is neutral graphite so the seam is the only chroma on the page.

```
--ground:    #05070A   /* black, faintly cool */
--surface:   #0B0F14
--raised:    #141A21   /* dark anodize */
--hairline:  #1E262F   /* 0.5px technical lines */
--bone:      #E8E2D6   /* all typography — never pure white */
--muted:     #7C8794
--seam:      #00AEEF   /* brand cyan — LIVE */
--seam-hot:  #6FE8FF   /* emissive peak only */
--depth:     #0E6DD0   /* rim light, never fills */
--money:     #1FD3B8   /* SEMANTIC LOCK: mint appears only when riyals move */
--alarm:     #FF3B30   /* used exactly ONCE on the entire page */
```

Bone instead of white is the single biggest anti-generic move: it reads as Saudi daylight on metal, not as another SaaS dark mode.

**Light.** One key at 35° camera-left, one cyan practical (the seam itself), one cold rim `#0E6DD0` at 8% to separate the object from the ground. Contact shadow always present — objects touch something. Zero ambient glow, zero background gradients, zero blurred blobs.

**Type.** Display: **Readex Pro** (variable, Arabic + Latin, geometric with real headline authority). Body/UI: **IBM Plex Sans Arabic**. Data/spec: **IBM Plex Mono** with `font-variant-numeric: tabular-nums`. Rules, enforced in CSS: `letter-spacing: 0` on every Arabic node, no exceptions; tracking `+0.14em` permitted **only** on Latin mono spec labels; Arabic display leading 1.15, body 1.75; Arabic-Indic numerals by default with a Western toggle. Fluid: display `clamp(3.5rem, 9vw, 8.75rem)`, h2 `clamp(2.25rem, 4.5vw, 4.5rem)`, body 17→19px, mono 12/13px.

**Texture.** Exactly three: (1) 3% monochrome grain, 128px tile, `background-repeat` over the ground — kills banding on cheap Android panels and adds film; (2) anisotropic brushed-anodize highlight baked into the renders; (3) the technical-drawing layer — 0.5px hairlines, caliper ticks, dimension arrows — used as the page's visible grid.

**Imagery.** No stock. No offices. No handshakes. No people above the fold at all. One human moment, late and small: a child's hand on a claw-machine joystick, sub-second, in section 08. Logos monochrome bone at matched optical weight.

---

## 9. CTA STRATEGY

Three tiers, no more.

- **Tier 1 — «ابدأ التشغيل»** (Start operating). Not "contact us", not "request a demo" — the language of installation. Three fields only: عدد المكائن، المدينة، رقم الجوال. Appears at hero (ghost, low-emphasis), **auto-revealed the instant someone breaches the geofence**, at section 07, and in section 13 as a full-screen commitment. On mobile it is a sticky bottom bar that only materialises after 25% scroll.
- **Tier 2 — «ادخل اللوحة»** — a read-only live sandbox of the real dashboard with realistic fleet data. This closes technical operators who need to see the tool.
- **Tier 0 — WhatsApp.** This market closes on WhatsApp. A single small mono link, always present in the footer bar, visually subordinate but never more than one thumb away. Do not pretend otherwise.

---

## 10. MOBILE — WHERE THIS CONCEPT IS *BETTER*

AXIS 01 is a portrait object. A phone is a portrait frame. This concept was born on mobile and merely tolerates desktop.

- The object fills a phone screen at near 1:1 physical scale — on desktop it is a photograph of a thing; on a phone it is **the thing, actual size**.
- Rotation maps to vertical scroll; the frame sequence is scrubbed by scroll position, which is the most natural gesture on the platform.
- The theft demo is *dramatically* better with a thumb than a mouse: real drag inertia, real haptics via `navigator.vibrate`, real physical dread.
- **Mobile-exclusive moment:** with `DeviceOrientationEvent` (permission-gated on iOS behind a tap), tilting the phone drives the specular highlight travelling along the seam. Tilt the device, the light moves on the metal. Desktop cannot do this. Ship it as a feature, not a fallback.
- Sequences served at 720w AVIF, 48 frames instead of 96 (every other frame), same choreography, ~55% of the bytes.

---

## 11. TECH

**No WebGL. Kill `three@0.149.0`.** This is the load-bearing engineering decision and it is consistent with the provocation, not a retreat from it: Apple's product pages are frame sequences and video, not GPU demos. We are not shipping a renderer; we are shipping a photographed object. Frames give us cinema-grade materials, deterministic performance on a Galaxy A-series, and zero shader-compile jank.

- **Render pipeline:** re-model AXIS 01 in Blender/Cycles from the existing render as reference. Output 4 sequences — hero settle (96f), section cut (30f), fleet (loop), final face-on (40f) — at 1440w / 1080w / 720w, AVIF with WebP fallback. ~22 KB/frame at 720w.
- **Playback:** `<canvas>` + a preloader that `createImageBitmap`s into a ring buffer; frames 1–8 preloaded, remainder streamed on idle. **LCP is frame 001 rendered as a plain `<img fetchpriority="high">`** — the hero is visually complete before a single byte of JS executes; canvas takes over silently at hydration.
- **Framework:** Next.js 14 App Router, fully static (`generateStaticParams` for `/ar` and `/en`), zero client components above the fold. Motion in raw CSS + a ~4 KB rAF scrub hook. No Framer Motion, no GSAP, no Tailwind — vanilla CSS with custom properties, which the codebase already uses well.
- **Budget:** +40 KB JS over the current baseline → **~130 KB First Load JS**. Targets: LCP < 2.0s on Moto G Power / Fast 3G, INP < 200ms, CLS 0. Frame sequences excluded from LCP by construction.
- **Effort:** 3D/render 3–4 weeks (the long pole, parallelisable), build 3 weeks, polish 1 week.

---

## 12. RISK — THE HONEST VERSION

**This concept has a single point of failure: the renders.** It is a materiality play, and it dies instantly if the object doesn't look expensive. The existing terminal asset reads as glossy AI plastic with a candy bloom — at 1440px full-bleed on a plinth, that will look cheap, and cheap hardware makes the whole company look cheap. There is no design system, no easing curve, and no headline that survives a bad render. If the client will not fund a proper CG re-render (or a real product photography session with the actual unit), **do not build this concept** — build something 2D and typographic instead. That is the honest answer, and I'd rather say it now than after the invoice.

Secondary risks: (a) object-worship can under-sell the dashboard, which is the real moat — section 07 exists specifically as the antidote and must not be cut for time; (b) operators are ROI animals, not aesthetes, so the numbers and the comparison placard must arrive before minute two; (c) naming the hardware "AXIS 01" implies a product line the company must be willing to honour.

---

## 13. WHY THIS BEATS A GENERIC FINTECH SITE

Because a generic fintech site is a picture of software, and R.Pay's product is a picture of a *place*. The competitor set — SurePay, Geidea, every payment gateway in the Gulf — all converge on the same page: a floating phone mockup, a purple-to-blue gradient, three feature cards, "seamless payments for your business". That page is interchangeable, and interchangeability is the actual competitive problem.

AXIS is not interchangeable, for three reasons that compound:

1. **It is true.** The buyer's anxiety is physical — is the machine on, is it there, did my money move. A site made of objects and status lights speaks his language; a site made of gradients speaks a consultant's.
2. **It converts the differentiator into an experience.** Every competitor *lists* "geofencing" as a bullet. We make you commit the theft and feel the device die in your thumb. A bullet is forgotten in ten seconds; that is remembered for a year and forwarded to a colleague within a minute.
3. **It manufactures scarcity of attention through restraint.** One object. One light. One accent colour at a time. One use of red on the entire page. In a category screaming with glow and motion, silence and mass are the loudest available position — and they cost 130 KB, which means the premium survives contact with a mid-tier Android on Riyadh 4G.

The wow is not more. The wow is that a payments company had the confidence to show you one black object in the dark and say: **هذا هو الجهاز.**

########## CONCEPT 6: LEDGER ##########
# ONE RIYAL — «ريال واحد»
### *the site is the journey of a single riyal, from a child's thumb to your bank account*

---

## 2. THE ONE-LINE IDEA

**We don't show you a dashboard. We follow one riyal — tap to bank — in front of your eyes, and then multiply it by 465,255.**

---

## 3. MANIFESTO

Every self-service payment site in this market sells the same two lies: a photograph of a terminal, and a screenshot of a dashboard. Neither is what the operator buys. An operator with 97 machines spread across Boulevard World, LuLu branches and Roshn communities does not lie awake thinking about UI. He lies awake thinking about three sentences: *is my money reaching me, is it reaching me directly, and is my machine still where I left it.* R.Pay is the only company in the comparison table that can answer all three — direct settlement with no middleman, automatic refund with no human, and a geofence that kills a machine the moment it moves. So the website should not be a brochure about a product; it should be **evidence**. It should be an annual report that moves. We take the smallest unit of the business — one riyal — and we make its journey visible, timed, and auditable, with the geofence radar standing over it as the guard. Hardware appears only as evidence, never as hero. The wow is not glow. The wow is that a stranger's money arrived, on screen, in 1.9 seconds, and you watched it happen.

---

## 4. THE HERO — first 3 seconds, next 5

**0.0s — 0.6s.** Near-black (`#060B14`). Nothing but a single hairline rule entering from the **right** edge of the screen (RTL: money must travel *with* the reading direction) and stopping dead centre. Above it, one line of Readex Pro 700, Arabic, no tracking: **«تابِع ريالاً واحداً.»** — *Follow one riyal.* Nothing else. No logo lockup yet. No nav bar yet.

**0.6s — 1.4s.** From the repo's existing 72-frame WebP sequence, an extreme close-up fades up at 18% opacity behind the type: a thumb and a mada card approaching the reader on an arcade machine. The frame is desaturated to almost monochrome — the only colour in the shot is the reader's cyan ring.

**1.4s — 3.0s.** Contact. On the tap frame, the shot flashes one stop brighter for 90ms, and an **ivory dot (`#FFF6E3`, 6px)** is born at the exact pixel of the card and lands on the hairline rail. A monospaced timestamp writes itself under the rail: `00.00s — التقاط`. The dot begins moving, right to left, slowly. That's the first three seconds.

**3s — 8s (the next five).** The camera does not move; the *ledger* moves. The dot travels leftward along the rail and, as it passes, four stations print themselves — hairline tick, Arabic label, monospaced timestamp — like a receipt being printed sideways: `00.4s تفويض` · `00.9s مقاصة` · `01.6s تسوية مباشرة` · `01.9s حسابك`. On the final tick the dot doesn't burst or sparkle. It simply **stops, and turns from ivory to mint `#1FD3B8`**, and one line appears beneath: **«وصل. بدون وسيط.»** *Arrived. No middleman.* Only now does the R.Pay mark fade in, small, top-right, alongside the nav. Total: eight seconds, one dot, one line, zero gradients.

The masthead never returns. The rail, however, runs down the *entire page* — a persistent 1px vertical line on the right margin, with the dot travelling on it as you scroll. **The scrollbar is the money.**

---

## 5. SECTION-BY-SECTION

| # | Section | Job to be done | Emotional beat |
|---|---|---|---|
| 01 | **الالتقاط — The Tap** (hero) | Establish the premise: one riyal, timed | Curiosity → attention |
| 02 | **أثر الريال — The Trace** | Scroll-scrubbed sequence: the five stations expanded, each with what R.Pay actually does at that moment (auth, clearing, settlement account, ledger write) | Comprehension, calm |
| 03 | **بدون وسيط — Cut the Middleman** | A two-state ledger. Toggle «مع وسيط / مع R.Pay». In the first state the riyal detours through an extra account and a `T+3` stamp; in the second it goes straight, `T+0`. Same riyal, two fates | Suspicion → relief |
| 04 | **الريال الذي لم يصل — The Riyal That Failed** | The quietest, best section on the site. One riyal fails at authorisation. Rail turns amber, dot reverses direction, returns to the child's card, log line: `استرجاع تلقائي — بدون تدخل بشري`. Twelve seconds, no support ticket | Fairness, trust |
| 05 | **الحارس — The Guardian** (signature) | The geofence radar. See §6 | Fear → control |
| 06 | **الدفتر الحي — The Living Ledger** | The real numbers as an annual-report spread that types itself: 465,255 · 97 · 9 · 9,434 · 90/97 online. Each figure carries an "as of" datestamp — honesty is the aesthetic | Scale, credibility |
| 07 | **الأسطول — The Fleet** | 97 machine rows, RTL table, monospaced: branch, uptime, today's take, last heartbeat. Tap a row → the rail dot jumps to that machine | Command |
| 08 | **من أين تأتي الريالات — Where the Riyals Come From** | The 13 client logos, but NOT a logo wall: each logo is a *source node* on a map of riyal-flow, with its venue type. Roshn, Boulevard World, LuLu, Dar Al Arkan, Sela, Kinan, Hamat… | Belonging, envy |
| 09 | **الجوائز تُحسب أيضاً — Prizes Are Money Too** | 9,434 gifts as outbound ledger lines, each tied to a device ID. Money out is accounted as rigorously as money in | Completeness |
| 10 | **الأفواه — The Rails** | mada · VISA · Mastercard · Apple Pay · stc pay · GCCNET, drawn as six inlets feeding the one rail | Reassurance |
| 11 | **باسمك أنت — White Label** | The rail redraws in the visitor's own colour; the hero line re-renders with a placeholder brand name | Ownership |
| 12 | **كشف حسابك الأول — Your First Statement** | The close. A real statement layout, addressed to a blank name field. Typing your name into the statement *is* the lead form | Desire → action |
| 13 | **Colophon** | Footer as a ledger footer: totals, company registration, "شركة سعودية", contact | Institutional weight |

---

## 6. THE SIGNATURE MOMENT — «حرّك المكينة» / *Move the machine. Go ahead.*

Section 05. Full viewport, near-black. Centre: a 320px circle drawn as a dashed hairline (`stroke-dasharray: 2 6`, rotating at 0.25°/s — a radar sweep so slow it reads as breathing, not animation). Inside it, one of the repo's machine renders (`machine-arcade.webp`) sits at ~140px, with a live counter above it: `اليوم: ٤٨٢ ﷼` ticking up every few seconds. Below: a single instruction in Arabic — **«اسحب المكينة خارج نطاقها.»** *Drag the machine outside its zone.*

**It is draggable.** Pointer/touch drag, `transform: translate3d()` only, no layout.

- **Inside the ring:** normal. Faint cyan `#00AEEF` hairline connects machine to ring centre. Counter keeps ticking.
- **Crossing the boundary (`distance > r`):** at the exact crossing frame, in **180ms** — the ring snaps from cyan to alert red `#FF4B3E`; the machine render desaturates to 0 and drops to 55% brightness; the day-counter **freezes mid-digit** and greys out; the vertical page rail, above and below this section, floods red for its whole visible length; and a log line types itself, left-aligned monospace, one character per 12ms:
  `14:22:07 · جهاز #A-47 غادر النطاق · إيقاف تلقائي · تنبيه المالك`
- **Held outside:** the machine is dead. Dragging further does nothing but extend a red measuring line with a live distance readout (`٣١ م خارج النطاق`). This is the screenshot frame.
- **Release:** the machine returns to centre on `cubic-bezier(0.22, 1, 0.36, 1)` over **760ms**, ring returns to cyan over 900ms, counter resumes *from where it froze* (not from zero — the freeze must feel like preserved value, not lost value), and a second log line prints: `14:22:41 · عاد للنطاق · استئناف`.

Under it, one sentence, the only pull-quote on the page, in Newsreader italic for the English version and Readex 600 for Arabic: **«لا تُسرق أموالك، لأن المكينة لا تستطيع المغادرة.»** — *Your money can't be stolen, because the machine can't leave.*

Engineering notes: one SVG, one draggable `<img>`, `pointerdown/move/up` with pointer capture, radius test in a rAF-throttled handler, all state as CSS custom properties on a wrapper (`--breach: 0|1`) so every reaction — ring colour, rail colour, desaturation — is CSS driven off a single class toggle. Touch: `touch-action: none` on the machine only. Reduced motion: drag still works, transitions collapse to 0ms, log lines print instantly. Auto-demo: if no interaction after 6s in view, the machine drifts out and back once by itself, then stops nudging.

---

## 7. MOTION LANGUAGE

**Governing principle: the money moves; the page holds still.** No parallax, no floating cards, no scale-in-on-scroll, no springs. Every animation is either *transport along the rail*, *a ledger line printing*, or *a state change*. If it isn't one of those three, it doesn't ship.

- **Transport (dot along rail, machine snap-back):** `cubic-bezier(0.22, 1, 0.36, 1)`, 640–760ms
- **Ledger print (rows, log lines, stations):** `cubic-bezier(0.16, 1, 0.3, 1)`, 420ms, stagger 60ms, opacity + 8px translate along the inline axis only (RTL-aware: `translateX(8px)` becomes logical)
- **Number counters:** 1200ms, `cubic-bezier(0.33, 1, 0.68, 1)`, tabular figures, never counts from 0 on a figure over 100k — start at 92% of target so it reads as *live*, not as a party trick
- **Alert / breach:** in `cubic-bezier(0.4, 0, 0.2, 1)` 180ms; recovery 900ms. Danger arrives fast and leaves slowly. This asymmetry is the whole emotional trick
- **Scroll-linked scrub:** lerp factor 0.12 per frame toward target; never bind raw scroll
- **Typing:** 12ms/char, no cursor blink after completion
- **Reduced motion:** rail becomes a printed static line with all timestamps already visible; sequence becomes 5 stills; drag interaction retained, transitions 0ms

---

## 8. ART DIRECTION

**The reference is not a fintech landing page. It is a central-bank annual report shot by a cinematographer.** Two grounds only: *the Vault* (dark, where money moves) and *the Statement* (light paper, where money is recorded). Sections 01–05 and 07 are Vault. Sections 06, 12, 13 are Statement. The switch between them is a hard cut, no gradient.

**Colour**
- Vault ground `#060B14` · vault raised `#0B131F` · hairline `#1B2836`
- Statement ground `#F2EFE8` (uncoated stock) · statement ink `#101820`
- **Money ivory `#FFF6E3`** — reserved *exclusively* for the riyal dot and its trail. Nothing else on the site may use it
- **Cleared mint `#1FD3B8`** — settlement confirmed only
- **Live cyan `#00AEEF`** — telemetry, heartbeats, geofence at rest. Demoted from brand hero to system colour
- **Breach red `#FF4B3E`** — geofence only, appears twice on the page maximum
- **Gold leaf `#C9A227`** — used exactly ONCE, on the final settled figure in section 12. Scarcity is what makes it read as money
- Retired: `#0E6DD0` as a large-area fill. Blue gradients are banned outright

**Type**
- Arabic display: **Readex Pro 700** (already in `/public/fonts`). `letter-spacing: 0 !important` on every Arabic node, enforced by a lint rule. `line-height: 1.75`, rhythm from word-spacing, never tracking
- Arabic body/UI: **IBM Plex Sans Arabic 400/600** — institutional, banking-adjacent, pairs natively with the mono
- Numerals: **IBM Plex Mono 500**, Western digits, `font-variant-numeric: tabular-nums`. Every timestamp, riyal figure, device ID and log line is mono. Mono = machine-generated = true
- English editorial voice: **Newsreader** italic, pull-quotes and section numerals only
- The **new Saudi Riyal glyph (﷼, the 2025 mark)** ships as an inline SVG, not a font character — support is still patchy. It is the site's punctuation: it appears at every settled figure

**Light & texture.** Single-source light, always from screen-right (money's origin), falling off to black. Machine renders are treated: desaturated to 15%, multiplied over the vault ground, with the cyan reader ring re-lit by a masked SVG. The Statement sections carry a 3% monochrome paper grain (single 200×200 tiled PNG, ~4kB) and hairline column rules — annual-report furniture. No glass, no blur, no bloom, no bevel. **Zero drop shadows on the entire site.** Depth comes from value, not from blur.

**Imagery.** The 72-frame WebP sequence is the only film that appears above the fold, and only as a 18% background. The hero films in `/assets/flow` are used once, in section 08, muted, as ambient venue footage behind the client map. Client logos are rendered as monochrome ink on the Statement ground at a fixed optical size — no colour logo soup.

---

## 9. CTA STRATEGY

Three tiers, and the primary one is not "Contact us".

**Tier 1 — Primary: «شغِّل أول ريال» (Run your first riyal).** It is a booking CTA dressed as the natural end of the story: the visitor's riyal has reached the bottom of the rail, and this button starts *theirs*. Appears exactly three times: end of section 03 (after the middleman reveal — peak conviction), after the geofence signature (peak emotion), and as the statement form in section 12. Never sticky, never floating.

**Tier 2 — «احسب عائدك اليوم» (Calculate today's take).** A three-input inline calculator inside section 06: machines × average ticket × active days → a live settled figure, rendered in the gold leaf, with the settlement date stamped `T+0`. It is a lead magnet that also *proves the direct-settlement claim numerically*. Captures email only after the number is shown.

**Tier 3 — Persistent contact rail.** Bottom-left of the vertical rail: WhatsApp + phone, 32px, hairline only, always present, never animated. Saudi B2B closes on WhatsApp; pretending otherwise is design vanity.

Form: **five fields maximum** — الاسم، الشركة، عدد المكائن، المدينة، رقم واتساب. Number-of-machines is a segmented control (1–5 / 6–20 / 21–50 / +50), because it silently qualifies the lead.

---

## 10. MOBILE — not a lesser version, the *canonical* version

This concept is born vertical. A rail that runs top-to-bottom with a dot travelling down it while the ledger prints beside it is fundamentally a phone object; the desktop version is the adaptation.

- The rail moves from the right margin to a **fixed 14px inset on the right edge**, thumb-adjacent. The dot's position maps to scroll progress. Users will scrub it with their thumb — and we let them: the rail is draggable, and dragging it scrubs the whole story backward and forward. That alone is a share-worthy interaction on a phone.
- Section 02's frame sequence: **24 frames on mobile instead of 72**, decoded to a canvas at device-pixel-capped resolution. Below 4 cores or with `saveData`, it degrades to 5 stills with the timestamps printed — and honestly loses very little, because the timestamps are the content.
- The geofence signature is *better* on touch: dragging a machine out of its zone with your finger is more visceral than with a cursor. Ring diameter becomes 78vw. Haptic `navigator.vibrate(12)` at the exact boundary crossing.
- Section 07's fleet table becomes a swipeable ledger with sticky device-ID column, RTL scroll direction correct.
- Typography: hero at `clamp(28px, 8.5vw, 76px)`. Arabic never below 15px body. All spacing in logical properties (`margin-inline-start`) so the LTR mirror is free.

---

## 11. TECH

Buildable on the current stack with **no new runtime dependency**.

- Next.js 14 App Router, all pages static (`force-static`) except an optional `/api/ledger` edge route. RSC for everything; three client islands only: `<Rail/>`, `<Geofence/>`, `<Calculator/>`. Delete `three@0.149.0` — it saves nothing today but it will get imported "just once" by someone otherwise.
- **The rail dot:** one `<svg>` path, `getPointAtLength()` precomputed into a 200-point lookup table at build time, dot positioned with `transform: translate3d()` from a single rAF loop driven by a scroll listener with `{passive:true}` + lerp. One animated element on the page. Where `animation-timeline: scroll()` is supported (Chrome/Android WebView majority in this market), the rail runs on the compositor with zero JS; the rAF path is the Safari/iOS fallback.
- **Frame sequence:** `createImageBitmap()` decode into an array, drawn to a `<canvas>` sized to `min(devicePixelRatio, 2)`. Preload frames 1–12 eagerly, remainder on `requestIdleCallback`. Gate the whole thing behind `navigator.hardwareConcurrency >= 4 && !navigator.connection?.saveData`. The 1.4 MB total is already within budget.
- **Numbers:** a single `data/ledger.json` with an `asOf` field, ISR revalidate 3600. If R.Pay can expose a read-only telemetry endpoint, the same shape hydrates from the edge route and the site becomes genuinely live — that is a phase-2 unlock, not a launch blocker.
- **Budget, non-negotiable:** ≤ 120 kB First Load JS (current pages are 87–101 kB; the interactive islands cost ~14 kB gzipped hand-written). LCP < 1.8s on 4G / mid-tier Android — achievable because the LCP element is a text line and a 1px rule, not a video. No video autoplays above the fold, ever.
- CSS: keep vanilla CSS with a token layer (`--vault`, `--ivory`, `--cleared`, `--breach`). Add PostCSS logical-properties only. No Tailwind — it would cost more than it returns here.
- Fonts: `readex-pro-700` and `plex-mono-500` are already local. Add `plex-sans-arabic-400/600` subset to Arabic + Latin ranges (~48 kB total), `font-display: swap`, preloaded.
- Estimate: **4–5 weeks** — 1 art direction & tokens, 2 build, 1 the geofence + rail polish, 0.5 perf and Arabic typography QA.

---

## 12. RISK — the honest failure mode

**The concept has zero tolerance for fake data.** The entire premise is auditability: timestamps, "as of" stamps, device IDs, live-looking counters. If 465,255 is a stale marketing number, or the fleet table is invented, one prospect who is also an operator will notice within thirty seconds — and a trust-themed site caught faking trust does more damage than a mediocre brochure. R.Pay must commit to either real data or explicit, dated, honest static figures. There is no third option in this concept.

Three lesser risks: **(a)** a buyer who came to see the terminal may feel starved of hardware — mitigated by hardware-as-evidence in sections 05 and 07, but it is a real trade; **(b)** the scroll-scrubbed sequence is the single biggest perf liability on a 4-core Android and must be gated aggressively, not "optimised later"; **(c)** a linear narrative resists the sales team's inevitable request for a spec table and a pricing page — those live at `/specs`, off the story, and the story page must not be allowed to absorb them.

---

## 13. WHY THIS BEATS A GENERIC FINTECH SITE

A generic fintech site sells *capability*: here is a dashboard, here are six payment logos, here is a gradient and a floating iPhone. Every one of R.Pay's competitors can build that by Friday, and Geidea already has. What none of them can build is **a claim rendered as an audit.** Direct settlement isn't a bullet point here — it's a riyal you watched arrive with a timestamp on it. The geofence isn't a feature icon — it's a machine you personally dragged out of its zone and watched die. The refund isn't a promise — it's a riyal that turned around and went home by itself while you were reading.

And it is the only concept that matches the actual sales conversation. When an operator with 40 machines in a Boulevard venue asks his one question — *where is my money and is it safe* — the salesman currently answers with words. This site answers it in eight seconds, on a phone, in Arabic, before anyone speaks. That's not decoration. That's the pitch, automated.

**«ريال واحد. تابعه حتى النهاية.»**