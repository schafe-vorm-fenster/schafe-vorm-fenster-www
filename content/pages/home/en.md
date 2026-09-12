---
id: home-de
page_id: TS-019
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
provenance: "sourced — every slot; slot 8 (proof stream) now carries real proof and media-echo records instead of demo cards, three of them with clearance pending (Q-014, Q-045); EN translation of content/pages/home/de.md, same source ids per slot"
compliance_check: "state/content-map.md#compliance-checks — TS-019"
schema_note: >-
  src/domain/content-frontmatter.schema.ts predates TS-007 (8 content types,
  no derived_from/RelevanceFacets). The fields above follow TS-007 D6/D7
  and are carried through even though the current schema neither requires
  nor validates them — see state/open.md #37.
images:
  - id: home-hero
    slot: home-1-search-hero
    ratio: hero
    provenance: generated
    brief: >-
      Blick über ein kleines Dorf in Vorpommern am späten Nachmittag im September: Feldsteinkirche,
      Backsteinscheune, ein Stück Kopfsteinpflaster, dahinter abgeerntete Felder bis zum Horizont.
      Tiefes, warmes Seitenlicht, bewölkter Himmel, die Sonne selbst bleibt außerhalb des Bildes.
      Ganz hinten auf der Dorfstraße zwei Menschen, nur als Silhouetten und zu weit weg, um jemanden
      zu erkennen. Nicht zeigen: Schrift, Logos, lesbare Orts- oder Nummernschilder, Gesichter,
      Postkartenidylle mit knallblauem Himmel.
    style: documentary photo, natural light, 35mm, muted colours, no text
    alt: >-
      A small village in Western Pomerania in the afternoon, a fieldstone church and a barn on the
      village street, harvested fields behind.
    status: generated
    model: bfl/flux-pro-1.1
    generated_at: "2026-09-12"
    prompt_hash: c39a629351615869
    file: /images/generated/home-hero.webp
    width: 800
    height: 900
    wide_file: /images/generated/home-hero-wide.webp
    wide_width: 1400
    wide_height: 600
  - id: home-scene-embed
    slot: home-5-scene-embed
    ratio: feature
    provenance: generated
    brief: >-
      Schaukasten aus Holz und Glas an einer Backsteinwand, wie ihn Gemeinden und Vereine für
      Aushänge benutzen: ein paar Zettel hängen schief, eine Ecke ist leer. Bedeckter Vormittag im
      Frühjahr, weiches Licht, Regenspuren auf der Scheibe. Die Zettel sind unscharf und aus dieser
      Entfernung nicht zu entziffern. Nicht zeigen: Schrift, Logos, lesbare Aushänge oder Schilder,
      Menschen, Bildschirme oder Geräte.
    style: documentary photo, natural light, 35mm, muted colours, no text
    alt: A wooden noticeboard on a brick wall, holding a few notices and one empty corner.
    status: generated
    model: bfl/flux-pro-1.1
    generated_at: "2026-09-12"
    prompt_hash: 00d6458bd5f2d454
    file: /images/generated/home-scene-embed.webp
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
    status: real
    file: /images/real/home-scene-provenance.webp
    width: 1400
    height: 1000
---

# Home page (`/`)

Focus area "know-what-is-on" with state logic (TS-019 D2); order and
states are layout logic, not part of this file. Placeholders in
`{curly braces}` are runtime values, not authored text.

## Slot 1 — Search field, no place known (Block 1 / State S1)

<!-- id: home-1-search-hero; content_type: hero; provenance: sourced; derived_from: [ia]; status: draft -->

**Headline:** What's on where you live?

**Search input (placeholder):** Your postcode

**Button:** Search

**Helper text under the field:** Search by place name is coming — until then, the postcode works fine.

Rationale: place search today runs on postcode only (Q-025, geo-api
name search is pending). The limitation is stated in the search field
itself rather than in a separate error message.

## Slot 2 — Place known, dates exist (Block 1 / State S2)

<!-- id: home-2-place-dates; content_type: hero; provenance: sourced; derived_from: [ia]; status: draft -->

**Headline:** Here's what's on in {place}

**CTA label (primary):** Open the {place} calendar

Place name and dates are live data (TS-008 position 1); the headline
is a text template with a named placeholder, not a sentence generated
per place (segment independence, TS-007 D7).

## Slot 3 — Place known, no dates (Block 1 / State S3)

<!-- id: home-3-place-empty; content_type: hero; provenance: sourced; derived_from: [ia]; status: draft -->

**Module heading (own radius, not the place name):** This week nearby

**Invitation text:** Nothing's in the calendar for {place} yet. Add the first date — your club, your fire brigade, your municipality.

**CTA label:** Publish the first date

Its own wording, distinct from `/dein-ort` state B and
`/dein-ort/starten` (TS-019 slot table row 3): this text addresses the
gap in the visitor's own place, not a gap in the system.

## Scene 1 — WhatsApp (mechanism: whatsapp)

<!-- id: home-4-scene-whatsapp; content_type: value-story; provenance: sourced; derived_from: ["@schafe-vorm-fenster/messaging@0.1.0#actors--community-calendar"]; status: draft -->

**Aha question:** A photo of the flyer by WhatsApp, and the date is in the calendar?

**Text:** Exactly that. You're printing the flyer anyway. Photograph it, send the picture to our WhatsApp number, done: the date appears in your place and in the neighbouring places, without you typing it in a second time.

