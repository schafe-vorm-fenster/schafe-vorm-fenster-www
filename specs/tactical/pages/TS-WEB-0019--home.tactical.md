---
artefact: tactical-spec
id: TS-WEB-0019
kind: interaction
status: DRAFT
version: 0.1.0
implements: [FUN-WEB-0010]
sources: [SRC-0001, SRC-0003, SRC-0014]
decisions: [DEC-0048, DEC-0081, DEC-0082, DEC-0105, DEC-0109, DEC-0110, DEC-0129]
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-11T07:13:07+02:00"
---

# TS-WEB-0019 — Home `/`

## Purpose

The composition of one page: which blocks stand on `/`, in which order,
what each one is fed with, and how a QA walker verifies it. Everything
generic — block order, one primary conversion, context band, closing CTA,
scene shape — is TS-WEB-0006 and is not repeated here. Everything about
routes, modules, proof, stages, metadata and events is owned by the
specs named in each determination.

`/` is the only page whose brief (SRC-0003#home) makes the focus job a
runtime value and gives it **no conversion of its own**. That is the
whole problem this spec solves: which parts of the page vary, which
parts may not, and what the primary CTA is in each state.

## Determinations

### D1 — Page manifest for `/` [FIXED: SRC-0003#home, FUN-WEB-0010; field values PROPOSED]

Representation per TS-WEB-0006 D1; this table fixes only the values.

| Field | Value on `/` |
| --- | --- |
| `focusJob` | `know-what-is-on` — the default of SRC-0003#home, and the manifest value at every stage (D2) |
| `primaryConversion` | `save-calendar-to-homescreen` — the only goal the SRC-0003 conversion map assigns to home |
| `equalWeightConversion` | none |
| `audiences` | all, ordered by entry context — the order is a runtime property of the proof stream (D4), not a second list |
| `liveModules` | place search · position 1 · position 2 · position 4 (TS-WEB-0008 D1) |
| `proofSlots` | 5 (DEC-0048) |

"No conversion of its own" (SRC-0003) is discharged by the fact that the
declared goal belongs to the focus job, not to the page: home borrows
`/dein-ort`'s goal because it fulfils that job in place (TS-WEB-0006 D4).

### D2 — Above-the-fold states [PROPOSED — see Open point 1]

Block 1 varies by **what is known about the place**, never by entry
trait. The trait orders blocks 2 (D3, D4); it does not redefine block 1,
the primary CTA, the context band or the closing CTA — the invariants of
TS-WEB-0010 D7 hold on `/` like everywhere else.

| State | Precondition | Block 1 carries | Primary CTA | Goal |
| --- | --- | --- | --- | --- |
| S1 | no place known (stage 0 or stage 1 above community level, TS-WEB-0010 D4) | place search as the dominant element | search submit | none — a search is not a conversion |
| S2 | place known and covered, ≥ 1 date in the window | place name + position 1 (3 dates) | open the calendar of `<place>` → app handover (TS-WEB-0008 D9) | `save-calendar-to-homescreen` |
| S3 | place known and covered, 0 dates | position 2 under its own radius label + the publisher invitation | publish the first date | `register-as-publisher` |
| S4 | a search resolved to an uncovered place | nothing — the search navigates away (TS-WEB-0008 D7) | `/dein-ort/starten?ort=` | carried by that page |

S1 is what is prerendered and what a crawler and a JS-less visitor get
(TS-WEB-0010 D8). S2 and S3 arrive by island. S3 shows the invitation without
re-implementing the `/dein-ort` focus-job shift: on `/` the shift stays
a link, on `/dein-ort` it is the page (TS-WEB-0008 D4) — Open point 2.

**Where the boundary runs** (DEC-0078). The place is a request value, so the
part of block 1 that varies with it arrives through `<Suspense>` — that is
what keeps `/` a prerendered route. What may sit inside that boundary is
bounded by TS-WEB-0009 D2's last rule: never a control that holds what a visitor
types. So the hero's photograph, its kicker and the **whole search module**
are the prerendered shell, and three small boundaries carry the rest — the
headline · lead · CTA trio, the search's submit button (because
`data-cta="primary"` moves from it to the hero CTA between S1 and S2/S3,
and an attribute cannot be streamed on its own), and the module slot. Each
boundary renders its fallback and its resolved branch through the same
component, which is how the "identical reserved space" below is held.

