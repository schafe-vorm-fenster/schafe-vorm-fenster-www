/**
 * The mock/real switch — plan/guardrails.md ("the mock rule").
 *
 * Every live module calls **one** interface module, and that module decides
 * per capability whether the real client or the mock answers. Swapping a mock
 * for the real system later touches this file and one client, never a page.
 *
 * Three inputs, in this order:
 *
 *  1. `LIVE_DATA` — `mock` forces every capability to the mock backend,
 *     `real` forces the real one (and fails loudly where it cannot work),
 *     `auto` (the default) decides per capability;
 *  2. **does the capability exist upstream at all** — the measured gaps of
 *     `state/open.md` rows 5 and 6 (geo name search, coordinate→county,
 *     caller radius, nearest-covered-community; `/api/stats` places and
 *     updates-today). A capability upstream does not have is mocked, whatever
 *     the flag says, because there is nothing to call;
 *  3. **is the service reachable with a credential** — geo-api and the
 *     events search are token-scoped (`/api/{token}/…`) and this environment
 *     has no read token, so `auto` picks the mock and says so in the payload
 *     (`demo: true` → the `Demo-Daten` badge).
 *
 * `/api/stats` is the one operation that is tokenless and really answers
 * today, so the *dates* counter is real data even while the other two figures
 * are not (FUN-WEB-0041: counted live or not shown).
 */

import {
  assetsApiHost,
  communitySiteHost,
  eventsApiHost,
  eventsApiToken,
  geoApiHost,
  geoApiToken,
} from "@/src/clients/hosts";

import { UPSTREAM_TIMEOUT_MS } from "./resilient";

export const LIVE_DATA_MODES = ["auto", "mock", "real"] as const;
export type LiveDataMode = (typeof LIVE_DATA_MODES)[number];

export function liveDataMode(): LiveDataMode {
  const raw = (process.env.LIVE_DATA ?? "auto").toLowerCase();
  return (LIVE_DATA_MODES as readonly string[]).includes(raw) ? (raw as LiveDataMode) : "auto";
}

/**
 * One row per thing a module needs, and **which backend can answer it**.
 *
 * Three fields, each answering a different question:
 *
 *  - `service` — who would answer. Four of them now: the two token-scoped
 *    APIs, the **public village-calendar site** (`communitySite`, no
 *    credential at all) and the **committed community index** (`index`,
 *    no network at all);
 *  - `credential` — `"token"` means the service is path-scoped
 *    (`/api/{token}/…`) and unreachable without a read token; `"none"` means
 *    it answers anybody;
 *  - `upstream: false` — a measured gap with an open row. Not a guess, and
 *    not a temporary lack of effort.
 *
 * `placeSearchByName` moved from `upstream: false` to a real backend on
 * 2026-09-18: geo-api still has no name search (Q-0025 stays open, row 5), but
 * the covered-community index the village calendar publishes does, and this
 * website now ships it (`place-index.ts`). The gap is upstream's; the answer
 * is no longer a mock.
 */
export const CAPABILITIES = {
  /** geo-api ZIP search — exists, token-scoped. No public equivalent: the index carries no postcodes. */
  placeSearchByZip: { service: "geo", credential: "token", upstream: true, openRow: undefined },
  /** Name search — geo-api has none (Q-0025, open row 5); the committed index answers it. */
  placeSearchByName: { service: "index", credential: "none", upstream: true, openRow: "5" },
  /** geo-api proximity search — exists, but with a fixed radius (open row 5). */
  placesNearPoint: { service: "geo", credential: "token", upstream: true, openRow: "5" },
  /** The ~15 km cut, made locally against the committed index — no cap, no credential. */
  placesNearPointIndex: { service: "index", credential: "none", upstream: true, openRow: "5" },
  /** geo-api slug lookup — exists, token-scoped. */
  communityBySlug: { service: "geo", credential: "token", upstream: true, openRow: undefined },
  /** The same lookup out of the committed index — no network, no credential. */
  communityBySlugIndex: { service: "index", credential: "none", upstream: true, openRow: undefined },
  /** geo-api's full community record — exists, token-scoped; carries the place photograph (DEC-0167). */
  communityPhoto: { service: "geo", credential: "token", upstream: true, openRow: undefined },
  /** The same photograph off the community's public page on the village calendar (DEC-0167). */
  communityPhotoPublic: { service: "communitySite", credential: "none", upstream: true, openRow: undefined },
  /** events-api search — exists, token-scoped. */
  eventsSearch: { service: "events", credential: "token", upstream: true, openRow: undefined },
  /** One community's dates off its public page on the village calendar. */
  eventsByCommunityPublic: { service: "communitySite", credential: "none", upstream: true, openRow: undefined },
  /** events-api activity ranking behind `/api/region/{county}/examples` — no operation (open row 6). */
  countyActivityRanking: { service: "events", credential: "token", upstream: false, openRow: "6" },
  /** `/api/stats` — exists, tokenless, but carries `totalEvents` only (open row 6). */
  statsTotalEvents: { service: "events", credential: "none", upstream: true, openRow: undefined },
  statsPlacesCount: { service: "events", credential: "token", upstream: false, openRow: "6" },
  statsUpdatesToday: { service: "events", credential: "token", upstream: false, openRow: "6" },
} as const;

