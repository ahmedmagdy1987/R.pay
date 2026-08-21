# Concept 08 — the scrub-lab film page

**Route:** `/concepts/lab` · **Branch:** `concept-08-scrub-lab`
**Last updated:** 2026-08-21, at head `0b9fbbd` (36 commits ahead of `main`, 0 behind).

**Standing instruction:** any agent making a material change to this concept updates this file **in the same commit**. Deep Freeze wipes the machine; commit prose is not read by the next session and conversations do not survive. If it is not in this file, it does not exist.

---

## STOP — READ THIS BEFORE YOU EDIT, RUN, OR DIAGNOSE ANYTHING

**Read this entire file first.** It is shorter than the time you will lose otherwise. This page has broken repeatedly in ways the test suite reported as green.

**`main` is untouched at `97f09c3`. Nothing is merged. Work on `concept-08-scrub-lab` only.** Do not merge. Do not touch `app/page.tsx` beyond the hub card. Do not touch concepts 01–07.

### Things that will break the page if you do them without knowing

1. **Do not delete or restructure the `useEffect` at `app/concepts/lab/page.tsx:306`.** It looks like a scroll effect. It also owns the `IntersectionObserver` that adds `.in` to all **33** `.rv` elements, and the transaction counter. Remove it and every revealing element on the page stays at `opacity: 0` **permanently** — the observer is gone, so nothing ever fires. A progress bar was removed from this exact effect on 2026-08-21 (`2c3c29e`) and only the bar's own four pieces were taken.

2. **Do not run `scripts/build-segments.sh` casually.** It overwrites committed, measured frame assets and needs source clips that are **not in this repo**. It refuses to run without `--i-know-what-this-rebuilds`. The frames under `public/assets/lab/seg` are the reference, not the script's output.

3. **Do not change the scroll box from `vh` to `dvh`.** `components/ScrubSequence.css:36` and `:42-50`. The pinned **hold** takes `100dvh` on purpose (it is the frame you look through). The **scroll box** keeps `vh` on purpose — `vh` is the large-viewport height and never moves, so the scroll-to-frame mapping is fixed. `dvh` there makes the film lengthen and shorten as the mobile toolbar animates.

4. **Do not read `innerHeight` live in the pacing maths.** It is measured once and held (`stableVH()`, `components/ScrubSequence.tsx:238`). A resize keeping the width and moving the height by less than `TOOLBAR_PX` (120, `:231`) is discarded as chrome. Reading it live means every iOS toolbar collapse retargets the frame index while the reader is holding still.

5. **`evictAll()` must reset both `drawn` and `lastC`** (`components/ScrubSequence.tsx:807`). They are twins. Resetting only `drawn` means a segment that shed its bitmaps and returned to the same scroll position computes `c === lastC`, skips `maintain()`, never rebuilds the decode window, and paints its poster forever. That was a real shipped bug (`bbef4e2`).

6. **Never measure against a server you did not just start.** An orphaned `next start` answers 200 from a stale build and every check passes while describing the wrong page. `scripts/lab-build.mjs` aborts on this now — if it names a PID, kill that PID. `pkill -f "next start"` does **not** work reliably in Git Bash on this machine; use the PID the script prints with `powershell -NoProfile -Command "Stop-Process -Id <PID> -Force"`.

7. **A green harness has repeatedly meant nothing here.** See section 5. Do not conclude "the tests pass, so it works."

### Run this first to confirm the restore is healthy

```bash
npm install
npx playwright install chromium webkit      # browser cache lives outside the repo; the wipe takes it
npm run build
npm run lab:serve                            # port 3210, in another shell
```

Then, and every number below is what healthy looks like:

| Check | Command | Healthy |
|---|---|---|
| Typecheck | `npx tsc --noEmit` | exit 0, no output |
| Build | `npm run build` | exit 0, 16 static routes |
| Paint | `npm run lab:fullpage` (and the sweep in section 6) | **7/7 PASS** |
| Perf + memory | `npm run lab:measure` | **PASS 4/4**, peak **65.9 MB** on desktop **and** mobile, **~60 fps** desktop/mobile, scrub travel complete, 0 long frames |
| Reduced motion | `npm run lab:reduced` | every segment shows its **opening** frame, both engines |
| Toolbar | `npm run lab:viewport` | **drift 0**, dluma 0.00, poster never shown |
| Resilience | `npm run lab:resilience` | every check passes and names the frame it expected |
| Objections | `npm run lab:objections` | all checks pass, five widths |

