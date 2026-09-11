---
id: dein-kalender-de
page_id: TS-024
route: "/dein-kalender"
content_type: section
status: draft
locale: de
sources:
  - "@schafe-vorm-fenster/messaging@0.1.0#municipalities--portalize-calendar"
  - "@schafe-vorm-fenster/offerings@0.3.3#community-calendar"
  - "@schafe-vorm-fenster/offerings@0.3.3#portalize-calendar"
  - "@schafe-vorm-fenster/offerings@0.3.3#portalize-enterprise"
  - "ia"
derived_from:
  - "@schafe-vorm-fenster/messaging@0.1.0#municipalities--portalize-calendar"
  - "@schafe-vorm-fenster/offerings@0.3.3#community-calendar"
  - "@schafe-vorm-fenster/offerings@0.3.3#portalize-calendar"
  - "@schafe-vorm-fenster/offerings@0.3.3#portalize-enterprise"
  - "ia"
generated_by: "playbook-content-production@1.0.0"
generated_at: "2026-09-11"
tone_profile: "du-everywhere"
provenance: "mixed — 6 sourced, 2 generated demo additions under the prototype completeness override (slot 5 demo proof cards, slot 6 demo operations/AI placeholder sentences — the withheld status per TS-024 D10 stands for the real, non-demo copy; state/open.md Dummy-Content)"
compliance_check: "state/content-map.md#compliance-checks — TS-024"
schema_note: "see content/pages/home/de.md — same TS-007/schema gap, state/open.md #37"
open_points:
  - "state/open.md #19 — trust-block operations/AI sentences withheld, no hub record"
price_source_note: >-
  Every price token below (480, jährlich, netto; portalize-enterprise
  auf Anfrage) must render from the offerings package at build time,
  never as a typed literal (TS-024 D8) — this file records the source
  value for the page developer, it is not the rendering mechanism.
---

# Dein Kalender (`/dein-kalender`)

„Portalize" fällt auf dieser Seite **genau einmal** (Slot 4, Tarif 2;
TS-024 D7). Kein lokales `local-advertising` irgendwo auf der Seite
(TS-024 D11). Zwei gleichwertige Conversions: bestellen (Pulse, primär)
und Beratungstermin buchen (sekundär, gleiche Sichtbarkeit) — Pulse
kommt nur im Fokusblock vor (TS-024 D3).

## Slot 1 — Fokusblock

<!-- id: dein-kalender-1-focus; content_type: hero; provenance: sourced; derived_from: ["@schafe-vorm-fenster/messaging@0.1.0#municipalities--portalize-calendar"]; status: draft -->

**Headline:** Euer Kalender, eure Website, euer Name. Niemand im Amt tippt mehr Termine ein.

**CTA-Label (primär, Pulse):** Kalender bestellen → `/dein-kalender/bestellen`

**CTA-Label (gleichwertig, sekundär):** Beratungstermin buchen → konfigurierte Google-Kalender-URL

Quelle: `headline` aus `municipalities--portalize-calendar` — „Our
calendar is current again — and nobody here maintains it."

## Slot 2 — Kontrast: heute vs. mit dem Produkt (4 Zeilen)

<!-- id: dein-kalender-2-contrast; content_type: section; provenance: sourced; derived_from: ["@schafe-vorm-fenster/offerings@0.3.3#portalize-calendar", "@schafe-vorm-fenster/messaging@0.1.0#municipalities--portalize-calendar"]; status: draft -->

| Heute | Mit dem Produkt |
| --- | --- |
| Ein Terminmodul im CMS ist ein Website-Projekt, das in einer leeren Datenbank endet. | Die Ansicht wird auf einen bereits gefüllten, geteilten Datenpool konfiguriert. |
| Aktuell halten braucht eine Person, die es in der Verwaltung nicht gibt. | Akteure vor Ort pflegen ihre eigenen Termine — eure gefilterte Ansicht ist nebenbei aktuell. |
| Ein zweites Login und ein zweites Formular nimmt kaum ein Akteur an. | Akteure veröffentlichen so, wie sie es schon tun — Flyer, eigener Kalender, eigene Website. |
| Euer Kalender endet an der eigenen Zuständigkeit, das Interesse der Menschen nicht. | Die Ortsauswahl läuft über Orte, Postleitzahlen oder einen Landkreis — die Grenze zieht ihr selbst. |

