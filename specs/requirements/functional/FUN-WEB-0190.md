---
artefact: requirement
id: FUN-WEB-0190
class: FUN
form: F1
domain: WEB
status: DRAFT
version: 0.1.0
area: forms-and-leads
source:
  source_id: DEC-0051
  loc: "specs/decisions/DEC-0051--envoy-carries-newsletter-and-invoicing.md#L13"
  excerpt: "**Newsletter**: signup and double opt-in run through envoy"
evidence_sufficiency: S3
fit_criterion:
  scale: "acceptance criteria of FUN-WEB-0190 that pass"
  operator: "="
  value: 3
  unit: criteria
  meter: "TS-WEB-0016-A11, TS-WEB-0016-A12, TS-WEB-0016-A21 — 1 of 3 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T17:20:00+02:00"
---

# FUN-WEB-0190

For the e-mail route of newsletter signup, the website SHALL implement double opt-in through envoy.

## Source

DEC-0051, DEC-0052

Finding: DEC-0051 does not distinguish channels; 'the e-mail route' is a narrowing that this record does not make.

## Notes

A row of the Q-0022 contract (DEC-0051).
