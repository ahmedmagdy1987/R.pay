# CONCEPT 08 — VISUAL SYSTEM

**Route:** `/concepts/one-tap` · **Root class:** `.onetap` · **Mode:** dark-only (deliberate; declared, not half-supported)
**Title:** «لمسة واحدة. تحكّم كامل.» / **One Tap. Total Control.**

---

## 1. Core idea

Concept 07 told the product's story from the *product's* point of view (the can falls). Concept 08 tells it from the **operator's** point of view: one customer tap ripples **outward** — the machine wakes, the fleet lights up, and the operator sees everything on one surface. The tap is the trigger; **control is the payoff.** The visitor understands R.Pay by watching one transaction travel from a fingertip to a control room.

## 2. Hero story (the signature experience)

A real-time film composition, not a background video:

| Beat | On screen | Layer |
|---|---|---|
| 0.0s | Finished poster: terminal on the machine's dark face, hand + phone frozen 2 cm from the screen. Headline + CTA already rendered | AVIF/WebP poster (LCP) + HTML |
| ~0.5s | Film fades in behind the text (`onCanPlay`), hand completes the tap | MP4 loop, muted, `playsInline` |
| tap | One thin cyan ring blooms outward from the terminal — the film's pulse | film |
| echo | The same pulse **leaves the film and enters the page**: a DOM ring expands past the hero copy; the stats row beneath ignites | CSS ring + counter ignition |
| settle | Film settles to stillness and loops seamlessly; page is calm again | film |

The DOM pulse-echo is the branded moment: the film's energy visibly becomes the interface's energy. The secondary CTA «شاهد عملية الدفع / Watch the payment flow» restarts the film and replays the echo (stays on page).

**Hero HTML stack:** eyebrow (آر باي · نظام الدفع والتحكّم) → H1 (the two-beat slogan, Arabic-first) → one-line sub («حوّل كل ماكينة إلى نقطة بيع ذكية، وأدرها من منصة واحدة.») → primary CTA + secondary → five payment brands as plain text (mada · VISA · Mastercard · Apple Pay · STC Pay). Nothing else.

## 3. Storyboard (six acts)

| # | Act | Claim proven | Visual | Media |
|---|---|---|---|---|
| 1 | **اللمسة / The Tap** | Payment is one tap | Hero film (above) | `hero-wide.mp4` / `hero-tall.mp4` + posters |
| 2 | **من لمسة إلى تشغيل / Tap to Action** | The tap drives the machine | Arcade cabinet alive in a dark hall; three mono beat-captions (لمسة → تفويض → تشغيل) | `arcade-live.mp4` play-once on entry + poster |
| 3 | **شبكة واحدة / One Network** | One tap scales to a fleet | Canvas constellation: 1 node ignites → 97 light up → lines converge to one point; HUD labels as HTML; flow direction mirrors `dir` | Canvas 2D (no video) over `network-hall.webp` backdrop |
| 4 | **غرفة التحكّم / The Control Room** | The operator sees everything | Full-width DOM-built ops surface in LED vernacular — digits-only mono, fed by the same pulse; labeled «محاكاة مباشرة / Live simulation» | DOM only (honest by design) |
| 5 | **لماكينات حقيقية / Built for Real Machines** | It runs the verified sectors | Three full-bleed cinematic scenes: أركيد / بيع ذاتي / قهوة, each with a tailored line + the single CTA verb | `arcade-scene.webp`, `vending-scene.webp`, `coffee-scene.webp` |
| 6 | **الإثبات والختام / Proof + Close** | Trusted, and ready | Verified stats row → partner logos → closing line «ماكيناتك جاهزة. خلّيها أذكى.» / "Your machines are ready. Make them smarter." → uncontested oversized CTA | HTML + logos |

## 4. Visual hierarchy

- One focal object per viewport; ambient effects are suppressed during narrative moments.
- Scale contrast does the drama: display headline `clamp(2.6rem, 7.2vw, 6.4rem)`; body stays ≤ 1.06rem; LED digits large; captions small mono.
- Whitespace is structural — acts breathe with `clamp(96px, 14vh, 180px)` spacing; no card grids.

