# assets-api client

Images and files from external sources.

- **Host:** `ASSETSAPI_HOST` → `https://assets.api.schafe-vorm-fenster.de`
- **Spec:** [`openapi.json`](./openapi.json) — `pnpm fetch:openapi assets-api`

## What the website uses it for

| Operation | Serves |
| --- | --- |
| `GET /api/image` | images that originate outside the repository — since DEC-0167 a place's photograph on the stage, as `?wikimediaCommonsId=<file>` |
| `GET /api/image`, headers only | the check behind a place photograph: does the image deliver, and its attribution — `License`, `Copyright`, `X-Image-Width/Height`; server-side, body discarded (`client.ts`, DEC-0167). Not `HEAD`: its CDN entry claimed success for images whose `GET` fails |
| `GET /api/download` | file downloads |

Four operations in total. Note the constraint from TS-WEB-0013 D2: no external
host may appear in a client request, so anything this service delivers is
fetched server-side or routed through the website's own image pipeline — with
the one exception the CSP's `img-src` names: the **image bytes themselves**
(event images, DEC-0152; place photographs, DEC-0167). The URL reaches the
browser from a BFF answer; the browser never asks this service anything else.
