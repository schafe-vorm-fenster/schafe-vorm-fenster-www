---
id: DEC-0183
title: A voice's logo takes the initials well's place, and the home proof stream drops its fifth element
status: accepted
date: 2026-10-28
decided_by: jan-henrik.hempel
---

## Context

The owner reviewed the home proof stream ("Was andere sagen") on
2026-10-28 and asked for two changes:

- The voices should show their logos instead of initials. The NØRD digital
  convention, the Stiftung Lebendiges Lehre, the Volkshochschulen in
  Vorpommern-Greifswald and the Kulturlandbüro Uecker-Randow each have one.
- The fifth element, "Seit 2018 in Betrieb, kein Pilot und kein Prototyp."
  with the label "Beleg aus der Region", goes. It names no sender and has no
  logo, so in a stream of voices it reads as nothing.

SRC-0014 §Proof stream already allowed the first: "A cleared portrait or
logo takes the well's place; no proof record carries one for a voice
today". The marks of third parties live in `@schafe-vorm-fenster/partners`
with their usage rights (hub ADR-006 §7). Before this decision the package
held two of the four (Lehre, Kulturlandbüro); the hub branch
`feat/partner-logos-noerd-vhs` adds the other two and an optional `aliases`
list, so a card can find its partner by the name it shows in either
language.

## Decision

1. **A voice's logo takes the initials well's place** in the stream forms of
   `proof-card` (`feature`, `compact`), on every page that renders them —
   `/`, `/mitmachen`, `/dein-kalender`. The mark sits on a `paper` plate at
   the well's 40 px height and its own width, capped at 12rem and at half the byline, so a
   phone keeps room for the name. It is never
   cropped to the circle and never recoloured (`@schafe-vorm-fenster/partners`
   rule 3). It is decorative, like the well, because the name stands beside
   it as text.
2. **The marks come from `@schafe-vorm-fenster/partners` as package subpath
   imports** (`src/lib/content/partner-logos.ts`), the only way a logo enters
   this repository (TS-WEB-0017-A6). A card is matched to its partner by its
   context line against the partner's `name` and `aliases`, ignoring case and
   spacing. Where nothing matches, the card keeps its initials well.
3. **The home stream drops its fifth candidate** (`in-operation-since-2018`)
   from `home-8-proof-stream` in both locales. DEC-0048 keeps the home count
   of 5 positions. With four candidates the fifth position is unfilled and
   renders nothing (SRC-0001 §4), and TS-WEB-0019-A8 counts 4.

## Consequences

- **All four logos carry `usage_rights: unverified`** in the partners
  package. Under the package's rule 1, that keeps them off a public surface
  until clearance is on record. The protected, `noindex` preview shows them
  the way it already shows the three proof elements that wait for clearance
  (`content/pages/home/de.md`, `clearance: pending`). The pre-go-live
  hardening round has to clear the marks or remove them.
- **The NØRD mark has no published logo file.** The hub entry records that it
  was cut out of the official stage graphic, unchanged, and placed on the
  convention's own navy.
- **The website depends on the hub release.** Two of the four imports
  (`noerd-digital-convention`, `volkshochschule-vorpommern-greifswald`) exist
  only from the partners release that carries the hub branch. The website
  change needs that version in `package.json` and the lockfile before it
  builds.
- The `/dein-kalender` stream's voices match no partner today and keep their
  initials. `/mitmachen` shows the Lehre and VHS logos.
- Verified by `src/lib/content/partner-logos.test.tsx` (lookup by name and
  alias, the logo in the well's place, the well without one),
  `e2e/module-designs.spec.ts` (TS-WEB-0024-A25 / TS-WEB-0022-A23: the well
  or the logo, 40 px high, decorative) and `e2e/pages/home.spec.ts`
  (TS-WEB-0019-A8: 4 elements).
