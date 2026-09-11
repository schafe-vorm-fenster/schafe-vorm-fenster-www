# The relevance engine

TS-005, the website side of the concept's relevance model
(`go-to-market-os/concept/website-relevance-model.concept.md` — the concept is
the law here; where TS-005 simplifies it, this folder follows the concept and
says so).

Two axes, one formula, one sequence rule, and **no I/O**. Every function in
this folder is pure: same arguments, same result, forever. Fetching, caching
and segmenting sit around it — `selectRelevant()` reads no clock, no request,
no file and no package.

## What a page calls

One function per surface. It takes the elements, the viewer and the surface,
and returns exactly as many entries as the surface has positions — filled or
honestly empty.

```tsx
import { EmptyProofSlot } from "@/src/components/empty-proof-slot/empty-proof-slot";
import { ProofCard } from "@/src/components/proof-card/proof-card";
import { ProofStream } from "@/src/components/proof-stream/proof-stream";
import { SectionShell } from "@/src/components/section-shell/section-shell";
import { loadPage, slotsOfType } from "@/src/lib/content/loader";
import { resolveLocale } from "@/src/lib/i18n/locales";
import { composeViewerContext } from "@/src/lib/personalization/viewer-context";
import { selectRelevant } from "@/src/lib/relevance/select";
import type { RelevanceItem } from "@/src/lib/relevance/types";
import { geo } from "@/src/lib/relevance/types";

export default async function HomePage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const locale = resolveLocale((await params).lang);
  const query = await searchParams;
  const page = await loadPage("home", locale);

  // 1 — the viewer: route + language, entry context, location. One flat
  //     object, resolved outside every `use cache` boundary.
  const { viewer, seed } = await composeViewerContext({
    focusJob: "know-what-is-on", // the page's own declaration, never the trait's
    locale,
    routeId: "home",
    params: query,
    referrer: null, // the proxy hands the `Referer` down; see state/open.md
    now: new Date(),
  });

  // 2 — the pool: content slots with their relevance facets. Until the
  //     artifacts carry the facets (TS-007 D12 row 4) a page maps what it has.
  const items: RelevanceItem[] = slotsOfType(page, "proof-card").map((slot) => ({
    id: slot.id,
    type: "reference-case",
    geo: geo({ country: "de" }),
    jobRelation: { "know-what-is-on": "neutral" },
    date: null,
    clearance: slot.demo ? "unverified" : "cleared",
    demo: slot.demo,
    payload: slot,
  }));

  // 3 — the selection: gate · score · rotate · order · count.
  const proof = selectRelevant({ items, viewer, surface: "home", now: new Date(), seed });

  return (
    <SectionShell surface="ink" labelledBy="belege">
      <h2 id="belege">Was andere sagen</h2>
      <ProofStream>
        {proof.entries.map((entry, position) =>
          entry.kind === "item" ? (
            <ProofCard
              key={entry.id}
              state={entry.state} // "mocked" puts the Demo-Daten badge on itself
              contextLine={entry.item.payload.title}
              claim={entry.item.payload.fields.Headline}
              attribution={entry.item.payload.fields.Quelle}
              geo={{ level: "county", label: entry.item.geo.county ?? "" }}
              locale={locale}
            />
          ) : (
            <EmptyProofSlot
              key={`empty-${position}`}
              sentence="Für diese Aussage ist noch kein freigegebener Beleg hinterlegt."
            />
          ),
        )}
      </ProofStream>
    </SectionShell>
  );
}
```

Three things that example does on purpose:

- **The focus job is an input**, taken from the page's own declaration. No
  trait can change it — DEC-059 is enforced by the shape of the call, not by a
  rule somebody has to remember.
- **`now` and `seed` are arguments.** The page reads the clock; the engine
  never does (D7). That is what lets a test pin a week and a cached segment
  carry one.
- **An unfilled position renders an `empty-proof-slot`**, never one child
  fewer. An uncleared proof weakens the claim; it does not shorten the stream.

## The formula, as implemented

```text
score(e) = w_geo · geo(e) + w_ctx · ctx(e) + w_job · job(e)
         + w_time · (freshness(e) · editorial_weight(e))
```

rounded to six decimals, so that two elements of equal facets are a **real**
tie and the tie-break and rotation can fire.

