import { expect, test } from "@playwright/test";

import { everyRoute, href } from "../src/lib/routes/routes";

import type { Page } from "@playwright/test";

/**
 * TS-WEB-0006-A18 — the secondary rung of the CTA ladder, swept over every
 * route: *"Every explanatory module (scene block, publishing path, price tier)
 * contains exactly one CTA, and it carries `data-cta="secondary"` or
 * `="equal-weight"`; the count of `data-cta="primary"` on the page is unchanged
 * by their presence."*
 *
 * Until this file the criterion was asserted on three price tiers of
 * `/dein-kalender` (`e2e/pages/dein-kalender.spec.ts`) and on the tier
 * component in isolation (`src/components/price-section/price-tier-row.test.tsx`).
 * Nothing walked the scenes and the publishing paths, and nothing walked the
 * other eleven pages — so the rung was checked where it was already known to
 * hold. A18 is a site-wide sentence and this is the site-wide walk: both
 * languages of every `TS-WEB-0004` D1 page, one pass each.
 *
 * ── What counts as an explanatory module ──────────────────────────────────
 *
 * The three components A18 names carry their own seam: `scene-block` and
 * `publishing-path` render `data-mechanism` (the path adds `data-ordinal`),
 * `price-tier-row` and `offer-tier` render `data-offering`. So the module set
 * is read off the page, not off a per-route list that could go stale as pages
 * are composed. The unit is the **outermost** module, because a scene that
 * wraps a publishing path adds no CTA of its own — `scene-block`'s contract
 * says so and `/` is built that way: three outermost modules, one CTA each,
 * one of them a scene · path pair.
 *
 * One of them is **not** an explanatory module, and D3 is what says so: *"Every
 * explanatory module carries exactly one CTA, at secondary treatment, pointing
 * at **the deeper page's** primary conversion"*, while the ladder's primary rung
 * is *"the page's own conversion"*, exactly one per page. `/mitmachen` composes
 * its block 1 out of `scene-block` — measured: its hero scene carries the
 * page's single `data-cta="primary"` — and that element is the page's own
 * conversion on the primary rung, not a module CTA that escaped the secondary
 * one. Reading A18 as "no scene may ever contain a primary" would contradict
 * TS-WEB-0022-A2, which requires that primary to be there. So the walk
 * identifies block 1 **by position in the page's own block sequence** — the
 * first `[data-block]` — and exempts a module from the A18 count only when it
 * stands in that block. Every other module is measured, the module holding the
 * page's primary included: a price tier that swallowed the page's only
 * `data-cta="primary"` is then measured against "exactly one CTA, on a
 * secondary rung" and fails on the rung, and the primary count inside modules
 * is asserted to be exactly the block-1 one — zero on a page whose primary
 * stands outside every module. Identifying block 1 as "any module that happens
 * to contain a primary" would have exempted precisely the module that broke the
 * ladder.
 *
 * ── The one declared divergence ───────────────────────────────────────────
 *
 * Measured on 2026-09-26: `/dein-ort/starten` block 2.1 renders a
 * `scene-block` with **no** CTA at all (`app/[lang]/dein-ort/starten/page.tsx`),
 * and TS-WEB-0021 gives that block no CTA anywhere in its own determinations.
 * "Exactly one" is not "at most one", so the two specifications disagree about
 * one module on one route. That is a spec-owner's call, not a test author's, so
 * it is declared in `CTA_FREE_MODULES` with its reason (DEC-0144 §5,
 * `state/open.md` row 280) rather than silently folded into the assertion:
 * every other module is held to "exactly one", a second CTA-free module
 * anywhere fails, and the last case fails the moment the declared one gets its
 * CTA.
 *
 * **The two routes that carry that declaration do not name the identifier in
 * their title.** On them the criterion is measurably not met, so a title
 * carrying `TS-WEB-0006-A18` would report closed coverage for an open sentence —
 * the false green `DEC-0142` §9 took back for `TS-WEB-0018-A7` (DEC-0144 §10).
 * The ten other routes name it, because there the walk asserts exactly what A18
 * says. The criterion's ledger verdict comes from the tier tests that predate
 * this file (`e2e/pages/dein-kalender.spec.ts`,
 * `src/components/price-section/price-tier-row.test.tsx`), and those assert the
 * tier half, which holds.
 */

