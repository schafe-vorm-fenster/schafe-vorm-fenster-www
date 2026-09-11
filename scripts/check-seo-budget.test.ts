import { describe, expect, it } from "vitest";

import {
  checkSeoBudget,
  DESCRIPTION_MAX,
  DESCRIPTION_MIN,
  TITLE_MAX,
} from "./check-seo-budget";

describe("TS-011-A7: the title and description budget", () => {
  it("passes every (path, language) pair the site has today", () => {
    const { errors, pagesChecked } = checkSeoBudget();
    expect(errors).toEqual([]);
    expect(pagesChecked).toBe(24);
  });

  it("states the budget the criterion writes", () => {
    expect(TITLE_MAX).toBe(60);
    expect(DESCRIPTION_MIN).toBe(120);
    expect(DESCRIPTION_MAX).toBe(158);
  });
});