| Term | Scale | Where |
| --- | --- | --- |
| `geo` | tier 0 same community 1.0 · 1 municipality 0.8 · 2 county 0.6 · 3 state 0.45 · 4 country 0.3 · 5 other country 0.15 · 6 no match 0.1 | `geo.ts` |
| `ctx` | starting type 1.0 · named widening 0.6 · anything else 0.3 | `context-matrix.ts` |
| `job` | supports 1.0 · neutral 0.5 · peripheral 0.2 · unassessed 0.2, and countable | `job-fit.ts` |
| `time` | ≤ 90 d 1.0 · ≤ 1 y 0.8 · ≤ 3 y 0.6 · ≤ 5 y 0.45 · older, undated 0.35, multiplied by the editorial weight (default 1.0, uncapped) | `freshness.ts` |

**Weights are a profile per focus job** (D5) — which is what settles "may
`w_job` outrank geo proximity": it may, and where is a property of the page.

| Focus job | `w_geo` | `w_ctx` | `w_job` | `w_time` |
| --- | --- | --- | --- | --- |
| know what is on | 0.45 | 0.20 | 0.15 | 0.20 |
| publish our dates | 0.35 | 0.25 | 0.25 | 0.15 |
| run our own calendar | 0.20 | 0.25 | 0.40 | 0.15 |
| understand who is behind it | 0.25 | 0.25 | 0.35 | 0.15 |

At **stage 0** (no location known) `w_geo` is 0 and its share moves to time and
job in DEC-048's ratio 4 : 3. For the 0.35 profile that reproduces DEC-048
exactly — `w_time 0.35 · w_ctx 0.25 · w_job 0.40`. For the other three the
ratio is this module's generalisation; DEC-048 decided one profile, not four
(→ `state/open.md`).

### The gates, before scoring

- **Clearance** (WEB-F-033): only `usage_rights: cleared` enters the pool. An
  uncleared element is not down-weighted — it does not exist for the engine.
  The one exception is the run's mock rule: an element marked `demo` passes
  carrying its flag, and the selection reports it as the `mocked` state so the
  page badges it as `Demo-Daten`. That is why the prototype shows the
  mechanism while Q-045 is open.
- **Place coverage** (WEB-F-024): a `placeBound` element is dropped unless its
  place is in the caller's covered set. Passing no set means "not asked", and
  the element stays — the gate never invents a coverage answer.

Both report what they dropped and why; nothing disappears silently.

### The sequence rule

*near · near · far · near · very far · middle · far.* Implemented from the
concept's spread rule:

1. score descending, ties by `id` ascending (the ISO-week seed may rotate an
   equal-score group first, and nothing else);
2. positions 1 and 2 are the two highest scorers — one local item on its own
   reads as coincidence;
3. from position 3, alternate **far · near**. *far* takes the element
   furthest from the current centre of gravity on the geo axis, provided it
   still scores at least **50 %** of the top remaining candidate; below that
   floor the top candidate stands. *near* takes the best scorer at or below
   the centre of gravity;
4. if the wanted side is empty, the top candidate is taken — alternation is a
   preference, never a deadlock;
5. cut to the surface's count (DEC-048): **3** inline beside a claim · **5**
   on the home page · **7** in the `/ueber-uns` stream. Fewer candidates give
   empty entries, never a shorter list.

Ordering reads `score` and `tier` only. It never sees a date, which is why the
result cannot degenerate into a chronological list.

### Determinism and rotation

Same trait, same place, same result. No `Math.random()`, no request-time
entropy. Variety is one input: the ISO week (`isoWeekSeed(now)` → `2026-W37`),
and it rotates equal-score groups only — the ranking never changes because of
it. Include the seed in the `cacheTag` so a week boundary invalidates cleanly.

### Segmentation

`segmentKey(viewer, seed)` → `{ community, trait, job, isoWeek }`, the props a
cached component takes (TS-005 D8, TS-009 D3). Resolve them *outside* the
`use cache` boundary — `headers()` and `cookies()` may not be read inside it —
and let the props be the cache key. `segmentCacheKey()` is the same thing as
one string.

## The modules

| File | What |
| --- | --- |
| `types.ts` | the shared vocabulary: geo levels, focus jobs, entry traits, item types, `RelevanceItem`, `ViewerContext` |
| `geo.ts` | `geoTier`, `geoProximity`, `hasGeo` — containment, not distance |
| `context-matrix.ts` | SRC-002's context matrix as data; `contextProximity`, `contextRow` |
| `job-fit.ts` | `jobFit`, `unassessedJobs` — the profile over all four jobs |
| `freshness.ts` | `freshness`, `timeScore`, `ageInDays` |
| `weights.ts` | the D5 profiles and the stage-0 redistribution |
| `score.ts` | `scoreItem`, `scoreAll` — the formula, with its four terms exposed |
| `order.ts` | `orderBySequenceRule` — the concept's spread rule |
| `rotation.ts` | `isoWeekSeed`, `rotateTies` |
| `gate.ts` | clearance and place coverage, before scoring |
| `select.ts` | **`selectRelevant`** — the one entry point, plus `SURFACE_COUNTS` |
| `segments.ts` | `segmentKey`, `segmentCacheKey` |
| `live-chain.ts` | the live modules' widening: place → surroundings → county → all |

