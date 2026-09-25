import { expect, test } from "@playwright/test";

import { leadFormEmbedUrl } from "../src/lib/routes/lead-fallback";
import { everyRoute, href } from "../src/lib/routes/routes";
import { ALLOWLIST } from "../src/lib/security/csp";

/**
 * TS-WEB-0016-A22 — `/start`, the registration surface, in the browser.
 *
 * The criterion, clause by clause: exactly one `iframe` whose source is the
 * configured form host, rendered without a click-to-load control, without a
 * `details`/`summary` wrapper and without a `hidden` or zero-size ancestor,
 * together with the e-mail address as a link. Above that iframe, earlier in
 * DOM order and present in the document served before any frame paints, a
 * notice that names the form's third-party host and links
 * `/rechtliches#datenschutz` (D17) — not a button, not a checkbox, not
 * dismissible, and nothing on the route waits for it. No other route of the
 * TS-WEB-0004 D1 inventory contains an `iframe` to any host but the Portalize
 * demo's. No conversion event fires on the route, and no consent-banner
 * component renders (NFR-WEB-0062).
 *
 * The document half of the same criterion — the served HTML's shape, before
 * any browser — is `app/start/page.test.ts`. The request trace of the route
 * (TS-WEB-0013-A1 / TS-WEB-0012-A2) is `e2e/privacy.spec.ts`.
 */

const ROUTE = "/start";
const FORM_ORIGIN = ALLOWLIST.googleForms;
const PORTALIZE_ORIGIN = ALLOWLIST.portalize;
const PRIVACY_ANCHOR = `${href("legal", "de")}#datenschutz`;

