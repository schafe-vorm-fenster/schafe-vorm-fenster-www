---
artefact: tactical-spec
id: TS-008
profile: system
status: DRAFT
implements: [WEB-F-040, WEB-F-041, WEB-F-043, WEB-F-044, WEB-F-045, WEB-F-046, WEB-F-049]
sources: [SRC-001, SRC-002, SRC-003, SRC-011]
decisions: [DEC-013, DEC-019, DEC-021, DEC-024, DEC-025, DEC-029, DEC-030, DEC-034, DEC-035, DEC-037]
---

# TS-008 — Live Modules and Place Search

## Purpose

What the live modules show, where each figure comes from, and how the
place search behaves across all of Germany — including the two cases the
website earns its conversions from: a covered place with no dates, and a
place that is not covered at all.

Scope boundary: *which* elements a widened module selects and in which
order is the relevance engine (TS-005 D1/D6/D8, WEB-F-042). This spec
fixes the module inventory, the data sources, the resolution procedure
that produces the candidate set, the failure behaviour, and the handover
into the app. The BFF routes are inventoried in TS-004 D5; cache
lifetimes in TS-003 D5; skeletons and streaming in WEB-F-106 / DEC-033.

## Determinations

### D1 — Module inventory and page assignment [FIXED: SRC-002 §Live Content, SRC-003 page briefs]

Four positions, radii per SRC-002 §Live Content; page assignment per the
page briefs in SRC-003 (do not re-read them from this file — they are the
source).

| Pos | Module | Radius | Shows | Carried by |
| --- | --- | --- | --- | --- |
| 1 | dates in the place | place (community) | the next 3 dates of the searched/known place | `/`, `/dein-ort` |
| 1′ | embed demo (replaces 1) | place | the real Portalize widget, filtered to the searched place (D6) | `/dein-kalender`, `/deine-region` (focus job "run our own calendar") |
| 2 | this week nearby | ~15 km | 5 dates, each with its place name | `/`, `/dein-ort`, empty state (D4) |
| 3 | active places in the county | county | a small set of active example places — **never a place list** (DEC-034) | `/deine-region`, `/dein-ort/starten` (nearest active place) |
| 4 | live counters | all regions | places · dates · updates today, subject to D8 | `/`, `/deine-region`, `/ueber-uns` |

The place search (D7) is a live module in the sense of WEB-F-040 and
appears on every page that offers an entry into a place: `/`,
`/dein-ort`, `/dein-ort/starten`, `/dein-kalender/bestellen` (scope
step), and 404 (WEB-F-026).

Rules that hold for every position:

- A module renders a skeleton and streams (WEB-F-106); the shell never
  waits (WEB-F-100).
- A module states its radius in its own heading ("in <place>",
  "in der Umgebung", "im Kreis <county>"). A widened module never
  presents itself as the narrower one.
- Place-bound output comes only from covered places (WEB-F-024, TS-005
  D5). The searched place appears in copy even when uncovered; it never
  appears as data.

### D2 — Data sources per module [FIXED: SRC-011; upstream shapes verified 2026-09-10]

Every module reaches its upstream through the BFF route of TS-004 D5 —
no component fetches an ecosystem host directly (DEC-025, WEB-Q-037).
Responses are validated against Zod schemas derived from the pinned
`openapi.json` (DEC-021).

| Module | BFF route (TS-004 D5) | Upstream operation | Key parameters |
| --- | --- | --- | --- |
| 1 | `GET /api/places/{slug}/events?window=` | events-api `POST /api/{token}/events/search` | `communities: [geonameId]`, `after`/`before` |
| 2 | `GET /api/nearby?lat=&lng=&radius=` | geo-api `GET|POST /api/{token}/community/search` (geoPoint) → events-api events search | geoPoint; then `communities: [ids]`, `after`/`before` |
| 3 | `GET /api/region/{county}/examples` | events-api events search by `counties`, ranked by activity | `counties: [geonameId]` |
| 4 | `GET /api/stats` | events-api `GET /api/stats` (tokenless, cache-controlled) | none |
| place search | `GET /api/places/search?q=&zip=` | geo-api `community/search` (zips today; name search via Q-025) | `countryCode=DE`, `zips` |
| handover | — (link built server-side) | geo-api `GET /api/{token}/community/slug/{slug}` | `slug` |

