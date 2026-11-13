---
artefact: requirement
id: NFR-WEB-0062
class: NFR
form: Q1
domain: WEB
status: DRAFT
version: 0.1.0
area: privacy
needs: [NEED-WEB-0017, NEED-WEB-0022, NEED-WEB-0029]
source:
  source_id: SRC-0006
  loc: "UNKNOWN"
  excerpt: "Das heißt, ich will tracken, ohne dass ich einen Cookie Banner anzeigen muss."
evidence_sufficiency: S3
fit_criterion:
  scale: "Consent-banner components in the rendered tree"
  operator: "="
  value: 0
  unit: "components"
  meter: "TS-WEB-0012-A1 — run by TS-WEB-0012-A1, TS-WEB-0012-A2, TS-WEB-0012-A9"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T16:45:00+02:00"
---

# NFR-WEB-0062

Consent-banner components in the rendered tree SHALL be = 0 components, measured by TS-WEB-0012-A1.

## Source

SRC-0006, DEC-0004

Unlocatable: the transcript is one line with no line terminators, so it supports no position scheme.

## Notes

**Read against the registration embed on 2026-09-25 and unchanged by it (DEC-0108 §3).** This requirement counts consent-banner *components*. The notice `FUN-WEB-0206` puts above the embed is not one: nothing is gated, nothing is stored, nothing on the page waits for it and it grants nothing. The count stays 0 on `/start` as everywhere else, so the banner-free claim holds — because of what this statement says, not because it was read generously. `NFR-WEB-0061` is the one that needed the exception; this one did not.
