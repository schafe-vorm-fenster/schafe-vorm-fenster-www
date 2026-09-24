---
artefact: requirement
id: NFR-WEB-0063
class: NFR
form: Q1
domain: WEB
status: DRAFT
version: 0.1.0
area: privacy
source: "derived; convention"
evidence_sufficiency: S1
fit_criterion:
  scale: "External asset hosts in the built output and in the source"
  operator: "="
  value: 0
  unit: "hosts"
  meter: "TS-WEB-0013-A3 — run by TS-WEB-0013-A1, TS-WEB-0013-A3, TS-WEB-0013-A5"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T16:45:00+02:00"
---

# NFR-WEB-0063

External asset hosts in the built output and in the source SHALL be = 0 hosts, measured by TS-WEB-0013-A3.

## Notes

"self-hosting is preferred over third-party CDNs (fonts already self-hosted)" — the fonts are FUN-WEB-0109. TS-WEB-0013-A3 names `fonts.googleapis.com`, `fonts.gstatic.com` "or any CDN host" and requires fonts, icons and libraries to resolve to own-origin paths.
