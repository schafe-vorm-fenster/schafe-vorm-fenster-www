import { expect, test } from "@playwright/test";

import type { Page } from "@playwright/test";

import { BRIEFING_RECIPIENT, BRIEFING_URL } from "../src/lib/live/briefing";
import { everyRoute, href } from "../src/lib/routes/routes";

import type { RouteId } from "../src/lib/routes/routes";

/**
 * The contact section, mounted by the chrome on **every** route (DEC-0081 §2,
 * `app/[lang]/_chrome.tsx`, T-10) — the browser half of what
 * `src/components/contact-section/contact-section.test.tsx` reads off the
 * static markup:
 *
 *  - TS-WEB-0006-A17 — exactly one section per page, in DOM order after the
 *    closing block and before the global footer; no `data-cta="primary"`
 *    inside; its first action row is the only element whose href is the
 *    configured appointment URL; no general contact form anywhere — no
 *    envoy mount point and no form that would submit data outside
 *    `/deine-region/angebot` and the order flow's invoice step.
 *  - TS-WEB-0016-A15 — four action rows in the D13 order, by scheme.
 *  - TS-WEB-0016-A17 — every row fires exactly one `make-contact` on click,
 *    carrying its channel and the route; row 1 fires
 *    `request-product-briefing` in addition, rows 2–4 never; nothing fires
 *    twice for one click; a link that only scrolls to the section fires
 *    nothing.
 *  - TS-WEB-0016-A23 — row 1's outbound marking is a separate element after
 *    the control, associated through `aria-describedby`, and the control's
 *    own accessible name names neither the recipient nor a new tab.
 *
 * TS-WEB-0019-A9's "nothing but the global footer after the contact section"
 * is the same DOM-order fact, asserted here for every route rather than for
 * `/` alone.
 *
 * ### What "no form" means here
 *
 * A17's sentence is scoped by its own colon — "renders a general contact
 * form: no `form` element and no envoy mount point" — and the site's other
 * forms are navigations, not submissions: the place search and the choice
 * groups are `method="get"` forms whose only effect is a URL. So the walk
 * asserts that every `form` outside the two named routes carries
 * `method="get"`, which is what separates a control that goes somewhere from
 * a form that would take data (DEC-0122 §4).
 */

const SECTION = "section#kontakt[data-contact-section]";

/** The two routes A17 names; `everyRoute()` reaches the order flow at step 1, where no mount renders either. */
const ENVOY_ROUTES: ReadonlySet<RouteId> = new Set<RouteId>(["regionQuote"]);

/**
 * Where an in-page CTA still carries the appointment URL itself instead of
 * resolving to `#kontakt` (TS-WEB-0016-A5): the pages are the T-13 and T-15
 * tasks' to repoint, and the uniqueness half of A17 is expected to fail on
 * them until those merge. `test.fail` turns into a failure the moment it
 * passes, so the entry has to be removed with the fix rather than lingering.
 */
const BRIEFING_HREF_REPOINTED_BY: Readonly<Partial<Record<RouteId, string>>> = {
  // The list is empty, and it stays declared so the next route that regresses
  // has a named home instead of a silent `test.fail`.
};
// `region` and `order` came off this list with T-15: `/deine-region`'s hero and
// closing consult action and all four steps of `/dein-kalender/bestellen`
// resolve to `#kontakt` now (DEC-0133).
// `calendar` came off this list with T-13: `/dein-kalender`'s hero CTA is an
// in-page link to `#kontakt` now, and the closing block's quiet briefing link
// and tier 2's are gone, so the appointment URL occurs once on that route.
// `/deine-region/angebot` is **not** on the list, measured: its lead fallback's
// briefing link renders only in the widget's `empty`/`degraded` state, and the
// mocked state the route ships carries none — so the uniqueness half already
// holds there.

/*
 * The `INLINE_NEWSLETTER_GATED_BY` exemption that stood here is gone:
 * `/ueber-uns` reads `newsletterOffered()` on its own page since T-14, so no
 * route renders a submitting form outside the two lead routes (DEC-0122 §5,
 * DEC-0132 §5).
 */

