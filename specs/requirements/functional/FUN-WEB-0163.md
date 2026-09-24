---
artefact: requirement
id: FUN-WEB-0163
class: FUN
form: F1
domain: WEB
status: DRAFT
version: 0.1.0
area: localization
needs: [UNKNOWN]
source:
  source_id: SRC-0007
  loc: "community-calendar/docs/domains.md#L5"
  excerpt: "The hostname's TLD determines the default language"
evidence_sufficiency: S3
fit_criterion:
  scale: "acceptance criteria of FUN-WEB-0163 that pass"
  operator: "="
  value: 2
  unit: criteria
  meter: "TS-WEB-0001-A1, TS-WEB-0001-A2 — 2 of 2 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T17:20:00+02:00"
---

# FUN-WEB-0163

For the default language, the website SHALL take it from the country TLD.

## Source

SRC-0007, DEC-0005
