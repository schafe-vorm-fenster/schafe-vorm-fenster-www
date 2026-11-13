# Review SVF Preview Website
<https://schafe-vorm-fenster-a9uqou0l7-schafe-vorm-fenster.vercel.app/>

## Meta

Das Favicon sollten wir mit einem größeren Border Radius ausliefern. Es sieht sehr kantig aus, und soll eher wie ein mit Absicht abgerundetes App Icon aussehen.

## Homepage

### Header

Das Logo im Kreis ist super. Aber je nach Hintergrund ist es auch schlecht abgesetzt. Können wir einen dezenten schwarzen Blur dahinter legen - kaum sichtbar aber um den Kontrast zu Hintergrund etwas zu stärken? Super cool wäre es natürlich, einfach an den Stellen wo das Logo und die Buttons (Kalender, Burger Menü) sind, das Foto etwas zu bluten ... geht sowas?

### Hero

Inhaltlich: "Was ist bei dir los?" Ist zwar ein Einstiegsclaim, der gut ist, aber zu "kryptisch" für den user bleibt. Auf Flyer funktioniert der Claim gut, weil direkt darunter eine Abbildung eines Smartphones mit einem Kalender des Dorfes des Lesers ist.

Im Internet haben wir eine breitere Streuung von Einstiegs Usern auf der Homepage. D.h. wir sollten ggf. etwas konkreter einsteigen.
Die früheren Claims wie "Deine digitale Terminliste. Erfahre was wann wo in deinem Ort los ist. Einfach per Smartphone." erklären bereits etwas mehr.

Optisch: Wir haben ein dunkelgrün mit Fade hinter dem Text über dem Bild. 1) Das dunkelgrün sieht etwas dreckig, schlammig, wie Moosablagerungen an Fenstern aus. Für die Fadings benötigen wi einen klarere Farbe. 2) Wir können das Hading etwas transparenter hinter den Text ziehen, oder? Dass der Text noch tatsächlich auf dem Bild liegt und nicht auf dem vollflächigen Hintergrund.

Design-Vorlage: Dazu gibt es einen optimierten Entwurf — [Design – Optimized Hero Gradients and Colors](Design%20-%20Optimized%20Hero%20Gradients%20and%20Colors.png) (Variante 1b "Neutral · transparent"). Er löst genau diese Punkte: neutrales Schwarz statt Dunkelgrün, damit das Foto seine Farben behält, maximal 0,72 Deckkraft, Verlauf in mehreren Stufen, und ein weicher Textschatten für die Lesbarkeit. Die CSS-Gradients stehen im Bild. Das gilt für alle Hero-Bereiche, nicht nur für die Startseite.

Foto: Wir müssen beim Foto auf einen guten Ausschnitt achten. Wenn das Motiv eher vertikal mittig/unten ist und oben viel Himmel (was bei den Ortsfotos oft so ist), dass führt das dazu, dass das Motiv von dem Fade verdeckt wird und die gesamte Optik kaputt aussieht. Wir müssen die Fotos entweder pauschal anders positionieren oder spezifische Ausschnitte erstellen (oder beides).

Funktional: "Suche nach Ortsnamen kommt noch dazu — bis dahin reicht die Postleitzahl." ist Quatsch. 1) Wir haben eine Ortssuche nach Namen, aber keine PLZ Suche. Außerdem ist PLZ auch nicht gewollt - PLZ ist was abstraktes, der eigenen. Ortsname etwas konkretes und emotionales - hier komme ich her und hier lebe ich. Das ist WICHTIG!   Außerdem muss die Ortssuche dann beim Tippen eine Auto-Suggest Ergebnisliste ausgeben, wir Orte (mit in Klammern deren Gemeinde) stehen und die Suche über die Ortsnamen und die Gemeindenamen geht. Diese Liste reicht wenn sie einige Einträge zeigt (3-4?) ud sollte vermutlich ein Overall sein, um Layout Shirts zu verwmeiden. UND: Die Suche braucht eine Geo-Lokalisierung per Button. (Das können wir technisch), dass ein User seinen Standort freigeben kann und wir dann den Ort nach Geo Date suchen.

Foto: Wir sollten ein Foto nehmen, wo mehr von einem Dorf und ggf. Aktivität zu sehen ist. Vielleicht nehmen wir einfach dieses von Schlatkow (da kommen wir her): `/_next/image?url=https%3A%2F%2Fassets.api.schafe-vorm-fenster.de%2Fapi%2Fimage%3FwikimediaCommonsId%3DMelkerschule%2520Schlatkow.jpg&w=1200&q=75` Das ist auf Wikimedia Commons in großer Auflösung verfügbar.

### Terminliste unter dem Hero

Funktional: das ist dann ja geo lokalisiert, richtig? Also wir nehmen initial den Ort, den wir ggf. per Geo Lokalisierung erkannt haben. Und wir tauschen den Inhalt, wenn ein User seinen Ort über die Suche selbst eingegeben hat.

Inhaltlich: Die Terminliste darf hier nicht einfach "nur" die kommenden Termine enthalten. Sie muss eine Auswahl treffen. Für die Flyer in "entre" haben wir eine Logik definiert, wie wir Termine aus einer Liste filtern, die für solche Zwecke eine gute Aussagekraft und eine gute Mischung haben. Diese Logik können wir hier übernehmen.

Conversion: Der erste große CTA ist "Kalender von Xyz" öffnen. Und an sich ist das nicht falsch. Ein User der sich für seinen Ort interessiert, der vielleicht schon Daten auf SvF hat, der soll ja auch als User seinen Kalender ansehen und sich auf den Homescreen legen. Das ist ein Konversion Goal. Aber ist es schlau, die User im allerersten CTA von der Erklärteste "weg zu schicken" oder schicken wir die User direkt so schnell wie möglich dahin wo sie hin wollten? Diskutiere das.

Proof: Frage - Heft die Aussage "8.622 Termine"? Also ja, wir wollen sagen hier ist viel drin. Aber wichtiger ist da dass tatsächlich was relevantes drin ist (Terminlsite oben) oder eben klar zu sehen, dass es auch Lücken gibt - was ja immer so sein wird. Wir könnten den Fall der "fehlenden" Informationen sogar wunderbar als Überleitung zur nächsten Section nutzen - Aktivierung! "Fehlt deine Veranstaltung, jetzt selbst eintragen." Oder so.

### Section "So kommen die Termine rein"

Textlich: "Sie kommen von den Leuten im Ort" klagt so ein wenig nach "die da", "die Leute (die wir nicht kennen". Das muss nahbarer sein. Und wir wissen es ja konkreter. Es sind keine Leute, sondern genau die Menschen, die zusammen mit anderen was organisieren und veranstalten. Meist im Ehrenamt für den Ort. Diese emotionale und menschliche Ebene des Engagements muss hier rein. Wir sprechen in dieser Section ja genau diese "Leute" hier an. Niemand will als "Leute" bezeichnet werden.

Textlich: "meistens so: Ein Foto vom Flyer per WhatsApp, und der Termin steht im Kalender" ist sehr stark, super. Aber warum "und der Termin steht im Kalender?" mit Fragezeichen. Erstens steht er dann drin, Aussage. Außerdem sprechen wir wenn immer möglich in positiven klaren Aussagen. Fragen als Einstieg und Cliffhanger sind gut, aber wenn dann nur Fragen, die direkt an den user gerichtet sind und die wir danach beantworten.

Textlich: "Genau so. Du druckst den Flyer sowieso aus." wirkt überflüssig.

Textlich: "Fotografierst ihn, schickst das Bild per WhatsApp an unsere Nummer, fertig" stark aber noch besser wäre "Foto machen und das Bild per WhatsApp an unsere Nummer, fertig". Klarer. Einfacher, kürzere Wörter.

