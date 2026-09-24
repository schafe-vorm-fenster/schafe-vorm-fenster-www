---
artefact: rtm
status: DRAFT
date: 2026-09-09
---

# Requirements Traceability Matrix

Coarse-grained by area; per-requirement locators live in the requirement
files themselves.

Every identifier below is in the STRICT form
`<TYPE>-<DOMAIN>-<NNNN>` (DEC-0086). No number was reassigned in that
change — `WEB-F-007` became `FUN-WEB-0007` — so a row of this matrix traces
the same artefact it traced before. `identifier-map.md` beside this file
maps every old identifier to its new one, and names the 114 files renamed
to carry their own artefact's id.

| Area (file) | IDs | Sources | Decisions | Open questions |
| --- | --- | --- | --- | --- |
| jobs-and-navigation | CON-WEB-0059, FUN-WEB-0001–0002, FUN-WEB-0004–0007, FUN-WEB-0009, FUN-WEB-0133–0136, FUN-WEB-0138 | SRC-0001, SRC-0003, SRC-0017, SRC-0018 | DEC-0080, DEC-0082, DEC-0083 | — |
| pages | BUS-WEB-0015–0016, CON-WEB-0060–0061, CON-WEB-0064–0067, FUN-WEB-0010–0018, FUN-WEB-0027, FUN-WEB-0137, FUN-WEB-0139–0141, FUN-WEB-0145–0148, FUN-WEB-0202–0203 | SRC-0003, SRC-0008 | DEC-0032, DEC-0034, DEC-0039, DEC-0066, DEC-0081, DEC-0084 | Q-0005, Q-0006, Q-0007, Q-0017, Q-0022, Q-0072 |
| relevance-and-proof | CON-WEB-0068–0069, FUN-WEB-0024, FUN-WEB-0030–0031, FUN-WEB-0033–0035, FUN-WEB-0037–0039, FUN-WEB-0149–0151 | SRC-0001, SRC-0002 | — | Q-0002, Q-0003, Q-0004, Q-0014, Q-0019 |
| live-data | FUN-WEB-0040–0043, FUN-WEB-0045, FUN-WEB-0153–0154 | SRC-0001, SRC-0002, SRC-0003, SRC-0011 | DEC-0021 | Q-0015 (Rest) |
| personalization | CON-WEB-0073, FUN-WEB-0050–0052, FUN-WEB-0054–0056, FUN-WEB-0160–0162 | SRC-0001, SRC-0002, SRC-0006 | — | Q-0008 |
| localization | CON-WEB-0074, CON-WEB-0076, FUN-WEB-0060, FUN-WEB-0062–0063, FUN-WEB-0065–0068, FUN-WEB-0163–0166, FUN-WEB-0168 | SRC-0006, SRC-0007 | DEC-0003, DEC-0005, DEC-0006 | Q-0001, Q-0010, Q-0011 |
| seo | CON-WEB-0075, FUN-WEB-0070–0074, FUN-WEB-0076–0078, FUN-WEB-0169–0170 | SRC-0006, SRC-0010 | DEC-0018 | Q-0009, Q-0016 |
| content-pipeline | CON-WEB-0063, CON-WEB-0077–0080, CON-WEB-0087, FUN-WEB-0083, FUN-WEB-0089, FUN-WEB-0143–0144, FUN-WEB-0171–0182 | SRC-0006, SRC-0009, SRC-0017, SRC-0018 | DEC-0012, DEC-0020, DEC-0080, DEC-0066, DEC-0083 | Q-0018, Q-0057 |
| forms-and-leads | CON-WEB-0081–0086, FUN-WEB-0091–0092, FUN-WEB-0095, FUN-WEB-0152, FUN-WEB-0183–0191 | SRC-0003 | DEC-0009–013, DEC-0081 | Q-0017, Q-0020, Q-0022, Q-0072 |
| rendering-and-resilience | CON-WEB-0088–0090, FUN-WEB-0102–0103, FUN-WEB-0105, FUN-WEB-0192–0200 | SRC-0002 | DEC-0019, DEC-0033 | — |
| place-search | CON-WEB-0062, CON-WEB-0070–0072, FUN-WEB-0048–0049, FUN-WEB-0142, FUN-WEB-0155–0159 | SRC-0003, SRC-0011, entre | DEC-0024, DEC-0028, DEC-0029, DEC-0036, DEC-0037, DEC-0079 | Q-0025, Q-0028, Q-0051 (Q-0071 closed) |
| delivery-pipeline | CON-WEB-0020–0023 | SRC-0012 | DEC-0031 | Q-0027 |
| performance | FUN-WEB-0107–0117, NFR-WEB-0008, NFR-WEB-0039–0056 | SRC-0006, SRC-0007 | DEC-0007 | — |
| accessibility | CON-WEB-0024–0027, FUN-WEB-0118–0123, FUN-WEB-0128–0130, NFR-WEB-0016, NFR-WEB-0018, NFR-WEB-0057–0060 | SRC-0006 | DEC-0012 | Q-0013, Q-0021 |
| privacy | CON-WEB-0028–0029, CON-WEB-0033, CON-WEB-0035–0037, FUN-WEB-0124–0126, NFR-WEB-0022, NFR-WEB-0024, NFR-WEB-0061–0064 | SRC-0001, SRC-0006 | DEC-0004, DEC-0016 | Q-0008 |
| security | CON-WEB-0030–0032, CON-WEB-0034, CON-WEB-0038–0045, FUN-WEB-0127, NFR-WEB-0065 | SRC-0006 | DEC-0014, DEC-0015, DEC-0017, DEC-0025 | Q-0022 |
| technical constraints | CON-WEB-0003, CON-WEB-0006, CON-WEB-0046–0057, FUN-WEB-0131 | SRC-0006, SRC-0008 | DEC-0002 | — |
| scope boundaries | BUS-WEB-0013–0014, CON-WEB-0010, CON-WEB-0015–0016, CON-WEB-0058, CON-WEB-0091–0092, FUN-WEB-0132, FUN-WEB-0201 | SRC-0001, SRC-0003 | — | Q-0006, Q-0012 |
| audience-model | BUS-WEB-0012 | SRC-0001 | DEC-0087 | — |

