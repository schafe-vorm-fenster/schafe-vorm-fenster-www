/**
 * events-api client — the dates behind every live module, and the counters.
 *
 * Every shape here is measured against the service's own contract
 * (`~/Projects/events-api`, `src/app/api/[token]/events/search/events-search.schema.ts`
 * and `src/events/types/localized-event.types.ts`) rather than assumed
 * (TS-008 D2). Four properties of that contract the website has to obey:
 *
 *  - `POST /api/{token}/events/search` filters by **administrative id lists**
 *    (`communities`, `municipalities`, `counties`, `states`) plus
 *    `after`/`before`. There is no radius parameter, which is why the
 *    widening chain is "which id list is sent" and never a distance
 *    (TS-008 D3).
 *  - **At least one filter is required.** The request schema refuses a body
 *    with no location and no text filter, so a query that would be unbounded
 *    is caught here rather than spent on a guaranteed 400.
 *  - The response is **paginated** — `results`, `pagination.{page,limit,totalPages}`
 *    — and `limit` defaults to 100. A module that wants three rows asks for
 *    three rows; it does not fetch a hundred and slice.
 *  - A localized event carries `community.id` and `community.name` but
 *    **no `community.slug`**. Anything that needs a slug resolves it
 *    elsewhere (`src/lib/live/place-index.ts`).
 *
 * `GET /api/stats` is the one **tokenless** operation. It carries
 * `totalEvents` and a handful of quality counters — no places count, no
 * updates-today count (Q-037, state/open.md row 6). Its
 * `earliestEventDate` / `latestEventDate` are currently nonsense values
 * (year 58221 in production on 2026-09-18), so they are parsed and ignored.
 */

import { z } from "zod";

import { callUpstream, UpstreamError } from "../http";

/**
 * The event fields the website renders. Dotted keys are the upstream's own
 * spelling (`community.name`), kept verbatim so the schema stays readable
 * against the pinned `openapi.json`.
 *
 * Only what is rendered is required: `id` is `.optional()` upstream and
 * `summary` may legitimately be empty, so neither may fail a whole module.
 */
export const EventSchema = z
  .object({
    id: z.string().optional(),
    summary: z.string().default(""),
    start: z.number().optional(),
    end: z.number().optional(),
    allday: z.boolean().optional(),
    categories: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    scope: z.string().optional(),
    link: z.string().optional(),
    "location.name": z.string().optional(),
    "location.localname": z.string().optional(),
    "community.id": z.string().optional(),
    "community.name": z.string().optional(),
    "municipality.id": z.string().optional(),
    "municipality.name": z.string().optional(),
    "county.id": z.string().optional(),
    "county.name": z.string().optional(),
    "organizer.id": z.string().optional(),
    "organizer.name": z.string().optional(),
  })
  .loose();

export type UpstreamEvent = z.infer<typeof EventSchema>;

/** `results` and `pagination` are the contract's own fields, not an addition. */
const PaginationSchema = z.object({
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
});

const EventsEnvelopeSchema = z.object({
  status: z.number().optional(),
  results: z.number().optional(),
  pagination: PaginationSchema.optional(),
  data: z.array(EventSchema).default([]),
});

/** Only the fields `/api/stats` actually has. Missing figures stay missing (WEB-F-041). */
export const StatsSchema = z
  .object({
    totalEvents: z.number(),
    eventsWithUnknownCategory: z.number().optional(),
    eventsWithImage: z.number().optional(),
  })
  .loose();

export type UpstreamStats = z.infer<typeof StatsSchema>;

const StatsEnvelopeSchema = z.object({ status: z.number().optional(), data: StatsSchema });

export interface EventsApiConfig {
  readonly host: string;
  readonly token: string;
  readonly timeoutMs: number;
}

/** The search body, exactly as TS-008 D3 expresses a widening step. */
export interface EventsSearchQuery {
  readonly communities?: readonly string[];
  readonly municipalities?: readonly string[];
  readonly counties?: readonly string[];
  readonly states?: readonly string[];
  readonly categories?: readonly string[];
  /** ISO-8601 or one of the upstream's relative words (`now`, `today`, `tomorrow`, `7d`, `week-end`). */
  readonly after?: string;
  readonly before?: string;
  /** Rows wanted. The upstream default is 100; a three-row module asks for three. */
  readonly limit?: number;
  readonly page?: number;
}

/** What the caller gets back: the rows plus how many there were in total. */
export interface EventsSearchResult {
  readonly events: UpstreamEvent[];
  /** Total matches upstream found, which is how a module knows it is showing an excerpt. */
  readonly total: number;
  readonly page: number;
  readonly totalPages: number;
}

/** The upstream cap. Asking for more is a 400, so the client clamps instead. */
export const MAX_EVENTS_LIMIT = 1000;

function parse<T>(schema: z.ZodType<T>, payload: unknown): T {
  const result = schema.safeParse(payload);
  if (!result.success) throw new UpstreamError("events-api", `schema: ${result.error.issues[0]?.message ?? "invalid"}`);
  return result.data;
}

const ids = (value: readonly string[] | undefined): string[] | undefined =>
  value === undefined || value.length === 0 ? undefined : [...value];

/**
 * One search. The date window is expressed in the upstream's own relative
 * words where they exist, so both systems cut the local day the same way —
 * the service resolves them in `Europe/Berlin`, which is why the website
 * never sends a hand-built midnight (TS-008 D3).
 */
export async function searchEvents(
  config: EventsApiConfig,
  query: EventsSearchQuery,
): Promise<EventsSearchResult> {
  const communities = ids(query.communities);
  const municipalities = ids(query.municipalities);
  const counties = ids(query.counties);
  const states = ids(query.states);

  // The contract refuses a body with no location filter. Catching it here
  // turns a guaranteed 400 into a named failure `resilient()` can degrade on.
  if (!communities && !municipalities && !counties && !states) {
    throw new UpstreamError("events-api", "search needs at least one administrative id list");
  }

  const limit = Math.min(Math.max(1, Math.trunc(query.limit ?? 100)), MAX_EVENTS_LIMIT);

  const payload = await callUpstream({
    service: "events-api",
    url: `${config.host}/api/${config.token}/events/search`,
    method: "POST",
    body: {
      ...(communities ? { communities } : {}),
      ...(municipalities ? { municipalities } : {}),
      ...(counties ? { counties } : {}),
      ...(states ? { states } : {}),
      ...(ids(query.categories) ? { categories: ids(query.categories) } : {}),
      ...(query.after ? { after: query.after } : {}),
      ...(query.before ? { before: query.before } : {}),
      language: "de",
      country: "DE",
      sort: "start:asc",
      limit,
      page: Math.max(1, Math.trunc(query.page ?? 1)),
    },
    timeoutMs: config.timeoutMs,
  });

  const envelope = parse(EventsEnvelopeSchema, payload);
  return {
    events: envelope.data,
    total: envelope.results ?? envelope.data.length,
    page: envelope.pagination?.page ?? 1,
    totalPages: envelope.pagination?.totalPages ?? 1,
  };
}

/** `/api/stats` needs no token — the only ecosystem operation that does not. */
export async function fetchStats(config: { readonly host: string; readonly timeoutMs: number }): Promise<UpstreamStats> {
  const payload = await callUpstream({
    service: "events-api",
    url: `${config.host}/api/stats`,
    timeoutMs: config.timeoutMs,
  });
  return parse(StatsEnvelopeSchema, payload).data;
}
