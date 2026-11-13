---
artefact: requirement
id: FUN-WEB-0185
class: FUN
form: F1
domain: WEB
status: DRAFT
version: 0.1.0
area: forms-and-leads
needs: [NEED-WEB-0015, NEED-WEB-0025]
source:
  source_id: DEC-0010
  loc: "specs/decisions/DEC-0010--briefing-via-google-calendar.md#L30"
  excerpt: "lives in the first action row of the contact section (DEC-0081 §3)"
evidence_sufficiency: S3
fit_criterion:
  scale: "acceptance criteria of FUN-WEB-0185 that pass"
  operator: "="
  value: 8
  unit: criteria
  meter: "TS-WEB-0016-A12, TS-WEB-0016-A15, TS-WEB-0016-A16, TS-WEB-0016-A17, TS-WEB-0016-A18, TS-WEB-0016-A19, TS-WEB-0016-A20, TS-WEB-0016-A5 — 1 of 8 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T17:20:00+02:00"
---

# FUN-WEB-0185

As the contact section's first action row, the website SHALL carry the Google Calendar appointment link as outbound navigation.

## Source

DEC-0010, DEC-0081

Finding: The subject 'The appointment link' ends line 29; the outbound-navigation character is stated on lines 18 and 32.
