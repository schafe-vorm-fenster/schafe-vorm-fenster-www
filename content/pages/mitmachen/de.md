---
id: mitmachen-de
page_id: TS-022
route: "/mitmachen"
content_type: section
status: draft
locale: de
sources:
  - "@schafe-vorm-fenster/audiences@0.3.3#actors"
  - "@schafe-vorm-fenster/messaging@0.1.0#actors--community-calendar"
  - "@schafe-vorm-fenster/offerings@0.3.3#community-calendar"
  - "ia"
derived_from:
  - "@schafe-vorm-fenster/audiences@0.3.3#actors"
  - "@schafe-vorm-fenster/messaging@0.1.0#actors--community-calendar"
  - "@schafe-vorm-fenster/offerings@0.3.3#community-calendar"
  - "ia"
generated_by: "playbook-content-production@1.0.0"
generated_at: "2026-09-11"
tone_profile: "du-everywhere"
provenance: "mixed — 6 sourced, 1 sourced-empty-by-design, 2 generated (see slots 6a, 8)"
compliance_check: "state/content-map.md#compliance-checks — TS-022"
schema_note: "see content/pages/home/de.md — same TS-007/schema gap, state/open.md #37"
open_points:
  - "state/open.md #17 — permanence-promise reassurance (slot 8) and the stage-0 reference place (slot 6a) are generated/editorial-assumption content pending a hub record"
---

# Mitmachen (`/mitmachen`)

Fokusjob „publish our dates" durchgängig, kein Preis, kein „Portalize",
kein `local-advertising` auf dieser Seite (TS-022 D1, D7, D11; DEC-052
§1/§3). Reihenfolge: Hero → Einwände → drei Publizierwege → Live-Beispiel
→ Beleg (TS-022 D2).

## Slot 1 — Hero (Mechanismus: whatsapp)

<!-- id: mitmachen-1-hero; content_type: hero; provenance: sourced; derived_from: ["@schafe-vorm-fenster/messaging@0.1.0#actors--community-calendar"]; status: draft -->

**Aha-Frage:** Ein Foto vom Flyer per WhatsApp, und der Termin steht im Kalender?

**Text:** Du hast den Flyer sowieso schon gedruckt. Fotografier ihn, schick das Bild per WhatsApp, fertig: Der Termin ist in deinem Ort sichtbar, und in den Orten drumherum gleich mit.

**CTA-Label (primär):** Kostenlos anmelden

Quelle: `headline` und `relievers[0]` von
`actors--community-calendar`. Nur dieser Block trägt `data-block="scene"`
und das Mechanismus-Attribut `whatsapp` (TS-022 D4).

## Slot 2 — Einwandblock: warum die üblichen Wege nicht reichen

<!-- id: mitmachen-2-objections; content_type: objection-list; provenance: sourced; derived_from: ["@schafe-vorm-fenster/audiences@0.3.3#actors", "@schafe-vorm-fenster/messaging@0.1.0#actors--community-calendar"]; status: draft -->

**Überschrift:** Warum das, was ihr heute macht, nicht überall ankommt

- Flyer in Briefkästen enden an der Ortsgrenze — und werden oft gar nicht verteilt, weil niemand die Zeit dafür hat.
- Zeitung und Amtsblatt haben Redaktionsschluss — ein verschobener oder abgesagter Termin kommt zu spät oder gar nicht an.
- Die eigene Vereinswebsite und die eigenen Social-Media-Kanäle erreichen vor allem die, die euch schon folgen.
- Wer ehrenamtlich organisiert, hat neben der Organisation selbst keine Zeit mehr fürs Bewerben.
- Ein neues Werkzeug zu lernen ist eine zusätzliche Hürde — Kommunikation ist für die wenigsten Akteure die Hauptaufgabe.

Quelle: `@schafe-vorm-fenster/audiences#actors` Feld „Problem" (Termine
werden „by hand" in mehrere Kanäle getippt) und `pains[]` aus
`actors--community-calendar` (5 Einträge). Keine Kanalzahl wird genannt —
„sechs" ist im Audience-Record eine Redewendung, keine Aufzählung
(TS-022 D3).

## Slot 3 — Publizierweg 1: WhatsApp

<!-- id: mitmachen-3-path-whatsapp; content_type: publishing-path; provenance: sourced; derived_from: ["@schafe-vorm-fenster/offerings@0.3.3#community-calendar"]; status: draft -->

**Titel:** Flyer per WhatsApp

**Schritte:**

1. Flyer fotografieren, den es sowieso schon gibt.
2. Foto per WhatsApp schicken.
3. Termin erscheint im Kalender deines Orts und der Umgebung.

Verfügbarkeit: `generally-available` (Hub-Datensatz `community-calendar`).

## Slot 4 — Publizierweg 2: eigener Kalender verbinden

<!-- id: mitmachen-4-path-calendar; content_type: publishing-path; provenance: sourced; derived_from: ["@schafe-vorm-fenster/offerings@0.3.3#community-calendar"]; status: draft -->

