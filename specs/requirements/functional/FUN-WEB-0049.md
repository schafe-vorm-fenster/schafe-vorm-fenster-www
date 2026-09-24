---
artefact: requirement
id: FUN-WEB-0049
class: FUN
form: F1
domain: WEB
status: DRAFT
version: 0.1.0
area: place-search
needs: [NEED-WEB-0002]
source:
  source_id: DEC-0029
  loc: "specs/decisions/DEC-0029--app-handover-via-slugs.md#L12"
  excerpt: "built from geo-api community slugs"
evidence_sufficiency: S3
fit_criterion:
  scale: "acceptance criteria of FUN-WEB-0049 that pass"
  operator: "="
  value: 1
  unit: criteria
  meter: "TS-WEB-0008-A11 — 1 of 1 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T17:20:00+02:00"
---

# FUN-WEB-0049

For a handover link into the app, the website SHALL build it from a geo-api community slug (`/api/{token}/community/slug/{slug}`).

## Source

DEC-0029

Finding: DEC-0029 names geo-api community slugs as the contract but does not contain the endpoint path `/api/{token}/community/slug/{slug}` the requirement quotes.

## Notes

The only current contract. Registration prefill has none and stays a demand to the app.
