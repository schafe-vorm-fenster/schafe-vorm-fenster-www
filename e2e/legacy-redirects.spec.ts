import { expect, test } from "@playwright/test";

/**
 * Issues 192 and 193 / TS-WEB-0011-A2: a legacy URL answers a permanent redirect
 * in one hop. A sample against the server under test; the full table is held by
 * `src/lib/routes/redirect-map.test.ts`. Only the first hop is followed here
 * (`maxRedirects: 0`), so no request leaves the server for community-site.
 */
const SAMPLE: ReadonlyArray<readonly [string, string]> = [
  ["/funktionen", "/dein-kalender"],
  ["/presse", "/ueber-uns/archiv"],
  ["/impressum", "/rechtliches#impressum"],
  ["/hilfe", "https://schafe-vorm-fenster.de/hilfe"],
  ["/hilfe/kalender-anmelden", "https://schafe-vorm-fenster.de/hilfe/kalender-anmelden"],
  ["/hilfe/portalize-einbinden", "https://schafe-vorm-fenster.de/hilfe/portalize-einbinden"],
  ["/hilfe/woher-kommt-der-name", "https://schafe-vorm-fenster.de/hilfe/woher-kommt-der-name"],
];

test.describe("legacy URLs redirect permanently, in one hop", () => {
  for (const [from, to] of SAMPLE) {
    test(`${from} -> ${to}`, async ({ request }) => {
      const response = await request.get(from, { maxRedirects: 0 });
      expect(response.status()).toBe(301);
      const location = response.headers()["location"]!;
      // Internal targets may come back relative or absolute on this host.
      expect(location.replace(/^https?:\/\/localhost:\d+/, "")).toBe(to);
    });
  }

  test("the campaign query string survives the hop", async ({ request }) => {
    const response = await request.get("/hilfe/teilen?etcc_cmp=a&etcc_med=b", {
      maxRedirects: 0,
    });
    expect(response.status()).toBe(301);
    const location = new URL(response.headers()["location"]!);
    expect(location.pathname).toBe("/hilfe/teilen");
    expect(location.searchParams.get("etcc_cmp")).toBe("a");
    expect(location.searchParams.get("etcc_med")).toBe("b");
  });

  test("/start stays a live page, not a redirect", async ({ request }) => {
    const response = await request.get("/start", { maxRedirects: 0 });
    expect(response.status()).toBe(200);
  });
});
