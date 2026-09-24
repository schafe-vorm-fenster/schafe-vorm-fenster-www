---
id: DEC-0089
title: The policy applied — every artefact resolves to the owner, nothing moves off DRAFT, and the impact levels that decided it
status: accepted
date: 2026-09-24
decided_by: jan-henrik.hempel
---

## Context

DEC-0088 adopted `POL-GRADED-BY-IMPACT`. This is the run of it over everything
the repository holds: 155 requirements, 29 tactical specifications and the SSD.

The framing was that a policy would unblock statuses. DEC-0087 §4 had reported
that 145 of 155 requirements meet DP-03's evidence gate, and the obvious reading
was that 145 approvals were waiting on a document. That reading is wrong, and
the reason is worth more than the outcome: the gate DEC-0087 measured is the
**sufficiency** gate. It says an approval may be *considered*. It says nothing
about who may take it, and the policy's answer to that is read off a different
number entirely — the dependant count.

## Decision

### 1. The resolution, step by step, as the method prescribes it

`@leafcutter-strict/method-decision-policy-resolution` has six steps. All six
were run for every artefact, and the output of each is recorded here rather than
summarised, because *"a record naming only the outcome cannot be audited against
the policy"*.

**Step 1 — find the rule.** DP-03 for a requirement, DP-08 for a tactical
specification, DP-09 for its verification. `POL-GRADED-BY-IMPACT` binds all
three at all four impact levels.

**Step 2 — read the mode.** It depends on the impact level, so step 2 waits on
the level, which is step 1 of `method-impact-level-assignment`.

**Step 3 — the sufficiency gate.** *"Below S2 no acceptance or approval decision
may be taken at all; below S3 no bounded or automatic mode may be used."*

**Step 4 — separation of duties.** Fails where the executor produced the
subject.

**Step 5 — the bounds**, where the mode is bounded.

**Step 6 — carry the accountable role through unchanged.**

### 2. The impact levels, from the dependant count

This is the number that decided the wave. The method: *"Take the highest level
any criterion reaches. Impact does not average."* Its low row is
*"Editorial change; no dependants; no meaning change"* — three conditions, and
the middle one is measurable from the traceability matrix.

| Artefact | Dependants | Level the method gives |
| --- | --- | --- |
| 141 requirements | 1 tactical specification each | Medium — *"few dependants"* |
| 14 requirements | 2 tactical specifications each | Medium — *"few dependants"* |
| 29 tactical specifications | 8 to 21 acceptance criteria each | High — *"several dependants"* |
| The SSD | 155 requirements and 29 specifications | High |

**No artefact in this repository has zero dependants.** Every requirement is
implemented by at least one tactical specification; every tactical specification
carries at least eight acceptance criteria. So nothing reaches the low impact
level, and the low impact level is the only row this policy gives an agent.

Two adjustments were checked and neither lowers anything. Counting acceptance
criteria as dependants of a requirement as well — the chain runs requirement →
tactical spec → criterion → test — raises 55 requirements from medium to high
rather than lowering any. And the method's regulated-domain rule (*"In a
regulated domain, the lowest available level for a meaning change is high"*)
raises the accessibility and privacy requirements under the BFSG and the GDPR
(DEC-0012, DEC-0004), which the count alone had at medium. The narrowest,
most agent-favourable count was used throughout, and it still says medium.

### 3. The outcome, per decision point

| Decision point | Subjects | Level | Mode | Resolved by | Result |
| --- | --- | --- | --- | --- | --- |
| DP-03 Requirement approval | 155 requirements | Medium | HUMAN | `@domain-requirements-engineer` | escalated to the owner; none taken |
| DP-08 Tactical specification approval | 29 specifications | High | HUMAN | `@domain-requirements-engineer` | escalated to the owner; none taken |
| DP-09 Verification acceptance | 29 specifications | High | HUMAN at every level | `@domain-requirements-engineer` | escalated to the owner; none taken |
| DP-13 Baseline release | the SSD | Critical | HUMAN | `@steering-board` | not attempted; no status transition in the period has a decision record |

Three further gates would have stopped an agent row even if one had existed, and
each is recorded because a gate that is never reached is a gate nobody can rely
on:

