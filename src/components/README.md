# Components

The one component set for eleven pages. A page composes from here; it does
not grow a private variant of the header, the skeleton or the proof card
(`plan/component-inventory.md` is the brief, `concept/website-design-system.md`
is binding).

M2 built the **foundation set**: inventory §2.1 (design-system specified),
§2.2 (chrome and layout) and §2.6 (placeholders, states, errors) — 27
components. The argument blocks (§2.3), live-module shells (§2.4) and
conversion blocks (§2.5) are other work packages and land beside these,
under the same rules.

## The folder convention

```
src/components/<inventory-name>/
  <inventory-name>.tsx          the component, a server component by default
  <inventory-name>.module.css   its styles, tokens only
  <inventory-name>.test.ts(x)   where there is logic or an a11y contract
  <helper>.ts                   pure logic worth testing on its own
```

- **The folder name is the inventory name, kebab-case, verbatim.** The
  export is its PascalCase form: `event-row/event-row.tsx` exports
  `EventRow`. One vocabulary for content, schema and component (D-2).
- **Server-first.** `motion-reveal` and `back-to-top` carry `"use client"`
  because both need an observer; `archive-filter` (§2.3) is the one
  exception the inventory itself requires (TS-028 D4/D5: client-side
  filtering over rows already in the static HTML) — it renders nothing until
  mounted, so a visitor without JavaScript sees the full, unfiltered list
  rather than a dead control. Everything else renders on the server and
  ships no JavaScript.
- **No path, no string, no colour is typed at a call site.** Paths come from
  `src/lib/routes/`, UI strings from `src/lib/i18n/dictionary.ts`, every
  colour, type role, ratio and fixed height from a CSS custom property
  (`app/styles/components.css`, composed from the tokens in
  `app/styles/brand.css`). `pnpm check:brand` fails a colour or
  `font-family` literal anywhere else — **including in a comment**.
- **The component docblock is the contract.** Every component repeats its
  inventory determination in five lines — structure · states · inherits ·
  space · a11y — so the next reader does not have to hold the inventory open.
- Shared pieces live flat: `data-state.ts` (the four states),
  `route-link/href.ts` (query and fragment on top of the route facade),
  `section-shell/rhythm.ts` (the page-rhythm predicate), `gallery.tsx` (every
  component in every state, rendered by the test and by the dev route).

## How a page composes components

A page is a list of sections. Each section is a `section-shell` with a
surface and a density; the blocks stand inside it. The shell owns the
padding, so nothing inside adds its own — never a padded card inside a
padded section.

```tsx
import { SectionShell } from "@/src/components/section-shell/section-shell";
import { EventRow } from "@/src/components/event-row/event-row";
import { Button } from "@/src/components/button/button";

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const locale = resolveLocale((await params).lang);

  return (
    <>
      <SectionShell surface="ink" labelledBy="diese-woche">
        <h2 id="diese-woche">Diese Woche</h2>
        {events.map((event) => (
          <EventRow key={event.id} {...event} locale={locale} tone="dark" to="place" />
        ))}
        <Button locale={locale} onward to="place" variant="primary-dark">
          Alle Termine
        </Button>
      </SectionShell>
    </>
  );
}
```

Rules a page implementer has to keep:

1. **`section-shell` is full-bleed.** It brings its own `.container`, so the
   page must not wrap sections in another one. Only the section's *content*
   is contained; the colour runs edge to edge. (`contained={false}` for a
   block that must run edge to edge itself, such as `photo-surface`.)
2. **Rhythm is checked, not hoped for.** Run the page's surface list through
   `checkRhythm()` in the page's own test: no two photo sections adjacent, at
   most two consecutive sections of one colour family, one `ink` section per
   page, one `himbeere` element per screen.
3. **Every link carries the locale.** `locale` is a prop on every component
   that renders a link (`Button`, `Chip`, `RouteLink`, `EventRow`,
   `SiteHeader`, `SiteFooter`, `BreadcrumbTrail`, `Logo`, `SkipLink`). The
   page reads it once from `params` and passes it down.
4. **Targets are route ids.** `to="calendar"`, never `href="/dein-kalender"`.
   The id set is `RouteId` in `src/lib/routes/routes.ts`.
5. **Icons come from the `icon` component only**, at 18, 24 or 32 px, and
   always beside text.

### Wiring the chrome (for the page/layout implementer)

`app/[lang]/layout.tsx` currently renders placeholder chrome. The real
components are exported and ready:

```tsx
import { SkipLink } from "@/src/components/skip-link/skip-link";
import { SiteHeader } from "@/src/components/site-header/site-header";
import { SiteFooter } from "@/src/components/site-footer/site-footer";

<body>
  <SkipLink locale={locale} />
  <SiteHeader current={route} locale={locale} />
  <main id="main">{children}</main>
  <SiteFooter route={route} locale={locale} contact={…} newsletter={…} />
</body>
```

