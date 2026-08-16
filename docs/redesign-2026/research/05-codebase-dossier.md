===== TOKENS =====
## R.Pay CSS / Design-Token Architecture — Full Audit

### 0. Inventory & line counts

| Stylesheet | Lines | Loaded by | Scope root |
|---|---:|---|---|
| `app/globals.css` | **59** | `app/layout.tsx:3` (root, every route) | `:root` / bare elements |
| `app/hub.css` | **130** | `app/page.tsx:3` (`/` only) | `.hub*` prefixes, global `html.light` |
| `app/concepts/latest/latest.css` | **774** | `latest/layout.tsx:4` | **unscoped** (`:root`, `body`, `h1`, `section`, `footer`) |
| `app/concepts/video-hero/video-hero.css` | **592** | `video-hero/layout.tsx:4` | **unscoped** |
| `app/concepts/machine/machine.css` | **514** | `machine/layout.tsx:4` | **unscoped** |
| `app/concepts/pulse/pulse.css` | **628** | `pulse/layout.tsx:3` | `.pl` token root, selectors only *name*-prefixed |
| `app/concepts/cinema/cinema.css` | **312** | `cinema/layout.tsx:3` | `.cn` token root, selectors only *name*-prefixed |
| `app/concepts/flow/flow.css` | **885** | `flow/layout.tsx:3` | `.flow` — **every** selector descendant-scoped |
| `app/concepts/one-tap/one-tap.css` | **1199** | `one-tap/layout.tsx:3` | `.onetap` — **every** selector descendant-scoped |
| `app/concepts/coming-soon/coming-soon.css` | **51** | `coming-soon/layout.tsx:2` | `.cs*`, global `html.light` |
| **Total** | **5144** | | |

There are effectively **three generations** of architecture in one repo: Gen-1 unscoped global (`machine`, `video-hero`, `latest`, + `coming-soon`/`hub`), Gen-2 name-prefixed (`pulse`, `cinema`), Gen-3 strictly class-scoped (`flow`, `one-tap`).

---

### 1. The brand token set

#### 1.1 Canonical set — `app/globals.css:13-33` (the only file every route gets)

**Color primitives**
- `--cyan:#00AEEF` · `--blue:#0E6DD0` · `--mint:#1FD3B8` (`globals.css:14`)

**Gradients**
- `--grad:linear-gradient(100deg,var(--cyan),var(--mint))` (`:15`) — the brand gradient, used for every `background-clip:text` headline, `.btn`, progress bars
- `--bg-grad:radial-gradient(120% 80% at 70% -10%,#0b2d55 0%,#06192f 42%,#040f1e 100%)` (`:21`)
- `--panel-2:linear-gradient(160deg,rgba(12,36,64,.85),rgba(6,22,42,.8))` (`:25`)
- `--scrim:radial-gradient(90% 60% at 50% 35%,transparent 30%,rgba(3,11,22,.6) 100%)` (`:29`)
- `--edge:linear-gradient(140deg,rgba(0,174,239,.55),rgba(130,200,255,.08) 30%,rgba(130,200,255,.06) 65%,rgba(31,211,184,.45))` (`:32`) — masked 1px rim used by `.card::before`, `.stgrid::before`, `.cmp::before`

**Surfaces / text (dark)**
- `--bg:#040f1e` (`:20`) · `--ink:#eaf6ff` · `--muted:rgba(224,240,255,.64)` (`:22`)
- `--line:rgba(120,190,240,.15)` · `--brd:rgba(130,200,255,.2)` (`:23`)
- `--panel:rgba(8,26,48,.55)` (`:24`) · `--surface-2:rgba(4,13,26,.72)` (`:26`)
- `--nav-bg:rgba(5,17,32,.72)` · `--menu-bg:rgba(4,14,28,.98)` (`:27`)
- `--hover:rgba(120,190,240,.08)` · `--chip:rgba(120,190,240,.06)` (`:28`)
- `--gridln:rgba(0,174,239,.5)` (`:31`)

**Shadow** — exactly one token: `--shadow:0 30px 70px -30px rgba(0,0,0,.7)` (`:30`)

**Spacing** — exactly one token: `--padx:clamp(18px,4vw,54px)` (`:18`)

**Fonts** (`:16-17`)
- `--fa:var(--font-plex),system-ui,sans-serif` — Arabic default = IBM Plex Sans Arabic, weights `300,400,500,600,700` (`app/layout.tsx:11-16`)
- `--fe:var(--font-bric),var(--font-plex),system-ui,sans-serif` — English = Bricolage Grotesque (variable, no `weight` array → `app/layout.tsx:6-10`)

**Radii** — **there is no radius token anywhere in globals.** Every radius is a literal: `999px` pills, `22px` (`hub.css:76`), `20px`/`18px`/`16px`/`14px`/`13px`/`11px`/`9px` scattered. Only `one-tap.css:44` declares one: `--r: 18px; /* one radius, page-wide */`.

#### 1.2 Per-concept token roots (each redefines its own world)

| Token | globals / latest / video-hero | machine | cinema | pulse | flow | one-tap |
|---|---|---|---|---|---|---|
| accent | `--cyan:#00AEEF` | `--cyan:#00AEEF` | `--pc:#00AEEF` | `--pc:#00AEEF` | `--cyan:#00AEEF` | **`--cyan:#35E0D4`** |
| secondary | `--mint:#1FD3B8` | `--mint:#1FD3B8` | `--pm:#1FD3B8` | `--pm:#1FD3B8` | `--mint:#1FD3B8` | *(none)* |
| tertiary | `--blue:#0E6DD0` | `--blue`+`--navy/2/3` | — | `--pb:#0E6DD0` | — | — |
| action | — | — | — | — | `--warm:#FFB65C` | `--warm:#FFB454` |
| alert | — | — | `--alert:#ff5d73` | `--alert:#ff5d73` | — | — |
| ink | `#eaf6ff` | `#eaf6ff` | `#eaf6ff` | `#eaf6ff` | `#EAF6FF` | **`#F2F6FA`** |
| secondary text | `--muted:rgba(224,240,255,.64)` | `--muted:…,.62` | `--mut:#9dbcd8` | `--mut:#9dbcd8` | `--mute:rgba(224,240,255,.58)` | `--mute:rgba(226,240,252,.60)` |
| hairline | `--line:rgba(120,190,240,.15)` | same | `rgba(126,196,255,.16)` | `rgba(126,196,255,.16)` | `rgba(126,196,255,.14)` | `rgba(126,196,255,.14)` |
| gutter | `--padx:clamp(18px,4vw,54px)` | same | `clamp(18px,4.5vw,60px)` | `clamp(18px,4.5vw,60px)` | `clamp(1.25rem,5vw,4rem)` | `clamp(1.25rem,5vw,4rem)` |

Sources: `machine.css:2-10`, `cinema.css:7-16`, `pulse.css:8-18`, `flow.css:19-48`, `one-tap.css:30-56`.

`flow`/`one-tap` add self-hosted faces via `@font-face` at the top of their own files (`flow.css:1-6`, `one-tap.css:1-6`) — Readex Pro 400/600/700 + IBM Plex Mono 400/500 from `/public/fonts` — and expose them as `--fd` (display), `--fb` (body), `--fm` (machine/mono). `one-tap.css:42` explicitly restricts `--fm` to "digits/Latin ONLY".

`one-tap.css:44-48` is the only file with a full layout token set: `--r:18px`, `--w-content:1240px`, `--w-text:760px`, `--gap-act:clamp(4rem,8vw,6.75rem)`.

---

### 2. Light / dark theming

**Mechanism.** `app/layout.tsx:73` ships `<html lang="ar" dir="rtl" className="dark …">`. An inline pre-paint script (`app/layout.tsx:76-81`) reads `localStorage['rpay-theme']` and swaps `dark`/`light` on `documentElement` before first paint. Toggling is per-page React (`app/page.tsx:134-138`, `latest/page.tsx:20-24`, `video-hero/page.tsx:20-24`, `coming-soon/page.tsx:26-30`) — all four write the same `rpay-theme` key.

**globals.css deliberately ships no light palette** — `globals.css:8-10` states it: *"Light-theme tokens are intentionally NOT defined here — themed routes (hub, latest, video-hero) declare their own `html.light`; the dark-only machine concept is left untouched."* Specificity makes this work regardless of file order: `html.light` = (0,1,1) beats `:root` = (0,1,0).

**Light-mode support matrix**

| Route | `html.light` block | Theme toggle in UI | Verdict |
|---|---|---|---|
| `/` hub | `hub.css:8-15` (7 tokens) | yes (`page.tsx:134`) | **light** |
| `latest` | `latest.css:24-38` (16 tokens) + 11 component overrides (`:64,189,204,690,726-727,740,766-774`) | yes | **light — the most complete implementation** |
| `video-hero` | `video-hero.css:22-34` (15 tokens) + `:532,690` | yes | **light** |
| `coming-soon` | `coming-soon.css:5-11` (6 tokens) | yes | **light (minimal)** |
| `machine` | none | none | **dark-only** |
| `cinema` | none — `.cn` hardcodes `background:#03080f` (`cinema.css:13`) | none | **dark-only** |
| `pulse` | none — `.pl-bg` fixed dark gradient (`pulse.css:27-30`) | none | **dark-only** |
| `flow` | none — `background:var(--void)` `#05070A` (`flow.css:43`) | none | **dark-only** |
| `one-tap` | none — documented at `one-tap/layout.tsx:23-25`: *"Dark-only by design: every scene asset is a night scene; a light theme would be a different art direction, not a token swap."* | none | **dark-only** |

So: **4 light-capable routes (hub + 3 concepts), 5 dark-only concepts.** The dark-only routes are safe against a persisted `html.light` because their tokens live under a `.pl`/`.cn`/`.flow`/`.onetap` class root, or (machine) because `machine.css:2-10` unconditionally overwrites `:root`.

`:root,html.dark{…}` double-selector appears in `hub.css:16`, `latest.css:9`, `video-hero.css:9`, `coming-soon.css:12` — **but not in `globals.css`**, which uses bare `:root` only. That asymmetry is why `latest`/`video-hero` had to re-declare the entire dark palette locally.

---

### 3. The bilingual AR/EN system

**Model: Arabic is the default; English is the exception.** No i18n library — both language strings are in the DOM simultaneously and CSS switches visibility.

**Core switch — `globals.css:50-55`:**
```
.en-t{display:none!important}
html.en .ar-t{display:none!important}
html.en .en-t{display:revert!important}
.ar-t{letter-spacing:normal}
```
`display:revert` (not `block`/`inline`) is correct — it restores each element's UA default so a `<b class="en-t">` stays inline and a `<div class="en-t">` stays block.

**dir switching** is JS, not CSS: every language toggle does `classList.add/remove("en")` + `setAttribute("dir","ltr"/"rtl")` — `page.tsx:121-129`, `latest/page.tsx:28-36`, `machine/page.tsx:20-28`, `video-hero/page.tsx:28-36`, `pulse/page.tsx:155-163`, `coming-soon/page.tsx:13-21`, `flow/_c/FilmHero.tsx:35-37`, `one-tap/_c/HeroFilm.tsx:79-81`. **`cinema/page.tsx:71-73` is the only one that also updates `lang`** (`h.setAttribute("lang","en"/"ar")`); the other eight leave `lang="ar"` on `<html>` in English mode.

**Font swap:** `html.en body{font-family:var(--fe)}` (`globals.css:46`), repeated at `machine.css:17`, `video-hero.css:41`, `latest.css:47`; scoped variants `html.en .cn{…}` (`cinema.css:17`), `html.en .pl{…}` (`pulse.css:19`).

**RTL handling — logical properties.** 419 occurrences of logical/directional properties across the 10 files. `inset-inline-start/end`, `margin-inline`, `padding-inline-end`, `border-inline-start`, `text-align:start/end` are the norm. Notable directional flips done properly:
- `html:not(.en) .tapcard{animation-name:tapR}` + mirrored `@keyframes tapR` — `machine.css:231-232`, `video-hero.css:255-256`, `latest.css:371-372`
- `html:not(.en) .cc-cta svg{transform:scaleX(-1)}` — `hub.css:119`
- `html[dir="rtl"] .brands .mtrack{animation-name:plmarq-r}` with mirrored keyframes — `pulse.css:243-245`
- `html[dir="rtl"] .onetap .ctrl-runner{transform:translateX(120%)}` + `@keyframes runner-rtl` — `one-tap.css:741-753`
- `html[dir="ltr"] .flow .net-stat::after{transform:translateX(-50%)}` — `flow.css:718` (and `:226` for `.preload .hair`), i.e. flow writes the RTL case as default and patches LTR
- `html.en .rli:hover{--dirx:-1}` custom-property direction flip — `latest.css:413-414`
- `direction:ltr` islands for Latin-only content: `.brand` (`machine.css:47`), `.marquee` (`:405`), `.hub-brand` (`hub.css:42`), `.onetap .brand` (`one-tap.css:312`), `.onetap .led{direction:ltr;unicode-bidi:isolate}` (`one-tap.css:156-162`), `.flow .hero .pays{direction:ltr}` (`flow.css:298`)

**Letter-spacing rule.** The house rule is stated at `globals.css:54` and again at length in `latest.css:53-57`: *"Arabic never takes Latin tracking — letter-spacing severs cursive joining."* Implementation is `.ar-t{letter-spacing:normal}`, plus **per-site opt-back-in exceptions** where the parent is a tracked uppercase Latin label:
- `html.en .hub-tag .ar-t{letter-spacing:.22em}` (`hub.css:51`)
- `html.en .cc-status .ar-t{letter-spacing:.12em}` (`hub.css:102`)
- `html.en .cc-eyebrow .ar-t{letter-spacing:.16em}` (`hub.css:113`)
- `html.en .cs-badge .ar-t{letter-spacing:.2em}` (`coming-soon.css:32`)
- the mirrored pair for the script-swapping block: `.integ-en .ar-t{letter-spacing:.06em}` / `html.en .integ-en .en-t{letter-spacing:normal}` (`latest.css:59-60`)

**Duplicated / redundant language plumbing:** `machine.css:20-22`, `video-hero.css:44-46`, `latest.css:50-52` re-declare the identical `!important` display rules already in globals. `cinema.css:18-20`, `cinema.css:260-262`, `pulse.css:22-24`, `pulse.css:537-539` declare **non-`!important`** scoped versions (`.cn .en-t{display:none}`, `html.en .cn .en-t{display:inline}`) which are **dead code** — globals' `!important` always wins, and it happens to produce the same result only by luck. `one-tap.css:165` re-declares `.onetap .ar-t{letter-spacing:normal}`; `flow` declares no language rules at all and relies entirely on globals — which contradicts its own header claim at `flow.css:11-12` (*"ALL tokens live under `.flow` so nothing can leak"*).

---

### 4. Per-route CSS isolation — the strategy and where it breaks

**Intended strategy** (`globals.css:3-8`): globals carries only "truly-global, collision-safe rules"; each route imports its own complete stylesheet in its `layout.tsx`, so `.hero`/`.nav`/`.card` never collide because Next.js code-splits CSS per route.

**Followed rigorously by 2 of 8 concepts.** `flow.css` and `one-tap.css` have **zero** unprefixed selectors — every rule is `.flow …` / `.onetap …`, including shared components (`.flow .wa`, `.onetap .marquee`, `.flow .brandlogo`) and keyframe names are namespaced (`flowmarq`, `onetap-marquee`, `rp-cue`, `echo-ring`, `runner-rtl`).

**Violated by 4 concepts.** `latest.css`, `video-hero.css`, `machine.css` write directly to global scope:
- `:root{…}` — `latest.css:2`, `video-hero.css:2`, `machine.css:2`
- `html.light{…}` / `html.dark{…}` — `latest.css:9,24`, `video-hero.css:9,22`
- `*{margin:0;padding:0;box-sizing:border-box}` — `latest.css:39`, `video-hero.css:35`, `machine.css:11`
- `html{…}`, `body{…}`, `body::before{…}`, `a{}`, `img{}` — `latest.css:40-49`, `video-hero.css:36-43`, `machine.css:12-19`
- bare element selectors `h1` (`machine.css:92`), `section` (`:75`), `footer` (`:339`), and `.nav`, `.card`, `.hero`, `.stat`, `.btn`, `.menu`, `.wa`, `.radar`, `.orb`, `.bars`, `.brands`, `.marquee`
`coming-soon.css:5-12` likewise writes global `html.light` / `:root,html.dark`.

**Partially violated by 2 concepts.** `cinema` and `pulse` put *tokens* under `.cn`/`.pl` but leave selectors as bare global class names that merely start with a letter prefix: `.hud` (`pulse.css:44`), `.monu` (`:108`), `.mo` (`:111`), `.lab` (`:136`), `.tile` (`:319`), `.radar` (`:339`), `.deck` (`:421`), `.score` (`:437`), `.brands` (`:235`), `.wa` (`:525`), `.rv` (`:542`); `.reel` (`cinema.css:135`), `.fr` (`:143`), `.fstats` (`:157`), `.fos` (`:178`), `.fscore` (`:211`), `.wa` (`:249`), `.cv` (`:265`). **`.radar`, `.brands`, `.marquee`, `.mtrack`, `.brandlogo`, `.wa`, `.wa-btn`, `.wa-tip`, `.rv`, `.stat`, `.bars`, `.dev`, `.sweep`, `.fence`, `.orb`, `.ctamail` are defined with different values in both `pulse.css` and `latest/machine/video-hero.css`** — a genuine collision surface if any two route stylesheets are ever live in the same document (client-side nav retention, or a future shared layout).

**Concrete cross-file regressions caused by the unscoped generation:**

1. **The double-scrollbar fix is undone by three files.** `globals.css:37-43` carries a 5-line comment explaining that `body` must use `overflow-x:clip`, *not* `hidden`, because `hidden` makes `<body>` a second vertical scroll container. `latest.css:43`, `video-hero.css:40`, and `machine.css:16` all set `body{overflow-x:hidden}` — and being later in the cascade at equal specificity (`body`), they **win**. `flow.css:47` and `one-tap.css:55` correctly use `overflow-x:clip`.
2. **The iOS background-attachment fix is undone by `video-hero`.** `globals.css:44-45` and `latest.css:44-46` both document that the page gradient lives on a composited `body::before` fixed layer *specifically to avoid* `background-attachment:fixed`. `video-hero.css:39` does exactly the forbidden thing: `background-image:var(--bg-grad);background-attachment:fixed`. Worse, globals' `body::before{background:var(--bg-grad)}` is still in the cascade on that route, so the gradient is painted twice.
3. **`machine.css:14-16`** sets `body{background:var(--navy3);background-image:radial-gradient(…)}` while globals' `body::before` fixed layer still paints the near-identical `--bg-grad` on top — redundant double paint.
4. `latest.css:40-41` / `video-hero.css:36-37` / `machine.css:12-13` split `html{scroll-behavior:smooth}` and `html{overflow-x:hidden}` into two consecutive rules — a copy-paste artifact of the same ancestor file.

**Bulk duplication.** `machine.css`, `video-hero.css`, and `latest.css` are near-clones. `machine.css:1-397` and `video-hero.css:1-421` are line-for-line the same document apart from token substitution (machine hardcodes `rgba(5,17,32,.72)`, `rgba(120,190,240,.08)`, `linear-gradient(160deg,rgba(12,36,64,.85)…)`; video-hero swapped the same literals for `var(--nav-bg)`, `var(--hover)`, `var(--panel-2)`). `latest.css` is that same file plus a rewritten hero. Roughly **1,400 lines are triplicated**: the `.nav`/`.btn`/`.rv`/`.khead`/`.stitle`/`.bento`/`.sector`/`.hstep`/`.radar`/`.cmp`/`.ctabox`/`footer`/`.brands`/`.vending`/`.wa`/`.burger`/`.menu`/`.integ`/`.concept-back` blocks are byte-identical or near-identical in all three.

---

### 5. Typography scale actually in use

**Two disjoint systems.**

**System A — ad-hoc px + clamp (globals/hub/latest/video-hero/machine/coming-soon/cinema/pulse).** No named scale. Sizes are literal and long-tailed: `9px, 9.5px, 10px, 10.5px, 11px, 11.5px, 12px, 12.5px, 13px, 13.5px, 14px, 14.5px, 15px, 15.5px, 16px, 16.5px, 17px, 19px, 22px, 23px, 24px, 27px, 36px` — half-pixel sizes (`10.5`, `12.5`, `13.5`, `16.5`) appear dozens of times. Fluid headings use `clamp()` (**162 total `clamp()` calls** across the repo — hub 7, globals 1, video-hero 20, latest 21, machine 18, pulse 26, cinema 10, coming-soon 3, flow 23, one-tap 33):

- H1/display: `clamp(2.5rem,6vw,4.6rem)` (`machine.css:92`, `video-hero.css:116`) · `clamp(2.7rem,7vw,5.4rem)` (`hub.css:64`) · `clamp(2.7rem,7vw,6rem)` (`video-hero.css:562`) · `clamp(2.35rem,5.1vw,4.15rem)` (`latest.css:147`) · `clamp(2.4rem,6.5vw,4.6rem)` (`coming-soon.css:43`) · `clamp(2.2rem,5.4vw,4rem)` (`cinema.css:83`) · `clamp(42px,5.6vw,72px)` (`pulse.css:110`)
- Section title: `clamp(1.7rem,4.4vw,2.7rem)` (`machine.css:80`, `video-hero.css:104`) vs `clamp(1.8rem,4.6vw,3rem)` (`latest.css:122`) vs `clamp(1.8rem,3.6vw,2.7rem)` (`pulse.css:275`) vs `clamp(1.7rem,3.4vw,2.5rem)` (`cinema.css:111`)
- Stat number: `clamp(2.2rem,5vw,3.2rem)` (`machine.css:137`) vs `clamp(2.2rem,4.2vw,3.2rem)` (`latest.css:268`) vs `clamp(2.3rem,4vw,3.1rem)` (`pulse.css:263`)
- Body: `clamp(.95rem,1.2vw,1.06rem)` (`.ssub`), `clamp(1rem,1.3vw,1.15rem)` (`.hsub`), `clamp(1rem,1.35vw,1.18rem)` (`latest.css:152`)

