---
artefact: requirement
id: FUN-WEB-0119
class: FUN
form: F1
domain: WEB
status: DRAFT
version: 0.1.0
area: accessibility
source:
  source_id: SRC-0006
  loc: "UNKNOWN"
  excerpt: "Screen wieder optimiert, Tastatursteuerung ist optimiert."
evidence_sufficiency: S3
fit_criterion:
  scale: "acceptance criteria of FUN-WEB-0119 that pass"
  operator: "="
  value: 2
  unit: criteria
  meter: "TS-WEB-0002-A4, TS-WEB-0002-A5 — 1 of 2 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T16:45:00+02:00"
---

# FUN-WEB-0119

For every page, the website SHALL present its content to a screen reader in the page's reading order.

## Source

SRC-0006, SRC-0014, DEC-0056

Unlocatable: the transcript is one line with no line terminators, so it supports no position scheme.

Finding: "Screen wieder" is the transcript's rendering of "Screenreader"; reading order is not mentioned in SRC-0006.
