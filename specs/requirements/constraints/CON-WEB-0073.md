---
artefact: requirement
id: CON-WEB-0073
class: CON
form: C1
domain: WEB
status: DRAFT
version: 0.1.0
area: personalization
needs: [NEED-WEB-0017, NEED-WEB-0022, NEED-WEB-0029]
source:
  source_id: SRC-0006
  loc: "UNKNOWN"
  excerpt: "Nee, Ort brauche ich nicht, das ist Spookie."
evidence_sufficiency: S2
fit_criterion:
  scale: "acceptance criteria of CON-WEB-0073 that pass"
  operator: "="
  value: 2
  unit: criteria
  meter: "TS-WEB-0010-A2, TS-WEB-0010-A8 — 1 of 2 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T17:20:00+02:00"
---

# CON-WEB-0073

The solution SHALL NOT resolve a visitor's location to place level, imposed by SRC-0006.

## Source

SRC-0006 (transcript), SRC-0001#6

Unlocatable: the transcript is one line with no line terminators, so it supports no position scheme.

## Rationale

Explicitly not pursued — "spooky".
