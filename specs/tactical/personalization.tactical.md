---
artefact: tactical-spec
id: TS-010
profile: system
status: DRAFT
implements: [WEB-F-050, WEB-F-051, WEB-F-053, WEB-F-054, WEB-F-056, WEB-F-069]
sources: [SRC-001, SRC-002, SRC-006, SRC-007]
decisions: [DEC-004, DEC-019, DEC-038, DEC-041]
---

# TS-010 — Personalization Stages

## Purpose

How the website learns about a visitor without ever asking her, and what
it is allowed to do with what it learns. This spec owns the **resolver**:
the step that turns a request into the props the relevance engine
consumes (`{community, trait, job}`, TS-005 D8) and into the regional
content key. It does not own scoring, ordering or caching — that is
TS-005 — and it does not own the empty-place-calendar case — that is
TS-008 (WEB-F-044).

The stage table is normative in
`go-to-market-os/concept/website-communication-principles.concept.md`
§6 "Assumptions, not switches"; the entry contexts are the context
matrix in `go-to-market-os/concept/website-relevance-model.concept.md`
§"Context Matrix". This spec realises them, it does not restate them.

## Determinations

### D1 — Stage is a resolver output, not a mode [FIXED: SRC-001 §6, WEB-F-050]

There is **no `stage` variable in the render path**. Nothing branches on
"stage 2". The resolver fills a single flat object; a field is either
known or `null`, and stages 0–3 of SRC-001 §6 are the names for how much
of it happened to be filled. The stage label exists for observability
(D11) and for this document, nowhere else.

| Resolver field | Stage that fills it | Consumed by | Absent value |
| --- | --- | --- | --- |
| `country`, `state`, `county` | 1 (IP) | TS-005 D1 tiers 2–4, D9 regional key | `null` |
| `municipality` | 1 only when trustworthy (D4), else 3 | TS-005 D1 tier 1 | `null` |
| `community` | 3 (place search / place query param) | TS-005 D1 tier 0, D8 cache key | `null` |
| `trait` | 2 (D3) | TS-005 D2, D8 cache key | `direct` |
| `job` | derived from route; `trait` may only reorder within it (D7) | TS-005 D5 weight profile | route default |

The object is resolved **outside** any `use cache` boundary and passed
as props (TS-005 D8), because it reads `headers()` and
`searchParams`. It is never read from inside a cached component.

Consequence for WEB-F-050: because there is no mode, there is nothing to
switch, and no surface can offer the visitor a classification control —
no role chooser, no "who are you?" interstitial, no region picker
dressed as personalization. The place search (WEB-F-046) is not such a
control: it answers the visitor's own question and only incidentally
raises the stage.

### D2 — Resolution pipeline and precedence [FIXED: DEC-070]

One pass per request, cheapest first, stated intent always winning over
inferred intent:

| # | Step | Source | Fills | On failure |
| --- | --- | --- | --- | --- |
| 1 | route + language | URL (TS-004 D1, TS-001 D3) | `job`, language | — (never fails) |
| 2 | entry context | query params + `Referer` (D3) | `trait` | `trait = direct` |
| 3 | IP geolocation | request geo headers → geo-api (D4) | `country`…`county`, sometimes `municipality` | leave `null`, continue |
| 4 | stated place | `?ort=<slug>` (WEB-F-023) → geo-api community lookup | `community` + its whole hierarchy | leave `null`, continue |
| 5 | browser geolocation | only after an interaction (D5), client-side | produces a `?ort=` navigation, then step 4 | silent, no retry |

Rules:

- **Later steps overwrite earlier ones.** A stated place replaces an
  IP-derived county in full; the two are never merged field by field.
- **No step blocks the response.** Step 3 has a hard budget (D4); on
  timeout the request renders stage 0 and the segment variant may still
  arrive by streaming (D8).
- **No step is retried and no step has a fallback chain of its own.**
  Resilience for the data behind them is DEC-019 / TS-003 D5.

