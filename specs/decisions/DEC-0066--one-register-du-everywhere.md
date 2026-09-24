---
id: DEC-0066
title: One register for the whole site — informal du, including the Verwaltung
status: accepted
date: 2026-09-11
decided_by: jan-henrik.hempel
---

## Context

The wireframes address readers and Vereine with `du` and the Verwaltung
with `Sie` — "Ihr Veranstaltungskalender. Ihre Website. Ihr Name." on
screens 05, 06 and 08. That looked like ordinary German business practice
rather than a decision, so nothing recorded it.

It collides with principle 2 of SRC-0001. The site is built so that all
four jobs stay one click apart, because the same person reads the
calendar, chairs a Verein and sits on the municipal council. A register
that changes between those pages means that person is addressed by two
different senders within one click. No amount of good copy repairs that
seam, and the content pipeline would have to carry a register axis for the
rest of the project to keep reproducing it.

The hub's `tone-of-voice` foundation already states informal `Du` as the
default. What was missing was a rule that pages may not reconsider it.

## Decision

**One tone profile for the whole website, and its register is `du`
everywhere** — for every audience, every job, every page, in every
language that has the distinction.

What may vary is emphasis: more matter-of-fact where someone is deciding
about a budget, warmer where someone is looking for what is on next
weekend. Those are tendencies inside one voice.

What may not vary is the register. Where the choice is between switching
and staying informal, the site stays informal.

This is a deliberate stance, not an oversight: a Landrat, an Amtsleiterin
and a Stiftung are addressed with `du` on this website. It fits a product
built in a village of four hundred people and sold without a
salesperson — and it is the same address the printed material already
uses ("Dein Dorf. Deine Termine.").

## Consequences

- `tone-profile` is a single interface value for every generation run
  (`concept/website-content-production.concept.md` B.6). There is no
  register axis in the content schema, and none is added later.
- A register switch is a validation failure, not a stylistic finding.
  TS-WEB-0007 D12 gains a check beside glossary conformance.
- The `Sie` copy of wireframe screens 05, 06 and 08 is rewritten to `du`.
  The wireframes are the reference for the prototype, so leaving them
  would teach the opposite of this record.
- The hub's communication principles gain the rule, so it binds every
  surface that reads them rather than the website alone.
- Formal correspondence outside the website — offers, letters to a
  Verwaltung, funding applications — is untouched. This record governs
  `www.schafe-vorm-fenster.de`, and the foundation already provides for
  switching to formal salutations where the context requires it.

## Amendment 2026-09-24 — DEC-0084 and the `/rechtliches` exemption

This record is not rewritten. The decision — one register, `du`, for every
audience, job and page — stands. Two things attached to it are corrected.

### The aside is wrong on both counts (DEC-0084)

The sentence "a product built in a village of four hundred people and sold
without a salesperson" carried a wrong figure and an argument the owner
rejects. Schlatkow has **about 280 inhabitants**; and nothing about this
product follows from the absence of a salesperson. What is true is the
need: a village needs a simple way for everyone who volunteers to get a
date in front of the people it concerns, and neither buying an app nor
building a website nobody looks at answers that. The full re-derivation is
DEC-0084 §2.

This matters beyond a number: SRC-0017 CG-001 cites this record as its own
authority, so the aside had propagated into the copy guide.

### `/rechtliches` is exempt from the register rule

The five legal documents on `/rechtliches` are imported verbatim
(DEC-0012, DEC-0027) and are written in the formal register, as such
documents are. SRC-0017 CG-003 makes a `Sie` form a build failure and
carries no carve-out (contradiction C9 of
`plan/reviews/2026-09-23/spec-impact.md`), so the page could not ship.

**The whole page is exempt** — not only the imported document bodies. Half
an exemption would mean a page whose headings and navigation address the
reader as `du` while the text beneath says `Sie`, which is the seam this
record exists to prevent, reproduced inside one page instead of between
two. `/rechtliches` is a document surface: it is read, cited and printed,
not spoken to.

The exemption is one route, named in the lint (`TS-WEB-0007 D12` register row)
and in `TS-WEB-0029`. Every other page keeps `du`, and a register switch
anywhere else stays a validation failure.
