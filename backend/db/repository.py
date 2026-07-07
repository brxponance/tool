"""Data-access layer for client management.

The read function `load_weights_from_db()` returns the SAME 2-tuple shape as
data_loader.load_weights():

    (weights, benchmarks)
    weights    = {client_name: {manager_name: weight}}
    benchmarks = {client_name: benchmark_str or None}

so app.py can populate state['weights'] / state['client_benchmarks'] from the
DB with zero downstream changes.

The write functions back the Phase-3 CRUD endpoints. All raise ValueError on
domain errors (duplicate name, unknown client, etc.) so the route layer can
translate them into 400/404 responses.
"""
from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.orm import Session

from .models import Client, ClientManager
from .session import session_scope


# ── Reads ────────────────────────────────────────────────────────────────
def load_weights_from_db() -> tuple[dict[str, dict[str, float]], dict[str, str | None]]:
    """Load all clients into the (weights, benchmarks) shape used by app state.

    Client insertion order is by name-ascending id (creation order) so the
    switcher list is stable across restarts.
    """
    weights: dict[str, dict[str, float]] = {}
    benchmarks: dict[str, str | None] = {}
    with session_scope() as s:
        clients = s.scalars(select(Client).order_by(Client.id)).all()
        for c in clients:
            weights[c.name] = c.to_weight_map()
            benchmarks[c.name] = c.benchmark
    return weights, benchmarks


def count_clients() -> int:
    with session_scope() as s:
        return s.query(Client).count()


def _get_client(s: Session, name: str) -> Client:
    client = s.scalar(select(Client).where(Client.name == name))
    if client is None:
        raise ValueError(f"Client not found: {name!r}")
    return client


# ── Client CRUD ──────────────────────────────────────────────────────────
def create_client(
    name: str,
    benchmark: str | None = None,
    managers: list[dict] | None = None,
) -> None:
    """Create a client. `managers` is an optional list of
    {"manager_name": str, "weight": float} dicts in display order."""
    name = (name or "").strip()
    if not name:
        raise ValueError("Client name is required.")
    with session_scope() as s:
        if s.scalar(select(Client).where(Client.name == name)):
            raise ValueError(f"A client named {name!r} already exists.")
        client = Client(name=name, benchmark=_clean_benchmark(benchmark))
        for pos, m in enumerate(managers or []):
            client.managers.append(_build_manager(m, pos))
        s.add(client)


def update_client(
    name: str,
    new_name: str | None = None,
    benchmark: str | None = None,
    benchmark_provided: bool = False,
) -> None:
    """Rename a client and/or change its benchmark.

    `benchmark_provided` distinguishes "set benchmark to null" from "leave
    benchmark unchanged" (since None is a valid target value).
    """
    with session_scope() as s:
        client = _get_client(s, name)
        if new_name is not None:
            new_name = new_name.strip()
            if not new_name:
                raise ValueError("Client name cannot be empty.")
            if new_name != client.name and s.scalar(
                select(Client).where(Client.name == new_name)
            ):
                raise ValueError(f"A client named {new_name!r} already exists.")
            client.name = new_name
        if benchmark_provided:
            client.benchmark = _clean_benchmark(benchmark)


def delete_client(name: str) -> None:
    with session_scope() as s:
        client = _get_client(s, name)
        s.delete(client)  # cascade removes client_managers


# ── Manager CRUD (within a client) ───────────────────────────────────────
def add_manager(client_name: str, manager_name: str, weight: float = 0.0) -> None:
    manager_name = (manager_name or "").strip()
    if not manager_name:
        raise ValueError("Manager name is required.")
    with session_scope() as s:
        client = _get_client(s, client_name)
        if any(m.manager_name == manager_name for m in client.managers):
            raise ValueError(
                f"{manager_name!r} is already in {client_name!r}."
            )
        next_pos = max((m.position for m in client.managers), default=-1) + 1
        client.managers.append(
            ClientManager(
                manager_name=manager_name,
                current_weight=float(weight or 0.0),
                position=next_pos,
            )
        )


def set_manager_weight(client_name: str, manager_name: str, weight: float) -> None:
    with session_scope() as s:
        client = _get_client(s, client_name)
        for m in client.managers:
            if m.manager_name == manager_name:
                m.current_weight = float(weight or 0.0)
                return
        raise ValueError(f"{manager_name!r} is not in {client_name!r}.")


