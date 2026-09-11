import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { resetRateLimits } from "./bff";
import { DEMO_COUNTY } from "./mocks/fixtures";
import { REGION_EXAMPLE_MAX } from "./region";

import { GET } from "@/app/api/region/[county]/examples/route";

const call = (county: string, query = "") =>
  GET(new Request(`http://localhost:3100/api/region/${county}/examples${query}`), {
    params: Promise.resolve({ county }),
  });

beforeEach(() => {
  resetRateLimits();
  vi.stubEnv("LIVE_DATA", "mock");
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("TS-008 D1 pos 3 / DEC-034: a designed set of examples, never a place list", () => {
  it("answers a capped set of active example places with their date counts", async () => {
    const body = await (await call(DEMO_COUNTY.id)).json();

    expect(body.data.examples.length).toBeGreaterThan(0);
    expect(body.data.examples.length).toBeLessThanOrEqual(REGION_EXAMPLE_MAX);
    for (const example of body.data.examples) {
      expect(example).toHaveProperty("slug");
      expect(example.eventCount).toBeGreaterThan(0);
    }
  });

  it("never exceeds the cap, however large a max the caller asks for", async () => {
    const body = await (await call(DEMO_COUNTY.id, "?max=99")).json();
    expect(body.data.examples.length).toBeLessThanOrEqual(REGION_EXAMPLE_MAX);
  });

  it("answers the single nearest active place when the caller asks for one", async () => {
    const body = await (await call(DEMO_COUNTY.id, "?max=1")).json();
    expect(body.data.examples).toHaveLength(1);
  });

  it("marks the set demo:true — the county activity ranking has no upstream operation", async () => {
    const body = await (await call(DEMO_COUNTY.id)).json();
    expect(body.demo).toBe(true);
  });

  it("carries the active-places cache lifetime of TS-003 D5", async () => {
    const response = await call(DEMO_COUNTY.id);
    expect(response.headers.get("cache-control")).toBe(
      "public, s-maxage=3600, stale-while-revalidate=604800",
    );
  });

  it("rejects an empty county rather than answering for all of Germany", async () => {
    expect((await call("")).status).toBe(400);
  });
});
