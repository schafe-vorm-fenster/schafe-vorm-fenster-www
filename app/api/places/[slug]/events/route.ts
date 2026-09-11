/**
 * `GET /api/places/{slug}/events?window=` — position 1 and the empty-state
 * detection of TS-008 D4.
 *
 * A place that geo-api does not resolve is **404**, which is a different fact
 * from an empty list: an empty list is the covered place with no dates, and
 * that is a conversion (`publishInvitation`), not a miss.
 */

import { envelopeResponse, guard, problem } from "@/src/lib/live/bff";
import { placeEvents } from "@/src/lib/live/places";
import { isEventWindow } from "@/src/lib/live/widening";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
): Promise<Response> {
  const { rejected } = guard(request, "places/events");
  if (rejected) return rejected;

  const { slug } = await params;
  const requested = new URL(request.url).searchParams.get("window") ?? "upcoming";
  if (!isEventWindow(requested)) return problem(400, "unknown window");

  const envelope = await placeEvents({ slug, window: requested });
  if (envelope === undefined) return problem(404, "place not covered");

  return envelopeResponse(envelope, "dates");
}
