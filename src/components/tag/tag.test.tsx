import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { Tag } from "./tag";

describe("SRC-0014 §Badge and chip: the tag and its one state", () => {
  it("renders the label as text, with no state attribute by default", () => {
    const html = renderToStaticMarkup(<Tag>Stadtgebiet</Tag>);
    expect(html).toContain("Stadtgebiet");
    expect(html).not.toContain("data-excluded");
    expect(html).not.toMatch(/<s\b/);
  });

  it("marks the excluded state in markup — `data-excluded` and an `<s>` — never by colour alone", () => {
    const html = renderToStaticMarkup(<Tag excluded>Nachbarorte</Tag>);
    expect(html).toContain('data-excluded="true"');
    expect(html).toMatch(/<s\b[^>]*>Nachbarorte<\/s>/);
  });

  it("is a span, never a control — a tag names a value the reader cannot act on", () => {
    const html = renderToStaticMarkup(<Tag tone="surface">Kultur</Tag>);
    expect(html).toMatch(/^<span\b/);
    expect(html).not.toContain("<button");
    expect(html).not.toContain("<a ");
  });
});
