---
artefact: tactical-spec
id: TS-006
profile: rule
status: DRAFT
implements: [WEB-F-001, WEB-F-003, WEB-F-004, WEB-F-005, WEB-F-006, WEB-F-007, WEB-F-008, WEB-F-009, WEB-F-019, WEB-F-020, WEB-F-022]
sources: [SRC-001, SRC-003]
decisions: [DEC-036, DEC-039]
---

# TS-006 — Page Composition Rules

## Purpose

The rules that hold on **every** page: what a page must declare, in which
order its blocks stand, where its single conversion sits, how the other
three jobs stay one click away, and which promises may appear at all.
Per-page specs are thin and reference this one; anything true of exactly
one page belongs there, not here.

Routes, navigation labels and the link facade are TS-004. Selection and
ordering *inside* proof and live blocks is TS-005. Focus, order and the
eight-point brief check are SRC-001; the per-page briefs are SRC-003.
Neither is restated here — this spec turns them into checkable structure.

## Determinations

### D1 — Every page declares its brief in a machine-readable manifest [FIXED: SRC-001 §1 + "Compliance Check for a Page Brief"; representation PROPOSED]

Each route carries one `page.meta.ts` next to its `page.tsx` (TS-004 D2).
It is the page brief in typed form — the layout reads it, the checks read
it, and no second place states the same fact.

| Field | Type | Rule |
| --- | --- | --- |
| `focusJob` | one of the four job IDs | exactly one; no page has zero or two |
| `primaryConversion` | conversion goal ID or `null` | resolves in `go-to-market-os` conversion goals; `null` only where SRC-003 says the focus job has none of its own |
| `equalWeightConversion` | conversion goal ID, optional | see D3 |
| `audiences` | ordered audience IDs | priority order per SRC-003, first one is the primary |
| `liveModules` | ≥ 1 module ID | each with its empty state declared (TS-005) |
| `proofSlots` | slot IDs | a slot with no cleared proof stays empty; the claim is weakened, never invented (SRC-001 §4) |

The four job IDs are a closed set derived from SRC-001 §1 and live in one
registry module together with their targets (targets per TS-004 D4). No
page hard-codes a job label, target or ordering.

The manifest makes points 1, 2, 3, 5 and 6 of the SRC-001 compliance
check machine-checkable; points 4, 7 and 8 are checked by D5–D8 and A14.

### D2 — One block order, every page [FIXED: SRC-001 §2 and §7]

```text
1  focus block      — the focus job's argument + the primary conversion (D3/D4)
2  argument blocks  — scenes, live modules, proof, page-specific (SRC-003)
3  context band     — the other three jobs (D5)
4  closing CTA      — the focus job's conversion again (D6)
```

Blocks 3 and 4 are rendered by the shared layout from `page.meta.ts`, not
hand-placed per page — that is what makes "every page" enforceable rather
than aspirational. Nothing renders after block 4 except the global footer
(TS-004 D4).

**The breadcrumb trail is not a block** [FIXED: DEC-071]. The five
second-level pages carry a visible trail; it belongs to the page header,
renders *above* block 1, and does not enter the sequence above. Three
rules keep it from competing with the focus block:

- It uses link treatment, never CTA treatment. `data-cta` never appears
  inside it, so the "one primary conversion, visually unrivalled" rule
  (D3, WEB-F-003) is untouched by construction rather than by judgement.
- It is one `<nav>` with an accessible name, server-rendered as plain
  links, and its last item — the current page — is not a link.
- It is the only navigation permitted above block 1. A trail is a
  position indicator; anything that offers a *destination* above the
  focus block is a second exit, and those live in the context band.

This holds for the sender surfaces too: `/ueber-uns`, `/ueber-uns/archiv`
and the one legal page `/rechtliches` (DEC-039) each end in blocks 3 and
4. Because legal content is one page, the sequence exists once there
instead of three times (SRC-001 §7 names "pages adjacent to the imprint"
explicitly).

### D3 — One primary conversion, above the fold, visually unrivalled [FIXED: SRC-001 §2; fold measurement and equal-weight handling PROPOSED]

- Exactly one element per page carries the primary-CTA treatment. It is
  marked `data-cta="primary"` so the rule is testable, not a matter of
  taste.
