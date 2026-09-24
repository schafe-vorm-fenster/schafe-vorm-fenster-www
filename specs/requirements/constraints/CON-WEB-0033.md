---
artefact: requirement
id: CON-WEB-0033
class: CON
form: C1
domain: WEB
status: DRAFT
version: 0.1.0
area: privacy
source:
  source_id: SRC-0001
  loc: "UNKNOWN"
  excerpt: "UNKNOWN"
evidence_sufficiency: S2
fit_criterion:
  scale: "acceptance criteria of CON-WEB-0033 that pass"
  operator: "="
  value: 4
  unit: criteria
  meter: "TS-WEB-0013-A1, TS-WEB-0013-A2, TS-WEB-0013-A3, TS-WEB-0013-A7 — 3 of 4 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T16:45:00+02:00"
---

# CON-WEB-0033

The solution SHALL NOT make a data-protection claim its implementation does not support, imposed by SRC-0001 "Boundaries".

## Source

SRC-0001#boundaries, SRC-0003

Unlocatable: The file contains no mention of data protection, privacy, cookies or tracking; grep for Datenschutz/privacy/cookie/tracking returns nothing.

Finding: Anchor #boundaries does not carry this; the Boundaries section covers features, prices, municipalities/institutions and the AI-coaching track only. Claim must come from SRC-0003.
