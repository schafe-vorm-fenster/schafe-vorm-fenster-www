---
id: DEC-025
title: The website is its own BFF; external API tokens never reach the client
status: accepted
date: 2026-09-09
decided_by: jan-henrik.hempel
---

## Decision

The website offers use-case-tailored endpoints for its client
interactions and calls the ecosystem APIs exclusively server-side.
Client-facing website endpoints are protected by rate limiting and
origin checks — no client-side tokens (public read data; a token in the
browser is theatre, the real controls are quota and origin).

## Context

All ecosystem data endpoints are token-scoped. Interactive elements
(place search, compose-flow live preview) need client calls.
