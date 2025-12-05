# Auftragsverarbeitungsvertrag (AVV)

## gemäß Art. 28 Datenschutz-Grundverordnung (DSGVO)

Stand: 5. Dezember 2025

## Präambel

Diese Vereinbarung regelt die Rechte und Pflichten der Parteien im Zusammenhang mit der Verarbeitung personenbezogener Daten durch den Auftragnehmer im Auftrag des Auftraggebers. Sie findet Anwendung auf alle Tätigkeiten im Zusammenhang mit den „Integrationsdiensten“ (z. B. Kalendereinbettung via „Portalize“), bei denen eine Verarbeitung personenbezogener Daten (insb. IP-Adressen der Endnutzer) durch den Auftragnehmer technisch nicht ausgeschlossen werden kann.

## 1. Gegenstand und Dauer

Gegenstand der Verarbeitung ist die technische Bereitstellung von Software-Modulen („Integrationsdienste“), die auf Webseiten des Auftraggebers eingebunden werden, um Inhalte (z. B. Veranstaltungstermine) an die Besucher auszuliefern. Die Dauer dieser Vereinbarung entspricht der Laufzeit des Hauptvertrages.

## 2. Art und Zweck der Verarbeitung

Die Verarbeitung beschränkt sich auf das technisch zwingend Notwendige, um den sicheren Abruf und die Auslieferung der Inhalte an die Endnutzer zu gewährleisten.

Der Auftragnehmer verfolgt hierbei den Ansatz der Datensparsamkeit (Privacy by Design):

- Es werden keine Cookies auf den Endgeräten der Besucher gesetzt.
- Es erfolgt kein Tracking des Nutzerverhaltens und keine Erstellung von Nutzerprofilen.
- Es werden keine externen Analyse-Tools (wie eTracker oder Google Analytics) im Rahmen der Integrationsdienste geladen.

## 3. Art der Daten und Kreis der Betroffenen

Art der personenbezogenen Daten: Gegenstand der Verarbeitung sind ausschließlich technische Kommunikationsdaten, die beim Aufruf der Dienste technisch bedingt anfallen:

- IP-Adressen der zugreifenden Endgeräte (in flüchtigen Server-Logs).
- Technische Metadaten des Abrufs (z. B. Zeitstempel, HTTP-Statuscode, Browser-Informationen/User Agent).
Kategorien betroffener Personen: Besucher der Webseite(n) des Auftraggebers (Endnutzer).

## 4. Pflichten des Auftragnehmers

Der Auftragnehmer verpflichtet sich:

- Daten ausschließlich im Rahmen der getroffenen Vereinbarungen und nach Weisung des Auftraggebers zu verarbeiten.
- Die vertrauliche Behandlung der Daten sicherzustellen. Alle zur Verarbeitung berechtigten Personen haben sich zur Vertraulichkeit verpflichtet.
- Die in Anlage 1 definierten technischen und organisatorischen Maßnahmen (TOMs) aufrechtzuerhalten.
- Den Auftraggeber bei der Einhaltung der gesetzlichen Pflichten (z. B. Beantwortung von Betroffenenrechten nach Art. 12-22 DSGVO, Meldung von Datenschutzverletzungen nach Art. 33-34 DSGVO) angemessen zu unterstützen.
- Nach Abschluss der Leistungen alle personenbezogenen Daten der Endnutzer (insbesondere IP-Logfiles) zu löschen, sofern keine gesetzliche Aufbewahrungspflicht besteht.

## 5. Unterauftragsverhältnisse (Subunternehmer)

Der Auftraggeber erteilt die allgemeine Genehmigung, weitere Auftragsverarbeiter hinzuzuziehen. Für die Erbringung der Integrationsdienste („Portalize“) ist derzeit folgender Unterauftragnehmer genehmigt:

### Vercel Inc. (Sitz: USA)

Funktion: Hosting, Serverless Functions & Content Delivery Network (CDN)  
Garantie für Drittlandtransfer: EU-Standardvertragsklauseln (SCC), Data Privacy Framework (DPF)

### Hinweis zur Abgrenzung weiterer Dienste

