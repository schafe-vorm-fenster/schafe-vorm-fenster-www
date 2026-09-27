---
id: DEC-0146
title: "\"The app\" is community-site; community-calendar is being abandoned"
status: accepted
date: 2026-09-27
decided_by: jan-henrik.hempel
---

## Decision

Every requirement here that says "the app" — `CON-WEB-0010`, `DEC-0047`,
`Q-0040`, `Q-0041`, `DEM-0031` — names the repository **`community-site`**.
It is a Next.js site with some PWA behaviour today, `www.schafe-vorm-fenster.de`
routes to `schafe-vorm-fenster-www` (the relaunch this repository builds) and
the bare `schafe-vorm-fenster.de` domain routes to `community-site` already
(verified via the Vercel project's domain list, 2026-09-27). It will keep
being extended, and is planned to move to an `app.` subdomain later.

`community-calendar` was a parallel attempt to build "the app" from scratch
(Astro/Svelte). The tendency as of this date is to abandon it and extend
`community-site` instead. Nothing here depended on `community-calendar`, so
nothing needs to be undone by this reversal — but any future reading of
"the app" in this specification, or in `go-to-market-os`, means
`community-site`, not `community-calendar`.

## Consequences

- **Q-0041 / DEM-0031 get an addressee.** "The app team" is whoever owns
  `community-site`. The demand itself — a public help URL contract and a
  destination for the 37 support articles — is **not yet answered**: naming
  the repository is not the same as `community-site` publishing the contract
  or the articles landing there. Both rows stay `OPEN` until that happens.
- `content/support/` (37 articles, schema already in
  `src/domain/content-frontmatter.schema.ts`) is the source the migration
  reads from once `community-site` is ready to receive it.
- DEC-0047's interim redirect (`/hilfe/*` → app root) is unaffected — it
  already resolves to whichever "app" `Q-0041` eventually names, and now
  that is a concrete domain rather than a placeholder.
- `community-calendar` needs no decision record of its own here: it never
  had a demand, a citation or a requirement resting on it in this
  specification.

## Source

Owner statement, 2026-09-27 (this repository's session record; not a
`go-to-market-os` source document).
