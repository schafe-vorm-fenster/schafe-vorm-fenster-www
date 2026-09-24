---
artefact: requirement
id: FUN-WEB-0062
class: FUN
domain: WEB
status: DRAFT
area: localization
source: "SRC-0007, DEC-0005"
evidence_sufficiency: S3
---

# FUN-WEB-0062

Locale determination shall be entirely server-side: no middleware state, no cookies, no `Accept-Language` at render time. The URL is the preference.
