---
id: DEC-0145
title: The four open points the owner answered — the legal route may name the product, a price is read, three authored proof lines are cleared, and the budget applies to what we wrote
status: DRAFT
date: 2026-09-27
decided_by: jan-henrik.hempel
---

## Context

The implementation of the 2026-09-22 review closed 21 tasks and left four
points that no engineer could close, because each needed the owner: a criterion
contradicting a legal text, a price the specification says is read and a page
typed, three proof lines about real institutions written by us rather than
quoted, and a claim budget nothing measured. They were put to the owner
together on 2026-09-27 with the measurements beside each one, and answered in
one sitting. One record, four sections — one per answer, each closing its own
row of `state/open.md`.

## Decision

### 1. `/rechtliches` may name the product, without a count — `TS-WEB-0018-A7` says so now (CONF-0027)

`A7` read *"`/dein-kalender` is the only route whose body may contain one, at
most once"*. Measured on the rendered page, `/rechtliches` carries the name
**seven** times per locale, because the five imported legal bodies name it as
the contractual product: `content/legal/privacy-policy.md:91`,
`terms-of-use.md:99`, `dpa.md:54`, imported verbatim under `DEC-0012` and
`DEC-0027`.

**The criterion was wrong, not the page.** A contract has to name the product
it is about; a rule that forbids it makes the legal text unusable, and the
route already carries the same single exemption in the register rule for the
same reason (`TS-WEB-0029 D6a`). So `D5` and `A7` are amended to name the
exemption — **route-wide in the body, and nowhere else**:

- the **chrome** of `/rechtliches` is not exempt. Header, footer and context
  band are held to `D5` there like everywhere, which is what `A7`'s first half
  already measured and still does;
- the exemption carries **no count**, because the number of mentions is the
  legal text's business and pinning it would make a lawyer's edit fail a build;
- every other route still contains none, and `/dein-kalender` still at most
  one.

The alternative the owner rejected was to strike the name from the three legal
bodies. It would have kept the criterion pure and made the contract vaguer,
and it is a legal edit that needs a lawyer rather than an engineer.

`CONF-0027` resolves as `NEW_VERSION`: the new version is `A7` and `D5`.

### 2. A price is read from the offering package — `{price:<offering-id>}`, never a typed figure

`TS-WEB-0006-A12`: *"the only numeric price rendered anywhere is
`portalize-calendar`'s 480 €/year, read from the offering package"*.
`/ueber-uns` typed it — *"kostet die Lizenz für den eigenen Kalender 480 € im
Jahr"* — while the same file's author note claimed the opposite, *"gelesen,
nicht getippt"*. A price change in the hub would have left that sentence behind
and nothing would have said so.

A sentence cannot call `offeringPrice` itself, and lifting the figure out of the
sentence would have cost the owner's wording. So the field keeps the sentence
and names the figure by its offering:

```
Deshalb kostet die Lizenz für den eigenen Kalender {price:portalize-calendar} im Jahr …
```

`src/lib/pricing/price-token.ts` is the one node that resolves it, through the
same `offeringPrice` + `formatPriceParts` pair every price render already uses,
so the paragraph and the price tier are formatted by one formatter under one
locale's rules. **The amount only, never the interval**: `480 €` / `€480` is
data and the package owns it, *im Jahr* / *a year* is grammar and the author
owns it.

Two things throw rather than degrade: an offering id that does not exist, and an
offering that publishes no figure. `portalize-enterprise` carries `4000` in the
package with `price_status: on-request`, and `TS-WEB-0018-A3` forbids that
figure on any page — the token must not become the way around it, so
`publishedFigure`'s rule stands unsoftened.

**And the defect cannot come back.** `check:content` row 15 fails a currency
amount typed into any copy field and names `TS-WEB-0006-A12` in the failure, so
the criterion is metered rather than merely asserted. The pattern is
deliberately narrow — an amount carrying a currency, never a bare number,
because `17 Orte` is a count and says nothing about money.

The row found a second typed price on its first run: the author note of
`/dein-kalender`'s tier slot names the internal `€4,000` figure **in order to
forbid it**. Its German sibling escaped only by hyphenation. Both now carry the
`<!-- note -->` marker `DEC-0142 §1` built for exactly that, which is the
mechanism rather than an exemption.

