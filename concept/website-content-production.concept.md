---
title: "Website Content Production — Entities, Schemas, Mapping, Components, Playbooks"
created_at: 2026-09-10
status: draft
source: workshop
intent: inform
brand: schafe-vorm-fenster
tags: ["website", "content", "schema", "pipeline", "playbooks", "components"]
related:
  - ./website-communication-principles.concept.md
  - ./website-relevance-model.concept.md
  - ./website-information-architecture.concept.md
  - ../handbook/decisions/001-content-source-of-truth.adr.md
---

## Purpose

The three existing website documents say *what* the site must communicate:
the principles say how a page argues, the relevance model says how proof
and live data are ordered, the IA says which pages exist and what each one
owes. None of them says how a concrete, multilingual, format-fitted text
comes into being.

This document is the fourth: it specifies the **production system** — the
entities involved, the schemas that bind them, the mapping from page to
content, the components that render it, and the playbooks that run the
transformation. It is a rough concept (Grobkonzept): it fixes the
structure and the vocabulary, not the final field lists.

It implements ADR-001 (`go-to-market-os` is the single source of truth for
content) and DEC-020 in this repository (raw material arrives as
packages, agents transform it, results live locally as markdown per
language). It is the input for WEB-F-080–089.

## The Pipeline in One Picture

```text
  A  SOURCE                B  CONTENT              C  MAPPING            D  COMPONENT
  ────────────             ────────────            ────────────          ────────────
  GTM packages       →     website content    →    page composition  →   rendered page
  (@schafe-vorm-           (md + frontmatter,      (ordered slots        (React component
   fenster/*)               per locale,             per route)            per schema)
                            schema-validated)
       │                        ▲                       │                     ▲
       │                        │                       │                     │
       └──── E  PROCESS ────────┘                       └──── binds slot ─────┘
             playbooks: map → generate → review → validate → update
```

Five layers, five sections. Each layer has exactly one owner and one
artefact family, and each arrow is a machine-checkable contract.

## A — Source Layer: What We Draw From

### A.1 Source entities

Raw material lives in `go-to-market-os` and is delivered as npm packages
from `npm.pkg.github.com`. These are the entities the website may derive
content from:

| Source entity | Package | Carries | Feeds website content types |
| --- | --- | --- | --- |
| Proof | `@schafe-vorm-fenster/proof` | claim, evidence, source, date, `usage_rights`, audiences, geo | proof card, quote, value story, offer tier reassurance |
| Media echo | `@schafe-vorm-fenster/media-echo` | type(s), title, source, date, url, geo, participants, media | proof card, archive entry, award mention |
| Offerings | `@schafe-vorm-fenster/offerings` | scope, price, `promotion`, audience | offer tier, comparison, feature/benefit |
| Strategy | `@schafe-vorm-fenster/strategy` | positioning, value propositions, conversion goals, content pillars, business goals | hero, scene, value story, CTA semantics |
| Audiences | `@schafe-vorm-fenster/audiences` | audience model, communication goals, register | tone profile input, audience ordering |
| Partners | `@schafe-vorm-fenster/partners` | partner, relationship, logo | partner mention |
| People | `@schafe-vorm-fenster/people` | name, role, portrait, bio | person profile, origin story |
| Brand | `@schafe-vorm-fenster/brand` | tokens, logos, imagery rules, kit | component styling, image rules, length budgets |
| Posts | `@schafe-vorm-fenster/posts` | published posts | anecdote (secondary; not a website surface) |

Two content families are **not** sourced from the hub and keep their own
pipelines: legal texts (Google Workspace import, DEC-012/027/039) and live
data from the app (relevance model, "Live Content").

### A.2 The moving-package rule

The package structure is being reorganised (ADR-002 folder classes,
ADR-005/007/008 delivery). The same records will keep moving between paths
for a while. The production system must not care.

Rules:

1. The website depends on **package names and versions**, never on
   repository paths. `@schafe-vorm-fenster/proof@0.3.0` is the address.
2. Every package exposes `index.json` (name, version, files, frontmatter)
   and, where it exists, `schema.mjs`. The website reads records through
   that pair and through nothing else.
3. A single **source adapter** in the website repository resolves
   `source entity + record id → record`. It is the only module that knows
   package layout. When the hub restructures, one file changes.
4. Generated content files reference records as
   `<package>@<version>#<record-id>`, never as a file path.
5. A needed field the package does not carry is **marked missing — never
   invented, never blocking**. The content file records `UNKNOWN` with the
   question, the affected claim is weakened, the proof slot stays visibly
   empty (principle 4), and the gap is registered as a demand against
   `go-to-market-os`. Production continues; the hub closes the gap on its
   own schedule and the update process (P7) picks the content back up when
   it does. The relevance model already names two such gaps (`audiences`
   on media echo, `geo` on proof).

### A.3 Bound terminology

Copy is a vocabulary problem before it is a writing problem. *Ort*,
*Gemeinde*, *Akteur*, *Kalender*, *Dorfkalender*, *Portalize* — each has
one meaning on this website and several in ordinary speech. An agent that
picks the wrong one produces text that reads well and says something
false, which is the expensive kind of error because review does not catch
it by ear.

