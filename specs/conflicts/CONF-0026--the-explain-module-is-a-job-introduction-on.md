---
artefact: conflict
id: CONF-0026
type: direct_contradiction
status: OPEN
impact: Medium
involved: ["TS-WEB-0006", "TS-WEB-0019"]
decision_point: DP-04
recommended_action: NEW_VERSION
permitted_outcomes: [REJECT_NEW, NEW_VERSION, ISOLATE]
blocking_demands: []
decision_record: UNKNOWN
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

- **TS-WEB-0019 D3a** — on `/` the `whatsapp` block is the explain module, not a scene, and it is what introduces the publishing job on that page.
  `specs/tactical/pages/TS-WEB-0019--home.tactical.md#L107`
  > `whatsapp` | **explain module** | the `explain-module` of TS-WEB-0022 D4 and SRC-0014

## Impact

Medium — one block on one page. It is not Low, because two of D7's three items have no slot in the component and one of them is load-bearing content: the `whatsapp` block on `/` is the one that carries a **live event row** as its outcome, which is D7's "one concrete instance, live or proof-backed, as close to the visitor as the data allows". A module with no instance slot drops it, and `/` loses its only live proof of the publishing path.

`/mitmachen` is **not** in the collision: there the hero is the WhatsApp scene and the path block is its step detail (`TS-WEB-0022 D4`, "One appearance"), so D7 is satisfied by the hero and the module is not an introduction at all.

## Outcome

**Open against no decision record.** `DEC-0109` decided which block is the module and deliberately did not decide this: it is a change either to the generic composition rule or to a component the whole system shares, and `POL-GRADED-BY-IMPACT` leaves nothing on this page at the low impact level.

The recommendation is **NEW_VERSION**, and the open part is *of what*: either `TS-WEB-0006 D7` gains the exception — a job introduction is a scene block *or* the explain module, with the module's title carrying the opener's job — or the component gains the two slots, an opener line and an instance beneath the third step, in which case `/mitmachen` gains them too and `TS-WEB-0022 D4` follows. REJECT_NEW would withdraw the module from `/` and put `DEC-0109` back to `Q-0079`. ISOLATE would mean `/` is exempt from D7 for this one block without D7 saying so, which is the silent override `DEC-0104 §2` exists to end.

`Q-0080` is the question, addressed to the owners of `TS-WEB-0006` and of `concept/website-design-system.md`.

## Blocks

TS-WEB-0019 D3a's block-type table, TS-WEB-0019-A6, TS-WEB-0006 D7

## Confidence

`certain` — both statements are written, both are specification-side, and they cannot both be true of the same block. What is open is which one takes the new version, not whether they collide.
