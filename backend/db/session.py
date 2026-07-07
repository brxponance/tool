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
_enabled: bool | None = None  # tri-state cache: None = not probed yet


def database_url() -> str:
    url = os.environ.get("DATABASE_URL", "").strip() or _DEFAULT_URL
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
    global _enabled
    if os.environ.get("DB_DISABLED", "").strip() in ("1", "true", "True"):
        return False
    if _enabled is None:
        try:
            from sqlalchemy import text

            with get_engine().connect() as conn:
                conn.execute(text("SELECT 1"))
            _enabled = True
        except Exception as e:  # noqa: BLE001 — any failure means "no DB"
            print(f"[db] disabled (cannot connect): {e}")
            _enabled = False
    return _enabled


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
