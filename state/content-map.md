# Content Map — Phase 1 (Source Mapping)

Produced by Content & Translation, playbook `playbook-content-production`,
Phase 1 only. Maps every content slot the eleven page specs
(`specs/tactical/pages/*.tactical.md`, TS-019…TS-029) require to a hub
source (`package@version#record-id`, quoting the locator field) or marks
it `Dummy-Content` with a one-line note on what generated placeholder it
needs. Phase 2 (primary copy), Phase 3 (translation) and Phase 4
(validation/handoff) follow in M3; this file is their starting point.

## Pipeline contract (M3 developer → Content & Translation)

The loader reads the shipped shape **as is** — no rewrite of the eleven
pages is needed (ADR-074 §1, closes `state/open.md` #43). What follows is
what `pnpm check:content` now enforces, so the next content pass writes
against a checked contract rather than a convention.

**The slot comment.** Keys: `id`, `content_type`, `provenance`,
`derived_from`, `status`, `demo`. An unknown key fails. `derived_from`
takes `[ia]`, `[]`, or a comma-separated list of quoted refs.

**`content_type`** is concept B.3's 26 types plus `section` (the generic
prose block B.3 lacks). Four spellings are normalised on read and may stay
as written: `form → form-step`, `tier → offer-tier`,
`profile → person-profile`, `configuration → site-config`.

**`provenance`** is one of five: `sourced`, `generated`,
`sourced-empty-by-design`, `withheld`, `mixed`. `demo: true` is separate
and is what puts the `Demo-Daten` badge on the module — a slot that is
`generated` without `demo` renders **without** a badge, which is right for
an editorial choice (the stage-0 reference place, the accessibility
statement) and wrong for invented demo data. Four slots currently sit in
that state and warn: `mitmachen-6a-reference-place`, `mitmachen-8-closing`,
`registrieren-2-wer`, `rechtliches-4-accessibility-note`.

**`derived_from`** accepts `<package>@<version>#<record-id>`, `ia`, and
`<package>@<version>` (a whole-package pool, as `home-8-proof-stream` uses).
The exact installed version is checked against `node_modules`, and the
record id against the package's `index.json` — for `media-echo`, whose
entries carry no `id`, the file stem is the id. **An empty list is correct
for `generated` + `demo: true`** (invented content derives from nothing;
`[ia]` there would claim the IA as its source). An empty list on a
`sourced` slot is an error.

**Two things the pipeline needs from the next content pass:**

