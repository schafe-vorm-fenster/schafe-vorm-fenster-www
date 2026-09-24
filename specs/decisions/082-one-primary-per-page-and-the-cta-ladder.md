---
id: DEC-082
title: One primary conversion per page stands — and the ladder every other CTA sits on
status: accepted
date: 2026-09-24
decided_by: jan-henrik.hempel
---

## Context

The 2026-09-22 review asks for something the rule as written forbids:
*every explanatory module ends in its own CTA.* The design guide answered
by giving two components a CTA "at primary treatment" — the explain
module (SRC-014 §"Explain module") and the contact section's first action
row (SRC-014 §"Contact section"). `TS-006 D3` and `TS-006-A2` allow
exactly one `data-cta="primary"` per rendered page. On `/mitmachen` that
arithmetic produces five primaries on one page (contradiction C2 of
`plan/reviews/2026-09-23/spec-impact.md`).

Two other things were open in the same area:

- `TS-006`'s standing open point **"equal weight versus visually
  unrivalled"**: SRC-003 gives `/dein-kalender` two equal conversions
  while SRC-001 §2 allows one unrivalled primary. `TS-006 D3` reconciled
  them by proposal, and a proposal cannot close a contradiction.
- The per-module CTA rule itself did not exist anywhere:
  `TS-022 D4` described three publishing paths with no CTA at all, and
  `TS-019 D3a` mentioned scene CTAs only in passing.

## Decision

**`TS-006 D3` stands, unchanged: exactly one element per page carries the
primary-CTA treatment and the `data-cta="primary"` marker.** What this
record adds is the ladder everything else sits on, so that "one primary"
stops being a rule that components have to break.

### 1. Three rungs, and what may occupy them

| Rung | Marker | How many | What it is |
| --- | --- | --- | --- |
| primary | `data-cta="primary"` | exactly one per page | the page's own conversion, above the fold, visually unrivalled (`WEB-F-003`) |
| repeat | none | exactly one per page | the closing CTA — same goal id, same target, same label as the primary, without the marker |
| secondary | `data-cta="secondary"` (or `equal-weight`, see §3) | any number | every other action on the page |

A module CTA, a scene CTA, a tier CTA, a context-band entry and every row
of the contact section are **secondary**. That is the whole rule: the
review gets its CTA per module, and the page keeps one unrivalled exit.

### 2. Where the design guide is corrected, not the rule

SRC-014 gives the explain module's CTA and the contact section's first
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
`data-cta="equal-weight"` where SRC-003 declares a second goal of equal
weight.

Equal weight in a page brief means the *offer* is equally available, not
that two elements share one visual rank. Two elements of identical weight
in one block is not a stronger page, it is a page that has not decided —
and the review accepts the two-CTA hero in exactly this shape ("order vs.
consult is acceptable"). This closes `TS-006`'s open point: `D3`'s
resolution stops being `[PROPOSED]` and becomes the rule.

### 4. Every explanatory module carries one CTA

One CTA per explanatory module, at secondary treatment, pointing at the
**deeper page's primary conversion** — not at a goal the page does not
declare and not at a second goal of its own.

| Module | CTA points at |
| --- | --- |
| scene block (`TS-006 D7`, home `TS-019 D3a`) | the page that owns the scene's job |
| publishing path (`TS-022 D4`) | the path's own next step — one row per path |
| price tier (`TS-024 D6`) | that tier's next step |

A CTA in a module is not a conversion declaration: `TS-006 D9` validates
the manifest against the conversion map, and an in-body link to another
page's goal is a link, not a declaration. That also settles
`TS-024`'s open point 5.

## Consequences

- `WEB-F-003` reaches `S3`; `TS-006 D3`'s equal-weight clause and
  `TS-006-A2` keep their wording and lose their `[PROPOSED]` tag.
- `TS-006 D3` gains the ladder as an explicit clause, so a generator and a
  reviewer read the same table the design guide defers to.
- `TS-022 D4` gains a CTA row per path and an acceptance criterion for
  it; `TS-019 D3a`'s "each scene keeps its own CTA at secondary
  treatment" becomes the general rule rather than a page's aside.
- `TS-024 D3` is unaffected in substance: Pulse occurs once, in the focus
  block, and the tier-2 order button stays the quieter of the two. Whether
  Pulse should move to tier 2 is a visual-weight question inside one page
  and stays `TS-024` open point 6, addressed to the design owner.
- The contact section adds no primary anywhere (`DEC-081` §2/§4), so a
  page's CTA count is unchanged by its presence.
