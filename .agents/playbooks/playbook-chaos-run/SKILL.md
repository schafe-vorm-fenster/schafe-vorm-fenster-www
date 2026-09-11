---
name: chaos-run
description: Unstructured browser testing by behaviour personas against a running site, producing raw observations for triage.
layer: project
tags:
  - chaos
  - testing
  - personas
interfaces:
  - id: persona-profiles
    description: The behaviour profiles to enact, one session each.
    required: true
  - id: target-environment
    description: The locally running dev server the browser sessions hit.
    required: true
  - id: run-scope
    description: The routes and flows of the current milestone the personas roam.
    required: true
  - id: findings-log
    description: The round's findings file receiving raw observations.
    required: true
---

# Chaos Run

Let each behaviour persona loose on the running site in a real
browser session and capture everything that breaks, jumps, stalls,
or lies — raw, unrated, reproducible.

## Prerequisites

- `persona-profiles` are loaded; one session per persona, played in
  character throughout.
- `target-environment` responds; the browser is driven directly (a
  local Chrome session), with scripted fallback only if direct
  driving is unavailable.
- `run-scope` bounds the roaming to the milestone's routes.
- `findings-log` is writable.

## Guidelines

- Stay in character: the persona's behaviour list is the method;
  curiosity beyond it is allowed, ratings are not.
- Every observation carries route, steps, and what was observed —
  enough that a stranger reproduces it.
- Severity and round decisions belong to QA triage and the project
  manager; the persona writes `source: chaos:<persona>` and stops
  there.
- A session that finds nothing states where it went and what it
  tried — silence is not a clean bill.

## Workflow

### Phase 1 — Session per persona

- For each profile in `persona-profiles`: open a fresh browser
  session against `target-environment`, roam `run-scope` enacting
  the profile, log observations into `findings-log` as they occur.

Quality gate: every persona covered every route in `run-scope` or
its log names what was skipped and why.

### Phase 2 — Handoff

- Deduplicate obvious repeats across personas, keep distinct
  manifestations separate, and mark the log section for QA triage.

Quality gate: `findings-log` contains each persona's section with
reproducible entries, ready for severity triage.
