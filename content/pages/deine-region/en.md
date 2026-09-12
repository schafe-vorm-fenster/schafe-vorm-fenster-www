---
id: deine-region-de
page_id: TS-026
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
  - "@schafe-vorm-fenster/offerings@0.3.3#portalize-enterprise"
  - "@schafe-vorm-fenster/offerings@0.3.3#portalize-calendar"
  - "@schafe-vorm-fenster/offerings@0.3.3#custom-data-integration"
  - "@schafe-vorm-fenster/proof@0.3.5#impftermine-landkreis"
  - "@schafe-vorm-fenster/proof@0.3.5#eichler-wasserschloss-quilow"
  - "@schafe-vorm-fenster/proof@0.3.5#lehre-lelender"
  - "@schafe-vorm-fenster/partners@0.2.4#stiftung-lebendiges-lehre"
  - "ia"
derived_from:
  - "@schafe-vorm-fenster/messaging@0.1.0#counties--portalize-enterprise"
  - "@schafe-vorm-fenster/offerings@0.3.3#portalize-enterprise"
  - "@schafe-vorm-fenster/offerings@0.3.3#portalize-calendar"
  - "@schafe-vorm-fenster/offerings@0.3.3#custom-data-integration"
  - "@schafe-vorm-fenster/proof@0.3.5#impftermine-landkreis"
  - "@schafe-vorm-fenster/proof@0.3.5#eichler-wasserschloss-quilow"
  - "@schafe-vorm-fenster/proof@0.3.5#lehre-lelender"
  - "@schafe-vorm-fenster/partners@0.2.4#stiftung-lebendiges-lehre"
  - "ia"
generated_by: "playbook-content-production@1.0.0"
generated_at: "2026-09-11"
tone_profile: "du-everywhere"
provenance: "mixed — 6 sourced (slot 6 now carries three real proof elements, two of them clearance-pending), 1 withheld (slot 7 response-time promise, no named handling process, TS-026 D5), 0 generated demo additions; EN translation of content/pages/deine-region/de.md, same source ids per slot"
compliance_check: "state/content-map.md#compliance-checks — TS-026"
schema_note: "see content/pages/home/de.md — same TS-007/schema gap, state/open.md #37"
open_points:
  - "state/open.md #20 — the two-working-day response promise is withheld entirely (constant null), no named process/owner yet (Q-022/C11). Re-checked 2026-09-12 against go-to-market-os: no handling process with a named owner exists anywhere in the hub, so the slot stays withheld"
  - "Clearance pending — slot 6 uses `eichler-wasserschloss-quilow` and `lehre-lelender`, both `usage_rights: unverified` (Q-014). Protected preview only; go-live needs written clearance per element. `impftermine-landkreis` is `cleared`"
  - "Pool extension — TS-026 row 6 in state/content-map.md named only `portalize-enterprise.proof[]` (eichler-wasserschloss-quilow, partner-network). `partner-network` has no named partner list and no cleared logos, so it is replaced here by two real territory-scale cases (impftermine-landkreis, lehre-lelender). Neither is a delivered `portalize-enterprise` territory and the slot says so"
---

# Your region (`/deine-region`)

For counties, state authorities, networks, and large cities that want
a calendar for a **whole territory** (TS-026 D1). No map module and no
map promise on this page: TS-026-A17 requires an unconfirmed feature to
be removed rather than qualified, and no owner confirmation exists for
the map (DEC-061). Until then, an
interim module carries the page (DEC-034). No distance stated as a
module, filter, or result label — only ever as the visitor's own
question (TS-026 D3).

## Slot 1 — Focus block (mechanism: embed)

<!-- id: deine-region-1-focus; content_type: hero; provenance: sourced; derived_from: ["@schafe-vorm-fenster/messaging@0.1.0#counties--portalize-enterprise"]; status: draft -->

**Aha question:** Your whole county in one calendar, with no portal project of your own?

**Text:** That's exactly the point. An embedded system shows your whole territory, under your own name and in your own design.

**CTA label (primary):** Request a quote → `/deine-region/angebot`

Source: `headline` from `counties--portalize-enterprise` — "The whole
district on one map, without a portal project." The map half of that
headline is not used here: TS-026-A17 makes the offering owner's
confirmation a precondition and prescribes removing the feature rather
than qualifying it (F-2-57). The headline is used in full again once the
confirmation exists.

## Slot 2 — The territory question

