---
artefact: requirement
id: CON-WEB-0036
class: CON
form: C1
domain: WEB
status: DRAFT
version: 0.1.0
area: privacy
source: "DEC-0016, DEC-0028"
evidence_sufficiency: S3
fit_criterion:
  scale: "acceptance criteria of CON-WEB-0036 that pass"
  operator: "="
  value: 6
  unit: criteria
  meter: "TS-WEB-0012-A10, TS-WEB-0012-A11, TS-WEB-0012-A3, TS-WEB-0012-A5, TS-WEB-0012-A6, TS-WEB-0012-A7 — 4 of 6 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T16:45:00+02:00"
---

# CON-WEB-0036

The solution SHALL measure up to the handover only, leaving completion to the app in the shared account, imposed by DEC-0028.

## Rationale

App opens and registration start are the website's; the completion of a registration or an order is the app's, and it is measured in the same property (CON-WEB-0029).
