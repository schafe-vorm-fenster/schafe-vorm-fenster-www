---
artefact: requirement
id: NFR-WEB-0058
class: NFR
form: Q1
domain: WEB
status: DRAFT
version: 0.1.0
area: accessibility
source: "SRC-0006, SRC-0014#accessibility, DEC-0056"
evidence_sufficiency: S3
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T16:45:00+02:00"
---

# NFR-WEB-0058

Contrast ratio of body text against its background SHALL be >= 4.5 :1, measured by `scripts/check-contrast.ts` (TS-WEB-0002-A3).

## Notes

Measured against the composite of photo plus gradient, not the gradient alone. `scripts/check-contrast.ts` judges the token set itself, in all four themes the sheet declares, before any page composes it.
