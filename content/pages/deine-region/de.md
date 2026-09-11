---
id: deine-region-de
page_id: TS-026
route: "/deine-region"
content_type: section
status: draft
locale: de
sources:
  - "@schafe-vorm-fenster/messaging@0.1.0#counties--portalize-enterprise"
  - "@schafe-vorm-fenster/offerings@0.3.3#portalize-enterprise"
  - "@schafe-vorm-fenster/offerings@0.3.3#portalize-calendar"
  - "@schafe-vorm-fenster/offerings@0.3.3#custom-data-integration"
  - "ia"
derived_from:
  - "@schafe-vorm-fenster/messaging@0.1.0#counties--portalize-enterprise"
  - "@schafe-vorm-fenster/offerings@0.3.3#portalize-enterprise"
  - "@schafe-vorm-fenster/offerings@0.3.3#portalize-calendar"
  - "@schafe-vorm-fenster/offerings@0.3.3#custom-data-integration"
  - "ia"
generated_by: "playbook-content-production@1.0.0"
generated_at: "2026-09-11"
tone_profile: "du-everywhere"
provenance: "mixed — 5 sourced, 2 generated demo additions under the prototype completeness override (slot 6 demo proof cards, slot 7 demo response-promise placeholder — the withheld status per TS-026 D5 stands for the real, non-demo copy; state/open.md Dummy-Content)"
compliance_check: "state/content-map.md#compliance-checks — TS-026"
schema_note: "see content/pages/home/de.md — same TS-007/schema gap, state/open.md #37"
open_points:
  - "state/open.md #20 — the two-working-day response promise is withheld entirely (constant null), no named process/owner yet"
---

# Deine Region (`/deine-region`)

Für Landkreise, Landesbehörden, Netzwerke und große Städte, die einen
Kalender für ein **ganzes Gebiet** wollen (TS-026 D1). Kein Kartenmodul
auf dieser Seite — die Karte kommt Januar 2027 (DEC-061); bis dahin trägt
ein Interims-Modul die Seite (DEC-034). Keine Entfernungsangabe als
Modul-, Filter- oder Ergebnisbeschriftung — nur als Frage der Besucherin
(TS-026 D3).

## Slot 1 — Fokusblock (Mechanismus: embed)

<!-- id: deine-region-1-focus; content_type: hero; provenance: sourced; derived_from: ["@schafe-vorm-fenster/messaging@0.1.0#counties--portalize-enterprise"]; status: draft -->

**Aha-Frage:** Der ganze Landkreis auf einer Karte, ohne eigenes Portalprojekt?

**Text:** Genau das ist der Punkt. Ein eingebundenes System zeigt euer ganzes Gebiet als Liste, ab Januar 2027 zusätzlich als Karte, unter eurem Namen und in eurem Design.

**CTA-Label (primär):** Angebot anfragen → `/deine-region/angebot`

Quelle: `headline` von `counties--portalize-enterprise` — „The whole
district on one map, without a portal project."

## Slot 2 — Die Gebietsfrage

<!-- id: deine-region-2-territory; content_type: section; provenance: sourced; derived_from: ["@schafe-vorm-fenster/messaging@0.1.0#counties--portalize-enterprise"]; status: draft -->

**Überschrift:** Was ist in meiner Nähe? Bei Landkreisgröße keine Frage für eine Liste

**Text:** Vierzig oder achtzig Orte redaktionell abzudecken ist keine größere Version von einem Ort. Das ist schlicht nicht machbar. Und die Verwaltungsgrenze ist nicht die Grenze, an der Menschen ihr Leben ausrichten: Was dreißig Kilometer entfernt passiert, interessiert genauso wie das, was direkt nebenan läuft.

Quelle: `pains[]` von `counties--portalize-enterprise`. „Dreißig
Kilometer" bleibt hier Frage der Besucherin, nie Beschriftung eines
Moduls (TS-026 D3).

## Slot 3 — Interims-Modul: Beispiele, Zähler, Suche

<!-- id: deine-region-3-interim; content_type: live-module-frame; provenance: sourced; derived_from: [ia]; status: draft -->

**Überschrift:** So sieht das heute schon aus: Beispiele aus dem Landkreis {landkreis}

**Zähler-Label (nur wenn belegt):** {n} Orte im Landkreis sind dabei

**Sucheingabe (Placeholder):** Dein Ort

Höchstens 6 Beispielorte, immer als „Beispiele" beschriftet — nie als
„die aktivsten Orte" und nie als vollständige Liste (TS-026 D4). Der
Zähler rendert nur, wenn `/api/stats` den Wert tatsächlich liefert
(Q-037) — sonst bleibt er weg, keine Schätzung.

## Slot 4 — Einbindungs-Demo

<!-- id: deine-region-4-embed-demo; content_type: live-module-frame; provenance: sourced; derived_from: [ia]; status: draft -->

**Überschrift:** So sieht die Einbindung aus: ein Beispiel

Dieselbe Komponente wie auf `/dein-kalender` Slot 3 (TS-008 Position 1′).

## Slot 5 — Was dazukommt

<!-- id: deine-region-5-was-dazukommt; content_type: section; provenance: sourced; derived_from: ["@schafe-vorm-fenster/offerings@0.3.3#portalize-enterprise", "@schafe-vorm-fenster/offerings@0.3.3#custom-data-integration"]; status: draft -->

