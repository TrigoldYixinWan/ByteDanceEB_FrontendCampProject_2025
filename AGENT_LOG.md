# Agent Coordination Log

## Purpose

This file is the single canonical coordination journal for automated code agents and humans working on this repository. Agents MUST read this file before making changes that affect shared/critical files or global workspace configuration.

## Why

- Prevent duplicate/conflicting edits to critical shared nodes (e.g. `packages/shared`, `package.json`, `tsconfig.*`, `DI_KEYS`).
- Record high-level intent, claimed tasks, and recently applied changes so other agents can avoid stepping on each other's work.

## Rules (must-follow)

1. Read the latest entries before making any non-trivial change (adding/removing files, editing shared types, changing DI keys, altering scripts or workspace config).
2. Before a change, append a "Claim" entry describing the intent and the files/areas you will modify. Example tag: `Claim: Implement PrismaDocumentRepository`.
3. After making changes (patch applied), append a "Done" entry summarizing what was changed, the commit/patch id, and any follow-up steps.
4. If you need to change a global coordination rule (this file's format, locking procedure), append a `CoordinationChange` entry and notify maintainers.
5. Keep entries short, factual, and include timestamps and agent identity (or human author).
6. Use branches for non-trivial changes and reference the branch name in your entry.

## Mandatory Entry Format

Each entry is a YAML-like block for easy parsing. Agents should append to the end of this file and preserve the exact field names.

Example entry:

```
---
time: 2025-11-24T08:00:00Z
actor: agent-or-human-id
type: Claim
title: Implement PrismaDocumentRepository
scope:
  - backend/src/modules/kms/repositories/document.repository.ts
  - backend/src/infra/db/dbClient.ts
branch: feat/prisma-doc-repo
notes: "Will add Prisma schema and DB client; changes will be registered in DI via DI_KEYS.DocumentRepository"
---
```

And when completed:

```
---
time: 2025-11-24T09:12:00Z
actor: agent-or-human-id
type: Done
title: Implement PrismaDocumentRepository
scope:
  - backend/src/modules/kms/repositories/PrismaDocumentRepository.ts
  - backend/src/infra/db/dbClient.ts
commit: abc123def
notes: "Replaced in-memory DocumentRepository with Prisma-backed implementation; updated DI registration in server.ts; migrations at prisma/"
---
```

## Notes and Etiquette

- Agents may parse this file programmatically to decide whether to proceed.
- Prefer short-lived claims: if blocked or idle for >30 minutes, append an `Abandon` or `Blocked` entry explaining why so others can pick it up.
- Critical files (e.g., `package.json`, workspace scripts, `tsconfig.base.json`, `packages/shared/src`) should be modified only after a `Claim` entry and preferably after human review.

## Tooling

You can append entries manually, or use the helper script in `scripts/agent-log.js` (recommended) to avoid formatting mistakes.

Example CLI (from repo root):

```
npm run agent:log -- --actor my-agent --type Claim --title "Implement X" --scope backend/src/...
```

## Search and parsing

Agents should only read the tail of this file (last N entries) frequently; performing a full-file parse is OK periodically but avoid excessive I/O in heavy automation.

---

This file is the coordination ground truth. Any deviations (agents not following rules) should be reported as `CoordinationChange` entries.
