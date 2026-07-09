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


def _resolve_workbook_from_s3(workbook_path: str) -> str | None:
    """Download the weights workbook from S3 by basename if it isn't on disk.
    Returns a local path to the downloaded file, or None if unavailable.

    Tries the exact expected filename first, then falls back to discovering ANY
    weights-style workbook under the S3 uploads/ prefix — so a fresh deploy
    whose weights file is named differently (e.g. a Q2 refresh
    'Manager_Weights_6_30.xlsx') still seeds without hardcoding the name."""
    try:
        from s3_storage import is_enabled, download_file, S3_BUCKET, S3_PREFIX
        import boto3
    except Exception:  # noqa: BLE001
        return None
    if not is_enabled():
        return None
    basename = os.path.basename(str(workbook_path).replace("\\", "/"))
    try:
        local = download_file(basename, suffix=".xlsx")   # uploads/<basename>
        if local and os.path.exists(local):
            print(f"[seed] pulled workbook {basename!r} from S3.")
            return local
    except Exception as e:  # noqa: BLE001
        print(f"[seed] exact workbook {basename!r} not in S3 ({e}); searching...")
    # Fallback: list uploads/ and pick the first weights-style workbook.
    try:
        s3 = boto3.client("s3")
        resp = s3.list_objects_v2(Bucket=S3_BUCKET, Prefix=S3_PREFIX)
        candidates = [
            obj["Key"] for obj in resp.get("Contents", [])
            if obj["Key"].lower().endswith(".xlsx")
            and "weight" in obj["Key"].lower()
        ]
        if candidates:
            key = sorted(candidates)[0]
            name = os.path.basename(key)
            local = download_file(name, suffix=".xlsx")
            if local and os.path.exists(local):
                print(f"[seed] discovered + pulled weights workbook {name!r} from S3.")
                return local
    except Exception as e:  # noqa: BLE001
        print(f"[seed] could not discover a weights workbook in S3: {e}")
    return None


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

    # Resolve the workbook. In the cloud the uploads live in S3, not on the
    # container disk, so fall back to downloading uploads/<basename> from S3.
    if not os.path.exists(workbook):
        resolved = _resolve_workbook_from_s3(workbook)
        if resolved:
            workbook = resolved
        else:
            print(f"Workbook not found locally or in S3: {workbook} — "
                  "seed skipped (upload via the app to populate).")
            return

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
