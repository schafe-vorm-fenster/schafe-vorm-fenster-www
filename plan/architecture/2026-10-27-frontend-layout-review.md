# Frontend layout review — sections, container, blocks (2026-10-27)

Issues #90 and #108 (owner review 2026-10-27). Decision: DEC-0171. Guards:
`TS-WEB-0017-A31`, `TS-WEB-0017-A32`. Rules: SRC-0014 §Shape and Space
*Who owns which space*, §Layout Grid; design-system contract §2.

The owner asked: *how is the grid built, how are the sections built? This
should not happen if the layout implements clean blocks and sections.* Short
answer: width had an owner, vertical space at the section edge had an owner,
**the space between two blocks inside a section had none.** Every gap there
was a side effect of whatever margin the block before happened to carry.

## 1. The layers as built (before this change)

| Layer | Built by | Vertical space it set |
| --- | --- | --- |
| Page | `app/[lang]/<route>/page.tsx` → `PageFrame` (`app/[lang]/_page-frame.tsx`) appends context band and closing block | none; sections butt |
| Section | `SectionShell` (`src/components/section-shell/section-shell.tsx`) — ground + `padding-block` 28/22 px (`--section-padding-block*`, `app/styles/components.css`). Other components render their own `section`: `photo-surface`, `story-stage`, `contact-section`, `legal-section`, `price-section` (via an uncontained shell) | its padding |
| Container | global `.container` (`app/styles/base.css`): 1200 px content box + outer margin, `container-type: inline-size` so `--span-N` resolve in `cqi` (DEC-0150). Shell wraps children in it unless `contained={false}`; uncontained callers re-add it themselves (`price-section`, `photo-surface`, `scene-block`, `story-stage`) | none |
| Block | whatever the page put inside the container: `h2`, `p`, components, page `div`s, `MotionReveal` | **its own margin, if any** |
| Inside a block | component CSS modules, flex/grid `gap` | internal |

**Who owned the space between blocks:** nobody by design. In practice:

1. Element defaults — `h1–h4` and `p` carry `margin: 0 0 space-4`
   (`app/styles/base.css`), so text blocks got 16 px below them.
2. Components carry **no** outer margin (correct for a component), so after
   any component the next block stood at **0 px**. That is #90.
3. Pages patched single places with module margins: `.handoff { margin-top:
   space-6 }` (`app/[lang]/page.module.css`), `.exit { margin-top: space-4 }`
   (`app/[lang]/dein-kalender/bestellen/page.module.css`), `.stories {
   margin-top: space-6 }` (`app/[lang]/ueber-uns/page.module.css`).
4. Some groups used `flex` + `gap` instead (`.chapter`, `.chapterBody` on
   `/ueber-uns`), others nothing.

### Where the same job is solved several ways

- **Space between blocks:** element margins, page-module margins, flex gap,
  and nothing — four mechanisms, three values (0, 16, 24).
