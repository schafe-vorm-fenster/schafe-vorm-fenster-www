---
id: DEC-0205
title: The price section on /dein-kalender is three columns with three equal figures and three equal buttons
status: accepted
date: 2026-11-12
decided_by: jan-henrik.hempel
---

## Context

Issue #165. The three offers stood one under the other and were hard to
compare: only the own calendar had a real price and a button, the other two
read as asides, and the third offer spoke only of the Landkreis although it
is meant for regions and topics too.

## Decision

1. **Layout.** From `xl` the three tiers are three equal columns, 40 px apart;
   kicker, heading, figure, list and button stand on shared heights
   (`price-tier-row` spans five `subgrid` tracks). Below `xl` they stand one
   under the other with a hairline between them. Every heading is two lines
   with a fixed break, authored as ` / ` in the copy.
2. **Three figures of one size:** "0 €" (explained "dauerhaft kostenfrei"),
   "480 €" ("pro Jahr, zzgl. USt.") and "Auf Anfrage" ("je nach Gebiet und
   Umfang"). The free tier's 0 is the hub's own `price.amount: 0`
   (`community-calendar`, `price_status: fixed`). This supersedes "the free
   tier is not a price, no 0 €" (TS-WEB-0006 D10, TS-WEB-0024 D6/D8) for this
   tier on this page; running text still never resolves it (`tierPrice` vs
   `offeringPrice`, TS-WEB-0006-A12). The enterprise tier keeps no figure,
   no range, no "ab".
3. **Three buttons of one size**, one CTA per tier, each tier still its own
   explanatory module. Weights: tier 1 and 3 `secondary` (outlined), tier 2
   `primary-light` (filled), as the only filled button; none is Pulse and none
   carries `data-cta="primary"`. This holds the CTA-ladder rules unchanged
   (TS-WEB-0006-A18: exactly one CTA per module on the secondary rung; the
   ladder counts per module, not per section, and the filled weight on tier 2
   is DEC-0082 amendment B). Labels and targets: "Jetzt anmelden" ->
   `/mitmachen/registrieren` (owner's answer in #165), "Kalender bestellen" ->
   `/dein-kalender/bestellen`, "Kalender anfragen" -> `/deine-region`
   (the former link "Kalender für euer ganzes Gebiet").
4. **Copy.** Tier 3 reads "Als Regionalkalender" / "Ein Kalender für eure
   Region" with the list "Für Regionen, Stiftungen oder Landkreise · Auch
   als Themenkalender, etwa für Kultur · Kartenansicht ab Januar 2027".
   "Große Städte" and "Eigene Registrierung unter eurem Namen" go.
5. **The Portalize sentence goes.** "Der Kalender unter eurem Namen heißt
   Portalize." is removed; TS-WEB-0024 D7 and A9 now count zero.
6. **Hub check.** "0 €": `community-calendar` price amount 0. "Stiftungen":
   `portalize-enterprise` audiences name Stiftung. "Kartenansicht ab Januar
   2027": the hub says the map is expected before January 2027 (DEC-0061).
   "Themenkalender" is not a hub term: **Deviation**, recorded as DEM-0078.
7. **Tokens.** The design tokens bind (owner instruction): ink `#171D0D` maps
   to `neutral-ink` (`#000000`), `#606657` to `neutral-text2` (`#39412C`),
   price 44/40 px to `font-size-display-mono` (48 px), heading 26/24 px to
   `font-size-h2` (24 to 30 px), eyebrow 13 px to `type-label-size` (15 px),
   list 17 px to `type-body-size` (18 px); `#486202`, `#D1D6CB`, `#E5F2D1`
   match tokens exactly. No new token.

## Consequences

`price-tier-row` and `price-section` carry the grid; `PriceTierCtaVariant`
is `secondary | primary-light`; TS-WEB-0024 D6, D7, D8, A8, A9 and
TS-WEB-0006 D10 are amended; `e2e/pages/dein-kalender.spec.ts` follows.
