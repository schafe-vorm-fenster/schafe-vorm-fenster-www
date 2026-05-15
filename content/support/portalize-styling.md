---
title: Wie passe ich das Styling des Portalize-Widgets an?
category: 'Kalendereinbindung "Portalize"'
locale: de
status: imported
---

Wenn du CSS beherrschst, kannst du **Farben**, **Schriften** und **Größen** des Widgets an deine Website anpassen.

**So funktioniert es:**

Füge CSS-Regeln auf deiner Seite hinzu, die den Selektor `[data-portalize-widget]` verwenden. Das Widget liest diese Werte und wendet sie an.

**Basis-Styling (gilt für alle Texte):**

```css
[data-portalize-widget] {
  color: #1a472a;
  font-family: "Georgia", serif;
  font-size: 16px;
  line-height: 1.5;
}
```

**Überschriften (Veranstaltungstitel):**

```css
[data-portalize-widget] {
  --portalize-title-color: #d500f9;
  --portalize-title-font-weight: 600;
  --portalize-title-font-family: "Georgia", serif;
  --portalize-title-font-size: 1.8em;
  --portalize-title-line-height: 1.6;
}
```

**Beschreibungstexte:**

```css
[data-portalize-widget] {
  --portalize-description-color: #1a472a;
  --portalize-description-font-weight: 400;
  --portalize-description-font-family: "Georgia", serif;
  --portalize-description-font-size: 1em;
  --portalize-description-line-height: 1.6;
}
```

**Metadaten (Datum, Ort, Veranstalter):**

```css
[data-portalize-widget] {
  --portalize-metadata-color: #666;
  --portalize-metadata-font-weight: 400;
  --portalize-metadata-font-family: "Georgia", serif;
  --portalize-metadata-font-size: 0.9em;
  --portalize-metadata-line-height: 1.5;
}
```

**Links und Buttons:**

```css
[data-portalize-widget] {
  --portalize-highlight-color: #ff6f00;
  --portalize-highlight-font-weight: 600;
  --portalize-highlight-font-family: "Georgia", serif;
  --portalize-highlight-font-size: 0.9em;
  --portalize-highlight-line-height: 1.5;
}
```

**Kategorie-Filter-Buttons:**

```css
[data-portalize-widget] {
  --portalize-button-bg-color: #f3f4f6;
  --portalize-button-bg-color-selected: #d1d5db;
  --portalize-button-text-color: #000000;
  --portalize-button-text-color-selected: #000000;
  --portalize-button-font-weight: normal;
  --portalize-button-border-radius: 0.25rem;
  --portalize-button-border-color: transparent;
  --portalize-button-border-width: 1px;
  --portalize-button-icon-size: 1em;
}
```

**Trennlinien zwischen Terminen:**

```css
[data-portalize-widget] {
  --portalize-divider-color: #d1d5db;
  --portalize-divider-width: 1px;
  --portalize-divider-style: solid;
}
```

**Bilder:**

```css
[data-portalize-widget] {
  --portalize-image-bg-color: #d1d5db;
  --portalize-image-border-radius: 0.5rem;
  --portalize-image-shadow: none;
}
```

**Branding-Kopfzeile:**

```css
[data-portalize-widget] {
  --portalize-logo-height: 2.5rem;
  --portalize-branding-gap: 0.5rem;
}
```

**Kategorie-Badges:**

```css
[data-portalize-widget] {
  --portalize-badge-bg-color: #e5e7eb;
  --portalize-badge-border-radius: 0.25rem;
}
```

**Filter-Leisten-Layout (Scrollen vs. Umbruch):**

Standardmäßig werden die Filter-Buttons auf Mobilgeräten in mehreren Zeilen angezeigt, damit alle Kategorien auf einmal sichtbar sind. Du kannst dies ändern, sodass die Leiste scrollbar wird (ähnlich wie bei Instagram-Stories).

```css
[data-portalize-widget] {
  /* Scrollen erzwingen statt Umbruch */
  --portalize-filter-flex-wrap: nowrap;
  
  /* Buttons zentrieren (standardmäßig linksbündig) */
  --portalize-filter-justify-content: center;
  
  /* Scrollbalken anzeigen, wenn nötig */
  --portalize-filter-overflow-x: auto;
}
```

*Hinweis:* Responsive Anpassungen (z.B. anderes Verhalten auf dem Desktop) bleiben erhalten, da wir CSS-Variablen verwenden. Diese "tunneln" auch durch die technische Abgrenzung des Widgets (Shadow DOM).

**Probleme beim Styling?**

- Prüfe, dass die CSS-Variablennamen exakt stimmen (z.B. `--portalize-title-color`)
- Stelle sicher, dass die CSS-Regeln auf `[data-portalize-widget]` angewendet werden
- CSS-Variablen funktionieren in allen modernen Browsern
- Nutze die Browser-Entwicklertools (F12), um zu prüfen, ob das CSS angewendet wird
