---
artefact: requirement
id: FUN-WEB-0027
class: FUN
form: F1
domain: WEB
status: DRAFT
version: 0.1.0
area: pages
source:
  source_id: DEC-0032
  loc: "specs/decisions/DEC-0032--error-pages.md#L16"
  excerpt: "**500**: statically pre-rendered, minimal"
evidence_sufficiency: S3
fit_criterion:
  scale: "acceptance criteria of FUN-WEB-0027 that pass"
  operator: "="
  value: 1
  unit: criteria
  meter: "TS-WEB-0004-A4 — 1 of 1 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-10T13:40:06+02:00"
---

# FUN-WEB-0027

For the 500 page, the website SHALL serve a statically pre-rendered, minimal page — no live modules, no search, nothing that can itself fail.

## Source

DEC-0032

Finding: 'no live modules, no search, nothing that can itself fail' is on the following line 17.
