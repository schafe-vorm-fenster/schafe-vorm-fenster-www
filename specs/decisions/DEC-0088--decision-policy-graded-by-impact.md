---
id: DEC-0088
title: A decision policy binds this repository — graded by impact, agent at the lowest level inside four bounds, owner everywhere else
status: accepted
date: 2026-09-24
decided_by: jan-henrik.hempel
---

## Context

DEC-0085 §6 listed the missing decision policy as owed, and DEC-0087 §4 turned
it from a gap into a block:

> A status moves at a decision point — DP-03 for a requirement, DP-08 for a
> tactical specification, DP-09 for its verification — and which of them an
> agent may execute is set by the project's decision policy. **This repository
> has no decision policy.**

So `check:specs` E15 refused any status but `DRAFT` outright, and W5 reported
what the evidence would support if a policy existed. That was the right
placeholder and a bad steady state: every artefact in the repository was
pinned to `DRAFT` by the absence of a document, not by a judgement about the
artefact.

`@leafcutter-strict/library-schemas` ships three reference profiles and picks
none, deliberately:

> How much authority an agent holds is a decision, and it should not arrive as
> an install default.

Conservative binds all fourteen decision points to `HUMAN` at every impact
level. Delegated delegates up to medium impact and is admissible only at
conformance level 4, which *"needs three consecutive baselines of reported
metrics"* — this repository has released no baseline at all. Assisted sits
between them and has agents propose everywhere, with a person confirming.

None of the three is what the owner wanted. The question the owner actually
answered is not "how much do agents propose" but "what is cheap enough to let
an agent finish".

## Decision

### 1. The policy is graded by impact, and it is this repository's own copy

`POL-GRADED-BY-IMPACT` lives at
[`specs/policy/graded-by-impact.decision-policy.md`](../policy/graded-by-impact.decision-policy.md),
which is where `library-schemas/policies` says a project's copy belongs —
*"A project copies it, changes what its domain requires, and keeps the copy in
its own specification under its own identifier — never by editing this
document."* Nothing under the installed package was touched.

Its posture, in the owner's words: **an agent may execute a decision point at
the lowest impact level and must record it; from the middle level upward the
decision is the owner's.**

The frontmatter is the type's, from `library-schemas/documents/decision-policy.type.mjs`:
`id`, `policy-owner`, `modes`, `conformance-level` and `human-only`, on top of
a document `title`. `modes` names the two the table uses and no more.
`conformance-level` is **3**, read off the type rather than claimed — *"level 2
permits HUMAN and AGENT_PROPOSE, level 3 adds AGENT_BOUNDED at low impact,
level 4 permits AUTO up to medium."* This policy uses `AGENT_BOUNDED` at low
impact and nowhere else, which is level 3 exactly.

### 2. The impact scale is the method's, not a new one

Every threshold comes from
`@leafcutter-strict/method-impact-level-assignment`, including the instruction
that governs how they combine — *"Take the highest level any criterion reaches.
Impact does not average."* The policy quotes each row where it uses it, and
derives the level from the dependant count the traceability matrix supplies,
which is the method's own defence against *"levels assigned after the fact to
match the decision that was already taken"*.

Its two cross-cutting rules are carried unchanged. The second has teeth here:
*"In a regulated domain, the lowest available level for a meaning change is
high"*, and the accessibility and privacy requirements sit under the BFSG and
the GDPR (DEC-0012, DEC-0004). Those never reach the agent row, whatever their
dependant count.

### 3. Six decision points get an agent row; eight are the owner's at every level

| Agent at low impact | Owner at every level |
| --- | --- |
| DP-02 classification, DP-03 requirement approval, DP-05 impact level assignment, DP-06 version increment, DP-08 tactical specification approval, DP-12 glossary admission | DP-01, DP-04, DP-07, DP-09, DP-10, DP-11, DP-13, DP-14 |

Four of the eight are not a choice: DP-07 scope change and DP-13 baseline
release are named in the method's own critical row, and DP-14 governance change
is rejected by the type unless it is in `human-only`. DP-01 goal and need
acceptance is critical by the same row, and there is nothing to decide on in
any case — this repository has no need layer and references its goals into
`@schafe-vorm-fenster/goals` (DEC-0085 §6).

**The other four defaulted to the owner because the method is silent, and
silence defaults to the owner, never to the agent:**

