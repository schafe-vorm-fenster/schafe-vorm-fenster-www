---
artefact: requirement
id: CON-WEB-0021
class: CON
form: C1
domain: WEB
status: DRAFT
version: 0.1.0
area: delivery-pipeline
needs: [UNKNOWN]
source:
  source_id: DEC-0031
  loc: "specs/decisions/DEC-0031--two-stage-deployment-model.md#L17"
  excerpt: "Actions pipeline modelled on `classification-api` (SRC-0012)"
evidence_sufficiency: S3
fit_criterion: UNKNOWN
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T17:20:00+02:00"
---

# CON-WEB-0021

The solution SHALL gate every merge with a GitHub Actions pipeline modelled on `classification-api`, imposed by DEC-0031.

## Source

DEC-0031

## Notes

The gates, from DEC-0031: typecheck, lint, tests with coverage, dead-code (knip) and duplication (jscpd) checks, a preview deployment per feature branch, merge checks and auto-merge rules. The model repository is SRC-0012.
