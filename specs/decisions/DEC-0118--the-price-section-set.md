---
id: DEC-0118
title: The price section is one paper section with a lime band and three rows — the row renders its one CTA itself, the setting row takes its shape from the drafts, and "wird geprüft" is the placeholder badge
status: DRAFT
date: 2026-09-25
decided_by: the engineering team
---

## Context

T-06 builds the components the 2026-09-23 design review asked for
(`plan/reviews/2026-09-23/Design - Preis Section 1–2.png`, `Design -.
Portalize Einstellungen 1–2.png`): a highlighted price section, tags with
an excluded state, a setting row, a hint banner. The determinations fix
most of the form — `concept/website-design-system.md` §Page Rhythm (lines
942–948: a `lime-500` band, three rows in **one** `paper` section on a 1 px
`line` hairline), §Badge and chip (421–429: the 30 px tag and the one
excluded state), `TS-WEB-0024 D6` (one CTA per tier, quiet · primary-light ·
quiet, never Pulse), `TS-WEB-0022 D11` and `DEC-0107 §3` (the banner: no
figure, no `data-cta`, the offering record's source list). What they leave
open is recorded here, and the two places where the drafts and the
specification disagree are settled the specification's way (`DEC-0104`).

## Decision

1. **One section, three rows, and the row renders its one CTA.**
   `price-section` is a single `paper` `section-shell` rendered uncontained;
   the `lime-500` band (`price-band`) and the row group each bring their own
   `.container`, so the band runs edge to edge instead of sitting in the
   section's 16 px padding like a picture in a mount. Rows are divided by
   `.row + .row { border-top: 1px solid line }`. `price-tier-row` takes a
   **typed CTA descriptor** (label, route id, optional query/hash,
   `dataCta: "secondary" | "equal-weight"`) and renders the `Button` itself —
   there is no `ReactNode` slot and no second slot, so "exactly one CTA per
   tier" and "never `data-cta="primary"`" (`TS-WEB-0024-A8`, `TS-WEB-0006-A18`)
   are properties of the type, not of a page's discipline. The weight is
   read from `PRICE_TIER_CTA_VARIANT`, derived from the offering id. The
   drafts' ink pill on tier 1 and Pulse on tier 2 (`TS-WEB-0024 D3` lines
   76–77, `D6` 144–146) are the named deviations and are not built.

2. **The free tier shows no "0 €".** The drafts set "0 € immer" at the figure
   size; `TS-WEB-0006 D10` and `TS-WEB-0024 D6` say the free tier is *a
   permanence statement, not a price*. The row renders the figure at
   `--font-size-display-mono` only for a `priced` offering, with the
   qualifier beside it in the same paragraph; `permanent` and `on-request`
   render the `price-tag` statement at the mono card size — so tier 3's
   "Auf Anfrage" stands at the 21 px mono size, not at the figure size the
   draft gives "Anfrage / nach Größe": a request is not a price either, and
   the figure size is reserved for the one figure. The qualifier is
   the existing `price-tag` wording ("/ Jahr, zzgl. USt."), split by a new
   `formatPriceParts()` beside `formatPriceFigure()` so there is one
   formatter. The draft's second link under tier 2 ("Wie das aussieht →") is
   a second CTA and is not built.

