---
artefact: requirement
id: FUN-WEB-0202
class: FUN
form: F1
domain: WEB
status: DRAFT
version: 0.1.0
area: pages
source: "SRC-0003, DEC-0060, DEC-0052"
evidence_sufficiency: S3
fit_criterion:
  scale: "acceptance criteria of FUN-WEB-0202 that pass"
  operator: "="
  value: 5
  unit: criteria
  meter: "TS-WEB-0006-A12, TS-WEB-0024-A10, TS-WEB-0024-A11, TS-WEB-0024-A18, TS-WEB-0024-A8 — 5 of 5 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T17:40:00+02:00"
---

# FUN-WEB-0202

On `/dein-kalender`, the website SHALL publish the licence price of 480 €/year for a configured calendar on the organisation's own website.

## Notes

Applies BUS-WEB-0015. The enterprise price is not published — BUS-WEB-0013 and FUN-WEB-0201. An offering carrying `promotion: withheld` is not offered at all (CON-WEB-0015).
