---
id: dein-kalender-bestellen-de
page_id: TS-025
route: "/dein-kalender/bestellen"
content_type: section
status: draft
locale: de
sources:
  - "ia"
derived_from:
  - "ia"
generated_by: "playbook-content-production@1.0.0"
generated_at: "2026-09-11"
tone_profile: "du-everywhere"
provenance: "sourced — 0 generated slots; two system blockers noted inline (D4 preview deferred, D7 code issuance unconfirmed)"
compliance_check: "state/content-map.md#compliance-checks — TS-025"
schema_note: "see content/pages/home/de.md — same TS-007/schema gap, state/open.md #37"
---

# Kalender bestellen (`/dein-kalender/bestellen`)

Vier Schritte auf einer Route (TS-025 D2). Kein Preis-Slot — 480 €/Jahr
ist pro Organisation fix, unabhängig vom gewählten Umfang (DEC-060).
Keine Zahlungsdaten laufen über diese Website (DEC-011); jede Rechnung
geht an eine Behörde, nicht an eine Privatperson.

## Schritt 1/2 — Umfang wählen

<!-- id: bestellen-1-scope; content_type: form; provenance: sourced; derived_from: [ia]; status: draft -->

**Frage:** Für welchen Bereich soll der Kalender gelten?

**Modus-Optionen:**

- **Orte:** einzelne Orte per Suche hinzufügen
- **Postleitzahl:** eine PLZ, alle Orte darin
- **Landkreis:** ein ganzer Landkreis als ein Eintrag

**Ausgewählte Orte (Chip-Zeile):** {n} Orte ausgewählt

Die Vorschau, was inhaltlich im gewählten Bereich steht, ist für V1
zurückgestellt (DEC-069) — dieser Schritt zeigt nur, was ausgewählt
wurde, keine Live-Zahlen zum Inhalt.

## Ausstieg zum Beratungstermin (auf jedem Schritt)

<!-- id: bestellen-2-briefing-exit; content_type: section; provenance: sourced; derived_from: [ia]; status: draft -->

**Link-Label:** Lieber erst sprechen? Beratungstermin buchen

Führt zur konfigurierten Google-Kalender-URL — sekundär, nie über der
primären CTA (TS-025 D5).

## Schritt 3 — Rechnungsangaben

<!-- id: bestellen-3-invoice; content_type: form; provenance: sourced; derived_from: [ia]; status: draft -->

**Überschrift:** Wohin geht die Rechnung?

**Feldlabels:**

- Körperschaft / Behörde (Pflichtfeld)
- Amt / Abteilung (optional)
- Rechnungsanschrift — Straße, PLZ, Ort (Pflichtfeld)
- Abweichende Rechnungsstelle (optional)
- Ansprechperson (Pflichtfeld)
- Dienstliche E-Mail-Adresse (Pflichtfeld)
- Bestellzeichen (optional)
- Leitweg-ID, für die E-Rechnung (optional)
- USt-IdNr. (optional)

**Hinweis bei leerem Formular nach einem Reload:** Deine Auswahl an Orten ist erhalten geblieben. Die Rechnungsangaben musst du einmal neu eingeben — diese Website speichert nichts davon zwischen zwei Seitenaufrufen.

Kein Zahlungsfeld, keine private Adresse (DEC-011). Feldset ist eine
Spezifikations-Vorgabe (TS-025 D6); die Formulierung der Labels ist
UX-Writing-Arbeit dieses Playbooks.

## Schritt 4 — Einbindungscode

<!-- id: bestellen-4-embed-code; content_type: section; provenance: sourced; derived_from: [ia]; status: draft -->

**Überschrift:** Euer Einbindungscode

**Hinweistext:** Kopiere den Code jetzt — er wird zusätzlich an die angegebene E-Mail-Adresse geschickt.

**Fallback-Hinweis, falls der Code nicht sofort vorliegt:** Der Code ist noch nicht fertig. Du bekommst ihn per E-Mail, sobald er erzeugt ist.

Ob der Code beim Absenden sofort erzeugt werden kann, ist technisch
unbestätigt (Q-026-Erweiterung, TS-025 D7) — der zweite Hinweistext
deckt den Fall ab, dass er es nicht kann, ohne eine Bestätigung ohne
Code zu zeigen.
