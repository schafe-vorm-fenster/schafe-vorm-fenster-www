---
artefact: conflict
id: CONF-0027
type: direct_contradiction
status: OPEN
impact: Medium
involved: ["TS-WEB-0018", "DEC-0012"]
decision_point: DP-04
recommended_action: NEW_VERSION
permitted_outcomes: [REJECT_NEW, NEW_VERSION, ISOLATE]
blocking_demands: []
decision_record: DEC-0136
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Fable 5.1"
  generated_at: "2026-09-26T21:00:00+02:00"
---

# CONF-0027

The product name may stand on one route only, while the imported legal texts name it as the contractual product on another

## Positions

- **TS-WEB-0018** — A7 allows the product name in the body of `/dein-kalender` and of no other route.
  `specs/tactical/TS-WEB-0018--scope-boundaries.tactical.md#L339`
  > "`/dein-kalender` is the only route whose body may contain one, at most once"

- **DEC-0012** — The legal texts arrive through the Google-Docs import and name the product seven times.
  `content/legal/privacy-policy.md#L91`
  > "Wenn du unseren eingebetteten Kalender siehst („Portalize")"

## Impact

Medium — `/rechtliches` and `/en/legal` render „Portalize" seven times
(`content/legal/privacy-policy.md` 3×, `terms-of-use.md` 2×, `dpa.md` 2×), so
`TS-WEB-0018-A7` cannot be met on the render while the import stands, and it
cannot be met by editing a legal text either: DEC-0012 keeps those bodies on the
import pipeline and DEC-0027 puts DE and EN through the same one. The criterion
is not met and no engineering change closes it.

## Outcome

None yet. `DEC-0136 §10` raises the conflict and deliberately does not resolve
it: rewriting a data-processing clause to satisfy a naming rule is the owner's
call, and amending an acceptance criterion is the spec owner's.

Isolated in the meantime, and only in the test: the rendered check of A7
(`e2e/copy-structure.spec.ts`, `PRODUCT_NAME_EXEMPT_ROUTES`) exempts the route
`legal` from the body count with this record as its reason, so the other
twenty-two route/locale pairs stay under guard. The exemption keeps the test
honest about what it measures; it does not make the criterion true.

The same route is already the one exemption of the register row
(`TS-WEB-0029 D6a/A15`) on the same ground, for the same imported bodies — which
is why ISOLATE is the plausible resolution and NEW_VERSION of A7 the recommended
one.

## Blocks

TS-WEB-0018

## Confidence

`certain` — measured on the running app over all 24 D1 route/locale pairs, and
the seven occurrences are greppable in the three imported files.
