import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { PageFrame } from "@/app/[lang]/_page-frame";
import { pageMeta as aboutMeta } from "@/app/[lang]/ueber-uns/page.meta";
import { pageMeta as archiveMeta } from "@/app/[lang]/ueber-uns/archiv/page.meta";
import { pageMeta as calendarMeta } from "@/app/[lang]/dein-kalender/page.meta";
import { pageMeta as legalMeta } from "@/app/[lang]/rechtliches/page.meta";
import { dictionary } from "@/src/lib/i18n/dictionary";
import { HEADER_JOBS } from "@/src/lib/routes/navigation";

import { otherJobs } from "./job-links";

import type { ClosingBlock } from "@/app/[lang]/_page-frame";
import type { PageMeta } from "@/src/lib/pages/page-meta";

/**
 * TS-011-A4 — "the context band is an `aside` on **every** page" — against
 * TS-006 D6, which merges the band and the closing block on the pages whose
 * `primaryConversion` is `null`.
 *
 * F-2-41 (round 2, reopened at gate 2): the merge was built as a
 * *suppression* — `PageFrame` rendered no band at all where a page passed
 * `closing={{ variant: "merged" }}`, so `/ueber-uns`, `/ueber-uns/archiv`
 * and `/rechtliches` carried no `aside` element. The merged block **is** the
 * band (`plan/component-inventory.md` §47: mode `merged` "merges with the
 * closing block and renders **once**, as the last block"), so it renders as
 * the band's `aside#context-band` and carries block 4's `#closing-cta`
 * anchor inside — one of each per page, the three job links once.
 *
 * The two pages that legitimately carry no band — `/mitmachen/registrieren`
 * and `/dein-kalender/bestellen` on their flow steps (F-2-10, TS-023 D7 /
 * TS-025, `state/open.md` row 24) — compose their blocks by hand, never
 * through `PageFrame`, and are therefore outside this file by construction;
 * `e2e/routes.spec.ts` names them as the two exceptions of the route walk.
 */

const CLOSINGS: ReadonlyArray<{ name: string; meta: PageMeta; closing: ClosingBlock }> = [
  { name: "merged (primaryConversion: null)", meta: aboutMeta, closing: { variant: "merged" } },
  { name: "merged, second level", meta: archiveMeta, closing: { variant: "merged" } },
  { name: "merged, the legal page", meta: legalMeta, closing: { variant: "merged" } },
  {
    name: "repeat (the goal's CTA again)",
    meta: calendarMeta,
    closing: { to: "order", label: "Bestellen" },
  },
  {
    name: "module (the block-1 primary as the module it is)",
    meta: calendarMeta,
    closing: { variant: "module", node: <p>search</p> },
  },
];

/** Occurrences of a literal — `String.split` counts without a regex escape. */
function count(haystack: string, needle: string): number {
  return haystack.split(needle).length - 1;
}

/**
 * The page's own body. `PageFrame` renders exactly that and nothing else
 * since row 204 — the `main` landmark it used to wrap around this belongs to
 * `app/[lang]/layout.tsx` now, so there is no chrome left to strip.
 */
function mainOf(html: string): string {
  return html;
}

function render(meta: PageMeta, closing: ClosingBlock): string {
  return renderToStaticMarkup(
    <PageFrame closing={closing} locale="de" meta={meta}>
      <p>the page body</p>
    </PageFrame>,
  );
}

describe("TS-011-A4 / TS-006 D5+D6: every PageFrame page carries one context band", () => {
  for (const { name, meta, closing } of CLOSINGS) {
    it(`renders one aside#context-band and one #closing-cta — ${name}`, () => {
      const html = render(meta, closing);

      expect(count(html, 'id="context-band"')).toBe(1);
      expect(count(html, 'id="closing-cta"')).toBe(1);
      expect(html).toMatch(/<aside[^>]*id="context-band"/);
    });

    it(`gives the band an accessible name — ${name}`, () => {
      const html = render(meta, closing);
      const aside = html.slice(html.indexOf("<aside"));
      expect(aside.slice(0, aside.indexOf(">"))).toMatch(/aria-label="[^"]+"/);
    });
  }

  it("names the three non-focus jobs exactly once inside the page body (merged renders no second list)", () => {
    const d = dictionary("de");
    for (const { meta, closing } of CLOSINGS) {
      const main = mainOf(render(meta, closing));
      for (const job of otherJobs(meta.focusJob === "why-us" ? "whyUs" : "yourCalendar")) {
        expect(count(main, `>${d.nav[job.label]}<`), job.label).toBe(1);
      }
    }
  });

  it("leaves the page's own focus job out of the band", () => {
    const main = mainOf(render(aboutMeta, { variant: "merged" }));
    const d = dictionary("de");
    const focus = HEADER_JOBS.find((job) => job.label === "whyUs");
    expect(count(main, `>${d.nav[focus!.label]}<`)).toBe(0);
  });
});
