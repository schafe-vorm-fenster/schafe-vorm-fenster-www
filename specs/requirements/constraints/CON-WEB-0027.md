---
artefact: requirement
id: CON-WEB-0027
class: CON
form: C1
domain: WEB
status: DRAFT
version: 0.1.0
area: accessibility
needs: [NEED-WEB-0006]
source:
  source_id: DEC-0012
  loc: "specs/decisions/DEC-0012--bfsg-and-legal-import.md#L18"
  excerpt: "footer gains the accessibility statement"
evidence_sufficiency: S3
fit_criterion:
  scale: "acceptance criteria of CON-WEB-0027 that pass"
  operator: "="
  value: 1
  unit: criteria
  meter: "TS-WEB-0002-A8 — 1 of 1 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T16:45:00+02:00"
---

# CON-WEB-0027

The solution SHALL publish an accessibility statement as a footer-reachable section at a stable anchor on `/rechtliches`, imposed by DEC-0012 and DEC-0039.

## Source

DEC-0012, DEC-0039

Finding: DEC-0012 gives only the footer reachability (in Consequences); '/rechtliches' and the stable anchor come from the second source DEC-0039 (lines 11-13, 28-30).

## Notes

Reclassified from the quality class by DEC-0092: imposed by two decisions already taken, so question 2 decides. The route and the anchor registry are FUN-WEB-0146, CON-WEB-0067's; TS-WEB-0002-A8 checks that the anchor resolves and is footer-linked under its conventional label. The number was free in the constraint class and is kept.
