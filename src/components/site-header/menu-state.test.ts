import { describe, expect, it } from "vitest";

import { headerIsSolid, isMenuOpen, nextMenuState } from "./menu-state";

import type { MenuEvent, MenuState } from "./menu-state";

const EVENTS: readonly MenuEvent[] = ["toggle", "escape", "navigate", "widen"];
const STATES: readonly MenuState[] = ["closed", "open"];

describe("site-header: the phone header's disclosure state (state/open.md row 201)", () => {
  it("starts closed and opens on the burger", () => {
    expect(nextMenuState("closed", "toggle")).toBe("open");
    expect(isMenuOpen("closed")).toBe(false);
    expect(isMenuOpen("open")).toBe(true);
  });

  it("closes again on the same control", () => {
    expect(nextMenuState("open", "toggle")).toBe("closed");
  });

  it("closes on Escape, and Escape on a closed menu changes nothing", () => {
    expect(nextMenuState("open", "escape")).toBe("closed");
    expect(nextMenuState("closed", "escape")).toBe("closed");
  });

  it("closes when a link inside it is followed", () => {
    // The dialog element survives an App Router client navigation, so
    // without this the overlay stands over the page it navigated to.
    expect(nextMenuState("open", "navigate")).toBe("closed");
  });

  it("closes when the viewport reaches the switch point the burger lives below", () => {
    // Above `md` the burger is not rendered; an open overlay would trap
    // focus in a disclosure with no visible control that opened it.
    expect(nextMenuState("open", "widen")).toBe("closed");
    expect(nextMenuState("closed", "widen")).toBe("closed");
  });

  it("is total: every state × event pair lands on a declared state", () => {
    for (const state of STATES) {
      for (const event of EVENTS) {
        expect(STATES).toContain(nextMenuState(state, event));
      }
    }
  });
});

describe("site-header: the header's ground over a hero photograph (state/open.md row 200)", () => {
  it("is solid on every page that does not open on a hero photograph", () => {
    expect(headerIsSolid(false, true)).toBe(true);
    expect(headerIsSolid(false, false)).toBe(true);
  });

  it("is transparent while the hero is still under it", () => {
    expect(headerIsSolid(true, true)).toBe(false);
  });

  it("turns solid once the hero has scrolled past", () => {
    expect(headerIsSolid(true, false)).toBe(true);
  });
});
