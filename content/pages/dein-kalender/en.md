---
id: dein-kalender-de
page_id: TS-024
route: "/dein-kalender"
seo:
  "/dein-kalender":
    title: "A calendar for your website"
    description: "Your calendar, your website, your name — and nobody in the office types in dates anymore. Configure the view, or book a briefing first."
    provenance: generated
content_type: section
status: draft
locale: en
sources:
  - "@schafe-vorm-fenster/messaging@0.1.0#municipalities--portalize-calendar"
  - "@schafe-vorm-fenster/offerings@0.3.3#community-calendar"
  - "@schafe-vorm-fenster/offerings@0.3.3#portalize-calendar"
  - "@schafe-vorm-fenster/offerings@0.3.3#portalize-enterprise"
  - "@schafe-vorm-fenster/proof@0.3.5#wendt-rubkow"
  - "@schafe-vorm-fenster/proof@0.3.5#zschiesche-gross-kiesow"
  - "@schafe-vorm-fenster/proof@0.3.5#eichler-wasserschloss-quilow"
  - "@schafe-vorm-fenster/proof@0.3.5#in-operation-since-2018"
  - "@schafe-vorm-fenster/people@0.3.6#jan-henrik-hempel"
  - "ia"
derived_from:
  - "@schafe-vorm-fenster/messaging@0.1.0#municipalities--portalize-calendar"
  - "@schafe-vorm-fenster/offerings@0.3.3#community-calendar"
  - "@schafe-vorm-fenster/offerings@0.3.3#portalize-calendar"
  - "@schafe-vorm-fenster/offerings@0.3.3#portalize-enterprise"
  - "@schafe-vorm-fenster/proof@0.3.5#wendt-rubkow"
  - "@schafe-vorm-fenster/proof@0.3.5#zschiesche-gross-kiesow"
  - "@schafe-vorm-fenster/proof@0.3.5#eichler-wasserschloss-quilow"
  - "@schafe-vorm-fenster/proof@0.3.5#in-operation-since-2018"
  - "@schafe-vorm-fenster/people@0.3.6#jan-henrik-hempel"
  - "ia"
generated_by: "playbook-content-production@1.0.0"
generated_at: "2026-09-11"
tone_profile: "du-everywhere"
provenance: "mixed — 7 sourced (slot 5 now carries the three real, verbatim proof quotes in translation, clearance pending; slot 6 carries a sourced operations sentence), 1 generated demo addition left (slot 6 AI-use placeholder — no hub record documents AI handling of publisher data); EN translation of content/pages/dein-kalender/de.md, same source ids per slot"
compliance_check: "state/content-map.md#compliance-checks — TS-024"
schema_note: "see content/pages/home/de.md — same TS-007/schema gap, state/open.md #37"
open_points:
  - "state/open.md #19 — the trust block's AI-use sentence is still withheld: no hub record documents how AI handles publisher data. The operations sentence is resolved and sourced (people#jan-henrik-hempel, proof#in-operation-since-2018)"
  - "Clearance pending — the three proof quotes in slot 5 (wendt-rubkow, zschiesche-gross-kiesow, eichler-wasserschloss-quilow) carry `usage_rights: unverified` (Q-014). They render in the protected preview only; go-live needs written clearance per quote or the card drops"
price_source_note: >-
  Every price token below (480, per year, net; portalize-enterprise
  on request) must render from the offerings package at build time,
  never as a typed literal (TS-024 D8) — this file records the source
  value for the page developer, it is not the rendering mechanism.
images:
  - id: dein-kalender-hero
    slot: dein-kalender-1-focus
    ratio: hero
    provenance: generated
    brief: >-
      Amtsstube einer kleinen Gemeindeverwaltung an einem grauen Vormittag: Aktenschrank,
      Topfpflanze auf der Fensterbank, ein Stuhl am leeren Schreibtisch. Durch das Fenster
      Dorfstraße und Kirchturm. Nüchternes, kaltes Tageslicht, Linoleum und helles Holz. Nicht
      zeigen: Schrift, Logos, lesbare Papiere oder Bildschirme, Menschen.
    style: documentary photo, natural light, 35mm, muted colours, no text
    alt: >-
      A small council office with a filing cabinet and an empty desk, the village street visible
      through the window.
    status: generated
    model: bfl/flux-pro-1.1
    generated_at: "2026-09-12"
    prompt_hash: d7dfeb70fc1a0004
    file: /images/generated/dein-kalender-hero.webp
    width: 800
    height: 900
    wide_file: /images/generated/dein-kalender-hero-wide.webp
    wide_width: 1400
    wide_height: 600
  - id: dein-kalender-proof-rubkow
    slot: dein-kalender-5-proof-demo
    ratio: proof
    provenance: real
    source: >-
      @schafe-vorm-fenster/proof@0.3.5#wendt-rubkow — Testimonial von Holger Wendt, Bürgermeister in
      Rubkow. `usage_rights: unverified`, kein Bildasset vorhanden. Ein Beleg wird nie mit einer
      Rendition bebildert (DEC-068 Regel 3, `src/generated/placeholders/README.md`); bis zur
      Freigabe zeigt die Karte die Fläche „Foto gesucht“ (TS-024-A13).
    alt: Holger Wendt outside the council office in Rubkow.
    status: needed
  - id: dein-kalender-proof-gross-kiesow
    slot: dein-kalender-5-proof-demo
    ratio: proof
    provenance: real
    source: >-
      @schafe-vorm-fenster/proof@0.3.5#zschiesche-gross-kiesow — Testimonial von Dr. A. Zschiesche,
      Bürgermeisterin Groß Kiesow. `usage_rights: unverified`, kein Bildasset vorhanden. Gleiche
      Regel wie bei `dein-kalender-proof-rubkow`.
    alt: Dr. A. Zschiesche outside the council office in Groß Kiesow.
    status: needed
  - id: dein-kalender-proof-quilow
    slot: dein-kalender-5-proof-demo
    ratio: proof
    provenance: real
    source: >-
      @schafe-vorm-fenster/proof@0.3.5#eichler-wasserschloss-quilow — Testimonial von Uwe Eichler,
      Wasserschloss Quilow. `usage_rights: unverified`, kein Bildasset vorhanden. Gleiche Regel wie
      bei `dein-kalender-proof-rubkow`.
    alt: Uwe Eichler outside Wasserschloss Quilow.
    status: needed
