# Offene Punkte

Everything the run could not decide itself, plus everything
deliberately deferred. This is the list Jan reads after the run.
Pre-seeded with the known blockers and their working assumptions —
the run builds the documented degradation, never blocks on them.

| # | Punkt | Quelle | Schweregrad | Getroffene Annahme | Entscheidung nötig |
|---|-------|--------|-------------|--------------------|--------------------|
| 1 | Q-045: 0/32 media-echo entries carry `usage_rights` — clearance filter admits none | specs Q-045 | hoch | `/ueber-uns/archiv` ships with the designed empty state; fills itself when clearances land in the hub | ja (Jan, gtm) |
| 2 | Q-046: nothing mints an `organizerId` during an order — instant embed-code delivery has no mechanism | specs Q-046 | hoch | Order flow ends with confirmation + "Zugang folgt" instead of instant embed; demand to app/envoy stays open | ja (Spec-Session) |
| 3 | Q-052: contradiction whether entry context may set the home page's focus job | specs Q-052 | mittel | PM decides as [PROPOSED] during M4 and records the choice here + in the ADR | ja (Spec-Session) |
| 4 | Q-044: design system defines 6 components, pages need more (header, context band, proof card, live shells) | specs Q-044 | mittel | Developer derives the missing set from the design system, marked [PROPOSED], reviewed at the M2 Kundenabnahme | ja (Design-Review) |
| 5 | geo-api demands: name search (Q-025), coordinate→county (Q-032), caller radius (Q-038), nearest-covered-community (Q-051) | specs Q-025/032/038/051 | mittel | Build against current API; BFF approximates radius via haversine (TS-008); county-dependent tiers degrade per spec | ja (geo-api team) |
| 6 | Q-037: events-api `/api/stats` lacks *places* and *updates today* fields | specs Q-037 | niedrig | Only the counters with existing fields render (per WEB-F-041) | ja (events-api team) |
| 7 | Q-022: envoy widget contract (CSS vars, events, spam protection, a11y, delivery date) undelivered | specs Q-022 | hoch | Widget mounts behind an interface module with a designed fallback form state; swap-in when contract lands | ja (envoy team) |
| 8 | Q-041: app public help-URL contract for `/hilfe/{slug}` per-article redirects | specs Q-041 | niedrig | All `/hilfe/*` redirect to the app root (DEC-047 interim) | ja (app team) |
| 9 | Logo corner radius: website design system says `999` (pill), brand-design README says `var(--radius-lg)` | design system vs brand package | niedrig | The website builds `999` — concept doc wins (repo rule). Brand-package README reconciliation stays with Jan | ja (Jan, brand) |
| 10 | Category taxonomy: website's six categories vs the PROVISIONAL five in the brand tokens | design system vs brand tokens | niedrig | The website uses the design-system category table verbatim; token reconciliation happens in the hub | ja (Jan, brand) |
| 11 | Q-034 names "Inter" as the brand typeface — stale, brand is Atkinson Hyperlegible | specs Q-034 | niedrig | A11y verification (weight floor, sizes, contrast) runs against Atkinson via tool-level checks in M5 | ja (Spec-Session) |
| 12 | Q-040: eTracker property/goal-id parity with the app never inspected | specs Q-040 | niedrig | Event registry implements the hub goal ids as specified; account inspection deferred | ja (Jan) |
