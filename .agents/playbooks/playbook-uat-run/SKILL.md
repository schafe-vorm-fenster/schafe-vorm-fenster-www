---
name: uat-run
description: Walk a site's conversion paths as a goal-driven first-time visitor and report hesitation points as signals, not verdicts.
layer: project
tags:
  - uat
  - conversion
  - usability
interfaces:
  - id: conversion-goals
    description: The governed conversion goals whose paths are walked.
    required: true
  - id: journey-specs
    description: Written journey definitions and page briefs describing the intended paths.
    required: true
  - id: target-environment
    description: The running site the persona visits.
    required: true
  - id: uat-report
    description: The milestone's report file receiving the observations.
    required: true
---

# UAT Run

Approach the site as someone with a real goal and no prior
knowledge, walk every conversion path to its end, and write down
each point of hesitation exactly where it happened.

## Prerequisites

- `conversion-goals` name the destinations; each gets one walk per
  applicable entry page.
- `journey-specs` describe the intended path — read after the naive
  walk, to name where reality diverged.
- `target-environment` is up.
- `uat-report` is writable.

## Guidelines

- First-time eyes: no shortcuts through known URLs, no developer
  vocabulary in the notes — write what the visitor saw and thought.
- A hesitation is route + step + what stalled you: a word you did
  not understand, a button you did not trust, a next step you could
  not find.
- Signals, not verdicts: the report never says "acceptable" or
  "fails" — the project manager draws conclusions.
- Reaching the goal does not end the walk: note what the
  confirmation left you unsure about.

## Workflow

### Phase 1 — Naive walks

- Per goal in `conversion-goals`: enter like a visitor would, pursue
  the goal on `target-environment` to completion or dead end,
  logging hesitations in the moment.

Quality gate: every conversion goal was walked end to end or its
dead end is documented with the exact stopping point.

### Phase 2 — Divergence pass

- Compare the walked paths against `journey-specs`; note where the
  real path diverged from the intended one and what caused the
  divergence.

Quality gate: `uat-report` filed with hesitations and divergences,
each carrying route + step, ready for the project manager.
