---
artefact: tactical-spec
id: TS-WEB-0008
kind: system
status: DRAFT
version: 0.1.0
implements: [FUN-WEB-0040, FUN-WEB-0041, FUN-WEB-0043, FUN-WEB-0044, FUN-WEB-0045, FUN-WEB-0046, FUN-WEB-0049]
sources: [SRC-0001, SRC-0002, SRC-0003, SRC-0011]
decisions: [DEC-0013, DEC-0019, DEC-0021, DEC-0024, DEC-0025, DEC-0029, DEC-0030, DEC-0034, DEC-0035, DEC-0037, DEC-0079]
---

# TS-WEB-0008 — Live Modules and Place Search

## Purpose

What the live modules show, where each figure comes from, and how the
place search behaves — it asks for a **place name** (DEC-0079) and
resolves it against the covered communities — including the two cases
the website earns its conversions from: a covered place with no dates,
and a place that is not covered at all.

Scope boundary: *which* elements a widened module selects and in which
order is the relevance engine (TS-WEB-0005 D1/D6/D8, FUN-WEB-0042). This spec
fixes the module inventory, the data sources, the resolution procedure
that produces the candidate set, the failure behaviour, and the handover
into the app. The BFF routes are inventoried in TS-WEB-0004 D5; cache
lifetimes in TS-WEB-0003 D5; skeletons and streaming in FUN-WEB-0106 / DEC-0033.

## Determinations

### D1 — Module inventory and page assignment [FIXED: SRC-0002 §Live Content, SRC-0003 page briefs]

Four positions, radii per SRC-0002 §Live Content; page assignment per the
page briefs in SRC-0003 (do not re-read them from this file — they are the
source).

| Pos | Module | Radius | Shows | Carried by |
| --- | --- | --- | --- | --- |
| 1 | dates in the place | place (community) | the next 3 dates of the searched/known place | `/`, `/dein-ort` |
| 1′ | embed demo (replaces 1) | place | the real Portalize widget, filtered to the searched place (D6) | `/dein-kalender`, `/deine-region` (focus job "run our own calendar") |
| 2 | this week nearby | ~15 km | 5 dates, each with its place name | `/`, `/dein-ort`, empty state (D4) |
| 3 | active places in the county | county | a small set of active example places — **never a place list** (DEC-0034) | `/deine-region`, `/dein-ort/starten` (nearest active place) |
| 4 | live counters | all regions | places · dates · updates today, subject to D8 | `/`, `/deine-region`, `/ueber-uns` |

The place search (D7) is a live module in the sense of FUN-WEB-0040 and
appears on every page that offers an entry into a place: `/`,
`/dein-ort`, `/dein-ort/starten`, `/dein-kalender/bestellen` (scope
step), and 404 (FUN-WEB-0026).

Rules that hold for every position:

- A module renders a skeleton and streams (FUN-WEB-0106); the shell never
  waits (FUN-WEB-0100).
- A module states its radius in its own heading ("in <place>",
  "in der Umgebung", "im Kreis <county>"). A widened module never
  presents itself as the narrower one.
- Place-bound output comes only from covered places (FUN-WEB-0024, TS-WEB-0005
  D5). The searched place appears in copy even when uncovered; it never
  appears as data.

### D2 — Data sources per module [FIXED: SRC-0011; upstream shapes verified 2026-09-10]

Every module reaches its upstream through the BFF route of TS-WEB-0004 D5 —
no component fetches an ecosystem host directly (DEC-0025, NFR-WEB-0037).
Responses are validated against Zod schemas derived from the pinned
`openapi.json` (DEC-0021).

