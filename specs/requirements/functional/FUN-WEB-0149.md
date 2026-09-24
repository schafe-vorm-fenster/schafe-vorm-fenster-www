---
artefact: requirement
id: FUN-WEB-0149
class: FUN
form: F1
domain: WEB
status: DRAFT
version: 0.1.0
area: relevance-and-proof
source: "SRC-0002#scoring"
evidence_sufficiency: S2
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T17:20:00+02:00"
---

# FUN-WEB-0149

For every proof element, the relevance engine SHALL score it by the formula and starting weights of SRC-0002 §Scoring.

## Notes

w_geo 0.35 · w_ctx 0.25 · w_job 0.25 · w_time 0.15. The stage-0 redistribution is Q-0002.
