---
artefact: requirement
id: FUN-WEB-0191
class: FUN
form: F1
domain: WEB
status: DRAFT
version: 0.1.0
area: forms-and-leads
needs: [NEED-WEB-0011, NEED-WEB-0024]
source:
  source_id: UNKNOWN
  loc: "UNKNOWN"
  excerpt: "UNKNOWN"
evidence_sufficiency: S3
fit_criterion:
  scale: "acceptance criteria of FUN-WEB-0191 that pass"
  operator: "="
  value: 3
  unit: criteria
  meter: "TS-WEB-0016-A11, TS-WEB-0016-A12, TS-WEB-0016-A21 — 1 of 3 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T17:20:00+02:00"
---

# FUN-WEB-0191

For the WhatsApp route of newsletter signup, the website SHALL use a click-to-chat link with a prefilled subscribe message.

## Source

DEC-0051, DEC-0052

Unlocatable: DEC-0052 §4 establishes the WhatsApp route and its preference, then explicitly defers what that route needs to `TS-WEB-0016 D10` (lines 99-100). No click-to-chat link and no prefilled subscribe message appear anywhere in the record.

Finding: Neither cited record carries the mechanism: DEC-0051 is named first and routes signup through envoy, DEC-0052 names the channel but hands the implementation to the tactical spec TS-WEB-0016 D10, which is not cited here.
