# The content pipeline

TS-WEB-0007, the website side. Hub packages in, schema-validated markdown per
locale out, with a provenance key that makes updates diffable. This folder is
the *read* half — the loader a page calls, the parser under it, the source
adapter, and the rules `pnpm check:content` runs. Generation (P3/P7) is a
playbook, not code, and lives in `.agents/`.

`specs/tactical/TS-WEB-0007--content-pipeline.tactical.md` is the law; ADR-074 records the
determinations this implementation had to make on top of it.

## What a page calls

One function. It returns a typed page, it never throws, and it reads
`content/` and nothing else.

```tsx
import { SectionShell } from "@/src/components/section-shell/section-shell";
import { HeroBlock } from "@/src/components/hero-block/hero-block";
import { ProofStream } from "@/src/components/proof-stream/proof-stream";
import { fieldAt } from "@/src/lib/content/blocks";
import { loadPage, slot } from "@/src/lib/content/loader";
import { slotState } from "@/src/lib/content/provenance";
import { resolveLocale } from "@/src/lib/i18n/locales";

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const locale = resolveLocale((await params).lang);
  const page = await loadPage("home", locale);

  const hero = slot(page, "home-1-search-hero");
  const proof = slot(page, "home-8-proof-stream");

  return (
    <>
      <SectionShell surface="paper" labelledBy="hero">
        <HeroBlock
          id="hero"
          headline={hero.fields["Headline"]}
          lead={fieldAt(hero.blocks, 3)}
          cta={hero.cta}
          locale={locale}
          to="place"
        />
      </SectionShell>

      <SectionShell surface="ink" labelledBy="proof">
        <ProofStream
          cards={proof.blocks}
          locale={locale}
          state={slotState(proof)}
        />
      </SectionShell>
    </>
  );
}
```

- **`loadPage(routeId, locale)`** — `routeId` is a `RouteId` from
  `src/lib/routes/routes.ts`, never a path. Returns `PageContent` with the
  slots in file order.
- **`slot(page, id)`** — one slot by its locale-free id. An unknown id gives
  a typed empty slot with a `reason`, logged once, so the page renders its
  empty state instead of throwing mid-render.
- **`slotsOfType(page, "proof-card")`** — every slot of one content type,
  where a block renders a set rather than a named slot.
- **`slotState(slot)`** — the `state` prop the components already understand
  (`src/components/data-state.ts`): `mocked` for dummy content, so the module
  puts the `Demo-Daten` badge on itself; `empty` for a slot that could not be
  read; otherwise whatever the page's own data situation is
  (`slotState(slot, "degraded")`).

- **`fieldAt(slot.blocks, 0)`** — the n-th labelled value. **Use this, not
  `fields["…"]`, for anything a second locale also carries**: the artifacts
  translate their field labels (`Sucheingabe (Placeholder)` /
  `Search input (placeholder)`), so a label lookup silently returns
  `undefined` on `/en`. Order is what harmonisation guarantees, and
  `check:content` fails a locale whose block sequence differs. `fields` stays
  useful for the labels that are the same word in both (`Headline`,
  `Button`, `Kicker`, `Link`, `Text`).

A page never reads `slot.demo`, never decides per block whether to show a
badge, and never touches a file path or a YAML key.

### What a slot carries

```ts
{
  id: "home-1-search-hero",
  contentType: "hero",
  provenance: "sourced",          // sourced | generated | sourced-empty-by-design | withheld | mixed
  demo: false,                    // dummy content → the Demo-Daten badge
  derivedFrom: ["ia"],            // TS-WEB-0007 D6, the update key
  status: "draft",
  title: "Slot 1 — Suchfeld, kein Ort bekannt",
  cta: "Suchen",
  fields: { Headline: "Was ist bei dir los?", Button: "Suchen" },
  blocks: [ { kind: "field", … }, { kind: "list", … }, { kind: "table", … } ],
  body: "**Headline:** …",        // the raw markdown, for debugging
  empty: false,
}
```

Bodies are **typed blocks, not HTML** (ADR-074 §2): four shapes — `field`,
`paragraph`, `list`, `table` — cover all 172 shipped slots, components take
content as typed props, and no HTML string ever needs
`dangerouslySetInnerHTML`.

## The artifact shape it reads

One file per page per locale, one `##` section per slot, per-slot metadata in
an inline comment (ADR-074 §1 — TS-WEB-0007 D4 writes one file per *slot*; the
loader reads what M3 shipped):

```
content/pages/<route-slug>/<locale>.md

## Slot 1 — Suchfeld

<!-- id: home-1-search-hero; content_type: hero; provenance: sourced;
     derived_from: [ia]; status: draft -->

**Headline:** Was ist bei dir los?
```

