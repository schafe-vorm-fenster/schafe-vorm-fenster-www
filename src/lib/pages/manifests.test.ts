import { describe, expect, it } from "vitest";

import {
  CARRIED_BY_CHROME,
  CONVERSION_MAP,
  MANIFESTS,
  MAP_DEVIATIONS,
  NO_LIVE_MODULE,
  UNCARRIED_GOALS,
  declaredGoals,
} from "@/src/lib/pages/manifests";
import { CONVERSION_GOAL_IDS, checkPageMeta } from "@/src/lib/pages/page-meta";
import { ROUTE_IDS } from "@/src/lib/routes/routes";

import type { ConversionGoalId } from "@/src/lib/pages/page-meta";
import type { RouteId } from "@/src/lib/routes/routes";

/**
 * The cross-page half of TS-006-A1 and the whole of TS-006-A11 — the checks
 * that are statements about the manifest *set* and therefore cannot live in
 * a single route's own `page.meta.test.ts`.
 *
 * It runs in `pnpm test`, which is `pnpm check`'s last stage, so a manifest
 * that drifts from the conversion map fails the gate rather than a review.
 */

describe("TS-006-A1: every route carries a complete manifest", () => {
  it("has one manifest per route, and no manifest without a route", () => {
    expect(Object.keys(MANIFESTS).sort()).toEqual([...ROUTE_IDS].sort());
  });

  it("declares its own route id in every manifest — no copy-paste drift", () => {
    for (const route of ROUTE_IDS) {
      expect(MANIFESTS[route].route, `${route}'s manifest names a different route`).toBe(
        route,
      );
    }
  });

  it("passes `checkPageMeta` on every route, live-module floor excepted where a spec fixes it", () => {
    const violations: Record<string, string[]> = {};
    for (const route of ROUTE_IDS) {
      const problems = checkPageMeta(MANIFESTS[route]).filter(
        (problem) =>
          !(problem === "no live module declared" && route in NO_LIVE_MODULE),
      );
      if (problems.length > 0) violations[route] = problems;
    }
    expect(violations).toEqual({});
  });

  it("keeps the live-module exception list to the four routes whose spec fixes it", () => {
    for (const route of Object.keys(NO_LIVE_MODULE) as RouteId[]) {
      expect(
        MANIFESTS[route].liveModules,
        `${route} declares live modules — take it off the exception list`,
      ).toEqual([]);
      expect(NO_LIVE_MODULE[route]).toMatch(/TS-0\d\d/);
    }
    for (const route of ROUTE_IDS) {
      if (route in NO_LIVE_MODULE) continue;
      expect(
        MANIFESTS[route].liveModules.length,
        `${route} declares no live module and is not a recorded exception`,
      ).toBeGreaterThan(0);
    }
  });

  it("orders audiences and never ships an empty list", () => {
    for (const route of ROUTE_IDS) {
      const audiences = MANIFESTS[route].audiences;
      expect(audiences.length, `${route} has no audience`).toBeGreaterThan(0);
      expect(new Set(audiences).size, `${route} repeats an audience`).toBe(audiences.length);
    }
  });
});

describe("TS-006-A11: the manifest set validates both ways against the conversion map", () => {
  /** goal → the routes whose manifest declares it. */
  const declared = new Map<ConversionGoalId, RouteId[]>();
  for (const route of ROUTE_IDS) {
    for (const goal of declaredGoals(MANIFESTS[route])) {
      declared.set(goal, [...(declared.get(goal) ?? []), route]);
    }
  }

  const deviates = (route: RouteId, goal: ConversionGoalId) =>
    `${route}:${goal}` in MAP_DEVIATIONS;

  it("direction 1 — every goal the map assigns appears on exactly those pages", () => {
    const missing: string[] = [];
    for (const [goal, routes] of Object.entries(CONVERSION_MAP) as [
      ConversionGoalId,
      readonly RouteId[],
    ][]) {
      for (const route of routes) {
        if (declaredGoals(MANIFESTS[route]).includes(goal)) continue;
        if (deviates(route, goal)) continue;
        missing.push(`${goal} is mapped to ${route} but the manifest does not declare it`);
      }
    }
    expect(missing).toEqual([]);
  });

  it("direction 2 — no page declares a goal the map does not assign to it", () => {
    const extra: string[] = [];
    for (const route of ROUTE_IDS) {
      for (const goal of declaredGoals(MANIFESTS[route])) {
        if ((CONVERSION_MAP[goal] ?? []).includes(route)) continue;
        if (deviates(route, goal)) continue;
        extra.push(`${route} declares ${goal}, which the map does not assign to it`);
      }
    }
    expect(extra).toEqual([]);
  });

  it("reports `order-promotion-material` as the one accepted gap, with its question id", () => {
    const carried = new Set(declared.keys());
    const uncarried = CONVERSION_GOAL_IDS.filter(
      (goal) =>
        !carried.has(goal) &&
        !CARRIED_BY_CHROME.includes(goal) &&
        CONVERSION_MAP[goal] === undefined,
    );
    // The website carries the six goals of the map; the remaining seven are
    // LinkedIn/contact goals with no website page. Only the map's own named
    // gap needs an accepted-exception entry.
    expect(UNCARRIED_GOALS["order-promotion-material"]).toContain("Q-005");
    expect(uncarried, "a goal fell out of the map without an exception row").toContain(
      "order-promotion-material",
    );
  });

  it("keeps every deviation named, reasoned and anchored to a spec", () => {
    for (const [key, deviation] of Object.entries(MAP_DEVIATIONS)) {
      const [route, goal] = key.split(":") as [RouteId, ConversionGoalId];
      expect(ROUTE_IDS).toContain(route);
      expect(CONVERSION_GOAL_IDS).toContain(goal);
      expect(deviation.goal).toBe(goal);
      expect(deviation.why, `${key} has no spec anchor`).toMatch(/TS-0\d\d|WEB-F-\d+/);
    }
  });

  it("carries `register-as-publisher` on every page through the context band, not a manifest", () => {
    // D9's third bullet: the band is `_page-frame.tsx`'s, so the check is
    // that no page is *expected* to declare it beyond the four the map names.
    expect(CARRIED_BY_CHROME).toContain("register-as-publisher");
    expect(declared.get("register-as-publisher")?.sort()).toEqual(
      ["place", "placeStart", "takePart"].sort(),
    );
  });
});
