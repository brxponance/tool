# Deployment Runbook

This tool runs as two services side-by-side:

- **Backend** — Python 3.11+ / Flask, serves JSON on **port 3001**
- **Frontend** — Next.js 16 (React 19), serves the UI on **port 3000**

The frontend proxies all `/api/backend/*` requests to the Flask backend, so in
production both should sit behind the **same domain** (no CORS required).

---

## Local development (already working)

```powershell
# In one terminal — backend
cd backend
venv\Scripts\python.exe run.py
python run.py        # → http://127.0.0.1:3001

# In another terminal — frontend
cd frontend
npm install          # first time only
npm run dev          # → http://localhost:3000
```

Open <http://localhost:3000>. Backend auto-opens <http://127.0.0.1:3001> on
start, but you don't need to use that URL — it's just a JSON API now.

---

## Production builds

```powershell
# Backend — no build step. Install deps then run.
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt

# Frontend — produces an optimized .next/ bundle
cd frontend
npm ci               # clean install from lockfile
npm run build        # → .next/
npm run start        # serves the production build on port 3000
```

Verified production build status (this commit):

- Backend: every .py file compiles clean (`py_compile` over `backend/*.py`)
- Frontend: `npx tsc --noEmit` clean, `next build` succeeds, all 10 routes
  prerendered or dynamic as expected

---

## AWS deployment — recommended shape

For an internal team tool (your scale: ~3 clients, ~140 managers), the
simplest deployable shape is **one EC2 instance** behind an **ALB**:

```
Browser ─→ Cloudfront/Route53
              ↓
         ALB :443 (Cognito auth)
              ↓
      EC2 t3.medium / t3.large
        ├ nginx :80 → reverse-proxy to Next.js :3000
        └ Next.js :3000 → proxies /api/backend/* to Flask :3001
              ↓
         Flask :3001 (gunicorn, NOT Flask dev server)
              ↓
         EBS volume mounted at /opt/aapryl/
           ├ uploads/   (user-uploaded XLSX files)
           └ cache/     (results.pkl — clone cache)
```

### Why this shape

| Concern | Why one box works |
|---|---|
| State | Flask keeps the in-memory `state` dict + `cache/results.pkl` on disk. Sharing across instances would require Redis + S3 — not worth the complexity for a single-team tool. |
| Uploads | Same — local disk is fine on one box; EBS volume keeps it across restarts. |
| Scale | The heaviest endpoint (`/run` cloning) takes ~30s once per upload. Concurrent users hit cached results. One t3.medium handles this easily. |
| Cost | ~$30-50/mo for EC2 + ALB. Far less than ECS/Fargate. |

### Switching to a real WSGI server (do this for prod)

Flask's built-in `app.run()` is a dev server. Use **gunicorn** or **waitress**
in production:

```bash
pip install gunicorn
gunicorn --workers 1 --bind 0.0.0.0:3001 --timeout 120 app:app
```

`--workers 1` is intentional: the app holds shared state in a Python dict.
Multiple worker processes would each have their own copy and wouldn't
share clone results.

---

## Environment variables

### Backend
No required env vars. Optionally:

| Var | Default | Purpose |
|---|---|---|
| `PORT` | not used (hardcoded 3001 in `run.py`) | Change requires editing `run.py` |

### Frontend
| Var | Default | Purpose |
|---|---|---|
| `NEXT_PUBLIC_BACKEND_BASE_URL` | `http://127.0.0.1:3001` | Where the Next.js API proxy forwards `/api/backend/*` requests |

In AWS, set `NEXT_PUBLIC_BACKEND_BASE_URL=http://127.0.0.1:3001` if the
frontend and backend run on the same EC2 (the proxy talks local-loopback).
If they're on different hosts, set the internal hostname (e.g.
`http://backend.internal:3001`) — never the public ALB URL, that would
loop through the LB and add latency.

---

## What to deploy / not deploy

### Required
- `backend/*.py` (12 files: app.py + 11 engines)
- `backend/requirements.txt`
- `backend/run.py` (or replace with gunicorn invocation per above)
- `frontend/src/`
- `frontend/public/`
- `frontend/package.json`, `package-lock.json`
- `frontend/next.config.ts`, `tsconfig.json`, `postcss.config.mjs`
- `frontend/eslint.config.mjs`

