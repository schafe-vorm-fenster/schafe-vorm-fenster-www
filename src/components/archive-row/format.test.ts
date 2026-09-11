import { describe, expect, it } from "vitest";

import { formatArchiveDate } from "./format";

describe("TS-028 D7: the archive date renders at its stated precision", () => {
  it("formats a day-precision date fully, machine-readable", () => {
    const { iso, label } = formatArchiveDate("2019-05-03", "day");
    expect(iso).toBe("2019-05-03");
    expect(label).toContain("2019");
    expect(label).toContain("Mai");
  });

  it("formats a month-precision date without a day", () => {
    const { iso, label } = formatArchiveDate("2019-05-03", "month");
    expect(iso).toBe("2019-05");
    expect(label).not.toMatch(/\b3\.\s*Mai/);
    expect(label).toContain("Mai");
  });

  it("formats a year-precision date as the year alone", () => {
    const { iso, label } = formatArchiveDate("2019-05-03", "year");
    expect(iso).toBe("2019");
    expect(label).toBe("2019");
  });
});
