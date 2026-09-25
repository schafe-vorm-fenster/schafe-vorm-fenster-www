---
artefact: tactical-spec
id: TS-WEB-0022
kind: interaction
status: DRAFT
version: 0.1.0
implements: [FUN-WEB-0012, BUS-WEB-0017, FUN-WEB-0204]
sources: [SRC-0001, SRC-0003, SRC-0008, SRC-0014]
decisions: [DEC-0029, DEC-0036, DEC-0048, DEC-0052, DEC-0056, DEC-0080, DEC-0082, DEC-0083, DEC-0107]
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-11T07:13:07+02:00"
---

# TS-WEB-0022 — `/mitmachen`, the publishing entry

## Purpose

The page that turns an Akteur who has never published into a registered
publisher. Focus job *publish our dates*, conversion
`register-as-publisher`.

Thin by design: block frame, primary conversion, context band, closing
CTA, scene shape and pricing are TS-WEB-0006 · route and rendering TS-WEB-0004 ·
proof TS-WEB-0005 · live modules TS-WEB-0008 · stages TS-WEB-0010 · metadata TS-WEB-0011 ·
events TS-WEB-0012 · content types TS-WEB-0007. What follows is this page only.

## Determinations

### D1 — Manifest values [FIXED: SRC-0003 §Publish our dates, FUN-WEB-0012]

`page.meta.ts` (TS-WEB-0006 D1) for this route:

| Field | Value |
| --- | --- |
| `focusJob` | publish our dates — invariant at every stage (D8) |
| `primaryConversion` | `register-as-publisher` |
| `equalWeightConversion` | none |
| `audiences` | `actors` (primary) · `municipalities` (as publisher) |
| `liveModules` | the example-place module of D5 |
| `proofSlots` | beside the objection block (D3) · the proof block (D6) · the CTA reassurance (D7) |

The offering is `community-calendar`, free. Price display is TS-WEB-0006 D10 —
free is not a price: no figure, no range, no "ab"; 480 € belongs to
`/dein-kalender`. "Portalize" does not occur here, `local-advertising`
nowhere (DEC-0052 §1, §3).

### D2 — Slot inventory and order [FIXED: TS-WEB-0006 D2 for the frame, SRC-0003 for the sequence]

Block 2 of TS-WEB-0006 D2, in this order; types per TS-WEB-0007 B.3, fragments B.2.

| # | Slot | Content type | Carries |
| --- | --- | --- | --- |
| 1 | `hero` | `hero` | the WhatsApp scene, the primary `Cta` (D7) |
| 2 | `warum-heute-nichts-ankommt` | `objection-list` | why the current channels fail (D3) |
| 3 | `wege` | 3 × `publishing-path` | the three mechanisms (D4) |
| 4 | `beispiel` | `live-module-frame` | a real covered place, live (D5) |
| 5 | `beleg` | 3 × `proof-card` | proof, publish-weighted (D6) |

Context band and closing CTA come from the layout, not from here. No
other block type is permitted — no feature list, no tier table.

### D3 — The objection block, and what it is made of [FIXED: SRC-0003 "why the six current channels fail"; item set PROPOSED]

| Property | Rule |
| --- | --- |
| Position | **before** the offer; the block makes no product claim, the answer is slot 3, and it is not a Q&A block (D8) |
| Shape | one headline plus *n* items; each item = the channel in the visitor's own words + the one concrete way it fails (a boundary, a deadline, a membership) |
| Sources | `@schafe-vorm-fenster/audiences#actors` (Problem) · `@schafe-vorm-fenster/messaging` (positioning alternatives, `actors--community-calendar` pains), declared as `derived_from` (TS-WEB-0007 D6) |
| Forbidden | a feature, our own name, a competitor product, and any numeral asserting how many channels exist — *six* is a figure of speech in the audience record, not an enumeration, and the hub names fewer explicitly, so the block renders what the sources carry and states no number |
| Proof | one slot beside the block, elements per TS-WEB-0005; visibly empty if nothing clears |

