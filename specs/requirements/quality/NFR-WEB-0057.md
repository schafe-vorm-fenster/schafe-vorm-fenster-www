---
artefact: requirement
id: NFR-WEB-0057
class: NFR
form: Q1
domain: WEB
status: DRAFT
version: 0.1.0
area: accessibility
source: "SRC-0006"
evidence_sufficiency: S2
fit_criterion:
  scale: "Violations of WCAG 2.2 level A and AA on every route"
  operator: "="
  value: 0
  unit: "violations"
  meter: "e2e/a11y.spec.ts (TS-WEB-0002-A1) — run by TS-WEB-0002-A1"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T16:45:00+02:00"
---

# NFR-WEB-0057

Violations of WCAG 2.2 level A and AA on every route SHALL be = 0 violations, measured by `e2e/a11y.spec.ts` (TS-WEB-0002-A1).

## Notes

"AAA criteria are adopted where feasible ('the basics of AAA')" — the eight that were adopted, and the four that were not, are TS-WEB-0002 D2's table. `e2e/a11y.spec.ts` runs axe-core over 24 routes x 2 viewports against `wcag2a`, `wcag2aa`, `wcag21a` and `wcag21aa`, and counts a violation of any rule in those tags whatever axe scores its impact at.
