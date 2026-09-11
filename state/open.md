# Offene Punkte

Everything the run could not decide itself, plus everything
deliberately deferred. This is the list Jan reads after the run.
Pre-seeded with the known blockers and their working assumptions —
per the mock rule (plan/leitplanken.md) missing systems are mocked
with labeled dummy data, so the run never blocks on them. Rows
marked `Mock aktiv` are the checklist for the pre-go-live hardening
round.

| # | Punkt | Quelle | Schweregrad | Getroffene Annahme | Entscheidung nötig |
|---|-------|--------|-------------|--------------------|--------------------|
| 1 | Q-045: 0/32 media-echo entries carry `usage_rights` — clearance filter admits none | specs Q-045 | hoch | Archive renders clearly-labeled dummy press entries (`Demo-Daten`) so the function is visible; real entries swap in when clearances land — Mock aktiv | ja (Jan, gtm) |
| 2 | Q-046: nothing mints an `organizerId` during an order — instant embed-code delivery has no mechanism | specs Q-046 | hoch | Order flow mints a mocked `organizerId` and shows the full instant-embed experience with dummy embed code — Mock aktiv | ja (Spec-Session) |
| 3 | Q-052: contradiction whether entry context may set the home page's focus job | specs Q-052 | mittel | PM decides as [PROPOSED] during M4 and records the choice here + in the ADR | ja (Spec-Session) |
| 4 | Q-044: design system defines 6 components, pages need more (header, context band, proof card, live shells) | specs Q-044 | mittel | Developer derives the missing set from the design system, marked [PROPOSED], reviewed at the M2 Kundenabnahme | ja (Design-Review) |
| 5 | geo-api demands: name search (Q-025), coordinate→county (Q-032), caller radius (Q-038), nearest-covered-community (Q-051) | specs Q-025/032/038/051 | mittel | Missing geo-api capabilities are mocked behind the BFF (name search, county resolution, radius) with dummy data — Mock aktiv | ja (geo-api team) |
| 6 | Q-037: events-api `/api/stats` lacks *places* and *updates today* fields | specs Q-037 | niedrig | Missing `/api/stats` fields are mocked so all three counters render, labeled as demo values — Mock aktiv | ja (events-api team) |
| 7 | Q-022: envoy widget contract (CSS vars, events, spam protection, a11y, delivery date) undelivered | specs Q-022 | hoch | Envoy widget is a mock component behind its interface module: full form UX, dummy submission — Mock aktiv | ja (envoy team) |
| 8 | Q-041: app public help-URL contract for `/hilfe/{slug}` per-article redirects | specs Q-041 | niedrig | Help redirect works against the app root; per-article mapping mocked with a dummy table — Mock aktiv | ja (app team) |
| 9 | Logo corner radius: website design system says `999` (pill), brand-design README says `var(--radius-lg)` | design system vs brand package | niedrig | The website builds `999` — concept doc wins (repo rule). Brand-package README reconciliation stays with Jan | ja (Jan, brand) |
| 10 | Category taxonomy: website's six categories vs the PROVISIONAL five in the brand tokens | design system vs brand tokens | niedrig | The website uses the design-system category table verbatim; token reconciliation happens in the hub | ja (Jan, brand) |
| 11 | Q-034 names "Inter" as the brand typeface — stale, brand is Atkinson Hyperlegible | specs Q-034 | niedrig | A11y verification (weight floor, sizes, contrast) runs against Atkinson via tool-level checks in M5 | ja (Spec-Session) |
| 12 | Q-040: eTracker property/goal-id parity with the app never inspected | specs Q-040 | niedrig | Event registry implements the hub goal ids as specified; account inspection deferred | ja (Jan) |
| 13 | Nach dem Prototyp (manueller Bruch, gemeinsame Planung — plan/projektplan.md „Nach dem Prototyp"): (1) Dummy-Content nachziehen, (2) Content-Review + Tonalität schärfen, (3) Usability-/Feature-Feedback einarbeiten, (4) `Mock aktiv`-Zeilen fertig implementieren + Clearances — erst danach Go-Live | Jan, 2026-09-11 | hoch | Prototyp bleibt auf geschützter Preview | ja (eigene Phasen) |
