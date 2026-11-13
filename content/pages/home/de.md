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
status: approved
reviewed_by: "Owner (Jan-Henrik Hempel), DEC-0222"
reviewed_at: "2026-11-13"
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
      Wikimedia Commons, File:Melkerschule Schlatkow.jpg —
      https://commons.wikimedia.org/wiki/File:Melkerschule_Schlatkow.jpg — Eigenaufnahme (Jan-Henrik
      Hempel, Commons-Konto „J2hcom", own work), September 2016, 5073×2817. Motivregel `/`: Dorf mit
      Aktivität (SRC-0014 §Motiv pro Seite). Nachweis hinter dem ©-Zeichen am Bild.
    alt: >-
      Das Fachwerkhaus der Melkerschule in Schlatkow, davor Biertischgarnituren, zwei Sonnenschirme
      und Gäste auf der Wiese.
    licence: CC BY-SA 4.0
    credit: "Jan-Henrik Hempel, CC BY-SA 4.0, über Wikimedia Commons"
    credit_title: "Melkerschule Schlatkow"
    credit_url: "https://commons.wikimedia.org/wiki/File:Melkerschule_Schlatkow.jpg"
    place: schlatkow
    focal:
      x: 50
      "y": 55
    status: real
    file: /images/real/home-hero.avif
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
      2007, 3008×2000. Fremdaufnahme: CC BY-SA verlangt Namensnennung, sie steht hinter dem ©-Zeichen am Bild.
    alt: >-
      Das Rathaus von Gützkow in Vorpommern, ein weiß verputzter Altbau mit Freitreppe an der
      Straße.
    licence: CC BY-SA 2.5
    credit: "Erell, CC BY-SA 2.5, über Wikimedia Commons, Bildausschnitt angepasst"
    credit_title: "Rathaus Gützkow"
    credit_url: "https://commons.wikimedia.org/wiki/File:Guetzkow_Ostvorpommern_Rathaus.jpg"
    focal:
      x: 42
      "y": 30
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
    credit: "Jan-Henrik Hempel"
    focal:
      x: 45
      "y": 40
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

<!-- id: home-1-search-hero; content_type: hero; provenance: sourced; derived_from: [ia]; status: approved -->

**Headline:** Was ist los in deinem Dorf?

**Sucheingabe (Placeholder):** Tipp den Ortsnamen ein

**Button:** Suchen

<!-- source_note: Placeholder „Tipp den Ortsnamen ein" ist der Wortlaut des Owners (Review 2026-10-12, Issue #20, DEC-0159): Der Hinweistext unter dem Feld entfällt, der Placeholder trägt die Anleitung. Der Feldname für Screenreader bleibt „Dein Ort" (src/lib/i18n/dictionary.ts, search.label). Die Postleitzahl-Formulierung und die Begründung des Interims sind mit DEC-0079 §1 entfallen (T-07, DEC-0119). -->

## Slot 2 — Ort bekannt, Termine vorhanden (Block 1 / Zustand S2)

<!-- id: home-2-place-dates; content_type: hero; provenance: sourced; derived_from: [ia]; status: approved -->

**Headline:** Das ist los in {place}

**CTA-Label (primär):** Kalender von {place} öffnen

**Überleitung unter den Terminen (Frage):** Fehlt deine Veranstaltung?

**Überleitung unter den Terminen (Button):** Jetzt selbst eintragen

