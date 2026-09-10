---
id: DEC-041
title: Relevance engine — website-owned service, geo hierarchy of the geo-api, segmented not personalised
status: accepted
date: 2026-09-10
decided_by: jan-henrik.hempel
---

## Decision

1. **Geo hierarchy follows the geo-api**: `country > state > county >
   municipality > community` — **five** levels. Corrected 2026-09-10:
   an earlier version fixed four and dropped `state` on the premise that
   the geo-api offers four. It does not — `GeoAdministrativeHierarchy` is
   `place? > community > municipality > county > state > country` with
   `state` required. Seven proximity tiers including *different country*
   (TS-005 D1). GTM's model packages follow later; the website does not
   wait for them.
2. **Jobs are the relevance dimension, and relations carry them —
   not audiences.** Corrected 2026-09-10: an audience-derived mapping
   collapses, because `actors` alone holds reader, publisher, customer
   and multiplier. ADR-003's relation axis maps onto the four jobs almost
   one to one. Each element carries an **assessed profile over all four
   jobs** with a stated reason, set once at generation time and sticky
   across regeneration — never a mechanical lookup. Unassessed takes the
   lowest step and stays countable.
3. **The website has its own content schema**; GTM sources are mapped onto
   it at generation time (parallel session). The engine reads the
   website's schema only.
4. **Neighbourhood tiers are out of scope.** "Neighbouring state /
   county / municipality / place" would need adjacency data that does not
   exist. The algorithm works without them; the idea is filed as a
   geo-api capability (schafe-vorm-fenster/geo-api#165).
5. **Time is a weight, not a verdict.** Recency helps but does not
   decide: an older element with better context proximity may win. The
   website's content schema therefore carries a per-element **editorial
   weight**, set when the content is generated, so an evergreen piece can
   be marked as such.
6. **Deterministic, rotated weekly.** The same visitor trait in the same
   place always sees the same order — reproducible for cache, test and
   measurement. Variety comes from one scripted rotation seeded by the
   **ISO week** (`2026-W37`), which reorders equally-scored candidates
   only; it never changes ranking. The seed is an engine input, not a
   clock read inside the engine, and it is part of the cache tag. Never
   randomness at request time, never an LLM.
7. **Segmented, not personalised.** Dynamic elements are segmented by
   (a) geo at **community** level — corrected 2026-09-10 from
   municipality, which made tier 0 unreachable — and (b) entry trait,
   from which the focus job is derived. No per-visitor rendering. The
   cache cost of that resolution is measured before launch (Q-030).
8. **The static shell is never sacrificed.** Dynamic elements load a
   static default server-side and stream their segmented variant; the
   route's shell stays prerendered. Turning every route into a function
   invocation is the failure mode to avoid.
9. **The engine is an internal service** in this repository
   (`src/services/relevance/`), using clients for external APIs —
   following the ecosystem's `services/` + `clients/` structure
   (geo-api, events-api).

## Consequences

→ TS-005. Editorial weight is an input, not a formula term. Weights are a
profile per focus job, which settles Q-004 (job fit may outrank geo, and
where is a property of the page). Two risks are now tracked: cache cost
of community segmentation (Q-030) and assessment drift of the sticky
facets (Q-031).

The corrections of 2026-09-10 come from the website content production
concept in `go-to-market-os`, which specifies the schema this engine
reads. Where that document and this one disagreed, it was right on the
facts — the geo-api hierarchy was verified in source.