### D4 — Three publishing paths, one mechanism each — and the path block **is** the explain module [FIXED: SRC-0003, SRC-0001 §1a, TS-WEB-0006 D7, SRC-0014 §"Explain module", SRC-0017 CG-025]

| Order | Path | `mechanism` | Availability in the hub |
| --- | --- | --- | --- |
| 1 | photo of the flyer via WhatsApp | `whatsapp` | generally available |
| 2 | the actor's own calendar, connected | `calendar-connection` | generally available |
| 3 | the actor's own website as a source | `website-import` | **alpha** |

| Rule | Determination |
| --- | --- |
| One appearance | each mechanism appears once. The hero is the WhatsApp scene; the WhatsApp path block is its step detail and repeats neither opener nor instance, so only slot 1 carries `data-block="scene"` [PROPOSED — a test hook] |
| Honest availability | a path whose hub record is not `generally-available` renders the `status_badge` of its `Step` fragment; it may not be shown as dependable while the hub marks it alpha, and the badge goes only when that record changes |
| **One CTA per path** [FIXED: DEC-0082 §4] | each of the three path blocks ends in exactly one CTA at secondary treatment, pointing at that path's own next step — the WhatsApp path at its chat handover, paths 2 and 3 at `/mitmachen/registrieren` through the route facade. None of them carries `data-cta="primary"`: the page's one primary stays the hero CTA (D7), and a CTA in a module is a link, not a conversion declaration (TS-WEB-0006 D9). A path without a CTA is the review's finding, not a variant |
| Cross-link | path 3 is where the website-owning Verein appears, so D9's link sits at the end of this slot and nowhere else |

#### The render form is fixed, and it is the explain module

**Each of the three path blocks is the `explain-module` component** that
`SRC-0014 §"Explain module"` specifies (audit A6, 2026-09-25). The step count and
the render form used to be `[FREE]` here, and this determination used to say
*"three steps is a working assumption, not a rule"* — while the guide fixed both.
Two specification-side artefacts said opposite things about the same component;
this is the side that was wrong.

| Property | Determination |
| --- | --- |
| Ordinal | one per module, mono display size, with the module title beside it |
| Step lines | **exactly three.** Each is a numbered disc plus two lines — the bold core and the normal detail. Not two, not four, and not a count derived from the offering record: `@schafe-vorm-fenster/offerings#community-calendar` supplies what each step *says*, and this determination supplies how many there are |
| Below `lg` (`48rem`) | a **graphic stage**: one box at `ratio-square` holding three states, the next cropped in at the trailing edge, with the three step lines beneath it. The box never changes size, so a state change cannot shift the page |
| One viewport below `lg` | the module plus its three step lines fit **one viewport height at the phone breakpoint**. If they do not, the copy is too long; the module does not grow (SRC-0017 CG-025) |
| From `lg` | the three steps **stand side by side**, each with its own graphic above its own two lines. No stage, no crop, **no slide** — everything is visible at once, which is why the stage existed. Nothing auto-advances |
| The one breakpoint | `lg` = `48rem` and no other. A generator does not choose it; it is the component's own and the only `min-width` it declares (`specs/contracts/design-system-contract.md`) |
| Motion | the auto-advance exists **only below `lg`** — the system's one exception, an owner decision (DEC-0105 §6). The step lines are real buttons at every size; under `prefers-reduced-motion` the stage shows state 1 static |
| One CTA | as the row above, at secondary treatment. `explain-module` may not take `primary` even as a prop value |
| Line length | each step line is a **single line at 390 px** viewport width — core ≤ 30, detail ≤ 40 characters (SRC-0017 CG-025). That is the budget the copy is written to, not a hope; the lines are clamped to one line each and nothing clamps in practice |

Three phone numbers are in play and they are not interchangeable: **390 px** is
the authoring width the copy budget is derived from, **360 × 800** is what
SRC-0014 means by "per screen", and **360 × 640** is A2's fold viewport. The
single-line rule is 390 px, the one-viewport rule is the phone breakpoint, and
A18/A19 assert them at those widths.

