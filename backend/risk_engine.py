"""
Risk Analysis Engine for the Aapryl Clone Tool.

Replicates the Risk Sheet workbook (Scenario Analysis + Marginal Contribution
+ V-vs-G regime split) on top of manager and factor returns already loaded
by the clone tool.

Key methodology:
- Missing manager monthly returns are filled with the manager's static clone
  return (per Aapryl paper methodology).
- Value-Tilted benchmark = 0.85*Core + 0.15*Value
- Growth-Tilted benchmark = 0.85*Core + 0.15*Growth
- Inflation-Sensitive benchmark = 0.85*Core + 0.07*Financials + 0.04*Materials
  + 0.04*Energy (EAFE and ACWI peer groups only for now)
- Marginal contribution: shift one manager weight by +1%, rebalance the
  remainder proportionally, recompute tracking error and downside deviation
  against the Core benchmark. Δ% = (perturbed - base) / base.
- Regime split: last 60 months, classify by sign of (Value-Tilted minus
  Growth-Tilted), report avg raw return and conditional excess-return
  stddev for Current and Proposed in each regime.
"""
import numpy as np
import pandas as pd


# ── Benchmark mapping per peer group ──────────────────────────────────────
PEER_BENCHMARKS = {
    'EAFE': {
        'core':   'MSCI EAFE NR USD',
        'value':  'MSCI EAFE Value NR USD',
        'growth': 'MSCI EAFE Growth NR USD',
        'infl_sectors': ('EAFE Financials', 'EAFE Materials', 'EAFE Energy'),
    },
    'EAFE_SC': {
        'core':   'MSCI EAFE Small Cap NR USD',
        'value':  'MSCI EAFE Small Value NR USD',
        'growth': 'MSCI EAFE Small Growth NR USD',
        'infl_sectors': None,  # small-cap sector indices not available
    },
    'ACWI': {
        'core':   'MSCI ACWI NR USD',
        'value':  'MSCI ACWI Value NR USD',
        'growth': 'MSCI ACWI Growth NR USD',
        'infl_sectors': ('ACWI Financials', 'ACWI Materials', 'ACWI Energy'),
    },
    'US': {
        'core':   'Russell 1000 TR USD',
        'value':  'Russell 1000 Pure Value TR USD',
        'growth': 'Russell 1000 Pure Growth TR USD',
        'infl_sectors': None,
    },
    'USSC': {
        'core':   'Russell 2000 TR USD',
        'value':  'Russell 2000 Pure Value TR USD',
        'growth': 'Russell 2000 Pure Growth TR USD',
        'infl_sectors': None,
    },
    'EM': {
        'core':   'MSCI EM NR USD',
        'value':  'MSCI EM Value NR USD',
        'growth': 'MSCI EM Growth NR USD',
        'infl_sectors': None,
    },
    'ISC': {
        'core':   'MSCI ACWI Ex USA Small NR USD',
        'value':  'MSCI ACWI Ex USA Small Value NR USD',
        'growth': 'MSCI ACWI Ex USA Small Growth NR USD',
        'infl_sectors': None,
    },
}

# Temporary per-client benchmark override. Will be replaced once the weights
# file carries an explicit benchmark column.
CLIENT_BENCHMARK_OVERRIDE = {
    'Client 1': 'EAFE_SC',
    'Client 2': 'EAFE',
    'Client 3': 'ACWI',  # MSCI World — global multi-peer portfolio
}

TILT_CORE, TILT_STYLE = 0.85, 0.15
INFL_W = {'core': 0.85, 'fin': 0.07, 'mat': 0.04, 'energy': 0.04}
MARGIN_SHIFT = 0.01  # +1% perturbation for marginal contribution
REGIME_N_MONTHS = 60
CAPTURE_N_MONTHS = 60   # trailing window for upside/downside capture (matches Excel)
MAX_WINDOW_MONTHS = 150 # hard cap on the full analysis window (matches Excel)


# ── Helpers ───────────────────────────────────────────────────────────────
def _safe(v):
    """Return float or None for JSON serialization. NaN -> None."""
    if v is None:
        return None
    try:
        f = float(v)
        if np.isnan(f) or np.isinf(f):
            return None
        return f
    except (TypeError, ValueError):
        return None