export type Capability = keyof typeof CAPABILITIES;

export interface ServiceCredentials {
  readonly host: string;
  readonly token?: string;
}

export function geoApi(): ServiceCredentials {
  return { host: geoApiHost(), token: geoApiToken() };
}

export function eventsApi(): ServiceCredentials {
  return { host: eventsApiHost(), token: eventsApiToken() };
}

function credentialsFor(service: "geo" | "events"): ServiceCredentials {
  return service === "geo" ? geoApi() : eventsApi();
}

/**
 * The decision, per capability. `true` means a **real** backend answers —
 * which since 2026-09-18 may be the token-scoped API, the public site, or the
 * committed index, in that order of preference where a module has more than
 * one (the modules themselves express the order; this function only says
 * which doors are open).
 *
 * A capability whose service needs no credential is open in every
 * environment. That is what makes an untokened preview show real dates
 * instead of demo ones.
 */
export function hasRealBackend(capability: Capability): boolean {
  const mode = liveDataMode();
  if (mode === "mock") return false;

  const { service, credential, upstream } = CAPABILITIES[capability];
  if (!upstream) return false; // nothing to call — the mock rule applies

  if (credential === "none") return true; // no token gate: reachable everywhere
  if (mode === "real") return true;

  return credentialsFor(service as "geo" | "events").token !== undefined;
}

/** The timeout every JSON client gets — one budget, named in one place (TS-WEB-0009 D4). */
export function timeoutMs(): number {
  const raw = Number(process.env.LIVE_TIMEOUT_MS);
  return Number.isFinite(raw) && raw > 0 ? raw : UPSTREAM_TIMEOUT_MS;
}

export function geoConfig(): { host: string; token: string; timeoutMs: number } {
  const { host, token } = geoApi();
  return { host, token: token ?? "", timeoutMs: timeoutMs() };
}

export function eventsConfig(): { host: string; token: string; timeoutMs: number } {
  const { host, token } = eventsApi();
  return { host, token: token ?? "", timeoutMs: timeoutMs() };
}

/**
 * The budget for geo-api's **point search** (`community/search?lat=&lng=`),
 * and for it only — DEC-0181, amending TS-WEB-0009 D4.
 *
 * Measured on 2026-10-28 from Germany against 70 distinct coordinates: median
 * ~0.5 s, p95 0.79 s, max 0.92 s on a first ask (3 of 70 above 800 ms); the
 * same coordinate asked again answers in ~0.09 s. The 800 ms JSON budget sits
 * on that tail, and the preview's runtime log shows `/api/nearby` degrading on
 * `geo-api: timeout after 800 ms` in fra1 although nothing was down. The answer — which communities lie around a point — practically
 * never changes, so it is cached for `geoLookup`'s 7 days (`geo-lookup.ts`)
 * and the one ask that fills the cache may take 3 s: above the measured
 * maximum by a factor of three. Nobody watches it run: position 2 sits below
 * the fold and loads in the browser behind a skeleton at its final geometry.
 * The events half of the same module keeps the 800 ms.
 *
 * `/api/places/nearest` does **not** get it: that call carries a visitor's own
 * position, is never cached (TS-WEB-0010 D5, DEC-0119) and has the committed
 * index behind it, so it keeps the 800 ms.
 */
export const GEO_POINT_TIMEOUT_MS = 3000;

export function geoPointConfig(): { host: string; token: string; timeoutMs: number } {
  return { ...geoConfig(), timeoutMs: GEO_POINT_TIMEOUT_MS };
}

/**
 * The budget for the **public village-calendar page**, which is a document
 * rather than an API call: ~80 KB gzipped, measured at 100–200 ms TTFB on
 * 2026-09-18. It gets its own number because 800 ms is the budget for a JSON
 * API and a page is not one — and because this is the source that keeps a
 * tokenless environment on real data, so cutting it at an API's budget would
 * trade the whole point of it for a tenth of a second.
 */
export const HTML_TIMEOUT_MS = 2500;

export function htmlTimeoutMs(): number {
  const raw = Number(process.env.LIVE_HTML_TIMEOUT_MS);
  return Number.isFinite(raw) && raw > 0 ? raw : HTML_TIMEOUT_MS;
}

export function communitySiteConfig(): { host: string; timeoutMs: number } {
  return { host: communitySiteHost(), timeoutMs: htmlTimeoutMs() };
}

/**
 * assets-api — the image check behind a place photograph (DEC-0167). No
 * token. assets-api processes a Commons original on its first request, which
 * measured 8.3–11.2 s cold against 0.6–2.5 s warm on 2026-10-14, and a call
 * aborted before it finishes leaves nothing in its CDN — so with the 2.5 s
 * HTML budget a cold image would fail on every view and never warm up. The
 * budget is therefore its own: 15 s, above the measured cold maximum. Nobody
 * waits on it: the stage shows its own photograph until the answer lands, the
 * answer is CDN-cached (`activePlaces`), and a call that still runs out is a
 * fallback for this view, never a cached verdict.
 */
export const ASSETS_IMAGE_TIMEOUT_MS = 15_000;

export function assetsConfig(): { host: string; timeoutMs: number } {
  return { host: assetsApiHost(), timeoutMs: ASSETS_IMAGE_TIMEOUT_MS };
}