### D3 — Block sequence [FIXED: SRC-0003#home structure, TS-WEB-0006 D2; section types SRC-0014 "Page Rhythm"]

| # | Block | Content | Fed by | Rhythm section |
| --- | --- | --- | --- | --- |
| 1 | focus | D2 | TS-WEB-0008 D7 (search), D1 pos 1 | PHOTO hero, then COLOUR ink for the live dates |
| 2a | mechanism blocks | exactly three, one per mechanism, order per D3a — **three scene blocks, one of which contains the explain module** (D3a, DEC-0109, DEC-0110) | content (TS-WEB-0007) + one live instance each, the module's standing below it (TS-WEB-0006 D7) | COLOUR / PHOTO, alternating per SRC-0014. Three scene blocks are three ordinary rhythm sections, so the alternation is exactly the constraint it was before DEC-0109 and is satisfiable in any D3a order |
| 2b | provenance | the provenance **scene** — the third scene of 2a is this block. It was "the who-built-this stamps" until 2026-09-26: the origin sentence that stood apart as its own stamp element is struck by the 2026-09-22 owner review, and `SRC-0017` CG-033/CG-040 put "gebaut" and "betrieben" about this product on the avoid list, so there is nothing left for a second element to carry (DEC-0129 §5). Amended, not moved: the block keeps this position, this ground and its way to `/ueber-uns` | content | COLOUR violet |
| 2c | proof stream | 5 elements | TS-WEB-0005 (D4 below) | COLOUR / PHOTO cards |
| 2d | counters | position 4 | TS-WEB-0008 D8 | inline in 2b or 2c, no section of its own |
| 3 | context band | the three non-focus jobs | TS-WEB-0006 D5, job registry | COLOUR paper |
| 4 | closing CTA | identical to the block-1 primary (TS-WEB-0006 D6) | — | COLOUR paper |

Blocks 3 and 4 are rendered by the layout, not by this page.

### D3a — Three mechanism blocks, their order by entry trait, and which one contains the explain module [order PROPOSED — from the SRC-0002 context matrix via TS-WEB-0010 D3; the block types FIXED: DEC-0109, DEC-0110]

Three blocks, one mechanism each: `whatsapp` → flyer to calendar ·
`embed` → own event calendar on your website · `provenance` → who built this.

**All three are scene blocks, and one of them contains the explain module**
(DEC-0109 §1 for which one, DEC-0110 §1–§2 for the containment — the owner's
answers to Q-0079 and Q-0080):

| Mechanism | Block type | What renders the mechanism |
| --- | --- | --- |
| `whatsapp` | `scene-block`, shape per TS-WEB-0006 D7 | the `explain-module` of TS-WEB-0022 D4 and SRC-0014, **inside** the scene — unchanged as a component, not forked for this page. The scene's opener stands above it, the block's concrete instance (the live event row) below it |
| `embed` | `scene-block`, shape per TS-WEB-0006 D7 | the scene's own mechanism treatment |
| `provenance` | `scene-block`, shape per TS-WEB-0006 D7 | the scene's own mechanism treatment |

Why that one: the WhatsApp path really is a path in steps, it lets an organiser
see how simple publishing is without leaving the page, and "who built this" has
no three steps — forcing the component onto it would mint three invented ones.

**Why it is wrapped rather than substituted** (DEC-0110). The module is `/`'s
job introduction for publishing, because this page has no WhatsApp hero to be
it instead, and TS-WEB-0006 D7 holds on every page without exception: an opener
that is a statement, one mechanism, one concrete instance. A bare module carries
only the middle one, and the instance is the live event row this block already
owns. So the scene stays and the module fills its mechanism slot. The count of
scene blocks on `/` is **three** — it was stated as two between DEC-0109 and
DEC-0110 on 2026-09-25, and that framing is withdrawn.

