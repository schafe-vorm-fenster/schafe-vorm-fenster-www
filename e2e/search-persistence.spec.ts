import { expect, test } from "@playwright/test";

import { ROUTE_IDS, href } from "../src/lib/routes/routes";

import type { Page } from "@playwright/test";

/**
 * DEC-078 — what a visitor types is never thrown away by a streamed
 * boundary. TS-019-A16 (`/`'s hero search) and TS-009-A14 (the site-wide
 * rule).
 *
 * `state/open.md` row 213, measured on the production build: a postcode
 * typed into the home page's search was present at 96 ms and gone again at
 * 349 ms, 3/3 runs, with real key events. `/` was the site's only route with
 * a `<Suspense>` boundary, its fallback was the whole of block 1 — search
 * field included — and React reveals a boundary by inserting the resolved
 * branch's DOM and removing the fallback's. The `<input>` the visitor was
 * typing into was in the half that gets removed.
 *
 * Two assertions, because the defect has two faces:
 *
 *  - **The identity walk** is deterministic and needs no timing at all. An
 *    init script counts how many *distinct* elements ever carry the search
 *    field's id. One means the field the visitor first sees is the field
 *    that stays; two means it was replaced, whether or not the run was fast
 *    enough to catch it with a value in it.
 *  - **The typing walk** is the visitor's own experience: the document
 *    throttled to a rural link so the race window is wide, real
 *    `keyboard.type()` key events sent as soon as the field exists, then the
 *    value read back after the page has settled, and the form submitted to
 *    see that it still carries what was typed to the place route.
 *
 * Both run on the routes that have a search field at all — the two home
 * mirrors first, then every other one, because the rule is not "`/` is
 * fixed" but "no control that holds visitor input arrives through a
 * boundary".
 */

/**
 * The document is throttled, not the CPU: the shell is parsed and painted
 * from the first chunk while the streamed branch is still on the wire, which
 * is the visitor's own situation on a rural connection and the widest
 * version of the window row 213 measured. Throttling the CPU instead slows
 * first paint as much as the reveal and narrows the very gap this walk needs.
 */
const SLOW_LINK = {
  offline: false,
  latency: 150,
  downloadThroughput: (120 * 1024) / 8,
  uploadThroughput: (120 * 1024) / 8,
} as const;

/** A covered postcode — `07743` resolves to `quilow` (see `e2e/pages/home.spec.ts`). */
const TYPED = "07743";

interface SearchRoute {
  /** The path to open. */
  readonly path: string;
  /** The id of the field that stands above the fold on it. */
  readonly inputId: string;
  /** Where a submit of that field has to land, value intact. */
  readonly submitsTo: string;
}

const SEARCH_ROUTES: readonly SearchRoute[] = [
  // The two the defect was measured on.
  { path: "/", inputId: "ort-suche-fokus", submitsTo: `/dein-ort?ort=${TYPED}` },
  { path: "/en", inputId: "ort-suche-fokus", submitsTo: `/en/your-place?ort=${TYPED}` },
  // Every other route carrying a place search — the same rule, checked
  // rather than assumed.
  { path: "/dein-ort", inputId: "ort-suche-fokus", submitsTo: `/dein-ort?ort=${TYPED}` },
  { path: "/deine-region", inputId: "ort-suche", submitsTo: `/dein-ort?ort=${TYPED}` },
  { path: "/dein-ort/starten", inputId: "ort-suche-nochmal", submitsTo: `/dein-ort?ort=${TYPED}` },
  {
    path: "/mitmachen/registrieren",
    inputId: "ort-suche",
    submitsTo: `/mitmachen/registrieren?ort=${TYPED}`,
  },
];

/**
 * Count every distinct element that ever carries `id`, from before the
 * document's own scripts run. A boundary reveal replaces DOM nodes, so a
 * replaced field shows up here as a second one even when nothing was typed.
 */
async function watchFieldIdentity(page: Page, id: string): Promise<void> {
  await page.addInitScript((fieldId: string) => {
    const w = window as unknown as { __fieldNodes?: number };
    w.__fieldNodes = 0;
    const seen = new WeakSet<Element>();
    const count = () => {
      const element = document.getElementById(fieldId);
      if (element && !seen.has(element)) {
        seen.add(element);
        w.__fieldNodes = (w.__fieldNodes ?? 0) + 1;
      }
    };
    // `document` and not `document.documentElement`: an init script runs
    // before the parser has produced the root element, and observing `null`
    // throws — which would leave this walk silently counting nothing.
    new MutationObserver(count).observe(document, { childList: true, subtree: true });
    document.addEventListener("DOMContentLoaded", count);
    window.addEventListener("load", count);
  }, id);
}

