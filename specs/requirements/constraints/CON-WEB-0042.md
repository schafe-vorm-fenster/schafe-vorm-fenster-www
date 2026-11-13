---
artefact: requirement
id: CON-WEB-0042
class: CON
form: C1
domain: WEB
status: DRAFT
version: 0.1.0
area: security
needs: [NEED-WEB-0017, NEED-WEB-0022, NEED-WEB-0029]
source:
  source_id: DEC-0025
  loc: "specs/decisions/DEC-0025--bff-no-external-tokens-client.md#L3"
  excerpt: "external API tokens never reach the client"
evidence_sufficiency: S3
fit_criterion: UNKNOWN
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T16:45:00+02:00"
---

# CON-WEB-0042

The solution SHALL NOT expose an external API token to the client, imposed by DEC-0025.

## Source

DEC-0025

Finding: This is the record's title line; the Decision body phrases it generically as 'no client-side tokens' (line 14), which is the line used for the narrower CON-WEB-0045.
