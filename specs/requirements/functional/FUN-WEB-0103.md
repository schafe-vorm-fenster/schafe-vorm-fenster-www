---
artefact: requirement
id: FUN-WEB-0103
class: FUN
form: F1
domain: WEB
status: DRAFT
version: 0.1.0
area: rendering-and-resilience
source: "DEC-0019"
evidence_sufficiency: S3
fit_criterion:
  scale: "acceptance criteria of FUN-WEB-0103 that pass"
  operator: "="
  value: 3
  unit: criteria
  meter: "TS-WEB-0009-A12, TS-WEB-0009-A4, TS-WEB-0009-A7 — 2 of 3 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-09T16:07:54+02:00"
---

# FUN-WEB-0103

On empty cache, the website SHALL serve a build-time snapshot.

## Rationale

So that every module always has content.

## Notes

Tier 3 of the three-tier resilience model.
