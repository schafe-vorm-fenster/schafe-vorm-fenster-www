---
artefact: tactical-spec
id: TS-009
profile: system
status: DRAFT
implements: [WEB-F-100, WEB-F-101, WEB-F-102, WEB-F-103, WEB-F-104, WEB-F-106]
sources: [SRC-002, SRC-011]
decisions: [DEC-002, DEC-019, DEC-021, DEC-032, DEC-033, DEC-041]
---

# TS-009 — Rendering and Resilience

## Purpose

How a page is produced and how it behaves when an app API is unavailable.
Two questions, one answer: the page is built in layers, and only the
outermost layer touches an app API. The shell is prerendered and never
waits; every module that needs live data streams in and carries its own
fallback chain, so an outage costs freshness, never a page.

*Which* route renders in which mode is TS-004 D6; *how long* anything is
cached is TS-003 D5. This spec fixes the mechanism both of them assume.

## Determinations

### D1 — Three rendering layers [FIXED: DEC-019, DEC-041 §8; realisation PROPOSED]

Next.js 16 Cache Components (`cacheComponents: true` in `next.config`)
is the mechanism. It admits exactly three kinds of content, and every
piece of the site is assigned to one of them:

| Layer | Contains | Realisation | Waits on an API? |
| --- | --- | --- | --- |
| **Shell** | layout, header, footer, headings, copy, static images, context band, CTAs, the module frames incl. their skeletons | prerendered at build; no `'use cache'` needed, no request values read | never |
| **Cached island** | proof stream, dates per place, nearby dates, active places, region examples, counters | `'use cache'` component with `cacheLife` + `cacheTag` per TS-003 D5, keyed by its props | only on a cache miss, and then behind a `<Suspense>` boundary |
| **Dynamic island** | anything that must read `headers()` / `cookies()` / `searchParams` per request — the request-value resolvers of D2 | wrapped in `<Suspense>`, streamed | yes, but never inside the shell |

The shell is the deliverable of the first byte. It contains the entire
visual structure of the page including the space every island will
occupy (D7). Islands arrive afterwards over the same response.

Consequence for TTFB (< 200 ms, TS-003 D1): TTFB measures the shell only.
No upstream latency and no upstream outage can move it, because no
upstream is on that path.

### D2 — Request values are resolved outside the cache boundary [FIXED: Next.js Cache Components; boundary map PROPOSED]

`cookies()`, `headers()` and `searchParams` **cannot be read inside**
`'use cache'`. They are read in a small dynamic resolver inside a
`<Suspense>` boundary and handed to the cached island **as props** —
props are part of the cache key automatically, which is what turns a
per-visitor value into a per-segment cache entry (TS-005 D8).

| Runtime value | Read from | Layer that reads it | Passed to |
| --- | --- | --- | --- |
| language | `[lang]` route param | shell (static, `generateStaticParams`) | everything |
| place (`?ort=`) | `searchParams` | dynamic resolver | dates, nearby, embed demo, region examples |
| coarse geo (community/county) | `x-vercel-ip-*` headers via `headers()` | dynamic resolver | proof stream, dates, nearby |
| entry trait | derived from route + referrer/campaign params | dynamic resolver | proof stream (TS-005 D8) |
| `Save-Data` | `headers()` | dynamic resolver | image variant choice (TS-003 D6) |
| ISO week seed | computed, not read from a request | resolver, passed as prop | proof stream (TS-005 D7) |

Rule: **a resolver returns props, never markup.** It resolves, then
renders the cached island with those props. Nothing else in the tree may
read a request value.

Rule: the *shape* of a prop is minimised before it becomes a cache key —
a community id, not a full geo object; a trait enum, not a referrer
string. A key that carries more than the island distinguishes multiplies
cache entries for nothing.

### D3 — Module inventory and its layer assignment [FIXED: TS-004 D6, TS-003 D5; assignment PROPOSED]

