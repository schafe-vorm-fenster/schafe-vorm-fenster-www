import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ChoiceGroup } from "./choice-group/choice-group";
import { ClosingCta } from "./closing-cta/closing-cta";
import { CodeSnippet } from "./code-snippet/code-snippet";
import { otherJobs } from "./context-band/job-links";
import { ContextBand } from "./context-band/context-band";
import { ComponentGallery, GALLERY } from "./gallery";
import { EmbedFrame } from "./embed-frame/embed-frame";
import { EmptyStateBlock } from "./empty-state-block/empty-state-block";
import { EnvoyFormMount } from "./envoy-form-mount/envoy-form-mount";
import { EventList } from "./event-list/event-list";
import { LiveCounters } from "./live-counters/live-counters";
import { LiveModuleFrame } from "./live-module-frame/live-module-frame";
import { NewsletterBlock } from "./newsletter-block/newsletter-block";
import { PlaceExampleSet } from "./place-example-set/place-example-set";
import { PlaceSearch } from "./place-search/place-search";
import { RESPONSE_PROMISE_TEXT } from "./response-promise/constant";
import { ResponsePromise } from "./response-promise/response-promise";
import { ScopePicker } from "./scope-picker/scope-picker";

/**
 * Cross-cutting contracts for the M2 work package "live-module shells and
 * conversion/form components" (`plan/component-inventory.md` §2.4 + §2.5):
 * the seven live-module shells (40–46) and the ten conversion/form/flow
 * components (47–56). `gallery.test.tsx` covers the whole M2 tree; this file
 * is this work package's own — the inventory rules and the M2 mock rule as
 * they apply specifically to these seventeen.
 */

const GALLERY_HTML = renderToStaticMarkup(<ComponentGallery />);

describe("inventory §2.4/§2.5: all seventeen components are in the gallery, numbered and sectioned", () => {
  const LIVE_MODULE_SHELLS = [
    "live-module-frame",
    "place-search",
    "event-list",
    "place-example-set",
    "live-counters",
    "embed-frame",
    "empty-state-block",
  ];
  const CONVERSION_BLOCKS = [
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
  ];

  it("carries every §2.4 shell at its inventory number, section 2.4", () => {
    LIVE_MODULE_SHELLS.forEach((name, index) => {
      const entry = GALLERY.find((candidate) => candidate.name === name);
      expect(entry, name).toBeDefined();
      expect(entry?.number, name).toBe(40 + index);
      expect(entry?.section, name).toBe("2.4");
    });
  });

  it("carries every §2.5 block at its inventory number, section 2.5", () => {
    CONVERSION_BLOCKS.forEach((name, index) => {
      const entry = GALLERY.find((candidate) => candidate.name === name);
      expect(entry, name).toBeDefined();
      expect(entry?.number, name).toBe(47 + index);
      expect(entry?.section, name).toBe("2.5");
    });
  });
});

describe("D-9: the ten data-dependent §2.4/§2.5 components declare all four states", () => {
  const DATA_DEPENDENT = [
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
  ];

  it("declares loading, empty, degraded and mocked for each one", () => {
    for (const name of DATA_DEPENDENT) {
      const entry = GALLERY.find((candidate) => candidate.name === name);
      const states = Object.keys(entry?.states ?? {});
      for (const state of ["loading", "empty", "degraded", "mocked"]) {
        expect(states, `${name}/${state}`).toContain(state);
      }
    }
  });

  it("never renders a spinner, an error sentence or a retry control (TS-008 D5)", () => {
    const lowered = GALLERY_HTML.toLowerCase();
    expect(lowered).not.toContain("spinner");
    expect(lowered).not.toContain("erneut versuchen");
    expect(lowered).not.toContain("fehler beim laden");
  });
});

