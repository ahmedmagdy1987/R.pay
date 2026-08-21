> # ⛔ STOP — AGENTS READ THIS FIRST
>
> **If you are working on the `concept-08-scrub-lab` branch, read [`CONCEPT_08.md`](CONCEPT_08.md) in full before you edit, run, build, or diagnose anything.**
>
> That page has broken repeatedly in ways the test suite reported as green. The document carries the decisions, the real causes behind each bug (including the diagnoses that were **wrong**), the numbers that mean "healthy", and the specific edits that look safe and are not.
>
> `main` is untouched at `97f09c3`. Nothing is merged. Do not merge, and do not touch concepts 01–07.
>
> It is shorter than the time you will lose otherwise.

---

# R.Pay

Next.js 14 (App Router) marketing and concept site for R.Pay — a Saudi payment, operations and remote-control platform for operators of arcades, entertainment venues and self-service machines.

## Routes

| Route | What it is |
|---|---|
| `/` | concept hub |
| `/concepts/lab` | **Concept 08** — the scroll-driven film page. See [`CONCEPT_08.md`](CONCEPT_08.md) |
| `/concepts/one-tap`, `/concepts/cinema`, `/concepts/flow`, `/concepts/latest`, `/concepts/machine`, `/concepts/pulse`, `/concepts/video-hero`, `/concepts/coming-soon` | concepts 01–07 |
| `/redesign`, `/redesign/en` | the separate Horizon redesign workstream |
| `/meeting` | presentation build |

## Getting started

```bash
npm install
npx playwright install chromium webkit   # required for the harness
npm run dev                              # or: npm run build && npm start
```

## Content honesty layer

Nothing in this repo may state a fact about the real world except through `lib/content`. Claims live in `content/claims.json` and render through `claimMode()`, which has three modes driven by `NEXT_PUBLIC_RPAY_CONTENT` — unset (development, provenance chips), `demo` (plain figures), `production` (designed absences).

```bash
node scripts/check-content.mjs               # claim counts
node scripts/check-content.mjs --production  # the launch gate; exits 1 on unresolved blockers
```

Vercel preview deployments default to `demo` via `scripts/vercel-build.mjs`; production is never defaulted to demo and a production build that resolves to demo refuses to run.
