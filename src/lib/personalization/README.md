# Personalization

TS-010 — how the website learns about a visitor without ever asking her, and
what it is allowed to do with what it learns. The stage table is normative in
`go-to-market-os/concept/website-communication-principles.concept.md` §6
("Assumptions, not switches"); the entry contexts are the context matrix of
the relevance model. This folder realises them.

It owns the **resolver**: the step that turns a request into the one flat
object the relevance engine consumes. It does not own scoring, ordering or
caching (that is `../relevance/`), and it does not own the empty place
calendar (that is TS-008).

## The one rule

> A higher stage changes **which elements are selected and in which order** —
> nothing else.

Everything else is invariant: page structure, focus job, primary conversion,
navigation, URL and canonical. The single exception on the whole website is
the empty place calendar, and that one is triggered by *data*, not by a stage.

Two of those invariants are enforced by shape rather than by discipline:

- the **focus job is an input** to `composeViewerContext()`, taken from the
  page's own declaration — no trait can change it (DEC-059, Q-052);
- an emphasis variant must be a **permutation** of the page's default order,
  so no trait can add, remove or rewrite a block (`emphasis.ts`).

## What a page calls

```tsx
import { PageFrame } from "@/app/[lang]/_page-frame";
import { DemoDataBadge } from "@/src/components/demo-data-badge/demo-data-badge";
import { SceneBlock } from "@/src/components/scene-block/scene-block";
import { resolveLocale } from "@/src/lib/i18n/locales";
import { emphasise } from "@/src/lib/personalization/emphasis";
import { composeViewerContext, statedPlaceSlug } from "@/src/lib/personalization/viewer-context";
import { selectRelevant } from "@/src/lib/relevance/select";
import { segmentCacheKey } from "@/src/lib/relevance/segments";

/** TS-019 D3a — the home page's own table. Ordering only. */
const SCENES = ["whatsapp", "embed", "provenance"] as const;
const SCENE_ORDER = {
  professional: ["embed", "provenance", "whatsapp"],
  "purchase-intent": ["embed", "provenance", "whatsapp"],
  press: ["provenance", "whatsapp", "embed"],
} as const;

export default async function HomePage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const locale = resolveLocale((await params).lang);
  const query = await searchParams;

  // One pass: route + language, entry context, location. Outside every
  // `use cache` boundary, because it reads the request.
  const { viewer, seed, location } = await composeViewerContext({
    focusJob: "know-what-is-on",
    locale,
    routeId: "home",
    params: query,
    referrer: null, // the proxy hands the `Referer` down — state/open.md
    statedPlace: await resolvePlace(statedPlaceSlug(query)), // geo-api, mocked today
    now: new Date(),
  });

  // Stage 2 in one line: the scenes keep their set, their CTAs and their
  // headings — only their order and the emphasis move.
  const scenes = emphasise(SCENES, SCENE_ORDER, viewer.trait);

  // The selection, and the key it may be cached under.
  const proof = selectRelevant({ items, viewer, surface: "home", now: new Date(), seed });
  const cacheKey = segmentCacheKey(viewer, seed); // relevance:none:direct:know-what-is-on:2026-W37

  return (
    <PageFrame locale={locale} route="home" meta={meta}>
      {location.demo ? <DemoDataBadge>{location.label}</DemoDataBadge> : null}
      {scenes.order.map((scene) => (
        <SceneBlock key={scene} id={scene} emphasised={scene === scenes.emphasised} />
      ))}
      {/* …the proof stream, exactly as in ../relevance/README.md */}
    </PageFrame>
  );
}
```

The **prerendered shell** needs no request at all:

```tsx
const viewer = stageZeroViewer({ focusJob: "know-what-is-on", locale });
```

That is the stage-0 result, and it is a complete page: place search present,
proof widely spread, every slot filled. A visitor who blocks JavaScript, a
crawler and a visitor whose lookup timed out all get it.

## The stages

| Stage | What is known | Source | What it may change | Filled by |
| --- | --- | --- | --- | --- |
| 0 | nothing | a direct visit, a crawler, a blocked or disabled lookup | — it *is* the default | `stageZeroViewer()` |
| 1 | an approximate location, county at best | the platform's request geo headers → geo-api | selection and order of proof and live modules | `resolveViewerLocation()` |
| 2 | the entry context | referrer, `etcc_*`/`utm_*` campaign parameters, deep link | which proof type opens the stream; scene order and emphasis | `resolveEntryTrait()` |
| 3 | a stated place | the place search, `?ort=<slug>`, or browser geolocation after an interaction | the same, now around the visitor's own place | `statedPlace` |

`stageOf()` derives the label; **nothing branches on it**. A field is either
known or `null`, and that is the whole mechanism (TS-010 D1).

### The traits (stage 2)

`social` · `professional` · `purchase-intent` · `reader-search` · `print-qr` ·
`press` · `activated` · `direct`. The ids are the shared constant
`ENTRY_TRAITS` in `../relevance/types.ts` — the resolver emits it, the engine
scores against it, the cache keys on it. Two vocabularies would silently
produce two segmentations.

Recognition is stated intent first, inferred intent second: a campaign
parameter outranks a referrer host. `direct` is the matrix's default case, not
a degraded one, and the trait is **never persisted** — no cookie, no storage,
no session.

## Location: the interface, and today's mock

Real geolocation reads the platform's request geo headers, and that is the
**proxy's** job. This folder owns the contract it hands over:

