---
name: qa-acceptance-run
description: Walk a milestone's acceptance criteria one by one at their declared verification levels and produce a protocol plus severity-rated findings.
layer: project
tags:
  - qa
  - verification
  - acceptance-criteria
interfaces:
  - id: acceptance-scope
    description: The tactical specs whose acceptance criteria are in scope for this run.
    required: true
  - id: verification-strategy
    description: The mapping from criterion level to the check that decides it.
    required: true
  - id: target-environment
    description: The dev server and preview URL the checks run against.
    required: true
  - id: findings-log
    description: The round's findings file receiving every failure with severity.
    required: true
  - id: qa-protocol
    description: The protocol file recording a verdict per criterion.
    required: true
  - id: retest-list
    description: For retest runs only — the fix-now findings of the round to verify.
    required: false
---

# QA Acceptance Run

Give every acceptance criterion in scope an individual verdict —
pass, fail with a finding, or not-testable with a reason — and leave
a protocol another agent can act on mechanically.

## Prerequisites

- `acceptance-scope` names the TS ids; their criteria are the
  checklist, verbatim.
- `verification-strategy` decides how each criterion is checked;
  the level is the criterion's own declaration, never a choice.
- `target-environment` is up: local checks against the dev server,
  the smoke set against the preview.
- `findings-log` and `qa-protocol` are writable.
- On retests, `retest-list` bounds the scope: exactly those findings
  plus a short regression sweep.

## Guidelines

- Mandatory skills (Skill-Matrix, plan/prozess.md): `webapp-testing`
  for browser-level criteria, `web-design-guidelines` for a11y/UX
  criteria; at the M4/M5 gates additionally the security sweep —
  `semgrep` over the codebase, `differential-review` over the
  milestone diff.
- Verdicts are per criterion id. "The suite is green" is not a
  verdict.
- A failing criterion produces a finding with reproduction steps and
  severity per the process document — never a fix.
- Not-testable is honest and explicit: name what is missing and file
  the open point.
- The criterion's wording binds; a criterion that cannot be
  satisfied as written is a finding, not a rewrite.

## Workflow

### Phase 1 — Scope assembly

- Collect every acceptance criterion from `acceptance-scope` into
  the run checklist with its declared level.

Quality gate: the checklist count matches the specs' own count for
those ids.

### Phase 2 — Execution

- Per criterion, run the check its level demands per
  `verification-strategy` against `target-environment`; record
  pass/fail/not-testable in `qa-protocol` as you go.

Quality gate: every checklist entry carries a verdict.

### Phase 3 — Findings

- For each fail, write the finding into `findings-log`: severity,
  where, steps, expected (criterion id), observed.

Quality gate: every fail in the protocol links a finding id; every
not-testable links an open-point entry.

### Phase 4 — Regression sweep (retests only)

- Verify each entry of `retest-list` is resolved, then sweep the
  milestone's criteria briefly for regressions.

Quality gate: each retest finding is marked resolved or reopened in
`findings-log`; new regressions entered as new findings.
