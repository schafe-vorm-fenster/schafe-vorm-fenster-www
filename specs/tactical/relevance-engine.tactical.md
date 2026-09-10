---
artefact: tactical-spec
id: TS-005
profile: system
status: DRAFT
implements: [WEB-F-024, WEB-F-030, WEB-F-031, WEB-F-032, WEB-F-033, WEB-F-034, WEB-F-035, WEB-F-036, WEB-F-038, WEB-F-042, WEB-F-052, WEB-F-055]
sources: [SRC-002]
decisions: [DEC-019, DEC-025, DEC-041]
---

# TS-005 — Relevance Engine

## Purpose

How proof and live content are selected, scored and ordered for a given
visitor and page. The engine is a pure function over a normalised element
set; everything impure — fetching, caching, segmenting — sits around it.

## Determinations

### D1 — Geo hierarchy [FIXED: DEC-041]

Four levels, matching the geo-api: `country > county > municipality >
community`. Every element and every visitor position is expressed in
these terms; unknown levels are `null`.

Proximity tiers, computed by comparing element position to visitor
position from the most specific level downwards:

| Tier | Match | Weight |
| --- | --- | --- |
| 0 | same community | 1.0 |
| 1 | same municipality | 0.8 |
| 2 | same county | 0.6 |
| 3 | same country | 0.3 |
| 4 | no match / element has no geo | 0.1 |

Neighbourhood tiers are deliberately absent (DEC-041, geo-api#165). An
element without geo scores tier 4 rather than being excluded.

### D2 — Context proximity [PROPOSED]

Every element type has a defined proximity to every entry context — no
type is without a relation. The entry context (SRC-002 context matrix)
names a starting type and a widening set; this spec makes the remainder
explicit rather than leaving it undefined:

| Relation to the entry context | Weight |
| --- | --- |
| starting type | 1.0 |
| named widening type | 0.6 |
| any other type | 0.3 |

The full type × context matrix is generated from the context matrix in
SRC-002 and lives with the engine as data, not code.

### D3 — Job fit [FIXED: DEC-041]

`job_fit` is the element's declared relation to the focus job, carried by
the website's content schema (which maps GTM audiences onto jobs at
generation time). Scale: supports the focus job `1.0` · neutral `0.5` ·
alien `0.2`.

### D4 — Time and editorial weight [FIXED: DEC-041; steps PROPOSED]

Recency is one weight among four, never a verdict. Base freshness:

| Age | Weight |
| --- | --- |
| ≤ 90 days | 1.0 |
| ≤ 1 year | 0.8 |
| ≤ 3 years | 0.6 |
| ≤ 5 years | 0.45 |
| older | 0.35 |

The floor is deliberately high (0.35, not 0.2): an old element with
strong context proximity should still be able to win. The content schema
additionally carries an **editorial weight** per element (default 1.0),
set when the content is generated, which multiplies freshness — this is
how an evergreen piece is marked as such without touching the algorithm.

### D5 — Scoring [FIXED: SRC-002]

```
score(e) = w_geo · geo(e) + w_ctx · ctx(e) + w_job · job(e)
         + w_time · (freshness(e) · editorial_weight(e))
```

Weights: `w_geo 0.35 · w_ctx 0.25 · w_job 0.25 · w_time 0.15`. At stage 0
(no geo known) `w_geo` is 0 and its share moves to `w_time` and `w_job`
(exact split: Q-002).

**Clearance is a hard filter applied before scoring** — elements without
cleared usage rights never enter the pool, they are not down-weighted
(WEB-F-033).

**Place-bound elements come only from covered places** (WEB-F-024): an
element referencing a place without data in events-api is filtered out
with clearance.

### D6 — Ordering [PROPOSED — pragmatic first pass]

The shape wanted is *near · near · far · near · very far · middle · far*
(WEB-F-031). Kept deliberately simple, to be optimised later:

1. Sort by score, descending. Ties break by `id`, ascending.
2. Positions 1 and 2: the two highest scorers.
3. From position 3, alternate `far` / `near`:
   - `far` = the highest scorer whose geo tier is **more distant** than
     the average tier of everything already placed;
   - `near` = the highest scorer whose tier is **at or below** that
     average.
   If the wanted side has no candidate, take the highest scorer of the
   other side — alternation is a preference, never a deadlock.
4. Stop at the element count for the surface (Q-003).

### D7 — Determinism and rotation [FIXED: DEC-041]

Same trait, same place, same result — always. No `Math.random()`, no
request-time entropy, no LLM.

Variety comes from one deterministic rotation seed: **the ISO week**
(`ISO-year + ISO-week`, e.g. `2026-W37`). It shifts selection among
candidates whose scores are equal, and nothing else — ranking never
changes because of it.

