---
id: home-de
page_id: TS-019
route: "/"
content_type: section
status: draft
locale: de
sources:
  - "@schafe-vorm-fenster/messaging@0.1.0#actors--community-calendar"
  - "@schafe-vorm-fenster/messaging@0.1.0#municipalities--portalize-calendar"
  - "@schafe-vorm-fenster/proof@0.3.5#founder-former-volunteer-mayor"
  - "@schafe-vorm-fenster/people@0.3.6#jan-henrik-hempel"
  - "ia"
derived_from:
  - "@schafe-vorm-fenster/messaging@0.1.0#actors--community-calendar"
  - "@schafe-vorm-fenster/messaging@0.1.0#municipalities--portalize-calendar"
  - "@schafe-vorm-fenster/proof@0.3.5#founder-former-volunteer-mayor"
  - "@schafe-vorm-fenster/people@0.3.6#jan-henrik-hempel"
  - "ia"
generated_by: "playbook-content-production@1.0.0"
generated_at: "2026-09-11"
tone_profile: "du-everywhere"
provenance: "mixed — sourced per section, see slot comments; 1 generated slot (slot 8, demo proof stream, prototype completeness override — state/open.md Dummy-Content)"
compliance_check: "state/content-map.md#compliance-checks — TS-019"
schema_note: >-
  src/domain/content-frontmatter.schema.ts predates TS-007 (8 content types,
  no derived_from/RelevanceFacets). The fields above follow TS-007 D6/D7
  and are carried through even though the current schema neither requires
  nor validates them — see state/open.md #37.
---

# Startseite (`/`)

Fokusbereich „know-what-is-on" mit Zustandslogik (TS-019 D2); Reihenfolge
und Zustände sind Layoutlogik, nicht Teil dieser Datei. Platzhalter in
`{geschweiften Klammern}` sind Laufzeitwerte, keine Autorentexte.

## Slot 1 — Suchfeld, kein Ort bekannt (Block 1 / Zustand S1)

<!-- id: home-1-search-hero; content_type: hero; provenance: sourced; derived_from: [ia]; status: draft -->

**Headline:** Was ist bei dir los?

**Sucheingabe (Placeholder):** Deine Postleitzahl

**Button:** Suchen

**Hinweistext unter dem Feld:** Suche nach Ortsnamen kommt noch dazu — bis dahin reicht die Postleitzahl.

Begründung: Die Ortssuche läuft heute ausschließlich über die Postleitzahl
(Q-025, geo-api-Namenssuche steht aus). Die Einschränkung steht deshalb im
Suchfeld selbst statt in einer separaten Fehlermeldung.

## Slot 2 — Ort bekannt, Termine vorhanden (Block 1 / Zustand S2)

<!-- id: home-2-place-dates; content_type: hero; provenance: sourced; derived_from: [ia]; status: draft -->

**Headline:** Das ist los in {place}

**CTA-Label (primär):** Kalender von {place} öffnen

Ortsname und Termine sind Live-Daten (TS-008 Position 1); die Headline ist
ein Textbaustein mit benanntem Platzhalter, kein pro Ort erzeugter Satz
(Segmentunabhängigkeit, TS-007 D7).

## Slot 3 — Ort bekannt, keine Termine (Block 1 / Zustand S3)

<!-- id: home-3-place-empty; content_type: hero; provenance: sourced; derived_from: [ia]; status: draft -->

**Modul-Überschrift (eigener Radius, nicht der Ortsname):** Diese Woche in der Nähe

**Einladungstext:** In {place} steht noch nichts im Kalender. Trag den ersten Termin ein — dein Verein, deine Feuerwehr, deine Gemeinde.

**CTA-Label:** Ersten Termin veröffentlichen

Eigene Formulierung, abweichend von `/dein-ort` Zustand B und
`/dein-ort/starten` (TS-019 Slot-Tabelle Zeile 3): Dieser Text spricht die
Lücke im eigenen Ort an, nicht die Lücke im System.

## Szene 1 — WhatsApp (Mechanismus: whatsapp)

<!-- id: home-4-scene-whatsapp; content_type: value-story; provenance: sourced; derived_from: ["@schafe-vorm-fenster/messaging@0.1.0#actors--community-calendar"]; status: draft -->

**Aha-Frage:** Ein Foto vom Flyer per WhatsApp, und der Termin steht im Kalender?

**Text:** Genau so. Du druckst den Flyer sowieso aus. Fotografierst ihn, schickst das Bild per WhatsApp an unsere Nummer, fertig: Der Termin erscheint in deinem Ort und in den Nachbarorten, ohne dass du ihn ein zweites Mal tippst.

Quelle: `relievers[0]` der Value Proposition „actors--community-calendar" —
„send a photo of the printed flyer by WhatsApp and the date is created
from it".

## Szene 2 — Einbindung (Mechanismus: embed)

<!-- id: home-5-scene-embed; content_type: value-story; provenance: sourced; derived_from: ["@schafe-vorm-fenster/messaging@0.1.0#municipalities--portalize-calendar"]; status: draft -->

**Aha-Frage:** Ein eigener Kalender auf der eigenen Website, ohne eigenes System dahinter?

**Text:** Deine Gemeinde bekommt ihre eigene Auswahl an Terminen, im eigenen Design, unter eigenem Namen, ohne dass bei euch jemand ein System pflegt. Die Akteure vor Ort tragen ihre Termine für sich selbst ein; euer Kalender ist nebenbei aktuell.

