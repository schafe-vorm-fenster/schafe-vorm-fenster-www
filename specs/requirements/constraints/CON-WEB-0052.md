---
artefact: requirement
id: CON-WEB-0052
class: CON
form: C1
domain: WEB
status: DRAFT
version: 0.1.0
area: technical-constraints
needs: [UNKNOWN]
source:
  source_id: SRC-0001
  loc: "go-to-market-os/concept/website-communication-principles.concept.md#L25"
  excerpt: "`app.schafe-vorm-fenster.de` and are a separate product surface."
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

## Source

SRC-0001#purpose, SRC-0003

Finding: Source states the calendars are a separate product surface (line 24 adds "The village calendars run on"); the prohibition on reimplementing them is an inference, not stated.
