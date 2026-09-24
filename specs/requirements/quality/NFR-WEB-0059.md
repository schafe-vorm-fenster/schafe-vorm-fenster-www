---
artefact: requirement
id: NFR-WEB-0059
class: NFR
form: Q1
domain: WEB
status: DRAFT
version: 0.1.0
area: accessibility
source:
  source_id: SRC-0006
  loc: "UNKNOWN"
  excerpt: "UNKNOWN"
evidence_sufficiency: S3
fit_criterion:
  scale: "acceptance criteria of NFR-WEB-0059 that pass"
  operator: "="
  value: 1
  unit: criteria
  meter: "TS-WEB-0002-A3 — 1 of 1 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T16:45:00+02:00"
---

# NFR-WEB-0059

Contrast ratio of display type and of non-text contrast against its background SHALL be >= 3 :1, measured by `scripts/check-contrast.ts` (TS-WEB-0002-A3).

## Source

SRC-0006, SRC-0014#accessibility, DEC-0056

Unlocatable: Transcript never mentions display type or non-text contrast, nor a 3:1 ratio.

Finding: The numeric ratio comes from WCAG/DEC-0056, not from SRC-0006.

## Notes

Measured against the composite of photo plus gradient, not the gradient alone. Non-text contrast covers borders and the focus ring.
