import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ComponentGallery, DECLARED_STATE_ORDER, GALLERY } from "./gallery";

const html = renderToStaticMarkup(<ComponentGallery />);

/**
 * The M2 component set, by inventory name and number
 * (plan/component-inventory.md §2.1, §2.2, §2.3, §2.4, §2.5, §2.6).
 */
const INVENTORY = [
  "button",
  "search-field",
  "badge",
  "chip",
  "event-row",
  "photo-surface",
  "logo",
  "site-header",
  "site-footer",
  "language-switch",
  "breadcrumb-trail",
  "skip-link",
  "section-shell",
  "motion-reveal",
  "route-link",
  "outbound-link",
  "section-nav",
  "back-to-top",
  "media-frame",
  "icon",
  // ── §2.3 argument blocks (content types B.3) ──
  "hero-block",
  "scene-block",
  "value-story",
  "objection-list",
  "publishing-path",
  "comparison-table",
  "offer-tier",
  "feature-benefit",
  "price-tag",
  "proof-card",
  "proof-stream",
  "empty-proof-slot",
  "archive-row",
  "archive-filter",
  "origin-story",
  "person-profile",
  "trust-block",
  "howto-block",
  "legal-section",
  // ── §2.4 live-module shells ──
  "live-module-frame",
  "place-search",
  "event-list",
  "place-example-set",
  "live-counters",
  "embed-frame",
  "empty-state-block",
  // ── §2.5 conversion blocks, forms, flows ──
  "context-band",
  "closing-cta",
  "newsletter-block",
  "envoy-form-mount",
  "lead-fallback",
  "response-promise",
  "step-indicator",
  "choice-group",
  "scope-picker",
  "code-snippet",
  // ── §2.6 placeholders, states, errors ──
  "skeleton",
  "placeholder-surface",
  "placeholder-badge",
  "demo-data-badge",
  "freshness-label",
  "status-badge",
  "error-page",
] as const;

/** The components that depend on late or external data (D-9). */
const DATA_DEPENDENT = [
  "event-row",
  "photo-surface",
  "media-frame",
  "hero-block",
  "proof-card",
  "live-module-frame",
  "place-search",
  "event-list",
  "place-example-set",
  "live-counters",
  "embed-frame",
  "envoy-form-mount",
  "choice-group",
  "scope-picker",
  "code-snippet",
] as const;

describe("Q-044: the M2 component set is complete and named as the inventory names it", () => {
  it("carries all 63 components of sections 2.1–2.6, in inventory order", () => {
    expect(GALLERY.map((entry) => entry.name)).toEqual([...INVENTORY]);
  });

  it("renders every one of them", () => {
    for (const name of INVENTORY) expect(html).toContain(`data-component="${name}"`);
  });

  it("uses kebab-case inventory names, never a private variant", () => {
    for (const entry of GALLERY) expect(entry.name).toMatch(/^[a-z]+(-[a-z]+)*$/);
  });
});

describe("D-9: every data-dependent component declares all four states", () => {
  it("declares loading, empty, error-degraded and mocked", () => {
    for (const name of DATA_DEPENDENT) {
      const entry = GALLERY.find((candidate) => candidate.name === name);
      expect(entry?.states, name).toBeDefined();
      for (const state of DECLARED_STATE_ORDER) {
        expect(Object.keys(entry?.states ?? {}), `${name}/${state}`).toContain(state);
      }
    }
  });

  it("renders each declared state in the gallery", () => {
    for (const state of DECLARED_STATE_ORDER) {
      const occurrences = html.split(`data-state="${state}"`).length - 1;
      expect(occurrences, state).toBe(DATA_DEPENDENT.length);
    }
  });

  it("marks mocked data with the `Demo-Daten` badge (mock rule)", () => {
    expect(html).toContain("Demo-Daten");
  });

  it("shows no spinner, no error sentence and no retry control", () => {
    expect(html.toLowerCase()).not.toContain("spinner");
    expect(html.toLowerCase()).not.toContain("erneut versuchen");
    expect(html.toLowerCase()).not.toContain("fehler beim laden");
  });
});

