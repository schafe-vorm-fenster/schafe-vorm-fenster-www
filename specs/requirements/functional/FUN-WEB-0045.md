---
artefact: requirement
id: FUN-WEB-0045
class: FUN
form: F1
domain: WEB
status: DRAFT
version: 0.1.0
area: live-data
source: "SRC-0001#5"
evidence_sufficiency: S2
fit_criterion:
  scale: "acceptance criteria of FUN-WEB-0045 that pass"
  operator: "="
  value: 3
  unit: criteria
  meter: "TS-WEB-0008-A4, TS-WEB-0008-A5, TS-WEB-0008-A6 — 3 of 3 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-09T16:07:54+02:00"
---

# FUN-WEB-0045

When a live module's result is empty, the website SHALL present it as a conversion occasion, never as an error state.