/**
 * The two mid-flow routes carry no closing block at all: TS-WEB-0023 D7 and
 * TS-WEB-0025 suppress blocks 3 and 4 inside a flow (F-2-10, `state/open.md`
 * row 24), and both compose their own blocks rather than going through
 * `PageFrame`. "After the closing block" has nothing to be after there — the
 * section's other three facts (exactly one, outside `main`, directly before the
 * footer) hold on them like everywhere else, which is what this walk asserts
 * instead of narrowing the criterion.
 */
const NO_CLOSING_BLOCK: ReadonlySet<RouteId> = new Set<RouteId>(["register", "order"]);

const CHANNELS_IN_ORDER = ["appointment", "whatsapp", "phone", "mail"] as const;

/** Row `n` of the section — `1` is the appointment row. */
function row(page: Page, n: number) {
  return page.locator(`${SECTION} a[data-channel]`).nth(n - 1);
}

/**
 * Every click leaves the page or hands over to another app, so the walk
 * blocks navigation to anything but this origin and turns `tel:`/`mailto:`
 * into no-ops the way a desktop browser without a handler does. The event
 * fires *before* the navigation (`ConversionTracker` never prevents the
 * default), so blocking the request loses nothing the assertion needs.
 */
async function blockOutbound(page: Page): Promise<void> {
  const origin = new URL(page.url()).origin;
  // `204 No Content`, not `abort()`: a 204 tells the browser to stay on the
  // document it is on, so the page's execution context — and with it the
  // captured conversions — survives the click. An aborted main-frame request
  // tears the context down often enough to lose the very events under test.
  await page.route(
    (url) => url.origin !== origin,
    (route) => route.fulfill({ status: 204, body: "" }),
  );
}

/** One conversion the mock tracker logged, as `mock-tracker.ts` passes it. */
interface LoggedConversion {
  readonly goalId: string;
  readonly stage: string;
  readonly attributes?: Readonly<Record<string, string | number | boolean>>;
}

interface ConversionWindow {
  __conversions?: LoggedConversion[];
}

/**
 * Capture the mock tracker's conversions **in the page**, before any of its
 * scripts run.
 *
 * `mock-tracker.ts` calls `console.info("[analytics:mock] conversion", {goalId,
 * stage, attributes})`. Reading that from Playwright's side does not work for
 * what A17 asserts: `ConsoleMessage.text()` stringifies the payload the way
 * Chromium's own `%o` formatting does, so the nested `attributes` object comes
 * out as the literal word `Object` and the channel and the route are not in the
 * line at all — and the argument handles behind it are disposed with the
 * execution context every one of these clicks tears down, so reading them
 * asynchronously loses exactly the events under test. Wrapping `console.info`
 * in an init script keeps the payload as data, on the page, synchronously.
 */
async function captureConversions(page: Page): Promise<void> {
  await page.addInitScript(() => {
    const captured: LoggedConversion[] = [];
    (window as ConversionWindow).__conversions = captured;
    const info = console.info.bind(console);
    console.info = (...args: unknown[]) => {
      if (typeof args[0] === "string" && args[0].startsWith("[analytics:mock] conversion")) {
        try {
          captured.push(JSON.parse(JSON.stringify(args[1])) as LoggedConversion);
        } catch {
          // Not serialisable — it would show up as a missing event, never a pass.
        }
      }
      info(...args);
    };
  });
}

/**
 * Everything captured on the current document, oldest first.
 *
 * A click that hands over to another app can still tear the execution context
 * down underneath the read (`page.evaluate: Execution context was destroyed`),
 * which says nothing about the event — so that one error class is retried after
 * a settle, the way `e2e/landmarks.spec.ts` does. Any other failure throws.
 */
async function conversions(page: Page): Promise<LoggedConversion[]> {
  for (let attempt = 0; ; attempt += 1) {
    try {
      return await page.evaluate(() => (window as ConversionWindow).__conversions ?? []);
    } catch (error) {
      const destroyed =
        error instanceof Error &&
        /Execution context was destroyed|Target closed/u.test(error.message);
      if (attempt >= 3 || !destroyed) throw error;
      await page.waitForTimeout(150);
    }
  }
}

async function waitForHydration(page: Page): Promise<void> {
  await expect(
    page.locator(`${SECTION} [data-conversion-tracker="make-contact"]`).first(),
  ).toHaveAttribute("data-hydrated", "true");
}

