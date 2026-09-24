---
artefact: requirement
id: CON-WEB-0003
class: CON
form: C1
domain: WEB
status: DRAFT
version: 0.1.0
area: technical-constraints
source:
  source_id: SRC-0006
  loc: "UNKNOWN"
  excerpt: "Das fängt schon beim Branding mit der Schriftart an. Wir müssen im Brandkit nochmal nachgucken."
evidence_sufficiency: S3
fit_criterion:
  scale: "acceptance criteria of CON-WEB-0003 that pass"
  operator: "="
  value: 4
  unit: criteria
  meter: "TS-WEB-0017-A15, TS-WEB-0017-A5, TS-WEB-0017-A6, TS-WEB-0017-A7 — 1 of 4 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-09T16:07:54+02:00"
---

# CON-WEB-0003

The solution SHALL take typography (Atkinson Hyperlegible Next), tokens, logos and imagery rules from `@schafe-vorm-fenster/brand-design` (tokens, assets) and `@schafe-vorm-fenster/brand-identity` (imagery, tone), imposed by DEC-0043 and DEC-0044.

## Source

SRC-0006, DEC-0043, DEC-0044

Unlocatable: the transcript is one line with no line terminators, so it supports no position scheme.

Finding: Transcript says only that the brand kit and its font must be used; it never names Atkinson Hyperlegible, @schafe-vorm-fenster/brand-design or @schafe-vorm-fenster/brand-identity.
