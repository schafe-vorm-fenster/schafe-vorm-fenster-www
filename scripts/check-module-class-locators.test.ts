import { describe, expect, it } from "vitest";

import {
  checkModuleClassLocators,
  moduleClassSelectors,
  moduleNames,
  scanSources,
} from "./check-module-class-locators";

const names = moduleNames([
  { path: "src/components/price-tag/price-tag.module.css", css: ".root { color: red }" },
  { path: "src/components/chip/chip.module.css", css: ".chip { color: red }" },
  { path: "src/components/x/x.module.css", css: ".kicker {}" },
]);

describe("check-module-class-locators (#213)", () => {
  it("fails on a reintroduced module file name selector", () => {
    expect(moduleClassSelectors(`page.locator('[class*="price-tag"]')`, names)).toEqual(["price-tag"]);
    expect(moduleClassSelectors(`q("article[class*='price-tag']")`, names)).toEqual(["price-tag"]);
    expect(scanSources([{ path: "e2e/a.spec.ts", text: "a\nb [class^=price-tag] c" }], names)).toEqual([
      { file: "e2e/a.spec.ts", line: 2, name: "price-tag" },
    ]);
  });

  it("allows local class names and data hooks", () => {
    expect(moduleClassSelectors(`[class*="kicker"] [data-price-tag] [class*='chip']`, names)).toEqual([]);
  });

  it("the repository itself is clean", () => {
    expect(checkModuleClassLocators()).toEqual([]);
  });
});