for (const { route, locale } of everyRoute()) {
  const path = href(route, locale);

  test.describe(`contact section on ${path}`, () => {
    test("TS-WEB-0006-A17 / TS-WEB-0019-A9: exactly one, after the closing block, before the footer, no primary inside", async ({
      page,
    }) => {
      await page.goto(path);
      const section = page.locator(SECTION);
      await expect(section).toHaveCount(1);
      await expect(section).toBeVisible();
      await expect(section.locator('[data-cta="primary"]')).toHaveCount(0);

      const order = await page.evaluate(() => {
        const section = document.querySelector("section#kontakt")!;
        const closing = document.querySelector("#closing-cta");
        const footer = document.querySelector("body > footer")!;
        const main = document.querySelector("main")!;
        const follows = (a: Element, b: Element) =>
          Boolean(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING);
        // Everything between `main` and the footer, by tag and id.
        const between: string[] = [];
        let cursor = main.nextElementSibling;
        while (cursor && cursor !== footer) {
          between.push(`${cursor.tagName.toLowerCase()}#${cursor.id}`);
          cursor = cursor.nextElementSibling;
        }
        return {
          closingExists: closing !== null,
          afterClosing: closing ? follows(closing, section) : null,
          beforeFooter: follows(section, footer),
          outsideMain: !main.contains(section),
          between,
        };
      });
      // Every route outside a flow has a closing block — `merged` pages carry
      // the anchor inside the band; the two flow steps carry none at all.
      const closingExpected = !NO_CLOSING_BLOCK.has(route);
      expect(order.closingExists, "#closing-cta on the page").toBe(closingExpected);
      if (closingExpected) {
        expect(order.afterClosing, "section after #closing-cta").toBe(true);
      }
      expect(order.beforeFooter, "section before the footer").toBe(true);
      expect(order.outsideMain, "section outside main").toBe(true);
      // Nothing but the global footer after the contact section (TS-WEB-0019-A9).
      expect(order.between, "main → contact section → footer, nothing else").toEqual([
        "section#kontakt",
      ]);
    });

    test("TS-WEB-0006-A17: the first row is the only element carrying the appointment URL", async ({
      page,
    }) => {
      const owner = BRIEFING_HREF_REPOINTED_BY[route];
      test.fail(
        owner !== undefined,
        `${path} still carries the briefing URL on an in-page CTA — ${owner} repoints it to #kontakt (TS-WEB-0016-A5)`,
      );
      await page.goto(path);
      await expect(row(page, 1)).toHaveAttribute("href", BRIEFING_URL);
      await expect(page.locator(`[href="${BRIEFING_URL}"]`)).toHaveCount(1);
    });

    test("TS-WEB-0006-A17: no general contact form — no envoy mount, no submitting form, outside the two lead routes", async ({
      page,
    }) => {
      await page.goto(path);
      if (ENVOY_ROUTES.has(route)) {
        // The quote form, and nothing but envoy forms.
        const forms = page.locator("form:not([method='get' i])");
        await expect(forms).toHaveCount(await page.locator("form[data-envoy-form-kind]").count());
        await expect(page.locator('[data-envoy-form-kind="contact"]')).toHaveCount(0);
        return;
      }
      await expect(page.locator("[data-envoy-form-kind]")).toHaveCount(0);
      await expect(page.locator("form:not([method='get' i])")).toHaveCount(0);
      // The footer in particular: no disclosure, no field, no newsletter form.
      const footer = page.locator("body > footer");
      await expect(footer.locator("form, input, textarea, details, summary")).toHaveCount(0);
    });

    test("TS-WEB-0016-A15: four rows in the D13 order, by scheme", async ({ page }) => {
      await page.goto(path);
      const rows = page.locator(`${SECTION} a[data-channel]`);
      await expect(rows).toHaveCount(4);
      for (const [index, channel] of CHANNELS_IN_ORDER.entries()) {
        await expect(rows.nth(index)).toHaveAttribute("data-channel", channel);
        await expect(rows.nth(index)).toHaveAttribute("data-cta", "secondary");
      }
      await expect(rows.nth(0)).toHaveAttribute("href", BRIEFING_URL);
      await expect(rows.nth(1)).toHaveAttribute("href", /^https:\/\/wa\.me\/\d+$/);
      await expect(rows.nth(2)).toHaveAttribute("href", /^tel:\+\d+$/);
      await expect(rows.nth(3)).toHaveAttribute("href", /^mailto:[^?]+$/);
    });

    test("TS-WEB-0016-A23: the outbound marking follows row 1, associated, and stays out of its name", async ({
      page,
    }) => {
      await page.goto(path);
      const first = row(page, 1);
      const noteId = await first.getAttribute("aria-describedby");
      expect(noteId, "row 1 is described by the marking").toBeTruthy();
      const note = page.locator(`#${noteId}`);
      await expect(note).toHaveCount(1);
      await expect(note).toBeVisible();

      const facts = await page.evaluate((id) => {
        const control = document.querySelector("section#kontakt a[data-channel='appointment']")!;
        const note = document.getElementById(id)!;
        return {
          after: Boolean(control.compareDocumentPosition(note) & Node.DOCUMENT_POSITION_FOLLOWING),
          inside: control.contains(note),
          tag: note.tagName,
          role: note.getAttribute("role"),
          interactive: note.querySelectorAll("a, button, input").length,
          namesRecipient: (note.textContent ?? "").includes("Google"),
        };
      }, noteId!);
      expect(facts.after, "marking after the control in DOM order").toBe(true);
      expect(facts.inside, "marking outside the control").toBe(false);
      expect(facts.tag).toBe("P");
      expect(facts.role, "not a button, not a link, not a consent control").toBeNull();
      expect(facts.interactive).toBe(0);
      expect(facts.namesRecipient, "the marking names the recipient").toBe(true);

      // The control's own accessible name: the title, nothing about the
      // recipient or a new tab (in either language).
      const name = await first.evaluate((element) => {
        const clone = element.cloneNode(true) as HTMLElement;
        return (element.getAttribute("aria-label") ?? clone.textContent ?? "").replace(/\s+/g, " ").trim();
      });
      expect(name).not.toContain(BRIEFING_RECIPIENT);
      expect(name).not.toMatch(/neuen Tab|new tab/i);
      expect(name).not.toMatch(/\(.*\)/);
    });

    test("TS-WEB-0016-A17: each row fires make-contact once with its channel and route; row 1 adds the briefing goal", async ({
      page,
    }) => {
      await captureConversions(page);
      await page.goto(path);
      await blockOutbound(page);
      await waitForHydration(page);

      for (const [index, channel] of CHANNELS_IN_ORDER.entries()) {
        const before = (await conversions(page)).length;
        /** Row 1 fires two goals on the one click, rows 2–4 fire one. */
        const expected = channel === "appointment" ? 2 : 1;
        const link = row(page, index + 1);
        // A `tel:`/`mailto:` click never navigates in a headless browser and
        // the `https:` ones are blocked above; the listener fires either way.
        await link.click({ noWaitAfter: true });
        await expect
          .poll(async () => (await conversions(page)).length, {
            message: `row ${index + 1} (${channel}) fires`,
          })
          .toBeGreaterThanOrEqual(before + expected);
        // Give a second, wrong event the chance to appear before counting.
        await page.waitForTimeout(150);
        const fired = (await conversions(page)).slice(before);

        const makeContact = fired.filter((entry) => entry.goalId === "make-contact");
        expect(makeContact, `${channel}: one make-contact`).toHaveLength(1);
        expect(makeContact[0]?.attributes, `${channel}: channel and route, nothing else`).toEqual({
          channel,
          route,
        });

        const briefing = fired.filter((entry) => entry.goalId === "request-product-briefing");
        expect(briefing, `${channel}: briefing goal only on row 1`).toHaveLength(
          channel === "appointment" ? 1 : 0,
        );
        expect(fired, `${channel}: nothing else fires`).toHaveLength(expected);
        // Still on the page: nothing navigated.
        expect(new URL(page.url()).pathname).toBe(new URL(path, page.url()).pathname);
      }
    });
  });
}

test("TS-WEB-0016-A17: an in-page link that scrolls to the section fires nothing", async ({ page }) => {
  await captureConversions(page);
  await page.goto("/");
  await waitForHydration(page);
  // No page carries a `#kontakt` CTA yet on `/`; the scroll is the same
  // navigation a booking CTA performs, from the address bar.
  await page.evaluate(() => {
    const anchor = document.createElement("a");
    anchor.href = "#kontakt";
    anchor.textContent = "→";
    document.querySelector("main")!.append(anchor);
    anchor.click();
  });
  await expect(page).toHaveURL(/#kontakt$/);
  await page.waitForTimeout(200);
  expect(await conversions(page)).toEqual([]);
});
