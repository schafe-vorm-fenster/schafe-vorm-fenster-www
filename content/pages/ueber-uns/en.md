---
id: ueber-uns-de
page_id: TS-027
route: "/ueber-uns"
seo:
  "/ueber-uns":
    title: "Built in a village"
    description: "Who runs the calendar, and why it stays free for the villages: a place of a few hundred people cannot afford a service with a sales team."
    provenance: generated
content_type: section
status: draft
locale: en
sources:
  - "@schafe-vorm-fenster/offerings@0.3.3#community-calendar"
  - "@schafe-vorm-fenster/offerings@0.3.3#portalize-calendar"
  - "@schafe-vorm-fenster/proof@0.3.5#founder-former-volunteer-mayor"
  - "@schafe-vorm-fenster/proof@0.3.5#in-operation-since-2018"
  - "@schafe-vorm-fenster/proof@0.3.5"
  - "@schafe-vorm-fenster/media-echo@0.3.3"
  - "@schafe-vorm-fenster/people@0.3.6#jan-henrik-hempel"
  - "@schafe-vorm-fenster/people@0.3.6#christian-sauer"
  - "@schafe-vorm-fenster/brand-identity@0.1.4#schafe-vorm-fenster"
  - "@schafe-vorm-fenster/proof@0.3.5#noerd-award-2026-smart-community"
  - "@schafe-vorm-fenster/proof@0.3.5#impftermine-landkreis"
  - "@schafe-vorm-fenster/proof@0.3.5#ukraine-integration-dorfleben"
  - "@schafe-vorm-fenster/proof@0.3.5#google-baecker-schlatkow"
  - "@schafe-vorm-fenster/proof@0.3.5#homeoffice-mobile-anbieter"
  - "@schafe-vorm-fenster/proof@0.3.5#kulturlandbuero-broellin"
  - "@schafe-vorm-fenster/media-echo@0.3.3#2026-01-zukunftswege-ost-vollblutdigitalisierer"
  - "ia"
derived_from:
  - "@schafe-vorm-fenster/offerings@0.3.3#community-calendar"
  - "@schafe-vorm-fenster/offerings@0.3.3#portalize-calendar"
  - "@schafe-vorm-fenster/proof@0.3.5#founder-former-volunteer-mayor"
  - "@schafe-vorm-fenster/proof@0.3.5#in-operation-since-2018"
  - "@schafe-vorm-fenster/people@0.3.6#jan-henrik-hempel"
  - "@schafe-vorm-fenster/people@0.3.6#christian-sauer"
  - "@schafe-vorm-fenster/brand-identity@0.1.4#schafe-vorm-fenster"
  - "@schafe-vorm-fenster/proof@0.3.5#noerd-award-2026-smart-community"
  - "@schafe-vorm-fenster/proof@0.3.5#impftermine-landkreis"
  - "@schafe-vorm-fenster/proof@0.3.5#ukraine-integration-dorfleben"
  - "@schafe-vorm-fenster/proof@0.3.5#google-baecker-schlatkow"
  - "@schafe-vorm-fenster/proof@0.3.5#homeoffice-mobile-anbieter"
  - "@schafe-vorm-fenster/proof@0.3.5#kulturlandbuero-broellin"
  - "@schafe-vorm-fenster/media-echo@0.3.3#2026-01-zukunftswege-ost-vollblutdigitalisierer"
  - "ia"
generated_by: "playbook-content-production@1.0.0"
generated_at: "2026-09-11"
tone_profile: "du-everywhere"
provenance: "sourced — 0 generated slots left. Slot 1 gained the real origin story and a real founder quote; slot 3 names six cleared proof elements and fills the reserved testimonial place with a real, clearance-pending testimonial; EN translation of content/pages/ueber-uns/de.md, same source ids per slot"
compliance_check: "state/content-map.md#compliance-checks — TS-027"
open_points:
  - "Clearance pending — the testimonial in slot 3 (`kulturlandbuero-broellin`) carries `usage_rights: unverified` (Q-014) and its own record says 'nicht für neue öffentliche Flächen verwenden'. Protected preview only; go-live needs written clearance or the place goes back to empty"
  - "Code follow-up — `app/[lang]/ueber-uns/page.tsx` still builds block 3 from a hard-coded `DEMO_PROOF` array with `demo: true`. Slot 3 now carries six real, cleared elements; the page should read them instead (state/open.md #109)"
