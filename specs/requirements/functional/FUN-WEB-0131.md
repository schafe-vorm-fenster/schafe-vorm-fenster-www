---
artefact: requirement
id: FUN-WEB-0131
class: FUN
form: F1
domain: WEB
status: DRAFT
version: 0.1.0
area: technical-constraints
needs: [NEED-WEB-0001]
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

For calendar data, the website SHALL embed what the village calendars serve rather than hold its own.

## Source

SRC-0001#purpose, SRC-0003

Finding: "rather than hold its own" is not on this line; the nearest support is line 25 ("a separate product surface").

Deviation: `go-to-market-os/concept/website-communication-principles.concept.md#L25` places the village calendars on `app.schafe-vorm-fenster.de`, which has no DNS record; they run on the apex (DEC-0168 §5), and every link to the app goes to the Schlatkow village calendar until the app has its own domain (DEC-0177). The statement no longer names a host. The specification carries the truth (DEC-0104 §1); DEM-0076 asks the source to follow.

## Notes

The persistent header entry to the calendars is FUN-WEB-0137.