/** Scene blocks and publishing paths, price and offer tiers — A18's three kinds. */
const MODULE_SELECTOR = "[data-mechanism], [data-offering]";

/** The rungs a module CTA may sit on (TS-WEB-0006 D3, the ladder's third row). */
const SECONDARY_RUNGS = ["secondary", "equal-weight"];

/**
 * Modules that render no CTA today, by route and module key, each with the
 * reason. Removing a row here is part of fixing the module, and the last case
 * in this file is what makes that mandatory.
 */
const CTA_FREE_MODULES: Readonly<Record<string, string>> = {
  "/dein-ort/starten scene:whatsapp":
    "block 2.1 'what it takes' — TS-WEB-0021 composes it as a scene with no CTA and names none; TS-WEB-0006-A18 asks for exactly one (DEC-0144 §5, state/open.md row 280)",
  "/en/your-place/start scene:whatsapp": "the English mirror of the same block",
};

interface ModuleReading {
  /** `scene:<mechanism>`, `path:<mechanism>` or `tier:<offering>` — the module's key. */
  readonly key: string;
  /** The module keys composed inside this one, if any. */
  readonly nested: string[];
  /** `data-cta` of every CTA in this module's subtree, nested modules included. */
  readonly rungs: string[];
  /** Whether this module holds the page's one primary marker. */
  readonly holdsPagePrimary: boolean;
  /** Whether this module stands in the page's first `[data-block]` — block 1. */
  readonly inBlockOne: boolean;
}

interface PageReading {
  readonly modules: ModuleReading[];
  readonly primaryCount: number;
  /** Primary markers standing inside a module of any kind. */
  readonly primaryInModules: number;
}

/**
 * Every **outermost** module on the page, with the CTAs in its subtree.
 *
 * Outermost is the unit A18 counts, and `scene-block`'s own contract says why:
 * *"[the module it wraps brings a] single `data-cta="secondary"`, so the scene
 * adds none — wrapping does not [add a CTA]"*. On `/` each scene holds a
 * publishing path, and the pair carries one CTA between them; counting the
 * scene and the path as two modules would demand two CTAs where the
 * determination asks for one.
 */
async function readPage(page: Page, moduleSelector: string): Promise<PageReading> {
  return page.evaluate((selector) => {
    const keyOf = (element: Element): string => {
      const mechanism = element.getAttribute("data-mechanism");
      if (mechanism !== null) {
        return element.hasAttribute("data-ordinal") ? `path:${mechanism}` : `scene:${mechanism}`;
      }
      return `tier:${element.getAttribute("data-offering") ?? "?"}`;
    };

    const all = [...document.querySelectorAll(selector)];
    const outermost = all.filter((node) => node.parentElement?.closest(selector) == null);
    const primaries = [...document.querySelectorAll('[data-cta="primary"]')];
    // Block 1 is the first block of the page's own sequence, read off the
    // `data-block` seam every page composition carries — not "the module that
    // holds a primary".
    const blockOne = document.querySelector("[data-block]");

    return {
      modules: outermost.map((node) => ({
        key: keyOf(node),
        nested: all.filter((other) => other !== node && node.contains(other)).map(keyOf),
        rungs: [...node.querySelectorAll("[data-cta]")].map(
          (cta) => cta.getAttribute("data-cta") ?? "",
        ),
        holdsPagePrimary: primaries.some((primary) => node.contains(primary)),
        inBlockOne: blockOne !== null && (node === blockOne || blockOne.contains(node)),
      })),
      primaryCount: primaries.length,
      primaryInModules: primaries.filter((primary) => primary.closest(selector) !== null).length,
    };
  }, moduleSelector);
}