/** The page has stopped rearranging itself: every boundary revealed, nothing in flight. */
async function settled(page: Page): Promise<void> {
  await page.waitForLoadState("load");
  await expect(page.locator("main")).toBeVisible();
  // A boundary reveal is one task after the stream ends; give the document
  // more than it can need, then read the steady state.
  await page.waitForTimeout(1_500);
}

test.describe("DEC-078 — a streamed boundary never holds what a visitor types", () => {
  for (const route of SEARCH_ROUTES) {
    test(`TS-019-A16: the field on ${route.path} is never replaced after first paint`, async ({
      page,
    }) => {
      await watchFieldIdentity(page, route.inputId);
      await page.goto(route.path, { waitUntil: "commit" });
      await page.locator(`#${route.inputId}`).waitFor({ state: "attached" });
      await settled(page);

      const nodes = await page.evaluate(
        () => (window as unknown as { __fieldNodes?: number }).__fieldNodes ?? 0,
      );
      expect(nodes, `distinct #${route.inputId} elements on ${route.path}`).toBe(1);
    });

    test(`TS-019-A16: a value typed into ${route.path} in the first frames survives and submits`, async ({
      page,
    }) => {
      // The window the defect lives in is the one between first paint and
      // the boundary's reveal, and a slow document is what holds it open.
      const cdp = await page.context().newCDPSession(page);
      await cdp.send("Network.enable");
      await cdp.send("Network.emulateNetworkConditions", SLOW_LINK);

      await page.goto(route.path, { waitUntil: "commit" });
      const field = page.locator(`#${route.inputId}`);
      await field.waitFor({ state: "attached" });
      // Real key events, not `fill()`: row 213 measured the loss with both,
      // and the one a visitor produces is the one worth asserting on.
      await field.focus();
      await page.keyboard.type(TYPED, { delay: 15 });
      // The keystrokes landed — anything after this is the page taking them
      // away again, which is the thing being measured.
      await expect(field).toHaveValue(TYPED);

      await cdp.send("Network.emulateNetworkConditions", {
        offline: false,
        latency: 0,
        downloadThroughput: -1,
        uploadThroughput: -1,
      });
      await settled(page);
      await expect(page.locator(`#${route.inputId}`)).toHaveValue(TYPED);

      await page.locator(`#${route.inputId}`).press("Enter");
      await page.waitForURL(`**${route.submitsTo}`);
    });
  }

  /**
   * The rule itself, read off the shipped HTML rather than off one page's
   * behaviour: React marks a pending boundary with `<!--$?-->…<!--/$-->` and
   * parks the resolved branch in a `<div hidden id="S:…">` at the end of the
   * body. Neither half may contain a control that holds a value, on any
   * route — that is the invariant DEC-078 adds, and the one a future page
   * would otherwise break silently.
   */
  test("TS-009-A14: no value-holding control arrives through a streamed boundary", async ({
    request,
  }) => {
    const paths = [...ROUTE_IDS.map((id) => href(id, "de")), href("home", "en")];
    const offenders: string[] = [];

    for (const path of paths) {
      const response = await request.get(path);
      expect(response.status(), `status of ${path}`).toBeLessThan(400);
      const html = await response.text();

      const streamed: string[] = [];
      for (const match of html.matchAll(/<!--\$\?-->/gu)) {
        const end = html.indexOf("<!--/$-->", match.index);
        streamed.push(html.slice(match.index, end === -1 ? undefined : end));
      }
      for (const match of html.matchAll(/<div hidden id="[SP]:[^"]*">/gu)) {
        streamed.push(html.slice(match.index));
      }

      for (const segment of streamed) {
        const control = /<(input|textarea|select)\b/u.exec(segment);
        if (control) offenders.push(`${path}: <${control[1]}> inside a streamed boundary`);
      }
    }

    expect(offenders, "controls that a boundary reveal would replace").toEqual([]);
  });
});
