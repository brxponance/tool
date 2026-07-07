"""Database package for client management.

Public surface — import from here, not from submodules:

    from db import is_enabled, load_weights_from_db, session_scope
    from db import repository

The DB is OPTIONAL. When DATABASE_URL is unset and no local Postgres is
reachable, is_enabled() returns False and callers fall back to the Excel /
pickle-cache path so the app still boots (bounded blast radius).
"""
from .session import is_enabled, session_scope, get_engine, init_db
from . import repository
from .repository import load_weights_from_db

__all__ = [
    "is_enabled",
    "session_scope",
    "get_engine",
    "init_db",
    "repository",
    "load_weights_from_db",
]