| Trait (TS-WEB-0010 D3) | Block order | The module is |
| --- | --- | --- |
| `direct`, `social`, `print-qr`, `reader-search`, `activated` | whatsapp · embed · provenance | first |
| `professional`, `purchase-intent` | embed · provenance · whatsapp | **last** |
| `press` | provenance · whatsapp · embed | middle |

Ordering only. No trait adds, removes or rewrites a block, and **no trait
changes which mechanism carries the module** — the module travels with the
`whatsapp` scene.

**So the module has to work in any of the three positions, including last.**
What that means here, in full (DEC-0109 §2):

| Constraint | In every position |
| --- | --- |
| Section rhythm | the module declares **no ground of its own** — SRC-0014's one meaning-bearing ground is the contact section's and this is not it — so its ground is picked like a scene's and the alternation rules hold wherever it sits |
| "Never two photo sections in a row" | **neither tightened nor loosened.** The *module* is never a PHOTO section — its stage is a graphic at `ratio-square`, not a photograph — but the scene that wraps it is an ordinary scene and may be one, so block 2a offers the generator the same three candidates it did before DEC-0109. DEC-0109 §2 read the rule off the module because the module was then the block; under DEC-0110 the block is a scene and the module is its middle, so the claim that the `whatsapp` block "separates the two image-led scenes" no longer holds and is withdrawn. Nothing is harder: the constraint is the pre-DEC-0109 one |
| One `himbeere` per screen | unaffected — the active step is `lime-500` on a light ground |
| The two `ink` sections | unaffected: block 1's live dates and the closing search block, with the whole of 2a between them in every order |
| One viewport below `lg` | holds identically in all three positions, because it is a property of the **module**, not of its slot. The module does not grow into an early position and does not shrink in the last one. It is the module plus its three step lines that must fit — **not** the wrapping scene, whose opener above and instance below are outside that budget (TS-WEB-0022 D4, SRC-0017 CG-025) |
| The fold | not in play. The page's one primary is block 1's (D2, TS-WEB-0006-A3) and 2a starts below the fold in every state; the module's CTA is `secondary` by definition, fixed by the design-system contract as a value rather than a default |
| The `lg` switch and the motion exception | the component's own and unchanged (TS-WEB-0022 D4, DEC-0105 §6 as amended twice on 2026-09-25). The advance **starts on the first intersection at which three quarters of the module are in the viewport** — `threshold: 0.75` on the module element, three quarters of the module's own height — gives state 1 a full dwell, runs one 9.1 s pass and stops at state 3; any interaction ends it for good. Worked through in all three positions below — no position makes the trigger unreachable, and in none of them does the page load start it. The fraction is a property of the module, so it changes nothing in the matrix below except that the trigger is now reachable at 360 × 640 too |

**The trigger, in each of the three positions** [FIXED: DEC-0105 §6 as amended].
The advance starts on the first intersection at which three quarters of the
module are inside the viewport and runs once; what the trait matrix does to that
is the question Q-0081 left for this spec, and the answer is nothing:

| The module is | What the trigger does | Why |
| --- | --- | --- |
| **first** (`direct`, `social`, `print-qr`, `reader-search`, `activated`) | does not fire at load | block 2a begins below the fold in every state of D2 (DEC-0109 §2), so below `lg` no three quarters of the module are on screen at first paint. The rule "not on page load" and the first position do not collide — the geometry already separates them, and it separates them by more at 0.75 than the module's own height would suggest, because 2a starts below the fold and not merely low in it |
| **middle** (`press`) | fires when the reader reaches it | nothing between the two image-led scenes changes the module's own height or its visibility condition |
| **last** (`professional`, `purchase-intent`) | fires when the reader reaches it | the module is the third block of **2a**, not the last block of the page: 2b's provenance stamps, 2c's five proof elements, the context band and the closing CTA all stand below it (D3), so it can always be scrolled entirely into view with content still beneath it. It is never the last block before the closing CTA |

Two edges, both decided rather than left open:

