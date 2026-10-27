import { expect, test } from "@playwright/test";

import { href } from "../src/lib/routes/routes";

import type { Page } from "@playwright/test";

/**
 * TS-WEB-0008 D7/D7a and TS-WEB-0010 D5 — the place search, end to end.
 *
 * What only a browser can establish, which is why it is here and not in the
 * BFF's integration tests:
 *
 *  1. TS-WEB-0008-A15 — the suggestion overlay: two characters open a list of
 *     at most four rows, each "Ort (Gemeinde)"; the element directly below the
 *     field has a byte-identical bounding box closed and open and the
 *     interaction adds nothing to CLS; a name with no match shows the single
 *     no-match row and the submit still lands on `/dein-ort/starten?ort=…`;
 *     with JavaScript disabled no list exists and the form still submits.
 *  2. TS-WEB-0010-A8 — browser geolocation: no permission prompt on load or
 *     scroll; the prompt appears only after the explicit control is
 *     activated; a denial leaves the page unchanged and is not re-asked.
 *
 * The register flow's half of its handover criterion — a pick from the
 * overlay carrying the field's `etcc_*` parameters — stood here until
 * DEC-0176; the flow is not rendered while the Google Form is embedded.
 *
 * Runs in both `LIVE_DATA` modes: the mock and the committed index both
 * carry `Schlatkow (Schmatzin)`.
 */

const SEARCH = "Schlat";
const PLACE = "Schlatkow";
const ROW = /^.+ \(.+\)$/u;

/**
 * `/dein-ort` renders the module twice, so each instance carries its own DOM
 * id (`place-search`'s `id` prop). The focus block's is the one the page's
 * primary conversion sits on.
 */
const FIELD = "#ort-suche-fokus";

/**
 * The element directly below the field: the helper line with the hint and
 * the geolocation control — the sibling of the wrapper the overlay hangs
 * from, since the overlay itself is inside that wrapper.
 */
const BELOW_FIELD = `${FIELD} >> xpath=ancestor::form/parent::*/following-sibling::*[1]`;

interface ClsWindow {
  __cls: number;
}

/** Must run before the first navigation, or the load shifts are already lost. */
async function installClsObserver(page: Page): Promise<void> {
  await page.addInitScript(() => {
    const store = window as unknown as ClsWindow;
    store.__cls = 0;
    if (!PerformanceObserver.supportedEntryTypes?.includes("layout-shift")) return;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const shift = entry as PerformanceEntry & { value: number };
        store.__cls += shift.value;
      }
    }).observe({ type: "layout-shift", buffered: true });
  });
}

const readCls = (page: Page) => page.evaluate(() => (window as unknown as ClsWindow).__cls);

/**
 * The typeahead attaches to the server-rendered field on hydration and marks
 * it `role="combobox"` when it has. A fill that lands earlier is answered
 * too (the effect reads the field once on attach), but a test that means to
 * measure the overlay waits for the enhancement rather than racing it.
 */
async function hydrated(page: Page, selector: string): Promise<void> {
  await expect(page.locator(selector).first()).toHaveAttribute("role", "combobox", { timeout: 15_000 });
}

/** The words TS-WEB-0008-A16 forbids on any search surface, as the visitor would read them. */
const POSTCODE = /Postleitzahl|\bPLZ\b|postcode|\bZIP\b/iu;