test.describe("TS-WEB-0016-A22: /start renders the registration form as a visible embed (D15)", () => {
  test("exactly one iframe, of the configured form host, visible and immediate", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 360, height: 640 });
    const response = await page.goto(ROUTE);
    expect(response?.status()).toBe(200);

    const frames = page.locator("iframe");
    await expect(frames).toHaveCount(1);
    const frame = frames.first();

    const src = (await frame.getAttribute("src")) ?? "";
    expect(src, "the configured form, `?embedded=true`").toBe(leadFormEmbedUrl());
    expect(new URL(src).origin).toBe(FORM_ORIGIN);
    expect(new URL(src).searchParams.get("embedded")).toBe("true");

    await expect(frame).toBeVisible();
    const box = await frame.boundingBox();
    expect(box?.width ?? 0).toBeGreaterThan(0);
    expect(box?.height ?? 0).toBeGreaterThan(0);
    await expect(frame).toHaveAttribute("title", /.+/);

    // No `details`/`summary` wrapper, no `hidden` ancestor, no zero-size
    // ancestor — the frame is in the visible flow of the document.
    const wrapped = await frame.evaluate((element) => {
      const hidden = element.closest("details, [hidden], [aria-hidden='true']");
      let zeroSized = 0;
      for (let node = element.parentElement; node; node = node.parentElement) {
        const rect = node.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) zeroSized += 1;
      }
      return { hidden: hidden !== null, zeroSized };
    });
    expect(wrapped).toEqual({ hidden: false, zeroSized: 0 });
  });

  test("no click-to-load control, no gate — nothing on the route is a control but two links", async ({
    page,
  }) => {
    await page.goto(ROUTE);
    // A click-to-load layer is a button; a consent gate is a checkbox, a
    // dialog or a button. None of them is on this route (D15 "Shape", D17
    // "Not a control"). Scoped to the document's own region: locators pierce
    // shadow roots, and `next dev` mounts its own tools (a button in a
    // `nextjs-portal`) outside `main`, which is not this route's content.
    await expect(
      page
        .locator("main")
        .locator("button, [role='button'], input, select, textarea, summary, dialog, [role='dialog']"),
    ).toHaveCount(0);
    await expect(page.locator("body > dialog, body > [role='dialog']")).toHaveCount(0);
    // The e-mail address, as a link, beside the frame (D15 "Beside it").
    await expect(page.locator('a[href^="mailto:"]')).toHaveCount(1);
  });

  test("the notice stands above the frame — in the served document and in DOM order (D17)", async ({
    page,
    request,
  }) => {
    // Served before any frame paints: the notice is in the prerendered HTML,
    // ahead of the `<iframe>` element, with no script between it and a reader.
    const html = await (await request.get(ROUTE)).text();
    const noticeAt = html.indexOf('data-block="embed-notice"');
    const frameAt = html.indexOf("<iframe");
    expect(noticeAt, "the notice is in the served HTML").toBeGreaterThan(-1);
    expect(frameAt, "the iframe is in the served HTML").toBeGreaterThan(-1);
    expect(noticeAt).toBeLessThan(frameAt);

    await page.goto(ROUTE);
    const notice = page.locator('[data-block="embed-notice"]');
    await expect(notice).toHaveCount(1);
    await expect(notice).toBeVisible();

    // Earlier in DOM order than the iframe, inside the same region (`main`).
    const order = await page.evaluate(() => {
      const notice = document.querySelector('[data-block="embed-notice"]');
      const frame = document.querySelector("iframe");
      if (!notice || !frame) return "missing";
      const precedes = Boolean(
        notice.compareDocumentPosition(frame) & Node.DOCUMENT_POSITION_FOLLOWING,
      );
      const sameRegion = notice.closest("main") === frame.closest("main");
      return { precedes, sameRegion };
    });
    expect(order).toEqual({ precedes: true, sameRegion: true });

    // Visually above it, too.
    const noticeBox = await notice.boundingBox();
    const frameBox = await page.locator("iframe").boundingBox();
    expect((noticeBox?.y ?? 0) + (noticeBox?.height ?? 0)).toBeLessThanOrEqual(frameBox?.y ?? 0);

    // The three facts: Google is named, loading contacts Google, and the
    // detail is on `/rechtliches#datenschutz` — as a link.
    await expect(notice).toContainText("Google");
    await expect(notice.locator(`a[href="${PRIVACY_ANCHOR}"]`)).toHaveCount(1);

    // Not a control: no button, no checkbox, no dismiss, no role, no
    // `aria-controls`; one block, no heading of its own, no list.
    await expect(notice.locator("button, input, [role], [aria-controls], h1, h2, h3, ul, ol")).toHaveCount(
      0,
    );
    await expect(notice).not.toHaveAttribute("role", /.+/);
  });

  test("nothing is measured and nothing is gated: no analytics loader, no conversion marker, no consent component", async ({
    page,
  }) => {
    await page.goto(ROUTE);
    await page.waitForTimeout(500);
    await expect(page.locator('script[src*="etracker"]')).toHaveCount(0);
    // Every D4 conversion trigger is a `data-cta` element (TS-WEB-0012); this
    // route has none — the submission is Google's and unobserved (D15).
    await expect(page.locator("[data-cta]")).toHaveCount(0);
    await expect(page.locator("[data-consent], [class*='consent'], [id*='consent']")).toHaveCount(0);
  });

  test("the route is noindex and German, with no site chrome around the form", async ({
    page,
  }) => {
    await page.goto(ROUTE);
    await expect(page.locator("html")).toHaveAttribute("lang", "de");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    await expect(page.locator("main")).toHaveCount(1);
    await expect(page.locator("main h1")).toHaveCount(1);
    // In no page's flow (D15): no header, no footer, no navigation links it
    // into the site.
    await expect(page.locator("body > header, body > footer, nav")).toHaveCount(0);
  });
});

/**
 * The criterion's other half: `/start` is **the** route that frames a third
 * party. Every page row of the D1 inventory is walked and may frame nothing
 * but the Portalize demo's host — and the demo runs in web-component mode
 * (DEC-0030), so today that is no frame at all.
 */
test.describe("TS-WEB-0016-A22: no other D1 route frames any host but the Portalize demo's", () => {
  for (const { route, locale } of everyRoute()) {
    const path = href(route, locale);
    test(`${path} (${route}/${locale}) frames nothing foreign`, async ({ page }) => {
      await page.goto(path);
      const foreignFrames = await page.evaluate(
        (portalize) =>
          [...document.querySelectorAll("iframe")]
            .map((frame) => frame.getAttribute("src") ?? "")
            .filter((src) => {
              try {
                return new URL(src, location.href).origin !== portalize;
              } catch {
                return true;
              }
            }),
        PORTALIZE_ORIGIN,
      );
      expect(foreignFrames, `iframes on ${path}`).toEqual([]);
    });
  }
});
