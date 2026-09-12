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
  - "@schafe-vorm-fenster/audiences@0.3.3#actors"
  - "@schafe-vorm-fenster/audiences@0.3.3#municipalities"
  - "ia"
derived_from:
  - "@schafe-vorm-fenster/offerings@0.3.3#community-calendar"
  - "@schafe-vorm-fenster/audiences@0.3.3#actors"
  - "@schafe-vorm-fenster/audiences@0.3.3#municipalities"
  - "ia"
generated_by: "playbook-content-production@1.0.0"
generated_at: "2026-09-11"
tone_profile: "du-everywhere"
provenance: "sourced — every slot. Step 2's option list is now drawn from the `actors` and `municipalities` audience records' own enumerations; the binding enum still belongs to the app's account model (state/open.md #18)"
compliance_check: "state/content-map.md#compliance-checks — TS-023"
schema_note: "see content/pages/home/de.md — same TS-007/schema gap, state/open.md #37"
open_points:
  - "state/open.md #18 — the step-2 labels are now sourced from the audience records, but the binding value set is still the app account model's to publish"
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

<!-- source_note: Die Optionsliste ist aus den Aufzählungen der Audience-Records selbst gezogen (`actors` Feld „Context": Vereine, Feuerwehr, Kirchengemeinde, Initiativen, Kulturbetriebe, mobile Dienste wie Bäckerwagen oder Arztbus, örtliche Betriebe mit gelegentlichen Terminen; `municipalities` Feld „Context": Gemeinden, Städte, Ämter, Samtgemeinden, Verbandsgemeinden). Reihenfolge nach Audience-Priorität dieser Seite aus gtm:concept/website-information-architecture.concept.md, Seitenbrief `/mitmachen/registrieren` (1 actors). -->
<!-- id: registrieren-2-wer; content_type: form; provenance: sourced; derived_from: ["@schafe-vorm-fenster/audiences@0.3.3#actors", "@schafe-vorm-fenster/audiences@0.3.3#municipalities"]; status: draft -->

**Frage:** Wer veröffentlicht die Termine?

**Optionen:**

- Verein oder Initiative
- Feuerwehr oder Kirchengemeinde
- Kulturbetrieb oder Einrichtung
- Gemeinde, Stadt oder Amt
- Mobiler Dienst oder Betrieb mit gelegentlichen Terminen

Die Wörter stehen so in den Audience-Records: Der Record `actors`
zählt in seinem Feld „Context" Vereine, Feuerwehr,
Kirchengemeinde, Initiativen, Kulturbetriebe, mobile Dienste wie einen
Bäckerwagen oder Arztbus und örtliche Betriebe mit gelegentlichen
Terminen auf; `municipalities` nennt Gemeinden, Städte, Ämter,
Samtgemeinden und Verbandsgemeinden. Derselbe Record hält fest, dass
dahinter sehr oft eine einzelne Person steht, die das ehrenamtlich
macht — die Liste fragt deshalb nach der Einrichtung und nicht nach der
Person.

Offen bleibt die Bindung: Welche Werte das Konto der App am Ende
speichert, legt das Kontenmodell der App fest, und das ist noch nicht
veröffentlicht (TS-023 D2, `state/open.md` #18). Diese Antwort
klassifiziert die Besucherin nicht für die Website — sie ist eine
Kontoauskunft für die App (TS-023 D8).

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

## Kontextband (nur Schritt 1)

<!-- source_note: Angebotsformulierung statt Menü aus gtm:concept/website-communication-principles.concept.md Prinzip 2; die drei Jobs und ihre Formulierung aus der Job-Tabelle in Prinzip 1. Das Band rendert nur auf Schritt 1 (TS-023 D7, state/open.md #24). Beantwortet state/open.md Zeile 95 für diese Seite. -->
<!-- id: registrieren-6-context-band; content_type: context-band; provenance: sourced; derived_from: [ia]; status: draft -->

**Kicker:** Heute mit einem anderen Anliegen hier?

- **Sehen, was los ist:** Du willst wissen, was in deinem Ort als Nächstes ansteht? → `/dein-ort`
- **Eigenen Kalender betreiben:** Du willst einen Kalender unter eigenem Namen, auf eurer eigenen Website? → `/dein-kalender`
- **Wer dahintersteckt:** Du willst wissen, wer den Dorfkalender macht? → `/ueber-uns`

Ab Schritt 2 verschwindet das Band: Wer im Ablauf steckt, soll ihn
zu Ende gehen können, ohne dass die Seite ihm drei andere Wege anbietet
(TS-023 D7, registrierte Abweichung von TS-006).
