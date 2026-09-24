---
artefact: requirement
id: CON-WEB-0024
class: CON
form: C1
domain: WEB
status: DRAFT
version: 0.1.0
area: accessibility
source:
  source_id: SRC-0006
  loc: "UNKNOWN"
  excerpt: "Wir machen keine Optimierung für komplett blinde oder ähnliche."
evidence_sufficiency: S2
fit_criterion:
  scale: "acceptance criteria of CON-WEB-0024 that pass"
  operator: "="
  value: 2
  unit: criteria
  meter: "TS-WEB-0002-A1, TS-WEB-0002-A2 — 1 of 2 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T16:45:00+02:00"
---

# CON-WEB-0024

The solution SHALL NOT take full non-visual optimisation as a launch criterion, imposed by SRC-0006 "Accessibility".

## Source

SRC-0006

Unlocatable: the transcript is one line with no line terminators, so it supports no position scheme.

## Rationale

"Full non-visual optimisation is explicitly not a launch criterion, but semantic and screen-reader basics are mandatory." The basics are FUN-WEB-0128 and FUN-WEB-0119.