`/deine-region/angebot` has no file of its own: TS-WEB-0026 specifies it together
with `/deine-region`, and its slots (`deine-region-angebot-*`) live in that
page's artifact. `CONTENT_PAGE_DIRS` in `loader.ts` is the map.

## The modules

| File | What |
| --- | --- |
| `loader.ts` | `loadPage`, `slot`, `slotsOfType`, `parsePage` (pure). The only module a page imports. |
| `slot-meta.ts` | the one place that knows the metadata-comment syntax |
| `blocks.ts` | a slot body → typed blocks; `fieldAt`, `fieldsOf`, `ctaOf` |
| `provenance.ts` | `slotState`, `isDemoSlot` — the badge decision, once |
| `page-seo.ts` | `pageSeo(route, locale)` — the `seo` block of TS-WEB-0011 D5, read synchronously |
| `source-refs.ts` | the source adapter of TS-WEB-0007 D2: `resolve(ref) → record \| fail`, over the packages' `index.json` |
| `validate.ts` | the D12 rules, shared by `scripts/check-content.ts` and the tests |
| `types.ts` | `PageContent`, `ContentSlot`, `ContentBlock` |

**There is no `index.ts`, on purpose.** `source-refs.ts` opens hub packages
in `node_modules`, which TS-WEB-0007 D3 forbids at request time; a barrel would
let a page pull it into the request path by importing one symbol. The loader
imports it nowhere.

The schemas live in `src/domain/content-frontmatter.schema.ts` — the TS-WEB-0007
layer at the bottom of the file.

## The `seo` block (TS-WEB-0011 D5)

A page artifact's frontmatter carries the `<title>` and the meta description
of every route it serves, keyed by the German route path:

```yaml
seo:
  "/deine-region":
    title: "Kalender für euer ganzes Gebiet"
    description: "Das ganze Kreisgebiet in einem Kalender, …"
    provenance: generated
```

