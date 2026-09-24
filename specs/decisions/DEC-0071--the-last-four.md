---
id: DEC-0071
title: The last four — reserved route, breadcrumbs everywhere, no geo in analytics, and one tone split in two
status: accepted
date: 2026-09-11
decided_by: jan-henrik.hempel
---

## Context

The four determinations the PROPOSED review left open. With these the
review closes completely: no tactical spec carries a `[PROPOSED]` tag on
a whole determination any more.

## Decisions

### 1. `/deine-termine` stays reserved, unbuilt

The name is held in the D1 inventory so no other plan claims it, and it
answers 404 until `portalize-website-widget` is sellable. It joins
`/mitmachen/vor-ort-werben` and `/nutzungsbedingungen`, which are already
reserved the same way, so this is a category the inventory has rather than
an exception made for one route. Nothing links to it and it is absent
from the sitemap.

### 2. All five second-level pages carry a visible breadcrumb trail

`/dein-ort/starten`, `/mitmachen/registrieren`, `/dein-kalender/bestellen`,
`/deine-region/angebot`, `/ueber-uns/archiv` — a visible trail and a
`BreadcrumbList` in JSON-LD on each. One rule, no exception to explain.

The risk in this is real and is handled structurally rather than by
review: four of the five are steps in a flow, and a path leading *up* and
out, placed above the content, competes with the one conversion those
pages exist for (FUN-WEB-0003). Three rules remove the competition:

- The trail uses link treatment, never CTA treatment. `data-cta` may not
  occur inside it, which TS-WEB-0006 A15 checks — so "visually unrivalled"
  stays true by construction, not by taste.
- It is the page header, not a block: it renders above block 1 and does
  not enter the TS-WEB-0006 D2 sequence.
- It is the **only** navigation permitted above block 1. A trail says
  where you are; anything offering a destination up there would be a
  second exit, and those belong in the context band.

One entity, one representation: the trail is described in JSON-LD, so it
is not also marked up in microdata.

### 3. Analytics events carry no geographic value, at any resolution

The earlier proposal allowed `county` as the finest attachable value.
**Withdrawn.** An event may carry the stage label and the `trait` id;
it may carry no community, municipality, county, state, country,
coordinate, IP, or any value derived from one.

Not because a county identifies anybody — because a resolution ceiling
has to be re-defended every time someone asks for one step finer, and
"none" is the only line that holds without a fresh argument each time.
That a relevance engine knows where you are while an analytics event does
not is a coherent position; a site that keeps a record of where its
visitors were is a different product from the one being built.

**The accepted cost, stated rather than glossed:** SRC-0002's hypothesis
H2 — does a distant proof element at position 3 raise the municipal CTA
rate? — becomes unanswerable from analytics, and so does "does geo
proximity in the relevance model change behaviour at all". Those move to
deliberate experiments with their own consent, or they stay open.

### 4. One tone, split across two situations

SRC-0002 addresses the empty place directly: *"nothing has been entered in
<place> yet — you could be the first."* TS-WEB-0021 D9 forbids addressing the
reader that way. Both stand, because they answer different situations:

| | `/dein-ort` state B | `/dein-ort/starten` |
| --- | --- | --- |
| Situation | the place **is** covered, nothing entered right now | the place is **not** covered at all |
| What is missing | dates | the place itself, in our system |
| Address | direct — SRC-0002's wording, verbatim | never direct: name who usually starts it, let her recognise someone |

Where a calendar is waiting, "you could be the first" is a small obvious
step and SRC-0002 calls it the strongest publisher-acquisition moment the
site has. Where there is no calendar at all, the same sentence hands a
stranger our distribution problem — someone who only wanted to know what
was on this weekend.

This is not a register change and does not touch DEC-0066: both are `du`,
both are warm. What differs is whether the sentence asks the reader to do
something.

## Consequences

- TS-WEB-0004 D7 and D1, TS-WEB-0006 D2 (+A15), TS-WEB-0010 D11, TS-WEB-0011 D4 (+A14),
  TS-WEB-0020, TS-WEB-0021 D9 updated. Q-0065 closes.
- Every determination in every tactical spec now carries a resolved
  provenance tag. Seventeen keep `[PROPOSED]` on a **sub-clause** — a
  number inside a fixed rule, or a row awaiting an external answer — and
  each stays tracked by the question it waits on, not by this review.

## Amendment 2026-09-24 — point 4 is withdrawn

This record is not rewritten; **point 4 no longer holds.**

"One tone, split across two situations" gave `/dein-ort` state B a direct
address and forbade it on `/dein-ort/starten` — *never direct: name who
usually starts it and let her recognise someone.* The 2026-09-22 review
decides the opposite, as a rule for the whole site: **the site addresses
the reader directly, everywhere** (contradiction C8 of
`plan/reviews/2026-09-23/spec-impact.md`; SRC-0017 CG-008/CG-012). The copy
guide needs no exception, and `TS-WEB-0021 D9`'s "never direct" is dropped with
it.

**What the point was protecting is kept, and it was never about address.**
The two situations do differ, and the difference is what the page *asks
for*: on `/dein-ort` state B a calendar exists and is empty, so asking the
reader to be the first to publish is a small, obvious step. On
`/dein-ort/starten` the place is not in the system at all — the gap is
ours, not hers, and a page that hands a stranger our distribution problem
spends the goodwill of someone who only wanted to know what was on. So
`/dein-ort/starten` still names who usually starts a calendar, still makes
no demand of the resident and still carries no blame and no scarcity — in
direct address, like every other page.

Points 1, 2 and 3 — the reserved route, breadcrumbs on the five
second-level pages, and no geographic value in analytics — are untouched.
