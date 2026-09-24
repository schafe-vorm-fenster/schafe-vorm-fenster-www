---
artefact: requirement
id: FUN-WEB-0006
class: FUN
form: F1
domain: WEB
status: DRAFT
version: 0.1.0
area: jobs-and-navigation
source:
  source_id: SRC-0001
  loc: "go-to-market-os/concept/website-communication-principles.concept.md#L299"
  excerpt: "The last block of every page is the CTA of its focus job, with the context"
evidence_sufficiency: S2
fit_criterion:
  scale: "acceptance criteria of FUN-WEB-0006 that pass"
  operator: "="
  value: 2
  unit: criteria
  meter: "TS-WEB-0006-A17, TS-WEB-0006-A7 — 1 of 2 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-09T16:07:54+02:00"
---

# FUN-WEB-0006

On every page, the website SHALL make the last block the CTA of the page's focus job — identical to the primary conversion and preceded by the context band.

## Source

SRC-0001#7, SRC-0014#page-rhythm

Finding: "identical to the primary conversion" is not on this line; it is line 326 ("A closing CTA identical to the primary conversion.").

## Notes

Section order and colour rhythm follow SRC-0014 "Page Rhythm".