for (const { route, locale } of everyRoute()) {
  const path = href(route, locale);
  const declaredHere = Object.keys(CTA_FREE_MODULES).filter((entry) =>
    entry.startsWith(`${path} `),
  );

  // A route with a declared CTA-free module does not name the criterion in its
  // title: there "exactly one" is not what the page does, and a title carrying
  // the id would report the criterion closed (see the docblock, DEC-0144 §10).
  const title = declaredHere.length
    ? `A18 of TS-WEB-0006 on ${path}: every explanatory module but the ${declaredHere.length} declared CTA-free carries one secondary CTA — "exactly one" is not met on this route (state/open.md row 280)`
    : `TS-WEB-0006-A18: every explanatory module on ${path} carries one secondary CTA`;

  test(title, async ({ page }) => {
    await page.goto(path);
    await page.waitForLoadState("networkidle");

    const reading = await readPage(page, MODULE_SELECTOR);

    // The page's own conversion is one marker, in block 1 (D3). The only module
    // allowed to hold it is a module of block 1 — so on a page whose primary
    // stands outside every module this count is 0, and a module elsewhere that
    // holds the primary makes it 1 against an expected 0: "the count of
    // `data-cta="primary"` on the page is unchanged by their presence" read as
    // the clause it is.
    const blockOnePrimaries = reading.modules.filter(
      (candidate) => candidate.holdsPagePrimary && candidate.inBlockOne,
    ).length;
    expect(reading.primaryCount, `${path} primary markers`).toBeLessThanOrEqual(1);
    expect(
      reading.primaryInModules,
      `${path} primary markers inside a module, expected only block 1's`,
    ).toBe(blockOnePrimaries);

    const explanatory = reading.modules.filter(
      (candidate) => !(candidate.holdsPagePrimary && candidate.inBlockOne),
    );
    for (const explanatoryModule of explanatory) {
      const declared = `${path} ${explanatoryModule.key}` in CTA_FREE_MODULES;
      if (declared) {
        expect(
          explanatoryModule.rungs,
          `${path} ${explanatoryModule.key} is declared CTA-free`,
        ).toEqual([]);
        continue;
      }
      const where = explanatoryModule.nested.length
        ? `${explanatoryModule.key} (wrapping ${explanatoryModule.nested.join(", ")})`
        : explanatoryModule.key;
      expect(
        explanatoryModule.rungs,
        `${path} ${where} does not carry exactly one CTA`,
      ).toHaveLength(1);
      expect(
        SECONDARY_RUNGS,
        `${path} ${explanatoryModule.key} carries \`${explanatoryModule.rungs[0]}\`, which is not a secondary rung`,
      ).toContain(explanatoryModule.rungs[0]);
    }
  });
}

test("TS-WEB-0006-A18: the walk finds modules to measure on the pages that compose them", async ({
  page,
}) => {
  // The guard against a silently empty sweep: if the module seam is renamed,
  // every per-route case above passes on an empty list. These four pages are
  // the ones that compose scenes, paths and tiers, and their counts are the
  // ones measured on 2026-09-26.
  const expected: Readonly<Record<string, number>> = {
    "/": 3,
    "/mitmachen": 4,
    "/dein-kalender": 3,
    "/dein-ort/starten": 1,
  };

  for (const [path, count] of Object.entries(expected)) {
    await page.goto(path);
    await page.waitForLoadState("networkidle");
    const reading = await readPage(page, MODULE_SELECTOR);
    expect(
      reading.modules.map((found) => found.key),
      `modules on ${path}`,
    ).toHaveLength(count);
  }
});

test("TS-WEB-0006-A18: a module that has gained its CTA has to lose its declared exemption", async ({
  page,
}) => {
  const stale: string[] = [];
  for (const entry of Object.keys(CTA_FREE_MODULES)) {
    const [path, key] = entry.split(" ");
    await page.goto(path);
    await page.waitForLoadState("networkidle");
    const reading = await readPage(page, MODULE_SELECTOR);
    const declaredModule = reading.modules.find((candidate) => candidate.key === key);
    if (declaredModule === undefined || declaredModule.rungs.length > 0) stale.push(entry);
  }
  expect(
    stale,
    `declared CTA-free modules that are no longer CTA-free (or no longer exist) — delete them: ${stale.join(", ")}`,
  ).toEqual([]);
});
