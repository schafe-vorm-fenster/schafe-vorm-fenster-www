import { readdirSync } from "node:fs";

import { describe, expect, it } from "vitest";

import {
  AUDIENCE_IDS,
  CONVERSION_GOAL_IDS,
  JOB_IDS,
  JOB_REGISTRY,
  checkPageMeta,
  jobLabelKey,
  jobRoute,
} from "@/src/lib/pages/page-meta";
import { HEADER_JOBS } from "@/src/lib/routes/navigation";

import type { PageMeta } from "@/src/lib/pages/page-meta";

/**
 * The vocabulary half of TS-006-A1: "conversion IDs resolve against the
 * `go-to-market-os` conversion goals; `audiences` non-empty and ordered".
 *
 * The ids are a union in `page-meta.ts` rather than an import, because both
 * packages are devDependencies and a rendered page may not pull them into
 * the request path (state/open.md #54). This test is where the two are
 * compared, because here the packages *are* available — so a hub release
 * that renames a goal fails the gate instead of silently passing a string
 * nothing resolves.
 */

function idsOf(dir: string, suffix: string): string[] {
  return readdirSync(`node_modules/@schafe-vorm-fenster/${dir}`)
    .filter((file) => file.endsWith(suffix))
    .map((file) => file.slice(0, -suffix.length))
    .sort();
}

describe("TS-006-A1: the manifest vocabulary resolves against the hub packages", () => {
  it("knows exactly the conversion goals the goals package ships", () => {
    expect([...CONVERSION_GOAL_IDS].sort()).toEqual(
      idsOf("goals/conversion-goals", ".conversion-goal.md"),
    );
  });

  it("knows exactly the audiences the audiences package ships", () => {
    expect([...AUDIENCE_IDS].sort()).toEqual(idsOf("audiences", ".audience.md"));
  });

  it("maps the four job ids onto the one job registry, one to one", () => {
    expect(JOB_IDS).toHaveLength(4);
    expect(JOB_IDS.map((job) => JOB_REGISTRY[job])).toEqual([...HEADER_JOBS]);
    expect(jobRoute("know-what-is-on")).toBe("place");
    expect(jobLabelKey("publish-our-dates")).toBe("publishDates");
  });
});

describe("TS-006-A1: `checkPageMeta` refuses a manifest the rule forbids", () => {
  const valid: PageMeta = {
    route: "home",
    focusJob: "know-what-is-on",
    primaryConversion: "save-calendar-to-homescreen",
    audiences: ["rural-residents"],
    liveModules: [{ id: "place-search", emptyState: "the field alone" }],
    proofSlots: [],
  };

  it("accepts a complete manifest", () => {
    expect(checkPageMeta(valid)).toEqual([]);
  });

  it("rejects an empty audience list, a module without an empty state and an unknown goal", () => {
    expect(checkPageMeta({ ...valid, audiences: [] })).toContain("audiences is empty");
    expect(
      checkPageMeta({ ...valid, liveModules: [{ id: "place-search", emptyState: " " }] }),
    ).toEqual(['live module "place-search" declares no empty state']);
    expect(
      checkPageMeta({
        ...valid,
        // The manifest type refuses this at compile time; the predicate is
        // what a hub rename would trip over at run time.
        primaryConversion: "save-calendar" as never,
      }),
    ).toHaveLength(1);
  });

  it("accepts `primaryConversion: null` — the pages that carry no goal of their own", () => {
    expect(checkPageMeta({ ...valid, primaryConversion: null })).toEqual([]);
  });
});
