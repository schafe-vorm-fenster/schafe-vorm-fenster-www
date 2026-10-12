# Review 12.10.2026

Der Stand der Review ist wörtlich übernommen. Einzige Änderung: Die Dateinamen der
Designs sind zu Links auf die Dateien in diesem Ordner geworden. Was daraus folgt,
steht in [spec-impact.md](spec-impact.md).

## Startseite 
`https://schafe-vorm-fenster-fqo6lhltb-schafe-vorm-fenster.vercel.app/`

---

Fehler: Die Bühne der Startseite mit einem aktivierten Ort zeigt immer dasselbe Foto. Es muss aber das Foto des jeweiligen Ortes sein.
Beispiel `https://schafe-vorm-fenster-fqo6lhltb-schafe-vorm-fenster.vercel.app/dein-ort?ort=schlatkow` zeigt ein Bild von irgendwo be Pasewalk.

---

Fehler: Die Terminansich unter dem Foto in der Bühne der Startseite ist noch immer dunkelgrün. Wir hatten uns gegen das dunkelgrün entschieden.

---

Layout schlecht: Die Bühne auf der Startseite ist zu voll. Wie können einigen an Text weglassen.

"Tipp den Ortsnamen ein — Vorschläge kommen ab dem zweiten Buchstaben." -> weg lassen, dafür  "Tipp den Ortsnamen ein" als Placeholder des Eingabefeldes verwenden. Dann sparen wir uns eine Textzeile ohne die Nutzerführung zu verlieren.

"Meinen Standort verwenden" dann direkt unter das Eingabefeld.

"Fragt den Browser einmal nach deinem Standort und öffnet den nächsten Ort. Gespeichert wird nichts." -> weg lassen. Erklärungen sind gut, aber hier zu voll.

---

Text: "Was wann wo in deinem Ort los ist." Ist zu kompliziert. Eifacher ist "Was ist los in deinem Dorf?" 

---

Terminauswahl: Wir müssen die Auswahl noch verbessern. Das Ziel ist es thematisch diverse Termine auszuwählen und wenn möglich Kulturtermine mit einzubeziehen.

Beispiele:

Schlatkow hat derzeit Volleyball, Restmüll, Frauensport. Ist alles richtig, das sind aber alles Regeltermine. Leider ist gerade auch nicht viel los, aber bspw. "Vereinstreffen des Kulturvereins" ist spannender, alleine schon nur weil er seltener vorkommt und es auch zu "#Kultur" gehört.

TODO

---

Die Startseitenbühne mit ausgewählten Ort sieht verdammt langweilig aus. Vermutlich sollten wir die Suchbox mit "Suche nach einem anderen Ort ..." Mit drin lassen, schon nur um es aufzulockern.

---

"Termine, die gerade im Kalender stehen"
"8.543 Termine"

Das wollten wir doch entfernen. Bitte raus lassen. Die Zahl sagt niemanden etwas.

---

Die Überleitung "Fehlt deine Veranstaltung, jetzt selbst eintragen." Ist super, könnte aber prominenter gestaltet sein.

---

Super: Das Module "Ein Foto vom Flyer per WhatsApp, und der Termin steht im Kalender." Ist Klasse. 

Aber ein TODO habe ich hier, dass wir gute Grafiken einbauen. Vielleicht können wir was aus der Präsentation nehmen?

Und: Auf Smartphone/kleiner Auflösung lässt sich das Modul nur über die Links darunter navigieren, aber nicht in den drei Cards. Hier benötigen wir ein horizontales Scrollen und rechts/links Buttons zur Navigation.

Ist-Zustand: [Ist - Bildschirmfoto 2026-10-12 um 07.41.36.jpg](Ist%20-%20Bildschirmfoto%202026-10-12%20um%2007.41.36.jpg), [Ist - Bildschirmfoto 2026-10-12 um 07.41.43.jpg](Ist%20-%20Bildschirmfoto%202026-10-12%20um%2007.41.43.jpg)

---

Fehler / Design: Der Button "Jetzt kostenlos anmelden" ist weiß auf weiß. Das ist kein guter CTA.

---

Der CTA "Jetzt kostenlos anmelden" geht genau auf die richtige Seite. Aber geht nur auf das Anmelden. Hinter dem CTA befindet sich auch die Info, dass man andere Varianten Termine einzutragen (per Kalender, per Website Crawling usw.) noch erfahren kann. Wir müssen hier auf die anderen Varianten hinweisen und dann auf die Mitmachen Seite leiten.

