---
artefact: requirement
id: NFR-WEB-0039
class: NFR
form: Q1
domain: WEB
status: DRAFT
version: 0.1.0
area: performance
needs: [NEED-WEB-0005, NEED-WEB-0014]
source:
  source_id: SRC-0006
  loc: "UNKNOWN"
  excerpt: "Ich hätte eigentlich wirklich gerne einen Lighthouse Performance Score für 100. auf Desktop und Mobile, soweit das geht. 98 Minimum."
evidence_sufficiency: S3
fit_criterion: UNKNOWN
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T16:45:00+02:00"
---

# NFR-WEB-0039

Lighthouse Performance score of every route of TS-WEB-0003 D7, on mobile, SHALL be >= 98 points, measured by TS-WEB-0003-A1.

## Source

SRC-0006, DEC-0007

Unlocatable: the transcript is one line with no line terminators, so it supports no position scheme.

## Rationale

100 is the target and 98 the floor. The floor is the value here because it is the one a gate enforces — TS-WEB-0003 D7: "Performance < 98 fails the build."
