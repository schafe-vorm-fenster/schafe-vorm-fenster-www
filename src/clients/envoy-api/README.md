# envoy-api client

The communication engine: registration and conversation.

- **Host:** `ENVOYAPI_HOST` → `https://envoy.api.schafe-vorm-fenster.de`
- **Spec:** [`openapi.json`](./openapi.json) — `pnpm fetch:openapi envoy-api`
- **Auth:** `SheepToken`, declared globally in the specification

## What it actually offers — measured 2026-09-11

The service has four operations: `health`, `openapi`, `POST
/api/conversation`, `POST /api/registration`. That is the whole surface.

### `POST /api/registration` — larger than the specs assumed

"Registers an organizer in the CRM and sends a welcome message." 201 for a
new contact recorded as prospect, 200 when the submission matched an
existing one. Required: `firstName`, `lastName`, `organizationName`,
`email`, `phone`, `consent`.

Three things in its payload matter to the website:

| Field | Why it matters |
| --- | --- |
| `googleCalendarId` · `icsCalendarUrl` · `onlineCalendarUrl` | exactly the three publishing paths of `/mitmachen` — the form has a place to put each |
| `zipcode` | "drives the community assignment" — the place reaches the CRM through it |
| `tarif` · `tarifStatus` | Starter / Professional …, and prospect / verified — so a **licence order can be recorded through the same endpoint** |

This narrows Q-022 considerably. The **API** contract exists and covers
both the actor registration (TS-023) and the order handover (TS-025,
DEC-051). What is still missing is the **web component widget** DEC-009
specifies — its CSS variables, events, spam handling and delivery date.

### Not present

No newsletter operation, no lead-form operation, no order operation beyond
the registration fields above. `POST /api/conversation` is the AI chat and
is not used by the website.
