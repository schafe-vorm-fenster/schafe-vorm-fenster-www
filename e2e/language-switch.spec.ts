import { expect, test } from "@playwright/test";

/**
 * The language switch of TS-WEB-0001 D5 as DEC-0120 determines it — only the
 * other language is a control, framed as an invitation — and TS-WEB-0001-A7:
 * switching keeps the visitor on the equivalent page. Plus the footer's
 * base line standing on its own ground (TS-WEB-0004-A9's legal links).
 */

const PAIRS = [
  { from: "/mitmachen", to: "/en/take-part", invitation: "Read this page in English:", link: "English" },
  { from: "/en/take-part", to: "/mitmachen", invitation: "Diese Seite auf Deutsch lesen:", link: "Deutsch" },
] as const;

for (const { from, to, invitation, link } of PAIRS) {
  test(`${from}: the footer switch is one control, the other language, framed as an invitation`, async ({
    page,
  }) => {
    await page.goto(from);
    const footer = page.getByRole("contentinfo");
    const nav = footer.getByRole("navigation", { name: /Sprache|Language/ });
    await expect(nav).toBeVisible();

    // Exactly one control, and it is the other language.
    const links = nav.getByRole("link");
    await expect(links).toHaveCount(1);
    await expect(links).toHaveText(link);
    await expect(links).toHaveAttribute("href", to);
    await expect(nav.locator("[aria-current]")).toHaveCount(0);

    // The invitation stands before it, in the target language.
    await expect(nav).toContainText(invitation);
    const lang = await links.getAttribute("lang");
    expect(lang).toBe(to.startsWith("/en") ? "en" : "de");

    // 44 px target (SRC-0014 §Touch targets).
    const box = await links.boundingBox();
    expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
  });

  test(`TS-WEB-0001-A7: switching from ${from} lands on ${to}, not the home page`, async ({ page }) => {
    await page.goto(from);
    await page.getByRole("contentinfo").getByRole("navigation", { name: /Sprache|Language/ }).getByRole("link").click();
    await expect(page).toHaveURL(new RegExp(`${to.replace(/\//g, "\\/")}$`));
  });
}

test("the German invitation is a placeholder in the markup, the English one is not", async ({ page }) => {
  await page.goto("/mitmachen");
  const de = page.getByRole("contentinfo").getByRole("navigation", { name: "Sprache" });
  await expect(de.locator('[data-demo="true"]')).toHaveCount(0);

  await page.goto("/en/take-part");
  const en = page.getByRole("contentinfo").getByRole("navigation", { name: "Language" });
  await expect(en.locator('[data-demo="true"]')).toHaveCount(1);
});

test("the footer's legal base line stands on its own ground under a hairline", async ({ page }) => {
  await page.goto("/");
  const footer = page.getByRole("contentinfo");
  const base = footer.getByRole("navigation", { name: "Impressum" }).locator("..");
  const [baseBackground, footerBackground, borderTop] = await Promise.all([
    base.evaluate((el) => getComputedStyle(el).backgroundColor),
    footer.evaluate((el) => getComputedStyle(el).backgroundColor),
    base.evaluate((el) => getComputedStyle(el).borderTopWidth),
  ]);
  expect(baseBackground).not.toBe(footerBackground);
  // Not transparent — a colour with a zero alpha would be no ground at all.
  expect(baseBackground).not.toMatch(/, 0\)$/);
  expect(borderTop).toBe("1px");
  // The three legal links are still visible on it (TS-WEB-0004-A9).
  for (const hash of ["impressum", "datenschutz", "barrierefreiheit"]) {
    await expect(base.locator(`a[href="/rechtliches#${hash}"]`)).toBeVisible();
  }
});