- **DP-04 conflict resolution.** The impact method gives no criterion for a
  conflict resolution, and this repository holds no conflict record to resolve
  one against — the taxonomy is owed in DEC-0085 §6.
- **DP-09 verification acceptance.** No criterion by which accepting a
  verification reaches low, and no statement of whether the subject is the
  specification or the single criterion. It is also where *assisted*, the
  reference profile nearest this conformance level, keeps it.
- **DP-10 deprecation.** Never low for an approved artefact, because a
  deprecation is never *"provably editorial"*; for a draft artefact the method
  says nothing at all.
- **DP-11 deferral and reactivation.** No impact criterion, and no answer to
  whether deferring an artefact out of an increment is a scope change — which
  would make it critical.

### 4. Every agent row carries four bounds, and one of them currently fails

`AGENT_BOUNDED` is not a licence. `@leafcutter-strict/method-decision-policy-resolution`
requires the bounds to be evaluated, recorded with their values, and escalated
on failure — *"A gate failure escalates; it does not downgrade the decision."*
The four:

1. **At least S3.** *"Below S2 no acceptance or approval decision may be taken
   at all; below S3 no bounded or automatic mode may be used."*
2. **No unknown criterion**, where the subject has a fit criterion.
3. **Separation of duties, checked against `ai_provenance`.** No artefact in
   this repository carries the field — 0 of 155 requirements, 0 of 29 tactical
   specifications — although both contracts require it: *"Every record
   additionally carries `ai_provenance` — the prompt, its version, the model
   and the time of the run."* `@leafcutter-strict/foundation-separation-of-duties`
   settles what that means: *"Without provenance, separation of duties cannot
   be checked after the fact."* An unverifiable check is a failed check, so
   this bound escalates on every existing artefact until the field is filled.
4. **A decision record before the status moves**, carrying the mode, the
   executor, the bounds with their values, the accountable role and any
   escalation with its reason.

Bound 3 is recorded here rather than quietly relaxed. It means the agent rows
adopted today are real but not yet reachable for anything already written. What
closes it is provenance on the artefacts, which is work, not a policy change.

### 5. The roles overlap, and that is recorded as a limitation

The three accountable roles are the reference profiles' and are carried through
unchanged, as `method-decision-policy-resolution` requires — *"Carry the
accountable role through unchanged. The executor never rewrites it."* In this
repository `@domain-requirements-engineer`, `@steering-board` and
`@lead-architect` are all the owner.

That breaks the library's *"The policy owner is not an executor of the policy"*.
It is accepted as a property of a one-person scope, not repaired by inventing
roles nobody fills. The separation that does hold — agent from owner — is the
one the bounds and the decision record protect.

### 6. E15 now enforces the policy instead of the blanket rule

`check:specs` E15 had one rule: no policy, no status but `DRAFT`. It now has
three, and keeps the first:

- **No `POL-*` policy under `specs/`** — unchanged, `DRAFT` only.
- **The bound policy is well-formed** — exactly one policy binds; it declares
  `id`, `policy-owner`, `modes`, `conformance-level` and `human-only`; `DP-14`
  is in `human-only`; and the Rules table binds all fourteen decision points
  across all four impact levels to a mode the frontmatter declares. That is the
  contract's own `policy-covers-every-pair` rule, made deterministic.
- **A status other than `DRAFT` needs a decision record that names the
  artefact** — in either mode. `HUMAN` needs one because that is what a
  decision record is; `AGENT_BOUNDED` needs one because the method says *"a
  record naming only the outcome cannot be audited against the policy"*.

W5 is rewritten in the same run to report against the adopted policy rather
than a hypothetical one: the impact level of every governed artefact, the row
the policy binds it to, and which bound stops it.

## Consequences

- DEC-0085 §6's decision-policy row closes. The `POL-*` artefact exists, the
  four executor modes are the type's, and `SDR-####-####` stays owed with the
  rest of the decision-record shape.
- The agent rows change nothing today. Every artefact this repository holds has
  at least one dependant, so nothing reaches the low impact level in the first
  place. Applying the policy and recording the escalations is the next slice.
- `AGENTS.md` and `specs/README.md` no longer say "do not set a status other
  than `DRAFT`". They say a status moves at the decision point
  `POL-GRADED-BY-IMPACT` names, which for everything now in the repository is
  still the owner.
- Changing this policy is DP-14 and the owner's. An agent that finds a bound
  inconvenient escalates; it does not edit the row.
