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

Unlocatable: DEC-0081 does not carry it either. Its §4 (lines 88-89) fires `request-product-briefing` on the section's *first* action row with the route, and the 2026-09-24 amendment (lines 176-177) points at the hub record for per-channel goals. The string `make-contact` occurs in no decision record.

Finding: Neither the first-named DEC-0010 nor the later DEC-0081 supports it; `make-contact` appears only in tactical specs (TS-WEB-0016, TS-WEB-0027) and in the requirement files themselves, so no cited decision record is a source for this statement.

## Rationale

Three of the four rows hand the visitor to another application, so the contact itself is not observable; what the website can honestly count is the intent.