- **Outer margin through `className`:** a page or component hands a margin to
  another component's root (`<StoryDisclosure className={styles.stories}>`).
  Two single-class rules on one element; the production build ships the
  component chunk later, so the component's `margin: 0` won and the page's
  `margin-top` was dead in production (#108). Seven more instances inside
  components (`archive-row`, `feature-benefit`, `hero-block`,
  `person-profile`, `quote-card`, `site-header/header-menu`, `value-story`),
  now listed in `scripts/check-brand.ts` (A32).
- **Section padding re-implemented inside a section:** `price-band`,
  `price-tier-row`, `publishing-path` (`padding-top: --section-padding-block`),
  `app/[lang]/_pages.module.css .benefitBand` (`margin-block` **and**
  `padding-block` of a section, inside a section), `archive-block`
  (`padding: --section-padding-block-tight`). Each is a section in disguise.
  Not changed here (follow-up, §6).
- **Trailing margin at the section edge:** `section-shell` zeroed the
  margin of the section's *own* last child; the container's last paragraph
  still added 16 px to the bottom padding. Its comment says so (DEC-0129
  §12). Every section ending on a paragraph was 16 px taller than its
  neighbour.

## 2. Root causes

**#90** (`/mitmachen`, path 3): the `wege` section's container held
`p[data-path-availability]` → `div[data-path-module]` (explain module, ending
in the CTA) → `HintBanner`. The module and the banner are components; neither
has an outer margin; nothing else spaces siblings → **0 px** at 390 and 1280.

**#108 a** (`/ueber-uns`, chapter 03): the chapter head and the story grid sit
inside `MotionReveal`, one block of the section. Inside that wrapper nothing
owned the space; the page asked for it with `className={styles.stories}`
(`margin-top: space-6`) and lost the cascade to `story-disclosure`'s
`.grid { margin: 0 }` → **0 px** at 390 (measured `margin-top: 0px`).

**#108 b** (`/ueber-uns/archiv`): each year is a bare `div` with `h2` +
rows. The heading's 16 px below plus the row's 16 px top padding put it
**16 px** from the link above and **16 px** above its own hairline — equal
distances, so with the hairline under it the heading read as the last line
of the previous entry.

All three are one defect: **no layer owned the space between blocks, and
wrappers created boxes with no rule at all.**

## 3. Measurement

`scripts/measure-block-gaps.ts` (Playwright, production build on :3242,
every route in both languages, 390 and 1280 px). Definitions live once in
`e2e/support/block-gaps.ts` and are shared with the guard:

- *content box* — audit scope `sections`: every `.container` directly inside
  a `section`/`aside`, else the section itself; guard scope `stacks`: every
  `[data-stack]`.
- *block* — a direct child the browser draws: not `display: none`, not
  absolute/fixed, taller than 1 px; `display: contents` looked through.
- *gap* — between consecutive blocks that overlap horizontally, the next
  top minus the previous bottom.

Before (commit `22e49ce`, `next-2026`): 156 pairs under 16 px. 96 are the
kicker → heading step (8 px, intended). The other 60 are 15 distinct cases,
each seen at both widths and in both languages:

| # | Route | Pair | Gap | Status |
| --- | --- | --- | --- | --- |
| 1 | `/mitmachen` `wege` | path module → hint banner | 0 | **#90**, fixed |
| 2 | `/mitmachen/registrieren` | step indicator → `h1` | 0 | fixed |
| 3–9 | `/dein-kalender/bestellen` | step indicator → summary → price note → `h1`; place search → offers → scope picker → *Weiter* → requirement | 0 ×7 | fixed |
| 10 | `/dein-kalender` `embed-config` | `h3` → setting list | 12 | outside a stack (uncontained, page wrapper); heading binds to its list — kept |
| 11 | `/dein-kalender` `tiers` | tier row → tier row (×3) | 0 | hairline rows by design (SRC-0014 §Section grounds) — kept |
| 12 | `/dein-ort` `story-stage` | `h2` → lead | 12 | component-internal — kept |
| 13 | `/ueber-uns` `zitat` | quote → photo credit | 12 | caption of a photo surface — kept |

Not visible to a one-level walk, found from #108 and the before/after
screenshots (nested inside a wrapper):

| Route | Pair | Before | After |
| --- | --- | --- | --- |
| `/ueber-uns` `kapitel-3` | chapter heading → stories | 0 (390) | 16 |
| `/ueber-uns/archiv` | year heading: above / below | 16 / 16 | 32 / 16 |
| `/deine-region` | search hint → counter pill | 0 | 16 |
| `/deine-region` | paragraph → paragraph (region tariff) | 0 | 16 |

Inconsistent (over the token, from an ad-hoc margin): `/` `place-dates`
live module → hand-off **24 px** (`.handoff`) → 16. The hero's internal
24/28/36 px steps are `hero-block`'s own layout and outside any section stack.

After: **0 pairs** under the token in any stack (`--scope stacks`, 322
pairs: 96 × 8 px after a kicker, 226 × 16 px). The 24 remaining audit pairs
are rows 10–13 above, all outside a stack and all intentional bindings.
Page heights moved by −16 px (a section that ended on a paragraph lost the
leaked margin), +16 px per fixed touching pair, +112 px on the order flow and
the archive.

Fixed in total: **14 distinct cases** — #90 (1), the register flow (1), the
order flow (7), #108 (chapter 03 and the archive's year headings, 2), the two
nested pairs on `/deine-region` (2), the hand-off at 24 px (1) — plus the
trailing-margin leak on every section that ended on a paragraph. Four
audit cases (rows 10–13) are intentional and stay.

## 4. The target model (implemented)

| Level | Owner | Value |
| --- | --- | --- |
| Section edge | `section-shell` `padding-block` | 28 / 22 px |
| Between blocks | the **content stack** `[data-stack]` | `--block-gap` = `space-4` (16 px), all breakpoints; `--block-gap-bound` = `space-2` (8 px) after `[data-kicker]` |
| Outside a block | nobody | 0 — a block has no outer margin |
| Inside a block | the component | its own gaps from the space scale |
| Width, left edge | `.container`, `--span-N` | DEC-0150, unchanged |

- **The primitive:** one global rule in `app/styles/base.css`:
  `[data-stack] > :nth-child(n) { margin-block: 0 }`,
  `[data-stack] > :nth-child(n + 2) { margin-block-start: var(--block-gap) }`,
  `[data-stack] > [data-kicker] + :nth-child(n) { margin-block-start:
  var(--block-gap-bound) }`. The `:nth-child()` lifts it to (0,2,0), so a
  component root's one-class `margin: 0` cannot undo it whatever the
  stylesheet order.
- **Who carries `data-stack`:** `section-shell`'s container (and its lede
  container when uncontained, whose bottom padding then keeps the step to the
  full-bleed child), `motion-reveal`, `archive-filter`'s list, and the
  archive's year groups. A wrapper that groups blocks is a stack.
