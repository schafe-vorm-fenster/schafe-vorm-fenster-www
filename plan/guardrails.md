# Guardrails

Hard rules for every agent in the run. A violation is a critical
finding, regardless of who commits it.

## Deploy and branches

- **Preview only.** Deploys go to Vercel preview. Production
  (`--prod`, promotion, production env vars, production domains) is
  exclusively Jan's, after the run.
- **`next-2026` is the integration branch.** Feature branches fork
  from it and merge back into it via PR. Merging and pushing to
  `next-2026` is free; **`main` is never touched.**
- Deletions of files or branches only inside the run's own working
  area (`app/`, `src/`, `e2e/`, feature branches the run created).

## Scope and specification

- The specs are the contract. A feature nobody specified goes on
  `state/open.md`, not into the code.
- **Acceptance criteria are never reworded** to make them satisfiable.
  An unsatisfiable criterion is a finding with severity, plus an
  open-point entry.
- If a spec contradicts a concept document, the concept document wins
  (repo rule). Record the contradiction in `state/open.md`.
- Page copy comes from the go-to-market-os sources via the content
  playbook. Where a source exists, it binds: consumed and cited,
  never paraphrased into new claims. Where content is **missing**,
  the dummy-content rule applies (below) — the prototype is complete,
  never empty.

## Dependencies — the stack-harmony rule

The team decides new packages itself, without asking Jan. The
procedure for every new tool or package:

1. **Look sideways first**: check the sibling repos under
   `~/Projects/` (classification-api, events-api, geo-api,
   community-calendar, envoy-api — Next.js/Vercel/Actions stacks)
   for what they already use for this problem. Already-in-use in the
   family is a plus point; matching the family keeps the stack
   harmonious.
2. Decide, then **record the decision as an ADR** in
   `specs/decisions/` (next free number, normal index update) naming
   the alternatives and the sideways evidence.
3. Register the runtime dependency in `stack.allow.json` (TS-017 D1).

## The mock rule (prototype decision)

The run's target is a **finished prototype** for reviews and user
tests — every function integrated and visible. Therefore:

- Every missing external endpoint or component (envoy widget,
  organizerId minting, geo-api gaps, events-api stats fields, app
  help-URL contract, …) is **built as a mock delivering dummy data**
  — never as a hole, never as a bare empty state.
- Mocks live behind the same interface module the real system will
  use, switchable per environment — swapping in the real system
  later touches one module, not the pages.
- **Marking lives in frontmatter, data attributes and
  `state/open.md`; never in rendered copy (Jan, 2026-09-18.)** The
  site must look and read as if everything is finished: no visible
  or screen-reader-audible "Beispiel", "Demo", "Dummy", "Platzhalter",
  "nicht motivgenau", "Foto gesucht", "KI-generiert", "nicht
  freigegeben" or "Kein Nachweis" on any page, in either language.
  Stand-in data therefore *reads real* — real regional place names,
  plausible village dates, dates relative to today — while carrying
  `data-demo="true"` / `data-mock="true"` in the markup and a
  `Mock aktiv` row in `state/open.md`. It still never contains real
  persons, customers, or real-looking testimonials; real quotes come
  from the hub packages, and mocked form confirmations stay generic.
- Every active mock has a row in `state/open.md` marked `Mock aktiv`
  — that list is the checklist for the later hardening round.
- **The prototype does not go live.** A separate hardening round
  (real APIs in, mocks out, clearances resolved) follows after the
  run, before any production promotion.

## The dummy-content rule

The completeness bar applies to content exactly as to systems: every
route, every element, full design, **full copy, full images** — a
slot without a source gets **generated content**, never a hole:

- Generated copy follows the tone of voice and the communication
  principles, but claims stay generic — no invented numbers, names,
  testimonials, awards, or press quotes presented as real. Facts are
  real (cited) or plausible and unremarkable; never labelled in the
  page as an example.
- **Marking lives in frontmatter, data attributes and
  `state/open.md`; never in rendered copy (Jan, 2026-09-18.)** A slot
  whose photograph has not landed renders a flat brand-colour surface
  from the design system's colour sections — no hatch, no badge, no
  caption — and records the gap in `images[].provenance` and
  `data-placeholder`. A slot whose proof has not cleared holds its
  position the same way, marked `data-empty-proof`.
- Every generated slot is still registered: artifact metadata marks it
  (`provenance: generated`, `demo: true`), and `state/open.md` carries
  a `Dummy-Content` row per page area. The clearance and mocks
  registers in `state/open.md` remain the go-live checklist — they
  are the only place the marking now lives.

## Credentials and questions

- Credentials never land in files that reach the repo. `.env*` stays
  gitignored; workflows reference secrets by name.
- **Nobody asks Jan during the run.** Ambiguity → documented
  assumption + open-point entry, then keep working. The open list is
  what Jan reads afterwards.

## Testing

- Nothing enters the pipeline that is not green locally
  (`pnpm check`, typecheck, unit/integration, local e2e).
- QA, Chaos, UAT and Customer never fix code. Developer never grades
  their own work as accepted.
