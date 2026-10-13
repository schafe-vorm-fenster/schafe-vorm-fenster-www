import { expect, test } from "@playwright/test";

/**
 * The language switch of TS-WEB-0001 D5 as DEC-0158 determines it — a
 * segmented control, one link per language, the current one marked by
 * `aria-current="page"` (TS-WEB-0001-A12) — and TS-WEB-0001-A7: switching
 * keeps the visitor on the equivalent page.
 */

const PAIRS = [
  { from: "/mitmachen", to: "/en/take-part", current: "Deutsch", other: "English" },
  { from: "/en/take-part", to: "/mitmachen", current: "English", other: "Deutsch" },
] as const;

for (const { from, to, current, other } of PAIRS) {
  test(`TS-WEB-0001-A12: ${from}: the footer switch is two links, ${current} marked current`, async ({
    page,
  }) => {
    await page.goto(from);
    const nav = page.getByRole("contentinfo").getByRole("navigation", { name: /Sprache|Language/ });
    await expect(nav).toBeVisible();

    const links = nav.getByRole("link");
    await expect(links).toHaveText(["Deutsch", "English"]);

    // The current language: marked by aria-current, pointing at this page.
    const marked = nav.locator('a[aria-current="page"]');
    await expect(marked).toHaveCount(1);
    await expect(marked).toHaveText(current);
    await expect(marked).toHaveAttribute("href", from);

    // The other language: the equivalent page, in its own language.
    const target = nav.getByRole("link", { name: other });
    await expect(target).toHaveAttribute("href", to);
    await expect(target).not.toHaveAttribute("aria-current", /.+/);
    expect(await target.getAttribute("lang")).toBe(to.startsWith("/en") ? "en" : "de");
    expect(await target.getAttribute("hreflang")).toBe(to.startsWith("/en") ? "en" : "de");

    // 44 px targets (SRC-0014 §Touch targets), both segments.
    for (const box of [await marked.boundingBox(), await target.boundingBox()]) {
      expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
    }
  });

  test(`TS-WEB-0001-A7: switching from ${from} lands on ${to}, not the home page`, async ({ page }) => {
    await page.goto(from);
    await page
      .getByRole("contentinfo")
      .getByRole("navigation", { name: /Sprache|Language/ })
      .getByRole("link", { name: other })
      .click();
    await expect(page).toHaveURL(new RegExp(`${to.replace(/\//g, "\\/")}$`));
  });
}

test("TS-WEB-0017-A41: the active segment is filled lime-500 with ink text, the other paper on the track", async ({
  page,
}) => {
  await page.goto("/mitmachen");
  const nav = page.getByRole("contentinfo").getByRole("navigation", { name: "Sprache" });
  const active = nav.locator('a[aria-current="page"]');
  const other = nav.getByRole("link", { name: "English" });
  const tokens = await page.evaluate(() => {
    const probe = document.createElement("i");
    document.body.append(probe);
    const read = (name: string) => {
      probe.style.color = `var(${name})`;
      return getComputedStyle(probe).color;
    };
    const values = {
      lime500: read("--color-lime-500"),
      ink: read("--color-neutral-ink"),
      paper: read("--color-neutral-paper"),
    };
    probe.remove();
    return values;
  });
  await expect(active).toHaveCSS("background-color", tokens.lime500);
  await expect(active).toHaveCSS("color", tokens.ink);
  await expect(other).toHaveCSS("color", tokens.paper);
  // A fill is never its ground (TS-WEB-0017-A29): the track behind the
  // segments is neither the lime fill nor transparent.
  const track = await nav.locator("ul").evaluate((el) => getComputedStyle(el).backgroundColor);
  expect(track).not.toBe(tokens.lime500);
  expect(track).not.toMatch(/, 0\)$/);
});
