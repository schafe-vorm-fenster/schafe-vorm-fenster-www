---
artefact: requirement
id: CON-WEB-0034
class: CON
form: C1
domain: WEB
status: DRAFT
version: 0.1.0
area: security
source: "platform default"
evidence_sufficiency: S2
fit_criterion: UNKNOWN
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T16:45:00+02:00"
---

# CON-WEB-0034

The solution SHALL serve every request over HTTPS and answer an `http://` request with a permanent redirect, imposed by TS-WEB-0014 D4 and the platform default it records.

## Notes

Reclassified from the quality class by DEC-0092; DEC-0087 named it as a quality requirement with no measure. The redirect is the mechanism of the same limit, not a second one. TS-WEB-0014-A6 asserts the `308` and the HSTS `max-age`. The number was free in the constraint class and is kept.
