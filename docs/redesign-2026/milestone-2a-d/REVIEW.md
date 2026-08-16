# Milestone 2A — The Non-Data Grammar Test · Review

**Branch:** `redesign/milestone-1-horizon`
**Checkpoint:** `474b8bb` — the validated Horizon foundation (Milestones 1–1.2)
**2A status:** built, **not committed** — awaiting your verdict
**Authoritative run:** this folder. See *Run history* at the bottom.

---

## The question

> Can the R.Pay visual grammar carry non-data, customer-facing communication without
> turning into either a generic SaaS layout or a fake dashboard?

**Yes.** Section 02 contains **no chart, no metric, no card, no panel, no icon, no telemetry
and no cyan** — and it is still unmistakably the same system. Both design laws are now
machine-verified rather than asserted (see *Automated law checks*).

**→ `shots/s02-desktop-no-logo.png` and `shots/s02-mobile-no-logo.png`** — that is the test.

---

## How the grammar carries human content

The move that made it work is semantic, not decorative:

| | The hero | Section 02 |
|---|---|---|
| Anatomy | spine → node → stem → JOINT → head | **identical** |
| The head is | a **machine**, coloured by its state | a **question**, set as type |
| The joint is | the break between infrastructure and machine | the gap between the system and the person — *the distance the answer has to cross* |
| The spine breaks | between **branches** | between **questions** |
| Colour | cyan / graphite / red — state | **brass and ink only** — a question has no uptime |
| Motion | reports | **none** — explanation does not report |

**In the hero the head is a machine. Here it is a sentence.** Same anatomy, different payload.
That is the whole answer, and it is why the section does not have to pretend to be telemetry to
belong.

The peg proportions were tuned to match the hero exactly. My first pass used a 26px stem against
a 48px joint — the joint dominated and the relationship read as *"a line, then some distant
text"* rather than as a peg. The hero's ratio is stem:joint ≈ 22:10, so Section 02 is now
34:16.5. That single correction is most of the difference between the first and final captures.

---

## The transition — the section hangs off the horizon

Not a fade, not a slide. **A stem descends from the instrument, the node marks the socket, the
joint opens, and what hangs below is the section.** The whole of Section 02 is one large peg on
the same axis the question spine occupies — they align by construction, because the transition
stem and the spine live inside the same `.measure` box rather than being aligned by arithmetic.

`shots/s02-desktop-transition.png` · `shots/s02-mobile-transition.png`

The visitor moves from *watching the system operate* to *understanding why it matters*, carried
by the same object rather than handed over by an effect.

---

## Two voices, separated by type rather than decoration

| Voice | Face | Where, in this section |
|---|---|---|
| **System** | IBM Plex Mono, 11.5px, brass, wide tracking | the eyebrow, and the numeral. **The system counts; it does not speak.** |
| **Human** | Readex Pro 700 → 400, ink → ink-muted | every question and every answer |

There is no third voice, no label chrome, no badge, no pill. The only mono in the whole section
is four numerals and one eyebrow.

---

## Automated law checks — new

Two of the design laws are now enforced by the harness rather than by my judgement:

```
ok  law: no cyan in Section 02        (0 cyan uses across every computed
                                       color/background/border/fill/stroke)
ok  law: no animation in Section 02   (0 running animations, subtree-wide)
```

Both fail the run and exit non-zero if violated. **15/15 checks pass.**

This matters more than it sounds: "cyan means live" is the law most likely to erode quietly as
the page grows, because cyan is the nicest colour in the palette. It is now impossible to
violate it in this section without the build telling you.

---

## Deliverables

| # | Asked for | File |
|---|---|---|
| 1 | Full desktop sequence | `shots/seq-desktop-full.png` (hero → transition → §02, full page) |
| 2 | Full mobile sequence | `shots/seq-mobile-full.png` |
| 3 | §02 without logo | `shots/s02-desktop-no-logo.png` · `shots/s02-mobile-no-logo.png` |
| 4 | Rail in context | `shots/rail-context-desktop.png` · `shots/rail-context-mobile.png` |
| 5 | 16px mark | `mark-16-inspection.png` (actual size + 8×) · `mark-sizes.png` |
| 6 | Performance comparison | below |
| 7 | UI/UX Pro Max findings | below |

Plus 8 viewports × AR/EN, choreography beats, breach sequence, reduced-motion, no-JS and crop
tests — 54 captures in `shots/`.

---

## The 16px mark

The three-peg mark closes its joints at 16px and reads as a brass bar over three blobs. So 16px
gets **its own optical cut**: a single peg, every edge landing on a whole pixel of a 16-unit
grid, with `shape-rendering: crispEdges`. Spine, stem, joint and head all survive.

This is not a redesign — it is the same grammar at a different optical size, exactly as a type
family cuts a caption weight. Wired as `sizes="16x16"`, with the three-peg mark serving 32px and
the SVG serving everything larger.

`mark-16-inspection.png` shows it at actual size beside an 8× nearest-neighbour blow-up.

---

## The progress rail, tested in real scrolling

`shots/rail-context-desktop.png` · `rail-context-mobile.png`

- **Readability** — 4px, brass segments on the hull ground. It gave itself a background this
  milestone, because a transparent fixed rail renders as whatever is behind it.
- **Progress clarity** — fills from the reading edge; in Arabic it fills right-to-left, verified
  in the RTL capture.