schema_note: "see content/pages/home/de.md — same TS-007/schema gap, state/open.md #37"
images:
  - id: ueber-uns-hero
    slot: ueber-uns-1-origin
    ratio: hero
    provenance: generated
    brief: >-
      Ein Dorf mit wenigen hundert Einwohnern, von einem Feldweg aus gesehen, Februar am späten
      Nachmittag: kahle Bäume, Backsteinhäuser, ein Storchennest auf einem Mast, Pfützen im Weg.
      Tief stehendes graues Licht, fast keine Farbe. Kein Mensch im Bild. Nicht zeigen: Schrift,
      Logos, lesbare Ortsschilder, Schnee, Idylle.
    style: documentary photo, natural light, 35mm, muted colours, no text
    alt: A small village seen from a field track in February, bare trees and brick houses.
    status: generated
    model: bfl/flux-pro-1.1
    generated_at: "2026-09-12"
    prompt_hash: df3c8bdb1c615bec
    file: /images/generated/ueber-uns-hero.webp
    width: 800
    height: 900
    wide_file: /images/generated/ueber-uns-hero-wide.webp
    wide_width: 1190
    wide_height: 510
  - id: ueber-uns-founder-portrait
    slot: ueber-uns-1-origin
    ratio: portrait
    provenance: real
    source: >-
      @schafe-vorm-fenster/people@0.3.6#jan-henrik-hempel/assets/2026-05-noerdaward2026-DSC09263-portrait.jpeg
      — `license: free use, credit required`, `press_clearance: cleared`, 1826×1826. Binärdatei
      liegt im go-to-market-os-Repository, das npm-Paket liefert nur den .asset.md-Deskriptor.
    alt: Jan-Henrik Hempel looking into the camera, the darkened hall behind him.
    credit: "@rightvisionstudios & NØRD2026"
    lcp: true
    status: real
    file: /images/real/ueber-uns-founder-portrait.webp
    width: 1152
    height: 1440
  - id: ueber-uns-team-jan-henrik-hempel
    slot: ueber-uns-5-team
    ratio: portrait
    provenance: real
    source: >-
      @schafe-vorm-fenster/people@0.3.6#jan-henrik-hempel/assets/2021-workshop-quilow-portrait.jpeg
      — Eigenaufnahme (in-house), unbeschränkte Nutzung, kein Credit nötig. Nicht dasselbe Bild wie
      im Herkunftsblock, damit die Seite ein Porträt nicht zweimal zeigt.
    alt: Jan-Henrik Hempel explaining something with both hands raised, timber beams behind him.
    status: real
    file: /images/real/ueber-uns-team-jan-henrik-hempel.webp
    width: 1152
    height: 1440
  - id: ueber-uns-team-christian-sauer
    slot: ueber-uns-5-team
    ratio: portrait
    provenance: real
    source: >-
      @schafe-vorm-fenster/people@0.3.6#christian-sauer/assets/2019-christian.jpg — `license:
      unverified`, Fotograf unbekannt, `press_clearance: unverified`. Nicht freigegeben, und ein
      Porträt einer realen Person wird nie generiert (DEC-068 Regel 3); bis zur Klärung zeigt die
      Karte die Fläche „Foto gesucht“ (TS-027-A9).
    alt: Christian Sauer outdoors, looking into the camera.
    status: needed
---

# About us (`/ueber-uns`)

Focus job "understand who is behind it", **no conversion of its own**
(TS-027 D1). The fixed headline from DEC-036 §3 appears only here — on
no other page.

## Slot 1 — Origin (h1, fixed)

<!-- id: ueber-uns-1-origin; content_type: hero; provenance: sourced; derived_from: [ia, "@schafe-vorm-fenster/brand-identity@0.1.4#schafe-vorm-fenster", "@schafe-vorm-fenster/offerings@0.3.3#community-calendar", "@schafe-vorm-fenster/offerings@0.3.3#portalize-calendar", "@schafe-vorm-fenster/proof@0.3.5#founder-former-volunteer-mayor", "@schafe-vorm-fenster/people@0.3.6#jan-henrik-hempel", "@schafe-vorm-fenster/media-echo@0.3.3#2026-01-zukunftswege-ost-vollblutdigitalisierer"]; status: draft -->

**h1 (fixed, DEC-036 §3 — not to be reworded):** Built in a village, run from a village.

**Text (causal chain):** A village of around 400 people can't afford a service that needs a sales team. That's why the village calendar is free, and stays that way. That's why the licence for your own calendar costs €480 a year instead of a project budget.

**Sentence with proof:** The founder was a volunteer mayor himself — he knows the office this service helps from the inside.

**Origin (how it started, and the name):** It began with the search for fresh bread rolls. After the family moved from Berlin to Schlatkow, they asked about a baker's van for two weeks, finally lay in wait one morning, and chased the van to the next village to arrange a stop in Schlatkow. The name comes from the years as mayor of Schmatzin: the municipal sheep pasture was visible from the kitchen window.

**Quote (founder):** "Collect all of it, and suddenly every village has something on every day. All we have to do is make it visible." — Jan-Henrik Hempel

The figure "around 400 inhabitants" and the causal chain are the brand
profile's own words (`brand-identity@0.1.4#schafe-vorm-fenster`: "A
place of four hundred inhabitants cannot carry a service that needs a
salesperson to sell it"). Price figures from `community-calendar` (free,
"forever") and `portalize-calendar` (480/EUR/year) — read, not typed.
Proof for the mayor sentence: `founder-former-volunteer-mayor`
(`cleared`). Origin paragraph: the "Origin story" section of the same
brand profile, plus the Zukunftswege Ost-Vorpommern portrait (January
2026). The quote is verbatim in the person profile
(`press_clearance: cleared`) and in the portrait; the German file
carries the German original.

