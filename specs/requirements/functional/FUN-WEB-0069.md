---
artefact: requirement
id: FUN-WEB-0069
class: FUN
domain: WEB
status: DRAFT
area: localization
source: "SRC-0007, DEC-0038"
evidence_sufficiency: S2
---

# FUN-WEB-0069

First-visit language/country suggestion — deferred (Q-0011). When built it shall be **client-side only**, shown **once** per visitor (sessionStorage), and must never influence server rendering or vary a cached response: pages stay statically cacheable. Path-determined language remains the rule; the suggestion only offers a link.
