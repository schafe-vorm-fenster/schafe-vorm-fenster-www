---
id: DEC-0097
title: Every statement carries the position it rests on — 186 of 273 resolve to a line, and the 87 that cannot say why
status: accepted
date: 2026-09-24
decided_by: jan-henrik.hempel
---

## Context

`@leafcutter-strict/method-identifier-and-locator-schema` is half identifier
and half locator. DEC-0086 paid the identifier half. The locator half was the
sixth row of DEC-0085 §6:

> Rows carry source ids, sometimes a section anchor. Closing it means
> re-reading all 18 sources.

The method's procedure, steps 4 and 5:

> 4. **Pick the locator granularity the source supports** — the finest
>    available, never a finer one invented for tidiness.
> 5. **Attach an excerpt** of at most 25 words to every locator, in the
>    source's language.

and what it rules out:

> A bare file name as a source reference. It says which document was read, not
> what it said, and it is the most common way a specification becomes
> unverifiable without anyone noticing.

`source: "SRC-0006"` was a bare file name. `source: "SRC-0001#boundaries"` was
a section, which is the method's second-finest scheme where the source
supports the finest.

## Decision

### 1. `source` is the contract's locator, and nothing else is

`requirement-shell` types `source` as its `$defs/locator` — `source_id`,
`loc`, `excerpt`, `additionalProperties: false`, `loc` and `excerpt`
required — and patterns `loc` as `^.+#(L\d+|P\d+|¶\d+|M\d+:\d+)$`, which is
the method's table of four schemes. So:

```yaml
source:
  source_id: SRC-0001
  loc: "go-to-market-os/concept/website-communication-principles.concept.md#L58"
  excerpt: "Every page declares exactly one focus job in its brief."
```

The contract's `source` holds **one** locator; this repository's requirements
often rest on several references at once, and the decision that fixed a value
is as much a part of the provenance as the document that first said it. The
full list therefore moves into a **`## Source` section** of the document —
the same call DEC-0093 made for material the grammar has no slot for. E4's
S3 anchor now reads the whole document, so a decision named in that section
still satisfies it.

### 2. Every locator was read, and every excerpt verified mechanically

All 18 sources were opened. For each requirement the position was resolved in
the source it cites, and the excerpt copied out of that line. Then every
excerpt was checked, twice, against the file it names: **186 of 186 are an
exact substring of the exact line named, and none is over 25 words.** An
excerpt that had drifted by one line would have failed that check, and two
did during the run and were corrected.

Where an excerpt would have dragged a retired identifier out of the source
with it, it stops before it — still verbatim — and the dangling citation is
recorded as a finding. `concept/v2.0/README.md` still cites `CON-WEB-0007`
and `DEC-0079` still cites `FUN-WEB-0047`; both were retired by DEC-0093.

### 3. `UNKNOWN` where the source cannot carry a position, and what that found

**87 of 273 carry `loc: UNKNOWN`**, in three kinds, and the biggest is one
source:

- **64 — `SRC-0006` is unlocatable.** The voice transcript is
  `concept/_archive/Schafe Webseite Anforderungen.txt`: 9,398 bytes, **one
  line, no line terminators.** Every claim in it resolves to `#L1`, so the
  locator distinguishes nothing; `#L1` here is a bare file name with a
  decoration on it, which is the thing the method rules out. The method's own
  Output section is the rule applied: *"Where the source carries no position
  scheme at all, the locator is `UNKNOWN` and the source is reported as
  unlocatable — which is a defect of the source, not of the run."*
  **46 of the 64 still carry an excerpt** — the words are evidence even where
  the position is not — and **18 do not, because the transcript does not say
  the thing the requirement says.**
- **13 name no document at all.** Nine were extracted with `source:` reading
  "derived; convention", "existing repo, convention", "platform default" or
  "convention"; four name decision records that do not carry the statement and
  cite no other. `FUN-WEB-0152` is the sharpest: its `make-contact` intent
  appears in no decision record anywhere in the repository.
- **10 name a readable document that does not support the statement.**

### 4. The findings, which are the point of doing this

**154 of 273 requirements carry a finding in their `## Source` section.** They
are not tidy-ups; each is a place where the specification claimed more than
its source says. Four kinds recur:

- **The source list's order misleads.** In ten requirements the first-named
  reference is silent and a later one in the same list carries the statement —
  `CON-WEB-0020`'s first source actively contradicts it. Ten were re-resolved
  against the listed record that does support them.
- **Half a statement is in the source.** `CON-WEB-0076` is supported on "no
  influence on rendering" and not at all on cache variance. `CON-WEB-0056` is
  supported on "install as a dependency" and not on "import glyphs by name".
- **A number was modernised in passing.** `NFR-WEB-0048` requires INP < 200 ms;
  `SRC-0007` carries the superseded FID < 100 ms and no INP anywhere.
  `NFR-WEB-0055` relaxes the source's `< 50KB` to `<= 50 KB`.
- **A source says the opposite.** `CON-WEB-0061` forbids what `SRC-0003`
  line 35 requires ("Contact and newsletter live in the footer");
  `FUN-WEB-0017` gives `/ueber-uns` a primary conversion where `SRC-0003`
  line 205 says it has "none of its own". Both are decisions overtaking an
  unamended source — and until now nothing in the repository said so.

`FUN-WEB-0179` is the one that would have stayed invisible: it is a SHALL,
and its line in `SRC-0009` sits under `## Open Questions`, phrased "is better
fetched at build time than versioned".

None of the 154 is repaired here. A locator run reports what the sources say;
changing a requirement because of it is a decision at its own decision point.
They are raised in the demand register this wave creates, as one demand
per finding class rather than 154 rows.

### 5. `check:specs` E19 and W8

E19 validates the locator against the contract read from the installed
schema: the three keys and no fourth, `loc` and `excerpt` present, `loc`
matching the contract's pattern, `excerpt` inside the contract's 200
characters and the method's 25 words. W8 reports 186/273 and what the rest
are.

**One recorded deviation.** The contract's `loc` pattern has no `UNKNOWN`
branch, and the method requires the value. A pattern with no `UNKNOWN` forces
either a fabricated line number, which
`@leafcutter-strict/foundation-evidence-discipline` calls "a defect — and the
worse kind", or an absent field, which the contract's own `required` array
forbids. E19 accepts `UNKNOWN` for `loc` and `excerpt`, W8 counts it, and the
same slot is owed upstream as Q-0074's — raised as `DEM-0017`.

## Consequences

- **All 273 requirements carry a locator in the contract's shape.** 186
  resolve to a line in a named file with the words found there; 87 are
  `UNKNOWN` and each says on the artefact why.
- **232 of 273 carry a real excerpt**, including 46 whose position is
  `UNKNOWN`.
- **`SRC-0006` is unlocatable, and 64 requirements — the largest single
  group — rest on it.** That is the finding with the longest reach in this
  wave, and it is the input to the source-quality vector recorded next in this wave.
- The counts, the pyramid, W3 and W7 are unchanged. This wave item moved no
  test and no criterion.
