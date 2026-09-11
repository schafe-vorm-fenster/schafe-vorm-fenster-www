---
id: dein-kalender-bestellen-de
page_id: TS-025
route: "/dein-kalender/bestellen"
content_type: section
status: draft
locale: en
sources:
  - "ia"
derived_from:
  - "ia"
generated_by: "playbook-content-production@1.0.0"
generated_at: "2026-09-11"
tone_profile: "du-everywhere"
provenance: "sourced — 0 generated slots; two system blockers noted inline (D4 preview deferred, D7 code issuance unconfirmed); EN translation of content/pages/dein-kalender/bestellen/de.md, same source ids per slot"
compliance_check: "state/content-map.md#compliance-checks — TS-025"
schema_note: "see content/pages/home/de.md — same TS-007/schema gap, state/open.md #37"
---

# Order the calendar (`/dein-kalender/bestellen`)

Four steps on one route (TS-025 D2). No price slot — €480/year is
fixed per organization, regardless of the chosen scope (DEC-060). No
payment data ever runs through this website (DEC-011); every invoice
goes to an authority, never to a private individual.

## Step 1/2 — Choose scope

<!-- id: bestellen-1-scope; content_type: form; provenance: sourced; derived_from: [ia]; status: draft -->

**Question:** Which area should the calendar cover?

**Mode options:**

- **Places:** add individual places by search
- **Postcode:** one postcode, all places within it
- **County:** a whole county as one entry

**Selected places (chip row):** {n} places selected

The preview of what's actually in the selected scope is deferred for
V1 (DEC-069) — this step only shows what's been selected, no live
figures about the content.

## Exit to briefing (on every step)

<!-- id: bestellen-2-briefing-exit; content_type: section; provenance: sourced; derived_from: [ia]; status: draft -->

**Link label:** Rather talk first? Book a briefing

Leads to the configured Google Calendar URL — secondary, never above
the primary CTA (TS-025 D5).

## Step 3 — Invoice details

<!-- id: bestellen-3-invoice; content_type: form; provenance: sourced; derived_from: [ia]; status: draft -->

**Heading:** Where should the invoice go?

**Field labels:**

- Body/authority (required)
- Department/office (optional)
- Billing address — street, postcode, place (required)
- Different billing office (optional)
- Contact person (required)
- Official email address (required)
- Order reference (optional)
- Leitweg-ID, for e-invoicing (optional)
- VAT ID (optional)

**Note if the form is empty after a reload:** Your selection of places has been kept. You'll need to re-enter the invoice details once — this website doesn't store any of it between page loads.

No payment field, no private address (DEC-011). The field set is a
specification requirement (TS-025 D6); the label wording is this
playbook's UX-writing work.

## Step 4 — Embed code

<!-- id: bestellen-4-embed-code; content_type: section; provenance: sourced; derived_from: [ia]; status: draft -->

**Heading:** Your embed code

**Helper text:** Copy the code now — it's also sent to the email address you provided.

**Fallback note, if the code isn't ready immediately:** The code isn't ready yet. You'll get it by email as soon as it's generated.

Whether the code can be generated immediately on submission is
technically unconfirmed (Q-026 extension, TS-025 D7) — the second
note covers the case where it can't, without showing a confirmation
with no code.
