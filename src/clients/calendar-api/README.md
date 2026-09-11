# calendar-api client

Organizers and their calendars, from the CRM.

- **Host:** `CALENDARAPI_HOST` → `https://calendar.api.schafe-vorm-fenster.de`
- **Spec:** [`openapi.json`](./openapi.json) — `pnpm fetch:openapi calendar-api`
- **Auth:** path-scoped token

## What the website uses it for

| Operation | Serves |
| --- | --- |
| `GET /api/{token}/organizers/{id}/portalize` | the Portalize configuration of an organizer — the embed demo and the reference embed |
| `GET /api/{token}/organizers/search` · `/{id}` | resolving an organizer |
| `GET /api/{token}/calendars/{id}/events` | a customer calendar's dates |

## Measured limits

The portalize operation **reads** a configuration; it does not create one.
Nothing here mints an organizer, so "embed code out immediately" at the end
of the order flow has no mechanism in this service — Q-046. The candidate
path is envoy's registration (see `../envoy-api/README.md`), which writes
an organizer to the CRM; whether that yields a usable Portalize
configuration is the open part.
