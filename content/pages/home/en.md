---
id: home-de
page_id: TS-WEB-0019
route: "/"
seo:
  "/":
    title: "Schafe vorm Fenster — what's on where you live"
    description: "What is coming up where you live and in the villages next door: enter your place name and open the calendar for your own area."
    provenance: generated
content_type: section
status: draft
locale: en
sources:
  - "@schafe-vorm-fenster/messaging@0.1.0#actors--community-calendar"
  - "@schafe-vorm-fenster/messaging@0.1.0#municipalities--portalize-calendar"
  - "@schafe-vorm-fenster/proof@0.3.5#founder-former-volunteer-mayor"
  - "@schafe-vorm-fenster/people@0.3.6#jan-henrik-hempel"
  - "@schafe-vorm-fenster/proof@0.3.5"
  - "@schafe-vorm-fenster/media-echo@0.3.3"
  - "ia"
derived_from:
  - "@schafe-vorm-fenster/messaging@0.1.0#actors--community-calendar"
  - "@schafe-vorm-fenster/messaging@0.1.0#municipalities--portalize-calendar"
  - "@schafe-vorm-fenster/proof@0.3.5#founder-former-volunteer-mayor"
  - "@schafe-vorm-fenster/people@0.3.6#jan-henrik-hempel"
  - "@schafe-vorm-fenster/proof@0.3.5"
  - "@schafe-vorm-fenster/media-echo@0.3.3"
  - "ia"
generated_by: "playbook-content-production@1.0.0"
generated_at: "2026-09-11"
tone_profile: "du-everywhere"
provenance: "sourced — every slot; slot 8 (proof stream) now carries real proof and media-echo records instead of demo cards, three of them with clearance pending (Q-0014, Q-0045); EN translation of content/pages/home/de.md, same source ids per slot"
compliance_check: "state/content-map.md#compliance-checks — TS-WEB-0019"
schema_note: >-
  src/domain/content-frontmatter.schema.ts predates TS-WEB-0007 (8 content types,
  no derived_from/RelevanceFacets). The fields above follow TS-WEB-0007 D6/D7
  and are carried through even though the current schema neither requires
  nor validates them — see state/open.md #37.
images:
  - id: home-hero
    slot: home-1-search-hero
    ratio: hero
    provenance: real
    source: >-
      Wikimedia Commons, File:Melkerschule Schlatkow.jpg —
      https://commons.wikimedia.org/wiki/File:Melkerschule_Schlatkow.jpg — Eigenaufnahme (Jan-Henrik
      Hempel, Commons-Konto „J2hcom", own work), September 2016, 5073×2817. Motivregel `/`: Dorf mit
      Aktivität (SRC-0014 §Motiv pro Seite). Nachweis: content/legal/image-credits.md.
    alt: >-
      The half-timbered house of the Melkerschule in Schlatkow, with picnic benches, two parasols
      and guests on the grass in front of it.
    licence: CC BY-SA 4.0
    focal:
      x: 50
      "y": 55
    status: real
    file: /images/real/home-hero.webp
    width: 800
    height: 900
    wide_file: /images/real/home-hero-wide.webp
    wide_width: 1400
    wide_height: 600
  - id: home-scene-embed
    slot: home-5-scene-embed
    ratio: feature
    provenance: real
    source: >-
      Wikimedia Commons, File:Guetzkow Ostvorpommern Rathaus.jpg —
      https://commons.wikimedia.org/wiki/File:Guetzkow_Ostvorpommern_Rathaus.jpg — Foto: Erell, Mai
      2007, 3008×2000. Fremdaufnahme: CC BY-SA verlangt Namensnennung, sie steht in
      content/legal/image-credits.md.
    alt: >-
      The town hall of Gützkow in Western Pomerania, a white rendered building with a flight of
      steps onto the street.
    licence: CC BY-SA 2.5
    focal:
      x: 42
      "y": 50
    status: real
    file: /images/real/home-scene-embed.webp
    width: 1400
    height: 1000
  - id: home-scene-provenance
    slot: home-6-scene-provenance
    ratio: feature
    provenance: real
    source: >-
      @schafe-vorm-fenster/people@0.3.6#jan-henrik-hempel/assets/2021-workshop-ranzin.jpeg —
      Eigenaufnahme (in-house), unbeschränkte Nutzung, kein Credit nötig. Binärdatei liegt im
      go-to-market-os-Repository, das npm-Paket liefert nur den .asset.md-Deskriptor.
    alt: >-
      Jan-Henrik Hempel standing in the open door of a brick building, the Schafe vorm Fenster
      roll-up banner beside him.
    licence: Eigenaufnahme, unbeschränkte Nutzung
    focal:
      x: 45
      "y": 40
    status: real
    file: /images/real/home-scene-provenance.webp
    width: 1400
    height: 1000