The **glossary** is therefore a first-class production input, not
documentation:

- Canonical definitions stay in `go-to-market-os` — the four jobs,
  audiences, offerings, conversion goals. The website does not redefine
  them.
- `specs/glossary/glossary.md` holds the `GL-###`
  register and points at the canonical source per term.
- The register needs two columns it does not have yet: **the word to use
  in copy**, per locale, and **the words not to use**. `Portalize` is the
  clearest case — a real product name that must never appear in a
  navigation label or a route (IA §route naming), but does appear in body
  copy on `/dein-kalender`. Unwritten, that distinction is rediscovered on
  every generation run and lost on half of them.
- Terminology binds per locale. The English word for *Ort* is a decision,
  not a lookup, and once taken it holds on every page.

Every generation run and every review takes the glossary as an interface
(E.2). A term in copy that the glossary does not carry is a finding, not a
matter of style.

## B — Content Layer: The Schema Hierarchy

Website content formats are Zod schemas in
`src/domain/content/` (WEB-F-089). The existing
`content-frontmatter.schema.ts` is the starting point and will be reshaped
into the three-tier hierarchy below. `describe()` on every field carries
the authoring guidance an agent writes against; `max()` carries the length
budget the component can render.

### B.1 Tier 1 — `ContentBase`

Every content file, regardless of type, carries identity, provenance, and
lifecycle:

| Group | Fields (draft) |
| --- | --- |
| Identity | `id`, `type`, `locale`, `variant?` |
| Placement | `route`, `slot`, `focus_job`, `audiences[]` (priority order), `conversion_goal?` |
| Provenance | `derived_from[]` (`<package>@<version>#<record-id>`), `generated_by` (`<playbook>@<version>`), `generated_at` |
| Editorial | `status` (`draft` → `in-review` → `approved`), `reviewed_by?`, `reviewed_at?`, `tone_profile` |
| Proof | `proof_refs[]`, `proof_slot_empty?` (with the target proof id) |

`derived_from` is the key the update workflow runs on (WEB-F-083/084).
`status` implements the STRICT rule: what an agent emits is `draft` and
becomes effective only at the editorial decision point.

### B.2 Tier 2 — Fragments (reusable, never standalone files)

Composable value objects shared by many content types. Each has its own
length budget and its own rendering contract:

| Fragment | Fields | Notes |
| --- | --- | --- |
| `Teaser` | `eyebrow?`, `title`, `abstract`, `image?`, `cta?` | the generic promotable unit |
| `Cta` | `label`, `target`, `conversion_goal_id`, `reassurance?` | label speaks value, never contract |
| `ImageRef` | `asset`, `alt`, `caption?`, `credit?`, `usage_rights` | `cleared` is a hard filter |
| `Quote` | `text`, `attribution`, `role?`, `proof_ref`, `clearance` | never rendered when unverified |
| `Stat` | `value`, `unit?`, `label`, `live_source?` | static figures forbidden (P5) |
| `CheckItem` | `text`, `emphasis?` | the ✓ rows in offer tiers |
| `Step` | `index`, `title`, `body`, `hint?`, `status_badge?` | publishing paths, form flows |
| `ComparisonRow` | `today`, `with_product` | "Heute / Mit Portalize" |
| `GeoBadge` | `level`, `label` | display label over the geo levels of B.5 |
| `RelevanceFacets` | `geo`, `job_relation` (+ reason), `editorial_weight` (+ reason), `clearance`, `place_bound?` | the TS-005 contract; mandatory on every selectable type (B.5) |
| `PlaceholderText` | template with `{place}`, `{county}` slots | localization-safe interpolation |

### B.3 Tier 3 — Content types

Derived from the wireframes (`concept/v1.0`, eight screens), the IA page
briefs, and the navigation. Each type extends `ContentBase`, composes
fragments, and declares which source entities it may derive from.

