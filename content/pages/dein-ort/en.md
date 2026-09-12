---
id: dein-ort-de
page_id: TS-020
route: "/dein-ort"
seo:
  "/dein-ort":
    title: "What's on in your place"
    description: "Every date from your own village in one place — clubs, council, fire brigade, church. Find your place and put the calendar on your home screen."
    provenance: generated
content_type: section
status: draft
locale: en
sources:
  - "@schafe-vorm-fenster/proof@0.3.5#google-baecker-schlatkow"
  - "@schafe-vorm-fenster/proof@0.3.5#homeoffice-mobile-anbieter"
  - "@schafe-vorm-fenster/proof@0.3.5#impftermine-landkreis"
  - "@schafe-vorm-fenster/proof@0.3.5#regional-footprint"
  - "@schafe-vorm-fenster/proof@0.3.5#kurzweg-baeckerei"
  - "@schafe-vorm-fenster/proof@0.3.5#zschiesche-gross-kiesow"
  - "@schafe-vorm-fenster/proof@0.3.5#kulturlandbuero-broellin"
  - "@schafe-vorm-fenster/proof@0.3.5#eichler-wasserschloss-quilow"
  - "@schafe-vorm-fenster/proof@0.3.5#volkshochschule-uecker-randow"
  - "@schafe-vorm-fenster/proof@0.3.5#wendt-rubkow"
  - "@schafe-vorm-fenster/offerings@0.3.3#community-calendar"
  - "ia"
derived_from:
  - "@schafe-vorm-fenster/proof@0.3.5#google-baecker-schlatkow"
  - "@schafe-vorm-fenster/proof@0.3.5#homeoffice-mobile-anbieter"
  - "@schafe-vorm-fenster/proof@0.3.5#impftermine-landkreis"
  - "@schafe-vorm-fenster/proof@0.3.5#regional-footprint"
  - "@schafe-vorm-fenster/proof@0.3.5#kurzweg-baeckerei"
  - "@schafe-vorm-fenster/proof@0.3.5#zschiesche-gross-kiesow"
  - "@schafe-vorm-fenster/proof@0.3.5#eichler-wasserschloss-quilow"
  - "@schafe-vorm-fenster/proof@0.3.5#volkshochschule-uecker-randow"
  - "@schafe-vorm-fenster/proof@0.3.5#wendt-rubkow"
  - "@schafe-vorm-fenster/offerings@0.3.3#community-calendar"
  - "ia"
generated_by: "playbook-content-production@1.0.0"
generated_at: "2026-09-11"
tone_profile: "du-everywhere"
provenance: "sourced — every slot. The four value-story proof cards now carry the real testimonials of the hub (kurzweg-baeckerei, zschiesche-gross-kiesow, eichler-wasserschloss-quilow, wendt-rubkow) and the Volkshochschule reference case instead of generated demo quotes; all five are clearance: pending (Q-014); EN translation of content/pages/dein-ort/de.md, same source ids per slot"
compliance_check: "state/content-map.md#compliance-checks — TS-020"
schema_note: "see content/pages/home/de.md — same TS-007/schema gap, state/open.md #37"
---

# Your place (`/dein-ort`)

