"use client";

/**
 * Block 2a of `/` — the three scenes, in the order the entry trait asks for
 * (TS-WEB-0019 D3a, DEC-0109 §2, DEC-0140), resolved in the browser since
 * DEC-0163.
 *
 * D3a is ordering and nothing else: *"No trait adds, removes or rewrites a
 * block, and no trait changes which mechanism carries the module."* That is
 * enforced by shape rather than by discipline — `HOME_SCENE_ORDER` is an
 * `EmphasisTable`, and `orderByTrait()` refuses a variant that is not a
 * permutation of the default order and falls back to that order
 * (`src/lib/personalization/emphasis.ts`). The three scene nodes are built once
 * by the page (server-rendered) and only re-ordered here, so a trait cannot
 * reach inside one.
 *
 * **Where the trait is read.** Until DEC-0163 the proxy handed the `Referer`
 * down as a request header and the page read it inside a `<Suspense>`
 * boundary — a per-request render whose streamed swap no build-time CSP hash
 * could admit (state/open.md row 132: in production the `direct` order was
 * all anyone ever saw). The page is static now and the order is the
 * browser's: `document.referrer` and the URL's medium parameters go through
 * the same `encodeEntryHandover` → `decodeEntryHandover` pair the proxy used,
 * so the host and medium rules (no path, three media) are unchanged, and then
 * through `resolveEntryTrait`. The prerendered HTML — what a crawler, a
 * JS-less visitor and a visitor with no referrer get — is the `direct` order
 * (TS-WEB-0019-A7's second load).
 *
 * `TS-WEB-0009-A14` holds by construction: the scenes hold no `<input>`,
 * `<textarea>` or `<select>`, so a re-order can carry away nothing a visitor
 * typed.
 */

import { Fragment, useSyncExternalStore } from "react";

import { orderByTrait } from "@/src/lib/personalization/emphasis";
import { resolveEntryTrait } from "@/src/lib/personalization/entry-context";
import { decodeEntryHandover, encodeEntryHandover } from "@/src/lib/personalization/entry-handover";

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
 * The trait of this visit, from the browser's own referrer and URL. `direct`
 * without either — and on the server, which never calls this.
 */
function browserTrait(): EntryTrait {
  const handover = decodeEntryHandover(
    encodeEntryHandover({
      referrer: document.referrer || null,
      searchParams: new URLSearchParams(window.location.search),
    }),
  );
  return resolveEntryTrait({
    // The landing route and its focus job are the page's own, not the
    // visit's — TS-WEB-0010 D7: a trait may reorder within a page, it may
    // never redefine what the page is for.
    focusJob: "know-what-is-on",
    params: handover.medium === null ? {} : { etcc_med: handover.medium },
    referrerHost: handover.referrerHost,
    routeId: "home",
  });
}

function noSubscription(): () => void {
  return () => undefined;
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

/**
 * Block 2a. The server snapshot is `direct`, so the prerendered HTML and the
 * hydrating client agree; the browser's snapshot is the visit's own trait.
 */
export function HomeScenes({ scenes }: HomeScenesProps) {
  const trait = useSyncExternalStore(noSubscription, browserTrait, () => "direct" as EntryTrait);
  return <SceneRun order={homeSceneOrder(trait)} scenes={scenes} />;
}
