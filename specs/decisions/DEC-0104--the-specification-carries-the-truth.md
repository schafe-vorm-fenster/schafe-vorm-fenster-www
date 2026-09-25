---
id: DEC-0104
title: The specification carries the truth — a source is cited, not obeyed, and every deviation from one is recorded
status: accepted
date: 2026-09-25
decided_by: jan-henrik.hempel
---

## Context

`specs/README.md` rule 4 read: *"If a spec contradicts a concept document, the
concept document wins — or it is changed first, in `go-to-market-os`."*
`concept/README.md` rule 2 said the same thing one layer down, and DEC-0080 §3
used the rule as an authority: *"A concept document wins over a spec."*

The rule was written at the cold start, when the specification was a day old
and the concept documents were the only thing in the repository that had been
thought through. It has outlived that. Three things happened since:

1. **The sources acquired a computed trust level (DEC-0098).** `SRC-0003`, the
   information architecture, is trust `low` — its currency dimension is rated
   1, *"older than a contradicting source"*. Under rule 4 a `low` source
   outranked `CON-WEB-0061` and `FUN-WEB-0017`, which are `S3` and anchored in
   DEC-0081. A rule that lets the weakest artefact in the register overrule the
   strongest is not a precedence rule; it is an unexamined default.
2. **The registers that exist for exactly this arrived (DEC-0099).**
   `specs/conflicts/` and `specs/demands/demand-register.md` are the method's
   apparatus for a source that is wrong. Rule 4 said the apparatus should never
   be needed: the source is right by construction.
3. **The audit of 2026-09-25 put it to the owner as a question** rather than
   letting it stand as an inherited sentence
   (`plan/reviews/2026-09-23/decisions-audit.md`, G1–G4).

The decisive argument is not the trust levels, though. It is that STRICT
already answers the question, and answers it the other way.

`@leafcutter-strict/foundation-evidence-discipline` fixes the relation between a
requirement and a source: *"Every artefact, statement, value and link is backed
by a source locator or by an existing artefact identifier supplied as input"*,
and *"Next to every locator stands a verbatim excerpt of at most 25 words, so
that a reviewer can check the claim without opening the source."* That is a
**citation**. A citation is checkable in one direction only — that the cited
words are there. It confers no authority over the statement that cites it.

`@leafcutter-strict/method-source-quality-rating` says what a source is *for*:
*"The method cannot make a bad source good. It can refuse to build on one
silently"*, and *"An unlocatable or unauthoritative source may corroborate
other evidence. It may never be the sole evidence for an artefact above draft
status. That is the whole point of rating rather than accepting."* A thing that
is rated, weighed and possibly refused is not a thing that wins by default.

The source-inventory contract builds the same posture into the data: every
source carries `quality`, a derived `trust`, and `defects[]` — *"one record per
dimension rated 0 or 1, each naming the demand it raises."* A document class
that ships with a defect list and a demand channel is input, not law.

So rule 4 was not a reading of the method. It was a local rule that contradicted
it, and it produced exactly the artefacts the method would predict: a `low`
source blocking two `S3` requirements, two conflicts resolved by an override
nobody wrote down as an override, and a decision record (DEC-0080 §3) citing
the wrong reason for the right outcome.

## Decision

### 1. The specification carries the truth; a concept document is input and evidence

Rule 4 of `specs/README.md` inverts. Its replacement, in the method's own
terms:

> A requirement **cites** a source; it does not obey one. Where the
> specification and a source disagree, the specification is what the solution
> is built to, and the disagreement is recorded on both sides (§2).

This is not a new liberty. It is the removal of a liberty the old rule granted:
under rule 4 a spec could be overruled by a sentence in a `low`-trust document
without anyone recording that it had happened. The specification is now the
only place a determination lives, which means every determination is now
reviewable in one place, at one decision point, against one status.

What does **not** change:

- **No copying.** `specs/README.md` rule 1 and AGENTS.md working rule 7 stand
  unchanged. The specification cites hub IDs and hub lines; it does not
  restate their content. Winning a disagreement is not a licence to import.
- **No invention.** A requirement still needs a locator and an excerpt, or
  `UNKNOWN` plus its question. The specification carrying the truth does not
  mean the specification may make it up — the opposite: it is now the only
  artefact answerable for it.
- **Everything is still `DRAFT`.** This record changes what outranks what, not
  what is approved. `POL-GRADED-BY-IMPACT` is untouched; amending it is DP-14
  and is never an agent's.

### 2. A disagreement is recorded twice, and a check says so

The spec wins **and the deviation is recorded**. Never silently. Two records,
because they answer two different questions:

**At the artefact — what was decided here, and against what.** The
requirement's `## Source` section gains a `Deviation:` line naming the source,
the exact line it contradicts, and why:

```text
Deviation: SRC-0003#L35 says "Contact and newsletter live in the footer, together
with the legal links". The specification does not; DEC-0081 moved contact to a
standing section above the footer. DEM-0001.
```

