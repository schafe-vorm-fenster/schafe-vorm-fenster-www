---
id: DEC-0141
title: The instrument decides coverage, not the mention — and the backlog may only shrink
status: DRAFT
date: 2026-09-26
decided_by: jan-henrik.hempel
---

## Context

The owner asked two questions on 2026-09-26: is 272 of 428 acceptance criteria
covered a problem, and why can implementation coverage not be measured at all.
Both answers turned on the same defect.

**The 272 was not true.** `check:specs` W3 counts a criterion as covered when
its identifier occurs anywhere in a file a runner runs — the `referencedIds`
scan reads each file whole. A comment counts. That is not a hypothesis: the
same day, the T-15 round added two prose mentions of A14 of TS-WEB-0016 to
*explain that its browser walk was still missing*, and W3 fell from 156 to 155.
The reviewer caught it by re-running the check rather than reading the report.
Nobody was gaming anything; the metric simply measures the wrong thing.

Measured strictly — the identifier inside a test title, which is what
`specs/verification/verification-strategy.md` § *Linking tests to specs*
already prescribes — the true figure on `294e5a9` was **246 of 428**, with 33
criteria named only outside a title and 149 named nowhere.

**Implementation coverage was said to be unmeasurable.** It is, but not for the
reason it looked: there is no requirement-to-code link, and none is needed. The
acceptance criterion *is* the measure of implementation. What genuinely cannot
be computed is whether a criterion set **exhausts** its requirement — that is a
judgement, and a check that claimed to compute it would be lying.

## Decision

### 1. `pnpm check:coverage` measures the instrument, not the mention

A new meter, `scripts/check-coverage.ts`, in the `check` chain after
`check:locators`. It asks one question per criterion — **which instrument, at
the level the criterion itself declares, names it?** — and answers with one of
five verdicts:

| Verdict | Earned by | For levels |
| --- | --- | --- |
| VERIFIED | the identifier inside a `describe` / `test` / `Scenario` **title** in a file a runner runs | `static`, `unit`, `integration`, `e2e` |
| METERED | a `scripts/check-*.ts` the `check` chain invokes; a step in `.github/workflows/` | `static`; `tool` |
| ATTESTED | an unexpired `pass` row in `specs/verification/manual-checks.md` | `manual` |
| NAMED ONLY | the identifier is in a runner file, in no title | any |
| MISSING | nothing names it | any |

The level→instrument mapping is **not this record's invention**: it is the
§ *Levels* table of the verification strategy, read as written. `tool` says
*"an external tool is the verdict … CI job"*, so a Vitest title cannot close a
`tool` criterion however convenient that would be — and the first run showed
what that costs honestly: **`tool` 0 of 39, `manual` 0 of 31.**

**NAMED ONLY is a verdict of its own** rather than a flavour of MISSING,
because it is the one that used to read as green. A reader of
`state/coverage.md` can see the difference between "nobody wrote a check" and
"somebody wrote the name".

### 2. The title, because the runner then says it out loud

VERIFIED requires the identifier in the title and not merely in the file. Two
reasons, and the second is the one that matters:

- The runner prints a title on every pass and every failure, so the link
  between criterion and check is visible in the test **output**, not only in
  the source. A claim of coverage becomes checkable from outside the repository.
- A title is a sentence somebody has to write. The A6 case of TS-WEB-0019 is
  the illustration: its title reads *"every opener a question"* while the
  criterion it names requires a statement, and the body asserts
  `endsWith("?")` — the opposite. A comment could never have exposed that; a
  title does, to anyone reading the two side by side.

The cost is one-off churn: 33 criteria whose identifier sits in a comment now
read as open, which is what they are.

### 3. Two gates, deliberately unequal

**Rule 1 — a criterion born in a commit arrives with its instrument.** No
budget, no exception. The criterion set of the working tree is compared with
`git show HEAD:` of the same files; a criterion that is new *here* and is not
VERIFIED, METERED or ATTESTED fails the build, and the message names which
instrument its level wants. This is absolute because it is cheap: whoever
writes the criterion is the person who knows how to check it. **The backlog
cannot grow.**