| Module | BFF route (TS-WEB-0004 D5) | Upstream operation | Key parameters |
| --- | --- | --- | --- |
| 1 | `GET /api/places/{slug}/events?window=` | events-api `POST /api/{token}/events/search` | `communities: [geonameId]`, `after`/`before` |
| 2 | `GET /api/nearby?lat=&lng=&radius=` | geo-api `GET|POST /api/{token}/community/search` (geoPoint) → events-api events search | geoPoint; then `communities: [ids]`, `after`/`before` |
| 3 | `GET /api/region/{county}/examples` | events-api events search by `counties`, ranked by activity | `counties: [geonameId]` |
| 4 | `GET /api/stats` | events-api `GET /api/stats` (tokenless, cache-controlled) | none |
| place search | `GET /api/places/search?q=` | the committed covered-community index — `src/generated/snapshots/communities.json`, built by `scripts/build-place-index.ts` from the public calendar site, ~1,760 entries of name · slug · position · municipality. Not an ecosystem call and needs no token | `q` — the typed name |
| scope postcode (order flow only, TS-WEB-0025 D3) | `GET /api/places/search?zip=` | geo-api `community/search` (zips) | `countryCode=DE`, `zips` |
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
4. **geo-api has no name parameter, and the place search does not need
   one.** `community/search` 3.1.3 takes `countryCode`, `lat`/`lng`,
   `zips` and geoname id lists; the name lookup is therefore answered
   from the committed index, which carries the municipality name the
   suggestion row needs. Which store answers a name is **free** (D7);
   a geo-api name endpoint (Q-0025) may replace the index behind the same
   BFF route without touching this spec.

`findbyaddress` is **forbidden** (DEC-0024): it triggers a paid, slow
external Google lookup. Enforced statically (A1).

### D3 — Widening chain as a resolution procedure [FIXED: SRC-0002 §Live Content; ~15 km realisation PROPOSED]

The chain resolves an anchor (a community geoname id, or coordinates
from IP geolocation) into the candidate set of each position. Selection
and ordering inside the set are TS-WEB-0005.

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
  and position 4 do (TS-WEB-0005 D8, FUN-WEB-0052). IP geolocation resolves to
  county, so it starts the chain at step 3 until a place is searched.
- **The window** for positions 1 and 2: position 1 asks
  `after=now`, position 2 `after=now&before=7d`, in `Europe/Berlin`.
  "Today" is the local calendar day, not a rolling 24 h. [PROPOSED]

### D4 — Empty state as the conversion moment [FIXED: SRC-0002 §Live Content, SRC-0003 §your-place, FUN-WEB-0044]

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
  warning icon, no retry affordance (FUN-WEB-0045). Visually it is a normal
  module with a different offer.
- The place name is echoed from the resolved geo-api community's `name`,
  never from raw user input (no unescaped reflection of the query).
- Distinct from the uncovered place (D7): there the place is not in the
  system at all and the visitor goes to `/dein-ort/starten`. The two
  states never share copy.
- Position 1 is not left blank: its slot carries the publish offer.

### D5 — Emptiness, staleness and failure are three different things [FIXED: DEC-0019, FUN-WEB-0045, FUN-WEB-0101–104]

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

### D6 — Embed demo [FIXED: DEC-0030, FUN-WEB-0043]

On pages whose focus job is "run our own calendar", position 1′ replaces
position 1 with the **real product**: the Portalize loader
`<script src="https://<portalize-host>/api/{organizerId}/load.js">`,
web-component mode (the default; iframe mode exists and is not used).

| Aspect | Determination |
| --- | --- |
| Proxying | none — the loader talks to its own backend, its host is CSP-allowlisted (TS-WEB-0003 D4, NFR-WEB-0030). It is not a BFF route. |
| Place filter | the loader parameter that filters to the searched place is a demand (Q-0026). Until it exists, the demo renders the reference organizer unfiltered and is labelled as an example, never as "your place". |
| Cookies | the embed must set no cookie and introduce no consent duty; verification is part of Q-0026 and blocks shipping the module (A12). |
| Loading | lazy, when the container approaches the viewport (TS-WEB-0003 D4); the demo is never on the LCP path. |
| Failure | the loader failing to load leaves the section's static copy and the CTA — the page never shows an empty frame. |
| Not a third-party embed exception | DEC-0013 bans third-party embeds; this is our own product, which is why it is decided separately (DEC-0030). |

### D7 — Place search: the visitor types a name [FIXED: DEC-0079, DEC-0024, FUN-WEB-0046, FUN-WEB-0023/DEC-0037]

