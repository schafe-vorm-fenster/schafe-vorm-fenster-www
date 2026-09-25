import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { resetRateLimits } from "./bff";
import { MAX_SUGGESTIONS } from "./places";

import { GET } from "@/app/api/places/search/route";

/**
 * Integration level: the actual route handler, in-process, against the mock
 * backend (`LIVE_DATA=mock`) and against the committed index (`auto`, no
 * token) — TS-WEB-0008 D7/D7a/D10, TS-WEB-0013 D2, DEC-0079.
 */

const call = (url: string, headers?: Record<string, string>) =>
  GET(new Request(url, { headers }));

const search = (query: string) => call(`http://localhost:3100/api/places/search?q=${encodeURIComponent(query)}`);

beforeEach(() => {
  resetRateLimits();
  vi.stubEnv("LIVE_DATA", "mock");
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("TS-WEB-0008-A14: the place search takes a name, classifies, and never answers a bare nothing", () => {
  it("answers a typed place name with the covered outcome and suggestions carrying that place", async () => {
    const response = await search("Schlat");
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.data.outcome.kind).toBe("covered");
    expect(body.data.outcome.place.slug).toBe("schlatkow");
    expect(body.data.suggestions.map((place: { slug: string }) => place.slug)).toContain("schlatkow");
  });

  it("answers a typed municipality name with the place inside it, rendered as Ort (Gemeinde)", async () => {
    // `Groß Polzin` is the mock municipality of Quilow and no demo place's own name.
    const body = await (await search("Polzin")).json();

    expect(body.data.outcome.kind).toBe("covered");
    const quilow = body.data.suggestions.find((place: { slug: string }) => place.slug === "quilow");
    expect(quilow).toBeDefined();
    expect(quilow.municipality).toBe("Groß Polzin");
    expect(`${quilow.name} (${quilow.municipality})`).toBe("Quilow (Groß Polzin)");
  });

  it("carries the municipality on every suggestion, so the row can read Ort (Gemeinde)", async () => {
    const body = await (await search("Sch")).json();
    expect(body.data.suggestions.length).toBeGreaterThan(0);
    for (const place of body.data.suggestions) expect(typeof place.municipality).toBe("string");
  });

  it("classifies a name nothing covers as 'uncovered' — never empty, never a hint, never a postcode fallback", async () => {
    const response = await search("Oberammergau");
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.data.outcome).toEqual({ kind: "uncovered", query: "Oberammergau" });
    expect(body.data.suggestions).toEqual([]);
    expect(JSON.stringify(body)).not.toMatch(/unsupported|zip-only|postcode|Postleitzahl/u);
  });

  it("treats five typed digits like any other name: no postcode mode, no match, the uncovered outcome", async () => {
    // `17509` would resolve through the mock's postcode lookup — the place
    // search must not take that path (DEC-0079 §1, TS-WEB-0008 D7's table).
    const body = await (await search("17509")).json();
    expect(body.data.outcome).toEqual({ kind: "uncovered", query: "17509" });
    expect(body.data.suggestions).toEqual([]);
  });

  it("rejects an empty query with 400 rather than searching for nothing", async () => {
    expect((await call("http://localhost:3100/api/places/search?q=")).status).toBe(400);
    expect((await call("http://localhost:3100/api/places/search")).status).toBe(400);
  });
});

describe("DEC-0079 §7: `?zip=` stays on the BFF for the order flow's scope step only", () => {
  it("resolves a covered postcode to its places when asked through `zip`", async () => {
    const response = await call("http://localhost:3100/api/places/search?zip=17509");
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.data.outcome.kind).toBe("covered");
    expect(body.data.outcome.place.slug).toMatch(/^[a-z0-9-]+$/);
  });

  it("classifies a postcode from an uncovered region as 'uncovered', not as an empty answer", async () => {
    const body = await (await call("http://localhost:3100/api/places/search?zip=99999")).json();
    expect(body.data.outcome).toEqual({ kind: "uncovered", query: "99999" });
    expect(body.data.suggestions).toEqual([]);
  });

  it("does not run a name through the postcode lookup", async () => {
    const body = await (await call("http://localhost:3100/api/places/search?zip=Schlat")).json();
    expect(body.data.outcome).toEqual({ kind: "uncovered", query: "Schlat" });
  });

  it("lets `q` win when both parameters arrive — the place search is the name search", async () => {
    const body = await (await call("http://localhost:3100/api/places/search?q=17509&zip=17509")).json();
    expect(body.data.outcome).toEqual({ kind: "uncovered", query: "17509" });
  });
});