`SiteHeader` reads `HEADER_JOBS` and `HEADER_CALENDAR_ENTRY`, `SiteFooter`
reads `FOOTER_LEGAL_LINKS` and `legalAnchor()` — the layout passes only the
locale, the current route id and the two footer slots (`contact` for
`envoy-form-mount`, `newsletter` for the labelled newsletter mock). The
header publishes its height as `--site-header-height`; `legal-section` uses
that for `scroll-margin-top`. The layout keeps the `main` landmark and the
`#main` id, because `skip-link` jumps to it.

**The whole chrome is the layout's, and it is one per document**
(`app/[lang]/layout.tsx` → `app/[lang]/_chrome.tsx`, `state/open.md` rows 97
and 204). Never render a `header`, a `main` or a `footer` from a page: with
Cache Components on, the App Router keeps the last three route segments
mounted in hidden `<Activity>` boundaries, so anything a page renders is
still in the document after the visitor has clicked away from it — and
chrome rendered by a page therefore duplicated on every client navigation.
`_chrome.tsx` is a Client Component for the same reason: on a client
navigation the server never re-renders the layout, so the route id comes from
`useSelectedLayoutSegments()` (the internal, German segments — immune to the
locale rewrite, and resolved at prerender, so the JavaScript-less document is
correct too). `e2e/landmarks.spec.ts` walks navigations rather than loads and
holds the rule.

#### The header has two grounds and two disclosures

Both are Jan's round-3 decision (`state/open.md` rows 200 and 201), and both
are one component tree — every destination exists in the markup at every
width.

- **Ground.** Over a first block that is a `photo-surface` carrying a
  photograph the header lies transparent (`position: fixed`, items in paper
  over its own top scrim) and turns solid once the hero's bottom edge passes
  it. A route without one, or one with a breadcrumb trail between the header
  and the hero, stays solid. The fact stays content-derived rather than
  declared — a hero whose photograph is still missing renders the light hatch,
  which paper items could not sit on — but it is resolved for **every** route
  at once by `app/[lang]/_chrome-data.ts`, because the layout that renders the
  header cannot ask a page anything. A page therefore passes no `heroPhoto`:
  it names its hero entry in `src/lib/pages/hero-images.ts` (the one table
  both readers use) and passes `hero` to the surface that *is* the hero, so
  `photo-surface` marks it `data-hero` for the header to measure against.
- **Disclosure.** Below `md` the logo shows the mark alone (`compact`), the
  four job labels move into a full-screen `<dialog>` behind a burger, and the
  calendar entry stays in the bar. From `md` the labels are inline and the
  burger is gone. `HeaderShell` is the one client component of the chrome and
  owns both runtime facts; `menu-state.ts` holds the disclosure logic and is
  where it is tested.

## How states are passed

Four states, one vocabulary — `data-state.ts`, inventory rule 6 and decision
D-9. Every component that depends on late or external data takes a single
`state` prop and renders that state itself:

| `state` | what the component renders |
| --- | --- |
| `ready` (default) | the real data |
| `loading` | `skeleton` at the final geometry — no animation, ≤ 2 s |
| `empty` | the honest, designed state: publisher invitation, "Foto gesucht", or nothing where the parent owns the invitation |
| `degraded` | the data it has, plus the module's `freshness-label` ("Stand: …" or "Beispiel"). **Never** a spinner, an error sentence, a warning icon or a retry control |
| `mocked` | full dummy data plus `demo-data-badge`, and a `Mock aktiv` row in `state/open.md` |

```tsx
<EventRow {...event} state={events.tier === "snapshot" ? "degraded" : "ready"} />
<MediaFrame alt={photo.alt} src={photo.src} state={photo ? "ready" : "empty"} />
```

Who owns which state:

- **The row owns its own geometry, the list owns emptiness.** `EventRow`
  with `state="empty"` renders nothing — an empty *list* is the publisher
  invitation, which is a conversion and belongs to the module around the
  rows.
- **The module owns the marking, not the row.** A mocked list renders one
  `demo-data-badge` in its frame; the rows carry `data-demo="true"` so the
  check can see them. `photo-surface` and `media-frame` carry the badge
  themselves, because each is one asset.
- **Staleness is a label, not a state of the data.** `freshness-label`
  stands in the module's header row, which reserves the line, so its
  appearance shifts nothing.
- A component with **no** data dependency takes no `state` prop at all.
  Adding one to make an API symmetric is how the spinner comes back.

## Checking

- `pnpm test` — the component tests. `gallery.test.tsx` renders every
  component in every declared state and asserts the contracts that are the
  same everywhere: icons `aria-hidden`, every `nav` named, every image with
  `alt`, every button with a `type`, every date a `<time datetime>`, no
  colour literal in the markup, every internal href a route-table path.
- `http://localhost:3100/dev/components` — the same tree in a browser, for
  the visual check. It is a development route: it answers 404 on production
  and no page links to it.
- `pnpm check` — the gate. Brand check, types, lint, tests.
