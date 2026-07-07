"""Engine / session management for the client-management database.

The database is OPTIONAL. Resolution order for the connection URL:

  1. DATABASE_URL env var  (use this for AWS RDS in production)
  2. local Docker Postgres default (postgresql+psycopg2://pc_tool:pc_tool@localhost:5432/pc_tool)

is_enabled() performs a cheap one-time connectivity probe. If Postgres is
unreachable (not running, wrong creds, etc.) the app treats the DB as
unavailable and callers fall back to the Excel / pickle-cache path, so the
tool still boots. This matches the project rule: an optional subsystem being
down must not stop the rest of the app from operating.
"""
from __future__ import annotations

import os
from contextlib import contextmanager

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from .models import Base

_DEFAULT_URL = "postgresql+psycopg2://pc_tool:pc_tool@localhost:5432/pc_tool"

_engine = None
_SessionLocal: sessionmaker | None = None
# Positive result is cached permanently (a DB that answered once stays "on";
# transient query errors are handled per-request via pool_pre_ping and the
# route-level error handling). A NEGATIVE probe is only cached for a short
# window so a DB that was briefly unreachable at boot (RDS warm-up, transient
# blip) is re-checked and can come back without a process restart.
_enabled_positive = False
_last_negative_probe = 0.0
_NEGATIVE_TTL_SECONDS = 10.0


def database_url() -> str:
    configured = os.environ.get("DATABASE_URL", "").strip()
    # In production, refuse to silently fall back to the local dev default —
    # an unset DATABASE_URL almost always means a misconfigured deploy, and
    # falling back to localhost would quietly serve stale cache instead of
    # failing loudly. Set APP_ENV=production (or =prod) to enforce this.
    if not configured:
        app_env = os.environ.get("APP_ENV", "").strip().lower()
        if app_env in ("production", "prod"):
            raise RuntimeError(
                "DATABASE_URL is not set but APP_ENV=production. Refusing to fall "
                "back to the local dev database. Set DATABASE_URL to your RDS/"
                "Postgres connection string."
            )
    url = configured or _DEFAULT_URL
    # SQLAlchemy 2.x needs the psycopg2 driver spelled out; accept the common
    # "postgresql://" form (e.g. what RDS / Heroku hand out) and normalize it.
    if url.startswith("postgresql://"):
        url = url.replace("postgresql://", "postgresql+psycopg2://", 1)
    return url


def get_engine():
    global _engine
    if _engine is None:
        _engine = create_engine(
            database_url(),
            pool_pre_ping=True,   # transparently recover from dropped connections
            future=True,
        )
    return _engine


def _session_factory() -> sessionmaker:
    global _SessionLocal
    if _SessionLocal is None:
        _SessionLocal = sessionmaker(
            bind=get_engine(), autoflush=False, expire_on_commit=False, class_=Session
        )
    return _SessionLocal


def is_enabled() -> bool:
    """Return True iff a Postgres connection can be established.

    Result is cached after the first probe. Set DB_DISABLED=1 to force-disable
    (useful for running the app deliberately without a database).
    """
    global _enabled_positive, _last_negative_probe
    if os.environ.get("DB_DISABLED", "").strip() in ("1", "true", "True"):
        return False
    # Once the DB has answered, treat it as available; per-request query errors
    # (with pool_pre_ping) surface as normal errors, they don't disable the feature.
    if _enabled_positive:
        return True
    # Negative result: throttle re-probing so we don't hammer a down DB, but do
    # re-check after the TTL so a recovered DB is picked up without a restart.
    import time
    now = time.monotonic()
    if _last_negative_probe and (now - _last_negative_probe) < _NEGATIVE_TTL_SECONDS:
        return False
    try:
        from sqlalchemy import text

        with get_engine().connect() as conn:
            conn.execute(text("SELECT 1"))
        _enabled_positive = True
        return True
    except Exception as e:  # noqa: BLE001 — any failure means "no DB (for now)"
        print(f"[db] not reachable (will retry): {e}")
        _last_negative_probe = now
        return False


def init_db() -> None:
    """Create tables if they don't exist.

    Alembic migrations are the source of truth for schema in production; this
    is a convenience for local/dev and for tests so the app can create the
    schema on first boot without a manual migration step.
    """
    Base.metadata.create_all(get_engine())


@contextmanager
def session_scope():
    """Transactional scope: commit on success, roll back on error, always close."""
    session = _session_factory()()
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()
