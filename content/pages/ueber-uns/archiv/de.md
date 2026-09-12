---
id: ueber-uns-archiv-de
page_id: TS-028
route: "/ueber-uns/archiv"
seo:
  "/ueber-uns/archiv":
    title: "Archiv: Berichte und Belege"
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
provenance: "sourced — the archive now carries all 31 real media-echo entries, verbatim from the package frontmatter (title, type, date, source, geo, url). No entry carries usage_rights, so every row is clearance-pending and the page is protected-preview only; 0 generated demo rows left"
compliance_check: "state/content-map.md#compliance-checks — TS-028"
schema_note: "see content/pages/home/de.md — same TS-007/schema gap, state/open.md #37"
open_points:
  - "state/open.md #1 — Q-045: none of the 31 media-echo entries carries `usage_rights`. The rows are real and cited, so they ship as `provenance: sourced` with clearance pending, in the protected preview only. Go-live needs the clearance per entry, or the row goes"
  - "Counted 31 real entries on 2026-09-12, not the 32 the Phase-1 map and state/open.md #1 quote. The package ships 31 `.media-echo.md` files at 0.3.3"
  - "Code follow-up — `app/[lang]/ueber-uns/archiv/page.tsx` passes `demo` to every `ArchiveRow` and renders a `DemoDataBadge` whenever rows exist. Both are hard-coded and now mislabel real, cited entries as demo data; the page should read `demo` off the slot (`isDemoSlot`) as `/deine-region` already does"
  - "One entry (`2026-05-noerd-2026-rostock`) carries two types, `award` and `conference`. The table shows the first; the archive-row component takes one type string and uses it as both label and filter id"
---

# Archiv (`/ueber-uns/archiv`)

Keine eigene Conversion, kein Einstieg über die Hauptnavigation
(TS-028 D1). Chronologisch, neueste zuerst — die einzige Ausnahme von der
Relevanz-Sortierung auf dieser Website, weil diese Seite der
Überprüfung dient, nicht der Breite (TS-028 D2).

## Slot 1 — Seitenüberschrift

<!-- id: archiv-1-heading; content_type: section; provenance: sourced; derived_from: [ia]; status: draft -->

**h1:** Archiv

Bewusst ohne Einleitungstext, der den Bestand verkauft (TS-028 D1) — die
Liste ist die Seite.

## Slot 2 — Archiv-Zeilen

<!-- id: archiv-2-rows; content_type: archive-entry; provenance: sourced-empty-by-design; derived_from: ["@schafe-vorm-fenster/media-echo@0.3.3"]; status: draft -->

Eine Zeile pro media-echo-Eintrag, generiert aus `title`, `type`,
`date`, `source`, `geo` und `url`. **Stand 2026-09-12: keiner der 31
Einträge trägt `usage_rights`** — ein fehlendes Feld ist keine Freigabe
(TS-007 D2). Für Produktion filtert diese Regel weiterhin alles heraus.
Erfunden wird trotzdem nichts: Der Slot darunter führt alle 31 echten
Einträge im Wortlaut ihres Frontmatters, als `sourced` mit offener
Freigabe, sichtbar nur im geschützten Preview.

<!-- id: archiv-2-rows-demo; content_type: archive-entry; provenance: sourced; derived_from: ["@schafe-vorm-fenster/media-echo@0.3.3"]; status: draft -->

**Archiv-Zeilen (echt, Freigabe steht aus):** Alle 31 Einträge aus
`media-echo@0.3.3`, chronologisch, neueste zuerst. Titel, Typ, Datum,
Quelle, Ort und Link stehen wörtlich so im Frontmatter des jeweiligen
Eintrags:

