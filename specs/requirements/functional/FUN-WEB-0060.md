---
artefact: requirement
id: FUN-WEB-0060
class: FUN
form: F1
domain: WEB
status: DRAFT
version: 0.1.0
area: localization
source:
  source_id: SRC-0006
  loc: "UNKNOWN"
  excerpt: "Ich habe kein Single-Top-Level-Domain-Konzept, sondern ein Pro Land-Top-Level-Domain-Konzept. Scharf vom Fenster. de natürlich für Deutschland. Dann haben wir eine polnische Domain für Polen."
evidence_sufficiency: S3
fit_criterion: UNKNOWN
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-09T16:07:54+02:00"
---

# FUN-WEB-0060

For each country it serves, the website SHALL run one domain: `www.schafe-vorm-fenster.de` (de), `owcezaoknem.pl` (pl), `schafvormfenster.at` (at), `sheepoutside.com` (international, en).

## Source

SRC-0006, DEC-0003, DEC-0035

Unlocatable: the transcript is one line with no line terminators, so it supports no position scheme.

Finding: Transcript names only the German domain (as "Scharf vom Fenster. de") and speaks vaguely of a Polish, an Austrian and an international (.com/.org) domain; owcezaoknem.pl, schafvormfenster.at and sheepoutside.com never appear.

## Notes

All four are registered; DNS wiring for the international domain is pending.