- **Rows are one block:** the archive rows of a year now stand in one wrapper,
  so the stack never spaces them.
- **Removed ad-hoc margins:** `.handoff`, `.exit`, `.stories`; the kicker's
  and the transition's own `margin-bottom` in `section-shell` (the stack owns
  them).

Tokens: `--block-gap` and `--block-gap-bound` in `app/styles/components.css`,
both aliases of the brand space scale.

## 5. Guards

- **`TS-WEB-0017-A31`** — `e2e/block-gaps.spec.ts`: every route, DE and EN,
  390 and 1280 px, every `[data-stack]`: gap ≥ token; the second block's
  computed `margin-top` equals the stack's value and the first's
  `margin-bottom` is 0 (so a component that brings or cancels a margin
  fails); no margin at a stack's edges. 48 tests.
- **`TS-WEB-0017-A32`** — `pnpm check:brand`: a class passed as `className`
  to a component that declares a vertical margin fails. The seven existing
  hand-ins are named; the list may only shrink.

## 6. Follow-up (not in this change)

1. The seven `className` margins in A32's list — each wants the parent's
   `gap` instead. **Done 2026-10-28 (DEC-0178 §4):** each component pads a
   wrapper it owns; A32's list is empty.
2. The five sections in disguise (§1) — `price-band`, `price-tier-row`,
   `publishing-path`, `.benefitBand`, `archive-block` — should either be a
   `section-shell` or drop the section padding.
3. `story-stage`, `photo-surface`, `contact-section`, `legal-section` render
   their own `section`; their content could use `data-stack` too, which
   would bring them under A31. **Classified 2026-10-28, not converted
   (DEC-0178 §5):** none is mechanical. The first three are one block whose
   inside is the component's own layout (`gap` on their own flex boxes);
   `legal-section` is long-form typography whose heading levels carry their
   own air above them, and a uniform stack gap would flatten that hierarchy.
   Converting any of them is a design change for the owner. Still open.
4. Whether `--block-gap` should step up from `xl` (e.g. `space-6`) is an
   owner decision (DEC-0171 §2). **Decided 2026-10-28 (DEC-0178):** `space-6`
   from `xl`, bound gap `space-3`, tight section edge `space-6`.
