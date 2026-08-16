# Milestone 2B — The Daybreak Test · Review

**Branch:** `redesign/milestone-1-horizon`
**Checkpoints:** `474b8bb` (Horizon foundation) · `5475b01` (Section 02)
**2B status:** built, **not committed** — awaiting your verdict
**Authoritative run:** this folder. See *Run history* at the bottom.

---

## The pass/fail question

> Can the visitor move from night to daylight and feel a dramatic change in purpose and emotion
> while never feeling they have entered a different website?

**PASS — with one honest qualification I want you to weigh before we move to full production.**

The qualification: **the daylight identity rests on fewer and quieter signals than the night**,
because daylight has less to structure. It passes, but not by the same margin. Detail in
*My critical verdict*.

---

## What actually carries the brand across the cut

Not the peg. Nothing hangs in daylight — there is no fleet to suspend, and forcing pegs in would
have been exactly the "stamping the motif" failure you warned about. The harness now asserts
**zero pegs in daylight** so that failure mode is closed permanently.

What crosses instead:

| # | Property | How it survives |
|---|---|---|
| 1 | **THE AXIS** | Every structural line on the page sits on `--axis` — the x of the instrument's *first branch node*. Measured: the hero node, Section 02's spine, the Daybreak stem and the daylight rule fall within **3.5px of each other**. |
| 2 | **THE BREAK** | The rule is interrupted where content changes — three segments in daylight, exactly as the spine breaks between branches and between questions. |
| 3 | **THE NODE** | A heavier brass mark opens each segment. Identical to the hero's. |
| 4 | **WEIGHT HIERARCHY** | Infrastructure drawn heavier than what it carries. |
| 5 | **TWO VOICES** | Mono labels, Readex speech. Unchanged rules, warmer settings. |
| 6 | **MEASURE** | Same Arabic-first reading discipline: 24ch display, 52–54ch body. |

### The role change — this is the actual answer

> **In the dark the line SUSPENDS.** Machines and questions hang from it.
> **In daylight the same line REGISTERS.** Type is set against it; nothing hangs.

Same object, same axis, changed job. That is inheritance rather than duplication, and it is why
the daylight section does not need a single peg to belong.

---

## The transition

A **hard cut**, not a crossfade — a crossfade is a theme change, and this is an act break.

What makes it read as designed rather than themed:

- The brass stem descends on the axis through the dark, and **stops before the boundary**.
- **The joint spans the cut.** The line disappears into the boundary and re-emerges below in
  ink. That is the joint's exact meaning — two different things, connected — applied to the two
  worlds of the page.
- **The system speaks last.** «تنتهي الوردية» — *the shift ends* — in mono, small, on the dark
  side. After the cut, only people speak. Deliberately no numerals: a fake timestamp here would
  have been a claim, and the honesty framework forbids it.
- The ground changes; the axis does not.

**The joint is used exactly once in daylight, at the cut, and nowhere else.** You flagged
repetition as a warning and the warning was right.

`shots/db-{desktop,mobile}-{1-before,2-approaching,3-at-the-cut,4-after}.png`

---

## Brass in daylight — the specific risk you named

Brass had to stay **technical**, not become luxury gold. Two rules keep it there:

1. **It appears only as hairlines and small marks — never as a fill, a gradient or a large
   area.** Gold reads as luxury when it becomes a *surface*. At 1.5px it stays infrastructure.
2. **It gains no saturation and no shine.** `#7A5F2B` on `#F2EFE9` — measured **5.23:1**, which
   clears both text (4.5:1) and non-text graphics (3:1).

My honest read: it stays technical. It reads closer to a spec drawing or an annual report than
to a premium consumer brand, which is the correct side of the line. If it had gone gold, the
first symptom would have been wanting to thicken it — I did not want to.

---

## The physical connection — hero → §02 → Daybreak

You asked me to test the stronger version, and it exposed a **bug I had not seen**.

The axis check I wrote for this milestone **failed on its first run: 1230.9px divergence.** The
cause was not the transition. It was that **SVG coordinates ignore `direction`**, so on an
Arabic page the instrument was drawing machine 1 at the *left*. Two consequences:

