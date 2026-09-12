---
id: dein-ort-starten-de
page_id: TS-021
route: "/dein-ort/starten"
seo:
  "/dein-ort/starten":
    title: "Kalender für deinen Ort starten"
    description: "Dein Ort steht noch nicht im Dorfkalender? Eine Person, ein Flyer, ein Foto per WhatsApp — mehr braucht es nicht, damit er dazukommt."
    provenance: generated
content_type: section
status: draft
locale: de
sources:
  - "@schafe-vorm-fenster/offerings@0.3.3#community-calendar"
  - "@schafe-vorm-fenster/audiences@0.3.3#actors"
  - "@schafe-vorm-fenster/proof@0.3.5#lehre-lelender"
  - "@schafe-vorm-fenster/media-echo@0.3.3#2022-nordkurier-plattform-doerfer"
  - "ia"
derived_from:
  - "@schafe-vorm-fenster/offerings@0.3.3#community-calendar"
  - "@schafe-vorm-fenster/audiences@0.3.3#actors"
  - "@schafe-vorm-fenster/proof@0.3.5#lehre-lelender"
  - "@schafe-vorm-fenster/media-echo@0.3.3#2022-nordkurier-plattform-doerfer"
  - "ia"
generated_by: "playbook-content-production@1.0.0"
generated_at: "2026-09-11"
tone_profile: "du-everywhere"
provenance: "sourced — 0 generated slots. Slot 2 now cites the 2022 Nordkurier record behind the permanence commitment and slot 4 the Lehre reference case; both are clearance: pending (Q-045, Q-014)"
compliance_check: "state/content-map.md#compliance-checks — TS-021"
schema_note: "see content/pages/home/de.md — same TS-007/schema gap, state/open.md #37"
images:
  - id: dein-ort-starten-hero
    slot: dein-ort-starten-1-ack
    ratio: hero
    provenance: generated
    brief: >-
      Gemeindehaus und Feuerwehrgerätehaus an einem Dorfanger im Mai, später
      Nachmittag: frisch gemähtes Gras, ein Fahnenmast ohne Fahne, Klappstühle
      an der Hauswand. Weiches Licht, leicht bedeckt, gedeckte Grüntöne. Im
      Hintergrund tragen zwei Menschen einen Tisch, von hinten und klein im
      Bild. Nicht zeigen: Schrift, Logos, lesbare Schilder, Gesichter, eine in
      die Kamera gestellte Vereinsgruppe.
    style: "documentary photo, natural light, 35mm, muted colours, no text"
    alt: "Gemeindehaus am Dorfanger im Frühling, davor Klappstühle an der Wand."
    status: needed
---

# Dein Ort gründen (`/dein-ort/starten`)

Erreicht, wenn die Ortssuche **keinen** Ort findet (TS-021 D3) — der
Unterschied zu `/dein-ort` Zustand B ist bewusst: dort fehlen Termine,
hier fehlt der Ort selbst im System. Diese Seite adressiert die
Besucherin nie direkt mit „du könntest die Erste sein" (TS-021 D9,
DEC-071) — dieser Satz gehört ausschließlich auf `/dein-ort`.

## Slot 1 — Bestätigung mit Ortsname

<!-- id: dein-ort-starten-1-ack; content_type: hero; provenance: sourced; derived_from: [ia]; status: draft -->

**Headline (mit Ort):** {ort} steht noch nicht im Dorfkalender.

**Headline (ohne Ort, Fallback):** Dieser Ort steht noch nicht im Dorfkalender.

**Unterzeile:** Das lässt sich ändern — mit einem WhatsApp-Foto vom nächsten Flyer.

Der Ortsname ist reiner Text, escaped, nie Teil eines Links, einer
Kalender-Zeile oder einer Zahl (TS-021 D6).

## Slot 2 — Was es braucht

