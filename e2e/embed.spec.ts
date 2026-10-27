import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

import { ALLOWLIST } from "../src/lib/security/csp";
import { SHOWCASE_CALENDAR } from "../src/lib/embed/portalize";
import { href } from "../src/lib/routes/routes";

/**
 * TS-WEB-0008 D6 / `state/open.md` row 82 — the real Portalize calendar on
 * `/dein-kalender`.
 *
 * What a browser has to establish, and nothing else can:
 *
 *  - the mount is in the page and carries the attributes the loader needs
 *    (`data-portalize-widget` **and** an `id` — without the id the loader
 *    logs and skips);
 *  - the box reserves its height **before** the loader runs, so the two
 *    round trips the widget makes move nothing below it;
 *  - the loader is lazy: it is not in the document until the block is
 *    approached;
 *  - every host the embed contacts is in the TS-WEB-0014 D1 allowlist, and the
 *    console stays clean — a CSP refusal would show up as both.
 */

const CALENDAR = href("calendar", "de");
const ALLOWED_HOSTS = new Set(Object.values(ALLOWLIST).map((url) => new URL(url).host));
const VERCEL_PREVIEW_HOST = /\.vercel\.app$/;

/**
 * Vercel's preview toolbar (`vercel.live`) is injected by the platform into
 * every `*.vercel.app` response and is refused by the application's own CSP,
 * which logs a console error the application did not cause. `privacy.spec.ts`
 * makes the same exception for the same host and the same reason.
 */
const PLATFORM_NOISE = /vercel\.live/;

const BYPASS = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;

/**
 * Whether the widget host answers at all.
 *
 * Three of the four checks below are about this page and hold offline. The
 * fourth mounts the **real** calendar, so it depends on a third-party
 * service being up, and a gate that goes red because someone else's
 * deployment is restarting reports nothing useful. That one is skipped when
 * the host does not answer — the same guard, for the same reason, as
 * `src/lib/live/upstream-live.integration.test.ts`.
 */
async function widgetHostReachable(): Promise<boolean> {
  try {
    const response = await fetch(`${ALLOWLIST.portalize}/api/health`, {
      signal: AbortSignal.timeout(8000),
    });
    return response.ok;
  } catch {
    return false;
  }
}