Verified in the service repositories on 2026-09-10, because three of
these shapes constrain what the modules can promise:

1. **events-api events search takes administrative id lists, not a
   radius**: `communities`, `municipalities`, `counties`, `states`, plus
   `after`/`before` (ISO-8601 or relative, e.g. `now`, `today`). The
   widening chain is therefore expressed as *which id list is sent*
   (D3), never as a distance parameter.
2. **geo-api proximity search has no caller-supplied radius**: a
   `geoPoint` search runs against a server-side constant
   (`PROXIMITY_SEARCH_RADIUS_KM = 20`) and returns at most
   `maxResults` (default 10 for geo searches). "~15 km" is not
   expressible upstream — see D3 and Open points.
3. **geo-api results carry `geo` (position), `slug`, `geonameId` and the
   full hierarchy**, so distance filtering and slug-based handover (D9)
   are possible on our side without a second call.

`findbyaddress` is **forbidden** (DEC-024): it triggers a paid, slow
external Google lookup. Enforced statically (A1).

### D3 — Widening chain as a resolution procedure [FIXED: SRC-002 §Live Content; ~15 km realisation PROPOSED]

The chain resolves an anchor (a community geoname id, or coordinates
from IP geolocation) into the candidate set of each position. Selection
and ordering inside the set are TS-005.

| Step | Radius | Resolution | Stop condition |
| --- | --- | --- | --- |
| 1 | place | events search with `communities: [anchor]` | ≥ 1 date in the window → position 1 filled |
| 2 | ~15 km | geo-api geoPoint search from the anchor's `geo` → filter results to ≤ 15 km by haversine over their `geo` → events search with those `communities` | ≥ 1 date → position 2 filled |
| 3 | county | events search with `counties: [anchor.hierarchy.county]` | active example places found → position 3 filled |
| 4 | all regions | `/api/stats` | D8 |

Rules:

- **The chain never skips silently.** Each step that fires is labelled
  with its radius (D1). A module widened to step 2 says so.
- **Step 2 is an approximation, and the approximation is ours.** Upstream
  returns communities within a fixed 20 km and caps the result count
  (D2.2); the 15 km cut is applied by the BFF on the returned `geo`
  positions. If the cap truncates before 15 km is reached, the module
  shows what it has and does not claim completeness. A caller-supplied
  radius is a demand to geo-api (Open points).
- **Anchor precision decides how far the chain gets.** Stage-0 visitors
  (no geo) have no anchor: positions 1–3 do not render, the place search
  and position 4 do (TS-005 D8, WEB-F-052). IP geolocation resolves to
  county, so it starts the chain at step 3 until a place is searched.
- **The window** for positions 1 and 2: position 1 asks
  `after=now`, position 2 `after=now&before=7d`, in `Europe/Berlin`.
  "Today" is the local calendar day, not a rolling 24 h. [PROPOSED]

### D4 — Empty state as the conversion moment [FIXED: SRC-002 §Live Content, SRC-003 §your-place, WEB-F-044]

Trigger: the anchor is a **covered** place (geo-api resolved it) and step
1 returns zero dates in its window. This is the only runtime focus-job
change on the website.

| Changes | Stays |
| --- | --- |
| focus job → "publish our dates" | route, URL, canonical, `hreflang` |
| primary conversion → `register-as-publisher` | header, footer, context band |
| headline/CTA name the place ("nothing entered in <place> yet") | the page's identity in analytics beyond one flag |
| chain starts at step 2 (D3) | position 4 |

Constraints:

- The empty result is **not** an error and carries no error styling, no
  warning icon, no retry affordance (WEB-F-045). Visually it is a normal
  module with a different offer.
- The place name is echoed from the resolved geo-api community's `name`,
  never from raw user input (no unescaped reflection of the query).
- Distinct from the uncovered place (D7): there the place is not in the
  system at all and the visitor goes to `/dein-ort/starten`. The two
  states never share copy.
- Position 1 is not left blank: its slot carries the publish offer.

### D5 — Emptiness, staleness and failure are three different things [FIXED: DEC-019, WEB-F-045, WEB-F-101–104]