Die Überleitung ist Wortlaut des Reviews vom 2026-09-22 („Fehlt deine
Veranstaltung, jetzt selbst eintragen.") und die Übergabe dieses Blocks an
den nächsten (CG-008): die Lücke in der Liste ist der Weg ins
Veröffentlichen, kein Mangel, den die Seite verstecken müsste. Seit dem
Review vom 2026-10-12 (Issue #25, DEC-0159) steht sie als eigene Zeile:
die Frage und ein sekundärer Button nach `/mitmachen`. Die eine primäre CTA
der Seite bleibt die aus Block 1 (TS-WEB-0006 D3).

Ortsname und Termine sind Live-Daten (TS-WEB-0008 Position 1); die Headline ist
ein Textbaustein mit benanntem Platzhalter, kein pro Ort erzeugter Satz
(Segmentunabhängigkeit, TS-WEB-0007 D7).

## Slot 3 — Ort bekannt, keine Termine (Block 1 / Zustand S3)

<!-- id: home-3-place-empty; content_type: hero; provenance: sourced; derived_from: [ia]; status: approved -->

**Modul-Überschrift (eigener Radius, nicht der Ortsname):** Diese Woche in der Nähe

**Einladungstext:** In {place} steht noch nichts im Kalender. Trag den ersten Termin ein — dein Verein, deine Feuerwehr, deine Gemeinde.

**CTA-Label:** Ersten Termin veröffentlichen

Eigene Formulierung, abweichend von `/dein-ort` Zustand B und
`/dein-ort/starten` (TS-WEB-0019 Slot-Tabelle Zeile 3): Dieser Text spricht die
Lücke im eigenen Ort an, nicht die Lücke im System.

## Szene 1 — WhatsApp (Mechanismus: whatsapp)

<!-- id: home-4-scene-whatsapp; content_type: value-story; provenance: sourced; derived_from: ["@schafe-vorm-fenster/messaging@0.1.0#actors--community-calendar"]; status: approved -->

**Aha-Satz:** Ein Foto vom Flyer per WhatsApp, und der Termin steht im Kalender.

**Einleitung:** Bei uns tippt niemand etwas ein. Die Einträge kommen von den Vereinen und den Veranstaltern, die hier im Ehrenamt etwas auf die Beine stellen.

**Titel des Erklärmoduls:** Flyer per WhatsApp

**Hinweis über dem Button:** Du kannst deine Termine auch in einem eigenen Kalender pflegen, zum Beispiel in einem Google Kalender, und wir importieren sie. Oder du hast eine Webseite, auf der schon alles steht? Dann holen wir die Termine von dort.

**CTA-Label (sekundär):** Mehr zum Veröffentlichen von Terminen

Hinweis und Button-Label sind Wortlaut des Owners (DEC-0192, 2026-11-12,
Issue #141, zweite Fassung): der Hinweis beschreibt die zwei anderen Wege,
Weg 02 und Weg 03 auf `/mitmachen` (eigener Kalender, Webseite als Quelle),
das Label führt auf `takePart`. Die Szene trägt weiter genau ein CTA (D3a,
DEC-0110 §1). Anrede Owner (dritte Fassung, 2026-11-12): die ganze Szene spricht `du`,
den Default der Seite (CG-001, CG-002), nicht mehr `ihr`. Seit DEC-0206
(Issue #163) stehen vor dem Modul zwei Ebenen, Überschrift und Einleitung:
der frühere Kicker wiederholte Wortstamm und Aussage der Überschrift und
entfällt, die frühere Überleitung über der Überschrift ist die Einleitung
darunter, ohne den Lead-in „Meistens so:“ und ohne Wortstamm der Überschrift.

Quelle: `relievers[0]` der Value Proposition „actors--community-calendar" —
„send a photo of the printed flyer by WhatsApp and the date is created
from it". Der Aha-Satz ist derselbe Satz wie bisher, ohne Fragezeichen
(CG-006, TS-WEB-0019-A6). Der Fließtext dieser Szene ist **entfallen**: das
Erklärmodul darunter sagt in drei Zeilen, was er in zwei Sätzen sagte, und
eine Zeile, die die vorige wiederholt, wird gestrichen, nicht abgeschwächt
(CG-007, CG-016) — das Review nennt genau diese Ersetzung („Besser als so
ein Text wäre eine Animation, die das abspielt"). Titel und CTA-Label sind
der Wortlaut von `/mitmachen`
(`content/pages/mitmachen/de.md`, Slot 3 und Slot 1): der Weg ist derselbe,
und das Ziel dieser Szene ist die Seite, die den Job besitzt.

### Slot 4a — Schrittzeilen und Bühnentexte der WhatsApp-Szene (Platzhalter)

<!-- id: home-4a-scene-whatsapp-steps-demo; content_type: value-story; provenance: generated; derived_from: []; status: approved; demo: true -->

**Schritte:**

1. Flyer fotografieren — Den du sowieso gedruckt hast.
2. Per WhatsApp an uns schicken — An {whatsapp}. Im Chat prüfst und bestätigst du den Termin.
3. Termin wird automatisch online gestellt — In deinem Ort und drumherum.

**Chat-Antwort (Zustand 2):** Danke! Bitte prüf den Termin und bestätige ihn hier.

**Chat-Uhrzeit (Zustand 2):** 14:06

**Beispielzeilen (Zustand 3):**

- Feuerwehrfest | Sa · 15:00 · Gerätehaus | social | Vereinsleben
- Laternenumzug | Fr · 17:30 · Kirche | culture | Kultur
- Dorfflohmarkt | So · 11:00 · Dorfplatz | social | Vereinsleben

Schritt 2 und 3 und die Chat-Antwort sind Wortlaut des Owners (DEC-0192, 2026-11-12, Issue #141): Schritt 2 trägt die WhatsApp-Nummer des Hubs als Token `{whatsapp}`, das zur Renderzeit aus `contactChannel("whatsapp")` ersetzt wird, nie als getippte Nummer; Schritt 3 sagt „automatisch online gestellt". Der Slot bleibt `demo: true`, solange Schritt 1 und die Beispielzeilen Platzhalter sind. Keine Frist, keine Bearbeitungsdauer (CG-031, CG-033).

Dasselbe Erklärmodul wie Weg 01 auf `/mitmachen`, deshalb derselbe
Platzhaltersatz: die drei Schrittzeilen stehen so im Entwurf
„3-Schritte-erklären" vom 2026-09-23 (11.20.03) und bleiben bis zur
Freigabe `provenance: generated`, `demo: true`, im Markup `data-demo="true"`
(DEC-0068, DEC-0129, `state/open.md`). Die Beispielzeilen sind nur der
Rückfall des Live-Panels in Zustand 3, wenn der Abruf weniger als drei
Zeilen liefert; im Normalfall zeigt das Panel die echten Termine des
Referenzortes.

## Szene 2 — Einbindung (Mechanismus: embed)

<!-- id: home-5-scene-embed; content_type: value-story; provenance: sourced; derived_from: ["@schafe-vorm-fenster/messaging@0.1.0#municipalities--portalize-calendar"]; status: approved -->

**Aha-Satz:** Ein Kalender für deine Gemeinde.

**Text:** Ihr bindet ihn mit zwei Zeilen auf eurer Website ein und müsst danach nichts mehr pflegen.

**Kicker:** Ohne eigenes System

**Haken 1:** Eure Website zeigt die Termine aus allen Orten der Gemeinde und aus der Umgebung.

**Haken 2:** Vereine und Veranstalter tragen ihre Termine selbst ein.

**Haken 3:** Ihr legt fest, welche Termine erscheinen, zum Beispiel nur Kultur und Tourismus ohne die Müllabfuhr.

**CTA-Label (sekundär):** Kalender bestellen

Quelle: Wortlaut des Owners aus Issue #145 (Stand 2026-11-12), Value Proposition
„municipalities--portalize-calendar", Felder `gains`/`relievers`. Die Überleitung
„Die Termine aus dem Ort stehen auch da …" und die Aha-Zeile „Deine Termine auf
deiner Webseite" des Reviews vom 2026-09-22 entfallen mit der Neugestaltung. Die
Ansprache ist **offen**: die Überschrift sagt „deine Gemeinde", der Text „ihr/eure"
(Issue #145, „Offen"; DEC-0193). Das CTA-Label ist das Primärlabel der Zielseite
(`content/pages/dein-kalender/de.md`, Slot 1).

### Slot 5a — Die Kalendergrafik der Einbindungs-Szene (Platzhalter)

<!-- id: home-5a-scene-embed-calendar-demo; content_type: value-story; provenance: generated; derived_from: []; status: approved; demo: true -->

**Label Adresszeile:** gemeinde-musterdorf.de/termine

**Label Titel der Grafik:** Termine in der Gemeinde

**Label Filterleiste (Screenreader):** Nach Kategorie filtern

**Label Grafik (Screenreader):** Kalender auf der Website einer Gemeinde

**Label Gemeindeleben:** Gemeindeleben

**Label Bildung und Gesundheit:** Bildung & Gesundheit

**Label Versorgung:** Versorgung

**Label Kultur und Tourismus:** Kultur & Tourismus

**Termin Gemeindeleben 1:** 04 | Mi | Sitzung der Gemeindevertretung | Gemeindehaus · 19:00

**Termin Gemeindeleben 2:** 11 | Mi | Laternenumzug der Feuerwehr | Feuerwehrhaus · 17:30

**Termin Gemeindeleben 3:** 18 | Mi | Jahresversammlung Sportverein | Sportlerheim · 19:00

**Termin Bildung und Gesundheit 1:** 05 | Do | Bücherbus des Landkreises | Dorfplatz · 14:00

**Termin Bildung und Gesundheit 2:** 12 | Do | Erste-Hilfe-Kurs | Gemeindehaus · 10:00

**Termin Bildung und Gesundheit 3:** 19 | Do | Blutspende | Feuerwehrhaus · 15:00

**Termin Versorgung 1:** 06 | Fr | Bäckerauto | Dorfstraße · 07:30

**Termin Versorgung 2:** 13 | Fr | Wochenmarkt | Marktplatz · 08:00

**Termin Versorgung 3:** 20 | Fr | Hofladen geöffnet | Gutshof · 10:00

**Termin Kultur und Tourismus 1:** 07 | Sa | Konzert in der Dorfkirche | Dorfkirche · 17:00

**Termin Kultur und Tourismus 2:** 14 | Sa | Lesung im Kaminzimmer | Gutshaus · 19:30

**Termin Kultur und Tourismus 3:** 21 | Sa | Führung durch den Schlosspark | Schloss · 11:00

Die Grafik zeigt eine Gemeinde-Website mit dem eingebundenen Kalender und
wechselt durch die vier Kategorien (Issue #145, DEC-0193). Adresse, Orte und
Termine sind vom Owner ausgedachte, neutrale Beispiele und bleiben
`provenance: generated`, `demo: true`, im Markup `data-demo="true"`
(DEC-0068, `state/open.md`). Das Format eines Termins ist
`Tag | Wochentag | Titel | Ort · Uhrzeit`, je Kategorie genau drei.

## Szene 3 — Herkunft (Mechanismus: provenance)

<!-- id: home-6-scene-provenance; content_type: value-story; provenance: sourced; derived_from: ["@schafe-vorm-fenster/proof@0.3.5#founder-former-volunteer-mayor", "@schafe-vorm-fenster/people@0.3.6#jan-henrik-hempel"]; status: approved -->

**Aha-Satz:** Unsere Orte selbst gestalten.

**Text:** Jan-Henrik Hempel war ehrenamtlicher Bürgermeister, ist Gemeindevertreter und hat den Kulturverein mitgegründet. Er kennt das Dorf von innen, als einer, der mitmacht. Der Name Schafe vorm Fenster kommt von der Schafweide vor dem eigenen Küchenfenster.

Quelle: `founder-former-volunteer-mayor` (`usage_rights: cleared`) — belegt
über Nordkurier 2019/2022 und das Zukunftswege-Ost-Porträt 2026. Die Breite
der Rollen (Gemeindevertreter, Mitgründer des Kulturvereins) und der
Vorrang des Ehrenamts vor der Verwaltung sind Wortlaut des Reviews vom
2026-09-22; „Unsere Orte selbst gestalten" und „Der Name Schafe vorm
Fenster" ebenfalls. Dieser Slot trägt **keinen** Kicker: „Wo das herkommt"
steht auf der Vermeidungsliste (CG-017, CG-040) und das Review nennt keinen
Ersatz — die Überschrift trägt die Szene allein (seit DEC-0206 keine
Abweichung mehr). Die frühere Überleitung über der Überschrift („Den
Dorfkalender gibt es, weil jemand das Problem selbst hatte.“) entfällt: sie
sagt, was die Einleitung mit „kennt das Dorf von innen“ schon sagt, und
teilte den Wortstamm mit Überschrift und Einleitung (Issue #163).

## Block 2b — Herkunfts-Stempel

<!-- id: home-7-provenance-stamps; content_type: value-story; provenance: sourced; derived_from: ["@schafe-vorm-fenster/proof@0.3.5#founder-former-volunteer-mayor"]; status: approved -->

**Link:** Mehr über uns → `/ueber-uns`

Der Stempelsatz „Gebaut von jemandem, der das Amt kennt … Seit 2018 in
Betrieb." ist entfallen: „gebaut" und „betrieben" über dieses Produkt
stehen auf der Vermeidungsliste (CG-033, CG-040), und das Review streicht
den Stempel. Was bleibt, ist der Weg zur Seite, die die Herkunft ausführt —
das Label ist der Wortlaut dieses Slots und die eine sekundäre CTA der
Herkunfts-Szene (TS-WEB-0019 D3a, DEC-0082 §4).

## Block 2c — Belegstrom (4 Elemente)

<!-- clearance: pending — `lehre-lelender`, `volkshochschule-uecker-randow` und `kulturlandbuero-broellin` stehen auf `usage_rights: unverified` (Q-0014), die drei media-echo-Einträge tragen gar kein `usage_rights` (Q-0045, state/open.md #1). Die geschützte Vorschau zeigt sie, der Härtungslauf vor dem Go-live klärt sie. `noerd-award-2026-smart-community` ist `cleared`. -->
<!-- source_note: Stufe-0-Regel „weiteste Streuung, jüngste zuerst" aus gtm:concept/website-relevance-model.concept.md (Kontextmatrix, Zeile „Direkter Besuch, unbekannt"); Belegregel aus gtm:concept/website-communication-principles.concept.md §4. -->
<!-- id: home-8-proof-stream; content_type: proof-card; provenance: sourced; derived_from: ["@schafe-vorm-fenster/proof@0.3.5#lehre-lelender", "@schafe-vorm-fenster/proof@0.3.5#noerd-award-2026-smart-community", "@schafe-vorm-fenster/proof@0.3.5#volkshochschule-uecker-randow", "@schafe-vorm-fenster/proof@0.3.5#kulturlandbuero-broellin", "@schafe-vorm-fenster/media-echo@0.3.3#2026-08-abend-der-engagierten-lehre", "@schafe-vorm-fenster/media-echo@0.3.3#2026-05-noerd-2026-rostock", "@schafe-vorm-fenster/media-echo@0.3.3#2024-09-kulturlandbuero-volkshochschule"]; status: approved -->

Auswahl und Reihenfolge der vier Elemente bleiben Aufgabe der
Relevanz-Engine zur Laufzeit (TS-WEB-0005 D5, DEC-0048). Dieser Slot liefert
den Kandidatensatz, aus dem gezogen wird — Pool:
`@schafe-vorm-fenster/proof@0.3.5` und
`@schafe-vorm-fenster/media-echo@0.3.3`. Kicker und Überschrift der Section
stehen nicht hier: Jede Beleg-Section trägt denselben Kopf aus
`dictionary.ts` (`proofSection`, DEC-0209).

**Kandidaten (Stufe 0: weiteste Streuung, jüngste zuerst):**

1. Die Stiftung führt den Dorfkalender für 17 Orte unter eigenem Namen: LeLender. — Stiftung Lebendiges Lehre, Lehre (Niedersachsen)
2. Schafe vorm Fenster hat den NØRD Award 2026 in der Kategorie Smart Community gewonnen, deren Schirmherr der Bitkom e.V. war. — NØRD digital convention, Rostock
3. Die Volkshochschule veröffentlicht ihr komplettes Kursprogramm im Dorfkalender. — Volkshochschulen in Vorpommern-Greifswald, Pasewalk
4. „Das Projekt kann einen wertvollen Beitrag zum wirtschaftlichen Wiederaufbau und zur Sichtbarkeit im ländlichen Raum leisten." — Kulturlandbüro Uecker-Randow, Schloss Bröllin

**Link:** Im Archiv ansehen

<!-- note: ab hier Autorennotiz, keine Copy — der Abschnitt zitiert verbotene Begriffe, um sie zu verbieten (DEC-0142 §1) -->

Seit #36 trägt jeder Teaser genau einen Link auf seinen Beleg in
`/ueber-uns/archiv` (Label: **Link** oben, derselbe für alle vier). Die Sätze
bleiben unverändert; die Anker sind die media-echo-IDs des Hubs, die der jeweilige
Beleg in `media_echo` führt: `lehre-lelender` →
`2026-08-abend-der-engagierten-lehre`, `noerd-award-2026-smart-community` →
`2026-05-noerd-2026-rostock`, `volkshochschule-uecker-randow` →
`2024-09-kulturlandbuero-volkshochschule`. `kulturlandbuero-broellin` führt kein
`media_echo`; sein Abschnitt Usage verweist auf „media-echo 2024-09", dieselbe
Zeile (Zuordnung in `app/[lang]/_proof-links.ts`). Mit dem Merge dieses PRs
bestätigt der Owner den Link-Text (DEC-0222 §3).

Namen, Zahlen, Titel und Jahre stehen so in den Belegen: die 17 Orte, der
Name „LeLender" und die Trägerschaft der Stiftung aus `lehre-lelender`, der
Gewinn und die Bitkom-Schirmherrschaft aus
`noerd-award-2026-smart-community` (Fließtext: „Schirmherr der Kategorie war
der Bitkom e.V."), das Kursprogramm aus `volkshochschule-uecker-randow`, das
Zitat des Kulturlandbüros aus `kulturlandbuero-broellin`.
Seit #160 (DEC-0209) ist jede Zeile ein ganzer Satz (CG-027) und je Beleg
dieselbe wie auf den anderen Seiten. Der NØRD-Satz steht neutral, ohne die
„stolz"-Fassung aus CG-027: Gewonnen hat Schafe vorm Fenster per öffentlicher
Abstimmung, deshalb steht dort kein „Jury". Die Volkshochschul-Zeile folgt dem
Datensatz (das Kursprogramm am Standort Pasewalk); der Nutzen „Kurse auch im
Dorf" ist gestrichen, weil ihn kein Beleg trägt. Den Namen „Volkshochschulen in
Vorpommern-Greifswald" führt der Partner-Datensatz
(`@schafe-vorm-fenster/partners#volkshochschule-vorpommern-greifswald`).
Deviation: `@schafe-vorm-fenster/proof/lehre-lelender.proof.md#L8` sagt „Eine
Gemeinde betreibt …"; die Zeile nennt die Stiftung (Review vom 2026-09-22,
Zeile 103) und „führt" statt „betreibt" (CG-033). DEM-0080.
Das Zitat steht in der Möglichkeitsform, in der der Beleg es führt — „kann …
leisten", vollständig und ohne Auslassung, Wortlaut aus §Evidence und
identisch mit dem reservierten Platz auf `/ueber-uns`
(`content/pages/ueber-uns/de.md`). Es ist keine Behauptung des Hauses: der
assertive `claim:` des Belegs ist unsere Zusammenfassung, nicht der Satz des
Kulturlandbüros, und „wertvoll" kommt allein aus dem Zitat
(Formulierungsgrenze des Belegs).
Vier Korrekturen des Reviews vom 2026-09-22 stecken darin: die Stiftung
verantwortet den LeLender, nicht die Gemeinde; der NØRD Award ist gewonnen
und nicht nur beschickt; die Volkshochschulen heißen nach dem Landkreis (der
Nutzen „Kurse auch im Dorf" ist mit DEC-0209 wieder gestrichen, siehe oben);
der Nordkurier-Eintrag
zur Nominierung fällt weg, weil der Award dieselbe Sache stärker sagt. Die
interne Meta-Zeile „Presse- und Auftrittshistorie 2018 bis 2026" ist
ersatzlos gestrichen (CG-035). Der fünfte Beleg („Seit 2018 in Betrieb",
`in-operation-since-2018`) ist am 2026-10-28 auf Wunsch des Owners
entfallen: ohne Absender und ohne Logo trug er im Strom nichts. Ein freigegebener Beleg für
„Erfolg für Kunden" (Wolgaster Kulturgesellschaft, vom Review genannt)
existiert im Hub nicht — `state/open.md`. Einer der vier ist freigegeben,
drei warten auf ihre Freigabe und laufen mit `clearance: pending`.

## Kontextband (3 Nicht-Fokus-Jobs)

<!-- id: home-10-context-band; content_type: context-band; provenance: sourced; derived_from: [ia]; status: approved -->

**Kicker:** Erfahre mehr über unsere Kalenderplattform

- **Termine veröffentlichen:** Per WhatsApp oder über deinen Kalender → `/mitmachen`
- **Eigenen Kalender betreiben:** Unter eigenem Namen, auf eurer Website → `/dein-kalender`
- **Wer dahintersteckt:** Wer den Dorfkalender macht → `/ueber-uns`
