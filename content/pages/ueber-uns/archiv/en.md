---
id: ueber-uns-archiv-de
page_id: TS-WEB-0028
route: "/ueber-uns/archiv"
seo:
  "/ueber-uns/archiv":
    title: "Press and awards"
    description: "What has been written about the calendar, in chronological order and open to scrutiny — every row links to the original at the outlet."
    provenance: generated
content_type: section
status: draft
locale: en
sources:
  - "@schafe-vorm-fenster/media-echo@0.3.3"
  - "ia"
derived_from:
  - "@schafe-vorm-fenster/media-echo@0.3.3"
  - "ia"
generated_by: "playbook-content-production@1.0.0"
generated_at: "2026-09-11"
tone_profile: "du-everywhere"
provenance: "sourced — all 31 media-echo entries as citations (DEC-0166, Q-0093): id, title, type, date, source and url verbatim from the package frontmatter, the place from geo, and the first quotation of an entry's `## Original Text` / `## Key Quotes` section verbatim from its body. A citation needs no clearance; no article photo and no third-party logo is shown. EN translation of content/pages/ueber-uns/archiv/de.md, same source ids per slot; entry titles stay in their original language"
compliance_check: "state/content-map.md#compliance-checks — TS-WEB-0028"
schema_note: "see content/pages/home/de.md — same TS-WEB-0007/schema gap, state/open.md #37"
open_points:
  - "Q-0045 no longer gates this page: Q-0093 is answered (DEC-0166) — a citation (outlet, date, headline, link, a short marked quotation) needs no clearance. `usage_rights` still gates images and logos, which this page does not show"
  - "Counted 31 real entries on 2026-09-12, not the 32 the Phase-1 map and state/open.md #1 quote. The package ships 31 `.media-echo.md` files at 0.3.3"
  - "`src/lib/content/media-echo-citations.integration.test.ts` checks this table against the installed package: every entry once, the fields verbatim, the order, and every quotation a verbatim excerpt of its entry"
---

# Press and awards (`/ueber-uns/archiv`)

No conversion of its own, no entry point via the main navigation; reached
from the button in the award block on `/ueber-uns`, the footer link
"Press" and `/presse` (TS-WEB-0028 D1, DEC-0166). Chronological, newest first — the only exception to
relevance sorting on this website, because this page serves scrutiny,
not reach (TS-WEB-0028 D2).

## Slot 1 — Page heading

<!-- id: archiv-1-heading; content_type: section; provenance: sourced; derived_from: [ia]; status: draft -->

**h1:** Press and awards

Deliberately with no intro text selling the collection (TS-WEB-0028 D1) —
the list is the page.

## Slot 2 — Archive rows

<!-- id: archiv-2-rows; content_type: archive-entry; provenance: sourced; derived_from: ["@schafe-vorm-fenster/media-echo@0.3.3"]; status: draft -->

One row per media-echo entry, as a citation: outlet, date at its stated
precision, title, link to the original and, where the entry has one, an
excerpt marked as a quotation with its source (TS-WEB-0028 D3, DEC-0166).
The rows stand in the slot below; its name is historical.

<!-- id: archiv-2-rows-demo; content_type: archive-entry; provenance: sourced; derived_from: ["@schafe-vorm-fenster/media-echo@0.3.3"]; status: draft -->

**Archive rows:** All 31 entries from `media-echo@0.3.3`, chronological,
newest first. ID (file name, also the anchor), title, type, date, source
and link are the wording of each entry's own frontmatter; the quote is the
first quotation in the entry's `Original Text` or `Key Quotes` section,
verbatim:

