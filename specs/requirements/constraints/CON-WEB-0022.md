---
artefact: requirement
id: CON-WEB-0022
class: CON
form: C1
domain: WEB
status: DRAFT
version: 0.1.0
area: delivery-pipeline
needs: [UNKNOWN]
source:
  source_id: DEC-0031
  loc: "specs/decisions/DEC-0031--two-stage-deployment-model.md#L20"
  excerpt: "deployment, e2e execution with rollout-or-rollback decision for"
evidence_sufficiency: S3
fit_criterion: UNKNOWN
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T17:20:00+02:00"
---

# CON-WEB-0022

The solution SHALL promote to production as a rolling deployment gated by e2e execution with an explicit rollout-or-rollback decision, imposed by DEC-0031.

## Source

DEC-0031
