# Realization Run — Entry Point

This folder is the operating manual for the one-shot realization run
of the website. The run is designed to go for hours without asking a
human anything: questions become entries in
[state/open.md](../state/open.md), findings become fix rounds,
acceptance is performed by the Customer agent against the acceptance
criteria.

## How to start a run

1. Run `pnpm preflight`. Every RED item blocks the start — fix it or
   stop. YELLOW items go into `state/open.md` and the run continues.
2. Read, in this order:
   - [guardrails.md](guardrails.md) — the guardrails
   - [project-plan.md](project-plan.md) — milestones and gates
   - [process.md](process.md) — the fix-deploy-retest loop
   - [.agents/roles/orchestrator.md](../.agents/roles/orchestrator.md) —
     your own role, if you are the orchestrating session
3. Execute M0 (tracer bullet), update `state/status.md` (run
   started, current milestone), then work the plan milestone by
   milestone.

## The documents

| File | What it governs |
| --- | --- |
| [project-plan.md](project-plan.md) | Milestones M0–M5, work packages, quality gates |
| [process.md](process.md) | Fix-deploy-retest loop, severities, abort criterion, two test tracks, skill matrix |
| [preflight.md](preflight.md) | The checklist `pnpm preflight` automates, and its manual items |
| [guardrails.md](guardrails.md) | Guardrails: what no agent may do; branch and deploy rules; stack-harmony, mock and dummy-content rules |
| [definition-of-done.md](definition-of-done.md) | When a work package counts as finished |

## The coordination substrate

Coordination runs over files, not conversation:

| Path | Written by | Read by |
| --- | --- | --- |
| `state/status.md` | Orchestrator | everyone |
| `state/open.md` | everyone | Orchestrator, Project Manager, Jan (afterwards) |
| `state/findings/round-<n>.md` | QA, Chaos, UAT | Project Manager, Developer |
| `reports/qa/` | QA | Project Manager, Customer |
| `reports/uat/` | UAT persona | Project Manager |
| `reports/acceptance/` | Customer | Jan (afterwards) |

Role files live in [.agents/roles/](../.agents/roles/), playbooks in
[.agents/playbooks/](../.agents/playbooks/), their data bindings in
[.agents/dispatch/](../.agents/dispatch/). Claude Code subagent
definitions mirror the roles in `.claude/agents/`.
