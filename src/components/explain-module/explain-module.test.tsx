import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ExplainModule, type ExplainModuleCta, type ExplainModuleProps } from "./explain-module";

/**
 * The markup contract of `explain-module` — what the server renders, which
 * is also what a JavaScript-less load shows (TS-WEB-0022-A5 structure,
 * TS-WEB-0019-A6 module part, TS-WEB-0019-A11). The behaviour of the pass
 * is `explain-advance.test.ts`; the browser facts are
 * `e2e/explain-module.spec.ts`.
 *
 * The strings below are fixtures, not copy: they never reach a page.
 */

const STEPS: ExplainModuleProps["steps"] = [
  { core: "Core one", detail: "Detail one." },
  { core: "Core two", detail: "Detail two." },
  { core: "Core three", detail: "Detail three." },
];

const STAGE: ExplainModuleProps["stage"] = [
  <span data-fixture-state="1" key="1" />,
  <span data-fixture-state="2" key="2" />,
  <span data-fixture-state="3" key="3" />,
];

function render(overrides: Partial<ExplainModuleProps> = {}): string {
  return renderToStaticMarkup(
    <ExplainModule
      cta={{ label: "Onward", to: "register" }}
      mechanism="whatsapp"
      ordinal={1}
      stage={STAGE}
      steps={STEPS}
      title="Title"
      {...overrides}
    />,
  );
}

const count = (html: string, needle: string): number => html.split(needle).length - 1;

describe("TS-WEB-0022 D4 — the fixed render form", () => {
  const html = render();

  it("renders one zero-padded mono ordinal with the title beside it", () => {
    expect(count(html, "data-explain-ordinal")).toBe(1);
    expect(html).toContain(">01<");
    expect(html).toContain("<h3");
    expect(html).toContain(">Title</h3>");
  });

  it("renders exactly three step lines, each a real button with a disc, a core and a detail", () => {
    expect(count(html, "data-explain-step=")).toBe(3);
    expect(count(html, '<button aria-current="step"')).toBe(1);
    expect(count(html, 'type="button"')).toBeGreaterThanOrEqual(3);
    for (const step of STEPS) {
      expect(html).toContain(`>${step.core}</span>`);
      expect(html).toContain(`>${step.detail}</span>`);
    }
    // An ordered list, so the count is machine-readable and the order is semantic.
    expect(count(html, "<li")).toBe(3);
  });

  it("renders one stage holding the three states in order", () => {
    expect(count(html, "data-explain-stage")).toBe(1);
    expect(html.indexOf('data-explain-pane="1"')).toBeLessThan(html.indexOf('data-explain-pane="2"'));
    expect(html.indexOf('data-explain-pane="2"')).toBeLessThan(html.indexOf('data-explain-pane="3"'));
    for (const state of [1, 2, 3]) expect(html).toContain(`data-fixture-state="${state}"`);
  });

  it("stage · step lines · CTA, in that DOM order, below the header", () => {
    const stage = html.indexOf("data-explain-stage");
    const steps = html.indexOf("<ol");
    const cta = html.indexOf("data-explain-cta");
    expect(html.indexOf("data-explain-ordinal")).toBeLessThan(stage);
    expect(stage).toBeLessThan(steps);
    expect(steps).toBeLessThan(cta);
  });

  it("carries the mechanism, so a page can count its blocks", () => {
    expect(html).toContain('data-mechanism="whatsapp"');
    expect(render({ mechanism: "website-import" })).toContain('data-mechanism="website-import"');
  });

  it("takes the heading level from the page — h3 by default, h2 where it is the block", () => {
    expect(render({ headingLevel: 2 })).toContain(">Title</h2>");
  });
});

describe("DEC-0105 §6 — server-rendered at state 1, armed", () => {
  const html = render();

  it("shows state 1 with aria-current on the first step line only", () => {
    expect(html).toContain('data-state="1"');
    expect(html).toContain('data-target="1"');
    expect(html).toContain('data-advance="armed"');
    expect(html).toMatch(/<button aria-current="step"[^>]*data-explain-step="1"/);
    expect(html).not.toMatch(/<button aria-current="step"[^>]*data-explain-step="[23]"/);
    expect(html).toMatch(/data-active="true" data-explain-pane="1"/);
  });

  it("renders no inline script and nothing that depends on JavaScript to be readable", () => {
    expect(html).not.toContain("<script");
    // No `hidden` attribute anywhere: the three states and three lines are all in the HTML.
    expect(html).not.toMatch(/\shidden(=|\s|>)/);
  });
});

describe("one CTA, secondary by construction", () => {
  it('renders exactly one data-cta, and it is "secondary"', () => {
    const html = render();
    expect(count(html, "data-cta=")).toBe(1);
    expect(html).toContain('data-cta="secondary"');
    expect(html).not.toContain('data-cta="primary"');
  });

  it("goes through the route facade for a route id and renders a plain link for a handover", () => {
    expect(render({ cta: { label: "Onward", to: "register", locale: "en" } })).toMatch(/href="\/en\/[^"]+"/);
    expect(render({ cta: { href: "https://wa.me/491234567890", label: "Chat", newTab: true } })).toContain(
      'href="https://wa.me/491234567890"',
    );
  });

  it("rejects a primary rank at the type level", () => {
    // @ts-expect-error — `rank` admits nothing but "secondary" (TS-WEB-0022 D4 "One CTA").
    const primary: ExplainModuleCta = { label: "No", rank: "primary" };
    const secondary: ExplainModuleCta = { label: "Yes", rank: "secondary" };
    expect(primary.rank).not.toBe(secondary.rank);
  });

  it("rejects a fourth step and a fourth stage state at the type level", () => {
    // @ts-expect-error — exactly three step lines, not four.
    const four: ExplainModuleProps["steps"] = [...STEPS, { core: "Four", detail: "Four." }];
    // @ts-expect-error — exactly three states, not two.
    const two: ExplainModuleProps["stage"] = [STAGE[0], STAGE[1]];
    expect(four.length + two.length).toBe(6);
  });
});
