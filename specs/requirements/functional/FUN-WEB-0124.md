---
artefact: requirement
id: FUN-WEB-0124
class: FUN
form: F1
domain: WEB
status: DRAFT
version: 0.1.0
area: privacy
needs: [NEED-WEB-0017, NEED-WEB-0022, NEED-WEB-0029]
source:
  source_id: SRC-0006
  loc: "UNKNOWN"
  excerpt: "Und das steht auch, das müssen wir auch rausextrahieren aus der jetzigen Webseite."
evidence_sufficiency: S3
fit_criterion:
  scale: "acceptance criteria of FUN-WEB-0124 that pass"
  operator: "="
  value: 3
  unit: criteria
  meter: "TS-WEB-0012-A10, TS-WEB-0012-A3, TS-WEB-0012-A9 — 2 of 3 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T16:45:00+02:00"
---

# FUN-WEB-0124

Before launch, the release owner SHALL extract the eTracker configuration from the legacy site.

## Source

SRC-0006, DEC-0004, DEC-0028

Unlocatable: the transcript is one line with no line terminators, so it supports no position scheme.
