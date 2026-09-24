---
artefact: requirement
id: CON-WEB-0064
class: CON
form: C1
domain: WEB
status: DRAFT
version: 0.1.0
area: pages
source:
  source_id: DEC-0032
  loc: "specs/decisions/DEC-0032--error-pages.md#L13"
  excerpt: "fuzzy place-slug guessing on arbitrary paths"
evidence_sufficiency: S3
fit_criterion:
  scale: "acceptance criteria of CON-WEB-0064 that pass"
  operator: "="
  value: 1
  unit: criteria
  meter: "TS-WEB-0004-A4 — 1 of 1 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T17:20:00+02:00"
---

# CON-WEB-0064

The solution SHALL NOT guess a place slug from an unknown path, imposed by DEC-0032.

## Source

DEC-0032

Finding: The sentence begins with 'No' at the end of line 12; only the part on line 13 is quoted.
