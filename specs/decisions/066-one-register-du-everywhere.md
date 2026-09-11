---
id: DEC-066
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

It collides with principle 2 of SRC-001. The site is built so that all
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
  TS-007 D12 gains a check beside glossary conformance.
- The `Sie` copy of wireframe screens 05, 06 and 08 is rewritten to `du`.
  The wireframes are the reference for the prototype, so leaving them
  would teach the opposite of this record.
- The hub's communication principles gain the rule, so it binds every
  surface that reads them rather than the website alone.
- Formal correspondence outside the website — offers, letters to a
  Verwaltung, funding applications — is untouched. This record governs
  `www.schafe-vorm-fenster.de`, and the foundation already provides for
  switching to formal salutations where the context requires it.