Dienste wie Google Workspace (E-Mail/Kalender) oder Mateo (CRM) nutzt der Auftragnehmer ausschließlich zur Verwaltung der eigenen Geschäftsbeziehung mit dem Auftraggeber (B2B-Daten) oder zur internen Datenhaltung. Diese Dienste haben keinen Zugriff auf die IP-Adressen der Webseitenbesucher im Rahmen der Integrationsdienste und sind daher nicht Gegenstand dieses Endnutzer-AVV.

### Serverstandort

Der Auftragnehmer stellt durch Konfiguration sicher, dass die verarbeitenden Recheneinheiten (Compute/Functions) primär in der Europäischen Union (Regionen: Frankfurt, Paris, Stockholm) betrieben werden. 

Zur Gewährleistung einer performanten Auslieferung und Ausfallsicherheit (DDoS-Schutz) werden statische Assets über das globale Edge-Netzwerk von Vercel bereitgestellt.

Änderungen an den Unterauftragnehmern werden dem Auftraggeber in Textform mitgeteilt, woraufhin diesem ein Einspruchsrecht zusteht.

## 6. Kontrollrechte

Der Auftraggeber hat das Recht, die Einhaltung der gesetzlichen und vertraglichen Pflichten zu überprüfen.

Der Auftragnehmer kann den Nachweis der Einhaltung der technischen und organisatorischen Maßnahmen durch Vorlage geeigneter Zertifikate (z. B. ISO 27001, SOC2) oder Testate unabhängiger Dritter führen. Vor-Ort-Kontrollen sind nur im begründeten Einzelfall nach Vorankündigung durchzuführen.

### 7. Schlussbestimmungen

Es gilt das Recht der Bundesrepublik Deutschland. Sollten einzelne Teile dieser Vereinbarung unwirksam sein, bleibt die Wirksamkeit im Übrigen unberührt.

## ANLAGE 1: Technische und organisatorische Maßnahmen (TOMs)

gemäß Art. 32 DSGVO

Zur Gewährleistung der Datensicherheit, insbesondere zum Schutz der IP-Adressen der Webseitenbesucher, werden folgende Maßnahmen umgesetzt:

### 1. Vertraulichkeit & Zutrittskontrolle

#### Keine Speicherung von Inhaltsdaten

Die Integrationsdienste speichern keine Inhalte der Besucher, sondern liefern lediglich Informationen aus.

#### Verschlüsselung (Transport)

Sämtliche Datenübertragungen zwischen dem Browser des Besuchers und den Servern erfolgen ausschließlich transportverschlüsselt (HTTPS / TLS 1.2 oder höher).

#### Physische Sicherheit

Die Rechenzentren des Subunternehmers (Vercel/AWS) verfügen über strengste Zutrittskontrollen (Biometrie, 24/7 Security), zertifiziert nach ISO 27001.

### 2. Integrität & Eingabekontrolle

#### Code-Integrität

Änderungen am Quellcode der Software unterliegen einem strengen Review-Prozess (Git Version Control, Pull Requests) vor dem Deployment.

#### Keine Manipulation

Da keine Cookies oder Nutzerprofile angelegt werden, ist eine Manipulation von Nutzerprofilen technisch ausgeschlossen.

### 3. Verfügbarkeit & Belastbarkeit

#### DDoS-Schutz

Einsatz eines globalen Content Delivery Networks (CDN) zur Abwehr von Überlastungsangriffen.

#### Redundanz

Die Infrastruktur ist so konzipiert, dass bei Ausfall eines Rechenzentrums (z. B. Frankfurt) Traffic automatisch umgeleitet werden kann (Serverless Architecture).

### 4. Löschkonzept & Trennung

#### Minimierung

IP-Adressen werden in den für den Auftragnehmer einsehbaren Anwendungsprotokollen (Runtime Logs) standardmäßig nicht gespeichert.

#### Automatische Löschung

Technische Zugriffsprotokolle der Infrastruktur werden dennoch auch ohne die IP-Adressen zu beinhalten nach max. 7 Tagen gelöscht.

#### Trennung von Analysedaten

Anonymisierte Protokolldaten (ohne IP-Adressen, ohne Personenbezug), die zur Fehleranalyse, Qualitätssicherung und statistischen Auswertung dienen, werden von den technischen Zugriffsprotokollen getrennt und dürfen dauerhaft aufbewahrt werden. Eine Re-Identifizierung von Personen ist aus diesen Daten nicht möglich.