Vier Zeilen, abgeleitet aus `portalize-calendar` (`summary`, Kategorie)
und den Feldern `pains[]`/`gains[]`/`relievers[]` von
`municipalities--portalize-calendar` — nicht wörtlich übernommen, keine
fünfte Zeile für ein zusätzliches Feature (TS-024 D4).

## Slot 3 — Einbindungs-Demo

<!-- id: dein-kalender-3-embed-demo; content_type: live-module-frame; provenance: sourced; derived_from: [ia]; status: draft -->

**Überschrift:** So sieht die Einbindung aus: ein Beispiel

Solange Q-026 offen ist, zeigt die Demo den Referenz-Organizer und ist
als Beispiel beschriftet — nie als „euer Kalender" (TS-024 D5).

## Slot 4 — Drei Tarife unter einer Frage

<!-- id: dein-kalender-4-tiers; content_type: tier; provenance: sourced; derived_from: ["@schafe-vorm-fenster/offerings@0.3.3#community-calendar", "@schafe-vorm-fenster/offerings@0.3.3#portalize-calendar", "@schafe-vorm-fenster/offerings@0.3.3#portalize-enterprise"]; status: draft -->

**Fragen-Überschrift:** Wo soll der Kalender stehen?

### Tarif 1 — im Dorfkalender

**Titel:** Im Dorfkalender

**Preis:** kostenlos, dauerhaft — keine Einstiegsstufe

**Text:** Euer Verein oder eure Gemeinde veröffentlicht direkt in den Dorfkalender, ohne eigene Website und ohne eigenes System.

**CTA (Quiet):** Kalender öffnen · Termine veröffentlichen

Offering-ID: `community-calendar`.

### Tarif 2 — auf eurer eigenen Website

**Titel:** Auf eurer eigenen Website

**Preis:** 480 € pro Jahr, netto

**Text:** Euer offizieller Kalender läuft unter eurem Namen, im eigenen Design, auf eurer Website, konfiguriert über eure Orte, Kategorien oder Akteure. Das Produkt dahinter heißt Portalize.

**CTA (primär, Pulse):** Kalender bestellen

**CTA (Quiet):** Beratungstermin buchen

Offering-ID: `portalize-calendar`; Preis 480/EUR/Jahr, `vat: excluded` —
aus dem Paket gelesen, nicht getippt (TS-024 D8). „Portalize" erscheint
in der gesamten Seite ausschließlich in diesem Absatz.

### Tarif 3 — für eine ganze Region

**Titel:** Für eine ganze Region

**Preis:** auf Anfrage

**Text:** Landkreise, Landesbehörden und große Städte bekommen zusätzlich eine Kartenansicht derselben Termine und eine eigene, whitelabel-fähige Registrierung.

**CTA (Quiet):** Weiter zu `/deine-region`

Offering-ID: `portalize-enterprise`, `price_status: on-request` — nie
eine Zahl, nie „ab", nie eine Größenordnung (TS-024 D8). Die interne
4.000-€-Marke aus dem Paket darf an keiner Stelle dieser Seite
erscheinen.

## Slot 5 — Beleg (3 Elemente, mit Bildern)

<!-- id: dein-kalender-5-proof; content_type: proof-card; provenance: sourced-empty-by-design; derived_from: ["@schafe-vorm-fenster/offerings@0.3.3#portalize-calendar"]; status: draft -->

Pool: die vier Proof-IDs, auf die `portalize-calendar` verweist
(`kulturlandbuero-broellin`, `eichler-wasserschloss-quilow`,
`zschiesche-gross-kiesow`, `wendt-rubkow`) — alle heute `unverified`
(Q-014). Ein Bild ohne geklärtes Nutzungsrecht zeigt die
„Foto gesucht"-Platzhalterfläche, nie ein geliehenes Foto.

<!-- id: dein-kalender-5-proof-demo; content_type: proof-card; provenance: generated; derived_from: []; status: draft; demo: true -->