## 5. Color

```css
--bg:    #05070A;  /* rich black, flow lineage */
--bg-2:  #0A1220;  /* deep blue-black gradient stop */
--ink:   #F2F6FA;  /* text */
--dim:   #8FA3B8;  /* secondary text */
--cyan:  #35E0D4;  /* SYSTEM ENERGY ONLY: pulse, network lines, status LEDs */
--warm:  #FFB454;  /* HUMAN ACTION ONLY: CTAs + tap-glow */
```
**Hard rule (written into `one-tap.css` like flow's):** cyan never appears on buttons; warm never appears on data. Everything else is neutral.

## 6. Typography

- **Readex Pro** 700/600/400 (self-hosted woff2, `@font-face` in route CSS — the flow pattern; next/font Google fetch is documented flaky here). Arabic display: `line-height ≥ 1.32`, `letter-spacing: normal` (cursive joining guard).
- **IBM Plex Mono** 500/400 for HUD labels, beat indices, LED digits — **digits + Latin only, never Arabic**.
- Four sizes total: display / lead / body / mono-meta. No fifth.

## 7. Motion system

- One law: `400ms cubic-bezier(.22,1,.36,1)`, rises ≤ 12px. Entry reveals via IntersectionObserver, play-once, no replay on scroll-back.
- Films: hero loops continuously (paused when offscreen via IO); act films play on entry, pause when hidden.
- Network canvas: rAF only while visible and only while animating; the convergence animation runs once, then holds a designed still.
- The pulse-echo is the only element allowed to cross a section boundary.
- `prefers-reduced-motion`: films replaced by posters, canvas renders its final constellation frame, counters SSR their final values, crossfades only. Fully usable, designed, not stripped.

## 8. CTA logic

- **One verb:** «احجز عرضًا مباشرًا» / "Book a live demo" — nav, hero, post-network, post-proof, close. All → `https://wa.me/966550796555?text=` «مرحبًا، أرغب بحجز عرض مباشر لـ R.Pay» (verified channel, upgraded prefill).
- Microcopy under the primary: «شاهد كيف تعمل R.Pay على ماكيناتك.» / "See how R.Pay works with your machines." + reply promise line.
- Secondary (hero only): «شاهد عملية الدفع» / "Watch the payment flow" — replays the sequence, never leaves the page.
- Floating `WhatsAppWidget` mounts after the hero (house pattern, suppressed near rival CTAs by StickyCTA precedent).

## 9. Responsive strategy

- `≤820px` is a different art direction, not a shrink: `hero-tall` 9:16 media, terminal in the lower third, copy above; acts stack full-bleed stills; the network act simplifies to fewer nodes at full opacity; **no frame sequences, no horizontal rails** (repo-documented).
- Viewports art-directed: 1920, 1440, 1280, 1024, 768, 430, 390, 360.
- Arabic line breaks are hand-controlled in the display sizes (`<br/>` between the two beats of the slogan).

## 10. Performance strategy

- LCP is the headline text + poster (`priority` hint), film streams after `canplay`; CTA works before any media arrives.
- Media budget: hero loop ≤ ~2 MB MP4 (H.264), act films lazy-loaded on approach, posters AVIF/WebP with explicit dimensions (zero CLS).
- No three.js, no animation libraries; JS is IO + rAF + one canvas module. Below-fold components are not hydrated where server-renderable.
- Offscreen media paused; canvas rAF gated; no continuous loops while idle.

## 11. Intentionally rejected

- Re-telling 07's fall (tap→drop) — 08 is the outward ripple, operator-POV.
- WebGL product scene (no 3D asset; video is cheaper and photoreal), page-wide scrub, scroll hijack.
- Light theme, gradient headings, glass cards, chip rows in the hero, logo marquee above the fold.
- A "real" dashboard screenshot (none exists — honesty via LED vernacular + simulation label).
- Invented stats/certifications; AI-generated logos; text baked into media.
- A second CTA verb anywhere.
