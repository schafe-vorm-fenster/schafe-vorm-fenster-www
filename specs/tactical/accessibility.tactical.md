---
artefact: tactical-spec
id: TS-002
profile: rule
status: DRAFT
implements: [WEB-Q-010, WEB-Q-011, WEB-Q-012, WEB-Q-013, WEB-Q-014, WEB-Q-015, WEB-Q-016, WEB-Q-017, WEB-Q-018, WEB-Q-019, WEB-Q-026, WEB-Q-027]
sources: [SRC-006]
decisions: [DEC-012]
---

# TS-002 — Accessibility

## Purpose

Resolves "WCAG 2.2 AA plus AAA basics" into the concrete, checkable rule
set every page and component is built and tested against.

## Determinations

### D1 — Conformance target [FIXED: WEB-Q-010, DEC-012]

WCAG 2.2 Level AA, all criteria, no exceptions. BFSG conformity is the
legal frame (Q-021 confirms applicability).

### D2 — The AAA basics [PROPOSED]

Adopted beyond AA — chosen for this audience (rural, all ages, many
first-time users):

| Criterion | Adoption |
| --- | --- |
| 2.4.9 Link Purpose (Link Only) | full — no "hier klicken" |
| 1.4.8 Visual Presentation | line length ≤ 80ch, line height ≥ 1.5, text resizable |
| 3.1.5 Reading Level | plain language; matches the scene principle (SRC-001 §1a) |
| 2.3.3 Animation from Interactions | full — with `prefers-reduced-motion` |

Not adopted: 1.4.6 enhanced contrast as blanket rule (the high-contrast
theme covers it, D4), sign language, extended audio description.

### D3 — Contrast and brand [FIXED: WEB-Q-011; weights PROPOSED]

- Text 4.5:1 minimum; large text (≥ 24px / ≥ 18.66px bold) and UI
  components 3:1. Brand green `#B4CF39` fails on white for text → it is
  never a text colour on light ground; usage limited to surfaces,
  accents, and large graphical elements that meet 3:1 [PROPOSED].
- Catamaran weight floor: `Light (300)` only ≥ 18px; body text ≥ 400
  [PROPOSED — resolves Q-013's practical half; brand doc prefers Light
  "where readability remains good", this defines "good"].

### D4 — Themes via browser hints only [FIXED: WEB-Q-014/015]

Three themes — light (default), dark, high-contrast — selected solely by
`prefers-color-scheme` and `prefers-contrast`. No toggle, no storage.
Implementation rule: every colour is a design token defined in all three
themes; a colour used outside the token set is a build error [PROPOSED].
Also honoured: `prefers-reduced-motion` (no non-essential motion),
`Save-Data`/reduced-data (→ TS-003 D6), OS font-size scaling (rem-based
type, no px font sizes) [FIXED: SRC-006].

### D5 — Structure and operation [FIXED: WEB-Q-012/013]

- Landmarks: exactly one `main`; `nav`, `header`, `footer`, `aside` per
  their roles (ties WEB-F-071); heading levels never skip.
- Skip link as first focusable element [PROPOSED].
- Full keyboard operability; visible focus (2.4.7 + 2.4.11); no traps.
- Touch targets ≥ 24×24 CSS px (2.5.8), primary CTAs ≥ 44×44 [PROPOSED].
- Zoom: usable at 200 %; reflow at 320px width without 2D scrolling.
- Images: informative → meaningful `alt` from content frontmatter
  (WEB-F-089 schema carries the field); decorative → `alt=""`
  [FIXED: WEB-Q-017].
- Forms are the envoy widget: label association, error identification,
  and focus management are part of the widget demand (Q-022) — the
  website's acceptance still covers them (A6).

### D6 — Accessibility statement [FIXED: WEB-Q-027; route PROPOSED]

Route `/barrierefreiheit`, linked from the footer on every page, content
per BFSG requirements; maintained like a legal page (WEB-F-088 pipeline).

## Free for the generator

- [FREE] How criteria are met (markup patterns, CSS techniques), within
  D3–D5.
- [FREE] Skip-link wording, focus-style design — within contrast rules.

## Acceptance criteria

| ID | Level | Check |
| --- | --- | --- |
| TS-002-A1 | tool | axe-core: zero violations on every page, in all three themes. |
| TS-002-A2 | tool | Lighthouse accessibility = 100 (mobile + desktop). |
| TS-002-A3 | static | Automated contrast check of the token set passes for all themes. |
| TS-002-A4 | manual | Keyboard-only walkthrough reaches every conversion (all four jobs) — manual, per release. |
| TS-002-A5 | manual | Screen-reader spot check (VoiceOver iOS + NVDA) on home, `/dein-ort`, one sell page — manual, per release. |
| TS-002-A6 | tool | envoy widget passes A1/A4 inside the page context. |
| TS-002-A7 | e2e | 320px viewport: no horizontal scroll on any page. |
| TS-002-A8 | integration | `/barrierefreiheit` exists, footer-linked, content current. |
| TS-002-A9 | e2e | With `prefers-reduced-motion`: no animation beyond opacity. |

## Coverage

Every implemented requirement is discharged by at least one determination
or acceptance criterion — this table is the proof of the `implements:`
claim:

| Requirement | Discharged by |
| --- | --- |
| WEB-Q-010 (WCAG 2.2 AA + AAA basics) | D1, D2 · A1, A2 |
| WEB-Q-011 (contrast vs brand) | D3 · A3 |
| WEB-Q-012 (semantics, ARIA) | D5 · A1 |
| WEB-Q-013 (keyboard, screen reader) | D5 · A4, A5 |
| WEB-Q-014 (browser preference hints) | D4 · A9 |
| WEB-Q-015 (no manual theme switcher) | D4 · A1 (three themes) |
| WEB-Q-016 (Catamaran readability) | D3 weight floor · Q-013 rest |
| WEB-Q-017 (text alternatives) | D5 images rule |
| WEB-Q-018 (touch targets, mobile) | D5 target sizes · A7 |
| WEB-Q-019 (automated + manual testing) | A1–A5 (the acceptance regime) |
| WEB-Q-026 (BFSG conformity) | D1 · Q-021 |
| WEB-Q-027 (accessibility statement) | D6 · A8 |

## Open points

- Q-021 (BFSG applicability — legal), Q-013 (formal brand-font signoff;
  D3 settles the operative rule), Q-022 (widget conformance).
- D2/D3/D6 route are [PROPOSED].
