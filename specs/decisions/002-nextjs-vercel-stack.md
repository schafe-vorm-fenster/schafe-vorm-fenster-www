---
id: DEC-002
title: Next.js and Vercel are the website stack
status: accepted
date: 2026-09-09
decided_by: jan-henrik.hempel
---

## Context

The requirements transcript (SRC-006) says "stay on Next.js, latest
versions, Vercel"; the product moved to Astro — a potential conflict.

## Decision

The website uses Next.js (current major) on Vercel. → WEB-C-001.

## Consequences

No stack alignment with the product; shared design tokens would need a
framework-neutral form. The existing Vercel project link remains valid.
