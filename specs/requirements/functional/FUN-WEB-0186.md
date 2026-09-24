---
artefact: requirement
id: FUN-WEB-0186
class: FUN
form: F1
domain: WEB
status: DRAFT
version: 0.1.0
area: forms-and-leads
source: "DEC-0051, DEC-0052"
evidence_sufficiency: S3
fit_criterion:
  scale: "acceptance criteria of FUN-WEB-0186 that pass"
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

# FUN-WEB-0186

For newsletter signup, the website SHALL offer both channels — e-mail and WhatsApp, WhatsApp preferred — carrying `subscribe-to-newsletter`.

## Rationale

A surface offering e-mail only does not satisfy the goal (DEC-0052 §4 as amended).