describe("TS-002: the accessibility contracts of the foundation set", () => {
  it("hides every icon from assistive technology", () => {
    const svgs = html.match(/<svg\b[^>]*>/g) ?? [];
    expect(svgs.length).toBeGreaterThan(0);
    for (const svg of svgs) expect(svg).toContain('aria-hidden="true"');
  });

  it("names every navigation landmark", () => {
    const navs = html.match(/<nav\b[^>]*>/g) ?? [];
    expect(navs.length).toBeGreaterThanOrEqual(5);
    for (const nav of navs) expect(nav).toMatch(/aria-label="[^"]+"/);
  });

  it("renders the header and footer landmarks", () => {
    expect(html).toContain("<header");
    expect(html).toContain("<footer");
  });

  it("jumps to the main landmark from the skip link", () => {
    expect(html).toContain('href="#main"');
  });

  it("binds the search field's label to its input", () => {
    expect(html).toMatch(/<label[^>]*for="ort-suche"/);
    expect(html).toMatch(/<input[^>]*id="ort-suche"/);
    expect(html).toContain('role="search"');
    expect(html).toContain('method="get"');
  });

  it("gives every image an alt attribute", () => {
    const images = html.match(/<img\b[^>]*>/g) ?? [];
    expect(images.length).toBeGreaterThan(0);
    for (const image of images) expect(image).toMatch(/\salt="/);
  });

  it("gives every button an explicit type", () => {
    const buttons = html.match(/<button\b[^>]*>/g) ?? [];
    expect(buttons.length).toBeGreaterThan(0);
    for (const button of buttons) expect(button).toMatch(/type="(button|submit|reset)"/);
  });

  it("marks the current item with aria-current, not with colour alone", () => {
    expect(html).toContain('aria-current="page"');
    expect(html).toContain('aria-current="true"');
  });

  it("makes every date machine-readable", () => {
    const times = html.match(/<time\b[^>]*>/g) ?? [];
    expect(times.length).toBeGreaterThan(0);
    for (const time of times) expect(time).toMatch(/datetime="[^"]+"/i);
  });
});

describe("TS-017 D3: no brand value enters through a component", () => {
  it("writes no colour literal into the rendered markup", () => {
    const inlineStyles = html.match(/style="[^"]*"/g) ?? [];
    for (const style of inlineStyles) {
      expect(style).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
      expect(style).not.toMatch(/\b(rgba?|hsla?|oklch)\(/);
    }
  });

  it("keeps every inline style a token reference", () => {
    const inlineStyles = html.match(/style="[^"]*"/g) ?? [];
    for (const style of inlineStyles) {
      const custom =
        style.includes("--photo-image") ||
        style.includes("var(--ratio-") ||
        // `hero-block`'s reserved-line-count var — a line count, not a brand
        // value, and read back only through `calc()` in its own stylesheet.
        style.includes("--hero-headline-lines");
      const layout = /object-fit|position:|inset:|color:transparent/.test(style);
      expect(custom || layout, style).toBe(true);
    }
  });
});

describe("TS-001 D5: no component holds a literal internal href", () => {
  it("routes every internal link through the facade's paths", () => {
    // Anchors only: `priority` images also emit a preload link.
    const hrefs = (html.match(/<a\b[^>]*href="([^"]*)"/g) ?? []).map(
      (anchor) => /href="([^"]*)"/.exec(anchor)?.[1] ?? "",
    );
    const internal = hrefs.filter(
      (href) => href.startsWith("/") && !href.startsWith("//"),
    );
    expect(internal.length).toBeGreaterThan(0);
    const routes = [
      "/",
      "/dein-ort",
      "/dein-ort/starten",
      "/mitmachen",
      "/mitmachen/registrieren",
      "/dein-kalender",
      "/dein-kalender/bestellen",
      "/deine-region",
      "/deine-region/angebot",
      "/ueber-uns",
      "/ueber-uns/archiv",
      "/rechtliches",
      "/en",
      // `/start` (TS-016 D6, DEC-069): the redirect-only path `lead-fallback`
      // links to. It is not a route-facade path — it joins the TS-004 D1
      // route inventory once the app work package builds the redirect
      // (state/open.md) — so it is named here rather than through `href()`.
      "/start",
    ];
    for (const href of internal) {
      expect(
        routes.some(
          (route) =>
            href === route ||
            // `route-link`'s `query`/`hash` options append `?…` or `#…` —
            // both are still the same route, never a second path.
            href.startsWith(`${route}#`) ||
            href.startsWith(`${route}?`) ||
            href.startsWith("/en/"),
        ),
        href,
      ).toBe(true);
    }
  });

  it("opens an external link with rel=noopener and says so in the text", () => {
    expect(html).toContain('rel="noopener"');
    expect(html).toContain("öffnet neuen Tab");
  });
});
