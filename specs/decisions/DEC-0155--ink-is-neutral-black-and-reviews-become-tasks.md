---
id: DEC-0155
title: Ink is neutral black, readability goes before a fixed height, a review is not closed until every point is a task — and why the tests let these through
status: accepted
date: 2026-10-12
decided_by: jan-henrik.hempel
---

## Context

The owner's review of 2026-10-12 (DEC-0154) found defects the test suite had
passed. Asked why, and what to change in the test setup, the owner also settled
`Q-0090` and the explain-module trade-off. The answers below come from reading
the tests, not from assumption.

## Decisions

1. **Dark green as a surface leaves the design; `ink` is neutral black,
   `#000000`** (answers `Q-0090`).
   - `brand-design` 2.9.0 carries it (`go-to-market-os` PR #620, a changeset,
     minor). `neutral.ink` was the lime hue at 3 % chroma; across a section it
     reads as dark green. One value does text, primary fill, control wells and the
     dark ground, so they cannot disagree.
   - The scrim ladder was already `rgba(0,0,0,α)`, so a photo section's scrim now
     runs into a ground of its own colour. The exception to "never pure white or
     black" widens from the scrim to the ink ground.
   - Contrast only improves: ink on paper 20.17:1 (was 16.56), on lime-500 12.42
     (10.20). The ratios stated in the guide and in component comments are
     updated. Earlier decision records keep the values of their day.
   - **Until the pin moves**, `app/styles/brand.css` overrides the eight places
     the package writes the old value (the pin is exact, DEC-0044). It is deleted
     *after* the pin moves, never before. The boards in `concept/v2.0/` and their
     renders are updated.
   - **Not decided here and tracked:** the remaining dark-green fills
     (`lime-700` to `lime-950` as a background: hover states of chips, search
     submit, contact buttons and the primary button, the "Amtlich" badge, the
     accent kicker). The rule is stated: dark green is for text, links and icons,
     not for a fill. The places are in issue #57.
2. **Readability goes before a fixed height** (the explain module, issue #47). The
   fixed height serves layout stability; it never justifies cutting text. Order of
   remedies: shorten the copy or make the three steps equally long; where every
   step needs two lines, the fixed height is two lines for all three. Never an
   ellipsis.
3. **A review is not closed until every point is a task** (new `pnpm check:reviews`).
   From 2026-10-12 a review file is cut into points by `---`, and every block with
   prose ends with `Issue: #n` or `Kein Task: <reason>`. The check runs in
   `pnpm check`. The review of 2026-09-22 died of exactly this: a point that
   stays in prose has no owner.

## Why the tests let these through

| Defect | What the suite measured | What it did not |
| --- | --- | --- |
| White on white (#28) | `e2e/cta-contrast.spec.ts` measures the **label** against the **button's own fill**: its ground walk starts at the button and stops at the first opaque layer, which is the button's own background. `paper` fill, `ink` label: 16:1, green | whether the **fill stands out from what is around it**. The guide said "a button's fill is never its ground" nowhere a test could read it |
| Dark green ground (#19) | `check:contrast` reads **ratios**, and the new `A22` reads **gradients** | a **hue**. A contrast ratio cannot see that `#171D0D` is green; the scrim fix of DEC-0151 was taken for the whole problem |
| Truncated explanation (#47) | `TS-WEB-0022-A18` **asserted the truncation**: "every step line on exactly one line" | that a human can read the text. The test encoded a wrong rule perfectly |
| Test dates shown (#52) | the live-data layer's tests use fixtures | anything about real data a test organiser put there |
| Stand-in copy in the page (#37) | the copy lint reads fields by role | a field **name** used as text |

Three patterns, and what each asks for:

- **Tests verify the written criteria, and the criteria were not measurable.**
  "Visible", "readable", "not green" had no instrument. Fix: measure the thing
  itself, not a proxy for it.
- **A test can enforce a bug when the spec is wrong** (A18). A criterion that
  forbids a failure mode of readability should be checked against the reader's
  outcome, not a mechanism.
- **Nothing connected a review to work.** The tests cannot catch a point that
  never became a task.

## Instruments added (all in `pnpm check` or the e2e suite)

- **`TS-WEB-0017-A28`** (`check:brand`): the effective `ink` has equal R, G and B,
  and the retired ink is written nowhere, in sources or boards. Unit-tested.
- **`TS-WEB-0017-A29`** (`e2e/cta-visible.spec.ts`): every filled `[data-cta]`
  stands out from its ground by 3:1, on every route, both languages, 390 and
  1280 px. Six controls fail today and are **named** with their issues (#28, #41);
  any other control that disappears fails the route. Measured on the first run:
  the defect was not two buttons but eleven labels on every page, because the
  contact section's actions sit on `lime-100` too.
- **`check:reviews`**: the review-to-task rule above, unit-tested.

## Still to add (issue #58)

A sweep for text that is clipped (`text-overflow: ellipsis` that actually
clips, line clamps) on every route; a check that no dark-green fill from
`lime-700` to `lime-950` is a background; screenshot baselines for the
components the owner redesigned. Tracked, not built here.