Consequences of choosing the week:

- Within a week every visitor of a segment sees the same stream; the
  stream refreshes on Monday. Slow enough that a returning visitor
  recognises the site, fast enough that it does not fossilise.
- The seed is an **explicit engine input**, never read from the clock
  inside the engine — so tests pin it and cached segments carry it.
  `cacheTag` includes the seed, so a week boundary invalidates cleanly
  instead of serving last week's order.

### D8 — Segmentation and caching [FIXED: DEC-041]

The engine never renders per visitor. Two segmentation axes:

| Axis | Resolution |
| --- | --- |
| geo | **municipality** — county is too coarse for the visitor, community too many variants |
| entry trait | the entry contexts of SRC-002, from which the focus job derives |

Realisation (Next.js Cache Components): the route shell stays
prerendered. The proof stream and live modules are cached components that
take `{ municipality, trait, job }` **as props** — resolved outside the
cached boundary, because `cookies()` / `headers()` may not be read inside
`use cache`. Props become the cache key automatically, giving one entry
per segment rather than per visitor. Each carries `cacheLife` per TS-003
D5 and a `cacheTag` for its data source.

Rule to protect the shell: a dynamic element renders a **static default**
first (the stage-0 result) and swaps to its segment variant when
resolved. No route becomes a per-request function because of relevance.

### D9 — Placement in the codebase [FIXED: DEC-041]

`src/services/relevance/` — an internal service in the ecosystem's
`services/` + `clients/` idiom (as in geo-api and events-api). It calls
`src/clients/geo-api/` and `src/clients/events-api/`; it never fetches
directly. The scoring functions are pure and free of I/O.

## Free for the generator

- [FREE] Internal module split of the service, provided D9's boundary
  holds and the scoring functions stay pure.
- [FREE] Skeleton design of the streamed elements, within WEB-F-106.

## Acceptance criteria

| ID | Level | Check |
| --- | --- | --- |
| TS-005-A1 | unit | Geo tiers per D1 for every combination, including elements without geo. |
| TS-005-A2 | unit | Clearance filter removes uncleared elements before scoring; a high-scoring uncleared element never appears. |
| TS-005-A3 | unit | Scoring reproduces SRC-002's worked example — visitor from Lehre, stage 1: positions 1–7 in the documented order. |
| TS-005-A4 | unit | Determinism: identical input yields identical output across 1000 runs; ties resolve by id. |
| TS-005-A5 | unit | Stage 0 (no geo): `w_geo` is 0 and the order is driven by time and job fit. |
| TS-005-A6 | unit | Editorial weight: an element five years old with weight 2.0 outranks a fresh element of equal other scores. |
| TS-005-A7 | unit | Ordering never deadlocks: with candidates on only one side, the stream still fills. |
| TS-005-A8 | integration | The proof stream component is cached per `{municipality, trait, job}`; two visitors from the same municipality with the same trait hit one cache entry. |
| TS-005-A9 | integration | The route shell renders prerendered without waiting for the engine; the static default appears before the segment variant. |
| TS-005-A10 | e2e | Place-bound proof shown to a visitor always references a covered place. |
| TS-005-A11 | unit | Rotation: two different ISO-week seeds reorder only equally-scored candidates; the ranking by score is identical. The engine reads no clock — the seed is an input. |

## Coverage

| Requirement | Discharged by |
| --- | --- |
| WEB-F-024 (place-bound proof from covered places) | D5 · A10 |
| WEB-F-030 (lists > 3 ordered by the model) | D6 |
| WEB-F-031 (sequence rule) | D6 · A3, A7 |
| WEB-F-032 (formula and weights) | D5 · A3, A5, A11 |
| WEB-F-033 (clearance hard filter) | D5 · A2 |
| WEB-F-034 (spread rule) | D6 · A3, A7 |
| WEB-F-035 (entry context selects starting type) | D2 |
| WEB-F-036 (proof slot beside every claim) | D5 |
| WEB-F-038 (geo hierarchy) | D1 · A1 |
| WEB-F-042 (live modules widen) | D1, D8 |
| WEB-F-052 (stages change selection only) | D8 · A9 |
| WEB-F-055 (entry context preselects) | D2, D8 · A8 |

## Open points

- D2 weights, D4 steps, D6 ordering are [PROPOSED] — deliberately simple,
  to be revised from measurement (H1–H6), not opinion.
- Q-002 (stage-0 split), Q-003 (element count per surface), Q-004 (may
  job fit outrank geo).
- The website content schema (parallel session) must deliver: four-level
  geo, job relation, editorial weight, clearance.
