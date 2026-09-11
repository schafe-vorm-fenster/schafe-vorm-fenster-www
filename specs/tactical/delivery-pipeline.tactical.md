---
artefact: tactical-spec
id: TS-015
profile: procedure
status: DRAFT
implements: [WEB-C-020, WEB-C-021, WEB-C-022, WEB-C-023]
sources: [SRC-012]
decisions: [DEC-002, DEC-031, DEC-035, DEC-040]
---

# TS-015 — Delivery Pipeline

## Purpose

How the site gets built, checked and shipped: the migration preview on
`next.schafe-vorm-fenster.de`, the GitHub Actions pipeline that gates
every merge, the rolling production promotion with its explicit
rollout-or-rollback decision, and the protection + `noindex` regime on
every deployment that is not production. Quality *thresholds* live in
TS-002 and TS-003; this spec fixes *when they run and what they block*.

## Determinations

### D1 — Two stages, one pipeline grown in two steps [FIXED: DEC-031]

| | Stage 1 — migration (now) | Stage 2 — operation (from cutover) |
| --- | --- | --- |
| Trigger | push to `next-2026` | push to a feature branch · push to `main` |
| Target | migration preview (D2) | preview per branch · production |
| Runs | `Check` · `Quality` · deploy | full job graph (D4) · promotion (D7) |
| Gates a merge | no — the branch is the workspace | yes (D5) |
| Public | no — protected + `noindex` (D3) | production only |

Stage 1 exists to prove the deploy chain end to end without going live.
The workflow files are written once, in the shape of D4/D7; stage 1 is
that pipeline with the promotion job disabled, not a second pipeline.

### D2 — Branches, environments, hosts [FIXED: DEC-031, DEC-035; branch names PROPOSED]

| Branch | Vercel target | Host | Protection | Indexable |
| --- | --- | --- | --- | --- |
| `main` | production | `www.schafe-vorm-fenster.de` + the other live domains | none | yes |
| `next-2026` | preview, aliased | `next.schafe-vorm-fenster.de` | Vercel Authentication | no |
| `feat/*`, `fix/*`, `chore/*` | preview | generated `*.vercel.app` | Vercel Authentication | no |

One Vercel project (DEC-002), not two. The migration preview is a
**branch alias**: `next.schafe-vorm-fenster.de` is assigned to the
`next-2026` branch in the project's domain settings, so every push to
that branch replaces what the host serves. The alias is claimed only
after the product's pre-launch preview vacates the host (DEC-035) — an
external coordination point, not a code dependency; until then the
branch deploys to its generated preview URL and everything else in this
spec is unchanged.

`main` is protected: no direct pushes, squash merge only, linear
history, required checks per D5.

### D3 — Protection and `noindex` on everything that is not production [FIXED: WEB-C-020, WEB-C-023]

Two independent layers. Either alone is a single point of failure, so
both are required.

**Layer 1 — access.** Vercel Deployment Protection set to *Standard
Protection* (Vercel Authentication) for all preview deployments,
including the migration preview. Production is exempt. CI reaches
protected deployments with the automation bypass:
header `x-vercel-protection-bypass: ${{ secrets.VERCEL_AUTOMATION_BYPASS_SECRET }}`
(D10). No workflow ever disables protection to run a test.

**Layer 2 — indexing.** Independent of protection, because protection
can be lifted for a demo and the indexing rule must survive that. One
predicate, evaluated in the app:

```text
indexable  =  process.env.VERCEL_ENV === "production"
              && requestHost ∈ canonicalPublicHosts   (TS-004 D1 domain set)
```

Anything else is non-production and emits, in all three places:

| Surface | Non-production output |
| --- | --- |
| Response header (proxy, all routes incl. assets) | `X-Robots-Tag: noindex, nofollow` |
| `robots.ts` (WEB-F-079) | `User-agent: * / Disallow: /`, no sitemap reference |
| Page metadata (root layout, WEB-F-073) | `<meta name="robots" content="noindex, nofollow">`, no canonical to a live host |

The host test is part of the predicate on purpose: a production-target
deployment reachable under a non-canonical hostname is still not
indexable.

### D4 — Merge-gate job graph, feature branches [FIXED: SRC-012, WEB-C-021; names and layout PROPOSED]

Workflow `.github/workflows/preview.yml`, `on: push: branches-ignore: [main]`,
`concurrency: { group: ${{ github.workflow }}-${{ github.ref }}, cancel-in-progress: true }`.

