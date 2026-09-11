---
artefact: tactical-spec
id: TS-022
profile: interaction
status: DRAFT
implements: [WEB-F-012]
sources: [SRC-001, SRC-003, SRC-008, SRC-014]
decisions: [DEC-029, DEC-036, DEC-048, DEC-052, DEC-056]
---

# TS-022 — `/mitmachen`, the publishing entry

## Purpose

The page that turns an Akteur who has never published into a registered
publisher. Focus job *publish our dates*, conversion
`register-as-publisher`.

Thin by design: block frame, primary conversion, context band, closing
CTA, scene shape and pricing are TS-006 · route and rendering TS-004 ·
proof TS-005 · live modules TS-008 · stages TS-010 · metadata TS-011 ·
events TS-012 · content types TS-007. What follows is this page only.

## Determinations

### D1 — Manifest values [FIXED: SRC-003 §Publish our dates, WEB-F-012]

`page.meta.ts` (TS-006 D1) for this route:

| Field | Value |
| --- | --- |
| `focusJob` | publish our dates — invariant at every stage (D8) |
| `primaryConversion` | `register-as-publisher` |
| `equalWeightConversion` | none |
| `audiences` | `actors` (primary) · `municipalities` (as publisher) |
| `liveModules` | the example-place module of D5 |
| `proofSlots` | beside the objection block (D3) · the proof block (D6) · the CTA reassurance (D7) |

The offering is `community-calendar`, free. Price display is TS-006 D10 —
free is not a price: no figure, no range, no "ab"; 480 € belongs to
`/dein-kalender`. "Portalize" does not occur here, `local-advertising`
nowhere (DEC-052 §1, §3).

### D2 — Slot inventory and order [FIXED: TS-006 D2 for the frame, SRC-003 for the sequence]

Block 2 of TS-006 D2, in this order; types per TS-007 B.3, fragments B.2.

| # | Slot | Content type | Carries |
| --- | --- | --- | --- |
| 1 | `hero` | `hero` | the WhatsApp scene, the primary `Cta` (D7) |
| 2 | `warum-heute-nichts-ankommt` | `objection-list` | why the current channels fail (D3) |
| 3 | `wege` | 3 × `publishing-path` | the three mechanisms (D4) |
| 4 | `beispiel` | `live-module-frame` | a real covered place, live (D5) |
| 5 | `beleg` | 3 × `proof-card` | proof, publish-weighted (D6) |

Context band and closing CTA come from the layout, not from here. No
other block type is permitted — no feature list, no tier table.

### D3 — The objection block, and what it is made of [FIXED: SRC-003 "why the six current channels fail"; item set PROPOSED]

| Property | Rule |
| --- | --- |
| Position | **before** the offer; the block makes no product claim, the answer is slot 3, and it is not a Q&A block (D8) |
| Shape | one headline plus *n* items; each item = the channel in the visitor's own words + the one concrete way it fails (a boundary, a deadline, a membership) |
| Sources | `@schafe-vorm-fenster/audiences#actors` (Problem) · `@schafe-vorm-fenster/messaging` (positioning alternatives, `actors--community-calendar` pains), declared as `derived_from` (TS-007 D6) |
| Forbidden | a feature, our own name, a competitor product, and any numeral asserting how many channels exist — *six* is a figure of speech in the audience record, not an enumeration, and the hub names fewer explicitly, so the block renders what the sources carry and states no number |
| Proof | one slot beside the block, elements per TS-005; visibly empty if nothing clears |

### D4 — Three publishing paths, one mechanism each [FIXED: SRC-003, SRC-001 §1a, TS-006 D7; steps FREE]

| Order | Path | `mechanism` | Availability in the hub |
| --- | --- | --- | --- |
| 1 | photo of the flyer via WhatsApp | `whatsapp` | generally available |
| 2 | the actor's own calendar, connected | `calendar-connection` | generally available |
| 3 | the actor's own website as a source | `website-import` | **alpha** |

| Rule | Determination |
| --- | --- |
| One appearance | each mechanism appears once. The hero is the WhatsApp scene; the WhatsApp path block is its step detail and repeats neither opener nor instance, so only slot 1 carries `data-block="scene"` [PROPOSED — a test hook] |
| Honest availability | a path whose hub record is not `generally-available` renders the `status_badge` of its `Step` fragment; it may not be shown as dependable while the hub marks it alpha, and the badge goes only when that record changes |
| Not a feature list | a path is a mechanism; three steps is a working assumption, not a rule. Steps derive from `@schafe-vorm-fenster/offerings#community-calendar` |
| Cross-link | path 3 is where the website-owning Verein appears, so D9's link sits at the end of this slot and nowhere else |

### D5 — The live example: a real place, never the visitor's own [PROPOSED — TS-008 D1 carries no row for this route]

TS-008 position 1 (`GET /api/places/{slug}/events`) inside a
`live-module-frame`, labelled with its radius ("in `<place>`").

