# Milestone 1.1 — Identity Escalation · Review

**Branch:** `redesign/milestone-1-horizon` (nothing committed, nothing merged)
**Route:** `/redesign`
**Date:** 16 August 2026
**Scope:** the form of the Horizon only. No Milestone 2 work was started.

---

## How to open it

```bash
cd C:\Users\CCBoot\Documents\projects\r.pay
npm run dev
```
→ **http://localhost:3000/redesign** · reload to replay · drag the machine in the geofence
section · resize below 860px to see the mobile window.

Regenerate everything here: `npm run build && node scripts/m1-review.mjs`

---

## THE FORM — what changed and why

The Milestone 1 instrument was **97 vertical ticks standing on a baseline**. That is a bar
chart, and a bar chart belongs to everybody. It was the correct diagnosis: nothing about the
geometry said *R.Pay*.

The escalation is a change of **grammar**, not of decoration. Nothing was added — no glow,
no gradient, no particles, no WebGL, no new animation. The marks were re-cut.

### وَتَد — the peg

R.Pay's product is not "values over categories". It is a spine of infrastructure that
**physically holds machines in fixed places**, and whose entire differentiator is what happens
when one is pulled out of position. So the machine became a peg driven into the backbone:

```
   ════╤════════╤════════╤════════      spine   — brass, broken into 9 branch segments
       │        │        │              socket + stem — brass: infrastructure
                                        ← THE JOINT: a gap in the middle of every mark
       ▌        ▌        ▌              head    — state colour: the machine
```

Four things follow, and each of them was a stated requirement:

| Requirement | How the grammar answers it |
|---|---|
| **1. A distinctive machine glyph** | Not one line — three parts with a **break in the middle**. The joint is the structural characteristic. Bars grow *up* from a baseline; pegs *hang* from a spine. Opposite reading, at any size. |
| **2. Brass as the actual backbone** | The spine is drawn at **4.5** stroke; a machine head at **2.5**. Infrastructure outranks any single node, in the drawing itself. Stems are brass because they are infrastructure; only the head carries state, because only the machine has a state. |
| **3. Branches as part of the signature** | The spine is **broken into nine segments**, each opening with a node dot. The breaks *are* the branch structure — there is no separate grouping device anywhere in the system. Nothing to reinvent when this becomes a progress rail or a divider. |
| **4. The breach acts on the brand form** | See below. |

### The breach, told by the form

Four beats, no paragraph to read:

| | What the form does | Timing |
|---|---|---|
| **DETECTED** | The socket scars. Red begins travelling the spine from that socket. | 180 ms — `--e-alarm` |
| **ISOLATED** | Red reaches a **bounded** distance and **stops**. The bound is the message: this was contained. | 180 ms |
| **STOPPED** | The peg **pulls out of its socket** — the joint widens, the head drops away and goes dark. | 180 ms |
| **RECOVERED** | Red drains, the peg re-seats, the joint closes, colour returns. | 900 ms — deliberate |

Danger arrives in 180 ms and leaves over 900 ms. That asymmetry is preserved and is the whole
emotional argument.

**See `shots/horizon-seq-1-normal` → `seq-5-recovered`.**

---

## DELIVERABLES

### A · Desktop crop test
`shots/crop-1-no-logo-no-words.png` · `shots/crop-2-instrument-only.png`
No logo, no company name, no headline, no marketing copy.

### B · Mobile crop test
`shots/crop-3-mobile-no-logo.png`

### C · Breach sequence
`shots/horizon-seq-{1-normal,2-detected,3-isolated,4-stopped,5-recovered}.png`
Plus the draggable geofence: `shots/geo-{desktop,mobile}-{1-rest,2-inside,3-breach,4-recovered}.png`

### D · Full hero
`shots/02-desktop-1440-{ar,en}.png` · `shots/08-android-360-{ar,en}.png`
(8 viewports × AR/EN, 41 captures total in `shots/`)

### E · Before / after
- **`COMPARE-1-instrument.png`** — the form change, this is the one to look at
- **`COMPARE-2-breach.png`** — breach as a red tick + caption vs. breach acting on the system
- **`COMPARE-3-mobile-vs-desktop.png`** — the two expressions side by side

### F · Performance and accessibility
Unchanged or better. Table below.

---

## MOBILE — the weakest part of M1, now solved differently

M1 built a **separate mobile composition** (nine columns of stacked marks). You were right that
it read as a stacked bar chart, and the deeper problem was that it was *a second drawing* — two
charts of the same data, free to drift apart forever.

**M1.1 deletes the second layout entirely.** There is now **one drawing**. On a phone the frame
becomes a **window into a fleet wider than the screen**, and you drag along it. That is
literally true of the product, it guarantees the DNA is identical rather than merely similar,
and it halved the SVG DOM.

The window opens centred on machine 43, so the breach is never off-screen. The horizontal
scroll is contained — **the page body still never scrolls sideways at any viewport**.

`COMPARE-3-mobile-vs-desktop.png` is the test you asked for: placed side by side, they are two
views of one system.

---

## TYPOGRAPHIC VOICES

Separation strengthened, not yet completed — the full commercial voice arrives with Daybreak.

| Voice | Face | Where |
|---|---|---|
| **Machine / system** | IBM Plex Mono, tabular figures, 9.5–12px, wide tracking, `--ink-faint` / `--brass` | branch labels, counts, log lines, timestamps, machine IDs, provenance chip, payment rails |
| **Human / commercial** | Readex Pro 400/700, 17–56px, normal tracking, `--ink` / `--ink-muted` | headline, lede, geofence explanation, CTA |

