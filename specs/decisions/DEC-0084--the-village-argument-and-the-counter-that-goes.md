---
id: DEC-0084
title: The village argument, re-derived — 280 inhabitants, no salesperson clause, and the counter module goes
status: accepted
date: 2026-09-24
decided_by: jan-henrik.hempel
---

## Context

`TS-WEB-0027 D3` built the `/ueber-uns` origin block as a causal chain: a
village of ~400 inhabitants cannot afford a service that needs a
salesperson → therefore the community calendar is free → therefore the
licence costs 480 €/year instead of a project budget. `DEC-0066` repeated
the same aside — "a product built in a village of four hundred people and
sold without a salesperson" — and SRC-0017 CG-001 cites `DEC-0066` as its
own authority, so the figure had propagated into the copy guide.

The 2026-09-22 review rejects both halves (theme K of
`plan/reviews/2026-09-23/spec-impact.md`):

- **The number is wrong.** Schlatkow has about **280** inhabitants.
- **The argument is not the owner's.** The chain reads as if the price
  followed from the founder's poverty. It does not, and it makes the
  product sound like a concession. What is true is a need, not a
  constraint.

The same block's neighbour has a second problem. `TS-WEB-0027 D4` requires a
live "operating counters" module — years in operation plus a live count of
active places — because `TS-WEB-0006 D1` requires at least one live module per
page. The preview shipped it as *"Seit 2018, 120 Orte"*: static traction
figures, already forbidden by `FUN-WEB-0041` and `TS-WEB-0008-A10`. Built live it
cannot be built at all: `/api/stats` carries no places-per-scope count
(`Q-0037`), so the places half has no upstream field. The review deletes
the section.

## Decision

### 1. The number

Schlatkow has **about 280 inhabitants**. Any statement of the village's
size on any surface uses that figure, and it is the kind of figure that
changes — so it is written where a correction reaches one place, in the
content artefact, never in a spec determination.

### 2. The argument, re-derived

The origin block states this, in this order:

1. A village needs a simple way for **everyone who volunteers** —
   the Feuerwehr, the Kirchgemeinde, the Verein, the neighbour organising
   a Dorffest — to get a date in front of the people it concerns, quickly.
2. Nobody there wants to buy an app or build a website nobody looks at.
   Those are the two answers the market offers, and both are answers to a
   different question.
3. That is why the community calendar is free and stays free, and why the
   licence for running your own is priced as a licence, from
   `@schafe-vorm-fenster/offerings`, rather than as a project.

**What is removed:** any clause deriving the price from what the founder
or the village could afford, and any clause in which a salesperson is the
reason for anything. The causal direction is the need, not the
constraint.

The canonical home of this argument is the hub's positioning record, not a
tactical spec (`specs/README.md` rule 1: a spec cites, it does not restate).
Recording it there is a demand on the hub owner; until it lands,
`TS-WEB-0027 D3` cites this record. *(This sentence cited rule 4 until
2026-09-25; the point it makes is about copying, which is rule 1 — see the
amendment.)*

### 3. The counter module goes; the live-module rule gains a named exemption

`TS-WEB-0027 D4` is deleted. Nothing replaces it: the page carries no counter
section, no year figure rendered as a module, and no places figure.

`TS-WEB-0006 D1`'s `liveModules` field therefore reads **"≥ 1, or empty on a
sender surface"**, with the three sender surfaces named:
`/ueber-uns`, `/ueber-uns/archiv`, `/rechtliches`.

The reason is not that the rule is inconvenient here. A live module exists
so that a visitor whose job is *what is on* sees that the data is current.
On a page whose job is provenance, the only live figures available are
traction figures — and traction figures are precisely what `FUN-WEB-0041`
forbids. A rule that can only be satisfied by breaking another rule is not
satisfied, it is evaded. The exemption is the honest form of that.

The exemption lapses on its own terms: if a places-per-scope count arrives
upstream (`Q-0037`), a counter becomes buildable and the question of
whether the trust surface wants one is reopened — as a question about
evidence, not about compliance.

## Consequences

- `TS-WEB-0027 D3` states the argument and the ordering, not the wording
  (`DEC-0083`); `TS-WEB-0027-A4` keeps the single price assertion, since the
  price is read from the offering package and is not copy.
- `TS-WEB-0027 D1` declares `liveModules: []`; `TS-WEB-0027-A1` asserts the empty
  set for this route instead of "≥ 1 with an empty state"; `TS-WEB-0027 D2`
  loses its counter block and `TS-WEB-0027-A2` its position.
- `TS-WEB-0027` open point 2 ("SRC-0003 names no live module here") closes.
- `DEC-0066`'s aside is corrected by amendment; its decision — one register,
  `du` everywhere — is untouched.
- **SRC-0001's compliance check is the one thing this record cannot
  verify.** If it mandates a live element on *every* page rather than making it
  a property of the page brief, the exemption **stands anyway** and the
  disagreement is recorded against the source — see the amendment. Recorded as
  an open point on `TS-WEB-0006`, addressed to the IA owner.
- The figure and the argument both reach the copy guide through
  SRC-0017 CG-001/CG-034, which cite `DEC-0066`; that citation now resolves
  to a corrected record.

## Amendment 2026-09-25 — the exemption does not wait for the source

This record said twice that if `SRC-0001`'s compliance check mandates a live
element on every page unconditionally, *"the concept document is amended first
and this exemption follows it (rule 4)"*. DEC-0104 §1 inverts that rule: the
specification carries the truth and a source is cited rather than obeyed.

So the sequencing goes away. **The exemption stands from the moment this record
took it**, `TS-WEB-0006 D1` permits `liveModules: []` on the three named sender
surfaces, and if the compliance check turns out to mandate one unconditionally,
that is a **deviation recorded against SRC-0001** plus a demand on the IA owner
— not a reason for the exemption to wait.

The reasoning §3 already gave is exactly why: *"A rule that can only be
satisfied by breaking another rule is not satisfied, it is evaded."* That is a
specification determination about two rules this specification holds, and it
never needed the source's permission. What the source can still do is turn out
to be right — in which case the demand is answered by the exemption being
withdrawn, at a decision point, with a record.

Nothing else in this record changes: the counter module stays deleted, the
three sender surfaces are the same three, and the exemption still lapses on its
own terms if a places-per-scope count arrives upstream (Q-0037).