- **A single-step jump to the end of the document starts nothing, and that is
  correct.** An `IntersectionObserver` reports only a *change* of
  `isIntersecting`, so a flick to the bottom can carry the module from below the
  viewport to above it with no callback — the mechanic finding F-3-10 already
  documents in `e2e/motion-reveal.spec.ts`. No pass runs, and none is spent: "once
  per page view" is spent by a pass that **started**, so the first moment the
  module is genuinely in the viewport — after a scroll back up, say — still starts
  its one pass (DEC-0105 §6).
- **A viewport shorter than the module** could not satisfy the trigger at all
  while the trigger was "the whole module", and the case is reachable on every
  position equally — it is a property of the module and the viewport, not of the
  slot. **Answered 2026-09-25 by the owner (DEC-0105 §6, second amendment):** the
  fraction is three quarters of the module's own height, which fires at 360 × 640
  as well as at 360 × 800, so the `[PROPOSED]` short-viewport fallback is
  withdrawn and no position needs one. `Q-0083` is closed. The residue is
  direction, not height: entering the module from above, the quarter that is
  outside the viewport is the top quarter, where the graphic stage is, and that is
  **Q-0084**.

**Each of the three blocks carries exactly one CTA, at secondary treatment,
pointing at the page that owns its job** [FIXED: DEC-0082 §4] — `whatsapp` and
`embed` at `/mitmachen` and `/dein-kalender`, `provenance` at `/ueber-uns`. None
of them carries `data-cta="primary"`: the page's one primary stays block 1's
search or place module (D2, TS-WEB-0006 D4), and such a CTA is a link, not a
conversion declaration (TS-WEB-0006 D9). For the module this is not a page rule
but the component's own — `explain-module` may not take `primary` even as a prop
value (design-system contract). What the label says is copy (SRC-0017 CG-026).

**Wrapping does not double the CTA** [FIXED: DEC-0110 §1]. The `whatsapp` block
carries **one** CTA and it is the module's own, at the module's bottom. The scene
adds none: "exactly one CTA per block" counts the block, and the module is inside
the block. The block's render order is therefore opener · module (ordinal, title,
stage or step row, step lines, CTA) · concrete instance — the owner's answer
fixes the opener above the module and the instance below it, and the CTA's place
inside the module is the component's and unchanged.

### D4 — Proof stream [FIXED: DEC-0048; profile TS-WEB-0005 D5]

- Exactly **5** elements (DEC-0048), never fewer by design — an empty
  slot means an uncleared proof and weakens the claim, it does not
  shorten the stream (SRC-0001 §4).
- Weight profile: the profile of `know-what-is-on` (TS-WEB-0005 D5). At stage
  0, `w_geo = 0` and DEC-0048's redistribution applies.
- Selection, ordering, determinism, rotation and the cache key are
  TS-WEB-0005 D5–D8 and TS-WEB-0009 D3 (`{community, trait, job, isoWeek}`). This
  page fixes the count and the profile, nothing else.

### D5 — Live modules and their failure behaviour [FIXED: TS-WEB-0008 D1, TS-WEB-0009 D3]

| Module | BFF route (TS-WEB-0004 D5) | On `/` |
| --- | --- | --- |
| place search | `/api/places/search` | block 1, S1; shell + client, works without JS |
| position 1 — dates in the place | `/api/places/{slug}/events` | block 1, S2; cached island |
| position 2 — this week nearby | `/api/nearby` | block 1, S3; cached island |
| position 4 — live counters | `/api/stats` | block 2d; today only the *dates* figure renders (TS-WEB-0008 D8, Q-0037) |

Emptiness, staleness and failure are three different things (TS-WEB-0008 D5);
the tier chain, the "Stand: …" label and the skeleton geometry are
TS-WEB-0009 D4/D5/D7. `/` adds no case of its own.

### D6 — Metadata and structured data [FIXED: TS-WEB-0011 D4, D5]

`/` is the site root node: `WebSite` + `Organization` as the full JSON-LD
graph, `@id` = site root; every other page references it. Title is
brand-first per TS-WEB-0011 D5. The live dates in block 1 are **not** marked
up as `Event` (TS-WEB-0011 D4) — event markup belongs to the app.

