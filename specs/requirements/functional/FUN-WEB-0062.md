---
artefact: requirement
id: FUN-WEB-0062
class: FUN
form: F1
domain: WEB
status: DRAFT
version: 0.1.0
area: localization
source:
  source_id: SRC-0007
  loc: "community-calendar/docs/localization-architecture.md#L38"
  excerpt: "There is no middleware, no cookies, no sessionStorage, and no `Accept-Language` inspection at render time."
evidence_sufficiency: S3
fit_criterion:
  scale: "acceptance criteria of FUN-WEB-0062 that pass"
  operator: "="
  value: 1
  unit: criteria
  meter: "TS-WEB-0001-A8 — 1 of 1 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-09T16:07:54+02:00"
---

# FUN-WEB-0062

For every request, the website SHALL determine the locale entirely server-side — no middleware state, no cookies, no `Accept-Language` at render time.

## Source

SRC-0007, DEC-0005

## Notes

The URL is the preference.
