---
id: DEC-0106
title: The product name is an open question again — the website names no product until it closes, and the workaround is still forbidden
status: accepted
date: 2026-09-25
decided_by: jan-henrik.hempel
---

## Context

The naming question has been two different questions all along, and the
register only held one of them.

**Q-0012 asked where the name appears**, and `DEC-0052 §1` answered it: once,
on `/dein-kalender`, at the 480 € tier. `TS-WEB-0024 D7` says "resolves
Q-0012" and `TS-WEB-0018` says twice that Q-0012 is *"unresolved"* and
*"blocks the permissive half of D5"* — a straight disagreement between two
tactical specs about whether a question in the register is closed.

**Nothing asked whether the product keeps the name at all.** That question
exists — `concept/website-copy-guide.md` carries it as open decision 1, with
its two options — but it has no `Q-####`, no decision record and no addressee,
so it is invisible to every register that would otherwise surface it.

The 2026-09-22 review supplied the third piece. It rejected the comparison
block's second column, *"und mit dem Produkt"*, as the placeholder it is: a
page that has to call the thing something, and reaches for a category noun
because the name is unsettled. `CG-039` forbids the workaround; it does not
settle the name.

So `TS-WEB-0024 D4`'s framing — *"Today versus with the product: four rows"*,
columns *"today · with the product"* — is the one place in the specification
where the unresolved name is written into a determination.

## Decision

**The naming question opens as its own question, addressed to the hub, and
until it closes the website names no product in the comparison block.**

### 1. `Q-0077` is the naming question, and `Q-0012` stays answered

Two questions, two rows, and neither one masquerading as the other:

- **`Q-0012` — where is "Portalize" introduced?** Answered by `DEC-0052 §1`
  and it stays answered. It is not reopened: the answer to *where* holds
  whatever the name turns out to be, because it is about the surface and the
  count, not the string. Its row gains a pointer to `Q-0077` so a reader stops
  taking the strike-through for the whole subject.
- **`Q-0077` — does the product keep the name at all?** New, and the options
  are the guide's own open decision 1: (a) keep "Portalize", introduced once;
  (b) a new name that carries in the German Ehrenamt context. Addressee: the
  hub, as a hub decision — the name is a positioning matter and
  `specs/README.md` rule 1 keeps naming out of this repository.

**No option is chosen here.** Choosing would be inventing a positioning
decision on the strength of a website's convenience, which is the direction
`specs/README.md` rule 1 exists to stop.

### 2. The comparison block names no product, and that is a determination

`TS-WEB-0024 D4`'s two columns are **"today" and "with your calendar"** — the
thing in the reader's own words, not a product name and not a category noun.
The heading loses its "with the product" framing for the same reason.

This is the interim the review asked for, and it has a property worth naming:
it is **not** a placeholder waiting to be filled. Whichever way `Q-0077` goes,
the comparison column is better without a name in it — `CG-038` allows the name
exactly once on the page, at the 480 € tier, and spending that one occurrence
on a table column would take it away from the tier where the price is read. So
the determination survives the answer instead of blocking on it.

What stays forbidden either way is the workaround: `CG-039` fails a build on
*"das Produkt"* and *"und mit dem Produkt"*, and no page writes them to get
round `CG-038`. The wording of the columns is copy (`DEC-0083 §1`) — this
record states no string.

### 3. `TS-WEB-0018`'s two "unresolved" citations are corrected

They point at `Q-0012`, which is answered. What actually blocks the permissive
half of `D5` — whether the name *must* appear once, the floor rather than the
ceiling — is `Q-0077`: a floor on a name that may change is a floor on nothing.
So the citations move to `Q-0077`, and the disagreement with `TS-WEB-0024 D7`
goes away without either spec changing its substance.

The gate is unaffected. It enforces the ceiling and the one route today, and it
enforces no floor, which is the right behaviour while `Q-0077` is open: a page
without the name passes.

## Consequences

- `Q-0077` enters the register, addressed to the hub, with the two options and
  what each would cost. `Q-0012`'s row points at it.
- `TS-WEB-0024 D4` loses "with the product" in its heading and in its column
  pair; `A5` follows, because it asserts the two cells by name.
- `TS-WEB-0018 D5`'s prose and its open point cite `Q-0077` instead of
  `Q-0012`; `TS-WEB-0018`'s FREE list does the same.
- `DEC-0052 §1` is untouched: one occurrence, on `/dein-kalender`, at the
  480 € tier. `DEC-0080`'s note that "whether the name changes is an open
  decision, not this one" now resolves to a question id.
- `CG-038` and `CG-039` are unchanged, and the copy guide's open decision 1
  gains the question id it lacked.
- No name was chosen, no string was written into a spec, and nothing moved off
  `DRAFT`.
