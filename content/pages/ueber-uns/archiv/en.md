---
id: ueber-uns-archiv-de
page_id: TS-028
route: "/ueber-uns/archiv"
seo:
  "/ueber-uns/archiv":
    title: "Archive: coverage and evidence"
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
provenance: "sourced — the archive now carries all 31 real media-echo entries, verbatim from the package frontmatter (title, type, date, source, geo, url). No entry carries usage_rights, so every row is clearance-pending and the page is protected-preview only; 0 generated demo rows left. EN translation of content/pages/ueber-uns/archiv/de.md, same source ids per slot; entry titles stay in their original language"
compliance_check: "state/content-map.md#compliance-checks — TS-028"
schema_note: "see content/pages/home/de.md — same TS-007/schema gap, state/open.md #37"
open_points:
  - "state/open.md #1 — Q-045: none of the 31 media-echo entries carries `usage_rights`. The rows are real and cited, so they ship as `provenance: sourced` with clearance pending, in the protected preview only. Go-live needs the clearance per entry, or the row goes"
  - "Counted 31 real entries on 2026-09-12, not the 32 the Phase-1 map and state/open.md #1 quote. The package ships 31 `.media-echo.md` files at 0.3.3"
  - "Code follow-up — `app/[lang]/ueber-uns/archiv/page.tsx` passes `demo` to every `ArchiveRow` and renders a `DemoDataBadge` whenever rows exist. Both are hard-coded and now mislabel real, cited entries as demo data; the page should read `demo` off the slot (`isDemoSlot`) as `/deine-region` already does"
  - "One entry (`2026-05-noerd-2026-rostock`) carries two types, `award` and `conference`. The table shows the first; the archive-row component takes one type string and uses it as both label and filter id"
---

# Archive (`/ueber-uns/archiv`)

No conversion of its own, no entry point via the main navigation
(TS-028 D1). Chronological, newest first — the only exception to
relevance sorting on this website, because this page serves scrutiny,
not reach (TS-028 D2).

## Slot 1 — Page heading

<!-- id: archiv-1-heading; content_type: section; provenance: sourced; derived_from: [ia]; status: draft -->

**h1:** Archive

Deliberately with no intro text selling the collection (TS-028 D1) —
the list is the page.

## Slot 2 — Archive rows

<!-- id: archiv-2-rows; content_type: archive-entry; provenance: sourced-empty-by-design; derived_from: ["@schafe-vorm-fenster/media-echo@0.3.3"]; status: draft -->

One row per media-echo entry, generated from `title`, `type`, `date`,
`source`, `geo`, and `url`. **As of 2026-09-12: none of the 31 entries
carries `usage_rights`** — a missing field is not a clearance (TS-007
D2). For production that filter still removes everything. Nothing is
invented in its place: the slot below carries all 31 real entries in
the wording of their frontmatter, as `sourced` with clearance pending,
visible in the protected preview only.

<!-- id: archiv-2-rows-demo; content_type: archive-entry; provenance: sourced; derived_from: ["@schafe-vorm-fenster/media-echo@0.3.3"]; status: draft -->

**Archive rows (real, clearance pending):** All 31 entries from
`media-echo@0.3.3`, chronological, newest first. Title, type, date,
source, place, and link are the wording of each entry's own
frontmatter:

