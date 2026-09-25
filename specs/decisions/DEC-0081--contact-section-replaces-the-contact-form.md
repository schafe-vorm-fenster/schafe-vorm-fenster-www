---
id: DEC-0081
title: The contact section replaces the contact form — one contact surface, and it hosts the booking
status: accepted
date: 2026-09-24
decided_by: jan-henrik.hempel
---

## Context

Two things collided, and the collision had no record.

The design guide (SRC-0014 §"Contact section") and the copy guide
(SRC-0017 CG-031) both state, since 2026-09-23, that **one** contact
section exists for the whole site, that it looks the same everywhere, and
that **there is no contact form**. The specification said the opposite in
three places: `FUN-WEB-0090` ("all lead forms … envoy widget") listed contact
first, `TS-WEB-0016 D1` gave contact its own surface row in the footer, and
`TS-WEB-0016-A2` asserted that the footer renders an envoy mount point for it.
The decision behind the guides lived as a parenthesis inside them
(contradiction C1 of `plan/reviews/2026-09-23/spec-impact.md`) — a rule
with no decision record, which is exactly what the framework forbids.

The second half is the booking. `DEC-0010` resolved
`request-product-briefing` to a Google Calendar appointment schedule
reached by an outbound link, and `TS-WEB-0016 D7` placed that link as a CTA on
`/dein-kalender`, on `/deine-region` and on every step of the order flow.
The 2026-09-22 review rejected the *placement*, not the mechanism: a
visitor who is ready to talk is sent off-site from a hero CTA, with a
disclaimer about who receives the data, instead of being shown the ways
she can reach a person. The consult path is the one place on this site
where the answer is a human being, and it was rendered as a link away.

`request-product-briefing` in `@schafe-vorm-fenster/goals` names video
appointment, WhatsApp and e-mail. **Phone appears in no record** — and
the section has a phone row. That gap is `Q-0072`, not an invention here.

## Decision

**One contact surface exists for the whole website: the contact section.
There is no general contact form anywhere, and the briefing booking runs
through the section.**

### 1. What the section is

Video appointment · WhatsApp · phone · mail, plus the portrait of the
person who answers. The channels, their order and their visual form are
SRC-0014 §"Contact section"; their wording budgets are SRC-0017 CG-031.
This record fixes only what the specification owns: that the section
exists once, that it is the *only* contact surface, and that no page
offers a general contact form — not in the footer, not inline, not as a
fallback.

### 2. Where it stands

The section is rendered by the shared layout on **every page**, between
the closing CTA (`TS-WEB-0006 D2` block 4) and the global footer.

It is **not a block in the D2 sequence** — the same construction
`DEC-0071` §2 used for the breadcrumb trail. That is what keeps
`FUN-WEB-0006` ("the last block of every page is the CTA of its focus job")
literally true while a standing surface sits below it: the trail is
position, the section is a channel list, and neither is an argument
block. Its position is also where the superseded surface already was: the
contact form was a footer element on every page (`TS-WEB-0016 D1` S1), and the
replacement takes that place, promoted from a form inside the footer to a
section above it.

### 3. The booking runs through the section

The outbound Google Calendar appointment link of `DEC-0010` **still
exists, inside the section's first action row.** What is superseded is
the placement:

- No hero CTA, no tier CTA and no order step links out to Google.
- A booking CTA anywhere on a page resolves to **that page's contact
  section** — an in-page target, not an outbound navigation. Only the
  section's first action row navigates off-site.
- The disclaimer wording that told the visitor she was leaving for
  Google belongs to that one row — the outbound marking of **`TS-WEB-0016 D16`**,
  a small note *under* the control and never inside its label — not to
  a CTA in an argument block. *(This bullet cited `TS-WEB-0016 D9` until
  2026-09-25; D9 is the media-preview determination and carried no marking
  rule, so the citation resolved to nothing. D16 is the determination it
  meant, written on 2026-09-25.)*

`DEC-0013` and `DEC-0015` are untouched: still a link, still no embed, no
Google script, no iframe, no font, no CSP entry.

### 4. Where the conversion event fires

`request-product-briefing` fires on the **click of the section's first
action row**, on the route the section was rendered on (`TS-WEB-0016 D12`).

Because the section stands on every page, the route is what distinguishes
one booking intent from another, and no page adds a second event. A click
on an in-page booking CTA emits nothing — it is navigation inside a
document, and counting it would count one intent twice.

### 5. The forms that stay

Quote and briefing **forms** stay envoy widgets. `FUN-WEB-0090` narrows from
"all lead forms" to the lead forms that exist: the quote request on
`/deine-region/angebot` and the invoice step of the order flow. The
website still ships no form backend and no submission route (`DEC-0025`),
and the data boundary of `TS-WEB-0016 D5` is unchanged — there is simply one
fewer form on the site.

### 6. `/ueber-uns` gets a primary conversion: the booking

The trust surface had `primaryConversion: null` (`FUN-WEB-0017`,
`TS-WEB-0027 D1`) because the site had no conversion that fitted a page whose
job is provenance. It has one now. A Landrat, a journalist or a funder who
finishes reading about the sender is at the closest thing this site has to
a sales conversation, and the review's funnel demand is explicit: the page
should push toward a booking rather than open more content.

