---
artefact: requirement
id: CON-WEB-0078
class: CON
form: C1
domain: WEB
status: DRAFT
version: 0.1.0
area: content-pipeline
source: "SRC-0006, DEC-0020"
evidence_sufficiency: S3
fit_criterion:
  scale: "acceptance criteria of CON-WEB-0078 that pass"
  operator: "="
  value: 2
  unit: criteria
  meter: "TS-WEB-0007-A12, TS-WEB-0007-A5 — 2 of 2 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T17:20:00+02:00"
---

# CON-WEB-0078

The solution SHALL NOT read content from the hub at request time, imposed by DEC-0020.

## Rationale

Build and runtime — dynamic loading, geo-based selection — read exclusively from the local files.
