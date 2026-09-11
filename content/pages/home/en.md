---
id: home-de
page_id: TS-019
route: "/"
content_type: section
status: draft
locale: en
sources:
  - "@schafe-vorm-fenster/messaging@0.1.0#actors--community-calendar"
  - "@schafe-vorm-fenster/messaging@0.1.0#municipalities--portalize-calendar"
  - "@schafe-vorm-fenster/proof@0.3.5#founder-former-volunteer-mayor"
  - "@schafe-vorm-fenster/people@0.3.6#jan-henrik-hempel"
  - "ia"
derived_from:
  - "@schafe-vorm-fenster/messaging@0.1.0#actors--community-calendar"
  - "@schafe-vorm-fenster/messaging@0.1.0#municipalities--portalize-calendar"
  - "@schafe-vorm-fenster/proof@0.3.5#founder-former-volunteer-mayor"
  - "@schafe-vorm-fenster/people@0.3.6#jan-henrik-hempel"
  - "ia"
generated_by: "playbook-content-production@1.0.0"
generated_at: "2026-09-11"
tone_profile: "du-everywhere"
provenance: "mixed — sourced per section, see slot comments; 1 generated slot (slot 8, demo proof stream, prototype completeness override — state/open.md Dummy-Content); EN translation of content/pages/home/de.md, same source ids per slot"
compliance_check: "state/content-map.md#compliance-checks — TS-019"
schema_note: >-
  src/domain/content-frontmatter.schema.ts predates TS-007 (8 content types,
  no derived_from/RelevanceFacets). The fields above follow TS-007 D6/D7
  and are carried through even though the current schema neither requires
  nor validates them — see state/open.md #37.
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

<!-- id: home-8-proof-stream; content_type: proof-card; provenance: generated; derived_from: ["@schafe-vorm-fenster/proof@0.3.5", "@schafe-vorm-fenster/media-echo@0.3.3"]; status: draft; demo: true -->

**Kicker above the stream:** What press, authorities, and local groups say about the village calendar

Selection and order of the five elements is the relevance engine's job
(TS-005 D5, DEC-048) at runtime — this slot only supplies the frame
sentence. Pool: `@schafe-vorm-fenster/proof@0.3.5` (8 `cleared`
entries) plus `@schafe-vorm-fenster/media-echo@0.3.3` (32 entries, 0
with `usage_rights` today — Q-045, `state/open.md` #1). An empty slot
weakens the claim; it is never replaced by invented text.

**Demo elements (prototype, `Demo Data` badge):** As long as no
selection is cleared, the prototype shows five example cards instead
of an empty area:

1. "At last we can see at a glance what's on in our village." — Volunteer mayor, Example municipality Musterdorf
2. "We simply embedded our calendar in our website, with no system of our own behind it." — Digital office, Example administration Musterkreis
3. "Digital village calendars are changing how small communities share their dates." — Example newspaper, March 2026 issue
4. "We enter our club's dates ourselves now, no more spreadsheet." — Chair, Volunteer fire brigade Musterdorf
5. "Example award for digital participation in rural areas." — Example award for rural digitalisation

Places, institutions, and quotes are entirely invented and
recognizably exemplary — they replace no real proof and disappear once
real, cleared entries from the pool exist.

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
