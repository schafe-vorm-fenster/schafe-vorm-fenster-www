# classification-api client

Category and scope vocabulary for events.

- **Host:** `CLASSIFICATIONAPI_HOST` → `https://classify.api.schafe-vorm-fenster.de`
- **Spec:** [`openapi.json`](./openapi.json) — `pnpm fetch:openapi classification-api`

## What the website uses it for

| Operation | Serves |
| --- | --- |
| `GET /api/categories` · `GET /api/scopes` | the category vocabulary behind event badges — **build-time only** |

`/api/categories` and `/api/scopes` are unauthenticated. The classify and
scopify operations are for producers of events; the website only reads the
vocabulary, and reads it at build time, so no runtime dependency arises.
