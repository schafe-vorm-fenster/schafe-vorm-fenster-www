---
artefact: requirement
id: FUN-WEB-0195
class: FUN
form: F1
domain: WEB
status: DRAFT
version: 0.1.0
area: rendering-and-resilience
source:
  source_id: DEC-0019
  loc: "specs/decisions/DEC-0019--three-tier-data-resilience.md#L16"
  excerpt: "cache the response."
evidence_sufficiency: S3
fit_criterion:
  scale: "acceptance criteria of FUN-WEB-0195 that pass"
  operator: "="
  value: 3
  unit: criteria
  meter: "TS-WEB-0009-A3, TS-WEB-0009-A4, TS-WEB-0009-A5 — 2 of 3 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T17:20:00+02:00"
---

# FUN-WEB-0195

For a tier-1 live module, the website SHALL cache the response.

## Source

DEC-0019