- **Above the fold** = fully visible without scrolling at the two
  *extreme* reference viewports, 360 × 640 and 1280 × 800 [PROPOSED — no
  source defines the fold; TS-002 fixes 320 px only as the
  no-horizontal-scroll floor].

  There is a third reference viewport, **428 × 926** — the large phone
  that `breakpoint.sm` exists for (TS-017 D2b). It is deliberately *not*
  a fold viewport: it is strictly more generous than 360 × 640 in both
  axes, so a CTA that clears the fold on the small phone clears it here
  too, and testing it would add a check that cannot fail on its own. It
  is a reference viewport for what the small range *does* change —
  layout identity and horizontal scroll (TS-017 A8, A9) — because that
  is where the token scale is dense and where an unnoticed second layout
  would otherwise hide.
- **Visually unrivalled** = no other element on the page uses the primary
  treatment; secondary actions use the secondary treatment and sit below
  or beside, never above, the primary one.
- **Equal-weight second goal** (SRC-003 gives `/dein-kalender`
  `request-product-briefing` beside `buy-calendar-licence`): it is
  declared as `equalWeightConversion` and rendered in the *same* block as
  an adjacent secondary-treatment action. Equal weight in the brief means
  equal prominence of the offer, not a second primary style — otherwise
  "visually unrivalled" would have no meaning [PROPOSED].
- On a page whose `primaryConversion` is `null`, block 1 carries the
  focus job's argument and no CTA treatment at all; the conversion
  obligation is discharged by block 4 (D6).

### D4 — "Know what is on" is fulfilled in place, never linked [FIXED: SRC-001 §1, SRC-003 Home]

Where the focus job is *know what is on*, the primary conversion is a
**module, not a link**: the place search, or — location known — the
visitor's place with its live dates. The first screen fulfils the job;
it does not offer to fulfil it elsewhere.

| Situation | First screen carries |
| --- | --- |
| no location known | place search, dominant element |
| location known, place covered, dates exist | place name + live dates + open-the-calendar action |
| place covered, no dates | the empty-state rule of TS-005 / SRC-003 `/dein-ort` — the only runtime focus-job change on the website |
| place not covered | continue to `/dein-ort/starten`, place as query parameter (TS-004 D1a) |

Consequence for the header: the four job labels and the persistent
"Kalender" button (TS-004 D4) stay as they are — they are the *switch*
between jobs, not the fulfilment of this one.

### D5 — The context band [FIXED: SRC-001 §2; component contract PROPOSED]

One component, rendered by the layout on every page, filled from the job
registry as *all four jobs minus this page's focus job* — never a
hand-written list, so it can never drift out of sync.

| Property | Rule |
| --- | --- |
| Contents | exactly the three non-focus jobs, one entry each |
| Phrasing | an offer in the visitor's own voice ("wearing a different hat today?"), not a menu; copy comes from the content phase |
| Position | after the last argument block, before the closing CTA (D2) |
| Links | through the route facade (TS-004 D3a/D5); targets from the job registry |
| Treatment | secondary; never the primary treatment (D3) |

Together with the header (TS-004 D4) this makes every job reachable from
every page in at most one click; the band is the in-content guarantee,
the header the persistent one. Both are required — the header alone
would leave the promise dependent on a visitor noticing chrome.

### D6 — Every page ends in its conversion [FIXED: SRC-001 §7, SRC-003]

The last block is the CTA of the focus job and is **identical** to the
primary conversion: same conversion goal ID, same target, same label.
Two shapes, chosen by the manifest:

| `primaryConversion` | Closing block |
| --- | --- |
| a goal ID | that goal's CTA, repeated |
| `null` (SRC-003: `/ueber-uns`, `/ueber-uns/archiv`) | one block offering the three jobs that carry conversions |

Where the closing block is the three-job offer, it **merges** with the
context band: the band's content and the closing block are the same
three jobs, so they render once, as the last block, rather than twice in
sequence [PROPOSED].

### D7 — Scenes, not labels [FIXED: SRC-001 §1a; lint artefact PROPOSED]

Every job introduction on every page is a scene block with a fixed shape:

1. an opener phrased as the visitor's own question ("… and the date just
   appears in the calendar?");
2. exactly **one** mechanism, declared as the block's `mechanism` prop
   (e.g. WhatsApp, calendar connection, embed) — a block with two
   mechanisms is two blocks;
3. one concrete instance, live or proof-backed, as close to the visitor
   as the data allows (TS-005).