def _pct(v):
    """Wrap _safe but keep numbers on a percent scale (multiply by 100 for ratios)."""
    s = _safe(v)
    return None if s is None else round(s * 100, 4)


# ── Return matrix construction ────────────────────────────────────────────
def build_return_matrix(managers, clone_results):
    """
    managers: list of dicts with keys 'matched_name', 'tab'.
    clone_results: nested dict [tab][mgr_name] -> {dates, manager_returns, static_clone_full}.

    Returns DataFrame indexed by monthly date (descending), one column per
    manager. Missing manager returns are filled with the manager's static clone
    return (matches the Excel workbook's external-lookup behavior). If both are
    missing (should be rare — only pre-clone-buildup months), the cell stays NaN.
    """
    series_list = []
    for m in managers:
        tab = m['tab']
        name = m['matched_name']
        d = clone_results.get(tab, {}).get(name, {})
        dates = d.get('dates') or []
        mgr = d.get('manager_returns') or []
        clone = d.get('static_clone_full') or []
        n = min(len(dates), len(mgr), len(clone))
        if n == 0:
            continue
        filled = []
        for i in range(n):
            mv = mgr[i]
            cv = clone[i]
            v = mv
            if v is None or (isinstance(v, float) and np.isnan(v)):
                v = cv
            if v is None or (isinstance(v, float) and np.isnan(v)):
                filled.append(np.nan)
            else:
                filled.append(float(v))
        idx = pd.DatetimeIndex(pd.to_datetime(dates[:n]))
        s = pd.Series(filled, index=idx, name=name, dtype=float)
        s = s[~s.index.duplicated(keep='first')]
        series_list.append(s)
    if not series_list:
        return pd.DataFrame()
    df = pd.concat(series_list, axis=1)
    return df.sort_index(ascending=False)


def trim_to_common_overlap(return_matrix, weights_dict):
    """Keep only months where every manager with weight>0 has a (manager or clone)
    return. Needed after clone-fill because pre-clone-buildup months may still
    be NaN for some managers.
    """
    active_cols = [c for c in return_matrix.columns if (weights_dict.get(c, 0) or 0) > 0]
    if not active_cols:
        return return_matrix.copy()
    sub = return_matrix[active_cols]
    mask = ~sub.isna().any(axis=1)
    return return_matrix.loc[mask]


def extend_with_beta_replication(return_matrix, managers, clone_results, factor_df):
    """Fill remaining NaN cells using the manager's static-clone betas × factor
    returns. For pre-inception months where neither actual nor in-sample clone
    returns exist, this reconstructs what the manager's style would have earned
    if it had existed — matches the Excel workbook's backfill behavior.
    """
    result = return_matrix.copy()
    for m in managers:
        name = m['matched_name']
        if name not in result.columns:
            continue
        d = clone_results.get(m['tab'], {}).get(name, {})
        betas = d.get('betas_full') or {}
        if not betas:
            continue
        # Only use factor columns that exist in factor_df
        cols = [f for f in betas if f in factor_df.columns]
        if not cols:
            continue
        w = np.array([betas[f] for f in cols], dtype=float)
        factor_rows = factor_df.reindex(result.index)[cols]
        extended = factor_rows.dot(w)  # Series indexed same as result
        # Only fill where the current cell is NaN
        mask = result[name].isna()
        result.loc[mask, name] = extended[mask].astype(float)
    return result


# ── Benchmark series construction ─────────────────────────────────────────
def build_benchmark_series(peer_group, factor_df, date_index):
    """Return a DataFrame aligned to date_index with columns:
    core, value_tilted, growth_tilted, infl_sensitive.
    infl_sensitive column is all-NaN when peer group doesn't support it
    or when sector columns are missing from the factor file.
    """
    bm = PEER_BENCHMARKS.get(peer_group)
    if bm is None:
        return None
    if not all(k in factor_df.columns for k in [bm['core'], bm['value'], bm['growth']]):
        return None

    core = factor_df[bm['core']]
    value = factor_df[bm['value']]
    growth = factor_df[bm['growth']]

    out = pd.DataFrame(index=factor_df.index)
    out['core'] = core
    out['value_tilted'] = TILT_CORE * core + TILT_STYLE * value
    out['growth_tilted'] = TILT_CORE * core + TILT_STYLE * growth

    if bm['infl_sectors'] and all(s in factor_df.columns for s in bm['infl_sectors']):
        fin_col, mat_col, energy_col = bm['infl_sectors']
        out['infl_sensitive'] = (
            INFL_W['core']  * core +
            INFL_W['fin']   * factor_df[fin_col] +
            INFL_W['mat']   * factor_df[mat_col] +
            INFL_W['energy']* factor_df[energy_col]
        )
    else:
        out['infl_sensitive'] = np.nan

    return out.reindex(date_index)


