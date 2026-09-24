---
artefact: requirement
id: CON-WEB-0021
class: CON
form: C0
domain: WEB
status: DRAFT
version: 0.1.0
area: delivery-pipeline
source: "DEC-0031"
evidence_sufficiency: S3
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-10T13:40:06+02:00"
---

# CON-WEB-0021

Operation stage: a GitHub Actions pipeline modelled on `classification-api` (SRC-0012) shall gate every merge — typecheck, lint, tests with coverage, dead-code (knip) and duplication (jscpd) checks, preview deployment per feature branch, merge checks and auto-merge rules.