- The fleet **enumerated backwards** for an Arabic-first product.
- Worse, the sweep travels right-to-left while ticks lit in ordinal order left-to-right — **the
  light and the thing it deposits were desynchronised**, in every capture since Milestone 1.

Fixed by mirroring the drawing with the language: machine 1 now sits on the reading edge, and
the light arrives at what it lights. `AXIS_PCT` is *derived* from the layout constants, so
changing the padding or tick gap moves every structural line on the page together.

**Result: four structural lines within 3.5px.** The page is one spatial construction descending
from a real attachment point on the fleet, not a stack of separately styled sections.

That check was worth writing for this bug alone.

---

## Manual Arabic typography QA

Done by eye at 4× on five close-ups, not delegated to an automated check.
`shots/ar-type-1…5.png`

| Checked | Result |
|---|---|
| Cursive joining | Intact everywhere. `letter-spacing: 0` holds; no severed joins. |
| Diacritics | The shadda on «التحكّم» clears the line above at `line-height: 1.52`. The superscript alef in «ليلًا» clears at 1.34. Both were collisions at 1.2. |
| Hamza forms | «أنظمة» «الأجهزة» «رؤيتنا» all correct. |
| Teh marbuta | Correct throughout. |
| Line breaking | Word boundaries only; no mid-word breaks, no hardcoded `<br>`, no orphans. |
| Punctuation | The full stop sits at the logical end (left) of each RTL line. |
| Numerals | Arabic-Indic ٠١–٠٤ in Arabic; Western in English. No isolation forced where none is needed — that bug cost me a milestone. |
| Mixed AR/Latin | `mada · VISA · Mastercard · Apple Pay · stc pay · GCCNET` with «يقبل» — bidi correct: Latin runs read internally LTR while the sequence progresses RTL. |
| Weight at display size | 400 in daylight, 700 at night. Daylight is calmer and the size carries the emphasis. |
| Measure | 24ch display, 52–54ch body. Arabic runs shorter than Latin, so the 65–75ch Latin figure would over-set it. |

**One flaw I did not fix:** the daylight title sets long–short–long across three lines. `balance`
plus a 24ch measure produces it. It is within normal editorial variance and tightening the
measure costs a line elsewhere. Recorded rather than hidden.

---

## Performance — M2A → M2B

| Metric | Budget | M2A | **M2B** | |
|---|---|---|---|---|
| LCP (4× CPU, Fast 3G, 360×800) | ≤ 1800 ms | 944 | **1028** | ✅ |
| CLS | ≤ 0.02 | 0.0008 | **0.0008** | ✅ |
| Interaction (breach) | < 200 ms | 26 | **35** | ✅ |
| First Load JS | ≤ 110 kB | 96.1 | **97.0** | ✅ |
| Transfer, first view | ≤ 550 kB | ~126 | **~126** | ✅ |
| axe (AR + EN) | 0 | 0 | **0** | ✅ |
| Horizontal overflow, 8 viewports | 0 | 0 | **0** | ✅ |
| Reduced motion | final state at first paint | ✅ | **97 pegs + breach** | ✅ |
| No JavaScript | instrument renders | ✅ | **97 pegs, 9 segments** | ✅ |
| Revenue freeze / resume | required | ✅ | **5,058 → 5,089** | ✅ |

**Daybreak + the whole daylight section cost +0.9 kB.** `Daybreak.tsx` is a server component:
zero client JS, zero animation, zero images. **The environmental change costs nothing at
runtime** because it is a background colour and a set of hairlines — there is no compositing
work to do, which is exactly why I would not accept a crossfade.

LCP moved 944 → 1028 ms; the page is longer and the measurement varies ±100 ms run to run. It is
57% of budget and I am watching it, not worried by it.

**21/21 checks pass**, including four new ones written this milestone: the axis check, no cyan in
daylight, no animation in daylight, and no pegs in daylight.

---

## UI/UX Pro Max findings

Consulted on hierarchy, cognitive load and readability. Two findings changed the work:

1. **"Clear size/weight difference between heading and body."** The daylight title at weight 400
   initially sat too close to the body at 400. Separated by *size and colour* instead of weight
   — `--ink-day` against `--ink-day-60` — which keeps daylight calm rather than shouty.
