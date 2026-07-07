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

_DEFAULT_WORKBOOK = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "uploads",
    "Manager_Weights_3_31.xlsx",
)


def seed(workbook: str, force: bool = False) -> None:
    if not is_enabled():
        raise SystemExit(
            "Database is not reachable. Start it with `docker compose up -d` "
            "or set DATABASE_URL, then retry."
        )

    init_db()  # create tables if they don't exist yet

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
