---
artefact: requirement
id: NFR-WEB-0009
class: NFR
form: Q0
domain: WEB
status: DRAFT
area: performance
source: "SRC-0014#aspect-ratios-and-reserved-space, DEC-0056"
evidence_sufficiency: S3
---

# NFR-WEB-0009

Every box that will hold asynchronous content shall declare its ratio or height **before** the content arrives — `aspect-ratio` on the media element, never a fixed pixel height; text that arrives with data reserves its height in line units. Nothing may push the page down after paint.
