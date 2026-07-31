# PC Tool (Aapryl Clone Tool)

Portfolio analytics for the Xponance manager buy list: factor cloning, normalized
skill, risk and exposures, holdings overlap, market-cycle positioning, portfolio
optimization, and Word/PDF/Excel report exports.

**Live app:** http://pc-tool-alb-149658130.us-east-1.elb.amazonaws.com

| I want to… | Go to |
|---|---|
| Deploy to production | [Deploying](#deploying) — or run the `/deploy` skill |
| Run it on my machine | [Running locally](#running-locally) |
| Understand the data | [The data](#the-data) |
| Understand the database | [The database](#the-database) |
| Fix a broken deploy / missing data | [DEPLOYMENT.md](DEPLOYMENT.md) |

---

## Where everything lives

```
backend/          Flask API — THE REAL BACKEND. All analytics live here.
frontend/         Next.js UI (feature-first: frontend/src/features/<feature>/)
clone_tool/       REFERENCE COPY ONLY — do not edit, do not deploy.
                  A vendored snapshot of the original single-file prototype,
                  kept to diff against when porting features across.
DEPLOYMENT.md     Production runbook: AWS layout, secrets, data recovery.
.claude/skills/   Agent skills (e.g. deploy).
deploy.sh         Legacy CloudShell fallback. Prefer GitHub Actions.
```

> **`clone_tool/` is not the app.** It's the prototype the current tool was ported
> from. Editing it changes nothing in production. Earlier versions of this README
> said the backend lived there — it does not.

### Backend modules

| File | Responsibility |
|---|---|
| `app.py` | Flask routes, in-memory `state`, cache load/save |
| `data_loader.py` | Reads every input workbook; runs cloning; FactSet name resolution |
| `clone_engine.py` | The factor-clone regression itself |
| `skill_engine.py` | Normalized Skill Z-scores vs a peer universe |
| `risk_engine.py` | Scenario analysis, marginal contribution, regimes, manager-struggle |
| `security_risk_engine.py` | Stock-level (bottom-up) style exposures |
| `exposures_engine.py` | FactSet exposures parsing + portfolio aggregation |
| `overlap_engine.py` | Pairwise holdings overlap |
| `portfolio_optimizer.py` | MILP portfolio construction + redemption LP |
| `market_cycle.py` | Market-cycle bucket placement |
| `qualitative_loader.py` | Firm AUM / ownership / diverse-ownership workbook |
| `docx_export.py` `pdf_export.py` `pptx_export.py` | Report exports |
| `db/` | SQLAlchemy models, session, seed (Postgres) |
| `s3_storage.py` | Upload/resolve files via S3 in production |

---

## The data

The tool is driven entirely by **Excel workbooks uploaded on the Setup tab**.
Nothing is hardcoded and nothing ships in the repo.

| Upload slot | What it is | Feeds |
|---|---|---|
| `manager_returns` | Buy-list manager monthly returns. May carry a `Map` sheet (FactSet-name crosswalk) and a `Client` sheet (actual client track records) | Cloning, skill, performance |
| `factor_returns` | Factor/index monthly returns | Cloning, benchmarks, backtests |
| `weights` | Per-client manager weights. Column C of each client header row may hold client total AUM | Portfolios, AUM columns, redemption |
| `universe_returns` | eVestment peer universe (consolidated or per-tab) | Normalized skill peers, manager-struggle |
| `risk_summary` | FactSet Risk Summary (manager + benchmark absolute exposures) | FactSet risk panel |
| `security_risk` | FactSet Security-Level Risk DNA (stock level) | Bottom-up risk, sleeve breakdown |
| `exposures` | FactSet Group Exposures (holdings + characteristics) | Exposures, holdings overlap, memo |
| `qualitative` | Firm AUM, ownership, diverse/female ownership % | Diverse rollup, manager-row detail, memo |

### Where the files physically are

- **Local:** `backend/uploads/`
- **Production:** S3 `s3://pc-tool-uploads/uploads/<original-filename>`

S3 is the source of truth in AWS. Container disks are ephemeral; files are pulled
down by basename on demand.

### The analytical cache — important

Cloning 1,634 universe managers takes minutes of CPU, so results are cached:

- **Local:** `backend/cache/results.pkl`
- **Production:** `s3://pc-tool-uploads/state/results.pkl`

**The pickle stores computed results plus *pointers* to the input files — not the
files themselves.** So both must be consistent. If factor-dependent views break
with "Factor returns file missing", read DEPLOYMENT.md §15.

The cache also records `INPUT_PARSER_VERSION`. When a deploy changes how a file is
parsed, the app re-reads its inputs once on boot, automatically — there is no
"Reload Inputs" step to remember (DEPLOYMENT.md §16).

---

## The database

Postgres. It holds **only** the editable client roster and saved scenarios —
every analytical number is computed from the workbooks above and the cache, never
from the DB.

| Table | Contents |
|---|---|
| `clients` | Client name + benchmark |
| `client_managers` | Which managers a client holds, with current/proposed weights |
| `portfolio_presets` | Named saved what-if scenarios |

- **Production:** RDS `xponance-db` (Postgres 16), private subnet, not publicly
  reachable. Connection string in Secrets Manager as `pc-tool/database-url`.
  Password rotation is deliberately **off** — see DEPLOYMENT.md §5 before changing it.
- **Local:** `cd backend && docker compose up -d` → Postgres on `localhost:5432`
  (`pc_tool` / `pc_tool` / db `pc_tool`).

Migrations are Alembic and run automatically at container start
(`alembic upgrade head` in `backend/entrypoint.sh`), followed by an idempotent
roster seed. **If the DB is unreachable the backend exits rather than starting
half-configured** — which is why a bad password shows up as a failed deploy.

The app degrades gracefully without Postgres: it falls back to the read-only
roster from the weights workbook, and client add/rename/delete is hidden.

---

## Running locally

You need Python 3.11+, Node 20+, and (optionally) Docker for Postgres.

```bash
# 1. Database (optional — skip for read-only mode)
cd backend && docker compose up -d

# 2. Backend  →  http://127.0.0.1:3001
cd backend
python -m venv venv
./venv/Scripts/python.exe -m pip install -r requirements.txt   # macOS/Linux: venv/bin/python
./venv/Scripts/python.exe run.py

# 3. Frontend →  http://127.0.0.1:3000   (second terminal)
cd frontend
npm install
npm run dev
```

Open http://127.0.0.1:3000 and upload workbooks on the **Setup** tab. On a clean
machine the first universe clone takes 5–15 minutes; after that it's cached.

### Environment variables

| Variable | Where | Purpose |
|---|---|---|
| `DATABASE_URL` | backend | Postgres DSN. Unset locally → local Docker default |
| `APP_ENV=production` | backend | Refuses to fall back to the local DB |
| `S3_BUCKET` | backend | Enables S3 storage. Unset → local disk |
| `FRONTEND_URL` | backend | Enables CORS for that origin |
| `BACKEND_INTERNAL_URL` | frontend | Where the proxy forwards; defaults to `127.0.0.1:3001` |

The frontend never calls the backend directly from the browser — everything goes
through `frontend/src/app/api/backend/[...path]/route.ts`.

### Useful commands

```bash
# frontend
npm run dev / npm run build / npm run lint
npx tsc --noEmit           # typecheck

# backend
./venv/Scripts/python.exe run.py
```

---

## Deploying

**Nothing manual, and no AWS knowledge needed.** Either:

- **Ask the agent:** run the **`/deploy`** skill. It pushes, waits, verifies the
  running image and that the app answers through the load balancer, and diagnoses
  a failure if there is one.
- **Click a button:** GitHub → **Actions** → "Build and Deploy to ECS" →
  **Run workflow**.
- **Push code:** `git push origin main` deploys automatically.

Takes ~6–8 minutes. There are **no post-deploy steps**.

If a run goes red, open it and expand **"Explain the failure"** — the workflow
prints the cause (ECS events, container exit codes, recent logs) into the job log,
so you don't need AWS access to read it. Full runbook: [DEPLOYMENT.md](DEPLOYMENT.md).

> A deploy ships **code, not data**. It never deletes uploads, never changes saved
> portfolios, and never re-runs the universe clone.

---

## Architecture

```
Browser
  └─ ALB (HTTP :80)
       └─ ECS Fargate task (1 × 0.5 vCPU / 1 GiB)
            ├─ frontend container  :3000   Next.js, proxies /api/backend/*
            └─ backend container   :3001   Flask + gunicorn (1 worker, 4 threads)
                 ├─ RDS Postgres        clients, weights, presets
                 └─ S3                  uploads/ + state/results.pkl
```

The task is deliberately small, which matters: heavy CPU work at startup starves
the health check and gets the task killed. See DEPLOYMENT.md §14 before adding
anything to module scope in `backend/app.py`.