Textlich: "Der Termin erscheint in deinem Ort und in den Nachbarorten, ohne dass du ihn ein zweites Mal tippst." --> "Dein Termin" - wir haben hier doch einen Veranstalter vor dem Screen. Ansprache! "ohne dass du" ... ist gut, aber wird der Absatz zu lang? Haben wir das nicht schon gesagt. Besser als solche ein Text wäre eine Animation, die das abspielt. Das würde dann den Bereich "Aus dem Flyer geworden" ersetzen bzw. das erklären.

Link zu Slides, die das "Flyer per WhatsApp" ganz gut erklären:
<https://docs.google.com/presentation/d/1I_kbikcNpE0uCyBe0GIh3GTDgBQ6OkGx9bfOVKQzv8A/edit?slide=id.g3f79fafa3d6_0_75#slide=id.g3f79fafa3d6_0_75>
Slides 14 bis 17.

Wir können uns hier `/Users/jan-henrik.hempel/Projects/eventification-dataset` einen guten Flyer raus suchen - ab besten einen den man auch gut als kleines Bild erkennen kann, also wenige Elemente, wenig Text, großer Text, einfaches klares Bildmotiv. Damit es auf der Website gut zu erkennen ist.

CTA/ Konversion: Hier fehlt ein CTA und die Überleitung in den Bereich "Termine veröffentlichen" `/mitmachen`. Und es fehlt eine Hood. WhatsApp ist der kommunikativ stärkste Weg, ja. Aber man kann ja auch einen Kalender anbinden. Für die die viele Termine haben oder Regeltermine nutzen usw. Übrigens: I persönlichen Gesprächen wurde das gut verstanden: Du veranstaltest ab und an was: dann Foto per WhatsApp. Du macht regelmäßig und viele Veranstaltungen zusammen mit anderen, dann passt der Kalender besser. Außerdem geht auch beides gleichzeitig. Das sollten wir hier anreißen - sonst fehlt diese Ansprache komplett auf der Startseite. Und dann gerne mit Weiterleitung zu "mitmachen".

### Section "Und wenn ihr sie selbst zeigen wollt"

Textlich: "Und wenn ihr sie selbst zeigen wollt. Dieselben Termine, nur auf eurer eigenen Seite:". Das ist zu fuzzy, "ihr", "sie" - was denn jetzt? Zu viele Referenzen. Vielleicht ist ein User gerade per Scrolling hier gelandet und hat wenig Kontextwissen. Besser in die Richtung: "Deine Termine auf deiner Webseite" ... "Und trotzdem

Textlich: "Ein eigener Kalender auf der eigenen Website, ohne eigenes System dahinter?" Ja, naja.  "Ein eigener Kalender auf der eigenen Website" hat wieder zu wenig direkten Bezug. Kleider ist ja toll, aber man will keinen Kalender auf der Webseite, mann will seine Veranstaltungen auf der Webseite zeigen. Konkret. Mit Benefit. Nicht abstrakt in Konzepten.

Textlich: "ohne eigenes System dahinter" ist gut und wichtig! Man könnte auch die "Zwei Zeilen einbinden, fertig" oder so erwähnen .

Textlich: "Deine Gemeinde bekommt ihre eigene Auswahl an Terminen, im eigenen Design, unter eigenem Namen" ... "ihre eigene Auswahl an Terminen" ist schwierig zu verstehen. Technisch am Ende stimmt das so, aber zu diesem Zeitpunkt ist es verdammt schwer zu verstehen, dass man nicht nur seine eigenen Termine hier bekommt, sondern auch von anderen Akteuren nach Auswahl. Vielleicht müssen wir aber genau das besser erklären. Ein Beispiel hilft evtl.? Der Kulturkalender für deine Gemeinde: von alle Akteuren im Gemeinde/Amtsgebiet und die Termine zu Kultur und Tourismus und Gemeideleben. Dann wird das bildlicher, was heißt, dass man einen eigenen Zuschnitt an Terminen erhält.

CTA/Conversion: Hier kann man wieder super gut auf die Seite "Dein Kalender" `/dein-kalender` überleiten, wo wir das alles im Detail erklären und auch ein Beispiel ziegen. D.h. wir könnten die Erklärung hier wie oben beschrieben verbessern, aber dann eine Hool setze und auf die "Dein Kalender" Seite überleiten.

Foto: Schwierige Frage. EInserseite ist das gut, das Rathaus steht wie ein Stock Foto für die Zielgruppe hier. Ich will als Region/Organisation den Kalender nutzen. Also für die Zielgruppenansprache okay. Aber wir könnten auch anders herum über die Darstellung der Funktion gehen. Also eine Mischung aus "Schaukasten am Gemeindehaus" (<https://docs.google.com/presentation/d/1I_kbikcNpE0uCyBe0GIh3GTDgBQ6OkGx9bfOVKQzv8A/edit?slide=id.script_slide_05#slide=id.script_slide_05>, Slide 8) und einem echten Kulturkalender (auch mit einer solchen Überschrift) arbeiten. Ehrlich gesagt könnten wir das sogar mit Echtdaten bauen wie oben die Terminliste. Wir könnten aus der Gemeinde zum Ort oben Ales aus den Kategorien zusammensuchen und nehmen. Oder auf ein Standardbeispiel zurückfallen: Ideal wäre als Default hier Wolgast (<https://kultur-wolgast.de/).Denn> zum einen sind die Kunde und machen genau das. Zum anderen können wir dann ein Foto in Wolgast mit Schaukasten und Logo usw. zusammen komponieren.

Design: Das Foto in der beigen Section führt zu einem Rahmen um ein Motiv Layout. Eigentlich braucht man die Section aber nicht und könnte das Bild auch auf die volle breite in 16:9 oder 21:9 ziehen.

### Section "Wo das herkommt"

Textlich: "Wo das herkommt" klingt nicht gut, irgendwie zu platt.

Textlich: "Beides gibt es." - hier haben wir mit "Beides gibt es" eine Referenz, die kein user im Kopf hat. Das "Referenz" Thema hatten wir schonmal. Da müssen wir eine Guideline für die Texterstellung definieren, dass wir besser werden in "Self Containing Sections" die natürlich in der Reihenfolge und Dramaturgie aufeinander aufbauen, aber nicht referenzieren.

Textlich: "weil jemand das Problem selbst hatte" ist stark. Das ist real. Es ist verstanden. Das gibt Social Proof - und stimmt ja auch.

Inhaltlich "Wer steckt eigentlich dahinter? ..." Ja, ich war Bürgermeister. Ich bin aber auch immer noch Gemeindevertreter (ist aber evtl. zu lang?) und habe auch unseren Kulturverein mitbegründet und bin da Mitglied. Hier haben wir eine Herausforderung: Wir können hier kein Lebenslauf schreiben - das ist zu lang und will keiner im Detail wissen. Aber es ist wichtig, die breite aufzumachen. Bürgermeister ist nett, aber nur eine Perspektive und der Kulturverein ist ggf. sogar die wichtigere. Beides muss auftauchen, damit es glaubwürdig ist, dass ich nicht "nur einmal Bürgermsuter war" - oh da kramt er sein eines Ehrenamt heraus um uns zu zeigen wie toll er ist, sondern das auf der langen Linie und in der Breite glaubwürdig ist. Und das stimmt ja auch. "Er kennt die Verwaltung, der der Dienst hilft, von innen." Ist hier gefährlich. Das stimmt, aber eigentlich geht es nicht darum "Verwaltung" zu kennen", sondern das Ehrenamt auf dem Dorf zu kennen. Das ist viel relevanter.

Inhaltlich Ergänzen: Man könnte natürlich irgendein Statement hier unterbringen wie "Unsere Orte selbst gestalten" also in die Richtung, dass das Machen und Mitmachen und Anpacken und gemeinsame Gestalten vor Ort einen Riesen Wert hat, uns keiner wegnehmen aber auch nicht abnähen kann, uns alle als Einwohner in einem Dorf aber auch als Gesellschaft zusammen hält.

Textlich "Der Name der Firma" -> "Der Name" Schafe vorm Fenster wäre besser. Firma kann weg, aber der Name ist wieder eine Referenz - besser einmal hinschreiben.

CTA/Conversion: Hier haben wir nun einen Link "Mehr über uns". Auch okay. Aber wir könnten auch progressiver sein und hier direkt auf die Terminvereinbarung hinarbeiten. "Machen einen Video Termin" oder so. Wenn wir dann auf `/ueber-uns` linken, müssen wir nur aufpassen, dass der Funnel passt und man dann nicht wieder offener im Content landet.

CTA Design: Warum ein Link? Wenn wir auch die Termin vereinbaren Konversion gehen, kann das auch ein Button sein.

### Section "Wer das schon macht"

Textlich: "Wer das schon macht" ist zu flapsig. Locker und umgangssprachlich ist schon okay, aber nicht so platt und banal.

Design: Wir gehen hier ja in die Richtung Proof aus "media echo". Das ist auch gut so. Aber das sollte gestalterisch auch erkennbar sein. Hier haben wir quasi nicht "unseren" Inhalt, sonder Inhalt den andere "über uns" schreiben. Vielleicht nicht ganz trennscharf, aber das ist die Idee der Section. Vielleicht müssen wir wie bei "Stiftung Lebendiges Lehre" angerissen, ins Art Artikel Optik hier einbauen, die sich mit Boxen aber auch der Schriftart von unseren Inhalten abhebt.

Inhaltlich und Textlich:

Stiftung Lebendiges Lehre: Aufpassen. Die "Stiftung Lebendiges Lehre" verantwortet das Lebender Kalenderprojekt. Nicht die Gemeinde. Die Gemeinde ist ja auch immer kommunales Organ und findet das in Lehre gut, hat aber nichts damit zu tun. Wir müssen den Akteuren die was machen hier ihre Wertschätzung kommunizieren. Es sind aber 17 Ort in und um die Gemeinde Lehre.

NØRD Award 2026: Fokussieren. Wir haben hier immer eine Aussage zu treffen. Social Proof. Wir geben hier keinen Faktenbereicht sondern eine Überzeugungsaussage ab. Das müssen wir ggf. in de Inhaltregeln fest verankern. Zum Inhalt: 1) wir haben den Award gewonnen! Klar so sagen, sonst denkt man wir haben nur teilgenommen. Schirmherrschaft Bitkom, Übergeben von der Lettischen Botschafterin usw. kann man schon nennen. "Dicke Hose" ist beim Proof Content wichtig.