### D3 — Entry-context traits (stage 2) [FIXED: SRC-002 context matrix; vocabulary PROPOSED]

The context matrix in SRC-002 names the entries, the assumption, the
starting proof type and the first time window. This spec fixes only how
a request is mapped onto one of its rows, and that the resulting
identifier is **one shared constant** — the resolver emits it, TS-005 D2
scores against it, TS-005 D8 uses it as a cache-key axis. Two
vocabularies would silently produce two segmentations.

| Trait id | Recognised by | Matrix row |
| --- | --- | --- |
| `social` | referrer host of Instagram / Facebook / WhatsApp; `etcc_med`/`utm_medium` = social | Instagram, Facebook, WhatsApp link |
| `professional` | referrer host LinkedIn | LinkedIn |
| `purchase-intent` | organic search referrer + a landing route whose focus job is "run our own calendar" | Google search "event calendar municipality website" |
| `reader-search` | organic search referrer + landing on `/dein-ort` | Google search "what is on in <place>" |
| `print-qr` | campaign parameter of the print family (`etcc_med=print`) | Print QR |
| `press` | referrer host in the press/podcast allowlist (built from `media-echo`) | Press article or podcast link |
| `activated` | `etcc_med=newsletter`, or referrer host `app.schafe-vorm-fenster.de` | Newsletter, app redirect |
| `direct` | everything else, including an unrecognised referrer and an empty one | Direct visit, unknown |

- Campaign parameters follow the existing `etcc_*` convention
  (WEB-Q-028); `utm_*` is accepted as an alias where it is unambiguous.
- The trait is derived per request and **never persisted** — no cookie,
  no storage, no server-side session (WEB-Q-020). A visitor who returns
  from a different entry is a different segment, by design.
- The referrer host lists are content, not code (allowlists shipped with
  the content build), so a new press outlet does not need a deployment
  of the resolver.
- `direct` is not a degraded case: it is the row SRC-002 calls the
  default case, and it is what stage 0 renders (D8).

### D4 — Geo resolution and its granularity ceiling [FIXED: WEB-F-053; source PROPOSED]

| Level | Status | How it is reached |
| --- | --- | --- |
| country, state | required, cheap | request geo headers of the platform |
| county | **required** (WEB-F-053) | coordinates/region from the request headers resolved against geo-api's hierarchy |
| municipality | desirable, only when the resolution is unambiguous | same lookup, accepted only when it returns exactly one municipality |
| community | never from IP | only from a place search or `?ort=` (D2 step 4) |
| place / address | **explicitly not pursued** — "spooky" (SRC-006) | not implemented at all |

Rules:

- The ceiling is a **hard truncation, not a preference**: even when the
  lookup returns a finer level, `community` stays `null` at stage 1. A
  visitor must never be shown that the site knows her village before she
  said it. This is what makes TS-005 D1's honest limit true — tiers 0
  and 1 fire only after a place search.
- The lookup has a **budget of 150 ms** [PROPOSED]; beyond it the fields
  stay `null` and the request is stage 0. Geo resolution is never on the
  critical path of the shell (WEB-Q-001 ff., TS-003 D1).
- Resolution results are cached by the coarse geo key, not per request
  or per IP.
- `findbyaddress` is out of bounds for this path (it performs an
  external address lookup — see Q-025). The needed capability is a
  coordinate → administrative-hierarchy resolution on geo-api; see Open
  points.

### D5 — Browser geolocation only after an interaction [FIXED: WEB-F-053]

- The permission prompt is **never** triggered on page load, never in an
  effect, never by scrolling into view.
- It is triggered by exactly one thing: the visitor activating an
  explicit "use my location" control that sits next to the place search
  and states what will happen.
- The coordinates are used **client-side only**, to run a place search
  and navigate to the resulting `?ort=<slug>`. They are never sent to
  our server as coordinates and never stored.
