---
artefact: requirement
id: FUN-WEB-0063
class: FUN
form: F1
domain: WEB
status: DRAFT
version: 0.1.0
area: localization
needs: [UNKNOWN]
source:
  source_id: SRC-0007
  loc: "community-calendar/docs/localization-architecture.md#L58"
  excerpt: "Both are standard `<a href=\"...\">` link navigations — no client-side JavaScript required."
evidence_sufficiency: S3
fit_criterion:
  scale: "acceptance criteria of FUN-WEB-0063 that pass"
  operator: "="
  value: 1
  unit: criteria
  meter: "TS-WEB-0001-A7 — 1 of 1 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-09T16:07:54+02:00"
---

# FUN-WEB-0063

When the visitor switches language or country, the website SHALL do it as plain link navigation (prefix change / TLD change).

## Source

SRC-0007, DEC-0005
