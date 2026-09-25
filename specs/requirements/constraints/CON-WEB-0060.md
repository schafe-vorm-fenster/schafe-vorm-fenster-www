---
artefact: requirement
id: CON-WEB-0060
class: CON
form: C1
domain: WEB
status: DRAFT
version: 0.1.0
area: pages
needs: [NEED-WEB-0013]
source:
  source_id: SRC-0003
  loc: "go-to-market-os/concept/website-information-architecture.concept.md#L266"
  excerpt: "`order-promotion-material` | not on the website yet"
evidence_sufficiency: S2
fit_criterion:
  scale: "acceptance criteria of CON-WEB-0060 that pass"
  operator: "="
  value: 1
  unit: criteria
  meter: "TS-WEB-0006-A11 — 1 of 1 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T17:20:00+02:00"
---

# CON-WEB-0060

The solution SHALL NOT carry a page for `order-promotion-material`, imposed by DEC-0052.

## Source

SRC-0003#conversion-map, DEC-0052, DEC-0081

Finding: Re-resolved 2026-09-25 — the map row shifted from line 235 to line 266 and the excerpt is unchanged. The amendment also closed the open point behind it: lines 270–273 now read "it stays unwired — no page and no call site on the website", citing DEC-0052 §2 and closing Q-0005, where the source previously only asked the question.

## Rationale

The goal stays in the hub; the website carries no page for it.
