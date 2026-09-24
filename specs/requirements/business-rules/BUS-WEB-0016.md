---
artefact: requirement
id: BUS-WEB-0016
class: BUS
form: B1
domain: WEB
status: DRAFT
version: 0.1.0
area: pages
source:
  source_id: SRC-0003
  loc: "go-to-market-os/concept/website-information-architecture.concept.md#L198"
  excerpt: "request with a two-working-day promise"
evidence_sufficiency: S2
fit_criterion:
  scale: "acceptance criteria of BUS-WEB-0016 that pass"
  operator: "="
  value: 3
  unit: criteria
  meter: "TS-WEB-0006-A13, TS-WEB-0026-A7, TS-WEB-0026-A8 — 2 of 3 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T17:40:00+02:00"
---

# BUS-WEB-0016

For a quote request, the answer is due within two working days of its receipt.

## Source

SRC-0003#for-a-whole-region

## Rationale

An operational commitment with no system subject: it binds whoever handles the lead. The lead-handling process behind the envoy widget (FUN-WEB-0183) has to be able to keep it, which is flagged to envoy and ops as part of Q-0022.

## Notes

Applied on the website by FUN-WEB-0203.