# ── Portfolio returns ─────────────────────────────────────────────────────
def portfolio_return_series(return_matrix, weights_dict):
    """Row-wise weighted sum of return_matrix by weights_dict.
    For each row, weights are rescaled over managers that reported that
    month — so a single missing manager in March 2011 doesn't zero out
    the whole month.
    Returns pd.Series aligned to return_matrix.index.
    """
    cols = [c for c in return_matrix.columns if weights_dict.get(c, 0) > 0]
    if not cols:
        return pd.Series(np.nan, index=return_matrix.index)

    w0 = np.array([weights_dict[c] for c in cols], dtype=float)
    w0 = w0 / w0.sum()

    sub = return_matrix[cols].values  # rows = dates, cols = managers
    mask = ~np.isnan(sub)

    # Tile weights across rows, zero out missing columns per row, renormalize.
    W = np.tile(w0, (sub.shape[0], 1))
    W = np.where(mask, W, 0.0)
    row_sum = W.sum(axis=1)
    with np.errstate(divide='ignore', invalid='ignore'):
        W = np.where(row_sum[:, None] > 0, W / row_sum[:, None], 0.0)

    filled = np.where(mask, sub, 0.0)
    rets = (filled * W).sum(axis=1)
    rets[row_sum == 0] = np.nan
    return pd.Series(rets, index=return_matrix.index, dtype=float)


# ── Core statistics ───────────────────────────────────────────────────────
def annualized_return(rets):
    r = rets.dropna()
    if len(r) == 0:
        return np.nan
    total = float((1.0 + r).prod() - 1.0)
    return (1.0 + total) ** (12.0 / len(r)) - 1.0


def max_drawdown(rets):
    """Max drawdown as a positive number on the raw portfolio return series."""
    r = rets.dropna().sort_index(ascending=True)
    if len(r) == 0:
        return np.nan
    nav = (1.0 + r).cumprod()
    peak = nav.cummax()
    dd = (nav / peak) - 1.0
    return float(abs(dd.min()))


def downside_deviation(rets, threshold=0.0):
    """Annualized downside deviation.
    SQRT(sum(min(r-threshold, 0)^2) / N) * SQRT(12).
    N is total observation count, matching the convention of the original sheet.
    """
    r = rets.dropna()
    if len(r) == 0:
        return np.nan
    below = (r - threshold).clip(upper=0.0)
    return float(np.sqrt((below ** 2).sum() / len(r)) * np.sqrt(12))


def upside_capture(port_rets, bench_rets):
    df = pd.concat([port_rets.rename('p'), bench_rets.rename('b')], axis=1).dropna()
    up = df[df['b'] > 0]
    if len(up) == 0:
        return np.nan
    pa = annualized_return(up['p'])
    ba = annualized_return(up['b'])
    if ba is None or np.isnan(ba) or ba == 0:
        return np.nan
    return pa / ba * 100.0


def downside_capture(port_rets, bench_rets):
    df = pd.concat([port_rets.rename('p'), bench_rets.rename('b')], axis=1).dropna()
    dn = df[df['b'] < 0]
    if len(dn) == 0:
        return np.nan
    pa = annualized_return(dn['p'])
    ba = annualized_return(dn['b'])
    if ba is None or np.isnan(ba) or ba == 0:
        return np.nan
    return pa / ba * 100.0


def tracking_error(port_rets, bench_rets):
    df = pd.concat([port_rets.rename('p'), bench_rets.rename('b')], axis=1).dropna()
    if len(df) < 2:
        return np.nan
    excess = df['p'] - df['b']
    return float(excess.std(ddof=1) * np.sqrt(12))


def beta(port_rets, bench_rets):
    df = pd.concat([port_rets.rename('p'), bench_rets.rename('b')], axis=1).dropna()
    if len(df) < 2:
        return np.nan
    var_b = df['b'].var(ddof=1)
    if var_b == 0 or np.isnan(var_b):
        return np.nan
    cov = df[['p', 'b']].cov().iloc[0, 1]
    return float(cov / var_b)


