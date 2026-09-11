import { describe, expect, it, vi } from "vitest";

import {
  contentEnvironment,
  PREVIEW_STATUSES,
  PRODUCTION_STATUSES,
  renderableStatuses,
  rendersIn,
} from "@/src/lib/content/lifecycle";

describe("TS-007 D11 / A14: which status renders in which build", () => {
  it("lets a production build contain approved content only", () => {
    expect(rendersIn("approved", "production")).toBe(true);
    expect(rendersIn("draft", "production")).toBe(false);
    expect(rendersIn("in-review", "production")).toBe(false);
  });

  it("renders draft and in-review on preview, so review happens on the page", () => {
    for (const status of ["draft", "in-review", "approved"] as const)
      expect(rendersIn(status, "preview"), status).toBe(true);
  });

  it("treats a local build like preview — the prototype is reviewed there", () => {
    expect(renderableStatuses("development")).toEqual(PREVIEW_STATUSES);
  });

  it("keeps `imported` in every build — it is the legal family's status, never generated", () => {
    expect(PRODUCTION_STATUSES).toContain("imported");
    expect(rendersIn("imported", "production")).toBe(true);
  });

  it("keys the build on VERCEL_ENV, not on NODE_ENV", () => {
    expect(contentEnvironment({ VERCEL_ENV: "production" })).toBe("production");
    expect(contentEnvironment({ VERCEL_ENV: "preview" })).toBe("preview");
    expect(contentEnvironment({ NODE_ENV: "production" })).toBe("development");
    expect(contentEnvironment({})).toBe("development");
  });

  it("reads the ambient environment when none is given", () => {
    vi.stubEnv("VERCEL_ENV", "production");
    expect(contentEnvironment()).toBe("production");
    vi.unstubAllEnvs();
  });
});
