"""
report_engine.py — Compute portfolio-level performance series for the Report tab.

All inputs are monthly return series (pandas Series indexed by month-end
DatetimeIndex). Outputs match the ReportMock JSON shape the frontend expects.

Computes the backtested-portfolio variant only: portfolio returns are
synthesized as Σ wᵢ·rᵢ from clone_results' manager returns + the client's
current weights. (Client's *actual* track record is not in scope — would
require a new file upload type.)
"""
from __future__ import annotations

import math
from typing import Optional

import numpy as np
import pandas as pd


# ── Period helpers ────────────────────────────────────────────────────────
def _ann_from_window(rets: pd.Series, months: int) -> Optional[float]:
    """Annualized geometric return for the trailing `months` months of `rets`.
    Returns None if there's insufficient data.

    For ≥12 months: ((1+r1)·(1+r2)·…)^(12/N) − 1
    For <12 months (MRQ): cumulative compound (not annualized).
    """
    s = rets.dropna()
    if s.empty:
        return None
    if months > 0:
        s = s.tail(months)
    if s.empty:
        return None
    total = float((1.0 + s).prod() - 1.0)
    if months >= 12 and len(s) >= 6:
        # annualize
        n = len(s)
        return (1.0 + total) ** (12.0 / n) - 1.0
    return total


def _ann_since_inception(rets: pd.Series) -> Optional[float]:
    s = rets.dropna()
    if len(s) < 12:
        return None
    total = float((1.0 + s).prod() - 1.0)
    return (1.0 + total) ** (12.0 / len(s)) - 1.0


def compute_trailing_periods(
    port_rets: pd.Series,
    bench_rets: pd.Series,
    clone_rets: Optional[pd.Series] = None,
) -> dict:
    """Returns dict with keys mrq, t1y, t3y, t5y, t10y, si. Each value is
    {port, bmk, clone?} or None when there's insufficient data.

    MRQ = most recent 3 months, cumulative (not annualized).
    1Y / 3Y / 5Y / 10Y = trailing N years, annualized.
    SI = full available history, annualized.
    """
    # Align indexes
    common = port_rets.index.intersection(bench_rets.index)
    if clone_rets is not None:
        common = common.intersection(clone_rets.index)
    pa = port_rets.reindex(common).sort_index()
    ba = bench_rets.reindex(common).sort_index()
    ca = clone_rets.reindex(common).sort_index() if clone_rets is not None else None

    def _period(p_months: int) -> Optional[dict]:
        p = _ann_from_window(pa, p_months)
        b = _ann_from_window(ba, p_months)
        if p is None or b is None:
            return None
        out = {'port': p, 'bmk': b}
        if ca is not None:
            c = _ann_from_window(ca, p_months)
            if c is not None:
                out['clone'] = c
        return out

    return {
        'mrq':  _period(3),
        't1y':  _period(12),
        't3y':  _period(36),
        't5y':  _period(60),
        't10y': _period(120),
        'si':   (lambda p=_ann_since_inception(pa),
                        b=_ann_since_inception(ba),
                        c=_ann_since_inception(ca) if ca is not None else None:
                    {'port': p, 'bmk': b,
                     **({'clone': c} if c is not None else {})}
                 if p is not None and b is not None else None)(),
    }


# ── Calendar year returns ─────────────────────────────────────────────────
def compute_calendar_years(
    port_rets: pd.Series,
    bench_rets: pd.Series,
    clone_rets: Optional[pd.Series] = None,
    n_years: int = 5,
) -> list:
    """Return list of {year, port, bmk, clone?} for the most recent
    `n_years` complete-or-partial calendar years."""
    common = port_rets.index.intersection(bench_rets.index)
    if clone_rets is not None:
        common = common.intersection(clone_rets.index)
    pa = port_rets.reindex(common).sort_index()
    ba = bench_rets.reindex(common).sort_index()
    ca = clone_rets.reindex(common).sort_index() if clone_rets is not None else None

    if pa.empty:
        return []
    pa_y = pa.groupby(pa.index.year).apply(lambda s: float((1.0 + s).prod() - 1.0))
    ba_y = ba.groupby(ba.index.year).apply(lambda s: float((1.0 + s).prod() - 1.0))
    ca_y = (ca.groupby(ca.index.year).apply(lambda s: float((1.0 + s).prod() - 1.0))
            if ca is not None else None)

    years = sorted(pa_y.index.tolist(), reverse=True)[:n_years]
    out = []
    for y in years:
        row = {'year': str(y), 'port': float(pa_y[y]), 'bmk': float(ba_y.get(y, np.nan))}
        if ca_y is not None and y in ca_y.index:
            row['clone'] = float(ca_y[y])
        if not (math.isnan(row['bmk'])):
            out.append(row)
    return out


