# community-site — the tokenless source

The public village-calendar site, read server-side. It exists in this folder
for one reason: **it answers without a credential**, and every other
ecosystem service does not.

`events-api` and `geo-api` are token-scoped (`/api/{token}/…`, checked by
`checkAccessToken` on every route). Without `EVENTSAPI_READ_TOKEN` /
`GEOAPI_READ_TOKEN` a deployment of this website can reach neither, and every
live module on every page would answer from the mock backend. The village
calendar in front of those services is a public website serving the same
data, so reading it is the difference between a page that shows real dates
and a page that shows demo ones.

## What is read

| Surface | Method | Answers |
| --- | --- | --- |
| `/` | GET (HTML) | the **community index** — every covered community: name, geo-api slug, geonameId, point, municipality |
| `/{slug}.{geonameId}` | GET (HTML) | one community's **community object** and its **events** (its own, its municipality's, and the widened `nearby` / `region` ones), already localized to German and already ISO-timed |

The site publishes a third public surface, `POST
/api/search-nearby-communities` — its own credential-hiding proxy in front of
geo-api's proximity search. It is deliberately not used: it answers five
communities, and a cap truncates a radius silently. `src/lib/live/place-index.ts`
holds every covered community's coordinate and makes the ~15 km cut of
TS-WEB-0008 D3 exactly and locally instead.

The two HTML surfaces are read through the `<script id="__NEXT_DATA__">`
block Next.js writes into every page of a Pages-Router application: the JSON
a page was rendered from, in the page. That is a rendering artefact of
another application rather than a published contract, which is the cost of
this source and the reason every field goes through Zod
(`client.ts`). A shape change raises one `UpstreamError`, `resilient()`
turns that into tier 2 or tier 3, and the page keeps standing.

## What is not read

- **Nothing that costs money upstream.** The forbidden geo-api address lookup
  (DEC-0024, TS-WEB-0013 D3) has no equivalent here and is not reachable through
  this site either.
- **No visitor data goes out.** These calls are made from the server with the
  closed header set of `../http.ts`: no cookie, no IP header, no user agent
  of the visitor. The site never learns who asked.
- **No write.** All three surfaces are reads. The website has no write path
  into the ecosystem at all (TS-WEB-0017 D4).

## Sizes and budgets

| Surface | Body (gzipped) | Measured TTFB |
| --- | --- | --- |
| `/{slug}.{geonameId}` | ~80 KB | ~100–200 ms |
| `/` | ~2.2 MB uncompressed (1760 communities) | — |

The community index is therefore **not** fetched at request time. It is
fetched by `scripts/build-place-index.ts` and committed as
`src/generated/snapshots/communities.json`, which is what the place search's
name lookup reads. The per-community page is small enough to be a request-time
source and gets its own timeout budget (`LIVE_HTML_TIMEOUT_MS`, default
2500 ms) rather than the 800 ms of the two JSON APIs — it is a document, not
an API call, and the whole point of it is that it answers at all.

## Where the host lives

`../hosts.ts` (`communitySiteHost()`, `COMMUNITYSITE_HOST` to override).
No host string is written in this file or in any module outside
`src/clients/` — `src/lib/live/boundary.test.ts` checks that.
