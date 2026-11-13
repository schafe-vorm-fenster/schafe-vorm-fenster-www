import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { SceneBlock, type SceneBlockProps } from "./scene-block";

/**
 * The markup contract of `scene-block` — TS-WEB-0006 D7's three items, and
 * what DEC-0110 §1 added to them: a scene may render its **mechanism** as a
 * module, between the opener and the instance, without becoming the module
 * and without gaining a second CTA. The page facts are
 * `e2e/pages/home.spec.ts` (TS-WEB-0019-A6).
 *
 * The strings below are fixtures, not copy: they never reach a page.
 */

function render(overrides: Partial<SceneBlockProps> = {}): string {
  return renderToStaticMarkup(
    <SceneBlock
      instance={<span data-fixture="instance" />}
      mechanism="whatsapp"
      opener="Opener."
      {...overrides}
    />,
  );
}

describe("scene-block", () => {
  it("declares exactly one mechanism and carries the opener as its heading", () => {
    const html = render();
    expect(html).toContain('data-mechanism="whatsapp"');
    expect(html).toContain("<h2");
    expect(html).toContain("Opener.");
    expect(html.match(/data-mechanism=/g)).toHaveLength(1);
  });

  it("renders the module between the opener and the instance (DEC-0110 §1)", () => {
    const html = render({ module: <span data-fixture="module" /> });
    const opener = html.indexOf("Opener.");
    const mechanism = html.indexOf('data-fixture="module"');
    const instance = html.indexOf('data-fixture="instance"');
    expect(opener).toBeGreaterThanOrEqual(0);
    expect(mechanism).toBeGreaterThan(opener);
    expect(instance).toBeGreaterThan(mechanism);
  });

  it("adds no CTA of its own where the module carries one", () => {
    // "Wrapping does not double the CTA": the block's one CTA is whatever
    // the page puts in — either the scene's `cta` or the module's own, never
    // both, and this component invents neither.
    expect(render({ module: <span data-fixture="module" /> })).not.toContain("data-cta");
    expect(render({ cta: <span data-cta="secondary" /> })).toContain('data-cta="secondary"');
  });

  it("keeps the text in the page container and lets the instance bleed", () => {
    const html = render({ bleed: true, cta: <span data-cta="secondary" /> });
    // Opener, module slot and CTA take the container the uncontained section
    // gave up; the instance is the one part that does not.
    expect(html.match(/class="[^"]*container/g)?.length).toBe(2);
    const upToInstance = html.slice(0, html.indexOf('data-fixture="instance"'));
    const wrapper = upToInstance.slice(upToInstance.lastIndexOf("<div"));
    expect(wrapper).toContain("class=");
    expect(wrapper).not.toContain("container");
  });

  it("renders no container at all when the section contains it", () => {
    expect(render({ cta: <span data-cta="secondary" /> })).not.toContain("container");
  });
});
