---
id: DEC-002
title: Next.js and Vercel are the website stack
status: accepted
date: 2026-09-09
decided_by: jan-henrik.hempel
---

## Context

The requirements transcript (SRC-006) says "stay on Next.js, latest
versions, Vercel". Diversifying the stack across the ecosystem is
explicitly unwanted.

## Decision

The website uses Next.js (current major) on Vercel — as does the rest of
the stack. No second framework is introduced anywhere. → WEB-C-001.

## Consequences

Patterns adopted from sibling repositories are adopted as *intent*, never
as framework-specific implementation. Shared design tokens must take a
framework-neutral form. The existing Vercel project link remains valid.
