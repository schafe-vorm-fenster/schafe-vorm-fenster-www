# Website Design v2.0

Stand: 10. September 2026

Die visuelle Ausarbeitung des Relaunches. Löst v1.0 (Wireframes) ab —
v1.0 bleibt als Beleg des Konzeptstands liegen.

| Datei | Was drin ist |
| --- | --- |
| `Style Guide.dc.html` | Der Styleguide als Canvas: Farbwelt, Typo, Komponenten, Zustände |
| `UI Design Mobile v3.dc.html` | Ausgestaltete Screens, Smartphone-Breite |
| `UI Varianten.dc.html` | Variantenvergleich zu einzelnen Flächen |
| `assets/` | Bilder, auf die die Boards verweisen |
| `support.js` | Runtime für die Canvas-Dateien |

Das zugehörige Dokument ist
[`../website-design-system.md`](../website-design-system.md) — es ist die
normative Fassung, die Boards sind die visuelle Referenz.

## Nicht übernommen

Das Intake enthielt ältere Kopien der Konzeptdokumente (IA,
Kommunikationsprinzipien, Relevanzmodell) mit dem Routenstand vor der
`dein`-Familie. Sie wurden nicht importiert — verbindlich ist der Stand im
Hub, siehe [`../README.md`](../README.md).

## Bekannte Lücke

Die Boards maskieren Icons aus `assets/icons/<name>.svg`; diese Dateien
lagen dem Intake nicht bei. Das Set ist benannt (Lucide, 24 × 24, 2 px
Stroke) — für die Generierung genügt der Name, für die Darstellung der
Boards müssten die zwölf verwendeten SVGs hier abgelegt werden:
`arrow-right`, `calendar-days`, `check`, `globe`, `landmark`, `map-pin`,
`menu`, `share-2`, `smartphone`, `theater`, `trophy`, `truck`.

## Assets

Bilder, die v1.0 bereits enthält, werden von dort referenziert
(`../v1.0/assets/…`) statt kopiert — das spart 23 MB. Eigen sind nur die
drei Marken- und Partnerlogos unter `assets/brand/`.
