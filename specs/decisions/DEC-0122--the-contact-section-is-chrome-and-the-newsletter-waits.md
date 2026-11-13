---
id: DEC-0122
title: The contact section is chrome and the newsletter waits — the layout mounts the one contact surface on every page, the footer form and its envoy kind are gone, and the newsletter block renders nowhere until a sending system is named
status: DRAFT
date: 2026-09-25
decided_by: the engineering team
---

## Context

`DEC-0081` §2 places the contact section "on **every page**, between the
closing CTA (`TS-WEB-0006 D2` block 4) and the global footer", rendered by
the shared layout and **not** a block of the D2 sequence — the construction
`DEC-0071` §2 used for the breadcrumb trail. `TS-WEB-0006 D2` says the same
("after block 4 stand exactly two things: the contact section, then the
global footer"), `TS-WEB-0004 D4` removes the footer's contact entry, and
`TS-WEB-0006-A17` forbids a general contact form anywhere: "no `form` element
and no envoy mount point exists outside `/deine-region/angebot` and the
order flow's invoice step". T-01 built the component
(`src/components/contact-section/`, DEC-0113); this record is its mount
(task T-10) and the three things the mount had to decide that no
determination fixes.

The second half of the task is the newsletter. `TS-WEB-0016-A21` says
"neither the footer newsletter entry nor the inline block on `/ueber-uns`
renders while no sending system accepts a subscription: no form that posts
nowhere". The block rendered in the footer of all 24 routes as a labelled
mock (`state/open.md` row 22, Q-0020 open), and the 2026-09-22 review called
the section "good" (R-home-35). The owner's defaulted decision for this
task (`backlog.json`, `owner_decisions_defaulted`) already settles the
conflict: *"TS-WEB-0016-A21 (no form that posts nowhere) wins over review
R-home-35; the block is withheld behind a null constant and returns with the
benefit heading when a sending system exists."* The specification carries
the truth (DEC-0104, AGENTS.md rule 8); the review is evidence.

## Decision

### 1. The section is chrome: `_chrome.tsx` renders it, outside `main`

`app/[lang]/_chrome.tsx` renders `<ContactSection locale route />` between
`</main>` and `<SiteFooter>`, on every route, as the same client chrome that
renders the header and the footer — not in `_page-frame.tsx`, which owns
blocks 3 and 4 and never learns the section exists.

Two reasons, both already in the tree. It has to be **one per document**:
with Cache Components on, the App Router keeps the last three route segments
mounted inside hidden `<Activity>` boundaries, so anything a *page* renders
is still in the document after a click (`state/open.md` row 204,
`e2e/landmarks.spec.ts`); a section every page rendered would stand twice
after one navigation. And every event a row fires carries **the route the
section was rendered on** (`TS-WEB-0016 D12`), which the chrome already reads
off the router tree for the header's `aria-current` and the footer's language
switch. `e2e/landmarks.spec.ts` now counts `#kontakt` beside `header`, `main`
and `footer` on every navigation and every return.

**"After the closing block" on the two routes that have none.**
`TS-WEB-0006-A17` puts the section "in DOM order after the closing block", and
`/mitmachen/registrieren` and `/dein-kalender/bestellen` render no closing block
at all: `TS-WEB-0023 D7` and `TS-WEB-0025` suppress blocks 3 and 4 inside a flow
(F-2-10, `state/open.md` row 24), and both pages compose their blocks by hand
rather than through `PageFrame`. The walk asserts the position it can — exactly
one section, outside `main`, with nothing between it and the footer — and names
those two routes as the set that carries no `#closing-cta`, instead of either
narrowing the criterion or pretending the anchor is there. The section stands
in the same place on them as everywhere else; only the element it would be
measured against is missing, by an older determination.

Consequences for the page frame: the closing block is still the last block
inside `main` (`FUN-WEB-0006` literal), `e2e/pages/home.spec.ts`'s "nothing
after the closing CTA" reads `main > *` siblings and is untouched, and the
section is **not** a rhythm entry — SRC-0014 §Colour exempts it from the
alternation count, so `checkRhythm` and the per-page rhythm tests never see
it (T-05's default).

### 2. The footer form and its envoy kind are deleted, not hidden

`SiteFooter` loses its `contact` slot and the `<details>` disclosure;
`envoy-form-mount`'s kind `contact` and `CONTACT_FIELDS` are deleted
(`fields.ts`), so `ENVOY_FORM_KINDS` is `["quote", "order-invoice"]` — the
two surfaces A17 names — and the type system refuses a third mount point
rather than a test catching one. The gallery's footer and mount demos follow.
The footer's `contact` dictionary key stays where it is: the dictionary is a
shared file (T-07) and an unused word costs nothing; removing it is a
one-line follow-up.

**The criterion's own text is not amended here, and that is a debt, not an
oversight.** `TS-WEB-0004-A9` still reads "Footer on every page carries
newsletter and the three legal links". `TS-WEB-0016-A21` is the later and the
more specific statement — it names the newsletter, names the condition and
names both surfaces — so it governs, and A9's newsletter clause is the one
that has to move. This task owns no line of `TS-WEB-0004`, so amending it is
owed to that file's next owner; the walk says in its own header which
criterion it is reading and why (`e2e/footer.spec.ts`). Nothing about A9's
contact clause is in question: D4 already removed the footer's contact entry.

`e2e/footer.spec.ts` is re-based on the footer that remains: TS-WEB-0004-A9
reads "the three legal links and the language switch"; the touch-target
count is **4** (three legal links, the one other language), down from 7 —
the summary, the newsletter field and its submit went with the form and the
withheld block; the no-JavaScript case asserts the same base line rather than
a disclosure opening.

### 3. The newsletter is withheld behind one null constant, at the mount sites

`src/components/newsletter-block/constant.ts` exports
`NEWSLETTER_SENDING_SYSTEM: string | null = null` and `newsletterOffered()`,
the shape `response-promise/constant.ts` uses for the two-working-day
promise: *removed, never softened*, and one place to flip.

**The gate is at the mount sites, not inside the block.** `layout.tsx` hands
the footer its `newsletter` slot only when `newsletterOffered()`; `/ueber-uns`
reads the same predicate in T-14 (its page is T-14's file, and T-14's goal
names "newsletter inline gated by T-10's constant"). `NewsletterBlock` itself
is unchanged — it still renders the full mock, still cancels its submit
(F-3-11), still carries no `name` on the input — so the T-08 benefit heading
(`newsletter.heading`, `state/open.md` row 233) and the `data-demo` marking
on it are right the moment the block returns, and the shared unit test that
renders the block directly (`live-modules-and-conversions.test.tsx`) keeps
passing. A block that returned `null` on its own would have hidden the
gallery entry and broken that test for no gain in A21 coverage.

`e2e/newsletter.spec.ts` is re-based on A21: no `[data-newsletter]` and no
`#newsletter-email` on any route in either language, and the constant is
`null`. The four F-3-11 cases (cancel, keep the URL, confirm in a live
region, unnamed input) need a rendered block and are described in the file's
header for the day it returns; they are not kept as skipped tests.
`e2e/content-compliance.spec.ts`'s "footer newsletter mock declares itself in
`data-mock`" becomes "the contact section declares its placeholder copy in
`data-demo`, and no newsletter mock renders" — the standing surface that
took the footer form's place carries the same marking regime (DEC-0113).

### 4. What "no `form` element" means in the walk

`TS-WEB-0006-A17`'s sentence is scoped by its own colon — "renders a
**general contact form**: no `form` element and no envoy mount point" — and
the site has forms that are not contact forms: the place search and the
choice groups are `method="get"` navigations whose only effect is a URL
(`search-form.tsx`, `choice-group.tsx`). A literal "zero `form` elements"
would fail on `/` and `/dein-ort` for the search that `TS-WEB-0019 D2` makes
block 1. `e2e/contact-section.spec.ts` therefore asserts, outside the two
lead routes, **no `[data-envoy-form-kind]` and no `form` without
`method="get"`** — which is exactly the set that could take data — and
inside the footer no `form`, `input`, `textarea`, `details` or `summary`
at all. On `/deine-region/angebot` every submitting form is an envoy mount
and none is of kind `contact`.

### 5. Expected failures that name their owner, not exemptions

Four routes cannot pass two of the A17 assertions until tasks later in the
merge order land, and the walk says so with `test.fail(condition, reason)`
rather than by skipping them or by narrowing the criterion. The list is
measured, not assumed: `/deine-region/angebot` was on it and came off, because
its lead fallback's briefing link renders only in the widget's `empty` and
`degraded` states and the route ships the `mocked` one.

| Assertion | Route(s) | Why it fails today | Who fixes it |
| --- | --- | --- | --- |
| row 1 is the only element with the appointment URL | `/dein-kalender` | the page's briefing CTAs still carry `BRIEFING_URL` themselves | T-13 repoints them to `#kontakt` (TS-WEB-0016-A5) |
| the same | `/deine-region`, `/dein-kalender/bestellen` | the same | T-15 |
| no submitting form outside the two lead routes | `/ueber-uns` | the inline newsletter form renders until the page reads `newsletterOffered()` | T-14 |

`test.fail` is the right annotation because it **inverts** the moment the
fix lands: a passing test under `test.fail` is reported as a failure, so the
owner removes the entry with the fix and the exception cannot linger. The
same construction gates `/ueber-uns` in `e2e/newsletter.spec.ts`.

### 6. `data-cta="repeat"` stays, as a test hook

`DEC-0082 D3` lists the repeat rung with "Marker: none". `closing-cta.tsx`
renders `data-cta="repeat"` anyway, and keeps it: the value exists so the
button's label is inside the contrast sweep that walks `[data-cta]` on every
route (`e2e/cta-contrast.spec.ts`) — it computed ink on ink in a production
build once and nothing measured it. It is a **test hook, not a rung**: no
criterion counts `repeat`, no ladder rule reads it, and no page passes it
on purpose. Recorded here so the contradiction with D3's wording is a known
one rather than a drift.

### 7. The closing block's two new fields

`_page-frame.tsx`'s `ClosingBlock` grows what the `/ueber-uns` exception and
the home page's closing search need, without either page in this task:

- **repeat** gains `hash?: string` (the `#kontakt` anchor through the route
  facade) and `marker?: "primary" | "repeat"`, default `repeat`. `primary`
  is `/ueber-uns`'s alone: `DEC-0082` amendment C makes its closing CTA the
  page's one primary and empties its repeat rung, and T-14 passes it.
- **module** gains `surface?: "paper" | "ink"`, default `paper`: the closing
  search block on `/` is the one further ink section a page may end on
  (DEC-0117), and the section shell takes it from the block rather than from
  a page-level override.

The band heading was already the slot kicker (`fieldAt(contextBand.blocks,
0)`, DEC-0120); nothing to add there.

## Consequences

- Every route renders exactly one contact section, after `#closing-cta` and
  before `body > footer`, with no `data-cta="primary"` inside, four rows in
  D13 order by scheme, each row firing `make-contact` with its channel and
  route and row 1 adding `request-product-briefing` — walked by
  `e2e/contact-section.spec.ts` on all 24 routes (TS-WEB-0006-A17,
  TS-WEB-0016-A15/A17/A23, TS-WEB-0019-A9).
- No route renders a general contact form; the footer holds no contact entry
  and no newsletter (TS-WEB-0004-A9 as amended by D4, TS-WEB-0016-A21).
- `subscribe-to-newsletter` has no surface until `NEWSLETTER_SENDING_SYSTEM`
  is set; `CARRIED_BY_CHROME` in `src/lib/pages/manifests.ts` keeps listing
  it (the chrome *is* where it will stand) — verified, not edited.
- The `contact` kind is gone from the type; any future general contact form
  is a type error first and a test failure second.
- `state/open.md` rows 22 and 233 record the withholding. No new placeholder:
  this task writes no copy — the section's placeholder strings are T-01's
  (DEC-0113) and the footer's remaining words are the dictionary's.
- Three `test.fail` entries in `e2e/contact-section.spec.ts` and one in
  `e2e/newsletter.spec.ts` are owed to T-13, T-14 and T-15 (§5) and flip to
  failures when those tasks land, which is the intended hand-off.
- `site-footer.module.css` (T-08's file) keeps its now-unused `.contact`,
  `.summary` and `.contactBody` rules; removing them is a one-line follow-up
  for the file's owner.
