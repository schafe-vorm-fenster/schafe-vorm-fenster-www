---
id: DEC-0082
title: One primary conversion per page stands — and the ladder every other CTA sits on
status: accepted
date: 2026-09-24
decided_by: jan-henrik.hempel
---

## Context

The 2026-09-22 review asks for something the rule as written forbids:
*every explanatory module ends in its own CTA.* The design guide answered
by giving two components a CTA "at primary treatment" — the explain
module (SRC-0014 §"Explain module") and the contact section's first action
row (SRC-0014 §"Contact section"). `TS-WEB-0006 D3` and `TS-WEB-0006-A2` allow
exactly one `data-cta="primary"` per rendered page. On `/mitmachen` that
arithmetic produces five primaries on one page (contradiction C2 of
`plan/reviews/2026-09-23/spec-impact.md`).

Two other things were open in the same area:

- `TS-WEB-0006`'s standing open point **"equal weight versus visually
  unrivalled"**: SRC-0003 gives `/dein-kalender` two equal conversions
  while SRC-0001 §2 allows one unrivalled primary. `TS-WEB-0006 D3` reconciled
  them by proposal, and a proposal cannot close a contradiction.
- The per-module CTA rule itself did not exist anywhere:
  `TS-WEB-0022 D4` described three publishing paths with no CTA at all, and
  `TS-WEB-0019 D3a` mentioned scene CTAs only in passing.

## Decision

**`TS-WEB-0006 D3` stands, unchanged: exactly one element per page carries the
primary-CTA treatment and the `data-cta="primary"` marker.** What this
record adds is the ladder everything else sits on, so that "one primary"
stops being a rule that components have to break.

### 1. Three rungs, and what may occupy them

| Rung | Marker | How many | What it is |
| --- | --- | --- | --- |
| primary | `data-cta="primary"` | exactly one per page | the page's own conversion, above the fold, visually unrivalled (`FUN-WEB-0003`) |
| repeat | none | exactly one per page | the closing CTA — same goal id, same target, same label as the primary, without the marker |
| secondary | `data-cta="secondary"` (or `equal-weight`, see §3) | any number | every other action on the page |

A module CTA, a scene CTA, a tier CTA, a context-band entry and every row
of the contact section are **secondary**. That is the whole rule: the
review gets its CTA per module, and the page keeps one unrivalled exit.

### 2. Where the design guide is corrected, not the rule

SRC-0014 gives the explain module's CTA and the contact section's first
action row "the primary treatment". Read as page-level weight that is a
second primary, and it is wrong. **The guide is corrected**: those two
components carry a *secondary* CTA. A component may still be internally
emphasised — the contact section's first row has an `ink` ground because
it must be distinguishable from the rows beneath it, not because it
competes with the page's conversion — but no component outside the page's
own primary carries the primary treatment or the marker.

This is a demand on `concept/website-design-system.md` and on
`specs/contracts/design-system-contract.md`, addressed to their owner. The
specification does not restate component rules; it states the weight
ladder those rules must defer to, which is what was missing.

### 3. Two CTAs in a hero: order versus consult

**Closed: a hero may carry two actions — the purchase and the consult.**
The purchase is the primary and carries the marker; the consult sits
adjacent in the same block at secondary treatment, marked
`data-cta="equal-weight"` where SRC-0003 declares a second goal of equal
weight.

