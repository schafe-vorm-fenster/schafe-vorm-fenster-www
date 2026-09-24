---
artefact: requirement
id: FUN-WEB-0189
class: FUN
form: F1
domain: WEB
status: DRAFT
version: 0.1.0
area: forms-and-leads
source:
  source_id: DEC-0051
  loc: "specs/decisions/DEC-0051--envoy-carries-newsletter-and-invoicing.md#L16"
  excerpt: "**Invoicing**: the completed order goes to envoy as a structured event"
evidence_sufficiency: S3
fit_criterion: UNKNOWN
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T17:20:00+02:00"
---

# FUN-WEB-0189

For a completed order, the website SHALL send it to envoy as a structured event.

## Source

DEC-0011, DEC-0051

Finding: DEC-0051 supports it and is named second; DEC-0011 is named first and never mentions envoy or a structured event.

## Notes

From envoy into accounting (DEC-0051).
