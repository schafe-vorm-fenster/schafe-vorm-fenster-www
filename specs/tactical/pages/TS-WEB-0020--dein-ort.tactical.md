---
artefact: tactical-spec
id: TS-WEB-0020
kind: interaction
status: DRAFT
version: 0.1.0
implements: [FUN-WEB-0011]
sources: [SRC-0001, SRC-0002, SRC-0003]
decisions: [DEC-0029, DEC-0036, DEC-0037, DEC-0046, DEC-0048, DEC-0056, DEC-0066, DEC-0071, DEC-0083, DEC-0152, DEC-0153, DEC-0154, DEC-0159, DEC-0163, DEC-0167, DEC-0168, DEC-0170]
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
| `proofSlots` | three `value-story` testimonial slots (D3), one per story on the stage; story 4 has none, its example being a live list (DEC-0170) |
| `emptyState` | `{ focusJob: publish-our-dates, primaryConversion: register-as-publisher }` |

`emptyState` is a field only this page fills: TS-WEB-0006 A10 and TS-WEB-0010 D7 call the
shift "the one registered exception", and a register needs an entry. Blocks per
TS-WEB-0006 D2, content types per TS-WEB-0007 D5:

| # | Block | Content type | Data |
| --- | --- | --- | --- |
| 1 | focus block — place name, next dates, calendar handover | `hero` + `live-module-frame` | TS-WEB-0008 position 1 |
| 2a | four value stories | `value-story` ×4 | D3 |
| 2b | this week nearby | `live-module-frame` | TS-WEB-0008 position 2 |
| 4 | closing block = the homescreen module | `howto-block` in `closing-cta` | D4, the primary conversion |
| 3 | context band | `context-band` | layout, TS-WEB-0006 D5 — the last block (DEC-0170, DEC-0174 §4) |

Blocks 2a–2b are this page's argument sequence, the rest is shared layout; the
single ink section of Page Rhythm is block 1, where the live data sits.

