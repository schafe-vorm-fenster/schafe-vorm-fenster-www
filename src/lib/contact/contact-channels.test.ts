import { readdirSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";

import { describe, expect, it } from "vitest";

import generated from "@/src/generated/contact-channels.json";
import { BRIEFING_URL } from "@/src/lib/live/briefing";

import {
  CONTACT_CHANNEL_IDS,
  contactChannel,
  contactChannels,
  contactDisplayValue,
  contactHref,
  contactResponder,
  digitsOf,
} from "./contact-channels";
import { parseContactChannels } from "./hub-record";

import type { ContactChannelsFile } from "./hub-record";

const require = createRequire(import.meta.url);

/** The installed hub record — the same file `scripts/build-contact-channels.ts` reads. */
function installedHubRecord(): string {
  const packageJson = require.resolve("@schafe-vorm-fenster/goals/package.json");
  return readFileSync(join(dirname(packageJson), "contact-channels.md"), "utf8");
}

/**
 * TS-WEB-0016-A16 (static half) and DEC-0113: the committed
 * `src/generated/contact-channels.json` **is** the hub record — a hub release
 * that moves a number fails here until `pnpm build:contact-channels` is run,
 * and the site never renders a value the hub does not carry.
 */
describe("DEC-0113: the generated file equals the installed hub record", () => {
  it("carries exactly the rows the hub record carries, in its order", () => {
    const fromHub = parseContactChannels(installedHubRecord());
    expect((generated as ContactChannelsFile).channels).toEqual(fromHub);
  });

  it("names the package it was generated from", () => {
    expect((generated as ContactChannelsFile).source).toMatch(
      /^@schafe-vorm-fenster\/goals@\d+\.\d+\.\d+#contact-channels\.md$/,
    );
  });

  it("is the four channels of D13, in D13 order", () => {
    expect(contactChannels().map((channel) => channel.id)).toEqual([...CONTACT_CHANNEL_IDS]);
    expect(contactChannels().map((channel) => channel.order)).toEqual([1, 2, 3, 4]);
  });
});

describe("TS-WEB-0016 D13: the values resolve from the record, never from a page", () => {
  it("every row has an address and the same responder", () => {
    for (const channel of contactChannels()) {
      expect(channel.address, channel.id).not.toBe("");
      expect(channel.responder).toBe(contactResponder());
    }
  });

  it("rows 2 and 3 are one number and two rows — never merged", () => {
    expect(contactChannel("whatsapp").address).toBe(contactChannel("phone").address);
    expect(contactHref("whatsapp")).not.toBe(contactHref("phone"));
  });

  it("row 1 pays into both goals, rows 2–4 into make-contact alone (DEC-0081 amendment §3)", () => {
    expect(contactChannel("appointment").goals).toEqual(["make-contact", "request-product-briefing"]);
    for (const id of ["whatsapp", "phone", "mail"] as const) {
      expect(contactChannel(id).goals, id).toEqual(["make-contact"]);
    }
  });

  it("the appointment row's configured value is the hub's address by default (D7, DEC-0113)", () => {
    // The environment wins over the default (briefing.ts); the parity holds
    // for the default, which is what a build without the variable ships.
    if (process.env.NEXT_PUBLIC_BRIEFING_URL === undefined) {
      expect(BRIEFING_URL).toBe(contactChannel("appointment").address);
    }
    expect(contactHref("appointment")).toBe(BRIEFING_URL);
  });
});

describe("TS-WEB-0016-A15 / D13: one scheme per row", () => {
  it("row 2 is the click-to-chat host with the bare number", () => {
    const number = digitsOf(contactChannel("whatsapp").address);
    expect(number).toMatch(/^\d{8,15}$/);
    expect(contactHref("whatsapp")).toBe(`https://wa.me/${number}`);
  });

  it("row 3 is tel: with the E.164 number", () => {
    expect(contactHref("phone")).toBe(`tel:+${digitsOf(contactChannel("phone").address)}`);
  });

  it("row 4 is mailto: to the record's address", () => {
    expect(contactHref("mail")).toBe(`mailto:${contactChannel("mail").address}`);
  });

  it("the display value is the address as the hub writes it (CG-031: what the row is)", () => {
    for (const id of ["whatsapp", "phone", "mail"] as const) {
      expect(contactDisplayValue(id)).toBe(contactChannel(id).address);
    }
  });
});

describe("TS-WEB-0016-A19/A20 (D14 §6): no prefilled message until a copy rule exists", () => {
  it("carries no text, subject or body parameter on any row", () => {
    for (const id of CONTACT_CHANNEL_IDS) {
      if (id === "appointment") continue;
      const href = contactHref(id);
      expect(href, id).not.toMatch(/[?&](text|subject|body)=/);
      expect(href, id).not.toContain("?");
    }
  });
});

/**
 * TS-WEB-0016-A16, the other static half: no number and no address is typed
 * in a component. The walk is `src/` minus this module's own generated input
 * and minus test files; `app/` is not walked here because
 * `app/[lang]/_chrome.tsx` still names the envoy fallback's address
 * (`CONTACT_EMAIL`) until the layout mounts the section (T-10).
 */
describe("TS-WEB-0016-A16: no contact value is hard-coded under src/", () => {
  const ROOT = process.cwd();
  const SCAN_DIRS = ["src/components", "src/lib"];
  const EXEMPT = new Set(["src/generated/contact-channels.json"]);

  function sourceFiles(dir: string): string[] {
    return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) return sourceFiles(full);
      const rel = full.slice(ROOT.length + 1);
      if (EXEMPT.has(rel) || /\.test\.tsx?$/.test(entry.name)) return [];
      return /\.(tsx?|css|json)$/.test(entry.name) ? [full] : [];
    });
  }

  const values = contactChannels()
    .filter((channel) => channel.id !== "appointment")
    .flatMap((channel) => [channel.address, digitsOf(channel.address)])
    .filter((value) => value.length >= 8);

  it("finds none of the hub's numbers or addresses in a component or library file", () => {
    const offenders: string[] = [];
    for (const dir of SCAN_DIRS) {
      for (const file of sourceFiles(join(ROOT, dir))) {
        const source = readFileSync(file, "utf8");
        for (const value of values) {
          if (source.includes(value)) offenders.push(`${file.slice(ROOT.length + 1)}: ${value}`);
        }
      }
    }
    expect(offenders).toEqual([]);
  });
});
