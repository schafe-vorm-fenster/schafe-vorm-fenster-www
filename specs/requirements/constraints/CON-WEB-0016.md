---
artefact: requirement
id: CON-WEB-0016
class: CON
form: C1
domain: WEB
status: DRAFT
version: 0.1.0
area: scope-boundaries
needs: [NEED-WEB-0018, NEED-WEB-0021, NEED-WEB-0027]
source:
  source_id: SRC-0001
  loc: "go-to-market-os/concept/website-communication-principles.concept.md#L240"
  excerpt: "A slot with no cleared, available proof stays empty and the claim is"
evidence_sufficiency: S2
fit_criterion: UNKNOWN
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T17:20:00+02:00"
---

# CON-WEB-0016

The solution SHALL make no claim it cannot prove with a cleared proof element or live data, imposed by SRC-0001 §4 and §5.

## Source

SRC-0001#4, #5

Finding: Merged requirement: the cleared-proof half sits here (§4); the live-data half is a separate line, 267 ("Traction figures are counted live or not shown"). No single line states the combined rule.

## Notes

The umbrella rule binding FUN-WEB-0150, FUN-WEB-0151 and FUN-WEB-0041.
