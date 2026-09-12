import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ConversionTracker } from "./conversion-tracker";

/**
 * The server half of TS-012 D2/D9 and of F-2-71's hydration signal.
 *
 * The component had no unit test at all (differential review of this round's
 * diff), while carrying two contracts a page depends on: the CTA underneath
 * it is server-rendered and untouched — D9's "the navigation is never
 * delayed" starts with the link existing without JavaScript — and
 * `data-hydrated` is `"false"` in the server pass, which is what makes it a
 * signal rather than a decoration.
 */
describe("TS-012 D2: the CTA is server-rendered, the tracker only wraps it", () => {
  const markup = renderToStaticMarkup(
    <ConversionTracker goalId="save-calendar-to-homescreen" stage="handover">
      <a href="https://app.example.test/ort">Kalender öffnen</a>
    </ConversionTracker>,
  );

  it("renders the child anchor verbatim", () => {
    expect(markup).toContain('href="https://app.example.test/ort"');
    expect(markup).toContain("Kalender öffnen");
  });

  it("wraps it in a box that takes no space", () => {
    expect(markup).toContain("display:contents");
  });

  it("names the goal it is armed for", () => {
    expect(markup).toContain('data-conversion-tracker="save-calendar-to-homescreen"');
  });

  it("reports itself unhydrated on the server — the signal F-2-71 waits for", () => {
    expect(markup).toContain('data-hydrated="false"');
    expect(markup).not.toContain('data-hydrated="true"');
  });
});
