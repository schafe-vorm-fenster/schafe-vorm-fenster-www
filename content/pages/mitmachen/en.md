---
id: mitmachen-de
page_id: TS-022
route: "/mitmachen"
seo:
  "/mitmachen":
    title: "Publish your dates"
    description: "Photograph the flyer, send it by WhatsApp, done: your date shows up in your own village calendar and in the ones next door. Sign up for free."
    provenance: generated
content_type: section
status: draft
locale: en
sources:
  - "@schafe-vorm-fenster/audiences@0.3.3#actors"
  - "@schafe-vorm-fenster/messaging@0.1.0#actors--community-calendar"
  - "@schafe-vorm-fenster/offerings@0.3.3#community-calendar"
  - "@schafe-vorm-fenster/proof@0.3.5#zschiesche-gross-kiesow"
  - "@schafe-vorm-fenster/proof@0.3.5#lehre-lelender"
  - "@schafe-vorm-fenster/proof@0.3.5#volkshochschule-uecker-randow"
  - "@schafe-vorm-fenster/proof@0.3.5#zukunftswege-ost-newsletter"
  - "@schafe-vorm-fenster/media-echo@0.3.3#2022-nordkurier-plattform-doerfer"
  - "ia"
derived_from:
  - "@schafe-vorm-fenster/audiences@0.3.3#actors"
  - "@schafe-vorm-fenster/messaging@0.1.0#actors--community-calendar"
  - "@schafe-vorm-fenster/offerings@0.3.3#community-calendar"
  - "@schafe-vorm-fenster/proof@0.3.5#zschiesche-gross-kiesow"
  - "@schafe-vorm-fenster/proof@0.3.5#lehre-lelender"
  - "@schafe-vorm-fenster/proof@0.3.5#volkshochschule-uecker-randow"
  - "@schafe-vorm-fenster/proof@0.3.5#zukunftswege-ost-newsletter"
  - "@schafe-vorm-fenster/media-echo@0.3.3#2022-nordkurier-plattform-doerfer"
  - "ia"
generated_by: "playbook-content-production@1.0.0"
generated_at: "2026-09-11"
tone_profile: "du-everywhere"
provenance: "sourced — every slot. Slot 6a names Groß Kiesow against the real record anchored there, slot 7 carries three real publish-weighted reference cases instead of demo quotes, and slot 8 cites the offering record together with the 2022 Nordkurier entry behind the permanence commitment; all of those are clearance: pending (Q-014, Q-045)"
compliance_check: "state/content-map.md#compliance-checks — TS-022"
schema_note: "see content/pages/home/de.md — same TS-007/schema gap, state/open.md #37"
open_points:
  - "state/open.md #17 — the permanence promise is now cited from `community-calendar` plus the 2022 Nordkurier media-echo entry; whether a proof element of its own gets minted stays open, and the press record has no `usage_rights` yet (Q-045)"
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

<!-- clearance: pending — `zschiesche-gross-kiesow` is `usage_rights: unverified` (Q-014). The place itself is a configuration, not a quote; nothing is quoted here. -->
<!-- source_note: the honesty rule "the live example is always a real covered place" comes from gtm:concept/website-information-architecture.concept.md, page brief `/dein-ort/starten` ("empty-state rule"). -->
<!-- id: mitmachen-6a-reference-place; content_type: configuration; provenance: sourced; derived_from: ["@schafe-vorm-fenster/proof@0.3.5#zschiesche-gross-kiesow"]; status: draft -->

**Reference place (stage 0):** Groß Kiesow

