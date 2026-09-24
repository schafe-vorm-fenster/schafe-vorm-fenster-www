---
artefact: requirement
id: FUN-WEB-0171
class: FUN
form: F1
domain: WEB
status: DRAFT
version: 0.1.0
area: content-pipeline
source:
  source_id: SRC-0009
  loc: "go-to-market-os/handbook/decisions/001-content-source-of-truth.adr.md#L63"
  excerpt: "`packages/foundation-*`, published to GitHub Packages under the"
evidence_sufficiency: S3
fit_criterion:
  scale: "acceptance criteria of FUN-WEB-0171 that pass"
  operator: "="
  value: 2
  unit: criteria
  meter: "TS-WEB-0007-A7, TS-WEB-0007-A8 — 2 of 2 referenced by a test"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T17:20:00+02:00"
---

# FUN-WEB-0171

For ContentHub raw material, the website SHALL consume it as npm packages from `npm.pkg.github.com`, installed as devDependencies.

## Source

SRC-0009 ADR-001, SRC-0006, DEC-0020

Finding: ADR-001 supports `packages published to GitHub Packages` only. Neither the registry host `npm.pkg.github.com` nor `devDependencies` occurs anywhere in ADRs 001-004; those details must come from SRC-0006 / DEC-0020.

## Notes

Until publication, by reference to repository paths.
