# Feature Architecture Skeleton

Use this when filling `docs/features/<feature>/<feature>-architecture.md`.

```md
# <Feature Name> Architecture

## Purpose
Short explanation of what this feature implements and how it fits the product. (NEVER ADD CODE TO THE ARCHITECTURE)

## Scope Of This Architecture
- What this doc covers
- What it intentionally does not cover

## Entry Points
- Frontend routes, pages, or components:
- Backend routes or controllers:
- Orchestrators, jobs, or background triggers:

## Core Components
- Component or module:
  Responsibility:
- Component or module:
  Responsibility:

## Data Flow
1. Trigger:
2. First handler:
3. Business logic:
4. Persistence or external calls:
5. Response back to user:

## Contracts And Types
- Request shape:
- Response shape:
- Message or component payloads:
- Important enums, fields, or derived values:

## Persistence
- Tables or models touched:
- Fields written:
- Fields read:
- Cache usage:

## External Dependencies
- Service:
  Why it is used:
  Failure behavior:

## Sequencing And State
- Required order of operations:
- User-visible states:
- Retry or recovery behavior:

## Failure Modes
- Failure:
  Expected system behavior:
- Failure:
  Expected system behavior:

## Code Paths
- Frontend files:
- Backend files:
- Shared helpers or domain services:

## Implementation Notes
- Constraints:
- Tradeoffs:
- Non-obvious decisions:
```

## Rules

- This doc must be detailed enough that an engineer could recreate the feature architecture in an almost identical way
- Name the real code paths and responsibilities whenever possible
- Document sequencing, contracts, persistence, and failure behavior explicitly
- Distinguish current implementation from planned follow-up work