Source: `relievers[0]` of the "actors--community-calendar" value
proposition — "send a photo of the printed flyer by WhatsApp and the
date is created from it".

## Scene 2 — Embedding (mechanism: embed)

<!-- id: home-5-scene-embed; content_type: value-story; provenance: sourced; derived_from: ["@schafe-vorm-fenster/messaging@0.1.0#municipalities--portalize-calendar"]; status: draft -->

**Aha question:** Your own calendar on your own website, with no system of your own behind it?

**Text:** Your municipality gets its own selection of dates, in its own design, under its own name, with nobody there maintaining a system. Local groups enter their own dates for their own purposes; your calendar stays current as a side effect.

Source: "municipalities--portalize-calendar" value proposition,
`gains`/`relievers` fields — "our own design and our own selection,
without our own system".

## Scene 3 — Provenance (mechanism: provenance)

<!-- id: home-6-scene-provenance; content_type: value-story; provenance: sourced; derived_from: ["@schafe-vorm-fenster/proof@0.3.5#founder-former-volunteer-mayor", "@schafe-vorm-fenster/people@0.3.6#jan-henrik-hempel"]; status: draft -->

**Aha question:** Who's actually behind this?

**Text:** Jan-Henrik Hempel was a volunteer mayor himself. The company's name comes from the municipality's sheep pasture in front of his own kitchen window. He knows the administration this service helps from the inside.

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

<!-- clearance: pending — `lehre-lelender` and `volkshochschule-uecker-randow` are `usage_rights: unverified` (Q-014), the three media-echo entries carry no `usage_rights` at all (Q-045, state/open.md #1). The protected preview shows them; the pre-go-live hardening round clears them. `noerd-award-2026-smart-community` and `in-operation-since-2018` are `cleared`. -->
<!-- source_note: the stage-0 rule "widest spread, most recent first" comes from gtm:concept/website-relevance-model.concept.md (context matrix, row "Direct visit, unknown"); the proof rule from gtm:concept/website-communication-principles.concept.md §4. -->
<!-- id: home-8-proof-stream; content_type: proof-card; provenance: sourced; derived_from: ["@schafe-vorm-fenster/proof@0.3.5#lehre-lelender", "@schafe-vorm-fenster/proof@0.3.5#noerd-award-2026-smart-community", "@schafe-vorm-fenster/proof@0.3.5#volkshochschule-uecker-randow", "@schafe-vorm-fenster/proof@0.3.5#in-operation-since-2018", "@schafe-vorm-fenster/media-echo@0.3.3#2026-08-abend-der-engagierten-lehre", "@schafe-vorm-fenster/media-echo@0.3.3#2026-05-noerd-2026-rostock", "@schafe-vorm-fenster/media-echo@0.3.3#2026-04-nord-award-nordkurier", "@schafe-vorm-fenster/media-echo@0.3.3#2024-09-kulturlandbuero-volkshochschule"]; status: draft -->

**Kicker above the stream:** Awards, press, and places already using the village calendar

Selection and order of the five elements stay the relevance engine's job
at runtime (TS-005 D5, DEC-048). This slot supplies the frame sentence and
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

Only the date count is verifiable today (Q-037: "places" and "updates
today" fields are missing from `/api/stats`); no static reach figure
replaces it (SRC-001 §5, `reach-and-usage` is `expired`).

## Context band (3 non-focus jobs)

<!-- id: home-10-context-band; content_type: context-band; provenance: sourced; derived_from: [ia]; status: draft -->

**Kicker:** Here for something else today?

- **Publish dates:** Want to add dates for your club, your fire brigade, or your municipality? → `/mitmachen`
- **Run your own calendar:** Want a calendar under your own name, on your own website? → `/dein-kalender`
- **Who's behind it:** Want to know who makes the village calendar? → `/ueber-uns`

## Closing CTA

<!-- id: home-11-closing-cta; content_type: closing-cta; provenance: sourced; derived_from: [ia]; status: draft -->

Mirrors block 1's primary CTA in whichever state is current (S1 search,
S2 open calendar, S3 publish first date) — no new text, same target id
(TS-006 D6).

## Slot 12 — UI strings no other slot carries

<!-- source_note: register and honesty rule from the gtm sources: principle 1a "scenes, not labels" and principle 5 "live data carries the argument" in gtm:concept/website-communication-principles.concept.md, the informal register from principle 1b; the image-placeholder rule from the role definition (design system: "Foto gesucht"). Replaces the four generated strings in app/[lang]/page.tsx `DEMO_LABELS` (state/open.md row 92) — the code binding is still open. -->
<!-- id: home-12-ui-strings; content_type: section; provenance: sourced; derived_from: [ia, "@schafe-vorm-fenster/brand-identity@0.1.4#schafe-vorm-fenster"]; status: draft -->

**Caption on the example module of the WhatsApp scene:** Made from the flyer — example date

**Geo label on the proof cards:** Proof from the region

**Image invitation on the media frame of the embed scene:** Photo wanted — we are missing a picture from your place here.

**Unit in the counter badge:** dates

Four short strings the page currently keeps in code. "Example date" and
"Proof from the region" say plainly what the surface is showing instead of
leaving it open; "Photo wanted" is the design system's placeholder wording
and claims no picture that does not exist. The unit word stays short in the
badge because the full label (slot 9) sits beside it as text.
