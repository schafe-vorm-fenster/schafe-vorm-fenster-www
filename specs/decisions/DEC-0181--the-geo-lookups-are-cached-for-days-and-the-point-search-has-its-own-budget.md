---
id: DEC-0181
title: geo-api's place lookups are cached for seven days apart from the dates, and the point search gets its own 3 s budget
status: accepted
date: 2026-10-28
decided_by: jan-henrik.hempel
---

## Context

DEC-0179 moved the website's functions to `fra1`, next to geo-api. The
preview of next-2026 still logged, after that move:

> `[live] nearby:53.92:13.58:15 degraded to stale: geo-api: timeout after 800 ms`

In the six hours up to 2026-10-28 13:45 UTC the project's runtime log carries
16 `degraded` lines; 12 of them are `/api/nearby` on
`geo-api: timeout after 800 ms`, three of those in `fra1`.

geo-api's point search (`GET /api/{token}/community/search?lat=&lng=`,
`searchByPoint`), measured on 2026-10-28 from Germany against **70 distinct
coordinates**, each asked for the first time:

| | median | p90 | p95 | max | above 800 ms |
| --- | --- | --- | --- | --- | --- |
| point search, first ask | ~0.5 s | 0.74 s | 0.79 s | 0.92 s | 3 of 70 |
| point search, same point again | 0.09 s | 0.15 s | | 0.31 s | 0 of 24 |
| slug lookup `community/slug/{slug}` (20) | 0.12 s | 0.20 s | | 0.23 s | 0 |
| id lookup `community/{id}` (20) | 0.12 s | 0.44 s | | 0.51 s | 0 |

So the 800 ms budget of TS-WEB-0009 D4 sits right on the point search's tail.
A healthy first answer misses it often enough to show, and every miss turns
position 2 to tier 2 or 3 although nothing is down. Raising the one budget
for every call would slow every degradation the budget exists to cut short.

What the point search answers — which communities lie around a coordinate —
changes when geo-api's community data changes, which is practically never.
The same holds for slug → community and id → community. The dates next to
them change all the time and keep their 5 minutes.

## Decision

1. **A cache kind `geoLookup`, 7 days**, in `src/lib/live/cache-profiles.ts`
   and as a row of TS-WEB-0003 D5. The number is not new: it is the longest
   lifetime D5 already holds for place data (`activePlaces`' serve-stale
   window). The entry lives that long and is then fetched again.
2. **The three geo lookups are cached under it** (`src/lib/live/geo-lookup.ts`):
   point → communities, slug → community, id → community. Only a validated
   answer is written; a failure is never cached, and neither is a slug or id
   geo-api does not know, so no key is made of a string nobody resolved. The
   tag is `geo` (`cacheTags.geo()`), so one purge reaches all of them.
3. **The point is quantised to two decimals** — the precision the nearby key
   `nearby:{lat}:{lng}:{radius}` already uses (TS-WEB-0013 D6) — and geo-api is
   asked for the quantised point, so the cached answer is exactly the answer
   for its key. The ~15 km cut still runs on the caller's own anchor.
4. **The point search gets its own budget: 3 s** (`GEO_POINT_TIMEOUT_MS` in
   `src/lib/live/config.ts`), amending TS-WEB-0009 D4. Three times the measured
   maximum. It is the one call that measured past 800 ms, its answer is reused
   for a week, and nobody watches it run: position 2 sits below the fold and
   loads in the browser behind a skeleton at its final geometry (DEC-0163). The
   events half of `/api/nearby` and every other JSON call keep 800 ms; the slug
   and id lookups are cached but keep 800 ms, because they measured inside it.
5. **The store is the Vercel Runtime Cache** (namespace `geo`), the store
   DEC-0046 chose for `last-good`, behind the same `LastGoodStore` interface —
   not a `"use cache"` function. Plain `"use cache"` keeps its entries in the
   instance's memory, which a serverless function loses with the instance;
   `"use cache: remote"` is shared, but its key carries the build id (Next.js
   16 docs, `use cache: remote` → *Persistence across deploys*), so every deploy
   would start every point cold again for data that does not change between
   deploys. A store passed as a parameter is also what lets an in-process test
   show that the second request is a hit.
6. **`/api/places/nearest` is not cached.** Its point is a visitor's own
   position, which is never stored (TS-WEB-0010 D5, DEC-0119), and the committed
   index stands behind it; it keeps the 800 ms.

## Consequences

- The first request for a two-decimal cell may take up to 3 s + 800 ms; every
  request for that cell for the next 7 days skips geo-api.
- A community added to geo-api, or a changed Wikidata photograph behind
  `community/{id}`, reaches the site within 7 days at the latest. Purging the
  `geo` tag makes it immediate.
- Cache cost: one entry per two-decimal cell anyone asks about, per covered
  slug, per covered id. Q-0030's measurement covers this namespace as well.
- TS-WEB-0009 D4's open point "800 ms is set, not measured" is answered for the
  point search; it stays open for the other calls.
- Verified by `src/lib/live/geo-lookup.integration.test.ts` (a 1.5 s geo answer
  is `live` first and a cache hit second; the events half still times out at
  800 ms; a geo answer past 3 s still degrades) and, after the merge, by the
  preview's `tier` field and runtime log.
