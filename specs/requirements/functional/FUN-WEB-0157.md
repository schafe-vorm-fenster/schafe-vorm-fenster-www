---
artefact: requirement
id: FUN-WEB-0157
class: FUN
form: F1
domain: WEB
status: DRAFT
version: 0.1.0
area: place-search
needs: [NEED-WEB-0002]
source:
  source_id: DEC-0079
  loc: "specs/decisions/DEC-0079--place-search-by-name.md#L125"
  excerpt: "**Suggestions cover the covered communities only.**"
evidence_sufficiency: S3
fit_criterion:
  scale: "acceptance criteria of FUN-WEB-0157 that pass"
  operator: "="
  value: 5
  unit: criteria
  meter: "TS-WEB-0008-A1, TS-WEB-0008-A14, TS-WEB-0008-A15, TS-WEB-0008-A16, TS-WEB-0008-A7 — 2 of 5 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T17:20:00+02:00"
---

# FUN-WEB-0157

For suggestions, the place search SHALL cover the covered communities.

## Source

DEC-0079, DEC-0024

## Notes

Where the names come from is an implementation detail and free — today the committed covered-community index of TS-WEB-0008 D7, later a geo-api name endpoint (Q-0025). What is promised to the visitor is the name, not the store that answers it. A name outside the covered communities produces no suggestion and still reaches `/dein-ort/starten` on submit (FUN-WEB-0159). Germany-wide finding by name is the target, carried by Q-0025.