**Titel:** Euren eigenen Kalender verbinden

**Schritte:**

1. Euren bestehenden Google-Kalender angeben.
2. Termine tragt ihr wie gewohnt dort ein.
3. Änderungen, Verschiebungen und Absagen übernimmt der Dorfkalender automatisch.

Verfügbarkeit: `generally-available` (Hub-Datensatz `community-calendar`).

## Slot 5 — Publizierweg 3: eigene Website als Quelle

<!-- id: mitmachen-5-path-website; content_type: publishing-path; provenance: sourced; derived_from: ["@schafe-vorm-fenster/offerings@0.3.3#community-calendar"]; status: draft -->

**Titel:** Eure Website als Quelle

**Status-Badge:** In Erprobung (Alpha)

**Schritte:**

1. Ihr nennt uns die Seite, auf der eure Termine stehen.
2. Wir richten die Übernahme ein.
3. Neue Termine auf eurer Website erscheinen automatisch im Dorfkalender.

Verfügbarkeit: laut Hub-Datensatz **Alpha**, nicht `generally-available`
— der Status-Badge muss sichtbar bleiben, solange das gilt (TS-022 D4).

**Querverweis (ausschließlich hier, ein Satz, sekundär):** Wenn eurem Verein oder eurer Gemeinde ein eigener Kalender auf der eigenen Website vorschwebt statt einer Quelle für den Dorfkalender, ist das ein anderes Angebot: → `/dein-kalender`

Quelle: TS-022 D9 — genau ein Link zu `/dein-kalender`, in einem
`aside`, ohne Preis, ohne Tarifliste, nie `data-cta="primary"`.

## Slot 6 — Live-Beispiel

<!-- id: mitmachen-6-beispiel; content_type: live-module-frame; provenance: sourced; derived_from: [ia]; status: draft -->

**Modul-Überschrift:** So sieht das in {ort} aus

Bei bekanntem Ort: der nächste aktive Ort mit Terminen (TS-008 Position
3 → 1). Nie der gesuchte Ort der Besucherin selbst und nie ein nicht
abgedeckter Ort als Daten (WEB-F-024).

### Slot 6a — Referenzort für Stufe 0 (kein Kontext bekannt)

<!-- id: mitmachen-6a-reference-place; content_type: configuration; provenance: generated; derived_from: []; status: draft -->

**Redaktionelle Annahme (kein erfundener Datensatz):** Solange keine
Quelle einen Referenzort für Stufe 0 benennt (TS-022 Open Points), setzt
diese Seite **Groß Kiesow** als konfigurierten Beispielort — ein
tatsächlich abgedeckter Ort mit dokumentierter Aktivität
(`zschiesche-gross-kiesow`, Bürgermeisterin-Zitat, wenn auch heute
`unverified`, ist an diesem Ort verankert). Kein erfundener Ort, keine
erfundenen Termine — die Auswahl ist eine editorische Entscheidung, keine
generierte Behauptung, und ist als solche in `state/open.md` #17
registriert. Zu ersetzen, sobald Content/Editorial einen anderen oder
zusätzlichen Referenzort benennt.

## Slot 7 — Belegblock (3 Elemente, publish-gewichtet)

<!-- id: mitmachen-7-proof; content_type: proof-card; provenance: sourced-empty-by-design; derived_from: ["@schafe-vorm-fenster/proof@0.3.5"]; status: draft -->

Auswahl und Reihenfolge sind Aufgabe der Relevanz-Engine mit dem
Gewichtsprofil „publish-our-dates" (TS-005 D5, DEC-048). Ein leerer Slot
schwächt den Anspruch, wird aber nie durch erfundenen Text ersetzt.

## Slot 8 — Abschluss-CTA mit Permanenz-Zusicherung

<!-- id: mitmachen-8-closing; content_type: closing-cta; provenance: generated; derived_from: []; status: draft -->

**CTA-Label (identisch zu Slot 1, primär):** Kostenlos anmelden

**Zusicherungstext (generiert, allgemein, ohne Zahl oder Datum):** Kostenlos anmelden, kostenlos bleiben. Dafür steht der Dorfkalender, seit es ihn gibt.

Kein Hub-Beleg deckt diese Zusicherung direkt (das öffentliche
Versprechen von 2022 liegt nur in `media-echo`, nicht in `proof/` — TS-022
Open Points, `state/open.md` #17). Der Satz bleibt bewusst allgemein,
nennt keine Jahreszahl und keine Größenordnung, und ist als
`provenance: generated` markiert. Sobald ein zitierfähiges Proof-Element
existiert, ersetzt es diesen Satz.

## Kontextband und Abschluss

<!-- id: mitmachen-9-context-band; content_type: context-band; provenance: sourced; derived_from: [ia]; status: draft -->

Von Layout/TS-006 gerendert — kein eigener Text dieser Seite über die
drei Nicht-Fokus-Jobs hinaus (siehe `home-10-context-band` für die
kanonischen Job-Formulierungen).
