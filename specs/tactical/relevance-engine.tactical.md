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

### D1 — Geo hierarchy [FIXED: DEC-041, corrected 2026-09-10]

**Five levels**: `country > state > county > municipality > community`.
Verified against `geo-api/src/types/GeoLocation/geo-location.types.ts`,
where `GeoAdministrativeHierarchy` is `place? > community > municipality
> county > state > country` and **`state` is required**. An earlier
four-level version of this determination dropped `state` on the mistaken
premise that the geo-api offers four; it does not. Unknown levels are
`null`; `place` is finer than the website needs and is not carried.

**The level rule is coverage, not venue.** An element is recorded at the
most specific level that covers what it is *about* — usually where it
happened, sometimes not: the NØRD Award is an MV award held in Rostock
and scores as `state`; the KfW Award is nationwide and scores as
`country` regardless of the ceremony's city. The venue survives in the
copy, never in the level.

Proximity tiers, computed from the most specific level downwards:

| Tier | Match | Weight |
| --- | --- | --- |
| 0 | same community | 1.0 |
| 1 | same municipality | 0.8 |
| 2 | same county | 0.6 |
| 3 | same state | 0.45 |
| 4 | same country | 0.3 |
| 5 | different country | 0.15 |
| 6 | no match / element has no geo | 0.1 |

Tier 5 carries the other country domains and appearances abroad. It is
nearly empty in today's stock — which is the point: it is what makes
*very far* reachable at all once the stock fills.

