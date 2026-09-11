# Open Points

Everything the run could not decide itself, plus everything
deliberately deferred. This is the list Jan reads after the run.
Pre-seeded with the known blockers and their working assumptions —
per the mock rule (plan/leitplanken.md) missing systems are mocked
with labeled dummy data, so the run never blocks on them. Rows
marked `Mock aktiv` are the checklist for the pre-go-live hardening
round; rows marked `Dummy-Content` drive the content follow-up
workstream.

| # | Point | Source | Severity | Working assumption | Decision needed |
| --- | --- | --- | --- | --- | --- |
| 1 | Q-045: 0/32 media-echo entries carry `usage_rights` — clearance filter admits none | specs Q-045 | high | Archive renders clearly-labeled dummy press entries (`Demo-Daten`) so the function is visible; real entries swap in when clearances land — Mock aktiv | yes (Jan, gtm) |
| 2 | Q-046: nothing mints an `organizerId` during an order — instant embed-code delivery has no mechanism | specs Q-046 | high | Order flow mints a mocked `organizerId` and shows the full instant-embed experience with dummy embed code — Mock aktiv | yes (spec session) |
| 3 | Q-052: contradiction whether entry context may set the home page's focus job | specs Q-052 | medium | PM decides as [PROPOSED] during M4 and records the choice here + in the ADR | yes (spec session) |
| 4 | Q-044: design system defines 6 components, pages need more (header, context band, proof card, live shells) | specs Q-044 | medium | Developer derives the missing set from the design system, marked [PROPOSED], reviewed at the M2 customer acceptance | yes (design review) |
| 5 | geo-api demands: name search (Q-025), coordinate→county (Q-032), caller radius (Q-038), nearest-covered-community (Q-051) | specs Q-025/032/038/051 | medium | Missing geo-api capabilities are mocked behind the BFF (name search, county resolution, radius) with dummy data — Mock aktiv | yes (geo-api team) |
| 6 | Q-037: events-api `/api/stats` lacks *places* and *updates today* fields | specs Q-037 | low | Missing `/api/stats` fields are mocked so all three counters render, labeled as demo values — Mock aktiv | yes (events-api team) |
| 7 | Q-022: envoy widget contract (CSS vars, events, spam protection, a11y, delivery date) undelivered | specs Q-022 | high | Envoy widget is a mock component behind its interface module: full form UX, dummy submission — Mock aktiv | yes (envoy team) |
| 8 | Q-041: app public help-URL contract for `/hilfe/{slug}` per-article redirects | specs Q-041 | low | Help redirect works against the app root; per-article mapping mocked with a dummy table — Mock aktiv | yes (app team) |
| 9 | Logo corner radius: website design system says `999` (pill), brand-design README says `var(--radius-lg)` | design system vs brand package | low | The website builds `999` — concept doc wins (repo rule). Brand-package README reconciliation stays with Jan | yes (Jan, brand) |
| 10 | Category taxonomy: website's six categories vs the PROVISIONAL five in the brand tokens | design system vs brand tokens | low | The website uses the design-system category table verbatim; token reconciliation happens in the hub | yes (Jan, brand) |
| 11 | Q-034 names "Inter" as the brand typeface — stale, brand is Atkinson Hyperlegible | specs Q-034 | low | A11y verification (weight floor, sizes, contrast) runs against Atkinson via tool-level checks in M5 | yes (spec session) |
| 12 | Q-040: eTracker property/goal-id parity with the app never inspected | specs Q-040 | low | Event registry implements the hub goal ids as specified; account inspection deferred | yes (Jan) |
| 13 | After the prototype (manual break, joint planning — plan/projektplan.md "After the prototype"): (1) content follow-up for Dummy-Content rows, (2) content review + tone sharpening, (3) usability/feature feedback, (4) finish `Mock aktiv` rows + clearances — only then go-live | Jan, 2026-09-11 | high | Prototype stays on the protected preview | yes (own phases) |
