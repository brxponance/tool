#!/bin/sh
# Production container entrypoint.
#
# Order matters:
#   1. Wait briefly for the database to accept connections (RDS/Docker may lag).
#   2. Run Alembic migrations to head (creates + stamps the schema).
#   3. Seed the client roster from the workbook if the DB is empty (idempotent).
#   4. Launch gunicorn.
#
# Everything is a no-op-safe if the DB is already migrated/seeded, so the
# container is safe to restart. If DATABASE_URL is unset with APP_ENV=production,
# database_url() raises and the container fails fast (by design).
set -e

echo "[entrypoint] waiting for database + ensuring target DB exists..."
python - <<'PY'
import time, sys, os
sys.path.insert(0, "/app")
from db.session import database_url, get_engine
from sqlalchemy import create_engine, text
from sqlalchemy.engine import make_url

# Use SQLAlchemy's URL parser, which correctly handles special characters in the
# password (urllib.urlparse chokes on some, e.g. it misreads them as IPv6).
url_obj = make_url(database_url())
target_db = url_obj.database or "pc_tool"
# Admin URL points at the always-present "postgres" maintenance DB on the same server.
admin_url = url_obj.set(database="postgres")

# 1) Wait for the SERVER to accept connections (via the postgres maintenance DB).
admin_engine = create_engine(admin_url, isolation_level="AUTOCOMMIT")
for attempt in range(30):
    try:
        with admin_engine.connect() as c:
            c.execute(text("SELECT 1"))
        print("[entrypoint] database server is up.")
        break
    except Exception as e:
        print(f"[entrypoint] server not ready ({attempt+1}/30): {e}")
        time.sleep(2)
else:
    print("[entrypoint] database server never became reachable; exiting.")
    sys.exit(1)

# 2) Create the target database if it doesn't exist yet (first-ever boot).
try:
    with admin_engine.connect() as c:
        exists = c.execute(
            text("SELECT 1 FROM pg_database WHERE datname = :n"), {"n": target_db}
        ).scalar()
        if not exists:
            # CREATE DATABASE can't run in a transaction block; AUTOCOMMIT handles that.
            c.execute(text(f'CREATE DATABASE "{target_db}"'))
            print(f"[entrypoint] created database {target_db!r}.")
        else:
            print(f"[entrypoint] database {target_db!r} already exists.")
except Exception as e:
    print(f"[entrypoint] could not ensure database exists: {e}")
    sys.exit(1)

# 3) Confirm the target DB now accepts connections.
for attempt in range(15):
    try:
        with get_engine().connect() as c:
            c.execute(text("SELECT 1"))
        print(f"[entrypoint] connected to {target_db!r}.")
        break
    except Exception as e:
        print(f"[entrypoint] target db not ready ({attempt+1}/15): {e}")
        time.sleep(2)
else:
    print("[entrypoint] target database never became reachable; exiting.")
    sys.exit(1)
PY

echo "[entrypoint] running migrations..."
alembic upgrade head

echo "[entrypoint] seeding client roster if empty..."
# Seed is idempotent: does nothing when clients already exist.
python -m db.seed || echo "[entrypoint] seed skipped/failed (non-fatal)."

echo "[entrypoint] starting gunicorn..."
exec gunicorn --workers 1 --worker-class gthread --threads 4 \
  --bind 0.0.0.0:3001 --timeout 180 --access-logfile - app:app