# ── Scenario analysis ─────────────────────────────────────────────────────
def scenario_metrics_for_portfolio(port_rets_full, bench_df_full,
                                   port_rets_capture=None, bench_df_capture=None):
    """Metrics vs each benchmark.
    TE, Beta and Max Drawdown use the full window (port_rets_full, bench_df_full).
    Upside / Downside Capture use the trailing-capture window (port_rets_capture,
    bench_df_capture). If capture series are not provided, full window is used.
    """
    if port_rets_capture is None: port_rets_capture = port_rets_full
    if bench_df_capture is None:  bench_df_capture  = bench_df_full

    bench_cols = ['core', 'value_tilted', 'growth_tilted', 'infl_sensitive']
    out = {'max_drawdown': _safe(max_drawdown(port_rets_full))}
    for col in bench_cols:
        b_full = bench_df_full[col]    if col in bench_df_full.columns    else None
        b_cap  = bench_df_capture[col] if col in bench_df_capture.columns else None
        if b_full is None or b_full.isna().all():
            out[col] = None
            continue
        out[col] = {
            'upside_capture':   _safe(upside_capture(port_rets_capture, b_cap)),
            'downside_capture': _safe(downside_capture(port_rets_capture, b_cap)),
            'tracking_error':   _safe(tracking_error(port_rets_full, b_full)),
            'beta':             _safe(beta(port_rets_full, b_full)),
        }
    return out


# ── Marginal contribution ─────────────────────────────────────────────────
def _perturb_weights(weights_dict, target_name, shift=MARGIN_SHIFT):
    """Add `shift` to target, scale all others down proportionally so total is
    preserved. Managers with zero weight stay at zero.
    Returns new weights dict, or None if the perturbation is infeasible
    (e.g., target has 100% of weight).
    """
    total = sum(w for w in weights_dict.values() if w > 0)
    target_w = weights_dict.get(target_name, 0)
    others_sum = total - target_w
    if others_sum <= 0:
        return None
    factor = 1.0 - (shift / others_sum)
    new = {}
    for n, w in weights_dict.items():
        if n == target_name:
            new[n] = w + shift
        elif w > 0:
            new[n] = w * factor
        else:
            new[n] = 0.0
    return new


def marginal_contribution(return_matrix, weights_dict, core_bench):
    """
    Returns (rows, base_te, base_dd).
    rows = [{'name', 'base_weight', 'te_new', 'te_delta_pct', 'dd_new', 'dd_delta_pct'}]
    base_te = annualized tracking error of base portfolio vs core_bench
    base_dd = annualized downside deviation of base excess returns
    """
    base_rets = portfolio_return_series(return_matrix, weights_dict)
    base_excess = (base_rets - core_bench).dropna()
    base_te = float(base_excess.std(ddof=1) * np.sqrt(12)) if len(base_excess) > 1 else np.nan
    base_dd = downside_deviation(base_excess)

    rows = []
    # Iterate managers in a stable order — the matrix column order.
    for name in return_matrix.columns:
        w = weights_dict.get(name, 0) or 0
        if w <= 0:
            continue
        perturbed = _perturb_weights(weights_dict, name)
        if perturbed is None:
            continue
        p_rets = portfolio_return_series(return_matrix, perturbed)
        p_excess = (p_rets - core_bench).dropna()
        p_te = float(p_excess.std(ddof=1) * np.sqrt(12)) if len(p_excess) > 1 else np.nan
        p_dd = downside_deviation(p_excess)

        te_delta = (p_te - base_te) / base_te if (base_te and not np.isnan(base_te) and base_te != 0) else np.nan
        dd_delta = (p_dd - base_dd) / base_dd if (base_dd and not np.isnan(base_dd) and base_dd != 0) else np.nan

        rows.append({
            'name': name,
            'base_weight':   _safe(w),
            'te_new':        _safe(p_te),
            'te_delta_pct':  _safe(te_delta),
            'dd_new':        _safe(p_dd),
            'dd_delta_pct':  _safe(dd_delta),
        })
    return rows, _safe(base_te), _safe(base_dd)


