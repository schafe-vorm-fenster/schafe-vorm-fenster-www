---
id: DEC-0120
title: The band is a menu with a blurb — the page's slot supplies it, the registry stands in, and the language switch offers only the other language
status: DRAFT
date: 2026-09-25
decided_by: the engineering team
---

## Context

The 2026-09-22 review (`plan/reviews/2026-09-23/2026-09-22 Review SVF Preview
Website.md`, "Heute mit einem anderen Anliegen hier?", "Footer", `/ueber-uns`
"Seitenname", "Warum das zählt", "Was andere sagen") and its spec impact
(`plan/reviews/2026-09-23/spec-impact.md` theme J) leave the chrome vocabulary
with five open choices that no determination takes:

1. **The band's blurb.** `TS-WEB-0006 D5` wants "an offer in the visitor's own
   voice, not a menu" — one entry per job, no blurb, wording deferred to
   `SRC-0017 CG-030`. CG-030 (`concept/website-copy-guide.md:369`) budgets a
   field that does not exist and carries `[PROPOSED]` for that reason; its
   §6 note (`:398-416`) names what the spec must add — a `blurb` on the
   entry, rendered beside label and target, per locale, and *where the text
   comes from*: "the job registry carries it per job". The review asks for
   the opposite of D5's phrasing: a menu, rows under each other with a
   frame, and "zu jedem Link einen Halbsatz, der Zielgruppe und Inhalt
   aufgreift", with one sentence supplied for the publish entry.
2. **The fourth label.** `TS-WEB-0004 D4` fixes "Warum wir → `/ueber-uns`".
   The review rejects it twice (R-home-33, R-ueber-1) and names "Über uns"
   as the neutral choice; the copy guide's avoid list (`:514`) says the same.
3. **The language switch.** `TS-WEB-0001 D5` determines plain `<a>`
   navigation and leaves "visual form and exact footer placement" `[FREE]`
   (`:101`). The review wants an invitation ("Read this page in Englisch:")
   and asks whether the current language must stand there as a button at
   all ("eigentlich unnütze").
