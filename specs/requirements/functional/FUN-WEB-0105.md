---
artefact: requirement
id: FUN-WEB-0105
class: FUN
form: F1
domain: WEB
status: DRAFT
version: 0.1.0
area: rendering-and-resilience
needs: [NEED-WEB-0005]
source:
  source_id: UNKNOWN
  loc: "UNKNOWN"
  excerpt: "UNKNOWN"
evidence_sufficiency: S1
fit_criterion:
  scale: "acceptance criteria of FUN-WEB-0105 that pass"
  operator: "="
  value: 1
  unit: criteria
  meter: "TS-WEB-0003-A4 — 1 of 1 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T17:20:00+02:00"
---

# FUN-WEB-0105

For every module and page type, the website SHALL use the cache lifetime of TS-WEB-0003 D5.

## Source

DEC-0019

Unlocatable: Confirmed: the source list is DEC-0019 alone, and DEC-0019 names the three tiers and their stale-while-revalidate mapping but no cache lifetime, no per-module/page-type table and no TS-WEB-0003 D5.

Finding: Nothing later is cited, so there is no second record to fall back to; the lifetime table lives in the tactical spec TS-WEB-0003, which this requirement does not cite.

## Notes

The statement carried `UNKNOWN` until the tactical layer set the values; TS-WEB-0003 D5 now holds the table, so the requirement names it rather than the gap.
