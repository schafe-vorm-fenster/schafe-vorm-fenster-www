---
artefact: requirement
id: FUN-WEB-0002
class: FUN
form: F1
domain: WEB
status: DRAFT
version: 0.1.0
area: jobs-and-navigation
needs: [NEED-WEB-0007, NEED-WEB-0008]
source:
  source_id: SRC-0001
  loc: "go-to-market-os/concept/website-communication-principles.concept.md#L59"
  excerpt: "Navigation labels name jobs, never audiences and never product names."
evidence_sufficiency: S2
fit_criterion:
  scale: "acceptance criteria of FUN-WEB-0002 that pass"
  operator: "="
  value: 1
  unit: criteria
  meter: "TS-WEB-0004-A8 — 1 of 1 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-09T16:07:54+02:00"
---

# FUN-WEB-0002

In navigation, the website SHALL label every target with its job — never with an audience and never with a product name.

## Source

SRC-0001#1, SRC-0003#navigation

## Notes

The four labels and their targets are defined in SRC-0003 "Navigation".
