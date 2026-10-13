/**
 * `GET /api/places/{slug}/examples` — the pool a value story picks its one
 * example date from (DEC-0152): the place's surroundings for the coming
 * weeks, each date with its distance.
 *
 * `/dein-ort`'s three stories read it in the browser since DEC-0163; until
 * then the page read `exampleEvents()` server-side and the HTML regenerated
 * with every new date (#59). 404 when the slug does not resolve, like
 * position 1's own route.
 */

import { envelopeResponse, guard, problem } from "@/src/lib/live/bff";
import { exampleEvents } from "@/src/lib/live/examples";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
): Promise<Response> {
  const { rejected } = guard(request, "places/examples");
  if (rejected) return rejected;

  const { slug } = await params;
  if (slug.length === 0 || slug.length > 120) return problem(400, "slug is required");

  const envelope = await exampleEvents({ slug });
  if (envelope === undefined) return problem(404, "place not covered");

  return envelopeResponse(envelope, "dates");
}
