---
title: Graded-by-impact decision policy
id: POL-GRADED-BY-IMPACT
policy-owner: '@lead-architect'
modes: ['HUMAN', 'AGENT_BOUNDED']
conformance-level: 3
human-only: ['DP-01', 'DP-04', 'DP-07', 'DP-09', 'DP-10', 'DP-11', 'DP-13', 'DP-14']
---

# Graded-by-impact decision policy

## Purpose

An agent may take a decision at the lowest impact level, inside stated bounds and
with a record; from the middle level upward the decision is the owner's.

This is not one of the three reference profiles of
`@leafcutter-strict/library-schemas`. It is this repository's own copy, adopted by
DEC-0088, and it sits between two of them: *conservative* binds every pair to
`HUMAN`, *delegated* delegates up to medium impact and needs three baselines of
reported metrics this repository cannot produce. The grading the owner chose is
exactly what the decision-policy type calls conformance level 3 — *"level 3 adds
`AGENT_BOUNDED` at low impact"* — so the level is read off the type rather than
claimed.

The posture is deliberately asymmetric. A low-impact decision is one the impact
method defines as touching nothing: *"Editorial change; no dependants; no meaning
change."* A decision that touches nothing is cheap to reverse and expensive to
queue, so the agent takes it and leaves the record. Everything else waits for the
owner, including every decision point where the impact method gives no criterion
at all — silence defaults to the owner, never to the agent.

## Rules

Every pair of decision point and impact level is bound. There is no default row: a
pair the policy does not cover fails the pipeline rather than falling back to
something nobody decided.

| Decision point | Low | Medium | High | Critical | Accountable |
| --- | --- | --- | --- | --- | --- |
| DP-01 Goal and need acceptance | HUMAN | HUMAN | HUMAN | HUMAN | `@domain-requirements-engineer` |
| DP-02 Classification | AGENT_BOUNDED | HUMAN | HUMAN | HUMAN | `@domain-requirements-engineer` |
| DP-03 Requirement approval | AGENT_BOUNDED | HUMAN | HUMAN | HUMAN | `@domain-requirements-engineer` |
| DP-04 Conflict resolution | HUMAN | HUMAN | HUMAN | HUMAN | `@domain-requirements-engineer` |
| DP-05 Impact level assignment | AGENT_BOUNDED | HUMAN | HUMAN | HUMAN | `@domain-requirements-engineer` |
| DP-06 Version increment | AGENT_BOUNDED | HUMAN | HUMAN | HUMAN | `@domain-requirements-engineer` |
| DP-07 Scope change | HUMAN | HUMAN | HUMAN | HUMAN | `@steering-board` |
| DP-08 Tactical specification approval | AGENT_BOUNDED | HUMAN | HUMAN | HUMAN | `@domain-requirements-engineer` |
| DP-09 Verification acceptance | HUMAN | HUMAN | HUMAN | HUMAN | `@domain-requirements-engineer` |
| DP-10 Deprecation | HUMAN | HUMAN | HUMAN | HUMAN | `@lead-architect` |
| DP-11 Deferral and reactivation | HUMAN | HUMAN | HUMAN | HUMAN | `@domain-requirements-engineer` |
| DP-12 Glossary admission | AGENT_BOUNDED | HUMAN | HUMAN | HUMAN | `@domain-requirements-engineer` |
| DP-13 Baseline release | HUMAN | HUMAN | HUMAN | HUMAN | `@steering-board` |
| DP-14 Governance change | HUMAN | HUMAN | HUMAN | HUMAN | `@lead-architect` |

The accountable role is the same at every impact level for a given decision point;
the column above states it once. An executor copies it into the decision record
unchanged.

Two rules hold in every profile, including this one:

- **A governance change is never an agent's.** DP-14 is human in all three
  reference profiles and in this one, and the decision skill refuses it by design.
- **A decision point is never removed.** All fourteen are bound above. None was
  dropped, and none was given a trivial automatic criterion to make it disappear.

### Where the impact levels come from

The levels are not this policy's scale. They are
`@leafcutter-strict/method-impact-level-assignment`'s, taken whole, including its
first instruction: *"Take the highest level any criterion reaches. Impact does not
average."*

