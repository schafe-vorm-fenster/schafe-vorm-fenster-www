---
id: mitmachen-de
page_id: TS-022
route: "/mitmachen"
content_type: section
status: draft
locale: en
sources:
  - "@schafe-vorm-fenster/audiences@0.3.3#actors"
  - "@schafe-vorm-fenster/messaging@0.1.0#actors--community-calendar"
  - "@schafe-vorm-fenster/offerings@0.3.3#community-calendar"
  - "ia"
derived_from:
  - "@schafe-vorm-fenster/audiences@0.3.3#actors"
  - "@schafe-vorm-fenster/messaging@0.1.0#actors--community-calendar"
  - "@schafe-vorm-fenster/offerings@0.3.3#community-calendar"
  - "ia"
generated_by: "playbook-content-production@1.0.0"
generated_at: "2026-09-11"
tone_profile: "du-everywhere"
provenance: "mixed — 6 sourced, 3 generated (slots 6a, 8 from Phase 2; slot 7 demo proof cards added under the prototype completeness override — state/open.md Dummy-Content); EN translation of content/pages/mitmachen/de.md, same source ids per slot"
compliance_check: "state/content-map.md#compliance-checks — TS-022"
schema_note: "see content/pages/home/de.md — same TS-007/schema gap, state/open.md #37"
open_points:
  - "state/open.md #17 — permanence-promise reassurance (slot 8) and the stage-0 reference place (slot 6a) are generated/editorial-assumption content pending a hub record"
---

# Join in (`/mitmachen`)

Focus job "publish our dates" throughout, no price, no "Portalize", no
`local-advertising` on this page (TS-022 D1, D7, D11; DEC-052 §1/§3).
Order: hero → objections → three publishing paths → live example →
proof (TS-022 D2).

## Slot 1 — Hero (mechanism: whatsapp)

<!-- id: mitmachen-1-hero; content_type: hero; provenance: sourced; derived_from: ["@schafe-vorm-fenster/messaging@0.1.0#actors--community-calendar"]; status: draft -->

**Aha question:** A photo of the flyer by WhatsApp, and the date's in the calendar?

**Text:** You've already printed the flyer anyway. Photograph it, send the picture by WhatsApp, done: the date is visible in your place, and in the places around it at the same time.

**CTA label (primary):** Sign up for free

Source: `headline` and `relievers[0]` of `actors--community-calendar`.
Only this block carries `data-block="scene"` and the mechanism
attribute `whatsapp` (TS-022 D4).

## Slot 2 — Objection block: why the usual channels don't reach far enough

<!-- id: mitmachen-2-objections; content_type: objection-list; provenance: sourced; derived_from: ["@schafe-vorm-fenster/audiences@0.3.3#actors", "@schafe-vorm-fenster/messaging@0.1.0#actors--community-calendar"]; status: draft -->

**Heading:** Why what you already do doesn't reach everyone

- Flyers in letterboxes stop at the village boundary — and often don't get delivered at all, because nobody has time for it.
- The newspaper and the local gazette have deadlines — a rescheduled or cancelled date arrives too late, or not at all.
- Your own club website and your own social media channels mainly reach people who already follow you.
- Anyone organizing as a volunteer has no time left for promotion on top of the organizing itself.
- Learning a new tool is one more hurdle — for most local groups, communication isn't the main job.

Source: `@schafe-vorm-fenster/audiences#actors` field "Problem" (dates
are typed "by hand" into several channels) and `pains[]` from
`actors--community-calendar` (5 entries). No channel count is stated —
"six" in the audience record is a figure of speech, not an enumeration
(TS-022 D3).

## Slot 3 — Publishing path 1: WhatsApp

<!-- id: mitmachen-3-path-whatsapp; content_type: publishing-path; provenance: sourced; derived_from: ["@schafe-vorm-fenster/offerings@0.3.3#community-calendar"]; status: draft -->

**Title:** Flyer by WhatsApp

**Steps:**

1. Photograph the flyer you already have.
2. Send the photo by WhatsApp.
3. The date appears in your place's calendar and the surrounding area.

Availability: `generally-available` (hub record `community-calendar`).

## Slot 4 — Publishing path 2: connect your own calendar

<!-- id: mitmachen-4-path-calendar; content_type: publishing-path; provenance: sourced; derived_from: ["@schafe-vorm-fenster/offerings@0.3.3#community-calendar"]; status: draft -->