### D5 — The live example: a real place, never the visitor's own [PROPOSED — TS-WEB-0008 D1 carries no row for this route]

TS-WEB-0008 position 1 (`GET /api/places/{slug}/events`) inside a
`live-module-frame`, labelled with its radius ("in `<place>`").

| Case | Determination |
| --- | --- |
| Stage 0 (TS-WEB-0010 D1) | the configured reference place: one covered place with dates and a cleared, place-bound proof element (Open points) |
| Stage 1–3 | the nearest **active** place, resolved as on `/dein-ort/starten` (TS-WEB-0008 D1 position 3 → position 1 for its dates) |
| Never | the visitor's own searched place, and never an uncovered place as data (FUN-WEB-0024) |
| Zero dates | not an empty state here — the next candidate is taken; the focus-job switch of TS-WEB-0008 D4 belongs to `/dein-ort` and never fires on this route |
| Failure | TS-WEB-0008 D5 / TS-WEB-0009 D4 unchanged; the slot reserves its space before paint (SRC-0014 §Skeletons, DEC-0033) |
| Outbound | `{APP_HOST}/{slug}` (TS-WEB-0008 D9) — external, not a route-facade link |

### D6 — Proof is publish-weighted [FIXED: TS-WEB-0005 D5, DEC-0048]

The page passes `job: publish-our-dates` to the engine, which applies
that focus job's weight profile — unlike the sell pages, fixed in TS-WEB-0005
D5, not restated. Three elements (TS-WEB-0005 D6 / DEC-0048).

### D7 — The CTA and the permanence promise [FIXED: SRC-0003; binding PROPOSED]

| Property | Rule |
| --- | --- |
| Label | names the action and that it costs nothing. The wording is copy, written under SRC-0017 CG-026 — this spec states no label string and no grammatical form (DEC-0083) |
| Target | `/mitmachen/registrieren` through the route facade (TS-WEB-0004 D3a) |
| Goal ID | `register-as-publisher`, on the hero CTA and the closing CTA alike (TS-WEB-0006 D6) |
| Prefill | `?ort=<slug>` only when geo-api resolved the slug (TS-WEB-0008 D9, DEC-0029); an unresolved value is never forwarded |
| Reassurance | the permanence promise, in the `Cta` fragment's `reassurance` field |
| Backing | the 2022 public commitment, referenced by hub element ID via `proof_refs` and selected by TS-WEB-0005 (clearance is a hard filter). Not quoted here, not copied into this repository (working rule 7). With nothing cleared behind it the promise is removed, not softened (SRC-0001 §4, TS-WEB-0006 D11) — today the commitment sits in `media-echo`, not in `proof`, see Open points |

### D8 — Invariants of this page [FIXED: SRC-0001 §6, TS-WEB-0006 D8, TS-WEB-0010 D7, TS-WEB-0011 D3/D4]

| What | Determination |
| --- | --- |
| Stage variance | only which place the example shows (D5) and which proof elements are selected (D6). Block count, block order, `focusJob` and the primary conversion never vary |
| No classification | no place search on this route, no role switcher, no audience control of any kind |
| Markup | `WebPage` only — the objection block is no `FAQPage`, the free offering emits no `Offer`, no `Service`, no price value; skeleton, `aside` rule, titles, descriptions and share image per TS-WEB-0011 D3/D5/D6 |

### D9 — One link to `/dein-kalender`, not a sales pitch [FIXED: SRC-0003, TS-WEB-0011 D3; placement PROPOSED]

A Verein with its own website belongs on `/dein-kalender` (TS-WEB-0024); path
3 imports *from* a website, the licence puts a calendar *on* one.

| Property | Rule |
| --- | --- |
| Count | exactly one link to `/dein-kalender` in the page body |
| Container | an `aside` (TS-WEB-0011 D3: one page, one offering), at the end of slot 3 |
| Treatment | secondary; never `data-cta="primary"` (TS-WEB-0006 D3) |
| Contents | one sentence naming the distinction, plus the link. No price, no tier list, no product name, no second CTA |

