---
id: DEC-0083
title: A spec never carries the words — no verbatim copy, no fixed grammatical form
status: accepted
date: 2026-09-24
decided_by: jan-henrik.hempel
---

## Context

`DEC-0036` §3 fixed the `/ueber-uns` headline word for word, and
`TS-WEB-0027-A3` asserted that exact string in an e2e criterion. The
2026-09-22 review rejected the sentence as untrue — the site runs in a
data centre — and SRC-0017 CG-033 now puts it on a build-failing avoid
list (contradiction C4 of `plan/reviews/2026-09-23/spec-impact.md`). A
spec and a guide therefore demanded and forbade the same string, and a
passing build was impossible.

The same shape appears wherever a spec reached past structure into
wording. `TS-WEB-0024 D6` and `TS-WEB-0024-A8` require the tiers block to carry
"one question heading" — a *grammatical form* — while CG-005 fails the
build on a question mark in a section title (contradiction C3);
`TS-WEB-0022 D7` fixed a CTA label; `TS-WEB-0006 D5` phrased a context-band entry as
a rhetorical question CG-006 forbids; `GL-0004` still defined a scene as an
"aha question"; `TS-WEB-0021 D9` quoted a sentence from SRC-0002 verbatim as a
rule about tone.

Each of these could be repaired one at a time. The reason they keep
recurring is structural: as long as a spec may state a string, the
specification and the copy guide are two authorities over the same words,
and whichever is edited last wins.

## Decision

**A spec states what a block must do. It never states the words, and it
never states the grammatical form the words have to take.**

1. **No verbatim copy.** No determination and no acceptance criterion
   contains a sentence, headline, label, caption or micro-copy string that
   a page is supposed to render. Where a criterion needs to be testable,
   it asserts the *element* and what it must achieve — that an `h1`
   exists, that it names the sender and what the sender is, that it is
   inside the first viewport — never its text.
2. **No fixed grammatical form.** "A question heading", "a statement
   opener", "an imperative label" are wording rules, and wording rules
   live in SRC-0017. A spec names the job the heading does: it frames what
   follows, it says what the reader gets, it distinguishes three tiers by
   one criterion.
3. **Copy lives in `content/pages/**`** and is governed by the copy guide
   (SRC-0017) and its contract (SRC-0018). A rule about how the site speaks
   is a concept, and a concept is where it is written — the same division
   `DEC-0080` drew for the guide itself.
4. **Four things are not copy**, and stay where they are:
   - **A forbidden literal inside a check.** A lint needs the string it
     fails on (`TS-WEB-0024-A10`'s `4.000`, `TS-WEB-0026-A2`'s `Umkreis`,
     `TS-WEB-0008-A16`'s `Postleitzahl`). Naming what may not appear is not
     prescribing what must.
   - **A label owned by a registry or by law.** `Impressum`,
     `Datenschutz`, `Barrierefreiheit` and the page title of
     `/rechtliches` are conventional landmarks bound to the anchor
     registry (`FUN-WEB-0029`, `TS-WEB-0004 D8`).
   - **A system label fixed by a decision.** The freshness label of
     `DEC-0019` and the placeholder badges of `DEC-0077` are markers the
     machinery renders about itself, not sentences addressed to a
     visitor. They are cited from their decision, never re-typed with a
     variation.
   - **A data format.** "place (municipality)" as the shape of a
     suggestion row (`DEC-0079` §3) describes which fields appear in which
     order, not a sentence.
5. **`DEC-0036` §3 is amended**: the `/ueber-uns` headline is released. What
   survives of that point is its actual content — that the distinctive
   voice of a sender surface belongs in the page, not in the URL.

## Consequences

- `TS-WEB-0027 D3`/`A3` assert an `h1` and what it must achieve; the sentence
  is the content phase's, under CG-020 and CG-033. `TS-WEB-0027`'s open point
  about the headline's punctuation is void — there is no headline in the
  spec to punctuate.
- `TS-WEB-0024 D6`/`D6a`/`A8`: the tiers block needs **a heading that frames
  the three tiers by the one criterion that separates them** — where the
  calendar runs. Not a question, not a statement, not any named form.
- `TS-WEB-0022 D7`'s CTA label, `TS-WEB-0006 D5`'s rhetorical example,
  `TS-WEB-0021 D9`'s quoted sentence, `TS-WEB-0026 D4`'s counter sentence,
  `TS-WEB-0023`'s step-indicator example, `TS-WEB-0009 D9`'s failure sentence and
  `GL-0019`'s empty-state sentence become descriptions of the job the
  element does, each citing the CG rule that governs its wording.
- `GL-0004` defines a scene by its structure — a concrete, picturable
  introduction with one mechanism — and no longer by a question.
- A criterion that used to compare a string now compares an element and a
  property. That is weaker as a string check and stronger as a
  requirement: it keeps passing when the copy improves, and it fails when
  the element is missing, which is the thing worth catching.
- The sweep is part of this record's execution, not a later task: every
  place in `specs/` where copy was quoted as a requirement was changed
  with it, and the four exceptions above were listed rather than left to
  judgement.
