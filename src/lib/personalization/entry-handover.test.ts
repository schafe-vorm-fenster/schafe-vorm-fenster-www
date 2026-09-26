import { describe, expect, it } from "vitest";

import {
  ENTRY_CONTEXT_HEADER,
  decodeEntryHandover,
  encodeEntryHandover,
} from "./entry-handover";
import { resolveEntryTrait } from "./entry-context";

import type { EntryTrait } from "../relevance/types";

/**
 * The handover is the hop that lets the trait half of stage 2 fire at all
 * (TS-WEB-0010 D2 step 2, DEC-0140). Two things are asserted here: that a trait
 * survives the round trip unchanged — `TS-WEB-0010-A3`'s "resolver and engine
 * read the same trait constant", now across a header as well — and that
 * nothing but the two named values ever crosses it (`TS-WEB-0010-A11`).
 */

/** The page's side of the hop, as `app/[lang]/_scenes.tsx` does it. */
function traitAfterHandover(
  header: string,
  landing: { routeId?: "home" | "place"; focusJob?: "know-what-is-on" | "run-our-own-calendar" } = {},
): EntryTrait {
  const handover = decodeEntryHandover(header);
  return resolveEntryTrait({
    focusJob: landing.focusJob,
    params: handover.medium === null ? {} : { etcc_med: handover.medium },
    referrerHost: handover.referrerHost,
    routeId: landing.routeId,
  });
}

function headerFor(referrer: string | null, query = ""): string {
  return encodeEntryHandover({
    referrer,
    searchParams: new URLSearchParams(query),
  });
}

describe("TS-WEB-0010-A3 across the handover: every D3 row survives the header", () => {
  it("carries the referrer rows", () => {
    const rows: readonly [string, EntryTrait][] = [
      ["https://www.linkedin.com/feed/", "professional"],
      ["https://l.instagram.com/", "social"],
      ["https://www.nordkurier.de/artikel/x", "press"],
      ["https://app.schafe-vorm-fenster.de/", "activated"],
      ["https://www.schafe-vorm-fenster.de/mitmachen", "direct"],
    ];
    for (const [referrer, trait] of rows) {
      expect(traitAfterHandover(headerFor(referrer)), referrer).toBe(trait);
    }
  });

  it("carries the two rows that also need the landing page", () => {
    expect(
      traitAfterHandover(headerFor("https://www.google.com/search"), { routeId: "place" }),
    ).toBe("reader-search");
    expect(
      traitAfterHandover(headerFor("https://www.google.com/search"), {
        focusJob: "run-our-own-calendar",
      }),
    ).toBe("purchase-intent");
    // On `/` — focus job "know what is on" — an organic search is `direct`.
    expect(
      traitAfterHandover(headerFor("https://www.google.com/search"), {
        focusJob: "know-what-is-on",
        routeId: "home",
      }),
    ).toBe("direct");
  });

  it("carries the three campaign media, and lets them beat the referrer", () => {
    expect(traitAfterHandover(headerFor(null, "etcc_med=print"))).toBe("print-qr");
    expect(traitAfterHandover(headerFor(null, "utm_medium=newsletter"))).toBe("activated");
    expect(traitAfterHandover(headerFor(null, "etcc_med=social"))).toBe("social");
    // Stated intent beats inferred intent (TS-WEB-0010 D2).
    expect(
      traitAfterHandover(headerFor("https://www.linkedin.com/feed/", "etcc_med=print")),
    ).toBe("print-qr");
  });

  it("is `direct` for an absent, empty, malformed or unrecognised entry", () => {
    for (const header of ["", "   ", "ref=", "ref=%%%", "nonsense", "med=e-mail"]) {
      expect(traitAfterHandover(header), header).toBe("direct");
    }
    expect(decodeEntryHandover(null)).toEqual({ referrerHost: null, medium: null });
    expect(decodeEntryHandover(undefined)).toEqual({ referrerHost: null, medium: null });
    expect(headerFor(null)).toBe("");
    expect(headerFor("not a url")).toBe("");
  });
});

describe("TS-WEB-0010-A11 / D3: only the host and a recognised medium travel", () => {
  it("drops the referrer's path, query and fragment, and the `www.` prefix", () => {
    expect(headerFor("https://www.linkedin.com/in/someone?ref=abc#top")).toBe("ref=linkedin.com");
  });

  it("drops a medium D3 does not recognise, so no arbitrary query text is forwarded", () => {
    expect(headerFor(null, "etcc_med=%3Cscript%3E")).toBe("");
    expect(headerFor(null, "utm_medium=cpc")).toBe("");
    expect(headerFor("https://www.linkedin.com/", "etcc_med=cpc")).toBe("ref=linkedin.com");
  });

  it("drops a value that is not a hostname", () => {
    // A referrer the URL parser accepts but whose host is not one (an IP
    // literal in brackets, an over-long label) is not forwarded.
    expect(headerFor("https://[2001:db8::1]/x")).toBe("");
    expect(headerFor(`https://${"a".repeat(260)}.example/x`)).toBe("");
    expect(decodeEntryHandover("ref=not a host").referrerHost).toBeNull();
  });

  it("has no field for a geo or IP value at all", () => {
    // The input type is `{ referrer, searchParams }`. Everything a platform
    // geo header would offer has nowhere to go, and the encoded value is the
    // proof: it names exactly `ref` and `med`.
    const value = headerFor("https://www.linkedin.com/", "etcc_med=print&ort=lassan&lat=54&lng=13");
    expect([...new URLSearchParams(value).keys()].toSorted()).toEqual(["med", "ref"]);
  });

  it("is a legal header value — ASCII, no CR, no LF", () => {
    const value = headerFor("https://xn--mller-kva.example/ü?q=ü", "etcc_med=SOCIAL");
    expect(value).toMatch(/^[\x21-\x7e]*$/u);
    expect(value).not.toMatch(/[\r\n]/u);
    // The medium is normalised on the way in, not on the way out.
    expect(decodeEntryHandover(value).medium).toBe("social");
    // A header a caller can set without quoting rules.
    expect(new Headers({ [ENTRY_CONTEXT_HEADER]: value }).get(ENTRY_CONTEXT_HEADER)).toBe(value);
  });
});
