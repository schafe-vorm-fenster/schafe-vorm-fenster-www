---
artefact: requirement
id: FUN-WEB-0128
class: FUN
form: F1
domain: WEB
status: DRAFT
version: 0.1.0
area: accessibility
source: "SRC-0006"
evidence_sufficiency: S2
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T16:45:00+02:00"
---

# FUN-WEB-0128

For every page, the website SHALL render semantic markup — landmarks, a heading outline and ARIA labels.

## Rationale

"Markup shall be fully semantic with correct ARIA labelling; landmarks, headings, and structure sound." The conformance measure behind it is NFR-WEB-0057.

## Notes

Reclassified from the quality class by DEC-0092: the statement holds only where a system applies it, nothing outside the project imposes it, and it names no measure — so question 4 of `@leafcutter-strict/method-requirement-classification` decides, and it is functional. The number could not be kept: 0012 is taken in the functional class by the `/mitmachen` page row, and in the constraint class it was retired by DEC-0087. The identifier map records the move.
