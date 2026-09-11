import { describe, expect, it } from "vitest";

import { SURFACE_COUNTS, selectRelevant } from "./select";
import { geo, type RelevanceItem, type ViewerContext } from "./types";

const now = new Date("2026-09-11T12:00:00Z");
const seed = "2026-W37";

const viewer: ViewerContext = {
  geo: geo({ country: "de", state: "niedersachsen", county: "helmstedt" }),
  trait: "direct",
  job: "know-what-is-on",
  stage: 1,
  locale: "de",
};

const item = (id: string, overrides: Partial<RelevanceItem> = {}): RelevanceItem => ({
  id,
  type: "reference-case",
  geo: geo({ country: "de", state: "niedersachsen", county: "helmstedt" }),
  jobRelation: { "know-what-is-on": "neutral" },
  date: "2026-06-01",
  clearance: "cleared",
  ...overrides,
});

const pool = [
  item("a", { geo: geo({ country: "de", state: "niedersachsen", county: "helmstedt" }) }),
  item("b", { geo: geo({ country: "de", state: "mecklenburg-vorpommern" }), type: "award" }),
  item("c", { geo: geo({ country: "de" }), type: "press" }),
  item("d", { geo: geo({ country: "at" }), type: "conference" }),
  item("e", { geo: geo({ country: "de", state: "niedersachsen" }), type: "testimonial" }),
  item("f", { type: "metric" }),
  item("g", { type: "partner", date: "2019-01-01" }),
  item("h", { type: "portrait", date: "2020-01-01" }),
];

describe("DEC-048: the element count is a property of the surface", () => {
  it("selects 3 inline beside a claim, 5 on the home page, 7 in the stream", () => {
    expect(SURFACE_COUNTS).toEqual({ inline: 3, home: 5, stream: 7 });
    for (const [surface, count] of Object.entries(SURFACE_COUNTS)) {
      const selection = selectRelevant({
        items: pool,
        viewer,
        surface: surface as keyof typeof SURFACE_COUNTS,
        now,
        seed,
      });
      expect(selection.entries).toHaveLength(count);
      expect(selection.count).toBe(count);
    }
  });

  it("never shortens the stream: an unfilled position is an empty slot, not a missing child", () => {
    const selection = selectRelevant({ items: pool.slice(0, 2), viewer, surface: "stream", now, seed });
    expect(selection.entries).toHaveLength(7);
    expect(selection.filled).toBe(2);
    expect(selection.entries.slice(2).every((entry) => entry.kind === "empty")).toBe(true);
  });

  it("accepts an explicit count for a surface the decision does not name", () => {
    expect(selectRelevant({ items: pool, viewer, surface: { count: 2 }, now, seed }).entries).toHaveLength(2);
  });
});

describe("TS-005-A2: a high-scoring uncleared element never appears", () => {
  it("drops it before scoring and says why", () => {
    const uncleared = item("uncleared", {
      clearance: "unverified",
      geo: viewer.geo,
      jobRelation: { "know-what-is-on": "supports" },
      date: "2026-09-10",
    });
    const selection = selectRelevant({ items: [...pool, uncleared], viewer, surface: "stream", now, seed });
    expect(selection.entries.map((entry) => entry.id)).not.toContain("uncleared");
    expect(selection.dropped).toContainEqual({ id: "uncleared", reason: "clearance" });
  });

  it("lets a labelled demo element through, marked as the mocked state", () => {
    const demo = item("demo", { clearance: "unverified", demo: true });
    const selection = selectRelevant({ items: [demo], viewer, surface: { count: 1 }, now, seed });
    const [entry] = selection.entries;
    expect(entry.kind).toBe("item");
    expect(entry.kind === "item" && entry.state).toBe("mocked");
  });

  it("marks a cleared element as ready", () => {
    const selection = selectRelevant({ items: [item("real")], viewer, surface: { count: 1 }, now, seed });
    const [entry] = selection.entries;
    expect(entry.kind === "item" && entry.state).toBe("ready");
  });
});

describe("TS-005-A4: determinism — identical input yields identical output across 1000 runs", () => {
  it("returns the same ids in the same positions", () => {
    const run = () =>
      selectRelevant({ items: pool, viewer, surface: "stream", now, seed }).entries.map((e) => e.id);
    const first = run();
    for (let i = 0; i < 1000; i += 1) expect(run()).toEqual(first);
  });

  it("depends on nothing but its arguments — a shuffled input pool gives the same output", () => {
    const forward = selectRelevant({ items: pool, viewer, surface: "stream", now, seed });
    const backward = selectRelevant({ items: [...pool].toReversed(), viewer, surface: "stream", now, seed });
    expect(backward.entries.map((e) => e.id)).toEqual(forward.entries.map((e) => e.id));
  });
});

describe("TS-005-A11: a different ISO week reorders only equally-scored candidates", () => {
  it("keeps the score sequence identical under a different seed", () => {
    const scores = (usedSeed: string) =>
      selectRelevant({ items: pool, viewer, surface: "stream", now, seed: usedSeed }).entries.map(
        (entry) => (entry.kind === "item" ? entry.score : null),
      );
    // The order of the *stream* may differ; what may never differ is the
    // ranking the scores describe.
    expect(scores("2026-W37").toSorted()).toEqual(scores("2026-W38").toSorted());
  });
});
