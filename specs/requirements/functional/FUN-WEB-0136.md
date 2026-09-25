---
artefact: requirement
id: FUN-WEB-0136
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
  scale: "acceptance criteria of FUN-WEB-0136 that pass"
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

# FUN-WEB-0136

Where the page brief declares a goal of equal weight, the hero MAY carry a second, adjacent secondary action.

## Source

SRC-0001#2-order-do-not-exclude, DEC-0082

Unlocatable: Nothing in the file permits a second, adjacent action in the hero or mentions a page brief declaring a goal of equal weight; "hero" does not occur.

Finding: Parent line 207 states the opposite emphasis (one primary conversion, visually unrivalled), so it does not support this permission; it comes from DEC-0082. Recorded as a deviation rather than left as a citation that does not hold (DEC-0104 §2).

Deviation: `go-to-market-os/concept/website-information-architecture.concept.md#L207` requires "One primary conversion per page, above the fold, visually unrivalled". This requirement permits a second adjacent action, on DEC-0082 §3: equal weight in a page brief means the offer is equally available, not that two elements share one visual rank, so the consult sits beside the purchase at secondary treatment. The specification carries the truth (DEC-0104 §1); DEM-0064 asks the source to follow.

## Rationale

Order versus consult, per DEC-0082.