**Demo-Elemente (Prototyp, `Demo-Daten`-Badge):** Solange keines der vier
Proof-Elemente freigegeben ist, zeigt der Prototyp drei beispielhafte
Karten statt einer leeren Fläche:

1. „Unser Kalender läuft jetzt unter eigenem Namen auf unserer Website — im eigenen Design, ohne eigenes System dahinter." — Amt für Digitales, Beispielverwaltung Musterkreis (Bild: „Foto gesucht" · Platzhalter)
2. „Die Akteure vor Ort tragen ihre Termine selbst ein, unser Kalender ist einfach aktuell." — Beispielgemeinde Musterdorf (Bild: „Foto gesucht" · Platzhalter)
3. „Ein zweites Login hätte bei uns niemand benutzt — die Einbindung schon." — Kulturverein, Beispielort Musterhagen (Bild: „Foto gesucht" · Platzhalter)

Institutionen, Orte und Zitate sind frei erfunden und erkennbar
exemplarisch; sie ersetzen kein freigegebenes Proof-Element.

## Slot 6 — Vertrauensblock: Datenschutz, Betrieb, KI

<!-- id: dein-kalender-6-trust; content_type: section; provenance: mixed; derived_from: [ia]; status: draft -->

**Überschrift:** Wie eure Daten hier behandelt werden

**Datenschutz (steht):** Keine Tracking-Cookies, keine dauerhafte Nutzer-Kennung, kein Consent-Banner, keine Drittanbieter außer den in unserer Datenschutzerklärung genannten. → [`/rechtliches#datenschutz`](/rechtliches#datenschutz), [`/rechtliches#auftragsverarbeitung`](/rechtliches#auftragsverarbeitung)

**Betrieb (fehlt, nicht generiert):** *Kein Satz — kein Hub-Datensatz belegt, wer den Dienst betreibt und wo.*

**KI-Nutzung (fehlt, nicht generiert):** *Kein Satz — kein Hub-Datensatz belegt, wie KI mit Veröffentlicher-Daten umgeht.*

<!-- provenance: withheld; reason: "TS-024 D10 verbietet jeden Satz ohne benannte Quelle; state/open.md #19" -->

Nur der Datenschutz-Absatz hat einen Beleg (TS-013 D1/D2) und geht in
Produktion. Betrieb und KI bleiben unveröffentlicht, bis ein Hub-Eintrag
existiert — kein generischer Ersatzsatz, weil TS-024 D10 das
ausdrücklich ausschließt.

<!-- id: dein-kalender-6-trust-demo; content_type: section; provenance: generated; derived_from: []; status: draft; demo: true -->

**Demo-Platzhalter für Betrieb und KI-Nutzung (Prototyp, `Demo-Daten`-Badge):**
Für den vollständigen Prototyp-Eindruck zeigt diese Ansicht zwei
illustrative Beispielsätze anstelle der leeren Fläche — beide erkennbar
als Platzhalter markiert, keine bestätigte Aussage:

**Betrieb (Beispieltext):** Beispielhaft: Der Dorfkalender wird von einem kleinen Team betrieben, mit Sitz in einem Dorf — der genaue Betriebsstandort und die Rechtsform folgen, sobald ein Hub-Eintrag vorliegt.

**KI-Nutzung (Beispieltext):** Beispielhaft: Veröffentlicher-Daten würden nur für die Kalenderfunktion selbst verarbeitet, nicht zum Training von KI-Modellen — die endgültige Formulierung folgt, sobald ein Hub-Eintrag vorliegt.

Beide Sätze sind bewusst als Beispieltext gekennzeichnet und tragen
keine bestätigte betriebliche oder technische Aussage; sie verschwinden,
sobald ein echter Hub-Datensatz die Lücke schließt (`state/open.md`,
Zeile 19).

## Verifikation — lokale Werbung

<!-- id: dein-kalender-9-no-advertising; content_type: section; provenance: sourced; derived_from: [ia]; status: draft -->

Negativabgleich, kein Text-Slot: `local-advertising` (`promotion:
withheld`) darf auf dieser Seite null Mal vorkommen — kein Satz, kein
Feld, kein CTA, kein Link (TS-024 D11).
