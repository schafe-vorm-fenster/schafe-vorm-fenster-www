#!/bin/sh
# Registry credentials for the two private scopes (DEC-0112, DEC-0221).
#
# pnpm >= 10.34.2 no longer expands ${VAR} placeholders that come from the
# committed `.npmrc` (GHSA-3qhv-2rgh-x77r), so the token lines live in the
# user-level config, where pnpm still expands them. This script writes them
# there as placeholders: no token value is written to disk, and the two
# variables still have to be set when `pnpm install` runs.
#
# Runs in CI (before `pnpm install`) and on Vercel (`installCommand` in
# `vercel.json`). Locally, run it once: `sh scripts/registry-auth.sh`.
set -eu

: "${GITHUB_TOKEN:?GITHUB_TOKEN is not set (the @schafe-vorm-fenster scope on GitHub Packages)}"
: "${LEAFCUTTER_REGISTRY_TOKEN:?LEAFCUTTER_REGISTRY_TOKEN is not set (the STRICT scopes)}"

# Single quotes on purpose: the placeholder is written, not the token.
# shellcheck disable=SC2016
pnpm config set --location=user '//npm.pkg.github.com/:_authToken' '${GITHUB_TOKEN}'
# shellcheck disable=SC2016
pnpm config set --location=user '//packages.leafcutteros.ai/:_authToken' '${LEAFCUTTER_REGISTRY_TOKEN}'
