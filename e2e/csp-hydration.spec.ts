import { expect, test, type Page } from "@playwright/test";

import { LOCALES } from "../src/lib/i18n/locales";
import { everyRoute, href } from "../src/lib/routes/routes";
import { ALLOWLIST } from "../src/lib/security/csp";

/**
 * TS-WEB-0014-A14 — every page loads under its CSP with **zero** violations
 * and hydrates (DEC-0163, #59).
 *
 * What failed before: the policy carries build-time sha256 hashes of the
 * inline scripts (DEC-0045), and three things put inline scripts in front of
 * the browser that no hash covered — a site-wide set truncated at 128 of
 * ~430, pages whose HTML regenerated every five minutes with new live data,
 * and routes rendered per request because they read `?ort=` or a flow step.
 * The visible symptom was a page that rendered and never hydrated: no
 * typeahead, no conversion events, React error 412.
 *
 * The walk is every route of the registry in both languages, at one phone
 * width (the viewport has no bearing on which scripts a page carries). It
 * listens on both channels the browser reports a refusal through — the
 * `securitypolicyviolation` event and the console line — and waits for the
 * site header's `data-hydrated="true"`, which every page renders and which
 * flips only once React has hydrated (`header-shell.tsx`). Every other
 * `[data-hydrated]` on the page (conversion trackers, the archive filter)
 * must flip too.
 *
 * It is meaningful against a **production build** (`pnpm build && pnpm
 * start`, the CI job) and a preview deployment; `next dev` serves a
 * development policy with `'unsafe-inline'` and has no hashes to get wrong.
 */

test.use({ viewport: { width: 390, height: 844 } });

/**
 * Vercel injects its preview toolbar (`https://vercel.live/…`) into preview
 * deployments. It is the platform's script, not this site's, outside the D1
 * allowlist by design (state/open.md row 31), and absent from production and
 * from `next start` — so a refusal of it is not a refusal of anything this
 * site ships.
 */
const PLATFORM_TOOLBAR = "https://vercel.live/";

async function collectViolations(page: Page): Promise<string[]> {
  const violations: string[] = [];
  await page.exposeFunction("__reportCspViolation", (line: string) => violations.push(line));
  await page.addInitScript(() => {
    document.addEventListener("securitypolicyviolation", (event) => {
      if (event.blockedURI.startsWith("https://vercel.live/")) return;
      // `addInitScript` runs in every frame. A framed third-party document
      // (the registration form, DEC-0176) reports against its own policy,
      // which is not this site's; those are not counted.
      if (window !== window.top) return;
      (window as unknown as { __reportCspViolation: (line: string) => void }).__reportCspViolation(
        `${event.effectiveDirective} ${event.blockedURI || "inline"} ${event.sourceFile ?? ""}:${event.lineNumber}`,
      );
    });
  });
  page.on("console", (message) => {
    const text = message.text();
    // The same rule on the console channel: a line logged by a framed
    // third-party document is that document's (DEC-0176).
    const source = message.location().url;
    if (source && new URL(source).origin === ALLOWLIST.googleForms) return;
    if (text.includes("Content Security Policy") && !text.includes(PLATFORM_TOOLBAR)) violations.push(text);
  });
  return violations;
}

for (const { route, locale } of everyRoute()) {
  const path = href(route, locale);

  test(`TS-WEB-0014-A14: ${path} loads with zero CSP violations and hydrates`, async ({ page }) => {
    const violations = await collectViolations(page);

    const response = await page.goto(path);
    expect(response?.status(), path).toBe(200);

    await expect(page.locator("header[data-hydrated]").first()).toHaveAttribute("data-hydrated", "true");
    for (const marker of await page.locator("[data-hydrated]").all()) {
      await expect(marker).toHaveAttribute("data-hydrated", "true");
    }
    // Live modules load after hydration; let their requests settle so a
    // refusal they trigger is caught too.
    await page.waitForLoadState("networkidle");

    expect(violations, `${path}: CSP violations`).toEqual([]);
  });
}

/**
 * TS-WEB-0023-A21 (DEC-0176) — the registration route frames the Google Form.
 * `frame-src` admits the form host (TS-WEB-0014 D1, DEC-0121), and this is the
 * page where that row is exercised inside the site chrome: the route loads
 * with zero violations of **our** policy, and the frame's navigation is not
 * refused — it reaches the form host and the form renders. What Google's own
 * document reports against Google's own policy is not ours, so only
 * violations raised in our document count.
 */
for (const locale of LOCALES) {
  test(`TS-WEB-0023-A21: ${href("register", locale)} frames the form under the CSP with zero violations`, async ({ page }) => {
    const violations = await collectViolations(page);
    const framed: string[] = [];
    page.on("framenavigated", (frame) => {
      if (frame !== page.mainFrame()) framed.push(new URL(frame.url()).origin);
    });

    await page.goto(href("register", locale));
    await expect(page.locator("iframe[data-register-form]")).toHaveAttribute("data-hydrated", "true");
    await expect(page.frameLocator("iframe[data-register-form]").locator("form")).toBeVisible({ timeout: 20_000 });

    expect(framed).toContain(ALLOWLIST.googleForms);
    expect(violations, "CSP violations").toEqual([]);
  });
}

test("TS-WEB-0014-A14: a page reached with a query is the same static page, and hydrates", async ({ page }) => {
  const violations = await collectViolations(page);
  for (const locale of LOCALES) {
    for (const path of [`${href("register", locale)}?ort=schlatkow&schritt=1`, `${href("order", locale)}?orte=schlatkow&schritt=2`]) {
      await page.goto(path);
      await expect(page.locator("header[data-hydrated]").first()).toHaveAttribute("data-hydrated", "true");
    }
  }
  expect(violations).toEqual([]);
});

/**
 * The 404 in each language (DEC-0164). It used to be rendered per request and
 * was sent only the hash set common to every page, so its flight payload was
 * refused and it never hydrated. It is now a prerendered document per
 * language with its own entry in the hash map. It has no site header by
 * design, so its hydration signal is the `[data-hydrated]` wrapper around its
 * body (`app/_not-found/hydration-mark.tsx`).
 */
for (const { path, lang } of [
  { path: "/gibt-es-nicht-a14", lang: "de" },
  { path: "/en/does-not-exist-a14", lang: "en" },
]) {
  test(`TS-WEB-0014-A14: the ${lang} 404 (${path}) loads with zero CSP violations and hydrates`, async ({ page }) => {
    const violations = await collectViolations(page);

    const response = await page.goto(path);
    expect(response?.status(), path).toBe(404);
    await expect(page.locator("html")).toHaveAttribute("lang", lang);

    const markers = page.locator("[data-hydrated]");
    await expect(markers.first()).toHaveAttribute("data-hydrated", "true");
    for (const marker of await markers.all()) {
      await expect(marker).toHaveAttribute("data-hydrated", "true");
    }
    await page.waitForLoadState("networkidle");

    expect(violations, `${path}: CSP violations`).toEqual([]);
  });
}
