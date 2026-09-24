---
artefact: requirement
id: NFR-WEB-0022
class: NFR
form: Q1
domain: WEB
status: DRAFT
version: 0.1.0
area: privacy
source:
  source_id: SRC-0006
  loc: "UNKNOWN"
  excerpt: "Wir machen jetzt auch kein neues Tracking-Ad-Hoc, sondern wir nutzen E-Tracker erstmal genauso weiter."
evidence_sufficiency: S3
fit_criterion:
  scale: "Analytics, tag and pixel vendors in the build and in the rendered markup"
  operator: "="
  value: 1
  unit: "vendor"
  meter: "TS-WEB-0012-A9 — run by TS-WEB-0012-A1, TS-WEB-0012-A11, TS-WEB-0012-A9"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T16:45:00+02:00"
---

# NFR-WEB-0022

Analytics, tag and pixel vendors in the build and in the rendered markup SHALL be = 1 vendor, measured by TS-WEB-0012-A9.

## Source

SRC-0006, DEC-0004

Unlocatable: the transcript is one line with no line terminators, so it supports no position scheme.

## Notes

Original statement: "No new ad-hoc tracking is introduced with the relaunch." DEC-0087 read this as a quality requirement with no measure. The measure exists: TS-WEB-0012-A9 is "Exactly one analytics loader in the rendered HTML, with `data-block-cookies=\"true\"` and the secure code from an env var; no second analytics/tag/pixel vendor in dependencies or markup." The one vendor is eTracker (CON-WEB-0028).
