---
artefact: requirement
id: FUN-WEB-0043
class: FUN
form: F1
domain: WEB
status: DRAFT
version: 0.1.0
area: live-data
needs: [NEED-WEB-0015, NEED-WEB-0016]
source:
  source_id: SRC-0002
  loc: "go-to-market-os/concept/website-relevance-model.concept.md#L115"
  excerpt: "On pages whose focus job is \"run our own calendar\", module 1 is replaced by the"
evidence_sufficiency: S3
fit_criterion: UNKNOWN
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-09T16:07:54+02:00"
---

# FUN-WEB-0043

On pages whose focus job is "run our own calendar", the website SHALL replace module 1 with the embed demo — the **real Portalize widget via its loader** (`/api/{organizerId}/load.js`, web-component mode), filtered to the place just searched for.

## Source

SRC-0002#live-content, DEC-0030

Finding: SRC-0002 says only "the Portalize calendar filtered to the place just searched for" (line 116); the loader path `/api/{organizerId}/load.js` and web-component mode are not in this file (DEC-0030).

## Notes

The filter parameter is demand Q-0026, including cookie-freedom verification.
