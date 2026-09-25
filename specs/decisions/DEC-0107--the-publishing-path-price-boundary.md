---
id: DEC-0107
title: A standard source publishes free; an individual integration into a system we do not already support is the paid add-on
status: accepted
date: 2026-09-25
decided_by: jan-henrik.hempel
---

## Context

The boundary existed in the owner's head and in a banner on the preview site,
and in no specification artefact at all. A grep of `specs/` finds no
`Ratsinformationssystem`, no `WordPress`, and exactly one `ICS` — a row in
`TS-WEB-0017`'s ownership table about feed subscription. `custom-data-integration`
is named six times, all of them on `/deine-region`, never on `/mitmachen`.

`TS-WEB-0022 D4` describes path 03 — *"the actor's own website as a source"* —
and says nothing about what a connection costs. `/mitmachen` renders no price at
all, deliberately (`D1`, `A12`: the offering is free, and *"free is not a
price"*). But a page that invites a connection and says nothing about its price
does not leave the reader without an answer; it leaves her to supply one, and
the two she can supply are both wrong. Either she assumes the connection is
included and finds out otherwise, or she assumes it is a project and does not
ask.

**The offering records were read before this was written, and they disagree in
one place.** `@schafe-vorm-fenster/offerings@0.3.3`:

- `community-calendar` is free on both sides and names three included
  publishing paths — *"maintaining dates in the actor's own Google Calendar,
  sending a flyer as a photo by WhatsApp or e-mail, and naming a website from
  which dates are imported"* (`#L98`–`#L115`). Path 03 is free, and its own
  record marks website-source import as **alpha**.
- `custom-data-integration` is `paid`, `price_status: on-request`,
  `promotion: on-request-only`, an add-on that requires a parent Portalize
  licence, one-off and quoted per case because *"the effort depends on how
  accessible the source database is"*.
- Its Commercial Model then says: *"Included: interpreting the source — **an
  interface, an ICS feed, or a web interface** — and connecting it so that the
  dates publish automatically"* (`#L88`).

That last line is the disagreement. **An ICS feed the platform already reads is
a standard source**, and putting it inside the paid scope makes the boundary
turn on the *format* rather than on whether the system is one we support. Two
further things the owner names as standard — a WordPress plugin and a common
council information system — appear nowhere: WordPress only in the withheld
`portalize-website-widget`, and a Ratsinformationssystem not at all.

## Decision

**The boundary is the system, not the format: a source the platform already
supports publishes free, and only an individual integration into a system it
does not already support is the `custom-data-integration` add-on.**

### 1. A business rule, because it has no system subject

`BUS-WEB-0017`: *"For a publishing path whose source the platform already
supports, publishing counts as free of charge."*

It is true whoever applies it — the website, a quotation, a support
conversation, nobody. `@leafcutter-strict/method-requirement-classification`
asks that first: *"Does it hold independently of any executor? — a business
rule"*, and *"a business rule and the requirement that applies it are two
artefacts"*, because *"merging them hides the rule from every other consumer of
it."* Burying this inside a page determination is exactly what hid it from the
quote and from the briefing.

**The rule states only the free side, and that is not a half-rule.** The paid
side needs no artefact here: `custom-data-integration` is a published offering
with its own record, its own price status and its own promotion rule. What no
register held was the *free* side and the boundary, and a two-clause statement
would be the compound the statement grammar forbids.

### 2. What "already supports" means, and who owns the list

A source is standard when the platform already reads it without work per
customer. The owner named three: **a WordPress plugin, a common council
information system, an ICS feed.** The list is the **offering's**, not this
specification's — `specs/README.md` rule 1 — so it is not copied into
`BUS-WEB-0017`, and `DEM-0065` asks the offering owner to carry it.

The narrowing of the add-on is the other half: `custom-data-integration` covers
an integration into a system the platform does not already support, quoted per
case because that is where the per-customer effort actually is. Its own
rationale already argues this — *"co-financing of work we have to do anyway"*,
with the asymmetry stated as a monetization rule: *"the connected data also
appears in the free community-calendar … the institution pays because it
benefits professionally, and everyone else benefits for free."* A format-based
boundary contradicts that; a system-based one is what the rationale describes.

**The ICS line is a deviation, and it is recorded as one.** Under DEC-0104 §1
the specification carries the truth and `BUS-WEB-0017` stands; `#L88` is named
in a `Deviation:` line on the artefact and `DEM-0065` is the demand against the
source. Not silently, and not by the specification quietly agreeing with a
sentence it thinks is wrong.

### 3. The requirement, the banner and the criterion

- **`FUN-WEB-0204`** — *"At the publishing paths of `/mitmachen`, the website
  SHALL state the price boundary of BUS-WEB-0017."* The rule is the business's;
  this is the page behaviour that publishes it.
- **`TS-WEB-0022 D11`** is the render form: the hint banner, one per page, at
  the end of the publishing-path slot. It is a **determination** and not a
  free choice, because the review's finding was about the boundary being
  invisible and a generator that may omit the banner reproduces it.
- **`TS-WEB-0022-A17`** is the criterion.

The banner states a boundary and **no figure**: `/mitmachen` renders no numeric
price (`D1`, `A12`) and the add-on has none to render —
`price_status: on-request`, and its `price.amount: 0` is the schema's
placeholder for unpriced, which `TS-WEB-0018-A2`'s `publishablePrice` already
returns false for. It is also not a CTA: one CTA per path is `D4`'s, the page's
one primary is the hero's, and the banner declares no conversion (DEC-0082 §1).

**It is a banner rather than a fourth path.** Path 03's own `status_badge`
already says the mechanism is alpha; the price boundary is a different fact
about all three paths, so it sits once at the end of the slot instead of being
repeated per path.

## Consequences

- `BUS-WEB-0017` and `FUN-WEB-0204` enter the specification; the highest number
  in each family is taken, nothing renumbered. Both are `S3` on this record and
  both carry `fit_criterion: UNKNOWN`, because `TS-WEB-0022-A17` is not yet
  referenced by a test (DEC-0095).
- `TS-WEB-0022` gains `D11` and `A17`, and `FUN-WEB-0204` joins its
  `implements:` list and its Coverage table.
- `DEM-0065` is open against `@schafe-vorm-fenster/offerings`: the standard-source
  list into `community-calendar`, and the ICS sentence out of
  `custom-data-integration`'s included scope.
- `/deine-region` is unaffected. `custom-data-integration` stays a mention-only
  add-on there (`TS-WEB-0026 D6`, `TS-WEB-0004 D7`) with no CTA and no price,
  and `TS-WEB-0018 D5`'s `on-request-only` row is unchanged.
- No price, no figure and no list of sources was written into a spec. Nothing
  moved off `DRAFT`.
