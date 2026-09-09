# Schafe vorm Fenster — Website-Konzept & Klickdummy v1.0

Stand: 9. September 2026

## Inhalt

| Datei | Was drin ist |
| --- | --- |
| `Wireframes Mobile.dc.html` | Klickbarer Prototyp, 8 Screens, Smartphone-Breite. Im Browser öffnen. |
| `assets/` | Brand-Assets (Catamaran, Logo) und Bilder aus `media-echo/verified` |
| `support.js` | Runtime für die Prototyp-Dateien |

Die drei Konzeptdokumente liegen in `go-to-market-os/concept/` — sie sind
die Quelle der Wahrheit für Prinzipien, Relevanzmodell und IA. Siehe
[../README.md](../README.md) für die Verlinkung.

## Prototyp bedienen

`Wireframes Mobile.dc.html` doppelklicken (kein Server nötig, alle Assets
liegen relativ daneben).

Links neben dem Telefon:

- **Seiten** — direkt zu einem der 8 Screens springen. Im Telefon selbst
  ist alles klickbar: Szenen, Kontext-Bänder, CTAs, Ortschips,
  Angebotsstufen.
- **Standort** — unbekannt · Vorpommern-Greifswald · Gemeinde Lehre.
  Steuert, wie nah Inhalte einsteigen.
- **Einstieg** — Direktaufruf · Instagram · LinkedIn · Print-QR ·
  Kaufsuche. Steuert Fokus-Job und Proof-Typ.
- **Ort ohne Termine** — der Leerfall: die Seite wechselt den Fokus-Job
  auf „Termine veröffentlichen".
- **Konzept-Anmerkungen** — blendet ein, welches Prinzip wo greift.

Der Proof-Strom wird nach der Formel aus dem Relevanzmodell berechnet, nicht
kuratiert. Die Geo-Badges zeigen die Nähe, das Muster ist
nah · nah · fern · nah · sehr fern.

## Screens

1. Startseite — Ortssuche und Live-Termine als erster Screen, drei Szenen
2. Was ist los — Ortskalender, vier Mehrwert-Stories, Homescreen
3. Termine veröffentlichen — WhatsApp-Flyer, drei Publishing-Wege
4. Registrieren — 3 Schritte, dann Übergabe an die App
5. Eigener Kalender — drei Stufen: kostenlos · 480 €/Jahr · Region
6. Kalender zusammenstellen — Zuschnitt mit Live-Vorschau, Rechnung
7. Landkreis — Karten-Story, Angebotsanfrage
8. Warum wir — Herkunft, Proof-Strom mit Bildern, Team, Archiv-Link

## Inhalte

Echt: Referenzfall LeLender, Abend der Engagierten Flechtorf, NØRD Award
2026, Nordkurier-Artikel, openTransfer Camp, LEADER, KfW, NDR,
IHK-Podcast, Zukunftswege Ost, Zitate aus `proof/`, Preis 480 €.

Generiert: Termine der Beispielorte, Screenshots für die
Homescreen-Anleitung, Kartenvorschau.

## Was vor dem Bauen zu klären ist

1. **`geo` in `media-echo/verified/`** — ohne Bundesland/Landkreis/Ort pro
   Eintrag funktioniert nur Stufe 0 des Relevanzmodells. Erster
   Datenschritt.
2. **Vier Testimonial-Freigaben** (Kurzweg, Wendt, Eichler, Zschiesche) —
   im Repo `usage_rights: unverified`. Die Mehrwert-Stories auf Screen 02
   tragen ohne Zitat nur halb.
3. **IP-Geolocation** datenschutzrechtlich prüfen (Verarbeitung ohne
   Speicherung).
4. **Reichweitenzahlen** neu erheben oder live zählen —
   `proof/reach-and-usage.proof.md` ist `expired`.
5. **Self-Service-Kauf**: Zahlungsabwicklung und Rechnungslauf für
   Verwaltungen sind im Prototyp angedeutet, nicht entschieden.