### D10 — Section rhythm [FIXED: SRC-0014 §Page Rhythm]

The rhythm *rules* bind even though the home-page sequence does not:
never two photo sections in a row, at most two consecutive sections of
one colour family, one `himbeere` element per screen, and the dark `ink`
section — here the live example — exactly once, as the anchor. Media
boxes declare their ratio before paint; paths use `ratio-feature`.

### D11 — The hint banner carries the price boundary [FIXED: BUS-WEB-0017, FUN-WEB-0204, DEC-0107 §3]

One banner, at the end of slot 3, after the three path blocks.

| Property | Rule |
| --- | --- |
| Count | exactly one on the page, and only in slot 3. The boundary is a fact about all three paths, so it is not repeated per path |
| What it states | the boundary of `BUS-WEB-0017` — a source the platform already supports publishes free; an individual integration into a system it does not already support is the `custom-data-integration` add-on |
| The source list | is the offering's, never this spec's (`specs/README.md` rule 1): the standard sources resolve from `@schafe-vorm-fenster/offerings#community-calendar` through the content pipeline. DEM-0065 is open until the record carries them, and until it does the banner names the boundary without enumerating |
| No figure | no amount, no currency symbol, no "ab", no range. `/mitmachen` renders no price at all (D1, A12), and the add-on has none to render — `price_status: on-request`, and `publishablePrice` is false for it (`TS-WEB-0018-A2`) |
| Not a CTA | no `data-cta` of any rung and no conversion declaration. One CTA per path is D4's, the page's one primary is the hero's (D7), and a boundary is not an action (DEC-0082 §1) |
| Not a status badge | D4's `status_badge` says path 03's *mechanism* is alpha; this says what a connection *costs*. Two different facts, two elements |
| Wording | copy, under SRC-0017 — this spec states no sentence and no grammatical form (DEC-0083) |

## Free for the generator

- [FREE] All copy — the hero opener, objection items, step wording, every
  CTA label; content phase, placeholders until then. The opener is a scene
  opener under TS-WEB-0006 D7: a statement of what works, a question only where
  the block answers it in the next sentence (SRC-0017 CG-005/CG-006). The
  earlier "aha question" is withdrawn — SRC-0001 §1a's aha is the stance the
  opener takes, not a punctuation mark it has to carry (DEC-0080, DEC-0083).
- [FREE] Visual design and markup of the five own slots, within SRC-0014,
  TS-WEB-0002 and D10; icon choice from the permitted set. **Not free any more:**
  the path blocks' render form and step count, which are the `explain-module`
  component of SRC-0014 and are fixed in D4 (audit A6, 2026-09-25).
- [FREE] Component and file naming; the `data-*` hooks may be renamed as
  long as the acceptance criteria stay walkable.

## Acceptance criteria

