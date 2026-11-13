# Agententeam für den Website-Aufbau — Setup-Dokument

Dieses Dokument enthält alles, was gebraucht wird, um ein Multi-Agenten-Team für ein größeres Website-Projekt aufzusetzen: den Kickoff-Prompt, die Rollen, die Vorbedingungen, den Prozess und die Leitplanken.

**Verwendung:** Abschnitt 1 als Prompt in das Projekt abschicken. Die Abschnitte 2–11 sind die Vorlage, aus der das Agententeam seine eigenen Arbeitsdokumente erzeugt.

---

## 1. Kickoff-Prompt

> Kopiervorlage — dieser Text wird abgeschickt, um den Aufbau zu starten.

```
Du bist der Orchestrator für den Aufbau einer größeren Website.

AUSGANGSLAGE
- Design, Bildmaterial, Spezifikationen, Anforderungen und Akzeptanzkriterien
  liegen vollständig vor.
- Es existiert noch keine Zeile Code, kein finaler Text, keine Übersetzung.
- Nahezu alle inhaltlichen Entscheidungen sind bereits getroffen.

DEIN AUFTRAG IN DIESER SITZUNG
Baue das Agententeam auf. Du schreibst noch keinen Produktionscode. Erzeuge:
1. Je eine Rollen-Anweisungsdatei pro Agent (siehe Abschnitt 2)
2. Die Preflight-Checkliste (Abschnitt 3)
3. Den Projektplan mit Meilensteinen und Quality Gates (Abschnitt 4)
4. Die Prozessbeschreibung inkl. Fix-Deploy-Retest-Schleife (Abschnitt 5)
5. Die Leitplanken (Abschnitt 8)
6. Die Definition of Done (Abschnitt 9)
7. Leere Startversionen von Zustandsdokument und Offene-Punkte-Liste

VORGEHEN
Schritt 1: Lies das gesamte vorliegende Material.
Schritt 2: Sammle ALLE Fragen, die du an mich hast — Entscheidungen, Zugänge,
  Freigaben, Unklarheiten im Material — und stelle sie mir gebündelt in EINER
  Nachricht. Frage nicht einzeln und nicht später.
Schritt 3: Erst nach meiner Antwort erzeugst du die Dokumente.

REGEL FÜR DEN SPÄTEREN LAUF
Wenn du während der Ausführung auf etwas Unklares stößt: nicht anhalten.
Triff eine dokumentierte Annahme, arbeite weiter und trage den Punkt in
die Offene-Punkte-Liste ein.

Beginne mit Schritt 1.
```

---

## 2. Rollen

Jede Rolle bekommt eine eigene Anweisungsdatei. Die Sub-Agenten kommunizieren **nicht** untereinander, sondern ausschließlich über den Orchestrator und über die definierten Dateien.

| Rolle | Verantwortung | Darf nicht |
|---|---|---|
| **Orchestrator** | Mechanik: Aufgaben zerlegen, delegieren, Ergebnisse einsammeln, Zustand pflegen, Reihenfolge sicherstellen | Fachliche Prioritäten setzen |
| **Projektmanager** | Projektplan, Meilensteine, Quality Gates, Priorisierung von Befunden, Reaktion auf Kundenfeedback | Selbst implementieren |
| **Developer** | Implementierung der Arbeitspakete gemäß Spezifikation | Scope erweitern, Abhängigkeiten eigenmächtig nachziehen |
| **Content & Translation** | Texte erstellen, Übersetzungen, Bildeinbindung gemäß Vorgabe | Inhaltliche Aussagen erfinden |
| **QA** | Systematischer Durchlauf der Akzeptanzkriterien, Protokoll je Durchlauf | Selbst Fixes vornehmen |
| **Chaos-Personas** | Unstrukturiertes Browser-Testing nach Verhaltensprofilen | Bewerten oder priorisieren |
| **UAT-Persona** | Conversion-Pfad durchlaufen, Verständlichkeit und Zögerpunkte melden | Ein Urteil als Abnahme werten |
| **Kunde** | Abnahme gegen Akzeptanzkriterien — annehmen oder ablehnen mit Begründung | Selbst Änderungen vornehmen |

### Chaos-Personas — Verhaltensprofile

Mindestens diese vier, jeweils als eigene Persona-Datei:

