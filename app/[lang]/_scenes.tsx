/**
 * Block 2a of `/` — the three scenes, in the order the entry trait asks for
 * (TS-WEB-0019 D3a, DEC-0109 §2, DEC-0140).
 *
 * D3a is ordering and nothing else: *"No trait adds, removes or rewrites a
 * block, and no trait changes which mechanism carries the module."* That is
 * enforced by shape rather than by discipline — `HOME_SCENE_ORDER` is an
 * `EmphasisTable`, and `orderByTrait()` refuses a variant that is not a
 * permutation of the default order and falls back to that order
 * (`src/lib/personalization/emphasis.ts`). The three scene nodes are built once
 * by the page and only re-ordered here, so a trait cannot reach inside one.
 *
 * **Why there is a boundary.** The trait is a request value: it comes from the
 * `Referer` header, which the proxy hands down as one request header
 * (`entry-handover.ts`). Reading a header makes the reader dynamic, and `/`
 * must stay a prerendered route (TS-WEB-0010 D8: *"No route becomes a
 * per-request function because of personalization"*, DEC-0045). So the read
 * sits inside a `<Suspense>` boundary whose **fallback is the `direct` order** —
 * which is the stage-0 result and what a crawler, a JS-less visitor and a
 * visitor with no referrer get (TS-WEB-0019-A7's second load). The boundary
 * renders its fallback and its resolved branch through the same component, the
 * way block 1's three boundaries do.
 *
 * `TS-WEB-0009-A14` holds here by construction: the scenes hold no `<input>`,
 * `<textarea>` or `<select>` — the page's two search fields stand in the
 * prerendered shell (DEC-0078) — so nothing a boundary reveal replaces can
 * carry a value a visitor typed. The three step lines inside the `whatsapp`
 * scene's module are `<button>`s, which hold no value.
 */

import { Fragment, Suspense } from "react";
import { headers } from "next/headers";

import { orderByTrait } from "@/src/lib/personalization/emphasis";
import { resolveEntryTrait } from "@/src/lib/personalization/entry-context";
import {
  ENTRY_CONTEXT_HEADER,
  decodeEntryHandover,
} from "@/src/lib/personalization/entry-handover";

import type { EmphasisTable } from "@/src/lib/personalization/emphasis";
import type { EntryTrait } from "@/src/lib/relevance/types";
import type { ReactNode } from "react";

/** The three mechanisms of TS-WEB-0019 D3a, in the `direct` order. */
export const HOME_SCENES = ["whatsapp", "embed", "provenance"] as const;

export type HomeScene = (typeof HOME_SCENES)[number];

/**
 * TS-WEB-0019 D3a's own table. The five traits it does not name —
 * `direct` · `social` · `print-qr` · `reader-search` · `activated` — take the
 * default order, which is what the table gives them.
 */
export const HOME_SCENE_ORDER: EmphasisTable<HomeScene> = {
  professional: ["embed", "provenance", "whatsapp"],
  "purchase-intent": ["embed", "provenance", "whatsapp"],
  press: ["provenance", "whatsapp", "embed"],
};

/** The D3a order for one trait. Never throws; falls back to the `direct` order. */
export function homeSceneOrder(trait: EntryTrait): readonly HomeScene[] {
  return orderByTrait(HOME_SCENES, HOME_SCENE_ORDER, trait);
}

/**
 * The trait of the current request, from the proxy's handover. `direct` when
 * the header is absent — which is every request that arrived without an entry
 * context, and also `next dev`'s and a test's, so the default never depends on
 * the proxy having run.
 */
async function requestTrait(): Promise<EntryTrait> {
  const handover = decodeEntryHandover((await headers()).get(ENTRY_CONTEXT_HEADER));
  return resolveEntryTrait({
    // The landing route and its focus job are the page's own, not the
    // request's — TS-WEB-0010 D7: a trait may reorder within a page, it may
    // never redefine what the page is for.
    focusJob: "know-what-is-on",
    params: handover.medium === null ? {} : { etcc_med: handover.medium },
    referrerHost: handover.referrerHost,
    routeId: "home",
  });
}

export interface HomeScenesProps {
  /** One node per mechanism. Built by the page; this module only orders them. */
  readonly scenes: Readonly<Record<HomeScene, ReactNode>>;
}

function SceneRun({
  order,
  scenes,
}: HomeScenesProps & { readonly order: readonly HomeScene[] }) {
  return (
    <>
      {order.map((scene) => (
        <Fragment key={scene}>{scenes[scene]}</Fragment>
      ))}
    </>
  );
}

/** The resolved branch: the same run, in the trait's order. */
async function OrderedScenes({ scenes }: HomeScenesProps) {
  return <SceneRun order={homeSceneOrder(await requestTrait())} scenes={scenes} />;
}

/** Block 2a. The fallback is the `direct` order, and it is a complete block. */
export function HomeScenes({ scenes }: HomeScenesProps) {
  return (
    <Suspense fallback={<SceneRun order={HOME_SCENES} scenes={scenes} />}>
      <OrderedScenes scenes={scenes} />
    </Suspense>
  );
}
