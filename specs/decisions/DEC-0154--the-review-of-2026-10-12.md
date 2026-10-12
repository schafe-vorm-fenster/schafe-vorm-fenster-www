---
id: DEC-0154
title: The owner's review of 2026-10-12 — what it settles, what it opens, and that every point is an issue
status: accepted
date: 2026-10-12
decided_by: jan-henrik.hempel
---

## Context

The owner reviewed the preview of `/`, `/mitmachen` and `/dein-kalender`
(`plan/reviews/2026-10-12/`) and delivered seven new designs and one new
photograph. The review has 35 separate points. The earlier review (2026-09-22)
left its per-page points in prose, so one of them — the didactics of the
`/dein-kalender` comparison — was never done and the owner had to ask why.

## Decision

1. **Every review point is a GitHub issue**, #18 to #52, with a category label
   (**Text/Didaktik**, **Design**, **Funktion/Technik**) and a page label.
   `plan/reviews/2026-10-12/spec-impact.md` maps point → issue → spec location →
   status. The designs and as-is screenshots are in that folder and attached to
   the issues.
2. **What the specification now says** (the owner's rulings, taken as given):
   - **No counter on the home page.** TS-WEB-0019 D3 block 2d is removed and
     A14 is superseded. A live figure appears only where it changes what the
     reader does (CG-034).
   - **An explanation is never truncated.** Explain-module step lines wrap and
     the module reserves the height of its longest step. SRC-0014 §Explain
     module and §Fixed heights, CG-025 and the contract change;
     TS-WEB-0022 A18 is superseded.
   - **Solution before problem** (CG-042, new). The model pair "Warum es heute
     hakt" over "Wer euren Termin heute nicht mitbekommt" is withdrawn from
     CG-005 and CG-018. TS-WEB-0022 D2 swaps the halves of its problem block.
   - **A proof line is a sentence.** The 70-character claim limit of CG-027 is
     withdrawn. No replacement number is invented: it is `Q-0086`.
   - **A working label never reaches the page** (CG-035 extended): "Beleg aus
     der Region" is a field name, printed as text.
   - **A button's fill is never its ground** (SRC-0014 §Button, contract §2). The
     secondary variant is for dark and photo grounds.
   - **A place shows its own photograph** (SRC-0014 §Photo surface).
   - **Three elements are redesigned** and the guide records the designs: the
     context band, the contact section, the footer (SRC-0014 §Page chrome
     revised 2026-10-12, contract §1).
3. **What the review opens**, each with a number and its issue: `Q-0086` proof
   line length, `Q-0087` pill cards, `Q-0088` the booking notice, `Q-0089` a place
   without a photograph, `Q-0090` the `ink` ground as neutral black, `Q-0091`
   secondary action on light, `Q-0092` provenance of the new `/mitmachen` hero.
4. **The code is not changed by this record.** The criteria that change are
   marked superseded where a test still asserts the old text (TS-WEB-0019 A14,
   TS-WEB-0022 A18). Each is replaced in the work package of its issue, with its
   test (TS-WEB-0017 D6c).

## Why #51 stayed unchanged

CG-005 and CG-018 wrote the kicker/title pair into the guide as "the split the
review accepts exactly", so a generator following the guide kept it. The guide's
example held the defect in place. Withdrawn here.

## Consequences

- `concept/website-copy-guide.md` (CG-005, CG-018, CG-025, CG-026, CG-027, CG-034,
  CG-035, new CG-042 and CG-043), `concept/website-design-system.md`, the
  contract and TS-WEB-0008, 0019, 0020, 0022, 0024 and 0027 are updated.
- The avoid list in `src/lib/content/validate.ts` gains "mitbegründet" and "(Alpha)"
  **with the content fixes** (#34, #48). Adding them first would fail the build.
