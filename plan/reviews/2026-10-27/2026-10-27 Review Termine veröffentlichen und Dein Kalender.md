# Review 27.10.2026 – Termine veröffentlichen und Dein Kalender

Wortlaut des Owners, je Punkt mit dem Issue, das ihn trägt (`pnpm check:reviews`).

## Termine veröffentlichen (/mitmachen)

### Fehlende Bilder

Hier fehlen zwei Bilder (rot markiert).

![fehlende Bilder](Ist%20-%20Mitmachen%20fehlende%20Bilder.png)

Issue: #88

---

Hier beim zweiten Bild den Header weglassen. Da der auf weiß steht, sieht das komisch aus.

![WhatsApp Header](Ist%20-%20Mitmachen%20WhatsApp%20Header.png)

Issue: #89

---

### Layout-Fehler

Hier fehlt ein Abstand. Wie ist das Grid gebaut? Wie die Sections? Eigentlich dürfte so etwas nicht passieren, wenn das Layout saubere Blöcke/Sections implementiert hat. Mach ein Architektur-Review über die Frontend-Schichten/Container-Konzeption.

![fehlender Abstand](Ist%20-%20Mitmachen%20fehlender%20Abstand.png)

Issue: #90

---

Das Modul „Wo es wirklich benutzt wird“ ist doch hässlich. Das haben wir doch neu konzipiert und designed, oder etwa nicht?

![Wo es benutzt wird](Ist%20-%20Mitmachen%20Wo%20es%20benutzt%20wird.png)

Issue: #91

---

### Didaktik

„Wenn eurem Verein oder eurer Gemeinde ein ei …“ ist an dieser Stelle irgendwie Quatsch und optisch nicht hübsch. Die Weiterleitung kommt ja auch kurz danach eh unter „Heute mit einem anderen Anliegen hier? …“

![Satz anderes Angebot](Ist%20-%20Mitmachen%20Satz%20anderes%20Angebot.png)

Issue: #92

---

## Dein Kalender (/dein-kalender)

### Didaktik

„Euer Kalender läuft, sobald der Code auf eurer Seite steht.“ sollte besser vor „Heute mit einem anderen Anliegen hier?“ stehen. Sonst geht der Conversion-Zusammenhang verloren.

Issue: #93

---

### Layout / Design

Das Modul „Wer euren Termin heute nicht mitbekommt“ ist hässlich. Das haben wir doch schon mal neu designt oder nicht?

![Vergleich](Ist%20-%20Dein%20Kalender%20Vergleich.png)

Issue: #94

---

Der Embed-Kalender unter „Ein echter Kalender aus drei Nachbardörfern“ braucht sinnvolle Farben/Kontraste. Der ist nicht barrierefrei, also eigentlich nicht mal lesbar.

![Embed Kontrast](Ist%20-%20Dein%20Kalender%20Embed%20Kontrast.png)

Issue: #95

---

Das Modul „Was drinsteht, bestimmt ihr“ sieht nicht gut aus. Warum schwarze und weiße Buttons gemischt? Was ist die inhaltliche Bedeutung? Warum einer in einer neuen Zeile mit einem sinnvollen Pfeil davor?

![Was drinsteht](Ist%20-%20Dein%20Kalender%20Was%20drinsteht.png)

Issue: #96

---

Hier wird es schon wieder hässlich. Das hatten wir doch alles schon mal besser gemacht, oder nicht?

![Wo es benutzt wird](Ist%20-%20Dein%20Kalender%20Wo%20es%20benutzt%20wird.png)

Issue: #91

---

### Datenfehler

In „Ein echter Kalender aus drei Nachbardörfern“ wird ein echter Embed eingebettet. Das ist super. Aber dieser Kalender zeigt Testdaten an, bspw. „Allday TEST Event Schlatkow“. Die werden eigentlich weggefiltert. Das müsste auch schon so sein. Warum hier nicht?

![Testtermin](Ist%20-%20Dein%20Kalender%20Testtermin.png)

Issue: #97

---

Und hier steht „Termine von Verein zur Förderung von Kultur in den Orten Schlatkow, Schmatzin und Wolfradshof e.V.“, was aber den Daten nach nicht stimmt. Hier werden Termine aus der Gemeinde angezeigt. So wie es darüber ja auch korrekt steht: „Das ist der Kalender von Schlatkow, Schmatzin und Wolfradshof. Er zeigt genau das, was dort in den nächsten Wochen ansteht.“

Issue: #98
