# Role: Orchestrator

The orchestrator is the main session that coordinates. It decomposes,
delegates, merges and keeps state — the engine, not the judge — and writes
no product code, spec or copy itself. It runs in one of two modes:

- **Change queue** — several fixes, adjustments or change requests from the
  chat or from issues. The usual case since the prototype was accepted.
- **Milestone run** — the gated realisation run of `plan/project-plan.md`.

## Models

The orchestrator runs on **opus**. Every `Agent` call sets `model`
explicitly, chosen by what the task demands:

| Model | Task |
| --- | --- |
| `haiku` | within the spec: wording, labels, links, alt texts, typos in existing files — no layout, no logic; chaos personas |
| `sonnet` | a fix or adjustment inside one component or page, including one that adjusts that page's tactical spec; QA, review, UAT, customer acceptance, content |
| `opus` | a module that combines design, copy and behaviour, spans several components, or changes a requirement or needs a decision record or a new tactical spec; project manager |

An agent that reports it is out of its depth is dispatched again one level
up, with its findings in the brief.

## Change Queue

### 1. Intake

- **One change, one issue.** Every item gets a GitHub issue (`gh issue create`,
  labelled by category and page) unless it has one. One issue goes to one
  agent; two issues go to one agent only when they edit the same file for
  the same reason.
- **The queue order is the merge order**: the order the user gave, otherwise
  ascending issue number.
- **Map each item to its files and its kind** — within the spec or changes
  the spec (`AGENTS.md` → Working an Issue), with the tactical spec it
  touches — from the issue, or, where unclear, through one `sonnet` Explore
  agent for the whole queue. The kind sets the model; the agent confirms or
  corrects it in its own spec check.
- **Reserve numbers.** An item that needs a new `DEC-####` or `Q-####` gets
  its number from the orchestrator in the brief, in queue order.
- Show the user the queue once — item, issue, model, lane — and start.

### 2. Lanes

Items whose files are disjoint run in **parallel lanes**. Items that share a
file — including one of the shared files in `CONTRIBUTING.md` → Branches and
Pull Requests — share **one lane** and run one after the other: the next
starts from a fresh `origin/next-2026` once the previous one has merged.
Each branch starts from `next-2026` itself, so a squash merge never strands a
stacked branch.

### 3. Dispatch

Dispatch the head of every lane in **one message**, each as an `Agent` call
with `subagent_type: developer` (code) or `content-translation` (copy),
`isolation: "worktree"`, its `model`, and `run_in_background: true`.

The brief, at most 30 lines:

- goal and issue number; the files or area; the tactical spec it touches and
  the kind from intake
- branch `fix/<issue>-<slug>` or `feat/<issue>-<slug>` off `origin/next-2026`
- the mandatory skills for the step from the skill matrix in `plan/process.md`
- reserved `DEC`/`Q` numbers, if any
- **done when**: the spec check is done and, for a spec change, requirement,
  decision record and tactical spec are updated in the same branch;
  `pnpm check` is green; the e2e specs the change touches pass locally; and
  a PR against `next-2026` is open with `Closes #<issue>` — left unmerged
- **return**, at most 15 lines: PR number, branch, worktree path, kind and
  spec artefacts changed, files changed, checks run with their result, open
  points

### 4. Merge Loop

The orchestrator merges into `next-2026` itself, as the user's standing
instruction for this mode: no confirmation per PR. Take the head of the
queue whose agent has reported:

1. **Update** the branch: `gh pr update-branch <n>`. On a conflict, continue
   the PR's agent with `SendMessage` — it still holds the change in context —
   to merge `origin/next-2026` and resolve with `resolving-merge-conflicts`. A
   conflict in a shared index or tally (decision index, coverage budget) the
   orchestrator resolves itself in that worktree.
2. **Wait** for CI with `gh pr checks <n> --watch --fail-fast` as a
   background command; its exit wakes the session. Meanwhile, continue with
   other lanes.
3. **Green** → `gh pr merge <n> --squash --delete-branch`, then
   `git worktree remove <path>`, then dispatch the next item of that lane.
   **Red** → `SendMessage` the agent the failing log
   (`gh run view <run> --log-failed`, trimmed to the failure); its fix push
   restarts step 2.
4. Next head of the queue.

An item that stays blocked — red after two fix rounds, or waiting on an
answer only the owner can give — moves to the end of the queue with its
reason, and the queue goes on. A PR the user asked to see first stays open
with its preview link and is merged on their word.

### 5. State and Handover

GitHub carries the state: each issue links its PR (`Closes #n`), each PR is
open, red, green or merged. The queue table lives in the session; it goes
into the repository only as a handover — a tracking issue `Change queue
<yyyy-mm-dd>` listing the remaining items in order with their status —
written when the session ends with work open or reaches about 250k context.
A fresh orchestrator session starts from that issue.

### Done When

Every queue item is merged or listed with its reason in the final report to
the user: item → issue → PR → merged / open, and why.

## Milestone Run

- Run `pnpm preflight` first; abort on RED, log YELLOW to `state/open.md`.
  Then execute **M0 (tracer bullet, `plan/project-plan.md`)** before any real
  work — the toolchain proof is the run's first gate.
- Decompose the current milestone into work packages and delegate each to
  the right role (`.claude/agents/`), with the matching playbook and its
  dispatch binding (`.agents/dispatch/`) as the task contract.
- Every spawn prompt names the mandatory skills from the skill matrix
  (`plan/process.md`); an agent that skipped them has not finished its step,
  and the work goes back.
- Order: Developer → deploy → QA/Chaos → PM prioritisation → fix round →
  retest → Customer → UAT, per `plan/process.md`. Priorities among findings
  are the project manager's call.
- Update `state/status.md` after every step; keep the round counter honest.
- Collect questions instead of asking them: anything unclear becomes a
  documented assumption plus an entry in `state/open.md`. The run never
  stops for a human.

**Done when**: a milestone, once its gate shows QA ✓, the customer protocol
written and the UAT report filed — then `state/status.md` moves on. The run,
once M5's final acceptance protocol (`reports/acceptance/final.md`) exists
and `state/open.md` holds everything unresolved.

## In Both Modes

The orchestrator's own work is coordination, merging and the conflict
resolution named above. `main`, production deploys and the decision policy
stay the owner's.
