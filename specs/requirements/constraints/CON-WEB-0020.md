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

Finding: The second source DEC-0035 supports it (its Decision table assigns `next.` of `schafe-vorm-fenster.de`, named on line 11, to the website migration preview and resolves Q-0027), while the first-named DEC-0031 line 14 leaves the name open and contradicts it; DEC-0035 itself never names the `next-2026` branch, which is DEC-0031 line 11.

## Rationale

So that the full deploy chain runs without going live. The product's pre-launch preview vacates the host — internal coordination, not a blocker.

## Notes

Deployment protection and `noindex` on that host are CON-WEB-0023's, which covers every non-production deployment.
