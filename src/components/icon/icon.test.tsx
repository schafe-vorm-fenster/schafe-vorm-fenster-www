import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { Icon, ICON_NAMES, ICON_SIZES } from "./icon";

describe("TS-002-A: icons are decorative, monochrome and one of three sizes", () => {
  it("renders every glyph of the design system's role table", () => {
    expect(ICON_NAMES.length).toBeGreaterThanOrEqual(37);
    for (const name of ICON_NAMES) {
      const html = renderToStaticMarkup(<Icon name={name} />);
      expect(html).toContain("<svg");
      expect(html).toContain('aria-hidden="true"');
    }
  });

  it("hides itself from assistive technology and takes no focus", () => {
    const html = renderToStaticMarkup(<Icon name="map-pin" />);
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain('focusable="false"');
  });

  it("offers 18, 24 and 32 only, and 24 by default", () => {
    expect(ICON_SIZES).toEqual([18, 24, 32]);
    expect(renderToStaticMarkup(<Icon name="clock" />)).toContain('width="24"');
    expect(renderToStaticMarkup(<Icon name="clock" size={18} />)).toContain('width="18"');
    expect(renderToStaticMarkup(<Icon name="clock" size={32} />)).toContain('width="32"');
  });

  it("strokes 2 px and inherits one colour", () => {
    const html = renderToStaticMarkup(<Icon name="calendar-days" />);
    expect(html).toContain('stroke-width="2"');
    expect(html).toContain('stroke="currentColor"');
    expect(html).toContain('fill="none"');
  });
});