---

# Your calendar (`/dein-kalender`)

"Portalize" appears on this page **exactly once** (slot 4, tier 2;
TS-024 D7). No local `local-advertising` anywhere on the page
(TS-024 D11). Two equally weighted conversions: order (Pulse, primary)
and book a briefing (secondary, same visibility) — Pulse appears only
in the focus block (TS-024 D3).

## Slot 1 — Focus block

<!-- id: dein-kalender-1-focus; content_type: hero; provenance: sourced; derived_from: ["@schafe-vorm-fenster/messaging@0.1.0#municipalities--portalize-calendar"]; status: draft -->

**Headline:** Your calendar, your website, your name. Nobody in the office types in dates anymore.

**CTA label (primary, Pulse):** Order the calendar → `/dein-kalender/bestellen`

**CTA label (equally weighted, secondary):** Book a briefing → configured Google Calendar URL

Source: `headline` from `municipalities--portalize-calendar` — "Our
calendar is current again — and nobody here maintains it."

## Slot 2 — Contrast: today vs. with the product (4 rows)

<!-- id: dein-kalender-2-contrast; content_type: section; provenance: sourced; derived_from: ["@schafe-vorm-fenster/offerings@0.3.3#portalize-calendar", "@schafe-vorm-fenster/messaging@0.1.0#municipalities--portalize-calendar"]; status: draft -->

| Today | With the product |
| --- | --- |
| A dates module in the CMS is a website project that ends up in an empty database. | The view is configured against a pool of data that's already filled and shared. |
| Keeping it current needs someone the administration doesn't have. | Local groups maintain their own dates — your filtered view stays current as a side effect. |
| Hardly any group takes on a second login and a second form. | Local groups publish the way they already do — flyer, own calendar, own website. |
| Your calendar ends at your own jurisdiction; people's interest doesn't. | Place selection runs by place, postcode, or a whole county — you draw the boundary yourself. |

Four rows, derived from `portalize-calendar` (`summary`, category) and
the `pains[]`/`gains[]`/`relievers[]` fields of
`municipalities--portalize-calendar` — not copied verbatim, no fifth
row for an extra feature (TS-024 D4).

## Slot 3 — Embedding demo

<!-- id: dein-kalender-3-embed-demo; content_type: live-module-frame; provenance: sourced; derived_from: [ia]; status: draft -->

**Heading:** Here's what the embedding looks like: an example

As long as Q-026 is open, the demo shows the reference organizer and
is labelled as an example — never as "your calendar" (TS-024 D5).

## Slot 4 — Three tiers under one question

<!-- id: dein-kalender-4-tiers; content_type: tier; provenance: sourced; derived_from: ["@schafe-vorm-fenster/offerings@0.3.3#community-calendar", "@schafe-vorm-fenster/offerings@0.3.3#portalize-calendar", "@schafe-vorm-fenster/offerings@0.3.3#portalize-enterprise"]; status: draft -->

**Question heading:** Where should the calendar live?

### Tier 1 — in the village calendar

**Title:** In the village calendar

**Price:** free, permanent — no introductory tier

**Text:** Your club or municipality publishes directly into the village calendar, with no website and no system of your own.

**CTA (quiet):** Open calendar · Publish dates

Offering id: `community-calendar`.

### Tier 2 — on your own website

**Title:** On your own website

**Price:** €480 per year, net

**Text:** Your official calendar runs under your own name, in your own design, on your own website, configured by place, category, or local group. The product behind it is called Portalize.

**CTA (primary, Pulse):** Order the calendar

**CTA (quiet):** Book a briefing

