---
id: ueber-uns-de
page_id: TS-027
route: "/ueber-uns"
seo:
  "/ueber-uns":
    title: "Gebaut in einem Dorf"
    description: "Wer den Kalender betreibt und warum er für die Orte kostenlos bleibt: ein Dorf, das sich keinen Dienst mit eigenem Vertrieb leisten kann."
    provenance: generated
content_type: section
status: draft
locale: de
sources:
  - "@schafe-vorm-fenster/offerings@0.3.3#community-calendar"
  - "@schafe-vorm-fenster/offerings@0.3.3#portalize-calendar"
  - "@schafe-vorm-fenster/proof@0.3.5#founder-former-volunteer-mayor"
  - "@schafe-vorm-fenster/proof@0.3.5#in-operation-since-2018"
  - "@schafe-vorm-fenster/proof@0.3.5"
  - "@schafe-vorm-fenster/media-echo@0.3.3"
  - "@schafe-vorm-fenster/people@0.3.6#jan-henrik-hempel"
  - "@schafe-vorm-fenster/people@0.3.6#christian-sauer"
  - "@schafe-vorm-fenster/brand-identity@0.1.4#schafe-vorm-fenster"
  - "@schafe-vorm-fenster/proof@0.3.5#noerd-award-2026-smart-community"
  - "@schafe-vorm-fenster/proof@0.3.5#impftermine-landkreis"
  - "@schafe-vorm-fenster/proof@0.3.5#ukraine-integration-dorfleben"
  - "@schafe-vorm-fenster/proof@0.3.5#google-baecker-schlatkow"
  - "@schafe-vorm-fenster/proof@0.3.5#homeoffice-mobile-anbieter"
  - "@schafe-vorm-fenster/proof@0.3.5#kulturlandbuero-broellin"
  - "@schafe-vorm-fenster/media-echo@0.3.3#2026-01-zukunftswege-ost-vollblutdigitalisierer"
  - "ia"
derived_from:
  - "@schafe-vorm-fenster/offerings@0.3.3#community-calendar"
  - "@schafe-vorm-fenster/offerings@0.3.3#portalize-calendar"
  - "@schafe-vorm-fenster/proof@0.3.5#founder-former-volunteer-mayor"
  - "@schafe-vorm-fenster/proof@0.3.5#in-operation-since-2018"
  - "@schafe-vorm-fenster/people@0.3.6#jan-henrik-hempel"
  - "@schafe-vorm-fenster/people@0.3.6#christian-sauer"
  - "@schafe-vorm-fenster/brand-identity@0.1.4#schafe-vorm-fenster"
  - "@schafe-vorm-fenster/proof@0.3.5#noerd-award-2026-smart-community"
  - "@schafe-vorm-fenster/proof@0.3.5#impftermine-landkreis"
  - "@schafe-vorm-fenster/proof@0.3.5#ukraine-integration-dorfleben"
  - "@schafe-vorm-fenster/proof@0.3.5#google-baecker-schlatkow"
  - "@schafe-vorm-fenster/proof@0.3.5#homeoffice-mobile-anbieter"
  - "@schafe-vorm-fenster/proof@0.3.5#kulturlandbuero-broellin"
  - "@schafe-vorm-fenster/media-echo@0.3.3#2026-01-zukunftswege-ost-vollblutdigitalisierer"
  - "ia"
generated_by: "playbook-content-production@1.0.0"
generated_at: "2026-09-11"
tone_profile: "du-everywhere"
provenance: "sourced — 0 generated slots left. Slot 1 gained the real origin story and a real founder quote; slot 3 names six cleared proof elements and fills the reserved testimonial place with a real, clearance-pending testimonial"
compliance_check: "state/content-map.md#compliance-checks — TS-027"
open_points:
  - "Clearance pending — the testimonial in slot 3 (`kulturlandbuero-broellin`) carries `usage_rights: unverified` (Q-014) and its own record says 'nicht für neue öffentliche Flächen verwenden'. Protected preview only; go-live needs written clearance or the place goes back to empty"
  - "Code follow-up — `app/[lang]/ueber-uns/page.tsx` still builds block 3 from a hard-coded `DEMO_PROOF` array with `demo: true`. Slot 3 now carries six real, cleared elements; the page should read them instead (state/open.md #109)"
