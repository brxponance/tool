# Feature Requirements Template

A feature requirements doc explains what must be built for one feature and what the user experience must feel like. It should be clear enough that someone reading the docs can understand the feature before reading code.

Critical rule:
- Before anything else, explain the UI and UX in simple words
- The user experience must be written as a step-by-step process
- Include conditionals, alternate paths, edge cases, and what the system does at each step
- Say what the user sees first, what they do next, what should feel easy, and what must not confuse them
- Do not start with tables, APIs, or technical implementation
- Never add code to the requirements doc

## File Structure

```markdown
# [Feature Name] Requirements

> **Source of Truth**: [feature-architecture.md](./feature-architecture.md)

---

## Step-by-Step User Experience

This section comes first on purpose. Write it in plain language.
Do not summarize. Walk through the experience in the exact order the user lives it.

Explain:
- who the user is
- what they are trying to do
- what they see first
- what action they take first
- what should feel fast, obvious, and easy
- what could confuse them and how the feature avoids that
- what the loading, empty, error, and success states feel like
- how the feature should work on mobile and desktop
- what the tone of the copy should be
- what happens if the user takes a different path
- what happens if required data is missing
- what happens if something fails
- what happens if the user goes back, retries, skips, edits, or cancels

Write it like this:

### Step 1
- User sees:
- User understands:
- Primary action:
- System response:

If [condition]:
- User sees:
- System does:
- Next step:

If [different condition]:
- User sees:
- System does:
- Next step:

### Step 2
- User sees:
- User does:
- System response:
- What must feel easy or obvious:

If [condition]:
- Branch behavior:

### Step 3
- User sees:
- User does:
- System response:
- Completion or next action:

---

## Overview

One or two short paragraphs describing what the feature does, why it exists, and how it fits into the broader product.

---

## User Flow

1. User starts at...
2. User sees...
3. User does...
4. System responds...
5. User confirms, edits, or continues...
6. Feature completes when...

---

## Requirement Groups

### FEAT-REQ-001: [Requirement Group Name]
| Requirement | Status | Notes |
|-------------|--------|-------|
| Specific deliverable | Planned | Brief context |
| Another deliverable | In Progress | Constraint or dependency |

### FEAT-REQ-002: [Another Requirement Group]
| Requirement | Status | Notes |
|-------------|--------|-------|
| Deliverable description | Done | Where it lives or how it behaves |
| Edge case handling | Blocked | Why it is blocked |

---

## Validation And Guardrails

| Requirement | Status | Notes |
|-------------|--------|-------|
| Input validation rule | Planned | What must be checked |
| Error handling behavior | Planned | What the user should see |
| Permissions or auth rule | Planned | Boundary or restriction |

---

## States

Describe the required behavior for:
- loading state
- empty state
- error state
- success state
- retry state if needed

---

## Edge Cases

- Case
- Case
- Case

---

## Related Documentation

- [Feature Architecture](./feature-architecture.md)
- [Feature Journal](./feature-journal.md)
```

## Guidelines

### UI/UX Experience Section

- This is the most important section to write first
- Use very simple words
- Write like you are explaining the feature to a smart person who has never seen the product before
- Focus on clarity, ease, confidence, and what the user should feel
- Be detailed about the user journey, but keep the language easy to follow
- Always write the experience in order, step by step
- Include conditional branches such as:
  - if the user is new
  - if data already exists
  - if a field is missing
  - if the request fails
  - if the user edits or retries
  - if the user completes the happy path
- The reader should be able to map the exact experience from first screen to final outcome without guessing

### Requirement Groups

- Group by capability, not by file
- Use a consistent ID prefix per feature
- Number sequentially and do not reuse IDs

### Individual Requirements

- One verifiable item per row
- Notes should explain behavior, constraints, or implementation location briefly
- "Done" means implemented and verified, not just written

### Overview Section

- Keep it short
- Explain the purpose of the feature, not the implementation
- Leave technical structure for the architecture doc

### Validation And Guardrails

- Include input validation, permissions, error handling, and any important rules
- If the feature has no special constraints, say that clearly instead of leaving it vague

### States Section

- Do not skip this
- A feature is not well specified if loading, empty, error, and success behavior are missing

## When to Update

- New requirement identified -> add a row with status `Planned`
- Work starts -> change to `In Progress`
- Work finishes -> change to `Done`
- Scope removed -> change to `Cut` and explain why
- Dependency discovered -> change to `Blocked` and explain what is blocking it
- UX direction changes -> update the `Step-by-Step User Experience` section first

## When NOT to Use This

- For implementation detail about modules, data flow, or contracts -> use the architecture doc
- For decision history and rationale -> use the journal doc
- For raw task tracking -> use whatever planning system or issue tracker the project is actually using