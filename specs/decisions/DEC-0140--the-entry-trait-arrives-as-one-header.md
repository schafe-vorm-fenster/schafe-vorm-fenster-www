---
id: DEC-0140
title: The entry trait arrives as one header — the proxy hands down a host and a medium, and block 2a reorders inside a boundary whose fallback is the direct order
status: DRAFT
date: 2026-09-26
decided_by: the engineering team
---

## Context

`TS-WEB-0019 D3a` orders block 2a of `/` by the entry trait, `TS-WEB-0019-A7`
tests it, and `DEC-0109 §2` worked out what the module costs in each of the
three positions. None of it ran. `resolveEntryTrait()` and
`orderByTrait()` were complete and unit-tested since M3, and
`src/lib/personalization/README.md` said in the `TS-WEB-0010-A4` row why:
*"the trait half (stage 2) cannot fire while the proxy hands no `Referer`
down"*. `state/open.md` row 71 said the same. `app/[lang]/page.tsx` carried the
matching comment — *"The trait-dependent order is a runtime property of
TS-WEB-0010 and lands with the stages at M4"* — and `home.spec.ts` carried A7
as a `test.fixme`.

Three constraints meet on the hop that closes it:

- `TS-WEB-0010 D2` step 2 derives the trait from the `Referer` header and the
  `etcc_*`/`utm_*` parameters. Only `proxy.ts` sees the header before the
  render.
- `TS-WEB-0010 D8` and `DEC-0045`: *"No route becomes a per-request function
  because of personalization."* Reading a header makes its reader dynamic, and
  `/` is a prerendered route.
- `TS-WEB-0009 D2`'s last rule (`TS-WEB-0009-A14`, `DEC-0078`): no control that
  holds what a visitor types may sit inside a streamed boundary.

## Decision

### 1. The hand-down is two values, not the request

`proxy.ts` sets one request header, `x-svf-entry-context` — the same
convention as `x-svf-not-found-locale` — carrying a `URLSearchParams`
serialisation of at most two fields:

| Field | Value | Why not more |
| --- | --- | --- |
| `ref` | the referrer's registrable host, lowercased, without `www.` | a referrer URL is somebody else's page and its **path** is the part that can say what that visitor was reading. `D3` matches on the host, so the host travels |
| `med` | the campaign medium, and only when it is one of the three tokens `D3` recognises (`print` · `newsletter` · `social`) | an unrecognised medium already falls through to the referrer in `resolveEntryTrait()`, so dropping it changes no outcome and keeps arbitrary query text out of a header |

`src/lib/personalization/entry-handover.ts` owns both directions. Its input
type is `{ referrer, searchParams }` and has **no field for a geo or an IP
value**, which is how `TS-WEB-0010-A11` is met here — by shape, not by
discipline. Nothing is persisted: the value lives for one request, in a header
(`NFR-WEB-0061`, `NFR-WEB-0062`). `proxy.test.ts` asserts that no IP, no geo
header and no `?ort=` value appears in it, and that the response carries no
`Vary` and no `Set-Cookie`.

The header is set on **every** request, including to the empty string, so a
client that sends `x-svf-entry-context` itself cannot choose its own segment:
the proxy's `set()` overwrites what arrived.

`entry-context.ts` gained one input, `referrerHost`, which replaces `referrer`
when present, and exports the normalisation both paths use — two
normalisations would be two segmentations, which is the defect `D3`'s "one
shared constant" rule exists to prevent.

### 2. The order is read inside a boundary whose fallback is the `direct` order

`app/[lang]/_scenes.tsx` is new and holds `TS-WEB-0019 D3a`'s table, the
`orderByTrait()` call and one `<Suspense>` boundary. The fallback renders the
three scenes in the `direct` order, which is **the stage-0 result** — what a
crawler, a JS-less visitor and every visitor without an entry context get
(`TS-WEB-0010 D8`) — and the resolved branch renders the same three nodes in
the trait's order. Fallback and branch go through one component, the way block
1's three boundaries do (`DEC-0078`).

Three things follow, and each is asserted:

- The shell stays prerendered. The dynamic read is inside the boundary; no
  route became a per-request function.
