---
id: deine-region-de
page_id: TS-WEB-0026
route: "/deine-region"
seo:
  "/deine-region":
    title: "Kalender für euer ganzes Gebiet"
    description: "Das ganze Kreisgebiet in einem Kalender, unter eurem Namen und in eurem Design — ohne eigenes Portalprojekt. Angebot anfragen."
    provenance: generated
  "/deine-region/angebot":
    title: "Angebot für eure Region anfragen"
    description: "Sagt uns, für welches Gebiet der Kalender gelten soll und wer bei euch zuständig ist — wir melden uns mit einem passenden Angebot."
    provenance: generated
content_type: section
status: draft
locale: de
sources:
  - "@schafe-vorm-fenster/messaging@0.1.0#counties--portalize-enterprise"
  - "@schafe-vorm-fenster/offerings@0.3.5#portalize-enterprise"
  - "@schafe-vorm-fenster/offerings@0.3.5#portalize-calendar"
  - "@schafe-vorm-fenster/offerings@0.3.5#custom-data-integration"
  - "@schafe-vorm-fenster/proof@0.3.5#impftermine-landkreis"
  - "@schafe-vorm-fenster/proof@0.3.5#eichler-wasserschloss-quilow"
  - "@schafe-vorm-fenster/proof@0.3.5#lehre-lelender"
  - "@schafe-vorm-fenster/partners@0.2.4#stiftung-lebendiges-lehre"
  - "ia"
derived_from:
  - "@schafe-vorm-fenster/messaging@0.1.0#counties--portalize-enterprise"
  - "@schafe-vorm-fenster/offerings@0.3.5#portalize-enterprise"
  - "@schafe-vorm-fenster/offerings@0.3.5#portalize-calendar"
  - "@schafe-vorm-fenster/offerings@0.3.5#custom-data-integration"
  - "@schafe-vorm-fenster/proof@0.3.5#impftermine-landkreis"
  - "@schafe-vorm-fenster/proof@0.3.5#eichler-wasserschloss-quilow"
  - "@schafe-vorm-fenster/proof@0.3.5#lehre-lelender"
  - "@schafe-vorm-fenster/partners@0.2.4#stiftung-lebendiges-lehre"
  - "ia"
generated_by: "playbook-content-production@1.0.0"
generated_at: "2026-09-11"
tone_profile: "du-everywhere"
provenance: "mixed — 6 sourced (slot 6 now carries three real proof elements, two of them clearance-pending), 1 withheld (slot 7 response-time promise, no named handling process, TS-WEB-0026 D5), 0 generated demo additions"
compliance_check: "state/content-map.md#compliance-checks — TS-WEB-0026"
schema_note: "see content/pages/home/de.md — same TS-WEB-0007/schema gap, state/open.md #37"
open_points:
  - "state/open.md #20 — the two-working-day response promise is withheld entirely (constant null), no named process/owner yet (Q-0022/C11). Re-checked 2026-09-12 against go-to-market-os: no handling process with a named owner exists anywhere in the hub, so the slot stays withheld"
  - "Clearance pending — slot 6 uses `eichler-wasserschloss-quilow` and `lehre-lelender`, both `usage_rights: unverified` (Q-0014). Protected preview only; go-live needs written clearance per element. `impftermine-landkreis` is `cleared`"
  - "Pool extension — TS-WEB-0026 row 6 in state/content-map.md named only `portalize-enterprise.proof[]` (eichler-wasserschloss-quilow, partner-network). `partner-network` has no named partner list and no cleared logos, so it is replaced here by two real territory-scale cases (impftermine-landkreis, lehre-lelender). Neither is a delivered `portalize-enterprise` territory and the slot says so"
