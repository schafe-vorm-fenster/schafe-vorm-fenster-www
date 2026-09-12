---
id: dein-kalender-de
page_id: TS-024
route: "/dein-kalender"
seo:
  "/dein-kalender":
    title: "Kalender für eure Website"
    description: "Euer Kalender, eure Website, euer Name — und niemand im Amt tippt mehr Termine ein. Ansicht konfigurieren oder erst einen Termin buchen."
    provenance: generated
content_type: section
status: draft
locale: de
sources:
  - "@schafe-vorm-fenster/messaging@0.1.0#municipalities--portalize-calendar"
  - "@schafe-vorm-fenster/offerings@0.3.3#community-calendar"
  - "@schafe-vorm-fenster/offerings@0.3.3#portalize-calendar"
  - "@schafe-vorm-fenster/offerings@0.3.3#portalize-enterprise"
  - "@schafe-vorm-fenster/proof@0.3.5#wendt-rubkow"
  - "@schafe-vorm-fenster/proof@0.3.5#zschiesche-gross-kiesow"
  - "@schafe-vorm-fenster/proof@0.3.5#eichler-wasserschloss-quilow"
  - "@schafe-vorm-fenster/proof@0.3.5#in-operation-since-2018"
  - "@schafe-vorm-fenster/people@0.3.6#jan-henrik-hempel"
  - "ia"
derived_from:
  - "@schafe-vorm-fenster/messaging@0.1.0#municipalities--portalize-calendar"
  - "@schafe-vorm-fenster/offerings@0.3.3#community-calendar"
  - "@schafe-vorm-fenster/offerings@0.3.3#portalize-calendar"
  - "@schafe-vorm-fenster/offerings@0.3.3#portalize-enterprise"
  - "@schafe-vorm-fenster/proof@0.3.5#wendt-rubkow"
  - "@schafe-vorm-fenster/proof@0.3.5#zschiesche-gross-kiesow"
  - "@schafe-vorm-fenster/proof@0.3.5#eichler-wasserschloss-quilow"
  - "@schafe-vorm-fenster/proof@0.3.5#in-operation-since-2018"
  - "@schafe-vorm-fenster/people@0.3.6#jan-henrik-hempel"
  - "ia"
generated_by: "playbook-content-production@1.0.0"
generated_at: "2026-09-11"
tone_profile: "du-everywhere"
provenance: "mixed — 7 sourced (slot 5 now carries the three real, verbatim proof quotes, clearance pending; slot 6 carries a sourced operations sentence), 1 generated demo addition left (slot 6 AI-use placeholder — no hub record documents AI handling of publisher data)"
compliance_check: "state/content-map.md#compliance-checks — TS-024"
schema_note: "see content/pages/home/de.md — same TS-007/schema gap, state/open.md #37"
open_points:
  - "state/open.md #19 — the trust block's AI-use sentence is still withheld: no hub record documents how AI handles publisher data. The operations sentence is resolved and sourced (people#jan-henrik-hempel, proof#in-operation-since-2018)"
  - "Clearance pending — the three proof quotes in slot 5 (wendt-rubkow, zschiesche-gross-kiesow, eichler-wasserschloss-quilow) carry `usage_rights: unverified` (Q-014). They render in the protected preview only; go-live needs written clearance per quote or the card drops"
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
(Q-014). Für Produktion bleibt dieser Slot leer, bis eine Freigabe
vorliegt. Im geschützten Preview zeigt der Slot darunter drei dieser
Elemente im Wortlaut, mit offener Freigabe und ohne Demo-Kennzeichnung.

<!-- id: dein-kalender-5-proof-demo; content_type: proof-card; provenance: sourced; derived_from: ["@schafe-vorm-fenster/proof@0.3.5#wendt-rubkow", "@schafe-vorm-fenster/proof@0.3.5#zschiesche-gross-kiesow", "@schafe-vorm-fenster/proof@0.3.5#eichler-wasserschloss-quilow"]; status: draft -->

**Belegkarten (echte Zitate, Freigabe steht aus):** Drei Stimmen aus dem
Pool von `portalize-calendar`, wörtlich aus den Proof-Datensätzen:

