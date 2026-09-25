---
artefact: tactical-spec
id: TS-WEB-0002
kind: rule
status: DRAFT
version: 0.1.0
implements: [NFR-WEB-0057, CON-WEB-0024, NFR-WEB-0058, NFR-WEB-0059, CON-WEB-0025, FUN-WEB-0128, FUN-WEB-0118, FUN-WEB-0119, FUN-WEB-0120, FUN-WEB-0129, FUN-WEB-0130, NFR-WEB-0016, NFR-WEB-0060, FUN-WEB-0121, NFR-WEB-0018, FUN-WEB-0122, FUN-WEB-0123, CON-WEB-0026, CON-WEB-0027]
sources: [SRC-0006]
decisions: [DEC-0012]
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-09T16:07:54+02:00"
---

# TS-WEB-0002 — Accessibility

## Purpose

Resolves "WCAG 2.2 AA plus AAA basics" into the concrete, checkable rule
set every page and component is built and tested against.

## Determinations

### D1 — Conformance target [FIXED: NFR-WEB-0057, CON-WEB-0024, DEC-0012]

WCAG 2.2 Level AA, all criteria, no exceptions. BFSG conformity is the
legal frame (Q-0021 confirms applicability).

### D2 — The AAA basics [FIXED: DEC-0069]

Adopted beyond AA — chosen for this audience (rural, all ages, many
first-time users):

| Criterion | Adoption |
| --- | --- |
| 2.4.9 Link Purpose (Link Only) | full — no "hier klicken" |
| 1.4.8 Visual Presentation | line length ≤ 80ch, line height ≥ 1.5, text resizable |
| 3.1.5 Reading Level | plain language; matches the scene principle (SRC-0001 §1a) |
| 2.3.3 Animation from Interactions | full — with `prefers-reduced-motion` |
| 2.4.10 Section Headings | full — the heading outline is already the page structure (TS-WEB-0006 D2); this makes it binding |
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

### D3 — Contrast and brand [FIXED: NFR-WEB-0058, NFR-WEB-0059, CON-WEB-0025, DEC-0105; weights PROPOSED]

- Text 4.5:1 minimum; large text (≥ 24px / ≥ 18.66px bold) and UI
  components 3:1.
- **On a photo surface the ground is the composite** of the photograph with
  the **fixed** scrim stop at that position, ceiling `0.72`
  (SRC-0014 §*Photo surface*, DEC-0105 §1). The ladder is authored, not
  derived from an image, and the per-photograph measurement decision 5 asked
  for is withdrawn — nothing performed it and `A3` reaches the token layer
  only. The photograph half is carried by the crop and focal-point rules
  (DEC-0105 §2) and by DEM-0027, not by a number here. Brand green `#B4CF39` fails on white for text → it is
  never a text colour on light ground; usage limited to surfaces,
  accents, and large graphical elements that meet 3:1 [PROPOSED].
- **Atkinson Hyperlegible Next** (DEC-0043). The weight-floor rule that
  stood here is **moot**: the family ships `400`, `700` and `800` only —
  there is no light weight to guard against. Body copy is `400` because
  that is the regular. Sizes come from `font.size` in
  `@schafe-vorm-fenster/brand-design`, which is already responsive
  (`clamp()`) and floors at 15 px; the specs restate none of them.

### D4 — Themes via browser hints only [FIXED: FUN-WEB-0129, FUN-WEB-0130]

Three themes — light (default), dark, high-contrast — selected solely by
`prefers-color-scheme` and `prefers-contrast`. No toggle, no storage.
Implementation rule: every colour is a design token defined in all three
themes; a colour used outside the token set is a build error [PROPOSED].
Also honoured: `prefers-reduced-motion` (no non-essential motion),
`Save-Data`/reduced-data (→ TS-WEB-0003 D6), OS font-size scaling (rem-based
type, no px font sizes) [FIXED: SRC-0006].

### D5 — Structure and operation [FIXED: FUN-WEB-0128, FUN-WEB-0118, FUN-WEB-0119, FUN-WEB-0120]

- Landmarks: exactly one `main`; `nav`, `header`, `footer`, `aside` per
  their roles (ties FUN-WEB-0071); heading levels never skip.
- Skip link as first focusable element [PROPOSED].
- Full keyboard operability; visible focus (2.4.7 + 2.4.11); no traps.
- Touch targets ≥ 44×44 CSS px everywhere — D2 adopts 2.5.5 (AAA), which supersedes the 2.5.8 AA floor of 24×24 [FIXED: DEC-0069].
- Zoom: usable at 200 %; reflow at 320px width without 2D scrolling.
- Images: informative → meaningful `alt` from content frontmatter
  (FUN-WEB-0089 schema carries the field); decorative → `alt=""`
  [FIXED: NFR-WEB-0060, FUN-WEB-0121].
- Forms are the envoy widget: label association, error identification,
  and focus management are part of the widget demand (Q-0022) — the
  website's acceptance still covers them (A6).

### D6 — Accessibility statement [FIXED: CON-WEB-0027; route PROPOSED]

A section at the permanent anchor `#barrierefreiheit` on `/rechtliches`
(DEC-0039; the anchor registry is TS-WEB-0004 D8), footer-linked on every page, content
per BFSG requirements; maintained like a legal page (FUN-WEB-0180, FUN-WEB-0181, FUN-WEB-0182 pipeline).

## Free for the generator

