---
id: DEC-0070
title: Eleven determinations confirmed — the price predicate, its accepted risk, and the low-stakes block
status: accepted
date: 2026-09-11
decided_by: jan-henrik.hempel
---

## Context

The last two open entries of the PROPOSED review (Q-0060, Q-0070). Neither
was a choice between alternatives; both were determinations that had
never been put to anyone, so confirming them is an act rather than an
omission.

## Decisions

### 1. The publishable-price predicate stands (Q-0060)

```
publishablePrice(o) = o.promotion === 'promoted' && o.price_status === 'fixed'
```

`portalize-enterprise` is `on-request`, so **4.000 € never appears — not
as a figure, not as "ab 4.000 €", not as a range**. That is the intended
reading of `price_status`, not a side effect of it: the field says the
price is negotiated, and an anchor price would undo the negotiation
before it starts. A price reaches a page only through the component that
reads the offering package; a figure typed into copy is a defect even
when it is right.

### 2. The withheld amounts ship unguarded — an accepted risk (Q-0060)

4000 and 5 are frontmatter of packages the site installs, so they are
present in the build and a template mistake could print them. **No build
check scans rendered output for them.**

This is a decision, not an oversight. The control already exists: one
component renders prices and refuses any id the predicate rejects. A
second check on the output would guard against a bug that has not
happened, and the specs would carry a rule nobody can point at a reason
for.

The trigger to revisit is written down so the acceptance does not quietly
become permanent: **the first time a withheld amount reaches a rendered
page, the guard gets built.**

### 3. The low-stakes block is confirmed (Q-0070)

Eight determinations, ten sections, no plausible alternative worth a page
— now `[FIXED]` rather than `[PROPOSED]`:

| Spec | What is confirmed |
| --- | --- |
| TS-WEB-0015 D8 | Canary gate: readiness, journeys and route smoke decide the promotion; canary error logs are reported and never a verdict |
| TS-WEB-0015 D9 | `pnpm check` in CI: E1–E10 block the merge, W1–W3 are reported per release and never gated |
| TS-WEB-0015 D11 | `ubuntu-latest`, Node from `.nvmrc`, pnpm 10.x, frozen lockfile, no custom image |
| TS-WEB-0014 D5 | CSP enforced in all three environments; HSTS two years production, one day preview, off locally |
| TS-WEB-0029 D3 | `scroll-margin-top` from the header variable; anchor landing works on first paint without JS |
| TS-WEB-0029 D4 | A server-rendered section nav, sticky at `xl` and above, never behind a phone toggle |
| TS-WEB-0028 D4 | Client-side filter chips over static rows; only types with cleared entries get a chip |
| TS-WEB-0028 D7 | The year spine is the heading outline; two fixed row variants, each declaring its height |
| TS-WEB-0021 D5 | A shared `?ort=` link that resolves later 302s to `/dein-ort`; an upstream error never redirects |
| TS-WEB-0010 D2 | Route → entry context → IP → stated place → browser geolocation; later overwrites earlier, no step blocks the response |

**Not in this block, and still `[PROPOSED]`:** TS-WEB-0021 D9 (tone for the
third audience) and TS-WEB-0010 D11 (what is measured). Both were grouped
elsewhere in the review and neither is confirmed here.

## Consequences

The PROPOSED review closes. Of the twenty-two purely proposed
determinations it examined, the review produced four decision records
(DEC-0067 … DEC-0070); the remainder were either already settled by an
existing decision and only mislabelled, or wait on an external answer
that is tracked by its own question.

What is deliberately *not* closed: seventeen determinations carry
`[PROPOSED]` on a sub-clause only — a number inside an otherwise fixed
rule, or a row awaiting an external answer. They stay tracked by the
question they wait on (Q-0008, Q-0015, Q-0019, Q-0045, Q-0054, Q-0056) rather
than being confirmed in bulk here.