### Created at runtime — provision but don't ship code
- `backend/uploads/` (mount EBS here)
- `backend/cache/` (mount EBS here)

### Don't deploy
- `backend/venv/` — recreate on the host
- `backend/__pycache__/`
- `frontend/node_modules/` — `npm ci` recreates
- `frontend/.next/` — `npm run build` regenerates
- `.tools/` — local debug scripts
- `.playwright-mcp/` — local MCP install
- `clone_tool/` — old monolithic version, kept for reference only
- `docs/`, `factSet_documentation/`, `factset_programmatic_env/`,
  `skeletons/` — reference / scratch material

The `.gitignore` already excludes the don't-deploy items from version control,
so a fresh `git clone` on the target host is clean.

---

## First-time host setup (Ubuntu 22.04 example)

```bash
sudo apt update
sudo apt install -y python3.11 python3.11-venv python3-pip nginx
curl -fsSL https://nodejs.org/dist/v22.11.0/node-v22.11.0-linux-x64.tar.xz | sudo tar xJ -C /usr/local --strip-components=1

# Clone
git clone <your-repo-url> /opt/aapryl
cd /opt/aapryl

# Backend
cd backend
python3.11 -m venv venv
venv/bin/pip install -r requirements.txt
venv/bin/pip install gunicorn

# Frontend
cd ../frontend
npm ci
npm run build
```

Then run each behind systemd or supervisord. Example systemd unit for
backend:

```ini
# /etc/systemd/system/aapryl-backend.service
[Unit]
Description=Aapryl Backend
After=network.target

[Service]
WorkingDirectory=/opt/aapryl/backend
ExecStart=/opt/aapryl/backend/venv/bin/gunicorn --workers 1 --bind 0.0.0.0:3001 --timeout 120 app:app
Restart=on-failure
User=aapryl

[Install]
WantedBy=multi-user.target
```

And frontend:

```ini
# /etc/systemd/system/aapryl-frontend.service
[Unit]
Description=Aapryl Frontend
After=network.target

[Service]
WorkingDirectory=/opt/aapryl/frontend
Environment=NEXT_PUBLIC_BACKEND_BASE_URL=http://127.0.0.1:3001
Environment=NODE_ENV=production
ExecStart=/usr/local/bin/node ./node_modules/.bin/next start -p 3000
Restart=on-failure
User=aapryl

[Install]
WantedBy=multi-user.target
```

`systemctl enable --now aapryl-backend aapryl-frontend` and both come back
across reboots.

---

## Authentication

**The app has no built-in auth.** Anyone with network access to port 3000
can upload files and run clones. For internal use, put auth at the
network layer:

- **AWS ALB + Cognito** — easiest, integrates with corporate IdP
- **Cloudflare Access** — if you're not in AWS
- **VPN / private subnet only** — simplest, no UI changes needed

Do not expose ports 3000 / 3001 to the public internet without one of
these in front.

---

## Smoke tests after deploy

```bash
# Backend health
curl https://your-host/api/backend/status
# Expect: {"has_results": ..., "has_weights": ..., ...}

# Frontend
curl -I https://your-host/setup
# Expect: HTTP/2 200

# Run the full debug scripts against the deployed URL
cd .tools
REPORT_URL=https://your-host/report  node debug-report.mjs
OPTIMIZE_URL=https://your-host/optimize  BACKEND_URL=https://your-host/api/backend  node debug-optimize.mjs
```

Both debug scripts should report 0 errors and 200s across the board.

---

## Known limitations (acceptable for internal tool, document for users)

- **Single instance only** — scaling horizontally requires moving `state` +
  `cache/results.pkl` to Redis + S3. Not needed for current scale.
- **No background-job queue** — `/run` cloning runs in a Flask thread.
  Acceptable for ~140-manager runs (~30s); if you start cloning 5000+
  managers, consider Celery + Redis.
- **No "Actual" client track-record performance** — the Report tab's
  page-3 section only shows backtested data (computed from current weights
  × historical manager returns). Adding actual track-record requires a new
  file-upload type.
- **Pickle cache is Python-version-specific** — don't change Python minor
  versions on the host without deleting `cache/results.pkl` first.
