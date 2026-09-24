---
artefact: requirement
id: FUN-WEB-0073
class: FUN
form: F1
domain: WEB
status: DRAFT
version: 0.1.0
area: seo
needs: [NEED-WEB-0006]
source:
  source_id: SRC-0006
  loc: "UNKNOWN"
  excerpt: "Canonical Text natürlich auch und so."
evidence_sufficiency: S2
fit_criterion:
  scale: "acceptance criteria of FUN-WEB-0073 that pass"
  operator: "="
  value: 1
  unit: criteria
  meter: "TS-WEB-0004-A5 — 1 of 1 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-09T16:07:54+02:00"
---

# FUN-WEB-0073

Site-wide, the website SHALL provide canonical tags and per-domain, language-aware XML sitemaps, coordinated with the hreflang matrix (FUN-WEB-0065).

## Source

SRC-0006, convention

Unlocatable: the transcript is one line with no line terminators, so it supports no position scheme.

Finding: Only canonicals are in the transcript (as "Canonical Text"). XML sitemaps, per-domain sitemaps and the hreflang matrix are not mentioned anywhere in SRC-0006.