**WebKit is the known weak spot and is not a regression.** `lab-measure`'s third profile has recorded 28, 47.9 and 51.5 fps across machines and sessions with nothing about the page changing; it reads ~40 fps on the current Windows box. Its peak memory must still be 65.9 MB. fps is deliberately **not** asserted anywhere — see section 5.

### If a measurement here disagrees with what the user reports seeing, **the user is right and the tool is suspect.**

This has happened repeatedly on this project, and every single time the tool was wrong: a harness that passed 7/7 while a real Mac showed every segment frozen; a capture that showed a page without the change in it; a "layout defect" that was an unrevealed element; a stability check that read an attribute instead of the pixels. Start by doubting the instrument.

---

## 1. WHAT THIS IS

A single scroll-driven film page for R.Pay at `/concepts/lab` — three canvas image-sequence segments the reader scrubs by scrolling, with DOM copy between them, in Arabic (RTL) with an English toggle.

**The reader is an operator who already owns machines.** R.Pay is a **system provider**: it supplies the payment, operations and remote-control platform to operators of arcades, entertainment venues and self-service machines. It does **not** operate venues and is not a competitor to its own customers.

**Why that distinction matters.** It was an open question for several sessions (`company.identity`), and the answer — from the owner via Ahmed, 2026-08-19, commit `5bdbf31` — changed the page's whole message. Before it, the sector list read "malls, residential compounds, corporate HQs, gyms" — a list of places a **landlord** has floor space in. That is a different reader entirely, and the copy was pitched at them. Everything on the page now addresses someone who owns the machines and wants them to earn, not someone being sold floor-space services.

**A live contradiction, recorded not resolved:** R.Pay's own profile PDF says «أكبر مشغّل لمكائن ألعاب الأركيد في المنطقة» — "the largest arcade-machine operator in the region" — which reads as the opposite. An operator handed both documents sees a supplier claiming to be their biggest competitor. The page follows the owner's answer and never repeats the profile sentence. Reconciling the profile is R.Pay's job, not this repo's. Tracked as `company.profileWording`; downgraded on 2026-08-20 from "contradiction" to a wording recommendation, because «مشغّل» genuinely carries both senses in Arabic and R.Pay means the second.

---

## 2. HOW IT WORKS

### The film
Three segments, `components/ScrubSequence.tsx` mounted three times from `app/concepts/lab/page.tsx` at lines **377**, **426**, **797**:

