# The content pipeline

TS-007, the website side. Hub packages in, schema-validated markdown per
locale out, with a provenance key that makes updates diffable. This folder is
the *read* half — the loader a page calls, the parser under it, the source
adapter, and the rules `pnpm check:content` runs. Generation (P3/P7) is a
playbook, not code, and lives in `.agents/`.

`specs/tactical/content-pipeline.tactical.md` is the law; ADR-074 records the
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
  derivedFrom: ["ia"],            // TS-007 D6, the update key
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
an inline comment (ADR-074 §1 — TS-007 D4 writes one file per *slot*; the
loader reads what M3 shipped):

```
content/pages/<route-slug>/<locale>.md

## Slot 1 — Suchfeld

<!-- id: home-1-search-hero; content_type: hero; provenance: sourced;
     derived_from: [ia]; status: draft -->

**Headline:** Was ist bei dir los?
```

`/deine-region/angebot` has no file of its own: TS-026 specifies it together
with `/deine-region`, and its slots (`deine-region-angebot-*`) live in that
page's artifact. `CONTENT_PAGE_DIRS` in `loader.ts` is the map.

## The modules

| File | What |
| --- | --- |
| `loader.ts` | `loadPage`, `slot`, `slotsOfType`, `parsePage` (pure). The only module a page imports. |
| `slot-meta.ts` | the one place that knows the metadata-comment syntax |
| `blocks.ts` | a slot body → typed blocks; `fieldAt`, `fieldsOf`, `ctaOf` |
| `provenance.ts` | `slotState`, `isDemoSlot` — the badge decision, once |
| `page-seo.ts` | `pageSeo(route, locale)` — the `seo` block of TS-011 D5, read synchronously |
| `source-refs.ts` | the source adapter of TS-007 D2: `resolve(ref) → record \| fail`, over the packages' `index.json` |
| `validate.ts` | the D12 rules, shared by `scripts/check-content.ts` and the tests |
| `types.ts` | `PageContent`, `ContentSlot`, `ContentBlock` |

**There is no `index.ts`, on purpose.** `source-refs.ts` opens hub packages
in `node_modules`, which TS-007 D3 forbids at request time; a barrel would
let a page pull it into the request path by importing one symbol. The loader
imports it nowhere.

The schemas live in `src/domain/content-frontmatter.schema.ts` — the TS-007
layer at the bottom of the file.

## The `seo` block (TS-011 D5)

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
one warning, never a throw; `pnpm check:seo-budget` (TS-011-A7) is the gate
that refuses the build. Before F-2-72, a template in
`src/lib/i18n/dictionary.ts` answered for these two strings, and every route
in both languages served a work-package name and a spec-clause id as its meta
description.

## The gate

`pnpm check:content` (in `pnpm check`, before `check:specs`). ~0.3 s.

Errors: an artifact that does not parse · a `page_id` that is not the spec
the route table names (TS-017-A14) · a slot comment that does not validate ·
a duplicate slot id · an unresolvable, malformed or version-mismatched
`derived_from` · an empty `derived_from` on a `sourced` slot · a missing
locale sibling · a locale that ships a different slot set, different records
or a different provenance than the default locale.

Warnings: a `withheld` or `mixed` slot with no source · a `generated` slot
not marked `demo`. Both are content questions with a `state/open.md` row, not
code defects. `--warn-missing-locale` downgrades the locale-completeness
error, for the window while a locale is being written.

### Not implemented yet

Of TS-007 D12's twelve rows, six do not run, and the reason is always that
the artefact they check against does not exist yet:

| D12 | Missing |
| --- | --- |
| 2 length budgets | the per-field `max()` of the full D5 reshape |
| 4 clearance re-validation | the `clearance` facet on the artifacts (and D7's `RelevanceFacets` as a whole) |
| 6 hub id resolution | audience/goal/offering ids are not yet carried in page frontmatter |
| 9 slot binding (the composition half) | Layer C — page compositions have no spec (TS-007 open point) |
| 10 segment independence | a rule for which strings are "generated" once facets exist |
| 11 glossary conformance | the use-this-word/avoid-this-word columns (TS-007 open point) |
| 12 legal | `content/legal/` is still the flat pre-relaunch tree without `locale`/`anchor` |

They are on `state/open.md`, not silently absent.
