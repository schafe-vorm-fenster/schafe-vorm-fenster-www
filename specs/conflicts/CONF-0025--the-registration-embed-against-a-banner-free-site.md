---
artefact: conflict
id: CONF-0025
type: direct_contradiction
status: RESOLVED
impact: High
involved: ["FUN-WEB-0205", "NFR-WEB-0062"]
decision_point: DP-04
recommended_action: ISOLATE
permitted_outcomes: [REJECT_NEW, NEW_VERSION, ISOLATE]
blocking_demands: [DEM-0066]
decision_record: DEC-0108
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
  `specs/requirements/functional/FUN-WEB-0205.md#L26`
  > On the registration surface, the website SHALL render the registration form as a visible embed.

- **NFR-WEB-0062** — The site carries no consent banner, and `TS-WEB-0013 D5` rejects any candidate that would make one necessary.
  `specs/requirements/quality/NFR-WEB-0062.md#L31`
  > Consent-banner components in the rendered tree SHALL be = 0 components

## Impact

High — the two cannot both hold if an embedded third-party form creates a consent duty, and banner-freedom is not only a requirement but a published sales argument (TS-WEB-0013 D1).

## Outcome

Taken: **ISOLATE**, by the owner at DP-04 on 2026-09-25, recorded in **DEC-0108**. Permitted for a direct contradiction: REJECT_NEW, NEW_VERSION, ISOLATE.

The embed stays scoped to one route, `/start`, which carries `noindex`, is absent from the sitemap and stands in no page's flow, so the collision is confined to a surface a visitor reaches deliberately. A **notice** above the embed (`FUN-WEB-0206`, `TS-WEB-0016 D17`) says what loading it does; it is not a control and nothing waits for it, so it is not consent.

Why not the other two: REJECT_NEW would withdraw the embed and with it the only registration that exists, since `TS-WEB-0023 D9` forbids every submission mechanism on `/mitmachen/registrieren` and the app entry has no contract. NEW_VERSION would mean a consent gate or a click-to-load layer, which contradicts the "visible" of `FUN-WEB-0205`.

**What each position took.** `NFR-WEB-0062` is **unchanged** — it counts consent-banner components, the count stays 0, and the banner-free claim stands. `NFR-WEB-0061` took the new version: its scale now excludes the registration surface, because its meter `TS-WEB-0012-A2` walks the `TS-WEB-0004 D1` inventory and `/start` is a row of it. `FUN-WEB-0205` is unchanged.

**The residual risk, which the resolution does not remove.** A third party is contacted on this route **without the visitor having acted**, and no legal determination says that needs no consent. The owner accepted that, with the scenarios in front of him; he did not clear it. Two things reopen DP-04: the legal determination `DEM-0066` asks for, or the rebuild that removes Google (`Q-0022`, `DEC-0029`).

**`DEM-0066` stays OPEN and is not waived, and this record is still RESOLVED.** A waiver would mean the answer no longer matters, and it does — it is the trigger above. What changed is that it no longer blocks the artefact. `CONF-0013` is the precedent: RESOLVED on DEC-0081 with `DEM-0001` open against the source. Leaving this record OPEN after its decision point has been exercised would make the register misreport its own state.

Recording it is still the point: the embed ships with the collision and the accepted risk visible, rather than with the banner-free claim quietly qualified.

## Blocks

FUN-WEB-0205, NFR-WEB-0061, NFR-WEB-0062

## Confidence

`likely` — the contradiction is certain if the embed sets a cookie or a persistent identifier, and nobody has confirmed that it does. That confirmation is DEM-0066. The resolution does not depend on the confirmation: ISOLATE holds either way, and it is the *size* of the accepted risk that the confirmation would fix.