**Rule 2 — the backlog may only shrink.** `specs/verification/coverage-budget.json`
holds the worst tally allowed, per open verdict. A worse run fails and says how
many criteria must be closed. **A better run also fails**, asking for the number
to be written down in the same commit: an unrecorded improvement is budget
somebody can spend again without noticing it was ever spent. Raising a number is
a governance change — it needs a decision record naming which criteria were let
go and why.

149 MISSING cannot be closed in one commit. A warning nobody has to act on is
how they got to 149; a ratchet turns the same number into a direction.

### 4. `manual` gets a register, and an attestation expires

`specs/verification/manual-checks.md` is the instrument for the 31 `manual`
criteria: criterion, date, person, build, result, evidence. A row counts while
it says `pass` and is at most **90 days** old.

**The expiry is the point, not a limitation.** A manual verdict is about one
build and the build moves on, so a `manual` criterion is never permanently
closed — it reopens and is checked again. A row for a criterion whose level is
not `manual` is an error: where a test is possible, a human statement is not the
instrument.

The register ships **empty**. All 31 are open, `state/coverage.md` counts them,
and writing the first row is work rather than an edit to this record.

### 5. What 100 % can mean, and what it cannot

Automated coverage of all 428 is **impossible by construction**: 31 criteria
are `manual`. The reachable maximum is 397 automated plus 31 attested.

"100 %" therefore means: *every criterion has a live, named instrument at its
declared level, and every attestation is current.* It does not mean the website
is correct, and it does not mean the criteria are sufficient — §6.

### 6. Sufficiency stays a judgement and is not faked

Whether a requirement's criteria exhaust it cannot be computed. This record
deliberately builds **no** measure for it. The gap is named here so that the
coverage figure is not read as more than it is, and a later decision may add a
recorded per-requirement judgement — one whose gate asks that the judgement
**exists**, never that it says yes. A forced yes would be a forgery.

### 7. `DEC-0134` records the same defect from the other end, and is not duplicated here

The T-15 round hit this defect from inside and recorded it the same day as
`DEC-0134 — a comment is not a test`: its remedy was local (write "A14 of
TS-WEB-0016" so the scan stops counting the sentence) and it kept the gap
visible in `state/open.md` instead of in a metric. This record does not repeat
that reasoning; it builds the instrument that makes the local remedy
unnecessary. Both stand, and `DEC-0134` is the one that names the incident.

### 8. W3 stays, for now, and says less than this check

`check:specs` W3 is left in place and untouched. Two reasons: it also counts
requirement identifiers, which this check does not, and removing a number that
appears in several records mid-wave would obscure the comparison this record
rests on. W3 is now the looser of two signals and the tighter one gates. Folding
them is a follow-up, recorded in `state/open.md`.

## Consequences

- `scripts/check-coverage.ts` and `scripts/check-coverage.test.ts` (21 cases,
  including the comment-not-coverage case that reproduces the A14 defect over a
  fixture, both ratchet directions, and the 90-day boundary).
- `package.json`: `check:coverage` in the chain after `check:locators`.
- `specs/verification/coverage-budget.json` at the measured tally —
  NAMED ONLY 33, MISSING 149.
- `specs/verification/manual-checks.md`, the empty register with its rules.
- `state/coverage.md`, written by the check, listing every open criterion.
- `TS-WEB-0017` gains `D6c`, `A20` and `A21`. **Both new criteria arrived with
  their tests**, which is rule 1 applied to this record's own work — the run
  reports "2 criterion(a) new in this commit, 0 without an instrument."
- The true coverage figure is now visible and is worse than the one it
  replaces: **248 of 430 closed, 58 %** — `static` 47/86, `unit` 26/30,
  `integration` 46/73, `e2e` 129/171, `tool` 0/39, `manual` 0/31.
- No requirement, need or goal changed. No identifier was renumbered or reused.
- Nothing moved off `DRAFT`.

### What this record does not do

It closes no criterion. It writes no test, no CI job and no attestation: the
39 `tool` criteria still have no external tool wired, and the 31 `manual` ones
still have nobody's signature. What it changes is that none of that can be
mistaken for coverage any more, and that the number can no longer rise.