One component, one BFF route, the same behaviour everywhere it appears
(D1). The input is a **place name**. A postcode is not offered: not as an
input mode, not in the label, the placeholder, a helper text or page
copy, and no surface states an interim (FUN-WEB-0046). A postcode is an
administrative abstraction; a place name is what a person says when she
says where she lives, and that is the sentence this field is asking for.

| Input | Status | Resolved against |
| --- | --- | --- |
| place name | **the feature** — matched against place names **and** municipality names | the covered-community index (D2) |
| coordinates (browser geolocation, opt-in) | works today, offered as a control beside the field (FUN-WEB-0053, TS-WEB-0010 D5) | geo-api geoPoint search |
| postcode | **not offered.** Five typed digits are treated like any other query: no match, no suggestion, the submit reaches the founding route | — |
| address | **forbidden** — `findbyaddress` (DEC-0024) | — |

**Where the names come from is free** (see Free for the generator): today
the committed index of D2, tomorrow a geo-api name endpoint (Q-0025), or
both behind the one BFF route. What this determination fixes is what the
visitor is promised — a name — not which store answers her. Replacing the
store is not a change to this spec.

**Scope is the covered communities** [FIXED: DEC-0079 amendment
2026-09-24, closing Q-0071]: the index knows ~1,760 of them and nothing
else. A name it does not know is not an error (see the classification
below), and no surface of the search states that a limit exists.
Germany-wide finding by name is the target, carried by Q-0025 as an
upstream demand; it changes the store, not this determination.

Result classification — three outcomes, three destinations:

| Outcome | Meaning | Destination |
| --- | --- | --- |
| covered, has dates | a place matched, events exist | stay / go to `/dein-ort?ort=<slug>`, chain from step 1 |
| covered, no dates | a place matched, events empty | `/dein-ort?ort=<slug>` in the empty state (D4) |
| not covered | nothing matched the typed name | `/dein-ort/starten?ort=<slug-or-query>` (FUN-WEB-0047) |

Mechanics:

- The place travels as the query parameter `?ort=` — **never as a path
  segment** (FUN-WEB-0023, DEC-0037). The parameter carries the geo-api
  `slug`; for an uncovered place it carries the raw query, escaped.
- Submitting is a plain navigation; the search works without JavaScript
  (progressive enhancement), typeahead is an enhancement on top.
- Query-parameterised place pages are **indexable with a parameter-free
  canonical** (DEC-0057, TS-WEB-0011 D9); an earlier `noindex,follow` proposal
  here is withdrawn because the canonical already prevents a place URL
  from ranking. SEO landing
  pages are a separate surface (FUN-WEB-0074, TS-WEB-0004 D7). [PROPOSED]
