import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { resetRateLimits } from "./bff";

import { GET } from "@/app/api/stats/route";

const call = () => GET(new Request("http://localhost:3100/api/stats"));

beforeEach(() => {
  resetRateLimits();
  vi.stubEnv("LIVE_DATA", "mock");
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("TS-008-A9: the counter band renders figures, never substitutes", () => {
  it("answers the figures the backend supplied, each as a number", async () => {
    const response = await call();
    const body = await response.json();

    expect(response.status).toBe(200);
    for (const [name, value] of Object.entries(body.data)) {
      expect(typeof value, `${name} is a counted figure`).toBe("number");
    }
  });

  it("marks the mocked figures demo:true — Q-037 leaves two of three unbacked", async () => {
    const body = await (await call()).json();
    expect(body.demo).toBe(true);
  });

  it("carries the counters cache lifetime of TS-003 D5", async () => {
    const response = await call();
    expect(response.headers.get("cache-control")).toBe(
      "public, s-maxage=900, stale-while-revalidate=259200",
    );
  });

  it("exports GET and nothing else (TS-017-A10)", async () => {
    expect(Object.keys(await import("@/app/api/stats/route"))).toEqual(["GET"]);
  });
});
