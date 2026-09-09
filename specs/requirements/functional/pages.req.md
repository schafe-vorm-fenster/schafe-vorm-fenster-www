---
artefact: requirements
area: pages
status: DRAFT
sources: [SRC-003]
---

# Pages

Primary source: SRC-003 (`go-to-market-os/concept/website-information-architecture.concept.md`).
Page briefs (structure, audiences in priority order, live modules) are
defined there per page and referenced — this file fixes existence, route,
focus job, and primary conversion. Conversion goal IDs resolve in
`go-to-market-os/strategy/conversion-goals/`.

| ID | Route | Focus job | Primary conversion | Source | Suff. |
| --- | --- | --- | --- | --- | --- |
| WEB-F-010 | `/` | set by entry context (default: know what is on) | the focus job's CTA; none of its own | SRC-003#home | S2 |
| WEB-F-011 | `/dein-ort` | know what is on | `save-calendar-to-homescreen` | SRC-003#your-place-dein-ort | S2 |
| WEB-F-012 | `/mitmachen` | publish our dates | `register-as-publisher` | SRC-003#publish-our-dates-mitmachen | S2 |
| WEB-F-013 | `/mitmachen/registrieren` | publish our dates | `publish-first-event` (handover to the app) | SRC-003#register-mitmachenregistrieren | S2 |
| WEB-F-014 | `/eigener-kalender` | run our own calendar | `buy-calendar-licence`; equal `request-product-briefing` | SRC-003#run-our-own-calendar-eigener-kalender | S2 |
| WEB-F-015 | `/eigener-kalender/zusammenstellen` | run our own calendar | `buy-calendar-licence` | SRC-003#compose-the-calendar | S2 |
| WEB-F-016 | `/eigener-kalender/region` | run our own calendar | `request-licence-quote` | SRC-003#for-a-whole-region | S2 |
| WEB-F-017 | `/warum-wir` | understand who is behind it | none; closing CTA offers all three jobs | SRC-003#why-us-warum-wir | S2 |
| WEB-F-018 | `/warum-wir/archiv` | understand who is behind it | none; only list-shaped page, not a destination | SRC-003#archive | S2 |

Additional page-level requirements:

| ID | Requirement | Source | Suff. |
| --- | --- | --- | --- |
| WEB-F-019 | The conversion map in SRC-003 shall be complete on the website: every conversion goal listed there is carried by the pages named there; `order-promotion-material` has no page yet (Q-005). | SRC-003#conversion-map | S2 |
| WEB-F-020 | Pricing display: `480 €/year` is public (offering `portalize-calendar`, `promotion: promoted`); the region/enterprise price is not published; offerings with `promotion: withheld` are not offered on the website. | SRC-003#run-our-own-calendar, `go-to-market-os/offerings/` | S2 |
| WEB-F-021 | Footer shall carry contact, newsletter, imprint, data protection, and the accessibility statement (WEB-Q-027); the header carries the persistent "Kalender" button to `/dein-ort`. Help lives in the app, not on the website. | SRC-003#navigation, DEC-012 | S2 |
| WEB-F-022 | The region page shall state a two-working-day response promise on the quote request. The promise is an operational commitment: the lead-handling process behind the envoy widget (WEB-F-090) must be able to keep it — flagged to envoy/ops as part of Q-022. | SRC-003#for-a-whole-region | S2 |
