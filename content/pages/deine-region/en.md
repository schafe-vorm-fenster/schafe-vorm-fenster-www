---
id: deine-region-de
page_id: TS-026
route: "/deine-region"
content_type: section
status: draft
locale: en
sources:
  - "@schafe-vorm-fenster/messaging@0.1.0#counties--portalize-enterprise"
  - "@schafe-vorm-fenster/offerings@0.3.3#portalize-enterprise"
  - "@schafe-vorm-fenster/offerings@0.3.3#portalize-calendar"
  - "@schafe-vorm-fenster/offerings@0.3.3#custom-data-integration"
  - "ia"
derived_from:
  - "@schafe-vorm-fenster/messaging@0.1.0#counties--portalize-enterprise"
  - "@schafe-vorm-fenster/offerings@0.3.3#portalize-enterprise"
  - "@schafe-vorm-fenster/offerings@0.3.3#portalize-calendar"
  - "@schafe-vorm-fenster/offerings@0.3.3#custom-data-integration"
  - "ia"
generated_by: "playbook-content-production@1.0.0"
generated_at: "2026-09-11"
tone_profile: "du-everywhere"
provenance: "mixed — 5 sourced, 2 generated demo additions under the prototype completeness override (slot 6 demo proof cards, slot 7 demo response-promise placeholder — the withheld status per TS-026 D5 stands for the real, non-demo copy; state/open.md Dummy-Content); EN translation of content/pages/deine-region/de.md, same source ids per slot"
compliance_check: "state/content-map.md#compliance-checks — TS-026"
schema_note: "see content/pages/home/de.md — same TS-007/schema gap, state/open.md #37"
open_points:
  - "state/open.md #20 — the two-working-day response promise is withheld entirely (constant null), no named process/owner yet"
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
territory exists; none is simulated.

<!-- id: deine-region-6-proof-demo; content_type: proof-card; provenance: generated; derived_from: []; status: draft; demo: true -->

**Demo elements (prototype, `Demo Data` badge):** As long as no
reference case is cleared, the prototype shows three example cards
instead of an empty area:

1. "Covering forty places editorially was never going to work for us — now it's all in one calendar." — County commissioner, Example county Musterkreis
2. "Our administrative boundary was never the boundary people's lives run to — the calendar now shows both." — Regional development office, Example county Mustermark
3. "Embedding it under our own name and in our own design wasn't a portal project for us, it was a configuration." — Network partner, Example region Musterland

Counties, institutions, and quotes are entirely invented and
recognizably exemplary; they replace no cleared proof element.

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
