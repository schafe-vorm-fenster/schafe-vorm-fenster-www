---
artefact: glossary
status: DRAFT
date: 2026-09-09
updated: 2026-09-24
decisions: [DEC-0062, DEC-0080, DEC-0083, DEC-0085]
---

# Glossary

> **The canonical vocabulary is not here.** Geographic terms, product
> terms and roles are defined in the bilingual glossary (SRC-0016), which
> becomes `@schafe-vorm-fenster/glossary` (DEC-0062). This register points
> at it and adds only what is specific to the website: which word to use
> in copy per locale, and which words not to use.
>
> From the canonical source, binding here: **Community** = Dorf/Ort ·
> **Municipality** = Gemeinde · **County** = Landkreis · **State** =
> Bundesland — the five levels of TS-WEB-0005 D1. **Community Calendar** =
> Dorfkalender. And the role in two registers (DEC-0062): **Actor/Akteur**
> outward, in all copy and in the audience model; **Organizer** internal,
> in the data model and the APIs. Nothing user-facing says Organizer.

## The two copy columns

The **use** and **avoid** columns are a production input, not
documentation (TS-WEB-0007 D9, DEC-0080). A generation run writes the *use*
word; `check:content` fails on an *avoid* word (SRC-0018, CG-040). The
full website word list, including the phrases that belong to no `GL-####`
term, is SRC-0017 §9.

Two conventions, so an empty cell means something:

- **`—`** — an internal term of the specification. It never appears in
  page copy at all, so there is no word to use and none to avoid.
- **empty** — a real copy term for which the 2026-09-22 review supports
  no word yet. It is a gap on the record, not a licence to invent one.

| ID | Term | Meaning / canonical source | Use (de · en) | Avoid |
| --- | --- | --- | --- | --- |
| GL-0001 | job | A visitor's concern in the moment, not a role. Four jobs carry the site. Canonical: SRC-0001 §1. | — | — |
| GL-0002 | focus job | The one job a page owns; exactly one per page (FUN-WEB-0001). | — | — |
| GL-0003 | context band | The block naming the other three jobs, phrased as an offer (FUN-WEB-0005). | — | — |
| GL-0004 | scene | Concrete, picturable introduction of a job: an opener that says what works, exactly one mechanism, one concrete instance (FUN-WEB-0138, CON-WEB-0059, TS-WEB-0006 D7). Not a question by construction — SRC-0001 §1a's "aha" is the stance the opener takes, not a punctuation mark it carries (DEC-0080, DEC-0083). | — | — |
| GL-0005 | proof element | Entry from `@schafe-vorm-fenster/proof` or `media-echo/verified/` embedded beside a claim. | — | — |
| GL-0006 | clearance | `usage_rights: cleared` — the hard publishability filter (FUN-WEB-0033). | — | — |
| GL-0007 | media echo | Press, awards, appearances. Canonical: `@schafe-vorm-fenster/media-echo`. | | *Presse- und Auftrittshistorie* — an internal label on a public page (CG-035) |
| GL-0008 | relevance model | Scoring and ordering of proof/live content. Canonical: SRC-0002. | — | — |
| GL-0009 | live module | Page block rendering current app data (place search, nearby dates, counters). | — | — |
| GL-0010 | stage | Knowledge level 0–3 about the visitor (FUN-WEB-0050). | — | — |
| GL-0011 | entry context | Referrer/UTM-derived assumption about the visit (SRC-0002 context matrix). | — | — |
| GL-0012 | geo hierarchy | place · municipality · county · state · country (FUN-WEB-0038). | Ort · Gemeinde · Landkreis · Bundesland / place · municipality · county · state | *Postleitzahl* · *PLZ* · *ZIP code* on every **search** surface — a place name is where someone is from, a postcode is an abstraction (DEC-0079). One exemption: the order flow's scope step (`TS-WEB-0025 D3`), where a buyer draws the boundary of a purchased calendar rather than naming her village — confirmed unchanged 2026-09-24 (DEC-0079 §7, DEC-0069 §8) |
| GL-0013 | TLD default language | The language a country domain renders without a URL prefix (FUN-WEB-0163, FUN-WEB-0164). | — | — |
| GL-0014 | conversion goal | Measurable action; canonical IDs in `@schafe-vorm-fenster/goals`. | — | — |
| GL-0015 | offering | Sellable product/service; canonical in `@schafe-vorm-fenster/offerings`; `promotion:` gates visibility. | Dorfkalender · euer Kalender / community calendar · your calendar | *das Produkt* · *the product* (CG-039); *Portalize* outside the one sentence DEC-0052 §1 allows (CON-WEB-0058, FUN-WEB-0132) |
| GL-0016 | audience / relation | Two-axis stakeholder model; canonical in `@schafe-vorm-fenster/audiences` (ADR-003). | — | — |
| GL-0017 | publisher / actor | An actor (club, church, business) that publishes dates; the `actors` audience once registered. | Akteur · der Verein, die Feuerwehr, die Kirchgemeinde / actor | *Organizer* (DEC-0062); *die Leute* · *the people* (CG-009) |
| GL-0018 | content hub | The GTM content packages the website consumes (FUN-WEB-0171, CON-WEB-0077). | — | — |
| GL-0019 | empty state | A place without dates — a conversion occasion, not an error (FUN-WEB-0153, FUN-WEB-0154, FUN-WEB-0045). | An invitation that names the next step and asks for one thing, in direct address. No word is fixed here: the sentence is copy under SRC-0017 CG-032, and this register carries terms, not sentences (DEC-0083) | |
| GL-0020 | STRICT | The requirements framework this spec follows, installed as `@leafcutter-strict/blueprint-complete` and cited by package name (DEC-0085). | — | — |
