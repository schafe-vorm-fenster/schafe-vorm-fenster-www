---
artefact: requirements
area: pages
status: DRAFT
sources: [SRC-0003]
decisions: [DEC-0052, DEC-0081, DEC-0082]
---

# Pages

Primary source: SRC-0003 (`go-to-market-os/concept/website-information-architecture.concept.md`).
Page briefs (structure, audiences in priority order, live modules) are
defined there per page and referenced — this file fixes existence, route,
focus job, and primary conversion. Conversion goal IDs resolve in
`@schafe-vorm-fenster/goals`.

| ID | Route | Focus job | Primary conversion | Source | Suff. |
| --- | --- | --- | --- | --- | --- |
| FUN-WEB-0010 | `/` | set by entry context (default: know what is on) | the focus job's CTA; none of its own | SRC-0003#home | S2 |
| FUN-WEB-0011 | `/dein-ort` | know what is on | `save-calendar-to-homescreen` | SRC-0003#your-place-dein-ort | S2 |
| FUN-WEB-0012 | `/mitmachen` | publish our dates | `register-as-publisher` | SRC-0003#publish-our-dates-mitmachen | S2 |
| FUN-WEB-0013 | `/mitmachen/registrieren` | publish our dates | `publish-first-event` (handover to the app) | SRC-0003#register-mitmachenregistrieren | S2 |
| FUN-WEB-0014 | `/dein-kalender` | run our own calendar | `buy-calendar-licence`; equal `request-product-briefing` | SRC-0003, DEC-0036 | S3 |
| FUN-WEB-0015 | `/dein-kalender/bestellen` | run our own calendar | `buy-calendar-licence` | SRC-0003, DEC-0011, DEC-0036 | S3 |
| FUN-WEB-0016 | `/deine-region` | run our own calendar | `request-licence-quote` | SRC-0003, DEC-0036 | S3 |
| FUN-WEB-0017 | `/ueber-uns` | understand who is behind it | `request-product-briefing`, carried by the page's contact section and repeated in the closing block (DEC-0081 §6). Secondary, below it: `subscribe-to-newsletter` in the inline block — the two asks serve two readiness levels (DEC-0052 §4 as amended) | SRC-0003, DEC-0036, DEC-0052, DEC-0081 | S3 |
| FUN-WEB-0018 | `/ueber-uns/archiv` | understand who is behind it | none; only list-shaped page, not a destination | SRC-0003#archive | S2 |

Additional page-level requirements:

| ID | Requirement | Source | Suff. |
| --- | --- | --- | --- |
| FUN-WEB-0019 | The conversion map in SRC-0003 shall be complete on the website: every conversion goal listed there is carried by the pages named there; `order-promotion-material` is deliberately unwired — the goal stays in the hub, the website carries no page (DEC-0052). Two goals are carried by standing surfaces rather than by a page and are primary for none: `make-contact` on every row of the contact section, and `subscribe-to-newsletter` in the footer and the `/ueber-uns` block (DEC-0081, DEC-0052 §4 as amended). | SRC-0003#conversion-map, DEC-0052, DEC-0081 | S2 |
| FUN-WEB-0020 | Pricing display: `480 €/year` is public and is priced **per organisation** for a configured calendar on that organisation's own website — never per place, municipality or region, and with no place limit (DEC-0060). The enterprise price is not published. Offerings with `promotion: withheld` are not offered at all. | SRC-0003, DEC-0060, DEC-0052 | S3 |
| FUN-WEB-0021 | Footer shall carry newsletter and the legal links — "Impressum", "Datenschutz", "Barrierefreiheit" — each pointing at its anchor on `/rechtliches` (FUN-WEB-0029); the header carries the persistent "Kalender" button to `/dein-ort`. The footer newsletter entry carries `subscribe-to-newsletter` and offers both its channels (FUN-WEB-0096). **Contact is the standing contact section above the footer** (DEC-0081), not an entry inside it. Help lives in the app, not on the website. | SRC-0003#navigation, DEC-0012, DEC-0039, DEC-0052, DEC-0081 | S3 |
| FUN-WEB-0022 | The region page shall state a two-working-day response promise on the quote request. The promise is an operational commitment: the lead-handling process behind the envoy widget (FUN-WEB-0090) must be able to keep it — flagged to envoy/ops as part of Q-0022. | SRC-0003#for-a-whole-region | S2 |
| FUN-WEB-0026 | The 404 page returns real status 404 with `noindex` and mini content: one sentence, the place search as the dominant element, the four jobs as context band. No place-slug guessing. | DEC-0032 | S3 |
| FUN-WEB-0027 | The 500 page is statically pre-rendered and minimal — no live modules, no search, nothing that can itself fail. | DEC-0032 | S3 |
| FUN-WEB-0029 | Legal content shall live on one route `/rechtliches` (EN `/legal`) as a long page with on-page navigation and the stable anchors of the registry in TS-WEB-0004 D8. Footer links keep the conventional labels and point at the anchors. **Anchors are permanent**: never renamed, never removed — a retired section keeps its anchor with a pointer to its successor. | DEC-0039 | S3 |
| FUN-WEB-0028 | Region page interim (map deferred): active example places (activity-ranked, proximity-aware) + live counters + place search — never full place lists at county level or above. Story copy stays map-ready. | DEC-0034 | S3 |