Equal weight in a page brief means the *offer* is equally available, not
that two elements share one visual rank. Two elements of identical weight
in one block is not a stronger page, it is a page that has not decided —
and the review accepts the two-CTA hero in exactly this shape ("order vs.
consult is acceptable"). This closes `TS-WEB-0006`'s open point: `D3`'s
resolution stops being `[PROPOSED]` and becomes the rule.

### 4. Every explanatory module carries one CTA

One CTA per explanatory module, at secondary treatment, pointing at the
**deeper page's primary conversion** — not at a goal the page does not
declare and not at a second goal of its own.

| Module | CTA points at |
| --- | --- |
| scene block (`TS-WEB-0006 D7`, home `TS-WEB-0019 D3a`) | the page that owns the scene's job |
| publishing path (`TS-WEB-0022 D4`) | the path's own next step — one row per path |
| price tier (`TS-WEB-0024 D6`) | that tier's next step |

A CTA in a module is not a conversion declaration: `TS-WEB-0006 D9` validates
the manifest against the conversion map, and an in-body link to another
page's goal is a link, not a declaration. That also settles
`TS-WEB-0024`'s open point 5.

## Consequences

- `FUN-WEB-0003` reaches `S3`; `TS-WEB-0006 D3`'s equal-weight clause and
  `TS-WEB-0006-A2` keep their wording and lose their `[PROPOSED]` tag.
- `TS-WEB-0006 D3` gains the ladder as an explicit clause, so a generator and a
  reviewer read the same table the design guide defers to.
- `TS-WEB-0022 D4` gains a CTA row per path and an acceptance criterion for
  it; `TS-WEB-0019 D3a`'s "each scene keeps its own CTA at secondary
  treatment" becomes the general rule rather than a page's aside.
- `TS-WEB-0024 D3` is unaffected in substance: Pulse occurs once, in the focus
  block, and the tier-2 order button stays the quieter of the two. Whether
  Pulse should move to tier 2 is a visual-weight question inside one page
  and stays `TS-WEB-0024` open point 6, addressed to the design owner.
- The contact section adds no primary anywhere (`DEC-0081` §2/§4), so a
  page's CTA count is unchanged by its presence.

## Amendment 2026-09-25 — the missing rung, the weight/rank split, and the sender surface

Three things the 2026-09-25 audit found, none of which changes the decision:
one primary conversion per page still stands.

### A. The ladder had a hole the requirement fell into

`§1`'s table has three rungs and `FUN-WEB-0135` read *"For every action that is
**not the primary conversion**, the website SHALL render it at secondary
treatment."* The repeat is not the primary conversion. So the statement, read
literally, put the closing CTA at secondary treatment — while the same table
gives it *"same goal id, same target, same label as the primary, without the
marker"*, which is the primary treatment minus the marker. Two artefacts of the
same record contradicted each other.

**The rung is: everything that is not the primary conversion *or its repeat* is
secondary.** `FUN-WEB-0135`'s statement takes the missing clause, and
`TS-WEB-0006 D3` says so where it defines "visually unrivalled".

### B. Rung and weight are two things, and only the marker is exclusive

`§2` already said it for one component — *"Filled is a weight, not a conversion
rank"* — and the audit showed the rule needs it generally. `TS-WEB-0024 D3`
gives the closing CTA and the tier-2 CTA the "Primary on light" **button
variant** while neither carries `data-cta="primary"`. Under `§1` as written that
looked like two illegal primaries; it is one repeat and one strong secondary.

So:

- **The rung is the marker.** `data-cta="primary"` is what "one per page" counts,
  and it is what `TS-WEB-0006-A2` asserts. Exactly one, always.
- **The weight is the design system's.** Which button variant an element takes
  is `SRC-0014`'s, and a secondary-rung element may carry a strong variant where
  the guide gives it one. `explain-module` and `contact-action-row` are the two
  the guide fixes at `secondary` **by definition** and may not take `primary`
  even as a weight (`specs/contracts/design-system-contract.md`); everything
  else is a weight judgement inside one page.
- **One thing stays visually exclusive, and it is not the marker: Pulse.**
  `himbeere-600` is the paid conversion's fill and occurs **exactly once per
  page** — `TS-WEB-0024 D3`'s focus block — which is also the one-`himbeere`
  rhythm rule. That is what "visually unrivalled" now means in practice, and it
  is checkable.

`TS-WEB-0024`'s **open point 6 closes with this.** It asked whether Pulse should
move to tier 2. It does not: Pulse stays in the focus block, and the tier-2
button takes the strong variant instead — which is what the open point was
actually reaching for, because tier 2 is a purchase goal in its own right and
is where the price is read.

### C. `/ueber-uns` is a named exception to the fold clause, and its repeat rung is empty

`§6` of DEC-0081 gave the page `request-product-briefing` and required *"exactly
one `data-cta="primary"` **above the fold**"* plus a repeat in the closing block.
The reasoning it gave was about *"a Landrat, a journalist or a funder who
**finishes reading** about the sender"* — and a sales ask in the first viewport
is addressed to a reader who has not finished. The criterion contradicted its own
argument.

**The CTA is in the closing block only** (audit A3, 2026-09-25). Two consequences
inside this record:

- **The fold clause of `TS-WEB-0006 D3` takes a named exception for
  `/ueber-uns`**, and for that route alone. It is the same shape as DEC-0084 §3's
  live-module exemption and it is granted for the same kind of reason: the rule's
  own purpose is not served here. A primary conversion above the fold exists so
  that a visitor who arrived to convert can. A provenance page's visitor arrived
  to judge.
- **The repeat rung is empty on that page.** `§1` says "exactly one per page",
  and there is nothing to repeat below a CTA that is already last. The rung
  reads **exactly one per page, or none where the primary is itself the closing
  CTA** — which is `/ueber-uns` today and no other route.

`/ueber-uns/archiv` is unaffected: it declares no conversion and takes
`TS-WEB-0006 D6`'s merged three-job block.

### What is unchanged

`§1`'s three rungs, `§3`'s two-CTA hero, `§4`'s one CTA per explanatory module
pointing at the deeper page's primary, and the correction `§2` demanded of the
design guide — which has since landed in `SRC-0014` and in the design-system
contract. `FUN-WEB-0003` reaching `S3` is unchanged, and nothing moved off
`DRAFT`.

