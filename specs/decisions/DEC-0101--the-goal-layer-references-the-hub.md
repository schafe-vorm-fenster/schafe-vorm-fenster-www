---
id: DEC-0101
title: The goal layer references the hub, it does not duplicate it — thirteen GOAL-WEB artefacts, no goal content copied
status: accepted
date: 2026-09-24
decided_by: jan-henrik.hempel
---

## Context

DEC-0085 §6 carries one row that no wave has touched: *"Need and goal layer —
requirement → need → goal → SSD. Goals are referenced into
`@schafe-vorm-fenster/goals` and there is no need layer at all.
`method-chain-linkage` would find 155 orphan requirements."* The count is now
273, and the question in front of the row is narrower than it looks.

`@leafcutter-os/schemas` types a goal as a document at
`spec/goals/GOAL-<DOMAIN>-<nnnn>.md`, level L1 of the chain, with `rank`,
`kind`, `single_source`, `source_ids`, `evidence_sufficiency`, `confidence`,
`blocking_demands` and `ai_provenance`. The hub types a goal quite
differently: a **business goal** carries `metric`, `baseline`, `target`,
`horizon` and `contributes_to`; a **conversion goal** carries `action`,
`measured_on`, `measurement`, `value_per_conversion` and `target`. Neither is
the other. The question is therefore not "which of the two models wins" but
"does a `GOAL-WEB-####` artefact restate a hub goal, or point at one".

## Decision

### 1. It points. The goal layer is a reference layer

Four things decide it, and none of them is convenience.

- **`specs/README.md` rule 1**, this repository's oldest standing rule about
  hub content: *"A spec cites IDs from `go-to-market-os` — audience IDs,
  conversion goal IDs, offering IDs, proof IDs. It does not invent its own and
  does not copy the definitions in."* `AGENTS.md` rule 7 says the same thing
  as a prohibition. A `GOAL-WEB-####` carrying `target: 50000` would be a copy
  of a number whose authoritative version is one `pnpm update` away from
  disagreeing with it.
- **The extraction-result contract anticipates exactly this.** Its `goals[]`
  item carries `matched_existing: string | null` beside `statement`, `scale`,
  `meter`, `baseline` and `target`. The contract already knows that an
  extraction run can meet a goal that exists and should resolve to it rather
  than emit a second one. A reference layer is the steady-state form of
  `matched_existing`.
- **The chain needs a node, not a copy.** `method-chain-linkage` step 1:
  *"every need names at least one goal and one stakeholder listed in the
  specification; every goal falls inside scope."* A need cannot name
  `recurring-licence-revenue` and have it checked here — the slug is not in
  the `GOAL-<DOMAIN>-<nnnn>` form the goal schema fixes, and nothing in this
  repository can resolve a slug in a package that is not a spec artefact. The
  layer exists to give the chain a resolvable identifier.
- **The layer is not empty.** `rank`, `kind`, `single_source`,
  `evidence_sufficiency`, `confidence` and the locator are judgements about
  *this website's* relation to a hub goal. The hub holds none of them and has
  no place to. That content is this repository's, it is new, and it is not a
  copy of anything.

So: thirteen artefacts in `specs/goals/`, each naming its hub goal in
`references.goal_id`, each with a locator into the hub file and a ≤25-word
excerpt taken from that exact line, and **not one metric, target, horizon or
measurement restated**.

### 2. Which thirteen, and why those

Two business goals, because the SSD's `## Goals` section names exactly those
two as carried by this website and says of the other two that they *"exist but
are not carried by this website"*. Eleven conversion goals: the seven of
SRC-0003's conversion map, plus `make-contact` and `subscribe-to-newsletter`
(DEC-0081, DEC-0052 §4), `publish-events-regularly` and
`request-ad-placement`. Every one of the eleven carries `measured_on:
- website` in its own hub file, which is the evidence that this website is
where it is counted.

`order-promotion-material` and `request-ad-placement` are included although
neither has a page: DEC-0052 §2 records the first as *deliberately unwired*
and SRC-0003's open points record the second. A goal the website is
accountable for and does not yet serve is a finding worth keeping, not a goal
to leave out of the register.

### 3. The parent chain is the hub's, read not invented

`contributes_to` on a conversion goal is read off the hub file's own
`contributes_to`, through `calendar-subscriptions` and `new-customer-ramp`, to
`recurring-licence-revenue`. All eleven land there. **Not one lands on
`proven-outside-home-regions`**, which is the hub's record and not a reading of
it — and it is why GOAL-WEB-0002 is the goal that the chain report, once the
need layer exists, will find nothing below.

### 4. The frontmatter is the goal contract's, including where it disagrees
with the requirement shell

`goalSchema` types `confidence` as a number between 0 and 1 and
`ai_provenance` as a string. The `requirement-shell` contract types
`confidence` as an object with a four-input `basis` and `ai_provenance` as an
object with four named fields, which is what DEC-0091 put on 326 artefacts.
Two packages, two shapes, and neither is wrong about its own artefact type.
The new layer takes the shape of the contract that defines it, rather than
carrying a richer structure than any contract asks for — inventing a field is
still inventing when the field looks like good practice. `check:specs` E17 and
W6 stay on the three families whose contract carries the object, so the
provenance report is unchanged at 326/326.

Three fields are added that the schema does not carry and does not forbid,
each because a check needs it: `references` (package and hub goal id, so the
reference is machine-readable rather than prose), `contributes_to` (§3) and
`scope` (the SSD the goal falls inside, which is `method-chain-linkage`
step 1's third clause).

### 5. Evidence sufficiency is S2 on all thirteen

`method-evidence-sufficiency-rating`: *"a goal is decided by its statement and
target"*, and S2 wants *"every single-cardinality field evidenced or
explicitly `UNKNOWN` with a demand; the deciding source at trust medium or
better"*. The statement is the cited line; the target is evidenced in the
referenced hub artefact rather than here; SRC-0008 is trust `medium`
(DEC-0098). S3 is not available: it needs *"a second independent source"* and
*"at least one source at trust high"*, and there is one source.

That is exactly the gate DP-01 wants: its evidence gate is `>= S2`, and this
is the first layer in the repository that meets it on every artefact.

## Consequences

- `specs/goals/` exists with thirteen artefacts and an index.
- SRC-0008's inventory row names `strategy/ (business-goals,
  conversion-goals)`; the hub has since moved both under
  `packages/market/goals/`. The locators here use the path that resolves
  today. The stale row is a currency defect of the source inventory and is
  raised as a demand rather than fixed silently.
- The installed `@schafe-vorm-fenster/goals` is 0.3.0 and does not contain
  `make-contact.conversion-goal.md` or
  `subscribe-to-newsletter.conversion-goal.md`; the hub repository at 0.3.3
  does, and 21 and 18 citations in this specification already name them. The
  locators here resolve against the hub repository. Raised as a demand.
- No goal content was copied. The one thing taken verbatim from a hub file is
  the ≤25-word excerpt each locator carries, which is the citation form
  DEC-0097 established for all 186 located requirements.
