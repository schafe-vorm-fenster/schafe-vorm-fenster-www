---
id: DEC-0178
title: The spacing scale per level and tier — one token per level, every tier's value in one stylesheet, a 24 px block gap and a 12 px bound gap from xl, and no component hands another its outer margin
status: accepted
date: 2026-10-28
decided_by: jan-henrik.hempel
---

## Context

DEC-0171 gave every level of vertical space one owner and fixed the stack's
values at `space-4` (16 px, `--block-gap`) and `space-2` (8 px,
`--block-gap-bound`) at every breakpoint: "A larger or stepping value is a
later owner decision, not an implementer's" (§2). The layout review of
2026-10-27 (§6 item 4) asked whether the gap should step up from `xl`.

The owner, 2026-10-28: a larger gap from desktop, „aber mit einem klaren
technischen CSS/HTML-Konzept". So this record is the concept, not a value
change: what the levels are, which token each has, its value per tier, where
those values are set, what the markup contract is, and how each is guarded.

Measured on the production build before the change (`/dein-kalender`,
`/mitmachen`, `/`; 390, 800, 1280 and 1440 px):

| | 390 | 800 | 1280 | 1440 |
| --- | --- | --- | --- | --- |
| section head (`h2` in a stack) | 24 / 25.9 px | 25.6 / 27.6 px | 30 / 32.4 px | 30 / 32.4 px |
| content box | 358 px | 736 px | 1184 px | 1200 px |
| `--block-gap` ÷ heading line | 0.62 | 0.58 | 0.49 | 0.49 |
| `--section-padding-block` / `-tight` | 28 / 22 px | 28 / 22 px | 28 / 22 px | 28 / 22 px |

The heading steps up by a quarter from `xl` and the measure triples, but the
gap stays 16 px: at 1280 and 1440 the blocks of one section read closer
together than on the phone, which is what the owner saw.

## Decision

1. **Levels and tokens.** Five levels carry a token, one owner each
   (DEC-0171): section edge standard (`--section-padding-block`) and tight
   (`--section-padding-block-tight`), owned by `section-shell`; between blocks
   (`--block-gap`) and kicker to block (`--block-gap-bound`), owned by the
   content stack; between controls (`--control-gap`), owned by the control
   group. Inside a block the component uses the space scale directly; that
   level has no token because it has no shared value.

2. **Values per tier** (SRC-0014 §Layout Grid's three tiers, stepping at the
   breakpoint tokens `md` 40rem and `xl` 64rem):

   | Level | Token | Mobile | Tablet (`md`) | Desktop (`xl`) |
   | --- | --- | --- | --- | --- |
   | section edge, standard | `--section-padding-block` | 28 px | 28 px | 28 px |
   | section edge, tight | `--section-padding-block-tight` | 22 px | 22 px | **24 px** (`space-6`) |
   | between blocks | `--block-gap` | 16 px (`space-4`) | 16 px | **24 px** (`space-6`) |
   | kicker → block | `--block-gap-bound` | 8 px (`space-2`) | 8 px | **12 px** (`space-3`) |
   | between controls | `--control-gap` | 10 px | 10 px | 10 px |

   **Why 24 px.** The scale has no 20 px step (`DEM-0071`); 24 px is the next
   one. It brings the gap back to 0.74 of a heading line (the phone has
   0.62, the tablet 0.58), and it is the desktop grid gutter (`--grid-gap`,
   24 px from `xl`), so blocks stand as far apart down the page as columns
   stand across it. 32 px would be wider than the standard section edge.
   **Why the tablet keeps 16 px:** there is no step between 16 and 24, and at
   800 px the ratio (0.58) is the phone's, not the desktop's.
   **Two invariants**, which fix the other two values: the bound gap is half
   the block gap in every tier (8/16, 12/24), so a kicker keeps reading with
   what it names; and no block gap is wider than the tightest section edge,
   so the tight edge rises from 22 to 24 px from `xl` — inside SRC-0014's
   "20–24 px for tight ones".

3. **One home.** Every value of every tier is assigned in
   `app/styles/components.css` (the base for mobile and tablet, one
   `@media (min-width: 64rem)` block for the desktop) and nowhere else.
   `base.css`'s `[data-stack]` rule only reads them. **`TS-WEB-0017-A34`**
   (`pnpm check:brand`) fails a level token assigned in any other stylesheet.