---

# Home page (`/`)

Focus area "know-what-is-on" with state logic (TS-WEB-0019 D2); order and
states are layout logic, not part of this file. Placeholders in
`{curly braces}` are runtime values, not authored text.

## Slot 1 — Search field, no place known (Block 1 / State S1)

<!-- id: home-1-search-hero; content_type: hero; provenance: sourced; derived_from: [ia]; status: draft -->

**Headline:** What's on where you live, and when.

**Search input (placeholder):** Your place

**Button:** Search

**Helper text under the field:** Type the place name — suggestions start at the second letter.

<!-- source_note: the placeholder "Your place" is the owner's wording for this field (content/pages/deine-region/en.md, slot 3); the helper text is the existing dictionary string (src/lib/i18n/dictionary.ts, search.hint). The postcode wording and the interim rationale went with DEC-0079 §1 (T-07, DEC-0119). -->

## Slot 2 — Place known, dates exist (Block 1 / State S2)

<!-- id: home-2-place-dates; content_type: hero; provenance: sourced; derived_from: [ia]; status: draft -->

**Headline:** Here's what's on in {place}

**CTA label (primary):** Open the {place} calendar

**Hand-off line under the dates:** Your event missing? Add it yourself.

The hand-off line is the review's own wording of 2026-09-22 and this
block's hand-off to the next one (CG-008): the gap in the list is the way
into publishing, not a flaw the page has to hide. It is a sentence, not a
link — the page's one primary CTA stays the search (TS-WEB-0006 D3).

Place name and dates are live data (TS-WEB-0008 position 1); the headline
is a text template with a named placeholder, not a sentence generated
per place (segment independence, TS-WEB-0007 D7).

## Slot 3 — Place known, no dates (Block 1 / State S3)

<!-- id: home-3-place-empty; content_type: hero; provenance: sourced; derived_from: [ia]; status: draft -->

**Module heading (own radius, not the place name):** This week nearby

**Invitation text:** Nothing's in the calendar for {place} yet. Add the first date — your club, your fire brigade, your municipality.

**CTA label:** Publish the first date

Its own wording, distinct from `/dein-ort` state B and
`/dein-ort/starten` (TS-WEB-0019 slot table row 3): this text addresses the
gap in the visitor's own place, not a gap in the system.

## Scene 1 — WhatsApp (mechanism: whatsapp)

<!-- id: home-4-scene-whatsapp; content_type: value-story; provenance: sourced; derived_from: ["@schafe-vorm-fenster/messaging@0.1.0#actors--community-calendar"]; status: draft -->

**Aha statement:** A photo of the flyer by WhatsApp, and the date is in the calendar.

**Kicker:** How the dates get in

**Transition:** Nobody here types those dates in. They come from the clubs, the fire brigades and everyone who puts something on around here — usually like this:

**Explain-module title:** Send a flyer by WhatsApp

**CTA label (secondary):** Sign up for free now

