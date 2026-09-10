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
| WEB-F-014 | `/dein-kalender` | run our own calendar | `buy-calendar-licence`; equal `request-product-briefing` | SRC-003, DEC-036 | S3 |
| WEB-F-015 | `/dein-kalender/bestellen` | run our own calendar | `buy-calendar-licence` | SRC-003, DEC-011, DEC-036 | S3 |
| WEB-F-016 | `/deine-region` | run our own calendar | `request-licence-quote` | SRC-003, DEC-036 | S3 |
| WEB-F-017 | `/ueber-uns` | understand who is behind it | none; closing CTA offers all three jobs | SRC-003, DEC-036 | S3 |
| WEB-F-018 | `/ueber-uns/archiv` | understand who is behind it | none; only list-shaped page, not a destination | SRC-003#archive | S2 |

Additional page-level requirements:

| ID | Requirement | Source | Suff. |
| --- | --- | --- | --- |
| WEB-F-019 | The conversion map in SRC-003 shall be complete on the website: every conversion goal listed there is carried by the pages named there; `order-promotion-material` has no page yet (Q-005). | SRC-003#conversion-map | S2 |
| WEB-F-020 | Pricing display: `480 €/year` is public (offering `portalize-calendar`, `promotion: promoted`); the region/enterprise price is not published; offerings with `promotion: withheld` are not offered on the website. | SRC-003#run-our-own-calendar, `go-to-market-os/offerings/` | S2 |
| WEB-F-021 | Footer shall carry contact, newsletter, and the legal links — "Impressum", "Datenschutz", "Barrierefreiheit" — each pointing at its anchor on `/rechtliches` (WEB-F-029); the header carries the persistent "Kalender" button to `/dein-ort`. Help lives in the app, not on the website. | SRC-003#navigation, DEC-012, DEC-039 | S3 |
| WEB-F-022 | The region page shall state a two-working-day response promise on the quote request. The promise is an operational commitment: the lead-handling process behind the envoy widget (WEB-F-090) must be able to keep it — flagged to envoy/ops as part of Q-022. | SRC-003#for-a-whole-region | S2 |
| WEB-F-026 | The 404 page returns real status 404 with `noindex` and mini content: one sentence, the place search as the dominant element, the four jobs as context band. No place-slug guessing. | DEC-032 | S3 |
| WEB-F-027 | The 500 page is statically pre-rendered and minimal — no live modules, no search, nothing that can itself fail. | DEC-032 | S3 |
| WEB-F-029 | Legal content shall live on one route `/rechtliches` (EN `/legal`) as a long page with on-page navigation and the stable anchors of the registry in TS-004 D8. Footer links keep the conventional labels and point at the anchors. **Anchors are permanent**: never renamed, never removed — a retired section keeps its anchor with a pointer to its successor. | DEC-039 | S3 |
| WEB-F-028 | Region page interim (map deferred): active example places (activity-ranked, proximity-aware) + live counters + place search — never full place lists at county level or above. Story copy stays map-ready. | DEC-034 | S3 |