schema_note: "see content/pages/home/de.md — same TS-007/schema gap, state/open.md #37"
images:
  - id: ueber-uns-hero
    slot: ueber-uns-1-origin
    ratio: hero
    provenance: generated
    brief: >-
      Ein Dorf mit wenigen hundert Einwohnern, von einem Feldweg aus gesehen,
      Februar am späten Nachmittag: kahle Bäume, Backsteinhäuser, ein
      Storchennest auf einem Mast, Pfützen im Weg. Tief stehendes graues
      Licht, fast keine Farbe. Kein Mensch im Bild. Nicht zeigen: Schrift,
      Logos, lesbare Ortsschilder, Schnee, Idylle.
    style: "documentary photo, natural light, 35mm, muted colours, no text"
    alt: "Kleines Dorf von einem Feldweg aus im Februar, kahle Bäume und Backsteinhäuser."
    status: needed
  - id: ueber-uns-founder-portrait
    slot: ueber-uns-1-origin
    ratio: portrait
    provenance: real
    source: >-
      @schafe-vorm-fenster/people@0.3.6#jan-henrik-hempel/assets/2026-05-noerdaward2026-DSC09263-portrait.jpeg
      — `license: free use, credit required`, `press_clearance: cleared`,
      1826×1826. Binärdatei liegt im go-to-market-os-Repository, das npm-Paket
      liefert nur den .asset.md-Deskriptor.
    alt: "Jan-Henrik Hempel blickt in die Kamera, dahinter der abgedunkelte Saal."
    credit: "@rightvisionstudios & NØRD2026"
    lcp: true
    status: real
  - id: ueber-uns-team-jan-henrik-hempel
    slot: ueber-uns-5-team
    ratio: portrait
    provenance: real
    source: >-
      @schafe-vorm-fenster/people@0.3.6#jan-henrik-hempel/assets/2021-workshop-quilow-portrait.jpeg
      — Eigenaufnahme (in-house), unbeschränkte Nutzung, kein Credit nötig.
      Nicht dasselbe Bild wie im Herkunftsblock, damit die Seite ein Porträt
      nicht zweimal zeigt.
    alt: "Jan-Henrik Hempel erklärt etwas mit beiden Händen, hinter ihm Holzbalken."
    status: real
  - id: ueber-uns-team-christian-sauer
    slot: ueber-uns-5-team
    ratio: portrait
    provenance: real
    source: >-
      @schafe-vorm-fenster/people@0.3.6#christian-sauer/assets/2019-christian.jpg
      — `license: unverified`, Fotograf unbekannt, `press_clearance:
      unverified`. Nicht freigegeben, und ein Porträt einer realen Person wird
      nie generiert (DEC-068 Regel 3); bis zur Klärung zeigt die Karte die
      Fläche „Foto gesucht“ (TS-027-A9).
    alt: "Christian Sauer im Freien, er blickt in die Kamera."
    status: needed
---

# Über uns (`/ueber-uns`)

Fokusjob „understand who is behind it", **keine eigene Conversion**
(TS-027 D1). Die feste Headline aus DEC-036 §3 erscheint nur hier — auf
keiner anderen Seite.

## Slot 1 — Herkunft (h1, fest)

<!-- id: ueber-uns-1-origin; content_type: hero; provenance: sourced; derived_from: [ia, "@schafe-vorm-fenster/brand-identity@0.1.4#schafe-vorm-fenster", "@schafe-vorm-fenster/offerings@0.3.3#community-calendar", "@schafe-vorm-fenster/offerings@0.3.3#portalize-calendar", "@schafe-vorm-fenster/proof@0.3.5#founder-former-volunteer-mayor", "@schafe-vorm-fenster/people@0.3.6#jan-henrik-hempel", "@schafe-vorm-fenster/media-echo@0.3.3#2026-01-zukunftswege-ost-vollblutdigitalisierer"]; status: draft -->

**h1 (fest, DEC-036 §3 — nicht umformulierbar):** Gebaut in einem Dorf, betrieben aus einem Dorf.

**Text (Kausalkette):** Ein Dorf mit rund 400 Einwohnern kann sich keinen Dienst leisten, der einen Vertrieb braucht. Deshalb ist der Dorfkalender kostenlos, und das bleibt so. Deshalb kostet die Lizenz für den eigenen Kalender 480 € im Jahr statt eines Projektbudgets.

