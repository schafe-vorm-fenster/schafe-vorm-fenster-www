---
id: dein-ort-de
page_id: TS-020
route: "/dein-ort"
seo:
  "/dein-ort":
    title: "Was in deinem Ort los ist"
    description: "Alle Termine aus deinem Ort an einer Stelle — Vereine, Gemeinde, Feuerwehr, Kirche. Ort suchen und den Kalender auf den Homescreen legen."
    provenance: generated
content_type: section
status: draft
locale: de
sources:
  - "@schafe-vorm-fenster/proof@0.3.5#google-baecker-schlatkow"
  - "@schafe-vorm-fenster/proof@0.3.5#homeoffice-mobile-anbieter"
  - "@schafe-vorm-fenster/proof@0.3.5#impftermine-landkreis"
  - "@schafe-vorm-fenster/proof@0.3.5#regional-footprint"
  - "@schafe-vorm-fenster/proof@0.3.5#kurzweg-baeckerei"
  - "@schafe-vorm-fenster/proof@0.3.5#zschiesche-gross-kiesow"
  - "@schafe-vorm-fenster/proof@0.3.5#kulturlandbuero-broellin"
  - "@schafe-vorm-fenster/proof@0.3.5#eichler-wasserschloss-quilow"
  - "@schafe-vorm-fenster/proof@0.3.5#volkshochschule-uecker-randow"
  - "@schafe-vorm-fenster/proof@0.3.5#wendt-rubkow"
  - "@schafe-vorm-fenster/offerings@0.3.3#community-calendar"
  - "ia"
derived_from:
  - "@schafe-vorm-fenster/proof@0.3.5#google-baecker-schlatkow"
  - "@schafe-vorm-fenster/proof@0.3.5#homeoffice-mobile-anbieter"
  - "@schafe-vorm-fenster/proof@0.3.5#impftermine-landkreis"
  - "@schafe-vorm-fenster/proof@0.3.5#regional-footprint"
  - "@schafe-vorm-fenster/proof@0.3.5#kurzweg-baeckerei"
  - "@schafe-vorm-fenster/proof@0.3.5#zschiesche-gross-kiesow"
  - "@schafe-vorm-fenster/proof@0.3.5#eichler-wasserschloss-quilow"
  - "@schafe-vorm-fenster/proof@0.3.5#volkshochschule-uecker-randow"
  - "@schafe-vorm-fenster/proof@0.3.5#wendt-rubkow"
  - "@schafe-vorm-fenster/offerings@0.3.3#community-calendar"
  - "ia"
generated_by: "playbook-content-production@1.0.0"
generated_at: "2026-09-11"
tone_profile: "du-everywhere"
provenance: "sourced — every slot. The four value-story proof cards now carry the real testimonials of the hub (kurzweg-baeckerei, zschiesche-gross-kiesow, eichler-wasserschloss-quilow, wendt-rubkow) and the Volkshochschule reference case instead of generated demo quotes; all five are clearance: pending (Q-014)"
compliance_check: "state/content-map.md#compliance-checks — TS-020"
schema_note: "see content/pages/home/de.md — same TS-007/schema gap, state/open.md #37"
images:
  - id: dein-ort-hero
    slot: dein-ort-1-state-a
    ratio: hero
    provenance: generated
    brief: >-
      Dorfstraße in Vorpommern an einem klaren Morgen im Oktober, leicht erhöhter Blickwinkel:
      Alleebäume, Vorgärten, ein Bushäuschen, in der Ferne ein Kirchturm. Flaches Seitenlicht, der
      Asphalt ist noch feucht von der Nacht. Weit hinten schiebt jemand ein Fahrrad, von hinten
      aufgenommen. Nicht zeigen: Schrift, Logos, lesbare Orts- oder Nummernschilder, erkennbare
      Gesichter, Drohnenperspektive.
    style: documentary photo, natural light, 35mm, muted colours, no text
    alt: Dorfstraße mit Alleebäumen und Bushäuschen an einem klaren Herbstmorgen, hinten ein Kirchturm.
    status: generated
    model: bfl/flux-pro-1.1
    generated_at: "2026-09-12"
    prompt_hash: 4c48080b6b86b3ed
    file: /images/generated/dein-ort-hero.webp
    width: 800
    height: 900
    wide_file: /images/generated/dein-ort-hero-wide.webp
    wide_width: 1400
    wide_height: 600
  - id: dein-ort-homescreen-ios
    slot: dein-ort-7-homescreen
    ratio: portrait
    provenance: real
    source: >-
      Screenshot der eigenen Kalender-Ansicht unter {APP_HOST}/{ort}, iOS/Safari — muss aufgenommen
      werden. Keine Rendition: eine erfundene Oberfläche wäre eine Produktbehauptung (DEC-068 Regel
      3). Bis dahin bleibt die schraffierte Fläche (TS-020-A7).
    alt: >-
      iPhone-Bildschirm mit dem Teilen-Menü von Safari und dem Eintrag zum Hinzufügen auf den
      Home-Bildschirm.
    status: needed
  - id: dein-ort-homescreen-android
    slot: dein-ort-7-homescreen
    ratio: portrait
    provenance: real
    source: >-
      Screenshot der eigenen Kalender-Ansicht unter {APP_HOST}/{ort}, Android/Chrome — muss
      aufgenommen werden. Keine Rendition, gleicher Grund wie bei der iOS-Aufnahme. Bis dahin bleibt
      die schraffierte Fläche (TS-020-A7).
    alt: Android-Bildschirm mit dem Chrome-Menü und dem Eintrag zum Hinzufügen auf den Startbildschirm.
    status: needed
