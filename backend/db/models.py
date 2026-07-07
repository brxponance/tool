"""SQLAlchemy models for client management.

A "client" is an editable portfolio definition: a name, a benchmark, and an
ordered list of managers with weights. This mirrors the shape that
data_loader.load_weights() produces from the weights workbook —
  weights    = {client_name: {manager_name: weight}}
  benchmarks = {client_name: benchmark_str or None}
— so the rest of the backend is unaffected by where the data comes from.

Weights are stored as fractions (0.1909 == 19.09%), exactly as parsed from
the workbook, so no conversion is needed at any boundary.
"""
from __future__ import annotations

from datetime import datetime, timezone

from sqlalchemy import (
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    UniqueConstraint,
    func,
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


class Base(DeclarativeBase):
    pass


class Client(Base):
    __tablename__ = "clients"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    # Client name is the natural key used throughout the API (e.g.
    # /portfolio/<client_name>), so it must be unique.
    name: Mapped[str] = mapped_column(String(255), nullable=False, unique=True)
    # Benchmark string is stored verbatim (e.g. "MSCI EAFE + Canada"); it is
    # intentionally NOT resolved to a peer group here — downstream consumers
    # each translate it with their own fallbacks. May be null.
    benchmark: Mapped[str | None] = mapped_column(String(255), nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), default=_utcnow
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        default=_utcnow,
        onupdate=_utcnow,
    )

    managers: Mapped[list["ClientManager"]] = relationship(
        back_populates="client",
        cascade="all, delete-orphan",
        order_by="ClientManager.position",
    )

    def to_weight_map(self) -> dict[str, float]:
        """Return {manager_name: current_weight} in stored order.

        Kept for the (weights, benchmarks) shape used at startup — this maps to
        the "current" book, which is what the analytical pipeline treats as the
        client's actual holdings.
        """
        return {m.manager_name: m.current_weight for m in self.managers}


class ClientManager(Base):
    __tablename__ = "client_managers"
    __table_args__ = (
        # A manager name appears at most once within a client.
        UniqueConstraint("client_id", "manager_name", name="uq_client_manager"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    client_id: Mapped[int] = mapped_column(
        ForeignKey("clients.id", ondelete="CASCADE"), nullable=False, index=True
    )
    # Manager name exactly as it appears in the weights workbook — the rest of
    # the pipeline fuzzy-matches this against clone/returns data, so it must be
    # preserved verbatim (including regional suffixes like "EAFE + Canada SC").
    manager_name: Mapped[str] = mapped_column(String(255), nullable=False)
    # Current (actual) weight as a fraction (0.1909 == 19.09%). This is the
    # book the analytical pipeline treats as the client's holdings.
    current_weight: Mapped[float] = mapped_column(
        "weight", Float, nullable=False, default=0.0
    )
    # Proposed (what-if) weight as a fraction. Persisted so a saved draft
    # survives a refresh. Defaults to 0.
    proposed_weight: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    # User-edited style buckets for placeholder managers (no clone data), e.g.
    # {"Core": 0.6, "Value": 0.4}. Null/empty means "use the default Core=1.0".
    style_buckets: Mapped[dict | None] = mapped_column(JSONB, nullable=True)
    # Preserves the workbook's ordering so the UI list is stable.
    position: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    client: Mapped[Client] = relationship(back_populates="managers")