3. **The tier title takes the Sub head role.** The drafts set it at 26 px;
   no token carries 26 and `TS-WEB-0002-A10` forbids a size declared outside
   the token import, so the title uses `--type-subhead-size` (the role whose
   clamp contains 26), as `publishing-path`'s headline does. The tier's icon
   well glyph is derived from the offering id (`house` · `globe` ·
   `map-pin`, the drafts'), like the weight. Every tier CTA carries the
   onward `arrow-right` glyph, tier 3 included — the draft's calendar glyph
   on "Beratungstermin buchen" is not built, because the row's CTA leads to
   `/deine-region` (`TS-WEB-0024 D6`), not to a booking.

4. **`tag` defaults to `ink`/`paper`.** The design system says "fill `ink`
   with `paper` text, or `surface` with `ink` text inside a lime section";
   the drafts show a light fill on paper. The spec wins: `tone="ink"` is the
   default, `tone="surface"` is for a lime ground. The excluded state is
   markup, not colour: `data-excluded="true"` and an `<s>` element around
   the label, with a transparent 1 px border on every tag so a struck tag
   keeps the same box.

5. **The setting row's shape.** A 40 px `lime-100` well with a 24 px
   `lime-800` glyph; an `h3` title; the one core sentence; an optional
   example paragraph at Meta/`text2`; an optional tag row rendered from
   `{ label, excluded? }` items through `tag`; rows are `li` inside
   `SettingRows` (`ul`), divided by the `line` hairline. Nothing in the row
   is a control.

6. **"wird geprüft" is the placeholder badge.** The drafts show an inline
   mono "· wird geprüft" beside a setting's title. It says "this is not
   confirmed yet", which is exactly the role the design system gives the
   placeholder badge (`concept/website-design-system.md` 414–419: the one
   "this is not real" pair, contrast-checked at badge size). The marker is
   therefore `badge` with `tone="placeholder"`, inline in the title, not a
   new text style. The label is the caller's; the component carries no
   default string.

7. **The hint banner is a `role="note"` block with a `data-hint-banner`
   hook.** `surface` ground, an `info` glyph in the lime well, the caller's
   statement, and the standard sources as a `tag` row — read from
   `src/lib/pricing/standard-sources.ts`, a transcription of
   `@schafe-vorm-fenster/offerings#community-calendar` lines 111–113 held
   against the package by a unit test (the `offerings.ts` pattern). No
   `data-cta`, no control, no figure; the German and English labels are the
   record's own terms, not sentences — "Council information system" without
   the German term in brackets, so the tag fits a phone column; and the
   banner's tag row lets a term wrap inside its pill rather than push the
   page wider than the viewport (the tag's own `nowrap` stays, for rows that
   may be struck).

8. **Two derived values enter `app/styles/components.css`**: `--height-tag:
   30px` (the design system's tag height) and `--height-icon-well: 40px` (the
   well of the tier row, the setting row and the banner — the same SRC-0014
   §Wells value DEC-0117 declares for the objection block, so the two land
   as one token at the merge). Both are composed from the design system's
   stated numbers, like the seven fixed heights already there; no colour or
   family literal is added.

9. **`publishablePrice` follows `price_status`, not the display.**
   `TS-WEB-0018-A2` names `community-calendar` (`price_status: fixed`, 0
   forever) as `true`; the function answered `false` because it tested
   `display === "priced"`. It now returns true for `priced` and
   `permanent`, and `offerings.test.ts` holds the table against the shipped
   frontmatter for all six ids `TS-WEB-0018-A2` names: the two withheld
   offerings (`local-advertising`, `portalize-website-widget`) enter the
   table as `withheld`, without the widget's indicative figure, so the
   truth table is complete and no page can resolve a figure for them. `publishedFigure()` is added so the JSON-LD `Offer` reads the
   480 from the same import (`TS-WEB-0024-A11`), and it throws for an
   offering without a figure rather than emitting one.

10. **`offer-tier` is deprecated, not deleted.** `/dein-kalender` still
    composes it (T-13 moves the page to `price-tier-row`). Its
    `secondaryCta` slot is removed, its weight table is a re-export of
    `PRICE_TIER_CTA_VARIANT` (so tier 1 is `quiet`, as D6 says, not
    `secondary`), and the page's two second CTAs are removed — the minimal
    edit that keeps the page compiling and D6-conformant until T-13 lands.
    The folder is deleted once nothing imports it.

## Consequences

- `src/components/price-section/` (`PriceSection`, `PriceBand`,
  `PriceTierRow`), `src/components/tag/`, `src/components/setting-row/`,
  `src/components/hint-banner/`; `src/lib/pricing/standard-sources.ts` and
  the two tests; the gallery shows each.
- T-13 composes `/dein-kalender`'s tiers from `PriceSection` and three
  `PriceTierRow`s and then deletes `src/components/offer-tier/`. T-12
  places one `HintBanner` at the end of `/mitmachen`'s slot 3 with
  `sources={standardSources()}`.
- `e2e/pages/dein-kalender.spec.ts`'s briefing assertions that read tier 2's
  outbound link no longer find one there; the appointment URL occurs once on
  the page, in the contact section (`TS-WEB-0024 D3`). T-13 owns that spec.
- No placeholder copy was written: every string the new components render is
  a caller's prop, and the gallery's demo wording is the drafts' or the
  dictionary's.
