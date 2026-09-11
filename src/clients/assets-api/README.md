# assets-api client

Images and files from external sources.

- **Host:** `ASSETSAPI_HOST` → `https://assets.api.schafe-vorm-fenster.de`
- **Spec:** [`openapi.json`](./openapi.json) — `pnpm fetch:openapi assets-api`

## What the website uses it for

| Operation | Serves |
| --- | --- |
| `GET /api/image` | images that originate outside the repository |
| `GET /api/download` | file downloads |

Four operations in total. Note the constraint from TS-013 D2: no external
host may appear in a client request, so anything this service delivers is
fetched server-side or routed through the website's own image pipeline.
