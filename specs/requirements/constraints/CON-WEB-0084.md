---
artefact: requirement
id: CON-WEB-0084
class: CON
form: C1
domain: WEB
status: DRAFT
version: 0.1.0
area: forms-and-leads
needs: [NEED-WEB-0015, NEED-WEB-0025]
source:
  source_id: DEC-0011
  loc: "specs/decisions/DEC-0011--purchase-on-invoice.md#L17"
  excerpt: "the invoice follows out-of-band. No payment"
evidence_sufficiency: S3
fit_criterion: UNKNOWN
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T17:20:00+02:00"
---

# CON-WEB-0084

The solution SHALL NOT use a payment provider, imposed by DEC-0011.

## Source

DEC-0011, DEC-0051

Finding: The sentence 'No payment provider in phase 1.' wraps across lines 17-18; only the part on line 17 is quoted.
