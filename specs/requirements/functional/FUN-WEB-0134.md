---
artefact: requirement
id: FUN-WEB-0134
class: FUN
form: F1
domain: WEB
status: DRAFT
version: 0.1.0
area: jobs-and-navigation
needs: [NEED-WEB-0007, NEED-WEB-0008]
source:
  source_id: SRC-0001
  loc: "go-to-market-os/concept/website-communication-principles.concept.md#L326"
  excerpt: "A closing CTA identical to the primary conversion."
evidence_sufficiency: S3
fit_criterion:
  scale: "acceptance criteria of FUN-WEB-0134 that pass"
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

# FUN-WEB-0134

In the closing block of every page, the website SHALL repeat the primary conversion without the primary marker.

## Source

SRC-0001#2-order-do-not-exclude, DEC-0082

Finding: Only the repetition is supported. "without the primary marker" appears nowhere in the file; it comes from DEC-0082. Anchor #2 (lines 201-213) does not carry this either.
