---
id: DEC-0149
title: Editorial review gets a chaos persona; its first round closes a recorded spec/test drift
status: accepted
date: 2026-10-07
decided_by: jan-henrik.hempel
---

## Decision

The owner's own walk of `/dein-ort` (a voice-memo review, 2026-09-27/28)
found defects no acceptance criterion names: topic mismatch between a
story's live example and its surroundings, choppy kicker/title/body prose,
desktop single-column content stretched full-bleed, three near-identical
sections that should consolidate. Running `playbook-customer-acceptance`
against `TS-WEB-0020`'s own 13 criteria, by hand, against the same preview,
confirmed none of those would have surfaced — the playbook is bound to
written criteria by its own text ("accept only what satisfies the criterion
as written… no fixes, no rewording") and `plan/process.md` names its skills
as "none — the criteria and the preview are the instrument". Of the process's
other roles, `playbook-chaos-run`'s four personas (`hasty-clicker`,
`form-abandoner`, `keyboard-only`, `boundary-tester`) are interaction-
behavioural only, and `uat-persona` is explicitly barred from judging
("a simulated persona cannot reliably grade comprehensibility"). No role in
the documented process is mandated to exercise editorial/design judgment
without a pre-written criterion.

**New chaos persona: `editorial-reviewer`**
(`.agents/roles/personas/editorial-reviewer.persona.md`). Picked up
automatically by `playbook-chaos-run`'s `persona-profiles` interface
(repository-glob over `.agents/roles/personas/*.persona.md` — no dispatch
config change needed). Same constraints every persona already carries:
observes, does not fix or rate; `source: chaos:editorial-reviewer` in the
findings log.

**The owner's review is logged retroactively as that persona's first round**:
`state/findings/round-4-chaos-editorial-reviewer.md`, eight findings
(F-4-1…F-4-8), each triaged into exactly one of three buckets:

1. **Spec gap** — no criterion existed; one is written now. `TS-WEB-0020` D3
   gains an explicit category column and `A14` (example topic must match its
   story); `A15` (nearby rows must state their distance, must not duplicate).
   Grid width (F-4-1) and section consolidation (F-4-5) need a designer's
   judgment on the actual values/pattern, not a number invented here —
   `state/open.md` rows carry them as decisions needed.
2. **Spec/test drift** — the written criterion and the shipped, tested
   behaviour disagree, undocumented. `TS-WEB-0020`'s D3/A6 said testimonials
   do not render while unverified; `e2e/pages/dein-ort.spec.ts` was rewritten
   to assert the opposite, with no `Deviation:` line and no demand
   following it (DEC-0104's own mechanism, not applied here). Recorded now:
   D3's testimonial paragraph carries the deviation, A6 is marked
   superseded, `DEM-0069` opens the clearance debt it was always owed.
3. **Bug, not a spec question** — investigated to its actual root cause
   rather than patched blind (F-4-6: the duplicated "hier könnte dein Termin
   stehen" rows). Traced with a temporary instrumentation probe, reverted
   after use: `tier: "live"`, real UUIDs, `categoryId: "unknown"` — this is
   **not** a bug in this repository. Two real events, published in events-api
   itself for Rubkow, carry a literal placeholder title and no category.
   `DEM-0070` raises it upstream; nothing in this repository's code changes
   for it.

## Consequences

- `.claude/agents/chaos-persona.md`'s description names the fifth persona.
- `specs/tactical/pages/TS-WEB-0020--dein-ort.tactical.md`: D3 table gains a
  category column and a recorded deviation on the testimonial paragraph; A4
  (unchanged assertion, new category clause lives in A14), A6 (marked
  superseded, substance unchanged), A14 and A15 (new).
- `DEM-0069` (spec/test drift, clearance debt) and `DEM-0070` (upstream
  events-api data quality, Rubkow) opened.
- `state/open.md` carries the two findings that need a human design call
  (F-4-1 grid width, F-4-5 section consolidation) rather than a value this
  record would otherwise have had to invent.
- Future polish rounds re-enter `plan/process.md`'s loop instead of running
  outside it, per `state/status.md`'s record that the gated process closed
  after M1 and everything since has been ad hoc.