"Nordkurier · Vorpommern-Greifswald" Ein Zeitungsartikel ist nett, wenn er aber einen Inhalt widergibt, den wir mit dem Award Gewinn viel hochwertiger kommunizieren können, dass ist der Proof-Wert hier zu gering und der sollte lieber raus.

Volkshochschule Uecker-Randow · Pasewalk: Finde ich gut. Es ist aber die "Volkshochschulen in Vorpommern-Greifswald". Relevant ist auch der gewünschte Benefit: Sie wollen ihre Kursangebote nicht nur in den Städten sondern auch in den Dörfern kommunizieren und da sind die Angebote ja genauso relevant. Außerdem wollen sie auch mehr Kurse in den Dörfern vor Ort anbieten.

Presse- und Auftrittshistorie 2018 bis 2026: Das ist ja eine Meta-Erklärung für uns intern. Sowas darreicht auf der Webseite stehen. Wir könnten ggf. noch einen weiteren Proof ergänzen ? Gut wäre, wenn wir mischen: Erfolg vor Ort (Lebendiges Lehre), Erfolg auf Wettbewerben (NOERD Award), Erfolg für Kunden (Wolgaster Kulturgesellschaft", Erfolg mit Partnern (Kulturlandbüro).

Design: Das Zitat- und Quellen-Design müssen wir generell hübscher machen — siehe `/ueber-uns`, Abschnitt "Zitate und Belege". Es gilt überall dort, wo ein Zitat mit Quellenangabe steht.

### Section "Heute mit einem anderen Anliegen hier?"

Ich weiß wo das herkommt. Wir wollen die Quernavigation in den anderen Bereichen öffnen. Das ist auch gut und richtig so. Aber mit der halben Zeile und den drei Links erreichen wir das nicht gut.

Wie wäre es:

- wenn wir optisch / i Design das eher wie ein Menü, ggf. mit Burger Menü Icon und Zeilen untereinander mit Rahmen (nur eine Idee von mir) klarer machen, dass es hier um ein Navigationselement geht. Dann versteht das der.
- und wenn wir dann zu jedem Link einen Halbsatz schreiben, der Zielgruppe und Inhalt (beides zusammen) aufgreift. Wie "Wie du einfach Termine per WhatsApp oder Kalender veröffentlichen kannst" ... also ggf. als Frage, und dann dazu den Link.

Textlich: "Warum wir" ist schwierig. Defacto ist es "Über uns" und inhaltlich eher "Ah das kommt vom Dorf, da kennt jemand die Situation ganz genau, cool, die wissen echt wie das auf dem Dorf läuft." Da brauchen wir ein anderes Wording.

### Section "Dann schau nach, was bei dir los ist."

Design: Die Suchmaske weiß auf weiß funktioniert nicht. Und oben haben wir dieselbe Funktion auf dunkelgrün. Wenn hier unten nochmal mit dem Dorfkalender und der Ortssuche abbinden, dann optisch analog zum Hero mit derselben Funktion.

Inhaltlich: Vielleicht kann man diese Section auch weglassen und damit den Fokus der Seite schärfen? Immerhin haben wir das Element ja im Hero schon auf dieser Seite.

### Section "Neuigkeiten aus dem Projekt"

Section Finde ich gut.

Textlich "Neuigkeiten aus dem Projekt" hat zu wenig Benefit Kommunikation. Was für Neuigkeiten? Was hab ich als Abonnent davon? Wir können hier konkreter werden: neue Produkt Funktionen, aktuelle Angebote, Geschichten wie andere Orte und Akteure es machen ...

### Section "Kontakt"

Funktional: Wir machen KEIN allgemeines und unterrichtetes Kontaktformular. Weg damit.

Inhaltlich: Wenn Kontakt dass konkret und direkt! Man kann: 1) einen Videotermin mit mir buchen, wenn man konkrete Fragen hat 2) man kann mir per WhatsApp direkt schreiben 3) man kann auch anrufen oder eine Mail schreiben. Das reicht ja wohl. Wir können auch ein Avatar-Foto einbauen - das schafft Nähe und Vertrauen.

Technisch: die Kontakt Section muss zentral und wiederverwendbar sein (damit wir die nur einmal technisch haben und sie überall konsistente bleibt bei Änderungen).

Design-Vorlage: Dafür gibt es einen Entwurf — [Design – Kontakt-Section](Design%20-%20Kontakt%20Section.png). Er setzt genau das um: kein Formular, sondern "Videotermin buchen" als erster Button, "Per WhatsApp schreiben" als zweiter, darunter Telefonnummer und Mailadresse als schlichte Zeilen, und links oben das Porträt für Nähe und Vertrauen. Das Porträtfoto fehlt noch, im Entwurf steht ein Platzhalter.

Entscheidung (Jan, 2026-09-23): Es gibt **eine** Kontakt-Section, nicht zwei. Ein Inhalt bekommt eine Farbe — der helle Lime-Grund. Der Grund ist auf den Seiten sonst ein Rhythmus-Mittel; die Kontakt-Section ist die Ausnahme und bleibt überall gleich, damit sie wiedererkennbar ist. Eine Zielgruppenansprache läuft, wenn nötig, über einen Kicker und den Text, nicht über die Farbe.


### Footer

Design: Den Impressums-Footer optisch abheben- das sieht so komisch aus.

