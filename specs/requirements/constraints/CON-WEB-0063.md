---
artefact: requirement
id: CON-WEB-0063
class: CON
form: C1
domain: WEB
status: DRAFT
version: 0.1.0
area: content-pipeline
needs: [UNKNOWN]
source:
  source_id: DEC-0026
  loc: "specs/decisions/DEC-0026--localize-everything-but-artifacts.md#L16"
  excerpt: "nothing is machine-translated at request time."
evidence_sufficiency: S3
fit_criterion:
  scale: "acceptance criteria of CON-WEB-0063 that pass"
  operator: "="
  value: 2
  unit: criteria
  meter: "TS-WEB-0007-A12, TS-WEB-0007-A9 — 1 of 2 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T17:20:00+02:00"
---

# CON-WEB-0063

The solution SHALL NOT machine-translate at request time, imposed by DEC-0026.

## Source

DEC-0026
