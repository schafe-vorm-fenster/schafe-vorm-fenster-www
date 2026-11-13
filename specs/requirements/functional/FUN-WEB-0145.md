---
artefact: requirement
id: FUN-WEB-0145
class: FUN
form: F1
domain: WEB
status: DRAFT
version: 0.1.0
area: pages
needs: [NEED-WEB-0002]
source:
  source_id: DEC-0032
  loc: "specs/decisions/DEC-0032--error-pages.md#L11"
  excerpt: "**404**: real status 404, `noindex`"
evidence_sufficiency: S3
fit_criterion:
  scale: "acceptance criteria of FUN-WEB-0145 that pass"
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

# FUN-WEB-0145

For an unknown path, the website SHALL answer with status 404 and `noindex`.

## Source

DEC-0032