---

# Dein Ort (`/dein-ort`)

Zwei Zustände auf einer Route (TS-020 D2): **A** — Termine vorhanden,
**B** — Ort ist erfasst, aber leer (Fokusjob wechselt zu „publish our
dates"). Block- und DOM-Reihenfolge bleiben in beiden Zuständen gleich;
nur der Angebotstext in Block 1 wechselt.

## Slot 0 — Fokusblock, Zustand S0 (kein Ort bekannt)

<!-- source_note: Stufe-0-Regel aus gtm:concept/website-communication-principles.concept.md Prinzip 6 („Stufe 0 muss für sich allein vollständig und überzeugend sein") und Prinzip 1 („know what is on wird an Ort und Stelle erfüllt, nicht verlinkt"); Register „du" aus Prinzip 1b. Ersetzt den generischen Fülltext `deinem Ort` in app/[lang]/dein-ort/page.tsx `PAGE_COPY` (state/open.md Zeile 93) — die Code-Bindung steht noch aus. -->
<!-- id: dein-ort-0-state-s0; content_type: hero; provenance: sourced; derived_from: [ia]; status: draft -->

**Headline:** Such deinen Ort, dann steht hier, was dort los ist.

**Modul-Überschrift (eigener Radius, kein Ortsname):** Diese Woche in der Nähe

**Beispiel-Badge am Modul:** Beispielort

**Hinweistext unter dem Suchfeld:** Suche nach Ortsnamen kommt noch dazu — bis dahin reicht die Postleitzahl.

Stufe 0 nennt keinen Ort, weil keiner bekannt ist. Die Seite behauptet
deshalb nichts über einen Ort, sondern zeigt die Suche und ein
Beispielmodul, das als Beispiel gekennzeichnet ist. Die Zustände A und B
(Slots 1 und 2) setzen erst ein, wenn ein Ort feststeht.

## Slot 1 — Fokusblock, Zustand A (Termine vorhanden)

<!-- id: dein-ort-1-state-a; content_type: hero; provenance: sourced; derived_from: [ia]; status: draft -->

**Headline:** Das ist los in {place}

**CTA-Label (primär):** Kalender von {place} auf den Homescreen legen

Ortsname und Termine sind Live-Daten aus `/api/places/{slug}/events`.

## Slot 2 — Fokusblock, Zustand B (Ort erfasst, keine Termine)

<!-- id: dein-ort-2-state-b; content_type: hero; provenance: sourced; derived_from: [ia]; status: draft -->

**Headline:** In {place} ist noch nichts eingetragen — du könntest die Erste sein.

**CTA-Label (primär):** Ersten Termin veröffentlichen → `/mitmachen`

Wörtliches Zitat aus SRC-002 (TS-020 D2, DEC-071): Dieser Satz gehört nur
hierher. Er unterstellt keinen Fehler und keine Entschuldigung — der
Kalender für diesen Ort existiert bereits und wartet.

## Slot 3 — Value Story 1: der Bäckerwagen

<!-- id: dein-ort-3-story-baeckerwagen; content_type: value-story; provenance: sourced; derived_from: ["@schafe-vorm-fenster/proof@0.3.5#google-baecker-schlatkow", "@schafe-vorm-fenster/proof@0.3.5#homeoffice-mobile-anbieter"]; status: draft -->

**Titel:** Der Bäckerwagen, mit Route

**Warum es zählt:** Wann der Bäckerwagen kommt und wo er hält, ist keine Nebensache — es entscheidet, ob du frisches Brot bekommst oder nicht. Das gehört in denselben Kalender wie das Dorffest.

**Beispiel:** wiederkehrender Liefertermin in {place} oder in der Umgebung, live aus dem Kalender.

**Testimonial:** Elisabeth Kurzweg, Bäckerei Kurzweg — Wortlaut in der Belegkarte unten.

<!-- testimonial_pool: ["@schafe-vorm-fenster/proof@0.3.5#kurzweg-baeckerei"]; clearance: pending (usage_rights unverified, Q-014) -->

Die Story stützt sich auf zwei freigegebene Belege: die Google-Suche nach
dem Bäcker in Schlatkow, die das Bäckerauto samt Wochentag statt der
Stadtfiliale findet (`google-baecker-schlatkow`, `cleared`, dokumentiert im
eu:react-Abschlussbericht vom Juli 2022), und die Erfahrungsberichte, nach
denen Home-Office-Nutzer in der Corona-Zeit über die Dorfkalender erstmals
auf mobile Anbieter aufmerksam wurden (`homeoffice-mobile-anbieter`,
`cleared`). Der Bericht hält ausdrücklich fest, dass sich das nicht in
Umsatzzahlen messen lässt — die Anekdote steht, die Zahl nicht.

### Belegkarte zur Story 1

<!-- clearance: pending — `kurzweg-baeckerei` steht auf `usage_rights: unverified` (Q-014). Das Zitat stammt aus der Testimonial-Sektion der alten Website; eine schriftliche Freigabe liegt im Hub nicht vor. Die geschützte Vorschau zeigt es, der Härtungslauf vor dem Go-live klärt es. -->
<!-- source_note: Das Zitat liegt im Paket in ASCII-Umschrift („Digitale Terminliste fuer die Doerfer"); hier mit Umlauten gesetzt, Wortlaut unverändert. -->
<!-- id: dein-ort-3-story-baeckerwagen-demo-testimonial; content_type: proof-card; provenance: sourced; derived_from: ["@schafe-vorm-fenster/proof@0.3.5#kurzweg-baeckerei"]; status: draft -->

**Testimonial:** „Mit der Digitalen Terminliste für die Dörfer in Vorpommern-Greifswald werden die Fahrtrouten anderer Unternehmen transparenter." — Elisabeth Kurzweg, Bäckerei Kurzweg (2022)

## Slot 4 — Value Story 2: die Ratssitzung

<!-- id: dein-ort-4-story-ratssitzung; content_type: value-story; provenance: sourced; derived_from: ["@schafe-vorm-fenster/proof@0.3.5#impftermine-landkreis"]; status: draft -->

**Titel:** Die Ratssitzung, bevor sie stattfindet

**Warum es zählt:** Wer mitreden will, muss vom Termin erfahren, bevor er vorbei ist — nicht danach im Protokoll. Amtliche Termine gehören in denselben Kalender wie alles andere im Ort.

**Beispiel:** ein amtlicher Termin aus {place} oder dem Landkreis, live aus dem Kalender.

Beleg für die Tragfähigkeit in der Krise: Während der Pandemie liefen
sämtliche Impfangebote und Testzentren-Öffnungszeiten des Landkreises
tagesaktuell und ortsgenau über die Dorfkalender (`impftermine-landkreis`,
`cleared`).

**Testimonial:** Dr. A. Zschiesche, Bürgermeisterin Groß Kiesow — Wortlaut in der Belegkarte unten.

<!-- testimonial_pool: ["@schafe-vorm-fenster/proof@0.3.5#zschiesche-gross-kiesow"]; clearance: pending (usage_rights unverified, Q-014) -->

### Belegkarte zur Story 2

<!-- clearance: pending — `zschiesche-gross-kiesow` steht auf `usage_rights: unverified` (Q-014), gleiche Herkunft wie die übrigen vier Testimonials der alten Website. -->
<!-- source_note: Das Zitat liegt im Paket in ASCII-Umschrift („Fuer dieses Projekt", „Landbevoelkerung", „Haendler"); hier mit Umlauten gesetzt, Wortlaut unverändert. -->
<!-- id: dein-ort-4-story-ratssitzung-demo-testimonial; content_type: proof-card; provenance: sourced; derived_from: ["@schafe-vorm-fenster/proof@0.3.5#zschiesche-gross-kiesow"]; status: draft -->

**Testimonial:** „Für dieses Projekt sehe ich unsere Landbevölkerung, aber auch mobile Händler als Gewinner." — Dr. A. Zschiesche, Bürgermeisterin Groß Kiesow (2022)

## Slot 5 — Value Story 3: Kultur, die niemand gesucht hätte

<!-- id: dein-ort-5-story-kultur; content_type: value-story; provenance: sourced; derived_from: ["@schafe-vorm-fenster/proof@0.3.5#volkshochschule-uecker-randow"]; status: draft -->

**Titel:** Kultur, die du nicht gesucht hättest

**Warum es zählt:** Das Konzert im Nachbardorf, die Ausstellung im Schloss — wer nicht zufällig davon hört, verpasst es. Im Kalender findet es dich, statt umgekehrt.

**Beispiel:** ein Kulturtermin aus der Umgebung von {place}, live aus dem Kalender.

**Testimonial:** Uwe Eichler, Wasserschloss Quilow — Wortlaut in der Belegkarte unten.

<!-- testimonial_pool: ["@schafe-vorm-fenster/proof@0.3.5#eichler-wasserschloss-quilow", "@schafe-vorm-fenster/proof@0.3.5#kulturlandbuero-broellin"]; clearance: pending (usage_rights unverified, Q-014) -->

Die Story hat jetzt einen echten Anker: Die Volkshochschule Uecker-Randow
veröffentlicht ihr komplettes Kursprogramm über den Dorfkalender, am
Standort Pasewalk und in weiteren Ortskalendern — beschrieben vom
Kulturlandbüro Uecker-Randow (Maria Elsner, September 2024). Bildung und
Kultur, die niemand im Ort gesucht hätte, stehen damit belegbar im
Kalender.

### Belegkarte zur Story 3

<!-- clearance: pending — `eichler-wasserschloss-quilow` und `volkshochschule-uecker-randow` stehen beide auf `usage_rights: unverified` (Q-014). -->
<!-- source_note: Das Zitat liegt im Paket in ASCII-Umschrift („Flaechenland"); hier mit Umlauten gesetzt, Wortlaut unverändert. -->
<!-- id: dein-ort-5-story-kultur-demo; content_type: proof-card; provenance: sourced; derived_from: ["@schafe-vorm-fenster/proof@0.3.5#eichler-wasserschloss-quilow", "@schafe-vorm-fenster/proof@0.3.5#volkshochschule-uecker-randow"]; status: draft -->

**Beispiel:** Die Volkshochschule Uecker-Randow veröffentlicht ihr Kursprogramm über den Dorfkalender, Standort Pasewalk. — Kulturlandbüro Uecker-Randow, September 2024

**Testimonial:** „Der Dienst hilft dabei, Angebote in einem Flächenland besser sichtbar und auffindbar zu machen." — Uwe Eichler, Wasserschloss Quilow (2022)

## Slot 6 — Value Story 4: der Fünfzehn-Minuten-Radius

<!-- id: dein-ort-6-story-radius; content_type: value-story; provenance: sourced; derived_from: ["@schafe-vorm-fenster/proof@0.3.5#regional-footprint"]; status: draft -->

**Titel:** Was in fünfzehn Minuten Entfernung passiert

**Warum es zählt:** Dein Ort hört an der Gemeindegrenze nicht auf. Was zwei Dörfer weiter läuft, gehört genauso in deinen Kalender wie das, was direkt vor deiner Tür passiert.

**Beispiel:** Termine aus der Umgebung von {place}, live aus dem Kalender (Position 2, „diese Woche in der Nähe").

Der Dorfkalender läuft heute in vier Bundesländern, und jede Region belegt
eine andere Eigenschaft des Diensts — von Dichte über Zeit in
Vorpommern-Greifswald bis zur Landkreis-Schnittstelle in
Baden-Württemberg (`regional-footprint`, `cleared`, qualitative Aussage,
keine Reichweitenzahl).

**Testimonial:** Holger Wendt, Bürgermeister in Rubkow — Wortlaut in der Belegkarte unten.

<!-- testimonial_pool: ["@schafe-vorm-fenster/proof@0.3.5#wendt-rubkow"]; clearance: pending (usage_rights unverified, Q-014) -->

### Belegkarte zur Story 4

<!-- clearance: pending — `wendt-rubkow` steht auf `usage_rights: unverified` (Q-014). -->
<!-- source_note: Wortlaut unverändert aus dem Evidence-Block des Belegs. -->
<!-- id: dein-ort-6-story-radius-demo-testimonial; content_type: proof-card; provenance: sourced; derived_from: ["@schafe-vorm-fenster/proof@0.3.5#wendt-rubkow"]; status: draft -->

**Testimonial:** „Die selbstverwaltete und automatisierte Bereitstellung der Termindaten reduziert den Arbeitsaufwand unserer Gemeinde." — Holger Wendt, Bürgermeister in Rubkow (2022)

## Slot 7 — Homescreen-Block

<!-- id: dein-ort-7-homescreen; content_type: howto-block; provenance: sourced; derived_from: [ia]; status: draft -->

**Überschrift:** So landet der Kalender auf deinem Homescreen

**iOS:** Öffne den Kalender von {place} in Safari. Tipp auf „Teilen", dann auf „Zum Home-Bildschirm". Fertig — er startet ab jetzt wie eine App.

**Android:** Öffne den Kalender von {place} in Chrome. Tipp auf das Menü (drei Punkte), dann auf „Zum Startbildschirm hinzufügen". Fertig.

Beide Anleitungen stehen immer nebeneinander, unabhängig vom Gerät der
Besucherin (kein User-Agent-Sniffing, TS-020 D4). In Zustand B rückt
dieser Block hinter das Nachbarschafts-Modul.

## Slot 8 — CTA-Zusicherung (Permanenz-Versprechen)

<!-- id: dein-ort-8-permanence; content_type: closing-cta; provenance: sourced; derived_from: ["@schafe-vorm-fenster/offerings@0.3.3#community-calendar"]; status: draft -->

**Zusicherungstext:** Kostenlos, ohne Anmeldung, dauerhaft: keine Einführungsstufe, die später wieder verschwindet.

Quelle: `price.note` von `community-calendar` — „Free for readers without
any account … No limit on the number of dates per place. Permanent, not
an introductory tier." Der freie Zugang ist ein öffentliches Versprechen
seit 2022, kein Preismodell, das sich leise ändern lässt.

## Kontextband (3 Nicht-Fokus-Jobs)

<!-- source_note: Angebotsformulierung statt Menü aus gtm:concept/website-communication-principles.concept.md Prinzip 2 („ordnen, nicht ausschließen"); die drei Jobs und ihre Formulierung aus der Job-Tabelle in Prinzip 1. Beantwortet state/open.md Zeile 95 für diese Seite: eigener Bandtext statt des geteilten Home-Satzes. -->
<!-- id: dein-ort-9-context-band; content_type: context-band; provenance: sourced; derived_from: [ia]; status: draft -->

**Kicker:** Heute mit einem anderen Anliegen hier?

- **Termine veröffentlichen:** Du willst Termine für deinen Verein, deine Feuerwehr oder deine Gemeinde eintragen? → `/mitmachen`
- **Eigenen Kalender betreiben:** Du willst einen Kalender unter eigenem Namen, auf eurer eigenen Website? → `/dein-kalender`
- **Wer dahintersteckt:** Du willst wissen, wer den Dorfkalender macht? → `/ueber-uns`

Fokusjob dieser Seite ist „know what is on". Das Band steht darunter und
nennt die drei anderen Anliegen, jedes in der Sprache der Leserin.