| ID | Title | Type | Date | Source | Place | Link | Quote |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2026-08-abend-der-engagierten-lehre | Abend der Engagierten — Stiftung Lebendiges Lehre | conference | 2026-08 | Stiftung Lebendiges Lehre | Flechtorf (Helmstedt county) | https://lebendigeslehre.de/ | — |
| 2026-05-noerd-2026-rostock | NØRD 2026 — NØRD Award Kategorie Smart Community und Vortrag Green Stage | award, conference | 2026-05 | NØRD digital convention / digitales MV | Rostock | https://digitalesmv.de/noerd | — |
| 2026-04-nord-award-nordkurier | Nordkurier — Dorfkalender für Digitalpreis nominiert | press | 2026-04 | Nordkurier | Mecklenburg-Vorpommern | — | — |
| 2026-04-opentransfer-camp-zusammen | openTransfer CAMP Zusammenhalt Neustrelitz | conference | 2026-04 | openTransfer / Stiftung Bürgermut | Neustrelitz (Mecklenburgische Seenplatte county) | https://opentransfer.de/dokumentation-camp-neustrelitz/ | — |
| 2026-01-zukunftswege-ost-vollblutdigitalisierer | Zukunftswege Ost-Vorpommern — Der Vollblutdigitalisierer von Schlatkow | portrait | 2026-01 | Zukunftswege Ost-Vorpommern / RAA – Demokratie und Bildung Mecklenburg-Vorpommern e. V. | Schlatkow (Vorpommern-Greifswald county) | https://www.zukunftswege-ost-vorpommern.de/vollblutdigitalisierer-von-schlatkow | Wenn man alles sammelt, ist plötzlich in jedem Dorf jeden Tag irgendwas los. Wir müssen das nur sichtbar machen. |
| 2025-10-dorfmoderation-neubrandenburg | Fortbildungskurs Dorfmoderation — Seminar KI in der Fördermittelbeantragung | conference | 2025-10 | Institut für Kooperative Regionalentwicklung (IKR), Hochschule Neubrandenburg | Neubrandenburg (Mecklenburgische Seenplatte county) | https://www.hs-nb.de/institute/institut-fuer-kooperative-regionalentwicklung/forschungsschwerpunkt/aktuelle-projekte/dorfmoderation | — |
| 2025-04-fachtag-kultur-vorpommern-greifswald | 6. Fachtag Kultur — MENSCH MACH(T) KULTUR! | conference | 2025-04 | Landkreis Vorpommern-Greifswald | Lassan (Vorpommern-Greifswald county) | https://www.kulturlandbuero.de/angebote/anmeldungen/fachtag-kultur-vg-2025/ | — |
| 2024-09-kulturlandbuero-volkshochschule | Kulturlandbüro — Volkshochschule bei Schafe vorm Fenster | press | 2024-09 | Kulturlandbüro | Pasewalk (Vorpommern-Greifswald county) | https://www.kulturlandbuero.de/volkshochschule-bei-schafe-vorm-fenster/ | — |
| 2022-10-digitalkonferenz-vorpommern-greifswald | Digitalkonferenz Vorpommern-Greifswald | conference | 2022-10 | Landkreis Vorpommern-Greifswald | Vorpommern-Greifswald county | — | — |
| 2022-06-leader-foerderung | LEADER Förderung | award | 2022-06 | LEADER | Vorpommern-Greifswald county | — | — |
| 2022-05-perspektywa-twitter-tea-time | Tea Time mit perspektywa – Veranstaltungskalender für mein Dorf | social-media | 2022-05-19 | perspektywa (@perspektywaDE) auf Twitter | Vorpommern-Greifswald county | — | Einladung zur Tea Time! @schafeamfenster – die digitale Pinnwand sammelt digital alle Termine im Landkreis Vorpommern-Greifswald nach Dörfern getrennt, nicht nur zu Veranstaltungen, auch zu mobilen Händlern, Verkehr oder Gemeindeleben. Und du kannst mitmachen! |
| 2022-03-ostseezeitung-doerfer-digitaler | Ostseezeitung — Schafe vorm Fenster will Dörfer in VG digitaler machen | press | 2022-03 | Ostseezeitung | Schmatzin (Vorpommern-Greifswald county) | https://www.ostsee-zeitung.de/Vorpommern/Usedom/Schmatzins-digitaler-Kalender-vernetzt-kleine-Orte-im-Landkreis | — |
| 2022-02-anzeigenkurier-plattform-doerfer | AnzeigenKurier — Neue Plattform für alle Dörfer | press | 2022-02 | AnzeigenKurier | Vorpommern-Greifswald county | — | — |
| 2022-02-ihk-to-go-podcast-schafe-vorm-fenster | IHK to Go Podcast #50 — Schafe vorm Fenster: Digitaler Dorf-Aushang | podcast | 2022-02 | IHK Neubrandenburg / IHK to Go Podcast | Neubrandenburg (Mecklenburgische Seenplatte county) | https://soundcloud.com/ihk-to-go/50-schafe-vorm-fenster-digitaler-dorf-aushang | — |
| 2022-nordkurier-plattform-doerfer | Nordkurier — Neue Plattform für alle Dörfer | press | 2022 | Nordkurier | Vorpommern-Greifswald county | — | — |
| 2021-12-ihk-faktor-wirtschaft-dorfkalender | IHK Faktor Wirtschaft — Digitaler Dorfkalender für Vorpommern-Greifswald | press | 2021-12 | IHK Neubrandenburg / Faktor Wirtschaft | Vorpommern-Greifswald county | https://www.neubrandenburg.ihk.de/fileadmin/user_upload/Presse/IHK-Zeitung/11-12_Faktor_2021_screen.pdf | — |
| 2021-11-ndr-ard-themenwoche-stadt-land-wandel | NDR 1 Radio MV — ARD Themenwoche: Stadt.Land.Wandel | press | 2021-11-10 | NDR 1 Radio MV | Mecklenburg-Vorpommern | https://web.archive.org/web/20220121033049/https://www.ndr.de/themenwoche/stadtlandwandel/Schafe-vorm-Fenster-Digitale-Pinnwand-fuer-laendlichen-Raum,schafevormfenster102.html | — |
| 2021-08-kfw-award-gruenden | KfW Award Gründen 2021 — Bewerbung ohne Zuschlag | award | 2021-08 | KfW Bankengruppe | nationwide | — | — |
| 2020-08-beyond-crisis | #beyondcrisis — Ausgewähltes Projekt von Deutschland – Land der Ideen | award | 2020-08 | Deutschland – Land der Ideen / AusserGewöhnlich Berlin | nationwide | — | Als andere nur Krise sahen, habt ihr Innovationsgeist gezeigt und Lösungen für die Zukunft entwickelt. |
| 2020-06-von-hier-wettbewerb | von hier — Wettbewerb für regionale Produkte aus MV | award | 2020-06 | Ministerium für Wirtschaft, Arbeit und Gesundheit Mecklenburg-Vorpommern | Mecklenburg-Vorpommern | — | — |
| 2020-inno-award-vtmv | INNO AWARD — Bewerbung | award | 2020 | VTMV e.V. — Verein für Technologie und Marketing Mecklenburg-Vorpommern | Mecklenburg-Vorpommern | — | — |
| 2020-mindbox-db-wettbewerb | mindbox (Deutsche Bahn) — Wettbewerbseinreichung | award | 2020 | mindbox / Deutsche Bahn | nationwide | — | — |
| 2019-09-nordkurier-dorfleben-internet | Nordkurier — Schafe sollen Dorfleben ins Internet bringen | press | 2019-09-26 | Nordkurier | Vorpommern-Greifswald county | https://www.nordkurier.de/anklam/schafe-sollen-dorfleben-ins-internet-bringen-2636858409.html | — |
| 2019-09-vorpommern-kurier-dorfleben-internet | Vorpommern Kurier — Schafe sollen Dorfleben ins Internet bringen | press | 2019-09 | Vorpommern Kurier | Vorpommern-Greifswald county | — | — |
| 2019-06-miteinander-reden-bpb | MITEINANDER REDEN — Förder- und Qualifizierungsprogramm der bpb | award | 2019-06 | Programmbüro Miteinander Reden / Bundeszentrale für politische Bildung (bpb) | nationwide | — | — |
| 2018-11-nordkurier-gratis-hotspots | Nordkurier — Gratis Hot Spots | press | 2018-11 | Nordkurier | Mecklenburg-Vorpommern | — | — |
| 2018-10-nordkurier-presseartikel | Nordkurier — Presseartikel (Oktober) | press | 2018-10 | Nordkurier | Mecklenburg-Vorpommern | — | — |
| 2018-09-bundespraesidialamt-antwort | Bundespräsidialamt — Antwort auf die Vorstellung der Plattform | recognition | 2018-09 | Bundespräsidialamt / Bundespräsident Frank-Walter Steinmeier | nationwide | — | — |
| 2018-09-nordkurier-schafe-vom-fenster-serie | Nordkurier — Schafe vorm Fenster (September, mehrere Artikel) | press | 2018-09 | Nordkurier | Mecklenburg-Vorpommern | — | — |
| 2018-08-nordkurier-schafe-vorm-fenster | Nordkurier — Schafe vorm Fenster Bericht (August) | press | 2018-08 | Nordkurier | Mecklenburg-Vorpommern | — | — |
| 2018-06-nordkurier-schafe-vorm-fenster | Nordkurier — Schafe vorm Fenster Bericht (Juni) | press | 2018-06 | Nordkurier | Mecklenburg-Vorpommern | — | — |