- `TS-WEB-0009-A14` holds by construction. The scenes hold no `<input>`,
  `<textarea>` or `<select>` — the page's two search fields stand in the
  prerendered shell — and the module's three step lines are `<button>`s, which
  hold no value.
- D3a is ordering and nothing else. The three scene nodes are built once by
  the page and handed to `_scenes.tsx` as a record keyed by mechanism, so a
  trait cannot reach inside one; and `orderByTrait()` refuses a variant that is
  not a permutation of the default order. `app/[lang]/_scenes.test.ts` walks all
  eight traits and asserts the `whatsapp` scene's position is 0, 1 or 2 and
  never anything else — "no trait changes which mechanism carries the module".

### 3. Where the specification disagrees with itself, and what was shipped

`TS-WEB-0010-A4` asks that *"the section ids, order, headings, CTAs and
navigation are identical across stage-0, stage-1, stage-2 and stage-3
requests"*. The entry trait **is** stage 2, and `D3a` reorders block 2a by it,
with `D7` explicitly permitting exactly that. Read literally the two cannot
both hold: under any reordering the DOM order differs between two stages, and
so does the heading at a given position.

**What was shipped is `D3a` and `A7`**, because they are the specific
determination and its criterion for this page, and because `D7` — A4's own
determination — grants the exception in words. A4 is read as binding the
**set** of sections, their headings, their CTAs and the order of every section
*outside* a trait-ordered block. `TS-WEB-0019-A7` asserts both halves on one
page: the three scenes reorder, every other section keeps its place, the CTAs
and the opener are identical between the two loads, and the module stays with
the `whatsapp` scene. **No spec line was amended** — amending A4 is the spec
owner's — and the reading is recorded as `state/open.md` row 273.

Two smaller readings, both taken rather than left open:

- **The scene ids travel with their scenes.** `#scene-1` is the `whatsapp`
  scene in every order, so for `professional` the DOM order of ids is
  `scene-2 · scene-3 · scene-1`. `TS-WEB-0019-A9` settles this in words: the
  provenance scene is *"recognised by its mechanism and by D3's `violet-500`
  ground rather than by a position, because D3a moves it"*.
- **The landing route and its focus job are the page's, not the request's.**
  `resolveEntryTrait()` is called with `routeId: "home"` and
  `focusJob: "know-what-is-on"` fixed in `_scenes.tsx` — `D7`: a trait may
  reorder within a page, never redefine what the page is for. That is also why
  an organic-search referrer on `/` is `direct` and not `purchase-intent`.

### 4. The fallback the brief allowed was not taken — and production reaches it anyway

The task brief permitted shipping *"direct order everywhere, A7 fixme kept"* if
the trait handover endangered the milestone. The handover itself was built and
is not a milestone risk: in `next dev` block 2a is ordered by the trait and A7
walks both loads there. `next dev` is the only configuration in which the walk
itself has been run green; what is expected of a preview and what was measured
there is set out under *Which configuration was measured* below. **In production the shipped order is
the `direct` order for every trait anyway**, and not by choice — see below.

**Under the production CSP the reorder does not reach the DOM.** The swap from
a boundary's fallback to its resolved branch is done by an inline script React
emits when the boundary completes, at request time. `DEC-0045` / `TS-WEB-0014
D7` give production a hash-only `script-src`, and
`scripts/generate-csp-hashes.mjs` can only hash what stands in the prerendered
HTML — never a request-time script (`state/open.md` row 132). So in production
the resolved run stays parked in its hidden div, `main` keeps the fallback, and
the order a visitor sees is the `direct` order **for every trait**. The server
half is not affected: the response body carries the correct resolved run, and
the moment the CSP admits that script — a preview build, or row 132's nonce
decision — the order appears with no further change here.

So the brief's fallback is, as configured today, the shipped production
behaviour, arrived at by the CSP rather than chosen. That is a `DEC-0045`
amendment to close, not a page work package's call; this record only names the
condition so nobody reads A7's green as a production claim.

