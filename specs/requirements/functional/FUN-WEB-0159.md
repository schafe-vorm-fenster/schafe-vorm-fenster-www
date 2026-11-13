---
artefact: requirement
id: FUN-WEB-0159
class: FUN
form: F1
domain: WEB
status: DRAFT
version: 0.1.0
area: place-search
needs: [NEED-WEB-0004, NEED-WEB-0009]
source:
  source_id: DEC-0024
  loc: "specs/decisions/DEC-0024--place-search-covers-germany.md#L42"
  excerpt: "`/dein-ort/starten` on submit, which is point 2 working as intended."
evidence_sufficiency: S3
fit_criterion:
  scale: "acceptance criteria of FUN-WEB-0159 that pass"
  operator: "="
  value: 3
  unit: criteria
  meter: "TS-WEB-0021-A14, TS-WEB-0021-A2, TS-WEB-0021-A9 — 3 of 3 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T17:20:00+02:00"
---

# FUN-WEB-0159

For a typed name that matches nothing, the place search SHALL reach `/dein-ort/starten` on submit with the raw query as `?ort=`.

### Source

DEC-0024, DEC-0036, DEC-0037, DEC-0079

## Rationale

A name that matches nothing yields no suggestion and is not an error, so the search never answers a visitor with silence and never asks her to type something else.