Mono now reads clearly as *the instrument talking*; Readex as *the company talking*. Arabic
keeps `letter-spacing: 0` absolutely, 1.75 body leading, 1.15 display, measure capped at 62ch.

---

## WHAT WAS PROTECTED — nothing regressed

| Metric | Budget | M1 | **M1.1** | |
|---|---|---|---|---|
| LCP (4× CPU, Fast 3G, 360×800) | ≤ 1800 ms | 800 ms | **864 ms** | ✅ |
| CLS | ≤ 0.02 | 0.001–0.12 *(unstable)* | **0.0008** — three consecutive runs | ✅ improved |
| Interaction latency (breach) | < 200 ms | 26 ms | **26 ms** | ✅ |
| First Load JS | ≤ 110 kB | 94.4 kB | **94.4 kB** | ✅ |
| Transfer, first view | ≤ 550 kB | ~126 kB | **~126 kB** | ✅ |
| axe violations (AR + EN) | 0 | 0 | **0** | ✅ |
| Horizontal page overflow, 8 viewports | 0 | 0 | **0** | ✅ |
| Reduced motion | final state at first paint | ✅ | **97 pegs resolved + breach shown** | ✅ |
| No JavaScript | instrument renders | 97 ticks | **97 pegs + 9 branch segments** | ✅ |
| Revenue freeze / resume | froze, resumed from frozen | ✅ | **froze 5,057 → held → resumed 5,090** | ✅ |
| Seven offline machines visibly offline | required | ✅ | ✅ | ✅ |
| No fake LIVE claims | required | ✅ | ✅ | ✅ |

**CLS was the one genuine regression during this milestone, and it is now better than before.**
It was oscillating between 0.001 and 0.12 across identical runs — font swap landing late on a
throttled connection. Fixed properly with `<link rel="preload">` on the two first-paint faces
and `size-adjust` metric-matched fallbacks, so the swap changes glyph shapes but not layout.
Three consecutive runs: **0.0008, 0.0008, 0.0008.**

---

## MY HONEST VERDICT ON THE IDENTITY TEST

> *If all words and logos are removed, does the geometry and behaviour itself begin to feel like
> an R.Pay-owned visual system?*

**Yes — this crossed the line, and I would not have said that about Milestone 1.**

What changed my assessment, concretely: in M1 I could describe the crop as "a dark instrument
page" and nothing was lost in that description. I cannot describe the M1.1 crop that way. It
has a **structural rule** — spine, joint, head — that is arbitrary in the way real identities
are arbitrary, and it recurs at every level. `COMPARE-1-instrument.png` is the honest evidence:
the top half is a chart, the bottom half is a system.

**Where I would still not overclaim.** It is *ownable*, not yet *famous*. A form becomes
unmistakable by repetition, and right now it appears exactly once. The three things that will
settle it are all Milestone 2: the spine becoming the page progress rail, the joint appearing
in section dividers, and the peg reduced to a favicon. If it survives those, it is real. If it
looks arbitrary the moment it leaves the hero, we will know it was a good drawing rather than a
system — and that is a cheap test to run early, which is why I would run it first.

**One weakness I will name rather than let you find.** At 1920px the brass stem comb is dense
enough that the joint reads slightly more as texture than as structure. It is correct at
1440px and below, and correct on mobile. If you see it too, the fix is proportional spacing
rather than a new idea.

---

## BUGS FOUND AND FIXED THIS MILESTONE

**1. My harness destroyed the archive.** It began with `rm -rf` on its whole output directory.
When I pointed it at `milestone-1.1`, it deleted the `before/` folder I had archived there —
the original Milestone 1 screenshots, which were not regenerable. The harness now clears only
its own `shots/` directory. The before image in this folder is a **faithful re-render** of the
M1 form using its exact constants (rule at y=170, tick height 78, stroke 2.5), labelled as such
— not the original capture, because I destroyed it.

**2. Stale verification probes.** The reduced-motion and no-JS checks still queried `.h-tick`
and `.h-desktop`, which the new grammar removed, so both silently reported `0` — a check that
passes by finding nothing is worse than no check. Now query `.pg` / `.pg-head` / `.h-seg` and
verify 97 pegs, 9 segments, and that the breach is present at first paint under reduced motion.

---

## NOT DONE, BY DESIGN

No Daybreak. No further sections. No CTA system. No favicon, no OG image, no estimator, no
site-wide progress rail. Those repeat the visual system, and the point of this milestone was to
find out whether the system deserves to be repeated.

---

## DATA HONESTY — unchanged, and still needs you

Every figure is `Metric { value, asOf, isLive }` with `isLive: false` everywhere, so the UI
renders a dated provenance chip and **no LIVE badge exists in the codebase**. The geofence
carries «محاكاة تفاعلية · لا يتم إيقاف أي جهاز حقيقي».

Still needed before this can be public:
- **Your nine real branch names.** I used cities deliberately — naming them after Roshn or
  Boulevard would assert deployments neither of us can evidence.
- **The five headline figures with their measurement dates.**
- Whether today's settled total is safe to publish at all.

---

## RECOMMENDED NEXT STEP

Look at **`COMPARE-1-instrument.png`** first, then **`COMPARE-3-mobile-vs-desktop.png`**.

If the form now reads as owned, the right next move is **not** to build sections — it is the
cheap repetition test: put the spine on the page progress rail, the joint in one divider, and
the peg in a favicon. Half a day, and it either confirms the system or exposes it before
anything expensive is built on top.

If it still reads as "somewhat", say so and I will escalate again rather than proceed.
