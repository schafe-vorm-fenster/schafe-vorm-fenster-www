---
id: DEC-0013
title: No third-party embeds
status: accepted
date: 2026-09-09
decided_by: jan-henrik.hempel
---

## Context

Embedded players (SoundCloud, YouTube, social posts) load third-party
trackers and would break the cookieless, banner-free promise.

## Decision

External media are represented by own previews (screenshot, quote from
`media-echo/`) plus an outbound link. No third-party players, no
click-to-load layer.

## Consequences

No consent UI is ever needed; the CSP allowlist stays minimal (DEC-0015).
→ FUN-WEB-0095.

## Amendment 2026-09-25 — one named exception: the registration surface

**The registration form stays visibly embedded until it is rebuilt.** Decided
at the audit of 2026-09-25 (A1). The form that takes a registration today is a
Google Form, it is embedded on `/start` on the live site, and taking the embed
away before there is anything to replace it with would remove the only working
registration the site has.

`TS-WEB-0016 D6` read the other way — *"Linked, never embedded. Today's `/start`
embeds the form; the relaunch must not"* — and that rule is reversed for this
one surface and for nothing else.

**Why this is an exception rather than a hole in the rule.** The subject of the
Decision above is *external media*: a player or a social post that loads a
third party into a page for every visitor who merely **sees** the surface. A
visitor reaches the registration surface in order to register; the embed is
what she came for, not something laid over what she came for. That is the same
shape as the one exception already on the record — the Portalize demo, *"our own
product, which is why it is decided separately"* (DEC-0030, `TS-WEB-0008 D7`) —
except that here the third party is not ours, which is why the exception is
scoped as tightly as it is:

- **One route.** `/start` and no other. No component, no fallback, no lead
  surface, no section may embed anything; every other lead surface still links
  out through `/start` (`TS-WEB-0016 D6`).
- **Visibly.** Not behind a click-to-load layer, not folded into a `<details>`,
  not replaced by a link that claims to be the form. "Visibly embedded" is the
  decision's own word and it is the part a rebuild would otherwise quietly
  drop.
- **Until it is rebuilt.** The exception lapses when the envoy widget lands
  (`Q-0022`) or the app's registration entry gains a contract (`DEC-0029`).
  It is not a position, it is an interim with a named end.
- **`FUN-WEB-0095` is untouched.** External media are still own previews plus
  outbound links, and `TS-WEB-0016 D9` keeps every one of its rules.

**What this exception costs, stated rather than absorbed.** The Consequences
above say *"no consent UI is ever needed; the CSP allowlist stays minimal"*, and
both halves are now qualified on that one route: the embed needs a `frame-src`
entry, and whether it creates a consent duty is a legal question nobody here
can answer. `NFR-WEB-0061` and `NFR-WEB-0062` require the site to be
banner-free, and `TS-WEB-0013 D5` calls consent *"the disqualifier"*. That
collision is real and is recorded as `CONF-0025` with `DEM-0066` against legal
and `Q-0078` in the register — not resolved here, because the answer is a legal
determination and this record cannot supply one.

