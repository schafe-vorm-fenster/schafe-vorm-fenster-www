---
artefact: requirements
area: forms-and-leads
status: DRAFT
sources: [SRC-0003]
decisions: [DEC-0009, DEC-0010, DEC-0011, DEC-0012, DEC-0051, DEC-0052, DEC-0081]
---

# Forms and Leads

| ID | Requirement | Source | Suff. |
| --- | --- | --- | --- |
| FUN-WEB-0090 | The lead forms the website carries — the quote request and the order flow's invoice step — shall be provided by the envoy web-component widget; the website embeds it and ships no own form backend. **There is no general contact form**: contact is a standing section of static channel rows (DEC-0081). | DEC-0009, DEC-0081 | S3 |
| FUN-WEB-0091 | The envoy widget shall be themed through CSS variables supplied by the website (brand kit values); the required variable set is part of the widget contract (Q-0022). | DEC-0009 | S3 |
| FUN-WEB-0092 | Data storage and delivery of submissions is owned by envoy-api; the website holds no submission data. | DEC-0009 | S3 |
| FUN-WEB-0093 | A booking action on any page shall resolve to that page's contact section; the section's first action row shall be the Google Calendar appointment link (outbound navigation, no embed). `request-product-briefing` completes on that row's activation, not on the in-page action. **Every row of the section additionally carries `make-contact`**, counted per channel and with the route, and named as an **intent** — three of the four rows hand the visitor to another application, so the contact itself is not observable. An in-page action emits nothing. | DEC-0010, DEC-0081 | S3 |
| FUN-WEB-0094 | The compose/checkout flow shall conclude on invoice: invoice details in, embed code out immediately; no payment provider. The order goes to envoy as a structured event and from there into accounting (DEC-0051). | DEC-0011, DEC-0051 | S3 |
| FUN-WEB-0095 | External media (podcast, TV, social) shall be represented by own previews plus outbound links — never by third-party embeds. | DEC-0013 | S3 |
| FUN-WEB-0096 | Newsletter signup shall carry `subscribe-to-newsletter` and shall offer **both** its channels — e-mail and WhatsApp, WhatsApp preferred (DEC-0052 §4 as amended); a surface offering e-mail only does not satisfy the goal. The e-mail route implements double opt-in through envoy (DEC-0051), as a row of the Q-0022 contract; the WhatsApp route is a click-to-chat link with a prefilled subscribe message. Both routes are cookieless and GDPR-compliant, and neither ships before a sending system is in operation. | DEC-0051, DEC-0052 | S3 |
