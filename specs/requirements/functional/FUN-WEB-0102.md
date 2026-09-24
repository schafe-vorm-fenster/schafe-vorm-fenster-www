---
artefact: requirement
id: FUN-WEB-0102
class: FUN
form: F1
domain: WEB
status: DRAFT
version: 0.1.0
area: rendering-and-resilience
needs: [NEED-WEB-0005]
source:
  source_id: DEC-0019
  loc: "specs/decisions/DEC-0019--three-tier-data-resilience.md#L17"
  excerpt: "on API failure, serve the last cached answer, labelled with"
evidence_sufficiency: S3
fit_criterion:
  scale: "acceptance criteria of FUN-WEB-0102 that pass"
  operator: "="
  value: 4
  unit: criteria
  meter: "TS-WEB-0009-A10, TS-WEB-0009-A11, TS-WEB-0009-A4, TS-WEB-0009-A6 — 4 of 4 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-09T16:07:54+02:00"
---

# FUN-WEB-0102

On API failure, the website SHALL serve the last cached response, visibly labelled with its freshness ("Stand: …").

## Source

DEC-0019

## Notes

Tier 2 of the three-tier resilience model.
