---
artefact: contract-register
id: SRC-0011
status: DRAFT
date: 2026-09-09
---

# API Contract Register

All ecosystem services publish OpenAPI specs at `<host>/api/openapi`
(pattern verified in each service repository). Hosts are the production
values the product (`community-calendar`) already consumes.

| Service | Host | Needed by | Relevant operations |
| --- | --- | --- | --- |
| events-api | `https://events.api.schafe-vorm-fenster.de` | live modules (dates per place/scope/category), counters | `/api/{token}/events/search/{community}[/{scope}[/{category}]]`, `/api/stats` (public, totalEvents u.a.), `/api/{token}/communities` |
| geo-api | `https://geo.api-v2.schafe-vorm-fenster.de` | place search, geo hierarchy, geolocation resolution, the place's photograph (`image`, DEC-0167) | `/api/{token}/community/search`, `/api/{token}/community/slug/{slug}`, `/api/{token}/community/{geonameId}`, `/api/{token}/findbyaddress` |
| calendar-api | `https://calendar.api.schafe-vorm-fenster.de` | organizer/calendar metadata (embed demo, reference embed) | per OpenAPI spec |
| classification-api | `https://classify.api.schafe-vorm-fenster.de` | category/scope definitions (build-time) | per OpenAPI spec |
| assets-api | `https://assets.api.schafe-vorm-fenster.de` | images/media delivery; a Commons file's licence and author as response headers (`License`, `Copyright`, DEC-0167) | `/api/image?wikimediaCommonsId=<file>` (per OpenAPI spec) |
| envoy-api | `https://envoy.api.schafe-vorm-fenster.de` | registration, order handover | `POST /api/registration` (organizer into the CRM), `POST /api/conversation` (AI chat, unused). Auth: `SheepToken`, global. |

## Pinned locally

Since 2026-09-11 every specification above is pinned at
`src/clients/<service>/openapi.json` and refreshed with
`pnpm fetch:openapi` (DEC-0058). Each folder's README records what the
website uses the service for and what it measurably cannot do. The
operation lists in this register are read from those pinned files, not
assumed.

## Notes

- `events-api /api/stats` is tokenless and cache-controlled — the natural
  source for the live counters (FUN-WEB-0041, FUN-WEB-0196, FUN-WEB-0197); whether its fields
  suffice for "places · dates · updates today" is the remaining sliver of
  Q-0015.
- Data endpoints are token-scoped (`/api/{token}/…`); the website needs
  read tokens per service as environment variables — same pattern as the
  product (`EVENTSAPI_HOST`/`…_READ_TOKEN`).
- **A test organizer's events are dropped wherever events enter the site**
  (DEC-0173 §3). The rule is the village calendar's own
  (`community-site/src/filter/filterTestEvents.ts`): an event whose
  organizer id (`organizer.id` from events-api, `calendar.organizer._id` from
  the public site) is in `MATEO_TEST_USER_IDS` is a test event. Both adapters
  apply it (`src/lib/live/test-organizers.ts`). The Portalize widget reads
  events-api directly, so it needs the same rule in its own events route
  (schafe-vorm-fenster/portalize#144).
- Specs are fetched and pinned per the adopted convention (DEC-0021);
  the stored `openapi.json` files are the review anchor for API changes.