- **Der Hektische** — klickt schneller als die Seite reagiert, doppelt Aktionen, wechselt mitten im Vorgang die Seite
- **Der Abbrecher** — beginnt Formulare und verlässt sie zu unterschiedlichen Zeitpunkten, kehrt später zurück
- **Der Tastaturnutzer** — bedient ausschließlich per Tastatur, prüft Fokusreihenfolge und Erreichbarkeit
- **Der Grenzgänger** — extreme Eingaben, Sonderzeichen, sehr lange Werte, leere Pflichtfelder

---

## 3. Preflight-Checkliste

Der Orchestrator arbeitet diese Liste ab, **bevor** irgendein Agent startet. Jeder Punkt wird aktiv verifiziert, nicht angenommen. Fehlt etwas: sofortiger Abbruch mit Rückfrage — nicht nach zwei Stunden.

**Zugänge**
- [ ] Repository-Zugriff vorhanden, Schreibrecht auf Arbeitsbranch geprüft
- [ ] Deploy-Token gültig, Testaufruf erfolgreich
- [ ] Umgebungsvariablen für Preview vollständig gesetzt
- [ ] Externe Dienste (Formulare, Analytics, CMS) erreichbar

**Werkzeuge**
- [ ] Browsersteuerung läuft, Testaufruf einer beliebigen Seite erfolgreich
- [ ] Lokaler Dev-Server startbar
- [ ] Build lokal durchführbar
- [ ] Pipeline reagiert auf Testcommit

**Material**
- [ ] Design-Dateien am definierten Ort und lesbar
- [ ] Bildmaterial vollständig, Namensschema klar
- [ ] Spezifikationen und Anforderungen vorhanden
- [ ] Akzeptanzkriterien vorhanden und je Kriterium prüfbar formuliert

**Struktur**
- [ ] Zielverzeichnisse existieren
- [ ] Zustandsdokument und Offene-Punkte-Liste angelegt
- [ ] Alle Rollendateien vorhanden

---

## 4. Projektplan

Der Projektmanager erstellt den konkreten Plan. Gerüst:

### Meilensteine

1. **M1 — Gerüst**: Projektstruktur, Build läuft, Deployment-Kette einmal durchgespielt
2. **M2 — Struktur**: Alle Seiten und Komponenten angelegt, noch mit Platzhalterinhalten
3. **M3 — Inhalt**: Texte, Bilder, Übersetzungen vollständig
4. **M4 — Verhalten**: Interaktionen, Formulare, Conversion-Pfade funktionsfähig
5. **M5 — Feinschliff**: Genau eine Runde, festes Budget

### Quality Gate je Meilenstein

Ein Meilenstein gilt erst als abgeschlossen, wenn alle drei Abnahmestränge durch sind:

- **QA**: Akzeptanzkriterien des Meilensteins geprüft, keine kritischen Befunde offen
- **Kunde**: Abnahme erteilt oder Ablehnung mit Begründung abgearbeitet
- **UAT-Persona**: Conversion-Pfad durchlaufen, Zögerpunkte protokolliert

Die UAT-Meldung ist ein **Signal, kein Urteil**. Eine simulierte Persona kann nicht verlässlich sagen, ob ein Text verständlich ist. Der Projektmanager entscheidet, was daraus folgt.

### Feinschliff

Feintuning bekommt bewusst ein festes Budget von einer Runde in M5. Alles, was danach noch auffällt, wandert auf die Offene-Punkte-Liste statt sofort umgesetzt zu werden. Ohne diese Regel wird der Lauf endlos.

---

## 5. Prozess: die Fix-Deploy-Retest-Schleife

```
1. QA und Chaos-Personas laufen
   → Befunde in die Befundliste, jeweils mit Schweregrad
     (kritisch / hoch / mittel / niedrig)

2. Projektmanager priorisiert
   → entscheidet, was in diese Runde kommt und was liegen bleibt
   → alles, was liegen bleibt, geht auf die Offene-Punkte-Liste

3. Developer arbeitet die Runde ab

4. Deploy

5. QA testet gezielt die Befunde dieser Runde nach
   + kurzer Regressionsdurchlauf

6. Abbruchkriterium prüfen
```

### Abbruchkriterium

