---
artefact: tactical-spec
id: TS-WEB-0020
kind: interaction
status: DRAFT
version: 0.1.0
implements: [FUN-WEB-0011]
sources: [SRC-0001, SRC-0002, SRC-0003]
decisions: [DEC-0029, DEC-0036, DEC-0037, DEC-0046, DEC-0048, DEC-0056, DEC-0066, DEC-0071, DEC-0083, DEC-0152, DEC-0153]
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-11T07:13:07+02:00"
---

# TS-WEB-0020 — Your Place (`/dein-ort`)

## Purpose

The reader's page: one place, its next dates, and the one thing the site wants
from a reader — the calendar on the homescreen. It fixes the composition and,
above all, the **two states**, since `/dein-ort` is the only surface whose focus
job changes at runtime (FUN-WEB-0153, FUN-WEB-0154). Everything general is referenced: TS-WEB-0006
composition · TS-WEB-0004 routes · TS-WEB-0008 live modules · TS-WEB-0005 proof · TS-WEB-0009
rendering · TS-WEB-0010 stages · TS-WEB-0011 metadata · TS-WEB-0012 events · TS-WEB-0007 content
types · `concept/website-design-system.md`.

## Determinations

### D1 — Manifest and block inventory [FIXED: FUN-WEB-0011, SRC-0003 §Your place; field set TS-WEB-0006 D1/D2]

| Manifest field | Value |
| --- | --- |
| `focusJob` | know-what-is-on |
| `primaryConversion` | `save-calendar-to-homescreen`; no equal-weight second goal |
| `audiences` | `rural-residents`, then `actors` (SRC-0003: "actors who do not yet know they are actors") |
| `liveModules` | TS-WEB-0008 position 1 (dates in the place), position 2 (this week nearby), place search |
| `proofSlots` | four `value-story` testimonial slots (D3), one per story |
| `emptyState` | `{ focusJob: publish-our-dates, primaryConversion: register-as-publisher }` |

`emptyState` is a field only this page fills: TS-WEB-0006 A10 and TS-WEB-0010 D7 call the
shift "the one registered exception", and a register needs an entry. Blocks per
TS-WEB-0006 D2, content types per TS-WEB-0007 D5:

| # | Block | Content type | Data |
| --- | --- | --- | --- |
| 1 | focus block — place name, next dates, calendar handover | `hero` + `live-module-frame` | TS-WEB-0008 position 1 |
| 2a | four value stories | `value-story` ×4 | D3 |
| 2b | this week nearby | `live-module-frame` | TS-WEB-0008 position 2 |
| 2c | homescreen block | `howto-block` | D4 |
| 3 | context band | `context-band` | layout, TS-WEB-0006 D5 |
| 4 | closing CTA | `closing-cta` | the primary conversion |

Blocks 2a–2c are this page's argument sequence, the rest is shared layout; the
single ink section of Page Rhythm is block 1, where the live data sits.

### D2 — Two states, one route [FIXED: FUN-WEB-0153, FUN-WEB-0154, TS-WEB-0008 D3/D4, TS-WEB-0010 D7]

Five resolutions of the place parameter, three of them states of this page. In
all of them the visitor is asked for a place, never for a role (TS-WEB-0006 D8):

| Resolution | Page |
| --- | --- |
| no `?ort=`, community unknown | **S0** — the prerendered shell, complete on its own (TS-WEB-0010 D8): place search dominant, stories on snapshot examples (D3), counters may render; no empty-state markup, no unresolved skeleton, no "we could not find you" |
| `?ort=` resolves, ≥ 1 future date | **A** — dates state |
| `?ort=` resolves, 0 future dates | **B** — empty state, focus job shifts |
| `?ort=` present but unresolvable | **S0**, status 200, no redirect; the raw value is escaped and never rendered as data |
| place not covered by geo-api | not this page → `/dein-ort/starten?ort=…` (TS-WEB-0021, TS-WEB-0008 D7) |