---

Der Teilbereich "Aus dem Flyer geworden" kann weg. Das Modul erklärt das gut genug.

---

"
Ohne eigenes System

Die Termine aus dem Ort stehen auch da, wo die Gemeinde sie zeigt:

Deine Termine auf deiner Webseite.
Der Kulturkalender für deine Gemeinde: Termine von allen Akteuren im Amtsgebiet, zu Kultur, Tourismus und Gemeindeleben. Zwei Zeilen einbinden, fertig.
"

Hier müssen wir am Text feilen. Das klingt alles sehr holperig. Was wollen wir eigentlich alles sagen?

- Deine Termine auf deiner Webseite. -> und konkreter "Der Kulturkalender für deine Gemeinde" oder "dein Gemeindekalender" oder "alle Termine im Amtsgebiet" oder ... so können wir direkt erklären, dass man so einen Kalender mit allen Termine einer Region oder Kategorie aus seine Webseite bringen kann. "Ohne eigenes System" ist eher der Zusatz, als die Haupt Nachricht.

---

TODO: Das Rathaus Foto finde ich nicht schlecht, aber evtl. sollten wir hier ein Webseitenkalender als Overlay darüber legen, damit gleich klar ist, hier geht es um einen Web Kalender.

---

CTA "Kalender bestellen" ist zu kürz gefasst. Also genau der richtige Link, aber evtl. brauchen wir einen Zusatz, dass man hier im Detail erfährt was da alles geht, Filter, Konfiguration, zwei Zeilen Code > fertig, White label Design usw.

---

Die "Uhr über uns" Section ist gut so.

Verbesserungen wären:
- Humanizer über die texte?
- "mitbegründet" -> mitgegründet
- Dashes?
- Warum ist das Foto hier (ins. Auf Smartphone) nicht auf voller Breite sondern ausgerichtet am Text?

---

Zur Section:

"Was andere sagen

Auszeichnungen, Presse und Orte, die den Dorfkalender schon nutzen"

Müssten wir die teaser hier nicht so bauen, dass sie je eine Kernaussage tragen und dann in den "Über uns" Bereich verlinken - mit Deeplink?

---

"Beleg aus der Region" ist eine interne Anweisung. Wie kann es sein, dass diese in den text auf der Webseite kommt. Das ist ein Regelbruch!

---

"NØRD Award 2026 gewonnen, Kategorie Smart Community, Schirmherr Bitkom."

Das ist kein Text. Das geht so gar nicht. Das müssen wir formulieren.

Bspw. "Wir sind stolz, dass wir den NØRD Award 2026 in der Kategorie Smart Community unter der Schirmherrschaft des Bitkom e.V. gewonnen haben."

Das betrifft auch alle anderen dieser Sesctions.
---

"Heute mit einem anderen Anliegen hier?"

Inhaltlich nicht schlecht, sieht aber total Kacke aus! Es ist richtig, dass dieses Element etwas dezenter ist - es ist ja die Weiterleitung für die die die prominenten Inhalte nicht brauchen oder was anderes suchen. Aber es darf nicht wi Wikipedia in den 90ern aussehen.

Besseres / neues Design für dieses Element:

[Design - Kontextband Section - Desktop.png](Design%20-%20Kontextband%20Section%20-%20Desktop.png)
[Design - Kontextband Section - Tablet.png](Design%20-%20Kontextband%20Section%20-%20Tablet.png)
[Design - Kontextband Section - Mobile.png](Design%20-%20Kontextband%20Section%20-%20Mobile.png)

Ist-Zustand: [Ist - Kontextband.png](Ist%20-%20Kontextband.png)

---

"Dann schau nach, was bei dir los ist." -> "Schau nach, was bei dir los ist."

---

Das Kontaktmodul ist optisch zu überladen. Die Prio auf WhatsApp und Termin ist schon richtig, aber optisch ist das zu voll.

Hier ein aufgeräumteres Design für dieses Element:

[Design - Kontakt Section - Desktop.png](Design%20-%20Kontakt%20Section%20-%20Desktop.png)
[Design - Kontakt Section - Mobile.png](Design%20-%20Kontakt%20Section%20-%20Mobile.png)

Ist-Zustand: [Ist - Kontakt Desktop.png](Ist%20-%20Kontakt%20Desktop.png), [Ist - Kontakt Smartphone.png](Ist%20-%20Kontakt%20Smartphone.png)

