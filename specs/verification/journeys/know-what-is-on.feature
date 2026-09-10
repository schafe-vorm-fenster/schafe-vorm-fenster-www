# Journey: "Know what is on" — the reading job.
# Covers the three outcomes of the place search: dates, no dates, no place.
# Gherkin is the specification; Playwright executes it (DEC-040).

@job:know-what-is-on
Funktionalität: Erfahren, was im eigenen Ort los ist

  @WEB-F-010 @WEB-F-007 @TS-004-A1
  Szenario: Die Startseite erfüllt den Job an Ort und Stelle
    Angenommen ich rufe die Startseite ohne bekannten Standort auf
    Dann sehe ich im ersten Bildschirm die Ortssuche
    Und "Was ist los" ist kein Klickziel, sondern hier erfüllt

  @WEB-F-011 @WEB-F-042 @WEB-F-106
  Szenario: Ein abgedeckter Ort mit Terminen
    Angenommen ich suche einen Ort mit Terminen
    Dann sehe ich den Ortsnamen und die nächsten Termine
    Und die Live-Module erscheinen zuerst als Skeleton und streamen nach
    Und mir wird der Homescreen-Block angeboten

  @WEB-F-044 @WEB-F-045
  Szenario: Ein abgedeckter Ort ohne Termine wechselt den Fokus-Job
    Angenommen ich suche einen Ort ohne Termine
    Dann wechselt die Seite den Fokus-Job auf "Termine veröffentlichen"
    Und mir wird angeboten, die Erste zu sein
    Und die Live-Kette beginnt beim zweiten Radius
    Aber es erscheint keine Fehlermeldung

  @WEB-F-046 @WEB-F-047 @WEB-F-023
  Szenario: Ein nicht abgedeckter Ort führt ins Gründen
    Angenommen ich suche einen Ort, den das System nicht kennt
    Dann lande ich auf "/dein-ort/starten"
    Und der Ort steht als Query-Parameter in der URL, nicht im Pfad
    Und mir wird der nächstgelegene aktive Ort als echtes Beispiel gezeigt

  @WEB-F-102 @WEB-F-104 @TS-003-A4
  Szenario: Die Seite trägt auch ohne erreichbare App-API
    Angenommen die App-APIs antworten nicht
    Wenn ich einen Ort aufrufe
    Dann sehe ich die zuletzt bekannten Inhalte mit Frischeangabe
    Und Live-Zähler werden ausgeblendet statt veraltet angezeigt
