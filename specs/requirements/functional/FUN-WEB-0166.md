---
artefact: requirement
id: FUN-WEB-0166
class: FUN
form: F1
domain: WEB
status: DRAFT
version: 0.1.0
area: localization
source:
  source_id: SRC-0007
  loc: "community-calendar/docs/localization-architecture.md#L76"
  excerpt: "(non-default language paths need the prefix; default language paths are bare)"
evidence_sufficiency: S3
fit_criterion:
  scale: "acceptance criteria of FUN-WEB-0166 that pass"
  operator: "="
  value: 3
  unit: criteria
  meter: "TS-WEB-0001-A1, TS-WEB-0001-A2, TS-WEB-0001-A7 — 3 of 3 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T17:20:00+02:00"
---

# FUN-WEB-0166

Where the language differs from the TLD default, the website SHALL emit the path prefix, and otherwise SHALL NOT.

## Source

SRC-0007, DEC-0005
