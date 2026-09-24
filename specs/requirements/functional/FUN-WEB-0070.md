---
artefact: requirement
id: FUN-WEB-0070
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
  excerpt: "entweder die Einstiegs-URLs zu Content-Seiten zur bisherigen Live-Seite stabil bleiben müssen oder wir vernünftige Umleitungen auf die neuen Content-Seiten brauchen."
evidence_sufficiency: S2
fit_criterion:
  scale: "acceptance criteria of FUN-WEB-0070 that pass"
  operator: "="
  value: 3
  unit: criteria
  meter: "TS-WEB-0011-A1, TS-WEB-0011-A13, TS-WEB-0011-A2 — 2 of 3 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T17:20:00+02:00"
---

# FUN-WEB-0070

For an existing entry URL of the live site, the website SHALL keep it stable or answer it with a 301 redirect to its successor.

## Source

SRC-0006

Unlocatable: the transcript is one line with no line terminators, so it supports no position scheme.

Finding: Transcript says "vernünftige Umleitungen"; the HTTP status 301 is not in the source.

## Rationale

The goal is to preserve the current search rank.

## Notes

A legacy URL inventory is required and does not exist yet — Q-0016, from SRC-0010.
