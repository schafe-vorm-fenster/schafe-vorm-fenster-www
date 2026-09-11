---
artefact: contract-register
id: SRC-011
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
| geo-api | `https://geo.api-v2.schafe-vorm-fenster.de` | place search, geo hierarchy, geolocation resolution | `/api/{token}/community/search`, `/api/{token}/community/slug/{slug}`, `/api/{token}/findbyaddress` |
| calendar-api | `https://calendar.api.schafe-vorm-fenster.de` | organizer/calendar metadata (embed demo, reference embed) | per OpenAPI spec |
| classification-api | `https://classify.api.schafe-vorm-fenster.de` | category/scope definitions (build-time) | per OpenAPI spec |
| assets-api | `https://assets.api.schafe-vorm-fenster.de` | images/media delivery | per OpenAPI spec |
| envoy-api | `https://envoy.api.schafe-vorm-fenster.de` | registration, order handover | `POST /api/registration` (organizer into the CRM), `POST /api/conversation` (AI chat, unused). Auth: `SheepToken`, global. |

## Pinned locally

Since 2026-09-11 every specification above is pinned at
`src/clients/<service>/openapi.json` and refreshed with
`pnpm fetch:openapi` (DEC-058). Each folder's README records what the
website uses the service for and what it measurably cannot do. The
operation lists in this register are read from those pinned files, not
assumed.

## Notes

- `events-api /api/stats` is tokenless and cache-controlled — the natural
  source for the live counters (WEB-F-041, WEB-F-104); whether its fields
  suffice for "places · dates · updates today" is the remaining sliver of
  Q-015.
- Data endpoints are token-scoped (`/api/{token}/…`); the website needs
  read tokens per service as environment variables — same pattern as the
  product (`EVENTSAPI_HOST`/`…_READ_TOKEN`).
- Specs are fetched and pinned per the adopted convention (DEC-021);
  the stored `openapi.json` files are the review anchor for API changes.