---


Der Footer mit den Impressums-Links sieht echt Kacke aus.

Hier neue Designs für dieses Element:

[Design - Footer Section - Mobile.png](Design%20-%20Footer%20Section%20-%20Mobile.png)
[Design - Footer Section - Desktop.png](Design%20-%20Footer%20Section%20-%20Desktop.png)

Ist-Zustand: [Ist - Footer Mobile.png](Ist%20-%20Footer%20Mobile.png), [Ist - Kontakt und Footer Mobile.png](Ist%20-%20Kontakt%20und%20Footer%20Mobile.png)


## Seite "Termine veröffentlichen"

https://schafe-vorm-fenster-fqo6lhltb-schafe-vorm-fenster.vercel.app/mitmachen

---

Bühne/Foto: Grundsätzlich ist ein solches Foto super. Echt, real. Aber es ist von der Qualität zu schlecht (Kontrast, Licht, Sättigung) und evtl. etwas zu voll.

Hier ein überarbeitetes Foto:
[Design - Mitmachen Hero (Gemini).jpg](Design%20-%20Mitmachen%20Hero%20%28Gemini%29.jpg) — zugeschnitten: [Smartphone](mitmachen-hero-smartphone.webp), [Breit](mitmachen-hero-wide.webp)

---

Didaktisch:

"Warum es heute hakt

Du hast den Flyer sowieso schon gedruckt. Fotografier ihn, schick das Bild per WhatsApp, fertig: Der Termin ist in deinem Ort sichtbar, und in den Orten drumherum gleich mit."

Wir können nicht die Problemfrage stellen und die Lösung erklären.

Was ginge:

Erst kurz und knapp die Lösung vorneweg: "... schick das Bild per WhatsApp, fertig ...".

Und dann erst das Problem:

"Warum es heute hakt"

---

Textlich:

Das ist alles okay, aber klingt irgendwie komisch und nicht natürlich und ein wenig zu werblich.


"Wer euren Termin heute nicht mitbekommt
Die Nachbarn

Im selben Dorf, aber nicht im Verein und nicht in der Gruppe.

Das Nachbardorf

Fünf Kilometer weiter. Die kämen, wenn sie es wüssten.

Die Neuen

Gerade hergezogen, noch in keiner Liste und keinem Kanal."


---

"Die üblichen Wege" muss eigentlich vor "Wer euren Termin heute nicht mitbekommt" kommen, oder? Die Didaktik wirkt hier nicht rund.

---

Design Fehler: CTA "Flyer per WhatsApp schicken" ist weiß auf weiß.

---

Im Modul "Euren Kalender verbinden" sind alle texte ausgepunktet weil sie zu lang sind. Das geht gar nicht. Wir können nicht ein Erklärmodul bauen und die Erklärung nicht lesbar anzeigen.

---

"In Erprobung (Alpha)" hier eicht "In Erprobung"

---

Text: Das kann ja kein Mensch lesen:

"Bitte nachfragen, geht bisher nur für einige Webseiten.

Quellen, die wir schon unterstützen, veröffentlichen kostenlos. Nur die einzelne Anbindung an ein System, das wir noch nicht lesen, ist kostenpflichtig."

---

"Wenn eurem Verein oder eurer Gemeinde ein eigener Kalender auf der eigenen Website vorschwebt statt einer Quelle für den Dorfkalender, ist das ein anderes Angebot: Kalender für eure Website"


Gute Idee hier überzuleiten, aber sprachlich ist das Grütze. "ist das ein anderes Angebot" ... das ist eine interne Erklärung, keine saubere user Kommunikation.

---

## dein-kalender

https://schafe-vorm-fenster-fqo6lhltb-schafe-vorm-fenster.vercel.app/dein-kalender

---


"Warum es heute hakt

Wer euren Termin heute nicht mitbekommt"


Wir haben diese Section doch schonmal in einem Feedback/Review kommentiert und es hat sich nichts geändert. Warum nicht? Oder liege ich falsch. Schaue bitte frühere Reviews hierzu durch.

---

Fehler: Wir zeigen hier auch Testtermine an. Beispiel "Recurring TEST Event Schlatkow". Die müssen wir raus Filtern. Die Filterlogik gibt es bereits in `/Users/jan-henrik.hempel/Projects/community-site`.

---
