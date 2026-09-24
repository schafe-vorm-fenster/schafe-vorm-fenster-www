---
artefact: requirement
id: FUN-WEB-0186
class: FUN
form: F1
domain: WEB
status: DRAFT
version: 0.1.0
area: forms-and-leads
needs: [NEED-WEB-0011, NEED-WEB-0024]
source:
  source_id: DEC-0052
  loc: "specs/decisions/DEC-0052--page-level-answers.md#L95"
  excerpt: "**The newsletter reaches people by e-mail or by WhatsApp, and WhatsApp"
evidence_sufficiency: S3
fit_criterion:
  scale: "acceptance criteria of FUN-WEB-0186 that pass"
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

# FUN-WEB-0186

For newsletter signup, the website SHALL offer both channels — e-mail and WhatsApp, WhatsApp preferred — carrying `subscribe-to-newsletter`.

## Source

DEC-0051, DEC-0052

Finding: DEC-0052 §4 (as amended 2026-09-24) supports it and is named second; DEC-0051 is named first and knows no channels. 'is the preferred route.**' completes the sentence on line 96, and the `subscribe-to-newsletter` goal id is at line 87 (§3).

## Rationale

A surface offering e-mail only does not satisfy the goal (DEC-0052 §4 as amended).
