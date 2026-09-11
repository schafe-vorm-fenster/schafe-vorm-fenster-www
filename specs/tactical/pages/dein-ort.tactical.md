---
artefact: tactical-spec
id: TS-020
profile: interaction
status: DRAFT
implements: [WEB-F-011]
sources: [SRC-001, SRC-002, SRC-003]
decisions: [DEC-029, DEC-036, DEC-037, DEC-046, DEC-048, DEC-056]
---

# TS-020 — Your Place (`/dein-ort`)

## Purpose

The reader's page: one place, its next dates, and the one thing the site wants
from a reader — the calendar on the homescreen. It fixes the composition and,
above all, the **two states**, since `/dein-ort` is the only surface whose focus
job changes at runtime (WEB-F-044). Everything general is referenced: TS-006
composition · TS-004 routes · TS-008 live modules · TS-005 proof · TS-009
rendering · TS-010 stages · TS-011 metadata · TS-012 events · TS-007 content
types · `concept/website-design-system.md`.

## Determinations

### D1 — Manifest and block inventory [FIXED: WEB-F-011, SRC-003 §Your place; field set TS-006 D1/D2]

| Manifest field | Value |
| --- | --- |
| `focusJob` | know-what-is-on |
| `primaryConversion` | `save-calendar-to-homescreen`; no equal-weight second goal |
| `audiences` | `rural-residents`, then `actors` (SRC-003: "actors who do not yet know they are actors") |
| `liveModules` | TS-008 position 1 (dates in the place), position 2 (this week nearby), place search |
| `proofSlots` | four `value-story` testimonial slots (D3), one per story |
| `emptyState` | `{ focusJob: publish-our-dates, primaryConversion: register-as-publisher }` |

`emptyState` is a field only this page fills: TS-006 A10 and TS-010 D7 call the
shift "the one registered exception", and a register needs an entry. Blocks per
TS-006 D2, content types per TS-007 D5:

| # | Block | Content type | Data |
| --- | --- | --- | --- |
| 1 | focus block — place name, next dates, calendar handover | `hero` + `live-module-frame` | TS-008 position 1 |
| 2a | four value stories | `value-story` ×4 | D3 |
| 2b | this week nearby | `live-module-frame` | TS-008 position 2 |
| 2c | homescreen block | `howto-block` | D4 |
| 3 | context band | `context-band` | layout, TS-006 D5 |
| 4 | closing CTA | `closing-cta` | the primary conversion |

Blocks 2a–2c are this page's argument sequence, the rest is shared layout; the
single ink section of Page Rhythm is block 1, where the live data sits.

### D2 — Two states, one route [FIXED: WEB-F-044, TS-008 D3/D4, TS-010 D7]

Five resolutions of the place parameter, three of them states of this page. In
all of them the visitor is asked for a place, never for a role (TS-006 D8):

| Resolution | Page |
| --- | --- |
| no `?ort=`, community unknown | **S0** — the prerendered shell, complete on its own (TS-010 D8): place search dominant, stories on snapshot examples (D3), counters may render; no empty-state markup, no unresolved skeleton, no "we could not find you" |
| `?ort=` resolves, ≥ 1 future date | **A** — dates state |
| `?ort=` resolves, 0 future dates | **B** — empty state, focus job shifts |
| `?ort=` present but unresolvable | **S0**, status 200, no redirect; the raw value is escaped and never rendered as data |
| place not covered by geo-api | not this page → `/dein-ort/starten?ort=…` (TS-021, TS-008 D7) |

**The B trigger is "no future dates at all", not "nothing this week."** Position
1 asks `after=now` without an upper bound (TS-008 D3), so a place whose next
date is six weeks out is state A with one row; a bounded window would tell a
filled place that it is empty — see Open points. Block-by-block difference,
everything absent from it being identical in both states:

| Block | A | B |
| --- | --- | --- |
| 1 headline | place name + next dates | place name + "nothing entered in <place> yet" |
| 1 module | 3 date rows | the publish offer occupies the slot — no empty box, no error styling, no retry (TS-008 D4/D5) |
| 1 CTA | `save-calendar-to-homescreen` → `{APP_HOST}/{slug}` | `register-as-publisher` → `/mitmachen` |
| 2a examples | from the place (step 1) | from step 2 outwards, each labelled with its own place name (D3) |
| 2b nearby | second evidence | **first** evidence — the chain starts here |
| 2c homescreen | full block, secondary treatment | kept, demoted below 2b [PROPOSED] |
| 4 closing CTA | the calendar handover | the publishing CTA, per TS-006 D6 |

Unchanged in B: route, URL, canonical, `hreflang`, `<title>`, header, footer,
context band, block order and every block's DOM position — the shift changes the
*offer*, not the page. The place name comes from the resolved geo-api `name`
(TS-008 D4), never from the raw parameter.

### D3 — The four value stories and their evidence [FIXED: SRC-003 §Your place, SRC-001 §4; proof mapping PROPOSED]

Four stories, each `aspect → why it matters → live example → testimonial` (TS-007
type 3). All four always render and TS-005 D6/D7 order them among themselves;
relevance never reduces the count, because a story is a promise of the product,
not a proof element that can lose a ranking.