2. **"Limit line length; do not promise an exact final line."** Applied as bounded measures with
   `text-wrap: balance` and no hardcoded breaks, verified at 8 viewports in both locales.

**Not used for:** anything Arabic. As established in Milestone 1, it has no Arabic guidance, so
the entire typography QA above is manual.

---

## My critical verdict — where it is weakest

You asked me to name anything that feels like a second design language. Honestly:

**Nothing reads as a second brand.** But two things are weaker than the night, and I would rather
you hear them from me:

1. **The daylight crop is a quieter identity signal than the night crop.** Compare
   `shots/dl-desktop-grammar-crop.png` (logo, name and headline removed) against the night's peg
   comb. The night is instantly identifiable; the daylight is *recognisably the same system* but
   would not, alone, be unmistakable. That is structural, not fixable by decoration: the night
   has 97 objects to organise and daylight has three paragraphs. **Adding pegs to close the gap
   would be the failure you described**, so I did not.

   The one change I did make was earned: the rule now **breaks between mission and vision**,
   because they are two items — the same rule that breaks between branches and between questions.
   Three segments and three nodes read as a system where one long rule read as a border.

2. **The «تنتهي الوردية» line is the most fragile element on the page.** It is doing real work —
   the system's last utterance before people take over — but it is one small mono phrase carrying
   a conceptual load. If it were removed, the cut would lose some of its meaning and become closer
   to a theme change. It deserves a second opinion from a native Arabic reader.

**What I am confident about:** the axis is real and measured, the break/node grammar transfers
without decoration, brass survives daylight as infrastructure, and the cut reads as an act break
rather than a background swap.

---

## Deliverables

| # | Asked for | File |
|---|---|---|
| 1 | Full desktop sequence | `shots/seq-desktop-full.png` |
| 2 | Full mobile sequence | `shots/seq-mobile-full.png` |
| 3 | Daybreak before/during/after | `shots/db-{desktop,mobile}-{1-before,2-approaching,3-at-the-cut,4-after}.png` |
| 4 | Daylight without logo | `shots/dl-{desktop,mobile}-no-logo.png` |
| 5 | Light-theme grammar crop | `shots/dl-{desktop,mobile}-grammar-crop.png` |
| 6 | Arabic close-ups | `shots/ar-type-1…5.png` (4× DPR) |
| 7 | Performance comparison | above |
| 8 | UI/UX Pro Max findings | above |
| 9 | Critical verdict | above |

71 captures total, 8 viewports × AR/EN.

---

## Scope discipline

Built: hero, Section 02, the improved coordinate transition, Daybreak, the first daylight
section, desktop + mobile, AR + EN, reduced motion. **Nothing else.** No further sections, no CTA
tiers, no manifest, no comparison table, no estimator.

The daylight section uses **verified company copy** — the mission, vision and descriptor from
R.Pay's own production site, carried across verbatim. No invented claims, no placeholder venues,
no fabricated figures.

No new dependencies. No GSAP — native choreography still has not fought back, and Daybreak has no
choreography at all by design. No Three.js, no WebGL. **No Higgsfield**, as instructed; the
section is type and hairlines and needed no imagery.

---

## Run history

| Folder | What it exposed |
|---|---|
| `milestone-2b` | **the axis check failed at 1230.9px** — the instrument was drawing left-to-right on an Arabic page |
| `milestone-2b-b` | mirror fixed; axis within 3.5px. Daylight rule read as one long border |
| `milestone-2b-c` | incomplete — the Arabic close-up selector broke after restructuring and aborted the run |
| `milestone-2b-d` | same crash; harness now records capture failures instead of aborting |
| **`milestone-2b-e`** | **authoritative. 21/21 checks pass.** |

---

## Recommended next step

If you accept the qualification in *My critical verdict*, the grammar has now been tested across
data, interaction, navigation, non-data content, a mark, both environments, both languages and
both form factors. I would consider it validated and stop testing section-by-section.

Before full-page production, two things become blocking rather than deferrable:

1. **The nine real branch names** and **the five headline figures with measurement dates** — the
   hero is the first thing anyone sees and it currently carries placeholders.
2. **Written logo permission**, because the manifest section (الموانئ) is next in the daylight
   act and it cannot be built honestly without it.