Two states on one route (TS-020 D2): **A** — dates exist, **B** — the
place is on file but empty (focus job switches to "publish our
dates"). Block and DOM order stay the same in both states; only
block 1's offer text changes.

## Slot 0 — Focus block, state S0 (no place known)

<!-- source_note: the stage-0 rule from gtm:concept/website-communication-principles.concept.md principle 6 ("stage 0 must be complete and convincing on its own") and principle 1 ("know what is on is fulfilled in place, not linked to"); the informal register from principle 1b. Replaces the generic filler `your place` in app/[lang]/dein-ort/page.tsx `PAGE_COPY` (state/open.md row 93) — the code binding is still open. -->
<!-- id: dein-ort-0-state-s0; content_type: hero; provenance: sourced; derived_from: [ia]; status: draft -->

**Headline:** Search for your place, and what's on there will show up here.

**Module heading (own radius, no place name):** This week nearby

**Example badge on the module:** Example place

**Hint below the search field:** Searching by place name is still to come — until then a postcode does it.

Stage 0 names no place because none is known. The page therefore claims
nothing about a place; it shows the search and an example module that is
marked as an example. States A and B (slots 1 and 2) only start once a
place is settled.

## Slot 1 — Focus block, state A (dates exist)

<!-- id: dein-ort-1-state-a; content_type: hero; provenance: sourced; derived_from: [ia]; status: draft -->

**Headline:** Here's what's on in {place}

**CTA label (primary):** Add the {place} calendar to your home screen

Place name and dates are live data from `/api/places/{slug}/events`.

## Slot 2 — Focus block, state B (place on file, no dates)

<!-- id: dein-ort-2-state-b; content_type: hero; provenance: sourced; derived_from: [ia]; status: draft -->

**Headline:** Nothing's entered for {place} yet — you could be the first.

**CTA label (primary):** Publish the first date → `/mitmachen`

Literal quote from SRC-002 (TS-020 D2, DEC-071): this sentence belongs
only here. It implies no fault and no apology — the calendar for this
place already exists and is waiting.

## Slot 3 — Value story 1: the bakery van

<!-- id: dein-ort-3-story-baeckerwagen; content_type: value-story; provenance: sourced; derived_from: ["@schafe-vorm-fenster/proof@0.3.5#google-baecker-schlatkow", "@schafe-vorm-fenster/proof@0.3.5#homeoffice-mobile-anbieter"]; status: draft -->

**Title:** The bakery van, with its route

**Why it matters:** When the bakery van comes and where it stops isn't a side issue — it decides whether you get fresh bread or not. That belongs in the same calendar as the village fair.

**Example:** a recurring delivery date in {place} or nearby, live from the calendar.

**Testimonial:** Elisabeth Kurzweg, Bäckerei Kurzweg — wording on the proof card below.

<!-- testimonial_pool: ["@schafe-vorm-fenster/proof@0.3.5#kurzweg-baeckerei"]; clearance: pending (usage_rights unverified, Q-014) -->

The story rests on two cleared records: the Google search for the baker in
Schlatkow, which finds the bakery van and the day it comes rather than a
branch in the nearest town (`google-baecker-schlatkow`, `cleared`,
documented in the eu:react final report of July 2022), and the accounts
from people working at home during the pandemic who first noticed mobile
traders through the village calendars (`homeoffice-mobile-anbieter`,
`cleared`). The report says plainly that none of this can be measured in
revenue — the account stands, the figure does not.

### Proof card for story 1

<!-- clearance: pending — `kurzweg-baeckerei` is `usage_rights: unverified` (Q-014). The quote comes from the old website's testimonial section; no written clearance is on file in the hub. The protected preview shows it; the pre-go-live hardening round clears it. -->
<!-- source_note: the package stores the quote in ASCII transliteration ("Digitale Terminliste fuer die Doerfer"); set here with umlauts, wording unchanged. The quote is not translated — a testimonial is quoted in the language it was given in. -->
<!-- id: dein-ort-3-story-baeckerwagen-demo-testimonial; content_type: proof-card; provenance: sourced; derived_from: ["@schafe-vorm-fenster/proof@0.3.5#kurzweg-baeckerei"]; status: draft -->

**Testimonial:** „Mit der Digitalen Terminliste für die Dörfer in Vorpommern-Greifswald werden die Fahrtrouten anderer Unternehmen transparenter." — Elisabeth Kurzweg, Bäckerei Kurzweg (2022)

## Slot 4 — Value story 2: the council meeting

<!-- id: dein-ort-4-story-ratssitzung; content_type: value-story; provenance: sourced; derived_from: ["@schafe-vorm-fenster/proof@0.3.5#impftermine-landkreis"]; status: draft -->

**Title:** The council meeting, before it happens

**Why it matters:** If you want a say, you need to hear about the meeting before it passes, not afterwards in the minutes. Official dates belong in the same calendar as everything else in the place.

**Example:** an official date from {place} or the county, live from the calendar.

Proof of resilience in a crisis: during the pandemic, all of the
county's vaccination offers and test-centre opening hours ran
day-current and place-accurate through the village calendars
(`impftermine-landkreis`, `cleared`).

**Testimonial:** Dr. A. Zschiesche, mayor of Groß Kiesow — wording on the proof card below.

<!-- testimonial_pool: ["@schafe-vorm-fenster/proof@0.3.5#zschiesche-gross-kiesow"]; clearance: pending (usage_rights unverified, Q-014) -->

### Proof card for story 2

<!-- clearance: pending — `zschiesche-gross-kiesow` is `usage_rights: unverified` (Q-014), same origin as the other four testimonials from the old website. -->
<!-- source_note: the package stores the quote in ASCII transliteration ("Fuer dieses Projekt", "Landbevoelkerung", "Haendler"); set here with umlauts, wording unchanged. The quote is not translated. -->
<!-- id: dein-ort-4-story-ratssitzung-demo-testimonial; content_type: proof-card; provenance: sourced; derived_from: ["@schafe-vorm-fenster/proof@0.3.5#zschiesche-gross-kiesow"]; status: draft -->

**Testimonial:** „Für dieses Projekt sehe ich unsere Landbevölkerung, aber auch mobile Händler als Gewinner." — Dr. A. Zschiesche, Bürgermeisterin Groß Kiesow (2022)

## Slot 5 — Value story 3: culture nobody would have searched for

<!-- id: dein-ort-5-story-kultur; content_type: value-story; provenance: sourced; derived_from: ["@schafe-vorm-fenster/proof@0.3.5#volkshochschule-uecker-randow"]; status: draft -->

**Title:** Culture you wouldn't have gone looking for

**Why it matters:** The concert in the next village, the exhibition at the manor — if you don't happen to hear about it, you miss it. In the calendar, it finds you instead of the other way round.

**Example:** a culture date from around {place}, live from the calendar.

**Testimonial:** Uwe Eichler, Wasserschloss Quilow — wording on the proof card below.

<!-- testimonial_pool: ["@schafe-vorm-fenster/proof@0.3.5#eichler-wasserschloss-quilow", "@schafe-vorm-fenster/proof@0.3.5#kulturlandbuero-broellin"]; clearance: pending (usage_rights unverified, Q-014) -->

The story now has a real anchor: the Volkshochschule Uecker-Randow
publishes its entire course programme through the village calendar, at its
Pasewalk site and in further place calendars — described by the
Kulturlandbüro Uecker-Randow (Maria Elsner, September 2024). Education and
culture nobody in the village would have gone looking for are in the
calendar, on the record.

### Proof card for story 3

<!-- clearance: pending — `eichler-wasserschloss-quilow` and `volkshochschule-uecker-randow` are both `usage_rights: unverified` (Q-014). -->
<!-- source_note: the package stores the quote in ASCII transliteration ("Flaechenland"); set here with umlauts, wording unchanged. The quote is not translated. -->
<!-- id: dein-ort-5-story-kultur-demo; content_type: proof-card; provenance: sourced; derived_from: ["@schafe-vorm-fenster/proof@0.3.5#eichler-wasserschloss-quilow", "@schafe-vorm-fenster/proof@0.3.5#volkshochschule-uecker-randow"]; status: draft -->

**Example:** The Volkshochschule Uecker-Randow publishes its course programme through the village calendar, Pasewalk site. — Kulturlandbüro Uecker-Randow, September 2024

**Testimonial:** „Der Dienst hilft dabei, Angebote in einem Flächenland besser sichtbar und auffindbar zu machen." — Uwe Eichler, Wasserschloss Quilow (2022)

## Slot 6 — Value story 4: the fifteen-minute radius

<!-- id: dein-ort-6-story-radius; content_type: value-story; provenance: sourced; derived_from: ["@schafe-vorm-fenster/proof@0.3.5#regional-footprint"]; status: draft -->

**Title:** What's happening fifteen minutes away

**Why it matters:** Your place doesn't stop at the municipal boundary. What's going on two villages over belongs in your calendar just as much as what's happening right outside your door.

**Example:** dates from around {place}, live from the calendar (position 2, "this week nearby").

The village calendar runs today in four German states, and each region
demonstrates a different property of the service — from density over
time in Vorpommern-Greifswald to the county-level interface in
Baden-Württemberg (`regional-footprint`, `cleared`, a qualitative
statement, no reach figure).

**Testimonial:** Holger Wendt, mayor of Rubkow — wording on the proof card below.

<!-- testimonial_pool: ["@schafe-vorm-fenster/proof@0.3.5#wendt-rubkow"]; clearance: pending (usage_rights unverified, Q-014) -->

### Proof card for story 4

<!-- clearance: pending — `wendt-rubkow` is `usage_rights: unverified` (Q-014). -->
<!-- source_note: wording unchanged from the record's evidence block. The quote is not translated. -->
<!-- id: dein-ort-6-story-radius-demo-testimonial; content_type: proof-card; provenance: sourced; derived_from: ["@schafe-vorm-fenster/proof@0.3.5#wendt-rubkow"]; status: draft -->

**Testimonial:** „Die selbstverwaltete und automatisierte Bereitstellung der Termindaten reduziert den Arbeitsaufwand unserer Gemeinde." — Holger Wendt, Bürgermeister in Rubkow (2022)

## Slot 7 — Home screen block

<!-- id: dein-ort-7-homescreen; content_type: howto-block; provenance: sourced; derived_from: [ia]; status: draft -->

**Heading:** How the calendar lands on your home screen

**iOS:** Open the {place} calendar in Safari. Tap "Share", then "Add to Home Screen". Done — from now on it opens like an app.

**Android:** Open the {place} calendar in Chrome. Tap the menu (three dots), then "Add to Home screen". Done.

Both instructions always sit side by side, regardless of the visitor's
device (no user-agent sniffing, TS-020 D4). In state B, this block
moves behind the neighbourhood module.

## Slot 8 — CTA reassurance (permanence promise)

<!-- id: dein-ort-8-permanence; content_type: closing-cta; provenance: sourced; derived_from: ["@schafe-vorm-fenster/offerings@0.3.3#community-calendar"]; status: draft -->

**Reassurance text:** Free, no sign-up, permanent: no introductory tier that quietly disappears later.

Source: `price.note` from `community-calendar` — "Free for readers
without any account … No limit on the number of dates per place.
Permanent, not an introductory tier." Free access has been a public
promise since 2022, not a pricing model that can quietly change.

## Context band (3 non-focus jobs)

<!-- source_note: the offer phrasing instead of a menu comes from gtm:concept/website-communication-principles.concept.md principle 2 ("order, do not exclude"); the three jobs and their wording from the job table in principle 1. Answers state/open.md row 95 for this page: its own band text rather than the shared home sentence. -->
<!-- id: dein-ort-9-context-band; content_type: context-band; provenance: sourced; derived_from: [ia]; status: draft -->

**Kicker:** Here for something else today?

- **Publish your dates:** Want to enter dates for your club, your fire brigade, or your municipality? → `/mitmachen`
- **Run your own calendar:** Want a calendar under your own name, on your own website? → `/dein-kalender`
- **Who is behind it:** Want to know who makes the village calendar? → `/ueber-uns`

This page's focus job is "know what is on". The band sits below it and
names the other three concerns, each in the reader's own words.