def remove_manager(client_name: str, manager_name: str) -> None:
    with session_scope() as s:
        client = _get_client(s, client_name)
        for m in list(client.managers):
            if m.manager_name == manager_name:
                client.managers.remove(m)
                return
        raise ValueError(f"{manager_name!r} is not in {client_name!r}.")


def save_client_portfolio(client_name: str, managers: list[dict]) -> None:
    """Persist a client's full edited portfolio (the 'Save' action).

    Replaces the client's entire manager list so add/remove, weight edits, and
    placeholder style-bucket edits all persist together. `managers` is a list,
    in display order, of dicts with any of:
        manager_name    (required)
        current_weight  (fraction, 0-1)   — also accepts legacy key "weight"
        proposed_weight (fraction, 0-1)
        style_buckets   ({bucket: fraction} | null)
    """
    with session_scope() as s:
        client = _get_client(s, client_name)
        client.managers.clear()  # orphan-delete marks the old rows for deletion
        # Flush the deletes BEFORE inserting so re-adding a manager with the
        # same name doesn't collide with the not-yet-deleted old row on the
        # (client_id, manager_name) unique constraint.
        s.flush()
        for pos, m in enumerate(managers or []):
            client.managers.append(_build_manager(m, pos))


# Backwards-compatible alias (older name).
replace_client_managers = save_client_portfolio


def _build_manager(m: dict, position: int) -> ClientManager:
    """Construct a ClientManager row from an input dict, tolerating both the
    legacy 'weight' key and the explicit 'current_weight' key."""
    name = str(m.get("manager_name") or "").strip()
    current = m.get("current_weight")
    if current is None:
        current = m.get("weight")  # legacy / seed key
    return ClientManager(
        manager_name=name,
        current_weight=float(current or 0.0),
        proposed_weight=float(m.get("proposed_weight") or 0.0),
        style_buckets=_clean_buckets(m.get("style_buckets")),
        position=position,
    )


def _clean_buckets(buckets) -> dict | None:
    """Normalize a style-buckets dict to {str: float>0}; None/empty → None."""
    if not buckets or not isinstance(buckets, dict):
        return None
    clean: dict[str, float] = {}
    for k, v in buckets.items():
        try:
            f = float(v)
        except (TypeError, ValueError):
            continue
        if f > 0:
            clean[str(k)] = f
    return clean or None


# ── Bulk import (Excel / seed) ───────────────────────────────────────────
def upsert_from_weight_maps(
    weights: dict[str, dict[str, float]],
    benchmarks: dict[str, str | None] | None = None,
) -> dict[str, int]:
    """Insert-or-update clients from the (weights, benchmarks) shape.

    Used by the seed script and by the Excel importer. For each client:
      - create it if new
      - otherwise update its benchmark and REPLACE its manager list to match
        the workbook (the workbook is authoritative for an import).

    Returns {"created": n, "updated": m}.
    """
    benchmarks = benchmarks or {}
    created = updated = 0
    with session_scope() as s:
        for cname, mgr_map in weights.items():
            cname = (cname or "").strip()
            if not cname:
                continue
            client = s.scalar(select(Client).where(Client.name == cname))
            if client is None:
                client = Client(name=cname)
                s.add(client)
                created += 1
            else:
                updated += 1
            client.benchmark = _clean_benchmark(benchmarks.get(cname))
            client.managers.clear()
            s.flush()  # delete old rows before re-inserting (unique constraint)
            for pos, (mname, wt) in enumerate(mgr_map.items()):
                client.managers.append(
                    ClientManager(
                        manager_name=str(mname).strip(),
                        current_weight=float(wt or 0.0),
                        position=pos,
                    )
                )
    return {"created": created, "updated": updated}


def load_client_portfolio(client_name: str) -> list[dict] | None:
    """Return the persisted per-manager state for one client, in order, or None
    if the client doesn't exist. Each item:
        {manager_name, current_weight, proposed_weight, style_buckets}
    Used by /portfolio to restore a saved draft (weights + buckets) on load.
    """
    with session_scope() as s:
        client = s.scalar(select(Client).where(Client.name == client_name))
        if client is None:
            return None
        return [
            {
                "manager_name": m.manager_name,
                "current_weight": m.current_weight,
                "proposed_weight": m.proposed_weight,
                "style_buckets": m.style_buckets or None,
            }
            for m in client.managers
        ]


def _clean_benchmark(bench: str | None) -> str | None:
    if bench is None:
        return None
    b = str(bench).strip()
    if not b or b.lower() in ("none", ""):
        return None
    return b
