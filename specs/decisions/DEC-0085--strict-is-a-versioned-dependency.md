---
id: DEC-0085
title: STRICT is a versioned dependency, not a path — and the checker reads its vocabularies out of the package
status: accepted
date: 2026-09-24
decided_by: jan-henrik.hempel
---

## Context

Until today this repository named its specification method by the place it
sat on one laptop. `AGENTS.md` said specs are written against STRICT at
`/Users/jan-henrik.hempel/LeafcutterOS/leafcutter-strict` and that the
framework "is not reachable from this repository, so the path is named
explicitly". `specs/README.md` repeated it, `CON-WEB-0006` carried the path as
its statement, and three READMEs promised that a project convention would be
"reconciled against the Core Specification once it is available locally".

That had three costs:

- **The method had no version.** A spec written on 2026-09-09 and a spec
  written today claim the same framework, and nothing in this repository
  could tell whether the framework had changed underneath them.
- **The path was a single machine.** Nobody else, and no CI runner, could
  resolve it. The reconciliation promises could never come due, because the
  thing to reconcile against never arrived.
- **`scripts/check-specs.ts` re-derived the framework.** The S0–S3 ladder was
  a regular expression in this repository. The four tactical kinds were not
  checked at all. Every one of those is a vocabulary STRICT defines.

STRICT is now published to `https://packages.leafcutteros.ai/` as about
fifty packages in eight families — the same registry the hub's
`@leafcutter-os` scope already resolves from, and it needs no credential to
read. The same restructuring that produced `DEC-0042` for hub content applies
here: the package name is the real address, the repository path is not.

## Decision

### 1. The framework is a dependency

`@leafcutter-strict/blueprint-complete` is a `devDependency` of this
repository, pinned exact at **0.2.4**. `.npmrc` maps both
`@leafcutter-strict` and `@leafcutter-os` to
`https://packages.leafcutteros.ai/` — the second because
`library-schemas` peer-depends on the core's schemas package.

`blueprint-complete` and not a narrower profile, because this repository
does all four kinds of STRICT work at once and has done since the cold
start:

| Blueprint | What it selects | Does this repository do it |
| --- | --- | --- |
| `essentials` | foundations, roles, the seventeen methods, `library-schemas` | Yes — but it selects no playbook, so it is a floor, not the answer |
| `bootstrap` | source inventory, SSD, glossary bootstrap, clarification loop | Yes — `specs/sources/`, `specs/ssd/`, `specs/glossary/`, and a 73-row question register that is still moving |
| `delivery` | extraction, tactical specification, consistency, quality review, decision engine | Yes — 155 requirements, 29 tactical specs, 85 decisions |
| `assurance` | traceability audit, readiness, baseline release, governance change | Yes — `specs/traceability/rtm.md` and the coverage half of `pnpm check:specs` |

`specs/README.md` has named `playbook-cold-start` and
`playbook-steady-state-increment` since the cold start; they live in two
different profiles. Picking one profile would have left the other's
playbook unresolvable and the RTM without a home.

`@leafcutter-strict/library-schemas` is a direct `devDependency` as well,
pinned at **0.4.1**, because `scripts/check-specs.ts` imports it. A package
a script resolves is a direct dependency, whatever else pulls it in.

### 2. It is referenced by package name, never by path

`DEC-0042` settled this for hub content; it now covers the method too. A spec
that needs a STRICT rule cites
`@leafcutter-strict/method-statement-grammar`, not a directory on a laptop.
`AGENTS.md`, `specs/README.md`, `CON-WEB-0006`, `TS-WEB-0017 D6` and `GL-0020` are
rewritten accordingly.

Two places keep the old path on purpose: `DEC-0023`, which is the record of
what was decided on 2026-09-09 and is not edited after the fact, and the
Context section above, which quotes the state this decision changes.

### 3. `stack.allow.json` does not apply

The register is the list of **runtime** dependencies — `check:stack` reads
`package.json` `dependencies` only, and that is right. STRICT is method
documentation plus a governance pack that nothing rendered ever imports; it
is read at spec time and at check time. It is a `devDependency`, it gets no
register entry, and `pnpm check:stack` is unchanged in what it tolerates.

What did change is `TS-WEB-0017-A2`: the `.npmrc` assertion now covers the
`@leafcutter-strict` scope as well as `@schafe-vorm-fenster`, so deleting
the scope line fails the gate instead of silently un-pinning the method.

### 4. The checker stops re-deriving what the package defines

`scripts/check-specs.ts` reads five controlled vocabularies out of the
installed contracts at startup instead of repeating them:

| Vocabulary | Contract | Used by |
| --- | --- | --- |
| `S0…S3` | `requirement-shell` `evidence_sufficiency` | E3, E4 |
| requirement status | `requirement-shell` `status` | E11 *(new)* |
| tactical status | `tactical-specification` `status` | E12 *(new)* |
| tactical kind | `tactical-specification` `kind` | E12 *(new)* |
| source trust | `source-inventory` `sources[].trust` | E13 *(new)* |

Three of those are checks this repository did not have. Nothing was
loosened: the S-level check is the same set, now sourced rather than
spelled, and a version bump of the package moves the checks with it.