4. **The HTML contract.** A section is one `section-shell`; its container (or
   an uncontained section's lede) carries `data-stack`; the stack's direct
   children are the blocks; a kicker carries `data-kicker`, and the bound gap
   follows from that alone. A group of blocks inside a stack is a stack
   itself. `data-stack` takes **no value**: no `"bound"` or `"loose"` variant,
   because the only closer step is the kicker's and a looser one would be a
   second section. **No component sets its own outer margin or hands one to
   another through `className`** (`TS-WEB-0017-A32`). The seven hand-ins A32
   listed on 2026-10-27 are resolved: `archive-row` and `quote-card` (the
   source link), `feature-benefit` and `person-profile` (the photograph),
   `hero-block` (the kicker badge), `value-story` (the example badge) and
   `header-menu` (the language switch) each pad a wrapper they own, with the
   same value the margin carried, and the list is empty.

5. **Not stacks, by classification.** `story-stage` and `photo-surface` (the
   story's and the hero's text stack, already named in DEC-0171's
   consequences), `contact-section` (portrait, head, four rows) and
   `legal-section` render their own `section`, and their inside is the
   component's own layout. For the first three that is `gap` on their own
   flex boxes. `legal-section` is long-form typography whose heading levels
   carry their own air (polish brief page 12); a uniform stack gap would
   flatten that hierarchy. Converting any of them is a design change, so it
   stays listed in the layout review §6, not done here. The five sections in
   disguise (§6 item 2) stay open as well.

6. **Guards.** `TS-WEB-0017-A31` (`e2e/block-gaps.spec.ts`) now walks every
   stack on every route in both languages at one width per tier — 390, 800
   and 1280 px — and asserts that tier's values (16/8, 16/8, 24/12), written
   out in the test rather than read from the stylesheet. A32 holds the
   markup half, A34 the one home. `scripts/measure-block-gaps.ts` measures
   against the same per-tier values.

## Consequences

- **Pages grow on the desktop only.** Below `xl` no value changes. From
  `xl`, every gap between two blocks grows by 8 px and every kicker gap by
  4 px; a tight section by 4 px. Measured on the production build, page
  height before → after:

  | Page | 390 | 1280 | 1440 |
  | --- | --- | --- | --- |
  | `/` | 6915 → 6915 | 5907 → 5963 (+56) | 6063 → 6119 (+56) |
  | `/en` | 6792 → 6792 | 5758 → 5814 (+56) | 5938 → 5994 (+56) |
  | `/dein-ort` | 5285 → 5285 | 3564 → 3588 (+24) | 3571 → 3595 (+24) |
  | `/mitmachen` | 7847 → 7823 (−24, the banner's new sentence) | 5694 → 5762 (+68) | 5665 → 5733 (+68) |
  | `/dein-kalender` | 9449 → 9449 | 6683 → 6727 (+44) | 6683 → 6727 (+44) |
  | `/deine-region` | 5762 → 5762 | 4477 → 4561 (+84) | 4488 → 4572 (+84) |
  | `/ueber-uns` | 7424 → 7424 | 4959 → 4967 (+8) | 5011 → 5019 (+8) |
  | `/mitmachen/registrieren` | 4014 → 4014 | 2886 → 2914 (+28) | 2886 → 2914 (+28) |

  At 390 px every main page is pixel-identical to the build before, apart
  from the copy DEC-0176's amendment changed and live data — which is also
  the evidence that the seven wrappers of §4 carry exactly the space their
  margins did.
- **Section budgets.** `e2e/section-budget.spec.ts` (G-4) measures at 390 px,
  where no spacing value changed, so no budget and no `KNOWN_OVER` entry
  moves. The rule is "1.5 phone screens"; the desktop has no budget, and this
  record does not invent one.
- SRC-0014 §Shape and Space carries the table and the HTML pattern; the
  design-system contract §2, `TS-WEB-0017` A31/A32/A34, CONTRIBUTING and the
  layout review §6 say the same. DEC-0171 §2 carries an amendment note.
