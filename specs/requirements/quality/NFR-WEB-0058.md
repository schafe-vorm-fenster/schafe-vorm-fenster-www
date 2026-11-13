---
artefact: requirement
id: NFR-WEB-0058
class: NFR
form: Q1
domain: WEB
status: DRAFT
version: 0.1.0
area: accessibility
needs: [NEED-WEB-0006]
source:
  source_id: SRC-0006
  loc: "UNKNOWN"
  excerpt: "UNKNOWN"
evidence_sufficiency: S3
fit_criterion:
  scale: "acceptance criteria of NFR-WEB-0058 that pass"
  operator: "="
  value: 1
  unit: criteria
  meter: "TS-WEB-0002-A3 — 1 of 1 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T16:45:00+02:00"
---

# NFR-WEB-0058

Contrast ratio of body text against its ground — on a photo surface the composite of the photograph with the fixed scrim stop at that position, ceiling 0.72 — SHALL be >= 4.5 :1, measured by `scripts/check-contrast.ts` (TS-WEB-0002-A3).

## Source

SRC-0006, SRC-0014#accessibility, DEC-0056, DEC-0105

Unlocatable: Transcript demands colour contrast ("Farbenkontraste, logisch") and AA conformance, but never states a 4.5:1 ratio.

Finding: The numeric ratio comes from WCAG/DEC-0056, not from SRC-0006.

## Notes

The composite qualification is in the statement, not here, since DEC-0105 §3: a qualification in a Notes block binds nothing.

**The scrim ladder is fixed, not measured per photograph** (DEC-0105 §1). The per-hero measurement decision 5 asked for was never performed and is withdrawn; what the fixed ladder gives instead is that the scrim half of the pair is a token, which is the layer the meter reaches.

**What the meter reaches.** `scripts/check-contrast.ts` judges the token set itself, in all four themes the sheet declares, before any page composes it. It does not open an image, composite alpha or sample a text box. The photograph half of the composite is carried by SRC-0014's crop and focal-point rules — the focal point at or above 40 % for a sky-heavy motif, and "a photograph that only works when the scrim covers its subject is the wrong photograph" (DEC-0105 §2) — and by DEM-0027, which asks brand/design for the measured ratios.
