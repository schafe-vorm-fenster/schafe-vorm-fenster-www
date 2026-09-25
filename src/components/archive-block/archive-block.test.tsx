import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ArchiveBlock, ARCHIVE_GLYPHS, archiveGlyph } from "./archive-block";

const ITEMS = [
  { core: "Flyer enden an der Ortsgrenze.", detail: "Und oft werden sie gar nicht verteilt." },
  { core: "Die Zeitung hat Redaktionsschluss.", detail: "Ein verschobener Termin kommt zu spät." },
  { core: "Eigene Kanäle erreichen, wer euch kennt.", detail: "Wer euch nicht kennt, erfährt nichts." },
];

describe("SRC-0014 §Archive block: neutral icons, no wells, problem content only (DEC-0117)", () => {
  const html = renderToStaticMarkup(
    <ArchiveBlock closing="Und wer das organisiert, hat keine Zeit fürs Bewerben." items={ITEMS} kicker="Die üblichen Wege" />,
  );

  it("renders the guide's three glyphs in its order — megaphone, clock, users — and never circle-x", () => {
    expect(ARCHIVE_GLYPHS).toEqual(["megaphone", "clock", "users"]);
    const order = ["lucide-megaphone", "lucide-clock", "lucide-users"].map((cls) => html.indexOf(cls));
    expect(order.every((position) => position >= 0)).toBe(true);
    expect([...order].sort((a, b) => a - b)).toEqual(order);
    expect(html).not.toContain("lucide-circle-x");
  });

  it("takes the row's own glyph where the content names one, and wraps past the third row", () => {
    expect(archiveGlyph({ core: "x", detail: "y", icon: "globe" }, 0)).toBe("globe");
    expect(archiveGlyph({ core: "x", detail: "y" }, 3)).toBe("megaphone");
  });

  it("is a real list with the kicker above and the closing sentence below", () => {
    expect(html.match(/<li/g)).toHaveLength(3);
    expect(html.indexOf("Die üblichen Wege")).toBeLessThan(html.indexOf("<ul"));
    expect(html.indexOf("</ul>")).toBeLessThan(html.indexOf("Und wer das organisiert"));
  });

  it("carries the failure in text, with the icons decorative", () => {
    for (const item of ITEMS) {
      expect(html).toContain(item.core);
      expect(html).toContain(item.detail);
    }
    expect(html.match(/aria-hidden="true"/g)).toHaveLength(3);
  });

  it("inherits the section ground by default and paints its own only when asked", () => {
    expect(html).toContain('data-archive-block="inherit"');
    expect(renderToStaticMarkup(<ArchiveBlock ground="own" items={ITEMS} />)).toContain(
      'data-archive-block="own"',
    );
  });

  it("renders neither kicker nor closing when the copy has none", () => {
    const bare = renderToStaticMarkup(<ArchiveBlock items={ITEMS} />);
    // `<p ` and `<p>` only — an svg `<path` is not a paragraph.
    expect(bare.match(/<p[\s>]/g)).toHaveLength(6);
  });
});
