---
artefact: requirement
id: FUN-WEB-0139
class: FUN
form: F1
domain: WEB
status: DRAFT
version: 0.1.0
area: pages
needs: [NEED-WEB-0007]
source:
  source_id: SRC-0003
  loc: "go-to-market-os/concept/website-information-architecture.concept.md#L227"
  excerpt: "| Conversion goal | Pages that carry it |"
evidence_sufficiency: S2
fit_criterion:
  scale: "acceptance criteria of FUN-WEB-0139 that pass"
  operator: "="
  value: 1
  unit: criteria
  meter: "TS-WEB-0006-A11 — 1 of 1 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T17:20:00+02:00"
---

# FUN-WEB-0139

For every conversion goal of the map in SRC-0003, the website SHALL carry it on the page that map names.

## Source

SRC-0003#conversion-map, DEC-0052, DEC-0081

Finding: The heading of the map table is the claim; the goal-to-page assignments are lines 229–235.

## Notes

Two goals are carried by standing surfaces rather than by a page and are primary for none: `make-contact` on every row of the contact section (FUN-WEB-0152) and `subscribe-to-newsletter` in the footer and the `/ueber-uns` block (FUN-WEB-0140, DEC-0052 §4 as amended).
