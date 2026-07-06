# R.pay — Asset Extraction Report

Date: 2026-07-06
Phase: asset-loading architecture fix (pre-redesign). No layout, copy, styling, or animation changes.

## Result at a glance

| Metric | Before | After |
|---|---|---|
| First Load JS (route `/`) | **2.37 MB** | **98.3 kB** (−96%) |
| Route `/` page size | 2.28 MB | 11.1 kB |
| `lib/assets/` source size | ~8.7 MB (base64 in TS) | 1.3 kB (path constants) |
| Dev server | ✅ clean | ✅ clean |
| Production build | ✅ clean | ✅ clean (4/4 static pages) |
| TypeScript (`tsc --noEmit`) | ✅ | ✅ exit 0 |

## What was extracted (22 assets, all MIME-verified via magic bytes)

| Export | Original source | New public path | Size |
|---|---|---|---|
| `R_MARK` | `lib/assets/brand.ts` | `/assets/r-mark.webp` | 6.4 kB |
| `FAVICON` | `lib/assets/brand.ts` | `/assets/favicon.png` | 4.9 kB |
| `ARCADE` | `lib/assets/machines.ts` | `/assets/machine-arcade.webp` | 19 kB |
| `VENDING` | `lib/assets/machines.ts` | `/assets/machine-vending.webp` | 25 kB |
| `COFFEE` | `lib/assets/machines.ts` | `/assets/machine-coffee.webp` | 20 kB |
| `DEVICE` | `lib/assets/device.ts` | `/assets/device-terminal.webp` | 60 kB |
| `HERO_POSTER` | `lib/assets/hero.ts` | `/assets/hero-poster.webp` | 30 kB |
| `HERO_VIDEO` | `lib/assets/hero.ts` | `/assets/hero-video.mp4` | 2.03 MB |
| `VENDING_VIDEO` | `lib/assets/vending.ts` | `/assets/vending-video.mp4` | 4.25 MB |
| `LOGOS` (13 entries) | `lib/assets/logos.ts` | `/assets/logos/*.webp` + `roshn.svg` | 2.5–27 kB each |

Logo files: `al-nadej`, `boulevard-world`, `roshn` (svg), `al-deera`, `al-khozama`, `lulu`, `sela`, `boulevard-city`, `malahi`, `dar-al-arkan`, `hamat`, `kinan`, `shawarma-house`.

Every data URI's magic bytes were sniffed (RIFF/WEBP, PNG, ftyp/mp4, XML/SVG) and matched its declared MIME — no blind extension guessing. Extracted files are byte-identical to the previously inlined data (verified: served content-length matches decoded size for all 22).

## Approach & files updated

The `lib/assets/*.ts` modules were kept with the **same export names and shapes**, but their values changed from data URIs to `/assets/...` paths. Components therefore needed **zero changes** — imports, props, and markup are untouched, which is the strongest guarantee of visual parity.

- `lib/assets/brand.ts`, `machines.ts`, `device.ts`, `hero.ts`, `vending.ts`, `logos.ts` — data URIs → path constants (~8.7 MB → 1.3 kB total)
- `app/page.tsx` — **one line removed**: the hero `<video>` had a dead first source `<source src="/hero.mp4">` pointing at a file that never existed in the repo (no `public/` dir existed), so it 404'd on every page load and the browser fell back to the second (inline) source. With the real file now at `/assets/hero-video.mp4`, the dead line was removed. Net effect: the same video plays, and a pre-existing 404 is gone.
- **No other component/CSS/layout/copy change.** Diffstat: 7 files, +22 −23 lines (each removed line was a megabyte-scale base64 string).

New (untracked) files: `public/assets/` (22 files, ~6.6 MB) and this report.
A stray `tsconfig.tsbuildinfo` generated during type-checking was deleted (compiler cache, not project content).

## Visual parity

The page should be pixel-identical: identical bytes for every image/video (byte-for-byte extraction), identical markup except the removed dead `<source>`, identical CSS. Verified in dev:

- Page returns 200; compiled 513 modules, no warnings/errors in the terminal
- All 22 `/assets/...` URLs return 200 with correct `Content-Type`
- Rendered HTML references all extracted paths (13 logos ×2 from the marquee's intentional row duplication) and contains **zero** remaining `data:` URIs
- Favicon now served from `/assets/favicon.png` via metadata icons

## Dev / build status

- `npm run dev` → ready in 2.5 s, page compiles and serves cleanly at http://localhost:3000
- `npm run build` → compiled successfully, types valid, 4/4 static pages, **First Load JS 98.3 kB**

## Remaining performance concerns (for the redesign phase)

1. **`/assets/hero-video.mp4` (2 MB) still loads with `preload="auto"` + `autoPlay`** on the hero. It's no longer in the JS bundle (huge win: parse/hydration is no longer blocked), but the network transfer remains. Consider `preload="metadata"`, lazy/intersection-based loading, or a compressed/shorter loop during redesign.
2. **`VendingScroll.tsx` is dead code** — defined but never imported (its section was removed in v2.1). Its video (4.25 MB) now sits in `public/assets/` costing nothing at runtime. Decide during redesign: revive the section or delete component + asset.
3. Plain `<img>` tags are used (correct for this phase). During redesign consider `next/image` for responsive sizing/lazy-loading of `device-terminal.webp` (60 kB) and machine images.
4. `npm audit`: 2 vulnerabilities (1 moderate, 1 high) in the Next 14.2.x tree — unchanged from setup, revisit in a maintenance pass.

## Git status

```
 M app/page.tsx
 M lib/assets/brand.ts
 M lib/assets/device.ts
 M lib/assets/hero.ts
 M lib/assets/logos.ts
 M lib/assets/machines.ts
 M lib/assets/vending.ts
?? SETUP_REPORT.md
?? package-lock.json
?? public/
```

Nothing committed, nothing pushed. Recommended before redesign: commit this state locally as a rollback point (`git add -A && git commit`) — the working baseline with clean assets.