| Case | Determination |
| --- | --- |
| Stage 0 (TS-010 D1) | the configured reference place: one covered place with dates and a cleared, place-bound proof element (Open points) |
| Stage 1–3 | the nearest **active** place, resolved as on `/dein-ort/starten` (TS-008 D1 position 3 → position 1 for its dates) |
| Never | the visitor's own searched place, and never an uncovered place as data (WEB-F-024) |
| Zero dates | not an empty state here — the next candidate is taken; the focus-job switch of TS-008 D4 belongs to `/dein-ort` and never fires on this route |
| Failure | TS-008 D5 / TS-009 D4 unchanged; the slot reserves its space before paint (SRC-014 §Skeletons, DEC-033) |
| Outbound | `{APP_HOST}/{slug}` (TS-008 D9) — external, not a route-facade link |

### D6 — Proof is publish-weighted [FIXED: TS-005 D5, DEC-048]

The page passes `job: publish-our-dates` to the engine, which applies
that focus job's weight profile — unlike the sell pages, fixed in TS-005
D5, not restated. Three elements (TS-005 D6 / DEC-048).

### D7 — The CTA and the permanence promise [FIXED: SRC-003; binding PROPOSED]

| Property | Rule |
| --- | --- |
| Label | "Kalender anmelden – kostenlos" — content, placeholder until the content phase |
| Target | `/mitmachen/registrieren` through the route facade (TS-004 D3a) |
| Goal ID | `register-as-publisher`, on the hero CTA and the closing CTA alike (TS-006 D6) |
| Prefill | `?ort=<slug>` only when geo-api resolved the slug (TS-008 D9, DEC-029); an unresolved value is never forwarded |
| Reassurance | the permanence promise, in the `Cta` fragment's `reassurance` field |
| Backing | the 2022 public commitment, referenced by hub element ID via `proof_refs` and selected by TS-005 (clearance is a hard filter). Not quoted here, not copied into this repository (working rule 7). With nothing cleared behind it the promise is removed, not softened (SRC-001 §4, TS-006 D11) — today the commitment sits in `media-echo`, not in `proof`, see Open points |

### D8 — Invariants of this page [FIXED: SRC-001 §6, TS-006 D8, TS-010 D7, TS-011 D3/D4]

| What | Determination |
| --- | --- |
| Stage variance | only which place the example shows (D5) and which proof elements are selected (D6). Block count, block order, `focusJob` and the primary conversion never vary |
| No classification | no place search on this route, no role switcher, no audience control of any kind |
| Markup | `WebPage` only — the objection block is no `FAQPage`, the free offering emits no `Offer`, no `Service`, no price value; skeleton, `aside` rule, titles, descriptions and share image per TS-011 D3/D5/D6 |

### D9 — One link to `/dein-kalender`, not a sales pitch [FIXED: SRC-003, TS-011 D3; placement PROPOSED]

A Verein with its own website belongs on `/dein-kalender` (TS-024); path
3 imports *from* a website, the licence puts a calendar *on* one.

| Property | Rule |
| --- | --- |
| Count | exactly one link to `/dein-kalender` in the page body |
| Container | an `aside` (TS-011 D3: one page, one offering), at the end of slot 3 |
| Treatment | secondary; never `data-cta="primary"` (TS-006 D3) |
| Contents | one sentence naming the distinction, plus the link. No price, no tier list, no product name, no second CTA |

### D10 — Section rhythm [FIXED: SRC-014 §Page Rhythm]

The rhythm *rules* bind even though the home-page sequence does not:
never two photo sections in a row, at most two consecutive sections of
one colour family, one `himbeere` element per screen, and the dark `ink`
section — here the live example — exactly once, as the anchor. Media
boxes declare their ratio before paint; paths use `ratio-feature`.

## Free for the generator

- [FREE] All copy — hero aha question, objection items, step wording;
  content phase, placeholders until then.
- [FREE] Visual design and markup of the five own slots, within SRC-014,
  TS-002 and D10; icon choice from the permitted set; whether the paths
  render as grid, stack or stepper, and their `Step` count.
- [FREE] Component and file naming; the `data-*` hooks may be renamed as
  long as the acceptance criteria stay walkable.

## Acceptance criteria