**`TS-WEB-0019-A7`'s status is therefore *blocked*, not met.** The criterion
holds wherever the mechanism it tests is switched on and cannot hold where the
policy switches it off, so the test gates itself on the policy the server sends:
`e2e/pages/home.spec.ts` reads the `Content-Security-Policy` of its first
response and `test.skip`s A7 when `script-src` admits no request-time inline
script — no `'unsafe-inline'` standing alone and no `'nonce-…'` — with the skip
reason naming `state/open.md` row 132. That is the configuration `pnpm e2e` with
`CI=true` runs (`next build` + `next start`, the CI job *"E2E — Playwright
against the local production build"*), and also a plain `next start` with
`VERCEL_ENV` unset, because `pnpm build` always writes the hash asset.

The QA round of 2026-09-26 asked for the gate to rest on something that cannot
go missing, so it now asks **two** reads and parks A7 on either: the served
`script-src`, and the presence of the per-build hash asset
`/_next/static/security/csp-script-hashes.json`. The asset is the load-bearing
one — a build that ships it serves a hash-only policy for *every* request, even
if that response header never reaches the test runner — and a `'nonce-…'` in the
policy (row 132's remedy, once taken) overrules both and activates the walk
again.

Measured on this branch after merging `next-2026`:
`PORT=3251 pnpm e2e e2e/pages/home.spec.ts -g TS-WEB-0019-A7` reports
`1 skipped` against `next start` on the production build and `1 passed` against
`next dev`. **Said plainly, because a green suite must not be read as a met
criterion: CI's production-build e2e job does not exercise `TS-WEB-0019-A7` at
all.** The shipped state is the brief's fallback — the `direct` order for every
trait — with A7 parked on the policy rather than on a bare `fixme`. So the suite
reports A7 as inactive on the production build and green in `next dev`, and it
never reports it as passing where the order it asserts is not in the DOM.

### Which configuration was measured

The QA round of 2026-09-26 read this section as claiming a preview deployment,
so the four configurations are separated here:

| Configuration | A7 | How it is known |
| --- | --- | --- |
| `next dev` on port 3251 | green | walked: `PORT=3251 pnpm e2e e2e/pages/home.spec.ts` → `27 passed` |
| `pnpm build` + `next start`, `VERCEL_ENV` unset, hash asset present | skipped | walked: `-g TS-WEB-0019-A7` → `1 skipped`; `TS-WEB-0010-A4` and `-A8` pass on the same build |
| the same build with the hash asset moved aside and `VERCEL_ENV=preview` (`state/open.md` row 148's procedure) | green | walked once, with `TS-WEB-0019-A9`/`-A11` |
| a Vercel **preview deployment** | expected green, **not walked** | nothing is deployed from this work package |

The last row is an expectation with a measured basis, and the basis is not
`pnpm build`: the build does write
`/_next/static/security/csp-script-hashes.json`, but that file **does not reach
the deployed Proxy function**. `state/open.md` rows 21 and 31 measured two
delivery mechanisms failing and `src/lib/security/csp.ts` carries the reason
above its preview fallback, so on a deployed preview `hasHashes` is `false`,
`isPreview && !hasHashes` grants `'unsafe-inline'`, and no `'sha256-…'` source
stands beside it — which is exactly the policy
`boundaryCompletionReachesTheDom()` admits. Row 31 verified that policy on a
real preview deploy on 2026-09-11. In production the same code grants nothing,
hash set or not (`TS-WEB-0014 D7`), which is why the two cases differ at all.

So: a preview is expected to order block 2a by the trait for the same reason it
hydrates at all today, and no sentence here rests on a preview deployment of
this branch having been walked, because none was. It is un-`fixme`d — the mechanism is built and measured — but
the criterion is **blocked** and does not close until row 132 does.

What *is* asserted unconditionally is the half of the criterion set that holds
under either policy: `TS-WEB-0010-A4`'s structure invariance across the two
entry stages (`e2e/pages/home.spec.ts`, its own walk since the QA round) runs on
the production build too, because the set of sections, the headings, the CTAs,
the navigation and the order of every section *outside* block 2a are the same in
both loads whether or not the boundary completes.

### What the coverage gate is and is not told

`pnpm check:coverage` reads criterion ids out of **test titles** and credits the
criterion VERIFIED on the strength of the title alone, whatever level the
criterion declares (`scripts/check-coverage.ts:243-263`). Round 2 of this branch
used that: three ids went into two `proxy.test.ts` titles and `max.MISSING` in
`specs/verification/coverage-budget.json` was lowered 149 → 145. The QA round of
2026-09-26 called it what it is — the failure mode `DEC-0141` exists to prevent —
and the ids are out again:

| Criterion | Level | What the proxy test asserts | What the criterion asks |
| --- | --- | --- | --- |
| `TS-WEB-0010-A6` | integration | one response carries no `Vary` and no `Set-Cookie` | *two* requests with different `Accept-Language` and different IP countries return a **byte-identical shell** — two responses, compared |
| `TS-WEB-0010-A11` | static | the handover header holds `{ref, med}` and no IP, geo or place value | the request geo/IP headers are read in **exactly one module** of the tree and referenced in no other — a repository-wide read, which is an ESLint rule or a `scripts/check-*.ts` |
| `TS-WEB-0010-A12` | e2e | nothing | after a stage-3 visit no cookie, `localStorage` entry or server session carries a location or a trait, and the only stored key is the `D10` session flag |

So this branch closes **one** MISSING criterion, `TS-WEB-0010-A4`, and
`max.MISSING` is `148`, the number `pnpm check:coverage` prints — a gain of one
over `e619f54`'s `149`, not four. The three criteria above keep the verdict they
had before the branch: MISSING. Their instruments are real work and none of it is
this task's: A6 needs an integration test that builds two shells and diffs them,
A12 an e2e walk of storage after a stage-3 visit (stage 3 needs the geo source
`Q-0008` gates, `TS-WEB-0010-A15`), A11 a repository-wide static check —
`src/lib/live/bff.ts` is today the only module reading `x-vercel-ip-*`, so the
invariant looks true and is simply unasserted. What the shape of
`entry-handover.ts` does give A11 is recorded in §1 and nowhere claimed as its
instrument. Neither the proxy tests nor
`src/lib/personalization/entry-handover.test.ts` names any of the three ids now,
in a title or in prose, because a bare mention in a scanned test file is what
`check-coverage` counts as NAMED ONLY.

## Consequences

- `state/open.md` row 71 is half closed: stage 2 fires. Stage 1 does not —
  nothing reads `x-vercel-ip-*`, by design, because `Q-0008` is open and
  `GEO_STAGE1_SOURCE` is off in production (`TS-WEB-0010-A15`). The
  `Sec-GPC`/`DNT` read of `D6` is a proxy edit of exactly this shape and is
  still unwritten.
- `state/open.md` row 273 is new: the `A4` ↔ `D3a` reading above.
- `PRESS_REFERRER_HOSTS` is still the seed list of `state/open.md` row 72, and
  it now has a consumer: a `press` entry reorders block 2a. Moving the list to
  content is unchanged in shape and one degree more visible in effect.
- **The trait ordering is inert in production until row 132 is decided.** §4
  above: the hash-only `script-src` refuses React's boundary-completion script,
  so production ships the fallback (`direct`) order for every trait while the
  server sends the right one. Measured on a local `next build` + `next start`
  with the hash asset present: `main [data-block="scene"]` is
  `whatsapp · embed · provenance` for a `linkedin.com` referrer, with the CSP
  violation and `React error #412` row 132 describes, while
  `curl -H 'Referer: https://www.linkedin.com/'` shows the resolved run
  (`scene-2 · scene-3 · scene-1`) in the parked branch. Every e2e assertion of
  A7 is therefore scoped to `next dev` or to a build whose policy admits a
  request-time script. Two such runs exist and neither is a preview
  **deployment**: `next dev`, and the same production build with the hash asset
  moved aside and `VERCEL_ENV=preview` — `state/open.md` row 148's procedure —
  where A7, A9 and A11 are green, the `linkedin.com` load reorders to
  `scene-2 · scene-3 · scene-1`, and the document holds three scenes and one
  module with no console error. A deployed preview is *expected* to behave like
  the second of those, because the hash asset never reaches the deployed Proxy
  function (`state/open.md` rows 21/31, and `csp.ts`'s preview fallback above
  `isPreview && !hasHashes`), but no preview deployment was walked from here —
  §4's table says which row is measured and which is inferred. This is the first
  feature whose **content**, not only its interactivity, depends on row 132.
- **The `press` order seats two `lime` grounds together.** The grounds travel
  with their scenes (DEC-0129 §11), so `press` — `provenance · whatsapp ·
  embed` — puts the `lime-100` embed scene directly above the `lime-100` proof
  stream. `checkRhythm` permits two of one family in a row and forbids three,
  so the rhythm holds in all three D3a orders; `app/[lang]/page-rhythm.test.ts`
  now walks the two reordered runs in S1/S2 and S3 as well. The seam was looked
  at rather than only reasoned about: a `nordkurier.de` referrer on a local
  production build with the preview CSP, at 390 × 844, renders
  `provenance (violet-500) · whatsapp (paper) · embed (lime-100)` followed by the
  `lime-100` proof stream — one module in `main`, five proof elements, no console
  error — and the section change reads through the eyebrow, the heading and the
  paper cards rather than through the ground. The softened seam is the accepted
  cost of D3a's order; giving the proof stream a different ground would be a
  DEC-0129 §11 amendment.
- The boundary renders block 2a twice on the wire — once as the fallback, once
  as the resolved branch. That is the cost every boundary on this page already
  pays (`DEC-0078`), and it buys the prerendered shell. **The two copies carry
  the same ids**, so the shipped document holds six `[data-block="scene"]`
  elements, two `#scene-1`/`#scene-2`/`#scene-3` each and two
  `[data-explain-module]` — for as long as the parked branch stands, which under
  §4's production CSP is forever. The parked copy sits in a `hidden` container
  and is out of the accessibility tree, but a document-wide id or attribute read
  now matches twice: that is why A9's `#scene-3` read and the four
  `[data-explain-module]` reads on `/` are scoped to `main`
  (`e2e/pages/home.spec.ts`). **The cost, measured** on this branch's
  `pnpm build` + `next start` on port 3251 with `VERCEL_ENV` unset and the hash
  asset present, `curl -H 'Referer: https://www.linkedin.com/' /`: 140 810 bytes,
  6 `[data-block="scene"]`, 2 `[data-explain-module]`, and `id` values appearing
  twice are `place-dates`, `live-counters` (both pre-existing) and `scene-1`,
  `scene-2`, `scene-3` (this branch's, in the parked copy after `</main>`). The
  QA round of 2026-09-26 measured the same page built from `next-2026`'s
  `app/[lang]/page.tsx` at 124 096 bytes with 3 scenes, so this branch adds
  roughly **+16.5 KB to every production response** and three newly duplicated
  ids for a mechanism that, under §4's CSP, changes nothing a visitor sees. That
  is the price row 132's nonce decision removes, and it is the strongest argument
  for taking that decision rather than leaving it open. Dropping the ids instead was not taken: they are
  what `A7` compares between its two loads (the same id **set** in a different
  order — "no block added, removed or rewritten") and what `A9` walks the DOM
  order with, so removing them would remove the evidence for the very criteria
  this task closes. Scoping the reads to `main` is the smaller change and is
  also the honest one — `main` is what a visitor has.
- No cookie, no storage, no session, no geo value in any payload. The trait is
  derived per request and forgotten with it (`TS-WEB-0010 D3`,
  `TS-WEB-0010-A12`).

## Alternatives considered

| Option | Why not |
| --- | --- |
| Read `headers()` in the page body, outside a boundary | makes `/` a per-request function — `TS-WEB-0010 D8` and `DEC-0045` forbid it, and the whole static shell goes with it |
| Forward the whole `Referer` value | the path is the visitor's reading history at somebody else's site, and `D3` needs none of it |
| Resolve the trait in the proxy and forward the trait id | it would put the D3 table in two places — the proxy and the resolver — and `D3` names "one shared constant" for exactly that reason. The proxy forwards inputs; the resolver stays the only classifier |
| Order block 2a on the client after hydration | a reorder that happens after paint is layout shift, and `FUN-WEB-0198`/`DEC-0033` forbid it; it would also not reach a JS-less visitor |
| A cookie carrying the trait | `TS-WEB-0010 D3` forbids persistence outright, and `A6` forbids the `Vary`/`Set-Cookie` it would need |
