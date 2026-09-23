---
artefact: glossary
status: DRAFT
date: 2026-09-09
updated: 2026-09-23
decisions: [DEC-062, DEC-080]
---

# Glossary

> **The canonical vocabulary is not here.** Geographic terms, product
> terms and roles are defined in the bilingual glossary (SRC-016), which
> becomes `@schafe-vorm-fenster/glossary` (DEC-062). This register points
> at it and adds only what is specific to the website: which word to use
> in copy per locale, and which words not to use.
>
> From the canonical source, binding here: **Community** = Dorf/Ort ·
> **Municipality** = Gemeinde · **County** = Landkreis · **State** =
> Bundesland — the five levels of TS-005 D1. **Community Calendar** =
> Dorfkalender. And the role in two registers (DEC-062): **Actor/Akteur**
> outward, in all copy and in the audience model; **Organizer** internal,
> in the data model and the APIs. Nothing user-facing says Organizer.

## The two copy columns

The **use** and **avoid** columns are a production input, not
documentation (TS-007 D9, DEC-080). A generation run writes the *use*
word; `check:content` fails on an *avoid* word (SRC-018, CG-040). The
full website word list, including the phrases that belong to no `GL-###`
term, is SRC-017 §9.

Two conventions, so an empty cell means something:

- **`—`** — an internal term of the specification. It never appears in
  page copy at all, so there is no word to use and none to avoid.
- **empty** — a real copy term for which the 2026-09-22 review supports
  no word yet. It is a gap on the record, not a licence to invent one.

| ID | Term | Meaning / canonical source | Use (de · en) | Avoid |
| --- | --- | --- | --- | --- |
| GL-001 | job | A visitor's concern in the moment, not a role. Four jobs carry the site. Canonical: SRC-001 §1. | — | — |
| GL-002 | focus job | The one job a page owns; exactly one per page (WEB-F-001). | — | — |
| GL-003 | context band | The block naming the other three jobs, phrased as an offer (WEB-F-005). | — | — |
| GL-004 | scene | Concrete, picturable introduction of a job: aha question + one mechanism (WEB-F-008). | — | — |
| GL-005 | proof element | Entry from `@schafe-vorm-fenster/proof` or `media-echo/verified/` embedded beside a claim. | — | — |
| GL-006 | clearance | `usage_rights: cleared` — the hard publishability filter (WEB-F-033). | — | — |
| GL-007 | media echo | Press, awards, appearances. Canonical: `@schafe-vorm-fenster/media-echo`. | | *Presse- und Auftrittshistorie* — an internal label on a public page (CG-035) |
| GL-008 | relevance model | Scoring and ordering of proof/live content. Canonical: SRC-002. | — | — |
| GL-009 | live module | Page block rendering current app data (place search, nearby dates, counters). | — | — |
| GL-010 | stage | Knowledge level 0–3 about the visitor (WEB-F-050). | — | — |
| GL-011 | entry context | Referrer/UTM-derived assumption about the visit (SRC-002 context matrix). | — | — |
| GL-012 | geo hierarchy | place · municipality · county · state · country (WEB-F-038). | Ort · Gemeinde · Landkreis · Bundesland / place · municipality · county · state | *Postleitzahl* · *PLZ* · *ZIP code* — a place name is where someone is from, a postcode is an abstraction (DEC-079) |
| GL-013 | TLD default language | The language a country domain renders without a URL prefix (WEB-F-061). | — | — |
| GL-014 | conversion goal | Measurable action; canonical IDs in `@schafe-vorm-fenster/goals`. | — | — |
| GL-015 | offering | Sellable product/service; canonical in `@schafe-vorm-fenster/offerings`; `promotion:` gates visibility. | Dorfkalender · euer Kalender / community calendar · your calendar | *das Produkt* · *the product* (CG-039); *Portalize* outside the one sentence DEC-052 §1 allows (WEB-C-014) |
| GL-016 | audience / relation | Two-axis stakeholder model; canonical in `@schafe-vorm-fenster/audiences` (ADR-003). | — | — |
| GL-017 | publisher / actor | An actor (club, church, business) that publishes dates; the `actors` audience once registered. | Akteur · der Verein, die Feuerwehr, die Kirchgemeinde / actor | *Organizer* (DEC-062); *die Leute* · *the people* (CG-009) |
| GL-018 | content hub | The GTM content packages the website consumes (WEB-F-080). | — | — |
| GL-019 | empty state | A place without dates — a conversion occasion, not an error (WEB-F-044/045). | An invitation naming the next step — the review's own shape: *"Fehlt deine Veranstaltung, jetzt selbst eintragen."* | |
| GL-020 | STRICT | The requirements framework this spec follows; executing layer at `/Users/jan-henrik.hempel/LeafcutterOS/leafcutter-strict`. | — | — |
