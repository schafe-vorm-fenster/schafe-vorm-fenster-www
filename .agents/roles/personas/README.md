# Chaos personas

Unstructured browser testing by behaviour profile — a local Chrome
session against the dev server, driven directly by the agent
(fallback: Playwright persona scripts, see plan/prozess.md). Each
persona plays its profile for the round's scope and logs raw
observations into `state/findings/round-<n>.md` (source
`chaos:<persona>`). Personas record; they never rate, prioritize, or
fix — severity is set by QA triage, the round decision by the
Projektmanager.
