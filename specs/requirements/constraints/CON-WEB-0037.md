---
artefact: requirement
id: CON-WEB-0037
class: CON
form: C1
domain: WEB
status: DRAFT
version: 0.1.0
area: privacy
source:
  source_id: DEC-0028
  loc: "specs/decisions/DEC-0028--single-etracker-account.md#L15"
  excerpt: "The established campaign convention (`etcc_cmp`,"
evidence_sufficiency: S3
fit_criterion:
  scale: "acceptance criteria of CON-WEB-0037 that pass"
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

# CON-WEB-0037

The solution SHALL keep the `etcc_*` convention for campaign attribution, imposed by DEC-0028.

## Source

DEC-0016, DEC-0028

Finding: The second source DEC-0028 supports it, while DEC-0016 is named first and never mentions `etcc_*`; the sentence wraps, with '`etcc_med`) continues' on line 16.