Offering id: `portalize-calendar`; price 480/EUR/year, `vat: excluded`
— read from the package, never typed (TS-024 D8). "Portalize" appears
on this entire page exclusively in this paragraph.

### Tier 3 — for a whole region

**Title:** For a whole region

**Price:** on request

**Text:** Counties, state authorities, and large cities additionally get a map view of the same dates and their own white-label-capable registration.

**CTA (quiet):** Continue to `/deine-region`

Offering id: `portalize-enterprise`, `price_status: on-request` — never
a number, never "from", never an order of magnitude (TS-024 D8). The
internal €4,000 figure from the package must never appear anywhere on
this page.

## Slot 5 — Proof (3 elements, with images)

<!-- id: dein-kalender-5-proof; content_type: proof-card; provenance: sourced-empty-by-design; derived_from: ["@schafe-vorm-fenster/offerings@0.3.3#portalize-calendar"]; status: draft -->

Pool: the four proof ids `portalize-calendar` references
(`kulturlandbuero-broellin`, `eichler-wasserschloss-quilow`,
`zschiesche-gross-kiesow`, `wendt-rubkow`) — all `unverified` today
(Q-014). For production this slot stays empty until a clearance
exists. In the protected preview the slot below shows three of those
elements verbatim, clearance open and without a demo marking.

<!-- id: dein-kalender-5-proof-demo; content_type: proof-card; provenance: sourced; derived_from: ["@schafe-vorm-fenster/proof@0.3.5#wendt-rubkow", "@schafe-vorm-fenster/proof@0.3.5#zschiesche-gross-kiesow", "@schafe-vorm-fenster/proof@0.3.5#eichler-wasserschloss-quilow"]; status: draft -->

**Proof cards (real quotes, clearance pending):** Three voices from
`portalize-calendar`'s pool, verbatim from the proof records:

1. "Managing and automating the dates ourselves has cut the workload of our municipality." — Holger Wendt, mayor of Rubkow (image: "photo wanted" · placeholder)
2. "For this project I see our rural population, and mobile traders too, as the winners." — Dr A. Zschiesche, mayor of Groß Kiesow (image: "photo wanted" · placeholder)
3. "The service helps make what's on offer more visible and easier to find across a thinly settled area." — Uwe Eichler, Wasserschloss Quilow (image: "photo wanted" · placeholder)

All three records carry `usage_rights: unverified` (Q-014). The cards
therefore stand in the protected preview, not on a public surface:
before go-live there is a written clearance per quote, or the card
goes (`state/open.md`). The quotes are German originals, translated
here; the German file carries the source wording. With no cleared
image right, every card shows the "photo wanted" placeholder area,
never a borrowed photo.

## Slot 6 — Trust block: data protection, operations, AI

<!-- id: dein-kalender-6-trust; content_type: section; provenance: mixed; derived_from: [ia, "@schafe-vorm-fenster/people@0.3.6#jan-henrik-hempel", "@schafe-vorm-fenster/proof@0.3.5#in-operation-since-2018"]; status: draft -->

**Heading:** How your data is handled here

**Data protection:** No tracking cookies, no persistent user identifier, no consent banner, no third parties beyond those named in our privacy policy. → [`/rechtliches#datenschutz`](/rechtliches#datenschutz), [`/rechtliches#auftragsverarbeitung`](/rechtliches#auftragsverarbeitung)

**Operations:** Behind the service is Jan-Henrik Hempel, founder and technical lead; he lives in Schlatkow in Vorpommern. The village calendar has been running since 2018 — not a pilot, not a prototype.

**AI use (missing, not generated):** *No sentence — no hub record documents how AI handles publisher data.*

The data-protection paragraph rests on TS-013 D1/D2. The operations
sentence rests on `people@0.3.6#jan-henrik-hempel` (role, place of
residence) and `proof@0.3.5#in-operation-since-2018` (`cleared`), which
satisfies TS-024-A19: it names a hub record. Legal form and operating
address live in the imprint and in no hub record, so they stay out of
this block. The AI statement stays unpublished until a hub record
exists (`state/open.md` #19).

<!-- id: dein-kalender-6-trust-demo; content_type: section; provenance: generated; derived_from: []; status: draft; demo: true -->

**Demo placeholder for AI use (prototype, `Demo Data` badge):**
For the full prototype impression, this view shows one illustrative
example sentence instead of the empty area, clearly marked as a
placeholder and carrying no confirmed claim:

**AI use (example text):** As an example: publisher data would only be processed for the calendar function itself, not for training AI models — the final wording follows once a hub record exists.

The sentence carries no confirmed technical claim and disappears once a
hub record closes the gap (`state/open.md`, row 19). The operations
sentence has a source as of this pass and sits in the slot above.

## Verification — local advertising

<!-- id: dein-kalender-9-no-advertising; content_type: section; provenance: sourced; derived_from: [ia]; status: draft -->

A negative check, not a text slot: `local-advertising` (`promotion:
withheld`) must occur zero times on this page — no sentence, no field,
no CTA, no link (TS-024 D11).