| # | Job | needs | Steps (in order) | Blocks merge |
| --- | --- | --- | --- | --- |
| 1 | `Check` | — | install · `pnpm check` (D9) · `pnpm typecheck` · `pnpm lint` · `pnpm test` (unit + integration, coverage) · upload coverage | yes |
| 2 | `Quality` | — | install · `pnpm knip` (dead code) · `pnpm jscpd` (duplication) · `pnpm security` (audit) · upload reports | yes |
| 3 | `Preview-Deployment` | 1, 2 | `vercel pull --environment=preview` · `vercel build` · `vercel deploy --prebuilt` · output `deployment_url` | yes |
| 4 | `Budgets` | 3 | Lighthouse CI on the five TS-003 D7 routes · bundle guard (TS-003 D7) · axe-core sweep (TS-002 A1) — all against `deployment_url` with the bypass header | yes |
| 5 | `E2E-Preview-Tests` | 3 | validate bypass secret · wait-for-ready loop on `/` (30 × 10 s) · `pnpm e2e:ci` against `deployment_url` · upload traces | yes |

Jobs 1 and 2 run in parallel; 4 and 5 run in parallel after 3. Nothing
deploys before both static gates are green — a preview URL is a claim
that the code passed.

Deviation from SRC-012, deliberate: **no `paths-ignore: "**/*.md"`.**
In this repository Markdown *is* the specification and `pnpm check`
(D9) is a real gate over it. Doc-only pushes run jobs 1–2 and skip 3–5
via a `changed-files` guard rather than by skipping the workflow.
[PROPOSED]

### D5 — What blocks a merge [FIXED: WEB-C-021; the required-check list PROPOSED]

Required status checks on `main` — exactly these five contexts:
`Check`, `Quality`, `Preview-Deployment`, `Budgets`, `E2E-Preview-Tests`.

| Verdict | Blocks | Why |
| --- | --- | --- |
| TypeScript error | yes | — |
| ESLint error | yes | warnings do not fail; the config decides severity |
| Any unit/integration test red | yes | — |
| Coverage below threshold | yes | threshold set in the test config, not here |
| `check:frontmatter` / `check:specs` **error** (E1–E10) | yes | D9 |
| `check:specs` **warning** (W1–W3) | **no** | burn-down, D9 |
| knip: unused file, export or dependency | yes | — |
| jscpd above the duplication threshold | yes | — |
| Vulnerability audit finding at the configured severity | yes | — |
| Preview build or deploy failure | yes | — |
| Lighthouse Performance < 98 · bundle over budget | yes | TS-003 D7 owns the numbers |
| axe-core violation | yes | TS-002 owns the rule set |
| Playwright journey suite red | yes | — |
| Optional scanners marked `continue-on-error` | no | reported only |

A red required check blocks the merge button and blocks auto-merge (D6)
alike; there is no path that merges around them.

### D6 — Auto-merge rules [FIXED: SRC-012]

Two workflows, adopted from SRC-012 unchanged in intent.

`auto-merge-label.yml` — `on: pull_request [opened, edited, synchronize]`.
Adds the `auto-merge` label when the actor is `dependabot[bot]`,
`github-actions[bot]` or `copilot[bot]`, or the title starts with
`chore(deps)`, `fix(deps)` or `chore(release)`. Nothing else is ever
labelled automatically; a human may add the label to any PR.

`auto-merge.yml` — `on: pull_request [labeled, opened, synchronize]`,
`pull_request_review [submitted]`, and
`workflow_run` completion of the preview workflow.

| Condition | Action |
| --- | --- |
| no `auto-merge` label, or draft | skip |
| label present, `mergeStateStatus == CLEAN` | `gh pr merge --squash` |
| label present, any other merge state | `gh pr merge --auto --squash` — GitHub merges when D5 goes green |
| a required check fails | never merges; the PR stays open |

Auto-merge is a convenience over the gate, never a bypass of it: the
`--auto` path hands the decision to GitHub's own required-checks
evaluation.

### D7 — Production promotion: rolling release, explicit decision [FIXED: WEB-C-022, DEC-031]

Workflow `.github/workflows/deploy.yml`, `on: push: branches: [main]`.

| # | Job | needs | What it does |
| --- | --- | --- | --- |
| 1 | `Check` | — | same steps as D4 job 1 |
| 2 | `Quality` | — | same steps as D4 job 2 |
| 3 | `Canary-Deployment` | 1, 2 | `vercel pull --environment=production` · `vercel deploy --prod` — starts the rolling release; the new build serves the canary stage only |
| 4 | `Canary-Gate` | 3 | resolves the canary deployment id, waits for readiness, runs the canary evaluation of D8, publishes the verdict as a job output |
| 5 | `Promotion` | 4 (`if: always()`) | reads the verdict and executes **exactly one** of rollout / rollback (below) |

The rollout-or-rollback decision is a separate job from the tests on
purpose: a crashed or cancelled test job must still resolve the rolling
release rather than leave production half-promoted.