- **Distraction** — none. It is quieter than the body copy, which is the requirement.
- **"Cyan means live"** — obeyed. Scroll position *is* live state: it changes continuously and
  reports something true about now. It is the one non-fleet use of cyan I would defend, and it
  is why Section 02 has none.
- **Mobile** — same 4px, unchanged. No separate treatment needed.

---

## UI/UX Pro Max — meaningful findings only

Consulted on information architecture, question ordering, readability, cognitive load and
Arabic typography. Three findings changed the work:

1. **Line length 65–75 characters.** Applied as **62ch for the question column and 54ch for
   answers** — Arabic runs shorter than Latin, so the Latin figure would over-set it.
2. **"Clear size/weight difference between heading and body."** The first pass had question and
   answer too close in weight. Now 700 → 400 with a colour step from `--ink` to `--ink-muted`.
3. **"Do not insert hardcoded `<br>` or blanket non-breaking spaces; bound the measure and test
   natural wrap across locales."** I had been tempted to hard-break the Arabic heading. Instead
   it uses `text-wrap: balance` with a bounded measure, verified at 8 viewports in both locales.

**Overruled:** nothing. It was not asked to choose a visual style, and it did not.

**Found by me, not by it:** Arabic diacritics collided at `line-height: 1.2` — the superscript
alef in «ليلًا» clipped into the line above. Raised to 1.34 for display and 1.42 for questions.
UI/UX Pro Max has no Arabic-specific guidance, as noted in Milestone 1.

---

## Performance — M1.2 → M2A

| Metric | Budget | M1.2 | **M2A** | |
|---|---|---|---|---|
| LCP (4× CPU, Fast 3G, 360×800) | ≤ 1800 ms | 900 | **944** | ✅ |
| CLS | ≤ 0.02 | 0.0008 | **0.0008** | ✅ |
| Interaction (breach) | < 200 ms | 25 | **26** | ✅ |
| First Load JS | ≤ 110 kB | 95.2 | **96.1** | ✅ |
| Transfer, first view | ≤ 550 kB | ~126 | **~126** | ✅ |
| axe violations (AR + EN) | 0 | 0 | **0** | ✅ |
| Horizontal overflow, 8 viewports | 0 | 0 | **0** | ✅ |
| Reduced motion | final state at first paint | ✅ | **97 pegs + breach** | ✅ |
| No JavaScript | instrument renders | ✅ | **97 pegs, 9 segments** | ✅ |
| Revenue freeze / resume | required | ✅ | **5,053 → held → 5,083** | ✅ |

**Section 02 cost +0.9 kB of JS**, and that 0.9 kB is the language-toggle re-render, not the
section: `Questions.tsx` is a server component with **zero client JavaScript, zero animation and
zero images**. A whole content section for under a kilobyte is the direct dividend of the
grammar being made of hairlines and type.

One run reported LCP 1708 ms; its TTFB was 724 ms against 4–12 ms everywhere else — a server
start-up blip, not a regression. Re-measured at 944 ms. Recorded rather than hidden.

---

## What I would still change

Honest list, none of them blocking:

1. **The transition stem descends from below the hero's content, not from the horizon line
   itself.** It reads as "the structure continues downward", which is right, but the stronger
   version would drop from a specific branch node on the instrument. That requires the hero and
   the section to share a coordinate system, which is a Milestone 2B change, not a patch.
2. **The joint is used twice on the page** — once as the transition, once as the divider before
   the radar. Both earn it and they do different jobs, but that is the ceiling. A third
   decorative use would turn a grammar into wallpaper.
3. **The eyebrow «الأسئلة الأربعة» duplicates the heading.** It survives because it is the
   system labelling the section, but it is the weakest line in the section.

---

## Scope discipline

Not built: Daybreak, the paper act, any further section, the CTA tiers, the estimator, the OG
image. Section 02 ends on a **text link**, not a filled button — the primary CTA is still earned
after the radar demonstration, per the CTA law.

No new dependencies. No GSAP — the native choreography never fought back, and Section 02 has no
choreography at all by design. No Three.js, no WebGL, no generated assets. **Higgsfield was
available for this milestone and was not needed**: the section is type and hairlines.

---

## The checkpoint

`474b8bb — feat(redesign): the Horizon identity system — Milestones 1, 1.1, 1.2`

Contains the validated foundation, its documentation and the review harness. **The 65 MB
dead-video deletion is deliberately not in it** and remains on disk, so this is a clean rollback
point for the identity system alone. One scope note: per-run `shots/` folders are gitignored —
34 MB of regenerable PNGs would bloat history permanently. The written reviews and the summary
comparison images are tracked, because they carry the argument.

Milestone 2A is **uncommitted**, pending your verdict.

---

## Run history

| Folder | What it exposed |
|---|---|
| `milestone-2a` | spine rendered on the wrong side — `inline-end` is the *left* in RTL |
| `milestone-2a-b` | numerals left-aligned; my `.ltr` helper flipped their text-align |
| `milestone-2a-c` | joint out of proportion vs the hero; Arabic diacritics clipping |
| **`milestone-2a-d`** | **authoritative. 15/15 checks pass.** |

---

## Recommended next step

If §02 reads as one system to you, the grammar has now carried data, structure, navigation, a
mark and human argument. The remaining untested case is the one I flagged as the real risk:
**Daybreak** — whether the brass survives a ground change to paper, and whether a section with
neither fleet data nor a spine to hang from still belongs.

Still outstanding, and still not blocking design: **the nine real branch names** and **the five
headline figures with their measurement dates**.
