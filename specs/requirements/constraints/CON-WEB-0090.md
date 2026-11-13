---
artefact: requirement
id: CON-WEB-0090
class: CON
form: C1
domain: WEB
status: DRAFT
version: 0.1.0
area: rendering-and-resilience
needs: [NEED-WEB-0005]
source:
  source_id: DEC-0033
  loc: "specs/decisions/DEC-0033--skeletons-and-streaming.md#L13"
  excerpt: "blocking spinners, no layout shift"
evidence_sufficiency: S3
fit_criterion:
  scale: "acceptance criteria of CON-WEB-0090 that pass"
  operator: "="
  value: 3
  unit: criteria
  meter: "TS-WEB-0009-A13, TS-WEB-0009-A8, TS-WEB-0009-A9 — 1 of 3 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T17:20:00+02:00"
---

# CON-WEB-0090

The solution SHALL NOT use a blocking spinner, imposed by DEC-0033.

## Source

DEC-0033, SRC-0014#skeletons, DEC-0056

Finding: The sentence 'No blocking spinners, no layout shift' wraps from line 12; only the part on line 13 is quoted.
