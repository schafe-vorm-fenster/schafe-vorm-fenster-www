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
owner's — and the reading is recorded as `state/open.md` row 266.

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
the trait handover endangered the milestone. It was not taken: A7 is un-fixmed
and walks both loads, and `next dev` and every preview build order block 2a by
the trait.

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

## Consequences

- `state/open.md` row 71 is half closed: stage 2 fires. Stage 1 does not —
  nothing reads `x-vercel-ip-*`, by design, because `Q-0008` is open and
  `GEO_STAGE1_SOURCE` is off in production (`TS-WEB-0010-A15`). The
  `Sec-GPC`/`DNT` read of `D6` is a proxy edit of exactly this shape and is
  still unwritten.
- `state/open.md` row 266 is new: the `A4` ↔ `D3a` reading above.
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
  A7 is therefore scoped to `next dev` or to a **preview**-CSP build: on the
  same production build with the hash asset moved aside and `VERCEL_ENV=preview`
  — `state/open.md` row 148's procedure — A7, A9 and A11 are green, the
  `linkedin.com` load reorders to `scene-2 · scene-3 · scene-1`, and the
  document holds three scenes and one module with no console error. This is the
  first feature whose **content**, not only its interactivity, depends on that
  row.
- **The `press` order seats two `lime` grounds together.** The grounds travel
  with their scenes (DEC-0129 §11), so `press` — `provenance · whatsapp ·
  embed` — puts the `lime-100` embed scene directly above the `lime-100` proof
  stream. `checkRhythm` permits two of one family in a row and forbids three,
  so the rhythm holds in all three D3a orders; `app/[lang]/page-rhythm.test.ts`
  now walks the two reordered runs in S1/S2 and S3 as well. The softened seam
  between those two sections is the accepted cost of D3a's order; giving the
  proof stream a different ground would be a DEC-0129 §11 amendment.
- The boundary renders block 2a twice on the wire — once as the fallback, once
  as the resolved branch. That is the cost every boundary on this page already
  pays (`DEC-0078`), and it buys the prerendered shell.
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