| ID | Level | Check |
| --- | --- | --- |
| TS-WEB-0022-A1 | static | `page.meta.ts` for `/mitmachen` declares `focusJob` "publish our dates", `primaryConversion` `register-as-publisher`, no `equalWeightConversion`, `audiences` `[actors, municipalities]`, one live module with its empty state, and the three proof slots of D1. |
| TS-WEB-0022-A2 | e2e | At 360 × 640 and 1280 × 800 exactly one element carries `data-cta="primary"`, it is fully visible without scrolling, and its href resolves to `/mitmachen/registrieren`. |
| TS-WEB-0022-A3 | e2e | DOM order of the page's own blocks is hero · objections · three paths · live example · proof, followed by the layout's context band and closing CTA. |
| TS-WEB-0022-A4 | e2e | Exactly one block declares `data-block="scene"`; its mechanism is `whatsapp` and its opening line is a **statement** — no question mark unless the block answers it in the next sentence (TS-WEB-0006 D7, SRC-0017 CG-005/CG-006). No other block declares the same mechanism as a scene. |
| TS-WEB-0022-A5 | e2e | Exactly three publishing-path blocks exist, mechanisms distinct and ordered `whatsapp`, `calendar-connection`, `website-import`; **each renders an ordinal, a title and exactly three step lines**, each step line carrying a bold core and a normal detail, and exactly one CTA carrying `data-cta="secondary"` resolving to that path's next step; the `website-import` block shows a visible status badge while its hub record is not `generally-available`. The count of `data-cta="primary"` on the page stays 1 (A2). |
| TS-WEB-0022-A18 | e2e | At 390 px viewport width every step line of all three modules renders on exactly **one** line: the rendered height of each core element equals one line box of its own computed `line-height`, and the same for each detail element. Measured per element, not per block (SRC-0017 CG-025, SRC-0014 §"Explain module"). |
| TS-WEB-0022-A19 | e2e | Below `lg` (`48rem`): each module — ordinal, title, graphic stage and its three step lines — fits within **one viewport height** at the phone breakpoint, and the stage's box keeps the same height across all three states. From `lg` the three steps render side by side in one row, no stage element exists, and no element's position changes over 5 s without interaction. |
| TS-WEB-0022-A6 | e2e | The objection block renders a headline and *n* items; no item contains a product name, a term from the generic-claims lint list, or a numeral asserting how many channels exist. A proof slot sits beside it or is visibly empty. |
| TS-WEB-0022-A7 | unit | Example-place selection: with no anchor it returns the configured reference place; with an anchor the nearest active covered place with dates; a candidate with zero dates is skipped, never rendered. |
| TS-WEB-0022-A8 | integration | Events upstream answering zero dates for the first candidate → the next candidate renders; upstream failing → TS-WEB-0008 D5 tier 2/3 with its freshness label. Neither case produces error markup, a retry control, or a changed focus job. |
| TS-WEB-0022-A9 | e2e | The live example states its radius as "in `<place>`" for a covered place; its outbound calendar link points at `{APP_HOST}/{slug}`; no website URL on this page carries a place slug as a path segment. |
| TS-WEB-0022-A10 | e2e | Stage-0 request (no geo, no referrer, no UTM, no query) and a stage-3 request yield identical block structure, identical block count and identical `focusJob`; only the example place and the proof order differ. |
| TS-WEB-0022-A11 | e2e | The closing CTA carries the same conversion goal ID, target and label as the primary CTA, and its reassurance contains the permanence promise. With the backing element unavailable at build time the promise is absent rather than reworded. |
| TS-WEB-0022-A12 | static | The rendered HTML of `/mitmachen` contains no numeric price, no currency symbol, no "ab", no "480", no "Portalize" and no `local-advertising` mention; it emits exactly one JSON-LD graph, containing `WebPage` and no `FAQPage`, `Offer` or `Service` node. |
| TS-WEB-0022-A13 | e2e | Exactly one link to `/dein-kalender` exists in the page body, inside an `aside`, without the primary-CTA treatment and without price or tier content. |
| TS-WEB-0022-A14 | e2e | With a resolved place the primary CTA's href carries `?ort=<slug>`; with an unresolvable or free-text place it carries no `ort` parameter. |
| TS-WEB-0022-A15 | integration | Navigating from the primary CTA fires no analytics event on `/mitmachen`; `register-as-publisher` with stage `handover` is emitted on `/mitmachen/registrieren` (TS-WEB-0012 D4). |
| TS-WEB-0022-A17 | e2e | Exactly one hint banner exists, inside the publishing-path slot and after the third path block. It carries no `data-cta` attribute and declares no conversion goal. It contains no numeric amount, no currency symbol and no "ab"; the page-wide price assertion of A12 is unchanged by its presence. |
| TS-WEB-0022-A16 | e2e | Rhythm: no two adjacent sections are photo sections, exactly one is the dark live-data section, and every asynchronous box has a declared ratio or height before its content arrives (no layout shift on the live module). |

## Coverage

