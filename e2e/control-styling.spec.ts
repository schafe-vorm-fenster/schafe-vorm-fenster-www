import { expect, test } from "@playwright/test";

import { everyRoute, href } from "../src/lib/routes/routes";

/**
 * TS-WEB-0002-A14 · DEC-0172 §5 — **nothing looks like a button that is not a
 * control.** SRC-0014 §Shape and Space: "the only soft shape in the whole
 * system is the thing you can touch". The owner's review of 2026-10-27 (#96)
 * found the opposite on `/dein-kalender`: three white pills and one black
 * pill in the benefit band, button-sized, none of them a control.
 *
 * Measured, on every route in both languages, at the phone width where every
 * layout is authored: an element in `#main` that is
 *
 * - **pill-shaped** — its corner radius is at least half its height,
 * - **wider than round** — at least 1.5 × as wide as tall, so a 40 px icon
 *   well or an initials disc (decoration by SRC-0014 §Wells) is not a pill,
 * - **control-sized** — styled at least 36 px tall, the floor between the
 *   28–32 px badge and tag (non-interactive by definition, SRC-0014 §Badge
 *   and chip) and the 40 px chip, 44 px control well and 56 px button. The
 *   height is the one the element's own styles give a single line — line
 *   height, padding, border, or its `min-height` — not the rendered box, so a
 *   30 px tag a flex row stretches is still a tag (CI measured one at 42 px
 *   on `/en/take-part`),
 * - and **drawn** — a fill, or a border of 2 px or more (the outlined
 *   secondary of DEC-0160),
 *
 * must be a control, sit inside one, or hold one: a link, a button, a
 * summary, a form field, a label, or an element with an interactive role.
 *
 * One exemption, and it is not a loophole: a **picture of a control** inside
 * an `aria-hidden` illustration — the explain module's drawn form on
 * `/mitmachen` (an address field and a submit pill on a drawn screen). It is
 * a drawing of an interface the reader will meet elsewhere, announced as
 * nothing and framed as a picture (`explain-stage`, DEC-0115).
 */

const ROUTES = everyRoute().map(({ route, locale }) => ({
  path: href(route, locale),
  name: `${route} (${locale})`,
}));

for (const { path, name } of ROUTES) {
  test(`TS-WEB-0002-A14 / DEC-0172 §5: no element styled as a button without being a control — ${name}`, async ({
    page,
  }) => {
    test.setTimeout(120_000);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(path, { waitUntil: "networkidle", timeout: 90_000 });
    await expect(page.locator("#main")).toBeAttached();

    const fakes: string[] = await page.evaluate(() => {
      const CONTROL =
        'a[href], button, summary, input, select, textarea, label, [role="button"], [role="link"], [role="tab"], [role="radio"], [role="switch"], [role="combobox"], [role="option"]';
      const main = document.querySelector("#main");
      if (!main) return ["#main missing"];
      const out: string[] = [];
      for (const element of main.querySelectorAll<HTMLElement>("*")) {
        const box = element.getBoundingClientRect();
        if (box.height < 36 || box.width < box.height * 1.5) continue;
        if (!element.checkVisibility({ visibilityProperty: true, opacityProperty: true })) continue;
        const style = getComputedStyle(element);
        const fontSize = parseFloat(style.fontSize);
        const lineHeight = parseFloat(style.lineHeight) || fontSize * 1.2;
        const designed = Math.max(
          parseFloat(style.minHeight) || 0,
          lineHeight +
            parseFloat(style.paddingTop) +
            parseFloat(style.paddingBottom) +
            parseFloat(style.borderTopWidth) +
            parseFloat(style.borderBottomWidth),
        );
        if (designed < 36) continue;
        const radius = Math.min(
          parseFloat(style.borderTopLeftRadius),
          parseFloat(style.borderBottomRightRadius),
        );
        if (!(radius >= box.height / 2 - 1)) continue;
        const filled = !/rgba\(0, 0, 0, 0\)|transparent/.test(style.backgroundColor);
        const outlined = parseFloat(style.borderTopWidth) >= 2 && style.borderTopStyle !== "none";
        if (!filled && !outlined) continue;
        if (element.closest(CONTROL) || element.querySelector(CONTROL)) continue;
        if (element.closest('[aria-hidden="true"]')) continue;
        out.push(
          `${element.tagName.toLowerCase()}.${element.className} "${(element.textContent ?? "").trim().slice(0, 40)}" ${Math.round(box.width)}×${Math.round(box.height)}`,
        );
      }
      return out;
    });

    expect(fakes, fakes.join("\n")).toEqual([]);
  });
}
