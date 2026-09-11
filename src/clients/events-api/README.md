# events-api client

Events, categories and scopes for the live modules.

- **Host:** `EVENTSAPI_HOST` → `https://events.api.schafe-vorm-fenster.de`
- **Spec:** [`openapi.json`](./openapi.json) — pinned, refresh with `pnpm fetch:openapi events-api`
- **Auth:** path-scoped token (`/api/{token}/…`); `/api/stats` and `/api/health` are open

## What the website uses it for

| Operation | Serves |
| --- | --- |
| `POST /api/{token}/events/search` | the widening chain — filters by `communities` / `municipalities` / `counties` / `states` id lists plus `after`/`before`. **No distance parameter exists**, so the chain is expressed as which id list is sent (TS-008 D3). |
| `GET /api/{token}/events/search/{community}[/{scope}[/{category}]]` | the place's dates on `/dein-ort` |
| `GET /api/{token}/communities` | which places carry data — the coverage test behind `/dein-ort/starten` |
| `GET /api/stats` | live counters, unauthenticated |

## Measured limits

`GET /api/stats` returns `totalEvents`, date bounds and data-quality
counters. **It has no field for places or updates-today**, so two of the
three counters in the relevance model cannot be rendered under
WEB-F-041 — Q-037.
