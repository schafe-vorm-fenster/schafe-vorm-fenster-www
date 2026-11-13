import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { CONVERSION_EVENTS, wiredConversionEvents } from "@/src/lib/analytics/event-registry";

/**
 * **A wired goal has a call site, and no call site names a goal the registry
 * does not wire** — the source-level half of the D4 trigger inventory of
 * TS-WEB-0012.
 *
 * ── Which criterion this is, and which it is not ──────────────────────────
 *
 * It is not A2 of TS-WEB-0012, although the `describe` below said so until
 * 2026-09-26. That criterion is `e2e` and it is about the *visitor's* state
 * after a journey — "`document.cookie` contains no analytics cookie, web
 * storage contains no analytics identifier, and no request goes to a host
 * outside the D7 collectors" — which a scan of source text cannot observe at
 * all. Its instrument is `e2e/privacy.spec.ts`, whose test titles name it, and
 * it was VERIFIED there independently; the title here claimed a second, false
 * instrument for it, and claimed coverage at the wrong level.
 *
 * The criterion this *is* the static half of is A5 of TS-WEB-0012 — "each
 * wired D4 trigger emits exactly one event with the correct goal ID and
 * `stage`" — and A5 is `e2e`, because "emits" is a browser fact. A source scan
 * cannot close it, so this file's titles carry no identifier: the ids are
 * spelled out in prose here exactly as `scripts/check-coverage.ts` spells out
 * its own, so that a docblock cannot be read as coverage (verdict NAMED ONLY,
 * which is what a mention in a comment earns).
 *
 * The registry alone could not answer it: before M4 it claimed `wired: true`
 * for five goals while only three had a call site anywhere in `app/`
 * (`state/open.md` row 130 recorded exactly that gap for the three that did).
 * This test is what makes the claim checkable.
 *
 * It reads the source trees rather than importing them: a call site is a JSX
 * attribute (`goalId="…"`) or a binding object (`goalId: "…"`), and both are
 * text. The alternative — rendering all twelve pages — needs a request scope
 * these units do not have.
 *
 * Two trees since DEC-0113: `app/` for the pages, and `src/components/` for
 * the one component that owns its goal ids by determination rather than by
 * page — the contact section, which the layout mounts on every route and
 * whose two goals on row 1 are `TS-WEB-0016 D13`'s, not the layout's. A
 * component that takes its binding as a prop (`howto-block`) names no id
 * and is invisible here, as before.
 */

const SCAN_DIRS = ["app", "src/components"].map((dir) => join(process.cwd(), dir));
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

function goalIdsInSourceTrees(): Map<string, string[]> {
  const found = new Map<string, string[]>();
  for (const dir of SCAN_DIRS) {
    for (const file of sourceFiles(dir)) {
      const source = readFileSync(file, "utf-8");
      for (const match of source.matchAll(GOAL_ID)) {
        const goalId = match[1]!;
        found.set(goalId, [...(found.get(goalId) ?? []), file.slice(process.cwd().length + 1)]);
      }
    }
  }
  return found;
}

function surfaceLabel(surface: (typeof CONVERSION_EVENTS)[number]["surface"]): string {
  if (surface === "app") return "the app";
  if (surface === "chrome") return "the contact section on every route";
  return surface.join(", ");
}

describe("every wired conversion goal has a call site in the source trees", () => {
  const callSites = goalIdsInSourceTrees();

  for (const event of wiredConversionEvents()) {
    it(`${event.goalId} fires from ${surfaceLabel(event.surface)}`, () => {
      expect(
        callSites.get(event.goalId) ?? [],
        `${event.goalId} is wired in the registry but no call site names it`,
      ).not.toHaveLength(0);
    });
  }

  it("wires all six website-completable goals and no more", () => {
    expect(wiredConversionEvents().map((event) => event.goalId).sort()).toEqual([
      "buy-calendar-licence",
      "make-contact",
      "register-as-publisher",
      "request-licence-quote",
      "request-product-briefing",
      "save-calendar-to-homescreen",
    ]);
  });

  it("make-contact has its call site in the contact section, not in a page (DEC-0081 §4)", () => {
    const sites = callSites.get("make-contact") ?? [];
    expect(sites.length).toBeGreaterThan(0);
    for (const site of sites) expect(site).toMatch(/^src\/components\/contact-section\//);
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