| # | Aspect (SRC-003) | Live example asks for | Cleared backing | Testimonial candidate |
| --- | --- | --- | --- | --- |
| 1 | the bakery van with its route | a recurring supply date in the place | `google-baecker-schlatkow`, `homeoffice-mobile-anbieter` | `kurzweg-baeckerei` |
| 2 | the council meeting, listed before it happens | an official/municipal date | `impftermine-landkreis` | `zschiesche-gross-kiesow` |
| 3 | culture nobody would have searched for | a culture date | **none** | `kulturlandbuero-broellin` / `eichler-wasserschloss-quilow` |
| 4 | the fifteen-minute radius | position 2 rows, with their place names | `regional-footprint` | `wendt-rubkow` |

All five candidates are `usage_rights: unverified` today (Q-014); the clearance
that decides is read from the installed `@schafe-vorm-fenster/proof` version at
build (TS-005 D5). Two slots, two ladders, no substitutes:

**Example:** place (step 1) → surroundings ≤ 15 km, labelled with that place's own
name → county → at stage 0 the build-time snapshot example, visibly labelled as
such (TS-009 D4 tier 3) → nothing: the story renders as aspect + why it matters
and the publish invitation takes the example box. Never invented, never from an
uncovered place (WEB-F-024).

**Testimonial:** removed by the clearance filter → the story renders three-part and
the claim stays weakened. Forbidden as replacements: a paraphrase, an anonymous
quote, "our users say", a stock portrait, a logo wall, a figure. Clearance is known
at build time, so the slot is absent from the DOM rather than reserved — no async
box, no layout shift — and every empty slot is reported with its proof id.
**Today's expected render is four three-part stories**: a design that only works
with quotes is a defect of the design, not a reason to publish an unverified one.

### D4 — Homescreen block and the one primary marker [FIXED: SRC-003, TS-006 D3/D6; measurement TS-012 D4/D5]

| Aspect | Determination |
| --- | --- |
| Contents | one iOS and one Android instruction, side by side, both always rendered |
| Branching | **none** — no user-agent sniffing, no `navigator.standalone`, no `beforeinstallprompt` probe; the block is static, cacheable content (TS-013) |
| Target | `{APP_HOST}/{slug}`, built server-side from the resolved slug (TS-008 D9) |
| Screenshots | design-system rules unchanged: a missing asset becomes the hatched surface, a non-matching one carries the placeholder badge. No mock screenshot is drawn |
| Measurement | the click emits `save-calendar-to-homescreen` at stage `handover`. The install is off-web and cookielessly unobservable (TS-012 D5) — the website counts the handover and claims nothing about completion |

The goal has three call sites — block 1 (primary treatment, `data-cta="primary"`,
above the fold), 2c and 4. Only block 1 carries the marker; 2c and 4 repeat the
same goal id and target in the secondary treatment, and state B applies the same
rule to `register-as-publisher`. Each click emits once (TS-012 D4 rule 2); a call
site is not a goal of its own.

### D5 — Rendering, announcement, metadata [FIXED: TS-009 D3/D7, TS-011 D4/D9, TS-002]

| Aspect | Determination |
| --- | --- |
| Heading | the `h1` is the place name in both states, at the same DOM position |
| Announcement | the focus-block island is the `role="status"` region of TS-009 D7 — the shift is announced once, not by every module |
| Islands | geometry per TS-009 D3/D7; this page adds no module of its own |
| Indexing | per **TS-011 D9**: `?ort=` URLs indexable, canonical on the parameter-free path. TS-008 D7 proposes `noindex` for the same URL — a real contradiction, listed below. State B changes neither |
| Structured data | `WebPage` only, no `Event` node (TS-011 D4) |
| Analytics | state B sets the one flag TS-008 D4 permits on the page view; the internal publish CTA emits no conversion event — that handover is measured on `/mitmachen/registrieren` (TS-012 D4) |

## Free for the generator

- [FREE] Visual design of every block — this spec fixes order, count and state —
  and whether 2a and 2b interleave visually, within D1's DOM order.
- [FREE] Component and file naming (no manifest yet, Q-044); all copy, the
  empty-state wording included, is the content phase's.

## Acceptance criteria

