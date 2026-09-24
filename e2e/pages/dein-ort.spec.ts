import { expect, test } from "@playwright/test";

import type { APIRequestContext } from "@playwright/test";

import { checkRhythm } from "../../src/components/section-shell/rhythm";

import type { RhythmEntry } from "../../src/components/section-shell/rhythm";

/**
 * TS-WEB-0020 — `/dein-ort`, the acceptance walk.
 *
 * Without `?ort=` the page renders **S0**, "the prerendered shell, complete
 * on its own" (TS-WEB-0020 D2) — that is what the static shell contains, and most
 * criteria below walk it.
 *
 * M4 wired `?ort=` through `src/lib/live/places.ts`, so states A and B are
 * reachable and walked here. The two slugs are the live layer's own
 * fixtures: `DEMO_PLACES[0]` always has dates (state A) and `EMPTY_DEMO_SLUG`
 * never does (state B) — `src/lib/live/mocks/fixtures.ts` names both, exactly
 * so a gate-level walk can reach a branch demo data would not produce on its
 * own. What is still `test.fixme` is what M4 did not build, with its reason.
 */

/** `src/lib/live/mocks/fixtures.ts` — a covered place that always has dates. */
const PLACE_WITH_DATES = "schlatkow";

/**
 * A covered community whose window is **empty** — TS-WEB-0008 D4's conversion
 * moment, and the state this page changes its primary conversion for.
 *
 * It used to be `EMPTY_DEMO_SLUG` (`lassan`), the mock backend's own marker.
 * That stopped reaching the branch when the dates capability moved to the
 * public village calendar, which needs no credential and therefore answers
 * in every environment (`src/lib/live/README.md`, "the three sources"):
 * Lassan has real dates now, so the fixture asked for an empty place and got
 * a full one. Making the mock override a real answer for one slug would ship
 * a village that claims to be empty when it is not, so the walk uses a
 * community that genuinely has nothing in its window, and confirms that from
 * the BFF before it walks — a village entering its first date is content
 * news, not a regression, and the list is long enough to survive it.
 */
/*
 * `lassan` is back on the list — **last**, and for the other backend.
 *
 * The note above is about `LIVE_DATA=auto`, where Lassan has real dates and
 * so is not empty. Under `LIVE_DATA=mock` the four candidates above are not
 * covered at all (`/api/places/<slug>/events` answers "place not covered"),
 * and `lassan` is the mock's own `EMPTY_DEMO_SLUG` — the covered community
 * F-2-61 gave a neighbour (`zuessow`) precisely so the empty state has
 * something to widen to. With no candidate left, `emptyPlace()` returned
 * `undefined` and three state-B walks skipped themselves silently on every
 * mock run (TS-WEB-0020-A3, TS-WEB-0020-A8's second half, TS-WEB-0019-A4).
 *
 * Appending it costs the `auto` backend nothing: the helper asks the BFF
 * whether a candidate is *actually* empty before returning it, so on `auto`
 * Lassan is passed over exactly as the note above intends, and the earlier
 * candidates answer first anyway.
 */
const EMPTY_PLACE_CANDIDATES = ["achimswalde", "altenhof", "kattenberg", "zwiedorf", "lassan"];

/** The first candidate the live layer still answers empty for. */
async function emptyPlace(request: APIRequestContext): Promise<string | undefined> {
  for (const slug of EMPTY_PLACE_CANDIDATES) {
    const response = await request.get(`/api/places/${slug}/events?window=upcoming`);
    if (!response.ok()) continue;
    const body = (await response.json()) as { data?: { events?: unknown[] } };
    if ((body.data?.events ?? []).length === 0) return slug;
  }
  return undefined;
}

const PHONE = { width: 360, height: 640 };
const DESKTOP = { width: 1280, height: 800 };

