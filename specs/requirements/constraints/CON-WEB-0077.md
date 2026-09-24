---
artefact: requirement
id: CON-WEB-0077
class: CON
form: C1
domain: WEB
status: DRAFT
version: 0.1.0
area: content-pipeline
source:
  source_id: SRC-0009
  loc: "go-to-market-os/handbook/decisions/001-content-source-of-truth.adr.md#L108"
  excerpt: "The website repository deletes its duplicates rather than syncing them."
evidence_sufficiency: S3
fit_criterion:
  scale: "acceptance criteria of CON-WEB-0077 that pass"
  operator: "="
  value: 2
  unit: criteria
  meter: "TS-WEB-0007-A7, TS-WEB-0007-A8 — 2 of 2 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T17:20:00+02:00"
---

# CON-WEB-0077

The solution SHALL NOT copy raw hub content into this repository, imposed by SRC-0009 ADR-001.

## Source

SRC-0009 ADR-001, SRC-0006, DEC-0020
