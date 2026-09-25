---
id: deine-region-de
page_id: TS-WEB-0026
route: "/deine-region"
seo:
  "/deine-region":
    title: "A calendar for your whole area"
    description: "Your whole district in one calendar, under your name and in your design — without a portal project of your own. Ask us for a quote."
    provenance: generated
  "/deine-region/angebot":
    title: "Request a quote for your region"
    description: "Tell us which territory the calendar should cover and who is responsible on your side — we come back to you with a fitting quote."
    provenance: generated
content_type: section
status: draft
locale: en
sources:
  - "@schafe-vorm-fenster/messaging@0.1.0#counties--portalize-enterprise"
  - "@schafe-vorm-fenster/offerings@0.3.5#portalize-enterprise"
  - "@schafe-vorm-fenster/offerings@0.3.5#portalize-calendar"
  - "@schafe-vorm-fenster/offerings@0.3.5#custom-data-integration"
  - "@schafe-vorm-fenster/proof@0.3.5#impftermine-landkreis"
  - "@schafe-vorm-fenster/proof@0.3.5#eichler-wasserschloss-quilow"
  - "@schafe-vorm-fenster/proof@0.3.5#lehre-lelender"
  - "@schafe-vorm-fenster/partners@0.2.4#stiftung-lebendiges-lehre"
  - "ia"
derived_from:
  - "@schafe-vorm-fenster/messaging@0.1.0#counties--portalize-enterprise"
  - "@schafe-vorm-fenster/offerings@0.3.5#portalize-enterprise"
  - "@schafe-vorm-fenster/offerings@0.3.5#portalize-calendar"
  - "@schafe-vorm-fenster/offerings@0.3.5#custom-data-integration"
  - "@schafe-vorm-fenster/proof@0.3.5#impftermine-landkreis"
  - "@schafe-vorm-fenster/proof@0.3.5#eichler-wasserschloss-quilow"
  - "@schafe-vorm-fenster/proof@0.3.5#lehre-lelender"
  - "@schafe-vorm-fenster/partners@0.2.4#stiftung-lebendiges-lehre"
  - "ia"
generated_by: "playbook-content-production@1.0.0"
generated_at: "2026-09-11"
tone_profile: "du-everywhere"
provenance: "mixed — 6 sourced (slot 6 now carries three real proof elements, two of them clearance-pending), 1 withheld (slot 7 response-time promise, no named handling process, TS-WEB-0026 D5), 0 generated demo additions; EN translation of content/pages/deine-region/de.md, same source ids per slot"
compliance_check: "state/content-map.md#compliance-checks — TS-WEB-0026"
schema_note: "see content/pages/home/de.md — same TS-WEB-0007/schema gap, state/open.md #37"
open_points:
  - "state/open.md #20 — the two-working-day response promise is withheld entirely (constant null), no named process/owner yet (Q-0022/C11). Re-checked 2026-09-12 against go-to-market-os: no handling process with a named owner exists anywhere in the hub, so the slot stays withheld"
  - "Clearance pending — slot 6 uses `eichler-wasserschloss-quilow` and `lehre-lelender`, both `usage_rights: unverified` (Q-0014). Protected preview only; go-live needs written clearance per element. `impftermine-landkreis` is `cleared`"
  - "Pool extension — TS-WEB-0026 row 6 in state/content-map.md named only `portalize-enterprise.proof[]` (eichler-wasserschloss-quilow, partner-network). `partner-network` has no named partner list and no cleared logos, so it is replaced here by two real territory-scale cases (impftermine-landkreis, lehre-lelender). Neither is a delivered `portalize-enterprise` territory and the slot says so"
