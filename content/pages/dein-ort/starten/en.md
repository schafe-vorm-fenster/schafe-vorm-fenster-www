---
id: dein-ort-starten-de
page_id: TS-021
route: "/dein-ort/starten"
content_type: section
status: draft
locale: en
sources:
  - "@schafe-vorm-fenster/offerings@0.3.3#community-calendar"
  - "@schafe-vorm-fenster/audiences@0.3.3#actors"
  - "ia"
derived_from:
  - "@schafe-vorm-fenster/offerings@0.3.3#community-calendar"
  - "@schafe-vorm-fenster/audiences@0.3.3#actors"
  - "ia"
generated_by: "playbook-content-production@1.0.0"
generated_at: "2026-09-11"
tone_profile: "du-everywhere"
provenance: "sourced — 0 generated slots; EN translation of content/pages/dein-ort/starten/de.md, same source ids per slot"
compliance_check: "state/content-map.md#compliance-checks — TS-021"
schema_note: "see content/pages/home/de.md — same TS-007/schema gap, state/open.md #37"
---

# Start your place (`/dein-ort/starten`)

Reached when the place search finds **no** place at all (TS-021 D3) —
the difference from `/dein-ort` state B is deliberate: there, dates are
missing; here, the place itself is missing from the system. This page
never addresses the visitor directly with "you could be the first"
(TS-021 D9, DEC-071) — that sentence belongs exclusively to
`/dein-ort`.

## Slot 1 — Acknowledgment with place name

<!-- id: dein-ort-starten-1-ack; content_type: hero; provenance: sourced; derived_from: [ia]; status: draft -->

**Headline (with place):** {place} isn't in the village calendar yet.

**Headline (without place, fallback):** This place isn't in the village calendar yet.

**Subline:** That can change — with one WhatsApp photo of the next flyer.

The place name is plain text, escaped, never part of a link, a
calendar row, or a number (TS-021 D6).

## Slot 2 — What it takes

<!-- id: dein-ort-starten-2-was-es-braucht; content_type: value-story; provenance: sourced; derived_from: ["@schafe-vorm-fenster/offerings@0.3.3#community-calendar"]; status: draft -->

**Heading:** What it takes to get {place} into the calendar

**Text:** One person. A flyer that already exists anyway. One photo by WhatsApp. That's it: free, no sign-up fee, permanent.

Source: `price.note` from `community-calendar` — free, "forever",
publicly promised since 2022 (the same commitment as `/dein-ort`
slot 8).

## Slot 3 — Live example, nearest active place

<!-- id: dein-ort-starten-3-beispiel; content_type: live-module-frame; provenance: sourced; derived_from: [ia]; status: draft -->

**Module heading:** Here's what that looks like, for example — in {example_place}

**Note:** Example, not {place}. {place} itself never appears as data in this module.

The place name in the example comes from an actually covered, active
place (TS-021 D7) — never from the searched-for, not-found place.

## Slot 4 — Who usually starts it

<!-- id: dein-ort-starten-4-wer; content_type: value-story; provenance: sourced; derived_from: ["@schafe-vorm-fenster/audiences@0.3.3#actors"]; status: draft -->

**Heading:** Who usually gets this started

**Text:** In most places, it's a club, the fire brigade, the parish, an initiative, a cultural venue, or a mobile service like a bakery or doctor's van. Often a single person doing it alongside everything else.

Source: `@schafe-vorm-fenster/audiences#actors`, "Context" field — the
audience record's own enumeration, no new invention.

Tone (TS-021 D9): this paragraph assigns the task to no one. It names
who it usually is and leaves the reader to recognize herself in it.

## Slot 5 — Place search (again)

<!-- id: dein-ort-starten-5-search; content_type: section; provenance: sourced; derived_from: [ia]; status: draft -->

**Heading:** Typed it wrong? Search again

**Search input (placeholder):** Your postcode

Same component as on `/` and `/dein-ort` (TS-008 D7) — no behaviour of
its own.

## Handover to registration

<!-- id: dein-ort-starten-6-cta; content_type: closing-cta; provenance: sourced; derived_from: [ia]; status: draft -->

**CTA label (primary):** Add {place} → `/mitmachen/registrieren?ort={place}`

The value carries over unchanged and URL-encoded (TS-021 D8) — no app
link, no pre-filled account, no claim that {place} is already
registered (honesty rule, TS-021 D8).