**Satz mit Beleg:** Der Gründer war selbst ehrenamtlicher Bürgermeister — das Amt, dem der Dienst hilft, kennt er von innen.

**Herkunft (Anfang und Name):** Angefangen hat es mit der Suche nach frischen Brötchen. Nach dem Umzug von Berlin nach Schlatkow fragte die Familie zwei Wochen lang nach einem Bäckerwagen, legte sich schließlich morgens auf die Lauer und fuhr dem Wagen ins Nachbardorf hinterher, um einen Halt in Schlatkow zu vereinbaren. Der Name stammt aus der Amtszeit als Bürgermeister von Schmatzin: Die Gemeinde unterhielt eine Schafweide, die vom Küchenfenster aus zu sehen war.

**Zitat (Gründer):** „Wenn man alles sammelt, ist plötzlich in jedem Dorf jeden Tag irgendwas los. Wir müssen das nur sichtbar machen." — Jan-Henrik Hempel

Die Zahl „rund 400 Einwohner" und die Kausalkette stehen wörtlich so im
Markenprofil (`brand-identity@0.1.4#schafe-vorm-fenster`: „A place of
four hundred inhabitants cannot carry a service that needs a salesperson
to sell it"). Preisangaben aus `community-calendar` (kostenlos,
„forever") und `portalize-calendar` (480/EUR/Jahr) — gelesen, nicht
getippt. Beleg zum Bürgermeister-Satz: `founder-former-volunteer-mayor`
(`cleared`). Herkunftsabsatz: Abschnitt „Origin story" desselben
Markenprofils, dazu das Porträt von Zukunftswege Ost-Vorpommern
(Januar 2026). Das Zitat steht wörtlich im Personenprofil
(`press_clearance: cleared`) und im Porträt.

## Slot 2 — Betriebs-Zähler (Live-Modul)

<!-- id: ueber-uns-2-counters; content_type: section; provenance: sourced; derived_from: ["@schafe-vorm-fenster/proof@0.3.5#in-operation-since-2018"]; status: draft -->

**Text:** Seit 2018 in Betrieb. Heute aktiv in {n} Orten.

Nur die Jahreszahl ist ein feststehender Beleg
(`in-operation-since-2018`, `cleared`) — die Ortszahl zählt live mit.
Keine statische Reichweitenzahl (`reach-and-usage` ist `expired`, SRC-001
§5); ohne Live-Wert steht nur der Satz ohne Zahl, nie eine geschätzte
Zahl.

## Slot 3 — Belegstrom (7 Elemente, 1 typreserviert)

<!-- id: ueber-uns-3-proof-stream; content_type: proof-card; provenance: sourced; derived_from: ["@schafe-vorm-fenster/proof@0.3.5", "@schafe-vorm-fenster/media-echo@0.3.3", "@schafe-vorm-fenster/proof@0.3.5#noerd-award-2026-smart-community", "@schafe-vorm-fenster/proof@0.3.5#in-operation-since-2018", "@schafe-vorm-fenster/proof@0.3.5#founder-former-volunteer-mayor", "@schafe-vorm-fenster/proof@0.3.5#impftermine-landkreis", "@schafe-vorm-fenster/proof@0.3.5#ukraine-integration-dorfleben", "@schafe-vorm-fenster/proof@0.3.5#google-baecker-schlatkow"]; status: draft -->

**Überschrift:** Was andere sagen

Pool: der volle `proof`-Bestand plus `media-echo` (31 Einträge). Sechs
der sieben Plätze sind heute mit freigegebenen Belegen besetzbar — alle
sechs tragen `usage_rights: cleared`:

1. NØRD AWARD 2026, Kategorie Smart Community, unter Bitkom-Schirmherrschaft, verliehen am 28. Mai 2026 auf der NØRD digital convention in Rostock. — NØRD digital convention / digitales MV
2. Der Dorfkalender ist seit 2018 in Betrieb — kein Pilot, kein Prototyp. — media-echo-Bestand, frühester Fremdbeleg Nordkurier, Juni 2018
3. Der Gründer hat als ehrenamtlicher Bürgermeister das Amt gehalten, dem der Dienst dient. — Nordkurier 2019 und 2022; Zukunftswege Ost-Vorpommern 2026
4. In der Pandemie wurden sämtliche Impfangebote und Testzentren-Öffnungszeiten des Landkreises tagesaktuell und ortsgenau über die Dorfkalender veröffentlicht. — Landkreis Vorpommern-Greifswald, 2022
5. Der Dorfkalender hat 2022 die Integration ukrainischer Geflüchteter ins Dorfleben unterstützt: Anschluss an Vereinstreffen, Veranstaltungen und mobile Händler. — eu:react-Abschlussbericht, Juli 2022
6. Wer bei Google nach „Bäcker Schlatkow" sucht, findet das mobile Bäckerauto und seinen Tag — nicht Filialen in Anklam. — eu:react-Abschlussbericht, Juli 2022

Die Reihenfolge hier ist die Quellenliste, nicht die Anzeigereihenfolge:
Welches Element auf welchem Platz steht, entscheidet die
Relevanz-Maschine (TS-005) aus demselben Pool. Der siebte Platz ist für
den Typ `testimonial` reserviert und wird nie mit einem Element eines
anderen Typs aufgefüllt (TS-027 D5).

<!-- id: ueber-uns-3-testimonial-slot-demo; content_type: proof-card; provenance: sourced; derived_from: ["@schafe-vorm-fenster/proof@0.3.5#kulturlandbuero-broellin"]; status: draft -->

**Reservierter Platz (Typ `testimonial`, Freigabe steht aus):** „Das Projekt kann einen wertvollen Beitrag zum wirtschaftlichen Wiederaufbau und zur Sichtbarkeit im ländlichen Raum leisten." — Kulturlandbüro Uecker-Randow, Schloss Bröllin

Echtes Zitat aus `kulturlandbuero-broellin`, wörtlich, in normaler
deutscher Rechtschreibung statt der ASCII-Umschrift der Quelldatei. Der
Datensatz trägt `usage_rights: unverified` und den ausdrücklichen
Vermerk „nicht für neue öffentliche Flächen verwenden" (Q-014): Die
Karte steht deshalb nur im geschützten Preview. Liegt bis zum Go-live
keine schriftliche Freigabe vor, bleibt der Platz leer und zeigt wieder
die Schraffur-Fläche mit dem Satz, der die Lücke benennt (TS-027 D5).

## Slot 4 — Archiv-Verweis

<!-- id: ueber-uns-4-archive; content_type: section; provenance: sourced; derived_from: [ia]; status: draft -->

**Link-Text:** Das vollständige Presse- und Auszeichnungs-Archiv → `/ueber-uns/archiv`

Genau ein Link, keine Vorschau, keine Liste, kein Zähler (TS-027 D6).

## Slot 5 — Team

<!-- id: ueber-uns-5-team; content_type: profile; provenance: sourced; derived_from: ["@schafe-vorm-fenster/people@0.3.6#jan-henrik-hempel", "@schafe-vorm-fenster/people@0.3.6#christian-sauer", "@schafe-vorm-fenster/proof@0.3.5#founder-former-volunteer-mayor"]; status: draft -->

**Jan-Henrik Hempel** — Gründer, technische Leitung und Softwarearchitektur. Zog 2008 von Berlin nach Schlatkow in Vorpommern, gründete 2014 den Kulturverein der Gemeinde Schmatzin mit und war ab 2019 deren ehrenamtlicher Bürgermeister.

**Christian Sauer** — langjähriger Wegbegleiter und ehemaliger Projektkoordinator, mit Hintergrund in Kunst, Kuration, Projektmanagement, Kundensupport und Online-Redaktion.

## Slot 6 — Newsletter

<!-- id: ueber-uns-6-newsletter; content_type: section; provenance: sourced; derived_from: [ia]; status: draft -->

**Überschrift:** Auf dem Laufenden bleiben

**Text:** Ein bis zwei Mal im Monat: was sich am Dorfkalender ändert, und was neue Orte damit machen.

**Eingabefeld (Placeholder):** `name@beispiel.de`

**Button-Label:** Eintragen

**Demo-Hinweis:** Demo-Daten — diese Anmeldung verlässt deinen Browser noch nicht.


