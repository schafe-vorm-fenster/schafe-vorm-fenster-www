import { describe, expect, it } from "vitest";

import { parseContactChannels } from "./hub-record";

/**
 * The reader of the hub record, against fixtures — the committed artefact
 * itself is compared to the installed record in `contact-channels.test.ts`.
 * Fixture values are shaped like the record, not copied from it: no real
 * number or address lives in a test (TS-WEB-0016-A16).
 */

const TABLE = `
## The Channels

| # | Channel | Address | Serves | Who answers |
| --- | --- | --- | --- | --- |
| 1 | Video appointment | \`https://calendar.example/abc\` | \`make-contact\`, and \`request-product-briefing\` above it | A. Person |
| 2 | WhatsApp | \`+49 100 0000000\` | \`make-contact\` | A. Person |
| 3 | Phone | \`+49 100 0000000\` | \`make-contact\` | A. Person |
| 4 | E-mail | \`someone@example.org\` | \`make-contact\` | A. Person |

## Where the Values Come From

| Value | Cleared source |
| --- | --- |
| \`+49 100 0000000\` | the published imprint |
`;

describe("parseContactChannels", () => {
  it("reads the four rows with address, goals and responder, and ignores every other table", () => {
    const rows = parseContactChannels(TABLE);
    expect(rows.map((row) => row.id)).toEqual(["appointment", "whatsapp", "phone", "mail"]);
    expect(rows[0]).toEqual({
      order: 1,
      id: "appointment",
      label: "Video appointment",
      address: "https://calendar.example/abc",
      goals: ["make-contact", "request-product-briefing"],
      responder: "A. Person",
    });
    expect(rows[3]?.address).toBe("someone@example.org");
    expect(rows[3]?.goals).toEqual(["make-contact"]);
  });

  it("fails on a missing row rather than returning three (D13: a build failure, not an empty row)", () => {
    const withoutPhone = TABLE.split("\n").filter((line) => !line.startsWith("| 3 |")).join("\n");
    expect(() => parseContactChannels(withoutPhone)).toThrow(/expected the four channels/);
  });

  it("fails on a reordered record — the order is D13's, not the file's", () => {
    const swapped = TABLE.replace("| 2 | WhatsApp", "| 2 | Phone").replace("| 3 | Phone", "| 3 | WhatsApp");
    expect(() => parseContactChannels(swapped)).toThrow(/in that order/);
  });

  it("fails on an unknown channel name instead of guessing an id", () => {
    const renamed = TABLE.replace("| 4 | E-mail", "| 4 | Fax");
    expect(() => parseContactChannels(renamed)).toThrow(/expected the four channels/);
  });

  it("fails on an empty document", () => {
    expect(() => parseContactChannels("")).toThrow(/found none/);
  });
});