| Level | The method's words | What sets it here |
| --- | --- | --- |
| Low | *"Editorial change; no dependants; no meaning change"* | An artefact the traceability matrix shows nothing depending on, whose statement does not change |
| Medium | *"Meaning changes in one domain; few dependants; no approved artefact invalidated"* | One or two dependants in the matrix |
| High | *"Several dependants, or an approved artefact must be re-approved, or another domain is affected"* | Three or more dependants, or a re-approval |
| Critical | *"Scope, a goal, a mandate or a released baseline is affected; or the domain is safety-, money- or law-critical"* | A change to scope, to a conversion goal, or to anything a baseline has released |

Two of the method's rules cut across the table and are carried unchanged:

1. *"A change to an approved artefact is never low unless it is provably
   editorial."*
2. *"Criticality of the domain raises the floor. In a regulated domain, the lowest
   available level for a meaning change is high."* This repository's accessibility
   and privacy artefacts sit under a legal mandate — BFSG and the GDPR, per
   DEC-0012 and DEC-0004 — so a meaning change to one of them is high whatever its
   dependant count.

The dependant count is read off the traceability matrix and nothing else, for the
reason the method gives: *"Levels assigned after the fact to match the decision
that was already taken"* is the failure it exists to prevent, and *"assigning the
level from the dependants — a number the traceability matrix supplies — is what
makes it checkable."*

### The bounds on every agent row

`AGENT_BOUNDED` never means unbounded. A resolution in this mode evaluates four
bounds, records each with its value, and escalates to the accountable role on any
failure — *"A gate failure escalates; it does not downgrade the decision."*

1. **Evidence sufficiency at least S3.**
   `@leafcutter-strict/method-decision-policy-resolution`: *"Below S2 no acceptance
   or approval decision may be taken at all; below S3 no bounded or automatic mode
   may be used."* An S0, S1 or S2 subject escalates even at low impact.
2. **No unknown criterion.** Where the subject carries a fit criterion, it is a
   measure and not `UNKNOWN`. A quality requirement without a measure escalates by
   construction, which is `@leafcutter-strict/method-statement-grammar`'s own
   verdict working rather than failing.
3. **Separation of duties, checked against provenance.** The resolution *"fails
   with a separation-of-duties violation"* where the executor produced the subject.
   `@leafcutter-strict/foundation-separation-of-duties` states the consequence when
   the check cannot be run at all: *"Without provenance, separation of duties
   cannot be checked after the fact."* So an artefact carrying no `ai_provenance`
   escalates; an unverifiable check is a failed check, never a passed one.
4. **A decision record, before the status moves.** The record carries what the
   method's output section names — *"The mode, the executor, the bounds evaluated
   with their values, the accountable role, and — where it applies — the escalation
   and its reason"* — because *"a record naming only the outcome cannot be audited
   against the policy."*

### What an agent may do, and what it must leave

One line per decision point. Every agent row is the low impact level only, under
the four bounds above.

- **DP-01 Goal and need acceptance — owner at every level.** The method is silent
  on how a goal acceptance could ever be low, and its own critical row says a goal
  is critical: *"Scope, a goal, a mandate or a released baseline is affected."*
  There is also nothing to decide on yet — this repository has no need layer and
  references its goals into `@schafe-vorm-fenster/goals` (DEC-0085 §6).
- **DP-02 Classification — agent at low.** A first classification of a newly
  extracted artefact that nothing yet cites is *"no dependants; no meaning
  change"*. Any reclassification of a cited artefact is not: DEC-0087 §2 moved one
  class token and thirteen citations with it. Evidence: the classification
  question that decided it, quoted from
  `@leafcutter-strict/method-requirement-classification`, and the dependant count.
- **DP-03 Requirement approval — agent at low.** Evidence: the sufficiency level
  with the locator it was computed from, the fit criterion, the dependant count
  from the traceability matrix, and the four bounds with their values.
- **DP-04 Conflict resolution — owner at every level.** The impact method gives no
  criterion for a conflict resolution, and this repository holds no conflict record
  to resolve one against; contradictions are settled inside a `DEC-####` and the
  taxonomy is owed (DEC-0085 §6). Silent method, so the owner.
