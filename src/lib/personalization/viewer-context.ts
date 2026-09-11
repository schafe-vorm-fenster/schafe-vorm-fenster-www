/**
 * The resolver — TS-010 D1 and D2. One pass per request, cheapest first,
 * **stated intent always winning over inferred intent**:
 *
 *   1 route + language   the page's own declaration        → `job`, `locale`
 *   2 entry context      query parameters + `Referer`      → `trait`
 *   3 IP geolocation     the platform's geo headers        → country…county
 *   4 stated place       `?ort=` resolved against geo-api  → the full hierarchy
 *   5 browser location   client-side, after an interaction → produces a `?ort=`
 *
 * Later steps overwrite earlier ones; a stated place replaces an IP-derived
 * county in full, never field by field. No step blocks the response: a failed
 * or disabled lookup renders stage 0, which by D8 is a complete site.
 *
 * The result is **one flat object** (`ViewerContext`) plus the two request
 * facts that travel with it — the rotation seed and where the location came
 * from. It is resolved *outside* any `use cache` boundary and passed as props
 * (TS-005 D8): the cache key is `segmentKey()`, not this object.
 *
 * Step 5 is a page concern and deliberately absent here: browser geolocation
 * is client-side only, never triggered on load, and its only effect is a
 * navigation to `?ort=<slug>` — which arrives back here as step 4 (D5).
 */

import { isoWeekSeed, type RotationSeed } from "../relevance/rotation";
import { NO_GEO, type FocusJob, type GeoScope, type ViewerContext } from "../relevance/types";
import { routeIdForPath } from "../routes/routes";
import { resolveEntryTrait, type EntryContextInput } from "./entry-context";
import {
  createViewerLocationResolver,
  type ViewerLocation,
  type ViewerLocationResolver,
} from "./geolocation";
import { stageOf } from "./stages";

import type { Locale } from "../i18n/locales";
import type { RouteId } from "../routes/routes";

export interface ViewerContextInput {
  /** The page's declared focus job (TS-006 D1). An input, so no trait can change it. */
  readonly focusJob: FocusJob;
  readonly locale: Locale;
  /** The reference date — the page's clock. Everything downstream is pure. */
  readonly now: Date;
  readonly params?: EntryContextInput["params"];
  readonly referrer?: string | null;
  /** The landing route id, or the public path it was reached by. */
  readonly routeId?: RouteId;
  readonly path?: string;
  /** The platform's request geo headers, read by the proxy — never an IP. */
  readonly requestGeo?: Parameters<ViewerLocationResolver["resolveViewerLocation"]>[0]["requestGeo"];
  /** `?ort=<slug>` already resolved against geo-api (D2 step 4). */
  readonly statedPlace?: Partial<GeoScope> | null;
  /** `Sec-GPC: 1` or `DNT: 1` (D6). */
  readonly privacySignal?: boolean;
  /** Defaults to the configured resolver — `off` unless `GEO_STAGE1_SOURCE=mock`. */
  readonly resolver?: ViewerLocationResolver;
  readonly pressHosts?: readonly string[];
}

export interface ResolvedViewer {
  readonly viewer: ViewerContext;
  /** `isoWeekSeed(now)` — the engine's rotation input and part of the cache tag. */
  readonly seed: RotationSeed;
  /** Where the location came from, and whether it is labelled demo data. */
  readonly location: ViewerLocation;
}

/**
 * The stage-0 viewer — what the **prerendered shell** renders (D8). No
 * request, no lookup, no clock: a crawler, a visitor without JavaScript and a
 * visitor whose lookup timed out all see this one.
 */
export function stageZeroViewer(input: {
  readonly focusJob: FocusJob;
  readonly locale: Locale;
}): ViewerContext {
  return { geo: NO_GEO, trait: "direct", job: input.focusJob, stage: 0, locale: input.locale };
}

/** The `?ort=` slug of a request, or `null`. Resolving it is geo-api's job. */
export function statedPlaceSlug(params: EntryContextInput["params"]): string | null {
  if (params === undefined) return null;
  const raw = params instanceof URLSearchParams ? params.get("ort") : params["ort"];
  const value = Array.isArray(raw) ? raw[0] : raw;
  return value === undefined || value === null || value.trim() === "" ? null : value.trim();
}

export async function composeViewerContext(input: ViewerContextInput): Promise<ResolvedViewer> {
  const routeId =
    input.routeId ?? (input.path === undefined ? undefined : routeIdForPath(input.path, input.locale));

  const trait = resolveEntryTrait({
    params: input.params,
    referrer: input.referrer,
    routeId,
    focusJob: input.focusJob,
    pressHosts: input.pressHosts,
  });

  const resolver = input.resolver ?? createViewerLocationResolver();
  const location = await resolver.resolveViewerLocation({
    requestGeo: input.requestGeo,
    statedPlace: input.statedPlace,
    privacySignal: input.privacySignal,
  });

  const viewer: ViewerContext = {
    geo: location.geo,
    trait,
    // The focus job is the page's, at every stage. A trait may reorder within
    // the page (`emphasis.ts`), never redefine what the page is for (DEC-059).
    job: input.focusJob,
    stage: stageOf({ geo: location.geo, trait }),
    locale: input.locale,
  };

  return { viewer, seed: isoWeekSeed(input.now), location };
}
