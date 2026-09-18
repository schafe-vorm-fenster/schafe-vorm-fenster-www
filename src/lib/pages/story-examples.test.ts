import { describe, expect, it } from "vitest";

import { pickStoryExamples } from "./story-examples";

import type { EventListItem } from "@/src/components/event-list/event-list";

const row = (id: string, category: EventListItem["category"]): EventListItem => ({
  id,
  date: "2026-09-21T10:00:00.000Z",
  title: id,
  category,
  categoryLabel: category,
});

describe("pickStoryExamples", () => {
  it("gives each story the first row of the category it is about", () => {
    const pool = [row("a", "social"), row("b", "merchants"), row("c", "culture")];

    expect(
      pickStoryExamples(pool, [["merchants"], ["social"], ["culture"]]).map(
        (item) => item?.id,
      ),
    ).toEqual(["b", "a", "c"]);
  });

  it("never hands the same row to two stories", () => {
    const pool = [row("a", "culture"), row("b", "culture")];

    expect(
      pickStoryExamples(pool, [["culture"], ["culture"]]).map((item) => item?.id),
    ).toEqual(["a", "b"]);
  });

  it("falls back to any unused row rather than leaving a story without an example", () => {
    const pool = [row("a", "neighbouring")];

    expect(
      pickStoryExamples(pool, [["merchants"], ["culture"]]).map((item) => item?.id),
    ).toEqual(["a", undefined]);
  });

  it("walks the preference order before falling back", () => {
    const pool = [row("a", "neighbouring"), row("b", "official")];

    expect(
      pickStoryExamples(pool, [["culture", "official"]]).map((item) => item?.id),
    ).toEqual(["b"]);
  });

  it("answers an empty pool with one undefined per story", () => {
    expect(pickStoryExamples([], [["culture"], ["social"]])).toEqual([undefined, undefined]);
  });
});
