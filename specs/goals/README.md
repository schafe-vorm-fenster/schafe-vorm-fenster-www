# Goals

## Purpose

Level **L1** of the STRICT chain — `method-chain-linkage`: *"Every requirement
answers to a need, every need to a goal, every goal to the specification."*
Thirteen `GOAL-WEB-####` artefacts, one per goal this website is accountable
for.

## This is a reference layer, and that is the whole point

The goals themselves are not here. They live in
`@schafe-vorm-fenster/goals` — business goals and conversion goals — and
`specs/README.md` rule 1 and `AGENTS.md` rule 7 both forbid copying them in.
What each file here carries is the **link plus this specification's own
judgement about it**: the identifier the chain can resolve, the rank, the
evidence level, the confidence, and the locator into the hub file that says
the goal is measured on this website. Metric, baseline, target, horizon,
action, measurement and value per conversion are in the hub and are not
restated. DEC-0101 argues why that is the right shape rather than a shortcut.

## Shape

The frontmatter is `@leafcutter-os/schemas`' `goalSchema`: `id`, `level: L1`,
`status`, `version`, `domain`, `owner`, `kind`, `single_source`, `rank`,
`source_ids`, `evidence_sufficiency`, `confidence`, `blocking_demands`,
`ai_provenance` — plus three fields the reference layer needs and the schema
does not forbid: `references` (the hub package and goal id), `contributes_to`
(the goal above it, read off the hub's own `contributes_to` chain) and
`scope` (the specification document the goal falls inside, which is what
`method-chain-linkage` step 1 checks).

Two of those fields are typed differently here than on a requirement:
`confidence` is a number and `ai_provenance` a string, because the goal and
need contracts type them that way while the `requirement-shell` contract
types both as objects. Two packages, two shapes; the layer follows the
contract that defines it. DEC-0101 §4 records it.

## The register

| ID | Hub goal | Kind | Contributes to |
| --- | --- | --- | --- |
| GOAL-WEB-0001 | `recurring-licence-revenue` | business goal | — |
| GOAL-WEB-0002 | `proven-outside-home-regions` | business goal | — |
| GOAL-WEB-0003 | `save-calendar-to-homescreen` | conversion goal | GOAL-WEB-0001 |
| GOAL-WEB-0004 | `register-as-publisher` | conversion goal | GOAL-WEB-0001 |
| GOAL-WEB-0005 | `publish-first-event` | conversion goal | GOAL-WEB-0001 |
| GOAL-WEB-0006 | `publish-events-regularly` | conversion goal | GOAL-WEB-0001 |
| GOAL-WEB-0007 | `buy-calendar-licence` | conversion goal | GOAL-WEB-0001 |
| GOAL-WEB-0008 | `request-licence-quote` | conversion goal | GOAL-WEB-0001 |
| GOAL-WEB-0009 | `request-product-briefing` | conversion goal | GOAL-WEB-0001 |
| GOAL-WEB-0010 | `make-contact` | conversion goal | GOAL-WEB-0001 |
| GOAL-WEB-0011 | `subscribe-to-newsletter` | conversion goal | GOAL-WEB-0001 |
| GOAL-WEB-0012 | `order-promotion-material` | conversion goal | GOAL-WEB-0001 |
| GOAL-WEB-0013 | `request-ad-placement` | conversion goal | GOAL-WEB-0001 |

Every conversion goal on this website rolls up to `recurring-licence-revenue`,
directly or through `calendar-subscriptions` or `new-customer-ramp`. **None
rolls up to `proven-outside-home-regions`**, which is the hub's own record and
not this repository's reading of it. The chain report says what follows from
that; DEC-0101 §3 says why it is not a defect of this layer.
