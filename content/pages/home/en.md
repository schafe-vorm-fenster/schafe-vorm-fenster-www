---
id: home-de
page_id: TS-WEB-0019
route: "/"
seo:
  "/":
    title: "Schafe vorm Fenster — what's on where you live"
    description: "What is coming up where you live and in the villages next door: enter your postcode and open the calendar for your own area."
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
      Wikimedia Commons, File:Rathebur, Dorfstraße.jpg —
      https://commons.wikimedia.org/wiki/File:Rathebur,_Dorfstra%C3%9Fe.jpg — Eigenaufnahme von
      Schafe vorm Fenster (Commons-Konto „Schafevormfenster", own work), Juni 2025, 4032×2585.
      Nachweis: content/legal/image-credits.md.
    alt: >-
      A cobbled street through the village of Rathebur, houses to the left, a fieldstone wall and
      old trees to the right.
    licence: CC0 1.0
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

**Headline:** What's on where you live?

**Search input (placeholder):** Your postcode

**Button:** Search

**Helper text under the field:** Search by place name is coming — until then, the postcode works fine.

Rationale: place search today runs on postcode only (Q-0025, geo-api
name search is pending). The limitation is stated in the search field
itself rather than in a separate error message.

## Slot 2 — Place known, dates exist (Block 1 / State S2)

<!-- id: home-2-place-dates; content_type: hero; provenance: sourced; derived_from: [ia]; status: draft -->

**Headline:** Here's what's on in {place}

**CTA label (primary):** Open the {place} calendar

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

**Aha question:** A photo of the flyer by WhatsApp, and the date is in the calendar?

**Text:** Exactly that. You're printing the flyer anyway. Photograph it, send the picture to our WhatsApp number, done: the date appears in your place and in the neighbouring places, without you typing it in a second time.

**Kicker:** How the dates get in

**Transition:** Nobody here types those dates in. They come from the people in the place — usually like this:

Source: `relievers[0]` of the "actors--community-calendar" value
proposition — "send a photo of the printed flyer by WhatsApp and the
date is created from it".

## Scene 2 — Embedding (mechanism: embed)

<!-- id: home-5-scene-embed; content_type: value-story; provenance: sourced; derived_from: ["@schafe-vorm-fenster/messaging@0.1.0#municipalities--portalize-calendar"]; status: draft -->

**Aha question:** Your own calendar on your own website, with no system of your own behind it?

**Text:** Your municipality gets its own selection of dates, in its own design, under its own name, with nobody there maintaining a system. Local groups enter their own dates for their own purposes; your calendar stays current as a side effect.

**Kicker:** And if you want to show them yourself

**Transition:** The same dates, on your own site:

Source: "municipalities--portalize-calendar" value proposition,
`gains`/`relievers` fields — "our own design and our own selection,
without our own system".

## Scene 3 — Provenance (mechanism: provenance)

<!-- id: home-6-scene-provenance; content_type: value-story; provenance: sourced; derived_from: ["@schafe-vorm-fenster/proof@0.3.5#founder-former-volunteer-mayor", "@schafe-vorm-fenster/people@0.3.6#jan-henrik-hempel"]; status: draft -->

**Aha question:** Who's actually behind this?

**Text:** Jan-Henrik Hempel was a volunteer mayor himself. The company's name comes from the municipality's sheep pasture in front of his own kitchen window. He knows the administration this service helps from the inside.

**Kicker:** Where this comes from

**Transition:** Both exist because somebody had the problem himself.

Source: `founder-former-volunteer-mayor` (`usage_rights: cleared`) —
documented via Nordkurier 2019/2022 and the Zukunftswege-Ost portrait
2026.

## Block 2b — Provenance stamps

<!-- id: home-7-provenance-stamps; content_type: value-story; provenance: sourced; derived_from: ["@schafe-vorm-fenster/proof@0.3.5#founder-former-volunteer-mayor"]; status: draft -->

**Text:** Built by someone who knows the office this service serves. Running since 2018.

**Link:** More about us → `/ueber-uns`

The second clause rests on `in-operation-since-2018` (`cleared`) —
citable is "running since 2018", not "eight years at full operation".

## Block 2c — Proof stream (5 elements)

<!-- clearance: pending — `lehre-lelender` and `volkshochschule-uecker-randow` are `usage_rights: unverified` (Q-0014), the three media-echo entries carry no `usage_rights` at all (Q-0045, state/open.md #1). The protected preview shows them; the pre-go-live hardening round clears them. `noerd-award-2026-smart-community` and `in-operation-since-2018` are `cleared`. -->
<!-- source_note: the stage-0 rule "widest spread, most recent first" comes from gtm:concept/website-relevance-model.concept.md (context matrix, row "Direct visit, unknown"); the proof rule from gtm:concept/website-communication-principles.concept.md §4. -->
<!-- id: home-8-proof-stream; content_type: proof-card; provenance: sourced; derived_from: ["@schafe-vorm-fenster/proof@0.3.5#lehre-lelender", "@schafe-vorm-fenster/proof@0.3.5#noerd-award-2026-smart-community", "@schafe-vorm-fenster/proof@0.3.5#volkshochschule-uecker-randow", "@schafe-vorm-fenster/proof@0.3.5#in-operation-since-2018", "@schafe-vorm-fenster/media-echo@0.3.3#2026-08-abend-der-engagierten-lehre", "@schafe-vorm-fenster/media-echo@0.3.3#2026-05-noerd-2026-rostock", "@schafe-vorm-fenster/media-echo@0.3.3#2026-04-nord-award-nordkurier", "@schafe-vorm-fenster/media-echo@0.3.3#2024-09-kulturlandbuero-volkshochschule"]; status: draft -->

**Kicker above the stream:** Awards, press, and places already using the village calendar

Selection and order of the five elements stay the relevance engine's job
at runtime (TS-WEB-0005 D5, DEC-0048). This slot supplies the frame sentence and
the candidate set it draws from — pool:
`@schafe-vorm-fenster/proof@0.3.5` and
`@schafe-vorm-fenster/media-echo@0.3.3`.

**Candidates (stage 0: widest spread, most recent first):**

1. The municipality of Lehre runs the calendar for its 17 places under its own name: LeLender. — Stiftung Lebendiges Lehre, Lehre (Lower Saxony)
2. NØRD Award 2026 in the Smart Community category, decided by public vote out of 80 entries. — NØRD digital convention, Rostock
3. Village calendar nominated for a digital award, April 2026. — Nordkurier, Vorpommern-Greifswald
4. The adult education centre publishes its entire course programme through the village calendar. — Volkshochschule Uecker-Randow, Pasewalk
5. Running since 2018, no pilot and no prototype. — Press and appearance record 2018 to 2026, Vorpommern-Greifswald

Names, figures, titles, and years are taken from the records as they
stand: the 17 places and the name "LeLender" from `lehre-lelender`, the 80
entries and the category from `noerd-award-2026-smart-community`, the
headline from the Nordkurier entry of April 2026, the course programme
from `volkshochschule-uecker-randow`, the operating year from
`in-operation-since-2018`. Two of the five are cleared; three are waiting
for clearance and therefore run with `clearance: pending`. Citable is
"running since 2018", not "eight years at full operation" (the record's own
wording limit).

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
