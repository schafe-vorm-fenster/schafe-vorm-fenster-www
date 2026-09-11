import { describe, expect, it } from "vitest";

import { placeHop, placeHopRoute } from "./place-hop";

/**
 * TS-021-A7, TS-020 D2 row 5, TS-008 D7 row 3 — DEC-070's re-resolution hop
 * as the proxy computes it (F-2-49).
 *
 * The fixtures are the shared demo backend's own
 * (`src/lib/live/mocks/fixtures.ts`): `beispielwalde` is a covered community,
 * `99999` is the postcode geo-api answers "no community" for.
 */

const hop = (path: string, query = "") => placeHop(path, new URLSearchParams(query));

describe("placeHopRoute: only the two `?ort=` routes, in every language", () => {
  it.each([
    ["/dein-ort", "place", "de"],
    ["/dein-ort/starten", "placeStart", "de"],
    ["/en/your-place", "place", "en"],
    ["/en/your-place/start", "placeStart", "en"],
  ])("%s is %s in %s", (path, route, locale) => {
    expect(placeHopRoute(path)).toEqual({ route, locale });
  });

  it.each(["/", "/mitmachen", "/dein-kalender", "/en/about", "/dies-gibt-es-nicht"])(
    "%s is not a hop route",
    (path) => {
      expect(placeHopRoute(path)).toBeUndefined();
    },
  );
});

describe("TS-021-A7: a value that now resolves leaves `/dein-ort/starten`", () => {
  it("hops to `/dein-ort` with the resolved slug", async () => {
    await expect(hop("/dein-ort/starten", "ort=beispielwalde")).resolves.toBe(
      "/dein-ort?ort=beispielwalde",
    );
  });

  it("resolves a postcode to the community's slug, not to the postcode", async () => {
    await expect(hop("/dein-ort/starten", "ort=17509")).resolves.toMatch(
      /^\/dein-ort\?ort=[a-z-]+$/,
    );
  });

  it("keeps the language prefix", async () => {
    await expect(hop("/en/your-place/start", "ort=beispielwalde")).resolves.toBe(
      "/en/your-place?ort=beispielwalde",
    );
  });

  it("carries the campaign parameters across the hop (TS-023 D4)", async () => {
    await expect(
      hop("/dein-ort/starten", "ort=beispielwalde&etcc_med=display&etcc_cmp=herbst&foo=bar"),
    ).resolves.toBe("/dein-ort?ort=beispielwalde&etcc_cmp=herbst&etcc_med=display");
  });

  it("stays put for an uncovered value", async () => {
    await expect(hop("/dein-ort/starten", "ort=99999")).resolves.toBeUndefined();
  });

  it("stays put with no parameter at all", async () => {
    await expect(hop("/dein-ort/starten")).resolves.toBeUndefined();
  });
});

describe("TS-020 D2 row 5: an uncovered value leaves `/dein-ort`", () => {
  it("hops to `/dein-ort/starten` with the query verbatim", async () => {
    await expect(hop("/dein-ort", "ort=99999")).resolves.toBe(
      "/dein-ort/starten?ort=99999",
    );
  });

  it("keeps the language prefix", async () => {
    await expect(hop("/en/your-place", "ort=99999")).resolves.toBe(
      "/en/your-place/start?ort=99999",
    );
  });

  it("carries nothing but the query — TS-021 D4 re-validates on arrival", async () => {
    await expect(hop("/dein-ort", "ort=99999&etcc_med=display")).resolves.toBe(
      "/dein-ort/starten?ort=99999",
    );
  });

  it("stays put for a covered value", async () => {
    await expect(hop("/dein-ort", "ort=beispielwalde")).resolves.toBeUndefined();
  });

  it("stays put for a value the grammar drops (TS-020-A9)", async () => {
    await expect(hop("/dein-ort", "ort=" + "x".repeat(200))).resolves.toBeUndefined();
  });
});

describe("no hop can loop", () => {
  it("the target of each hop does not hop back", async () => {
    const forward = await hop("/dein-ort/starten", "ort=beispielwalde");
    expect(forward).toBeDefined();
    const [path, search = ""] = forward!.split("?");
    await expect(hop(path!, search)).resolves.toBeUndefined();

    const back = await hop("/dein-ort", "ort=99999");
    expect(back).toBeDefined();
    const [backPath, backSearch = ""] = back!.split("?");
    await expect(hop(backPath!, backSearch)).resolves.toBeUndefined();
  });
});
