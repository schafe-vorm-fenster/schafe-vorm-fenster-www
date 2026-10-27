import { expect, test } from "@playwright/test";

import { dictionary } from "../src/lib/i18n/dictionary";
import { href } from "../src/lib/routes/routes";

import type { Locale } from "../src/lib/i18n/locales";
import type { RouteId } from "../src/lib/routes/routes";

/**
 * TS-WEB-0022-A22 — every state of every explain module has its graphic, on
 * every route that renders one (owner's review 2026-10-27, issues #88 and #89,
 * DEC-0174 §1–2).
 *
 * Until this change paths 2 and 3 on `/mitmachen` opened on an empty grey
 * `media-frame` and their registration graphic carried a hatched screenshot
 * slot; the WhatsApp chat carried a white header bar. None of that may ship:
 *
 * - no stage graphic, nor anything in it, carries `data-placeholder` — except
 *   the calendar state's marked sample rows (`sample-events`, DEC-0115), which
 *   are data honestly labelled, not an empty panel;
 * - no stage graphic is a `media-frame` without an image (`data-stage="image"`
 *   with no `img`), none paints a hatch (a `repeating-linear-gradient`), and
 *   none is empty;
 * - the chat graphic does not name the brand in a header.
 */

const ROUTES: readonly { route: RouteId; locale: Locale }[] = [
  { route: "home", locale: "de" },
  { route: "home", locale: "en" },
  { route: "takePart", locale: "de" },
  { route: "takePart", locale: "en" },
];

const VIEWPORTS = [
  { width: 390, height: 844 },
  { width: 1280, height: 800 },
] as const;

for (const { route, locale } of ROUTES) {
  const path = href(route, locale);
  for (const viewport of VIEWPORTS) {
    test(`TS-WEB-0022-A22: ${path} at ${viewport.width} px — every stage graphic drawn or photographed, none a placeholder`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport);
      await page.goto(path);
      // Not `networkidle`: `/` keeps live requests open on a slow upstream, and
      // the graphics are server-rendered — the calendar state's live rows are
      // the only part that loads later, and they carry no placeholder either way.
      const graphics = page.locator("[data-explain-module] [data-stage]");
      await expect(graphics.first()).toBeAttached();
      expect(await graphics.count(), `stage graphics on ${path}`).toBeGreaterThanOrEqual(3);

      const findings = await graphics.evaluateAll((elements, siteName) =>
        elements.flatMap((element) => {
          const stage = element.getAttribute("data-stage") ?? "";
          const problems: string[] = [];
          const marks = [element, ...element.querySelectorAll("[data-placeholder]")]
            .map((node) => node.getAttribute("data-placeholder"))
            .filter((mark): mark is string => mark !== null && mark !== "sample-events");
          if (marks.length) problems.push(`${stage}: data-placeholder ${marks.join(", ")}`);
          if (stage === "image" && !element.querySelector("img")) problems.push("image: a media-frame without an image");
          for (const node of [element, ...element.querySelectorAll("*")]) {
            if (getComputedStyle(node).backgroundImage.includes("repeating-linear-gradient")) {
              problems.push(`${stage}: a hatch`);
              break;
            }
          }
          if (!element.querySelector("svg, img, article, span, div")) problems.push(`${stage}: empty`);
          if (stage === "chat" && (element.textContent ?? "").includes(siteName)) {
            problems.push("chat: a header naming the brand");
          }
          return problems;
        }),
        dictionary(locale).siteName,
      );
      expect(findings, `placeholder stage graphics on ${path}`).toEqual([]);
    });
  }
}