Source: `relievers[0]` of the "actors--community-calendar" value
proposition — "send a photo of the printed flyer by WhatsApp and the
date is created from it". The aha line is the same sentence as before
without its question mark (CG-006, TS-WEB-0019-A6). This scene's body text
is **gone**: the explain module beneath it says in three lines what the
body said in two sentences, and a line that repeats the previous one is
cut, not softened (CG-007, CG-016) — the review names that very
replacement ("an animation that plays it would be better than a text like
that"). Title and CTA label are `/mitmachen`'s
own (`content/pages/mitmachen/en.md`, slot 3 and slot 1): the path is the
same one, and this scene's target is the page that owns the job.

### Slot 4a — Step lines and stage words of the WhatsApp scene (placeholder)

<!-- id: home-4a-scene-whatsapp-steps-demo; content_type: value-story; provenance: generated; derived_from: []; status: draft; demo: true -->

**Steps:**

1. Photograph the flyer — The one you printed anyway.
2. Send it to us on WhatsApp — Straight into our chat via "share".
3. The date is in the calendar — In your place and around it.

**Chat reply (state 2):** Thanks! The date is in the calendar.

**Chat time (state 2):** 14:06

**Sample rows (state 3):**

- Fire brigade fair | Sat · 15:00 · fire station | social | Community life
- Lantern parade | Fri · 17:30 · church | culture | Culture
- Village flea market | Sun · 11:00 · village square | social | Community life

The same explain module as path 01 on `/mitmachen`, so the same
placeholder set: the three step lines are the 2026-09-23 draft
"3-Schritte-erklären" (11.20.03) and stay `provenance: generated`,
`demo: true`, marked `data-demo="true"` in the markup until they are
cleared (DEC-0068, DEC-0129, `state/open.md`). The sample rows are only the
live panel's fallback in state 3, for when the upstream answers fewer than
three rows; normally the panel shows the reference place's real dates.

## Scene 2 — Embedding (mechanism: embed)

<!-- id: home-5-scene-embed; content_type: value-story; provenance: sourced; derived_from: ["@schafe-vorm-fenster/messaging@0.1.0#municipalities--portalize-calendar"]; status: draft -->

**Aha statement:** Your dates on your own website.

**Text:** The culture calendar for your municipality: dates from every local group in the area, on culture, tourism and community life. Two lines to embed, done.

**Kicker:** With no system of your own

**Transition:** The dates from around here also stand where the municipality shows them:

**CTA label (secondary):** Order the calendar

Source: "municipalities--portalize-calendar" value proposition,
`gains`/`relievers` fields — "our own design and our own selection,
without our own system". The aha line is the review's wording of
2026-09-22 ("Deine Termine auf deiner Webseite"), as are the example
("the culture calendar for your municipality … from every local group in
the municipal area, on culture, tourism and community life") and "two
lines to embed, done". The CTA label is the target page's own primary
label (`content/pages/dein-kalender/en.md`, slot 1).

## Scene 3 — Provenance (mechanism: provenance)

<!-- id: home-6-scene-provenance; content_type: value-story; provenance: sourced; derived_from: ["@schafe-vorm-fenster/proof@0.3.5#founder-former-volunteer-mayor", "@schafe-vorm-fenster/people@0.3.6#jan-henrik-hempel"]; status: draft -->

**Aha statement:** Shaping our own villages ourselves.

**Text:** Jan-Henrik Hempel was a volunteer mayor, sits on the municipal council and co-founded the culture club. He knows the village from the inside — as someone who joins in. The name Schafe vorm Fenster comes from the sheep pasture outside his own kitchen window.

**Transition:** The village calendar exists because somebody had the problem himself.

Source: `founder-former-volunteer-mayor` (`usage_rights: cleared`) —
documented via Nordkurier 2019/2022 and the Zukunftswege-Ost portrait
2026.
The breadth of the roles (municipal council, co-founder of the culture
club) and the precedence of volunteering over administration are
the review's wording of 2026-09-22, as are "shaping our own villages
ourselves" and "the name Schafe vorm Fenster". This slot carries **no**
kicker: "Wo das herkommt" is on the avoid list (CG-017, CG-040) and the
review names no replacement — the heading carries the scene on its own
(a deviation from polish brief G-3, as DEC-0120 §5 took for `/ueber-uns`).

## Block 2b — Provenance stamps

<!-- id: home-7-provenance-stamps; content_type: value-story; provenance: sourced; derived_from: ["@schafe-vorm-fenster/proof@0.3.5#founder-former-volunteer-mayor"]; status: draft -->

**Link:** More about us → `/ueber-uns`

The stamp sentence "Built by someone who knows the office … Running since
2018." is gone: "built" and "run" about this product are on the avoid list
(CG-033, CG-040), and the review strikes the stamp. What stays is the way
to the page that tells the origin in full — the label is this slot's own
wording and the provenance scene's one secondary CTA (TS-WEB-0019 D3a,
DEC-0082 §4).

## Block 2c — Proof stream (5 elements)

<!-- clearance: pending — `lehre-lelender`, `volkshochschule-uecker-randow` and `kulturlandbuero-broellin` are `usage_rights: unverified` (Q-0014), the three media-echo entries carry no `usage_rights` at all (Q-0045, state/open.md #1). The protected preview shows them; the pre-go-live hardening round clears them. `noerd-award-2026-smart-community` and `in-operation-since-2018` are `cleared`. -->
<!-- source_note: the stage-0 rule "widest spread, most recent first" comes from gtm:concept/website-relevance-model.concept.md (context matrix, row "Direct visit, unknown"); the proof rule from gtm:concept/website-communication-principles.concept.md §4. -->
<!-- id: home-8-proof-stream; content_type: proof-card; provenance: sourced; derived_from: ["@schafe-vorm-fenster/proof@0.3.5#lehre-lelender", "@schafe-vorm-fenster/proof@0.3.5#noerd-award-2026-smart-community", "@schafe-vorm-fenster/proof@0.3.5#volkshochschule-uecker-randow", "@schafe-vorm-fenster/proof@0.3.5#kulturlandbuero-broellin", "@schafe-vorm-fenster/proof@0.3.5#in-operation-since-2018", "@schafe-vorm-fenster/media-echo@0.3.3#2026-08-abend-der-engagierten-lehre", "@schafe-vorm-fenster/media-echo@0.3.3#2026-05-noerd-2026-rostock", "@schafe-vorm-fenster/media-echo@0.3.3#2024-09-kulturlandbuero-volkshochschule"]; status: draft -->

**Kicker above the stream:** Awards, press, and places already using the village calendar

Selection and order of the five elements stay the relevance engine's job
at runtime (TS-WEB-0005 D5, DEC-0048). This slot supplies the frame sentence and
the candidate set it draws from — pool:
`@schafe-vorm-fenster/proof@0.3.5` and
`@schafe-vorm-fenster/media-echo@0.3.3`.

**Candidates (stage 0: widest spread, most recent first):**

1. 17 places in and around Lehre, one calendar under its own name: LeLender. — Stiftung Lebendiges Lehre, Lehre (Lower Saxony)
2. Won the NØRD Award 2026, Smart Community category, under Bitkom patronage. — NØRD digital convention, Rostock
3. The adult education centres bring their course programme out to the villages. — Adult education centres in Vorpommern-Greifswald, Pasewalk
4. "The project can make a valuable contribution … to visibility in rural areas." — Kulturlandbüro Uecker-Randow, Schloss Bröllin
5. Running since 2018, no pilot and no prototype. — Vorpommern-Greifswald

Names, figures, titles, and years are taken from the records as they
stand: the 17 places, the name "LeLender" and the foundation's ownership
from `lehre-lelender`, the win and the Bitkom patronage from
`noerd-award-2026-smart-community`, the course programme from
`volkshochschule-uecker-randow`, the Kulturlandbüro's quotation from
`kulturlandbuero-broellin`, the operating year from
`in-operation-since-2018`. The quotation keeps the modality the record keeps —
"can make", shortened by "to economic recovery and", wording from §Evidence and
the same sentence the reserved place on `/ueber-uns` carries
(`content/pages/ueber-uns/en.md`). It is not a claim of ours: the record's
assertive `claim:` is our own summary, not the Kulturlandbüro's sentence, and
"valuable" comes from the quotation alone (the record's wording boundary). Four corrections from the 2026-09-22 review are
in there: the foundation runs the LeLender, not the municipality; the NØRD
Award was won, not merely entered; the adult education centres are named
after the district and the benefit (courses in the villages too) belongs in
the sentence; the Nordkurier nomination entry goes, because the award says
the same thing more strongly. The internal meta line "Press and appearance
record 2018 to 2026" is struck with nothing in its place (CG-035), so the
fifth element carries only its region and its context line comes from
slot 12. No cleared record exists in the hub for "success with customers"
(Wolgaster Kulturgesellschaft, named by the review) — `state/open.md`. Two
of the five are cleared; three are waiting for clearance and run with
`clearance: pending`. Citable is "running since 2018", not "eight years at
full operation" (the record's own wording limit).

## Block 2d — Live counters

<!-- id: home-9-counters; content_type: section; provenance: sourced; derived_from: [ia]; status: draft -->

**Label:** Dates currently in the calendar

**Number:** {dates_count} (live, `/api/stats`)

Only the date count is verifiable today (Q-0037: "places" and "updates
today" fields are missing from `/api/stats`); no static reach figure
replaces it (SRC-0001 §5, `reach-and-usage` is `expired`).

## Context band (3 non-focus jobs)

<!-- id: home-10-context-band; content_type: context-band; provenance: sourced; derived_from: [ia]; status: draft -->

**Kicker:** Here for something else today?

- **Publish dates:** Want to add dates for your club, your fire brigade, or your municipality? → `/mitmachen`
- **Run your own calendar:** Want a calendar under your own name, on your own website? → `/dein-kalender`
- **Who's behind it:** Want to know who makes the village calendar? → `/ueber-uns`

## Closing CTA

<!-- id: home-11-closing-cta; content_type: closing-cta; provenance: sourced; derived_from: [ia]; status: draft -->

**Heading:** Then go find out what's on where you live.

**Reassurance text:** Free, no account, permanently.

The reassurance is the short form of the commitment in `price.note` of
`community-calendar` ("Free for readers without any account … Permanent,
not an introductory tier"), the same source as `/dein-ort` slot 8 — the
home page says it in one line because here it stands under a search
field rather than under a calendar button.

Mirrors block 1's primary CTA in whichever state is current (S1 search,
S2 open calendar, S3 publish first date) — no new text, same target id
(TS-WEB-0006 D6).

## Slot 12 — UI strings no other slot carries

<!-- source_note: register from the gtm sources: principle 1a "scenes, not labels" and principle 5 "live data carries the argument" in gtm:concept/website-communication-principles.concept.md, the informal register from principle 1b. Replaces the generated strings in app/[lang]/page.tsx `DEMO_LABELS` (state/open.md row 92). Jan's decision, 2026-09-18: no marking in visible copy — provenance lives in frontmatter, in `data-*` and in state/open.md. -->
<!-- id: home-12-ui-strings; content_type: section; provenance: sourced; derived_from: [ia, "@schafe-vorm-fenster/brand-identity@0.1.4#schafe-vorm-fenster"]; status: draft -->

**Caption on the module of the WhatsApp scene:** Made from the flyer

**Geo label on the proof cards:** Proof from the region

**Unit in the counter badge:** dates

Three short strings the page currently keeps in code. They name what the
surface is showing without labelling the surface as unfinished. The unit
word stays short in the badge because the full label (slot 9) sits beside
it as text.