**Against the source — a `DEM-####`.** `@leafcutter-strict/method-demand-recording`:
*"A demand is a formal request for input the method needs and does not have. It
is the mechanism by which the method improves its input instead of
compensating for it."* The demand names what is required concretely, who it is
for, what it blocks and the answer format. It closes in exactly two ways —
answered with a registered source, or waived at the blocked artefact's decision
point with the reason recorded. *"It does not close because time passed."*

**The check is `check:specs` E27, and it is new in this record.** A `Deviation:`
line in a requirement's `## Source` section must name a source position in the
form E19 already requires — `SRC-####` plus `#L<n>`, `#P<n>`, `#¶<n>` or
`#M<n>:<n>` — and an existing `DEM-####`. A deviation asserted without a line
is the defect `method-identifier-and-locator-schema` calls unlocatable; a
deviation asserted without a demand is the silent override this record exists to
end.

**`W10` reports the complement**: a `## Source` `Finding:` that states a
contradiction with the source in prose while no `Deviation:` line records it.
That is the omission E27 cannot see, because E27 only fires on a record that is
already there. It is a warning rather than an error because the prose match is a
heuristic and a heuristic must not fail a build.

Both are cheap — one regex over a section the checker already reads — which is
why they are in this record rather than in a question.

### 3. The two local guides are specification-side, carried by their contracts

`concept/website-design-system.md` (SRC-0014) and `concept/website-copy-guide.md`
(SRC-0017) are **truth, not input.** They are prescriptive — components,
measures, token values, forty-one numbered copy rules — and prescriptive text is
specification whatever folder it sits in.

The binding is the contract, and that is what makes this more than a
relabelling: `specs/contracts/design-system-contract.md` (SRC-0013) and
`specs/contracts/copy-contract.md` (SRC-0018) assign every rule to a mechanism —
a schema `max()`/`describe()`, a `check:content` lint row, an e2e assertion, or
the declared editorial gate. DEC-0080 §4 already required it: *"A rule with no
mechanism would be advice, and advice does not survive forty content files."* A
guide rule reaches the build through its contract row and nowhere else.

**Both guides keep `status: draft`**, and that is consistent rather than
grudging: `@leafcutter-strict/foundation-draft-only-output` is a company-layer
foundation, every artefact here is `DRAFT` for the measured reason DEC-0089
gives, and being truth is not the same as being approved.

**The documents stay in `concept/`.** They were not moved, and the reasons are
worth writing down because the opposite was the obvious move:

1. **`specs/` holds the method's artefact families, and this is none of them.**
   A requirement, a tactical specification, a source inventory, a decision
   record, a conflict, a demand, a goal, a need, a glossary, a policy, a
   contract. A design system and a copy guide are not one of those shapes, and
   AGENTS.md is explicit: *"Do not invent a family the method does not define
   and this repository does not hold."* Putting them under `specs/` would
   create a twelfth family whose only member is itself.
2. **The specification side is a status carried by a contract, not a
   directory.** The guides are binding because SRC-0013 and SRC-0018 make every
   rule checkable, and moving the file would not add one mechanism. A move that
   changes nothing checkable is decoration.
3. **A move would retire and re-issue several hundred locators for nothing.**
   `source` on a requirement is `{source_id, loc, excerpt}` since DEC-0097, and
   the path is half of it. Both guides are cited by file path from the source
   inventory, from both contracts, from `concept/README.md`, from the two
   decision records that created them, and from the requirements and tactical
   determinations that read them. Every one of those would move, and DEC-0097's
   *"never invent a line number"* would have to be re-verified against a file
   that had not changed a character.
