---
artefact: requirement
id: CON-WEB-0061
class: CON
form: C1
domain: WEB
status: DRAFT
version: 0.1.0
area: pages
needs: [NEED-WEB-0015, NEED-WEB-0025]
source:
  source_id: SRC-0003
  loc: "UNKNOWN"
  excerpt: "UNKNOWN"
evidence_sufficiency: S3
fit_criterion:
  scale: "acceptance criteria of CON-WEB-0061 that pass"
  operator: "="
  value: 1
  unit: criteria
  meter: "TS-WEB-0004-A9 — 1 of 1 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T17:20:00+02:00"
---

# CON-WEB-0061

The solution SHALL NOT place contact inside the footer, imposed by DEC-0081.

## Source

SRC-0003#navigation, DEC-0012, DEC-0039, DEC-0052, DEC-0081

Unlocatable: SRC-0003 states the opposite: line 35 reads "Contact and newsletter live in the footer". No line prohibits contact in the footer.

Finding: The prohibition comes from DEC-0081. SRC-0003 says the opposite and has not been amended, so the disagreement is recorded as a deviation rather than resolved by either side winning silently (DEC-0104 §2).

Deviation: `go-to-market-os/concept/website-information-architecture.concept.md#L35` says "Contact and newsletter live in the footer, together with the legal links". This constraint says the opposite, on DEC-0081: contact is a standing section above the footer, not an entry inside it. The specification carries the truth (DEC-0104 §1) and the source is asked to follow through DEM-0001.

## Rationale

Contact is the standing contact section above the footer, not an entry inside it. Help lives in the app and not on the website at all (CON-WEB-0010).