| Verdict | Call | Follow-up |
| --- | --- | --- |
| pass | `POST /v1/projects/{projectId}/rolling-release/complete` | run summary records the promoted deployment id |
| fail | `POST /v1/projects/{projectId}/rollback/{previousReadyProductionUid}` | comment on the originating PR, open an issue labelled `production` · `e2e-failure` · `canary`, attach artefacts |
| gate job did not report (timeout, cancel) | treated as **fail** | as above, with the reason recorded |

`previousReadyProductionUid` = the second entry of
`GET /v6/deployments?target=production&state=READY&limit=2`. If it
cannot be resolved, the workflow fails loudly and says manual rollback
is required — it never leaves a green run over an unresolved release.

Merges are serialised: `concurrency: { group: production-release,
cancel-in-progress: false }`, so two rolling releases are never open at
once. [PROPOSED]

### D8 — What the canary gate evaluates [FIXED: DEC-070]

Four signals, evaluated against the canary stage only (requests carry
the canary-forcing query parameter so they are not served by the
previous build):

| Signal | Check | Verdict |
| --- | --- | --- |
| Readiness | `GET /` on the production host, canary-forced, returns 200 within 30 × 10 s | fail on timeout |
| Journeys | `pnpm e2e:ci` — the Playwright journey suite (`specs/verification/journeys`, DEC-040) in canary mode | fail on any red test |
| Route smoke | every path of the TS-004 D1 inventory answers its expected status (200 for pages, 404 for the landing-only rule, 200 for `sitemap.xml` / `robots.txt` / `llms.txt`) | fail on any mismatch |
| Canary logs | error-level lines in the deployment log | **report only** — counted into the run summary, never the verdict |

Lighthouse, axe and the bundle guard stay at PR level (D4 job 4); they
are not repeated against the canary — a regression they would catch has
already blocked the merge.

### D9 — The spec checker in CI; warnings are a burn-down [FIXED: DEC-070]

`pnpm check` (= `check:frontmatter` + `check:specs`) runs today only as
a Husky pre-commit hook. A hook is skippable (`--no-verify`) and does
not run for changes authored outside the repo working copy, so the same
command becomes the first step of the `Check` job in both workflows.

| Class | Meaning | CI behaviour |
| --- | --- | --- |
| E1–E10 | format, ID uniqueness, reference integrity, coverage-table closure | non-zero exit → job red → merge blocked (D5) |
| W1 | requirements no tactical spec covers | reported |
| W2 | covered requirements with no acceptance criterion | reported |
| W3 | acceptance criteria no test references | reported |

Reporting, not gating: the job appends the warning block to
`$GITHUB_STEP_SUMMARY` and posts it as a single sticky PR comment
(updated in place, never appended). The counts may rise between
commits — the burn-down is reviewed per release, not enforced per PR,
because W3 is empty of meaning until tests exist at all (DEC-040) and a
ratchet on it would stall the spec phase. No threshold, no `--max-warnings`.

The checker exits with the *number of errors*; CI must treat any
non-zero exit as failure and must not translate the count into a
tolerance.

### D10 — Secrets and variables [FIXED: SRC-012; names PROPOSED]

| Name | Kind | Used by |
| --- | --- | --- |
| `VERCEL_TOKEN` | secret | every `vercel` CLI call and every Vercel REST call |
| `VERCEL_ORG_ID` | secret | workflow `env` |
| `VERCEL_PROJECT_ID` | secret | workflow `env`, rolling-release and rollback endpoints |
| `VERCEL_AUTOMATION_BYPASS_SECRET` | secret | D4 jobs 4 and 5, as `x-vercel-protection-bypass` |
| `GITHUB_TOKEN` | built-in | auto-merge, PR comment, issue creation |
| `E2E_BASE_URL` | variable | production host for the canary gate |

Tokens never reach the browser and never appear in a deployed bundle
(DEC-025 governs runtime tokens; this row is about CI). A workflow that
finds a required secret empty fails with an explicit message naming the
setting to add, rather than proceeding and timing out.

### D11 — Runner and toolchain [FIXED: DEC-070]

`runs-on: ubuntu-latest`, no custom container. SRC-012 runs its jobs in
a prebuilt `ci-runner` image; the website starts without one and adopts
it only if install time becomes the bottleneck — the image is an
optimisation, not part of the contract.

Node version from `.nvmrc` via `actions/setup-node` with `cache: pnpm`;
pnpm per `packageManager` in `package.json` (10.x, WEB-C-005);
`pnpm install --frozen-lockfile` everywhere. Playwright browsers are
installed with `--with-deps` and cached by version.

## Free for the generator

