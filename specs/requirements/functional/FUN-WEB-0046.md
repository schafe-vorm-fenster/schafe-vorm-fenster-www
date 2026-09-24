---
artefact: requirement
id: FUN-WEB-0046
class: FUN
form: F0
domain: WEB
status: DRAFT
area: place-search
source: "DEC-0079, DEC-0024"
evidence_sufficiency: S3
---

# FUN-WEB-0046

The place search shall ask for a **place name**. The typed string shall be matched against place names and against municipality names, and a match shall be offered as the place, rendered "Ort (Gemeinde)". A postcode shall not be offered as a product feature — not as an input mode, not in the label, the placeholder, a helper text or page copy, and no search surface shall state an interim. Where the names come from is an implementation detail and free (today the committed covered-community index of TS-WEB-0008 D7, later a geo-api name endpoint — Q-0025); what is promised to the visitor is the name, not the store that answers it. Suggestions shall cover the covered communities; a name outside them shall produce no suggestion and shall still reach `/dein-ort/starten` on submit (FUN-WEB-0047). Germany-wide finding by name is the target, carried by Q-0025 — decided by the DEC-0079 amendment of 2026-09-24, which closes Q-0071. `findbyaddress` shall not be used (external Google lookup — slow, paid).