| Titel | Typ | Datum | Quelle | Ort | Link |
| --- | --- | --- | --- | --- | --- |
| Abend der Engagierten — Stiftung Lebendiges Lehre | Konferenz | 2026-08 | Stiftung Lebendiges Lehre | Flechtorf (Landkreis Helmstedt) | https://lebendigeslehre.de/ |
| NØRD 2026 — NØRD Award Kategorie Smart Community und Vortrag Green Stage | Auszeichnung | 2026-05 | NØRD digital convention / digitales MV | Rostock | https://digitalesmv.de/noerd |
| Nordkurier — Dorfkalender für Digitalpreis nominiert | Presse | 2026-04 | Nordkurier | Mecklenburg-Vorpommern | — |
| openTransfer CAMP Zusammenhalt Neustrelitz | Konferenz | 2026-04 | openTransfer / Stiftung Bürgermut | Neustrelitz (Landkreis Mecklenburgische Seenplatte) | https://opentransfer.de/dokumentation-camp-neustrelitz/ |
| Zukunftswege Ost-Vorpommern — Der Vollblutdigitalisierer von Schlatkow | Porträt | 2026-01 | Zukunftswege Ost-Vorpommern / RAA – Demokratie und Bildung Mecklenburg-Vorpommern e. V. | Schlatkow (Landkreis Vorpommern-Greifswald) | https://www.zukunftswege-ost-vorpommern.de/vollblutdigitalisierer-von-schlatkow |
| Fortbildungskurs Dorfmoderation — Seminar KI in der Fördermittelbeantragung | Konferenz | 2025-10 | Institut für Kooperative Regionalentwicklung (IKR), Hochschule Neubrandenburg | Neubrandenburg (Landkreis Mecklenburgische Seenplatte) | https://www.hs-nb.de/institute/institut-fuer-kooperative-regionalentwicklung/forschungsschwerpunkt/aktuelle-projekte/dorfmoderation |
| 6. Fachtag Kultur — MENSCH MACH(T) KULTUR! | Konferenz | 2025-04 | Landkreis Vorpommern-Greifswald | Lassan (Landkreis Vorpommern-Greifswald) | https://www.kulturlandbuero.de/angebote/anmeldungen/fachtag-kultur-vg-2025/ |
| Kulturlandbüro — Volkshochschule bei Schafe vorm Fenster | Presse | 2024-09 | Kulturlandbüro | Pasewalk (Landkreis Vorpommern-Greifswald) | https://www.kulturlandbuero.de/volkshochschule-bei-schafe-vorm-fenster/ |
| Digitalkonferenz Vorpommern-Greifswald | Konferenz | 2022-10 | Landkreis Vorpommern-Greifswald | Landkreis Vorpommern-Greifswald | — |
| LEADER Förderung | Auszeichnung | 2022-06 | LEADER | Landkreis Vorpommern-Greifswald | — |
| Tea Time mit perspektywa – Veranstaltungskalender für mein Dorf | Social Media | 2022-05-19 | perspektywa (@perspektywaDE) auf Twitter | Landkreis Vorpommern-Greifswald | — |
| Ostseezeitung — Schafe vorm Fenster will Dörfer in VG digitaler machen | Presse | 2022-03 | Ostseezeitung | Schmatzin (Landkreis Vorpommern-Greifswald) | https://www.ostsee-zeitung.de/Vorpommern/Usedom/Schmatzins-digitaler-Kalender-vernetzt-kleine-Orte-im-Landkreis |
| AnzeigenKurier — Neue Plattform für alle Dörfer | Presse | 2022-02 | AnzeigenKurier | Landkreis Vorpommern-Greifswald | — |
| IHK to Go Podcast #50 — Schafe vorm Fenster: Digitaler Dorf-Aushang | Podcast | 2022-02 | IHK Neubrandenburg / IHK to Go Podcast | Neubrandenburg (Landkreis Mecklenburgische Seenplatte) | https://soundcloud.com/ihk-to-go/50-schafe-vorm-fenster-digitaler-dorf-aushang |
| Nordkurier — Neue Plattform für alle Dörfer | Presse | 2022 | Nordkurier | Landkreis Vorpommern-Greifswald | — |
| IHK Faktor Wirtschaft — Digitaler Dorfkalender für Vorpommern-Greifswald | Presse | 2021-12 | IHK Neubrandenburg / Faktor Wirtschaft | Landkreis Vorpommern-Greifswald | https://www.neubrandenburg.ihk.de/fileadmin/user_upload/Presse/IHK-Zeitung/11-12_Faktor_2021_screen.pdf |
| NDR 1 Radio MV — ARD Themenwoche: Stadt.Land.Wandel | Presse | 2021-11-10 | NDR 1 Radio MV | Mecklenburg-Vorpommern | https://web.archive.org/web/20220121033049/https://www.ndr.de/themenwoche/stadtlandwandel/Schafe-vorm-Fenster-Digitale-Pinnwand-fuer-laendlichen-Raum,schafevormfenster102.html |
| KfW Award Gründen 2021 — Bewerbung ohne Zuschlag | Auszeichnung | 2021-08 | KfW Bankengruppe | bundesweit | — |
| #beyondcrisis — Ausgewähltes Projekt von Deutschland – Land der Ideen | Auszeichnung | 2020-08 | Deutschland – Land der Ideen / AusserGewöhnlich Berlin | bundesweit | — |
| von hier — Wettbewerb für regionale Produkte aus MV | Auszeichnung | 2020-06 | Ministerium für Wirtschaft, Arbeit und Gesundheit Mecklenburg-Vorpommern | Mecklenburg-Vorpommern | — |
| INNO AWARD — Bewerbung | Auszeichnung | 2020 | VTMV e.V. — Verein für Technologie und Marketing Mecklenburg-Vorpommern | Mecklenburg-Vorpommern | — |
| mindbox (Deutsche Bahn) — Wettbewerbseinreichung | Auszeichnung | 2020 | mindbox / Deutsche Bahn | bundesweit | — |
| Nordkurier — Schafe sollen Dorfleben ins Internet bringen | Presse | 2019-09-26 | Nordkurier | Landkreis Vorpommern-Greifswald | https://www.nordkurier.de/anklam/schafe-sollen-dorfleben-ins-internet-bringen-2636858409.html |
| Vorpommern Kurier — Schafe sollen Dorfleben ins Internet bringen | Presse | 2019-09 | Vorpommern Kurier | Landkreis Vorpommern-Greifswald | — |
| MITEINANDER REDEN — Förder- und Qualifizierungsprogramm der bpb | Auszeichnung | 2019-06 | Programmbüro Miteinander Reden / Bundeszentrale für politische Bildung (bpb) | bundesweit | — |
| Nordkurier — Gratis Hot Spots | Presse | 2018-11 | Nordkurier | Mecklenburg-Vorpommern | — |
| Nordkurier — Presseartikel (Oktober) | Presse | 2018-10 | Nordkurier | Mecklenburg-Vorpommern | — |
| Bundespräsidialamt — Antwort auf die Vorstellung der Plattform | Anerkennung | 2018-09 | Bundespräsidialamt / Bundespräsident Frank-Walter Steinmeier | bundesweit | — |
| Nordkurier — Schafe vorm Fenster (September, mehrere Artikel) | Presse | 2018-09 | Nordkurier | Mecklenburg-Vorpommern | — |
| Nordkurier — Schafe vorm Fenster Bericht (August) | Presse | 2018-08 | Nordkurier | Mecklenburg-Vorpommern | — |
| Nordkurier — Schafe vorm Fenster Bericht (Juni) | Presse | 2018-06 | Nordkurier | Mecklenburg-Vorpommern | — |

