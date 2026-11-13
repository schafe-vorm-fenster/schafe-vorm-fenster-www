# Dispatch-Bindings

One file per playbook, Leafcutter command-dispatch shape. In this
repo the run is **local**: the orchestrator (not a CI workflow) reads
the binding, resolves the selectors against the checked-out repo, and
hands playbook + resolved interfaces to the executing subagent. The
`cmd:` names exist so a later CI wiring is pure plumbing.

Binding sources used here: `repository-file` / `repository-glob`
(resolved by the executing agent), `literal` (inline value),
`workflow-context` (supplied by the orchestrator at spawn time —
milestone, round number, report paths).
