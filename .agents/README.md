# .agents — the agent system of this repository

Four layers, three of them synced or installed, one authored here:

| Layer | Where | Source | Managed by |
| --- | --- | --- | --- |
| agent-os packages | `.github/agents/` (gitignored), parts of `.agents/skills/` | `@schafe-vorm-fenster/config-engineering` | `agent-os-sync` |
| Installed skills | `.agents/skills/` (canonical) + symlinks in `.claude/skills/` | skills.sh registry, pinned in `skills-lock.json` | `npx skills` CLI |
| Run roles & playbooks | `.agents/roles/`, `.agents/playbooks/`, `.agents/dispatch/` | authored in this repo | the realization run (plan/) |
| Subagent definitions | `.claude/agents/` | authored in this repo | the realization run |

Convention: `.agents/skills/` is canonical; `.claude/skills/` holds
relative symlinks only. `skills-lock.json` pins every installed skill
with source + hash; update via `npx skills update`.

## Installed skill sets (curated 2026-09-11)

**Engineering (mattpocock/skills)** — tdd, code-review,
diagnosing-bugs, codebase-design, domain-modeling, prototype,
research, wizard, writing-for-agents, … (the original set).

**React/Next.js (official)** — `vercel-react-best-practices`
(Vercel Engineering performance rules), `web-design-guidelines`
(100+ a11y/UX audit rules), `next-dev-loop` (edit/verify loop against
the running dev server; pairs with the `next-devtools` MCP in
`.mcp.json` and `agent-browser`). Note: Next.js ≥ 16.3 additionally
ships version-matched docs in `node_modules/next/dist/docs/` and
auto-generates `AGENTS.md`; the cache-components skills from
`vercel/next.js` are worth adding when M4 adopts `use cache`/PPR
(TS-009).

**QA (anthropics/skills)** — `webapp-testing` (Playwright-driven
browser QA).

**Security (trailofbits/skills)** — `semgrep` (codebase scan),
`differential-review` (security review of PR/milestone diffs),
`supply-chain-risk-auditor` (before every new dependency's
stack-harmony ADR). Bound to the loop via the skill matrix in
plan/process.md: security sweep at the M4 and M5 gates,
differential review in fix rounds.

**Content (coreyhaines31/marketingskills + others)** — `copywriting`
(landing/homepage/pricing copy), `copy-editing` (editorial review),
`cro` (conversion review), `ux-writing` (microcopy: buttons, errors,
empty states, forms — content-designer/ux-writing-skill), `humanizer`
(blader — the canonical AI-tell remover) plus the repo-authored
**`humanize-de`** (German tell catalog; the English list does not
transfer — load both for German copy).

## Deliberately not installed

Evaluated and skipped to keep the stack harmonious (one skill per
problem): obra/superpowers (TDD/debugging/review — overlaps the
mattpocock set), hardikpandya/stop-slop (overlaps humanizer; its
em-dash ban is wrong for German), anthropics pr-review-toolkit
(six reviewer agents — our two-axis `code-review` covers the run),
the broader trailofbits research skills (fuzzing, CodeQL, audit
prep — beyond TS-014's baseline; the review-relevant subset IS
installed, see Security above; revisit the rest for the hardening
round), senshinji/claude-translation-skill (multi-agent translation
— Content role + tone-of-voice cover DE/EN). Register:
<https://skills.sh> — install via `npx skills add <owner>/<repo> -s
<skill> -a claude-code -y`, then normalize: canonical folder in
`.agents/skills/`, symlink in `.claude/skills/`.
