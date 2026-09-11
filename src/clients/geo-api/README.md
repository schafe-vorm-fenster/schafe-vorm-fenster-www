# geo-api client

Places, the administrative hierarchy and place search.

- **Host:** `GEOAPI_HOST` → `https://geo.api-v2.schafe-vorm-fenster.de`
- **Spec:** [`openapi.json`](./openapi.json) — `pnpm fetch:openapi geo-api`
- **Auth:** path-scoped token

## What the website uses it for

| Operation | Serves |
| --- | --- |
| `GET|POST /api/{token}/community/search` | the place search, and the nearest active place |
| `GET /api/{token}/community/slug/{slug}` | resolving a slug to a community — the app handover (DEC-029) |
| `GET /api/{token}/community/{id}` | the hierarchy behind the geo tiers (TS-005 D1) |

The hierarchy is `place? > community > municipality > county > state >
country`, with `state` required — the five levels TS-005 D1 uses.

## Measured limits

Verified against the pinned specification on 2026-09-11:

- **Search takes no place name.** Parameters are `countryCode`, `lat`/`lng`,
  `zips`, and geoname id lists for municipalities, counties and states.
  Name search is a demand, not a feature — Q-025. Until it lands, the
  place search is ZIP-only.
- **Proximity search takes no caller radius.** A server-side constant
  applies and `maxResults` defaults to 10, so the relevance model's
  "~15 km" is approximated in the BFF — Q-038.
- **No coordinate → hierarchy resolution**, which is what county-level
  geolocation would need — Q-032. And an uncovered place has no
  coordinates at all, so "nearest active place" has no anchor — Q-051.
- `findbyaddress` exists but is **forbidden** for the website: it triggers
  an external Google lookup, slow and paid, and it would carry the
  visitor's search term to a third party (DEC-024, TS-013 D3).
