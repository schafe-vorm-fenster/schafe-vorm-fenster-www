---
artefact: tactical-spec
id: TS-WEB-0006
kind: rule
status: DRAFT
version: 0.1.0
implements: [FUN-WEB-0001, FUN-WEB-0003, FUN-WEB-0004, FUN-WEB-0005, FUN-WEB-0006, FUN-WEB-0007, FUN-WEB-0008, FUN-WEB-0009, FUN-WEB-0019, FUN-WEB-0020, FUN-WEB-0022]
sources: [SRC-0001, SRC-0003, SRC-0017, SRC-0018]
decisions: [DEC-0036, DEC-0039, DEC-0080, DEC-0081, DEC-0082, DEC-0083, DEC-0084]
---

# TS-WEB-0006 — Page Composition Rules

## Purpose

The rules that hold on **every** page: what a page must declare, in which
order its blocks stand, where its single conversion sits, how the other
three jobs stay one click away, and which promises may appear at all.
Per-page specs are thin and reference this one; anything true of exactly
one page belongs there, not here.

Routes, navigation labels and the link facade are TS-WEB-0004. Selection and
ordering *inside* proof and live blocks is TS-WEB-0005. Focus, order and the
eight-point brief check are SRC-0001; the per-page briefs are SRC-0003.
Neither is restated here — this spec turns them into checkable structure.

## Determinations

### D1 — Every page declares its brief in a machine-readable manifest [FIXED: SRC-0001 §1 + "Compliance Check for a Page Brief"; representation PROPOSED]

Each route carries one `page.meta.ts` next to its `page.tsx` (TS-WEB-0004 D2).
It is the page brief in typed form — the layout reads it, the checks read
it, and no second place states the same fact.

| Field | Type | Rule |
| --- | --- | --- |
| `focusJob` | one of the four job IDs | exactly one; no page has zero or two |
| `primaryConversion` | conversion goal ID or `null` | resolves in `go-to-market-os` conversion goals; `null` only where SRC-0003 says the focus job has none of its own |
| `equalWeightConversion` | conversion goal ID, optional | see D3 |
| `audiences` | ordered audience IDs | priority order per SRC-0003, first one is the primary |
| `liveModules` | ≥ 1 module ID, or `[]` on a sender surface | each declared module carries its empty state (TS-WEB-0005). The empty set is permitted on `/ueber-uns`, `/ueber-uns/archiv` and `/rechtliches` and nowhere else: a live module makes currency visible where the job is about current dates, and on a provenance page the only live figures available are traction figures, which FUN-WEB-0041 forbids (DEC-0084 §3) |
| `proofSlots` | slot IDs | a slot with no cleared proof stays empty; the claim is weakened, never invented (SRC-0001 §4) |

The four job IDs are a closed set derived from SRC-0001 §1 and live in one
registry module together with their targets (targets per TS-WEB-0004 D4). No
page hard-codes a job label, target or ordering.

The manifest makes points 1, 2, 3, 5 and 6 of the SRC-0001 compliance
check machine-checkable; points 4, 7 and 8 are checked by D5–D8 and A14.

### D2 — One block order, every page [FIXED: SRC-0001 §2 and §7]

```text
1  focus block      — the focus job's argument + the primary conversion (D3/D4)
2  argument blocks  — scenes, live modules, proof, page-specific (SRC-0003)
3  context band     — the other three jobs (D5)
4  closing CTA      — the focus job's conversion again (D6)
```

Blocks 3 and 4 are rendered by the shared layout from `page.meta.ts`, not
hand-placed per page — that is what makes "every page" enforceable rather
than aspirational. After block 4 stand exactly two things: the contact
section, then the global footer (TS-WEB-0004 D4).

