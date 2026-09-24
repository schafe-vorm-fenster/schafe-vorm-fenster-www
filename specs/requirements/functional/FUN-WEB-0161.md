---
artefact: requirement
id: FUN-WEB-0161
class: FUN
form: F1
domain: WEB
status: DRAFT
version: 0.1.0
area: personalization
source:
  source_id: SRC-0006
  loc: "UNKNOWN"
  excerpt: "UNKNOWN"
evidence_sufficiency: S2
fit_criterion:
  scale: "acceptance criteria of FUN-WEB-0161 that pass"
  operator: "="
  value: 2
  unit: criteria
  meter: "TS-WEB-0010-A2, TS-WEB-0010-A8 — 1 of 2 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T17:20:00+02:00"
---

# FUN-WEB-0161

For browser geolocation, the website SHALL ask only after an interaction.

## Source

SRC-0006 (transcript), SRC-0001#6

Unlocatable: Transcript never mentions the browser geolocation API or asking after an interaction.

Finding: The interaction-gated browser permission prompt is not in SRC-0006.
