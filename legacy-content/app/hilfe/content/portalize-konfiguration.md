---
title: Welche Termine zeigt mein Portalize-Widget an?
category: 'Kalendereinbindung "Portalize"'
---

Bei der Freischaltung deines Portalize-Widgets konfigurieren wir gemeinsam, **welche Termine angezeigt werden**.

**Filter-Optionen für deine Termine:**

- **Nach Kategorie** – z.B. nur „Gemeinschaftsleben", „Bildung & Gesundheit" oder mehrere Kategorien
- **Nach Ort** – Dorf, Gemeinde, Landkreis oder Postleitzahl
- **Nach Veranstalter** – nur Termine bestimmter Organisationen anzeigen
- **Startkategorie** – welche Kategorie beim ersten Laden angezeigt wird

**Branding (optional):**

- Dein **Logo** über den Terminen
- Ein **Claim/Slogan** deiner Organisation
- Ein **Link** von der Branding-Kopfzeile zu deiner Startseite

Um dein Logo und den Claim anzuzeigen, füge diesen Zusatz zum Widget-Code hinzu:

```html
<div
  id="schafe-vorm-fenster-portalize-widget"
  data-portalize-widget
  data-show-branding="true"
></div>
```

**Filter-Leiste ausblenden:**

Falls du die Kategorie-Filter nicht anzeigen möchtest (z.B. weil du nur eine einzige Kategorie darstellst), kannst du sie über ein Daten-Attribut deaktivieren:

```html
<div
  data-portalize-widget
  data-show-filter="false"
></div>
```

**Zeitraum einschränken:**

Standardmäßig werden alle zukünftigen Termine angezeigt. Du kannst den angezeigten Zeitraum begrenzen (z. B. auf 4 Wochen oder 52 Wochen), indem du die Anzahl der Wochen angibst:

```html
<div
  data-portalize-widget
  data-weeks-ahead="4"
></div>
```

**Kombiniertes Beispiel:**

Du kannst natürlich mehrere Einstellungen kombinieren:

```html
<div
  id="schafe-vorm-fenster-portalize-widget"
  data-portalize-widget
  data-weeks-ahead="52"
  data-show-branding="true"
  data-show-filter="false"
></div>
```

Möchtest du die Konfiguration später ändern? Schreibe uns einfach eine E-Mail an **jan@schafe-vorm-fenster.de**.
