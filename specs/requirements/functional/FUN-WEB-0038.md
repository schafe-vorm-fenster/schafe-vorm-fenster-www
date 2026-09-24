---
artefact: requirement
id: FUN-WEB-0038
class: FUN
form: F1
domain: WEB
status: DRAFT
version: 0.1.0
area: relevance-and-proof
source: "SRC-0002#required-data"
evidence_sufficiency: S2
---

# FUN-WEB-0038

When ranking proof, the website SHALL compute geo proximity against the five-level location model `place · municipality · county · state · country` carried by `geo:` frontmatter in `@schafe-vorm-fenster/media-echo` and `proof/`.

## Notes

The media-echo `geo:` data is complete, 34/34.