**State B is the one place that asks the reader to publish**
[FIXED: DEC-0071 as amended 2026-09-24]. Direct address is not what
distinguishes it — the whole site addresses the reader directly (DEC-0066,
SRC-0017 CG-008/CG-012), and the earlier carve-out is dropped. What belongs
here and nowhere else is the **invitation**: the calendar for this place
exists and is waiting, so publishing is a small step, and SRC-0002 calls
this the strongest publisher-acquisition moment the site has. On
`/dein-ort/starten`, where the place is not covered at all, the same
request would hand a stranger our distribution problem; TS-WEB-0021 D9 keeps
the ask off that page while keeping the voice. The wording of the
invitation is copy (SRC-0017 CG-032, DEC-0083).

**The B trigger is "no future dates at all", not "nothing this week."** Position
1 asks `after=now` without an upper bound (TS-WEB-0008 D3), so a place whose next
date is six weeks out is state A with one row; a bounded window would tell a
filled place that it is empty — see Open points. Block-by-block difference,
everything absent from it being identical in both states:

| Block | A | B |
| --- | --- | --- |
| 1 headline | place name + next dates | place name + "nothing entered in <place> yet" |
| 1 module | 3 date rows | the publish offer occupies the slot — no empty box, no error styling, no retry (TS-WEB-0008 D4/D5) |
| 1 CTA | `save-calendar-to-homescreen` → `{APP_HOST}/{slug}` | `register-as-publisher` → `/mitmachen` |
| 2a examples | from the place (step 1) | from step 2 outwards, each labelled with its own place name (D3) |
| 2b nearby | second evidence | **first** evidence — the chain starts here |
| 2c homescreen | full block, secondary treatment | kept, demoted below 2b [PROPOSED] |
| 4 closing CTA | the calendar handover | the publishing CTA, per TS-WEB-0006 D6 |

Unchanged in B: route, URL, canonical, `hreflang`, `<title>`, header, footer,
context band, block order and every block's DOM position — the shift changes the
*offer*, not the page. The place name comes from the resolved geo-api `name`
(TS-WEB-0008 D4), never from the raw parameter.

### D3 — The four value stories and their evidence [FIXED: SRC-0003 §Your place, SRC-0001 §4; proof mapping PROPOSED]

Four stories, each `aspect → why it matters → live example → testimonial` (TS-WEB-0007
type 3). All four always render and TS-WEB-0005 D6/D7 order them among themselves;
relevance never reduces the count, because a story is a promise of the product,
not a proof element that can lose a ranking.

| # | Aspect (SRC-0003) | Live example asks for | Example category (events-api id) | Cleared backing | Testimonial candidate |
| --- | --- | --- | --- | --- | --- |
| 1 | the bakery van with its route | a recurring supply date in the place | `everyday-supply` | `google-baecker-schlatkow`, `homeoffice-mobile-anbieter` | `kurzweg-baeckerei` |
| 2 | the council meeting, listed before it happens | an official/municipal date | `community-life` | `impftermine-landkreis` | `wendt-rubkow` (DEC-0152, was `zschiesche-gross-kiesow`) |
| 3 | culture nobody would have searched for | a culture date | `culture-tourism` | **none** | `kulturlandbuero-broellin` / `eichler-wasserschloss-quilow` |
| 4 | the fifteen-minute radius | position 2 rows, with their place names and each row's distance from the anchor | n/a — not a single-category story | `regional-footprint` | `zschiesche-gross-kiesow` (DEC-0152, was `wendt-rubkow`) |

**Rendered as one story stage plus one section (DEC-0153).** Stories 1–3 are
single-category stories and render together as one `story-stage` (SRC-0014
§Story stage), "ein Tag im Dorf": 08:30 the bakery van, 17:00 the council,
20:00 culture. Each hour carries its photograph, or the violet ground for the
council, its quote, its story and **one live date of its own category** in
the "Im Kalender" row (A14). Story 4 is its own argument with its own
evidence module and stays a section of its own, carrying position 2. The
stage stands **after** story 4, so the page's live-data `ink` section and the
stage's ink ground never touch. Picking works without JavaScript (A16), and
each photograph keeps its motif above the quote (A17).

The category column is new (2026-10-07, editorial round 4, F-4-2): D3 always
named what kind of date each story's example asks for in prose, but nothing
verified the rendered example actually matched — found on `/dein-ort`, story 2
showing a `community-life` example tagged "Gemeindeleben" would have passed,
but a `neighbouring`/"Sonstiges" women's-sport example under the council-
meeting story did not, and nothing caught it. A4 is amended below to check it.