## Slot 2 — Operating counters (live module)

<!-- id: ueber-uns-2-counters; content_type: section; provenance: sourced; derived_from: ["@schafe-vorm-fenster/proof@0.3.5#in-operation-since-2018"]; status: draft -->

**Text:** Running since 2018. Active today in {n} places.

Only the year is a fixed proof point (`in-operation-since-2018`,
`cleared`) — the place count counts live. No static reach figure
(`reach-and-usage` is `expired`, SRC-001 §5); with no live value, only
the sentence stands, with no number, never an estimated one.

## Slot 3 — Proof stream (7 elements, 1 type-reserved)

<!-- id: ueber-uns-3-proof-stream; content_type: proof-card; provenance: sourced; derived_from: ["@schafe-vorm-fenster/proof@0.3.5", "@schafe-vorm-fenster/media-echo@0.3.3", "@schafe-vorm-fenster/proof@0.3.5#noerd-award-2026-smart-community", "@schafe-vorm-fenster/proof@0.3.5#in-operation-since-2018", "@schafe-vorm-fenster/proof@0.3.5#founder-former-volunteer-mayor", "@schafe-vorm-fenster/proof@0.3.5#impftermine-landkreis", "@schafe-vorm-fenster/proof@0.3.5#ukraine-integration-dorfleben", "@schafe-vorm-fenster/proof@0.3.5#google-baecker-schlatkow"]; status: draft -->

**Heading:** What others say

Pool: the full `proof` set plus `media-echo` (31 entries). Six of the
seven places can be filled today with cleared proof — all six carry
`usage_rights: cleared`:

1. NØRD AWARD 2026, Smart Community category, under Bitkom patronage, awarded on 28 May 2026 at the NØRD digital convention in Rostock. — NØRD digital convention / digitales MV
2. The village calendar has been running since 2018 — not a pilot, not a prototype. — media-echo set, earliest third-party record Nordkurier, June 2018
3. The founder held, as a volunteer mayor, the office this service serves. — Nordkurier 2019 and 2022; Zukunftswege Ost-Vorpommern 2026
4. During the pandemic, every vaccination slot and every testing-centre opening time in the county was published through the village calendars, day-current and place-precise. — Landkreis Vorpommern-Greifswald, 2022
5. In 2022 the village calendar helped Ukrainian refugees join village life: club meetings, events, and mobile traders. — eu:react final report, July 2022
6. Search Google for "Bäcker Schlatkow" and you find the mobile bakery van and its day — not branches in Anklam. — eu:react final report, July 2022

The order here is the source list, not the display order: which element
sits in which place is decided by the relevance engine (TS-005) out of
the same pool. The seventh place is reserved for the `testimonial` type
and is never backfilled with an element of another type (TS-027 D5).

<!-- id: ueber-uns-3-testimonial-slot-demo; content_type: proof-card; provenance: sourced; derived_from: ["@schafe-vorm-fenster/proof@0.3.5#kulturlandbuero-broellin"]; status: draft -->

**Reserved place (type `testimonial`, clearance pending):** "The project can make a valuable contribution to economic recovery and to visibility in rural areas." — Kulturlandbüro Uecker-Randow, Schloss Bröllin

A real quote from `kulturlandbuero-broellin`, translated from the German
original in the record. That record carries `usage_rights: unverified`
and an explicit note not to use it on new public surfaces (Q-014), so
the card stands in the protected preview only. With no written clearance
by go-live, the place stays empty and shows the hatched area again, with
the sentence that names the gap (TS-027 D5).

## Slot 4 — Archive link

<!-- id: ueber-uns-4-archive; content_type: section; provenance: sourced; derived_from: [ia]; status: draft -->

**Link text:** The full press and awards archive → `/ueber-uns/archiv`

Exactly one link, no preview, no list, no counter (TS-027 D6).

## Slot 5 — Team

<!-- id: ueber-uns-5-team; content_type: profile; provenance: sourced; derived_from: ["@schafe-vorm-fenster/people@0.3.6#jan-henrik-hempel", "@schafe-vorm-fenster/people@0.3.6#christian-sauer", "@schafe-vorm-fenster/proof@0.3.5#founder-former-volunteer-mayor"]; status: draft -->

**Jan-Henrik Hempel** — Founder, technical lead, and software architecture. Moved from Berlin to Schlatkow in Vorpommern in 2008, co-founded the Schmatzin municipality's cultural association in 2014, and was its volunteer mayor from 2019.

**Christian Sauer** — long-time collaborator and former project coordinator, with a background in art, curation, project management, customer support, and online editing.

## Slot 6 — Newsletter

<!-- id: ueber-uns-6-newsletter; content_type: section; provenance: sourced; derived_from: [ia]; status: draft -->

**Heading:** Stay in the loop

**Text:** Once or twice a month: what's changing about the village calendar, and what new places are doing with it.

**Input field (placeholder):** `name@example.com`

**Button label:** Subscribe

**Demo note:** Demo data — this sign-up doesn't leave your browser yet.


