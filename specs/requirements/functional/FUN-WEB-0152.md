---
artefact: requirement
id: FUN-WEB-0152
class: FUN
form: F1
domain: WEB
status: DRAFT
version: 0.1.0
area: forms-and-leads
needs: [NEED-WEB-0015, NEED-WEB-0025]
source:
  source_id: UNKNOWN
  loc: "UNKNOWN"
  excerpt: "UNKNOWN"
evidence_sufficiency: S3
fit_criterion:
  scale: "acceptance criteria of FUN-WEB-0152 that pass"
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

# FUN-WEB-0152

On every row of the contact section, the website SHALL carry `make-contact` as an intent, counted per channel and with the route.

## Source

DEC-0010, DEC-0081

Unlocatable: no *registered source* carries it. `GOAL-WEB-0010` references the hub goal `make-contact` with a verified line, but a goal reference is not a statement that every row of the contact section carries it as an intent.

**Closed 2026-09-25 — DEC-0081's amendment is the record.** Until then the statement rested on `TS-WEB-0016 D12`/`D13` alone: DEC-0081 §4 fired only `request-product-briefing`, on the *first* row, and the string `make-contact` occurred in no decision record at all. The amendment carries the four intent events, the per-channel dimension and the second goal on row 1, so the requirement now has a decision behind it and `DEM-0011`'s `make-contact` clause is discharged. The nine other requirements DEM-0011 names are untouched.

Finding: The first-named DEC-0010 does not support it and never did; DEC-0081 does, as amended 2026-09-25.

## Rationale

Three of the four rows hand the visitor to another application, so the contact itself is not observable; what the website can honestly count is the intent.
