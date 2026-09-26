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

The control is `Button variant="quiet" size="compact"`, not a bare link and
not the default size. `quiet` has no fill of its own, so the *size* class is
what decides the box, and `size` defaults to `"primary"` — 56 px, the primary
CTA's exact height. Measured on the running page, the default made the second
rung indistinguishable from the first (`/deine-region`: both the primary and
the consult link 56 px tall, weight 800). `compact` is the 44 px
`--height-control` the design system reserves for "secondary, nested submit,
well" (`app/styles/components.css`) — the same height this line had as an
`OutboundLink variant="quiet"`, and the target floor `TS-WEB-0002` sets for a
standalone control. The weight stays the `button` weight of 800 rather than
the quiet text control's 700: that is the design system's own figure for a
pill, and the rung is carried by height, ground and `data-cta="secondary"`
(`TS-WEB-0006 D3`'s ladder), not by weight.

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
  The derivation's bound is written into its docblock: the slug is the first
  48 characters of the target, so two targets agreeing on that prefix would
  collide, and the dash trim runs *after* the slice so a cut on a separator
  cannot leave a trailing dash. No such pair exists in the route table.

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

**Why that one prop stays a pre-built path rather than a `RouteId`.**
`src/components/README.md` rule 4 says targets are route ids, and every other
internal link in this repository obeys it. Two things make the fallback the
exception. The prop is not the component's own target: it is the *page's*
contact section, and the page already resolves it through the facade
(`linkHref(ROUTE, { locale, query, hash: CONTACT_SECTION_ID })`), so the
facade is used — one call site up. And the prop does not arrive here from a
page directly but through `envoy-form-mount`, whose four lead surfaces would
each have to forward a route id, a locale, a query and a hash to say what one
string already says; on `/dein-kalender/bestellen` that query *is* the step
(§2), so the id form would have to carry it anyway. The link is a plain `<a>`
for the same reason it carries no control height: the fallback is three
sentences in three paragraphs, and its own docblock rules out a pill ("never
a pill: the fallback stands inside a surface whose own primary CTA is the
form's submit"). Should a second prop ever need the same treatment, the pair
becomes `briefingTo` + `briefingQuery` and this paragraph is what to delete.

`/dein-kalender/bestellen` step 3 passes the pair as well, not only
`/deine-region/angebot`: `TS-WEB-0016-A14` and `TS-WEB-0025-A14` both name
the booking line as part of *the fallback*, so the degraded slot carries the
way forward itself instead of borrowing the step's exit standing below it.
The two coincide only in the degraded state, which no page can reach while the
widget is the mock (`state` is hard-coded `mocked`, `Q-0022`).

### 5. `/deine-region`'s hero note leaves the content file

`content/pages/deine-region/{de,en}.md` slot 1 carried a fifth field, "Hinweis
zum Zweit-CTA" / "Note on the secondary CTA", whose whole subject was the
outbound navigation that no longer happens there. The field is removed (the
closing heading is field 4 now) and the slot's explanatory prose says where
the marking went. The label at field 3 is untouched — it is the owner's
wording and it still describes the action.

### 6. `pnpm check:terms`'s three violations go; the chain entry stays T-17's

`TS-WEB-0026-A8` is "the response-time wording exists in exactly one module; a
content lint fails on that wording in any content file".
`scripts/check-terms.ts` has enforced that since F-2-43 and was never wired
into `pnpm check`, so three violations accumulated — a gallery demo and two
lines of a component test, exactly the "page, demo surface or test fixture"
the script's own docblock names. This task clears those three (they are the
residue its own review item names) and leaves the chain alone.

The first version of this round did wire the guard into `package.json`'s
`check` line, and the review round was right to send it back: `package.json
(check chain)` and `scripts/check-terms.ts` are **T-17's** owned files, T-17's
goal states verbatim that "`check:terms` joins the `check` chain", and the
`check` line is one JSON string that T-01 and T-07 hold as a shared file too —
a fourth package editing it mid-round is the merge conflict `state/open.md`
row 143 had already reasoned its way out of. A8 does not need the chain entry
to be citable either: `pnpm check:terms` → `terms check: 515 file(s) scanned
for the response-time wording` / `no errors` is the measurement, and rows 143
and 152 now say who adds the line.

## Consequences

- `TS-WEB-0016-A5` and `A23`, `TS-WEB-0025-A2` and `A11`, `TS-WEB-0026-A6`,
  `A13` and `A8` hold on the three routes this task owns. **`A14` of
  TS-WEB-0016 and of TS-WEB-0025 do not** — they are half discharged, and the
  Open section below says which half and why (`state/open.md` row 266).
  `/dein-kalender` (T-13) and `/ueber-uns` (T-14) are the other two routes A5
  names; `e2e/contact-section.spec.ts`'s `BRIEFING_HREF_REPOINTED_BY` lost its
  `region` and `order` entries with this change and its `calendar` entry with
  T-13's, so after merging `next-2026` **the map is empty**
  (`contact-section.spec.ts:59-63`) and every route it covered is done. It
  stays declared: the `test.fail` mechanism now guards future regressions
  only — the next route whose booking link leaves the page gets a named home
  there instead of a silently skipped assertion.
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
  gallery. Its browser walk arrives with the widget. Concretely:
  `TS-WEB-0016-A14` and `TS-WEB-0025-A14` are **half** discharged. Both pages
  now pass the fallback everything the criteria name and
  `lead-fallback.test.tsx` asserts the rendered result, but no browser test can
  block a script the mock never loads or reach the `degraded` state a page
  cannot enter (`state` is hard-coded `mocked`, no toggle, and adding one to a
  shipping page to make a test pass is not a change this task takes).
  `state/open.md` row 266 is that gap's durable home; `e2e/pages/bestellen.spec.ts`'s
  A14 case and `lead-fallback.test.tsx` cite it.

  **Amendment (2026-09-26, QA round 2).** The first version of this round
  claimed `check:specs` W3 still listed `TS-WEB-0016-A14` as untested. It did
  not, and the reason is this record's own defect: `scripts/check-specs.ts`
  builds its `referencedIds` set by raw-scanning test files for acceptance ids,
  **comments included**, so the two prose mentions the round added to
  `e2e/pages/bestellen.spec.ts` and
  `src/components/lead-fallback/lead-fallback.test.tsx` took the criterion off
  the W3 list without a test being written. The single automated signal for an
  untested criterion was silenced by a sentence. Both mentions are written as
  prose now (`A14 of TS-WEB-0016`), the scan sees no bare id, and the criterion
  is back on the list — measured after merging `next-2026`:
  `pnpm check:specs` reports `W3 150/428` with `TS-WEB-0016-A14` in the list,
  against `149/428` without it. The gap itself lives in `state/open.md` row 266,
  where a reviewer and the owner can both find it.
- The two-working-day promise stays withheld (`TS-WEB-0016-A13`,
  `TS-WEB-0026-A7`): `check:terms` is what keeps a softened variant out —
  green here, and blocking every commit once T-17 puts it in the chain — and
  `RESPONSE_PROMISE_TEXT` stays `null` until `C11` is answered.
