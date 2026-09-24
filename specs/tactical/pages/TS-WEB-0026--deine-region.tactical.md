---
artefact: tactical-spec
id: TS-WEB-0026
kind: interaction
status: DRAFT
implements: [FUN-WEB-0016, FUN-WEB-0022, FUN-WEB-0028]
sources: [SRC-0002, SRC-0003, SRC-0008, SRC-0014]
decisions: [DEC-0009, DEC-0030, DEC-0034, DEC-0036, DEC-0037, DEC-0041, DEC-0048, DEC-0081, DEC-0082, DEC-0083]
---

# TS-WEB-0026 — `/deine-region`: The Region Page

## Purpose

The enterprise page: counties, Landesbehörden, networks and large towns
that want to **run their own calendar** for a whole territory. It sells
`portalize-enterprise`, never prints a price, and has to make the map
argument while the map module does not exist (DEC-0034). Nothing general
is repeated: composition, context band, closing CTA and the promise rule
TS-WEB-0006 (D11 is this page's); components, ratios and page rhythm
`concept/website-design-system.md`; routes TS-WEB-0004 · proof TS-WEB-0005 · live
modules TS-WEB-0008 · fallbacks TS-WEB-0009 · forms TS-WEB-0016 · events TS-WEB-0012 · SEO
TS-WEB-0011 · boundaries and price TS-WEB-0018.

## Determinations

### D1 — Manifest and the two routes [FIXED: SRC-0003 §For a whole region + Conversion Map; form placement PROPOSED]

| Field | Value |
| --- | --- |
| `focusJob` | run our own calendar |
| `primaryConversion` | `request-licence-quote` |
| `equalWeightConversion` | `request-product-briefing` — the conversion map assigns it here and TS-WEB-0006 D9 offers no other slot (Open points) |
| `audiences` | `counties` · `institutions` (Landesbehörden, networks) · `municipalities` (large towns), in that order |
| `liveModules` | county examples (TS-WEB-0008 pos 3) · counters (pos 4) · place search · embed demo (pos 1′) |
| `offerings` | `portalize-enterprise` (primary) · `portalize-calendar` (comparison) · `custom-data-integration` (mention only, TS-WEB-0004 D7) |

| Route | Carries | Fires |
| --- | --- | --- |
| `/deine-region` | the whole argument; the quote request as **CTA** (primary, target `/deine-region/angebot`), repeated identically in the closing block; the consult action beside it, pointing at this page's contact section (DEC-0081 §3) | `request-product-briefing` on the contact section's first action row, not on the in-page action (TS-WEB-0016 D12) |
| `/deine-region/angebot` | the one envoy widget instance for the quote (TS-WEB-0016 S2) and its confirmation | `request-licence-quote` on widget success (TS-WEB-0012 D4) |

### D2 — Block sequence [FIXED: TS-WEB-0006 D2 for the frame; the argument blocks are this page's own]

| # | Block carries | Surface (design system §Page Rhythm) |
| --- | --- | --- |
| 1 | focus: the map story opener as a scene, one mechanism — the embedded calendar (TS-WEB-0006 D7) — plus the primary CTA | photo, `ratio-hero` |
| 2 | the territory question: why a chronological list cannot answer "what is near me" at county scale (D3) | colour, sober |
| 3 | what is already live here: the interim module — examples, counters, place search (D4) | colour, ink — the page's one live-data anchor |
| 4 | the product: embed demo, position 1′ (TS-WEB-0008 D6) | colour |
| 5 | what it adds over the 480 € tier: territory cut, map view, `custom-data-integration` as the add-on (D6) | photo, `ratio-feature` |
| 6–7 | proof at this level (D7), then the quote CTA + response promise (D5) | colour |
| 8–9 | context band, closing CTA (TS-WEB-0006 D5/D6) | paper |
| — | contact section, rendered by the layout below the closing CTA (TS-WEB-0006 D2, DEC-0081) | its own fixed ground |

### D3 — The map story, told without a map [until January 2027, DEC-0061] [FIXED: DEC-0034; copy contract PROPOSED]

The argument: in a county nobody asks "what is on in Gemeinde X" but
"what is near me", thirty kilometres out, across municipal boundaries —
a chronological list cannot answer that, a map can.

| Rule | Detail |
| --- | --- |
| Nothing on the page depicts a map | no tile layer, no map library, no map image, no hatched `ratio-map` box, no "Karte folgt" caption. A placeholder shaped like a map promises a module that does not exist |
| The map is named as part of the **package**, not of the website | the page may say the licence includes a map view, from the offering package; it may not imply the visitor can see one here (A17) |
| The slot is reserved, the copy is map-ready | block 3 is one named slot; the map module later replaces the interim module inside it at `ratio-map` and the copy of blocks 2 and 3 does not change — that is the test of map-readiness (A16) |
| No distance language in the UI | "thirty kilometres" may appear in block 2 as the **visitor's question**, never as the scope of a module, filter, heading or result. TS-WEB-0005 D1 records the mismatch: administrative containment is the only measure, so a place 8 km away across a Kreisgrenze scores as *same state*. The page argues what the scoring cannot yet express, so every module labels itself by administrative scope only (TS-WEB-0008 D1) |

### D4 — The interim module [FIXED: DEC-0034, TS-WEB-0008 D1/D7/D8; cap and window PROPOSED]

| Part | Rule |
| --- | --- |
| Active example places (TS-WEB-0008 pos 3) | **never a full place list** — at county level or above no list is offered and no control expands to one. The set is capped at **6** [PROPOSED]: a designed set, not a truncated list. The block's label may claim no more than the data supports: these are examples, not a ranking of the most active places, because the activity signal is ours and approximate (below). What it says is copy (DEC-0083) |
| Live counters (TS-WEB-0008 pos 4) | a figure naming how many places in the county are already covered needs a places-per-scope count `/api/stats` does not have (TS-WEB-0008 D8, Q-0037). Until then only backed figures render, or the counter is absent — no estimate, no substitute. The sentence around the figure is copy (DEC-0083) |
| Place search (TS-WEB-0008 D7) | the answer to "and my place?". It is what makes the absence of a list legitimate, so it stands in this block, not in the header only |
| Ranking | TS-WEB-0005 orders the set and the page does not re-rank. **The activity signal is missing** — `/api/region/{county}/examples` has no upstream ranking operation (Q-0037). Interim [PROPOSED]: the BFF ranks by dates per place in the next **30 days**, from the county events search it already runs; our approximation, labelled as examples, replaced when the signal lands |
| Anchor | the chain of TS-WEB-0008 D3, nothing more: IP geolocation resolves to county (Q-0032), a place search sharpens it. Without an anchor no county name is asserted and the county-dependent parts do not render |
| Failure | TS-WEB-0008 D5 / TS-WEB-0009 D4: module omitted, no error styling, no retry control. The block never collapses, because the place search is static |

### D5 — The response promise and the condition for publishing it [FIXED: FUN-WEB-0022, TS-WEB-0006 D11; mechanism PROPOSED]

| Aspect | Determination |
| --- | --- |
| Condition | whether the lead handling can keep two working days is open (Q-0022, TS-WEB-0016 D4 C11). The promise ships **only** when C11 is answered: a named handling process with a named owner, recorded in the repository. Not "probably", not "usually" |
| Mechanism | one constant, one component; the constant is `null` while the condition is unmet and the component renders nothing on `null` [PROPOSED] |
| Where | exactly three places, all from that constant: at the CTA on `/deine-region`, at the form on `/deine-region/angebot`, and in the confirmation after submit — so they cannot disagree |
| If unmet | **removed, never softened.** No response-time wording of any kind on either route: a vaguer promise is still an unbacked promise |
| Widget missing | TS-WEB-0016 D6 applies — an email link plus the consult exit into the contact section; the promise stays withheld either way |

### D6 — Price: mentioned, never figured [FIXED: FUN-WEB-0020, TS-WEB-0018 D2/D3]

`portalize-enterprise` is `promoted` **and** `price_status: on-request`,
so `publishablePrice` is false: promoted buys the page and the CTA, not a figure.

| Case | Rule |
| --- | --- |
| Enterprise price | "auf Anfrage" from the price component: no figure, no range, no "ab", no order of magnitude, no arithmetic anchor against the 480 € tier |
| The 4000 in the build | the offering package ships the amount with the site (TS-WEB-0018 D3); this page is where a template mistake would print it, so the guard is asserted on this route (A4) |
| The 480 € comparison | permitted — it is `portalize-calendar`'s published price, read from its package by the same component, never typed into copy |
| `custom-data-integration` | `on-request-only`: mentioned as the add-on this buyer asks for, never priced, no CTA of its own |

### D7 — Proof at this level [FIXED: TS-WEB-0005 D5, FUN-WEB-0036; slot placement PROPOSED]

- Job fit outranks geography here (`w_job` 0.40 vs `w_geo` 0.20): a
  county decision-maker in Baden-Württemberg is better served by a
  delivered case than by a clipping from her own Kreis, so this page
  accepts far-away proof. Three inline slots (DEC-0048 count) beside the
  two claims that carry the sale — the territory claim (block 2) and
  "what it adds" (block 5) [PROPOSED].
- Proof comes from the engine, never from the offering's own `proof`
  list, which is the hub's assessment and not a second selector. An empty
  slot stays empty and the claim is weakened, not invented (five
  testimonials remain `usage_rights: unverified`, Q-0014). No reference
  case for a delivered territory exists, and none is simulated.

### D8 — Three audiences, one argument; metadata [FIXED: FUN-WEB-0009, CON-WEB-0012, TS-WEB-0011 D4, TS-WEB-0012 D4]

- No audience tabs, no "Landkreis / Stadt / Institution?" control, no
  segmented entry — this page is where the temptation is greatest and the
  rule is absolute (TS-WEB-0006 D8, TS-WEB-0018 D7). One argument for all three;
  examples differ in selection, not in structure. The route says `region`
  because their common denominator is geographic scope (DEC-0036 §4).
- `/deine-region` emits `Service` JSON-LD **without** `Offer` and without
  a price node — structured data cannot carry what the copy may not say;
  `/angebot` adds `BreadcrumbList`. Event payloads carry goal id and
  route, never a field value (TS-WEB-0016 D5).

## Free for the generator

- [FREE] Visual design and layout of every block, within the design
  system and TS-WEB-0002 — including which of blocks 2/5 takes the photo
  surface, given that no two photo sections are adjacent and block 3
  stays the single ink section.
- [FREE] How an example place is presented (row, chip, card), provided
  D4's cap and labelling hold; file organisation of the module, provided
  it stays one swappable slot (D3, A16); all copy, which the content
  phase writes.

## Acceptance criteria

| ID | Level | Check |
| --- | --- | --- |
| TS-WEB-0026-A1 | e2e | On `/deine-region` no map exists: no `<canvas>`, no map-library script, no image or placeholder box declared at `ratio-map`, no request to a tile host. |
| TS-WEB-0026-A2 | e2e | No heading, label, caption or button on either route states a distance or radius ("km", "Umkreis", "Entfernung") as the scope of a module or result; module headings name administrative scope only ("im Kreis …"). |
| TS-WEB-0026-A3 | e2e | Block 3 renders at most 6 example places, each labelled as an example; no control on the page expands to a full place list; the place search is present in the same block. The label asserts no ranking claim. |
| TS-WEB-0026-A4 | static | In the rendered HTML of both routes every currency token resolves to a `publishablePrice` amount; `4000` and its formatted variants are absent; the enterprise offering renders "auf Anfrage"; no range, "ab" or price-multiple construction occurs; no price string exists in a content source file. |
| TS-WEB-0026-A5 | e2e | The 480 € figure appears at most once, in the comparison block, and its node is produced by the price component reading `portalize-calendar`. |
| TS-WEB-0026-A6 | e2e | The primary CTA on `/deine-region` targets `/deine-region/angebot`; the closing block repeats the same goal id, target and label; the consult action sits beside it with the secondary treatment and resolves to this page's contact section, which renders once below the closing block. The section's first action row is the only element on either route carrying the appointment URL. |
| TS-WEB-0026-A7 | e2e | With the response-promise constant unset, no response-time wording appears on either route ("Werktage", "48 Stunden", "schnellstmöglich"). With it set, the identical string appears at the CTA, at the form and in the post-submit confirmation. |
| TS-WEB-0026-A8 | static | The response-time wording exists in exactly one module; a content lint fails on that wording in any content file. |
| TS-WEB-0026-A9 | integration | County examples route returns empty, then 500: the module is absent from the DOM in both cases, with no error styling, warning icon or retry control; the place search and the static copy of block 3 still render. |
| TS-WEB-0026-A10 | e2e | Stage 0 (no geolocation, no `?ort=`, no referrer): block 3 renders the place search, asserts no county name and shows no county-dependent counter; the block sequence is otherwise identical to the located render. |
| TS-WEB-0026-A11 | integration | Counters render only figures present in the upstream response; a stub omitting the places field omits the county counter entirely and substitutes no number. |
| TS-WEB-0026-A12 | e2e | The embed demo loads from the allowlisted Portalize host, is labelled as an example and sets no cookie; with the loader blocked the block's copy and CTA stay intact. |
| TS-WEB-0026-A13 | e2e | Submitting the quote form on `/deine-region/angebot` fires exactly one `request-licence-quote` event carrying that route. The in-page consult action fires nothing; the contact section's first action row fires exactly one `request-product-briefing` carrying the route it was rendered on. No payload contains a form field value. |
| TS-WEB-0026-A14 | e2e | No audience selector, tab, toggle or interstitial exists on either route; the same block structure renders for every entry path. |
| TS-WEB-0026-A15 | static | `page.meta.ts` for `/deine-region` matches D1 field by field, and the page emits `Service` JSON-LD with no `Offer` and no price property. |
| TS-WEB-0026-A16 | static | Map-readiness: blocks 2 and 3 contain no copy describing the examples as a permanent state, and the interim module is imported in exactly one place, so swapping it for the map module touches no content file. |
| TS-WEB-0026-A17 | manual | Before the page claims the map view as part of the package, the offering owner confirms it is shippable to a buyer. Unconfirmed → the claim is removed, not qualified. |

## Coverage

| Requirement | Discharged by |
| --- | --- |
| FUN-WEB-0016 (region page, focus job, quote conversion) | D1, D2, D6, D7, D8 · A4, A5, A6, A12, A13, A14, A15 |
| FUN-WEB-0022 (two-working-day response promise) | D5 · A7, A8 |
| FUN-WEB-0028 (region interim: examples, counters, search; no place lists; map-ready) | D3, D4 · A1, A2, A3, A9, A10, A11, A16, A17 |

Consumed, discharged elsewhere: FUN-WEB-0020 TS-WEB-0006 D10 / TS-WEB-0018 D3 ·
FUN-WEB-0040–046 TS-WEB-0008 · FUN-WEB-0036 TS-WEB-0005 · FUN-WEB-0090–093 TS-WEB-0016 · CON-WEB-0012/016 TS-WEB-0018.

### D3a — The map has a date; the tier has features [FIXED: DEC-0060, DEC-0061]

Corrected 2026-09-11 on two counts.

**The map ships January 2027** — Landkreis Rottweil bought it and goes
live then. Until it runs the page names it as a dated, forthcoming
feature and never as an existing one; DEC-0034's interim module carries
the page. When it ships the module is swapped, not rewritten.

**The tier is differentiated by features, not by territory.** What the
enterprise licence adds is the map view and a white-label registration
the customer embeds on their own site — not a larger area. The route
keeps its name because it describes who it addresses (DEC-0036 §4's
reasoning is corrected accordingly), but the argument on the page is
features.

## Open points

- **Q-0037 residual — this page's biggest dependency (events-api team).**
  Missing: a places-per-county count for the counter, and the
  events-per-place signal `/api/region/{county}/examples` ranks by. Until
  they land the counter is partial and the ranking is ours (D4).
- **Q-0022 / C11 gates the promise (envoy team + ops owner).** A named
  handling process, or the promise does not ship (D5) — answered before
  the content phase, not at release.
- **Does the package's map view actually ship? (offering owner.)** The
  offering's own open points record that its ship date was never
  confirmed. The map is this tier's distinguishing feature; if it is not
  shippable, D3's naming rule and block 5 both change. A17 blocks the
  claim until answered.
- **The distance mismatch (relevance-engine owner; Q-0038 to geo-api).**
  TS-WEB-0005 D1 has no distance tier, so "thirty kilometres across municipal
  boundaries" is an argument the scoring cannot express, and geo-api has
  no caller-supplied radius. Held for phase 1 by D3's no-distance rule.
- **Quote-form placement (TS-WEB-0016 owner).** TS-WEB-0016 D1 lists S2 on both
  routes while TS-WEB-0012 D4 attributes the completion to `/angebot`. D1 here
  resolves it as CTA-then-form; confirm, or move the widget onto
  `/deine-region` and re-point the event.
- **`equalWeightConversion` is the wrong word for the consult (TS-WEB-0006
  owner).** SRC-0003 names equal weight only for `/dein-kalender`, yet
  TS-WEB-0006 D9's check offers no other slot for a second goal the map assigns
  here. Either the manifest gains `secondaryConversion`, or the consult is
  equal weight here too. DEC-0082's ladder settles the *treatment* — the
  consult is secondary either way — and leaves only the manifest field
  open.
- **Two [PROPOSED] constants with no source (design + content owner):**
  the cap of 6 example places and the 30-day window of the interim
  ranking — both keep the block honest, neither is derived.
