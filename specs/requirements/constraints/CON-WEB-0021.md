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
---

# CON-WEB-0021

Operation stage: a GitHub Actions pipeline modelled on `classification-api` (SRC-0012) shall gate every merge — typecheck, lint, tests with coverage, dead-code (knip) and duplication (jscpd) checks, preview deployment per feature branch, merge checks and auto-merge rules.
