---
artefact: requirement
id: CON-WEB-0030
class: CON
form: C1
domain: WEB
status: DRAFT
version: 0.1.0
area: security
source: "DEC-0015"
evidence_sufficiency: S3
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T16:45:00+02:00"
---

# CON-WEB-0030

The solution SHALL serve an enforced Content-Security-Policy with an explicit allowlist from the first deployment, imposed by DEC-0015.

## Notes

Reclassified from the quality class by DEC-0092: imposed by DEC-0015, a decision already taken. The initial allowlist — envoy, eTracker and `app.schafe-vorm-fenster.de` — is TS-WEB-0014 D1's typed structure and is not restated here. `scripts/check-csp.ts` is the running guard (TS-WEB-0014-A1). The number was free in the constraint class and is kept.
