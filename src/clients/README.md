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

**No client code yet.** These folders currently carry contracts and
knowledge, not implementations — the stack is not built. Response
validation with Zod schemas derived from these specifications is
specified in TS-004 D5 and DEC-021.