Keyed, not a single pair, because one artifact can serve more than one route
(`/deine-region/angebot` shares `/deine-region`'s file — `CONTENT_PAGE_DIRS`),
and two routes are two documents to a search engine. The key is the German
path in the `de` and the `en` file alike, the same locale-free convention slot
ids follow.

`page-seo.ts` reads it **synchronously**, unlike everything else here:
`pageTitle()` is called from inside a render, and an async metadata source
would make those call sites async. A missing or malformed block is `null` plus
one warning, never a throw; `pnpm check:seo-budget` (TS-WEB-0011-A7) is the gate
that refuses the build. Before F-2-72, a template in
`src/lib/i18n/dictionary.ts` answered for these two strings, and every route
in both languages served a work-package name and a spec-clause id as its meta
description.

## The gate

`pnpm check:content` (in `pnpm check`, before `check:specs`). ~0.3 s.

Errors: an artifact that does not parse · a `page_id` that is not the spec
the route table names (TS-WEB-0017-A14) · a slot comment that does not validate ·
a duplicate slot id · an unresolvable, malformed or version-mismatched
`derived_from` · an empty `derived_from` on a `sourced` slot · a missing
locale sibling · a locale that ships a different slot set, different records
or a different provenance than the default locale.

Warnings: a `withheld` or `mixed` slot with no source · a `generated` slot
not marked `demo`. Both are content questions with a `state/open.md` row, not
code defects. `--warn-missing-locale` downgrades the locale-completeness
error, for the window while a locale is being written.

### Not implemented yet

Of TS-WEB-0007 D12's fourteen rows, five do not run, and the reason is always
that the artefact they check against does not exist yet:

| D12 | Missing |
| --- | --- |
| 2 length budgets | the per-field `max()` of the full D5 reshape |
| 4 clearance re-validation | the `clearance` facet on the artifacts (and D7's `RelevanceFacets` as a whole) |
| 6 hub id resolution | audience/goal/offering ids are not yet carried in page frontmatter |
| 9 slot binding (the composition half) | Layer C — page compositions have no spec (TS-WEB-0007 open point) |
| 10 segment independence | a rule for which strings are "generated" once facets exist |
| 12 legal | `content/legal/` is still the flat pre-relaunch tree without `locale`/`anchor` |

They are on `state/open.md`, not silently absent.

### The copy lint — what rows 11, 13 and 14 do and do not do

`checkCopy()` and `checkProductName()` are the machine half of
`specs/contracts/copy-contract.md`. They read **copy**, and copy is everything
a slot authors, whatever its shape: field values, paragraphs, and the list items
and table cells that belong to a field of the same slot. Three things are not
copy, and all three are explicit rather than positional (DEC-0142 §1, §11):

- a field **label** — a slot-internal name, not a rendered string, which is why
  a field may be labelled `Warum es zählt` while the avoid list forbids that
  wording on the page (DEC-0136);
- an **annotation comment** (`<!-- source_note: … -->`, `<!-- clearance: … -->`)
  — a note to the next author. `parseBlocks` emits no block for it at all, so it
  is neither linted nor counted in the paragraph index a page reads;
- the **pre-slot preamble** — the lines between the frontmatter and the first
  `<!-- id: … -->` slot, where an artifact tells the next author what the page
  may and may not say (`content/pages/dein-kalender/de.md:3`: „Portalize" falls
  on this page *exactly once*; `content/pages/mitmachen/de.md:3`: the name
  belongs nowhere on that one). It is the marker's case without the marker:
  `parsePage` binds copy to slots and carries no text outside them, so nothing
  renders it and nothing lints it. The fixture in `validate.test.ts` states the
  region and the line where it ends (DEC-0142 §11) — scanning it would fail the
  build over the two sentences that forbid the words they quote.

**A list or table binds to the last field above it, across any paragraph
between them, and a paragraph carries that field's label too** — never its title
role, because prose below a heading is the lead, not a second heading. The one
exclusion is the marker: a slot that writes `<!-- note -->` marks everything
from that line **to the next `**Label:**` field, or to the end of the slot**, as
authoring prose; those paragraphs, lists and tables carry `note: true` and are
not read. A field is where authored copy starts again, so a slot that
interleaves notes with copy (`dein-kalender-4-tiers`: one note per tier) marks
each note without reaching the next tier's words.

Until DEC-0142 the exclusion was positional — *a list whose nearest preceding
block is a paragraph is a note*, and *a paragraph is always a note* — and
position exempted fourteen blocks the pages **render**. They are scanned now,
and the marker may not cover them: `RENDERED_BLOCKS` in `validate.ts` is the
registry of what `app/**` reads off a slot, and `checkNoteMarker()` fails a
`<!-- note -->` marker placed above any of it — the escape hatch cannot do what
the positional rule did.

| Slot | Blocks a page reads | Read at |
| --- | --- | --- |
| `home-8-proof-stream` | the candidate list | `app/[lang]/page.tsx:186` |
| `home-4a-scene-whatsapp-steps-demo` | lists 0 and 1 — step lines, sample rows | `app/[lang]/page.tsx:772`, `:765` |
| `mitmachen-2-objections` | lists 0 and 1 — the two objection columns | `app/[lang]/mitmachen/page.tsx:228` |
| `mitmachen-3a/4a/5a-path-*-steps-demo` | lists 0 and 1 each | `app/[lang]/mitmachen/page.tsx:391`/`:384`, `:427`/`:421`, `:471`/`:465` |
| `mitmachen-7-proof-demo` | **every** list (`listItems`) | `app/[lang]/mitmachen/page.tsx:192` |
| `ueber-uns-3-proof-stream` | the five proof items under *Pool: …* | `app/[lang]/ueber-uns/page.tsx:156` |
| `deine-region-6-proof-demo` | the three quote items | `app/[lang]/deine-region/page.tsx:196` |
| `dein-kalender-5-proof-demo` | **every** list (`listItems`) | `app/[lang]/dein-kalender/page.tsx:286` |
| `archiv-2-rows-demo` | the 192-cell archive table | `app/[lang]/ueber-uns/archiv/page.tsx:95` |
| `dein-kalender-2-contrast` | the four comparison rows and the head | `app/[lang]/dein-kalender/page.tsx:218`, `:219` |
| `dein-kalender-3-embed-demo` | paragraph 0 — the two embed sentences | `app/[lang]/dein-kalender/page.tsx:194` |
| `dein-kalender-3b-embed-config` | paragraphs 0 and 1, and the settings table | `app/[lang]/dein-kalender/page.tsx:198`, `content.ts:58` |
| `dein-kalender-4-tiers-checks-demo` | the tier-checks table | `app/[lang]/dein-kalender/content.ts:58` |
| `rechtliches-2-registry` | the section-title table | `app/[lang]/rechtliches/page.tsx:91` |
| `registrieren-2-wer`, `registrieren-3-weg` | **every** list — the option labels | `app/[lang]/mitmachen/registrieren/page.tsx:189`, `:193` |

**The registry is no longer hand-kept against the pages.** QA round 4 measured
what a hand-kept list costs: seven rows stood here while `app/**` read twelve
slots, and two of the five missing ones (`home-8-proof-stream`,
`mitmachen-2-objections`) already carried a marker — the hatch could still
silence copy a visitor reads. Three drift tests in `validate.test.ts` now read
`app/**` themselves and fail on

1. a slot a page reads by index or by kind (`listAt`, `listItems`,
   `settingRows`, `tierChecks`, `comparisonLabels`, …) with no row here,
2. a row whose `file:line` no longer reads blocks — a stale row cannot sit in
   the registry unnoticed,
3. a `block.kind === "list" | "table" | "paragraph"` read that neither a row nor
   a declared helper accounts for.

`index: "all"` is the row for a page that reads *every* block of a kind
(`listItems(slot.blocks)`): there no index is safe.

The authoring notes the positional rule was written for carry the marker
instead: the four deviation lists of `dein-kalender-3b-embed-config`, the two
tier notes that quote `Portalize` in order to record its one place, and the
eight trailing notes of `home-8`, `mitmachen-2-objections`,
`dein-kalender-1-focus`, `dein-kalender-2-contrast` and `ueber-uns-1-origin`
that quote an avoid-list term in order to forbid it — every one of them stands
**below** the blocks its page reads, so they still pass (`pnpm check:content`:
*Content pipeline is valid*). Moving one of them up now fails: the marker above
`home-8-proof-stream`'s candidate list reports *[note-marker] … covers list 0 …
`app/[lang]/page.tsx:186` renders it*.

A note that stands **above** rendered copy in the same slot and before its next
field cannot be marked, and is read as copy: `home-8-proof-stream`'s pool
sentence is such a note, and it passes because it quotes no forbidden term. That
is the safe direction — an unmarked note is linted, never a rendered sentence
silenced.


| Row | Runs | Left to review |
| --- | --- | --- |
| 11 avoid list (CG-040, CG-009, CG-017, CG-018, CG-035, CG-036, CG-039) | every term of the guide's DE and EN tables and of the glossary's avoid column; `AVOID_TERMS` is the list and two drift tests bind it to all three sources — the glossary's avoid column and the two CG-040 tables of `concept/website-copy-guide.md` §9 (39 terms today) | the generic-claims row as an *adverb* (`einfach` inside a sentence): the row carries no replacement, so failing it would force an invention — TS-WEB-0006-A16 |
| 11 product name (CG-038) | `Portalize` **once** per locale — counted as occurrences, not as carrier fields, so `Portalize bleibt Portalize` in the one allowed field fails too — and only in the `/dein-kalender` tier slot; case-sensitive, so the offering id `portalize-calendar` in a data cell is not a hit | — |
| 13 copy structure (CG-005, CG-004) | a question mark in a section-title-role field (a field whose page renders it as a paragraph is relabelled, never reworded — DEC-0136 §2); the back-reference phrases; `im Amt` without a second addressee | CG-015 word-stem doubling and CG-034 volatile numerals stay review-level (`copy-contract.md`); "states what works" is meaning |
| 14 register (CG-003) | a capitalised `Sie`/`Ihnen`/`Ihre*` mid-sentence and an imperative `<Verb> Sie`, with `/rechtliches` exempt whole and by route | CG-002's other half — one field mixing `du` and `ihr` — and the imported legal bodies under `content/legal/`, which the page scan does not reach |

**A row-13 finding is about the label, not about the words.** The role of a
field is read off its label, and an artifact cannot say whether the page sets
that field as an `h2` or as a paragraph. So a field labelled `Überschrift` that
the page renders as prose is reported here, and the repair is to relabel it
(`Frage` / `Question`, the way `/dein-kalender/bestellen` step 3 does) or to
author a `Kicker` field and leave the statement as the title — never to shorten
the sentence. The finding's own message says so, and the halves that need a
render — no `h2` of a rendered page is a question (CG-005), and the product name
in the header, footer and context band of every route (TS-WEB-0018-A7) — are in
`e2e/copy-structure.spec.ts`, where `/rechtliches` is exempt from the body count
because the imported legal bodies name the product contractually (DEC-0136 §10,
CONF-0027 — the criterion is not met on the render, and the exemption says so
rather than hiding it).

**The row-14 route exemption is proven by fixture, and unexercised by the tree.**
`REGISTER_EXEMPT_ROUTES = ["legal"]` is covered by `validate.test.ts`, which runs
one formal sentence through a `legal` fixture (no finding) and an `about` one
(a finding). It changes nothing about the shipped tree: emptying the list and
running `pnpm check:content` still reports 0 errors, because the `/rechtliches`
page artifacts carry no `Sie` form of their own, and the five imported bodies
under `content/legal/` — which do carry the formal register — are not page
artifacts and are never scanned. So a green run is **not** evidence that the
legal bodies pass this row; it is evidence that they are out of its reach.
