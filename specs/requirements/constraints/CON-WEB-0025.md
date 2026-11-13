---
artefact: requirement
id: CON-WEB-0025
class: CON
form: C1
domain: WEB
status: DRAFT
version: 0.1.0
area: accessibility
needs: [NEED-WEB-0006]
source:
  source_id: SRC-0006
  loc: "UNKNOWN"
  excerpt: "UNKNOWN"
evidence_sufficiency: S3
fit_criterion:
  scale: "acceptance criteria of CON-WEB-0025 that pass"
  operator: "="
  value: 1
  unit: criteria
  meter: "TS-WEB-0002-A3 — 1 of 1 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T16:45:00+02:00"
---

# CON-WEB-0025

The solution SHALL use the accessible colour variant wherever a brand colour misses its ratio, imposed by DEC-0056.

## Source

SRC-0006, SRC-0014#accessibility, DEC-0056

Unlocatable: Transcript mentions colour contrast in general ("Farbenkontraste, logisch") but never an accessible colour variant to substitute when a brand colour misses its ratio.

Finding: The substance of this statement comes from DEC-0056, not from SRC-0006.
