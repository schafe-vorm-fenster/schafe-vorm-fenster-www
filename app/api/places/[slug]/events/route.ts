/**
 * `GET /api/places/{slug}/events?window=&rows=` — position 1 and the
 * empty-state detection of TS-WEB-0008 D4.
 *
 * `rows` (1–12, default 3) is how many dates the module may choose from: a
 * story-capped module picks one row out of a window (`prefer`), so it asks for
 * more than it prints. Since DEC-0163 this is the module's only source — the
 * page no longer renders dates server-side.
 *
 * A place that geo-api does not resolve is **404**, which is a different fact
 * from an empty list: an empty list is the covered place with no dates, and
 * that is a conversion (`publishInvitation`), not a miss.
 */

import { envelopeResponse, guard, problem } from "@/src/lib/live/bff";
import { placeEvents } from "@/src/lib/live/places";
import { isEventWindow } from "@/src/lib/live/widening";

/** The most dates one request may ask for — what `/dein-ort`'s story picks read. */
const MAX_ROWS = 12;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
): Promise<Response> {
  const { rejected } = guard(request, "places/events");
  if (rejected) return rejected;

  const { slug } = await params;
  const requested = new URL(request.url).searchParams.get("window") ?? "upcoming";
  if (!isEventWindow(requested)) return problem(400, "unknown window");

  const requestedRows = Number(new URL(request.url).searchParams.get("rows") ?? "3");
  const rowCount =
    Number.isInteger(requestedRows) && requestedRows >= 1 && requestedRows <= MAX_ROWS ? requestedRows : 3;

  const envelope = await placeEvents({ slug, window: requested, rowCount });
  if (envelope === undefined) return problem(404, "place not covered");

  return envelopeResponse(envelope, "dates");
}
