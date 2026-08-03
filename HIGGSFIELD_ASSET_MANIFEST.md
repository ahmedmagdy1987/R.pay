# HIGGSFIELD ASSET MANIFEST — Concept 08 «لمسة واحدة / One Tap»

**Date:** 2026-08-03 · **Account:** Higgsfield Ultra (MCP) · **Total spend this concept:** ≈ 250 credits of 5,442 available.
**Identity anchoring:** every generation is image-to-image against the repo's canonical renders (`device-terminal.webp`, `machine-arcade.webp`, `machine-vending.webp`, `machine-coffee.webp`, `flow/film-poster.webp` for grade reference). No headline/CTA text is baked into any media; the only in-media text is the product's own screen UI reproduced from the references.

## Production assets (shipped, `public/assets/concept-08/`)

| File | Purpose | Model | Prompt summary | Dimensions | Size |
|---|---|---|---|---|---|
| `hero-poster.webp` | Act I LCP poster (desktop) + film start frame | Nano Banana Pro (2K) | Terminal on machine face, right-third composition, hand + phone 2 cm pre-tap, left negative space for copy, single cyan rim light | 1920×1072 | 72 KB |
| `hero-poster-tall.webp` | Act I mobile poster + tall film start frame | Nano Banana Pro (2K) | Same moment, 9:16, terminal lower third, copy space top | 1080×1935 | 60 KB |
| `hero-wide.mp4` | Act I hero film (desktop): tap → cyan pulse ring → settle | Seedance 2.0, 8 s, image-to-video from `hero-poster` | Locked camera; hand completes the tap; one thin cyan ring blooms and fades; hand withdraws; scene settles (play-once design, no loop seam) | 1920×1072, H.264, muted | 1.08 MB |
| `hero-tall.mp4` | Act I hero film (mobile ≤820px) | Seedance 2.0, 8 s, from `hero-poster-tall` | Same beat, vertical | 1080×1936, H.264, muted | 0.92 MB |
| `arcade-live-poster.webp` | Act II poster / still fallback (mobile + reduced motion) | Nano Banana Pro (2K) | Reference arcade cabinet powered on in dark premium hall, pool of cyan light | 1600×893 | 51 KB |
| `arcade-live.mp4` | Act II ambient clip (plays on entry, pauses offscreen) | Kling 3.0 Turbo, 5 s, from `arcade-live-poster` | Locked camera; screen plays attract animation; edge light breathes; near-loop ends | 1600×893, H.264, muted | 0.45 MB |
| `network-hall.webp` | Act III canvas backdrop | Nano Banana Pro (2K) | 21:9 receding row of the three reference machines + more, logo-only screens, left half near-black | 2400×1018 | 56 KB |
| `scene-arcade.webp` | Act V arcade plate | Nano Banana Pro (2K) | Side-angle cabinet pair, negative space physical-left (distinct composition from Act II) | 1920×1072 | 64 KB |
| `scene-vending.webp` | Act V vending plate | Nano Banana Pro (2K) | Reference vending machine in dark premium corridor; screen reproduced pixel-faithful from reference; no environment lettering | 1920×1072 | 71 KB |
| `scene-coffee.webp` | Act V coffee plate | Nano Banana Pro (2K) | Reference coffee machine in dark lounge, cup + steam in glowing bay; screen reproduced from reference | 1920×1072 | 39 KB |
| `hub-card.webp` | Concept Hub card + OG image | Nano Banana Pro (2K) | Centered tap moment beside vending shelves, warm Riyadh bokeh | 1200×670 | 27 KB |

**Total shipped media: ≈ 2.9 MB** (videos 2.45 MB + images 0.44 MB).

## Judged and rejected (not shipped, kept out of the repo)

| Generation | Why rejected |
|---|---|
| Tap macro close-up (Nano Banana Pro) | Over-angled composition, logo partially cropped — the film covers the tap beat |
| Machines-row v1 (21:9) | AI text artifacts on the vending panel ("Nexxpa Herrutyge"-class garbage) → regenerated with logo-only screens |
| Vending scene v1 | Garbled screen copy ("Vanking") + fake luxury storefront lettering ("CUCCI") in the environment |
| Coffee scene v1 | Garbled drink names on screen ("CERAGTOYDO") |
| Hero film, Cinema Studio 3.0 take (80 credits) | Technically strong but the pulse rendered as a big theatrical ring around the terminal — exactly the "terminal in a neon ring" cliché the brief bans. Seedance's surface ripple kept |
| Arcade ambient, Seedance takes ×2 | Model rejected the job twice (failed status) → shot moved to Kling 3.0 Turbo |

## Reference uploads (Higgsfield media IDs)

| Source file | media_id |
|---|---|
| `public/assets/device-terminal.webp` | `178381d8-42fd-4898-be76-96006ef08cda` |
| `public/assets/machine-arcade.webp` | `dc1dc5d1-267a-4475-ab40-a9045cf290e7` |
| `public/assets/machine-vending.webp` | `bed97e79-83b6-43f2-88da-3c8ca6c13e12` |
| `public/assets/machine-coffee.webp` | `2d93140d-881e-4be0-ae6b-7b2a464a2e72` |
| `public/assets/r-mark.webp` | `7108a086-0459-495f-8b53-3e31d38af07e` |
| `public/assets/flow/film-poster.webp` | `9cb52370-3d93-4e1f-9059-67c3bf0396dc` |

## Pipeline

Raw generations (PNG ~6 MB each / source MP4) were optimized outside the repo with `sharp` (WebP q80–82, exact display widths) and `ffmpeg-static` (H.264 CRF 24–25, `-an`, `+faststart`, scaled to display size). Nothing is hot-linked from the Higgsfield CDN (the `cinema` concept's documented anti-pattern); every asset above is self-hosted.

## Media rules compliance

- No page headlines or CTAs baked into media — all copy is HTML.
- Hero playback muted + `playsInline`; no generated audio used anywhere.
- Poster frames exist for every video; posters double as reduced-motion and video-failure fallbacks.
- Logo integrity checked frame-by-frame (Playwright frame extraction, `scripts/vframes.mjs`).
- No fake card numbers, no invented dashboard screenshots, no people's faces.
