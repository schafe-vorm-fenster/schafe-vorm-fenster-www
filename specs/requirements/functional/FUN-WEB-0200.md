---
artefact: requirement
id: FUN-WEB-0200
class: FUN
form: F1
domain: WEB
status: DRAFT
version: 0.1.0
area: rendering-and-resilience
needs: [NEED-WEB-0005]
source:
  source_id: DEC-0056
  loc: "specs/decisions/DEC-0056--design-system-delivered.md#L35"
  excerpt: "A skeleton standing longer than two seconds is"
evidence_sufficiency: S3
fit_criterion:
  scale: "acceptance criteria of FUN-WEB-0200 that pass"
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

# FUN-WEB-0200

After two seconds, the website SHALL replace a skeleton with the designed empty state.

## Source

DEC-0033, SRC-0014#skeletons, DEC-0056

Finding: DEC-0056 supports it and is named third; DEC-0033 is named first and contains no timing. 'replaced by the honest empty state.' continues on line 36 — the record says 'honest', the requirement says 'designed'.