<!-- clearance: pending für den Presse-Beleg — der Nordkurier-Eintrag von 2022 trägt kein `usage_rights` (Q-045, state/open.md #1). Der Angebots-Datensatz selbst ist frei verwendbar. -->
<!-- id: dein-ort-starten-2-was-es-braucht; content_type: value-story; provenance: sourced; derived_from: ["@schafe-vorm-fenster/offerings@0.3.3#community-calendar", "@schafe-vorm-fenster/media-echo@0.3.3#2022-nordkurier-plattform-doerfer"]; status: draft -->

**Überschrift:** Was es braucht, damit {ort} im Kalender steht

**Text:** Eine Person. Ein Flyer, den es sowieso schon gibt. Ein Foto per WhatsApp. Mehr nicht: kostenlos, ohne Anmeldegebühr, dauerhaft.

Quelle: `price.note` von `community-calendar` — „Free for readers without
any account … Permanent, not an introductory tier." Das Angebot war
während der React-EU/ESF-Förderung kostenlos, und dass es das danach
bleibt, stand 2022 im Nordkurier: „Das Basisangebot, das unter anderem
beliebig viele Termine pro Dorf oder Gemeinde erlaubt, werde es auch
danach bleiben." Der Offering-Datensatz nennt das ausdrücklich eine
öffentliche Zusage und keine Preisentscheidung, die sich still
zurücknehmen lässt (dieselbe Zusicherung wie `/dein-ort` Slot 8).

## Slot 3 — Live-Beispiel, nächster aktiver Ort

<!-- id: dein-ort-starten-3-beispiel; content_type: live-module-frame; provenance: sourced; derived_from: [ia]; status: draft -->

**Modul-Überschrift:** So sieht das zum Beispiel aus — in {beispielort}

**Hinweis:** Beispiel, nicht {ort}. {ort} selbst taucht in diesem Modul nirgends als Daten auf.

Der Ortsname im Beispiel kommt aus einem tatsächlich abgedeckten, aktiven
Ort (TS-021 D7) — nie aus dem gesuchten, nicht gefundenen Ort.

## Slot 4 — Wer das meistens anstößt

<!-- clearance: pending für `lehre-lelender` (`usage_rights: unverified`, schriftliche Freigabe der Stiftung steht aus). Der Audience-Datensatz ist frei verwendbar. -->
<!-- id: dein-ort-starten-4-wer; content_type: value-story; provenance: sourced; derived_from: ["@schafe-vorm-fenster/audiences@0.3.3#actors", "@schafe-vorm-fenster/proof@0.3.5#lehre-lelender"]; status: draft -->

**Überschrift:** Wer sowas meistens anstößt

**Text:** In den meisten Orten ist es ein Verein, die Feuerwehr, die Kirchengemeinde, eine Initiative, ein Kulturbetrieb oder ein mobiler Dienst wie ein Bäcker- oder Arztwagen. Oft eine einzelne Person, die das nebenbei macht.

Quelle: `@schafe-vorm-fenster/audiences#actors`, Feld „Context" — die
eigene Aufzählung des Audience-Records, keine neue Erfindung.

Ton (TS-021 D9): Dieser Absatz weist niemandem die Aufgabe zu. Er nennt,
wer es üblicherweise ist, und überlässt der Leserin, sich
wiederzuerkennen.

Ein dokumentierter Fall: In der Gemeinde Lehre (Landkreis Helmstedt,
Niedersachsen) hat die Stiftung Lebendiges Lehre den Anfang gemacht — 17
Orte unter einem eigenen Kalendernamen. Beim Abend der
Engagierten am 27. August 2026 standen 17 ortsindividuelle Flyer mit QR-Code auf den
Tischen von rund 70 Ehrenamtlichen (`lehre-lelender`, Freigabe steht noch
aus).

## Slot 5 — Ortssuche (erneut)

<!-- id: dein-ort-starten-5-search; content_type: section; provenance: sourced; derived_from: [ia]; status: draft -->

**Überschrift:** Falsch getippt? Nochmal suchen

**Sucheingabe (Placeholder):** Deine Postleitzahl

**Hinweistext unter dem Feld:** Suche nach Ortsnamen kommt noch dazu — bis dahin reicht die Postleitzahl.

Dieselbe Komponente wie auf `/` und `/dein-ort` (TS-008 D7) — kein
eigenes Verhalten. Der Hinweistext steht jetzt hier statt nur im Code
(state/open.md Zeile 94), damit die englische Seite nicht die deutsche
Vorgabe der Komponente erbt.

## Weiterleitung zur Registrierung

<!-- id: dein-ort-starten-6-cta; content_type: closing-cta; provenance: sourced; derived_from: [ia]; status: draft -->

**CTA-Label (primär):** {ort} eintragen → `/mitmachen/registrieren?ort={ort}`

**CTA-Label (ohne Ort, Fallback):** Deinen Ort eintragen → `/mitmachen/registrieren`

Der Wert wandert unverändert und URL-codiert weiter (TS-021 D8) — kein
App-Link, kein vorausgefülltes Konto, keine Behauptung, {ort} sei bereits
registriert (Ehrlichkeitsregel, TS-021 D8). Ohne Ortsnamen steht das
zweite Label da: Es nennt keinen Ort, weil keiner feststeht, und
verspricht dadurch auch keinen (state/open.md Zeile 94).

## Kontextband (3 Nicht-Fokus-Jobs)

<!-- source_note: Angebotsformulierung statt Menü aus gtm:concept/website-communication-principles.concept.md Prinzip 2; die drei Jobs und ihre Formulierung aus der Job-Tabelle in Prinzip 1. Beantwortet state/open.md Zeile 95 für diese Seite. -->
<!-- id: dein-ort-starten-7-context-band; content_type: context-band; provenance: sourced; derived_from: [ia]; status: draft -->

**Kicker:** Heute mit einem anderen Anliegen hier?

- **Sehen, was los ist:** Du willst erst mal schauen, was in der Umgebung stattfindet? → `/dein-ort`
- **Eigenen Kalender betreiben:** Du willst einen Kalender unter eigenem Namen, auf eurer eigenen Website? → `/dein-kalender`
- **Wer dahintersteckt:** Du willst wissen, wer den Dorfkalender macht? → `/ueber-uns`

Fokusjob dieser Seite ist „publish our dates". Wer hier landet, hat nach
einem Ort gesucht — das Band hält die drei anderen Anliegen erreichbar,
ohne sie anzupreisen.