- A denied or unavailable permission leaves the page exactly as it was;
  no message, no second ask.

### D6 — Privacy: process, do not store [FIXED: WEB-F-054, WEB-Q-024, DEC-004; GPC row PROPOSED]

| Datum | Lifetime | Where it may appear |
| --- | --- | --- |
| the IP address itself | the request | in memory during D4 only — never logged, never in an error message or trace attribute, never sent to a third party |
| derived `country`/`state`/`county` | the request + the cache key | props of a cached component (TS-005 D8), the regional content key (D9) |
| `community` from a stated place | the request + the URL the visitor sees | `?ort=` in the URL, cache key |
| `trait` | the request | cache key |
| anything per visitor | — | **nothing.** No cookie, no `localStorage`, no server-side session, no returning-visitor recognition (WEB-Q-020) |

The derived area is a **segment key of at least county size**, shared by
many visitors — it identifies a cache entry, not a person. The single
exception in storage terms is the language suggestion's session flag
(D10), which carries no location and no identifier.

[PROPOSED] When a request carries `Sec-GPC: 1` or `DNT: 1`, D2 step 3 is
skipped and the request renders stage 0. It costs nothing (stage 0 is
complete by WEB-F-051) and it is the cheapest possible answer to part of
Q-008.

**The legal check is open (Q-008).** Until it is signed off, IP
geolocation ships behind a flag that is **off in production**; the site
then runs at stage 0/2/3, which by D8 is a complete site. No launch
depends on the flag being on.

### D7 — What a stage may change, and what it may never change [FIXED: SRC-001 §6, WEB-F-052]

May change: which proof elements and live modules are selected, and in
which order — nothing else. That selection is TS-005's.

May never change:

| Invariant | Meaning |
| --- | --- |
| page structure | the set of sections, their order, their headings and their CTAs are a pure function of route + language (TS-004 D1, TS-001 D3) |
| focus job | fixed per page by the IA; `trait` may reorder *within* the page, never redefine what the page is for |
| conversion | the page's primary conversion is the same at every stage (SRC-001 §7) |
| navigation | header and footer are identical at every stage (TS-004 D4) |
| URL and canonical | no stage produces a redirect, a different URL or a different canonical |

**The single exception on the whole website** is the empty place
calendar: a place with no dates shifts the page's focus job to "publish
our dates" (WEB-F-044). It is owned by **TS-008** and is not
re-specified here. Note that it is triggered by *data* (the place has no
events), not by a stage — a stage-3 visitor whose place is well filled
sees no shift.

### D8 — Stage 0 is what is rendered [FIXED: WEB-F-051, DEC-041 §8]

- The prerendered shell **is** the stage-0 result: place search present,
  proof stream widely spread, most recent first, all slots filled, no
  empty states, no skeleton that never resolves. A visitor who blocks
  all JavaScript, a crawler, and a visitor whose geo lookup timed out
  all see the same complete page.
- Segment variants **swap in** where they resolve, into a reserved box,
  without layout shift (WEB-F-106, DEC-033).
- No route becomes a per-request function because of personalization
  (DEC-041 §8). If a stage cannot be resolved within the shell's budget,
  the stage-0 content stands — a stage is an improvement, never a
  precondition.
- Bots and crawlers are not detected and not special-cased: they receive
  stage 0 because they arrive without an entry context, which is the
  correct answer and keeps the indexed page identical to the cached one.
- Stage-0 scoring itself (`w_geo = 0` and where its share goes) is
  TS-005 D5 / Q-002.

### D9 — Regional content variation [FIXED: WEB-F-056; mechanism PROPOSED]

Regional variation keys on **`state` and `county`** — the levels stage 1
actually delivers (D4). It is content selection, never structure (D7).