Every row is a citation and needs no clearance (Q-0093, DEC-0166). The
page shows no article photos and no third-party logos. Entries with no
publicly reachable address carry "—" instead of a link; their evidence
sits in the package as a scan or a photo. Entry titles and quotations
stay in their original German, because a row cites what was published.
An entry with several types (NØRD 2026: `award, conference`) appears under
each of them.

## Slot 3 — Context line per entry

<!-- id: archiv-3-context-line; content_type: archive-entry; provenance: sourced; derived_from: ["@schafe-vorm-fenster/media-echo@0.3.3"]; status: draft -->

Mechanical translation of the metadata for each cleared entry at build
time (TS-WEB-0007 D3) — no editorial running text per entry, no room for
invention.

## Slot 4 — Type filter (chips)

<!-- id: archiv-4-type-filter; content_type: section; provenance: sourced; derived_from: ["@schafe-vorm-fenster/media-echo@0.3.3"]; status: draft -->

**Labels (from the hub vocabulary, localized):**

- Press
- Award
- Conference
- Podcast
- Portrait
- Recognition
- Social media
- All

Only types with at least one entry get a chip (TS-WEB-0028 D4). The set
covers all seven today: press 14 times, award 8, conference 6, and once
each for podcast, portrait, recognition, and social media. Four of the
eight award entries are applications rather than prizes — the titles say
so themselves ("Bewerbung ohne Zuschlag", "Wettbewerbseinreichung"), and
the row takes the title verbatim instead of turning it into a win.