Design/CTA: Den Sprach Switch finde ich gut und sinnvoll. Aber könnten wir dazu näher an den user. Beispiel: "Read this page in Englisch:" oder so, also abholen und überleiten. Es stellt sich auch die Frage ob die aktuelle Sprache als Button da stehen muss. Ist ja eigentlich unnütze.

## Seite `/dein-kalender`

### Hero

Foto: Wir haben hier eine spezifischere Motiauswahl. Evtl. ist das auch schon so definiert, weil schon ein Gemeindehaus zu sehen ist. Aber es ist sinnvoll hier eher Kulturhäuser, Gemeindehäuser, Veranstaltungsorte zu zeigen, als einfache Dorffotos.

Design: Die Button haben (Smartphone) vertikal keinen Abstand.

Design: Der Hero-Verlauf hat dasselbe Problem wie auf der Startseite — das ist aber gelöst. Der Entwurf [Design – Optimized Hero Gradients and Colors](Design%20-%20Optimized%20Hero%20Gradients%20and%20Colors.png) ist genau an diesem Hero abgebildet und zeigt auch die beiden CTAs: "Kalender bestellen" als kräftig gefüllter Button, darunter mit Abstand "Beratungstermin buchen" als heller Button mit Außenlink-Icon. Damit ist auch der fehlende vertikale Abstand auf dem Smartphone erledigt.

CTA/Conversion: Wir haben zwei Buttons. Das ist schwierig — zwei CTAs sind eigentlich schlecht, und das müssen wir lösen. Andererseits ist "Beratungstermin buchen" gut und "Kalender bestellen" auch gut, bei bestellen vs. beraten ist es also vielleicht sinnvoll. Designtechnisch haben wir dafür schon etwas (siehe Entwurf oben).

Funktional/Technisch: Ja, die Terminbuchung geht extern über Google und wir wollen direkte Conversions. Aber evtl. wäre es sinnvoll, auf eine Kontakt Seite oder Section zu verweisen, wo das Google Formular eingebettet ist (wegen Datenschutz ggf. auch angeknipst werden kann). Und dazu aber auch WhatsApp, Telefon, Mail stehen mit dem Foto. Der CTA könnte dann da hin leiten und die Leute können sich überlegen ob sie per Google buchen oder auf einem anderen Weg. Und wir hätte nicht in dem Hero CTA einen externen Link und auch keine Anmerkung zu Google.

Design-Vorlage: Die Kontakt-Section dafür ist entworfen — [Design – Kontakt-Section](Design%20-%20Kontakt%20Section.png) (siehe Startseite, Section "Kontakt").

Textlich: "Euer Kalender, eure Website, euer Name. Niemand im Amt tippt mehr Termine ein."
Das kann weg: "euer Name" - eigentlich bekommt a ja auch niemand einen Namen. Wenn erhalten sie eben einen White Label Kalender. "Niemand im Amt" ist schwierig, weil es nicht nur um Ämter geht. Es gibt ja auch Stiftungen usw. Vielleicht reicht ja "Niemand tippt mehr Termine." Kurz. Prägnant. Alles was offen bleibt, wird ja auf der Seite erklärt.

Textlich: Besser wäre in Richtung "Euer Kalender auf eurer Webseite." — das trifft es. Und "im Amt" weglassen, es geht ja auch um Vereine und andere Akteure.

### Section "Warum es heute hakt"

Didaktisch: "Warum es heute hakt" ist ggf. zu früh oder zu direkt rein. "Was hakt" denn heute? Worum geht es nochmal? Es geht darum Termine zu veröffentlichen, aber auch Termine einfach zu erfassen, schneller zu verteilen, auch von anderen Akteueren mit einzubeziehen. Letzteres - also andere einbeziehen - ist sogar der wesentliche USP! Das kann kein anderer außer über  blöde Formulare.

Textlich: "und mit dem Produkt" ist Ziemlich blöde. Jetzt haben wir natürlich ein Problem. Unser Produkt heißt "Portale" und der Name ist im deutschen Ehrenamtsraum evtl. gar nicht so gut zu kommunizieren. Aber an sich wäre es sinnvoll hier ein Produkt klar zu benennen.  Brauchen wir einen besseren Produktnamen?

Design: Die Gegenüberstellung auf Smartphone ist untereinander und funktioniert optisch nicht. Vielleicht was mit Farben? Icons? Besser auf jede Fall.

Design-Vorlage: Für die Gegenüberstellung gibt es einen Entwurf — [Design – Heute und mit dem Produkt](Design%20-%203-Schritte-erkl%C3%A4ren%20Bildschirmfoto%202026-09-23%20um%2011.10.34.png). Die Paare stehen dort als beschriftete Zeilen untereinander ("HEUTE:" gegen "MIT DEM PRODUKT:"), jedes Paar durch eine Linie getrennt, und die Aussagen sind konkreter formuliert als bisher.

Design-Vorlage: Dazu gibt es einen Entwurf — [Design – wo es hakt](Design%20-%20wo%20es%20hakt.png) (Variante 2b "Angestaubt · Sepia"). Er beantwortet die didaktische Frage von oben, indem er den Kicker "Warum es heute hakt" mit der Headline "Wer euren Termin heute nicht mitbekommt" auflöst und drei konkrete Personen zeigt — die Nachbarn, das Nachbardorf, die Neuen — statt abstrakt zu bleiben. Die alten Wege stehen darunter abgesetzt im Sepia-Ton. Aktuell sieht die Section nicht gut aus — wir orientieren uns hier am Sepia-Design von `/mitmachen`.

### Section "So funktioniert es" — "So sieht das aus, wenn es bei euch steht"

Textlich: "So sieht es aus, wenn es bei euch steht" finde ich gut.

Inhaltlich: Die Einbettung an sich ist super.

Funktional/Technisch: Wir müssen sicherstellen, dass der eingebettete Portalize-Kalender einen sinnvollen Ort mit sinnvollen Daten zeigt. Aktuell ist das Quatsch. Das ist aber eher ein Thema der Portalize-Konfiguration als eines der Website.

Inhaltlich: "Ein echter Kalender aus drei Nachbardörfern" — okay, könnte man machen. Wir könnten beim jetzigen Beispiel bleiben, das finde ich auch gut, oder auf einen Kalender in der Umgebung gehen, zum Beispiel Wolgast. Vielleicht bleiben wir aber auch dabei.

Textlich: Konkreter wäre: "Das ist der Kalender von [Ort]. Er zeigt genau das, was dort in den nächsten Wochen ansteht." (Der Ortsname ist im Diktat nicht eindeutig.)

Textlich: "Auf eurer Webseite sieht er genauso aus" — da müssen wir aufpassen. Besser: "Auf eurer Website passt sich das Design genau an eure Webseite an. Hier ein Beispiel."

Textlich: "Gefüllt aus dem Dorfkalender, ohne dass jemand bei euch etwas abtippt." ist gut. Dass er mit zwei Zeilen in eure Webseite eingebunden wird, können wir hier nochmal erwähnen.

### Section "Was drinsteht, bestimmt ihr"

Textlich: "Warum das zählt" klingt komisch. Besser in Richtung "Warum ist das wichtig?", "Was hilft euch das?" oder "Was sind die Vorteile?" — insgesamt etwas softer formulieren.

Textlich: "Was drinsteht, bestimmt ihr" finde ich gut.

Textlich: "Über die Einstellungen legt ihr fest, welche Orte, welcher Verein und welche Kategorien" — das "und wie weit nach vorn" kann weg.

Textlich: "Schriften und Farben kommen aus eurer Webseite, nicht von uns. Der Kalender übernimmt, was bei euch schon eingestellt ist." Einfacher: "Der Kalender übernimmt einfach euer Design und passt sich an." Fertig. Und dazu: Wer will, kann als Profi Details im Design selbst konfigurieren — es geht aber auch ohne.

Inhaltlich: Hier gehören die eigentlichen Benefits hin. Die Termine kommen aus allen Kanälen, so wie sie reinkommen — aus einem Kalender oder per WhatsApp. Ihr könnt also auch Termine von verschiedenen Akteuren anzeigen, die sie einfach per WhatsApp geschickt haben, und sie landen trotzdem auf eurer Webseite.