All five candidates are `usage_rights: unverified` today (Q-0014); the clearance
that decides is read from the installed `@schafe-vorm-fenster/proof` version at
build (TS-WEB-0005 D5). Two slots, two ladders, no substitutes:

**Example:** place (step 1) → surroundings ≤ 15 km, labelled with that place's own
name → county → at stage 0 the build-time snapshot example, visibly labelled as
such (TS-WEB-0009 D4 tier 3) → nothing: the story renders as aspect + why it matters
and the publish invitation takes the example box. Never invented, never from an
uncovered place (FUN-WEB-0024), and never from a category foreign to the story's
own aspect (the column above; A14). Since DEC-0152 the example is chosen
strictly by that category from the searched place's surroundings, ranked by
topic, text, image, distance and date; a story with no date of its category
shows no example.

**Testimonial — deviation from this determination, recorded (DEC-0104, DEC-0149).**
This row originally read: removed by the clearance filter → the story renders
three-part, forbidden as replacements a paraphrase, an anonymous quote, "our
users say", a stock portrait, a logo wall, a figure; today's expected render
four three-part stories. That is no longer what ships. `e2e/pages/dein-ort.spec.ts`
("TS-WEB-0020-A6: every story closes on a named, attributed quote") documents
the actual decision: the four named, attributed, verbatim-quoted testimonials
ship **pre-clearance**, each with a `clearance: pending` note naming the
record and the reason, and the pre-go-live hardening round clears them before
launch. What did not change is the other half of A6 — no anonymous quote, no
paraphrase, no "users say" substitute, ever. See DEM-0069 and `state/open.md`
for the clearance debt this still carries, and TS-WEB-0005 D5 for the
mechanism that will remove an uncleared quote automatically if it is not
cleared by launch.

### D4 — Homescreen block and the one primary marker [FIXED: SRC-0003, TS-WEB-0006 D3/D6; measurement TS-WEB-0012 D4/D5]

| Aspect | Determination |
| --- | --- |
| Contents | one iOS and one Android instruction, side by side, both always rendered |
| Branching | **none** — no user-agent sniffing, no `navigator.standalone`, no `beforeinstallprompt` probe; the block is static, cacheable content (TS-WEB-0013) |
| Target | `{APP_HOST}/{slug}`, built server-side from the resolved slug (TS-WEB-0008 D9) |
| Screenshots | design-system rules unchanged: a missing asset becomes the hatched surface, a non-matching one carries the placeholder badge. No mock screenshot is drawn |
| Measurement | the click emits `save-calendar-to-homescreen` at stage `handover`. The install is off-web and cookielessly unobservable (TS-WEB-0012 D5) — the website counts the handover and claims nothing about completion |

The goal has three call sites — block 1 (primary treatment, `data-cta="primary"`,
above the fold), 2c and 4. Only block 1 carries the marker; 2c and 4 repeat the
same goal id and target in the secondary treatment, and state B applies the same
rule to `register-as-publisher`. Each click emits once (TS-WEB-0012 D4 rule 2); a call
site is not a goal of its own.

### D5 — Rendering, announcement, metadata [FIXED: TS-WEB-0009 D3/D7, TS-WEB-0011 D4/D9, TS-WEB-0002]

| Aspect | Determination |
| --- | --- |
| Heading | the `h1` is the place name in both states, at the same DOM position |
| Announcement | the focus-block island is the `role="status"` region of TS-WEB-0009 D7 — the shift is announced once, not by every module |
| Islands | geometry per TS-WEB-0009 D3/D7; this page adds no module of its own |
| Indexing | per **TS-WEB-0011 D9**: `?ort=` URLs indexable, canonical on the parameter-free path. TS-WEB-0008 D7 proposes `noindex` for the same URL — a real contradiction, listed below. State B changes neither |
| Structured data | `WebPage` only, no `Event` node (TS-WEB-0011 D4) |
| Analytics | state B sets the one flag TS-WEB-0008 D4 permits on the page view; the internal publish CTA emits no conversion event — that handover is measured on `/mitmachen/registrieren` (TS-WEB-0012 D4) |

## Free for the generator

