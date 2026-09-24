---
artefact: requirement
id: CON-WEB-0023
class: CON
form: C1
domain: WEB
status: DRAFT
version: 0.1.0
area: delivery-pipeline
source: "DEC-0031"
evidence_sufficiency: S3
fit_criterion:
  scale: "acceptance criteria of CON-WEB-0023 that pass"
  operator: "="
  value: 3
  unit: criteria
  meter: "TS-WEB-0015-A1, TS-WEB-0015-A11, TS-WEB-0015-A2 — 1 of 3 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T17:20:00+02:00"
---

# CON-WEB-0023

The solution SHALL carry deployment protection and `noindex` on every non-production deployment, imposed by DEC-0031.

## Rationale

No preview content reaches a search engine.
