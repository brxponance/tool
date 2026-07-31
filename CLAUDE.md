# Working rules for this repo

These are standing rules. Follow them on every task, without being reminded.

## 1. End every message with a TL;DR

Close each reply with a short `**TL;DR**` — a few sentences reviewing what you
actually did, what you found, and anything that still needs attention. It is a
summary of substance, not a restatement of the headings.

## 2. Never run Playwright headless

Always launch with a visible browser so the work can be watched:

```js
const browser = await chromium.launch({ headless: false, slowMo: 300 });
```

Applies to every browser check — verification passes, screenshots, comparisons.
`chromium.launch()` with no arguments defaults to headless, so pass the flag
explicitly every time.

## 3. Journal what changed

After a change is **applied**, add a journal entry.

| Journal | Scope |
|---|---|
| [journal.md](journal.md) | Project-wide work — default, use this unless the change is manager-finder specific |
| [docs/feature/journal.md](docs/feature/journal.md) | Manager-finder feature work |

Be deliberate about when. Write once a piece of work is genuinely done — not
after every small step, and not batched up weeks later. One entry per meaningful
change or session of related work.

**Format — both journals follow this:**

- An `## Index` at the top listing every entry as a link, **newest first**.
- **Newest entries go first**, immediately below the index — never appended to
  the bottom.
- Entry heading: `## YYYY-MM-DD — Short title`, then prose with `###`
  sub-sections.
- When you add an entry, add its index line too.

Record the **why** and the things that would otherwise be re-learned the hard way:

- what changed and where
- root causes, not just symptoms
- anything that was wrong on the first attempt, and what corrected it
- gotchas a future reader would trip over
- what is still open

---

## Where things are

| | |
|---|---|
| Production runbook, AWS layout, secrets, data recovery | [DEPLOYMENT.md](DEPLOYMENT.md) |
| What the app is, the data, the database, how to start it | [README.md](README.md) |
| History and prior decisions | [journal.md](journal.md) |
| Frontend architecture rules | [frontend/CLAUDE.md](frontend/CLAUDE.md) |
| Skills: `deploy`, `start`, `pull` | `.claude/skills/` |

`backend/` is the real backend. **`clone_tool/` is a vendored reference copy of
the original prototype** — never edit it and never deploy it; it exists only to
diff against when porting features across.