**No distance tier in phase 1.** Administrative containment is the only
measure. This is a known mismatch with the site's own argument —
`/deine-region` sells "thirty kilometres, across municipal boundaries"
while the scale cannot express it, and a visitor 8 km away across a
Kreisgrenze scores as *same state*. Accepted for phase 1: a distance
tier needs coordinates on every element and on the visitor. Revisit with
the map view. Neighbourhood tiers likewise absent (geo-api#165).

**What stage 1 delivers.** IP geolocation resolves to county level,
rarely finer, so tiers 0 and 1 fire only after a place search. Proof
starts at county scale and becomes local the moment someone searches.

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

### D3 — Job relation [FIXED: DEC-041, corrected 2026-09-10]

Every selectable element carries a **profile over all four jobs**, set as
an assessment at generation time with a stated reason — not derived from
a table:

```yaml
job_relation:
  know-what-is-on: neutral
  publish-our-dates: supports
  run-our-own-calendar: supports
  understand-who-is-behind-it: neutral
job_relation_reason: >
  Testimonial of a publishing Verein; carries the publishing argument
  directly and the licence argument by example. Not a reader's voice.
```

Scale per job: `supports` 1.0 · `neutral` 0.5 · **`peripheral`** 0.2
(renamed from `alien`, which read as a verdict rather than an absence).
**A job left unassessed takes the lowest step and is marked unassessed**,
so the gap stays countable — in doubt an element holds back rather than
appearing everywhere.

**Relations carry the jobs, not audiences.** ADR-003 splits the hub's
model into audience (durable identity) and relation (posture towards us).
The relations map onto the jobs almost one to one — `reader` → know what
is on, `publisher` → publish our dates, `customer` → run our own
calendar, `multiplier`/`funder` → understand who is behind it,
`advertiser` → no job (offering withheld). This corrects the earlier
audience-based derivation: `actors` alone holds reader, publisher,
customer and multiplier, so an audience-derived mapping marks it as
supporting everything — 25 % of the score spent on a constant. The
correspondence is guidance for the assessment, never a lookup.

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

**Weights are a profile per focus job**, not one set for the whole site.
This settles the relevance model's open point ("whether `w_job` may
outrank geo proximity"): it may, and where is a property of the page.

| Focus job | w_geo | w_ctx | w_job | w_time |
| --- | --- | --- | --- | --- |
| know what is on (`/dein-ort`) | 0.45 | 0.20 | 0.15 | 0.20 |
| publish our dates | 0.35 | 0.25 | 0.25 | 0.15 |
| run our own calendar | 0.20 | 0.25 | 0.40 | 0.15 |
| understand who is behind it | 0.25 | 0.25 | 0.35 | 0.15 |

Rationale: on `/dein-ort` everything starts at the visitor's own place;
on the sell pages a mayor from Baden-Württemberg is better served by
Rubkow than by an arbitrary local clipping. The profiles are
[PROPOSED] — the shape is fixed, the numbers are revised from
measurement. At stage 0 (no geo known) `w_geo` is 0 and its share moves
to `w_time` and `w_job` — **0.20 and 0.15** (DEC-048), giving `w_time 0.35 · w_ctx 0.25 · w_job 0.40`.

**Clearance is a hard filter applied before scoring** — elements without
cleared usage rights never enter the pool, they are not down-weighted
(WEB-F-033).

**Place-bound elements come only from covered places** (WEB-F-024):
selectable types carry `place_bound` and the place reference, so the
engine can ask events-api before showing "in <place>" to a visitor whose
place is empty. Such elements are filtered out together with clearance.

**Clearance can go stale.** `usage_rights` is denormalised onto the
content file at generation time, so a revocation in the hub leaves the
local file claiming `cleared`. The build re-validates every clearance
facet against the installed package version and **fails** on mismatch;
a revocation removes content immediately rather than waiting for a
review round.

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
4. Stop at the element count for the surface (DEC-048): 3 inline beside a claim · 5 on the home page · 7 in the `/ueber-uns` stream.

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
| geo | **community** — falls back to municipality if production cache figures demand it (DEC-055, a parameter change) — corrected 2026-09-10: municipality made tier 0 unreachable, since the engine would never learn the visitor's community and could not distinguish tier 0 from tier 1. Community makes the place effect real, at roughly 10–20× the cache entries. That trade is accepted. |
| entry trait | the entry contexts of SRC-002, from which the focus job derives |

Realisation (Next.js Cache Components): the route shell stays
prerendered. The proof stream and live modules are cached components that
take `{ community, trait, job }` **as props** — resolved outside the
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
| TS-005-A1 | unit | Geo tiers 0–6 per D1 for every level combination, including `state`, foreign-country elements, and elements without geo. |
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
| TS-005-A12 | unit | Ordering: given more than three elements the engine produces the D6 sequence and never a chronological one; ties break by id. **Limitation:** this proves the engine orders correctly, not that every list on the site uses it — a spot check on two rendered pages (A13) is the only coverage of that. |
| TS-005-A13 | e2e | Spot check on `/` and `/ueber-uns`: the rendered proof stream is not in date order. The archive is the documented exception (TS-028 D2) and is excluded. |
| TS-005-A14 | unit | For each entry context of the SRC-002 matrix the engine selects the documented starting type and time window; a type named in no row scores the widest step. |
| TS-005-A15 | static | Every claim declared in content frontmatter resolves to a proof id that exists and is cleared, or is explicitly marked as having no proof — in which case the rendered claim carries its weakened form. A declared claim with a dangling proof id fails the build. |
| TS-005-A16 | unit | The widening chain resolves in the documented order (place → surroundings → county → all regions) and each step sends the id list of its level; no step is skipped when the previous one returns results. |

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
| WEB-F-030 (lists ordered by the model) | D6 · A12, A13 |
| WEB-F-035 (entry context selects starting type) | D2 · A14 |
| WEB-F-036 (proof slot beside every claim) | D5 · A15 |
| WEB-F-042 (live modules widen) | D1, D8 · A16 |

## Open points

- D2 weights, D4 steps, D6 ordering are [PROPOSED] — deliberately simple,
  to be revised from measurement (H1–H6), not opinion.
- Q-002 (stage-0 split), Q-003 (element count per surface), Q-004 (may
  job fit outrank geo).
- The website content schema (parallel session) must deliver: four-level
  geo, job relation, editorial weight, clearance.