**Weights**: `300` (body/lead copy — 40+ uses), `500`, `600`, `700`, `800`, and `900` in cinema/pulse only (`cinema.css:205`, `pulse.css:192,199,396`).

**Line-heights** (System A): `1.02` (`hub.css:63`), `1.03`, `1.05`, `1.06`, `1.1`, `1.12`, `1.15`, `1.2`, `1.25`, `1.3`, `1.32`, `1.35`, `1.7`, `1.75`, `1.8`, `1.85`, `1.9`, `1.95`, `2` — ~19 distinct values.

**Tracking** (System A): `-.022em`, `-.02em`, `-.01em`, `.01em`, `.02em`, `.06em`, `.1em`, `.12em`, `.13em`, `.14em`, `.15em`, `.16em`, `.18em`, `.2em`, `.22em`, plus px tracking in cinema/pulse (`.3px`, `.4px`, `.5px`, `-.5px`, `1px`, `1.5px`, `2px`, `3px`, `4px`).

**System B — a declared 4-step scale (flow, one-tap).** `flow.css:101-141` and `one-tap.css:108-137` define exactly four classes:

| | `.t-display` | `.t-beat` | `.t-body` | `.t-meta` |
|---|---|---|---|---|
| flow | `clamp(3rem,9vw,7.5rem)` / 700 / lh 1.34 / `-.02em` / `padding-block:.14em` | `clamp(1.6rem,4.5vw,3rem)` / 600 / lh 1.52 | `clamp(1rem,1.6vw,1.15rem)` / 400 / lh 1.8 | `.8rem` / 500 / `.08em` / uppercase |
| one-tap | `clamp(2.7rem,7.2vw,6.2rem)` / 700 / lh 1.34 / `-.02em` | `clamp(1.55rem,4.2vw,2.8rem)` / 600 / lh 1.5 | `clamp(1rem,1.6vw,1.15rem)` / lh 1.9 | `.8rem` / `.04em` |

The most sophisticated typographic work in the repo is `flow.css:104-141`: leading is set **for Arabic first** (1.34 display / 1.52 beat / 1.8 body, with `padding-block:.14em` to keep the damma inside the box) and then *tightened* for Latin under `html.en .flow .t-display{line-height:1.14;padding-block:.04em}` (`:139-141`). The comment records it as screenshot-verified, not arithmetic. `one-tap.css:136-137` extends the idea to tracking: `.onetap .en-t.t-meta,.onetap .t-meta .en-t{letter-spacing:.1em;text-transform:uppercase}` — uppercase/tracking is applied only to the English twin.

**Faux-bold hazard.** IBM Plex Sans Arabic is loaded at max weight **700** (`app/layout.tsx:13`). Bricolage is variable. Files that gate `800` behind `html.en` are correct — e.g. `machine.css:92-93`, `video-hero.css:116-117`, `video-hero.css:562-564` (`html:not(.en) .hero-title{font-family:var(--fa);font-weight:700}`), `.vtitle` in all three (`machine.css:423-424`, `latest.css:605-606`). Files that don't, synthesize bold on Arabic:
- **`latest.css:147-148`** — `.hero-title{font-weight:800}` with `html:not(.en) .hero-title{font-family:var(--fa)}` and **no weight reset**. This is a regression against the identical-purpose `video-hero.css:562-564`, which does reset to 700.
- `hub.css:63` `.hub-title{font-family:var(--fe);font-weight:800}` and `coming-soon.css:42` `.cs-title{font-family:var(--fe);font-weight:800}` force `--fe` in *both* languages; Bricolage has no Arabic glyphs, so Arabic falls through the stack to Plex at 800 → synthetic.
- `cinema.css:83` (`h1` 800), `pulse.css:110` (`.monu` 800), `pulse.css:275`, `pulse.css:263`, and the `font-weight:900` uses (`cinema.css:205`, `pulse.css:192,199,396`) — all render Arabic in Plex above its top weight.
- `flow`/`one-tap` are clean: only 400/500/600/700 are used, matching the self-hosted Readex/Plex-Mono faces exactly.

---

### 6. Inconsistency, duplication, token drift — ranked

1. **`--cyan` is redefined to a different hue by `one-tap`.** `one-tap.css:34` sets `--cyan:#35E0D4` (teal) against `#00AEEF` (brand blue) in all nine other files. Everything downstream — `#prog`, focus rings (`one-tap.css:228`), `.eyebrow::before`, `.sim i`, `.beat-chip.on .tick`, the KPI glow — is off-brand *by design intent* ("cyan is SYSTEM ENERGY only", `one-tap.css:13-15`), but the token name lies: consumers reading `--cyan` get two different colors depending on route.
2. **Four names for one role.** `--muted` / `--mut` / `--mute` for secondary text, with five different values (`.64`, `.62`, `#9dbcd8`, `.58`, `.60`). Same for the gradient: `--grad` (5 files) vs `--pgrad` (pulse) vs none (flow/one-tap).
3. **Light-palette drift between the four light-capable routes.** `--bg`: `#eef3fb` (`hub.css:9`, `coming-soon.css:6`) vs `#eaf1fa` (`latest.css:25`, `video-hero.css:23`). `--line`: `rgba(18,58,105,.14)` (hub, coming-soon) vs `.15` (latest, video-hero). `--brd`: `rgba(16,80,140,.24)` (hub) vs `.26` (latest, video-hero). Light `--bg-grad` terminal stop: `#dfe9f6` vs `#dde8f5`.
4. **Dark-palette drift.** `--muted` `.64` (globals/latest/video-hero) vs `.62` (`machine.css:4`); `--brd` `.2` vs `.18` (`machine.css:5`). Three different hairlines: `.15` blue-grey, `.16` and `.14` in `rgba(126,196,255,…)`.
5. **`--warm` drift between the two concepts that share the warm-is-action contract**: `#FFB65C` (`flow.css:25`) vs `#FFB454` (`one-tap.css:35`), with mismatched CTA text colors `#1a0f02` (`flow.css:169`) vs `#241503` (`one-tap.css:181`).
6. **`--edge` defined three times with three values**: `globals.css:32` and `latest.css:22` (`rgba(130,200,255,…)` stops), `latest.css:37` (its light variant), `flow.css:858` (`rgba(126,196,255,…)`, `.4`/`.5` alphas). Same visual device, three sources of truth.
7. **`--padx` has three definitions** (§1.2) and `flow`/`one-tap` add a second axis token (`--pad-block`, `--gap-act`) the others lack.
8. **Content max-width drift**: `1180px` (`machine.css:76,87,341,470,479`) vs `1280px` (`latest.css:118,141,494,503`, `video-hero.css:100,111`, `cinema.css:75,106,235`, `pulse.css:98,251,270`) vs `1100px` (`flow.css:649,690`, `one-tap.css:874,889`) vs `1240px` (`one-tap.css:45`).
9. **Section rhythm drift** between the two clone files: `section{padding:clamp(64px,9vw,110px) …}` (`machine.css:75`) vs `clamp(50px,6.5vw,86px)` (`video-hero.css:99`, `latest.css:117`).
10. **The shared `WhatsAppWidget` component is styled seven times, in two mutually incompatible ways.** Physical-side, always-right: `machine.css:432`, `video-hero.css:456`, `latest.css:614` (`bottom:22px;right:22px;left:auto`, 58px button, white tooltip `#fff`/`#0a2a4e`). Logical-side, mirrors with `dir`: `cinema.css:249`, `pulse.css:525`, `flow.css:435`, `one-tap.css:1019` (`inset-inline-start:20px` + `env(safe-area-inset-bottom)`, 52px button, dark tooltip). The same component therefore lands on opposite screen edges depending on route and language. The `.concept-back` pill has the same split: `left:18px` physical (`machine.css:508`, `video-hero.css:586`, `latest.css:720`) vs `inset-inline-end:20px` logical (`cinema.css:23-24`, `pulse.css:53`).
11. **Reduced-motion policy is inconsistent.** Nuclear `*{animation:none!important;transition:none!important}` — `machine.css:394`, `video-hero.css:418`; `latest.css:569` extends it to `*,*::before,*::after`. Surgical, per-element lists — `cinema.css:302-312`, `pulse.css:613-628`, `one-tap.css:1184-1198`. Duration-zeroing — `flow.css:91-99`, `one-tap.css:98-106`. `hub.css` has **no** `prefers-reduced-motion` block at all despite animating `.concept-card` transforms and glows.
12. **Dead code from the scoped-but-not-scoped concepts**: `cinema.css:18-20,260-262` and `pulse.css:22-24,537-539` are unreachable (overridden by globals' `!important`). `cinema.css:15` / `pulse.css:17` write `var(--fa,"IBM Plex Sans Arabic",…)` fallbacks that can never fire, since `--fa` is always defined at `globals.css:16` — and this is itself the leak that contradicts `pulse.css:3` ("local tokens, no theme leak") and `flow.css:11-12`.
13. **`latest.css:703`** still carries the tombstone comment for a removed v2.1 hero, while `video-hero.css:554-576` retains the live version of that same block — the two files have silently diverged around a shared `.hero` class name.
14. **Stray `!important` in component CSS**: `cinema.css:188` `.fabout-l{font-size:1.02rem !important;color:#cfe4f7 !important}` — a specificity patch, not a system rule.

===== CONCEPT08 =====
# R.Pay Concept 08 — `/concepts/one-tap` deep read

Files: `C:/Users/CCBoot/Documents/projects/r.pay/app/concepts/one-tap/{page.tsx,layout.tsx,one-tap.css}` + `_c/{HeroFilm,TapToAction,FleetCards,ControlRoom,MachineCards,TrustBand,StickyCTA}.tsx`. Confirmed newest: git `8b428c4 → e94994d` are the last feature commits before merge `611aa45`.

---

## 1. Section / act structure, in DOM order

`page.tsx:115-226` renders, in order:

| # | Element | File | Narrative purpose |
|---|---|---|---|
| 1 | `<HeroFilm>` — `.act.hero#tap` | `page.tsx:117` / `HeroFilm.tsx:86` | **Act I, "The Tap."** Full-bleed film of a terminal being tapped; headline "لمسة واحدة. تحكّم كامل." Establishes the single verb the whole page repeats. |
| 2 | `<TrustBand>` — `.act.trust` | `page.tsx:120` / `TrustBand.tsx:13` | **Unnumbered.** Deliberately hoisted proof — logo marquee + one verified claim — placed second so credibility lands before any argument (`page.tsx:119` comment: "proof lands right after the first impression"). |
| 3 | `<TapToAction>` — `.act.action#action` | `page.tsx:122` / `TapToAction.tsx:69` | **Act II.** Consequence of the tap: the machine wakes. Dark→lit clip + three beat chips (Tap → Authorized → In action). |
| 4 | `<FleetCards>` — `.act.fleet#fleet` | `page.tsx:123` / `FleetCards.tsx:48` | **Act III, "One network."** Scale: one tap → 97 machines → one operator view. Three-card row (fleet visual + two data cards). |
| 5 | `<ControlRoom>` — `.act.control#control` | `page.tsx:124` / `ControlRoom.tsx:67` | **Act IV.** The payoff for the buyer — a DOM-built ops dashboard that walks three states across a 240vh sticky section (`one-tap.css:682`). |
| 6 | `<MachineCards>` — `.act.machines#machines` | `page.tsx:125` / `MachineCards.tsx:50` | **Act V.** Sector qualification: arcade / vending / coffee. Answers "does it fit my machines?" |
| 7 | `.act.proof` | `page.tsx:128-140` | **Act VI.** Four canon numbers (465,255+ payments, 97, 9,434, 9) compressed into a band immediately before the ask. |
| 8 | `.act.close#demo` | `page.tsx:144-176` | **The Close.** Uncontested CTA + `close-terminal.webp` — the hero's object returns at rest, closing the visual loop (`page.tsx:142-143`, `one-tap.css:957-958`). |
| 9 | `<footer className="foot">` | `page.tsx:179-222` | Functional footer: brand, 5 nav links, WhatsApp/email, lang toggle. |
| 10 | `<StickyCTA>` | `page.tsx:224` | Mobile-only persistent ask. |

**Structural drift worth flagging:**
- `page.tsx:20` says *"Six acts"* — the page has **eight** sections. Trust and Close are unnumbered, so the header comment undercounts the actual composition.
- The CSS section order does **not** match DOM order: Act II at `one-tap.css:405`, Act III at `:509`, **Act V at `:642`**, then **Act IV at `:680`**, Act VI at `:867`. Reading the stylesheet top-to-bottom misrepresents the page.
- `HeroFilm.tsx:123` and `:146` label their CTAs "CTA 1 of 5" / "CTA 2 of 5". Actual count of `href="#demo"`: `HeroFilm.tsx:124`, `HeroFilm.tsx:147`, `MachineCards.tsx:93` (×3 via `.map`), `StickyCTA.tsx:42` = **six**, plus two direct `wa.me` links (`page.tsx:153`, `page.tsx:202`) and the floating widget. The inline counter is stale.

---

## 2. What the hero actually does

**Media selection** (`HeroFilm.tsx:30-41`): a single mount effect. If `prefers-reduced-motion: reduce`, it **never sets `src`** — no video element is created, no bytes fetched — and jumps straight to the resolved end state (`setEcho(true); setEnded(true)`, `:33-35`). Otherwise `matchMedia("(max-width: 820px)")` picks `hero-tall.mp4` (921 KB) vs `hero-wide.mp4` (981 KB) and the matching poster. Chosen **once**, no resize re-evaluation (`:40`, deliberate).

**Poster** (`HeroFilm.tsx:89`): a separate `<img className="hero-poster">` painted underneath, plus the same file as the `<video poster>` (`:93`). CSS stacks them identically (`one-tap.css:250-259`), video starts `opacity: 0` (`:260`) and fades to `1` on `.on` (`:261`).

**Autoplay**: `autoPlay muted playsInline preload="auto"` (`HeroFilm.tsx:95-99`). Plays **once** — no `loop` — and settles on its own last frame.

**The signature move** (`HeroFilm.tsx:43-50`, `:10-12`): `onTimeUpdate` watches for `currentTime >= PULSE_AT` (3.2s), fires exactly once via an `echoFired` ref, and sets `echo`. That drives two things simultaneously: a decorative expanding cyan ring (`HeroFilm.tsx:110`; `one-tap.css:272-291`, `scale(1)→scale(90)`) and the payment-brands row igniting with staggered per-child delays (`HeroFilm.tsx:161`; `one-tap.css:358-364`). The film's energy visibly crosses into the DOM. **This is the best idea on the page.**

**Replay** (`HeroFilm.tsx:52-76`): the ghost button "شاهد عملية الدفع". Resets `echoFired`/`echo`/`ended`, then uses a **double `requestAnimationFrame`** (`:56-58`) so the removed animation classes actually flush before being re-added — otherwise the CSS animation would not restart. Correct and non-obvious.

**Fallbacks:**
- `onError` (`:103`) → hide video, resolve echo + ended. Poster remains, page looks intentional.
- Replay `play()` rejection (`:68-73`) → same resolved state.
- No video element (reduced motion) → replay degrades to the DOM echo (`:61-66`).

**Two real hero defects:**

1. **Autoplay refusal on first play is unhandled.** There is no `.catch()` on the initial autoplay — the element relies on the `autoPlay` attribute. `onCanPlay` (`:100`) fires regardless of whether playback actually starts, so `on` becomes true and the video shows its first frame. If the UA refuses (iOS Low Power Mode, some data-saver / autoplay-blocking configs), `currentTime` never reaches 3.2, `onTimeUpdate` never fires, `onEnded` never fires. Result: **the echo never runs and `.pays` never lights, permanently** — the payment-brand row stays at `rgba(226,240,252,.34)` (`one-tap.css:356`) forever. `onError` does not cover this path. This is the single most likely field failure.

2. **Poster art direction is client-swapped, so mobile double-downloads.** `useState(POSTER)` (`:25`) means SSR always emits the **wide** poster; the tall poster only substitutes after hydration (`:39`). Mobile visitors fetch `hero-poster.webp` and then `hero-poster-tall.webp`, and the claimed-LCP image is the wrong crop until hydration. A `<picture>` with `media` attributes solves this at zero cost. Also: no `fetchPriority="high"` on `HeroFilm.tsx:89` despite the comment at `:15` naming the poster as LCP, and no `<link rel="preload">` for the `readex-pro-700.woff2` the headline needs (`one-tap.css:4`).

Minor: `PULSE_AT = 3.2` is hand-measured against a specific cut (`HeroFilm.tsx:10-12`), and `onTimeUpdate` only fires ~4×/s so the echo can land up to ~250 ms late. The echo origin `left: 68%; top: 55%` (`one-tap.css:275-276`) is manually tuned to the video's `object-position: 68% 50%` (`:258`) — with a separate mobile pair `left: 50%; top: 74%` (`:1122`) against `object-position: 50% 72%` (`:1104`). Three hardcoded couplings to one video file.

---

## 3. Per-component interaction model and state

### HeroFilm — `_c/HeroFilm.tsx`
State: `src`, `poster`, `on`, `echo`, `ended` + `echoFired` ref (`:22-28`). `ended` applies `.settled` to the section (`:86`). **`.settled` has zero CSS rules anywhere in `one-tap.css` — verified by grep. It is dead state.** Also owns a local `toggleLang` (`:78-83`) that is **byte-duplicated** in `page.tsx:108-113` and (checked) in `flow/_c/FilmHero.tsx:33-37`.

### TrustBand — `_c/TrustBand.tsx`
Zero state, zero JS. `[...LOGOS, ...LOGOS]` (`:11`) duplicates the 13-logo array so `translateX(-50%)` loops seamlessly (`one-tap.css:898-910`). `direction: ltr` on `.marquee` (`one-tap.css:892`) prevents RTL from reversing the scroll. Hover pauses (`:906`); reduced motion kills it (`:1191`). Correct, textbook.

### TapToAction — `_c/TapToAction.tsx`
State: `mode: "film"|"still"`, `lit`, `beat` (`:21-23`).
- Effect 1 (`:25-35`): reduced-motion **or** ≤820px → `"still"`, pre-resolve `lit` and `beat`.
- Effect 2 (`:37-66`): `IntersectionObserver` at `threshold: 0.35` on the section. On enter: `setLit(true)`, `v.play().catch(()=>{})`, and — guarded by `beatTimers.length === 0` (`:49`) so it fires once ever — schedules three `setTimeout`s at 500/1400/2300 ms (`:52`). On exit: `v.pause()` (`:56`).
- The "activation" is the CSS reveal itself: `filter: brightness(.45) saturate(.85); transform: scale(1.015)` → `brightness(1) saturate(1); scale(1)` (`one-tap.css:416-431`). Honest — nobody asked a video model to fake a power-on.
- `preload="none"` (`:90`) + offscreen pause is genuinely good battery/data hygiene.

### FleetCards — `_c/FleetCards.tsx`
State: `active: CardKey` (default `"fleet"`), `step` (`:16-17`).
- Interaction: `onMouseEnter` + `onFocus` only (`:69-70`, `:95-96`, `:130-131`). **No `onMouseLeave`, no `onClick`, no keyboard activation.** Active card is sticky-latched until another is entered.
- Layout: interpolated `flex-grow: 1 → 2.3` with `transition-property: flex-grow, border-color` (`one-tap.css:483-488`) + a cyan hairline under the active card (`:490-501`). Contracted image card clamps its line to 2 and drops its chips so nothing clips (`:534-540`) — a real detail.
- `step` simulation (`:21-43`): `setInterval` 1600 ms driven by an `IntersectionObserver` at `threshold: 0.3`; reduced motion pins `step = 2` (`:24-27`). The cycle is `% 4` (`:33`) but CSS only styles `data-step` 1/2/3 (`one-tap.css:610-618`) — **step 0 leaves the whole list dimmed at `opacity: .45` for a full 1.6 s**, which reads as broken rather than as a reset beat.
- `const CARDS` (`:12`) exists only to derive `CardKey`; the runtime array is never read.

### ControlRoom — `_c/ControlRoom.tsx`
State: `state: 1|2|3`, `on` (`:32-33`).
- Scroll-driven, not IO-driven (`:35-64`): `getBoundingClientRect()` inside `requestAnimationFrame`, progress `p = -r.top / (r.height - vh)` thresholded at 0.34 / 0.67 (`:51-52`). Reduced motion pins `state = 3` (`:38-41`). Guard for `total <= 0` (`:50`) covers the mobile `height: auto` override.
- The section is `height: 240vh` with a `position: sticky; top: 0; height: 100svh` inner (`one-tap.css:682-690`). Mobile and reduced-motion both collapse it to a static panel (`:1153-1159`, `:1194-1197`).
- State→CSS: s1 shows the toast (`:859`), s2 raises the bars to `var(--h)` and glows the fleet KPI (`:861-863`), s3 glows all KPIs (`:864`).
- Content is entirely DOM-built — no faked dashboard screenshot (`:9-11` comment). Every simulated figure carries the «محاكاة مباشرة» pill (`:106-110`), and only `97` is presented as real (`:120`); the bar heights are explicitly annotated as illustrative (`:27`).

### MachineCards — `_c/MachineCards.tsx`
State: `active: string` (`:46`). Same hover/focus-only model as FleetCards (`:72-73`).
- Progressive disclosure via the `grid-template-rows: 0fr → 1fr` idiom (`one-tap.css:668-676`) — the correct way to animate auto-height. Title scales `1.05rem → clamp(1.2rem, 2.2vw, 1.7rem)` (`:659-667`).
- **Clever, probably-intentional accessibility save:** the inner `.tlink` (`:93`) stays in the tab order while its card is collapsed, but React's `onFocus` is `focusin` (bubbling), so tabbing to the hidden link fires `activate(c.key)` on the `<article>` and expands the card around the focus ring. It self-heals.
- Mobile disables all of it: `.mcard-more { grid-template-rows: 1fr; opacity: 1 }` and `flex-grow: 0 !important` (`one-tap.css:1146-1149`).

### StickyCTA — `_c/StickyCTA.tsx`
State: `on` (`:8`). Shows past 40% scroll (`:26`), suppressed by `rivalAdjacent()` (`:13-22`): a rival primary counts only if ≥50% visible **and** its midpoint sits below 45% of the viewport. Genuinely good product thinking — but see §5, it's a near-verbatim copy of `flow/_c/StickyCTA.tsx` with the explanatory comments deleted.

### page.tsx orchestration (`:24-106`)
Four separate imperative systems in one effect: `#prog` progress bar (`:26-39`), the reveal system (`:52-81`), a bottom-of-page `sweep` failsafe (`:76-81`), and the `.at-end` WhatsApp-yield observer (`:86-96`). Dual reveal observers — `ioMain` with `rootMargin: "0px 0px -12% 0px"` for breathing room, `ioTail` at `threshold: 0.01` for bottom-anchored elements the margin would make unreachable (`:69-75`). That trap is real and correctly solved.

---

## 4. Genuinely sophisticated vs conventional

### Preserve — this is the real work

1. **The pulse handoff** (`HeroFilm.tsx:43-50` + `one-tap.css:272-291`, `:358-364`). Video timeline event → DOM animation → staggered brand ignition. Rare, specific, on-brand, and cheap.
2. **The accent contract** (`one-tap.css:12-17`): `--cyan` is *system energy only* (pulse, status, LED, `#prog`) and **never on buttons**; `--warm` is *human action only* and never on data. Verified held throughout — the only warm things on the page are `.cta-warm` (`:173-192`) and `.tlink` (`:216-226`). This is the kind of rule most design systems declare and immediately break.
3. **`overflow-x: clip` not `hidden`** on `.onetap` (`one-tap.css:55`) with the reasoning documented in `globals.css:37-41`. `hidden` computes the unset axis to `auto`, silently creating a second vertical scroll container; `clip` doesn't — and it preserves `position: sticky` for `.ctrl-stick`. Correct, and rarely known.
4. **The `.foot` rise exemption** (`page.tsx:43-46`, `one-tap.css:1085-1088`): the last element's pre-reveal `translateY(12px)` extended the scroll area and resurrected a double scrollbar. Fading in place instead is exactly right.
5. **The `.cards-reveal` wrapper fix** (`page.tsx:46-51`, `FleetCards.tsx:60-62`, `MachineCards.tsx:62-64`): imperative `.in` classes cannot live on elements whose `className` React reconciles from VDOM. A correct diagnosis of a nasty bug, and the fix is minimal.
6. **Honest simulation labeling.** Every fabricated figure is pilled «محاكاة مباشرة» (`FleetCards.tsx:104`, `:139`; `ControlRoom.tsx:106-110`) and `ControlRoom.tsx:9-11` explicitly refuses to fake a dashboard screenshot. Unusual integrity for a pitch page.
7. **LED discipline** (`one-tap.css:154-162`): `direction: ltr; unicode-bidi: isolate` on machine-voice text, plus a hard rule that Plex Mono windows never contain Arabic. Correct bidi handling, not cargo-culted.
8. **RTL directional flips done by hand where logical properties can't reach** (`one-tap.css:374`, `:741`, `:748-753` with a separate `runner-rtl` keyframe). Most codebases ship the LTR-only version.
9. **`StickyCTA.rivalAdjacent()`** (`:13-22`) — the adjacency-not-presence distinction.
10. **The double-rAF replay reset** (`HeroFilm.tsx:56-58`).

### Conventional / weak

1. **The card interaction model is thin.** Hover/focus-only expansion with `cursor: default` (`one-tap.css:482`) is a 2019 pattern. Both card acts use the identical mechanic back-to-back (`FleetCards`, `MachineCards`), so Act V is structurally a re-run of Act III with different photography. `role="listitem"` + `tabIndex={0}` + no click handler is not an interaction model, it's a hover effect with a tab stop.
2. **`.act.proof`** (`page.tsx:128-140`) is a plain 4-up stat grid with staggered delays — the most generic block on the page, and it has no heading at all.
3. **TrustBand** is a stock hover-pause marquee.
4. **The 240vh sticky scroll-tell** (`ControlRoom`) is a well-executed instance of a very common pattern, and it costs the user ~1.4 extra viewports of scrolling with **zero focusable content** — keyboard users tab straight past the section that carries the core product argument.
5. **The footer** is boilerplate.
6. **`.scrim` does nothing.** `one-tap.css:71-77` paints a fixed top/bottom vignette at `z-index: 1`, but every content container — `.act` (`:237`) and `.foot` (`:977`) — sits at `z-index: 2`, and the hero's poster/video are absolute children of `.hero` (also `z-index: 2`). The scrim is painted **below all page content** and only tints the `.onetap::before` ambient gradient. It is an ornament with no visible effect.
7. **`StickyCTA` is a copy, not a design.** Diffed against `flow/_c/StickyCTA.tsx`: `rivalAdjacent` is identical line-for-line including the `0.5` and `0.45` constants; only the `RIVALS` selector was trimmed and the WhatsApp ghost link removed. The three comment blocks that explained *why* (adjacency vs presence, query-at-check-time) were deleted in the copy — and one of them mattered: flow queried at check time because `DropSequence` injected `.drop-m-cta` late. In one-tap, `.close .cta-warm` is statically rendered, so the per-frame `querySelectorAll` (`StickyCTA.tsx:15`) is now pure waste with no surviving justification.

---

## 5. Accessibility handling

### Handled well
- **Reduced motion is a designed experience, not a kill switch.** Four independent branches: `HeroFilm.tsx:31-36` (no video fetch at all, echo pre-resolved), `TapToAction.tsx:26-34` (poster still, beats pre-lit), `FleetCards.tsx:24-27` (`step = 2`), `ControlRoom.tsx:38-41` (`state = 3`, sticky collapsed). Plus a 21-line CSS block (`one-tap.css:1184-1199`) that flattens the marquee, the runner, the reveals, and the 240vh section.
- Single `<h1>` (`HeroFilm.tsx:136`); heading order h1 → h2 → h3 is valid throughout.
- Replay is a `<button>` (`HeroFilm.tsx:151`), not a div.
- `:focus-visible` ring covers `[tabindex="0"]` cards (`one-tap.css:227-231`).
- Decorative media consistently `alt="" aria-hidden="true"`: hero poster (`HeroFilm.tsx:89`), close terminal (`page.tsx:167-171`), card imagery (`FleetCards.tsx:74`, `MachineCards.tsx:76`).
- No autoplay audio; all videos `muted`.
- Bidi isolation on numeric/Latin content (`one-tap.css:156-162`); `.ar-t { letter-spacing: normal }` (`:165`) because Latin tracking severs Arabic cursive joining.

### Real defects

1. **Every `aria-label` on the page is English while `<html lang="ar">`** (`app/layout.tsx:73`). Nineteen instances: `"One tap"` (`HeroFilm.tsx:86`), `"Tap to action"` (`TapToAction.tsx:69`), `"One network"` (`FleetCards.tsx:48`), `"The control room"` (`ControlRoom.tsx:71`), `"Built for real machines"` (`MachineCards.tsx:50`), `"Proof"` (`page.tsx:128`), `"Book a live demo"` (`page.tsx:144`), `"Footer"` (`page.tsx:179`), `"Sections"` (`page.tsx:192`), `"Toggle language"` (`HeroFilm.tsx:119`, `page.tsx:209`), `"Fleet overview"` / `"A payment, live — simulation"` / `"Fleet health"` (`FleetCards.tsx:71,97,132`). An Arabic screen reader will pronounce all of them with Arabic phonetics. None of them are wired to the `.ar-t`/`.en-t` switch the rest of the page uses religiously.

2. **Eight landmark regions.** Every `<section>` carries an `aria-label`, which promotes all of them to `role="region"`. A screen-reader user navigating by landmark gets eight English-named regions on an Arabic page — landmark spam.

3. **`.cta-warm` visibly deforms on keyboard focus.** `one-tap.css:227-231` sets `border-radius: 8px` inside the `:focus-visible` rule. Specificity: `.onetap :is(a,button,[tabindex="0"]):focus-visible` = (0,3,0), beating `.onetap .cta-warm` (0,2,0) at `:179` and `.onetap .cards-row > article` (0,2,1) at `:478`. There is no later override — grep confirms `:227` is the only focus rule in the file. **Result: tabbing to any primary CTA turns the 999px pill into an 8px rounded rectangle, and the universal 400 ms transition (`:92-97`) animates the morph.** The cards do the same, 18px → 8px. The `border-radius: 8px` was clearly meant to shape the outline on unstyled elements; it clobbers everything else.

4. **Marquee logos are announced twice.** `TrustBand.tsx:11` duplicates the array for the seamless loop and `:30` gives every copy a real `alt={l.alt}`. Screen readers get all 13 partner names, then all 13 again. The duplicated half needs `aria-hidden="true"`.

5. **`aria-label` on generic elements is ignored.** `page.tsx:182` `<span className="brand" aria-label="R.Pay">` and `HeroFilm.tsx:161` `<div className="pays" aria-label="Payment methods">`. ARIA prohibits naming `role="generic"`; the footer brand's accessible name degrades to "Pay". (The hero's version at `HeroFilm.tsx:113` is on an `<a>` and is correct.)

