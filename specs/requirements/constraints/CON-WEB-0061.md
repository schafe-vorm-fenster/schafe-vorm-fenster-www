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
  loc: "go-to-market-os/concept/website-information-architecture.concept.md#L45"
  excerpt: "Contact is not a footer element."
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

Finding: Re-resolved 2026-09-25. SRC-0003 now states the prohibition in its own words at line 45 — "Contact is not a footer element." — and line 47 gives the placement this constraint implies, "on every page between that page's closing block and the footer". The prohibition itself is still imposed by DEC-0081; the source now agrees with it rather than merely being silent, so the locator is a position instead of UNKNOWN.

Amendment 2026-09-25: the recorded deviation against old line 35 is withdrawn, not resolved in this requirement's favour. Hub PR #510 struck the sentence "Contact and newsletter live in the footer, together with the legal links" that the deviation named, which is exactly the edit DEM-0001 required, so DEM-0001 is ANSWERED and CONF-0013 records the amendment as the NEW_VERSION it asked for. Nothing is left for a `Deviation:` line to name (DEC-0104 §2 — a deviation record without a live disagreement is noise).

## Rationale

Contact is the standing contact section above the footer, not an entry inside it. Help lives in the app and not on the website at all (CON-WEB-0010).
