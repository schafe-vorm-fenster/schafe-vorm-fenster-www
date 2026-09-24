---
artefact: requirement
id: FUN-WEB-0062
class: FUN
form: F1
domain: WEB
status: DRAFT
area: localization
source: "SRC-0007, DEC-0005"
evidence_sufficiency: S3
---

# FUN-WEB-0062

For every request, the website SHALL determine the locale entirely server-side — no middleware state, no cookies, no `Accept-Language` at render time.

## Notes

The URL is the preference.