test.describe("the embed frame", () => {
  /**
   * **No bypass header on this context**, and the reason is the embed itself.
   *
   * Vercel's Deployment Protection is normally passed with
   * `x-vercel-protection-bypass`, which Playwright then sends on *every*
   * request — including the cross-origin module the Portalize loader fetches.
   * That turns a simple request into a preflighted one, the widget host does
   * not list the header in `Access-Control-Allow-Headers`, and the module is
   * refused. A real visitor sends no such header, so the failure would be the
   * harness's and not the product's.
   *
   * The cookie form of the same bypass has no such effect: it is set once, on
   * this site's own origin, and travels with same-origin requests only.
   */
  test.use({ extraHTTPHeaders: {} });

  test.beforeEach(async ({ page, baseURL }) => {
    if (BYPASS === undefined || baseURL === undefined) return;
    if (!VERCEL_PREVIEW_HOST.test(new URL(baseURL).host)) return;
    await page.goto(
      `/?x-vercel-protection-bypass=${encodeURIComponent(BYPASS)}&x-vercel-set-bypass-cookie=true`,
    );
  });

  test("the mount carries what the loader needs, and reserves its height", async ({ page }) => {
    await page.goto(CALENDAR);

    const mount = page.locator("[data-portalize-widget]");
    await expect(mount).toHaveCount(1);
    await expect(mount).toHaveAttribute("id", /\S/u);

    const box = page.locator("[data-block='embed-demo'] [data-portalize-widget]").locator("..");
    const before = await box.boundingBox();
    expect(before?.height ?? 0, "the box reserves height before the loader runs").toBeGreaterThan(300);
  });

  test("the loader is not requested until the block is approached", async ({ page }) => {
    const loaders: string[] = [];
    page.on("request", (request) => {
      if (request.url().includes("/load.js")) loaders.push(request.url());
    });

    await page.setViewportSize({ width: 390, height: 700 });
    await page.goto(CALENDAR);
    await page.waitForTimeout(500);
    expect(loaders, "the loader must not run above the fold").toEqual([]);

    await page.locator("[data-portalize-widget]").scrollIntoViewIfNeeded();
    await expect
      .poll(() => loaders.length, { timeout: 15_000 })
      .toBeGreaterThan(0);
    expect(loaders[0]).toContain(SHOWCASE_CALENDAR.organizerId);
  });

  test("loads a real calendar without contacting an unlisted host or logging an error", async ({
    page,
    baseURL,
  }) => {
    test.skip(!(await widgetHostReachable()), "the Portalize host does not answer");
    const ownHost = baseURL ? new URL(baseURL).host : "";
    const isPreview = VERCEL_PREVIEW_HOST.test(ownHost);
    const offenders = new Set<string>();
    const errors: string[] = [];

    page.on("request", (request) => {
      let url: URL;
      try {
        url = new URL(request.url());
      } catch {
        return;
      }
      if (url.protocol !== "http:" && url.protocol !== "https:") return;
      if (url.host === ownHost) return;
      if (isPreview && PLATFORM_NOISE.test(url.host)) return;
      if (!ALLOWED_HOSTS.has(url.host)) offenders.add(`${url.host} (${request.url()})`);
    });
    page.on("console", (message) => {
      if (message.type() === "error" && !PLATFORM_NOISE.test(message.text())) {
        errors.push(message.text());
      }
    });
    page.on("pageerror", (error) => {
      if (!PLATFORM_NOISE.test(error.message)) errors.push(error.message);
    });

    await page.goto(CALENDAR);
    await page.locator("[data-portalize-widget]").scrollIntoViewIfNeeded();

    // The widget mounts a custom element with an open shadow root — that is
    // the proof the real loader ran, not a stub.
    await expect
      .poll(
        async () =>
          page.locator("[data-portalize-widget] portalize-widget").count(),
        { timeout: 20_000 },
      )
      .toBe(1);

    expect([...offenders], "unlisted hosts contacted by the embed").toEqual([]);
    expect(errors, "console errors while the embed loads").toEqual([]);
  });

  /**
   * What this case protects is unchanged: a visitor can read which places the
   * real calendar above is filtered to, and what every one of its settings is
   * set to.
   *
   * **Where she reads it moved.** The polish brief split the section in two:
   * `embed-demo` is now the widget and its introduction alone ("it gets the
   * room it deserves and nothing else in its section"), and the settings list
   * stands one section lower under its own `WARUM DAS ZÄHLT` heading, in a new
   * `embed-config` block — because together they measured 1772 px and the list
   * read as fine print under the picture rather than as the answer to "but can
   * we decide what is in it?" (`app/[lang]/dein-kalender/page.tsx`). Asserting
   * both halves against `embed-demo` is what failed; the split is the product
   * decision, so the case follows it rather than the other way round.
   */
  test("the page explains what is configured", async ({ page }) => {
    await page.goto(CALENDAR);
    const demo = page.locator("[data-block='embed-demo']");
    const config = page.locator("[data-block='embed-config']");

    // The demo's own copy names the places the calendar is filtered to, next
    // to the widget that shows them.
    await expect(demo).toContainText("Schlatkow");

    // And the configuration block names every setting the embed actually
    // has. The keys are asserted by name rather than by count: a list that
    // grows a row is not a regression — one that loses one is.
    //
    // T-13 turned the `<dl>` into `setting-row`s (DEC-0118, DEC-0131 §1), so
    // a key is an `h3` and its explanation is the row's own copy, not a
    // `<dd>`. The `Zeitraum` row carries its placeholder badge inside the
    // heading, so the match is a prefix rather than the whole string.
    for (const key of [
      "Orte",
      "Veranstalter",
      "Kategorien",
      "Zeitraum",
      "Darstellung",
      "Aktualisierung",
    ]) {
      const keyText = new RegExp(`^\\s*${key}`, "u");
      await expect(config.locator("h3", { hasText: keyText })).toBeVisible();
      // And the explanation, not only the label — a row that renders a bare
      // key explains nothing, and a non-emptiness check passes on any stray
      // paragraph. The wording is copy (DEC-0083), so the assertion is the
      // sentence's presence rather than its text: 20 characters is well under
      // the shortest of the six core sentences and well over a bare key or a
      // chip.
      const row = config.locator("li").filter({ has: page.locator("h3", { hasText: keyText }) });
      const core = (await row.locator("p").first().innerText()).trim();
      expect(core.length, `${key}: the row explains itself`).toBeGreaterThan(20);
    }
  });
});

