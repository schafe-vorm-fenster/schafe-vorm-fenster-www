---
artefact: requirement
id: FUN-WEB-0082
class: FUN
form: F0
domain: WEB
status: DRAFT
area: content-pipeline
source: "SRC-0006, DEC-0020"
evidence_sufficiency: S3
---

# FUN-WEB-0082

Generated website contents shall live in this repository's content folder as markdown + frontmatter with optional co-located assets, per target language. Build **and** runtime (dynamic loading, geo-based selection) read exclusively from these local files — never from GTM at request time.