- [FREE] Step names, artifact names, retention days (≥ 7), and the exact
  layout of run summaries.
- [FREE] Whether `Quality` stays one job or splits per tool, as long as
  the required-check contexts of D5 are preserved.
- [FREE] Cache keys and restore-key strategy.
- [FREE] The shape of the readiness wait loop, within D8's budget.
- [FREE] Report formats written under `reports/`.

## Acceptance criteria

| ID | Level | Check |
| --- | --- | --- |
| TS-015-A1 | integration | With `VERCEL_ENV != "production"` or a non-canonical host: every response carries `X-Robots-Tag: noindex, nofollow`, `/robots.txt` disallows all, and the page emits the noindex meta tag. With production + canonical host: none of the three. |
| TS-015-A2 | tool | The migration preview host answers unauthenticated requests with Vercel's protection challenge, and 200 only with a valid `x-vercel-protection-bypass` header. |
| TS-015-A3 | static | `preview.yml` and `deploy.yml` declare the D4 / D7 jobs with exactly the specified `needs` edges, and neither carries a `paths-ignore` for `**/*.md`. |
| TS-015-A4 | tool | A branch introducing a type error, a lint error, a failing test, an unused export, or a duplicated block above threshold turns the corresponding job red and leaves the PR unmergeable. |
| TS-015-A5 | tool | `pnpm check` failing on an E-class error turns `Check` red; a run with only W1/W2/W3 warnings exits 0, and the warning block appears in the run summary and the sticky PR comment. |
| TS-015-A6 | e2e | The Playwright journey suite runs green against the preview deployment URL reached through the bypass secret. |
| TS-015-A7 | tool | On a green push to `main`: a canary production deployment is created, the D8 signals are evaluated against the canary, and `rolling-release/complete` is called exactly once. |
| TS-015-A8 | tool | With a deliberately failing canary journey: no completion call is made, `rollback/{previousReadyProductionUid}` is called, the production alias serves the previous build, and an issue plus PR comment are created. |
| TS-015-A9 | tool | Lighthouse CI, the bundle guard (TS-003 D7) and the axe sweep (TS-002 A1) run in `Budgets` after the preview deployment and before the merge gate resolves. |
| TS-015-A10 | tool | A bot PR carrying the `auto-merge` label merges only after all five required checks are green; with one check red it stays open. |
| TS-015-A11 | integration | `next.schafe-vorm-fenster.de` serves the head of `next-2026` after a push to that branch, protected and noindex. |
| TS-015-A12 | manual | Per release: branch protection on `main` lists exactly the five D5 contexts, and every D10 secret and variable is present in the repository settings. |

## Coverage

| Requirement | Discharged by |
| --- | --- |
| WEB-C-020 (migration stage on `next.*`, protected, noindex) | D1, D2, D3 · A1, A2, A11 |
| WEB-C-021 (CI pipeline gates every merge) | D4, D5, D6, D9, D10, D11 · A3, A4, A5, A6, A9, A10, A12 |
| WEB-C-022 (rolling production promotion, rollout-or-rollback) | D7, D8 · A7, A8 |
| WEB-C-023 (protection + noindex on all non-production) | D2, D3 · A1, A2, A11 |

## Open points

- **When does `next.*` become free?** DEC-035 calls the product's
  vacating of the host an internal coordination point. Who signals it,
  and does the migration preview run on its generated URL until then
  (D2's fallback) or wait? A date would let A11 be scheduled.
- **Rolling-release stage plan.** D7 assumes Vercel rolling releases are
  enabled on the project, but the stage configuration — canary share,
  auto-advance interval, or manual advance gated solely by our
  `complete` call — is undecided. D8's canary-forced requests depend on
  that setting existing.
- **Readiness probe.** SRC-012 probes `/api/health`. The TS-004 D5 BFF
  inventory has no health route, so D8 probes `/`. If a dedicated health
  route is preferred, TS-004 D5 needs the amendment — a probe that
  renders the home page is a heavier and noisier signal.
- **Burn-down governance.** D9 rejects a ratchet for now. Open: where is
  the W1/W2/W3 report actually read — run summary only, or a standing
  tracking issue updated per merge — and at which milestone does W2
  become a gate?
- **Content-triggered production deployments.** Q-018 asks how a content
  change in `go-to-market-os` triggers a rebuild. A deploy hook fires a
  production deployment that never passed through D4. Does such a
  deployment get the D7 canary treatment, or is it exempt?
- **Cutover mechanics.** Does `next-2026` merge into `main` by PR at
  cutover — in which case the whole D4 gate must pass on a very large
  diff — or does the branch become `main`? The first is consistent with
  D5; the second is faster and gates nothing.
