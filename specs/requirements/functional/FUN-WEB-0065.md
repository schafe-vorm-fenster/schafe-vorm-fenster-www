---
artefact: requirement
id: FUN-WEB-0065
class: FUN
form: F1
domain: WEB
status: DRAFT
version: 0.1.0
area: localization
needs: [NEED-WEB-0006]
source:
  source_id: SRC-0007
  loc: "community-calendar/docs/localization-architecture.md#L354"
  excerpt: "Its hreflang set must explicitly cross-reference both German domains and all language variants"
evidence_sufficiency: S3
fit_criterion:
  scale: "acceptance criteria of FUN-WEB-0065 that pass"
  operator: "="
  value: 1
  unit: criteria
  meter: "TS-WEB-0001-A5 — 1 of 1 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-09T16:07:54+02:00"
---

# FUN-WEB-0065

On every full-site page, the website SHALL emit a complete hreflang matrix linking all domain × language combinations.

## Source

SRC-0007, DEC-0005

Finding: This is the only normative "must" about a full domain x language hreflang set, but it is scoped to the `.at` domain (Section 6.4). No line states the matrix is emitted on *every* full-site page; the nearest general statement is the E2E gap item on line 510 ("Hreflang tags present for all 5 languages + `x-default`").
