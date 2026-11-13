---
id: DEC-0080
title: The website carries its own copy guide, bound by a contract
status: accepted
date: 2026-09-23
decided_by: jan-henrik.hempel
---

## Context

The review of the preview site on 2026-09-22 is, in its largest part, a
wording review: fifty-odd findings about headings, back-references, abstract
groups, padding lines, untrue claims and questions that answer themselves.
Three of them explicitly ask for a rule rather than a fix — *"Da müssen wir
eine Guideline für die Texterstellung definieren"*, *"Das müssen wir ggf. in
den Inhaltsregeln fest verankern"*, *"Daraus sollten wir eine Content-Regel
ableiten"*.

There was nowhere to write them down. The situation before this record:

- The hub's `brand-identity/tone-of-voice.md` carries brand adjectives and
  still frames `Sie` as normal. It is a voice, not a rule set.
- `concept/website-communication-principles.concept.md` (SRC-0001) governs
  *what* the website says — jobs, scenes, order — and one clause of *how*:
  §1a requires the scene opener to be the visitor's own question.
- The website specs carry exactly one copy requirement (`FUN-WEB-0008`) and one
  structural determination (`TS-WEB-0006 D7`), and D7 **requires** the
  question-opener the review rejects.
- `TS-WEB-0006-A8` depends on a generic-claims term list that its own open point
  records as not existing.
- `TS-WEB-0007 D5` requires a `describe()` and a `max()` per field with no
  document to take them from, and `D9` treats the glossary as a production
  input while the register carries meanings rather than copy words.

So the rules were not merely unwritten: the one written rule was the wrong
one, and two mechanisms were waiting on an artefact that did not exist.

The tempting shortcut was to write the rules into the specs — a new
requirement family, or a longer `TS-WEB-0006 D7`. That inverts the framework. A
spec cites, it does not invent (STRICT: no invention; `specs/README.md` rule
1). Rules about how the site speaks belong in a document with a source id, not
in a paragraph inside a tactical spec. *(As first written this sentence also
cited rule 4 — the precedence rule DEC-0104 inverted. The argument it actually
makes is about citation and invention, which rule 1 carries alone.)*

## Decision

**The website gets its own copy guide, `concept/website-copy-guide.md`
(SRC-0017), bound to the build by `specs/contracts/copy-contract.md`
(SRC-0018).** It is the exact shape the design layer already has: a guide that
says what is right (SRC-0014) and a contract that says what the machinery owes
it (SRC-0013).

Four points settle how the layers divide:

1. **The hub keeps the brand level.** Voice, adjectives, stance, the register
   decision, the anti-patterns that hold in any channel stay in
   `packages/identity/brand-identity/tone-of-voice.md`, and what the website
   communicates stays in `concept/website-communication-principles.concept.md`.
   The guide inherits from both by path and copies neither
   (`concept/README.md` rule 1).
2. **The website keeps its own cut.** Length budgets at 390 px, per-block-type
   rules, the kicker vocabulary, the use/avoid list as it applies to page
   copy — these are true of this website and of nothing else, exactly as the
   design system is the website's cut of the brand kit.
3. **The guide is specification-side, and `TS-WEB-0006 D7` was wrong.**
   `TS-WEB-0006 D7`'s question-opener rule is not amended by argument; it is
   replaced because the artefact carrying the right rule is the guide, and the
   guide is prescriptive, bound by SRC-0018, with a mechanism behind every one
   of its forty-one rules (§4). *(Amended 2026-09-25 — see the amendment
   below. As first written this point read "A concept document wins over a spec
   … and the guide is a concept document (`specs/README.md` rule 4)", which is
   the precedence rule DEC-0104 inverted.)*
4. **Every rule has an owning mechanism or is declared human.** The contract
   assigns each of the forty-one rules to a schema `max()`/`describe()`, a
   `check:content` lint row, an e2e assertion, or the editorial gate. A rule
   with no mechanism would be advice, and advice does not survive forty
   content files.

The rules themselves carry ids `CG-001`–`CG-041`, so a spec row cites one the
way it cites a `DEC-####`.

## Consequences

- `TS-WEB-0006 D7` is rewritten: statement openers, reader-directed questions only,
  self-contained blocks, and the generic-claims list now **exists** — it is
  the avoid list of SRC-0017 §9 plus the glossary's avoid column. `A8` is the
  static half, `A16` the reviewed half.
- The two page-level criteria that assert a question mark in an opener invert:
  `TS-WEB-0019-A6` and `TS-WEB-0022-A4`. Their e2e tests
  (`e2e/pages/home.spec.ts`, `e2e/pages/mitmachen.spec.ts`) still assert the
  old rule against copy that has not been rewritten yet; they change with the
  copy, in the content phase, not before it.
- `TS-WEB-0007 D5` takes its `describe()` and `max()` values from SRC-0017 §6;
  `D9` and `D12` reference SRC-0018 for the rows they carry; `D11`'s editorial
  gate acquires a named list of what it, and only it, can catch.
- `specs/glossary/glossary.md` gains **use** and **avoid** columns per locale.
  It is filled only where the review supports a word; an empty cell is a gap,
  not a licence to invent. Q-0057 stays open for the hub import.
- `FUN-WEB-0008` cites the guide and the contract and reaches `S3`.
- The budgets in SRC-0017 §6 are provisional against the component manifest
  (SRC-0013 §1). The derivation is recorded with them, so a component budget
  replaces a number rather than contradicting one.
- The product-naming consequence stands unchanged: `DEC-0052 §1` still
  introduces "Portalize" once, and CG-039 forbids "das Produkt" as the
  workaround. Whether the name changes is an open decision, not this one.
- The brand-level rules are being written into the hub in parallel. Until they
  land, SRC-0017 §9 carries the word-level anti-patterns the review supplied;
  when they land, the guide keeps the website's cut and drops the rest. That
  handover is open decision 3 of the guide.

## Amendment 2026-09-25 — §3's reason is re-based on DEC-0104

**§3's outcome stands unchanged.** `TS-WEB-0006 D7` is replaced, `A8` is the
static half, `A16` the reviewed half, and the two page-level criteria stay
inverted. Nothing about the guide, the contract or the forty-one rule ids
moves.

What is withdrawn is the **reason** §3 gave. It cited `specs/README.md` rule 4
— *"a concept document wins over a spec"* — as an authority, and DEC-0104 §1
inverts that rule: the specification carries the truth and a source is cited,
not obeyed. This record is the only place in the repository where the old rule
was used as an authority rather than merely stated, which is why leaving it
would leave a live citation of a withdrawn rule.

The reason it takes instead is DEC-0104 §3: `concept/website-copy-guide.md` is
**specification-side**, not concept input. It is prescriptive, it is bound by
`specs/contracts/copy-contract.md` (SRC-0018), and every rule it carries has an
owning mechanism because §4 of this record required one. So `D7` was not
overruled by a concept document — `D7` was **wrong**, and the artefact that
carried the right rule happened to be the guide.

The distinction matters for what happens next time: under the old reason, any
sentence in any concept document could have replaced a determination. Under
this one, only a specification-side artefact with a contract row can, and a
disagreement with a hub concept document is settled the other way, with the
deviation recorded (DEC-0104 §2).
