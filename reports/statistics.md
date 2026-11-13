# Statistics — the website realization, end to end

Measured on 2026-09-14 from the repository (`git`, `wc`, `pnpm check:specs`), the session transcript (every subagent's tokens, tool uses, runtime, model) and the run's own reports. Numbers are counted, not estimated; where a number is derived, the derivation is stated.

## 1. Input material — how much, from where, how good

### Quantity

| Source | Files | Lines | What it is |
| --- | ---: | ---: | --- |
| `specs/` | 148 | 12,677 | 155 requirements (100 functional, 37 quality, 18 constraints) · 29 tactical specs (18 system/rule + 11 page specs) · **404 acceptance criteria** · 77 decisions · 70 questions · 16 sources · 20 glossary terms |
| `concept/` documents | 9 | 5,588 | website design system (358 lines, normative), content-production concept (851 lines), agent-team setup document, READMEs |
| `concept/v2.0` + `v1.0` boards | 4 | 3,457 | Style Guide, UI Design Mobile v3, UI Varianten, Wireframes (design canvases, 0.3 MB) |
| go-to-market-os concept documents | 3 | — | communication principles, relevance model, information architecture (the governing concept, consumed by link) |
| Hub packages `@schafe-vorm-fenster/*` (installed) | 365 md | 17,689 | proof 21 · media-echo 33 · people 20 · goals 27 · offerings 11 · messaging 11 · audiences 9 · brand-identity 4 · partners 3 · posts 223 (not consumed by the site) · brand-design tokens (3 files) |
| Legal texts `content/legal` | 8 | 751 | Google-Docs import, German only |

Roughly **40,000 lines of governing input** across five areas: specification, concept/design, brand/content hub, legal, and (for the run) the process material below.

### Quality — how concrete was it

- **Specification:** machine-validated (`check:specs`: 0 errors, every requirement covered by a tactical spec, every acceptance criterion with a verification level: static 76 · unit 30 · integration 72 · e2e 157 · tool 39 · manual 30). Every determination carries a provenance tag ([FIXED]/[PROPOSED]/[FREE]) and a sufficiency level (S0–S3). This is unusually high; the run could grade itself against it.
- **Design vs. specification:** the design system specified **6 components** with exact values; the page specs needed **63** → 56 had to be *derived* as [PROPOSED] build briefs (Q-0044, `plan/component-inventory.md`). Tokens, colour pairs, type scale, ratios and page rhythm were complete; component coverage was ~10 %. Boards existed for three screens (home mobile, variants, style guide), not per page. Two spec-vs-design conflicts surfaced during the build (logo radius, category taxonomy) and one spec-vs-spec (Suspense vs JS-off completeness).
- **Content sources:** rich but partly unusable for go-live: 0/31 media-echo entries and 5/5 testimonial proofs without cleared `usage_rights` (Q-0045/Q-0014); org-profile intake documents are `.gdoc` pointers without local text. Real material was sufficient to source all page copy; the gaps are clearance, not content.
- **Twelve blockers** were known before the first line of code and pre-seeded as working assumptions (`state/open.md` rows 1–12); none blocked the run.

## 2. Process input — the run's own operating system

| Artefact | Files | Lines | Assessment |
| --- | ---: | ---: | --- |
| `plan/` (project plan M0–M5, process/loop, guardrails, preflight, DoD, component inventory, gate-2 scope, rounds 3/4) | 10 | 2,367 | the milestone/gate structure held for the whole run; the skill matrix and the two rules added on Jan's decisions (mock rule, dummy-content rule) were applied by every agent |
| Roles (8), chaos personas (4), playbooks (7, Leafcutter format with `interfaces:`), dispatch bindings (7) | 28 | 1,352 | every playbook was executed at least once; the interface bindings were resolved by the agents themselves |
| Subagent definitions `.claude/agents` | 7 | 91 | model assignment opus/sonnet/haiku |
| Installed skills (`.agents/skills`, incl. the authored `humanize-de`) | 244 | 104,587 | 21 skill packages from skills.sh; the mandatory-skill matrix bound them to loop steps |
| Preflight script | 1 | 111 | 23 checks; 20 green / 3 yellow / 0 red at start — the three yellows were exactly the expected M1 items |

Setup effort: the agent-team setup (exploration of Leafcutter, the gtm example, the repo inventory; skill research ×3; authoring) took **one working morning** on 2026-09-11 (commits 08:12–12:13 CEST) with 8 exploration/research agents (0.82 M tokens).

## 3. The implementation process

### Timeline (CEST)

| When | What |
| --- | --- |
| 09-11 16:20 | `pnpm preflight` 20/3/0 · M0 tracer bullet (6/6 green, 4 min) |
| 09-11 16:26 → 17:18 | M1 foundation (33 min), M1 gate: QA clear, Customer accepted |
| 09-11 17:00 → 21:28 | build wave: components A/B/C/D, routing, content DE, pipeline, M4 libraries, wiring, CI — up to **9 agents in parallel** (peak 18:35) |
| 09-11 21:28 → 09-12 01:01 | gate 2: three rounds (QA sweep, 4 chaos personas, UAT, PM triage, fix packages A/B/C, retest) — closed with a named remainder |
| 09-12 01:01 → 10:14 | M5: fix round on the highs, full roundtrip on a production-build preview, final fix round, retest, **final Customer acceptance** (no commits 03:02–08:19 while the M5 strands ran; the Hasty Clicker alone took 6 h in an access rabbit hole) |
| 09-12 10:14 → 18:13 | after the prototype, on Jan's instructions: content follow-up from real sources, image inventory + AI imagery, CR-1 header/hero/mobile menu, the chrome-duplication fix |
| 09-13 13:00 → 13:05 | CR-2 fully transparent header (after Jan's overnight pause) |

**Wall clock, preflight → prototype accepted: ~18 h. Preflight → last change request: ~45 h**, of which ~22.5 h had at least one agent active (union of agent runtimes); the rest were review pauses (0.8 · 0.9 · 3.5 · 5.3 · 1.0 · 2.0 · 1.1 · 18.8 h gaps between commits).

### Agents, tokens, models

65 subagent launches for the website (plus 4 earlier in the hub repo), **21.5 M subagent tokens, 46.2 agent-hours of runtime, 9,956 tool calls**:

| Model | Launches | Tokens | Tool calls | Runtime (h) | Used for |
| --- | ---: | ---: | ---: | ---: | --- |
| opus | 35 | 11,798,413 | 5,381 | 26.1 | foundation, routing, pipeline, M4 libraries, wiring, PM, QA sweeps, fix packages, final acceptance |
| sonnet | 27 | 8,552,064 | 4,083 | 19.1 | components B/C, pages P2/P3, content, CI, UAT, chaos (Playwright runs), hygiene fixes |
| haiku | 4 | 287,084 | 178 | 0.3 | first chaos round (agent-browser) — two of four runs incomplete, re-run on sonnet |
| inherited (Explore/research) | 11 | 825,969 | 314 | 0.7 | exploration and web research |

By phase: build (M2–M4 developers) 14 agents / 6.1 M tokens · fix rounds 10 / 7.0 M · gates (QA, chaos, UAT, Customer) 18 / 3.3 M · content & imagery 8 / 2.7 M · PM 3 / 0.6 M · M0+M1 4 / 0.6 M · exploration 8 / 0.8 M.

**Orchestrator session** (Claude Fable 5.1, this conversation): 633 assistant turns during setup + run, **1.18 M output tokens**, 331 M cache-read tokens, 23.4 M cache-creation tokens (the long-context cost driver: every turn re-reads the cached context).

### Roundtrips

- Quality gates: M1 (1 round), gate 2 (3 rounds — the process cap), M5 (fix round + full roundtrip + final round + retest = the two full roundtrips over the complete prototype that were ordered), plus CR-1/CR-2 with their own verification.
- QA acceptance runs 5 · chaos persona runs 9 (4 + 1 re-run + 4) · UAT walks 2 · Customer protocols 3 (M1, gate 2, final) · PM decision rounds 4.
- Findings filed: **105** (round 1: 3 · round 2: 76 · round 3: 26) plus ~60 raw chaos/UAT observations triaged into them; 0 critical / 0 high open at close.
- Commits on `next-2026` since the setup commit: **257** (162 on 09-11, 92 on 09-12, 3 on 09-13); code delta since the foundation started: 576 files, **+67,628 / −73 lines** (excluding images, lockfile, installed skills).
- Decisions authored: ADR 072–077 (stack, locale/URL layer, content pipeline, last-good store, axe, generated imagery).
- Open points at close: 203 rows in `state/open.md` (18 `Mock aktiv`, 22 `Dummy-Content` originally — most now sourced, clearance register, spec-alignment rows 200–203, Jan's dashboard items 22/64, the go-live blocker 132).

### What cost time

The three verification traps discovered and then encoded (rows 147/148 and the "production build + English routes" rule): fixes that held under `next dev` but not on a production build (F-2-49), the D11 gate dropping all draft content under `VERCEL_ENV=production`, and the local CSP hash asset preventing hydration. The haiku chaos round on `agent-browser` (two incomplete runs, re-run on sonnet/Playwright). Concurrent appends to `state/open.md` (renumbered 17 rows). One high security finding filed from a code-path argument and later refuted by execution (F-2-36).

## 4. The result

### Code and tests

| | Files | Lines |
| --- | ---: | ---: |
| `app/` routes, layouts, pages | 79 | 8,186 |
| `src/components` (63 components) | 147 | 11,918 |
| `src/lib`, `src/domain`, `src/clients` | 104 | 11,016 |
| **production code** | **330** | **31,120** |
| unit + integration tests | 104 | 9,295 |
| e2e (Playwright, 26 specs) | 26 | 5,674 |
| **tests** | **130** | **14,969** (0.48 lines of test per line of code) |
| scripts (9 static guards, generators, preflight) | 22 | 3,487 |
| content artifacts (11 pages × de/en, `images[]`) | 22 | 4,514 |
| generated + real images | 24 | 1.83 MB |

`pnpm check` — the single gate — runs 9 static guards (specs, content, frontmatter, brand literals, CSP, API routes, stack register, contrast, SEO budget), typecheck, lint, **1,113 unit/integration tests** in ~8 s. e2e on a production build: **550 passed / 0 failed / 8 skipped**; against the preview 543 / 0 / 15.

### Requirement fit

358 acceptance criteria in the gate scope (of 404): **285 pass (80 %) · 28 fail (8 %) · 45 not-testable (12 %)** at the final QA run. The 28 fails are all medium/low and each is a recorded decision or a deferred item (Suspense vs JS-off, performance floor 98, OG images, moderate a11y nodes, production-only CSP hydration). The 45 not-testable are instrument gaps (no screen reader, no eTracker account, stage-2 CI, production domains). Gate scope exclusions: stage-2 CI, production promotion, the `next.*` domain.

### Quality

| Measure | Result |
| --- | --- |
| Lighthouse mobile (preview) | performance 93–100 per page (`/` 94–96, `/dein-ort` 93–100, `/mitmachen` 97, `/ueber-uns` 94, `/ueber-uns/archiv` 97–99), **accessibility 100 on every page**, desktop 100 |
| Layout stability | CLS 0 – 0.0007 on every route (archive was 0.22 before the fix) |
| axe | 0 serious / 0 critical on 24 routes × 2 viewports with the stricter rule set; 6 moderate nodes left by decision |
| Keyboard | 242 tab stops walked, 0 without a visible focus ring; all conversion paths completable keyboard-only in both locales; menu overlay with focus trap |
| Contrast | hero text 9.6–15.5:1 display / ≥ 11:1 body; header items over the hero ≥ 16:1 against their wells |
| Security | CSP + full header set on every response, no-wildcard guard, GET-only API guard, privacy allowlist e2e (browser talks only to the site), semgrep 0 true positives; production hydration under the hash-only CSP remains the one go-live blocker (row 132) |
| Rendering | 8 routes static/partially prerendered, 4 dynamic by decision, Cache Components on, three-tier resilience with the Vercel Runtime Cache |

### Conversion goals

9 goals registered against the hub package; **5 wired and walked end to end** (save-calendar-to-homescreen, register-as-publisher, request-product-briefing, buy-calendar-licence, request-licence-quote), 4 are `stage: null` by spec. Every goal event fires exactly once per action (verified after two double-fire defects were fixed). UAT: all nine walks reach their goal, no dead ends at close. Forms: envoy widget, newsletter, order and quote are labelled mocks with no `name` attributes — nothing leaves the browser.

### Content and imagery

78 content slots × 2 locales; after the follow-up every proof stream, testimonial and the whole archive (31 real media-echo entries) comes from real hub sources, 12+ of them with `clearance: pending` (go-live register). Still exemplary for lack of any source: the AI-use sentence, the response-time promise (withheld), the accessibility statement, the registration step-2 vocabulary. Images: 13 motifs → 21 renditions generated with `bfl/flux-pro-1.1` (≈ $0.84), 3 cleared real photographs, 6 slots honestly "Foto gesucht"; every generated image badged as a placeholder.

### Pipeline

Local: pre-commit hook = `pnpm check` (green on every one of the 257 commits that ran it). GitHub Actions: `check.yml` (check · build · e2e) and `preview-e2e.yml` (Vercel Git-integration deployment → smoke) exist and are correctly gated, but **fail at install** because Actions cannot read the org's private packages until the per-package "Manage Actions access" setting is made in the dashboard (row 64). Every Vercel preview was deployed from the CLI and verified with the full suite through the protection bypass; production was never touched.

## 5. In prose

The website was built in one continuous, mostly unattended run of about eighteen hours from a specification that was unusually complete — 404 machine-checked acceptance criteria — and a design that specified the tokens exactly but only a tenth of the components. An orchestrating session decomposed the plan and ran 65 subagents (35 on Opus, 27 on Sonnet, 4 on Haiku), up to nine at once, through a foundation milestone, a parallel build wave, three gated rounds of QA, chaos testing, user walks and customer acceptance, and a final phase on production builds. The agents wrote 31,000 lines of application code and 15,000 lines of tests, consumed 21.5 million tokens, filed 105 findings against themselves and closed every critical and high one. The result is a complete prototype in German and English — twelve routes, sixty-three components, real content from the brand's own sources, five working conversion paths, accessibility 100, zero layout shift — accepted by the customer agent as the prototype that was ordered, with 203 documented open points that name exactly what separates it from a live site: one CSP decision, two dashboard settings, read tokens for two APIs, and the clearances for the content that is now real.