Feature lists are not a permitted block type anywhere on the site.
Generic claims are not copy: a term list ("einfach", "digital", "für
alle", "modern", "innovativ", …) is maintained as a content lint list and
fails the build on a hit [PROPOSED — see Open points: no such list exists
as an artefact yet].

### D8 — No self-classification [FIXED: SRC-001 §6]

- No role switcher, no audience tabs, no segmented "who are you?"
  control, no interstitial, no modal that asks the visitor to classify
  herself — on any page, at any stage.
- The only two things a visitor ever tells the site explicitly are **a
  place** (search) and **a job** (a link click). Both are actions towards
  her goal, not classification work.
- Stage 0 — nothing known — renders every page complete and convincing on
  its own.
- Higher stages (SRC-001 §6 table) change **only selection and order** of
  proof and live modules. Page structure per D2 and the declared
  `focusJob` are invariant across stages, with the single documented
  exception of the empty place calendar (D4, TS-005).
- Consequence for caching and rendering: because structure never varies
  by visitor, the static shell is stage-independent and only the streamed
  modules segment (TS-004 D6, TS-005).

### D9 — The conversion map is complete and is a check, not a diagram [FIXED: SRC-003 "Conversion Map", WEB-F-019]

The map in SRC-003 is the contract. The `page.meta.ts` set is validated
against it in both directions:

- every goal listed there appears as `primaryConversion` or
  `equalWeightConversion` on exactly the pages named there;
- no page declares a goal the map does not assign to it;
- `register-as-publisher` additionally appears via the context band on
  every page — carried by D5, not by a per-page declaration.

Known gap: `order-promotion-material` is carried by no page (Q-005). The
check lists it as an accepted exception with its question ID, so it stays
visible instead of quietly passing.

### D10 — Pricing display [FIXED: SRC-001 Boundaries, SRC-003 pricing rules, WEB-F-020; sourcing PROPOSED]

| Offering promotion | On the website |
| --- | --- |
| `promoted` with a public price | the price is shown — today exactly one: `portalize-calendar`, 480 €/year |
| `promoted` without a public price | "auf Anfrage" — no figure, no range, no "ab", no order of magnitude |
| `on-request` | mentioned, never priced |
| `withheld` | not offered; at most the single sentence WEB-C-015 permits |

The price string is read from the offering package rather than typed into
copy, so one place changes it [PROPOSED]. A price appearing in any other
page's copy is a defect, not a variant. The free community calendar tier
is not a price and not subject to this rule; its permanence promise is
content, backed by the 2022 public commitment (SRC-003).

### D11 — Promises are only displayed where a process backs them [FIXED: SRC-003 `/deine-region`, WEB-F-022; enforcement PROPOSED]

The general rule: a page states a response time, an availability or a
permanence promise only where an operational commitment exists to keep
it. The website is not the place where such a promise is invented.

The one instance in phase 1: the **two-working-day response promise** on
the `/deine-region` quote request. It is stated at the form before
submit and repeated in the confirmation the visitor sees after submit,
both from a single constant, so the two can never disagree. The promise
is bound to the lead handling behind the envoy widget (WEB-F-090) and is
flagged to envoy/ops as part of Q-022; if that process cannot keep it,
the promise is removed rather than softened.

## Free for the generator

- [FREE] Visual design and internal layout of every block, within TS-002
  (accessibility) and the brand kit — this spec fixes order and count,
  not appearance.
- [FREE] Component and file naming, and whether context band and closing
  CTA are one component with two modes or two components.
- [FREE] Number and sequence of argument blocks (D2, block 2) — that is
  each page's own spec, from its SRC-003 brief.
- [FREE] The exact markup of a scene block, as long as D7's three parts
  and the single `mechanism` are present.
- [FREE] Copy. No wording in this spec is copy; the content phase writes
  it (repository working rule 4).

## Acceptance criteria

| ID | Level | Check |
| --- | --- | --- |
| TS-006-A1 | static | Every route has a `page.meta.ts` with all D1 fields; `focusJob` is one of the four; conversion IDs resolve against the `go-to-market-os` conversion goals; `audiences` non-empty and ordered; ≥ 1 live module, each with an empty state. |
| TS-006-A2 | static | Exactly one `data-cta="primary"` per rendered page; an `equalWeightConversion`, where declared, renders with the secondary treatment in the same block. |
| TS-006-A3 | e2e | At 360 × 640 and 1280 × 800 the primary conversion is fully visible without scrolling on every page that declares one. |
| TS-006-A4 | e2e | On every page whose focus job is "know what is on", the first screen contains the place-search or live-dates module and its primary conversion is not a link to another page. |
| TS-006-A5 | e2e | From every page, each of the four jobs is reachable in ≤ 1 click (header and context band targets resolve inside the TS-004 D1 inventory). |
| TS-006-A6 | e2e | Every page renders exactly one context band, naming exactly the three non-focus jobs, in DOM order after the last argument block and before the closing block. |
| TS-006-A7 | e2e | The last block of every page is the closing CTA with the same conversion goal ID and target as the primary conversion — or, where `primaryConversion` is `null`, the merged three-job block. |
| TS-006-A8 | static | Content lint: zero hits of the generic-claims term list in page copy; every scene block declares exactly one `mechanism` and an opener in question form. |
| TS-006-A9 | static | No role switcher, audience selector, or self-classification control exists in the component inventory or in any rendered page. |
| TS-006-A10 | e2e | Stage-0 render (no geo, no referrer, no UTM, no params) and stage-3 render of the same page have identical block structure and identical `focusJob`; only module selection and order differ. The `/dein-ort` empty state is the one registered exception. |
| TS-006-A11 | static | Manifest set validates both ways against the SRC-003 conversion map; `order-promotion-material` is reported as the one accepted gap with Q-005. |
| TS-006-A12 | static | The only numeric price rendered anywhere is `portalize-calendar`'s 480 €/year, read from the offering package; every other offering renders "auf Anfrage" or no price at all. |
| TS-006-A13 | e2e | `/deine-region` shows the two-working-day promise at the quote form and in the confirmation, both from the same constant. |
| TS-006-A14 | manual | The eight-point compliance check of SRC-001 passes for each page brief before its content ships — points 4, 7 and 8 reviewed by hand, the rest evidenced by A1–A13. |
| TS-006-A15 | e2e | The five second-level pages (`/dein-ort/starten`, `/mitmachen/registrieren`, `/dein-kalender/bestellen`, `/deine-region/angebot`, `/ueber-uns/archiv`) each render exactly one breadcrumb `<nav>` with an accessible name, positioned before the `h1` in DOM order, whose last item is not a link. No `data-cta` attribute occurs inside it, and no other page renders one. |

## Coverage

| Requirement | Discharged by |
| --- | --- |
| WEB-F-001 (one focus job per page, declared) | D1 · A1, A14 |
| WEB-F-003 (one primary conversion, above the fold) | D3 · A2, A3, A15 |
| WEB-F-004 (four jobs, one click from anywhere) | D5 (with TS-004 D4) · A5 |
| WEB-F-005 (context band, position and contents) | D2, D5 · A6 |
| WEB-F-006 (page ends in its focus job's CTA) | D2, D6 · A7 |
| WEB-F-007 ("know what is on" fulfilled in place) | D4 · A4 |
| WEB-F-008 (scenes, one mechanism, no generic claims) | D7 · A8 |
| WEB-F-009 (no role switcher, no self-classification) | D8 · A9, A10 |
| WEB-F-019 (conversion map complete) | D9 · A11 |
| WEB-F-020 (pricing display rule) | D10 · A12 |
| WEB-F-022 (two-working-day response promise) | D11 · A13 |

## Open points

- **Fold definition is UNKNOWN in the sources.** D3 measures the fold at
  360 × 640 and 1280 × 800; no source states at which viewport "above the
  fold" is measured. Question: are those the right two extremes, and does
  the promise have to hold for a 320 px viewport (TS-002 A7) as well,
  where it may be unreachable for the longer CTAs? The third reference
  viewport (428 × 926) is settled and not part of this question — it
  carries the small-range checks, not the fold promise.
- **Equal weight versus "visually unrivalled".** SRC-003 gives
  `/dein-kalender` two equal conversions while SRC-001 §2 allows one
  unrivalled primary. D3 reconciles them by rendering the second as an
  adjacent secondary action. This is a proposal, not a derivation, and
  needs a decision point.
- **Merged band and closing block on conversion-less pages.** D6 merges
  them for `/ueber-uns` and `/ueber-uns/archiv`; SRC-001 §7 requires band
  *then* CTA, SRC-003 makes them the same three jobs. Confirm the merge,
  or accept the same three jobs twice in a row.
- **The generic-claims term list does not exist.** D7 and A8 depend on
  it. UNKNOWN: does the tone-of-voice foundation in `go-to-market-os`
  carry a banned-term list that A8 can consume, or must one be created —
  and if created, where does it live so the hub stays the single source?
- **Q-005 keeps the conversion map incomplete.** `order-promotion-material`
  has no page. D9 accepts it as a named exception; the decision (website
  page or app) is still open.
- **Q-022 gates D11.** Whether the lead handling behind the envoy widget
  can keep two working days is not confirmed. Until it is, the promise
  is unpublishable and `/deine-region` ships without it.
- **Path drift in the hub affects A1, A11 and A12.** Conversion goals and
  offerings now live under `packages/market/goals/conversion-goals/` and
  `packages/market/offerings/`, while `specs/README.md` and the
  requirement rows still cite `strategy/conversion-goals/` and
  `offerings/`. The static checks must resolve against the current paths;
  the reference correction belongs to those files, not to this one.