There is **no `index.ts`**, following `src/lib/content/`: a barrel would let a
page pull the whole folder in for one symbol.

`src/lib/personalization/` imports from here; nothing here imports from there.
One direction, so the entry-trait ids are literally one constant.

## Acceptance criteria

| AC | State | Where |
| --- | --- | --- |
| TS-005-A1 geo tiers | ✅ unit | `geo.test.ts` |
| TS-005-A2 clearance filter | ✅ unit | `gate.test.ts`, `select.test.ts` |
| TS-005-A3 the worked example | ✅ unit | `worked-example.test.ts` — positions 1–7 reproduce the concept's table |
| TS-005-A4 determinism, 1000 runs | ✅ unit | `score.test.ts`, `select.test.ts` |
| TS-005-A5 stage 0 | ✅ unit | `weights.test.ts`, `score.test.ts` |
| TS-005-A6 editorial weight | ⚠️ unit | `freshness.test.ts` — the mechanism holds, **the criterion as written does not**: D4's five-year step is 0.45, so a fresh element is overtaken at a weight above ≈ 2.23, not at 2.0. → `state/open.md` |
| TS-005-A7 no deadlock | ✅ unit | `order.test.ts` |
| TS-005-A8 cached per segment | ✅ integration | `app/[lang]/_proof.ts` — a `use cache` function keyed on the candidates, the viewer and the ISO week, `cacheTag("proof:<iso-week>")` |
| TS-005-A9 prerendered shell first | ✅ integration | `cacheComponents: true` since M4; the selection sits inside the shell on every page that takes no place parameter |
| TS-005-A10 place-bound proof | 🔜 e2e | the gate is here; the covered-place list comes from events-api (mocked) |
| TS-005-A11 rotation | ✅ unit | `rotation.test.ts`, `select.test.ts` |
| TS-005-A12 ordering, ties by id | ✅ unit | `order.test.ts` |
| TS-005-A13 spot check on two pages | ✅ e2e | `e2e/pages/home.spec.ts` — DEC-048's counts on `/` and `/ueber-uns`, reproduced across reloads |
| TS-005-A14 context matrix | ✅ unit | `context-matrix.test.ts` |
| TS-005-A15 every claim resolves to a cleared proof | 🔜 static | a content check; the facets are not on the artifacts yet |
| TS-005-A16 the widening chain | ✅ unit | `live-chain.test.ts` |

## What this folder needs from others

Additive changes, written here rather than made in someone else's file:

1. **`src/lib/content/`** — a page cannot fill a `RelevanceItem` from a slot
   yet: the artifacts carry no `RelevanceFacets` (TS-007 D12 rows 4 and 6 are
   the same gap). When they do, the loader should expose one
   `relevanceFacets(slot)` so pages stop hand-mapping, and `check:content`
   should validate `geo`, `job_relation`, `editorial_weight` and `clearance`
   against this folder's types.
2. **`proxy.ts`** — the request's `Referer`, the platform geo headers and a
   `Sec-GPC`/`DNT` signal have to reach the page; `ViewerLocationRequest` in
   `../personalization/geolocation.ts` is the shape to hand over.
3. **`src/clients/events-api/`** — the covered-community list for the place
   gate, and the live-module queries the `live-chain.ts` steps describe.

## Deviations, recorded

- **Placement.** TS-005 D9 asks for `src/services/relevance/`. This repository
  has no `src/services/`; the run's libraries live in `src/lib/*` and the M4
  work package names `src/lib/relevance/`. The D9 boundary — pure scoring, no
  direct fetching, clients called from outside — holds either way.
- **The concept over the spec.** D6 describes the alternation against the
  *average* tier; the concept's spread rule adds the "furthest from the centre
  of gravity" pick and the 50 % score floor. Both are implemented, the concept
  first.
- `recognition` is read as `award` and `podcast` as `press` in the context
  matrix ([PROPOSED], `context-matrix.ts`).
