---
artefact: requirement
id: FUN-WEB-0093
class: FUN
domain: WEB
status: DRAFT
area: forms-and-leads
source: "DEC-0010, DEC-0081"
evidence_sufficiency: S3
---

# FUN-WEB-0093

A booking action on any page shall resolve to that page's contact section; the section's first action row shall be the Google Calendar appointment link (outbound navigation, no embed). `request-product-briefing` completes on that row's activation, not on the in-page action. **Every row of the section additionally carries `make-contact`**, counted per channel and with the route, and named as an **intent** — three of the four rows hand the visitor to another application, so the contact itself is not observable. An in-page action emits nothing.
