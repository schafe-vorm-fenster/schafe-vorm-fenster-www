---
artefact: conflict
id: CONF-0025
type: direct_contradiction
status: OPEN
impact: High
involved: ["FUN-WEB-0205", "NFR-WEB-0062"]
decision_point: DP-04
recommended_action: ISOLATE
permitted_outcomes: [REJECT_NEW, NEW_VERSION, ISOLATE]
blocking_demands: [DEM-0066]
decision_record: UNKNOWN
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-25T09:50:00+02:00"
---

# CONF-0025

The registration embed against a banner-free site: a third-party iframe on one route, and a requirement that the site needs no consent UI anywhere

## Positions

- **FUN-WEB-0205** — The registration surface renders the third-party form as a visible embed, which loads that third party for the visitor.
  `specs/requirements/functional/FUN-WEB-0205.md#L29`
  > On the registration surface, the website SHALL render the registration form as a visible embed.

- **NFR-WEB-0062** — The site carries no consent banner, and `TS-WEB-0013 D5` rejects any candidate that would make one necessary.
  `specs/requirements/quality/NFR-WEB-0062.md#L31`
  > Number of consent-banner components in the rendered website SHALL be 0 components

## Impact

High — the two cannot both hold if an embedded third-party form creates a consent duty, and banner-freedom is not only a requirement but a published sales argument (TS-WEB-0013 D1).

## Outcome

**Open against no decision record.** The recommendation is **ISOLATE**: the embed is already scoped to one route, `/start`, which carries `noindex` and stands in no page's flow, so the collision is confined to a surface a visitor reaches deliberately. Whether isolation is enough is a legal question, not a specification one.

Permitted for a direct contradiction: REJECT_NEW, NEW_VERSION, ISOLATE. REJECT_NEW would withdraw the embed and with it the only working registration; NEW_VERSION would mean a consent gate, which contradicts the "visible" the embed was decided with. DP-04 is the owner's at every impact level (POL-GRADED-BY-IMPACT), and DEM-0066 is the input it needs.

Recording it is the point: the embed ships with the collision visible rather than with the banner-free claim quietly qualified.

## Blocks

FUN-WEB-0205, NFR-WEB-0061, NFR-WEB-0062

## Confidence

`likely` — the contradiction is certain if the embed sets a cookie or a persistent identifier, and nobody has confirmed that it does. That confirmation is DEM-0066.
