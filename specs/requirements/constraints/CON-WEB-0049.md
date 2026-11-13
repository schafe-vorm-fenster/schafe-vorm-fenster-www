---
artefact: requirement
id: CON-WEB-0049
class: CON
form: C1
domain: WEB
status: DRAFT
version: 0.1.0
area: technical-constraints
needs: [NEED-WEB-0005, NEED-WEB-0014]
source:
  source_id: SRC-0006
  loc: "UNKNOWN"
  excerpt: "Achso, responsive. Wir machen Mobile First. Die wichtigste Zielgruppe geht übers Handy drauf."
evidence_sufficiency: S3
fit_criterion:
  scale: "acceptance criteria of CON-WEB-0049 that pass"
  operator: "="
  value: 3
  unit: criteria
  meter: "TS-WEB-0017-A4, TS-WEB-0017-A8, TS-WEB-0017-A9 — 3 of 3 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T17:20:00+02:00"
---

# CON-WEB-0049

The solution SHALL optimise its layout for the phone first, imposed by SRC-0014 and DEC-0056.

## Source

SRC-0006, SRC-0014, DEC-0056

Unlocatable: the transcript is one line with no line terminators, so it supports no position scheme.

## Rationale

The primary audience arrives on the phone.
