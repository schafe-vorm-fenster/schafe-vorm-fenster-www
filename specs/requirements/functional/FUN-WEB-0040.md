---
artefact: requirement
id: FUN-WEB-0040
class: FUN
form: F1
domain: WEB
status: DRAFT
version: 0.1.0
area: live-data
needs: [NEED-WEB-0001]
source:
  source_id: SRC-0001
  loc: "go-to-market-os/concept/website-communication-principles.concept.md#L261"
  excerpt: "The website embeds live data from the app wherever it proves something:"
evidence_sufficiency: S2
fit_criterion:
  scale: "acceptance criteria of FUN-WEB-0040 that pass"
  operator: "="
  value: 4
  unit: criteria
  meter: "TS-WEB-0008-A14, TS-WEB-0008-A2, TS-WEB-0008-A4, TS-WEB-0008-A9 — 4 of 4 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-09T16:07:54+02:00"
---

# FUN-WEB-0040

Wherever live data proves something — place search, "this week nearby", active places, embedded customer calendar, live counters — the website SHALL embed it from the app.

## Source

SRC-0001#5-live-data-carries-the-argument

Finding: The enumerated modules (place search, "on this week nearby", active places, embedded customer calendar, live counters) follow on lines 262-263.