<!-- id: deine-region-2-territory; content_type: section; provenance: sourced; derived_from: ["@schafe-vorm-fenster/messaging@0.1.0#counties--portalize-enterprise"]; status: draft -->

**Heading:** What's near me? At county scale, that's not a question for a list

**Text:** Covering forty or eighty places editorially isn't a bigger version of covering one place. It simply isn't feasible. And the administrative boundary isn't the boundary people organize their lives around: what's happening thirty kilometres away matters just as much as what's happening right next door.

Source: `pains[]` from `counties--portalize-enterprise`. "Thirty
kilometres" stays the visitor's own question here, never a module's
label (TS-026 D3).

## Slot 3 — Interim module: examples, counter, search

<!-- id: deine-region-3-interim; content_type: live-module-frame; provenance: sourced; derived_from: [ia]; status: draft -->

**Heading:** Here's what that already looks like today: examples from {county}

**Counter label (only when backed by data):** {n} places in the county are on board

**Search input (placeholder):** Your place

At most 6 example places, always labelled "examples" — never "the most
active places" and never a complete list (TS-026 D4). The counter only
renders when `/api/stats` actually supplies the value (Q-037) —
otherwise it stays off, no estimate.

## Slot 4 — Embedding demo

<!-- id: deine-region-4-embed-demo; content_type: live-module-frame; provenance: sourced; derived_from: [ia]; status: draft -->

**Heading:** Here's what the embedding looks like: an example

The same component as on `/dein-kalender` slot 3 (TS-008 position 1′).

## Slot 5 — What it adds

<!-- id: deine-region-5-was-dazukommt; content_type: section; provenance: sourced; derived_from: ["@schafe-vorm-fenster/offerings@0.3.3#portalize-enterprise", "@schafe-vorm-fenster/offerings@0.3.3#custom-data-integration"]; status: draft -->

**Heading:** What the county tier adds on top

**Text:** On top of everything the €480 tier offers: your own white-label-capable registration, embedded on your website.

**Mention (no CTA):** Anyone with their own date databases — a course programme, a church service schedule, the county administration's waste-collection calendar data — can have them connected once via the data integration.

The map view is not in this list. TS-026-A17: until the offering owner
confirms it is shippable to a buyer, the feature is removed rather than
qualified with a date (F-2-57, `state/open.md`).
`custom-data-integration` is mentioned,
never priced, with no CTA of its own (`promotion: on-request-only`).

## Slot 6 — Proof (3 elements)

<!-- id: deine-region-6-proof; content_type: proof-card; provenance: sourced-empty-by-design; derived_from: ["@schafe-vorm-fenster/offerings@0.3.3#portalize-enterprise"]; status: draft -->

Pool: `eichler-wasserschloss-quilow`, `partner-network` — both
`unverified` today (Q-014). No reference case for an already delivered
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
process with a named owner exists (Q-022/C11, TS-026 D5,
`state/open.md` #20).* Once C11 is answered, the same sentence appears
unchanged in three places: at the CTA on this page, in the form on
`/deine-region/angebot`, and in the confirmation afterwards — never
differing from one place to the next.

No demo placeholder here. TS-016-A13 makes the named, signed-off
handling process a precondition for any time promise and prescribes that
the sentence is **absent** otherwise — example text included, because an
example sentence about our own response time sets the same expectation as
a promise (F-2-57). The area stays empty until C11 is answered.

## Slot 8 — Price display

<!-- id: deine-region-8-price; content_type: section; provenance: sourced; derived_from: ["@schafe-vorm-fenster/offerings@0.3.3#portalize-enterprise"]; status: draft -->

**Text:** Price on request.

`price_status: on-request` — no number, no range, no "from", no
comparison to an order of magnitude. The €480 comparison price from
`portalize-calendar` may appear elsewhere, but always read from the
price component, never typed.

---

## `/deine-region/angebot` — Quote request form

<!-- id: deine-region-angebot-1-form; content_type: form; provenance: sourced; derived_from: [ia]; status: draft -->

**Heading:** Request a quote for {county-or-organization}

An envoy instance (TS-016 S2) — field set and success behaviour are
not yet specified (Q-022). This page carries no argument text of its
own; the argument lives on `/deine-region`.

**Confirmation text after submitting:** Your request has reached us. {Response promise, if C11 is answered — otherwise no time promise.}

**Exit to a briefing (if the form fails to load):** Form not loading right now? Write to us, or book a slot directly.
