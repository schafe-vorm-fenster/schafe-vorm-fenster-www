import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import StartPage, { metadata } from "@/app/start/page";
import { href } from "@/src/lib/routes/routes";
import { leadFormEmbedUrl } from "@/src/lib/routes/lead-fallback";
import { ALLOWLIST } from "@/src/lib/security/csp";
import { NOINDEX } from "@/src/lib/seo/indexable";

/**
 * TS-WEB-0016-A22's document half, in-process: the shape of the served HTML
 * before any browser or any frame is involved. The browser half — that the
 * frame is visible, that nothing is zero-size, that no other route frames
 * anything — is `e2e/start.spec.ts`.
 */

const html = renderToStaticMarkup(createElement(StartPage));

describe("TS-WEB-0016 D15: `/start` renders the registration form as one visible embed", () => {
  it("renders exactly one iframe, of the configured form host, with `?embedded=true`", () => {
    const frames = html.match(/<iframe\b[^>]*>/g) ?? [];
    expect(frames).toHaveLength(1);
    const src = /src="([^"]+)"/.exec(frames[0]!)?.[1]?.replace(/&amp;/g, "&");
    expect(src).toBe(leadFormEmbedUrl());
    expect(new URL(src!).origin).toBe(ALLOWLIST.googleForms);
    expect(new URL(src!).searchParams.get("embedded")).toBe("true");
  });

  it("wraps the frame in nothing that could hide or collapse it", () => {
    expect(html).not.toMatch(/<details\b/);
    expect(html).not.toMatch(/<summary\b/);
    expect(html).not.toMatch(/\bhidden\b/);
    expect(html).not.toMatch(/<button\b/);
    expect(html).not.toMatch(/<input\b/);
  });

  it("puts the e-mail address beside it as a mailto link", () => {
    expect(html).toMatch(/<a href="mailto:[^"]+@[^"]+">/);
  });

  it("gives the frame an accessible name", () => {
    expect(html).toMatch(/<iframe\b[^>]*\btitle="[^"]+"/);
  });
});

describe("TS-WEB-0016 D17: the notice stands above the embed", () => {
  const notice = /<p[^>]*data-block="embed-notice"[^>]*>([\s\S]*?)<\/p>/.exec(html);

  it("is in the document, earlier in DOM order than the iframe", () => {
    expect(notice).not.toBeNull();
    expect(html.indexOf('data-block="embed-notice"')).toBeLessThan(html.indexOf("<iframe"));
  });

  it("names Google and links the data-protection section of /rechtliches", () => {
    expect(notice![1]).toContain("Google");
    expect(notice![1]).toContain(`href="${href("legal", "de")}#datenschutz"`);
  });

  it("is one block with no heading, no list and no control", () => {
    expect(notice![1]).not.toMatch(/<(h[1-6]|ul|ol|button|input|label|details|dialog)\b/);
    expect(notice![0]).not.toMatch(/\brole=/);
  });

  it("carries the placeholder marking — the words are nobody's yet (DEC-0108 §2)", () => {
    expect(notice![0]).toContain('data-demo="true"');
  });
});

describe("TS-WEB-0004 D1: the `/start` row is `noindex`", () => {
  it("states noindex in its metadata, unconditionally", () => {
    expect(metadata.robots).toBe(NOINDEX);
    expect(metadata.title).toBeTruthy();
  });
});

describe("NFR-WEB-0062 / TS-WEB-0016 D15: nothing is measured, nothing is gated", () => {
  it("carries no conversion marker and no consent component", () => {
    expect(html).not.toContain("data-cta");
    expect(html).not.toMatch(/consent/i);
  });
});
