---
artefact: requirements
area: live-data
status: DRAFT
sources: [SRC-001, SRC-002]
---

# Live Data

| ID | Requirement | Source | Suff. |
| --- | --- | --- | --- |
| WEB-F-040 | The website shall embed live data from the app wherever it proves something: place search, "this week nearby", active places, embedded customer calendar, live counters. | SRC-001#5-live-data-carries-the-argument | S2 |
| WEB-F-041 | Traction figures shall be counted live or not shown; static figures are forbidden (`proof/reach-and-usage.proof.md` is `expired` for this reason). | SRC-001#5 | S2 |
| WEB-F-042 | Live modules shall follow the widening chain of SRC-002 §Live Content (place → ~15 km → county → all regions). | SRC-002#live-content | S2 |
| WEB-F-043 | On pages whose focus job is "run our own calendar", module 1 shall be replaced by the embed demo: the Portalize calendar filtered to the place just searched for. | SRC-002#live-content | S2 |
| WEB-F-044 | Empty state: if a place carries no dates, the chain starts at radius 2 and the page shifts its focus job to "publish our dates" ("nothing has been entered in <place> yet — you could be the first"). This is the only runtime focus-job change on the website. | SRC-002#live-content, SRC-003#your-place | S2 |
| WEB-F-045 | Live modules shall degrade gracefully: an empty result is a conversion occasion, never an error state. | SRC-001#5 | S2 |

## Dependency

Live modules build against the ecosystem services registered in
`../../contracts/api-contracts.md` (SRC-011): events-api (search per
community/scope/category; public `/api/stats` for counters), geo-api
(place search, hierarchy, findbyaddress), calendar-api (organizer/embed
metadata). Integration follows the product's OpenAPI convention (DEC-021):
fetch and pin `openapi.json` at build time, validate responses with
derived Zod schemas. Remaining sliver: Q-015 (do the `/api/stats` fields
cover all three counter figures?).
