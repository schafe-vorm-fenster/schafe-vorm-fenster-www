# API clients

One folder per ecosystem service the website consumes. Each holds the
service's pinned OpenAPI specification and a README stating what the
website uses it for and what it measurably cannot do.

The pattern follows the sibling services (`events-api/src/clients/*`) and
the convention registered as SRC-011 in
[`specs/contracts/api-contracts.md`](../../specs/contracts/api-contracts.md):
fetch, validate, store locally, commit. The stored `openapi.json` is the
review anchor — an upstream change arrives as a diff in a pull request
rather than as a surprise at runtime.

```bash
pnpm fetch:openapi              # all services
pnpm fetch:openapi geo-api      # one service
```

| Folder | Service | Website uses it for |
| --- | --- | --- |
| `events-api` | events, categories, scopes | live dates, the widening chain, counters |
| `geo-api` | places and hierarchy | place search, geo tiers, app handover |
| `calendar-api` | organizers and calendars | embed demo, reference embed |
| `envoy-api` | communication engine | registration, order handover |
| `assets-api` | images and files | externally sourced media |
| `classification-api` | category vocabulary | event badges, build-time |

## The implementations

Since M4 two of the six folders carry a client beside their contract, and
three rules hold for all of them (TS-008 D2/D10, TS-013 D3):

| File | What it is |
| --- | --- |
| `http.ts` | the one way an ecosystem host is reached: a **closed header set** (no client IP, no cookie — TS-013-A5), one attempt bounded by `AbortSignal.timeout`, and every non-answer as a single `UpstreamError` type |
| `hosts.ts` | every host and read token, read **only** here — which is what makes TS-008-A1 ("no ecosystem host or read token outside `src/clients/*`") a machine-checkable fact |
| `events-api/client.ts` | `POST /events/search` (id lists plus `after`/`before` — there is no radius parameter) and the tokenless `GET /api/stats` |
| `geo-api/client.ts` | `community/search` by ZIP and by point, and `community/slug/{slug}`. The address-lookup operation is **not implemented**, deliberately: DEC-024 forbids it, and a caller cannot reach what does not exist |

Responses are validated with Zod schemas derived from the pinned
`openapi.json` (DEC-021). The schemas are deliberately **loose on unknown
fields and strict on used ones**: an upstream that adds a field must not turn
every live module to tier 2, while a field we render that goes missing still
counts as a failure (TS-009 D4).

Nothing here decides whether it is called. That is
[`src/lib/live/`](../lib/live/README.md), which picks the real client or a
mock per capability and wraps every call in the three-tier chain.
