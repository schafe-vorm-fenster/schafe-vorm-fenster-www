---
id: DEC-0179
title: The website's functions run in Vercel region fra1, next to the APIs they call
status: accepted
date: 2026-10-28
decided_by: jan-henrik.hempel
---

## Context

After the API tokens were set on the Vercel project (2026-10-28), the
preview of next-2026 still served `/api/nearby` from the snapshot. The
runtime log names the cause on every request:

> `[live] nearby:53.92:13.58:15 degraded to snapshot: geo-api: timeout after 800 ms`

Measured the same day:

| | Region |
| --- | --- |
| Website functions (`x-vercel-id`, runtime log) | `pdx1` (Portland, US West) |
| geo-api `geo.api-v2.schafe-vorm-fenster.de` | `fra1` |
| events-api `events.api.schafe-vorm-fenster.de` | `fra1` |
| assets-api, community site | `fra1` |

The geo-api point search takes 0.42–0.87 s when called from Germany. From
`pdx1` every call adds a transatlantic round trip on top, so it misses the
800 ms budget of TS-WEB-0009 D4 (`UPSTREAM_TIMEOUT_MS`) most of the time and
the module degrades. The project had no `regions` setting, so Vercel used its
default.

## Decision

`vercel.json` sets `"regions": ["fra1"]`. The functions run in the same
region as every upstream they call. The 800 ms budget stays as it is: it is
the spec's number, and the defect was the distance, not the budget.

A visitor's request is then also processed in the EU, which fits the data
minimisation of TS-WEB-0014 better than a US region.

## Consequences

- Upstream calls stay inside one region; the measured 0.4–0.9 s are the
  ceiling from Germany, not from the data centre next door.
- If a later upstream moves region, the website's region follows it; this
  record is the place that says why the setting exists.
- Verified after the merge by the preview's runtime log (no `degraded to`
  line for `/api/nearby`) and the route's `tier` field (`live`).
