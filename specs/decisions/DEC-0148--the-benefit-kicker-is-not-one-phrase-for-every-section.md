---
id: DEC-0148
title: The "benefit" kicker is not one phrase for every section
status: accepted
date: 2026-09-27
decided_by: jan-henrik.hempel
---

## Decision

CG-019's "benefit" section role names one fixed phrase, `WAS HILFT EUCH
DAS?`, and `src/lib/i18n/dictionary.ts` carried it as `kickers.whyItMatters`
— a single string every "benefit" section on the site reuses. Five sections
across three pages instantiate that role (`/dein-kalender`'s settings
section, `/dein-ort`'s three value stories, `/ueber-uns`'s village argument),
and the same question, repeated five times, reads as an internal analysis
prompt rather than reader-facing signposting — "wir müssen intern
beantworten, was das bringt" is not the same question a reader asks.

The role stays — a section that exists to state a concrete benefit is still
a legitimate, closed-set role (CG-019's table is otherwise unchanged) — but
it no longer carries one shared phrase. Each instantiation gets its own
short, declarative kicker naming what that section is actually about, still
centrally defined in `dictionary.ts` per polish brief G-3 (a page picks one,
it does not invent one), just no longer one-to-one with the role.

## The five, and why

| Section | Old kicker | New kicker (DE) |
| --- | --- | --- |
| `/dein-kalender` embed-config (control over content) | "Was hilft euch das?" | "Was ihr entscheidet" |
| `/dein-ort` story: Bäckerwagen | "Was hilft euch das?" | "Versorgung" |
| `/dein-ort` story: Ratssitzung | "Was hilft euch das?" | "Gemeindeleben" |
| `/dein-ort` story: Kultur | "Was hilft euch das?" | "Kultur & Tourismus" |
| `/ueber-uns` village argument | "Was hilft euch das?" | "Was ein Dorf braucht" |

The three `/dein-ort` stories take the design system's own existing category
words (`src/lib/live/categories.ts`'s `label.de`/`label.en` — "Versorgung",
"Gemeindeleben", "Kultur & Tourismus"), which already appear as category
pills elsewhere on the site: reused vocabulary, not invented. They are typed
directly into `dictionary.ts` rather than imported from `categories.ts`,
because that module classifies **live events** and importing it into static
marketing copy would tie two unrelated concerns together for a coincidence
of wording.

The other two are new, topic-specific phrases, following the same "Was +
verb + noun" pattern three existing kickers already use ("Was gerade
ansteht", "Was andere sagen", "Was es kostet").

## Consequences

- `dictionary.ts`: `kickers.whyItMatters` is removed (no remaining caller);
  `yourSettings`, `everydaySupply`, `communityLife`, `cultureAndTourism` and
  `whatAVillageNeeds` are added, in both locales.
- `app/[lang]/dein-kalender/page.tsx`, `app/[lang]/dein-ort/page.tsx`,
  `app/[lang]/ueber-uns/page.tsx` are updated to the new kickers.
  `dein-ort`'s `STORIES` table gains a `kickerKey` field per story, so the
  loop still renders one component with per-story data rather than
  duplicating the loop three times.
- `concept/website-copy-guide.md` CG-019's "benefit" row is corrected to
  say the phrase is per-section, not fixed; CG-018's kicker-form examples
  keep the still-valid ones and drop the retired phrase.
- `src/lib/content/validate.ts`'s CG-018 lint (which rewrote an author's
  "Warum das zählt" to "Was hilft euch das?") now points at CG-019's table
  instead of naming a single phrase, since there no longer is one.