| # | Content type | What it is | Composed of | Source | Used on |
| --- | --- | --- | --- | --- | --- |
| 1 | `hero` | page opener carrying the focus job | headline, lead, `Cta`, `ImageRef?` | strategy, offerings | every page |
| 2 | `scene` | P1a: one mechanism as a picturable scene | aha question, body, `Cta` | strategy, posts | home (3), `/mitmachen` |
| 3 | `value-story` | aspect → why it matters → live example → testimonial | title, story, live binding, `Quote` | proof, strategy | `/dein-ort` (4) |
| 4 | `objection-list` | why today's channels fail | headline, items | audiences | `/mitmachen` |
| 5 | `publishing-path` | one of the three ways to submit a date | `Step` | offerings | `/mitmachen` (3) |
| 6 | `comparison` | today vs. with the product | `ComparisonRow[]` | offerings | `/dein-kalender` (4) |
| 7 | `offer-tier` | one tier under "who is the calendar for?" | name, audience line, price, `CheckItem[]`, `Cta` ×2, footnote | offerings | `/dein-kalender` (3), `/deine-region` |
| 8 | `feature-benefit` | feature ↔ what it does for you | feature, benefit, `proof_ref?` | offerings | tiers, `/deine-region` |
| 9 | `form-step` | copy shell of one step in a flow | `Step`, field labels, handover note | offerings | `/mitmachen/registrieren` (3), `/dein-kalender/bestellen` (4) |
| 10 | `proof-card` | one proof element as the website renders it | context line, claim, attribution, `GeoBadge`, `ImageRef?`, link | proof, media echo | every page |
| 11 | `empty-proof-slot` | the visible gap where no cleared proof exists | copy, target proof id | — | `/ueber-uns`, any stream |
| 12 | `archive-entry` | one chronological row | title, type, date, source, link | media echo | `/ueber-uns/archiv` |
| 13 | `origin-story` | founder and origin narrative | headline, body, `ImageRef` | people, strategy | `/ueber-uns` |
| 14 | `anecdote` | short reusable narrative snippet | title, body, `proof_ref?` | anecdote records in the hub (consolidation pending) | inline anywhere |
| 15 | `person-profile` | team member | name, role line, portrait, bio? | people | `/ueber-uns` |
| 16 | `partner-mention` | a named relationship | partner, relationship line, logo, link | partners | `/deine-region`, `/ueber-uns` |
| 17 | `trust-block` | data protection, operations, AI | headline, body, link | strategy, legal | `/dein-kalender` |
| 18 | `howto-block` | homescreen instructions | headline, body, platform steps, screenshots | — | `/dein-ort` |
| 19 | `live-module-frame` | localizable shell around live data | title template, subline, empty-state copy, `Cta` | — | every live module |
| 20 | `empty-state` | place without dates, focus-job switch | headline, lead, `Cta`, fallback note | — | `/dein-ort`, home |
| 21 | `context-band` | the other three jobs, first person | headline, lead, three `Teaser` | IA | every page |
| 22 | `closing-cta` | the focus job's CTA as the last block | `Cta`, reassurance | strategy | every page |
| 23 | `page-meta` | SEO and sharing | title, description, OG image, robots | strategy | every page |
| 24 | `site-config` | navigation labels, footer, newsletter copy | labels, links | IA | global |
| 25 | `error-page` | 404 / 500 copy | headline, sentence, `Cta` | — | `/404`, `/500` |
| 26 | `legal-section` | one anchored section of `/rechtliches` | title, anchor, body | Google Docs import | `/rechtliches` |

Rules:

- A content type declares its allowed source entities. A `proof-card` that
  claims to derive from `offerings` fails validation.
- Every field with a visual limit carries `max()`; the number comes from
  the component and the design kit, not from taste.
- Types 19–25 are copy shells with interpolation slots; they are generated
  once per locale and never per place.
- Type 26 stays outside the generation pipeline; it is imported and only
  validated here.
- Types 3, 10, 12, 14 and 16 are **selectable**: the relevance engine may
  choose and order them, so they carry `RelevanceFacets` (B.5). A
  selectable type without complete facets is invalid — the engine has no
  fallback and must not invent one.
- Nothing on this list is a "page". A page is composition (Layer C).

### B.4 Localization

- One file per locale: `content/<locale>/<route>/<slot>.<type>.md`.
- Phase 1 is `de` + `en`; the schema and the playbooks take a locale
  **set**, never a hard-coded pair (DEC-006).
- Everything the pipeline generates renders in the page language, proof
  context lines included. Original artifacts — a clipping headline, a
  quoted sentence in its source language — stay original (DEC-026), which
  is why `Quote` and `ImageRef` carry a `source_language` field and are
  exempt from translation.
- Locale files are siblings, not translations of each other: the `en`
  variant is generated from the same source record with the same playbook,
  not translated from `de`. That keeps register and idiom right and makes
  a third language cheap.

**Harmonisation.** Parallel generation buys idiom and costs consistency:
two runs from one record can select different facts, bind different proof,
or order the argument differently. A harmonisation step therefore compares
the locale variants before they reach review and aligns what must be
aligned:

| Must match across locales | May differ |
| --- | --- |
| the facts asserted, and the records they come from | phrasing, rhythm, idiom |
| which claims are made, and their proof bindings | sentence and paragraph count |
| the CTA target and its conversion goal | the CTA wording |
| which slots are filled — no locale ships fewer blocks | length, within the budget |
| numbers, prices, dates, names | number and date formatting |
| `UNKNOWN` markers and empty proof slots | register, where the market differs |

Divergence in the left column is a defect and is repaired before review.
Divergence in the right column is the entire reason for generating
separately. Where the two collide — an argument that carries in German and
falls flat in English — harmonisation does not quietly pick a winner: it
raises the difference for the editorial decision point, which is the only
place allowed to decide that two markets get different arguments.

### B.5 The relevance contract (TS-005)

The relevance engine is specified in
`specs/tactical/relevance-engine.tactical.md` (TS-005, DEC-041) as a
pure function over a normalised element set. It reads **the website's
content schema and nothing else** — no GTM package, no source record,
no lookup at render time. Everything it needs must therefore be on the
content file when generation ends. Four facets, on every selectable type.

