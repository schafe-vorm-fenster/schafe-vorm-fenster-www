import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { resetRateLimits } from "./bff";

import { GET } from "@/app/api/stats/route";

/**
 * TS-009-A7 / TS-009 D6 — the counter exception, in its own file on purpose.
 *
 * The `last-good` store is process-wide, so a test that must see a **cold**
 * cache cannot share a worker with one that warms it. Vitest isolates test
 * files, which is the only reliable way to assert the cold branch.
 */

beforeEach(() => {
  resetRateLimits();
  // A real backend pointed at an unroutable host: the upstream fails, and
  // with an empty `last-good` there is no tier the counters may take.
  vi.stubEnv("LIVE_DATA", "real");
  vi.stubEnv("EVENTSAPI_HOST", "http://127.0.0.1:1");
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("TS-008-A5 / TS-009-A7: counters with a cold cache are removed, never snapshotted", () => {
  it("answers 204 with no body — the module is absent from the page", async () => {
    const response = await GET(new Request("http://localhost:3100/api/stats"));

    expect(response.status).toBe(204);
    expect(await response.text()).toBe("");
  });

  it("never answers a zero, a placeholder figure or an 'unavailable' sentence", async () => {
    const text = await (await GET(new Request("http://localhost:3100/api/stats"))).text();
    expect(text).not.toMatch(/0|unavailable|nicht verfügbar/);
  });

  it("is not cached — a removed module must not stick in a shared cache", async () => {
    const response = await GET(new Request("http://localhost:3100/api/stats"));
    expect(response.headers.get("cache-control")).toBe("no-store");
  });
});
