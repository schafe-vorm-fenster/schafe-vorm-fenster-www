---
artefact: requirement
id: FUN-WEB-0203
class: FUN
form: F1
domain: WEB
status: DRAFT
version: 0.1.0
area: pages
needs: [NEED-WEB-0026]
source:
  source_id: SRC-0003
  loc: "go-to-market-os/concept/website-information-architecture.concept.md#L214"
  excerpt: "request with a two-working-day promise"
evidence_sufficiency: S2
fit_criterion:
  scale: "acceptance criteria of FUN-WEB-0203 that pass"
  operator: "="
  value: 3
  unit: criteria
  meter: "TS-WEB-0006-A13, TS-WEB-0026-A7, TS-WEB-0026-A8 — 2 of 3 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T17:40:00+02:00"
---

# FUN-WEB-0203

On `/deine-region`, the website SHALL state the two-working-day response promise on the quote request.

## Source

SRC-0003#for-a-whole-region

Finding: Same line also carries BUS-WEB-0016; it sits in the `/deine-region` structure bullet (lines 210–215). Re-resolved 2026-09-25 — shifted by 16 lines; the excerpt is unchanged.

## Notes

Applies BUS-WEB-0016.