1. „Die selbstverwaltete und automatisierte Bereitstellung der Termindaten reduziert den Arbeitsaufwand unserer Gemeinde." — Holger Wendt, Bürgermeister in Rubkow (Bild: „Foto gesucht" · Platzhalter)
2. „Für dieses Projekt sehe ich unsere Landbevölkerung, aber auch mobile Händler als Gewinner." — Dr. A. Zschiesche, Bürgermeisterin Groß Kiesow (Bild: „Foto gesucht" · Platzhalter)
3. „Der Dienst hilft dabei, Angebote in einem Flächenland besser sichtbar und auffindbar zu machen." — Uwe Eichler, Wasserschloss Quilow (Bild: „Foto gesucht" · Platzhalter)

Alle drei Datensätze tragen `usage_rights: unverified` (Q-014). Die
Karten stehen deshalb im geschützten Preview, nicht auf einer
öffentlichen Fläche: Vor dem Go-live liegt je Zitat eine schriftliche
Freigabe vor, oder die Karte fällt weg (`state/open.md`). In den
Quelldateien stehen die Zitate in ASCII-Umschrift („Flaechenland",
„Haendler"); hier stehen dieselben Wörter in normaler deutscher
Rechtschreibung. Ohne geklärtes Bildrecht zeigt jede Karte die
„Foto gesucht"-Platzhalterfläche, nie ein geliehenes Foto.

## Slot 6 — Vertrauensblock: Datenschutz, Betrieb, KI

<!-- id: dein-kalender-6-trust; content_type: section; provenance: mixed; derived_from: [ia, "@schafe-vorm-fenster/people@0.3.6#jan-henrik-hempel", "@schafe-vorm-fenster/proof@0.3.5#in-operation-since-2018"]; status: draft -->

**Überschrift:** Wie eure Daten hier behandelt werden

**Datenschutz:** Keine Tracking-Cookies, keine dauerhafte Nutzer-Kennung, kein Consent-Banner, keine Drittanbieter außer den in unserer Datenschutzerklärung genannten. → [`/rechtliches#datenschutz`](/rechtliches#datenschutz), [`/rechtliches#auftragsverarbeitung`](/rechtliches#auftragsverarbeitung)

**Betrieb:** Hinter dem Dienst steht Jan-Henrik Hempel, Gründer und technische Leitung; er lebt in Schlatkow in Vorpommern. Der Dorfkalender ist seit 2018 in Betrieb — kein Pilot, kein Prototyp.

**KI-Nutzung (fehlt, nicht generiert):** *Kein Satz — kein Hub-Datensatz belegt, wie KI mit Veröffentlicher-Daten umgeht.*

Der Datenschutz-Absatz steht auf TS-013 D1/D2. Der Betriebssatz steht auf
`people@0.3.6#jan-henrik-hempel` (Rolle, Wohnort) und
`proof@0.3.5#in-operation-since-2018` (`cleared`) und erfüllt damit
TS-024-A19, weil er einen Hub-Datensatz benennt. Rechtsform und
Betriebsanschrift stehen im Impressum und in keinem Hub-Datensatz — sie
bleiben hier weg. Die KI-Aussage bleibt unveröffentlicht, bis ein
Hub-Eintrag existiert (`state/open.md` #19).

<!-- id: dein-kalender-6-trust-demo; content_type: section; provenance: generated; derived_from: []; status: draft; demo: true -->

**Demo-Platzhalter für die KI-Nutzung (Prototyp, `Demo-Daten`-Badge):**
Für den vollständigen Prototyp-Eindruck steht hier ein illustrativer
Beispielsatz statt einer leeren Fläche, erkennbar als Platzhalter und
ohne bestätigte Aussage:

**KI-Nutzung (Beispieltext):** Beispielhaft: Veröffentlicher-Daten würden nur für die Kalenderfunktion selbst verarbeitet, nicht zum Training von KI-Modellen — die endgültige Formulierung folgt, sobald ein Hub-Eintrag vorliegt.

Der Satz trägt keine bestätigte technische Aussage und verschwindet,
sobald ein Hub-Datensatz die Lücke schließt (`state/open.md`, Zeile 19).
Der Betriebssatz ist seit diesem Durchgang belegt und steht im Slot
darüber.

## Verifikation — lokale Werbung

<!-- id: dein-kalender-9-no-advertising; content_type: section; provenance: sourced; derived_from: [ia]; status: draft -->

Negativabgleich, kein Text-Slot: `local-advertising` (`promotion:
withheld`) darf auf dieser Seite null Mal vorkommen — kein Satz, kein
Feld, kein CTA, kein Link (TS-024 D11).
