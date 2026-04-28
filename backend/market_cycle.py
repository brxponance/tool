"""
Market Cycle classification — assigns each manager to one of 18 buckets along
a 0–4 x-axis based on their style-bucket exposures and (for the defensive
reclassification) their 10-year downside capture.

Methodology (momentum excluded per current specification):

Scores:
    V_vs_G  = (Value bucket + Yield bucket) - Growth bucket
    Q_vs_D  = (Quality bucket + Defensive bucket + Low Vol bucket) - Dynamic bucket

Percentile rank each score across the universe managers in the SAME peer tab.
Buy-list managers are ranked inside that same universe (included in it for
ranking purposes; the universe file may or may not already contain them).

Initial peer group (by V-vs-G percentile):
    >= 92%      -> Aggressive Value
    67%-91%     -> Relative Value
    34%-66%     -> Core   (further split by Q-vs-D: >= median -> Core Quality, else GARP)
    9%-33%      -> Core Growth
    <= 8%       -> High Growth

Defensive reclassification (among Relative Value, Core Quality, Core Growth):
    - Rank 10yr downside capture (low = low downside deviation = more defensive)
    - Core Quality: bottom 50% -> Defensive
    - Relative Value, Core Growth: bottom 33% -> Defensive
    - Within Defensive, tercile by downside-capture percentile: bottom -> D1, etc.

Sub-bucket placement (for non-defensive-reclassified managers):
    Aggressive Value — by V-vs-G percentile:
        97.3-100%  -> Deep Value 1
        94.7-97.2% -> Deep Value 2
        92-94.6%   -> Deep Value 3
    Relative Value — by V-vs-G percentile:
        83.3-91.9% -> Relative Value 1
        74.6-83.2% -> Relative Value 2
        66-74.5%   -> Relative Value 3
    GARP / Core Quality — percentile-rank Growth bucket across all GARP+CoreQuality
        (not Defensive), split 0-33 / 34-66 / 67-100 -> GARP/Core 1, 2, 3
    Core Growth — same idea within Core Growth (non-Defensive), split by Growth bucket
    High Growth — percentile-rank Growth bucket across all High Growth, split thirds
"""
import numpy as np
import pandas as pd


# ── X-axis placement for each of the 18 buckets ───────────────────────────
BUCKET_X = {
    'Deep Value 1':      0.15,
    'Deep Value 2':      0.30,
    'Deep Value 3':      0.45,
    'Relative Value 1':  0.65,
    'Relative Value 2':  0.80,
    'Relative Value 3':  0.95,
    'GARP / Core 1':     1.20,
    'GARP / Core 2':     1.55,
    'GARP / Core 3':     1.90,
    'Core Growth 1':     2.10,
    'Core Growth 2':     2.275,
    'Core Growth 3':     2.45,
    'High Growth 1':     2.55,
    'High Growth 2':     2.75,
    'High Growth 3':     2.95,
    'Defensive 1':       3.10,
    'Defensive 2':       3.35,
    'Defensive 3':       3.60,
}


def _safe_bucket(d, key):
    """Return a bucket value from a style_buckets dict, 0 if missing."""
    try:
        v = d.get(key)
        if v is None:
            return 0.0
        f = float(v)
        return 0.0 if np.isnan(f) else f
    except (TypeError, ValueError):
        return 0.0


def compute_scores(style_buckets):
    """Given a clone_result's style_buckets dict, return (v_vs_g, q_vs_d).

    V_vs_G = (Value + Yield) - Growth       (no momentum per spec)
    Q_vs_D = (Quality + Defensive + Low Vol) - Dynamic
    """
    value    = _safe_bucket(style_buckets, 'Value')
    yield_   = _safe_bucket(style_buckets, 'Yield')
    growth   = _safe_bucket(style_buckets, 'Growth')
    quality  = _safe_bucket(style_buckets, 'Quality')
    defensive = _safe_bucket(style_buckets, 'Defensive')
    low_vol  = _safe_bucket(style_buckets, 'Low Vol')
    dynamic  = _safe_bucket(style_buckets, 'Dynamic')

    v_vs_g = (value + yield_) - growth
    q_vs_d = (quality + defensive + low_vol) - dynamic
    return v_vs_g, q_vs_d


