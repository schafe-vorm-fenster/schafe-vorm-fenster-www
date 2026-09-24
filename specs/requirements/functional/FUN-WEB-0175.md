---
artefact: requirement
id: FUN-WEB-0175
class: FUN
form: F1
domain: WEB
status: DRAFT
version: 0.1.0
area: content-pipeline
source:
  source_id: SRC-0006
  loc: "UNKNOWN"
  excerpt: "UNKNOWN"
evidence_sufficiency: S2
fit_criterion:
  scale: "acceptance criteria of FUN-WEB-0175 that pass"
  operator: "="
  value: 2
  unit: criteria
  meter: "TS-WEB-0007-A15, TS-WEB-0007-A2 — 1 of 2 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T17:20:00+02:00"
---

# FUN-WEB-0175

On a package publish, the hub SHALL fire a `repository_dispatch` at this repository.

## Source

SRC-0006, SRC-0009

Unlocatable: Transcript never mentions repository_dispatch, webhooks, or any publish-time trigger from the hub.

Finding: `repository_dispatch` is a technical term absent from SRC-0006; it appears to come from SRC-0009.

## Notes

DEC-0050, closing ADR-001's open question 1.
