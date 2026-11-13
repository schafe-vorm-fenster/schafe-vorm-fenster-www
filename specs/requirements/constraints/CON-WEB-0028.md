---
artefact: requirement
id: CON-WEB-0028
class: CON
form: C1
domain: WEB
status: DRAFT
version: 0.1.0
area: privacy
needs: [NEED-WEB-0017, NEED-WEB-0022, NEED-WEB-0029]
source:
  source_id: SRC-0006
  loc: "UNKNOWN"
  excerpt: "Im Moment machen wir das mit E-Tracker."
evidence_sufficiency: S3
fit_criterion:
  scale: "acceptance criteria of CON-WEB-0028 that pass"
  operator: "="
  value: 3
  unit: criteria
  meter: "TS-WEB-0012-A10, TS-WEB-0012-A3, TS-WEB-0012-A9 — 2 of 3 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T16:45:00+02:00"
---

# CON-WEB-0028

The solution SHALL use eTracker as its analytics implementation, imposed by DEC-0004 and DEC-0028.

## Source

SRC-0006, DEC-0004, DEC-0028

Unlocatable: the transcript is one line with no line terminators, so it supports no position scheme.

## Rationale

An interim decision, replaceable. DEC-0004 adopted it as the cookieless option available at the time; nothing in this specification depends on the vendor beyond the event contract in TS-WEB-0012.