# ── Regime analysis (last 60 months) ──────────────────────────────────────
def regime_analysis(current_rets, proposed_rets, bench_df, n_months=REGIME_N_MONTHS):
    """Split the last n_months by sign of (Value-Tilted - Growth-Tilted).
    For each regime, report:
      - average raw return of Current and Proposed portfolios
      - "downside dev" column (kept as conditional excess-return stddev to
        match the original sheet's formula despite the label)
    Excess returns are computed vs the core benchmark.
    """
    vt = bench_df.get('value_tilted')
    gt = bench_df.get('growth_tilted')
    core = bench_df.get('core')
    if vt is None or gt is None or core is None:
        return {'value_outperform': None, 'growth_outperform': None}

    # Take the most recent n_months worth of data that has all the needed series
    frame = pd.concat([
        (vt - gt).rename('delta'),
        current_rets.rename('cur'),
        proposed_rets.rename('prop'),
        (current_rets - core).rename('cur_excess'),
        (proposed_rets - core).rename('prop_excess'),
    ], axis=1).dropna()
    frame = frame.sort_index(ascending=False).iloc[:n_months]

    def block(mask):
        n = int(mask.sum())
        if n == 0:
            return {'n_months': 0, 'current': None, 'proposed': None}
        def pair(rr_col, ex_col):
            rr = frame.loc[mask, rr_col]
            ex = frame.loc[mask, ex_col]
            avg = float(rr.mean()) if n >= 1 else np.nan
            dd  = float(ex.std(ddof=1) * np.sqrt(12)) if n >= 2 else np.nan
            return {'avg_return': _safe(avg), 'downside_dev': _safe(dd)}
        return {
            'n_months': n,
            'current':  pair('cur',  'cur_excess'),
            'proposed': pair('prop', 'prop_excess'),
        }

    return {
        'value_outperform':  block(frame['delta'] > 0),
        'growth_outperform': block(frame['delta'] < 0),
    }


# ── Main entry point ──────────────────────────────────────────────────────
def dominant_peer_group(managers):
    """Weighted majority peer group across the portfolio.
    Uses current_weight if non-zero, else proposed_weight, else equal vote.
    """
    counts = {}
    for m in managers:
        tab = m.get('tab')
        if not tab:
            continue
        w = m.get('current_weight', 0) or m.get('proposed_weight', 0) or 1
        counts[tab] = counts.get(tab, 0) + w
    if not counts:
        return None
    return max(counts, key=counts.get)


