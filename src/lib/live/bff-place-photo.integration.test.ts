import { readFileSync } from "node:fs";
import { join } from "node:path";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { resetRateLimits } from "./bff";
import { setGeoLookupStore } from "./geo-lookup";
import { memoryStore } from "./last-good";

import { GET } from "@/app/api/places/[slug]/photo/route";

/**
 * TS-WEB-0020-A19 — the photo route against stubbed upstreams. Every name,
 * file and author below is fictitious; only the slug is a covered place,
 * because the route answers 404 for anything else.
 */

const SLUG = "schlatkow";
const GEONAME_ID = 2838887;
const FILE = "Testdorf Dorfkirche.jpg";

type Scenario = {
  image?: string | null;
  geoFails?: boolean;
  assets?: { status: number; headers?: Record<string, string> } | "timeout";
};

let scenario: Scenario;

function community(extra: Record<string, unknown> = {}) {
  return { geonameId: GEONAME_ID, name: "Schlatkow", slug: SLUG, geo: { point: { lat: 53.92, lng: 13.58 } }, ...extra };
}

const fixture = JSON.parse(
  readFileSync(join(process.cwd(), "src/clients/community-site/fixtures/community-page.json"), "utf8"),
) as unknown;

function stubFetch() {
  vi.stubGlobal(
    "fetch",
    vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.includes("/community/slug/")) return Response.json({ data: community() });
      if (url.includes(`/community/${GEONAME_ID}`)) {
        if (scenario.geoFails) return new Response("down", { status: 503 });
        return Response.json({ data: community({ image: scenario.image ?? null }) });
      }
      if (url.includes("/api/image")) {
        const assets = scenario.assets ?? { status: 200 };
        if (assets === "timeout") throw Object.assign(new Error("timeout"), { name: "TimeoutError" });
        return new Response("webp", {
          status: assets.status,
          headers: { "content-type": assets.status === 200 ? "image/webp" : "application/json", ...assets.headers },
        });
      }
      // The public village calendar — the tokenless source.
      return new Response(
        `<html><script id="__NEXT_DATA__" type="application/json">${JSON.stringify(fixture)}</script></html>`,
        { status: 200, headers: { "content-type": "text/html" } },
      );
    }),
  );
}

const call = (slug = SLUG) =>
  GET(new Request(`http://localhost:3100/api/places/${slug}/photo`), { params: Promise.resolve({ slug }) });

const ATTRIBUTED = { "content-type": "image/webp", license: "CC BY-SA 4.0", copyright: "(C) 2019 Erika Musterfrau" };

beforeEach(() => {
  resetRateLimits();
  // Each scenario stubs geo-api afresh; a community cached by the one before
  // (DEC-0181) must not answer it.
  setGeoLookupStore(memoryStore());
  scenario = {};
  vi.stubEnv("LIVE_DATA", "auto");
  vi.stubEnv("GEOAPI_READ_TOKEN", "test-token");
  stubFetch();
});

afterEach(() => {
  setGeoLookupStore(undefined);
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("TS-WEB-0020-A19: the place photo route answers a licensed photograph or nothing", () => {
  it("answers geo-api's photograph with its licence, author and Commons source", async () => {
    scenario = {
      image: `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(FILE)}`,
      assets: { status: 200, headers: ATTRIBUTED },
    };
    const response = await call();
    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("public, s-maxage=3600, stale-while-revalidate=604800");
    const body = await response.json();
    expect(body.data).toMatchObject({
      fileName: FILE,
      licence: "CC BY-SA 4.0",
      author: "Erika Musterfrau",
      year: "2019",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Testdorf_Dorfkirche.jpg",
    });
    expect(body.data.src).toMatch(/\/api\/image\?wikimediaCommonsId=Testdorf%20Dorfkirche\.jpg$/u);
    expect(JSON.stringify(body)).not.toContain("test-token");
  });

  it("answers a cacheable 204 when the place has no photograph", async () => {
    scenario = { image: null };
    const response = await call();
    expect(response.status).toBe(204);
    expect(response.headers.get("cache-control")).toBe("public, s-maxage=3600, stale-while-revalidate=604800");
  });

  it("drops a photograph assets-api states no licence for", async () => {
    scenario = {
      image: `https://commons.wikimedia.org/wiki/File:${FILE}`,
      assets: { status: 200, headers: { "content-type": "image/webp", copyright: "(C) 2019 Erika Musterfrau" } },
    };
    expect((await call()).status).toBe(204);
  });

  it("drops an image that is not on Commons — it has no stated licence", async () => {
    scenario = { image: "https://example.test/testdorf.jpg" };
    expect((await call()).status).toBe(204);
  });

  it("answers 204 no-store when the image does not deliver, so the next view asks again", async () => {
    scenario = { image: `https://commons.wikimedia.org/wiki/File:${FILE}`, assets: { status: 500 } };
    const failed = await call();
    expect(failed.status).toBe(204);
    expect(failed.headers.get("cache-control")).toBe("no-store");

    scenario = { image: `https://commons.wikimedia.org/wiki/File:${FILE}`, assets: "timeout" };
    expect((await call()).headers.get("cache-control")).toBe("no-store");
  });

  it("takes the public village calendar's photograph when geo-api does not answer", async () => {
    scenario = { geoFails: true, assets: { status: 200, headers: ATTRIBUTED } };
    const body = await (await call()).json();
    expect(body.data.fileName).toBe("Melkerschule Schlatkow.jpg");
  });

  it("needs no token: without one the public calendar is the source", async () => {
    vi.stubEnv("GEOAPI_READ_TOKEN", "");
    scenario = { assets: { status: 200, headers: ATTRIBUTED } };
    const response = await call();
    expect(response.status).toBe(200);
  });

  it("keeps an uncovered slug a 404", async () => {
    vi.stubEnv("LIVE_DATA", "mock");
    expect((await call("gibt-es-hier-nicht")).status).toBe(404);
  });

  it("is read-only by construction", async () => {
    const handlers = await import("@/app/api/places/[slug]/photo/route");
    expect(Object.keys(handlers)).toEqual(["GET"]);
  });
});
