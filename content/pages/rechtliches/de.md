---
id: rechtliches-de
page_id: TS-029
route: "/rechtliches"
seo:
  "/rechtliches":
    title: "Rechtliches"
    description: "Impressum, Datenschutz, Nutzungsbedingungen, Community-Richtlinien, Auftragsverarbeitung und Barrierefreiheit — alles auf einer Seite."
    provenance: generated
content_type: section
status: draft
locale: de
sources:
  - "ia"
derived_from:
  - "ia"
generated_by: "playbook-content-production@1.0.0"
generated_at: "2026-09-11"
tone_profile: "du-everywhere"
provenance: "sourced — page-level composition/navigation copy only; the six sections themselves are content/legal/*.md, imported (5) or generated-pending-counsel (1, accessibility)"
compliance_check: "state/content-map.md#compliance-checks — TS-029"
schema_note: "see content/pages/home/de.md — same TS-007/schema gap, state/open.md #37"
open_points:
  - "state/open.md #21 — accessibility statement is generated, provenance: generated, flagged for legal-counsel review before production"
  - "TS-029 open point #2 / state/open.md — English siblings of the five imported documents do not exist yet; this playbook never machine-translates legal text"
---

# Rechtliches (`/rechtliches`)

Diese Datei liefert **nur** die Seitenrahmen-Texte (h1, Navigationslabel,
Fußzeilen-Linktexte). Die sechs Abschnitte selbst kommen aus
`content/legal/*.md` per Import (TS-007 D10) — dieses Playbook schreibt
Rechtstexte nicht neu, es referenziert sie (Repository-Arbeitsregel /
Rolle Content & Translation, „Must not: touch code outside content files
… never rewrite legal text").

## Seitenkopf

<!-- id: rechtliches-1-header; content_type: section; provenance: sourced; derived_from: [ia]; status: draft -->

**h1:** Rechtliches

**Navigations-Label (`<nav>`, barrierefrei benannt):** Abschnitte

## Abschnittsregister (Reihenfolge = TS-004 D8)

<!-- id: rechtliches-2-registry; content_type: legal-section; provenance: sourced; derived_from: [ia]; status: draft -->

| Anker | Abschnittsname | Quelle |
| --- | --- | --- |
| `#impressum` | Impressum | `content/legal/imprint.md` (importiert) |
| `#datenschutz` | Datenschutz | `content/legal/privacy-policy.md` (importiert) |
| `#nutzungsbedingungen` | Nutzungsbedingungen | `content/legal/terms-of-use.md` (importiert) |
| `#community-richtlinien` | Community-Richtlinien | `content/legal/community-guidelines.md` (importiert) |
| `#auftragsverarbeitung` | Auftragsverarbeitung (AVV) | `content/legal/dpa.md` (importiert, öffentlich, ohne Zugangssperre) |
| `#barrierefreiheit` | Barrierefreiheit | `content/legal/accessibility.md` (generiert, siehe unten) |

## Fußzeilen-Linktexte

<!-- id: rechtliches-3-footer-labels; content_type: section; provenance: sourced; derived_from: [ia]; status: draft -->

- Impressum → `#impressum`
- Datenschutz → `#datenschutz`
- Barrierefreiheit → `#barrierefreiheit`

## Barrierefreiheitserklärung — Herkunft

<!-- id: rechtliches-4-accessibility-note; content_type: section; provenance: generated; derived_from: []; status: draft -->

Für `#barrierefreiheit` existiert bislang kein Google-Doc und keine
Quelle (TS-029 D8, TS-004 D8: „to be written"). Diese Seite kann ohne
diesen Abschnitt nicht in Produktion gehen (Release-Blocker). Der Text
liegt separat unter `content/legal/accessibility.md`, generiert nach der
Dummy-Content-Regel: zurückhaltend formuliert, ohne erfundenes
Prüfdatum, ohne behauptete Konformitätsstufe — und ausdrücklich zur
Prüfung durch Rechtsberatung markiert, bevor er produktiv geht
(`state/open.md` #21).

## Englische Geschwisterdokumente

<!-- id: rechtliches-5-en-gap; content_type: section; provenance: sourced; derived_from: [ia]; status: draft -->

Für die fünf importierten Dokumente existiert heute keine englische
Fassung; `import.yaml` kennt nur `locale: de` (TS-029 Open Point #2).
Dieses Playbook übersetzt Rechtstexte nicht maschinell und erfindet
keine — die englischen Fassungen entstehen erst, sobald englische
Google Docs vorliegen und importiert werden.
