---
artefact: requirement
id: FUN-WEB-0055
class: FUN
form: F1
domain: WEB
status: DRAFT
version: 0.1.0
area: personalization
source:
  source_id: SRC-0001
  loc: "go-to-market-os/concept/website-communication-principles.concept.md#L282"
  excerpt: "entry context | referrer, UTM, campaign, deep link | focus job and proof type preselected"
evidence_sufficiency: S2
fit_criterion:
  scale: "acceptance criteria of FUN-WEB-0055 that pass"
  operator: "="
  value: 1
  unit: criteria
  meter: "TS-WEB-0005-A8 — 1 of 1 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-09T16:07:54+02:00"
---

# FUN-WEB-0055

From the entry context (referrer, UTM, campaign, deep link), the website SHALL preselect the focus job and proof type per the context matrix (SRC-0002).

## Source

SRC-0001#6, SRC-0002#context-matrix

Finding: The reference to a context matrix in SRC-0002 is not in this source; this file gives the examples inline (social, LinkedIn, print QR).
