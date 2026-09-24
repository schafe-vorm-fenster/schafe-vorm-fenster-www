---
artefact: requirement
id: CON-WEB-0062
class: CON
form: C1
domain: WEB
status: DRAFT
version: 0.1.0
area: place-search
source:
  source_id: DEC-0037
  loc: "specs/decisions/DEC-0037--no-place-slugs-on-the-website.md#L11"
  excerpt: "No website path ever contains a place slug."
evidence_sufficiency: S3
fit_criterion:
  scale: "acceptance criteria of CON-WEB-0062 that pass"
  operator: "="
  value: 1
  unit: criteria
  meter: "TS-WEB-0004-A10 — 1 of 1 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T17:20:00+02:00"
---

# CON-WEB-0062

The solution SHALL NOT put a place slug in a website path, imposed by DEC-0037.

## Source

DEC-0037

## Rationale

Place-specific paths belong to the app alone.