- [FREE] How criteria are met (markup patterns, CSS techniques), within
  D3–D5.
- [FREE] Skip-link wording, focus-style design — within contrast rules.

## Acceptance criteria

| ID | Level | Check |
| --- | --- | --- |
| TS-WEB-0002-A1 | tool | axe-core: zero violations on every page, in all three themes. |
| TS-WEB-0002-A2 | tool | Lighthouse accessibility = 100 (mobile + desktop). |
| TS-WEB-0002-A3 | static | Automated contrast check of the token set passes for all themes. |
| TS-WEB-0002-A4 | manual | Keyboard-only walkthrough reaches every conversion (all four jobs) — manual, per release. |
| TS-WEB-0002-A5 | manual | Screen-reader spot check (VoiceOver iOS + NVDA) on home, `/dein-ort`, one sell page — manual, per release. |
| TS-WEB-0002-A6 | tool | envoy widget passes A1/A4 inside the page context. |
| TS-WEB-0002-A7 | e2e | 320px viewport: no horizontal scroll on any page. |
| TS-WEB-0002-A8 | integration | `/rechtliches#barrierefreiheit` resolves to the accessibility statement, is footer-linked under its conventional label, and its content is current. |
| TS-WEB-0002-A9 | e2e | With `prefers-reduced-motion`: no animation beyond opacity. |
| TS-WEB-0002-A10 | static | No font family, size or weight is declared outside the token import; the rendered type scale equals `font.*` from the brand package, and no size below 15 px appears. |
| TS-WEB-0002-A11 | tool | axe-core reports no image without a text alternative; every image is either given a meaningful `alt` from content frontmatter or marked decorative with `alt=""`. |
| TS-WEB-0002-A12 | manual | The published accessibility statement names its method — self-assessment backed by the acceptance regime of this spec (A1–A5) — and claims no audit that did not happen. **Limitation:** automated checks cover only part of the BITV test steps; the statement must not imply more coverage than was performed. |

## Coverage

Every implemented requirement is discharged by at least one determination
or acceptance criterion — this table is the proof of the `implements:`
claim:

| Requirement | Discharged by |
| --- | --- |
| NFR-WEB-0057 (Violations of WCAG 2.2 level A and AA = 0 violations) | D1, D2 · A1, A2 |
| CON-WEB-0024 (never take full non-visual optimisation as a launch criterion) | D1, D2 · A1, A2 |
| NFR-WEB-0058 (Contrast ratio of body text against its ground, the composite on a photo surface, >= 4.5 :1) | D3 · A3 |
| NFR-WEB-0059 (Contrast ratio of display type and of non-text contrast against its ground) | D3 · A3 |
| CON-WEB-0025 (use the accessible colour variant wherever a brand colour …) | D3 · A3 |
| FUN-WEB-0128 (render semantic markup — landmarks) | D5 · A1 |
| FUN-WEB-0118 (be operable by keyboard alone) | D5 · A4, A5 |
| FUN-WEB-0119 (present its content to a screen reader in the …) | D5 · A4, A5 |
| FUN-WEB-0120 (render a focus ring of 3 px violet-500 at …) | D5 · A4, A5 |
| FUN-WEB-0129 (render accordingly) | D4 · A9 |
| FUN-WEB-0130 (take the browser preference as its only input) | D4 · A1 (three themes) |
| NFR-WEB-0016 (Rendered font size of any text on the website >= 15 CSS px) | D3 weight floor · Q-0034 rest |
| NFR-WEB-0060 (Informative images without a text alternative = 0 images) | D5 images rule |
| FUN-WEB-0121 (mark it alt="") | D5 images rule |
| NFR-WEB-0018 (Size of every touch target on the website >= 44 x 44 CSS px) | D5 target sizes · A7 |
| FUN-WEB-0122 (run the axe sweep over every route) | A1–A5 (the acceptance regime) |
| FUN-WEB-0123 (run a screen-reader spot check on VoiceOver iOS and …) | A1–A5 (the acceptance regime) |
| CON-WEB-0026 (conform to the Barrierefreiheitsstärkungsgesetz) | D1 · Q-0021 |
| CON-WEB-0027 (publish an accessibility statement as a footer-reachable section at …) | D6 · A8 |
| NFR-WEB-0016 (Rendered font size of any text on the website >= 15 CSS px) | D3 · A10 · Q-0034 for the colour world |
| NFR-WEB-0060 (Informative images without a text alternative = 0 images) | D5 images rule · A11 |
| FUN-WEB-0121 (mark it alt="") | D5 images rule · A11 |
| CON-WEB-0026 (conform to the Barrierefreiheitsstärkungsgesetz) | D1 · A12 · Q-0021 for applicability |

## Open points

- Q-0021 (BFSG applicability — legal), Q-0013 (formal brand-font signoff;
  D3 settles the operative rule), Q-0022 (widget conformance).
- D3 and D6's remaining rows are [PROPOSED]; D2 and D6's target size are fixed by DEC-0069.
- **`prefers-reduced-transparency` is not in D4.** DEC-0105 §4 makes it one of
  the three conditions that select the blur primitive's solid fallback, and D4
  names only `prefers-reduced-motion`, `Save-Data` and OS font scaling. Add the
  row, or say why the blur's fallback is selected somewhere this spec does not
  govern. No criterion asserts the blur or its fallback today.
  **Answered by:** the owner of `concept/website-design-system.md` and SRC-0013.
