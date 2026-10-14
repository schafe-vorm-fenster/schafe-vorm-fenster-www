---
id: ueber-uns-archiv-de
page_id: TS-WEB-0028
route: "/ueber-uns/archiv"
seo:
  "/ueber-uns/archiv":
    title: "Presse und Auszeichnungen"
    description: "Was über den Kalender berichtet wurde, chronologisch und zum Nachprüfen — jede Zeile verlinkt auf die Originalquelle beim Medium selbst."
    provenance: generated
content_type: section
status: draft
locale: de
sources:
  - "@schafe-vorm-fenster/media-echo@0.3.3"
  - "ia"
derived_from:
  - "@schafe-vorm-fenster/media-echo@0.3.3"
  - "ia"
generated_by: "playbook-content-production@1.0.0"
generated_at: "2026-09-11"
tone_profile: "du-everywhere"
provenance: "sourced — all 31 media-echo entries as citations (DEC-0166, Q-0093): id, title, type, date, source and url verbatim from the package frontmatter, the place from geo, and the first quotation of an entry's `## Original Text` / `## Key Quotes` section verbatim from its body. A citation needs no clearance; no article photo and no third-party logo is shown"
compliance_check: "state/content-map.md#compliance-checks — TS-WEB-0028"
schema_note: "see content/pages/home/de.md — same TS-WEB-0007/schema gap, state/open.md #37"
open_points:
  - "Q-0045 no longer gates this page: Q-0093 is answered (DEC-0166) — a citation (outlet, date, headline, link, a short marked quotation) needs no clearance. `usage_rights` still gates images and logos, which this page does not show"
  - "Counted 31 real entries on 2026-09-12, not the 32 the Phase-1 map and state/open.md #1 quote. The package ships 31 `.media-echo.md` files at 0.3.3"
  - "`src/lib/content/media-echo-citations.integration.test.ts` checks this table against the installed package: every entry once, the fields verbatim, the order, and every quotation a verbatim excerpt of its entry"
---

# Presse und Auszeichnungen (`/ueber-uns/archiv`)

Keine eigene Conversion, kein Einstieg über die Hauptnavigation; erreichbar
über den Button im Auszeichnungsblock auf `/ueber-uns`, den Footer-Link
„Presse" und `/presse` (TS-WEB-0028 D1, DEC-0166). Chronologisch, neueste zuerst — die einzige Ausnahme von der
Relevanz-Sortierung auf dieser Website, weil diese Seite der
Überprüfung dient, nicht der Breite (TS-WEB-0028 D2).

## Slot 1 — Seitenüberschrift

<!-- id: archiv-1-heading; content_type: section; provenance: sourced; derived_from: [ia]; status: draft -->

**h1:** Presse und Auszeichnungen

Bewusst ohne Einleitungstext, der den Bestand verkauft (TS-WEB-0028 D1) — die
Liste ist die Seite.

## Slot 2 — Archiv-Zeilen

<!-- id: archiv-2-rows; content_type: archive-entry; provenance: sourced; derived_from: ["@schafe-vorm-fenster/media-echo@0.3.3"]; status: draft -->

Eine Zeile pro media-echo-Eintrag, als Beleg: Medium, Datum in der
belegten Genauigkeit, Titel, Link zum Original und, wo der Eintrag eines
hat, ein als Zitat gekennzeichneter Auszug mit Quelle (TS-WEB-0028 D3,
DEC-0166). Die Zeilen stehen im Slot darunter; sein Name ist historisch.

<!-- id: archiv-2-rows-demo; content_type: archive-entry; provenance: sourced; derived_from: ["@schafe-vorm-fenster/media-echo@0.3.3"]; status: draft -->

**Archiv-Zeilen:** Alle 31 Einträge aus `media-echo@0.3.3`,
chronologisch, neueste zuerst. ID (Dateiname, zugleich Anker), Titel, Typ,
Datum, Quelle und Link stehen wörtlich so im Frontmatter des jeweiligen
Eintrags; das Zitat ist das erste Zitat aus dem Abschnitt `Original Text`
bzw. `Key Quotes` des Eintrags, wörtlich:

