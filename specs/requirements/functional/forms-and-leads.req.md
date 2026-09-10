---
artefact: requirements
area: forms-and-leads
status: DRAFT
sources: [SRC-003]
decisions: [DEC-009, DEC-010, DEC-011, DEC-012]
---

# Forms and Leads

| ID | Requirement | Source | Suff. |
| --- | --- | --- | --- |
| WEB-F-090 | All lead forms (contact, quote request, briefing request) shall be provided by the envoy web-component widget; the website embeds it and ships no own form backend. | DEC-009 | S3 |
| WEB-F-091 | The envoy widget shall be themed through CSS variables supplied by the website (brand kit values); the required variable set is part of the widget contract (Q-022). | DEC-009 | S3 |
| WEB-F-092 | Data storage and delivery of submissions is owned by envoy-api; the website holds no submission data. | DEC-009 | S3 |
| WEB-F-093 | `request-product-briefing` shall resolve to a Google Calendar appointment link (outbound navigation, no embed). | DEC-010 | S3 |
| WEB-F-094 | The compose/checkout flow shall conclude on invoice: invoice details in, embed code out immediately; no payment provider. The order goes to envoy as a structured event and from there into accounting (DEC-051). | DEC-011, DEC-051 | S3 |
| WEB-F-095 | External media (podcast, TV, social) shall be represented by own previews plus outbound links — never by third-party embeds. | DEC-013 | S3 |
| WEB-F-096 | Newsletter signup shall implement double opt-in, cookieless, GDPR-compliant; signup and double opt-in run through envoy (DEC-051), as a row of the Q-022 contract. | DEC-051 | S3 |
