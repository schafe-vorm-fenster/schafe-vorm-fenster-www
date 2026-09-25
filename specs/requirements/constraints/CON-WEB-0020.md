---
artefact: requirement
id: CON-WEB-0020
class: CON
form: C1
domain: WEB
status: DRAFT
version: 0.1.0
area: delivery-pipeline
needs: [UNKNOWN]
source:
  source_id: DEC-0035
  loc: "specs/decisions/DEC-0035--domain-layout-and-preview.md#L18"
  excerpt: "`next.` | product pre-launch preview (not live) | **website migration preview** (protected, noindex)"
evidence_sufficiency: S3
fit_criterion:
  scale: "acceptance criteria of CON-WEB-0020 that pass"
  operator: "="
  value: 3
  unit: criteria
  meter: "TS-WEB-0015-A1, TS-WEB-0015-A11, TS-WEB-0015-A2 — 1 of 3 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T17:20:00+02:00"
---

# CON-WEB-0020

The solution SHALL deploy the `next-2026` branch to `next.schafe-vorm-fenster.de`, imposed by DEC-0031 and DEC-0035.

## Source

DEC-0031, DEC-0035

Finding: The statement is carried by two records between them, and neither carries it alone. DEC-0035's Decision table assigns `next.` of `schafe-vorm-fenster.de`, named on line 11, to the website migration preview and resolves Q-0027, but never names the `next-2026` branch; DEC-0031 line 11 names the branch, and its line 14 leaves the host name open. That is a **silence in the earlier record**, not a disagreement with it: DEC-0031 left the host name to be settled and DEC-0035 settled it. The wording here previously read the silence as the earlier record standing against the statement, which over-claimed; it is corrected, because claiming a disagreement that is not there is the same defect as hiding one that is (DEC-0104 §2).

## Rationale

So that the full deploy chain runs without going live. The product's pre-launch preview vacates the host — internal coordination, not a blocker.

## Notes

Deployment protection and `noindex` on that host are CON-WEB-0023's, which covers every non-production deployment.
