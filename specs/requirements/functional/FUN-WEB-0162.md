---
artefact: requirement
id: FUN-WEB-0162
class: FUN
form: F1
domain: WEB
status: DRAFT
version: 0.1.0
area: personalization
needs: [NEED-WEB-0001]
source:
  source_id: SRC-0006
  loc: "UNKNOWN"
  excerpt: "Aber auf Gemeinde wäre schon nett. Auf Landkreis auf jeden Fall"
evidence_sufficiency: S2
fit_criterion:
  scale: "acceptance criteria of FUN-WEB-0162 that pass"
  operator: "="
  value: 2
  unit: criteria
  meter: "TS-WEB-0010-A2, TS-WEB-0010-A8 — 1 of 2 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T17:20:00+02:00"
---

# FUN-WEB-0162

For a detected location, the website SHALL resolve it to at least county level.

## Source

SRC-0006 (transcript), SRC-0001#6

Unlocatable: the transcript is one line with no line terminators, so it supports no position scheme.

## Notes

Municipality level is desirable.
