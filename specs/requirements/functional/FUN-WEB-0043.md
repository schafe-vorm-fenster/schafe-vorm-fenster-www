---
artefact: requirement
id: FUN-WEB-0043
class: FUN
form: F1
domain: WEB
status: DRAFT
version: 0.1.0
area: live-data
source: "SRC-0002#live-content, DEC-0030"
evidence_sufficiency: S3
---

# FUN-WEB-0043

On pages whose focus job is "run our own calendar", the website SHALL replace module 1 with the embed demo — the **real Portalize widget via its loader** (`/api/{organizerId}/load.js`, web-component mode), filtered to the place just searched for.

## Notes

The filter parameter is demand Q-0026, including cookie-freedom verification.
