# The live-data layer

Everything the website knows about its own ecosystem's data: which module
asks what, which backend answers, what happens when the answer does not come,
and how the result reaches a page.

Specs: **TS-008** (live modules, place search, widening chain, handover),
**TS-009** (static shell, cached islands, three-tier fallback), **TS-013**
(the closed client-request set), **TS-017 D4** (the app boundary),
**TS-003 D5** (cache lifetimes), **TS-004 D5** (the BFF route inventory).

## The one rule everything else follows

A page never calls an ecosystem service, and the browser never calls
anything but this site's own origin.

```
component  →  /api/…  →  src/lib/live/<module>  →  real client  →  ecosystem host
  (page)      (BFF)      (interface module)     ↘  mock         (server-side only)
```

Tokens, hosts and upstream shapes stop at `src/clients/`. Whether a module
answers from the real service or from a mock stops at `src/lib/live/config.ts`.
A page sees one thing: an **envelope**.

## Module map

| BFF route | Interface module | Backend today | Serves |
| --- | --- | --- | --- |
| `GET /api/places/search?q=` | `places.ts` → `searchPlaces()` | **mock** (no `GEOAPI_READ_TOKEN`; name search has no upstream at all) | the place search, position 0 |
| `GET /api/places/{slug}/events?window=` | `places.ts` → `placeEvents()` | **mock** (no read token) | position 1, dates in the place, and the empty-state verdict |
| `GET /api/nearby?lat=&lng=&radius=` | `nearby.ts` → `nearbyEvents()` | **mock** (no read token) | position 2, this week within ~15 km |
| `GET /api/region/{county}/examples` | `region.ts` → `regionExamples()` | **mock by necessity** — the activity ranking has no upstream operation | position 3, active example places (DEC-034) |
| `GET /api/stats` | `counters.ts` → `liveCounters()` | **real** for `dates`, **mock** for `places` / `updates today` | position 4, the live counters |
| — (built server-side, never fetched) | `app-handover.ts` | — | every link into the app (DEC-029) |

Supporting modules: `types.ts` (the envelope and the domain shapes),
`widening.ts` (the chain and the ~15 km cut), `resilient.ts` (the three
tiers), `last-good.ts` (the tier-2 store), `cache-profiles.ts` (TS-003 D5's
numbers), `snapshots.ts` (tier 3), `bff.ts` (origin check, rate limit, the
response shape), `adapters.ts` (upstream shape → ours), `mocks/` (the demo
backends).

## The mock / real switch

One flag and one capability table, both in `config.ts`.

```bash
LIVE_DATA=auto   # default — real where it can be, mock where it cannot
LIVE_DATA=mock   # everything mocked: offline work, deterministic tests
LIVE_DATA=real   # force the real clients; capabilities upstream lacks stay mocked
```

`auto` decides **per capability**, in this order:

1. does the operation exist upstream at all? Four do not, and they are
   measured, not guessed — name search (Q-025), the county activity ranking
   (Q-015 residue), and the `/api/stats` *places* and *updates today* fields
   (Q-037). Those are mocked whatever the flag says, because there is nothing
   to call. `state/open.md` rows 5 and 6.
2. is the service reachable with a credential? geo-api and the events search
   are token-scoped (`/api/{token}/…`) and this environment has no read
   token, so `auto` picks the mock and says so in the payload.
3. `/api/stats` is the one tokenless operation, so the **dates** counter is
   real data even here. The band is part real, part demo — which is exactly
   what Q-037 leaves us with.

Provision `GEOAPI_READ_TOKEN` and `EVENTSAPI_READ_TOKEN` and the geo and
events halves switch to the real clients with no code change.

**Every mocked payload carries `demo: true`** out through the BFF. That flag
is the `Demo-Daten` badge's only input — a page passes `state="mocked"` to
the shell and the badge appears. Demo data is obviously fictitious
(`Beispielgemeinde Musterdorf`, titles suffixed "(Beispiel)"), contains no
person and no real-looking figure, and every mocked capability has a
`Mock aktiv` row in `state/open.md`.

### Fixture markers — the magic inputs a branch needs to be walkable

