---
artefact: requirement
id: CON-WEB-0076
class: CON
form: C1
domain: WEB
status: DRAFT
version: 0.1.0
area: localization
source:
  source_id: SRC-0007
  loc: "community-calendar/docs/localization-architecture.md#L235"
  excerpt: "The browser suggestion banner is a separate, additive client-side concern with no influence on rendering."
evidence_sufficiency: S2
fit_criterion: UNKNOWN
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T17:20:00+02:00"
---

# CON-WEB-0076

The solution SHALL NOT let the first-visit language suggestion influence server rendering or vary a cached response, imposed by DEC-0038.

## Source

SRC-0007, DEC-0038

Finding: The source says the suggestion has no influence on rendering and that "The server is never involved" (line 66), but nothing in any of the three documents mentions cached responses or cache variance; that half of the statement is unsupported.

## Rationale

Pages stay statically cacheable. Path-determined language remains the rule; the suggestion only offers a link.
