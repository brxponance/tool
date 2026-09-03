---
name: start
description: Start the PC Tool locally — the Flask backend on :3001 and the Next.js frontend on :3000, plus the optional local Postgres. Use when the user asks to start, run, launch, boot or serve the app locally, or says the app isn't running / localhost won't load.
---

# Start the PC Tool locally

Brings up the two servers the app needs. Backend must be up first — the frontend
proxies every API call to it.

```
backend   Flask + gunicorn-less dev server   http://127.0.0.1:3001
frontend  Next.js dev server                 http://localhost:3000   ← open this one
database  Postgres (optional)                localhost:5432
```

Open **http://localhost:3000** — `localhost`, NOT `127.0.0.1`. Next 16 blocks
dev resources for pages opened via `127.0.0.1` (cross-origin), so the app
renders its empty server-HTML shell and never fetches data — looks like "no
data" even though every curl check passes. `allowedDevOrigins` could allow it,
but the decision (journal, 2026-08-04) is to keep the config untouched and use
`localhost`. curl health checks against `127.0.0.1` are fine — only the
browser URL matters. Port 3001 serves the API, not the UI.

## Step 0 — Database (optional, but do it if they want to edit clients)

```bash
cd backend && docker compose up -d
```

Without it the app still runs: it falls back to a read-only client roster from the
weights workbook and hides add/rename/delete. If Docker isn't available, say so
and carry on — don't block on it.

## Step 1 — Backend (must be first)

```bash
cd backend
./venv/Scripts/python.exe run.py      # Windows
# venv/bin/python run.py              # macOS / Linux
```

Run it in the **background** so you can keep working, and wait for readiness
rather than sleeping:

```bash
until curl -s -m 3 -o /dev/null http://127.0.0.1:3001/status; do sleep 2; done
echo "backend up"
```

Expect ~7 seconds — it unpickles a ~65 MB analytics cache at import. `run.py`
also auto-opens a browser tab at :3001; that tab shows the API, so point the user
at :3000 instead.

First run only, if there's no venv yet:

```bash
cd backend
python -m venv venv
./venv/Scripts/python.exe -m pip install -r requirements.txt
```

## Step 2 — Frontend

```bash
cd frontend
npm run dev
```

Background it too, then wait:

```bash
until curl -s -m 3 -o /dev/null http://127.0.0.1:3000/portfolio; do sleep 2; done
echo "frontend up"
```

`npm install` first if `node_modules/` is missing.

## Step 3 — Confirm it actually works

Don't just report "started" — prove the chain works end to end:

```bash
curl -s -o /dev/null -w 'backend  %{http_code}\n' http://127.0.0.1:3001/status
curl -s -o /dev/null -w 'proxy    %{http_code}\n' http://127.0.0.1:3000/api/backend/clients
```

The **proxy** check is the one that matters — it proves the frontend can reach the
backend. If backend is 200 but proxy isn't, the frontend is pointed at the wrong
port (see below).

Then tell the user: **http://127.0.0.1:3000**

## Troubleshooting

**`EADDRINUSE` / port already in use.** Something is still listening from a
previous run — killing a wrapper process does not always kill the child that holds
the port.

```bash
netstat -ano | grep -E ':(3000|3001)\s.*LISTENING'   # find the PID
```

Either stop that PID or use a different port (`npm run dev -- -p 3100`). If you
move the frontend port, nothing else needs changing. If you move the **backend**
port, the proxy must be told: set `BACKEND_INTERNAL_URL=http://127.0.0.1:<port>`.

**Proxy returns 503 / "Backend unavailable".** The frontend proxy tries
`127.0.0.1:3001` then `127.0.0.1:5050`. Backend isn't up, or is on another port.

**Blank screens / "no data".** Normal on a fresh machine: no workbooks are
uploaded yet. Send the user to the **Setup** tab. The first universe clone takes
5–15 minutes; after that it's cached in `backend/cache/results.pkl`.

**`[db] not reachable`** in the backend log is only a warning — expected when
Postgres isn't running. The app degrades gracefully.

**Local migrations.** `alembic upgrade head` runs automatically in the *container*
entrypoint, not in `run.py`. If a `git pull` brought new migrations, run it by
hand:

```bash
cd backend && ./venv/Scripts/python.exe -m alembic upgrade head
```

## Rules

- Start the backend before the frontend, and wait for each — don't fire both and
  assume.
- Use background execution with an `until` readiness loop. Don't sleep blindly.
- Report the actual HTTP codes you got. If the proxy check failed, say so rather
  than claiming the app is up.
- Point the user at **:3000**, never :3001.