4. **The legal base line** — "Den Impressums-Footer optisch abheben".
5. **The kickers.** `kickers.whyItMatters` ("Warum das zählt"),
   `kickers.evidence` ("Wer das schon macht") and `kickers.origin` ("Wo das
   herkommt") are on the avoid list (`:513-516`); the review replaces two
   (CG-018 "Was hilft euch das?", R-ueber-3 "Die Geschichte"), splits the
   third ("Was andere sagen" for press proof; customers are "wer das schon
   macht" but that heading is rejected) and names no replacement for the
   customer half (copy guide, open decision 2). `newsletter.heading`
   ("Neuigkeiten aus dem Projekt") is CG-029's own avoid example.

Working rule 4 (`AGENTS.md`) forbids writing page copy; the repository's
placeholder convention (DEC-0068; `src/lib/content/validate.ts:112-133`) marks
a sentence nobody wrote in the markup, never in a word the visitor reads.

## Decision

1. **The band is a menu with a blurb.** Each of the three entries renders as
   a framed row of at least 44 px carrying the job label, a blurb of at most
   80 characters and an arrow (`src/components/context-band/`). The blurb is
   read **from the page's own `context-band` slot** — one list item per job,
   `Label: blurb → /path`, matched to its job by the path through the
   route table, never by the label text — and **the registry stands in** for
   a page without a slot or a slot without that item
   (`dictionary.contextBand.blurbs`, keyed by the job's label key;
   `src/lib/content/context-band.ts`). The band's heading is the slot's
   kicker, as before. This departs from CG-030's §6 note, which puts the
   text in the job registry so the three entries "cannot drift from the
   fourth page's own description": the pages already carry their band
   wording per page (`state/open.md` row 95: "its own band text rather than
   the shared home sentence"), and a page's slot is the place its copy is
   reviewed, so the slot wins and the registry guarantees only that every
   entry has a sentence. **CG-030 becomes the predicate** `isBandStatement`:
   a statement, ≤ 80 characters, no question mark (CG-005). An entry whose
   blurb is not one yet renders `data-demo="true"` — today that is every
   entry except the publish one, because the artifacts phrase the band as
   questions and only the publish sentence exists as a statement (the
   review's own, `copy-guide.md:384-385`). `TS-WEB-0006 D5`'s "an offer, not a
   menu" and "no blurb" are superseded by this record; the amendment of D5's
   table and of `TS-WEB-0007 D5`'s slot type is left to the spec owner and
   named in the consequences.
2. **The fourth label is "Über uns" / "About us."** `TS-WEB-0004 D4` is
   amended in place; the dictionary key stays `whyUs` because it is the job
   id's name in code. The sender surface is the one label that names the
   page rather than a job — the `FUN-WEB-0002` carve-out theme J asks for.
3. **The language switch renders only the other language as a control.** The
   current language is the page the visitor is reading and is not a control.
   Each control is an invitation in the target language followed by the
   language's endonym as the link, `hreflang` and `lang` on the link, `lang`
   on the invitation; the target is the equivalent page (A7). `TS-WEB-0001
   D5` gains this paragraph and the `[FREE]` shrinks to the footer placement.
   The English invitation is the review's sentence, spelling corrected
   ("Read this page in English:"); the German twin is nobody's and carries
   `data-demo="true"`.
4. **The legal base line stands on its own ground** — `surface2` under a
   hairline, padded, reaching the container's edges
   (`site-footer.module.css`; the markup is unchanged).
5. **The kicker keys are replaced, not softened.** `whyItMatters` → "Was
   hilft euch das?"; `origin` → "Die Geschichte"; `evidence` is split into
   `othersSay` ("Was andere sagen", press and appearances) and `customers`
   (customer proof), and `customers` is a **placeholder** because the copy
   guide names no replacement. `evidence` stays in the interface as a
   deprecated alias that resolves to the `othersSay` wording — owner copy
   (copy guide `:516`), never the placeholder — so the five pages that read
   it compile, none renders the avoid-list word and none renders an unmarked
   placeholder; the alias is right for the press streams on `/` and
   `/ueber-uns` and a generic over the customer blocks on `/mitmachen`,
   `/dein-kalender` and `/deine-region`. Only a page that chooses
   `customers` explicitly renders the placeholder, and it marks the block
   `data-demo="true"`; each page picks its key when its proof block is next
   touched — the pages belong to other tasks and are not edited here.
   `newsletter.heading` names two of the review's
   three concrete things ("Neue Funktionen und aktuelle Angebote"; CG-029
   title ≤ 40) as a placeholder; the block is `data-mock` already and is
   withheld behind a null constant until a sending system exists (T-10's
   own record). English twins of owner wording are translations, the way every
   other dictionary string has been since TS-WEB-0001 D7 — they are not new
   sentences.

## Consequences

- The band on a page that passes its slot (`PageFrame`'s new `contextBand`
  prop) shows that page's blurbs; a page that passes only the heading shows
  the registry's. Today no page passes its slot, so every band shows the
  registry's words. The two are not the same words for the publish entry:
  the slot item on `/` (`content/pages/home/de.md:251`) is a question ("Du
  willst Termine für deinen Verein, deine Feuerwehr oder deine Gemeinde
  eintragen?"), while the registry carries the owner's CG-030 statement.
  Wiring `contextBand={slot}` as the slot stands would demote that row from
  an unmarked statement to a `data-demo` question, so a page owner replaces
  the slot's publish item by the CG-030 statement before wiring the slot
  (`state/open.md` rows 215–216).
- `app/[lang]/_page-frame.tsx` (T-10's) gained more than the heading
  pass-through the task foresaw: an optional `contextBand?: ContentSlot`
  prop handed on to `ContextBand`, with the band heading falling back to
  that slot's first field. Nothing else in the file changed; T-10's owner
  keeps it.
- Placeholders this record ships, each `data-demo="true"` in the markup and a
  row in `state/open.md`: the three question blurbs per language (rows 215,
  216), the German invitation (row 219), `kickers.customers` (row 218;
  nothing renders it until a page picks the key) and `newsletter.heading`
  (row 217; withheld with the block).
- Spec follow-ups outside this task's ownership: `TS-WEB-0006 D5`'s Phrasing
  row (menu with blurb, the slot as source, the registry as fallback) and
  `TS-WEB-0007 D5`'s `blurb` field on the `context-band` slot type; CG-030's
  `[PROPOSED]` marker can drop once both land. Until then this record is
  what makes CG-030 a determination (AGENTS.md rule 8: the deviation from
  D5's "offer, not a menu" is recorded here, not silent).
- `e2e/site-header.spec.ts`, `e2e/pages/mitmachen.spec.ts`,
  `e2e/pages/dein-kalender.spec.ts` and `e2e/content-compliance.spec.ts` pin
  the replaced strings and were edited by one string each so the suite
  states the tree; their owners keep them. `e2e/context-band.spec.ts` and
  `e2e/language-switch.spec.ts` are new, written for this record's two
  components, and belong with them although `e2e/` is outside the task's
  listed files.
