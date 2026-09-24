---
artefact: requirements
area: live-data
status: DRAFT
sources: [SRC-0001, SRC-0002]
---

# Live Data

| ID | Requirement | Source | Suff. |
| --- | --- | --- | --- |
| FUN-WEB-0040 | The website shall embed live data from the app wherever it proves something: place search, "this week nearby", active places, embedded customer calendar, live counters. | SRC-0001#5-live-data-carries-the-argument | S2 |
| FUN-WEB-0041 | Traction figures shall be counted live or not shown; static figures are forbidden (`proof/reach-and-usage.proof.md` is `expired` for this reason). | SRC-0001#5 | S2 |
| FUN-WEB-0042 | Live modules shall follow the widening chain of SRC-0002 §Live Content (place → ~15 km → county → all regions). | SRC-0002#live-content | S2 |
| FUN-WEB-0043 | On pages whose focus job is "run our own calendar", module 1 shall be replaced by the embed demo: the **real Portalize widget via its loader** (`/api/{organizerId}/load.js`, web-component mode), filtered to the place just searched for (filter parameter: demand Q-0026, incl. cookie-freedom verification). | SRC-0002#live-content, DEC-0030 | S3 |
| FUN-WEB-0044 | Empty state: if a place carries no dates, the chain starts at radius 2 and the page shifts its focus job to "publish our dates" ("nothing has been entered in <place> yet — you could be the first"). This is the only runtime focus-job change on the website. | SRC-0002#live-content, SRC-0003#your-place | S2 |
| FUN-WEB-0045 | Live modules shall degrade gracefully: an empty result is a conversion occasion, never an error state. | SRC-0001#5 | S2 |

## Dependency

Live modules build against the ecosystem services registered in
`../../contracts/api-contracts.md` (SRC-0011): events-api (search per
community/scope/category; public `/api/stats` for counters), geo-api
(place search, hierarchy, findbyaddress), calendar-api (organizer/embed
metadata). Integration follows the product's OpenAPI convention (DEC-0021):
fetch and pin `openapi.json` at build time, validate responses with
derived Zod schemas. Remaining sliver: Q-0015 (do the `/api/stats` fields
cover all three counter figures?).