Design: Die Konfiguration in Schritten darzustellen finde ich gut. Aber das Hellgrau-Grün wirkt negativ und angestaubt — das ist der Look für die alte Welt, nicht für das, was geht. Hier brauchen wir etwas Frisches.

Textlich: Die Überschrift darüber vielleicht nochmal schärfen: "Was ihr konfigurieren könnt" oder "Ihr könnt selbst bestimmen:".

Inhaltlich: Zu jeder Einstellung gehört ein Satz, warum sie relevant ist — am besten mit Beispiel:

- **Orte:** Hier zum Beispiel, welche Orte. Es können aber auch Gemeinden oder Umkreise konfiguriert werden. Beispiel: Ihr seid die Kulturgesellschaft einer Stadt, dann definiert ihr das Verwaltungsgebiet der Stadt oder das Amtsgebiet — aus Nachbarorten, die nicht dazugehören, taucht dann nichts mehr auf.
- **Veranstalter:** Ihr könnt selbst bestimmen, welche Veranstalter bei euch erscheinen und welche nicht. Beispiel: Ihr seid eine Stiftung, die die Akteure der eigenen Förderprogramme oder aus dem eigenen Netzwerk unterstützt, aber eben keine anderen — dann legt ihr genau eure Partner und Förderorganisationen fest, und nur die erscheinen.
- **Kategorien:** Ein Kulturkalender will vielleicht nur Kultur und Tourismus, eventuell noch Bildung und Gesundheit, aber keine Versorgung. Ein Gemeindekalender will vielleicht alles.
- **Zeitraum:** Müssen wir bei Portalize nachsehen, was wirklich geht.
- **Darstellung:** Der Satz klingt komisch. Gemeint ist: Es passt sich an eure Webseite an, kein Schafe-vorm-Fenster-Logo — euer Kalender auf eurer Webseite.
- **Aktualisierung:** Bei jedem Seitenaufruf, also immer aktuell. Damit alles schnell geht, speichern wir ein paar Minuten zwischen.

Technisch: Was alles konfiguriert werden kann, steht technisch in der Portalize-Config fest — auch bei den Orten. Dafür gibt es ein Repo, das verlinken wir hier.

Design-Vorlage: Die Section ist entworfen, in zwei Teilen — [Design – Portalize-Einstellungen, oberer Teil](Design%20-.%20Portalize%20Einstellungen%201.png) · [Design – Portalize-Einstellungen, unterer Teil](Design%20-.%20Portalize%20Einstellungen%202.png). Der Entwurf nimmt die Punkte von hier auf: Kicker "Was hilft euch das?" statt "Warum das zählt", Überschrift "Was drinsteht, bestimmt ihr", darunter das Benefit-Band auf frischem Lime — WhatsApp, Google Kalender, Vereinswebsite → eure Website, mit dem Satz "Auch Termine von Vereinen, die ihren Flyer einfach per WhatsApp geschickt haben." Dann "Ihr könnt selbst bestimmen:" mit den sechs Einstellungen, jede mit Kernsatz, Beispiel und Chips (durchgestrichen, was rausfällt), und der Link "Alle Einstellungen im Detail" auf die Portalize-Config. Der Zeitraum ist als "wird geprüft" markiert, bis wir bei Portalize nachgesehen haben.

Textlich: Im Benefit-Band steht "Im Amt tippt dafür niemand etwas ab." — das "im Amt" fällt unter dieselbe Kritik wie im Hero (es geht nicht nur um Ämter). Beim Umsetzen anpassen.

### Section "Was es kostet"

Inhaltlich: Die Section ist super. Vielleicht müssen wir sie stärker hervorheben — "Wie es geht" eher grün oder weiß, und "Was es kostet" dann klarer herausgestellt.

Design: Die Preis-Section sieht nicht gut aus. Die schicken wir nochmal zum Designer.

Design-Vorlage: Der Entwurf liegt vor, in zwei Teilen — [Design – Preis-Section, oberer Teil](Design%20-%20Preis%20Section%201.png) · [Design – Preis-Section, unterer Teil](Design%20-%20Preis%20Section%202.png). Er löst die Punkte von hier: grünes Kopfband mit dem Kicker "Was es kostet" und der Überschrift "Drei Wege zu eurem Kalender" ("Der Preis hängt nur davon ab, wo der Kalender stehen soll."), drei klar getrennte Stufen mit Kicker, Preis, drei Häkchen und je einem eigenen CTA. "Kalender bestellen" ist der kräftige pinke Button, die Region-Stufe ("Anfrage — nach Größe") hat mit "Beratungstermin buchen" den geforderten CTA, und direkt darunter folgt die Kontakt-Section mit dem Kicker "Fragen zu den Preisen".

Offen dazu: Im Entwurf steht der kostenfreie Dorfkalender als **erste** Stufe. Oben steht, dass er, wenn überhaupt, nach unten gehört. Das müssen wir noch entscheiden — für die erste Position spricht, dass die Seite so mit etwas Kostenlosem öffnet; dagegen, dass die bezahlte Stufe das Ziel der Seite ist und zuerst gesehen werden sollte.

Inhaltlich: "Einige Dorfkalender kostenfrei" — ich weiß nicht, ob das hier rein muss. Wenn, dann auf jeden Fall nach unten schieben.

Textlich: "Euer Kalender auf eurer Webseite kostet 480 Euro pro Jahr, zzgl. Umsatzsteuer."

CTA/Conversion: "Für eine ganze Region, zum Beispiel einen Landkreis, auf Anfrage" finde ich gut — aber auch da gehört ein CTA-Button rein.

CTA Design: "Kalender bestellen" ist super als Button, muss aber ein kräftiger pinker Button sein, kein blasser.

CTA/Conversion: Für "auf Anfrage" entweder auf die Kontakt-Section linken, die wir schon definiert haben, oder besser "Beratungstermin buchen" als CTA-Button — wir wollen ja direkten Kontakt. Darunter klein die Kontaktmöglichkeiten: E-Mail, Telefon, WhatsApp. Also die Kontakt-Section.

Design-Vorlage: Genau diese Kontakt-Section ist entworfen — [Design – Kontakt-Section](Design%20-%20Kontakt%20Section.png). Sie sieht überall gleich aus (Entscheidung vom 2026-09-23).

Inhaltlich: Und erst danach der Dorfkalender: Der Dorfkalender für einen Ort ist immer kostenfrei, und Termine veröffentlichen ist auch kostenfrei.

### Section "Wer das schon macht" (Trust und Proof)

Inhaltlich: Die Section ist okay. Bei den Trust- und Proof-Sections müssen wir ein bisschen darauf achten, dass wir die Belege auf allen Seiten mischen und nicht identisch formulieren.

## Seite `/mitmachen`

### Hero

Inhaltlich: "Mitmachen" als Slug und Thema ist gut.

Foto: Dasselbe Problem wie auf der Startseite — das Bild ist in der Auswahl zu düster und zu traurig.

Design: Logo und Kalender-Button heben sich im Kontrast nicht genügend ab, obwohl das Transparent-Overlay an sich richtig gut ist. Da fehlt ein Blur (siehe Header auf der Startseite). Der dunkelgrüne Verlauf verdeckt auch hier das Motiv und wirkt dreckig, schlammig. Das muss anders werden — Lösung siehe [Design-Vorschlag Hero](Design%20-%20Optimized%20Hero%20Gradients%20and%20Colors.png).

Textlich: "Ein Foto vom Flyer per WhatsApp, und der Termin steht im Kalender?" — inhaltlich okay, textlich etwas zu lang. Lieber zwei Sätze, und als Aussage statt mit Fragezeichen.

CTA/Conversion: "Kostenlos anmelden" könnte noch konkreter werden: "Jetzt kostenlos anmelden".