`mocks/fixtures.ts` names a handful of ZIPs/slugs that exist only so a
gate-level walk (QA, e2e, chaos) can reach a branch that ordinary demo data
never produces on its own:

| Constant | What it walks |
| --- | --- |
| `UNCOVERED_DEMO_ZIP` (`"99999"`) | TS-008 D7's **uncovered** outcome — no place resolves. |
| `EMPTY_DEMO_SLUG` (`"beispielhausen"`) | TS-008 D4's conversion moment — a covered place with zero dates. |
| `AMBIGUOUS_DEMO_ZIP` (`"18299"`) | TS-023-A6 — a municipality search that resolves to **several** communities, so `mockSearchByZip` answers `AMBIGUOUS_DEMO_PLACES` (two places, same name, two counties) instead of the usual one. Before this fixture (F-2-5, round 2), that branch had no fixture at all and only ran against a stubbed `searchPlaces()` result in `resolve-place.test.ts`. Deliberately **not** part of `DEMO_PLACES`: that six-place ring is keyed elsewhere (the ~15 km widening cut, `mocks/events.ts`'s region-example selection) to its current members, and a same-named collision inside it would change those rather than only add a lookup branch. |

Every one of these is a postcode or slug nobody would type by accident —
finding them is the point of naming them here, not an obstacle.

## The envelope

Every interface module returns the same thing, and the shells read their
state off it:

```ts
interface LiveEnvelope<T> {
  data: T;
  tier: "live" | "stale" | "snapshot";  // TS-009 D4 tiers 1 / 2 / 3
  fetchedAt: string;                     // ISO; tier 3 carries the build time
  stale: boolean;                        // the freshness label's condition
  demo: boolean;                         // the Demo-Daten badge's condition
  source: "real" | "mock";
}
```

The BFF sends the same five fields as JSON (`source` stays server-side).

## The three tiers, and the state each shell receives

`resilient()` decides the tier per call, so one failing upstream degrades one
module — tier 1, 2 and 3 modules may stand side by side on a page.

| Situation | Tier | `state` for the shell | What the shell shows |
| --- | --- | --- | --- |
| still streaming | — | `loading` | the skeleton at the final geometry, no spinner |
| upstream answered | `live` | `ready` (or `mocked` if `demo`) | the data, no label |
| upstream answered, zero results | `live` | `empty` | the module's own conversion state — for `/dein-ort` the publish invitation (`publishInvitation: true`) |
| upstream failed, `last-good` warm | `stale` | `degraded` + `tier="stale"` | the last good answer plus "Stand: …" |
| upstream failed, `last-good` cold or expired | `snapshot` | `degraded` + `tier="snapshot"` | the committed snapshot, labelled as an example |
| counters, both above exhausted | — (`undefined`) | — | **the module is removed from the page** (TS-009 D6) |

Rules the layer enforces rather than documents:

- **Failure is anything that is not a valid answer** — network error, non-2xx,
  timeout (800 ms), or a payload the Zod schema rejects. A malformed 200
  never reaches a page.
- **One attempt per render.** No in-request retry.
- **An empty result is tier 1**, not a failure. Zero dates in a covered place
  is the conversion moment of TS-008 D4, and it renders as a normal module
  with a different offer — no error styling, no warning icon, no retry.
- **No error text ever reaches the visitor.** Degradations are logged
  server-side as events (`onDegrade`), and the page stays 200.
- **The counters have no tier 3.** There is no snapshot file for them and no
  branch that could produce one; `liveCounters()` answers `undefined`, and
  `/api/stats` answers `204`.

## Wiring a page (copy-paste)

Pages are wired by the page work packages, not by this one. This is the
shape they should copy.

### A cached island with its skeleton

```tsx
// app/[lang]/dein-ort/page.tsx
import { Suspense } from "react";

import { EventList } from "@/src/components/event-list/event-list";
import { LiveModuleFrame } from "@/src/components/live-module-frame/live-module-frame";
import { Skeleton } from "@/src/components/skeleton/skeleton";
import { placeEvents } from "@/src/lib/live/places";

async function DatesInThePlace({ slug }: { slug: string }) {
  const envelope = await placeEvents({ slug, window: "upcoming", rowCount: 3 });
  if (envelope === undefined) return null; // not covered — a different page state

  const { data, tier, stale, demo, fetchedAt } = envelope;

  return (
    <LiveModuleFrame
      title={`Termine in ${data.place.name}`}       // the title names its own radius
      announced={data.publishInvitation}            // the focus-job shift is announced once
      state={stale ? "degraded" : demo ? "mocked" : "ready"}
      tier={tier === "snapshot" ? "snapshot" : "stale"}
      updatedAt={fetchedAt}
    >
      <EventList
        items={data.events.map((event) => ({
          id: event.id,
          date: event.startsAt,
          title: event.title,
          meta: event.placeName,
          category: "fest",                          // TS-005 owns the mapping
          categoryLabel: "Fest",
        }))}
        rowCount={3}
        state={data.events.length === 0 ? "empty" : "ready"}
        emptyState={<PublishInvitation place={data.place.name} />}
      />
    </LiveModuleFrame>
  );
}

export default function Page({ searchParams }: { searchParams: Promise<{ ort?: string }> }) {
  return (
    <Suspense fallback={<Skeleton rows={3} variant="row" />}>
      <DatesInThePlace slug={/* resolved outside the cache boundary, TS-009 D2 */ ""} />
    </Suspense>
  );
}
```

Two rules from TS-009 D2 the example obeys: the request value (`?ort=`) is
read in the **page**, outside any cache boundary, and handed to the island as
a **prop**; the island itself reads no `searchParams`, `cookies()` or
`headers()`.

### The counter band, which may disappear

```tsx
const counters = await liveCounters();
if (counters === undefined) return null;   // TS-009 D6: removed, never zeroed

<LiveCounters
  dates={counters.data.dates}
  places={counters.data.places}
  updatesToday={counters.data.updatesToday}
  state={counters.stale ? "degraded" : counters.demo ? "mocked" : "ready"}
/>;
```

A figure with no upstream field is simply absent from `counters.data`, so the
band renders one slot fewer. Never a zero, never an estimate.

### A link into the app

```tsx
import { calendarUrl } from "@/src/lib/live/app-handover";

const href = calendarUrl(place, { campaign: await searchParams });
```

`calendarUrl` takes a **`Place`**, not a string, so a slug can only come out
of a geo-api response. An unresolved place has no app link — it goes to
`/dein-ort/starten`.

### Client-side (typeahead, browser geolocation)

The BFF routes are the browser's only reachable data surface:

```ts
const response = await fetch(`/api/places/search?q=${encodeURIComponent(value)}`);
const { data, demo } = (await response.json()) as BffResponse<PlaceSearchResult>;
```

`place-search` works without JavaScript as a plain GET form; the typeahead is
an enhancement on top of it (TS-008 D7).

## Caching

`cache-profiles.ts` holds TS-003 D5's two numbers per data kind and nothing
else in the tree types them:

| Kind | Fresh TTL | Serve-stale window |
| --- | --- | --- |
| `dates` | 5 min | 3 d |
| `activePlaces` | 1 h | 7 d |
| `counters` | 15 min | 3 d — beyond: hide |

- The **BFF routes** send them as `Cache-Control: public, s-maxage=…,
  stale-while-revalidate=…` (`cacheControlFor()`), the Vercel SWR semantics
  DEC-019 fixes.
- The **`last-good` store** uses the stale window as its TTL.
- The **islands** will use `cacheLifeProfile()` with `cacheLife()` and the
  `cacheTags` of `cacheTags.*`. Cache Components (`cacheComponents: true`) is
  **not** switched on in this repository yet — see DEC-075 §4 and
  `state/open.md`. Until it is, the islands are plain async server components
  inside `<Suspense>`, which is the same tree with a different cache.

## Testing

```bash
pnpm test:unit          # the chain, the tiers, the switch, the handover
pnpm test:integration   # each route handler in-process, against the mocks
RUN_LIVE_API_TESTS=0 pnpm test   # skip the one suite that talks to the real services
```

`src/lib/live/upstream-live.integration.test.ts` is the only suite that
reaches the network. It probes each host first and skips itself when a
service does not answer or a credential is missing, so it is green offline.
