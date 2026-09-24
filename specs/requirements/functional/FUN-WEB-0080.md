---
artefact: requirement
id: FUN-WEB-0080
class: FUN
form: F0
domain: WEB
status: DRAFT
version: 0.1.0
area: content-pipeline
source: "SRC-0009 ADR-001, SRC-0006, DEC-0020"
evidence_sufficiency: S3
---

# FUN-WEB-0080

ContentHub raw material (English, markdown + frontmatter) shall be consumed as npm packages from the private GitHub registry (`npm.pkg.github.com`), installed as devDependencies; until publication by reference to repo paths. Raw content is never copied into this repository.
