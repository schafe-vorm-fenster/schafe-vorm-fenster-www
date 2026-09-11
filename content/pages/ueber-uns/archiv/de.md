---
id: ueber-uns-archiv-de
page_id: TS-028
route: "/ueber-uns/archiv"
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
provenance: "sourced-empty-by-design at scale for the real list — 0/32 media-echo entries carry usage_rights today (Q-045); under the prototype completeness override, slot 2 additionally carries 6 generated, clearly-labelled demo rows (provenance: generated, demo: true) so the page is not empty in the prototype — state/open.md Dummy-Content"
compliance_check: "state/content-map.md#compliance-checks — TS-028"
schema_note: "see content/pages/home/de.md — same TS-007/schema gap, state/open.md #37"
open_points:
  - "state/open.md #1 — Q-045, 0/32 media-echo entries cleared; this page renders zero rows until that changes"
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

Eine Zeile pro freigegebenem media-echo-Eintrag, generiert aus
`title`, `type`, `date`, `source`, `geo`. **Stand heute (2026-09-11): 0
der 32 Einträge tragen `usage_rights`**, also erscheint keine Zeile — ein
fehlendes Feld ist keine Freigabe (TS-007 D2). Kein erfundener oder
paraphrasierter Ersatzeintrag füllt die eigentliche Liste; das
widerspräche SRC-001 Regel 4 direkt. Sobald Freigaben vorliegen, füllt
sich die Liste ohne Textänderung an dieser Datei.

<!-- id: archiv-2-rows-demo; content_type: archive-entry; provenance: generated; derived_from: []; status: draft; demo: true -->

**Demo-Zeilen (Prototyp, `Demo-Daten`-Badge):** Für den vollständigen
Prototyp-Eindruck zeigt diese Ansicht sechs beispielhafte Archiv-Zeilen
anstelle der leeren Liste — jede Zeile deutlich als Demo markiert, keine
davon eine reale Presse- oder Auszeichnungsmeldung:

| Titel | Typ | Datum | Quelle | Ort |
| --- | --- | --- | --- | --- |
| „Digitale Dorfkalender erreichen Vorpommern" (Beispiel) | Presse | 2026-03-12 | Beispielzeitung | Beispielgemeinde Musterdorf |
| „Auszeichnung für digitale Teilhabe im ländlichen Raum" (Beispiel) | Auszeichnung | 2025-11-04 | Beispiel-Fachpreis Ländliche Digitalisierung | Beispiellandkreis Musterkreis |
| „Vortrag über gemeinschaftliche Kalenderprojekte" (Beispiel) | Konferenz | 2025-09-20 | Beispielkonferenz Digitales Dorf | Beispielstadt Musterheim |
| „Gespräch über den Dorfkalender im Regionalpodcast" (Beispiel) | Podcast | 2025-06-15 | Beispielpodcast Landleben Digital | Beispielregion Musterland |
| „Porträt: Wie ein Dorfprojekt zur Software wurde" (Beispiel) | Porträt | 2025-02-08 | Beispielmagazin Ländliches Leben | Beispielgemeinde Musterdorf |
| „Erwähnung in der Übersicht digitaler Verwaltungsprojekte" (Beispiel) | Anerkennung | 2024-10-30 | Beispielverband Kommunale Digitalisierung | Beispiellandkreis Mustermark |

Titel, Daten, Quellen und Orte sind frei erfunden und durchgängig mit
„(Beispiel)" gekennzeichnet; sie erscheinen nur im Prototyp und
verschwinden vollständig, sobald reale, freigegebene media-echo-Einträge
vorliegen.

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

Nur Typen mit mindestens einem freigegebenen Eintrag bekommen einen
Chip (TS-028 D4) — solange kein Eintrag freigegeben ist, erscheint kein
Chip.
