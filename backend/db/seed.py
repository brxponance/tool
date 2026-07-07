"""Seed the client-management database from the weights workbook.

Reuses data_loader.load_weights() so the seeded clients are byte-for-byte the
same clients/managers/weights/benchmarks the app parsed from Excel — nothing
is lost in the switch to Postgres.

Usage:
    py -m db.seed                          # seed from the default workbook
    py -m db.seed path/to/Weights.xlsx     # seed from a specific workbook
    py -m db.seed --force                  # re-import even if clients exist

Idempotent by default: if any clients already exist it does nothing (pass
--force to upsert from the workbook anyway).
"""
from __future__ import annotations

import os
import sys

# Allow running as `py -m db.seed` from backend/ and as a script.
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from data_loader import load_weights  # noqa: E402
from db import repository  # noqa: E402
from db.session import init_db, is_enabled  # noqa: E402

_BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
_DEFAULT_WORKBOOK = os.path.join(_BACKEND_DIR, "uploads", "Manager_Weights_3_31.xlsx")


def _ensure_schema() -> None:
    """Bring the DB schema to the latest Alembic revision.

    Using Alembic (not Base.metadata.create_all) as the single schema owner
    avoids the drift where create_all builds tables without stamping
    alembic_version, which would later make `alembic upgrade head` fail on
    already-existing tables. Falls back to create_all only if Alembic can't be
    loaded (e.g. a minimal test env)."""
    try:
        from alembic import command
        from alembic.config import Config

        cfg = Config(os.path.join(_BACKEND_DIR, "alembic.ini"))
        cfg.set_main_option("script_location", os.path.join(_BACKEND_DIR, "migrations"))
        command.upgrade(cfg, "head")
        print("[db] schema migrated to head.")
    except Exception as e:  # noqa: BLE001
        print(f"[db] Alembic upgrade unavailable ({e}); falling back to create_all.")
        init_db()


def seed(workbook: str, force: bool = False) -> None:
    if not is_enabled():
        raise SystemExit(
            "Database is not reachable. Start it with `docker compose up -d` "
            "or set DATABASE_URL, then retry."
        )

    _ensure_schema()  # bring the schema to head via Alembic (creates + stamps)

    existing = repository.count_clients()
    if existing and not force:
        print(
            f"{existing} client(s) already in the database — nothing to do. "
            f"Pass --force to re-import from the workbook."
        )
        return

    if not os.path.exists(workbook):
        raise SystemExit(f"Workbook not found: {workbook}")

    print(f"Reading weights from {workbook} ...")
    weights, benchmarks = load_weights(workbook)
    if not weights:
        raise SystemExit("No clients found in the workbook — nothing to seed.")

    result = repository.upsert_from_weight_maps(weights, benchmarks)
    total_mgrs = sum(len(m) for m in weights.values())
    print(
        f"Seeded {len(weights)} client(s), {total_mgrs} manager rows "
        f"(created={result['created']}, updated={result['updated']})."
    )
    for cname in weights:
        print(f"  - {cname}  ({len(weights[cname])} managers, "
              f"benchmark: {benchmarks.get(cname)!r})")


def main(argv: list[str]) -> None:
    args = [a for a in argv if a not in ("--force",)]
    force = "--force" in argv
    workbook = args[0] if args else _DEFAULT_WORKBOOK
    seed(workbook, force=force)


if __name__ == "__main__":
    main(sys.argv[1:])
