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
 * are not (WEB-F-041: counted live or not shown).
 */

import { eventsApiHost, eventsApiToken, geoApiHost, geoApiToken } from "@/src/clients/hosts";

import { UPSTREAM_TIMEOUT_MS } from "./resilient";

export const LIVE_DATA_MODES = ["auto", "mock", "real"] as const;
export type LiveDataMode = (typeof LIVE_DATA_MODES)[number];

export function liveDataMode(): LiveDataMode {
  const raw = (process.env.LIVE_DATA ?? "auto").toLowerCase();
  return (LIVE_DATA_MODES as readonly string[]).includes(raw) ? (raw as LiveDataMode) : "auto";
}

/**
 * One row per thing a module needs. `upstream: false` is a measured gap with
 * an open row — not a guess, and not a temporary lack of effort.
 */
export const CAPABILITIES = {
  /** geo-api ZIP search — exists, token-scoped. */
  placeSearchByZip: { service: "geo", upstream: true, openRow: undefined },
  /** geo-api name search — Q-025, does not exist (open row 5). */
  placeSearchByName: { service: "geo", upstream: false, openRow: "5" },
  /** geo-api proximity search — exists, but with a fixed radius (open row 5). */
  placesNearPoint: { service: "geo", upstream: true, openRow: "5" },
  /** geo-api slug lookup — exists, token-scoped. */
  communityBySlug: { service: "geo", upstream: true, openRow: undefined },
  /** events-api search — exists, token-scoped. */
  eventsSearch: { service: "events", upstream: true, openRow: undefined },
  /** events-api activity ranking behind `/api/region/{county}/examples` — no operation (open row 6). */
  countyActivityRanking: { service: "events", upstream: false, openRow: "6" },
  /** `/api/stats` — exists, tokenless, but carries `totalEvents` only (open row 6). */
  statsTotalEvents: { service: "events", upstream: true, openRow: undefined },
  statsPlacesCount: { service: "events", upstream: false, openRow: "6" },
  statsUpdatesToday: { service: "events", upstream: false, openRow: "6" },
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
 * The decision, per capability. `true` means the real client answers.
 *
 * `statsTotalEvents` is the one capability that needs no token, so it is the
 * one that answers for real in an environment with no credentials at all.
 */
export function hasRealBackend(capability: Capability): boolean {
  const mode = liveDataMode();
  if (mode === "mock") return false;

  const { service, upstream } = CAPABILITIES[capability];
  if (!upstream) return false; // nothing to call — the mock rule applies

  if (mode === "real") return true;

  if (capability === "statsTotalEvents") return true; // tokenless
  return credentialsFor(service).token !== undefined;
}

/** The timeout every client gets — one budget, named in one place (TS-009 D4). */
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
