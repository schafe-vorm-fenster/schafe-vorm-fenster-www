---
id: dein-kalender-de
page_id: TS-024
route: "/dein-kalender"
content_type: section
status: draft
locale: en
sources:
  - "@schafe-vorm-fenster/messaging@0.1.0#municipalities--portalize-calendar"
  - "@schafe-vorm-fenster/offerings@0.3.3#community-calendar"
  - "@schafe-vorm-fenster/offerings@0.3.3#portalize-calendar"
  - "@schafe-vorm-fenster/offerings@0.3.3#portalize-enterprise"
  - "ia"
derived_from:
  - "@schafe-vorm-fenster/messaging@0.1.0#municipalities--portalize-calendar"
  - "@schafe-vorm-fenster/offerings@0.3.3#community-calendar"
  - "@schafe-vorm-fenster/offerings@0.3.3#portalize-calendar"
  - "@schafe-vorm-fenster/offerings@0.3.3#portalize-enterprise"
  - "ia"
generated_by: "playbook-content-production@1.0.0"
generated_at: "2026-09-11"
tone_profile: "du-everywhere"
provenance: "mixed — 6 sourced, 2 generated demo additions under the prototype completeness override (slot 5 demo proof cards, slot 6 demo operations/AI placeholder sentences — the withheld status per TS-024 D10 stands for the real, non-demo copy; state/open.md Dummy-Content); EN translation of content/pages/dein-kalender/de.md, same source ids per slot"
compliance_check: "state/content-map.md#compliance-checks — TS-024"
schema_note: "see content/pages/home/de.md — same TS-007/schema gap, state/open.md #37"
open_points:
  - "state/open.md #19 — trust-block operations/AI sentences withheld, no hub record"
price_source_note: >-
  Every price token below (480, per year, net; portalize-enterprise
  on request) must render from the offerings package at build time,
  never as a typed literal (TS-024 D8) — this file records the source
  value for the page developer, it is not the rendering mechanism.
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
(Q-014). An image with no cleared usage right shows the "photo wanted"
placeholder area, never a borrowed photo.

<!-- id: dein-kalender-5-proof-demo; content_type: proof-card; provenance: generated; derived_from: []; status: draft; demo: true -->

**Demo elements (prototype, `Demo Data` badge):** As long as none of
the four proof elements is cleared, the prototype shows three example
cards instead of an empty area:

1. "Our calendar now runs under our own name on our own website — in our own design, with no system of our own behind it." — Digital office, Example administration Musterkreis (image: "photo wanted" · placeholder)
2. "Local groups enter their own dates now, our calendar just stays current." — Example municipality Musterdorf (image: "photo wanted" · placeholder)
3. "Nobody here would have used a second login — the embedding, though, they did." — Cultural association, Example place Musterhagen (image: "photo wanted" · placeholder)

Institutions, places, and quotes are entirely invented and recognizably
exemplary; they replace no cleared proof element.

## Slot 6 — Trust block: data protection, operations, AI

<!-- id: dein-kalender-6-trust; content_type: section; provenance: mixed; derived_from: [ia]; status: draft -->

**Heading:** How your data is handled here

**Data protection (stands):** No tracking cookies, no persistent user identifier, no consent banner, no third parties beyond those named in our privacy policy. → [`/rechtliches#datenschutz`](/rechtliches#datenschutz), [`/rechtliches#auftragsverarbeitung`](/rechtliches#auftragsverarbeitung)

**Operations (missing, not generated):** *No sentence — no hub record documents who operates the service and where.*

**AI use (missing, not generated):** *No sentence — no hub record documents how AI handles publisher data.*

<!-- provenance: withheld; reason: "TS-024 D10 forbids any sentence with no named source; state/open.md #19" -->

Only the data-protection paragraph has proof (TS-013 D1/D2) and ships
to production. Operations and AI stay unpublished until a hub record
exists — no generic substitute sentence, because TS-024 D10 explicitly
rules that out.

<!-- id: dein-kalender-6-trust-demo; content_type: section; provenance: generated; derived_from: []; status: draft; demo: true -->

**Demo placeholder for operations and AI use (prototype, `Demo Data` badge):**
For the full prototype impression, this view shows two illustrative
example sentences instead of the empty area — both clearly marked as
placeholders, no confirmed claim:

**Operations (example text):** As an example: the village calendar is run by a small team, based in a village — the exact operating location and legal form follow once a hub record exists.

**AI use (example text):** As an example: publisher data would only be processed for the calendar function itself, not for training AI models — the final wording follows once a hub record exists.

Both sentences are deliberately marked as example text and carry no
confirmed operational or technical claim; they disappear once a real
hub record closes the gap (`state/open.md`, row 19).

## Verification — local advertising

<!-- id: dein-kalender-9-no-advertising; content_type: section; provenance: sourced; derived_from: [ia]; status: draft -->

A negative check, not a text slot: `local-advertising` (`promotion:
withheld`) must occur zero times on this page — no sentence, no field,
no CTA, no link (TS-024 D11).
