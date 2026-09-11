---
artefact: rtm
status: DRAFT
date: 2026-09-09
---

# Requirements Traceability Matrix

Coarse-grained by area; per-requirement locators live in the requirement
files themselves.

| Area (file) | IDs | Sources | Decisions | Open questions |
| --- | --- | --- | --- | --- |
| jobs-and-navigation | WEB-F-001–009 | SRC-001, SRC-003 | — | — |
| pages | WEB-F-010–022, 026–029 | SRC-003, SRC-008 | DEC-032, DEC-034, DEC-039 | Q-005, Q-006, Q-007, Q-017, Q-022 |
| relevance-and-proof | WEB-F-030–039 | SRC-001, SRC-002 | — | Q-002, Q-003, Q-004, Q-014, Q-019 |
| live-data | WEB-F-040–045 | SRC-001, SRC-002, SRC-003, SRC-011 | DEC-021 | Q-015 (Rest) |
| personalization | WEB-F-050–056 | SRC-001, SRC-002, SRC-006 | — | Q-008 |
| localization | WEB-F-060–069 | SRC-006, SRC-007 | DEC-003, DEC-005, DEC-006 | Q-001, Q-010, Q-011 |
| seo | WEB-F-070–079 | SRC-006, SRC-010 | DEC-018 | Q-009, Q-016 |
| content-pipeline | WEB-F-080–089 | SRC-006, SRC-009 | DEC-012, DEC-020 | Q-018 |
| forms-and-leads | WEB-F-090–096 | SRC-003 | DEC-009–013 | Q-017, Q-020, Q-022 |
| rendering-and-resilience | WEB-F-100–106 | SRC-002 | DEC-019, DEC-033 | — |
| place-search | WEB-F-023, 046–049 | SRC-003, SRC-011, entre | DEC-024, DEC-028, DEC-029, DEC-036, DEC-037 | Q-025, Q-028 |
| delivery-pipeline | WEB-C-020–023 | SRC-012 | DEC-031 | Q-027 |
| performance | WEB-Q-001–008 | SRC-006, SRC-007 | DEC-007 | — |
| accessibility | WEB-Q-010–019, 026–027 | SRC-006 | DEC-012 | Q-013, Q-021 |
| privacy | WEB-Q-020–025, 028 | SRC-001, SRC-006 | DEC-004, DEC-016 | Q-008 |
| security | WEB-Q-030–038 | SRC-006 | DEC-014, DEC-015, DEC-017, DEC-025 | Q-022 |
| technical constraints | WEB-C-001–006 | SRC-006, SRC-008 | DEC-002 | — |
| scope boundaries | WEB-C-010–016 | SRC-001, SRC-003 | — | Q-006, Q-012 |

## Tactical layer

| Tactical spec | Implements |
| --- | --- |
| TS-001 locale-routing | WEB-F-060–069 |
| TS-002 accessibility | WEB-Q-010–019, 026–027 |
| TS-003 performance | WEB-Q-001–008, WEB-F-105 |
| TS-004 url-and-routing | WEB-F-002, 010–018, 021, 026–027, 047–048, 067, 073, 079 · WEB-Q-037–038 |
| TS-005 relevance-engine | WEB-F-024, 030–036, 038, 042, 052, 055 |
| TS-006 page-composition | WEB-F-001, 003–009, 019, 020, 022 |
| TS-007 content-pipeline | WEB-F-025, 039, 080–089 |
| TS-008 live-data | WEB-F-040, 041, 043–046, 049 |
| TS-009 rendering-and-resilience | WEB-F-100–104, 106 |
| TS-010 personalization | WEB-F-050, 051, 053, 054, 056, 069 |
| TS-011 seo | WEB-F-070–072, 074–078 |
| TS-012 analytics | WEB-Q-020–022, 028 |
| TS-013 privacy | WEB-Q-023–025 |
| TS-014 security | WEB-Q-030–036 |
| TS-015 delivery-pipeline | WEB-C-020–023 |
| TS-016 forms-and-leads | WEB-F-090–096 |
| TS-017 technical-foundation | WEB-C-001–006 |
| TS-018 scope-boundaries | WEB-C-010–016 |
| TS-019 home | WEB-F-010 |
| TS-020 dein-ort | WEB-F-011 |
| TS-021 dein-ort/starten | WEB-F-047 |
| TS-022 mitmachen | WEB-F-012 |
| TS-023 registrieren | WEB-F-013 |
| TS-024 dein-kalender | WEB-F-014, 020 |
| TS-025 bestellen | WEB-F-015 |
| TS-026 deine-region | WEB-F-016, 022, 028 |
| TS-027 ueber-uns | WEB-F-017 |
| TS-028 archiv | WEB-F-018, 037 |
| TS-029 rechtliches | WEB-F-029 |

## Chain upward

Goals: `@schafe-vorm-fenster/goals` · Needs: audience
`communication_goals` / `information_needs` in `@schafe-vorm-fenster/audiences`
· Conversions: `@schafe-vorm-fenster/goals`. See
`ssd/website-relaunch.ssd.md`.
