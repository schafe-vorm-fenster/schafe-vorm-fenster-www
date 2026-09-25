---
id: home-de
page_id: TS-WEB-0019
route: "/"
seo:
  "/":
    title: "Schafe vorm Fenster — Was ist bei dir los?"
    description: "Was in deinem Ort und in den Nachbarorten als Nächstes ansteht: Ortsnamen eingeben und den Kalender für deine Umgebung öffnen."
    provenance: generated
content_type: section
status: draft
locale: de
sources:
  - "@schafe-vorm-fenster/messaging@0.1.0#actors--community-calendar"
  - "@schafe-vorm-fenster/messaging@0.1.0#municipalities--portalize-calendar"
  - "@schafe-vorm-fenster/proof@0.3.5#founder-former-volunteer-mayor"
  - "@schafe-vorm-fenster/people@0.3.6#jan-henrik-hempel"
  - "@schafe-vorm-fenster/proof@0.3.5"
  - "@schafe-vorm-fenster/media-echo@0.3.3"
  - "ia"
derived_from:
  - "@schafe-vorm-fenster/messaging@0.1.0#actors--community-calendar"
  - "@schafe-vorm-fenster/messaging@0.1.0#municipalities--portalize-calendar"
  - "@schafe-vorm-fenster/proof@0.3.5#founder-former-volunteer-mayor"
  - "@schafe-vorm-fenster/people@0.3.6#jan-henrik-hempel"
  - "@schafe-vorm-fenster/proof@0.3.5"
  - "@schafe-vorm-fenster/media-echo@0.3.3"
  - "ia"
generated_by: "playbook-content-production@1.0.0"
generated_at: "2026-09-11"
tone_profile: "du-everywhere"
provenance: "sourced — every slot; slot 8 (proof stream) now carries real proof and media-echo records instead of demo cards, three of them with clearance pending (Q-0014, Q-0045)"
compliance_check: "state/content-map.md#compliance-checks — TS-WEB-0019"
schema_note: >-
  src/domain/content-frontmatter.schema.ts predates TS-WEB-0007 (8 content types,
  no derived_from/RelevanceFacets). The fields above follow TS-WEB-0007 D6/D7
  and are carried through even though the current schema neither requires
  nor validates them — see state/open.md #37.