```ts
interface ViewerLocationResolver {
  resolveViewerLocation(request: ViewerLocationRequest): Promise<ViewerLocation>;
}
```

- `ViewerLocationRequest` = `{ requestGeo?, statedPlace?, privacySignal? }` —
  **there is no field for an IP address**, so none can be passed on, logged or
  traced (A11). `requestGeo` is the platform's `{ country, region, city }`,
  already read by the proxy.
- `ViewerLocation` = `{ geo, source, demo, label }` — `demo` and `label` carry
  the `Demo-Daten` badge to the surface.

Three implementations:

| Resolver | Answers | Used |
| --- | --- | --- |
| `mockLocationResolver` | a county-level demo location, `demo: true`, label `Demo-Standort` | the prototype — `Mock aktiv`, `state/open.md` |
| `disabledLocationResolver` | nothing known | production while Q-008 (the legal check) is open |
| the proxy's, later | the real hierarchy, truncated by `truncateToCeiling()` | after Q-008 and geo-api's coordinate → hierarchy endpoint (Q-032) |

`createViewerLocationResolver()` picks by configuration —
`GEO_STAGE1_SOURCE=mock` switches the mock on, and **anything else is off**,
which is the production default. Configuration is read at call time; no module
holds request state.

The **granularity ceiling** is a hard truncation, not a preference:
`community` is never reached from a request, `municipality` only when the
lookup is unambiguous. A visitor must never be shown that the site knows her
village before she said it — and it is what makes the engine's honest limit
true (geo tiers 0 and 1 fire only after a place search). A stated place
overwrites the inferred hierarchy **in full**, never field by field. A
`Sec-GPC: 1` or `DNT: 1` request skips the lookup and renders stage 0.

## The modules

| File | What |
| --- | --- |
| `viewer-context.ts` | **`composeViewerContext`** — the resolver; `stageZeroViewer`, `statedPlaceSlug` |
| `entry-context.ts` | `resolveEntryTrait` — query, referrer and landing route → one trait |
| `geolocation.ts` | the resolver interface, the mock, the disabled resolver, `truncateToCeiling` |
| `stages.ts` | `stageOf`, `STAGE_MODEL`, `MAY_CHANGE`, `MAY_NEVER_CHANGE` |
| `emphasis.ts` | `emphasise`, `orderByTrait`, `validateEmphasisTable` — order and emphasis, never structure |
| `regional.ts` | `selectRegionalVariant`, `validateVariantSet` — county → state → neutral |

No `index.ts`, for the reason `src/lib/content/README.md` gives.

## Acceptance criteria

| AC | State | Where |
| --- | --- | --- |
| TS-010-A1 resolver over every input path | ✅ unit | `viewer-context.test.ts`, `geolocation.test.ts` |
| TS-010-A2 granularity ceiling, stated place overwrites | ✅ unit | `geolocation.test.ts`, `viewer-context.test.ts` |
| TS-010-A3 trait mapping, one shared constant | ✅ unit | `entry-context.test.ts` |
| TS-010-A4 structure invariance across stages | ⚠️ integration | `/dein-ort` walks stage 0 and stage 3 (`e2e/pages/dein-ort.spec.ts` A2/A3) with the same blocks in the same order; the trait half (stage 2) cannot fire while the proxy hands no `Referer` down |
| TS-010-A5 stage-0 completeness, no geo lookup | ✅ integration | `e2e/pages/dein-ort.spec.ts` TS-020-A10 and `home.spec.ts` TS-019-A11 — both with JavaScript disabled |
| TS-010-A6 cacheability, no `Vary`, no `Set-Cookie` | 🔜 integration | pages and `proxy.ts` |
| TS-010-A7 no classification control | 🔜 e2e | pages |
| TS-010-A8 browser geolocation only after an interaction | 🔜 e2e | the place-search control (D5) — client-side, another package |
| TS-010-A9 build check on variant sets | ⚠️ tool | `validateVariantSet()` exists; wiring it into `pnpm check` belongs to whoever ships the sets as content |
| TS-010-A10 county → state → neutral | ✅ unit | `regional.test.ts` |
| TS-010-A11 no IP value anywhere | 🔜 static | the interface forbids carrying one; the check over the proxy is M5's |
| TS-010-A12 nothing persisted | 🔜 e2e | pages — nothing in this folder writes anything |
| TS-010-A13 language suggestion | ⛔ not built | D10, deferred by Q-011 |
| TS-010-A14 focus-job stability | 🔜 e2e | pages — enforced here by the shape of the call |
| TS-010-A15 Q-008 sign-off before production | ⛔ manual | the flag is off unless `GEO_STAGE1_SOURCE=mock` |

## What this folder needs from others

1. **`proxy.ts`** — hand the request's `Referer`, the platform geo headers and
   a `Sec-GPC`/`DNT` signal to the page; `ViewerLocationRequest` is the shape.
   Until then `referrer` is `null` on every request and stage 2 never fires in
   the running app, although the logic and its tests are complete.
2. **The place search** — resolve `?ort=<slug>` against geo-api and pass the
   hierarchy as `statedPlace`. `statedPlaceSlug()` reads the parameter.
3. **`src/lib/content/`** — the press/podcast referrer allowlist is content,
   not code (D3). `PRESS_REFERRER_HOSTS` is a seed list until the content
   build ships one; every caller can already override it.
