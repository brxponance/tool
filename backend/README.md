# Aapryl Clone Tool

Portfolio cloning analysis tool with Flask web interface.

## Quick Start

### 1. Setup Virtual Environment

```bash
python -m venv venv
```

### 2. Install Dependencies

```bash
.\venv\Scripts\python.exe -m pip install -r requirements.txt
```

### 3. Start the Database (Docker)

The client roster (client names, benchmarks, managers, weights) lives in
Postgres. Start it with Docker Compose **before running the backend**:

```bash
docker compose up -d
```

That's the only command you need each time — the container auto-restarts on
reboot, so in practice you run it once and forget it. If the database is not
running, the backend still boots and falls back to the Excel/cache data.

See the [Database](#database) section below for first-time setup (seeding) and
the full list of commands.

### 4. Run the App

For the legacy Flask UI on port `5050`:

```bash
.\venv\Scripts\python.exe app.py
```

For the Next.js frontend, start the backend on port `3001` instead:

```bash
.\venv\Scripts\python.exe run.py
```

Or explicitly on a custom port (e.g., `3001`):

```bash
.\venv\Scripts\python.exe -c "from app import app; app.run(host='127.0.0.1', port=3001)"
```

### 5. Open in Browser

- Legacy Flask UI: `http://localhost:5050`
- Next.js frontend backend target: `http://localhost:3001`

## Important Note

Do not run:

```bash
python run app.py
```

That tells Python to look for a file literally named `run`, which does not exist.

Use either:

```bash
python app.py
```

or:

```bash
python run.py
```

## Stop the Server

Press `CTRL+C` in the terminal.

## Database

Client management (add / rename / delete clients and their managers) is backed
by **PostgreSQL**, run locally via Docker. The database only holds the editable
client roster; all analytical reference data (returns, universes, risk,
exposures) still comes from the uploaded Excel files.

### Everyday use

You only need one command to bring the database up each time you work:

```bash
docker compose up -d      # start Postgres in the background (localhost:5432)
```

Then start the backend as usual. To stop it:

```bash
docker compose stop       # stop the container (data is preserved)
```

Other handy commands:

```bash
docker compose ps         # is the database running?
docker compose logs -f    # tail the database logs
docker compose down       # stop AND remove the container (data preserved in volume)
docker compose down -v    # stop and WIPE all data (start fresh)
```

The container uses `restart: unless-stopped`, so once started it comes back
automatically after a reboot — normally you run `docker compose up -d` once and
don't think about it again.

### First-time setup (once)

After starting the database for the very first time, create the schema and load
the existing clients from the weights workbook:

```bash
docker compose up -d                 # 1. start Postgres
py -m alembic upgrade head           # 2. create the tables
py -m db.seed                        # 3. import Client 1–12 from the workbook
```

`db.seed` is idempotent — if clients already exist it does nothing. To force a
re-import from the workbook (replacing the current roster), run
`py -m db.seed --force`. To seed from a specific file:
`py -m db.seed path/to/Weights.xlsx`.

### Connection / configuration

The backend connects using the `DATABASE_URL` environment variable. When unset,
it defaults to the local Docker instance:

```
postgresql://pc_tool:pc_tool@localhost:5432/pc_tool
```

To run the backend **without** a database (Excel/cache only), set
`DB_DISABLED=1`.

### Deploying to AWS (RDS)

The same schema and data move to a hosted Postgres with no code changes:

```bash
# point at your RDS instance
export DATABASE_URL="postgresql://user:pass@your-rds-endpoint:5432/pc_tool"
py -m alembic upgrade head      # create the schema on RDS
py -m db.seed                   # load initial data
```

Alternatively, dump the local database and restore it to RDS:

```bash
pg_dump "postgresql://pc_tool:pc_tool@localhost:5432/pc_tool" > pc_tool.sql
psql "$DATABASE_URL" < pc_tool.sql
```
