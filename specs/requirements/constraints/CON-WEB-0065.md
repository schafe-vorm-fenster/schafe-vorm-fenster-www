---
artefact: requirement
id: CON-WEB-0065
class: CON
form: C1
domain: WEB
status: DRAFT
version: 0.1.0
area: pages
source:
  source_id: DEC-0034
  loc: "specs/decisions/DEC-0034--region-interim-active-examples.md#L11"
  excerpt: "Until the map project lands, the region page shows **no full place"
evidence_sufficiency: S3
fit_criterion:
  scale: "acceptance criteria of CON-WEB-0065 that pass"
  operator: "="
  value: 8
  unit: criteria
  meter: "TS-WEB-0026-A1, TS-WEB-0026-A10, TS-WEB-0026-A11, TS-WEB-0026-A16, TS-WEB-0026-A17, TS-WEB-0026-A2, TS-WEB-0026-A3, TS-WEB-0026-A9 — 6 of 8 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T17:20:00+02:00"
---

# CON-WEB-0065

The solution SHALL NOT render a full place list at county level or above, imposed by DEC-0034.

## Source

DEC-0034

Finding: 'at county level or above' rests on line 12-13 ('a county already has hundreds of places; lists collapse at any / level above the village'), which wraps.
