---
id: rechtliches-de
page_id: TS-WEB-0029
route: "/rechtliches"
seo:
  "/rechtliches":
    title: "Rechtliches"
    description: "Impressum, Datenschutz, Nutzungsbedingungen, Community-Richtlinien, Auftragsverarbeitung und Barrierefreiheit — alles auf einer Seite."
    provenance: generated
content_type: section
status: approved
reviewed_by: "Owner (Jan-Henrik Hempel), DEC-0222"
reviewed_at: "2026-11-12"
locale: de
sources:
  - "ia"
derived_from:
  - "ia"
generated_by: "playbook-content-production@1.0.0"
generated_at: "2026-09-11"
tone_profile: "du-everywhere"
provenance: "sourced — page-level composition/navigation copy only; the seven sections themselves are content/legal/*.md, imported (5), generated and owner-approved (1, accessibility) or maintained here (1, image credits)"
compliance_check: "state/content-map.md#compliance-checks — TS-WEB-0029"
schema_note: "see content/pages/home/de.md — same TS-WEB-0007/schema gap, state/open.md #37"
open_points:
  - "state/open.md #21 — accessibility statement is generated (no source exists, re-checked 2026-09-12) and was rewritten and approved by the owner on 2026-11-15 as a self-assessed statement against WCAG 2.2 AA, without the draft notice"
  - "TS-WEB-0029 open point #2 / state/open.md — English siblings of the five imported documents do not exist yet; this playbook never machine-translates legal text"
---

# Rechtliches (`/rechtliches`)

Diese Datei liefert **nur** die Seitenrahmen-Texte (h1, Navigationslabel,
Fußzeilen-Linktexte). Die sieben Abschnitte selbst kommen aus
`content/legal/*.md` — sechs per Import (TS-WEB-0007 D10), die Bildnachweise
werden hier gepflegt, weil sie das Bildverzeichnis der Seiten spiegeln — dieses Playbook schreibt
Rechtstexte nicht neu, es referenziert sie (Repository-Arbeitsregel /
Rolle Content & Translation, „Must not: touch code outside content files
… never rewrite legal text").

## Seitenkopf

<!-- id: rechtliches-1-header; content_type: section; provenance: sourced; derived_from: [ia]; status: approved -->

**h1:** Rechtliches

**Navigations-Label (`<nav>`, barrierefrei benannt):** Abschnitte

## Abschnittsregister (Reihenfolge = TS-WEB-0004 D8)

<!-- id: rechtliches-2-registry; content_type: legal-section; provenance: sourced; derived_from: [ia]; status: approved -->

| Anker | Abschnittsname | Quelle |
| --- | --- | --- |
| `#impressum` | Impressum | `content/legal/imprint.md` (importiert) |
| `#datenschutz` | Datenschutz | `content/legal/privacy-policy.md` (importiert) |
| `#nutzungsbedingungen` | Nutzungsbedingungen | `content/legal/terms-of-use.md` (importiert) |
| `#community-richtlinien` | Community-Richtlinien | `content/legal/community-guidelines.md` (importiert) |
| `#auftragsverarbeitung` | Auftragsverarbeitung (AVV) | `content/legal/dpa.md` (importiert, öffentlich, ohne Zugangssperre) |
| `#barrierefreiheit` | Barrierefreiheit | `content/legal/accessibility.md` (generiert, vom Owner freigegeben, siehe unten) |
| `#bildnachweise` | Bildnachweise | `content/legal/image-credits.md` (in diesem Repository gepflegt, Verweis auf die Nachweise am Bild) |

## Fußzeilen-Linktexte

<!-- id: rechtliches-3-footer-labels; content_type: section; provenance: sourced; derived_from: [ia]; status: approved -->

- Impressum → `#impressum`
- Datenschutz → `#datenschutz`
- Barrierefreiheit → `#barrierefreiheit`

## Barrierefreiheitserklärung — Herkunft

<!-- id: rechtliches-4-accessibility-note; content_type: section; provenance: generated; derived_from: []; status: approved -->

Für `#barrierefreiheit` existiert bislang kein Google-Doc und keine
Quelle (TS-WEB-0029 D8, TS-WEB-0004 D8: „to be written"). Am 2026-09-12 erneut
gesucht: weder die Hub-Pakete noch `go-to-market-os` tragen einen
Datensatz zur Barrierefreiheit; die Intake-Dokumente unter
`packages/identity/brand-identity/intake/org-profile-gdocs/` sind reine
`.gdoc`-Verweise ohne lokalen Text, also auch keine Quelle. Der
Abschnitt bleibt deshalb `provenance: generated`. Diese Seite kann ohne
ihn nicht in Produktion gehen (Release-Blocker). Der Text liegt separat
unter `content/legal/accessibility.md`, generiert nach der
Dummy-Content-Regel. Am 2026-11-15 hat der Owner den Entwurfsvermerk
gestrichen und eine Selbstbewertung gegen WCAG 2.2 AA freigegeben: was die
Website leistet, wie geprüft wird (axe-Sweep aller Routen, `check:contrast`),
was noch nicht barrierefrei ist, Kontakt und Durchsetzungsstelle
(`state/open.md` #21).

## Englische Geschwisterdokumente

<!-- id: rechtliches-5-en-gap; content_type: section; provenance: sourced; derived_from: [ia]; status: approved -->

Für die fünf importierten Dokumente existiert heute keine englische
Fassung; `import.yaml` kennt nur `locale: de` (TS-WEB-0029 Open Point #2).
Dieses Playbook übersetzt Rechtstexte nicht maschinell und erfindet
keine — die englischen Fassungen entstehen erst, sobald englische
Google Docs vorliegen und importiert werden.
