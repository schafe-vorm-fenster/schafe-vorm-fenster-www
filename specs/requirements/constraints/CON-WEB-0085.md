---
artefact: requirement
id: CON-WEB-0085
class: CON
form: C1
domain: WEB
status: DRAFT
version: 0.1.0
area: forms-and-leads
source:
  source_id: UNKNOWN
  loc: "UNKNOWN"
  excerpt: "UNKNOWN"
evidence_sufficiency: S3
fit_criterion:
  scale: "acceptance criteria of CON-WEB-0085 that pass"
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

# CON-WEB-0085

The solution SHALL keep both newsletter routes cookieless and GDPR-compliant, imposed by DEC-0004 and DEC-0051.

## Source

DEC-0051, DEC-0052

Unlocatable: DEC-0052 does not carry it either. Its §4 (lines 95-96) establishes the two channels (e-mail and WhatsApp), but no line of DEC-0052 states cookieless operation or GDPR compliance — a grep for cookie/GDPR/DSGVO/Datenschutz/privacy over the record returns only 'double opt-in' on line 110, which is a restatement of DEC-0051's Q-0020 resolution, not a data-protection property.

Finding: Neither record in this requirement's own source list (DEC-0051 first, DEC-0052 second) states the cookieless/GDPR property; per instruction DEC-0004, which the requirement's prose names but its source list does not, was not used.
