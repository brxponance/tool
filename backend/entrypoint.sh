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

echo "[entrypoint] waiting for database..."
python - <<'PY'
import time, sys
sys.path.insert(0, "/app")
from db.session import get_engine
from sqlalchemy import text
for attempt in range(30):
    try:
        with get_engine().connect() as c:
            c.execute(text("SELECT 1"))
        print("[entrypoint] database is up.")
        break
    except Exception as e:
        print(f"[entrypoint] db not ready ({attempt+1}/30): {e}")
        time.sleep(2)
else:
    print("[entrypoint] database never became reachable; exiting.")
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
