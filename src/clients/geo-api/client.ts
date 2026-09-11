/**
 * geo-api client — places, the hierarchy, and the app-handover slug.
 *
 * Operations the website is allowed to reach (README of this folder,
 * TS-008 D2): `community/search` and `community/slug/{slug}`.
 * The address-lookup operation geo-api also publishes is **forbidden**
 * (DEC-024, TS-013 D3): it triggers a paid external Google lookup and would
 * carry the visitor's search term to a third party through our server. It is
 * deliberately not implemented here, so a caller cannot reach it by accident,
 * and its name occurs in no source file — checked by TS-008-A1.
 *
 * The token is a server-side environment value (`GEOAPI_READ_TOKEN`) and is
 * read here only — no token ever crosses the BFF boundary (TS-008 D10).
 */

import { z } from "zod";

import { callUpstream, UpstreamError } from "../http";

const GEO_POINT = z.object({ lat: z.number(), lng: z.number() });

const HIERARCHY_NODE = z
  .object({
    geonameId: z.number().nullable().optional(),
    name: z.string().nullable().optional(),
    slug: z.string().nullable().optional(),
  })
  .loose();

/**
 * The subset of a geo-api community the website reads. `.loose()` on purpose:
 * an upstream that adds a field must not turn every live module to tier 2
 * (TS-009 D4 treats a schema failure as a failure). A field we *use* that
 * goes missing still fails, which is the half that matters.
 */
export const GeoCommunitySchema = z
  .object({
    geonameId: z.number(),
    name: z.string(),
    slug: z.string(),
    type: z.string().optional(),
    geo: z.object({ point: GEO_POINT }).loose(),
    hierarchy: z
      .object({
        community: HIERARCHY_NODE.optional(),
        municipality: HIERARCHY_NODE.optional(),
        county: HIERARCHY_NODE.optional(),
        state: HIERARCHY_NODE.optional(),
      })
      .loose()
      .optional(),
  })
  .loose();

export type GeoCommunity = z.infer<typeof GeoCommunitySchema>;

const GeoEnvelopeSchema = z.object({
  status: z.number().optional(),
  data: z.array(GeoCommunitySchema).default([]),
});

const GeoSingleEnvelopeSchema = z.object({
  status: z.number().optional(),
  data: z.union([GeoCommunitySchema, z.array(GeoCommunitySchema)]),
});

export interface GeoApiConfig {
  readonly host: string;
  readonly token: string;
  readonly timeoutMs: number;
}

function searchUrl(config: GeoApiConfig, params: Readonly<Record<string, string | number | undefined>>): string {
  const url = new URL(`${config.host}/api/${config.token}/community/search`);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) url.searchParams.set(key, String(value));
  }
  return url.toString();
}

function parse<T>(schema: z.ZodType<T>, payload: unknown): T {
  const result = schema.safeParse(payload);
  if (!result.success) throw new UpstreamError("geo-api", `schema: ${result.error.issues[0]?.message ?? "invalid"}`);
  return result.data;
}

/** ZIP search — the only name-free lookup geo-api offers today (Q-025). */
export async function searchByZip(config: GeoApiConfig, zip: string): Promise<GeoCommunity[]> {
  const payload = await callUpstream({
    service: "geo-api",
    url: searchUrl(config, { countryCode: "DE", zips: zip }),
    timeoutMs: config.timeoutMs,
  });
  return parse(GeoEnvelopeSchema, payload).data;
}

/**
 * Proximity search. geo-api applies its own server-side radius constant and
 * `maxResults` default (TS-008 D2.2) — the caller's radius is **not** a
 * parameter here, because it is not one upstream. The ~15 km cut is the BFF's
 * own, in `widening.ts`.
 */
export async function searchByPoint(
  config: GeoApiConfig,
  point: { readonly lat: number; readonly lng: number },
  maxResults?: number,
): Promise<GeoCommunity[]> {
  const payload = await callUpstream({
    service: "geo-api",
    url: searchUrl(config, { countryCode: "DE", lat: point.lat, lng: point.lng, maxResults }),
    timeoutMs: config.timeoutMs,
  });
  return parse(GeoEnvelopeSchema, payload).data;
}

/** Validates a slug that arrived from outside — the handover's precondition (TS-008 D9). */
export async function communityBySlug(config: GeoApiConfig, slug: string): Promise<GeoCommunity | undefined> {
  const payload = await callUpstream({
    service: "geo-api",
    url: `${config.host}/api/${config.token}/community/slug/${encodeURIComponent(slug)}`,
    timeoutMs: config.timeoutMs,
  });
  const { data } = parse(GeoSingleEnvelopeSchema, payload);
  return Array.isArray(data) ? data[0] : data;
}
