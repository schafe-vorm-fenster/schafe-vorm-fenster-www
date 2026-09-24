---
artefact: requirement
id: FUN-WEB-0172
class: FUN
form: F1
domain: WEB
status: DRAFT
version: 0.1.0
area: content-pipeline
source:
  source_id: SRC-0006
  loc: "UNKNOWN"
  excerpt: "auf Basis der Dependencies dann Playbooks bauen und auf Basis dieser Playbooks dann am Ende die konkreten Contents in den jeweiligen Sprachen, die wir brauchen."
evidence_sufficiency: S3
fit_criterion:
  scale: "acceptance criteria of FUN-WEB-0172 that pass"
  operator: "="
  value: 3
  unit: criteria
  meter: "TS-WEB-0007-A1, TS-WEB-0007-A14, TS-WEB-0007-A15 — 2 of 3 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T17:20:00+02:00"
---

# FUN-WEB-0172

For a website text, the content pipeline SHALL generate it from the package raw material through the agent skills and playbooks.

## Source

SRC-0006, DEC-0020

Unlocatable: the transcript is one line with no line terminators, so it supports no position scheme.

Finding: Transcript names playbooks and packages; "agent skills" as the generation mechanism is not mentioned (an agent appears only in the later diff step).
