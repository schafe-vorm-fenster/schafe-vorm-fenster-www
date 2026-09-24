---
artefact: requirement
id: FUN-WEB-0135
class: FUN
form: F1
domain: WEB
status: DRAFT
version: 0.1.0
area: jobs-and-navigation
needs: [NEED-WEB-0007, NEED-WEB-0008]
source:
  source_id: SRC-0001
  loc: "UNKNOWN"
  excerpt: "UNKNOWN"
evidence_sufficiency: S3
fit_criterion:
  scale: "acceptance criteria of FUN-WEB-0135 that pass"
  operator: "="
  value: 4
  unit: criteria
  meter: "TS-WEB-0006-A15, TS-WEB-0006-A18, TS-WEB-0006-A2, TS-WEB-0006-A3 — 3 of 4 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T17:20:00+02:00"
---

# FUN-WEB-0135

For every action that is not the primary conversion, the website SHALL render it at secondary treatment.

## Source

SRC-0001#2-order-do-not-exclude, DEC-0082

Unlocatable: No line prescribes a treatment for non-primary actions. The word "secondary" does not occur in the file.

Finding: Parent line 207 ("One primary conversion per page, above the fold, visually unrivalled") governs the primary action only and does not state that other actions get secondary treatment; that rule comes from DEC-0082, so I did not reuse the parent line.

## Notes

Module CTAs, tier CTAs, the context band and every row of the contact section (DEC-0082).
