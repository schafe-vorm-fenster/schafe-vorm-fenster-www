---
artefact: requirement
id: CON-WEB-0032
class: CON
form: C1
domain: WEB
status: DRAFT
version: 0.1.0
area: security
source: "DEC-0015"
evidence_sufficiency: S3
fit_criterion:
  scale: "acceptance criteria of CON-WEB-0032 that pass"
  operator: "="
  value: 2
  unit: criteria
  meter: "TS-WEB-0014-A2, TS-WEB-0014-A5 — 1 of 2 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T16:45:00+02:00"
---

# CON-WEB-0032

The solution SHALL set the security headers of TS-WEB-0014 D4 on every production response, imposed by DEC-0015.

## Notes

Reclassified from the quality class by DEC-0092. The five headers — HSTS, `frame-ancestors`, referrer-policy, `X-Content-Type-Options`, permissions-policy — are the object of one predicate, and their values live in TS-WEB-0014 D4 rather than here. TS-WEB-0014-A2 asserts them on every production response. The number was free in the constraint class and is kept.
