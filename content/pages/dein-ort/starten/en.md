---
id: dein-ort-starten-de
page_id: TS-WEB-0021
route: "/dein-ort/starten"
seo:
  "/dein-ort/starten":
    title: "Start the calendar for your place"
    description: "Your place is not in the village calendar yet? One person, one flyer, one photo by WhatsApp — that is all it takes to get it added."
    provenance: generated
content_type: section
status: draft
locale: en
sources:
  - "@schafe-vorm-fenster/offerings@0.3.5#community-calendar"
  - "@schafe-vorm-fenster/audiences@0.3.3#actors"
  - "@schafe-vorm-fenster/proof@0.3.5#lehre-lelender"
  - "@schafe-vorm-fenster/media-echo@0.3.3#2022-nordkurier-plattform-doerfer"
  - "ia"
derived_from:
  - "@schafe-vorm-fenster/offerings@0.3.5#community-calendar"
  - "@schafe-vorm-fenster/audiences@0.3.3#actors"
  - "@schafe-vorm-fenster/proof@0.3.5#lehre-lelender"
  - "@schafe-vorm-fenster/media-echo@0.3.3#2022-nordkurier-plattform-doerfer"
  - "ia"
generated_by: "playbook-content-production@1.0.0"
generated_at: "2026-09-11"
tone_profile: "du-everywhere"
provenance: "sourced — 0 generated slots. Slot 2 now cites the 2022 Nordkurier record behind the permanence commitment and slot 4 the Lehre reference case; both are clearance: pending (Q-0045, Q-0014)"
compliance_check: "state/content-map.md#compliance-checks — TS-WEB-0021"
schema_note: "see content/pages/home/de.md — same TS-WEB-0007/schema gap, state/open.md #37"
images:
  - id: dein-ort-starten-hero
    slot: dein-ort-starten-1-ack
    ratio: hero
    provenance: real
    source: >-
      Wikimedia Commons, File:Groß Luckow, Feuerwehr und Gemeindezentrum.jpg —
      https://commons.wikimedia.org/wiki/File:Gro%C3%9F_Luckow,_Feuerwehr_und_Gemeindezentrum.jpg —
      Eigenaufnahme von Schafe vorm Fenster (Commons-Konto „Schafevormfenster", own work), Mai 2025,
      3914×2281. Nachweis: content/legal/image-credits.md.
    alt: >-
      The volunteer fire station and the community centre of Groß Luckow, the church tower behind
      them.
    licence: CC0 1.0
    status: real
    file: /images/real/dein-ort-starten-hero.webp
    width: 800
    height: 900
    wide_file: /images/real/dein-ort-starten-hero-wide.webp
    wide_width: 1400
    wide_height: 600
---

# Start your place (`/dein-ort/starten`)

Reached when the place search finds **no** place at all (TS-WEB-0021 D3) —
the difference from `/dein-ort` state B is deliberate: there, dates are
missing; here, the place itself is missing from the system. This page
addresses the reader directly, like every page of this website
(TS-WEB-0021 D9 as amended 2026-09-24, review decision 15) — what differs
is not the form of address but the ask: "you could be the first" belongs
exclusively to `/dein-ort`, where a calendar is waiting. The earlier
"never direct" is retired; anything still citing it cites a retired
determination.

## Slot 1 — Acknowledgment with place name

<!-- id: dein-ort-starten-1-ack; content_type: hero; provenance: sourced; derived_from: [ia]; status: draft -->

**Headline (with place):** {place} isn't in the village calendar yet.

**Headline (without place, fallback):** This place isn't in the village calendar yet.

**Subline:** That can change — with one WhatsApp photo of the next flyer.

The place name is plain text, escaped, never part of a link, a
calendar row, or a number (TS-WEB-0021 D6).

## Slot 2 — What it takes

<!-- clearance: pending for the press record — the 2022 Nordkurier entry carries no `usage_rights` (Q-0045, state/open.md #1). The offering record itself is free to use. -->
<!-- id: dein-ort-starten-2-was-es-braucht; content_type: value-story; provenance: sourced; derived_from: ["@schafe-vorm-fenster/offerings@0.3.5#community-calendar", "@schafe-vorm-fenster/media-echo@0.3.3#2022-nordkurier-plattform-doerfer"]; status: draft -->

**Heading:** One person is enough to get {place} into the calendar

**Text:** One person. A flyer that already exists anyway. One photo by WhatsApp. That's it: free, no sign-up fee, permanent.

**Kicker:** What it takes

Source: `price.note` from `community-calendar` — "Free for readers without
any account … Permanent, not an introductory tier." The offer was free
during the React-EU/ESF funding period, and that it would stay free
afterwards was stated in the Nordkurier in 2022: "Das Basisangebot, das
unter anderem beliebig viele Termine pro Dorf oder Gemeinde erlaubt, werde
es auch danach bleiben." The offering record calls that a public
commitment rather than a pricing decision that can be quietly reversed
(the same commitment as `/dein-ort` slot 8).

## Slot 3 — Live module, nearest active place

<!-- id: dein-ort-starten-3-beispiel; content_type: live-module-frame; provenance: sourced; derived_from: [ia]; status: draft -->

**Module heading:** Here's how it runs in {example_place}

**Kicker:** This is what it looks like

The place name shown comes from an actually covered, active
place (TS-WEB-0021 D7) — never from the searched-for, not-found place.

## Slot 4 — Who usually starts it

<!-- clearance: pending for `lehre-lelender` (`usage_rights: unverified`, the foundation's written clearance is outstanding). The audience record is free to use. -->
<!-- id: dein-ort-starten-4-wer; content_type: value-story; provenance: sourced; derived_from: ["@schafe-vorm-fenster/audiences@0.3.3#actors", "@schafe-vorm-fenster/proof@0.3.5#lehre-lelender"]; status: draft -->

**Heading:** Usually a club or the fire brigade

**Text:** Sometimes the parish, an initiative, a cultural venue, or a mobile service like a bakery or doctor's van. Often a single person doing it alongside everything else.

**Kicker:** Who usually gets this started

Source: `@schafe-vorm-fenster/audiences#actors`, "Context" field — the
audience record's own enumeration, no new invention.

Tone (TS-WEB-0021 D9): this paragraph assigns the task to no one. It names
who it usually is and leaves the reader to recognize herself in it.

One documented case: in the municipality of Lehre (Helmstedt district,
Lower Saxony) the Stiftung Lebendiges Lehre made the start — 17 places
under a calendar name of their own, and at the Abend der Engagierten on
27 August 2026 there were 17 place-specific flyers with QR codes on the
tables of around 70 volunteers (`lehre-lelender`, clearance still
outstanding).

## Slot 5 — Place search (again)

<!-- id: dein-ort-starten-5-search; content_type: section; provenance: sourced; derived_from: [ia]; status: draft -->

**Heading:** Typed it wrong? Search again

**Search input (placeholder):** Your place

**Hint below the field:** Type the place name — suggestions start at the second letter.

Same component as on `/` and `/dein-ort` (TS-WEB-0008 D7) — no behaviour of
its own. The hint now lives here rather than only in code (state/open.md
row 94), so the English page does not inherit the component's German
default.

## Handover to registration

<!-- id: dein-ort-starten-6-cta; content_type: closing-cta; provenance: sourced; derived_from: [ia]; status: draft -->

**CTA label (primary):** Add {place} → `/mitmachen/registrieren?ort={place}`

**CTA label (without place, fallback):** Add your place → `/mitmachen/registrieren`

**Closing heading:** One flyer is enough to put {place} on the map.

**Reassurance text:** Free, no signup fee, permanent.

The value carries over unchanged and URL-encoded (TS-WEB-0021 D8) — no app
link, no pre-filled account, no claim that {place} is already
registered (honesty rule, TS-WEB-0021 D8). With no place name, the second
label stands in: it names no place because none is settled, and so
promises none either (state/open.md row 94).

## Context band (3 non-focus jobs)

<!-- source_note: the offer phrasing instead of a menu comes from gtm:concept/website-communication-principles.concept.md principle 2; the three jobs and their wording from the job table in principle 1. Answers state/open.md row 95 for this page. -->
<!-- id: dein-ort-starten-7-context-band; content_type: context-band; provenance: sourced; derived_from: [ia]; status: draft -->

**Kicker:** Here for something else today?

- **See what's on:** Want to look at what's happening nearby first? → `/dein-ort`
- **Run your own calendar:** Want a calendar under your own name, on your own website? → `/dein-kalender`
- **Who is behind it:** Want to know who makes the village calendar? → `/ueber-uns`

This page's focus job is "publish our dates". Whoever lands here came from
a place search — the band keeps the other three concerns reachable without
selling them.
