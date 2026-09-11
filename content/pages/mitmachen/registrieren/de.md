---
id: mitmachen-registrieren-de
page_id: TS-023
route: "/mitmachen/registrieren"
seo:
  "/mitmachen/registrieren":
    title: "Kostenlos zum Veröffentlichen anmelden"
    description: "In drei Schritten zum Zugang: Ort wählen, sagen wer veröffentlicht, loslegen. Ohne Klarnamen, ohne E-Mail-Adresse, ohne Anmeldegebühr."
    provenance: generated
content_type: section
status: draft
locale: de
sources:
  - "@schafe-vorm-fenster/offerings@0.3.3#community-calendar"
  - "ia"
derived_from:
  - "@schafe-vorm-fenster/offerings@0.3.3#community-calendar"
  - "ia"
generated_by: "playbook-content-production@1.0.0"
generated_at: "2026-09-11"
tone_profile: "du-everywhere"
provenance: "mixed — 4 sourced, 1 generated (step 2 vocabulary, see slot 2)"
compliance_check: "state/content-map.md#compliance-checks — TS-023"
schema_note: "see content/pages/home/de.md — same TS-007/schema gap, state/open.md #37"
open_points:
  - "state/open.md #18 — step-2 vocabulary (who publishes) is a generated placeholder enum pending the app team's account model"
---

# Registrieren (`/mitmachen/registrieren`)

Drei Schritte, dann Übergabe an die App (TS-023 D1, D2). Kein Formular,
kein Klarname, keine E-Mail — jedes identitätstragende Feld gehört zum
Konto, und das Konto gehört der App (TS-023 D6). Kontextband nur auf
Schritt 1 (TS-023 D7).

## Schritt 1 — Welcher Ort

<!-- id: registrieren-1-ort; content_type: form; provenance: sourced; derived_from: [ia]; status: draft -->

**Frage:** Für welchen Ort willst du veröffentlichen?

**Sucheingabe (Placeholder):** Deine Postleitzahl

Vorausgefüllt, sichtbar und änderbar, wenn `?ort=` aus `/dein-ort/starten`,
`/mitmachen` oder der leeren Kalenderansicht ankommt (TS-023 D5) — nie
übersprungen.

## Schritt 2 — Wer veröffentlicht

<!-- id: registrieren-2-wer; content_type: form; provenance: generated; derived_from: []; status: draft -->

**Frage:** Wer veröffentlicht die Termine?

**Optionen (generischer Platzhalter, siehe Hinweis):**

- Verein oder Initiative
- Gemeinde oder Verwaltung
- Kirchengemeinde, Feuerwehr oder ähnliche Einrichtung
- Einzelperson
- Sonstiges

Kein Hub-Datensatz definiert diese Liste — das Kontenmodell der App legt
sie fest, und die App hat sie noch nicht veröffentlicht (TS-023 D2, „step-2
vocabulary UNKNOWN"). Die Optionen oben sind ein bewusst generischer,
ersetzbarer Platzhalter (`provenance: generated`), registriert in
`state/open.md` #18. Diese Antwort klassifiziert die Besucherin nicht für
die Website — sie ist eine Kontoauskunft für die App (TS-023 D8).

## Schritt 3 — Welcher Publizierweg

<!-- id: registrieren-3-weg; content_type: form; provenance: sourced; derived_from: ["@schafe-vorm-fenster/offerings@0.3.3#community-calendar"]; status: draft -->

**Frage:** Wie kommen eure Termine zu uns?

**Optionen:**

- Foto vom Flyer per WhatsApp
- Euer bestehender Kalender, verbunden
- Eure Website als Quelle

Dieselben drei Mechanismen wie auf `/mitmachen` (Slots 3–5) — keine
vierte Option.

## Schrittanzeige

<!-- id: registrieren-4-step-indicator; content_type: section; provenance: sourced; derived_from: [ia]; status: draft -->

**Label:** Schritt {n} von 3

## Übergabe

<!-- id: registrieren-5-handover; content_type: closing-cta; provenance: sourced; derived_from: [ia]; status: draft -->

**Button-Label:** Weiter in der App

**Hinweistext danach (allgemein, kein Prefill-Versprechen):** Die App fragt dich gleich nach den Details deines ersten Termins.

Formuliert allgemein, weil kein Prefill-Vertrag zwischen Website und App
besteht (DEC-029, TS-023 D6) — die Seite behauptet nicht, dass Ort,
Rolle oder Weg bereits in der App vorausgefüllt sind. Nach dem Klick
folgt keine Bestätigung, keine Anleitung und kein Formular mehr auf
dieser Website — das übernimmt vollständig die App.