def compute_risk_analysis(managers, clone_results, factor_df,
                          client_name=None, peer_benchmark=None):
    """
    managers: list of {matched_name, tab, current_weight, proposed_weight}
              (the output of build_portfolio_view's 'managers' field, possibly
              with user-edited proposed weights).
    clone_results: state['clone_results'] nested dict.
    factor_df: state['factor_df'] DataFrame.
    client_name: if provided, used to look up CLIENT_BENCHMARK_OVERRIDE.
    peer_benchmark: explicit peer group key to use (overrides everything else).

    Returns a dict ready to JSON-serialize.
    """
    if not managers:
        return {'error': 'No managers in portfolio'}

    # Resolve which benchmark family to use:
    # 1) Explicit peer_benchmark arg > 2) client name override > 3) dominant peer group
    if peer_benchmark and peer_benchmark in PEER_BENCHMARKS:
        peer_group = peer_benchmark
    elif client_name and client_name in CLIENT_BENCHMARK_OVERRIDE:
        peer_group = CLIENT_BENCHMARK_OVERRIDE[client_name]
    else:
        peer_group = dominant_peer_group(managers)
    if peer_group is None or peer_group not in PEER_BENCHMARKS:
        return {'error': f'Could not resolve benchmark family (peer_group={peer_group})'}

    # Build raw return matrix (manager returns filled with in-sample clone returns)
    return_matrix = build_return_matrix(managers, clone_results)
    if return_matrix.empty:
        return {'error': 'No return data for portfolio managers'}

    # Reindex to the most recent MAX_WINDOW_MONTHS months of factor_df. Anything
    # before that (or where managers have NaN) will be backfilled next.
    target_index = factor_df.index[:MAX_WINDOW_MONTHS]
    return_matrix = return_matrix.reindex(target_index)

    # Backfill pre-inception NaNs with beta × factor returns (matches Excel)
    return_matrix = extend_with_beta_replication(return_matrix, managers,
                                                  clone_results, factor_df)

    # Common-overlap window: keep only months where all active managers
    # (weight > 0 in either current or proposed) have real returns.
    current_weights  = {m['matched_name']: m.get('current_weight', 0) or 0 for m in managers}
    proposed_weights = {m['matched_name']: m.get('proposed_weight', 0) or 0 for m in managers}
    union_weights    = {name: max(current_weights.get(name, 0), proposed_weights.get(name, 0))
                        for name in set(list(current_weights) + list(proposed_weights))}
    return_matrix = trim_to_common_overlap(return_matrix, union_weights)
    if return_matrix.empty:
        return {'error': 'No overlapping months across all active managers'}
    # Cap at MAX_WINDOW_MONTHS (should already be ≤ this, but be safe)
    return_matrix = return_matrix.iloc[:MAX_WINDOW_MONTHS]

    # Build benchmark series, aligned to the trimmed matrix index
    bench_df_full = build_benchmark_series(peer_group, factor_df, return_matrix.index)
    if bench_df_full is None:
        return {'error': f'Benchmark series unavailable for {peer_group} — check factor file'}
    # Also require the core benchmark to exist for every overlap month
    valid_mask = ~bench_df_full['core'].isna()
    return_matrix = return_matrix.loc[return_matrix.index.isin(bench_df_full.index[valid_mask])]
    bench_df_full = bench_df_full.loc[return_matrix.index]

    # Full-window portfolio returns
    current_rets_full  = portfolio_return_series(return_matrix, current_weights)
    proposed_rets_full = portfolio_return_series(return_matrix, proposed_weights)

    # Trailing-60-month slice for capture ratios and regime
    cap_matrix      = return_matrix.iloc[:CAPTURE_N_MONTHS]
    cap_bench_df    = bench_df_full.iloc[:CAPTURE_N_MONTHS]
    current_rets_c  = current_rets_full.iloc[:CAPTURE_N_MONTHS]
    proposed_rets_c = proposed_rets_full.iloc[:CAPTURE_N_MONTHS]

    # Scenario analysis (per-benchmark metrics)
    scenario = {
        'current':  scenario_metrics_for_portfolio(current_rets_full,  bench_df_full,
                                                    current_rets_c,    cap_bench_df),
        'proposed': scenario_metrics_for_portfolio(proposed_rets_full, bench_df_full,
                                                    proposed_rets_c,   cap_bench_df),
    }

    # Marginal contribution against Core benchmark (full window)
    core_bench_full = bench_df_full['core']
    mc_cur_rows,  base_te_cur,  base_dd_cur  = marginal_contribution(return_matrix, current_weights,  core_bench_full)
    mc_prop_rows, base_te_prop, base_dd_prop = marginal_contribution(return_matrix, proposed_weights, core_bench_full)

    marginal = {
        'current':  {'base_te': base_te_cur,  'base_dd': base_dd_cur,  'managers': mc_cur_rows},
        'proposed': {'base_te': base_te_prop, 'base_dd': base_dd_prop, 'managers': mc_prop_rows},
    }

    # Regime analysis (trailing 60 months of the common-overlap window)
    regime = regime_analysis(current_rets_full, proposed_rets_full, bench_df_full,
                             n_months=REGIME_N_MONTHS)

    cur_clean = current_rets_full.dropna()
    start = cur_clean.index.min().strftime('%Y-%m-%d') if not cur_clean.empty else None
    end   = cur_clean.index.max().strftime('%Y-%m-%d') if not cur_clean.empty else None
    has_infl = not bench_df_full['infl_sensitive'].isna().all()

    bm = PEER_BENCHMARKS[peer_group]
    return {
        'peer_group':   peer_group,
        'n_months':     int(cur_clean.shape[0]),
        'n_capture':    int(min(CAPTURE_N_MONTHS, cur_clean.shape[0])),
        'start_date':   start,
        'end_date':     end,
        'has_infl':     bool(has_infl),
        'benchmarks':   {
            'core':           bm['core'],
            'value_tilted':   f"85% {bm['core']} + 15% {bm['value']}",
            'growth_tilted':  f"85% {bm['core']} + 15% {bm['growth']}",
            'infl_sensitive': (f"85% {bm['core']} + 7% Fin + 4% Mat + 4% Energy"
                               if has_infl else None),
        },
        'scenario':     scenario,
        'marginal':     marginal,
        'regime':       regime,
    }