test.describe("TS-WEB-0008-A15: the suggestion overlay", () => {
  test("two characters open at most four rows, each Ort (Gemeinde), and a pick lands on the place", async ({
    page,
  }) => {
    await page.goto(href("place", "de"));
    await hydrated(page, FIELD);

    const field = page.locator(FIELD);
    await field.fill(SEARCH);

    const options = page.getByRole("option");
    await expect(options.first()).toBeVisible({ timeout: 10_000 });
    const count = await options.count();
    expect(count, "D7a: 3–4 rows, never more").toBeLessThanOrEqual(4);
    expect(count).toBeGreaterThan(0);
    // `textContent`, not `innerText`: the row wraps its two spans onto two
    // lines at narrow widths, and what is asserted is the wording, not the
    // line break.
    for (const label of await options.evaluateAll((rows) => rows.map((row) => row.textContent ?? ""))) {
      expect(label.trim(), "each row reads Ort (Gemeinde)").toMatch(ROW);
    }

    // The input is a combobox only once the popup is open — the enhancement
    // adds the role, it is not in the prerendered markup.
    await expect(field).toHaveAttribute("aria-expanded", "true");

    // The list never scrolls: further matches are for the next letter.
    const listbox = page.getByRole("listbox");
    const scrolls = await listbox.evaluate(
      (element) => element.scrollHeight > element.clientHeight + 1 || getComputedStyle(element).overflowY === "auto",
    );
    expect(scrolls, "D7a: further matches are neither paged nor scrolled").toBe(false);

    const suggestion = page.getByRole("option", { name: PLACE });
    await suggestion.click();
    await expect(page).toHaveURL(/[?&]ort=schlatkow\b/u);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("nothing below the field moves when the list opens or closes, and the interaction adds 0 to CLS", async ({
    page,
  }) => {
    await installClsObserver(page);
    await page.goto(href("place", "de"));
    await page.waitForLoadState("networkidle");

    const below = page.locator(BELOW_FIELD);
    await expect(below).toBeVisible();
    const closedBox = JSON.stringify(await below.boundingBox());
    const clsBefore = await readCls(page);

    await hydrated(page, FIELD);
    const field = page.locator(FIELD);
    await field.fill(SEARCH);
    await expect(page.getByRole("option").first()).toBeVisible({ timeout: 10_000 });
    const openBox = JSON.stringify(await below.boundingBox());
    expect(openBox, "the element directly below the field is where it was").toBe(closedBox);

    await field.press("Escape");
    await expect(page.getByRole("listbox")).toHaveCount(0);
    expect(JSON.stringify(await below.boundingBox())).toBe(closedBox);

    await page.waitForTimeout(600);
    expect(await readCls(page), "opening and closing the overlay shifts nothing").toBe(clsBefore);
  });

  test("a name with no match shows the single no-match row, and the submit still reaches the founding route", async ({
    page,
  }) => {
    await page.goto(href("place", "de"));
    await hydrated(page, FIELD);

    const field = page.locator(FIELD);
    await field.fill("Oberammergau");

    const none = page.locator("[data-typeahead-none]");
    await expect(none).toBeVisible({ timeout: 10_000 });
    await expect(page.getByRole("listbox").locator("li")).toHaveCount(1);
    await expect(none.locator("a, button")).toHaveCount(0);
    await expect(none).not.toContainText(/Postleitzahl|postcode/iu);

    await field.press("Enter");
    await expect(page).toHaveURL(/\/dein-ort\/starten\?ort=Oberammergau/u);
  });

  test("five typed digits are a name like any other: no match, the founding route", async ({ page }) => {
    await page.goto(href("place", "de"));
    await hydrated(page, FIELD);
    const field = page.locator(FIELD);
    await field.fill("17509");
    await expect(page.locator("[data-typeahead-none]")).toBeVisible({ timeout: 10_000 });
    await field.press("Enter");
    await expect(page).toHaveURL(/\/dein-ort\/starten\?ort=17509/u);
  });

  test("asks nothing below two characters", async ({ page }) => {
    const calls: string[] = [];
    page.on("request", (request) => {
      if (request.url().includes("/api/places/search")) calls.push(request.url());
    });

    await page.goto(href("place", "de"));
    await hydrated(page, FIELD);
    await page.locator(FIELD).fill("S");
    await page.waitForTimeout(600);

    expect(calls, "a single letter must not reach the BFF").toEqual([]);
    await expect(page.getByRole("listbox")).toHaveCount(0);
  });

  test("a value that reached the field without a keystroke is searched on focus, not on load", async ({
    page,
  }) => {
    const calls: string[] = [];
    page.on("request", (request) => {
      if (request.url().includes("/api/places/search")) calls.push(request.url());
    });

    await page.goto(href("place", "de"));
    await hydrated(page, FIELD);
    const field = page.locator(FIELD);

    // A `?ort=` prefill and a browser-restored form set the value and fire no
    // `input` event; the field is blurred, as it is after a page load.
    await field.evaluate((element, value) => {
      element.blur();
      (element as HTMLInputElement).value = value;
    }, SEARCH);
    await page.waitForTimeout(600);
    expect(calls, "a prefilled value in a blurred field is not a search").toEqual([]);
    await expect(page.getByRole("listbox")).toHaveCount(0);

    await field.focus();
    await expect(page.getByRole("option").first()).toBeVisible({ timeout: 10_000 });
    await expect(field).toHaveAttribute("aria-expanded", "true");
    expect(calls, "the focus searched the prefilled value once").toHaveLength(1);
  });

  test("the keyboard walks the rows and Enter follows the active one", async ({ page }) => {
    await page.goto(href("place", "de"));
    await hydrated(page, FIELD);
    const field = page.locator(FIELD);
    await field.fill(SEARCH);
    await expect(page.getByRole("option").first()).toBeVisible({ timeout: 10_000 });

    await field.press("ArrowDown");
    const activeId = await field.getAttribute("aria-activedescendant");
    expect(activeId).toBeTruthy();
    const activeHref = await page.locator(`[id="${activeId}"]`).getAttribute("href");
    expect(activeHref).toMatch(/[?&]ort=/u);

    await field.press("Enter");
    await expect(page).toHaveURL(new RegExp(activeHref!.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&")));
  });
});

// `register` left this list with DEC-0176: the route embeds the Google Form for
// the launch and renders no place search while the embed stands.
test.describe("TS-WEB-0008-A16: what the visitor reads on the place-search surfaces names no postcode", () => {
  // The static check scans the dictionary, the content slots and the page
  // modules; this is the composed result — label, placeholder and the block
  // around the field, on every instance, in both locales.
  for (const locale of ["de", "en"] as const) {
    for (const route of ["home", "place", "placeStart", "region"] as const) {
      test(`${route} (${locale})`, async ({ page }) => {
        await page.goto(href(route, locale));
        const fields = page.locator('input[name="ort"]');
        const count = await fields.count();
        expect(count, "the surface carries the place search").toBeGreaterThan(0);
        for (let index = 0; index < count; index += 1) {
          const field = fields.nth(index);
          const id = await field.getAttribute("id");
          const label = await page.locator(`label[for="${id}"]`).first().textContent();
          const placeholder = await field.getAttribute("placeholder");
          const block = await field.locator("xpath=ancestor::form/parent::*").textContent();
          expect(label, `label of #${id}`).not.toMatch(POSTCODE);
          expect(placeholder, `placeholder of #${id}`).not.toMatch(POSTCODE);
          expect(block, `search block around #${id}`).not.toMatch(POSTCODE);
        }
      });
    }
  }
});

test.describe("the search works without the enhancement", () => {
  test.use({ javaScriptEnabled: false });

  test("the plain GET form still resolves a place, and no list exists", async ({ page }) => {
    await page.goto(href("place", "de"));
    await page.locator(FIELD).fill(PLACE);
    await expect(page.getByRole("listbox")).toHaveCount(0);
    await page.locator(FIELD).press("Enter");

    await expect(page).toHaveURL(/[?&]ort=/u);
    // No listbox can exist here, and the page still answers 200 with its own
    // shell — TS-WEB-0020 D2's "never an error page".
    await expect(page.getByRole("listbox")).toHaveCount(0);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });
});

/**
 * TS-WEB-0010-A8 — the permission prompt is observed at its source: an init
 * script wraps `navigator.geolocation.getCurrentPosition` and counts calls.
 * The prompt is what that call triggers, so zero calls is zero prompts.
 */
interface GeoWindow {
  __geoAsks: number;
}

async function countGeolocationAsks(page: Page): Promise<void> {
  await page.addInitScript(() => {
    const store = window as unknown as GeoWindow;
    store.__geoAsks = 0;
    const geolocation = navigator.geolocation;
    const original = geolocation.getCurrentPosition.bind(geolocation);
    geolocation.getCurrentPosition = (success, error, options) => {
      store.__geoAsks += 1;
      return original(success, error, options);
    };
  });
}

const asks = (page: Page) => page.evaluate(() => (window as unknown as GeoWindow).__geoAsks);

test.describe("TS-WEB-0010-A8: browser geolocation only after an interaction", () => {
  test("no prompt on load or scroll; the control states what will happen", async ({ page }) => {
    await countGeolocationAsks(page);
    await page.goto(href("place", "de"));
    await page.waitForLoadState("networkidle");
    expect(await asks(page), "no ask on load").toBe(0);

    await page.mouse.wheel(0, 2_000);
    await page.waitForTimeout(500);
    await page.mouse.wheel(0, -2_000);
    expect(await asks(page), "no ask on scroll").toBe(0);

    const control = page.locator("[data-locate-control]").first();
    await expect(control).toBeVisible();
    await expect(control).toBeEnabled();
    const describedBy = await control.getAttribute("aria-describedby");
    expect(describedBy).toBeTruthy();
    await expect(page.locator(`[id="${describedBy}"]`)).not.toBeEmpty();
  });

  test("a denial leaves the page unchanged and is not re-asked", async ({ page }) => {
    // Permission not granted to the context: the browser answers the ask with
    // a denial, no dialog.
    await countGeolocationAsks(page);
    await page.goto(href("place", "de"));
    await page.waitForLoadState("networkidle");
    const url = page.url();
    const html = await page.locator("main").innerHTML();

    const control = page.locator("[data-locate-control]").first();
    await expect(control).toBeEnabled();
    await control.click();
    await page.waitForTimeout(800);
    expect(await asks(page), "the click is the ask").toBe(1);
    expect(page.url()).toBe(url);
    expect(await page.locator("main").innerHTML(), "no message, nothing changed").toBe(html);

    await control.click();
    await page.waitForTimeout(500);
    expect(await asks(page), "a denial is not re-asked").toBe(1);
  });

  test("a granted position navigates to the nearest covered place's ?ort=", async ({ page, context }) => {
    await context.grantPermissions(["geolocation"]);
    // Schlatkow's own coordinate, in the mock ring and in the committed index alike.
    await context.setGeolocation({ latitude: 53.9215, longitude: 13.5812 });
    await countGeolocationAsks(page);

    await page.goto(href("place", "de"));
    await page.waitForLoadState("networkidle");
    expect(await asks(page)).toBe(0);

    const control = page.locator("[data-locate-control]").first();
    await expect(control).toBeEnabled();
    await control.click();
    await page.waitForURL(/[?&]ort=[a-z0-9-]+/u, { timeout: 15_000 });
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });
});

/**
 * TS-WEB-0008-A17 — the suggestion a visitor points at stays readable (owner
 * review 2026-10-27, issue #79, `plan/reviews/2026-10-27/Ist - Ortssuche
 * Hover.png`: the hovered "Lehre" in `lime-300` on `surface`, 1.2:1).
 *
 * The row is an `<a>`, and the photo hero publishes `lime-300` as its link
 * hover colour; `base.css`'s `a:hover` out-specified the row's own `ink`. So
 * the measurement is taken where the bug lived — on the hero field of `/` and
 * `/dein-ort` — with the pointer on the row and with the keyboard's active
 * row, for the place name and for the municipality, against the ground the
 * row actually paints. WCAG 2.2 AA body text, 4.5:1 (TS-WEB-0002 D1).
 */
async function rowContrast(page: Page, rowId: string): Promise<{ name: number; municipality: number }> {
  return page.evaluate((id) => {
    const parse = (value: string) => (value.match(/[\d.]+/g) ?? []).map(Number);
    const channel = (value: number) => {
      const scaled = value / 255;
      return scaled <= 0.03928 ? scaled / 12.92 : ((scaled + 0.055) / 1.055) ** 2.4;
    };
    const luminance = ([r, g, b]: number[]) => 0.2126 * channel(r!) + 0.7152 * channel(g!) + 0.0722 * channel(b!);
    const ratio = (a: number[], b: number[]) => {
      const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
      return (light! + 0.05) / (dark! + 0.05);
    };
    /** The first ancestor-or-self that paints an opaque ground. */
    const ground = (element: Element): number[] => {
      for (let node: Element | null = element; node; node = node.parentElement) {
        const parts = parse(getComputedStyle(node).backgroundColor);
        if (parts.length === 3 || (parts.length === 4 && parts[3]! > 0.99)) return parts.slice(0, 3);
      }
      return [255, 255, 255];
    };
    const row = document.getElementById(id)!;
    const name = row.querySelector("strong") ?? row.firstElementChild!;
    const municipality = row.lastElementChild!;
    const back = ground(row);
    return {
      name: ratio(parse(getComputedStyle(name).color).slice(0, 3), back),
      municipality: ratio(parse(getComputedStyle(municipality).color).slice(0, 3), back),
    };
  }, rowId);
}

test.describe("TS-WEB-0008-A17: the hovered and the active suggestion keep 4.5:1", () => {
  for (const route of ["home", "place"] as const) {
    test(`${href(route, "de")} — pointer and keyboard`, async ({ page }) => {
      await page.goto(href(route, "de"));
      await hydrated(page, FIELD);
      const field = page.locator(FIELD);
      await field.fill(SEARCH);
      const first = page.getByRole("option").first();
      await expect(first).toBeVisible({ timeout: 10_000 });

      // Pointer on the first row: the state of the owner's screenshot.
      await first.hover();
      const firstId = (await first.getAttribute("id"))!;
      const hovered = await rowContrast(page, firstId);
      expect(hovered.name, "hovered place name").toBeGreaterThanOrEqual(4.5);
      expect(hovered.municipality, "hovered municipality").toBeGreaterThanOrEqual(4.5);

      // The keyboard's active row, with the pointer moved off the list.
      await page.mouse.move(0, 0);
      await field.press("ArrowDown");
      const activeId = (await field.getAttribute("aria-activedescendant"))!;
      const active = await rowContrast(page, activeId);
      expect(active.name, "active place name").toBeGreaterThanOrEqual(4.5);
      expect(active.municipality, "active municipality").toBeGreaterThanOrEqual(4.5);

      // A row at rest, for completeness: the pair the guide states.
      const rest = page.getByRole("option").nth(1);
      if ((await rest.count()) > 0 && (await rest.getAttribute("id")) !== activeId) {
        const resting = await rowContrast(page, (await rest.getAttribute("id"))!);
        expect(resting.name).toBeGreaterThanOrEqual(4.5);
        expect(resting.municipality).toBeGreaterThanOrEqual(4.5);
      }
    });
  }
});
