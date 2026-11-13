---
artefact: requirement
id: FUN-WEB-0198
class: FUN
form: F1
domain: WEB
status: DRAFT
version: 0.1.0
area: rendering-and-resilience
needs: [NEED-WEB-0005]
source:
  source_id: DEC-0033
  loc: "specs/decisions/DEC-0033--skeletons-and-streaming.md#L12"
  excerpt: "renders a skeleton immediately and streams in."
evidence_sufficiency: S3
fit_criterion:
  scale: "acceptance criteria of FUN-WEB-0198 that pass"
  operator: "="
  value: 3
  unit: criteria
  meter: "TS-WEB-0009-A13, TS-WEB-0009-A8, TS-WEB-0009-A9 — 1 of 3 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T17:20:00+02:00"
---

# FUN-WEB-0198

For a module whose data arrives after the shell, the website SHALL render a skeleton immediately.

## Source

DEC-0033, SRC-0014#skeletons, DEC-0056

Finding: The subject ('Every module whose data arrives after the shell') is on line 11.