- Input is never echoed unescaped (see D4).
- **No surface of this module names a postcode.** Where a page carries a
  helper text under the field it speaks about names ("tipp den Ortsnamen
  ein"), never about a postcode and never about a feature that is still
  to come. Asserted statically across both locales (A16).

### D7a — The suggestion overlay [FIXED: DEC-0079; mechanics below these properties stay free]

Without suggestions a name search asks a visitor to spell a village
correctly on the first attempt, which is exactly the failure that made
the postcode look attractive. The overlay is therefore part of the
feature, not a nicety, and its properties are determined.

| Property | Determination |
| --- | --- |
| Trigger | from the **second** typed character — one letter matches hundreds of villages |
| Matching | the typed string matches a **place name** or its **municipality name**; either way the suggestion is the place |
| Row format | **"Ort (Gemeinde)"** — the place first, its municipality in brackets, so two villages of the same name are told apart |
| Rows shown | **3–4**. The list is a shortcut, not a result page: further matches are neither paged nor scrolled — the visitor types one more letter |
| Placement | an **overlay**, drawn over the page and anchored to the field; it occupies no space in the flow |
| Layout | nothing below the field moves when the list opens or closes — no reserved space while absent, no shift while present (NFR-WEB-0002, CLS) |
| No match | one non-interactive row stating that no place was found; the form still submits and reaches `/dein-ort/starten` (FUN-WEB-0047). Never "try a postcode", never an error treatment |
| Without JavaScript | the list does not exist and nothing is lost — the field stays the plain GET form of D7 |
| Keyboard and a11y | the ARIA combobox pattern of TS-WEB-0002 on the existing input; each suggestion is a real link, so pointer, keyboard and "open in new tab" behave alike |
| Where | every surface that carries the search (D1); a surface may decline the enhancement (the 404 page, the order flow's scope step) but may not alter its shape |

### D8 — Live counters [FIXED: FUN-WEB-0041, FUN-WEB-0104; figure set constrained by Q-0015]

"Counted live or not shown." No static traction figure exists anywhere
on the website — not in copy, not as a fallback, not in an image.

Verified against `events-api/src/app/api/stats` on 2026-09-10:
`/api/stats` returns `totalEvents`, `earliestEventDate`,
`latestEventDate` and data-quality counters (unknown category, unknown
scope, with image, with document). It is tokenless and cache-controlled.

| Figure (SRC-0002 position 4) | Backed today | Rule |
| --- | --- | --- |
| dates | yes — `totalEvents` | render |
| places | **no field** | not rendered until Q-0015 delivers one; no substitute, no estimate |
| updates today | **no field** | same |

So the counter module ships with the figures it can count and grows when
the demand lands — a partially filled module is correct, an invented
number is a defect. Serving tier 2 with a timestamp is permitted; tier 3
is not (FUN-WEB-0104, D5).

County-level counters on `/deine-region` ("{n} places in county X are
already in", DEC-0034) need the same missing places-per-scope signal and
follow the same rule.

### D9 — Handover into the app [FIXED: DEC-0029, DEC-0035]

Links from the website into the app are built from the geo-api community
**slug** — the only current contract (DEC-0029).

| Step | Determination |
| --- | --- |
| Resolve | the searched place resolves to a community via `community/search`; `slug` and `geonameId` come from that response. `community/slug/{slug}` validates a slug that arrives from outside (a link, a QR code). |
| Build | calendar URL = `{APP_HOST}/{slug}`. `APP_HOST` is an environment value: the apex today, `app.schafe-vorm-fenster.de` after the calendars move (DEC-0035). One place in the code knows this. |
| Mark | outbound app links are external links, not route-facade links (TS-WEB-0001 D5 covers website routes only). Campaign parameters present on the inbound request are preserved (FUN-WEB-0048, TS-WEB-0004 D3 rule 6). |
| Registration prefill | **no contract exists** (DEC-0029). `/mitmachen/registrieren` receives `?ort=<slug>` on our own route and prefills its own place step; nothing is appended to the app URL until the app defines it. |
| Never | a slug is never guessed, never string-built from user input, never used before geo-api confirmed it. An unresolvable slug leads to `/dein-ort/starten`, not to a broken app link. |

### D10 — Client contract for live modules [FIXED: DEC-0025, NFR-WEB-0037/038, DEC-0021]

| Rule | Consequence |
| --- | --- |
| Only BFF routes are client-reachable | no ecosystem host, token or `Sheep-Token` header ever reaches the browser (TS-WEB-0004 A6) |
| Tokens are environment values read server-side | one client module per service under `src/clients/{service}-api/`, mirroring TS-WEB-0005 D9 |
| Responses are validated | Zod schemas derived from the pinned `openapi.json`; a validation failure is treated as an upstream error (D5), never rendered |
| Cache keys carry no visitor identity | keys are `{slug|county|window}` and, for segmented modules, `{community, trait, job}` (TS-WEB-0005 D8); no IP, no session |
| Rate limit + origin check | per TS-WEB-0004 D5 / NFR-WEB-0038 |

## Free for the generator

- [FREE] Visual design of module skeletons and of the empty-state block,
  within FUN-WEB-0106 and TS-WEB-0002.
- [FREE] Typeahead mechanics **below** D7a's determined properties:
  debounce interval, cancellation of an in-flight request, how the active
  row is highlighted, how the overlay is positioned — provided D7's no-JS
  path and the combobox pattern of TS-WEB-0002 hold.
- [FREE] **Where the names come from** (D7): the committed index, a
  geo-api name endpoint once Q-0025 lands, or both behind the one BFF
  route. The visitor is promised a name, not a store.
- [FREE] Internal file layout of the BFF handlers and the service
  clients, provided D2 and D10 hold.
- [FREE] Copy of the empty state and the counter labels — content phase,
  placeholders until then.

## Acceptance criteria

| ID | Level | Check |
| --- | --- | --- |
| TS-WEB-0008-A1 | static | No source file references `findbyaddress`; no ecosystem host or read token appears outside `src/clients/*`; no client component imports a service client. |
| TS-WEB-0008-A2 | unit | Chain resolution per D3: place with dates stops at step 1; place without dates starts at step 2; county anchor starts at step 3; stage-0 anchor renders only search + counters. |
| TS-WEB-0008-A3 | unit | Step 2 distance filter: given a geo-api fixture spanning 0–20 km, only communities ≤ 15 km enter the events query; a truncated result set never claims completeness. |
| TS-WEB-0008-A4 | integration | `GET /api/places/{slug}/events` with an empty upstream result answers 200 with an empty list; the module renders the conversion state, no error markup, no retry control. |
| TS-WEB-0008-A5 | integration | Upstream 500 with warm cache → tier 2 plus "Stand: …"; cold cache → tier 3 snapshot; counters cold → module absent from the DOM (D5). |
| TS-WEB-0008-A6 | e2e | `/dein-ort?ort=<covered place with no dates>`: focus job and primary CTA switch to publishing, the place name appears escaped in the copy, URL and canonical are unchanged, position 2 renders labelled as surroundings. |
| TS-WEB-0008-A7 | e2e | Searching an uncovered place lands on `/dein-ort/starten?ort=…`; the live example on that page is a covered place with dates; no website path contains a place slug. |
| TS-WEB-0008-A8 | e2e | On `/dein-kalender` the Portalize loader is requested from the allowlisted host, position 1 is absent, and the page sets no cookie from the embed; blocking the loader leaves the section's copy and CTA intact. |
| TS-WEB-0008-A9 | integration | Counters render only figures present in the `/api/stats` response; a stub omitting a field omits that figure and never substitutes a number. |
| TS-WEB-0008-A10 | static | No numeric traction figure (places, dates, updates) exists in content sources, snapshots or fallback fixtures (FUN-WEB-0041). |
| TS-WEB-0008-A11 | unit | Handover URL is `{APP_HOST}/{slug}` with the slug taken from a geo-api response; an unresolved slug yields the founding route, never an app link; inbound `etcc_*` parameters survive. |
| TS-WEB-0008-A12 | manual | Q-0026 verification: the Portalize embed sets no cookie and introduces no consent duty, and the place-filter parameter behaves as documented — recorded before the module ships. |
| TS-WEB-0008-A13 | tool | Build fetches each service's `openapi.json`, compares it with the pinned copy, and fails on drift affecting the operations in D2 (DEC-0021). |
| TS-WEB-0008-A14 | integration | Place search by name: a typed place name and a typed municipality name each answer with at least one suggestion carrying that place, each rendered "Ort (Gemeinde)"; a name that matches nothing answers with the classified "not covered" outcome whose destination is `/dein-ort/starten?ort=…` — never an empty answer, never a hint to type something else, and never a postcode fallback. |
| TS-WEB-0008-A15 | e2e | The suggestion overlay (D7a): typing two characters opens a list of at most 4 rows, each matching `Ort (Gemeinde)`; the bounding box of the element directly below the field is byte-identical between closed and open state and the interaction contributes 0 to CLS; typing a name with no match shows the single no-match row and submitting still lands on `/dein-ort/starten?ort=…`; with JavaScript disabled no list exists and the form still submits. |
| TS-WEB-0008-A16 | static | No visitor-facing string of a place-search surface contains "Postleitzahl", "PLZ" or "postcode" — checked over the search module's label, placeholder, hint and submit in both locale dictionaries and over the search blocks of the page content artifacts for `/`, `/dein-ort`, `/dein-ort/starten`, `/deine-region` and `/mitmachen/registrieren` (FUN-WEB-0046). The order flow's scope step (TS-WEB-0025 D3) is out of scope: its postcode entry is a purchase configuration, not the place search. |

## Coverage

| Requirement | Discharged by |
| --- | --- |
| FUN-WEB-0040 (live data wherever it proves something) | D1, D2, D7, D8 · A2, A4, A9, A14 |
| FUN-WEB-0041 (counted live or not shown) | D8, D5 counters row · A9, A10 |
| FUN-WEB-0043 (embed demo via Portalize loader) | D6 · A8, A12 |
| FUN-WEB-0044 (empty state shifts the focus job) | D4, D3 step 2 · A6 |
| FUN-WEB-0045 (empty is a conversion occasion, not an error) | D4, D5 · A4, A5, A6 |
| FUN-WEB-0046 (place search by name, no postcode offered, no findbyaddress) | D7, D7a, D2 · A1, A7, A14, A15, A16 |
| FUN-WEB-0049 (handover by geo-api community slug) | D9, D2 handover row · A11 |

Adjacent, discharged elsewhere and only consumed here: FUN-WEB-0042
(widening) TS-WEB-0005 D1/D8 · FUN-WEB-0047 (founding route) TS-WEB-0004 D1 ·
FUN-WEB-0048 (QR forwarding) TS-WEB-0004 D3 · FUN-WEB-0100–106 (resilience,
skeletons) TS-WEB-0003 D5 · NFR-WEB-0037/038 (BFF) TS-WEB-0004 D5.

## Open points

- ~~**Q-0071 — search scope (jan-henrik).**~~ **Closed by the DEC-0079
  amendment of 2026-09-24:** covered-only suggestions ship, a name without
  a match routes to `starten`, and Germany-wide finding by name stays the
  target carried by Q-0025. No search surface states a limit either way.
  What remains is the upstream demand below, not a decision.
- **Q-0025 (geo-api, name search) — no longer a blocker.** The name search
  ships on the committed index (D2), so nothing here waits for the
  endpoint. Its value is that the index could then be retired, that the
  refresh step (`pnpm build:place-index`) would disappear with it, and
  that Q-0071 option 1 becomes possible at all.
- **The committed index is load-bearing and has a freshness duty (D2).**
  It is rebuilt from the public calendar site, not per request. A release
  whose covered-village set moved needs a rebuilt index; a stale one
  costs *suggestions*, never the search — an unmatched name still reaches
  `/dein-ort/starten`. Open: whether the rebuild is wired into the
  content-update trigger (DEC-0050) or stays a manual release step.
- **Q-0026 (Portalize).** Two answers needed before D6 ships: the
  place-filter parameter of the loader, and written confirmation of
  cookie freedom. Without the filter the demo is generic, which weakens
  the strongest moment of `/dein-kalender`.
- **Q-0015 residue, now measured.** `/api/stats` covers *dates* only. Two
  demands to events-api: a **places** count (distinct communities with at
  least one event) and an **updates today** count (events created or
  changed in the local day) — and, for DEC-0034, a per-county variant of
  the places count plus the events-per-place activity signal that
  `/api/region/{county}/examples` needs. That route currently has **no
  upstream operation** behind its ranking.
- **New demand to geo-api: a caller-supplied proximity radius and result
  count.** `community/search` by `geoPoint` runs against a fixed 20 km
  constant and returns 10 results by default; "~15 km" (SRC-0002) is
  therefore approximated on our side (D3). Question for geo-api: can
  `radiusKm` and `maxResults` be exposed for proximity searches, and can
  the response carry the computed distance?
- **Window semantics (D3, [PROPOSED]).** "Today" and "this week" are
  fixed to `Europe/Berlin` calendar days here; confirm against how the
  app's calendars cut their days, so website and app do not disagree on
  what "today" contains.
- **`APP_HOST` switch (D9).** The handover host changes when the
  calendars move to `app.*` (DEC-0035). Open: who flips the environment
  value, and whether both hosts must work during the transition.
- **Timeout budget (D5)** is set, not measured. The `?ort=` indexing rule
  is settled by DEC-0057. (D7
  are [PROPOSED]** — they need TS-WEB-0003 and the SEO area to confirm rather
  than this spec to assert.