- **Sufficiency.** Ten requirements are S1 and fail step 3 outright — no
  approval decision may be taken about them at any impact level, by anyone:
  `CON-WEB-0005`, `FUN-WEB-0039`, `FUN-WEB-0054`, `FUN-WEB-0068`,
  `FUN-WEB-0075`, `FUN-WEB-0105`, `NFR-WEB-0016`, `NFR-WEB-0019`,
  `NFR-WEB-0024`, `NFR-WEB-0025`. Of the remaining 145, 65 are S2, which meets
  the approval gate but not the bounded-mode gate.
- **Separation of duties.** 0 of 155 requirements and 0 of 29 tactical
  specifications carry `ai_provenance`, which both contracts require — *"Every
  record additionally carries `ai_provenance` — the prompt, its version, the
  model and the time of the run."* `@leafcutter-strict/foundation-separation-of-duties`:
  *"Without provenance, separation of duties cannot be checked after the fact."*
  An unverifiable check is a failed check.
- **The parent.** The `tactical-specification` contract says `implements` names
  *"the approved requirement. A tactical specification without an approved
  parent has nothing to be tactical about."* No requirement is approved, so
  DP-08 has no admissible subject and DP-09, which comes after it, has none
  either. The order is not negotiable by a policy.

### 4. The status distribution, before and after

| Artefact kind | Before | After | The rule that decided it |
| --- | --- | --- | --- |
| Requirements | 155 DRAFT | 155 DRAFT | DP-03 at medium impact is HUMAN; the owner has taken none |
| Tactical specifications | 29 DRAFT | 29 DRAFT | DP-08 at high impact is HUMAN, and its subject needs an approved parent |
| Specification document | 1 DRAFT | 1 DRAFT | DP-13 is HUMAN at every level and always critical |

Nothing moved. The distribution is byte-identical to the one wave 2 left, and
the reason for it is not: before DEC-0088 it was *"no policy exists"*, and now
it is *"the policy exists, was applied to all 185 artefacts, and resolves every
one of them to the owner."* That difference is the whole point of the wave. A
status that is DRAFT because nobody wrote a document cannot be audited; a status
that is DRAFT because a named policy resolved a named decision point at a
measured impact level can be.

### 5. What this is not

It is not a verdict on the requirements. 145 of 155 carry enough evidence for an
approval to be *considered*, which is what DEC-0087 §4 measured and what
`check:specs` W5 still reports. The evidence is there; the authority is not, and
the policy says so deliberately — the owner reserved anything above low impact,
and in a repository this tightly linked nothing is below it.

It is also not an argument that the policy was a waste. Three things it changes
are real:

1. A newly extracted requirement, before any tactical specification implements
   it, is at low impact. That is the first artefact an agent will be able to
   classify and approve, and the policy is in place before it exists rather than
   after.
2. The bounds are now named, so the work that would make an agent row usable is
   named with them: `ai_provenance` on the artefacts, and S3 evidence.
3. `check:specs` E15 no longer enforces a blanket rule that would have had to be
   deleted the day the first status moved. It enforces the policy, and it adapts
   as the policy does.

### 6. The impact-level assignments are recorded, not asserted

DP-05 is the decision point for the levels in §2. Each was derived from the
dependant count the traceability matrix supplies, which is what
`method-impact-level-assignment` requires — *"Assigning the level from the
dependants — a number the traceability matrix supplies — is what makes it
checkable"* — against the failure it names: *"Levels assigned after the fact to
match the decision that was already taken."* The levels here were computed
before the modes were read, and they are in this record so the next run can
disagree with the number rather than with the conclusion.

## Consequences

- The status distribution is unchanged and now has a reason with a policy id,
  a decision point and an impact level behind it.
- `check:specs` W5 prints the same resolution on every run: `0/155` requirements
  and `0/29` tactical specifications on an agent row, with the impact tally that
  produced it.
- Nothing about `POL-GRADED-BY-IMPACT` changes. An agent that finds its rows
  unreachable escalates; widening them is DP-14 and the owner's, and
  *"an executor that could widen its own bounds has no bounds."*
- The first status move in this repository will be the owner's, and it will
  leave a decision record naming the artefact, the policy and the decision
  point, because E15 now refuses one that does not.
