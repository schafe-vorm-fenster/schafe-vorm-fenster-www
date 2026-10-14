/**
 * `GET /api/places/{slug}/photo` — the place's own photograph for the stage
 * of `/` and `/dein-ort` (DEC-0167, issue #18).
 *
 * The browser asks this route once a place is established and loads the
 * image itself from the URL in the answer — the one ecosystem host it may
 * reach, under `img-src`. geo-api's token and the attribution lookup stay
 * here (TS-WEB-0008 D10).
 *
 *  - **200** — an envelope whose `data` is the `PlacePhoto`, with its licence
 *    and author; cached as `activePlaces` (TS-WEB-0003 D5): a place's picture
 *    changes about as often as which places are active;
 *  - **204, cached the same** — the place has no usable photograph (none at
 *    all, not on Commons, no licence, no author for a licence that needs
 *    one). A verdict, so the CDN may keep it;
 *  - **204, `no-store`** — an upstream did not answer. This view falls back;
 *    the next one asks again rather than inheriting the failure;
 *  - **404** — the slug is not a covered place.
 */

import { cacheControlFor } from "@/src/lib/live/cache-profiles";
import { envelopeResponse, guard, problem } from "@/src/lib/live/bff";
import { placePhoto } from "@/src/lib/live/place-photo";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
): Promise<Response> {
  const { rejected } = guard(request, "places/photo");
  if (rejected) return rejected;

  const { slug } = await params;
  if (slug.length === 0 || slug.length > 120) return problem(400, "slug is required");

  const answer = await placePhoto(slug);
  if (answer === undefined) return problem(404, "place not covered");

  if (answer.kind === "failed") {
    return new Response(null, { status: 204, headers: { "cache-control": "no-store" } });
  }
  if (answer.kind === "none") {
    return new Response(null, { status: 204, headers: { "cache-control": cacheControlFor("activePlaces") } });
  }

  return envelopeResponse(
    {
      data: answer.photo,
      tier: "live",
      fetchedAt: new Date().toISOString(),
      stale: false,
      demo: false,
      source: "real",
    },
    "activePlaces",
  );
}