| Condition | Behaviour | Tier |
| --- | --- | --- |
| upstream 200, zero results | conversion state per D4 (positions 1–2) / module omitted (position 3) | 1 |
| upstream 200, results | render, no freshness label | 1 |
| upstream error or timeout, cache warm | last cached answer + "Stand: <time>" | 2 |
| upstream error, cache cold | build-time snapshot, labelled as an example | 3 |
| position 4 (counters), cache cold | **hide the module** — never tier 3 | — |

Timeout budget per BFF call: 800 ms to first byte, 2 s total; on expiry
the route answers from tier 2/3 rather than holding the stream open.
[PROPOSED] A module never renders a spinner and never renders an error
sentence to the visitor; failures are logged server-side.

### D6 — Embed demo [FIXED: DEC-030, WEB-F-043]

On pages whose focus job is "run our own calendar", position 1′ replaces
position 1 with the **real product**: the Portalize loader
`<script src="https://<portalize-host>/api/{organizerId}/load.js">`,
web-component mode (the default; iframe mode exists and is not used).

| Aspect | Determination |
| --- | --- |
| Proxying | none — the loader talks to its own backend, its host is CSP-allowlisted (TS-003 D4, WEB-Q-030). It is not a BFF route. |
| Place filter | the loader parameter that filters to the searched place is a demand (Q-026). Until it exists, the demo renders the reference organizer unfiltered and is labelled as an example, never as "your place". |
| Cookies | the embed must set no cookie and introduce no consent duty; verification is part of Q-026 and blocks shipping the module (A12). |
| Loading | lazy, when the container approaches the viewport (TS-003 D4); the demo is never on the LCP path. |
| Failure | the loader failing to load leaves the section's static copy and the CTA — the page never shows an empty frame. |
| Not a third-party embed exception | DEC-013 bans third-party embeds; this is our own product, which is why it is decided separately (DEC-030). |

### D7 — Place search [FIXED: DEC-024, WEB-F-046, WEB-F-023/DEC-037]

One component, one BFF route, the same behaviour everywhere it appears
(D1). It covers **all of Germany**, not only covered places.

| Input | Status | Upstream |
| --- | --- | --- |
| ZIP (5 digits) | works today | geo-api `community/search?countryCode=DE&zips=` |
| place / municipality name | **blocked on Q-025** (Typesense-backed endpoint) | geo-api, new operation |
| coordinates (browser geolocation, opt-in) | works today | geo-api geoPoint search |
| address | **forbidden** — `findbyaddress` (DEC-024) | — |

Until Q-025 lands, the search field accepts ZIP input and says so in its
placeholder; it does not silently return nothing for a typed name.
[PROPOSED]

Result classification — three outcomes, three destinations:

| Outcome | Meaning | Destination |
| --- | --- | --- |
| covered, has dates | geo-api resolves it, events exist | stay / go to `/dein-ort?ort=<slug>`, chain from step 1 |
| covered, no dates | geo-api resolves it, events empty | `/dein-ort?ort=<slug>` in the empty state (D4) |
| not covered | geo-api returns no community | `/dein-ort/starten?ort=<slug-or-query>` (WEB-F-047) |

Mechanics:

- The place travels as the query parameter `?ort=` — **never as a path
  segment** (WEB-F-023, DEC-037). The parameter carries the geo-api
  `slug`; for an uncovered place it carries the raw query, escaped.
- Submitting is a plain navigation; the search works without JavaScript
  (progressive enhancement), typeahead is an enhancement on top.
- Query-parameterised place pages are **indexable with a parameter-free
  canonical** (DEC-057, TS-011 D9); an earlier `noindex,follow` proposal
  here is withdrawn because the canonical already prevents a place URL
  from ranking. SEO landing
  pages are a separate surface (WEB-F-074, TS-004 D7). [PROPOSED]
- Input is never echoed unescaped (see D4).

### D8 — Live counters [FIXED: WEB-F-041, WEB-F-104; figure set constrained by Q-015]

"Counted live or not shown." No static traction figure exists anywhere
on the website — not in copy, not as a fallback, not in an image.

Verified against `events-api/src/app/api/stats` on 2026-09-10:
`/api/stats` returns `totalEvents`, `earliestEventDate`,
`latestEventDate` and data-quality counters (unknown category, unknown
scope, with image, with document). It is tokenless and cache-controlled.

| Figure (SRC-002 position 4) | Backed today | Rule |
| --- | --- | --- |
| dates | yes — `totalEvents` | render |
| places | **no field** | not rendered until Q-015 delivers one; no substitute, no estimate |
| updates today | **no field** | same |