Die Schleife endet, sobald **eine** dieser Bedingungen erfüllt ist:

- Keine kritischen und keine hohen Befunde mehr offen, **oder**
- Drei Runden durchlaufen

Chaos-Testing findet immer noch irgendetwas. Ohne festes Ende dreht sich die Schleife unbegrenzt weiter.

---

## 6. Zwei Teststränge

| | Lokal | Pipeline |
|---|---|---|
| **Gegenstand** | Verhalten, Logik, Inhalte, Akzeptanzkriterien | Nur was lokal nicht auftreten kann |
| **Umfang** | Vollständig, alle Roundtrips | Schmaler Rauchtest auf der Preview-URL |
| **Prüft** | Funktion, Darstellung, Conversion-Pfade | Build-Fehler, Umgebungsvariablen, Preview-Deploy, Domains, Redirects |

**Harte Regel:** Nichts geht in die Pipeline, was lokal nicht grün ist. Sonst werden zwei Umgebungen gleichzeitig debuggt.

---

## 7. Kommunikation und Dateien

Koordination läuft über Dateien, nicht über Gespräch:

```
/agents/          Rollen-Anweisungsdateien
/plan/            Projektplan, Meilensteine, Quality Gates
/state/status.md  Zustandsdokument
/state/open.md    Offene-Punkte-Liste
/state/findings/  Befundlisten je Testrunde
/reports/qa/      QA-Protokolle je Durchlauf
/reports/uat/     UAT-Meldungen je Meilenstein
```

Jeder Agent schreibt sein Ergebnis in eine fest definierte Datei. Der nächste liest sie dort.

---

## 8. Leitplanken

Was **kein** Agent darf:

- Produktivumgebung anfassen — Deploys ausschließlich auf Preview
- Löschaktionen an Dateien oder Branches außerhalb des Arbeitsbereichs
- Abhängigkeiten nachinstallieren oder Versionen anheben ohne Freigabe
- Zugangsdaten in Dateien schreiben, die im Repo landen
- Scope erweitern — nicht spezifizierte Features werden zur offenen Liste, nicht gebaut
- Akzeptanzkriterien umformulieren, um sie erfüllbar zu machen

---

## 9. Definition of Done

Ein Arbeitspaket gilt als fertig, wenn:

- [ ] Alle zugeordneten Akzeptanzkriterien erfüllt und einzeln geprüft
- [ ] Lokaler Build läuft fehlerfrei
- [ ] Ergebnis liegt in der dafür definierten Datei
- [ ] Getroffene Annahmen sind dokumentiert
- [ ] Nicht Erledigtes steht auf der Offenen-Punkte-Liste

Ohne diese Definition liefert jeder Agent ab, wenn er sich gut fühlt.

---

## 10. Zustandsdokument

Format für `/state/status.md`, wird vom Orchestrator nach jedem Schritt aktualisiert:

```markdown
# Status

Lauf gestartet: <Zeitstempel>
Aktueller Meilenstein: <M1–M5>
Aktuelle Testrunde: <n von 3>

## Erledigt
- <Arbeitspaket> — <Zeitstempel>

## In Arbeit
- <Arbeitspaket> — <Rolle>

## Ausstehend
- <Arbeitspaket>

## Letzter Quality Gate
QA: <Status> | Kunde: <Status> | UAT: <Status>
```

Zweck: Nach einem Abbruch ist sofort erkennbar, wo wieder angeknüpft wird.

---

## 11. Offene-Punkte-Liste

Format für `/state/open.md`:

```markdown
| # | Punkt | Quelle | Schweregrad | Getroffene Annahme | Entscheidung nötig |
|---|-------|--------|-------------|--------------------|--------------------|
| 1 |       |        |             |                    | ja / nein          |
```

Das ist die Liste, die nach einem mehrstündigen Lauf gelesen wird. Sie enthält alles, was der Lauf nicht selbst entscheiden konnte, plus alles, was bewusst verschoben wurde.

---

## Modellzuordnung

- **Opus** — Orchestrator und Projektmanager: Architektur, Zerlegung, Priorisierung
- **Sonnet** — Developer, Content, QA, Kunde: der Großteil der Umsetzung
- **Haiku** — Chaos-Personas und Massenaufgaben: einfaches Durchklicken, Protokollieren