| ID | Level | Check |
| --- | --- | --- |
| TS-022-A1 | static | `page.meta.ts` for `/mitmachen` declares `focusJob` "publish our dates", `primaryConversion` `register-as-publisher`, no `equalWeightConversion`, `audiences` `[actors, municipalities]`, one live module with its empty state, and the three proof slots of D1. |
| TS-022-A2 | e2e | At 360 × 640 and 1280 × 800 exactly one element carries `data-cta="primary"`, it is fully visible without scrolling, and its href resolves to `/mitmachen/registrieren`. |
| TS-022-A3 | e2e | DOM order of the page's own blocks is hero · objections · three paths · live example · proof, followed by the layout's context band and closing CTA. |
| TS-022-A4 | e2e | Exactly one block declares `data-block="scene"`; its mechanism is `whatsapp` and its opening line ends in a question mark. No other block declares the same mechanism as a scene. |
| TS-022-A5 | e2e | Exactly three publishing-path blocks exist, mechanisms distinct and ordered `whatsapp`, `calendar-connection`, `website-import`; each renders step items; the `website-import` block shows a visible status badge while its hub record is not `generally-available`. |
| TS-022-A6 | e2e | The objection block renders a headline and *n* items; no item contains a product name, a term from the generic-claims lint list, or a numeral asserting how many channels exist. A proof slot sits beside it or is visibly empty. |
| TS-022-A7 | unit | Example-place selection: with no anchor it returns the configured reference place; with an anchor the nearest active covered place with dates; a candidate with zero dates is skipped, never rendered. |
| TS-022-A8 | integration | Events upstream answering zero dates for the first candidate → the next candidate renders; upstream failing → TS-008 D5 tier 2/3 with its freshness label. Neither case produces error markup, a retry control, or a changed focus job. |
| TS-022-A9 | e2e | The live example states its radius as "in `<place>`" for a covered place; its outbound calendar link points at `{APP_HOST}/{slug}`; no website URL on this page carries a place slug as a path segment. |
| TS-022-A10 | e2e | Stage-0 request (no geo, no referrer, no UTM, no query) and a stage-3 request yield identical block structure, identical block count and identical `focusJob`; only the example place and the proof order differ. |
| TS-022-A11 | e2e | The closing CTA carries the same conversion goal ID, target and label as the primary CTA, and its reassurance contains the permanence promise. With the backing element unavailable at build time the promise is absent rather than reworded. |
| TS-022-A12 | static | The rendered HTML of `/mitmachen` contains no numeric price, no currency symbol, no "ab", no "480", no "Portalize" and no `local-advertising` mention; it emits exactly one JSON-LD graph, containing `WebPage` and no `FAQPage`, `Offer` or `Service` node. |
| TS-022-A13 | e2e | Exactly one link to `/dein-kalender` exists in the page body, inside an `aside`, without the primary-CTA treatment and without price or tier content. |
| TS-022-A14 | e2e | With a resolved place the primary CTA's href carries `?ort=<slug>`; with an unresolvable or free-text place it carries no `ort` parameter. |
| TS-022-A15 | integration | Navigating from the primary CTA fires no analytics event on `/mitmachen`; `register-as-publisher` with stage `handover` is emitted on `/mitmachen/registrieren` (TS-012 D4). |
| TS-022-A16 | e2e | Rhythm: no two adjacent sections are photo sections, exactly one is the dark live-data section, and every asynchronous box has a declared ratio or height before its content arrives (no layout shift on the live module). |

## Coverage

| Requirement | Discharged by |
| --- | --- |
| WEB-F-012 (`/mitmachen`, focus job publish our dates, `register-as-publisher`) | D1–D10 · A1–A16 |

Split against TS-004: TS-004 discharges the *route* — the path, its EN
sibling, its place in the App Router tree, its rendering mode (TS-004 D1,
D1a, D3a, D6 · TS-004-A1). This spec discharges what the route *is*:
manifest values, blocks and order, the mechanism rule, the live example,
the proof binding, the conversion carriage.

Adjacent, consumed and not discharged here: WEB-F-001/003–009 (TS-006) ·
WEB-F-024/030–036 (TS-005) · WEB-F-040/045/049 (TS-008) · WEB-F-050–052
(TS-010) · WEB-F-071/076/078 (TS-011) · WEB-Q-028 (TS-012).

## Open points

| Open point | Addressee |
| --- | --- |
| **TS-008 D1 has no row for `/mitmachen`** — its module-to-page table assigns position 1 to `/` and `/dein-ort` only, so D5 proposes an assignment this page needs but does not own. And "nearest active place" is not yet buildable: the Q-015 residue leaves `/api/region/{county}/examples` without an upstream ranking operation. | TS-008 · app team |
| **The permanence promise has no element in `@schafe-vorm-fenster/proof`.** The 2022 public commitment is held as a `media-echo` entry, referenced from the `community-calendar` offering; `proof/` carries nothing for it. Either mint a commitment-type proof element, or let TS-005 selection accept a media-echo element in a CTA reassurance slot. Until then D7's promise is unpublishable and A11 fails open. | hub evidence owner |
| **"Six channels" is not enumerated.** The audience record uses it as a figure of speech; positioning and the value proposition name a smaller set, so D3 forbids the numeral. Enumerate the six canonically, or drop the number from the brief. | hub messaging owner |
| **Website-source import is alpha** (hub open point on `community-calendar`). D4 requires the status badge — confirm the state before the page ships and say what the badge must claim. | product |
| **No component exists for `objection-list`, `publishing-path` or the live-module frame** (Q-044): three of five slots need shells the design system does not specify, and no component declares which content type it renders. | design |
| **The stage-0 reference place is unnamed.** D5 needs one covered place with dates and a cleared, place-bound proof element, held as configuration rather than in copy. | content/editorial |
| **Registration prefill stops at our own route.** DEC-029 leaves the app-side contract open, so `?ort=` travels no further than `/mitmachen/registrieren`; if the app later accepts a place, D7 and A14 need a second row. | app team |
