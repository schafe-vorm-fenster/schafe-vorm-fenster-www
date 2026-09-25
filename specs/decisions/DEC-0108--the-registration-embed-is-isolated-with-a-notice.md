---
id: DEC-0108
title: The registration embed is isolated with a notice above it — a notice is not consent, the banner-free requirement stands, and the residual legal risk is accepted on one route
status: accepted
date: 2026-09-25
decided_by: jan-henrik.hempel
---

## Context

`Q-0078` asked whether the registration form embedded on `/start` creates a
consent duty. The question was raised by the DEC-0013 amendment of 2026-09-25,
which made the embed a named exception to "no third-party embeds" because it is
the only registration that works today (`FUN-WEB-0205`, `TS-WEB-0016 D15`).
`CONF-0025` recorded the collision it creates with the banner-free requirements,
`DEM-0066` asked legal for a determination, and until today nothing was decided:
the conflict stood `OPEN` against no decision record and `TS-WEB-0016 D15` said
"not settled here".

The question was put to the owner with the concrete scenarios. **His answer is
to isolate it**: keep the embed visible and immediate, on that one route only,
not indexed, with a short notice above it saying what happens on load. **No
consent banner and no click-to-load layer.**

Two things had to be checked before that answer could be written down, because
either of them would have made it false rather than merely risky.

**First, whether a notice is consent.** It is not, and the distinction is not a
word game: consent is a decision the visitor makes *before* the processing, and
the page waits for it. A notice is information the visitor reads *while* the
processing happens, and the page waits for nothing. The requirement that is at
stake counts consent-banner components, not notices — see §3.

**Second, what the banner-free requirements actually say.** `NFR-WEB-0062` and
`NFR-WEB-0061` were read line by line rather than by their reputation, together
with `TS-WEB-0013 D5`'s "the disqualifier is consent" and `TS-WEB-0012 D1`. One
of the four says something stronger than banner-freedom and this decision does
make it false. §3 and §4 record which, and amend it.

## Decision

### 1. ISOLATE, as `CONF-0025` recommended — and the record now says so

The embed stays where it is and as it is: `/start`, visible, immediate, the
whole content of the route, `noindex`, absent from the sitemap, in no page's
flow, with the e-mail address beside it for a visitor who declines Google
(`TS-WEB-0016 D15`, `D6`). Nothing else on the site embeds anything.

`CONF-0025` moves to `RESOLVED` with outcome **ISOLATE** and this record as its
`decision_record`. Why that and not the other two:

- **REJECT_NEW** would withdraw the embed and with it the only registration that
  exists. `TS-WEB-0023 D9` forbids every submission mechanism on
  `/mitmachen/registrieren` and the app's registration entry has no contract
  (DEC-0029, DEM-0034), so there is nothing to fall back to.
- **NEW_VERSION** would mean a consent gate or a click-to-load layer. Both
  contradict the "visibly" the embed was decided with (`FUN-WEB-0205`), and a
  click-to-load layer is itself the thing `TS-WEB-0013 D2` says this site does
  not build.
- **ISOLATE** is what the situation already is, and recording it is the point:
  the collision is confined to one route instead of the banner-free claim being
  quietly qualified everywhere.

**Why the register may resolve while `DEM-0066` is still open.** `DP-04` is the
owner's at every impact level (`POL-GRADED-BY-IMPACT`) and it has now been
exercised; a conflict left `OPEN` after its decision point has been taken
misreports the register's own state. `CONF-0013` is the precedent — `RESOLVED`
on DEC-0081 with `DEM-0001` still open against the source. **`DEM-0066` is not
waived.** A waiver would mean the answer no longer matters, and it does: it is
the named trigger of §5. What changed is that it no longer blocks the artefact.

### 2. The notice, as a determination — what it must achieve, never its words

`TS-WEB-0016 D17` is the determination and `FUN-WEB-0206` is the requirement it
discharges. The notice is specified by position and by what it must convey:

