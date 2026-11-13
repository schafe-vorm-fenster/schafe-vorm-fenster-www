---
artefact: manual-verification-register
status: DRAFT
date: 2026-09-26
---

# Manual verification register

The instrument for every acceptance criterion whose level is `manual`. A
screen-reader pass, a Lighthouse judgement, a legal reading: nobody can write
a test for these, and that is not a reason to leave them unverified. Here a
human says what they checked, against which build, and when.

`pnpm check:coverage` reads this table. A row counts as coverage
(**ATTESTED**) while all of this holds:

- the criterion id is one an `## Acceptance criteria` table defines, and its
  level there is `manual` — a row for a criterion at any other level is an
  error, because a human statement is not the instrument where a test is;
- `Result` reads `pass`;
- `Checked` is at most **90 days** old.

**An attestation expires.** After 90 days the criterion reopens and the check
counts it again. That is the point: a manual verdict is about one build, and
the build moves on. Re-checking is the work; re-dating the row without
re-checking is a lie the register cannot catch, so it is the one thing this
file asks to be taken seriously.

`Build` is the commit the check ran against. `Evidence` is where the artefact
of the check lives — a screenshot, a report, a transcript, an issue. "I looked
at it" is not evidence.

| Criterion | Checked | By | Build | Result | Evidence |
| --- | --- | --- | --- | --- | --- |

<!-- No attestation yet. Every `manual` criterion is therefore open, and
     `state/coverage.md` counts it. Adding the first row is the work, not
     editing this comment. -->