| Rule | Statement |
| --- | --- |
| key | `state`, optionally refined by `county`; never `municipality`, never `community` |
| resolution | most specific variant present wins: `county` → `state` → neutral |
| fallback | **every** regional variant set must contain a neutral variant; a set without one fails the build |
| granularity floor | no variant may address a single place — that would be the "spooky" effect at content level |
| naming | variants are named by administrative key, never by marketing region |
| scope | applies to copy variants, example places and regional proof; it never adds or removes a section |

Typical case from SRC-006: a Mecklenburg-Vorpommern entry meets MV
examples and MV wording where they exist, a Niedersachsen entry meets
the Lower Saxony set, everyone else meets the neutral set — which is
written to stand on its own, not as a leftover.

### D10 — First-visit language suggestion [FIXED: DEC-038, WEB-F-069; timing deferred by Q-011]

Not built in phase 1. Its shape is nevertheless fixed, so that whoever
builds it cannot break caching:

| Property | Binding rule |
| --- | --- |
| where it runs | client-side only; the markup is part of the static page and is hidden until the client decides |
| effect on rendering | none — it must never influence server rendering and never vary a cached response (DEC-038, TS-001 D3) |
| signal | `navigator.languages` in the browser; **not** `Accept-Language` at render time |
| frequency | once per visitor session, flagged in `sessionStorage`; dismissal is honoured for the rest of the session |
| action | it offers a **link** (TS-001 D5 facade, plain `<a>`); it never redirects and never rewrites the URL |
| target | the equivalent page in the other language, never the home page |
| accessibility | keyboard reachable and dismissible, not a focus trap, not a layout-shifting overlay (TS-002) |
| language | the suggestion is written in the language it suggests |

Open in Q-011: **when** it is built, and whether it may also suggest a
**country domain** rather than only a language. A domain suggestion
crosses an origin and therefore also crosses the `sessionStorage`
boundary — the "once" guarantee would need re-stating before it is
built.

### D11 — What is measured [PROPOSED]

Launch ships conversion measurement only (WEB-Q-028), so no stage
dimension is sent at launch. When one is added later it is bound by:
the stage label (`0`–`3`) and the `trait` id may be event properties;
`county` is the finest geo value that may ever be attached; `community`,
coordinates and IP may not. This keeps the hypotheses of SRC-002
(H1–H6) testable without turning a cookieless site into a profiling one.

## Free for the generator

- [FREE] Internal module layout of the resolver, provided D1's single
  flat object and D3's shared trait constant hold.
- [FREE] Visual form of the "use my location" control, within D5 and
  TS-002.
- [FREE] File format of the regional variant sets, provided D9's
  resolution and fallback rules hold and the build check in A9 can run.

## Acceptance criteria