images:
  - id: home-hero
    slot: home-1-search-hero
    ratio: hero
    provenance: real
    source: >-
      Wikimedia Commons, File:Rathebur, Dorfstraße.jpg —
      https://commons.wikimedia.org/wiki/File:Rathebur,_Dorfstra%C3%9Fe.jpg — Eigenaufnahme von
      Schafe vorm Fenster (Commons-Konto „Schafevormfenster", own work), Juni 2025, 4032×2585.
      Nachweis: content/legal/image-credits.md.
    alt: >-
      Kopfsteinpflasterstraße durch das Dorf Rathebur, links Wohnhäuser, rechts eine Feldsteinmauer
      und alte Bäume.
    licence: CC0 1.0
    status: real
    file: /images/real/home-hero.webp
    width: 800
    height: 900
    wide_file: /images/real/home-hero-wide.webp
    wide_width: 1400
    wide_height: 600
  - id: home-scene-embed
    slot: home-5-scene-embed
    ratio: feature
    provenance: real
    source: >-
      Wikimedia Commons, File:Guetzkow Ostvorpommern Rathaus.jpg —
      https://commons.wikimedia.org/wiki/File:Guetzkow_Ostvorpommern_Rathaus.jpg — Foto: Erell, Mai
      2007, 3008×2000. Fremdaufnahme: CC BY-SA verlangt Namensnennung, sie steht in
      content/legal/image-credits.md.
    alt: >-
      Das Rathaus von Gützkow in Vorpommern, ein weiß verputzter Altbau mit Freitreppe an der
      Straße.
    licence: CC BY-SA 2.5
    status: real
    file: /images/real/home-scene-embed.webp
    width: 1400
    height: 1000
  - id: home-scene-provenance
    slot: home-6-scene-provenance
    ratio: feature
    provenance: real
    source: >-
      @schafe-vorm-fenster/people@0.3.6#jan-henrik-hempel/assets/2021-workshop-ranzin.jpeg —
      Eigenaufnahme (in-house), unbeschränkte Nutzung, kein Credit nötig. Binärdatei liegt im
      go-to-market-os-Repository, das npm-Paket liefert nur den .asset.md-Deskriptor.
    alt: >-
      Jan-Henrik Hempel steht in der offenen Tür eines Backsteinhauses, daneben der Roll-up von
      Schafe vorm Fenster.
    licence: Eigenaufnahme, unbeschränkte Nutzung
    status: real
    file: /images/real/home-scene-provenance.webp
    width: 1400
    height: 1000
---

# Startseite (`/`)

Fokusbereich „know-what-is-on" mit Zustandslogik (TS-WEB-0019 D2); Reihenfolge
und Zustände sind Layoutlogik, nicht Teil dieser Datei. Platzhalter in
`{geschweiften Klammern}` sind Laufzeitwerte, keine Autorentexte.

## Slot 1 — Suchfeld, kein Ort bekannt (Block 1 / Zustand S1)

<!-- id: home-1-search-hero; content_type: hero; provenance: sourced; derived_from: [ia]; status: draft -->

**Headline:** Was ist bei dir los?

**Sucheingabe (Placeholder):** Dein Ort

**Button:** Suchen

**Hinweistext unter dem Feld:** Tipp den Ortsnamen ein — Vorschläge kommen ab dem zweiten Buchstaben.

<!-- source_note: Placeholder „Dein Ort" ist die Formulierung des Owners für dieses Feld (content/pages/deine-region/de.md, Slot 3); der Hinweistext ist der bestehende Dictionary-String (src/lib/i18n/dictionary.ts, search.hint). Die Postleitzahl-Formulierung und die Begründung des Interims sind mit DEC-0079 §1 entfallen (T-07, DEC-0119). -->

## Slot 2 — Ort bekannt, Termine vorhanden (Block 1 / Zustand S2)

<!-- id: home-2-place-dates; content_type: hero; provenance: sourced; derived_from: [ia]; status: draft -->

**Headline:** Das ist los in {place}

**CTA-Label (primär):** Kalender von {place} öffnen

Ortsname und Termine sind Live-Daten (TS-WEB-0008 Position 1); die Headline ist
ein Textbaustein mit benanntem Platzhalter, kein pro Ort erzeugter Satz
(Segmentunabhängigkeit, TS-WEB-0007 D7).

## Slot 3 — Ort bekannt, keine Termine (Block 1 / Zustand S3)

<!-- id: home-3-place-empty; content_type: hero; provenance: sourced; derived_from: [ia]; status: draft -->

**Modul-Überschrift (eigener Radius, nicht der Ortsname):** Diese Woche in der Nähe

**Einladungstext:** In {place} steht noch nichts im Kalender. Trag den ersten Termin ein — dein Verein, deine Feuerwehr, deine Gemeinde.

**CTA-Label:** Ersten Termin veröffentlichen

Eigene Formulierung, abweichend von `/dein-ort` Zustand B und
`/dein-ort/starten` (TS-WEB-0019 Slot-Tabelle Zeile 3): Dieser Text spricht die
Lücke im eigenen Ort an, nicht die Lücke im System.

## Szene 1 — WhatsApp (Mechanismus: whatsapp)

<!-- id: home-4-scene-whatsapp; content_type: value-story; provenance: sourced; derived_from: ["@schafe-vorm-fenster/messaging@0.1.0#actors--community-calendar"]; status: draft -->

**Aha-Frage:** Ein Foto vom Flyer per WhatsApp, und der Termin steht im Kalender?

**Text:** Genau so. Du druckst den Flyer sowieso aus. Fotografierst ihn, schickst das Bild per WhatsApp an unsere Nummer, fertig: Der Termin erscheint in deinem Ort und in den Nachbarorten, ohne dass du ihn ein zweites Mal tippst.

**Kicker:** So kommen die Termine rein

**Überleitung:** Die Termine oben tippt niemand bei uns ein. Sie kommen von den Leuten im Ort — meistens so:

Quelle: `relievers[0]` der Value Proposition „actors--community-calendar" —
„send a photo of the printed flyer by WhatsApp and the date is created
from it".

## Szene 2 — Einbindung (Mechanismus: embed)

<!-- id: home-5-scene-embed; content_type: value-story; provenance: sourced; derived_from: ["@schafe-vorm-fenster/messaging@0.1.0#municipalities--portalize-calendar"]; status: draft -->

**Aha-Frage:** Ein eigener Kalender auf der eigenen Website, ohne eigenes System dahinter?

**Text:** Deine Gemeinde bekommt ihre eigene Auswahl an Terminen, im eigenen Design, unter eigenem Namen, ohne dass bei euch jemand ein System pflegt. Die Akteure vor Ort tragen ihre Termine für sich selbst ein; euer Kalender ist nebenbei aktuell.

**Kicker:** Und wenn ihr sie selbst zeigen wollt

**Überleitung:** Dieselben Termine, nur auf eurer eigenen Seite:

Quelle: Value Proposition „municipalities--portalize-calendar", Felder
`gains`/`relievers` — „our own design and our own selection, without our
own system".

## Szene 3 — Herkunft (Mechanismus: provenance)

<!-- id: home-6-scene-provenance; content_type: value-story; provenance: sourced; derived_from: ["@schafe-vorm-fenster/proof@0.3.5#founder-former-volunteer-mayor", "@schafe-vorm-fenster/people@0.3.6#jan-henrik-hempel"]; status: draft -->

**Aha-Frage:** Wer steckt eigentlich dahinter?

**Text:** Jan-Henrik Hempel war selbst ehrenamtlicher Bürgermeister. Der Name der Firma kommt von der Schafweide der Gemeinde vor dem eigenen Küchenfenster. Er kennt die Verwaltung, der der Dienst hilft, von innen.

**Kicker:** Wo das herkommt

**Überleitung:** Beides gibt es, weil jemand das Problem selbst hatte.

Quelle: `founder-former-volunteer-mayor` (`usage_rights: cleared`) — belegt
über Nordkurier 2019/2022 und das Zukunftswege-Ost-Porträt 2026.

## Block 2b — Herkunfts-Stempel

<!-- id: home-7-provenance-stamps; content_type: value-story; provenance: sourced; derived_from: ["@schafe-vorm-fenster/proof@0.3.5#founder-former-volunteer-mayor"]; status: draft -->

**Text:** Gebaut von jemandem, der das Amt kennt, dem der Dienst dient. Seit 2018 in Betrieb.

**Link:** Mehr über uns → `/ueber-uns`

Zweiter Halbsatz stützt sich auf `in-operation-since-2018` (`cleared`) —
zitierfähig ist „seit 2018 in Betrieb", nicht „acht Jahre Vollbetrieb".

## Block 2c — Belegstrom (5 Elemente)

<!-- clearance: pending — `lehre-lelender` und `volkshochschule-uecker-randow` stehen auf `usage_rights: unverified` (Q-0014), die drei media-echo-Einträge tragen gar kein `usage_rights` (Q-0045, state/open.md #1). Die geschützte Vorschau zeigt sie, der Härtungslauf vor dem Go-live klärt sie. `noerd-award-2026-smart-community` und `in-operation-since-2018` sind `cleared`. -->
<!-- source_note: Stufe-0-Regel „weiteste Streuung, jüngste zuerst" aus gtm:concept/website-relevance-model.concept.md (Kontextmatrix, Zeile „Direkter Besuch, unbekannt"); Belegregel aus gtm:concept/website-communication-principles.concept.md §4. -->
<!-- id: home-8-proof-stream; content_type: proof-card; provenance: sourced; derived_from: ["@schafe-vorm-fenster/proof@0.3.5#lehre-lelender", "@schafe-vorm-fenster/proof@0.3.5#noerd-award-2026-smart-community", "@schafe-vorm-fenster/proof@0.3.5#volkshochschule-uecker-randow", "@schafe-vorm-fenster/proof@0.3.5#in-operation-since-2018", "@schafe-vorm-fenster/media-echo@0.3.3#2026-08-abend-der-engagierten-lehre", "@schafe-vorm-fenster/media-echo@0.3.3#2026-05-noerd-2026-rostock", "@schafe-vorm-fenster/media-echo@0.3.3#2026-04-nord-award-nordkurier", "@schafe-vorm-fenster/media-echo@0.3.3#2024-09-kulturlandbuero-volkshochschule"]; status: draft -->

**Kicker über dem Strom:** Auszeichnungen, Presse und Orte, die den Dorfkalender schon nutzen

Auswahl und Reihenfolge der fünf Elemente bleiben Aufgabe der
Relevanz-Engine zur Laufzeit (TS-WEB-0005 D5, DEC-0048). Dieser Slot liefert den
Rahmensatz und den Kandidatensatz, aus dem gezogen wird — Pool:
`@schafe-vorm-fenster/proof@0.3.5` und
`@schafe-vorm-fenster/media-echo@0.3.3`.

**Kandidaten (Stufe 0: weiteste Streuung, jüngste zuerst):**

1. Die Gemeinde Lehre betreibt den Kalender für ihre 17 Orte unter eigenem Namen: LeLender. — Stiftung Lebendiges Lehre, Lehre (Niedersachsen)
2. NØRD Award 2026 in der Kategorie Smart Community, vergeben per öffentlicher Abstimmung aus 80 Bewerbungen. — NØRD digital convention, Rostock
3. Dorfkalender für Digitalpreis nominiert, April 2026. — Nordkurier, Vorpommern-Greifswald
4. Die Volkshochschule veröffentlicht ihr komplettes Kursprogramm über den Dorfkalender. — Volkshochschule Uecker-Randow, Pasewalk
5. Seit 2018 in Betrieb, kein Pilot und kein Prototyp. — Presse- und Auftrittshistorie 2018 bis 2026, Vorpommern-Greifswald

Namen, Zahlen, Titel und Jahre stehen so in den Belegen: 17 Orte und der
Name „LeLender" aus `lehre-lelender`, die 80 Bewerbungen und die
Kategorie aus `noerd-award-2026-smart-community`, die Schlagzeile aus dem
Nordkurier-Eintrag vom April 2026, das Kursprogramm aus
`volkshochschule-uecker-randow`, das Betriebsjahr aus
`in-operation-since-2018`. Zwei der fünf sind freigegeben, drei warten auf
ihre Freigabe und laufen deshalb mit `clearance: pending`. Zitierfähig ist
„seit 2018 in Betrieb", nicht „acht Jahre Vollbetrieb"
(Formulierungsgrenze des Belegs).

## Block 2d — Live-Zähler

<!-- id: home-9-counters; content_type: section; provenance: sourced; derived_from: [ia]; status: draft -->

**Label:** Termine, die gerade im Kalender stehen

**Zahl:** {dates_count} (live, `/api/stats`)

Nur die Terminzahl ist heute belegbar (Q-0037: „Orte"- und
„Aktualisierungen heute"-Felder fehlen in `/api/stats`); keine statische
Reichweitenzahl ersetzt sie (SRC-0001 §5, `reach-and-usage` ist `expired`).

## Kontextband (3 Nicht-Fokus-Jobs)

<!-- id: home-10-context-band; content_type: context-band; provenance: sourced; derived_from: [ia]; status: draft -->

**Kicker:** Heute mit einem anderen Anliegen hier?

- **Termine veröffentlichen:** Du willst Termine für deinen Verein, deine Feuerwehr oder deine Gemeinde eintragen? → `/mitmachen`
- **Eigenen Kalender betreiben:** Du willst einen Kalender unter eigenem Namen, auf eurer eigenen Website? → `/dein-kalender`
- **Wer dahintersteckt:** Du willst wissen, wer den Dorfkalender macht? → `/ueber-uns`

## Abschluss-CTA

<!-- id: home-11-closing-cta; content_type: closing-cta; provenance: sourced; derived_from: [ia]; status: draft -->

**Überschrift:** Dann schau nach, was bei dir los ist.

**Zusicherungstext:** Kostenlos, ohne Anmeldung, dauerhaft.

Der Zusicherungssatz ist die Kurzform der Zusage aus `price.note` von
`community-calendar` („Free for readers without any account … Permanent,
not an introductory tier"), dieselbe Quelle wie `/dein-ort` Slot 8 — die
Startseite sagt sie in einer Zeile, weil sie hier unter einem Suchfeld
steht und nicht unter einem Kalender-Knopf.

Spiegelt die primäre CTA von Block 1 im jeweils aktuellen Zustand (S1
Suche, S2 Kalender öffnen, S3 ersten Termin veröffentlichen) — kein neuer
Text, gleiche Ziel-ID (TS-WEB-0006 D6).

## Slot 12 — UI-Strings, die kein anderer Slot trägt

<!-- source_note: Tonfall aus gtm-Quellen: Prinzip 1a „Szenen statt Etiketten" und Prinzip 5 „Live-Daten tragen das Argument" in gtm:concept/website-communication-principles.concept.md, Register „du" aus Prinzip 1b. Ersetzt die generierten Strings in app/[lang]/page.tsx `DEMO_LABELS` (state/open.md Zeile 92). Entscheidung Jan, 2026-09-18: keine Kennzeichnung im sichtbaren Text — Provenienz steht im Frontmatter, in `data-*` und in state/open.md. -->
<!-- id: home-12-ui-strings; content_type: section; provenance: sourced; derived_from: [ia, "@schafe-vorm-fenster/brand-identity@0.1.4#schafe-vorm-fenster"]; status: draft -->

**Bildunterschrift am Modul der WhatsApp-Szene:** Aus dem Flyer geworden

**Geo-Label auf den Belegkarten:** Beleg aus der Region

**Einheit im Zähler-Badge:** Termine

Drei kurze Strings, die die Seite heute im Code führt. Sie benennen, was
die Fläche zeigt, ohne die Fläche als unfertig zu beschriften. Das
Einheitenwort steht kurz im Badge, weil die vollständige Beschriftung
(Slot 9) als Text daneben steht.
