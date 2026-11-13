---
artefact: requirement
id: CON-WEB-0006
class: CON
form: C1
domain: WEB
status: DRAFT
version: 0.1.0
area: technical-constraints
needs: [UNKNOWN]
source:
  source_id: DEC-0023
  loc: "specs/decisions/DEC-0023--three-phases-and-strict.md#L13"
  excerpt: "are authored against the STRICT framework"
evidence_sufficiency: S3
fit_criterion:
  scale: "acceptance criteria of CON-WEB-0006 that pass"
  operator: "="
  value: 2
  unit: criteria
  meter: "TS-WEB-0017-A13, TS-WEB-0017-A14 — 1 of 2 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T17:20:00+02:00"
---

# CON-WEB-0006

The solution SHALL be specified against `@leafcutter-strict/blueprint-complete`, referenced by package name, imposed by DEC-0023 and DEC-0085.

## Source

DEC-0023, DEC-0085

Finding: The sentence starts with 'Specifications' at the end of line 12. DEC-0023 names STRICT by filesystem path (line 14), not by package name; the package form `@leafcutter-strict/blueprint-complete` comes from the second source DEC-0085, whose Context explicitly records that CON-WEB-0006 used to carry the path as its statement.

## Notes

"specs precede content" is the second limit of the original statement. It is carried by CON-WEB-0087, which states it on its own.