### D7 — Measurement [FIXED: TS-WEB-0012 D4]

One conversion event on this page: `save-calendar-to-homescreen`, stage
`handover`, fired once on the click that opens a place calendar on
`app.*` (S2). Place slug is a permitted attribute. A search submit, a
scene click and a context-band click emit nothing — they are navigation,
not conversion.

## Free for the generator

- [FREE] Visual design of every block within SRC-0014 and TS-WEB-0002 — this
  spec fixes order, count and data, not appearance.
- [FREE] Whether block 1's two shapes (S1 search, S2/S3 place) are one
  component with two states or two components, as long as the reserved
  space is identical so no state swap shifts layout (SRC-0014) — and as
  long as the search field itself is in neither branch but in the
  prerendered shell (D2 above, TS-WEB-0009 D2, DEC-0078).
- [FREE] Component and file naming; where block 2d's counters sit inside
  2b or 2c.
- [FREE] All copy. The content phase writes it (repository working rule 4).

## Acceptance criteria

| ID | Level | Check |
| --- | --- | --- |
| TS-WEB-0019-A1 | static | The manifest of `/` carries exactly the D1 values: `focusJob` = `know-what-is-on`, `primaryConversion` = `save-calendar-to-homescreen`, no `equalWeightConversion`, four live modules, `proofSlots` = 5. |
| TS-WEB-0019-A2 | e2e | Open `/` in a fresh private window, deny the geolocation prompt, send no `?ort=` and no referrer. The first screen shows a search input; exactly one element on the page carries `data-cta="primary"` and it is that search's submit; no element in the first screen links to another page to "see what is on". |
| TS-WEB-0019-A3 | e2e | Open `/?ort=<covered place with dates>`. Block 1 shows the place name and exactly 3 event rows; the primary CTA opens the place calendar on `app.*` and carries the place slug. |
| TS-WEB-0019-A4 | e2e | Open `/?ort=<covered place with no dates>`. Block 1 shows the nearby module under a heading that names its radius (not the place), plus a publish-the-first-date CTA targeting the registration route. No text claims dates in that place. |
| TS-WEB-0019-A5 | e2e | Type an uncovered place into the search on `/` and submit. The browser navigates to `/dein-ort/starten?ort=…`; `/` itself renders no uncovered place as data. |
| TS-WEB-0019-A6 | e2e | Block 2a of `/` holds exactly 3 blocks, one `mechanism` each of `whatsapp` · `embed` · `provenance`, and each with exactly one CTA carrying `data-cta="secondary"` that resolves to the page owning its job (D3a). **All 3 declare `data-block="scene"`**, and **exactly 1 of them contains the explain module** — the `whatsapp` one: inside that scene, and in this DOM order, stand the scene opener, one `explain-module` with one ordinal and exactly three step lines (each step line a real button carrying `aria-current` on the active one), and the block's one concrete instance, a live event row. At 360 × 800 the module and its three step lines fit one viewport height; the wrapping scene is not held to that budget (TS-WEB-0022 D4, DEC-0110 §1). The other two scenes render no step lines and no module, and the `whatsapp` block's single `data-cta="secondary"` is the module's own — wrapping adds no second CTA. Every scene opener, this one included, is a statement: it carries no question mark unless the same block renders the answering sentence directly beneath it (TS-WEB-0006 D7, SRC-0017 CG-005/CG-006). The count of scenes was 3, was stated as 2 by DEC-0109 on 2026-09-25, and is 3 again under DEC-0110 — the module is inside a scene, not instead of one. |
| TS-WEB-0019-A7 | e2e | Load `/` once with `Referer: https://www.linkedin.com/` and once with no referrer. Block-2a DOM order matches the D3a table for `professional` and for `direct` respectively — so the scene containing the explain module is **last** in the first load and **first** in the second — and in both it is the `whatsapp` scene, renders the same opener · module · instance triple with the same three step lines, and satisfies A6's one-viewport assertion in either position (DEC-0109 §2, DEC-0110 §2). Block set and block order are otherwise identical between the two loads, all three blocks stay scenes in both, and no trait changes which mechanism carries the module. |
| TS-WEB-0019-A8 | e2e | The proof stream on `/` renders exactly 5 elements in every one of the loads of A7 and A2. |
| TS-WEB-0019-A9 | e2e | DOM order on `/` is: block 1 · block 2a (the three scenes, one of them wrapping the explain module, in the D3a order for the load's trait — the **last** of them is block 2b, the provenance scene, and it carries D3's `violet-500` ground so the block cannot quietly stop being 2b) · proof stream · context band · closing CTA · contact section, with nothing but the global footer after the contact section (TS-WEB-0006-A17). This list named "provenance stamps" as a DOM position of its own until 2026-09-26; the stamp element is gone with the sentence it carried and block 2b is the scene (D3 row 2b as amended, DEC-0129 §5). |
| TS-WEB-0019-A10 | e2e | The context band on `/` names exactly the three jobs that are not `know-what-is-on`; the closing CTA carries the same conversion goal ID, target and label as the block-1 primary of the current state. |
| TS-WEB-0019-A11 | e2e | Disable JavaScript and load `/`. The page is complete: search present, all 3 blocks of 2a — three scenes, the `whatsapp` one showing its opener, its module at state 1 with all three step lines (the reduced-motion fallback already requires that state, DEC-0105 §6) and its live event row beneath — 5 proof elements, context band, closing CTA; no skeleton and no empty box remains. |
| TS-WEB-0019-A12 | static | The JSON-LD graph of `/` contains one `WebSite` and one full `Organization` node and no `Event` node; no other page emits a second full `Organization`. |
| TS-WEB-0019-A13 | e2e | With the analytics collector observed: the calendar-open click of A3 emits `save-calendar-to-homescreen` with `stage=handover` exactly once; the search submit of A2, a scene click and a context-band click emit no conversion event. |
| TS-WEB-0019-A14 | e2e | The counter block on `/` renders only the dates figure; no places figure, no updates-today figure, and no static traction number anywhere on the page. |
| TS-WEB-0019-A15 | manual | The eight-point compliance check of SRC-0001 passes for the home brief, with point 8 (stage 0 complete on its own) evidenced by A2 and A11. |
| TS-WEB-0019-A16 | e2e | Open `/` (and `/en`) over a throttled document so the streamed branch is still on the wire at first paint, and type a place name into the hero search with real key events as soon as the field exists. After the page settles the field still carries the typed value and its submit lands on the place route with it; across the load exactly **one** element ever carries the field's id. The same holds on every other route with a place search. |