def percentile_rank(score, universe_scores):
    """Return 0–1 percentile rank of `score` within `universe_scores` list.
    Uses the "fraction of universe strictly below" convention with a half-
    credit for ties, so the same score across multiple managers gets the
    same rank.
    """
    u = [float(s) for s in universe_scores if s is not None and not np.isnan(float(s))]
    n = len(u)
    if n == 0:
        return 0.5  # undefined — put at median
    below = sum(1 for s in u if s < score)
    equal = sum(1 for s in u if s == score)
    return (below + 0.5 * equal) / n


# ── Downside capture helper (10-year) ─────────────────────────────────────
def ten_year_downside_capture(mgr_monthly_rets, mgr_dates,
                              clone_monthly_rets, betas,
                              factor_df, core_bench_name, target_months=120):
    """Compute the manager's 10-year downside capture vs the Core benchmark
    for their peer group. Back-fills missing months with:
        1) the in-sample static clone return, failing that
        2) beta × factor replication from the stored full-model betas.
    Returns downside capture as a percentage (e.g. 95.3) or None if
    insufficient data.
    """
    if factor_df is None or core_bench_name not in factor_df.columns:
        return None

    # Build the manager return series with clone fallback
    idx = pd.DatetimeIndex(pd.to_datetime(mgr_dates))
    m_arr = np.array([np.nan if v is None else float(v) for v in mgr_monthly_rets], dtype=float)
    c_arr = np.array([np.nan if v is None else float(v) for v in clone_monthly_rets], dtype=float)
    filled = np.where(np.isnan(m_arr), c_arr, m_arr)

    mgr_series = pd.Series(filled, index=idx).sort_index(ascending=False)
    mgr_series = mgr_series[~mgr_series.index.duplicated(keep='first')]

    # Window to the most recent target_months months of factor_df
    window_idx = factor_df.index.sort_values(ascending=False)[:target_months]
    mgr_aligned = mgr_series.reindex(window_idx)

    # Back-fill remaining NaN with beta × factor
    if betas:
        cols = [f for f in betas if f in factor_df.columns]
        if cols:
            w = np.array([betas[f] for f in cols], dtype=float)
            replicated = factor_df.reindex(window_idx)[cols].dot(w)
            mgr_aligned = mgr_aligned.where(~mgr_aligned.isna(), replicated)

    bench = factor_df.reindex(window_idx)[core_bench_name]
    pair = pd.concat([mgr_aligned.rename('m'), bench.rename('b')], axis=1).dropna()
    if len(pair) < 12:
        return None

    dn = pair[pair['b'] < 0]
    if len(dn) == 0:
        return None
    # Annualized return in the down-months window
    def ann(s):
        tot = float((1.0 + s).prod() - 1.0)
        return (1.0 + tot) ** (12.0 / len(s)) - 1.0
    ba = ann(dn['b'])
    if ba == 0 or np.isnan(ba):
        return None
    pa = ann(dn['m'])
    return (pa / ba) * 100.0


# ── Main classifier ───────────────────────────────────────────────────────
def build_universe_scores(universe_clone_results, peer_tab):
    """Collect V_vs_G and Q_vs_D raw scores for every universe manager in the
    given peer tab. Returns ({name: v_vs_g}, {name: q_vs_d}).
    """
    v_scores, q_scores = {}, {}
    for name, d in universe_clone_results.get(peer_tab, {}).items():
        buckets = d.get('style_buckets') or {}
        v, q = compute_scores(buckets)
        v_scores[name] = v
        q_scores[name] = q
    return v_scores, q_scores


def classify_initial_bucket(v_pct, q_pct, core_q_median_pct):
    """Stage 1: assign main bucket based on V-vs-G percentile. Returns one of:
    'Aggressive Value', 'Relative Value', 'Core Quality', 'GARP', 'Core Growth',
    'High Growth'.
    """
    if v_pct >= 0.92:
        return 'Aggressive Value'
    if v_pct >= 0.67:
        return 'Relative Value'
    if v_pct >= 0.34:
        # Core split by Q-vs-D percentile median
        return 'Core Quality' if q_pct >= core_q_median_pct else 'GARP'
    if v_pct >= 0.09:
        return 'Core Growth'
    return 'High Growth'


def _tercile_bucket(pct_within_group, prefix):
    """Given a 0-1 rank within a group, return prefix + ' 1/2/3' by tercile.
    Convention: rank 0-1/3 -> "1" (low end), 1/3-2/3 -> "2", 2/3-1 -> "3".
    """
    if pct_within_group < 1 / 3:
        return f'{prefix} 1'
    if pct_within_group < 2 / 3:
        return f'{prefix} 2'
    return f'{prefix} 3'