4. **`concept/` is already a two-class folder, and the classes are stated.**
   `concept/README.md` distinguishes what governs content (the hub's, by
   ADR-002's folder-class test) from what governs the work done in this
   repository (local). The guides are the second kind. What was missing was not
   a different folder; it was a third row saying that two of the three local
   documents are prescriptive and bound by a contract while
   `website-content-production.concept.md` is a working concept. That row is
   added in this change.

**They keep their `SRC-####` registration.** This is the one point that looks
like a contradiction and is not. The source inventory is the method's only
register of *"a document a statement can cite with a line locator"*; there is no
second one. Being citable is not the same as being input whose word overrides.
The register records exactly that difference already: SRC-0017 and SRC-0018 are
the only two sources rated 3 on all six dimensions, and SRC-0014 is `medium`
with its own defect row. A source that is specification-side is rated like any
other and cited like any other — it is simply not on the losing side of §1,
because §1 is about the hub's concept documents and these two are ours.

**So a spec that contradicts a guide is a defect in the spec.** That is the
direction DEC-0080 §3 got right and justified wrongly (§5).

### 4. The hub concepts stay sources, and a contradiction is now a demand

`website-communication-principles.concept.md` (SRC-0001),
`website-relevance-model.concept.md` (SRC-0002) and
`website-information-architecture.concept.md` (SRC-0003) stay in
`go-to-market-os`, cited here as `SRC-####` with locators. Nothing moves:
copying them is forbidden by `specs/README.md` rule 1, the documents reference
`audiences/`, `offerings/` and `proof/` by relative path and would not resolve
here, and the locators already exist and are verified.

What changes is the consequence of a disagreement. Before: a contradiction
between a requirement and SRC-0001/0002/0003 was a **defect in the
requirement**, and the requirement waited. Now it is a **demand against the
source**, and the requirement stands with its deviation recorded.

Three artefacts said the old thing and are corrected in this change:

- **`CON-WEB-0061`**'s `## Source` block read *"Contradiction: the prohibition
  comes from DEC-0081 and overrides SRC-0003 line 35"*. "Overrides" was the
  honest word for what was happening and the wrong word for what was allowed.
  It becomes a `Deviation:` line in the form §2 fixes, citing DEM-0001.
- **`FUN-WEB-0017`** carried the same shape against SRC-0003 line 205. Same
  treatment.
- **`CONF-0013`** and **`CONF-0014`** are `RESOLVED` with outcome
  `NEW_VERSION`, and did not say *which* artefact takes the new version. Under
  rule 4 a reader would assume the requirement did. It is the **source**:
  DEM-0001 asks the hub owner for the amendment, the requirements stand
  unchanged, and the outcome sections now say so. The type, the impact and the
  permitted outcome set are unchanged — the taxonomy was right, the record was
  merely silent at the point where silence now means the opposite thing.

`FUN-WEB-0136`'s finding is the same shape against SRC-0003 line 207 and is
corrected with it, under DEM-0064.

### 5. DEC-0080 §3 is re-based, not deleted

DEC-0080 §3 replaced `TS-WEB-0006 D7`'s question-opener rule because the copy
guide said otherwise. **The outcome was right and stays.** Its stated reason —
*"A concept document wins over a spec … and the guide is a concept document"* —
is withdrawn, because it is the rule this record inverts.

The reason it takes instead is §3 of this record: the copy guide is
specification-side, bound by SRC-0018, and every one of its forty-one rules has
a mechanism. `D7` was not overruled by a concept document; it was **wrong**, and
the artefact that carried the right rule was the guide. Nothing about `D7`,
`A8`, `A16` or the two inverted page criteria changes.

This matters beyond tidiness: DEC-0080 §3 is the only place in the repository
where the old rule was used as an authority rather than merely stated. Leaving
it would leave a live citation of a withdrawn rule, which DEC-0097's own
standard calls a citation that resolves to nothing.

### 6. Two more citations of the old rule, re-based

- **`DEC-0084`** says twice that if SRC-0001's compliance check mandates a live
  element on every page, *"the concept document is amended first and this
  exemption follows it (rule 4)"*. Under §1 the exemption does not wait: it
  stands, with its deviation recorded, and the demand asks the IA owner to
  amend the check. The reasoning DEC-0084 §3 gives — *"A rule that can only be
  satisfied by breaking another rule is not satisfied, it is evaded"* — is
  exactly a specification determination, and it never needed the source's
  permission.
- **`TS-WEB-0006`'s open point** on the same question is rewritten the same way:
  it stops being a question about whether the exemption is allowed and becomes a
  demand about whether the source is right.

## Consequences

- `specs/README.md` rule 4 is replaced and a rule 5 is added for the deviation
  record. The rules section now states the precedence, the mechanism and the
  check.
- `AGENTS.md` gains the precedence in *The Specification Method* and a working
  rule for it. `CLAUDE.md`, `GEMINI.md` and `.github/copilot-instructions.md`
  are **symlinks to `AGENTS.md`** in this repository, so the one edit lands in
  all four places; nothing was mirrored by hand and nothing may be.
- `concept/README.md` rule 2 is replaced, and its table gains the third class:
  prescriptive local document, bound by a contract.
- `specs/contracts/design-system-contract.md` and
  `specs/contracts/copy-contract.md` each state, at the top, that the guide they
  bind is specification-side and that the contract is the binding.
- `check:specs` runs E1–E27 and reports W1–W10. No existing check changed.
- DEM-0064 is opened for the remaining lines of SRC-0003 that contradict landed
  decisions and that DEM-0001 does not name.
- CON-WEB-0061, FUN-WEB-0017 and FUN-WEB-0136 carry `Deviation:` lines;
  CONF-0013 and CONF-0014 say which side takes the new version.
- DEC-0080 §3 and DEC-0084 carry amendments; `TS-WEB-0006`'s open point is
  rewritten.
- Nothing moved off `DRAFT`, no identifier was renumbered, and no file was
  moved.

### What this record is not

It is **not a governance change in the policy sense.** `POL-GRADED-BY-IMPACT`
decides *who* may move a status at *which* decision point; this record decides
*which artefact carries a determination*. The policy file is untouched, DP-14
was not exercised, and `check:specs` E15 is unchanged. The owner decided this at
the audit of 2026-09-25 and it is recorded here as his decision, which is the
same route DEC-0085 §6's deviations took.

It is **not a demotion of the concept documents.** They remain the input every
page brief is read from, they remain trust-rated and cited, and `specs/README.md`
rule 1 still forbids restating them here. A source that can be shown to be wrong
and improved through a demand is being taken more seriously than one that wins
by default and is never re-read.