| ID | Level | Check |
| --- | --- | --- |
| TS-010-A1 | unit | Resolver returns the D1 object for each of: bare request, IP-only, IP + campaign params, `?ort=` — fields absent are `null`/`direct`, and no input path throws. |
| TS-010-A2 | unit | Granularity ceiling: a geo lookup returning place-level detail yields `county` (and at most `municipality`); `community` is `null`. A stated place fills `community` and overwrites the IP-derived hierarchy completely. |
| TS-010-A3 | unit | Trait mapping: every D3 row is recognised from its referrer/parameter fixture; unknown and empty referrers map to `direct`; resolver and engine read the same trait constant. |
| TS-010-A4 | integration | Structure invariance: for one route, the section ids, order, headings, CTAs and navigation are identical across stage-0, stage-1, stage-2 and stage-3 requests; only relevance-slot contents differ. |
| TS-010-A5 | integration | Stage 0 completeness: with the geo flag off and no referrer, every page renders fully — place search present, no empty slot, no unresolved skeleton — and issues no geo lookup. |
| TS-010-A6 | integration | Cacheability: two requests for the same URL with different `Accept-Language` and different IP countries return a byte-identical shell; no `Set-Cookie` and no `Vary` on those headers. |
| TS-010-A7 | e2e | No classification control exists on any page: no role chooser, no audience switcher, no "who are you?" interstitial. |
| TS-010-A8 | e2e | Browser geolocation: no permission prompt on load or scroll; the prompt appears only after the explicit control is activated; a denial leaves the page unchanged and is not re-asked. |
| TS-010-A9 | tool | Build check: every regional variant set has a neutral variant, and no variant is keyed below county level (D9). |
| TS-010-A10 | unit | Regional selection: county variant wins over state variant wins over neutral; a missing regional variant falls back silently to neutral. |
| TS-010-A11 | static | No IP value reaches a log, trace attribute or outbound payload: the request geo/IP headers are read in exactly one module, and no other module references them. |
| TS-010-A12 | e2e | Persistence: after a visit at stage 3, no cookie, `localStorage` entry or server session carries a location or a trait; the only stored key is the D10 session flag. |
| TS-010-A13 | e2e | Language suggestion (when built): appears at most once per session, dismissal holds, navigating is a link, the served HTML is identical whether or not it applies. |
| TS-010-A14 | e2e | Focus job stability: the primary conversion of every route is identical at stage 0 and stage 3, with the empty-place-calendar case (TS-008) as the only exception. |
| TS-010-A15 | manual | Q-008 sign-off is recorded before IP geolocation is enabled in production; until then the flag is off in production and A5 passes. |

## Coverage

| Requirement | Discharged by |
| --- | --- |
| WEB-F-050 (four stages, never ask the visitor) | D1, D2, D3 · A1, A3, A7 |
| WEB-F-051 (stage 0 complete on its own) | D8, D2 no-block rule · A5, A6 |
| WEB-F-053 (invisible detection, county required, place not pursued) | D4, D5 · A2, A8 |
| WEB-F-054 (process without storing personal data) | D6 · A11, A12, A15 |
| WEB-F-056 (regional variation on state/county) | D9, D4 · A9, A10 |
| WEB-F-069 (deferred first-visit language suggestion) | D10 · A6, A13 |

Adjacent, deliberately **not** implemented here: WEB-F-052 and
WEB-F-055 are TS-005 (this spec supplies their inputs, D1/D3, and their
invariants, D7); WEB-F-044 is TS-008; WEB-F-046 (place search) and
WEB-F-023 (`?ort=`) are the place-search spec; locale determination is
TS-001 D3.

## Open points

- **Q-008 (legal, IP geolocation without storage).** Blocks D4/D6 in
  production. Until answered the flag stays off; the exposure is limited
  by design, not by promise, because D8 makes stage 0 a complete site.
- **Q-011 (first-visit suggestion).** Timing open, and whether it may
  suggest a country domain. The cross-origin consequence for the "once"
  guarantee (D10) has to be settled at the same time.
- **New, needs registering as a question: how is `county` actually
  reached?** WEB-F-053 requires county, but platform request geo headers
  offer country, region (state) and city — not county — and
  `findbyaddress` is out of bounds for this path (Q-025). Either geo-api
  gains a coordinate → administrative-hierarchy resolution (a demand to
  the geo-api team, sibling of Q-025), or county resolution at stage 1
  is not achievable and WEB-F-053 has to be relaxed to state level.
  D4's "required" row rests on this being answered.
- **Q-030 (cache cost).** D1's cache-key fields are geo × trait; the
  trait axis multiplies TS-005 D8's community axis by up to eight (D3).
  The measurement demanded by Q-030 must be run over the *product* of
  both axes, not over geo alone.
- **Q-002 (stage-0 weight split)** decides what stage 0 actually looks
  like in the proof stream; D8 asserts completeness, TS-005 D5 decides
  composition.
- [PROPOSED] and unconfirmed: D3 vocabulary, D4 source and the 150 ms
  budget, D6's GPC row, D9 mechanism, D11. Each is a proposal awaiting
  its decision point, not a gap. D2 is fixed by DEC-070.
