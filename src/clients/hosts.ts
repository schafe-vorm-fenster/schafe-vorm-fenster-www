/**
 * Every ecosystem host, in one file inside `src/clients/` — TS-WEB-0008-A1.
 *
 * The acceptance criterion is literal: "no ecosystem host or read token
 * appears outside `src/clients/*`". Keeping the fallbacks here rather than in
 * `src/lib/live/config.ts` is what makes that a machine-checkable fact
 * instead of a convention, and it is also where the value belongs: a host is
 * a property of the client, not of the module that chooses between clients.
 *
 * Hosts are the production values SRC-0011 registers; the environment variable
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

/**
 * The **public village-calendar site** — the one ecosystem surface that
 * answers without a credential.
 *
 * `events-api` and `geo-api` are token-scoped (`/api/{token}/…`), so an
 * environment without read tokens can reach neither. The village-calendar
 * app in front of them is a public website: its community pages, its
 * community index and its proximity search are served to anyone, and they
 * carry the same events and the same geo-api slugs the token-scoped services
 * would answer. `src/clients/community-site/README.md` records what is read,
 * why it is allowed, and what it costs.
 *
 * It is a **source, not a fallback**: `src/lib/live/config.ts` places it
 * between the token-scoped clients and the mock backend, so a page shows real
 * dates in an environment that has no token at all.
 */
export const COMMUNITY_SITE_HOST_FALLBACK = "https://schafe-vorm-fenster.de";

export function communitySiteHost(): string {
  return process.env.COMMUNITYSITE_HOST ?? COMMUNITY_SITE_HOST_FALLBACK;
}

/**
 * The embeddable-calendar host (Portalize). It carries no token either: a
 * calendar is addressed by its **organizer id**, which is a public
 * identifier — the widget's own `<script src>` puts it in the page source of
 * every site that embeds one.
 *
 * `src/lib/security/csp.ts` names the same origin in the TS-WEB-0014 D1 allowlist,
 * because the browser loads the widget from it. This constant is the
 * server-side half: the value `src/lib/embed/portalize.ts` builds the loader
 * URL from.
 */
export const PORTALIZE_HOST_FALLBACK = "https://portalize.schafe-vorm-fenster.de";

export function portalizeHost(): string {
  return process.env.PORTALIZE_HOST ?? PORTALIZE_HOST_FALLBACK;
}