### 3. The three authored proof lines are cleared as wording — and `usage_rights` is a different question

Three lines about real, clearance-pending institutions were written from the
records' `evidence:` plus the review, not quoted from any `claim:`
(`state/open.md` row 285): `/mitmachen` cards 1 and 2 and `/deine-region`
card 1.

The owner confirms, on **2026-09-27**, that the sentences say what the evidence
shows and that the institutions may be named as they are named. That closes the
authoring question the row asked.

**It does not clear the records.** `lehre-lelender`,
`volkshochschule-uecker-randow` and `zukunftswege-ost-newsletter` remain
`usage_rights: unverified` in the hub, `Q-0014` is untouched, and the slots'
`clearance: pending` notes stay as they are, because they are about a written
clearance from each institution — which is theirs to give, not ours. This
record does not blur the two, and a reader of the artifact finds both
statements side by side.

### 4. The claim budget applies to what we wrote, not to what someone said (CG-027)

`CG-027` sets a proof card's claim at 70 characters. Nothing measured it, and
the two rewritten pools stood over it — the worst line at 129.

**The authored lines shrink; a verbatim record claim does not.** Five lines were
shortened to ≤ 70 (`/deine-region` card 1, `/mitmachen` cards 1–3, in both
locales). `/deine-region` card 2 stays at 112 / 101, because it is the verbatim
`claim:` of `leader-foerderung-2022` and `CG-027 §6` forbids paraphrasing a
record. It is a **named** exception with its reason, not a silent one.

`check:content` row 16 measures every proof-card claim by the parser's own rule
— the part before the **last** ` — `, quotation marks stripped, which is where
`parseDemoProofElement` ends it — so a card cannot pass the lint and fail the
parser.

**The row found far more than the four points named.** 24 claims over budget
across `/`, `/dein-kalender` and `/ueber-uns`, up to 171 characters, and many of
them are verbatim record claims or real quotations from named people, which
`CG-027 §6` forbids shortening. That is a finding about the rule, not 24
defects, and it is **not** decided here. Every one is seeded into
`CLAIM_BUDGET_EXCEPTIONS` with its slot, the first forty characters of the claim
and the reason `pre-existing, unread`. The phrase is literal: **nobody has read
those 24 line by line**, and this record does not pretend otherwise.

What that buys is the ratchet of `DEC-0141` applied to copy: a **new** long
claim fails the build, the existing ones are visible in one list, and a changed
line loses its exemption because the fingerprint no longer matches, so it is
measured again.

## Consequences

- `TS-WEB-0018` `D5` and `A7` name the `/rechtliches` body exemption; the
  chrome half is unchanged. `CONF-0027` → `RESOLVED`, `NEW_VERSION`,
  `decision_record: DEC-0145`. `e2e/copy-structure.spec.ts`'s exemption comment
  no longer says the criterion is unmet, and its test title carries `A7`, so the
  criterion has an instrument at its declared level again.
- `src/lib/pricing/price-token.ts` and its eight tests; `OFFERING_IDS` exported
  as a value beside the type, so a runtime check reads the list the type comes
  from. `content/pages/ueber-uns/{de,en}.md` carry the token;
  `app/[lang]/ueber-uns/page.tsx` resolves it.
- `check:content` gains row 15 (a typed price) and row 16 (the claim budget),
  both naming their criterion in the failure. `src/lib/content/validate.ts`
  exports `claimOf`, the one measurement of a claim's length.
- Five proof claims shortened in both locales; one kept verbatim as a named
  exception; 24 pre-existing ones recorded as unread debt.
- `state/open.md` rows 278, 285, 286 and 287 close or are rewritten to what is
  now true; row 286 keeps the 24 as the open part.
- No requirement, need or goal changed. No identifier was renumbered or reused.
  Nothing moved off `DRAFT`.

### What this record does not do

It does not read the 24 long claims, clear a single institution, or settle
whether 70 characters is the right budget for a quotation. It closes four
points and turns two of them into meters, so the fifth question — whether
`CG-027` means a written claim or also a quoted one — is now visible with its
24 instances attached instead of being invisible with none.