test.describe("TS-WEB-0020 — your place", () => {
  test("TS-WEB-0020-A2: walk state A — place name as h1, ≤ 3 rows, the handover is the primary CTA", async ({
    page,
  }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto(`/dein-ort?ort=${PLACE_WITH_DATES}`);

    // The `h1` is the place name in every state and at the same DOM position
    // (TS-WEB-0020 D5). S0 carries the generic one; state A carries the resolved
    // place, and the module's own heading names it too.
    const dates = page.locator("#place-dates");
    await expect(dates.locator("h2")).toContainText("Schlatkow");

    // "≤ 3 rows" — position 1's fixed row count (TS-WEB-0008 D1).
    const rows = dates.locator("article");
    expect(await rows.count()).toBeGreaterThan(0);
    expect(await rows.count()).toBeLessThanOrEqual(3);

    // The handover is a real link into the app, and once a place is known it
    // **is** the page's conversion (polish brief G-5, page 2: "the hero
    // headline is followed immediately by the three live rows and the
    // homescreen CTA"). Before the polish pass the marker stayed on the
    // search field even in state A, so the page's stated primary conversion
    // — `save-calendar-to-homescreen`, `page.meta.ts` — was carried by no
    // control at all and the search was offered to a visitor who had just
    // searched. The hero therefore has no CTA of its own in this state;
    // repeating the offer above the rows it is about would be the third of
    // three (TS-WEB-0006 D4 keeps the search as the primary only while no place
    // is known, which is state S0 and state B's publish offer).
    const handover = dates.locator('a[href^="https://app."]');
    await expect(handover).toHaveCount(1);
    await expect(handover).toHaveAttribute("href", new RegExp(PLACE_WITH_DATES));
    await expect(handover).toHaveAttribute("data-cta", "primary");
    await expect(page.locator('[data-cta="primary"]')).toHaveCount(1);

    // The module's heading is in the accessible tree and out of sight: the
    // `h1` two lines above already says this sentence, and the page said it
    // twice in a row before the polish pass (brief, page 2, fix 2).
    await expect(dates.locator("h2")).toHaveCount(1);
    expect(
      await dates.locator("h2").evaluate((node) => node.getBoundingClientRect().height),
    ).toBeLessThan(4);
  });

  test("TS-WEB-0020-A3: walk state B — the publish offer in the module slot, the focus job shifts", async ({
    page,
    request,
  }) => {
    const slug = await emptyPlace(request);
    test.skip(slug === undefined, "no covered community is empty right now");
    await page.setViewportSize(DESKTOP);
    await page.goto(`/dein-ort?ort=${slug}`);

    // SRC-0002's sentence belongs to this page and stands once, as the `h1`.
    // It used to stand twice — as the headline and again, verbatim, as the
    // first line of the block right under it (brief, page 2: the second
    // identical heading goes away).
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      /noch nichts eingetragen/i,
    );
    expect(
      ((await page.locator("#main").innerText()).match(/noch nichts eingetragen/gi) ?? []).length,
    ).toBe(1);

    const dates = page.locator("#place-dates");
    // TS-WEB-0008 D4: a covered place with zero dates is the conversion moment,
    // not an error — the publish offer *occupies* the module slot, with its
    // own line over the button rather than the headline's sentence again.
    await expect(dates.locator("p").first()).not.toBeEmpty();
    // No empty list, no error styling, no retry control.
    await expect(dates.locator("button")).toHaveCount(0);

    // The focus job shifts: the offer leads to `register-as-publisher`'s page
    // (`page.meta.ts`'s `emptyState`), not to the calendar handover — and it
    // carries the page's one `data-cta="primary"` (F-2-61). The target is
    // inside `/mitmachen`, at the route the goal is actually fired on, with
    // the resolved slug: TS-WEB-0023 D5 names "the `/dein-ort` empty state" as one
    // of the four surfaces `?ort=` reaches `/mitmachen/registrieren` from.
    const offer = dates.locator('a[href^="/mitmachen"]');
    await expect(offer).toHaveCount(1);
    await expect(offer).toHaveAttribute("data-cta", "primary");
    await expect(offer).toHaveAttribute("href", `/mitmachen/registrieren?ort=${slug}`);
    await expect(dates.locator('a[href^="https://app."]')).toHaveCount(0);

    // TS-WEB-0008-A6: position 2 renders, labelled as surroundings — in state B it
    // is the *first* evidence, so an empty module is the defect, not a state.
    const nearby = page.locator("#nearby");
    await expect(nearby.locator("article").first()).toBeVisible();
    expect(await nearby.locator("h2").first().innerText()).not.toContain("Lassan");
    // The closing block repeats the *current* state's offer, with the
    // page's own promise over it (G-6): in state B that is the publishing
    // route, not the calendar handover.
    await expect(page.locator(`#closing-cta a[href^="/mitmachen/registrieren"]`)).toHaveCount(1);

    // No raw markdown reaches the visitor: the `→ `/mitmachen`` routing note
    // beside the CTA label is not copy.
    const body = await dates.innerText();
    expect(body).not.toContain("`");
    expect(body).not.toContain("→");

    // `role="status"`: the shift is announced once (TS-WEB-0009 D7).
    await expect(dates.locator('[role="status"]')).toHaveCount(1);
  });

  /**
   * **Changed by the polish pass** (brief, page 2, fix 3). The four stories
   * were one 1320 px `paper` block — `#value-stories` — with four `article`s
   * inside it, no kicker, no image and no ground change between them. They
   * are four **sections** now, on alternating grounds, each carrying its own
   * hand-off line; so the count is over `[data-block="value-story"]` rather
   * than over the children of one container, and the example box is asserted
   * where a story has one: two of the four are picture-led instead (a
   * picture, a live row *and* a quote is three pieces of evidence for one
   * argument, and four stories built that way were a 3 000 px wall).
   */
  test("TS-WEB-0020-A4: exactly four value stories, each with a title, a story and its own evidence", async ({
    page,
  }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto("/dein-ort");

    const stories = page.locator('[data-block="value-story"]');
    await expect(stories).toHaveCount(4);

    for (let index = 0; index < 4; index += 1) {
      const story = stories.nth(index);
      await expect(story.locator("article h2")).toHaveCount(1);
      await expect(story.locator("article p").first()).not.toBeEmpty();
      // Evidence: a live row, a live module, or a photograph — never none.
      const evidence = await story.locator("[data-example-level], img").count();
      expect(evidence, `story ${index + 1} carries no evidence`).toBeGreaterThan(0);
    }

    // The grounds alternate, which is what stops four arguments in a row
    // from reading as one long block.
    const surfaces = await stories.evaluateAll((nodes) =>
      nodes.map((node) => node.getAttribute("data-surface")),
    );
    expect(new Set(surfaces).size).toBeGreaterThan(2);

    // Every example names a real covered place, and nothing in the box says
    // the box is a stand-in — Jan, 2026-09-18. The provenance is the module's
    // own `data-demo`/`data-mock`, asserted in `e2e/content-compliance.spec.ts`.
    const exampleText = (await stories.allTextContents()).join(" ");
    expect(exampleText).toMatch(/Schlatkow|Schmatzin|Rubkow|Quilow|Groß Kiesow|Züssow|Lassan/);
    for (const marking of ["Beispiel", "Demo", "Platzhalter"]) {
      expect(exampleText, marking).not.toContain(marking);
    }
  });

  test.fixme(
    "TS-WEB-0020-A5: the four stories' proof_refs resolve in the installed @schafe-vorm-fenster/proof [M4 — TS-WEB-0005 D5 relevance engine; the stories carry no proof_ref in the artifact yet]",
    () => {},
  );

  /**
   * **Changed by the polish pass** (brief, page 2, "the testimonials are not
   * rendered at all, although four real quotes sit in
   * `content/pages/dein-ort/de.md`"; fix 3: "render them").
   *
   * The criterion this replaces asserted the *absence* of every quote, on the
   * reading of TS-WEB-0020-A6 that no testimonial may stand while its
   * `usage_rights` are unverified (Q-0014). What the artifact carries is not
   * an unverified paraphrase: four named people, quoted verbatim from the
   * hub's own proof records, each with its attribution and its year, each
   * with a `clearance: pending` note naming the record and the reason. The
   * brief decides that the pre-go-live hardening round clears them and that
   * the page ships with them; this test holds the half that did not change —
   * that no quote is anonymous, invented, or a stock sentence about "users".
   */
  test("TS-WEB-0020-A6: every story closes on a named, attributed quote", async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto("/dein-ort");

    const quotes = page.locator('[data-block="value-story"] blockquote');
    await expect(quotes).toHaveCount(4);

    for (let index = 0; index < 4; index += 1) {
      const quote = quotes.nth(index);
      // The sentence, and the person who said it — never one without the other.
      await expect(quote.locator("p")).not.toBeEmpty();
      const attribution = (await quote.locator("footer").innerText()).trim();
      expect(attribution.length, `quote ${index + 1} has no attribution`).toBeGreaterThan(6);
    }

    const text = (await page.locator("#main").textContent()) ?? "";
    expect(text).not.toMatch(/Nutzer sagen|users say|unsere Kundinnen|our customers/i);
    // The four people the artifact names, and nobody else.
    for (const name of ["Kurzweg", "Zschiesche", "Eichler", "Wendt"]) {
      expect(text, name).toContain(name);
    }
  });

  test("TS-WEB-0020-A7: the homescreen block renders iOS and Android, always, with the app handover", async ({
    page,
  }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto("/dein-ort");

    const block = page.locator("#homescreen");
    await expect(block.locator('[data-platform="ios"]')).toHaveCount(1);
    await expect(block.locator('[data-platform="android"]')).toHaveCount(1);
    await expect(block.locator('[data-platform="ios"] li').first()).not.toBeEmpty();
    await expect(block.locator('[data-platform="android"] li').first()).not.toBeEmpty();

    const href = await block.locator("a").last().getAttribute("href");
    expect(href).toMatch(/^https:\/\/app\.schafe-vorm-fenster\.de\//);
  });

  test("TS-WEB-0020-A7: the DOM is identical under an iPhone and an Android user agent", async ({
    browser,
  }) => {
    const markup: string[] = [];
    for (const userAgent of [
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15",
      "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36",
    ]) {
      const context = await browser.newContext({ userAgent });
      const page = await context.newPage();
      await page.goto("/dein-ort");
      // Both snapshots have to be taken in the same lifecycle phase, or the
      // comparison reports the hydration signal instead of a user-agent
      // difference (F-2-71).
      await expect(
        page.locator("#homescreen [data-conversion-tracker]"),
      ).toHaveAttribute("data-hydrated", "true");
      markup.push((await page.locator("#homescreen").innerHTML()) ?? "");
      await context.close();
    }
    expect(markup[0]).toBe(markup[1]);
  });

  /**
   * The analytics collector is `mock-tracker.ts` by decision (`state/open.md`
   * row 130) and it logs every conversion to the console, so the trigger
   * contract is walkable — the skip that said "TS-WEB-0012 analytics is not built"
   * was reading the *adapter*, not the wiring.
   */
  test("TS-WEB-0020-A8: every app handover emits save-calendar-to-homescreen exactly once", async ({
    page,
  }) => {
    // Three call sites, each walked from its own fresh page view, each
    // waiting for hydration: the walk is long by construction.
    test.slow();

    const fires: string[] = [];
    page.on("console", (message) => {
      if (message.text().includes("conversion")) fires.push(message.text());
    });
    // The handover leaves this origin; the assertion is about the event, not
    // about what `app.*` answers.
    await page.route("https://app.schafe-vorm-fenster.de/**", (route) => route.abort());

    await page.setViewportSize(DESKTOP);
    await page.goto(`/dein-ort?ort=${PLACE_WITH_DATES}`);
    const count = await page.locator('a[href^="https://app."]').count();
    expect(count).toBeGreaterThan(0);

    // One fresh page view per call site: an aborted handover leaves the
    // document in a state no visitor would ever click a second control from.
    for (let index = 0; index < count; index += 1) {
      await page.goto(`/dein-ort?ort=${PLACE_WITH_DATES}`);
      // The listener lives in a client component, so a click before
      // hydration is a navigation and nothing else. Wait for the tracker's
      // own signal rather than for a timeout (F-2-71) — the page carries
      // three call sites for this goal now (the module's handover, the
      // homescreen block and the closing block), and the ones further down
      // the document hydrate last.
      const trackers = page.locator('[data-conversion-tracker="save-calendar-to-homescreen"]');
      for (let tracker = 0; tracker < (await trackers.count()); tracker += 1) {
        await expect(trackers.nth(tracker)).toHaveAttribute("data-hydrated", "true");
      }
      fires.length = 0;
      await page.locator('a[href^="https://app."]').nth(index).click({ noWaitAfter: true });
      await page.waitForTimeout(250);
      expect(fires, `call site ${index}`).toHaveLength(1);
      expect(fires[0]).toContain("save-calendar-to-homescreen");
      expect(fires[0]).toContain("handover");
    }
  });

  test("TS-WEB-0020-A8 (second half): in state B the publish CTA emits no conversion event", async ({
    page,
    request,
  }) => {
    const slug = await emptyPlace(request);
    test.skip(slug === undefined, "no covered community is empty right now");
    const fires: string[] = [];
    page.on("console", (message) => {
      if (message.text().includes("conversion")) fires.push(message.text());
    });

    await page.setViewportSize(DESKTOP);
    await page.goto(`/dein-ort?ort=${slug}`);
    // Block 1 carries no calendar handover in state B: "an 'open the
    // calendar' link beside 'nothing is in it yet' is the one offer that
    // state must not carry" (TS-WEB-0008 D4). The homescreen block keeps its own —
    // TS-WEB-0020 D2 demotes it below position 2, it does not remove it.
    await expect(page.locator('#place-dates a[href^="https://app."]')).toHaveCount(0);
    await expect(page.locator('#homescreen a[href^="https://app."]')).toHaveCount(1);

    await page.locator('[data-cta="primary"]').click();
    await expect(page).toHaveURL(new RegExp(`/mitmachen/registrieren\\?ort=${slug}$`));
    // `register-as-publisher` is fired on the registration handover, not here.
    expect(fires).toHaveLength(0);
  });

  test("TS-WEB-0020-A9: no parameter, an empty one and a garbage one all answer 200 in the search state", async ({
    page,
  }) => {
    for (const path of ["/dein-ort", "/dein-ort?ort=", "/dein-ort?ort=%3Cscript%3E"]) {
      const response = await page.goto(path);
      expect(response?.status(), path).toBe(200);
      // `input[type="search"]`, not `getByRole("searchbox")`: the typeahead
      // sets `role="combobox"` on the same input once it mounts (the ARIA
      // pattern for a field with a suggestion list), so the role a test sees
      // depends on whether hydration has happened yet.
      await expect(page.locator('input[type="search"]').first()).toBeVisible();
      // The raw value appears nowhere as data — not as markup, not as text,
      // and not as an element that could run.
      //
      // `innerText`, not `textContent`: since state/open.md row 204 the chrome
      // is the layout's, so the page's own tree — the JSON-LD graph of
      // TS-WEB-0011 D4 included — sits inside the `main` landmark. `textContent`
      // reads that graph's source, where the key `"description"` contains the
      // substring this line looks for. `innerText` reads what is rendered,
      // which is what "appears as data" means, and the count below is the
      // stricter half the substring was standing in for.
      const body = await page.locator("main").innerText();
      expect(body).not.toContain("<script>");
      expect(body).not.toContain("script");
      await expect(
        page.locator("main script:not([type='application/ld+json'])"),
      ).toHaveCount(0);
    }
  });

  test("TS-WEB-0020-A10: stage 0 is complete — search, four labelled example stories, band, closing CTA", async ({
    browser,
  }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.setViewportSize(DESKTOP);
    await page.goto("/dein-ort");

    await expect(page.locator('input[type="search"]').first()).toBeVisible();
    await expect(page.locator('[data-block="value-story"]')).toHaveCount(4);
    // Two of the four stories are picture-led and carry no example box; the
    // other two carry the live row and the live module (brief, page 2).
    await expect(page.locator("[data-example-level]")).toHaveCount(2);
    await expect(page.locator('[data-block="value-story"] img')).toHaveCount(2);
    await expect(page.locator("#context-band nav")).toHaveCount(1);
    await expect(page.locator("#closing-cta")).toHaveCount(1);

    // No empty-state markup and no unresolved skeleton in S0.
    await expect(page.locator('[class*="empty-state-block"]')).toHaveCount(0);
    await expect(page.locator('[class*="skeleton"]')).toHaveCount(0);

    await context.close();
  });

  test("TS-WEB-0020-A11: the canonical is the parameter-free path for every `?ort=`", async ({
    page,
    request,
  }) => {
    // The criterion names "`/dein-ort`, `?ort=<A slug>` and `?ort=<B slug>`" —
    // a state-A and a state-B place, not a value that classifies as uncovered
    // and is forwarded to the founding route (TS-WEB-0020 D2 row 5, F-2-30).
    //
    // The state-B slug is *asked for*, not assumed. Taking
    // `EMPTY_PLACE_CANDIDATES[0]` on faith is what made this case red under
    // `LIVE_DATA=mock`: none of the first four candidates is covered by the
    // mock backend, so the proxy hopped `?ort=achimswalde` to the founding
    // route and the canonical this case read was `/dein-ort/starten` — the
    // page behaving exactly as TS-WEB-0020 D2 row 5 says it must, measured against
    // an input the criterion excludes. `emptyPlace()` confirms coverage and
    // emptiness against the BFF first, and every other state-B case in this
    // file already goes through it.
    const emptySlug = await emptyPlace(request);
    test.skip(emptySlug === undefined, "no covered community is empty right now");
    for (const path of [
      "/dein-ort",
      "/dein-ort?ort=17390",
      `/dein-ort?ort=${emptySlug}`,
    ]) {
      await page.goto(path);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        "href",
        "https://www.schafe-vorm-fenster.de/dein-ort",
      );
    }
    // JSON-LD: no `Event` node anywhere (TS-WEB-0011 D4). The `WebPage` half is
    // not built yet — see the fixme below.
    const jsonLd = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents();
    expect(jsonLd.join("")).not.toContain('"Event"');
  });

  test("TS-WEB-0020-A11 (second half): the JSON-LD graph contains WebPage", async ({ page }) => {
    await page.goto("/dein-ort");

    const scripts = page.locator('script[type="application/ld+json"]');
    await expect(scripts).toHaveCount(1); // TS-WEB-0011 D4: one graph per page

    const graph = JSON.parse((await scripts.textContent()) ?? "{}");
    const nodes = graph["@graph"] as { "@type": string; url?: string }[];
    const webPage = nodes.find((node) => node["@type"] === "WebPage");
    expect(webPage).toBeDefined();
    expect(webPage?.url).toBe("https://www.schafe-vorm-fenster.de/dein-ort");
    // D4's "deliberately not emitted" table — and A11's own first half.
    expect(JSON.stringify(graph)).not.toContain('"Event"');
  });

  test.fixme(
    "TS-WEB-0020-A12: with the BFF delayed beyond 2 s the box keeps its geometry and CLS stays < 0.1 [M4 — TS-WEB-0008 D2 BFF routes]",
    () => {},
  );

  for (const viewport of [PHONE, DESKTOP]) {
    test(`TS-WEB-0006-A3: the primary CTA is above the fold at ${viewport.width}×${viewport.height}`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport);
      await page.goto("/dein-ort");
      const primary = page.locator('[data-cta="primary"]');
      await expect(primary).toHaveCount(1);
      const box = await primary.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.y + box!.height).toBeLessThanOrEqual(viewport.height);
    });

    test(`TS-WEB-0017-A9: no horizontal scroll at ${viewport.width}×${viewport.height}`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport);
      await page.goto("/dein-ort");
      const overflows = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth + 1,
      );
      expect(overflows).toBe(false);
    });
  }

  test("TS-WEB-0006-A6 / A7: one context band with the three non-focus jobs, then the closing block", async ({
    page,
  }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto("/dein-ort");

    const band = page.locator("#context-band nav");
    await expect(band).toHaveCount(1);
    const targets = await band
      .locator("a")
      .evaluateAll((links) => links.map((link) => link.getAttribute("href")));
    expect(targets).toEqual(["/mitmachen", "/dein-kalender", "/ueber-uns"]);

    const order = await page.evaluate(() => {
      const ids = [...document.querySelectorAll("main [id]")].map((element) => element.id);
      return ids.filter((id) =>
        [
          "focus-block",
          "place-dates",
          "story-baeckerwagen",
          "story-ratssitzung",
          "story-kultur",
          "nearby",
          "homescreen",
          "context-band",
          "closing-cta",
        ].includes(id),
      );
    });
    // The four stories are four sections now, and the fourth **is** position
    // 2: the radius argument carries the nearby rows as its own evidence
    // instead of being followed by a fifth list (brief, page 2, fix 5).
    expect(order).toEqual([
      "focus-block",
      "place-dates",
      "story-baeckerwagen",
      "story-ratssitzung",
      "story-kultur",
      "nearby",
      "homescreen",
      "context-band",
      "closing-cta",
    ]);
  });

  test("TS-WEB-0006-A15: `/dein-ort` is a first-level page and renders no breadcrumb", async ({
    page,
  }) => {
    await page.goto("/dein-ort");
    await expect(page.locator("nav ol")).toHaveCount(0);
  });

  test("SRC-0014 §Page Rhythm: photo/colour alternation holds on /dein-ort", async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto("/dein-ort");
    const sections = (await page.evaluate(() =>
      [
        ...document.querySelectorAll("main section[data-surface], main section[data-placeholder]"),
      ].map((section) => section.getAttribute("data-surface") ?? "photo"),
    )) as RhythmEntry[];
    expect(sections).toContain("ink");
    expect(sections.filter((entry) => entry === "ink")).toHaveLength(1);
    expect(checkRhythm(sections, 0)).toEqual([]);
  });


  test("TS-WEB-0020 D2 row 5 (F-2-49): an uncovered value leaves the page with a real 307", async ({
    request,
    browser,
  }) => {
    // The hop is `proxy.ts`'s now: a page-level `redirect()` answers 200 with
    // an empty document on a production build, because Cache Components
    // resumes every route from a postponed prerender and the status line is
    // already written by the time the page runs.
    const response = await request.get("/dein-ort?ort=99999", { maxRedirects: 0 });
    expect(response.status()).toBe(307);
    const hop = new URL(response.headers()["location"]!, "http://localhost");
    expect(`${hop.pathname}${hop.search}`).toBe("/dein-ort/starten?ort=99999");

    // And it happens without JavaScript, which is the half the retest reopened.
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto("/dein-ort?ort=99999");
    await expect(page).toHaveURL(/\/dein-ort\/starten\?ort=99999$/);
    expect((await page.locator("body").innerText()).length).toBeGreaterThan(100);
    await context.close();
  });

  test("TS-WEB-0001: the English variant renders the English artifact", async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto("/en/your-place");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.locator('[data-block="value-story"]')).toHaveCount(4);
    await expect(page.locator("#homescreen")).toHaveCount(1);
    const hint = (await page.locator("main").textContent()) ?? "";
    expect(hint).toContain("postcode");
  });
});