### 5. `profile:` becomes `kind:`

The tactical contract calls the field `kind` and permits exactly the four
values this repository already used. `profile` was the local spelling, and a
bad one — the word is spent three times over here (the relevance engine's
weight profile, the tone profile of `DEC-0066`, the `person-profile`
component). All 29 tactical specs and the layer's README now say `kind`, and
`check:specs` E12 validates it against the package.

### 6. What is owed, and what it would cost

These are divergences the packages define differently and this change did
**not** repair, because each needs either renumbering or new artefacts:

| Owed | STRICT form | Why not now |
| --- | --- | --- |
| Identifier schema | `<TYPE>-<DOMAIN>-<NNNN>` — `FUN-WEB-0001` | **Closed by DEC-0086 on 2026-09-24.** The "cited from sibling repositories" premise was measured and found false — no other repository cites them — and no number was reassigned, so the method's own "never renumber" holds. The real scale was 802 ids and 11,306 citations, not ~340 in ~155 files |
| The business-rule class | FUN · NFR · CON · BUS | **Closed by DEC-0087 on 2026-09-24.** The extraction pass ran over all 155: exactly one statement answers the method's first question — `CON-WEB-0012` is `BUS-WEB-0012`. Four more carry a rule inside a compound and need splitting, which makes new artefacts |
| Statement grammar | per-class slot forms, one modal one predicate, `form` on the artefact | **Partly closed by DEC-0087 on 2026-09-24.** 47 of 155 recast; `form` is on every artefact and `check:specs` W4 counts the 108 that are not. The remainder are compounds, and the method's own rule splits a compound into new artefacts. The whole NFR class is among them, because the Q form is a measure and 41 rows either bundle several or state none |
| Locator granularity | `<file>#L102` plus a ≤25-word excerpt | Rows carry source ids, sometimes a section anchor. Closing it means re-reading all 18 sources |
| Six-dimension source rating | vector 0–3 per dimension, minimum ⇒ trust | The inventory carries the derived trust level and a rationale; the vector behind it was never recorded. The trust **enum** is now the package's (E13) |
| Need and goal layer | requirement → need → goal → SSD | Goals are referenced into `@schafe-vorm-fenster/goals` and there is no need layer at all. `method-chain-linkage` would find 155 orphan requirements |
| Decision policy | `DP-01…DP-14`, four executor modes, `POL-*`, `SDR-####-####` | **Closed by DEC-0088 on 2026-09-24.** The owner chose neither conservative, assisted nor delegated but a fourth posture, graded by impact: `POL-GRADED-BY-IMPACT` binds all fourteen points across all four impact levels, six of them to `AGENT_BOUNDED` at low impact under four bounds, eight to the owner at every level. The impact thresholds are `method-impact-level-assignment`'s, quoted. `SDR-####-####` stays owed with the decision-record shape |
| Decision record shape | `status: PROPOSED/EFFECTIVE/SUPERSEDED` | 84 records say `status: accepted` in the organisation's ADR convention, and `DEC-###` is cited across repositories |
| Conflict and defect registers | conflict record, defect record ⇒ demand | Contradictions are resolved inside `DEC-###` and defects surface as `Q-###` rows. Both work; neither carries the taxonomy |
| Acceptance criteria shape | `acceptance_tests` with given/when/then | **Not a choice — measured incompatible, DEC-0087 §6.** The contract's item is `additionalProperties: false` over exactly `id`, `given`, `when`, `then`, so DEC-0040's verification level has no slot. Putting it in a prose field makes it free text; putting it in `id` makes re-levelling a renumber. The pyramid, `check:specs` and 420 criteria depend on the level, so it stays |
| Per-artefact versions | `method-version-increment` | **Closed by DEC-0087 on 2026-09-24.** Every artefact whose contract declares `version` carries `0.1.0`, enforced by E16. The method defines increments only and is silent on a first version; the value is argued from DP-13 never having run |

Each of those stays a documented project convention until somebody decides
to pay for it. The difference from yesterday is that the convention now
names the package it deviates from, at a version, instead of promising a
reconciliation against a document nobody could open.

## Consequences

- `pnpm install` resolves two registries. Neither `@leafcutter-strict` nor
  `@leafcutter-os` needs a token; `@schafe-vorm-fenster` still needs
  `GITHUB_TOKEN`.
- A STRICT upgrade is a version bump with a diff, and `pnpm check:specs`
  fails the moment a vocabulary this repository uses is narrowed upstream.
  That is the point.
- `CON-WEB-0006` names the package and its version instead of a laptop path.
- The three "pending local availability of the Core Specification" notes in
  `specs/README.md`, `specs/requirements/README.md` and
  `specs/sources/README.md` are replaced by the owed list in §6 — the same
  gaps, with a price on each.
- `@leafcutter-strict/library-schemas@0.4.1` ships JSON Schemas whose
  `pattern` values are over-escaped (`\\\\d` in the file, so `\\d` after
  parsing — a literal backslash, not a digit class). Nothing here consumes a
  pattern, only enums, so it does not block. It is upstream's to fix.
