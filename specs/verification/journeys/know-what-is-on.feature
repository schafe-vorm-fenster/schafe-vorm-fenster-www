# Journey: "Know what is on" — the reading job.
# Covers the three outcomes of the place search: dates, no dates, no place.
# Gherkin is the specification; Playwright executes it (DEC-0040).

@job:know-what-is-on
Funktionalität: Erfahren, was im eigenen Ort los ist

  @FUN-WEB-0010 @FUN-WEB-0007 @TS-WEB-0004-A1
  Szenario: Die Startseite erfüllt den Job an Ort und Stelle
    Angenommen ich rufe die Startseite ohne bekannten Standort auf
    Dann sehe ich im ersten Bildschirm die Ortssuche
    Und "Was ist los" ist kein Klickziel, sondern hier erfüllt

  @FUN-WEB-0011 @FUN-WEB-0042 @FUN-WEB-0198, FUN-WEB-0199, FUN-WEB-0200, CON-WEB-0089, CON-WEB-0090
  Szenario: Ein abgedeckter Ort mit Terminen
    Angenommen ich suche einen Ort mit Terminen
    Dann sehe ich den Ortsnamen und die nächsten Termine
    Und die Live-Module erscheinen zuerst als Skeleton und streamen nach
    Und mir wird der Homescreen-Block angeboten

  @FUN-WEB-0153, FUN-WEB-0154 @FUN-WEB-0045
  Szenario: Ein abgedeckter Ort ohne Termine wechselt den Fokus-Job
    Angenommen ich suche einen Ort ohne Termine
    Dann wechselt die Seite den Fokus-Job auf "Termine veröffentlichen"
    Und mir wird angeboten, die Erste zu sein
    Und die Live-Kette beginnt beim zweiten Radius
    Aber es erscheint keine Fehlermeldung

  @FUN-WEB-0155, FUN-WEB-0156, FUN-WEB-0157, CON-WEB-0070, CON-WEB-0071, CON-WEB-0072 @FUN-WEB-0158, FUN-WEB-0159 @CON-WEB-0062, FUN-WEB-0142
  Szenario: Ein nicht abgedeckter Ort führt ins Gründen
    Angenommen ich suche einen Ort, den das System nicht kennt
    Dann lande ich auf "/dein-ort/starten"
    Und der Ort steht als Query-Parameter in der URL, nicht im Pfad
    Und mir wird der nächstgelegene aktive Ort als echtes Beispiel gezeigt

  @FUN-WEB-0102 @FUN-WEB-0196, FUN-WEB-0197 @TS-WEB-0003-A4
  Szenario: Die Seite trägt auch ohne erreichbare App-API
    Angenommen die App-APIs antworten nicht
    Wenn ich einen Ort aufrufe
    Dann sehe ich die zuletzt bekannten Inhalte mit Frischeangabe
    Und Live-Zähler werden ausgeblendet statt veraltet angezeigt
