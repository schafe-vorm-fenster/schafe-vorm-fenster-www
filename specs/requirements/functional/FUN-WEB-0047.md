---
artefact: requirement
id: FUN-WEB-0047
class: FUN
form: F0
domain: WEB
status: DRAFT
version: 0.1.0
area: place-search
source: "DEC-0024, DEC-0036, DEC-0037, DEC-0079"
evidence_sufficiency: S3
---

# FUN-WEB-0047

Searching a place the system does not carry shall lead to `/dein-ort/starten` — "nothing entered in <place> yet" plus the founding flow, with the place as a query parameter. A typed name that matches nothing is such a place: it yields no suggestion, is not an error, and shall still reach this route when the form is submitted, so the search never answers a visitor with silence and never asks her to type something else. It is the escalation of the place-search axis (dates → no dates → no place) and therefore sits under `/dein-ort`.