Consistent with TS-004 D6 ("all content pages: static + ISR, live modules
streamed via Suspense with skeletons"). Cache lifetimes are TS-003 D5's;
they are repeated here only as a pointer, never as a second source.

| Module | Layer | Props (cache key) | `cacheLife` (TS-003 D5) | `cacheTag` | Fallback |
| --- | --- | --- | --- | --- | --- |
| dates per place ("today", "this week") | cached island | `{community, window}` | dates | `dates:{community}` | tiers 1–3 |
| this week nearby | cached island | `{community, radiusStep}` | dates | `dates:{community}` | tiers 1–3 |
| active places / map | cached island | `{scope}` | active places | `places` | tiers 1–3 |
| region examples | cached island | `{county}` | active places | `places:{county}` | tiers 1–3 |
| proof stream | cached island | `{community, trait, job, isoWeek}` | proof per segment | `proof:{isoWeek}` | no API dependency (build data) |
| live counters | cached island | `{}` | counters | `stats` | tiers 1–2 only (D6) |
| place search | shell + client | — | — | — | own empty/error state, D9 |
| embed demo (Portalize loader) | client, lazy | — | — | — | third-party, outside the chain |

`/ueber-uns/archiv` and the landing-only domains carry no island at all
(TS-004 D6) — fully static, therefore trivially outage-proof.

### D4 — The three-tier fallback chain [FIXED: DEC-019; realisation PROPOSED]

The render cache and the resilience store are **two different things**.
An expired `'use cache'` entry is gone and cannot be read when the
upstream then fails, so the chain does not live in the framework cache.
It lives in one wrapper that every API client call goes through:

```
resilient(key, fetcher, { snapshot, timeoutMs })
  → { data, tier, fetchedAt, stale }
```

| Tier | Trigger | Source | On success | Visible marker |
| --- | --- | --- | --- | --- |
| 1 live | upstream answers within the timeout, response validates | upstream (via `src/clients/*`) | writes `last-good:{key}` in the Vercel Runtime Cache (DEC-046) with `fetchedAt` | none, unless older than its fresh TTL |
| 2 stale | upstream errors, times out, or fails schema validation | `last-good:{key}` inside its serve-stale window (TS-003 D5) | — | freshness label, D5 |
| 3 snapshot | no `last-good` entry, or it is past its serve-stale window | build-time snapshot artefact, D8 | — | freshness label, D5 |

Rules:

- **Failure is anything that is not a valid answer**: network error,
  non-2xx, timeout, or a payload that fails the Zod schema derived from
  the pinned OpenAPI spec (DEC-021). A malformed 200 must not reach a
  page.
- **One upstream attempt per render.** No in-request retries — a retry
  spends the visitor's time on a service that is already failing. The
  next revalidation retries.
- **Timeout: 800 ms** [PROPOSED]. It bounds how long an island's
  skeleton can stand; it never bounds the shell.
- **An empty result is tier 1, not a failure** (WEB-F-045). Zero dates in
  a place is an answer, and the page converts on it — the widening chain
  and the focus-job shift of WEB-F-044 handle it, not this cascade.
- The tier is decided per call, so one failing upstream degrades one
  module. A page can legitimately show tier 1, tier 2 and tier 3 modules
  side by side.

`last-good` writes are last-writer-wins per key and hold only the
validated payload plus `fetchedAt` — no request-scoped data, since the
key is the segment, not the visitor.

### D5 — Freshness envelope and the "Stand: …" label [FIXED: DEC-019, TS-003 D5; format PROPOSED]

Every resilient payload travels in the envelope of D4, and the module
renders the label from the envelope — never from its own clock, and never
from a guess.

| Condition | Label |
| --- | --- |
| tier 1, age ≤ fresh TTL | none |
| tier 1, age > fresh TTL (served stale while revalidating) | shown |
| tier 2 | shown |
| tier 3 | shown, with the build time as `fetchedAt` |

Rendering [PROPOSED]: `Stand: 9. Sep 2026, 14:20` (EN: `As of …`),
localized per TS-001, wrapped in `<time datetime="…">` with the ISO
value, placed in the module's header row next to its heading. Styled as
metadata, never as a warning: a stale module is a working module. No
icon, no colour signal, no "Fehler".

The label is content, not chrome — it is inside the island, so it streams
with the data it describes and reserves no space when absent.

### D6 — Counter exception: hidden, never snapshotted [FIXED: WEB-F-104, WEB-F-041]

"Counted live or not shown" outranks "every module always has content".
The counters therefore run a two-tier chain:

| State | Behaviour |
| --- | --- |
| tier 1 | figures, no label |
| tier 2, `last-good` within its serve-stale window (24 h, TS-003 D5) | figures **plus** the timestamp of D5 — mandatory here, not conditional |
| beyond the window, or no `last-good` | **the module is removed from the page.** No snapshot, no zeros, no placeholder figure, no "currently unavailable" |

There is no build-time snapshot artefact for counters (D8) — one must not
exist, so the tier-3 path cannot be taken by accident.

Layout consequence: the counter band's skeleton reserves the band's
height like every other island (D7), and removal collapses that space.
To keep the collapse out of CLS (< 0.1, TS-003 D1 / A7), the counter band
is **never placed above the fold** and is never an LCP element (TS-003
D2 lists none), so the collapse happens outside the viewport on first
paint. Both branches are measured — A8.

### D7 — Skeletons reserve the final space [FIXED: DEC-033, WEB-F-106; geometry PROPOSED]

Every island renders a skeleton as its `<Suspense>` fallback. Rules:

- **The skeleton is the final box.** Its outer geometry — width, height,
  margins, border radius — is the geometry the resolved module will have.
  It is built from the same layout component as the real module, with
  placeholder blocks in place of content, so the two cannot drift apart.
- **Fixed height comes from a fixed item count.** A list island renders
  exactly the number of rows it will render when resolved (three dates,
  five places); the count is a property of the module, not of the answer.
  A shorter answer leaves the last rows empty rather than shrinking the
  box.
- **No spinners, no blocking overlays, no "Lädt …" text** (WEB-F-106).
- **No travelling shimmer under `prefers-reduced-motion: reduce`** — the
  skeleton falls back to a still surface or, at most, an opacity pulse
  (TS-002 A9 permits opacity only).
- **Skeletons are `aria-hidden="true"`.** They are visual placeholders,
  not information. Where the arriving content changes the page's meaning
  rather than just filling it — the empty state on `/dein-ort`, which
  shifts the focus job (WEB-F-044) — the island's container is a
  `role="status"` region so the change is announced once.
- The skeleton never renders a fake value that could be read as data (no
  example figures, no placeholder place name).

Reserved geometry per module [PROPOSED]:

| Module | Reserved |
| --- | --- |
| dates per place | 3 date rows + header row |
| this week nearby | 3 date rows |
| active places / map | fixed aspect-ratio box (map) or 5 rows (list, TS-003 D6) |
| region examples | 3 cards, fixed card height |
| proof stream | element count per surface (Q-003), fixed card height |
| live counters | one band, three figure slots |

### D8 — Build-time snapshot artefact [PROPOSED]

Tier 3 needs a payload that exists before the first request. It is
produced by a build step, not by a runtime fetch.

| Property | Value |
| --- | --- |
| Location | `src/generated/snapshots/{module}.json`, generated, not hand-edited |
| Produced by | a build script that calls each upstream once per module in the D3 inventory whose fallback is "tiers 1–3" |
| Validated | against the same Zod schemas as runtime responses (DEC-021); an invalid answer does not become a snapshot |
| Content | one representative payload per module, at the widest scope (country-level dates, all active places) — never a place-specific one, because tier 3 has no segment |
| `fetchedAt` | the build timestamp, surfaced by D5 |
| Refresh | every deployment (TS-003 D5, "until next deploy") |
| Build fetch fails | the previously committed snapshot is kept, the build **warns**; the build fails only if a required snapshot is missing entirely |
| Counters | **no snapshot file** (D6) |

The snapshot is a resilience artefact, not content: it is small, it is
never the source for anything a page claims about a specific place, and
it is allowed to be visibly old — that is what the label of D5 is for.

### D9 — Failure containment [PROPOSED, within DEC-032]

- Every island sits in **its own error boundary**. A throwing island
  renders its tier-3 or empty state, never an error message and never a
  broken page (DEC-032: module errors stay invisible).
- The route-level `error.tsx` catches only genuine render errors of the
  shell; `global-error.tsx` stays fully static (TS-004 D6).
- A tier-2 or tier-3 render is **not** an error for the visitor and not a
  4xx/5xx status — the page stays 200. It *is* an event for monitoring:
  each degradation increments a counter with the module and the tier, so
  an outage is visible in operations rather than only in the page.
- The place search is a client interaction, not an island: it keeps its
  own inline failure state ("Suche gerade nicht möglich") because a
  search that returns nothing must not look like a place that has
  nothing.

### D10 — Guard against the per-request-function failure mode [FIXED: DEC-041 §8; enforcement PROPOSED]

The failure mode is a route that turns into a function invocation for
every request. It is cheap to create by accident — one `headers()` call
in a layout does it — and it destroys both the TTFB budget and the cost
model. Three guards:

| Guard | Level |
| --- | --- |
| `cacheComponents: true` makes an unguarded request-value read a **build error**, not a runtime surprise | build |
| CI asserts from the build manifest that every route of TS-004 D1 emits a **prerendered shell**, and that the number of fully dynamic routes is zero | CI |
| Production watch: function invocations per route are monitored; a route whose invocation count approaches its request count has regressed | RUM (DEC-017) |

Corollary rules: no request value in `layout.tsx`; no `'use cache'`
around anything that reads one (D2); every island either cached or inside
a `<Suspense>`; a resolver stays as small as the props it produces.

## Free for the generator

- [FREE] Visual design of the skeletons — colours, radii, shimmer
  treatment — within D7's geometry rules and TS-002.
- [FREE] Internal structure of `resilient()` and where the `last-good`
  store is wrapped, provided the envelope of D4 is what callers see.
- [FREE] Component file layout of resolver / cached island pairs.
- [FREE] Exact `<Suspense>` boundary granularity within a page — one per
  island or one per section — as long as no boundary spans two modules
  with different fallback tiers.

## Acceptance criteria

| ID | Level | Check |
| --- | --- | --- |
| TS-009-A1 | static | `cacheComponents: true` is set; no `cookies()`, `headers()` or `searchParams` access occurs inside a `'use cache'` module (build succeeds, lint rule green). |
| TS-009-A2 | tool | Build manifest: every TS-004 D1 route emits a prerendered shell; zero routes are fully dynamic. |
| TS-009-A3 | integration | With every upstream stubbed to a 5 s delay, the shell of each content page responds within the TTFB budget and contains header, footer, copy and all module skeletons. |
| TS-009-A4 | unit | `resilient()`: valid answer → tier 1 and a `last-good` write; upstream error/timeout/schema failure → tier 2 from `last-good`; empty or expired `last-good` → tier 3 snapshot; an empty valid answer stays tier 1. |
| TS-009-A5 | integration | Each D3 island is cached under the props listed there with the `cacheLife`/`cacheTag` of TS-003 D5; two visitors of one segment produce one cache entry. |
| TS-009-A6 | e2e | Simulated full API outage, warm cache: every page renders tier-2 content with a "Stand: …" label; status stays 200; no error text appears in any module. |
| TS-009-A7 | e2e | Simulated outage, cold cache: every module renders its tier-3 snapshot with a label; the counter band is absent from the DOM. |
| TS-009-A8 | tool | CLS < 0.1 on every content page in both counter branches — counters present and counters hidden — with all islands streaming. |
| TS-009-A9 | integration | For every D3 island, the skeleton's rendered box equals the resolved module's box (height within 2 px); no skeleton renders a spinner or a placeholder figure. |
| TS-009-A10 | unit | The freshness label appears exactly under D5's four conditions, carries a valid `<time datetime>`, and is localized. |
| TS-009-A11 | integration | An island whose fetcher throws does not affect the route: page status 200, the other islands render, the failing island shows its fallback state. |
| TS-009-A12 | tool | Snapshot build step produces a file for every D3 module with fallback "tiers 1–3", produces none for counters, and fails the build if a required file is missing. |
| TS-009-A13 | manual | Screen reader: skeletons are not announced; the `/dein-ort` empty state is announced once on arrival. Under `prefers-reduced-motion` no skeleton animates. |

## Coverage

| Requirement | Discharged by |
| --- | --- |
| WEB-F-100 (server render, cached; shell never blocks; TTFB) | D1, D2, D3, D10 · A1, A2, A3 |
| WEB-F-101 (tier 1: fetch server-side, stream, cache) | D1, D3, D4 · A3, A4, A5 |
| WEB-F-102 (tier 2: last cached answer, freshness label) | D4, D5, D9 · A4, A6, A10, A11 |
| WEB-F-103 (tier 3: build-time snapshot) | D4, D8 · A4, A7, A12 |
| WEB-F-104 (counters: tier 2 with timestamp, never tier 3) | D6 · A4, A7, A8 |
| WEB-F-106 (skeletons reserve final space, no spinners) | D7, D1 shell · A8, A9, A13 |

## Open points

- **Where does `last-good` live?** D4 requires a store that survives an
  expired render-cache entry and is readable during an outage. Candidates:
  Vercel Runtime Cache (regional, ephemeral — may be empty exactly when
  needed), Vercel Blob (durable, slower), Edge Config (fast, small,
  write-limited). Question to jan-henrik: which store, and is a regional
  cache acceptable as the only tier-2 source given that a cold region
  falls straight to tier 3?
- **Does the counter band collapse entirely, or does its heading stay?**
  D6 removes the module; whether the surrounding section — headline and
  claim — disappears with it is a copy and design question, and it
  decides how much space collapses. Question to jan-henrik / design.
- **Upstream timeout of 800 ms is set, not measured** (D4). It needs the
  p95 latency of events-api and geo-api before launch; too low turns
  healthy responses into tier 2 and hides live data behind labels.
- **Q-015** (do `events-api /api/stats` fields cover places · dates ·
  updates today) decides what the counter module can show at all, and
  therefore what D6 hides.
- **Q-030** (cache cost of community-level segmentation) applies to the
  `last-good` store as well, not only to the render cache: one key per
  segment per module. Measure both together.
- **Snapshot refresh depends on Q-018** (what triggers a website rebuild
  on content change). If deployments become rare, tier 3 ages between
  them — acceptable with the label of D5, but the ageing should be a
  known number, not a surprise.
- **"Stand: …" in the other languages** (D5) needs the localization pass
  of DEC-026; the EN wording proposed here is not confirmed copy.