/**
 * DEC-0173 — what the embedded calendar shows, and that it can be read.
 *
 * The 2026-10-27 review found three faults in the real widget (issues #95, #97,
 * #98): white titles on its own pale-pink cards and a white heading on the
 * box's `violet-100`; a showcase headed "Termine von {Verein}" over a calendar
 * the copy introduces as three villages'; and test dates. The first two are
 * settled on this site's side of the embed and checked here; the third is a
 * Portalize fix (its events route reads events-api unfiltered) and its check
 * waits for that deployment.
 */
test.describe("DEC-0173: the embedded calendar", () => {
  test.use({ extraHTTPHeaders: {} });

  test.beforeEach(async ({ page, baseURL }) => {
    if (BYPASS === undefined || baseURL === undefined) return;
    if (!VERCEL_PREVIEW_HOST.test(new URL(baseURL).host)) return;
    await page.goto(
      `/?x-vercel-protection-bypass=${encodeURIComponent(BYPASS)}&x-vercel-set-bypass-cookie=true`,
    );
  });

  /** Scroll to the widget and wait until its shadow root carries the list. */
  async function mountWidget(page: import("@playwright/test").Page): Promise<void> {
    await page.goto(CALENDAR);
    await page.locator("[data-block='embed-demo'] [data-portalize-widget]").scrollIntoViewIfNeeded();
    await page.waitForFunction(
      () => {
        const widget = document.querySelector("[data-block='embed-demo'] portalize-widget");
        return (widget?.shadowRoot?.textContent ?? "").trim().length > 200;
      },
      null,
      { timeout: 30_000 },
    );
    await page.waitForLoadState("networkidle");
  }

  test("TS-WEB-0024-A21: the mount switches the own-events showcase and highlight off", async ({ page }) => {
    await page.goto(CALENDAR);
    const mount = page.locator("[data-block='embed-demo'] [data-portalize-widget]");
    await expect(mount).toHaveAttribute("data-own-events-showcase", "false");
    await expect(mount).toHaveAttribute("data-own-events-highlight", "false");
  });

  test("TS-WEB-0024-A21: the widget carries no organizer's showcase heading", async ({ page }) => {
    test.skip(!(await widgetHostReachable()), "the Portalize host does not answer");
    await mountWidget(page);
    const text = await page.evaluate(
      () => document.querySelector("[data-block='embed-demo'] portalize-widget")?.shadowRoot?.textContent ?? "",
    );
    expect(text).not.toMatch(/Termine von/u);
  });

  test("TS-WEB-0024-A20: every text in the widget clears WCAG AA on its own ground", async ({ page }) => {
    test.skip(!(await widgetHostReachable()), "the Portalize host does not answer");
    await mountWidget(page);

    // Read inside the open shadow root: each element with its own text, its
    // computed colour, and the first opaque background on the way up —
    // crossing the shadow boundary to the host page, whose `violet-100` box
    // is the ground the widget's transparent root stands on.
    const measured = await page.evaluate(() => {
      type Rgba = { r: number; g: number; b: number; a: number };
      const parse = (value: string): Rgba | undefined => {
        const match = /rgba?\(([^)]+)\)/u.exec(value);
        if (match === null) return undefined;
        const [r = 0, g = 0, b = 0, a = 1] = match[1]!.split(/[\s,/]+/u).filter(Boolean).map(Number);
        return { r, g, b, a };
      };
      const channel = (v: number) => {
        const c = v / 255;
        return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
      };
      const luminance = (c: Rgba) => 0.2126 * channel(c.r) + 0.7152 * channel(c.g) + 0.0722 * channel(c.b);
      const ratio = (x: Rgba, y: Rgba) => {
        const [hi, lo] = [luminance(x), luminance(y)].sort((a, b) => b - a) as [number, number];
        return (hi + 0.05) / (lo + 0.05);
      };
      const up = (el: Element): Element | null => {
        if (el.parentElement !== null) return el.parentElement;
        const root = el.getRootNode();
        return root instanceof ShadowRoot ? root.host : null;
      };
      const ground = (el: Element | null): Rgba => {
        const layers: Rgba[] = [];
        for (let node = el; node !== null; node = up(node)) {
          const colour = parse(getComputedStyle(node).backgroundColor);
          if (colour !== undefined && colour.a > 0) {
            layers.push(colour);
            if (colour.a >= 1) break;
          }
        }
        return layers.reverse().reduce<Rgba>(
          (below, c) => ({
            r: c.r * c.a + below.r * (1 - c.a),
            g: c.g * c.a + below.g * (1 - c.a),
            b: c.b * c.a + below.b * (1 - c.a),
            a: 1,
          }),
          { r: 255, g: 255, b: 255, a: 1 },
        );
      };

      const widget = document.querySelector("[data-block='embed-demo'] portalize-widget");
      const texts: { text: string; ratio: number; need: number }[] = [];
      const controls: { text: string; ratio: number }[] = [];
      const walk = (root: ShadowRoot | Element) => {
        for (const el of root.querySelectorAll("*")) {
          if (el.shadowRoot) walk(el.shadowRoot);
          const style = getComputedStyle(el);
          if (style.display === "none" || style.visibility === "hidden" || el.getClientRects().length === 0) continue;
          const own = [...el.childNodes]
            .filter((node) => node.nodeType === Node.TEXT_NODE)
            .map((node) => (node.textContent ?? "").trim())
            .join(" ")
            .trim();
          if (own !== "") {
            const size = Number.parseFloat(style.fontSize);
            const large = size >= 24 || (Number(style.fontWeight) >= 700 && size >= 18.66);
            texts.push({ text: own.slice(0, 60), ratio: ratio(parse(style.color)!, ground(el)), need: large ? 3 : 4.5 });
          }
          // A control's boundary: its border against the ground around it
          // (WCAG 1.4.11). Borderless controls are judged by their text above.
          if (el.tagName === "BUTTON" && Number.parseFloat(style.borderTopWidth) > 0) {
            controls.push({
              text: (el.textContent ?? "").trim().slice(0, 40),
              ratio: ratio(parse(style.borderTopColor)!, ground(up(el))),
            });
          }
        }
      };
      if (widget?.shadowRoot) walk(widget.shadowRoot);
      return { texts, controls };
    });

    expect(measured.texts.length, "the widget rendered text to measure").toBeGreaterThan(10);
    const low = measured.texts.filter((t) => t.ratio < t.need).map((t) => `${t.text}: ${t.ratio.toFixed(2)}:1`);
    expect(low, "texts under 4.5:1 (3:1 for large text)").toEqual([]);
    const faint = measured.controls.filter((c) => c.ratio < 3).map((c) => `${c.text}: ${c.ratio.toFixed(2)}:1`);
    expect(faint, "control boundaries under 3:1").toEqual([]);

    // And axe's own reading of the same block — it pierces open shadow roots.
    const axe = await new AxeBuilder({ page })
      .include("[data-block='embed-demo']")
      .withRules(["color-contrast"])
      .analyze();
    expect(axe.violations.flatMap((v) => v.nodes.map((n) => n.target.join(" ")))).toEqual([]);
  });

  test("TS-WEB-0008-A21: the page's own text carries no test date", async ({ page }) => {
    await page.goto(CALENDAR);
    // `innerText` stops at the widget's shadow root, so this reads exactly
    // what this site renders; the widget's half is the next case.
    expect(await page.locator("main").innerText()).not.toMatch(/\bTEST\b/u);
  });

  /**
   * The widget's half of the rule. Portalize's events route
   * (`apps/widget-host/src/app/api/[organizerId]/events/route.ts`) passes
   * events-api's answer through unfiltered, so the test organizer's dates
   * reach every embed, this one included. The fix is in that repository
   * (schafe-vorm-fenster/portalize PR 144); this case runs once it is deployed.
   */
  test("TS-WEB-0024-A22: the widget shows no test organizer's date", async ({ page }) => {
    test.fixme(true, "waits for schafe-vorm-fenster/portalize PR 144 to be deployed (DEC-0173 §3)");
    test.skip(!(await widgetHostReachable()), "the Portalize host does not answer");
    await mountWidget(page);
    const text = await page.evaluate(
      () => document.querySelector("[data-block='embed-demo'] portalize-widget")?.shadowRoot?.textContent ?? "",
    );
    expect(text).not.toMatch(/\bTEST\b/u);
  });
});
