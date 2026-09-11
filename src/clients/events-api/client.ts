/**
 * events-api client — the dates behind every live module, and the counters.
 *
 * Two shapes matter and both are measured, not assumed (TS-008 D2):
 *
 *  - `POST /api/{token}/events/search` filters by **administrative id lists**
 *    (`communities`, `counties`, …) plus `after`/`before`. There is no radius
 *    parameter, which is why the widening chain is "which id list is sent"
 *    and never a distance (TS-008 D3).
 *  - `GET /api/stats` is **tokenless** and carries `totalEvents` only —
 *    no places count, no updates-today count (Q-037, state/open.md row 6).
 */

import { z } from "zod";

import { callUpstream, UpstreamError } from "../http";

/**
 * The event fields the website renders. Dotted keys are the upstream's own
 * spelling (`community.name`), kept verbatim so the schema stays readable
 * against the pinned `openapi.json`.
 */
export const EventSchema = z
  .object({
    id: z.string(),
    summary: z.string().default(""),
    start: z.number().optional(),
    end: z.number().optional(),
    allday: z.boolean().optional(),
    categories: z.array(z.string()).default([]),
    scope: z.string().optional(),
    "location.name": z.string().optional(),
    "community.id": z.string().optional(),
    "community.name": z.string().optional(),
    "community.slug": z.string().optional(),
  })
  .loose();

export type UpstreamEvent = z.infer<typeof EventSchema>;

const EventsEnvelopeSchema = z.object({
  status: z.number().optional(),
  data: z.array(EventSchema).default([]),
});

/** Only the fields `/api/stats` actually has. Missing figures stay missing (WEB-F-041). */
export const StatsSchema = z
  .object({
    totalEvents: z.number(),
    earliestEventDate: z.string().optional(),
    latestEventDate: z.string().optional(),
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
  readonly counties?: readonly string[];
  /** ISO-8601 or one of the upstream's relative words (`now`, `today`). */
  readonly after?: string;
  readonly before?: string;
}

function parse<T>(schema: z.ZodType<T>, payload: unknown): T {
  const result = schema.safeParse(payload);
  if (!result.success) throw new UpstreamError("events-api", `schema: ${result.error.issues[0]?.message ?? "invalid"}`);
  return result.data;
}

export async function searchEvents(
  config: EventsApiConfig,
  query: EventsSearchQuery,
): Promise<UpstreamEvent[]> {
  const payload = await callUpstream({
    service: "events-api",
    url: `${config.host}/api/${config.token}/events/search`,
    method: "POST",
    body: {
      ...(query.communities ? { communities: [...query.communities] } : {}),
      ...(query.counties ? { counties: [...query.counties] } : {}),
      ...(query.after ? { after: query.after } : {}),
      ...(query.before ? { before: query.before } : {}),
    },
    timeoutMs: config.timeoutMs,
  });
  return parse(EventsEnvelopeSchema, payload).data;
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
