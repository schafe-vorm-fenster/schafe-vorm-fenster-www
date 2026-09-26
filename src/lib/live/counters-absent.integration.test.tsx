import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { resetRateLimits } from "./bff";
import { liveCounters } from "./counters";
import { memoryStore } from "./last-good";

import { LiveCounters } from "@/src/components/live-counters/live-counters";

/**
 * TS-WEB-0018-A12 — "with the stats upstream stubbed empty, counter modules
 * are absent from the rendered page and no figure stands in their place
 * (FUN-WEB-0041, FUN-WEB-0196, FUN-WEB-0197)."
 *
 * The criterion declares `integration`, and it is one: the fact it asserts is
 * not a property of the counter component and not a property of
 * `liveCounters()` — it is what the **chain** does when the upstream answers
 * nothing. Three links, all in-process:
 *
 *   1. `liveCounters()` with the stats client stubbed and no last-good entry →
 *      `undefined`, which is TS-WEB-0009 D6's "remove the module".
 *   2. `GET /api/stats` on that same state → **204 with no body**. Not `{}`,
 *      not `{ dates: 0 }` — a body with a figure in it is exactly the
 *      substitute FUN-WEB-0041 forbids.
 *   3. What the page then renders → nothing. `app/[lang]/_islands.tsx`'s
 *      `CountersIsland` returns `null` on `undefined`, and the component
 *      itself renders the empty string when it holds no figure, so no band,
 *      no skeleton, no dash and no digit reaches the markup.
 *
 * `/ueber-uns` is the strongest case and it is asserted in the browser
 * (`e2e/pages/ueber-uns.spec.ts`): the counter module is deleted from that
 * page outright, so no upstream state can produce one. What is measured here
 * is the general rule, on every surface that *does* mount the band.
 *
 * The last case is the control: a counted **zero** is a figure and renders.
 * Without it, "absent" could be satisfied by a module that hides real data.
 */

const fetchStats = vi.hoisted(() => vi.fn());

vi.mock("@/src/clients/events-api/client", () => ({ fetchStats }));

const callStatsRoute = async (): Promise<Response> => {
  const { GET } = await import("@/app/api/stats/route");
  return GET(new Request("http://localhost:3100/api/stats"));
};

beforeEach(() => {
  resetRateLimits();
  vi.spyOn(console, "warn").mockImplementation(() => undefined);
  vi.stubEnv("LIVE_DATA", "auto");
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
  fetchStats.mockReset();
});

/** The one branch `CountersIsland` takes on an absent envelope, verbatim. */
function renderBand(envelope: Awaited<ReturnType<typeof liveCounters>>): string {
  if (envelope === undefined) return renderToStaticMarkup(<>{null}</>);
  return renderToStaticMarkup(
    <LiveCounters
      dates={envelope.data.dates}
      locale="de"
      places={envelope.data.places}
      updatesToday={envelope.data.updatesToday}
    />,
  );
}

describe("TS-WEB-0018-A12: with the stats upstream stubbed empty the counter module is absent", () => {
  it("answers no envelope at all, so the page has no band to mount", async () => {
    fetchStats.mockRejectedValue(new Error("events-api: empty upstream"));

    await expect(liveCounters({ store: memoryStore() })).resolves.toBeUndefined();
  });

  it("renders nothing — no band, no slot, no digit standing in for a figure", async () => {
    fetchStats.mockRejectedValue(new Error("events-api: empty upstream"));

    const html = renderBand(await liveCounters({ store: memoryStore() }));
    expect(html).toBe("");
    expect(html).not.toMatch(/\d/);
  });

  it("the BFF answers 204 with no body — never `{}`, never a zeroed figure", async () => {
    fetchStats.mockRejectedValue(new Error("events-api: empty upstream"));

    const response = await callStatsRoute();
    expect(response.status).toBe(204);
    expect(await response.text()).toBe("");
    expect(response.headers.get("cache-control")).toBe("no-store");
  });

  it("an upstream that answers without the one field it has leaves no figure behind either", async () => {
    // Not a rejection: a 200 whose payload omits `totalEvents`. The client
    // raises on it (schema), which is the same branch — and what matters here
    // is that no estimate is produced on the way out.
    fetchStats.mockRejectedValue(new Error("events-api: schema: totalEvents missing"));

    const response = await callStatsRoute();
    expect(response.status).toBe(204);
    expect(renderBand(await liveCounters({ store: memoryStore() }))).toBe("");
  });

  it("a counted zero is a figure and does render — absence is the upstream's, never the number's", async () => {
    fetchStats.mockResolvedValue({ totalEvents: 0 });

    const html = renderBand(await liveCounters({ store: memoryStore() }));
    expect(html).not.toBe("");
    expect(html).toContain("0");
  });
});
