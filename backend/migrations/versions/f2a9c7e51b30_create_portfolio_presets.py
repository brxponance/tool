"""create portfolio_presets

Revision ID: f2a9c7e51b30
Revises: 0a25e34ff6b9
Create Date: 2026-07-20

Adds the portfolio_presets table. The PortfolioPreset model
(db/models.py) shipped without a migration, so `alembic upgrade head` never
created the table and every /clients/<name>/presets call 500'd with
`UndefinedTable: relation "portfolio_presets" does not exist`.
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


revision: str = 'f2a9c7e51b30'
down_revision: Union[str, None] = '0a25e34ff6b9'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'portfolio_presets',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('client_id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('created_by', sa.String(length=255), nullable=True),
        sa.Column('payload', postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['client_id'], ['clients.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('client_id', 'name', name='uq_preset_client_name'),
    )
    op.create_index(
        op.f('ix_portfolio_presets_client_id'),
        'portfolio_presets',
        ['client_id'],
        unique=False,
    )


def downgrade() -> None:
    op.drop_index(op.f('ix_portfolio_presets_client_id'), table_name='portfolio_presets')
    op.drop_table('portfolio_presets')