So the counter module ships with the figures it can count and grows when
the demand lands — a partially filled module is correct, an invented
number is a defect. Serving tier 2 with a timestamp is permitted; tier 3
is not (WEB-F-104, D5).

County-level counters on `/deine-region` ("{n} places in county X are
already in", DEC-034) need the same missing places-per-scope signal and
follow the same rule.

### D9 — Handover into the app [FIXED: DEC-029, DEC-035]

Links from the website into the app are built from the geo-api community
**slug** — the only current contract (DEC-029).

| Step | Determination |
| --- | --- |
| Resolve | the searched place resolves to a community via `community/search`; `slug` and `geonameId` come from that response. `community/slug/{slug}` validates a slug that arrives from outside (a link, a QR code). |
| Build | calendar URL = `{APP_HOST}/{slug}`. `APP_HOST` is an environment value: the apex today, `app.schafe-vorm-fenster.de` after the calendars move (DEC-035). One place in the code knows this. |
| Mark | outbound app links are external links, not route-facade links (TS-001 D5 covers website routes only). Campaign parameters present on the inbound request are preserved (WEB-F-048, TS-004 D3 rule 6). |
| Registration prefill | **no contract exists** (DEC-029). `/mitmachen/registrieren` receives `?ort=<slug>` on our own route and prefills its own place step; nothing is appended to the app URL until the app defines it. |
| Never | a slug is never guessed, never string-built from user input, never used before geo-api confirmed it. An unresolvable slug leads to `/dein-ort/starten`, not to a broken app link. |

### D10 — Client contract for live modules [FIXED: DEC-025, WEB-Q-037/038, DEC-021]

| Rule | Consequence |
| --- | --- |
| Only BFF routes are client-reachable | no ecosystem host, token or `Sheep-Token` header ever reaches the browser (TS-004 A6) |
| Tokens are environment values read server-side | one client module per service under `src/clients/{service}-api/`, mirroring TS-005 D9 |
| Responses are validated | Zod schemas derived from the pinned `openapi.json`; a validation failure is treated as an upstream error (D5), never rendered |
| Cache keys carry no visitor identity | keys are `{slug|county|window}` and, for segmented modules, `{community, trait, job}` (TS-005 D8); no IP, no session |
| Rate limit + origin check | per TS-004 D5 / WEB-Q-038 |

## Free for the generator

- [FREE] Visual design of module skeletons and of the empty-state block,
  within WEB-F-106 and TS-002.
- [FREE] Typeahead mechanics of the place search (debounce, keyboard
  handling), provided D7's no-JS path and the combobox pattern of TS-002
  hold.
- [FREE] Internal file layout of the BFF handlers and the service
  clients, provided D2 and D10 hold.
- [FREE] Copy of the empty state and the counter labels — content phase,
  placeholders until then.

## Acceptance criteria

| ID | Level | Check |
| --- | --- | --- |
| TS-008-A1 | static | No source file references `findbyaddress`; no ecosystem host or read token appears outside `src/clients/*`; no client component imports a service client. |
| TS-008-A2 | unit | Chain resolution per D3: place with dates stops at step 1; place without dates starts at step 2; county anchor starts at step 3; stage-0 anchor renders only search + counters. |
| TS-008-A3 | unit | Step 2 distance filter: given a geo-api fixture spanning 0–20 km, only communities ≤ 15 km enter the events query; a truncated result set never claims completeness. |
| TS-008-A4 | integration | `GET /api/places/{slug}/events` with an empty upstream result answers 200 with an empty list; the module renders the conversion state, no error markup, no retry control. |
| TS-008-A5 | integration | Upstream 500 with warm cache → tier 2 plus "Stand: …"; cold cache → tier 3 snapshot; counters cold → module absent from the DOM (D5). |
| TS-008-A6 | e2e | `/dein-ort?ort=<covered place with no dates>`: focus job and primary CTA switch to publishing, the place name appears escaped in the copy, URL and canonical are unchanged, position 2 renders labelled as surroundings. |
| TS-008-A7 | e2e | Searching an uncovered place lands on `/dein-ort/starten?ort=…`; the live example on that page is a covered place with dates; no website path contains a place slug. |
| TS-008-A8 | e2e | On `/dein-kalender` the Portalize loader is requested from the allowlisted host, position 1 is absent, and the page sets no cookie from the embed; blocking the loader leaves the section's copy and CTA intact. |
| TS-008-A9 | integration | Counters render only figures present in the `/api/stats` response; a stub omitting a field omits that figure and never substitutes a number. |
| TS-008-A10 | static | No numeric traction figure (places, dates, updates) exists in content sources, snapshots or fallback fixtures (WEB-F-041). |
| TS-008-A11 | unit | Handover URL is `{APP_HOST}/{slug}` with the slug taken from a geo-api response; an unresolved slug yields the founding route, never an app link; inbound `etcc_*` parameters survive. |
| TS-008-A12 | manual | Q-026 verification: the Portalize embed sets no cookie and introduces no consent duty, and the place-filter parameter behaves as documented — recorded before the module ships. |
| TS-008-A13 | tool | Build fetches each service's `openapi.json`, compares it with the pinned copy, and fails on drift affecting the operations in D2 (DEC-021). |
| TS-008-A14 | integration | Place search: a ZIP from an uncovered region returns a classified "not covered" result, never an empty answer; a typed name while Q-025 is open produces the documented ZIP hint, not a silent empty state. |

## Coverage

| Requirement | Discharged by |
| --- | --- |
| WEB-F-040 (live data wherever it proves something) | D1, D2, D7, D8 · A2, A4, A9, A14 |
| WEB-F-041 (counted live or not shown) | D8, D5 counters row · A9, A10 |
| WEB-F-043 (embed demo via Portalize loader) | D6 · A8, A12 |
| WEB-F-044 (empty state shifts the focus job) | D4, D3 step 2 · A6 |
| WEB-F-045 (empty is a conversion occasion, not an error) | D4, D5 · A4, A5, A6 |
| WEB-F-046 (Germany-wide place search, no findbyaddress) | D7, D2 · A1, A7, A14 |
| WEB-F-049 (handover by geo-api community slug) | D9, D2 handover row · A11 |

Adjacent, discharged elsewhere and only consumed here: WEB-F-042
(widening) TS-005 D1/D8 · WEB-F-047 (founding route) TS-004 D1 ·
WEB-F-048 (QR forwarding) TS-004 D3 · WEB-F-100–106 (resilience,
skeletons) TS-003 D5 · WEB-Q-037/038 (BFF) TS-004 D5.

## Open points

- **Q-025 (geo-api, name search).** Until it lands, WEB-F-046 is only
  half met: Germany-wide *coverage* holds via ZIP, Germany-wide *finding
  by name* does not. D7's ZIP-only placeholder is an interim, not the
  target.
- **Q-026 (Portalize).** Two answers needed before D6 ships: the
  place-filter parameter of the loader, and written confirmation of
  cookie freedom. Without the filter the demo is generic, which weakens
  the strongest moment of `/dein-kalender`.
- **Q-015 residue, now measured.** `/api/stats` covers *dates* only. Two
  demands to events-api: a **places** count (distinct communities with at
  least one event) and an **updates today** count (events created or
  changed in the local day) — and, for DEC-034, a per-county variant of
  the places count plus the events-per-place activity signal that
  `/api/region/{county}/examples` needs. That route currently has **no
  upstream operation** behind its ranking.
- **New demand to geo-api: a caller-supplied proximity radius and result
  count.** `community/search` by `geoPoint` runs against a fixed 20 km
  constant and returns 10 results by default; "~15 km" (SRC-002) is
  therefore approximated on our side (D3). Question for geo-api: can
  `radiusKm` and `maxResults` be exposed for proximity searches, and can
  the response carry the computed distance?
- **Window semantics (D3, [PROPOSED]).** "Today" and "this week" are
  fixed to `Europe/Berlin` calendar days here; confirm against how the
  app's calendars cut their days, so website and app do not disagree on
  what "today" contains.
- **`APP_HOST` switch (D9).** The handover host changes when the
  calendars move to `app.*` (DEC-035). Open: who flips the environment
  value, and whether both hosts must work during the transition.
- **Timeout budget (D5)** is set, not measured. The `?ort=` indexing rule
  is settled by DEC-057. (D7
  are [PROPOSED]** — they need TS-003 and the SEO area to confirm rather
  than this spec to assert.
