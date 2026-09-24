---
artefact: requirement
id: FUN-WEB-0140
class: FUN
form: F1
domain: WEB
status: DRAFT
version: 0.1.0
area: pages
needs: [NEED-WEB-0011, NEED-WEB-0024]
source:
  source_id: SRC-0003
  loc: "go-to-market-os/concept/website-information-architecture.concept.md#L35"
  excerpt: "Contact and newsletter live in the footer"
evidence_sufficiency: S3
fit_criterion:
  scale: "acceptance criteria of FUN-WEB-0140 that pass"
  operator: "="
  value: 1
  unit: criteria
  meter: "TS-WEB-0004-A9 — 1 of 1 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T17:20:00+02:00"
---

# FUN-WEB-0140

In the footer, the website SHALL carry the newsletter entry with the goal `subscribe-to-newsletter`.

## Source

SRC-0003#navigation, DEC-0012, DEC-0039, DEC-0052, DEC-0081

Finding: SRC-0003 never names the goal `subscribe-to-newsletter` (it is absent from the conversion map), and line 243 still lists footer-only placement as an open point.

## Notes

The entry offers both channels; the channel rule is FUN-WEB-0186.
