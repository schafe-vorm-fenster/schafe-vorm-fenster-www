---
artefact: requirement
id: FUN-WEB-0164
class: FUN
form: F1
domain: WEB
status: DRAFT
version: 0.1.0
area: localization
source:
  source_id: SRC-0007
  loc: "community-calendar/docs/domains.md#L56"
  excerpt: "If a language prefix exists in the URL path (e.g., `/en/...`), it overrides the TLD default"
evidence_sufficiency: S3
fit_criterion:
  scale: "acceptance criteria of FUN-WEB-0164 that pass"
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

# FUN-WEB-0164

Where a URL carries a path prefix such as `/en/`, the website SHALL let it override the TLD default.

## Source

SRC-0007, DEC-0005