## Tactical layer

| Tactical spec | Implements |
| --- | --- |
| TS-WEB-0001 locale-routing | FUN-WEB-0060, FUN-WEB-0062–0063, FUN-WEB-0065–0068, FUN-WEB-0163–0166 |
| TS-WEB-0002 accessibility | CON-WEB-0024–0027, FUN-WEB-0118–0123, FUN-WEB-0128–0130, NFR-WEB-0016, NFR-WEB-0018, NFR-WEB-0057–0060 |
| TS-WEB-0003 performance | FUN-WEB-0105, FUN-WEB-0107–0117, NFR-WEB-0008, NFR-WEB-0039–0056 |
| TS-WEB-0004 url-and-routing | CON-WEB-0042–0045, CON-WEB-0061–0062, CON-WEB-0064, CON-WEB-0067, FUN-WEB-0002, FUN-WEB-0010–0018, FUN-WEB-0027, FUN-WEB-0048, FUN-WEB-0067, FUN-WEB-0073, FUN-WEB-0137, FUN-WEB-0140–0142, FUN-WEB-0145–0147, FUN-WEB-0158–0159, FUN-WEB-0169–0170 |
| TS-WEB-0005 relevance-engine | CON-WEB-0068–0069, FUN-WEB-0024, FUN-WEB-0030–0031, FUN-WEB-0033–0035, FUN-WEB-0038, FUN-WEB-0042, FUN-WEB-0052, FUN-WEB-0055, FUN-WEB-0149–0151 |
| TS-WEB-0006 page-composition | BUS-WEB-0015–0016, CON-WEB-0059–0060, FUN-WEB-0001, FUN-WEB-0004–0007, FUN-WEB-0009, FUN-WEB-0133–0136, FUN-WEB-0138–0139, FUN-WEB-0202–0203 |
| TS-WEB-0007 content-pipeline | CON-WEB-0063, CON-WEB-0077–0080, CON-WEB-0087, FUN-WEB-0039, FUN-WEB-0083, FUN-WEB-0089, FUN-WEB-0143–0144, FUN-WEB-0171–0182 |
| TS-WEB-0008 live-data | CON-WEB-0070–0072, FUN-WEB-0040–0041, FUN-WEB-0043, FUN-WEB-0045, FUN-WEB-0049, FUN-WEB-0153–0157 |
| TS-WEB-0009 rendering-and-resilience | CON-WEB-0088–0090, FUN-WEB-0102–0103, FUN-WEB-0192–0200 |
| TS-WEB-0010 personalization | CON-WEB-0073–0074, CON-WEB-0076, FUN-WEB-0050–0051, FUN-WEB-0054, FUN-WEB-0056, FUN-WEB-0160–0162, FUN-WEB-0168 |
| TS-WEB-0011 seo | CON-WEB-0075, FUN-WEB-0070–0072, FUN-WEB-0074, FUN-WEB-0076–0078 |
| TS-WEB-0012 analytics | CON-WEB-0028–0029, CON-WEB-0035–0037, FUN-WEB-0124, NFR-WEB-0022, NFR-WEB-0061–0062, NFR-WEB-0064 |
| TS-WEB-0013 privacy | CON-WEB-0033, FUN-WEB-0125–0126, NFR-WEB-0024, NFR-WEB-0063 |
| TS-WEB-0014 security | CON-WEB-0030–0032, CON-WEB-0034, CON-WEB-0038–0041, FUN-WEB-0127, NFR-WEB-0065 |
| TS-WEB-0015 delivery-pipeline | CON-WEB-0020–0023 |
| TS-WEB-0016 forms-and-leads | CON-WEB-0081–0086, FUN-WEB-0091–0092, FUN-WEB-0095, FUN-WEB-0152, FUN-WEB-0183–0191 |
| TS-WEB-0017 technical-foundation | CON-WEB-0003, CON-WEB-0006, CON-WEB-0046–0057, FUN-WEB-0131 |
| TS-WEB-0018 scope-boundaries | BUS-WEB-0012–0014, CON-WEB-0010, CON-WEB-0015–0016, CON-WEB-0058, CON-WEB-0091–0092, FUN-WEB-0132, FUN-WEB-0201 |
| TS-WEB-0019 home | FUN-WEB-0010 |
| TS-WEB-0020 dein-ort | FUN-WEB-0011 |
| TS-WEB-0021 dein-ort/starten | FUN-WEB-0158–0159 |
| TS-WEB-0022 mitmachen | FUN-WEB-0012 |
| TS-WEB-0023 registrieren | FUN-WEB-0013 |
| TS-WEB-0024 dein-kalender | BUS-WEB-0015, FUN-WEB-0014, FUN-WEB-0202 |
| TS-WEB-0025 bestellen | FUN-WEB-0015 |
| TS-WEB-0026 deine-region | BUS-WEB-0016, CON-WEB-0065–0066, FUN-WEB-0016, FUN-WEB-0148, FUN-WEB-0203 |
| TS-WEB-0027 ueber-uns | FUN-WEB-0017 |
| TS-WEB-0028 archiv | FUN-WEB-0018, FUN-WEB-0037 |
| TS-WEB-0029 rechtliches | CON-WEB-0067, FUN-WEB-0146 |

