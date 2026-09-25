---
id: DEC-0113
title: Hub contact values reach the site through a generated file — and the contact section's open choices, recorded
status: DRAFT
date: 2026-09-25
decided_by: the engineering team
---

## Context

`TS-WEB-0016 D13` fixes which four channel rows the contact section has, in
which order and with which scheme, and says where the values come from: the
appointment URL is one configured value (D7), and the phone number, the
WhatsApp number, the e-mail address and who answers are the hub record
`contact-channels.md` in `@schafe-vorm-fenster/goals` (SRC-0008), *"reaching
the site through the content pipeline at build time"*. No determination and
no criterion states a value (DEC-0083 §1), and `TS-WEB-0016-A16` fails a build
in which a value does not resolve or is hard-coded in a page, a component or a
spec file.

The hub packages are devDependencies of the content pipeline, and the loader
architecture never opens one at request time (`TS-WEB-0007 D3`). Two things in
this repository already answer that constraint the same way:
`scripts/build-place-index.ts` commits `src/generated/snapshots/communities.json`,
and `src/lib/live/briefing.ts` transcribes the appointment URL from the hub
people record with a comment naming its line.

Building the section (`T-01`, wave 1) met a second set of open points the
specification leaves to whoever builds it: how one click completes two goals
without one firing twice (DEC-0081 amendment 2026-09-25 §3), where the static
call-site check looks for a component that owns its goal ids, what the
registry says the surface of a section on every route is, and which strings
of the design draft (`plan/reviews/2026-09-23/Design - Kontakt Section.png`)
may ship. Two of these the owner defaulted in the backlog for this wave; the
rest are this record's.

## Decision

### 1. The values are a generated, committed file with a parity test

`scripts/build-contact-channels.ts` (`pnpm build:contact-channels`) reads the
installed record through `src/lib/contact/hub-record.ts` — the one parser, pure,
which throws on anything but four rows in D13 order with an address each — and
writes `src/generated/contact-channels.json` with the package version it read
(`@schafe-vorm-fenster/goals@0.3.3#contact-channels.md`). The site reads only
the generated file (`src/lib/contact/contact-channels.ts`), validates it when
the module loads, and derives each row's `href` from its scheme:
`https://wa.me/<digits>`, `tel:+<digits>`, `mailto:<address>`.

`src/lib/contact/contact-channels.test.ts` parses the installed record again
and compares it to the committed file, so a hub release that moves a value
fails `pnpm check` until the file is rebuilt; the same test walks
`src/components` and `src/lib` for any of the values and fails on a hit
(A16's other half). This is the owner's default for the wave, applied.

The appointment row's `href` stays `BRIEFING_URL` (D13: *one configured value*,
the environment wins). The generated file carries the hub's appointment address
too, and the test asserts the default equals it, so the two sources cannot
drift apart silently.

### 2. The design-draft strings ship as placeholders, marked

The section head (*Direkter Kontakt*), the lead (*Per Video, WhatsApp, Telefon
oder Mail.*), row 1's sub-label (*Termin im Kalender aussuchen*) and the D16
marking sentence exist only as design-draft text; nobody wrote them as copy.
They ship as dictionary strings (`contactSection.*`), the section carries
`data-demo="true"`, and `state/open.md` carries one row per string — the
repository's placeholder convention (DEC-0068, `validate.ts:112-133`) applied
to chrome strings, as the owner defaulted. The four row titles are the owner's
wording (`concept/website-copy-guide.md` CG-031) and are not placeholders; the
English titles are their translations, with *Book a video call* taken from the
hub people record's own label for the schedule link. The portrait alt is the
cleared alt of `content/pages/ueber-uns/{de,en}.md`. Rows 2–4 show the number
or address itself as their line (CG-031: what the row *is*), and no row states
a response time.

### 3. Two goals on one click: one tracker per goal id, nested

`ConversionTracker` fires one goal per wrapper. Row 1 is wrapped in two —
`make-contact` outside, `request-product-briefing` inside — so the click
bubbles through each `display: contents` span once and every goal id fires
exactly once. `src/components/contact-section/conversions.ts` is the one place
that decides which goals a channel emits, with the channel and the route as the
whole payload, and `conversions.test.ts` checks the three rules of the
amendment. The shared `conversion-tracker.tsx` is untouched: a `goals` array
prop would have been a second way to say the same thing.

### 4. The static call-site check reads `src/components` too

`src/lib/analytics/call-sites.test.ts` scanned `app/` only, on the reading
that a page names the goals it fires. The contact section is the first
component that owns its goal ids by determination — D13 fixes the two goals of
row 1 — and the layout that mounts it (`T-10`) names none. The scan now covers
`app/` and `src/components/`, excluding tests; a component that takes its
binding as a prop (`howto-block`) stays invisible to it, as before. The test
also asserts that `make-contact`'s only call sites are under
`src/components/contact-section/`.

### 5. The registry's surface for a section on every route is `"chrome"`

`ConversionEventDefinition.surface` gains the literal `"chrome"` beside `"app"`
and the route list. `make-contact` is registered wired at stage `handover`
with that surface, its trigger names the number as an intent (A18), and
`request-product-briefing` moves to the same surface with the trigger DEC-0081
§4 gives it. Ten registry rows, six wired.

### 6. The marking, the label and the hairline rows

- Row 1 navigates in the same tab. D16 wants the marking to say what
  activating the control does and who receives what follows; nothing in D13,
  D16 or DEC-0081 asks for a new tab, and a same-tab link needs no second
  disclosure. The marking is its own `<p>` at the `meta` role **after** the
  control in DOM order, linked by `aria-describedby`, not a button, link or
  consent control (A23).
- Rows 3 and 4 show the icon and the mono value only (SRC-0014). The owner's
  row title (*Anrufen*, *Mail schreiben*) stays in the link's accessible name,
  visually hidden, so the name contains the visible text and the action.
- The two row heights and the avatar size are three custom properties in
  `app/styles/components.css` (`--height-contact-row`,
  `--height-contact-hairline-row`, `--size-contact-portrait`), where the
  design system's fixed heights live — a minimal edit to a shared file.
- The anchor id is `kontakt` in both locales, the owner's default.
- No prefilled text, subject or body on any row (D14 §6, the owner's note): no
  copy rule exists for the sentence, so A19 and A20 hold trivially.

## Consequences

- The site never renders a contact value the installed hub record does not
  carry, and a moved value is a red `pnpm check`, not a wrong number on
  every page.
- Four placeholder strings and the English row titles wait on the owner; the
  rows in `state/open.md` say which and where.
- The browser half of `TS-WEB-0016-A15`, `A17` and `A23` — clicks, events
  through the mock tracker, DOM order on a served route — is the layout
  mount's e2e (`e2e/contact-section.spec.ts`, `T-10`); the component tests here
  cover the markup the server renders.
- `app/[lang]/_chrome.tsx` still names the envoy fallback's address as a
  literal (`CONTACT_EMAIL`); the A16 walk stops at `src/` until `T-10` reads
  it from `contactChannel("mail")`, after which the walk should include `app/`.
- The in-page booking CTAs that still link `BRIEFING_URL` with their own
  `request-product-briefing` tracker (`/dein-kalender`, `/deine-region`, the
  order flow) are `T-15`'s to redirect to `#kontakt`; until then the registry
  row's surface says where the event belongs and the pages still fire it.
