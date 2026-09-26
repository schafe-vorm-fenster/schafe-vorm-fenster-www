---
id: DEC-0133
title: The booking CTA resolves in-page and the marking leaves the label — `<route>#kontakt` through the route facade, the scope rides along in the order flow, and the disclosure becomes a described `meta` span for every variant
status: DRAFT
date: 2026-09-26
decided_by: the engineering team
---

## Context

`DEC-0081` §3 superseded the *placement* of the Google Calendar appointment
link, not the link: "No hero CTA, no tier CTA and no order step links out to
Google. A booking CTA anywhere on a page resolves to **that page's contact
section** — an in-page target, not an outbound navigation." `TS-WEB-0016 D7`,
`TS-WEB-0025 D5` and `TS-WEB-0026 D1` each repeat it for their own surface,
and `TS-WEB-0016-A5` states the testable form: the section's first action row
"is the only element on the page carrying that href".

Three surfaces still carried it themselves when T-15 started —
`/deine-region`'s hero and closing footer (one `briefingLink` rendered twice),
the lead fallback on `/deine-region/angebot`, and the consult exit on three
screens of `/dein-kalender/bestellen` — each wrapped in a
`ConversionTracker` for `request-product-briefing`, which D7's Measurement row
says an in-page CTA must not fire ("counting it would count one intent
twice"), and each carrying its own outbound disclosure.

`TS-WEB-0016 D16` and `A23` then say where a marking goes: "**under the
control, never inside its label**", at the `meta` type role, "programmatically
associated with the control". `outbound-link` did the opposite. Its two
control variants printed the words under the pill *and* kept the same words
inside the `<a>` behind a `clip-path`, with the visible copy marked
`aria-hidden` — so the recipient was in the control's accessible name, which
is the half of A23 that reads "the control's own label and accessible name
contain neither the recipient nor a parenthetical about a new tab". The
`inline` variant kept them in the link text outright.

The specification is complete on *what* must hold. Four things it does not
fix had to be decided to build it.

## Decision

### 1. The in-page target is the route facade plus the `kontakt` fragment

Every booking CTA on these three routes renders `RouteLink`/`linkHref` with
`to` = the page's own route id and `hash` = `CONTACT_SECTION_ID`, the constant
`src/components/contact-section/contact-section.tsx` exports. No page types a
path and no page types `#kontakt`; the owner's default of 2026-09-26 —
"booking CTAs link `<route>#kontakt` through the route facade" — is followed
literally, and the same id serves both locales because a DOM id is not copy
(`DEC-0113`).

A bare `href="#kontakt"` was the alternative and was rejected: it is
invisible to the facade, so nothing would fail if the section's id moved, and
`TS-WEB-0001 D5`'s rule is that no component holds a literal internal href.

### 2. On `/dein-kalender/bestellen` the exit carries the flow's own query

The facade form of an in-page link is a full path, and a full path without the
flow's parameters is a different screen: `?orte=…&kreis=…&schritt=…` *is* the
step (`TS-WEB-0025 D8`, "the scope is in the URL, so back restores it"). The
exit therefore passes the current `orte`, `kreis` and `schritt` through
`query` alongside the hash, so the visitor lands on the contact section of the
step she was on and `Back` returns her to it. Dropping them would have made
the consult exit a way *out of* the order rather than a way to ask about it.

### 3. The marking is a described `span` after the control — in every variant

`outbound-link` renders the disclosure as one `<span>` that follows the
anchor, outside it, carrying the `meta` type role and an id, with
`aria-describedby` on the anchor. Three choices inside that:

- **A `span`, not a `p`.** The contact section renders its own row-1 marking
  as a `<p>` (`contact-section.tsx`, T-01) because it stands in a list item.
  `outbound-link` is used inside sentences and inside paragraphs
  (`lead-fallback`, `archive-row`, `quote-card`, `proof-card`), where a `<p>`
  would be invalid markup. A23 asks for "a separate element … at the `meta`
  type role", not for a particular tag.
- **The `inline` variant loses the words from its label too.** The docblock
  used to argue the opposite — that a reader of the sentence needs them in the
  line. She still reads them: the span sits in the same line and wraps under
  it. What changes is only that they are no longer in the link's accessible
  name, which A23 forbids without exempting a variant.
- **The id is derived from the target** (`outboundNoteId(href)`), because this
  is a server component and `useId` is not available in one. The target is the
  one value that distinguishes one outbound link from another and it survives
  the prerender/hydrate boundary. Two links to the *same* target on one page
  share the id, which resolves to the same sentence and so reads correctly; a
  caller that wants two distinct markings passes `noteId`. `/dein-kalender`
  is the only page with two such links today, and T-13 repoints both.

The assembled line is also simplified from `"(öffnet neuen Tab) · Daten gehen
an X"` to `"öffnet neuen Tab · Daten gehen an X"`: the parentheses existed to
keep the fragment readable *inside* a label, and there is no label around it
any more.

### 4. The lead fallback's three lines are dictionary strings, and its third line is the section

`lead-fallback` held `"Formular öffnen"`, `"oder per E-Mail:"` and
`"Termin für ein Kennenlerngespräch buchen"` as German literals, so
`/en/your-region/quote` would degrade into German — the same root cause as
`F-2-4`. They are UI strings rather than page copy (repository working rule 4,
and the backlog's own `copy_source` for this task says so), so they move into
`src/lib/i18n/dictionary.ts` under `leadFallback`, with the English consult
label taken from the owner's own English content
(`content/pages/deine-region/en.md`, "Book an intro call"). No new sentence is
invented and no placeholder is needed.

The fallback's `briefingHref` keeps its name and changes its meaning: it is
the page's contact section as an in-page target, built by the page through
`linkHref`. The component renders it as a plain link at
`data-cta="secondary"`, with no `ConversionTracker` and no marking, because
nothing outbound happens on it.

### 5. `/deine-region`'s hero note leaves the content file

`content/pages/deine-region/{de,en}.md` slot 1 carried a fifth field, "Hinweis
zum Zweit-CTA" / "Note on the secondary CTA", whose whole subject was the
outbound navigation that no longer happens there. The field is removed (the
closing heading is field 4 now) and the slot's explanatory prose says where
the marking went. The label at field 3 is untouched — it is the owner's
wording and it still describes the action.

### 6. `pnpm check:terms` joins the `check` chain

`TS-WEB-0026-A8` is "the response-time wording exists in exactly one module".
`scripts/check-terms.ts` has enforced that since F-2-43 and was never wired
into `pnpm check`, so three violations accumulated — a gallery demo and two
lines of a component test, exactly the "page, demo surface or test fixture"
the script's own docblock names. The script is now in the chain, and the three
fixtures carry strings that make the same assertion without the promise.

## Consequences

- `TS-WEB-0016-A5`, `A14`, `A23`, `TS-WEB-0025-A2`, `A11`, `TS-WEB-0026-A6`,
  `A13` and `A8` hold on the three routes this task owns.
  `/dein-kalender` (T-13) and `/ueber-uns` (T-14) are the other two routes A5
  names; `e2e/contact-section.spec.ts`'s `BRIEFING_HREF_REPOINTED_BY` keeps a
  `test.fail` marker for `calendar` and lost the `region` and `order` entries
  with this change, so the marker fails the moment either half is done twice.
- The `request-product-briefing` goal now fires from exactly one place per
  route — the contact section's first action row — and from nowhere in a page
  body. Nothing else about the goal changed.
- `outbound-link`'s change is site-wide: `archive-row`, `quote-card`,
  `proof-card` and the `/dein-kalender` hero all print their new-tab
  announcement after the link instead of inside it. Measured green:
  `e2e/pages/archiv.spec.ts`, `e2e/pages/dein-kalender.spec.ts`,
  `e2e/pages/home.spec.ts`, `e2e/pages/ueber-uns.spec.ts`, `e2e/a11y.spec.ts`,
  `e2e/cta-contrast.spec.ts`, `e2e/contact-section.spec.ts`.
- `outbound-link.module.css` loses `.hint` and `.hidden`: nothing renders
  inside the control any more, so the clipped copy has no purpose.

## Open

- `Q-0022` / `C10` — the envoy widget is still undelivered, so the lead
  fallback's own markup is only reachable through the component test and the
  gallery. Its browser walk arrives with the widget.
- The two-working-day promise stays withheld (`TS-WEB-0016-A13`,
  `TS-WEB-0026-A7`): `check:terms` in the chain is what keeps a softened
  variant out, and `RESPONSE_PROMISE_TEXT` stays `null` until `C11` is
  answered.