def _place_aggressive_value(v_pct):
    """V_vs_G percentile >=92 split into Deep Value 1/2/3 by finer cuts."""
    if v_pct >= 0.973:
        return 'Deep Value 1'
    if v_pct >= 0.947:
        return 'Deep Value 2'
    return 'Deep Value 3'  # 0.92–0.947


def _place_relative_value(v_pct):
    """V_vs_G percentile 67–91 split into Relative Value 1/2/3."""
    if v_pct >= 0.833:
        return 'Relative Value 1'
    if v_pct >= 0.746:
        return 'Relative Value 2'
    return 'Relative Value 3'  # 0.66–0.746


def classify_peer_group(buy_list_managers, universe_clone_results,
                        factor_df, bench_map):
    """
    Main entry point. Classifies buy-list managers in a given peer tab to
    one of the 18 market-cycle buckets.

    Args:
        buy_list_managers: list of {name, tab, style_buckets, manager_returns,
            dates, static_clone_full, betas_full} — one per buy-list manager
            in this peer tab
        universe_clone_results: state['universe_clone_results'] nested dict
        factor_df: factor returns DataFrame (needed for downside capture)
        bench_map: dict {tab: core_benchmark_name}

    Returns: {mgr_name: {'bucket': '...', 'x': 0.xx, 'v_vs_g': ..., 'q_vs_d': ...,
                          'v_pct': ..., 'q_pct': ..., 'downside_capture': ...,
                          'initial_bucket': '...'}}
        Empty dict if the universe for this tab isn't available.
    """
    if not buy_list_managers:
        return {}
    peer_tab = buy_list_managers[0]['tab']
    if peer_tab not in universe_clone_results or not universe_clone_results[peer_tab]:
        return {}

    # Build universe scores
    uni_v, uni_q = build_universe_scores(universe_clone_results, peer_tab)
    uni_v_vals = list(uni_v.values())
    uni_q_vals = list(uni_q.values())

    # Ensure buy-list managers are also in the ranking universe
    # (add them if not already present in the universe file)
    for m in buy_list_managers:
        name = m['name']
        if name not in uni_v:
            v, q = compute_scores(m.get('style_buckets', {}))
            uni_v[name] = v
            uni_q[name] = q
            uni_v_vals.append(v)
            uni_q_vals.append(q)

    # Median Q-vs-D percentile within the Core universe group — used to split
    # Core into Core Quality vs GARP. Compute percentiles first, then filter.
    uni_percentiles = {}
    for name, v in uni_v.items():
        q = uni_q[name]
        vp = percentile_rank(v, uni_v_vals)
        qp = percentile_rank(q, uni_q_vals)
        uni_percentiles[name] = (vp, qp)
    core_qs = [qp for (vp, qp) in uni_percentiles.values() if 0.34 <= vp < 0.67]
    core_q_median = float(np.median(core_qs)) if core_qs else 0.5

    # Assign initial buckets to the entire universe (needed for Defensive step
    # and for sub-bucket percentile ranking within the universe Growth groups)
    uni_initial = {}
    for name, (vp, qp) in uni_percentiles.items():
        uni_initial[name] = classify_initial_bucket(vp, qp, core_q_median)

    # Compute 10-year downside capture for Defensive-eligible universe managers
    # (Relative Value, Core Quality, Core Growth) so we can percentile-rank it.
    core_bench = bench_map.get(peer_tab)
    defensive_eligible = {'Relative Value', 'Core Quality', 'Core Growth'}
    uni_dc = {}  # name -> downside capture, restricted to defensive-eligible
    for name, init in uni_initial.items():
        if init not in defensive_eligible:
            continue
        d = universe_clone_results[peer_tab].get(name)
        if not d:
            continue
        dc = ten_year_downside_capture(
            d.get('manager_returns', []),
            d.get('dates', []),
            d.get('static_clone_full', []),
            d.get('betas_full', {}),
            factor_df, core_bench
        )
        if dc is not None:
            uni_dc[name] = dc

    dc_vals = list(uni_dc.values())
    # Defensive assignments within the universe
    uni_is_defensive = {}
    for name, dc in uni_dc.items():
        init = uni_initial[name]
        dc_pct = percentile_rank(dc, dc_vals)
        if init == 'Core Quality':
            uni_is_defensive[name] = (dc_pct < 0.50, dc_pct)
        else:  # Relative Value or Core Growth
            uni_is_defensive[name] = (dc_pct < (1.0 / 3.0), dc_pct)
    # Defensive sub-bucket terciles — compute rank within defensive-only
    defensive_names = [n for n, (is_d, _) in uni_is_defensive.items() if is_d]
    defensive_dcs = [uni_dc[n] for n in defensive_names]

    # Sub-bucket percentile rank inputs. "GARP + Core Quality (non-defensive)"
    # and "Core Growth (non-defensive)" and "High Growth" are ranked by their
    # Growth bucket exposure.
    def growth_of(name, d_source):
        """Look up growth bucket for a manager — d_source maps name -> d."""
        d = d_source.get(name, {})
        return _safe_bucket(d.get('style_buckets', {}), 'Growth')

    uni_products = universe_clone_results[peer_tab]
    garp_core_universe = {
        n: growth_of(n, uni_products) for n in uni_initial
        if uni_initial[n] in ('GARP', 'Core Quality')
        and not uni_is_defensive.get(n, (False, None))[0]
    }
    core_growth_universe = {
        n: growth_of(n, uni_products) for n in uni_initial
        if uni_initial[n] == 'Core Growth'
        and not uni_is_defensive.get(n, (False, None))[0]
    }
    high_growth_universe = {
        n: growth_of(n, uni_products) for n in uni_initial
        if uni_initial[n] == 'High Growth'
    }

    # ── Now classify each buy-list manager ────────────────────────────────
    results = {}
    for m in buy_list_managers:
        name = m['name']
        v_raw, q_raw = compute_scores(m.get('style_buckets', {}))
        v_pct = uni_percentiles[name][0] if name in uni_percentiles else percentile_rank(v_raw, uni_v_vals)
        q_pct = uni_percentiles[name][1] if name in uni_percentiles else percentile_rank(q_raw, uni_q_vals)

        initial = classify_initial_bucket(v_pct, q_pct, core_q_median)

        # Check Defensive reclassification (only applies to RV, CQ, CG)
        downside_cap = None
        is_defensive = False
        if initial in defensive_eligible:
            downside_cap = ten_year_downside_capture(
                m.get('manager_returns', []),
                m.get('dates', []),
                m.get('static_clone_full', []),
                m.get('betas_full', {}),
                factor_df, core_bench
            )
            if downside_cap is not None:
                dc_pct = percentile_rank(downside_cap, dc_vals) if dc_vals else 0.5
                if initial == 'Core Quality':
                    is_defensive = dc_pct < 0.50
                else:
                    is_defensive = dc_pct < (1.0 / 3.0)

        if is_defensive:
            # Place within Defensive terciles by downside-capture rank (among
            # all defensive universe managers + this one)
            all_def_dcs = defensive_dcs + [downside_cap]
            dp = percentile_rank(downside_cap, all_def_dcs)
            bucket = _tercile_bucket(dp, 'Defensive')
        elif initial == 'Aggressive Value':
            bucket = _place_aggressive_value(v_pct)
        elif initial == 'Relative Value':
            bucket = _place_relative_value(v_pct)
        elif initial in ('GARP', 'Core Quality'):
            gr = _safe_bucket(m.get('style_buckets', {}), 'Growth')
            gp = percentile_rank(gr, list(garp_core_universe.values()) or [gr])
            bucket = _tercile_bucket(gp, 'GARP / Core')
        elif initial == 'Core Growth':
            gr = _safe_bucket(m.get('style_buckets', {}), 'Growth')
            gp = percentile_rank(gr, list(core_growth_universe.values()) or [gr])
            bucket = _tercile_bucket(gp, 'Core Growth')
        else:  # High Growth
            gr = _safe_bucket(m.get('style_buckets', {}), 'Growth')
            gp = percentile_rank(gr, list(high_growth_universe.values()) or [gr])
            bucket = _tercile_bucket(gp, 'High Growth')

        results[name] = {
            'bucket':           bucket,
            'x':                BUCKET_X.get(bucket, None),
            'initial_bucket':   initial,
            'is_defensive':     is_defensive,
            'v_vs_g':           round(v_raw, 6),
            'q_vs_d':           round(q_raw, 6),
            'v_pct':            round(v_pct, 4),
            'q_pct':            round(q_pct, 4),
            'downside_capture': round(downside_cap, 3) if downside_cap is not None else None,
        }

    return results