### Section "Warum es hakt"

Textlich: "Warum es hakt" ist von der Wortwahl ungünstig — dasselbe Thema wie auf `/dein-kalender`. Wir haben außerdem eine Wording-Regel, dass wir primär positiv und konstruktiv die Lösung kommunizieren. Wenn wir auf Probleme eingehen, dürfen wir klar sagen, was nicht funktioniert — aber in einem Section-Titel muss erst einmal stehen, was geht.

Inhaltlich: Was wollen wir mit "Mitmachen" eigentlich sagen? Die Kernidee von Schafe vorm Fenster ist: du bist Akteur. Du kannst deinen Termin ohne Gatekeeper — ohne Zeitungsredaktion, ohne Gemeinde — online stellen, und zwar so einfach wie möglich. Das Synonym für "einfach" ist "Foto per WhatsApp", die erweiterte Lesart ist "ich binde einen Kalender an". Das muss im ersten Absatz sofort rauskommen.

Textlich: Der Intro-Text ist gar nicht so schlecht. "Du hast den Flyer sowieso schon gedruckt, fotografier ihn, schick das Bild per WhatsApp." funktioniert, "Fertig." ebenfalls, und "Der Termin ist an dem Ort sichtbar und in den Orten drumherum gleich mit." auch.

### Subsection "Warum das, was ihr heute macht, nicht überall ankommt"

Textlich: Inhaltlich okay, aber "warum das, was ihr heute macht" ist viel zu unklar. Fachlich geht es um mangelnde Reichweite beziehungsweise um zu viel Aufwand für Reichweite. Konkret geht es immer um Veranstaltungen und Termine, nicht um "was ihr macht".

Inhaltlich: "Nicht überall ankommt" heißt konkret: die Nachbarn, die Einwohner der Nachbargemeinden und die neu Zugezogenen bekommen es nicht mit. Das sind reale Menschen mit realen Rollen — da müssen wir plastischer und konkreter werden.

Regel: Daraus sollten wir eine Content-Regel ableiten — nicht allgemein, sondern konkret.

Inhaltlich (die drei Punkte):

- "Flyer und Aushänge enden an der Ortsgrenze und werden oft gar nicht verteilt, wenn niemand die Zeit dafür hat." — real, finde ich gut.
- Zeitung und Amtsblatt: Redaktionsschluss stimmt, aber es gibt eben auch eine Redaktion, die nicht immer alles schreibt. Es kann also auch sein, dass die Sachen gar nicht geschrieben werden. Das müssen wir auf jeden Fall ergänzen.
- "Die eigene Vereinswebseite" → besser "die eigene Webseite", es sind ja nicht nur Vereine. Und: Social-Media-Kanäle erreichen vor allem die, die euch schon gut kennen. Dazu kann man ruhig sagen, dass das auch gut so ist und man das weitermachen soll — nur die, die einen noch nicht kennen, erreicht man damit eben nicht. Neben Social Media sollten wir auch WhatsApp-Kanäle und -Gruppen erwähnen, die werden sehr viel genutzt und sind sehr greifbar.

Design: Optisch haben wir drei Punkte mit X. Das Icon mit dem X ist gar nicht so schlecht, die Frage ist, ob wir so negativ kommunizieren wollen — andererseits sind das genau die realen Probleme. Idee: nicht schwarzer Text auf Weiß mit rotem Icon, sondern das Fehlschlagende blassgrau, angestaubt, in einem Sepia-Look — "das ist die alte Welt, die ist ein bisschen angestaubt und funktioniert nicht mehr so gut". Das sollten wir noch einmal mit dem Designer klären.

Design-Vorlage: Genau das ist entworfen — [Design – wo es hakt](Design%20-%20wo%20es%20hakt.png) (Variante 2b "Angestaubt · Sepia"): die üblichen Wege in Sepia auf eigenem Grund, mit Icons statt roter Kreuze, darüber die drei konkreten Personen, die den Termin heute nicht mitbekommen. Die oben geforderten Ergänzungen sind darin schon enthalten — die Redaktion, die nicht alles druckt, "eigene Website" statt "Vereinswebseite", die WhatsApp-Gruppe neben Instagram, und der Satz "Das ist gut so, macht weiter."

Textlich (Abschlusssatz der Section): "Wer das ehrenamtlich organisiert, hat neben der Organisation keine Zeit mehr fürs Bewerben und schon gar nicht für ein neues Werkzeug." Inhaltlich richtig und gut — man müsste es fast als Claim größer herausstellen, größer als die Dinge, die nicht funktionieren. Aber: "Wer" und "das" können weg; "organisiert" und "Organisation" ist eine Wortdoppelung. Einfacher, kürzer, prägnanter, auf den Punkt.

Inhaltlich: "Und schon gar kein neues Werkzeug" ist gefährlich, weil wir selbst ein neues Werkzeug sind. Der wichtigere Punkt ist ein anderer: Man will nicht alles mehrfach machen — den Termin auf die Webseite stellen, in Social Media posten, zu Schafe vorm Fenster geben, in den Kalender eintragen und dann auch noch ans Amtsblatt schicken. Am liebsten würde man ihn einmal per WhatsApp rausschicken, und gut.

### Section "So funktioniert es"

Textlich: "So funktioniert es" geht. Die Frage ist, ob wir danach klarer werden — "So funktioniert es besser" oder "So geht es einfacher für euch", also mit mehr Ansprache und ein bisschen direkter.

Textlich: "Deshalb gibt es drei Wege rein, und alle drei sind Wege, die ihr schon geht." ist ein zu komplizierter Satz. "Drei Wege" finde ich gut, dass es drei einfache Wege sind, ist gut, und dass es Sachen sind, die sie sowieso schon nutzen, ist auch gut. Eher: "die ihr eh schon benutzt", "die ihr schon verwendet", "Dinge, die nicht neu für euch sind".

Textlich: "So kommen eure Termine rein" als Zwischenüberschrift finde ich gut.

### Die drei Wege — Weg 01 "Flyer per WhatsApp"

Inhaltlich: Super, und richtig, dass das der erste Weg ist.

Design: Die "01" wirkt optisch ein bisschen klein, die muss vielleicht größer sein. Und wenn wir oben die roten Kreuze haben, müssten wir hier eigentlich grüne Haken haben — oder wie in der zweiten Section auf Grün setzen. Das sollte sich noch einmal ein Designer ansehen.

Foto: Das Foto ist Quatsch. Hier sollten wir — wie auch schon auf der Startseite — "Foto per WhatsApp" illustrieren: eine Hand mit einem Handy macht ein Foto von einem Flyer, der auf dem Tisch liegt, und schickt es per WhatsApp an unsere Nummer. Dazu können wir auch einen Chat-Screenshot einbauen.

Design: Am einfachsten wäre vermutlich eine Slide-Animation, die automatisch durchsliced — auf dem ersten Screen zum Beispiel ein quadratisches Foto von der Hand mit dem Handy, schon angeschnitten, damit man sieht, dass es weitergeht. Die Untergliederung 1, 2, 3 könnte man parallel dazu mit-highlighten: 1) Fotografieren, 2) über den Teilen-Button auf dem Handy in den WhatsApp-Chat schicken, 3) Termin erscheint im Kalender deines Ortes.

Technisch: So eine Animation sollten wir mit Content und Technik als eigene, wiederverwendbare Erklärkomponente ausprägen. Ich könnte mir sogar vorstellen, dass wir dieselbe Komponente auf der Startseite verwenden — das schadet nicht.