Quelle: Value Proposition „municipalities--portalize-calendar", Felder
`gains`/`relievers` — „our own design and our own selection, without our
own system".

## Szene 3 — Herkunft (Mechanismus: provenance)

<!-- id: home-6-scene-provenance; content_type: value-story; provenance: sourced; derived_from: ["@schafe-vorm-fenster/proof@0.3.5#founder-former-volunteer-mayor", "@schafe-vorm-fenster/people@0.3.6#jan-henrik-hempel"]; status: draft -->

**Aha-Frage:** Wer steckt eigentlich dahinter?

**Text:** Jan-Henrik Hempel war selbst ehrenamtlicher Bürgermeister. Der Name der Firma kommt von der Schafweide der Gemeinde vor dem eigenen Küchenfenster. Er kennt die Verwaltung, der der Dienst hilft, von innen.

Quelle: `founder-former-volunteer-mayor` (`usage_rights: cleared`) — belegt
über Nordkurier 2019/2022 und das Zukunftswege-Ost-Porträt 2026.

## Block 2b — Herkunfts-Stempel

<!-- id: home-7-provenance-stamps; content_type: value-story; provenance: sourced; derived_from: ["@schafe-vorm-fenster/proof@0.3.5#founder-former-volunteer-mayor"]; status: draft -->

**Text:** Gebaut von jemandem, der das Amt kennt, dem der Dienst dient. Seit 2018 in Betrieb.

**Link:** Mehr über uns → `/ueber-uns`

Zweiter Halbsatz stützt sich auf `in-operation-since-2018` (`cleared`) —
zitierfähig ist „seit 2018 in Betrieb", nicht „acht Jahre Vollbetrieb".

## Block 2c — Belegstrom (5 Elemente)

<!-- id: home-8-proof-stream; content_type: proof-card; provenance: generated; derived_from: ["@schafe-vorm-fenster/proof@0.3.5", "@schafe-vorm-fenster/media-echo@0.3.3"]; status: draft; demo: true -->

**Kicker über dem Strom:** Was Presse, Ämter und Akteure über den Dorfkalender sagen

Auswahl und Reihenfolge der fünf Elemente ist Aufgabe der Relevanz-Engine
(TS-005 D5, DEC-048) zur Laufzeit — dieser Slot liefert nur den Rahmen-Satz.
Pool: `@schafe-vorm-fenster/proof@0.3.5` (8 `cleared` Einträge) plus
`@schafe-vorm-fenster/media-echo@0.3.3` (32 Einträge, 0 mit `usage_rights`
heute — Q-045, `state/open.md` #1). Ein leerer Slot schwächt den Anspruch,
er wird nie durch erfundenen Text ersetzt.

**Demo-Elemente (Prototyp, `Demo-Daten`-Badge):** Solange keine Auswahl
freigegeben ist, zeigt der Prototyp fünf beispielhafte Karten anstelle
einer leeren Fläche:

1. „Endlich sehen wir auf einen Blick, was bei uns im Ort los ist." — Ehrenamtliche Bürgermeisterin, Beispielgemeinde Musterdorf
2. „Wir haben unseren Kalender einfach in unsere Website eingebunden, ohne eigenes System dahinter." — Amt für Digitales, Beispielverwaltung Musterkreis
3. „Digitale Dorfkalender verändern, wie kleine Gemeinden ihre Termine teilen." — Beispielzeitung, Ausgabe März 2026
4. „Wir tragen unsere Vereinstermine jetzt selbst ein, keine Excel-Liste mehr nötig." — Vorsitzender, Freiwillige Feuerwehr Musterdorf
5. „Beispiel-Auszeichnung für digitale Teilhabe im ländlichen Raum." — Beispiel-Fachpreis Ländliche Digitalisierung

Orte, Institutionen und Zitate sind frei erfunden und erkennbar
exemplarisch — sie ersetzen keinen echten Beleg und verschwinden, sobald
reale, freigegebene Einträge aus dem Pool vorliegen.

## Block 2d — Live-Zähler

<!-- id: home-9-counters; content_type: section; provenance: sourced; derived_from: [ia]; status: draft -->

**Label:** Termine, die gerade im Kalender stehen

**Zahl:** {dates_count} (live, `/api/stats`)

Nur die Terminzahl ist heute belegbar (Q-037: „Orte"- und
„Aktualisierungen heute"-Felder fehlen in `/api/stats`); keine statische
Reichweitenzahl ersetzt sie (SRC-001 §5, `reach-and-usage` ist `expired`).

## Kontextband (3 Nicht-Fokus-Jobs)

<!-- id: home-10-context-band; content_type: context-band; provenance: sourced; derived_from: [ia]; status: draft -->

**Kicker:** Heute mit einem anderen Anliegen hier?

- **Termine veröffentlichen:** Du willst Termine für deinen Verein, deine Feuerwehr oder deine Gemeinde eintragen? → `/mitmachen`
- **Eigenen Kalender betreiben:** Du willst einen Kalender unter eigenem Namen, auf eurer eigenen Website? → `/dein-kalender`
- **Wer dahintersteckt:** Du willst wissen, wer den Dorfkalender macht? → `/ueber-uns`

## Abschluss-CTA

<!-- id: home-11-closing-cta; content_type: closing-cta; provenance: sourced; derived_from: [ia]; status: draft -->

Spiegelt die primäre CTA von Block 1 im jeweils aktuellen Zustand (S1
Suche, S2 Kalender öffnen, S3 ersten Termin veröffentlichen) — kein neuer
Text, gleiche Ziel-ID (TS-006 D6).
