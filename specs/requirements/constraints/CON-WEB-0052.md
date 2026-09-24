---
artefact: requirement
id: CON-WEB-0052
class: CON
form: C1
domain: WEB
status: DRAFT
version: 0.1.0
area: technical-constraints
source: "SRC-0001#purpose, SRC-0003"
evidence_sufficiency: S2
fit_criterion:
  scale: "acceptance criteria of CON-WEB-0052 that pass"
  operator: "="
  value: 3
  unit: criteria
  meter: "TS-WEB-0017-A10, TS-WEB-0017-A11, TS-WEB-0017-A12 — 3 of 3 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T17:20:00+02:00"
---

# CON-WEB-0052

The solution SHALL NOT reimplement the village calendars, which run on `app.schafe-vorm-fenster.de`, imposed by SRC-0001 "Purpose".