describe("TS-WEB-0008-A1 / TS-WEB-0013-A5: the route is the browser's only reachable surface", () => {
  it("marks every mocked payload demo:true so the Demo-Daten badge renders", async () => {
    const body = await (await search("Schlat")).json();
    expect(body.demo).toBe(true);
    expect(body).toHaveProperty("tier");
    expect(body).toHaveProperty("fetchedAt");
    expect(body).toHaveProperty("stale");
  });

  it("names no upstream host, token or upstream error in the response body", async () => {
    const text = await (await search("Schlat")).text();
    expect(text).not.toContain("geo.api-v2");
    expect(text).not.toContain("token");
  });

  it("refuses a cross-origin request (CON-WEB-0044 · CON-WEB-0045)", async () => {
    const response = await call("http://localhost:3100/api/places/search?q=Schlat", {
      origin: "https://not-our-site.example",
    });
    expect(response.status).toBe(403);
  });

  it("admits a request from the site's own origin", async () => {
    const response = await call("http://localhost:3100/api/places/search?q=Schlat", {
      origin: "https://www.schafe-vorm-fenster.de",
    });
    expect(response.status).toBe(200);
  });

  it("rate-limits a caller that hammers the route", async () => {
    let last = 200;
    for (let attempt = 0; attempt < 70; attempt += 1) {
      last = (await search("Schlat")).status;
    }
    expect(last).toBe(429);
  });
});

describe("TS-WEB-0003 D5 / TS-WEB-0009-A5: the route carries its data kind's cache lifetime", () => {
  it("sends the active-places TTL and serve-stale window as Cache-Control", async () => {
    const response = await search("Schlat");
    expect(response.headers.get("cache-control")).toBe(
      "public, s-maxage=3600, stale-while-revalidate=604800",
    );
  });
});

/**
 * The same route in `auto` — the mode a real deployment runs in. The name
 * search answers from the committed community index, so a typed name is a
 * **real** answer even with no read token anywhere, and that is what the
 * typeahead fetches.
 */
describe("auto mode: the typeahead's upstream, without a credential", () => {
  beforeEach(() => {
    vi.stubEnv("LIVE_DATA", "auto");
    vi.stubEnv("GEOAPI_READ_TOKEN", "");
    vi.stubEnv("EVENTSAPI_READ_TOKEN", "");
  });

  it("answers a typed name with real, covered communities, their municipality, and no demo flag", async () => {
    const response = await search("Schlat");
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.demo, "a committed index of real places is not demo data").toBe(false);
    expect(body.data.outcome.kind).toBe("covered");
    expect(body.data.outcome.place.name).toBe("Schlatkow");
    expect(body.data.outcome.place.municipality).toBe("Schmatzin");
    expect(body.data.suggestions.map((place: { name: string }) => place.name)).toContain("Schlatkow");
  });

  it("answers a typed municipality name with the places inside it (TS-WEB-0008-A14)", async () => {
    // Gerswalde is a municipality of several covered villages and no village's own name.
    const body = await (await search("Gerswalde")).json();
    expect(body.data.outcome.kind).toBe("covered");
    expect(body.data.suggestions.length).toBeGreaterThan(0);
    for (const place of body.data.suggestions) expect(place.municipality).toBe("Gerswalde");
  });

  it("caps the suggestion list at D7a's four rows", async () => {
    expect(MAX_SUGGESTIONS).toBe(4);
    const body = await (await search("er")).json();
    expect(body.data.suggestions.length).toBe(4);
  });

  it("classifies a name nothing covers as uncovered, not as an error", async () => {
    const body = await (await search("Oberammergau")).json();
    expect(body.data.outcome).toMatchObject({ kind: "uncovered" });
    expect(body.data.suggestions).toEqual([]);
  });

  it("finds nothing for five digits — the index carries no postcodes and the search offers none", async () => {
    const body = await (await search("17509")).json();
    expect(body.data.outcome).toEqual({ kind: "uncovered", query: "17509" });
  });

  it("still sends the cache lifetime of its data kind (TS-WEB-0003 D5)", async () => {
    const response = await search("Schlat");
    expect(response.headers.get("cache-control")).toMatch(/s-maxage=3600/u);
  });

  it("carries no ecosystem host and no token in the answer", async () => {
    const text = await (await search("Schlat")).text();
    expect(text).not.toMatch(/geo\.api|events\.api|READ_TOKEN/u);
  });
});
