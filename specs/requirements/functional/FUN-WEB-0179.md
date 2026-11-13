---
artefact: requirement
id: FUN-WEB-0179
class: FUN
form: F1
domain: WEB
status: DRAFT
version: 0.1.0
area: content-pipeline
needs: [UNKNOWN]
source:
  source_id: SRC-0009
  loc: "go-to-market-os/handbook/decisions/001-content-source-of-truth.adr.md#L171"
  excerpt: "is better fetched at build time than versioned."
evidence_sufficiency: S3
fit_criterion:
  scale: "acceptance criteria of FUN-WEB-0179 that pass"
  operator: "="
  value: 2
  unit: criteria
  meter: "TS-WEB-0007-A12, TS-WEB-0007-A2 — 2 of 2 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T17:20:00+02:00"
---

# FUN-WEB-0179

For feed-like content, the website SHALL fetch it at build time rather than version it as a package.

## Source

SRC-0009 ADR-001, DEC-0022

Finding: The line sits under `## Open Questions` (`2. **Packaged or fetched at build time?**`) and is phrased as `is better ... than`, i.e. an undecided preference. The requirement upgrades it to a SHALL.

## Notes

`media-echo/verified/` for `/ueber-uns/archiv` and inline proof.