So `/ueber-uns` declares `primaryConversion: request-product-briefing`,
carries exactly one `data-cta="primary"` above the fold pointing at its
contact section, and repeats it in the closing block. `TS-WEB-0006 D6`'s
`null` shape — the merged three-job block — applies from now on to
`/ueber-uns/archiv` only.

### 7. Failure

The section is static markup: an appointment URL, a WhatsApp link, a
`tel:` and a `mailto:`. There is nothing to load and nothing to fail, so
it needs no fallback of its own. `TS-WEB-0016 D6`'s static fallback keeps its
job for the surfaces that *are* widgets (S2, S4); what it no longer has
to stand in for is general contact, because general contact is now a
standing section rather than a widget that might not arrive.

## Superseded statements

| Where | Said | Now |
| --- | --- | --- |
| `DEC-0009` | all lead forms — contact, quote, briefing — are the envoy widget | the general contact form does not exist; the widget carries the quote request and the order's invoice step |
| `DEC-0010` | the briefing is reached by an outbound link placed as a page CTA | the appointment link lives in the contact section's first action row; page CTAs point at the section |
| `FUN-WEB-0090` | "all lead forms (contact, quote request, briefing request)" | the quote request and the invoice step; contact is a section, booking is a link inside it |
| `FUN-WEB-0093` | `request-product-briefing` resolves to a Google Calendar link | it resolves to the contact section; the section's first row is the Google Calendar link |
| `FUN-WEB-0021` | the footer carries contact | the footer carries newsletter and the legal links; contact is the standing section above it |
| `FUN-WEB-0017` | `/ueber-uns` has no conversion of its own | `primaryConversion: request-product-briefing` |
| `TS-WEB-0016 D1` S1 | contact = an envoy lead form in the footer | the standing contact section, static channel rows, carrying `request-product-briefing` |
| `TS-WEB-0016 D7` | placement on `/dein-kalender`, `/deine-region` and every order step | one placement: the section's first action row, on every page |
| `TS-WEB-0016 D12` | the event fires on the click of the outbound briefing link | it fires on the click of the section's first action row, with the route |
| `TS-WEB-0006 D2` | "nothing renders after block 4 except the global footer" | the contact section stands between block 4 and the footer |
| `TS-WEB-0024 D3`/`A15` | the equal-weight CTA targets the configured Google Calendar URL | it targets the page's contact section; the section's row navigates onward |
| `TS-WEB-0025 D5` | a briefing exit link on each of the four steps | each step's exit points at the page's contact section |
| `TS-WEB-0026 D1` | the briefing link as the secondary action beside the quote CTA | the booking action beside it points at the contact section |
| `TS-WEB-0027 D1`/`A10` | `primaryConversion: null`, zero `data-cta="primary"` | the booking, one primary CTA, repeated in the closing block |

## Consequences

- **The envoy demand shrinks.** `Q-0022` loses the contact form kind; what
  is still demanded is the quote form and the order form (`TS-WEB-0016 D4`
  C2). The widget's delivery date no longer gates whether a visitor can
  reach a person at all.
- **Phone was a channel with no record behind it** — see the amendment
  below, which closes that point. The section shows a number;
  `@schafe-vorm-fenster/goals` did not name the channel. `Q-0072`
  demanded the hub record.
- **The newsletter block on `/ueber-uns` loses its stated reason.**
  `DEC-0052` §4 permitted it inline *because* the page had no conversion
  of its own. The block itself is unaffected — it is secondary treatment
  and stands below the argument blocks — but the justification now needs
  restating by that record's owner. Recorded as an open point on
  `TS-WEB-0027`, not silently repaired here.
- **One surface, one place to change it.** The section is one component
  rendered from the layout, so its channel set, its order and its
  measurement change in one file rather than on nine pages.
- **The design guide keeps a component-level contradiction** that this
  record cannot resolve: SRC-0014 gives the section's first action row
  "the primary treatment". `DEC-0082` settles what that means for the
  one-primary rule and names the correction the guide needs.

## Amendment 2026-09-24 — Q-0072 closed, and the four channels are recorded

The gap §1 named and the consequence above carried is closed. The hub
carries `contact-channels.md` in `@schafe-vorm-fenster/goals` (SRC-0008):
all four channels of §1 — video appointment, WhatsApp, phone, e-mail —
each with its address, the conversion goal it serves and who answers it.
`request-product-briefing` names phone in its `measurement`,
its action and its instrumentation.

What changes for this record:

- **The phone row ships.** It is no longer UNKNOWN content waiting on an
  upstream record. §1's enumeration of four channels stands as written
  and now has a record behind every one of them.
- **The channel set, its order and what each row does** are
  `TS-WEB-0016 D13`, which this amendment establishes as the spec-side home
  for them. §1 continues to own only what a decision owns: that the
  section exists once, that it is the only contact surface, and that
  there is no general contact form.
- **Phone and WhatsApp are one number and two rows.** The published
  imprint and privacy policy carry the number as the telephone number;
  the published QR-code support page names the same number as the
  WhatsApp number. The two rows are two affordances, not a duplication
  to be collapsed.
- **Still no value in a spec.** The number and the address are content
  and resolve from the hub record at build time or from the legal import
  (`DEC-0083` §1). This record names no address either.
- **No response expectation was produced by the closure.** No cleared
  source states one on any channel, so the section promises none. That
  is the same reason `TS-WEB-0016 A13` withholds the two-working-day promise
  on the quote request, and it is carried as an open point in the hub
  record rather than filled in here.
