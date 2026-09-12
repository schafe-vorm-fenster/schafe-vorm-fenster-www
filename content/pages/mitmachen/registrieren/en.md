---
id: mitmachen-registrieren-de
page_id: TS-023
route: "/mitmachen/registrieren"
seo:
  "/mitmachen/registrieren":
    title: "Sign up to publish dates"
    description: "Three steps to your access: choose the place, say who is publishing, start. No real name, no email address, and no sign-up fee at all."
    provenance: generated
content_type: section
status: draft
locale: en
sources:
  - "@schafe-vorm-fenster/offerings@0.3.3#community-calendar"
  - "@schafe-vorm-fenster/audiences@0.3.3#actors"
  - "@schafe-vorm-fenster/audiences@0.3.3#municipalities"
  - "ia"
derived_from:
  - "@schafe-vorm-fenster/offerings@0.3.3#community-calendar"
  - "@schafe-vorm-fenster/audiences@0.3.3#actors"
  - "@schafe-vorm-fenster/audiences@0.3.3#municipalities"
  - "ia"
generated_by: "playbook-content-production@1.0.0"
generated_at: "2026-09-11"
tone_profile: "du-everywhere"
provenance: "sourced — every slot. Step 2's option list is now drawn from the `actors` and `municipalities` audience records' own enumerations; the binding enum still belongs to the app's account model (state/open.md #18)"
compliance_check: "state/content-map.md#compliance-checks — TS-023"
schema_note: "see content/pages/home/de.md — same TS-007/schema gap, state/open.md #37"
open_points:
  - "state/open.md #18 — the step-2 labels are now sourced from the audience records, but the binding value set is still the app account model's to publish"
---

# Register (`/mitmachen/registrieren`)

Three steps, then handover to the app (TS-023 D1, D2). No form, no
real name, no email — every identity-bearing field belongs to the
account, and the account belongs to the app (TS-023 D6). Context band
only on step 1 (TS-023 D7).

## Step 1 — Which place

<!-- id: registrieren-1-ort; content_type: form; provenance: sourced; derived_from: [ia]; status: draft -->

**Question:** Which place do you want to publish for?

**Search input (placeholder):** Your postcode

Pre-filled, visible, and editable when `?ort=` arrives from
`/dein-ort/starten`, `/mitmachen`, or the empty calendar view
(TS-023 D5) — never skipped.

## Step 2 — Who's publishing

<!-- source_note: the option list is taken from the audience records' own enumerations (`actors` field "Context": Vereine, Feuerwehr, Kirchengemeinde, Initiativen, Kulturbetriebe, mobile Dienste such as a Bäckerwagen or Arztbus, local businesses with an occasional event; `municipalities` field "Context": Gemeinden, Städte, Ämter, Samtgemeinden, Verbandsgemeinden). The order follows this page's audience priority from gtm:concept/website-information-architecture.concept.md, page brief `/mitmachen/registrieren` (1 actors). -->
<!-- id: registrieren-2-wer; content_type: form; provenance: sourced; derived_from: ["@schafe-vorm-fenster/audiences@0.3.3#actors", "@schafe-vorm-fenster/audiences@0.3.3#municipalities"]; status: draft -->

**Question:** Who's publishing the dates?

**Options:**

- Club or initiative
- Fire brigade or parish
- Cultural venue or organization
- Municipality, town, or Amt
- Mobile service or business with occasional dates

The words are the audience records' own: the `actors` record
lists Vereine, Feuerwehr, Kirchengemeinde,
Initiativen, Kulturbetriebe, mobile services such as a Bäckerwagen or
Arztbus, and local businesses with an occasional event in its "Context"
field; `municipalities` names Gemeinden, Städte, Ämter, Samtgemeinden, and
Verbandsgemeinden. The same record notes that behind all of these there is
very often one person doing it voluntarily — so the list asks about the
organization and not about the person.

What stays open is the binding: which values the app's account finally
stores is the app's account model to decide, and it has not published it
(TS-023 D2, `state/open.md` #18). This answer doesn't classify the visitor
for the website — it's account information for the app (TS-023 D8).

## Step 3 — Which publishing path

<!-- id: registrieren-3-weg; content_type: form; provenance: sourced; derived_from: ["@schafe-vorm-fenster/offerings@0.3.3#community-calendar"]; status: draft -->

**Question:** How do your dates get to us?

**Options:**

- Photo of the flyer by WhatsApp
- Your existing calendar, connected
- Your website as the source

The same three mechanisms as on `/mitmachen` (slots 3–5) — no fourth
option.

## Step indicator

<!-- id: registrieren-4-step-indicator; content_type: section; provenance: sourced; derived_from: [ia]; status: draft -->

**Label:** Step {n} of 3

## Handover

<!-- id: registrieren-5-handover; content_type: closing-cta; provenance: sourced; derived_from: [ia]; status: draft -->

**Button label:** Continue in the app

**Note after (generic, no prefill promise):** The app will ask you for the details of your first date next.

Phrased generically, because there's no prefill contract between the
website and the app (DEC-029, TS-023 D6) — the page does not claim
that place, role, or path are already pre-filled in the app. After the
click, no confirmation, no instructions, and no further form follow on
this website — the app takes over completely.

## Context band (step 1 only)

<!-- source_note: the offer phrasing instead of a menu comes from gtm:concept/website-communication-principles.concept.md principle 2; the three jobs and their wording from the job table in principle 1. The band renders on step 1 only (TS-023 D7, state/open.md #24). Answers state/open.md row 95 for this page. -->
<!-- id: registrieren-6-context-band; content_type: context-band; provenance: sourced; derived_from: [ia]; status: draft -->

**Kicker:** Here for something else today?

- **See what's on:** Want to know what's coming up where you live? → `/dein-ort`
- **Run your own calendar:** Want a calendar under your own name, on your own website? → `/dein-kalender`
- **Who is behind it:** Want to know who makes the village calendar? → `/ueber-uns`

From step 2 the band disappears: someone inside the flow should be able to
finish it without the page offering three other routes out of it
(TS-023 D7, a registered deviation from TS-006).