As long as no context is known, the live example shows Groß Kiesow — a
really covered place with a record of its own in the hub
(`zschiesche-gross-kiesow`, a 2022 quote from mayor Dr. A. Zschiesche,
clearance outstanding). No invented place, no invented dates: the module
shows that place's real data. To be replaced as soon as content/editorial
names a different or additional reference place (`state/open.md` #44).

## Slot 7 — Proof block (3 elements, publish-weighted)

<!-- id: mitmachen-7-proof; content_type: proof-card; provenance: sourced-empty-by-design; derived_from: ["@schafe-vorm-fenster/proof@0.3.5"]; status: draft -->

Selection and order are the relevance engine's job, with the
"publish-our-dates" weight profile (TS-005 D5, DEC-048). An empty slot
weakens the claim, but is never replaced by invented text.

### Proof cards, publish-weighted

<!-- clearance: pending — all three records are `usage_rights: unverified` (Q-014): `lehre-lelender` (the foundation's written clearance is outstanding), `volkshochschule-uecker-randow` (the adult education centre's clearance is outstanding), `zukunftswege-ost-newsletter` (clearance outstanding). The protected preview shows them; the pre-go-live hardening round clears them. -->
<!-- source_note: the "publish our dates" weighting comes from gtm:concept/website-relevance-model.concept.md (job_fit) and the job table in gtm:concept/website-communication-principles.concept.md principle 1. -->
<!-- id: mitmachen-7-proof-demo; content_type: proof-card; provenance: sourced; derived_from: ["@schafe-vorm-fenster/proof@0.3.5#lehre-lelender", "@schafe-vorm-fenster/proof@0.3.5#volkshochschule-uecker-randow", "@schafe-vorm-fenster/proof@0.3.5#zukunftswege-ost-newsletter"]; status: draft -->

**Candidates (three, all publishing for themselves):**

1. "The municipality of Lehre runs the calendar for its 17 places under its own name: LeLender." — Stiftung Lebendiges Lehre, Lehre (Lower Saxony)
2. "The adult education centre publishes its entire course programme through the village calendar." — Volkshochschule Uecker-Randow, Pasewalk
3. "The network's newsletter collects its dates through the village calendar." — Zukunftswege Ost-Vorpommern, Ost-Vorpommern

Three real organizations publishing for themselves, which is exactly this
page's job. Names, places, and figures are taken from the records as they
stand: the 17 places and the name "LeLender" from `lehre-lelender`, the
course programme at the Pasewalk site from
`volkshochschule-uecker-randow` (documented by the Kulturlandbüro
Uecker-Randow, Maria Elsner, September 2024), the newsletter dates from
`zukunftswege-ost-newsletter` (documented in the Zukunftswege
Ost-Vorpommern portrait, January 2026).

## Slot 8 — Closing CTA with permanence reassurance

<!-- clearance: pending for the press record — the 2022 Nordkurier entry carries no `usage_rights` (Q-045, `state/open.md` #1). The offering record itself is free to use. -->
<!-- id: mitmachen-8-closing; content_type: closing-cta; provenance: sourced; derived_from: ["@schafe-vorm-fenster/offerings@0.3.3#community-calendar", "@schafe-vorm-fenster/media-echo@0.3.3#2022-nordkurier-plattform-doerfer"]; status: draft -->

**CTA label (identical to slot 1, primary):** Sign up for free

**Reassurance text:** Sign up free, stay free — that has been on the public record since 2022.

The backing now exists, though not in `proof/`: the offering record
`community-calendar` calls free access "a public commitment, not a pricing
decision that can be quietly reversed", and the 2022 Nordkurier article
records the same promise: "Das Basisangebot, das unter anderem beliebig
viele Termine pro Dorf oder Gemeinde erlaubt, werde es auch danach
bleiben." The sentence names the year because the year is on the record,
and no order of magnitude because no record carries one. Whether a proof element of its
own gets minted for this stays open (`state/open.md` #17).

## Context band and closing

<!-- source_note: the offer phrasing instead of a menu comes from gtm:concept/website-communication-principles.concept.md principle 2; the three jobs and their wording from the job table in principle 1. Answers state/open.md row 95 for this page: its own band text rather than the shared home sentence. -->
<!-- id: mitmachen-9-context-band; content_type: context-band; provenance: sourced; derived_from: [ia]; status: draft -->

**Kicker:** Here for something else today?

- **See what's on:** Want to know what's coming up where you live? → `/dein-ort`
- **Run your own calendar:** Want a calendar under your own name, on your own website? → `/dein-kalender`
- **Who is behind it:** Want to know who makes the village calendar? → `/ueber-uns`

This page's focus job is "publish our dates". The band sits below the main
argument and above the closing CTA (principle 2) and is phrased as a
question, not as a menu.