- [FREE] Visual design of every block — this spec fixes order, count and state —
  and whether 2a and 2b interleave visually, within D1's DOM order.
- [FREE] Component and file naming (no manifest yet, Q-0044); all copy, the
  empty-state wording included, is the content phase's.

## Acceptance criteria

| ID | Level | Check |
| --- | --- | --- |
| TS-WEB-0020-A1 | static | `page.meta.ts` of `/dein-ort` declares exactly D1's values including `emptyState`; conversion ids resolve in `@schafe-vorm-fenster/goals`; both audiences resolve, in that order. |
| TS-WEB-0020-A2 | e2e | Walk state A: `GET /api/places/search?q=<any covered place name>`, take a slug, confirm `GET /api/places/{slug}/events?window=now` is non-empty, open `/dein-ort?ort=<slug>` at 360 × 640. The `h1` is the place name; at most 3 date rows; exactly one element carries `data-cta="primary"`, it is the calendar handover, and it is fully visible without scrolling; the homescreen action and the closing CTA repeat the same goal id and target in the secondary treatment (D4). |
| TS-WEB-0020-A3 | e2e | Walk state B: probe `GET /api/places/{slug}/events?window=now` over covered slugs until one answers 200 with an empty list, then open `/dein-ort?ort=<that slug>`. Position 1 carries the publish offer; the primary CTA resolves to `/mitmachen`; URL, canonical, robots meta, `<title>`, header, footer, block set and block order are identical to state A; the `h1` is the place name at the same DOM index and the focus-block container is `role="status"`; no element carries error styling, a warning icon, a retry control or a spinner; the nearby module renders, states its own radius, and every row names a place other than the searched one. |
| TS-WEB-0020-A15 | e2e | Every row the nearby module (D3 row 4, position 2) renders states its distance from the anchor place alongside its own place name — a place name with no distance fails. No two rows in the same render are identical across id, title and `startsAt`. [F-4-6/F-4-7, round 4] |
| TS-WEB-0020-A4 | e2e | Four value stories render in both states: stories 1–3 as one `story-stage` with three hours, each with its picture or colour, and story 4 as its own section with the nearby module as evidence. No example names a place absent from geo-api, and nothing marks an example as a stand-in. (Amended by DEC-0153; it was "exactly four value-story sections".) |
| TS-WEB-0020-A16 | e2e | With JavaScript disabled, the story stage shows exactly one story. A click on another hour shows that story, and the stage's height does not change. The hours are one radio group, and an arrow key moves the pick (DEC-0153). |
| TS-WEB-0020-A17 | unit | Every image entry with an `anchor` has `anchor.y ≤ 38` (the scrim's clear part), a declared `focal` point, and its `stage_file` on disk. Both locales of `/dein-ort` carry the stage's photographs this way (DEC-0153). |
| TS-WEB-0020-A14 | e2e | Each story's rendered example carries D3's category id for that story (the "Example category" column); a mismatch — any category other than the one the story names — fails. [F-4-2, round 4] |
| TS-WEB-0020-A5 | static | The four stories' `proof_ref`s resolve to ids present in the installed `@schafe-vorm-fenster/proof` version; a missing id fails the build (a wrong id is a defect, an uncleared id is not). |
| TS-WEB-0020-A6 | e2e | **Superseded, deviation recorded (D3, DEC-0149).** Written text: with every testimonial uncleared the page renders four three-part stories, no quote anywhere. Actual, shipped behaviour, per `e2e/pages/dein-ort.spec.ts`: four named, attributed, verbatim quotes render pre-clearance, each with a `clearance: pending` note; no anonymous quote, paraphrase, or "users say" substitute, ever — that half is unchanged and still the criterion. |
| TS-WEB-0020-A7 | e2e | The homescreen block renders both the iOS and the Android instruction with an iPhone UA and with an Android UA, byte-identical DOM; its action resolves to `{APP_HOST}/{slug}`; a missing screenshot renders the hatched surface and a non-matching one the placeholder badge. |
| TS-WEB-0020-A8 | integration | Clicking any of D4's three call sites emits `save-calendar-to-homescreen` with `stage=handover` exactly once and nothing else; in state B the page view carries the empty-state flag and the publish CTA emits no conversion event. |
| TS-WEB-0020-A9 | e2e | `/dein-ort` with no parameter, with `?ort=` empty, and with `?ort=<garbage>` each answer 200 in the search state; the garbage value is HTML-escaped wherever echoed and appears nowhere as data; a name that matches no place lands on `/dein-ort/starten?ort=…`, and no surface of the search field offers a postcode as an alternative. |
| TS-WEB-0020-A10 | e2e | Stage 0 (no geo header, no referrer, no parameters, JavaScript disabled): search, the story stage, the radius story with its module, context band and closing CTA all render; no empty-state markup, no unresolved skeleton. (Amended by DEC-0153: the stage replaces three of the four story sections.) |
| TS-WEB-0020-A11 | integration | For `/dein-ort`, `?ort=<A slug>` and `?ort=<B slug>` the canonical is the parameter-free path, the robots directive is identical, and the JSON-LD graph contains `WebPage` and no `Event` node. |
| TS-WEB-0020-A12 | e2e | With the BFF route delayed beyond 2 s the date box keeps its final geometry, shows no spinner, and is replaced by the honest empty state rather than a persisting skeleton; CLS over the full load stays < 0.1. |
| TS-WEB-0020-A13 | manual | Content review before shipping: each story reads aspect → why it matters → example → testimonial and names exactly one mechanism (TS-WEB-0006 D7); the state-B copy names the place, offers publishing, and reads nowhere as a failure or an apology. |

## Coverage

| Requirement | Discharged by |
| --- | --- |
| FUN-WEB-0011 (`/dein-ort`, focus job know-what-is-on, primary conversion `save-calendar-to-homescreen`) | D1–D4 · A1–A4, A7, A8 |

TS-WEB-0004 D1/D2/D6 discharge the *route* of FUN-WEB-0011 — the path exists, sits in the
tree, renders; this spec discharges the *page*: manifest, blocks, states,
conversion and its call sites. Neither half stands alone. Consumed but discharged
elsewhere: FUN-WEB-0153, FUN-WEB-0154, FUN-WEB-0045 TS-WEB-0008 D4 · FUN-WEB-0042 TS-WEB-0005/TS-WEB-0008 D3 · CON-WEB-0062, FUN-WEB-0142
TS-WEB-0004 D1a · FUN-WEB-0033, FUN-WEB-0150, FUN-WEB-0151, CON-WEB-0069 TS-WEB-0005 D5 · FUN-WEB-0198, FUN-WEB-0199, FUN-WEB-0200, CON-WEB-0089, CON-WEB-0090 TS-WEB-0009 D7 · FUN-WEB-0158, FUN-WEB-0159 TS-WEB-0021.

## Open points

- **Two specs contradict each other on indexing this page**: TS-WEB-0008 D7 wants
  `noindex, follow` for `?ort=` URLs, TS-WEB-0011 D9 makes them indexable with a
  parameter-free canonical. D5 follows TS-WEB-0011, whose area indexing is; one of the
  two must be amended. → spec work.
- **Which element carries `data-cta="primary"`** — TS-WEB-0006 D3 permits one primary
  treatment, D6 requires the closing block to repeat the conversion. D4 resolves
  it for this page; the rule belongs there. → TS-WEB-0006.
- **Q-0014 decides how much of this page's argument exists.** All five candidates
  are `unverified`, so the launch render is four three-part stories — and story 3
  (culture) has **no cleared backing anecdote**, so in a place without a culture
  date it carries no evidence at all. → jan-henrik, content.
- **The homescreen block in state B is [PROPOSED]**: keeping it offers a reader
  an empty calendar, dropping it leaves the page without a conversion of its own
  while B holds. D2 keeps it, demoted. → IA / jan-henrik.
- **Window semantics decide who sees state B** (TS-WEB-0008 D3, [PROPOSED]): D2 reads
  position 1 as `after=now`, unbounded; a bounded window would tell places with
  later dates that they are empty. → TS-WEB-0008.
- **"Foto gesucht" surface** — on the v2.0 board for this screen, absent from the
  IA brief, therefore not specified here. → IA.
- **No component manifest (Q-0044)**, so this spec names slots and content types,
  not component ids; `check:specs` cannot close the loop here. → design.
