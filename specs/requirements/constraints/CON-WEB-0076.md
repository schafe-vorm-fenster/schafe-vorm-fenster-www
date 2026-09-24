---
artefact: requirement
id: CON-WEB-0076
class: CON
form: C1
domain: WEB
status: DRAFT
version: 0.1.0
area: localization
source: "SRC-0007, DEC-0038"
evidence_sufficiency: S2
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T17:20:00+02:00"
---

# CON-WEB-0076

The solution SHALL NOT let the first-visit language suggestion influence server rendering or vary a cached response, imposed by DEC-0038.

## Rationale

Pages stay statically cacheable. Path-determined language remains the rule; the suggestion only offers a link.
