---
artefact: tactical-spec
id: TS-029
profile: interaction
status: DRAFT
implements: [WEB-F-029]
sources: [SRC-001, SRC-003, SRC-014]
decisions: [DEC-012, DEC-027, DEC-039, DEC-052]
---

# TS-029 — `/rechtliches` (EN `/legal`): the one legal page

## Purpose

One route carries every legal text as a long, anchored reading page
(DEC-039). No focus job in the four-job sense — a sender surface, reached
from the footer, from contracts, invoices and app screens, usually **at an
anchor**, not at the top. Two things decide whether it works: **on-page
navigation** (six sections on one scroll, on a phone) and **deep-link
survival**. Everything else is referenced, not restated:

| Concern | Owner |
| --- | --- |
| Anchor registry (the six anchors, localized, permanent) | TS-004 **D8** — authoritative |
| Route, layout, footer link labels | TS-004 D1, D2, D4 |
| Block order, page manifest, closing block | TS-006 D1, D2, D6 |
| Import, schema, validation of the sections | TS-007 D10 |
| Rendering layer · metadata, canonical, semantics | TS-009 D1 · TS-011 D3, D5, D9 |
| Conformance, headings, contrast, reduced motion | TS-002 D1, D2, D5 |
| Type scale, spacing, colour | `concept/website-design-system.md` (SRC-014) |

## Determinations

### D1 — The page is a section stack driven by the registry [FIXED: DEC-039, WEB-F-029, TS-004 D8]

`app/[lang]/rechtliches/page.tsx` renders **one section per registry entry,
in registry order**, by iterating TS-004 D8; appending a document to the
import (TS-007 D10) plus its registry entry is the only way a section
appears. The page holds no copy of its own beyond the `h1` and the nav
label. A registry entry whose document is absent renders nothing — no empty
heading, no placeholder — while the anchor stays reserved (exception: D8);
a retired section keeps its anchor and renders a one-line pointer to its
successor (WEB-F-029).

### D2 — Anchors are ids from the registry, never derived from headings [FIXED: WEB-F-029]

The `id` of a section element is the registry anchor for the page's
language, taken from the `anchor` field of the content file (TS-007 D10),
**not** slugified from the rendered heading text. Consequences that must
hold in code:

| Rule | Effect |
| --- | --- |
| id ← registry, not heading; independent of position | retitling or reordering a section never moves `#datenschutz` |
| one id per anchor, duplicates fail the build; localized in pairs | `/rechtliches#impressum` and `/legal#imprint` are the same section (D8) |
| markdown headings inside a document get **no** auto ids | no heading collision can shadow a registry anchor |

### D3 — Landing at an anchor lands correctly [PROPOSED]

The header is sticky, so a raw anchor jump hides the heading under it:

- every section carries `scroll-margin-top` = sticky header height + one
  section padding step (26–30 px), read from the same CSS variable as the
  header height — never a second hard-coded number.
- landing works on **first paint** (server-rendered ids, no JS), on in-page
  navigation and on back/forward; after an in-page jump focus moves to the
  section heading (`tabindex="-1"`), so the next Tab stays in that section.
- smooth scrolling only under `prefers-reduced-motion: no-preference`;
  an unknown fragment renders the page at the top, not an error.

### D4 — On-page navigation [PROPOSED]

One `<nav>` with an accessible name ("Abschnitte" / "Sections") listing the
registry sections in order, server-rendered as plain links — it works with
JS disabled.

| Viewport | Behaviour |
| --- | --- |
| ≥ `xl` (1024 px) | sticky column beside the text, full list visible, `position: sticky` below the header |
| < `xl` | not sticky: the list sits once below the `h1`, above the first section |
| < `xl`, past section one | one "Nach oben" control, fixed bottom-right, ≥ 44 px, returning to the nav — no floating menu, no overlay |

Current-section indication is progressive enhancement: an
`IntersectionObserver` marks the topmost visible section's entry with
`aria-current="true"` plus a non-colour-only mark; without JS there is no
marker and nothing else changes. The list never hides behind a phone
toggle — six short entries cost less than a disclosure.

### D5 — Reading layout [PROPOSED, within TS-002 D2 and SRC-014]

This page is longer and denser than any other, so the measure is a
determination: body text at **66 ch** ideal / **80 ch** hard maximum
(TS-002 D2) in the Body role (18 px / 1.5), applied to the text column only.
Sections are divided by a `line` hairline plus one padding step, never a card.

### D6 — Heading structure [FIXED: TS-002 D5, TS-011 D3]

| Level | Content |
| --- | --- |
| `h1` | the page title ("Rechtliches" / "Legal"), once |
| `h2` | one per registry section, the section name from D8; carries the anchor id |
| `h3`+ | the imported document's structure, shifted down so nothing skips |

The imported document's top-level heading is demoted, not rendered twice.
The page is `main > article`, the section `nav` preceding the article
(TS-011 D3 does not register that element yet — open point 6).

### D7 — Static, no live data, no client dependencies [FIXED: TS-009 D1, DEC-013]

Fully static from the committed markdown; no live module, no external
request, no embed. The only client JS is D4's current-section marker.

### D8 — The accessibility statement is a required but missing section [FIXED: WEB-Q-027, DEC-012]

`#barrierefreiheit` / `#accessibility` is the one registry anchor with no
document (TS-004 D8: "to be written"). BFSG requires it published and the
footer links it (TS-004 D4) — a footer link into a section that does not
render is a conformity defect. So this anchor is the exception to D1: **the
production build fails while it is missing**; preview builds omit it.

### D9 — The Auftragsverarbeitungsvertrag is public [FIXED: DEC-052 §5]

