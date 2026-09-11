---
id: DEC-075
title: The last-good store is the Vercel Runtime Cache, behind one interface — @vercel/functions enters the stack
status: accepted
date: 2026-09-11
decided_by: run/developer (M4 live-data work package)
---

## Context

TS-009 D4 fixes the three-tier fallback chain and is explicit that the render
cache and the resilience store are **two different things**: an expired
`'use cache'` entry is gone and cannot answer when the upstream then fails,
so tier 2 needs a store that still holds the last validated payload at
exactly the moment the framework cache has nothing.

TS-009's own open points leave the store undecided and name three candidates
— Vercel Runtime Cache (regional, ephemeral), Vercel Blob (durable, slower),
Edge Config (fast, small, write-limited) — with the question addressed to
jan-henrik. DEC-045/046 already point at the Runtime Cache. The run may not
ask (plan/guardrails.md), so this work package decides and records.

Reaching the Runtime Cache from application code needs `@vercel/functions`,
which is a new runtime dependency and therefore the stack-harmony rule.

## Decision

**1 — Tier 2 is served from the Vercel Runtime Cache, behind the
`LastGoodStore` interface in `src/lib/live/last-good.ts`.**

`getCache()` from `@vercel/functions`, namespaced `last-good`, one entry per
segment key, TTL = the serve-stale window of TS-003 D5 for that data kind,
tagged so a purge can reach one module's entries. Two implementations stand
behind the interface: the Runtime Cache one and an explicit in-memory map the
tests hand in. Nothing else in the tree knows which store answered.

**2 — `@vercel/functions@3.9.7` enters `dependencies` and
`stack.allow.json`.**

Sideways look (plan/guardrails.md rung 1): no sibling repository uses
`@vercel/functions` today; `assets-api` carries `@vercel/blob` and
`translation-api` `@vercel/edge-config`, so *first-party Vercel packages for
platform services* is already the family's pattern, and this is the same
pattern for a different service. Alternatives considered and rejected:

- **Vercel Blob** — durable and cross-region, but a read on every degraded
  render costs a network round trip to object storage and the failure mode we
  are protecting against is already a slow one. Also a billed store for data
  that is allowed to be lost.
- **Edge Config** — write-limited by design and provisioning it needs a read
  token that this run was denied (`state/open.md` row 21 records the same
  wall from the CSP work).
- **No store at all** (in-process memory only) — on serverless the instance
  is ephemeral, so tier 2 would almost never fire and every outage would land
  on tier 3. That empties TS-009 D4 of its middle tier.

**3 — Regionality is accepted, and recorded rather than hidden.**

The Runtime Cache is per region: a cold region falls straight to tier 3. For
a preview-only prototype that is the right trade — tier 3 exists, is labelled,
and the alternative costs a durable store. The question TS-009 asks
jan-henrik ("is a regional cache acceptable as the only tier-2 source") stays
open for the hardening round; the interface is what makes the answer a
one-module change.

**4 — Cache Components (`cacheComponents: true`) is *not* switched on by this
work package. [PROPOSED]**

`use cache` and `cacheLife` need that flag, and turning it on makes every
unguarded request-value read a build error across the whole route tree —
which is its point, and also why it cannot land from a work package that owns
no page. `src/lib/live/cache-profiles.ts` carries TS-003 D5's numbers in both
shapes (`cacheControlFor()` for the BFF routes, `cacheLifeProfile()` for the
islands), so the flip is a config change plus a directive per island, never a
second table of numbers. `state/open.md` carries the row.

## Consequences

- One new runtime dependency, one transitive (`@vercel/oidc`, also Vercel),
  no install scripts, `pnpm audit --prod` clean.
- `getCache()` falls back to an in-process cache when no platform cache is
  bound, so `next dev` and the test suite exercise the same code path.
- Tier 2 is only as good as the region's cache. Measuring its hit rate
  belongs with Q-030 (cache cost of community-level segmentation), which
  applies to this store as much as to the render cache.