6. **`aria-label=""` on the video** (`TapToAction.tsx:91`). An empty `aria-label` is treated as absent — it hides nothing. Should be `aria-hidden="true"`.

7. **`role="img"` on `.ctrl-shell`** (`ControlRoom.tsx:98`) collapses the entire dashboard — 12,408 sales, 97/97 online, 0 alerts, the branch bars, the geofence line — into one English string. Defensible for a decorative simulation, but it means the act carrying the core product argument is completely opaque to AT, and the KPI values are unreachable.

8. **Dead control under reduced motion.** "شاهد عملية الدفع" (`HeroFilm.tsx:151`) with reduced motion on: `src` is `null` so `videoRef.current` is `null`, `replay` takes the `:61-66` branch and just re-sets `echo` — but `one-tap.css:1185` sets `.echo i { display: none }`. The button is fully enabled, fully focusable, and does **literally nothing observable**.

9. `figcaption.beats aria-hidden="true"` (`TapToAction.tsx:97`) hides "Tap / Authorized / In action" — the act's actual semantic payload — from AT.

10. Mobile carousel `overflow-y: hidden` (`one-tap.css:1132`) will clip the top/bottom of the `outline-offset: 3px` focus ring on card focus.

11. Footer nav has 5 links but only 4 in-page anchors; `id="action"` (`TapToAction.tsx:69`) is never linked (`page.tsx:193-197`).

---

## 6. Code smells, hacks, fragility

**Structural / architectural**

1. **`.onetap * { transition-duration: 400ms }`** (`one-tap.css:92-97`) is the single biggest global hazard. `transition-property` defaults to `all`, so this is effectively `transition: all 400ms` on **every element and pseudo-element on the page**. The evidence is in the stylesheet itself: ten separate rules exist purely to claw the property list back — `:358`, `:483`, `:541`, `:665`, `:672`, `:791`, `:826`, `:849`, `:1027`, `:1038`. It's an elegant idea implemented as a footgun, and it's what turns the `border-radius: 8px` focus bug from a snap into a visible 400 ms morph.
2. **The "one motion law" is violated twice by its own file.** The header declares 400 ms as a HARD RULE (`one-tap.css:22`), then ships 900 ms (`:430`) and 700 ms (`:827`).
3. **Four independent scroll listeners, each with its own rAF gate:** `page.tsx:38` (`#prog`), `page.tsx:81` (`sweep`), `ControlRoom.tsx:58`, `StickyCTA.tsx:32`. Three of them force layout every frame — `document.documentElement.scrollHeight` (`page.tsx:31`, `page.tsx:77`, `StickyCTA.tsx:25`), `getBoundingClientRect` (`ControlRoom.tsx:46`, and a `querySelectorAll` + rect loop at `StickyCTA.tsx:15-20`). No shared scroll manager.
4. **`StickyCTA` runs on desktop for nothing.** `.sticky-cta` is `display: none` above 820px (`one-tap.css:1068`, unset at `:1125`), but the component always mounts its listeners (`StickyCTA.tsx:10-38`) and does per-frame DOM queries for an element that can never be seen.
5. **Cross-component coupling through global DOM ids.** `#prog` is rendered by `layout.tsx:30` and driven by `document.getElementById` in `page.tsx:26`, guarded by a silent `if (!bar) return` (`:30`). The reveal system reaches into every child's DOM by selector from a page-level effect (`page.tsx:53-58`). It works, but any child that starts putting a state-driven class on a reveal target reintroduces the disappearing-card bug — which `page.tsx:46-51` documents as having already happened once.

**Dead code, stale comments, false claims**

6. **`.settled` is dead.** `HeroFilm.tsx:86` toggles it; grep confirms **zero** matching rules in `one-tap.css`.
7. **`.brands` / `.brands .lbl`** (`one-tap.css:883-884`) — orphan CSS, no TSX uses either class. Ported from another concept.
8. **`page.tsx:12` is false.** It claims `STATS` is *"byte-identical to `flow/_c/Network.tsx`"*. It isn't: flow uses `{ v: 465255 }` (numbers, formatted at runtime via `toLocaleString`), one-tap uses `{ v: "465,255+" }` (pre-formatted strings with a `+` flow never renders). Values agree; shape and output do not.
9. `mainRef` (`page.tsx:22`, `:116`) is created and attached, never read.
10. `const CARDS` (`FleetCards.tsx:12`) is only used as a type source; the runtime array is unreferenced.
11. `Math.min(i % 4, 3)` (`page.tsx:61`) — `i % 4` is already ≤ 3. No-op.
12. `page.tsx:20` "Six acts" vs eight sections; `HeroFilm.tsx:123,146` "CTA 1/2 of 5" vs six actual `#demo` links.
13. **`layout.tsx:21-23` contradicts itself.** It self-hosts Readex Pro and Plex Mono because *"next/font's Google fetch is documented flaky at build time in this repo"* — but `--fb` (the **body** font) is `var(--font-plex)` (`one-tap.css:41`), which is `IBM_Plex_Sans_Arabic` loaded via **next/font from Google** (`app/layout.tsx:11-16`). If the stated flakiness is real, all Arabic body copy falls back to bare `sans-serif`.

**Duplication**

14. `toggleLang` is duplicated verbatim across `page.tsx:108-113`, `HeroFilm.tsx:78-83`, and `flow/_c/FilmHero.tsx:33-37`. It also does not persist — the language resets to Arabic on every route change, and it manually fights the server-rendered `lang="ar" dir="rtl"` from `app/layout.tsx:73`.
15. Eight hand-written `<img>` with individual `eslint-disable-next-line @next/next/no-img-element` comments (`page.tsx:166,183`; `HeroFilm.tsx:88,114`; `TrustBand.tsx:29`; `FleetCards.tsx:73`; `MachineCards.tsx:75`; `TapToAction.tsx:94`). No `srcset`/`sizes` anywhere — `network-hall.webp` is declared 2400×1018 (`FleetCards.tsx:74`) into a ≤700px slot. File sizes are small enough that it's a minor cost, but the escape hatch is repeated eight times rather than solved once.

**Layout / unit inconsistency**

16. **`min-height: 100vh` on `.onetap`** (`one-tap.css:54`) while `.hero` (`:245`) and `.ctrl-stick` (`:686`) use `100svh`, and `.control` uses `240vh` (`:682`). On mobile `100vh` exceeds the visible viewport — precisely the family of bug that `globals.css:37-41` and `one-tap.css:24-27` spend paragraphs defending against. Mixing the units on one page undercuts the scroll contract.
17. `.cards-reveal` (`FleetCards.tsx:62`, `MachineCards.tsx:64`) has **no CSS at all** — it exists solely as a class-stable host for the reveal system, and both files left the child `<div>` un-reindented with an orphan closing `</div>` (`FleetCards.tsx:156-157`, `MachineCards.tsx:101-102`), visibly marking it as a bolt-on patch.

**Magic numbers with no stated basis**

18. `PULSE_AT = 3.2` (`HeroFilm.tsx:13`); echo origin `68%/55%` and `50%/74%` (`one-tap.css:275-276`, `:1122`); `sweep`'s 4px tolerance (`page.tsx:77`); `rivalAdjacent`'s `0.5` and `0.45` (`StickyCTA.tsx:19`); `-12%` rootMargin (`page.tsx:71`); walkthrough thresholds `0.34 / 0.67` (`ControlRoom.tsx:52`); IO thresholds `0.35 / 0.3 / 0.05 / 0.01` across four files.

**Metadata**

19. `layout.tsx:9-11` declares `openGraph: { images: [...] }` only. Next.js does not deep-merge `openGraph` across segments, so this **replaces** the root's `openGraph` block (`app/layout.tsx:35-52`) — losing `type`, `locale`, `alternateLocale`, `siteName`, and `url`. The root `twitter` card (`app/layout.tsx:53-58`) is also inherited with no image. And the OG image has no declared width/height/alt.

---

## Bottom line

The hero's video→DOM pulse handoff, the cyan/warm accent contract, the `overflow: clip` scroll discipline, the reveal-system bug diagnosis, and the refusal to fake a dashboard are real craft and should survive any rewrite. The two card acts are the same hover trick run twice and are the obvious place to cut. The three defects I would fix before anyone sees this: the `border-radius: 8px` in the `:focus-visible` rule (`one-tap.css:230`) which deforms every pill CTA on keyboard focus, the missing initial-autoplay `.catch()` in `HeroFilm` which can leave the page's signature moment permanently unfired, and the nineteen English `aria-label`s on an `lang="ar"` document.

===== MOTION =====
I have a complete picture. Here is the inventory.

---

# R.Pay — Motion, Animation & Interaction Inventory

**Scope:** `app/` (8 concept routes + hub) and `components/` (8 shared). ~1,300 LOC of TSX plus 10 stylesheets. No animation library is installed — `package.json:15` lists only `next`, `react`, `react-dom`, `three@0.149.0`. Everything is hand-rolled CSS, rAF, IntersectionObserver, and one WebGL shader.

## 1. Route map & what drives each

| # | Route | Signature motion | Mechanism |
|---|---|---|---|
| — | `/` (hub) | Card hover lift/zoom only | Pure CSS transitions (`app/hub.css:79-89`) |
| 01 | `/concepts/latest` | Animated SVG/CSS hero scene | 22 `@keyframes` + SMIL + rAF parallax |
| 02 | `/concepts/video-hero` | Full-bleed autoplay hero video | `<video>` + 17 `@keyframes` |
| 03 | `/concepts/machine` | 620vh video-scrub | rAF scroll → `video.currentTime` |
| 04 | `/concepts/pulse` | Timed tap-to-pay state machine | `setTimeout` phase chain + 16 `@keyframes` |
| 05 | `/concepts/cinema` | Horizontal reel, wheel-hijacked | `scroll`/`wheel`/`pointer` handlers |
| 06 | `/concepts/coming-soon` | One pulsing ring | 1 `@keyframes` |
| 07 | `/concepts/flow` | 500vh pinned canvas frame-sequence | rAF scroll → `ctx.drawImage` of 72 ImageBitmaps |
| 08 | `/concepts/one-tap` | Sticky 240vh dashboard walkthrough | `position:sticky` + rAF scroll → React state |

---

## 2. Every distinct animation technique

### 2.1 CSS `@keyframes` — 81 total across 10 stylesheets

Counts: `latest.css` 22, `video-hero.css` 17, `machine.css` 16, `pulse.css` 16, `one-tap.css` 4, `flow.css` 3, `cinema.css` 2, `coming-soon.css` 1, `hub.css` 0, `globals.css` 0.

**Critical duplication finding:** `latest.css`, `machine.css` and `video-hero.css` are near-identical forks. `machine.css`'s 16 keyframe names (`pulse`, `floaty`, `breathe`, `hprog`, `tap`, `tapR`, `okpop`, `spin`, `refpulse`, `grow`, `sweep`, `fencepulse`, `devmove`, `ralert`, `marq`, `waPulse`) are a strict subset of `latest.css`'s; `video-hero.css` = those 16 + `scr`. Compare `latest.css:434-441` vs `machine.css:291-298` vs `video-hero.css:315-322` — byte-identical `@keyframes devmove`. This is copy-paste, not a shared system.

Notable individual pieces:

- **Marquee (4 forks of one idea):** `latest.css:593` `marq`, `machine.css:411`, `video-hero.css:435`, `flow.css:514` `flowmarq`, `pulse.css:244-245` `plmarq`/`plmarq-r`, `one-tap.css:907` `onetap-marquee`. All translate a doubled logo row `-50%`; the doubling is done in JS at `components/BrandsMarquee.tsx:5` (`[...LOGOS, ...LOGOS]`) and `one-tap/_c/TrustBand.tsx:11`. Only `pulse.css:243` has a distinct RTL keyframe.
- **Radar scene (geofence):** `latest.css:427-448` — conic-gradient `sweep` (4.5s infinite), `fencepulse` (8s), `devmove` (8s), `ralert` (8s). Reimplemented independently in `pulse.css:350-386` as `sweepSpin`/`fenceState`/`devPath`/`alertState` on a 9s clock with a documented beat sync ("detection happens at ~56% (5.04s) when the beam angle crosses the escaped dot", `pulse.css:355`).
- **SVG line-draw:** `stroke-dashoffset` animations — `latest.css:346` `hprog` (step progress ring), `:236` `hvspark` (sparkline), `:182` `hvdash` (traveling dash on network lines), `pulse.css:258` `ecgDraw` (2600-unit ECG trace).
- **Echo ring:** `one-tap.css:287-291` `echo-ring` scales a 12px circle to `scale(90)` over 1.6s — the film-to-DOM handoff.
- **Runner sweep:** `one-tap.css:743-753`, with a separate `runner-rtl` keyframe (`:749`) selected by `html[dir="rtl"]` (`:748`).
- **Hero breathe:** `flow.css:807-808` — `rp-breathe` scales the hero `<video>` 1→1.012 over 7s "so the still never looks frozen."

