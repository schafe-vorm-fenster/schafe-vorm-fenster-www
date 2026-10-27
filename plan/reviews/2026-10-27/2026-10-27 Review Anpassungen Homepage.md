# Review 27.10.2026 – Anpassungen Homepage

Wortlaut des Owners, je Punkt mit dem Issue, das ihn trägt (`pnpm check:reviews`).

## Copyright-Angaben

Bsp.: „Foto: Melkerschule Schlatkow – Jan-Henrik Hempel, CC BY-SA 4.0, über Wikimedia Commons“

Besser wir platzieren ein kleines Copyright Icon (c) auf dem Bild und machen ein Tooltip draus.

Issue: #78

---

## Design

Das Hover der Ortes in der Ortssuche hat zu wenig Kontrast.

![Ortssuche Hover](Ist%20-%20Ortssuche%20Hover.png)

Issue: #79

---

Je nachdem wann ich wie lade oder Geolokalisiere, haben wir ein falsches Ortsbild. Hier ist offensichtlich Schlatkow aktiv, aber nicht das Foto von Schlatkow. Check wie das technisch gebaut ist und wie du das stabil bekommst. Hinterfrage die Software-Architektur an der Stelle. Inhaltlich ist das trivial, du hast das Problem aber nach einigen Korrekturrunden immer noch.

![falsches Ortsfoto](Ist%20-%20falsches%20Ortsfoto.png)

Issue: #80

---

## Links

Der Dorfkalender liegt nicht unter `https://app.schafe-vorm-fenster.de/lehre`. Domain und Slug sind falsch. Slug hat immer die Geoname-ID hinten dran. Das erhalten wir alles aus der Geo-API. Richtig: `https://schafe-vorm-fenster.de/lehre.2879378`

Issue: #81

---

Externe Links, bspw. zum Dorfkalender, müssen immer in target=_blank geöffnet werden! Aktuell verschwindet sonst die Webseite.

Issue: #82

---

## Layout

Warum haben wir hier so viel Weißraum? Fehlen Termine? Dann mehr laden. Oder ist das ein Bug?

![Weißraum 1](Ist%20-%20Weißraum%20Nähe%201.png)
![Weißraum 2](Ist%20-%20Weißraum%20Nähe%202.png)

Issue: #83

---

## Inhalt / Didaktik

> Für dieses Projekt sehe ich unsere Landbevölkerung, aber auch mobile Händler als Gewinner.
> Dr. A. Zschiesche, Bürgermeisterin Groß Kiesow (2022)

Das Zitat ist ja toll, aber warum steht das als Text unter den Terminen? Das ergibt gar keinen Sinn. Vor allem kommt dann ein Zitat als Referenz direkt im folgenden Block.

![Zitat unter Terminen](Ist%20-%20Zitat%20unter%20Terminen.png)

Issue: #84

---

Das Modul „Ein Tag im Dorf – Ein Dienstag im Dorf passt auf kein Plakat.“ ist top. Aber den Link nach oben „Was heute bei dir los ist“ brauchen wir eigentlich nicht.

Issue: #85

---

Warum kommt erst „So funktioniert es“ mit dem Kalender auf den Homescreen, dann „Heute mit einem anderen Anliegen hier?“ und dann wieder „Auf den Homescreen legen“? Das ergibt keinen Sinn. Das erste und dritte Modul gehören zusammen und sind inhaltlich dasselbe.

![Homescreen doppelt](Ist%20-%20Homescreen%20doppelt.png)

Issue: #86
