---
id: dein-ort-starten-de
page_id: TS-021
route: "/dein-ort/starten"
seo:
  "/dein-ort/starten":
    title: "Kalender für deinen Ort starten"
    description: "Dein Ort steht noch nicht im Dorfkalender? Eine Person, ein Flyer, ein Foto per WhatsApp — mehr braucht es nicht, damit er dazukommt."
    provenance: generated
content_type: section
status: draft
locale: de
sources:
  - "@schafe-vorm-fenster/offerings@0.3.3#community-calendar"
  - "@schafe-vorm-fenster/audiences@0.3.3#actors"
  - "ia"
derived_from:
  - "@schafe-vorm-fenster/offerings@0.3.3#community-calendar"
  - "@schafe-vorm-fenster/audiences@0.3.3#actors"
  - "ia"
generated_by: "playbook-content-production@1.0.0"
generated_at: "2026-09-11"
tone_profile: "du-everywhere"
provenance: "sourced — 0 generated slots"
compliance_check: "state/content-map.md#compliance-checks — TS-021"
schema_note: "see content/pages/home/de.md — same TS-007/schema gap, state/open.md #37"
---

# Dein Ort gründen (`/dein-ort/starten`)

Erreicht, wenn die Ortssuche **keinen** Ort findet (TS-021 D3) — der
Unterschied zu `/dein-ort` Zustand B ist bewusst: dort fehlen Termine,
hier fehlt der Ort selbst im System. Diese Seite adressiert die
Besucherin nie direkt mit „du könntest die Erste sein" (TS-021 D9,
DEC-071) — dieser Satz gehört ausschließlich auf `/dein-ort`.

## Slot 1 — Bestätigung mit Ortsname

<!-- id: dein-ort-starten-1-ack; content_type: hero; provenance: sourced; derived_from: [ia]; status: draft -->

**Headline (mit Ort):** {ort} steht noch nicht im Dorfkalender.

**Headline (ohne Ort, Fallback):** Dieser Ort steht noch nicht im Dorfkalender.

**Unterzeile:** Das lässt sich ändern — mit einem WhatsApp-Foto vom nächsten Flyer.

Der Ortsname ist reiner Text, escaped, nie Teil eines Links, einer
Kalender-Zeile oder einer Zahl (TS-021 D6).

## Slot 2 — Was es braucht

<!-- id: dein-ort-starten-2-was-es-braucht; content_type: value-story; provenance: sourced; derived_from: ["@schafe-vorm-fenster/offerings@0.3.3#community-calendar"]; status: draft -->

**Überschrift:** Was es braucht, damit {ort} im Kalender steht

**Text:** Eine Person. Ein Flyer, den es sowieso schon gibt. Ein Foto per WhatsApp. Mehr nicht: kostenlos, ohne Anmeldegebühr, dauerhaft.

Quelle: `price.note` von `community-calendar` — kostenlos, „forever",
öffentlich zugesichert seit 2022 (dieselbe Zusicherung wie
`/dein-ort` Slot 8).

## Slot 3 — Live-Beispiel, nächster aktiver Ort

<!-- id: dein-ort-starten-3-beispiel; content_type: live-module-frame; provenance: sourced; derived_from: [ia]; status: draft -->

**Modul-Überschrift:** So sieht das zum Beispiel aus — in {beispielort}

**Hinweis:** Beispiel, nicht {ort}. {ort} selbst taucht in diesem Modul nirgends als Daten auf.

Der Ortsname im Beispiel kommt aus einem tatsächlich abgedeckten, aktiven
Ort (TS-021 D7) — nie aus dem gesuchten, nicht gefundenen Ort.

## Slot 4 — Wer das meistens anstößt

<!-- id: dein-ort-starten-4-wer; content_type: value-story; provenance: sourced; derived_from: ["@schafe-vorm-fenster/audiences@0.3.3#actors"]; status: draft -->

**Überschrift:** Wer sowas meistens anstößt

**Text:** In den meisten Orten ist es ein Verein, die Feuerwehr, die Kirchengemeinde, eine Initiative, ein Kulturbetrieb oder ein mobiler Dienst wie ein Bäcker- oder Arztwagen. Oft eine einzelne Person, die das nebenbei macht.

Quelle: `@schafe-vorm-fenster/audiences#actors`, Feld „Context" — die
eigene Aufzählung des Audience-Records, keine neue Erfindung.

Ton (TS-021 D9): Dieser Absatz weist niemandem die Aufgabe zu. Er nennt,
wer es üblicherweise ist, und überlässt der Leserin, sich
wiederzuerkennen.

## Slot 5 — Ortssuche (erneut)

<!-- id: dein-ort-starten-5-search; content_type: section; provenance: sourced; derived_from: [ia]; status: draft -->

**Überschrift:** Falsch getippt? Nochmal suchen

**Sucheingabe (Placeholder):** Deine Postleitzahl

Dieselbe Komponente wie auf `/` und `/dein-ort` (TS-008 D7) — kein
eigenes Verhalten.

## Weiterleitung zur Registrierung

<!-- id: dein-ort-starten-6-cta; content_type: closing-cta; provenance: sourced; derived_from: [ia]; status: draft -->

**CTA-Label (primär):** {ort} eintragen → `/mitmachen/registrieren?ort={ort}`

Der Wert wandert unverändert und URL-codiert weiter (TS-021 D8) — kein
App-Link, kein vorausgefülltes Konto, keine Behauptung, {ort} sei bereits
registriert (Ehrlichkeitsregel, TS-021 D8).
