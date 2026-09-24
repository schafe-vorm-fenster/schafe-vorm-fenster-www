---
artefact: requirement
id: CON-WEB-0070
class: CON
form: C1
domain: WEB
status: DRAFT
version: 0.1.0
area: place-search
source:
  source_id: DEC-0079
  loc: "specs/decisions/DEC-0079--place-search-by-name.md#L44"
  excerpt: "The website searches places by name. A postcode is not offered as a"
evidence_sufficiency: S3
fit_criterion:
  scale: "acceptance criteria of CON-WEB-0070 that pass"
  operator: "="
  value: 5
  unit: criteria
  meter: "TS-WEB-0008-A1, TS-WEB-0008-A14, TS-WEB-0008-A15, TS-WEB-0008-A16, TS-WEB-0008-A7 — 2 of 5 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T17:20:00+02:00"
---

# CON-WEB-0070

The solution SHALL NOT offer a postcode as a product feature, imposed by DEC-0079.

## Source

DEC-0079, DEC-0024

Finding: 'product feature.' continues on line 45.

## Rationale

Not as an input mode, not in the label, the placeholder, a helper text or page copy.
