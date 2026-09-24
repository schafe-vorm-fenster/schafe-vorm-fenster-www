---
artefact: requirement
id: FUN-WEB-0106
class: FUN
domain: WEB
status: DRAFT
area: rendering-and-resilience
source: "DEC-0033, SRC-0014#skeletons, DEC-0056"
evidence_sufficiency: S3
---

# FUN-WEB-0106

Every module whose data arrives after the shell — above all geo-personalized content — renders a skeleton immediately and streams in. Skeletons reserve the final space at the declared ratio (NFR-WEB-0009), do **not** animate, and are replaced by the designed empty state after two seconds. Blocking spinners are forbidden.
