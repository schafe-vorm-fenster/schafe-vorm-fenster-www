---
id: DEC-0131
title: The configuration block is its own block, the tiers are rows, and the product sentence moves under the row it belongs to — plus the two links `/dein-kalender` no longer carries
status: DRAFT
date: 2026-09-26
decided_by: the engineering team
---

## Context

`T-13` rebuilt `/dein-kalender` against the 2026-09-22 review, the six design
drafts of 2026-09-23 and `DEC-0081`, `DEC-0106`, `DEC-0118` and `DEC-0122`.
Most of it was determined: the hero's equal-weight CTA becomes an in-page link
(`TS-WEB-0024 D3`, `DEC-0081 §3`), the comparison block names no product
(`DEC-0106 §2`), the tiers take `T-06`'s `price-section` set (`DEC-0118`), the
region tier is "auf Anfrage" and its map view is announced with its date
(`plan/reviews/2026-09-23/decisions.md` rows 9, 10, 11).

Eight things the specification leaves open had to be taken to build it, and
they are recorded here together because they are one composition.

## Decision

### 1. `embed-config` is a block of `TS-WEB-0024 D2`, not a part of `embed-demo`

The review asks for a settings section with a benefit band, six settings and
an outbound link to the Portalize config repo. `D2` listed six blocks and the
settings lived inside `embed-demo`'s content slot, which is how the embed
section came to measure **1772 px at 390 px** — a screen and a half over the
section budget — with the settings reading as fine print under the picture
rather than as the answer to *"but can we decide what is in it?"*, which is
the question the 480 € tier turns on.

