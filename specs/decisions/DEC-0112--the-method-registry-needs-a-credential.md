---
id: DEC-0112
title: The method registry needs a credential — the build reads it from the environment, and the claim that it did not was false for nineteen deployments
status: accepted
date: 2026-09-25
decided_by: jan-henrik.hempel
---

## Context

Every preview deployment since `next-2026` gained the STRICT packages has
failed. Nineteen in a row, each after ten to fifteen seconds, all in the
install step and never in the build:

```
ERR_PNPM_FETCH_401  GET https://packages.leafcutteros.ai/@leafcutter-strict/
                    foundation-executor-preamble/-/…-0.2.0.tgz: Unauthorized
No authorization header was set for the request.
```

`DEC-0085` installed the framework as a versioned dependency and recorded, as
part of its reasoning, that the registry *"needs no credential to read"*. Three
other documents repeated it: `specs/README.md` rule block, `AGENTS.md`, and the
technical-foundation row of `TS-WEB-0017`. **The claim is false.** Three
tarballs fetched unauthenticated from a clean environment — the failing
`foundation-executor-preamble`, its parent `blueprint-complete`, and
`method-statement-grammar` — answer `401` each. The whole scope is private.

It worked on one laptop because a token for that registry sits in the owner's
global `~/.npmrc`, which `pnpm` reads in addition to the repository's. Vercel
has no such file and no such variable, so the specification tooling — which
`next build` never touches — became a hard blocker for the website's build.

Production was never affected: it deploys from `main`, and `main` does not
carry these dependencies.

## Decision

### 1. The repository declares the credential, and reads it from the environment

`.npmrc` gains one line, in the form the file already uses for the GitHub
Packages token:

```
//packages.leafcutteros.ai/:_authToken=${LEAFCUTTER_REGISTRY_TOKEN}
```

The variable is `LEAFCUTTER_REGISTRY_TOKEN` in all three Vercel environments
and an organisation secret of the same name for Actions. Both workflows —
`check.yml` and `preview-e2e.yml` — pass it in their top-level `env:` block
beside `GITHUB_TOKEN`.

**No token value is committed.** That is the reason this record does not
choose the alternative of pinning the token into `.npmrc` directly, and the
reason the variable is named for the vendor rather than for a product: it is a
read credential for a supplier's package registry, nothing more.

### 2. An unset variable fails loudly, and that is the design

`pnpm` has no default-value syntax here. Both `${VAR}` and `${VAR:-}` were
tried against the live registry: with the variable unset, `pnpm` does not
merely skip the line — it **discards the entire `.npmrc`** with
`Failed to replace env in config` and resolves every scope against
`registry.npmjs.org`. The visible symptom is then a `404` on a package that
was never public, which reads like a typo and is not one.

This is accepted rather than worked around, for two reasons:

- It is the behaviour the file already has for `GITHUB_TOKEN`, so the failure
  mode is one thing to learn, not two.
- The alternative — writing the token into `~/.npmrc` from an install command
  — would put a credential in a build log's reach and would hide the
  dependency instead of declaring it.

The consequence for a new working copy is stated where a new working copy is
set up: `CONTRIBUTING.md`. **Anyone who installs needs the variable**, and the
owner's laptop is no longer a special case that happens to work.

### 3. The tooling stays a dependency — this record does not reopen `DEC-0085`

The obvious other route was to take the STRICT packages out of the deployed
install entirely, since the website's build does not read them. It is not
taken. `DEC-0085 §1` made the framework a versioned dependency on purpose, and
a specification method that is only installed on some machines is the condition
that record exists to end. What was wrong in `DEC-0085` is one sentence of its
reasoning, not its decision.

That sentence is corrected in place, with a pointer here, in all four documents
that carried it. A false premise is not left standing because the conclusion
survived it.

### 4. The registry is a single point of failure, and it is now named as one

With this fixed, an outage or a revoked token at `packages.leafcutteros.ai`
still stops every deployment of this website, including ones that change no
specification at all. That is a real property of the arrangement in §3 and it
is recorded as `DEM-0068` rather than left as folklore. It is addressed to the owner,
not to the supplier: what is missing is a decision on what this build may depend
on, and that is ours to make.
Nothing is built for it here: the mitigation would be to vendor or cache the
packages, and that is a decision with a cost, not an executor's repair.

## Consequences

- `.npmrc` carries the token line; `check.yml` and `preview-e2e.yml` carry the
  variable. No value is in the repository.
- `DEC-0085`, `specs/README.md`, `AGENTS.md` and `TS-WEB-0017`'s method-registry
  row lose the "needs no credential" claim and name the variable instead.
- `CONTRIBUTING.md` lists `LEAFCUTTER_REGISTRY_TOKEN` among what a working copy
  needs.
- `DEM-0068` records the supplier dependency as a standing demand.
- No requirement, acceptance criterion or coverage figure changes. This is a
  correction of a false statement and a configuration line, not a new rule.
- No identifier was renumbered or reused. `DEC-0112` is the next free number
  above `DEC-0111`.

### What this record does not do

It does not make the preview green by itself. The token has to be present in
the environment that builds, which for Vercel it now is and for a fresh clone
it is not until someone sets it. The first deployment after this change is the
evidence, and until that deployment reports `Ready` this record is a claim
about a mechanism, not about a working build.
