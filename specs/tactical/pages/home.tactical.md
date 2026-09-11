---
artefact: tactical-spec
id: TS-019
profile: interaction
status: DRAFT
implements: [WEB-F-010]
sources: [SRC-001, SRC-003, SRC-014]
decisions: [DEC-048]
---

# TS-019 — Home `/`

## Purpose

The composition of one page: which blocks stand on `/`, in which order,
what each one is fed with, and how a QA walker verifies it. Everything
generic — block order, one primary conversion, context band, closing CTA,
scene shape — is TS-006 and is not repeated here. Everything about
routes, modules, proof, stages, metadata and events is owned by the
specs named in each determination.

`/` is the only page whose brief (SRC-003#home) makes the focus job a
runtime value and gives it **no conversion of its own**. That is the
whole problem this spec solves: which parts of the page vary, which
parts may not, and what the primary CTA is in each state.

## Determinations

### D1 — Page manifest for `/` [FIXED: SRC-003#home, WEB-F-010; field values PROPOSED]

Representation per TS-006 D1; this table fixes only the values.

| Field | Value on `/` |
| --- | --- |
| `focusJob` | `know-what-is-on` — the default of SRC-003#home, and the manifest value at every stage (D2) |
| `primaryConversion` | `save-calendar-to-homescreen` — the only goal the SRC-003 conversion map assigns to home |
| `equalWeightConversion` | none |
| `audiences` | all, ordered by entry context — the order is a runtime property of the proof stream (D4), not a second list |
| `liveModules` | place search · position 1 · position 2 · position 4 (TS-008 D1) |
| `proofSlots` | 5 (DEC-048) |

"No conversion of its own" (SRC-003) is discharged by the fact that the
declared goal belongs to the focus job, not to the page: home borrows
`/dein-ort`'s goal because it fulfils that job in place (TS-006 D4).

### D2 — Above-the-fold states [PROPOSED — see Open point 1]

Block 1 varies by **what is known about the place**, never by entry
trait. The trait orders blocks 2 (D3, D4); it does not redefine block 1,
the primary CTA, the context band or the closing CTA — the invariants of
TS-010 D7 hold on `/` like everywhere else.

| State | Precondition | Block 1 carries | Primary CTA | Goal |
| --- | --- | --- | --- | --- |
| S1 | no place known (stage 0 or stage 1 above community level, TS-010 D4) | place search as the dominant element | search submit | none — a search is not a conversion |
| S2 | place known and covered, ≥ 1 date in the window | place name + position 1 (3 dates) | open the calendar of `<place>` → app handover (TS-008 D9) | `save-calendar-to-homescreen` |
| S3 | place known and covered, 0 dates | position 2 under its own radius label + the publisher invitation | publish the first date | `register-as-publisher` |
| S4 | a search resolved to an uncovered place | nothing — the search navigates away (TS-008 D7) | `/dein-ort/starten?ort=` | carried by that page |

S1 is what is prerendered and what a crawler and a JS-less visitor get
(TS-010 D8). S2 and S3 arrive by island. S3 shows the invitation without
re-implementing the `/dein-ort` focus-job shift: on `/` the shift stays
a link, on `/dein-ort` it is the page (TS-008 D4) — Open point 2.

### D3 — Block sequence [FIXED: SRC-003#home structure, TS-006 D2; section types SRC-014 "Page Rhythm"]

| # | Block | Content | Fed by | Rhythm section |
| --- | --- | --- | --- | --- |
| 1 | focus | D2 | TS-008 D7 (search), D1 pos 1 | PHOTO hero, then COLOUR ink for the live dates |
| 2a | scenes | exactly three, order per D3a | content (TS-007) + one live instance each | COLOUR / PHOTO, alternating per SRC-014 |
| 2b | provenance | the "who built this" stamps | content | COLOUR violet |
| 2c | proof stream | 5 elements | TS-005 (D4 below) | COLOUR / PHOTO cards |
| 2d | counters | position 4 | TS-008 D8 | inline in 2b or 2c, no section of its own |
| 3 | context band | the three non-focus jobs | TS-006 D5, job registry | COLOUR paper |
| 4 | closing CTA | identical to the block-1 primary (TS-006 D6) | — | COLOUR paper |

Blocks 3 and 4 are rendered by the layout, not by this page.

### D3a — Scene order by entry trait [PROPOSED — from the SRC-002 context matrix via TS-010 D3]

Three scenes, one mechanism each (TS-006 D7):
`whatsapp` → flyer to calendar · `embed` → own event calendar on your
website · `provenance` → who built this.

| Trait (TS-010 D3) | Scene order |
| --- | --- |
| `direct`, `social`, `print-qr`, `reader-search`, `activated` | whatsapp · embed · provenance |
| `professional`, `purchase-intent` | embed · provenance · whatsapp |
| `press` | provenance · whatsapp · embed |

Ordering only. No trait adds, removes or rewrites a scene, and each
scene keeps its own CTA at secondary treatment (TS-006 D3).

### D4 — Proof stream [FIXED: DEC-048; profile TS-005 D5]

- Exactly **5** elements (DEC-048), never fewer by design — an empty
  slot means an uncleared proof and weakens the claim, it does not
  shorten the stream (SRC-001 §4).
- Weight profile: the profile of `know-what-is-on` (TS-005 D5). At stage
  0, `w_geo = 0` and DEC-048's redistribution applies.
- Selection, ordering, determinism, rotation and the cache key are
  TS-005 D5–D8 and TS-009 D3 (`{community, trait, job, isoWeek}`). This
  page fixes the count and the profile, nothing else.

### D5 — Live modules and their failure behaviour [FIXED: TS-008 D1, TS-009 D3]

| Module | BFF route (TS-004 D5) | On `/` |
| --- | --- | --- |
| place search | `/api/places/search` | block 1, S1; shell + client, works without JS |
| position 1 — dates in the place | `/api/places/{slug}/events` | block 1, S2; cached island |
| position 2 — this week nearby | `/api/nearby` | block 1, S3; cached island |
| position 4 — live counters | `/api/stats` | block 2d; today only the *dates* figure renders (TS-008 D8, Q-037) |

Emptiness, staleness and failure are three different things (TS-008 D5);
the tier chain, the "Stand: …" label and the skeleton geometry are
TS-009 D4/D5/D7. `/` adds no case of its own.

### D6 — Metadata and structured data [FIXED: TS-011 D4, D5]

`/` is the site root node: `WebSite` + `Organization` as the full JSON-LD
graph, `@id` = site root; every other page references it. Title is
brand-first per TS-011 D5. The live dates in block 1 are **not** marked
up as `Event` (TS-011 D4) — event markup belongs to the app.

### D7 — Measurement [FIXED: TS-012 D4]

One conversion event on this page: `save-calendar-to-homescreen`, stage
`handover`, fired once on the click that opens a place calendar on
`app.*` (S2). Place slug is a permitted attribute. A search submit, a
scene click and a context-band click emit nothing — they are navigation,
not conversion.

## Free for the generator

- [FREE] Visual design of every block within SRC-014 and TS-002 — this
  spec fixes order, count and data, not appearance.
- [FREE] Whether block 1's two shapes (S1 search, S2/S3 place) are one
  component with two states or two components, as long as the reserved
  space is identical so no state swap shifts layout (SRC-014).
- [FREE] Component and file naming; where block 2d's counters sit inside
  2b or 2c.
- [FREE] All copy. The content phase writes it (repository working rule 4).

## Acceptance criteria

| ID | Level | Check |
| --- | --- | --- |
| TS-019-A1 | static | The manifest of `/` carries exactly the D1 values: `focusJob` = `know-what-is-on`, `primaryConversion` = `save-calendar-to-homescreen`, no `equalWeightConversion`, four live modules, `proofSlots` = 5. |
| TS-019-A2 | e2e | Open `/` in a fresh private window, deny the geolocation prompt, send no `?ort=` and no referrer. The first screen shows a search input; exactly one element on the page carries `data-cta="primary"` and it is that search's submit; no element in the first screen links to another page to "see what is on". |
| TS-019-A3 | e2e | Open `/?ort=<covered place with dates>`. Block 1 shows the place name and exactly 3 event rows; the primary CTA opens the place calendar on `app.*` and carries the place slug. |
| TS-019-A4 | e2e | Open `/?ort=<covered place with no dates>`. Block 1 shows the nearby module under a heading that names its radius (not the place), plus a publish-the-first-date CTA targeting the registration route. No text claims dates in that place. |
| TS-019-A5 | e2e | Type an uncovered place into the search on `/` and submit. The browser navigates to `/dein-ort/starten?ort=…`; `/` itself renders no uncovered place as data. |
| TS-019-A6 | e2e | Count scene blocks on `/`: exactly 3, each with exactly one `mechanism` of `whatsapp` · `embed` · `provenance`, each opener in question form. |
| TS-019-A7 | e2e | Load `/` once with `Referer: https://www.linkedin.com/` and once with no referrer. Scene DOM order matches the D3a table for `professional` and for `direct` respectively; block set and block order are otherwise identical between the two loads. |
| TS-019-A8 | e2e | The proof stream on `/` renders exactly 5 elements in every one of the loads of A7 and A2. |
| TS-019-A9 | e2e | DOM order on `/` is: block 1 · scenes · provenance · proof stream · context band · closing CTA, with nothing but the global footer after the closing CTA. |
| TS-019-A10 | e2e | The context band on `/` names exactly the three jobs that are not `know-what-is-on`; the closing CTA carries the same conversion goal ID, target and label as the block-1 primary of the current state. |
| TS-019-A11 | e2e | Disable JavaScript and load `/`. The page is complete: search present, 3 scenes, 5 proof elements, context band, closing CTA; no skeleton and no empty box remains. |
| TS-019-A12 | static | The JSON-LD graph of `/` contains one `WebSite` and one full `Organization` node and no `Event` node; no other page emits a second full `Organization`. |
| TS-019-A13 | e2e | With the analytics collector observed: the calendar-open click of A3 emits `save-calendar-to-homescreen` with `stage=handover` exactly once; the search submit of A2, a scene click and a context-band click emit no conversion event. |
| TS-019-A14 | e2e | The counter block on `/` renders only the dates figure; no places figure, no updates-today figure, and no static traction number anywhere on the page. |
| TS-019-A15 | manual | The eight-point compliance check of SRC-001 passes for the home brief, with point 8 (stage 0 complete on its own) evidenced by A2 and A11. |

## Coverage

| Requirement | Aspect discharged here | Discharged by | Owned elsewhere |
| --- | --- | --- | --- |
| WEB-F-010 (`/` exists, focus job set by entry context with default "know what is on", primary conversion = the focus job's CTA, none of its own) | the **composition**: manifest values, above-the-fold states, block sequence, scene and proof counts, module set, page-level metadata and the single event | D1–D7 · A1–A15 | the **route** `/` itself — its place in the URL inventory, its rendering layer, navigation and the link facade: TS-004 D1/D2/D4/D6. The generic composition rules it obeys: TS-006 D2–D7. Module behaviour: TS-008. Proof selection: TS-005. Stage resolution: TS-010. |

## Open points

- **Does the entry trait change the focus job, or only the order?**
  SRC-003#home says the focus job is "set by entry context"; SRC-001 §6
  and TS-010 D7 forbid a stage from changing a focus job, and the
  SRC-003 conversion map assigns home only `save-calendar-to-homescreen`
  — so a trait-swapped focus job would make home declare goals the map
  does not give it (TS-006 D9). D1/D2 reconcile them by reading "set by
  entry context" as ordering. **Answered by:** the concept owner
  (jan-henrik), by amending SRC-003#home or the conversion map.
- **Covered place with no dates on `/`.** TS-008 D4 names `/dein-ort` as
  the site's single runtime focus-job change. D2 S3 therefore keeps `/`
  at an invitation plus the nearby module. Is that right, or does the
  shift fire on `/` as well? **Answered by:** the owner of TS-008,
  together with SRC-003.
- **Mechanism vocabulary for the third scene.** TS-006 D7 requires
  exactly one mechanism per scene; "who built this" has none in the
  sense of WhatsApp or embed. D3a proposes `provenance`. **Answered by:**
  the owner of TS-006, when the mechanism vocabulary is registered.
- **Scene order per trait is inferred.** The SRC-002 context matrix fixes
  the starting *proof type* per entry, not a scene order; D3a maps it
  across. **Answered by:** gtm, by extending the matrix with a scene
  column — or by confirming the mapping.
- **Place search accepts ZIP only until Q-025.** S1 is the dominant
  element of the whole page, so the restriction is visible in the hero
  placeholder. Blocked on Q-025 (geo-api name search); the wording is a
  content-phase task once it resolves.
- **Q-044 blocks generation of this page.** Proof card and stream, the
  live-module shells and the context band are not in SRC-014's six
  specified components, and no component declares what it renders.
  **Answered by:** design, via the component manifest.
