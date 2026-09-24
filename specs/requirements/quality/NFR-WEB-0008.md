---
artefact: requirement
id: NFR-WEB-0008
class: NFR
form: Q1
domain: WEB
status: DRAFT
version: 0.1.0
area: performance
source: "SRC-0006"
evidence_sufficiency: S2
fit_criterion: UNKNOWN
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T16:45:00+02:00"
---

# NFR-WEB-0008

Image payload of a page response served under `Save-Data: on` or `prefers-reduced-data` SHALL be <= 70 % of the same response without the hint, measured by TS-WEB-0003-A6.

## Notes

Original statement: "Reduced-data signals (`Save-Data`, `prefers-reduced-data`) shall be honoured with lighter payloads." The measure is TS-WEB-0003-A6's, word for word: "`Save-Data: on` responses are measurably lighter (>= 30 % image bytes saved)". A6 marks the threshold [PROPOSED] and no test references it yet (W3), so the meter exists as a criterion and not yet as a run.
