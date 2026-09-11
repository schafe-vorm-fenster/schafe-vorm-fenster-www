---
id: ueber-uns-de
page_id: TS-027
route: "/ueber-uns"
content_type: section
status: draft
locale: de
sources:
  - "@schafe-vorm-fenster/offerings@0.3.3#community-calendar"
  - "@schafe-vorm-fenster/offerings@0.3.3#portalize-calendar"
  - "@schafe-vorm-fenster/proof@0.3.5#founder-former-volunteer-mayor"
  - "@schafe-vorm-fenster/proof@0.3.5#in-operation-since-2018"
  - "@schafe-vorm-fenster/proof@0.3.5"
  - "@schafe-vorm-fenster/media-echo@0.3.3"
  - "@schafe-vorm-fenster/people@0.3.6#jan-henrik-hempel"
  - "@schafe-vorm-fenster/people@0.3.6#christian-sauer"
  - "ia"
derived_from:
  - "@schafe-vorm-fenster/offerings@0.3.3#community-calendar"
  - "@schafe-vorm-fenster/offerings@0.3.3#portalize-calendar"
  - "@schafe-vorm-fenster/proof@0.3.5#founder-former-volunteer-mayor"
  - "@schafe-vorm-fenster/proof@0.3.5#in-operation-since-2018"
  - "@schafe-vorm-fenster/people@0.3.6#jan-henrik-hempel"
  - "@schafe-vorm-fenster/people@0.3.6#christian-sauer"
  - "ia"
generated_by: "playbook-content-production@1.0.0"
generated_at: "2026-09-11"
tone_profile: "du-everywhere"
provenance: "sourced — 0 generated slots; 1 sourced-empty-by-design (testimonial slot, see slot 6)"
compliance_check: "state/content-map.md#compliance-checks — TS-027"
schema_note: "see content/pages/home/de.md — same TS-007/schema gap, state/open.md #37"
---

# Über uns (`/ueber-uns`)

Fokusjob „understand who is behind it", **keine eigene Conversion**
(TS-027 D1). Die feste Headline aus DEC-036 §3 erscheint nur hier — auf
keiner anderen Seite.

## Slot 1 — Herkunft (h1, fest)

<!-- id: ueber-uns-1-origin; content_type: hero; provenance: sourced; derived_from: [ia]; status: draft -->

**h1 (fest, DEC-036 §3 — nicht umformulierbar):** Gebaut in einem Dorf, betrieben aus einem Dorf.

**Text (Kausalkette):** Ein Dorf mit rund 400 Einwohnern kann sich keinen Dienst leisten, der einen Vertrieb braucht. Deshalb ist der Dorfkalender kostenlos, und das bleibt so. Deshalb kostet die Lizenz für den eigenen Kalender 480 € im Jahr statt eines Projektbudgets.

**Satz mit Beleg:** Der Gründer war selbst ehrenamtlicher Bürgermeister — das Amt, dem der Dienst hilft, kennt er von innen.

Preisangaben aus `community-calendar` (kostenlos, „forever") und
`portalize-calendar` (480/EUR/Jahr) — gelesen, nicht getippt. Beleg:
`founder-former-volunteer-mayor` (`cleared`).

## Slot 2 — Betriebs-Zähler (Live-Modul)

<!-- id: ueber-uns-2-counters; content_type: section; provenance: sourced; derived_from: ["@schafe-vorm-fenster/proof@0.3.5#in-operation-since-2018"]; status: draft -->

**Text:** Seit 2018 in Betrieb. Heute aktiv in {n} Orten.

Nur die Jahreszahl ist ein feststehender Beleg
(`in-operation-since-2018`, `cleared`) — die Ortszahl zählt live mit.
Keine statische Reichweitenzahl (`reach-and-usage` ist `expired`, SRC-001
§5); ohne Live-Wert steht nur der Satz ohne Zahl, nie eine geschätzte
Zahl.

## Slot 3 — Belegstrom (7 Elemente, 1 typreserviert)

<!-- id: ueber-uns-3-proof-stream; content_type: proof-card; provenance: sourced-empty-by-design; derived_from: ["@schafe-vorm-fenster/proof@0.3.5", "@schafe-vorm-fenster/media-echo@0.3.3"]; status: draft -->

Pool: der volle `proof`-Bestand plus `media-echo` (32 Einträge). Ein
Platz ist für den Typ `testimonial` reserviert — heute leer, weil alle
fünf Testimonial-Datensätze `unverified` sind (Q-014). Der leere Platz
wird nicht durch ein Element eines anderen Typs aufgefüllt; er zeigt die
Schraffur-Fläche mit einem Satz, der die Lücke benennt (TS-027 D5).

## Slot 4 — Archiv-Verweis

<!-- id: ueber-uns-4-archive; content_type: section; provenance: sourced; derived_from: [ia]; status: draft -->

**Link-Text:** Das vollständige Presse- und Auszeichnungs-Archiv → `/ueber-uns/archiv`

Genau ein Link, keine Vorschau, keine Liste, kein Zähler (TS-027 D6).

## Slot 5 — Team

<!-- id: ueber-uns-5-team; content_type: profile; provenance: sourced; derived_from: ["@schafe-vorm-fenster/people@0.3.6#jan-henrik-hempel", "@schafe-vorm-fenster/people@0.3.6#christian-sauer"]; status: draft -->

**Jan-Henrik Hempel** — Gründer, technische Leitung und Softwarearchitektur. Zog 2008 von Berlin nach Schlatkow in Vorpommern, gründete 2014 den Kulturverein der Gemeinde Schmatzin mit und war ab 2019 deren ehrenamtlicher Bürgermeister.

**Christian Sauer** — langjähriger Wegbegleiter und ehemaliger Projektkoordinator, mit Hintergrund in Kunst, Kuration, Projektmanagement, Kundensupport und Online-Redaktion.

Rollen, Kurzbiografien und Bilder kommen direkt aus
`@schafe-vorm-fenster/people` — nichts über die Personen wird neu
formuliert. Christian Sauers Porträt ist `license: unverified` und
deshalb bei jedem Build erneut auf Freigabe zu prüfen (kein Textproblem,
TS-007 D12).

## Slot 6 — Newsletter

<!-- id: ueber-uns-6-newsletter; content_type: section; provenance: sourced; derived_from: [ia]; status: draft -->

**Überschrift:** Auf dem Laufenden bleiben

**Text:** Ein bis zwei Mal im Monat: was sich am Dorfkalender ändert, und was neue Orte damit machen.

**Eingabefeld (Placeholder):** `name@beispiel.de`

**Button-Label:** Eintragen

**Demo-Hinweis (solange kein Versandsystem entschieden ist, Q-020):** Demo-Daten — diese Anmeldung verlässt deinen Browser noch nicht.

Läuft als sichtbar markierter Mock, bis Q-020 entschieden ist (`Mock
aktiv`, `state/open.md` #22); keine Adresse verlässt den Browser, kein
Abonnement wird tatsächlich behauptet.
