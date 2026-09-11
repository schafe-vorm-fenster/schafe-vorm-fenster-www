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

### D2 — The AAA basics [FIXED: DEC-069]

Adopted beyond AA — chosen for this audience (rural, all ages, many
first-time users):

| Criterion | Adoption |
| --- | --- |
| 2.4.9 Link Purpose (Link Only) | full — no "hier klicken" |
| 1.4.8 Visual Presentation | line length ≤ 80ch, line height ≥ 1.5, text resizable |
| 3.1.5 Reading Level | plain language; matches the scene principle (SRC-001 §1a) |
| 2.3.3 Animation from Interactions | full — with `prefers-reduced-motion` |
| 2.4.10 Section Headings | full — the heading outline is already the page structure (TS-006 D2); this makes it binding |
| 2.5.5 Target Size | full — **≥ 44 × 44 CSS px for every target**, not only primary CTAs (supersedes the AA floor in D6) |
| 2.2.6 Timeouts | full — trivially met: no page has a session, a timeout or expiring state |
| 3.3.6 Error Prevention (All) | full — every submission is reversible, checked, or confirmed before it commits |

Why these eight and not more. Four were chosen for the audience — rural,
all ages, many first-time users — and four more were added because they
cost little against what the specs already require: the heading outline
and the absence of timeouts are properties this site has anyway, and
error prevention is already the shape of the order flow. The one that
costs something is **2.5.5**: raising every target to 44 × 44 (not just
the primary CTAs) puts real pressure on dense rows — the archive filter
chips, the scope tick-list. It is adopted because a 24 px target is a
thumb-miss for exactly the visitors this site is for.

Not adopted, and why: **1.4.6** enhanced contrast as a blanket rule (the
high-contrast theme covers it, D4); **1.3.6** Identify Purpose (needs a
personalisation vocabulary on controls that no source asks for);
**1.4.9** Images of Text (no images of text exist to constrain); sign
language and extended audio description (no video).

### D3 — Contrast and brand [FIXED: WEB-Q-011; weights PROPOSED]

- Text 4.5:1 minimum; large text (≥ 24px / ≥ 18.66px bold) and UI
  components 3:1. Brand green `#B4CF39` fails on white for text → it is
  never a text colour on light ground; usage limited to surfaces,
  accents, and large graphical elements that meet 3:1 [PROPOSED].
- **Atkinson Hyperlegible Next** (DEC-043). The weight-floor rule that
  stood here is **moot**: the family ships `400`, `700` and `800` only —
  there is no light weight to guard against. Body copy is `400` because
  that is the regular. Sizes come from `font.size` in
  `@schafe-vorm-fenster/brand-design`, which is already responsive
  (`clamp()`) and floors at 15 px; the specs restate none of them.

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
- Touch targets ≥ 44×44 CSS px everywhere — D2 adopts 2.5.5 (AAA), which supersedes the 2.5.8 AA floor of 24×24 [FIXED: DEC-069].
- Zoom: usable at 200 %; reflow at 320px width without 2D scrolling.
- Images: informative → meaningful `alt` from content frontmatter
  (WEB-F-089 schema carries the field); decorative → `alt=""`
  [FIXED: WEB-Q-017].
- Forms are the envoy widget: label association, error identification,
  and focus management are part of the widget demand (Q-022) — the
  website's acceptance still covers them (A6).

### D6 — Accessibility statement [FIXED: WEB-Q-027; route PROPOSED]

A section at the permanent anchor `#barrierefreiheit` on `/rechtliches`
(DEC-039; the anchor registry is TS-004 D8), footer-linked on every page, content
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
| TS-002-A8 | integration | `/rechtliches#barrierefreiheit` resolves to the accessibility statement, is footer-linked under its conventional label, and its content is current. |
| TS-002-A9 | e2e | With `prefers-reduced-motion`: no animation beyond opacity. |
| TS-002-A10 | static | No font family, size or weight is declared outside the token import; the rendered type scale equals `font.*` from the brand package, and no size below 15 px appears. |
| TS-002-A11 | tool | axe-core reports no image without a text alternative; every image is either given a meaningful `alt` from content frontmatter or marked decorative with `alt=""`. |
| TS-002-A12 | manual | The published accessibility statement names its method — self-assessment backed by the acceptance regime of this spec (A1–A5) — and claims no audit that did not happen. **Limitation:** automated checks cover only part of the BITV test steps; the statement must not imply more coverage than was performed. |

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
| WEB-Q-016 (brand typeface readability) | D3 weight floor · Q-034 rest |
| WEB-Q-017 (text alternatives) | D5 images rule |
| WEB-Q-018 (touch targets, mobile) | D5 target sizes · A7 |
| WEB-Q-019 (automated + manual testing) | A1–A5 (the acceptance regime) |
| WEB-Q-026 (BFSG conformity) | D1 · Q-021 |
| WEB-Q-027 (accessibility statement) | D6 · A8 |
| WEB-Q-016 (brand typeface) | D3 · A10 · Q-034 for the colour world |
| WEB-Q-017 (text alternatives) | D5 images rule · A11 |
| WEB-Q-026 (BFSG conformity) | D1 · A12 · Q-021 for applicability |

## Open points

- Q-021 (BFSG applicability — legal), Q-013 (formal brand-font signoff;
  D3 settles the operative rule), Q-022 (widget conformance).
- D3 and D6's remaining rows are [PROPOSED]; D2 and D6's target size are fixed by DEC-069.
