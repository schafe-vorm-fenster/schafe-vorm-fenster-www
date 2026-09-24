---
artefact: requirement
id: FUN-WEB-0152
class: FUN
form: F1
domain: WEB
status: DRAFT
version: 0.1.0
area: forms-and-leads
source: "DEC-0010, DEC-0081"
evidence_sufficiency: S3
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T17:20:00+02:00"
---

# FUN-WEB-0152

On every row of the contact section, the website SHALL carry `make-contact` as an intent, counted per channel and with the route.

## Rationale

Three of the four rows hand the visitor to another application, so the contact itself is not observable; what the website can honestly count is the intent.