| ID | Titel | Typ | Datum | Quelle | Ort | Link | Zitat |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2026-08-abend-der-engagierten-lehre | Abend der Engagierten — Stiftung Lebendiges Lehre | conference | 2026-08 | Stiftung Lebendiges Lehre | Flechtorf (Landkreis Helmstedt) | https://lebendigeslehre.de/ | — |
| 2026-05-noerd-2026-rostock | NØRD 2026 — NØRD Award Kategorie Smart Community und Vortrag Green Stage | award, conference | 2026-05 | NØRD digital convention / digitales MV | Rostock | https://digitalesmv.de/noerd | — |
| 2026-04-nord-award-nordkurier | Nordkurier — Dorfkalender für Digitalpreis nominiert | press | 2026-04 | Nordkurier | Mecklenburg-Vorpommern | — | — |
| 2026-04-opentransfer-camp-zusammen | openTransfer CAMP Zusammenhalt Neustrelitz | conference | 2026-04 | openTransfer / Stiftung Bürgermut | Neustrelitz (Landkreis Mecklenburgische Seenplatte) | https://opentransfer.de/dokumentation-camp-neustrelitz/ | — |
| 2026-01-zukunftswege-ost-vollblutdigitalisierer | Zukunftswege Ost-Vorpommern — Der Vollblutdigitalisierer von Schlatkow | portrait | 2026-01 | Zukunftswege Ost-Vorpommern / RAA – Demokratie und Bildung Mecklenburg-Vorpommern e. V. | Schlatkow (Landkreis Vorpommern-Greifswald) | https://www.zukunftswege-ost-vorpommern.de/vollblutdigitalisierer-von-schlatkow | Wenn man alles sammelt, ist plötzlich in jedem Dorf jeden Tag irgendwas los. Wir müssen das nur sichtbar machen. |
| 2025-10-dorfmoderation-neubrandenburg | Fortbildungskurs Dorfmoderation — Seminar KI in der Fördermittelbeantragung | conference | 2025-10 | Institut für Kooperative Regionalentwicklung (IKR), Hochschule Neubrandenburg | Neubrandenburg (Landkreis Mecklenburgische Seenplatte) | https://www.hs-nb.de/institute/institut-fuer-kooperative-regionalentwicklung/forschungsschwerpunkt/aktuelle-projekte/dorfmoderation | — |
| 2025-04-fachtag-kultur-vorpommern-greifswald | 6. Fachtag Kultur — MENSCH MACH(T) KULTUR! | conference | 2025-04 | Landkreis Vorpommern-Greifswald | Lassan (Landkreis Vorpommern-Greifswald) | https://www.kulturlandbuero.de/angebote/anmeldungen/fachtag-kultur-vg-2025/ | — |
| 2024-09-kulturlandbuero-volkshochschule | Kulturlandbüro — Volkshochschule bei Schafe vorm Fenster | press | 2024-09 | Kulturlandbüro | Pasewalk (Landkreis Vorpommern-Greifswald) | https://www.kulturlandbuero.de/volkshochschule-bei-schafe-vorm-fenster/ | — |
| 2022-10-digitalkonferenz-vorpommern-greifswald | Digitalkonferenz Vorpommern-Greifswald | conference | 2022-10 | Landkreis Vorpommern-Greifswald | Landkreis Vorpommern-Greifswald | — | — |
| 2022-06-leader-foerderung | LEADER Förderung | award | 2022-06 | LEADER | Landkreis Vorpommern-Greifswald | — | — |
| 2022-05-perspektywa-twitter-tea-time | Tea Time mit perspektywa – Veranstaltungskalender für mein Dorf | social-media | 2022-05-19 | perspektywa (@perspektywaDE) auf Twitter | Landkreis Vorpommern-Greifswald | — | Einladung zur Tea Time! @schafeamfenster – die digitale Pinnwand sammelt digital alle Termine im Landkreis Vorpommern-Greifswald nach Dörfern getrennt, nicht nur zu Veranstaltungen, auch zu mobilen Händlern, Verkehr oder Gemeindeleben. Und du kannst mitmachen! |
| 2022-03-ostseezeitung-doerfer-digitaler | Ostseezeitung — Schafe vorm Fenster will Dörfer in VG digitaler machen | press | 2022-03 | Ostseezeitung | Schmatzin (Landkreis Vorpommern-Greifswald) | https://www.ostsee-zeitung.de/Vorpommern/Usedom/Schmatzins-digitaler-Kalender-vernetzt-kleine-Orte-im-Landkreis | — |
| 2022-02-anzeigenkurier-plattform-doerfer | AnzeigenKurier — Neue Plattform für alle Dörfer | press | 2022-02 | AnzeigenKurier | Landkreis Vorpommern-Greifswald | — | — |
| 2022-02-ihk-to-go-podcast-schafe-vorm-fenster | IHK to Go Podcast #50 — Schafe vorm Fenster: Digitaler Dorf-Aushang | podcast | 2022-02 | IHK Neubrandenburg / IHK to Go Podcast | Neubrandenburg (Landkreis Mecklenburgische Seenplatte) | https://soundcloud.com/ihk-to-go/50-schafe-vorm-fenster-digitaler-dorf-aushang | — |
| 2022-nordkurier-plattform-doerfer | Nordkurier — Neue Plattform für alle Dörfer | press | 2022 | Nordkurier | Landkreis Vorpommern-Greifswald | — | — |
| 2021-12-ihk-faktor-wirtschaft-dorfkalender | IHK Faktor Wirtschaft — Digitaler Dorfkalender für Vorpommern-Greifswald | press | 2021-12 | IHK Neubrandenburg / Faktor Wirtschaft | Landkreis Vorpommern-Greifswald | https://www.neubrandenburg.ihk.de/fileadmin/user_upload/Presse/IHK-Zeitung/11-12_Faktor_2021_screen.pdf | — |
| 2021-11-ndr-ard-themenwoche-stadt-land-wandel | NDR 1 Radio MV — ARD Themenwoche: Stadt.Land.Wandel | press | 2021-11-10 | NDR 1 Radio MV | Mecklenburg-Vorpommern | https://web.archive.org/web/20220121033049/https://www.ndr.de/themenwoche/stadtlandwandel/Schafe-vorm-Fenster-Digitale-Pinnwand-fuer-laendlichen-Raum,schafevormfenster102.html | — |
| 2021-08-kfw-award-gruenden | KfW Award Gründen 2021 — Bewerbung ohne Zuschlag | award | 2021-08 | KfW Bankengruppe | bundesweit | — | — |
| 2020-08-beyond-crisis | #beyondcrisis — Ausgewähltes Projekt von Deutschland – Land der Ideen | award | 2020-08 | Deutschland – Land der Ideen / AusserGewöhnlich Berlin | bundesweit | — | Als andere nur Krise sahen, habt ihr Innovationsgeist gezeigt und Lösungen für die Zukunft entwickelt. |
| 2020-06-von-hier-wettbewerb | von hier — Wettbewerb für regionale Produkte aus MV | award | 2020-06 | Ministerium für Wirtschaft, Arbeit und Gesundheit Mecklenburg-Vorpommern | Mecklenburg-Vorpommern | — | — |
| 2020-inno-award-vtmv | INNO AWARD — Bewerbung | award | 2020 | VTMV e.V. — Verein für Technologie und Marketing Mecklenburg-Vorpommern | Mecklenburg-Vorpommern | — | — |
| 2020-mindbox-db-wettbewerb | mindbox (Deutsche Bahn) — Wettbewerbseinreichung | award | 2020 | mindbox / Deutsche Bahn | bundesweit | — | — |
| 2019-09-nordkurier-dorfleben-internet | Nordkurier — Schafe sollen Dorfleben ins Internet bringen | press | 2019-09-26 | Nordkurier | Landkreis Vorpommern-Greifswald | https://www.nordkurier.de/anklam/schafe-sollen-dorfleben-ins-internet-bringen-2636858409.html | — |
| 2019-09-vorpommern-kurier-dorfleben-internet | Vorpommern Kurier — Schafe sollen Dorfleben ins Internet bringen | press | 2019-09 | Vorpommern Kurier | Landkreis Vorpommern-Greifswald | — | — |
| 2019-06-miteinander-reden-bpb | MITEINANDER REDEN — Förder- und Qualifizierungsprogramm der bpb | award | 2019-06 | Programmbüro Miteinander Reden / Bundeszentrale für politische Bildung (bpb) | bundesweit | — | — |
| 2018-11-nordkurier-gratis-hotspots | Nordkurier — Gratis Hot Spots | press | 2018-11 | Nordkurier | Mecklenburg-Vorpommern | — | — |
| 2018-10-nordkurier-presseartikel | Nordkurier — Presseartikel (Oktober) | press | 2018-10 | Nordkurier | Mecklenburg-Vorpommern | — | — |
| 2018-09-bundespraesidialamt-antwort | Bundespräsidialamt — Antwort auf die Vorstellung der Plattform | recognition | 2018-09 | Bundespräsidialamt / Bundespräsident Frank-Walter Steinmeier | bundesweit | — | — |
| 2018-09-nordkurier-schafe-vom-fenster-serie | Nordkurier — Schafe vorm Fenster (September, mehrere Artikel) | press | 2018-09 | Nordkurier | Mecklenburg-Vorpommern | — | — |
| 2018-08-nordkurier-schafe-vorm-fenster | Nordkurier — Schafe vorm Fenster Bericht (August) | press | 2018-08 | Nordkurier | Mecklenburg-Vorpommern | — | — |
| 2018-06-nordkurier-schafe-vorm-fenster | Nordkurier — Schafe vorm Fenster Bericht (Juni) | press | 2018-06 | Nordkurier | Mecklenburg-Vorpommern | — | — |