## Coverage

| Requirement | Aspect discharged here | Discharged by | Owned elsewhere |
| --- | --- | --- | --- |
| FUN-WEB-0010 (`/` exists, focus job set by entry context with default "know what is on", primary conversion = the focus job's CTA, none of its own) | the **composition**: manifest values, above-the-fold states, block sequence, scene and proof counts, module set, page-level metadata and the single event | D1–D7 · A1–A16 | the **route** `/` itself — its place in the URL inventory, its rendering layer, navigation and the link facade: TS-WEB-0004 D1/D2/D4/D6. The generic composition rules it obeys: TS-WEB-0006 D2–D7. Module behaviour: TS-WEB-0008. Proof selection: TS-WEB-0005. Stage resolution: TS-WEB-0010. |

## Open points

- **Does the entry trait change the focus job, or only the order?**
  SRC-0003#home says the focus job is "set by entry context"; SRC-0001 §6
  and TS-WEB-0010 D7 forbid a stage from changing a focus job, and the
  SRC-0003 conversion map assigns home only `save-calendar-to-homescreen`
  — so a trait-swapped focus job would make home declare goals the map
  does not give it (TS-WEB-0006 D9). D1/D2 reconcile them by reading "set by
  entry context" as ordering. **Answered by:** the concept owner
  (jan-henrik), by amending SRC-0003#home or the conversion map.
- **Covered place with no dates on `/`.** TS-WEB-0008 D4 names `/dein-ort` as
  the site's single runtime focus-job change. D2 S3 therefore keeps `/`
  at an invitation plus the nearby module. Is that right, or does the
  shift fire on `/` as well? **Answered by:** the owner of TS-WEB-0008,
  together with SRC-0003.
- **Mechanism vocabulary for the third scene.** TS-WEB-0006 D7 requires
  exactly one mechanism per scene; "who built this" has none in the
  sense of WhatsApp or embed. D3a proposes `provenance`. **Answered by:**
  the owner of TS-WEB-0006, when the mechanism vocabulary is registered.
- **Scene order per trait is inferred.** The SRC-0002 context matrix fixes
  the starting *proof type* per entry, not a scene order; D3a maps it
  across. **Answered by:** gtm, by extending the matrix with a scene
  column — or by confirming the mapping.
- ~~**Search scope on the page's dominant element (Q-0071).**~~ **Answered**
  by the DEC-0079 amendment of 2026-09-24: suggestions come from the covered
  communities, a name outside them yields none and submits to
  `/dein-ort/starten` (S4), and Germany-wide finding by name is the target
  carried by Q-0025. The page's copy never depended on it, because no
  surface of the field states a limit; it stays that way if the store
  changes.
- ~~**Does the explain module belong on this page?**~~ **Answered 2026-09-25 by
  the owner, recorded as `DEC-0109`**: one of the three blocks of 2a is the
  explain module — the `whatsapp` one — and the other two stay scenes. `D3` and
  `D3a` carry it, and the guide's *"reused unchanged on `/`"* is narrowed to
  what is true. `Q-0079` is closed.
- ~~**`TS-WEB-0006 D7` says every job introduction on every page is a scene
  block, and on this page one of them is not.**~~ **Answered 2026-09-25 by the
  owner, recorded as `DEC-0110`: the scene wraps the module.** Neither candidate
  in `Q-0080` was taken — `D7` gains no exception and the component gains no
  slots. The opener stands above the module, the live event row below it, and the
  module fills the mechanism slot `D7` item 2 already reserves. `/` therefore
  keeps **three** scene blocks, one of which contains the module, and `D3`, `D3a`,
  `A6`, `A7`, `A9` and `A11` carry it. `CONF-0026` is `RESOLVED` with outcome
  `NEW_VERSION` on `TS-WEB-0006 D7`; `Q-0080` is closed. The wrapping does not
  travel to `/mitmachen`: a scene wraps a module only where the module **is** the
  job introduction, and there the hero is (`DEC-0110 §3`).
- ~~**Nothing says what starts the auto-advance, and the module can now sit
  last.**~~ **Answered 2026-09-25 by the owner, amended into `DEC-0105 §6`** —
  that section is his motion decision, so the answer went there rather than into
  this spec. The advance **starts on the first intersection at which three
  quarters of the module are in the viewport**, never on page load; **state 1 gets a full dwell** before the
  first advance; it runs **one pass** — `4 000 + 550 + 4 000 + 550` ms = **9.1 s**
  at the specified 4 s dwell floor — and **stops at state 3** with no loop and no
  restart on the way back up; **any interaction stops it for good**. Because 9.1 s
  of automatic movement stands beside other content, **WCAG 2.2.2** applies, and
  the step lines — already real buttons — are the mechanism it requires:
  `TS-WEB-0002 D7` and `TS-WEB-0002-A13` carry it, because accessibility is that
  spec's and not a guide's. The trigger is worked through in all three trait
  positions in D3a above and none of them breaks it. `Q-0081` is closed, and so
  is the one sub-clause its answer did not cover: the owner answered `Q-0083` the
  same day with **three quarters of the module's own height**, which fires at
  360 × 640 as well as 360 × 800, so the short-viewport fallback is withdrawn
  rather than adopted. What a fraction cannot fix is *which* three quarters —
  **Q-0084**.
- **Q-0044 blocks generation of this page.** Proof card and stream, the
  live-module shells and the context band are not among SRC-0014's
  specified components — fourteen of them as of 2026-09-25, not the six this
  point named — and no component declares what it renders.
  **Answered by:** design, via the component manifest.