| Seg | `scrollVh` | Content | Frames |
|---|---|---|---|
| A | **420** | orbit → Riyadh → the floor | 90 wide / 60 tall |
| B | **640** | corridor → machine → **the tap** (the film's peak) | 90 / 60 |
| C | **330** | pulse → the constellation | 90 / 60 |

Each segment is two 5s generated clips concatenated, `mpdecimate`d, and sampled to stills. **There is no `<video>` element anywhere on the page** and the harness asserts that.

### The scrub engine
Scroll position becomes an array index, which cannot stall. `targetIndex()` (`ScrubSequence.tsx:1036`) derives the index from `root.getBoundingClientRect()` — **never** from `window.scrollY` or `scrollTop`, which disagree across engines. A rAF loop eases toward that index (`damping = 0.12`, `:464`) rather than snapping, which is what makes it read as film rather than a filmstrip. Frames are `ImageBitmap`s blitted with `drawImage`.

### The sliding decode window — the memory ceiling
A decoded `ImageBitmap` is uncompressed RGBA: 1600x900 costs 5.49 MB whatever the file weighs on disk. Holding a set decoded is hundreds of MB and iOS Safari discards the tab. Two caches, split by cost:

- **`blobs[]`** — encoded bytes. Held while the segment is armed. A few MB. Reclaimed only from a segment **fully off screen**, never from one still visible.
- **`bmps[]`** — decoded bitmaps. At most `behind + ahead + 1` alive (`behind = 4`, `ahead = 7` → **12**, `:468-469`), centred on the current frame and biased in the direction of travel. Eviction runs **before** new decodes start, so the ceiling is a ceiling and not an average.

Across segments, decoded bitmaps are capped page-wide to **one** window, owned by whichever segment has the most pixels on screen. Without that election a hand-over held two live windows and peaked at 93 MB. Result: **65.9 MB peak on both breakpoints**, which is the number to check.

**Arm/release hysteresis** (`ARM_VH = 1.0`, `RELEASE_VH = 2.5`, `:213-214`): one page-level arbiter measures every segment's distance from the fold on each scroll frame. Arm inside one viewport, release only beyond two and a half. The gap is the point — a segment cannot be inside the arm band and outside the release band at once. Level-triggered, so a segment scrolled back into view re-arms on its own.

`DECODE_POOL = 4` (`:97`) is decode **concurrency**, not window size; raising it does not move peak memory.

**Auto-lite tier:** `navigator.deviceMemory` does not exist in Safari, so instead of UA sniffing the first segment times its first two decodes; above `DECODE_SLOW_MS = 120` (`:280`) the page flips to lite (half the frames, half the window) for the session. `?lite=1` forces it.

### The claims layer
Nothing on this page may state a fact about the real world except through `lib/content`. `content/claims.json` holds **24 claims**: 6 verified, **16 unresolved and blocking launch**, 0 blocking the build, 2 safe to ship with a fallback applied. `claimMode(id)` (`lib/content/index.ts:139`) returns one of three:

- `publish` — verified, render it plainly
- `omit` — render the claim's **designed absence** (not a blank, a deliberate alternative)
- `dev` — render the value behind a visible provenance chip naming the claim id

`components/Pending.tsx` is for copy that has no claim yet; it **throws** in a production content build. There are currently **zero** `<Pending>` usages left, which is why a production content build now completes.

### The three content modes
Set by `NEXT_PUBLIC_RPAY_CONTENT`:

| Value | `claimMode` returns | What the reader sees |
|---|---|---|
| *(unset)* — **development** | `dev` | 4 provenance chips, dimmed figures |
| `demo` | `publish` for everything | figures rendered plainly, no chips |
| `production` | `omit` | unverified figures replaced by their designed absence |

**`demo` publishes nothing and verifies nothing.** It only decides whether a value the build already renders wears a chip. `scripts/check-content.mjs --production` is the separate launch gate and still exits 1 on the 16 blockers regardless of mode.

---

## 3. DECISIONS ALREADY MADE, AND WHY

**Canvas image sequences, not `<video>`.** Concept 07 scrubbed `video.currentTime` and came apart on iOS Safari, where every seek costs a keyframe decode plus everything between it and the target. An array index cannot stall.

**AVIF q45, not q65.** Measured through sharp/libheif on files verified to actually paint in a browser: `webp q72` = 65,597 B/frame at SSIM 0.9844; `avif q65` = 77,794 B at 0.9912 — **30% heavier than the WebP it replaced, a regression**; `avif q45` = 42,211 B at 0.9842 — same quality as webp q72 for **36% fewer bytes**. An earlier AVIF measurement was taken on files ffmpeg 6.1 wrote with a valid header that no browser will open, and it passed an ffmpeg SSIM check because ffmpeg read back its own broken output.

**Arm/release as hysteresis bands, not observers.** Two `IntersectionObserver`s with incompatible thresholds contradicted each other and blanked segments — see section 4.

**`dvh` for the hold, `vh` for the scroll box.** See STOP item 3.

**The warm accent is reserved for human action.** The token is `--warm: #ffb65c` (`lab.css:41`) — commit prose calls it "gold"; **there is no `--gold` token**. It is the CTA button fill (`.cta-warm`), the peak-CTA wash, the contact seam, and the provenance chips. Headline emphasis uses `--cyan`/`--mint` instead, because a warm phrase above a warm button spends the button's whole advantage.

**«جهاز», not «ماكينة»,** for the unit. The title card said ماكينة while the stat tile said جهاز — one page, two words for one thing (fixed in `6e435cb`). Body copy is now جهاز/أجهزة throughout, matching R.Pay's own أجهزة. **One user-facing exception remains:** the alt text at `page.tsx:558`. See the contradictions note at the end of this file.

**«آر باي», with the hamza — never «ار باي».** Settled against rpay.sa's own published copyright line, retrieved 2026-08-19.

**The 13 tile says «علامة تجارية / Brands», not «موقع / Locations».** Ahmed supplied 13 as the brand marks on rpay.sa's logo wall, counted 2026-08-20 — and `lib/assets/logos.ts` renders exactly those 13 directly beneath the tile, so a reader can count them. It is **not** a locations figure: Roshn, Dar Al Arkan, Kinan, Hamat, Al Khozama and LuLu are developers and chains holding many properties each, so the real site count is **larger** than 13. Labelling it "locations" was wrong twice — wrong unit, and understated. Routed through `customers.brandCount`.

**No competitor comparison table.** R.Pay's own material leads with one, and the revenue-model diagram at `page.tsx:615` is its first row — but the argument is made **by length**, not by a table: the traditional path is physically longer across the page and has two dashed nodes in the middle that are not you. **Competitors are deliberately unnamed.** (Note: `docs/redesign-2026/01-PRODUCTION-SPEC.md` line 202 specifies a comparison table — that is the separate `/redesign` workstream, not this route.)

**No price anywhere on this page.** The secondary CTA reads «تصفّح الجهاز / View the device», not "Buy now" — the destination offers add-to-cart against a price marked «أسعار توضيحية», and a button that says buy should reach a committed price.

**No SLA, no free-unit offer.** «ردّ خلال يوم عمل واحد» and «ونركّب أول جهاز دون تكلفة عليكم» were both removed: nobody at R.Pay agreed to a response time, and a free first unit is a commercial term this repo cannot invent.

---

## 4. BUGS FOUND, AND WHAT ACTUALLY CAUSED THEM

Where the first diagnosis was wrong, the wrong one is named so you do not re-walk it.

**Only the segment you loaded on ever painted** (`c91f288`). *Symptom:* B and C black, `armed=0 loaded=0`. *Wrong diagnoses, both ruled out:* ownership was not transferring; segments could not re-arm. Neither was true — ownership transferred correctly throughout, and segments could arm repeatedly. *Actual cause:* two rules contradicted each other. Arming was an `IntersectionObserver` with `rootMargin: 100%`, firing a viewport **before** visibility; reclaiming took encoded bytes from any segment with zero visible area. A segment that just armed early is by definition not yet visible, so it was emptied in the same frame — and because `IntersectionObserver` is **edge**-triggered and the segment was already inside the margin, no second arm event ever came. *Fix:* one page-level arbiter on continuous scroll position with hysteresis bands (1.0 / 2.5 viewports), level-triggered.

**Reduced motion painted every segment's LAST frame** (`0c2d110`). *Symptom, reported from a real Mac:* the canvas shows the last frame of each segment, frozen; the scroll-to-frame mapping pinned at maximum. *Wrong diagnoses — four were investigated and all four were false:* it was not the scroll source (`targetIndex` has always read the rect); not the intro overlay corrupting `stableVH()` (vh reads 900 in every probe; the overlay is `position: fixed`); not the arbiter judging already-passed segments; not `dvh`/`vh` resolving differently. **It was not WebKit at all** — Chromium does exactly the same thing. *Actual cause:* `prefers-reduced-motion` selects `mode="static"`, and that branch hardcoded `cur = N - 1` — the last frame — three lines after loading `frameSrc(0)` as the poster. The code painted the opening frame and immediately replaced it with the closing one. *Fix:* the static branch pins index **0**. If you see this symptom again, check whether the machine has Reduce Motion enabled before anything else.

**The poster that never recovered after backgrounding** (`bbef4e2`). *Symptom:* background the tab mid-segment, return, and the segment shows its opening frame frozen with `live=0`, forever, with `data-frame` still reporting the old index. *Actual cause:* `evictAll()` reset `drawn` but not `lastC`. The resumed tick computed `c === lastC`, skipped `maintain()`, and never rebuilt the window; `draw()` fell back to the poster every tick. *Fix:* one line — reset `lastC` too. *Why nothing caught it:* a poster is not black, so every "is it blank" check passed. See section 5.

**The page was advertising contact payment** (`6e435cb`). *Symptom:* none visible — it read fine. *Actual cause:* «تلامسي» is contact-based; contactless is «لاتلامسي». The opening paragraph of a page whose entire film is built on a tap stated the **opposite** of the product. R.Pay's own CM30 spec says «ولاتلامسي المستوى 1».

**"NADUV" signage in the film** (`e413171`). *Symptom:* clip 2 carried an illuminated sign reading NADUV over a mall entrance, around frames 58-68. *Fix:* re-rolled the clip describing the facade as **blank** rather than forbidding text, which worked. *The detection tool's own trap:* the specified design — keep OCR hits above roughly 55% confidence — does the **opposite** of what it should. Tesseract read the real sign at 2-3% while film grain scored "com" at 76%. Confidence rates how word-like a string is, and stylised motion-blurred signage is not word-like; a 55% floor drops the true positive and keeps the noise. What works is **persistence plus agreement**: a sign holds its region across consecutive frames and reads nearly the same each time. `npm run ocr` is triage, not an oracle — a flagged cluster means "go and look".

**The invisible riyal mark** (`09a4515`). *Symptom:* the figure read as a bare 465,255 with no currency on it. *Actual cause:* `.stats .fig` fills its gradient with `background-clip: text` and `color: transparent`, so the mark's `-webkit-text-fill-color: currentColor` resolved to that same transparent. It occupied 27.9px and drew nothing. Development never showed it because dev mode dims the tile and overrides the gradient — it only appears once a currency claim reaches `publish`, which today means demo. *Fix:* an explicit colour (`lab.css:652-656`, mint).

**Invented capabilities** (`2bec9fb`, `44923ff`). Two capabilities were proposed for the arcade argument and are **not** in it: "game activation" appears **nowhere** in R.Pay's material (zero hits for تفعيل or activation across v1-original, the brief and rpay.sa); and «استرداد تلقائي» is published with **no trigger stated**, so "automatic refund when a game fails" is this repo's reading, not theirs. Separately, the fault alert and the refund were one sentence, which said **by adjacency** what had just been refused in words — that a fault triggers a refund. Split into two cards. Recorded as `sectors.arcadeDepth` and blockers.md question 18.

**The orphaned grid cell** (`5df9417`). *Symptom:* a solid lit block beside the fifth objection card that read as a broken card. *Actual cause:* `auto-fit` gave four columns for five cards, so the fifth sat alone on row two beside an **empty** cell — and the container painted `var(--line)` behind a 1px-gap grid, so the empty cell rendered as a lit block. *Fix:* six explicit tracks, each card spanning two, the fourth starting at column 2 so the last two centre (`lab.css:911-922`). The container can no longer paint the hairlines at all — a centred final row leaves real gaps and **any** background shows through them as the same false block. Each card carries its own border instead. Swept `.props` and `.stats`, which use the same pattern and are **not** at risk: `auto-fit` collapses unused tracks to literally 0px.

**The header struck headings through** (`e0a079e`). *Symptom:* the tallest heading on the page rendered its glyphs blended into the wordmark's at 390px and 320px. *Actual cause:* `.lab-mark` had a text-shadow and **no surface**, so both elements occupied the same pixels. *Why z-order was not the fix:* whichever element wins, both still occupy those pixels — raising the heading only reverses which one is mangled. Height reservation and scroll-padding both assume the collision happens at rest; it happens mid-scroll at every position. *Fix:* `.lab-mark` gets an opaque pill (`rgba(5,7,10,0.82)` plus blur, `lab.css:144`), `.lab-lang` opacity to 0.86, and `.lab-top` a 98px scrim.

**The segment B seam** (`740f64c`). *Symptom:* reported as "the camera goes backwards for roughly a second" at the film's peak. *Wrong diagnosis:* a brightness-signature reversal detector confidently reported a reversal in the wrong place — it was tracking the corridor going dark, not the camera moving. That detector was deleted (`af02493`) rather than kept, because keeping both invites trusting the wrong one. *Actual cause:* not a reversal at all. Clip 3 and clip 4b were both anchored to the same frame, but clip 3 overshoots it: its frame 87 matches clip 4b's first frame at distance 1.30 while its **last** frame is at 26.78. The cut teleported the camera 34 frames — 1.42s — backwards. *Fix:* trim clip 3 to 87 frames. Encoded into `build-segments.sh` so it cannot regress silently.

---

## 5. THE TOOLS THAT LIED, AND THE GUARDS THAT NOW EXIST

**A green harness has repeatedly meant nothing on this project.** Every item below passed while the page was broken.

| The tool claimed | What was actually true | The guard now |
|---|---|---|
| `lab-measure` passed throughout while B and C were black | It drives one segment in isolation and never asks the others anything | `scripts/lab-fullpage.mjs` walks the whole page and reads pixels off **every** segment |
| Paint harness passed **7/7** while a real Mac showed every segment frozen | `lab-fullpage` never launches a reduced-motion context, so its seven combinations are seven variants of the **non-static** path | `scripts/lab-reduced.mjs` — reduced-motion contexts on both engines, canvas compared against the **actual frame files on disk** and told apart by name |
| `lab-measure`'s reduced-motion profile scored a pass | Declared `frames: 1, skipScrub: true`, asserting only that **a** frame painted — never **which**. `N-1` satisfied it exactly as well as `0` | Frame identity is `lab-reduced`'s job; `lab-measure` now at least exits non-zero on its own failures |
| `lab-resilience` said **"never blank"** three times | `luma > 1` means *not black*. A frozen **poster** is not black, so a segment stuck on the wrong frame forever passed | Each check now records the picture **before** the disruption and demands it back (delta under 4.0 luma), with the window rebuilt and the poster cleared |
| `lab-viewport` reported **drift 0** | It read `data-frame` and nothing else — an attribute the component writes from its own `cur`, reporting **intent, not outcome**. It said frame 56 while the poster was displayed | It now samples canvas luma at every step and fails if the picture moved while the index did not, or if the poster appeared at all |
| `lab-measure` printed a failure mark and returned **exit 0** | It had **no exit site anywhere in the file**. Wrong codec, peak memory over budget, an incomplete scrub, a crashed profile — all advisory | Tallied and exited on, crash count included |
| A capture showed the page without the change in it | An orphaned `next start` answered 200 from a 40-minute-old build | `scripts/lab-build.mjs` compares `.next/BUILD_ID` against the buildId Next embeds in the served payload, **before any browser launches**. It aborts; it does not warn |
| A near-full-screen empty gap, reported as a layout defect | A capture taken mid-scroll showed `.rv` content that had not revealed yet | `lab-capture` asserts **every** `.rv` actually revealed and writes **no file** on failure |
| Every act came out blank | The server's `.next` had been overwritten underneath it, so nothing hydrated | Same build-identity guard |
| "The reveal threshold has a dead stretch" | Measured empirically by stepping 10px at a time: worst **30px** desktop, **20px** phone, median 0. There is no dead stretch and no fix to make. An earlier measurement reporting 460px outliers was rAF stalls **in the probe**, not the page | Left alone, deliberately |

Two harness bugs worth knowing because they produced **false negatives**: `page.bringToFront()` does not background a page (the tab still reports `visibilityState: "visible"`), so the visibility check was measuring nothing; and the watchdog test nudged the page 12px, which changed the frame index and let the **ordinary** draw path repaint, proving nothing. Both fixed — the visibility event is now dispatched (synthetic event, real listener, labelled as such) and the watchdog test holds still.

**fps and long-frame counts are deliberately not asserted.** They are the readings most sensitive to what else the machine is doing: 39.5 and 45 fps have both been recorded on healthy builds purely from running a sweep concurrently, and WebKit has spanned 28-51.5 fps across machines with nothing changing. A threshold there would cry wolf often enough to be ignored, which is worse than no threshold. They are reported; a human reads them.

---

## 6. HOW TO RUN EVERYTHING

**Restore on a fresh machine:**
```bash
git clone https://github.com/ahmedmagdy1987/R.pay.git && cd R.pay
git checkout concept-08-scrub-lab
git config user.name "Ahmed Magdy" && git config user.email "ahmedkassim17777@gmail.com"
npm install
npx playwright install chromium webkit    # REQUIRED — cache is outside the repo
npm run build
npm run lab:serve                          # port 3210
```

**Scripts, and what each one proves:**

| Command | Proves |
|---|---|
| `npm run lab:serve` | starts `next start` on 3210; names the PID if the port is held |
| `npm run lab:fullpage` | every segment paints and **moves**. Flags: `--mode down/up/mid/flick --view desktop/mobile --engine chromium/webkit` |
| `npm run lab:measure` | frame set, codec, page weight, **peak decoded memory**, scrub travel, fps. 4 profiles |
| `npm run lab:reduced` | under `prefers-reduced-motion`, the canvas shows each segment's **opening** frame — compared against the real files on disk |
| `npm run lab:viewport` | an iOS toolbar collapse does not move the frame **or** the pixels |
| `npm run lab:resilience` | backgrounded tab, forced discard, canvas-loss watchdog — each restoring the **same** frame |
| `npm run lab:objections` | the phone objection row snaps, peeks, and does not steal the vertical gesture. 5 widths |
| `npm run lab:capture` | a full-page screenshot that refuses to lie. Output to `shots-capture/` (gitignored) |
| `npm run ocr` | OCR sweep for signage in shipped frames. **Triage, not an oracle** |
| `node scripts/pacing-table.mjs` | reads the pacing curves **out of** `page.tsx` and reports px/s and frames-per-notch |
| `node scripts/check-content.mjs` | claim counts |
| `node scripts/check-content.mjs --production` | **exits 1** while any launch blocker is unresolved. This is the launch gate |

The **7/7 paint sweep** is not scripted as a set; it is these seven runs: `down`/`up`/`mid`/`flick` on desktop, plus `down` on mobile, across chromium **and** webkit.

**The three content modes:**
```bash
npm run build                                         # development — chips, dimming
npm run demo:build                                    # demo — plain figures, no chips
NEXT_PUBLIC_RPAY_CONTENT=production npx next build     # production content — designed absences
```
`demo:build` is a wrapper because npm scripts run through cmd.exe on Windows, where an inline `VAR=value` prefix is not valid syntax. It **refuses** to run if the variable is already `production`.

**How a demo preview is produced.** `vercel.json` points `buildCommand` at `scripts/vercel-build.mjs`, which resolves the content mode from `VERCEL_ENV`: an explicit value always wins; a **preview** with nothing explicit defaults to **demo**; production is never defaulted here; and a production deploy that resolves to `demo` **exits 1** rather than building. So pushing this branch produces a demo preview automatically. A local `next build` is unaffected — `VERCEL_ENV` does not exist off-platform.

Verified matrix (chips counted in each build's prerendered output):

| Scenario | Mode | Chips | Exit |
|---|---|---|---|
| `VERCEL_ENV=preview` | demo | **0** | 0 |
| `VERCEL_ENV=production` | development | 4 | 0 |
| local, no `VERCEL_ENV` | development | 4 | 0 |
| production + `content=production` | production | 0 | 0 |
| production + `content=demo` | **REFUSED** | — | **1** |

---

## 7. WHAT IS STILL OPEN

**16 unresolved launch-blocking claims** in `content/claims.json`. Run `node scripts/check-content.mjs` for the live list. They are: `fleet.machines`, `fleet.online`, `fleet.branches`, `fleet.branchNames`, `totals.transactions`, `totals.prizes`, `totals.settledToday`, `rails.accepted`, `customers.logos`, `customers.namedDeployments`, `hardware.name`, `company.registration`, `commercial.tour`, `commercial.contact`, `commercial.venueProposition`, `commercial.privacy`.

**4 hard blockers** — the ones that actually stop publishing, from `scratchpad/blockers.md` (18 questions in Arabic for the client, updated 2026-08-20). **Answered by the client, via Ahmed:**
1. The contact number every CTA reaches (Q3)
2. CR number, VAT number, registered address (Q13)
3. A privacy policy covering this page (Q14)
4. Written consent for customer logos and location names (Q15-16) — or remove them

Everything else is designed to be withheld: the page ships with fewer numbers rather than with gaps.

**The production alias.** `r-pay-orcin.vercel.app` — the URL people actually get — is **not serving `main`**. `main` has no `app/concepts/lab` at all, yet that host answers 200 on `/concepts/lab` with 4 provenance chips, and its CSS hashes match a HEAD build exactly. Some branch deployment holds the alias. The most likely cause is a **Git Branch assignment** on the domain in Vercel, Settings then Domains, which fits all the evidence: branch commits still register as *Preview* in GitHub, and the newest *Production* deployment is still 2026-08-16 from `97f09c3`. Requires dashboard access; nobody has repointed it yet. Confirm afterwards with `curl` — `/concepts/lab` must **404** and `/`, `/concepts/one-tap`, `/meeting` must all be 200.

**Production has never built in production content mode.** It builds in *development* mode, with chips. Deliberately not changed: setting it omits all 16 unverified claims including the payment-methods row and the customer logos, which is a visible content change to a client-facing page and the client's call. One variable in the Vercel dashboard when wanted.

**Deliberately left undone:**
- The pull-back in segment C is the fastest thing on the page at 8.86 frames per scroll notch and lags hardest. Intended **in kind** (it is a scripted pull-back) but never tested **in degree**.
- Segment C is structurally the fastest segment; the pulse reaches only 200 px/s against a brief asking for slow. 330vh is the ceiling for the current shape; roughly 340vh or more would buy it about 300 px/s at the pull-back's expense.
- The `.rv` reveal threshold: measured, found fine, deliberately untouched.
- Eight Arabic strings sit below a 16px reading floor (breadth row 14.4px, ghost CTA 15.2px, diagram caption 13.8px, and five micro-labels). The first three are reading text and were flagged for a decision; the rest are micro-labels where 16px is the wrong yardstick.
- Warming the decode window on **arm** rather than on first draw — the honest next lever for the 21 remaining fallback draws in slow-forward scrubbing (down from 85).

---

## 8. WHAT IS UNVERIFIABLE — iOS

**No iOS device has ever opened this page. Not once.** Everything below is *blind mitigation*, not verification. Do not let it read as tested.

**Handled blind — the code exists and is exercised by a harness, on desktop engines only:**
- Backgrounded tab: `visibilitychange` and `pagehide` shed every decoded bitmap and stop the loop; encoded blobs stay. Tested with a **dispatched** event (real listener, synthetic event) in Chromium — not on iOS.
- Canvas-loss watchdog: Safari can drop a backing store with no event. Every paint stamps one pixel in the corner with a fixed invisible colour; the loop re-reads it every 400ms and redraws on mismatch. Overhead measured at 0.0015 ms per sample. **Verified in Chromium by wiping the canvas deliberately** — the real Safari failure mode has never been observed here.
- Toolbar-driven viewport changes: `lab-viewport.mjs` **simulates** iOS by overriding `innerHeight` and firing `resize`, because `page.setViewportSize` resizes the layout viewport — that is a window resize, not a toolbar, and it fails before and after for the wrong reason. The simulation is reasoned, not confirmed against a device.
- Memory: the 65.9 MB ceiling exists because iOS Safari discards tabs. The ceiling is measured; **the discard threshold on a real iPhone is not known.**
- `prefers-reduced-motion`: now verified on both engines — and note this was the cause of the "Safari bug" that was never a Safari bug.

**Cannot be confirmed without hardware:**
- Whether iOS Safari discards the tab at 65.9 MB peak on any particular device.
- Whether the canvas-loss watchdog fires correctly when Safari actually drops a backing store.
- Whether the real toolbar behaves as the simulation assumes.
- **The auto-lite tier's only real trigger on iOS is the decode probe.** `navigator.deviceMemory` is Chromium-only and absent on Safari — the browser the tier exists for — so on iOS the `?lite=1` query param is the only other way in. That is a stated limitation, not an oversight.
- Real-device frame rate. **Playwright's WebKit on Windows is not Safari on Apple silicon**; it bounds rather than predicts the iPhone.

---

## Contradictions found while writing this file

Recorded rather than silently smoothed over:

1. **There is no `--gold` token.** The accent is `--warm: #ffb65c`. Commit prose and briefs call it "gold"; the code has never used that name.
2. **«ماكينة» still appears in one user-facing string** — the alt text at `app/concepts/lab/page.tsx:558`, «ماكينة ألعاب أركيد وعلى واجهتها قارئ دفع لاتلامسي». The جهاز standardisation covered body copy. Whether the arcade plate's alt text should also change is a judgement call and has not been made.
3. **`captureBeyondViewport` does not exist in this repo**, and never has in its git history. The capture tool's three real failures are the ones in section 5; whatever that name refers to is from elsewhere.
4. The comparison-table decision is recorded in a **source comment** at `page.tsx:615`, not in any commit message. `docs/redesign-2026/01-PRODUCTION-SPEC.md` does specify a comparison table, but for the separate `/redesign` route.

---

## Superseded documents

`CONCEPT_08_QA_REPORT.md`, `CONCEPT_08_RESEARCH.md` and `CONCEPT_08_VISUAL_SYSTEM.md` remain in the repo as historical record. **This file supersedes them** wherever they disagree: they predate the branch's later work and describe states the page has since left. The root reports from the era-1 homepage (`SETUP_REPORT.md`, `FINAL_DEPLOYMENT_REPORT.md` and siblings) describe a different site entirely and are not about this concept.
