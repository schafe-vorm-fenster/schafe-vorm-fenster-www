/**
 * Every ecosystem host, in one file inside `src/clients/` — TS-008-A1.
 *
 * The acceptance criterion is literal: "no ecosystem host or read token
 * appears outside `src/clients/*`". Keeping the fallbacks here rather than in
 * `src/lib/live/config.ts` is what makes that a machine-checkable fact
 * instead of a convention, and it is also where the value belongs: a host is
 * a property of the client, not of the module that chooses between clients.
 *
 * Hosts are the production values SRC-011 registers; the environment variable
 * overrides each one, which is how a preview points at a staging service.
 */

export const EVENTS_API_HOST_FALLBACK = "https://events.api.schafe-vorm-fenster.de";
export const GEO_API_HOST_FALLBACK = "https://geo.api-v2.schafe-vorm-fenster.de";

export function eventsApiHost(): string {
  return process.env.EVENTSAPI_HOST ?? EVENTS_API_HOST_FALLBACK;
}

export function geoApiHost(): string {
  return process.env.GEOAPI_HOST ?? GEO_API_HOST_FALLBACK;
}

/**
 * Read tokens are server-side environment values and are read only here. An
 * empty string is treated as absent: a variable declared-but-unset in a
 * `.env` file must select the mock backend, not an unauthenticated call.
 */
function token(value: string | undefined): string | undefined {
  return value === undefined || value.trim() === "" ? undefined : value;
}

export function eventsApiToken(): string | undefined {
  return token(process.env.EVENTSAPI_READ_TOKEN);
}

export function geoApiToken(): string | undefined {
  return token(process.env.GEOAPI_READ_TOKEN);
}
