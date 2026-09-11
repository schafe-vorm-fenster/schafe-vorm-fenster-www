# Leitplanken

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
  playbook. Content is consumed and cited, never invented — a missing
  fact renders as a designed empty state, and the gap goes on the
  open list.

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

## Credentials and questions

- Credentials never land in files that reach the repo. `.env*` stays
  gitignored; workflows reference secrets by name.
- **Nobody asks Jan during the run.** Ambiguity → documented
  assumption + open-point entry, then keep working. The open list is
  what Jan reads afterwards.

## Testing

- Nothing enters the pipeline that is not green locally
  (`pnpm check`, typecheck, unit/integration, local e2e).
- QA, Chaos, UAT and Kunde never fix code. Developer never grades
  their own work as accepted.
