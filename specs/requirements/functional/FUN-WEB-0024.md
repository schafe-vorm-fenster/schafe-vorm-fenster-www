---
artefact: requirement
id: FUN-WEB-0024
class: FUN
form: F1
domain: WEB
status: DRAFT
version: 0.1.0
area: relevance-and-proof
needs: [NEED-WEB-0018, NEED-WEB-0027]
source:
  source_id: DEC-0024
  loc: "specs/decisions/DEC-0024--place-search-covers-germany.md#L18"
  excerpt: "Proof elements that reference places are drawn only from covered"
evidence_sufficiency: S3
fit_criterion: UNKNOWN
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T17:20:00+02:00"
---

# FUN-WEB-0024

For a place-bound proof element, the website SHALL draw it only from a covered place.

## Source

DEC-0024

## Rationale

A coverage gap is never illustrated with an invented or uncovered example. Covered means a place with data in events-api.

## Notes

Reference calendars, local events and place flyers are place-bound (DEC-0024).