### 2.2 CSS transitions — two philosophies

**Concepts 07 & 08 declare a universal "motion law":**
```css
/* app/concepts/flow/flow.css:783-789 */
.flow *, .flow *::before, .flow *::after {
  transition-duration: 400ms;
  transition-timing-function: cubic-bezier(.22, 1, .36, 1);
}
```
Identical block at `app/concepts/one-tap/one-tap.css:91-97`. Note: `transition-property` is left at its initial value `all`, so **every** property change on **every** descendant transitions. See §6 for the consequence.

**Concepts 01–05** instead scatter per-rule `transition:` shorthands — 53 in `latest.css`, 48 in `video-hero.css`, 44 in `machine.css`, 30 in `pulse.css`, 11 in `cinema.css`, 6 in `hub.css`.

**Staggering** is done three incompatible ways:
- CSS utility classes: `.rv.d1{transition-delay:.07s}` … `.d5` (`latest.css:630-634`, dup'd in `machine.css:448-452`, `video-hero.css:472-476`)
- JS-written inline delays: `flow/page.tsx:43` and `one-tap/page.tsx:61` — `el.style.transitionDelay = \`${Math.min(i % 4, 3) * 60}ms\``
- React inline style props: `one-tap/page.tsx:131` (`${i * 70}ms`), `flow/_c/Network.tsx:69` (`${i * 70}ms`), `one-tap/_c/ControlRoom.tsx:150` (`${i * 45}ms`), `components/Menu.tsx:66` (`${0.06 + i * 0.05}s`)

### 2.3 SVG SMIL — one place only

`components/HeroVisual.tsx:86-109` — four `<circle>` payment pulses driven by `<animateMotion>` + `<mpath>` along four bezier paths. `xlinkHref` is kept alongside `href` (`:91`) for older WebKit. SMIL ignores CSS `animation-play-state`, so `HeroVisual.tsx:29` calls `svg.pauseAnimations()` / `unpauseAnimations()` from the IntersectionObserver, wrapped in try/catch for engines lacking the API (`:30`).

### 2.4 rAF-driven JS animation (non-scroll)

- **Count-up numbers, 4 independent implementations of the same easing** (`1 - (1-k)^4`):
  `latest/page.tsx:63-76` (1400ms), `machine/page.tsx:55-68` (1400ms), `video-hero/page.tsx:62-75` (1400ms), `pulse/page.tsx:210-223` (1400ms), `cinema/page.tsx:86-96` (1300ms). A fifth variant in `flow/_c/Network.tsx:43-48` uses `1 - (1-k)^3` at 400ms.
- **Pointer parallax:** `components/HeroVisual.tsx:38-63` — lerps `--px`/`--py` CSS vars at 0.08/frame, self-terminating when the delta drops below 0.002 (`:56`). Layers read depth via `--dp` (`latest.css:151-157`).
- **Double-rAF class reset:** `one-tap/_c/HeroFilm.tsx:57-58` — nested `requestAnimationFrame` so echo classes actually clear before re-adding on replay.
- **Preloader:** `flow/_c/Preload.tsx:18` single rAF to arm the fade-in; hard 800ms cap via `Promise.race` (`:28-29`).

### 2.5 Timer-driven state machines (no rAF)

- **`pulse/page.tsx:168-182`** — the tap simulator. `setPhase("tap")` → `ok` @950ms → `fly` @1800ms → `land` @2550ms → `idle` @3250ms, with a `busy` re-entrancy guard (`:169`). Auto-fires every 5600ms while the hero is intersecting (`:194-196`), plus a verb rotator at 2800ms (`:200`) and a feed rotator at 3400ms (`:205`). All are `document.hidden`-gated.
- **`components/HowItWorks.tsx:48`** — 4500ms `setInterval` step carousel, started/stopped by IntersectionObserver (`:57-58`).
- **`one-tap/_c/FleetCards.tsx:33`** — 1600ms `setInterval` payment-step simulation, created/destroyed on intersect.
- **`one-tap/_c/TapToAction.tsx:52`** — one-shot `setTimeout` chain `500 + i * 900` for three beat chips.

### 2.6 WebGL (three.js) — §4 below

### 2.7 2D Canvas frame-sequence — §3 below

### 2.8 Pointer-driven interaction

- **Custom cursor glow:** `latest/page.tsx:161`, `video-hero/page.tsx:145` — `transform: translate()` on a fixed 22px radial-gradient div (`latest.css:706-710`).
- **Card spotlight:** writes `--mx`/`--my` per card under the cursor. **Two implementations:** `latest/page.tsx:147-165` is rAF-throttled with a one-time `querySelectorAll` and an explicit comment that per-event re-querying "was the most expensive per-event work on the page" (`:144-146`). `machine/page.tsx:137-155` and `video-hero/page.tsx:139-155` still run the **unfixed** version — re-query + `getBoundingClientRect()` on every raw `pointermove`.
- **Magnetic buttons:** `latest/page.tsx:168-180`, `video-hero/page.tsx:161-173` — `mousemove` writes `transform: translate()` at 0.25×/0.4× offset. Guarded by `fine && !reduced`.
- **3D tilt:** `pulse/page.tsx:238-262` writes `--rx`/`--ry`/`--mx`/`--my`/`--tz` on `.tpanel` (±6.5deg). `machine/page.tsx:149-153` and `video-hero` tilt `#tilt` at ±10deg/±7deg.
- **Flex-interpolated card expansion:** `one-tap/_c/FleetCards.tsx:69-70` and `MachineCards.tsx:73-74` — `onMouseEnter`/`onFocus` set React state, CSS flex-basis transitions. Keyboard-reachable via `tabIndex={0}`.
- **Drag-to-scroll reel:** `cinema/page.tsx:129-143`.

---

## 3. Scroll-driven effects — exact mechanisms

**There is no CSS `scroll-timeline` / `view-timeline` / `animation-timeline` anywhere in the repo.** Verified by grep across `app/` and `components/`. Everything is JS.

### 3.1 The three mechanisms in use

**(a) IntersectionObserver — 21 instances across 14 files.** Used for reveals, count-up triggers, scroll-spy, play/pause gating.

**(b) `window` scroll listener + rAF throttle — 15 listeners.** The canonical pattern:
```js
// app/concepts/flow/page.tsx:22-26
const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(draw); } };
window.addEventListener("scroll", onScroll, { passive: true });
```
Every scroll listener in the repo is `{ passive: true }` **except one** (`cinema/page.tsx:127`, `passive: false` — see §6).

**(c) `position: sticky` — exactly one use,** `one-tap.css:683-690` (`.ctrl-stick` inside a 240vh `.control`, `:682`).

### 3.2 Scroll-pinning — hand-rolled, not sticky

`components/VendingScroll.tsx:26-38` and `flow/_c/DropSequence.tsx:128-141` implement **identical** manual pinning by imperatively flipping `position` between `absolute`/`fixed` based on `getBoundingClientRect()`:
```js
if (rect.top <= 0 && rect.bottom >= vh) setPin("fixed");
else if (rect.bottom < vh) setPin("bottom");
else setPin("top");
```
`DropSequence.tsx:127` explicitly documents this as "(VendingScroll pattern)". Both compute progress as `p = -rect.top / (rect.height - vh)`, clamped 0–1.

### 3.3 Concept 03 — video-scrub (`components/VendingScroll.tsx`)

620vh section (`machine.css:416`). Scroll progress maps to `video.currentTime`:
```js
// VendingScroll.tsx:53-59
const t = p * (dur - 0.05);
if (Math.abs(t - lastT) > 0.02) { lastT = t; video.currentTime = t; }
```
Video is `muted playsInline preload="auto"` with **no `poster`** and **no `autoplay`** (`:81-88`); `video.pause()` is called defensively at `:23`. Duration is read from both `loadedmetadata` and `loadeddata` (`:21-22`). Overlay opacity is driven linearly over `p ∈ [0.14, 0.26]` (`:61-62`). Dynamically imported with `ssr:false` (`machine/page.tsx:11-13`).

### 3.4 Concept 07 — canvas frame-sequence (the signature)

`flow/_c/DropSequence.tsx`. 72 WebP frames, 1.4 MB total (~20 KB each), fetched as blobs → `createImageBitmap` with an `<img>`+`decode()` fallback (`:71-93`). Frame 0 loads first and releases the poster (`:87-89`), then 1–71 fire in parallel (`:95-97`).

Mapping is deliberately linear with a load-bearing comment (`:4-12`):
```js
currentFrame = Math.round(p * (N - 1));   // :158
```
because the frames are non-uniformly sampled (f001–063 at 15fps, f064–072 at 5fps). Draw is DPR-aware, capped at 2 (`:102`), manual `object-fit: cover` math (`:119`), and short-circuits when the frame is unchanged (`:113`). Beats/CTA only touch the DOM on state change (`:166-182`). Resize is debounced 150ms (`:188-192`). ImageBitmaps are `.close()`d on unmount (`:203`).

Three-way mode switch decided in `useLayoutEffect` **before paint** (`:36-39`): `static` (reduced motion), `mobile` (≤820px), `scrub`. Mobile never enters scrub, so "the 72-frame preload is structurally unreachable under 820px" (`:34-35`).

### 3.5 Concept 08 — sticky walkthrough

`one-tap/_c/ControlRoom.tsx:44-53` — same `getBoundingClientRect` progress math, but drives **React state** rather than DOM writes: `setState(p < 0.34 ? 1 : p < 0.67 ? 2 : 3)`. CSS keys off `.s1/.s2/.s3` on the section (`:68`).

### 3.6 Scroll reveals — two generations

**Gen 1 (concepts 01–05):** `.rv` class, observer adds `.in`, unobserves, and runs any `.num` count-ups inside (`latest/page.tsx:79-93`, `machine/page.tsx:71-85`, `video-hero/page.tsx:77-91`, `pulse/page.tsx:224-236`, `cinema/page.tsx:97-106`).

**Gen 2 (concepts 07–08):** `[data-rise]` attributes applied at runtime, with two documented traps solved:
1. `.reveals` is added by JS (`flow/page.tsx:32`, `one-tap/page.tsx:52`) so `[data-rise]` never hides content on a JS-less browser.
2. **Dual observers** (`flow/page.tsx:56-61`, `one-tap/page.tsx:71-75`): `ioMain` with `rootMargin: "0px 0px -12% 0px"`, plus `ioTail` at zero margin for bottom-anchored elements — because the shrunken root made the footer permanently unreachable.
3. **Belt-and-braces sweep** at document bottom (`flow/page.tsx:64-69`, `one-tap/page.tsx:76-81`).
4. `one-tap/page.tsx:44-51` documents the "disappearing cards" bug: reveal targets must not be elements whose `className` React rewrites, hence the static `.cards-reveal` wrapper (`FleetCards.tsx:62`, `MachineCards.tsx:64`).

### 3.7 Other scroll consumers

- **Progress hairline `#prog`:** `flow/page.tsx:19-20`, `one-tap/page.tsx:31-32` (rAF-throttled); `latest/page.tsx:100-103`, `machine/page.tsx:92-95`, `video-hero/page.tsx:100-103`, `pulse/page.tsx:269-272` (**not** rAF-throttled — direct style write in the scroll handler).
- **Nav shadow:** `nav.classList.toggle("sc", window.scrollY > 30)` — same four unthrottled handlers.
- **Scroll-spy:** `latest/page.tsx:117-128`, `machine/page.tsx:109-120`, `video-hero/page.tsx:115-126` — IntersectionObserver with `rootMargin: "-38% 0px -55% 0px"`.
- **Sticky CTA with rival-adjacency suppression:** `flow/_c/StickyCTA.tsx:25-39` and `one-tap/_c/StickyCTA.tsx:13-27` — appears past 40% scroll unless a rival primary CTA is ≥50% visible in the lower half of the viewport. rAF-throttled.
- **Horizontal reel progress:** `cinema/page.tsx:110-116` — listens on the element's own `scroll`, RTL-safe via `Math.abs(reel.scrollLeft)`.
- **Native scroll-snap:** `flow.css:637-657` (`scroll-snap-type: x mandatory`, disabled at `:652`), plus mobile snap carousels in `one-tap.css`.
- **`html{scroll-behavior:smooth}`** globally (`globals.css:36`).

---

## 4. Three.js — one file, three routes, dark mode only

`three@0.149.0` is used in **exactly one place**: `components/LiquidBackground.tsx`.

**What it does:** a fullscreen fragment-shader background — 5-octave FBM noise, three drifting gaussian blobs, a mouse-following highlight, a ribbon term, vignette, gamma (`:4-35`). Vertex shader is a one-liner passthrough (`:66`); geometry is a `PlaneGeometry(2,2)` (`:69`); camera is a bare `THREE.Camera` (`:58`). No scene graph, no lights, no models — this is a Shadertoy-style quad. `three` is arguably 600 KB of dependency for what a raw `WebGLRenderingContext` would do.

**Where it's mounted:**
- `app/concepts/latest/layout.tsx:15`
- `app/concepts/machine/layout.tsx:14`
- `app/concepts/video-hero/layout.tsx:14`

**Where it is deliberately absent, with reasons in code:**
- `app/concepts/flow/layout.tsx:13-15` — "NO `<LiquidBackground />` here (unlike concepts 01–06) — it is a running three.js canvas and would fight the 500vh Act II frame-sequence canvas for the main thread."
- `app/concepts/one-tap/layout.tsx:16-17` — same reasoning.
- Not on the hub, pulse, cinema, or coming-soon.

**How it's guarded:**
- Bails entirely under reduced motion (`:41-43`) — before the import.
- **Dynamically imported** (`:50`), so `three` is never in the initial bundle and never ships to concepts 04–08.
- Resolution scaled 0.5× under 820px, 0.72× above (`:55`); `setPixelRatio(1)` hard-coded (`:56`).
- Idle drift after 3s of no pointer (`:98-101`); lerped mouse at 0.05 (`:102-103`).
- Skips `renderer.render()` when `document.hidden` (`:104`).
- Canvas opacity fades to 0.65 over the first 0.85vh of scroll (`:86-89`).
- Full teardown: `cancelAnimationFrame`, listener removal, `renderer.dispose()` (`:116-121`).
- Every risky call is try/caught (`:53`, `:107`, `:120`).

**Gap:** the rAF loop itself never stops — `raf = requestAnimationFrame(loop)` runs unconditionally at `:109`. And `latest.css:690` / `video-hero.css:532` set `html.light #liquid { display: none }` — in light theme the WebGL context keeps rendering at 60fps into an invisible canvas. That's pure waste, and it's two of the three routes that mount it.

---

## 5. Video usage

Six `<video>` elements, five distinct strategies.

| File:line | Source | Autoplay | Loop | Poster | Preload | Mobile |
|---|---|---|---|---|---|---|
| `video-hero/page.tsx:223` | `/assets/hero-video.mp4` (**1.94 MB**) | ✅ | ✅ | `hero-poster.webp` | `auto` | same file |
| `components/VendingScroll.tsx:81` | `/assets/vending-video.mp4` (**4.05 MB**) | ❌ (scrubbed) | ❌ | **none** | `auto` | same file |
| `flow/_c/FilmHero.tsx:44` | `film-hero-{wide,tall}.mp4` (0.09/0.06 MB) | ✅ | ✅ | `film-poster{,-tall}.webp` | `auto` | **9:16 cut** |
| `one-tap/_c/HeroFilm.tsx:91` | `hero-{wide,tall}.mp4` (0.94/0.88 MB) | ✅ | ❌ (plays once) | `hero-poster{,-tall}.webp` | `auto` | **9:16 cut** |
| `one-tap/_c/TapToAction.tsx:83` | `arcade-live.mp4` (0.29 MB) | ❌ (IO-gated) | ✅ | `arcade-live-poster.webp` | **`none`** | **poster still** |
| `cinema/page.tsx:192` | **CloudFront CDN URL** | ✅ | ✅ | CDN PNG | `auto` | wide + crop shift |

All six are `muted playsInline` — correct for iOS autoplay.

**Sophistication ranking:**

**Best — `one-tap/_c/TapToAction.tsx`.** `preload="none"` so nothing downloads until needed; IntersectionObserver plays on enter and **pauses on exit** with the comment "never burn battery offscreen" (`:56`); mobile ≤820px and reduced motion both swap to a static `<img>` with explicit `width`/`height` (`:95`), skipping the fetch entirely (`:26-34`).

**Best-engineered — `one-tap/_c/HeroFilm.tsx`.** Separate `<img className="hero-poster">` paints before the video (`:89`), video fades in on `onCanPlay` (`:100`). Plays **once** and settles on its last frame — "no loop seam, no perpetual motion" (`:17-18`). `onTimeUpdate` fires a DOM echo ring at a measured `PULSE_AT = 3.2` (`:12`, `:43-50`). Full error path: `onError` resolves to the designed static state (`:103`). Reduced motion sets `src` to `null` so **no video is fetched at all** (`:31-36`). The `replay()` button handles autoplay refusal by restoring the resolved state (`:68-73`).

**Weakest — `cinema/page.tsx:192-202`.** The only remote media in the repo: a hardcoded Higgsfield CloudFront URL (`:17`, `:19-20`) with no fallback if the CDN 404s or the signed URL expires. `HERO_VIDEO_TALL` is the literal placeholder string `"__HERO_VIDEO_TALL__"` (`:18`), guarded by `ok()` (`:22`) — so mobile portrait gets the 16:9 file with an `objectPosition: "68% 50%"` crop shift (`:201`) instead of a real 9:16 cut. And under reduced motion the CSS only does `.cfilm { display: none }` (`cinema.css:308`) — **the video element still exists with `autoPlay preload="auto"`, so it downloads and plays behind a hidden box.**

**Weakest asset handling — `VendingScroll`.** 4.05 MB, `preload="auto"`, **no poster**, so the section is a flat `#0a1420` rectangle (`machine.css:418`) until enough of the video buffers. This is also the biggest media file in the repo and it is fetched on a concept that also runs three.js.

Media totals: `public/assets` is 55 MB; 8.25 MB of that is mp4. No raster image exceeds 300 KB.

---

## 6. `prefers-reduced-motion` coverage

Detected in 33 places (14 JS `matchMedia`, 19 CSS `@media`). Coverage per concept:

| Concept | Verdict | Detail |
|---|---|---|
| **07 flow** | **Complete** | Global kill switch `flow.css:91-99` zeroes all durations/iterations under `.flow`; targeted overrides at `:525`, `:810-814`. JS: `DropSequence.tsx:37` swaps to a `<StaticFall>` single-frame component (`:290-308`) in `useLayoutEffect`, **before paint** — no fetch, no canvas, no listeners. `Network.tsx:26,41` jumps counts to final. |
| **08 one-tap** | **Complete** | Global kill switch `one-tap.css:98-106`, plus 14 targeted rules at `:1184-1199` that *restructure* rather than just freeze — `.ctrl-stick` becomes `position: static`, `.control` collapses from 240vh to auto, bars jump to `var(--h)`, toast and echo hidden. JS: `HeroFilm.tsx:31-36` (no video fetch), `TapToAction.tsx:27` (poster still), `ControlRoom.tsx:38-41` (pins state 3), `FleetCards.tsx:24-26` (pins step 2). |
| **01 latest** | **Good** | `latest.css:568-576` blanket `animation:none!important;transition:none!important` plus SMIL/dashoffset resolution. `:627`, `:710`. JS: counters (`page.tsx:41,69`), magnetic buttons (`:169`), `HeroVisual.tsx:42`. |
| **02 video-hero** | **Partial** | `video-hero.css:417-421` is the same blanket, but **lacks** the SMIL/hero-visual clauses `latest.css` has (`.hv-pulses`, `.hv-sheen`, `.hv-ln`, `.hv-ok`, `.hv-spark`) — harmless here since `HeroVisual` isn't mounted, but it means the two files have silently diverged. **The hero `<video>` still autoplays and loops under reduced motion** — nothing stops it. |
| **03 machine** | **Partial → the worst gap** | `machine.css:393-397` covers CSS. But **`VendingScroll.tsx` contains zero reduced-motion handling** — no `matchMedia` anywhere in the file. The 620vh scrub, the pinning, the per-scroll `currentTime` writes and the 4 MB fetch all run regardless. The device tilt *is* guarded (`page.tsx:149`) but the card spotlight is not. |
| **04 pulse** | **Good** | `pulse.css:613-628` is *targeted* (16 selectors) rather than blanket. JS: `page.tsx:185` gates the tap simulator (`:171-176` short-circuit path), verb rotator (`:201`), tilt (`:239`), counters (`:214`). |
| **05 cinema** | **Partial** | `cinema.css:302-311` handles reveals, `scroll-behavior`, and hides `.cfilm` — but as noted the video still downloads and plays. JS reads `reduced.current` (`page.tsx:77`) **only** for counter duration (`:89`); the wheel-hijack (`:120-127`), drag-to-scroll (`:129-143`) and `scrollBy({behavior:"smooth"})` (`:162`) all remain active. |
| **06 coming-soon** | **Complete** | One animation, one override (`coming-soon.css:40`). |
| **Hub `/`** | **Missing — but trivially so** | `hub.css` has zero `prefers-reduced-motion` rules. Its motion is hover-only (`:79-89`: `transform: translateY(-8px)` @500ms, `scale(1.06)` @700ms on the thumb). Hover transforms are the mildest category, but a 700ms image zoom is exactly what the media query exists for. |

**Cross-cutting gap:** `components/BrandsMarquee.tsx` is imported by five routes. Its 42s infinite marquee is neutralised in `latest.css:627`, `machine.css:445`, `video-hero.css:469`, `pulse.css:619` and `one-tap.css:1191` — but each route had to remember to write `.mtrack{animation:none}` itself. There is no rule in `globals.css`. A sixth consumer would ship an unstoppable marquee.

**Also missing everywhere:** no `matchMedia(...).addEventListener("change", …)`. Every reduced-motion check is read once at mount. Toggling the OS setting mid-session has no effect until reload. (Contrast `cinema/page.tsx:83`, which *does* subscribe to the viewport-width media query — so the pattern was known and simply not applied to motion.)

---

## 7. Performance risks

### High

1. **`.flow *` / `.onetap *` transition with `transition-property: all`** (`flow.css:783-789`, `one-tap.css:91-97`). Declaring duration + timing on a universal selector without constraining `transition-property` means every property change on every descendant animates for 400ms. Concretely: `flow/page.tsx:20` writes `bar.style.width` on **every** rAF frame, and each write restarts a 400ms width transition on `#prog` (which is inside `.flow`, per `layout.tsx:25-27`). Same at `one-tap/page.tsx:32`. More visibly, `.flow .drop .traylight` declares `transition-property: opacity` (`flow.css:363`) while `DropSequence.tsx:174` rewrites its `opacity` every scroll frame — the tray glow lags the scrub by up to 400ms and can never converge during motion. Fix: add `transition-property: <explicit list>` to the law, or exclude `#prog`/`.traylight`.

2. **Unthrottled pointer handlers doing layout reads.** `machine/page.tsx:138-148` and `video-hero/page.tsx:143-152` call `document.querySelectorAll(".card,.sector,.mcard")` and then `getBoundingClientRect()` on every match, on every raw `pointermove` — forced synchronous layout at up to 1000 Hz on high-polling-rate mice. `latest/page.tsx:144-165` already fixed this (one-time query + rAF coalescing) and documents why; the fix was never backported.

3. **Video scrubbing at 620vh** (`VendingScroll.tsx:53-58` + `machine.css:416`). Setting `currentTime` from a scroll handler is the single most jank-prone technique here. Seeking a 4 MB H.264 file forces keyframe-relative decode; iOS Safari in particular serialises seeks and drops most of them. The 0.02s dedupe threshold (`:55`) helps but doesn't address decode cost. No reduced-motion escape and no mobile fallback — unlike `DropSequence`, which explicitly avoids this by decoding to ImageBitmaps up front and offering `MobileRail` (`:257-286`).

4. **Layout-animating keyframes running infinitely.** `pulse.css:366-378` `@keyframes devPath` animates `left`/`top` (not `transform`) across 9 stops on an infinite loop; `pulse.css:201-202` `flyDown` animates `top`; `pulse.css:472` `barFill` animates `width`; `cinema.css:217` `cbar` animates `width`. These trigger layout every frame, forever. `latest.css:434-441` `devmove` does the same thing correctly with `transform` — so the right technique exists in the codebase and pulse regressed from it.

### Medium

5. **Large blurred surfaces animating.** `pulse.css:485-488` — `.ctaorb .orb` is a 560×560 conic-gradient with `filter: blur(60px)` and `animation: orbSpin 14s linear infinite`. A 60px blur over a 560px box re-rasterises a large filter region continuously. `hub.css:26` blurs two ~50vw circles at 80px (static, so acceptable). `filter: blur()` appears 16–17 times each in `latest`/`video-hero`/`pulse`/`cinema`.

6. **`backdrop-filter` density.** 16 uses in `cinema.css`, 16 in `pulse.css`, 14 in `latest.css`, 13 in `video-hero.css`, 12 in `machine.css`, 6 in `hub.css`. Each is a separate backdrop-root readback. `one-tap.css` has **zero** — a deliberate and correct divergence.

7. **Concept 01 stacks a WebGL rAF loop against ~30 concurrent CSS animations.** `LiquidBackground` renders every frame while `HeroVisual`'s 22-keyframe scene plus four SMIL `animateMotion` circles run in the same viewport. `HeroVisual.tsx:20-36` mitigates it well (pauses CSS via `.hv-off` at `latest.css:174` and SMIL via `pauseAnimations()`), but only for the hero — the marquee, radar and step animations keep running below the fold with no visibility gating.

8. **Hidden-but-rendering WebGL.** `latest.css:690` / `video-hero.css:532` `html.light #liquid{display:none}`, but `LiquidBackground.tsx:109` keeps requesting frames and `:107` keeps calling `render()` (the only guard is `document.hidden`, `:104`). Light-theme users on two routes pay full GPU + main-thread cost for nothing.

9. **72 parallel `fetch()` calls.** `DropSequence.tsx:96` fires frames 1–71 in a single unthrottled loop. Only 1.4 MB total, but on HTTP/1.1 it saturates the connection pool and competes with the hero video and fonts. A small concurrency window would be strictly better.

### Low / notable

10. **`cinema/page.tsx:120-127` is a scroll trap.** The `wheel` handler is `passive: false` and calls `preventDefault()` whenever `deltaY > deltaX` and the reel overflows — with **no check for whether the reel has reached its scroll extent**. Once the pointer is over the reel, vertical wheel scrolling is consumed permanently; the user cannot wheel past the section. `passive: false` also disables the compositor fast path for that element. This is a functional bug, not just a perf smell.

11. **`will-change: transform` left permanently on** `.vhold` (`latest.css:599`, `machine.css:417`, `video-hero.css:441`), `.cursor` (`latest.css:708`), `.dtilt` (`machine.css:105`, `video-hero.css:129`), `pulse.css:286` — 8 sites that hold GPU layers for the page lifetime. Modest, but `.vhold` is a fullscreen video container.

12. **Dead CSS.** `.vending`/`.vhold`/`.vvideo` rules exist in `latest.css:598-608` and `video-hero.css:440-450`, but neither route imports `VendingScroll` — only `machine/page.tsx:11` does. ~30 lines of dead selectors on two routes.

13. **Five `setInterval(…, 30000)` clock tickers** (`Menu.tsx:27`, `latest/page.tsx:60`, `machine/page.tsx:52`, `video-hero/page.tsx:59`, `pulse/page.tsx:291`) that run whether or not the footer is visible. Negligible cost; noted for completeness of the inventory.

---

## 8. Honest assessment: cohesive or ad hoc?

**Ad hoc per page — with two pages that are genuinely systematic, and a clear chronological fault line between them.**

**The evidence for ad hoc:**

The same effect is implemented independently 4–5 times. Count-up easing: `1-(1-k)^4` at 1400ms in four files, 1300ms in a fifth, `1-(1-k)^3` at 400ms in a sixth. Marquee: six keyframe definitions of one 42s translate. Geofence radar: two unrelated implementations on 8s and 9s clocks. Card spotlight: one rAF-optimised version and two unoptimised copies of what was originally the same code. `latest.css`/`machine.css`/`video-hero.css` are ~90% duplicate stylesheets whose reduced-motion blocks have already silently drifted apart.

There is no shared motion token anywhere. `globals.css` contains **one** transition (`:43`, a theme-swap) and **zero** keyframes, zero easing variables, zero duration variables. Every concept invents its own curve: `cubic-bezier(.16,1,.3,1)` (hub), `cubic-bezier(.22,1,.36,1)` (flow/one-tap), `cubic-bezier(.34,1.56,.64,1)` (pulse), `cubic-bezier(.4,0,.2,1)` (pulse again), `cubic-bezier(.45,.05,.55,.95)` (pulse radar), plus bare `ease`/`ease-in-out`/`linear` throughout 01–05. Durations range from `.2s` to `9s` with no visible ladder.

Even the naming is unsystematic — `.rv` (concepts 01–05) vs `[data-rise]` (07–08) for the identical reveal behaviour, with different stagger mechanisms and different observer configurations.

**The evidence for cohesion — and it's real, but local:**

Concepts 07 and 08 are a designed motion system. They declare one duration and one curve page-wide (`flow.css:783-789`), one reveal law (400ms / 12px / same easing), one CTA vocabulary counted in comments ("CTA 2 of 4", "CTA 1 of 5"), and a reduced-motion contract that restructures layout rather than merely freezing it. `one-tap/layout.tsx:14-25` and `flow/layout.tsx:11-22` explicitly justify *omitting* `LiquidBackground` on main-thread-contention grounds — a system-level decision, not a page-level one. Concept 08 reuses concept 07's `StickyCTA`, dual-observer reveal, `#prog` hairline and pinning idiom by name, calling them "flow precedent" (`one-tap/_c/StickyCTA.tsx:4-6`, `one-tap/page.tsx:70`).

The codebase is also unusually self-aware about its own failures. Roughly two dozen comments document bugs already fixed and traps still live: the double-scrollbar cause (`globals.css:37-41`), the footer-never-reveals trap (`flow/page.tsx:52-55`), the disappearing-cards React/imperative-class conflict (`one-tap/page.tsx:44-51`), the SMIL-ignores-CSS-play-state issue (`HeroVisual.tsx:17-19`), the "DO NOT FIX" non-uniform frame sampling (`DropSequence.tsx:5-12`), and the deliberate rejection of a mobile snap rail on craft grounds (`DropSequence.tsx:252-256`). That is engineering discipline. It is just discipline applied *within* each concept rather than across them.

**Conclusion.** This reads as an exploratory concept gallery, not a product with a motion language — which is arguably the correct shape for what it is (`app/page.tsx:186-187` describes each concept as "a complete standalone experience"). The trajectory is unmistakable: 01→05 are variations on a copy-pasted template that accumulated per-page hacks; 07→08 are a deliberate reset built on stated laws, with 08 explicitly inheriting from 07. Concept 06 is a placeholder.

If one direction is chosen for production, **07/08 is the only one with a motion system worth extending**, and the highest-leverage work is: (a) lift the motion law into `globals.css` as tokens (`--dur`, `--ease`, one reveal rule, one marquee) with `transition-property` explicitly constrained; (b) delete the 01/02/03 stylesheet triplication; (c) give `VendingScroll` a reduced-motion and mobile path, or retire it in favour of the `DropSequence` frame-sequence approach, which solves the same problem without touching `video.currentTime`; (d) fix the `cinema` wheel trap and its reduced-motion video download.

===== ASSETS =====
# R.Pay Visual Asset Inventory — `C:/Users/CCBoot/Documents/projects/r.pay`

## 1. The loading architecture (`lib/assets/*.ts`)

Six modules, **1,331 bytes total**. They are pure path constants — no imports, no data URIs. Per `ASSET_EXTRACTION_REPORT.md` this is post-refactor from ~8.7 MB of inlined base64 (First Load JS went 2.37 MB → 98.3 kB).

| File | Bytes | Exports |
|---|---|---|
| `lib/assets/brand.ts` | 93 | `R_MARK` → `/assets/r-mark.webp`, `FAVICON` → `/assets/favicon.png` |
| `lib/assets/device.ts` | 55 | `DEVICE` → `/assets/device-terminal.webp` |
| `lib/assets/hero.ts` | 109 | `HERO_POSTER`, `HERO_VIDEO` |
| `lib/assets/logos.ts` | 851 | `LOGOS[]` — 13 `{alt, uri}` (12 webp + 1 svg) |
| `lib/assets/machines.ts` | 164 | `ARCADE`, `VENDING`, `COFFEE` |
| `lib/assets/vending.ts` | 59 | `VENDING_VIDEO` |

**The abstraction covers only 22 of the ~50 shipped assets.** Everything under `concept-08/` and `flow/` is a hardcoded string literal inside components (`/assets/concept-08/network-hall.webp` in `FleetCards.tsx`, the `frameSrc()` template in `DropSequence.tsx`, etc.). The constants module was never extended past the original extraction pass.

## 2. Inventory by folder

`public/` = **119 files, 56,795,776 B (54.16 MB)**. Excluding the 3 `master.mp4.part*` chunks: **10,762,390 B (10.26 MB)** of actually-servable media.

| Folder | Files | Bytes | MB | Composition |
|---|---|---|---|---|
| `public/assets/` (top level) | 9 | 6,440,369 | 6.14 | 6 webp (160,658 B), 1 png (4,889 B), 2 mp4 (6,274,822 B) |
| `public/assets/concept-08/` | 12 | 2,627,925 | 2.51 | 9 webp (424,216 B), 3 mp4 (2,203,709 B) |
| `public/assets/flow/` (top level) | 8 | 46,248,308 | 44.11 | 3 webp (53,800 B), 2 mp4 (161,122 B), **3 split chunks (46,033,386 B)** |
| `public/assets/flow/seq/` | 72 | 1,293,870 | 1.23 | 72 webp, uniform 1100×618 |
| `public/assets/logos/` | 13 | 84,160 | 0.08 | 12 webp (57,118 B) + 1 svg (27,042 B) |
| `public/fonts/` | 5 | 101,144 | 0.10 | 5 woff2 |

**By format across `public/`:** webp 102 files / 1,989,662 B · mp4 7 files / 8,639,653 B · woff2 5 / 101,144 B · svg 1 / 27,042 B · png 1 / 4,889 B · `.part00/01/02` 3 / 46,033,386 B.

Plus `docs/` (committed, not served): **37 QA screenshots, all webp, 1,199,150 B (1.14 MB)** across `concept-08/`, `concept-08-refinement/`, `concept-08-refinement-2/`.

### Video specs (all 7 probed)

Every mp4 is **H.264 (avc1), faststart verified (moov before mdat), zero audio track**. No WebM/AV1 alternates anywhere.

| File | Coded | Dur | Size | Bitrate |
|---|---|---|---|---|
| `assets/vending-video.mp4` | 1920×1080 | 11.87 s | 4,245,255 B | **2.86 Mbps** |
| `assets/hero-video.mp4` | 1152×556 | 16.00 s | 2,029,567 B | 1.01 Mbps |
| `concept-08/hero-wide.mp4` | 1920×1080 | 8.04 s | 981,251 B | 0.98 Mbps |
| `concept-08/hero-tall.mp4` | 1080×1936 | 8.04 s | 921,618 B | 0.92 Mbps |
| `concept-08/arcade-live.mp4` | 1600×892 | 5.04 s | 300,840 B | 0.48 Mbps |
| `flow/film-hero-wide.mp4` | 1280×720 | 2.50 s | 97,827 B | 0.31 Mbps |
| `flow/film-hero-tall.mp4` | 720×1282 | 2.50 s | 63,295 B | 0.20 Mbps |
| *(reassembled)* `flow/master.mp4` | **3840×2160 HEVC** | 6.04 s | 46,033,386 B | **60.95 Mbps** |

### Largest individual files — web-appropriateness

1. **`flow/master.mp4.part00` + `.part01` (20,971,520 B each) + `.part02` (4,090,346 B)** — not web assets at all, see §4.
2. **`assets/vending-video.mp4` — 4,245,255 B (4.05 MB), 1080p, 2.86 Mbps.** ❌ The worst runtime asset in the repo. Loaded by `components/VendingScroll.tsx` at `preload="auto"` on `/concepts/machine` (dynamically imported at `app/concepts/machine/page.tsx:11`, so it *is* live — the extraction report's claim that VendingScroll is dead code is now stale). 4 MB for a scrub background is 3–4× over budget; ~1 Mbps at 1280×720 would be visually equivalent.
3. **`assets/hero-video.mp4` — 2,029,567 B (1.94 MB), 16 s, `preload="auto" autoPlay loop`** on `/concepts/video-hero` (`page.tsx:223`). ❌ 16 s is far longer than a hero loop needs; the odd 1152×556 coded size suggests a crop rather than a designed render.
4. `concept-08/hero-wide.mp4` (981,251 B) / `hero-tall.mp4` (921,618 B) — ✅ ~0.95 Mbps for 8 s of 1080p is a defensible hero budget; art-directed wide/tall pair, correctly branched.
5. `concept-08/arcade-live.mp4` (300,840 B) — ✅ and it is the only video in the repo set to `preload="none"` (`TapToAction.tsx:90`).
6. **Largest image: `concept-08/card-vending.webp` — 92,348 B at 1200×1607.** ✅ acceptable, though it is 2.3–2.5× the byte weight of its two sibling cards at identical dimensions (`card-arcade` 36,808 B, `card-coffee` 40,416 B) — a quality-setting inconsistency, not a content one.
7. `assets/device-terminal.webp` 60,304 B (749×1000, VP8X+alpha) and `concept-08/network-hall.webp` 57,254 B (2400×1018) — ✅ both excellent ratios.

The still-image compression is genuinely good: **102 webp for 1,989,662 B total, averaging 19.5 KB.** Nothing in the image set is oversized.

## 3. `public/assets/flow/seq/` — yes, a canvas image sequence

**72 files, `f_001.webp` … `f_072.webp`, all exactly 1100×618 lossy VP8, 1,293,870 B total, mean 17,970 B, range 6,578 B (`f_056`) → 30,154 B (`f_036`).** Content: a cinematic can-drop through a vending machine's glass shelves.

Consumed by `app/concepts/flow/_c/DropSequence.tsx` — a 500vh pinned `<canvas>` scrub, the concept's signature interaction:

- All 72 fetched via `fetch()` → `createImageBitmap()`, `f_001` first (releases the poster), then 1–71 in order. `Preload.tsx` separately decodes the poster + first 8 frames behind an 800 ms cap.
- Scroll maps linearly: `frameIndex = Math.round(p * 71)`. The frames are **deliberately non-uniformly sampled** — the header comment states `f_001–063` = 0–4.2 s at 15 fps, `f_064–072` = the 4.2–6.0 s hold at 5 fps. That 6.0 s total **exactly matches the 6.04 s duration of `master.mp4`**, confirming the sequence was cut from the 4K HEVC master.
- Three-mode branch: `scrub` (desktop), `mobile` (≤820px → 3 stills only: `f_001` 10,356 + `f_035` 27,792 + `f_072` 16,724 = **54,872 B**), `static` (`prefers-reduced-motion` → `f_072` alone). Mobile never enters scrub, so the 72-frame preload is structurally unreachable under 820px. This is the single best-engineered piece of asset loading in the repo.

**Cost verdict:** 1.23 MB for 6 s of scrubbable motion = ~210 KB/s, versus 39 KB/s for `film-hero-wide.mp4`. ~5.4× the per-second cost of H.264 — but that buys reliable random-access scrubbing, which `video.currentTime` seeking cannot deliver across browsers. Fair trade for the hero interaction, and the mobile/reduced-motion paths avoid it entirely.

**One unflagged risk:** 72 decoded `ImageBitmap`s at 1100×618×4 B = 2.72 MB each ≈ **187 MB of resident bitmap memory** on desktop. They are `.close()`d on unmount, but nothing caps or windows the set.

## 4. `master.mp4.part00` at repo root

- **Exactly 20,971,520 bytes = 20 MiB.**
- Magic bytes: `00 00 00 1c 66 74 79 70 69 73 6f 6d` → `ftyp` / `isomiso2mp41`. It is the **first 20 MiB slice of a raw MP4** — not a split *archive*. There is no zip/rar/7z/gzip header, no volume descriptor, no per-part container metadata. It's a plain `split -b 20M` byte cut, so only `part00` carries the file header (`part01` and `part02` start mid-mdat with arbitrary bytes).
- **MD5 `6759a1f3b37cc32337d7699ab5d97fd2` — byte-identical to `public/assets/flow/master.mp4.part00`.** It is a stray duplicate.
- **Its siblings do not exist at root.** `part01`/`part02` live only in `public/assets/flow/`. The root file is therefore an **orphaned 1-of-3 fragment — unusable on its own, 20 MB of pure dead weight.**
- Concatenating the three `flow/` parts yields a valid **46,033,386 B (43.9 MB) MP4: 3840×2160, HEVC `hvc1`, 6.04 s, 60.95 Mbps, no audio** — the 4K master the `seq/` frames were extracted from.
- **The `.gitignore` rule is defeated.** Line: `# 4K HEVC source — not a web asset` / `public/assets/flow/master.mp4` — that ignores the *reassembled* filename only. `git ls-files` confirms **all four `.part` files are tracked**: `master.mp4.part00` (root) + the three under `public/assets/flow/`. Net: **66 MB of 4K source committed anyway**; `.git` is **82.88 MiB packed** (628 objects).
- **No reassembly script exists.** `grep "part0"` across all code and docs returns zero hits outside one line in `CONCEPT_08_QA_REPORT.md:110` ("remain untouched on the branch per the do-not-damage rule").
- Because the three chunks sit under `public/`, **Next.js copies all 43.9 MB into the deploy output** and Vercel serves them at `/assets/flow/master.mp4.part00` etc. Nothing references them.

## 5. Fonts — two disjoint sets, a real mismatch

**Shipped locally in `public/fonts/` (5 files, 101,144 B):**
`readex-pro-400.woff2` 23,224 · `readex-pro-600.woff2` 24,560 · `readex-pro-700.woff2` 24,380 · `plex-mono-400.woff2` 14,348 · `plex-mono-500.woff2` 14,632

**Loaded in `app/layout.tsx` via `next/font/google`:**
`Bricolage_Grotesque` (subsets `["latin"]`, variable) → `--font-bric` · `IBM_Plex_Sans_Arabic` (subsets `["arabic"]`, weights 300/400/500/600/700) → `--font-plex`

**The two sets share zero families.** Neither Readex Pro nor IBM Plex Mono is requested through `next/font`; neither Bricolage Grotesque nor IBM Plex Sans Arabic exists in `public/fonts`. This is deliberate, not accidental — both concept layouts document it:

> `app/concepts/flow/layout.tsx:18` — "SELF-HOSTED in /public/fonts (@font-face in flow.css) after next/font's Google fetch proved flaky at build time."

`@font-face` blocks live only in `app/concepts/flow/flow.css:2-6` and `app/concepts/one-tap/one-tap.css:2-6`. Consequences:

- **7 of 9 routes never touch the 98.8 KB of local fonts** (hub, cinema, latest, machine, pulse, video-hero, coming-soon) — they are downloaded on 2 routes only, but shipped to every deploy.
- **The 2 routes that use them get both systems.** `flow.css:31-32` sets `--fd: 'Readex Pro', var(--font-plex)` and `--fb: var(--font-plex)` — the body face is still the next/font Arabic family. The build emits **23 woff2 / 339,064 B into `.next/static/media`, 6 of them preload-marked (`.p.woff2`, 215,576 B)**. So `/concepts/flow` and `/concepts/one-tap` request ≈216 KB of preloaded next/font *plus* up to 98.8 KB of local woff2 ≈ **315 KB of fonts** for a page with one display face.
- **Latent bug:** `IBM_Plex_Sans_Arabic` is requested with `subsets: ["arabic"]` only, but `--fb`/`--fa` make it the body face for Latin text too — every `.en-t` span ("One tap", "The coil turns", "Book a demo"). The Latin subset is never downloaded, so all English body copy silently falls through to system `sans-serif`.
- `Bricolage_Grotesque` is wired only to `--fe`, which `flow.css` and `one-tap.css` never reference — it is downloaded on those routes and unused.
- Local files have **no `unicode-range`**, so all 5 load regardless of script on those routes.

## 6. Cross-cutting architecture findings

- **Zero `next/image` usage.** All ~15 image sites are plain `<img>` (with `eslint-disable @next/next/no-img-element`). No `srcset`, no AVIF, no `<picture>`, no automatic sizing. `width`/`height` are set on only 3 tags (`FleetCards.tsx:74`, `MachineCards.tsx:76`, `TapToAction.tsx:95`) — CLS risk on the other dozen. `loading="lazy"` is applied consistently, which is the saving grace.
- **`app/concepts/cinema/page.tsx` hot-links external media** — three `https://d8j0ntlcm91z4.cloudfront.net/user_3GaFDCPxXxLkf7tMkHBtsAhcdcL/…` URLs (1 mp4, 2 png) at lines 17, 19, 20, with `preload="auto"`. `HIGGSFIELD_ASSET_MANIFEST.md` explicitly names this "the `cinema` concept's documented anti-pattern." Worse, **line 18 ships an unreplaced placeholder**: `const HERO_VIDEO_TALL = "__HERO_VIDEO_TALL__";` — guarded by an `ok()` check, so it degrades rather than breaks, but mobile silently gets the wide crop.
- **Logos are raster at 1× only.** 12 webp at 123×72 (LuLu 193×72, Al Deera 124×72), VP8X with alpha. On a 2×/3× display in the marquee they will be soft. Roshn is the lone real vector (Adobe Illustrator 24.2.0 export, 27,042 B, 7 paths, no embedded base64) — and at 27 KB it is *heavier* than the 12 rasters averaging 4.8 KB. Inconsistent format policy in both directions.

### Per-route asset budget

| Route | Desktop | Note |
|---|---|---|
| `/` (hub) | **~188 KB** | 8 files, all stills. Excellent. |
| `/concepts/flow` | **~1.44 MB** (+99 KB fonts) | 1.23 MB is the sequence |
| `/concepts/flow` mobile | **~214 KB** | sequence structurally skipped |
| `/concepts/one-tap` | **~1.62 MB** | 981 KB hero film + 301 KB arcade (`preload="none"`) |
| `/concepts/video-hero` | **~2.27 MB** | 1.94 MB single video, `preload="auto"` |
| `/concepts/machine` | **~4.45 MB** | 4.05 MB single video, `preload="auto"` — worst route |
| `/concepts/cinema` | unmeasurable | 3 external CloudFront files + broken placeholder |

## 7. Verdict

**Asset quality: high craft, undermined by hygiene.** The compression work is legitimately good — 102 webp averaging 19.5 KB, every mp4 H.264 + faststart + audio-stripped, every video has a poster that doubles as the reduced-motion fallback, wide/tall art-directed pairs on both hero films, and a three-mode responsive branch on the frame sequence that keeps mobile at 214 KB. `/` at 188 KB is exemplary.

Against that: **43.9 MB of 4K HEVC source is committed and deployed under `public/`** with a `.gitignore` rule that names the wrong filename, **plus a 20 MB orphaned duplicate chunk at repo root that cannot even be reassembled**. Two routes ship 2–4 MB videos at `preload="auto"`. One route hot-links a third-party CDN and carries an unsubstituted `__HERO_VIDEO_TALL__` token. `next/image` is absent entirely, and the font strategy is two disjoint systems, both loading on the same two pages, with the Arabic family serving Latin text it has no glyphs for.

**Imagery provenance: AI-generated, and documented as such.** `HIGGSFIELD_ASSET_MANIFEST.md` gives model, job ID, prompt and credit spend per asset — **Nano Banana Pro 2K** for stills, **Seedance 2.0** and **Kling 3.0 Turbo** for video, ≈430 credits total, everything image-to-image or image-to-video anchored on the repo's canonical renders.

- **Not stock. Not product photography.** Zero photographic assets in the repo.
- The **four base plates** — `device-terminal.webp` (749×1000, alpha), `machine-arcade/vending/coffee.webp` (720×964) — are clean CGI product renders on transparent background, used as identity anchors and uploaded to Higgsfield as reference media IDs.
- Everything in `concept-08/` and `flow/` (including all 72 sequence frames, cut from the AI-generated 4K master) is generated. Visual confirmation: `hero-poster.webp` shows a doubled/ghosted phone edge at the hand; `network-hall.webp` still carries garbled snack-packaging lettering and a hallucinated label on the coffee kiosk.
- The manifest's own reject list is the clearest tell — *"Nexxpa Herrutyge"*, *"CUCCI"*, *"CERAGTOYDO"*, and a reader corrupted to *"B.PAY"* — all hallucinated text, the signature AI failure. Mitigation was sound: regenerate with logo-only screens, verify frame-by-frame via `scripts/vframes.mjs` (Playwright), keep all headline copy in HTML rather than baked into media. Residual artifacts survive that pass but only in background/peripheral detail.
- **The 13 partner logos are the only real-world assets** — genuine Saudi brands (Roshn, LuLu, Boulevard World, Dar Al Arkan, Kinan, Hamat, Sela, Al Khozama…). Worth flagging separately: nothing in the repo evidences permission to display these as clients.

**Highest-value fixes, in order:** delete `master.mp4.part00` from repo root (20 MB, orphaned, unusable); move the three `flow/master.mp4.part*` out of `public/` or fix the `.gitignore` pattern to `master.mp4.part*` (43.9 MB deployed dead); re-encode `vending-video.mp4` to 720p ≈1 Mbps and drop it to `preload="metadata"` (−3 MB); same for `hero-video.mp4` (−1.5 MB); self-host the cinema CloudFront assets and resolve `__HERO_VIDEO_TALL__`; add `latin` to the `IBM_Plex_Sans_Arabic` subsets array.

===== CONTENT =====
# R.Pay — Content, IA & Messaging Analysis

Repo root: `C:\Users\CCBoot\Documents\projects\r.pay` (Next.js App Router, no `src/`, 8 concept routes + hub)

---

## 1. What R.Pay the COMPANY actually does

**Product.** Not a payment gateway in the Stripe/Checkout.com sense. R.Pay sells an **embedded payment terminal for unattended machines + a fleet telemetry/operations SaaS**, sold as one bundle. The clearest self-definition:

> `app/concepts/latest/page.tsx:378` — "نظام موحّد يجمع الدفع الإلكتروني والمراقبة التشغيلية في منصة واحدة." / "One unified system bringing e-payment and operational control together."

> `app/concepts/one-tap/page.tsx:188-189` — "نظام دفع شامل ومنصّة تحكّم لحظية لأجهزة الخدمة الذاتية — من ماكينة واحدة إلى شبكة كاملة." / "A complete payment suite and real-time control platform for self-service machines — from one machine to a whole network."

The hardware layer is explicit: `components/HowItWorks.tsx:10-11` — "وحدة دفع إلكترونية داخل كل جهاز تقبل البطاقات والمحافظ الرقمية" / "An embedded payment unit in every machine accepts cards and digital wallets."

**Market.** Saudi Arabia first, MENA aspirationally. `app/concepts/latest/page.tsx:375` — "شركة سعودية تقود التحوّل الذكي لقطاع الأجهزة والخدمات الذاتية." Vision at `:393` — "أن نكون المنصة التقنية الرائدة لإدارة وتشغيل الأجهزة الذاتية في المملكة والمنطقة." The CTA claims MENA scope: `:480` — "Join the leading platform for scalable telemetry and digital payments in the MENA region."

**Customer.** Not consumers, not e-commerce merchants — **machine owners/operators** ("المشغّل / المالك"). Three named verticals, identical across every concept (`components/Integration.tsx:4-23`, `app/concepts/pulse/page.tsx:121-137`, `app/concepts/one-tap/_c/MachineCards.tsx:12-43`):
1. **ألعاب الأركيد / Arcade games** — prize/claw machines
2. **آلات البيع الذاتي / Vending machines**
3. **آلات القهوة / Coffee machines**

**The differentiator is cash-flow + anti-theft, not payment acceptance.** The two loudest features are *disintermediation of settlement* and *GPS geofencing*:
- `app/concepts/latest/page.tsx:329` — "التحصيل المباشر للمبالغ إلى حساب المالك أو المشغّل، أموالك تصلك مباشرة دون وسيط." / "Revenue is collected straight into the owner or operator account, no middleman."
- `:411` — "يتم تحديد موقع جغرافي لكل جهاز، وعند تغييره يُرسل تنبيه فوري ويُغلق الجهاز تلقائيًا إذا خرج عن الحدود المحددة."

Both are competitive daggers aimed at named rivals: `app/concepts/latest/page.tsx:442` — `<small>SurePay · Geidea</small>`.

**Verified proof canon** (byte-identical across all 8 concepts; `app/concepts/one-tap/page.tsx:13-18` calls it "The verified stats canon"): **465,255+ transactions · 97 machines managed · 9 branches · 9,434 gifts delivered**. Payment methods: mada, VISA, Mastercard, Apple Pay, stc pay (+ GCCNET only at `app/concepts/machine/page.tsx:217`). Contact: `wa.me/966550796555`, `hello@rpay.sa`, "طريق الملك فهد، الرياض".

**A real factual contradiction across concepts.** Concepts 01–05 present "أكبر مشغّل لمكائن ألعاب الأركيد في المنطقة" as *R.Pay's own* credential — it sits inside the About block describing R.Pay (`app/concepts/latest/page.tsx:380-381`, `pulse/page.tsx:520`, `cinema/page.tsx:308`). Concepts 07–08 reframe the identical phrase as a **customer**: `one-tap/_c/MachineCards.tsx:19` — "أكبر مشغّل لمكائن ألعاب الأركيد في المنطقة يدير قاعاته مع آر باي" / "The region's largest arcade-machine operator runs its halls on R.Pay", and `one-tap/_c/TrustBand.tsx:21` — "يثق بنا أكبر مشغّل…" / "Trusted by…". Same sentence, opposite subject. Someone must decide whether R.Pay *is* that operator or *serves* it.

---

## 2. Full site map

The root is **not a company homepage — it is a design-agency concept gallery**. `app/layout.tsx:19` sets the title to `"R.Pay — Interactive Concepts | مفاهيم آر باي"`.

| Route | File | What it presents |
|---|---|---|
| `/` | `app/page.tsx` | **Concept hub.** Nav (theme + AR/EN toggle), hero "استكشف آر باي / Explore R.Pay", 8 concept cards with number/status/eyebrow/title/desc/"افتح التجربة", footer. No product content. |
| `/concepts/latest` | 534 ln | **Concept 01 · "أحدث تجربة".** The most complete marketing page: nav (5 links) → animated hero (`HeroVisual`) + payment brand chips + 4 trust chips → `BrandsMarquee` → stats → 8-card feature bento → About/Mission/Vision/clients → `Integration` (3 sectors) → `HowItWorks` (4 steps) → Geofence radar → comparison table → CTA → 4-column footer. |
| `/concepts/video-hero` | 479 ln | **Concept 02.** Identical body to 01, but hero replaced by full-bleed `<video>` (`:223-225`); no `HeroVisual`, no payment-chip/trust-chip block. |
| `/concepts/machine` | 488 ln | **Concept 03.** Same body again, hero = device photo + fake dashboard + toast (`:222-253`), plus `VendingScroll` — a scroll-scrubbed vending video at `#showcase`. No theme toggle (`:187-191`). |
| `/concepts/pulse` | 664 ln | **Concept 04 · "النبض".** Reworked IA, 8 named "scenes": hero tap-to-pay simulator → stats/ECG line → 3 sectors → 8-tile platform grid → live network radar + rotating city feed → 4-pillar flow → VS scoreboard (8/8 vs 1/8) → CTA → footer. Dark-only. |
| `/concepts/cinema` | 373 ln | **Concept 05 · "سينما".** Deliberately ~2 screens: AI film hero → **one horizontal 9-frame reel** carrying the entire story (stats, 3 sectors, platform 1/2 + 2/2, about, why, CTA) → credits footer. |
| `/concepts/coming-soon` | 70 ln | **Concept 06.** Placeholder only: badge "المفهوم السادس · قريبًا", plus-mark, one paragraph, "العودة إلى المفاهيم". |
| `/concepts/flow` | 148 ln + 6 `_c` | **Concept 07 · "الدرج / The Drop".** Preload → film hero → **500vh canvas frame-sequence** of a can falling (4 beats) → 3-machine snap rail → network stats + marquee → control panel → close "دورك الآن. / Your turn." → footer + sticky CTA. |
| `/concepts/one-tap` | 227 ln + 7 `_c` | **Concept 08 · "لمسة واحدة".** Film hero (plays once, settles) → TrustBand → TapToAction → FleetCards (3 interpolating cards) → ControlRoom (sticky 240vh dashboard walkthrough) → MachineCards → proof stats → close → functional footer. |

**Non-routes that don't exist:** no `/pricing`, `/about`, `/contact`, `/security`, `/legal`, `/docs`, `/blog`, `/careers`, no `not-found.tsx`, no `sitemap.ts`, no `robots.ts`. `metadataBase` still points at a preview domain: `app/layout.tsx:33` — `"https://r-pay-orcin.vercel.app"`.

---

## 3. Value proposition & messaging hierarchy

**Tier 1 — the master claim.** Two competing formulations coexist:

*The platform framing* (concepts 01, 04, 05) — `latest/page.tsx:246-247`:
> "**ادفع. راقب. تحكّم.** / منصة واحدة لكل أجهزتك" · "**Pay. Monitor. Control.** / One platform for every machine"

*The generic framing* (concepts 02, 03) — `video-hero/page.tsx:233-234`, `machine/page.tsx:203-204`:
> "حلول **ذكية** لمستقبل أفضل" · "**Results** That Speak."

These are not translations of each other, and neither says what the company does — a straight downgrade from the 01/04/05 headline.

*The narrative framing* (concepts 07, 08) — the strongest work in the repo:
> `flow/_c/FilmHero.tsx:78-83` — "ادفع. خُذ." / "Pay. Take." + sub "نظام الدفع لماكينات البيع في السعودية" / "Payments for vending machines in Saudi Arabia"
> `one-tap/_c/HeroFilm.tsx:137-142` — "لمسة واحدة.<br/>تحكّم كامل." / "One tap.<br/>Total control." + "حوّل كل ماكينة إلى نقطة بيع ذكية، وأدر المدفوعات والأجهزة والعمليات من منصة واحدة."

**Tier 2 — the standing subhead** (verbatim in 01/02/03, `latest:250-251`):
> "نظام دفع شامل ومنصّة تحكّم لحظية لأجهزة الخدمة الذاتية، من ماكينة واحدة إلى شبكة كاملة." / "A complete payment suite and real-time control platform for self-service devices, from one machine to a whole network."

**Tier 3 — the eight capability pillars** (`latest:326-365`, restated as `pulse` OS grid `:32-81` and `cinema` OS_A/OS_B `:37-48`): direct settlement · auto refunds · real-time reports · unified dashboard · remote device control · geofence radar · inventory & rewards · branches/users/permissions.

**Tier 4 — the four-step mechanism** (`components/HowItWorks.tsx:5-34`): Integrated Smart Payment → Geofence Radar → Automatic Refunds → Unified Dashboard. Headline: "أربع خطوات، تحكّم كامل / Four steps to full control" (`:82-86`).

**Tier 5 — proof.** Stats canon; logo marquee (`lib/assets/logos.ts` — Roshn, Boulevard World, Boulevard City, LuLu, Dar Al Arkan, Sela, Hamat, Kinan, Al Khozama, Al Nadej, Al Deera, Malahi, Shawarma House) under "شركاؤنا وعملاؤنا / Our partners & clients"; three name-chips Saffori Land / Sparky's / VR Games Zone; the arcade-operator superlative.

**Tier 6 — competitive close.** "لماذا آر باي؟ / Why R.Pay?" table, 8 rows, R.Pay checks all 8, "الآخرون (SurePay · Geidea)" check exactly 1 (`latest:446-453`). `pulse` renders it as a scoreboard "8 / 8" vs "1 / 8" (`:589-593`). Hedged by `latest:470` — "تنويه: المعلومات مبنية على بيانات السوق الحالية…".

**Tier 7 — the ask.** `latest:479-480` — "انضم إلينا وابدأ البيع الذاتي الآن بكل سهولة" / "Join us and start self-service sales now with ease."

Hierarchy problems: **there is no "who is this for" line above the fold** on any concept, and no pricing/qualification signal anywhere, so the funnel goes hero → features → WhatsApp with nothing in between to self-select.

---

## 4. CTA strategy

**One verb, one destination, everywhere.** Every concept funnels to the same WhatsApp number, `966550796555`. There is **no form, no calendar, no signup, no email capture** in the entire repo — the only conversion surfaces are a WhatsApp deep link and a `mailto:`.

**Concepts 01–03 (weak, indirect).** Primary label is "ابدأ الآن / Get Started" pointing at `#contact` — an in-page anchor, not an action (`latest:230, 254`). Only at the bottom does the button become real: `latest:481` → `https://wa.me/966550796555`. Secondary "اكتشف المنصة / Explore the Platform" → `#features`. Support: `hello@rpay.sa` (`:482`), floating `WhatsAppWidget` from the layout, hamburger menu → `#contact`. **Strength: low.** "Get Started" promises self-serve onboarding that doesn't exist; the real action is buried three screens down.

**Concept 04 (pulse).** Same "ابدأ الآن" pattern, but the secondary is genuinely interactive: `:361-364` — "جرّب اللمسة / Try the tap" runs the payment simulator instead of navigating. Sector cards are themselves CTAs → `#contact` (`:444`).

**Concept 05 (cinema).** Best of the early set: nav button, hero button, and reel frame 09 all link **directly** to `wa.me` (`:183, 220, 338`), skipping the anchor indirection. Secondary "شاهد المنظومة / See the system" → `#reel`.

**Concept 07 (flow) — deliberately engineered, and it says so.** Four numbered CTAs, all `href="#demo"`, all the same label and colour, commented in-code as "CTA 1 of 4 — same verb, same colour, same destination" (`_c/FilmHero.tsx:87`): (1) hero, (2) **inside the dispense tray**, revealed as the can lands (`_c/DropSequence.tsx:219-223`), (3) reframed once on the proof — "انضم إلى 97 ماكينة / Join 97 machines" (`_c/Network.tsx:80-83`), (4) the oversized close (`page.tsx:130-133`). The label upgrades from "ابدأ الآن" to **"احجز عرض تجريبي / Book a demo"** — a concrete, low-friction ask. The final link carries a pre-filled Arabic WhatsApp message ("أرغب بحجز عرض تجريبي لـ R.Pay"). A mobile sticky bar appears after 40% scroll and **suppresses itself when a rival primary is adjacent** (`_c/StickyCTA.tsx:19-34`).

**Concept 08 (one-tap) — the strongest.** Five CTAs, "احجز عرضًا مباشرًا / Book a live demo", plus a friction-reducing note the others lack: `page.tsx:161-162` — "عبر واتساب — بالعربية أو الإنجليزية." / "On WhatsApp — Arabic or English." Secondary is non-navigational ("شاهد عملية الدفع / Watch the payment flow" replays the film, `_c/HeroFilm.tsx:151-154`), card CTAs are deliberately *text* links so they never compete ("never a second orange button", `_c/MachineCards.tsx:9`), and the floating widget hides at the close so nothing covers the final ask (`page.tsx:83-96`).

**Verdict:** CTA strength climbs monotonically with concept number. 01–03 are the weakest (vague verb, anchor-only, no urgency); 07–08 are genuinely well-designed (specific verb, single destination, pre-filled message, explicit anti-duplication rules). None of them offer the *low-commitment* option a payment company needs — no "see pricing", no "read the docs", no "talk to sales" form.

---

## 5. Live / restored / soon — what it implies

From `app/page.tsx:21-110`:

| # | Route | `status` | AR label | EN label | Eyebrow |
|---|---|---|---|---|---|
| 01 | latest | `live` | متاح | **Live** | الإنتاج · مصقول / Production · Refined |
| 02 | video-hero | `restored` | مُستعاد | Restored | سينمائي / Cinematic |
| 03 | machine | `restored` | مُستعاد | Restored | تفاعلي · تمرير |
| 04 | pulse | `live` | جديد | **New** | بصري · تفاعلي |
| 05 | cinema | `live` | جديد | New | سينمائي · فيديو |
| 06 | coming-soon | `soon` | قريبًا | Soon | قيد التطوير / In the studio |
| 07 | flow | `live` | جديد | New | سينمائي · تمرير |
| 08 | one-tap | `live` | جديد | New | سينمائي · فيلم منتج |

**Reading:**
- The `status` token and the visible label disagree for 04/05/07/08 — `live` renders as "جديد / New". Only 01 is labelled "Live", and only 01 is tagged "Production · Refined". So **exactly one concept is presented as the production candidate**; the other four "live" ones are new explorations.
- **"Restored" is a scar, not a status.** `:53` — "restored after the iPhone fix" ("مع تجربة الجهاز والأنيميشن بعد تحسين الآيفون"), and `:31` — "restored payment methods". These pages broke on iOS, were stripped, and were brought back. That's why 02/03 lag on quality: the `Auto cashback` mistranslation, the `ار باي` spelling, and the missing theme toggle all survive there but were fixed in 01.
- **06 is an empty route occupying a card slot** — `coming-soon/page.tsx` has no product content at all, just "اتجاه جديد كليًا للصفحة الرئيسية لآر باي قيد التصميم الآن."
- The trajectory is unmistakable: 01–03 share one codebase (`components/`), 04–05 fork it, 07–08 abandon it entirely for scene-based `_c/` architectures with self-hosted fonts, canvas sequences, QA scripts (`scripts/qa-onetap.mjs`, `perf-onetap.mjs`) and dedicated docs dirs (`docs/concept-08*`). **This is a live pitch/exploration repo mid-flight, not a shipped company site** — and no concept has been chosen.

---

## 6. Content gaps

A serious payment-technology company's site is missing essentially everything except the product story.

**Pricing — completely absent.** Zero occurrences of pricing, سعر, تسعير, plans, tiers, MDR, transaction fees, hardware cost, contract length. For a product whose headline differentiator is *where the money lands*, silence on commercials is the single largest gap.

**Security & compliance — absent, and worse, faked.** No PCI DSS, no SAMA licensing/authorisation, no encryption or tokenisation claim, no ISO, no data residency, no pen-test/audit statement. The word "Compliance" appears **four times in the entire codebase and every one is a dead link**: `latest/page.tsx:515`, `machine:469`, `pulse:645`, `video-hero:460` — all `<a href="#">`. Same for "الأمان / Security". The only security-adjacent copy is a UI chip: "دفع آمن / Secure checkout" (`latest:278`). A Saudi payments company that cannot name its regulator or its PCI status will not clear procurement.

**Integrations / hardware compatibility — absent.** Three sector cards say *which kinds* of machine, never *which makes/models*, protocols (MDB, ccTalk, Executive), connectivity (SIM/Wi-Fi/Ethernet), power requirements, or retrofit process. "White-label option / العلامة البيضاء" appears only as a comparison-table row (`latest:452`) and is never explained.

**Developer docs / API — absent.** No API reference, no webhooks, no SDKs, no sandbox, no status/uptime endpoint. The footer shows a static "النظام يعمل / System Operational" indicator (`latest:523`) that links nowhere and reflects nothing — a decorative status light, which for a payments vendor is actively misleading.

**Support — absent.** No help centre, no FAQ, no SLA, no ticketing, no phone number, no business hours. "تدريب ودعم عن بُعد / Remote training and support" exists only as a comparison-table row (`latest:451`). Contact = one WhatsApp number + `hello@rpay.sa`.

**Case studies — absent.** Thirteen client logos and three name-chips ("Saffori Land", "Sparky's", "VR Games Zone", `latest:383`) with **zero narrative**: no customer, no problem, no numbers, no quote, no testimonial, no logo-to-outcome link anywhere in 6,000 lines.

**About — thin and only three pages deep.** Concepts 01/02/03 carry an `#about` section (~2 paragraphs + mission + vision, `latest:371-398`); 04 compresses it into a network side-panel (`pulse:513-537`); 05 into one reel frame (`cinema:299-312`); **07 and 08 have no About at all.** No founding year, no team, no leadership, no headcount, no CR number, no funding, no offices beyond "طريق الملك فهد، الرياض".

**Legal — all placeholders.** "سياسة الخصوصية / Privacy Policy", "شروط الخدمة / Terms of Service", "الأمان", "الامتثال" — every one `href="#"` (`latest:512-515`, repeated in machine/pulse/video-hero). `cinema/page.tsx:362` has a dead "الخصوصية / Privacy" too. Also missing: cookie/consent notice, accessibility statement, refund/dispute terms — the last being conspicuous on a site whose #2 feature is automatic refunds.

**Also missing:** careers and partnerships (`href="#"`, `latest:506-507`), all three social profiles (`href="#"`, `:498-500`), blog/news/changelog, contact form, implementation/onboarding timeline, ROI or savings calculator, hardware spec sheet, comparison methodology behind the 8/8-vs-1/8 claim, 404 page, `sitemap.xml`, `robots.txt`, and any `hreflang`/localised URLs.

**Structural SEO/i18n gap.** Bilingualism is implemented as **both languages in the DOM simultaneously**, toggled by CSS (`.ar-t` / `.en-t` + `html.en`, e.g. `app/page.tsx:120-131`). One URL serves both languages, so every page ships duplicated body copy to crawlers, individual spans carry no `lang` attribute, and there are no `/ar` `/en` routes or alternates. Fine for a concept demo; unusable as a production bilingual site.

---

## 7. Arabic copy vs English copy

**Arabic is the source language and it is markedly better.** It is idiomatic Saudi business MSA with correct technical register and deliberate diacritics where ambiguity would bite: "ماكينة مُدارة", "هدية مُسلَّمة", "نظام موحّد", "تحكّم", "تصنيف الهدايا وتتبّع الكميات". Sentences are fluent, not calqued: `latest:359` — "تصنيف الهدايا وتتبّع الكميات وربط كل هدية بجهاز محدد، ضبط فعّال وتقليل للهدر وتجربة أدق للعميل."

**English is competent translation, but demonstrably second.** Evidence:

1. **Compression loss.** The English routinely drops the third clause. `latest:359` EN = "Classify prizes, track quantities and link each item to a device, tighter control and less waste" — "وتجربة أدق للعميل" (a more precise customer experience) is gone. Same pattern at `:379` (AR includes "ودعم نمو الأعمال بمرونة", EN stops at "secure user experience").

2. **A genuine mistranslation, still live in two concepts.** "استرجاع تلقائي" (automatic *refund*) is rendered **"Auto cashback"** at `video-hero/page.tsx:279` and `machine/page.tsx:288` — while the body immediately below says "Failed payments are refunded automatically." Cashback and refund are different products. Fixed to "Auto refunds" in `latest:333` and `pulse/page.tsx:40`. The same defect is frozen in the forked component: `machine/_c/HowItWorks.tsx:23` = `"Automatic Cashback"` vs `components/HowItWorks.tsx:23` = `"Automatic Refunds"`.

3. **The headline pair isn't a pair.** `video-hero:233-234` / `machine:203-204`: AR "حلول **ذكية** لمستقبل أفضل" (smart solutions for a better future) vs EN "**Results** That Speak." Different claim, different register, no shared meaning.

4. **Calqued English.** `video-hero:424` / `machine:433` — "Join us and start **self-selling** now with ease" is not English. Corrected in `latest:479` to "start self-service sales now with ease", but the broken version still ships on two concepts.

5. **Arabic brand-name inconsistency.** "آر باي" (correct, with madda) in the hub, 01, 04, 05, 07, 08 — but **"ار باي"** (bare alif) throughout 02 and 03: `video-hero:202, 268, 320, 325, 381, 390`; `machine:182, 277, 329, 334, 390`; and `machine/_c/Integration.tsx:33` vs `components/Integration.tsx:33`. Two spellings of the company name on one site.

6. **Register drift between concept generations.** 01–05 are formal MSA. 07–08 slip into Saudi dialect: `flow/_c/FilmHero.tsx:93` — "**شوف** الماكينات ←" (dialectal imperative; MSA would be "شاهد/استعرض"), and `one-tap/page.tsx:148` — "ماكيناتك جاهزة.<br/>**خلّها** أذكى مع R.Pay." Read alone these are warm and effective; read across the site they are a brand-voice inconsistency nobody has adjudicated.

7. **Latin brand inside Arabic sentences.** 07/08 write "R.Pay" un-transliterated mid-Arabic-sentence (`one-tap/page.tsx:148`, `_c/HeroFilm.tsx:157` — "شاهد كيف تعمل R.Pay على ماكيناتك") while 01–05 use "آر باي". Both are defensible; having both is not.

8. **Numeral inconsistency.** Everything uses Western digits with careful `dir="ltr"` fencing (`pulse:408, 429`; `one-tap/_c/ControlRoom.tsx:116`) — except `cinema/page.tsx:284`, which switches to Arabic-Indic: "المنصة ١/٢" against EN "Platform 1/2".

**Where the bilingual craft is genuinely good:** the RTL/LTR engineering is careful and unusual — `dir="ltr"` on every numeric readout, RTL-aware reel scrolling (`cinema:113, 123, 161`), the note that the mono LED face has no Arabic so the unit label sits *outside* the LED window (`flow/_c/MachineRail.tsx:4-6`), and a bilingual `aria-label` on the menu dialog (`components/Menu.tsx:55`). And 07/08's short parallel lines are the best copy in the repo in either language — "ادفع. خُذ." / "Pay. Take."; "لمسة واحدة. تحكّم كامل." / "One tap. Total control."; "وفي الطرف الآخر… أنت." / "And on the other side… you." (`one-tap/_c/ControlRoom.tsx:83-84`).

**Honesty note, to R.Pay's credit:** every simulated surface is labelled. `one-tap/_c/ControlRoom.tsx:106-110` and `FleetCards.tsx:104, 139` all carry "محاكاة مباشرة / Live simulation", and the source comments state the rule outright — "No dashboard screenshot exists in this repo and none is faked" (`ControlRoom.tsx:10-11`). That discipline is the exception in this repo's category and worth preserving into production.

---

## Three things to fix first

1. **Decide the arcade-operator claim** — R.Pay *is* the largest regional arcade operator (01–05) or *serves* it (07–08). It cannot be both on the same site.
2. **Pick one concept and give it the missing 60%** — pricing, PCI/SAMA status, real legal pages, one case study, and a contact form. Concept 08's messaging + concept 01's information depth is the obvious merge.
3. **Retire or repair concepts 02/03** — they carry "Auto cashback", "ار باي", "self-selling", and no theme toggle; every one is fixed elsewhere in the same repo.

===== HISTORY =====
# R.Pay — Project Design Memory (extracted from 11 in-repo documents)

All files live at `C:\Users\CCBoot\Documents\projects\r.pay\`. Note upfront: **the phrase "wow factor" appears nowhere in any of these documents** (verified by grep). What exists instead is a documented, self-critical indictment of the earlier redesign, quoted in §6.

## Timeline / two distinct eras

| Era | Date | Docs | Target |
|---|---|---|---|
| **Era 1 — production homepage `/`** | 2026-07-06 | `SETUP_REPORT.md`, `ASSET_EXTRACTION_REPORT.md`, `VISUAL_REDESIGN_REPORT.md`, `DEPLOYMENT_VERIFICATION_REPORT.md`, `FINAL_POLISH_REPORT.md`, `FINAL_DEPLOYMENT_REPORT.md` | The single landing page, deployed to `https://r-pay-orcin.vercel.app/` |
| **Era 2 — concept hub** | undated (between) | `CONCEPT_HUB_REPORT.md` | `/` became a hub; the Era-1 page was demoted to `/concepts/latest` |
| **Era 3 — concept 08** | 2026-08-03 → 08-04 | `CONCEPT_08_RESEARCH.md`, `CONCEPT_08_VISUAL_SYSTEM.md` (v3), `CONCEPT_08_QA_REPORT.md`, `HIGGSFIELD_ASSET_MANIFEST.md` | `/concepts/one-tap`, branch `concept-08-one-tap` from `main @ fddd85e` |

Repo now holds 8 concept routes: `cinema`, `coming-soon`, `flow`, `latest`, `machine`, `one-tap`, `pulse`, `video-hero` (+ hub at `/`).

---

## 1. Concept-08 design intent and visual-system contract

**Identity.** Route `/concepts/one-tap` · root class `.onetap` · **"Mode: dark-only (deliberate)"** · Title «لمسة واحدة. تحكّم كامل.» / **One Tap. Total Control.**

**Core idea, verbatim:**
> "Concept 07 told the story from the *product's* POV (the can falls). Concept 08 is **operator-POV**: one customer tap ripples outward — the machine wakes, the fleet lights up, the operator sees everything on one surface. The tap is the trigger; **control is the payoff.**"

**Page order (v3 persuasion-arc restructure):**
> "impact → CTA → trust → story → visibility → control → use cases → numbers → ask: Hero → **Early trust band** … → Tap-to-Action → Fleet → Control Room → Machine Cards → verified stats → Close → Footer. Logos moved from the pre-close band to the second beat; the stats stay just before the ask (belief peaks → ask lands)."

**The six acts** (from `CONCEPT_08_VISUAL_SYSTEM.md` §3):

1. **اللمسة / The Tap** — clean-screen hero film + HTML copy stack — `100svh`, *"the only full-viewport act"*
2. **من لمسة إلى تشغيل / Tap → Action** — text-free arcade ambient clip, entry-triggered, beat chips — media-sized 16:9
3. **شبكة واحدة / One Network** — Fleet cards: dominant image card (97 + machine types over the fleet plate) + two operational data cards (live payment simulation · fleet health), flex-interpolated expansion, cyan hairline marks the active card only — row `clamp(380px,48vh,460px)`, act ≈ 760–900px
4. **غرفة التحكّم / The Control Room** — sticky walkthrough (240vh), `min(84vw,1320px)` DOM dashboard through **دفعة تصل → الحالة تتحدّث → رؤية واحدة**, premium «محاكاة مباشرة» disclosure chip
5. **لماكينات حقيقية / Real Machines** — three aspect-specific 3:4 masters, machine complete inside crop-safe center, active card reveals benefit + a **text-link** CTA — row `clamp(480px,60vh,600px)`
6. **الإثبات والختام** — verified stats → light logo strip → close act (`64vh`) → compact functional footer. *"close is NOT 100vh; footer ≈ 300px"*

**Shared system (the hard contract):**
- **One radius** `--r: 18px`, one hairline `--line`, one content width `--w-content: 1240px`, one text measure `--w-text: 760px`
- **One eyebrow**: cyan tick + meta label, every act
- **One card language**: Acts III and V share `.cards-row` flex-interpolation — active card `flex-grow: 2.3`, 400ms house curve; mobile → snap carousels (84% cards, no hover dependency)
- **Accent contract**: *"cyan = system energy (pulse, status, active-card hairline, #prog). Warm = human action (buttons + `.tlink` text links). **Nothing else colored.**"*
- **CTA hierarchy — three tiers, one verb**: nav compact → hero dominant + ghost secondary → card text-links → close dominant. *"Five same-verb touchpoints, two dominant."*
- **Type**: 4 sizes (display/beat/body/meta) + LED mono, *"digits/Latin only, `direction:ltr` isolated — machine IDs and SAR amounts never reverse in RTL"*

**Media rule (hard):**
> "the terminal screen carries ONLY the R.Pay logo + contactless symbol — a graphic-only interface with **zero language-dependent text baked into any generated frame**. All words on the page are HTML."

**Hero behaviour:**
> "Poster-first film: text + poster render instantly, the film fades in `onCanPlay`, plays ONCE and settles (no loop seam); «شاهد عملية الدفع» replays it. At the film's pulse moment a DOM echo-ring crosses into the page and ignites the payment-brands row — the branded moment where film energy becomes interface energy."

**Motion law:** *"One law: 400ms `cubic-bezier(.22,1,.36,1)`; rises ≤ 12px; films play-once/entry-triggered and pause offscreen; the control walkthrough is the only scroll-driven state machine."*

**Density rules (audited):** no automatic `min-height:100vh` below the hero; act padding `calc(clamp(4rem, 8vw, 6.75rem) / 2)`; *"Every viewport of scroll reveals information or advances a state; no dead black regions."*

**Engineering rule (hard, documented in page.tsx)** — see §3 for the bug behind it:
> "the reveal system's imperative `in` class may only live on **static-className wrappers** (`.cards-reveal`), never on elements whose className React rewrites on state change."

**Explicitly rejected inside the visual system (§9):**
> "Starburst network visualization (dead space, noise, disconnected 97) · full-bleed stacked machine strips (crops, seams, banner feel) · five equal orange buttons · Apple pastiche · light theme · WebGL · invented analytics to fill the dashboard · any baked text in generated media."

---

## 2. Research findings and the benchmark set

**Method, verbatim:**
> "6 parallel research tracks (Awwwards 2025–26 · product-scroll storytelling · fintech/POS hardware · industrial & AI-assisted campaigns · Saudi/Arabic premium digital · B2B demo conversion) → 30 verified references → synthesis → cross-checked against a 6-track audit of this repository."

### The reference matrix (24 rows; columns: Reference / Year+recognition / The 3-second lesson / What makes it expensive / Do not copy)

*Note: the table cells in the source file are themselves truncated with literal `…` — the full reasoning was not preserved.*

**Awwwards / craft benchmarks:** Terminal Industries (REJOUICE+Propagande, SOTD Sep 3 2025) · Jeton (Bürocratik, SOTD Jan 27 2025, score 7.55, `#F73B20`) · Stripe BFCM Machine (SOTD Jan 8 2025) · Lando Norris (OFF+BRAND, SOTD Nov 17 2025, score 8.18, lime `#D2FF00`) · Messenger by abeto (SOTD Nov 10 2025, score 7.92, Developer Site of the Year, `#81BFBC / #C9D5C3`) · Oryzo AI by Lusion (Site of the Month April 2026) · iyO One (Awwwards inspiration, March 2026) · Igloo Inc (Site of the Year 2024) · Madar Platform by Vide Infra (Saudi logistics, SOTD + Dev Award Sep 2025, navy `#172E64` + coral `#FF6340`).

**Product-page grammar:** Apple iPhone 17 Pro · Apple AirPods Pro 3 (listed twice) · 1X NEO Home Robot.

**Fintech / POS hardware:** Stripe Terminal (Reader S700, the `$173.88` "Rocket Rental" receipt) · Square Hardware (incl. Square Handheld, May 2025) · SumUp US ("Built to Connect") · Flatpay ("Money in / Stress out") · Adyen POS · Nayax vending LP (direct category competitor) · Cantaloupe · Geidea KSA payment terminal.

**AI-generated campaigns:** Coca-Cola "Holidays Are Coming" AI edition (Secret Level / Silverside AI, Nov 3 2025 — *"System1 scored it 5.9 stars (maximum)"*) · Puma "Go Wild" with Monks (Mar 20 2025, first fully AI-agent-generated brand spot).

**Saudi / Arabic premium:** NEOM (custom family by Alberto Romanos via Landor; NEOM Arabic Display from Kufic construction) · Foodics (homepage + Request-a-Demo page) · Tamara (29LT wordmark by Pascal Zoghbi with Linda Hintz, Sep 2025) · Tabby · Attio (B2B CTA architecture benchmark).

### Conclusions drawn (§2 of the research doc)

**Hero:** (1) *"One object, one event, continuous presence."* (2) *"One kinetic sentence at first paint … Nothing competes: no chip rows, no stat widgets, no secondary headline in the opening frame."* (3) *"Object + consequence in one composition … Hardware alone is never the story."* (4) *"First paint is a finished poster still. No preloader, no blank states."* (5) *"Chromatic commitment. Near-monochrome blue-black base; **cyan** carried by exactly: the tap pulse, network lines, status LEDs. **Warm amber** carried by exactly: CTAs (+ the human-touch glow). Nothing else gets color."* (6) *"CTA visible at second one."*

**Motion:** four chapters + close = *"Tap → Action → Network → Control → Demo"*; *"The motion budget is spent on the hero"*; every animation *"resolves into a composed still that is the next section's layout"*; *"RTL mirrors motion, not just layout … This drove the choice of a live canvas scene over baked video for the network chapter"*; *"'Total Control' is composed authority, not racing energy"*; *"The degraded state is art-directed."*

**CTA:** one verb everywhere — «احجز عرضًا مباشرًا» / "Book a live demo", 5 placements. Destination is a **WhatsApp deep link `wa.me/966550796555`** with Arabic prefill: *"in Saudi, WhatsApp is the friction remover; booking is two taps, zero typing … Verified repo channel; no invented Calendly/forms/emails."* Explicitly measured failure cited: *"Cantaloupe's 12-label sprawl."*

**Arabic:** *"Arabic is authored, not translated."* Arabic display type gets *"larger optical size and tighter leading"* (Arabic runs ~20–25% shorter, no capitals). Language toggle = single equal-status header element, no flags. *"LED/mono windows are digits-only (IBM Plex Mono has no Arabic — repo-documented constraint)."*

### Research → repo adaptations (where evidence overruled research)

| Research said | Repo reality | Decision |
|---|---|---|
| Never AI-generate the hero object; use real photography | *"The product exists **only as renders** in this repo … there is no photography"* | Anchor every Higgsfield generation to canonical renders via image-to-image |
| One scoped Three.js/R3F scene | *"No R3F; three@0.149 exists but is documented to conflict with scrub canvases (`flow/layout.tsx`); the terminal has no 3D asset"* | **"Video for photoreal beats + canvas 2D for the network scene."** |
| License a 29LT foundry family | Repo self-hosts **Readex Pro** (400/600/700) + **IBM Plex Mono** | *"Art-direct Readex Pro harder … document the foundry upgrade as a future recommendation"* |
| Path-based locales `/ar` + `/en` | House system is `.ar-t`/`.en-t` + `html.en` | Keep house system; mirror **motion** via `dir` |
| Quantified hero subhead | Four canonical verified stats | **465,255+ payments · 97 machines · 9,434 prizes · 9 branches** — *"the '9' is **branches, never cities**"* |

### Claims ceiling (verified-only content contract)

**May use:** the four stats · positioning lineage «ادفع. راقب. تحكّم. / منصة واحدة لكل أجهزتك» · eight-feature canon · five payment brands (mada, VISA, Mastercard, Apple Pay, STC Pay) · 13 partner logos · clients Saffori Land / Sparky's / VR Games Zone · sectors أركيد / بيع ذاتي / قهوة · `wa.me/966550796555`, `hello@rpay.sa`, King Fahd Rd Riyadh · brand spelling «آر باي» only.

**Must not invent:** *"uptime/SLA/latency numbers · city counts · certifications or regulator claims · payment brands beyond the five · pricing/settlement timing · machine counts other than 97 · new phone/email/booking channels · a dashboard presented as a real product screenshot · escalated superlatives · Arabic transliterations («الاسكرول») or AR/EN mismatched pairs."*

Critically: *"SAMA/PCI appear nowhere in the repo → they do not appear in 08."*

### Anti-patterns deliberately rejected (§2.5) — quoted in full
> "Apple pastiche (white-void studio look, 'Get the highlights', superlative formulas) — borrow grammar, never skin. · Template smells: three-icon benefit rows, logo carousel above the fold, equal-weight card grids, FAQ-as-architecture, glassmorphism everywhere, gradient text on every heading. · Purple fintech gradients; neon everywhere; 7-layer glow stacks. · Page-wide WebGL, walk-to-navigate, conversion-less chapters. · External video embeds with player chrome; hot-linked CDN media. · Invented stats, fake testimonials, invented certifications. · Baked-in headlines inside generated media; AI text artifacts; unstable logos. · Multiple competing CTAs; CTA label drift."

---

## 3. Every problem found and fixed (do not repeat these)

### Era 1a — Asset architecture (`ASSET_EXTRACTION_REPORT.md`)
1. **Base64 assets embedded in TS modules** → First Load JS **2.37 MB → 98.3 kB (−96%)**; `lib/assets/` source 8.7 MB → 1.3 kB. 22 assets extracted, MIME-verified via magic bytes, byte-identical. Export names/shapes kept identical so *"Components therefore needed **zero changes**"*.
2. **Dead `<source src="/hero.mp4">`** — *"pointing at a file that never existed in the repo … so it 404'd on every page load"* → removed.

### Era 1b — Visual redesign (`VISUAL_REDESIGN_REPORT.md`) — 10-agent adversarial review, 6 confirmed findings, all fixed:
3. Two **Arabic letter-spacing regressions** (cursive joining broken in partners and payments labels)
4. **Hero backdrop-filter over-use** → trimmed to only the live-sales panel; chips/kicker/pays use tinted solids
5. **Per-frame SVG drop-shadow** on moving pulses (would re-rasterize every frame) → removed
6. **Reduced-motion gap on pseudo-elements** — *"previously ::before/::after loops survived it"* → `*,*::before,*::after{animation:none}`
7. **WebKit `xlink:href` SMIL fallback** missing

### Era 1c — Deployment verification (`DEPLOYMENT_VERIFICATION_REPORT.md`)
8. **Unsupported payment-brand claims.** *"The hero chips claimed specific acceptance brands (mada / Visa / Mastercard / Apple Pay) that appear nowhere else in the product content … Per the safety rule they were replaced before pushing with neutral trust chips"* (commit `5514927`). **Note: this was later reversed in the hub era (fix D1) once the brands were confirmed in `FilmHero.tsx`.**

### Era 1d — Final polish (`FINAL_POLISH_REPORT.md`) — 22-agent adversarial audit: *"1 refuted, 17 confirmed"*
9. **`metadataBase` pointed at the wrong host** — *"was `https://www.rpay.sa` — that domain currently serves a *different* site (an agency concept build), so any relative og URL would have resolved to the wrong host"*
10. **`og:image` missing** — *"links shared on WhatsApp/X/iMessage previously rendered with no preview image"*
11. Twitter card, `og:siteName` / `og:url` / `og:locale:alternate` all missing → added
12. **No `:focus-visible` ring existed anywhere** → brand-cyan 2px / offset 3px, darker blue in light theme (*"cyan fails 3:1 there"*)
13. **Menu dialog a11y** — `aria-modal`, bilingual accessible name, focus to close button, Escape to close
14. **Theme toggle** static `aria-label="theme"` → language-aware dynamic label
15. **Headings inside buttons** (`HowItWorks`) — *"invalid HTML; polluted screen-reader heading navigation"* → styled `<span>`s
16. **Contrast failure** — compare-table note 10px at 55% opacity failed AA in light theme
17. **Systematic Arabic-tracking bug** — `.ar-t{letter-spacing:normal}`: *"Latin microcopy tracking (khead .16em, hero-cue .2em, footer h4 .15em, clocks…) was inherited by the Arabic spans, visibly severing cursive joining in 5+ places"*
18. **Copy error** — *"'Auto cashback' → 'Auto refunds' … 'cashback' means a purchase reward; the feature is automatic refunds"*
19. **Brand transliteration unified to «آر باي»** — *"was a mix of 'ار باي' ×5 and 'آر باي' ×1"*
20. **Non-idiomatic EN CTA** "start self-selling now" → "start self-service sales now"
21. **Stats numeral overflow** — `465,255+` overflowed its card below ~430px and crowded dividers at 961–1100px
22. **Geofence chip / payment card overlap** on small mobile → `top:47%` at ≤640px (15px clearance at 320px)
23. **Pointer spotlight perf** — *"re-querying the DOM and measuring ~15 element rects on every raw `pointermove` (and included a dead `.sector` selector)"* → queried once, rAF-throttled
24. **`background-attachment:fixed` removed** (scroll-jank on mobile; ignored by iOS Safari)

### Era 1e — Final deployment (`FINAL_DEPLOYMENT_REPORT.md`)
25. **Menu focus timing defect caught on production** — *"the close button was still unfocusable at the first frame of the visibility transition. Fixed by deferring focus 60 ms (`26fc672`)"*
26. Operational note: **Vercel edge served a stale page ~35 min** post-deploy on fra1 — *"worth knowing before judging a deploy 'missing'"*

### Era 2 — Concept hub (`CONCEPT_HUB_REPORT.md`)
27. **Video-hero 404** — *"the restored dual-`<source>` pointed first at a non-existent `/hero.mp4`"* → dead source removed
28. **RTL brand lockups** — `direction:ltr` on `.brand-chip` so Apple Pay / STC marks stop mirroring
29. **D1** payment methods restored as labelled brand-chip row; **D2** "Multi-channel payments" chip re-laid-out (`white-space:nowrap`, chip-by-chip wrap); **D3** light-theme `.mcard` overrides — *"so the cards read as premium light surfaces instead of muddy black blocks"*
30. One finding ("D3 targets unrendered markup") was checked and **refuted as a false positive**

### Era 3a — Concept 08 v1 QA (`CONCEPT_08_QA_REPORT.md`, screenshot-verified before/after)
31. **Brand lockup read "Pay R." in RTL** → `.brand { direction: ltr }`
32. **WhatsApp widget rendered unstyled** (missing `.wa` route CSS) → flow port
33. **Mobile hero: payment brands sat over the bright film zone** → veil extended to ~72%
34. **Act V arcade plate duplicated Act II's composition** → new side-angle generation, copy pinned physical-left
35. **Partner logos illegible on dark** → light-card marquee strip

### Era 3b — Concept 08 v2 refinement
36. **Baked text artifacts in generated media** — v1 hero carried «اضغط للدفع / Click to pay» screen text, called *"the refinement's core defect"*. Fixed by regenerating everything against a clean-screen canon; *"every video inspected frame-by-frame"*.
37. **The double / left-scrollbar bug — root-caused, two compounding defects:**
   > "(1) `app/globals.css` set `body { overflow-x: hidden }`; per CSS spec, one hidden axis computes the other from `visible` to `auto`, so **`<body>` itself became a second vertical scroll container** alongside `html`. (2) The reveal system pre-translated the page's last element (`.foot`) by 12px; a transformed box at the document end **extends body's scrollable overflow by exactly those 12px**, activating body's scrollbar. In RTL the two scrollbars render on opposite sides — the reported 'second left scrollbar'."
   
   Fix: `body { overflow-x: clip }` + footer is rise-exempt. Regression test asserts zero rogue scroll containers **during throttled media download** (the original repro).
38. **Fleet act bloat** — *"≈ 860px desktop total (was ~1400px with the starburst)"*
39. **Machine cards** — *"zero clipped machines, zero seams … inactive titles no longer truncate (size-stepped, no mid-word ellipsis)"*
40. **CTA hierarchy** — *"the five-equal-buttons problem is gone"*; floating WhatsApp widget now hides when close/footer is visible so *"the closing CTA is never contested"*
41. **Control room toast repositioned clear of KPIs**; machine IDs / SAR amounts LTR-isolated inside RTL

### Era 3c — Concept 08 v3: the disappearing-card bug (most important engineering lesson)
> "The scroll-reveal system adds its `in` class **imperatively** (`el.classList.add("in")`) and then unobserves the element. `.fcard`/`.mcard` classNames are **React-managed and change on hover/focus** (`is-active` toggling). On the first interaction, React re-renders and reconciles the `class` attribute from its virtual DOM — which never contained `in` — silently wiping it. With `[data-rise]` still present, the card snaps back to `opacity: 0; translateY(12px)` permanently (the observer is gone), **so one hover could blank most of the section into black.**"

Reproduced deterministically in Playwright before fixing. **Fix:** reveal targets may only be static-className elements (`.cards-reveal` wrapper). **Regression:** harness hovers every card in both sections and asserts opacity/size through hover, mouse-leave, keyboard focus, language switch and resize. Evidence screenshot: `docs/concept-08-refinement-2/bug-before-fleet-collapse.webp`.

---

## 4. Unresolved issues, QA status, and performance numbers

### Performance (all localhost prod-server; explicitly *"architecture signal, not field data"*)

| Metric | Concept-08 v1 | Concept-08 v2/v3 | Production `/` (Era 1) |
|---|---|---|---|
| LCP | **132 ms** (poster+text; *"film never gates it"*) | **144 ms** | — |
| CLS | 0.02 | 0.02 | — |
| Long tasks >50ms | 1 | 1 | — |
| Full-page transfer incl. hero film | 1.48 MB | **1.31 MB** | — |
| Route JS / First Load | 6.96 kB / 94.4 kB | 7.15 kB | 12.7 kB / **99.9 kB** |
| Total shipped media | 2.9 MB | 2.9 MB | — |
| Build | ✓ 12/12 static pages | ✓ 12/12 | ✓ 4/4 |
| Horizontal overflow probe | **0px on every viewport** | 0px | virtual-only excess |

First-Load-JS trajectory for `/`: **2.37 MB → 98.3 kB** (extraction) **→ 99.7 kB** (entire redesign, *"+1.4 kB"*) **→ 99.9 kB** (polish).

### QA coverage achieved
- `npx tsc --noEmit` → **0 errors**
- 9 routes regression-swept; 8 viewports (1920×1080 → 360×800); AR/EN; reduced-motion; video-blocked; during-load scrollbar probe; CTA + keyboard audits
- Scenario matrix all ✓: poster-first first screen, `prefers-reduced-motion` (*"No `<video>` element mounted at all"*), all-`*.mp4`-blocked, CTA destinations, keyboard tab order, media discipline, AR/EN parity
- New QA utilities: `scripts/qa-onetap.mjs`, `scripts/perf-onetap.mjs`, `scripts/vframes.mjs` (+ `moments.mjs`, `refine-baseline.mjs`, `shoot.mjs`)

### Standing / unresolved issues
1. **`cinema` concept's hot-linked Higgsfield CloudFront videos abort** — the *only* failure in every harness run, repo-wide, across all three passes. *"documented anti-pattern that predates this branch."* **Never fixed.**
2. **`npm run lint` is unavailable repo-wide** — *"eslint is not installed in this repo … Not introduced by 08."*
3. **Hero film self-plays to its 8 s end if the user scrolls away mid-play.** *"Accepted trade-off for LCP simplicity."*
4. **`PULSE_AT = 3.2s` is hand-tuned to the delivered cut** — *"regenerating the film requires re-measuring."* Any new hero film breaks the DOM echo-ring sync.
5. **Field Core Web Vitals never measured** — *"no deployment in scope for this branch."* Concept 08 was never deployed.
6. **`master.mp4.part**` (46 MB, concept 07's) remain untouched** per the do-not-damage rule. (`master.mp4.part00` = 20 MB still sits in the repo root.)
7. **`npm audit`: 2 vulnerabilities (1 moderate, 1 high)** in the Next 14.2.x tree — flagged at setup, *"revisit in a maintenance pass"*, never done.
8. **`VendingScroll.tsx` is dead code** — its 4.25 MB video sits in `public/assets/` unused.
9. **Real-device iOS/Safari smoke test never performed** — *"all automated verification is Chromium-based"* (repeated in two reports).
10. **`NEXT_PUBLIC_SITE_URL` still defaults to the Vercel URL**; rpay.sa serves a different site.
11. **WhatsApp's crawler is WebP-intolerant** — advisory: export a 1200×630 JPG if the preview goes blank.
12. **Language selection is per-page, not persisted** across navigation (theme is).
13. **Concept 03 (machine) is dark-only** by design; **`latest.css` carries dead inherited rules** (`.pays/.pay`, `.vtitle/.vsub/.vhint`).

**Blockers, stated:** *"None. The branch builds, all 9 routes pass regression, and the concept is presentation-ready."*

---

## 5. How assets were produced — Higgsfield AI

**Yes, entirely Higgsfield AI generation.** `HIGGSFIELD_ASSET_MANIFEST.md`: *"Account: Higgsfield Ultra (MCP) · **Total spend: ≈ 430 credits of 5,442 available**."*

**Identity anchoring (the governing method):**
> "every generation is image-to-image against the repo's canonical renders (`device-terminal.webp`, `machine-arcade.webp`, `machine-vending.webp`, `machine-coffee.webp`, `flow/film-poster.webp` for grade reference). No headline/CTA text is baked into any media; the only in-media text is the product's own screen UI reproduced from the references."

**v2 canon:** *"All v2 generations chain from a new canon: a **clean-screen terminal reference** (job `61b22494`) whose display carries ONLY the R.Pay logo + contactless symbol — zero language-dependent text."*

### Shipped v2 assets (`public/assets/concept-08/`)

| File | Model | Dimensions | Size |
|---|---|---|---|
| `hero-poster.webp` | Nano Banana Pro 2K | 1920×1072 | 45 KB |
| `hero-poster-tall.webp` | Nano Banana Pro 2K | 1080×1935 | 58 KB |
| `hero-wide.mp4` (tap → surface ripple → settle) | **Seedance 2.0**, 8s, job `eb8e3124` | 1920×1072 | 958 KB |
| `hero-tall.mp4` | **Kling 3.0 Turbo**, 8s, job `fc921990` — *"Seedance failed the tall job twice"* | 1080×1936 | 900 KB |
| `card-arcade.webp` | Nano Banana Pro 2K (v2 after v1 rejected) | 1200×1607 | 36 KB |
| `card-vending.webp` | Nano Banana Pro 2K | 1200×1607 | 90 KB |
| `card-coffee.webp` | Nano Banana Pro 2K | 1200×1607 | 39 KB |
| `arcade-live-poster.webp` | Nano Banana Pro 2K | 1600×893 | 29 KB |
| `arcade-live.mp4` | Kling 3.0 Turbo 5s | 1600×893 | 294 KB |
| `hub-card.webp` | sharp crop of the clean hero poster (no new generation) | 1200×675 | 30 KB |

Plus `network-hall.webp` (v1, 2400×1018, 56 KB) which *"remains in service as the fleet-card plate."*

### Rejected generations (the AI-artifact catalogue — critical memory)

| Generation | Why rejected |
|---|---|
| Arcade card master v1 | **reader label corrupted to "B.PAY"** |
| Machines-row v1 (21:9) | *"AI text artifacts on the vending panel ('Nexxpa Herrutyge'-class garbage)"* |
| Vending scene v1 | *"Garbled screen copy ('Vanking') + fake luxury storefront lettering ('CUCCI') in the environment"* |
| Coffee scene v1 | *"Garbled drink names on screen ('CERAGTOYDO')"* |
| Hero film, **Cinema Studio 3.0** take (80 credits) | *"Technically strong but the pulse rendered as a big theatrical ring around the terminal — exactly the 'terminal in a neon ring' cliché the brief bans. Seedance's surface ripple kept"* |
| Arcade ambient, Seedance ×2 | *"Model rejected the job twice (failed status) → shot moved to Kling 3.0 Turbo"* |
| Tap macro close-up | *"Over-angled composition, logo partially cropped"* |
| **All v1 hero media** | **baked «اضغط للدفع / Click to pay» screen text** |
| `scene-arcade/vending/coffee.webp` | *"16:9 strips cropped machines in the old stacked layout"* |
| GALAXY-STRIKE-titled arcade clip/poster | baked game title |

### Reference uploads (Higgsfield media IDs — reusable)
`device-terminal.webp` → `178381d8-42fd-4898-be76-96006ef08cda` · `machine-arcade.webp` → `dc1dc5d1-267a-4475-ab40-a9045cf290e7` · `machine-vending.webp` → `bed97e79-83b6-43f2-88da-3c8ca6c13e12` · `machine-coffee.webp` → `2d93140d-881e-4be0-ae6b-7b2a464a2e72` · `r-mark.webp` → `7108a086-0459-495f-8b53-3e31d38af07e` · `flow/film-poster.webp` → `9cb52370-3d93-4e1f-9059-67c3bf0396dc`

### Pipeline
> "Raw generations (PNG ~6 MB each / source MP4) were optimized outside the repo with `sharp` (WebP q80–82, exact display widths) and `ffmpeg-static` (H.264 CRF 24–25, `-an`, `+faststart`, scaled to display size). **Nothing is hot-linked from the Higgsfield CDN** (the `cinema` concept's documented anti-pattern); every asset above is self-hosted."

**Media-rules compliance:** no baked headlines/CTAs · muted + `playsInline` · no generated audio · poster frames for every video doubling as reduced-motion and video-failure fallbacks · logo integrity checked frame-by-frame via `scripts/vframes.mjs` · *"No fake card numbers, no invented dashboard screenshots, no people's faces."*

---

## 6. The previous redesign approach, in its own words — and why it fell short

### What it was (`VISUAL_REDESIGN_REPORT.md`, 2026-07-06)

The self-description of the hero, verbatim:

> "**Hero (complete rebuild):** split layout — copy on the start side, a custom animated composition on the end side. The composition layers, back to front: an SVG **payment network** (4 glowing lines with traveling transaction pulses + colored nodes), two rotating **orbit rings** with satellites, the real R.Pay **terminal photo** floating over a breathing halo, a CSS-built **payment card** (metallic gold chip, NFC ripple, animated sheen sweep, `•••• 4291`), a **glass live-sales panel** (SAR 24,180 + drawing sparkline + LIVE dot + three mini-stats echoing the real numbers), an **'approved payment' chip** that loops in/out, and a **geofence 'inside safe zone' chip**. The whole scene responds to pointer **parallax** (7 depth levels, rAF-smoothed) and floats on layered timings. A faint masked grid + dual aura gradients sit behind it."

Headline: AR **"ادفع. راقب. تحكّم. / منصة واحدة لكل أجهزتك"** / EN **"Pay. Monitor. Control. / One platform for every machine"** — *"with the triad in the brand gradient."*

Elsewhere: *"gradient **edge-ring on hover**"*, *"the R.Pay column is now a glowing highlighted rail; the table wears a static gradient edge ring"*, *"CTA finale: bigger panel with breathing glow + two rotating dashed orbit rings"*, *"the partners label became a pill; footer gained a gradient hairline."*

And critically: **the hero video was deleted**. *"Removed from the interface entirely: the `<video>` element, its poster and the `HERO_POSTER`/`HERO_VIDEO` imports are gone from `app/page.tsx` (verified in the DOM: zero `video` elements on the page)."*

### The documented verdict against it

The docs never say "wow factor." The critique is instead structural and is delivered in `CONCEPT_08_RESEARCH.md` and `CONCEPT_08_VISUAL_SYSTEM.md`, which name `latest` — i.e. **that exact redesign** — as the repo's own cautionary example on three counts:

1. **Hierarchy collapse from stacked effects.** Anti-pattern list, §2.5:
   > "Purple fintech gradients; neon everywhere; **7-layer glow stacks (the repo's `latest` hero documents the hierarchy collapse).**"
   
   This maps 1:1 onto the layer inventory above (network + orbit rings + halo + card sheen + NFC ripple + glass panel + aura gradients + masked grid).

2. **No single focal sentence or object.** Hero conclusion #2:
   > "**One kinetic sentence at first paint** … Nothing competes: no chip rows, no stat widgets, no secondary headline in the opening frame. (Every 2025–26 SOTD commits to one sentence + one focal object; **the repo's own `latest` concept documents the opposite failure.**)"
   
   The `latest` hero shipped a triad headline *plus* a trust chip row *plus* a stats band *plus* two floating status chips *plus* a live-sales panel — precisely the "opposite failure."

3. **Simulated data used as decoration.** The `latest` hero shipped `•••• 4291` and `SAR 24,180` as ambient garnish. The 08 claims ceiling bans *"a dashboard presented as a real product screenshot"* and *"No fake card numbers"*; 08 instead requires a visible «محاكاة مباشرة / Live simulation» disclosure chip.

4. **The category diagnosis 08 was built to answer.** Two reference rows state the failure mode the previous approach fell into — polished but inert:
   - Adyen: *"The total absence of motion: even a premium enterprise brand reads as a **flat brochure** without a single kinetic moment — the strongest…"*
   - Foodics: *"Its visual conservatism — **the hero is a photograph, not a moment.** R.Pay's differentiator is the cinematic tap-to-network sequence."*

5. **Related in-repo cautionary tales named by the research:** *"the `video-hero` concept's mismatched [AR/EN] pair is the documented defect"* and *"repo's `cinema` concept is the in-house cautionary tale — **placeholder `__HERO_VIDEO_TALL__` shipped**"* (whose hot-linked CDN videos still fail every QA run today).

6. **Concept 08's own first attempt at spectacle also failed** and was cut — proof the team already tested and rejected the "impressive-looking graphic" instinct: *"**Starburst network visualization (dead space, noise, disconnected 97)**"* — it cost ~1400px of vertical space and was replaced by the ~860px fleet-card row.

### The corrective thesis, stated

Concept 08's answer to the previous approach's shortfall is not *more* effects but **committed cinema plus subtraction**: one photoreal hero film of a real tap replacing the CSS-composite scene; strict two-color accent contract replacing gradient-everything; one CTA verb in five placements replacing five equal buttons; every animation resolving into a composed still; and *"The motion budget is spent on the hero"* with composed stills below the fold.