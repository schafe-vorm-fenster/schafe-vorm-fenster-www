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
  - "@schafe-vorm-fenster/proof@0.3.5#wendt-rubkow"
  - "@schafe-vorm-fenster/offerings@0.3.3#community-calendar"
  - "ia"
derived_from:
  - "@schafe-vorm-fenster/proof@0.3.5#impftermine-landkreis"
  - "@schafe-vorm-fenster/proof@0.3.5#regional-footprint"
  - "@schafe-vorm-fenster/offerings@0.3.3#community-calendar"
  - "ia"
generated_by: "playbook-content-production@1.0.0"
generated_at: "2026-09-11"
tone_profile: "du-everywhere"
provenance: "mixed — sourced per section; 4 generated demo-testimonial/demo-example slots added under the prototype completeness override (slots 3, 4, 5, 6 — state/open.md Dummy-Content); underlying value-story text stays sourced, only the demo testimonial/example additions are generated"
compliance_check: "state/content-map.md#compliance-checks — TS-020"
schema_note: "see content/pages/home/de.md — same TS-007/schema gap, state/open.md #37"
---

# Dein Ort (`/dein-ort`)

Zwei Zustände auf einer Route (TS-020 D2): **A** — Termine vorhanden,
**B** — Ort ist erfasst, aber leer (Fokusjob wechselt zu „publish our
dates"). Block- und DOM-Reihenfolge bleiben in beiden Zuständen gleich;
nur der Angebotstext in Block 1 wechselt.

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

**Testimonial:** *leer nach Vorgabe — kein freigegebenes Zitat*

<!-- provenance: sourced-empty-by-design; testimonial_pool: ["@schafe-vorm-fenster/proof@0.3.5#kurzweg-baeckerei"]; usage_rights: unverified (Q-014) -->

Solange `kurzweg-baeckerei` `usage_rights: unverified` bleibt, rendert die
Story dreiteilig (Aspekt → Warum → Beispiel), ohne Zitat. Kein Ersatztext,
keine Paraphrase, kein „Nutzer sagen" (SRC-001 §4).

<!-- id: dein-ort-3-story-baeckerwagen-demo-testimonial; content_type: proof-card; provenance: generated; derived_from: []; status: draft; demo: true -->

**Demo-Testimonial (Prototyp, `Demo-Daten`-Badge):** „Seit der Bäckerwagen im Kalender steht, verpassen wir ihn nicht mehr." — Bäckerei, Beispielgemeinde Musterdorf. Erkennbar exemplarisch, ersetzt kein freigegebenes Zitat.

## Slot 4 — Value Story 2: die Ratssitzung

<!-- id: dein-ort-4-story-ratssitzung; content_type: value-story; provenance: sourced; derived_from: ["@schafe-vorm-fenster/proof@0.3.5#impftermine-landkreis"]; status: draft -->

**Titel:** Die Ratssitzung, bevor sie stattfindet

**Warum es zählt:** Wer mitreden will, muss vom Termin erfahren, bevor er vorbei ist — nicht danach im Protokoll. Amtliche Termine gehören in denselben Kalender wie alles andere im Ort.

**Beispiel:** ein amtlicher Termin aus {place} oder dem Landkreis, live aus dem Kalender.

Beleg für die Tragfähigkeit in der Krise: Während der Pandemie liefen
sämtliche Impfangebote und Testzentren-Öffnungszeiten des Landkreises
tagesaktuell und ortsgenau über die Dorfkalender (`impftermine-landkreis`,
`cleared`).

**Testimonial:** *leer nach Vorgabe — kein freigegebenes Zitat*

<!-- provenance: sourced-empty-by-design; testimonial_pool: ["@schafe-vorm-fenster/proof@0.3.5#zschiesche-gross-kiesow"]; usage_rights: unverified (Q-014) -->

<!-- id: dein-ort-4-story-ratssitzung-demo-testimonial; content_type: proof-card; provenance: generated; derived_from: []; status: draft; demo: true -->

**Demo-Testimonial (Prototyp, `Demo-Daten`-Badge):** „Ich habe von der Ratssitzung im Kalender erfahren, nicht erst im Protokoll danach." — Einwohnerin, Beispielgemeinde Musterdorf. Erkennbar exemplarisch, ersetzt kein freigegebenes Zitat.

## Slot 5 — Value Story 3: Kultur, die niemand gesucht hätte

<!-- id: dein-ort-5-story-kultur; content_type: value-story; provenance: sourced-empty-by-design; derived_from: [ia]; status: draft -->

**Titel:** Kultur, die du nicht gesucht hättest

**Warum es zählt:** Das Konzert im Nachbardorf, die Ausstellung im Schloss — wer nicht zufällig davon hört, verpasst es. Im Kalender findet es dich, statt umgekehrt.

**Beispiel:** ein Kulturtermin aus der Umgebung von {place}, live aus dem Kalender.

**Testimonial:** *leer nach Vorgabe — kein freigegebenes Zitat*

<!-- provenance: sourced-empty-by-design; testimonial_pool: ["@schafe-vorm-fenster/proof@0.3.5#kulturlandbuero-broellin", "@schafe-vorm-fenster/proof@0.3.5#eichler-wasserschloss-quilow"]; usage_rights: unverified (Q-014); note: "keine gedeckte Backing-Anekdote vorhanden — an Orten ohne Kulturtermin trägt diese Story heute keinen Beleg (TS-020 Open Points)" -->

<!-- id: dein-ort-5-story-kultur-demo; content_type: proof-card; provenance: generated; derived_from: []; status: draft; demo: true -->

**Demo-Beispiel und Demo-Testimonial (Prototyp, `Demo-Daten`-Badge):** Beispieltermin „Ausstellung im Schlosspark, Beispielgemeinde Musterdorf" — „Von der Ausstellung hätte ich sonst nie erfahren, sie stand einfach im Kalender." — Besucherin, Beispielgemeinde Musterdorf. Termin, Ort und Zitat sind frei erfunden und erkennbar exemplarisch; sie zeigen nur, wie die Story mit Beleg aussähe, und ersetzen weder eine echte Anekdote noch ein freigegebenes Zitat.

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

**Testimonial:** *leer nach Vorgabe — kein freigegebenes Zitat*

<!-- provenance: sourced-empty-by-design; testimonial_pool: ["@schafe-vorm-fenster/proof@0.3.5#wendt-rubkow"]; usage_rights: unverified (Q-014) -->

<!-- id: dein-ort-6-story-radius-demo-testimonial; content_type: proof-card; provenance: generated; derived_from: []; status: draft; demo: true -->

**Demo-Testimonial (Prototyp, `Demo-Daten`-Badge):** „Was zwei Dörfer weiter läuft, sehe ich jetzt genauso wie das, was direkt bei uns passiert." — Einwohner, Beispielgemeinde Musterdorf. Erkennbar exemplarisch, ersetzt kein freigegebenes Zitat.

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