**Title:** Connect your own calendar

**Steps:**

1. Give us your existing Google Calendar.
2. You keep entering dates there as usual.
3. Changes, reschedules, and cancellations are picked up automatically by the village calendar.

Availability: `generally-available` (hub record `community-calendar`).

## Slot 5 — Publishing path 3: your website as the source

<!-- id: mitmachen-5-path-website; content_type: publishing-path; provenance: sourced; derived_from: ["@schafe-vorm-fenster/offerings@0.3.3#community-calendar"]; status: draft -->

**Title:** Your website as the source

**Status badge:** In testing (Alpha)

**Steps:**

1. You tell us the page where your dates are listed.
2. We set up the import.
3. New dates on your website appear in the village calendar automatically.

Availability: **Alpha** according to the hub record, not
`generally-available` — the status badge must stay visible as long as
that holds (TS-022 D4).

**Cross-reference (only here, one sentence, secondary):** If your club or municipality wants its own calendar on its own website instead of a source for the village calendar, that's a different offering: → `/dein-kalender`

Source: TS-022 D9 — exactly one link to `/dein-kalender`, inside an
`aside`, with no price, no tier list, never `data-cta="primary"`.

## Slot 6 — Live example

<!-- id: mitmachen-6-beispiel; content_type: live-module-frame; provenance: sourced; derived_from: [ia]; status: draft -->

**Module heading:** Here's what that looks like in {place}

When the place is known: the nearest active place with dates (TS-008
position 3 → 1). Never the visitor's own searched-for place, and never
a place with no coverage as the data (WEB-F-024).

### Slot 6a — Reference place for stage 0 (no context known)

<!-- id: mitmachen-6a-reference-place; content_type: configuration; provenance: generated; derived_from: []; status: draft -->

**Editorial assumption (not an invented data record):** As long as no
source names a reference place for stage 0 (TS-022 open points), this
page sets **Groß Kiesow** as the configured example place — an
actually covered place with documented activity
(`zschiesche-gross-kiesow`, a mayor's quote, though `unverified` today,
is anchored to this place). No invented place, no invented dates — the
choice is an editorial decision, not a generated claim, and is
registered as such in `state/open.md` #17. To be replaced once
content/editorial names a different or additional reference place.

## Slot 7 — Proof block (3 elements, publish-weighted)

<!-- id: mitmachen-7-proof; content_type: proof-card; provenance: sourced-empty-by-design; derived_from: ["@schafe-vorm-fenster/proof@0.3.5"]; status: draft -->

Selection and order are the relevance engine's job, with the
"publish-our-dates" weight profile (TS-005 D5, DEC-048). An empty slot
weakens the claim, but is never replaced by invented text.

<!-- id: mitmachen-7-proof-demo; content_type: proof-card; provenance: generated; derived_from: []; status: draft; demo: true -->

**Demo elements (prototype, `Demo Data` badge):** As long as no
selection is cleared, the prototype shows three example cards instead
of an empty area:

1. "A photo of the flyer by WhatsApp, done — it really wasn't more effort than that." — Chair, Cultural association Example municipality Musterdorf
2. "Our dates now reach the neighbouring villages too, without us having to learn anything new for it." — Volunteer fire brigade, Example place Musterhagen
3. "We've started entering our service times ourselves recently, straight from the existing calendar." — Parish, Example municipality Musterdorf

Clubs, places, and quotes are entirely invented and recognizably
exemplary; they replace no cleared proof element.

## Slot 8 — Closing CTA with permanence reassurance

<!-- id: mitmachen-8-closing; content_type: closing-cta; provenance: generated; derived_from: []; status: draft -->

**CTA label (identical to slot 1, primary):** Sign up for free

**Reassurance text (generated, generic, no number or date):** Sign up free, stay free. That's what the village calendar has stood for since it began.

No hub proof directly backs this reassurance (the public 2022 promise
lives only in `media-echo`, not in `proof/` — TS-022 open points,
`state/open.md` #17). The sentence stays deliberately generic, names no
year and no order of magnitude, and is marked `provenance: generated`.
Once a citable proof element exists, it replaces this sentence.

## Context band and closing

<!-- id: mitmachen-9-context-band; content_type: context-band; provenance: sourced; derived_from: [ia]; status: draft -->

Rendered by the layout/TS-006 — no text of this page's own beyond the
three non-focus jobs (see `home-10-context-band` for the canonical job
wording).
