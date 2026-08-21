# ⛔ STOP — READ `CONCEPT_08.md` BEFORE TOUCHING THIS BRANCH

**Branch `concept-08-scrub-lab` → read [`CONCEPT_08.md`](CONCEPT_08.md) at the repo root, in full, before you edit, run, build, or diagnose anything.**

This is not boilerplate. The page at `/concepts/lab` has broken repeatedly in ways the harness reported as **green** — a 7/7 paint pass while every segment was frozen on a real Mac; a "never blank" check that passed on a segment stuck on the wrong frame forever; a stability check that read an attribute instead of the pixels. `CONCEPT_08.md` carries the decisions, the real cause behind each bug (including the diagnoses that were **wrong**, so you do not re-walk them), the numbers that mean healthy, and the edits that look safe and are not.

## Non-negotiables

- **`main` is untouched at `97f09c3`. Nothing is merged.** Work on `concept-08-scrub-lab` only. Do not merge, do not push to `main`.
- **Do not touch concepts 01–07**, and do not touch `app/page.tsx` beyond the hub card.
- **Do not delete the `useEffect` at `app/concepts/lab/page.tsx:306`** — it also owns the `IntersectionObserver` that reveals all 33 `.rv` elements. Removing it leaves the page permanently at `opacity: 0`.
- **Never measure against a server you did not just start.** An orphaned `next start` serves a stale build and every check passes while describing the wrong page. `scripts/lab-build.mjs` aborts on this and names the PID.
- **If a measurement disagrees with what the user reports seeing, the user is right and the tool is suspect.** That has been true every single time on this project.

## Machine

Deep Freeze wipes this machine on restart. Every session starts from a fresh clone with zero context, and the Playwright browser cache lives outside the repo — `npx playwright install chromium webkit` is always required. **Push early.** If it is not committed, it does not exist.

## Any material change updates `CONCEPT_08.md` in the same commit.

Commit prose is not read by the next session. The document is the only thing that survives.