1. **Field labels are translated** (`**Sucheingabe (Placeholder):**` vs
   `**Search input (placeholder):**`), so a page cannot address a field by
   its label across locales. Pages therefore read fields **by position**,
   and `check:content` fails a locale whose block sequence differs from
   `de`. Keeping the DE and EN block order identical is now a hard
   requirement; adopting locale-stable label keys would be better
   (`state/open.md` #61).
2. **A bold sentence is prose, a field needs the colon.** `**Label:** value`
   is a field; `**Ein ganzer Satz.** Weiterer Text` is a paragraph. Both
   render, but only the first is addressable.

**What is checked per file:** frontmatter against `PageFrontmatterSchema`
(the `page_id` must be the `TS-###` the route table gives the route —
TS-017-A14), unique slot ids, every `derived_from` resolvable, a `de` and an
`en` sibling per page, and locale siblings agreeing on slot set, records,
provenance and block sequence. Wording, length and sentence count may differ
— that is what generating per locale is for.

**Not checked yet** (each blocked on an artefact that does not exist):
length budgets, clearance re-validation, hub-id resolution, composition slot
binding, segment independence, glossary conformance, legal anchors. See
`src/lib/content/README.md`.

## How to read this map

- **Copy shells** (headlines, CTA labels, scene openers, empty-state
  microcopy) that carry no factual claim are sourced against the page's
  own tactical spec and the IA concept documents (SRC-002
  `website-relevance-model.concept.md`, SRC-003
  `website-information-architecture.concept.md`) — per TS-007 D6 these
  declare `derived_from: [ia]` rather than a hub record. They are
  **Sourced**, not `Dummy-Content`: the brief exists, only the sentence
  does not yet.
- **Claims, numbers, names, proof and testimonials** must resolve to a
  hub record (`derived_from` = the actual record) or the slot is
  `Dummy-Content`.
- **Proof/testimonial slots gated by clearance** (`usage_rights` not
  `cleared`) are a **third, distinct case**: the communication
  principles (SRC-001 rule 4) and TS-007 D2/TS-005 D5 forbid filling
  them with invented or paraphrased content — the slot stays empty and
  the claim is weakened. These are marked **Sourced — empty by design**
  in this map, not `Dummy-Content`, because generating a substitute
  would violate the guardrail. Where the underlying gap is a hub
  clearance/data gap rather than a copy gap, it is additionally flagged
  as a hub demand (Q-### cross-reference) rather than registered as
  `Dummy-Content` in `state/open.md`.
- Proof/testimonial **pools** (which ids are eligible for a slot) are
  resolved here; the *specific* element shown is selected at
  build/runtime by the relevance engine (TS-005) from that pool — this
  map does not re-decide selection, only whether the pool has any
  cleared member.
- Legal page: source is the Google-Docs import path
  (`content/legal/` + `import.yaml`, `pnpm import:legal-content`), per
  TS-007 D10 — outside hub packages entirely, imported and validated,
  never generated by this playbook.

## Artifact shape (TS-007, for Phase 2)

**Update, Phase 2, 2026-09-11 — this section is now authoritative for
what was actually shipped, not only for the target state.** TS-007 D4
fixes one generated file per **slot** per locale
(`content/<locale>/<route>/<slot>.<type>.md`), but the reshaped 26-type
schema and the `derived_from[]`/`RelevanceFacets` fields it depends on
have not landed in `src/domain/content-frontmatter.schema.ts` yet (still
the pre-relaunch 8-type schema, see TS-007 D5's own migration table).
Writing 78 tiny per-slot files against a schema that cannot yet validate
their shape would not be checkable and would not match what M1/M3 code
builds against today. Content & Translation therefore used the
explicitly offered fallback: **one file per page per locale**,

```
content/pages/<route-slug>/de.md               ← generated, then edited (nested to match the route tree)
content/legal/<locale-flat>/<doc>.md           ← imported, not generated (content/legal/ is flat today, TS-029 open point 8)
```

with one Markdown section per content slot from this map, in page-spec
composition order, and a per-slot inline HTML comment carrying the
slot-level metadata that TS-007 D4/D6 would otherwise put in the file's
own frontmatter (`<!-- id: …; content_type: …; provenance: …;
derived_from: […]; status: … -->`) — page-level YAML frontmatter cannot
carry one `provenance`/`derived_from` per slot when slots differ (a page
is typically "mixed": some slots sourced, some sourced-empty-by-design,
a few generated). Page frontmatter carries a best-effort superset: the
pre-relaunch schema's required fields (`id`, `content_type` — `section`
for all eleven pages, `legal` for the one new legal file; `status:
draft`; `locale: de`) plus TS-007-shaped extras (`page_id` TS-###,
`route`, `derived_from[]`, `generated_by`, `generated_at`, `provenance`,
`tone_profile: du-everywhere`, `compliance_check`, `open_points`).
`pnpm check:frontmatter` is green on all twelve new files — but only
because Zod's default (non-strict) object parsing silently drops
unknown top-level keys, which is not the same as TS-007 D12 actually
resolving `derived_from` or checking facet completeness. `content_type:
section` is a stopgap: no content-type vocabulary (old 8 or planned 26)
defines a whole-page composite type. All of this is registered as
`state/open.md` #43 for the M3 pipeline developer, who should confirm
whether to keep one-file-per-page or migrate to TS-007 D4's
one-file-per-slot shape once the schema is reshaped.

The paragraphs below describe the **target** shape (TS-007 D4/D5/D6/D7)
that the pipeline should converge on; they are kept for that purpose,
not because Phase 2 built against them directly.

```
content/<locale>/<route>/<slot>.<type>.md      ← generated, then edited
content/legal/<locale>/<doc>.md                ← imported, not generated
```

- Content id: `<route-segment>-<slot>-<type>`, kebab-case, **locale-free**
  — the `de` and `en` files of one slot share one id (TS-007 D4).
- Required frontmatter (TS-007 D1/D5/D6/D7/D11), once the schema is
  reshaped from today's `src/domain/content-frontmatter.schema.ts`
  (pre-relaunch taxonomy, still 8 types) to the 26-type hierarchy of
  concept B.3:
  - `id`, `content_type` (one of the 26 types), `status`
    (`draft` → `in-review` → `approved`; this run only ever emits
    `draft` — D11), `locale`
  - `derived_from[]`: `<package>@<version>#<record-id>` per hub record
    actually used — **the exact installed version**; copy shells with
    no source record declare `derived_from: [ia]` (D6)
  - `generated_by`: `<playbook>@<version>` — for this run,
    `playbook-content-production@<version>`
  - `generated_at`: ISO date of the draft
  - selectable types (proof-card, quote, value-story, tier reassurance,
    …) additionally carry the full `RelevanceFacets` fragment (`geo`,
    `job_relation` + reason, `editorial_weight` (+ reason if
    non-default), `clearance`, `place_bound`) — D7
- `TS-###` is not itself a frontmatter field in TS-007's schema; the
  binding to a spec is carried through `derived_from: [ia]` plus the
  route/slot path, which is how a generation agent traces a file back
  to the tactical spec that named the slot (this map is the traceability
  table until the schema formalizes a field for it — flagged as an
  assumption, not a TS-007 determination).
- The pre-relaunch schema currently in the repo (`catalog`, `collection`,
  `configuration`, `legal`, `media`, `messaging`, `profile`, `section`)
  is not the target; it is being reshaped in parallel (M3 code
  foundation). This map's `content_type` column already uses TS-007's
  26-type vocabulary where a slot maps cleanly (`hero`, `objection-list`,
  `publishing-path`, `live-module-frame`, `proof-card`, `value-story`,
  `howto-block`, `context-band`, `closing-cta`, `legal-section`) so
  Phase 2 can write straight into the reshaped schema once it lands.

---

## TS-019 — Home (`/`)

| # | Slot | Content type | Source | Note |
| --- | --- | --- | --- | --- |
| 1 | Block 1 / S1 search headline + placeholder | copy shell | IA (SRC-003 §home, TS-019 D2) | Restricted to ZIP-only search until Q-025 (geo-api name search) lands; copy must say so. |
| 2 | Block 1 / S2 "dates in `<place>`" label + CTA label | copy shell | IA (TS-019 D2, D5 position 1) | Place name and dates are live data, not authored copy. |
| 3 | Block 1 / S3 "nothing this week nearby" invitation | copy shell | IA (TS-019 D2 S3, SRC-002 empty-place framing) | Distinct wording from `/dein-ort` state B and `/dein-ort/starten` (see TS-020/TS-021 rows) — this is the "in-place" scene, own copy. |
| 4 | Scene 1 — WhatsApp mechanism ("aha" question) | `value-story`/scene copy | `@schafe-vorm-fenster/messaging@0.1.0#actors--community-calendar` field `relievers[0]` ("send a photo of the printed flyer by WhatsApp and the date is created from it") | One mechanism per TS-006 D7; reliever is the source claim. |
| 5 | Scene 2 — embed mechanism ("own calendar, own name") | `value-story`/scene copy | `@schafe-vorm-fenster/messaging@0.1.0#municipalities--portalize-calendar` field `gains`/`relievers` ("our own design and our own selection, without our own system") | |
| 6 | Scene 3 — provenance ("who built this") | `value-story`/scene copy | `@schafe-vorm-fenster/proof@0.3.5#founder-former-volunteer-mayor` (claim, cleared) + `@schafe-vorm-fenster/people@0.3.6#jan-henrik-hempel` | Cleared — usable without a Dummy-Content fallback. |
| 7 | Block 2b — "who built this" provenance stamps | copy shell + proof | same as row 6 | |
| 8 | Block 2c — proof stream, 5 elements (DEC-048) | `proof-card` pool | Pool: `@schafe-vorm-fenster/proof@0.3.5` full set (20 ids) + `@schafe-vorm-fenster/media-echo@0.3.3` (32 verified entries, 0 with `usage_rights` today) | Sourced — empty-slot risk: media-echo entries all lack `usage_rights` (Q-045, already on `state/open.md` #1); proof-package entries include 8 `cleared` ids. Selection is TS-005's job, not this map's. |
| 9 | Block 2d — live counters label | copy shell | IA (TS-019 D5) | Today only the *dates* figure renders (Q-037); "places"/"updates today" fields absent from `/api/stats`. |
| 10 | Context band (3 non-focus jobs) | copy shell | IA (SRC-003, TS-006 D5) | Standard job labels, shared across pages — see TS-006 (out of this run's scope) for the canonical job names. |
| 11 | Closing CTA | copy shell | mirrors block-1 primary, no new copy | |

**Page total: 11 slots — 9 Sourced, 2 Sourced-empty-by-design (proof pool depends on clearance), 0 Dummy-Content.**

---

## TS-020 — Your Place (`/dein-ort`)

| # | Slot | Content type | Source | Note |
| --- | --- | --- | --- | --- |
| 1 | Block 1 state A headline ("place name + next dates") | copy shell | IA | live data, not authored |
| 2 | Block 1 state B headline ("nothing entered in `<place>` yet — you could be the first") | copy shell | SRC-002 (`website-relevance-model.concept.md`, quoted verbatim in TS-020 D2/DEC-071) | Direct address is deliberate and specific to this page (TS-021 forbids the same sentence). Quote, do not paraphrase. |
| 3 | Value story 1 — bakery van (aspect + why it matters) | `value-story` | IA (SRC-003) for narrative frame; example-place data live; testimonial pool below | |
| 3a | — testimonial candidate | proof | Pool: `@schafe-vorm-fenster/proof@0.3.5#kurzweg-baeckerei` (`unverified`) | **Sourced — empty by design.** Not cleared; per SRC-001 rule 4 the slot renders 3-part (no quote), never a substitute. Hub demand: Q-014. |
| 4 | Value story 2 — council meeting | `value-story` | IA; cleared backing `@schafe-vorm-fenster/proof@0.3.5#impftermine-landkreis` (`cleared`) | Backing example cleared; testimonial candidate `zschiesche-gross-kiesow` is `unverified` → testimonial part empty by design. |
| 5 | Value story 3 — culture nobody would have searched for | `value-story` | IA; no cleared backing anecdote at all (`kulturlandbuero-broellin`, `eichler-wasserschloss-quilow` both `unverified`) | **Sourced — empty by design**, and per TS-020 open points this story "carries no evidence at all" without a culture date in the place. Hub demand: Q-014. |
| 6 | Value story 4 — fifteen-minute radius | `value-story` | IA; cleared backing `@schafe-vorm-fenster/proof@0.3.5#regional-footprint` (`cleared`); testimonial `wendt-rubkow` `unverified` | Testimonial part empty by design. |
| 7 | Homescreen block (iOS/Android instructions) | `howto-block` | IA (SRC-003) | Generic instructional copy, no claim. |
| 8 | CTA reassurance ("permanence promise") | copy + proof | `@schafe-vorm-fenster/offerings@0.3.3#community-calendar` price note ("Permanent, not an introductory tier") | Backing exists in the offering package directly (not media-echo) — usable. |

**Page total: 8 slots — 5 Sourced, 3 Sourced-empty-by-design (value stories' testimonial parts), 0 Dummy-Content.**

---

## TS-021 — `/dein-ort/starten`

| # | Slot | Content type | Source | Note |
| --- | --- | --- | --- | --- |
| 1 | Block 1 — acknowledgment with place name | copy shell | IA | live query-param echo, escaped |
| 2 | Block 2.1 — "what it takes" (WhatsApp, one person, one flyer, free, permanent) | copy + proof | `@schafe-vorm-fenster/offerings@0.3.3#community-calendar` price note (permanence, "2022 public commitment") | TS-021 D2 cites "the 2022 commitment" (TS-006 D10) — same commitment as TS-020 row 8. |
| 3 | Block 2.2 — live example, nearest **active** place | copy shell + live data | IA; place-bound proof optionally attached via TS-005 pool (see TS-022 row for the same "reference place" gap) | Headed "example", never "your place" (D7). |
| 4 | Block 2.3 — "who usually starts it" (Verein, Feuerwehr, Kirche, Gemeinde scene) | scene copy | `@schafe-vorm-fenster/audiences@0.3.3#actors` (Context: "Vereine, Feuerwehr, Kirchengemeinde, Initiativen, Kulturbetriebe, mobile Dienste") | Direct source — the audience record's own enumeration. |
| 5 | Block 2.4 — place search microcopy | copy shell | IA, same component as elsewhere | |
| 6 | Tone/voice for the "founding" framing (D9) | copy shell | IA (SRC-002/DEC-071 comparison table) | Governs register only — no separate content slot beyond rows above. |

**Page total: 5 slots — 5 Sourced, 0 Dummy-Content.**

---

## TS-022 — `/mitmachen`

| # | Slot | Content type | Source | Note |
| --- | --- | --- | --- | --- |
| 1 | Hero — WhatsApp scene + primary CTA | `hero` | `@schafe-vorm-fenster/messaging@0.1.0#actors--community-calendar` (`headline`, `relievers[0]`) | |
| 2 | Objection block — "why the six current channels fail" | `objection-list` | `@schafe-vorm-fenster/audiences@0.3.3#actors` field `Problem` ("typed into six channels by hand") + `@schafe-vorm-fenster/messaging@0.1.0#actors--community-calendar` field `pains[]` (5 items: flyer boundary, print deadlines, own-channel-only reach, no time, new-tool friction) | Spec forbids asserting a channel *count* ("six" is figurative in the audience record) — block states the pains it has (5 items from `pains[]`), no enumeration claim. Fully sourced, no Dummy-Content needed despite the open point flagging the "six" ambiguity. |
| 3 | Publishing path 1 — WhatsApp | `publishing-path` | `@schafe-vorm-fenster/offerings@0.3.3#community-calendar` (`availability: generally-available`) | |
| 4 | Publishing path 2 — calendar connection | `publishing-path` | `@schafe-vorm-fenster/offerings@0.3.3#community-calendar` (`generally-available`) | |
| 5 | Publishing path 3 — website import | `publishing-path` | `@schafe-vorm-fenster/offerings@0.3.3#community-calendar` (hub-recorded as **alpha** — status badge required, not `generally-available`) | Content must render the status badge per D4; not itself a Dummy-Content case, it's an honesty constraint on sourced copy. |
| 6 | Live example module label ("in `<place>`") | copy shell + live data | IA | |
| 6a | Stage-0 reference place (unnamed) | configuration, not copy | **Dummy-Content** | No source names which covered place with dates + cleared place-bound proof serves as the stage-0 default (TS-022 open points: "the stage-0 reference place is unnamed"). Generate: pick one real, currently-covered, dated place as a configuration value (not invented data — an actual place already in the app), and register the choice as an editorial assumption, not fictitious content. Flagged in `state/open.md`. |
| 7 | Proof block (3 elements, publish-weighted) | `proof-card` pool | Pool: `@schafe-vorm-fenster/proof@0.3.5` (job-fit `publish-our-dates` weighting, TS-005 D5) | Sourced — empty-slot risk same as elsewhere depending on clearance draw. |
| 8 | CTA label + permanence-promise reassurance | copy + proof | **Dummy-Content** | TS-022 D7/open points: "the permanence promise has no element in `@schafe-vorm-fenster/proof`" — the 2022 commitment lives only in `media-echo` (itself `usage_rights`-less, Q-045), referenced loosely from the offering. Until a proof element exists or TS-005 accepts a media-echo element here, the reassurance text has no citable backing. Generate an on-voice, generic reassurance sentence with no invented number/date, `provenance: generated`. |
| 9 | Cross-link to `/dein-kalender` (one sentence) | copy shell | IA (TS-022 D9) | |

**Page total: 9 slots — 6 Sourced, 1 Sourced-empty-by-design, 2 Dummy-Content.**

---

## TS-023 — Register (`/mitmachen/registrieren`)

| # | Slot | Content type | Source | Note |
| --- | --- | --- | --- | --- |
| 1 | Step 1 — "which place" question + search microcopy | copy shell | IA | |
| 2 | Step 2 — "who publishes" question + options | copy shell / enum labels | **Dummy-Content** | TS-023 D2: vocabulary is **UNKNOWN** — "no source defines the list; the app's account model owns it." Cannot even be IA-sourced since the option set itself is undefined. Generate a minimal, clearly generic placeholder option set (e.g. "Verein/Initiative", "Gemeinde/Verwaltung", "Einzelperson", "Sonstiges") marked `provenance: generated`, to be replaced once the app team publishes the real enum (open point, app team). |
| 3 | Step 3 — "which publishing path" question + 3 options | copy shell | `@schafe-vorm-fenster/offerings@0.3.3#community-calendar` (same three mechanisms as TS-022 rows 3–5) | |
| 4 | Step indicator microcopy ("Schritt 2 von 3") | copy shell | IA | |
| 5 | Handover button label + what-happens-next note | copy shell | IA (WEB-F-087: content phase may only say what the app will ask next in generic terms, since no prefill contract exists) | |

**Page total: 5 slots — 4 Sourced, 1 Dummy-Content.**

---

## TS-024 — `/dein-kalender`

| # | Slot | Content type | Source | Note |
| --- | --- | --- | --- | --- |
| 1 | Focus block — ownership headline + both CTAs | `hero` | `@schafe-vorm-fenster/messaging@0.1.0#municipalities--portalize-calendar` (`headline`: "Our calendar is current again — and nobody here maintains it.") | |
| 2 | Contrast block — 4 rows (today vs. with the product) | copy, derived | `@schafe-vorm-fenster/offerings@0.3.3#portalize-calendar` `summary`/category + `@schafe-vorm-fenster/messaging@0.1.0#municipalities--portalize-calendar` `pains[]`/`gains[]`/`relievers[]` | TS-024 D4: derive four rows from these fields, never copy verbatim, never add a fifth. |
| 3 | Embed-demo heading (states radius/filter, labelled "example") | copy shell + live module | IA | Labelled example until Q-026 (loader place-filter) lands. |
| 4 | Tier 1 — "your village" (community-calendar) | `tier` copy | `@schafe-vorm-fenster/offerings@0.3.3#community-calendar` (`price.note`: permanence statement, not a price) | |
| 5 | Tier 2 — "under your name" (portalize-calendar), incl. the one "Portalize" mention | `tier` copy | `@schafe-vorm-fenster/offerings@0.3.3#portalize-calendar` (`price`: 480/EUR/year/vat excluded) | Price token sourced from the package, never typed (D8); "Portalize" appears exactly once here (D7). |
| 6 | Tier 3 — "for a whole region" (portalize-enterprise) | `tier` copy | `@schafe-vorm-fenster/offerings@0.3.3#portalize-enterprise` (`price_status: on-request`) | "Auf Anfrage" only — the internal 4.000 € figure (in the package) must never render (D6, guarded by A10/A11). |
| 7 | Proof block, 3 elements, sell-weighted, with images | `proof-card` pool | Pool biased to `@schafe-vorm-fenster/offerings@0.3.3#portalize-calendar` field `proof[]`: `kulturlandbuero-broellin`, `eichler-wasserschloss-quilow`, `zschiesche-gross-kiesow`, `wendt-rubkow` (all `unverified` today) | **Sourced — empty by design**, and thin: TS-024 open point #7 flags this pool as the page's weakest ("five proof records still unverified, Q-014"); with images, an uncleared image renders the "Foto gesucht" placeholder treatment, never a borrowed photo. |
| 8 | Trust block — data protection sentence | copy | TS-013 D1/D2 claim set (technical spec, not hub content) | In scope of code foundation, not this playbook, but the *sentence itself* is content this run must write once TS-013's claim set is confirmed. |
| 8a | Trust block — operations sentence | copy | **Dummy-Content** | TS-024 D10 / open point #1: "UNKNOWN — no source. No sentence ships without a hub record behind it." Cannot ship even as placeholder without inventing an operational fact — mark as withheld rather than generated (see note below), registered in `state/open.md`. |
| 8b | Trust block — AI-use sentence | copy | **Dummy-Content** | Same as 8a: "UNKNOWN — no source," same rule. Ships as data-protection-only per D10 until a hub record exists. |
| 9 | Local advertising: explicit **absence** check | n/a | `@schafe-vorm-fenster/offerings@0.3.3#local-advertising` (`promotion: withheld`) | Not a content slot to write — a negative constraint to verify (D11): zero occurrences. |

**Page total: 9 authored slots — 6 Sourced, 1 Sourced-empty-by-design, 2 Dummy-Content (withheld rather than generated — see note).**

Note on 8a/8b: unlike other `Dummy-Content` rows, TS-024 D10 explicitly
forbids shipping *any* sentence without a hub record ("no sentence ships
without a hub record behind it") — stronger than the general
dummy-content rule's "claims stay generic." Content & Translation's
assumption: the trust block ships **without** the operations/AI
sub-claims until `jan-henrik`/gtm supplies a record (per TS-024 open
point #1), rather than generating placeholder sentences that could read
as real operational claims. Registered as `Dummy-Content` because the
*slot* (a promised sub-section of the block) is unfilled, not because
generated text will fill it.

---

## TS-025 — Order the Calendar (`/dein-kalender/bestellen`)

| # | Slot | Content type | Source | Note |
| --- | --- | --- | --- | --- |
| 1 | Step 1/2 — scope selection microcopy (places/postcode/county) | copy shell | IA | |
| 2 | Briefing exit link label | copy shell | IA | Points at the configured Google Calendar URL (config, not content). |
| 3 | Step 3 — invoice form field labels (Körperschaft, Amt, Rechnungsanschrift, Ansprechperson, Bestellzeichen, Leitweg-ID, USt-IdNr.) | `form` labels (ux-writing) | TS-025 D6 (field set is itself a spec determination — "a row of the Q-022 demand") | Field *set* is fixed by the spec; label wording is ux-writing, not a hub claim — Sourced against the spec. |
| 4 | Step 4 — embed code presentation copy ("kopiere den Code jetzt") | copy shell | IA (TS-025 D8) | |
| 5 | Step 4 — confirmation / "code follows separately by email" note | copy shell | IA (TS-025 D7 — contingent on Portalize's synchronous-issuance answer, Q-026 extension) | If issuance cannot be synchronous, copy must say when the code arrives — wording is content-phase, contingent on an open system question, not a source gap. |

**Page total: 5 slots — 5 Sourced, 0 Dummy-Content.** (This page's blockers — Q-026 organizer provisioning, Q-022 envoy order-form contract — are system/mock gaps for the code-foundation track, not content gaps; no page copy is blocked on them, only which branch of D7/D5 ships.)

---

## TS-026 — `/deine-region`

| # | Slot | Content type | Source | Note |
| --- | --- | --- | --- | --- |
| 1 | Block 1 — map-story opener scene (embedded calendar mechanism) | `hero`/scene | `@schafe-vorm-fenster/messaging@0.1.0#counties--portalize-enterprise` (`headline`: "The whole district on one map, without a portal project.") | |
| 2 | Block 2 — the territory question ("what is near me" at county scale) | copy | `@schafe-vorm-fenster/messaging@0.1.0#counties--portalize-enterprise` `pains[]` (chronological-list argument, administrative-boundary argument) | |
| 3 | Block 3 — interim module labels (examples, counters, search) | copy shell + live data | IA; example pool `@schafe-vorm-fenster/offerings@0.3.3#portalize-enterprise` reference customers not yet public | Capped at 6, "examples" never "most active" (D4). |
| 4 | Block 4 — embed demo heading | copy shell | IA, shared component with TS-024 row 3 | |
| 5 | Block 5 — "what it adds" (territory cut, map view, custom-data-integration add-on) | copy | `@schafe-vorm-fenster/offerings@0.3.3#portalize-enterprise` `summary` + D3a (map ships January 2027, DEC-061) + `@schafe-vorm-fenster/offerings@0.3.3#custom-data-integration` (`summary`, mention-only, no CTA) | Map must be named as **dated, forthcoming** (Jan 2027), never as shipping today (D3a). |
| 6 | Blocks 6–7 — proof (3 elements) + quote CTA response promise | `proof-card` pool + copy | Pool: `@schafe-vorm-fenster/offerings@0.3.3#portalize-enterprise` `proof[]` (`eichler-wasserschloss-quilow`, `partner-network`, both `unverified`) | **Sourced — empty by design**; open point flags "no reference case for a delivered territory exists, and none is simulated" — confirms no Dummy-Content substitute is permitted here either. |
| 7 | Response-time promise wording ("two working days") | copy | **Dummy-Content — conditional withhold** | TS-026 D5: ships **only** when Q-022/C11 (a named handling process with a named owner) is answered; until then the constant is `null` and the wording is entirely absent — not generated at all. Registered so the follow-up workstream tracks it once C11 resolves. |
| 8 | Enterprise pricing display ("auf Anfrage") | copy | `@schafe-vorm-fenster/offerings@0.3.3#portalize-enterprise` (`price_status: on-request`) | |

**Page total: 7 authored slots — 5 Sourced, 1 Sourced-empty-by-design, 1 Dummy-Content (withheld pending a system precondition, not generated text).**

---

## TS-027 — `/ueber-uns`

| # | Slot | Content type | Source | Note |
| --- | --- | --- | --- | --- |
| 1 | Origin block — h1 "Gebaut in einem Dorf, betrieben aus einem Dorf." | `hero`/section copy | TS-027 D3 (fixed wording, DEC-036 §3) — an IA-fixed headline, not paraphrasable | |
| 2 | Origin block — causal chain (village size → free calendar → 480€ licence) | copy | `@schafe-vorm-fenster/offerings@0.3.3#community-calendar` (free, "forever") + `@schafe-vorm-fenster/offerings@0.3.3#portalize-calendar` (480/EUR/year) | Price strings read from package, never typed. |
| 3 | Origin block — honorary-mayor sentence | claim + proof | `@schafe-vorm-fenster/proof@0.3.5#founder-former-volunteer-mayor` (`cleared`) | Cleared, directly usable. |
| 4 | Origin block — founder photo | image | `@schafe-vorm-fenster/people@0.3.6#jan-henrik-hempel` assets (`2020-portrait-working-on-the-go.jpg`, `2021-workshop-quilow-portrait.jpeg`) | If a specific photo doesn't match a claim, apply design-system "Nicht motivgenau · Platzhalter" badge — not a Dummy-Content case, an image-honesty rule. |
| 5 | Operating counters — "years in operation" + live active-places count | claim + live data | `@schafe-vorm-fenster/proof@0.3.5#in-operation-since-2018` (`cleared`) | |
| 6 | Proof stream, 7 elements incl. 1 type-reserved (`testimonial`) | `proof-card` pool | Pool: `@schafe-vorm-fenster/proof@0.3.5` full set + `@schafe-vorm-fenster/media-echo@0.3.3` | **Sourced — empty by design.** All 5 testimonial-type proof records are `unverified` (Q-014) — the reserved slot renders empty by spec design (D5), never backfilled. This is the page's sharpest and most deliberate empty slot. |
| 7 | Archive block — one link, no preview copy | copy shell | IA (TS-027 D6) | |
| 8 | Team block — profiles | `profile` | `@schafe-vorm-fenster/people@0.3.6#jan-henrik-hempel`, `@schafe-vorm-fenster/people@0.3.6#christian-sauer` (`role`, `bio_short` fields) | Christian Sauer's portrait is `license: unverified` — usable per package but flagged for clearance re-check at build (TS-007 D12 check 4), not a content gap. |
| 9 | Newsletter block — signup copy | copy shell | IA; mechanism gated by Q-020 (no sending system decided) | If Q-020 unresolved at launch, block does not ship (D8) — not a copy gap, a system gap. |

**Page total: 9 slots — 7 Sourced, 1 Sourced-empty-by-design, 0 Dummy-Content.**

---

## TS-028 — Archive (`/ueber-uns/archiv`)

| # | Slot | Content type | Source | Note |
| --- | --- | --- | --- | --- |
| 1 | Page heading + intro (h1 only, per D1 "no lead paragraph selling the record") | copy shell | IA | Minimal — the page is deliberately argument-free (D1). |
| 2 | Archive rows (one per cleared media-echo entry, generated) | `archive-entry` | `@schafe-vorm-fenster/media-echo@0.3.3#verified/*` (32 entries) | **Sourced — empty by design, at scale.** 0 of 32 entries carry `usage_rights` today (measured 2026-09-11, matches `state/open.md` #1, Q-045); per TS-007 D2 an absent field is not an assertion of clearance, so under WEB-F-033 **every** entry is currently uncleared and the page renders with zero rows. Not `Dummy-Content` — inventing press coverage is explicitly forbidden; this is a hub-clearance blocker already tracked as Q-045/open-point #1. |
| 3 | Per-entry localized context line | `archive-entry` field | `@schafe-vorm-fenster/media-echo@0.3.3` (`title`, `type`, `date`, `source`, `geo`) — one context line generated per entry once cleared | Generated per TS-007 D3 build-time step (not per-page hand-authoring); this map registers the mechanism, not per-entry Dummy-Content, since it's mechanical translation of existing metadata, not invention. |
| 4 | Type filter chip labels | copy shell (localized labels over hub vocabulary) | `@schafe-vorm-fenster/media-echo@0.3.3` types (`press`, `award`, `conference`, `podcast`, `portrait`, `recognition`, `social-media`) | Identifiers from the hub, labels localized per TS-007 D8. |

**Page total: 4 slots — 2 Sourced, 2 Sourced-empty-by-design (blocked entirely on the Q-045 clearance gap, already registered), 0 Dummy-Content.**

---

## TS-029 — `/rechtliches` (EN `/legal`)

| # | Slot | Content type | Source | Note |
| --- | --- | --- | --- | --- |
| 1 | `#impressum` / `#imprint` | `legal-section` | `content/legal/imprint.md` via `import.yaml` doc `1yNedBUBjkUnqrWCICi02NzwYs7Vp1mftVolAg26G2ZU`, `pnpm import:legal-content` | Imported, not generated (TS-007 D10) — this playbook never rewrites it. |
| 2 | `#datenschutz` / `#privacy` | `legal-section` | `content/legal/privacy-policy.md` via `import.yaml` doc `1jvjBhxtEsl7RPY3AXQ-Lqpl4FDu_LukR_e3yZYETZQc` | Imported. |
| 3 | `#nutzungsbedingungen` / `#terms` | `legal-section` | `content/legal/terms-of-use.md` via `import.yaml` doc `1ZsEc4HiofEDlgsHkpoD6WtdYGsDkNZBraZAPWFjNkgc` | Imported. |
| 4 | `#community-richtlinien` / `#community-guidelines` | `legal-section` | `content/legal/community-guidelines.md` via `import.yaml` doc `1FJ-PZRf-V6c7WsCTmhbnPqjnLD6ov4lLul18flxatp0` | Imported. |
| 5 | `#auftragsverarbeitung` / `#data-processing` | `legal-section` | `content/legal/dpa.md` via `import.yaml` doc `1DkXR9EnYNkvdo3RHYXF0q1imp0QU0gSBE0ohoEokRFo` | Imported; renders publicly, no gate (D9). |
| 6 | `#barrierefreiheit` / `#accessibility` | `legal-section` | **Dummy-Content** | TS-029 D8 / TS-004 D8: registry anchor exists, **no document exists at all** — "to be written," no Google Doc. Production build fails while missing (D8's release-blocker rule). Generate a conservative, generic BFSG-conformance placeholder statement (scope, contact channel for accessibility feedback, no invented conformance-testing claim, no fabricated audit date), explicitly marked `provenance: generated` and flagged for legal-counsel review before any production build — per TS-029 open point #1 this is jan-henrik's decision together with counsel, not a fact this playbook can originate. |
| 7 | English siblings of rows 1–5 | `legal-section` | Same `import.yaml`, **EN targets missing** | Not `Dummy-Content` in the generated-copy sense — TS-007 D10 / TS-029 open point #2: `import.yaml` has one target per document, all `locale: de`; DEC-027 requires DE **and** EN. This is a **pipeline/import gap** (no English Google Docs confirmed to exist), registered separately from Dummy-Content because legal text must never be machine-translated or invented — it can only be imported once an English source document exists. Flagged in `state/open.md` as its own row, not counted in the Dummy-Content tally below. |

**Page total: 6 registry sections — 5 Sourced (imported), 1 Dummy-Content (accessibility statement).** EN-locale completeness for rows 1–5 is a separate, non-content-generation blocker (see `state/open.md`).

---

## Counts

| Page (TS-###) | Slots | Sourced | Sourced — empty by design | Dummy-Content |
| --- | --- | --- | --- | --- |
| TS-019 Home | 11 | 9 | 2 | 0 |
| TS-020 Your place | 8 | 5 | 3 | 0 |
| TS-021 Start the calendar | 5 | 5 | 0 | 0 |
| TS-022 Mitmachen | 9 | 6 | 1 | 2 |
| TS-023 Registrieren | 5 | 4 | 0 | 1 |
| TS-024 Dein Kalender | 9 | 6 | 1 | 2 |
| TS-025 Bestellen | 5 | 5 | 0 | 0 |
| TS-026 Deine Region | 7 | 5 | 1 | 1 |
| TS-027 Über uns | 9 | 7 | 1 | 0 |
| TS-028 Archiv | 4 | 2 | 2 | 0 |
| TS-029 Rechtliches | 6 | 5 | 0 | 1 |
| **Total** | **78** | **59** | **11** | **7** |

- **Slots total: 78**
- **Sourced (resolved to a concrete hub or import locator): 59**
- **Sourced — empty by design (clearance-gated proof/testimonial slots that must render empty rather than be filled): 11** — these are not gaps in this playbook's work; they are correct behaviour per SRC-001 rule 4 / TS-005 D5 / TS-007 D2, driven by hub clearance state (chiefly Q-045: 0/32 media-echo entries carry `usage_rights`, and 5/5 `testimonial`-type proof records still `unverified`, Q-014). No slot in this category should be "fixed" with generated copy.
- **Dummy-Content: 7** — registered individually above and rolled up by page area in `state/open.md` below. Two of the seven (TS-024 trust-block operations/AI sentences, TS-026 response-time promise) are **withheld entirely** rather than filled with generated placeholder text, because their governing determinations (TS-024 D10, TS-026 D5) explicitly forbid shipping any sentence without a named source. The other five get on-voice, generic, clearly-marked generated content once Phase 2 starts.

## Completeness correction (Task 1, 2026-09-11)

**Orchestrator decision, overriding the `Sourced — empty by design`
determination above for the prototype only.** `plan/guardrails.md`'s
dummy-content rule requires the prototype to be complete on every page —
"a slot without a source gets generated content, never a hole." Applied
strictly, that rule already covered the 7 `Dummy-Content` slots above,
but left the 11 `Sourced — empty by design` slots and the 2 fully
`withheld` slots (TS-024 8a/8b, TS-026 row 7) genuinely empty, because
SRC-001 rule 4 / TS-005 D5 / TS-007 D2 forbid filling a clearance-gated
proof/testimonial slot with invented content. For the **prototype**, the
orchestrator decided the completeness bar wins: every one of those 13
slots now additionally carries generated, clearly-labelled, `demo: true`
placeholder content layered *on top of* the untouched original
determination — the map rows above, the `sourced-empty-by-design`/
`withheld` provenance tags, and their reasoning are unchanged; the demo
content is additive, not a replacement. Full detail and per-slot content
is in `content/pages/**/de.md` (search `demo: true`) and registered as
`state/open.md` #45–52.

Updated tallies for the whole run (Phase 1 + this correction):

| Category | Phase 2 count | + Task 1 additions | Total |
| --- | --- | --- | --- |
| Dummy-Content (Phase 2, real gaps generated or withheld) | 7 | 0 | 7 |
| Sourced — empty by design (clearance-gated, real gap unchanged) | 11 | 0 | 11 |
| **Generated demo additions (`provenance: generated`, `demo: true`, prototype-only, layered on sourced-empty/withheld slots)** | 0 | **12** | 12 |

The 12 new demo additions, by page (slot → what was added):

- **TS-019 Home** — slot 8: 5 demo proof/media cards. (Note: the map's
  page-total line above reads "2 Sourced-empty-by-design" for this page,
  but the shipped file (`content/pages/home/de.md`) only ever tagged one
  slot, 8, with that provenance. This is a Phase 2 map/file
  inconsistency, corrected here rather than re-litigated: the page has
  exactly 1 sourced-empty-by-design slot, now also carrying 1 demo
  addition.)
- **TS-020 `/dein-ort`** — slots 3, 4, 5, 6: one generated demo
  testimonial per value story (4 additions), plus a generated demo
  example anchor for story 5 (Kultur)'s otherwise fully unbacked
  anecdote — counted as 4 slot-level additions (one per story).
- **TS-022 `/mitmachen`** — slot 7: 3 demo proof cards.
- **TS-024 `/dein-kalender`** — slot 5: 3 demo proof cards; slot 6: 2
  demo illustrative sentences (operations, AI use) layered on the
  withheld real sentences.
- **TS-026 `/deine-region`** — slot 6: 3 demo proof cards; slot 7: 1
  demo illustrative response-promise sentence layered on the withheld
  real constant.
- **TS-027 `/ueber-uns`** — slot 3: 1 demo testimonial for the reserved
  `testimonial`-type place.
- **TS-028 Archiv** — slot 2: 6 demo archive rows spanning the type
  vocabulary, layered on the untouched real (empty-at-scale) list logic.

All additions use only recognizably exemplary names (`Beispielgemeinde
Musterdorf`, `Beispiellandkreis Musterkreis`, `Beispielzeitung`, generic
role attributions) — never a real-looking person, number, award, or
quote presented as real — per the dummy-content rule and the role's
"Must not" list. Every German addition passed `humanizer` +
`humanize-de` before commit.

## Pages with the most Dummy-Content

1. **TS-022 `/mitmachen`** and **TS-024 `/dein-kalender`** — tied, 2 each (the stage-0 reference place / permanence-promise proof gap on `/mitmachen`; the operations and AI trust-block sentences on `/dein-kalender`, both explicitly source-less per their own specs' open points).
2. **TS-023 `/mitmachen/registrieren`**, **TS-026 `/deine-region`**, **TS-029 `/rechtliches`** — 1 each (the "who publishes" enum vocabulary; the conditional response-time promise; the accessibility statement).

---

## Compliance check (Phase 2, 2026-09-11)

The eight-point check of `website-communication-principles.concept.md`
§"Compliance Check for a Page Brief", plus point 9 (DEC-066, `du`
throughout) — nine rows per page below. Assessed against the copy in
`content/pages/**/de.md` together with each page's own tactical spec
(manifest values are the spec's, not authored here; this check reads
whether the copy is consistent with them, not whether the manifest
itself is right). "Pass" means the copy satisfies the point or does not
contradict it; "N/A (by design)" marks a point the page's own spec
exempts it from; "Partial" names what is missing and why.

| Page (TS-###) | 1. One focus job | 2. One primary conversion (ID) | 3. Audiences ordered, primary named | 4. Every claim has a proof slot or is weakened | 5. ≥ 1 live module, empty state defined | 6. Context band names other 3 jobs | 7. Closing CTA = primary | 8. Works at stage 0 | 9. `du` throughout, no formal address |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| TS-019 Home | Pass — `know-what-is-on`, invariant across S1–S4 | Pass — `save-calendar-to-homescreen` | Pass — order is a runtime property of the proof stream, not authored here; not contradicted | Pass — proof stream (slot 8) is explicitly empty-by-design where uncleared, never invented | Pass — place search (S1), position 1/2 (S2/S3), counters (slot 9), each with a defined empty/fallback state | Pass — slot 10 names all three other jobs | Pass — slot 11 mirrors the current-state primary by rule | Pass — S1 (search) is the prerendered default and is complete on its own | Pass |
| TS-020 Your place | Pass — `know-what-is-on`, shifts to `publish-our-dates` only in state B (registered exception) | Pass — `save-calendar-to-homescreen` (state A) / `register-as-publisher` (state B) | Pass — `rural-residents` then `actors`, per spec | Partial — 4 value stories, 3 testimonial parts empty-by-design (Q-14, unverified); backing examples cleared where the spec names one | Pass — position 1/2 + search; state B is itself the registered live-module-driven empty state | Pass (rendered by layout, not re-authored here) | Pass — state A opens the calendar, state B is `register-as-publisher`, both closing-CTA-mirrored | Pass — S0 renders search + 4 stories on snapshot examples | Pass — includes the one direct-address sentence DEC-071 reserves for this page |
| TS-021 Start the calendar | Pass — `publish-our-dates`, static | Pass — `register-as-publisher` | Pass — `actors`, `municipalities`, `rural-residents` in order | Pass — no proof slot on this page by spec; the live example is the credibility carrier, sourced to a real active place | Pass — live example (slot 3) + search (slot 5), both degrade to the placeless variant | Pass (layout) | Pass — slot 6 CTA is the closing CTA | Pass — placeless variant is itself the prerendered page | Pass — slot 4 explicitly avoids naming the visitor as the one who must act |
| TS-022 Mitmachen | Pass — `publish-our-dates`, invariant | Pass — `register-as-publisher` | Pass — `actors` primary, `municipalities` as publisher | Partial — objection block and proof block (slot 7) are sourced but pool-thin; permanence promise (slot 8) is generated, not proof-backed (state/open.md #17) | Pass — live example (slot 6), with a named stage-0 reference place (slot 6a) as its empty/fallback anchor | Pass (layout) | Pass — slot 8 mirrors slot 1 exactly | Pass — stage-0 uses the configured reference place, never the visitor's own | Pass |
| TS-023 Registrieren | Pass — `publish-our-dates` | Pass — `publish-first-event` (completed in-app; `register-as-publisher` fired here at handover) | Pass — single audience `actors`, per spec | N/A (by design) — no proof slot on this page; the argument was made on `/mitmachen` | Pass — place search, step 1 only, per spec | Partial — band renders on step 1 only, suppressed steps 2–3 (TS-023 D7, `state/open.md` #24, a registered deviation from TS-006's every-page rule) | Pass — handover *is* the closing CTA | Pass — step 1 is reachable with no assumption | Pass |
| TS-024 Dein Kalender | Pass — `run-our-own-calendar` | Pass — `buy-calendar-licence` primary, `request-product-briefing` equal-weight | Pass — municipalities, institutions, actors, counties in order | Partial — proof block (slot 5) pool-thin/unverified by design; trust block (slot 6) ships data-protection only, operations/AI sentences withheld, not generated (D10, `state/open.md` #19) | Pass — embed demo (slot 3), labelled example while Q-026 is open | Pass (layout) | Pass — closing CTA mirrors the primary, not Pulse-styled | Pass — tiers, contrast and trust block need no visitor context | Pass |
| TS-025 Bestellen | Pass — `run-our-own-calendar` | Pass — `buy-calendar-licence` | Pass — municipalities, institutions | N/A (by design) — no proof slot in V1 (decision already made on `/dein-kalender`) | Partial — scope selection (slot 1) has no live preview in V1 (DEC-069, deferred by decision, not a copy gap) | N/A (by design) — TS-025 D7-style flow, no argument blocks | Pass — step 4 code display is the terminal state, no separate closing CTA needed (flow, not an argument page) | Pass — steps 1–2 need no visitor context; step 3 explicitly handles the no-live-preview case in copy | Pass |
| TS-026 Deine Region | Pass — `run-our-own-calendar` | Pass — `request-licence-quote` primary, `request-product-briefing` equal-weight | Pass — counties, institutions, municipalities in order | Partial — proof block (slot 6) pool-thin/unverified by design; response promise (slot 7) fully withheld, not generated (`state/open.md` #20) | Pass — interim module (slot 3) with a defined stage-0/failure fallback (search stays, county-dependent parts omitted) | Pass (layout) | Pass — slot 1 CTA repeated identically in the closing block per spec | Pass — stage 0 renders search only, asserts no county name | Pass |
| TS-027 Über uns | N/A (by design) — page carries no conversion of its own (TS-027 D1) | N/A (by design) — `primaryConversion: null` by spec | Pass — 5 audiences listed, priority order per spec | Partial — proof stream (slot 3) has one permanently visible empty slot by design (5/5 testimonials unverified, Q-014); origin claim (slot 1) is fully cleared | Pass — operating counters (slot 2), empty state defined (renders without the figure, never a placeholder zero) | Pass — merged into the closing block per TS-006 D6, offering all three jobs (this page's substitute for points 6+7 given no conversion of its own) | N/A (by design), see above | Pass — stage 0/1 renders identical block order | Pass |
| TS-028 Archiv | N/A (by design) — no focus-job argument, a reference list (TS-028 D1) | N/A (by design) — `primaryConversion: null` | N/A — not an audience-targeted argument page | Pass — clearance is the only filter; 0/32 rows render today rather than any invented row (Q-045, `state/open.md` #1) | N/A — fully static by design, no live module (TS-028 D8) | N/A (by design) — TS-028 D1 forbids an own CTA; the closing block still offers the three jobs, per layout | Pass — closing block, per layout | Pass — chronological order needs no visitor context | Pass |
| TS-029 Rechtliches | N/A (by design) — sender surface, no focus job in the four-job sense (TS-029 open point #5) | N/A (by design) — no conversion | N/A — not audience-targeted | N/A — legal text, not a marketing claim | N/A — fully static (TS-029 D7) | N/A (by design) — TS-004 D8 registry page, not an argument page | N/A | Pass — static, no visitor context needed | Partial — the composition/nav copy in this file is `du`-consistent, but the five **imported** legal documents (`content/legal/*.md`) predate this run, are out of this playbook's scope to rewrite, and were not audited for register; a `du`/`Sie` mismatch there is a known, unaddressed risk, not a finding this run can close |

Notes:

- "Partial" rows are not failures of this playbook's work; nearly all of
  them restate a `Sourced — empty by design` or `Dummy-Content` row
  already tracked above and in `state/open.md` — clearance gaps,
  withheld promises, and one unaudited legal register are system/hub
  gaps, not missing copy.
- The one open finding worth flagging on its own: **`/rechtliches`
  point 9** — nobody has checked whether the five imported legal
  documents use `du` or `Sie`. DEC-066 binds the whole website; this
  playbook cannot rewrite legal text to fix it (role boundary), so it is
  registered here rather than silently passed.

---

## Glossary (Phase 3, DE → EN)

One glossary entry per recurring term, kept here so every English page
uses the same word for the same thing (voice-over-variety rule,
`.agents/playbooks/playbook-content-production/SKILL.md`). Context
notes mark the terms that translate differently depending on sense.

| German | English | Notes |
| --- | --- | --- |
| Dorfkalender | village calendar | The product's descriptive name; translated (lowercase, common-noun register) per this task's own instruction. "Portalize" and "Pulse" stay untranslated brand names. |
| Gemeinde | municipality | |
| Verein | association / club | "Cultural association", "club" when the register is more casual (e.g. a village fair organizer); "association" as the default. |
| Kirchengemeinde | parish / church congregation | |
| Feuerwehr | fire brigade | "Volunteer fire brigade" when "Freiwillige Feuerwehr" is explicit. |
| Termin | date / event | "Date" for a calendar entry (the dominant sense on this site — "Termine im Kalender" → "dates in the calendar"); "event" only where German itself shifts to describe the happening rather than the calendar entry. |
| Ort | place | Never "location" or "town" — "place" is the site's consistent term, matching the product's own place-based model. |
| Landkreis | county | |
| Akteure | local groups | The audience concept behind the hub's `actors` id; "local groups" (or "local groups and organizers" where the sentence needs it) reads more naturally in English than a literal "actors". |
| Beleg / Belegstrom | proof / proof stream | |
| Zusicherung(stext) | reassurance (text) | |
| Einbindung | embedding | As in "calendar embedding", the technical integration feature. |
| Publizierweg | publishing path | |
| Homescreen | home screen | Two words in English. |
| Rechtliches | Legal | Page title / nav label. |
| Barrierefreiheit | Accessibility | |
| Auftragsverarbeitung (AVV) | Data processing agreement (DPA) | |
| Nutzungsbedingungen | Terms of use | |
| Datenschutz(erklärung) | Privacy (policy) | |
| Impressum | Imprint | |
| Community-Richtlinien | Community guidelines | |
| Du-Anrede | "you" (informal register, no "Sie" equivalent in English) | English has no T–V distinction; the informal, direct register carries over as plain "you" plus the same warm, direct sentence construction (short sentences, active voice, no corporate "we"-distancing). |

Glossary size: 22 entries (2026-09-11, Phase 3).
