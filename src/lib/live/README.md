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
| `GET /api/places/search?q=` | `places.ts` → `searchPlaces()` | **real** for a name (the committed index), **mock** for a ZIP (no `GEOAPI_READ_TOKEN`) | the place search and its typeahead, position 0 |
| `GET /api/places/{slug}/events?window=` | `places.ts` → `placeEvents()` | **real** — the public village calendar | position 1, dates in the place, and the empty-state verdict |
| `GET /api/nearby?lat=&lng=&radius=` | `nearby.ts` → `nearbyEvents()` | **real** — the index cuts the radius, the public calendar carries the dates | position 2, this week within ~15 km |
| `GET /api/region/{county}/examples` | `region.ts` → `regionExamples()` | **real, approximated** — no activity ranking exists upstream (DEC-034) | position 3, active example places |
| `GET /api/stats` | `counters.ts` → `liveCounters()` | **real** for `dates`, **mock** for `places` / `updates today` | position 4, the live counters |
| — (built server-side, never fetched) | `app-handover.ts` | — | every link into the app (DEC-029) |

Supporting modules: `types.ts` (the envelope and the domain shapes),
`widening.ts` (the chain, the ~15 km cut and the `Europe/Berlin` windows),
`resilient.ts` (the three tiers), `last-good.ts` (the tier-2 store),
`cache-profiles.ts` (TS-003 D5's numbers), `snapshots.ts` (tier 3),
`bff.ts` (origin check, rate limit, the response shape), `adapters.ts`
(upstream shape → ours), `categories.ts` (events-api's five category ids →
the design system's six tones), `place-index.ts` (the committed
covered-community index: name search, id → slug, the radius cut),
`public-source.ts` (the tokenless source in this layer's vocabulary),
`showcase.ts` (the configured showcase community), `mocks/` (the stand-in
backends).

## The three sources, in order

Every data operation of geo-api and events-api is path-scoped
(`/api/{token}/…`) and this environment has no read token
(`state/open.md` row 77). That used to mean every list on every page was
demo data. It no longer does, because two of the three sources below need no
credential at all.

| # | Source | Needs | Answers |
| --- | --- | --- | --- |
| 1 | **geo-api / events-api** (`src/clients/{geo,events}-api/`) | a read token | everything, authoritatively — postcodes, the hierarchy, county-wide event queries |
| 2 | **the public village calendar** (`src/clients/community-site/`) + **the committed community index** (`place-index.ts`) | nothing | a community's dates, the communities near a point, a name → a place, an id → a slug |
| 3 | **the mocks** (`mocks/`) | nothing | a complete demo of every module, for `LIVE_DATA=mock` and for offline work |

A module takes the first source that can answer it. Provision
`GEOAPI_READ_TOKEN` and `EVENTSAPI_READ_TOKEN` and each module moves up to
row 1 with no code change; take the network away and it falls to row 3.

What row 2 **cannot** do, and does not pretend to:

- **no postcode lookup.** No public surface carries a ZIP, so ZIP search
  stays geo-api's and stays token-gated. A typed name is answered; a typed
  postcode falls to the mock.
- **no county query.** The public calendar answers for a community and its
  surroundings, so `region.ts` approximates the county from its showcase
  community's region feed and says so.
- **no hierarchy.** A place built from row 2 carries no county; the caller
  supplies the county it already knows (`showcase.ts`).

## The mock / real switch

One flag and one capability table, both in `config.ts`.

```bash
LIVE_DATA=auto   # default — real where it can be, mock where it cannot
LIVE_DATA=mock   # everything mocked: offline work, deterministic tests
LIVE_DATA=real   # force the real clients; capabilities upstream lacks stay mocked
```

`auto` decides **per capability**, in this order:

1. does the operation exist at all? Three do not, and they are measured, not
   guessed — the county activity ranking (Q-015 residue) and the
   `/api/stats` *places* and *updates today* fields (Q-037). Those are mocked
   whatever the flag says. `state/open.md` rows 6 and 78.
2. does the capability's service need a **credential**? `credential: "none"`
   in `CAPABILITIES` means the public calendar or the committed index
   answers it, so it is open in every environment — including a preview with
   no secrets at all.
3. otherwise: is a read token present? Without one, `auto` picks the mock and
   says so in the payload.

Name search is the row that moved: geo-api still has none (Q-025 stays open,
row 5), but the committed index answers it, so typing `Schlat` suggests
Schlatkow with no token anywhere.

**Every mocked payload carries `demo: true`** out through the BFF. It reaches
the markup as `data-demo="true"`, never as rendered copy, and every mocked
capability has a `Mock aktiv` row in `state/open.md`.

### Fixture markers — the magic inputs a branch needs to be walkable

`mocks/fixtures.ts` names a handful of ZIPs/slugs that exist only so a
gate-level walk (QA, e2e, chaos) can reach a branch that ordinary stand-in
data never produces on its own:

| Constant | What it walks |
| --- | --- |
| `UNCOVERED_DEMO_ZIP` (`"99999"`) | TS-008 D7's **uncovered** outcome — no place resolves. |
| `EMPTY_DEMO_SLUG` | TS-008 D4's conversion moment — a covered place with zero dates. |
| `AMBIGUOUS_DEMO_ZIP` (`"18299"`) | TS-023-A6 — a municipality search that resolves to **several** communities. |

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
- The **islands** use `cacheLifeProfile()` with `cacheLife()` and the
  `cacheTags` of `cacheTags.*`. Cache Components (`cacheComponents: true`) is
  on since M4 (`state/open.md` row 76), and the islands live in
  `app/[lang]/_islands.tsx` — one `use cache` component per TS-008 position,
  each calling exactly one interface module of this folder. A page renders
  them; it does not fetch.

## Testing

```bash
pnpm test:unit          # the chain, the tiers, the switch, the handover
pnpm test:integration   # each route handler in-process, against the mocks
RUN_LIVE_API_TESTS=0 pnpm test   # skip the one suite that talks to the real services
```

`src/lib/live/upstream-live.integration.test.ts` is the only suite that
reaches the network. It probes each host first and skips itself when a
service does not answer or a credential is missing, so it is green offline.

Everything else runs against **recorded, token-free fixtures**:
`src/clients/community-site/fixtures/community-page.json` is a real community
page of the public calendar, trimmed; the two API clients are asserted
against payloads shaped after the services' own schemas; and
`place-index.test.ts` runs against the committed index itself, so a build
that produced a truncated one fails there rather than on a page.

The index is rebuilt with:

```bash
pnpm build:place-index   # → src/generated/snapshots/communities.json
```