## Guides and their contracts

Two pairs, same shape: a guide in `concept/` states what is right, a
contract in `specs/contracts/` states which mechanism catches it being
wrong. Specs cite them; they do not restate them.

| Guide | Contract | Bound by | Cited from |
| --- | --- | --- | --- |
| SRC-0014 design system | SRC-0013 design-system contract | DEC-0056, DEC-0054 | TS-WEB-0006, TS-WEB-0017, FUN-WEB-0006, NFR-WEB-0058, NFR-WEB-0059, CON-WEB-0025 |
| SRC-0017 copy guide | SRC-0018 copy contract | DEC-0080, DEC-0083 | FUN-WEB-0138, CON-WEB-0059, TS-WEB-0006 D5/D7/A8/A16, TS-WEB-0007 D5/D9/D12, every determination that used to state a string, `specs/glossary/glossary.md` |

**Where the words live** (DEC-0083): a spec states the element and what it
must achieve; SRC-0017 and its contract state the wording; the sentence
itself is written in `content/pages/**` during the content phase. Two
carve-outs on the spec side, both narrow: a literal inside a check that
names what must *not* appear, and a label a registry or a decision owns —
the legal anchors (`FUN-WEB-0146, CON-WEB-0067`, TS-WEB-0004 D8), the freshness label (DEC-0019)
and the placeholder badges (DEC-0077).

## Standing surfaces rendered by the layout

Not blocks, not routes, and therefore easy to lose in a per-page reading:

| Surface | Rendered | Owned by | Bound by |
| --- | --- | --- | --- |
| breadcrumb trail | above block 1, five second-level pages | TS-WEB-0006 D2, TS-WEB-0004 | DEC-0071 §2 |
| context band | after the last argument block | TS-WEB-0006 D5 | SRC-0001 §2 |
| closing CTA | last block | TS-WEB-0006 D6 | SRC-0001 §7 |
| contact section | between the closing CTA and the footer, **every page** | TS-WEB-0006 D2, TS-WEB-0016 D1 S1/S3 | DEC-0081 |
| global footer | last | TS-WEB-0004 D4 | FUN-WEB-0140, FUN-WEB-0141, CON-WEB-0061 |

## Chain upward

Goals: `@schafe-vorm-fenster/goals` · Needs: audience
`communication_goals` / `information_needs` in `@schafe-vorm-fenster/audiences`
· Conversions: `@schafe-vorm-fenster/goals`. See
`ssd/website-relaunch.ssd.md`.
