---
id: DEC-0166
title: The archive becomes the press page — every media-echo entry as a citation, reached from /ueber-uns, the footer and /presse, never from the main menu
status: accepted
date: 2026-10-14
decided_by: jan-henrik.hempel
---

## Context

The owner's review of 2026-10-12 (DEC-0154, Nachtrag; issue #56) asked for
all press material on the website, and ruled that "Presse" is not an item in
the main menu. Two determinations of `TS-WEB-0028` stood in the way, and
`Q-0093` held them open:

- **D1** made `/ueber-uns/archiv` "not a destination": never teased from
  another page, never linked as proof. The new `/ueber-uns` design (#55,
  DEC-0162) carries a button "Presse und Auszeichnungen" in its award block,
  which needs a target.
- **D3** showed only entries with `usage_rights: cleared`, and none of the 31
  entries of `@schafe-vorm-fenster/media-echo@0.3.3` carries the field
  (`Q-0045`). Under D3 the page rendered empty in production; the rows on the
  page came from the content artifact with a "clearance pending" note.

## Decision

The owner answered `Q-0093` on 2026-10-14: **no legal clearance is needed —
the press articles we have are citations and references and may be shown.**

1. **Every media-echo entry is shown, as a citation.** A row carries the
   outlet, the date at its stated precision, the title as the entry records it,
   the link to the original where the entry has one, and — where the entry has
   one — a short quotation, rendered as a `blockquote` in quotation marks with
   the outlet as its source line. The quotation is the first quotation of the
   entry's `## Original Text` (or the schema's `## Key Quotes`) section,
   verbatim; today three entries have one. `usage_rights` no longer removes a
   row from this page.
2. **No third-party image.** Article photos, scans and third-party logos are
   not citations: no row gets a preview, and nothing from an entry's `media`
   list ships. `usage_rights` keeps governing images and logos everywhere,
   and `FUN-WEB-0033` keeps governing the scored proof elements of the
   relevance engine — this page does not score.
3. **The page is a destination, named "Presse und Auszeichnungen" / "Press
   and awards".** The name is the link text of the `/ueber-uns` design and
   `Q-0093`'s; it becomes the page's `h1` and title. The URL stays
   `/ueber-uns/archiv` (`/en/about/archive`). It is reached from:
   - the button in the award block on `/ueber-uns` (already pointing there);
   - a footer link "Presse" / "Press", first in the existing link row before
     the three legal links, so the footer gains a link and not a row
     (SRC-0014 §Site footer, the 500 px budget of `e2e/footer.spec.ts`);
   - `/presse` (the legacy row, unchanged) and a new `/en/press`, both
     permanent redirects from the one redirect table
     (`src/lib/routes/redirect-map.ts`). They stay **301**: TS-WEB-0011 D1 fixes
     one status for every row of that table, and a 308 for one row would
     split it for no gain — both are permanent.
   It is **not** in the header navigation (TS-WEB-0004 D4 unchanged).
4. **D1's other bans stay**: no own CTA, no form, no newsletter field, no
   events; `primaryConversion: null`. A press contact, when one is wanted, is a
   plain `mailto`.
5. **Each row has an anchor** — the entry's file stem, `#<id>` — so a deeplink
   from a curated strip on `/ueber-uns` (#36) can land on one row later.
6. **The filter matches on the hub's type ids**, the labels come from the
   dictionary. The table used to carry localized labels, which the filter
   split on spaces — the "Social Media" chip matched no row. An entry with two
   types (NØRD 2026: `award`, `conference`) now appears under both.
7. **The rows stay in the content artifact**, the way every page carries hub
   content; `src/lib/content/media-echo-citations.integration.test.ts` holds the
   table against the installed package — every entry once, fields verbatim,
   order, quotations — so it cannot drift into a copy (working rule 7).

## Consequences

- `TS-WEB-0028` D1, D3, D4 (stock), D6 and D7 are amended; `A7` is superseded
  by `A15`; `A16`–`A18` are new. `Q-0093` is answered.
- `TS-WEB-0004` D4's footer bullet names the press link; `TS-WEB-0011` D2 gains
  the `/en/press` row; SRC-0014 §Site footer and the contract's `site-footer`
  row name the press link. The archive row is still outside SRC-0014's
  component set (`Q-0044`); its quotation is specified in `TS-WEB-0028` D7.
- Indexability is unchanged: the route was already in the sitemap
  (`app/sitemap.ts` lists every route of the registry) and was never `noindex`.
- Not done here: the curated quote strip on `/ueber-uns` (#36, #38) and a
  press-kit block (logo, photos, short text) — both outside #56's acceptance.
