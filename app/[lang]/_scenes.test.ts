import { describe, expect, it } from "vitest";

import { HOME_SCENES, HOME_SCENE_ORDER, homeSceneOrder } from "./_scenes";
import { validateEmphasisTable } from "@/src/lib/personalization/emphasis";
import { ENTRY_TRAITS } from "@/src/lib/relevance/types";

/**
 * TS-WEB-0019 D3a's table, read back off the code that renders it. The e2e half
 * of `TS-WEB-0019-A7` walks two of the eight traits in a browser; this is the
 * other six, and the two invariants D3a states in words:
 * *"No trait adds, removes or rewrites a block"* and *"no trait changes which
 * mechanism carries the module"*.
 */
describe("TS-WEB-0019-A7: block 2a's order per entry trait (D3a)", () => {
  it("gives every trait of the table its row", () => {
    expect(homeSceneOrder("direct")).toEqual(["whatsapp", "embed", "provenance"]);
    expect(homeSceneOrder("social")).toEqual(["whatsapp", "embed", "provenance"]);
    expect(homeSceneOrder("print-qr")).toEqual(["whatsapp", "embed", "provenance"]);
    expect(homeSceneOrder("reader-search")).toEqual(["whatsapp", "embed", "provenance"]);
    expect(homeSceneOrder("activated")).toEqual(["whatsapp", "embed", "provenance"]);
    expect(homeSceneOrder("professional")).toEqual(["embed", "provenance", "whatsapp"]);
    expect(homeSceneOrder("purchase-intent")).toEqual(["embed", "provenance", "whatsapp"]);
    expect(homeSceneOrder("press")).toEqual(["provenance", "whatsapp", "embed"]);
  });

  it("puts the module-carrying scene first, last and middle — and nowhere else", () => {
    // The module travels with `whatsapp` (DEC-0109 §1), so its position is
    // that scene's position, and D3a has exactly these three.
    const positions = ENTRY_TRAITS.map((trait) => homeSceneOrder(trait).indexOf("whatsapp"));
    expect(positions.toSorted()).toEqual([0, 0, 0, 0, 0, 1, 2, 2]);
  });

  it("orders and nothing else: every trait's row is a permutation of the default", () => {
    expect(validateEmphasisTable(HOME_SCENES, HOME_SCENE_ORDER)).toEqual([]);
    for (const trait of ENTRY_TRAITS) {
      expect([...homeSceneOrder(trait)].toSorted(), trait).toEqual([...HOME_SCENES].toSorted());
    }
  });

  it("names only traits the shared constant knows", () => {
    for (const trait of Object.keys(HOME_SCENE_ORDER)) {
      expect(ENTRY_TRAITS).toContain(trait);
    }
  });
});
