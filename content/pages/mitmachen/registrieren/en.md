---
id: mitmachen-registrieren-de
page_id: TS-023
route: "/mitmachen/registrieren"
content_type: section
status: draft
locale: en
sources:
  - "@schafe-vorm-fenster/offerings@0.3.3#community-calendar"
  - "ia"
derived_from:
  - "@schafe-vorm-fenster/offerings@0.3.3#community-calendar"
  - "ia"
generated_by: "playbook-content-production@1.0.0"
generated_at: "2026-09-11"
tone_profile: "du-everywhere"
provenance: "mixed — 4 sourced, 1 generated (step 2 vocabulary, see slot 2); EN translation of content/pages/mitmachen/registrieren/de.md, same source ids per slot"
compliance_check: "state/content-map.md#compliance-checks — TS-023"
schema_note: "see content/pages/home/de.md — same TS-007/schema gap, state/open.md #37"
open_points:
  - "state/open.md #18 — step-2 vocabulary (who publishes) is a generated placeholder enum pending the app team's account model"
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

<!-- id: registrieren-2-wer; content_type: form; provenance: generated; derived_from: []; status: draft -->

**Question:** Who's publishing the dates?

**Options (generic placeholder, see note):**

- Club or initiative
- Municipality or administration
- Parish, fire brigade, or similar organization
- Individual
- Other

No hub record defines this list — the app's account model owns it, and
the app hasn't published it yet (TS-023 D2, "step-2 vocabulary
UNKNOWN"). The options above are a deliberately generic, replaceable
placeholder (`provenance: generated`), registered in `state/open.md`
#18. This answer doesn't classify the visitor for the website — it's
account information for the app (TS-023 D8).

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