| ID | Level | Check |
| --- | --- | --- |
| TS-020-A1 | static | `page.meta.ts` of `/dein-ort` declares exactly D1's values including `emptyState`; conversion ids resolve in `@schafe-vorm-fenster/goals`; both audiences resolve, in that order. |
| TS-020-A2 | e2e | Walk state A: `GET /api/places/search?zip=<any covered ZIP>`, take a slug, confirm `GET /api/places/{slug}/events?window=now` is non-empty, open `/dein-ort?ort=<slug>` at 360 × 640. The `h1` is the place name; at most 3 date rows; exactly one element carries `data-cta="primary"`, it is the calendar handover, and it is fully visible without scrolling; the homescreen action and the closing CTA repeat the same goal id and target in the secondary treatment (D4). |
| TS-020-A3 | e2e | Walk state B: probe `GET /api/places/{slug}/events?window=now` over covered slugs until one answers 200 with an empty list, then open `/dein-ort?ort=<that slug>`. Position 1 carries the publish offer; the primary CTA resolves to `/mitmachen`; URL, canonical, robots meta, `<title>`, header, footer, block set and block order are identical to state A; the `h1` is the place name at the same DOM index and the focus-block container is `role="status"`; no element carries error styling, a warning icon, a retry control or a spinner; the nearby module renders, states its own radius, and every row names a place other than the searched one. |
| TS-020-A4 | e2e | Exactly four value stories render in both states; each shows a title, a story paragraph, and either an example box or the publish invitation in its place; no example names a place absent from geo-api. |
| TS-020-A5 | static | The four stories' `proof_ref`s resolve to ids present in the installed `@schafe-vorm-fenster/proof` version; a missing id fails the build (a wrong id is a defect, an uncleared id is not). |
| TS-020-A6 | e2e | With every testimonial uncleared (today's state) the page renders four three-part stories: no quote component, no attributed sentence, no portrait, no paraphrase, no "users say" substitute anywhere in blocks 2a; the build report lists four empty slots with their proof ids. |
| TS-020-A7 | e2e | The homescreen block renders both the iOS and the Android instruction with an iPhone UA and with an Android UA, byte-identical DOM; its action resolves to `{APP_HOST}/{slug}`; a missing screenshot renders the hatched surface and a non-matching one the placeholder badge. |
| TS-020-A8 | integration | Clicking any of D4's three call sites emits `save-calendar-to-homescreen` with `stage=handover` exactly once and nothing else; in state B the page view carries the empty-state flag and the publish CTA emits no conversion event. |
| TS-020-A9 | e2e | `/dein-ort` with no parameter, with `?ort=` empty, and with `?ort=<garbage>` each answer 200 in the search state; the garbage value is HTML-escaped wherever echoed and appears nowhere as data; a search for an uncovered ZIP lands on `/dein-ort/starten?ort=…`. |
| TS-020-A10 | e2e | Stage 0 (no geo header, no referrer, no parameters, JavaScript disabled): search, four stories with snapshot examples visibly labelled as examples, context band and closing CTA all render; no empty-state markup, no unresolved skeleton. |
| TS-020-A11 | integration | For `/dein-ort`, `?ort=<A slug>` and `?ort=<B slug>` the canonical is the parameter-free path, the robots directive is identical, and the JSON-LD graph contains `WebPage` and no `Event` node. |
| TS-020-A12 | e2e | With the BFF route delayed beyond 2 s the date box keeps its final geometry, shows no spinner, and is replaced by the honest empty state rather than a persisting skeleton; CLS over the full load stays < 0.1. |
| TS-020-A13 | manual | Content review before shipping: each story reads aspect → why it matters → example → testimonial and names exactly one mechanism (TS-006 D7); the state-B copy names the place, offers publishing, and reads nowhere as a failure or an apology. |

## Coverage

| Requirement | Discharged by |
| --- | --- |
| WEB-F-011 (`/dein-ort`, focus job know-what-is-on, primary conversion `save-calendar-to-homescreen`) | D1–D4 · A1–A4, A7, A8 |

TS-004 D1/D2/D6 discharge the *route* of WEB-F-011 — the path exists, sits in the
tree, renders; this spec discharges the *page*: manifest, blocks, states,
conversion and its call sites. Neither half stands alone. Consumed but discharged
elsewhere: WEB-F-044/045 TS-008 D4 · WEB-F-042 TS-005/TS-008 D3 · WEB-F-023
TS-004 D1a · WEB-F-033/036 TS-005 D5 · WEB-F-106 TS-009 D7 · WEB-F-047 TS-021.

## Open points

- **Two specs contradict each other on indexing this page**: TS-008 D7 wants
  `noindex, follow` for `?ort=` URLs, TS-011 D9 makes them indexable with a
  parameter-free canonical. D5 follows TS-011, whose area indexing is; one of the
  two must be amended. → spec work.
- **Which element carries `data-cta="primary"`** — TS-006 D3 permits one primary
  treatment, D6 requires the closing block to repeat the conversion. D4 resolves
  it for this page; the rule belongs there. → TS-006.
- **Q-014 decides how much of this page's argument exists.** All five candidates
  are `unverified`, so the launch render is four three-part stories — and story 3
  (culture) has **no cleared backing anecdote**, so in a place without a culture
  date it carries no evidence at all. → jan-henrik, content.
- **The homescreen block in state B is [PROPOSED]**: keeping it offers a reader
  an empty calendar, dropping it leaves the page without a conversion of its own
  while B holds. D2 keeps it, demoted. → IA / jan-henrik.
- **Window semantics decide who sees state B** (TS-008 D3, [PROPOSED]): D2 reads
  position 1 as `after=now`, unbounded; a bounded window would tell places with
  later dates that they are empty. → TS-008.
- **"Foto gesucht" surface** — on the v2.0 board for this screen, absent from the
  IA brief, therefore not specified here. → IA.
- **No component manifest (Q-044)**, so this spec names slots and content types,
  not component ids; `check:specs` cannot close the loop here. → design.