| Requirement | Discharged by |
| --- | --- |
| FUN-WEB-0012 (`/mitmachen`, focus job publish our dates, `register-as-publisher`, one CTA per publishing path) | D1–D10 · A1–A16, A18, A19 |
| BUS-WEB-0017 (a publishing path whose source the platform already supports publishes free) | D11 · A17 — the rule is the business's; D11 is where the website states it |
| FUN-WEB-0204 (state the price boundary of BUS-WEB-0017 at the publishing paths) | D11 · A17 |

Split against TS-WEB-0004: TS-WEB-0004 discharges the *route* — the path, its EN
sibling, its place in the App Router tree, its rendering mode (TS-WEB-0004 D1,
D1a, D3a, D6 · TS-WEB-0004-A1). This spec discharges what the route *is*:
manifest values, blocks and order, the mechanism rule, the live example,
the proof binding, the conversion carriage.

Adjacent, consumed and not discharged here: FUN-WEB-0001, FUN-WEB-0004–0007, FUN-WEB-0009, FUN-WEB-0133–0136, FUN-WEB-0138 (TS-WEB-0006) ·
FUN-WEB-0024, FUN-WEB-0030–0035, FUN-WEB-0149–0151 (TS-WEB-0005) · FUN-WEB-0040, FUN-WEB-0045, FUN-WEB-0049 (TS-WEB-0008) · FUN-WEB-0050–0052
(TS-WEB-0010) · FUN-WEB-0071, FUN-WEB-0076, FUN-WEB-0078 (TS-WEB-0011) · CON-WEB-0035, CON-WEB-0036, CON-WEB-0037, NFR-WEB-0064 (TS-WEB-0012).

## Open points

| Open point | Addressee |
| --- | --- |
| **TS-WEB-0008 D1 has no row for `/mitmachen`** — its module-to-page table assigns position 1 to `/` and `/dein-ort` only, so D5 proposes an assignment this page needs but does not own. And "nearest active place" is not yet buildable: the Q-0015 residue leaves `/api/region/{county}/examples` without an upstream ranking operation. | TS-WEB-0008 · app team |
| **The permanence promise has no element in `@schafe-vorm-fenster/proof`.** The 2022 public commitment is held as a `media-echo` entry, referenced from the `community-calendar` offering; `proof/` carries nothing for it. Either mint a commitment-type proof element, or let TS-WEB-0005 selection accept a media-echo element in a CTA reassurance slot. Until then D7's promise is unpublishable and A11 fails open. | hub evidence owner |
| ~~**"Six channels" is not enumerated.**~~ **Decided by DEC-0064 §2** — the channels become a list in the hub's messaging, and the **artefact is still owed** (Q-0050, DEM-0036, `ANSWERED`). Until it lands D3 forbids the numeral and the block states no number, which is a working rule rather than a blocked one. | hub messaging owner |
| **Website-source import is alpha** (hub open point on `community-calendar`). D4 requires the status badge — confirm the state before the page ships and say what the badge must claim. | product |
| **Does the explain module appear on `/`, and in which slot?** `SRC-0014` §"Explain module" says the component is *"reused unchanged on `/`"* and `TS-WEB-0019` never mentions it; the three scene blocks there are three different jobs with one mechanism each, not three steps of one path, so a scene cannot simply *be* one. Three options, none of them derivable from what is written: it replaces the three scene blocks, it coexists as a further block, or the guide's sentence is withdrawn. Recorded as **Q-0079** rather than decided here (audit A6, 2026-09-25 — the review left it open and nobody had written it down). | the owner of `concept/website-design-system.md`, with TS-WEB-0019 |
| **No component exists for `objection-list`, `publishing-path` or the live-module frame** (Q-0044): three of five slots need shells the design system does not specify, and no component declares which content type it renders. | design |
| **The stage-0 reference place is unnamed.** D5 needs one covered place with dates and a cleared, place-bound proof element, held as configuration rather than in copy. | content/editorial |
| **Registration prefill stops at our own route.** DEC-0029 leaves the app-side contract open, so `?ort=` travels no further than `/mitmachen/registrieren`; if the app later accepts a place, D7 and A14 need a second row. | app team |
