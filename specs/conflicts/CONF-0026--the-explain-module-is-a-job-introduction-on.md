---
artefact: conflict
id: CONF-0026
type: direct_contradiction
status: RESOLVED
impact: Medium
involved: ["TS-WEB-0006", "TS-WEB-0019"]
decision_point: DP-04
recommended_action: NEW_VERSION
permitted_outcomes: [REJECT_NEW, NEW_VERSION, ISOLATE]
blocking_demands: []
decision_record: DEC-0110
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-25T16:40:00+02:00"
---

# CONF-0026

The explain module is a job introduction on `/`, and the composition rules say a job introduction is a scene block

## Positions

- **TS-WEB-0006 D7** — every job introduction, on every page, is a scene block with a fixed shape: an opener that is a statement, exactly one mechanism, and one concrete instance.
  `specs/tactical/TS-WEB-0006--page-composition.tactical.md#L238`
  > Every job introduction on every page is a scene block with a fixed shape

- **TS-WEB-0019 D3a**, as it stood between `DEC-0109` and `DEC-0110` — on `/` the `whatsapp` block is the explain module, not a scene, and it is what introduces the publishing job on that page.
  `specs/tactical/pages/TS-WEB-0019--home.tactical.md#L107`
  > `whatsapp` | **explain module** | the `explain-module` of TS-WEB-0022 D4 and SRC-0014

## Impact

Medium — one block on one page. It is not Low, because two of D7's three items have no slot in the component and one of them is load-bearing content: the `whatsapp` block on `/` is the one that carries a **live event row** as its outcome, which is D7's "one concrete instance, live or proof-backed, as close to the visitor as the data allows". A module with no instance slot drops it, and `/` loses its only live proof of the publishing path.

`/mitmachen` is **not** in the collision: there the hero is the WhatsApp scene and the path block is its step detail (`TS-WEB-0022 D4`, "One appearance"), so D7 is satisfied by the hero and the module is not an introduction at all.

## Outcome

**Resolved 2026-09-25 by `DEC-0110`, outcome `NEW_VERSION`.** The recommendation held and the open part — a new version *of what* — is closed: **`TS-WEB-0006 D7` takes it, and the component takes none.**

Neither candidate `Q-0080` listed was taken. `D7` gains no exception, and the module gains no opener line and no instance slot. What `D7` gains is a sentence saying that its mechanism slot may be rendered by a module: the scene **wraps** the module, with the opener above it and the concrete instance — on `/` the live event row — below it. All three of `D7`'s items are then present, each at its own level, and the collision dissolves because it was between `D7` and a reading of `D3a` in which the module *replaces* the scene. That reading is withdrawn: `/` carries **three** scene blocks, one of which contains a module.

The two outcomes not taken, and why they were not needed. `REJECT_NEW` would have withdrawn the module from `/` and reopened `Q-0079`. `ISOLATE` would have exempted one block on one page from a site-wide rule without the rule saying so, which is the silent override `DEC-0104 §2` exists to end.

`/mitmachen` was never in the collision and still is not: there the hero is the WhatsApp scene, so `D7` is satisfied by the hero and the three path blocks stay bare modules (`DEC-0110 §3`). `Q-0080` is closed.

## Blocks

TS-WEB-0019 D3a's block-type table, TS-WEB-0019-A6, TS-WEB-0006 D7

## Confidence

`certain` — both statements are written, both are specification-side, and they cannot both be true of the same block. What is open is which one takes the new version, not whether they collide.
