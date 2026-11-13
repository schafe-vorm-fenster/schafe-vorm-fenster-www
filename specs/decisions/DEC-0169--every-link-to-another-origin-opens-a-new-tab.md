---
id: DEC-0169
title: Every link to another origin opens a new tab with rel="noopener noreferrer" and says so to a screen reader; tel and mailto stay; one component decides it, a static guard and a browser sweep hold it
status: accepted
date: 2026-10-27
decided_by: jan-henrik.hempel
---

## Context

The owner's review of 2026-10-27 (`plan/reviews/2026-10-27/`, issue #82):

> Externe Links, bspw. zum Dorfkalender, müssen immer in target=_blank geöffnet
> werden! Aktuell verschwindet sonst die Webseite.

Until today the site had no rule for it, and the specification said the
opposite of the owner. `TS-WEB-0016` D7 "Link attributes" read *"Opens in the
same tab by default; if a new tab is used it carries `rel="noopener"` and the
link text says so"*, and D9 "Outbound link" carried the same conditional.
`DEC-0113` recorded the contact section's booking row as a same-tab
navigation, and `DEC-0117` built the archive's outbound links with `newTab`
off by default. In the code the choice was a `newTab` prop per call site:
five call sites passed it (the archive row, the proof card, the two quote
cards on `/dein-kalender` and `/ueber-uns`, the WhatsApp path), and the links
the owner named did not — the village-calendar handovers on `/`, `/dein-ort`
and in the nearby module, the place photograph's Commons credit, the app
handover of the registration flow, the booking and WhatsApp rows of the
contact section, and the legal texts' links, which opened **every** link in a
new tab with a bare `rel="noopener"`, including the ones into this site.

## Decisions

### 1. A link to another origin opens a new tab, always

Every `<a>` whose target is an `http:`/`https:` URL (or protocol-relative) on
an origin other than the site's own (`SITE_ORIGIN`) carries
`target="_blank"` and `rel="noopener noreferrer"`. There is no per-call-site
choice: the `newTab` props of `outbound-link`, `button`, `quote-card` and the
explain module's CTA are removed, and the decision is read off the href by
`linkTarget()` (`src/lib/routes/link-target.ts`).

- **`noopener`** — the opened page gets no `window.opener`.
- **`noreferrer`** — the site sends no referrer to the party it hands a
  visitor to (privacy by default, `TS-WEB-0013`). Nothing on the receiving
  side reads it: campaign parameters travel in the URL (`TS-WEB-0008` D9,
  `FUN-WEB-0048`), never in `Referer`. No spec names a `rel` value for
  tracking, so none is lost.
- **`wa.me`** is an `https:` URL like any other and opens a tab: on a phone
  the tab hands over to the WhatsApp app, on a desktop it is WhatsApp Web,
  and either way the website stays where it was.
- **`tel:` and `mailto:`** carry no target. They do not navigate the
  document; a `_blank` would leave an empty tab behind.
- A link into this site — a path, a hash, a query, or an absolute URL on
  `SITE_ORIGIN` — stays in the tab, the legal texts' included.

### 2. The new tab is said, not only shown

The visible sign is the `external-link` glyph the outbound controls already
draw (SRC-0014 §Links): 18 px after an inline link and a secondary pill,
24 px in a button, where it replaces the onward arrow because the button no
longer leads onward on this site. The spoken sign is a visually hidden
"öffnet neuen Tab" / "opens new tab" (the dictionary's existing
`outboundLink.newTab`) placed **after** the link and joined to it through
`aria-describedby` — in the description, never in the accessible name, so
`TS-WEB-0016-A23` (no tab talk in the control's name) and WCAG 2.5.3 (label in
name) hold as before.

**The new tab is never visible text, anywhere** (owner's follow-up the same
day, issue #100: "öffnet neuen Tab" stood beside "Original ansehen" on the
press page and beside the quote link on `/ueber-uns` — "muss nirgends stehen,
es gibt ja das Icon"). The visible "öffnet neuen Tab" under the archive rows,
the proof cards and the quote cards goes, and so does its half of the
assembled D16 line: "öffnet neuen Tab · Daten gehen an …" becomes "Daten gehen
an …". A visible marking remains only where `TS-WEB-0016` D16 asks for one,
because a third party receives the visitor's data, and it names that
recipient only; the link's `aria-describedby` then lists the marking and the
hidden note (the booking row: "Öffnet den Buchungskalender bei Google." plus
"öffnet neuen Tab").

### 3. One component applies it

`src/components/anchor/anchor.tsx` is the one raw `<a>` whose target may
leave the site. `outbound-link`, `button`'s href form, `contact-action-row`,
`lead-fallback`'s consult link, the `/start` notice link and the legal texts
render through it. A raw `<a>` elsewhere may only carry a target that
provably stays on the site — `href()`/`linkHref()` from the route facade, or a
literal starting with `/`, `#`, `?`, `mailto:` or `tel:`.

### 4. Two guards

- **Static, in `pnpm check`** — `scripts/external-links.test.ts`
  (`TS-WEB-0016-A25`, run by `check:static-tests`): no raw `<a>` with any
  other target, no `target` or `rel` written on a link outside `anchor.tsx`,
  no `next/link` with an `http(s):` literal.
- **Browser, on every route** — `e2e/external-links.spec.ts`
  (`TS-WEB-0016-A24`): on all 24 route × locale pairs and on `/dein-ort` with a
  chosen place, after the live modules landed, every `a[href]` to another
  origin has `target="_blank"`, `rel` with `noopener` and `noreferrer`, and an
  `aria-describedby` that resolves to text naming the new tab; `tel:` and
  `mailto:` links carry no target; and no text naming the new tab is visible
  (issue #100).

### 5. Conversion tracking is unaffected

`conversion-tracker` listens to the click in this document and never
prevents or delays the navigation (`TS-WEB-0012` D9). With a new tab the
document stays alive after the click, so the event is, if anything, more
certain to be sent. The existing assertions — `e2e/pages/home.spec.ts`
(save-calendar), `e2e/contact-section.spec.ts` (make-contact,
request-product-briefing) — run unchanged.

## Supersedes

- `TS-WEB-0016` D7 "Link attributes" and D9 "Outbound link" — both rows now
  point at D18.
- `DEC-0113`'s "Row 1 navigates in the same tab" and `DEC-0117`'s "`newTab`
  off by default" for the archive's outbound links, in that part only.
- `DEC-0133`'s visible "öffnet neuen Tab" in the assembled marking: the
  marking keeps the recipient ("Daten gehen an …") and drops the tab, which
  only the hidden note says (issue #100).

## Consequences

- Specification: `TS-WEB-0016` D18 with `A24` (e2e) and `A25` (static);
  SRC-0014 §Links (new) and §Accessibility; the design-system contract's
  `anchor` row; the copy guide's "Do Not" (the new tab never in a label);
  `TS-WEB-0028-A14` reads "always" instead of "where it opens in a new tab".
- Code: `link-target.ts`, `anchor`, the four components above; `newTab` gone
  from every call site.
- What it does not change: the calendar URL itself (issue #81 builds it), the
  place photograph's credit layer (issue #78 redesigns it — whatever link it
  renders goes through `anchor` and is swept by A24), and `TS-WEB-0016` D16's
  rule for *where* a visible marking stands.