- **DP-05 Impact level assignment — agent at low.** The assignment takes the level
  of the change it governs, so an agent may assign *low* and may never assign its
  way out of a higher row. Evidence: the criterion that set the level and the
  dependant count, both of which the method requires in the record anyway.
- **DP-06 Version increment — agent at low.** Only a patch increment for a
  provably editorial diff reaches low, by the method's first cross-cutting rule.
  Evidence: the artefact's current version and its diff, which are
  `@leafcutter-strict/method-version-increment`'s two inputs, and the answer to its
  test for major versus minor — *"would an artefact that satisfied the old version
  still satisfy the new one?"* — which for a patch is yes.
- **DP-07 Scope change — owner at every level.** Never below critical: the method's
  critical row names scope first. Human in all three reference profiles.
- **DP-08 Tactical specification approval — agent at low.** Evidence as DP-03, plus
  the coverage of the parent's fit criterion. The `tactical-specification` contract
  adds a precondition no policy can waive: `implements` names *"the approved
  requirement. A tactical specification without an approved parent has nothing to
  be tactical about."*
- **DP-09 Verification acceptance — owner at every level.** The impact method names
  no criterion by which accepting a verification reaches low, and does not say
  whether the subject is the specification or the single criterion. Silent method,
  so the owner — which is also where *assisted*, the reference profile at this
  conformance level, keeps it.
- **DP-10 Deprecation — owner at every level.** Deprecating an approved artefact is
  never low, because it is never *"provably editorial"*; for a draft artefact the
  method says nothing. Silent method, so the owner.
- **DP-11 Deferral and reactivation — owner at every level.** The method gives no
  impact criterion for a deferral, and does not settle whether deferring an
  artefact out of an increment is a scope change, which would make it critical.
  Silent method, so the owner.
- **DP-12 Glossary admission — agent at low.** Admitting a term nothing yet cites
  changes no meaning and has no dependants. An ambiguity split, a synonym mapping
  or a shift of an admitted term is not low. Evidence: the tier the term was
  admitted at, per `@leafcutter-strict/method-glossary-policy`, and the locator of
  the use that proposed it.
- **DP-13 Baseline release — owner at every level.** Always critical by the
  method's own row, and human in all three reference profiles.
- **DP-14 Governance change — owner at every level.** Required by the type: the
  `human-only` list is rejected without it. Changing this policy is a DP-14, and
  `@leafcutter-strict/foundation-separation-of-duties` closes the loop — *"An
  executor never changes its own mode, its own bounds, or the policy that binds
  it."*

### The roles, in a one-person scope

The three accountable roles are the reference profiles' and are carried through
unchanged, as the method requires. In this repository all three —
`@domain-requirements-engineer`, `@steering-board` and `@lead-architect` — are held
by the owner.

That breaks one of the library's invariants, and the break is recorded rather than
papered over: *"The policy owner is not an executor of the policy."* Here the
policy owner is also the accountable role on every row, so the separation exists
between the agent and the owner but not between one human role and another. The
reference profiles have the same overlap at DP-10 and DP-14. DEC-0088 carries it
as an accepted limitation of a single-person scope; it is not a licence to widen
an agent row.

## When to move off this profile

Move back to *conservative*, decision point by decision point, the moment the owner
overrides an agent's low-impact decision. One override is enough: the bound was
wrong, and the cheapest correction is to stop using that row.

Move on to *delegated* only against the evidence that profile names — an override
rate measured per decision point and impact level rather than in aggregate, and a
sufficiency rate showing that artefacts reaching decisions are routinely at S3.
That profile is admissible at conformance level 4 only, and *"a level-4 claim needs
three consecutive baselines of reported metrics."* This repository has released no
baseline at all, so the question does not arise yet.

One change does not need a profile move and is expected to come first: filling in
`ai_provenance`. Bound 3 currently escalates every agent row on every artefact this
repository holds, because none of them records who produced it. Closing that gap
turns an agent row from unreachable into usable without touching this document.