Design-Vorlage: Der Weg ist als Erklärmodul mit drei Zuständen entworfen — [Schritt 1: Flyer fotografieren](Design%20-%203-Schritte-erkl%C3%A4ren%20Bildschirmfoto%202026-09-23%20um%2011.20.03.png) · [Schritt 2: per WhatsApp schicken](Design%20-%203-Schritte-erkl%C3%A4ren%20Bildschirmfoto%202026-09-23%20um%2011.19.52.png) · [Schritt 3: Termin steht im Kalender](Design%20-%203-Schritte-erkl%C3%A4ren%20Bildschirmfoto%202026-09-23%20um%2011.19.59.png). Die Grafik wandert seitlich durch, der aktive Schritt wird in der Liste darunter grün hervorgehoben, das nächste Bild ist angeschnitten sichtbar. Der geforderte CTA steht darunter: "Flyer per WhatsApp schicken". Kicker "SO GEHT'S EINFACHER", Überschrift "So kommen eure Termine rein", Unterzeile "Drei Wege. Alle nutzt ihr eh schon." — damit sind auch die Textpunkte von oben aufgelöst.

### Die drei Wege — Weg 02 "Euren eigenen Kalender verbinden"

Inhaltlich: Finde ich gut.

Inhaltlich: Die Reihenfolge der Schritte sollten wir tauschen — 1 und 2 vertauschen: 1) Tragt den Termin einfach wie gewohnt in euren eigenen Google-Kalender ein. 2) Kalender einmalig — das "einmalig" ist wichtig — bei Schafe vorm Fenster anmelden. 3) Neue Termine, Änderungen, Verschiebungen und Absagen passieren dann automatisch und erscheinen automatisch online.

Design: Auch hier ein Erklärmodul mit Bildern darüber: die Google-Kalender-App, am besten auf dem Handy, in der man den Termin einträgt; dann die Anmeldung — vielleicht ein Bild, dessen linke Hälfte schräg abgegrenzt die Kalendereinstellungen in Google Kalender zeigt und rechts darunter die Anmeldeseite, mit Pfeilen dazwischen; und drittens die Kalenderansicht mit dem Termin.

Design-Vorlage: Genau so ist es entworfen — [Schritt 1: Termin wie gewohnt eintragen](Design%20-%203-Schritte-erkl%C3%A4ren%20Bildschirmfoto%202026-09-23%20um%2011.20.35.png) · [Schritt 2: Kalender einmalig anmelden](Design%20-%203-Schritte-erkl%C3%A4ren%20Bildschirmfoto%202026-09-23%20um%2011.20.28.png) · [Schritt 3: der Rest läuft automatisch](Design%20-%203-Schritte-erkl%C3%A4ren%20Bildschirmfoto%202026-09-23%20um%2011.20.32.png). Die getauschte Reihenfolge ist darin schon umgesetzt, Schritt 3 zeigt die Änderungen als Marker im Kalender ("Verschoben", "Abgesagt"), und der CTA lautet "Jetzt Kalender anmelden".

### Die drei Wege — Weg 03 "Eure Webseite als Quelle"

Inhaltlich: Finde ich auch gut, das kann man so lassen.

Inhaltlich: Auch hier die Reihenfolge drehen. Schritt 1: Ihr verwaltet eure Termine wie gewohnt auf eurer Website, in eurer Datenbank, in eurem Ratsinformationssystem, auf eurer WordPress-Webseite mit Plugin. Schritt 2: Nennt uns die Webseite, auf der die Termine stehen, wir richten die Übernahme ein. Schritt 3: Die Termine erscheinen automatisch im Dorfkalender.

Textlich: Vielleicht werden wir konkreter — zuerst das Plugin in WordPress, als zweites das Ratsinformationssystem (das finde ich in den Gemeinden ganz gut), und dann "…" für anderes. Damit wird es greifbarer.

Inhaltlich: Den Hinweis-Banner lassen wir drin — "Bitte nachfragen, geht bisher nur für einige Webseiten", zum Beispiel Ratsinformationssysteme, Datenbanken, Volkshochschulsysteme. Wir müssen da nicht konkret werden.

Design: Auch hier wahrscheinlich Grafiken 1, 2, 3.

### Erklärmodule — Regeln für die Komponente

Design: Die Erklärmodule mit 1, 2, 3 finde ich gut. Immer drei Schritte, immer ein Titel, immer drei Grafiken, vielleicht jeweils zweigeteilt, weil manchmal zwei Schritte in einem stecken.

Design-Vorlage: Die Komponente ist an den Wegen 01 und 02 durchentworfen (Links jeweils dort). Sie erfüllt die hier genannten Regeln bereits: eine große Nummer, ein Titel, eine Bildbühne mit durchlaufenden Zuständen, darunter die drei Schritte als fette Kernzeile plus normale Ergänzung, und je Modul ein eigener CTA. Weg 03 fehlt noch.

Design: Die Module müssen zusammen mit den Erklärungen darunter immer auf einen Smartphone-Screen passen.

Textlich: Die Erklärungen darunter (1, 2, 3) sollten immer den Kern des Schrittes fett haben und die Ergänzung beziehungsweise Detaillierung in Normalschrift in der zweiten Zeile. Die meisten sind ohnehin zweizeilig: erste Zeile fett für den Schritt, zweite Zeile normal für die Ergänzung — und beides auf dem Smartphone jeweils einzeilig. Das heißt: ganz klare Textlängenbegrenzungen für das Modul, und Inhaltsbeschreibungen für die Bilder.

CTA/Conversion: Jede Erklär-Section braucht einen CTA — das ist wichtig und fehlt bisher.

- Weg 01: "Jetzt deinen ersten Flyer per WhatsApp schicken" als Button, der direkt den WhatsApp-Chat öffnet.
- Weg 02: "Jetzt Kalender anmelden", direkt auf unsere Anmeldeseite.
- Weg 03: "Jetzt meine Webseite anmelden", ebenfalls auf die Anmeldung.

Das brauchen wir auf der Homepage genauso — conversion-optimiert.

### Section "Was gerade ansteht — so sieht das in Schlatkow aus"

Inhaltlich: Finde ich gut, über die Liste haben wir auf der Startseite fachlich und technisch schon gesprochen. Aber: Was ist das Ziel dieser Section? Den Übergang zu dieser Section müssen wir intern noch einmal dokumentieren. Das Ziel ist eigentlich, den Leuten zu zeigen: ihr macht mit, und so kommt das dann in den Kalender.

Design: Die Liste sieht komplett anders aus als die echten Kalender. Optisch müssen wir das den Terminkalendern angleichen, sonst ergibt das keinen Sinn.

Inhaltlich: Die eigentliche Aussage ist "Wo kommt das her, wie geht das rein?". Deshalb sollten wir die Beispiele gezielt danach aussuchen — je ein Beispiel pro Weg, jeweils als Gegenüberstellung Quelle links, Darstellung bei Schafe vorm Fenster rechts:

- **Weg 03 (Webseite als Quelle):** ein Termin, der von der Webseite des Abfallentsorgers in Vorpommern-Greifswald kommt — links die Originaldatenbank des Abfallkalenders, rechts die Darstellung bei Schafe vorm Fenster.
- **Weg 02 (Kalender):** der Frauensport kommt aus einem Google-Kalender — links die Google-Kalender-Ansicht mit dem Eintrag, rechts der Termin im Dorfkalender.
- **Weg 03, bessere Variante:** die Gemeindevertretersitzung mit Tagesordnung aus einem Ratsinformationssystem (Screenshot) — das ist sinnvoller als der Altpapiertermin, den lassen wir dann weg.
- **Weg 01 (WhatsApp):** ein Termin, der per WhatsApp geschickt wurde — Foto und Flyer, und so sieht es im Kalender aus.

Textlich: Die Section "Was gerade ansteht" nehmen wir dann eigentlich raus und schreiben eher darüber: "So sieht das konkret aus — hier ein paar Beispiele". Die Frage dieser Section ist ja die des Users: "Ach, ich kann mir das gar nicht richtig vorstellen, das ist zu abstrakt." Und die Antwort ist: "Guck mal, hier sind ganz konkrete Beispiele."

### Section "Wer das schon macht"

Textlich: Vom Wording schwierig — eher in Richtung "Was andere sagen".

