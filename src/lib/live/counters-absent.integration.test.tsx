import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { CountersIsland } from "@/app/[lang]/_islands";

import { resetRateLimits } from "./bff";
import { liveCounters } from "./counters";
import { memoryStore } from "./last-good";

import type { ReactNode } from "react";

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
 *   3. What the page then renders → nothing.
 *
 * ── The island itself is the third link, not a copy of it ─────────────────
 *
 * That third link is `CountersIsland` of `app/[lang]/_islands.tsx`, and this
 * file **calls it**: `renderIsland()` below awaits the real component and
 * renders what it returns. An earlier version of this test re-implemented the
 * island's `undefined` branch (`if (envelope === undefined) return null`) and
 * rendered `LiveCounters` itself, one prop short of what production passes —
 * so a regression in the island would not have failed it, which is the one
 * thing a test of the chain has to catch. The island is a `use cache`
 * component, so `cacheLife`/`cacheTag` are stubbed for the call; nothing else
 * about it is replaced, the props are the island's own, and `liveCounters()`
 * runs inside it against its default store.
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

// The island is a `use cache` component: outside a request there is no cache
// scope for `cacheLife`/`cacheTag` to register with. Everything else in it —
// the `liveCounters()` call, the `undefined` branch, the props it hands the
// band — is the production code under test.
vi.mock("next/cache", async (importOriginal) => ({
  ...(await importOriginal<object>()),
  cacheLife: () => undefined,
  cacheTag: () => undefined,
}));

const callStatsRoute = async (): Promise<Response> => {
  const { GET } = await import("@/app/api/stats/route");
  return GET(new Request("http://localhost:3100/api/stats"));
};

/** The production island, rendered — the branch, the props and the band it mounts. */
const renderIsland = async (): Promise<string> => {
  const node: ReactNode = await CountersIsland({ locale: "de" });
  return renderToStaticMarkup(<>{node}</>);
};

beforeEach(() => {
  resetRateLimits();
  vi.spyOn(console, "warn").mockImplementation(() => undefined);
  vi.stubEnv("LIVE_DATA", "auto");
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  fetchStats.mockReset();
});

describe("TS-WEB-0018-A12: with the stats upstream stubbed empty the counter module is absent", () => {
  it("answers no envelope at all, so the page has no band to mount", async () => {
    fetchStats.mockRejectedValue(new Error("events-api: empty upstream"));

    await expect(liveCounters({ store: memoryStore() })).resolves.toBeUndefined();
  });

  it("renders nothing — no band, no slot, no digit standing in for a figure", async () => {
    fetchStats.mockRejectedValue(new Error("events-api: empty upstream"));

    const html = await renderIsland();
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

  it("an upstream that answers 200 without the one field it has leaves no figure behind either", async () => {
    // Not a rejection this time: a real 200 whose payload omits `totalEvents`,
    // carried by the **real** client — `vi.importActual` puts it back and the
    // transport under it is the stub, so the schema check that raises is the
    // production one, not a mock imitating it. What matters here is that no
    // estimate is produced on the way out of that branch.
    const upstream = await vi.importActual<typeof import("@/src/clients/events-api/client")>(
      "@/src/clients/events-api/client",
    );
    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () =>
          new Response(JSON.stringify({ data: { eventsWithImage: 3 }, status: 200 }), {
            headers: { "content-type": "application/json" },
            status: 200,
          }),
      ),
    );
    fetchStats.mockImplementation(upstream.fetchStats);

    await expect(
      upstream.fetchStats({ host: "https://events.invalid", timeoutMs: 1_000 }),
    ).rejects.toThrow(/schema/);

    const response = await callStatsRoute();
    expect(response.status).toBe(204);
    expect(await renderIsland()).toBe("");
  });

  it("a counted zero is a figure and does render — absence is the upstream's, never the number's", async () => {
    fetchStats.mockResolvedValue({ totalEvents: 0 });

    const html = await renderIsland();
    expect(html).not.toBe("");
    expect(html).toMatch(/\d/);
  });
});
