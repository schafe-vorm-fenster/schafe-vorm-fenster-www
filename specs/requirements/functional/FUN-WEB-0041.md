---
artefact: requirement
id: FUN-WEB-0041
class: FUN
form: F1
domain: WEB
status: DRAFT
version: 0.1.0
area: live-data
needs: [NEED-WEB-0025]
source:
  source_id: SRC-0001
  loc: "go-to-market-os/concept/website-communication-principles.concept.md#L267"
  excerpt: "Traction figures are counted live or not shown. Static figures are"
evidence_sufficiency: S2
fit_criterion:
  scale: "acceptance criteria of FUN-WEB-0041 that pass"
  operator: "="
  value: 2
  unit: criteria
  meter: "TS-WEB-0008-A10, TS-WEB-0008-A9 — 2 of 2 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T17:20:00+02:00"
---

# FUN-WEB-0041

For a traction figure, the website SHALL count it live or not show it at all.

## Source

SRC-0001#5

## Rationale

A static figure is forbidden; `proof/reach-and-usage.proof.md` is `expired` for exactly this reason.
