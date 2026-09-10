---
id: DEC-050
title: A package publish dispatches the website content update
status: accepted
date: 2026-09-10
decided_by: jan-henrik.hempel
---

## Decision

When the hub publishes a content package, it fires a `repository_dispatch`
at this repository. The workflow updates the dependency, runs the agent
diff against existing content, and opens a pull request with the changes.

Event-driven, no polling, and the trigger fires at exactly the moment
something changed. This closes the open question ADR-001 left.

## Consequences

→ WEB-F-084, TS-007 D13, TS-015 (the dispatch workflow is part of the
pipeline). A clearance revocation travels the same path but is treated as
the highest-priority case: it removes content immediately rather than
waiting for the review round. Resolves Q-018.