Jede Zeile ist ein Beleg und braucht keine Freigabe (Q-0093, DEC-0166).
Fotos aus Artikeln und Logos Dritter zeigt die Seite nicht. Einträge ohne
öffentlich erreichbare Adresse tragen „—" statt eines Links; der Beleg
liegt dann als Scan oder Foto im Paket. Ein Eintrag mit mehreren Typen
(NØRD 2026: `award, conference`) erscheint unter jedem davon.

## Slot 3 — Kontextzeile je Eintrag

<!-- id: archiv-3-context-line; content_type: archive-entry; provenance: sourced; derived_from: ["@schafe-vorm-fenster/media-echo@0.3.3"]; status: draft -->

Mechanische Übersetzung der Metadaten je freigegebenem Eintrag zur
Build-Zeit (TS-WEB-0007 D3) — kein redaktioneller Fließtext pro Eintrag, kein
Erfindungsspielraum.

## Slot 4 — Typ-Filter (Chips)

<!-- id: archiv-4-type-filter; content_type: section; provenance: sourced; derived_from: ["@schafe-vorm-fenster/media-echo@0.3.3"]; status: draft -->

**Labels (aus dem Hub-Vokabular, lokalisiert):**

- Presse
- Auszeichnung
- Konferenz
- Podcast
- Porträt
- Anerkennung
- Social Media
- Alle

Nur Typen mit mindestens einem Eintrag bekommen einen Chip (TS-WEB-0028 D4).
Der Bestand deckt heute alle sieben ab: 14-mal Presse, 8-mal
Auszeichnung, 6-mal Konferenz, je einmal Podcast, Porträt, Anerkennung
und Social Media. Vier der acht Auszeichnungs-Einträge sind Bewerbungen
und keine Preise — die Titel sagen das selbst („Bewerbung ohne
Zuschlag", „Wettbewerbseinreichung"), und die Zeile übernimmt den Titel
wörtlich, statt ihn zu einem Preis zu machen.
