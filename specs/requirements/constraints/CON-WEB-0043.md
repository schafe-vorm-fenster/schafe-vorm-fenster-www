---
artefact: requirement
id: CON-WEB-0043
class: CON
form: C1
domain: WEB
status: DRAFT
version: 0.1.0
area: security
source:
  source_id: DEC-0025
  loc: "specs/decisions/DEC-0025--bff-no-external-tokens-client.md#L12"
  excerpt: "calls the ecosystem APIs exclusively server-side"
evidence_sufficiency: S3
fit_criterion: UNKNOWN
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T16:45:00+02:00"
---

# CON-WEB-0043

The solution SHALL call ecosystem APIs server-side only, through its own use-case-tailored endpoints, imposed by DEC-0025.

## Source

DEC-0025

## Notes

The BFF boundary. `scripts/check-api-routes.ts` holds the static half — every `route.ts` exports `GET` and nothing else, and the app hostname occurs in at most one authored module (TS-WEB-0017-A10, TS-WEB-0017-A11).