Inhaltlich: Wie auf der Homepage. Eine Proof-Section ist total wichtig, das ist richtig so. Die Anmerkungen von der Homepage gelten hier mit.

### Footer

Richtig so. Die Anmerkungen von der Homepage gelten hier mit.

## Seite `/ueber-uns`

### Seitenname

Textlich: "Warum wir" ist schlecht — das hatten wir auf der Startseite bei der Quernavigation schon. Der Slug ist `ueber-uns`, und faktisch ist es auch "Über uns". Vielleicht bleiben wir einfach bei "Über uns", bis uns etwas Besseres einfällt.

Vorschläge zum Prüfen — inhaltlich soll ankommen: "Ah, das kommt vom Dorf, da kennt jemand die Situation ganz genau":

- "Über uns" (neutral, passt zum Slug, funktioniert in jeder Navigation)
- "Wer dahintersteckt" (greift die Frage auf, die der Nutzer wirklich hat)
- "Vom Dorf fürs Dorf" (Haltung statt Kategorie — passt auch zum Hero-Claim)
- "Wir sind vom Dorf"
- "Warum es uns gibt"

### Hero

Foto: Die Foto-Section machen wir neu, das ist schon geklärt. Das Schaf-Foto finde ich gar nicht so schlecht, das ist irgendwie lustig. (Im Diktat: "Scharfsteilfoto" — gemeint ist vermutlich das Schaf-Motiv.)

Textlich: Der Claim "Gebaut in einem Dorf. Betrieben aus einem Dorf." trägt nicht. "Gebaut" passt nicht — wir bauen nichts, es macht Spaß, es ist Kultur, es ist Zusammentreffen. "Betrieben" ist auch Quatsch und sachlich sogar falsch: betrieben wird das in einer Cloud in irgendwelchen Rechenzentren, ich sitze nur hier auf dem Dorf. Die Richtung "Vom Dorf fürs Dorf" finde ich gut. Insgesamt lockerer formulieren — das kriegen wir hin.

Recherche: In den Konzepten nachsehen, ich glaube, dort haben wir schon einen besseren Claim.

### Section "Warum das zählt"

Textlich: "Warum das zählt" ist ein bisschen KI-Sprech und didaktisch schwach. Das müssen wir ändern — vielleicht eher in Richtung "Die Geschichte".

Inhaltlich: "Ein Dorf mit rund 400 Einwohnern kann sich keinen Dienst leisten, der einen Vertrieb braucht." klingt total komisch. Erstens sind es rund 280 Einwohner. Zweitens ist "eine Dienstleistung, die einen Vertrieb braucht" als Argument Quatsch. Besser: Ein Dorf braucht einen einfachen Weg, damit alle, die sich im Ehrenamt engagieren, ihre Termine schnell kommunizieren können — und damit alle mitbekommen, was läuft.

Inhaltlich: Als Ort oder Gemeinde will man sich nicht damit beschäftigen, eine App anzuschaffen oder eine komplizierte Webseite zu bauen, die dann keiner anguckt. Man braucht etwas Fertiges, das die Leute gerne benutzen und mit dem man einfach starten kann.

Inhaltlich: Darauf folgt, warum es den Schafe-vorm-Fenster-Dorfkalender gibt — und dass dort alle ihre Sachen einfach eintragen, aus allen Kontexten.

Inhaltlich: Daraus können wir ein Stück Demokratiegeschichte machen. Termine werden angekündigt, Leute finden wieder zusammen, sie bekommen mit, was los ist, und sie treffen sich — sei es am Bäckerauto oder bei der nächsten Veranstaltung. Und sie sehen, was auf der Tagesordnung der Gemeindevertretersitzung steht, während sie eigentlich nach dem Termin des nächsten Vereinstreffens gucken wollten. Hier können wir aus den Anekdoten etwas hereinholen.

Didaktisch: Wir sollten eine Geschichte erzählen, warum das relevant ist — dass ich auf dem Dorf wohne, die Themen kenne, dass das hier real passiert.

### Porträt

Design: Das Porträt sollten wir eher vollflächig zeigen und nicht so hineingepackt.

Foto: Ein Foto von einem Vortrag auf einer Konferenz finde ich nicht schlecht, aber es wirkt zu städtisch und zu groß. Besser wäre ein Open-Air-Foto mit dörflichem Hintergrund, am besten mit Menschen zusammen — zum Beispiel vom Open Transfer Camp in Neustrelitz. Ein Stadtfoto passt hier nicht. Alternativ das Zeitungsfoto, auf dem ich vor meinem Haus sitze (aus dem Nordkurier-Artikel) — auch nicht schlecht, aber am liebsten ein anderes.

### Zitate und Belege

Inhaltlich: Ein Zitat aus dem Nordkurier können wir machen — dann aber wirklich ein Zitat aus dem Artikel, und den konkreten Artikel als Quelle nennen.

Inhaltlich: Das können wir auch mit mehreren Zitaten machen, finde ich gar nicht schlecht. Quellen, aus denen sich etwas ziehen lässt: das Porträt der RAA, der Podcast mit der IHK und mehrere Zeitungsartikel. Da lassen sich gute Zitate von mir selbst herausziehen, jeweils mit der Quelle belegt. Damit haben wir ganz nebenbei Proof-Content drin.

Design: Das Zitat- und Quellen-Design müssen wir hübscher machen. So wie es jetzt aussieht, trägt es nicht. Das gilt für alle Seiten, auf denen Zitate mit Quellenangabe vorkommen — Zitat und Beleg gehören gestalterisch zusammen und sollen als Beleg erkennbar sein.

### Section "Wo das herkommt"

Inhaltlich: Finde ich super. Hier erzählen wir die Geschichte entlang.

Textlich: Wir brauchen mehr Absätze — und wir müssen die Anekdoten erzählen: die Lion-Dancer aus dem Nachbardorf, die Bienenfotogalerie, das Hinterherfahren hinter dem Bäckerauto, die Corona-Zeit mit Homeoffice, als die Leute zum Bäckerauto gingen.

### Section "Wie wir arbeiten"

Inhaltlich: "Seit 2018 in Betrieb, 120 Orte" und so weiter können wir hier weglassen. Das ändert sich ohnehin ständig und ist an dieser Stelle vermutlich auch falsch.

### Section "Wer das schon macht"

Inhaltlich: Finde ich gut, aber hier gehören Belege von Kunden hin — der NØRD Award ist hier Quatsch. Also Lebendiges Lehre, die RAA, das Kulturlandbüro, Ivenack, Stolpe an der Peene, Wolgast: Sachen, wo es wirklich benutzt wird.

### Section "Was andere sagen"

Inhaltlich: Hier gehen wir in den Proof aus Zeitungsartikeln und Konferenzen. Die Trennung ist also: "Wer das schon macht" sind die Kundenbelege, "Was andere sagen" ist Presse und Auftritte.

### Section "Wer dahinter steckt"

Inhaltlich: Ein kleines Porträt, das können wir nochmal machen. Christian Sauer nehmen wir raus, mich wieder rein, mit Foto.

Inhaltlich: Die Fakten, die hineingehören — 2011 nach Schlatkow gezogen, den Kulturverein mitgegründet, immer noch in der Gemeindevertretung (das fehlt bisher), und seit 25 Jahren IT-Experte. Genau diese Verbindung ist der Punkt: Dorfleben, Ehrenamt und die Expertise, die man für so eine Plattform braucht.

Textlich: Dafür brauchen wir einen neuen Text. Vorschlag als Ausgangspunkt:

> Ich bin 2011 nach Schlatkow gezogen, habe hier den Kulturverein mitgegründet und sitze bis heute in der Gemeindevertretung. Beruflich mache ich seit 25 Jahren IT. Schafe vorm Fenster ist die Stelle, an der beides zusammenkommt: Ich weiß, wie Ehrenamt auf dem Dorf wirklich läuft — und ich weiß, was so eine Plattform braucht.
