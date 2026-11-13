---
artefact: requirement
id: FUN-WEB-0113
class: FUN
form: F1
domain: WEB
status: DRAFT
version: 0.1.0
area: performance
needs: [NEED-WEB-0005, NEED-WEB-0014]
source:
  source_id: SRC-0007
  loc: "community-calendar/docs/performance-budget.md#L40"
  excerpt: "**Images**: Lazy load below-fold, eager load hero images"
evidence_sufficiency: S2
fit_criterion:
  scale: "acceptance criteria of FUN-WEB-0113 that pass"
  operator: "="
  value: 1
  unit: criteria
  meter: "TS-WEB-0003-A8 — 1 of 1 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T16:45:00+02:00"
---

# FUN-WEB-0113

For the LCP element a page declares in TS-WEB-0003 D2, the website SHALL load it eagerly at high fetch priority.

## Source

SRC-0007

Finding: The line supports eager loading, but of "hero images", not of a declared LCP element, and neither `fetchpriority` nor any notion of fetch priority occurs anywhere in the three documents.
