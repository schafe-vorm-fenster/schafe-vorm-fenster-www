---
artefact: requirement
id: FUN-WEB-0154
class: FUN
form: F1
domain: WEB
status: DRAFT
version: 0.1.0
area: live-data
needs: [NEED-WEB-0004, NEED-WEB-0009]
source:
  source_id: SRC-0002
  loc: "go-to-market-os/concept/website-relevance-model.concept.md#L120"
  excerpt: "the page shifts its focus job to \"publish our dates\""
evidence_sufficiency: S2
fit_criterion:
  scale: "acceptance criteria of FUN-WEB-0154 that pass"
  operator: "="
  value: 1
  unit: criteria
  meter: "TS-WEB-0008-A6 — 1 of 1 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T17:20:00+02:00"
---

# FUN-WEB-0154

Where a place carries no dates, the website SHALL shift the page's focus job to "publish our dates".

## Source

SRC-0002#live-content, SRC-0003#your-place

## Notes

"nothing has been entered in <place> yet — you could be the first". This is the only runtime focus-job change on the website; FUN-WEB-0052 states the rule it is the exception to.