**Überschrift:** Was der Landkreis-Tarif zusätzlich bringt

**Text:** Zusätzlich zu allem, was der 480-€-Tarif bietet: eine Kartenansicht derselben Termine unter denselben Filtereinstellungen, ab Januar 2027, und eine eigene, whitelabel-fähige Registrierung, die ihr auf eurer Website einbindet.

**Erwähnung (ohne CTA):** Wer eigene Termindatenbanken hat — ein Kursprogramm, einen kirchlichen Dienst, die Abfallkalender-Daten der Kreisverwaltung — kann sie über die Datenanbindung einmalig anschließen lassen.

Die Karte wird als **datiertes, kommendes** Merkmal genannt, nie als
bereits existierend (DEC-061, TS-026 D3a). `custom-data-integration` wird
erwähnt, nie bepreist, ohne eigenen CTA (`promotion: on-request-only`).

## Slot 6 — Beleg (3 Elemente)

<!-- id: deine-region-6-proof; content_type: proof-card; provenance: sourced-empty-by-design; derived_from: ["@schafe-vorm-fenster/offerings@0.3.3#portalize-enterprise"]; status: draft -->

Pool: `eichler-wasserschloss-quilow`, `partner-network` — beide heute
`unverified` (Q-014). Kein Referenzfall für ein bereits ausgeliefertes
Gebiet existiert; keiner wird simuliert.

<!-- id: deine-region-6-proof-demo; content_type: proof-card; provenance: generated; derived_from: []; status: draft; demo: true -->

**Demo-Elemente (Prototyp, `Demo-Daten`-Badge):** Solange kein
Referenzfall freigegeben ist, zeigt der Prototyp drei beispielhafte
Karten statt einer leeren Fläche:

1. „Vierzig Orte redaktionell abzudecken war für uns nicht zu schaffen — jetzt liegt alles auf einer Karte." — Landrätin, Beispiel-Landkreis Musterkreis
2. „Unsere Verwaltungsgrenze war nie die Grenze, an der sich das Leben der Menschen orientiert — der Kalender zeigt jetzt beides." — Amt für Regionalentwicklung, Beispiellandkreis Mustermark
3. „Die Einbindung unter eigenem Namen und im eigenen Design war für uns kein Portalprojekt, sondern eine Konfiguration." — Netzwerkpartner, Beispielregion Musterland

Landkreise, Institutionen und Zitate sind frei erfunden und erkennbar
exemplarisch; sie ersetzen kein freigegebenes Proof-Element.

## Slot 7 — Antwortversprechen

<!-- id: deine-region-7-response-promise; content_type: closing-cta; provenance: withheld; derived_from: []; status: draft -->

*Kein Text — der Konstante bleibt `null`, solange kein benannter
Bearbeitungsprozess mit benannter Zuständigkeit vorliegt (Q-022/C11,
TS-026 D5, `state/open.md` #20).* Sobald C11 beantwortet ist, erscheint
derselbe Satz an drei Stellen unverändert: bei der CTA auf dieser Seite,
im Formular auf `/deine-region/angebot` und in der Bestätigung danach —
nie an einer Stelle abweichend von den anderen.

<!-- id: deine-region-7-response-promise-demo; content_type: closing-cta; provenance: generated; derived_from: []; status: draft; demo: true -->

**Demo-Platzhalter (Prototyp, `Demo-Daten`-Badge):** Für den
vollständigen Prototyp-Eindruck zeigt diese Ansicht einen illustrativen
Beispielsatz anstelle der leeren Fläche: „Beispielhaft: Du hörst in der
Regel innerhalb von zwei Werktagen von uns." Der Satz ist als
Beispieltext markiert, ohne bestätigten Bearbeitungsprozess dahinter,
und wird durch die echte Formulierung ersetzt, sobald C11 beantwortet
ist.

## Slot 8 — Preisanzeige

<!-- id: deine-region-8-price; content_type: section; provenance: sourced; derived_from: ["@schafe-vorm-fenster/offerings@0.3.3#portalize-enterprise"]; status: draft -->

**Text:** Preis auf Anfrage.

`price_status: on-request` — keine Zahl, keine Spanne, kein „ab", kein
Vergleich mit einer Größenordnung. Der 480-€-Vergleichspreis von
`portalize-calendar` darf an anderer Stelle vorkommen, aber immer aus dem
Preis-Baustein gelesen, nie getippt.

---

## `/deine-region/angebot` — Angebotsformular

<!-- id: deine-region-angebot-1-form; content_type: form; provenance: sourced; derived_from: [ia]; status: draft -->

**Überschrift:** Angebot für {landkreis-oder-organisation} anfragen

Eine envoy-Instanz (TS-016 S2) — Feldset und Erfolgsverhalten sind noch
nicht spezifiziert (Q-022). Diese Seite trägt keinen eigenen
Argumentationstext; die Argumentation steht auf `/deine-region`.

**Bestätigungstext nach dem Absenden:** Deine Anfrage ist bei uns. {Antwortversprechen, falls C11 beantwortet ist — sonst kein Zeitversprechen.}

**Ausstieg zum Beratungstermin (falls das Formular nicht lädt):** Formular lädt gerade nicht? Schreib uns oder buche direkt einen Termin.