**The contact section is not a block** [FIXED: DEC-0081]. One contact
surface exists for the whole site — video appointment, WhatsApp, phone,
mail, portrait — and the layout renders it on **every page**, between
block 4 and the footer. It sits outside the D2 sequence for the same
reason the breadcrumb trail does: it is a standing surface, not an
argument, so `FUN-WEB-0006` ("the last block of every page is the CTA of its
focus job") stays literally true with it below. Two rules keep it from
competing with block 4:

- No `data-cta="primary"` occurs inside it. Its first action row is a
  secondary CTA (D3), whatever emphasis the component gives it internally.
- It is the only place on the site that offers a channel to a person. A
  page that wants to send someone to the booking points **at the section**
  on its own page; only the section's first row navigates off-site
  (DEC-0081 §3).

There is no general contact form anywhere, in the footer or elsewhere.

**The breadcrumb trail is not a block** [FIXED: DEC-0071]. The five
second-level pages carry a visible trail; it belongs to the page header,
renders *above* block 1, and does not enter the sequence above. Three
rules keep it from competing with the focus block:

- It uses link treatment, never CTA treatment. `data-cta` never appears
  inside it, so the "one primary conversion, visually unrivalled" rule
  (D3, FUN-WEB-0003) is untouched by construction rather than by judgement.
- It is one `<nav>` with an accessible name, server-rendered as plain
  links, and its last item — the current page — is not a link.
- It is the only navigation permitted above block 1. A trail is a
  position indicator; anything that offers a *destination* above the
  focus block is a second exit, and those live in the context band.

This holds for the sender surfaces too: `/ueber-uns`, `/ueber-uns/archiv`
and the one legal page `/rechtliches` (DEC-0039) each end in blocks 3 and
4. Because legal content is one page, the sequence exists once there
instead of three times (SRC-0001 §7 names "pages adjacent to the imprint"
explicitly).

### D3 — One primary conversion, above the fold, visually unrivalled [FIXED: SRC-0001 §2, DEC-0082; fold measurement PROPOSED]

- Exactly one element per page carries the primary-CTA treatment. It is
  marked `data-cta="primary"` so the rule is testable, not a matter of
  taste.
- **Above the fold** = fully visible without scrolling at the two
  *extreme* reference viewports, 360 × 640 and 1280 × 800 [PROPOSED — no
  source defines the fold; TS-WEB-0002 fixes 320 px only as the
  no-horizontal-scroll floor].

  There is a third reference viewport, **428 × 926** — the large phone
  that `breakpoint.sm` exists for (TS-WEB-0017 D2b). It is deliberately *not*
  a fold viewport: it is strictly more generous than 360 × 640 in both
  axes, so a CTA that clears the fold on the small phone clears it here
  too, and testing it would add a check that cannot fail on its own. It
  is a reference viewport for what the small range *does* change —
  layout identity and horizontal scroll (TS-WEB-0017 A8, A9) — because that
  is where the token scale is dense and where an unnoticed second layout
  would otherwise hide.
- **Visually unrivalled** = no other element on the page uses the primary
  treatment; secondary actions use the secondary treatment and sit below
  or beside, never above, the primary one.
- **The ladder, in full** [FIXED: DEC-0082]. Three rungs, and everything on
  a page sits on one of them:

  | Rung | Marker | How many | What occupies it |
  | --- | --- | --- | --- |
  | primary | `data-cta="primary"` | exactly one per page | the page's own conversion |
  | repeat | none | exactly one per page | the closing CTA of D6 — same goal id, target and label, without the marker |
  | secondary | `data-cta="secondary"` / `="equal-weight"` | any number | every other action: module and scene CTAs, tier CTAs, context-band entries, every row of the contact section |

  **Every explanatory module carries exactly one CTA, at secondary
  treatment, pointing at the deeper page's primary conversion.** That is
  the review's per-module rule and the one-primary rule in one sentence;
  an in-body link to another page's goal is a link, not a declaration
  (D9). Where the design system gives such a component "the primary
  treatment" — the explain module's CTA, the contact section's first
  action row — **the guide is corrected, not this rule** (DEC-0082 §2);
  component-internal emphasis is permitted, a second page-level primary is
  not.
- **Equal-weight second goal** (SRC-0003 gives `/dein-kalender`
  `request-product-briefing` beside `buy-calendar-licence`): it is
  declared as `equalWeightConversion` and rendered in the *same* block as
  an adjacent secondary-treatment action. Equal weight in the brief means
  equal prominence of the offer, not a second primary style — otherwise
  "visually unrivalled" would have no meaning [FIXED: DEC-0082 §3]. The
  shape this takes on `/dein-kalender` is the two-CTA hero the review
  accepts: the purchase carries the marker, the consult stands beside it
  and points at the contact section (DEC-0081 §3).
- On a page whose `primaryConversion` is `null`, block 1 carries the
  focus job's argument and no CTA treatment at all; the conversion
  obligation is discharged by block 4 (D6).

### D4 — "Know what is on" is fulfilled in place, never linked [FIXED: SRC-0001 §1, SRC-0003 Home]

Where the focus job is *know what is on*, the primary conversion is a
**module, not a link**: the place search, or — location known — the
visitor's place with its live dates. The first screen fulfils the job;
it does not offer to fulfil it elsewhere.

| Situation | First screen carries |
| --- | --- |
| no location known | place search, dominant element |
| location known, place covered, dates exist | place name + live dates + open-the-calendar action |
| place covered, no dates | the empty-state rule of TS-WEB-0005 / SRC-0003 `/dein-ort` — the only runtime focus-job change on the website |
| place not covered | continue to `/dein-ort/starten`, place as query parameter (TS-WEB-0004 D1a) |

Consequence for the header: the four job labels and the persistent
"Kalender" button (TS-WEB-0004 D4) stay as they are — they are the *switch*
between jobs, not the fulfilment of this one.

### D5 — The context band [FIXED: SRC-0001 §2; component contract PROPOSED]

One component, rendered by the layout on every page, filled from the job
registry as *all four jobs minus this page's focus job* — never a
hand-written list, so it can never drift out of sync.

| Property | Rule |
| --- | --- |
| Contents | exactly the three non-focus jobs, one entry each |
| Phrasing | an offer in the visitor's own voice, not a menu: each entry names an audience and a content together, so a reader recognises whether it is meant for her. Wording is copy and is written in the content phase under SRC-0017 CG-030 — this spec states no example sentence and no grammatical form (DEC-0083) |
| Position | after the last argument block, before the closing CTA (D2) |
| Links | through the route facade (TS-WEB-0004 D3a/D5); targets from the job registry |
| Treatment | secondary; never the primary treatment (D3) |

Together with the header (TS-WEB-0004 D4) this makes every job reachable from
every page in at most one click; the band is the in-content guarantee,
the header the persistent one. Both are required — the header alone
would leave the promise dependent on a visitor noticing chrome.

### D6 — Every page ends in its conversion [FIXED: SRC-0001 §7, SRC-0003]

The last block is the CTA of the focus job and is **identical** to the
primary conversion: same conversion goal ID, same target, same label.
Two shapes, chosen by the manifest:

| `primaryConversion` | Closing block |
| --- | --- |
| a goal ID | that goal's CTA, repeated |
| `null` (`/ueber-uns/archiv`) | one block offering the three jobs that carry conversions |

`/ueber-uns` no longer takes the second row: it declares
`request-product-briefing` and repeats it like any other page
(DEC-0081 §6). The `null` shape now has exactly one holder.

Where the closing block is the three-job offer, it **merges** with the
context band: the band's content and the closing block are the same
three jobs, so they render once, as the last block, rather than twice in
sequence [PROPOSED].

### D7 — Scenes, not labels [FIXED: SRC-0001 §1a as applied by SRC-0017; DEC-0080]

Every job introduction on every page is a scene block with a fixed shape:

1. an **opener that is a statement**, and one that says what works
   (SRC-0017 CG-005). A question is permitted only where it is addressed
   to the reader and the block answers it in the next sentence
   (CG-006) — SRC-0001 §1a's "aha question" is the *stance* the opener
   takes, not a punctuation mark it has to carry, and the review of
   2026-09-22 rejected the rhetorical form the earlier wording of this
   determination required;
2. exactly **one** mechanism, declared as the block's `mechanism` prop
   (e.g. WhatsApp, calendar connection, embed) — a block with two
   mechanisms is two blocks;
3. one concrete instance, live or proof-backed, as close to the visitor
   as the data allows (TS-WEB-0005).

**A block is self-contained** (CG-004). It carries no reference to an
earlier block: a reader who arrived by scrolling, by a deep link or from
a search result reads it whole. Dramaturgy still builds across blocks;
reference does not.

Feature lists are not a permitted block type anywhere on the site.
Generic claims are not copy, and **the term list now exists**: it is the
avoid list of SRC-0017 §9 together with the avoid column of
`specs/glossary/glossary.md`. SRC-0018 binds it as a `check:content` row
(CG-040), so a hit fails the build rather than a review.

The remaining wording rules of SRC-0017 — register and address, economy,
heading vocabulary, the per-block length budgets — are not restated here.
They reach the page through the schema and the lint (SRC-0018), and this
determination owns only what is true of a block's *structure*.

### D8 — No self-classification [FIXED: SRC-0001 §6]

- No role switcher, no audience tabs, no segmented "who are you?"
  control, no interstitial, no modal that asks the visitor to classify
  herself — on any page, at any stage.
- The only two things a visitor ever tells the site explicitly are **a
  place** (search) and **a job** (a link click). Both are actions towards
  her goal, not classification work.
- Stage 0 — nothing known — renders every page complete and convincing on
  its own.
- Higher stages (SRC-0001 §6 table) change **only selection and order** of
  proof and live modules. Page structure per D2 and the declared
  `focusJob` are invariant across stages, with the single documented
  exception of the empty place calendar (D4, TS-WEB-0005).
- Consequence for caching and rendering: because structure never varies
  by visitor, the static shell is stage-independent and only the streamed
  modules segment (TS-WEB-0004 D6, TS-WEB-0005).

### D9 — The conversion map is complete and is a check, not a diagram [FIXED: SRC-0003 "Conversion Map", FUN-WEB-0019]

The map in SRC-0003 is the contract. The `page.meta.ts` set is validated
against it in both directions:

- every goal listed there appears as `primaryConversion` or
  `equalWeightConversion` on exactly the pages named there;
- no page declares a goal the map does not assign to it;
- `register-as-publisher` additionally appears via the context band on
  every page — carried by D5, not by a per-page declaration.

Known gap: `order-promotion-material` is carried by no page (Q-0005). The
check lists it as an accepted exception with its question ID, so it stays
visible instead of quietly passing.

### D10 — Pricing display [FIXED: SRC-0001 Boundaries, SRC-0003 pricing rules, FUN-WEB-0020; sourcing PROPOSED]

| Offering promotion | On the website |
| --- | --- |
| `promoted` with a public price | the price is shown — today exactly one: `portalize-calendar`, 480 €/year |
| `promoted` without a public price | "auf Anfrage" — no figure, no range, no "ab", no order of magnitude |
| `on-request` | mentioned, never priced |
| `withheld` | not offered; at most the single sentence CON-WEB-0015 permits |

The price string is read from the offering package rather than typed into
copy, so one place changes it [PROPOSED]. A price appearing in any other
page's copy is a defect, not a variant. The free community calendar tier
is not a price and not subject to this rule; its permanence promise is
content, backed by the 2022 public commitment (SRC-0003).

### D11 — Promises are only displayed where a process backs them [FIXED: SRC-0003 `/deine-region`, FUN-WEB-0022; enforcement PROPOSED]

The general rule: a page states a response time, an availability or a
permanence promise only where an operational commitment exists to keep
it. The website is not the place where such a promise is invented.

The one instance in phase 1: the **two-working-day response promise** on
the `/deine-region` quote request. It is stated at the form before
submit and repeated in the confirmation the visitor sees after submit,
both from a single constant, so the two can never disagree. The promise
is bound to the lead handling behind the envoy widget (FUN-WEB-0090) and is
flagged to envoy/ops as part of Q-0022; if that process cannot keep it,
the promise is removed rather than softened.

## Free for the generator

- [FREE] Visual design and internal layout of every block, within TS-WEB-0002
  (accessibility) and the brand kit — this spec fixes order and count,
  not appearance.
- [FREE] Component and file naming, and whether context band and closing
  CTA are one component with two modes or two components.
- [FREE] Number and sequence of argument blocks (D2, block 2) — that is
  each page's own spec, from its SRC-0003 brief.
- [FREE] The exact markup of a scene block, as long as D7's three parts
  and the single `mechanism` are present.
- [FREE] Copy. No wording in this spec is copy; the content phase writes
  it (repository working rule 4).

## Acceptance criteria

| ID | Level | Check |
| --- | --- | --- |
| TS-WEB-0006-A1 | static | Every route has a `page.meta.ts` with all D1 fields; `focusJob` is one of the four; conversion IDs resolve against the `go-to-market-os` conversion goals; `audiences` non-empty and ordered; ≥ 1 live module, each with an empty state. |
| TS-WEB-0006-A2 | static | Exactly one `data-cta="primary"` per rendered page; an `equalWeightConversion`, where declared, renders with the secondary treatment in the same block. |
| TS-WEB-0006-A3 | e2e | At 360 × 640 and 1280 × 800 the primary conversion is fully visible without scrolling on every page that declares one. |
| TS-WEB-0006-A4 | e2e | On every page whose focus job is "know what is on", the first screen contains the place-search or live-dates module and its primary conversion is not a link to another page. |
| TS-WEB-0006-A5 | e2e | From every page, each of the four jobs is reachable in ≤ 1 click (header and context band targets resolve inside the TS-WEB-0004 D1 inventory). |
| TS-WEB-0006-A6 | e2e | Every page renders exactly one context band, naming exactly the three non-focus jobs, in DOM order after the last argument block and before the closing block. |
| TS-WEB-0006-A7 | e2e | The last block of every page is the closing CTA with the same conversion goal ID and target as the primary conversion — or, where `primaryConversion` is `null`, the merged three-job block. |
| TS-WEB-0006-A8 | static | Content lint (SRC-0018): zero hits of the avoid list — SRC-0017 §9 plus the glossary's avoid column — in page copy; no section-title field contains a question mark (CG-005); every scene block declares exactly one `mechanism`. |
| TS-WEB-0006-A9 | static | No role switcher, audience selector, or self-classification control exists in the component inventory or in any rendered page. |
| TS-WEB-0006-A10 | e2e | Stage-0 render (no geo, no referrer, no UTM, no params) and stage-3 render of the same page have identical block structure and identical `focusJob`; only module selection and order differ. The `/dein-ort` empty state is the one registered exception. |
| TS-WEB-0006-A11 | static | Manifest set validates both ways against the SRC-0003 conversion map; `order-promotion-material` is reported as the one accepted gap with Q-0005. |
| TS-WEB-0006-A12 | static | The only numeric price rendered anywhere is `portalize-calendar`'s 480 €/year, read from the offering package; every other offering renders "auf Anfrage" or no price at all. |
| TS-WEB-0006-A13 | e2e | `/deine-region` shows the two-working-day promise at the quote form and in the confirmation, both from the same constant. |
| TS-WEB-0006-A14 | manual | The eight-point compliance check of SRC-0001 passes for each page brief before its content ships — points 4, 7 and 8 reviewed by hand, the rest evidenced by A1–A13. |
| TS-WEB-0006-A15 | e2e | The five second-level pages (`/dein-ort/starten`, `/mitmachen/registrieren`, `/dein-kalender/bestellen`, `/deine-region/angebot`, `/ueber-uns/archiv`) each render exactly one breadcrumb `<nav>` with an accessible name, positioned before the `h1` in DOM order, whose last item is not a link. No `data-cta` attribute occurs inside it, and no other page renders one. |
| TS-WEB-0006-A16 | manual | The copy rules SRC-0018 assigns to `review` pass for every slot before it is approved: a reader-directed question is answered in its block (CG-006), each section hands off to the next (CG-008), the benefit stands before the concept (CG-010), every claim carries an example (CG-011), no heading is flat or abstract (CG-017/CG-018), a proof card states a win (CG-027), and nothing on the page is literally untrue (CG-033). |
| TS-WEB-0006-A17 | e2e | Every page renders exactly one contact section, in DOM order after the closing block and before the global footer. It contains no `data-cta="primary"`; its first action row is the only element on the site whose href is the configured appointment URL. No page anywhere renders a general contact form: no `form` element and no envoy mount point exists outside `/deine-region/angebot` and the order flow's invoice step. |
| TS-WEB-0006-A18 | e2e | Every explanatory module (scene block, publishing path, price tier) contains exactly one CTA, and it carries `data-cta="secondary"` or `="equal-weight"`; the count of `data-cta="primary"` on the page is unchanged by their presence. |

## Coverage

| Requirement | Discharged by |
| --- | --- |
| FUN-WEB-0001 (one focus job per page, declared) | D1 · A1, A14 |
| FUN-WEB-0003 (one primary conversion, above the fold; the CTA ladder) | D3 · A2, A3, A15, A18 |
| FUN-WEB-0004 (four jobs, one click from anywhere) | D5 (with TS-WEB-0004 D4) · A5 |
| FUN-WEB-0005 (context band, position and contents) | D2, D5 · A6 |
| FUN-WEB-0006 (page ends in its focus job's CTA) | D2, D6 · A7, A17 |
| FUN-WEB-0007 ("know what is on" fulfilled in place) | D4 · A4 |
| FUN-WEB-0008 (scenes, one mechanism, no generic claims) | D7 · A8, A16 |
| FUN-WEB-0009 (no role switcher, no self-classification) | D8 · A9, A10 |
| FUN-WEB-0019 (conversion map complete) | D9 · A11 |
| FUN-WEB-0020 (pricing display rule) | D10 · A12 |
| FUN-WEB-0022 (two-working-day response promise) | D11 · A13 |

## Open points

- **Fold definition is UNKNOWN in the sources.** D3 measures the fold at
  360 × 640 and 1280 × 800; no source states at which viewport "above the
  fold" is measured. Question: are those the right two extremes, and does
  the promise have to hold for a 320 px viewport (TS-WEB-0002 A7) as well,
  where it may be unreachable for the longer CTAs? The third reference
  viewport (428 × 926) is settled and not part of this question — it
  carries the small-range checks, not the fold promise.
- ~~**Equal weight versus "visually unrivalled".**~~ **Closed by
  DEC-0082 §3.** The second goal renders as an adjacent secondary action in
  the same block — the two-CTA hero, order beside consult. What was a
  proposal is now the rule, and the ladder in D3 says where every other
  action on a page sits, so a component can no longer resolve the question
  for itself.
- **Merged band and closing block on conversion-less pages.** D6 merges
  them; since DEC-0081 §6 the case is `/ueber-uns/archiv` alone. SRC-0001 §7
  requires band *then* CTA, SRC-0003 makes them the same three jobs.
  Confirm the merge, or accept the same three jobs twice in a row.
- **Does SRC-0001's compliance check mandate a live element on every
  page?** D1 now permits `liveModules: []` on the three sender surfaces
  (DEC-0084 §3), because the only live figures a provenance page could
  carry are the traction figures FUN-WEB-0041 forbids. If the check mandates
  one unconditionally rather than as a property of the page brief, the
  concept document is amended first and this exemption follows it
  (`specs/README.md` rule 4). **Answered by:** the IA owner.
- **The design guide still gives two components a primary CTA.** SRC-0014's
  explain module and contact section each specify "the primary treatment"
  for their CTA. DEC-0082 §2 corrects the guide, not the rule; until that
  correction lands, SRC-0014 and D3 disagree in writing. **Answered by:**
  the owner of `concept/website-design-system.md` and SRC-0013.
- ~~**The generic-claims term list does not exist.**~~ **Closed by
  DEC-0080.** It is the avoid list of SRC-0017 §9 plus the avoid column of
  `specs/glossary/glossary.md`, bound as a lint row by SRC-0018 (CG-040).
  The hub stays the single source for the brand-level word rules; the
  guide carries the website's cut and cites the hub by path. What is
  still open is the handover: which anti-patterns move into
  `brand-identity/tone-of-voice.md` once it is rewritten (SRC-0017 open
  decision 3).
- **Q-0005 keeps the conversion map incomplete.** `order-promotion-material`
  has no page. D9 accepts it as a named exception; the decision (website
  page or app) is still open.
- **Q-0022 gates D11.** Whether the lead handling behind the envoy widget
  can keep two working days is not confirmed. Until it is, the promise
  is unpublishable and `/deine-region` ships without it.
- **Path drift in the hub affects A1, A11 and A12.** Conversion goals and
  offerings now live under `packages/market/goals/conversion-goals/` and
  `packages/market/offerings/`, while `specs/README.md` and the
  requirement rows still cite `strategy/conversion-goals/` and
  `offerings/`. The static checks must resolve against the current paths;
  the reference correction belongs to those files, not to this one.