# ── Quarterly returns ─────────────────────────────────────────────────────
def compute_quarterly_excess(
    port_rets: pd.Series,
    bench_rets: pd.Series,
    clone_rets: Optional[pd.Series] = None,
    n_quarters: int = 20,
) -> list:
    """Return list of {qtr: 'Qn YYYY', port, bmk, clone?} for the most recent
    `n_quarters`. Each quarter is the compound return Jan-Mar / Apr-Jun /
    Jul-Sep / Oct-Dec."""
    common = port_rets.index.intersection(bench_rets.index)
    if clone_rets is not None:
        common = common.intersection(clone_rets.index)
    pa = port_rets.reindex(common).sort_index()
    ba = bench_rets.reindex(common).sort_index()
    ca = clone_rets.reindex(common).sort_index() if clone_rets is not None else None

    if pa.empty:
        return []

    def _quarterize(s: pd.Series) -> pd.Series:
        # Group by (year, quarter) and compound returns within each quarter.
        return s.groupby([s.index.year, s.index.quarter]).apply(
            lambda chunk: float((1.0 + chunk).prod() - 1.0)
        )

    pq = _quarterize(pa)
    bq = _quarterize(ba)
    cq = _quarterize(ca) if ca is not None else None

    # Index is MultiIndex (year, quarter). Sort descending and take n_quarters.
    keys = sorted(pq.index.tolist(), key=lambda k: (k[0], k[1]), reverse=True)[:n_quarters]
    out = []
    for (y, q) in keys:
        row = {'qtr': f'Q{q} {y}', 'port': float(pq[(y, q)])}
        if (y, q) in bq.index:
            row['bmk'] = float(bq[(y, q)])
            if cq is not None and (y, q) in cq.index:
                row['clone'] = float(cq[(y, q)])
            out.append(row)
    return out


# ── Inception date ────────────────────────────────────────────────────────
def find_inception_date(port_rets: pd.Series) -> Optional[str]:
    """Return the YYYY-MM-DD of the earliest non-NaN month, or None."""
    s = port_rets.dropna()
    if s.empty:
        return None
    return s.index.min().strftime('%Y-%m-%d')


# ── Factor complement: best style factor on underperformance months ──────
def compute_factor_complements(
    port_rets: pd.Series,
    bench_rets: pd.Series,
    factor_df: pd.DataFrame,
    factor_names: list,
    min_overlap: int = 12,
    category_label: str = 'Aapryl Style Factor',
) -> Optional[dict]:
    """Find the factor whose returns best offset the portfolio's underperformance
    months. Same scoring as the manager-side ideal_complement: hit rate × avg
    excess on the months where (port_rets − bench_rets) < 0.

    Returns the top factor's record {name, category, hit_rate, avg_excess,
    n_months, n_underperf_months} or None if no factor qualifies."""
    if factor_df is None or factor_df.empty or not factor_names:
        return None
    common = port_rets.index.intersection(bench_rets.index)
    if len(common) < min_overlap:
        return None
    pa = port_rets.reindex(common)
    ba = bench_rets.reindex(common)
    excess = (pa - ba).dropna()
    under_idx = excess[excess < 0].index
    n_under = int(len(under_idx))
    if n_under < min_overlap:
        return None

    best = None
    for f in factor_names:
        if f not in factor_df.columns:
            continue
        fs = factor_df[f].reindex(under_idx).dropna()
        if len(fs) < min_overlap:
            continue
        diff = fs - ba.reindex(fs.index)
        diff = diff.dropna()
        if len(diff) < min_overlap:
            continue
        hit = float((diff > 0).sum()) / float(len(diff))
        avg = float(diff.mean())
        rec = {
            'name':       f,
            'category':   category_label,
            'hit_rate':   hit,
            'avg_excess': avg,
            'n_months':   int(len(diff)),
        }
        if best is None or (rec['hit_rate'], rec['avg_excess']) > (best['hit_rate'], best['avg_excess']):
            best = rec
    if best is not None:
        best['n_underperf_months'] = n_under
    return best
