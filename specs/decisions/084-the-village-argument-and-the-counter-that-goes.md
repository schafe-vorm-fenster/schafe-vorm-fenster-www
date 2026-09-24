---
id: DEC-084
title: The village argument, re-derived — 280 inhabitants, no salesperson clause, and the counter module goes
status: accepted
date: 2026-09-24
decided_by: jan-henrik.hempel
---

## Context

`TS-027 D3` built the `/ueber-uns` origin block as a causal chain: a
village of ~400 inhabitants cannot afford a service that needs a
salesperson → therefore the community calendar is free → therefore the
licence costs 480 €/year instead of a project budget. `DEC-066` repeated
the same aside — "a product built in a village of four hundred people and
sold without a salesperson" — and SRC-017 CG-001 cites `DEC-066` as its
own authority, so the figure had propagated into the copy guide.

The 2026-09-22 review rejects both halves (theme K of
`plan/reviews/2026-09-23/spec-impact.md`):

- **The number is wrong.** Schlatkow has about **280** inhabitants.
- **The argument is not the owner's.** The chain reads as if the price
  followed from the founder's poverty. It does not, and it makes the
  product sound like a concession. What is true is a need, not a
  constraint.

The same block's neighbour has a second problem. `TS-027 D4` requires a
live "operating counters" module — years in operation plus a live count of
active places — because `TS-006 D1` requires at least one live module per
page. The preview shipped it as *"Seit 2018, 120 Orte"*: static traction
figures, already forbidden by `WEB-F-041` and `TS-008-A10`. Built live it
cannot be built at all: `/api/stats` carries no places-per-scope count
(`Q-037`), so the places half has no upstream field. The review deletes
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
tactical spec (`specs/README.md` rule 4). Recording it there is a demand
on the hub owner; until it lands, `TS-027 D3` cites this record.

### 3. The counter module goes; the live-module rule gains a named exemption

`TS-027 D4` is deleted. Nothing replaces it: the page carries no counter
section, no year figure rendered as a module, and no places figure.

`TS-006 D1`'s `liveModules` field therefore reads **"≥ 1, or empty on a
sender surface"**, with the three sender surfaces named:
`/ueber-uns`, `/ueber-uns/archiv`, `/rechtliches`.

The reason is not that the rule is inconvenient here. A live module exists
so that a visitor whose job is *what is on* sees that the data is current.
On a page whose job is provenance, the only live figures available are
traction figures — and traction figures are precisely what `WEB-F-041`
forbids. A rule that can only be satisfied by breaking another rule is not
satisfied, it is evaded. The exemption is the honest form of that.

The exemption lapses on its own terms: if a places-per-scope count arrives
upstream (`Q-037`), a counter becomes buildable and the question of
whether the trust surface wants one is reopened — as a question about
evidence, not about compliance.

## Consequences

- `TS-027 D3` states the argument and the ordering, not the wording
  (`DEC-083`); `TS-027-A4` keeps the single price assertion, since the
  price is read from the offering package and is not copy.
- `TS-027 D1` declares `liveModules: []`; `TS-027-A1` asserts the empty
  set for this route instead of "≥ 1 with an empty state"; `TS-027 D2`
  loses its counter block and `TS-027-A2` its position.
- `TS-027` open point 2 ("SRC-003 names no live module here") closes.
- `DEC-066`'s aside is corrected by amendment; its decision — one register,
  `du` everywhere — is untouched.
- **SRC-001's compliance check is the one thing this record cannot
  verify.** If it mandates a live element on *every* page rather than
  making it a property of the page brief, the concept document is amended
  first and this exemption follows it (rule 4). Recorded as an open point
  on `TS-006`, addressed to the IA owner.
- The figure and the argument both reach the copy guide through
  SRC-017 CG-001/CG-034, which cite `DEC-066`; that citation now resolves
  to a corrected record.