#### 1. Geo — one field, read at the level that covers the element

`country > state > county > municipality > community`, unknown levels
`null`, mapped one-to-one from the hub:

| GTM source field | Website facet |
| --- | --- |
| `geo.place` | `geo.community` |
| `geo.municipality` | `geo.municipality` |
| `geo.county` | `geo.county` |
| `geo.state` | `geo.state` |
| `geo.country` | `geo.country` |

**This corrects DEC-041 §1 and TS-005 D1**, which fix four levels and
drop *state* on the stated grounds that four is what the geo-api offers.
That premise does not hold: `GeoAdministrativeHierarchy` in
`geo-api/src/types/GeoLocation/geo-location.types.ts` is `place? >
community > municipality > county > state > country`, with `state` a
**required** field (`admin1@geonames`). Five levels are closer to the
geo-api than four, not further from it.

**The level rule: coverage, not venue.** An element is recorded at the
most specific level that covers what it is *about* — which is usually
where it happened, and sometimes is not:

| Element | Recorded as | Why |
| --- | --- | --- |
| Abend der Engagierten, Flechtorf | `community` | one village, one evening |
| LeLender — 17 places of Gemeinde Lehre | `municipality` | covers the whole Gemeinde, no single village |
| NØRD Award 2026, Rostock | `state` | an MV award, held in Rostock |
| KfW Award Gründen 2021 | `country` | nationwide award; the Frankfurt ceremony is not its subject |

One field, no `geo_reach` beside it. The venue survives in the copy — a
card may read "Frankfurt am Main" while scoring as nationwide, because
the venue is editorial detail and the level is what the element covers.

Proximity tiers, computed from the most specific level downwards:

| Tier | Match | Proposed weight |
| --- | --- | --- |
| 0 | same community | 1.0 |
| 1 | same municipality | 0.8 |
| 2 | same county | 0.6 |
| 3 | same state | 0.45 |
| 4 | same country | 0.3 |
| 5 | different country | 0.15 |
| 6 | no match / element has no geo | 0.1 |

Tier 5 exists for the other country domains (`owcezaoknem.pl`,
`schafvormfenster.at`, `sheepoutside.com`) and for appearances abroad. It
is nearly empty in today's stock of 34 verified entries — that is the
point: it is what makes *very far* reachable at all once the stock has
anything in it.

Three consequences, each a demand against TS-005 rather than a decision
this document may take:

1. **Segmentation moves to community.** TS-005 D8 segments the cache at
   municipality ("community too many variants"), which makes tier 0
   unreachable — the engine never learns the visitor's community and
   cannot distinguish tier 0 from tier 1. Community segmentation makes
   the place effect real and costs cache entries in the order of a factor
   of 10 to 20. That trade is accepted.
