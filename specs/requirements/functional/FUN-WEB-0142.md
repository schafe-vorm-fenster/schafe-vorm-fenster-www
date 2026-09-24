---
artefact: requirement
id: FUN-WEB-0142
class: FUN
form: F1
domain: WEB
status: DRAFT
version: 0.1.0
area: place-search
source:
  source_id: DEC-0037
  loc: "specs/decisions/DEC-0037--no-place-slugs-on-the-website.md#L14"
  excerpt: "the place travels as a **query parameter**"
evidence_sufficiency: S3
fit_criterion:
  scale: "acceptance criteria of FUN-WEB-0142 that pass"
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

# FUN-WEB-0142

On the website, a place SHALL travel as the query parameter `?ort=<slug>`.

## Source

DEC-0037

Finding: DEC-0037 says 'query parameter' but never names the parameter `?ort=<slug>`; the concrete `?ort=` spelling appears only in DEC-0079 (lines 70, 131).
