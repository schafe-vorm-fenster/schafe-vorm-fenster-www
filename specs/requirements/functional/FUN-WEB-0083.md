---
artefact: requirement
id: FUN-WEB-0083
class: FUN
form: F1
domain: WEB
status: DRAFT
version: 0.1.0
area: content-pipeline
needs: [UNKNOWN]
source:
  source_id: SRC-0006
  loc: "UNKNOWN"
  excerpt: "UNKNOWN"
evidence_sufficiency: S3
fit_criterion:
  scale: "acceptance criteria of FUN-WEB-0083 that pass"
  operator: "="
  value: 2
  unit: criteria
  meter: "TS-WEB-0007-A15, TS-WEB-0007-A2 — 1 of 2 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-09T16:07:54+02:00"
---

# FUN-WEB-0083

In every content file, the website SHALL carry a machine-readable frontmatter reference to the GTM package(s) and version(s) it derives from.

## Source

SRC-0006, DEC-0020

Unlocatable: Transcript mentions markdown frontmatter and wanting versioning, but never a machine-readable frontmatter reference to the source package and its version.

Finding: The frontmatter provenance field is DEC-0020's design, not stated in SRC-0006.

## Notes

The update workflow (FUN-WEB-0175, FUN-WEB-0176, FUN-WEB-0177) keys on this reference.