| Title | Type | Date | Source | Place | Link |
| --- | --- | --- | --- | --- | --- |
| Abend der Engagierten — Stiftung Lebendiges Lehre | Conference | 2026-08 | Stiftung Lebendiges Lehre | Flechtorf (Helmstedt county) | https://lebendigeslehre.de/ |
| NØRD 2026 — NØRD Award Kategorie Smart Community und Vortrag Green Stage | Award | 2026-05 | NØRD digital convention / digitales MV | Rostock | https://digitalesmv.de/noerd |
| Nordkurier — Dorfkalender für Digitalpreis nominiert | Press | 2026-04 | Nordkurier | Mecklenburg-Vorpommern | — |
| openTransfer CAMP Zusammenhalt Neustrelitz | Conference | 2026-04 | openTransfer / Stiftung Bürgermut | Neustrelitz (Mecklenburgische Seenplatte county) | https://opentransfer.de/dokumentation-camp-neustrelitz/ |
| Zukunftswege Ost-Vorpommern — Der Vollblutdigitalisierer von Schlatkow | Portrait | 2026-01 | Zukunftswege Ost-Vorpommern / RAA – Demokratie und Bildung Mecklenburg-Vorpommern e. V. | Schlatkow (Vorpommern-Greifswald county) | https://www.zukunftswege-ost-vorpommern.de/vollblutdigitalisierer-von-schlatkow |
| Fortbildungskurs Dorfmoderation — Seminar KI in der Fördermittelbeantragung | Conference | 2025-10 | Institut für Kooperative Regionalentwicklung (IKR), Hochschule Neubrandenburg | Neubrandenburg (Mecklenburgische Seenplatte county) | https://www.hs-nb.de/institute/institut-fuer-kooperative-regionalentwicklung/forschungsschwerpunkt/aktuelle-projekte/dorfmoderation |
| 6. Fachtag Kultur — MENSCH MACH(T) KULTUR! | Conference | 2025-04 | Landkreis Vorpommern-Greifswald | Lassan (Vorpommern-Greifswald county) | https://www.kulturlandbuero.de/angebote/anmeldungen/fachtag-kultur-vg-2025/ |
| Kulturlandbüro — Volkshochschule bei Schafe vorm Fenster | Press | 2024-09 | Kulturlandbüro | Pasewalk (Vorpommern-Greifswald county) | https://www.kulturlandbuero.de/volkshochschule-bei-schafe-vorm-fenster/ |
| Digitalkonferenz Vorpommern-Greifswald | Conference | 2022-10 | Landkreis Vorpommern-Greifswald | Vorpommern-Greifswald county | — |
| LEADER Förderung | Award | 2022-06 | LEADER | Vorpommern-Greifswald county | — |
| Tea Time mit perspektywa – Veranstaltungskalender für mein Dorf | Social media | 2022-05-19 | perspektywa (@perspektywaDE) auf Twitter | Vorpommern-Greifswald county | — |
| Ostseezeitung — Schafe vorm Fenster will Dörfer in VG digitaler machen | Press | 2022-03 | Ostseezeitung | Schmatzin (Vorpommern-Greifswald county) | https://www.ostsee-zeitung.de/Vorpommern/Usedom/Schmatzins-digitaler-Kalender-vernetzt-kleine-Orte-im-Landkreis |
| AnzeigenKurier — Neue Plattform für alle Dörfer | Press | 2022-02 | AnzeigenKurier | Vorpommern-Greifswald county | — |
| IHK to Go Podcast #50 — Schafe vorm Fenster: Digitaler Dorf-Aushang | Podcast | 2022-02 | IHK Neubrandenburg / IHK to Go Podcast | Neubrandenburg (Mecklenburgische Seenplatte county) | https://soundcloud.com/ihk-to-go/50-schafe-vorm-fenster-digitaler-dorf-aushang |
| Nordkurier — Neue Plattform für alle Dörfer | Press | 2022 | Nordkurier | Vorpommern-Greifswald county | — |
| IHK Faktor Wirtschaft — Digitaler Dorfkalender für Vorpommern-Greifswald | Press | 2021-12 | IHK Neubrandenburg / Faktor Wirtschaft | Vorpommern-Greifswald county | https://www.neubrandenburg.ihk.de/fileadmin/user_upload/Presse/IHK-Zeitung/11-12_Faktor_2021_screen.pdf |
| NDR 1 Radio MV — ARD Themenwoche: Stadt.Land.Wandel | Press | 2021-11-10 | NDR 1 Radio MV | Mecklenburg-Vorpommern | https://web.archive.org/web/20220121033049/https://www.ndr.de/themenwoche/stadtlandwandel/Schafe-vorm-Fenster-Digitale-Pinnwand-fuer-laendlichen-Raum,schafevormfenster102.html |
| KfW Award Gründen 2021 — Bewerbung ohne Zuschlag | Award | 2021-08 | KfW Bankengruppe | nationwide | — |
| #beyondcrisis — Ausgewähltes Projekt von Deutschland – Land der Ideen | Award | 2020-08 | Deutschland – Land der Ideen / AusserGewöhnlich Berlin | nationwide | — |
| von hier — Wettbewerb für regionale Produkte aus MV | Award | 2020-06 | Ministerium für Wirtschaft, Arbeit und Gesundheit Mecklenburg-Vorpommern | Mecklenburg-Vorpommern | — |
| INNO AWARD — Bewerbung | Award | 2020 | VTMV e.V. — Verein für Technologie und Marketing Mecklenburg-Vorpommern | Mecklenburg-Vorpommern | — |
| mindbox (Deutsche Bahn) — Wettbewerbseinreichung | Award | 2020 | mindbox / Deutsche Bahn | nationwide | — |
| Nordkurier — Schafe sollen Dorfleben ins Internet bringen | Press | 2019-09-26 | Nordkurier | Vorpommern-Greifswald county | https://www.nordkurier.de/anklam/schafe-sollen-dorfleben-ins-internet-bringen-2636858409.html |
| Vorpommern Kurier — Schafe sollen Dorfleben ins Internet bringen | Press | 2019-09 | Vorpommern Kurier | Vorpommern-Greifswald county | — |
| MITEINANDER REDEN — Förder- und Qualifizierungsprogramm der bpb | Award | 2019-06 | Programmbüro Miteinander Reden / Bundeszentrale für politische Bildung (bpb) | nationwide | — |
| Nordkurier — Gratis Hot Spots | Press | 2018-11 | Nordkurier | Mecklenburg-Vorpommern | — |
| Nordkurier — Presseartikel (Oktober) | Press | 2018-10 | Nordkurier | Mecklenburg-Vorpommern | — |
| Bundespräsidialamt — Antwort auf die Vorstellung der Plattform | Recognition | 2018-09 | Bundespräsidialamt / Bundespräsident Frank-Walter Steinmeier | nationwide | — |
| Nordkurier — Schafe vorm Fenster (September, mehrere Artikel) | Press | 2018-09 | Nordkurier | Mecklenburg-Vorpommern | — |
| Nordkurier — Schafe vorm Fenster Bericht (August) | Press | 2018-08 | Nordkurier | Mecklenburg-Vorpommern | — |
| Nordkurier — Schafe vorm Fenster Bericht (Juni) | Press | 2018-06 | Nordkurier | Mecklenburg-Vorpommern | — |

No entry carries `usage_rights` today (Q-045). The rows are real and
evidenced all the same — each one traces back to its entry in the
package — so they stand here as `sourced` with clearance open and no
demo marking, visible in the protected preview only. Before go-live
there is a clearance per row, or the row goes. Entries with no publicly
reachable address carry "—" instead of a link; their evidence sits in
the package as a scan or a photo. Entry titles stay in their original
German, because an archive row cites what was published. The NØRD 2026
entry carries two types (`award` and `conference`) — the table shows the
first, because an archive row carries exactly one type chip.

## Slot 3 — Context line per entry

<!-- id: archiv-3-context-line; content_type: archive-entry; provenance: sourced; derived_from: ["@schafe-vorm-fenster/media-echo@0.3.3"]; status: draft -->

Mechanical translation of the metadata for each cleared entry at build
time (TS-007 D3) — no editorial running text per entry, no room for
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

Only types with at least one entry get a chip (TS-028 D4). The set
covers all seven today: press 14 times, award 8, conference 6, and once
each for podcast, portrait, recognition, and social media. Four of the
eight award entries are applications rather than prizes — the titles say
so themselves ("Bewerbung ohne Zuschlag", "Wettbewerbseinreichung"), and
the row takes the title verbatim instead of turning it into a win.