**Amended by DEC-0170 (owner's review 2026-10-27, issue #86).** The homescreen
block (2c) and the closing CTA (4) were one job in two modules with the context
band between them. They are one module now, the closing block, rendered by the
layout **before** the band — the one page where block 4 precedes block 3
(TS-WEB-0006 D2). Its heading is `dein-ort-7-homescreen`'s; the closing heading
of `dein-ort-8-permanence` is removed.

### D2 — Two states, one route [FIXED: FUN-WEB-0153, FUN-WEB-0154, TS-WEB-0008 D3/D4, TS-WEB-0010 D7]

> **Amended by DEC-0163 (2026-10-13).** The page is prerendered once and its HTML is S0. States A and B are applied in the browser (`dein-ort/place-islands.tsx`) once `?ort=` resolves through `/api/places/resolve`; an uncovered value is still answered by the proxy's 307 before any HTML (`place-hop.ts`). Without JavaScript the page is S0 for every `?ort=` (the owner dropped the no-JavaScript rule for the place states).
>
> **Amended by DEC-0168 (2026-10-27).** The state is read off **one** active place (`src/lib/pages/active-place.ts`), never off a second read of the URL: `unknown` and `resolving` render the prerendered S0 frame and ask nothing; `example` is S0 with the example place (Schlatkow) as explicit state — the module rows, the calendar links **and the stage photograph** name it; `chosen` is A or B. Every answer belongs to a generation, and one for a superseded place is dropped. Calendar links are `{CALENDAR_ORIGIN}/{slug}.{geonameId}` (TS-WEB-0008 D9).

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
| 4 closing block | the homescreen module: instructions for the place and the calendar handover as the repeat | the publishing CTA, per TS-WEB-0006 D6 — no homescreen instructions for an empty calendar (DEC-0170 §3, to be confirmed by the owner) |

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
| 4 | the fifteen-minute radius | position 2 rows, with their place names and each row's distance from the anchor | n/a — not a single-category story | `regional-footprint` | **none** — its example is a live list, and no proof quote stands under a live list (DEC-0170, issue #84; was `zschiesche-gross-kiesow`, DEC-0152) |

**Rendered as one story stage plus one section (DEC-0153).** Stories 1–3 are
single-category stories and render together as one `story-stage` (SRC-0014
§Story stage), "ein Tag im Dorf": 08:30 the bakery van, 17:00 the council,
20:00 culture. Each hour carries its photograph, or the violet ground for the
council, its quote, its story and **one live date of its own category** in
the "Im Kalender" row (A14). The stage carries **no onward action**: its link
back up to the page's own dates ("Was heute bei dir los ist") is removed by
DEC-0170 (issue #85), and its one control is "Weiter um …" (A25). Story 4 is its own argument with its own
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

The goal has two call sites — block 1 (primary treatment, `data-cta="primary"`,
above the fold) and block 4, the homescreen module, whose one control is the
repeat (`data-cta="repeat"`). The nearby module's own "all dates" link fires the
same goal and is part of that live module, not a call site of this page. Only
block 1 carries the marker; block 4 repeats the same goal id, target and label,
and state B applies the same rule to `register-as-publisher`. Each click emits
once (TS-WEB-0012 D4 rule 2); a call site is not a goal of its own. Until
DEC-0170 the homescreen block 2c was a third call site with its own app link.

**One pattern for both platforms (DEC-0170 §5).** A mono platform label over an
open numbered list, iPhone then Android, side by side from `xl`. Neither
instruction stands behind a `details` disclosure (A24). In S0 the instructions
name the showcase community, as the rest of S0 does, and the module's control is
the place search (S0's primary repeated).

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

## Owed by the owner's review of 2026-10-12 (DEC-0154)

- ~~**The stage shows the place's own photograph** (issue #18).~~ **Done
  (DEC-0167).** With a covered place the stage loads that place's photograph from
  `GET /api/places/{slug}/photo` — Wikidata's image through geo-api, delivered and
  attributed by assets-api — and lays it over the stage's own photograph after
  hydration, with its credit line (title linked to the source, author, licence)
  in the top corner. No licence, no photograph. A place without a usable one keeps
  the page's own photograph, labelled as an example that is not this place
  (`Q-0089`, resolved). The swap shifts nothing, and a visit without a place never
  asks. Asserted by A19–A22. *Amended by DEC-0168 (review of 2026-10-27, issues
  #78, #80):* the credit is a © control, S0 shows the example place's
  photograph, and the loading window is labelled "Beispielfoto"; asserted by
  A20, A22, A27 and A28.
- ~~**The stage is less full** (issues #20, #23).~~ **Done (DEC-0159).** The hint
  line and the data-protection paragraph go, the placeholder carries "Tipp den
  Ortsnamen ein", the location link sits directly under the field, and in state A
  the search for another place stays in the stage, its placeholder "Anderen Ort
  suchen" (the issue title's wording: the review's "Suche nach einem anderen Ort …"
  is 270 px wide and a 360 px phone leaves the field 173 px). The location
  control's explanation stays its accessible description and tooltip, so
  TS-WEB-0010 D5's "states what will happen" still holds. The lower "search for
  another place" section now stands in state B only — in state A the stage
  already carries it, and two searches for one job would ask twice. Asserted by
  A18.
- **The stage's dates stand on a neutral black ground** (issue #19, `Q-0090`).

## Acceptance criteria

| ID | Level | Check |
| --- | --- | --- |
| TS-WEB-0020-A1 | static | `page.meta.ts` of `/dein-ort` declares exactly D1's values including `emptyState`; conversion ids resolve in `@schafe-vorm-fenster/goals`; both audiences resolve, in that order. |
| TS-WEB-0020-A2 | e2e | Walk state A: `GET /api/places/search?q=<any covered place name>`, take a slug, confirm `GET /api/places/{slug}/events?window=now` is non-empty, open `/dein-ort?ort=<slug>` at 360 × 640. The `h1` is the place name; at most 3 date rows; exactly one element carries `data-cta="primary"`, it is the calendar handover, and it is fully visible without scrolling; the closing block — the homescreen module — repeats the same goal id and target as `data-cta="repeat"` (D4, DEC-0170). |
| TS-WEB-0020-A3 | e2e | Walk state B: probe `GET /api/places/{slug}/events?window=now` over covered slugs until one answers 200 with an empty list, then open `/dein-ort?ort=<that slug>`. Position 1 carries the publish offer; the primary CTA resolves to `/mitmachen`; URL, canonical, robots meta, `<title>`, header, footer, block set and block order are identical to state A; the `h1` is the place name at the same DOM index and the focus-block container is `role="status"`; no element carries error styling, a warning icon, a retry control or a spinner; the nearby module renders, states its own radius, and every row names a place other than the searched one. |
| TS-WEB-0020-A15 | e2e | Every row the nearby module (D3 row 4, position 2) renders states its distance from the anchor place alongside its own place name — a place name with no distance fails. No two rows in the same render are identical across id, title and `startsAt`. [F-4-6/F-4-7, round 4] |
| TS-WEB-0020-A4 | e2e | Four value stories render in both states: stories 1–3 as one `story-stage` with three hours, each with its picture or colour, and story 4 as its own section with the nearby module as evidence. No example names a place absent from geo-api, and nothing marks an example as a stand-in. (Amended by DEC-0153; it was "exactly four value-story sections".) |
| TS-WEB-0020-A16 | e2e | With JavaScript disabled, the story stage shows exactly one story. A click on another hour shows that story, and the stage's height does not change. The hours are one radio group, and an arrow key moves the pick (DEC-0153). |
| TS-WEB-0020-A17 | unit | Every image entry with an `anchor` has `anchor.y ≤ 38` (the scrim's clear part), a declared `focal` point, and its `stage_file` on disk. Both locales of `/dein-ort` carry the stage's photographs this way (DEC-0153). |
| TS-WEB-0020-A14 | e2e | Each story's rendered example carries D3's category id for that story (the "Example category" column); a mismatch — any category other than the one the story names — fails. [F-4-2, round 4] |
| TS-WEB-0020-A19 | integration | `GET /api/places/{slug}/photo` answers 200 with the place's photograph — an assets-api `src`, the Commons file page, licence and author — only when assets-api states a licence for it and, unless the licence is public domain or CC0, an author; it answers a cacheable 204 for a place without an image, an image that is not on Commons, or one without a stated licence; a 204 `no-store` when an upstream or the image itself does not deliver; 404 for an uncovered slug. It reads geo-api with a token and the public village calendar without one, and its answer carries no token (DEC-0167). |
| TS-WEB-0020-A20 | e2e | With the photo route answering a photograph, `/dein-ort?ort=<slug>` at 360 and 1280 px shows that photograph on the stage (`[data-place-photo=<slug>]`, its background the answered `src`) and a © credit control inside the stage, above the `h1`, whose panel names author and licence and links the Commons file page; zero CSP violations (DEC-0167, amended by DEC-0168). |
| TS-WEB-0020-A21 | e2e | With the photo route answering 204, `/dein-ort?ort=<slug>` keeps the stage's own photograph, renders no place-photo layer, and shows the fallback label naming the place; zero CSP violations (DEC-0167, `Q-0089`). |
| TS-WEB-0020-A22 | e2e | `/dein-ort` without `?ort=` calls the photo route once, for the example place, and shows its photograph (DEC-0168). With a place, the stage's box and the `h1`'s box are identical before and after the photograph lands, and the layout shift over the swap stays below 0.1 (DEC-0167, TS-WEB-0009-A8). |
| TS-WEB-0020-A27 | e2e | One active place (DEC-0168, issue #80), with every latency set by the test: without `?ort=` the stage shows the example's photograph — the place the module names — and is labelled "Beispielfoto" while it loads; while `?ort=` resolves, no request names the example place; no frame shows a place's headline over another place's unlabelled photograph; a photograph for a place that was superseded inside the document never lands; a position that resolves after the visitor picked another place does not navigate; the story stage's live date is the active place's, and a story whose pool holds no date of its kind shows no "Im Kalender" label. The store's own interleavings — late resolver, late photograph, late dates verdict, aborted preload — are unit-tested. |
| TS-WEB-0020-A28 | e2e | The place photograph's credit is a © control (DEC-0168, issue #78): a 40 px `button` named "Bildnachweis" in the stage's top-right corner, `aria-expanded` false and no standing credit text; keyboard focus opens its panel, the Commons link is the next tab stop, Escape closes it and returns focus; a click pins it, a second click closes it; at 390 px a tap opens it inside the viewport and a tap outside closes it. The panel names author and licence and links the Commons file page. |
| TS-WEB-0020-A18 | e2e | At 360 × 800 the stage (`#focus-block`) carries exactly one place search in S0 and in state A, both `de` and `en`: the same 56 px field with the typeahead, the placeholder carrying the instruction in S0 ("Tipp den Ortsnamen ein") and the search for another place in state A ("Anderen Ort suchen" / "Search another place"), uncut; a bound label; no helper line; the "use my location" control at most 12 px under the field. The submit carries `data-cta="primary"` in S0 only; in state A the page still has exactly one primary (the handover) and exactly one place search (DEC-0159, issues #20, #23). |
| TS-WEB-0020-A5 | static | The four stories' `proof_ref`s resolve to ids present in the installed `@schafe-vorm-fenster/proof` version; a missing id fails the build (a wrong id is a defect, an uncleared id is not). |
| TS-WEB-0020-A6 | e2e | **Superseded, deviation recorded (D3, DEC-0149).** Written text: with every testimonial uncleared the page renders four three-part stories, no quote anywhere. Actual, shipped behaviour, per `e2e/pages/dein-ort.spec.ts`: three named, attributed, verbatim quotes render pre-clearance on the stage, each with a `clearance: pending` note, and the radius story carries none (DEC-0170); no anonymous quote, paraphrase, or "users say" substitute, ever — that half is unchanged and still the criterion. |
| TS-WEB-0020-A7 | e2e | The homescreen module renders both the iOS and the Android instruction with an iPhone UA and with an Android UA, byte-identical DOM; in state A its one action resolves to `{CALENDAR_ORIGIN}/{slug}.{geonameId}` (DEC-0168) and carries `data-cta="repeat"`; a missing screenshot renders the hatched surface and a non-matching one the placeholder badge. |
| TS-WEB-0020-A23 | e2e | On `/dein-ort` and `/en/your-place`, in S0 and in state A (and on every other route, `e2e/module-rules.spec.ts`): no visible `blockquote` follows the last live row of its section; no section whose last visible text is a quote is followed by a section carrying a visible quote; the homescreen instructions render at most once (DEC-0170, issue #84). |
| TS-WEB-0020-A24 | e2e | The homescreen module contains no `details` or `summary`; the iOS and the Android column each hold one platform label and an open numbered list (DEC-0170 §5, issue #86). |
| TS-WEB-0020-A25 | e2e | In S0, in state A and on `/en/your-place` the story stage contains no in-page link (`a[href^="#"]`) and no "Was heute bei dir los ist" / "What is on near you today"; "Weiter um …" stands (DEC-0170, issue #85). |
| TS-WEB-0020-A26 | e2e | In S0, in state A and on `/en/your-place` the page carries exactly one `#homescreen`, inside `#closing-cta`, and `#closing-cta` precedes `#context-band` in DOM order; the module holds exactly one control (the calendar handover in state A, the place search in S0); neither "Einmal antippen" nor "One tap, and it sits" renders (DEC-0170, issue #86). |
| TS-WEB-0020-A8 | integration | Clicking any of D4's two call sites emits `save-calendar-to-homescreen` with `stage=handover` exactly once and nothing else; in state B the page view carries the empty-state flag and the publish CTA emits no conversion event. |
| TS-WEB-0020-A9 | e2e | `/dein-ort` with no parameter, with `?ort=` empty, and with `?ort=<garbage>` each answer 200 in the search state; the garbage value is HTML-escaped wherever echoed and appears nowhere as data; a name that matches no place lands on `/dein-ort/starten?ort=…`, and no surface of the search field offers a postcode as an alternative. |
| TS-WEB-0020-A10 | e2e | Stage 0 (no geo header, no referrer, no parameters, JavaScript disabled): search, the story stage, the radius story with its module, the closing block (the homescreen module with the search) and the context band all render; no empty-state markup. (Amended by DEC-0153: the stage replaces three of the four story sections. Amended by DEC-0163: the "no unresolved skeleton" clause is withdrawn — live rows load in the browser and hold reserved skeletons without JavaScript.) |
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
- ~~**The homescreen block in state B is [PROPOSED]**~~ **Settled by DEC-0170
  §3, owner to confirm:** the homescreen module is the closing block, and in
  state B the closing block is the publishing offer. Original point: keeping it offers a reader
  an empty calendar, dropping it leaves the page without a conversion of its own
  while B holds. D2 keeps it, demoted. → IA / jan-henrik.
- **Window semantics decide who sees state B** (TS-WEB-0008 D3, [PROPOSED]): D2 reads
  position 1 as `after=now`, unbounded; a bounded window would tell places with
  later dates that they are empty. → TS-WEB-0008.
- **"Foto gesucht" surface** — on the v2.0 board for this screen, absent from the
  IA brief, therefore not specified here. → IA.
- **No component manifest (Q-0044)**, so this spec names slots and content types,
  not component ids; `check:specs` cannot close the loop here. → design.
