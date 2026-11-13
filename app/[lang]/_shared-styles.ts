/**
 * Issue 235, 240: one entry that pulls every page-only CSS module into the
 * root layout's chunk.
 *
 * Why: a page-only stylesheet becomes its own CSS chunk. Next prefetches the
 * segment of every page the nav links to, and React then emits a
 * `<link rel="preload" as="style">` for that chunk into the *current*
 * document. The current page never applies it, so the browser logs "was
 * preloaded using link preload but not used". A stylesheet that rides in the
 * layout's chunk is already loaded, so no preload is emitted.
 *
 * Rule: a CSS module imported from a file under `app/[lang]/` (a page or its
 * private helpers) is listed here too. `scripts/check-shared-styles.test.ts`
 * fails when one is missing. Components under `src/components/` that only one
 * page renders are not covered by that test; check a new one with the build
 * (CONTRIBUTING.md, "Page-only stylesheets") and add it here when it forms its
 * own chunk (`story-disclosure` did, issue 235).
 */
import "./dein-kalender/bestellen/page.module.css";
import "./mitmachen/registrieren/register.module.css";
import "./rechtliches/page.module.css";
import "./ueber-uns/page.module.css";
import "./_nearby-section.module.css";
import "./_pages.module.css";
import "@/src/components/story-disclosure/story-disclosure.module.css";