So `D2`'s table gains a seventh row and `TS-WEB-0024-A2`'s DOM order gains
`embed-config` between `embed-demo` and `tiers`. No determination is
renumbered, no status is promoted, and `D5`'s heading and labelling rules
carry over to the new block unchanged. This is the default the owner already
took (`backlog.json` → `owner_decisions_defaulted`: *"/dein-kalender keeps the
configuration block as its own `embed-config` data-block; TS-WEB-0024 D2/A2
are amended to list seven blocks"*); it is written into the spec here.

The block stands on **`paper`**, not on the `surface-2` it used to have.
`SRC-0014` §Page Rhythm: *"Grey-green never carries positive content. It reads
dusty, which is right for the old world and wrong for what the product does"*
— and the review says the same thing in its own words ("das Hellgrau-Grün
wirkt negativ und angestaubt"). The `lime-500` benefit band inside it runs
edge to edge, the way `price-band` does, because a band framed by the
section's 16 px padding is a picture in a mount.

Consequence for the rhythm: `embed-config` and `tiers` are two neutral grounds
in a row, so the proof block moves from `paper` to `lime-100`. Three of one
family is the rule `checkRhythm` holds, and `app/[lang]/dein-kalender/rhythm.test.ts`
now asserts the nine-entry sequence.

### 2. `A8`'s "exactly one heading element" is read as one *section* heading

`TS-WEB-0024-A8` asks for *"exactly one heading element and exactly three tier
elements"* inside `data-block="tiers"`. `D6` leaves the module's visual form
[FREE], and the form the design drafts and `DEC-0118` fix — `price-band` over
three `price-tier-row`s — gives the band an `h2` **and** each tier an `h3`
title. Four heading elements, by the criterion's letter.

The criterion's substance is that the three tiers stand under **one** heading
rather than under three competing ones, which is exactly what the built module
does: one `h2` names the section, three `h3`s name the tiers inside it, and
the tier titles are what an outline reader needs to tell the tiers apart. The
e2e test asserts that shape — one `h2`, three `h3`s, three `data-offering`
rows — rather than the literal count.

`A8` is **not** amended: `T-13` owns `D2` and the `A2` list only, and the
criterion's wording is a spec owner's to fix. The disagreement is recorded
here so the next reader does not take the four headings for a defect.

### 3. `D7`'s product sentence stands under tier 2's row, inside the tiers block

`D7` (FIXED) puts the one occurrence of the product name *"in tier 2's body
copy"*. `price-tier-row` has no body-copy slot — it is kicker, title, price,
three checks and one CTA (`T-06`, design-system contract §7) — and the drafts'
three check lines for the 480 € tier carry no product name, so the sentence
has nowhere to go inside the row.

It is rendered as one paragraph **directly beneath tier 2's row, inside
`data-block="tiers"`**. `D7`'s substance holds: the name occurs exactly once
in the rendered text of the route, at the tier where the price is read, and
in no heading, link label, `<title>`, meta description or JSON-LD. Only
`A9`'s locator changes, from *inside the `portalize-calendar` tier element* to
*inside the tiers block*, and the e2e test says so in its own comment.

The alternative — dropping the name from the page altogether, which
`DEC-0106 §3` explicitly permits (*"a page without the name passes"*) — was
not taken. `D7` is FIXED and says exactly 1, `DEC-0106` reopened the *choice
of name*, not the floor, and a paid page that never names what is being sold
is a worse defect than a paragraph outside a row.

**The paragraph carries the hairline.** `price-tier-row` divides its rows with
`.row + .row`, and a paragraph between two rows breaks that adjacency, so the
note draws the 1 px `line` that would otherwise sit above the region tier.
Three rows, one divider each, as `SRC-0014` §Page Rhythm has it.

### 4. The config-repo link renders only when a URL is configured

The review asks for a link to the Portalize configuration repository (*"Dafür
gibt es ein Repo, das verlinken wir hier"*) and the draft draws it. **No
record in this repository names the URL** — not an offering, not a hub
package, not the environment.

`src/lib/embed/config-repo.ts` reads `NEXT_PUBLIC_PORTALIZE_CONFIG_URL` and
defaults to `null`; the block renders its six settings and no link at all
while it is `null`. This is the S3 shape `src/lib/live/briefing.ts` already
uses for the appointment URL — one configured value, referenced by the one
placement — and it is the only honest option: inventing a URL would ship a
dead link from the page that asks for 480 €, and `SRC-0001` §4 forbids filling
a gap by invention. `state/open.md` carries the row that asks the owner for
it.

This is the owner's own default (`backlog.json`: *"the config-repo link
renders only when a URL is configured"*), recorded.

### 5. What is copy, what is a placeholder, and what left the page

Every sentence on the rebuilt page is the owner's, from the 2026-09-22 review
or the 2026-09-23 drafts, cited in the content artifacts beside the text it
governs — **except the nine tier check lines**, which are the drafts' and
which the owner has not confirmed. They ship in their own slot,
`dein-kalender-4-tiers-checks-demo`, `provenance: generated; demo: true`,
with a row in `state/open.md` (`DEC-0068`, `src/lib/content/validate.ts`
lines 112–133). This too is the owner's default (*"the drafts' three lines per
tier, demo-marked"*).

Three deviations from the drafts, each with a source rather than a taste:

- **No "Umkreis"** under the `Orte` setting —
  `plan/reviews/2026-09-23/spec-impact.md` line 315: it is in no offering
  record and collides with `TS-WEB-0026-A2` and `TS-WEB-0005 D1`.
- **No "im Amt"** in the benefit band and no "Niemand im Amt" in the hero —
  `SRC-0017` CG-036, which the review applies to this very sentence.
- **No "Postleitzahlen"** in the comparison block's fourth row — the copy
  guide's avoid list, `DEC-0079`: a place name is where you are from, a
  postcode is an abstraction.

And three links left the page, all for the same reason (`DEC-0081 §3`: the
appointment URL occurs once, in the contact section's first action row):
the hero's outbound briefing button, tier 2's briefing link, and the closing
block's quiet footer link. With them went the `BRIEFING_DISCLOSURE` sentence
the page rendered under the hero control — there is nothing outbound left on
this page to disclose — and the `G-5` test that asserted it.
`e2e/contact-section.spec.ts` loses `calendar` from its
`BRIEFING_HREF_REPOINTED_BY` list, which is what that list is for.

### 6. The G-4 section budget gives, and the exception is measured

`tiers` measures **1632 px** and `embed-config` **1786 px** (de) / **1713 px**
(en) at 390 px, against `e2e/section-budget.spec.ts`'s 1270 px budget.

`tiers` cannot be cut. `SRC-0014` §Page Rhythm: *"The three price tiers are
rows inside one section, divided by a 1 px `line` hairline — never a 2 px lime
rule, never three sections."* Three tiers with a kicker, a title, a price,
three checks and a CTA each do not fit 1.5 phone screens, and splitting them
is the thing the design system forbids by name.

`embed-config` is one section with one kicker in the review and in both
drafts, and G-3's kicker vocabulary is closed — the second half would have no
role name to open with.

Both are recorded in that file's **ratchet** at their measured height rather
than by loosening the threshold: they may shrink, they may not grow by more
than 5 %. This is the same collision `state/open.md` row 242 already records
for `/mitmachen`, decided the same way: where the design system and the polish
budget disagree, the design system wins and the exception is written down with
its measurement. Row 247 carries it.

### 7. The example sentences lose the word "Beispiel:"

The drafts label each setting's example *"Beispiel: …"*. Jan's decision of
2026-09-18 forbids that word anywhere a visitor reads it — *"no page, in
either language, may carry a visible or screen-reader-audible hint that
something on it is a stand-in"* — and `e2e/content-compliance.spec.ts` fails a
build on it. The sentences ship unchanged without the label: `setting-row`
already sets the core sentence and the example apart typographically, so the
label said nothing the row does not show. The SEO description avoids the word
for the same reason.

### 8. `comparison-table`'s column labels are required props, not defaults

`TS-WEB-0024 D4` says *"The second column names no product"* and `SRC-0017
CG-039` lists *"das Produkt"* and *"Portalize (outside the one sentence)"* among
the words a page does not write. The component carried
`withProductLabel = "Mit Portalize"` as a parameter default, so the rule held
only for callers that remembered to pass a label: `/dein-kalender` passed both
off its content table head and was safe, while the component gallery's entry 26
passed neither and rendered *"Mit Portalize:"* four times.

A default cannot hold a *"names no product"* rule, and choosing an empty string
instead would render a bare colon. So **both labels are required props with no
default** — `todayLabel` and `withProductLabel` — and the type checker, not a
reviewer, is what stops the next caller from shipping a column with no label or
a product name in one. The gallery passes the owner's two words
(`plan/reviews/2026-09-23/decisions.md` row 18, *"Heute"* / *"Mit eurem
Kalender"*), the same pair `/dein-kalender` reads off its content. The unit
test no longer asserts a literal the component owns: it asserts that the labels
the caller passed are the labels that render, and that no product name survives
a render.

## Consequences

- `TS-WEB-0024 D2` lists seven blocks and `A2` seven `data-block` ids. Nothing
  else in the spec changed; no status was promoted.
- `A8`'s heading count and `A9`'s locator are both satisfied in substance and
  not in letter (§2, §3). Both belong to a spec owner's pass, not to this
  task.
- `app/[lang]/_pages.module.css` loses `.configList`/`.configRow`/`.configKey`/
  `.configValue` and `.tierGroup` — the `<dl>` and the three `offer-tier`
  panels they styled are gone — and gains the benefit band, the settings
  heading and the tier note.
- `offer-tier` is no longer used by `/dein-kalender`. It stays in the
  component set for `/deine-region`; removing it is not this task's.
- Two rows go to `state/open.md`: the nine unconfirmed check lines, and the
  config-repo URL.
- `comparison-table` now takes both column labels as required props (§8), so
  every caller names its own columns; `src/components/gallery.tsx`'s entry 26 is
  the one caller outside `/dein-kalender` and passes the owner's pair.
