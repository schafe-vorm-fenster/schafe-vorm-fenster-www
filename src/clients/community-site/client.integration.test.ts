import { describe, expect, it, vi, afterEach } from "vitest";

import { UpstreamError } from "../http";

import page from "./fixtures/community-page.json";
import { fetchCommunityIndex, fetchCommunityPage, communityRouteSlug } from "./client";

/**
 * The tokenless client, against a **recorded** answer.
 *
 * `fixtures/community-page.json` is the `__NEXT_DATA__` block of
 * `https://schafe-vorm-fenster.de/schlatkow.2838887` as it was served on
 * 2026-09-18, trimmed to six events (three of Schlatkow's own, three widened)
 * and to the fields this website reads. Nothing here reaches the network and
 * nothing here needs a credential — which is the whole point of this source.
 */

const config = { host: "https://example.invalid", timeoutMs: 500 };

/** The surface serves HTML with the data embedded, so the fixture is too. */
function asDocument(data: unknown): string {
  return [
    "<!doctype html><html><body><div id=\"__next\">…</div>",
    `<script id="__NEXT_DATA__" type="application/json">${JSON.stringify(data)}</script>`,
    "</body></html>",
  ].join("");
}

function respond(body: string, init: ResponseInit = {}): void {
  vi.stubGlobal("fetch", vi.fn(async () => new Response(body, { status: 200, ...init })));
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("a community's page", () => {
  it("reads the community and its dates out of the embedded data", async () => {
    respond(asDocument(page));

    const { community, events } = await fetchCommunityPage(config, "schlatkow.2838887");

    expect(community.name).toBe("Schlatkow");
    expect(community.slug).toBe("schlatkow");
    expect(community.geoLocation?.identifiers.geonamesId).toBe(2838887);
    expect(events.length).toBeGreaterThan(0);

    const first = events[0]!;
    expect(first._id).toMatch(/\S/u);
    expect(Number.isNaN(new Date(first.start).getTime())).toBe(false);
    // The page carries the place's own dates *and* the widening it already
    // did, which is what `scope` distinguishes.
    expect(new Set(events.map((event) => event.community?._id))).toContain("geoname.2838887");
    expect(events.some((event) => event.scope === "region")).toBe(true);
  });

  it("asks for the canonical route segment, `{slug}.{geonameId}`", async () => {
    const fetchMock = vi.fn(async () => new Response(asDocument(page)));
    vi.stubGlobal("fetch", fetchMock);

    await fetchCommunityPage(config, communityRouteSlug("schlatkow", 2838887));

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://example.invalid/schlatkow.2838887");
    expect(init.method).toBe("GET");
    // TS-WEB-0013 D3: the closed header set, and nothing of the visitor's.
    expect(Object.keys(init.headers as Record<string, string>)).toEqual(["accept"]);
  });
});

describe("failure is one type, so one wrapper can degrade on it", () => {
  it("rejects a page that carries no embedded data", async () => {
    respond("<!doctype html><html><body>nothing here</body></html>");
    await expect(fetchCommunityPage(config, "schlatkow.2838887")).rejects.toBeInstanceOf(UpstreamError);
  });

  it("rejects embedded data that is not JSON", async () => {
    respond(
      '<script id="__NEXT_DATA__" type="application/json">{ not json </script>',
    );
    await expect(fetchCommunityPage(config, "schlatkow.2838887")).rejects.toThrow(/not JSON/u);
  });

  it("rejects a shape the schema does not recognise", async () => {
    respond(asDocument({ props: { pageProps: { community: { name: "Schlatkow" } } } }));
    await expect(fetchCommunityPage(config, "schlatkow.2838887")).rejects.toThrow(/schema/u);
  });

  it("rejects a non-2xx answer", async () => {
    respond("nope", { status: 503 });
    await expect(fetchCommunityPage(config, "schlatkow.2838887")).rejects.toThrow(/HTTP 503/u);
  });

  it("refuses a body past the cap rather than reading it", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () =>
          new Response("x", { status: 200, headers: { "content-length": "99000000" } }),
      ),
    );
    await expect(fetchCommunityPage(config, "schlatkow.2838887")).rejects.toThrow(/larger than/u);
  });
});

describe("the community index", () => {
  it("reads every covered community off the start page", async () => {
    respond(
      asDocument({
        props: {
          pageProps: {
            communities: [page.props.pageProps.community],
          },
        },
      }),
    );

    const communities = await fetchCommunityIndex(config);
    expect(communities).toHaveLength(1);
    expect(communities[0]?.slug).toBe("schlatkow");
  });
});
