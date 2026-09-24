---
artefact: requirement
id: FUN-WEB-0146
class: FUN
form: F1
domain: WEB
status: DRAFT
version: 0.1.0
area: pages
source:
  source_id: DEC-0039
  loc: "specs/decisions/DEC-0039--legal-as-one-page.md#L11"
  excerpt: "All legal content lives on **one** route"
evidence_sufficiency: S3
fit_criterion:
  scale: "acceptance criteria of FUN-WEB-0146 that pass"
  operator: "="
  value: 10
  unit: criteria
  meter: "TS-WEB-0029-A1, TS-WEB-0029-A14, TS-WEB-0029-A15, TS-WEB-0029-A2, TS-WEB-0029-A3, TS-WEB-0029-A4, TS-WEB-0029-A5, TS-WEB-0029-A6, TS-WEB-0029-A7, TS-WEB-0029-A9 — 8 of 10 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T17:20:00+02:00"
---

# FUN-WEB-0146

For legal content, the website SHALL serve one route `/rechtliches` (EN `/legal`) as a long page with on-page navigation and the anchors of the registry in TS-WEB-0004 D8.

## Source

DEC-0039

Finding: The anchors are on lines 12-13; DEC-0039 does not reference the TS-WEB-0004 D8 registry.

## Notes

The footer links that point at those anchors are FUN-WEB-0141.