Kein Eintrag trägt heute `usage_rights` (Q-045). Die Zeilen sind
trotzdem echt und belegt — jede führt auf ihren Eintrag im Paket zurück
—, also stehen sie hier als `sourced` mit offener Freigabe und ohne
Demo-Kennzeichnung, sichtbar nur im geschützten Preview. Vor dem
Go-live liegt je Zeile eine Freigabe vor, oder die Zeile fällt weg.
Einträge ohne öffentlich erreichbare Adresse tragen „—" statt eines
Links; der Beleg liegt dann als Scan oder Foto im Paket. Der Eintrag
zur NØRD 2026 trägt zwei Typen (`award` und `conference`) — die Tabelle
zeigt den ersten, weil eine Zeile im Archiv genau einen Typ-Chip trägt.

## Slot 3 — Kontextzeile je Eintrag

<!-- id: archiv-3-context-line; content_type: archive-entry; provenance: sourced; derived_from: ["@schafe-vorm-fenster/media-echo@0.3.3"]; status: draft -->

Mechanische Übersetzung der Metadaten je freigegebenem Eintrag zur
Build-Zeit (TS-007 D3) — kein redaktioneller Fließtext pro Eintrag, kein
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

Nur Typen mit mindestens einem Eintrag bekommen einen Chip (TS-028 D4).
Der Bestand deckt heute alle sieben ab: 14-mal Presse, 8-mal
Auszeichnung, 6-mal Konferenz, je einmal Podcast, Porträt, Anerkennung
und Social Media. Vier der acht Auszeichnungs-Einträge sind Bewerbungen
und keine Preise — die Titel sagen das selbst („Bewerbung ohne
Zuschlag", „Wettbewerbseinreichung"), und die Zeile übernimmt den Titel
wörtlich, statt ihn zu einem Preis zu machen.
