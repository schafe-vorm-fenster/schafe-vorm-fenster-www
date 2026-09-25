import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ObjectionList, REACH_GLYPHS, reachGlyph } from "./objection-list";

const ITEMS = [
  { channel: "Flyer enden an der Ortsgrenze.", failure: "Und oft werden sie gar nicht verteilt." },
  { channel: "Die Zeitung hat Redaktionsschluss.", failure: "Ein verschobener Termin kommt zu spät." },
  { channel: "Eigene Kanäle erreichen, wer euch kennt.", failure: "Wer euch nicht kennt, erfährt nichts." },
];

const REACH = [
  { detail: "Im selben Dorf, aber nicht im Verein.", title: "Die Nachbarn" },
  { detail: "Fünf Kilometer weiter.", title: "Das Nachbardorf" },
  { detail: "Gerade hergezogen.", title: "Die Neuen" },
];

describe("TS-WEB-0022 D3 / A6: one headline, n items, no numeral, a proof slot where the page asks (DEC-0117)", () => {
  it("renders the headline and the archive rows as a real list, and no circle-x anywhere", () => {
    const html = renderToStaticMarkup(<ObjectionList headline="Warum es hakt" items={ITEMS} proofSlot={false} />);
    expect(html).toContain("<h2");
    expect(html).toContain("Warum es hakt");
    expect(html.match(/<li/g)).toHaveLength(3);
    expect(html).not.toContain("lucide-circle-x");
    expect(html).toContain("lucide-megaphone");
    expect(html).toContain("lucide-clock");
    expect(html).toContain("lucide-users");
    expect(html).toContain('data-archive-block="own"');
  });

  it("renders the upper reach rows in the well order house · map-pin · users, above the archive half", () => {
    const html = renderToStaticMarkup(
      <ObjectionList archiveKicker="Die üblichen Wege" headline="Warum es hakt" items={ITEMS} proofSlot={false} reach={REACH} />,
    );
    expect(REACH_GLYPHS).toEqual(["house", "map-pin", "users"]);
    expect(reachGlyph({ detail: "d", icon: "globe", title: "t" }, 0)).toBe("globe");
    expect(reachGlyph({ detail: "d", title: "t" }, 4)).toBe("map-pin");
    expect(html.match(/<li/g)).toHaveLength(6);
    const reachAt = html.indexOf("data-objection-reach");
    const archiveAt = html.indexOf("data-archive-block");
    expect(reachAt).toBeGreaterThan(-1);
    expect(reachAt).toBeLessThan(archiveAt);
    expect(html.indexOf("lucide-house")).toBeLessThan(html.indexOf("lucide-map-pin"));
    expect(html.indexOf("Die üblichen Wege")).toBeGreaterThan(reachAt);
  });

  it("keeps the proof slot: visibly empty by default, a cleared proof where given, none where the page says so", () => {
    const empty = renderToStaticMarkup(<ObjectionList headline="H" items={ITEMS} />);
    expect(empty).toContain("data-empty-proof");
    const cleared = renderToStaticMarkup(<ObjectionList headline="H" items={ITEMS} proof={<p>Beleg</p>} />);
    expect(cleared).not.toContain("data-empty-proof");
    expect(cleared).toContain("<p>Beleg</p>");
    const none = renderToStaticMarkup(<ObjectionList headline="H" items={ITEMS} proofSlot={false} />);
    expect(none).not.toContain("data-empty-proof");
  });

  it("carries the closing sentence after the rows, inside the archive half", () => {
    const html = renderToStaticMarkup(
      <ObjectionList closing="Und keine Zeit fürs Bewerben." headline="H" items={ITEMS} proofSlot={false} />,
    );
    expect(html.indexOf("</ul>")).toBeLessThan(html.indexOf("Und keine Zeit fürs Bewerben."));
    expect(html.indexOf("data-archive-block")).toBeLessThan(html.indexOf("Und keine Zeit fürs Bewerben."));
  });
});