`#auftragsverarbeitung` / `#data-processing` renders as an ordinary section
for everyone — no login, no gate, no download-only form. Municipalities
check it before buying.

### D10 — Metadata and indexing [FIXED: TS-011 D5, D9]

Indexable, self-canonical at the parameter-free path; `seo.title` /
`seo.description` per language as for any page; no per-section metadata —
the anchors are not URLs of their own.

## Free for the generator

- [FREE] Visual treatment of the navigation (marker shape, numbering)
  within SRC-014 and TS-002 D3.
- [FREE] Breakpoint mechanism for D4 (container or media query) and the
  component/file split below the route.

## Acceptance criteria

| ID | Level | Check |
| --- | --- | --- |
| TS-029-A1 | integration | `/rechtliches` and `/en/legal` respond 200 with correct `<html lang>`; both render one `main`, one `h1`. |
| TS-029-A2 | integration | Each TS-004 D8 anchor whose document exists appears exactly once as an element `id`, in the page language's spelling and in registry order; no section id outside the registry. |
| TS-029-A3 | e2e | Opening `/rechtliches#datenschutz` directly: the section `h2` is fully visible below the sticky header (its bounding box top ≥ header bottom) and is the focused element. Repeat for `#auftragsverarbeitung` and `/legal#imprint`. |
| TS-029-A4 | static | Reordering the registry fixture changes section order but no `id`; renaming a section heading in a fixture changes no `id`. |
| TS-029-A5 | e2e | The section `nav` lists the registry sections in order; clicking each entry lands per A3; `aria-current="true"` follows the topmost section while scrolling. |
| TS-029-A6 | e2e | At 390 px: the nav is not sticky, sits above the first section, no horizontal scroll; after scrolling past section one a ≥ 44 px "Nach oben" control appears and returns to the nav. |
| TS-029-A7 | e2e | With JavaScript disabled the page renders all sections and every nav link jumps correctly; no `aria-current` is required. |
| TS-029-A8 | e2e | Body text column measure ≤ 80 ch at 360 px, 428 px, 768 px and 1440 px (measured against a 0-width `ch` probe). |
| TS-029-A9 | e2e | Footer links "Impressum", "Datenschutz", "Barrierefreiheit" (and their EN labels) resolve to the matching anchors on this page, on both languages. |
| TS-029-A10 | integration | `#auftragsverarbeitung` renders its content anonymously — no redirect, no auth, no form gate. |
| TS-029-A11 | integration | Production build fails when the accessibility-statement section is absent; preview build succeeds and omits it (D8). |
| TS-029-A12 | tool | axe-core: zero violations on the page in all three themes, including nav landmark naming and heading order. |
| TS-029-A13 | e2e | With `prefers-reduced-motion: reduce` an in-page jump performs no smooth scroll and no animation beyond opacity. |
| TS-029-A14 | integration | Heading outline: one `h1`, one `h2` per rendered section, no skipped level inside any imported document. |

Levels: integration 5 · e2e 7 · static 1 · tool 1.

## Coverage

| Requirement | Discharged by |
| --- | --- |
| WEB-F-029 (legal content on one route, on-page navigation, permanent anchors of TS-004 D8, footer keeps conventional labels) | D1 (registry-driven section stack, retired-section pointer), D2 (ids from the registry), D3 (anchor landing), D4 (on-page navigation), D6 (headings), D10 (indexing) · A1, A2, A3, A4, A5, A6, A7, A9, A14 |

Touched, owned elsewhere: WEB-Q-027 → TS-002 D6 · WEB-F-088 → TS-007 D10 · WEB-F-021 → TS-004 D4.

## Open points

| # | Point | Addressee |
| --- | --- | --- |
| 1 | **The accessibility statement does not exist.** TS-004 D8 lists `#barrierefreiheit` as "to be written"; no Google Doc, no `content/legal/` file. D8 makes it a release blocker. Who writes it (DE + EN), and by when relative to launch? | jan-henrik.hempel (owner), with legal counsel |
| 2 | **`import.yaml` carries no locale dimension.** Five documents, one target each, `locale: de` in the files; DEC-027 requires DE **and** EN. Do the English Google Docs exist, and who changes the import script for the `<locale>` path? (Same point as TS-007 open points — recorded here because this page is where the gap becomes visible.) | jan-henrik.hempel (content pipeline) |
| 3 | **`import.yaml` carries no `anchor`.** D2 requires the anchor to come from the file, not from the heading. TS-007 D10 marks the field [PROPOSED]; until it exists the mapping document → anchor has no home. | TS-007 owner |
| 4 | **TS-002 D6 still specifies a route `/barrierefreiheit`.** DEC-039 made it a section. TS-002 D6 and criterion TS-002-A8 contradict this spec and must be amended. | TS-002 owner |
| 5 | **TS-006 D1 demands exactly one `focusJob` per page.** A sender surface has none. Either the job registry gains a sender value or D1 admits `null` for `/rechtliches` (as it already admits `primaryConversion: null`). This spec does not invent the value. | TS-006 owner |
| 6 | **TS-011 D3's demotion registry does not place an on-page section `nav`.** D6 proposes it before the `article` inside `main`; the registry needs the row. | TS-011 owner |
| 7 | **The design system has no measure token.** D5 sets 66/80 ch locally; it belongs in `concept/website-design-system.md` so other reading surfaces inherit it. | SRC-014 owner |
| 8 | **`content/legal/` is flat today** (five files, no `<locale>/` level, `content_type: legal` instead of TS-007's `legal-section`). Migration order relative to the first build is unsettled. | jan-henrik.hempel (content pipeline) |
