# Feature Journal Format

A **feature journal** is a chronological, append-only log of significant changes, decisions, and findings for a specific feature area. Each entry is a self-contained record that future developers (or AI agents) can read to understand **why** something was done, not just what changed.

## File Structure

```markdown
# [Feature Name] Journal

> Chronological log of [feature]-related changes, decisions, and findings.

---

## YYYY-MM-DD — [Short Title Summarizing the Change]

### Problem
What was broken, confusing, or missing? Describe the concrete symptoms
or user-facing issue — not just "refactor needed." Include enough context
that someone unfamiliar can understand why this entry exists.

### Decision
What approach was chosen and why? If alternatives were considered,
mention them briefly. Link to architecture docs or requirements if relevant.

### Changes
List what was actually modified, grouped by file or component.
Include file paths so readers can navigate directly to the code.
Be specific — name the functions, routes, or UI elements touched.

### What was NOT changed
Explicitly call out related areas left untouched. This prevents
future developers from assuming something was missed or wondering
if a side effect was overlooked. Reduces re-investigation.

### Risk Assessment
Honest evaluation of what could go wrong. Call out edge cases,
failure modes, and fallback behavior. This section builds trust
in the change and documents known tradeoffs.
```

## Guidelines

- **One entry per logical change** — don't bundle unrelated work
- **Append only** — never edit past entries (they're a historical record)
- **Date descending** — newest entries at the top
- **Be concrete** — file paths, function names, API routes; not vague descriptions
- **"What was NOT changed" is mandatory** — it's the most underrated section; it saves hours of re-investigation
- **Risk assessment is honest** — if risk is zero, say why; if there are edge cases, document them
- **Title should be scannable** — someone skimming the file should understand the gist from titles alone

## When to Write an Entry

- Architecture or UX decisions that aren't obvious from the code
- Bug fixes where the root cause was surprising
- Changes that touch multiple files or cross component boundaries
- Anything where a future developer might ask "why was it done this way?"

## When NOT to Write an Entry

- Routine refactors, typo fixes, dependency bumps
- Changes fully explained by their commit message
- Work-in-progress that hasn't landed yet