images:
  - id: deine-region-hero
    slot: deine-region-1-focus
    ratio: hero
    provenance: real
    source: >-
      Wikimedia Commons, File:Güterberg, Ausblick.jpg —
      https://commons.wikimedia.org/wiki/File:G%C3%BCterberg,_Ausblick.jpg — Eigenaufnahme von
      Schafe vorm Fenster (Commons-Konto „Schafevormfenster", own work), Mai 2025, 3563×2231.
      Nachweis: content/legal/image-credits.md.
    alt: >-
      A view across fields near Güterberg to the horizon, with lines of trees, rooftops and wind
      turbines.
    licence: CC0 1.0
    status: real
    file: /images/real/deine-region-hero.webp
    width: 800
    height: 900
    wide_file: /images/real/deine-region-hero-wide.webp
    wide_width: 1400
    wide_height: 600
  - id: deine-region-gebietsschnitt
    slot: deine-region-5-was-dazukommt
    ratio: feature
    provenance: real
    source: >-
      Wikimedia Commons, File:Carolinenthal, Ortseingang.jpg —
      https://commons.wikimedia.org/wiki/File:Carolinenthal,_Ortseingang.jpg — Eigenaufnahme von
      Schafe vorm Fenster (Commons-Konto „Schafevormfenster", own work), Mai 2025, 4032×3024.
      Nachweis: content/legal/image-credits.md.
    alt: >-
      A cobbled road at the entrance to the village of Carolinenthal, the yellow place-name sign
      beneath a row of trees.
    licence: CC0 1.0
    status: real
    file: /images/real/deine-region-gebietsschnitt.webp
    width: 1400
    height: 1000
  - id: deine-region-angebot-hero
    slot: deine-region-angebot-1-form
    ratio: hero
    provenance: real
    source: >-
      @schafe-vorm-fenster/brand-identity@0.1.4#imagery/office/2020-07-loft-office-02.jpeg —
      Eigenaufnahme (Jan-Henrik Hempel), unbeschränkte Nutzung, kein Credit nötig. Binärdatei liegt
      im go-to-market-os-Repository, das npm-Paket liefert nur den .asset.md-Deskriptor.
    alt: >-
      Two desks in an attic office with historic timber beams, a pale plank floor and windows along
      the side.
    licence: Eigenaufnahme, unbeschränkte Nutzung
    status: real
    file: /images/real/deine-region-angebot-hero.webp
    width: 800
    height: 900
    wide_file: /images/real/deine-region-angebot-hero-wide.webp
    wide_width: 1400
    wide_height: 600
---

# Your region (`/deine-region`)

For counties, state authorities, networks, and large cities that want
a calendar for a **whole territory** (TS-WEB-0026 D1). No map module and no
map promise on this page: TS-WEB-0026-A17 requires an unconfirmed feature to
be removed rather than qualified, and no owner confirmation exists for
the map (DEC-0061). Until then, an
interim module carries the page (DEC-0034). No distance stated as a
module, filter, or result label — only ever as the visitor's own
question (TS-WEB-0026 D3).

## Slot 1 — Focus block (mechanism: embed)

<!-- id: deine-region-1-focus; content_type: hero; provenance: sourced; derived_from: [ia, "@schafe-vorm-fenster/messaging@0.1.0#counties--portalize-enterprise"]; status: draft -->

**Aha question:** Your whole county in one calendar, with no portal project of your own?

**Text:** That's exactly the point. An embedded system shows your whole territory, under your own name and in your own design.

**CTA label (primary):** Request a quote → `/deine-region/angebot`

**Secondary CTA (quiet):** Rather talk first? Book an intro call

**Note on the secondary CTA:** Opens Google Calendar in a new tab.

**Closing heading:** Shall we put a quote together for you?

The secondary CTA stands quietly under the primary one, never beside it
and never as a second button: a page carries exactly one primary action
per screenful. The note says what tapping it does; where the data goes
is in the privacy section the page already links to. The closing
heading repeats the same conversion as the hero — same goal, same label
(TS-WEB-0006 D6). No time promise while C11 is open.

Source: `headline` from `counties--portalize-enterprise` — "The whole
district on one map, without a portal project." The map half of that
headline is not used here: TS-WEB-0026-A17 makes the offering owner's
confirmation a precondition and prescribes removing the feature rather
than qualifying it (F-2-57). The headline is used in full again once the
confirmation exists.

## Slot 2 — The territory question

<!-- id: deine-region-2-territory; content_type: section; provenance: sourced; derived_from: ["@schafe-vorm-fenster/messaging@0.1.0#counties--portalize-enterprise"]; status: draft -->

**Heading:** What's near me? At county scale, that's not a question for a list

**Text:** Covering forty or eighty places editorially isn't a bigger version of covering one place. It simply isn't feasible. And the administrative boundary isn't the boundary people organize their lives around: what's happening thirty kilometres away matters just as much as what's happening right next door.

Source: `pains[]` from `counties--portalize-enterprise`. "Thirty
kilometres" stays the visitor's own question here, never a module's
label (TS-WEB-0026 D3).

## Slot 3 — Interim module: examples, counter, search

<!-- id: deine-region-3-interim; content_type: live-module-frame; provenance: sourced; derived_from: [ia]; status: draft -->

**Heading:** Here's what that already looks like today: places in {county}

**Counter label (only when backed by data):** {n} places in the county are on board

**Search input (placeholder):** Your place

**Heading (no county known):** This is what it already looks like: places that are already on board

**Transition:** And this isn't a statement of intent — it's already running:

While no county is known, the heading names none: the fallback read
"the county of your region" until here, which is not a county
(TS-WEB-0026-A10). At most 6 places, as a designed set — never "the most
active places" and never a complete list (TS-WEB-0026 D4). The counter only
renders when `/api/stats` actually supplies the value (Q-0037) —
otherwise it stays off, no estimate.

## Slot 4 — Embedding demo

<!-- id: deine-region-4-embed-demo; content_type: live-module-frame; provenance: sourced; derived_from: [ia]; status: draft -->

**Heading:** Here's what the embedding looks like

The same component as on `/dein-kalender` slot 3 (TS-WEB-0008 position 1′).

## Slot 5 — What it adds

<!-- id: deine-region-5-was-dazukommt; content_type: section; provenance: sourced; derived_from: ["@schafe-vorm-fenster/offerings@0.3.5#portalize-enterprise", "@schafe-vorm-fenster/offerings@0.3.5#custom-data-integration"]; status: draft -->

**Heading:** What the county tier adds on top

**Text:** On top of everything the €480 tier offers: your own white-label-capable registration, embedded on your website.

**Mention (no CTA):** Anyone with their own date databases — a course programme, a church service schedule, the county administration's waste-collection calendar data — can have them connected once via the data integration.

The map view is not in this list. TS-WEB-0026-A17: until the offering owner
confirms it is shippable to a buyer, the feature is removed rather than
qualified with a date (F-2-57, `state/open.md`).
`custom-data-integration` is mentioned,
never priced, with no CTA of its own (`promotion: on-request-only`).

## Slot 6 — Proof (3 elements)

<!-- id: deine-region-6-proof; content_type: proof-card; provenance: sourced-empty-by-design; derived_from: ["@schafe-vorm-fenster/offerings@0.3.5#portalize-enterprise"]; status: draft -->

Pool: `eichler-wasserschloss-quilow`, `partner-network` — both
`unverified` today (Q-0014). No reference case for an already delivered
`portalize-enterprise` territory exists; none is simulated. The slot
below instead shows three real, named proof elements from the full set,
and says what they do and do not prove.

<!-- id: deine-region-6-proof-demo; content_type: proof-card; provenance: sourced; derived_from: ["@schafe-vorm-fenster/proof@0.3.5#impftermine-landkreis", "@schafe-vorm-fenster/proof@0.3.5#eichler-wasserschloss-quilow", "@schafe-vorm-fenster/proof@0.3.5#lehre-lelender", "@schafe-vorm-fenster/partners@0.2.4#stiftung-lebendiges-lehre"]; status: draft -->

**Proof cards (real, two of them clearance-pending):** Three elements
from the proof set, in the wording of the records:

1. During the pandemic, every vaccination slot and every testing-centre opening time in the county was published through the village calendars, day-current and place-precise. — Landkreis Vorpommern-Greifswald, 2022
2. "The service helps make what's on offer more visible and easier to find across a thinly settled area." — Uwe Eichler, Wasserschloss Quilow
3. One municipality runs the village calendar as a brand of its own for 17 places, and volunteers are being brought on board. — Stiftung Lebendiges Lehre, municipality of Lehre, 2026

None of the three is a delivered `portalize-enterprise` territory, and
this page does not say otherwise. Card 1 is a county that published its
own dates through the existing set (`impftermine-landkreis`, `cleared`;
evidence: our own eu:react final report, July 2022). Card 3 is a
municipality with 17 place calendars under its own brand
(`lehre-lelender`, `unverified`). Card 2 comes from the pool
`portalize-enterprise` names (`eichler-wasserschloss-quilow`,
`unverified`). The two `unverified` elements stand in the protected
preview; before go-live there is a written clearance per element, or the
card goes. `partner-network` is not among them: that record names no
partner and has no cleared logo rights.

## Slot 7 — Response promise

<!-- id: deine-region-7-response-promise; content_type: closing-cta; provenance: withheld; derived_from: []; status: draft -->

*No text — the constant stays `null` as long as no named handling
process with a named owner exists (Q-0022/C11, TS-WEB-0026 D5,
`state/open.md` #20).* Once C11 is answered, the same sentence appears
unchanged in three places: at the CTA on this page, in the form on
`/deine-region/angebot`, and in the confirmation afterwards — never
differing from one place to the next.

No demo placeholder here. TS-WEB-0016-A13 makes the named, signed-off
handling process a precondition for any time promise and prescribes that
the sentence is **absent** otherwise — example text included, because an
example sentence about our own response time sets the same expectation as
a promise (F-2-57). The area stays empty until C11 is answered.

## Slot 8 — Price display

<!-- id: deine-region-8-price; content_type: section; provenance: sourced; derived_from: ["@schafe-vorm-fenster/offerings@0.3.5#portalize-enterprise"]; status: draft -->

**Text:** Price on request.

`price_status: on-request` — no number, no range, no "from", no
comparison to an order of magnitude. The €480 comparison price from
`portalize-calendar` may appear elsewhere, but always read from the
price component, never typed.

---

## `/deine-region/angebot` — Quote request form

<!-- id: deine-region-angebot-1-form; content_type: form; provenance: sourced; derived_from: [ia]; status: draft -->

**Heading:** Request a quote for {county-or-organization}

**Intro:** Tell us which territory this is about — we'll sort the rest out in conversation.

An envoy instance (TS-WEB-0016 S2) — field set and success behaviour are
not yet specified (Q-0022). This page carries no argument text of its
own; the argument lives on `/deine-region`.

**Confirmation text after submitting:** Your request has reached us. {Response promise, if C11 is answered — otherwise no time promise.}

**Exit to a briefing (if the form fails to load):** Form not loading right now? Write to us, or book a slot directly.
