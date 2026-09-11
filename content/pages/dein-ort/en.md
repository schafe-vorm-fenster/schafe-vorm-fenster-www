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
  - "@schafe-vorm-fenster/proof@0.3.5#wendt-rubkow"
  - "@schafe-vorm-fenster/offerings@0.3.3#community-calendar"
  - "ia"
derived_from:
  - "@schafe-vorm-fenster/proof@0.3.5#impftermine-landkreis"
  - "@schafe-vorm-fenster/proof@0.3.5#regional-footprint"
  - "@schafe-vorm-fenster/offerings@0.3.3#community-calendar"
  - "ia"
generated_by: "playbook-content-production@1.0.0"
generated_at: "2026-09-11"
tone_profile: "du-everywhere"
provenance: "mixed — sourced per section; 4 generated demo-testimonial/demo-example slots added under the prototype completeness override (slots 3, 4, 5, 6 — state/open.md Dummy-Content); underlying value-story text stays sourced, only the demo testimonial/example additions are generated; EN translation of content/pages/dein-ort/de.md, same source ids per slot"
compliance_check: "state/content-map.md#compliance-checks — TS-020"
schema_note: "see content/pages/home/de.md — same TS-007/schema gap, state/open.md #37"
---

# Your place (`/dein-ort`)

Two states on one route (TS-020 D2): **A** — dates exist, **B** — the
place is on file but empty (focus job switches to "publish our
dates"). Block and DOM order stay the same in both states; only
block 1's offer text changes.

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

**Why it matters:** When the bakery van comes and where it stops isn't a minor detail — it decides whether you get fresh bread or not. That belongs in the same calendar as the village fair.

**Example:** a recurring delivery date in {place} or nearby, live from the calendar.

**Testimonial:** *empty by design — no cleared quote*

<!-- provenance: sourced-empty-by-design; testimonial_pool: ["@schafe-vorm-fenster/proof@0.3.5#kurzweg-baeckerei"]; usage_rights: unverified (Q-014) -->

As long as `kurzweg-baeckerei`'s `usage_rights` stays `unverified`, the
story renders in three parts (aspect → why → example), with no quote.
No substitute text, no paraphrase, no "users say" (SRC-001 §4).

<!-- id: dein-ort-3-story-baeckerwagen-demo-testimonial; content_type: proof-card; provenance: generated; derived_from: []; status: draft; demo: true -->

**Demo testimonial (prototype, `Demo Data` badge):** "Since the bakery van's been in the calendar, we haven't missed it once." — Bakery, Example municipality Musterdorf. Recognizably exemplary, replaces no cleared quote.

## Slot 4 — Value story 2: the council meeting

<!-- id: dein-ort-4-story-ratssitzung; content_type: value-story; provenance: sourced; derived_from: ["@schafe-vorm-fenster/proof@0.3.5#impftermine-landkreis"]; status: draft -->

**Title:** The council meeting, before it happens

**Why it matters:** If you want a say, you need to hear about the meeting before it passes, not afterwards in the minutes. Official dates belong in the same calendar as everything else in the place.

**Example:** an official date from {place} or the county, live from the calendar.

Proof of resilience in a crisis: during the pandemic, all of the
county's vaccination offers and test-centre opening hours ran
day-current and place-accurate through the village calendars
(`impftermine-landkreis`, `cleared`).

**Testimonial:** *empty by design — no cleared quote*

<!-- provenance: sourced-empty-by-design; testimonial_pool: ["@schafe-vorm-fenster/proof@0.3.5#zschiesche-gross-kiesow"]; usage_rights: unverified (Q-014) -->

<!-- id: dein-ort-4-story-ratssitzung-demo-testimonial; content_type: proof-card; provenance: generated; derived_from: []; status: draft; demo: true -->

**Demo testimonial (prototype, `Demo Data` badge):** "I found out about the council meeting from the calendar, not afterwards from the minutes." — Resident, Example municipality Musterdorf. Recognizably exemplary, replaces no cleared quote.

## Slot 5 — Value story 3: culture nobody would have searched for

<!-- id: dein-ort-5-story-kultur; content_type: value-story; provenance: sourced-empty-by-design; derived_from: [ia]; status: draft -->

**Title:** Culture you wouldn't have gone looking for

**Why it matters:** The concert in the next village, the exhibition at the manor — if you don't happen to hear about it, you miss it. In the calendar, it finds you instead of the other way round.

**Example:** a culture date from around {place}, live from the calendar.

**Testimonial:** *empty by design — no cleared quote*

<!-- provenance: sourced-empty-by-design; testimonial_pool: ["@schafe-vorm-fenster/proof@0.3.5#kulturlandbuero-broellin", "@schafe-vorm-fenster/proof@0.3.5#eichler-wasserschloss-quilow"]; usage_rights: unverified (Q-014); note: "no covered backing anecdote exists — in places with no culture date, this story carries no proof today (TS-020 open points)" -->

<!-- id: dein-ort-5-story-kultur-demo; content_type: proof-card; provenance: generated; derived_from: []; status: draft; demo: true -->

**Demo example and demo testimonial (prototype, `Demo Data` badge):** Example date "Exhibition at the manor park, Example municipality Musterdorf" — "I'd never have heard about the exhibition otherwise, it was just there in the calendar." — Visitor, Example municipality Musterdorf. Date, place, and quote are entirely invented and recognizably exemplary; they only show what the story would look like with proof, and replace neither a real anecdote nor a cleared quote.

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

**Testimonial:** *empty by design — no cleared quote*

<!-- provenance: sourced-empty-by-design; testimonial_pool: ["@schafe-vorm-fenster/proof@0.3.5#wendt-rubkow"]; usage_rights: unverified (Q-014) -->

<!-- id: dein-ort-6-story-radius-demo-testimonial; content_type: proof-card; provenance: generated; derived_from: []; status: draft; demo: true -->

**Demo testimonial (prototype, `Demo Data` badge):** "What's happening two villages over, I now see just as clearly as what's happening right here." — Resident, Example municipality Musterdorf. Recognizably exemplary, replaces no cleared quote.

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
