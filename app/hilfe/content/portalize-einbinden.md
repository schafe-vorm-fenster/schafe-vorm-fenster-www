---
title: Wie binde ich das Portalize-Widget ein?
category: 'Kalendereinbindung "Portalize"'
---

Die Einbindung des **Portalize-Widgets** ist denkbar einfach – du brauchst nur **zwei Zeilen Code**.

Füge diesen Code an der Stelle ein, wo die Termine auf deiner Website erscheinen sollen:

```html
<div id="schafe-vorm-fenster-portalize-widget" data-portalize-widget></div>
<script src="https://events.portalize.app/api/DEINE_ORGANIZER_ID/load.js"></script>
```

Ersetze **DEINE_ORGANIZER_ID** mit der ID, die wir dir per E-Mail geschickt haben. Fertig! Das Widget lädt automatisch.

**Vollständiges Beispiel:**

```html
<!DOCTYPE html>
<html lang="de">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Termine</title>
  </head>
  <body>
    <h1>Kommende Veranstaltungen</h1>
    <div id="schafe-vorm-fenster-portalize-widget" data-portalize-widget></div>
    <script src="https://events.portalize.app/api/DEINE_ORGANIZER_ID/load.js"></script>
  </body>
</html>
```

Falls du Hilfe beim Einbau benötigst, kann dir dein Webentwickler oder der Support deines Website-Baukastens weiterhelfen.