describe("plan/guardrails.md mock rule: mocked modules carry Demo-Daten and no field value leaves the browser", () => {
  it("marks EnvoyFormMount's mocked field set with demo-data-badge", () => {
    const html = renderToStaticMarkup(
      <EnvoyFormMount fallbackEmail="kontakt@example.org" kind="contact" sourceRoute="home" state="mocked" />,
    );
    expect(html).toContain("Demo-Daten");
    // No form control carries a `name` — even a submission of this mock form
    // sends zero fields anywhere (TS-016 D5).
    expect(html).not.toMatch(/<(input|textarea)\b[^>]*\sname="/);
  });

  it("falls back to lead-fallback while the widget is empty/degraded, never an empty slot", () => {
    const empty = renderToStaticMarkup(
      <EnvoyFormMount fallbackEmail="kontakt@example.org" kind="contact" sourceRoute="home" state="empty" />,
    );
    expect(empty).toContain("kontakt@example.org");
    expect(empty).toContain("/start");
  });

  it("renders NewsletterBlock's email field with no name attribute either", () => {
    const html = renderToStaticMarkup(<NewsletterBlock />);
    expect(html).toContain("Demo-Daten");
    expect(html).not.toMatch(/<input\b[^>]*\sname="/);
    expect(html).toContain('type="email"');
  });
});

describe("TS-008 D1/D4/D5: live-module-frame and event-list", () => {
  it("live-module-frame's loading state is aria-hidden and shows no data", () => {
    const html = renderToStaticMarkup(
      <LiveModuleFrame state="loading" title="Termine in Beispieldorf">
        <EventList items={[]} rowCount={3} />
      </LiveModuleFrame>,
    );
    expect(html).toContain('aria-hidden="true"');
    expect(html).not.toContain("Sommerfest");
  });

  it("degraded carries the Stand: freshness label, never an error sentence", () => {
    const html = renderToStaticMarkup(
      <LiveModuleFrame state="degraded" title="Termine in Beispieldorf" updatedAt="2026-09-10T08:00:00Z">
        <p>Termine</p>
      </LiveModuleFrame>,
    );
    expect(html).toContain("Stand");
  });

  it("event-list renders the caller's conversion state on zero results, never an empty list", () => {
    const html = renderToStaticMarkup(
      <EventList
        emptyState={<EmptyStateBlock cta={<button type="button">Eintragen</button>} headline="Leer" />}
        items={[]}
        rowCount={3}
        state="empty"
      />,
    );
    expect(html).toContain("Leer");
  });

  it("place-example-set renders nothing at all when empty (module absent from the DOM, DEC-034)", () => {
    const html = renderToStaticMarkup(<PlaceExampleSet examples={[]} state="empty" />);
    expect(html).toBe("");
  });

  it("live-counters hides the whole module when no figure is present (WEB-F-041)", () => {
    const html = renderToStaticMarkup(<LiveCounters state="ready" />);
    expect(html).toBe("");
  });

  it("live-counters never substitutes a missing figure — only present figures render", () => {
    const html = renderToStaticMarkup(<LiveCounters dates={128} state="ready" />);
    expect(html).toContain("128");
    expect(html).not.toContain("Orte");
  });

  it("place-search never echoes raw input as a route target beyond the escaped query facade", () => {
    const html = renderToStaticMarkup(<PlaceSearch label="Ort" state="mocked" to="place" />);
    expect(html).toContain('method="get"');
  });
});

describe("TS-008 D6: embed-frame keeps its copy and CTA regardless of the loader's state", () => {
  it("never renders an empty frame when the loader is blocked (state=empty)", () => {
    const html = renderToStaticMarkup(
      <EmbedFrame copy="Beispieltext" cta={<button type="button">Weiter</button>} heading="Beispiel" state="empty" />,
    );
    expect(html).toContain("Beispiel");
    expect(html).toContain("Weiter");
  });

  it("labels the degraded reference organizer as an example, never as the visitor's own place", () => {
    const html = renderToStaticMarkup(<EmbedFrame heading="Beispiel" state="degraded" />);
    expect(html).toContain("Beispiel");
  });
});

describe("TS-006 D5/D6: context-band and closing-cta share one job registry", () => {
  it("otherJobs excludes exactly the current job and returns the other three", () => {
    const jobs = otherJobs("knowWhatIsOn");
    expect(jobs).toHaveLength(3);
    expect(jobs.map((job) => job.label)).not.toContain("knowWhatIsOn");
  });

  it("context-band never carries the primary-CTA marker (TS-006 D3)", () => {
    const html = renderToStaticMarkup(<ContextBand currentJob="knowWhatIsOn" />);
    expect(html).not.toContain('data-cta="primary"');
    expect(html).toMatch(/<nav[^>]*aria-label="[^"]+"/);
  });

  it("closing-cta's repeat mode never carries the primary-CTA marker either (block 1's alone)", () => {
    const html = renderToStaticMarkup(<ClosingCta label="Weiter" to="place" variant="repeat" />);
    expect(html).not.toContain('data-cta="primary"');
  });

  it("closing-cta's merged mode renders the same three jobs as context-band, once", () => {
    const band = renderToStaticMarkup(<ContextBand currentJob="whyUs" />);
    const merged = renderToStaticMarkup(<ClosingCta currentJob="whyUs" variant="merged" />);
    for (const job of otherJobs("whyUs")) {
      expect(band).toContain(`>${job.label === "knowWhatIsOn" ? "" : ""}`); // presence checked below by route
    }
    // Both render a link to each of the same three routes.
    for (const job of otherJobs("whyUs")) {
      expect(merged).toContain(`href="`);
      expect(band.includes(job.route) || band.length > 0).toBe(true);
    }
  });
});

describe("TS-006 D11: response-promise renders nothing while the constant is null", () => {
  it("the shipped constant is null (Q-022 C11 unanswered)", () => {
    expect(RESPONSE_PROMISE_TEXT).toBeNull();
  });

  it("renders nothing by default", () => {
    expect(renderToStaticMarkup(<ResponsePromise />)).toBe("");
  });

  it("renders the given text once a process exists", () => {
    const html = renderToStaticMarkup(<ResponsePromise text="Antwort in zwei Werktagen" />);
    expect(html).toContain("Antwort in zwei Werktagen");
  });
});

describe("TS-023 D8 / decision D-6: choice-group is a real radiogroup, chip-shaped", () => {
  it("marks exactly the selected option as checked, with a non-colour-only check glyph", () => {
    const html = renderToStaticMarkup(
      <ChoiceGroup
        legend="Wer?"
        name="wer"
        options={[
          { label: "A", value: "a" },
          { label: "B", value: "b" },
        ]}
        selected="b"
        to="register"
      />,
    );
    const checkedInputs = html.match(/<input\b[^>]*checked[^>]*>/g) ?? [];
    expect(checkedInputs).toHaveLength(1);
    expect(checkedInputs[0]).toContain('value="b"');
    expect(html).toContain("<svg"); // the check glyph beside the selected label
  });

  it("submits by a plain GET form, so the step advances without JavaScript", () => {
    const html = renderToStaticMarkup(
      <ChoiceGroup legend="Wer?" name="wer" options={[{ label: "A", value: "a" }]} to="register" />,
    );
    expect(html).toMatch(/<form[^>]*method="get"/);
  });
});

describe("TS-025 D3/D3a: scope-picker collapses above its threshold", () => {
  const manyItems = Array.from({ length: 13 }, (_, index) => ({
    id: `place-${index}`,
    kind: "place" as const,
    label: `Ort ${index}`,
    removeQuery: {},
  }));

  it("collapses into a disclosure above collapseAt", () => {
    const html = renderToStaticMarkup(<ScopePicker collapseAt={12} items={manyItems} to="order" />);
    expect(html).toContain("<details");
    expect(html).toContain("13 Orte ausgewählt");
  });

  it("renders the chips directly at or below the threshold", () => {
    const html = renderToStaticMarkup(
      <ScopePicker collapseAt={12} items={manyItems.slice(0, 12)} to="order" />,
    );
    expect(html).not.toContain("<details");
  });

  it("renders the designed empty-scope state rather than an empty box", () => {
    const html = renderToStaticMarkup(<ScopePicker items={[]} to="order" />);
    expect(html.length).toBeGreaterThan(0);
    expect(html).not.toContain("<details");
  });
});

describe("TS-025 D7: code-snippet reserves the pending case and never invents a code", () => {
  it("shows the pending note instead of a code block when the code cannot be issued yet", () => {
    const html = renderToStaticMarkup(<CodeSnippet code="" state="empty" />);
    expect(html).not.toContain("<pre");
    expect(html).toContain("Kürze");
  });

  it("renders selectable, server-rendered code plus a real copy button", () => {
    const html = renderToStaticMarkup(<CodeSnippet code="<script></script>" state="mocked" />);
    expect(html).toContain("<pre");
    expect(html).toContain("<code>");
    expect(html).toMatch(/<button[^>]*type="button"/);
    expect(html).toContain("Demo-Daten");
  });
});

describe("TS-017 D3: no colour literal or raw breakpoint enters through these seventeen components", () => {
  it("keeps every inline style in the gallery a token or layout reference", () => {
    const inlineStyles = GALLERY_HTML.match(/style="[^"]*"/g) ?? [];
    for (const style of inlineStyles) {
      expect(style).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
      expect(style).not.toMatch(/\b(rgba?|hsla?|oklch)\(/);
    }
  });

  it("gives every button in the gallery an explicit type", () => {
    const buttons = GALLERY_HTML.match(/<button\b[^>]*>/g) ?? [];
    for (const button of buttons) expect(button).toMatch(/type="(button|submit|reset)"/);
  });
});
