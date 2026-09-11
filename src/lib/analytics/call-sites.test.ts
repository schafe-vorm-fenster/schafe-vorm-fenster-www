import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { CONVERSION_EVENTS, wiredConversionEvents } from "@/src/lib/analytics/event-registry";

/**
 * TS-012-A2 — "every conversion goal that the website can complete emits its
 * event, exactly once per completed trigger", read as the half a static check
 * can answer: **a wired goal has a call site, and no call site names a goal
 * the registry does not wire.**
 *
 * The registry alone could not answer it: before M4 it claimed `wired: true`
 * for five goals while only three had a call site anywhere in `app/`
 * (`state/open.md` row 130 recorded exactly that gap for the three that did).
 * This test is what makes the claim checkable.
 *
 * It reads the route tree rather than importing it: a call site is a JSX
 * attribute (`goalId="…"`) or a binding object (`goalId: "…"`), and both are
 * text. The alternative — rendering all twelve pages — needs a request scope
 * these units do not have.
 */

const APP_DIR = join(process.cwd(), "app");
const GOAL_ID = /goalId[=:]\s*"([a-z-]+)"/g;

function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(full);
    return entry.isFile() && /\.tsx?$/.test(entry.name) && !entry.name.includes(".test.")
      ? [full]
      : [];
  });
}

function goalIdsInAppTree(): Map<string, string[]> {
  const found = new Map<string, string[]>();
  for (const file of sourceFiles(APP_DIR)) {
    const source = readFileSync(file, "utf-8");
    for (const match of source.matchAll(GOAL_ID)) {
      const goalId = match[1]!;
      found.set(goalId, [...(found.get(goalId) ?? []), file.slice(process.cwd().length + 1)]);
    }
  }
  return found;
}

describe("TS-012-A2: every wired conversion goal has a call site", () => {
  const callSites = goalIdsInAppTree();

  for (const event of wiredConversionEvents()) {
    it(`${event.goalId} fires from ${event.surface === "app" ? "the app" : event.surface.join(", ")}`, () => {
      expect(
        callSites.get(event.goalId) ?? [],
        `${event.goalId} is wired in the registry but no call site names it`,
      ).not.toHaveLength(0);
    });
  }

  it("wires all five website-completable goals and no more", () => {
    expect(wiredConversionEvents().map((event) => event.goalId).sort()).toEqual([
      "buy-calendar-licence",
      "register-as-publisher",
      "request-licence-quote",
      "request-product-briefing",
      "save-calendar-to-homescreen",
    ]);
  });

  it("names no goal the registry does not know", () => {
    const known = new Set(CONVERSION_EVENTS.map((event) => event.goalId));
    const unknown = [...callSites.keys()].filter((goalId) => !known.has(goalId));
    expect(unknown).toEqual([]);
  });

  it("fires no goal the registry marks unwired", () => {
    const unwired = CONVERSION_EVENTS.filter((event) => !event.wired).map((e) => e.goalId);
    const fired = unwired.filter((goalId) => callSites.has(goalId));
    expect(fired, "an unwired goal has a call site — registry and tree disagree").toEqual([]);
  });
});