images:
  - id: deine-region-hero
    slot: deine-region-1-focus
    ratio: hero
    provenance: real
    source: >-
      Wikimedia Commons, File:Güterberg, Ausblick.jpg —
      https://commons.wikimedia.org/wiki/File:G%C3%BCterberg,_Ausblick.jpg — Eigenaufnahme von
      Schafe vorm Fenster (Commons-Konto „Schafevormfenster", own work), Mai 2025, 3563×2231.
      Nachweis: content/legal/image-credits.md.
    alt: Blick über Felder bei Güterberg bis zum Horizont, dort Baumreihen, Dächer und Windräder.
    licence: CC0 1.0
    status: real
    file: /images/real/deine-region-hero.webp
    width: 800
    height: 900
    wide_file: /images/real/deine-region-hero-wide.webp
    wide_width: 1400
    wide_height: 600
  - id: deine-region-gebietsschnitt
    slot: deine-region-5-was-dazukommt
    ratio: feature
    provenance: real
    source: >-
      Wikimedia Commons, File:Carolinenthal, Ortseingang.jpg —
      https://commons.wikimedia.org/wiki/File:Carolinenthal,_Ortseingang.jpg — Eigenaufnahme von
      Schafe vorm Fenster (Commons-Konto „Schafevormfenster", own work), Mai 2025, 4032×3024.
      Nachweis: content/legal/image-credits.md.
    alt: >-
      Kopfsteinpflasterstraße am Ortseingang von Carolinenthal, daneben das gelbe Ortsschild unter
      einer Baumreihe.
    licence: CC0 1.0
    status: real
    file: /images/real/deine-region-gebietsschnitt.webp
    width: 1400
    height: 1000
  - id: deine-region-angebot-hero
    slot: deine-region-angebot-1-form
    ratio: hero
    provenance: real
    source: >-
      @schafe-vorm-fenster/brand-identity@0.1.4#imagery/office/2020-07-loft-office-02.jpeg —
      Eigenaufnahme (Jan-Henrik Hempel), unbeschränkte Nutzung, kein Credit nötig. Binärdatei liegt
      im go-to-market-os-Repository, das npm-Paket liefert nur den .asset.md-Deskriptor.
    alt: >-
      Zwei Schreibtische in einem Dachbüro mit historischen Holzbalken, heller Dielenboden, Fenster
      zur Seite.
    licence: Eigenaufnahme, unbeschränkte Nutzung
    status: real
    file: /images/real/deine-region-angebot-hero.webp
    width: 800
    height: 900
    wide_file: /images/real/deine-region-angebot-hero-wide.webp
    wide_width: 1400
    wide_height: 600
---

# Deine Region (`/deine-region`)

Für Landkreise, Landesbehörden, Netzwerke und große Städte, die einen
Kalender für ein **ganzes Gebiet** wollen (TS-WEB-0026 D1). Kein Kartenmodul
und keine Kartenzusage auf dieser Seite: TS-WEB-0026-A17 verlangt, dass ein
unbestätigtes Merkmal entfernt wird statt eingeschränkt, und für die Karte
(DEC-0061) liegt keine Bestätigung des Offering-Owners vor. Ein
Interims-Modul trägt die Seite (DEC-0034). Keine Entfernungsangabe als
Modul-, Filter- oder Ergebnisbeschriftung — nur als Frage der Besucherin
(TS-WEB-0026 D3).

## Slot 1 — Fokusblock (Mechanismus: embed)

<!-- id: deine-region-1-focus; content_type: hero; provenance: sourced; derived_from: [ia, "@schafe-vorm-fenster/messaging@0.1.0#counties--portalize-enterprise"]; status: draft -->

**Aha-Frage:** Das ganze Kreisgebiet in einem Kalender, ohne eigenes Portalprojekt?

**Text:** Genau das ist der Punkt. Ein eingebundenes System zeigt euer ganzes Gebiet, unter eurem Namen und in eurem Design.

**CTA-Label (primär):** Angebot anfragen → `/deine-region/angebot`

**Zweit-CTA (leise):** Lieber erst sprechen? Kennenlerngespräch buchen

**Abschluss-Überschrift:** Sollen wir euch ein Angebot rechnen?

Der Zweit-CTA steht leise unter dem primären, nie daneben und nie als
zweite Schaltfläche: eine Seite trägt pro Bildschirm genau eine primäre
Handlung. Er führt seit DEC-0081 §3 **innerhalb der Seite** zum
Kontakt-Abschnitt (`#kontakt`) und nicht mehr nach außen; der frühere
„Hinweis zum Zweit-CTA" ist damit entfallen, denn die Kennzeichnung
ausgehender Links (TS-WEB-0016 D16) gehört zur ersten Aktionszeile dieses
Abschnitts — dem einzigen Element der Route, das die Seite verlässt. Die
Abschluss-Überschrift wiederholt dieselbe Conversion wie oben — gleiches
Ziel, gleiches Label (TS-WEB-0006 D6). Kein Zeitversprechen, solange C11
offen ist.

Quelle: `headline` von `counties--portalize-enterprise` — „The whole
district on one map, without a portal project." Die Kartenhälfte der
Schlagzeile steht hier nicht: TS-WEB-0026-A17 macht die Bestätigung des
Offering-Owners zur Bedingung und schreibt vor, das Merkmal sonst zu
entfernen, nicht zu qualifizieren (F-2-57). Die Schlagzeile wird wieder
vollständig übernommen, sobald die Bestätigung vorliegt.

## Slot 2 — Die Gebietsfrage

<!-- id: deine-region-2-territory; content_type: section; provenance: sourced; derived_from: ["@schafe-vorm-fenster/messaging@0.1.0#counties--portalize-enterprise"]; status: draft -->

**Überschrift:** Was ist in meiner Nähe? Bei Landkreisgröße keine Frage für eine Liste

**Text:** Vierzig oder achtzig Orte redaktionell abzudecken ist keine größere Version von einem Ort. Das ist schlicht nicht machbar. Und die Verwaltungsgrenze ist nicht die Grenze, an der Menschen ihr Leben ausrichten: Was dreißig Kilometer entfernt passiert, interessiert genauso wie das, was direkt nebenan läuft.

Quelle: `pains[]` von `counties--portalize-enterprise`. „Dreißig
Kilometer" bleibt hier Frage der Besucherin, nie Beschriftung eines
Moduls (TS-WEB-0026 D3).

## Slot 3 — Interims-Modul: Beispiele, Zähler, Suche

<!-- id: deine-region-3-interim; content_type: live-module-frame; provenance: sourced; derived_from: [ia]; status: draft -->

**Überschrift:** So sieht das heute schon aus: Orte im Landkreis {landkreis}

**Zähler-Label (nur wenn belegt):** {n} Orte im Landkreis sind dabei

**Sucheingabe (Placeholder):** Dein Ort

**Überschrift (ohne Landkreis):** So sieht das heute schon aus: Orte, die schon dabei sind

**Überleitung:** Und das ist keine Absichtserklärung — es läuft schon:

Solange kein Landkreis bekannt ist, nennt die Überschrift keinen: der
Fallback benannte bis hierher „den Landkreis deiner Region", was kein
Landkreis ist (TS-WEB-0026-A10). Höchstens 6 Orte, als gestaltete Auswahl — nie als
„die aktivsten Orte" und nie als vollständige Liste (TS-WEB-0026 D4). Der
Zähler rendert nur, wenn `/api/stats` den Wert tatsächlich liefert
(Q-0037) — sonst bleibt er weg, keine Schätzung.

## Slot 4 — Einbindungs-Demo

<!-- id: deine-region-4-embed-demo; content_type: live-module-frame; provenance: sourced; derived_from: [ia]; status: draft -->

**Überschrift:** So sieht die Einbindung aus

Dieselbe Komponente wie auf `/dein-kalender` Slot 3 (TS-WEB-0008 Position 1′).

## Slot 5 — Was dazukommt

<!-- id: deine-region-5-was-dazukommt; content_type: section; provenance: sourced; derived_from: ["@schafe-vorm-fenster/offerings@0.3.5#portalize-enterprise", "@schafe-vorm-fenster/offerings@0.3.5#custom-data-integration"]; status: draft -->

**Überschrift:** Was der Landkreis-Tarif zusätzlich bringt

**Text:** Zusätzlich zu allem, was der 480-€-Tarif bietet: eine eigene, whitelabel-fähige Registrierung, die ihr auf eurer Website einbindet.

**Erwähnung (ohne CTA):** Wer eigene Termindatenbanken hat — ein Kursprogramm, einen kirchlichen Dienst, die Abfallkalender-Daten der Kreisverwaltung — kann sie über die Datenanbindung einmalig anschließen lassen.

Die Kartenansicht steht nicht in dieser Aufzählung. TS-WEB-0026-A17: solange
der Offering-Owner nicht bestätigt hat, dass sie an einen Käufer
auslieferbar ist, wird das Merkmal entfernt und nicht datiert
eingeschränkt (F-2-57, `state/open.md`). `custom-data-integration` wird
erwähnt, nie bepreist, ohne eigenen CTA (`promotion: on-request-only`).

## Slot 6 — Beleg (3 Elemente)

<!-- id: deine-region-6-proof; content_type: proof-card; provenance: sourced-empty-by-design; derived_from: ["@schafe-vorm-fenster/offerings@0.3.5#portalize-enterprise"]; status: draft -->

Pool: `eichler-wasserschloss-quilow`, `partner-network` — beide heute
`unverified` (Q-0014). Kein Referenzfall für ein bereits ausgeliefertes
`portalize-enterprise`-Gebiet existiert; keiner wird simuliert. Der Slot
darunter zeigt stattdessen drei echte, benannte Belege aus dem
Gesamtbestand und sagt dazu, was sie belegen und was nicht.

<!-- id: deine-region-6-proof-demo; content_type: proof-card; provenance: sourced; derived_from: ["@schafe-vorm-fenster/proof@0.3.5#impftermine-landkreis", "@schafe-vorm-fenster/proof@0.3.5#eichler-wasserschloss-quilow", "@schafe-vorm-fenster/proof@0.3.5#lehre-lelender", "@schafe-vorm-fenster/partners@0.2.4#stiftung-lebendiges-lehre"]; status: draft -->

**Belegkarten (echt, teils mit offener Freigabe):** Drei Elemente aus
dem Proof-Bestand, im Wortlaut der Datensätze:

1. In der Pandemie wurden sämtliche Impfangebote und Testzentren-Öffnungszeiten des Landkreises tagesaktuell und ortsgenau über die Dorfkalender veröffentlicht. — Landkreis Vorpommern-Greifswald, 2022
2. „Der Dienst hilft dabei, Angebote in einem Flächenland besser sichtbar und auffindbar zu machen." — Uwe Eichler, Wasserschloss Quilow
3. Eine Gemeinde betreibt den Dorfkalender als eigene Marke für 17 Orte, und Ehrenamtliche werden erfolgreich an Bord geholt. — Stiftung Lebendiges Lehre, Gemeinde Lehre, 2026

Keines der drei Elemente ist ein ausgeliefertes
`portalize-enterprise`-Gebiet — das sagt diese Seite auch nicht. Karte 1
ist ein Landkreis, der seine eigenen Termine über den Bestand
veröffentlicht hat (`impftermine-landkreis`, `cleared`; Beleg: eigener
eu:react-Abschlussbericht, Juli 2022). Karte 3 ist eine Gemeinde mit 17
Ortskalendern unter eigener Marke (`lehre-lelender`, `unverified`).
Karte 2 kommt aus dem Pool, den `portalize-enterprise` nennt
(`eichler-wasserschloss-quilow`, `unverified`). Die beiden
`unverified`-Elemente stehen im geschützten Preview; vor dem Go-live
liegt je Element eine schriftliche Freigabe vor, oder die Karte fällt
weg. `partner-network` steht nicht dabei: Der Datensatz führt keine
Partner namentlich und hat keine geklärten Logorechte.

## Slot 7 — Antwortversprechen

<!-- id: deine-region-7-response-promise; content_type: closing-cta; provenance: withheld; derived_from: []; status: draft -->

*Kein Text — der Konstante bleibt `null`, solange kein benannter
Bearbeitungsprozess mit benannter Zuständigkeit vorliegt (Q-0022/C11,
TS-WEB-0026 D5, `state/open.md` #20).* Sobald C11 beantwortet ist, erscheint
derselbe Satz an drei Stellen unverändert: bei der CTA auf dieser Seite,
im Formular auf `/deine-region/angebot` und in der Bestätigung danach —
nie an einer Stelle abweichend von den anderen.

Kein Demo-Platzhalter an dieser Stelle. TS-WEB-0016-A13 macht den benannten,
freigegebenen Bearbeitungsprozess zur Bedingung für jede Zeitzusage und
schreibt vor, dass der Satz sonst **fehlt** — auch als Beispieltext, weil
ein Beispielsatz über die eigene Antwortzeit dieselbe Erwartung setzt wie
eine Zusage (F-2-57). Die Fläche bleibt leer, bis C11 beantwortet ist.

## Slot 8 — Preisanzeige

<!-- id: deine-region-8-price; content_type: section; provenance: sourced; derived_from: ["@schafe-vorm-fenster/offerings@0.3.5#portalize-enterprise"]; status: draft -->

**Text:** Preis auf Anfrage.

`price_status: on-request` — keine Zahl, keine Spanne, kein „ab", kein
Vergleich mit einer Größenordnung. Der 480-€-Vergleichspreis von
`portalize-calendar` darf an anderer Stelle vorkommen, aber immer aus dem
Preis-Baustein gelesen, nie getippt.

---

## `/deine-region/angebot` — Angebotsformular

<!-- id: deine-region-angebot-1-form; content_type: form; provenance: sourced; derived_from: [ia]; status: draft -->

**Überschrift:** Angebot für {landkreis-oder-organisation} anfragen

**Einleitung:** Sag uns, um welches Gebiet es geht — den Rest klären wir im Gespräch.

Eine envoy-Instanz (TS-WEB-0016 S2) — Feldset und Erfolgsverhalten sind noch
nicht spezifiziert (Q-0022). Diese Seite trägt keinen eigenen
Argumentationstext; die Argumentation steht auf `/deine-region`.

**Bestätigungstext nach dem Absenden:** Deine Anfrage ist bei uns. {Antwortversprechen, falls C11 beantwortet ist — sonst kein Zeitversprechen.}

**Ausstieg zum Beratungstermin (falls das Formular nicht lädt):** Formular lädt gerade nicht? Schreib uns oder buche direkt einen Termin.
