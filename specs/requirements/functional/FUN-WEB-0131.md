---
artefact: requirement
id: FUN-WEB-0131
class: FUN
form: F1
domain: WEB
status: DRAFT
version: 0.1.0
area: technical-constraints
source:
  source_id: SRC-0001
  loc: "go-to-market-os/concept/website-communication-principles.concept.md#L261"
  excerpt: "The website embeds live data from the app wherever it proves something:"
evidence_sufficiency: S2
fit_criterion:
  scale: "acceptance criteria of FUN-WEB-0131 that pass"
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

# FUN-WEB-0131

For calendar data, the website SHALL embed what `app.schafe-vorm-fenster.de` serves rather than hold its own.

## Source

SRC-0001#purpose, SRC-0003

Finding: "rather than hold its own" is not on this line; the nearest support is line 25 ("a separate product surface").

## Notes

The persistent header entry to the calendars is FUN-WEB-0137.
