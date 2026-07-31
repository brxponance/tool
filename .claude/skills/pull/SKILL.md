---
name: pull
description: Pull the latest code from GitHub and bring the local checkout back into a working state — reinstalling dependencies and applying database migrations if the pull brought any. Use when the user asks to pull, sync, update, get latest, or says their local copy is behind / out of date.
---

# Pull the latest from GitHub

`git pull` on its own is often not enough: if the pull brings new Python or npm
dependencies, or new database migrations, the app breaks in confusing ways until
those are applied. This does the whole job.

Repo: `brxponance/tool`, branch `main`.

## Step 1 — Protect local work first

Never pull over uncommitted changes without telling the user.

```bash
git status --short
git log --oneline origin/main..HEAD    # local commits not yet pushed
```

- **Dirty tree** → show them exactly what's modified and ask: commit, stash, or
  discard. Don't choose for them.
- **Unpushed commits** → mention them; a pull will merge or rebase around them.
- **Clean** → carry on.

## Step 2 — Record what you're moving from

So you can tell what actually changed:

```bash
BEFORE=$(git rev-parse HEAD)
git pull origin main
git log --oneline "$BEFORE"..HEAD          # what arrived
git diff --stat "$BEFORE"..HEAD            # which files
```

If `git log` is empty, you were already up to date — say so and stop. Don't
reinstall anything.

## Step 3 — Apply what the pull implies

Check what changed and act only on what did:

```bash
git diff --name-only "$BEFORE"..HEAD
```

| If this changed | Do this |
|---|---|
| `backend/requirements.txt` | `cd backend && ./venv/Scripts/python.exe -m pip install -r requirements.txt` |
| `frontend/package.json` / `package-lock.json` | `cd frontend && npm install` |
| `backend/migrations/**` | `cd backend && ./venv/Scripts/python.exe -m alembic upgrade head` |
| `backend/app.py` `backend/*_engine.py` `backend/data_loader.py` | restart the backend (see below) |
| `frontend/src/**` | dev server hot-reloads; nothing to do |

Migrations matter: `alembic upgrade head` runs automatically in the **container**
entrypoint but **not** in `run.py`, so locally it's manual.

## Step 4 — Restart what's running

A pull does not restart running servers. If the backend is up, it's still running
the old code:

```bash
curl -s -m 3 -o /dev/null -w 'backend %{http_code}\n' http://127.0.0.1:3001/status
```

If it answers, the backend needs a restart to pick up backend changes — use the
`start` skill. The Next.js dev server hot-reloads frontend changes on its own.

## Step 5 — Sanity check

If the pull touched either side, confirm it still builds rather than finding out later:

```bash
cd frontend && npx tsc --noEmit          # typecheck
cd backend && ./venv/Scripts/python.exe -c "import app; print('backend imports OK')"
```

## Then tell the user

- Which commits arrived (subject lines, not just hashes)
- What you reinstalled / migrated, or that nothing was needed
- Whether a restart is required, and whether you did it
- Anything that looks like it needs their attention — e.g. a new required env var,
  or a change to how input files are parsed

## Notes

- Pulling only changes **code**. It never touches uploaded workbooks
  (`backend/uploads/`), the analytics cache (`backend/cache/results.pkl`), or the
  database. Reassure the user of that if they're worried about losing data.
- If a pull brings a bumped `INPUT_PARSER_VERSION`, the backend re-reads its input
  workbooks once automatically on next start (DEPLOYMENT.md §16). No manual
  "Reload Inputs" needed — but the first start after that will take longer.
- Merge conflicts: show them the conflicting files and stop. Don't guess at a
  resolution in someone else's work.
