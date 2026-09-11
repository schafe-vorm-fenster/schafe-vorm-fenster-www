/**
 * Where the visitor is — TS-010 D2 steps 3–5, D4, D6.
 *
 * **The interface is the point.** Real geolocation reads the platform's
 * request geo headers, and that is the proxy's job (`proxy.ts`, a later work
 * package): it resolves a location once, outside any `use cache` boundary, and
 * hands it to the page. This module owns the *contract* it hands over, the
 * granularity ceiling every implementation must respect, and the mock the
 * prototype runs on today.
 *
 * Three rules the interface encodes, so no implementation can quietly break
 * them:
 *
 * - **The ceiling is a hard truncation.** `community` is never reached from an
 *   IP, even when the lookup knows it, and `municipality` only when the lookup
 *   is unambiguous. A visitor must never be shown that the site knows her
 *   village before she said it — which is what makes TS-005 D1's honest limit
 *   true (tiers 0 and 1 fire only after a place search).
 * - **A stated place overwrites the inferred hierarchy in full**, never field
 *   by field (D2).
 * - **A privacy signal skips the lookup** (`Sec-GPC: 1` / `DNT: 1`, D6
 *   [PROPOSED]) and the request renders stage 0 — which by D8 is a complete
 *   site, so it costs nothing.
 *
 * The IP address itself never appears here: an implementation reads the
 * request's geo headers, and `ViewerLocationRequest` has no field for an
 * address, so it cannot be passed on, logged or traced (A11).
 */

import { NO_GEO, type GeoScope } from "../relevance/types";

export type ViewerLocationSource = "none" | "ip" | "stated-place" | "mock";

export interface ViewerLocation {
  readonly geo: GeoScope;
  readonly source: ViewerLocationSource;
  /** Labelled dummy data — the page renders the `Demo-Daten` badge (mock rule). */
  readonly demo: boolean;
  /** What to put on that badge, or `null` for a real answer. */
  readonly label: string | null;
}

export interface ViewerLocationRequest {
  /**
   * The platform's request geo headers, already read by the proxy —
   * `{ country, region, city }` and nothing finer. Deliberately not the raw
   * headers object and never an IP address.
   */
  readonly requestGeo?: {
    readonly country?: string | null;
    readonly region?: string | null;
    readonly city?: string | null;
  };
  /** The hierarchy of `?ort=<slug>`, already resolved against geo-api (D2 step 4). */
  readonly statedPlace?: Partial<GeoScope> | null;
  /** `Sec-GPC: 1` or `DNT: 1` on the request (D6). */
  readonly privacySignal?: boolean;
}

/**
 * The seam the proxy plugs into. One method, request-ish in, location out,
 * and it never throws — a failed lookup is a stage-0 answer, not an error
 * (D2: "no step blocks the response").
 */
export interface ViewerLocationResolver {
  resolveViewerLocation(request: ViewerLocationRequest): Promise<ViewerLocation>;
}

/** The badge text for the mocked location (plan/guardrails.md). */
export const DEMO_LOCATION_LABEL = "Demo-Standort";

/**
 * What the mock answers: a county-level location, which is exactly what stage 1
 * delivers in reality. It carries administrative names, no person and no
 * address, and it is marked `demo` so every surface labels it.
 */
export const DEMO_LOCATION: GeoScope = Object.freeze({
  country: "de",
  state: "mecklenburg-vorpommern",
  county: "vorpommern-greifswald",
  municipality: null,
  community: null,
});

export interface CeilingOptions {
  /** D4: a municipality is accepted only when the lookup returns exactly one. */
  readonly unambiguousMunicipality?: boolean;
}

/** D4's ceiling, applied to anything an implementation resolved from a request. */
export function truncateToCeiling(scope: GeoScope, options: CeilingOptions = {}): GeoScope {
  return {
    country: scope.country,
    state: scope.state,
    county: scope.county,
    municipality: options.unambiguousMunicipality === true ? scope.municipality : null,
    community: null,
  };
}

function statedLocation(statedPlace: Partial<GeoScope>): ViewerLocation {
  // A stated place replaces an inferred hierarchy **in full**; the two are
  // never merged field by field (D2).
  return {
    geo: { ...NO_GEO, ...statedPlace },
    source: "stated-place",
    demo: false,
    label: null,
  };
}

const NOWHERE: ViewerLocation = Object.freeze({
  geo: NO_GEO,
  source: "none",
  demo: false,
  label: null,
});

/**
 * Production while Q-008 is unanswered: the site runs at stage 0/2/3, which
 * D8 makes a complete site. No launch depends on the flag being on.
 */
export const disabledLocationResolver: ViewerLocationResolver = {
  async resolveViewerLocation(request) {
    if (request.statedPlace != null) return statedLocation(request.statedPlace);
    return NOWHERE;
  },
};

/**
 * The prototype's resolver — the mock rule: every missing external capability
 * is built as a mock delivering labelled dummy data, behind the interface the
 * real system will use. Swapping in the real resolver touches this module, not
 * a page. → state/open.md, `Mock aktiv`.
 */
export const mockLocationResolver: ViewerLocationResolver = {
  async resolveViewerLocation(request) {
    if (request.statedPlace != null) return statedLocation(request.statedPlace);
    if (request.privacySignal === true) return NOWHERE;
    return { geo: DEMO_LOCATION, source: "mock", demo: true, label: DEMO_LOCATION_LABEL };
  },
};

export interface ResolverConfig {
  /** `off` is the production default while Q-008 is open; `mock` is the prototype. */
  readonly source?: "off" | "mock";
}

/**
 * Picks the resolver. Configuration is read **at call time** and nothing is
 * memoised at module level, so a request never sees another request's state.
 */
export function createViewerLocationResolver(config: ResolverConfig = {}): ViewerLocationResolver {
  const source = config.source ?? process.env.GEO_STAGE1_SOURCE;
  return source === "mock" ? mockLocationResolver : disabledLocationResolver;
}

/**
 * The one call a page or the proxy makes. `resolveViewerLocation(request)` —
 * request-ish in, `ViewerLocation` out, mock or real decided by configuration.
 */
export async function resolveViewerLocation(
  request: ViewerLocationRequest,
  config: ResolverConfig = {},
): Promise<ViewerLocation> {
  return createViewerLocationResolver(config).resolveViewerLocation(request);
}