2. **Weights become a profile per focus job.** `w_geo` outranks `w_job`
   on `/dein-ort`, where everything starts at the visitor's own place;
   on `/dein-kalender` and `/deine-region`, job fit outranks geo — a
   mayor from Baden-Württemberg is better served by Rubkow than by an
   arbitrary local press clipping. TS-005 D5 currently fixes one weight
   set for all pages; it needs one per focus job. This also settles the
   open point the relevance model left ("whether `w_job` may outrank geo
   proximity"): it may, and where is a property of the page.
3. **No distance tier in phase 1.** Administrative containment is the
   only measure. This is a known mismatch with the site's own argument —
   `/deine-region` sells "thirty kilometres, across municipal boundaries"
   while the scale cannot express it, and a visitor 8 km away across a
   Kreisgrenze scores as *same state*. Accepted for phase 1 because a
   distance tier needs coordinates on every element and on the visitor.
   Revisit when the map view arrives.

**What stage 1 can actually deliver.** IP geolocation resolves to county
level, rarely finer, so tiers 0 and 1 fire only after a place search.
Accepted: proof starts at county scale and becomes local the moment
someone searches. Stage 0 has to carry itself anyway.

#### 2. Job relation — an assessment on the relation axis

**Relations carry the jobs, not audiences.** ADR-003 splits the hub's
model into audience (durable identity, changes almost never) and relation
(posture towards us, changes with every conversion). The six relations
map onto the four jobs almost one to one:

| Relation | Job |
| --- | --- |
| `reader` | know what is on |
| `publisher` | publish our dates |
| `customer` | run our own calendar |
| `multiplier`, `funder` | understand who is behind it |
| `advertiser` | no job on the website — the offering is `withheld` |

This is what the communication principles already say in their own
picture: a person wears many hats, and *a hat is a posture, not an
identity*. **It corrects DEC-041 §2**, which names audiences as the
dimension to map. The audience axis cannot carry it: `actors` holds
reader, publisher, customer and multiplier, so an audience-derived
mapping marks it as supporting all four jobs — and `municipalities`,
`counties`, `institutions` and `companies` are barely narrower. A facet
weighted 0.25 that says *supports* almost everywhere is 25 % of the score
spent on a constant.

**It is assessed, not derived.** There is no audience → job table and no
relation → job lookup applied mechanically. The correspondence above is
guidance for a judgement made once per element, at generation time, with
a stated reason — the same shape as editorial weight (§3), and sticky in
the same way:

```yaml
job_relation:
  know-what-is-on: neutral
  publish-our-dates: supports
  run-our-own-calendar: supports
  understand-who-is-behind-it: neutral
job_relation_reason: >
  Testimonial of a publishing Verein; carries the publishing argument
  directly and the licence argument by example. Not a reader's voice.
```

Why an assessment rather than a table: an element supports several jobs
at different strengths, and which one it argues for is a property of the
claim, not of the audience tag on its source record. A table would
either flatten that or need a rule per element anyway — at which point it
is an assessment with extra steps.

Scale, per job: `supports` (1.0) · `neutral` (0.5) · `alien` (0.2),
matching TS-005 D3. The profile is per element over all four jobs, so
"supports several jobs, differently" is expressible without a finer
scale.

**Unassessed means weak.** A job left unrated takes the lowest step and
is marked as unassessed, so the gap stays countable. In doubt an element
holds back rather than appearing everywhere — the opposite default would
restore the very collapse the relation axis exists to avoid.

Two notes on the edges:

- **"Understand who is behind it" is assessed like the other three.** It
  is tempting to treat it as a constant — proof *is* trust — but a
  funding decision and a Verein quote do not carry it equally, and a
  constant would waste the one job that has no conversion of its own to
  fall back on.
- **`tech-leaders` is excluded from the pool entirely.** It belongs to the
  personal and Leafcutter track (audiences README), and the communication
  principles' boundaries keep the AI-coaching track off this website.
  `companies` stays in: the offering is `withheld`, but the audience is
  real, and a weak job profile is the right instrument for it rather than
  a hard filter.

Naming demand against TS-005 D3: `alien` is now also the value an
unassessed job takes, and "alien" reads as a verdict rather than an
absence. Rename it to something like `peripheral` before reviewers start
interpreting it.

#### 3. Editorial weight — set with a reason, then sticky

A multiplier on freshness, default `1.0` (DEC-041 §5, TS-005 D4). It is
how an evergreen element stays visible without touching the algorithm.

An agent may set it. Judging that a founding award still carries in three
years is exactly the kind of assessment generation is for, and forcing
every such judgement through a human queue would make the field unused
rather than careful. What the field cannot survive is being overwritten
blindly — silently reset on the next regeneration, or mass-adjusted by a
script that "normalises" content.

Three rules, and they are about persistence rather than authority:

1. **A non-default value carries an `editorial_weight_reason`.** Whoever
   sets it — agent or person — states why in one sentence. A weight
   without a reason fails validation.
2. **It is sticky across regeneration.** P3 and P7 carry an existing
   weight and its reason forward unchanged. Regenerating a content file
   from a newer package version must not reset the value to `1.0`; that
   would quietly undo an editorial decision through a routine update.
3. **It changes only deliberately, one element at a time.** A new value
   replaces the old reason with a new one and shows up in the diff. No
   script writes this field in bulk, and no bulk write passes review.

The point is not to keep agents out. It is that this facet — like
`job_relation` in §2 — holds a standing judgement rather than a derived
fact, so it must outlive the run that produced it. Both follow the same
three rules.

#### 4. Clearance — a filter that can change after generation

`usage_rights: cleared` is a hard filter applied before scoring
(WEB-F-033): uncleared elements never enter the pool, they are not
down-weighted. The facet is denormalised onto the content file at
generation time, which gives it a staleness risk the other three do not
have — clearance is revoked in the hub, the local file still says
`cleared`, and the site keeps publishing a quote it may no longer use.

Two mitigations, both required:

- P5 re-validates every `clearance` facet against the installed package
  version on every build. A mismatch **fails** the build; it does not
  warn.
- P7 treats a clearance change as the highest-priority update:
  a revocation removes content immediately rather than opening a pull
  request for the next review round.

Five testimonials in the hub are `unverified` today, which is why four
value stories on `/dein-ort` currently carry only half their argument.
That is a clearance backlog rather than a schema problem — but the schema
is what keeps it off the page.

#### 5. Place-bound elements

WEB-F-024: an element referencing a place with no data in events-api is
filtered out together with clearance. Selectable types therefore carry
`place_bound` and the place reference, so the engine can ask events-api
before showing "in <place>" to a visitor whose place is empty.

#### 6. What the facets must not contain

The engine is segmented, not personalised: cached components take
`{ municipality, trait, job }` as props (TS-005 D8). Content must stay
segment-independent — no visitor-specific text, no pre-resolved place
name, no request-time value. Place names reach the page through the
named interpolation slots of `PlaceholderText`, never baked into a
generated string. A content file that varies per visitor breaks the cache
key and, with it, the performance budget.

## C — Mapping Layer: The Container Skeleton

Between IA and components sits one artefact per route: the **page
composition**. It is the machine-readable form of the page brief.

### C.1 What a composition declares

```text
PageComposition
  route              /dein-kalender
  focus_job          run-our-own-calendar
  primary_conversion buy-calendar-licence
  audiences          [municipalities, institutions, vereine, counties]
  slots[]
    slot id          tiers
    content type     offer-tier
    cardinality      3 (fixed)
    binding          static | live | relevance-selected
    required         true
    empty behaviour  n/a
    proof slot       sell-weighted stream, 3 elements
    notes            order is free · under-your-name · region
```

Binding kinds:

- **static** — resolved from a content file per locale at build time.
- **live** — resolved from the app API at request time; the content file
  supplies only the `live-module-frame`.
- **relevance-selected** — the slot names a proof stream; the relevance
  model picks and orders elements at render time. The composition fixes
  the count and the weighting profile, never the elements.

### C.2 Coverage

One composition per route: `/`, `/dein-ort`, `/dein-ort/starten`,
`/mitmachen`, `/mitmachen/registrieren`, `/dein-kalender`,
`/dein-kalender/bestellen`, `/deine-region`, `/ueber-uns`,
`/ueber-uns/archiv`, plus `/rechtliches`, `/404`, `/500`.

### C.3 The composition is the checkable contract

The eight-point compliance check in the communication principles becomes a
lint over the composition set:

1. exactly one `focus_job` — checked
2. `primary_conversion` resolves in `goals/conversion-goals/` — checked
3. audiences in priority order, resolvable — checked
4. every claim-bearing slot has a proof slot with a resolvable, cleared
   proof id, or is explicitly weakened — checked
5. at least one live module with a defined empty state — checked
6. a `context-band` slot naming the other three jobs — checked
7. a `closing-cta` slot identical to the primary conversion — checked
8. every slot resolves at stage 0 without visitor assumptions — checked

Plus pipeline checks: every static slot has a content file in every phase-1
locale; every content file is referenced by exactly one slot; no orphans.

This is the point of the layer. Compliance stops being a review ritual and
becomes `pnpm check:content`.

## D — Component Layer

A component renders exactly one content schema, plus its states. The
inventory is derived from the wireframes and the design kit; the schema is
its prop contract.

| Component class | Examples | Input |
| --- | --- | --- |
| Content components | `HeroSection`, `SceneCard`, `ValueStory`, `OfferTier`, `ComparisonTable`, `StepFlow`, `ProofCard`, `PersonCard`, `PartnerMark`, `TrustBlock`, `HowToBlock`, `ContextBand`, `ClosingCta` | one content type |
| Live modules | `PlaceSearch`, `NextDates`, `WeekNearby`, `ActivePlaces`, `LiveCounters`, `EmbedDemo`, `PreviewCalendar` | app API + `live-module-frame` |
| Streams and shells | `ProofStream`, `SectionShell`, `PageShell`, `Header`, `Footer` | composition slot |

Rules:

1. **Components hold no content logic.** Selection, ordering, geo scoring,
   clearance filtering happen in the relevance engine; the component
   receives resolved props.
2. Every component declares four states: loaded, loading (skeleton,
   DEC-033), empty (a conversion occasion, never an error), error.
3. Length budgets are a component property. When a component changes its
   budget, the schema's `max()` changes with it and affected content is
   flagged for regeneration.
4. Styling comes from `@schafe-vorm-fenster/brand` tokens only.
5. A component without a content schema is a layout primitive and belongs
   in the design system, not in this inventory.

## E — Process Layer: Playbooks and Skills

Leafcutter conventions apply: `*.playbook.md` with `name`, `description`,
`layer`, `tags`, `interfaces[]`, `permissions`, phases with quality gates.
Skills are the reusable units playbooks call.

### E.1 The seven processes

| # | Process | Trigger | Output | Gate |
| --- | --- | --- | --- | --- |
| P1 | Source sync | package release or manual bump | resolved source index | schema-valid packages |
| P2 | Mapping | IA change, new route | page compositions + content requests | compliance lint |
| P3 | Generation | open content request | draft content files per locale | schema + budget valid, locales harmonised |
| P4 | Editorial review | draft ready | `approved` status | human decision point |
| P5 | Validation | every commit | pass/fail | `pnpm check:content`, clearance re-checked against installed packages |
| P6 | Publication | merge | built page | build + verification journeys |
| P7 | Update | source package version change | regeneration PR; clearance revocation removes content at once | diff reviewed |

### E.2 The core playbook — `website-content-generation`

This is the one the whole system turns on: one source record in, one
schema-valid content file per locale out.

Interfaces:

| Interface | Required | What it supplies |
| --- | --- | --- |
| `content-request` | yes | route, slot, content type, cardinality, deadline |
| `source-record` | yes | `<package>@<version>#<record-id>`, one or many |
| `target-schema` | yes | the Zod schema — the binding output contract |
| `glossary` | yes | the bound terms, the word to use per locale, the words banned (A.3) |
| `page-context` | yes | focus job, audience order, primary conversion, position on the page |
| `tone-profile` | yes | register, voice, forbidden phrasings |
| `locales` | yes | the locale set, e.g. `["de", "en"]` |
| `length-budget` | yes | per field, from the component |
| `relation-job-guidance` | for selectable types | the relation → job correspondence and the assessment rules (B.5 §2) |
| `proof-binding` | no | claim → proof ids, clearance filter applied first |
| `variant-count` | no | how many alternatives to propose for review |

Phases:

1. **Resolve** — load source records through the adapter; fail loudly on a
   missing record rather than paraphrasing around it.
2. **Extract** — pull the facts the target schema needs; anything the
   source does not carry becomes `UNKNOWN` plus the question, never a
   plausible guess.
3. **Frame** — apply the communication rules: a scene rather than a label,
   one mechanism, no generic claims, the visitor's own words, second
   person, no product names in labels. Terms come from the glossary.
4. **Write** — per locale, from the source record, not from the `de`
   draft; apply the tone profile, the glossary, and the length budget.
5. **Bind proof and facets** — attach cleared proof ids, or emit an
   `empty-proof-slot` with its target id; bindings are shared across
   locales, not chosen per language. For a selectable type, derive the
   `RelevanceFacets` here (B.5): four-level geo through the adapter, job
   relation and `editorial_weight` as assessments with their reasons,
   clearance and `place_bound` from the record. Where a previous version
   of the file already carries an assessment, it is carried forward
   unchanged rather than re-judged.
6. **Harmonise** — compare the locale variants against the contract in
   B.4. Repair left-column divergence; leave right-column divergence
   alone; escalate a genuine argument conflict rather than resolving it.
7. **Emit** — one content file per locale with full `ContentBase`
   provenance, `status: draft`.
8. **Self-check** — Zod parse, budgets, ID resolution, glossary
   conformance, forbidden-phrase scan. Only a passing draft reaches
   review.

Quality gate: schema-valid, budget-compliant, glossary-conformant,
harmonised, provenance-complete drafts in every requested locale — or an
explicit `UNKNOWN` list with the questions that would resolve it.

### E.3 The supporting artefacts

| Artefact | Kind | Purpose |
| --- | --- | --- |
| `adapter-gtm-packages` | adapter | the single place that knows package layout (A.2) |
| `playbook-website-content-mapping` | playbook | IA + wireframes → compositions → content requests |
| `playbook-website-content-generation` | playbook | E.2, the core transformation |
| `playbook-website-content-update` | playbook | package diff → affected content → regeneration PR |
| `skill-website-copy-writing` | skill | the principles as writing rules; the phrasing bans |
| `skill-website-localization` | skill | locale variants; original artifacts stay original |
| `skill-website-locale-harmonisation` | skill | the B.4 contract: align facts and claims, protect idiom, escalate conflicts |
| `skill-website-proof-binding` | skill | claim → proof, clearance as a hard filter |
| `skill-website-content-review` | skill | the eight-point check plus glossary conformance, as a reviewer checklist |
| `foundation-tone-of-voice` | foundation | existing, synced from the hub |
| `foundation-culture-values` | foundation | existing, synced from the hub |

**Where they live.** `.agents/` in this repository, in the
established `playbook-*` / `skill-*` / `adapter-*` folder convention. They
write into that repository and depend on its Zod schemas, so that is their
home; the foundations stay shared and synced from the hub.

Their frontmatter carries the leafcutter schema plus two repository-local
fields, so the pipeline is readable from the artefacts themselves rather
than only from this document:

```yaml
processes: [P3, P7]                    # which of the seven processes it carries
contracts: [proof-card, archive-entry] # which content schemas it reads or writes
```

One caveat to check before the first playbook is written:
`.agents/skills/` in that repository is currently populated by the skills
installer (`skills-lock.json`). Hand-authored entries must survive a
re-sync — either because the installer only manages locked names, or by
keeping authored artefacts in a sibling folder such as
`.agents/playbooks/`.

### E.4 Worked example

A new media echo entry lands: `2026-09-noerd-award.media-echo.md`, type
`[award, conference]`, geo state MV, `usage_rights: cleared`.

1. P1 releases `@schafe-vorm-fenster/media-echo@0.4.0`.
2. P7 diffs against the installed version, finds one new record, and asks
   the mapping playbook which slots accept `media echo → proof-card`.
   Answer: every relevance-selected stream, plus `/ueber-uns/archiv`.
3. P3 runs `website-content-generation` twice — `proof-card` and
   `archive-entry` — for `de` and `en`. Four files. The `de` context line
   frames the award for a municipal reader; the `en` one is written from
   the same record, not translated; the award's own name and the quoted
   headline stay German.
4. P4: the founder approves or rewrites. Status flips to `approved`.
5. P5 validates; P6 builds. The relevance engine decides at render time
   where the card actually appears — no one places it by hand.

## Artefact Register

| Artefact | Format | Where | Authored or generated |
| --- | --- | --- | --- |
| Source records | md + frontmatter | `go-to-market-os/packages/**` | authored |
| Package index | `index.json` | published package | generated at pack time |
| Source schemas | `schema.mjs` | published package | authored |
| Concept documents | md | `go-to-market-os/concept/` | authored |
| Glossary (`GL-###`) | md | `specs/glossary/` | authored |
| Content schemas | Zod TS | `src/domain/content/` | authored |
| Page compositions | TS or YAML | `src/content-map/` | authored |
| Content files | md + frontmatter | `content/<locale>/` | generated, then edited |
| Components | TSX | `src/components/` | authored |
| Playbooks and skills | `*.playbook.md`, `SKILL.md` | `.agents/` | authored |
| Validation | `check:content` | `scripts/` | authored |
| Requirements | STRICT | `specs/` | authored |

## Conventions

- Content id: `<route-segment>-<slot>-<type>` in kebab-case, locale-free.
- File: `content/<locale>/<route>/<slot>.<type>.md`.
- Source reference: `<package>@<version>#<record-id>`.
- IDs from the hub — audiences, conversion goals, offerings, proof — are
  referenced, never redefined (WEB-F-085).
- Interpolation slots are named, not positional: `{place}`, `{county}`.
- Terms come from the glossary; a term used in copy that the glossary does
  not carry is a finding, not a preference (A.3).

## Order of Work

1. **Schema catalogue** — walk the eight wireframe screens field by field
   and turn B.3 into real Zod schemas with real budgets. This is the
   longest step and everything else waits on it.
2. **One composition** — `/dein-kalender`, the commercially heaviest page,
   as the proof that Layer C carries.
3. **Component inventory** — name every component against a schema; mark
   which ones the design kit already covers.
4. **The core playbook** — E.2, with one interface set, run manually.
5. **Pilot** — one media echo record end to end, `de` + `en`, as in E.4.
   Measure how much editorial rework the draft needs; that number decides
   how much prompt work the playbook still owes.
6. **Scale** — remaining compositions, then `check:content` in CI, then P7.

Nothing before step 1 produces copy: the project rule stands, page copy is
written after the specification phase.

## Open Points

- [ ] **Register per job.** The tone-of-voice foundation says informal `Du`
      by default, but `/dein-kalender` and `/deine-region` address
      Verwaltungen with `Sie` in the wireframes. The tone profile must be
      resolvable per audience and job. Where is that mapping decided —
      here, in `audiences/`, or in the foundation?
- [ ] **Glossary columns.** The `GL-###` register carries meanings, not
      copy words. Before generation can rely on it, every entry needs a
      use-this-word and an avoid-this-word column per locale (A.3). Who
      fills them, and does the register stay in `specs/` once it becomes a
      production input rather than a specification aid?
- [ ] **Demands against TS-005 and DEC-041** — decided here, still to be
      carried into the engine spec by the session that owns it:
      DEC-041 §1 and TS-005 D1 (six tiers incl. state and different
      country, plus TS-005-A1); DEC-041 §2 (relation, not audience, is the
      job dimension); TS-005 D3 (rename `alien`); TS-005 D5 (one weight
      profile per focus job); TS-005 D8 (segment at community, not
      municipality). None of them touch geo-api#165 — neighbourhood tiers
      stay out of scope.
- [ ] **Cache cost of community segmentation.** Accepted in principle
      (B.5 §1). Measure it before launch: how many segments does a full
      German place list actually produce, and does `cacheLife` hold at
      that cardinality?
- [ ] **Assessment drift.** `job_relation` and `editorial_weight` are set
      once and carried forward. Over a year of regenerations, nobody
      re-reads them. Needs a review trigger — an age, a package major
      version, or a periodic sweep — or the site quietly orders itself by
      judgements nobody still holds.
- [ ] **Length budgets.** They come from the components, which do not exist
      yet. Interim: take them from the wireframes at 390 px and mark them
      provisional in `describe()`.
- [ ] **Update trigger mechanics** — unresolved as Q-018 in the website
      specs. Options: release webhook, scheduled dependency check, manual.
- [ ] **`en` proof context.** Generating from the record rather than
      translating assumes the record carries enough for a second framing.
      Verify on the pilot — and measure how much the harmonisation step
      actually has to repair. If it repairs a lot, parallel generation is
      the wrong trade and translation-plus-adaptation wins.
- [ ] **Composition format.** TypeScript (typed, refactorable) or YAML
      (editable without a build). Recommendation: TypeScript, because the
      slots reference Zod schemas.
- [ ] **Variant handling.** Whether generation proposes alternatives per
      slot by default, and who chooses.
- [ ] **Missing source fields.** `geo` on proof is the one that still
      binds: without it a proof element cannot be placed on the scale at
      all and falls to tier 6. `audiences` on media echo has become the
      lesser demand — job relation is assessed rather than derived
      (B.5 §2), so a missing audience tag no longer blocks the facet.
      Both handled by A.2 rule 5 — marked missing, claim weakened,
      demand registered, pipeline running. Open is only where the demand
      register lives, so the gaps stay countable.
- [ ] **Anecdote records.** Anecdotes come from the hub like everything
      else, but the records are not consolidated yet: the bakery van and
      the Flechtorf evening currently sit spread across intake and post
      material. Cleanup happens in the hub. Until it does, type 14
      generates from whichever record exists and marks the rest missing.
