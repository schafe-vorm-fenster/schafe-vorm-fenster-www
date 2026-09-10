---
id: DEC-041
title: Relevance engine — website-owned service, geo hierarchy of the geo-api, segmented not personalised
status: accepted
date: 2026-09-10
decided_by: jan-henrik.hempel
---

## Decision

1. **Geo hierarchy follows the geo-api**: `country > county > municipality
   > community`. The website's own content schema uses these four levels
   so content can be selected at every one of them. GTM's model packages
   will follow later — the website does not wait for them and does not
   change them.
2. **Jobs, not audiences, are the relevance dimension.** The
   job-based framework of the information architecture governs. GTM
   defines audiences; the website's content schema maps them onto jobs
   when content is generated. The mapping is content work, not engine
   work.
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
   (a) geo, simplified to municipality level, and (b) entry trait, from
   which the focus job is derived. No per-visitor rendering.
8. **The static shell is never sacrificed.** Dynamic elements load a
   static default server-side and stream their segmented variant; the
   route's shell stays prerendered. Turning every route into a function
   invocation is the failure mode to avoid.
9. **The engine is an internal service** in this repository
   (`src/services/relevance/`), using clients for external APIs —
   following the ecosystem's `services/` + `clients/` structure
   (geo-api, events-api).

## Consequences

→ TS-005. Supersedes the assumption in Q-002/Q-004 that weighting is
purely formulaic: editorial weight is now an input.