| Aspect | Determination |
| --- | --- |
| Where | **above the embed**, in DOM order and visually, inside the same region, before the embed's own box — so a visitor reading down the page meets it before the form and a screen reader announces it first |
| When | **before the embed loads visually.** The notice is part of the prerendered document and carries no data dependency; the embed's frame may not be what paints first |
| That it is Google's | the form is a third party's, not ours, and it is named |
| That loading it contacts that third party | the request happens on load, without her acting — the notice does not pretend she has a choice she does not have |
| Where the detail is | the data-protection section of `/rechtliches#datenschutz`, as a link |
| Length | short. One block, no heading of its own, no list |
| What it is **not** | not a control. No button, no checkbox, no dismiss, no "load the form" — nothing on the page waits for it, and it is not a consent control (`TS-WEB-0016-A23`'s last sentence already says what a marking may not be) |
| The words | **not here.** The sentence is copy and belongs in `content/` (`DEC-0083 §1`); this determination fixes the position, the three facts and the link target, and the content phase writes it |

`TS-WEB-0016-A22` is extended to assert it, rather than a new criterion being
minted: the notice and the embed are one determination's two halves and A22 is
already the walk over that route.

### 3. The banner-free requirements, read

**`NFR-WEB-0062` stands, unchanged.** Its statement is *"Consent-banner
components in the rendered tree SHALL be = 0 components"*, measured by
`TS-WEB-0012-A1`. It counts banner components. A notice is not a banner
component: nothing is gated, nothing is stored, nothing is waited for, and the
count stays 0 on `/start` as everywhere else. The banner-free claim therefore
holds, and it holds because of what the requirement says, not because the
requirement was read generously.

**`NFR-WEB-0061` is amended, because it is the one that says something
stronger.** Its statement covers *"analytics cookies and persistent identifiers
after a full journey across the website"* at `= 0`, and its meter is
`TS-WEB-0012-A2`, whose walk goes over *"all D1-inventory pages"*. `/start` is a
row of the `TS-WEB-0004 D1` inventory, so the journey now runs through the
embed, and whether a Google-hosted form sets a persistent identifier is exactly
what nobody has confirmed (`CONF-0025`'s confidence line, `DEM-0066`). A
requirement that would be falsified by a route it silently includes is not a
requirement, it is a trap. **It is amended to name the exception** rather than
reinterpreted: the scale excludes the registration surface, the exception cites
`FUN-WEB-0205` and this record, and the `## Notes` section says what the
exclusion costs.

**`TS-WEB-0012-A2` is amended with it**, and this is the part worth naming. Its
last clause — *"no request goes to a host outside the D7 collectors"* — is
**stronger than the requirement it meters**: it forbids a third-party request,
where `NFR-WEB-0061` forbids a persistent identifier. Under the old inventory
the two coincided. They no longer do, and the criterion, not the requirement,
was the artefact asserting the stronger thing. It now walks the inventory minus
`/start` for that clause and asserts on `/start` that the form host is the only
extra origin.

**Two determinations carried the stronger claim in prose and are corrected:**

- **`TS-WEB-0012 D1`**, row *"No consent UI anywhere on the site"*, gave as its
  consequence *"there is nothing to consent to; DEC-0013 keeps it that way by
  banning third-party embeds"*. The rule still holds; **the reason is now
  false** — DEC-0013 has a named exception since 2026-09-25. The row keeps its
  rule and takes the true reason.
- **`TS-WEB-0013 D1`**, the claim table, read *"no consent banner | no
  processing on the page requires consent, so no consent layer exists at all"*.
  That is a claim about processing, not about layers, and under `CON-WEB-0016`
  the site makes no claim it cannot prove — which on `/start` it cannot. The
  row is narrowed to the pages the claim is actually made on, and `/start`
  makes no claim at all: it carries the notice instead.

**`TS-WEB-0013 D5` needs no amendment and that was checked.** Its disqualifier
sentence — *"If a candidate would make a consent banner necessary, it is
rejected at rung 3"* — governs **candidates at rung 3**, and the embed is not a
rung. D5's own table already says so: *"embed it as a third party — not
available (DEC-0013). One named exception exists and it is not a rung."* The row
is updated to point at this record instead of at an unanswered question; the
rule above it is untouched.

### 4. The residual risk is recorded, not resolved away

The owner accepted a legal risk on one route with his eyes open, and the records
say so where a reader will meet it. This is not a caveat in a decision nobody
re-reads: it is written on **the decision record (this §), the requirement
(`NFR-WEB-0061 ## Notes`), the conflict record's outcome, and the determination
(`TS-WEB-0016 D15`)** — the four places a reader arrives from.

What is accepted: **that a third party is contacted on one route without the
visitor having acted, and that no legal determination says this needs no
consent.** Not that it has been cleared. `DEM-0066` is open and stays open.

### 5. What would change it

Either of these reopens `DP-04`, and neither is time passing:

1. **A data-protection authority's view, or the legal determination `DEM-0066`
   asks for**, holding that an embed of this kind needs consent. Then ISOLATE is
   insufficient and the permitted outcomes are the other two — which in practice
   means the rebuild, because a consent gate contradicts `FUN-WEB-0205`.
2. **The rebuild that removes Google.** `FUN-WEB-0205` lapses when the envoy
   widget lands (`Q-0022`) or the app's registration entry gains a contract
   (`DEC-0029`). Then `/start` stops embedding anything, `NFR-WEB-0061`'s
   exception is struck, and this record's risk section goes with it.

## Consequences

- `FUN-WEB-0206` enters the specification — the next free number in its family,
  nothing renumbered. It is `S3` on this record, `needs: [NEED-WEB-0004]`, and
  `fit_criterion: UNKNOWN` because `TS-WEB-0016-A22` is not referenced by a test
  (DEC-0095).
- `TS-WEB-0016` gains `D17`, extends `A22`, adds `FUN-WEB-0206` to `implements:`
  and to its Coverage table, and `D15`'s "Not settled here" row becomes the
  decided row with the residual risk on it.
- `NFR-WEB-0061`'s statement, `fit_criterion.scale` and `## Notes` carry the
  `/start` exception; `TS-WEB-0012-A2` carries it too. `NFR-WEB-0062` is
  untouched.
- `TS-WEB-0012 D1` and `TS-WEB-0013 D1` take the true reason for a rule that
  still holds; `TS-WEB-0013 D5`'s exception row points at this record.
- `CONF-0025` is `RESOLVED`, outcome ISOLATE, `decision_record: DEC-0108`;
  `DEM-0066` stays `OPEN` and is no longer blocking.
- `Q-0078` closes.
- **No acceptance criterion was added, renamed or removed; the count is
  unchanged at 425 and the test-reference count is unchanged.** The notice is
  asserted by the criterion that already walks the route.
- **No deviation record and no new demand.** `DEC-0104 §2` records a
  disagreement with a **source**; this is a collision between two specification
  artefacts, which is what the conflict register is for, and `SRC-0006`'s two
  excerpts are about *tracking* cookies and *our* banner — neither is
  contradicted here. `E27` therefore has nothing to fire on, correctly.
- Nothing moved off `DRAFT`. No consent gate, no click-to-load layer and no
  wording was specified.

### Still owed, and sharpened by this record

The form host has **no row in `TS-WEB-0013 D2` and no entry in the CSP
allowlist** (`TS-WEB-0014 D1`), which `TS-WEB-0016 D15` already recorded as owed
and deferred to the rebuild decision. Two criteria now fail on it rather than
merely lacking it: `TS-WEB-0013-A1` traces every `TS-WEB-0004 D1` route and
fails on a host outside `D2`, and `TS-WEB-0013-A4` requires the deployed CSP to
equal the `D2` host set exactly. The row is not written here — `D2` and the
allowlist are those specs' and they are one set seen from two sides — but the
consequence is recorded as an open point on `TS-WEB-0013` instead of being
discovered on a red run.
