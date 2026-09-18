/**
 * community-site client — the **tokenless** half of the live layer.
 *
 * `events-api` and `geo-api` are token-scoped (`/api/{token}/…`). The public
 * village-calendar site in front of them is not: it renders the same events
 * and the same geo-api communities for anybody, and Next.js leaves the data
 * its pages were built from in the page itself, under
 * `<script id="__NEXT_DATA__">`. Three surfaces are read, all of them public
 * and all of them GET/POST reads (`README.md` of this folder says why that is
 * allowed and what it costs):
 *
 *  | Surface | Answers |
 *  | --- | --- |
 *  | `GET /` | the **community index** — every covered community with its name, geo-api slug, geonameId and point |
 *  | `GET /{slug}.{geonameId}` | one community's **events**, already localized, already in and around that place |
 *
 * The site publishes a third surface, `POST /api/search-nearby-communities`
 * (its own credential-hiding proxy in front of geo-api's proximity search).
 * It is deliberately **not** used: it answers five communities, and a cap
 * truncates a radius silently. The committed index carries every covered
 * community's coordinate, so `src/lib/live/place-index.ts` makes the ~15 km
 * cut exactly and locally instead.
 *
 * Two properties this client keeps, so the fragility of reading a page's
 * embedded data stays contained:
 *
 *  - **every field is validated.** The payload is a rendering artefact of
 *    another application, so a shape change is expected eventually. Zod turns
 *    that into one `UpstreamError`, which is a tier decision in
 *    `resilient()`, not a broken page.
 *  - **only the fields the website renders are required.** Everything else is
 *    `.loose()`, exactly as for the two API clients.
 */

import { z } from "zod";

import { callUpstreamText, UpstreamError } from "../http";

/** The embedded-data script Next.js writes into every page of a Pages-Router app. */
const NEXT_DATA = /<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/u;

const GEO_POINT = z.object({ lat: z.number(), lng: z.number() });

const IDENTIFIERS = z.object({ geonamesId: z.number() }).loose();

/** One covered community, as the public site carries it. */
export const CommunitySiteCommunitySchema = z
  .object({
    _id: z.string(),
    name: z.string(),
    slug: z.string(),
    geoLocation: z
      .object({ identifiers: IDENTIFIERS, point: GEO_POINT.optional() })
      .loose()
      .optional(),
    municipality: z
      .object({ _id: z.string().optional(), name: z.string().optional() })
      .loose()
      .optional(),
  })
  .loose();

export type CommunitySiteCommunity = z.infer<typeof CommunitySiteCommunitySchema>;

/**
 * One date. The site has already flattened the events-api event, resolved
 * the language and turned the epoch into an ISO string, so this is the shape
 * the website's own `LiveEvent` is one mapping away from.
 */
export const CommunitySiteEventSchema = z
  .object({
    _id: z.string(),
    summary: z.string(),
    start: z.string(),
    end: z.string().optional(),
    allday: z.boolean().optional(),
    categories: z.array(z.string()).default([]),
    /** `community` · `municipality` · `nearby` · `region` — the widening the site already did. */
    scope: z.string().optional(),
    placeName: z.string().optional(),
    location: z.string().optional(),
    community: z
      .object({ _id: z.string().optional(), name: z.string().optional() })
      .loose()
      .optional(),
  })
  .loose();

export type CommunitySiteEvent = z.infer<typeof CommunitySiteEventSchema>;

const CommunityPageSchema = z.object({
  props: z.object({
    pageProps: z.object({
      community: CommunitySiteCommunitySchema,
      events: z.array(CommunitySiteEventSchema).default([]),
    }),
  }),
});

const CommunityIndexSchema = z.object({
  props: z.object({
    pageProps: z.object({
      communities: z.array(CommunitySiteCommunitySchema).default([]),
    }),
  }),
});

export interface CommunitySiteConfig {
  readonly host: string;
  readonly timeoutMs: number;
}

function parse<T>(schema: z.ZodType<T>, payload: unknown): T {
  const result = schema.safeParse(payload);
  if (!result.success) {
    throw new UpstreamError("community-site", `schema: ${result.error.issues[0]?.message ?? "invalid"}`);
  }
  return result.data;
}

/** The embedded JSON of one page, or an `UpstreamError` naming what was wrong. */
function embeddedData(html: string): unknown {
  const match = NEXT_DATA.exec(html);
  if (match?.[1] === undefined) throw new UpstreamError("community-site", "page carries no embedded data");
  try {
    return JSON.parse(match[1]) as unknown;
  } catch {
    throw new UpstreamError("community-site", "embedded data is not JSON");
  }
}

/**
 * The route segment one community is served under: `{slug}.{geonameId}`.
 * Only the id is resolved upstream, so the slug half is cosmetic — but it is
 * what the canonical URL uses, so it is what this client sends.
 */
export function communityRouteSlug(slug: string, geonameId: number | string): string {
  return `${slug}.${geonameId}`;
}

/** Every covered community — the index the site's own start page filters on. */
export async function fetchCommunityIndex(
  config: CommunitySiteConfig,
): Promise<CommunitySiteCommunity[]> {
  const html = await callUpstreamText({
    service: "community-site",
    url: `${config.host}/`,
    timeoutMs: config.timeoutMs,
  });
  return parse(CommunityIndexSchema, embeddedData(html)).props.pageProps.communities;
}

/**
 * One community's page: the community itself plus the dates the site shows
 * for it — its own, its municipality's, and the widened `nearby`/`region`
 * ones. The caller filters by `scope`; this client returns what was served.
 */
export async function fetchCommunityPage(
  config: CommunitySiteConfig,
  routeSlug: string,
): Promise<{ community: CommunitySiteCommunity; events: CommunitySiteEvent[] }> {
  const html = await callUpstreamText({
    service: "community-site",
    url: `${config.host}/${encodeURIComponent(routeSlug)}`,
    timeoutMs: config.timeoutMs,
  });
  const { community, events } = parse(CommunityPageSchema, embeddedData(html)).props.pageProps;
  return { community, events };
}
